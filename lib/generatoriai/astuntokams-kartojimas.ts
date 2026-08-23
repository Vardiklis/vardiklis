import { atsitiktinis, nsd, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { galimybiuMedis, koordinaciuPlokstuma, stulpelineDiagrama, trikampisSuZymemis } from './sestokams-vaizdai'
import { apskritimas } from './septintokams-vaizdai'
import { vektoriaiTinklelyje } from './astuntokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 8 klasės tema „Progimnazijos kurso kartojimo medžiaga“ — devyniolika
 * potemių, po vieną kiekvienai per ketverius metus išeitai sričiai.
 *
 * Kartojimo uždaviniai sąmoningai trumpesni už temos uždavinius: tikrinama,
 * ar dalykas dar atsimenamas, o ne mokoma iš naujo. Skaičiai parenkami tokie,
 * kad atsakymas būtų sveikasis arba paprasta trupmena.
 */

/** Trupmenos užrašas. */
function tr(sk: number, vd: number): string {
  return `\\dfrac{${sk}}{${vd}}`
}

/** Suprastina trupmeną. */
function prastink(sk: number, vd: number): [number, number] {
  const d = nsd(Math.abs(sk), Math.abs(vd))
  return [sk / d, vd / d]
}

/** Kraštinės ilgis pagal priešais esantį kampą (sinusų teorema). */
function sin(kampas: number): number {
  return Number((16 * Math.sin((kampas * Math.PI) / 180)).toFixed(2))
}

/** Nario su kintamuoju užrašas. */
function narys(k: number, r = 'x'): string {
  if (k === 1) return r
  if (k === -1) return `-${r}`
  return `${k}${r}`
}

// ── 10.1. Skaičių aibės ─────────────────────────────────────────────────────

const T1 = 'kartojimas-aibes'

const A1 = [
  {
    klausimas: 'Kuriai skaičių aibei priklauso $-7$?',
    atsakymas: 'sveiku',
    atsakymasRodymui: 'Sveikųjų skaičių aibei',
    sprendimas: 'Natūralieji skaičiai neigiami nebūna.',
  },
] as const

export const kartojimasAibes: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {
  const n = atsitiktinis(2, 40)
  const kv = atsitiktinis(2, 12)

  return variacija([
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Kuri mažiausia skaičių aibė apima skaičių $-${n}$?`,
        variantai: ['sveikųjų', 'natūraliųjų', 'racionaliųjų', 'iracionaliųjų'],
        teisingas: 0,
        sprendimas: 'Natūralieji skaičiai prasideda nuo 1, tad neigiamų neapima.',
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Kuri mažiausia skaičių aibė apima skaičių $${tr(1, 4)}$?`,
        variantai: ['racionaliųjų', 'sveikųjų', 'natūraliųjų', 'iracionaliųjų'],
        teisingas: 0,
        sprendimas: 'Trupmena nėra sveikasis skaičius, bet užrašoma santykiu.',
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Koks skaičius yra $\\sqrt{${kv * kv}}$?`,
        variantai: ['natūralusis', 'iracionalusis', 'neigiamas', 'trupmeninis'],
        teisingas: 0,
        sprendimas: `$\\sqrt{${kv * kv}} = ${kv}$.`,
      }),
    () =>
      uzdavinys(T1, {
        klausimas: `Kam lygu $\\sqrt{${kv * kv}}$?`,
        atsakymas: String(kv),
        atsakymasRodymui: `$${kv}$`,
        sprendimas: `$${kv}^2 = ${kv * kv}$.`,
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuris skaičius yra iracionalusis?',
        variantai: ['$\\sqrt{2}$', '$\\sqrt{9}$', '$0{,}25$', `$${tr(2, 5)}$`],
        teisingas: 0,
        sprendimas: 'Iš 2 šaknis neišsitraukia, o dešimtainė išraiška neperiodinė.',
      }),
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Sujunk skaičių su mažiausia jį apimančia aibe.',
        poros: [
          { kaire: '$5$', desine: 'natūralieji' },
          { kaire: '$-3$', desine: 'sveikieji' },
          { kaire: `$${tr(3, 4)}$`, desine: 'racionalieji' },
          { kaire: '$\\sqrt{5}$', desine: 'iracionalieji' },
        ],
        sprendimas: 'Kiekviena aibė apima ankstesnę.',
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kokie skaičiai kartu sudaro realiųjų skaičių aibę?',
        variantai: [
          'racionalieji ir iracionalieji',
          'natūralieji ir sveikieji',
          'tik racionalieji',
          'tik teigiamieji',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienas realusis skaičius yra arba vienas, arba kitas.',
      }),
  ])
}

// ── 10.2. Skaičių dalumas ───────────────────────────────────────────────────

const T2 = 'kartojimas-dalumas'

const A2 = [
  {
    klausimas: 'Ar 138 dalijasi iš 3?',
    atsakymas: 'taip',
    atsakymasRodymui: 'Taip',
    sprendimas: '$1 + 3 + 8 = 12$ dalijasi iš 3.',
  },
] as const

export const kartojimasDalumas: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  const a = atsitiktinis(12, 60)
  const b = atsitiktinis(12, 60)
  const sk = atsitiktinis(100, 999)
  const skaitmenuSuma = String(sk).split('').reduce((s, c) => s + Number(c), 0)

  return variacija([
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ar skaičius $${sk}$ dalijasi iš 3?`,
        variantai:
          skaitmenuSuma % 3 === 0
            ? [`taip, nes skaitmenų suma $${skaitmenuSuma}$ dalijasi iš 3`, 'ne', 'to nustatyti neįmanoma']
            : [`ne, nes skaitmenų suma $${skaitmenuSuma}$ nesidalija iš 3`, 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Dalumo iš 3 požymis remiasi skaitmenų suma.',
      }),
    () =>
      uzdavinys(T2, {
        klausimas: `Rask didžiausiąjį bendrąjį skaičių ${a} ir ${b} daliklį.`,
        atsakymas: String(nsd(a, b)),
        atsakymasRodymui: `$${nsd(a, b)}$`,
        sprendimas: `Didžiausias skaičius, iš kurio dalijasi ir ${a}, ir ${b}.`,
      }),
    () => {
      const mbk = (a * b) / nsd(a, b)
      if (mbk > 1000) return null
      return uzdavinys(T2, {
        klausimas: `Rask mažiausiąjį bendrąjį skaičių ${a} ir ${b} kartotinį.`,
        atsakymas: String(mbk),
        atsakymasRodymui: `$${mbk}$`,
        sprendimas: `$${a} \\cdot ${b} : ${nsd(a, b)} = ${mbk}$.`,
      })
    },
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuris skaičius yra pirminis?',
        variantai: ['$23$', '$21$', '$27$', '$33$'],
        teisingas: 0,
        sprendimas: 'Pirminis skaičius dalijasi tik iš 1 ir savęs.',
      }),
    () => {
      const p = pasirink([2, 4, 5, 9, 10])
      const n = p * atsitiktinis(3, 40)
      return uzdavinys(T2, {
        klausimas: `Iš kokio skaičiaus, didesnio už 1, dalijasi ir ${n}, ir ${p}? Užrašyk didžiausią tokį skaičių.`,
        atsakymas: String(p),
        atsakymasRodymui: `$${p}$`,
        sprendimas: `$${n}$ yra ${p} kartotinis.`,
      })
    },
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kaip atpažinti, kad skaičius dalijasi iš 9?',
        variantai: [
          'jo skaitmenų suma dalijasi iš 9',
          'jis baigiasi 9',
          'jis nelyginis',
          'jis dalijasi iš 3',
        ],
        teisingas: 0,
        sprendimas: 'Iš 3 dalijasi ir tie, kurie iš 9 nesidalija.',
      }),
    () =>
      uzdavinys(T2, {
        klausimas: `Kiek yra skaičiaus ${pasirink([12, 18, 20, 24, 28])} daliklių?`,
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: 'Skaičiuojami visi dalikliai nuo 1 iki paties skaičiaus.',
      }),
  ])
}

// ── 10.3. Aritmetiniai veiksmai su skaičiais ────────────────────────────────

const T3 = 'kartojimas-veiksmai'

const A3 = [
  {
    klausimas: 'Apskaičiuok: $12 + 3 \\cdot 4$.',
    atsakymas: '24',
    atsakymasRodymui: '$24$',
    sprendimas: 'Pirma daugyba, paskui sudėtis.',
  },
] as const

export const kartojimasVeiksmai: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  const a = atsitiktinis(2, 12)
  const b = atsitiktinis(2, 12)
  const c = atsitiktinis(2, 20)

  return variacija([
    () =>
      uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${c} + ${a} \\cdot ${b}$.`,
        atsakymas: String(c + a * b),
        atsakymasRodymui: `$${c + a * b}$`,
        sprendimas: 'Pirmiausia atliekama daugyba.',
      }),
    () =>
      uzdavinys(T3, {
        klausimas: `Apskaičiuok: $(${c} + ${a}) \\cdot ${b}$.`,
        atsakymas: String((c + a) * b),
        atsakymasRodymui: `$${(c + a) * b}$`,
        sprendimas: 'Pirmiausia atliekami veiksmai skliaustuose.',
      }),
    () =>
      uzdavinys(T3, {
        klausimas: `Apskaičiuok: $-${a} \\cdot ${b}$.`,
        atsakymas: String(-a * b),
        atsakymasRodymui: `$-${a * b}$`,
        sprendimas: 'Skirtingų ženklų skaičių sandauga neigiama.',
      }),
    () =>
      uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${c} - (${a} - ${b})$.`,
        atsakymas: String(c - (a - b)),
        atsakymasRodymui: `$${c - (a - b)}$`,
        sprendimas: `Skliaustuose gaunama $${a - b}$.`,
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kokia yra veiksmų atlikimo tvarka?',
        variantai: [
          'skliaustai, kėlimas laipsniu, daugyba ir dalyba, sudėtis ir atimtis',
          'iš kairės į dešinę',
          'sudėtis, daugyba, skliaustai',
          'daugyba, skliaustai, sudėtis',
        ],
        teisingas: 0,
        sprendimas: 'Vienodo lygio veiksmai atliekami iš kairės į dešinę.',
      }),
    () => {
      const dalinys = a * b * c
      if (dalinys > 100000) return null
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${dalinys} : ${a} : ${b}$.`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$`,
        sprendimas: `$${dalinys} : ${a} = ${b * c}$; $${b * c} : ${b} = ${c}$.`,
      })
    },
    () =>
      uzdavinys(T3, {
        klausimas: `Apskaičiuok: $-${a} - (-${b})$.`,
        atsakymas: String(-a + b),
        atsakymasRodymui: `$${-a + b}$`,
        sprendimas: 'Atimti neigiamą skaičių — tas pat kaip pridėti teigiamą.',
      }),
  ])
}

// ── 10.4. Paprastosios trupmenos ────────────────────────────────────────────

const T4 = 'kartojimas-trupmenos'

const A4 = [
  {
    klausimas: 'Suprastink trupmeną $\\dfrac{6}{8}$. Užrašyk skaitiklį.',
    atsakymas: '3',
    atsakymasRodymui: '$\\dfrac{3}{4}$',
    sprendimas: 'Skaitiklis ir vardiklis dalijami iš 2.',
  },
] as const

export const kartojimasTrupmenos: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  const vd = pasirink([4, 5, 6, 8, 10, 12, 20])
  const sk = atsitiktinis(1, vd - 1)
  const k = atsitiktinis(2, 5)
  const [ps, pv] = prastink(sk * k, vd * k)

  return variacija([
    () =>
      uzdavinys(T4, {
        klausimas: `Suprastink trupmeną $${tr(sk * k, vd * k)}$. Užrašyk skaitiklį.`,
        atsakymas: String(ps),
        atsakymasRodymui: `$${tr(ps, pv)}$`,
        sprendimas: `Abu nariai dalijami iš ${(sk * k) / ps}.`,
      }),
    () => {
      const [s2, v2] = prastink(sk + 1, vd)
      if (sk + 1 >= vd) return null
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok: $${tr(sk, vd)} + ${tr(1, vd)}$. Užrašyk atsakymo skaitiklį.`,
        atsakymas: String(s2),
        atsakymasRodymui: `$${tr(s2, v2)}$`,
        sprendimas: 'Vienodų vardiklių trupmenų skaitikliai sudedami.',
      })
    },
    () => {
      const [s2, v2] = prastink(sk, vd * 2)
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok: $${tr(sk, vd)} \\cdot ${tr(1, 2)}$. Užrašyk atsakymo vardiklį.`,
        atsakymas: String(v2),
        atsakymasRodymui: `$${tr(s2, v2)}$`,
        sprendimas: 'Trupmenos dauginamos skaitiklį iš skaitiklio, vardiklį iš vardiklio.',
      })
    },
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kuri trupmena didesnė: $${tr(1, 3)}$ ar $${tr(1, 4)}$?`,
        variantai: [`$${tr(1, 3)}$`, `$${tr(1, 4)}$`, 'jos lygios'],
        teisingas: 0,
        sprendimas: 'Kai skaitikliai vienodi, didesnė ta, kurios vardiklis mažesnis.',
      }),
    () => {
      const sveikas = atsitiktinis(1, 5)
      return uzdavinys(T4, {
        klausimas: `Paversk mišrųjį skaičių $${sveikas}${tr(sk, vd)}$ netaisyklingąja trupmena. Užrašyk skaitiklį.`,
        atsakymas: String(sveikas * vd + sk),
        atsakymasRodymui: `$${tr(sveikas * vd + sk, vd)}$`,
        sprendimas: `$${sveikas} \\cdot ${vd} + ${sk} = ${sveikas * vd + sk}$.`,
      })
    },
    () => {
      if (1000 % vd !== 0) return null
      return uzdavinys(T4, {
        klausimas: `Užrašyk trupmeną $${tr(sk, vd)}$ dešimtaine trupmena.`,
        atsakymas: String(sk / vd),
        atsakymasRodymui: `$${String(sk / vd).replace('.', '{,}')}$`,
        sprendimas: `$${sk} : ${vd} = ${String(sk / vd).replace('.', '{,}')}$.`,
      })
    },
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek yra $${tr(1, vd)}$ dalis nuo ${vd * k}?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `$${vd * k} : ${vd} = ${k}$.`,
      }),
  ])
}

// ── 10.5. Proporcingumas ────────────────────────────────────────────────────

const T5 = 'kartojimas-proporcingumas'

const A5 = [
  {
    klausimas: 'Proporcijoje $\\dfrac{3}{4} = \\dfrac{x}{8}$ rask $x$.',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: '$3 \\cdot 8 : 4 = 6$.',
  },
] as const

export const kartojimasProporcingumas: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  const a = atsitiktinis(2, 9)
  const b = atsitiktinis(2, 9)
  const k = atsitiktinis(2, 6)

  return variacija([
    () =>
      uzdavinys(T5, {
        klausimas: `Proporcijoje $${tr(a, b)} = \\dfrac{x}{${b * k}}$ rask $x$.`,
        atsakymas: String(a * k),
        atsakymasRodymui: `$${a * k}$`,
        sprendimas: `$${a} \\cdot ${b * k} : ${b} = ${a * k}$.`,
      }),
    () => {
      const kaina = atsitiktinis(2, 9)
      const kiek = atsitiktinis(3, 12)
      return uzdavinys(T5, {
        klausimas: `${a} kg prekės kainuoja ${a * kaina} Eur. Kiek kainuos ${kiek} kg?`,
        atsakymas: String(kiek * kaina),
        atsakymasRodymui: `$${kiek * kaina}$ Eur`,
        sprendimas: `Vienas kilogramas — $${kaina}$ Eur.`,
      })
    },
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kokie dydžiai vadinami tiesiog proporcingais?',
        variantai: [
          'kai vienam didėjant tiek pat kartų didėja ir kitas',
          'kai vienam didėjant kitas mažėja',
          'kai jų suma pastovi',
          'kai jie lygūs',
        ],
        teisingas: 0,
        sprendimas: 'Jų santykis pastovus.',
      }),
    () => {
      const darbininku = pasirink([2, 3, 4, 6])
      const dienu = pasirink([6, 12, 24])
      if ((darbininku * dienu) % (darbininku + 2) !== 0) return null
      return uzdavinys(T5, {
        klausimas: `${darbininku} darbininkai darbą atlieka per ${dienu} dienas. Per kiek dienų tą patį darbą atliks ${darbininku + 2} darbininkai?`,
        atsakymas: String((darbininku * dienu) / (darbininku + 2)),
        atsakymasRodymui: `$${(darbininku * dienu) / (darbininku + 2)}$`,
        sprendimas: 'Dydžiai atvirkščiai proporcingi, tad sandauga pastovi.',
      })
    },
    () =>
      uzdavinys(T5, {
        klausimas: `Žemėlapio mastelis $1 : ${k * 1000}$. Kokį tikrąjį atstumą metrais atitinka ${a} cm?`,
        atsakymas: String((a * k * 1000) / 100),
        atsakymasRodymui: `$${(a * k * 1000) / 100}$ m`,
        sprendimas: `$${a} \\cdot ${k * 1000} = ${a * k * 1000}$ cm $= ${(a * k * 1000) / 100}$ m.`,
      }),
    () =>
      uzdavinys(T5, {
        klausimas: `Sudalyk ${(a + b) * k} vienetų dalimis, kurių santykis $${a} : ${b}$. Kokia yra didesnioji dalis?`,
        atsakymas: String(Math.max(a, b) * k),
        atsakymasRodymui: `$${Math.max(a, b) * k}$`,
        sprendimas: `Viena dalis — $${(a + b) * k} : ${a + b} = ${k}$.`,
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kaip atrodo tiesiogiai proporcingų dydžių grafikas?',
        variantai: [
          'tiesė, einanti per koordinačių pradžią',
          'tiesė, nekertanti ašių',
          'hiperbolė',
          'parabolė',
        ],
        teisingas: 0,
        sprendimas: 'Kai vienas dydis nulinis, nulinis ir kitas.',
      }),
  ])
}

// ── 10.6. Procentai ─────────────────────────────────────────────────────────

const T6 = 'kartojimas-procentai'

const A6 = [
  {
    klausimas: 'Kiek yra 20 % nuo 150?',
    atsakymas: '30',
    atsakymasRodymui: '$30$',
    sprendimas: '$150 : 100 \\cdot 20 = 30$.',
  },
] as const

export const kartojimasProcentai: Generatorius = () => suBandymais(kurk6, A6, T6)

function kurk6(): Uzdavinys | null {
  const proc = pasirink([5, 10, 20, 25, 40, 50, 75])
  const visuma = atsitiktinis(2, 40) * 20
  const dalis = (visuma * proc) / 100
  if (dalis % 1 !== 0) return null

  return variacija([
    () =>
      uzdavinys(T6, {
        klausimas: `Kiek yra $${proc}\\%$ nuo ${visuma}?`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `$${visuma} : 100 \\cdot ${proc} = ${dalis}$.`,
      }),
    () =>
      uzdavinys(T6, {
        klausimas: `Kiek procentų sudaro ${dalis} nuo ${visuma}?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `$${dalis} : ${visuma} \\cdot 100 = ${proc}$.`,
      }),
    () =>
      uzdavinys(T6, {
        klausimas: `Prekė kainavo ${visuma} Eur ir atpigo $${proc}\\%$. Kiek ji kainuoja dabar?`,
        atsakymas: String(visuma - dalis),
        atsakymasRodymui: `$${visuma - dalis}$ Eur`,
        sprendimas: `$${visuma} - ${dalis} = ${visuma - dalis}$.`,
      }),
    () =>
      uzdavinys(T6, {
        klausimas: `Prekė kainavo ${visuma} Eur ir pabrango $${proc}\\%$. Kiek ji kainuoja dabar?`,
        atsakymas: String(visuma + dalis),
        atsakymasRodymui: `$${visuma + dalis}$ Eur`,
        sprendimas: `$${visuma} + ${dalis} = ${visuma + dalis}$.`,
      }),
    () =>
      uzdavinys(T6, {
        klausimas: `Skaičiaus $${proc}\\%$ yra ${dalis}. Koks tas skaičius?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `$${dalis} : ${proc} \\cdot 100 = ${visuma}$.`,
      }),
    () =>
      poruUzdavinys(naujasId(T6), T6, {
        klausimas: 'Sujunk procentus su atitinkama trupmena.',
        poros: [
          { kaire: '$50\\%$', desine: `$${tr(1, 2)}$` },
          { kaire: '$25\\%$', desine: `$${tr(1, 4)}$` },
          { kaire: '$20\\%$', desine: `$${tr(1, 5)}$` },
          { kaire: '$10\\%$', desine: `$${tr(1, 10)}$` },
        ],
        sprendimas: 'Procentai — tai šimtosios dalys.',
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Prekė pabrango $10\\%$, o paskui atpigo $10\\%$. Ar kaina grįžo į pradinę?`,
        variantai: [
          'ne, ji tapo mažesnė, nes antrą kartą procentai skaičiuoti nuo didesnės kainos',
          'taip',
          'ne, ji tapo didesnė',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Procentai visada skaičiuojami nuo tuometinės kainos.',
      }),
  ])
}

// ── 10.7. Laipsniai. Šaknys ─────────────────────────────────────────────────

const T7 = 'kartojimas-laipsniai'

const A7 = [
  {
    klausimas: 'Apskaičiuok: $2^5$.',
    atsakymas: '32',
    atsakymasRodymui: '$32$',
    sprendimas: '$2 \\cdot 2 \\cdot 2 \\cdot 2 \\cdot 2 = 32$.',
  },
] as const

export const kartojimasLaipsniai: Generatorius = () => suBandymais(kurk7, A7, T7)

function kurk7(): Uzdavinys | null {
  const a = atsitiktinis(2, 6)
  const m = atsitiktinis(2, 4)
  const n = atsitiktinis(2, 4)
  const kv = atsitiktinis(4, 20)

  return variacija([
    () =>
      uzdavinys(T7, {
        klausimas: `Apskaičiuok: $${a}^{${m}}$.`,
        atsakymas: String(a ** m),
        atsakymasRodymui: `$${a ** m}$`,
        sprendimas: `Dauginama ${m} vienodų daugiklių.`,
      }),
    () =>
      uzdavinys(T7, {
        klausimas: `Supaprastink: $${a}^{${m}} \\cdot ${a}^{${n}}$. Užrašyk laipsnio rodiklį.`,
        atsakymas: String(m + n),
        atsakymasRodymui: `$${a}^{${m + n}}$`,
        sprendimas: 'Dauginant tų pačių pagrindų laipsnius rodikliai sudedami.',
      }),
    () => {
      if (m <= n) return null
      return uzdavinys(T7, {
        klausimas: `Supaprastink: $${a}^{${m}} : ${a}^{${n}}$. Užrašyk laipsnio rodiklį.`,
        atsakymas: String(m - n),
        atsakymasRodymui: `$${a}^{${m - n}}$`,
        sprendimas: 'Dalijant rodikliai atimami.',
      })
    },
    () =>
      uzdavinys(T7, {
        klausimas: `Kam lygu $\\sqrt{${kv * kv}}$?`,
        atsakymas: String(kv),
        atsakymasRodymui: `$${kv}$`,
        sprendimas: `$${kv}^2 = ${kv * kv}$.`,
      }),
    () =>
      uzdavinys(T7, {
        klausimas: `Kam lygu $${a}^0$?`,
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Bet kurio skaičiaus, išskyrus nulį, nulinis laipsnis lygus 1.',
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Kam lygu $(-${a})^2$?`,
        variantai: [`$${a * a}$`, `$-${a * a}$`, `$${2 * a}$`, `$-${2 * a}$`],
        teisingas: 0,
        sprendimas: 'Lyginis neigiamo skaičiaus laipsnis teigiamas.',
      }),
    () =>
      uzdavinys(T7, {
        klausimas: `Kam lygu $\\sqrt[3]{${a ** 3}}$?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$${a}^3 = ${a ** 3}$.`,
      }),
  ])
}

// ── 10.8. Raidiniai reiškiniai ──────────────────────────────────────────────

const T8 = 'kartojimas-raidiniai'

const A8 = [
  {
    klausimas: 'Apskaičiuok reiškinio $3x + 2$ reikšmę, kai $x = 4$.',
    atsakymas: '14',
    atsakymasRodymui: '$14$',
    sprendimas: '$3 \\cdot 4 + 2 = 14$.',
  },
] as const

export const kartojimasRaidiniai: Generatorius = () => suBandymais(kurk8, A8, T8)

function kurk8(): Uzdavinys | null {
  const k = atsitiktinis(2, 9)
  const b = atsitiktinis(1, 12)
  const x = atsitiktinis(2, 9)

  return variacija([
    () =>
      uzdavinys(T8, {
        klausimas: `Apskaičiuok reiškinio $${narys(k)} + ${b}$ reikšmę, kai $x = ${x}$.`,
        atsakymas: String(k * x + b),
        atsakymasRodymui: `$${k * x + b}$`,
        sprendimas: `$${k} \\cdot ${x} + ${b} = ${k * x + b}$.`,
      }),
    () => {
      const c = atsitiktinis(1, k - 1)
      if (k <= 1) return null
      return uzdavinys(T8, {
        klausimas: `Sutrauk panašiuosius narius: $${narys(k)} + ${b} - ${narys(c)}$. Užrašyk koeficientą prieš $x$.`,
        atsakymas: String(k - c),
        atsakymasRodymui: `$${narys(k - c)} + ${b}$`,
        sprendimas: `$${k} - ${c} = ${k - c}$.`,
      })
    },
    () =>
      uzdavinys(T8, {
        klausimas: `Atskleisk skliaustus: $${k}(x + ${b})$. Užrašyk laisvąjį narį.`,
        atsakymas: String(k * b),
        atsakymasRodymui: `$${narys(k)} + ${k * b}$`,
        sprendimas: `$${k} \\cdot ${b} = ${k * b}$.`,
      }),
    () =>
      uzdavinys(T8, {
        klausimas: `Užrašyk reiškiniu: skaičiaus $x$ ${k} kartus padidintas dydis ir dar ${b}. Kokia bus reikšmė, kai $x = ${x}$?`,
        atsakymas: String(k * x + b),
        atsakymasRodymui: `$${k * x + b}$`,
        sprendimas: `Reiškinys $${narys(k)} + ${b}$; įrašius $x = ${x}$ gaunama $${k * x + b}$.`,
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kokie nariai vadinami panašiaisiais?',
        variantai: [
          'turintys tą pačią raidinę dalį',
          'turintys tą patį koeficientą',
          'visi nariai',
          'turintys skirtingas raides',
        ],
        teisingas: 0,
        sprendimas: 'Tik juos galima sutraukti.',
      }),
    () =>
      uzdavinys(T8, {
        klausimas: `Apskaičiuok reiškinio $x^2 - ${b}$ reikšmę, kai $x = ${x}$.`,
        atsakymas: String(x * x - b),
        atsakymasRodymui: `$${x * x - b}$`,
        sprendimas: `$${x}^2 - ${b} = ${x * x - b}$.`,
      }),
    () =>
      uzdavinys(T8, {
        klausimas: `Stačiakampio kraštinės $x$ ir $${k}$. Koks jo perimetras, kai $x = ${x}$?`,
        atsakymas: String(2 * (x + k)),
        atsakymasRodymui: `$${2 * (x + k)}$`,
        sprendimas: `$P = 2(x + ${k}) = 2 \\cdot ${x + k} = ${2 * (x + k)}$.`,
      }),
  ])
}

// ── 10.9. Lygtys, lygčių sistemos ───────────────────────────────────────────

const T9 = 'kartojimas-lygtys'

const A9 = [
  {
    klausimas: 'Išspręsk lygtį $3x + 2 = 14$.',
    atsakymas: '4',
    atsakymasRodymui: '$x = 4$',
    sprendimas: '$3x = 12$; $x = 4$.',
  },
] as const

export const kartojimasLygtys: Generatorius = () => suBandymais(kurk9, A9, T9)

function kurk9(): Uzdavinys | null {
  const k = atsitiktinis(2, 9)
  const x = atsitiktinis(-6, 9)
  const b = atsitiktinis(1, 15)
  const c = k * x + b
  const y = atsitiktinis(-4, 8)

  return variacija([
    () =>
      uzdavinys(T9, {
        klausimas: `Išspręsk lygtį $${narys(k)} + ${b} = ${c}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `$${narys(k)} = ${c - b}$; $x = ${x}$.`,
      }),
    () => {
      const k2 = atsitiktinis(1, k - 1)
      if (k <= 1) return null
      const c2 = k2 * x + b
      return uzdavinys(T9, {
        klausimas: `Išspręsk lygtį $${narys(k)} = ${narys(k2)}${c - c2 + b < 0 ? ` - ${c2 - c - b}` : ` + ${c - c2 + b}`}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Perkėlus: $${narys(k - k2)} = ${(k - k2) * x}$; $x = ${x}$.`,
      })
    },
    () =>
      uzdavinys(T9, {
        klausimas: `Išspręsk lygtį $${k}(x + ${b}) = ${k * (x + b)}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `$x + ${b} = ${x + b}$; $x = ${x}$.`,
      }),
    () =>
      uzdavinys(T9, {
        klausimas: `Sistemos $x + y = ${x + y}$ ir $x - y = ${x - y}$ sprendinio $x$ reikšmė?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Sudėjus lygtis: $2x = ${2 * x}$, tad $x = ${x}$.`,
      }),
    () =>
      uzdavinys(T9, {
        klausimas: `Sistemos $x + y = ${x + y}$ ir $x - y = ${x - y}$ sprendinio $y$ reikšmė?`,
        atsakymas: String(y),
        atsakymasRodymui: `$y = ${y}$`,
        sprendimas: `Atėmus lygtis: $2y = ${2 * y}$, tad $y = ${y}$.`,
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Ką galima daryti su lygtimi, kad jos sprendiniai nepakistų?',
        variantai: [
          'prie abiejų pusių pridėti tą patį skaičių arba abi puses padauginti iš skaičiaus, nelygaus nuliui',
          'pridėti skaičių tik prie vienos pusės',
          'abi puses padauginti iš nulio',
          'sukeisti ženklus tik kairėje',
        ],
        teisingas: 0,
        sprendimas: 'Kitaip lygtis taptų nelygiavertė.',
      }),
    () =>
      uzdavinys(T9, {
        klausimas: `Sugalvotas skaičius padaugintas iš ${k} ir gauta ${k * x}. Koks skaičius sugalvotas?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `$${k * x} : ${k} = ${x}$.`,
      }),
  ])
}

// ── 10.10. Nelygybės, nelygybių sistemos ────────────────────────────────────

const T10 = 'kartojimas-nelygybes'

const A10 = [
  {
    klausimas: 'Išspręsk nelygybę $x + 3 > 7$. Nuo kokio skaičiaus $x$ didesnis?',
    atsakymas: '4',
    atsakymasRodymui: '$x > 4$',
    sprendimas: '$x > 7 - 3$.',
  },
] as const

export const kartojimasNelygybes: Generatorius = () => suBandymais(kurk10, A10, T10)

function kurk10(): Uzdavinys | null {
  const k = atsitiktinis(2, 8)
  const x = atsitiktinis(-5, 9)
  const b = atsitiktinis(1, 12)

  return variacija([
    () =>
      uzdavinys(T10, {
        klausimas: `Išspręsk nelygybę $x + ${b} > ${x + b}$. Nuo kokio skaičiaus $x$ didesnis?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x > ${x}$`,
        sprendimas: `$x > ${x + b} - ${b}$.`,
      }),
    () =>
      uzdavinys(T10, {
        klausimas: `Išspręsk nelygybę $${narys(k)} \\le ${k * x}$. Kokia didžiausia $x$ reikšmė?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x \\le ${x}$`,
        sprendimas: `$${k * x} : ${k} = ${x}$.`,
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kas atsitinka nelygybės ženklui, kai abi pusės dauginamos iš neigiamo skaičiaus?',
        variantai: ['jis pasikeičia priešingu', 'jis nesikeičia', 'jis virsta lygybe', 'nelygybė išnyksta'],
        teisingas: 0,
        sprendimas: 'Neigiamas daugiklis apverčia skaičių tvarką.',
      }),
    () =>
      uzdavinys(T10, {
        klausimas: `Išspręsk nelygybę $-${narys(k)} > ${-k * x}$. Nuo kokio skaičiaus $x$ mažesnis?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x < ${x}$`,
        sprendimas: 'Dalijant iš neigiamo skaičiaus ženklas apsiverčia.',
      }),
    () =>
      uzdavinys(T10, {
        klausimas: `Kiek sveikųjų skaičių tenkina nelygybių sistemą $x > ${x}$ ir $x < ${x + k + 1}$?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `Tinka skaičiai nuo $${x + 1}$ iki $${x + k}$.`,
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Kaip skaičių tiesėje žymima nelygybės $x \\ge ${x}$ sprendinių aibė?`,
        variantai: [
          `užpildytu tašku ties $${x}$ ir spinduliu į dešinę`,
          `tuščiaviduriu tašku ties $${x}$ ir spinduliu į dešinę`,
          `užpildytu tašku ties $${x}$ ir spinduliu į kairę`,
          'visa tiese',
        ],
        teisingas: 0,
        sprendimas: 'Ženklas $\\ge$ reiškia, kad pats skaičius tinka.',
      }),
    () =>
      uzdavinys(T10, {
        klausimas: `Ar skaičius ${x + 1} yra nelygybės $x > ${x}$ sprendinys? Atsakyk „taip“ arba „ne“.`,
        atsakymas: 'taip',
        atsakymasRodymui: 'Taip',
        sprendimas: `$${x + 1} > ${x}$.`,
      }),
  ])
}

// ── 10.11. Kampai ───────────────────────────────────────────────────────────

const T11 = 'kartojimas-kampai'

const A11 = [
  {
    klausimas: 'Koks kampas gretutinis 70° kampui?',
    atsakymas: '110',
    atsakymasRodymui: '$110°$',
    sprendimas: '$180° - 70° = 110°$.',
  },
] as const

export const kartojimasKampai: Generatorius = () => suBandymais(kurk11, A11, T11)

function kurk11(): Uzdavinys | null {
  const a = atsitiktinis(20, 160)

  return variacija([
    () =>
      uzdavinys(T11, {
        klausimas: `Koks kampas gretutinis $${a}°$ kampui?`,
        atsakymas: String(180 - a),
        atsakymasRodymui: `$${180 - a}°$`,
        sprendimas: `$180° - ${a}° = ${180 - a}°$.`,
      }),
    () => {
      if (a >= 90) return null
      return uzdavinys(T11, {
        klausimas: `Kiek laipsnių turi kampas, papildantis $${a}°$ kampą iki stačiojo?`,
        atsakymas: String(90 - a),
        atsakymasRodymui: `$${90 - a}°$`,
        sprendimas: `$90° - ${a}° = ${90 - a}°$.`,
      })
    },
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Koks yra $${a}°$ kampas?`,
        variantai:
          a < 90
            ? ['smailusis', 'statusis', 'bukasis', 'ištiestinis']
            : ['bukasis', 'smailusis', 'statusis', 'ištiestinis'],
        teisingas: 0,
        sprendimas: 'Smailusis kampas mažesnis už 90°, bukasis — didesnis.',
      }),
    () =>
      uzdavinys(T11, {
        klausimas: `Kokie yra kryžminiai kampai, kai vienas iš jų $${a}°$?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}°$`,
        sprendimas: 'Kryžminiai kampai lygūs.',
      }),
    () =>
      uzdavinys(T11, {
        klausimas: `Dvi lygiagrečios tiesės perkirstos kirstine. Vienas iš vidaus priešinių kampų $${a}°$. Koks yra kitas?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}°$`,
        sprendimas: 'Vidaus priešiniai kampai lygūs.',
      }),
    () =>
      uzdavinys(T11, {
        klausimas: `Dvi lygiagrečios tiesės perkirstos kirstine. Vienas iš vidaus vienašalių kampų $${a}°$. Koks yra kitas?`,
        atsakymas: String(180 - a),
        atsakymasRodymui: `$${180 - a}°$`,
        sprendimas: 'Vidaus vienašalių kampų suma lygi $180°$.',
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kiek laipsnių turi ištiestinis kampas?',
        variantai: ['$180°$', '$90°$', '$360°$', '$45°$'],
        teisingas: 0,
        sprendimas: 'Jo kraštinės sudaro tiesę.',
      }),
  ])
}

// ── 10.12. Trikampiai ───────────────────────────────────────────────────────

const T12 = 'kartojimas-trikampiai'

const A12 = [
  {
    klausimas: 'Dviejų trikampio kampų dydžiai 50° ir 60°. Koks trečiasis kampas?',
    atsakymas: '70',
    atsakymasRodymui: '$70°$',
    sprendimas: '$180° - 50° - 60° = 70°$.',
  },
] as const

export const kartojimasTrikampiai: Generatorius = () => suBandymais(kurk12, A12, T12)

function kurk12(): Uzdavinys | null {
  const a = atsitiktinis(30, 80)
  const b = atsitiktinis(30, 80)
  if (a + b >= 175) return null
  const pagrindas = atsitiktinis(4, 14)
  const aukstine = atsitiktinis(2, 12)
  if ((pagrindas * aukstine) % 2 !== 0) return null

  return variacija([
    () =>
      uzdavinys(T12, {
        klausimas: `Dviejų trikampio kampų dydžiai $${a}°$ ir $${b}°$. Koks trečiasis kampas?`,
        atsakymas: String(180 - a - b),
        atsakymasRodymui: `$${180 - a - b}°$`,
        sprendimas: `$180° - ${a}° - ${b}° = ${180 - a - b}°$.`,
        brezinys: trikampisSuZymemis(sin(b), sin(180 - a - b), sin(a), {
          kampasA: `${a}°`,
          kampasB: `${b}°`,
          kampasC: '?',
        }),
      }),
    () =>
      uzdavinys(T12, {
        klausimas: `Trikampio pagrindas ${pagrindas} cm, aukštinė ${aukstine} cm. Koks jo plotas?`,
        atsakymas: String((pagrindas * aukstine) / 2),
        atsakymasRodymui: `$${(pagrindas * aukstine) / 2}$ cm²`,
        sprendimas: `$${pagrindas} \\cdot ${aukstine} : 2 = ${(pagrindas * aukstine) / 2}$.`,
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kam lygi trikampio kampų suma?',
        variantai: ['$180°$', '$360°$', '$90°$', 'priklauso nuo trikampio'],
        teisingas: 0,
        sprendimas: 'Ši savybė galioja visiems trikampiams.',
      }),
    () =>
      uzdavinys(T12, {
        klausimas: `Lygiašonio trikampio kampas prie viršūnės $${2 * a > 179 ? 40 : 180 - 2 * a}°$, o kampai prie pagrindo lygūs. Koks kampas prie pagrindo?`,
        atsakymas: String(2 * a > 179 ? 70 : a),
        atsakymasRodymui: `$${2 * a > 179 ? 70 : a}°$`,
        sprendimas: 'Likę $180°$ padalijami pusiau.',
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kada iš trijų atkarpų galima sudaryti trikampį?',
        variantai: [
          'kai dviejų trumpesniųjų suma didesnė už ilgiausią',
          'visada',
          'kai visos atkarpos lygios',
          'kai jos skirtingo ilgio',
        ],
        teisingas: 0,
        sprendimas: 'Tai trikampio nelygybė.',
      }),
    () =>
      uzdavinys(T12, {
        klausimas: `Stačiojo trikampio vienas smailusis kampas $${a > 80 ? 35 : a}°$. Koks kitas smailusis kampas?`,
        atsakymas: String(90 - (a > 80 ? 35 : a)),
        atsakymasRodymui: `$${90 - (a > 80 ? 35 : a)}°$`,
        sprendimas: 'Smailiųjų kampų suma stačiajame trikampyje lygi $90°$.',
      }),
    () =>
      poruUzdavinys(naujasId(T12), T12, {
        klausimas: 'Sujunk trikampio liniją su jos apibrėžimu.',
        poros: [
          { kaire: 'aukštinė', desine: 'statmuo iš viršūnės į priešingą kraštinę' },
          { kaire: 'pusiaukraštinė', desine: 'atkarpa iki priešingos kraštinės vidurio' },
          { kaire: 'pusiaukampinė', desine: 'dalija kampą pusiau' },
          { kaire: 'vidurio linija', desine: 'jungia dviejų kraštinių vidurio taškus' },
        ],
        sprendimas: 'Lygiašoniame trikampyje pirmosios trys gali sutapti.',
      }),
  ])
}

// ── 10.13. Keturkampiai. Daugiakampiai ──────────────────────────────────────

const T13 = 'kartojimas-keturkampiai'

const A13 = [
  {
    klausimas: 'Kam lygi keturkampio kampų suma?',
    atsakymas: '360',
    atsakymasRodymui: '$360°$',
    sprendimas: 'Keturkampis dalijamas įstrižaine į du trikampius.',
  },
] as const

export const kartojimasKeturkampiai: Generatorius = () => suBandymais(kurk13, A13, T13)

function kurk13(): Uzdavinys | null {
  const a = atsitiktinis(3, 15)
  const b = atsitiktinis(3, 15)
  const kampas = atsitiktinis(30, 150)
  const n = atsitiktinis(5, 10)

  return variacija([
    () =>
      uzdavinys(T13, {
        klausimas: 'Kam lygi keturkampio kampų suma?',
        atsakymas: '360',
        atsakymasRodymui: '$360°$',
        sprendimas: 'Įstrižainė dalija jį į du trikampius po $180°$.',
      }),
    () =>
      uzdavinys(T13, {
        klausimas: `Stačiakampio kraštinės ${a} cm ir ${b} cm. Koks jo plotas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ cm²`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$.`,
      }),
    () =>
      uzdavinys(T13, {
        klausimas: `Lygiagretainio vienas kampas $${kampas}°$. Koks yra gretimas kampas?`,
        atsakymas: String(180 - kampas),
        atsakymasRodymui: `$${180 - kampas}°$`,
        sprendimas: 'Gretimų lygiagretainio kampų suma lygi $180°$.',
      }),
    () =>
      uzdavinys(T13, {
        klausimas: `Lygiagretainio kraštinė ${a} cm, o į ją nubrėžta aukštinė ${b} cm. Koks plotas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ cm²`,
        sprendimas: `$S = a \\cdot h = ${a} \\cdot ${b} = ${a * b}$.`,
      }),
    () =>
      uzdavinys(T13, {
        klausimas: `Kam lygi ${n}-kampio kampų suma laipsniais?`,
        atsakymas: String((n - 2) * 180),
        atsakymasRodymui: `$${(n - 2) * 180}°$`,
        sprendimas: `$(${n} - 2) \\cdot 180° = ${(n - 2) * 180}°$.`,
      }),
    () =>
      poruUzdavinys(naujasId(T13), T13, {
        klausimas: 'Sujunk keturkampį su jo požymiu.',
        poros: [
          { kaire: 'kvadratas', desine: 'visos kraštinės lygios, visi kampai statūs' },
          { kaire: 'rombas', desine: 'visos kraštinės lygios' },
          { kaire: 'stačiakampis', desine: 'visi kampai statūs' },
          { kaire: 'trapecija', desine: 'tik dvi kraštinės lygiagrečios' },
        ],
        sprendimas: 'Kvadratas kartu yra ir rombas, ir stačiakampis.',
      }),
    () => {
      const c = atsitiktinis(3, 15)
      if ((a + c) % 2 !== 0) return null
      return uzdavinys(T13, {
        klausimas: `Trapecijos pagrindai ${a} cm ir ${c} cm, aukštinė ${b} cm. Koks jos plotas?`,
        atsakymas: String(((a + c) / 2) * b),
        atsakymasRodymui: `$${((a + c) / 2) * b}$ cm²`,
        sprendimas: `$S = \\dfrac{${a} + ${c}}{2} \\cdot ${b} = ${((a + c) / 2) * b}$.`,
      })
    },
  ])
}

// ── 10.14. Apskritimas. Skritulys ───────────────────────────────────────────

const T14 = 'kartojimas-apskritimas'

const A14 = [
  {
    klausimas: 'Apskritimo spindulys 5 cm. Koks skersmuo?',
    atsakymas: '10',
    atsakymasRodymui: '$10$ cm',
    sprendimas: '$5 \\cdot 2 = 10$.',
  },
] as const

export const kartojimasApskritimas: Generatorius = () => suBandymais(kurk14, A14, T14)

function kurk14(): Uzdavinys | null {
  const r = atsitiktinis(2, 15)

  return variacija([
    () =>
      uzdavinys(T14, {
        klausimas: `Apskritimo spindulys ${r} cm. Koks jo skersmuo?`,
        atsakymas: String(2 * r),
        atsakymasRodymui: `$${2 * r}$ cm`,
        sprendimas: `$${r} \\cdot 2 = ${2 * r}$.`,
        brezinys: apskritimas({ spindulys: `${r} cm` }),
      }),
    () =>
      uzdavinys(T14, {
        klausimas: `Apskritimo spindulys ${r} cm. Koks jo ilgis? Užrašyk koeficientą prieš $\\pi$.`,
        atsakymas: String(2 * r),
        atsakymasRodymui: `$${2 * r}\\pi$ cm`,
        sprendimas: `$C = 2\\pi r$; $2 \\cdot ${r} = ${2 * r}$.`,
      }),
    () =>
      uzdavinys(T14, {
        klausimas: `Skritulio spindulys ${r} cm. Koks jo plotas? Užrašyk koeficientą prieš $\\pi$.`,
        atsakymas: String(r * r),
        atsakymasRodymui: `$${r * r}\\pi$ cm²`,
        sprendimas: `$S = \\pi r^2$; $${r}^2 = ${r * r}$.`,
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kuo skiriasi apskritimas nuo skritulio?',
        variantai: [
          'apskritimas yra linija, o skritulys — ir jo vidus',
          'apskritimas didesnis',
          'skritulys yra linija',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Skritulys yra figūra, apribota apskritimo.',
      }),
    () =>
      uzdavinys(T14, {
        klausimas: `Apskritimo skersmuo ${2 * r} cm. Koks spindulys?`,
        atsakymas: String(r),
        atsakymasRodymui: `$${r}$ cm`,
        sprendimas: `$${2 * r} : 2 = ${r}$.`,
      }),
    () =>
      uzdavinys(T14, {
        klausimas: `Kiek laipsnių turi skritulio išpjova, kuri sudaro ketvirtadalį skritulio?`,
        atsakymas: '90',
        atsakymasRodymui: '$90°$',
        sprendimas: '$360° : 4 = 90°$.',
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kam apytiksliai lygu $\\pi$?',
        variantai: ['$3{,}14$', '$3{,}41$', '$2{,}14$', '$1{,}34$'],
        teisingas: 0,
        sprendimas: 'Tai apskritimo ilgio ir skersmens santykis.',
      }),
  ])
}

// ── 10.15. Vektoriai ────────────────────────────────────────────────────────

const T15 = 'kartojimas-vektoriai'

const A15 = [
  {
    klausimas: 'Sudėk vektorius $(2; 1)$ ir $(3; 4)$. Užrašyk pirmąją koordinatę.',
    atsakymas: '5',
    atsakymasRodymui: '$(5; 5)$',
    sprendimas: 'Koordinatės sudedamos atskirai.',
  },
] as const

export const kartojimasVektoriai: Generatorius = () => suBandymais(kurk15, A15, T15)

function kurk15(): Uzdavinys | null {
  const a = { x: atsitiktinis(1, 5), y: atsitiktinis(1, 4) }
  const b = { x: atsitiktinis(1, 4), y: atsitiktinis(1, 3) }
  const k = atsitiktinis(2, 5)

  return variacija([
    () =>
      uzdavinys(T15, {
        klausimas: `Sudėk vektorius $(${a.x}; ${a.y})$ ir $(${b.x}; ${b.y})$. Užrašyk pirmąją koordinatę.`,
        atsakymas: String(a.x + b.x),
        atsakymasRodymui: `$(${a.x + b.x}; ${a.y + b.y})$`,
        sprendimas: `$${a.x} + ${b.x} = ${a.x + b.x}$.`,
      }),
    () =>
      uzdavinys(T15, {
        klausimas: `Atimk: $(${a.x + b.x}; ${a.y + b.y}) - (${b.x}; ${b.y})$. Užrašyk antrąją koordinatę.`,
        atsakymas: String(a.y),
        atsakymasRodymui: `$${a.y}$`,
        sprendimas: `$${a.y + b.y} - ${b.y} = ${a.y}$.`,
      }),
    () =>
      uzdavinys(T15, {
        klausimas: `Padaugink vektorių $(${a.x}; ${a.y})$ iš ${k}. Užrašyk pirmąją koordinatę.`,
        atsakymas: String(k * a.x),
        atsakymasRodymui: `$(${k * a.x}; ${k * a.y})$`,
        sprendimas: `$${k} \\cdot ${a.x} = ${k * a.x}$.`,
      }),
    () =>
      uzdavinys(T15, {
        klausimas: `Taškai $A(${b.x}; ${b.y})$ ir $B(${b.x + a.x}; ${b.y + a.y})$. Kokia vektoriaus $\\vec{AB}$ pirmoji koordinatė?`,
        atsakymas: String(a.x),
        atsakymasRodymui: `$${a.x}$`,
        sprendimas: 'Iš pabaigos koordinačių atimamos pradžios koordinatės.',
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T15), T15, {
        klausimas: 'Kada du vektoriai lygūs?',
        variantai: [
          'kai sutampa jų koordinatės',
          'kai jie vienodo ilgio',
          'kai jie toje pačioje vietoje',
          'kai jų kryptys priešingos',
        ],
        teisingas: 0,
        sprendimas: 'Vieta plokštumoje reikšmės neturi.',
        brezinys: vektoriaiTinklelyje([
          { v: { x: a.x, y: a.y, vardas: 'a' }, pradzia: { x: 0, y: 1 } },
          { v: { x: a.x, y: a.y, vardas: 'b' }, pradzia: { x: 5, y: 4 } },
        ]),
      }),
    () =>
      uzdavinys(T15, {
        klausimas: 'Koks yra vektoriaus $(6; 8)$ ilgis?',
        atsakymas: '10',
        atsakymasRodymui: '$10$',
        sprendimas: '$\\sqrt{36 + 64} = \\sqrt{100} = 10$.',
      }),
    () =>
      uzdavinys(T15, {
        klausimas: `Kam lygi vektorių $(${a.x}; ${a.y})$ ir $(-${a.x}; -${a.y})$ suma? Užrašyk pirmąją koordinatę.`,
        atsakymas: '0',
        atsakymasRodymui: '$(0; 0)$',
        sprendimas: 'Priešingų vektorių suma yra nulinis vektorius.',
      }),
  ])
}

// ── 10.16. Simetrija. Posūkis. Postūmis ─────────────────────────────────────

const T16 = 'kartojimas-simetrija'

const A16 = [
  {
    klausimas: 'Kokios koordinatės bus taško $(3; 2)$, atspindėjus jį per $x$ ašį?',
    atsakymas: '-2',
    atsakymasRodymui: '$(3; -2)$',
    sprendimas: 'Ordinatė keičia ženklą.',
  },
] as const

export const kartojimasSimetrija: Generatorius = () => suBandymais(kurk16, A16, T16)

function kurk16(): Uzdavinys | null {
  const x = atsitiktinis(1, 5)
  const y = atsitiktinis(1, 5)
  const dx = atsitiktinis(1, 4)

  return variacija([
    () =>
      uzdavinys(T16, {
        klausimas: `Taškas $A(${x}; ${y})$ atspindimas per $x$ ašį. Kokia bus gauto taško ordinatė?`,
        atsakymas: String(-y),
        atsakymasRodymui: `$(${x}; ${-y})$`,
        sprendimas: 'Simetrijos per $x$ ašį metu ordinatė keičia ženklą.',
        brezinys: koordinaciuPlokstuma([
          { x, y, raide: 'A' },
          { x, y: -y, raide: 'A₁' },
        ]),
      }),
    () =>
      uzdavinys(T16, {
        klausimas: `Taškas $A(${x}; ${y})$ atspindimas per $y$ ašį. Kokia bus gauto taško abscisė?`,
        atsakymas: String(-x),
        atsakymasRodymui: `$(${-x}; ${y})$`,
        sprendimas: 'Simetrijos per $y$ ašį metu abscisė keičia ženklą.',
      }),
    () =>
      uzdavinys(T16, {
        klausimas: `Taškas $A(${x}; ${y})$ pastumiamas ${dx} vienetais į dešinę. Kokia bus gauto taško abscisė?`,
        atsakymas: String(x + dx),
        atsakymasRodymui: `$(${x + dx}; ${y})$`,
        sprendimas: `$${x} + ${dx} = ${x + dx}$.`,
      }),
    () =>
      uzdavinys(T16, {
        klausimas: `Taškas $A(${x}; ${y})$ pasukamas $180°$ apie koordinačių pradžią. Kokia bus gauto taško abscisė?`,
        atsakymas: String(-x),
        atsakymasRodymui: `$(${-x}; ${-y})$`,
        sprendimas: 'Posūkio $180°$ metu abi koordinatės keičia ženklą.',
      }),
    () =>
      uzdavinys(T16, {
        klausimas: 'Kiek simetrijos ašių turi kvadratas?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'Dvi per kraštinių vidurius ir dvi įstrižainės.',
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T16), T16, {
        klausimas: 'Kas nesikeičia atliekant simetriją, posūkį ar postūmį?',
        variantai: [
          'figūros dydis ir forma',
          'tik figūros padėtis',
          'kraštinių ilgiai kinta',
          'kampų dydžiai kinta',
        ],
        teisingas: 0,
        sprendimas: 'Visos trys transformacijos duoda lygias figūras.',
      }),
    () =>
      uzdavinys(T16, {
        klausimas: 'Kiek simetrijos ašių turi lygiakraštis trikampis?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Po vieną iš kiekvienos viršūnės.',
      }),
  ])
}

// ── 10.17. Erdviniai kūnai ──────────────────────────────────────────────────

const T17 = 'kartojimas-kunai'

const A17 = [
  {
    klausimas: 'Kubo briauna 3 cm. Koks jo tūris?',
    atsakymas: '27',
    atsakymasRodymui: '$27$ cm³',
    sprendimas: '$3^3 = 27$.',
  },
] as const

export const kartojimasKunai: Generatorius = () => suBandymais(kurk17, A17, T17)

function kurk17(): Uzdavinys | null {
  const a = atsitiktinis(2, 12)
  const b = atsitiktinis(2, 12)
  const c = atsitiktinis(2, 12)

  return variacija([
    () =>
      uzdavinys(T17, {
        klausimas: `Kubo briauna ${a} cm. Koks jo tūris?`,
        atsakymas: String(a ** 3),
        atsakymasRodymui: `$${a ** 3}$ cm³`,
        sprendimas: `$${a}^3 = ${a ** 3}$.`,
      }),
    () =>
      uzdavinys(T17, {
        klausimas: `Stačiakampio gretasienio matmenys ${a} cm, ${b} cm ir ${c} cm. Koks jo tūris?`,
        atsakymas: String(a * b * c),
        atsakymasRodymui: `$${a * b * c}$ cm³`,
        sprendimas: `$${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$.`,
      }),
    () =>
      uzdavinys(T17, {
        klausimas: `Kubo briauna ${a} cm. Koks jo pilnutinio paviršiaus plotas?`,
        atsakymas: String(6 * a * a),
        atsakymasRodymui: `$${6 * a * a}$ cm²`,
        sprendimas: `Šešios sienos po $${a * a}$ cm²: $6 \\cdot ${a * a} = ${6 * a * a}$.`,
      }),
    () =>
      uzdavinys(T17, {
        klausimas: 'Kiek briaunų turi kubas?',
        atsakymas: '12',
        atsakymasRodymui: '$12$',
        sprendimas: 'Po keturias viršuje, apačioje ir šonuose.',
      }),
    () =>
      poruUzdavinys(naujasId(T17), T17, {
        klausimas: 'Sujunk kūną su jo pagrindu ar savybe.',
        poros: [
          { kaire: 'ritinys', desine: 'du apskritimo formos pagrindai' },
          { kaire: 'kūgis', desine: 'vienas pagrindas ir viršūnė' },
          { kaire: 'prizmė', desine: 'du vienodi daugiakampiai pagrindai' },
          { kaire: 'piramidė', desine: 'vienas daugiakampis pagrindas ir viršūnė' },
        ],
        sprendimas: 'Rutulys pagrindų neturi visai.',
      }),
    () =>
      uzdavinys(T17, {
        klausimas: `Stačiosios prizmės pagrindo plotas ${a * b} cm², aukštinė ${c} cm. Koks tūris?`,
        atsakymas: String(a * b * c),
        atsakymasRodymui: `$${a * b * c}$ cm³`,
        sprendimas: `$${a * b} \\cdot ${c} = ${a * b * c}$.`,
      }),
    () =>
      uzdavinys(T17, {
        klausimas: 'Kiek sienų turi trikampė prizmė?',
        atsakymas: '5',
        atsakymasRodymui: '$5$',
        sprendimas: 'Du pagrindai ir trys šoninės sienos.',
      }),
  ])
}

// ── 10.18. Rinkinių skaičius. Statistika ────────────────────────────────────

const T18 = 'kartojimas-statistika'

const A18 = [
  {
    klausimas: 'Kiek skirtingų porų galima sudaryti iš 3 marškinėlių ir 4 kelnių?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '$3 \\cdot 4 = 12$.',
  },
] as const

export const kartojimasStatistika: Generatorius = () => suBandymais(kurk18, A18, T18)

function kurk18(): Uzdavinys | null {
  const a = atsitiktinis(2, 6)
  const b = atsitiktinis(2, 6)
  const sk = [atsitiktinis(1, 20), atsitiktinis(1, 20), atsitiktinis(1, 20), atsitiktinis(1, 20), atsitiktinis(1, 20)]
  const suma = sk.reduce((s, x) => s + x, 0)
  if (suma % 5 !== 0) return null
  const rikiuoti = [...sk].sort((x, y) => x - y)

  return variacija([
    () =>
      uzdavinys(T18, {
        klausimas: `Kiek skirtingų rinkinių galima sudaryti iš ${a} marškinėlių ir ${b} kelnių?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$.`,
        brezinys: galimybiuMedis(
          Array.from({ length: a }, (_, i) => `M${i + 1}`),
          Array.from({ length: b }, (_, i) => `K${i + 1}`),
        ),
      }),
    () =>
      uzdavinys(T18, {
        klausimas: `Apskaičiuok skaičių $${sk.join('; ')}$ vidurkį.`,
        atsakymas: String(suma / 5),
        atsakymasRodymui: `$${suma / 5}$`,
        sprendimas: `$${suma} : 5 = ${suma / 5}$.`,
      }),
    () =>
      uzdavinys(T18, {
        klausimas: `Rask skaičių $${sk.join('; ')}$ medianą.`,
        atsakymas: String(rikiuoti[2]),
        atsakymasRodymui: `$${rikiuoti[2]}$`,
        sprendimas: `Surikiavus: $${rikiuoti.join('; ')}$; vidurinis — $${rikiuoti[2]}$.`,
      }),
    () =>
      uzdavinys(T18, {
        klausimas: `Koks yra skaičių $${sk.join('; ')}$ plotis?`,
        atsakymas: String(rikiuoti[4] - rikiuoti[0]),
        atsakymasRodymui: `$${rikiuoti[4] - rikiuoti[0]}$`,
        sprendimas: `$${rikiuoti[4]} - ${rikiuoti[0]} = ${rikiuoti[4] - rikiuoti[0]}$.`,
      }),
    () =>
      uzdavinys(T18, {
        klausimas: 'Kiek skirtingų trijų raidžių eilių galima sudaryti iš raidžių A, B ir C, kai raidės nesikartoja?',
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: '$3 \\cdot 2 \\cdot 1 = 6$.',
      }),
    () => {
      const vardai = ['A', 'B', 'C', 'D']
      const kiek = vardai.map(() => atsitiktinis(2, 12))
      const didziausias = kiek.indexOf(Math.max(...kiek))
      return uzdavinys(T18, {
        klausimas: 'Kuris variantas diagramoje surinko daugiausia balsų?',
        atsakymas: vardai[didziausias],
        atsakymasRodymui: `$${vardai[didziausias]}$`,
        sprendimas: `Jo stulpelis aukščiausias — $${kiek[didziausias]}$.`,
        brezinys: stulpelineDiagrama(vardai.map((v, i) => ({ vardas: v, kiek: kiek[i] }))),
      })
    },
    () =>
      pasirinkimoUzdavinys(naujasId(T18), T18, {
        klausimas: 'Kada vietoj vidurkio geriau naudoti medianą?',
        variantai: [
          'kai imtyje yra labai išsiskiriančių reikšmių',
          'kai visos reikšmės vienodos',
          'kai duomenų mažai',
          'niekada',
        ],
        teisingas: 0,
        sprendimas: 'Viena labai didelė reikšmė vidurkį iškreipia, o medianos beveik nekeičia.',
      }),
  ])
}

// ── 10.19. Tikimybės ────────────────────────────────────────────────────────

const T19 = 'kartojimas-tikimybes'

const A19 = [
  {
    klausimas: 'Kokia tikimybė, kad metus monetą iškris herbas? Užrašyk procentais.',
    atsakymas: '50',
    atsakymasRodymui: '$50\\%$',
    sprendimas: 'Iš dviejų vienodai galimų baigčių tinka viena.',
  },
] as const

export const kartojimasTikimybes: Generatorius = () => suBandymais(kurk19, A19, T19)

function kurk19(): Uzdavinys | null {
  const raudonu = atsitiktinis(2, 10)
  const melynu = atsitiktinis(2, 10)
  const viso = raudonu + melynu
  if (1000 % viso !== 0 && viso > 20) return null

  return variacija([
    () =>
      uzdavinys(T19, {
        klausimas: `Dėžėje ${raudonu} raudonų ir ${melynu} mėlynų rutuliukų. Kokia tikimybė ištraukti raudoną? Užrašyk trupmenos skaitiklį, kai vardiklis yra ${viso}.`,
        atsakymas: String(raudonu),
        atsakymasRodymui: `$${tr(raudonu, viso)}$`,
        sprendimas: `Palankių baigčių $${raudonu}$, visų — $${viso}$.`,
      }),
    () =>
      uzdavinys(T19, {
        klausimas: 'Kokia tikimybė, kad metus lošimo kauliuką iškris šešetas? Užrašyk trupmenos vardiklį.',
        atsakymas: '6',
        atsakymasRodymui: `$${tr(1, 6)}$`,
        sprendimas: 'Iš šešių vienodai galimų baigčių tinka viena.',
      }),
    () =>
      uzdavinys(T19, {
        klausimas: 'Kokia tikimybė, kad metus lošimo kauliuką iškris lyginis skaičius? Užrašyk atsakymą procentais.',
        atsakymas: '50',
        atsakymasRodymui: '$50\\%$',
        sprendimas: 'Tinka 2, 4 ir 6 — trys baigtys iš šešių.',
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T19), T19, {
        klausimas: 'Kokia yra būtinojo įvykio tikimybė?',
        variantai: ['$1$', '$0$', `$${tr(1, 2)}$`, 'priklauso nuo bandymo'],
        teisingas: 0,
        sprendimas: 'Būtinasis įvykis įvyksta visada.',
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T19), T19, {
        klausimas: 'Kokia yra negalimojo įvykio tikimybė?',
        variantai: ['$0$', '$1$', `$${tr(1, 2)}$`, 'neigiama'],
        teisingas: 0,
        sprendimas: 'Palankių baigčių nėra.',
      }),
    () =>
      uzdavinys(T19, {
        klausimas: `Dėžėje ${raudonu} raudonų ir ${melynu} mėlynų rutuliukų. Kiek iš viso yra vienodai galimų baigčių traukiant vieną rutuliuką?`,
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${raudonu} + ${melynu} = ${viso}$.`,
      }),
    () =>
      pasirinkimoUzdavinys(naujasId(T19), T19, {
        klausimas: 'Kaip skaičiuojama įvykio tikimybė?',
        variantai: [
          'palankių baigčių skaičius dalijamas iš visų vienodai galimų baigčių skaičiaus',
          'palankios baigtys dauginamos iš visų',
          'iš visų baigčių atimamos palankios',
          'sudedamos visos baigtys',
        ],
        teisingas: 0,
        sprendimas: 'Todėl tikimybė visada yra nuo 0 iki 1.',
      }),
  ])
}
