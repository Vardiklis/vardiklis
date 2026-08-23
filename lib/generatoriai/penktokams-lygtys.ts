import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { VARDAI, kiek, D } from './ketvirtokams-bendra'
import { ivestiesLentele } from './penktokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 5 klasės tema „Reiškiniai. Lygtys“ — dešimt potemių.
 *
 * Programoje ši tema turi ir potemę „Skaičių sekos ir įvesties–išvesties
 * lentelės“, kurios turinio apraše nėra, bet ji čia priklauso: taisyklė,
 * pagal kurią iš įvesties gaunama išvestis, ir yra raidinis reiškinys.
 *
 * Kelios turinio aprašo užduotys prašo mokinio ką nors *sukurti* („sukurk
 * tekstinę situaciją reiškiniui 7x + 12“, „sugalvok uždavinį lygčiai“).
 * Tokio atsakymo patikrinti neįmanoma, tad generuojama tai, ką kūrimas iš
 * tikrųjų reikalauja: atpažinti, kuris tekstas atitinka reiškinį.
 */

const RAIDES = ['a', 'b', 'x', 'y', 'm', 'n', 'k', 'p'] as const

// ── 7.1.1. Skaitinis reiškinys ir jo reikšmė ────────────────────────────────

const T1 = 'skaitinis-reiskinys'

const A_SKAITINIS = [
  {
    klausimas: 'Apskaičiuok reiškinio $18 + 6 \\cdot 4$ reikšmę.',
    atsakymas: '42',
    atsakymasRodymui: '$42$',
    sprendimas: 'Pirma daugyba: $6 \\cdot 4 = 24$, tada $18 + 24 = 42$.',
  },
] as const

export const skaitinisReiskinys: Generatorius = () => suBandymais(kurkSkaitini, A_SKAITINIS, T1)

function kurkSkaitini(): Uzdavinys | null {
  const a = atsitiktinis(12, 90)
  const b = atsitiktinis(2, 12)
  const c = atsitiktinis(2, 9)

  return variacija([
    // 1. Be skliaustų
    () =>
      uzdavinys(T1, {
        klausimas: `Apskaičiuok reiškinio $${a} + ${b} \\cdot ${c}$ reikšmę.`,
        atsakymas: String(a + b * c),
        atsakymasRodymui: `$${a + b * c}$`,
        sprendimas: `Pirma atliekama daugyba: $${b} \\cdot ${c} = ${b * c}$, tada $${a} + ${b * c} = ${a + b * c}$.`,
      }),

    // 2. Su skliaustais
    () =>
      uzdavinys(T1, {
        klausimas: `Apskaičiuok: $(${a} + ${b}) \\cdot ${c}$.`,
        atsakymas: String((a + b) * c),
        atsakymasRodymui: `$${(a + b) * c}$`,
        sprendimas: `Pirma skliaustai: $${a} + ${b} = ${a + b}$, tada $${a + b} \\cdot ${c} = ${(a + b) * c}$.`,
      }),

    // 3. Kuo skiriasi
    () =>
      uzdavinys(T1, {
        klausimas: `Kiek reiškinio $(${a} + ${b}) \\cdot ${c}$ reikšmė didesnė už reiškinio $${a} + ${b} \\cdot ${c}$ reikšmę?`,
        atsakymas: String((a + b) * c - (a + b * c)),
        atsakymasRodymui: `$${(a + b) * c - (a + b * c)}$`,
        sprendimas: `$${(a + b) * c} - ${a + b * c} = ${(a + b) * c - (a + b * c)}$. Skliaustai pakeičia veiksmų tvarką, tad ir reikšmę.`,
      }),

    // 4. Su dalyba
    () => {
      const dalmuo = atsitiktinis(3, 12)
      const daliklis = atsitiktinis(2, 9)
      return uzdavinys(T1, {
        klausimas: `Apskaičiuok: $${dalmuo * daliklis} : ${daliklis} + ${a}$.`,
        atsakymas: String(dalmuo + a),
        atsakymasRodymui: `$${dalmuo + a}$`,
        sprendimas: `Pirma dalyba: $${dalmuo * daliklis} : ${daliklis} = ${dalmuo}$, tada $${dalmuo} + ${a} = ${dalmuo + a}$.`,
      })
    },

    // 5. Kiek veiksmų
    () =>
      uzdavinys(T1, {
        klausimas: `Kiek veiksmų yra reiškinyje $${a} - ${b} \\cdot ${c} + ${b}$?`,
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Atimtis, daugyba ir sudėtis — iš viso trys veiksmai.',
      }),

    // 6. Reiškinys pagal sakinį
    () =>
      uzdavinys(T1, {
        klausimas: `Sudaryk skaitinį reiškinį ir apskaičiuok jo reikšmę: „prie ${a} pridėk ${c} kartus po ${b}“.`,
        atsakymas: String(a + b * c),
        atsakymasRodymui: `$${a} + ${b} \\cdot ${c} = ${a + b * c}$`,
        sprendimas: `„${c} kartus po ${b}“ yra $${b} \\cdot ${c} = ${b * c}$, tad reiškinys yra $${a} + ${b} \\cdot ${c}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T1, {
        klausimas: `Mokinys apskaičiavo $${a} - ${b} \\cdot ${c} = ${(a - b) * c}$ — veiksmus atliko iš eilės. Užrašyk teisingą reikšmę.`,
        atsakymas: String(a - b * c),
        atsakymasRodymui: `$${a - b * c}$`,
        sprendimas: `Daugyba atliekama pirmiau už atimtį: $${b} \\cdot ${c} = ${b * c}$, tada $${a} - ${b * c} = ${a - b * c}$.`,
      }),

    // 8. Su skliaustais ir dalyba
    () => {
      const skirtumas = atsitiktinis(4, 12)
      const dalinys = skirtumas * atsitiktinis(8, 30)
      return uzdavinys(T1, {
        klausimas: `Apskaičiuok: $${dalinys} : (${skirtumas + c} - ${c}) + ${b} \\cdot ${c}$.`,
        atsakymas: String(dalinys / skirtumas + b * c),
        atsakymasRodymui: `$${dalinys / skirtumas + b * c}$`,
        sprendimas: `Skliaustai: $${skirtumas + c} - ${c} = ${skirtumas}$; dalyba: $${dalinys} : ${skirtumas} = ${dalinys / skirtumas}$; daugyba: $${b} \\cdot ${c} = ${b * c}$; suma: $${dalinys / skirtumas + b * c}$.`,
      })
    },
  ])
}

// ── 7.1.2. Raidinis reiškinys ───────────────────────────────────────────────

const T2 = 'raidinis-reiskinys'

const A_RAIDINIS = [
  {
    klausimas: 'Parašyk raidinį reiškinį: „skaičius $x$ padidintas 12“.',
    atsakymas: 'x+12',
    atsakymasRodymui: '$x + 12$',
    sprendimas: 'Padidinti reiškia pridėti.',
  },
] as const

export const raidinisReiskinys: Generatorius = () => suBandymais(kurkRaidini, A_RAIDINIS, T2)

function kurkRaidini(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const n = atsitiktinis(3, 20)
  const k = atsitiktinis(2, 9)

  return variacija([
    // 1. Padidintas
    () =>
      uzdavinys(T2, {
        klausimas: `Parašyk raidinį reiškinį: „skaičius $${r}$ padidintas ${n}“.`,
        atsakymas: `${r}+${n}`,
        atsakymasRodymui: `$${r} + ${n}$`,
        sprendimas: 'Padidinti keliais vienetais reiškia pridėti.',
      }),

    // 2. Sumažintas
    () =>
      uzdavinys(T2, {
        klausimas: `Parašyk raidinį reiškinį: „skaičius $${r}$ sumažintas ${n}“.`,
        atsakymas: `${r}-${n}`,
        atsakymasRodymui: `$${r} - ${n}$`,
        sprendimas: 'Sumažinti keliais vienetais reiškia atimti.',
      }),

    // 3. Kiek kartų didesnis
    () =>
      uzdavinys(T2, {
        klausimas: `Parašyk raidinį reiškinį: „${k} kartus didesnis už $${r}$“.`,
        atsakymas: `${k}${r}`,
        atsakymasRodymui: `$${k}${r}$`,
        sprendimas: 'Kelis kartus didesnis reiškia padaugintas — daugybos ženklas tarp skaičiaus ir raidės nerašomas.',
      }),

    // 4. Kuris yra raidinis reiškinys
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuris užrašas yra raidinis reiškinys?',
        variantai: [`$${k}${r} + ${n}$`, `$${n} : ${k}$`, `$${n} + ${k}$`, `$${n} \\cdot ${k}$`],
        teisingas: 0,
        sprendimas: 'Raidiniame reiškinyje yra bent viena raidė, žyminti nežinomą skaičių.',
      }),

    // 5. Ką reiškia raidė
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ką reiškia raidė $${r}$ reiškinyje $${k}${r} + ${n}$?`,
        variantai: [
          'bet kokį skaičių, kurį galima įrašyti vietoj raidės',
          `visada tą patį skaičių, lygų ${k}`,
          'veiksmo ženklą',
          'reiškinio reikšmę',
        ],
        teisingas: 0,
        sprendimas: 'Įrašius vietoj raidės skaičių, gaunamas skaitinis reiškinys, kurio reikšmę galima apskaičiuoti.',
      }),

    // 6. Perimetras
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuris reiškinys yra stačiakampio, kurio kraštinės $a$ ir $b$, perimetras?',
        variantai: ['$2(a + b)$', '$a + b$', '$ab$', '$2ab$'],
        teisingas: 0,
        sprendimas: 'Perimetras yra visų kraštinių suma: $a + b + a + b = 2(a + b)$.',
      }),

    // 7. Klaidos radimas — dalyba nekomutatyvi
    () =>
      uzdavinys(T2, {
        klausimas: `Mokinys sakinį „skaičius $${r}$ padalytas iš ${k}“ užrašė $${k} : ${r}$. Užrašyk teisingą reiškinį.`,
        atsakymas: `${r}:${k}`,
        atsakymasRodymui: `$${r} : ${k}$`,
        sprendimas: 'Dalijamas yra tas skaičius, kuris sakinyje eina pirmas — dalyboje narių sukeisti negalima.',
      }),

    // 8. Trijų iš eilės einančių suma
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kuris reiškinys žymi trijų iš eilės einančių skaičių sumą, kai pirmasis yra $${r}$?`,
        variantai: [
          `$${r} + (${r} + 1) + (${r} + 2)$`,
          `$3${r}$`,
          `$${r} + 3$`,
          `$${r} + (${r} + 2) + (${r} + 4)$`,
        ],
        teisingas: 0,
        sprendimas: 'Kitas iš eilės einantis skaičius vienetu didesnis, dar kitas — dviem.',
      }),

    // 9. Situacija reiškiniui
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kuri situacija atitinka reiškinį $${k}${r} + ${n}$?`,
        variantai: [
          `${k} dėžės po $${r}$ ${D.obuoliai.kilm} ir dar ${kiek(n, D.obuoliai)}`,
          `$${r}$ ${D.obuoliai.kilm} padalyta į ${k} dėžes, o ${n} suvalgyta`,
          `$${r}$ ir ${k} dėžės po ${n} ${D.obuoliai.kilm}`,
          `${k} ${D.obuoliai.kilm} dėžėje, kurioje iš viso $${r} + ${n}$`,
        ],
        teisingas: 0,
        sprendimas: `${k} dėžės po $${r}$ duoda $${k}${r}$, o dar ${kiek(n, D.obuoliai)} pridedami.`,
      }),
  ])
}

// ── 7.1.3. Raidinio reiškinio reikšmės ──────────────────────────────────────

const T3 = 'raidinio-reiskinio-reiksmes'

const A_REIKSMES = [
  {
    klausimas: 'Apskaičiuok $3a + 5$, kai $a = 4$.',
    atsakymas: '17',
    atsakymasRodymui: '$17$',
    sprendimas: '$3 \\cdot 4 + 5 = 17$.',
  },
] as const

export const raidinioReiskinioReiksmes: Generatorius = () => suBandymais(kurkReiksmes, A_REIKSMES, T3)

function kurkReiksmes(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const k = atsitiktinis(2, 9)
  const n = atsitiktinis(3, 20)
  const reiksme = atsitiktinis(2, 12)

  return variacija([
    // 1. Su sudėtimi
    () =>
      uzdavinys(T3, {
        klausimas: `Apskaičiuok $${k}${r} + ${n}$, kai $${r} = ${reiksme}$.`,
        atsakymas: String(k * reiksme + n),
        atsakymasRodymui: `$${k * reiksme + n}$`,
        sprendimas: `$${k} \\cdot ${reiksme} + ${n} = ${k * reiksme} + ${n} = ${k * reiksme + n}$.`,
      }),

    // 2. Su atimtimi
    () => {
      const pradzia = atsitiktinis(k * reiksme + 1, k * reiksme + 40)
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok $${pradzia} - ${k}${r}$, kai $${r} = ${reiksme}$.`,
        atsakymas: String(pradzia - k * reiksme),
        atsakymasRodymui: `$${pradzia - k * reiksme}$`,
        sprendimas: `$${pradzia} - ${k} \\cdot ${reiksme} = ${pradzia} - ${k * reiksme} = ${pradzia - k * reiksme}$.`,
      })
    },

    // 3. Su dalyba
    () => {
      const daliklis = atsitiktinis(2, 8)
      const b = daliklis * reiksme
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok $${r} : ${daliklis} + ${n}$, kai $${r} = ${b}$.`,
        atsakymas: String(reiksme + n),
        atsakymasRodymui: `$${reiksme + n}$`,
        sprendimas: `$${b} : ${daliklis} = ${reiksme}$, tada $${reiksme} + ${n} = ${reiksme + n}$.`,
      })
    },

    // 4. Su dviem raidėmis
    () => {
      const antra = atsitiktinis(2, 8)
      const k2 = atsitiktinis(2, 5)
      if (k * reiksme <= k2 * antra) return null
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok $${k}a - ${k2}b$, kai $a = ${reiksme}$, $b = ${antra}$.`,
        atsakymas: String(k * reiksme - k2 * antra),
        atsakymasRodymui: `$${k * reiksme - k2 * antra}$`,
        sprendimas: `$${k} \\cdot ${reiksme} - ${k2} \\cdot ${antra} = ${k * reiksme} - ${k2 * antra} = ${k * reiksme - k2 * antra}$.`,
      })
    },

    // 5. Lentelė
    () =>
      uzdavinys(T3, {
        klausimas: `Lentelė pildoma pagal reiškinį $${k}${r} + ${n}$. Kokia bus trūkstama reikšmė?`,
        atsakymas: String(k * 5 + n),
        atsakymasRodymui: `$${k * 5 + n}$`,
        sprendimas: `Kai $${r} = 5$: $${k} \\cdot 5 + ${n} = ${k * 5 + n}$.`,
        brezinys: ivestiesLentele([0, 2, 5], [n, k * 2 + n, null]),
      }),

    // 6. Kuri reikšmė didžiausia
    () =>
      uzdavinys(T3, {
        klausimas: `Kuri $${r}$ reikšmė iš 2, 5 ir 8 duoda didžiausią reiškinio $${k}${r} - ${n}$ reikšmę?`,
        atsakymas: '8',
        atsakymasRodymui: '$8$',
        sprendimas: `Kuo $${r}$ didesnis, tuo didesnė ir sandauga $${k}${r}$, o atimama visada ${n}.`,
      }),

    // 7. Atvirkštinis uždavinys
    () =>
      uzdavinys(T3, {
        klausimas: `Rask $${r}$, jei reiškinio $${k}${r} + ${n}$ reikšmė lygi ${k * reiksme + n}.`,
        atsakymas: String(reiksme),
        atsakymasRodymui: `$${reiksme}$`,
        sprendimas: `$${k * reiksme + n} - ${n} = ${k * reiksme}$, o $${k * reiksme} : ${k} = ${reiksme}$.`,
      }),

    // 8. Klaidos radimas
    () =>
      uzdavinys(T3, {
        klausimas: `Mokinys, kai $${r} = ${reiksme}$, reiškinį $${k}${r}$ apskaičiavo $${k} + ${reiksme}$. Užrašyk teisingą reikšmę.`,
        atsakymas: String(k * reiksme),
        atsakymasRodymui: `$${k * reiksme}$`,
        sprendimas: `Užrašas $${k}${r}$ reiškia daugybą: $${k} \\cdot ${reiksme} = ${k * reiksme}$.`,
      }),
  ])
}

// ── 7.2.1. Dauginame ir dalijame iš skaičiaus ───────────────────────────────

const T4 = 'skliaustu-atskleidimas'

const A_SKLIAUSTAI = [
  {
    klausimas: 'Užrašyk be skliaustų: $3(a + 5)$.',
    atsakymas: '3a+15',
    atsakymasRodymui: '$3a + 15$',
    sprendimas: 'Daugiklis dauginamas iš kiekvieno skliaustų nario.',
  },
] as const

export const skliaustuAtskleidimas: Generatorius = () => suBandymais(kurkSkliaustus, A_SKLIAUSTAI, T4)

function kurkSkliaustus(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const k = atsitiktinis(2, 9)
  const n = atsitiktinis(2, 12)

  return variacija([
    // 1. Atskleidimas
    () =>
      uzdavinys(T4, {
        klausimas: `Užrašyk be skliaustų: $${k}(${r} + ${n})$.`,
        atsakymas: `${k}${r}+${k * n}`,
        atsakymasRodymui: `$${k}${r} + ${k * n}$`,
        sprendimas: `Kiekvienas skliaustų narys dauginamas iš ${k}: $${k} \\cdot ${r} = ${k}${r}$, $${k} \\cdot ${n} = ${k * n}$.`,
      }),

    // 2. Dalyba nariais
    () =>
      uzdavinys(T4, {
        klausimas: `Padalyk kiekvieną narį iš ${k}: $(${k * 2}${r} + ${k * n}) : ${k}$.`,
        atsakymas: `2${r}+${n}`,
        atsakymasRodymui: `$2${r} + ${n}$`,
        sprendimas: `$${k * 2}${r} : ${k} = 2${r}$, $${k * n} : ${k} = ${n}$.`,
      }),

    // 3. Bendrojo dauginamojo iškėlimas
    () =>
      uzdavinys(T4, {
        klausimas: `Užrašyk kaip sandaugą: $${k}${r} + ${k * n}$.`,
        atsakymas: `${k}(${r}+${n})`,
        atsakymasRodymui: `$${k}(${r} + ${n})$`,
        sprendimas: `Abu nariai dalūs iš ${k}, tad ${k} iškeliamas prieš skliaustus.`,
      }),

    // 4. Reikšmė po atskleidimo
    () => {
      const reiksme = atsitiktinis(2, 10)
      return uzdavinys(T4, {
        klausimas: `Apskaičiuok $${k}(${r} + ${n})$, kai $${r} = ${reiksme}$.`,
        atsakymas: String(k * (reiksme + n)),
        atsakymasRodymui: `$${k * (reiksme + n)}$`,
        sprendimas: `$${k}(${reiksme} + ${n}) = ${k} \\cdot ${reiksme + n} = ${k * (reiksme + n)}$.`,
      })
    },

    // 5. Atskleidimas su sutraukimu
    () => {
      const k2 = atsitiktinis(1, k * 2 - 1)
      return uzdavinys(T4, {
        klausimas: `Supaprastink: $${k}(2${r} + ${n}) - ${k2}${r}$.`,
        atsakymas: `${2 * k - k2}${r}+${k * n}`,
        atsakymasRodymui: `$${2 * k - k2}${r} + ${k * n}$`,
        sprendimas: `Atskleidus: $${2 * k}${r} + ${k * n} - ${k2}${r}$; sutraukus: $${2 * k - k2}${r} + ${k * n}$.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: `Mokinys $${k}(${r} + ${n})$ užrašė $${k}${r} + ${n}$. Užrašyk teisingą rezultatą.`,
        atsakymas: `${k}${r}+${k * n}`,
        atsakymasRodymui: `$${k}${r} + ${k * n}$`,
        sprendimas: `Daugikliu ${k} reikia padauginti abu skliaustų narius, ne tik pirmąjį.`,
      }),

    // 7. Didžiausias bendrasis dauginamasis
    () =>
      uzdavinys(T4, {
        klausimas: `Iškelk didžiausią bendrą dauginamąjį: $${k * 2}${r} + ${k * 2 * n}$. Koks skaičius atsidurs prieš skliaustus?`,
        atsakymas: String(k * 2),
        atsakymasRodymui: `$${k * 2}$`,
        sprendimas: `Abu nariai dalūs iš ${k * 2}: $${k * 2}(${r} + ${n})$.`,
      }),

    // 8. Situacija reiškiniui
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kuri situacija atitinka reiškinį $${k}(a + ${n})$?`,
        variantai: [
          `${k} vienodų rinkinių, kurių kiekviename yra $a$ ${D.rutuliukai.kilm} ir dar ${kiek(n, D.rutuliukai)}`,
          `$a$ rinkiniai po ${k} ${D.rutuliukai.kilm} ir dar ${kiek(n, D.rutuliukai)}`,
          `${k} ${D.rutuliukai.kilm} ir dar $a$ rinkiniai po ${n}`,
          `$a$ ${D.rutuliukai.kilm}, padalytų į ${k} rinkinius`,
        ],
        teisingas: 0,
        sprendimas: `Skliaustuose yra vieno rinkinio turinys, o ${k} rodo, kiek tokių rinkinių.`,
      }),
  ])
}

// ── 7.2.2. Panašieji nariai, jų sutraukimas ─────────────────────────────────

const T5 = 'panasieji-nariai'

const A_PANASUS = [
  {
    klausimas: 'Sutrauk panašiuosius narius: $3x + 5x$.',
    atsakymas: '8x',
    atsakymasRodymui: '$8x$',
    sprendimas: 'Sudedami koeficientai: $3 + 5 = 8$.',
  },
] as const

export const panasiejiNariai: Generatorius = () => suBandymais(kurkPanasius, A_PANASUS, T5)

function kurkPanasius(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const a = atsitiktinis(2, 12)
  const b = atsitiktinis(2, 12)
  const n = atsitiktinis(2, 15)

  return variacija([
    // 1. Sudėtis
    () =>
      uzdavinys(T5, {
        klausimas: `Sutrauk panašiuosius narius: $${a}${r} + ${b}${r}$.`,
        atsakymas: `${a + b}${r}`,
        atsakymasRodymui: `$${a + b}${r}$`,
        sprendimas: `Sudedami koeficientai: $${a} + ${b} = ${a + b}$.`,
      }),

    // 2. Atimtis
    () => {
      if (a <= b) return null
      return uzdavinys(T5, {
        klausimas: `Sutrauk: $${a}${r} - ${b}${r}$.`,
        atsakymas: `${a - b}${r}`,
        atsakymasRodymui: `$${a - b}${r}$`,
        sprendimas: `$${a} - ${b} = ${a - b}$, raidė nesikeičia.`,
      })
    },

    // 3. Su laisvuoju nariu
    () =>
      uzdavinys(T5, {
        klausimas: `Supaprastink: $${a}${r} + ${n} + ${b}${r}$.`,
        atsakymas: `${a + b}${r}+${n}`,
        atsakymasRodymui: `$${a + b}${r} + ${n}$`,
        sprendimas: `Panašūs tik nariai su raide: $${a}${r} + ${b}${r} = ${a + b}${r}$; ${n} lieka atskirai.`,
      }),

    // 4. Kurie nariai panašūs
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kurie nariai yra panašūs: $${a}x$, $${n}$, $${b}x$, $${a}y$?`,
        variantai: [`$${a}x$ ir $${b}x$`, `$${a}x$ ir $${a}y$`, `$${n}$ ir $${a}x$`, 'visi keturi'],
        teisingas: 0,
        sprendimas: 'Panašūs yra tie nariai, kurie turi tą pačią raidę.',
      }),

    // 5. Keturi nariai
    () => {
      const c = atsitiktinis(1, a + b - 1)
      return uzdavinys(T5, {
        klausimas: `Sutrauk: $${a + b}${r} + ${n} - ${c}${r} + ${n}$.`,
        atsakymas: `${a + b - c}${r}+${2 * n}`,
        atsakymasRodymui: `$${a + b - c}${r} + ${2 * n}$`,
        sprendimas: `Nariai su raide: $${a + b} - ${c} = ${a + b - c}$; skaičiai: $${n} + ${n} = ${2 * n}$.`,
      })
    },

    // 6. Su dviem raidėmis
    () => {
      const c = atsitiktinis(2, 8)
      const d = atsitiktinis(1, c - 1)
      return uzdavinys(T5, {
        klausimas: `Supaprastink: $${a}a + ${c}b + ${b}a - ${d}b$.`,
        atsakymas: `${a + b}a+${c - d}b`,
        atsakymasRodymui: `$${a + b}a + ${c - d}b$`,
        sprendimas: `Atskirai sutraukiami nariai su $a$ ir su $b$: $${a} + ${b} = ${a + b}$, $${c} - ${d} = ${c - d}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: `Mokinys $${a}${r} + ${n}$ sutraukė į $${a + n}${r}$. Šio reiškinio sutraukti negalima — užrašyk jį nepakeistą.`,
        atsakymas: `${a}${r}+${n}`,
        atsakymasRodymui: `$${a}${r} + ${n}$`,
        sprendimas: `$${a}${r}$ ir ${n} nėra panašūs nariai — vienas su raide, kitas be jos, tad sudėti jų negalima.`,
      }),

    // 8. Reikšmė po sutraukimo
    () => {
      const reiksme = atsitiktinis(2, 10)
      if (a <= b) return null
      return uzdavinys(T5, {
        klausimas: `Rask reiškinio $${a}${r} - ${b}${r} + ${n}$ reikšmę, kai $${r} = ${reiksme}$. Pirmiausia sutrauk panašiuosius narius.`,
        atsakymas: String((a - b) * reiksme + n),
        atsakymasRodymui: `$${(a - b) * reiksme + n}$`,
        sprendimas: `Sutraukus: $${a - b}${r} + ${n}$. Įrašius: $${a - b} \\cdot ${reiksme} + ${n} = ${(a - b) * reiksme + n}$.`,
      })
    },
  ])
}

// ── 7.3.1. Skaitinių lygybių savybės ────────────────────────────────────────

const T6 = 'lygybiu-savybes'

const A_LYGYBES = [
  {
    klausimas: 'Jei $8 + 5 = 13$, kam lygu $8 + 5 + 4$?',
    atsakymas: '17',
    atsakymasRodymui: '$17$',
    sprendimas: 'Prie abiejų pusių pridėjus tą patį skaičių, lygybė išlieka teisinga.',
  },
] as const

export const lygybiuSavybes: Generatorius = () => suBandymais(kurkLygybes, A_LYGYBES, T6)

function kurkLygybes(): Uzdavinys | null {
  const a = atsitiktinis(5, 40)
  const b = atsitiktinis(5, 40)
  const k = atsitiktinis(2, 9)
  const r = pasirink(RAIDES)

  return variacija([
    // 1. Pridedame prie abiejų pusių
    () =>
      uzdavinys(T6, {
        klausimas: `Žinoma, kad $${a} + ${b} = ${a + b}$. Kam lygu $${a} + ${b} + ${k}$?`,
        atsakymas: String(a + b + k),
        atsakymasRodymui: `$${a + b + k}$`,
        sprendimas: `Prie abiejų lygybės pusių pridėjus ${k}, lygybė lieka teisinga: $${a + b} + ${k} = ${a + b + k}$.`,
      }),

    // 2. Užbaigiame lygybę
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Jei $a = b$, tai kam lygu $a + ${k}$?`,
        variantai: [`$b + ${k}$`, '$b$', `$b \\cdot ${k}$`, `$b - ${k}$`],
        teisingas: 0,
        sprendimas: 'Prie abiejų lygių dydžių pridėjus tą patį skaičių, gaunami lygūs dydžiai.',
      }),

    // 3. Dalyba iš to paties
    () => {
      const sandauga = k * 2 * a
      return uzdavinys(T6, {
        klausimas: `Iš lygybės $${sandauga} = ${k * a} \\cdot 2$ abi puses padalyk iš 2. Kokia bus kairioji naujos lygybės pusė?`,
        atsakymas: String(sandauga / 2),
        atsakymasRodymui: `$${sandauga / 2}$`,
        sprendimas: `$${sandauga} : 2 = ${sandauga / 2}$, o dešinėje lieka ${k * a}.`,
      })
    },

    // 4. Kas nutinka pridėjus
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kas nutinka teisingai lygybei, kai prie abiejų jos pusių pridedamas tas pats skaičius?',
        variantai: [
          'ji lieka teisinga',
          'ji tampa klaidinga',
          'ji tampa nelygybe',
          'kairioji pusė tampa didesnė',
        ],
        teisingas: 0,
        sprendimas: 'Abi pusės pasikeičia vienodai, tad lieka lygios.',
      }),

    // 5. Vienpusis pakeitimas
    () =>
      uzdavinys(T6, {
        klausimas: `Prie lygybės $${a} + ${b} = ${a + b}$ kairiosios pusės pridėta ${k}, o dešinioji nepakeista. Kiek dabar kairioji pusė didesnė už dešiniąją?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: 'Pakeitus tik vieną pusę, lygybė suyra — skirtumas lygus pridėtam skaičiui.',
      }),

    // 6. Atimame iš abiejų pusių
    () => {
      const c = atsitiktinis(2, 12)
      const desine = k * a + c
      return uzdavinys(T6, {
        klausimas: `Iš lygybės $${k}${r} + ${c} = ${desine}$ abiejose pusėse atimk ${c}. Kam bus lygi dešinioji pusė?`,
        atsakymas: String(desine - c),
        atsakymasRodymui: `$${desine - c}$`,
        sprendimas: `$${desine} - ${c} = ${desine - c}$, o kairėje lieka $${k}${r}$.`,
      })
    },

    // 7. Daugyba iš to paties
    () =>
      uzdavinys(T6, {
        klausimas: `Abi teisingos lygybės $${a} + ${b} = ${a + b}$ puses padaugink iš ${k}. Kam bus lygi dešinioji pusė?`,
        atsakymas: String((a + b) * k),
        atsakymasRodymui: `$${(a + b) * k}$`,
        sprendimas: `$${a + b} \\cdot ${k} = ${(a + b) * k}$ — kairioji pusė duoda tą patį.`,
      }),

    // 8. Kodėl negalima dalyti iš nulio
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Iš kokio skaičiaus abiejų lygybės pusių dalyti negalima?',
        variantai: ['iš nulio', 'iš vieneto', 'iš nelyginio skaičiaus', 'iš lyginio skaičiaus'],
        teisingas: 0,
        sprendimas: 'Dalyba iš nulio neapibrėžta, todėl ši savybė galioja tik nelygiems nuliui skaičiams.',
      }),
  ])
}

// ── 7.3.2. Lygtis ir jos sprendinys ─────────────────────────────────────────

const T7 = 'lygtis-ir-sprendinys'

const A_SPRENDINYS = [
  {
    klausimas: 'Rask lygties $x - 9 = 14$ sprendinį.',
    atsakymas: '23',
    atsakymasRodymui: '$x = 23$',
    sprendimas: '$14 + 9 = 23$.',
  },
] as const

export const lygtisIrSprendinys: Generatorius = () => suBandymais(kurkSprendini, A_SPRENDINYS, T7)

function kurkSprendini(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const sprendinys = atsitiktinis(3, 20)
  const n = atsitiktinis(3, 25)
  const k = atsitiktinis(2, 8)

  return variacija([
    // 1. Ar tinka
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Ar $${r} = ${sprendinys}$ yra lygties $${r} + ${n} = ${sprendinys + n}$ sprendinys?`,
        variantai: [
          'taip, nes įrašius gaunama teisinga lygybė',
          'ne, nes skaičiai nesutampa',
          'taip, nes lygtyje yra sudėtis',
        ],
        teisingas: 0,
        sprendimas: `$${sprendinys} + ${n} = ${sprendinys + n}$ — lygybė teisinga.`,
      }),

    // 2. Rask sprendinį
    () =>
      uzdavinys(T7, {
        klausimas: `Rask lygties $${r} - ${n} = ${sprendinys}$ sprendinį.`,
        atsakymas: String(sprendinys + n),
        atsakymasRodymui: `$${r} = ${sprendinys + n}$`,
        sprendimas: `$${sprendinys} + ${n} = ${sprendinys + n}$.`,
      }),

    // 3. Kas yra sprendinys
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ką vadiname lygties sprendiniu?',
        variantai: [
          'nežinomojo reikšmę, su kuria lygybė tampa teisinga',
          'bet kurį lygtyje esantį skaičių',
          'raidę, kuri žymi nežinomąjį',
          'veiksmą, kurį reikia atlikti',
        ],
        teisingas: 0,
        sprendimas: 'Sprendinį įrašius vietoj raidės, kairioji pusė tampa lygi dešiniajai.',
      }),

    // 4. Patikra
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Ar ${sprendinys} tinka lygčiai $${k}${r} = ${k * sprendinys}$?`,
        variantai: ['taip', 'ne', 'to patikrinti neįmanoma'],
        teisingas: 0,
        sprendimas: `$${k} \\cdot ${sprendinys} = ${k * sprendinys}$ — lygybė teisinga.`,
      }),

    // 5. Kuris iš trijų
    () =>
      uzdavinys(T7, {
        klausimas: `Kuris iš skaičių ${sprendinys - 2}, ${sprendinys}, ${sprendinys + 3} yra lygties $${k}${r} + ${n} = ${k * sprendinys + n}$ sprendinys?`,
        atsakymas: String(sprendinys),
        atsakymasRodymui: `$${sprendinys}$`,
        sprendimas: `Įrašius ${sprendinys}: $${k} \\cdot ${sprendinys} + ${n} = ${k * sprendinys + n}$ — lygybė teisinga.`,
      }),

    // 6. Nežinomasis
    () =>
      uzdavinys(T7, {
        klausimas: `Kuri raidė žymi nežinomąjį lygtyje $${k}y + ${n} = ${k * sprendinys + n}$?`,
        atsakymas: 'y',
        atsakymasRodymui: '$y$',
        sprendimas: 'Nežinomasis — tai raidė, kurios reikšmę reikia rasti.',
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T7, {
        klausimas: `Mokinys lygties $${r} - ${n} = ${sprendinys}$ sprendiniu laiko ${Math.abs(n - sprendinys)}. Patikrink ir užrašyk teisingą sprendinį.`,
        atsakymas: String(sprendinys + n),
        atsakymasRodymui: `$${sprendinys + n}$`,
        sprendimas: `Nežinomasis yra turinys, tad prie skirtumo pridedamas atėminys: $${sprendinys} + ${n} = ${sprendinys + n}$.`,
      }),

    // 8. Lygtis pagal sprendinį
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Kurios lygties sprendinys yra $${r} = ${sprendinys}$?`,
        variantai: [
          `$${r} + ${n} = ${sprendinys + n}$`,
          `$${r} + ${n} = ${sprendinys}$`,
          `$${r} - ${n} = ${sprendinys}$`,
          `$${k}${r} = ${sprendinys}$`,
        ],
        teisingas: 0,
        sprendimas: `Įrašius ${sprendinys}: $${sprendinys} + ${n} = ${sprendinys + n}$ — vienintelė teisinga lygybė.`,
      }),
  ])
}

// ── 7.3.3. Lygties sprendimas ───────────────────────────────────────────────

const T8 = 'lygties-sprendimas-5'

const A_SPRENDIMAS = [
  {
    klausimas: 'Išspręsk: $x + 18 = 45$.',
    atsakymas: '27',
    atsakymasRodymui: '$x = 27$',
    sprendimas: '$45 - 18 = 27$.',
  },
] as const

export const lygtiesSprendimas5: Generatorius = () => suBandymais(kurkSprendima, A_SPRENDIMAS, T8)

function kurkSprendima(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const x = atsitiktinis(3, 25)
  const n = atsitiktinis(4, 40)
  const k = atsitiktinis(2, 9)

  return variacija([
    // 1. Su sudėtimi
    () =>
      uzdavinys(T8, {
        klausimas: `Išspręsk: $${r} + ${n} = ${x + n}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `Nežinomas dėmuo: $${x + n} - ${n} = ${x}$.`,
      }),

    // 2. Su daugyba
    () =>
      uzdavinys(T8, {
        klausimas: `Išspręsk: $${k}${r} = ${k * x}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `Nežinomas daugiklis: $${k * x} : ${k} = ${x}$.`,
      }),

    // 3. Su dalyba
    () =>
      uzdavinys(T8, {
        klausimas: `Išspręsk: $${r} : ${k} = ${x}$.`,
        atsakymas: String(k * x),
        atsakymasRodymui: `$${r} = ${k * x}$`,
        sprendimas: `Nežinomas dalinys: $${x} \\cdot ${k} = ${k * x}$.`,
      }),

    // 4. Nežinomas atėminys
    () =>
      uzdavinys(T8, {
        klausimas: `Išspręsk: $${x + n} - ${r} = ${n}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `Nežinomas atėminys: $${x + n} - ${n} = ${x}$.`,
      }),

    // 5. Du veiksmai
    () =>
      uzdavinys(T8, {
        klausimas: `Išspręsk: $${k}${r} + ${n} = ${k * x + n}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `Pirma $${k * x + n} - ${n} = ${k * x}$, tada $${k * x} : ${k} = ${x}$.`,
      }),

    // 6. Su skliaustais
    () =>
      uzdavinys(T8, {
        klausimas: `Išspręsk: $${k}(${r} + ${n}) = ${k * (x + n)}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `$${k * (x + n)} : ${k} = ${x + n}$, tada $${x + n} - ${n} = ${x}$.`,
      }),

    // 7. Su atimtimi nuo skaičiaus
    () => {
      const visas = k * x + n
      return uzdavinys(T8, {
        klausimas: `Išspręsk ir patikrink: $${visas} - ${k}${r} = ${n}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${r} = ${x}$`,
        sprendimas: `$${visas} - ${n} = ${k * x}$, tada $${k * x} : ${k} = ${x}$. Patikra: $${visas} - ${k} \\cdot ${x} = ${n}$.`,
      })
    },

    // 8. Klaidos radimas — veiksmų seka
    () =>
      uzdavinys(T8, {
        klausimas: `Lygtyje $${k}${r} + ${n} = ${k * x + n}$ mokinys iš karto ${k * x + n} padalijo iš ${k}. Pirmiausia reikėjo iš abiejų pusių atimti ${n} — kas tada lieka dešinėje?`,
        atsakymas: String(k * x),
        atsakymasRodymui: `$${k * x}$`,
        sprendimas: `$${k * x + n} - ${n} = ${k * x}$. Tik tada dalijama iš ${k}, ir gaunama $${r} = ${x}$.`,
      }),
  ])
}

// ── 7.3.4. Tekstinių uždavinių sprendimas sudarant lygtis ───────────────────

const T9 = 'tekstiniai-su-lygtimis-5'

const A_TEKSTINIAI = [
  {
    klausimas: 'Skaičių padidinus 8 gaunama 25. Sudaryk lygtį ir rask skaičių.',
    atsakymas: '17',
    atsakymasRodymui: '$x + 8 = 25$, $x = 17$',
    sprendimas: '$25 - 8 = 17$.',
  },
] as const

export const tekstiniaiSuLygtimis5: Generatorius = () => suBandymais(kurkTekstinius, A_TEKSTINIAI, T9)

function kurkTekstinius(): Uzdavinys | null {
  const x = atsitiktinis(4, 25)
  const n = atsitiktinis(3, 20)
  const k = atsitiktinis(2, 8)

  return variacija([
    // 1. Padidinus
    () =>
      uzdavinys(T9, {
        klausimas: `Skaičių padidinus ${n} gaunama ${x + n}. Sudaryk lygtį ir rask skaičių.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x + ${n} = ${x + n}$, $x = ${x}$`,
        sprendimas: `$${x + n} - ${n} = ${x}$.`,
      }),

    // 2. Vienodos dėžės
    () =>
      uzdavinys(T9, {
        klausimas: `${k} vienodose dėžėse yra ${kiek(k * x, D.obuoliai)}. Sudaryk lygtį ir rask, kiek obuolių yra vienoje dėžėje.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${k}x = ${k * x}$, $x = ${x}$`,
        sprendimas: `$${k * x} : ${k} = ${x}$.`,
      }),

    // 3. Dviejų daiktų kaina
    () => {
      const vardas = pasirink(VARDAI)
      return uzdavinys(T9, {
        klausimas: `${vardas} nusipirko knygą ir sąsiuvinį — iš viso už ${x + n} Eur. Knyga kainuoja ${n} Eur. Sudaryk lygtį ir rask sąsiuvinio kainą.`,
        atsakymas: String(x),
        atsakymasRodymui: `$x + ${n} = ${x + n}$, $x = ${x}$ Eur`,
        sprendimas: `$${x + n} - ${n} = ${x}$ (Eur).`,
      })
    },

    // 4. Stačiakampio plotis
    () => {
      const ilgis = atsitiktinis(5, 15)
      const plotis = atsitiktinis(3, ilgis - 1)
      return uzdavinys(T9, {
        klausimas: `Stačiakampio perimetras ${2 * (ilgis + plotis)} cm, ilgis ${ilgis} cm. Sudaryk lygtį ir rask plotį.`,
        atsakymas: String(plotis),
        atsakymasRodymui: `$2(${ilgis} + x) = ${2 * (ilgis + plotis)}$, $x = ${plotis}$ cm`,
        sprendimas: `$${2 * (ilgis + plotis)} : 2 = ${ilgis + plotis}$, tada $${ilgis + plotis} - ${ilgis} = ${plotis}$.`,
      })
    },

    // 5. Dėžės ir dar atskirai
    () =>
      uzdavinys(T9, {
        klausimas: `Vienoje dėžėje yra $x$ pieštukų. ${k} dėžėse ir dar ${kiek(n, D.pieststukai)} iš viso yra ${k * x + n}. Sudaryk lygtį ir ją išspręsk.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${k}x + ${n} = ${k * x + n}$, $x = ${x}$`,
        sprendimas: `$${k * x + n} - ${n} = ${k * x}$, tada $${k * x} : ${k} = ${x}$.`,
      }),

    // 6. Amžiai
    () => {
      const skirtumas = atsitiktinis(20, 30)
      const sunus = atsitiktinis(8, 16)
      return uzdavinys(T9, {
        klausimas: `Tėvas yra ${skirtumas} metais vyresnis už sūnų. Jų amžių suma ${2 * sunus + skirtumas} metai. Sudaryk lygtį ir rask sūnaus amžių.`,
        atsakymas: String(sunus),
        atsakymasRodymui: `$x + (x + ${skirtumas}) = ${2 * sunus + skirtumas}$, $x = ${sunus}$`,
        sprendimas: `$${2 * sunus + skirtumas} - ${skirtumas} = ${2 * sunus}$, tada $${2 * sunus} : 2 = ${sunus}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Uždaviniui „${k} vienodi bilietai ir ${n} Eur mokestis kainuoja ${k * x + n} Eur“ mokinys sudarė lygtį $${k} + x + ${n} = ${k * x + n}$. Kuri lygtis teisinga?`,
        variantai: [
          `$${k}x + ${n} = ${k * x + n}$`,
          `$${k} + x + ${n} = ${k * x + n}$`,
          `$x + ${k} \\cdot ${n} = ${k * x + n}$`,
          `$${k}(x + ${n}) = ${k * x + n}$`,
        ],
        teisingas: 0,
        sprendimas: `${k} bilietai po $x$ Eur kainuoja $${k}x$ Eur, o mokestis pridedamas vieną kartą.`,
      }),

    // 8. Stačiakampis su sąryšiu
    () => {
      const plotis = atsitiktinis(3, 12)
      const skirtumas = atsitiktinis(2, 6)
      const perimetras = 2 * (plotis + plotis + skirtumas)
      return uzdavinys(T9, {
        klausimas: `Stačiakampio ilgis ${skirtumas} cm didesnis už plotį, o perimetras ${perimetras} cm. Sudaryk lygtį ir rask plotį.`,
        atsakymas: String(plotis),
        atsakymasRodymui: `$2(x + x + ${skirtumas}) = ${perimetras}$, $x = ${plotis}$ cm`,
        sprendimas: `$${perimetras} : 2 = ${plotis * 2 + skirtumas}$; $${plotis * 2 + skirtumas} - ${skirtumas} = ${plotis * 2}$; $${plotis * 2} : 2 = ${plotis}$.`,
      })
    },
  ])
}

// ── Skaičių sekos ir įvesties–išvesties lentelės ────────────────────────────
//
// Programos potemė, kurios turinio apraše nėra. Taisyklė, pagal kurią iš
// įvesties gaunama išvestis, yra raidinis reiškinys, tad ji priklauso šiai
// temai.

const T10 = 'skaiciu-sekos-lenteles'

const A_SEKOS = [
  {
    klausimas: 'Seka: 3, 7, 11, 15, … Koks bus penktasis jos narys?',
    atsakymas: '19',
    atsakymasRodymui: '$19$',
    sprendimas: 'Kiekvienas narys 4 didesnis už ankstesnį.',
  },
] as const

export const skaiciuSekosLenteles: Generatorius = () => suBandymais(kurkSekas, A_SEKOS, T10)

function kurkSekas(): Uzdavinys | null {
  const pradzia = atsitiktinis(2, 15)
  const zingsnis = atsitiktinis(2, 9)
  const k = atsitiktinis(2, 6)
  const n = atsitiktinis(1, 12)

  return variacija([
    // 1. Kitas didėjančios sekos narys
    () => {
      const seka = [0, 1, 2, 3].map((i) => pradzia + i * zingsnis)
      return uzdavinys(T10, {
        klausimas: `Seka: ${seka.join(', ')}, … Koks bus penktasis jos narys?`,
        atsakymas: String(pradzia + 4 * zingsnis),
        atsakymasRodymui: `$${pradzia + 4 * zingsnis}$`,
        sprendimas: `Kiekvienas narys ${zingsnis} didesnis už ankstesnį: $${seka[3]} + ${zingsnis} = ${pradzia + 4 * zingsnis}$.`,
      })
    },

    // 2. Mažėjanti seka
    () => {
      const start = pradzia + 4 * zingsnis + 20
      const seka = [0, 1, 2, 3].map((i) => start - i * zingsnis)
      return uzdavinys(T10, {
        klausimas: `Mažėjanti seka: ${seka.join(', ')}, … Koks bus penktasis jos narys?`,
        atsakymas: String(start - 4 * zingsnis),
        atsakymasRodymui: `$${start - 4 * zingsnis}$`,
        sprendimas: `Kiekvienas narys ${zingsnis} mažesnis už ankstesnį.`,
      })
    },

    // 3. Sekos taisyklė
    () => {
      const seka = [0, 1, 2, 3].map((i) => pradzia + i * zingsnis)
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Kokia sekos ${seka.join(', ')}, … taisyklė?`,
        variantai: [
          `prie ankstesnio nario pridedama ${zingsnis}`,
          `ankstesnis narys dauginamas iš ${zingsnis}`,
          `iš ankstesnio nario atimama ${zingsnis}`,
          `prie ankstesnio nario pridedama ${pradzia}`,
        ],
        teisingas: 0,
        sprendimas: `$${seka[1]} - ${seka[0]} = ${zingsnis}$, ir toliau skirtumas toks pat.`,
      })
    },

    // 4. Lentelės išvestis
    () => {
      const ivestis = [1, 2, 3, 5]
      const isvestis = ivestis.map((v) => k * v + n)
      return uzdavinys(T10, {
        klausimas: 'Lentelė užpildyta pagal vieną taisyklę. Kokia bus išvestis, kai įvestis 5?',
        atsakymas: String(k * 5 + n),
        atsakymasRodymui: `$${k * 5 + n}$`,
        sprendimas: `Taisyklė yra $${k}x + ${n}$: $${k} \\cdot 5 + ${n} = ${k * 5 + n}$.`,
        brezinys: ivestiesLentele(ivestis, [isvestis[0], isvestis[1], isvestis[2], null]),
      })
    },

    // 5. Lentelės taisyklė
    () => {
      const ivestis = [1, 2, 3, 4]
      const isvestis = ivestis.map((v) => k * v + n)
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kokia taisyklė sieja lentelės įvestį ir išvestį?',
        variantai: [`$${k}x + ${n}$`, `$x + ${k + n}$`, `$${k + n}x$`, `$${k}x - ${n}$`],
        teisingas: 0,
        sprendimas: `Kai $x = 1$, gaunama ${isvestis[0]}; kai $x = 2$ — ${isvestis[1]}. Kiekvienas žingsnis padidina išvestį ${k}, o pridedama visada ${n}.`,
        brezinys: ivestiesLentele(ivestis, isvestis),
      })
    },

    // 6. Atvirkštinis: kokia buvo įvestis
    () =>
      uzdavinys(T10, {
        klausimas: `Taisyklė yra $${k}x + ${n}$. Kokia buvo įvestis, jei išvestis lygi ${k * 7 + n}?`,
        atsakymas: '7',
        atsakymasRodymui: '$7$',
        sprendimas: `$${k * 7 + n} - ${n} = ${k * 7}$, tada $${k * 7} : ${k} = 7$.`,
      }),

    // 7. Daugybos seka
    () => {
      const daugiklis = atsitiktinis(2, 4)
      const seka = [0, 1, 2, 3].map((i) => pradzia * daugiklis ** i)
      if (seka[3] > 5000) return null
      return uzdavinys(T10, {
        klausimas: `Seka: ${seka.join(', ')}, … Koks bus penktasis šios sekos narys?`,
        atsakymas: String(seka[3] * daugiklis),
        atsakymasRodymui: `$${seka[3] * daugiklis}$`,
        sprendimas: `Kiekvienas narys ${daugiklis} kartus didesnis už ankstesnį: $${seka[3]} \\cdot ${daugiklis} = ${seka[3] * daugiklis}$.`,
      })
    },

    // 8. Trūkstamas vidurinis narys
    () => {
      const seka = [0, 1, 2, 3, 4].map((i) => pradzia + i * zingsnis)
      return uzdavinys(T10, {
        klausimas: `Sekoje trūksta vieno nario: ${seka[0]}, ${seka[1]}, ?, ${seka[3]}, ${seka[4]}. Koks jis?`,
        atsakymas: String(seka[2]),
        atsakymasRodymui: `$${seka[2]}$`,
        sprendimas: `Skirtumas tarp gretimų narių ${zingsnis}: $${seka[1]} + ${zingsnis} = ${seka[2]}$.`,
      })
    },

    // 9. Rikiavimas pagal taisyklę
    () => {
      const nariai = sumaisyk([1, 2, 3, 4]).map((v) => k * v + n)
      const eile = [...nariai].sort((a, b) => a - b)
      return eiliskumoUzdavinys(naujasId(T10), T10, {
        klausimas: `Šie skaičiai gauti pagal taisyklę $${k}x + ${n}$, kai $x$ yra 1, 2, 3 ir 4. Surikiuok juos ta tvarka, kuria didėja $x$.`,
        teisingaEile: eile.map(String),
        sprendimas: 'Kuo didesnis $x$, tuo didesnė reikšmė, tad eilė sutampa su didėjimo tvarka.',
      })
    },
  ])
}
