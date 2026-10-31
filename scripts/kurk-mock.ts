/**
 * Netikri duomenys mock režimui. Paleidžia `scripts/mock.mjs` — ne ranka.
 *
 * KĄ SUKURIA. Administratorių (prisijungiama automatiškai), dešimt mokinių su
 * įvairiais pasikartojimais (kas savaitę, kas 2 sav., kas mėnesį, pauzėje,
 * neaktyvus, naujas su nuolaida), dvi grupes, penkių savaičių pamokų istoriją
 * su temomis ir namų darbais, kitos savaitės išimtis (perkelta, atšaukta,
 * papildoma, perkelta grupinė), dvi rezervacijas ir vaiko dienyno paskyrą.
 *
 * Datos skaičiuojamos nuo šiandien, tad duomenys visada „švieži“: praeitis už
 * nugaros, išimtys — kitą savaitę.
 *
 * VISKAS — @example.invalid adresais: tas domenas laiškų negauna niekada.
 *
 * SAUGIKLIS. Prieš kurdamas, skriptas IŠTRINA bazę, į kurią rodo
 * `DATABASE_URI`. Todėl jis atsisako dirbti, jei nėra mock režimo arba bazė ne
 * `mock/` kataloge — kad netyčia paleistas su `.env` nenušluotų tikros.
 */
import { mkdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../payload.config'
import { gautiAtsiskaitymus, pamokosKaina } from '../lib/kainos'
import { irasykPamoka, perkelkPamoka, savaitesPirmadienis, sukurkPamoka } from '../lib/kalendorius'
import { data as dataVilniuje, momentas, pridekDienas } from '../lib/laikas'
import { arMock, MOCK_ADMINAS, MOCK_DIENYNAS } from '../lib/mock'
import type { Pamoka } from '../lib/pamokos'
import { suplanuok, type PlanoGrupe, type PlanoMokinys } from '../lib/pamoku-planas'

const saknis = path.resolve(import.meta.dirname, '..')
const mockKatalogas = path.join(saknis, 'mock')
const bazesKelias = path.resolve(String(process.env.DATABASE_URI ?? '').replace(/^file:/, ''))

if (!arMock() || path.dirname(bazesKelias) !== mockKatalogas) {
  console.error('Šis skriptas trina bazę, tad dirba tik mock režimu: npm run mock:is-naujo')
  process.exit(1)
}

for (const kelias of [bazesKelias, `${bazesKelias}-journal`, `${bazesKelias}-wal`, `${bazesKelias}-shm`]) {
  rmSync(kelias, { force: true })
}
for (const katalogas of [process.env.UPLOADS_DIR, process.env.DIENYNO_FAILU_DIR]) {
  if (katalogas && path.resolve(katalogas).startsWith(mockKatalogas)) {
    rmSync(katalogas, { recursive: true, force: true })
  }
}
mkdirSync(mockKatalogas, { recursive: true })

console.log('Kuriama mock bazė…')
const payload = await getPayload({ config })

const MEET = 'https://meet.google.com/moc-kmoc-kmo'
const siandien = dataVilniuje(new Date())
const pirmadienis = savaitesPirmadienis(siandien)
/** Kitos savaitės diena: 1 — pirmadienis, 7 — sekmadienis. */
const kita = (diena: number) => pridekDienas(pirmadienis, 7 + diena - 1)

// ─── Nustatymai ────────────────────────────────────────────────────────────

await payload.updateGlobal({
  slug: 'atsiskaitymai',
  overrideAccess: true,
  data: {
    pardavejoVardas: 'MOCK — Netikra Korepetitorė',
    pardavejoKodas: '000000000',
    pardavejoAdresas: 'Netikra g. 1, Vilnius',
    iban: 'LT000000000000000000',
    bankas: 'Mock bankas',
    serija: 'MOCK',
  } as never,
})

await payload.create({ collection: 'naudotojai', overrideAccess: true, data: MOCK_ADMINAS as never })

// ─── Mokiniai ir grupės ───────────────────────────────────────────────────

type Eilute = Pamoka & { kartojimas: 'savaite' | 'menuo' }
const savaite = (diena: number, laikas: string, kitkas: Partial<Eilute> = {}): Eilute => ({
  kartojimas: 'savaite',
  savaitesDiena: String(diena),
  laikas,
  trukmeMin: 60,
  kasKiek: '1',
  ...kitkas,
})

const mokiniai: Record<string, number> = {}
async function mokinys(
  vardas: string,
  klase: number,
  pamokos: Eilute[],
  kitkas: Record<string, unknown> = {},
): Promise<number> {
  const adresas = vardas.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')
  const m = await payload.create({
    collection: 'mokiniai',
    overrideAccess: true,
    data: {
      vardas,
      klase: String(klase),
      tevoVardas: `${vardas} tėvai`,
      tevoPastas: `${adresas}@example.invalid`,
      meetNuoroda: MEET,
      pamokos,
      pirmaPamoka: false,
      ...kitkas,
    } as never,
  })
  mokiniai[vardas] = m.id as number
  return m.id as number
}

const nuo = pridekDienas(pirmadienis, -42)
await mokinys('Jonas', 8, [savaite(2, '17:00', { nuoDatos: nuo }), savaite(4, '17:00', { nuoDatos: nuo })])
await mokinys('Ugnė', 6, [savaite(1, '15:00')])
await mokinys('Matas', 10, [savaite(3, '18:00', { trukmeMin: 90 })])
await mokinys('Austėja', 4, [savaite(6, '10:00', { kasKiek: '2', nuoDatos: pirmadienis })])
await mokinys('Lukas', 7, [{ kartojimas: 'menuo', menesioDiena: 15, kasKiekMenesiu: '1', laikas: '16:00', trukmeMin: 60 }])
await mokinys('Gabija', 9, [savaite(1, '18:00')], { pauzeIki: pridekDienas(siandien, 10) })
await mokinys('Nojus', 5, [savaite(5, '15:00')], { aktyvus: false })
await mokinys('Rugilė', 3, [savaite(4, '15:00', { nuoDatos: kita(4) })], {
  pirmaPamoka: true,
  pastabos: 'Nauja mokinė — pirmoji pamoka su nuolaida.',
})
await mokinys('Kajus', 8, [])
await mokinys('Ema', 8, [])

const grupe8 = await payload.create({
  collection: 'grupes',
  overrideAccess: true,
  data: {
    pavadinimas: '8 klasė, penktadieniais',
    nariai: [mokiniai.Kajus, mokiniai.Ema],
    meetNuoroda: MEET,
    pamokos: [savaite(5, '16:00', { trukmeMin: 90 })],
  } as never,
})
await payload.create({
  collection: 'grupes',
  overrideAccess: true,
  data: {
    pavadinimas: 'PUPP pasiruošimas',
    nariai: [mokiniai.Matas, mokiniai.Jonas],
    meetNuoroda: MEET,
    pamokos: [savaite(6, '12:00', { trukmeMin: 90 })],
  } as never,
})

// ─── Istorija: penkios savaitės iki šiandien ──────────────────────────────

const TEMOS = [
  ['Trupmenų sudėtis', '42 psl. 3–7 uždaviniai'],
  ['Lygtys su viena nežinomąja', 'Išspręsti 5 lygtis iš lapo'],
  ['Procentai', null],
  ['Plotai ir perimetrai', '58 psl. 1, 2, 4'],
  ['Laipsniai', 'Pakartoti laipsnių savybes'],
  ['Kvadratinės lygtys', '112 psl. 10–15'],
  ['Tekstiniai uždaviniai', null],
] as const

const { docs: visiMokiniai } = await payload.find({ collection: 'mokiniai', limit: 100, depth: 0, overrideAccess: true })
const { docs: visosGrupes } = await payload.find({ collection: 'grupes', limit: 100, depth: 0, overrideAccess: true })
const kainos = await gautiAtsiskaitymus()

const istorija = Array.from({ length: 35 }, (_, i) => pridekDienas(siandien, i - 35)).concat(siandien)
const praeitis = suplanuok(
  visiMokiniai as unknown as PlanoMokinys[],
  visosGrupes as unknown as PlanoGrupe[],
  [],
  istorija,
)

let eile = 0
for (const p of praeitis) {
  const siandienos = p.dataISO === siandien
  const ivyko = !siandienos && (eile++ % 9 !== 4)
  // Grupės nariams — ta pati tema: tą pačią parą ir laiką sudaro tas pats raktas.
  const [tema, namuDarbai] = TEMOS[(Number(p.dataISO.slice(8)) + Number(p.laikas.slice(0, 2))) % TEMOS.length]
  await payload.create({
    collection: 'zurnalas',
    overrideAccess: true,
    data: {
      data: p.dataISO,
      laikas: p.laikas,
      trukmeMin: p.trukme,
      mokinys: p.mokinys.id,
      tipas: p.tipas,
      grupe: p.grupesId == null ? null : Number(p.grupesId),
      busena: siandienos ? 'suplanuota' : ivyko ? 'ivyko' : 'neivyko',
      tema: ivyko ? tema : null,
      namuDarbai: ivyko ? namuDarbai : null,
      atsiliepimas: ivyko && eile % 3 === 0 ? 'Dirbo atidžiai, liko pasikartoti dalybą.' : null,
      kaina: pamokosKaina(kainos, p.tipas, false),
      pirmaPamoka: false,
      // Priminimas „išsiųstas“ tos dienos rytą — kaip būtų padaręs cron'as.
      issiusta: momentas(p.dataISO, '07:30').toISOString(),
    } as never,
    // Tema grupei jau įrašoma kiekvienam nariui — kopijuoti nėra ko.
    context: { dienynoGrupesKopija: true },
  })
}

// ─── Kitos savaitės išimtys ───────────────────────────────────────────────

const id = (vardas: string) => String(mokiniai[vardas])

// Jonas: antradienio pamoka perkelta į trečiadienį 16:00.
await perkelkPamoka(
  { vieta: { data: kita(2), laikas: '17:00', mokinys: id('Jonas'), grupe: null }, irasoId: null },
  kita(3),
  '16:00',
)

// Ugnė: pirmadienio pamoka atšaukta.
const [ugnesPamoka] = await irasykPamoka({ data: kita(1), laikas: '15:00', mokinys: id('Ugnė'), grupe: null })
await payload.update({ collection: 'zurnalas', id: ugnesPamoka, overrideAccess: true, data: { busena: 'atsaukta' } })

// Grupė: penktadienį valanda vėliau.
await perkelkPamoka(
  { vieta: { data: kita(5), laikas: '16:00', mokinys: null, grupe: String(grupe8.id) }, irasoId: null },
  kita(5),
  '17:00',
)

// Lukas: papildoma pamoka prieš kontrolinį.
await sukurkPamoka(`m:${mokiniai.Lukas}`, kita(6), '14:00', 60)

// ─── Rezervacijos ir dienynas ─────────────────────────────────────────────

for (const [data, laikas, vaikas, busena] of [
  [kita(4), '14:00', 'Domas', 'nauja'],
  [pridekDienas(kita(2), 7), '13:00', 'Saulė', 'patvirtinta'],
] as const) {
  await payload.create({
    collection: 'rezervacijos',
    overrideAccess: true,
    data: {
      santrauka: `${vaikas} · ${data} ${laikas}`,
      data,
      laikas,
      busena,
      tevoVardas: `${vaikas} tėvai`,
      vaikoVardas: vaikas,
      klase: '7',
      elPastas: `${vaikas.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}@example.invalid`,
      saltinis: 'mock',
    } as never,
  })
}

await payload.create({
  collection: 'dienyno-paskyros',
  overrideAccess: true,
  data: { ...MOCK_DIENYNAS, mokiniai: [mokiniai.Ugnė], keistiSlaptazodi: false } as never,
})

const { totalDocs } = await payload.count({ collection: 'zurnalas', overrideAccess: true })
console.log(`Mock bazė paruošta: ${Object.keys(mokiniai).length} mokiniai, 2 grupės, ${totalDocs} pamokų žurnale.`)
process.exit(0)
