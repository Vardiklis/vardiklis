import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { D, MIESTAI, VARDAI, kiek, sk4, tekstu, zodziais } from './ketvirtokams-bendra'
import {
  daugybaStulpeliu,
  dalybaKampu,
  juostuSchema,
  pintosSekos,
  programosLangas,
  reiskinioTvarka,
  skaiciuTiese,
  skyriuLentele,
} from './ketvirtokams-vaizdai'
import { stulpelis4 } from './treciokams-tukstanciai-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 4 klasės tema „Skaičiai ir skaičiavimai iki 100 000“ — penkiolika potemių.
 *
 * Anksčiau jos rėmėsi `sveikieji`, `skaitmenys`, `sekos` ir `veiksmu-tvarka`
 * generatoriais, sukurtais 5–10 klasėms: pasitaikydavo neigiamų skaičių,
 * laipsnių ir šimtamilijoninių sandaugų, kurių ketvirtoje klasėje dar nėra.
 *
 * Potemės čia skiriasi ne skaičių dydžiu, o klausimo kryptimi. Trys pirmosios
 * yra praėjusių metų kartojimas (iki 10 000), penkios vidurinės — naujas
 * skaičių ruožas (iki 100 000), o paskutinės keturios klausia ne rezultato, o
 * tvarkos: kuris veiksmas pirmas, kokia sekos taisyklė, koks reiškinys atitinka
 * sąlygą.
 */


/** Keturženklis be nulių viduryje — kad skyrių klausimai turėtų prasmę. */
function keturzenklis(): number {
  return atsitiktinis(1, 9) * 1000 + atsitiktinis(0, 9) * 100 + atsitiktinis(0, 9) * 10 + atsitiktinis(0, 9)
}

function penkiazenklis(): number {
  return atsitiktinis(10000, 99999)
}

// ── 1.1 Ką žinau apie skaičius iki 10 000? ──────────────────────────────────

const T = 'skaiciai-iki-10000-4'

const A_SKAICIAI_10000 = [
  {
    klausimas: 'Kiek iš viso šimtų yra skaičiuje 4 508?',
    atsakymas: '45',
    atsakymasRodymui: '$45$ šimtai',
    sprendimas: '$4508 : 100 = 45$ (lieka 8), tad šimtų yra 45.',
  },
] as const

export const skaiciaiIki10000: Generatorius = () => suBandymais(kurkSkaicius10000, A_SKAICIAI_10000, T)

function kurkSkaicius10000(): Uzdavinys | null {
  const n = keturzenklis()

  return variacija([
    // 1. Iš žodžių į skaitmenis
    () =>
      uzdavinys(T, {
        klausimas: `Užrašyk skaitmenimis: ${zodziais(n)}.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${sk4(n)}$`,
        sprendimas: `Tūkstančiai — ${Math.floor(n / 1000)}, šimtai — ${Math.floor(n / 100) % 10}, dešimtys — ${Math.floor(n / 10) % 10}, vienetai — ${n % 10}.`,
      }),

    // 2. Kiek iš viso šimtų (ne skaitmuo, o kiekis)
    () => {
      if (n < 1000) return null
      return uzdavinys(T, {
        klausimas: `Kiek iš viso šimtų yra skaičiuje $${sk4(n)}$?`,
        atsakymas: String(Math.floor(n / 100)),
        atsakymasRodymui: `$${Math.floor(n / 100)}$`,
        sprendimas: `Vienas šimtas telpa $${sk4(n)}$ tiek kartų, kiek rodo pirmi du skaitmenys: $${Math.floor(n / 100)}$.`,
        brezinys: skyriuLentele(n),
      })
    },

    // 3. Rikiavimas: tie patys skaitmenys, kita tvarka
    () => {
      const a = atsitiktinis(1, 9)
      const b = atsitiktinis(0, 9)
      const c = atsitiktinis(0, 9)
      if (a === b || b === c || a === c) return null
      const trys = [
        a * 1000 + b * 100 + c * 10 + b,
        a * 1000 + c * 100 + b * 10 + b,
        a * 1000 + b * 100 + b * 10 + c,
      ]
      if (new Set(trys).size < 3) return null
      const eile = [...trys].sort((x, y) => x - y)
      return eiliskumoUzdavinys(naujasId(T), T, {
        klausimas: 'Surikiuok skaičius didėjimo tvarka.',
        teisingaEile: eile.map((x) => `$${sk4(x)}$`),
        sprendimas: `Visų tūkstančių skaitmuo tas pats, tad lyginami šimtai, paskui dešimtys: ${eile.map((x) => tekstu(x)).join(' < ')}.`,
      })
    },

    // 4. Kaimynai per skyriaus ribą
    () => {
      const pagrindas = atsitiktinis(2, 9) * 1000 + atsitiktinis(0, 8) * 100
      const skaicius = pagrindas + 99
      return uzdavinys(T, {
        klausimas: `Koks skaičius eina iškart po $${sk4(skaicius)}$?`,
        atsakymas: String(skaicius + 1),
        atsakymasRodymui: `$${sk4(skaicius + 1)}$`,
        sprendimas: `Vienetų ir dešimčių skaitmenys jau didžiausi, tad pridėjus 1 pilnas šimtas: $${sk4(skaicius + 1)}$.`,
      })
    },

    // 5. Taškas skaičių tiesėje
    () => {
      const nuo = atsitiktinis(1, 8) * 1000
      const zingsnis = 100
      const iesk = nuo + atsitiktinis(1, 9) * zingsnis
      if (iesk % 500 === 0) return null
      return uzdavinys(T, {
        klausimas: 'Koks skaičius pažymėtas tašku?',
        atsakymas: String(iesk),
        atsakymasRodymui: `$${sk4(iesk)}$`,
        sprendimas: `Padala yra 100, tad taškas stovi ties $${sk4(iesk)}$.`,
        brezinys: skaiciuTiese(nuo, nuo + 1000, zingsnis, [{ reiksme: iesk }], 5),
      })
    },

    // 6. Didžiausias ir mažiausias iš duotų skaitmenų
    () => {
      const skaitmenys = sumaisyk([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]).slice(0, 4)
      if (!skaitmenys.some((s) => s > 0)) return null
      const didz = [...skaitmenys].sort((a, b) => b - a)
      const maz = [...skaitmenys].sort((a, b) => a - b)
      if (maz[0] === 0) [maz[0], maz[1]] = [maz[1], maz[0]]
      const didziausias = Number(didz.join(''))
      const maziausias = Number(maz.join(''))
      return uzdavinys(T, {
        klausimas: `Iš skaitmenų ${skaitmenys.join(', ')} sudaryk didžiausią ir mažiausią keturženklį skaičių. Kiek jie skiriasi?`,
        atsakymas: String(didziausias - maziausias),
        atsakymasRodymui: `$${sk4(didziausias - maziausias)}$`,
        sprendimas: `Didžiausias — $${sk4(didziausias)}$, mažiausias — $${sk4(maziausias)}$ (nuliu skaičius neprasideda). $${sk4(didziausias)} - ${sk4(maziausias)} = ${sk4(didziausias - maziausias)}$.`,
      })
    },

    // 7. Skaičius pagal sąlygas
    () => {
      const tukst = atsitiktinis(2, 8)
      const simtai = atsitiktinis(1, 8)
      const des = atsitiktinis(1, 8)
      const vnt = atsitiktinis(1, 9)
      const rez = tukst * 1000 + simtai * 100 + des * 10 + vnt
      return uzdavinys(T, {
        klausimas: `Rask skaičių, kuris didesnis už $${sk4(tukst * 1000 + simtai * 100)}$, mažesnis už $${sk4(tukst * 1000 + (simtai + 1) * 100)}$, jo dešimčių skaitmuo yra ${des}, o vienetų — ${vnt}.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: `Tūkstančiai ir šimtai jau nusakyti: $${tukst}$ ir $${simtai}$. Pridėjus nurodytas dešimtis ir vienetus gaunama $${sk4(rez)}$.`,
      })
    },

    // 8. Kodėl vienas mažesnis — palyginimo pagrindas
    () => {
      const skyrius = pasirink([1000, 100])
      const a = keturzenklis()
      const b = a + skyrius
      if (b > 9999) return null
      const vardas = skyrius === 1000 ? 'tūkstančių' : 'šimtų'
      return pasirinkimoUzdavinys(naujasId(T), T, {
        klausimas: `Kodėl $${sk4(a)}$ mažesnis už $${sk4(b)}$?`,
        variantai: [
          `nes ${vardas} skaitmuo mažesnis`,
          'nes jame mažiau skaitmenų',
          'nes jo vienetų skaitmuo mažesnis',
          'nes jo skaitmenų suma mažesnė',
        ],
        teisingas: 0,
        sprendimas: `Abu skaičiai keturženkliai, o lyginant pradedama nuo aukščiausio skyriaus, kuriame skaitmenys skiriasi — čia tai ${vardas} skyrius.`,
      })
    },

    // 9. Skaitmenų suma
    () =>
      uzdavinys(T, {
        klausimas: `Kokia yra skaičiaus $${sk4(n)}$ skaitmenų suma?`,
        atsakymas: String(String(n).split('').reduce((s, c) => s + Number(c), 0)),
        atsakymasRodymui: `$${String(n).split('').reduce((s, c) => s + Number(c), 0)}$`,
        sprendimas: `$${String(n).split('').join(' + ')} = ${String(n)
          .split('')
          .reduce((s, c) => s + Number(c), 0)}$.`,
      }),
  ])
}

// ── 1.2 Kaip moku sudėti ir atimti skaičius iki 10 000? ─────────────────────

const T2 = 'sudetis-atimtis-10000-4'

const A_SUDETIS_10000 = [
  {
    klausimas: 'Apskaičiuok: $2\\,450 + 1\\,380$.',
    atsakymas: '3830',
    atsakymasRodymui: '$3830$',
    sprendimas: '$2450 + 1380 = 3830$.',
  },
] as const

export const sudetisAtimtis10000: Generatorius = () =>
  suBandymais(kurkSudetiAtimti10000, A_SUDETIS_10000, T2)

function kurkSudetiAtimti10000(): Uzdavinys | null {
  const a = atsitiktinis(1200, 8600)
  const b = atsitiktinis(600, 1300)

  return variacija([
    // 1. Sudėtis stulpeliu
    () =>
      uzdavinys(T2, {
        klausimas: 'Sudėk stulpeliu.',
        atsakymas: String(a + b),
        atsakymasRodymui: `$${sk4(a + b)}$`,
        sprendimas: `$${sk4(a)} + ${sk4(b)} = ${sk4(a + b)}$.`,
        brezinys: stulpelis4(a, b, '+', null),
      }),

    // 2. Atimtis stulpeliu
    () =>
      uzdavinys(T2, {
        klausimas: 'Atimk stulpeliu.',
        atsakymas: String(a - b),
        atsakymasRodymui: `$${sk4(a - b)}$`,
        sprendimas: `$${sk4(a)} - ${sk4(b)} = ${sk4(a - b)}$.`,
        brezinys: stulpelis4(a, b, '−', null),
      }),

    // 3. Trūkstamas dėmuo
    () =>
      uzdavinys(T2, {
        klausimas: `Rask trūkstamą dėmenį: $\\square + ${sk4(b)} = ${sk4(a + b)}$.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${sk4(a)}$`,
        sprendimas: `Dėmuo randamas iš sumos atėmus kitą dėmenį: $${sk4(a + b)} - ${sk4(b)} = ${sk4(a)}$.`,
      }),

    // 4. Trys dėmenys su patogia pora
    () => {
      const c = 1000 - (b % 1000 === 0 ? 400 : b % 1000)
      if (c <= 0 || c >= 1000) return null
      return uzdavinys(T2, {
        klausimas: `Apskaičiuok patogiu būdu: $${sk4(a)} + ${sk4(b)} + ${c}$.`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${sk4(a + b + c)}$`,
        sprendimas: `$${sk4(b)} + ${c}$ duoda apvalų $${sk4(b + c)}$, tad lieka $${sk4(a)} + ${sk4(b + c)} = ${sk4(a + b + c)}$.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const teisinga = a + b
      const klaidinga = teisinga - 1000
      if (klaidinga <= 0) return null
      return uzdavinys(T2, {
        klausimas: `Mokinys užrašė: $${sk4(a)} + ${sk4(b)} = ${sk4(klaidinga)}$. Koks turi būti atsakymas?`,
        atsakymas: String(teisinga),
        atsakymasRodymui: `$${sk4(teisinga)}$`,
        sprendimas: `Sudedant šimtus susidarė pilnas tūkstantis, o mokinys jo neperkėlė. Teisingai: $${sk4(teisinga)}$.`,
      })
    },

    // 6. Iš sumos rasti antrą skaičių
    () => {
      const suma = 9000
      const vienas = atsitiktinis(3100, 5900)
      return uzdavinys(T2, {
        klausimas: `Dviejų skaičių suma yra $${sk4(suma)}$. Vienas iš jų $${sk4(vienas)}$. Koks kitas?`,
        atsakymas: String(suma - vienas),
        atsakymasRodymui: `$${sk4(suma - vienas)}$`,
        sprendimas: `$${sk4(suma)} - ${sk4(vienas)} = ${sk4(suma - vienas)}$.`,
      })
    },

    // 7. Palyginimas nesuskaičiavus iki galo
    () => {
      const c = a + atsitiktinis(30, 90)
      const d = b - atsitiktinis(30, 90)
      if (d <= 0) return null
      const pirmoji = a + b
      const antroji = c + d
      if (pirmoji === antroji) return null
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kuri suma didesnė: $${sk4(a)} + ${sk4(b)}$ ar $${sk4(c)} + ${sk4(d)}$?`,
        variantai:
          pirmoji > antroji
            ? [`$${sk4(a)} + ${sk4(b)}$`, `$${sk4(c)} + ${sk4(d)}$`, 'sumos lygios']
            : [`$${sk4(c)} + ${sk4(d)}$`, `$${sk4(a)} + ${sk4(b)}$`, 'sumos lygios'],
        teisingas: 0,
        sprendimas: `$${sk4(pirmoji)}$ ir $${sk4(antroji)}$ — didesnė ta, kur suma $${sk4(Math.max(pirmoji, antroji))}$.`,
      })
    },

    // 8. Dviejų žingsnių tekstinis su schema
    () => {
      const miestas = pasirink(MIESTAI)
      const pirma = atsitiktinis(2400, 4800)
      const antra = atsitiktinis(1200, 2600)
      const isvyko = atsitiktinis(800, 1900)
      return uzdavinys(T2, {
        klausimas: `${miestas} per pirmą savaitę priėmė ${kiek(pirma, D.sveciai)}, per antrą — dar ${tekstu(antra)}. Iš jų ${tekstu(isvyko)} jau išvyko. Kiek svečių liko?`,
        atsakymas: String(pirma + antra - isvyko),
        atsakymasRodymui: `$${sk4(pirma + antra - isvyko)}$`,
        sprendimas: `Iš viso atvyko $${sk4(pirma)} + ${sk4(antra)} = ${sk4(pirma + antra)}$, liko $${sk4(pirma + antra)} - ${sk4(isvyko)} = ${sk4(pirma + antra - isvyko)}$.`,
        brezinys: juostuSchema([
          { vardas: 'Pirma savaitė', dalys: pirma, uzrasas: tekstu(pirma) },
          { vardas: 'Antra savaitė', dalys: antra, uzrasas: tekstu(antra) },
          { vardas: 'Išvyko', dalys: isvyko, uzrasas: tekstu(isvyko) },
        ]),
      })
    },
  ])
}

// ── 1.3 Kaip moku dauginti ir dalyti skaičius iki 10 000? ───────────────────

const T3 = 'daugyba-dalyba-10000-4'

const A_DAUGYBA_10000 = [
  {
    klausimas: 'Apskaičiuok: $240 \\cdot 30$.',
    atsakymas: '7200',
    atsakymasRodymui: '$7200$',
    sprendimas: '$24 \\cdot 3 = 72$, tad $240 \\cdot 30 = 7200$.',
  },
] as const

export const daugybaDalyba10000: Generatorius = () =>
  suBandymais(kurkDaugybaDalyba10000, A_DAUGYBA_10000, T3)

function kurkDaugybaDalyba10000(): Uzdavinys | null {
  return variacija([
    // 1. Apvalus iš apvalaus
    () => {
      const a = atsitiktinis(12, 32) * 10
      const b = atsitiktinis(2, 9) * 10
      if (a * b > 10000) return null
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${a} \\cdot ${b}$.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `$${a / 10} \\cdot ${b / 10} = ${(a / 10) * (b / 10)}$, ir prirašomi du nuliai: $${sk4(a * b)}$.`,
      })
    },

    // 2. Keturženklis iš vienaženklio
    () => {
      const a = atsitiktinis(105, 165) * 10
      const b = atsitiktinis(4, 6)
      if (a * b > 10000) return null
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${sk4(a)} \\cdot ${b}$.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `$${sk4(a)} \\cdot ${b} = ${sk4(a * b)}$.`,
        brezinys: daugybaStulpeliu(a, b, 'tuscias'),
      })
    },

    // 3. Dalyba apvaliais
    () => {
      const dalmuo = atsitiktinis(12, 32) * 10
      const daliklis = atsitiktinis(2, 9) * 10
      const dalinys = dalmuo * daliklis
      if (dalinys > 10000) return null
      return uzdavinys(T3, {
        klausimas: `Apskaičiuok: $${sk4(dalinys)} : ${daliklis}$.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${sk4(dalmuo)}$`,
        sprendimas: `Abu nubraukiam po nulį: $${dalinys / 10} : ${daliklis / 10} = ${sk4(dalmuo)}$.`,
      })
    },

    // 4. Daugyba ir dalyba iš 100
    () => {
      const a = atsitiktinis(14, 96)
      const kryptis = pasirink(['daugyba', 'dalyba'] as const)
      if (kryptis === 'daugyba') {
        return uzdavinys(T3, {
          klausimas: `Rask sandaugą: $${a} \\cdot 100$.`,
          atsakymas: String(a * 100),
          atsakymasRodymui: `$${sk4(a * 100)}$`,
          sprendimas: 'Dauginant iš 100 prirašomi du nuliai.',
        })
      }
      return uzdavinys(T3, {
        klausimas: `Rask dalmenį: $${sk4(a * 100)} : 100$.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: 'Dalijant iš 100 nubraukiami du nuliai.',
      })
    },

    // 5. Nežinomas dalinys
    () => {
      const daliklis = atsitiktinis(4, 9)
      const dalmuo = atsitiktinis(60, 140) * 10
      if (daliklis * dalmuo > 10000) return null
      return uzdavinys(T3, {
        klausimas: `Rask nežinomą skaičių: $x : ${daliklis} = ${sk4(dalmuo)}$.`,
        atsakymas: String(daliklis * dalmuo),
        atsakymasRodymui: `$x = ${sk4(daliklis * dalmuo)}$`,
        sprendimas: `Dalinys randamas dalmenį padauginus iš daliklio: $${sk4(dalmuo)} \\cdot ${daliklis} = ${sk4(daliklis * dalmuo)}$.`,
      })
    },

    // 6. Klaidos radimas: pamiršti nuliai
    () => {
      const a = atsitiktinis(15, 45) * 10
      const b = atsitiktinis(2, 9) * 10
      if (a * b > 10000) return null
      const klaidingas = (a / 10) * b
      return uzdavinys(T3, {
        klausimas: `Mokinys užrašė: $${a} \\cdot ${b} = ${sk4(klaidingas)}$. Koks turi būti atsakymas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `Abu daugikliai baigiasi nuliu, tad prie sandaugos $${(a / 10) * (b / 10)}$ prirašomi du nuliai: $${sk4(a * b)}$. Mokinys prirašė tik vieną.`,
      })
    },

    // 7. Sandaugų palyginimas
    () => {
      const a = atsitiktinis(12, 24) * 10
      const b = atsitiktinis(3, 6) * 10
      const c = a + 40
      const d = b - 10
      if (a * b > 10000 || c * d > 10000 || a * b === c * d) return null
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Kuri sandauga didesnė: $${a} \\cdot ${b}$ ar $${c} \\cdot ${d}$?`,
        variantai:
          a * b > c * d
            ? [`$${a} \\cdot ${b}$`, `$${c} \\cdot ${d}$`, 'sandaugos lygios']
            : [`$${c} \\cdot ${d}$`, `$${a} \\cdot ${b}$`, 'sandaugos lygios'],
        teisingas: 0,
        sprendimas: `$${sk4(a * b)}$ ir $${sk4(c * d)}$ — didesnė $${sk4(Math.max(a * b, c * d))}$.`,
      })
    },

    // 8. Tekstinis: kiek dėžių
    () => {
      const dezeje = pasirink([12, 15, 18, 24, 25])
      const deziu = atsitiktinis(14, 36)
      if (dezeje * deziu > 10000) return null
      return uzdavinys(T3, {
        klausimas: `Vienoje dėžėje yra ${kiek(dezeje, D.pieststukai)}. Kiek pieštukų sudėta į ${kiek(deziu, { vns: 'tokią dėžę', dgs: 'tokias dėžes', kilm: 'tokių dėžių' })}?`,
        atsakymas: String(dezeje * deziu),
        atsakymasRodymui: `$${sk4(dezeje * deziu)}$`,
        sprendimas: `$${dezeje} \\cdot ${deziu} = ${sk4(dezeje * deziu)}$.`,
      })
    },
  ])
}

// ── 1.4 Kaip moku spręsti tekstinius uždavinius? ────────────────────────────

const T4 = 'tekstiniai-uzdaviniai-4'

const A_TEKSTINIAI = [
  {
    klausimas: 'Sode 240 obelų, o kriaušių — 3 kartus mažiau. Kiek kriaušių sode?',
    atsakymas: '80',
    atsakymasRodymui: '$80$',
    sprendimas: '$240 : 3 = 80$.',
  },
] as const

export const tekstiniaiUzdaviniai4: Generatorius = () =>
  suBandymais(kurkTekstini4, A_TEKSTINIAI, T4)

function kurkTekstini4(): Uzdavinys | null {
  const vardas = pasirink(VARDAI)

  return variacija([
    // 1. „Kartų daugiau“ su juostine schema
    () => {
      const maziau = atsitiktinis(120, 460)
      const kartai = atsitiktinis(3, 6)
      return uzdavinys(T4, {
        klausimas: `Bibliotekoje ${kiek(maziau, D.knygos)} apie pasakas, o apie nuotykius — ${kiek(kartai, D.kartai)} daugiau. Kiek knygų iš viso?`,
        atsakymas: String(maziau + maziau * kartai),
        atsakymasRodymui: `$${sk4(maziau + maziau * kartai)}$`,
        sprendimas: `Nuotykių: $${sk4(maziau)} \\cdot ${kartai} = ${sk4(maziau * kartai)}$. Iš viso: $${sk4(maziau)} + ${sk4(maziau * kartai)} = ${sk4(maziau + maziau * kartai)}$.`,
        brezinys: juostuSchema([
          { vardas: 'Pasakų', dalys: 1, uzrasas: tekstu(maziau) },
          { vardas: 'Nuotykių', dalys: kartai },
        ]),
      })
    },

    // 2. Dviejų žingsnių: liko po dviejų veiksmų
    () => {
      const buvo = atsitiktinis(24, 60) * 100
      const isvezta = atsitiktinis(6, 14) * 100
      const atvezta = atsitiktinis(3, 9) * 100
      return uzdavinys(T4, {
        klausimas: `Sandėlyje buvo ${kiek(buvo, D.plyteles)}. Išvežė ${sk4(isvezta)}, o vėliau atvežė dar ${sk4(atvezta)}. Kiek plytelių sandėlyje dabar?`,
        atsakymas: String(buvo - isvezta + atvezta),
        atsakymasRodymui: `$${sk4(buvo - isvezta + atvezta)}$`,
        sprendimas: `$${sk4(buvo)} - ${sk4(isvezta)} = ${sk4(buvo - isvezta)}$, paskui $${sk4(buvo - isvezta)} + ${sk4(atvezta)} = ${sk4(buvo - isvezta + atvezta)}$.`,
      })
    },

    // 3. Lygios dalys ir likutis
    () => {
      const dezeje = atsitiktinis(6, 12)
      const deziu = atsitiktinis(8, 20)
      const likutis = atsitiktinis(1, dezeje - 1)
      const viso = dezeje * deziu + likutis
      return uzdavinys(T4, {
        klausimas: `Obuoliai dedami į dėžes po ${dezeje}. Iš viso obuolių yra ${viso}. Kiek dėžių bus pilnų?`,
        atsakymas: String(deziu),
        atsakymasRodymui: `$${deziu}$`,
        sprendimas: `$${viso} : ${dezeje} = ${deziu}$, lieka ${likutis} obuoliai — jie pilnos dėžės nesudaro.`,
      })
    },

    // 4. Į kurį klausimą galima atsakyti
    () => {
      const bilietas = atsitiktinis(4, 9)
      const vaiku = atsitiktinis(12, 28)
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Sąlyga: „Į kiną nuėjo ${kiek(vaiku, D.vaikai)}, vieno bilieto kaina ${bilietas} Eur.“ Į kurį klausimą galima atsakyti iš šių duomenų?`,
        variantai: [
          'Kiek iš viso sumokėta už bilietus?',
          'Kiek laiko truko filmas?',
          'Kiek vietų buvo salėje?',
          'Kiek vaikų atėjo su tėvais?',
        ],
        teisingas: 0,
        sprendimas: `Žinomas vaikų skaičius ir vieno bilieto kaina, tad randama tik bendra suma: $${vaiku} \\cdot ${bilietas} = ${sk4(vaiku * bilietas)}$ Eur.`,
      })
    },

    // 5. Klaidos radimas kito sprendime
    () => {
      const buvo = atsitiktinis(30, 80) * 10
      const daliu = atsitiktinis(3, 6)
      const dalis = Math.floor(buvo / daliu)
      if (dalis * daliu !== buvo) return null
      return uzdavinys(T4, {
        klausimas: `Uždavinys: „${kiek(buvo, D.sasiuviniai)} po lygiai išdalyta ${daliu} klasėms. Kiek gavo viena klasė?“ ${vardas} užrašė $${sk4(buvo)} \\cdot ${daliu}$. Kokį veiksmą reikėjo atlikti — užrašyk teisingą atsakymą.`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${sk4(dalis)}$`,
        sprendimas: `Dalijant po lygiai atliekama dalyba: $${sk4(buvo)} : ${daliu} = ${sk4(dalis)}$.`,
      })
    },

    // 6. Atvirkštinis: rasti pradinį kiekį
    () => {
      const liko = atsitiktinis(120, 380)
      const suvalgyta = atsitiktinis(60, 180)
      return uzdavinys(T4, {
        klausimas: `Iš dėžės paėmus ${kiek(suvalgyta, D.saldainiai)} liko ${sk4(liko)}. Kiek saldainių buvo dėžėje?`,
        atsakymas: String(liko + suvalgyta),
        atsakymasRodymui: `$${sk4(liko + suvalgyta)}$`,
        sprendimas: `Buvo tiek, kiek paimta ir liko: $${sk4(suvalgyta)} + ${sk4(liko)} = ${sk4(liko + suvalgyta)}$.`,
      })
    },

    // 7. Dalys ir visuma iš schemos
    () => {
      const viena = atsitiktinis(150, 420)
      const skirtumas = atsitiktinis(60, 200)
      return uzdavinys(T4, {
        klausimas: `Dvi komandos surinko iš viso ${kiek(2 * viena + skirtumas, D.taskai)}. Antroji surinko ${sk4(skirtumas)} taškais daugiau nei pirmoji. Kiek taškų surinko pirmoji komanda?`,
        atsakymas: String(viena),
        atsakymasRodymui: `$${sk4(viena)}$`,
        sprendimas: `Atmetus skirtumą lieka dvi lygios dalys: $${sk4(2 * viena + skirtumas)} - ${sk4(skirtumas)} = ${sk4(2 * viena)}$, tad $${sk4(2 * viena)} : 2 = ${sk4(viena)}$.`,
        brezinys: juostuSchema(
          [
            { vardas: 'Pirmoji', dalys: viena },
            { vardas: 'Antroji', dalys: viena + skirtumas, uzrasas: `? + ${tekstu(skirtumas)}` },
          ],
          `iš viso ${tekstu(2 * viena + skirtumas)}`,
        ),
      })
    },
  ])
}

// ── 1.5 Kaip stulpeliu dauginti dviženklius skaičius? ───────────────────────

const T5 = 'dvizenkliu-daugyba-stulpeliu'

const A_DVIZENKLIU = [
  {
    klausimas: 'Apskaičiuok stulpeliu: $34 \\cdot 26$.',
    atsakymas: '884',
    atsakymasRodymui: '$884$',
    sprendimas: '$34 \\cdot 6 = 204$, $34 \\cdot 20 = 680$, $204 + 680 = 884$.',
  },
] as const

export const dvizenkliuDaugybaStulpeliu: Generatorius = () =>
  suBandymais(() => kurkDaugybaStulpeliu(T5, 2), A_DVIZENKLIU, T5)

// ── 1.6 Kaip dauginti triženklį skaičių iš dviženklio? ──────────────────────

const T6 = 'trizenklis-is-dvizenklio'

const A_TRIZENKLIS = [
  {
    klausimas: 'Apskaičiuok stulpeliu: $348 \\cdot 27$.',
    atsakymas: '9396',
    atsakymasRodymui: '$9396$',
    sprendimas: '$348 \\cdot 7 = 2436$, $348 \\cdot 20 = 6960$, $2436 + 6960 = 9396$.',
  },
] as const

export const trizenklisIsDvizenklio: Generatorius = () =>
  suBandymais(() => kurkDaugybaStulpeliu(T6, 3), A_TRIZENKLIS, T6)

/**
 * Daugyba stulpeliu — bendras abiem potemėms pavidalų rinkinys.
 *
 * Skiriasi tik daugiklio ilgis, o klausimų kryptys tos pačios: tarpinės
 * sandaugos, jų poslinkis, klaida, patikra. Rašyti tą patį du kartus reikštų
 * du kartus taisyti tas pačias klaidas.
 */
function kurkDaugybaStulpeliu(temaId: string, skaitmenu: 2 | 3): Uzdavinys | null {
  const a = skaitmenu === 2 ? atsitiktinis(23, 89) : atsitiktinis(124, 468)
  // Nuliu pasibaigęs daugiklis paverčia dviženklę daugybą daugyba iš vienaženklio.
  if (a % 10 === 0) return null
  const b = atsitiktinis(13, 48)
  const vienetai = b % 10
  const desimtys = Math.floor(b / 10)
  if (vienetai === 0 || vienetai === 1) return null

  return variacija([
    // 1. Suskaičiuoti
    () =>
      uzdavinys(temaId, {
        klausimas: 'Apskaičiuok stulpeliu.',
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `$${a} \\cdot ${vienetai} = ${sk4(a * vienetai)}$, $${a} \\cdot ${desimtys * 10} = ${sk4(a * desimtys * 10)}$, suma $${sk4(a * b)}$.`,
        brezinys: daugybaStulpeliu(a, b, 'tuscias'),
      }),

    // 2. Pirmoji tarpinė sandauga
    () =>
      uzdavinys(temaId, {
        klausimas: `Dauginant $${a} \\cdot ${b}$ stulpeliu, kokia gaunama pirmoji tarpinė sandauga?`,
        atsakymas: String(a * vienetai),
        atsakymasRodymui: `$${sk4(a * vienetai)}$`,
        sprendimas: `Pirmiausia dauginama iš vienetų skaitmens: $${a} \\cdot ${vienetai} = ${sk4(a * vienetai)}$.`,
      }),

    // 3. Antroji tarpinė sandauga — ir kodėl ji pastumta
    () =>
      uzdavinys(temaId, {
        klausimas: `Dauginant $${a} \\cdot ${b}$ stulpeliu, kokia gaunama antroji tarpinė sandauga?`,
        atsakymas: String(a * desimtys * 10),
        atsakymasRodymui: `$${sk4(a * desimtys * 10)}$`,
        sprendimas: `Antruoju veiksmu dauginama ne iš ${desimtys}, o iš ${desimtys * 10}: $${a} \\cdot ${desimtys * 10} = ${sk4(a * desimtys * 10)}$. Todėl eilutė ir rašoma pastumta.`,
      }),

    // 4. Klaida: antroji eilutė nepastumta
    () => {
      const klaidingas = a * vienetai + a * desimtys
      return uzdavinys(temaId, {
        klausimas: `Mokinys antrąją tarpinę sandaugą užrašė nepastumtą ir gavo $${sk4(klaidingas)}$. Koks turi būti $${a} \\cdot ${b}$?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `Antroji eilutė yra $${a} \\cdot ${desimtys * 10} = ${sk4(a * desimtys * 10)}$, o ne $${sk4(a * desimtys)}$. Teisingai: $${sk4(a * b)}$.`,
        brezinys: daugybaStulpeliu(a, b, 'be-atsakymo'),
      })
    },

    // 5. Įvertinimas prieš skaičiuojant
    () => {
      const apvalus = Math.round(a / 10) * 10 * (Math.round(b / 10) * 10)
      if (apvalus === a * b) return null
      return pasirinkimoUzdavinys(naujasId(temaId), temaId, {
        klausimas: `Neskaičiuodamas tiksliai įvertink, tarp kurių skaičių yra sandauga $${a} \\cdot ${b}$.`,
        variantai: [
          `tarp $${sk4(Math.floor((a * b) / 1000) * 1000)}$ ir $${sk4(Math.floor((a * b) / 1000) * 1000 + 1000)}$`,
          `tarp $${sk4(Math.floor((a * b) / 1000) * 1000 + 2000)}$ ir $${sk4(Math.floor((a * b) / 1000) * 1000 + 3000)}$`,
          `tarp $${sk4(Math.max(0, Math.floor((a * b) / 1000) * 1000 - 3000))}$ ir $${sk4(Math.max(1000, Math.floor((a * b) / 1000) * 1000 - 2000))}$`,
        ],
        teisingas: 0,
        sprendimas: `Apytiksliai $${Math.round(a / 10) * 10} \\cdot ${Math.round(b / 10) * 10} = ${sk4(apvalus)}$, o tikslus atsakymas $${sk4(a * b)}$.`,
      })
    },

    // 6. Tekstinis uždavinys
    () => {
      const vardas = pasirink(VARDAI)
      return uzdavinys(temaId, {
        klausimas: `${vardas} sudėjo ${kiek(b, D.pakuotes)} po ${kiek(a, D.lipdukai)}. Kiek lipdukų sudėta?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `$${a} \\cdot ${b} = ${sk4(a * b)}$.`,
      })
    },

    // 7. Sandaugos patikra dalyba
    () =>
      uzdavinys(temaId, {
        klausimas: `Kaip patikrinti, ar $${a} \\cdot ${b} = ${sk4(a * b)}$? Padalyk sandaugą iš ${b} ir užrašyk gautą skaičių.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$${sk4(a * b)} : ${b} = ${a}$ — gavome pirmąjį daugiklį, tad sandauga teisinga.`,
      }),
  ])
}

// ── 1.7 Kaip sudaryti skaičius iki 100 000? ─────────────────────────────────

const T7 = 'skaiciu-sudarymas-100000'

const A_SUDARYMAS = [
  {
    klausimas: 'Užrašyk skaičių, sudarytą iš 4 dešimčių tūkstančių, 5 tūkstančių ir 8 vienetų.',
    atsakymas: '45008',
    atsakymasRodymui: '$45\\,008$',
    sprendimas: '$40\\,000 + 5\\,000 + 8 = 45\\,008$.',
  },
] as const

export const skaiciuSudarymas100000: Generatorius = () =>
  suBandymais(kurkSudaryma, A_SUDARYMAS, T7)

function kurkSudaryma(): Uzdavinys | null {
  const n = penkiazenklis()
  const s = String(n)
  const skyriai = [
    { vardas: 'dešimčių tūkstančių', reiksme: Number(s[0]) * 10000 },
    { vardas: 'tūkstančių', reiksme: Number(s[1]) * 1000 },
    { vardas: 'šimtų', reiksme: Number(s[2]) * 100 },
    { vardas: 'dešimčių', reiksme: Number(s[3]) * 10 },
    { vardas: 'vienetų', reiksme: Number(s[4]) },
  ]
  const nenuliniai = skyriai.filter((s2) => s2.reiksme > 0)

  return variacija([
    // 1. Iš skyrių lentelės — koks skaičius
    () =>
      uzdavinys(T7, {
        klausimas: 'Koks skaičius užrašytas skyrių lentelėje?',
        atsakymas: String(n),
        atsakymasRodymui: `$${sk4(n)}$`,
        sprendimas: `Skaitmenys iš eilės nuo aukščiausio skyriaus: $${sk4(n)}$.`,
        brezinys: skyriuLentele(n),
      }),

    // 2. Iš skyrių sumos — skaičius
    () => {
      if (nenuliniai.length < 3) return null
      return uzdavinys(T7, {
        klausimas: `Užrašyk skaičių: $${nenuliniai.map((x) => sk4(x.reiksme)).join(' + ')}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${sk4(n)}$`,
        sprendimas: `Kiekvienas dėmuo — vienas skyrius, tad gaunama $${sk4(n)}$.`,
      })
    },

    // 3. Skaičius → skyrių suma (klausiama vieno skyriaus vertės)
    () => {
      const kuris = pasirink(nenuliniai)
      return uzdavinys(T7, {
        klausimas: `Skaičių $${sk4(n)}$ užrašius skyrių suma, koks dėmuo atitinka ${kuris.vardas} skyrių?`,
        atsakymas: String(kuris.reiksme),
        atsakymasRodymui: `$${sk4(kuris.reiksme)}$`,
        sprendimas: `Skyrių suma: $${nenuliniai.map((x) => sk4(x.reiksme)).join(' + ')}$.`,
      })
    },

    // 4. Kiek iš viso tūkstančių
    () =>
      uzdavinys(T7, {
        klausimas: `Kiek iš viso tūkstančių yra skaičiuje $${sk4(n)}$?`,
        atsakymas: String(Math.floor(n / 1000)),
        atsakymasRodymui: `$${Math.floor(n / 1000)}$`,
        sprendimas: `Tūkstančius rodo pirmi du skaitmenys: $${Math.floor(n / 1000)}$. Skyriaus skaitmuo yra tik ${s[1]}, bet klausiama viso kiekio.`,
        brezinys: skyriuLentele(n),
      }),

    // 5. Skaitmens keitimas
    () => {
      const priedas = pasirink([1000, 10000])
      const skaitmuo = priedas === 1000 ? Number(s[1]) : Number(s[0])
      if (skaitmuo >= 9) return null
      return uzdavinys(T7, {
        klausimas: `Skaičiuje $${sk4(n)}$ padidink ${priedas === 1000 ? 'tūkstančių' : 'dešimčių tūkstančių'} skaitmenį vienetu. Koks skaičius gaunamas?`,
        atsakymas: String(n + priedas),
        atsakymasRodymui: `$${sk4(n + priedas)}$`,
        sprendimas: `Pakeitus vieną skaitmenį skaičius pasikeičia to skyriaus verte: $${sk4(n)} + ${sk4(priedas)} = ${sk4(n + priedas)}$.`,
      })
    },

    // 6. Didžiausias penkiaženklis iš duotų skaitmenų
    () => {
      const skaitmenys = sumaisyk([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5)
      const didz = [...skaitmenys].sort((x, y) => y - x)
      return uzdavinys(T7, {
        klausimas: `Iš skaitmenų ${skaitmenys.join(', ')} sudaryk didžiausią penkiaženklį skaičių.`,
        atsakymas: String(Number(didz.join(''))),
        atsakymasRodymui: `$${sk4(Number(didz.join('')))}$`,
        sprendimas: 'Didžiausias skaitmuo rašomas aukščiausiame skyriuje, mažiausias — vienetuose.',
      })
    },

    // 7. Klaidos radimas: praleistas nulinis skyrius
    () => {
      const be = Number(`${s[0]}${s[2]}${s[3]}${s[4]}`)
      if (Number(s[1]) !== 0 || be < 1000) return null
      return uzdavinys(T7, {
        klausimas: `Skaičių „${zodziais(n)}“ mokinys užrašė $${sk4(be)}$. Užrašyk teisingai.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${sk4(n)}$`,
        sprendimas: 'Tūkstančių skyriuje nėra nė vieno vieneto, tad ten rašomas nulis — jo praleisti negalima.',
      })
    },

    // 8. Iš žodžių į skaitmenis
    () =>
      uzdavinys(T7, {
        klausimas: `Užrašyk skaitmenimis: ${zodziais(n)}.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${sk4(n)}$`,
        sprendimas: `Penkiaženklis skaičius: $${sk4(n)}$.`,
      }),
  ])
}

// ── 1.8 Kaip sudėti skaičius iki 100 000? ───────────────────────────────────

const T8 = 'sudetis-100000'

const A_SUDETIS = [
  {
    klausimas: 'Apskaičiuok: $24\\,560 + 18\\,430$.',
    atsakymas: '42990',
    atsakymasRodymui: '$42\\,990$',
    sprendimas: '$24\\,560 + 18\\,430 = 42\\,990$.',
  },
] as const

export const sudetis100000: Generatorius = () => suBandymais(kurkSudeti100000, A_SUDETIS, T8)

function kurkSudeti100000(): Uzdavinys | null {
  const a = atsitiktinis(12000, 56000)
  const b = atsitiktinis(9000, 38000)
  if (a + b > 100000) return null

  return variacija([
    // 1. Sudėtis stulpeliu
    () =>
      uzdavinys(T8, {
        klausimas: 'Sudėk stulpeliu.',
        atsakymas: String(a + b),
        atsakymasRodymui: `$${sk4(a + b)}$`,
        sprendimas: `$${sk4(a)} + ${sk4(b)} = ${sk4(a + b)}$.`,
        brezinys: stulpelis4(a, b, '+', null),
      }),

    // 2. Trūkstamas dėmuo
    () =>
      uzdavinys(T8, {
        klausimas: `Rask trūkstamą dėmenį: $\\square + ${sk4(b)} = ${sk4(a + b)}$.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${sk4(a)}$`,
        sprendimas: `$${sk4(a + b)} - ${sk4(b)} = ${sk4(a)}$.`,
      }),

    // 3. Prie apvalaus
    () => {
      const apvalus = atsitiktinis(3, 8) * 10000
      const priedas = atsitiktinis(1024, 9876)
      return uzdavinys(T8, {
        klausimas: `Apskaičiuok mintinai: $${sk4(apvalus)} + ${sk4(priedas)}$.`,
        atsakymas: String(apvalus + priedas),
        atsakymasRodymui: `$${sk4(apvalus + priedas)}$`,
        sprendimas: `Prie apvalaus skaičiaus pridėti lengva — skyriai nesimaišo: $${sk4(apvalus + priedas)}$.`,
      })
    },

    // 4. Su skliaustais, trys dėmenys
    () => {
      const c = atsitiktinis(2000, 6000)
      if (a + b + c > 100000) return null
      return uzdavinys(T8, {
        klausimas: `Apskaičiuok: $(${sk4(a)} + ${sk4(b)}) + ${sk4(c)}$.`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${sk4(a + b + c)}$`,
        sprendimas: `Skliaustuose $${sk4(a + b)}$, tada $${sk4(a + b)} + ${sk4(c)} = ${sk4(a + b + c)}$.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const klaidingas = a + b - 1000
      return uzdavinys(T8, {
        klausimas: `Rask klaidą: $${sk4(a)} + ${sk4(b)} = ${sk4(klaidingas)}$. Užrašyk teisingą sumą.`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${sk4(a + b)}$`,
        sprendimas: `Perkeliant iš šimtų į tūkstančius pamestas vienas tūkstantis. Teisingai: $${sk4(a + b)}$.`,
      })
    },

    // 6. Sumų palyginimas
    () => {
      const c = a - atsitiktinis(400, 1200)
      const d = b + atsitiktinis(400, 1200)
      if (c <= 0 || c + d > 100000 || a + b === c + d) return null
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Palygink sumas: $${sk4(a)} + ${sk4(b)}$ ir $${sk4(c)} + ${sk4(d)}$.`,
        variantai:
          a + b > c + d
            ? [`pirmoji didesnė`, `antroji didesnė`, 'sumos lygios']
            : [`antroji didesnė`, `pirmoji didesnė`, 'sumos lygios'],
        teisingas: 0,
        sprendimas: `$${sk4(a + b)}$ ir $${sk4(c + d)}$.`,
      })
    },

    // 7. Tekstinis: parama
    () => {
      const miestas = pasirink(MIESTAI)
      const pirma = atsitiktinis(12, 44) * 500
      const antra = atsitiktinis(10, 38) * 500
      return uzdavinys(T8, {
        klausimas: `${miestas} gavo ${tekstu(pirma)} Eur paramos, o vėliau dar ${tekstu(antra)} Eur. Kiek eurų gauta iš viso?`,
        atsakymas: String(pirma + antra),
        atsakymasRodymui: `$${sk4(pirma + antra)}$ Eur`,
        sprendimas: `$${sk4(pirma)} + ${sk4(antra)} = ${sk4(pirma + antra)}$.`,
      })
    },

    // 8. Suma su „beveik apvaliais“ dėmenimis
    () => {
      const c = atsitiktinis(3, 6) * 10000 - 2
      const d = atsitiktinis(1, 3) * 10000 + 2
      return uzdavinys(T8, {
        klausimas: `Apskaičiuok patogiu būdu: $${sk4(c)} + ${sk4(d)}$.`,
        atsakymas: String(c + d),
        atsakymasRodymui: `$${sk4(c + d)}$`,
        sprendimas: `Trūkstamus 2 galima persikelti nuo vieno dėmens prie kito: $${sk4(c + 2)} + ${sk4(d - 2)} = ${sk4(c + d)}$.`,
      })
    },
  ])
}

// ── 1.9 Kaip atimti skaičius iki 100 000? ───────────────────────────────────

const T9 = 'atimtis-100000'

const A_ATIMTIS = [
  {
    klausimas: 'Apskaičiuok: $72\\,500 - 18\\,240$.',
    atsakymas: '54260',
    atsakymasRodymui: '$54\\,260$',
    sprendimas: '$72\\,500 - 18\\,240 = 54\\,260$.',
  },
] as const

export const atimtis100000: Generatorius = () => suBandymais(kurkAtimti100000, A_ATIMTIS, T9)

function kurkAtimti100000(): Uzdavinys | null {
  const a = atsitiktinis(42000, 96000)
  const b = atsitiktinis(11000, 39000)

  return variacija([
    // 1. Atimtis stulpeliu
    () =>
      uzdavinys(T9, {
        klausimas: 'Atimk stulpeliu.',
        atsakymas: String(a - b),
        atsakymasRodymui: `$${sk4(a - b)}$`,
        sprendimas: `$${sk4(a)} - ${sk4(b)} = ${sk4(a - b)}$.`,
        brezinys: stulpelis4(a, b, '−', null),
      }),

    // 2. Iš apvalaus — ardomi visi skyriai iš eilės
    () => {
      const apvalus = atsitiktinis(5, 9) * 10000
      const atem = atsitiktinis(10234, 39876)
      if (atem % 10 === 0) return null
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${sk4(apvalus)} - ${sk4(atem)}$.`,
        atsakymas: String(apvalus - atem),
        atsakymasRodymui: `$${sk4(apvalus - atem)}$`,
        sprendimas: `Turinys apvalus, tad skolinamasi per visus skyrius iš eilės: $${sk4(apvalus - atem)}$.`,
        brezinys: stulpelis4(apvalus, atem, '−', null),
      })
    },

    // 3. Trūkstamas atėminys
    () =>
      uzdavinys(T9, {
        klausimas: `Rask trūkstamą atėminį: $${sk4(a)} - \\square = ${sk4(a - b)}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${sk4(b)}$`,
        sprendimas: `Atėminys randamas iš turinio atėmus skirtumą: $${sk4(a)} - ${sk4(a - b)} = ${sk4(b)}$.`,
      }),

    // 4. Turinys pagal skirtumą ir atėminį
    () => {
      const skirtumas = atsitiktinis(12000, 46000)
      const atem = atsitiktinis(8000, 32000)
      if (skirtumas + atem > 100000) return null
      return uzdavinys(T9, {
        klausimas: `Skirtumas yra $${sk4(skirtumas)}$, o atėminys — $${sk4(atem)}$. Rask turinį.`,
        atsakymas: String(skirtumas + atem),
        atsakymasRodymui: `$${sk4(skirtumas + atem)}$`,
        sprendimas: `Turinys yra skirtumo ir atėminio suma: $${sk4(skirtumas)} + ${sk4(atem)} = ${sk4(skirtumas + atem)}$.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const klaidingas = a - b + 1000
      return uzdavinys(T9, {
        klausimas: `Rask klaidą: $${sk4(a)} - ${sk4(b)} = ${sk4(klaidingas)}$. Užrašyk teisingą skirtumą.`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${sk4(a - b)}$`,
        sprendimas: `Skolinantis iš tūkstančių skyriaus jis turėjo sumažėti vienetu, o mokinys jį paliko tokį patį. Teisingai: $${sk4(a - b)}$.`,
      })
    },

    // 6. Du atėmimai iš eilės
    () => {
      const pirmas = atsitiktinis(12000, 28000)
      const antras = atsitiktinis(6000, 19000)
      if (a - pirmas - antras <= 0) return null
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${sk4(a)} - ${sk4(pirmas)} - ${sk4(antras)}$.`,
        atsakymas: String(a - pirmas - antras),
        atsakymasRodymui: `$${sk4(a - pirmas - antras)}$`,
        sprendimas: `$${sk4(a)} - ${sk4(pirmas)} = ${sk4(a - pirmas)}$, tada $${sk4(a - pirmas)} - ${sk4(antras)} = ${sk4(a - pirmas - antras)}$.`,
      })
    },

    // 7. Skirtumų palyginimas
    () => {
      const c = atsitiktinis(30000, 70000)
      const d = atsitiktinis(4000, 22000)
      if (a - b === c - d) return null
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Palygink skirtumus: $${sk4(a)} - ${sk4(b)}$ ir $${sk4(c)} - ${sk4(d)}$.`,
        variantai:
          a - b > c - d
            ? ['pirmasis didesnis', 'antrasis didesnis', 'skirtumai lygūs']
            : ['antrasis didesnis', 'pirmasis didesnis', 'skirtumai lygūs'],
        teisingas: 0,
        sprendimas: `$${sk4(a - b)}$ ir $${sk4(c - d)}$.`,
      })
    },

    // 8. Tekstinis: du pardavimai
    () => {
      const buvo = atsitiktinis(50, 90) * 1000
      const pirma = atsitiktinis(80, 200) * 100
      const antra = atsitiktinis(40, 160) * 100
      return uzdavinys(T9, {
        klausimas: `Sandėlyje buvo ${kiek(buvo, D.plyteles)}. Pardavė ${tekstu(pirma)}, vėliau dar ${tekstu(antra)}. Kiek plytelių liko?`,
        atsakymas: String(buvo - pirma - antra),
        atsakymasRodymui: `$${sk4(buvo - pirma - antra)}$`,
        sprendimas: `Iš viso parduota $${sk4(pirma)} + ${sk4(antra)} = ${sk4(pirma + antra)}$, liko $${sk4(buvo)} - ${sk4(pirma + antra)} = ${sk4(buvo - pirma - antra)}$.`,
      })
    },
  ])
}

// ── 1.10 Kaip dauginti skaičius iki 100 000? ────────────────────────────────

const T10 = 'daugyba-100000'

const A_DAUGYBA = [
  {
    klausimas: 'Apskaičiuok: $3\\,200 \\cdot 30$.',
    atsakymas: '96000',
    atsakymasRodymui: '$96\\,000$',
    sprendimas: '$32 \\cdot 3 = 96$, tad $3\\,200 \\cdot 30 = 96\\,000$.',
  },
] as const

export const daugyba100000: Generatorius = () => suBandymais(kurkDaugyba100000, A_DAUGYBA, T10)

function kurkDaugyba100000(): Uzdavinys | null {
  return variacija([
    // 1. Apvalus iš apvalaus
    () => {
      const a = atsitiktinis(12, 32) * 100
      const b = atsitiktinis(2, 9) * 10
      if (a * b > 100000) return null
      return uzdavinys(T10, {
        klausimas: `Apskaičiuok: $${sk4(a)} \\cdot ${b}$.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `$${a / 100} \\cdot ${b / 10} = ${(a / 100) * (b / 10)}$, ir prirašomi trys nuliai: $${sk4(a * b)}$.`,
      })
    },

    // 2. Keturženklis iš vienaženklio
    () => {
      const a = atsitiktinis(1240, 9860)
      const b = atsitiktinis(3, 9)
      if (a * b > 100000) return null
      return uzdavinys(T10, {
        klausimas: 'Padaugink stulpeliu.',
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `$${sk4(a)} \\cdot ${b} = ${sk4(a * b)}$.`,
        brezinys: daugybaStulpeliu(a, b, 'tuscias'),
      })
    },

    // 3. Triženklis iš dviženklio
    () => {
      const a = atsitiktinis(210, 640)
      const b = atsitiktinis(23, 78)
      if (a * b > 100000) return null
      return uzdavinys(T10, {
        klausimas: `Apskaičiuok: $${a} \\cdot ${b}$.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `$${a} \\cdot ${b % 10} = ${sk4(a * (b % 10))}$, $${a} \\cdot ${Math.floor(b / 10) * 10} = ${sk4(a * Math.floor(b / 10) * 10)}$, suma $${sk4(a * b)}$.`,
      })
    },

    // 4. Du veiksmai
    () => {
      const a = atsitiktinis(11, 24) * 100
      const b = atsitiktinis(2, 5) * 10
      const c = atsitiktinis(24, 68)
      if (a * b + c * 10 > 100000) return null
      return uzdavinys(T10, {
        klausimas: `Apskaičiuok: $${sk4(a)} \\cdot ${b} + ${c} \\cdot 10$.`,
        atsakymas: String(a * b + c * 10),
        atsakymasRodymui: `$${sk4(a * b + c * 10)}$`,
        sprendimas: `Pirma daugyba: $${sk4(a * b)}$ ir $${c * 10}$. Suma: $${sk4(a * b + c * 10)}$.`,
      })
    },

    // 5. Nežinomas daugiklis
    () => {
      const a = atsitiktinis(120, 480)
      const b = atsitiktinis(20, 90)
      if (a * b > 100000) return null
      return uzdavinys(T10, {
        klausimas: `Rask nežinomą daugiklį: $${a} \\cdot x = ${sk4(a * b)}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$x = ${b}$`,
        sprendimas: `Daugiklis randamas sandaugą padalijus iš kito daugiklio: $${sk4(a * b)} : ${a} = ${b}$.`,
      })
    },

    // 6. Klaidos radimas
    () => {
      const a = atsitiktinis(30, 90) * 10
      const b = atsitiktinis(20, 40)
      if (a * b > 100000) return null
      const klaidingas = a * b - a
      return uzdavinys(T10, {
        klausimas: `Rask klaidą: $${sk4(a)} \\cdot ${b} = ${sk4(klaidingas)}$. Užrašyk teisingą sandaugą.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `Daugiklis ${b} reiškia ${b} vienodus dėmenis, o mokinys sudėjo tik ${b - 1}. Teisingai: $${sk4(a * b)}$.`,
      })
    },

    // 7. Tekstinis: vietos stadione
    () => {
      const eileje = atsitiktinis(24, 48)
      const eiliu = atsitiktinis(40, 90)
      if (eileje * eiliu > 100000) return null
      return uzdavinys(T10, {
        klausimas: `Stadione yra ${kiek(eiliu, D.eiles)} po ${kiek(eileje, D.vietos)}. Kiek iš viso vietų stadione?`,
        atsakymas: String(eileje * eiliu),
        atsakymasRodymui: `$${sk4(eileje * eiliu)}$`,
        sprendimas: `$${eileje} \\cdot ${eiliu} = ${sk4(eileje * eiliu)}$.`,
      })
    },

    // 8. Įvertinimas
    () => {
      const a = atsitiktinis(180, 460)
      const b = atsitiktinis(120, 210)
      if (a * b > 100000) return null
      const apytiksliai = Math.round(a / 100) * 100 * (Math.round(b / 100) * 100)
      if (apytiksliai > 100000 || apytiksliai === 0) return null
      return uzdavinys(T10, {
        klausimas: `Apvalink abu daugiklius iki šimtų ir apskaičiuok apytikslę sandaugą: $${a} \\cdot ${b}$.`,
        atsakymas: String(apytiksliai),
        atsakymasRodymui: `$${sk4(apytiksliai)}$`,
        sprendimas: `$${Math.round(a / 100) * 100} \\cdot ${Math.round(b / 100) * 100} = ${sk4(apytiksliai)}$. Tikslus atsakymas $${sk4(a * b)}$ nuo jo skiriasi nedaug.`,
      })
    },
  ])
}

// ── 1.11 Kaip dalyti skaičius iki 100 000? ──────────────────────────────────

const T11 = 'dalyba-100000'

const A_DALYBA = [
  {
    klausimas: 'Apskaičiuok: $9\\,600 : 30$.',
    atsakymas: '320',
    atsakymasRodymui: '$320$',
    sprendimas: '$960 : 3 = 320$.',
  },
] as const

export const dalyba100000: Generatorius = () => suBandymais(kurkDalyba100000, A_DALYBA, T11)

function kurkDalyba100000(): Uzdavinys | null {
  return variacija([
    // 1. Apvalus iš vienaženklio
    () => {
      const daliklis = atsitiktinis(3, 9)
      const dalmuo = atsitiktinis(120, 999) * 10
      const dalinys = dalmuo * daliklis
      if (dalinys > 100000) return null
      return uzdavinys(T11, {
        klausimas: `Apskaičiuok: $${sk4(dalinys)} : ${daliklis}$.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${sk4(dalmuo)}$`,
        sprendimas: `$${sk4(dalinys)} : ${daliklis} = ${sk4(dalmuo)}$.`,
      })
    },

    // 2. Dalyba iš apvalaus
    () => {
      const daliklis = atsitiktinis(2, 9) * 10
      const dalmuo = atsitiktinis(120, 460)
      const dalinys = dalmuo * daliklis
      if (dalinys > 100000) return null
      return uzdavinys(T11, {
        klausimas: `Apskaičiuok: $${sk4(dalinys)} : ${daliklis}$.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${sk4(dalmuo)}$`,
        sprendimas: `Nubraukiam po nulį: $${sk4(dalinys / 10)} : ${daliklis / 10} = ${sk4(dalmuo)}$.`,
      })
    },

    // 3. Dalyba kampu iš dviženklio
    () => {
      const daliklis = atsitiktinis(12, 24)
      const dalmuo = atsitiktinis(120, 460)
      const dalinys = dalmuo * daliklis
      if (dalinys > 100000) return null
      return uzdavinys(T11, {
        klausimas: 'Padalyk kampu ir užrašyk dalmenį.',
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${sk4(dalmuo)}$`,
        sprendimas: `$${sk4(dalinys)} : ${daliklis} = ${sk4(dalmuo)}$.`,
        brezinys: dalybaKampu(dalinys, daliklis),
      })
    },

    // 4. Nežinomas dalinys
    () => {
      const daliklis = atsitiktinis(6, 9)
      const dalmuo = atsitiktinis(900, 9900)
      if (daliklis * dalmuo > 100000) return null
      return uzdavinys(T11, {
        klausimas: `Rask nežinomą skaičių: $x : ${daliklis} = ${sk4(dalmuo)}$.`,
        atsakymas: String(daliklis * dalmuo),
        atsakymasRodymui: `$x = ${sk4(daliklis * dalmuo)}$`,
        sprendimas: `$${sk4(dalmuo)} \\cdot ${daliklis} = ${sk4(daliklis * dalmuo)}$.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const daliklis = atsitiktinis(2, 8) * 10
      const dalmuo = atsitiktinis(120, 900)
      const dalinys = dalmuo * daliklis
      if (dalinys > 100000) return null
      return uzdavinys(T11, {
        klausimas: `Rask klaidą: $${sk4(dalinys)} : ${daliklis} = ${sk4(dalmuo * 10)}$. Užrašyk teisingą dalmenį.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${sk4(dalmuo)}$`,
        sprendimas: `Nubraukus po vieną nulį lieka $${sk4(dalinys / 10)} : ${daliklis / 10}$, o mokinys nubraukė nulį tik dalinyje. Teisingai: $${sk4(dalmuo)}$.`,
      })
    },

    // 6. Dalmenų palyginimas
    () => {
      const a = atsitiktinis(3, 8) * 9000
      const b = atsitiktinis(3, 9)
      const c = atsitiktinis(3, 8) * 12000
      const d = atsitiktinis(4, 12)
      if (a > 100000 || c > 100000 || a % b !== 0 || c % d !== 0 || a / b === c / d) return null
      return pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Kuris dalmuo didesnis: $${sk4(a)} : ${b}$ ar $${sk4(c)} : ${d}$?`,
        variantai:
          a / b > c / d
            ? [`$${sk4(a)} : ${b}$`, `$${sk4(c)} : ${d}$`, 'dalmenys lygūs']
            : [`$${sk4(c)} : ${d}$`, `$${sk4(a)} : ${b}$`, 'dalmenys lygūs'],
        teisingas: 0,
        sprendimas: `$${sk4(a / b)}$ ir $${sk4(c / d)}$.`,
      })
    },

    // 7. Tekstinis: kiek nupirkta
    () => {
      const kaina = atsitiktinis(3, 9) * 100
      const kiek = atsitiktinis(20, 90)
      if (kaina * kiek > 100000) return null
      return uzdavinys(T11, {
        klausimas: `Už ${tekstu(kaina * kiek)} Eur nupirkta stalų po ${kaina} Eur. Kiek stalų nupirkta?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `$${sk4(kaina * kiek)} : ${kaina} = ${kiek}$.`,
      })
    },

    // 8. Dalyba ir atimtis
    () => {
      const daliklis = atsitiktinis(4, 8)
      const dalmuo = atsitiktinis(900, 9000)
      const dalinys = dalmuo * daliklis
      const atem = atsitiktinis(120, 800)
      if (dalinys > 100000 || dalmuo - atem <= 0) return null
      return uzdavinys(T11, {
        klausimas: `Apskaičiuok: $${sk4(dalinys)} : ${daliklis} - ${sk4(atem)}$.`,
        atsakymas: String(dalmuo - atem),
        atsakymasRodymui: `$${sk4(dalmuo - atem)}$`,
        sprendimas: `Pirma dalyba: $${sk4(dalmuo)}$. Tada $${sk4(dalmuo)} - ${sk4(atem)} = ${sk4(dalmuo - atem)}$.`,
      })
    },
  ])
}

// ── 1.12 Kaip nustatyti sekos taisyklę, kai siūlomos dvi sekos? ─────────────

const T12 = 'dvi-pintos-sekos'

const A_DVI_SEKOS = [
  {
    klausimas: 'Eilutėje pakaitomis surašytos dvi sekos: 3, 10, 6, 20, 9, 30. Koks bus septintas narys?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: 'Nelyginėse vietose seka 3, 6, 9 — pridedama po 3, tad septintas narys 12.',
  },
] as const

export const dviPintosSekos: Generatorius = () => suBandymais(kurkDviSekas, A_DVI_SEKOS, T12)

/** Dviejų sekų nariai, surašyti pakaitomis. */
function pinkSekas(a0: number, za: number, b0: number, zb: number, kiek: number): number[] {
  const nariai: number[] = []
  for (let i = 0; i < kiek; i += 1) {
    nariai.push(i % 2 === 0 ? a0 + (i / 2) * za : b0 + ((i - 1) / 2) * zb)
  }
  return nariai
}

function kurkDviSekas(): Uzdavinys | null {
  const a0 = atsitiktinis(2, 12)
  const za = atsitiktinis(2, 9)
  const b0 = atsitiktinis(20, 90)
  const zb = atsitiktinis(10, 40)
  if (za === zb) return null
  const nariai = pinkSekas(a0, za, b0, zb, 8)

  return variacija([
    // 1. Kitas narys
    () =>
      uzdavinys(T12, {
        klausimas: 'Eilutėje pakaitomis surašytos dvi sekos. Koks bus devintas narys?',
        atsakymas: String(a0 + 4 * za),
        atsakymasRodymui: `$${sk4(a0 + 4 * za)}$`,
        sprendimas: `Devinta vieta yra nelyginė, tad ji priklauso pirmajai sekai ${a0}, ${a0 + za}, ${a0 + 2 * za}, ${a0 + 3 * za} — kaskart pridedama ${za}. Kitas narys $${a0 + 4 * za}$.`,
        brezinys: pintosSekos(nariai),
      }),

    // 2. Pirmosios sekos taisyklė
    () =>
      uzdavinys(T12, {
        klausimas: 'Kiek pridedama kaskart pirmojoje sekoje (nelyginėse vietose)?',
        atsakymas: String(za),
        atsakymasRodymui: `$${za}$`,
        sprendimas: `Nelyginėse vietose stovi ${a0}, ${a0 + za}, ${a0 + 2 * za} — tarp jų skirtumas ${za}.`,
        brezinys: pintosSekos(nariai),
      }),

    // 3. Trūkstamas narys viduryje
    () => {
      const vieta = pasirink([3, 4, 5])
      const su = nariai.map((n, i) => (i === vieta ? null : n))
      return uzdavinys(T12, {
        klausimas: 'Koks skaičius turi būti tuščiame langelyje?',
        atsakymas: String(nariai[vieta]),
        atsakymasRodymui: `$${sk4(nariai[vieta])}$`,
        sprendimas: `Langelis yra ${vieta % 2 === 0 ? 'nelyginėje' : 'lyginėje'} vietoje, tad priklauso ${vieta % 2 === 0 ? 'pirmajai' : 'antrajai'} sekai, kurioje kaskart pridedama ${vieta % 2 === 0 ? za : zb}.`,
        brezinys: pintosSekos(su),
      })
    },

    // 4. Antrosios sekos taisyklė
    () =>
      uzdavinys(T12, {
        klausimas: 'Kiek pridedama kaskart antrojoje sekoje (lyginėse vietose)?',
        atsakymas: String(zb),
        atsakymasRodymui: `$${zb}$`,
        sprendimas: `Lyginėse vietose stovi ${b0}, ${b0 + zb}, ${b0 + 2 * zb} — tarp jų skirtumas ${zb}.`,
        brezinys: pintosSekos(nariai),
      }),

    // 5. Klaidos radimas
    () => {
      const vieta = pasirink([4, 5, 6])
      const sugadinti = [...nariai]
      sugadinti[vieta] = nariai[vieta] + pasirink([-3, 3, 5])
      return uzdavinys(T12, {
        klausimas: 'Vienas narys neatitinka savo sekos taisyklės. Koks skaičius ten turi būti?',
        atsakymas: String(nariai[vieta]),
        atsakymasRodymui: `$${sk4(nariai[vieta])}$`,
        sprendimas: `Klaida yra ${vieta + 1}-oje vietoje: pagal savo sekos taisyklę ten turi būti $${sk4(nariai[vieta])}$.`,
        brezinys: pintosSekos(sugadinti),
      })
    },

    // 6. Kuri seka auga greičiau
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kuri iš dviejų pakaitomis surašytų sekų auga greičiau?',
        variantai:
          za > zb
            ? ['pirmoji (nelyginės vietos)', 'antroji (lyginės vietos)', 'abi auga vienodai']
            : ['antroji (lyginės vietos)', 'pirmoji (nelyginės vietos)', 'abi auga vienodai'],
        teisingas: 0,
        sprendimas: `Pirmojoje pridedama po ${za}, antrojoje — po ${zb}.`,
        brezinys: pintosSekos(nariai),
      }),

    // 7. Kelintoje vietoje pasirodys duotas skaičius
    () => {
      const kelintas = atsitiktinis(2, 4)
      const narys = b0 + kelintas * zb
      return uzdavinys(T12, {
        klausimas: `Kelintoje eilutės vietoje atsidurs skaičius $${sk4(narys)}$?`,
        atsakymas: String(2 * kelintas + 2),
        atsakymasRodymui: `$${2 * kelintas + 2}$`,
        sprendimas: `Tai antrosios sekos ${kelintas + 1}-asis narys, o antroji seka užima lygines vietas: $2 \\cdot ${kelintas + 1} = ${2 * kelintas + 2}$.`,
        brezinys: pintosSekos(nariai),
      })
    },
  ])
}

// ── 1.13 Kokia tvarka atlikti veiksmus skaitiniame reiškinyje? ──────────────

const T13 = 'veiksmu-tvarka-4'

const A_TVARKA = [
  {
    klausimas: 'Apskaičiuok: $120 + 30 \\cdot 4$.',
    atsakymas: '240',
    atsakymasRodymui: '$240$',
    sprendimas: 'Pirma daugyba: $30 \\cdot 4 = 120$, tada $120 + 120 = 240$.',
  },
] as const

export const veiksmuTvarka4: Generatorius = () => suBandymais(kurkTvarka, A_TVARKA, T13)

function kurkTvarka(): Uzdavinys | null {
  const a = atsitiktinis(120, 900)
  const b = atsitiktinis(12, 60)
  const c = atsitiktinis(3, 9)

  return tvarkosVariacijos(a, b, c)
}

function tvarkosVariacijos(a: number, b: number, c: number): Uzdavinys | null {
  return variacija([
    // 1. Daugyba prieš sudėtį
    () =>
      uzdavinys(T13, {
        klausimas: `Apskaičiuok: $${a} + ${b} \\cdot ${c}$.`,
        atsakymas: String(a + b * c),
        atsakymasRodymui: `$${sk4(a + b * c)}$`,
        sprendimas: `Pirma daugyba: $${b} \\cdot ${c} = ${b * c}$, tada $${a} + ${b * c} = ${sk4(a + b * c)}$.`,
      }),

    // 2. Skliaustai keičia tvarką
    () =>
      uzdavinys(T13, {
        klausimas: `Apskaičiuok: $(${a} + ${b}) \\cdot ${c}$.`,
        atsakymas: String((a + b) * c),
        atsakymasRodymui: `$${sk4((a + b) * c)}$`,
        sprendimas: `Skliaustai atliekami pirmi: $${a} + ${b} = ${a + b}$, tada $${a + b} \\cdot ${c} = ${sk4((a + b) * c)}$.`,
      }),

    // 3. Kuris veiksmas pirmas
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: `Kuris veiksmas reiškinyje $${a} - ${b} \\cdot ${c}$ atliekamas pirmas?`,
        variantai: ['daugyba', 'atimtis', 'abu vienu metu', 'tas, kuris parašytas kairiau'],
        teisingas: 0,
        sprendimas: 'Daugyba ir dalyba atliekamos prieš sudėtį ir atimtį, kad ir kurioje vietoje būtų parašytos.',
        brezinys: reiskinioTvarka([String(a), '−', String(b), '·', String(c)], [null, 2, null, 1, null]),
      }),

    // 4. Klaidos radimas
    () => {
      const klaidingas = (a + b) * c
      if (klaidingas === a + b * c) return null
      return uzdavinys(T13, {
        klausimas: `Mokinys apskaičiavo $${a} + ${b} \\cdot ${c} = ${sk4(klaidingas)}$. Užrašyk teisingą reikšmę.`,
        atsakymas: String(a + b * c),
        atsakymasRodymui: `$${sk4(a + b * c)}$`,
        sprendimas: `Mokinys pirma sudėjo, nors skliaustų nėra. Teisingai pirma daugyba: $${b} \\cdot ${c} = ${b * c}$, tada $${sk4(a + b * c)}$.`,
      })
    },

    // 5. Kur dėti skliaustus
    () => {
      const tikslas = (a + b) * c
      return uzdavinys(T13, {
        klausimas: `Reiškinyje $${a} + ${b} \\cdot ${c}$ sustatyk skliaustus taip, kad reikšmė būtų $${sk4(tikslas)}$. Kokia veiksmo, kuris tada atliekamas pirmas, reikšmė?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${sk4(a + b)}$`,
        sprendimas: `Skliaustai dedami apie sudėtį: $(${a} + ${b}) \\cdot ${c}$. Pirmas veiksmas duoda $${sk4(a + b)}$.`,
      })
    },

    // 6. Trys veiksmai
    () => {
      const d = atsitiktinis(2, 6)
      if (a - b * c <= 0) return null
      return uzdavinys(T13, {
        klausimas: `Apskaičiuok: $${a} - ${b} \\cdot ${c} + ${d}$.`,
        atsakymas: String(a - b * c + d),
        atsakymasRodymui: `$${sk4(a - b * c + d)}$`,
        sprendimas: `Pirma daugyba $${b} \\cdot ${c} = ${b * c}$, tada iš kairės į dešinę: $${a} - ${b * c} = ${a - b * c}$, $${a - b * c} + ${d} = ${sk4(a - b * c + d)}$.`,
      })
    },

    // 7. Dalyba su skliaustais
    () => {
      const dalmuo = atsitiktinis(12, 60)
      const daliklis = atsitiktinis(3, 9)
      const priedas = atsitiktinis(10, 80)
      const dalinys = dalmuo * daliklis
      return uzdavinys(T13, {
        klausimas: `Apskaičiuok: $${sk4(dalinys + priedas * daliklis)} : ${daliklis} - ${priedas}$.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${sk4(dalmuo)}$`,
        sprendimas: `Pirma dalyba: $${sk4(dalinys + priedas * daliklis)} : ${daliklis} = ${sk4(dalmuo + priedas)}$, tada $${sk4(dalmuo + priedas)} - ${priedas} = ${sk4(dalmuo)}$.`,
      })
    },

    // 8. Reiškinių palyginimas
    () => {
      const be = a + b * c
      const su = (a + b) * c
      if (be === su) return null
      return pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: `Kurio reiškinio reikšmė didesnė: $${a} + ${b} \\cdot ${c}$ ar $(${a} + ${b}) \\cdot ${c}$?`,
        variantai:
          be > su
            ? [`$${a} + ${b} \\cdot ${c}$`, `$(${a} + ${b}) \\cdot ${c}$`, 'reikšmės lygios']
            : [`$(${a} + ${b}) \\cdot ${c}$`, `$${a} + ${b} \\cdot ${c}$`, 'reikšmės lygios'],
        teisingas: 0,
        sprendimas: `$${sk4(be)}$ ir $${sk4(su)}$ — skliaustai keičia rezultatą.`,
      })
    },
  ])
}

// ── 1.14 Kaip spręsti tekstinį uždavinį sudarant skaitinį reiškinį? ─────────

const T14 = 'reiskinys-pagal-uzdavini'

const A_REISKINYS = [
  {
    klausimas: 'Nupirkti 4 sąsiuviniai po 3 Eur ir vienas segtuvas už 5 Eur. Kiek sumokėta?',
    atsakymas: '17',
    atsakymasRodymui: '$17$ Eur',
    sprendimas: '$4 \\cdot 3 + 5 = 17$.',
  },
] as const

export const reiskinysPagalUzdavini: Generatorius = () =>
  suBandymais(kurkReiskiniPagalSalyga, A_REISKINYS, T14)

function kurkReiskiniPagalSalyga(): Uzdavinys | null {
  const vardas = pasirink(VARDAI)
  const kiekis = atsitiktinis(3, 8)
  const kaina = atsitiktinis(3, 12)
  const atskirai = atsitiktinis(5, 25)

  return variacija([
    // 1. Parinkti reiškinį
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: `${vardas} nupirko ${kiek(kiekis, D.sasiuvinius)} po ${kaina} Eur ir vieną kuprinę už ${atskirai} Eur. Kuris reiškinys tinka bendrai kainai rasti?`,
        variantai: [
          `$${kiekis} \\cdot ${kaina} + ${atskirai}$`,
          `$(${kiekis} + ${kaina}) \\cdot ${atskirai}$`,
          `$${kiekis} \\cdot (${kaina} + ${atskirai})$`,
          `$${kiekis} + ${kaina} + ${atskirai}$`,
        ],
        teisingas: 0,
        sprendimas: `Sąsiuvinių kaina yra $${kiekis} \\cdot ${kaina} = ${kiekis * kaina}$ Eur, prie jos pridedama kuprinė.`,
      }),

    // 2. Sudaryti reiškinį ir suskaičiuoti
    () =>
      uzdavinys(T14, {
        klausimas: `${vardas} nupirko ${kiek(kiekis, D.sasiuvinius)} po ${kaina} Eur ir kuprinę už ${atskirai} Eur. Kiek sumokėta iš viso?`,
        atsakymas: String(kiekis * kaina + atskirai),
        atsakymasRodymui: `$${kiekis * kaina + atskirai}$ Eur`,
        sprendimas: `Reiškinys: $${kiekis} \\cdot ${kaina} + ${atskirai} = ${kiekis * kaina + atskirai}$.`,
      }),

    // 3. Reiškinys su skliaustais
    () => {
      const denu = atsitiktinis(3, 7)
      const rytas = atsitiktinis(12, 40)
      const vakaras = atsitiktinis(8, 30)
      return uzdavinys(T14, {
        klausimas: `Kiekvieną dieną autobusas nuveža ${kiek(rytas, D.keleiviai)} ryte ir ${vakaras} vakare. Kiek keleivių jis nuveš per ${denu} dienas?`,
        atsakymas: String((rytas + vakaras) * denu),
        atsakymasRodymui: `$${sk4((rytas + vakaras) * denu)}$`,
        sprendimas: `Reiškinys: $(${rytas} + ${vakaras}) \\cdot ${denu} = ${sk4((rytas + vakaras) * denu)}$.`,
      })
    },

    // 4. Į kurį klausimą atsako reiškinys
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: `Sąlyga: „Dėžėje ${kiekis * 100} obuolių, iš jų ${kaina * 10} supuvo.“ Į kurį klausimą atsako reiškinys $${kiekis * 100} - ${kaina * 10}$?`,
        variantai: [
          'Kiek obuolių liko sveikų?',
          'Kiek obuolių supuvo?',
          'Kiek obuolių buvo iš pradžių?',
          'Kiek kartų daugiau sveikų nei supuvusių?',
        ],
        teisingas: 0,
        sprendimas: `Iš visų obuolių atimami supuvę, tad lieka sveikieji: $${kiekis * 100 - kaina * 10}$.`,
      }),

    // 5. Klaida sudarytame reiškinyje
    () => {
      const gr = atsitiktinis(4, 9)
      const eile = atsitiktinis(6, 12)
      const papildomai = atsitiktinis(5, 20)
      return uzdavinys(T14, {
        klausimas: `Uždavinys: „Salėje ${kiek(gr, D.eiles)} po ${kiek(eile, D.kedziu)} ir dar ${kiek(papildomai, D.kedes)} prie sienos. Kiek kėdžių salėje?“ Mokinys užrašė $(${gr} + ${papildomai}) \\cdot ${eile}$. Užrašyk teisingą atsakymą.`,
        atsakymas: String(gr * eile + papildomai),
        atsakymasRodymui: `$${gr * eile + papildomai}$`,
        sprendimas: `Prie sienos stovinčios kėdės eilėms nepriklauso, tad reiškinys yra $${gr} \\cdot ${eile} + ${papildomai} = ${gr * eile + papildomai}$.`,
      })
    },

    // 6. Perteklinis duomuo
    () => {
      const puslapiu = atsitiktinis(120, 300)
      const perDiena = atsitiktinis(15, 30)
      const knygu = atsitiktinis(3, 8)
      return pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: `Sąlyga: „Knygoje ${kiek(puslapiu, D.puslapiai)}, ${vardas} skaito po ${kiek(perDiena, D.puslapius)} per dieną, o lentynoje stovi ${kiek(knygu, D.knygos)}.“ Kurio duomens nereikia norint sužinoti, per kiek dienų knyga bus perskaityta?`,
        variantai: [`knygų skaičius (${knygu})`, `puslapių skaičius (${puslapiu})`, `puslapiai per dieną (${perDiena})`],
        teisingas: 0,
        sprendimas: `Reikia tik $${puslapiu} : ${perDiena}$ — kiek knygų stovi lentynoje, skaitymo trukmei įtakos neturi.`,
      })
    },

    // 7. Dviejų žingsnių su skirtumu
    () => {
      const buvo = atsitiktinis(20, 60) * 10
      const kartai = atsitiktinis(2, 5)
      return uzdavinys(T14, {
        klausimas: `Pirmoje dėžėje ${kiek(buvo, D.varztai)}, antroje — ${kiek(kartai, D.kartai)} mažiau. Keliais varžtais pirmoje dėžėje daugiau?`,
        atsakymas: String(buvo - Math.floor(buvo / kartai)),
        atsakymasRodymui: `$${sk4(buvo - Math.floor(buvo / kartai))}$`,
        sprendimas: `Reiškinys: $${sk4(buvo)} - ${sk4(buvo)} : ${kartai} = ${sk4(buvo)} - ${sk4(Math.floor(buvo / kartai))} = ${sk4(buvo - Math.floor(buvo / kartai))}$.`,
      })
    },
  ])
}

// ── 1.15 Kaip kompiuterine programa sukurti užduotį? ────────────────────────

const T15 = 'programa-uzduociai'

const A_PROGRAMA = [
  {
    klausimas: 'Programa kartoja komandą „spausdink uždavinį“ 5 kartus. Kiek uždavinių ji sukurs?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: 'Kiek kartų kartojama, tiek uždavinių ir sukuriama.',
  },
] as const

export const programaUzduociai: Generatorius = () => suBandymais(kurkPrograma, A_PROGRAMA, T15)

function kurkPrograma(): Uzdavinys | null {
  const kartai = atsitiktinis(3, 9)
  const eiluteje = atsitiktinis(2, 5)

  return variacija([
    // 1. Kiek uždavinių sukurs
    () =>
      uzdavinys(T15, {
        klausimas: 'Kiek uždavinių sukurs ši programa?',
        atsakymas: String(kartai * eiluteje),
        atsakymasRodymui: `$${kartai * eiluteje}$`,
        sprendimas: `Kartojama ${kiek(kartai, D.kartai)}, kaskart sukuriama ${kiek(eiluteje, D.uzdaviniai)}: $${kartai} \\cdot ${eiluteje} = ${kartai * eiluteje}$.`,
        brezinys: programosLangas([
          `kartok ${kartai} kartus`,
          `  sukurk ${kiek(eiluteje, D.uzdavinius)}`,
          'pabaiga',
        ]),
      }),

    // 2. Ką programa išves
    () => {
      const pradzia = atsitiktinis(2, 9)
      const zingsnis = atsitiktinis(2, 6)
      return uzdavinys(T15, {
        klausimas: 'Koks skaičius bus išvestas paskutinis?',
        atsakymas: String(pradzia + (kartai - 1) * zingsnis),
        atsakymasRodymui: `$${pradzia + (kartai - 1) * zingsnis}$`,
        sprendimas: `Pirmas išvedamas ${pradzia}, paskui kaskart ${zingsnis} daugiau. Po ${kartai - 1} pridėjimų gaunama $${pradzia + (kartai - 1) * zingsnis}$.`,
        brezinys: programosLangas([
          `skaicius = ${pradzia}`,
          `kartok ${kartai} kartus`,
          '  spausdink skaicius',
          `  skaicius = skaicius + ${zingsnis}`,
          'pabaiga',
        ]),
      })
    },

    // 3. Klaida programoje
    () => {
      const norima = atsitiktinis(6, 12)
      const parasyta = norima + pasirink([-2, -1, 1, 2])
      if (parasyta < 2) return null
      return uzdavinys(T15, {
        klausimas: `Programa turi sukurti ${kiek(norima, D.uzdavinius)}, bet sukuria kitą kiekį. Koks skaičius turi būti trečioje eilutėje?`,
        atsakymas: String(norima),
        atsakymasRodymui: `$${norima}$`,
        sprendimas: `Kartojimų skaičius ir yra sukurtų uždavinių skaičius, tad vietoj ${parasyta} reikia rašyti ${norima}.`,
        brezinys: programosLangas(
          ['pradzia', 'isvalyk lapa', `kartok ${parasyta} kartus`, '  sukurk 1 uždavinį', 'pabaiga'],
          3,
        ),
      })
    },

    // 4. Komandų eiliškumas
    () =>
      eiliskumoUzdavinys(naujasId(T15), T15, {
        klausimas: 'Surikiuok komandas taip, kad programa sukurtų uždavinių lapą.',
        teisingaEile: [
          'sukurk tuščią lapą',
          'nustatyk uždavinių skaičių',
          'kartok: sukurk vieną uždavinį',
          'išspausdink lapą',
        ],
        sprendimas: 'Pirma paruošiamas lapas, tada nusakoma, kiek uždavinių, tada jie kuriami, ir tik pabaigoje spausdinama.',
      }),

    // 5. Kiek reikia kartojimų
    () => {
      const norima = eiluteje * atsitiktinis(3, 8)
      return uzdavinys(T15, {
        klausimas: `Kiek kartų reikia pakartoti kūrimo komandą, kad būtų sukurta ${kiek(norima, D.uzdaviniai)}, jei kaskart sukuriami ${eiluteje}?`,
        atsakymas: String(norima / eiluteje),
        atsakymasRodymui: `$${norima / eiluteje}$`,
        sprendimas: `$${norima} : ${eiluteje} = ${norima / eiluteje}$.`,
      })
    },

    // 6. Dvi programos — kuri sukuria daugiau
    () => {
      const kartai2 = atsitiktinis(3, 9)
      const eiluteje2 = atsitiktinis(2, 5)
      if (kartai * eiluteje === kartai2 * eiluteje2) return null
      return pasirinkimoUzdavinys(naujasId(T15), T15, {
        klausimas: `Pirmoji programa kartoja ${kiek(kartai, D.kartai)} po ${eiluteje} uždavinius, antroji — ${kiek(kartai2, D.kartai)} po ${eiluteje2}. Kuri sukuria daugiau uždavinių?`,
        variantai:
          kartai * eiluteje > kartai2 * eiluteje2
            ? ['pirmoji', 'antroji', 'abi sukuria po lygiai']
            : ['antroji', 'pirmoji', 'abi sukuria po lygiai'],
        teisingas: 0,
        sprendimas: `$${kartai} \\cdot ${eiluteje} = ${kartai * eiluteje}$ ir $${kartai2} \\cdot ${eiluteje2} = ${kartai2 * eiluteje2}$.`,
      })
    },

    // 7. Sąlyga programoje
    () => {
      const riba = atsitiktinis(4, 9)
      const viso = atsitiktinis(riba + 2, riba + 8)
      return uzdavinys(T15, {
        klausimas: `Programa peržiūri ${kiek(viso, { vns: 'paruoštą uždavinį', dgs: 'paruoštus uždavinius', kilm: 'paruoštų uždavinių' })} ir į lapą įrašo tik tuos, kurių numeris didesnis už ${riba}. Kiek uždavinių pateks į lapą?`,
        atsakymas: String(viso - riba),
        atsakymasRodymui: `$${viso - riba}$`,
        sprendimas: `Tinka numeriai nuo ${riba + 1} iki ${viso}, tad jų yra $${viso} - ${riba} = ${viso - riba}$.`,
        brezinys: programosLangas([
          `kartok su kiekvienu iš ${viso} uždavinių`,
          `  jeigu numeris > ${riba}`,
          '    įrašyk į lapą',
          'pabaiga',
        ]),
      })
    },
  ])
}
