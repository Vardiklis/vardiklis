import { atsitiktinis, naujasId, nsd, pasirink, suprastink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys } from './formatai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 6 klasės temos „Neneigiamųjų paprastųjų trupmenų daugyba ir dalyba“ ir
 * „Neneigiamųjų dešimtainių skaičių daugyba ir dalyba“ — devynios potemės.
 *
 * Visi dešimtainių skaičių veiksmai atliekami sveikaisiais, o kablelis
 * įrašomas tik rodant. Slankusis kablelis čia netinka: $8{,}13 : 10$ duotų
 * $0{,}8130000000000001$, ir toks atsakymas patektų mokiniui.
 */

function tr(sk: number, vd: number): string {
  return `\\dfrac{${sk}}{${vd}}`
}

function mis(sveikas: number, sk: number, vd: number): string {
  return sk === 0 ? String(sveikas) : `${sveikas}${tr(sk, vd)}`
}

/** Atsakymo eilutė trupmenai: sveikasis, mišrusis arba paprastoji. */
function ats(sk: number, vd: number): string {
  const t = suprastink(sk, vd)
  if (t.vardiklis === 1) return String(t.skaitiklis)
  if (t.skaitiklis < t.vardiklis) return `${t.skaitiklis}/${t.vardiklis}`
  const sveikas = Math.floor(t.skaitiklis / t.vardiklis)
  const likutis = t.skaitiklis % t.vardiklis
  return likutis === 0 ? String(sveikas) : `${sveikas} ${likutis}/${t.vardiklis}`
}

/**
 * Ar trupmena po suprastinimo lieka įskaitoma šeštokui.
 *
 * Dviejų trupmenų sandaugos vardiklis auga greitai: $\dfrac{2}{5} \cdot
 * \dfrac{3}{7}$ duoda $\dfrac{6}{35}$, o tokio atsakymo mokinys nei
 * įsivaizduoja, nei patikrina. Todėl pora renkama tokia, kad suprastinto
 * atsakymo vardiklis neviršytų 20.
 */
function tinkamaTrupmena(sk: number, vd: number): boolean {
  const t = suprastink(sk, vd)
  return t.vardiklis <= 20
}

/** Trupmenos užrašas rodymui — suprastintas ir, jei reikia, mišrusis. */
function rodyk(sk: number, vd: number): string {
  const t = suprastink(sk, vd)
  if (t.vardiklis === 1) return String(t.skaitiklis)
  if (t.skaitiklis < t.vardiklis) return tr(t.skaitiklis, t.vardiklis)
  const sveikas = Math.floor(t.skaitiklis / t.vardiklis)
  const likutis = t.skaitiklis % t.vardiklis
  return likutis === 0 ? String(sveikas) : mis(sveikas, likutis, t.vardiklis)
}

/**
 * Sveikąjį skaičių, išreikštą $10^{-n}$ dalimis, paverčia tiksliu dešimtainiu
 * užrašu: `tikslus(345, 2)` duoda „3.45“.
 */
function tikslus(sk: number, n: number): string {
  const zenklas = sk < 0 ? '-' : ''
  const a = String(Math.abs(sk)).padStart(n + 1, '0')
  const sveika = a.slice(0, a.length - n)
  const trupmena = n === 0 ? '' : a.slice(a.length - n).replace(/0+$/, '')
  return zenklas + sveika + (trupmena ? `.${trupmena}` : '')
}

/** Tikslus dešimtainis užrašas su lietuvišku kableliu. */
function des(sk: number, n: number): string {
  return tikslus(sk, n).replace('.', '{,}')
}

// ── 3.1.1. Paprastosios trupmenos ir natūraliojo skaičiaus daugyba ──────────

const T1 = 'trupmenos-daugyba-6'

const A_TRUP_NAT = [
  {
    klausimas: 'Apskaičiuok: $\\dfrac{3}{8} \\cdot 4$.',
    atsakymas: '1 1/2',
    atsakymasRodymui: '$1\\dfrac{1}{2}$',
    sprendimas: 'Dauginamas skaitiklis: $\\dfrac{12}{8} = 1\\dfrac{1}{2}$.',
  },
] as const

export const trupmenosDaugyba6: Generatorius = () => suBandymais(kurkTrupNat, A_TRUP_NAT, T1)

function kurkTrupNat(): Uzdavinys | null {
  const vd = atsitiktinis(3, 12)
  const sk = atsitiktinis(1, vd - 1)
  const n = atsitiktinis(2, 9)

  return variacija([
    // 1. Sandauga
    () =>
      uzdavinys(T1, {
        klausimas: `Apskaičiuok: $${tr(sk, vd)} \\cdot ${n}$.`,
        atsakymas: ats(sk * n, vd),
        atsakymasRodymui: `$${rodyk(sk * n, vd)}$`,
        sprendimas: `Skaitiklis dauginamas, vardiklis nesikeičia: $${tr(sk * n, vd)} = ${rodyk(sk * n, vd)}$.`,
      }),

    // 2. Su prastinimu prieš daugybą
    () => {
      const d = nsd(n, vd)
      if (d === 1) return null
      return uzdavinys(T1, {
        klausimas: `Apskaičiuok, prieš daugybą suprastindamas: $${tr(sk, vd)} \\cdot ${n}$.`,
        atsakymas: ats(sk * n, vd),
        atsakymasRodymui: `$${rodyk(sk * n, vd)}$`,
        sprendimas: `${n} ir ${vd} dalūs iš ${d}, tad prastinama dar prieš daugybą: gaunama $${rodyk(sk * n, vd)}$.`,
      })
    },

    // 3. Kai gaunamas sveikasis
    () => {
      if (vd % sk !== 0) return null
      const k = vd / sk
      return uzdavinys(T1, {
        klausimas: `Apskaičiuok: $${tr(sk, vd)} \\cdot ${k}$.`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: `$${sk} \\cdot ${k} = ${vd}$, tad gaunama $${tr(vd, vd)} = 1$.`,
      })
    },

    // 4. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kaip dauginama paprastoji trupmena iš natūraliojo skaičiaus?',
        variantai: [
          'skaitiklis dauginamas iš to skaičiaus, vardiklis nesikeičia',
          'vardiklis dauginamas, skaitiklis nesikeičia',
          'dauginami ir skaitiklis, ir vardiklis',
          'skaičius pridedamas prie skaitiklio',
        ],
        teisingas: 0,
        sprendimas: `Paimti $${tr(sk, vd)}$ ${n} kartus reiškia paimti $${sk * n}$ dalis po $${tr(1, vd)}$.`,
      }),

    // 5. Trūkstamas daugiklis
    () =>
      uzdavinys(T1, {
        klausimas: `Rask trūkstamą daugiklį: $${tr(sk, vd)} \\cdot \\square = ${rodyk(sk * n, vd)}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Skaitiklis padidėjo nuo ${sk} iki ${sk * n}, tad daugiklis yra ${n}.`,
      }),

    // 6. Mišrusis skaičius
    () => {
      const sveikas = atsitiktinis(1, 4)
      const netaisyklinga = sveikas * vd + sk
      return uzdavinys(T1, {
        klausimas: `Apskaičiuok: $${mis(sveikas, sk, vd)} \\cdot ${n}$.`,
        atsakymas: ats(netaisyklinga * n, vd),
        atsakymasRodymui: `$${rodyk(netaisyklinga * n, vd)}$`,
        sprendimas: `$${mis(sveikas, sk, vd)} = ${tr(netaisyklinga, vd)}$, tad sandauga yra $${tr(netaisyklinga * n, vd)} = ${rodyk(netaisyklinga * n, vd)}$.`,
      })
    },

    // 7. Tekstinis
    () =>
      uzdavinys(T1, {
        klausimas: `Vienam gaminiui reikia $${tr(sk, vd)}$ m juostos. Kiek metrų juostos reikės ${n} gaminiams?`,
        atsakymas: ats(sk * n, vd),
        atsakymasRodymui: `$${rodyk(sk * n, vd)}$ m`,
        sprendimas: `$${tr(sk, vd)} \\cdot ${n} = ${rodyk(sk * n, vd)}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T1, {
        klausimas: `Mokinys apskaičiavo $${tr(sk, vd)} \\cdot ${n} = ${tr(sk * n, vd * n)}$. Užrašyk teisingą sandaugą.`,
        atsakymas: ats(sk * n, vd),
        atsakymasRodymui: `$${rodyk(sk * n, vd)}$`,
        sprendimas: 'Dauginant iš natūraliojo skaičiaus vardiklis nesikeičia — mokinys padaugino ir jį.',
      }),
  ])
}

// ── 3.1.2. Dauginame paprastąsias trupmenas ─────────────────────────────────

const T2 = 'trupmenu-daugyba-6'

const A_TRUP_TRUP = [
  {
    klausimas: 'Apskaičiuok: $\\dfrac{2}{3} \\cdot \\dfrac{3}{5}$.',
    atsakymas: '2/5',
    atsakymasRodymui: '$\\dfrac{2}{5}$',
    sprendimas: 'Sudauginami skaitikliai ir vardikliai, paskui prastinama.',
  },
] as const

export const trupmenuDaugyba6: Generatorius = () => suBandymais(kurkTrupTrup, A_TRUP_TRUP, T2)

function kurkTrupTrup(): Uzdavinys | null {
  const vd1 = atsitiktinis(2, 9)
  const sk1 = atsitiktinis(1, vd1 - 1)
  const vd2 = atsitiktinis(2, 9)
  const sk2 = atsitiktinis(1, vd2 - 1)
  if (!tinkamaTrupmena(sk1 * sk2, vd1 * vd2)) return null

  return variacija([
    // 1. Sandauga
    () =>
      uzdavinys(T2, {
        klausimas: `Apskaičiuok: $${tr(sk1, vd1)} \\cdot ${tr(sk2, vd2)}$.`,
        atsakymas: ats(sk1 * sk2, vd1 * vd2),
        atsakymasRodymui: `$${rodyk(sk1 * sk2, vd1 * vd2)}$`,
        sprendimas: `$\\dfrac{${sk1} \\cdot ${sk2}}{${vd1} \\cdot ${vd2}} = ${tr(sk1 * sk2, vd1 * vd2)} = ${rodyk(sk1 * sk2, vd1 * vd2)}$.`,
      }),

    // 2. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kaip dauginamos dvi paprastosios trupmenos?',
        variantai: [
          'skaitiklis dauginamas iš skaitiklio, vardiklis iš vardiklio',
          'skaitikliai sudedami, vardikliai dauginami',
          'reikia jas bendravardiklinti',
          'antroji trupmena apverčiama',
        ],
        teisingas: 0,
        sprendimas: 'Bendravardiklinti dauginant nereikia — tai daroma tik sudedant ir atimant.',
      }),

    // 3. Su prastinimu kryžmais
    () => {
      if (nsd(sk1, vd2) === 1 && nsd(sk2, vd1) === 1) return null
      return uzdavinys(T2, {
        klausimas: `Apskaičiuok, prieš daugybą suprastindamas: $${tr(sk1, vd1)} \\cdot ${tr(sk2, vd2)}$.`,
        atsakymas: ats(sk1 * sk2, vd1 * vd2),
        atsakymasRodymui: `$${rodyk(sk1 * sk2, vd1 * vd2)}$`,
        sprendimas: 'Prastinti galima ir kryžmais — vieno daugiklio skaitiklį su kito vardikliu.',
      })
    },

    // 4. Trupmenos kvadratas
    () => {
      if (!tinkamaTrupmena(sk1 * sk1, vd1 * vd1)) return null
      return uzdavinys(T2, {
        klausimas: `Apskaičiuok: $${tr(sk1, vd1)} \\cdot ${tr(sk1, vd1)}$.`,
        atsakymas: ats(sk1 * sk1, vd1 * vd1),
        atsakymasRodymui: `$${rodyk(sk1 * sk1, vd1 * vd1)}$`,
        sprendimas: `$${tr(sk1 * sk1, vd1 * vd1)}$.`,
      })
    },

    // 5. Ar sandauga didesnė
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kokia bus sandauga $${tr(sk1, vd1)} \\cdot ${tr(sk2, vd2)}$, palyginti su pirmuoju daugikliu?`,
        variantai: [
          'mažesnė, nes dauginama iš skaičiaus, mažesnio už vienetą',
          'didesnė, nes daugyba visada didina',
          'tokia pati',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Dauginant iš trupmenos, mažesnės už vienetą, imama tik jos dalis.',
      }),

    // 6. Trys trupmenos
    () => {
      const vd3 = atsitiktinis(2, 7)
      const sk3 = atsitiktinis(1, vd3 - 1)
      if (!tinkamaTrupmena(sk1 * sk2 * sk3, vd1 * vd2 * vd3)) return null
      return uzdavinys(T2, {
        klausimas: `Apskaičiuok: $${tr(sk1, vd1)} \\cdot ${tr(sk2, vd2)} \\cdot ${tr(sk3, vd3)}$.`,
        atsakymas: ats(sk1 * sk2 * sk3, vd1 * vd2 * vd3),
        atsakymasRodymui: `$${rodyk(sk1 * sk2 * sk3, vd1 * vd2 * vd3)}$`,
        sprendimas: `Sudauginami visi skaitikliai ir visi vardikliai: $${tr(sk1 * sk2 * sk3, vd1 * vd2 * vd3)}$.`,
      })
    },

    // 7. Dalis nuo dalies
    () =>
      uzdavinys(T2, {
        klausimas: `Kiek yra $${tr(sk1, vd1)}$ nuo $${tr(sk2, vd2)}$?`,
        atsakymas: ats(sk1 * sk2, vd1 * vd2),
        atsakymasRodymui: `$${rodyk(sk1 * sk2, vd1 * vd2)}$`,
        sprendimas: `Dalis nuo dalies randama daugyba: $${tr(sk1, vd1)} \\cdot ${tr(sk2, vd2)} = ${rodyk(sk1 * sk2, vd1 * vd2)}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: `Mokinys dauginamas trupmenas suvedė į bendrąjį vardiklį. Užrašyk teisingą sandaugą $${tr(sk1, vd1)} \\cdot ${tr(sk2, vd2)}$.`,
        atsakymas: ats(sk1 * sk2, vd1 * vd2),
        atsakymasRodymui: `$${rodyk(sk1 * sk2, vd1 * vd2)}$`,
        sprendimas: 'Bendrasis vardiklis reikalingas tik sudėčiai ir atimčiai.',
      }),
  ])
}

// ── 3.2.1. Paprastąją trupmeną dalijame iš natūraliojo skaičiaus ────────────

const T3 = 'trupmenos-dalyba-is-naturaliojo'

const A_TRUP_DALYBA = [
  {
    klausimas: 'Apskaičiuok: $\\dfrac{4}{5} : 2$.',
    atsakymas: '2/5',
    atsakymasRodymui: '$\\dfrac{2}{5}$',
    sprendimas: 'Vardiklis dauginamas iš daliklio.',
  },
] as const

export const trupmenosDalybaIsNaturaliojo: Generatorius = () =>
  suBandymais(kurkTrupDalyba, A_TRUP_DALYBA, T3)

function kurkTrupDalyba(): Uzdavinys | null {
  const vd = atsitiktinis(2, 10)
  const sk = atsitiktinis(1, vd - 1)
  const n = atsitiktinis(2, 8)
  if (!tinkamaTrupmena(sk, vd * n)) return null

  return variacija([
    // 1. Dalmuo
    () =>
      uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${tr(sk, vd)} : ${n}$.`,
        atsakymas: ats(sk, vd * n),
        atsakymasRodymui: `$${rodyk(sk, vd * n)}$`,
        sprendimas: `Dalijant iš natūraliojo skaičiaus vardiklis dauginamas iš jo: $${tr(sk, vd * n)}$.`,
      }),

    // 2. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip paprastoji trupmena dalijama iš natūraliojo skaičiaus?',
        variantai: [
          'vardiklis dauginamas iš to skaičiaus',
          'skaitiklis dauginamas iš to skaičiaus',
          'skaitiklis ir vardiklis dauginami',
          'iš vardiklio atimamas tas skaičius',
        ],
        teisingas: 0,
        sprendimas: 'Dalijant į daugiau dalių, kiekviena dalis darosi smulkesnė.',
      }),

    // 3. Kai skaitiklis dalus
    () => {
      if (sk % n !== 0) return null
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${tr(sk, vd)} : ${n}$.`,
        atsakymas: ats(sk / n, vd),
        atsakymasRodymui: `$${rodyk(sk / n, vd)}$`,
        sprendimas: `Skaitiklis dalus iš ${n}, tad patogiau padalyti jį: $${tr(sk / n, vd)}$.`,
      })
    },

    // 4. Dalyba kaip daugyba iš atvirkštinio
    () =>
      uzdavinys(T3, {
        klausimas: `Kuo pakeičiama dalyba iš ${n}? Užrašyk trupmeną, iš kurios reikia padauginti.`,
        atsakymas: `1/${n}`,
        atsakymasRodymui: `$${tr(1, n)}$`,
        sprendimas: `Dalyba iš ${n} yra tas pat, kas daugyba iš $${tr(1, n)}$.`,
      }),

    // 5. Trūkstamas daliklis
    () =>
      uzdavinys(T3, {
        klausimas: `Rask trūkstamą daliklį: $${tr(sk, vd)} : \\square = ${rodyk(sk, vd * n)}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Vardiklis padidėjo nuo ${vd} iki ${vd * n}, tad dalyta iš ${n}.`,
      }),

    // 6. Mišrusis skaičius
    () => {
      const sveikas = atsitiktinis(1, 4)
      const netaisyklinga = sveikas * vd + sk
      if (!tinkamaTrupmena(netaisyklinga, vd * n)) return null
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${mis(sveikas, sk, vd)} : ${n}$.`,
        atsakymas: ats(netaisyklinga, vd * n),
        atsakymasRodymui: `$${rodyk(netaisyklinga, vd * n)}$`,
        sprendimas: `$${mis(sveikas, sk, vd)} = ${tr(netaisyklinga, vd)}$, tad dalmuo yra $${tr(netaisyklinga, vd * n)} = ${rodyk(netaisyklinga, vd * n)}$.`,
      })
    },

    // 7. Tekstinis
    () =>
      uzdavinys(T3, {
        klausimas: `$${tr(sk, vd)}$ litro sulčių išpilstyta po lygiai į ${n} stiklines. Kiek litrų yra vienoje stiklinėje?`,
        atsakymas: ats(sk, vd * n),
        atsakymasRodymui: `$${rodyk(sk, vd * n)}$ l`,
        sprendimas: `$${tr(sk, vd)} : ${n} = ${rodyk(sk, vd * n)}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T3, {
        klausimas: `Mokinys apskaičiavo $${tr(sk, vd)} : ${n} = ${tr(sk * n, vd)}$. Užrašyk teisingą dalmenį.`,
        atsakymas: ats(sk, vd * n),
        atsakymasRodymui: `$${rodyk(sk, vd * n)}$`,
        sprendimas: 'Dalijant trupmena mažėja, o mokinio atsakymas didesnis už pradinę trupmeną.',
      }),
  ])
}

// ── 3.2.2. Dalijame iš paprastosios trupmenos ───────────────────────────────

const T4 = 'dalyba-is-trupmenos'

const A_IS_TRUPMENOS = [
  {
    klausimas: 'Apskaičiuok: $\\dfrac{3}{4} : \\dfrac{1}{2}$.',
    atsakymas: '1 1/2',
    atsakymasRodymui: '$1\\dfrac{1}{2}$',
    sprendimas: 'Daliklis apverčiamas ir dauginama.',
  },
] as const

export const dalybaIsTrupmenos: Generatorius = () => suBandymais(kurkIsTrupmenos, A_IS_TRUPMENOS, T4)

function kurkIsTrupmenos(): Uzdavinys | null {
  const vd1 = atsitiktinis(2, 9)
  const sk1 = atsitiktinis(1, vd1 - 1)
  const vd2 = atsitiktinis(2, 9)
  const sk2 = atsitiktinis(1, vd2 - 1)
  if (!tinkamaTrupmena(sk1 * vd2, vd1 * sk2)) return null

  return variacija([
    // 1. Dalmuo
    () =>
      uzdavinys(T4, {
        klausimas: `Apskaičiuok: $${tr(sk1, vd1)} : ${tr(sk2, vd2)}$.`,
        atsakymas: ats(sk1 * vd2, vd1 * sk2),
        atsakymasRodymui: `$${rodyk(sk1 * vd2, vd1 * sk2)}$`,
        sprendimas: `Daliklis apverčiamas: $${tr(sk1, vd1)} \\cdot ${tr(vd2, sk2)} = ${rodyk(sk1 * vd2, vd1 * sk2)}$.`,
      }),

    // 2. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kaip dalijama iš paprastosios trupmenos?',
        variantai: [
          'dauginama iš daliklio atvirkštinės trupmenos',
          'dauginama iš daliklio',
          'dalijami skaitikliai ir vardikliai',
          'trupmenos bendravardiklinamos',
        ],
        teisingas: 0,
        sprendimas: 'Atvirkštinė trupmena gaunama sukeitus skaitiklį ir vardiklį vietomis.',
      }),

    // 3. Atvirkštinė trupmena
    () =>
      uzdavinys(T4, {
        klausimas: `Užrašyk trupmenai $${tr(sk2, vd2)}$ atvirkštinę trupmeną.`,
        atsakymas: ats(vd2, sk2),
        atsakymasRodymui: `$${rodyk(vd2, sk2)}$`,
        sprendimas: 'Skaitiklis ir vardiklis sukeičiami vietomis.',
      }),

    // 4. Natūralusis dalijamas iš trupmenos
    () => {
      const n = atsitiktinis(2, 8)
      if (!tinkamaTrupmena(n * vd2, sk2)) return null
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok: $${n} : ${tr(sk2, vd2)}$.`,
        atsakymas: ats(n * vd2, sk2),
        atsakymasRodymui: `$${rodyk(n * vd2, sk2)}$`,
        sprendimas: `$${n} \\cdot ${tr(vd2, sk2)} = ${rodyk(n * vd2, sk2)}$.`,
      })
    },

    // 5. Kodėl dalmuo didesnis
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kodėl dalijant iš trupmenos, mažesnės už vienetą, dalmuo gaunamas didesnis už dalinį?',
        variantai: [
          'nes klausiama, kiek kartų maža dalis telpa dalinyje',
          'nes dalyba visada didina skaičių',
          'nes trupmena apverčiama',
          'nes vardiklis didesnis už skaitiklį',
        ],
        teisingas: 0,
        sprendimas: 'Pavyzdžiui, $3 : \\dfrac{1}{2} = 6$ — pusių trejete telpa šešios.',
      }),

    // 6. Kiek kartų telpa
    () => {
      const n = atsitiktinis(2, 6)
      return uzdavinys(T4, {
        klausimas: `Kiek kartų $${tr(1, vd2)}$ telpa skaičiuje $${n}$?`,
        atsakymas: String(n * vd2),
        atsakymasRodymui: `$${n * vd2}$`,
        sprendimas: `$${n} : ${tr(1, vd2)} = ${n} \\cdot ${vd2} = ${n * vd2}$.`,
      })
    },

    // 7. Trūkstamas daliklis
    () =>
      uzdavinys(T4, {
        klausimas: `Rask trūkstamą daliklį: $${tr(sk1, vd1)} : \\square = ${rodyk(sk1 * vd2, vd1 * sk2)}$.`,
        atsakymas: ats(sk2, vd2),
        atsakymasRodymui: `$${rodyk(sk2, vd2)}$`,
        sprendimas: 'Dalinys dalijamas iš dalmens.',
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: `Mokinys apskaičiavo $${tr(sk1, vd1)} : ${tr(sk2, vd2)} = ${rodyk(sk1 * sk2, vd1 * vd2)}$ — apversti pamiršo. Užrašyk teisingą dalmenį.`,
        atsakymas: ats(sk1 * vd2, vd1 * sk2),
        atsakymasRodymui: `$${rodyk(sk1 * vd2, vd1 * sk2)}$`,
        sprendimas: 'Dalijant apverčiamas daliklis, o tik tada dauginama.',
      }),
  ])
}

// ── 4.1.1. Dešimtainį skaičių dauginame iš natūraliojo ──────────────────────

const T5 = 'desimtainio-daugyba-6'

const A_DES_NAT = [
  {
    klausimas: 'Apskaičiuok: $3{,}45 \\cdot 6$.',
    atsakymas: '20.7',
    atsakymasRodymui: '$20{,}7$',
    sprendimas: '$345 \\cdot 6 = 2070$ šimtųjų.',
  },
] as const

export const desimtainioDaugyba6: Generatorius = () => suBandymais(kurkDesNat, A_DES_NAT, T5)

function kurkDesNat(): Uzdavinys | null {
  const a = atsitiktinis(105, 990)
  const n = atsitiktinis(2, 12)

  return variacija([
    // 1. Sandauga
    () =>
      uzdavinys(T5, {
        klausimas: `Apskaičiuok: $${des(a, 2)} \\cdot ${n}$.`,
        atsakymas: tikslus(a * n, 2),
        atsakymasRodymui: `$${des(a * n, 2)}$`,
        sprendimas: `Dauginama nepaisant kablelio: $${a} \\cdot ${n} = ${a * n}$, o rezultate atskiriami du skaitmenys po kablelio.`,
      }),

    // 2. Kiek skaitmenų po kablelio
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kiek skaitmenų po kablelio turi sandauga $${des(a, 2)} \\cdot ${n}$ prieš suprastinant nulius?`,
        variantai: ['du — tiek pat, kiek dauginamajame', 'nė vieno', 'keturis', 'vieną'],
        teisingas: 0,
        sprendimas: 'Natūralusis daugiklis skaitmenų po kablelio neprideda.',
      }),

    // 3. Su dešimtosiomis
    () => {
      const d = atsitiktinis(11, 89)
      return uzdavinys(T5, {
        klausimas: `Apskaičiuok: $${des(d, 1)} \\cdot ${n}$.`,
        atsakymas: tikslus(d * n, 1),
        atsakymasRodymui: `$${des(d * n, 1)}$`,
        sprendimas: `$${d} \\cdot ${n} = ${d * n}$, atskiriamas vienas skaitmuo po kablelio.`,
      })
    },

    // 4. Trūkstamas daugiklis
    () =>
      uzdavinys(T5, {
        klausimas: `Rask trūkstamą daugiklį: $${des(a, 2)} \\cdot \\square = ${des(a * n, 2)}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${des(a * n, 2)} : ${des(a, 2)} = ${n}$.`,
      }),

    // 5. Daugyba iš 10, 100
    () => {
      const kartai = pasirink([10, 100])
      const nuliu = String(kartai).length - 1
      return uzdavinys(T5, {
        klausimas: `Apskaičiuok: $${des(a, 2)} \\cdot ${kartai}$.`,
        atsakymas: tikslus(a * kartai, 2),
        atsakymasRodymui: `$${des(a * kartai, 2)}$`,
        sprendimas: `Kablelis perkeliamas ${nuliu} ${nuliu === 1 ? 'skiltimi' : 'skiltimis'} į dešinę.`,
      })
    },

    // 6. Tekstinis
    () =>
      uzdavinys(T5, {
        klausimas: `Vienas kilogramas kainuoja $${des(a, 2)}$ Eur. Kiek kainuos ${n} kg?`,
        atsakymas: tikslus(a * n, 2),
        atsakymasRodymui: `$${des(a * n, 2)}$ Eur`,
        sprendimas: `$${des(a, 2)} \\cdot ${n} = ${des(a * n, 2)}$.`,
      }),

    // 7. Perimetras
    () => {
      const krastine = atsitiktinis(105, 890)
      return uzdavinys(T5, {
        klausimas: `Kvadrato kraštinė $${des(krastine, 2)}$ cm. Koks jo perimetras?`,
        atsakymas: tikslus(krastine * 4, 2),
        atsakymasRodymui: `$${des(krastine * 4, 2)}$ cm`,
        sprendimas: `$${des(krastine, 2)} \\cdot 4 = ${des(krastine * 4, 2)}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: `Mokinys apskaičiavo $${des(a, 2)} \\cdot ${n} = ${a * n}$ — kablelio nepastatė. Užrašyk teisingą sandaugą.`,
        atsakymas: tikslus(a * n, 2),
        atsakymasRodymui: `$${des(a * n, 2)}$`,
        sprendimas: 'Sandaugoje atskiriama tiek skaitmenų, kiek jų po kablelio buvo dauginamajame.',
      }),
  ])
}

// ── 4.1.2. Dauginame dešimtainius skaičius ──────────────────────────────────

const T6 = 'desimtainiu-daugyba'

const A_DES_DES = [
  {
    klausimas: 'Apskaičiuok: $0{,}4 \\cdot 0{,}3$.',
    atsakymas: '0.12',
    atsakymasRodymui: '$0{,}12$',
    sprendimas: '$4 \\cdot 3 = 12$, po kablelio atskiriami du skaitmenys.',
  },
] as const

export const desimtainiuDaugyba: Generatorius = () => suBandymais(kurkDesDes, A_DES_DES, T6)

function kurkDesDes(): Uzdavinys | null {
  const a = atsitiktinis(11, 98)
  const b = atsitiktinis(11, 98)

  return variacija([
    // 1. Dešimtosios × dešimtosios
    () =>
      uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${des(a, 1)} \\cdot ${des(b, 1)}$.`,
        atsakymas: tikslus(a * b, 2),
        atsakymasRodymui: `$${des(a * b, 2)}$`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$; po kablelio iš viso $1 + 1 = 2$ skaitmenys.`,
      }),

    // 2. Kiek skaitmenų po kablelio
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kiek skaitmenų po kablelio turi dviejų dešimtainių skaičių sandauga?',
        variantai: [
          'tiek, kiek jų abiejuose daugikliuose kartu',
          'tiek, kiek pirmajame daugiklyje',
          'visada du',
          'tiek, kiek didesniajame daugiklyje',
        ],
        teisingas: 0,
        sprendimas: 'Todėl $0{,}2 \\cdot 0{,}3 = 0{,}06$, o ne $0{,}6$.',
      }),

    // 3. Mažesni už vienetą
    () => {
      const x = atsitiktinis(1, 9)
      const y = atsitiktinis(1, 9)
      return uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${des(x, 1)} \\cdot ${des(y, 1)}$.`,
        atsakymas: tikslus(x * y, 2),
        atsakymasRodymui: `$${des(x * y, 2)}$`,
        sprendimas: `$${x} \\cdot ${y} = ${x * y}$; abu daugikliai mažesni už vienetą, tad ir sandauga mažesnė.`,
      })
    },

    // 4. Šimtosios × dešimtosios
    () => {
      const c = atsitiktinis(105, 890)
      return uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${des(c, 2)} \\cdot ${des(a, 1)}$.`,
        atsakymas: tikslus(c * a, 3),
        atsakymasRodymui: `$${des(c * a, 3)}$`,
        sprendimas: `$${c} \\cdot ${a} = ${c * a}$; po kablelio $2 + 1 = 3$ skaitmenys.`,
      })
    },

    // 5. Palyginimas su daugikliu
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kada dešimtainio skaičiaus sandauga būna mažesnė už patį skaičių?',
        variantai: [
          'kai dauginama iš skaičiaus, mažesnio už vienetą',
          'kai dauginama iš skaičiaus, didesnio už vienetą',
          'visada',
          'niekada',
        ],
        teisingas: 0,
        sprendimas: 'Dauginant iš $0{,}5$ imama pusė, tad rezultatas mažesnis.',
      }),

    // 6. Ploto uždavinys
    () =>
      uzdavinys(T6, {
        klausimas: `Stačiakampio kraštinės $${des(a, 1)}$ m ir $${des(b, 1)}$ m. Koks jo plotas?`,
        atsakymas: tikslus(a * b, 2),
        atsakymasRodymui: `$${des(a * b, 2)}$ m²`,
        sprendimas: `$${des(a, 1)} \\cdot ${des(b, 1)} = ${des(a * b, 2)}$.`,
      }),

    // 7. Trūkstamas daugiklis
    () => {
      const x = atsitiktinis(2, 9)
      return uzdavinys(T6, {
        klausimas: `Rask trūkstamą daugiklį: $${des(a, 1)} \\cdot \\square = ${des(a * x, 2)}$.`,
        atsakymas: tikslus(x, 1),
        atsakymasRodymui: `$${des(x, 1)}$`,
        sprendimas: `$${des(a * x, 2)} : ${des(a, 1)} = ${des(x, 1)}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T6, {
        klausimas: `Mokinys apskaičiavo $${des(a, 1)} \\cdot ${des(b, 1)} = ${des(a * b, 1)}$ — atskyrė tik vieną skaitmenį. Užrašyk teisingą sandaugą.`,
        atsakymas: tikslus(a * b, 2),
        atsakymasRodymui: `$${des(a * b, 2)}$`,
        sprendimas: 'Skaitmenų po kablelio sandaugoje turi būti tiek, kiek jų abiejuose daugikliuose kartu.',
      }),
  ])
}

// ── 4.2.1. Dešimtainį skaičių dalijame iš natūraliojo ───────────────────────

const T7 = 'desimtainio-dalyba'

const A_DES_DALYBA = [
  {
    klausimas: 'Apskaičiuok: $7{,}5 : 5$.',
    atsakymas: '1.5',
    atsakymasRodymui: '$1{,}5$',
    sprendimas: 'Dalijama kaip sveikieji, kablelis rašomas ties dalinio kableliu.',
  },
] as const

export const desimtainioDalyba: Generatorius = () => suBandymais(kurkDesDalyba, A_DES_DALYBA, T7)

function kurkDesDalyba(): Uzdavinys | null {
  const n = atsitiktinis(2, 9)
  const dalmuo = atsitiktinis(105, 890)
  const dalinys = dalmuo * n

  return variacija([
    // 1. Dalmuo
    () =>
      uzdavinys(T7, {
        klausimas: `Apskaičiuok: $${des(dalinys, 2)} : ${n}$.`,
        atsakymas: tikslus(dalmuo, 2),
        atsakymasRodymui: `$${des(dalmuo, 2)}$`,
        sprendimas: `Dalijama kaip sveikieji skaičiai: $${dalinys} : ${n} = ${dalmuo}$, kablelis lieka toje pačioje vietoje.`,
      }),

    // 2. Kur rašomas kablelis
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kur dalmenyje rašomas kablelis, dalijant dešimtainį skaičių iš natūraliojo?',
        variantai: [
          'kai tik baigiama dalyti dalinio sveikoji dalis',
          'pačioje pabaigoje',
          'kablelio rašyti nereikia',
          'ten, kur jis yra daliklyje',
        ],
        teisingas: 0,
        sprendimas: 'Tada dalmens skiltys atitinka dalinio skiltis.',
      }),

    // 3. Dalyba iš 10, 100
    //
    // Dalinys imamas dešimtosiomis: dalijant šimtąsias iš 100, atsakyme liktų
    // keturi skaitmenys po kablelio, o tokios trupmenos mokinys nebeperskaito
    // ir nebepatikrina.
    () => {
      const kartai = pasirink([10, 100])
      const nuliu = String(kartai).length - 1
      const dalinysDes = Math.floor(dalinys / 10)
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok: $${des(dalinysDes, 1)} : ${kartai}$.`,
        atsakymas: tikslus(dalinysDes, 1 + nuliu),
        atsakymasRodymui: `$${des(dalinysDes, 1 + nuliu)}$`,
        sprendimas: `Dalijant iš ${kartai} kablelis perkeliamas ${nuliu} ${nuliu === 1 ? 'skiltimi' : 'skiltimis'} į kairę.`,
      })
    },

    // 4. Sveikasis dalijamas iš natūraliojo
    () => {
      const sveikas = atsitiktinis(2, 40)
      if ((sveikas * 100) % n !== 0) return null
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok: $${sveikas} : ${n}$. Atsakymą užrašyk dešimtainiu skaičiumi.`,
        atsakymas: tikslus((sveikas * 100) / n, 2),
        atsakymasRodymui: `$${des((sveikas * 100) / n, 2)}$`,
        sprendimas: `Prie dalinio prirašomi nuliai po kablelio ir dalyba tęsiama.`,
      })
    },

    // 5. Trūkstamas daliklis
    () =>
      uzdavinys(T7, {
        klausimas: `Rask trūkstamą daliklį: $${des(dalinys, 2)} : \\square = ${des(dalmuo, 2)}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${des(dalinys, 2)} : ${des(dalmuo, 2)} = ${n}$.`,
      }),

    // 6. Patikra daugyba
    () =>
      uzdavinys(T7, {
        klausimas: `Apskaičiuota $${des(dalinys, 2)} : ${n} = ${des(dalmuo, 2)}$. Patikrink: padaugink dalmenį iš daliklio ir užrašyk rezultatą.`,
        atsakymas: tikslus(dalinys, 2),
        atsakymasRodymui: `$${des(dalinys, 2)}$`,
        sprendimas: `$${des(dalmuo, 2)} \\cdot ${n} = ${des(dalinys, 2)}$ — gautas dalinys, tad dalyba teisinga.`,
      }),

    // 7. Tekstinis
    () =>
      uzdavinys(T7, {
        klausimas: `${n} vienodos prekės kainuoja $${des(dalinys, 2)}$ Eur. Kiek kainuoja viena?`,
        atsakymas: tikslus(dalmuo, 2),
        atsakymasRodymui: `$${des(dalmuo, 2)}$ Eur`,
        sprendimas: `$${des(dalinys, 2)} : ${n} = ${des(dalmuo, 2)}$.`,
      }),

    // 8. Vidurkis
    () => {
      const kiek = atsitiktinis(2, 5)
      const vid = atsitiktinis(105, 690)
      return uzdavinys(T7, {
        klausimas: `${kiek} matavimų suma yra $${des(vid * kiek, 2)}$. Koks matavimų vidurkis?`,
        atsakymas: tikslus(vid, 2),
        atsakymasRodymui: `$${des(vid, 2)}$`,
        sprendimas: `$${des(vid * kiek, 2)} : ${kiek} = ${des(vid, 2)}$.`,
      })
    },
  ])
}

// ── 4.2.2. Periodinės trupmenos ─────────────────────────────────────────────

const T8 = 'periodines-trupmenos'

const A_PERIODINES = [
  {
    klausimas: 'Kokia dešimtainė trupmena gaunama dalijant $1 : 3$?',
    atsakymas: '0.(3)',
    atsakymasRodymui: '$0{,}(3)$',
    sprendimas: 'Trejetas kartojasi be galo — tai periodinė trupmena.',
  },
] as const

export const periodinesTrupmenos: Generatorius = () => suBandymais(kurkPeriodines, A_PERIODINES, T8)

function kurkPeriodines(): Uzdavinys | null {
  return variacija([
    // 1. Kas yra periodas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kas vadinama dešimtainės trupmenos periodu?',
        variantai: [
          'skaitmenų grupė, kuri be galo kartojasi',
          'skaitmenys prieš kablelį',
          'paskutinis skaitmuo',
          'skaitmenų skaičius po kablelio',
        ],
        teisingas: 0,
        sprendimas: 'Periodas rašomas skliaustuose: $0{,}(6)$.',
      }),

    // 2. 1 : 3
    () =>
      uzdavinys(T8, {
        klausimas: 'Koks yra trupmenos $\\dfrac{1}{3}$ periodas? Užrašyk vien jį.',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: '$\\dfrac{1}{3} = 0{,}(3)$ — kartojasi trejetas.',
      }),

    // 3. 2 : 3
    () =>
      uzdavinys(T8, {
        klausimas: 'Koks yra trupmenos $\\dfrac{2}{3}$ periodas? Užrašyk vien jį.',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: '$\\dfrac{2}{3} = 0{,}(6)$.',
      }),

    // 4. Kuri trupmena periodinė
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuri trupmena virsta periodine dešimtaine trupmena?',
        variantai: ['$\\dfrac{1}{6}$', '$\\dfrac{1}{4}$', '$\\dfrac{1}{5}$', '$\\dfrac{3}{8}$'],
        teisingas: 0,
        sprendimas:
          'Baigtinė dešimtainė trupmena gaunama tada, kai suprastintos trupmenos vardiklio pirminiai dalikliai yra tik 2 ir 5; šešetas turi ir trejetą.',
      }),

    // 5. Kada baigtinė
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kada paprastoji trupmena virsta baigtine dešimtaine trupmena?',
        variantai: [
          'kai suprastintos trupmenos vardiklyje yra tik dvejetai ir penketai',
          'kai skaitiklis mažesnis už vardiklį',
          'visada',
          'kai vardiklis lyginis',
        ],
        teisingas: 0,
        sprendimas: 'Tokį vardiklį visada galima paversti dešimčių laipsniu.',
      }),

    // 6. Apvalinimas
    () =>
      uzdavinys(T8, {
        klausimas: 'Suapvalink $0{,}(3)$ iki šimtųjų.',
        atsakymas: '0.33',
        atsakymasRodymui: '$0{,}33$',
        sprendimas: '$0{,}(3) = 0{,}3333\\ldots$; tūkstantųjų skaitmuo 3, tad apvalinama į apačią.',
      }),

    // 7. Kitas periodas
    () => {
      const sk = pasirink([1, 2, 4, 5, 7, 8])
      const periodas = String(sk).repeat(1)
      return uzdavinys(T8, {
        klausimas: `Trupmena $\\dfrac{${sk}}{9}$ užrašoma periodine dešimtaine trupmena. Koks jos periodas?`,
        atsakymas: periodas,
        atsakymasRodymui: `$${periodas}$`,
        sprendimas: `Dalijant iš 9 gaunama $0{,}(${sk})$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T8, {
        klausimas: 'Mokinys užrašė $\\dfrac{1}{3} = 0{,}33$. Kuo šis užrašas netikslus? Užrašyk tikslų atsakymą.',
        atsakymas: '0.(3)',
        atsakymasRodymui: '$0{,}(3)$',
        sprendimas: '$0{,}33$ yra tik apytikslė reikšmė — trejetų yra be galo daug.',
      }),
  ])
}

// ── 4.2.3. Dalijame dešimtainius skaičius ───────────────────────────────────

const T9 = 'desimtainiu-dalyba'

const A_DES_DES_DALYBA = [
  {
    klausimas: 'Apskaičiuok: $4{,}8 : 0{,}6$.',
    atsakymas: '8',
    atsakymasRodymui: '$8$',
    sprendimas: 'Abu skaičiai padauginami iš 10: $48 : 6 = 8$.',
  },
] as const

export const desimtainiuDalyba: Generatorius = () => suBandymais(kurkDesDesDalyba, A_DES_DES_DALYBA, T9)

function kurkDesDesDalyba(): Uzdavinys | null {
  const daliklis = atsitiktinis(2, 9)
  const dalmuo = atsitiktinis(2, 30)
  const dalinys = daliklis * dalmuo

  return variacija([
    // 1. Dešimtosios : dešimtosios
    () =>
      uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${des(dalinys, 1)} : ${des(daliklis, 1)}$.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `Abu skaičiai dauginami iš 10: $${dalinys} : ${daliklis} = ${dalmuo}$.`,
      }),

    // 2. Taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Ką daroma, kai daliklis yra dešimtainis skaičius?',
        variantai: [
          'ir dalinys, ir daliklis dauginami iš 10, 100 ar 1000, kad daliklis taptų sveikasis',
          'kablelis daliklyje tiesiog panaikinamas',
          'dauginamas tik dalinys',
          'dalmuo apvalinamas',
        ],
        teisingas: 0,
        sprendimas: 'Padauginus abu skaičius iš to paties, dalmuo nesikeičia.',
      }),

    // 3. Šimtosios : dešimtosios
    () => {
      const d2 = atsitiktinis(11, 89)
      const m = atsitiktinis(2, 20)
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${des(d2 * m, 2)} : ${des(d2, 1)}$.`,
        atsakymas: tikslus(m, 1),
        atsakymasRodymui: `$${des(m, 1)}$`,
        sprendimas: `Abu dauginami iš 10: $${des(d2 * m, 1)} : ${d2} = ${des(m, 1)}$.`,
      })
    },

    // 4. Dalyba iš skaičiaus, mažesnio už vienetą
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Koks bus dalmuo, dalijant skaičių iš daliklio, mažesnio už vienetą?',
        variantai: [
          'didesnis už dalinį',
          'mažesnis už dalinį',
          'lygus daliniui',
          'visada sveikasis',
        ],
        teisingas: 0,
        sprendimas: 'Pavyzdžiui, $6 : 0{,}5 = 12$ — pusių šešete telpa dvylika.',
      }),

    // 5. Trūkstamas dalinys
    () =>
      uzdavinys(T9, {
        klausimas: `Rask trūkstamą dalinį: $\\square : ${des(daliklis, 1)} = ${dalmuo}$.`,
        atsakymas: tikslus(dalinys, 1),
        atsakymasRodymui: `$${des(dalinys, 1)}$`,
        sprendimas: `$${dalmuo} \\cdot ${des(daliklis, 1)} = ${des(dalinys, 1)}$.`,
      }),

    // 6. Kiek telpa
    () => {
      const visas = atsitiktinis(3, 12)
      const dalis = pasirink([2, 4, 5])
      return uzdavinys(T9, {
        klausimas: `Kiek $${des(dalis, 1)}$ litro indelių galima pripildyti iš ${visas} litrų?`,
        atsakymas: String((visas * 10) / dalis),
        atsakymasRodymui: `$${(visas * 10) / dalis}$`,
        sprendimas: `$${visas} : ${des(dalis, 1)} = ${(visas * 10) / dalis}$.`,
      })
    },

    // 7. Vieneto kaina
    () => {
      const kiek = atsitiktinis(2, 9)
      const kaina = atsitiktinis(105, 690)
      return uzdavinys(T9, {
        klausimas: `$${des(kiek, 1)}$ kg prekės kainuoja $${des(kaina * kiek, 3)}$ Eur. Kiek kainuoja vienas kilogramas?`,
        atsakymas: tikslus(kaina, 2),
        atsakymasRodymui: `$${des(kaina, 2)}$ Eur`,
        sprendimas: `$${des(kaina * kiek, 3)} : ${des(kiek, 1)} = ${des(kaina, 2)}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T9, {
        klausimas: `Mokinys, dalydamas $${des(dalinys, 1)} : ${des(daliklis, 1)}$, padaugino iš 10 tik dalinį. Užrašyk teisingą dalmenį.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: 'Iš 10 reikia padauginti abu skaičius — antraip dalmuo pasikeičia dešimt kartų.',
      }),
  ])
}
