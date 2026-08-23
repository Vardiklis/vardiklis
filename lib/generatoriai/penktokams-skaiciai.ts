import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { sk4, tekstu, zodziais } from './ketvirtokams-bendra'
import { skyriuLentele } from './ketvirtokams-vaizdai'
import { romeniskai, romenuLaikrodis, skaiciuTiese } from './penktokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 5 klasės tema „Natūralieji skaičiai“ — dešimt potemių.
 *
 * Anksčiau jos rėmėsi `skaitmenys`, `koordinates`, `skaiciu-palyginimas` ir
 * `apvalinimas` generatoriais, kurie aptarnavo iškart kelias klases: penktokui
 * pasitaikydavo ir pirmoko dydžio skaičių, ir devintoko koordinačių plokštumos.
 *
 * Potemės čia skiriasi ne skaičių dydžiu, o klausimo kryptimi. Pirmosios
 * keturios yra apie skaičiaus sandarą (skaitmuo, skyrius, skaitmens reikšmė,
 * užrašymas), dvi vidurinės — apie vietą tiesėje ir palyginimą, dvi — apie
 * apvalinimą, o paskutinės dvi — apie romėniškuosius skaitmenis.
 */

/** Penkiaženklis arba šešiaženklis — 5 klasės įprastas mastas. */
function didelis(): number {
  return pasirink([atsitiktinis(10000, 99999), atsitiktinis(100000, 999999)])
}

const SKYRIU_VARDAI = [
  { vardas: 'vienetų', verte: 1 },
  { vardas: 'dešimčių', verte: 10 },
  { vardas: 'šimtų', verte: 100 },
  { vardas: 'tūkstančių', verte: 1000 },
  { vardas: 'dešimčių tūkstančių', verte: 10000 },
  { vardas: 'šimtų tūkstančių', verte: 100000 },
] as const

// ── 1.1.1. Skaičius ir skaitmuo ─────────────────────────────────────────────

const T1 = 'skaicius-ir-skaitmuo'

const A_SKAITMUO = [
  {
    klausimas: 'Kiek skaitmenų yra skaičiuje $48\\,307$?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Skaitmenys yra 4, 8, 3, 0 ir 7.',
  },
] as const

export const skaiciusIrSkaitmuo: Generatorius = () => suBandymais(kurkSkaitmeni, A_SKAITMUO, T1)

function kurkSkaitmeni(): Uzdavinys | null {
  const n = didelis()
  const s = String(n)

  return variacija([
    // 1. Kiek skaitmenų
    () =>
      uzdavinys(T1, {
        klausimas: `Kiek skaitmenų yra skaičiuje $${sk4(n)}$?`,
        atsakymas: String(s.length),
        atsakymasRodymui: `$${s.length}$`,
        sprendimas: `Skaitmenys yra ${s.split('').join(', ')} — iš viso ${s.length}.`,
      }),

    // 2. Kiek skirtingų skaitmenų
    () => {
      const skirtingu = new Set(s.split('')).size
      if (skirtingu === s.length) return null
      return uzdavinys(T1, {
        klausimas: `Kiek skirtingų skaitmenų yra skaičiuje $${sk4(n)}$?`,
        atsakymas: String(skirtingu),
        atsakymasRodymui: `$${skirtingu}$`,
        sprendimas: `Skaičių sudaro ${s.length} skaitmenys, bet kai kurie kartojasi; skirtingi yra ${[...new Set(s.split(''))].join(', ')}.`,
      })
    },

    // 3. Didžiausias skaičius iš duotų skaitmenų
    () => {
      const skaitmenys = sumaisyk([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4)
      if (!skaitmenys.some((x) => x > 0)) return null
      const didz = Number([...skaitmenys].sort((a, b) => b - a).join(''))
      return uzdavinys(T1, {
        klausimas: `Iš skaitmenų ${skaitmenys.join(', ')} sudaryk didžiausią keturženklį skaičių, kiekvieną panaudodamas po vieną kartą.`,
        atsakymas: String(didz),
        atsakymasRodymui: `$${sk4(didz)}$`,
        sprendimas: 'Didžiausias skaitmuo rašomas aukščiausiame skyriuje, mažiausias — vienetuose.',
      })
    },

    // 4. Mažiausias skaičius iš duotų skaitmenų
    () => {
      const skaitmenys = sumaisyk([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4)
      const maz = [...skaitmenys].sort((a, b) => a - b)
      if (maz[0] === 0) [maz[0], maz[1]] = [maz[1], maz[0]]
      if (maz[0] === 0) return null
      return uzdavinys(T1, {
        klausimas: `Iš skaitmenų ${skaitmenys.join(', ')} sudaryk mažiausią keturženklį skaičių, kiekvieną panaudodamas po vieną kartą.`,
        atsakymas: String(Number(maz.join(''))),
        atsakymasRodymui: `$${sk4(Number(maz.join('')))}$`,
        sprendimas: 'Nuliu skaičius neprasideda, tad priekyje rašomas mažiausias nenulinis skaitmuo.',
      })
    },

    // 5. Kuo skiriasi skaičius nuo skaitmens
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuo skaičius skiriasi nuo skaitmens?',
        variantai: [
          'skaitmuo yra ženklas, o skaičius užrašomas vienu ar keliais skaitmenimis',
          'skaičius visada didesnis už skaitmenį',
          'skaitmenų yra begalybė, o skaičių tik dešimt',
          'jie niekuo nesiskiria',
        ],
        teisingas: 0,
        sprendimas: 'Skaitmenų yra tik dešimt (0–9), o iš jų sudaromi visi skaičiai.',
      }),

    // 6. Didžiausio ir mažiausio skirtumas
    () => {
      const skaitmenys = sumaisyk([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5)
      const didz = [...skaitmenys].sort((a, b) => b - a)
      const maz = [...skaitmenys].sort((a, b) => a - b)
      if (maz[0] === 0) [maz[0], maz[1]] = [maz[1], maz[0]]
      if (maz[0] === 0) return null
      const d = Number(didz.join(''))
      const m = Number(maz.join(''))
      return uzdavinys(T1, {
        klausimas: `Iš skaitmenų ${skaitmenys.join(', ')} sudaryk didžiausią ir mažiausią penkiaženklį skaičių, kiekvieną panaudodamas po vieną kartą. Rask jų skirtumą.`,
        atsakymas: String(d - m),
        atsakymasRodymui: `$${sk4(d - m)}$`,
        sprendimas: `Didžiausias — $${sk4(d)}$, mažiausias — $${sk4(m)}$. $${sk4(d)} - ${sk4(m)} = ${sk4(d - m)}$.`,
      })
    },

    // 7. Klaidos radimas
    () => {
      const skaitmuo = atsitiktinis(2, 9)
      const kartotinis = Number(String(skaitmuo).repeat(3))
      return uzdavinys(T1, {
        klausimas: `Mokinys sako: „Skaičiuje $${kartotinis}$ yra vienas skaitmuo, nes visur parašyta ${skaitmuo}.“ Kiek skaitmenų iš tikrųjų yra šiame skaičiuje?`,
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: `Skaitmenų yra trys, tik jie visi vienodi. Skirtingas skaitmuo čia tik vienas — ${skaitmuo}.`,
      })
    },

    // 8. Didžiausias lyginis
    () => {
      const skaitmenys = sumaisyk([1, 2, 3, 4, 5]).slice(0, 5)
      const lyginiai = skaitmenys.filter((x) => x % 2 === 0)
      if (lyginiai.length === 0) return null
      const paskutinis = Math.min(...lyginiai)
      const likusieji = [...skaitmenys]
      likusieji.splice(likusieji.indexOf(paskutinis), 1)
      const rez = Number([...likusieji.sort((a, b) => b - a), paskutinis].join(''))
      return uzdavinys(T1, {
        klausimas: `Iš skaitmenų ${skaitmenys.join(', ')} sudaryk didžiausią lyginį penkiaženklį skaičių, kiekvieną panaudodamas po vieną kartą.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: `Lyginį skaičių lemia paskutinis skaitmuo, tad jį reikia palikti lyginį ir kuo mažesnį (${paskutinis}), o likusius rikiuoti mažėjimo tvarka.`,
      })
    },
  ])
}

// ── 1.1.2. Skaičiaus skaitmenų skyrių lentelė ───────────────────────────────

const T2 = 'skyriu-lentele-5'

const A_LENTELE = [
  {
    klausimas: 'Koks skaičius užrašytas skyrių lentelėje 5 | 7 | 3 | 0 | 4?',
    atsakymas: '57304',
    atsakymasRodymui: '$57\\,304$',
    sprendimas: 'Skaitmenys skaitomi iš eilės nuo aukščiausio skyriaus.',
  },
] as const

export const skyriuLentele5: Generatorius = () => suBandymais(kurkLentele, A_LENTELE, T2)

function kurkLentele(): Uzdavinys | null {
  const n = didelis()
  const s = String(n)

  return variacija([
    // 1. Koks skaičius lentelėje
    () =>
      uzdavinys(T2, {
        klausimas: 'Koks skaičius užrašytas skyrių lentelėje?',
        atsakymas: String(n),
        atsakymasRodymui: `$${sk4(n)}$`,
        sprendimas: `Skaitmenys skaitomi iš eilės nuo aukščiausio skyriaus: $${sk4(n)}$.`,
        brezinys: skyriuLentele(n),
      }),

    // 2. Kuriame skyriuje nurodytas skaitmuo
    () => {
      const vieta = atsitiktinis(0, s.length - 1)
      const skaitmuo = Number(s[vieta])
      if (s.split('').filter((c) => Number(c) === skaitmuo).length > 1) return null
      const skyrius = SKYRIU_VARDAI[s.length - 1 - vieta]
      // Variantų ne daugiau keturių: pasirinkimo formatas turi tik penkias
      // raides, o šešiaženkliam skaičiui skyrių vardų yra šeši.
      const kiti = SKYRIU_VARDAI.slice(0, s.length)
        .map((x) => x.vardas)
        .filter((x) => x !== skyrius.vardas)
      const variantai = sumaisyk([skyrius.vardas, ...sumaisyk(kiti).slice(0, 3)])
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kuriame skyriuje skaičiuje $${sk4(n)}$ yra skaitmuo ${skaitmuo}?`,
        variantai,
        teisingas: variantai.indexOf(skyrius.vardas),
        sprendimas: `Skaičiuojant nuo dešinės, ${skaitmuo} stovi ${skyrius.vardas} skiltyje.`,
        brezinys: skyriuLentele(n),
      })
    },

    // 3. Skaičius iš skyrių aprašymo
    () => {
      const st = atsitiktinis(1, 9)
      const t = atsitiktinis(1, 9)
      const vnt = atsitiktinis(1, 9)
      const rez = st * 100000 + t * 1000 + vnt
      return uzdavinys(T2, {
        klausimas: `Užrašyk skaičių, kurį sudaro ${st} šimtai tūkstančių, ${t} tūkstančiai ir ${vnt} vienetai.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: 'Tuščios skiltys užpildomos nuliais.',
      })
    },

    // 4. Trūkstamas skaitmuo lentelėje
    () => {
      const vieta = atsitiktinis(1, s.length - 2)
      const skaitmuo = Number(s[vieta])
      return uzdavinys(T2, {
        klausimas: 'Kokį skaitmenį reikia įrašyti į tuščią lentelės langelį, kad gautųsi skaičius, esantis tarp $' +
          sk4(n - 10 ** (s.length - 1 - vieta) * skaitmuo) + '$ ir $' +
          sk4(n - 10 ** (s.length - 1 - vieta) * skaitmuo + 10 ** (s.length - 1 - vieta) * (skaitmuo + 1)) + '$?',
        atsakymas: String(skaitmuo),
        atsakymasRodymui: `$${skaitmuo}$`,
        sprendimas: `Nurodytos ribos skiriasi būtent tuo skyriumi, kurio langelis tuščias, tad ten rašomas ${skaitmuo}.`,
        brezinys: skyriuLentele(n, [s.length - 1 - vieta]),
      })
    },

    // 5. Sukeisti skaitmenis vietomis
    () => {
      if (s.length < 5) return null
      const a = Number(s[s.length - 5])
      const b = Number(s[s.length - 3])
      if (a === b) return null
      const naujas = n + (b - a) * 10000 + (a - b) * 100
      return uzdavinys(T2, {
        klausimas: `Skaičiuje $${sk4(n)}$ sukeisk vietomis dešimčių tūkstančių ir šimtų skaitmenis. Koks gaunamas skaičius?`,
        atsakymas: String(naujas),
        atsakymasRodymui: `$${sk4(naujas)}$`,
        sprendimas: `Dešimčių tūkstančių skiltyje buvo ${a}, šimtų — ${b}; sukeitus gaunama $${sk4(naujas)}$.`,
        brezinys: skyriuLentele(n),
      })
    },

    // 6. Didžiausias skaičius iš duotų skaitmenų
    () => {
      const skaitmenys = sumaisyk([1, 3, 5, 7, 8, 9]).slice(0, 6)
      const didz = Number([...skaitmenys].sort((a, b) => b - a).join(''))
      return uzdavinys(T2, {
        klausimas: `Iš skaitmenų ${skaitmenys.join(', ')} sudaryk didžiausią šešiaženklį skaičių ir užrašyk jį.`,
        atsakymas: String(didz),
        atsakymasRodymui: `$${sk4(didz)}$`,
        sprendimas: 'Skaitmenys rikiuojami mažėjimo tvarka nuo aukščiausio skyriaus.',
      })
    },

    // 7. Skaičius pagal skaitmenų sumą
    () => {
      const st = atsitiktinis(5, 9)
      const simtai = atsitiktinis(1, 6)
      const likusi = 10 - simtai
      if (likusi < 1 || likusi > 18) return null
      const dt = Math.min(9, likusi)
      const t = likusi - dt
      if (t > 9) return null
      const rez = st * 100000 + dt * 10000 + t * 1000 + simtai * 100
      return uzdavinys(T2, {
        klausimas: `Sukurk didžiausią šešiaženklį skaičių, kurio šimtų tūkstančių skaitmuo ${st}, šimtų skaitmuo ${simtai}, dešimčių ir vienetų skaitmenys nuliai, o likusių dviejų skaitmenų suma lygi ${likusi}.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: `Kad skaičius būtų didžiausias, į aukštesnę iš dviejų laisvų skilčių rašomas didesnis skaitmuo: ${dt} ir ${t}.`,
      })
    },
  ])
}

// ── 1.2.1. Skaitmens reikšmė ────────────────────────────────────────────────

const T3 = 'skaitmens-reiksme'

const A_REIKSME = [
  {
    klausimas: 'Kokią reikšmę turi skaitmuo 6 skaičiuje $46\\,215$?',
    atsakymas: '6000',
    atsakymasRodymui: '$6000$',
    sprendimas: 'Skaitmuo 6 stovi tūkstančių skiltyje.',
  },
] as const

export const skaitmensReiksme: Generatorius = () => suBandymais(kurkReiksme, A_REIKSME, T3)

function kurkReiksme(): Uzdavinys | null {
  const n = didelis()
  const s = String(n)

  return variacija([
    // 1. Skaitmens reikšmė
    () => {
      const vieta = atsitiktinis(0, s.length - 1)
      const skaitmuo = Number(s[vieta])
      if (skaitmuo === 0) return null
      if (s.split('').filter((c) => Number(c) === skaitmuo).length > 1) return null
      const verte = skaitmuo * 10 ** (s.length - 1 - vieta)
      return uzdavinys(T3, {
        klausimas: `Kokią reikšmę turi skaitmuo ${skaitmuo} skaičiuje $${sk4(n)}$?`,
        atsakymas: String(verte),
        atsakymasRodymui: `$${sk4(verte)}$`,
        sprendimas: `Skaitmuo ${skaitmuo} stovi ${SKYRIU_VARDAI[s.length - 1 - vieta].vardas} skiltyje, tad jo reikšmė $${sk4(verte)}$.`,
        brezinys: skyriuLentele(n),
      })
    },

    // 2. Rasti skaitmenį pagal reikšmę
    () => {
      const vieta = atsitiktinis(0, s.length - 1)
      const skaitmuo = Number(s[vieta])
      if (skaitmuo === 0) return null
      const verte = skaitmuo * 10 ** (s.length - 1 - vieta)
      return uzdavinys(T3, {
        klausimas: `Skaičiuje $${sk4(n)}$ rask skaitmenį, kurio reikšmė yra $${sk4(verte)}$.`,
        atsakymas: String(skaitmuo),
        atsakymasRodymui: `$${skaitmuo}$`,
        sprendimas: `Ieškoma ${SKYRIU_VARDAI[s.length - 1 - vieta].vardas} skilties — joje stovi ${skaitmuo}.`,
      })
    },

    // 3. Kuriame skaičiuje skaitmens reikšmė nurodyta
    () => {
      const skaitmuo = atsitiktinis(2, 9)
      const verte = skaitmuo * 10000
      const su = atsitiktinis(1, 9) * 100000 + verte + atsitiktinis(0, 999)
      const be = verte / 10 + atsitiktinis(1, 9) * 100000 + atsitiktinis(0, 999)
      if (Math.floor(su / 10000) % 10 !== skaitmuo || Math.floor(be / 10000) % 10 === skaitmuo) return null
      const variantai = sumaisyk([`$${sk4(su)}$`, `$${sk4(be)}$`, `$${sk4(be + 10000)}$`])
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Kuriame skaičiuje skaitmuo ${skaitmuo} reiškia $${sk4(verte)}$?`,
        variantai,
        teisingas: variantai.indexOf(`$${sk4(su)}$`),
        sprendimas: `Ieškoma skaičiaus, kurio dešimčių tūkstančių skiltyje stovi ${skaitmuo}.`,
      })
    },

    // 4. Kiek kartų skiriasi dviejų skaitmenų reikšmės
    () => {
      const a = atsitiktinis(2, 5)
      const b = atsitiktinis(0, 2)
      if (a === b) return null
      const skaitmuo1 = atsitiktinis(2, 9)
      const skaitmuo2 = atsitiktinis(2, 9)
      // Tas pats skaitmuo abiejose vietose paverstų klausimą dviprasmišku.
      if (skaitmuo1 === skaitmuo2) return null
      const kartai = 10 ** (a - b)
      return uzdavinys(T3, {
        klausimas: `Viename skaičiuje skaitmens ${skaitmuo1} reikšmė yra $${sk4(skaitmuo1 * 10 ** a)}$, o skaitmens ${skaitmuo2} — $${sk4(skaitmuo2 * 10 ** b)}$. Kiek kartų skiriasi šių skaitmenų skyrių vertės?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${sk4(kartai)}$`,
        sprendimas: `Skyrių vertės yra $${sk4(10 ** a)}$ ir $${sk4(10 ** b)}$: $${sk4(10 ** a)} : ${sk4(10 ** b)} = ${sk4(kartai)}$.`,
      })
    },

    // 5. Padidinti skaitmens reikšmę
    () => {
      const skaitmuo = atsitiktinis(2, 9)
      const nuo = atsitiktinis(0, 2)
      const verte = skaitmuo * 10 ** nuo
      return uzdavinys(T3, {
        klausimas: `Skaitmens ${skaitmuo} reikšmė skaičiuje yra $${sk4(verte)}$. Kokia ji taptų, jei tas pats skaitmuo atsidurtų 100 kartų didesnės vertės skyriuje?`,
        atsakymas: String(verte * 100),
        atsakymasRodymui: `$${sk4(verte * 100)}$`,
        sprendimas: `$${sk4(verte)} \\cdot 100 = ${sk4(verte * 100)}$.`,
      })
    },

    // 6. Klaidingas teiginys
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Mokinys sako, kad skaitmens 7 reikšmė visuose skaičiuose vienoda. Ar jis teisus?',
        variantai: [
          'ne, reikšmė priklauso nuo skyriaus: $70\\,000$ ir $700$ skiriasi',
          'taip, septynetas visada reiškia septynis',
          'taip, jei skaičiai to paties ilgio',
        ],
        teisingas: 0,
        sprendimas: 'Skaitmens reikšmę nusako ne pats ženklas, o skiltis, kurioje jis stovi.',
      }),

    // 7. Skaičius pagal kelias skaitmenų reikšmes
    () => {
      const a = atsitiktinis(2, 9)
      const b = atsitiktinis(2, 9)
      const c = atsitiktinis(2, 9)
      // Skaitmuo turi būti atpažįstamas vienareikšmiškai — kartodamiesi jie
      // paverstų klausimą „kurio iš dviejų vienodų skaitmenų reikšmė?“.
      if (a === b || b === c || a === c) return null
      const rez = a * 10000 + b * 100 + c
      return uzdavinys(T3, {
        klausimas: `Rask skaičių, kuriame skaitmens ${a} reikšmė yra $${sk4(a * 10000)}$, skaitmens ${b} — $${b * 100}$, skaitmens ${c} — $${c}$, o kitų skyrių skaitmenys nuliai.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: `$${sk4(a * 10000)} + ${b * 100} + ${c} = ${sk4(rez)}$.`,
      })
    },
  ])
}

// ── 1.2.2. Rašome natūraliuosius skaičius ───────────────────────────────────

const T4 = 'rasome-skaicius'

const A_RASOME = [
  {
    klausimas: 'Užrašyk skaitmenimis: du šimtai keturiasdešimt penki tūkstančiai septyniolika.',
    atsakymas: '245017',
    atsakymasRodymui: '$245\\,017$',
    sprendimas: 'Tūkstančių klasė — 245, vienetų klasė — 017.',
  },
] as const

export const rasomeSkaicius: Generatorius = () => suBandymais(kurkRasyma, A_RASOME, T4)

function kurkRasyma(): Uzdavinys | null {
  const n = didelis()

  return variacija([
    // 1. Iš žodžių į skaitmenis
    () =>
      uzdavinys(T4, {
        klausimas: `Užrašyk skaitmenimis: ${zodziais(n)}.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${sk4(n)}$`,
        sprendimas: `Tūkstančių klasėje — ${Math.floor(n / 1000)}, vienetų klasėje — ${n % 1000}.`,
      }),

    // 2. Kiek pilnų tūkstančių
    () =>
      uzdavinys(T4, {
        klausimas: `Skaičių $${sk4(n)}$ perskaityk. Kiek jame pilnų tūkstančių?`,
        atsakymas: String(Math.floor(n / 1000)),
        atsakymasRodymui: `$${sk4(Math.floor(n / 1000))}$`,
        sprendimas: `Skaičius skaitomas „${zodziais(n)}“.`,
      }),

    // 3. Skaičius su nuliais viduryje
    () => {
      const a = atsitiktinis(1, 9)
      const b = atsitiktinis(1, 9)
      const rez = a * 100000 + b * 1000 + atsitiktinis(1, 99)
      return uzdavinys(T4, {
        klausimas: `Užrašyk skaitmenimis: ${zodziais(rez)}.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: 'Tuščios skiltys užpildomos nuliais — jų praleisti negalima.',
      })
    },

    // 4. Milijonų klasė
    //
    // Skaičius čia septynženklis, bet klausiama tik apie milijonų klasės
    // skaitmenį: taip mokinys turi perskaityti visą skaitvardį, o įrašyti
    // tereikia vieno skaitmens.
    () => {
      const mln = atsitiktinis(2, 9)
      const t = atsitiktinis(10, 99)
      const vnt = atsitiktinis(1, 9)
      const rez = mln * 1000000 + t * 1000 + vnt
      return uzdavinys(T4, {
        klausimas: `Skaičių „${zodziais(rez)}“ užrašyk skaitmenimis. Koks skaitmuo atsidurs milijonų skiltyje?`,
        atsakymas: String(mln),
        atsakymasRodymui: `$${mln}$`,
        sprendimas: `Milijonų klasė rašoma pirmiausia, po jos — tūkstančių ir vienetų klasės: $${sk4(rez)}$.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const t = atsitiktinis(100, 900)
      const likutis = atsitiktinis(10, 99)
      const teisingas = t * 1000 + likutis
      const klaidingas = Number(String(t).slice(0, 2) + String(likutis).padStart(3, '0'))
      if (klaidingas >= teisingas) return null
      return uzdavinys(T4, {
        klausimas: `Rask klaidą: „${zodziais(teisingas)}“ užrašyta $${sk4(klaidingas)}$. Užrašyk teisingai.`,
        atsakymas: String(teisingas),
        atsakymasRodymui: `$${sk4(teisingas)}$`,
        sprendimas: `Tūkstančių klasėje turi būti ${t}, o ne ${String(t).slice(0, 2)}.`,
      })
    },

    // 6. Vienetu didesnis už devynetus
    () => {
      const ilgis = pasirink([5, 6])
      const devynetai = Number('9'.repeat(ilgis))
      return uzdavinys(T4, {
        klausimas: `Užrašyk skaičių, kuris vienetu didesnis už $${sk4(devynetai)}$.`,
        atsakymas: String(devynetai + 1),
        atsakymasRodymui: `$${sk4(devynetai + 1)}$`,
        sprendimas: `Visi skaitmenys jau didžiausi, tad pridėjus 1 atsiranda naujas skyrius: $${sk4(devynetai + 1)}$.`,
      })
    },

    // 7. Kiek skaitmenų turės skaičius
    () => {
      const t = atsitiktinis(2, 9)
      return uzdavinys(T4, {
        klausimas: `Kiek skaitmenų turi skaičius „${zodziais(t * 100000)}“?`,
        atsakymas: '6',
        atsakymasRodymui: '$6$',
        sprendimas: `Šimtai tūkstančių yra šeštasis skyrius, tad skaičius šešiaženklis: $${sk4(t * 100000)}$.`,
      })
    },
  ])
}

// ── 1.3.1. Skaičių tiesė ────────────────────────────────────────────────────

const T5 = 'skaiciu-tiese-5'

const A_TIESE = [
  {
    klausimas: 'Koks skaičius pažymėtas tašku A?',
    atsakymas: '250',
    atsakymasRodymui: '$250$',
    sprendimas: 'Padala yra 10.',
  },
] as const

export const skaiciuTiese5: Generatorius = () => suBandymais(kurkTiese, A_TIESE, T5)

function kurkTiese(): Uzdavinys | null {
  return variacija([
    // 1. Taško reikšmė
    () => {
      const nuo = atsitiktinis(2, 9) * 100
      const zingsnis = 10
      const iesk = nuo + atsitiktinis(1, 9) * zingsnis
      if (iesk % 50 === 0) return null
      return uzdavinys(T5, {
        klausimas: 'Koks skaičius pažymėtas tašku A?',
        atsakymas: String(iesk),
        atsakymasRodymui: `$${sk4(iesk)}$`,
        sprendimas: `Viena padala yra ${zingsnis}, tad taškas stovi ties $${sk4(iesk)}$.`,
        brezinys: skaiciuTiese(nuo, nuo + 100, zingsnis, [{ reiksme: iesk, raide: 'A' }], 5),
      })
    },

    // 2. Trys taškai
    () => {
      const nuo = atsitiktinis(20, 28) * 1000
      const vietos = sumaisyk([1, 2, 3, 4, 6, 7, 8, 9]).slice(0, 3).sort((a, b) => a - b)
      const taskai = vietos.map((v, i) => ({ reiksme: nuo + v * 1000, raide: ['A', 'B', 'C'][i] }))
      return uzdavinys(T5, {
        klausimas: 'Kokia yra taško B reikšmė?',
        atsakymas: String(taskai[1].reiksme),
        atsakymasRodymui: `$${sk4(taskai[1].reiksme)}$`,
        sprendimas: `Viena padala yra 1000, tad B stovi ties $${sk4(taskai[1].reiksme)}$.`,
        brezinys: skaiciuTiese(nuo, nuo + 10000, 1000, taskai, 5),
      })
    },

    // 3. Kuris skaičius dešiniau
    () => {
      const a = atsitiktinis(1000, 9000)
      const b = a + pasirink([-72, -27, 27, 72])
      if (a === b) return null
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kuris skaičius skaičių tiesėje yra dešiniau: $${sk4(a)}$ ar $${sk4(b)}$?`,
        variantai:
          a > b ? [`$${sk4(a)}$`, `$${sk4(b)}$`, 'jie sutampa'] : [`$${sk4(b)}$`, `$${sk4(a)}$`, 'jie sutampa'],
        teisingas: 0,
        sprendimas: 'Skaičių tiesėje dešiniau stovi didesnis skaičius.',
      })
    },

    // 4. Tarp kurių dešimčių
    () => {
      const n = atsitiktinis(101, 989)
      if (n % 10 === 0) return null
      return uzdavinys(T5, {
        klausimas: `Tarp kurių dviejų gretimų dešimčių skaičių tiesėje yra $${n}$? Užrašyk mažesniąją.`,
        atsakymas: String(Math.floor(n / 10) * 10),
        atsakymasRodymui: `$${Math.floor(n / 10) * 10}$`,
        sprendimas: `$${n}$ yra tarp $${Math.floor(n / 10) * 10}$ ir $${Math.floor(n / 10) * 10 + 10}$.`,
      })
    },

    // 5. Skaičius per vidurį
    () => {
      const a = atsitiktinis(20, 60) * 10
      const b = a + atsitiktinis(4, 24) * 10
      if ((a + b) % 2 !== 0) return null
      return uzdavinys(T5, {
        klausimas: `Skaičių tiesėje taškai A ir B žymi $${sk4(a)}$ ir $${sk4(b)}$. Koks skaičius yra tiksliai per vidurį?`,
        atsakymas: String((a + b) / 2),
        atsakymasRodymui: `$${sk4((a + b) / 2)}$`,
        sprendimas: `$(${sk4(a)} + ${sk4(b)}) : 2 = ${sk4((a + b) / 2)}$.`,
        brezinys: skaiciuTiese(a, b, (b - a) / 4, [
          { reiksme: a, raide: 'A' },
          { reiksme: b, raide: 'B' },
        ]),
      })
    },

    // 6. Klaidos radimas
    () => {
      const a = atsitiktinis(30, 90) * 10
      const b = a + atsitiktinis(2, 6) * 10
      return uzdavinys(T5, {
        klausimas: `Mokinys skaičių $${sk4(b)}$ pažymėjo į kairę nuo $${sk4(a)}$. Kuris iš šių skaičių skaičių tiesėje turi būti dešiniau?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${sk4(b)}$`,
        sprendimas: `$${sk4(b)}$ didesnis už $${sk4(a)}$, tad tiesėje jis yra dešiniau.`,
      })
    },

    // 7. Padalos vertė
    () => {
      const nuo = atsitiktinis(12, 18) * 100
      const padalu = 8
      const zingsnis = 100
      return uzdavinys(T5, {
        klausimas: `Skaičių tiesėje ${padalu} vienodos padalos: pirmoji ties $${sk4(nuo)}$, paskutinė ties $${sk4(nuo + padalu * zingsnis)}$. Kokia yra vienos padalos vertė?`,
        atsakymas: String(zingsnis),
        atsakymasRodymui: `$${zingsnis}$`,
        sprendimas: `$(${sk4(nuo + padalu * zingsnis)} - ${sk4(nuo)}) : ${padalu} = ${zingsnis}$.`,
        brezinys: skaiciuTiese(nuo, nuo + padalu * zingsnis, zingsnis, [], 4),
      })
    },
  ])
}

// ── 1.3.2. Palyginame natūraliuosius skaičius ───────────────────────────────

const T6 = 'palyginame-skaicius-5'

const A_PALYGINIMAS = [
  {
    klausimas: 'Kuris skaičius didesnis: $48\\,305$ ar $48\\,350$?',
    atsakymas: '48350',
    atsakymasRodymui: '$48\\,350$',
    sprendimas: 'Pirmieji trys skaitmenys sutampa, o dešimčių skiltyje 5 daugiau už 0.',
  },
] as const

export const palyginameSkaicius5: Generatorius = () =>
  suBandymais(kurkPalyginima, A_PALYGINIMAS, T6)

function kurkPalyginima(): Uzdavinys | null {
  return variacija([
    // 1. Du panašūs skaičiai
    () => {
      const a = didelis()
      const s = String(a)
      const vieta = atsitiktinis(1, s.length - 2)
      const skaitmuo = Number(s[vieta])
      if (skaitmuo >= 9) return null
      const b = a + 10 ** (s.length - 1 - vieta)
      return uzdavinys(T6, {
        klausimas: `Kuris skaičius didesnis: $${sk4(a)}$ ar $${sk4(b)}$?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${sk4(b)}$`,
        sprendimas: 'Lyginama nuo aukščiausio skyriaus; nulemia pirmasis skirtingas skaitmuo.',
      })
    },

    // 2. Per skyriaus ribą
    () => {
      const riba = atsitiktinis(2, 9) * 100000
      const a = riba + atsitiktinis(1, 9)
      const b = riba - atsitiktinis(1, 9)
      return uzdavinys(T6, {
        klausimas: `Kuris skaičius didesnis: $${sk4(a)}$ ar $${sk4(b)}$?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${sk4(a)}$`,
        sprendimas: `$${sk4(b)}$ dar nepasiekia $${sk4(riba)}$, o $${sk4(a)}$ jį jau peržengia.`,
      })
    },

    // 3. Rikiavimas didėjimo tvarka
    () => {
      const a = atsitiktinis(1, 9)
      const b = atsitiktinis(0, 9)
      if (a === b) return null
      const trys = [
        a * 100 + b * 10 + b,
        a * 100 + a * 10 + b,
        b * 100 + a * 10 + a,
      ].filter((x) => x >= 100)
      if (new Set(trys).size < 3) return null
      const eile = [...trys].sort((x, y) => x - y)
      return eiliskumoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Surikiuok skaičius didėjimo tvarka.',
        teisingaEile: eile.map((x) => `$${sk4(x)}$`),
        sprendimas: `${eile.map((x) => tekstu(x)).join(' < ')}.`,
      })
    },

    // 4. Rikiavimas mažėjimo tvarka
    () => {
      const keturi = sumaisyk([909099, 990009, 900999, 999000])
      const eile = [...keturi].sort((x, y) => y - x)
      return eiliskumoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Surikiuok skaičius mažėjimo tvarka.',
        teisingaEile: eile.map((x) => `$${sk4(x)}$`),
        sprendimas: 'Visi prasideda devynetu, tad lemia tolesnės skiltys — lyginama iš eilės, kol randamas skirtumas.',
      })
    },

    // 5. Trūkstamas skaitmuo nelygybėje
    () => {
      const pagrindas = atsitiktinis(40, 90) * 10000
      const uodega = atsitiktinis(100, 999)
      const maz = atsitiktinis(1, 6)
      const did = maz + atsitiktinis(2, 3)
      if (did > 9) return null
      const skaitmuo = maz + 1
      return uzdavinys(T6, {
        klausimas: `Įrašyk skaitmenį taip, kad nelygybės būtų teisingos: $${sk4(pagrindas + maz * 1000 + uodega)} < ${Math.floor(pagrindas / 10000)}\\square\\square\\,${String(uodega).padStart(3, '0')} < ${sk4(pagrindas + did * 1000 + uodega)}$, kai tūkstančių skaitmuo yra vienintelis nežinomas. Koks jis?`,
        atsakymas: String(skaitmuo),
        atsakymasRodymui: `$${skaitmuo}$`,
        sprendimas: `Tinka skaitmenys nuo ${maz + 1} iki ${did - 1}; mažiausias iš jų — ${skaitmuo}.`,
      })
    },

    // 6. Didžiausias skaičius su sąlyga
    () => {
      const riba = atsitiktinis(5, 9) * 10000
      const didziausias = riba - 1
      return uzdavinys(T6, {
        klausimas: `Rask didžiausią penkiaženklį skaičių, mažesnį už $${sk4(riba)}$.`,
        atsakymas: String(didziausias),
        atsakymasRodymui: `$${sk4(didziausias)}$`,
        sprendimas: `Iškart prieš $${sk4(riba)}$ eina $${sk4(didziausias)}$.`,
      })
    },

    // 7. Klaidingas palyginimas
    () => {
      const a = atsitiktinis(4, 6)
      const b = a + atsitiktinis(1, 3)
      if (b > 9) return null
      const maz = a * 100000 + atsitiktinis(1, 9) * 1000 + 999
      const did = b * 100000 + atsitiktinis(0, 9) * 1000 + 1
      return uzdavinys(T6, {
        klausimas: `Mokinys teigia, kad $${sk4(maz)} > ${sk4(did)}$, nes $999 > 1$. Kuris skaičius iš tikrųjų didesnis?`,
        atsakymas: String(did),
        atsakymasRodymui: `$${sk4(did)}$`,
        sprendimas: 'Lyginti pradedama nuo aukščiausio skyriaus, o ne nuo paskutinių skaitmenų.',
      })
    },
  ])
}

// ── 1.4.1. Apvaliname iki dešimčių ──────────────────────────────────────────

const T7 = 'apvaliname-iki-desimciu'

const A_DESIMTYS = [
  {
    klausimas: 'Suapvalink $347$ iki dešimčių.',
    atsakymas: '350',
    atsakymasRodymui: '$350$',
    sprendimas: 'Vienetų skaitmuo 7, tad apvalinama į viršų.',
  },
] as const

export const apvalinameIkiDesimciu: Generatorius = () =>
  suBandymais(kurkDesimtis, A_DESIMTYS, T7)

/** Apvalinimas: lygiai pusė — į viršų. */
function apvalink(n: number, tikslumas: number): number {
  return Math.round(n / tikslumas) * tikslumas
}

function kurkDesimtis(): Uzdavinys | null {
  const n = atsitiktinis(102, 9987)

  return variacija([
    // 1. Apvalinimas
    () => {
      if (n % 10 === 0) return null
      return uzdavinys(T7, {
        klausimas: `Suapvalink $${sk4(n)}$ iki dešimčių.`,
        atsakymas: String(apvalink(n, 10)),
        atsakymasRodymui: `$${sk4(apvalink(n, 10))}$`,
        sprendimas: `Vienetų skaitmuo ${n % 10}, tad apvalinama ${n % 10 >= 5 ? 'į viršų' : 'į apačią'}.`,
      })
    },

    // 2. Per šimto ribą
    () => {
      const pagrindas = atsitiktinis(10, 98) * 100
      const skaicius = pagrindas + 95 + atsitiktinis(0, 4)
      return uzdavinys(T7, {
        klausimas: `Suapvalink $${sk4(skaicius)}$ iki dešimčių.`,
        atsakymas: String(pagrindas + 100),
        atsakymasRodymui: `$${sk4(pagrindas + 100)}$`,
        sprendimas: `Apvalinant į viršų dešimtys peržengia šimtą: $${sk4(pagrindas + 100)}$.`,
      })
    },

    // 3. Kuris skaitmuo lemia
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Kuris skaitmuo lemia, kaip $${sk4(n)}$ apvalinamas iki dešimčių?`,
        variantai: ['vienetų', 'dešimčių', 'šimtų', 'pirmasis iš kairės'],
        teisingas: 0,
        sprendimas: 'Apvalinant iki dešimčių žiūrima į skaitmenį, esantį iškart už dešimčių skilties — tai vienetai.',
      }),

    // 4. Iš skaičių tiesės
    () => {
      const desimtis = atsitiktinis(34, 98) * 10
      const skaicius = desimtis + atsitiktinis(1, 9)
      if (skaicius % 10 === 5) return null
      return uzdavinys(T7, {
        klausimas: 'Iki kurios dešimties apvalinamas tašku pažymėtas skaičius?',
        atsakymas: String(apvalink(skaicius, 10)),
        atsakymasRodymui: `$${sk4(apvalink(skaicius, 10))}$`,
        sprendimas: `Taškas arčiau ${skaicius % 10 > 5 ? 'dešiniojo' : 'kairiojo'} galo, tad apvalinama iki $${sk4(apvalink(skaicius, 10))}$.`,
        brezinys: skaiciuTiese(desimtis, desimtis + 10, 1, [{ reiksme: skaicius }], 5),
      })
    },

    // 5. Mažiausias ir didžiausias
    () => {
      const desimtis = atsitiktinis(30, 90) * 10
      return uzdavinys(T7, {
        klausimas: `Koks yra mažiausias sveikasis skaičius, kuris apvalinant iki dešimčių tampa $${sk4(desimtis)}$?`,
        atsakymas: String(desimtis - 5),
        atsakymasRodymui: `$${sk4(desimtis - 5)}$`,
        sprendimas: `Tinka skaičiai nuo $${sk4(desimtis - 5)}$ iki $${sk4(desimtis + 4)}$.`,
      })
    },

    // 6. Kiek skaičių apvalinama iki duoto
    () => {
      const desimtis = atsitiktinis(50, 200) * 10
      return uzdavinys(T7, {
        klausimas: `Kiek skirtingų natūraliųjų skaičių suapvalinus iki dešimčių gaunama $${sk4(desimtis)}$?`,
        atsakymas: '10',
        atsakymasRodymui: '$10$',
        sprendimas: `Tinka visi nuo $${sk4(desimtis - 5)}$ iki $${sk4(desimtis + 4)}$ — jų dešimt.`,
      })
    },

    // 7. Klaidos radimas
    () => {
      const pagrindas = atsitiktinis(20, 90) * 100
      const skaicius = pagrindas + atsitiktinis(45, 49)
      return uzdavinys(T7, {
        klausimas: `Mokinys $${sk4(skaicius)}$ suapvalino iki dešimčių ir gavo $${sk4(Math.floor(skaicius / 10) * 10 + 10)}$. Užrašyk teisingą atsakymą.`,
        atsakymas: String(apvalink(skaicius, 10)),
        atsakymasRodymui: `$${sk4(apvalink(skaicius, 10))}$`,
        sprendimas: `Vienetų skaitmuo ${skaicius % 10} yra mažesnis už 5, tad dešimtys nekeičiamos.`,
      })
    },
  ])
}

// ── 1.4.2. Apvaliname iki nurodyto skyriaus ─────────────────────────────────

const T8 = 'apvaliname-iki-skyriaus'

const A_SKYRIAUS = [
  {
    klausimas: 'Suapvalink $56\\,482$ iki šimtų.',
    atsakymas: '56500',
    atsakymasRodymui: '$56\\,500$',
    sprendimas: 'Dešimčių skaitmuo 8, tad apvalinama į viršų.',
  },
] as const

const TIKSLUMAI = [
  { verte: 100, vardas: 'šimtų' },
  { verte: 1000, vardas: 'tūkstančių' },
  { verte: 10000, vardas: 'dešimčių tūkstančių' },
  { verte: 100000, vardas: 'šimtų tūkstančių' },
] as const

export const apvalinameIkiSkyriaus: Generatorius = () =>
  suBandymais(kurkSkyriu, A_SKYRIAUS, T8)

function kurkSkyriu(): Uzdavinys | null {
  const n = didelis()
  const t = pasirink(TIKSLUMAI)
  if (n < t.verte * 2) return null

  return variacija([
    // 1. Apvalinimas
    () =>
      uzdavinys(T8, {
        klausimas: `Suapvalink $${sk4(n)}$ iki ${t.vardas}.`,
        atsakymas: String(apvalink(n, t.verte)),
        atsakymasRodymui: `$${sk4(apvalink(n, t.verte))}$`,
        sprendimas: `Žiūrima į skaitmenį, esantį iškart už ${t.vardas} skilties: jis yra ${Math.floor(n / (t.verte / 10)) % 10}, tad apvalinama ${
          Math.floor(n / (t.verte / 10)) % 10 >= 5 ? 'į viršų' : 'į apačią'
        }.`,
      }),

    // 2. Per ribą
    () => {
      const pagrindas = atsitiktinis(10, 74) * 10000
      const skaicius = pagrindas + 9999
      return uzdavinys(T8, {
        klausimas: `Suapvalink $${sk4(skaicius)}$ iki dešimčių tūkstančių.`,
        atsakymas: String(pagrindas + 10000),
        atsakymasRodymui: `$${sk4(pagrindas + 10000)}$`,
        sprendimas: `Tūkstančių skaitmuo 9, tad apvalinama į viršų — iki $${sk4(pagrindas + 10000)}$.`,
      })
    },

    // 3. Kurį skaitmenį tikriname
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Kurį skaitmenį reikia patikrinti apvalinant $${sk4(n)}$ iki ${t.vardas}?`,
        variantai: [
          `esantį iškart už ${t.vardas} skilties`,
          'paskutinį skaičiaus skaitmenį',
          'pirmąjį skaičiaus skaitmenį',
          `patį ${t.vardas} skaitmenį`,
        ],
        teisingas: 0,
        sprendimas: 'Apvalinama pagal artimiausią žemesnę skiltį — tik ji lemia, į kurią pusę eiti.',
      }),

    // 4. Mažiausias skaičius
    () => {
      const tikslas = apvalink(n, t.verte)
      if (tikslas === 0) return null
      return uzdavinys(T8, {
        klausimas: `Koks yra mažiausias skaičius, kuris apvalinant iki ${t.vardas} tampa $${sk4(tikslas)}$?`,
        atsakymas: String(tikslas - t.verte / 2),
        atsakymasRodymui: `$${sk4(tikslas - t.verte / 2)}$`,
        sprendimas: `Tinka visi nuo $${sk4(tikslas - t.verte / 2)}$ iki $${sk4(tikslas + t.verte / 2 - 1)}$.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const skaicius = atsitiktinis(710, 799) * 1000 + atsitiktinis(100, 900)
      const teisingas = apvalink(skaicius, 10000)
      const klaidingas = Math.floor(skaicius / 10000) * 10000
      if (teisingas === klaidingas) return null
      return uzdavinys(T8, {
        klausimas: `Mokinys $${sk4(skaicius)}$ iki dešimčių tūkstančių suapvalino $${sk4(klaidingas)}$. Užrašyk teisingą atsakymą.`,
        atsakymas: String(teisingas),
        atsakymasRodymui: `$${sk4(teisingas)}$`,
        sprendimas: `Tūkstančių skaitmuo yra ${Math.floor(skaicius / 1000) % 10}, tad apvalinama į viršų.`,
      })
    },

    // 6. Du apvalinimai
    () => {
      const skaicius = atsitiktinis(57500, 59499)
      const iki1000 = apvalink(skaicius, 1000)
      const iki10000 = apvalink(skaicius, 10000)
      if (iki1000 === iki10000) return null
      return uzdavinys(T8, {
        klausimas: `Skaičių $${sk4(skaicius)}$ suapvalink iki tūkstančių ir iki dešimčių tūkstančių. Kiek skiriasi gauti rezultatai?`,
        atsakymas: String(Math.abs(iki1000 - iki10000)),
        atsakymasRodymui: `$${sk4(Math.abs(iki1000 - iki10000))}$`,
        sprendimas: `Iki tūkstančių — $${sk4(iki1000)}$, iki dešimčių tūkstančių — $${sk4(iki10000)}$.`,
      })
    },

    // 7. Kodėl skiriasi rezultatai
    () => {
      const pagrindas = atsitiktinis(100, 800) * 1000
      const a = pagrindas + 499
      const b = pagrindas + 501
      return uzdavinys(T8, {
        klausimas: `Suapvalink $${sk4(b)}$ iki tūkstančių. (Palyginimui: $${sk4(a)}$ suapvalinamas iki $${sk4(pagrindas)}$.)`,
        atsakymas: String(pagrindas + 1000),
        atsakymasRodymui: `$${sk4(pagrindas + 1000)}$`,
        sprendimas: 'Skaičiai skiriasi vos dviem vienetais, bet vienas jų nesiekia pusės tūkstančio, o kitas ją peržengia — todėl apvalinami į skirtingas puses.',
      })
    },
  ])
}

// ── 1.5.1. Romėniškieji skaitmenys ──────────────────────────────────────────

const T9 = 'romeniskieji-skaitmenys'

const A_ROMENISKI = [
  {
    klausimas: 'Kokią reikšmę turi romėniškasis skaitmuo V?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'V žymi penketą.',
  },
] as const

const ZENKLU_VERTES = [
  { zenklas: 'I', verte: 1 },
  { zenklas: 'V', verte: 5 },
  { zenklas: 'X', verte: 10 },
  { zenklas: 'L', verte: 50 },
  { zenklas: 'C', verte: 100 },
] as const

export const romeniskiejiSkaitmenys: Generatorius = () =>
  suBandymais(kurkRomeniskus, A_ROMENISKI, T9)

function kurkRomeniskus(): Uzdavinys | null {
  return variacija([
    // 1. Vieno ženklo reikšmė
    () => {
      const z = pasirink(ZENKLU_VERTES)
      return uzdavinys(T9, {
        klausimas: `Kokią reikšmę turi romėniškasis skaitmuo ${z.zenklas}?`,
        atsakymas: String(z.verte),
        atsakymasRodymui: `$${z.verte}$`,
        sprendimas: `${z.zenklas} žymi ${z.verte}.`,
      })
    },

    // 2. Perskaityti skaičių
    () => {
      const n = atsitiktinis(6, 39)
      return uzdavinys(T9, {
        klausimas: `Perskaityk romėniškai užrašytą skaičių: ${romeniskai(n)}.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `${romeniskai(n)} reiškia ${n}.`,
      })
    },

    // 3. Kuris didesnis
    () => {
      const a = atsitiktinis(4, 30)
      const b = atsitiktinis(4, 30)
      if (a === b) return null
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kuris skaičius didesnis: ${romeniskai(a)} ar ${romeniskai(b)}?`,
        variantai:
          a > b
            ? [romeniskai(a), romeniskai(b), 'jie lygūs']
            : [romeniskai(b), romeniskai(a), 'jie lygūs'],
        teisingas: 0,
        sprendimas: `${romeniskai(a)} yra ${a}, o ${romeniskai(b)} — ${b}.`,
      })
    },

    // 4. Kodėl IV yra 4
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kodėl IV reiškia 4, o VI — 6?',
        variantai: [
          'mažesnis ženklas prieš didesnį atimamas, o po jo — pridedamas',
          'ženklų tvarka reikšmės nekeičia',
          'I visada atimamas',
          'V visada atimamas',
        ],
        teisingas: 0,
        sprendimas: '$5 - 1 = 4$, o $5 + 1 = 6$.',
      }),

    // 5. Klaidos radimas
    () => {
      const n = pasirink([4, 9, 14, 19, 40])
      const klaidingas = n + pasirink([1, 2])
      return uzdavinys(T9, {
        klausimas: `Rask klaidą: ${romeniskai(n)} $= ${klaidingas}$. Užrašyk teisingą reikšmę.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `${romeniskai(n)} reiškia ${n}, nes mažesnis ženklas prieš didesnį atimamas.`,
      })
    },

    // 6. Rikiavimas
    () => {
      const keturi = sumaisyk([6, 9, 14, 19])
      const eile = [...keturi].sort((a, b) => a - b)
      return eiliskumoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Surikiuok romėniškai užrašytus skaičius didėjimo tvarka.',
        teisingaEile: eile.map((x) => romeniskai(x)),
        sprendimas: `Jų reikšmės: ${eile.join(', ')}.`,
      })
    },

    // 7. Laikrodžio ciferblatas
    () => {
      const valanda = pasirink([3, 4, 6, 9, 11, 12])
      return uzdavinys(T9, {
        klausimas: `Ciferblate romėniškaisiais skaitmenimis pažymėta ${valanda} valanda. Kaip ji užrašyta?`,
        atsakymas: romeniskai(valanda).toLowerCase(),
        atsakymasRodymui: romeniskai(valanda),
        sprendimas: `${valanda} romėniškai yra ${romeniskai(valanda)}.`,
        brezinys: romenuLaikrodis(valanda),
      })
    },

    // 8. Kokie veiksmai užraše
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kokie veiksmai atliekami skaičiuje XIV?',
        variantai: [
          '$10 + (5 - 1)$',
          '$10 + 1 + 5$',
          '$10 - 1 - 5$',
          '$10 \\cdot 1 \\cdot 5$',
        ],
        teisingas: 0,
        sprendimas: 'X yra 10, o IV — $5 - 1 = 4$; iš viso 14.',
      }),
  ])
}

// ── 1.5.2. Rašome skaičius romėniškaisiais skaitmenimis ─────────────────────

const T10 = 'rasome-romeniskai'

const A_RASOME_ROM = [
  {
    klausimas: 'Užrašyk romėniškaisiais skaitmenimis 4.',
    atsakymas: 'iv',
    atsakymasRodymui: 'IV',
    sprendimas: '$5 - 1 = 4$.',
  },
] as const

export const rasomeRomeniskai: Generatorius = () =>
  suBandymais(kurkRasymaRomeniskai, A_RASOME_ROM, T10)

function kurkRasymaRomeniskai(): Uzdavinys | null {
  return variacija([
    // 1. Mažas skaičius
    () => {
      const n = atsitiktinis(4, 20)
      return uzdavinys(T10, {
        klausimas: `Užrašyk romėniškaisiais skaitmenimis ${n}.`,
        atsakymas: romeniskai(n).toLowerCase(),
        atsakymasRodymui: romeniskai(n),
        sprendimas: `${n} romėniškai yra ${romeniskai(n)}.`,
      })
    },

    // 2. Iš romėniškų į arabiškus
    () => {
      const n = atsitiktinis(11, 49)
      return uzdavinys(T10, {
        klausimas: `Užrašyk arabiškais skaitmenimis ${romeniskai(n)}.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `${romeniskai(n)} reiškia ${n}.`,
      })
    },

    // 3. Didesnis skaičius
    () => {
      const n = atsitiktinis(21, 89)
      return uzdavinys(T10, {
        klausimas: `Užrašyk romėniškaisiais skaitmenimis ${n}.`,
        atsakymas: romeniskai(n).toLowerCase(),
        atsakymasRodymui: romeniskai(n),
        sprendimas: `Dešimtys rašomos pirmiau: ${romeniskai(Math.floor(n / 10) * 10)}, paskui vienetai ${n % 10 === 0 ? '(jų nėra)' : romeniskai(n % 10)}.`,
      })
    },

    // 4. Klaidos radimas
    () => {
      const n = pasirink([14, 19, 24, 29, 40])
      return uzdavinys(T10, {
        klausimas: `Mokinys skaičių ${n} užrašė ${'I'.repeat(Math.min(4, n % 10 || 1))}${'X'.repeat(Math.floor(n / 10))}. Užrašyk teisingai.`,
        atsakymas: romeniskai(n).toLowerCase(),
        atsakymasRodymui: romeniskai(n),
        sprendimas: `Romėniškame užraše didesni ženklai rašomi pirmiau, o atimtis žymima vienu mažesniu ženklu prieš didesnį: ${romeniskai(n)}.`,
      })
    },

    // 5. Palyginimas
    () => {
      const a = pasirink([39, 41, 44, 46])
      const b = 40
      if (a === b) return null
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Kuris skaičius didesnis: ${romeniskai(a)} ar ${romeniskai(b)}?`,
        variantai:
          a > b
            ? [romeniskai(a), romeniskai(b), 'jie lygūs']
            : [romeniskai(b), romeniskai(a), 'jie lygūs'],
        teisingas: 0,
        sprendimas: `${romeniskai(a)} yra ${a}, ${romeniskai(b)} — ${b}.`,
      })
    },

    // 6. Kelių skaičių užrašymas
    () => {
      const trys = sumaisyk([24, 39, 48, 27, 36]).slice(0, 3)
      const eile = [...trys].sort((a, b) => a - b)
      return eiliskumoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Surikiuok romėniškai užrašytus skaičius didėjimo tvarka.',
        teisingaEile: eile.map((x) => romeniskai(x)),
        sprendimas: `Reikšmės: ${eile.join(', ')}.`,
      })
    },

    // 7. Kiek ženklų reikia
    () => {
      const n = atsitiktinis(6, 48)
      return uzdavinys(T10, {
        klausimas: `Iš kelių ženklų susideda skaičiaus ${n} romėniškas užrašas?`,
        atsakymas: String(romeniskai(n).length),
        atsakymasRodymui: `$${romeniskai(n).length}$ (${romeniskai(n)})`,
        sprendimas: `${n} užrašomas ${romeniskai(n)}.`,
      })
    },

    // 8. Susieti užrašus
    () => {
      const trys = sumaisyk([4, 9, 14, 19, 40, 44]).slice(0, 3)
      return poruUzdavinys(naujasId(T10), T10, {
        klausimas: 'Susiek romėnišką užrašą su jo reikšme.',
        poros: trys.map((x) => ({ kaire: romeniskai(x), desine: String(x) })),
        sprendimas: 'Mažesnis ženklas prieš didesnį reiškia atimtį.',
      })
    },
  ])
}
