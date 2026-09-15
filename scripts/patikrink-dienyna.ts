/**
 * Dienyno patikra nuo galo iki galo.
 *
 * Paleidimas:  npm run patikra:dienynas
 *
 * KĄ TIKRINA. Susikuria SAVO bandomąjį mokinį, grupę, paskyrą ir žurnalo
 * įrašus ir patikrina tai, kas lūžtų tyliai:
 *
 *   • prisijungti galima tik per dienyną — `payload.login` be dienyno žymės
 *     (taip jungiasi `/api/…/login` ir GraphQL) atmetamas;
 *   • vardas nejautrus didžiosioms raidėms, neteisingas slaptažodis — ne;
 *   • laikinas slaptažodis: keitimo taisyklės, senas nustoja tikti, CMS'e
 *     įrašius naują, vėl prašoma pasikeisti;
 *   • kita pamoka: individuali ir grupinė, pauzė jas nustumia;
 *   • praėjusios pamokos: neįvykusi ir dar neprasidėjusi nerodomos;
 *   • grupės narių įrašai gauna tą pačią temą, o „Įvyko“ jos neperrašo;
 *   • failai: nuotrauka sumažinama, gula ne į `public/`, SVG neleidžiamas;
 *     namų darbų failai kopijuojami grupei, atsiliepimas — ne;
 *   • korepetitorės suvestinė: grupės nariai, paskyros, pamokos be temos;
 *   • tėvų el. paštas ir Meet nuoroda iš dienyno duomenų neišeina.
 *
 * Bandomieji įrašai trinami net tada, kai patikra nulūžta.
 */

import { existsSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import PDFDocument from 'pdfkit'
import sharp from 'sharp'
import config from '../payload.config'
import { DIENYNO_KONTEKSTAS } from '../cms/DienynoPaskyros'
import { korepetitoresSuvestine, pakeiskSlaptazodi, prisijunk, vaikoDienynas } from '../lib/dienynas'
import { data as dataVilniuje, pridekDienas, savaitesDiena } from '../lib/laikas'

const ZYMA = 'PATIKRA-DIENYNAS-'

/** `savaitesDiena` grąžina skaičių, o laukas laukia `'1'`…`'7'`. */
const dienosLaukas = (dataISO: string) => String(savaitesDiena(dataISO)) as '1' | '2' | '3' | '4' | '5' | '6' | '7'
const MEET = 'https://meet.google.com/aaa-bbbb-ccc'

let klaidu = 0

function tikrink(salyga: boolean, ka: string, detales = ''): void {
  if (salyga) {
    console.log(`  ✓ ${ka}`)
  } else {
    klaidu++
    console.error(`  ✖ ${ka}${detales ? `\n      ${detales}` : ''}`)
  }
}

const payload = await getPayload({ config })

const sukurta = {
  mokiniai: [] as (number | string)[],
  grupes: [] as (number | string)[],
  'dienyno-paskyros': [] as (number | string)[],
  'dienyno-failai': [] as (number | string)[],
}

/** Tikras vieno puslapio PDF — Payload tikrina ne tik antraštę, bet ir struktūrą. */
function pdfFailas(): Promise<Buffer> {
  return new Promise((ok, klaida) => {
    const dok = new PDFDocument({ size: 'A6' })
    const dalys: Buffer[] = []
    dok.on('data', (d: Buffer) => dalys.push(d))
    dok.on('end', () => ok(Buffer.concat(dalys)))
    dok.on('error', klaida)
    dok.text('Patikra')
    dok.end()
  })
}

try {
  const dabar = new Date()
  const siandien = dataVilniuje(dabar)
  const rytoj = pridekDienas(siandien, 1)

  console.log('\n1. Bandomieji duomenys')

  const kate = await payload.create({
    collection: 'mokiniai',
    overrideAccess: true,
    data: {
      vardas: `${ZYMA}Kate`,
      tevoPastas: 'patikra-dienynas@example.com',
      meetNuoroda: MEET,
      // Kas savaitę rytojaus savaitės dieną 23:00 — rytoj tikrai dar neįvykusi.
      pamokos: [{ kartojimas: 'savaite', savaitesDiena: dienosLaukas(rytoj), laikas: '23:00', trukmeMin: 60 }],
    },
  })
  const jonas = await payload.create({
    collection: 'mokiniai',
    overrideAccess: true,
    data: { vardas: `${ZYMA}Jonas`, tevoPastas: 'patikra-dienynas@example.com', meetNuoroda: MEET },
  })
  sukurta.mokiniai.push(kate.id, jonas.id)

  const grupe = await payload.create({
    collection: 'grupes',
    overrideAccess: true,
    data: {
      pavadinimas: `${ZYMA}grupė`,
      nariai: [kate.id, jonas.id],
      meetNuoroda: MEET,
      // Poryt 22:00 — vėliau už rytojaus individualią, tad kita vis tiek rytojaus.
      pamokos: [
        {
          kartojimas: 'savaite',
          savaitesDiena: dienosLaukas(pridekDienas(siandien, 2)),
          laikas: '22:00',
          trukmeMin: 60,
        },
      ],
    },
  })
  sukurta.grupes.push(grupe.id)

  const paskyra = await payload.create({
    collection: 'dienyno-paskyros',
    overrideAccess: true,
    data: { username: 'patikra-dienynas', password: 'slaptas-123', mokiniai: [kate.id] },
  })
  sukurta['dienyno-paskyros'].push(paskyra.id)

  const vakar = pridekDienas(siandien, -1)
  const uzvakar = pridekDienas(siandien, -2)
  const irasai = await Promise.all(
    [
      { mokinys: kate.id, data: vakar, laikas: '17:00', busena: 'ivyko', tema: 'Trupmenos', namuDarbai: '42 psl.' },
      { mokinys: kate.id, data: uzvakar, laikas: '17:00', busena: 'neivyko', tema: 'Neturi matytis' },
      // Šiandien 23:59 — dar neprasidėjusi (nebent patikra paleista paskutinę minutę).
      { mokinys: kate.id, data: siandien, laikas: '23:59', busena: 'suplanuota', tema: 'Dar neįvyko' },
      { mokinys: kate.id, data: vakar, laikas: '15:00', tipas: 'grupine', grupe: grupe.id },
      { mokinys: jonas.id, data: vakar, laikas: '15:00', tipas: 'grupine', grupe: grupe.id },
    ].map((data) =>
      payload.create({ collection: 'zurnalas', overrideAccess: true, data: data as never }),
    ),
  )
  const [, , , kateGrupeje, jonasGrupeje] = irasai
  console.log('  ✓ sukurta')

  console.log('\n2. Prisijungimas')

  let atmesta = false
  try {
    await payload.login({
      collection: 'dienyno-paskyros',
      data: { username: 'patikra-dienynas', password: 'slaptas-123' },
    })
  } catch {
    atmesta = true
  }
  tikrink(atmesta, 'be dienyno žymės (kaip per /api) prisijungti neleidžiama')

  let suZyma = false
  try {
    await payload.login({
      collection: 'dienyno-paskyros',
      data: { username: 'patikra-dienynas', password: 'slaptas-123' },
      context: { [DIENYNO_KONTEKSTAS]: true },
    })
    suZyma = true
  } catch (k) {
    tikrink(false, 'su dienyno žyme prisijungiama', String(k))
  }
  if (suZyma) tikrink(true, 'su dienyno žyme prisijungiama')

  const gerai = await prisijunk('  Patikra-Dienynas ', 'slaptas-123')
  tikrink(gerai.pavyko, 'vardas didžiosiomis ir su tarpais tinka')
  tikrink(gerai.pavyko && gerai.slapukas.split('.').length === 3, 'slapukas: id.galiojimas.parašas')

  const blogai = await prisijunk('patikra-dienynas', 'neteisingas')
  tikrink(!blogai.pavyko, 'neteisingas slaptažodis atmetamas')

  console.log('\n2a. Laikino slaptažodžio keitimas')

  tikrink(gerai.pavyko && gerai.keistiSlaptazodi, 'nauja paskyra prašo pasikeisti slaptažodį')
  const kaip = { id: String(paskyra.id), vardas: 'patikra-dienynas', mokiniai: [String(kate.id)], keistiSlaptazodi: true }
  const trumpas = await pakeiskSlaptazodi(kaip, 'abc', 'abc')
  tikrink(!trumpas.pavyko, 'per trumpas atmetamas')
  const nesutampa = await pakeiskSlaptazodi(kaip, 'naujas-777', 'naujas-778')
  tikrink(!nesutampa.pavyko, 'nesutampantys atmetami')
  const vardas = await pakeiskSlaptazodi(kaip, 'patikra-dienynas', 'patikra-dienynas')
  tikrink(!vardas.pavyko, 'slaptažodis = vardas atmetamas')
  const tas = await pakeiskSlaptazodi(kaip, 'slaptas-123', 'slaptas-123')
  tikrink(!tas.pavyko && /naują/.test(tas.klaida), 'tas pats laikinas atmetamas', JSON.stringify(tas))

  const pakeista = await pakeiskSlaptazodi(kaip, 'mano-777', 'mano-777')
  tikrink(pakeista.pavyko && pakeista.slapukas.split('.').length === 3, 'pakeičiama ir grąžinamas naujas slapukas', JSON.stringify(pakeista))
  tikrink(!(await prisijunk('patikra-dienynas', 'slaptas-123')).pavyko, 'senas slaptažodis nebetinka')
  const naujuoju = await prisijunk('patikra-dienynas', 'mano-777')
  tikrink(naujuoju.pavyko && !naujuoju.keistiSlaptazodi, 'naujuoju prisijungiama, keisti nebeprašo')

  // Korepetitorė CMS'e įrašo naują slaptažodį — varnelė turi įsijungti pati.
  await payload.update({ collection: 'dienyno-paskyros', id: paskyra.id, overrideAccess: true, data: { password: 'slaptas-123' } })
  const poAtstatymo = await prisijunk('patikra-dienynas', 'slaptas-123')
  tikrink(poAtstatymo.pavyko && poAtstatymo.keistiSlaptazodi, 'CMS\'e įrašius naują slaptažodį, vėl prašo pasikeisti')

  console.log('\n3. Grupės tema ir namų darbai')

  await payload.update({
    collection: 'zurnalas',
    id: kateGrupeje.id,
    overrideAccess: true,
    data: { tema: 'Lygtys', namuDarbai: '5–9 uždaviniai' },
  })
  let jono = await payload.findByID({ collection: 'zurnalas', id: jonasGrupeje.id, overrideAccess: true })
  tikrink(jono.tema === 'Lygtys' && jono.namuDarbai === '5–9 uždaviniai', 'nukopijuota kitam nariui', `gauta: ${jono.tema} / ${jono.namuDarbai}`)

  await payload.update({
    collection: 'zurnalas',
    id: jonasGrupeje.id,
    overrideAccess: true,
    data: { namuDarbai: 'Jonui kiti' },
  })
  await payload.update({ collection: 'zurnalas', id: kateGrupeje.id, overrideAccess: true, data: { busena: 'ivyko' } })
  jono = await payload.findByID({ collection: 'zurnalas', id: jonasGrupeje.id, overrideAccess: true })
  tikrink(jono.namuDarbai === 'Jonui kiti', 'pažymėjus „Įvyko“ kito nario namų darbai neperrašomi', `gauta: ${jono.namuDarbai}`)
  const katesGr = await payload.findByID({ collection: 'zurnalas', id: kateGrupeje.id, overrideAccess: true })
  tikrink(katesGr.namuDarbai === 'Jonui kiti', 'ir atgal: Jono pataisymas nuėjo Katei', `gauta: ${katesGr.namuDarbai}`)

  console.log('\n4. Failai ir atsiliepimas')

  // 3000 px nuotrauka — originalas turi susimažinti iki 2000 px, o peržiūra būti 800 px.
  const nuotraukosDuomenys = await sharp({
    create: { width: 3000, height: 2000, channels: 3, background: '#ff5c00' },
  })
    .jpeg()
    .toBuffer()
  const nuotrauka = await payload.create({
    collection: 'dienyno-failai',
    overrideAccess: true,
    data: {},
    file: { data: nuotraukosDuomenys, mimetype: 'image/jpeg', name: `${ZYMA}sasiuvinis.jpg`, size: nuotraukosDuomenys.length },
  })
  sukurta['dienyno-failai'].push(nuotrauka.id)
  const pdfDuomenys = await pdfFailas()
  const pdf = await payload.create({
    collection: 'dienyno-failai',
    overrideAccess: true,
    data: {},
    file: { data: pdfDuomenys, mimetype: 'application/pdf', name: `${ZYMA}taisymai.pdf`, size: pdfDuomenys.length },
  })
  sukurta['dienyno-failai'].push(pdf.id)

  tikrink(nuotrauka.width === 2000, 'nuotraukos originalas sumažintas iki 2000 px', `plotis ${nuotrauka.width}`)
  tikrink(nuotrauka.sizes?.perzvalga?.width === 800, 'peržiūros versija — 800 px', `plotis ${nuotrauka.sizes?.perzvalga?.width}`)
  const katalogas = path.resolve(payload.collections['dienyno-failai'].config.upload.staticDir as string)
  tikrink(!katalogas.includes(`${path.sep}public${path.sep}`), 'failai ne `public/` kataloge', katalogas)
  tikrink(existsSync(path.join(katalogas, nuotrauka.filename ?? '-')), 'failas diske')

  let svetimasTipas = false
  try {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')
    const d = await payload.create({
      collection: 'dienyno-failai',
      overrideAccess: true,
      data: {},
      file: { data: svg, mimetype: 'image/svg+xml', name: `${ZYMA}blogas.svg`, size: svg.length },
    })
    sukurta['dienyno-failai'].push(d.id)
  } catch {
    svetimasTipas = true
  }
  tikrink(svetimasTipas, 'SVG įkelti neleidžiama')

  await payload.update({
    collection: 'zurnalas',
    id: kateGrupeje.id,
    overrideAccess: true,
    data: { namuDarbuFailai: [nuotrauka.id], atsiliepimas: 'Katei sekėsi puikiai.', atsiliepimoFailai: [pdf.id] },
  })
  jono = await payload.findByID({ collection: 'zurnalas', id: jonasGrupeje.id, overrideAccess: true, depth: 0 })
  tikrink(
    JSON.stringify(jono.namuDarbuFailai) === JSON.stringify([nuotrauka.id]),
    'namų darbų failai nukopijuoti kitam grupės nariui',
    JSON.stringify(jono.namuDarbuFailai),
  )
  tikrink(!jono.atsiliepimas && (jono.atsiliepimoFailai ?? []).length === 0, 'atsiliepimas ir jo failai — NE', JSON.stringify([jono.atsiliepimas, jono.atsiliepimoFailai]))

  const katesFailai = (await vaikoDienynas(String(kate.id), dabar))?.pamokos.find((p) => p.id === String(kateGrupeje.id))
  tikrink(
    Boolean(katesFailai?.namuDarbuFailai[0]?.paveikslelis && katesFailai.namuDarbuFailai[0].perziura),
    'dienyne nuotrauka — paveikslėlis su peržiūra',
    JSON.stringify(katesFailai?.namuDarbuFailai),
  )
  tikrink(
    katesFailai?.atsiliepimas === 'Katei sekėsi puikiai.' && katesFailai.atsiliepimoFailai[0]?.paveikslelis === false,
    'dienyne atsiliepimas su PDF',
    JSON.stringify([katesFailai?.atsiliepimas, katesFailai?.atsiliepimoFailai]),
  )
  const jonoPamoka = (await vaikoDienynas(String(jonas.id), dabar))?.pamokos.find((p) => p.id === String(jonasGrupeje.id))
  tikrink(Boolean(jonoPamoka && !jonoPamoka.atsiliepimas && jonoPamoka.namuDarbuFailai.length === 1), 'Jono dienyne — namų darbų nuotrauka, bet ne Katės atsiliepimas')

  console.log('\n5. Ką rodo dienynas')

  const d = await vaikoDienynas(String(kate.id), dabar)
  tikrink(Boolean(d), 'dienynas randamas')
  if (d) {
    tikrink(d.kita?.dataISO === rytoj && d.kita.laikas === '23:00', 'kita pamoka — rytoj 23:00', JSON.stringify(d.kita))
    tikrink(d.kita?.pabaiga === '00:00', 'pabaiga per vidurnaktį — 00:00', String(d.kita?.pabaiga))
    tikrink(Boolean(d.nuoroda?.includes('/p/')), 'nuoroda į pamoką — per /p/, ne tiesiai į Meet')

    const temos = d.pamokos.map((p) => p.tema)
    tikrink(temos.includes('Trupmenos'), 'įvykusi pamoka rodoma')
    tikrink(!temos.includes('Neturi matytis'), 'neįvykusi — ne')
    tikrink(!temos.includes('Dar neįvyko'), 'šiandien dar neprasidėjusi — ne')
    tikrink(d.pamokos[0]?.tema === 'Lygtys' || d.pamokos[0]?.tema === 'Trupmenos', 'naujausia viršuje')

    const tekstas = JSON.stringify(d)
    tikrink(!tekstas.includes('example.com') && !tekstas.includes('meet.google.com'), 'tėvų paštas ir Meet nuoroda neišeina')
  }

  console.log('\n6. Korepetitorės suvestinė')

  // Jonui — įvykusi pamoka be temos: ją suvestinė turi suskaičiuoti.
  await payload.create({
    collection: 'zurnalas',
    overrideAccess: true,
    data: { mokinys: jonas.id, data: uzvakar, laikas: '10:00', busena: 'ivyko' } as never,
  })

  const suvestine = (await korepetitoresSuvestine(dabar)).filter((v) => v.vardas.startsWith(ZYMA))
  const sKate = suvestine.find((v) => v.id === String(kate.id))
  const sJonas = suvestine.find((v) => v.id === String(jonas.id))
  tikrink(Boolean(sKate && sJonas), 'abu mokiniai suvestinėje')
  if (sKate && sJonas) {
    tikrink(sKate.paskyros.map((p) => p.vardas).join() === 'patikra-dienynas', 'Katės paskyra rodoma')
    tikrink(sJonas.paskyros.length === 0, 'Jonas — be paskyros')
    tikrink(sKate.kita?.dataISO === rytoj && !sKate.kita.grupine, 'Katės kita — rytoj individuali', JSON.stringify(sKate.kita))
    tikrink(
      sJonas.kita?.dataISO === pridekDienas(siandien, 2) && sJonas.kita.grupine,
      'Jono kita — poryt grupinė (grupės nariai suvestinėje atsekami)',
      JSON.stringify(sJonas.kita),
    )
    const kTemos = sKate.pamokos.map((p) => p.tema)
    tikrink(kTemos.includes('Neturi matytis'), 'suvestinėje matosi ir neįvykusi pamoka')
    tikrink(!kTemos.includes('Dar neįvyko'), 'bet ne dar neprasidėjusi')
    tikrink(sKate.beTemos === 0 && sJonas.beTemos === 1, 'be temos: Katė 0, Jonas 1', `${sKate.beTemos} / ${sJonas.beTemos}`)
    const tekstas = JSON.stringify(suvestine)
    tikrink(!tekstas.includes('example.com') && !tekstas.includes('meet.google.com'), 'tėvų paštas ir Meet nuoroda neišeina')
  }

  // Pauzė iki rytojaus imtinai: rytojaus individuali dingsta, lieka poryt grupinė.
  await payload.update({ collection: 'mokiniai', id: kate.id, overrideAccess: true, data: { pauzeIki: `${rytoj}T12:00:00.000Z` } })
  const suPauze = await vaikoDienynas(String(kate.id), dabar)
  tikrink(
    suPauze?.kita?.dataISO === pridekDienas(siandien, 2) && suPauze.kita.grupine,
    'su pauze iki rytojaus kita — poryt grupinė',
    JSON.stringify(suPauze?.kita),
  )

  await payload.update({ collection: 'mokiniai', id: kate.id, overrideAccess: true, data: { aktyvus: false } })
  tikrink((await vaikoDienynas(String(kate.id), dabar))?.kita === null, 'neaktyvus mokinys kitos pamokos neturi')
} finally {
  // Žurnalas pirmas: jo įrašai rodo į mokinius ir grupę.
  const { docs } = await payload.find({
    collection: 'zurnalas',
    where: { mokinys: { in: sukurta.mokiniai } },
    limit: 100,
    overrideAccess: true,
    depth: 0,
  })
  for (const z of docs) await payload.delete({ collection: 'zurnalas', id: z.id, overrideAccess: true })
  for (const kolekcija of ['dienyno-failai', 'dienyno-paskyros', 'grupes', 'mokiniai'] as const) {
    for (const id of sukurta[kolekcija]) {
      await payload.delete({ collection: kolekcija, id, overrideAccess: true }).catch(() => {})
    }
  }
}

console.log(klaidu ? `\n✖ Klaidų: ${klaidu}\n` : '\n✓ Viskas gerai\n')
process.exit(klaidu ? 1 : 0)
