import { atsitiktinis, atsitiktinisBe, pasirink } from '../matematika'
import { sk, suBandymais, uzdavinys, variacija } from './bendra'
import { didink, vyresne } from './mastas'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

/**
 * Algebra: raidiniai reiškiniai, nelygybės, šaknys, greitosios daugybos
 * formulės, lygčių sistemos, funkcijos.
 *
 * Kaip ir visur, sprendinys parenkamas pirma, koeficientai išvedami iš jo.
 */

/** `3a - 5` pavidalas be pertekliaus. */
function narys(koef: number, raide: string, laisvasis: number): string {
  const kint = koef === 1 ? raide : koef === -1 ? `-${raide}` : `${koef}${raide}`
  if (laisvasis === 0) return kint
  return `${kint} ${laisvasis > 0 ? '+' : '-'} ${Math.abs(laisvasis)}`
}

// ── Raidiniai reiškiniai ────────────────────────────────────────────────────

const A_RAIDINIAI = [
  {
    klausimas: 'Apskaičiuok reiškinio $3a + 5$ reikšmę, kai $a = 4$.',
    atsakymas: '17',
    atsakymasRodymui: '$17$',
    sprendimas: 'Vietoj $a$ įrašome 4: $3 \\cdot 4 + 5 = 17$.',
  },
] as const

export const raidiniaiReiskiniai: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkRaidini(lygis, klase), A_RAIDINIAI, 'raidiniai-reiskiniai')

function kurkRaidini(lygis: Lygis, klase?: number): Uzdavinys | null {
  const raide = pasirink(['a', 'b', 'x', 'n'] as const)

  if (lygis === 1) {
    const k = atsitiktinis(2, didink(9, klase))
    const c = atsitiktinis(1, didink(20, klase))
    const a = atsitiktinis(2, didink(12, klase))
    return uzdavinys('raidiniai-reiskiniai', {
      klausimas: `Apskaičiuok reiškinio $${narys(k, raide, c)}$ reikšmę, kai $${raide} = ${a}$.`,
      atsakymas: String(k * a + c),
      atsakymasRodymui: `$${k * a + c}$`,
      sprendimas: `Vietoj $${raide}$ įrašome ${a}: $${k} \\cdot ${a} + ${c} = ${k * a + c}$.`,
    })
  }

  if (lygis === 2) {
    const k = atsitiktinis(2, didink(9, klase))
    const c = atsitiktinisBe(-didink(20, klase), didink(20, klase), [0])
    const a = atsitiktinisBe(-didink(8, klase), didink(8, klase), [0, 1])
    const rez = k * a + c
    if (Math.abs(rez) > didink(100, klase)) return null
    return uzdavinys('raidiniai-reiskiniai', {
      klausimas: `Apskaičiuok reiškinio $${narys(k, raide, c)}$ reikšmę, kai $${raide} = ${a}$.`,
      atsakymas: String(rez),
      atsakymasRodymui: `$${rez}$`,
      sprendimas: `$${k} \\cdot (${a}) ${c > 0 ? '+' : '-'} ${Math.abs(c)} = ${
        k * a
      } ${c > 0 ? '+' : '-'} ${Math.abs(c)} = ${rez}$.`,
    })
  }

  // 3 lygis — reiškinys su dviem kintamaisiais.
  const k1 = atsitiktinis(2, didink(7, klase))
  const k2 = atsitiktinis(2, didink(7, klase))
  const a = atsitiktinis(2, didink(9, klase))
  const b = atsitiktinis(2, didink(9, klase))
  const rez = k1 * a - k2 * b
  if (rez <= 0 || rez > didink(80, klase)) return null

  return uzdavinys('raidiniai-reiskiniai', {
    klausimas: `Apskaičiuok reiškinio $${k1}a - ${k2}b$ reikšmę, kai $a = ${a}$ ir $b = ${b}$.`,
    atsakymas: String(rez),
    atsakymasRodymui: `$${rez}$`,
    sprendimas: `$${k1} \\cdot ${a} - ${k2} \\cdot ${b} = ${k1 * a} - ${k2 * b} = ${rez}$.`,
  })
}

// ── Nelygybės ───────────────────────────────────────────────────────────────

const A_NELYGYBES = [
  {
    klausimas: 'Išspręsk nelygybę $3x > 12$. Įrašyk mažiausią sveikąjį $x$, kuris ją tenkina.',
    atsakymas: '5',
    atsakymasRodymui: '$x = 5$',
    sprendimas: '$x > 4$, tad mažiausias sveikasis sprendinys yra 5.',
  },
] as const

export const nelygybes: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkNelygybe(lygis, klase), A_NELYGYBES, 'nelygybes')

function kurkNelygybe(lygis: Lygis, klase?: number): Uzdavinys | null {
  const a = atsitiktinis(2, didink(9, klase))
  const riba = atsitiktinis(2, didink(15, klase))
  const b = lygis === 1 ? 0 : atsitiktinisBe(-didink(20, klase), didink(20, klase), [0])
  const virsus = didink(90, klase)

  const visos = [
    // 1. Griežta nelygybė — mažiausias sveikasis sprendinys
    () => {
      const desine = a * riba + b
      if (Math.abs(desine) > virsus) return null
      return uzdavinys('nelygybes', {
        klausimas: `Išspręsk nelygybę $${narys(a, 'x', b)} > ${desine}$. Įrašyk mažiausią sveikąjį $x$, kuris ją tenkina.`,
        atsakymas: String(riba + 1),
        atsakymasRodymui: `$x = ${riba + 1}$`,
        sprendimas: `Gauname $x > ${riba}$, tad mažiausias sveikasis sprendinys yra ${riba + 1}.`,
      })
    },

    // 2. Nelygybė „mažiau“ — didžiausias sveikasis sprendinys
    () => {
      const desine = a * riba + b
      if (Math.abs(desine) > virsus) return null
      return uzdavinys('nelygybes', {
        klausimas: `Išspręsk nelygybę $${narys(a, 'x', b)} < ${desine}$. Įrašyk didžiausią sveikąjį $x$, kuris ją tenkina.`,
        atsakymas: String(riba - 1),
        atsakymasRodymui: `$x = ${riba - 1}$`,
        sprendimas: `Gauname $x < ${riba}$, tad didžiausias sveikasis sprendinys yra ${riba - 1}.`,
      })
    },

    // 3. Neigiamas koeficientas — ženklas apsiverčia
    () => {
      const desine = -a * riba + b
      if (Math.abs(desine) > virsus) return null
      return uzdavinys('nelygybes', {
        klausimas: `Išspręsk nelygybę $${narys(-a, 'x', b)} > ${desine}$. Įrašyk didžiausią sveikąjį $x$, kuris ją tenkina.`,
        atsakymas: String(riba - 1),
        atsakymasRodymui: `$x = ${riba - 1}$`,
        sprendimas: `Dalijant iš neigiamo skaičiaus nelygybės ženklas apsiverčia: $x < ${riba}$, tad didžiausias sveikasis sprendinys yra ${
          riba - 1
        }.`,
      })
    },

    // 4. Nelygybė su nariais abiejose pusėse
    () => {
      const c = atsitiktinis(2, didink(6, klase))
      if (c >= a) return null
      const laisvasis = (a - c) * riba
      if (Math.abs(laisvasis) > virsus) return null
      return uzdavinys('nelygybes', {
        klausimas: `Išspręsk nelygybę $${a}x > ${c}x + ${laisvasis}$. Įrašyk mažiausią sveikąjį $x$, kuris ją tenkina.`,
        atsakymas: String(riba + 1),
        atsakymasRodymui: `$x = ${riba + 1}$`,
        sprendimas: `Perkeliame: $${a - c}x > ${laisvasis}$, tad $x > ${riba}$ ir mažiausias sveikasis sprendinys yra ${
          riba + 1
        }.`,
      })
    },

    // 5. Dviguba nelygybė — sveikųjų sprendinių kiekis
    () => {
      const nuo = atsitiktinis(-didink(10, klase), didink(5, klase))
      const iki = nuo + atsitiktinis(3, didink(12, klase))
      return uzdavinys('nelygybes', {
        klausimas: `Kiek sveikųjų skaičių tenkina nelygybę $${nuo} < x < ${iki}$?`,
        atsakymas: String(iki - nuo - 1),
        atsakymasRodymui: `$${iki - nuo - 1}$`,
        sprendimas: `Tinka skaičiai nuo ${nuo + 1} iki ${iki - 1}, o jų yra $${sk(
          iki - 1,
        )} - ${sk(nuo + 1)} + 1 = ${iki - nuo - 1}$.`,
      })
    },

    // 6. Kvadratinė nelygybė
    () => {
      if (lygis === 1) return null
      const k = atsitiktinis(3, didink(25, klase))
      return uzdavinys('nelygybes', {
        klausimas: `Išspręsk nelygybę $x^2 < ${k * k}$. Įrašyk didžiausią sveikąjį $x$, kuris ją tenkina.`,
        atsakymas: String(k - 1),
        atsakymasRodymui: `$x = ${k - 1}$`,
        sprendimas: `Nelygybę tenkina $-${k} < x < ${k}$, tad didžiausias sveikasis sprendinys yra ${
          k - 1
        }.`,
      })
    },

    // 7. Kvadratinė nelygybė su sandauga
    () => {
      if (lygis === 1) return null
      const x1 = atsitiktinis(1, didink(9, klase))
      const x2 = x1 + atsitiktinis(2, didink(9, klase))
      return uzdavinys('nelygybes', {
        klausimas: `Išspręsk nelygybę $(x - ${x1})(x - ${x2}) < 0$. Įrašyk mažiausią sveikąjį $x$, kuris ją tenkina.`,
        atsakymas: String(x1 + 1),
        atsakymasRodymui: `$x = ${x1 + 1}$`,
        sprendimas: `Sandauga neigiama tarp šaknų: $${x1} < x < ${x2}$, tad mažiausias sveikasis sprendinys yra ${
          x1 + 1
        }.`,
      })
    },

    // 8. Nelygybė su trupmena
    () => {
      if (lygis === 1) return null
      const d = pasirink([2, 3, 4, 5] as const)
      const sprendinys = riba * d
      const desine = riba
      if (Math.abs(sprendinys) > virsus) return null
      return uzdavinys('nelygybes', {
        klausimas: `Išspręsk nelygybę $\\dfrac{x}{${d}} \\ge ${desine}$. Įrašyk mažiausią sveikąjį $x$, kuris ją tenkina.`,
        atsakymas: String(sprendinys),
        atsakymasRodymui: `$x = ${sprendinys}$`,
        sprendimas: `Padauginę abi puses iš ${d}: $x \\ge ${sprendinys}$, tad mažiausias sveikasis sprendinys yra ${sprendinys}.`,
      })
    },

    // 9. Taikomasis uždavinys
    () => {
      const kaina = atsitiktinis(2, didink(9, klase))
      const turi = kaina * riba + atsitiktinis(0, kaina - 1)
      return uzdavinys('nelygybes', {
        klausimas: `Sąsiuvinis kainuoja ${kaina} €. Kiek daugiausiai sąsiuvinių galima nupirkti turint ${turi} €?`,
        atsakymas: String(Math.floor(turi / kaina)),
        atsakymasRodymui: `$${Math.floor(turi / kaina)}$`,
        sprendimas: `Sprendžiame $${kaina}n \\le ${turi}$: $n \\le ${(turi / kaina).toFixed(
          2,
        )}$, tad daugiausiai ${Math.floor(turi / kaina)} sąsiuviniai.`,
      })
    },
  ]

  if (lygis === 1) return variacija(visos.slice(0, 5))
  if (lygis === 2) return variacija(visos.slice(0, 7))
  return variacija(visos)
}

// ── Šaknys ──────────────────────────────────────────────────────────────────

const A_SAKNYS = [
  {
    klausimas: 'Apskaičiuok: $\\sqrt{144}$',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '$12 \\cdot 12 = 144$, tad $\\sqrt{144} = 12$.',
  },
] as const

export const saknys: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkSaknis(lygis, klase), A_SAKNYS, 'saknys')

function kurkSaknis(lygis: Lygis, klase?: number): Uzdavinys | null {
  const n = atsitiktinis(2, didink(20, klase))
  const a = atsitiktinis(2, didink(12, klase))
  const b = atsitiktinis(2, didink(12, klase))

  const visos = [
    // 1. Kvadratinė šaknis
    () =>
      uzdavinys('saknys', {
        klausimas: `Apskaičiuok: $\\sqrt{${n * n}}$`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${n} \\cdot ${n} = ${n * n}$, tad $\\sqrt{${n * n}} = ${n}$.`,
      }),

    // 2. Kubinė šaknis
    () => {
      const k = atsitiktinis(2, vyresne(klase) ? 20 : 15)
      return uzdavinys('saknys', {
        klausimas: `Apskaičiuok: $\\sqrt[3]{${k ** 3}}$`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `$${k}^3 = ${k ** 3}$, tad kubinė šaknis lygi ${k}.`,
      })
    },

    // 3. Šaknis iš sandaugos
    () =>
      uzdavinys('saknys', {
        klausimas: `Apskaičiuok: $\\sqrt{${a * a} \\cdot ${b * b}}$`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$`,
        sprendimas: `$\\sqrt{${a * a}} \\cdot \\sqrt{${b * b}} = ${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 4. Šaknų sudėtis
    () =>
      uzdavinys('saknys', {
        klausimas: `Apskaičiuok: $\\sqrt{${a * a}} + \\sqrt{${b * b}}$`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `$${a} + ${b} = ${a + b}$.`,
      }),

    // 5. Šaknis iš dalmens
    () => {
      if (a % b !== 0) return null
      return uzdavinys('saknys', {
        klausimas: `Apskaičiuok: $\\sqrt{\\dfrac{${a * a}}{${b * b}}}$`,
        atsakymas: String(a / b),
        atsakymasRodymui: `$${a / b}$`,
        sprendimas: `$\\dfrac{\\sqrt{${a * a}}}{\\sqrt{${b * b}}} = \\dfrac{${a}}{${b}} = ${
          a / b
        }$.`,
      })
    },

    // 6. Šaknies kvadratas
    () =>
      uzdavinys('saknys', {
        klausimas: `Apskaičiuok: $\\left(\\sqrt{${n}}\\right)^2$`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Kėlimas kvadratu panaikina šaknį: $\\left(\\sqrt{${n}}\\right)^2 = ${n}$.`,
      }),

    // 7. Daugiklio iškėlimas prieš šaknį
    () => {
      const po = pasirink([2, 3, 5, 6, 7, 10, 11, 13] as const)
      const po_saknimi = a * a * po
      return uzdavinys('saknys', {
        klausimas: `Iškelk daugiklį prieš šaknį: $\\sqrt{${po_saknimi}} = \\ldots \\sqrt{${po}}$. Koks skaičius rašomas prieš šaknį?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$${po_saknimi} = ${a * a} \\cdot ${po}$, tad $\\sqrt{${po_saknimi}} = ${a}\\sqrt{${po}}$.`,
      })
    },

    // 8. Lygtis su šaknimi
    () =>
      uzdavinys('saknys', {
        klausimas: `Išspręsk lygtį: $\\sqrt{x} = ${n}$`,
        atsakymas: String(n * n),
        atsakymasRodymui: `$x = ${n * n}$`,
        sprendimas: `Keliame abi puses kvadratu: $x = ${n}^2 = ${n * n}$.`,
      }),

    // 9. Kvadrato kraštinė iš ploto
    () =>
      uzdavinys('saknys', {
        klausimas: `Kvadrato plotas ${n * n} cm². Kokia jo kraštinė?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$ cm`,
        sprendimas: `$a = \\sqrt{${n * n}} = ${n}$ cm.`,
      }),
  ]

  if (lygis === 1) return variacija(visos.slice(0, 3))
  if (lygis === 2) return variacija(visos.slice(0, 6))
  return variacija(visos)
}

// ── Greitosios daugybos formulės ────────────────────────────────────────────

const A_FORMULES = [
  {
    klausimas: 'Atskliausk: $(x + 3)^2 = x^2 + \\ldots x + 9$. Koks skaičius prieš $x$?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: '$(a + b)^2 = a^2 + 2ab + b^2$, tad vidurinis narys $2 \\cdot 3 = 6$.',
  },
] as const

export const greitosiosFormules: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkFormule(lygis, klase), A_FORMULES, 'greitosios-formules')

function kurkFormule(lygis: Lygis, klase?: number): Uzdavinys | null {
  const b = atsitiktinis(2, didink(20, klase))
  const k = atsitiktinis(2, vyresne(klase) ? 9 : 4)

  const visos = [
    // 1. Sumos kvadratas — vidurinis narys
    () =>
      uzdavinys('greitosios-formules', {
        klausimas: `Atskliausk: $(x + ${b})^2 = x^2 + \\ldots x + ${
          b * b
        }$. Koks skaičius rašomas prieš $x$?`,
        atsakymas: String(2 * b),
        atsakymasRodymui: `$${2 * b}$`,
        sprendimas: `$(a + b)^2 = a^2 + 2ab + b^2$, tad vidurinis narys $2 \\cdot ${b} = ${2 * b}$.`,
      }),

    // 2. Skirtumo kvadratas — laisvasis narys
    () =>
      uzdavinys('greitosios-formules', {
        klausimas: `Atskliausk: $(x - ${b})^2 = x^2 - ${2 * b}x + \\ldots$. Koks laisvasis narys?`,
        atsakymas: String(b * b),
        atsakymasRodymui: `$${b * b}$`,
        sprendimas: `$(a - b)^2 = a^2 - 2ab + b^2$, tad laisvasis narys $${b}^2 = ${b * b}$.`,
      }),

    // 3. Kvadratų skirtumas skaičiams
    () => {
      const a = atsitiktinis(11, didink(40, klase))
      const skirtumas = atsitiktinis(1, vyresne(klase) ? 9 : 5)
      const didesnis = a + skirtumas
      const rez = didesnis * didesnis - a * a
      return uzdavinys('greitosios-formules', {
        klausimas: `Apskaičiuok naudodamas kvadratų skirtumo formulę: $${didesnis}^2 - ${a}^2$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$a^2 - b^2 = (a - b)(a + b) = ${skirtumas} \\cdot ${didesnis + a} = ${rez}$.`,
      })
    },

    // 4. Sandauga (x − b)(x + b)
    () =>
      uzdavinys('greitosios-formules', {
        klausimas: `Atskliausk: $(x - ${b})(x + ${b}) = x^2 - \\ldots$. Koks skaičius atimamas?`,
        atsakymas: String(b * b),
        atsakymasRodymui: `$${b * b}$`,
        sprendimas: `$(a - b)(a + b) = a^2 - b^2$, tad atimamas $${b}^2 = ${b * b}$.`,
      }),

    // 5. Greitas kvadratas mintinai
    () => {
      // Mintinis skaičiavimas — dviženklis skaičius net vyresnėse klasėse.
      const n = atsitiktinis(2, 9) * 10 + pasirink([1, 2, 3, 5, 9] as const)
      return uzdavinys('greitosios-formules', {
        klausimas: `Apskaičiuok mintinai naudodamas formulę: $${n}^2$`,
        atsakymas: String(n * n),
        atsakymasRodymui: `$${n * n}$`,
        sprendimas: (() => {
          const des = Math.floor(n / 10) * 10
          const lik = n - des
          return `$(${des} + ${lik})^2 = ${des * des} + 2 \\cdot ${des} \\cdot ${lik} + ${
            lik * lik
          } = ${n * n}$.`
        })(),
      })
    },

    // 6. Koeficientas prieš x su daugikliu
    () =>
      uzdavinys('greitosios-formules', {
        klausimas: `Atskliausk: $(${k}x + ${b})^2 = ${
          k * k
        }x^2 + \\ldots x + ${b * b}$. Koks skaičius rašomas prieš $x$?`,
        atsakymas: String(2 * k * b),
        atsakymasRodymui: `$${2 * k * b}$`,
        sprendimas: `$2ab = 2 \\cdot ${k} \\cdot ${b} = ${2 * k * b}$.`,
      }),

    // 7. Skaidymas dauginamaisiais
    () => {
      if (lygis === 1) return null
      return uzdavinys('greitosios-formules', {
        klausimas: `Išskaidyk dauginamaisiais: $x^2 - ${
          b * b
        } = (x - ${b})(x + \\ldots)$. Koks skaičius trūksta?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Kvadratų skirtumas: $x^2 - ${b * b} = (x - ${b})(x + ${b})$.`,
      })
    },

    // 8. Reiškinio reikšmė
    () => {
      if (lygis === 1) return null
      const x = atsitiktinis(2, didink(9, klase))
      const rez = (x + b) * (x + b)
      if (rez > didink(4000, klase)) return null
      return uzdavinys('greitosios-formules', {
        klausimas: `Apskaičiuok reiškinio $x^2 + ${2 * b}x + ${
          b * b
        }$ reikšmę, kai $x = ${x}$.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Reiškinys yra $(x + ${b})^2$, tad $(${x} + ${b})^2 = ${x + b}^2 = ${rez}$.`,
      })
    },

    // 9. Kubo formulė
    () => {
      if (!vyresne(klase)) return null
      const c = atsitiktinis(2, 9)
      return uzdavinys('greitosios-formules', {
        klausimas: `Atskliausk: $(x + ${c})^3 = x^3 + \\ldots x^2 + ${
          3 * c * c
        }x + ${c ** 3}$. Koks skaičius rašomas prieš $x^2$?`,
        atsakymas: String(3 * c),
        atsakymasRodymui: `$${3 * c}$`,
        sprendimas: `$(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$, tad prieš $x^2$ rašoma $3 \\cdot ${c} = ${
          3 * c
        }$.`,
      })
    },
  ]

  if (lygis === 1) return variacija(visos.slice(0, 4))
  if (lygis === 2) return variacija(visos.slice(0, 6))
  return variacija(visos)
}

// ── Lygčių sistemos ─────────────────────────────────────────────────────────

const A_SISTEMOS = [
  {
    klausimas:
      'Išspręsk sistemą: $x + y = 10$ ir $x - y = 4$. Įrašyk $x$ reikšmę.',
    atsakymas: '7',
    atsakymasRodymui: '$x = 7$',
    sprendimas: 'Sudėjus abi lygtis: $2x = 14$, tad $x = 7$.',
  },
] as const

export const lygciuSistemos: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkSistema(lygis, klase), A_SISTEMOS, 'lygciu-sistemos')

function kurkSistema(lygis: Lygis, klase?: number): Uzdavinys | null {
  // Sprendiniai parenkami pirma, koeficientai išvedami iš jų.
  const riba = didink(12, klase)
  const x = lygis === 1 ? atsitiktinis(2, riba) : atsitiktinisBe(-riba, riba, [0])
  const y = lygis === 1 ? atsitiktinis(2, riba) : atsitiktinisBe(-riba, riba, [0])
  const virsus = didink(90, klase)

  const visos = [
    // 1. Suma ir skirtumas
    () => {
      const suma = x + y
      const skirtumas = x - y
      if (skirtumas === 0) return null
      return uzdavinys('lygciu-sistemos', {
        klausimas: `Išspręsk sistemą: $x + y = ${suma}$ ir $x - y = ${skirtumas}$. Įrašyk $x$ reikšmę.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Sudėjus abi lygtis: $2x = ${suma + skirtumas}$, tad $x = ${x}$.`,
      })
    },

    // 2. Bendroji sistema — ieškomas x
    () => {
      const a = atsitiktinis(2, didink(6, klase))
      const b = atsitiktinisBe(-didink(5, klase), didink(5, klase), [0])
      const c = atsitiktinis(2, didink(6, klase))
      const d = atsitiktinisBe(-didink(5, klase), didink(5, klase), [0])
      if (a * d - b * c === 0) return null
      const e = a * x + b * y
      const f = c * x + d * y
      if (Math.abs(e) > virsus || Math.abs(f) > virsus) return null
      return uzdavinys('lygciu-sistemos', {
        klausimas: `Išspręsk sistemą: $${narys(a, 'x', 0)} ${b > 0 ? '+' : '-'} ${Math.abs(
          b,
        )}y = ${e}$ ir $${narys(c, 'x', 0)} ${d > 0 ? '+' : '-'} ${Math.abs(
          d,
        )}y = ${f}$. Įrašyk $x$ reikšmę.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Sistemos sprendinys yra $x = ${x}$, $y = ${y}$.`,
      })
    },

    // 3. Bendroji sistema — ieškomas y
    () => {
      const a = atsitiktinis(2, didink(6, klase))
      const b = atsitiktinisBe(-didink(5, klase), didink(5, klase), [0])
      const c = atsitiktinis(2, didink(6, klase))
      const d = atsitiktinisBe(-didink(5, klase), didink(5, klase), [0])
      if (a * d - b * c === 0) return null
      const e = a * x + b * y
      const f = c * x + d * y
      if (Math.abs(e) > virsus || Math.abs(f) > virsus) return null
      return uzdavinys('lygciu-sistemos', {
        klausimas: `Išspręsk sistemą: $${narys(a, 'x', 0)} ${b > 0 ? '+' : '-'} ${Math.abs(
          b,
        )}y = ${e}$ ir $${narys(c, 'x', 0)} ${d > 0 ? '+' : '-'} ${Math.abs(
          d,
        )}y = ${f}$. Įrašyk $y$ reikšmę.`,
        atsakymas: String(y),
        atsakymasRodymui: `$y = ${y}$`,
        sprendimas: `Sistemos sprendinys yra $x = ${x}$, $y = ${y}$.`,
      })
    },

    // 4. Keitimo būdas — viena lygtis jau išreikšta
    () => {
      const k = atsitiktinisBe(-didink(5, klase), didink(5, klase), [0])
      const c = y - k * x
      const suma = x + y
      if (Math.abs(c) > virsus) return null
      return uzdavinys('lygciu-sistemos', {
        klausimas: `Išspręsk sistemą keitimo būdu: $y = ${narys(
          k,
          'x',
          c,
        )}$ ir $x + y = ${suma}$. Įrašyk $x$ reikšmę.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Įstatę $y$ į antrą lygtį gauname $x + \\left(${narys(
          k,
          'x',
          c,
        )}\\right) = ${suma}$, iš kur $x = ${x}$.`,
      })
    },

    // 5. Sprendinių sandauga arba suma
    () => {
      if (lygis === 1) return null
      const suma = x + y
      const skirtumas = x - y
      if (skirtumas === 0) return null
      return uzdavinys('lygciu-sistemos', {
        klausimas: `Sistemos $x + y = ${suma}$, $x - y = ${skirtumas}$ sprendinys yra pora $(x; y)$. Kam lygi sandauga $x \\cdot y$?`,
        atsakymas: String(x * y),
        atsakymasRodymui: `$${x * y}$`,
        sprendimas: `$x = ${x}$, $y = ${y}$, tad $x \\cdot y = ${x * y}$.`,
      })
    },

    // 6. Tekstinis — bilietai
    () => {
      const suaugusiu = Math.abs(x) + 2
      const vaiku = Math.abs(y) + 2
      const kainaS = atsitiktinis(4, didink(12, klase))
      const kainaV = atsitiktinis(2, kainaS - 1)
      const zmoniu = suaugusiu + vaiku
      const suma = suaugusiu * kainaS + vaiku * kainaV
      return uzdavinys('lygciu-sistemos', {
        klausimas: `Į kiną nuėjo ${zmoniu} žmonės ir sumokėjo ${suma} €. Suaugusiojo bilietas kainuoja ${kainaS} €, vaiko — ${kainaV} €. Kiek buvo suaugusiųjų?`,
        atsakymas: String(suaugusiu),
        atsakymasRodymui: `$${suaugusiu}$`,
        sprendimas: `Sistema $s + v = ${zmoniu}$, $${kainaS}s + ${kainaV}v = ${suma}$ duoda $s = ${suaugusiu}$, $v = ${vaiku}$.`,
      })
    },

    // 7. Du skaičiai pagal sumą ir sandaugą
    () => {
      if (!vyresne(klase)) return null
      const a = Math.abs(x) + 1
      const b = Math.abs(y) + 1
      if (a === b) return null
      return uzdavinys('lygciu-sistemos', {
        klausimas: `Dviejų teigiamų skaičių suma lygi ${a + b}, o sandauga ${
          a * b
        }. Koks yra didesnysis skaičius?`,
        atsakymas: String(Math.max(a, b)),
        atsakymasRodymui: `$${Math.max(a, b)}$`,
        sprendimas: `Skaičiai yra ${Math.min(a, b)} ir ${Math.max(
          a,
          b,
        )}, nes jų suma ${a + b}, o sandauga ${a * b}.`,
      })
    },

    // 8. Sistema su trupmeniniais koeficientais
    () => {
      if (!vyresne(klase)) return null
      const d = pasirink([2, 3, 4] as const)
      const xx = x * d
      const suma = xx + y
      return uzdavinys('lygciu-sistemos', {
        klausimas: `Išspręsk sistemą: $\\dfrac{x}{${d}} = ${x}$ ir $x + y = ${
          xx + y
        }$. Įrašyk $y$ reikšmę.`,
        atsakymas: String(y),
        atsakymasRodymui: `$y = ${y}$`,
        sprendimas: `Iš pirmos lygties $x = ${sk(x)} \\cdot ${d} = ${xx}$, tad $y = ${sk(
          suma,
        )} - ${sk(xx)} = ${y}$.`,
      })
    },
  ]

  if (lygis === 1) return variacija(visos.slice(0, 4))
  if (lygis === 2) return variacija(visos.slice(0, 6))
  return variacija(visos)
}

// ── Funkcijos ───────────────────────────────────────────────────────────────

const A_FUNKCIJOS = [
  {
    klausimas: 'Funkcija $y = 3x - 5$. Kokia $y$ reikšmė, kai $x = 4$?',
    atsakymas: '7',
    atsakymasRodymui: '$y = 7$',
    sprendimas: '$y = 3 \\cdot 4 - 5 = 7$.',
  },
] as const

export const funkcijos: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkFunkcija(lygis, klase), A_FUNKCIJOS, 'funkcijos')

function kurkFunkcija(lygis: Lygis, klase?: number): Uzdavinys | null {
  const k = atsitiktinisBe(-didink(6, klase), didink(6, klase), [0, 1])
  const b = atsitiktinisBe(-didink(15, klase), didink(15, klase), [0])
  const virsus = didink(90, klase)

  const visos = [
    // 1. Reikšmė taške
    () => {
      const x = atsitiktinis(2, didink(10, klase))
      const y = k * x + b
      if (Math.abs(y) > virsus) return null
      return uzdavinys('funkcijos', {
        klausimas: `Funkcija $y = ${narys(k, 'x', b)}$. Kokia $y$ reikšmė, kai $x = ${x}$?`,
        atsakymas: String(y),
        atsakymasRodymui: `$y = ${y}$`,
        sprendimas: `$y = ${k} \\cdot ${x} ${b > 0 ? '+' : '-'} ${Math.abs(b)} = ${y}$.`,
      })
    },

    // 2. Argumentas pagal reikšmę
    () => {
      const x = atsitiktinisBe(-didink(8, klase), didink(9, klase), [0])
      const y = k * x + b
      if (Math.abs(y) > virsus) return null
      return uzdavinys('funkcijos', {
        klausimas: `Funkcija $y = ${narys(k, 'x', b)}$. Su kuria $x$ reikšme $y = ${y}$?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Sprendžiame $${narys(k, 'x', b)} = ${y}$ ir gauname $x = ${x}$.`,
      })
    },

    // 3. Nulio taškas
    () => {
      const x = atsitiktinisBe(-didink(9, klase), didink(9, klase), [0])
      const laisvasis = -k * x
      if (Math.abs(laisvasis) > didink(60, klase)) return null
      return uzdavinys('funkcijos', {
        klausimas: `Kuriame taške funkcijos $y = ${narys(
          k,
          'x',
          laisvasis,
        )}$ grafikas kerta $x$ ašį? Įrašyk $x$ reikšmę.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Ašį $x$ grafikas kerta ten, kur $y = 0$: $${narys(
          k,
          'x',
          laisvasis,
        )} = 0$, tad $x = ${x}$.`,
      })
    },

    // 4. Susikirtimas su y ašimi
    () =>
      uzdavinys('funkcijos', {
        klausimas: `Kuriame taške funkcijos $y = ${narys(
          k,
          'x',
          b,
        )}$ grafikas kerta $y$ ašį? Įrašyk $y$ reikšmę.`,
        atsakymas: String(b),
        atsakymasRodymui: `$y = ${b}$`,
        sprendimas: `Ašį $y$ grafikas kerta, kai $x = 0$: $y = ${b}$.`,
      }),

    // 5. Ar taškas priklauso grafikui
    () => {
      const x = atsitiktinis(2, didink(9, klase))
      const y = k * x + b
      if (Math.abs(y) > virsus) return null
      const tinka = Math.random() < 0.5
      const rodomasY = tinka ? y : y + atsitiktinis(1, 5)
      return uzdavinys('funkcijos', {
        klausimas: `Ar taškas $(${x}; ${rodomasY})$ priklauso funkcijos $y = ${narys(
          k,
          'x',
          b,
        )}$ grafikui? Įrašyk „taip“ arba „ne“.`,
        atsakymas: tinka ? 'taip' : 'ne',
        atsakymasRodymui: tinka ? 'taip' : 'ne',
        sprendimas: `Įstatę $x = ${x}$ gauname $y = ${y}$${
          tinka ? ' — sutampa, tad taškas priklauso.' : `, o duota ${rodomasY} — nesutampa.`
        }`,
      })
    },

    // 6. Krypties koeficientas iš dviejų taškų
    () => {
      if (lygis === 1) return null
      const x1 = atsitiktinisBe(-didink(8, klase), didink(8, klase), [0])
      const x2 = x1 + atsitiktinis(1, didink(6, klase))
      const y1 = k * x1 + b
      const y2 = k * x2 + b
      if (Math.abs(y1) > virsus || Math.abs(y2) > virsus) return null
      return uzdavinys('funkcijos', {
        klausimas: `Tiesė eina per taškus $(${x1}; ${y1})$ ir $(${x2}; ${y2})$. Koks jos krypties koeficientas?`,
        atsakymas: String(k),
        atsakymasRodymui: `$k = ${k}$`,
        sprendimas: `$k = \\dfrac{${sk(y2)} - ${sk(y1)}}{${sk(x2)} - ${sk(
          x1,
        )}} = \\dfrac{${y2 - y1}}{${x2 - x1}} = ${k}$.`,
      })
    },

    // 7. Didėjanti ar mažėjanti
    () => {
      if (lygis === 1) return null
      return uzdavinys('funkcijos', {
        klausimas: `Ar funkcija $y = ${narys(
          k,
          'x',
          b,
        )}$ didėja? Įrašyk „taip“ arba „ne“.`,
        atsakymas: k > 0 ? 'taip' : 'ne',
        atsakymasRodymui: k > 0 ? 'taip' : 'ne',
        sprendimas: `Krypties koeficientas $k = ${k}$${
          k > 0 ? ' teigiamas, tad funkcija didėja.' : ' neigiamas, tad funkcija mažėja.'
        }`,
      })
    },

    // 8. Kvadratinės funkcijos viršūnė
    () => {
      if (!vyresne(klase)) return null
      const p = atsitiktinisBe(-didink(6, klase), didink(6, klase), [0])
      const q = atsitiktinisBe(-didink(20, klase), didink(20, klase), [0])
      // Neigiamas p rašomas kaip „+", kitaip gautųsi „(x - -3)".
      const dvinaris = p > 0 ? `x - ${p}` : `x + ${-p}`
      const laisvasis = q > 0 ? `+ ${q}` : `- ${-q}`
      return uzdavinys('funkcijos', {
        klausimas: `Kokia yra parabolės $y = (${dvinaris})^2 ${laisvasis}$ viršūnės abscisė $x$?`,
        atsakymas: String(p),
        atsakymasRodymui: `$x = ${p}$`,
        sprendimas: `Viršūnės forma $y = (x - p)^2 + q$ rodo viršūnę $(${p}; ${q})$, tad $x = ${p}$.`,
      })
    },

    // 9. Atvirkštinis proporcingumas
    () => {
      if (!vyresne(klase)) return null
      const c = atsitiktinis(2, didink(12, klase))
      const x = pasirink([1, 2, 3, 4, 6, 12] as const)
      if ((c * 12) % x !== 0) return null
      const y = (c * 12) / x
      return uzdavinys('funkcijos', {
        klausimas: `Funkcija $y = \\dfrac{${c * 12}}{x}$. Kokia $y$ reikšmė, kai $x = ${x}$?`,
        atsakymas: String(y),
        atsakymasRodymui: `$y = ${y}$`,
        sprendimas: `$y = \\dfrac{${c * 12}}{${x}} = ${y}$.`,
      })
    },
  ]

  if (lygis === 1) return variacija(visos.slice(0, 5))
  if (lygis === 2) return variacija(visos.slice(0, 7))
  return variacija(visos)
}
