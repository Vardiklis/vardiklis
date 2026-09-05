import { createHmac, timingSafeEqual } from 'node:crypto'
import { getPayload } from 'payload'
import config from '@payload-config'
import { kainos, kontaktai, nuolaidaPirmajai, svetaine } from '@/lib/kontaktai'
import {
  data as dataVilniuje,
  dataZodziais,
  momentas,
  pridekDienas,
  savaitesDiena,
} from '@/lib/laikas'
import { pastoNustatymai, pastoSiuntejas } from '@/lib/pastas'

/**
 * Automatiniai priminimai tėvams.
 *
 * KAIP TAI VEIKIA. Maršrutas `/vidus/priminimai` badomas kas 5 min. ir kaskart
 * klausia to paties: kurių artimiausių pamokų priminimo momentas jau praėjo, o
 * laiškas dar neišsiųstas? Siuntimo valanda gyvena CMS'e, tad ją pakeitus
 * cron'o liesti nereikia — kitas badymas jau skaičiuos pagal naują.
 *
 * KODĖL NE „šiandienos pamokos“. Pasirinkus „dieną prieš, vakare“, aštuntą
 * vakaro reikia žiūrėti į RYTOJAUS pamokas. Todėl visada tikrinamos dvi paros
 * (šiandien ir rytoj) — ilgesnio užbėgimo į priekį nustatymai neleidžia.
 *
 * DUKART NEIŠSIUNČIA žurnalas: įrašas kuriamas prieš siunčiant, ir kitas
 * badymas tą pačią pamoką jau randa.
 */

type Pamoka = {
  savaitesDiena?: string | null
  laikas?: string | null
  trukmeMin?: number | null
}

type Mokinys = {
  id: number
  vardas: string
  klase?: string | null
  tevoVardas?: string | null
  tevoPastas?: string | null
  meetNuoroda?: string | null
  pamokos?: Pamoka[] | null
  aktyvus?: boolean | null
  pirmaPamoka?: boolean | null
  pauzeIki?: string | null
  sutikimas?: boolean | null
  priminimoKada?: string | null
  priminimoValanda?: string | null
  raktas?: string | null
}

type Nustatymai = {
  ijungta?: boolean | null
  kada?: string | null
  valanda?: string | null
  prierasas?: string | null
  parasas?: string | null
  santraukaSau?: boolean | null
  paskutineSantrauka?: string | null
}

export type Ataskaita = {
  tikrinta: string
  issiusta: number
  nepavyko: number
  praleista: number
  santraukaIssiusta: boolean
  eilutes: string[]
}

/** Parašas žymėjimo nuorodoms laiške — kad būseną galėtų pakeisti tik jų gavėjas. */
export function zymejimoParasas(id: string, busena: string): string {
  const raktas = process.env.PAYLOAD_SECRET || ''
  return createHmac('sha256', raktas).update(`${id}:${busena}`).digest('hex').slice(0, 16)
}

export function arTeisingasParasas(id: string, busena: string, parasas: string): boolean {
  const laukiamas = Buffer.from(zymejimoParasas(id, busena))
  const gautas = Buffer.from(parasas || '')
  return laukiamas.length === gautas.length && timingSafeEqual(laukiamas, gautas)
}

/** Individualios pamokos kaina — pirmos pamokos nuolaidai laiške. */
function pirmosPamokosKaina(): { pilna: number; suNuolaida: number } | null {
  const individuali = kainos.find((k) => k.id === 'individuali')
  if (!individuali) return null
  return { pilna: individuali.eurai, suNuolaida: individuali.eurai - nuolaidaPirmajai }
}

/**
 * Parašas, kai CMS'e jis nenurodytas.
 *
 * Ne tuščia eilutė: globalo `defaultValue` galioja tik pirmą kartą kuriant
 * įrašą, o serveryje jis jau sukurtas — tad naujas laukas ten atsiranda
 * tuščias, ir be šito laiškai staiga liktų be parašo.
 */
function numatytasParasas(): string[] {
  return [
    `${kontaktai.vardas}, ${kontaktai.pareigos}`,
    kontaktai.telefonas,
    svetaine.url.replace('https://', ''),
  ]
}

function laiskasTevams(
  mokinys: Mokinys,
  dataISO: string,
  laikas: string,
  prierasas: string | null,
  parasas: string | null,
): { tema: string; tekstas: string } {
  const nuoroda = `${svetaine.url}/p/${mokinys.raktas}`
  const siandien = dataISO === dataVilniuje(new Date())

  // Tuščias CMS laukas ateina kaip `''`, o ne `null` — be šito jis praeitų pro
  // filtrą ir laiške atsirastų antra tuščia eilutė prieš parašą.
  const priedas = prierasas?.trim() || null

  const kaina = mokinys.pirmaPamoka ? pirmosPamokosKaina() : null

  const eilutes = [
    mokinys.tevoVardas ? `Sveiki, ${mokinys.tevoVardas},` : 'Sveiki,',
    '',
    `primenu: ${mokinys.vardas} matematikos pamoka ${siandien ? 'šiandien' : dataZodziais(dataISO)}, ${laikas}.`,
    '',
    `Prisijungti: ${nuoroda}`,
    '',
    kaina
      ? `Pirmajai pamokai taikoma ${nuolaidaPirmajai} € nuolaida — ${kaina.suNuolaida} € vietoj ${kaina.pilna} €.`
      : null,
    kaina ? '' : null,
    priedas,
    priedas ? '' : null,
    '—',
    // Brūkšnelis lieka kode, kad parašas visada atsiskirtų nuo teksto vienodai.
    ...(parasas?.trim() ? parasas.trim().split('\n') : numatytasParasas()),
  ].filter((e): e is string => e !== null)

  return {
    tema: `${mokinys.vardas} — pamoka ${siandien ? 'šiandien' : dataZodziais(dataISO)} ${laikas}`,
    tekstas: eilutes.join('\n'),
  }
}

/**
 * Kada šiam mokiniui turi išeiti priminimas apie `dataISO` pamoką.
 * Mokinio nustatymas nurungia bendrąjį; nenurodžius nė vieno — bendrasis.
 */
function siuntimoMomentas(mokinys: Mokinys, n: Nustatymai, dataISO: string): Date {
  const kada = mokinys.priminimoKada || n.kada || 'rytas'
  const valanda = mokinys.priminimoValanda || n.valanda || '07:30'
  const diena = kada === 'vakaras' ? pridekDienas(dataISO, -1) : dataISO
  return momentas(diena, valanda)
}

export async function siuskPriminimus(dabar = new Date()): Promise<Ataskaita> {
  const payload = await getPayload({ config })
  const ataskaita: Ataskaita = {
    tikrinta: dabar.toISOString(),
    issiusta: 0,
    nepavyko: 0,
    praleista: 0,
    santraukaIssiusta: false,
    eilutes: [],
  }

  const n = (await payload.findGlobal({
    slug: 'priminimai',
    overrideAccess: true,
  })) as Nustatymai

  if (n.ijungta === false) {
    ataskaita.eilutes.push('Siuntimas išjungtas nustatymuose.')
    return ataskaita
  }

  const pastas = pastoNustatymai()
  if (!pastas) {
    ataskaita.eilutes.push('SMTP nesukonfigūruotas — nesiunčiam.')
    return ataskaita
  }
  const siuntejas = pastoSiuntejas(pastas)

  const { docs } = await payload.find({
    collection: 'mokiniai',
    where: { aktyvus: { equals: true } },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })
  const mokiniai = docs as unknown as Mokinys[]

  const siandien = dataVilniuje(dabar)
  const kandidatai = [siandien, pridekDienas(siandien, 1)]
  const paliestosDatos = new Set<string>()

  for (const mokinys of mokiniai) {
    if (!mokinys.tevoPastas || !mokinys.meetNuoroda || !mokinys.raktas) continue
    if (mokinys.sutikimas === false) continue

    for (const dataISO of kandidatai) {
      // Pauzė galioja imtinai — atostogų paskutinę dieną priminimo dar nėra.
      if (mokinys.pauzeIki && dataISO <= dataVilniuje(new Date(mokinys.pauzeIki))) continue

      for (const pamoka of mokinys.pamokos ?? []) {
        if (!pamoka.savaitesDiena || !pamoka.laikas) continue
        if (Number(pamoka.savaitesDiena) !== savaitesDiena(dataISO)) continue

        const pradzia = momentas(dataISO, pamoka.laikas)
        const siusti = siuntimoMomentas(mokinys, n, dataISO)

        // Dar per anksti — laukiam kito badymo.
        if (dabar < siusti) continue
        // Pavėluota: pamoka jau prasidėjusi, priminimas nebereikalingas.
        // Tai kartu ir vėlavimo langas — nukritęs serveris ryto priminimą dar
        // spėja išsiųsti pietų, bet po pamokos pradžios nebesiunčia niekada.
        if (dabar > pradzia) continue

        const jau = await payload.find({
          collection: 'zurnalas',
          where: {
            and: [
              { mokinys: { equals: mokinys.id } },
              { data: { equals: dataISO } },
              { laikas: { equals: pamoka.laikas } },
            ],
          },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })

        /**
         * Įrašas be `issiusta` reiškia, kad praeitą kartą laiškas nepavyko
         * (nulūžo SMTP, dingo tinklas). Tokį bandom iš naujo, o ne praleidžiam:
         * antraip vienas nepavykęs sujungimas reikštų, kad tėvai negaus nieko,
         * ir apie tai nesužinotų niekas.
         */
        const senas = jau.docs[0] as unknown as { id: string | number; issiusta?: string | null }
        if (senas?.issiusta) {
          ataskaita.praleista++
          continue
        }

        paliestosDatos.add(dataISO)

        const irasas =
          senas ??
          (await payload.create({
            collection: 'zurnalas',
            overrideAccess: true,
            data: {
              santrauka: `${mokinys.vardas} · ${dataISO} ${pamoka.laikas}`,
              data: dataISO,
              laikas: pamoka.laikas,
              mokinys: mokinys.id,
              busena: 'suplanuota',
              pirmaPamoka: Boolean(mokinys.pirmaPamoka),
            },
          }))

        const laiskas = laiskasTevams(
          mokinys,
          dataISO,
          pamoka.laikas,
          n.prierasas ?? null,
          n.parasas ?? null,
        )
        try {
          await siuntejas.sendMail({
            from: `"${kontaktai.vardas} · ${svetaine.pavadinimas}" <${pastas.user}>`,
            to: mokinys.tevoPastas,
            replyTo: pastas.gavejas,
            subject: laiskas.tema,
            text: laiskas.tekstas,
          })
          await payload.update({
            collection: 'zurnalas',
            id: irasas.id,
            overrideAccess: true,
            // `klaida` valoma: pavykus iš antro karto senas įrašas klaidintų.
            data: { issiusta: new Date().toISOString(), klaida: null },
          })
          ataskaita.issiusta++
          ataskaita.eilutes.push(`✓ ${mokinys.vardas} ${dataISO} ${pamoka.laikas}`)
        } catch (klaida) {
          const tekstas = String(klaida).slice(0, 300)
          await payload.update({
            collection: 'zurnalas',
            id: irasas.id,
            overrideAccess: true,
            data: { klaida: tekstas },
          })
          ataskaita.nepavyko++
          ataskaita.eilutes.push(`✗ ${mokinys.vardas} ${dataISO} ${pamoka.laikas}: ${tekstas}`)
          console.error('[priminimai] laiško išsiųsti nepavyko:', klaida)
        }
      }
    }
  }

  if (n.santraukaSau !== false && paliestosDatos.size > 0 && n.paskutineSantrauka !== siandien) {
    try {
      await siuskSantrauka(payload, [...paliestosDatos], pastas, siuntejas)
      await payload.updateGlobal({
        slug: 'priminimai',
        overrideAccess: true,
        data: { paskutineSantrauka: siandien },
      })
      ataskaita.santraukaIssiusta = true
    } catch (klaida) {
      console.error('[priminimai] santraukos išsiųsti nepavyko:', klaida)
    }
  }

  return ataskaita
}

/**
 * Dienos santrauka Modestai.
 *
 * Rodo VISAS tų dienų pamokas, ne tik ką tik išsiųstas — jei mokiniai turi
 * skirtingas siuntimo valandas, ankstesnės partijos irgi turi būti sąraše.
 *
 * Prie kiekvienos — dvi nuorodos su parašu. Paspaudus, būsena keičiasi
 * neatidarant CMS; parašas neleidžia to padaryti pašaliniam, atspėjusiam id.
 */
async function siuskSantrauka(
  payload: Awaited<ReturnType<typeof getPayload>>,
  datos: string[],
  pastas: NonNullable<ReturnType<typeof pastoNustatymai>>,
  siuntejas: ReturnType<typeof pastoSiuntejas>,
): Promise<void> {
  const { docs } = await payload.find({
    collection: 'zurnalas',
    where: { data: { in: datos } },
    sort: ['data', 'laikas'],
    limit: 200,
    depth: 1,
    overrideAccess: true,
  })

  // `null` reiškia „šios eilutės nėra“ — išfiltruojama prieš siunčiant.
  const eilutes: (string | null)[] = []
  for (const dataISO of datos.sort()) {
    eilutes.push(`${dataZodziais(dataISO)}:`, '')
    for (const d of docs as unknown as {
      id: string | number
      data: string
      laikas?: string | null
      pirmaPamoka?: boolean | null
      klaida?: string | null
      mokinys?: { vardas?: string; klase?: string | null } | null
    }[]) {
      if (d.data !== dataISO) continue
      const id = String(d.id)
      const vardas = d.mokinys?.vardas ?? '(ištrintas mokinys)'
      const klase = d.mokinys?.klase ? `, ${d.mokinys.klase} kl.` : ''
      eilutes.push(
        `  ${d.laikas}  ${vardas}${klase}${d.pirmaPamoka ? '  — PIRMA PAMOKA' : ''}`,
        d.klaida ? `    ⚠ laiškas neišsiųstas: ${d.klaida}` : null,
        `    Buvo:   ${svetaine.url}/vidus/zymeti?id=${id}&b=ivyko&p=${zymejimoParasas(id, 'ivyko')}`,
        `    Nebuvo: ${svetaine.url}/vidus/zymeti?id=${id}&b=neivyko&p=${zymejimoParasas(id, 'neivyko')}`,
        '',
      )
    }
  }

  await siuntejas.sendMail({
    from: `"${svetaine.pavadinimas}" <${pastas.user}>`,
    to: pastas.gavejas,
    subject: `Pamokos — ${datos.sort().map(dataZodziais).join(', ')}`,
    text: [
      ...eilutes.filter((e): e is string => e !== null),
      '—',
      'Paspaudus „Buvo“, pirmos pamokos nuolaidos varnelė nusiima automatiškai.',
      `${svetaine.url}/admin/collections/zurnalas`,
    ].join('\n'),
  })
}
