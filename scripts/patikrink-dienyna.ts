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
 *   • kita pamoka: individuali ir grupinė, pauzė jas nustumia;
 *   • praėjusios pamokos: neįvykusi ir dar neprasidėjusi nerodomos;
 *   • grupės narių įrašai gauna tą pačią temą, o „Įvyko“ jos neperrašo;
 *   • tėvų el. paštas ir Meet nuoroda iš dienyno duomenų neišeina.
 *
 * Bandomieji įrašai trinami net tada, kai patikra nulūžta.
 */

import { getPayload } from 'payload'
import config from '../payload.config'
import { DIENYNO_KONTEKSTAS } from '../cms/DienynoPaskyros'
import { prisijunk, vaikoDienynas } from '../lib/dienynas'
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

  console.log('\n4. Ką rodo dienynas')

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
  for (const kolekcija of ['dienyno-paskyros', 'grupes', 'mokiniai'] as const) {
    for (const id of sukurta[kolekcija]) {
      await payload.delete({ collection: kolekcija, id, overrideAccess: true }).catch(() => {})
    }
  }
}

console.log(klaidu ? `\n✖ Klaidų: ${klaidu}\n` : '\n✓ Viskas gerai\n')
process.exit(klaidu ? 1 : 0)
