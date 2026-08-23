import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { daiktuEile, type Daiktas } from './ikonos'
import { piktograma, stulpeliai, type Eilute } from './pirmoku-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 1 klasės 6 tema „Tyrinėju reiškinį „Ženklai““ ir 7 tema „Duomenys“.
 *
 * Abi anksčiau rėmėsi bendraisiais generatoriais: „Ženklai“ duodavo romėniškus
 * skaitmenis ir skaitmenų sumas visose trijose potemėse, o visos šešios
 * „Duomenų“ potemės — tą pačią stulpelinę diagramą, dažnai su nederančiu
 * sakiniu („Kiek klases turi daugiau nei 7 medelių?“).
 *
 * Pirmoje klasėje duomenų tema yra apie skaitymą, ne apie skaičiavimą:
 * suskaičiuoti piktogramos paveikslėlius, nuskaityti stulpelio aukštį,
 * pasakyti, kur daugiausia. Todėl čia daug pasirenkamojo atsakymo uždavinių —
 * jie ir tikrina supratimą.
 */

const VARDAI = ['Ugnė', 'Matas', 'Ieva', 'Lina', 'Tomas'] as const

// ═══ 6 tema. Ženklai ════════════════════════════════════════════════════════

// ── 6.1 Kodėl svarbu suprasti ženklus? ──────────────────────────────────────

const A_ZENKLAI = [
  {
    klausimas: 'Paukštelis reiškia 3. Kiek bus paukštelis + paukštelis?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: 'Abu paukšteliai reiškia po 3: $3 + 3 = 6$.',
  },
] as const

export const zenkluReiksme: Generatorius = () =>
  suBandymais(kurkZenkluReiksme, A_ZENKLAI, 'zenklu-reiksme')

/** Figūros, kurios uždavinyje pakeičia skaičių. */
const FIGUROS = [
  { vardas: 'paukštelis', kas: 'paukstis' as Daiktas },
  { vardas: 'žvaigždė', kas: 'zvaigzde' as Daiktas },
  { vardas: 'obuolys', kas: 'obuolys' as Daiktas },
  { vardas: 'gėlė', kas: 'gele' as Daiktas },
]

function kurkZenkluReiksme(): Uzdavinys | null {
  const [a, b] = sumaisyk(FIGUROS).slice(0, 2)
  const aVerte = atsitiktinis(2, 9)
  const bVerte = atsitiktinis(2, 9)
  if (aVerte === bVerte) return null

  return variacija([
    // 1. Tas pats ženklas du kartus
    () =>
      uzdavinys('zenklu-reiksme', {
        klausimas: `Ženklas „${a.vardas}“ reiškia ${aVerte}. Kiek bus ${a.vardas} + ${a.vardas}?`,
        atsakymas: String(aVerte * 2),
        atsakymasRodymui: `$${aVerte * 2}$`,
        sprendimas: `Abu ženklai reiškia po ${aVerte}: $${aVerte} + ${aVerte} = ${aVerte * 2}$.`,
        brezinys: daiktuEile([{ daiktas: a.kas, kiek: 2 }], 34),
      }),

    // 2. Du skirtingi ženklai
    () =>
      uzdavinys('zenklu-reiksme', {
        klausimas: `Ženklas „${a.vardas}“ reiškia ${aVerte}, o „${b.vardas}“ — ${bVerte}. Kiek bus ${a.vardas} + ${b.vardas}?`,
        atsakymas: String(aVerte + bVerte),
        atsakymasRodymui: `$${aVerte + bVerte}$`,
        sprendimas: `$${aVerte} + ${bVerte} = ${aVerte + bVerte}$.`,
        brezinys: daiktuEile(
          [
            { daiktas: a.kas, kiek: 1 },
            { daiktas: b.kas, kiek: 1 },
          ],
          34,
        ),
      }),

    // 3. Koks skaičius slepiasi po ženklu
    () => {
      const suma = aVerte + bVerte
      return uzdavinys('zenklu-reiksme', {
        klausimas: `Žinoma, kad ${a.vardas} + ${b.vardas} = ${suma}, o ${a.vardas} = ${aVerte}. Koks skaičius slepiasi po ženklu „${b.vardas}“?`,
        atsakymas: String(bVerte),
        atsakymasRodymui: `$${bVerte}$`,
        sprendimas: `$${suma} - ${aVerte} = ${bVerte}$.`,
      })
    },

    // 4. Ženklų skirtumas
    () => {
      const [d, m] = aVerte > bVerte ? [aVerte, bVerte] : [bVerte, aVerte]
      return uzdavinys('zenklu-reiksme', {
        klausimas: `Ženklas „${a.vardas}“ reiškia ${d}, o „${b.vardas}“ — ${m}. Kiek bus ${a.vardas} − ${b.vardas}?`,
        atsakymas: String(d - m),
        atsakymasRodymui: `$${d - m}$`,
        sprendimas: `$${d} - ${m} = ${d - m}$.`,
      })
    },

    // 5. Kodėl ženklai naudingi
    () =>
      pasirinkimoUzdavinys(naujasId('zenklu-reiksme'), 'zenklu-reiksme', {
        klausimas: 'Kam žmonėms reikalingi ženklai?',
        variantai: [
          'kad greitai perduotų reikšmę',
          'kad būtų gražiau',
          'kad būtų sunkiau suprasti',
        ],
        teisingas: 0,
        sprendimas: 'Ženklas vienu piešiniu pasako tai, ką kitaip reikėtų ilgai aiškinti.',
      }),
  ])
}

// ── 6.2 Kokius ženklus žmonės vartojo prieš tūkstančius metų? ───────────────

const A_ROMEN = [
  {
    klausimas: 'Kokį skaičių žymi romėniškas užrašas III?',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Trys brūkšneliai reiškia tris vienetus.',
  },
] as const

export const senoveZenklai: Generatorius = () =>
  suBandymais(kurkSenoves, A_ROMEN, 'senove-zenklai')

/**
 * Romėniški skaičiai tik iki dešimties.
 *
 * Bendrasis generatorius duodavo XXXVI ir XXIV — tai jau ne pirmos klasės
 * dalykas. Programoje minimi I, II, III, IV, V ir dar keli, tad čia
 * apsiribojama pirmuoju dešimtuku.
 */
const ROMENISKI = [
  { r: 'I', n: 1 },
  { r: 'II', n: 2 },
  { r: 'III', n: 3 },
  { r: 'IV', n: 4 },
  { r: 'V', n: 5 },
  { r: 'VI', n: 6 },
  { r: 'VII', n: 7 },
  { r: 'VIII', n: 8 },
  { r: 'IX', n: 9 },
  { r: 'X', n: 10 },
] as const

function kurkSenoves(): Uzdavinys | null {
  const [a, b, c] = sumaisyk([...ROMENISKI]).slice(0, 3)

  return variacija([
    // 1. Koks skaičius parašytas
    () =>
      uzdavinys('senove-zenklai', {
        klausimas: `Kokį skaičių žymi romėniškas užrašas ${a.r}?`,
        atsakymas: String(a.n),
        atsakymasRodymui: `$${a.n}$`,
        sprendimas: `Romėniškas ${a.r} reiškia ${a.n}.`,
      }),

    // 2. Kaip užrašomas romėniškai
    () =>
      pasirinkimoUzdavinys(naujasId('senove-zenklai'), 'senove-zenklai', {
        klausimas: `Kaip romėniškai užrašomas skaičius ${a.n}?`,
        variantai: [a.r, b.r, c.r],
        teisingas: 0,
        sprendimas: `Skaičius ${a.n} romėniškai rašomas ${a.r}.`,
      }),

    // 3. Sudėtis su romėniškais
    () => {
      const x = ROMENISKI[atsitiktinis(0, 3)]
      const y = ROMENISKI[atsitiktinis(0, 3)]
      if (x.n + y.n > 10) return null
      return uzdavinys('senove-zenklai', {
        klausimas: `Apskaičiuok: ${x.r} + ${y.r}. Atsakymą parašyk paprastais skaitmenimis.`,
        atsakymas: String(x.n + y.n),
        atsakymasRodymui: `$${x.n + y.n}$`,
        sprendimas: `${x.r} yra ${x.n}, ${y.r} yra ${y.n}: $${x.n} + ${y.n} = ${x.n + y.n}$.`,
      })
    },

    // 4. Kuris didesnis
    () => {
      if (a.n === b.n) return null
      const didesnis = a.n > b.n ? a : b
      const mazesnis = a.n > b.n ? b : a
      return pasirinkimoUzdavinys(naujasId('senove-zenklai'), 'senove-zenklai', {
        klausimas: `Kuris romėniškas skaičius didesnis: ${a.r} ar ${b.r}?`,
        variantai: [didesnis.r, mazesnis.r, 'abu vienodi'],
        teisingas: 0,
        sprendimas: `${didesnis.r} yra ${didesnis.n}, o ${mazesnis.r} — ${mazesnis.n}.`,
      })
    },

    // 5. Kuo skiriasi senovės ženklai
    () =>
      pasirinkimoUzdavinys(naujasId('senove-zenklai'), 'senove-zenklai', {
        klausimas: 'Kuo romėniški skaičiai skiriasi nuo mūsų skaitmenų?',
        variantai: ['jie rašomi raidėmis', 'jų yra tik trys', 'jie reiškia spalvas'],
        teisingas: 0,
        sprendimas: 'Romėnai skaičius žymėjo raidėmis I, V, X, o mes — skaitmenimis.',
      }),
  ])
}

// ── 6.3 Kokią informaciją perduoda skaičiai? ────────────────────────────────

const A_INFORMACIJA = [
  {
    klausimas: 'Ant durų parašyta 12. Ką rodo šis skaičius?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — vietą',
    sprendimas: 'Buto numeris nurodo vietą, o ne kiekį.',
  },
] as const

export const skaiciuInformacija: Generatorius = () =>
  suBandymais(kurkInformacija, A_INFORMACIJA, 'skaiciu-informacija')

function kurkInformacija(): Uzdavinys | null {
  const n = atsitiktinis(2, 9)

  return variacija([
    // 1. Buto numeris — vieta
    () =>
      pasirinkimoUzdavinys(naujasId('skaiciu-informacija'), 'skaiciu-informacija', {
        klausimas: `Ant durų parašyta ${n + 10}. Ką rodo šis skaičius?`,
        variantai: ['vietą', 'kiekį', 'kainą'],
        teisingas: 0,
        sprendimas: 'Buto numeris nurodo, kur rasti duris, o ne kiek ko nors yra.',
      }),

    // 2. Kaina
    () =>
      pasirinkimoUzdavinys(naujasId('skaiciu-informacija'), 'skaiciu-informacija', {
        klausimas: `Ant prekės parašyta „${n} €“. Ką rodo šis skaičius?`,
        variantai: ['kainą', 'kiekį', 'vietą'],
        teisingas: 0,
        sprendimas: 'Euro ženklas prie skaičiaus rodo, kad tai kaina.',
      }),

    // 3. Kiekis
    () =>
      pasirinkimoUzdavinys(naujasId('skaiciu-informacija'), 'skaiciu-informacija', {
        klausimas: `Paveikslėlyje ${n} obuoliai ir užrašas ${n}. Ką rodo skaičius?`,
        variantai: ['kiekį', 'kainą', 'vietą'],
        teisingas: 0,
        sprendimas: `Skaičius ${n} pasako, kiek obuolių yra.`,
        brezinys: daiktuEile([{ daiktas: 'obuolys', kiek: n }], 30),
      }),

    // 4. Autobuso numeris
    () =>
      pasirinkimoUzdavinys(naujasId('skaiciu-informacija'), 'skaiciu-informacija', {
        klausimas: `Ant autobuso parašyta ${n}. Ką reiškia šis skaičius?`,
        variantai: [
          'kuriuo maršrutu autobusas važiuoja',
          'kiek žmonių jame telpa',
          'kiek jis kainuoja',
        ],
        teisingas: 0,
        sprendimas: 'Autobuso numeris nurodo maršrutą — tai ne kiekis.',
      }),

    // 5. Kur skaičius rodo kiekį
    () =>
      pasirinkimoUzdavinys(naujasId('skaiciu-informacija'), 'skaiciu-informacija', {
        klausimas: 'Kuriame užraše skaičius rodo kiekį?',
        variantai: [`${n} obuoliai`, `namas Nr. ${n}`, `${n} autobusas`],
        teisingas: 0,
        sprendimas: 'Kiekį rodo tas skaičius, kurį galima suskaičiuoti — obuolių yra tiek.',
      }),
  ])
}

// ═══ 7 tema. Duomenys ═══════════════════════════════════════════════════════

/**
 * Tyrimo temos: ką vaikai skaičiavo ir kokios grupės gavosi.
 *
 * `kas` yra galininkas — būtent tokio linksnio reikalauja sakiniai „vaikai
 * suskaičiavo …“ ir „vaikai tyrė …“. Vardininkas juose skambėtų kaip
 * vertimas: „suskaičiavo mėgstamiausi vaisiai“.
 */
const TYRIMAI = [
  {
    kas: 'mėgstamiausius vaisius',
    pozymis: 'pagal vaisiaus rūšį',
    grupes: ['obuoliai', 'kriaušės', 'slyvos'],
    kas1: 'vaikų',
    daiktas: 'obuolys' as Daiktas,
  },
  {
    kas: 'augintinius',
    pozymis: 'pagal gyvūno rūšį',
    grupes: ['šunys', 'katės', 'žuvytės'],
    kas1: 'vaikų',
    daiktas: 'kate' as Daiktas,
  },
  {
    kas: 'automobilių spalvas',
    pozymis: 'pagal spalvą',
    grupes: ['raudoni', 'mėlyni', 'balti'],
    kas1: 'automobilių',
    daiktas: 'kubelis' as Daiktas,
  },
  {
    kas: 'mėgstamiausius žaislus',
    pozymis: 'pagal žaislo rūšį',
    grupes: ['lėlės', 'kamuoliai', 'kubeliai'],
    kas1: 'vaikų',
    daiktas: 'kamuolys' as Daiktas,
  },
] as const

/** Trys grupės su skirtingais, pirmokui suskaičiuojamais kiekiais. */
function kurkDuomenis(): { tyrimas: (typeof TYRIMAI)[number]; eilutes: Eilute[] } | null {
  const tyrimas = pasirink(TYRIMAI)
  const kiekiai = sumaisyk([2, 3, 4, 5, 6, 7]).slice(0, 3)
  if (new Set(kiekiai).size < 3) return null
  return {
    tyrimas,
    eilutes: tyrimas.grupes.map((vardas, i) => ({ vardas, kiek: kiekiai[i] })),
  }
}

/** Grupė su didžiausiu ir mažiausiu kiekiu. */
function kraštutines(eilutes: readonly Eilute[]) {
  const daugiausia = eilutes.reduce((a, b) => (b.kiek > a.kiek ? b : a))
  const maziausia = eilutes.reduce((a, b) => (b.kiek < a.kiek ? b : a))
  return { daugiausia, maziausia }
}

// ── 7.1 Kas vadinama duomenimis? ────────────────────────────────────────────

const A_DUOMENYS = [
  {
    klausimas: 'Vaikai suskaičiavo, kiek kas pasirinko obuolį, kriaušę ir slyvą. Kas čia yra duomenys?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — surinkti skaičiai',
    sprendimas: 'Duomenys yra tai, ką suskaičiavome ir užrašėme.',
  },
] as const

export const kasYraDuomenys: Generatorius = () =>
  suBandymais(kurkDuomenuSavoka, A_DUOMENYS, 'kas-yra-duomenys')

function kurkDuomenuSavoka(): Uzdavinys | null {
  const d = kurkDuomenis()
  if (!d) return null
  const { tyrimas, eilutes } = d

  return variacija([
    // 1. Kas yra duomenys
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-duomenys'), 'kas-yra-duomenys', {
        klausimas: `Vaikai suskaičiavo ${tyrimas.kas}. Kas čia yra duomenys?`,
        variantai: ['surinkti skaičiai', 'lentelės rėmelis', 'vaikų vardai'],
        teisingas: 0,
        sprendimas: 'Duomenys yra tai, ką suskaičiavome ir užrašėme.',
        brezinys: piktograma(eilutes, tyrimas.daiktas),
      }),

    // 2. Pagal kokį požymį sugrupuota
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-duomenys'), 'kas-yra-duomenys', {
        klausimas: 'Pagal kokį požymį sugrupuoti duomenys?',
        variantai: [tyrimas.pozymis, 'pagal dydį', 'pagal abėcėlę'],
        teisingas: 0,
        sprendimas: `Grupės sudarytos ${tyrimas.pozymis}.`,
        brezinys: piktograma(eilutes, tyrimas.daiktas),
      }),

    // 3. Ką galime sužinoti
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-duomenys'), 'kas-yra-duomenys', {
        klausimas: 'Ką galime sužinoti iš šių duomenų?',
        variantai: [
          'kurios grupės yra daugiausia',
          'kada duomenys surinkti',
          'kas juos surinko',
        ],
        teisingas: 0,
        sprendimas: 'Duomenys rodo kiekius, tad iš jų matyti, ko daugiausia ir ko mažiausia.',
        brezinys: piktograma(eilutes, tyrimas.daiktas),
      }),

    // 4. Kiek grupių
    () =>
      uzdavinys('kas-yra-duomenys', {
        klausimas: 'Į kiek grupių suskirstyti duomenys?',
        atsakymas: String(eilutes.length),
        atsakymasRodymui: `$${eilutes.length}$`,
        sprendimas: `Grupių yra ${eilutes.length}: ${eilutes.map((e) => e.vardas).join(', ')}.`,
        brezinys: piktograma(eilutes, tyrimas.daiktas),
      }),

    // 5. Kiek iš viso suskaičiuota
    () => {
      const suma = eilutes.reduce((s, e) => s + e.kiek, 0)
      return uzdavinys('kas-yra-duomenys', {
        klausimas: `Kiek ${tyrimas.kas1} suskaičiuota iš viso?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `${eilutes.map((e) => e.kiek).join(' + ')} = ${suma}.`,
        brezinys: piktograma(eilutes, tyrimas.daiktas),
      })
    },
  ])
}

// ── 7.2 Kaip skaityti piktogramą? ───────────────────────────────────────────

const A_PIKTOGRAMA = [
  {
    klausimas: 'Kiek paveikslėlių yra ilgiausioje eilutėje?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: 'Suskaičiavus ilgiausios eilutės paveikslėlius gaunama 6.',
  },
] as const

export const piktogramosSkaitymas: Generatorius = () =>
  suBandymais(kurkPiktograma, A_PIKTOGRAMA, 'piktogramos-skaitymas')

function kurkPiktograma(): Uzdavinys | null {
  const d = kurkDuomenis()
  if (!d) return null
  const { tyrimas, eilutes } = d
  const { daugiausia, maziausia } = kraštutines(eilutes)
  const piesinys = piktograma(eilutes, tyrimas.daiktas)

  return variacija([
    // 1. Kiek vienoje eilutėje
    () => {
      const e = pasirink(eilutes)
      return uzdavinys('piktogramos-skaitymas', {
        klausimas: `Kiek paveikslėlių yra eilutėje „${e.vardas}“?`,
        atsakymas: String(e.kiek),
        atsakymasRodymui: `$${e.kiek}$`,
        sprendimas: `Vienas paveikslėlis reiškia vieną vienetą, o jų suskaičiuojama ${e.kiek}.`,
        brezinys: piesinys,
      })
    },

    // 2. Kurios daugiausia
    () =>
      pasirinkimoUzdavinys(naujasId('piktogramos-skaitymas'), 'piktogramos-skaitymas', {
        klausimas: 'Kurios grupės yra daugiausia?',
        variantai: [
          daugiausia.vardas,
          ...eilutes.filter((e) => e.vardas !== daugiausia.vardas).map((e) => e.vardas),
        ],
        teisingas: 0,
        sprendimas: `Ilgiausia eilutė yra „${daugiausia.vardas}“ — joje ${daugiausia.kiek} paveikslėliai.`,
        brezinys: piesinys,
      }),

    // 3. Kurios mažiausia
    () =>
      pasirinkimoUzdavinys(naujasId('piktogramos-skaitymas'), 'piktogramos-skaitymas', {
        klausimas: 'Kurios grupės yra mažiausiai?',
        variantai: [
          maziausia.vardas,
          ...eilutes.filter((e) => e.vardas !== maziausia.vardas).map((e) => e.vardas),
        ],
        teisingas: 0,
        sprendimas: `Trumpiausia eilutė yra „${maziausia.vardas}“ — joje ${maziausia.kiek} paveikslėliai.`,
        brezinys: piesinys,
      }),

    // 4. Kiek daugiau
    () =>
      uzdavinys('piktogramos-skaitymas', {
        klausimas: `Kiek daugiau yra „${daugiausia.vardas}“ negu „${maziausia.vardas}“?`,
        atsakymas: String(daugiausia.kiek - maziausia.kiek),
        atsakymasRodymui: `$${daugiausia.kiek - maziausia.kiek}$`,
        sprendimas: `$${daugiausia.kiek} - ${maziausia.kiek} = ${daugiausia.kiek - maziausia.kiek}$.`,
        brezinys: piesinys,
      }),

    // 5. Ką reiškia vienas paveikslėlis
    () =>
      pasirinkimoUzdavinys(naujasId('piktogramos-skaitymas'), 'piktogramos-skaitymas', {
        klausimas: 'Ką reiškia vienas piktogramos paveikslėlis?',
        variantai: ['vieną vienetą', 'dešimt vienetų', 'visą eilutę'],
        teisingas: 0,
        sprendimas: 'Šioje piktogramoje vienas paveikslėlis reiškia vieną vienetą.',
        brezinys: piesinys,
      }),
  ])
}

// ── 7.3 Kaip skaityti stulpelinę diagramą? ──────────────────────────────────

const A_DIAGRAMA = [
  {
    klausimas: 'Kuris stulpelis aukščiausias?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — slyvos',
    sprendimas: 'Aukščiausias stulpelis rodo didžiausią skaičių.',
  },
] as const

export const diagramosSkaitymas: Generatorius = () =>
  suBandymais(kurkDiagramosSkaityma, A_DIAGRAMA, 'diagramos-skaitymas')

function kurkDiagramosSkaityma(): Uzdavinys | null {
  const d = kurkDuomenis()
  if (!d) return null
  const { tyrimas, eilutes } = d
  const { daugiausia, maziausia } = kraštutines(eilutes)
  const piesinys = stulpeliai(eilutes)

  return variacija([
    // 1. Kuris stulpelis aukščiausias
    () =>
      pasirinkimoUzdavinys(naujasId('diagramos-skaitymas'), 'diagramos-skaitymas', {
        klausimas: 'Kuris stulpelis aukščiausias?',
        variantai: [
          daugiausia.vardas,
          ...eilutes.filter((e) => e.vardas !== daugiausia.vardas).map((e) => e.vardas),
        ],
        teisingas: 0,
        sprendimas: `Aukščiausias stulpelis rodo ${daugiausia.kiek} — tai „${daugiausia.vardas}“.`,
        brezinys: piesinys,
      }),

    // 2. Kiek rodo vienas stulpelis
    () => {
      const e = pasirink(eilutes)
      return uzdavinys('diagramos-skaitymas', {
        klausimas: `Kiek ${tyrimas.kas1} rodo stulpelis „${e.vardas}“?`,
        atsakymas: String(e.kiek),
        atsakymasRodymui: `$${e.kiek}$`,
        sprendimas: `Stulpelio viršus yra ties padala ${e.kiek}.`,
        brezinys: piesinys,
      })
    },

    // 3. Kiek daugiau
    () =>
      uzdavinys('diagramos-skaitymas', {
        klausimas: `Kiek daugiau rodo stulpelis „${daugiausia.vardas}“ negu „${maziausia.vardas}“?`,
        atsakymas: String(daugiausia.kiek - maziausia.kiek),
        atsakymasRodymui: `$${daugiausia.kiek - maziausia.kiek}$`,
        sprendimas: `$${daugiausia.kiek} - ${maziausia.kiek} = ${daugiausia.kiek - maziausia.kiek}$.`,
        brezinys: piesinys,
      }),

    // 4. Kurios mažiausiai
    () =>
      pasirinkimoUzdavinys(naujasId('diagramos-skaitymas'), 'diagramos-skaitymas', {
        klausimas: 'Kurios grupės yra mažiausiai?',
        variantai: [
          maziausia.vardas,
          ...eilutes.filter((e) => e.vardas !== maziausia.vardas).map((e) => e.vardas),
        ],
        teisingas: 0,
        sprendimas: `Žemiausias stulpelis rodo ${maziausia.kiek} — tai „${maziausia.vardas}“.`,
        brezinys: piesinys,
      }),

    // 5. Iš viso
    () => {
      const suma = eilutes.reduce((s, e) => s + e.kiek, 0)
      return uzdavinys('diagramos-skaitymas', {
        klausimas: 'Kiek yra iš viso?',
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `${eilutes.map((e) => e.kiek).join(' + ')} = ${suma}.`,
        brezinys: piesinys,
      })
    },
  ])
}

// ── 7.4 Kaip nubraižyti stulpelinę diagramą? ────────────────────────────────

const A_BRAIZYMAS = [
  {
    klausimas: 'Kokio aukščio turi būti trūkstamas stulpelis?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: 'Duomenyse ta grupė turi 4, tad stulpelis brėžiamas iki 4 padalos.',
  },
] as const

export const diagramosBraizymas: Generatorius = () =>
  suBandymais(kurkBraizyma, A_BRAIZYMAS, 'diagramos-braizymas')

function kurkBraizyma(): Uzdavinys | null {
  const d = kurkDuomenis()
  if (!d) return null
  const { eilutes } = d
  const trūkstamas = pasirink(eilutes)

  return variacija([
    // 1. Kokio aukščio trūkstamas stulpelis
    () =>
      uzdavinys('diagramos-braizymas', {
        klausimas: `Duomenyse „${trūkstamas.vardas}“ yra ${trūkstamas.kiek}. Iki kurios padalos brėžiamas šios grupės stulpelis?`,
        atsakymas: String(trūkstamas.kiek),
        atsakymasRodymui: `$${trūkstamas.kiek}$`,
        sprendimas: `Stulpelio aukštis rodo kiekį, tad jis brėžiamas iki ${trūkstamas.kiek} padalos.`,
        brezinys: stulpeliai(eilutes.filter((e) => e.vardas !== trūkstamas.vardas)),
      }),

    // 2. Kiek stulpelių reikės
    () =>
      uzdavinys('diagramos-braizymas', {
        klausimas: `Duomenys suskirstyti į ${eilutes.length} grupes. Kiek stulpelių reikės diagramoje?`,
        atsakymas: String(eilutes.length),
        atsakymasRodymui: `$${eilutes.length}$`,
        sprendimas: 'Kiekvienai grupei brėžiamas po vieną stulpelį.',
      }),

    // 3. Kuris stulpelis bus aukščiausias
    () => {
      const { daugiausia } = kraštutines(eilutes)
      return pasirinkimoUzdavinys(naujasId('diagramos-braizymas'), 'diagramos-braizymas', {
        klausimas: `Duomenys: ${eilutes.map((e) => `${e.vardas} — ${e.kiek}`).join(', ')}. Kuris stulpelis bus aukščiausias?`,
        variantai: [
          daugiausia.vardas,
          ...eilutes.filter((e) => e.vardas !== daugiausia.vardas).map((e) => e.vardas),
        ],
        teisingas: 0,
        sprendimas: `Didžiausias skaičius yra ${daugiausia.kiek}, tad aukščiausias bus „${daugiausia.vardas}“.`,
      })
    },

    // 4. Ką rodo stulpelio aukštis
    () =>
      pasirinkimoUzdavinys(naujasId('diagramos-braizymas'), 'diagramos-braizymas', {
        klausimas: 'Ką rodo stulpelio aukštis?',
        variantai: ['kiek yra toje grupėje', 'kokia grupės spalva', 'kelinta grupė iš eilės'],
        teisingas: 0,
        sprendimas: 'Kuo grupėje daugiau, tuo stulpelis aukštesnis.',
        brezinys: stulpeliai(eilutes),
      }),

    // 5. Kur klaida
    () => {
      const klaidingi = eilutes.map((e) =>
        e.vardas === trūkstamas.vardas ? { ...e, kiek: e.kiek + 2 } : e,
      )
      return pasirinkimoUzdavinys(naujasId('diagramos-braizymas'), 'diagramos-braizymas', {
        klausimas: `Duomenys: ${eilutes.map((e) => `${e.vardas} — ${e.kiek}`).join(', ')}. Kuris stulpelis nubrėžtas neteisingai?`,
        variantai: [
          trūkstamas.vardas,
          ...eilutes.filter((e) => e.vardas !== trūkstamas.vardas).map((e) => e.vardas),
        ],
        teisingas: 0,
        sprendimas: `„${trūkstamas.vardas}“ turi būti ${trūkstamas.kiek}, o nubrėžta ${trūkstamas.kiek + 2}.`,
        brezinys: stulpeliai(klaidingi),
      })
    },
  ])
}

// ── 7.5 Kaip atliekamas tyrimas? ────────────────────────────────────────────

const A_TYRIMAS = [
  {
    klausimas: 'Nori sužinoti, kokį vaisių klasės vaikai mėgsta labiausiai. Kokį klausimą užduosi?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — Kokį vaisių mėgsti labiausiai?',
    sprendimas: 'Klausimas turi tiesiogiai klausti to, ką norime sužinoti.',
  },
] as const

export const tyrimoEiga: Generatorius = () => suBandymais(kurkTyrima, A_TYRIMAS, 'tyrimo-eiga')

function kurkTyrima(): Uzdavinys | null {
  const d = kurkDuomenis()
  if (!d) return null
  const { tyrimas, eilutes } = d

  return variacija([
    // 1. Koks klausimas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('tyrimo-eiga'), 'tyrimo-eiga', {
        klausimas: 'Nori sužinoti, kokį vaisių klasės vaikai mėgsta labiausiai. Kokį klausimą užduosi?',
        variantai: [
          'Kokį vaisių mėgsti labiausiai?',
          'Kiek tau metų?',
          'Ar mėgsti matematiką?',
        ],
        teisingas: 0,
        sprendimas: 'Klausimas turi klausti būtent to, ką norime sužinoti.',
      }),

    // 2. Tyrimo žingsnių tvarka
    () =>
      eiliskumoUzdavinys(naujasId('tyrimo-eiga'), 'tyrimo-eiga', {
        klausimas: 'Sudėliok tyrimo žingsnius teisinga tvarka.',
        teisingaEile: ['paklausti', 'suskaičiuoti', 'palyginti', 'pasakyti išvadą'],
        sprendimas: 'Pirma surenkame atsakymus, tada juos suskaičiuojame, palyginame ir darome išvadą.',
      }),

    // 3. Pagal kokį požymį grupuojama
    () =>
      pasirinkimoUzdavinys(naujasId('tyrimo-eiga'), 'tyrimo-eiga', {
        klausimas: `Vaikai tyrė ${tyrimas.kas}. Pagal kokį požymį jie grupavo duomenis?`,
        variantai: [tyrimas.pozymis, 'pagal vaikų amžių', 'pagal savaitės dieną'],
        teisingas: 0,
        sprendimas: `Duomenys suskirstyti ${tyrimas.pozymis}.`,
        brezinys: stulpeliai(eilutes),
      }),

    // 4. Kokia išvada
    () => {
      const { daugiausia } = kraštutines(eilutes)
      return pasirinkimoUzdavinys(naujasId('tyrimo-eiga'), 'tyrimo-eiga', {
        klausimas: 'Kuri išvada tinka pagal surinktus duomenis?',
        variantai: [
          `daugiausia yra „${daugiausia.vardas}“`,
          'visų yra po lygiai',
          'duomenų nepakanka',
        ],
        teisingas: 0,
        sprendimas: `Didžiausias stulpelis yra „${daugiausia.vardas}“ — ${daugiausia.kiek}.`,
        brezinys: stulpeliai(eilutes),
      })
    },

    // 5. Ką daryti po surinkimo
    () =>
      pasirinkimoUzdavinys(naujasId('tyrimo-eiga'), 'tyrimo-eiga', {
        klausimas: 'Ką darome iš karto po to, kai surenkame atsakymus?',
        variantai: ['suskaičiuojame', 'pamirštame', 'užduodame naują klausimą'],
        teisingas: 0,
        sprendimas: 'Surinktus atsakymus pirmiausia reikia suskaičiuoti — tada juos galima palyginti.',
      }),
  ])
}

// ── 7.6 Kaip aš atlieku tyrimą? ─────────────────────────────────────────────

const A_MANO_TYRIMAS = [
  {
    klausimas: 'Kurio žaislo pasirinkta daugiausia?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — kamuoliai',
    sprendimas: 'Didžiausias skaičius rodo, ko pasirinkta daugiausia.',
  },
] as const

export const manoTyrimas: Generatorius = () =>
  suBandymais(kurkManoTyrima, A_MANO_TYRIMAS, 'mano-tyrimas')

function kurkManoTyrima(): Uzdavinys | null {
  const d = kurkDuomenis()
  if (!d) return null
  const { tyrimas, eilutes } = d
  const { daugiausia, maziausia } = kraštutines(eilutes)
  const vardas = pasirink(VARDAI)

  return variacija([
    // 1. Ko daugiausia
    () =>
      pasirinkimoUzdavinys(naujasId('mano-tyrimas'), 'mano-tyrimas', {
        klausimas: `${vardas} rinko duomenis apie ${tyrimas.kas}. Ko pasirinkta daugiausia?`,
        variantai: [
          daugiausia.vardas,
          ...eilutes.filter((e) => e.vardas !== daugiausia.vardas).map((e) => e.vardas),
        ],
        teisingas: 0,
        sprendimas: `Didžiausias skaičius yra ${daugiausia.kiek} — tai „${daugiausia.vardas}“.`,
        brezinys: stulpeliai(eilutes),
      }),

    // 2. Ko mažiausiai
    () =>
      pasirinkimoUzdavinys(naujasId('mano-tyrimas'), 'mano-tyrimas', {
        klausimas: 'Ko suskaičiuota mažiausiai?',
        variantai: [
          maziausia.vardas,
          ...eilutes.filter((e) => e.vardas !== maziausia.vardas).map((e) => e.vardas),
        ],
        teisingas: 0,
        sprendimas: `Mažiausias skaičius yra ${maziausia.kiek} — tai „${maziausia.vardas}“.`,
        brezinys: stulpeliai(eilutes),
      }),

    // 3. Kiek iš viso
    () => {
      const suma = eilutes.reduce((s, e) => s + e.kiek, 0)
      return uzdavinys('mano-tyrimas', {
        klausimas: `Kiek ${tyrimas.kas1} suskaičiuota iš viso?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `${eilutes.map((e) => e.kiek).join(' + ')} = ${suma}.`,
        brezinys: stulpeliai(eilutes),
      })
    },

    // 4. Kiek vienoje grupėje
    () => {
      const e = pasirink(eilutes)
      return uzdavinys('mano-tyrimas', {
        klausimas: `Kiek suskaičiuota grupėje „${e.vardas}“?`,
        atsakymas: String(e.kiek),
        atsakymasRodymui: `$${e.kiek}$`,
        sprendimas: `Stulpelis „${e.vardas}“ siekia ${e.kiek} padalą.`,
        brezinys: stulpeliai(eilutes),
      })
    },

    // 5. Teisinga išvada
    () =>
      pasirinkimoUzdavinys(naujasId('mano-tyrimas'), 'mano-tyrimas', {
        klausimas: 'Pasirink teisingą išvadą.',
        variantai: [
          `„${daugiausia.vardas}“ pasirinkta daugiau nei „${maziausia.vardas}“`,
          `„${maziausia.vardas}“ pasirinkta daugiausia`,
          'visų pasirinkta po lygiai',
        ],
        teisingas: 0,
        sprendimas: `${daugiausia.kiek} yra daugiau nei ${maziausia.kiek}.`,
        brezinys: stulpeliai(eilutes),
      }),
  ])
}
