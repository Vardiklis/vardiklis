import { nsd, atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { sk4 } from './ketvirtokams-bendra'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 5 klasės tema „Dalumas“ — dešimt potemių.
 *
 * Anksčiau jos rėmėsi `dalumo-pozymiai` ir `dalumas` generatoriais: visos
 * keturios dalumo požymių potemės gaudavo tą patį klausimą apie bet kurį
 * daliklį, o skirtingi požymiai turi skirtingą taisyklę — iš 10 sprendžiama
 * pagal paskutinį skaitmenį, iš 3 ir 9 — pagal skaitmenų sumą, iš 4 — pagal
 * dviejų paskutinių skaitmenų skaičių. Todėl kiekvienas požymis turi savo
 * generatorių, ir kiekvienas klausia būtent apie savo taisyklę.
 */

/** Visi skaičiaus dalikliai. */
function dalikliai(n: number): number[] {
  const rez: number[] = []
  for (let i = 1; i <= n; i += 1) if (n % i === 0) rez.push(i)
  return rez
}

/** Ar skaičius pirminis. */
function pirminis(n: number): boolean {
  if (n < 2) return false
  for (let i = 2; i * i <= n; i += 1) if (n % i === 0) return false
  return true
}

/** Skaidinys pirminiais dauginamaisiais. */
function skaidinys(n: number): number[] {
  const rez: number[] = []
  let likutis = n
  for (let d = 2; d * d <= likutis; d += 1) {
    while (likutis % d === 0) {
      rez.push(d)
      likutis /= d
    }
  }
  if (likutis > 1) rez.push(likutis)
  return rez
}

/** Mažiausiasis bendrasis kartotinis. */
function mbk2(a: number, b: number): number {
  return (a * b) / nsd(a, b)
}

/** Skaitmenų suma. */
function skaitmenuSuma(n: number): number {
  return String(n)
    .split('')
    .reduce((s, c) => s + Number(c), 0)
}

// ── 3.1.1. Dalijame iš 10 ir iš 100 ─────────────────────────────────────────

const T1 = 'dalumas-is-10-ir-100'

const A_10 = [
  {
    klausimas: 'Ar $4\\,530$ dalus iš 10?',
    atsakymas: 'a',
    atsakymasRodymui: 'taip',
    sprendimas: 'Skaičius baigiasi nuliu.',
  },
] as const

export const dalumasIs10Ir100: Generatorius = () => suBandymais(kurk10, A_10, T1)

function kurk10(): Uzdavinys | null {
  const n = atsitiktinis(1200, 98000)

  return variacija([
    // 1. Ar dalus iš 10
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Ar $${sk4(n)}$ dalus iš 10?`,
        variantai:
          n % 10 === 0
            ? [
                'taip, skaičius baigiasi nuliu',
                'ne, skaičius nesibaigia nuliu',
                'to nustatyti neįmanoma neatlikus dalybos',
              ]
            : [
                'ne, skaičius nesibaigia nuliu',
                'taip, skaičius baigiasi nuliu',
                'to nustatyti neįmanoma neatlikus dalybos',
              ],
        teisingas: 0,
        sprendimas: `Iš 10 dalūs tik tie skaičiai, kurie baigiasi nuliu; čia paskutinis skaitmuo yra ${n % 10}.`,
      }),

    // 2. Dalumo iš 10 požymis
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kaip atpažinti, ar skaičius dalus iš 10?',
        variantai: [
          'jis baigiasi nuliu',
          'jo skaitmenų suma dali iš 10',
          'jis baigiasi lyginiu skaitmeniu',
          'jo pirmasis skaitmuo yra 1',
        ],
        teisingas: 0,
        sprendimas: 'Dešimtimis skaičius dalijasi tik tada, kai vienetų skiltyje yra nulis.',
      }),

    // 3. Dalumo iš 100 požymis
    () => {
      const su = atsitiktinis(12, 980) * 100
      const be = su + atsitiktinis(1, 99)
      const variantai = sumaisyk([`$${sk4(su)}$`, `$${sk4(be)}$`, `$${sk4(be + 10)}$`])
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuris skaičius dalus iš 100?',
        variantai,
        teisingas: variantai.indexOf(`$${sk4(su)}$`),
        sprendimas: 'Iš 100 dalūs skaičiai baigiasi dviem nuliais.',
      })
    },

    // 4. Dalyba iš 10
    () => {
      const k = atsitiktinis(124, 9800)
      return uzdavinys(T1, {
        klausimas: `Apskaičiuok: $${sk4(k * 10)} : 10$.`,
        atsakymas: String(k),
        atsakymasRodymui: `$${sk4(k)}$`,
        sprendimas: 'Dalijant iš 10 nubraukiamas vienas nulis.',
      })
    },

    // 5. Kiek trūksta iki dalaus
    () => {
      if (n % 10 === 0) return null
      return uzdavinys(T1, {
        klausimas: `Kiek reikia pridėti prie $${sk4(n)}$, kad gautųsi iš 10 dalus skaičius?`,
        atsakymas: String(10 - (n % 10)),
        atsakymasRodymui: `$${10 - (n % 10)}$`,
        sprendimas: `Paskutinis skaitmuo yra ${n % 10}, tad iki nulio trūksta $10 - ${n % 10} = ${10 - (n % 10)}$.`,
      })
    },

    // 6. Kiek dalių iš 10 tarp dviejų skaičių
    () => {
      const nuo = atsitiktinis(10, 40) * 10
      const iki = nuo + atsitiktinis(5, 12) * 10
      return uzdavinys(T1, {
        klausimas: `Kiek yra iš 10 dalių skaičių nuo $${sk4(nuo)}$ iki $${sk4(iki)}$ imtinai?`,
        atsakymas: String((iki - nuo) / 10 + 1),
        atsakymasRodymui: `$${(iki - nuo) / 10 + 1}$`,
        sprendimas: `$(${sk4(iki)} - ${sk4(nuo)}) : 10 + 1 = ${(iki - nuo) / 10 + 1}$.`,
      })
    },

    // 7. Dalumas iš 10 ir iš 100 kartu
    () => {
      const k = atsitiktinis(12, 98) * 10
      const arIs100 = k % 100 === 0
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Skaičius $${sk4(k)}$ dalus iš 10. Ar jis dalus ir iš 100?`,
        variantai: arIs100
          ? ['taip, jis baigiasi dviem nuliais', 'ne, jis baigiasi tik vienu nuliu', 'to nustatyti neįmanoma']
          : ['ne, jis baigiasi tik vienu nuliu', 'taip, jis baigiasi dviem nuliais', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Kiekvienas iš 100 dalus skaičius dalus ir iš 10, bet atvirkščiai — ne visada.',
      })
    },
  ])
}

// ── 3.1.2. Dalijame iš 5 ir iš 2 ────────────────────────────────────────────

const T2 = 'dalumas-is-5-ir-2'

const A_5 = [
  {
    klausimas: 'Ar $3\\,475$ dalus iš 5?',
    atsakymas: 'a',
    atsakymasRodymui: 'taip',
    sprendimas: 'Skaičius baigiasi penketu.',
  },
] as const

export const dalumasIs5Ir2: Generatorius = () => suBandymais(kurk5, A_5, T2)

function kurk5(): Uzdavinys | null {
  const n = atsitiktinis(1200, 98000)

  return variacija([
    // 1. Ar dalus iš 5
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ar $${sk4(n)}$ dalus iš 5?`,
        variantai:
          n % 5 === 0
            ? [
                `taip, skaičius baigiasi ${n % 10}`,
                'ne, paskutinis skaitmuo nėra 0 ar 5',
                'to nustatyti neįmanoma neatlikus dalybos',
              ]
            : [
                `ne, paskutinis skaitmuo yra ${n % 10}`,
                'taip, skaičius baigiasi 0 arba 5',
                'to nustatyti neįmanoma neatlikus dalybos',
              ],
        teisingas: 0,
        sprendimas: 'Iš 5 dalūs skaičiai baigiasi nuliu arba penketu.',
      }),

    // 2. Ar dalus iš 2
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ar $${sk4(n)}$ dalus iš 2?`,
        variantai:
          n % 2 === 0
            ? [
                `taip, paskutinis skaitmuo ${n % 10} yra lyginis`,
                `ne, paskutinis skaitmuo ${n % 10} yra nelyginis`,
                'to nustatyti neįmanoma neatlikus dalybos',
              ]
            : [
                `ne, paskutinis skaitmuo ${n % 10} yra nelyginis`,
                `taip, paskutinis skaitmuo ${n % 10} yra lyginis`,
                'to nustatyti neįmanoma neatlikus dalybos',
              ],
        teisingas: 0,
        sprendimas: 'Iš 2 dalūs visi lyginiai skaičiai — tie, kurie baigiasi 0, 2, 4, 6 arba 8.',
      }),

    // 3. Dalumo iš 5 požymis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kaip atpažinti, ar skaičius dalus iš 5?',
        variantai: [
          'jis baigiasi 0 arba 5',
          'jo skaitmenų suma dali iš 5',
          'jis baigiasi lyginiu skaitmeniu',
          'jis didesnis už 5',
        ],
        teisingas: 0,
        sprendimas: 'Sprendžiama tik pagal paskutinį skaitmenį.',
      }),

    // 4. Dalus ir iš 2, ir iš 5
    () => {
      const variantai = sumaisyk([
        `$${sk4(atsitiktinis(12, 98) * 10)}$`,
        `$${sk4(atsitiktinis(12, 98) * 10 + 5)}$`,
        `$${sk4(atsitiktinis(12, 98) * 10 + 2)}$`,
      ])
      const teisingas = variantai.findIndex((v) => {
        const x = Number(v.replace(/[^0-9]/g, ''))
        return x % 10 === 0
      })
      if (teisingas < 0) return null
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuris skaičius dalus ir iš 2, ir iš 5?',
        variantai,
        teisingas,
        sprendimas: 'Iš abiejų dalūs tie skaičiai, kurie baigiasi nuliu.',
      })
    },

    // 5. Kiek trūksta iki dalaus iš 5
    () => {
      if (n % 5 === 0) return null
      return uzdavinys(T2, {
        klausimas: `Kiek reikia pridėti prie $${sk4(n)}$, kad gautųsi iš 5 dalus skaičius?`,
        atsakymas: String(5 - (n % 5)),
        atsakymasRodymui: `$${5 - (n % 5)}$`,
        sprendimas: `$${sk4(n)}$ dalijant iš 5 lieka ${n % 5}, tad trūksta $5 - ${n % 5} = ${5 - (n % 5)}$.`,
      })
    },

    // 6. Klaidos radimas
    () => {
      const nelyginis = atsitiktinis(12, 98) * 10 + pasirink([1, 3, 7, 9])
      return uzdavinys(T2, {
        klausimas: `Mokinys teigia, kad $${sk4(nelyginis)}$ dalus iš 2, nes jis didelis. Koks yra šio skaičiaus paskutinis skaitmuo?`,
        atsakymas: String(nelyginis % 10),
        atsakymasRodymui: `$${nelyginis % 10}$`,
        sprendimas: 'Dalumą iš 2 lemia tik paskutinis skaitmuo, o ne skaičiaus dydis: čia jis nelyginis.',
      })
    },

    // 7. Kiek lyginių tarp dviejų skaičių
    () => {
      const nuo = atsitiktinis(10, 60) * 2
      const kiek = atsitiktinis(4, 12)
      const iki = nuo + kiek * 2
      return uzdavinys(T2, {
        klausimas: `Kiek lyginių skaičių yra nuo $${sk4(nuo)}$ iki $${sk4(iki)}$ imtinai?`,
        atsakymas: String(kiek + 1),
        atsakymasRodymui: `$${kiek + 1}$`,
        sprendimas: `$(${sk4(iki)} - ${sk4(nuo)}) : 2 + 1 = ${kiek + 1}$.`,
      })
    },
  ])
}

// ── 3.1.3. Dalijame iš 9 ir iš 3 ────────────────────────────────────────────

const T3 = 'dalumas-is-9-ir-3'

const A_9 = [
  {
    klausimas: 'Ar $342$ dalus iš 3?',
    atsakymas: 'a',
    atsakymasRodymui: 'taip',
    sprendimas: '$3 + 4 + 2 = 9$, o 9 dalus iš 3.',
  },
] as const

export const dalumasIs9Ir3: Generatorius = () => suBandymais(kurk9, A_9, T3)

function kurk9(): Uzdavinys | null {
  const n = atsitiktinis(120, 9800)
  const suma = skaitmenuSuma(n)

  return variacija([
    // 1. Ar dalus iš 3
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Ar $${sk4(n)}$ dalus iš 3?`,
        variantai:
          n % 3 === 0
            ? [
                `taip, skaitmenų suma ${suma} dali iš 3`,
                `ne, skaitmenų suma ${suma} nedali iš 3`,
                'to nustatyti pagal skaitmenų sumą neįmanoma',
              ]
            : [
                `ne, skaitmenų suma ${suma} nedali iš 3`,
                `taip, skaitmenų suma ${suma} dali iš 3`,
                'to nustatyti pagal skaitmenų sumą neįmanoma',
              ],
        teisingas: 0,
        sprendimas: `Skaitmenų suma: $${String(n).split('').join(' + ')} = ${suma}$.`,
      }),

    // 2. Ar dalus iš 9
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Ar $${sk4(n)}$ dalus iš 9?`,
        variantai:
          n % 9 === 0
            ? [
                `taip, skaitmenų suma ${suma} dali iš 9`,
                `ne, skaitmenų suma ${suma} nedali iš 9`,
                'to nustatyti pagal skaitmenų sumą neįmanoma',
              ]
            : [
                `ne, skaitmenų suma ${suma} nedali iš 9`,
                `taip, skaitmenų suma ${suma} dali iš 9`,
                'to nustatyti pagal skaitmenų sumą neįmanoma',
              ],
        teisingas: 0,
        sprendimas: `Skaitmenų suma: $${String(n).split('').join(' + ')} = ${suma}$.`,
      }),

    // 3. Požymis
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip atpažinti, ar skaičius dalus iš 9?',
        variantai: [
          'jo skaitmenų suma dali iš 9',
          'jis baigiasi devynetu',
          'jis baigiasi nuliu',
          'jo pirmasis skaitmuo yra 9',
        ],
        teisingas: 0,
        sprendimas: 'Iš 3 ir iš 9 dalumas nustatomas pagal skaitmenų sumą, o ne pagal paskutinį skaitmenį.',
      }),

    // 4. Skaitmenų suma
    () =>
      uzdavinys(T3, {
        klausimas: `Kokia yra skaičiaus $${sk4(n)}$ skaitmenų suma?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${String(n).split('').join(' + ')} = ${suma}$.`,
      }),

    // 5. Trūkstamas skaitmuo
    () => {
      const pagrindas = atsitiktinis(12, 98) * 10
      const trukstamas = (3 - (skaitmenuSuma(pagrindas) % 3)) % 3
      return uzdavinys(T3, {
        klausimas: `Koks mažiausias skaitmuo turi būti vietoj klaustuko, kad skaičius $${Math.floor(pagrindas / 10)}?$ būtų dalus iš 3?`,
        atsakymas: String(trukstamas),
        atsakymasRodymui: `$${trukstamas}$`,
        sprendimas: `Žinomų skaitmenų suma yra ${skaitmenuSuma(Math.floor(pagrindas / 10))}, tad iki artimiausio iš 3 dalaus skaičiaus trūksta ${trukstamas}.`,
      })
    },

    // 6. Iš 9 dalus reiškia ir iš 3
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ar kiekvienas iš 9 dalus skaičius dalus ir iš 3?',
        variantai: [
          'taip, nes 9 dalus iš 3',
          'ne, tai nesusiję požymiai',
          'taip, bet tik jei skaičius lyginis',
        ],
        teisingas: 0,
        sprendimas: 'Jei skaitmenų suma dali iš 9, ji dali ir iš 3 — atvirkščiai ne visada.',
      }),

    // 7. Klaidos radimas
    () => {
      const trys = atsitiktinis(12, 98) * 3
      if (trys % 9 === 0) return null
      return uzdavinys(T3, {
        klausimas: `Mokinys teigia, kad $${sk4(trys)}$ dalus iš 9, nes jis dalus iš 3. Kokia yra šio skaičiaus skaitmenų suma?`,
        atsakymas: String(skaitmenuSuma(trys)),
        atsakymasRodymui: `$${skaitmenuSuma(trys)}$`,
        sprendimas: `Skaitmenų suma ${skaitmenuSuma(trys)} dali iš 3, bet ne iš 9, tad iš 9 skaičius nesidalija.`,
      })
    },
  ])
}

// ── 3.1.4. Dalijame iš 4 ────────────────────────────────────────────────────

const T4 = 'dalumas-is-4'

const A_4 = [
  {
    klausimas: 'Ar $1\\,316$ dalus iš 4?',
    atsakymas: 'a',
    atsakymasRodymui: 'taip',
    sprendimas: 'Du paskutiniai skaitmenys sudaro 16, o 16 dalus iš 4.',
  },
] as const

export const dalumasIs4: Generatorius = () => suBandymais(kurk4, A_4, T4)

function kurk4(): Uzdavinys | null {
  const n = atsitiktinis(1200, 9800)
  const galas = n % 100

  return variacija([
    // 1. Ar dalus iš 4
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Ar $${sk4(n)}$ dalus iš 4?`,
        variantai:
          n % 4 === 0
            ? [
                `taip, du paskutiniai skaitmenys sudaro ${galas}, o ${galas}` + ' dalus iš 4',
                `ne, ${galas}` + ' nedalus iš 4',
                'to nustatyti pagal du paskutinius skaitmenis neįmanoma',
              ]
            : [
                `ne, ${galas}` + ' nedalus iš 4',
                `taip, ${galas}` + ' dalus iš 4',
                'to nustatyti pagal du paskutinius skaitmenis neįmanoma',
              ],
        teisingas: 0,
        sprendimas: `Dalumą iš 4 lemia skaičius, sudarytas iš dviejų paskutinių skaitmenų: čia tai ${galas}.`,
      }),

    // 2. Požymis
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kaip atpažinti, ar skaičius dalus iš 4?',
        variantai: [
          'iš dviejų paskutinių skaitmenų sudarytas skaičius dalus iš 4',
          'skaičius baigiasi ketvertu',
          'skaitmenų suma dali iš 4',
          'skaičius lyginis',
        ],
        teisingas: 0,
        sprendimas: 'Šimtai visada dalūs iš 4, tad lemia tik dešimtys ir vienetai.',
      }),

    // 3. Kodėl užtenka dviejų skaitmenų
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kodėl tikrinant dalumą iš 4 pakanka žiūrėti į du paskutinius skaitmenis?',
        variantai: [
          'nes 100 dalus iš 4, tad ir visi šimtai dalūs',
          'nes skaičiai visada keturženkliai',
          'nes 4 yra lyginis skaičius',
          'nes taip lengviau skaičiuoti',
        ],
        teisingas: 0,
        sprendimas: '$100 : 4 = 25$, tad šimtų dalis dalumo nekeičia.',
      }),

    // 4. Lyginis, bet nedalus iš 4
    () => {
      const nedalus = atsitiktinis(12, 98) * 100 + pasirink([2, 6, 10, 14, 18])
      if (nedalus % 4 === 0) return null
      return uzdavinys(T4, {
        klausimas: `Skaičius $${sk4(nedalus)}$ yra lyginis. Kokia liekana gaunama jį dalijant iš 4?`,
        atsakymas: String(nedalus % 4),
        atsakymasRodymui: `$${nedalus % 4}$`,
        sprendimas: `Ne kiekvienas lyginis skaičius dalus iš 4: čia $${nedalus % 100} : 4$ duoda liekaną ${nedalus % 4}.`,
      })
    },

    // 5. Trūkstamas skaitmuo
    () => {
      const desimtys = atsitiktinis(1, 9)
      const pagrindas = atsitiktinis(12, 98) * 100 + desimtys * 10
      const vienetai = (4 - (pagrindas % 4)) % 4
      return uzdavinys(T4, {
        klausimas: `Koks mažiausias skaitmuo turi būti vienetų skiltyje, kad skaičius $${sk4(pagrindas)}$ pakeitus paskutinį skaitmenį taptų dalus iš 4?`,
        atsakymas: String(vienetai),
        atsakymasRodymui: `$${vienetai}$`,
        sprendimas: `Dviejų paskutinių skaitmenų skaičius yra ${pagrindas % 100}; pridėjus ${vienetai} gaunamas iš 4 dalus ${(pagrindas % 100) + vienetai}.`,
      })
    },

    // 6. Kuris iš trijų dalus
    () => {
      const dalus = atsitiktinis(300, 2400) * 4
      const nedalus1 = dalus + 2
      const nedalus2 = dalus + 1
      const variantai = sumaisyk([`$${sk4(dalus)}$`, `$${sk4(nedalus1)}$`, `$${sk4(nedalus2)}$`])
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuris skaičius dalus iš 4?',
        variantai,
        teisingas: variantai.indexOf(`$${sk4(dalus)}$`),
        sprendimas: 'Tikrinami du paskutiniai kiekvieno skaičiaus skaitmenys.',
      })
    },

    // 7. Dalumas iš 4 ir iš 2
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ar kiekvienas iš 4 dalus skaičius dalus ir iš 2?',
        variantai: [
          'taip, nes 4 dalus iš 2',
          'ne, tai nesusiję požymiai',
          'taip, bet tik jei jis baigiasi nuliu',
        ],
        teisingas: 0,
        sprendimas: 'Atvirkščiai negalioja: 6 dalus iš 2, bet ne iš 4.',
      }),
  ])
}

// ── 3.2.1. Skaičiaus dalikliai ──────────────────────────────────────────────

const T5 = 'skaiciaus-dalikliai'

const A_DALIKLIAI = [
  {
    klausimas: 'Išvardyk visus skaičiaus 12 daliklius. Kiek jų yra?',
    atsakymas: '6',
    atsakymasRodymui: '$6$ (1, 2, 3, 4, 6, 12)',
    sprendimas: 'Dalikliai yra skaičiai, iš kurių 12 dalijasi be liekanos.',
  },
] as const

export const skaiciausDalikliai: Generatorius = () => suBandymais(kurkDaliklius, A_DALIKLIAI, T5)

function kurkDaliklius(): Uzdavinys | null {
  const n = atsitiktinis(12, 90)
  const d = dalikliai(n)

  return variacija([
    // 1. Kiek daliklių
    () =>
      uzdavinys(T5, {
        klausimas: `Kiek daliklių turi skaičius ${n}?`,
        atsakymas: String(d.length),
        atsakymasRodymui: `$${d.length}$ (${d.join(', ')})`,
        sprendimas: `Dalikliai: ${d.join(', ')}.`,
      }),

    // 2. Ar skaičius yra daliklis
    () => {
      const kandidatas = atsitiktinis(2, 12)
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Ar ${kandidatas} yra skaičiaus ${n} daliklis?`,
        variantai:
          n % kandidatas === 0
            ? [
                `taip, $${n} : ${kandidatas} = ${n / kandidatas}$ be liekanos`,
                `ne, dalijant lieka liekana`,
                'to nustatyti neįmanoma',
              ]
            : [
                `ne, dalijant lieka liekana ${n % kandidatas}`,
                `taip, dalijasi be liekanos`,
                'to nustatyti neįmanoma',
              ],
        teisingas: 0,
        sprendimas: 'Daliklis yra skaičius, iš kurio dalijama be liekanos.',
      })
    },

    // 3. Didžiausias daliklis, mažesnis už patį skaičių
    () => {
      const be = d.filter((x) => x < n)
      return uzdavinys(T5, {
        klausimas: `Koks yra didžiausias skaičiaus ${n} daliklis, mažesnis už patį ${n}?`,
        atsakymas: String(Math.max(...be)),
        atsakymasRodymui: `$${Math.max(...be)}$`,
        sprendimas: `Dalikliai: ${d.join(', ')}.`,
      })
    },

    // 4. Kurie skaičiai yra dalikliai
    () => {
      const trys = sumaisyk([2, 3, 4, 5, 6, 9]).slice(0, 3)
      const dalus = trys.filter((x) => n % x === 0)
      if (dalus.length === 0 || dalus.length === 3) return null
      return uzdavinys(T5, {
        klausimas: `Kiek iš skaičių ${trys.join(', ')} yra skaičiaus ${n} dalikliai?`,
        atsakymas: String(dalus.length),
        atsakymasRodymui: `$${dalus.length}$`,
        sprendimas: `${n} dalijasi be liekanos iš ${dalus.join(' ir ')}.`,
      })
    },

    // 5. Visada dalikliai
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kurie du skaičiai yra bet kurio natūraliojo skaičiaus dalikliai?`,
        variantai: ['1 ir pats skaičius', '0 ir 1', '1 ir 2', '2 ir pats skaičius'],
        teisingas: 0,
        sprendimas: `Pavyzdžiui, ${n} dalijasi ir iš 1, ir iš ${n}.`,
      }),

    // 6. Bendri dalikliai
    () => {
      const m = atsitiktinis(12, 90)
      const bendri = dalikliai(n).filter((x) => m % x === 0)
      return uzdavinys(T5, {
        klausimas: `Kiek bendrų daliklių turi skaičiai ${n} ir ${m}?`,
        atsakymas: String(bendri.length),
        atsakymasRodymui: `$${bendri.length}$ (${bendri.join(', ')})`,
        sprendimas: `Bendri dalikliai: ${bendri.join(', ')}.`,
      })
    },

    // 7. Poros
    () => {
      const be = d.filter((x) => x < n && x > 1)
      if (be.length < 3) return null
      const trys = sumaisyk(be).slice(0, 3)
      return poruUzdavinys(naujasId(T5), T5, {
        klausimas: `Susiek skaičiaus ${n} daliklį su dalmeniu, kuris gaunamas iš ${n} jį padalijus.`,
        poros: trys.map((x) => ({ kaire: String(x), desine: String(n / x) })),
        sprendimas: `Dalikliai eina poromis: jų sandauga lygi ${n}.`,
      })
    },
  ])
}

// ── 3.2.2. Pirminiai ir sudėtiniai skaičiai ─────────────────────────────────

const T6 = 'pirminiai-ir-sudetiniai'

const A_PIRMINIAI = [
  {
    klausimas: 'Ar 17 yra pirminis skaičius?',
    atsakymas: 'a',
    atsakymasRodymui: 'taip',
    sprendimas: '17 dalijasi tik iš 1 ir iš 17.',
  },
] as const

export const pirminiaiIrSudetiniai: Generatorius = () =>
  suBandymais(kurkPirminius, A_PIRMINIAI, T6)

function kurkPirminius(): Uzdavinys | null {
  const n = atsitiktinis(11, 60)

  return variacija([
    // 1. Ar pirminis
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Ar ${n} yra pirminis skaičius?`,
        variantai: pirminis(n)
          ? [`taip, jis dalijasi tik iš 1 ir iš ${n}`, `ne, jis turi ir kitų daliklių`, 'to nustatyti neįmanoma']
          : [
              `ne, jis dalijasi dar ir iš ${dalikliai(n).filter((x) => x > 1 && x < n)[0]}`,
              `taip, jis dalijasi tik iš 1 ir iš ${n}`,
              'to nustatyti neįmanoma',
            ],
        teisingas: 0,
        sprendimas: `Skaičiaus ${n} dalikliai: ${dalikliai(n).join(', ')}.`,
      }),

    // 2. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Koks skaičius vadinamas pirminiu?',
        variantai: [
          'turintis lygiai du daliklius: 1 ir save patį',
          'kiekvienas nelyginis skaičius',
          'kiekvienas skaičius, didesnis už 1',
          'turintis daugiau nei du daliklius',
        ],
        teisingas: 0,
        sprendimas: 'Skaičius su daugiau nei dviem dalikliais vadinamas sudėtiniu.',
      }),

    // 3. Kuris iš trijų pirminis
    () => {
      const p = pasirink([11, 13, 17, 19, 23, 29, 31, 37, 41, 43])
      const s1 = pasirink([12, 15, 18, 21, 25, 27, 33, 35])
      const s2 = pasirink([14, 16, 22, 24, 26, 28, 34, 39])
      const variantai = sumaisyk([String(p), String(s1), String(s2)])
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kuris iš šių skaičių yra pirminis?',
        variantai,
        teisingas: variantai.indexOf(String(p)),
        sprendimas: `${p} dalijasi tik iš 1 ir iš savęs, o kiti turi daugiau daliklių.`,
      })
    },

    // 4. Ar 1 pirminis
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Ar skaičius 1 yra pirminis?',
        variantai: [
          'ne, jis turi tik vieną daliklį',
          'taip, jis dalijasi tik iš savęs',
          'taip, nes jis mažiausias natūralusis skaičius',
        ],
        teisingas: 0,
        sprendimas: 'Pirminis skaičius turi lygiai du daliklius, o vienetas — tik vieną.',
      }),

    // 5. Vienintelis lyginis pirminis
    () =>
      uzdavinys(T6, {
        klausimas: 'Koks yra vienintelis lyginis pirminis skaičius?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Visi kiti lyginiai skaičiai dalijasi dar ir iš 2, tad turi bent tris daliklius.',
      }),

    // 6. Kiek pirminių tarp dviejų
    () => {
      const nuo = atsitiktinis(10, 30)
      const iki = nuo + 10
      const kiek = Array.from({ length: iki - nuo + 1 }, (_, i) => nuo + i).filter(pirminis)
      return uzdavinys(T6, {
        klausimas: `Kiek pirminių skaičių yra nuo ${nuo} iki ${iki} imtinai?`,
        atsakymas: String(kiek.length),
        atsakymasRodymui: `$${kiek.length}$ (${kiek.join(', ')})`,
        sprendimas: `Pirminiai šiame ruože: ${kiek.join(', ')}.`,
      })
    },

    // 7. Sudėtinio skaičiaus daliklis
    () => {
      if (pirminis(n)) return null
      const maziausias = dalikliai(n).filter((x) => x > 1)[0]
      return uzdavinys(T6, {
        klausimas: `Skaičius ${n} yra sudėtinis. Koks yra mažiausias jo daliklis, didesnis už 1?`,
        atsakymas: String(maziausias),
        atsakymasRodymui: `$${maziausias}$`,
        sprendimas: `Dalikliai: ${dalikliai(n).join(', ')}.`,
      })
    },
  ])
}

// ── 3.2.3. Skaidome pirminiais dauginamaisiais ──────────────────────────────

const T7 = 'skaidymas-pirminiais'

const A_SKAIDYMAS = [
  {
    klausimas: 'Išskaidyk 60 pirminiais dauginamaisiais. Kiek dauginamųjų gaunama?',
    atsakymas: '4',
    atsakymasRodymui: '$4$ ($2 \\cdot 2 \\cdot 3 \\cdot 5$)',
    sprendimas: '$60 = 2 \\cdot 2 \\cdot 3 \\cdot 5$.',
  },
] as const

export const skaidymasPirminiais: Generatorius = () =>
  suBandymais(kurkSkaidyma, A_SKAIDYMAS, T7)

function kurkSkaidyma(): Uzdavinys | null {
  const n = atsitiktinis(12, 120)
  const s = skaidinys(n)
  if (s.length < 2) return null

  return variacija([
    // 1. Kiek dauginamųjų
    () =>
      uzdavinys(T7, {
        klausimas: `Išskaidyk ${n} pirminiais dauginamaisiais. Kiek jų gaunama?`,
        atsakymas: String(s.length),
        atsakymasRodymui: `$${s.length}$ ($${s.join(' \\cdot ')}$)`,
        sprendimas: `$${n} = ${s.join(' \\cdot ')}$.`,
      }),

    // 2. Didžiausias pirminis dauginamasis
    () =>
      uzdavinys(T7, {
        klausimas: `Koks yra didžiausias skaičiaus ${n} pirminis daliklis?`,
        atsakymas: String(Math.max(...s)),
        atsakymasRodymui: `$${Math.max(...s)}$`,
        sprendimas: `$${n} = ${s.join(' \\cdot ')}$.`,
      }),

    // 3. Mažiausias pirminis dauginamasis
    () =>
      uzdavinys(T7, {
        klausimas: `Koks yra mažiausias skaičiaus ${n} pirminis daliklis?`,
        atsakymas: String(Math.min(...s)),
        atsakymasRodymui: `$${Math.min(...s)}$`,
        sprendimas: `$${n} = ${s.join(' \\cdot ')}$.`,
      }),

    // 4. Koks skaičius išskaidytas
    () => {
      const m = atsitiktinis(12, 200)
      const sm = skaidinys(m)
      if (sm.length < 2) return null
      return uzdavinys(T7, {
        klausimas: `Koks skaičius išskaidytas taip: $${sm.join(' \\cdot ')}$?`,
        atsakymas: String(m),
        atsakymasRodymui: `$${m}$`,
        sprendimas: `Sudauginus visus dauginamuosius gaunama ${m}.`,
      })
    },

    // 5. Kiek kartų kartojasi dauginamasis
    () => {
      const daznis = new Map<number, number>()
      for (const p of s) daznis.set(p, (daznis.get(p) ?? 0) + 1)
      const daugkartinis = [...daznis.entries()].find(([, k]) => k > 1)
      if (!daugkartinis) return null
      return uzdavinys(T7, {
        klausimas: `Kiek kartų dauginamasis ${daugkartinis[0]} pasikartoja skaičiaus ${n} skaidinyje?`,
        atsakymas: String(daugkartinis[1]),
        atsakymasRodymui: `$${daugkartinis[1]}$`,
        sprendimas: `$${n} = ${s.join(' \\cdot ')}$.`,
      })
    },

    // 6. Klaidos radimas
    () => {
      const su1 = ['1', ...s.map(String)]
      return uzdavinys(T7, {
        klausimas: `Mokinys išskaidė $${n} = ${su1.join(' \\cdot ')}$. Kiek pirminių dauginamųjų turi būti skaidinyje?`,
        atsakymas: String(s.length),
        atsakymasRodymui: `$${s.length}$`,
        sprendimas: 'Vienetas nėra pirminis skaičius, tad į skaidinį jis nerašomas.',
      })
    },

    // 7. Ar teisingai išskaidyta
    () => {
      const netikslus = [...s]
      netikslus[0] = netikslus[0] * 2
      const sandauga = netikslus.reduce((a, b) => a * b, 1)
      return uzdavinys(T7, {
        klausimas: `Ar teisingai išskaidyta: $${n} = ${netikslus.join(' \\cdot ')}$? Užrašyk sandaugos reikšmę.`,
        atsakymas: String(sandauga),
        atsakymasRodymui: `$${sk4(sandauga)}$`,
        sprendimas: `Sudauginus gaunama $${sk4(sandauga)}$, o ne ${n}, tad skaidinys neteisingas. Teisingas: $${s.join(' \\cdot ')}$.`,
      })
    },
  ])
}

// ── 3.2.4. Didžiausiasis bendrasis daliklis ─────────────────────────────────

const T8 = 'didziausiasis-bendrasis-daliklis'

const A_DBD = [
  {
    klausimas: 'Rask skaičių 12 ir 18 didžiausiąjį bendrąjį daliklį.',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: 'Bendri dalikliai: 1, 2, 3, 6.',
  },
] as const

export const didziausiasisBendrasisDaliklis: Generatorius = () =>
  suBandymais(kurkDbd, A_DBD, T8)

function kurkDbd(): Uzdavinys | null {
  const a = atsitiktinis(12, 90)
  const b = atsitiktinis(12, 90)
  if (a === b) return null
  const d = nsd(a, b)

  return variacija([
    // 1. DBD
    () =>
      uzdavinys(T8, {
        klausimas: `Rask skaičių ${a} ir ${b} didžiausiąjį bendrąjį daliklį.`,
        atsakymas: String(d),
        atsakymasRodymui: `$${d}$`,
        sprendimas: `Bendri dalikliai: ${dalikliai(a).filter((x) => b % x === 0).join(', ')}. Didžiausias iš jų — ${d}.`,
      }),

    // 2. Visi bendri dalikliai
    () => {
      const bendri = dalikliai(a).filter((x) => b % x === 0)
      return uzdavinys(T8, {
        klausimas: `Kiek bendrų daliklių turi skaičiai ${a} ir ${b}?`,
        atsakymas: String(bendri.length),
        atsakymasRodymui: `$${bendri.length}$ (${bendri.join(', ')})`,
        sprendimas: `Bendri dalikliai yra ${d} dalikliai: ${bendri.join(', ')}.`,
      })
    },

    // 3. Kada DBD lygus 1
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kaip vadinami du skaičiai, kurių didžiausiasis bendrasis daliklis lygus 1?',
        variantai: ['tarpusavyje pirminiai', 'abu pirminiai', 'sudėtiniai', 'lygūs'],
        teisingas: 0,
        sprendimas: 'Pavyzdžiui, 8 ir 9 nėra pirminiai, bet bendrų daliklių, didesnių už 1, neturi.',
      }),

    // 4. DBD per skaidinius
    () => {
      const x = pasirink([12, 18, 24, 30, 36, 40, 48])
      const y = pasirink([16, 20, 27, 32, 45, 54, 60])
      return uzdavinys(T8, {
        klausimas: `Išskaidyk ${x} ir ${y} pirminiais dauginamaisiais ir rask jų didžiausiąjį bendrąjį daliklį.`,
        atsakymas: String(nsd(x, y)),
        atsakymasRodymui: `$${nsd(x, y)}$`,
        sprendimas: `$${x} = ${skaidinys(x).join(' \\cdot ')}$, $${y} = ${skaidinys(y).join(' \\cdot ')}$. Bendri dauginamieji duoda ${nsd(x, y)}.`,
      })
    },

    // 5. Kai vienas dalus iš kito
    () => {
      const maz = atsitiktinis(4, 20)
      const did = maz * atsitiktinis(2, 5)
      return uzdavinys(T8, {
        klausimas: `Rask skaičių ${maz} ir ${did} didžiausiąjį bendrąjį daliklį.`,
        atsakymas: String(maz),
        atsakymasRodymui: `$${maz}$`,
        sprendimas: `${did} dalus iš ${maz}, tad didžiausiasis bendrasis daliklis yra pats ${maz}.`,
      })
    },

    // 6. Taikymas
    () => {
      const x = d * atsitiktinis(2, 6)
      const y = d * atsitiktinis(2, 6)
      if (nsd(x, y) !== d) return null
      return uzdavinys(T8, {
        klausimas: `${x} obuoliai ir ${y} kriaušės išdalytos į kuo daugiau vienodų krepšelių taip, kad kiekviename būtų po lygiai abiejų rūšių vaisių. Kiek krepšelių gaunama?`,
        atsakymas: String(d),
        atsakymasRodymui: `$${d}$`,
        sprendimas: `Krepšelių skaičius yra didžiausiasis bendrasis ${x} ir ${y} daliklis: ${d}.`,
      })
    },

    // 7. Klaidos radimas
    () => {
      const bendras = dalikliai(a).filter((x) => b % x === 0 && x < d)
      if (bendras.length === 0) return null
      const klaidingas = Math.max(...bendras)
      return uzdavinys(T8, {
        klausimas: `Mokinys teigia, kad skaičių ${a} ir ${b} didžiausiasis bendrasis daliklis yra ${klaidingas}. Užrašyk teisingą reikšmę.`,
        atsakymas: String(d),
        atsakymasRodymui: `$${d}$`,
        sprendimas: `${klaidingas} tikrai yra bendras daliklis, bet ne didžiausias: abu skaičiai dalūs ir iš ${d}.`,
      })
    },
  ])
}

// ── 3.3.1. Skaičiaus kartotiniai ────────────────────────────────────────────

const T9 = 'skaiciaus-kartotiniai'

const A_KARTOTINIAI = [
  {
    klausimas: 'Koks yra trečiasis skaičiaus 7 kartotinis?',
    atsakymas: '21',
    atsakymasRodymui: '$21$',
    sprendimas: '$7 \\cdot 3 = 21$.',
  },
] as const

export const skaiciausKartotiniai: Generatorius = () =>
  suBandymais(kurkKartotinius, A_KARTOTINIAI, T9)

function kurkKartotinius(): Uzdavinys | null {
  const n = atsitiktinis(3, 18)

  return variacija([
    // 1. Kelintas kartotinis
    () => {
      const k = atsitiktinis(3, 9)
      return uzdavinys(T9, {
        klausimas: `Koks yra ${k}-asis skaičiaus ${n} kartotinis?`,
        atsakymas: String(n * k),
        atsakymasRodymui: `$${n * k}$`,
        sprendimas: `$${n} \\cdot ${k} = ${n * k}$.`,
      })
    },

    // 2. Ar skaičius yra kartotinis
    () => {
      const kandidatas = atsitiktinis(20, 200)
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Ar ${kandidatas} yra skaičiaus ${n} kartotinis?`,
        variantai:
          kandidatas % n === 0
            ? [`taip, $${kandidatas} = ${n} \\cdot ${kandidatas / n}$`, 'ne, dalijant lieka liekana', 'to nustatyti neįmanoma']
            : [`ne, dalijant lieka liekana ${kandidatas % n}`, 'taip, jis dalus be liekanos', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Kartotinis yra skaičius, kuris dalijasi iš duotojo be liekanos.',
      })
    },

    // 3. Pirmieji kartotiniai
    () =>
      uzdavinys(T9, {
        klausimas: `Užrašyk pirmuosius penkis skaičiaus ${n} kartotinius. Koks paskutinis iš jų?`,
        atsakymas: String(n * 5),
        atsakymasRodymui: `$${n * 5}$`,
        sprendimas: `Kartotiniai: ${[1, 2, 3, 4, 5].map((k) => n * k).join(', ')}.`,
      }),

    // 4. Mažiausias kartotinis, didesnis už ribą
    () => {
      const riba = atsitiktinis(30, 150)
      const rez = Math.ceil((riba + 1) / n) * n
      return uzdavinys(T9, {
        klausimas: `Koks yra mažiausias skaičiaus ${n} kartotinis, didesnis už ${riba}?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$${riba} : ${n}$ duoda ${Math.floor(riba / n)}, tad ieškomas kartotinis yra $${n} \\cdot ${rez / n} = ${rez}$.`,
      })
    },

    // 5. Kiek kartotinių ruože
    () => {
      const riba = atsitiktinis(60, 200)
      return uzdavinys(T9, {
        klausimas: `Kiek skaičiaus ${n} kartotinių yra nuo 1 iki ${riba}?`,
        atsakymas: String(Math.floor(riba / n)),
        atsakymasRodymui: `$${Math.floor(riba / n)}$`,
        sprendimas: `$${riba} : ${n}$ duoda ${Math.floor(riba / n)} (likutis atmetamas).`,
      })
    },

    // 6. Kartotinis ir daliklis
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Jei ${n * 4} yra skaičiaus ${n} kartotinis, tai kuo skaičius ${n} yra skaičiui ${n * 4}?`,
        variantai: ['dalikliu', 'kartotiniu', 'liekana', 'dalmeniu'],
        teisingas: 0,
        sprendimas: 'Kartotinio ir daliklio sąvokos yra viena kitai atvirkštinės.',
      }),

    // 7. Bendri kartotiniai
    () => {
      const m = atsitiktinis(3, 12)
      if (m === n) return null
      const bendras = mbk2(n, m)
      return uzdavinys(T9, {
        klausimas: `Koks yra mažiausias skaičius, kuris yra ir ${n}, ir ${m} kartotinis?`,
        atsakymas: String(bendras),
        atsakymasRodymui: `$${bendras}$`,
        sprendimas: `${n} kartotiniai: ${[1, 2, 3, 4].map((k) => n * k).join(', ')}…; ${m} kartotiniai: ${[1, 2, 3, 4].map((k) => m * k).join(', ')}… Pirmasis bendras — ${bendras}.`,
      })
    },
  ])
}

// ── 3.3.2. Mažiausiasis bendrasis kartotinis ────────────────────────────────

const T10 = 'maziausiasis-bendrasis-kartotinis'

const A_MBK = [
  {
    klausimas: 'Rask skaičių 4 ir 6 mažiausiąjį bendrąjį kartotinį.',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '4 kartotiniai: 4, 8, 12…; 6 kartotiniai: 6, 12…',
  },
] as const

export const maziausiasisBendrasisKartotinis: Generatorius = () =>
  suBandymais(kurkMbk, A_MBK, T10)

function kurkMbk(): Uzdavinys | null {
  const a = atsitiktinis(3, 18)
  const b = atsitiktinis(3, 18)
  if (a === b) return null
  const m = mbk2(a, b)

  return variacija([
    // 1. MBK
    () =>
      uzdavinys(T10, {
        klausimas: `Rask skaičių ${a} ir ${b} mažiausiąjį bendrąjį kartotinį.`,
        atsakymas: String(m),
        atsakymasRodymui: `$${m}$`,
        sprendimas: `${a} kartotiniai: ${[1, 2, 3, 4].map((k) => a * k).join(', ')}…; ${b} kartotiniai: ${[1, 2, 3, 4].map((k) => b * k).join(', ')}… Pirmasis bendras — ${m}.`,
      }),

    // 2. Antrasis bendras kartotinis
    () =>
      uzdavinys(T10, {
        klausimas: `Skaičių ${a} ir ${b} mažiausiasis bendrasis kartotinis yra ${m}. Koks yra antrasis pagal dydį jų bendras kartotinis?`,
        atsakymas: String(m * 2),
        atsakymasRodymui: `$${m * 2}$`,
        sprendimas: 'Visi bendri kartotiniai yra mažiausiojo bendrojo kartotinio kartotiniai.',
      }),

    // 3. Kai vienas dalus iš kito
    () => {
      const maz = atsitiktinis(3, 12)
      const did = maz * atsitiktinis(2, 5)
      return uzdavinys(T10, {
        klausimas: `Rask skaičių ${maz} ir ${did} mažiausiąjį bendrąjį kartotinį.`,
        atsakymas: String(did),
        atsakymasRodymui: `$${did}$`,
        sprendimas: `${did} jau dalus iš ${maz}, tad jis pats ir yra mažiausiasis bendrasis kartotinis.`,
      })
    },

    // 4. Kai skaičiai tarpusavyje pirminiai
    () => {
      const x = pasirink([3, 4, 5, 7, 9])
      const y = pasirink([8, 11, 13, 16])
      if (nsd(x, y) !== 1) return null
      return uzdavinys(T10, {
        klausimas: `Rask skaičių ${x} ir ${y} mažiausiąjį bendrąjį kartotinį.`,
        atsakymas: String(x * y),
        atsakymasRodymui: `$${x * y}$`,
        sprendimas: `${x} ir ${y} bendrų daliklių, didesnių už 1, neturi, tad mažiausiasis bendrasis kartotinis yra jų sandauga $${x} \\cdot ${y} = ${x * y}$.`,
      })
    },

    // 5. Taikymas: autobusai
    () =>
      uzdavinys(T10, {
        klausimas: `Vienas autobusas išvyksta kas ${a} minutes, kitas — kas ${b}. Po kiek minučių jie vėl išvyks kartu?`,
        atsakymas: String(m),
        atsakymasRodymui: `$${m}$ min.`,
        sprendimas: `Ieškomas mažiausiasis bendrasis ${a} ir ${b} kartotinis: ${m}.`,
      }),

    // 6. Ryšys su DBD
    () =>
      uzdavinys(T10, {
        klausimas: `Skaičių ${a} ir ${b} didžiausiasis bendrasis daliklis yra ${nsd(a, b)}. Koks yra jų mažiausiasis bendrasis kartotinis?`,
        atsakymas: String(m),
        atsakymasRodymui: `$${m}$`,
        sprendimas: `Sandauga $${a} \\cdot ${b} = ${a * b}$, tad $${a * b} : ${nsd(a, b)} = ${m}$.`,
      }),

    // 7. Klaidos radimas
    () => {
      if (a * b === m) return null
      return uzdavinys(T10, {
        klausimas: `Mokinys teigia, kad skaičių ${a} ir ${b} mažiausiasis bendrasis kartotinis yra ${a * b}. Užrašyk teisingą reikšmę.`,
        atsakymas: String(m),
        atsakymasRodymui: `$${m}$`,
        sprendimas: `Sandauga tikrai yra bendras kartotinis, bet ne mažiausias: ${m} dalus ir iš ${a}, ir iš ${b}.`,
      })
    },
  ])
}
