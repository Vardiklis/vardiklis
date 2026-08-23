import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { ivestiesLentele } from './penktokams-vaizdai'
import { funkcijosGrafikas, keliosKreives, sekosNariai } from './devintokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 9 klasės temos „Funkcijos, sekos“ ir „Tiesinė funkcija“ — dešimt potemių.
 *
 * Programoje pirmojoje temoje yra ir potemė „Funkcijos apibrėžimo ir reikšmių
 * sritys“, kurios turinio apraše nėra.
 *
 * Grafikų uždaviniuose brėžinys braižomas iš tos pačios funkcijos, kurios
 * klausiama, tad nuskaityta reikšmė visada sutampa su atsakymu.
 */

/** Nario su kintamuoju užrašas: 1x → x, −1x → −x. */
function narys(k: number, r = 'x'): string {
  if (k === 1) return r
  if (k === -1) return `-${r}`
  return `${k}${r}`
}

/** Laisvasis narys su tvarkingu ženklu. */
function plius(b: number): string {
  return b < 0 ? ` - ${-b}` : ` + ${b}`
}

/** Tiesinės funkcijos užrašas. */
function tiesine(k: number, b: number): string {
  if (b === 0) return `y = ${narys(k)}`
  return `y = ${narys(k)}${plius(b)}`
}

// ── 1.1. Tarpusavyje susiję dydžiai ─────────────────────────────────────────

const T1 = 'susije-dydziai-9'

const A1 = [
  {
    klausimas: 'Automobilis važiuoja pastoviu 60 km/h greičiu. Kokį kelią jis nuvažiuos per 3 h?',
    atsakymas: '180',
    atsakymasRodymui: '$180$ km',
    sprendimas: '$60 \\cdot 3 = 180$.',
  },
] as const

export const susijeDydziai9: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {
  const greitis = pasirink([40, 50, 60, 70, 80, 90])
  const laikas = atsitiktinis(2, 7)
  const plotis = atsitiktinis(3, 9)
  const ilgis = atsitiktinis(4, 12)

  return variacija([
    // 1. Kelias nuo laiko
    () =>
      uzdavinys(T1, {
        klausimas: `Automobilis važiuoja pastoviu ${greitis} km/h greičiu. Kokį kelią jis nuvažiuos per ${laikas} h?`,
        atsakymas: String(greitis * laikas),
        atsakymasRodymui: `$${greitis * laikas}$ km`,
        sprendimas: `$s = ${greitis}t$; $${greitis} \\cdot ${laikas} = ${greitis * laikas}$.`,
      }),

    // 2. Plotas nuo ilgio
    () =>
      uzdavinys(T1, {
        klausimas: `Stačiakampio plotis ${plotis} cm. Užrašius plotą $S$ kaip ilgio $x$ funkciją, koks bus $S$, kai $x = ${ilgis}$?`,
        atsakymas: String(plotis * ilgis),
        atsakymasRodymui: `$${plotis * ilgis}$ cm²`,
        sprendimas: `$S = ${plotis}x$; $${plotis} \\cdot ${ilgis} = ${plotis * ilgis}$.`,
      }),

    // 3. Kuris dydis nepriklausomas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Einama pastoviu greičiu. Kuris dydis yra nepriklausomas, o kuris — priklausomas?',
        variantai: [
          'nepriklausomas — laikas, priklausomas — nueitas kelias',
          'nepriklausomas — kelias, priklausomas — laikas',
          'abu nepriklausomi',
          'abu priklausomi',
        ],
        teisingas: 0,
        sprendimas: 'Kelias randamas iš laiko, tad jis priklauso nuo laiko.',
      }),

    // 4. Mažėjantis dydis
    () => {
      const pradine = pasirink([100, 120, 150, 200])
      const per = pasirink([2, 4, 5, 10])
      const t = atsitiktinis(3, 10)
      if (pradine - per * t < 0) return null
      return uzdavinys(T1, {
        klausimas: `Talpoje yra ${pradine} l vandens, kas minutę išteka po ${per} l. Kiek litrų liks po ${t} min?`,
        atsakymas: String(pradine - per * t),
        atsakymasRodymui: `$${pradine - per * t}$ l`,
        sprendimas: `$V = ${pradine} - ${per}t$; $${pradine} - ${per} \\cdot ${t} = ${pradine - per * t}$.`,
      })
    },

    // 5. Priklausomybė iš lentelės
    () => {
      const k = pasirink([3, 4, 5, 6, 7])
      return uzdavinys(T1, {
        klausimas: 'Kiek kartų $y$ didesnis už $x$ pagal lentelę?',
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `Kiekvienoje poroje $y : x = ${k}$.`,
        brezinys: ivestiesLentele([1, 2, 3, 4], [k, 2 * k, 3 * k, 4 * k]),
      })
    },

    // 6. Formulės narių prasmė
    () => {
      const pastovus = pasirink([2, 3, 5])
      const uz = pasirink([0.5, 0.8, 1.2])
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Mokestis skaičiuojamas pagal $y = ${pastovus} + ${String(uz).replace('.', '{,}')}x$, kur $x$ — minutės. Ką reiškia skaičius ${pastovus}?`,
        variantai: [
          'pastovų mokestį, nepriklausomą nuo pokalbio trukmės',
          'vienos minutės kainą',
          'bendrą mokestį',
          'minučių skaičių',
        ],
        teisingas: 0,
        sprendimas: 'Jis sumokamas ir tada, kai $x = 0$.',
      })
    },

    // 7. Ne kiekvienas ryšys — proporcingumas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ar kiekvienas tarpusavyje susijusių dydžių ryšys yra tiesioginis proporcingumas?',
        variantai: [
          'ne, pavyzdžiui, kai dydis mažėja didėjant kitam',
          'taip, visada',
          'taip, jei abu dydžiai teigiami',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Tiesioginiame proporcingume dydžių santykis pastovus, o taip būna ne visada.',
      }),
  ])
}

// ── 1.2. Funkcija ir jos grafikas ───────────────────────────────────────────

const T2 = 'funkcija-ir-grafikas'

const A2 = [
  {
    klausimas: 'Apskaičiuok funkcijos $y = 2x + 1$ reikšmę, kai $x = 3$.',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: '$2 \\cdot 3 + 1 = 7$.',
  },
] as const

export const funkcijaIrGrafikas: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  const k = pasirink([-3, -2, -1, 1, 2, 3])
  const b = atsitiktinis(-3, 3)
  const x = atsitiktinis(-3, 3)
  const y = k * x + b
  if (Math.abs(y) > 4) return null

  return variacija([
    // 1. Reikšmė pagal formulę
    () =>
      uzdavinys(T2, {
        klausimas: `Apskaičiuok funkcijos $${tiesine(k, b)}$ reikšmę, kai $x = ${x}$.`,
        atsakymas: String(y),
        atsakymasRodymui: `$${y}$`,
        sprendimas: `$${k} \\cdot (${x})${plius(b)} = ${y}$.`,
      }),

    // 2. Nuskaitymas iš grafiko
    () =>
      uzdavinys(T2, {
        klausimas: `Nuskaityk iš grafiko $y$ reikšmę, kai $x = ${x}$.`,
        atsakymas: String(y),
        atsakymasRodymui: `$${y}$`,
        sprendimas: 'Nuo pažymėto taško einama punktyrais iki $y$ ašies.',
        brezinys: funkcijosGrafikas((t) => k * t + b, { taskai: [{ x, y, punktyrai: true }] }),
      }),

    // 3. Ar taškas priklauso grafikui
    () => {
      const netikras = y + pasirink([1, 2])
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ar taškas $(${x}; ${netikras})$ priklauso funkcijos $${tiesine(k, b)}$ grafikui?`,
        variantai: [`ne, nes turėtų būti $y = ${y}$`, 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `Įrašius $x = ${x}$ gaunama $y = ${y}$.`,
      })
    },

    // 4. Kvadratinė reikšmė
    () => {
      const a = atsitiktinis(-4, 4)
      if (a === 0) return null
      return uzdavinys(T2, {
        klausimas: `Duota funkcija $y = x^2$. Rask jos reikšmę, kai $x = ${a}$.`,
        atsakymas: String(a * a),
        atsakymasRodymui: `$${a * a}$`,
        sprendimas: `$(${a})^2 = ${a * a}$.`,
      })
    },

    // 5. Atvirkštinis uždavinys
    () =>
      uzdavinys(T2, {
        klausimas: `Funkcija apibrėžta formule $f(x) = ${tiesine(k, b).slice(4)}$. Rask $x$, kai $f(x) = ${y}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `$${narys(k)} = ${y - b}$, tad $x = ${x}$.`,
      }),

    // 6. Kokios funkcijos grafikas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Lentelėje $x$: $-2, -1, 0, 1, 2$, o $y$: $4, 1, 0, 1, 4$. Kokios funkcijos grafikas taip atrodo?',
        variantai: ['$y = x^2$', '$y = 2x$', '$y = x + 2$', '$y = -x^2$'],
        teisingas: 0,
        sprendimas: 'Priešingiems $x$ atitinka ta pati $y$ reikšmė, o reikšmės yra kvadratai.',
      }),

    // 7. Ką reiškia grafikų sankirta
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Du funkcijų grafikai kertasi taške $(2; 4)$. Ką tai reiškia?',
        variantai: [
          'kai $x = 2$, abiejų funkcijų reikšmės lygios $4$',
          'abi funkcijos lygios visur',
          'abiejų funkcijų nuliai yra $2$',
          'viena funkcija didesnė už kitą',
        ],
        teisingas: 0,
        sprendimas: 'Bendras taškas priklauso abiem grafikams.',
      }),
  ])
}

// ── 1.3. Funkcijos savybės ──────────────────────────────────────────────────

const T3 = 'funkcijos-savybes'

const A3 = [
  {
    klausimas: 'Rask funkcijos $y = 3x - 6$ nulį.',
    atsakymas: '2',
    atsakymasRodymui: '$x = 2$',
    sprendimas: '$3x = 6$, tad $x = 2$.',
  },
] as const

export const funkcijosSavybes: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  const k = pasirink([2, 3, -2, -3])
  const n = atsitiktinis(-3, 3)
  const b = -k * n
  if (Math.abs(b) > 9) return null
  // Parabolė su viršūne (v; w) ir sveikais nuliais.
  const v = atsitiktinis(-1, 1)
  const d = atsitiktinis(2, 3)
  const kryptis = pasirink([1, -1])
  const w = kryptis > 0 ? -d : d

  return variacija([
    // 1. Nulis
    () =>
      uzdavinys(T3, {
        klausimas: `Rask funkcijos $${tiesine(k, b)}$ nulį.`,
        atsakymas: String(n),
        atsakymasRodymui: `$x = ${n}$`,
        sprendimas: `Funkcijos nulis — toks $x$, kai $y = 0$: $${narys(k)} = ${-b}$.`,
      }),

    // 2. Didėja ar mažėja
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Ar funkcija $${tiesine(k, b)}$ didėja, ar mažėja?`,
        variantai: k > 0 ? ['didėja', 'mažėja', 'yra pastovi'] : ['mažėja', 'didėja', 'yra pastovi'],
        teisingas: 0,
        sprendimas: `Koeficientas prie $x$ yra ${k}, tad funkcija ${k > 0 ? 'didėja' : 'mažėja'}.`,
      }),

    // 3. Ką reiškia funkcijos nulis
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ką reiškia funkcijos nulis?',
        variantai: [
          'argumento reikšmę, kuriai funkcijos reikšmė lygi nuliui',
          'mažiausią funkcijos reikšmę',
          'grafiko sankirtą su $y$ ašimi',
          'funkcijos reikšmę, kai $x = 0$',
        ],
        teisingas: 0,
        sprendimas: 'Grafike tai sankirtos su $x$ ašimi taškas.',
      }),

    // 4. Didėjimo intervalas iš grafiko
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuriame intervale pavaizduota funkcija didėja?',
        variantai:
          kryptis > 0
            ? [`kai $x > ${v}$`, `kai $x < ${v}$`, 'visur', 'niekur']
            : [`kai $x < ${v}$`, `kai $x > ${v}$`, 'visur', 'niekur'],
        teisingas: 0,
        sprendimas: `Kryptis keičiasi viršūnėje, kurios abscisė $${v}$.`,
        brezinys: funkcijosGrafikas((x) => kryptis * 0.5 * (x - v) * (x - v) + w),
      }),

    // 5. Mažiausia reikšmė
    () =>
      uzdavinys(T3, {
        klausimas: 'Kokia yra mažiausia funkcijos $y = x^2$ reikšmė?',
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: 'Kvadratas niekada nėra neigiamas, o nulis pasiekiamas, kai $x = 0$.',
        brezinys: funkcijosGrafikas((x) => x * x),
      }),

    // 6. Sankirta su Oy
    () =>
      uzdavinys(T3, {
        klausimas: `Kurioje $y$ ašies vietoje funkcijos $${tiesine(k, b)}$ grafikas kerta ašį? Užrašyk ordinatę.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: 'Ant $y$ ašies $x = 0$, tad lieka laisvasis narys.',
      }),

    // 7. Viršūnės abscisė ir mažiausia reikšmė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuo skiriasi minimumo taško argumentas nuo mažiausios funkcijos reikšmės?',
        variantai: [
          'argumentas yra $x$ reikšmė, o mažiausia reikšmė — atitinkama $y$ reikšmė',
          'tai tas pats dalykas',
          'argumentas visada didesnis',
          'mažiausia reikšmė visada nulis',
        ],
        teisingas: 0,
        sprendimas: 'Viršūnėje $V(a; b)$ argumentas yra $a$, o mažiausia reikšmė — $b$.',
      }),
  ])
}

// ── 1.4. Skaičių seka ───────────────────────────────────────────────────────

const T4 = 'skaiciu-seka'

const A4 = [
  {
    klausimas: 'Pratęsk seką: $4, 9, 14, 19, \\ldots$ Koks penktasis narys?',
    atsakymas: '24',
    atsakymasRodymui: '$24$',
    sprendimas: 'Kiekvienas narys 5 didesnis už ankstesnį.',
  },
] as const

export const skaiciuSeka: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  const a1 = atsitiktinis(1, 12)
  const d = atsitiktinis(2, 9)
  const q = pasirink([2, 3])
  const n = atsitiktinis(5, 12)

  return variacija([
    // 1. Aritmetinės sekos pratęsimas
    () =>
      uzdavinys(T4, {
        klausimas: 'Koks yra penktasis sekos narys?',
        atsakymas: String(a1 + 4 * d),
        atsakymasRodymui: `$${a1 + 4 * d}$`,
        sprendimas: `Kiekvienas narys $${d}$ didesnis už ankstesnį.`,
        brezinys: sekosNariai([a1, a1 + d, a1 + 2 * d, a1 + 3 * d, null], `+${d}`),
      }),

    // 2. Geometrinės sekos pratęsimas
    () =>
      uzdavinys(T4, {
        klausimas: 'Koks yra ketvirtasis sekos narys?',
        atsakymas: String(a1 * q * q * q),
        atsakymasRodymui: `$${a1 * q * q * q}$`,
        sprendimas: `Kiekvienas narys ${q} kartus didesnis už ankstesnį.`,
        brezinys: sekosNariai([a1, a1 * q, a1 * q * q, null], `·${q}`),
      }),

    // 3. Narys pagal formulę
    () =>
      uzdavinys(T4, {
        klausimas: `Duota seka $a_n = ${d}n + ${a1}$. Rask $a_${n > 9 ? '{' + n + '}' : n}$.`,
        atsakymas: String(d * n + a1),
        atsakymasRodymui: `$${d * n + a1}$`,
        sprendimas: `$${d} \\cdot ${n} + ${a1} = ${d * n + a1}$.`,
      }),

    // 4. Kelintasis narys
    () =>
      uzdavinys(T4, {
        klausimas: `Duota seka $a_n = ${d}n + ${a1}$. Kelintasis narys lygus ${d * n + a1}?`,
        atsakymas: String(n),
        atsakymasRodymui: `$n = ${n}$`,
        sprendimas: `$${d}n = ${d * n}$, tad $n = ${n}$.`,
      }),

    // 5. Ar skaičius priklauso sekai
    () => {
      const tikras = a1 + d * atsitiktinis(3, 8)
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Ar skaičius ${tikras} priklauso sekai, kurios pirmasis narys ${a1}, o kiekvienas kitas ${d} didesnis?`,
        variantai: [
          `taip, nes $${tikras} - ${a1}$ dalijasi iš $${d}$`,
          'ne',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: `$${tikras - a1} : ${d} = ${(tikras - a1) / d}$ — sveikasis skaičius.`,
      })
    },

    // 6. Bendrojo nario formulė
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kokia yra sekos $${a1 + d}, ${a1 + 2 * d}, ${a1 + 3 * d}, ${a1 + 4 * d}, \\ldots$ bendrojo nario formulė?`,
        variantai: [
          `$a_n = ${d}n + ${a1}$`,
          `$a_n = ${a1}n + ${d}$`,
          `$a_n = ${d}n$`,
          `$a_n = n + ${d}$`,
        ],
        teisingas: 0,
        sprendimas: `Skirtumas tarp narių ${d}, o $a_1 = ${a1 + d}$.`,
      }),

    // 7. Kvadratų seka
    () => {
      const m = atsitiktinis(6, 20)
      return uzdavinys(T4, {
        klausimas: `Sekos pirmieji nariai $1, 4, 9, 16, 25, \\ldots$ Rask $a_${m > 9 ? '{' + m + '}' : m}$.`,
        atsakymas: String(m * m),
        atsakymasRodymui: `$${m * m}$`,
        sprendimas: `Bendrasis narys $a_n = n^2$; $${m}^2 = ${m * m}$.`,
      })
    },
  ])
}

// ── 1.5. Skaičių sekos, išreikštos rekurentiškai ────────────────────────────

const T5 = 'rekurentines-sekos'

const A5 = [
  {
    klausimas: 'Duota $a_1 = 2$, $a_{n+1} = a_n + 3$. Koks yra $a_4$?',
    atsakymas: '11',
    atsakymasRodymui: '$11$',
    sprendimas: '$2, 5, 8, 11$.',
  },
] as const

export const rekurentinesSekos: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  const a1 = atsitiktinis(2, 12)
  const d = atsitiktinis(2, 8)
  const q = pasirink([2, 3])

  return variacija([
    // 1. Sudėties taisyklė
    () =>
      uzdavinys(T5, {
        klausimas: `Duota $a_1 = ${a1}$, $a_{n+1} = a_n + ${d}$. Koks yra $a_5$?`,
        atsakymas: String(a1 + 4 * d),
        atsakymasRodymui: `$${a1 + 4 * d}$`,
        sprendimas: `$${a1}, ${a1 + d}, ${a1 + 2 * d}, ${a1 + 3 * d}, ${a1 + 4 * d}$.`,
      }),

    // 2. Daugybos taisyklė
    () =>
      uzdavinys(T5, {
        klausimas: `Duota $a_1 = ${a1}$, $a_{n+1} = ${q}a_n$. Koks yra $a_4$?`,
        atsakymas: String(a1 * q ** 3),
        atsakymasRodymui: `$${a1 * q ** 3}$`,
        sprendimas: `$${a1}, ${a1 * q}, ${a1 * q * q}, ${a1 * q ** 3}$.`,
      }),

    // 3. Mažėjanti seka
    () => {
      const pradzia = a1 + 5 * d
      return uzdavinys(T5, {
        klausimas: `Duota $a_1 = ${pradzia}$, $a_{n+1} = a_n - ${d}$. Koks yra $a_6$?`,
        atsakymas: String(pradzia - 5 * d),
        atsakymasRodymui: `$${pradzia - 5 * d}$`,
        sprendimas: `Kaskart atimama po ${d}: $${pradzia} - 5 \\cdot ${d} = ${pradzia - 5 * d}$.`,
      })
    },

    // 4. Ką reiškia taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Ką reiškia rekurentinė taisyklė $a_{n+1} = a_n + ${d}$?`,
        variantai: [
          `kiekvienas kitas narys ${d} didesnis už ankstesnį`,
          `kiekvienas narys ${d} kartus didesnis`,
          `visi nariai lygūs ${d}`,
          `pirmasis narys lygus ${d}`,
        ],
        teisingas: 0,
        sprendimas: 'Rekurentinė taisyklė kitą narį išreiškia per ankstesnį.',
      }),

    // 5. Fibonačio tipo seka
    () =>
      uzdavinys(T5, {
        klausimas: 'Duota $a_1 = 1$, $a_2 = 1$, $a_{n+2} = a_{n+1} + a_n$. Koks yra $a_8$?',
        atsakymas: '21',
        atsakymasRodymui: '$21$',
        sprendimas: '$1, 1, 2, 3, 5, 8, 13, 21$.',
      }),

    // 6. Kintantis žingsnis
    () =>
      uzdavinys(T5, {
        klausimas: `Duota $a_1 = ${a1}$, $a_{n+1} = a_n + n$. Koks yra $a_4$?`,
        atsakymas: String(a1 + 1 + 2 + 3),
        atsakymasRodymui: `$${a1 + 6}$`,
        sprendimas: `$a_2 = ${a1 + 1}$, $a_3 = ${a1 + 3}$, $a_4 = ${a1 + 6}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: `Pagal taisyklę $a_1 = ${a1}$, $a_{n+1} = a_n + 2$ mokinys parašė $${a1}, ${a1 + 2}, ${a1 + 6}, ${a1 + 8}$. Koks turi būti trečiasis narys?`,
        atsakymas: String(a1 + 4),
        atsakymasRodymui: `$${a1 + 4}$`,
        sprendimas: `Prie $${a1 + 2}$ pridedama 2, o ne 4.`,
      }),
  ])
}

// ── Funkcijos apibrėžimo ir reikšmių sritys (programos potemė) ──────────────

const T6 = 'apibrezimo-sritis'

const A6 = [
  {
    klausimas: 'Kokia yra funkcijos $y = \\dfrac{1}{x}$ apibrėžimo sritis?',
    atsakymas: 'x nelygu 0',
    atsakymasRodymui: 'Visi $x$, išskyrus $0$',
    sprendimas: 'Dalyba iš nulio negalima.',
  },
] as const

export const apibrezimoSritis: Generatorius = () => suBandymais(kurk6, A6, T6)

function kurk6(): Uzdavinys | null {
  const a = atsitiktinis(1, 9)
  const k = pasirink([1, 2, 3])

  return variacija([
    // 1. Vardiklis nelygus nuliui
    () =>
      uzdavinys(T6, {
        klausimas: `Kuriai $x$ reikšmei funkcija $y = \\dfrac{1}{x - ${a}}$ neapibrėžta?`,
        atsakymas: String(a),
        atsakymasRodymui: `$x = ${a}$`,
        sprendimas: `Vardiklis lygus nuliui, kai $x = ${a}$.`,
      }),

    // 2. Kas yra apibrėžimo sritis
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kas yra funkcijos apibrėžimo sritis?',
        variantai: [
          'visos argumento reikšmės, su kuriomis funkcija turi prasmę',
          'visos funkcijos reikšmės',
          'grafiko taškai',
          'funkcijos nuliai',
        ],
        teisingas: 0,
        sprendimas: 'Reikšmių sritis — tai jau gaunamos $y$ reikšmės.',
      }),

    // 3. Šaknies apibrėžimo sritis
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Kokia yra funkcijos $y = \\sqrt{x - ${a}}$ apibrėžimo sritis?`,
        variantai: [`$x \\ge ${a}$`, `$x > ${a}$`, `$x \\le ${a}$`, 'visi realieji skaičiai'],
        teisingas: 0,
        sprendimas: 'Pošaknis negali būti neigiamas.',
      }),

    // 4. Tiesinės funkcijos sritis
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Kokia yra funkcijos $y = ${k}x + ${a}$ apibrėžimo sritis?`,
        variantai: ['visi realieji skaičiai', `tik $x > 0$`, `tik $x \\ne ${a}$`, 'tik sveikieji skaičiai'],
        teisingas: 0,
        sprendimas: 'Į tiesinę formulę galima įrašyti bet kurį skaičių.',
      }),

    // 5. Reikšmių sritis
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kokia yra funkcijos $y = x^2$ reikšmių sritis?',
        variantai: ['$y \\ge 0$', '$y > 0$', 'visi realieji skaičiai', '$y \\le 0$'],
        teisingas: 0,
        sprendimas: 'Kvadratas neneigiamas, o nulis pasiekiamas.',
        brezinys: funkcijosGrafikas((x) => x * x),
      }),

    // 6. Dvi draudžiamos reikšmės
    () => {
      const b = a + atsitiktinis(1, 5)
      return uzdavinys(T6, {
        klausimas: `Funkcija $y = \\dfrac{1}{(x - ${a})(x - ${b})}$. Kiek yra $x$ reikšmių, su kuriomis ji neapibrėžta?`,
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: `Vardiklis nulinis, kai $x = ${a}$ arba $x = ${b}$.`,
      })
    },

    // 7. Prasminga sritis uždavinyje
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Talpoje buvo 120 l vandens ir kas minutę išteka po 4 l. Kokios $t$ reikšmės prasmingos?',
        variantai: [
          'nuo $0$ iki $30$ minučių',
          'visi realieji skaičiai',
          'tik neigiami skaičiai',
          'nuo $0$ iki $120$',
        ],
        teisingas: 0,
        sprendimas: 'Po 30 minučių vandens nebelieka, tad toliau formulė netenka prasmės.',
      }),
  ])
}

// ── 2.1. Tiesioginio proporcingumo funkcija ─────────────────────────────────

const T7 = 'tiesioginis-proporcingumas'

const A7 = [
  {
    klausimas: 'Duota $y = 4x$. Rask $y$, kai $x = 3$.',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '$4 \\cdot 3 = 12$.',
  },
] as const

export const tiesioginisProporcingumas: Generatorius = () => suBandymais(kurk7, A7, T7)

function kurk7(): Uzdavinys | null {
  const k = pasirink([-4, -3, -2, 2, 3, 4, 5])
  const x = atsitiktinis(2, 9)

  return variacija([
    // 1. Reikšmė
    () =>
      uzdavinys(T7, {
        klausimas: `Duota $y = ${narys(k)}$. Rask $y$, kai $x = ${x}$.`,
        atsakymas: String(k * x),
        atsakymasRodymui: `$${k * x}$`,
        sprendimas: `$${k} \\cdot ${x} = ${k * x}$.`,
      }),

    // 2. Koeficientas iš taško
    () =>
      uzdavinys(T7, {
        klausimas: `Tiesioginio proporcingumo funkcijos grafikas eina per tašką $(${x}; ${k * x})$. Koks yra koeficientas $k$?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `$k = ${k * x} : ${x} = ${k}$.`,
      }),

    // 3. Ar tai tiesioginis proporcingumas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Ar funkcija $y = ${narys(k)} + 1$ yra tiesioginio proporcingumo funkcija?`,
        variantai: [
          'ne, nes yra laisvasis narys',
          'taip',
          'taip, jei $x > 0$',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Tiesioginio proporcingumo funkcija užrašoma $y = kx$.',
      }),

    // 4. Grafiko statumas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kurios funkcijos grafikas statesnis: $y = 2x$ ar $y = 5x$?',
        variantai: ['$y = 5x$, nes koeficientas didesnis', '$y = 2x$', 'jie vienodo statumo'],
        teisingas: 0,
        sprendimas: 'Kuo didesnis $|k|$, tuo tiesė statesnė.',
        brezinys: keliosKreives([
          { f: (t) => 5 * t, vardas: 'y=5x' },
          { f: (t) => 2 * t, vardas: 'y=2x' },
        ]),
      }),

    // 5. Grafikas eina per pradžią
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kodėl tiesioginio proporcingumo grafikas visada eina per koordinačių pradžią?',
        variantai: [
          'nes kai $x = 0$, tai ir $y = 0$',
          'nes $k$ visada teigiamas',
          'nes taip patogiau braižyti',
          'jis ne visada eina',
        ],
        teisingas: 0,
        sprendimas: 'Į $y = kx$ įrašius nulį gaunamas nulis.',
      }),

    // 6. Ar taškas priklauso
    () => {
      const kitas = atsitiktinis(2, 8)
      if (kitas === x) return null
      return pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Ar taškai $(${x}; ${k * x})$ ir $(${kitas}; ${k * kitas + 1})$ priklauso tai pačiai tiesioginio proporcingumo funkcijai?`,
        variantai: [
          `ne, nes antrajame taške santykis $y : x$ kitoks`,
          'taip',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: `Pirmame taške santykis $${k}$, antrame — ne.`,
      })
    },

    // 7. Formulė iš sąlygos
    () =>
      uzdavinys(T7, {
        klausimas: `Tiesioginio proporcingumo funkcijos grafikas eina per tašką $(${x}; ${k * x})$. Kokia $y$ reikšmė, kai $x = 1$?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `Formulė $y = ${narys(k)}$, tad su $x = 1$ gaunama $${k}$.`,
      }),
  ])
}

// ── 2.2. Tiesinė funkcija ───────────────────────────────────────────────────

const T8 = 'tiesine-funkcija-9'

const A8 = [
  {
    klausimas: 'Duota $y = 2x + 3$. Rask $y$, kai $x = 4$.',
    atsakymas: '11',
    atsakymasRodymui: '$11$',
    sprendimas: '$2 \\cdot 4 + 3 = 11$.',
  },
] as const

export const tiesineFunkcija9: Generatorius = () => suBandymais(kurk8, A8, T8)

function kurk8(): Uzdavinys | null {
  const k = pasirink([-4, -3, -2, 2, 3, 4])
  const b = atsitiktinis(-9, 9)
  if (b === 0) return null
  const x = atsitiktinis(1, 6)

  return variacija([
    // 1. Reikšmė
    () =>
      uzdavinys(T8, {
        klausimas: `Duota $${tiesine(k, b)}$. Rask $y$, kai $x = ${x}$.`,
        atsakymas: String(k * x + b),
        atsakymasRodymui: `$${k * x + b}$`,
        sprendimas: `$${k} \\cdot ${x}${plius(b)} = ${k * x + b}$.`,
      }),

    // 2. Koeficientai
    () =>
      uzdavinys(T8, {
        klausimas: `Nurodyk funkcijos $${tiesine(k, b)}$ koeficientą $k$.`,
        atsakymas: String(k),
        atsakymasRodymui: `$k = ${k}$`,
        sprendimas: 'Koeficientas $k$ yra daugiklis prie $x$.',
      }),

    // 3. Formulė iš dviejų taškų
    () => {
      const x2 = x + 2
      return uzdavinys(T8, {
        klausimas: `Tiesinės funkcijos grafikas eina per taškus $(0; ${b})$ ir $(${x2}; ${k * x2 + b})$. Koks yra koeficientas $k$?`,
        atsakymas: String(k),
        atsakymasRodymui: `$k = ${k}$`,
        sprendimas: `$k = \\dfrac{${k * x2 + b} - (${b})}{${x2} - 0} = ${k}$.`,
      })
    },

    // 4. Lygiagreti tiesė
    () => {
      const c = atsitiktinis(1, 9)
      return uzdavinys(T8, {
        klausimas: `Kokį koeficientą $k$ turi tiesė, lygiagreti tiesei $${tiesine(k, b)}$ ir einanti per tašką $(1; ${c})$?`,
        atsakymas: String(k),
        atsakymasRodymui: `$k = ${k}$`,
        sprendimas: 'Lygiagrečių tiesių koeficientai $k$ vienodi.',
      })
    },

    // 5. Klaidos radimas
    () =>
      uzdavinys(T8, {
        klausimas: `Funkcijai $y = ${b}${plius(k)}x$ mokinys nurodė $k = ${b}$. Koks iš tikrųjų yra $k$?`,
        atsakymas: String(k),
        atsakymasRodymui: `$k = ${k}$`,
        sprendimas: '$k$ yra daugiklis prie $x$, o ne pirmasis užrašytas skaičius.',
      }),

    // 6. Formulė iš sankirtų
    () => {
      const n = atsitiktinis(1, 5)
      const bb = -k * n
      if (bb === 0 || Math.abs(bb) > 20) return null
      return uzdavinys(T8, {
        klausimas: `Tiesinės funkcijos grafikas kerta $y$ ašį taške $(0; ${bb})$, o $x$ ašį — taške $(${n}; 0)$. Koks yra koeficientas $k$?`,
        atsakymas: String(k),
        atsakymasRodymui: `$k = ${k}$`,
        sprendimas: `$k = \\dfrac{0 - (${bb})}{${n} - 0} = ${k}$.`,
      })
    },

    // 7. Ar taškas priklauso
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Ar taškas $(${x}; ${k * x + b})$ priklauso grafikui $${tiesine(k, b)}$?`,
        variantai: ['taip, nes įrašius gaunama teisinga lygybė', 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: `$${k} \\cdot ${x}${plius(b)} = ${k * x + b}$.`,
      }),
  ])
}

// ── 2.3. Tiesinės funkcijos savybės ─────────────────────────────────────────

const T9 = 'tiesines-funkcijos-savybes'

const A9 = [
  {
    klausimas: 'Ar funkcija $y = 3x - 1$ didėja, ar mažėja?',
    atsakymas: 'dideja',
    atsakymasRodymui: 'Didėja',
    sprendimas: 'Koeficientas $k = 3$ teigiamas.',
  },
] as const

export const tiesinesFunkcijosSavybes: Generatorius = () => suBandymais(kurk9, A9, T9)

function kurk9(): Uzdavinys | null {
  const k = pasirink([-4, -3, -2, 2, 3, 4])
  const n = atsitiktinis(-4, 4)
  const b = -k * n
  if (b === 0 || Math.abs(b) > 16) return null

  return variacija([
    // 1. Didėja ar mažėja
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Ar funkcija $${tiesine(k, b)}$ didėja, ar mažėja?`,
        variantai: k > 0 ? ['didėja', 'mažėja', 'yra pastovi'] : ['mažėja', 'didėja', 'yra pastovi'],
        teisingas: 0,
        sprendimas: `$k = ${k}$, tad funkcija ${k > 0 ? 'didėja' : 'mažėja'}.`,
      }),

    // 2. Nulis
    () =>
      uzdavinys(T9, {
        klausimas: `Rask funkcijos $${tiesine(k, b)}$ nulį.`,
        atsakymas: String(n),
        atsakymasRodymui: `$x = ${n}$`,
        sprendimas: `$${narys(k)} = ${-b}$, tad $x = ${n}$.`,
      }),

    // 3. Sankirta su Oy
    () =>
      uzdavinys(T9, {
        klausimas: `Kokia yra funkcijos $${tiesine(k, b)}$ grafiko sankirtos su $y$ ašimi ordinatė?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: 'Įrašius $x = 0$ lieka laisvasis narys.',
      }),

    // 4. Kada reikšmės teigiamos
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kada funkcijos $${tiesine(k, b)}$ reikšmės yra teigiamos?`,
        variantai:
          k > 0
            ? [`kai $x > ${n}$`, `kai $x < ${n}$`, 'visada', 'niekada']
            : [`kai $x < ${n}$`, `kai $x > ${n}$`, 'visada', 'niekada'],
        teisingas: 0,
        sprendimas: `Nulis yra $x = ${n}$, o toliau ženklas priklauso nuo $k$ ženklo.`,
        brezinys: funkcijosGrafikas((x) => k * x + b),
      }),

    // 5. k ženklo prasmė
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kaip koeficiento $k$ ženklas susijęs su tiesinės funkcijos kitimu?',
        variantai: [
          'kai $k > 0$ — didėja, kai $k < 0$ — mažėja',
          'kai $k > 0$ — mažėja',
          '$k$ ženklas kitimui įtakos neturi',
          'kai $k = 0$ — didėja',
        ],
        teisingas: 0,
        sprendimas: 'Kai $k = 0$, funkcija pastovi.',
      }),

    // 6. Dviejų funkcijų palyginimas
    () => {
      const b2 = b + atsitiktinis(2, 6)
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kuo skiriasi funkcijos $${tiesine(k, b)}$ ir $${tiesine(k, b2)}$?`,
        variantai: [
          'jos vienodai kyla arba leidžiasi, bet kerta $y$ ašį skirtinguose taškuose',
          'jos turi tą patį nulį',
          'jų grafikai susikerta',
          'jos visiškai vienodos',
        ],
        teisingas: 0,
        sprendimas: 'Vienodas $k$ reiškia lygiagrečias tieses.',
      })
    },

    // 7. Pastovi funkcija
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kokia yra tiesinė funkcija, kurios $k = 0$?',
        variantai: [
          'pastovi — jos grafikas horizontali tiesė',
          'didėjanti',
          'mažėjanti',
          'tokios funkcijos nėra',
        ],
        teisingas: 0,
        sprendimas: 'Tada $y = b$ su visomis $x$ reikšmėmis.',
      }),
  ])
}

// ── 2.4. Dviejų tiesių tarpusavio padėtis ───────────────────────────────────

const T10 = 'dvieju-tiesiu-padetis'

const A10 = [
  {
    klausimas: 'Ar tiesės $y = 2x + 1$ ir $y = 2x - 5$ lygiagrečios?',
    atsakymas: 'taip',
    atsakymasRodymui: 'Taip',
    sprendimas: 'Koeficientai $k$ vienodi, o laisvieji nariai skiriasi.',
  },
] as const

export const dviejuTiesiuPadetis: Generatorius = () => suBandymais(kurk10, A10, T10)

function kurk10(): Uzdavinys | null {
  const k = pasirink([2, 3, -2, -3])
  const b1 = atsitiktinis(-5, 5)
  const b2 = b1 + atsitiktinis(1, 6)
  const k2 = k === 2 ? -1 : 1

  return variacija([
    // 1. Ar lygiagrečios
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Kokia yra tiesių $${tiesine(k, b1)}$ ir $${tiesine(k, b2)}$ tarpusavio padėtis?`,
        variantai: ['jos lygiagrečios', 'jos susikerta', 'jos sutampa', 'jos statmenos'],
        teisingas: 0,
        sprendimas: 'Koeficientai $k$ vienodi, o laisvieji nariai skiriasi.',
        brezinys: keliosKreives([
          { f: (x) => k * x + b1 },
          { f: (x) => k * x + b2 },
        ]),
      }),

    // 2. Ar susikerta
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Kokia yra tiesių $${tiesine(k, b1)}$ ir $${tiesine(k2, b2)}$ tarpusavio padėtis?`,
        variantai: ['jos susikerta viename taške', 'jos lygiagrečios', 'jos sutampa'],
        teisingas: 0,
        sprendimas: 'Koeficientai $k$ skirtingi, tad tiesės susikerta.',
      }),

    // 3. Susikirtimo taškas
    () => {
      const x = atsitiktinis(-3, 4)
      const y = k * x + b1
      const bb = y - k2 * x
      if (Math.abs(bb) > 12 || Math.abs(y) > 15) return null
      return uzdavinys(T10, {
        klausimas: `Rask tiesių $${tiesine(k, b1)}$ ir $${tiesine(k2, bb)}$ susikirtimo taško abscisę.`,
        atsakymas: String(x),
        atsakymasRodymui: `$(${x}; ${y})$`,
        sprendimas: `Sulyginus: $${narys(k - k2)} = ${bb - b1}$, tad $x = ${x}$.`,
      })
    },

    // 4. Kada sutampa
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kada dviejų tiesinių funkcijų grafikai sutampa?',
        variantai: [
          'kai sutampa ir $k$, ir $b$',
          'kai sutampa tik $k$',
          'kai sutampa tik $b$',
          'jie niekada nesutampa',
        ],
        teisingas: 0,
        sprendimas: 'Tada tai ta pati tiesė, užrašyta kitaip.',
      }),

    // 5. Parametras lygiagretumui
    () => {
      const m = k + 1
      return uzdavinys(T10, {
        klausimas: `Rask $m$ reikšmę, su kuria tiesės $y = (m - 1)x + 3$ ir $${tiesine(k, b1)}$ būtų lygiagrečios.`,
        atsakymas: String(m),
        atsakymasRodymui: `$m = ${m}$`,
        sprendimas: `$m - 1 = ${k}$, tad $m = ${m}$.`,
      })
    },

    // 6. Ką pasako koeficientai
    () =>
      poruUzdavinys(naujasId(T10), T10, {
        klausimas: 'Sujunk koeficientų sąlygą su tiesių padėtimi.',
        poros: [
          { kaire: '$k$ skirtingi', desine: 'tiesės susikerta' },
          { kaire: '$k$ vienodi, $b$ skirtingi', desine: 'tiesės lygiagrečios' },
          { kaire: '$k$ ir $b$ vienodi', desine: 'tiesės sutampa' },
          { kaire: '$k = 0$ abiejose', desine: 'abi tiesės horizontalios' },
        ],
        sprendimas: 'Padėtį lemia koeficientas $k$, o sutapimą — dar ir $b$.',
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Mokinys teigia, kad tiesės $${tiesine(k, b1)}$ ir $${tiesine(k, b1)}$ susikerta viename taške. Kodėl tai netiesa?`,
        variantai: [
          'nes tai ta pati tiesė — bendrų taškų be galo daug',
          'nes jos lygiagrečios ir bendrų taškų neturi',
          'nes jos statmenos',
          'iš tikrųjų tai tiesa',
        ],
        teisingas: 0,
        sprendimas: 'Abi lygtys vienodos, tad grafikai sutampa.',
      }),
  ])
}
