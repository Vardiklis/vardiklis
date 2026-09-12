/**
 * Pamokų pasikartojimo patikra.
 *
 * Paleidimas:  npm run patikra:pamokos
 *
 * KODĖL BŪTENT ŠI LOGIKA TIKRINAMA. `arVyksta()` yra vieta, kurios klaida
 * nesimato iš karto: pamoka tyliai negauna priminimo arba kalendoriuje
 * atsilaisvina laikas, kuris iš tikrųjų užimtas. Pamatai tai ne iškart, o kai
 * tėvai parašo „mums niekas nepranešė“ — todėl čia tikrinamos ribos, mėnesio
 * intervalai ir senų įrašų suderinamumas.
 *
 * Duomenų bazės nereikia: `arVyksta()` yra gryna funkcija.
 */

import { arVyksta, santrauka, type Pamoka } from '../lib/pamokos'

let klaidu = 0

function tikrink(ka: string, gauta: unknown, laukta: unknown): void {
  if (gauta === laukta) {
    console.log(`  ✓ ${ka}`)
  } else {
    klaidu++
    console.error(`  ✖ ${ka}\n      laukta ${JSON.stringify(laukta)}, gauta ${JSON.stringify(gauta)}`)
  }
}

/** Ar pamoka vyksta visomis išvardintomis dienomis ir nevyksta kitomis. */
function dienos(ka: string, pamoka: Pamoka, vyksta: string[], nevyksta: string[]): void {
  const blogos = [
    ...vyksta.filter((d) => !arVyksta(pamoka, d)).map((d) => `turėjo vykti ${d}`),
    ...nevyksta.filter((d) => arVyksta(pamoka, d)).map((d) => `neturėjo vykti ${d}`),
  ]
  if (blogos.length === 0) {
    console.log(`  ✓ ${ka}`)
  } else {
    klaidu++
    console.error(`  ✖ ${ka}\n      ${blogos.join('\n      ')}`)
  }
}

// 2026-09-07 yra pirmadienis; 09-14, 09-21, 09-28 — irgi.
console.log('\n1. Seni įrašai (be pasikartojimo laukų) elgiasi kaip anksčiau')
dienos(
  'kas savaitę pirmadieniais',
  { laikas: '17:00', savaitesDiena: '1' },
  ['2026-09-07', '2026-09-14', '2026-09-21', '2027-03-01'],
  ['2026-09-08', '2026-09-13'],
)

console.log('\n2. „Nuo kada“ veikia ir kas savaitę (anksčiau laukas buvo paslėptas)')
dienos(
  'pirmadieniais nuo 2026-09-14',
  { laikas: '17:00', savaitesDiena: '1', nuoDatos: '2026-09-14' },
  ['2026-09-14', '2026-09-21'],
  ['2026-09-07', '2026-09-13'],
)

console.log('\n3. „Iki kada“ imtinai')
dienos(
  'pirmadieniais iki 2026-09-21',
  { laikas: '17:00', savaitesDiena: '1', ikiDatos: '2026-09-21' },
  ['2026-09-07', '2026-09-21'],
  ['2026-09-28', '2026-10-05'],
)
dienos(
  'langas 2026-09-14 … 2026-09-21',
  { laikas: '17:00', savaitesDiena: '1', nuoDatos: '2026-09-14', ikiDatos: '2026-09-21' },
  ['2026-09-14', '2026-09-21'],
  ['2026-09-07', '2026-09-28'],
)

console.log('\n4. Kas 2 savaites — atskaitos taškas')
dienos(
  'kas 2 sav. nuo 2026-09-07',
  { laikas: '17:00', savaitesDiena: '1', kasKiek: '2', nuoDatos: '2026-09-07' },
  ['2026-09-07', '2026-09-21', '2026-10-05'],
  ['2026-09-14', '2026-09-28', '2026-08-31'],
)

console.log('\n5. Kas mėnesį')
dienos(
  'kas mėnesio 15 d.',
  { laikas: '17:00', kartojimas: 'menuo', menesioDiena: 15 },
  ['2026-09-15', '2026-10-15', '2027-01-15'],
  ['2026-09-14', '2026-09-16'],
)
dienos(
  'vasario 30-osios nėra',
  { laikas: '17:00', kartojimas: 'menuo', menesioDiena: 30 },
  ['2026-01-30', '2026-03-30'],
  ['2026-02-28'],
)

console.log('\n6. Kas 2 mėnesius — serija prasideda nuo PIRMOS pamokos')
dienos(
  'kas 2 mėn. 15 d., nuo 2026-09-15',
  { laikas: '17:00', kartojimas: 'menuo', menesioDiena: 15, kasKiekMenesiu: '2', nuoDatos: '2026-09-15' },
  ['2026-09-15', '2026-11-15', '2027-01-15'],
  ['2026-10-15', '2026-12-15', '2026-07-15'],
)
/**
 * Svarbiausias atvejis: „Nuo kada“ yra PO to mėnesio dienos, tad rugsėjo 15-oji
 * jau pražiūrėta ir pirmoji pamoka yra spalio 15-oji. Serija turi atsistoti ant
 * spalio, ne ant lapkričio.
 */
dienos(
  'kas 2 mėn. 15 d., nuo 2026-09-20 → pirmoji spalio 15',
  { laikas: '17:00', kartojimas: 'menuo', menesioDiena: 15, kasKiekMenesiu: '2', nuoDatos: '2026-09-20' },
  ['2026-10-15', '2026-12-15', '2027-02-15'],
  ['2026-09-15', '2026-11-15'],
)
dienos(
  'kas 3 mėn. 1 d., nuo 2026-09-01, iki 2027-03-31',
  {
    laikas: '17:00',
    kartojimas: 'menuo',
    menesioDiena: 1,
    kasKiekMenesiu: '3',
    nuoDatos: '2026-09-01',
    ikiDatos: '2027-03-31',
  },
  ['2026-09-01', '2026-12-01', '2027-03-01'],
  ['2026-10-01', '2027-06-01'],
)

console.log('\n7. Payload datos laukas atiduoda pilną ISO momentą')
dienos(
  'nuoDatos su laiku ir juosta',
  { laikas: '17:00', savaitesDiena: '1', nuoDatos: '2026-09-14T00:00:00.000Z' },
  ['2026-09-14'],
  ['2026-09-07'],
)

console.log('\n8. Neužpildytos eilutės nieko nerodo')
tikrink('be laiko', arVyksta({ savaitesDiena: '1' }, '2026-09-07'), false)
tikrink('be savaitės dienos', arVyksta({ laikas: '17:00' }, '2026-09-07'), false)
tikrink(
  'mėnesinė be mėnesio dienos',
  arVyksta({ laikas: '17:00', kartojimas: 'menuo' }, '2026-09-15'),
  false,
)
tikrink(
  'apverstas langas neduoda nė vienos pamokos',
  arVyksta(
    { laikas: '17:00', savaitesDiena: '1', nuoDatos: '2026-10-01', ikiDatos: '2026-09-01' },
    '2026-09-07',
  ),
  false,
)

console.log('\n9. Eilutės antraštė CMS skydelyje')
tikrink(
  'kas savaitę',
  santrauka({ laikas: '17:00', savaitesDiena: '1' }),
  'Kas savaitę, pirmadieniais 17:00',
)
tikrink(
  'kas 2 sav. su langu',
  santrauka({ laikas: '17:00', savaitesDiena: '1', kasKiek: '2', nuoDatos: '2026-09-07', ikiDatos: '2027-06-15' }),
  'Kas 2 sav., pirmadieniais 17:00 · nuo 2026-09-07, iki 2027-06-15',
)
tikrink(
  'kas 2 mėn.',
  santrauka({ laikas: '17:00', kartojimas: 'menuo', menesioDiena: 15, kasKiekMenesiu: '2' }),
  'Kas 2 mėn. 15 d., 17:00',
)
tikrink('tuščia eilutė', santrauka({}), 'Nauja pamoka')

console.log(klaidu === 0 ? '\n✓ Visos patikros praėjo.\n' : `\n✖ Nepavyko patikrų: ${klaidu}\n`)
process.exit(klaidu === 0 ? 0 : 1)
