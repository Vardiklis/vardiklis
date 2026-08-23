import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys } from './formatai'
import { dalybaKampu } from './pirmoku-vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 2 klasės tema „Daugyba ir dalyba“ (antrasis pusmetis).
 *
 * Visos vienuolika potemių rėmėsi 6 klasės `sveikieji`, 5–6 klasės
 * `veiksmu-tvarka` arba trupmenų `dalies-radimas` generatoriais. Antrokui čia
 * reikia daugybos lentelės iki 9, dalybos kampu, veiksmų tvarkos be laipsnių
 * ir dalies bei visumos ryšio.
 *
 * Žodynas tas pats kaip pirmojo pusmečio temose: **daugiklis · daugiklis =
 * sandauga**, **dalinys : daliklis = dalmuo**.
 */

const VARDAI = ['Matas', 'Ieva', 'Emilis', 'Luknė', 'Greta', 'Tauras'] as const

function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 100, 100)
}

/** Daugybos ir dalybos veiksmai taip, kaip rašo vadovėlis. */
const sandauga = (a: number, b: number) => `$${a} \\cdot ${b}$`
const daugybosLygybe = (a: number, b: number) => `$${a} \\cdot ${b} = ${a * b}$`
const dalyba = (a: number, b: number) => `$${a} : ${b}$`
const dalybosLygybe = (a: number, b: number) => `$${a} : ${b} = ${a / b}$`

/** Dalijami daiktai su galininku — „padalyk 48 saldainius“. */
const DAIKTAI = [
  { gal: { vns: 'saldainį', dgs: 'saldainius', kilm: 'saldainių' }, k: 'saldainių' },
  { gal: { vns: 'kortelę', dgs: 'korteles', kilm: 'kortelių' }, k: 'kortelių' },
  { gal: { vns: 'obuolį', dgs: 'obuolius', kilm: 'obuolių' }, k: 'obuolių' },
  { gal: { vns: 'karoliuką', dgs: 'karoliukus', kilm: 'karoliukų' }, k: 'karoliukų' },
] as const

const VAIKAI = { vns: 'vaikui', dgs: 'vaikams', kilm: 'vaikų' }

// ── Daugyba ir dalyba iš 6, 7, 8 ir 9 ───────────────────────────────────────

/**
 * Bendras generatorius potemėms „iš 6“, „iš 7“ ir „iš 8 ir 9“.
 *
 * Šiose potemėse daugyba ir dalyba mokomos kartu — būtent todėl, kad viena
 * tikrina kitą. Todėl kiekvienas pavidalas turi ir sandaugą, ir dalmenį.
 */
function poraIs(dalikliai: readonly number[], temaId: string) {
  return (sritis?: Sritis | null): Uzdavinys | null => {
    const maks = riba(sritis)
    const d = pasirink(dalikliai)
    const kitas = atsitiktinis(2, Math.min(10, Math.floor(maks / d)))
    const sand = d * kitas
    const daiktas = pasirink(DAIKTAI)

    return variacija([
      // 1. Daugyba
      () =>
        uzdavinys(temaId, {
          klausimas: `Apskaičiuok: ${sandauga(d, kitas)}`,
          atsakymas: String(sand),
          atsakymasRodymui: `$${sand}$`,
          sprendimas: `${d} kartus po ${kitas} yra ${sand}.`,
        }),

      // 2. Dalyba
      () =>
        uzdavinys(temaId, {
          klausimas: `Apskaičiuok: ${dalyba(sand, d)}`,
          atsakymas: String(kitas),
          atsakymasRodymui: `$${kitas}$`,
          sprendimas: `${kitas} kartus po ${d} yra ${sand}, tad ${dalybosLygybe(sand, d)}.`,
        }),

      // 3. Nežinomas daugiklis
      () =>
        uzdavinys(temaId, {
          klausimas: `Užbaik: $${d} \\cdot \\square = ${sand}$`,
          atsakymas: String(kitas),
          atsakymasRodymui: `$${kitas}$`,
          sprendimas: `Ieškome, kiek kartų po ${d} sudaro ${sand}: ${dalybosLygybe(sand, d)}.`,
        }),

      // 4. Tekstinis dalybos uždavinys
      () =>
        uzdavinys(temaId, {
          klausimas: `Padalyk ${sand} ${derink(sand, daiktas.gal)} po lygiai ${d} ${derink(d, VAIKAI)}. Kiek gaus kiekvienas?`,
          atsakymas: String(kitas),
          atsakymasRodymui: `$${kitas}$`,
          sprendimas: `${dalybosLygybe(sand, d)}.`,
        }),

      // 5. Patikrinimas daugyba
      () =>
        uzdavinys(temaId, {
          klausimas: `Apskaičiavai ${dalybosLygybe(sand, d)}. Kiek gausi patikrindamas: ${sandauga(kitas, d)}?`,
          atsakymas: String(sand),
          atsakymasRodymui: `$${sand}$`,
          sprendimas: `Patikrinimas turi grąžinti dalinį: ${daugybosLygybe(kitas, d)}.`,
        }),

      // 6. Pasirinkimas
      () => {
        const netiesos = [...new Set([sand - d, sand + d, sand + 1])].filter(
          (x) => x > 0 && x !== sand && x <= maks,
        )
        if (netiesos.length < 2) return null
        return pasirinkimoUzdavinys(naujasId(temaId), temaId, {
          klausimas: `Pasirink teisingą atsakymą: ${sandauga(kitas, d)}`,
          variantai: [String(sand), ...netiesos.slice(0, 2).map(String)],
          teisingas: 0,
          sprendimas: `${daugybosLygybe(kitas, d)}.`,
        })
      },
    ])
  }
}

const A_PORA = [
  {
    klausimas: 'Apskaičiuok: $6 \\cdot 7$',
    atsakymas: '42',
    atsakymasRodymui: '$42$',
    sprendimas: '6 kartus po 7 yra 42.',
  },
] as const

export const daugybaDalybaIs6: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => poraIs([6], 'daugyba-dalyba-is-6')(sritis), A_PORA, 'daugyba-dalyba-is-6')

export const daugybaDalybaIs7: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => poraIs([7], 'daugyba-dalyba-is-7')(sritis), A_PORA, 'daugyba-dalyba-is-7')

export const daugybaDalybaIs8Ir9: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(
    () => poraIs([8, 9], 'daugyba-dalyba-is-8-ir-9')(sritis),
    A_PORA,
    'daugyba-dalyba-is-8-ir-9',
  )

// ── Kaip parašyti ir atlikti dalybos veiksmą kampu? ─────────────────────────

const A_KAMPU = [
  {
    klausimas: 'Atlik dalybą kampu. Koks dalmuo?',
    atsakymas: '9',
    atsakymasRodymui: '$9$',
    sprendimas: '$36 : 4 = 9$.',
  },
] as const

export const dalybaKampuUzd: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkKampu(sritis), A_KAMPU, 'dalyba-kampu')

function kurkKampu(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const daliklis = atsitiktinis(3, 9)
  const dalmuo = atsitiktinis(3, Math.min(9, Math.floor(maks / daliklis)))
  const dalinys = daliklis * dalmuo

  return variacija([
    // 1. Koks dalmuo
    () =>
      uzdavinys('dalyba-kampu', {
        klausimas: 'Atlik dalybą kampu. Koks dalmuo?',
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `${dalmuo} kartus po ${daliklis} yra ${dalinys}, tad ${dalybosLygybe(dalinys, daliklis)}.`,
        brezinys: dalybaKampu(dalinys, daliklis),
      }),

    // 2. Koks skaičius rašomas po daliniu
    () =>
      uzdavinys('dalyba-kampu', {
        klausimas: `Dalijant ${dalinys} iš ${daliklis} kampu, koks skaičius rašomas po daliniu?`,
        atsakymas: String(dalinys),
        atsakymasRodymui: `$${dalinys}$`,
        sprendimas: `Po daliniu rašoma sandauga ${sandauga(daliklis, dalmuo)}, o ji lygi ${dalinys} — visas dalinys panaudojamas be liekanos.`,
        brezinys: dalybaKampu(dalinys, daliklis, dalmuo),
      }),

    // 3. Kur rašomas daliklis
    () =>
      pasirinkimoUzdavinys(naujasId('dalyba-kampu'), 'dalyba-kampu', {
        klausimas: 'Kur kampu užrašytoje dalyboje rašomas daliklis?',
        variantai: ['dešinėje, už vertikalaus brūkšnio', 'kairėje, prieš brūkšnį', 'po dalmeniu'],
        teisingas: 0,
        sprendimas: 'Kairėje rašomas dalinys, dešinėje už brūkšnio — daliklis, o po juo — dalmuo.',
        brezinys: dalybaKampu(dalinys, daliklis, dalmuo),
      }),

    // 4. Kokia liekana
    () =>
      uzdavinys('dalyba-kampu', {
        klausimas: 'Kokia liekana lieka atlikus šią dalybą kampu?',
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: `${dalinys} dalijasi iš ${daliklis} be liekanos, tad apačioje lieka 0.`,
        brezinys: dalybaKampu(dalinys, daliklis, dalmuo),
      }),

    // 5. Kuris atsakymas teisingas
    () => {
      const netiesos = [...new Set([dalmuo + 1, dalmuo - 1])].filter((x) => x > 0 && x !== dalmuo)
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('dalyba-kampu'), 'dalyba-kampu', {
        klausimas: `Pasirink teisingą kampu atliekamo veiksmo ${dalinys} : ${daliklis} atsakymą.`,
        variantai: [String(dalmuo), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `${dalybosLygybe(dalinys, daliklis)}.`,
        brezinys: dalybaKampu(dalinys, daliklis),
      })
    },
  ])
}

// ── Kaip rasti aštuntadalį? ─────────────────────────────────────────────────

const A_ASTUNTADALIS = [
  {
    klausimas: 'Rask aštuntadalį skaičiaus 24.',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Aštuntadalis yra viena dalis iš aštuonių: $24 : 8 = 3$.',
  },
] as const

export const astuntadalis: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkAstuntadali(sritis), A_ASTUNTADALIS, 'astuntadalis')

function kurkAstuntadali(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const dalis = atsitiktinis(2, Math.min(12, Math.floor(maks / 8)))
  const visuma = dalis * 8
  const d = pasirink(DAIKTAI)

  return variacija([
    // 1. Rask aštuntadalį
    () =>
      uzdavinys('astuntadalis', {
        klausimas: `Rask aštuntadalį skaičiaus ${visuma}.`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `Aštuntadalis yra viena dalis iš aštuonių: ${dalybosLygybe(visuma, 8)}.`,
      }),

    // 2. Padalyta į aštuonias dalis
    () =>
      uzdavinys('astuntadalis', {
        klausimas: `${visuma} ${derink(visuma, d.gal)} padalyta į 8 lygias dalis. Kiek ${d.k} yra vienoje dalyje?`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `${dalybosLygybe(visuma, 8)}.`,
      }),

    // 3. Pasirinkimas
    () => {
      const netiesos = [...new Set([dalis * 2, dalis + 1])].filter((x) => x > 0 && x !== dalis)
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('astuntadalis'), 'astuntadalis', {
        klausimas: `Pasirink skaičiaus ${visuma} aštuntadalį.`,
        variantai: [String(dalis), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `${dalybosLygybe(visuma, 8)}.`,
      })
    },

    // 4. Kuriuo veiksmu randamas
    () =>
      pasirinkimoUzdavinys(naujasId('astuntadalis'), 'astuntadalis', {
        klausimas: 'Kuriuo veiksmu randamas skaičiaus aštuntadalis?',
        variantai: ['dalijant iš 8', 'dauginant iš 8', 'atimant 8'],
        teisingas: 0,
        sprendimas: 'Aštuntadalis yra viena iš aštuonių lygių dalių, tad skaičius dalijamas iš 8.',
      }),

    // 5. Kuri dalis mažesnė
    () =>
      pasirinkimoUzdavinys(naujasId('astuntadalis'), 'astuntadalis', {
        klausimas: 'Kuri to paties skaičiaus dalis mažesnė — ketvirtadalis ar aštuntadalis?',
        variantai: ['aštuntadalis', 'ketvirtadalis', 'abi vienodos'],
        teisingas: 0,
        sprendimas: 'Kuo į daugiau dalių dalijame, tuo kiekviena dalis mažesnė.',
      }),
  ])
}

// ── Kiek kartų daugiau? Kiek kartų mažiau? ──────────────────────────────────

const A_KIEK_KARTU = [
  {
    klausimas: '12 yra kiek kartų daugiau už 3?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: '$12 : 3 = 4$.',
  },
] as const

export const kiekKartu: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkKiekKartu(sritis), A_KIEK_KARTU, 'kiek-kartu')

function kurkKiekKartu(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const mazas = atsitiktinis(2, 9)
  const kartai = atsitiktinis(2, Math.min(9, Math.floor(maks / mazas)))
  const didelis = mazas * kartai
  if (kartai < 2) return null
  const [v, v2] = sumaisyk([...VARDAI]).slice(0, 2)
  const d = pasirink(DAIKTAI)

  return variacija([
    // 1. Kiek kartų daugiau
    () =>
      uzdavinys('kiek-kartu', {
        klausimas: `${didelis} yra kiek kartų daugiau už ${mazas}?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: `${dalybosLygybe(didelis, mazas)}.`,
      }),

    // 2. Kiek kartų mažiau
    () =>
      uzdavinys('kiek-kartu', {
        klausimas: `${mazas} yra kiek kartų mažiau už ${didelis}?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: `${dalybosLygybe(didelis, mazas)}.`,
      }),

    // 3. Tekstinis — kiek kartų daugiau
    () =>
      uzdavinys('kiek-kartu', {
        klausimas: `${v} turi ${didelis} ${d.k}, o ${v2} — ${mazas}. Kiek kartų ${v} turi daugiau?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: `Lyginant „kiek kartų“ dalijame: ${dalybosLygybe(didelis, mazas)}.`,
      }),

    // 4. Tekstinis — kiek kartų mažiau
    () =>
      uzdavinys('kiek-kartu', {
        klausimas: `Vienoje dėžėje ${didelis} ${d.k}, kitoje — ${mazas}. Kiek kartų antroje dėžėje mažiau?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: `${dalybosLygybe(didelis, mazas)}.`,
      }),

    // 5. Kuo skiriasi „kartų“ ir „vienetų“
    () =>
      pasirinkimoUzdavinys(naujasId('kiek-kartu'), 'kiek-kartu', {
        klausimas: `Kuriuo veiksmu sužinosi, kiek kartų ${didelis} didesnis už ${mazas}?`,
        variantai: [
          `$${didelis} : ${mazas}$`,
          `$${didelis} - ${mazas}$`,
          `$${didelis} + ${mazas}$`,
        ],
        teisingas: 0,
        sprendimas: `„Kiek kartų“ randama dalyba, o „keliais vienetais“ — atimtimi ($${didelis} - ${mazas} = ${didelis - mazas}$).`,
      }),

    // 6. Keliais vienetais daugiau
    () =>
      uzdavinys('kiek-kartu', {
        klausimas: `Keliais vienetais ${didelis} didesnis už ${mazas}?`,
        atsakymas: String(didelis - mazas),
        atsakymasRodymui: `$${didelis - mazas}$`,
        sprendimas: `„Keliais vienetais“ randama atimtimi: $${didelis} - ${mazas} = ${didelis - mazas}$.`,
      }),
  ])
}

// ── Kaip dalyti 0? Kaip dalyti iš 1 ir 10? ──────────────────────────────────

const A_NULIS = [
  {
    klausimas: 'Apskaičiuok: $0 : 5$',
    atsakymas: '0',
    atsakymasRodymui: '$0$',
    sprendimas: 'Nulį padalijus į bet kiek dalių kiekvienoje lieka 0.',
  },
] as const

export const dalybaSuNuliu: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkNuli(sritis), A_NULIS, 'dalyba-su-nuliu')

function kurkNuli(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const n = atsitiktinis(2, 9)
  const desimtimis = atsitiktinis(2, Math.min(10, Math.floor(maks / 10)))

  return variacija([
    // 1. Nulio dalyba
    () =>
      uzdavinys('dalyba-su-nuliu', {
        klausimas: `Apskaičiuok: ${dalyba(0, n)}`,
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: `Nieko padalijus į ${n} dalis kiekvienoje lieka 0.`,
      }),

    // 2. Dalyba iš vieneto
    () =>
      uzdavinys('dalyba-su-nuliu', {
        klausimas: `Apskaičiuok: ${dalyba(n, 1)}`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `Padalijus į vieną dalį visas kiekis ir lieka: ${dalybosLygybe(n, 1)}.`,
      }),

    // 3. Dalyba iš dešimties
    () =>
      uzdavinys('dalyba-su-nuliu', {
        klausimas: `Apskaičiuok: ${dalyba(desimtimis * 10, 10)}`,
        atsakymas: String(desimtimis),
        atsakymasRodymui: `$${desimtimis}$`,
        sprendimas: `${desimtimis * 10} yra ${desimtimis} ${derink(desimtimis, { vns: 'dešimtis', dgs: 'dešimtys', kilm: 'dešimčių' })}, tad dalmuo ${desimtimis}.`,
      }),

    // 4. Taisyklė apie nulį
    () =>
      pasirinkimoUzdavinys(naujasId('dalyba-su-nuliu'), 'dalyba-su-nuliu', {
        klausimas: `Kiek yra $0 : ${n}$?`,
        variantai: ['0', String(n), 'dalyti negalima'],
        teisingas: 0,
        sprendimas: 'Nulį galima dalyti — rezultatas visada 0. Negalima dalyti IŠ nulio.',
      }),

    // 5. Ar galima dalyti iš nulio
    () =>
      pasirinkimoUzdavinys(naujasId('dalyba-su-nuliu'), 'dalyba-su-nuliu', {
        klausimas: 'Ar galima skaičių dalyti iš nulio?',
        variantai: ['negalima', 'galima, gaunamas 0', 'galima, gaunamas tas pats skaičius'],
        teisingas: 0,
        sprendimas: 'Į nulį dalių padalyti neįmanoma, tad dalyba iš nulio neatliekama.',
      }),

    // 6. Kas atsitinka dalijant iš dešimties
    () =>
      pasirinkimoUzdavinys(naujasId('dalyba-su-nuliu'), 'dalyba-su-nuliu', {
        klausimas: 'Kas atsitinka apvaliai dešimčiai, kai ją padaliname iš 10?',
        variantai: ['nubraukiamas nulis', 'prirašomas nulis', 'skaičius nepasikeičia'],
        teisingas: 0,
        sprendimas: `Pavyzdžiui, ${dalybosLygybe(desimtimis * 10, 10)} — kiekviena dešimtis virsta vienetu.`,
      }),
  ])
}

// ── Ką vadiname skaitine lygybe ir nelygybe? ────────────────────────────────

const A_LYGYBE = [
  {
    klausimas: 'Kuris užrašas yra lygybė?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — $6 + 4 = 10$',
    sprendimas: 'Lygybėje tarp reiškinių rašomas ženklas =.',
  },
] as const

export const lygybeNelygybe: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkLygybe(sritis), A_LYGYBE, 'lygybe-nelygybe')

function kurkLygybe(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(2, 9)
  const b = atsitiktinis(2, 9)
  const suma = a + b
  const kitas = atsitiktinis(2, maks)
  if (kitas === suma) return null

  return variacija([
    // 1. Kuris užrašas yra lygybė
    () =>
      pasirinkimoUzdavinys(naujasId('lygybe-nelygybe'), 'lygybe-nelygybe', {
        klausimas: 'Kuris užrašas yra lygybė?',
        variantai: [
          `$${a} + ${b} = ${suma}$`,
          `$${a} + ${b} > ${suma - 1}$`,
          `$${a} + ${b} < ${suma + 1}$`,
        ],
        teisingas: 0,
        sprendimas: 'Lygybėje rašomas ženklas =, o nelygybėje — < arba >.',
      }),

    // 2. Kuris užrašas yra nelygybė
    () =>
      pasirinkimoUzdavinys(naujasId('lygybe-nelygybe'), 'lygybe-nelygybe', {
        klausimas: 'Kuris užrašas yra nelygybė?',
        variantai: [`$${suma} > ${suma - 2}$`, `$${suma} = ${suma}$`, `$${a} + ${b} = ${suma}$`],
        teisingas: 0,
        sprendimas: 'Nelygybėje rašomas ženklas > arba <, o lygybėje — =.',
      }),

    // 3. Įrašyk tinkamą ženklą
    () =>
      pasirinkimoUzdavinys(naujasId('lygybe-nelygybe'), 'lygybe-nelygybe', {
        klausimas: `Įrašyk tinkamą ženklą: $${a} + ${b} \\;\\square\\; ${kitas}$`,
        variantai: ['<', '>', '='],
        teisingas: suma < kitas ? 0 : suma > kitas ? 1 : 2,
        sprendimas: `$${a} + ${b} = ${suma}$, o tai ${suma < kitas ? 'mažiau' : 'daugiau'} nei ${kitas}.`,
      }),

    // 4. Ar lygybė teisinga
    () => {
      const teisinga = atsitiktinis(0, 1) === 1
      const desine = teisinga ? suma : suma + atsitiktinis(1, 3)
      return pasirinkimoUzdavinys(naujasId('lygybe-nelygybe'), 'lygybe-nelygybe', {
        klausimas: `Ar lygybė $${a} + ${b} = ${desine}$ teisinga?`,
        variantai: teisinga
          ? ['teisinga', 'klaidinga', 'negalima pasakyti']
          : ['klaidinga', 'teisinga', 'negalima pasakyti'],
        teisingas: 0,
        sprendimas: `$${a} + ${b} = ${suma}$, o užrašyta ${desine}.`,
      })
    },

    // 5. Ką reiškia ženklas
    () =>
      pasirinkimoUzdavinys(naujasId('lygybe-nelygybe'), 'lygybe-nelygybe', {
        klausimas: 'Ką reiškia, kai tarp dviejų reiškinių rašomas ženklas =?',
        variantai: [
          'abiejų reiškinių reikšmės vienodos',
          'kairysis reiškinys didesnis',
          'dešinysis reiškinys didesnis',
        ],
        teisingas: 0,
        sprendimas: 'Lygybė sako, kad abi pusės lygios.',
      }),
  ])
}

// ── Kokia tvarka reikia atlikti veiksmus? ───────────────────────────────────

const A_TVARKA = [
  {
    klausimas: 'Apskaičiuok: $3 + 4 \\cdot 2$',
    atsakymas: '11',
    atsakymasRodymui: '$11$',
    sprendimas: 'Pirmiausia daugyba: $4 \\cdot 2 = 8$, tada $3 + 8 = 11$.',
  },
] as const

export const veiksmuTvarka2: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkTvarka(sritis), A_TVARKA, 'veiksmu-tvarka-2')

function kurkTvarka(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(2, 9)
  const b = atsitiktinis(2, 9)
  const c = atsitiktinis(2, 9)
  const sand = b * c
  if (a + sand > maks) return null
  const dalinys = b * c
  const dalmuo = c

  return variacija([
    // 1. Sudėtis ir daugyba
    () =>
      uzdavinys('veiksmu-tvarka-2', {
        klausimas: `Apskaičiuok: $${a} + ${b} \\cdot ${c}$`,
        atsakymas: String(a + sand),
        atsakymasRodymui: `$${a + sand}$`,
        sprendimas: `Pirmiausia daugyba: $${b} \\cdot ${c} = ${sand}$, tada $${a} + ${sand} = ${a + sand}$.`,
      }),

    // 2. Dalyba ir sudėtis
    () =>
      uzdavinys('veiksmu-tvarka-2', {
        klausimas: `Apskaičiuok: $${dalinys} : ${b} + ${a}$`,
        atsakymas: String(dalmuo + a),
        atsakymasRodymui: `$${dalmuo + a}$`,
        sprendimas: `Pirmiausia dalyba: $${dalinys} : ${b} = ${dalmuo}$, tada $${dalmuo} + ${a} = ${dalmuo + a}$.`,
      }),

    // 3. Kurį veiksmą pirmiausia
    () =>
      pasirinkimoUzdavinys(naujasId('veiksmu-tvarka-2'), 'veiksmu-tvarka-2', {
        klausimas: `Kurį veiksmą atliksi pirmiausia: $${a} + ${b} \\cdot ${c}$?`,
        variantai: [`daugybą $${b} \\cdot ${c}$`, `sudėtį $${a} + ${b}$`, 'bet kurį'],
        teisingas: 0,
        sprendimas: 'Daugyba ir dalyba atliekamos pirmiau nei sudėtis ir atimtis.',
      }),

    // 4. Atimtis ir dalyba
    () => {
      const turinys = atsitiktinis(dalmuo + 1, maks)
      if (turinys - dalmuo < 1) return null
      return uzdavinys('veiksmu-tvarka-2', {
        klausimas: `Apskaičiuok: $${turinys} - ${dalinys} : ${b}$`,
        atsakymas: String(turinys - dalmuo),
        atsakymasRodymui: `$${turinys - dalmuo}$`,
        sprendimas: `Pirmiausia dalyba: $${dalinys} : ${b} = ${dalmuo}$, tada $${turinys} - ${dalmuo} = ${turinys - dalmuo}$.`,
      })
    },

    // 5. Rask klaidą
    () => {
      const klaidinga = (a + b) * c
      if (klaidinga > maks || klaidinga === a + sand) return null
      return pasirinkimoUzdavinys(naujasId('veiksmu-tvarka-2'), 'veiksmu-tvarka-2', {
        klausimas: `Kuris atsakymas teisingas: $${a} + ${b} \\cdot ${c}$?`,
        variantai: [String(a + sand), String(klaidinga), String(a + sand + 1)],
        teisingas: 0,
        sprendimas: `Pirmiausia daugyba: $${b} \\cdot ${c} = ${sand}$. Sudėjus pirma gautume ${klaidinga} — tai klaida.`,
      })
    },

    // 6. Kokia tvarka
    () =>
      pasirinkimoUzdavinys(naujasId('veiksmu-tvarka-2'), 'veiksmu-tvarka-2', {
        klausimas: 'Kokia tvarka atliekami veiksmai reiškinyje be skliaustų?',
        variantai: [
          'pirma daugyba ir dalyba, paskui sudėtis ir atimtis',
          'visada iš kairės į dešinę',
          'pirma sudėtis, paskui daugyba',
        ],
        teisingas: 0,
        sprendimas: 'Daugyba ir dalyba yra pirmesnės, o tarpusavyje jos atliekamos iš kairės į dešinę.',
      }),
  ])
}

// ── Kaip apskaičiuoti reiškinio su skliaustais reikšmę? ─────────────────────

const A_SKLIAUSTAI = [
  {
    klausimas: 'Apskaičiuok: $(3 + 5) \\cdot 2$',
    atsakymas: '16',
    atsakymasRodymui: '$16$',
    sprendimas: 'Pirmiausia skliaustai: $3 + 5 = 8$, tada $8 \\cdot 2 = 16$.',
  },
] as const

export const skliaustai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSkliaustus(sritis), A_SKLIAUSTAI, 'skliaustai')

function kurkSkliaustus(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(2, 8)
  const b = atsitiktinis(2, 8)
  const c = atsitiktinis(2, 5)
  if ((a + b) * c > maks) return null

  return variacija([
    // 1. Skliaustai ir daugyba
    () =>
      uzdavinys('skliaustai', {
        klausimas: `Apskaičiuok: $(${a} + ${b}) \\cdot ${c}$`,
        atsakymas: String((a + b) * c),
        atsakymasRodymui: `$${(a + b) * c}$`,
        sprendimas: `Pirmiausia skliaustai: $${a} + ${b} = ${a + b}$, tada $${a + b} \\cdot ${c} = ${(a + b) * c}$.`,
      }),

    // 2. Dalyba iš skliaustų
    () => {
      const daliklis = a + b
      const dalmuo = atsitiktinis(2, Math.min(9, Math.floor(maks / daliklis)))
      const dalinys = daliklis * dalmuo
      return uzdavinys('skliaustai', {
        klausimas: `Apskaičiuok: $${dalinys} : (${a} + ${b})$`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `Pirmiausia skliaustai: $${a} + ${b} = ${daliklis}$, tada $${dalinys} : ${daliklis} = ${dalmuo}$.`,
      })
    },

    // 3. Skliaustai su atimtimi
    () => {
      if (a <= b) return null
      return uzdavinys('skliaustai', {
        klausimas: `Apskaičiuok: $${c} \\cdot (${a} - ${b})$`,
        atsakymas: String(c * (a - b)),
        atsakymasRodymui: `$${c * (a - b)}$`,
        sprendimas: `Pirmiausia skliaustai: $${a} - ${b} = ${a - b}$, tada $${c} \\cdot ${a - b} = ${c * (a - b)}$.`,
      })
    },

    // 4. Kurį veiksmą pirmiausia
    () =>
      pasirinkimoUzdavinys(naujasId('skliaustai'), 'skliaustai', {
        klausimas: `Kurį veiksmą atliksi pirmiausia: $${c} \\cdot (${a} + ${b})$?`,
        variantai: [`sudėtį skliaustuose`, `daugybą $${c} \\cdot ${a}$`, 'bet kurį'],
        teisingas: 0,
        sprendimas: 'Skliaustuose esantis veiksmas visada atliekamas pirmas.',
      }),

    // 5. Su skliaustais ir be jų
    () => {
      const be = a + b * c
      const su = (a + b) * c
      if (be === su || be > maks || su > maks) return null
      return uzdavinys('skliaustai', {
        klausimas: `Apskaičiuok ir palygink: kiek yra $(${a} + ${b}) \\cdot ${c}$?`,
        atsakymas: String(su),
        atsakymasRodymui: `$${su}$`,
        sprendimas: `Su skliaustais gauname ${su}, o be jų $${a} + ${b} \\cdot ${c} = ${be}$ — skliaustai keičia rezultatą.`,
      })
    },
  ])
}

// ── Kaip rasti visą daiktų skaičių, kai žinoma jų dalis? ────────────────────

const A_VISUMA = [
  {
    klausimas: 'Pusė obuolių yra 6. Kiek obuolių yra iš viso?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: 'Pusę padauginame iš dviejų: $6 \\cdot 2 = 12$.',
  },
] as const

export const visumaPagalDali: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkVisuma(sritis), A_VISUMA, 'visuma-pagal-dali')

/** Dalies vardas galininku ir vardininku bei į kiek dalių dalijama. */
const DALYS = [
  { gal: 'pusė', vard: 'pusė', daliklis: 2 },
  { gal: 'trečdalis', vard: 'trečdalis', daliklis: 3 },
  { gal: 'ketvirtadalis', vard: 'ketvirtadalis', daliklis: 4 },
  { gal: 'aštuntadalis', vard: 'aštuntadalis', daliklis: 8 },
] as const

function kurkVisuma(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const dalis = pasirink(DALYS)
  const kiek = atsitiktinis(2, Math.min(12, Math.floor(maks / dalis.daliklis)))
  const visuma = kiek * dalis.daliklis
  const d = pasirink(DAIKTAI)

  return variacija([
    // 1. Kiek iš viso
    () =>
      uzdavinys('visuma-pagal-dali', {
        klausimas: `${dalis.vard[0].toUpperCase()}${dalis.vard.slice(1)} ${d.k} yra ${kiek}. Kiek ${d.k} yra iš viso?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `Dalį padauginame iš dalių skaičiaus: $${kiek} \\cdot ${dalis.daliklis} = ${visuma}$.`,
      }),

    // 2. Kuriuo veiksmu randama visuma
    () =>
      pasirinkimoUzdavinys(naujasId('visuma-pagal-dali'), 'visuma-pagal-dali', {
        klausimas: `Žinomas ${dalis.vard} — ${kiek}. Kuriuo veiksmu rasi visą kiekį?`,
        variantai: [
          `dauginant iš ${dalis.daliklis}`,
          `dalijant iš ${dalis.daliklis}`,
          `pridedant ${dalis.daliklis}`,
        ],
        teisingas: 0,
        sprendimas: `Dalis gauta dalijant, tad visuma randama atvirkščiu veiksmu — dauginant.`,
      }),

    // 3. Patikrinimas
    () =>
      uzdavinys('visuma-pagal-dali', {
        klausimas: `Iš viso yra ${visuma} ${d.k}. Koks yra jų ${dalis.vard}?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `${dalybosLygybe(visuma, dalis.daliklis)}.`,
      }),

    // 4. Pasirinkimas
    () => {
      const netiesos = [...new Set([kiek, visuma + dalis.daliklis])].filter((x) => x !== visuma)
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId('visuma-pagal-dali'), 'visuma-pagal-dali', {
        klausimas: `${dalis.vard[0].toUpperCase()}${dalis.vard.slice(1)} karoliukų yra ${kiek}. Kiek karoliukų iš viso?`,
        variantai: [String(visuma), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `$${kiek} \\cdot ${dalis.daliklis} = ${visuma}$.`,
      })
    },

    // 5. Tekstinis su vardu
    () => {
      const v = pasirink(VARDAI)
      return uzdavinys('visuma-pagal-dali', {
        klausimas: `${v} suvalgė ${dalis.vard} visų ${d.k} — tai ${kiek} ${d.k}. Kiek ${d.k} buvo iš viso?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `$${kiek} \\cdot ${dalis.daliklis} = ${visuma}$.`,
      })
    },
  ])
}
