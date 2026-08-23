import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { dviJuostos, trupmenosApskritimas, trupmenosJuosta } from './treciokams-vaizdai'
import { trupmenuTiese } from './treciokams-algebros-vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 3 klasės tema „Trupmenos. Tekstinių uždavinių sprendimas“ — devynios potemės.
 *
 * Anksčiau jos rėmėsi `dalies-radimas`, `bendravardiklinimas` ir `logika`
 * generatoriais. `bendravardiklinimas` skirtas 5–6 klasei: trupmenos ten
 * pertvarkomos ieškant bendro vardiklio, o trečioje klasėje jos lyginamos
 * pažiūrėjus į modelį arba į skaičių tiesę.
 *
 * Trupmenos visur rašomos matematine forma — skaitiklis virš brūkšnio — ir
 * brėžiniuose išdėstomos tiksliai: $\tfrac{3}{4}$ stovi ties trečia iš keturių
 * lygių padalų.
 */

const VIENETAI = [
  { vardas: 'cm', daiktas: 'juosta', ilgis: true },
  { vardas: 'm', daiktas: 'virvė', ilgis: true },
  { vardas: 'l', daiktas: 'indas', ilgis: false },
  { vardas: 'kg', daiktas: 'maišas', ilgis: false },
] as const

function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 1000, 1000)
}

/** KaTeX trupmena — visuose uždaviniuose rašoma vienodai. */
function tr(skaitiklis: number, vardiklis: number): string {
  return `\\dfrac{${skaitiklis}}{${vardiklis}}`
}

// ── 9.1 Trupmenos skaičių tiesėje ───────────────────────────────────────────

const A_TIESE = [
  {
    klausimas: 'Į kiek lygių dalių padalyta atkarpa nuo 0 iki 1?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: 'Tarp 0 ir 1 yra keturios vienodos padalos.',
  },
] as const

export const trupmenosTieseje: Generatorius = () =>
  suBandymais(kurkTiese, A_TIESE, 'trupmenos-tieseje')

function kurkTiese(): Uzdavinys | null {
  const vardiklis = pasirink([4, 5, 6, 8, 10])
  const skaitiklis = atsitiktinis(1, vardiklis - 1)

  return variacija([
    // 1. Kokia trupmena pažymėta
    () =>
      uzdavinys('trupmenos-tieseje', {
        // Tiesėje pažymėtas taškas be užrašo — jo vardą reikia nustatyti.
        klausimas: 'Kokia trupmena pažymėta skaičių tiesėje? Parašyk jos skaitiklį.',
        atsakymas: String(skaitiklis),
        atsakymasRodymui: `$${tr(skaitiklis, vardiklis)}$`,
        sprendimas: `Vienetas padalytas į ${vardiklis} dalis, o taškas stovi ties ${skaitiklis}-ąja padala.`,
        brezinys: trupmenuTiese(vardiklis, [{ skaitiklis }]),
      }),

    // 2. Į kiek dalių padalytas vienetas
    () =>
      uzdavinys('trupmenos-tieseje', {
        klausimas: 'Į kiek lygių dalių skaičių tiesėje padalytas vienetas?',
        atsakymas: String(vardiklis),
        atsakymasRodymui: `$${vardiklis}$`,
        sprendimas: `Tarp 0 ir 1 suskaičiuojamos ${vardiklis} vienodos padalos — tai trupmenos vardiklis.`,
        brezinys: trupmenuTiese(vardiklis),
      }),

    // 3. Trys taškai — kuris didžiausias
    () => {
      const trys = sumaisyk(
        Array.from({ length: vardiklis - 1 }, (_, i) => i + 1),
      ).slice(0, 3)
      if (trys.length < 3) return null
      const didziausias = Math.max(...trys)
      const raides = ['A', 'B', 'C']
      const kuris = raides[trys.indexOf(didziausias)]
      return pasirinkimoUzdavinys(naujasId('trupmenos-tieseje'), 'trupmenos-tieseje', {
        klausimas: 'Kuris skaičių tiesės taškas žymi didžiausią trupmeną?',
        variantai: [kuris, ...raides.filter((x) => x !== kuris)],
        teisingas: 0,
        sprendimas: 'Kuo taškas toliau nuo nulio, tuo trupmena didesnė.',
        brezinys: trupmenuTiese(
          vardiklis,
          trys.map((s, i) => ({ skaitiklis: s, raide: raides[i] })),
        ),
      })
    },

    // 4. Kelinta padala
    () =>
      uzdavinys('trupmenos-tieseje', {
        klausimas: `Kelintoje padaloje nuo nulio reikia pažymėti trupmeną $${tr(
          skaitiklis,
          vardiklis,
        )}$?`,
        atsakymas: String(skaitiklis),
        atsakymasRodymui: `$${skaitiklis}$`,
        sprendimas: `Skaitiklis rodo, kiek dalių paimta, tad žymima ${skaitiklis}-oji padala.`,
        brezinys: trupmenuTiese(vardiklis),
      }),

    // 5. Klaidos radimas
    () => {
      // Skaičiai čia sąmoningai pastovūs: klaida yra apie tai, ką reiškia
      // vardiklis, tad jos formuluotė turi sutapti su paaiškinimu.
      const teisingasVardiklis = 4
      const blogasVardiklis = 5
      return pasirinkimoUzdavinys(naujasId('trupmenos-tieseje'), 'trupmenos-tieseje', {
        klausimas: `Mokinys trupmeną $${tr(
          3,
          teisingasVardiklis,
        )}$ pažymėjo trečioje iš ${blogasVardiklis} vienodų padalų. Kur klaida?`,
        variantai: [
          `vienetą reikėjo dalyti į ${teisingasVardiklis} dalis, o ne į ${blogasVardiklis}`,
          `reikėjo žymėti ketvirtą padalą iš ${blogasVardiklis}`,
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Vardiklis rodo, į kiek dalių dalijamas vienetas — čia į ${teisingasVardiklis}, o ne į ${blogasVardiklis}.`,
      })
    },

    // 6. Tiesė iki 2
    () => {
      const v = pasirink([4, 5])
      const s = v + atsitiktinis(1, v - 1)
      return uzdavinys('trupmenos-tieseje', {
        klausimas: 'Kiek padalų nuo nulio yra iki pažymėto taško?',
        atsakymas: String(s),
        atsakymasRodymui: `$${s}$`,
        sprendimas: `Taškas yra už vieneto, tad padalų nuo nulio ${s}: vienas visas vienetas ir dar ${
          s - v
        }.`,
        brezinys: trupmenuTiese(v, [{ skaitiklis: s }], 2),
      })
    },

    // 7. Kuri trupmena arčiau vieneto
    () => {
      const a = atsitiktinis(1, vardiklis - 2)
      const b = atsitiktinis(a + 1, vardiklis - 1)
      return pasirinkimoUzdavinys(naujasId('trupmenos-tieseje'), 'trupmenos-tieseje', {
        klausimas: `Kuri trupmena skaičių tiesėje yra arčiau vieneto: $${tr(
          a,
          vardiklis,
        )}$ ar $${tr(b, vardiklis)}$?`,
        variantai: [`$${tr(b, vardiklis)}$`, `$${tr(a, vardiklis)}$`, 'abi vienodai'],
        teisingas: 0,
        sprendimas: `Vardikliai vienodi, tad didesnė yra ta, kurios skaitiklis didesnis.`,
        brezinys: trupmenuTiese(vardiklis, [
          { skaitiklis: a, raide: 'A' },
          { skaitiklis: b, raide: 'B' },
        ]),
      })
    },
  ])
}

// ── 9.2 Kaip palyginti trupmenas? ───────────────────────────────────────────

const A_PALYGINIMAS = [
  {
    klausimas: 'Palygink: $\\dfrac{3}{8}$ ir $\\dfrac{5}{8}$. Kuri didesnė?',
    atsakymas: 'A',
    atsakymasRodymui: 'A — $\\dfrac{5}{8}$',
    sprendimas: 'Vardikliai vienodi, tad didesnė ta, kurios skaitiklis didesnis.',
  },
] as const

export const trupmenuPalyginimas: Generatorius = () =>
  suBandymais(kurkPalyginima, A_PALYGINIMAS, 'trupmenu-palyginimas')

function kurkPalyginima(): Uzdavinys | null {
  const vardiklis = pasirink([5, 6, 7, 8])
  const a = atsitiktinis(1, vardiklis - 2)
  const b = atsitiktinis(a + 1, vardiklis - 1)

  return variacija([
    // 1. Vienodi vardikliai
    () =>
      pasirinkimoUzdavinys(naujasId('trupmenu-palyginimas'), 'trupmenu-palyginimas', {
        klausimas: `Kuri trupmena didesnė: $${tr(a, vardiklis)}$ ar $${tr(b, vardiklis)}$?`,
        variantai: [`$${tr(b, vardiklis)}$`, `$${tr(a, vardiklis)}$`, 'trupmenos lygios'],
        teisingas: 0,
        sprendimas: `Vardikliai vienodi, tad didesnė ta, kurios skaitiklis didesnis: $${b} > ${a}$.`,
      }),

    // 2. Iš dviejų juostų
    () => {
      const kitas = vardiklis === 6 ? 8 : 6
      const kitasSkaitiklis = atsitiktinis(1, kitas - 1)
      const pirma = a / vardiklis
      const antra = kitasSkaitiklis / kitas
      if (Math.abs(pirma - antra) < 0.16) return null
      return pasirinkimoUzdavinys(naujasId('trupmenu-palyginimas'), 'trupmenu-palyginimas', {
        // Trupmenos tekste neįvardijamos — jas reikia nuskaityti iš juostų.
        klausimas: 'Kuri juosta nuspalvinta didesne dalimi?',
        variantai:
          pirma > antra ? ['pirmoji', 'antroji', 'dalys lygios'] : ['antroji', 'pirmoji', 'dalys lygios'],
        teisingas: 0,
        sprendimas: `Pirmoje nuspalvinta $${tr(a, vardiklis)}$, antroje — $${tr(
          kitasSkaitiklis,
          kitas,
        )}$.`,
        brezinys: dviJuostos(
          { daliu: vardiklis, nuspalvinta: a },
          { daliu: kitas, nuspalvinta: kitasSkaitiklis },
        ),
      })
    },

    // 3. Vienodi skaitikliai
    () => {
      const v1 = pasirink([3, 4])
      const v2 = pasirink([6, 8])
      return pasirinkimoUzdavinys(naujasId('trupmenu-palyginimas'), 'trupmenu-palyginimas', {
        klausimas: `Kuri trupmena didesnė: $${tr(1, v1)}$ ar $${tr(1, v2)}$?`,
        variantai: [`$${tr(1, v1)}$`, `$${tr(1, v2)}$`, 'trupmenos lygios'],
        teisingas: 0,
        sprendimas: `Kuo į daugiau dalių dalijama, tuo kiekviena dalis mažesnė, tad $${tr(
          1,
          v1,
        )}$ didesnė.`,
        brezinys: dviJuostos({ daliu: v1, nuspalvinta: 1 }, { daliu: v2, nuspalvinta: 1 }),
      })
    },

    // 4. Rikiavimas
    () => {
      const trys = sumaisyk(Array.from({ length: vardiklis - 1 }, (_, i) => i + 1)).slice(0, 3)
      if (trys.length < 3) return null
      return eiliskumoUzdavinys(naujasId('trupmenu-palyginimas'), 'trupmenu-palyginimas', {
        klausimas: 'Surikiuok trupmenas didėjimo tvarka.',
        teisingaEile: [...trys].sort((x, y) => x - y).map((s) => `$${tr(s, vardiklis)}$`),
        sprendimas: 'Vardikliai vienodi, tad rikiuojama pagal skaitiklius.',
      })
    },

    // 5. Neteisingas teiginys
    () =>
      pasirinkimoUzdavinys(naujasId('trupmenu-palyginimas'), 'trupmenu-palyginimas', {
        klausimas: `Kuris teiginys neteisingas?`,
        variantai: [
          `$${tr(4, 5)} < ${tr(1, 5)}$`,
          `$${tr(5, 7)} > ${tr(3, 7)}$`,
          `$${tr(2, 8)} < ${tr(6, 8)}$`,
        ],
        teisingas: 0,
        sprendimas: `$${tr(4, 5)}$ yra didesnė už $${tr(1, 5)}$, nes vardikliai vienodi, o $4 > 1$.`,
      }),

    // 6. Trupmena tarp dviejų
    () => {
      const v = 9
      const zemiau = 4
      const auksciau = 7
      const kiek = auksciau - zemiau - 1
      return uzdavinys('trupmenu-palyginimas', {
        klausimas: `Kiek trupmenų su vardikliu ${v} yra didesnės už $${tr(
          zemiau,
          v,
        )}$, bet mažesnės už $${tr(auksciau, v)}$?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `Tai $${tr(5, v)}$ ir $${tr(6, v)}$ — iš viso ${kiek}.`,
      })
    },

    // 7. Palyginimas su puse
    () => {
      const v = pasirink([6, 8, 10])
      const s = atsitiktinis(1, v - 1)
      if (s * 2 === v) return null
      return pasirinkimoUzdavinys(naujasId('trupmenu-palyginimas'), 'trupmenu-palyginimas', {
        klausimas: `Ar trupmena $${tr(s, v)}$ didesnė už pusę?`,
        variantai:
          s * 2 > v
            ? ['taip, didesnė', 'ne, mažesnė', 'lygi pusei']
            : ['ne, mažesnė', 'taip, didesnė', 'lygi pusei'],
        teisingas: 0,
        sprendimas: `Pusė yra $${tr(v / 2, v)}$, tad lyginami skaitikliai ${s} ir ${v / 2}.`,
      })
    },
  ])
}

// ── 9.3 Kokios trupmenos yra lygios? ────────────────────────────────────────

const A_LYGIOS = [
  {
    klausimas: 'Užpildyk: $\\dfrac{1}{2} = \\dfrac{\\square}{4}$',
    atsakymas: '2',
    atsakymasRodymui: '$2$',
    sprendimas: 'Pusė juostos yra dvi ketvirtosios dalys.',
  },
] as const

export const lygiosTrupmenos: Generatorius = () =>
  suBandymais(kurkLygias, A_LYGIOS, 'lygios-trupmenos')

function kurkLygias(): Uzdavinys | null {
  const pora = pasirink([
    { a: 1, b: 2, k: 2 },
    { a: 1, b: 2, k: 3 },
    { a: 1, b: 3, k: 2 },
    { a: 2, b: 3, k: 2 },
    { a: 3, b: 4, k: 2 },
    { a: 1, b: 4, k: 2 },
    { a: 2, b: 5, k: 2 },
  ])
  const { a, b, k } = pora

  return variacija([
    // 1. Trūkstamas skaitiklis
    () =>
      uzdavinys('lygios-trupmenos', {
        klausimas: `Užpildyk: $${tr(a, b)} = \\dfrac{\\square}{${b * k}}$`,
        atsakymas: String(a * k),
        atsakymasRodymui: `$${a * k}$`,
        sprendimas: `Ir skaitiklis, ir vardiklis padidinami ${k} kartus: $${a} \\cdot ${k} = ${
          a * k
        }$.`,
      }),

    // 2. Trūkstamas vardiklis
    () =>
      uzdavinys('lygios-trupmenos', {
        klausimas: `Užpildyk: $${tr(a, b)} = \\dfrac{${a * k}}{\\square}$`,
        atsakymas: String(b * k),
        atsakymasRodymui: `$${b * k}$`,
        sprendimas: `Skaitiklis padidėjo ${k} kartus, tad tiek pat turi padidėti ir vardiklis: $${b} \\cdot ${k} = ${
          b * k
        }$.`,
      }),

    // 3. Iš dviejų juostų
    () =>
      pasirinkimoUzdavinys(naujasId('lygios-trupmenos'), 'lygios-trupmenos', {
        // Trupmenos tekste neįvardijamos — jas reikia nuskaityti iš juostų.
        klausimas: 'Ar abi juostos nuspalvintos vienodai?',
        variantai: [
          'taip, nuspalvinta ta pati juostos dalis',
          'ne, pirmoji nuspalvinta daugiau',
          'ne, antroji nuspalvinta daugiau',
        ],
        teisingas: 0,
        sprendimas: `$${tr(a, b)}$ ir $${tr(a * k, b * k)}$ žymi tą pačią dalį.`,
        brezinys: dviJuostos(
          { daliu: b, nuspalvinta: a },
          { daliu: b * k, nuspalvinta: a * k },
        ),
      }),

    // 4. Kuri lygi
    () =>
      pasirinkimoUzdavinys(naujasId('lygios-trupmenos'), 'lygios-trupmenos', {
        klausimas: `Kuri trupmena lygi $${tr(a, b)}$?`,
        variantai: [
          `$${tr(a * k, b * k)}$`,
          `$${tr(a, b * k)}$`,
          `$${tr(a * k, b)}$`,
        ],
        teisingas: 0,
        sprendimas: 'Lygios trupmenos gaunamos skaitiklį ir vardiklį padidinus tiek pat kartų.',
      }),

    // 5. Iš apskritimų
    () =>
      pasirinkimoUzdavinys(naujasId('lygios-trupmenos'), 'lygios-trupmenos', {
        klausimas: 'Kokia trupmena nuspalvinta apskritime? Parašyk lygią jai trupmeną.',
        variantai: [`$${tr(a * k, b * k)}$`, `$${tr(a + 1, b)}$`, `$${tr(a, b + k)}$`],
        teisingas: 0,
        sprendimas: `Nuspalvinta $${tr(a, b)}$, o tai tas pats kaip $${tr(a * k, b * k)}$.`,
        brezinys: trupmenosApskritimas(b, a),
      }),

    // 6. Tas pats taškas tiesėje
    () =>
      uzdavinys('lygios-trupmenos', {
        klausimas: `Skaičių tiesėje pažymėtas taškas. Kiek dalių iš ${b * k} jis atitinka?`,
        atsakymas: String(a * k),
        atsakymasRodymui: `$${a * k}$`,
        sprendimas: `$${tr(a, b)} = ${tr(a * k, b * k)}$ — tai tas pats taškas.`,
        brezinys: trupmenuTiese(b * k, [{ skaitiklis: a * k }]),
      }),

    // 7. Klaidos tikrinimas
    () => {
      const teisinga = a * k
      const blogas = a + k
      if (blogas === teisinga) return null
      return pasirinkimoUzdavinys(naujasId('lygios-trupmenos'), 'lygios-trupmenos', {
        klausimas: `Mokinys teigia, kad $${tr(a, b)} = ${tr(blogas, b * k)}$. Ar teisingai?`,
        variantai: [
          `ne, turi būti $${tr(teisinga, b * k)}$`,
          'taip, teisingai',
          'negalima palyginti',
        ],
        teisingas: 0,
        sprendimas: `Vardiklis padidėjo ${k} kartus, tad ir skaitiklis turi padidėti ${k} kartus.`,
      })
    },
  ])
}

// ── 9.4 Trupmenos su matavimo vienetais ─────────────────────────────────────

const A_MATAI = [
  {
    klausimas: 'Juosta yra 24 cm ilgio. $\\dfrac{1}{3}$ jos nuspalvinta. Kiek centimetrų nuspalvinta?',
    atsakymas: '8',
    atsakymasRodymui: '$8$ cm',
    sprendimas: '$24 : 3 = 8$.',
  },
] as const

export const trupmenosSuMatais: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkMatus(sritis), A_MATAI, 'trupmenos-su-matais')

function kurkMatus(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const vnt = pasirink(VIENETAI)
  const vardiklis = atsitiktinis(3, 9)
  const viena = atsitiktinis(2, 12)
  const visuma = vardiklis * viena
  if (visuma > maks) return null
  const skaitiklis = atsitiktinis(1, vardiklis - 1)

  return variacija([
    // 1. Kiek sudaro nurodyta dalis
    () =>
      uzdavinys('trupmenos-su-matais', {
        klausimas: `${vnt.daiktas.charAt(0).toUpperCase()}${vnt.daiktas.slice(
          1,
        )} yra ${visuma} ${vnt.vardas}. Kiek ${vnt.vardas} sudaro $${tr(1, vardiklis)}$ jos?`,
        atsakymas: String(viena),
        atsakymasRodymui: `$${viena}$ ${vnt.vardas}`,
        sprendimas: `$${visuma} : ${vardiklis} = ${viena}$.`,
      }),

    // 2. Dalis su skaitikliu
    () =>
      uzdavinys('trupmenos-su-matais', {
        klausimas: `Kelias yra ${visuma} km. $${tr(
          skaitiklis,
          vardiklis,
        )}$ kelio jau nuvažiuota. Kiek kilometrų nuvažiuota?`,
        atsakymas: String(viena * skaitiklis),
        atsakymasRodymui: `$${viena * skaitiklis}$ km`,
        sprendimas: `$${visuma} : ${vardiklis} = ${viena}$, tada $${viena} \\cdot ${skaitiklis} = ${
          viena * skaitiklis
        }$.`,
      }),

    // 3. Kiek liko
    () =>
      uzdavinys('trupmenos-su-matais', {
        klausimas: `Takelis yra ${visuma} m ilgio. $${tr(
          skaitiklis,
          vardiklis,
        )}$ jo išgrįsta. Kiek metrų dar liko išgrįsti?`,
        atsakymas: String(visuma - viena * skaitiklis),
        atsakymasRodymui: `$${visuma - viena * skaitiklis}$ m`,
        sprendimas: `Išgrįsta $${viena} \\cdot ${skaitiklis} = ${
          viena * skaitiklis
        }$, liko $${visuma} - ${viena * skaitiklis} = ${visuma - viena * skaitiklis}$.`,
      }),

    // 4. Iš juostos brėžinio
    () => {
      const daliu = pasirink([4, 5, 6, 7, 8])
      const dalis = atsitiktinis(2, daliu - 1)
      const vienaDalis = atsitiktinis(2, 12)
      const visas = daliu * vienaDalis
      if (visas > maks) return null
      return uzdavinys('trupmenos-su-matais', {
        // Kiek dalių pažymėta, matyti tik brėžinyje.
        klausimas: `Visa juosta yra ${visas} cm ilgio. Kiek centimetrų sudaro nuspalvinta dalis?`,
        atsakymas: String(dalis * vienaDalis),
        atsakymasRodymui: `$${dalis * vienaDalis}$ cm`,
        sprendimas: `Viena dalis yra $${visas} : ${daliu} = ${vienaDalis}$ cm, o nuspalvinta ${dalis}: $${vienaDalis} \\cdot ${dalis} = ${
          dalis * vienaDalis
        }$.`,
        brezinys: trupmenosJuosta(daliu, dalis),
      })
    },

    // 5. Dvi dalys ir likutis
    () => {
      const v = 6
      const vienaDalis = atsitiktinis(3, 10)
      const visas = v * vienaDalis
      if (visas > maks) return null
      const pirma = 2
      const antra = 1
      return uzdavinys('trupmenos-su-matais', {
        klausimas: `Lentyna yra ${visas} cm ilgio. $${tr(pirma, v)}$ užima knygos, $${tr(
          antra,
          v,
        )}$ — žurnalai. Kiek centimetrų lieka laisva?`,
        atsakymas: String(visas - (pirma + antra) * vienaDalis),
        atsakymasRodymui: `$${visas - (pirma + antra) * vienaDalis}$ cm`,
        sprendimas: `Viena dalis $${visas} : ${v} = ${vienaDalis}$ cm. Užimta $${
          pirma + antra
        } \\cdot ${vienaDalis} = ${(pirma + antra) * vienaDalis}$, liko $${visas} - ${
          (pirma + antra) * vienaDalis
        } = ${visas - (pirma + antra) * vienaDalis}$.`,
      })
    },

    // 6. Iš litrų
    () => {
      const v = atsitiktinis(3, 6)
      const vienaDalis = atsitiktinis(2, 8)
      const visas = v * vienaDalis
      return uzdavinys('trupmenos-su-matais', {
        klausimas: `Inde yra ${visas} l vandens. Išpilta $${tr(1, v)}$ viso kiekio. Kiek litrų išpilta?`,
        atsakymas: String(vienaDalis),
        atsakymasRodymui: `$${vienaDalis}$ l`,
        sprendimas: `$${visas} : ${v} = ${vienaDalis}$.`,
      })
    },

    // 7. Kurį veiksmą atlikti pirmiausia
    () =>
      pasirinkimoUzdavinys(naujasId('trupmenos-su-matais'), 'trupmenos-su-matais', {
        klausimas: `Ką reikia rasti pirmiausia, skaičiuojant $${tr(
          skaitiklis,
          vardiklis,
        )}$ nuo ${visuma}?`,
        variantai: [
          `vieną dalį: $${visuma} : ${vardiklis}$`,
          `sandaugą $${visuma} \\cdot ${skaitiklis}$`,
          `skirtumą $${visuma} - ${vardiklis}$`,
        ],
        teisingas: 0,
        sprendimas: 'Pirmiausia randama viena dalis, tada ji dauginama iš skaitiklio.',
      }),
  ])
}

// ── 9.5 Visumos radimas iš dalies ───────────────────────────────────────────

const A_VISUMA = [
  {
    klausimas: '$\\dfrac{1}{4}$ visų lipdukų yra 8 lipdukai. Kiek lipdukų yra iš viso?',
    atsakymas: '32',
    atsakymasRodymui: '$32$',
    sprendimas: '$8 \\cdot 4 = 32$.',
  },
] as const

export const visumosRadimas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkVisuma(sritis), A_VISUMA, 'visumos-radimas')

function kurkVisuma(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const vardiklis = atsitiktinis(3, 9)
  const viena = atsitiktinis(3, 12)
  const visuma = vardiklis * viena
  if (visuma > maks) return null
  const skaitiklis = atsitiktinis(2, vardiklis - 1)

  return variacija([
    // 1. Iš vienos dalies
    () =>
      uzdavinys('visumos-radimas', {
        klausimas: `$${tr(1, vardiklis)}$ visų lipdukų yra ${viena} lipdukai. Kiek lipdukų iš viso?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `Viena dalis yra ${viena}, o dalių ${vardiklis}: $${viena} \\cdot ${vardiklis} = ${visuma}$.`,
      }),

    // 2. Iš kelių dalių
    () =>
      uzdavinys('visumos-radimas', {
        klausimas: `$${tr(skaitiklis, vardiklis)}$ visų kamuoliukų sudaro ${
          viena * skaitiklis
        } kamuoliukai. Kiek kamuoliukų iš viso?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `Viena dalis $${viena * skaitiklis} : ${skaitiklis} = ${viena}$, tad visuma $${viena} \\cdot ${vardiklis} = ${visuma}$.`,
      }),

    // 3. Iš juostos brėžinio
    () => {
      const daliu = pasirink([4, 5, 6])
      const pazymeta = atsitiktinis(2, daliu - 1)
      const vienaDalis = atsitiktinis(3, 12)
      if (daliu * vienaDalis > maks) return null
      return uzdavinys('visumos-radimas', {
        klausimas: `Nuspalvintos juostos dalys kartu sudaro ${
          pazymeta * vienaDalis
        }. Kiek sudaro visa juosta?`,
        atsakymas: String(daliu * vienaDalis),
        atsakymasRodymui: `$${daliu * vienaDalis}$`,
        sprendimas: `Nuspalvinta ${pazymeta} dalys, tad viena dalis $${
          pazymeta * vienaDalis
        } : ${pazymeta} = ${vienaDalis}$, o visa juosta $${vienaDalis} \\cdot ${daliu} = ${
          daliu * vienaDalis
        }$.`,
        brezinys: trupmenosJuosta(daliu, pazymeta),
      })
    },

    // 4. Kokia veiksmų tvarka
    () =>
      pasirinkimoUzdavinys(naujasId('visumos-radimas'), 'visumos-radimas', {
        klausimas: `$${tr(3, 8)}$ viso skaičiaus yra 18. Kurį veiksmą reikia atlikti pirmiausia?`,
        variantai: ['$18 : 3$ — rasti vieną dalį', '$18 \\cdot 3$', '$18 - 8$'],
        teisingas: 0,
        sprendimas: 'Pirmiausia randama viena dalis, tada ji dauginama iš vardiklio.',
      }),

    // 5. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('visumos-radimas'), 'visumos-radimas', {
        klausimas: `Mokinys teigia: jei $${tr(
          3,
          5,
        )}$ visumos yra 24, tai visuma lygi $24 \\cdot 5$. Ko trūksta jo sprendime?`,
        variantai: [
          'pirmiausia reikėjo rasti vieną dalį: $24 : 3 = 8$',
          'reikėjo dalyti iš 5',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: 'Teisingai: $24 : 3 = 8$, tada $8 \\cdot 5 = 40$.',
      }),

    // 6. Du žingsniai
    () => {
      const v = 3
      const dalis = atsitiktinis(4, 12)
      const visa = dalis * v
      const kitaDalis = 6
      if (visa % kitaDalis !== 0 || visa > maks) return null
      return uzdavinys('visumos-radimas', {
        klausimas: `Klasėje $${tr(2, v)}$ mokinių yra ${
          dalis * 2
        } vaikai. Kiek mokinių lanko muziką, jei muziką lanko $${tr(1, kitaDalis)}$ visų?`,
        atsakymas: String(visa / kitaDalis),
        atsakymasRodymui: `$${visa / kitaDalis}$`,
        sprendimas: `Viena dalis $${dalis * 2} : 2 = ${dalis}$, visa klasė $${dalis} \\cdot ${v} = ${visa}$, tad $${visa} : ${kitaDalis} = ${
          visa / kitaDalis
        }$.`,
      })
    },

    // 7. Iš ilgio
    () =>
      uzdavinys('visumos-radimas', {
        klausimas: `$${tr(vardiklis - 1, vardiklis)}$ viso ilgio yra ${
          viena * (vardiklis - 1)
        } cm. Koks visas ilgis?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$ cm`,
        sprendimas: `Viena dalis $${viena * (vardiklis - 1)} : ${vardiklis - 1} = ${viena}$, tad visas ilgis $${viena} \\cdot ${vardiklis} = ${visuma}$.`,
      }),
  ])
}

// ── 9.6 Tinkamo sprendimo būdo pasirinkimas ─────────────────────────────────

const A_BUDO_PASIRINKIMAS = [
  {
    klausimas: 'Knygoje 64 puslapiai, perskaityta $\\dfrac{1}{8}$. Kurį veiksmą pasirinktum?',
    atsakymas: 'A',
    atsakymasRodymui: 'A — $64 : 8$',
    sprendimas: 'Dalis randama dalyba iš vardiklio.',
  },
] as const

export const budoPasirinkimas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkBudoPasirinkima(sritis), A_BUDO_PASIRINKIMAS, 'budo-pasirinkimas')

function kurkBudoPasirinkima(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const vardiklis = atsitiktinis(3, 9)
  const viena = atsitiktinis(3, 12)
  const visuma = vardiklis * viena
  if (visuma > maks) return null
  const skaitiklis = atsitiktinis(2, vardiklis - 1)

  return variacija([
    // 1. Kurį veiksmą pasirinkti
    () =>
      pasirinkimoUzdavinys(naujasId('budo-pasirinkimas'), 'budo-pasirinkimas', {
        klausimas: `Knygoje ${visuma} puslapiai, perskaityta $${tr(
          1,
          vardiklis,
        )}$. Kurį veiksmą pasirinktum?`,
        variantai: [
          `$${visuma} : ${vardiklis}$`,
          `$${visuma} \\cdot ${vardiklis}$`,
          `$${visuma} - ${vardiklis}$`,
        ],
        teisingas: 0,
        sprendimas: 'Ieškoma dalis, tad visuma dalijama iš vardiklio.',
      }),

    // 2. Dalies ar visumos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('budo-pasirinkimas'), 'budo-pasirinkimas', {
        klausimas: `Uždavinyje reikia rasti nežinomą visumą, kai $${tr(
          1,
          vardiklis,
        )}$ jos yra ${viena}. Ką darysi?`,
        variantai: [
          `dauginsiu: $${viena} \\cdot ${vardiklis}$`,
          `dalysiu: $${viena} : ${vardiklis}$`,
          `atimsiu: $${viena} - ${vardiklis}$`,
        ],
        teisingas: 0,
        sprendimas: 'Iš vienos dalies visuma randama daugyba iš vardiklio.',
      }),

    // 3. Teisingas planas
    () => {
      const dalis = viena * skaitiklis
      return pasirinkimoUzdavinys(naujasId('budo-pasirinkimas'), 'budo-pasirinkimas', {
        klausimas: `Duota: $${tr(
          skaitiklis,
          vardiklis,
        )}$ skaičiaus yra ${dalis}. Kuris planas teisingas?`,
        variantai: [
          `A) $${dalis} : ${skaitiklis}$, tada $\\cdot\\, ${vardiklis}$`,
          `B) $${dalis} \\cdot ${skaitiklis}$, tada $:\\, ${vardiklis}$`,
          `C) $${dalis} + ${skaitiklis} + ${vardiklis}$`,
        ],
        teisingas: 0,
        sprendimas: `Pirmiausia viena dalis $${dalis} : ${skaitiklis} = ${viena}$, tada visuma $${viena} \\cdot ${vardiklis} = ${visuma}$.`,
      })
    },

    // 4. Klaidingas būdas
    () =>
      pasirinkimoUzdavinys(naujasId('budo-pasirinkimas'), 'budo-pasirinkimas', {
        klausimas: `Mokinys $${tr(3, 4)}$ iš 28 skaičiavo $28 : 3 \\cdot 4$. Kodėl būdas netinka?`,
        variantai: [
          'dalyti reikia iš vardiklio 4, o dauginti iš skaitiklio 3',
          'reikėjo iš karto dauginti iš 28',
          'būdas tinka',
        ],
        teisingas: 0,
        sprendimas: 'Teisingai: $28 : 4 = 7$, tada $7 \\cdot 3 = 21$.',
      }),

    // 5. Kelių žingsnių planas
    () => {
      const v = 5
      const vienaDalis = atsitiktinis(4, 12)
      const visa = v * vienaDalis
      if (visa > maks) return null
      return uzdavinys('budo-pasirinkimas', {
        klausimas: `Reikia rasti $${tr(2, v)}$ iš ${visa}, o paskui likutį. Koks bus likutis?`,
        atsakymas: String(visa - 2 * vienaDalis),
        atsakymasRodymui: `$${visa - 2 * vienaDalis}$`,
        sprendimas: `$${visa} : ${v} = ${vienaDalis}$, dalis $${vienaDalis} \\cdot 2 = ${
          2 * vienaDalis
        }$, likutis $${visa} - ${2 * vienaDalis} = ${visa - 2 * vienaDalis}$.`,
      })
    },

    // 6. Kodėl dalyba, o ne daugyba
    () =>
      pasirinkimoUzdavinys(naujasId('budo-pasirinkimas'), 'budo-pasirinkimas', {
        klausimas: `Kodėl uždaviniui „${visuma} saldainiai padalyti po lygiai ${vardiklis} vaikams“ tinka dalyba?`,
        variantai: [
          'nes visuma skaidoma į lygias dalis',
          'nes ieškoma visuma',
          'nes saldainių skaičius didėja',
        ],
        teisingas: 0,
        sprendimas: 'Dalyba naudojama tada, kai žinoma visuma ir ieškoma vienos dalies.',
      }),

    // 7. Kuri schema tinka
    () =>
      pasirinkimoUzdavinys(naujasId('budo-pasirinkimas'), 'budo-pasirinkimas', {
        klausimas: `Kuri schema tinka uždaviniui „$${tr(
          skaitiklis,
          vardiklis,
        )}$ visumos yra ${viena * skaitiklis}“?`,
        variantai: [
          `juosta, padalyta į ${vardiklis} dalis, iš kurių ${skaitiklis} pažymėtos`,
          `juosta, padalyta į ${skaitiklis} dalis`,
          `dvi juostos, kurių viena ilgesnė ${vardiklis} vienetais`,
        ],
        teisingas: 0,
        sprendimas: 'Vardiklis rodo, į kiek dalių dalijama, o skaitiklis — kiek jų pažymėta.',
      }),
  ])
}

// ── 9.7 Atsakymo pagrindimas ────────────────────────────────────────────────

const A_PAGRINDIMAS = [
  {
    klausimas: 'Iš 48 obuolių $\\dfrac{1}{6}$ yra žali. Mokinys gavo 8. Kiek gausi patikrindamas veiksmu $8 \\cdot 6$?',
    atsakymas: '48',
    atsakymasRodymui: '$48$',
    sprendimas: 'Turi gautis pradinis kiekis.',
  },
] as const

export const atsakymoPagrindimas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkPagrindima(sritis), A_PAGRINDIMAS, 'atsakymo-pagrindimas')

function kurkPagrindima(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const vardiklis = atsitiktinis(3, 8)
  const viena = atsitiktinis(3, 12)
  const visuma = vardiklis * viena
  if (visuma > maks) return null
  const skaitiklis = atsitiktinis(2, vardiklis - 1)

  return variacija([
    // 1. Patikrinimas daugyba
    () =>
      uzdavinys('atsakymo-pagrindimas', {
        klausimas: `Iš ${visuma} obuolių $${tr(
          1,
          vardiklis,
        )}$ yra žali; gauta ${viena}. Kiek gausi patikrindamas veiksmu $${viena} \\cdot ${vardiklis}$?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `Turi gautis pradinis kiekis: $${viena} \\cdot ${vardiklis} = ${visuma}$.`,
      }),

    // 2. Ar atsakymas gali būti didesnis už visumą
    () =>
      pasirinkimoUzdavinys(naujasId('atsakymo-pagrindimas'), 'atsakymo-pagrindimas', {
        klausimas: `Uždavinyje pradinis kiekis buvo ${visuma}, o mokinys ieškodamas dalies gavo ${
          visuma + viena
        }. Ką tai rodo?`,
        variantai: [
          'atsakymas klaidingas — dalis negali būti didesnė už visumą',
          'atsakymas teisingas',
          'negalima nuspręsti',
        ],
        teisingas: 0,
        sprendimas: 'Skaičiaus dalis visada mažesnė už patį skaičių.',
      }),

    // 3. Patikrinimas dalyba
    () =>
      uzdavinys('atsakymo-pagrindimas', {
        klausimas: `${visuma} lipdukai padalyti po ${vardiklis}; gauta ${viena} grupės. Kiek gausi patikrindamas veiksmu $${viena} \\cdot ${vardiklis}$?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `Turi gautis pradinis lipdukų skaičius: $${viena} \\cdot ${vardiklis} = ${visuma}$.`,
      }),

    // 4. Kiek liko — pagrindimas
    () =>
      uzdavinys('atsakymo-pagrindimas', {
        klausimas: `Turėta ${visuma} eurų, išleista $${tr(
          skaitiklis,
          vardiklis,
        )}$ sumos. Kiek eurų liko?`,
        atsakymas: String(visuma - viena * skaitiklis),
        atsakymasRodymui: `$${visuma - viena * skaitiklis}$`,
        sprendimas: `Išleista $${viena} \\cdot ${skaitiklis} = ${
          viena * skaitiklis
        }$, tad liko $${visuma} - ${viena * skaitiklis} = ${visuma - viena * skaitiklis}$.`,
      }),

    // 5. Du patikrinimo būdai
    () =>
      pasirinkimoUzdavinys(naujasId('atsakymo-pagrindimas'), 'atsakymo-pagrindimas', {
        klausimas: `$${tr(1, vardiklis)}$ kelio yra ${viena} km, o mokinys atsakė, kad visas kelias ${visuma} km. Kuris patikrinimas tinka?`,
        variantai: [
          `$${visuma} : ${vardiklis} = ${viena}$`,
          `$${visuma} - ${viena}$`,
          `$${viena} : ${vardiklis}$`,
        ],
        teisingas: 0,
        sprendimas: 'Radus visumą, iš jos atgal galima rasti tą pačią dalį.',
      }),

    // 6. Ar užtenka vien skaičiaus
    () =>
      pasirinkimoUzdavinys(naujasId('atsakymo-pagrindimas'), 'atsakymo-pagrindimas', {
        klausimas: `Uždavinyje gauta ${viena * skaitiklis}. Kodėl vien šio skaičiaus atsakymui neužtenka?`,
        variantai: [
          'reikia pasakyti, ką tas skaičius reiškia: panaudota ar liko',
          'nes skaičius per mažas',
          'nes atsakymas visada turi būti didesnis už visumą',
        ],
        teisingas: 0,
        sprendimas: 'Atsakymas turi atsakyti į uždavinio klausimą, o ne tik pateikti skaičių.',
      }),

    // 7. Ar dalis mažesnė už visumą
    () =>
      uzdavinys('atsakymo-pagrindimas', {
        klausimas: `Virvė ${visuma} m, panaudota $${tr(
          1,
          vardiklis,
        )}$. Keliais metrais panaudota dalis mažesnė už visą virvę?`,
        atsakymas: String(visuma - viena),
        atsakymasRodymui: `$${visuma - viena}$ m`,
        sprendimas: `Panaudota $${visuma} : ${vardiklis} = ${viena}$ m, tad skirtumas $${visuma} - ${viena} = ${
          visuma - viena
        }$.`,
      }),
  ])
}

// ── 9.8 Uždavinys keliais būdais ────────────────────────────────────────────

const A_KELI_BUDAI = [
  {
    klausimas: 'Apskaičiuok $\\dfrac{3}{4}$ iš 32.',
    atsakymas: '24',
    atsakymasRodymui: '$24$',
    sprendimas: '$32 : 4 = 8$, tada $8 \\cdot 3 = 24$.',
  },
] as const

export const keliBudai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkKeliusBudus(sritis), A_KELI_BUDAI, 'keli-budai')

function kurkKeliusBudus(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const vardiklis = atsitiktinis(3, 8)
  const viena = atsitiktinis(3, 12)
  const visuma = vardiklis * viena
  if (visuma > maks) return null
  const skaitiklis = atsitiktinis(2, vardiklis - 1)

  return variacija([
    // 1. Dalis dviem būdais
    () =>
      uzdavinys('keli-budai', {
        klausimas: `Apskaičiuok $${tr(
          skaitiklis,
          vardiklis,
        )}$ iš ${visuma}. Patikrink dviem būdais: dalydamas į lygias dalis ir naudodamas schemą.`,
        atsakymas: String(viena * skaitiklis),
        atsakymasRodymui: `$${viena * skaitiklis}$`,
        sprendimas: `Pirmas būdas: $${visuma} : ${vardiklis} = ${viena}$, tada $${viena} \\cdot ${skaitiklis} = ${
          viena * skaitiklis
        }$. Antras: juostoje pažymimos ${skaitiklis} dalys po ${viena}.`,
        brezinys: trupmenosJuosta(vardiklis, skaitiklis),
      }),

    // 2. Daugyba ir pakartotinė sudėtis
    () => {
      const grupiu = atsitiktinis(3, 6)
      const kiekvienoje = atsitiktinis(4, 9)
      return uzdavinys('keli-budai', {
        klausimas: `${grupiu} dėžės po ${kiekvienoje} kamuoliukus. Kiek kamuoliukų iš viso? Patikrink daugyba ir pakartotine sudėtimi.`,
        atsakymas: String(grupiu * kiekvienoje),
        atsakymasRodymui: `$${grupiu * kiekvienoje}$`,
        sprendimas: `Daugyba: $${grupiu} \\cdot ${kiekvienoje} = ${
          grupiu * kiekvienoje
        }$. Sudėtimi: $${Array(grupiu).fill(kiekvienoje).join(' + ')} = ${grupiu * kiekvienoje}$.`,
      })
    },

    // 3. Atimtis dviem būdais
    () => {
      const a = atsitiktinis(40, 90)
      const b = atsitiktinis(11, 39)
      return uzdavinys('keli-budai', {
        klausimas: `Apskaičiuok $${a} - ${b}$ dviem būdais: atimdamas po dalimis ir suapvalindamas atėminį.`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$`,
        sprendimas: `Pirmas būdas: $${a} - ${Math.floor(b / 10) * 10} = ${
          a - Math.floor(b / 10) * 10
        }$, tada $- ${b % 10}$. Antras: $${a} - ${Math.ceil(b / 10) * 10} = ${
          a - Math.ceil(b / 10) * 10
        }$, tada $+ ${Math.ceil(b / 10) * 10 - b}$.`,
      })
    },

    // 4. Dviejų žingsnių uždavinys
    () => {
      const vaiku = atsitiktinis(4, 8)
      const kiekvienam = atsitiktinis(5, 12)
      const suvalge = atsitiktinis(1, 3)
      return uzdavinys('keli-budai', {
        klausimas: `${vaiku * kiekvienam} saldainiai padalyti po lygiai ${vaiku} vaikams, paskui kiekvienas suvalgė po ${suvalge}. Kiek saldainių liko iš viso?`,
        atsakymas: String(vaiku * (kiekvienam - suvalge)),
        atsakymasRodymui: `$${vaiku * (kiekvienam - suvalge)}$`,
        sprendimas: `Pirmas būdas: kiekvienam liko $${kiekvienam} - ${suvalge} = ${
          kiekvienam - suvalge
        }$, tad $${vaiku} \\cdot ${kiekvienam - suvalge} = ${
          vaiku * (kiekvienam - suvalge)
        }$. Antras: $${vaiku * kiekvienam} - ${vaiku} \\cdot ${suvalge} = ${
          vaiku * (kiekvienam - suvalge)
        }$.`,
      })
    },

    // 5. Iš juostos brėžinio
    () => {
      const daliu = 5
      const dalis = 3
      const vienaDalis = atsitiktinis(4, 12)
      if (daliu * vienaDalis > maks) return null
      return uzdavinys('keli-budai', {
        klausimas: `Visa juosta atitinka ${daliu * vienaDalis}. Kiek atitinka nuspalvinta dalis?`,
        atsakymas: String(dalis * vienaDalis),
        atsakymasRodymui: `$${dalis * vienaDalis}$`,
        sprendimas: `Viena dalis $${daliu * vienaDalis} : ${daliu} = ${vienaDalis}$, tad $${vienaDalis} \\cdot ${dalis} = ${
          dalis * vienaDalis
        }$.`,
        brezinys: trupmenosJuosta(daliu, dalis),
      })
    },

    // 6. Kiek dalyvauja ir kiek stebi
    () => {
      const v = 5
      const vienaDalis = atsitiktinis(3, 9)
      const visa = v * vienaDalis
      return uzdavinys('keli-budai', {
        klausimas: `$${tr(3, v)}$ visų ${visa} mokinių dalyvauja varžybose, likusieji stebi. Kiek mokinių stebi?`,
        atsakymas: String(2 * vienaDalis),
        atsakymasRodymui: `$${2 * vienaDalis}$`,
        sprendimas: `Pirmas būdas: dalyvauja $${vienaDalis} \\cdot 3 = ${
          3 * vienaDalis
        }$, stebi $${visa} - ${3 * vienaDalis} = ${
          2 * vienaDalis
        }$. Antras: stebi $${tr(2, v)}$, tad $${vienaDalis} \\cdot 2 = ${2 * vienaDalis}$.`,
      })
    },

    // 7. Patogus sudėties būdas
    () => {
      const a = atsitiktinis(180, 480)
      const b = atsitiktinis(120, 320)
      if (a + b > maks) return null
      const iki = Math.ceil(a / 100) * 100
      return uzdavinys('keli-budai', {
        klausimas: `Apskaičiuok $${a} + ${b}$ dviem būdais: stulpeliu ir patogiai pridedant iki ${iki}.`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Patogus būdas: $${a} + ${iki - a} = ${iki}$, tada $${iki} + ${
          b - (iki - a)
        } = ${a + b}$.`,
      })
    },
  ])
}

// ── 9.9 Trupmenų modelis ────────────────────────────────────────────────────

const A_MODELIS = [
  {
    klausimas: '12 cm juosta padalyta į 4 lygias dalis. Kiek centimetrų sudaro viena dalis?',
    atsakymas: '3',
    atsakymasRodymui: '$3$ cm',
    sprendimas: '$12 : 4 = 3$.',
  },
] as const

export const trupmenuModelis: Generatorius = () =>
  suBandymais(kurkModeli, A_MODELIS, 'trupmenu-modelis')

function kurkModeli(): Uzdavinys | null {
  return variacija([
    // 1. Viena dalis juostoje
    () => {
      const daliu = pasirink([3, 4, 6])
      const viena = atsitiktinis(2, 6)
      const ilgis = daliu * viena
      return uzdavinys('trupmenu-modelis', {
        klausimas: `${ilgis} cm juosta padalyta į ${daliu} lygias dalis. Kiek centimetrų sudaro viena dalis?`,
        atsakymas: String(viena),
        atsakymasRodymui: `$${viena}$ cm`,
        sprendimas: `$${ilgis} : ${daliu} = ${viena}$.`,
      })
    },

    // 2. Kiek langelių nuspalvinti
    () => {
      const eiluciu = 4
      const stulpeliu = 6
      const viso = eiluciu * stulpeliu
      const vardiklis = pasirink([3, 4, 6, 8])
      if (viso % vardiklis !== 0) return null
      const skaitiklis = atsitiktinis(1, vardiklis - 1)
      return uzdavinys('trupmenu-modelis', {
        klausimas: `Modelį sudaro ${viso} vienodi langeliai. Kiek langelių reikia nuspalvinti, kad būtų pavaizduota $${tr(
          skaitiklis,
          vardiklis,
        )}$ modelio?`,
        atsakymas: String((viso / vardiklis) * skaitiklis),
        atsakymasRodymui: `$${(viso / vardiklis) * skaitiklis}$`,
        sprendimas: `Viena dalis $${viso} : ${vardiklis} = ${
          viso / vardiklis
        }$ langelių, tad $${viso / vardiklis} \\cdot ${skaitiklis} = ${
          (viso / vardiklis) * skaitiklis
        }$.`,
      })
    },

    // 3. Kiek dalių nuspalvinta modelyje
    () => {
      const daliu = pasirink([4, 6, 8])
      const nuspalvinta = atsitiktinis(1, daliu - 1)
      return uzdavinys('trupmenu-modelis', {
        // Nuspalvintų dalių skaičių reikia suskaičiuoti modelyje.
        klausimas: 'Kiek modelio dalių nuspalvinta?',
        atsakymas: String(nuspalvinta),
        atsakymasRodymui: `$${nuspalvinta}$`,
        sprendimas: `Modelis padalytas į ${daliu} lygias dalis, iš jų nuspalvintos ${nuspalvinta}.`,
        brezinys: trupmenosJuosta(daliu, nuspalvinta),
      })
    },

    // 4. Netinkamas modelis
    () =>
      pasirinkimoUzdavinys(naujasId('trupmenu-modelis'), 'trupmenu-modelis', {
        klausimas: `Mokinys padalijo apskritimą į 5 nevienodas dalis ir vieną pavadino $${tr(
          1,
          5,
        )}$. Kodėl modelis netinka?`,
        variantai: [
          'trupmenos dalys turi būti lygios',
          'apskritimo dalyti negalima',
          'penkių dalių per mažai',
        ],
        teisingas: 0,
        sprendimas: 'Vardiklis reiškia lygias dalis, tad nelygios dalys trupmenos nesudaro.',
      }),

    // 5. Tas pats modelis, kelios trupmenos
    () =>
      pasirinkimoUzdavinys(naujasId('trupmenu-modelis'), 'trupmenu-modelis', {
        klausimas: 'Kokia dalis nuspalvinta apskritime?',
        variantai: [`$${tr(1, 2)}$`, `$${tr(1, 4)}$`, `$${tr(3, 4)}$`],
        teisingas: 0,
        sprendimas: `Nuspalvinta pusė, o tai tas pats kaip $${tr(2, 4)}$ ar $${tr(4, 8)}$.`,
        brezinys: trupmenosApskritimas(8, 4),
      }),

    // 6. Iš kelių kvadratėlių sudėti dalį
    () => {
      const viso = pasirink([12, 18, 24])
      const vardiklis = pasirink([3, 6])
      return uzdavinys('trupmenu-modelis', {
        klausimas: `Modelis sudėtas iš ${viso} vienodų kvadratėlių. Kiek kvadratėlių sudaro $${tr(
          1,
          vardiklis,
        )}$ modelio?`,
        atsakymas: String(viso / vardiklis),
        atsakymasRodymui: `$${viso / vardiklis}$`,
        sprendimas: `$${viso} : ${vardiklis} = ${viso / vardiklis}$.`,
      })
    },

    // 7. Dvi figūros su ta pačia dalimi
    () =>
      pasirinkimoUzdavinys(naujasId('trupmenu-modelis'), 'trupmenu-modelis', {
        klausimas: `Kokios turi būti dvi skirtingos figūros, kad abiejose būtų nuspalvinta $${tr(
          2,
          3,
        )}$?`,
        variantai: [
          'abi padalytos į 3 lygias dalis, nuspalvintos po 2',
          'abi padalytos į 2 dalis, nuspalvinta po 3',
          'viena padalyta į 3, kita į 5 dalis',
        ],
        teisingas: 0,
        sprendimas: 'Vardiklis rodo lygių dalių skaičių, skaitiklis — kiek jų nuspalvinta.',
      }),
  ])
}
