import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { daiktuEile, type Daiktas } from './ikonos'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 2 klasės 3 tema „Dalyba“.
 *
 * Vienuolika potemių rėmėsi 6 klasės `sveikieji` generatoriumi, tad antrokas
 * gaudavo veiksmus su neigiamais skaičiais vietoj „12 obuolių padalyk į 3
 * lėkštes“.
 *
 * Vadovėlio žodynas: **dalinys : daliklis = dalmuo**. Dvi dalybos rūšys
 * skiriamos atskirai — dalijimas į lygias dalis („kiek gaus kiekvienas“) ir
 * talpos dalyba („kiek maišelių prireiks“). Jos atrodo vienodai užrašytos, bet
 * uždavinio klausimas skiriasi, tad turi savo potemes.
 */

const VARDAI = ['Matas', 'Ieva', 'Emilis', 'Luknė', 'Greta', 'Tauras'] as const

const VAIKAI = { vns: 'vaikui', dgs: 'vaikams', kilm: 'vaikų' }

/**
 * Dalijami daiktai su linksniais.
 *
 * `gal` yra galininkas, kurio reikalauja „padalyk …“: 1 obuolį, 3 obuolius,
 * 12 obuolių. `k` — kilmininkas daugiskaita klausimui „kiek obuolių“.
 */
const DAIKTAI = [
  { kas: 'obuolys' as Daiktas, gal: { vns: 'obuolį', dgs: 'obuolius', kilm: 'obuolių' }, k: 'obuolių' },
  { kas: 'sausainis' as Daiktas, gal: { vns: 'sausainį', dgs: 'sausainius', kilm: 'sausainių' }, k: 'sausainių' },
  { kas: 'piestukas' as Daiktas, gal: { vns: 'pieštuką', dgs: 'pieštukus', kilm: 'pieštukų' }, k: 'pieštukų' },
  { kas: 'kubelis' as Daiktas, gal: { vns: 'kubelį', dgs: 'kubelius', kilm: 'kubelių' }, k: 'kubelių' },
  { kas: 'balionas' as Daiktas, gal: { vns: 'balioną', dgs: 'balionus', kilm: 'balionų' }, k: 'balionų' },
] as const

function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 100, 100)
}

/** Dalybos veiksmas taip, kaip rašo vadovėlis. */
function dalyba(a: number, b: number): string {
  return `$${a} : ${b}$`
}

/** Visa dalybos lygybė vienu KaTeX intarpu — du gretimi `$…$` išeitų su tarpu. */
function dalybosLygybe(a: number, b: number): string {
  return `$${a} : ${b} = ${a / b}$`
}

// ── 3.1 Kas yra dalyba? ─────────────────────────────────────────────────────

const A_KAS_DALYBA = [
  {
    klausimas: '12 obuolių padalyta po lygiai į 3 lėkštes. Kiek obuolių vienoje lėkštėje?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: '$12 : 3 = 4$.',
  },
] as const

export const kasYraDalyba: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkKasDalyba(sritis), A_KAS_DALYBA, 'kas-yra-dalyba')

/** Dalinys, daliklis ir dalmuo be liekanos. */
function dalybosPora(maks: number, daliklis?: number) {
  const b = daliklis ?? atsitiktinis(2, 5)
  const dalmuo = atsitiktinis(2, Math.min(10, Math.floor(maks / b)))
  return { dalinys: b * dalmuo, daliklis: b, dalmuo }
}

function kurkKasDalyba(sritis?: Sritis | null): Uzdavinys | null {
  const { dalinys, daliklis, dalmuo } = dalybosPora(riba(sritis))
  const d = pasirink(DAIKTAI)

  return variacija([
    // 1. Kiek gaus kiekvienas
    () =>
      uzdavinys('kas-yra-dalyba', {
        klausimas: `Padalyk ${dalinys} ${derink(dalinys, d.gal)} po lygiai ${daliklis} ${derink(daliklis, VAIKAI)}. Kiek ${d.k} gaus kiekvienas?`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `${dalybosLygybe(dalinys, daliklis)}.`,
        brezinys: daiktuEile([{ daiktas: d.kas, kiek: Math.min(dalinys, 10) }], 22),
      }),

    // 2. Užbaik veiksmą
    () =>
      uzdavinys('kas-yra-dalyba', {
        klausimas: `${dalinys} daiktų padalyta į ${daliklis} lygias grupes. Užbaik: $${dalinys} : ${daliklis} = \\square$`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `Kiekvienoje grupėje po ${dalmuo}.`,
      }),

    // 3. Kuris veiksmas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-dalyba'), 'kas-yra-dalyba', {
        klausimas: `${dalinys} ${derink(dalinys, d.gal)} reikia padalyti po lygiai ${daliklis} ${derink(daliklis, VAIKAI)}. Kuris veiksmas tinka?`,
        variantai: [
          `$${dalinys} : ${daliklis}$`,
          `$${dalinys} \\cdot ${daliklis}$`,
          `$${dalinys} - ${daliklis}$`,
        ],
        teisingas: 0,
        sprendimas: 'Dalijant po lygiai naudojamas dalybos veiksmas.',
      }),

    // 4. Sąvokos: dalinys, daliklis, dalmuo
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-dalyba'), 'kas-yra-dalyba', {
        klausimas: `Veiksme ${dalybosLygybe(dalinys, daliklis)} kuris skaičius yra dalmuo?`,
        variantai: [String(dalmuo), String(dalinys), String(daliklis)],
        teisingas: 0,
        sprendimas: `Dalmuo yra dalybos rezultatas — jis rašomas po lygybės ženklo, tad ${dalmuo}.`,
      }),

    // 5. Ką rodo daliklis
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-dalyba'), 'kas-yra-dalyba', {
        klausimas: `Veiksme ${dalyba(dalinys, daliklis)} ką rodo skaičius ${daliklis}?`,
        variantai: ['į kiek lygių dalių dalijame', 'kiek turime iš viso', 'kiek gaus kiekvienas'],
        teisingas: 0,
        sprendimas: `${dalinys} yra visas kiekis, ${daliklis} — dalių skaičius, o ${dalmuo} — kiek tenka vienai daliai.`,
      }),
  ])
}

// ── 3.2 Koks daugybos ir dalybos veiksmų ryšys? ─────────────────────────────

const A_RYSYS = [
  {
    klausimas: 'Jei $4 \\cdot 3 = 12$, tai $12 : 3 = \\square$. Koks skaičius vietoj langelio?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: 'Dalyba yra atvirkštinis daugybos veiksmas.',
  },
] as const

export const daugybosDalybosRysys: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkRysi(sritis), A_RYSYS, 'daugybos-dalybos-rysys')

function kurkRysi(sritis?: Sritis | null): Uzdavinys | null {
  const a = atsitiktinis(2, 6)
  const b = atsitiktinis(2, Math.min(9, Math.floor(riba(sritis) / a)))
  if (a === b) return null
  const sand = a * b

  return variacija([
    // 1. Iš daugybos į dalybą
    () =>
      uzdavinys('daugybos-dalybos-rysys', {
        klausimas: `Jei $${a} \\cdot ${b} = ${sand}$, tai $${sand} : ${b} = \\square$. Koks skaičius vietoj langelio?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Padalijus sandaugą iš vieno daugiklio gaunamas kitas: $${sand} : ${b} = ${a}$.`,
      }),

    // 2. Skaičių šeima
    () =>
      uzdavinys('daugybos-dalybos-rysys', {
        klausimas: `Užbaik skaičių šeimą: $${a} \\cdot ${b} = ${sand}$, $${b} \\cdot ${a} = ${sand}$, $${sand} : ${a} = ${b}$, $${sand} : ${b} = \\square$.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Visi keturi veiksmai sudaryti iš tų pačių skaičių ${a}, ${b} ir ${sand}.`,
      }),

    // 3. Kuris dalybos veiksmas susijęs
    () =>
      pasirinkimoUzdavinys(naujasId('daugybos-dalybos-rysys'), 'daugybos-dalybos-rysys', {
        klausimas: `Jei $${a} \\cdot ${b} = ${sand}$, kuris dalybos veiksmas teisingas?`,
        variantai: [
          `$${sand} : ${a} = ${b}$`,
          `$${sand} : ${a} = ${a}$`,
          `$${a} : ${b} = ${sand}$`,
        ],
        teisingas: 0,
        sprendimas: `Sandaugą ${sand} padalijus iš ${a} gaunamas antrasis daugiklis ${b}.`,
      }),

    // 4. Kaip pasitikrinti dalybą
    () =>
      pasirinkimoUzdavinys(naujasId('daugybos-dalybos-rysys'), 'daugybos-dalybos-rysys', {
        klausimas: `Kaip pasitikrinti, ar teisingai apskaičiuota $${sand} : ${b} = ${a}$?`,
        variantai: [
          `padauginti: $${a} \\cdot ${b}$ ir gauti ${sand}`,
          `sudėti: $${a} + ${b}$`,
          `atimti: $${sand} - ${b}$`,
        ],
        teisingas: 0,
        sprendimas: `Dalmenį padauginus iš daliklio turi gautis dalinys: $${a} \\cdot ${b} = ${sand}$.`,
      }),

    // 5. Atvirkštinis veiksmas
    () =>
      pasirinkimoUzdavinys(naujasId('daugybos-dalybos-rysys'), 'daugybos-dalybos-rysys', {
        klausimas: 'Koks veiksmas yra atvirkštinis daugybai?',
        variantai: ['dalyba', 'sudėtis', 'atimtis'],
        teisingas: 0,
        sprendimas: 'Daugyba ir dalyba yra atvirkštiniai veiksmai — vienas atstato tai, ką padarė kitas.',
      }),
  ])
}

// ── 3.3, 3.5, 3.9 Dalyba iš 2, iš 3 ir 4, iš 5 ──────────────────────────────

/** Bendras dalybos generatorius — potemės skiriasi tik dalikliu. */
function dalybaIs(dalikliai: readonly number[], temaId: string) {
  return (sritis?: Sritis | null): Uzdavinys | null => {
    const maks = riba(sritis)
    const daliklis = pasirink(dalikliai)
    const dalmuo = atsitiktinis(2, Math.min(10, Math.floor(maks / daliklis)))
    const dalinys = daliklis * dalmuo
    const d = pasirink(DAIKTAI)

    return variacija([
      // 1. Grynas veiksmas
      () =>
        uzdavinys(temaId, {
          klausimas: `Apskaičiuok: ${dalyba(dalinys, daliklis)}`,
          atsakymas: String(dalmuo),
          atsakymasRodymui: `$${dalmuo}$`,
          sprendimas: `${dalmuo} kartus po ${daliklis} yra ${dalinys}, tad ${dalybosLygybe(dalinys, daliklis)}.`,
        }),

      // 2. Tekstinis — kiek gaus kiekvienas
      () =>
        uzdavinys(temaId, {
          klausimas: `Padalyk ${dalinys} ${derink(dalinys, d.gal)} po lygiai ${daliklis} ${derink(daliklis, VAIKAI)}. Kiek gaus kiekvienas?`,
          atsakymas: String(dalmuo),
          atsakymasRodymui: `$${dalmuo}$`,
          sprendimas: `${dalybosLygybe(dalinys, daliklis)}.`,
        }),

      // 3. Nežinomas dalinys
      () =>
        uzdavinys(temaId, {
          klausimas: `Užbaik: $\\square : ${daliklis} = ${dalmuo}$`,
          atsakymas: String(dalinys),
          atsakymasRodymui: `$${dalinys}$`,
          sprendimas: `Dalmenį padauginame iš daliklio: $${dalmuo} \\cdot ${daliklis} = ${dalinys}$.`,
        }),

      // 4. Pasirinkimas
      () => {
        const netiesos = [...new Set([dalmuo + 1, dalmuo - 1, dalmuo + 2])].filter(
          (x) => x > 0 && x !== dalmuo,
        )
        if (netiesos.length < 2) return null
        return pasirinkimoUzdavinys(naujasId(temaId), temaId, {
          klausimas: `Pasirink teisingą atsakymą: ${dalyba(dalinys, daliklis)}`,
          variantai: [String(dalmuo), ...netiesos.slice(0, 2).map(String)],
          teisingas: 0,
          sprendimas: `${dalybosLygybe(dalinys, daliklis)}.`,
        })
      },

      // 5. Patikrinimas daugyba
      () =>
        uzdavinys(temaId, {
          klausimas: `Apskaičiavai ${dalybosLygybe(dalinys, daliklis)}. Kiek gausi patikrindamas: $${dalmuo} \\cdot ${daliklis}$?`,
          atsakymas: String(dalinys),
          atsakymasRodymui: `$${dalinys}$`,
          sprendimas: `Patikrinimas turi grąžinti dalinį: $${dalmuo} \\cdot ${daliklis} = ${dalinys}$.`,
        }),
    ])
  }
}

const A_DALYBA = [
  {
    klausimas: 'Apskaičiuok: $16 : 2$',
    atsakymas: '8',
    atsakymasRodymui: '$8$',
    sprendimas: '8 kartus po 2 yra 16.',
  },
] as const

export const dalybaIs2: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => dalybaIs([2], 'dalyba-is-2')(sritis), A_DALYBA, 'dalyba-is-2')

export const dalybaIs3Ir4: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => dalybaIs([3, 4], 'dalyba-is-3-ir-4')(sritis), A_DALYBA, 'dalyba-is-3-ir-4')

export const dalybaIs5: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => dalybaIs([5], 'dalyba-is-5')(sritis), A_DALYBA, 'dalyba-is-5')

// ── 3.6 Kas yra talpos dalyba? ──────────────────────────────────────────────

const A_TALPA = [
  {
    klausimas: '12 obuolių dedama po 3 į maišelius. Kiek maišelių reikės?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: '$12 : 3 = 4$ maišeliai.',
  },
] as const

export const talposDalyba: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkTalpa(sritis), A_TALPA, 'talpos-dalyba')

/**
 * Talpyklos su linksniais.
 *
 * `gal` yra galininkas — jo reikalauja „dedama į …“; `kilm` — kilmininkas
 * daugiskaita, kurio reikalauja „kiek … reikės“. Vardininkas čia nereikalingas,
 * nes talpykla sakiniuose niekada nėra veiksnys.
 */
const TALPYKLOS = [
  { gal: { vns: 'maišelį', dgs: 'maišelius', kilm: 'maišelių' }, kilm: 'maišelių' },
  { gal: { vns: 'dėžutę', dgs: 'dėžutes', kilm: 'dėžučių' }, kilm: 'dėžučių' },
  { gal: { vns: 'lėkštę', dgs: 'lėkštes', kilm: 'lėkščių' }, kilm: 'lėkščių' },
  { gal: { vns: 'krepšį', dgs: 'krepšius', kilm: 'krepšių' }, kilm: 'krepšių' },
] as const

function kurkTalpa(sritis?: Sritis | null): Uzdavinys | null {
  const { dalinys, daliklis, dalmuo } = dalybosPora(riba(sritis), atsitiktinis(2, 6))
  const d = pasirink(DAIKTAI)
  const t = pasirink(TALPYKLOS)

  return variacija([
    // 1. Kiek talpyklų prireiks
    () =>
      uzdavinys('talpos-dalyba', {
        klausimas: `${dalinys} ${derink(dalinys, d.gal)} dedama po ${daliklis} į ${t.gal.dgs}. Kiek ${t.kilm} reikės?`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `${dalybosLygybe(dalinys, daliklis)}.`,
      }),

    // 2. Kiek pripildysi
    () =>
      uzdavinys('talpos-dalyba', {
        klausimas: `Sudėk ${dalinys} ${derink(dalinys, d.gal)} po ${daliklis}. Kiek ${t.kilm} pripildysi?`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `Kiekvienoje telpa po ${daliklis}, tad ${dalybosLygybe(dalinys, daliklis)}.`,
      }),

    // 3. Kuris veiksmas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('talpos-dalyba'), 'talpos-dalyba', {
        klausimas: `„Sudėk ${dalinys} ${derink(dalinys, d.gal)} po ${daliklis} į ${t.gal.dgs}.“ Kuris veiksmas tinka?`,
        variantai: [
          `$${dalinys} : ${daliklis}$`,
          `$${dalinys} \\cdot ${daliklis}$`,
          `$${dalinys} - ${daliklis}$`,
        ],
        teisingas: 0,
        sprendimas: 'Ieškome, kiek kartų po ${daliklis} telpa į ${dalinys} — tai dalyba.'
          .replace('${daliklis}', String(daliklis))
          .replace('${dalinys}', String(dalinys)),
      }),

    // 4. Kuo skiriasi nuo dalijimo į lygias dalis
    () =>
      pasirinkimoUzdavinys(naujasId('talpos-dalyba'), 'talpos-dalyba', {
        klausimas: 'Ko ieškoma talpos dalyboje?',
        variantai: [
          'kiek grupių gausis',
          'kiek teks kiekvienam',
          'kiek yra iš viso',
        ],
        teisingas: 0,
        sprendimas:
          'Talpos dalyboje žinoma, po kiek dedame, ir ieškoma grupių skaičiaus; dalijant po lygiai — atvirkščiai.',
      }),

    // 5. Kiek telpa vienoje
    () =>
      uzdavinys('talpos-dalyba', {
        klausimas: `${dalinys} ${derink(dalinys, d.gal)} po lygiai sudėta į ${dalmuo} ${derink(dalmuo, t.gal)}. Po kiek ${d.k} vienoje?`,
        atsakymas: String(daliklis),
        atsakymasRodymui: `$${daliklis}$`,
        sprendimas: `${dalybosLygybe(dalinys, dalmuo)}.`,
      }),
  ])
}

// ── 3.11 Kaip sumažinti skaičių kelis kartus? ───────────────────────────────

const A_SUMAZINK = [
  {
    klausimas: 'Skaičių 18 sumažink 3 kartus.',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: 'Sumažinti kartais reiškia dalyti: $18 : 3 = 6$.',
  },
] as const

export const sumazinkKartus: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSumazinima(sritis), A_SUMAZINK, 'sumazink-kartus')

function kurkSumazinima(sritis?: Sritis | null): Uzdavinys | null {
  const { dalinys, daliklis, dalmuo } = dalybosPora(riba(sritis), atsitiktinis(2, 5))
  const [v, v2] = sumaisyk([...VARDAI]).slice(0, 2)
  const d = pasirink(DAIKTAI)

  return variacija([
    // 1. Sumažink kartus
    () =>
      uzdavinys('sumazink-kartus', {
        klausimas: `Skaičių ${dalinys} sumažink ${daliklis} ${derink(daliklis, { vns: 'kartą', dgs: 'kartus', kilm: 'kartų' })}.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `Sumažinti kartais reiškia dalyti: ${dalybosLygybe(dalinys, daliklis)}.`,
      }),

    // 2. Tekstinis su „kartus mažiau“
    () =>
      uzdavinys('sumazink-kartus', {
        klausimas: `${v} turi ${dalinys} ${d.k}, o ${v2} — ${daliklis} ${derink(daliklis, { vns: 'kartą', dgs: 'kartus', kilm: 'kartų' })} mažiau. Kiek ${d.k} turi ${v2}?`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `„Kartus mažiau“ reiškia dalybą: ${dalybosLygybe(dalinys, daliklis)}.`,
      }),

    // 3. „Vienetais mažiau“ ar „kartus mažiau“
    () =>
      pasirinkimoUzdavinys(naujasId('sumazink-kartus'), 'sumazink-kartus', {
        klausimas: `${v} turi ${dalinys} korteles, o ${v2} — ${daliklis} kartus mažiau. Kuriuo veiksmu skaičiuosi?`,
        variantai: [
          `$${dalinys} : ${daliklis}$`,
          `$${dalinys} - ${daliklis}$`,
          `$${dalinys} \\cdot ${daliklis}$`,
        ],
        teisingas: 0,
        sprendimas: `„Kartus mažiau“ reiškia dalybą, o „${daliklis} vienetais mažiau“ reikštų atimtį.`,
      }),

    // 4. Dvi dėžės
    () =>
      uzdavinys('sumazink-kartus', {
        klausimas: `Vienoje dėžėje ${dalinys} ${d.k}, kitoje — ${daliklis} ${derink(daliklis, { vns: 'kartą', dgs: 'kartus', kilm: 'kartų' })} mažiau. Kiek ${d.k} kitoje dėžėje?`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `${dalybosLygybe(dalinys, daliklis)}.`,
      }),

    // 5. Kiek kartų mažiau
    () =>
      uzdavinys('sumazink-kartus', {
        klausimas: `Kiek kartų ${dalmuo} yra mažiau už ${dalinys}?`,
        atsakymas: String(daliklis),
        atsakymasRodymui: `$${daliklis}$`,
        sprendimas: `${dalybosLygybe(dalinys, dalmuo)}.`,
      }),
  ])
}

// ── 3.10 Kiek kainuoja viena prekė? ─────────────────────────────────────────

const A_KAINA = [
  {
    klausimas: '4 vienodi pieštukai kainuoja 8 Eur. Kiek kainuoja vienas pieštukas?',
    atsakymas: '2',
    atsakymasRodymui: '$2$ Eur',
    sprendimas: '$8 : 4 = 2$ Eur.',
  },
] as const

export const vienosPrekesKaina: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkKaina(sritis), A_KAINA, 'vienos-prekes-kaina')

const PREKES = [
  { vns: 'pieštukas', dgs: 'pieštukai', kilm: 'pieštukų' },
  { vns: 'sąsiuvinis', dgs: 'sąsiuviniai', kilm: 'sąsiuvinių' },
  { vns: 'žaislas', dgs: 'žaislai', kilm: 'žaislų' },
  { vns: 'lipdukų lapas', dgs: 'lipdukų lapai', kilm: 'lipdukų lapų' },
] as const

function kurkKaina(sritis?: Sritis | null): Uzdavinys | null {
  const kiek = atsitiktinis(3, 6)
  const vienos = atsitiktinis(2, 8)
  const visos = kiek * vienos
  if (visos > riba(sritis)) return null
  const p = pasirink(PREKES)

  return variacija([
    // 1. Kiek kainuoja viena
    () =>
      uzdavinys('vienos-prekes-kaina', {
        klausimas: `${kiek} vienodi ${p.dgs} kainuoja ${visos} Eur. Kiek kainuoja vienas ${p.vns}?`,
        atsakymas: String(vienos),
        atsakymasRodymui: `$${vienos}$ Eur`,
        sprendimas: `${dalybosLygybe(visos, kiek)} Eur.`,
      }),

    // 2. Kiek kainuos kelios
    () =>
      uzdavinys('vienos-prekes-kaina', {
        klausimas: `Vienas ${p.vns} kainuoja ${vienos} Eur. Kiek kainuoja ${kiek} tokie ${p.dgs}?`,
        atsakymas: String(visos),
        atsakymasRodymui: `$${visos}$ Eur`,
        sprendimas: `$${kiek} \\cdot ${vienos} = ${visos}$ Eur.`,
      }),

    // 3. Kiek nupirksi už turimus pinigus
    () =>
      uzdavinys('vienos-prekes-kaina', {
        klausimas: `Vienas ${p.vns} kainuoja ${vienos} Eur. Kiek tokių ${p.kilm} nupirksi už ${visos} Eur?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `${dalybosLygybe(visos, vienos)}.`,
      }),

    // 4. Kuris veiksmas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('vienos-prekes-kaina'), 'vienos-prekes-kaina', {
        klausimas: `${kiek} vienodos prekės kainuoja ${visos} Eur. Kuriuo veiksmu rasi vienos kainą?`,
        variantai: [
          `$${visos} : ${kiek}$`,
          `$${visos} \\cdot ${kiek}$`,
          `$${visos} - ${kiek}$`,
        ],
        teisingas: 0,
        sprendimas: 'Bendra kaina dalijama iš prekių skaičiaus.',
      }),

    // 5. Palyginimas su kita preke
    () => {
      const kita = atsitiktinis(2, 8)
      if (kita === vienos) return null
      return uzdavinys('vienos-prekes-kaina', {
        klausimas: `Vienas ${p.vns} kainuoja ${vienos} Eur, o kitas — ${kita} Eur. Keliais eurais brangesnis brangesnysis?`,
        atsakymas: String(Math.abs(vienos - kita)),
        atsakymasRodymui: `$${Math.abs(vienos - kita)}$ Eur`,
        sprendimas: `$${Math.max(vienos, kita)} - ${Math.min(vienos, kita)} = ${Math.abs(vienos - kita)}$ Eur.`,
      })
    },
  ])
}

// ── 3.8 Kas yra lyginiai ir nelyginiai skaičiai? ────────────────────────────

const A_LYGINIAI = [
  {
    klausimas: 'Pasirink lyginį skaičių.',
    atsakymas: 'a',
    atsakymasRodymui: 'A — 18',
    sprendimas: 'Lyginį skaičių galima padalyti į dvi lygias dalis.',
  },
] as const

export const lyginiaiNelyginiai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkLyginius(sritis), A_LYGINIAI, 'lyginiai-nelyginiai')

function kurkLyginius(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const lyginis = atsitiktinis(5, Math.floor(maks / 2)) * 2
  const nelyginis = atsitiktinis(5, Math.floor((maks - 1) / 2)) * 2 + 1

  return variacija([
    // 1. Pasirink lyginį
    () =>
      pasirinkimoUzdavinys(naujasId('lyginiai-nelyginiai'), 'lyginiai-nelyginiai', {
        klausimas: 'Pasirink lyginį skaičių.',
        variantai: [String(lyginis), String(nelyginis), String(nelyginis + 2)],
        teisingas: 0,
        sprendimas: `${lyginis} dalijasi iš 2 be liekanos, tad jis lyginis.`,
      }),

    // 2. Pasirink nelyginį
    () =>
      pasirinkimoUzdavinys(naujasId('lyginiai-nelyginiai'), 'lyginiai-nelyginiai', {
        klausimas: 'Pasirink nelyginį skaičių.',
        variantai: [String(nelyginis), String(lyginis), String(lyginis + 2)],
        teisingas: 0,
        sprendimas: `${nelyginis} nesidalija iš 2 be liekanos, tad jis nelyginis.`,
      }),

    // 3. Ar galima padalyti pusiau
    () =>
      pasirinkimoUzdavinys(naujasId('lyginiai-nelyginiai'), 'lyginiai-nelyginiai', {
        klausimas: `Ar ${lyginis} daiktus galima padalyti į dvi lygias dalis?`,
        variantai: [
          `taip, kiekvienoje bus po ${lyginis / 2}`,
          'ne, vienas liks',
          'ne, dalių bus trys',
        ],
        teisingas: 0,
        sprendimas: `${lyginis} yra lyginis: ${dalybosLygybe(lyginis, 2)}.`,
      }),

    // 4. Koks paskutinis skaitmuo
    () =>
      pasirinkimoUzdavinys(naujasId('lyginiai-nelyginiai'), 'lyginiai-nelyginiai', {
        klausimas: 'Kokiu skaitmeniu baigiasi lyginiai skaičiai?',
        variantai: ['0, 2, 4, 6 arba 8', '1, 3, 5, 7 arba 9', 'bet kokiu'],
        teisingas: 0,
        sprendimas: 'Lyginiai skaičiai baigiasi 0, 2, 4, 6 arba 8.',
      }),

    // 5. Surikiuoti į grupes
    () =>
      eiliskumoUzdavinys(naujasId('lyginiai-nelyginiai'), 'lyginiai-nelyginiai', {
        klausimas: 'Surikiuok skaičius nuo mažiausio iki didžiausio.',
        teisingaEile: [...new Set([lyginis, nelyginis, lyginis + 1])]
          .sort((a, b) => a - b)
          .map(String),
        sprendimas: 'Skaičiai rikiuojami pagal dydį, nesvarbu, lyginiai jie ar nelyginiai.',
      }),
  ])
}

// ── 3.4 ir 3.7 Pusė, trečdalis, ketvirtadalis ───────────────────────────────

const A_PUSE = [
  {
    klausimas: 'Rask pusę skaičiaus 18.',
    atsakymas: '9',
    atsakymasRodymui: '$9$',
    sprendimas: 'Pusė yra dalis iš dviejų: $18 : 2 = 9$.',
  },
] as const

export const puse: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkDali(2, 'puse', sritis), A_PUSE, 'puse')

const A_DALIS = [
  {
    klausimas: 'Rask ketvirtadalį skaičiaus 20.',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Ketvirtadalis yra dalis iš keturių: $20 : 4 = 5$.',
  },
] as const

export const trecdalisKetvirtadalis: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkDali(pasirink([3, 4]), 'trecdalis-ketvirtadalis', sritis), A_DALIS, 'trecdalis-ketvirtadalis')

/** Dalies vardas galininku („rask pusę“) ir vardininku („pusė yra 7“). */
const DALIU_VARDAI: Record<number, string> = { 2: 'pusę', 3: 'trečdalį', 4: 'ketvirtadalį' }
const DALIU_VARDININKAI: Record<number, string> = { 2: 'pusė', 3: 'trečdalis', 4: 'ketvirtadalis' }
const DALIU_PAAIS: Record<number, string> = {
  2: 'Pusė yra viena dalis iš dviejų',
  3: 'Trečdalis yra viena dalis iš trijų',
  4: 'Ketvirtadalis yra viena dalis iš keturių',
}

function kurkDali(daliklis: number, temaId: string, sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const dalmuo = atsitiktinis(3, Math.min(12, Math.floor(maks / daliklis)))
  const dalinys = daliklis * dalmuo
  const d = pasirink(DAIKTAI)
  const vardas = DALIU_VARDAI[daliklis]

  return variacija([
    // 1. Rask dalį
    () =>
      uzdavinys(temaId, {
        klausimas: `Rask ${vardas} skaičiaus ${dalinys}.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `${DALIU_PAAIS[daliklis]}: ${dalybosLygybe(dalinys, daliklis)}.`,
      }),

    // 2. Padalyta į lygias dalis
    () =>
      uzdavinys(temaId, {
        klausimas: `${dalinys} ${derink(dalinys, d.gal)} padalyta į ${daliklis} lygias dalis. Kiek ${d.k} yra vienoje dalyje?`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `${dalybosLygybe(dalinys, daliklis)}.`,
        brezinys: daiktuEile([{ daiktas: d.kas, kiek: Math.min(dalinys, 12) }], 20),
      }),

    // 3. Pasirinkimas
    () => {
      const netiesos = [...new Set([dalmuo + 1, dalmuo - 1, dalmuo * 2])].filter(
        (x) => x > 0 && x !== dalmuo,
      )
      if (netiesos.length < 2) return null
      return pasirinkimoUzdavinys(naujasId(temaId), temaId, {
        klausimas: `Pasirink ${vardas} skaičiaus ${dalinys}.`,
        variantai: [String(dalmuo), ...netiesos.slice(0, 2).map(String)],
        teisingas: 0,
        sprendimas: `${dalybosLygybe(dalinys, daliklis)}.`,
      })
    },

    // 4. Atvirkščiai: žinoma dalis, ieškoma visumos
    () =>
      uzdavinys(temaId, {
        klausimas: `Skaičiaus ${DALIU_VARDININKAI[daliklis]} yra ${dalmuo}. Koks tas skaičius?`,
        atsakymas: String(dalinys),
        atsakymasRodymui: `$${dalinys}$`,
        sprendimas: `Dalį padauginame iš dalių skaičiaus: $${dalmuo} \\cdot ${daliklis} = ${dalinys}$.`,
      }),

    // 5. Kuriuo veiksmu randama dalis
    () =>
      pasirinkimoUzdavinys(naujasId(temaId), temaId, {
        klausimas: `Kuriuo veiksmu randama skaičiaus ${vardas}?`,
        variantai: [
          `dalijant iš ${daliklis}`,
          `dauginant iš ${daliklis}`,
          `atimant ${daliklis}`,
        ],
        teisingas: 0,
        sprendimas: `${DALIU_PAAIS[daliklis]}, tad skaičius dalijamas iš ${daliklis}.`,
      }),
  ])
}
