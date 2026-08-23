import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 10 klasės tema „Trupmeninė racionalioji lygtis“ — šešios potemės.
 *
 * Turinio aprašas reikalauja, kad trupmeninėse lygtyse visada būtų nurodyti
 * apibrėžimo srities apribojimai, tad jie arba užrašyti sąlygoje, arba jų
 * pačių ir klausiama. Tekstiniuose (judėjimo, darbo, mišinių) uždaviniuose
 * skaičiai parenkami taip, kad sprendinys būtų sveikas arba gražus dešimtainis
 * — kitaip patikrinti atsakymo mokinys negalėtų.
 */

/** Trupmena KaTeX pavidalu. */
function tr(virsus: string, apacia: string): string {
  return `\\dfrac{${virsus}}{${apacia}}`
}

/** Dvinaris $x + n$ su tvarkingu ženklu. */
function dvinaris(n: number, r = 'x'): string {
  if (n === 0) return r
  return n < 0 ? `${r} - ${-n}` : `${r} + ${n}`
}

/** Dešimtainis skaičius lietuviškai — su kableliu. */
function kablelis(n: number): string {
  return String(n).replace('.', ',')
}

/** Procentai kaip dešimtainė trupmena KaTeX pavidalu: $25$ → $0{,}25$. */
function dalisTeX(procentai: number): string {
  return String(procentai / 100).replace('.', '{,}')
}

/** Dešimtainis skaičius KaTeX pavidalu — kablelis rašomas `{,}`. */
function kablelisTeX(n: number): string {
  return String(n).replace('.', '{,}')
}

// ── 1.1. Trupmeninės racionaliosios lygties samprata ────────────────────────

const T1 = 'trupmenines-lygties-samprata'

const A1 = [
  {
    klausimas: 'Kuri $x$ reikšmė nepriklauso lygties $\\dfrac{3}{x - 2} = 5$ apibrėžimo sričiai?',
    atsakymas: '2',
    atsakymasRodymui: '$x = 2$',
    sprendimas: 'Vardiklis $x - 2$ virsta nuliu, kai $x = 2$.',
  },
] as const

export const trupmeninesLygtiesSamprata: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {
  const b = atsitiktinis(2, 9)
  const k = atsitiktinis(2, 12)
  const c = atsitiktinis(2, 7)
  const d = atsitiktinis(1, 8)
  const n = atsitiktinis(2, 9)

  return variacija([
    // 1. Draudžiama reikšmė vienoje trupmenoje
    () =>
      uzdavinys(T1, {
        klausimas: `Kuri $x$ reikšmė nepriklauso lygties $${tr(String(k), dvinaris(-b))} = ${c}$ apibrėžimo sričiai?`,
        atsakymas: String(b),
        atsakymasRodymui: `$x = ${b}$`,
        sprendimas: `Vardiklis $${dvinaris(-b)}$ lygus nuliui, kai $x = ${b}$. Ties šia reikšme lygtis neapibrėžta.`,
      }),

    // 2. Kuri lygtis yra trupmeninė racionalioji
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuri lygtis yra trupmeninė racionalioji?',
        variantai: [
          `$${tr(dvinaris(1), dvinaris(-3))} = 2$`,
          `$x^2 - 3x = 0$`,
          `$${tr(dvinaris(2), '5')} = 3$`,
          `$2x - 7 = 1$`,
        ],
        teisingas: 0,
        sprendimas:
          'Trupmeninėje racionaliojoje lygtyje nežinomasis yra vardiklyje. Trupmena $\\dfrac{x + 2}{5}$ turi skaitinį vardiklį, tad tokia lygtis nėra trupmeninė.',
      }),

    // 3. Dvi draudžiamos reikšmės
    () => {
      if (b === d) return null
      return uzdavinys(T1, {
        klausimas: `Lygtyje $${tr('2', dvinaris(b))} + ${tr('1', dvinaris(-d))} = 0$ yra dvi draudžiamos $x$ reikšmės. Užrašyk didesniąją iš jų.`,
        atsakymas: String(Math.max(-b, d)),
        atsakymasRodymui: `$x = ${Math.max(-b, d)}$`,
        sprendimas: `Vardikliai virsta nuliu, kai $x = ${-b}$ ir $x = ${d}$. Didesnioji iš jų — $${Math.max(-b, d)}$.`,
      })
    },

    // 4. Kuri reikšmė yra sprendinys
    () => {
      if (b === c) return null
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Kuris skaičius yra lygties $${tr(dvinaris(-b), dvinaris(c))} = 0$ sprendinys?`,
        variantai: [`$${b}$`, `$${-c}$`, `$0$`, `$${-b}$`],
        teisingas: 0,
        sprendimas: `Trupmena lygi nuliui, kai skaitiklis nulis, o vardiklis ne: $${dvinaris(-b)} = 0$ duoda $x = ${b}$. Reikšmė $x = ${-c}$ vardiklį paverstų nuliu.`,
      })
    },

    // 5. Kodėl svarbu ieškoti vardiklio nulių
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kodėl prieš sprendžiant trupmeninę racionaliąją lygtį reikia nustatyti, kada vardiklis lygus nuliui?',
        variantai: [
          'Nes ties tomis reikšmėmis lygtis neapibrėžta, tad jos negali būti sprendiniai',
          'Nes tada lygtis visada turi du sprendinius',
          'Nes vardiklio nuliai visada yra lygties sprendiniai',
          'Nes kitaip nepavyktų sudauginti trupmenų',
        ],
        teisingas: 0,
        sprendimas: 'Dalyba iš nulio neapibrėžta, tad tokios reikšmės iš karto išbraukiamos iš apibrėžimo srities.',
      }),

    // 6. Kvadratinis vardiklis
    () =>
      uzdavinys(T1, {
        klausimas: `Užrašyk teigiamą $x$ reikšmę, kuri nepriklauso lygties $${tr(dvinaris(2), `x^2 - ${n * n}`)} = 1$ apibrėžimo sričiai.`,
        atsakymas: String(n),
        atsakymasRodymui: `$x = ${n}$`,
        sprendimas: `$x^2 - ${n * n} = 0$, kai $x = ${n}$ arba $x = ${-n}$. Teigiamoji iš jų — $${n}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T1, {
        klausimas: `Lygčiai $${tr('1', dvinaris(-b))} = ${c}$ mokinys užrašė apibrėžimo sritį „visi realieji skaičiai“. Kurią vienintelę reikšmę jis privalėjo išbraukti?`,
        atsakymas: String(b),
        atsakymasRodymui: `$x = ${b}$`,
        sprendimas: `Vardiklis $${dvinaris(-b)}$ virsta nuliu ties $x = ${b}$, tad apibrėžimo sritis yra visi realieji skaičiai, išskyrus $${b}$.`,
      }),

    // 8. Lygties konstravimas pagal draudžiamas reikšmes
    () => {
      if (b === d) return null
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Kuris vardiklis tinka lygčiai, kuri neapibrėžta ties $x = ${-b}$ ir $x = ${d}$?`,
        variantai: [
          `$(${dvinaris(b)})(${dvinaris(-d)})$`,
          `$(${dvinaris(-b)})(${dvinaris(d)})$`,
          `$(${dvinaris(b)})(${dvinaris(d)})$`,
          `$x^2 - ${b * d}$`,
        ],
        teisingas: 0,
        sprendimas: `Dauginamasis $${dvinaris(b)}$ virsta nuliu ties $x = ${-b}$, o $${dvinaris(-d)}$ — ties $x = ${d}$.`,
      })
    },

    // 9. Apibrėžimo sritis ir sprendinių aibė
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: `Duota lygtis $${tr(dvinaris(-2), dvinaris(3))} = 0$. Susiek sąvokas su jų reikšmėmis.`,
        poros: [
          { kaire: 'Apibrėžimo sritis', desine: 'visi realieji skaičiai, išskyrus $-3$' },
          { kaire: 'Sprendinių aibė', desine: 'vienas skaičius $2$' },
          { kaire: 'Draudžiama reikšmė', desine: '$x = -3$' },
        ],
        sprendimas:
          'Apibrėžimo sritis pasako, su kuriomis reikšmėmis lygtis apskritai turi prasmę, o sprendinių aibė — kurios iš jų lygybę paverčia teisinga.',
      }),
  ])
}

// ── 1.2. Lygčių sprendimas taikant trupmenos, lygios nuliui, savybę ─────────

const T2 = 'trupmena-lygi-nuliui'

const A2 = [
  {
    klausimas: 'Išspręsk lygtį $\\dfrac{x - 7}{x + 2} = 0$.',
    atsakymas: '7',
    atsakymasRodymui: '$x = 7$',
    sprendimas: 'Skaitiklis $x - 7 = 0$ duoda $x = 7$; vardiklis tada lygus $9 \\ne 0$.',
  },
] as const

export const trupmenaLygiNuliui: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  const p = atsitiktinis(2, 9)
  const q = atsitiktinis(2, 9)
  const a = pasirink([2, 3, 4, 5])
  const n = atsitiktinis(2, 8)

  return variacija([
    // 1. Paprasčiausias pavidalas
    () =>
      uzdavinys(T2, {
        klausimas: `Išspręsk lygtį $${tr(dvinaris(-p), dvinaris(q))} = 0$.`,
        atsakymas: String(p),
        atsakymasRodymui: `$x = ${p}$`,
        sprendimas: `Apibrėžimo sritis: $x \\ne ${-q}$. Skaitiklis $${dvinaris(-p)} = 0$ duoda $x = ${p}$ — ši reikšmė tinka.`,
      }),

    // 2. Skaitiklis su koeficientu
    () => {
      const b = a * atsitiktinis(1, 5)
      return uzdavinys(T2, {
        klausimas: `Išspręsk lygtį $${tr(`${a}x + ${b}`, dvinaris(-q))} = 0$.`,
        atsakymas: String(-b / a),
        atsakymasRodymui: `$x = ${-b / a}$`,
        sprendimas: `Apibrėžimo sritis: $x \\ne ${q}$. Iš $${a}x + ${b} = 0$ gauname $x = ${-b / a}$.`,
      })
    },

    // 3. Kvadratų skirtumas skaitiklyje
    () => {
      if (q === n) return null
      return uzdavinys(T2, {
        klausimas: `Išspręsk lygtį $${tr(`x^2 - ${n * n}`, dvinaris(q))} = 0$ ir užrašyk didesnįjį sprendinį.`,
        atsakymas: String(n),
        atsakymasRodymui: `$x = ${n}$`,
        sprendimas: `Apibrėžimo sritis: $x \\ne ${-q}$. Iš $x^2 = ${n * n}$ gauname $x = ${n}$ ir $x = ${-n}$; didesnysis — $${n}$.`,
      })
    },

    // 4. Vardiklis, kuris niekada nevirsta nuliu
    () => {
      const b = a * atsitiktinis(1, 4)
      return uzdavinys(T2, {
        klausimas: `Išspręsk lygtį $${tr(`${a}x - ${b}`, `x^2 + ${n}`)} = 0$.`,
        atsakymas: String(b / a),
        atsakymasRodymui: `$x = ${b / a}$`,
        sprendimas: `Vardiklis $x^2 + ${n}$ visada teigiamas, tad apribojimų nėra. Iš $${a}x - ${b} = 0$ gauname $x = ${b / a}$.`,
      })
    },

    // 5. Dvi sąlygos
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kokios dvi sąlygos turi galioti, kad trupmena $\\dfrac{A(x)}{B(x)}$ būtų lygi nuliui?',
        variantai: [
          '$A(x) = 0$ ir kartu $B(x) \\ne 0$',
          '$A(x) = 0$ ir $B(x) = 0$',
          'Pakanka, kad $B(x) = 0$',
          '$A(x)$ ir $B(x)$ turi būti lygūs',
        ],
        teisingas: 0,
        sprendimas: 'Trupmena lygi nuliui tik tada, kai jos skaitiklis nulis, o vardiklis nuliu nevirsta.',
      }),

    // 6. Skaitiklio nulis, kuris netinka
    () => {
      if (p === q) return null
      return uzdavinys(T2, {
        klausimas: `Išspręsk lygtį $${tr(`x^2 - ${p + q}x + ${p * q}`, dvinaris(-q))} = 0$.`,
        atsakymas: String(p),
        atsakymasRodymui: `$x = ${p}$`,
        sprendimas: `Skaitiklis skaidosi: $(${dvinaris(-p)})(${dvinaris(-q)})$. Jo nuliai yra $${p}$ ir $${q}$, bet $x = ${q}$ vardiklį paverstų nuliu, tad lieka $x = ${p}$.`,
      })
    },

    // 7. Bendras dauginamasis skaitiklyje ir vardiklyje
    () => {
      if (p === q) return null
      return uzdavinys(T2, {
        klausimas: `Išspręsk lygtį $${tr(`(${dvinaris(-p)})(${dvinaris(n)})`, `(${dvinaris(-p)})(${dvinaris(-q)})`)} = 0$.`,
        atsakymas: String(-n),
        atsakymasRodymui: `$x = ${-n}$`,
        sprendimas: `Pradinė apibrėžimo sritis: $x \\ne ${p}$ ir $x \\ne ${q}$. Skaitiklio nuliai yra $${p}$ ir $${-n}$, bet $${p}$ draudžiamas, tad lieka $x = ${-n}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: `Lygties $${tr(`x^2 - ${n * n}`, dvinaris(-n))} = 0$ sprendiniais mokinys užrašė $${-n}$ ir $${n}$. Užrašyk vienintelį teisingą sprendinį.`,
        atsakymas: String(-n),
        atsakymasRodymui: `$x = ${-n}$`,
        sprendimas: `Reikšmė $x = ${n}$ vardiklį $${dvinaris(-n)}$ paverčia nuliu, tad ji netinka. Lieka $x = ${-n}$.`,
      }),

    // 9. Lygties konstravimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuri lygtis turi vienintelį sprendinį $x = 5$, nors jos skaitiklis turi du nulius?',
        variantai: [
          '$\\dfrac{(x - 5)(x - 3)}{x - 3} = 0$',
          '$\\dfrac{(x - 5)(x + 5)}{x - 3} = 0$',
          '$\\dfrac{x - 5}{x - 5} = 0$',
          '$\\dfrac{(x - 5)(x - 3)}{x + 3} = 0$',
        ],
        teisingas: 0,
        sprendimas: 'Skaitiklio nuliai yra $5$ ir $3$, bet $x = 3$ vardiklį paverčia nuliu, tad lieka tik $x = 5$.',
      }),

    // 10. Kubinis skaitiklis
    () =>
      uzdavinys(T2, {
        klausimas: `Išspręsk lygtį $${tr(`x^3 - ${n * n}x`, `x^2 - ${n * n}`)} = 0$.`,
        atsakymas: '0',
        atsakymasRodymui: '$x = 0$',
        sprendimas: `Išskaidžius: $${tr(`x(${dvinaris(-n)})(${dvinaris(n)})`, `(${dvinaris(-n)})(${dvinaris(n)})`)}$. Apibrėžimo sritis: $x \\ne ${n}$ ir $x \\ne ${-n}$, tad iš skaitiklio nulių lieka tik $x = 0$.`,
      }),
  ])
}

// ── 1.3. Kiti trupmeninių lygčių sprendimo būdai ────────────────────────────

const T3 = 'trupmeniniu-lygciu-budai'

const A3 = [
  {
    klausimas: 'Išspręsk lygtį $\\dfrac{2}{x} = \\dfrac{1}{3}$, kai $x \\ne 0$.',
    atsakymas: '6',
    atsakymasRodymui: '$x = 6$',
    sprendimas: 'Sudauginę kryžmai: $x = 2 \\cdot 3 = 6$.',
  },
] as const

export const trupmeniniuLygciuBudai: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  const p = atsitiktinis(2, 7)
  const c = atsitiktinis(2, 6)
  const k = atsitiktinis(2, 9)

  return variacija([
    // 1. Kryžminė daugyba
    () => {
      const a = atsitiktinis(2, 9)
      return uzdavinys(T3, {
        klausimas: `Išspręsk lygtį $${tr(String(a), 'x')} = ${tr('1', String(c))}$, kai $x \\ne 0$.`,
        atsakymas: String(a * c),
        atsakymasRodymui: `$x = ${a * c}$`,
        sprendimas: `Sudauginę kryžmai gauname $x = ${a} \\cdot ${c} = ${a * c}$.`,
      })
    },

    // 2. Trupmena su laisvuoju nariu
    () => {
      const m = atsitiktinis(2, 6)
      const skirtumas = atsitiktinis(1, 4)
      const sprendinys = p + k / skirtumas
      if (!Number.isInteger(sprendinys)) return null
      return uzdavinys(T3, {
        klausimas: `Išspręsk lygtį $${tr(String(k), dvinaris(-p))} + ${m} = ${m + skirtumas}$, kai $x \\ne ${p}$.`,
        atsakymas: String(sprendinys),
        atsakymasRodymui: `$x = ${sprendinys}$`,
        sprendimas: `$${tr(String(k), dvinaris(-p))} = ${skirtumas}$, tad $${dvinaris(-p)} = ${tr(String(k), String(skirtumas))} = ${k / skirtumas}$ ir $x = ${sprendinys}$.`,
      })
    },

    // 3. Dvi trupmenos su skirtingais vardikliais
    () => {
      const a = atsitiktinis(2, 6)
      const b = atsitiktinis(2, 6)
      if (a === b) return null
      const q = atsitiktinis(2, 7)
      const vardiklis = a - b
      const skaitiklis = a * q + b * p
      if (skaitiklis % vardiklis !== 0) return null
      const x = skaitiklis / vardiklis
      if (x === -p || x === q || Math.abs(x) > 60) return null
      return uzdavinys(T3, {
        klausimas: `Išspręsk lygtį $${tr(String(a), dvinaris(p))} = ${tr(String(b), dvinaris(-q))}$, kai $x \\ne ${-p}$ ir $x \\ne ${q}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Kryžminė daugyba: $${a}(${dvinaris(-q)}) = ${b}(${dvinaris(p)})$, iš čia $${a - b}x = ${skaitiklis}$ ir $x = ${x}$.`,
      })
    },

    // 4. Trupmena su skaitiniu vardikliu
    () => {
      const b = atsitiktinis(2, 6)
      const a = atsitiktinis(1, b - 1)
      if (a >= b) return null
      const x = (k * b) / (b - a)
      if (!Number.isInteger(x)) return null
      return uzdavinys(T3, {
        klausimas: `Išspręsk lygtį $${tr(String(k), 'x')} + ${tr(String(a), String(b))} = 1$, kai $x \\ne 0$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `$${tr(String(k), 'x')} = 1 - ${tr(String(a), String(b))} = ${tr(String(b - a), String(b))}$, tad $x = ${tr(`${k} \\cdot ${b}`, String(b - a))} = ${x}$.`,
      })
    },

    // 5. Vienodi vardikliai
    () => {
      const a = atsitiktinis(3, 9)
      const b = atsitiktinis(1, a - 1)
      const x = p + c * (a - b)
      if (Math.abs(x) > 80) return null
      return uzdavinys(T3, {
        klausimas: `Išspręsk lygtį $${tr(String(a), dvinaris(-p))} - ${tr(String(b), dvinaris(-p))} = ${tr('1', String(c))}$, kai $x \\ne ${p}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Kairėje lieka $${tr(String(a - b), dvinaris(-p))}$. Tada $${dvinaris(-p)} = ${c} \\cdot ${a - b} = ${c * (a - b)}$ ir $x = ${x}$.`,
      })
    },

    // 6. Kryžminė daugyba su dviem dvinariais
    () => {
      const a = atsitiktinis(1, 6)
      const b = atsitiktinis(1, 6)
      const d = atsitiktinis(1, 6)
      const e = atsitiktinis(1, 6)
      const vardiklis = a + d + b + e
      const skaitiklis = b * d - a * e
      if (vardiklis === 0 || skaitiklis % vardiklis !== 0) return null
      const x = skaitiklis / vardiklis
      if (x === b || x === -e || Math.abs(x) > 40) return null
      return uzdavinys(T3, {
        klausimas: `Išspręsk lygtį $${tr(dvinaris(a), dvinaris(-b))} = ${tr(dvinaris(-d), dvinaris(e))}$, kai $x \\ne ${b}$ ir $x \\ne ${-e}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Sudauginę kryžmai ir suprastinę $x^2$, gauname $${vardiklis}x = ${skaitiklis}$, tad $x = ${x}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas:
          'Spręsdamas lygtį $\\dfrac{1}{x} + \\dfrac{1}{x + 1} = 1$, mokinys iš bendrojo vardiklio padaugino tik pirmąjį narį. Kaip reikėjo?',
        variantai: [
          'Iš bendrojo vardiklio dauginami visi lygties nariai, ir kairėje, ir dešinėje',
          'Pakanka padauginti tik trupmenas, o dešinę pusę galima palikti',
          'Bendrasis vardiklis dauginamas tik iš didesniojo skaitiklio',
          'Reikėjo vardiklius sudėti ir gauti $2x + 1$',
        ],
        teisingas: 0,
        sprendimas:
          'Dauginant lygtį iš bendrojo vardiklio, dauginama abi lygties pusės — antraip lygybė pasikeičia.',
      }),

    // 8. Kvadratinė lygtis po pertvarkymo
    () => {
      const x = atsitiktinis(3, 9)
      if (x <= p) return null
      const cc = (x * x - p * p) / (2 * p)
      if (!Number.isInteger(cc) || cc < 2 || cc > 30) return null
      return uzdavinys(T3, {
        klausimas: `Išspręsk lygtį $${tr('1', dvinaris(-p))} - ${tr('1', dvinaris(p))} = ${tr('1', String(cc))}$, kai $x \\ne ${p}$ ir $x \\ne ${-p}$. Užrašyk teigiamą sprendinį.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Kairėje $${tr(String(2 * p), `x^2 - ${p * p}`)}$, tad $x^2 - ${p * p} = ${2 * p * cc}$ ir $x^2 = ${x * x}$. Teigiamas sprendinys — $${x}$.`,
      })
    },

    // 9. Modelio kūrimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuri trupmeninė lygtis su dviem skirtingais tiesiniais vardikliais turi sveikąjį sprendinį?',
        variantai: [
          '$\\dfrac{6}{x - 1} = \\dfrac{3}{x - 4}$, sprendinys $x = 7$',
          '$\\dfrac{6}{x - 1} = \\dfrac{3}{x - 4}$, sprendinys $x = 4$',
          '$\\dfrac{5}{x} = \\dfrac{5}{x + 2}$, sprendinys $x = 2$',
          '$\\dfrac{1}{x - 2} = \\dfrac{1}{x - 2}$, sprendinys $x = 2$',
        ],
        teisingas: 0,
        sprendimas: 'Kryžminė daugyba duoda $6(x - 4) = 3(x - 1)$, tad $3x = 21$ ir $x = 7$; abu vardikliai tada nenuliniai.',
      }),
  ])
}

// ── 1.4. Judėjimo uždaviniai ────────────────────────────────────────────────

const T4 = 'judejimo-uzdaviniai-10'

/** Uždaviniai „greitis didesnis — laikas trumpesnis“ su sveikais sprendiniais. */
const GREICIAI = [
  { v: 50, d: 10, s: 300 },
  { v: 40, d: 10, s: 200 },
  { v: 60, d: 15, s: 300 },
  { v: 30, d: 6, s: 180 },
  { v: 45, d: 15, s: 180 },
  { v: 80, d: 20, s: 400 },
] as const

/** Uždaviniai apie plaukimą pasroviui ir prieš srovę. */
const VALTYS = [
  { s: 24, laikas: 5, srove: 2, v: 10 },
  { s: 8, laikas: 3, srove: 2, v: 6 },
  { s: 20, laikas: 5, srove: 3, v: 9 },
  { s: 12, laikas: 3, srove: 3, v: 9 },
  { s: 45, laikas: 4, srove: 6, v: 24 },
] as const

const A4 = [
  {
    klausimas: 'Automobilis pastoviu $60$ km/h greičiu nuvažiavo $180$ km. Kiek valandų truko kelionė?',
    atsakymas: '3',
    atsakymasRodymui: '$3$ h',
    sprendimas: '$t = \\dfrac{s}{v} = \\dfrac{180}{60} = 3$.',
  },
] as const

export const judejimoUzdaviniai10: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  const g = pasirink(GREICIAI)
  const valtis = pasirink(VALTYS)
  const kelias = pasirink([120, 180, 240, 300])
  const greitis = pasirink([40, 50, 60])

  return variacija([
    // 1. Laikas kaip greičio funkcija
    () =>
      uzdavinys(T4, {
        klausimas: `Automobilis $${kelias}$ km važiavo pastoviu $v$ km/h greičiu. Kelionės laikas užrašomas $t = ${tr(String(kelias), 'v')}$. Kiek valandų truko kelionė, kai $v = ${greitis}$?`,
        atsakymas: String(kelias / greitis),
        atsakymasRodymui: `$${kablelis(kelias / greitis)}$ h`,
        sprendimas: `$t = ${tr(String(kelias), String(greitis))} = ${kablelis(kelias / greitis)}$.`,
      }),

    // 2. Lygties sudarymas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas:
          'Dviratininkas turėjo nuvažiuoti $60$ km. Padidinęs greitį $5$ km/h, kelionę jis baigė $1$ h anksčiau. Kuri lygtis atitinka šią sąlygą, kai pradinis greitis $x$ km/h?',
        variantai: [
          '$\\dfrac{60}{x} - \\dfrac{60}{x + 5} = 1$',
          '$\\dfrac{60}{x + 5} - \\dfrac{60}{x} = 1$',
          '$\\dfrac{60}{x} + \\dfrac{60}{x + 5} = 1$',
          '$\\dfrac{x}{60} - \\dfrac{x + 5}{60} = 1$',
        ],
        teisingas: 0,
        sprendimas:
          'Didesniu greičiu važiuojama trumpiau, tad iš ilgesniojo laiko $\\dfrac{60}{x}$ atimamas trumpesnysis $\\dfrac{60}{x + 5}$.',
      }),

    // 3. Du laikai per tą patį nežinomąjį
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Du miestus skiria $240$ km. Grįžtant važiuota $x$ km/h greičiu, o pirmyn — $20$ km/h greičiau. Kaip užrašomi abu kelionės laikai?`,
        variantai: [
          'pirmyn $\\dfrac{240}{x + 20}$, atgal $\\dfrac{240}{x}$',
          'pirmyn $\\dfrac{240}{x}$, atgal $\\dfrac{240}{x + 20}$',
          'pirmyn $\\dfrac{x + 20}{240}$, atgal $\\dfrac{x}{240}$',
          'pirmyn $240(x + 20)$, atgal $240x$',
        ],
        teisingas: 0,
        sprendimas: 'Laikas randamas dalijant kelią iš greičio: $t = \\dfrac{s}{v}$.',
      }),

    // 4. Pasroviui ir prieš srovę
    () =>
      uzdavinys(T4, {
        klausimas: `Laivas $36$ km pasroviui plaukė $x + 3$ km/h greičiu, o tiek pat prieš srovę — $x - 3$ km/h greičiu. Kiek valandų truko plaukimas pasroviui, kai $x = 9$? Sąlyga: $x \\ne 3$ ir $x \\ne -3$.`,
        atsakymas: '3',
        atsakymasRodymui: '$3$ h',
        sprendimas: '$t = \\dfrac{36}{9 + 3} = \\dfrac{36}{12} = 3$.',
      }),

    // 5. Kodėl gaunamos trupmeninės lygtys
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kodėl judėjimo uždaviniuose dažnai gaunamos trupmeninės racionaliosios lygtys?',
        variantai: [
          'Nes laikas skaičiuojamas $t = \\dfrac{s}{v}$, o nežinomasis dažniausiai yra greitis, tad atsiduria vardiklyje',
          'Nes kelias visada yra trupmena',
          'Nes greitis niekada nebūna sveikasis skaičius',
          'Nes laikas visuomet trumpesnis už vieną valandą',
        ],
        teisingas: 0,
        sprendimas: 'Nežinomas greitis vardiklyje ir paverčia lygtį trupmenine racionaliąja.',
      }),

    // 6. Greičio radimas
    () =>
      uzdavinys(T4, {
        klausimas: `Automobilis $${g.s}$ km planavo įveikti pastoviu greičiu. Važiuodamas $${g.d}$ km/h greičiau, jis sugaišo $1$ h mažiau. Koks buvo planuotas greitis (km/h)?`,
        atsakymas: String(g.v),
        atsakymasRodymui: `$${g.v}$ km/h`,
        sprendimas: `Lygtis $${tr(String(g.s), 'x')} - ${tr(String(g.s), dvinaris(g.d))} = 1$ duoda $x^2 + ${g.d}x - ${g.s * g.d} = 0$, tad $x = ${g.v}$. Laikai: $${g.s / g.v}$ h ir $${g.s / (g.v + g.d)}$ h.`,
      }),

    // 7. Kelionė dviem atkarpomis
    () => {
      const x = pasirink([8, 12, 16])
      const d = 4
      const s = 48
      const laikas = (s * (2 * x + d)) / (x * (x + d))
      if (!Number.isInteger(laikas)) return null
      return uzdavinys(T4, {
        klausimas: `Dviratininkas pirmus $${s}$ km važiavo $x$ km/h greičiu, o kitus $${s}$ km — $${d}$ km/h greičiau. Visa kelionė truko $${laikas}$ h. Rask $x$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$ km/h`,
        sprendimas: `Iš $${tr(String(s), 'x')} + ${tr(String(s), dvinaris(d))} = ${laikas}$ gauname $x = ${x}$; tada atkarpos trunka $${s / x}$ h ir $${s / (x + d)}$ h.`,
      })
    },

    // 8. Valtis su srove
    () =>
      uzdavinys(T4, {
        klausimas: `Valtis $${valtis.s}$ km plaukė pasroviui ir tiek pat prieš srovę, iš viso sugaišdama $${valtis.laikas}$ h. Srovės greitis $${valtis.srove}$ km/h. Koks valties greitis stovinčiame vandenyje (km/h)?`,
        atsakymas: String(valtis.v),
        atsakymasRodymui: `$${valtis.v}$ km/h`,
        sprendimas: `Lygtis $${tr(String(valtis.s), dvinaris(valtis.srove))} + ${tr(String(valtis.s), dvinaris(-valtis.srove))} = ${valtis.laikas}$ duoda $x = ${valtis.v}$; sąlyga $x > ${valtis.srove}$.`,
      }),

    // 9. Klaidos taisymas
    () => {
      const v = pasirink([48, 60, 40])
      const t = 120 / v
      if (!Number.isInteger(t * 10)) return null
      return uzdavinys(T4, {
        klausimas: `Uždavinyje apie $120$ km kelionę mokinys laiką užrašė $${tr('v', '120')}$. Užrašęs teisingą modelį rask greitį $v$ (km/h), jei kelionė truko $${kablelis(t)}$ h.`,
        atsakymas: String(v),
        atsakymasRodymui: `$${v}$ km/h`,
        sprendimas: `Teisinga formulė yra $t = ${tr('120', 'v')}$. Tada $v = ${tr('120', kablelis(t))} = ${v}$.`,
      })
    },
  ])
}

// ── 1.5. Darbo uždaviniai ───────────────────────────────────────────────────

const T5 = 'darbo-uzdaviniai'

/** Poros „vienas dirba $a$ val., kartu — $t$ val.“ su sveiku antrojo laiku. */
const DARBININKAI = [
  { a: 6, t: 4, b: 12 },
  { a: 12, t: 8, b: 24 },
  { a: 15, t: 6, b: 10 },
  { a: 20, t: 12, b: 30 },
  { a: 6, t: 2, b: 3 },
  { a: 10, t: 4, b: 20 },
] as const

/** Du vamzdžiai: pirmasis $d$ val. greitesnis, kartu — $t$ val. */
const VAMZDZIAI = [
  { t: 4, d: 6, pirmas: 6, antras: 12 },
  { t: 3, d: 8, pirmas: 4, antras: 12 },
  { t: 6, d: 5, pirmas: 10, antras: 15 },
  { t: 6, d: 16, pirmas: 8, antras: 24 },
] as const

const A5 = [
  {
    klausimas: 'Vienas siurblys baseiną pripildo per $6$ h, kitas — per $3$ h. Per kiek valandų baseiną pripildytų abu kartu?',
    atsakymas: '2',
    atsakymasRodymui: '$2$ h',
    sprendimas: 'Per valandą kartu pripildoma $\\dfrac{1}{6} + \\dfrac{1}{3} = \\dfrac{1}{2}$ baseino, tad reikia $2$ h.',
  },
] as const

export const darboUzdaviniai: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  const d = pasirink(DARBININKAI)
  const v = pasirink(VAMZDZIAI)
  const pirmas = pasirink([6, 8, 10, 12])
  const antras = pasirink([3, 4, 5, 6])

  return variacija([
    // 1. Darbo dalis per valandą
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Darbuotojas visą darbą vienas atliktų per $x$ valandų. Kokią darbo dalį jis atlieka per $1$ valandą?',
        variantai: ['$\\dfrac{1}{x}$', '$x$', '$\\dfrac{x}{1}$', '$x - 1$'],
        teisingas: 0,
        sprendimas: 'Visas darbas laikomas vienetu; per valandą atliekama $\\dfrac{1}{x}$ jo dalis.',
      }),

    // 2. Bendras dviejų siurblių našumas
    () => {
      const vardiklis = (pirmas * antras) / (pirmas + antras)
      if (!Number.isInteger(vardiklis) || vardiklis > 20) return null
      return uzdavinys(T5, {
        klausimas: `Vienas siurblys baseiną pripildo per $${pirmas}$ h, kitas — per $${antras}$ h. Per kiek valandų baseiną pripildytų abu kartu?`,
        atsakymas: String(vardiklis),
        atsakymasRodymui: `$${vardiklis}$ h`,
        sprendimas: `Per valandą kartu pripildoma $${tr('1', String(pirmas))} + ${tr('1', String(antras))} = ${tr('1', String(vardiklis))}$ baseino, tad visam baseinui reikia $${vardiklis}$ h.`,
      })
    },

    // 3. Bendras našumas su raide
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Pirmasis darbininkas darbą atlieka per $x$ valandų, antrasis — per $x + 2$ valandas. Kaip užrašomas jų bendras vienos valandos našumas?',
        variantai: [
          '$\\dfrac{1}{x} + \\dfrac{1}{x + 2}$',
          '$\\dfrac{1}{2x + 2}$',
          '$x + (x + 2)$',
          '$\\dfrac{2}{x + 2}$',
        ],
        teisingas: 0,
        sprendimas: 'Sudedami našumai, o ne laikai; apibrėžimo sritis: $x \\ne 0$ ir $x \\ne -2$.',
      }),

    // 4. Antrojo įrenginio laikas
    () =>
      uzdavinys(T5, {
        klausimas: `Du įrenginiai kartu darbą atlieka per $${d.t}$ h. Vienas jį vienas atliktų per $${d.a}$ h. Per kiek valandų darbą vienas atliktų antrasis?`,
        atsakymas: String(d.b),
        atsakymasRodymui: `$${d.b}$ h`,
        sprendimas: `Iš $${tr('1', String(d.a))} + ${tr('1', 'x')} = ${tr('1', String(d.t))}$ gauname $${tr('1', 'x')} = ${tr('1', String(d.t))} - ${tr('1', String(d.a))}$, tad $x = ${d.b}$.`,
      }),

    // 5. Kodėl darbas laikomas vienetu
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kodėl darbo uždaviniuose visas darbas dažnai laikomas lygiu $1$?',
        variantai: [
          'Nes tada našumas per valandą tampa $\\dfrac{1}{t}$ ir našumus galima sudėti',
          'Nes darbas visada trunka vieną valandą',
          'Nes taip išvengiama trupmenų',
          'Nes vienas darbininkas visada atlieka vieną darbą',
        ],
        teisingas: 0,
        sprendimas: 'Konkretus darbo kiekis nesvarbu, todėl patogu jį laikyti vienetu — tada našumas yra $\\dfrac{1}{t}$.',
      }),

    // 6. Du vamzdžiai su skirtumu
    () =>
      uzdavinys(T5, {
        klausimas: `Du vamzdžiai kartu talpą pripildo per $${v.t}$ h. Pirmasis vienas tai padarytų $${v.d}$ h greičiau negu antrasis. Per kiek valandų talpą pripildytų pirmasis vamzdis?`,
        atsakymas: String(v.pirmas),
        atsakymasRodymui: `$${v.pirmas}$ h`,
        sprendimas: `Iš $${tr('1', 'x')} + ${tr('1', dvinaris(v.d))} = ${tr('1', String(v.t))}$ gauname $x = ${v.pirmas}$; antrasis dirbtų $${v.antras}$ h. Sąlyga: $x > 0$.`,
      }),

    // 7. Klaidos paaiškinimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Norėdamas rasti dviejų darbininkų bendro darbo laiką, mokinys sudėjo jų laikus: $5 + 8$. Kodėl tai neteisinga?',
        variantai: [
          'Dirbant kartu darbas atliekamas greičiau, tad sudedami našumai, o ne laikai',
          'Reikėjo laikus padauginti',
          'Reikėjo laikus atimti',
          'Reikėjo imti didesnįjį laiką',
        ],
        teisingas: 0,
        sprendimas: 'Bendras laikas visada mažesnis už kiekvieno atskirai, tad $5 + 8$ negali būti atsakymas; sudedama $\\dfrac{1}{5} + \\dfrac{1}{8}$.',
      }),

    // 8. Lygtis su x ir x + 3
    () =>
      uzdavinys(T5, {
        klausimas: `Pirmasis darbuotojas per valandą padaro $${tr('1', 'x')}$ darbo, antrasis — $${tr('1', dvinaris(3))}$. Kartu darbą jie atlieka per $2$ h. Per kiek valandų darbą atliktų pirmasis?`,
        atsakymas: '3',
        atsakymasRodymui: '$3$ h',
        sprendimas:
          'Iš $\\dfrac{1}{x} + \\dfrac{1}{x + 3} = \\dfrac{1}{2}$ gauname $x^2 - x - 6 = 0$, tad $x = 3$ (neigiamas sprendinys netinka).',
      }),

    // 9. Sprendinio tikrinimas pagal kontekstą
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas:
          'Spręsdamas darbo uždavinį mokinys gavo du sprendinius: $x = 8$ ir $x = -3$. Kaip pasielgti su neigiamuoju?',
        variantai: [
          'Atmesti — darbo trukmė negali būti neigiama',
          'Palikti abu, nes abu tenkina lygtį',
          'Paimti jo modulį ir gauti $3$',
          'Sudėti abu ir gauti $5$',
        ],
        teisingas: 0,
        sprendimas: 'Sprendinys turi tikti ne tik lygčiai, bet ir uždavinio prasmei: laikas yra teigiamas dydis.',
      }),
  ])
}

// ── 1.6. Mišiniai ───────────────────────────────────────────────────────────

const T6 = 'misiniu-uzdaviniai'

const A6 = [
  {
    klausimas: 'Kiek kilogramų grynos medžiagos yra $8$ kg $25$ % mišinio?',
    atsakymas: '2',
    atsakymasRodymui: '$2$ kg',
    sprendimas: '$8 \\cdot 0{,}25 = 2$.',
  },
] as const

export const misiniuUzdaviniai: Generatorius = () => suBandymais(kurk6, A6, T6)

function kurk6(): Uzdavinys | null {
  const mase = pasirink([8, 12, 16, 20, 24])
  const proc = pasirink([15, 20, 25, 30, 40])

  return variacija([
    // 1. Gryna medžiaga mišinyje
    () => {
      const kiek = (mase * proc) / 100
      if (!Number.isInteger(kiek * 10)) return null
      return uzdavinys(T6, {
        klausimas: `Kiek kilogramų grynos medžiagos yra $${mase}$ kg $${proc}$ % mišinio?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kablelis(kiek)}$ kg`,
        sprendimas: `$${mase} \\cdot ${tr(String(proc), '100')} = ${kablelis(kiek)}$.`,
      })
    },

    // 2. Koncentracija įpylus vandens
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Į $10$ l $20$ % tirpalo įpilta $x$ litrų vandens. Kaip užrašoma naujoji koncentracija?',
        variantai: [
          '$\\dfrac{2}{10 + x}$',
          '$\\dfrac{2 + x}{10}$',
          '$\\dfrac{2}{10 - x}$',
          '$\\dfrac{10 + x}{2}$',
        ],
        teisingas: 0,
        sprendimas: 'Grynos medžiagos lieka $10 \\cdot 0{,}2 = 2$ l, o visas tūris tampa $10 + x$ litrų.',
      }),

    // 3. Grynas metalas lydinyje su raide
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Turime $x$ kg $30$ % lydinio. Kokia jame esančio gryno metalo masė?',
        variantai: ['$0{,}3x$', '$30x$', '$\\dfrac{x}{30}$', '$x - 0{,}3$'],
        teisingas: 0,
        sprendimas: 'Procentai paverčiami dešimtaine trupmena: $30\\ \\% = 0{,}3$.',
      }),

    // 4. Dviejų tirpalų maišymas
    () => {
      const v1 = pasirink([4, 5, 6])
      const v2 = pasirink([4, 6, 10])
      const p1 = 10
      const p2 = 30
      if ((v1 * p1 + v2 * p2) % (v1 + v2) !== 0) return null
      const nauja = (v1 * p1 + v2 * p2) / (v1 + v2)
      const gryna = (v1 * p1 + v2 * p2) / 100
      return uzdavinys(T6, {
        klausimas: `Sumaišyta $${v1}$ l $${p1}$ % ir $${v2}$ l $${p2}$ % tirpalų. Kokia gauto tirpalo koncentracija (procentais)?`,
        atsakymas: String(nauja),
        atsakymasRodymui: `$${nauja}$ %`,
        sprendimas: `Grynos medžiagos: $${kablelis((v1 * p1) / 100)} + ${kablelis((v2 * p2) / 100)} = ${kablelis(gryna)}$ l; viso tirpalo $${v1 + v2}$ l. Koncentracija $${tr(kablelis(gryna).replace(',', '{,}'), String(v1 + v2))} = ${nauja}\\ \\%$.`,
      })
    },

    // 5. Kokius du dydžius sekti
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kokius du dydžius reikia sekti sprendžiant mišinių uždavinius?',
        variantai: [
          'Visą mišinio kiekį ir jame esančios grynos medžiagos kiekį',
          'Tik koncentraciją procentais',
          'Tik viso mišinio kiekį',
          'Mišinio temperatūrą ir kiekį',
        ],
        teisingas: 0,
        sprendimas: 'Maišant abu dydžiai sudedami, o koncentracija yra jų santykis — todėl ji pati nesudedama.',
      }),

    // 6. Garinimas
    () => {
      const v = pasirink([20, 30, 40])
      const nuo = pasirink([15, 20])
      const iki = pasirink([25, 30, 40])
      if (iki <= nuo) return null
      const gryna = (v * nuo) / 100
      const naujasTuris = (gryna * 100) / iki
      const isgaravo = v - naujasTuris
      if (!Number.isInteger(isgaravo)) return null
      return uzdavinys(T6, {
        klausimas: `Kiek litrų vandens reikia išgarinti iš $${v}$ l $${nuo}$ % tirpalo, kad koncentracija taptų $${iki}$ %?`,
        atsakymas: String(isgaravo),
        atsakymasRodymui: `$${isgaravo}$ l`,
        sprendimas: `Grynos medžiagos $${kablelis(gryna).replace(',', '{,}')}$ l, ir garinant ji nekinta. Naujas tūris $${tr(kablelis(gryna).replace(',', '{,}'), dalisTeX(iki))} = ${naujasTuris}$ l, tad išgaravo $${v} - ${naujasTuris} = ${isgaravo}$ l.`,
      })
    },

    // 7. Kiek stipresnio tirpalo pridėti
    () => {
      const stiprus = 40
      const silpnas = 10
      const kiekis = pasirink([10, 20])
      const tikslas = 25
      const x = (kiekis * (tikslas - silpnas)) / (stiprus - tikslas)
      if (!Number.isInteger(x)) return null
      return uzdavinys(T6, {
        klausimas: `Kiek litrų $${stiprus}$ % tirpalo reikia sumaišyti su $${kiekis}$ l $${silpnas}$ % tirpalo, kad gautume $${tikslas}$ % tirpalą?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$ l`,
        sprendimas: `Lygtis $${dalisTeX(stiprus)}x + ${kablelis((kiekis * silpnas) / 100).replace(',', '{,}')} = ${dalisTeX(tikslas)}(x + ${kiekis})$ duoda $x = ${x}$.`,
      })
    },

    // 8. Klaidos radimas
    () => {
      const v = 12
      const vanduo = 3
      const p = 30
      const nauja = (v * p) / (v + vanduo)
      if (!Number.isInteger(nauja)) return null
      return uzdavinys(T6, {
        klausimas: `Į $${v}$ l $${p}$ % tirpalo įpylus $${vanduo}$ l vandens, mokinys koncentraciją apskaičiavo $${p}\\ \\% - ${vanduo}\\ \\% = ${p - vanduo}\\ \\%$. Kokia iš tikrųjų yra naujoji koncentracija (procentais)?`,
        atsakymas: String(nauja),
        atsakymasRodymui: `$${nauja}$ %`,
        sprendimas: `Grynos medžiagos lieka $${kablelisTeX((v * p) / 100)}$ l, o tūris tampa $${v + vanduo}$ l: $${tr(kablelisTeX((v * p) / 100), String(v + vanduo))} = ${nauja}\\ \\%$. Procentų atimti negalima — jie skaičiuojami nuo skirtingų dydžių.`,
      })
    },

    // 9. Du tirpalai duotam kiekiui
    () => {
      const p1 = 20
      const p2 = 50
      const turis = pasirink([12, 15, 18])
      const tikslas = pasirink([30, 35, 40])
      const y = (turis * (tikslas - p1)) / (p2 - p1)
      if (!Number.isInteger(y) || y <= 0 || y >= turis) return null
      return uzdavinys(T6, {
        klausimas: `Iš $${p1}$ % ir $${p2}$ % tirpalų reikia paruošti $${turis}$ l $${tikslas}$ % tirpalo. Kiek litrų $${p1}$ % tirpalo reikės?`,
        atsakymas: String(turis - y),
        atsakymasRodymui: `$${turis - y}$ l`,
        sprendimas: `Iš sistemos $x + y = ${turis}$ ir $${dalisTeX(p1)}x + ${dalisTeX(p2)}y = ${kablelis((turis * tikslas) / 100).replace(',', '{,}')}$ gauname $y = ${y}$, tad $x = ${turis - y}$.`,
      })
    },
  ])
}
