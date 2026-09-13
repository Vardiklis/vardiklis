import { createHmac, timingSafeEqual } from 'node:crypto'
import { getPayload } from 'payload'
import config from '@payload-config'
import { kontaktai, svetaine } from '@/lib/kontaktai'
import {
  gautiAtsiskaitymus,
  pamokosKaina,
  type AtsiskaitymuNustatymai,
  type PamokosTipas,
} from '@/lib/kainos'
import {
  data as dataVilniuje,
  dataZodziais,
  dienaGalininku,
  momentas,
  pridekDienas,
} from '@/lib/laikas'
import { arVyksta, type Pamoka } from '@/lib/pamokos'
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
 *
 * INDIVIDUALIOS IR GRUPINĖS EINA VIENU KELIU. Pamokos pirma SUPLANUOJAMOS į
 * vieną sąrašą (`suplanuok`), ir tik paskui siunčiamos. Taip dvigubo siuntimo
 * apsauga, kainos fiksavimas ir klaidų tvarkymas lieka vienoje vietoje —
 * kitaip grupinė pamoka anksčiau ar vėliau imtų elgtis kitaip nei individuali.
 */

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

type Grupe = {
  id: number
  pavadinimas?: string | null
  meetNuoroda?: string | null
  /** `depth: 0`, tad čia — numeriai, ne dokumentai. */
  nariai?: (number | string)[] | null
  pamokos?: Pamoka[] | null
  aktyvi?: boolean | null
  pauzeIki?: string | null
}

type Nustatymai = {
  ijungta?: boolean | null
  kada?: string | null
  valanda?: string | null
  prierasas?: string | null
  parasas?: string | null
  santraukaSau?: boolean | null
  paskutineSantrauka?: string | null
  poPamokos?: boolean | null
  poPamokosDelsa?: number | null
}

export type Ataskaita = {
  tikrinta: string
  issiusta: number
  nepavyko: number
  praleista: number
  santraukaIssiusta: boolean
  /** Kiek išsiųsta „ar įvyko?“ laiškų sau. */
  klausimu: number
  eilutes: string[]
}

/** Viena konkreti pamoka konkrečią dieną konkrečiam vaikui. */
type Suplanuota = {
  mokinys: Mokinys
  dataISO: string
  laikas: string
  tipas: PamokosTipas
  grupe: Grupe | null
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

/**
 * Parašas priminimų atsisakymo nuorodai.
 *
 * ATSKIRAS ir nuo `zymejimoParasas`, ir nuo mokinio `raktas`. Raktą vaikas
 * laiko naršyklės žymėse, ir jis skirtas patekti į pamoką — atsisakyti tėvų
 * priminimų juo neturi būti galima. Todėl atskiras parašas su savo žyme.
 */
export function atsisakymoParasas(id: string): string {
  const raktas = process.env.PAYLOAD_SECRET || ''
  return createHmac('sha256', raktas).update(`atsisakymas:${id}`).digest('hex').slice(0, 16)
}

export function arTeisingasAtsisakymas(id: string, parasas: string): boolean {
  const laukiamas = Buffer.from(atsisakymoParasas(id))
  const gautas = Buffer.from(parasas || '')
  return laukiamas.length === gautas.length && timingSafeEqual(laukiamas, gautas)
}

/** Pilnas adresas — naudojamas ir laiško tekste, ir `List-Unsubscribe` antraštėje. */
export function atsisakymoNuoroda(mokinioId: number | string): string {
  const id = String(mokinioId)
  return `${svetaine.url}/vidus/atsisakyti?m=${id}&p=${atsisakymoParasas(id)}`
}

/**
 * Parašas, kai CMS'e jis nenurodytas.
 *
 * Ne tuščia eilutė: globalo `defaultValue` galioja tik pirmą kartą kuriant
 * įrašą, o serveryje jis jau sukurtas — tad naujas laukas ten atsiranda
 * tuščias, ir be šito laiškai staiga liktų be parašo.
 *
 * Trumpas ir šiltas, be pareigų ir kontaktų bloko: tai priminimas savam
 * žmogui, o ne prisistatymas nepažįstamam. Telefonas ir adresas tėvams jau
 * žinomi, o laiško gale jie tik primintų reklaminį parašą.
 */
function numatytasParasas(): string[] {
  return ['Šilčiausi linkėjimai,', kontaktai.vardas]
}

/** Ar mokinys tą dieną ilsisi. Pauzė galioja imtinai. */
function pauzuoja(pauzeIki: string | null | undefined, dataISO: string): boolean {
  if (!pauzeIki) return false
  return dataISO <= dataVilniuje(new Date(pauzeIki))
}

/**
 * Visos pamokos, vykstančios nurodytomis dienomis — ir individualios, ir
 * grupinės — vienu sąrašu.
 *
 * RAKTAS `mokinys|data|laikas` neleidžia dviejų įrašų tam pačiam vaikui tuo
 * pačiu metu. Toks sutapimas įmanomas (vaikas įrašytas į dvi grupes arba turi
 * ir individualią, ir grupinę tuo pačiu laiku) ir be šito duotų DU laiškus bei
 * DVI eilutes sąskaitoje. Individualios planuojamos pirmos ir laimi: tai
 * paties vaiko laikas, o į grupę jis tą valandą fiziškai nespėtų.
 */
function suplanuok(
  mokiniai: Mokinys[],
  grupes: Grupe[],
  kandidatai: string[],
): Suplanuota[] {
  const pagalRakta = new Map<string, Suplanuota>()
  const pagalId = new Map<number | string, Mokinys>(mokiniai.map((m) => [m.id, m]))

  const idek = (p: Suplanuota) => {
    const raktas = `${p.mokinys.id}|${p.dataISO}|${p.laikas}`
    if (!pagalRakta.has(raktas)) pagalRakta.set(raktas, p)
  }

  /** Tas pačias sąlygas turi praeiti ir individuali, ir grupinė pamoka. */
  const tinka = (m: Mokinys, dataISO: string): boolean =>
    Boolean(m.tevoPastas && m.meetNuoroda && m.raktas) &&
    m.sutikimas !== false &&
    !pauzuoja(m.pauzeIki, dataISO)

  for (const dataISO of kandidatai) {
    for (const mokinys of mokiniai) {
      if (!tinka(mokinys, dataISO)) continue
      for (const pamoka of mokinys.pamokos ?? []) {
        // Ta pati funkcija, pagal kurią dažomas ir svetainės kalendorius —
        // kad tėvai negautų laiško apie pamoką, kurios kalendorius nerodo.
        if (!pamoka.laikas || !arVyksta(pamoka, dataISO)) continue
        idek({ mokinys, dataISO, laikas: pamoka.laikas, tipas: 'individuali', grupe: null })
      }
    }

    for (const grupe of grupes) {
      if (pauzuoja(grupe.pauzeIki, dataISO)) continue
      for (const pamoka of grupe.pamokos ?? []) {
        if (!pamoka.laikas || !arVyksta(pamoka, dataISO)) continue
        for (const narioId of grupe.nariai ?? []) {
          // Sąraše tik aktyvūs mokiniai, tad neaktyvus narys čia nerandamas
          // ir priminimo negauna — lygiai kaip individualių pamokų atveju.
          const mokinys = pagalId.get(narioId)
          if (!mokinys || !tinka(mokinys, dataISO)) continue
          idek({ mokinys, dataISO, laikas: pamoka.laikas, tipas: 'grupine', grupe })
        }
      }
    }
  }

  return [...pagalRakta.values()]
}

/**
 * HTML laiške skaitomas kaip tekstas, tad tėvo vardas, prierašas ir parašas
 * pro jį eiti negali: CMS'e įrašytas `<` sugriautų visą likusį laišką.
 */
function saugus(tekstas: string): string {
  return tekstas
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const SVELNI = '#6b655f'

/**
 * Priminimas tėvams — ta pati žinutė dviem pavidalais.
 *
 * KODĖL IR HTML. Vien tekstinis laiškas techniškai teisingas, bet automatika,
 * siunčianti kasdien tą patį iš `@gmail.com` adreso, be HTML dalies atrodo
 * įtartinesnė nei įprastas laiškas — o čia dar ir nuoroda į kitą domeną
 * (`vardiklis.lt`), kurio pašto tarnybos nesieja su siuntėju. Dvi dalys
 * viename laiške yra normos, o ne puošybos klausimas.
 *
 * JOKIŲ PAVEIKSLĖLIŲ IR SEKIMO. Nematomas paveikslėlis ar peradresuojanti
 * nuoroda yra būtent tai, ko filtrai ieško. Nuorodos adresas parodomas ir
 * tekstu — kad matomas tekstas sutaptų su tuo, kur iš tikrųjų vedama.
 *
 * DIENA VADINAMA SAVAITĖS VARDU, o ne data: priminimai išeina tik apie
 * šiandienos arba rytojaus pamoką, tad „ketvirtadienį“ tėvams pasako daugiau
 * ir greičiau nei „rugsėjo 17 d.“.
 */
function laiskasTevams(
  p: Suplanuota,
  kaina: number,
  kainos: AtsiskaitymuNustatymai,
  prierasas: string | null,
  parasas: string | null,
  atsisakymas: string,
): { tema: string; tekstas: string; html: string } {
  const { mokinys, dataISO, laikas } = p
  const nuoroda = `${svetaine.url}/p/${mokinys.raktas}`
  const siandien = dataISO === dataVilniuje(new Date())

  // Tuščias CMS laukas ateina kaip `''`, o ne `null` — be šito jis praeitų pro
  // filtrą ir laiške atsirastų antra tuščia eilutė prieš parašą.
  const priedas = prierasas?.trim() || null

  /**
   * Nuolaida rodoma tik tada, kai ji tikrai yra. Pilna kaina imama pagal TĄ
   * PAČIĄ pamokos rūšį — grupinei pamokai skelbti individualios kainos būtų
   * tiesiog neteisinga.
   */
  const pilnaKaina = pamokosKaina(kainos, p.tipas, false)
  const nuolaida = mokinys.pirmaPamoka && pilnaKaina > kaina ? pilnaKaina - kaina : 0

  const kada = siandien ? 'šiandien' : dienaGalininku(dataISO)
  /**
   * Vardas VARDININKU, ir sakinys sudėliotas taip, kad kitokio nereikėtų.
   * „Jono matematikos pamoka“ reikalautų kilmininko, o vardai Payload'e
   * saugomi vardininku ir automatiškai jų nelinksniuosi: „Ugnė“ virstų
   * „Ugnės“, bet „Justas“ — „Justo“, o svetimvardžiai nepasiduotų visai.
   */
  const zinute = `Noriu priminti, jog ${mokinys.vardas} turi matematikos pamoką ${kada} ${laikas}.`
  const nuolaidosZinute =
    nuolaida > 0 ? `Pirmajai pamokai taikoma ${nuolaida} € nuolaida.` : null
  const parasoEilutes = parasas?.trim() ? parasas.trim().split('\n') : numatytasParasas()

  const tekstas = [
    'Sveiki,',
    '',
    zinute,
    '',
    `Prisijungti galėsite paspaudę šią nuorodą: ${nuoroda}`,
    '',
    nuolaidosZinute,
    nuolaidosZinute ? '' : null,
    priedas,
    priedas ? '' : null,
    ...parasoEilutes,
    '',
    `Nebenorite šių priminimų: ${atsisakymas}`,
  ]
    .filter((e): e is string => e !== null)
    .join('\n')

  const html = [
    `<div style="font:16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#12100e;max-width:34rem">`,
    `<p>Sveiki,</p>`,
    `<p>${saugus(zinute)}</p>`,
    `<p>Prisijungti galėsite paspaudę šią nuorodą:<br><a href="${saugus(nuoroda)}" style="color:#12100e;font-weight:600;text-decoration:underline">${saugus(nuoroda)}</a></p>`,
    nuolaidosZinute ? `<p>${saugus(nuolaidosZinute)}</p>` : null,
    priedas ? `<p>${saugus(priedas).replace(/\n/g, '<br>')}</p>` : null,
    `<p>${parasoEilutes.map(saugus).join('<br>')}</p>`,
    `<p style="color:${SVELNI};font-size:14px"><a href="${saugus(atsisakymas)}" style="color:${SVELNI}">Nebenoriu šių priminimų</a></p>`,
    `</div>`,
  ]
    .filter((e): e is string => e !== null)
    .join('\n')

  return {
    tema: `Matematikos pamokos priminimas (${kada} ${laikas})`,
    tekstas,
    html,
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
    klausimu: 0,
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

  const { docs: mokiniuDokai } = await payload.find({
    collection: 'mokiniai',
    where: { aktyvus: { equals: true } },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })
  const mokiniai = mokiniuDokai as unknown as Mokinys[]

  const { docs: grupiuDokai } = await payload.find({
    collection: 'grupes',
    where: { aktyvi: { equals: true } },
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })
  const grupes = grupiuDokai as unknown as Grupe[]

  const kainos = await gautiAtsiskaitymus()

  const siandien = dataVilniuje(dabar)
  const kandidatai = [siandien, pridekDienas(siandien, 1)]
  const paliestosDatos = new Set<string>()

  for (const p of suplanuok(mokiniai, grupes, kandidatai)) {
    const { mokinys, dataISO, laikas } = p

    const pradzia = momentas(dataISO, laikas)
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
          { laikas: { equals: laikas } },
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

    const pirma = Boolean(mokinys.pirmaPamoka)
    const kaina = pamokosKaina(kainos, p.tipas, pirma)

    const irasas =
      senas ??
      (await payload.create({
        collection: 'zurnalas',
        overrideAccess: true,
        data: {
          santrauka: `${mokinys.vardas} · ${dataISO} ${laikas}`,
          data: dataISO,
          laikas,
          mokinys: mokinys.id,
          busena: 'suplanuota',
          pirmaPamoka: pirma,
          tipas: p.tipas,
          grupe: p.grupe?.id ?? null,
          // Kaina fiksuojama čia ir istorijoje nebesikeičia — lygiai dėl tos
          // pačios priežasties, kaip ir `pirmaPamoka`.
          kaina,
        },
      }))

    const atsisakymas = atsisakymoNuoroda(mokinys.id)
    const laiskas = laiskasTevams(
      p,
      kaina,
      kainos,
      n.prierasas ?? null,
      n.parasas ?? null,
      atsisakymas,
    )
    try {
      await siuntejas.sendMail({
        from: `"${kontaktai.vardas} · ${svetaine.pavadinimas}" <${pastas.user}>`,
        to: mokinys.tevoPastas!,
        replyTo: pastas.gavejas,
        subject: laiskas.tema,
        text: laiskas.tekstas,
        html: laiskas.html,
        /**
         * Atsisakymo antraštės.
         *
         * Gmail ir Outlook pagal jas parodo mygtuką „Atsisakyti“ virš laiško, o
         * jų buvimas yra vienas iš požymių, pagal kuriuos kasdien siunčiama
         * automatika atskiriama nuo šlamšto. Be jų vienintelis būdas nutraukti
         * laiškus yra mygtukas „Pranešti apie šlamštą“ — o kiekvienas toks
         * paspaudimas gadina siuntėjo vardą visiems likusiems gavėjams.
         *
         * `One-Click` reiškia, kad pašto programa gali atsisakyti pati, `POST`
         * užklausa ir nieko neklausdama (RFC 8058). Todėl maršrutas ir keičia
         * duomenis tik per `POST`.
         */
        headers: {
          'List-Unsubscribe': `<${atsisakymas}>, <mailto:${pastas.gavejas}?subject=Atsisakau%20priminimu>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      })
      await payload.update({
        collection: 'zurnalas',
        id: irasas.id,
        overrideAccess: true,
        // `klaida` valoma: pavykus iš antro karto senas įrašas klaidintų.
        data: { issiusta: new Date().toISOString(), klaida: null },
      })
      ataskaita.issiusta++
      ataskaita.eilutes.push(`✓ ${mokinys.vardas} ${dataISO} ${laikas}`)
    } catch (klaida) {
      const tekstas = String(klaida).slice(0, 300)
      await payload.update({
        collection: 'zurnalas',
        id: irasas.id,
        overrideAccess: true,
        data: { klaida: tekstas },
      })
      ataskaita.nepavyko++
      ataskaita.eilutes.push(`✗ ${mokinys.vardas} ${dataISO} ${laikas}: ${tekstas}`)
      console.error('[priminimai] laiško išsiųsti nepavyko:', klaida)
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

  if (n.poPamokos) await siuskKlausimus(payload, n, pastas, siuntejas, dabar, ataskaita)

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
      tipas?: string | null
      klaida?: string | null
      grupe?: { pavadinimas?: string | null } | null
      mokinys?: { vardas?: string; klase?: string | null } | null
    }[]) {
      if (d.data !== dataISO) continue
      const id = String(d.id)
      const vardas = d.mokinys?.vardas ?? '(ištrintas mokinys)'
      const klase = d.mokinys?.klase ? `, ${d.mokinys.klase} kl.` : ''
      // Grupinę pamoką reikia atskirti akimi: tuo pačiu laiku eilučių bus kelios.
      const grupe = d.tipas === 'grupine' ? `  [${d.grupe?.pavadinimas ?? 'grupė'}]` : ''
      eilutes.push(
        `  ${d.laikas}  ${vardas}${klase}${grupe}${d.pirmaPamoka ? '  — PIRMA PAMOKA' : ''}`,
        d.klaida ? `    ⚠ laiškas neišsiųstas: ${d.klaida}` : null,
        `    Buvo:   ${zymejimoNuorodos(id).buvo}`,
        `    Nebuvo: ${zymejimoNuorodos(id).nebuvo}`,
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

/** „Buvo / Nebuvo“ nuorodos su parašu — vienodos ir santraukoje, ir klausime. */
function zymejimoNuorodos(id: string): { buvo: string; nebuvo: string } {
  return {
    buvo: `${svetaine.url}/vidus/zymeti?id=${id}&b=ivyko&p=${zymejimoParasas(id, 'ivyko')}`,
    nebuvo: `${svetaine.url}/vidus/zymeti?id=${id}&b=neivyko&p=${zymejimoParasas(id, 'neivyko')}`,
  }
}

type KlausimoIrasas = {
  id: string | number
  data: string
  laikas?: string | null
  klausta?: string | null
  tipas?: string | null
  pirmaPamoka?: boolean | null
  grupe?: { pavadinimas?: string | null } | null
  mokinys?: { vardas?: string; klase?: string | null } | null
}

/**
 * Klausimas po kiekvienos pamokos: ar ji įvyko?
 *
 * KUO SKIRIASI NUO DIENOS SANTRAUKOS. Santrauka ateina PRIEŠ pamokas — kartu
 * su priminimu tėvams, tad rytą arba dieną prieš. Žymėti tuo metu dar nėra ko,
 * ir iki vakaro laiškas nugula po kitais. Šitas ateina tada, kai atsakymas jau
 * žinomas: pamokai pasibaigus, su viena pamoka ir dviem mygtukais.
 *
 * PABAIGA SKAIČIUOJAMA IŠ PRADŽIOS IR NUSTATYTOS TRUKMĖS. Žurnalo įrašas
 * trukmės nesaugo (ji gyvena tvarkaraščio eilutėje, o ta gali pasikeisti ar
 * dingti), tad imama viena bendra reikšmė iš „Priminimų“. Pamokos čia visos
 * vienodo ilgio, o klystant per kelias minutes nieko neatsitinka.
 *
 * NEPAVYKUS SIUNTIMUI `klausta` lieka tuščia, tad kitas badymas po penkių
 * minučių bando iš naujo. Tuo šitas laiškas patikimesnis už dienos santrauką,
 * kuri po nesėkmės tą dieną nebepasikartoja.
 */
async function siuskKlausimus(
  payload: Awaited<ReturnType<typeof getPayload>>,
  n: Nustatymai,
  pastas: NonNullable<ReturnType<typeof pastoNustatymai>>,
  siuntejas: ReturnType<typeof pastoSiuntejas>,
  dabar: Date,
  ataskaita: Ataskaita,
): Promise<void> {
  const delsa = Number(n.poPamokosDelsa ?? 60)
  const siandien = dataVilniuje(dabar)

  // Ir vakarykštė para: vėlyvos pamokos pabaiga nuslenka už vidurnakčio.
  const { docs } = await payload.find({
    collection: 'zurnalas',
    where: {
      and: [
        { data: { in: [pridekDienas(siandien, -1), siandien] } },
        // Jau pažymėtos pamokos klausti nebėra ko.
        { busena: { in: ['suplanuota', 'atidare'] } },
      ],
    },
    limit: 200,
    depth: 1,
    sort: ['data', 'laikas'],
    overrideAccess: true,
  })

  for (const d of docs as unknown as KlausimoIrasas[]) {
    if (d.klausta || !d.laikas) continue
    if (dabar.getTime() < momentas(d.data, d.laikas).getTime() + delsa * 60_000) continue

    const id = String(d.id)
    const nuorodos = zymejimoNuorodos(id)
    const vardas = d.mokinys?.vardas ?? '(ištrintas mokinys)'
    const klase = d.mokinys?.klase ? `, ${d.mokinys.klase} kl.` : ''
    const grupe = d.tipas === 'grupine' ? `  [${d.grupe?.pavadinimas ?? 'grupė'}]` : ''

    try {
      await siuntejas.sendMail({
        from: `"${svetaine.pavadinimas}" <${pastas.user}>`,
        to: pastas.gavejas,
        subject: `Ar įvyko? ${vardas} ${d.laikas}`,
        text: [
          `${vardas}${klase}${grupe}`,
          `${dataZodziais(d.data)} ${d.laikas}${d.pirmaPamoka ? '  — PIRMA PAMOKA' : ''}`,
          '',
          `Buvo:   ${nuorodos.buvo}`,
          `Nebuvo: ${nuorodos.nebuvo}`,
          '',
          '—',
          'Paspaudus „Buvo“, pirmos pamokos nuolaidos varnelė nusiima automatiškai.',
          `${svetaine.url}/admin/collections/zurnalas`,
        ].join('\n'),
      })

      await payload.update({
        collection: 'zurnalas',
        id: d.id,
        overrideAccess: true,
        data: { klausta: new Date().toISOString() },
      })

      ataskaita.klausimu++
      ataskaita.eilutes.push(`? ${vardas} ${d.data} ${d.laikas}`)
    } catch (klaida) {
      // `klausta` lieka tuščia — kitas badymas pakartos.
      console.error('[priminimai] klausimo išsiųsti nepavyko:', klaida)
    }
  }
}
