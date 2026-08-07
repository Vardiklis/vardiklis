import { atsitiktinis, pasirink, suprastink, trupmenaTeX } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { didink, vyresne } from './mastas'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Geometrija: perimetras, plotas ir tūris, kampai, Pitagoro teorema,
 * apskritimas, trigonometrija.
 *
 * Nė vienam uždaviniui nereikia brėžinio — sąlyga aprašoma žodžiais, o
 * atsakymas visada sveikas arba tvarkinga trupmena.
 */

/** Pitagoro trejetai — visos trys kraštinės sveikos, tad atsakymai lieka gražūs. */
const TREJETAI: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
  [7, 24, 25],
  [15, 20, 25],
  [10, 24, 26],
  [20, 21, 29],
  [18, 24, 30],
  [16, 30, 34],
  [21, 28, 35],
  [12, 35, 37],
]

// ── Perimetras ──────────────────────────────────────────────────────────────

const A_PERIMETRAS = [
  {
    klausimas: 'Stačiakampio kraštinės 5 cm ir 8 cm. Koks jo perimetras?',
    atsakymas: '26',
    atsakymasRodymui: '$26$ cm',
    sprendimas: '$P = 2 \\cdot (5 + 8) = 26$ cm.',
  },
] as const

export const perimetras: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkPerimetra(lygis, klase), A_PERIMETRAS, 'perimetras')

function kurkPerimetra(lygis: Lygis, klase?: number): Uzdavinys | null {
  const virsus = didink(lygis === 1 ? 12 : 25, klase)
  const a = atsitiktinis(2, virsus)
  const b = atsitiktinis(2, virsus)
  const c = atsitiktinis(2, virsus)

  const visos = [
    // 1. Stačiakampio perimetras
    () => {
      if (a === b) return null
      const p = 2 * (a + b)
      return uzdavinys('perimetras', {
        klausimas: `Stačiakampio kraštinės ${a} cm ir ${b} cm. Koks jo perimetras?`,
        atsakymas: String(p),
        atsakymasRodymui: `$${p}$ cm`,
        sprendimas: `$P = 2 \\cdot (${a} + ${b}) = ${p}$ cm.`,
      })
    },

    // 2. Trikampio perimetras
    () =>
      uzdavinys('perimetras', {
        klausimas: `Trikampio kraštinės ${a} cm, ${b} cm ir ${c} cm. Koks jo perimetras?`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${a + b + c}$ cm`,
        sprendimas: `$P = ${a} + ${b} + ${c} = ${a + b + c}$ cm.`,
      }),

    // 3. Atvirkštinis: žinomas perimetras ir viena kraštinė
    () => {
      if (a === b) return null
      const p = 2 * (a + b)
      return uzdavinys('perimetras', {
        klausimas: `Stačiakampio perimetras ${p} cm, viena kraštinė ${a} cm. Kokia kita kraštinė?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `Pusė perimetro yra $${p} : 2 = ${a + b}$ cm, tad kita kraštinė $${
          a + b
        } - ${a} = ${b}$ cm.`,
      })
    },

    // 4. Kvadrato kraštinė iš perimetro
    () => {
      const p = 4 * a
      return uzdavinys('perimetras', {
        klausimas: `Kvadrato perimetras ${p} cm. Kokia jo kraštinė?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ cm`,
        sprendimas: `Kvadratas turi keturias lygias kraštines: $${p} : 4 = ${a}$ cm.`,
      })
    },

    // 5. Lygiašonis trikampis
    () => {
      if (2 * a <= b) return null
      const p = 2 * a + b
      return uzdavinys('perimetras', {
        klausimas: `Lygiašonio trikampio šoninė kraštinė ${a} cm, pagrindas ${b} cm. Koks jo perimetras?`,
        atsakymas: String(p),
        atsakymasRodymui: `$${p}$ cm`,
        sprendimas: `Šoninės dvi: $2 \\cdot ${a} + ${b} = ${p}$ cm.`,
      })
    },

    // 6. Kiek reikia tvoros — taikomasis
    () => {
      if (a === b) return null
      const p = 2 * (a + b)
      const kaina = atsitiktinis(2, 9)
      return uzdavinys('perimetras', {
        klausimas: `Stačiakampį sklypą ${a} m ir ${b} m reikia aptverti tvora. Vienas tvoros metras kainuoja ${kaina} €. Kiek kainuos visa tvora?`,
        atsakymas: String(p * kaina),
        atsakymasRodymui: `$${p * kaina}$ €`,
        sprendimas: `Perimetras $2 \\cdot (${a} + ${b}) = ${p}$ m, tad $${p} \\cdot ${kaina} = ${
          p * kaina
        }$ €.`,
      })
    },

    // 7. Trūkstama kraštinė trikampyje
    () => {
      const p = a + b + c
      return uzdavinys('perimetras', {
        klausimas: `Trikampio perimetras ${p} cm, dvi kraštinės ${a} cm ir ${b} cm. Kokia trečioji kraštinė?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$ cm`,
        sprendimas: `$${p} - ${a} - ${b} = ${c}$ cm.`,
      })
    },
  ]

  return variacija(lygis === 1 ? visos.slice(0, 3) : visos)
}

// ── Plotas ir tūris ─────────────────────────────────────────────────────────

const A_PLOTAS = [
  {
    klausimas: 'Stačiakampio kraštinės 6 cm ir 4 cm. Koks jo plotas?',
    atsakymas: '24',
    atsakymasRodymui: '$24$ cm²',
    sprendimas: '$S = 6 \\cdot 4 = 24$ cm².',
  },
] as const

export const plotasTuris: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkPlota(lygis, klase), A_PLOTAS, 'plotas-turis')

function kurkPlota(lygis: Lygis, klase?: number): Uzdavinys | null {
  const virsus = didink(lygis === 1 ? 15 : 20, klase)
  const a = atsitiktinis(2, virsus)
  const b = atsitiktinis(2, virsus)
  const c = atsitiktinis(2, didink(8, klase))

  const visos = [
    // 1. Stačiakampio plotas
    () =>
      uzdavinys('plotas-turis', {
        klausimas: `Stačiakampio kraštinės ${a} cm ir ${b} cm. Koks jo plotas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ cm²`,
        sprendimas: `$S = ${a} \\cdot ${b} = ${a * b}$ cm².`,
      }),

    // 2. Kvadrato plotas
    () =>
      uzdavinys('plotas-turis', {
        klausimas: `Kvadrato kraštinė ${a} cm. Koks jo plotas?`,
        atsakymas: String(a * a),
        atsakymasRodymui: `$${a * a}$ cm²`,
        sprendimas: `$S = ${a}^2 = ${a * a}$ cm².`,
      }),

    // 3. Stačiakampio gretasienio tūris
    () => {
      const h = atsitiktinis(2, didink(8, klase))
      return uzdavinys('plotas-turis', {
        klausimas: `Stačiakampio gretasienio matmenys ${a} cm, ${c} cm ir ${h} cm. Koks jo tūris?`,
        atsakymas: String(a * c * h),
        atsakymasRodymui: `$${a * c * h}$ cm³`,
        sprendimas: `$V = ${a} \\cdot ${c} \\cdot ${h} = ${a * c * h}$ cm³.`,
      })
    },

    // 4. Trikampio plotas
    () => {
      const pagrindas = a * 2 // porinis, kad plotas būtų sveikas
      const plotas = (pagrindas * b) / 2
      return uzdavinys('plotas-turis', {
        klausimas: `Trikampio pagrindas ${pagrindas} cm, aukštinė ${b} cm. Koks jo plotas?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: `$S = \\dfrac{${pagrindas} \\cdot ${b}}{2} = ${plotas}$ cm².`,
      })
    },

    // 5. Atvirkštinis stačiakampio uždavinys
    () =>
      uzdavinys('plotas-turis', {
        klausimas: `Stačiakampio plotas ${a * b} cm², viena kraštinė ${a} cm. Kokia kita kraštinė?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `$${a * b} : ${a} = ${b}$ cm.`,
      }),

    // 6. Lygiagretainio plotas
    () =>
      uzdavinys('plotas-turis', {
        klausimas: `Lygiagretainio pagrindas ${a} cm, aukštinė ${b} cm. Koks jo plotas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ cm²`,
        sprendimas: `Lygiagretainio plotas — pagrindas kart aukštinė: $${a} \\cdot ${b} = ${
          a * b
        }$ cm².`,
      }),

    // 7. Trapecijos plotas
    () => {
      const auksis = 2 * c // porinė aukštinė — plotas lieka sveikas
      const plotas = ((a + b) * auksis) / 2
      if (a === b) return null
      return uzdavinys('plotas-turis', {
        klausimas: `Trapecijos pagrindai ${a} cm ir ${b} cm, aukštinė ${auksis} cm. Koks jos plotas?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: `$S = \\dfrac{(${a} + ${b}) \\cdot ${auksis}}{2} = ${plotas}$ cm².`,
      })
    },

    // 8. Kubo tūris
    () =>
      uzdavinys('plotas-turis', {
        klausimas: `Kubo briauna ${c} cm. Koks jo tūris?`,
        atsakymas: String(c ** 3),
        atsakymasRodymui: `$${c ** 3}$ cm³`,
        sprendimas: `$V = ${c}^3 = ${c ** 3}$ cm³.`,
      }),

    // 9. Sudėtinė figūra — stačiakampis be iškirsto kvadrato
    () => {
      const kvadratas = Math.min(a, b) - 1
      if (kvadratas < 2) return null
      const plotas = a * b - kvadratas * kvadratas
      return uzdavinys('plotas-turis', {
        klausimas: `Iš stačiakampio ${a} cm × ${b} cm iškirptas kvadratas, kurio kraštinė ${kvadratas} cm. Koks liko plotas?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: `$${a} \\cdot ${b} - ${kvadratas}^2 = ${a * b} - ${
          kvadratas * kvadratas
        } = ${plotas}$ cm².`,
      })
    },

    // 10. Prizmės tūris iš pagrindo ploto
    () => {
      const pagrindas = a * b
      const h = atsitiktinis(2, didink(8, klase))
      return uzdavinys('plotas-turis', {
        klausimas: `Prizmės pagrindo plotas ${pagrindas} cm², aukštinė ${h} cm. Koks jos tūris?`,
        atsakymas: String(pagrindas * h),
        atsakymasRodymui: `$${pagrindas * h}$ cm³`,
        sprendimas: `$V = S_{pagr} \\cdot h = ${pagrindas} \\cdot ${h} = ${pagrindas * h}$ cm³.`,
      })
    },

    // 11. Stačiakampio gretasienio paviršiaus plotas
    () => {
      const h = atsitiktinis(2, didink(8, klase))
      const S = 2 * (a * c + a * h + c * h)
      return uzdavinys('plotas-turis', {
        klausimas: `Stačiakampio gretasienio matmenys ${a} cm, ${c} cm ir ${h} cm. Koks jo paviršiaus plotas?`,
        atsakymas: String(S),
        atsakymasRodymui: `$${S}$ cm²`,
        sprendimas: `$S = 2(${a} \\cdot ${c} + ${a} \\cdot ${h} + ${c} \\cdot ${h}) = ${S}$ cm².`,
      })
    },
  ]

  // Lengvesniam lygiui — tik pirmieji 3 pavidalai; sunkesniam visi.
  return variacija(lygis === 1 ? visos.slice(0, 3) : vyresne(klase) ? visos : visos.slice(0, 9))
}

// ── Kampai ──────────────────────────────────────────────────────────────────

const A_KAMPAI = [
  {
    klausimas: 'Du trikampio kampai yra 40° ir 70°. Koks trečiasis kampas?',
    atsakymas: '70',
    atsakymasRodymui: '$70°$',
    sprendimas: 'Trikampio kampų suma 180°, tad $180 - 40 - 70 = 70$°.',
  },
] as const

export const kampai: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkKampus(lygis, klase), A_KAMPAI, 'kampai')

function kurkKampus(lygis: Lygis, klase?: number): Uzdavinys | null {
  const visos = [
    // 1. Trečiasis trikampio kampas
    () => {
      const a = atsitiktinis(2, 17) * 5
      const b = atsitiktinis(2, 17) * 5
      const c = 180 - a - b
      if (c <= 0) return null
      return uzdavinys('kampai', {
        klausimas: `Du trikampio kampai yra ${a}° ir ${b}°. Koks trečiasis kampas?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}°$`,
        sprendimas: `Trikampio kampų suma 180°, tad $180 - ${a} - ${b} = ${c}$°.`,
      })
    },

    // 2. Gretutiniai arba papildomi kampai
    () => {
      const gretutiniai = Math.random() < 0.5
      const suma = gretutiniai ? 180 : 90
      const a = atsitiktinis(2, suma / 5 - 2) * 5
      const b = suma - a
      if (b <= 0) return null
      return uzdavinys('kampai', {
        klausimas: gretutiniai
          ? `Kampas yra ${a}°. Koks jo gretutinis kampas?`
          : `Kampas yra ${a}°. Kiek jam trūksta iki stataus kampo?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}°$`,
        sprendimas: `Kampų suma ${suma}°, tad $${suma} - ${a} = ${b}$°.`,
      })
    },

    // 3. Statusis trikampis — smailusis kampas
    () => {
      const a = atsitiktinis(2, 16) * 5
      const b = 90 - a
      if (b <= 0) return null
      return uzdavinys('kampai', {
        klausimas: `Stačiojo trikampio vienas smailusis kampas ${a}°. Koks kitas smailusis kampas?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}°$`,
        sprendimas: `Smailiųjų kampų suma 90°: $90 - ${a} = ${b}$°.`,
      })
    },

    // 4. Lygiašonio trikampio kampai
    () => {
      const pagrindo = atsitiktinis(4, 17) * 5
      const virsunes = 180 - 2 * pagrindo
      if (virsunes <= 0) return null
      return uzdavinys('kampai', {
        klausimas: `Lygiašonio trikampio pagrindo kampas ${pagrindo}°. Koks viršūnės kampas?`,
        atsakymas: String(virsunes),
        atsakymasRodymui: `$${virsunes}°$`,
        sprendimas: `Pagrindo kampai lygūs: $180 - 2 \\cdot ${pagrindo} = ${virsunes}$°.`,
      })
    },

    // 5. Daugiakampio kampų suma
    () => {
      const krastiniu = atsitiktinis(3, vyresne(klase) ? 30 : 20)
      const suma = (krastiniu - 2) * 180
      return uzdavinys('kampai', {
        klausimas: `Kokia yra ${krastiniu} kraštinių daugiakampio vidaus kampų suma laipsniais?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}°$`,
        sprendimas: `$(n - 2) \\cdot 180 = (${krastiniu} - 2) \\cdot 180 = ${suma}$°.`,
      })
    },

    // 6. Taisyklingojo daugiakampio kampas
    () => {
      const n = pasirink([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20] as const)
      const kampas = ((n - 2) * 180) / n
      if (!Number.isInteger(kampas)) return null
      return uzdavinys('kampai', {
        klausimas: `Koks yra taisyklingojo ${n} kraštinių daugiakampio vidaus kampas?`,
        atsakymas: String(kampas),
        atsakymasRodymui: `$${kampas}°$`,
        sprendimas: `$\\dfrac{(${n} - 2) \\cdot 180}{${n}} = ${kampas}$°.`,
      })
    },

    // 7. Lygiagrečios tiesės ir kirstinė
    () => {
      const a = atsitiktinis(4, 34) * 5
      if (a >= 180) return null
      const b = 180 - a
      return uzdavinys('kampai', {
        klausimas: `Dvi lygiagrečias tieses kerta trečioji. Vienas iš vidaus vienašalių kampų yra ${a}°. Koks antrasis?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}°$`,
        sprendimas: `Vidaus vienašalių kampų suma 180°: $180 - ${a} = ${b}$°.`,
      })
    },

    // 8. Kampai santykiu
    () => {
      const d1 = atsitiktinis(1, 4)
      const d2 = atsitiktinis(1, 4)
      const d3 = atsitiktinis(1, 4)
      const dalys = d1 + d2 + d3
      if (180 % dalys !== 0) return null
      const vienetas = 180 / dalys
      return uzdavinys('kampai', {
        klausimas: `Trikampio kampai yra santykiu ${d1} : ${d2} : ${d3}. Koks didžiausias kampas?`,
        atsakymas: String(vienetas * Math.max(d1, d2, d3)),
        atsakymasRodymui: `$${vienetas * Math.max(d1, d2, d3)}°$`,
        sprendimas: `Iš viso ${dalys} dalys, viena dalis $180 : ${dalys} = ${vienetas}$°, tad didžiausias kampas $${vienetas} \\cdot ${Math.max(
          d1,
          d2,
          d3,
        )} = ${vienetas * Math.max(d1, d2, d3)}$°.`,
      })
    },
  ]

  // Lengvesniam lygiui — tik pirmieji 3 pavidalai; sunkesniam visi.
  return variacija(lygis === 1 ? visos.slice(0, 3) : visos)
}

// ── Pitagoro teorema ────────────────────────────────────────────────────────

const A_PITAGORAS = [
  {
    klausimas: 'Stačiojo trikampio statiniai 3 cm ir 4 cm. Kokia įžambinė?',
    atsakymas: '5',
    atsakymasRodymui: '$5$ cm',
    sprendimas: '$c^2 = 3^2 + 4^2 = 25$, tad $c = 5$ cm.',
  },
] as const

export const pitagoras: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkPitagora(lygis, klase), A_PITAGORAS, 'pitagoras')

function kurkPitagora(lygis: Lygis, klase?: number): Uzdavinys | null {
  // Vyresnėse klasėse imami didesni trejetai — 3–4–5 jiems jau atmintinai žinomas.
  const [a, b, c] = pasirink(vyresne(klase) ? TREJETAI.slice(5) : TREJETAI)

  const visos = [
    // 1. Įžambinė iš statinių
    () =>
      uzdavinys('pitagoras', {
        klausimas: `Stačiojo trikampio statiniai ${a} cm ir ${b} cm. Kokia įžambinė?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$ cm`,
        sprendimas: `$c^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}$, tad $c = ${c}$ cm.`,
      }),

    // 2. Statinis iš įžambinės
    () =>
      uzdavinys('pitagoras', {
        klausimas: `Stačiojo trikampio įžambinė ${c} cm, vienas statinis ${a} cm. Koks kitas statinis?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `$b^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b}$, tad $b = ${b}$ cm.`,
      }),

    // 3. Stačiojo trikampio plotas
    () => {
      const plotas = (a * b) / 2
      if (!Number.isInteger(plotas)) return null
      return uzdavinys('pitagoras', {
        klausimas: `Stačiojo trikampio įžambinė ${c} cm, vienas statinis ${a} cm. Koks trikampio plotas?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$ cm²`,
        sprendimas: `Kitas statinis $\\sqrt{${c * c} - ${a * a}} = ${b}$ cm, tad $S = \\dfrac{${a} \\cdot ${b}}{2} = ${plotas}$ cm².`,
      })
    },

    // 4. Stačiakampio įstrižainė
    () =>
      uzdavinys('pitagoras', {
        klausimas: `Stačiakampio kraštinės ${a} cm ir ${b} cm. Kokia jo įstrižainė?`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$ cm`,
        sprendimas: `Įstrižainė yra stačiojo trikampio įžambinė: $\\sqrt{${a * a} + ${
          b * b
        }} = ${c}$ cm.`,
      }),

    // 5. Kopėčios prie sienos
    () =>
      uzdavinys('pitagoras', {
        klausimas: `Kopėčios ${c} m ilgio atremtos į sieną, o jų apačia nuo sienos nutolusi ${a} m. Kokiame aukštyje kopėčios liečia sieną?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ m`,
        sprendimas: `$h = \\sqrt{${c}^2 - ${a}^2} = \\sqrt{${c * c - a * a}} = ${b}$ m.`,
      }),

    // 6. Stačiojo trikampio perimetras
    () =>
      uzdavinys('pitagoras', {
        klausimas: `Stačiojo trikampio statiniai ${a} cm ir ${b} cm. Koks jo perimetras?`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${a + b + c}$ cm`,
        sprendimas: `Įžambinė $\\sqrt{${a * a} + ${b * b}} = ${c}$ cm, tad $P = ${a} + ${b} + ${c} = ${
          a + b + c
        }$ cm.`,
      }),

    // 7. Ar trikampis statusis
    () => {
      const netikras = c + atsitiktinis(1, 3)
      return uzdavinys('pitagoras', {
        klausimas: `Trikampio kraštinės ${a} cm, ${b} cm ir ${netikras} cm. Ar jis statusis? Įrašyk „taip“ arba „ne“.`,
        atsakymas: 'ne',
        atsakymasRodymui: 'ne',
        sprendimas: `$${a}^2 + ${b}^2 = ${a * a + b * b}$, o $${netikras}^2 = ${
          netikras * netikras
        }$. Skaičiai nelygūs, tad trikampis nėra statusis.`,
      })
    },

    // 8. Lygiašonio trikampio aukštinė
    () => {
      const pagrindas = 2 * a
      return uzdavinys('pitagoras', {
        klausimas: `Lygiašonio trikampio šoninė kraštinė ${c} cm, pagrindas ${pagrindas} cm. Kokia aukštinė, nuleista į pagrindą?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `Aukštinė dalija pagrindą pusiau: $\\sqrt{${c}^2 - ${a}^2} = \\sqrt{${
          c * c - a * a
        }} = ${b}$ cm.`,
      })
    },
  ]

  // Lengvesniam lygiui — tik pirmieji 4 pavidalai; sunkesniam visi.
  return variacija(lygis === 1 ? visos.slice(0, 4) : visos)
}

// ── Apskritimas ─────────────────────────────────────────────────────────────

const A_APSKRITIMAS = [
  {
    klausimas: 'Apskritimo spindulys 6 cm. Jo ilgis yra $\\ldots \\pi$ cm. Koks skaičius prieš $\\pi$?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '$C = 2\\pi r = 2 \\cdot 6 \\cdot \\pi = 12\\pi$ cm.',
  },
] as const

export const apskritimas: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkApskritima(lygis, klase), A_APSKRITIMAS, 'apskritimas')

function kurkApskritima(lygis: Lygis, klase?: number): Uzdavinys | null {
  const r = atsitiktinis(2, didink(30, klase))

  const visos = [
    // 1. Skersmuo
    () =>
      uzdavinys('apskritimas', {
        klausimas: `Apskritimo spindulys ${r} cm. Koks jo skersmuo?`,
        atsakymas: String(2 * r),
        atsakymasRodymui: `$${2 * r}$ cm`,
        sprendimas: `Skersmuo dvigubai ilgesnis už spindulį: $2 \\cdot ${r} = ${2 * r}$ cm.`,
      }),

    // 2. Spindulys iš skersmens
    () =>
      uzdavinys('apskritimas', {
        klausimas: `Apskritimo skersmuo ${2 * r} cm. Koks jo spindulys?`,
        atsakymas: String(r),
        atsakymasRodymui: `$${r}$ cm`,
        sprendimas: `$${2 * r} : 2 = ${r}$ cm.`,
      }),

    // 3. Ilgis — atsakymas su π
    () =>
      uzdavinys('apskritimas', {
        klausimas: `Apskritimo spindulys ${r} cm. Jo ilgis yra $\\ldots \\pi$ cm. Koks skaičius rašomas prieš $\\pi$?`,
        atsakymas: String(2 * r),
        atsakymasRodymui: `$${2 * r}$`,
        sprendimas: `$C = 2\\pi r = 2 \\cdot ${r} \\cdot \\pi = ${2 * r}\\pi$ cm.`,
      }),

    // 4. Skritulio plotas
    () =>
      uzdavinys('apskritimas', {
        klausimas: `Skritulio spindulys ${r} cm. Jo plotas yra $\\ldots \\pi$ cm². Koks skaičius rašomas prieš $\\pi$?`,
        atsakymas: String(r * r),
        atsakymasRodymui: `$${r * r}$`,
        sprendimas: `$S = \\pi r^2 = \\pi \\cdot ${r}^2 = ${r * r}\\pi$ cm².`,
      }),

    // 5. Spindulys iš ilgio
    () =>
      uzdavinys('apskritimas', {
        klausimas: `Apskritimo ilgis yra ${2 * r}$\\pi$ cm. Koks jo spindulys?`,
        atsakymas: String(r),
        atsakymasRodymui: `$${r}$ cm`,
        sprendimas: `$C = 2\\pi r$, tad $r = ${2 * r}\\pi : (2\\pi) = ${r}$ cm.`,
      }),

    // 6. Skritulio išpjova
    () => {
      const dalis = pasirink([2, 4] as const)
      const plotas = (r * r) / dalis
      if (!Number.isInteger(plotas)) return null
      return uzdavinys('apskritimas', {
        klausimas: `Skritulio spindulys ${r} cm. Kokia jo ${
          dalis === 2 ? 'pusės' : 'ketvirčio'
        } ploto dalis prieš $\\pi$ (cm²)?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$`,
        sprendimas: `Viso skritulio plotas $${r * r}\\pi$, tad $${
          r * r
        }\\pi : ${dalis} = ${plotas}\\pi$ cm².`,
      })
    },

    // 7. Žiedo plotas
    () => {
      const vidinis = Math.max(1, r - atsitiktinis(1, Math.max(1, Math.floor(r / 2))))
      const plotas = r * r - vidinis * vidinis
      if (plotas <= 0) return null
      return uzdavinys('apskritimas', {
        klausimas: `Žiedą riboja du apskritimai: išorinio spindulys ${r} cm, vidinio — ${vidinis} cm. Koks skaičius rašomas prieš $\\pi$ žiedo plote?`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}$`,
        sprendimas: `$S = \\pi(${r}^2 - ${vidinis}^2) = \\pi(${r * r} - ${
          vidinis * vidinis
        }) = ${plotas}\\pi$ cm².`,
      })
    },
  ]

  // Lengvesniam lygiui — tik pirmieji 2 pavidalai; sunkesniam visi.
  return variacija(lygis === 1 ? visos.slice(0, 4) : visos)
}

// ── Trigonometrija ──────────────────────────────────────────────────────────

const A_TRIGONOMETRIJA = [
  {
    klausimas:
      'Stačiajame trikampyje statinis priešais kampą yra 3, įžambinė 5. Kam lygus to kampo sinusas? Įrašyk trupmena.',
    atsakymas: '3/5',
    atsakymasRodymui: '$\\dfrac{3}{5}$',
    sprendimas: 'Sinusas — priešais esantis statinis, padalytas iš įžambinės: $\\dfrac{3}{5}$.',
  },
] as const

export const trigonometrija: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkTrigonometrija(lygis, klase), A_TRIGONOMETRIJA, 'trigonometrija')

/** Žinomų kampų reikšmės — tik tos, kurios mokykloje mokamos atmintinai. */
const ZINOMI = [
  { kampas: 30, sin: '1/2', sinTeX: '\\dfrac{1}{2}', cos: '√3/2', tan: '√3/3' },
  { kampas: 45, sin: '√2/2', sinTeX: '\\dfrac{\\sqrt{2}}{2}', cos: '√2/2', tan: '1' },
  { kampas: 60, sin: '√3/2', sinTeX: '\\dfrac{\\sqrt{3}}{2}', cos: '1/2', tan: '√3' },
] as const

function kurkTrigonometrija(lygis: Lygis, klase?: number): Uzdavinys | null {
  const [a, b, c] = pasirink(vyresne(klase) ? TREJETAI.slice(4) : TREJETAI)

  const santykis = (x: number, y: number) => suprastink(x, y)
  // Mokykloje trupmenų su vardikliu virš 20 nebūna — riba galioja visoms klasėms.
  const vardiklioRiba = 20

  const visos = [
    // 1. Sinusas
    () => {
      const t = santykis(a, c)
      if (t.vardiklis > vardiklioRiba) return null
      return uzdavinys('trigonometrija', {
        klausimas: `Stačiajame trikampyje statinis priešais kampą yra ${a}, gretimas statinis ${b}, įžambinė ${c}. Kam lygus to kampo sinusas? Įrašyk trupmena.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${trupmenaTeX(t)}$`,
        sprendimas: `Sinusas — priešais kampą esantis statinis, padalytas iš įžambinės: $\\dfrac{${a}}{${c}} = ${trupmenaTeX(
          t,
        )}$.`,
      })
    },

    // 2. Kosinusas
    () => {
      const t = santykis(b, c)
      if (t.vardiklis > vardiklioRiba) return null
      return uzdavinys('trigonometrija', {
        klausimas: `Stačiajame trikampyje statinis priešais kampą yra ${a}, gretimas statinis ${b}, įžambinė ${c}. Kam lygus to kampo kosinusas? Įrašyk trupmena.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${trupmenaTeX(t)}$`,
        sprendimas: `Kosinusas — prie kampo esantis statinis, padalytas iš įžambinės: $\\dfrac{${b}}{${c}} = ${trupmenaTeX(
          t,
        )}$.`,
      })
    },

    // 3. Tangentas
    () => {
      const t = santykis(a, b)
      if (t.vardiklis > vardiklioRiba) return null
      return uzdavinys('trigonometrija', {
        klausimas: `Stačiajame trikampyje statinis priešais kampą yra ${a}, gretimas statinis ${b}. Kam lygus to kampo tangentas? Įrašyk trupmena.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${trupmenaTeX(t)}$`,
        sprendimas: `Tangentas — priešais esantis statinis, padalytas iš gretimo: $\\dfrac{${a}}{${b}} = ${trupmenaTeX(
          t,
        )}$.`,
      })
    },

    // 4. Žinomo kampo reikšmė
    () => {
      const z = pasirink(ZINOMI)
      return uzdavinys('trigonometrija', {
        klausimas: `Kam lygus $\\sin ${z.kampas}°$? Įrašyk tiksliai.`,
        atsakymas: z.sin,
        atsakymasRodymui: `$${z.sinTeX}$`,
        sprendimas: `Tai žinoma reikšmė: $\\sin ${z.kampas}° = ${z.sinTeX}$.`,
      })
    },

    // 5. Statinis iš sinuso
    () => {
      const t = santykis(a, c)
      if (t.vardiklis > vardiklioRiba) return null
      return uzdavinys('trigonometrija', {
        klausimas: `Stačiajame trikampyje įžambinė ${c}, o kampo sinusas lygus $${trupmenaTeX(
          t,
        )}$. Koks statinis yra priešais tą kampą?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Statinis $= c \\cdot \\sin\\alpha = ${c} \\cdot ${trupmenaTeX(
          t,
        )} = ${a}$.`,
      })
    },

    // 6. Pagrindinė tapatybė
    () => {
      const t = santykis(a, c)
      const k = santykis(b, c)
      if (t.vardiklis > vardiklioRiba || k.vardiklis > vardiklioRiba) return null
      return uzdavinys('trigonometrija', {
        klausimas: `Kampo sinusas lygus $${trupmenaTeX(
          t,
        )}$, o kampas smailusis. Kam lygus jo kosinusas? Įrašyk trupmena.`,
        atsakymas: `${k.skaitiklis}/${k.vardiklis}`,
        atsakymasRodymui: `$${trupmenaTeX(k)}$`,
        sprendimas: `Iš tapatybės $\\sin^2\\alpha + \\cos^2\\alpha = 1$ gauname $\\cos\\alpha = ${trupmenaTeX(
          k,
        )}$.`,
      })
    },

    // 7. Tangentas per sinusą ir kosinusą
    () => {
      const t = santykis(a, b)
      if (t.vardiklis > vardiklioRiba) return null
      return uzdavinys('trigonometrija', {
        klausimas: `Stačiojo trikampio statiniai ${a} ir ${b}, įžambinė ${c}. Kam lygu $\\dfrac{\\sin\\alpha}{\\cos\\alpha}$, kai $\\alpha$ — kampas priešais ${a}? Įrašyk trupmena.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${trupmenaTeX(t)}$`,
        sprendimas: `$\\dfrac{\\sin\\alpha}{\\cos\\alpha} = \\tan\\alpha = \\dfrac{${a}}{${b}} = ${trupmenaTeX(
          t,
        )}$.`,
      })
    },
  ]

  // Lengvesniam lygiui — tik pirmieji 4 pavidalai; sunkesniam visi.
  return variacija(lygis === 1 ? visos.slice(0, 4) : visos)
}
