import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { D, VARDAI, eurais, eurais10, kiek } from './ketvirtokams-bendra'
import {
  desimtainiuJuosta,
  desimtainiuKvadratas,
  kainuLentele,
  misriojoModelis,
  misriuTiese,
} from './ketvirtokams-trupmenu-vaizdai'
import { dviJuostos, trupmenosApskritimas, trupmenosJuosta } from './treciokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 4 klasės tema „Mišrieji ir dešimtainiai skaičiai“ — trylika potemių.
 *
 * Anksčiau jos rėmėsi `trupmenu-sudetis`, `desimtaines`, `pinigai` ir
 * `apvalinimas` generatoriais, skirtais 5–8 klasėms: pasitaikydavo skirtingų
 * vardiklių, neigiamų trupmenų ir tūkstantųjų dalių, kurių ketvirtoje klasėje
 * dar nėra.
 *
 * Visa tema laikosi ant vienos minties: mišrusis skaičius, trupmena ir
 * dešimtainis užrašas žymi tą patį dydį. Todėl kone kiekvienoje potemėje yra
 * pavidalas, kur tas pats dydis prašomas užrašyti kitaip, ir pavidalas, kur
 * dydį reikia nuskaityti nuo modelio.
 */

/** Trupmena KaTeX užrašui. */
function tr(skaitiklis: number, vardiklis: number): string {
  return `\\dfrac{${skaitiklis}}{${vardiklis}}`
}

/** Mišrusis skaičius KaTeX užrašui. */
function mis(sveikas: number, skaitiklis: number, vardiklis: number): string {
  return skaitiklis === 0 ? String(sveikas) : `${sveikas}${tr(skaitiklis, vardiklis)}`
}

/** Dešimtainis skaičius su lietuvišku kableliu. */
function des(x: number): string {
  return String(x).replace('.', '{,}')
}

/** Dešimtosios dalys iš skaičiaus dešimtųjų: 34 → „3{,}4“. */
function desDes(desimtosios: number): string {
  return `${Math.floor(desimtosios / 10)}{,}${desimtosios % 10}`
}

const VARDIKLIAI = [4, 5, 6, 8, 10] as const

// ── 2.1 Ką žinau apie trupmenas? ────────────────────────────────────────────

const T1 = 'trupmenos-kartojimas-4'

const A_TRUPMENOS = [
  {
    klausimas: 'Kuri trupmena didesnė: $\\dfrac{3}{8}$ ar $\\dfrac{5}{8}$?',
    atsakymas: '5/8',
    atsakymasRodymui: '$\\dfrac{5}{8}$',
    sprendimas: 'Vardikliai vienodi, tad didesnė ta, kurios skaitiklis didesnis.',
  },
] as const

export const trupmenosKartojimas4: Generatorius = () => suBandymais(kurkTrupmenas, A_TRUPMENOS, T1)

function kurkTrupmenas(): Uzdavinys | null {
  const vardiklis = pasirink(VARDIKLIAI)

  return variacija([
    // 1. Vienodų vardiklių palyginimas
    () => {
      const a = atsitiktinis(1, vardiklis - 1)
      const b = atsitiktinis(1, vardiklis - 1)
      if (a === b) return null
      const didesnis = Math.max(a, b)
      return uzdavinys(T1, {
        klausimas: `Kuri trupmena didesnė: $${tr(a, vardiklis)}$ ar $${tr(b, vardiklis)}$?`,
        atsakymas: `${didesnis}/${vardiklis}`,
        atsakymasRodymui: `$${tr(didesnis, vardiklis)}$`,
        sprendimas: 'Vardikliai vienodi, tad dalys vienodo dydžio — didesnė ta trupmena, kurios dalių daugiau.',
      })
    },

    // 2. Trupmena iš apskritimo modelio
    () => {
      const nuspalvinta = atsitiktinis(1, vardiklis - 1)
      return uzdavinys(T1, {
        klausimas: 'Kokia trupmena nuspalvinta?',
        atsakymas: `${nuspalvinta}/${vardiklis}`,
        atsakymasRodymui: `$${tr(nuspalvinta, vardiklis)}$`,
        sprendimas: `Apskritimas padalytas į ${vardiklis} lygias dalis, nuspalvintos ${nuspalvinta}.`,
        brezinys: trupmenosApskritimas(vardiklis, nuspalvinta),
      })
    },

    // 3. Lygi trupmena
    () => {
      const kartas = pasirink([2, 3])
      const a = atsitiktinis(1, vardiklis - 1)
      return uzdavinys(T1, {
        klausimas: `Rask lygią trupmeną: $${tr(a, vardiklis)} = \\dfrac{\\square}{${vardiklis * kartas}}$.`,
        atsakymas: String(a * kartas),
        atsakymasRodymui: `$${a * kartas}$`,
        sprendimas: `Vardiklis padidėjo ${kartas} kartus, tad tiek pat kartų padidėja ir skaitiklis: $${a} \\cdot ${kartas} = ${a * kartas}$.`,
      })
    },

    // 4. Rikiavimas
    () => {
      const trys = sumaisyk([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x < vardiklis)).slice(0, 3)
      if (trys.length < 3) return null
      const eile = [...trys].sort((a, b) => a - b)
      return eiliskumoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Surikiuok trupmenas didėjimo tvarka.',
        teisingaEile: eile.map((x) => `$${tr(x, vardiklis)}$`),
        sprendimas: 'Vardikliai vienodi, tad rikiuojama pagal skaitiklius.',
      })
    },

    // 5. Trupmena iš juostos
    () => {
      const daliu = pasirink([8, 10, 12])
      const nuspalvinta = atsitiktinis(2, daliu - 2)
      return uzdavinys(T1, {
        klausimas: 'Kokia trupmena pavaizduota juosta?',
        atsakymas: `${nuspalvinta}/${daliu}`,
        atsakymasRodymui: `$${tr(nuspalvinta, daliu)}$`,
        sprendimas: `Juosta padalyta į ${daliu} lygias dalis, nuspalvintos ${nuspalvinta}.`,
        brezinys: trupmenosJuosta(daliu, nuspalvinta),
      })
    },

    // 6. Skirtingų vardiklių palyginimas su juostomis
    () => {
      const a = { daliu: 4, nuspalvinta: 3 }
      const b = { daliu: 8, nuspalvinta: pasirink([5, 7]) }
      const pirmoji = a.nuspalvinta / a.daliu
      const antroji = b.nuspalvinta / b.daliu
      if (pirmoji === antroji) return null
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuri iš pavaizduotų trupmenų didesnė?',
        variantai:
          pirmoji > antroji
            ? [`$${tr(a.nuspalvinta, a.daliu)}$`, `$${tr(b.nuspalvinta, b.daliu)}$`, 'trupmenos lygios']
            : [`$${tr(b.nuspalvinta, b.daliu)}$`, `$${tr(a.nuspalvinta, a.daliu)}$`, 'trupmenos lygios'],
        teisingas: 0,
        sprendimas: 'Juostos vienodo ilgio, tad palyginti galima iš nuspalvintos dalies ilgio.',
        brezinys: dviJuostos(a, b),
      })
    },

    // 7. Klaidos radimas: lyginami tik skaitikliai
    () =>
      uzdavinys(T1, {
        klausimas: `Mokinys sako, kad $${tr(2, 3)}$ mažiau už $${tr(3, 5)}$, nes 2 mažiau už 3. Kuri trupmena iš tikrųjų didesnė?`,
        atsakymas: '2/3',
        atsakymasRodymui: `$${tr(2, 3)}$`,
        sprendimas: `Iš vienodo ilgio juostų matyti, kad $${tr(2, 3)}$ nuspalvinta dalis ilgesnė. Vien skaitiklius lyginti galima tik tada, kai vardikliai vienodi — čia jie skirtingi, tad ir dalys nevienodo dydžio.`,
        brezinys: dviJuostos({ daliu: 3, nuspalvinta: 2 }, { daliu: 5, nuspalvinta: 3 }),
      }),

    // 8. Trupmena tarp dviejų duotų
    () => {
      const a = atsitiktinis(2, 5)
      const b = a + atsitiktinis(2, 3)
      if (b > 9) return null
      return uzdavinys(T1, {
        klausimas: `Užrašyk mažiausią trupmeną su vardikliu 10, kuri didesnė už $${tr(a, 10)}$, bet mažesnė už $${tr(b, 10)}$.`,
        atsakymas: `${a + 1}/10`,
        atsakymasRodymui: `$${tr(a + 1, 10)}$`,
        sprendimas: `Tinka skaitikliai nuo ${a + 1} iki ${b - 1}; mažiausia iš jų — $${tr(a + 1, 10)}$.`,
      })
    },
  ])
}

// ── 2.2 Tekstiniai uždaviniai su trupmenomis ────────────────────────────────

const T2 = 'trupmenu-tekstiniai-4'

const A_TRUPMENU_TEKSTINIAI = [
  {
    klausimas: 'Lenta 24 cm ilgio. $\\dfrac{1}{3}$ jos nudažyta. Kiek centimetrų nudažyta?',
    atsakymas: '8',
    atsakymasRodymui: '$8$ cm',
    sprendimas: '$24 : 3 = 8$.',
  },
] as const

export const trupmenuTekstiniai4: Generatorius = () =>
  suBandymais(kurkTrupmenuTekstini, A_TRUPMENU_TEKSTINIAI, T2)

function kurkTrupmenuTekstini(): Uzdavinys | null {
  const vardiklis = pasirink([3, 4, 5, 6, 8])
  const dalis = atsitiktinis(4, 18)
  const visuma = dalis * vardiklis
  const vardas = pasirink(VARDAI)

  return variacija([
    // 1. Viena dalis
    () =>
      uzdavinys(T2, {
        klausimas: `Lenta ${visuma} cm ilgio. $${tr(1, vardiklis)}$ jos nudažyta. Kiek centimetrų nudažyta?`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$ cm`,
        sprendimas: `$${visuma} : ${vardiklis} = ${dalis}$.`,
      }),

    // 2. Kelios dalys
    () => {
      const skaitiklis = atsitiktinis(2, vardiklis - 1)
      return uzdavinys(T2, {
        klausimas: `Iš ${kiek(visuma, D.knygos)} $${tr(skaitiklis, vardiklis)}$ yra apie gyvūnus. Kiek tokių knygų?`,
        atsakymas: String(dalis * skaitiklis),
        atsakymasRodymui: `$${dalis * skaitiklis}$`,
        sprendimas: `Viena dalis: $${visuma} : ${vardiklis} = ${dalis}$. Tokių dalių ${skaitiklis}: $${dalis} \\cdot ${skaitiklis} = ${dalis * skaitiklis}$.`,
      })
    },

    // 3. Kiek liko
    () => {
      const skaitiklis = atsitiktinis(2, vardiklis - 1)
      return uzdavinys(T2, {
        klausimas: `Takelis ${visuma} m ilgio. Išgrįsta $${tr(skaitiklis, vardiklis)}$ jo. Kiek metrų liko išgrįsti?`,
        atsakymas: String(visuma - dalis * skaitiklis),
        atsakymasRodymui: `$${visuma - dalis * skaitiklis}$ m`,
        sprendimas: `Išgrįsta $${dalis} \\cdot ${skaitiklis} = ${dalis * skaitiklis}$ m, liko $${visuma} - ${dalis * skaitiklis} = ${visuma - dalis * skaitiklis}$ m.`,
      })
    },

    // 4. Atvirkštinis: rasti visumą
    () =>
      uzdavinys(T2, {
        klausimas: `$${tr(1, vardiklis)}$ klasės mokinių yra ${kiek(dalis, D.mokiniai)}. Kiek mokinių klasėje?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `Viena dalis yra ${dalis}, o visumą sudaro ${vardiklis} tokios dalys: $${dalis} \\cdot ${vardiklis} = ${visuma}$.`,
      }),

    // 5. Dvi dalys iš tos pačios visumos
    () => {
      const tinkami = [3, 4, 6].filter((x) => x !== vardiklis && visuma % x === 0)
      if (tinkami.length === 0) return null
      const antrasVardiklis = pasirink(tinkami)
      const pirma = visuma / vardiklis
      const antra = visuma / antrasVardiklis
      if (pirma + antra >= visuma) return null
      return uzdavinys(T2, {
        klausimas: `Iš ${kiek(visuma, D.eurus)} $${tr(1, vardiklis)}$ išleista ledams, o $${tr(1, antrasVardiklis)}$ — bilietams. Kiek eurų liko?`,
        atsakymas: String(visuma - pirma - antra),
        atsakymasRodymui: `$${visuma - pirma - antra}$ Eur`,
        sprendimas: `Ledams $${pirma}$ Eur, bilietams $${antra}$ Eur, liko $${visuma} - ${pirma} - ${antra} = ${visuma - pirma - antra}$ Eur.`,
      })
    },

    // 6. Dalis su juostos brėžiniu
    () => {
      const skaitiklis = atsitiktinis(2, vardiklis - 1)
      return uzdavinys(T2, {
        klausimas: `Visa juosta yra ${visuma} cm ilgio. Kiek centimetrų sudaro nuspalvinta dalis?`,
        atsakymas: String(dalis * skaitiklis),
        atsakymasRodymui: `$${dalis * skaitiklis}$ cm`,
        sprendimas: `Juosta padalyta į ${vardiklis} lygias dalis po $${visuma} : ${vardiklis} = ${dalis}$ cm; nuspalvintos ${skaitiklis}.`,
        brezinys: trupmenosJuosta(vardiklis, skaitiklis),
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: `${vardas} skaičiuoja: „$${tr(1, vardiklis)}$ nuo ${visuma} yra $${visuma} \\cdot ${vardiklis}$.“ Užrašyk teisingą atsakymą.`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `Dalis randama dalijant, o ne dauginant: $${visuma} : ${vardiklis} = ${dalis}$.`,
      }),
  ])
}

// ── 2.3 Kas yra mišrieji skaičiai? ──────────────────────────────────────────

const T3 = 'misrieji-skaiciai'

const A_MISRIEJI = [
  {
    klausimas: 'Kokį skaičių sudaro 2 sveiki ir $\\dfrac{3}{5}$?',
    atsakymas: '2 3/5',
    atsakymasRodymui: '$2\\dfrac{3}{5}$',
    sprendimas: 'Sveikoji dalis rašoma prieš trupmeną.',
  },
] as const

export const misriejiSkaiciai: Generatorius = () => suBandymais(kurkMisriuosius, A_MISRIEJI, T3)

function kurkMisriuosius(): Uzdavinys | null {
  const vardiklis = pasirink(VARDIKLIAI)
  const sveikas = atsitiktinis(2, 6)
  const skaitiklis = atsitiktinis(1, vardiklis - 1)

  return variacija([
    // 1. Iš aprašymo į užrašą
    () =>
      uzdavinys(T3, {
        klausimas: `Kokį skaičių sudaro ${sveikas} sveiki ir $${tr(skaitiklis, vardiklis)}$?`,
        atsakymas: `${sveikas} ${skaitiklis}/${vardiklis}`,
        atsakymasRodymui: `$${mis(sveikas, skaitiklis, vardiklis)}$`,
        sprendimas: 'Mišrusis skaičius rašomas sveikąją dalį pastačius prieš trupmeną.',
      }),

    // 2. Iš modelio
    () =>
      uzdavinys(T3, {
        klausimas: 'Koks mišrusis skaičius pavaizduotas?',
        atsakymas: `${sveikas} ${skaitiklis}/${vardiklis}`,
        atsakymasRodymui: `$${mis(sveikas, skaitiklis, vardiklis)}$`,
        sprendimas: `Pilnai nuspalvinti ${sveikas} apskritimai, o paskutiniame nuspalvintos ${skaitiklis} dalys iš ${vardiklis}.`,
        brezinys: misriojoModelis(sveikas, skaitiklis, vardiklis),
      }),

    // 3. Trupmeninė dalis
    () =>
      uzdavinys(T3, {
        klausimas: `Kokia yra mišriojo skaičiaus $${mis(sveikas, skaitiklis, vardiklis)}$ trupmeninė dalis?`,
        atsakymas: `${skaitiklis}/${vardiklis}`,
        atsakymasRodymui: `$${tr(skaitiklis, vardiklis)}$`,
        sprendimas: `Sveikoji dalis yra ${sveikas}, trupmeninė — $${tr(skaitiklis, vardiklis)}$.`,
      }),

    // 4. Mišrusis → netaisyklinga trupmena
    () =>
      uzdavinys(T3, {
        klausimas: `Užrašyk netaisyklingą trupmeną, lygią $${mis(sveikas, skaitiklis, vardiklis)}$.`,
        atsakymas: `${sveikas * vardiklis + skaitiklis}/${vardiklis}`,
        atsakymasRodymui: `$${tr(sveikas * vardiklis + skaitiklis, vardiklis)}$`,
        sprendimas: `Kiekvienas sveikasis yra ${vardiklis} dalys: $${sveikas} \\cdot ${vardiklis} + ${skaitiklis} = ${sveikas * vardiklis + skaitiklis}$.`,
      }),

    // 5. Rikiavimas
    () => {
      const trys = [
        { s: sveikas, k: 1 },
        { s: sveikas, k: vardiklis - 1 },
        { s: sveikas + 1, k: 1 },
      ]
      return eiliskumoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Surikiuok mišriuosius skaičius didėjimo tvarka.',
        teisingaEile: trys.map((x) => `$${mis(x.s, x.k, vardiklis)}$`),
        sprendimas: 'Pirmiausia lyginamos sveikosios dalys; jei jos vienodos — trupmeninės.',
      })
    },

    // 6. Palyginimas su skirtingais vardikliais
    () => {
      // Vardikliai imami tik iš 4 klasėje naudojamų — dvigubinant 8 gautųsi 16,
      // o šešioliktųjų dalių šioje klasėje dar nėra.
      const kitasVardiklis = vardiklis * 2
      if (!(VARDIKLIAI as readonly number[]).includes(kitasVardiklis)) return null
      const kitasSkaitiklis = skaitiklis * 2 - 1
      if (kitasSkaitiklis < 1) return null
      const pirmoji = skaitiklis / vardiklis
      const antroji = kitasSkaitiklis / kitasVardiklis
      if (pirmoji === antroji) return null
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Kuris mišrusis skaičius didesnis: $${mis(sveikas, skaitiklis, vardiklis)}$ ar $${mis(sveikas, kitasSkaitiklis, kitasVardiklis)}$?`,
        variantai:
          pirmoji > antroji
            ? [
                `$${mis(sveikas, skaitiklis, vardiklis)}$`,
                `$${mis(sveikas, kitasSkaitiklis, kitasVardiklis)}$`,
                'skaičiai lygūs',
              ]
            : [
                `$${mis(sveikas, kitasSkaitiklis, kitasVardiklis)}$`,
                `$${mis(sveikas, skaitiklis, vardiklis)}$`,
                'skaičiai lygūs',
              ],
        teisingas: 0,
        sprendimas: `Sveikosios dalys vienodos. $${tr(skaitiklis, vardiklis)}$ yra tiek pat, kiek $${tr(skaitiklis * 2, kitasVardiklis)}$, tad lyginama su $${tr(kitasSkaitiklis, kitasVardiklis)}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T3, {
        klausimas: `Rask klaidą ir užrašyk teisingą trupmeną: $${mis(2, skaitiklis, vardiklis)} = ${tr(2 + skaitiklis, vardiklis)}$.`,
        atsakymas: `${2 * vardiklis + skaitiklis}/${vardiklis}`,
        atsakymasRodymui: `$${tr(2 * vardiklis + skaitiklis, vardiklis)}$`,
        sprendimas: `Sveikieji ne pridedami prie skaitiklio, o verčiami dalimis: $2 \\cdot ${vardiklis} + ${skaitiklis} = ${2 * vardiklis + skaitiklis}$.`,
      }),

    // 8. Skaičius tarp mišriojo ir sveikojo
    () =>
      uzdavinys(T3, {
        klausimas: `Užrašyk mažiausią mišrųjį skaičių su vardikliu ${vardiklis}, kuris didesnis už $${mis(sveikas, 1, vardiklis)}$, bet mažesnis už ${sveikas + 1}.`,
        atsakymas: `${sveikas} 2/${vardiklis}`,
        atsakymasRodymui: `$${mis(sveikas, 2, vardiklis)}$`,
        sprendimas: `Sveikoji dalis lieka ${sveikas}, o mažiausia už $${tr(1, vardiklis)}$ didesnė trupmena su tuo pačiu vardikliu yra $${tr(2, vardiklis)}$.`,
      }),
  ])
}

// ── 2.4 Mišrusis skaičius skaičių tiesėje ───────────────────────────────────

const T4 = 'misrieji-tieseje'

const A_MISRIEJI_TIESE = [
  {
    klausimas: 'Kurį mišrųjį skaičių žymi taškas, esantis trečioje padaloje po 1, kai vienetas padalytas į 4 dalis?',
    atsakymas: '1 3/4',
    atsakymasRodymui: '$1\\dfrac{3}{4}$',
    sprendimas: 'Po vieneto praeitos trys ketvirtosios dalys.',
  },
] as const

export const misriejiTieseje: Generatorius = () => suBandymais(kurkMisriuosiusTieseje, A_MISRIEJI_TIESE, T4)

function kurkMisriuosiusTieseje(): Uzdavinys | null {
  const vardiklis = pasirink([2, 4, 5, 8] as const)
  const iki = vardiklis >= 8 ? 3 : 4
  const sveikas = atsitiktinis(1, iki - 1)
  const skaitiklis = atsitiktinis(1, vardiklis - 1)

  return variacija([
    // 1. Nustatyti taško reikšmę
    () =>
      uzdavinys(T4, {
        klausimas: 'Kokį mišrųjį skaičių žymi taškas?',
        atsakymas: `${sveikas} ${skaitiklis}/${vardiklis}`,
        atsakymasRodymui: `$${mis(sveikas, skaitiklis, vardiklis)}$`,
        sprendimas: `Kiekvienas vienetas padalytas į ${vardiklis} dalis; taškas stovi ${skaitiklis} dalis už ${sveikas}.`,
        brezinys: misriuTiese(0, iki, vardiklis, [{ daliu: sveikas * vardiklis + skaitiklis }]),
      }),

    // 2. Kelinta padala žymi duotą skaičių
    () =>
      uzdavinys(T4, {
        klausimas: `Kelinta padala po ${sveikas} žymi skaičių $${mis(sveikas, skaitiklis, vardiklis)}$?`,
        atsakymas: String(skaitiklis),
        atsakymasRodymui: `$${skaitiklis}$-oji`,
        sprendimas: `Trupmeninė dalis yra $${tr(skaitiklis, vardiklis)}$, tad tai ${skaitiklis}-oji padala po ${sveikas}.`,
        brezinys: misriuTiese(0, iki, vardiklis),
      }),

    // 3. Prie kurio sveikojo arčiau
    () => {
      if (skaitiklis * 2 === vardiklis) return null
      const arciauZemesnio = skaitiklis * 2 < vardiklis
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Prie kurio sveikojo skaičiaus arčiau yra $${mis(sveikas, skaitiklis, vardiklis)}$?`,
        variantai: arciauZemesnio
          ? [String(sveikas), String(sveikas + 1), 'vienodai nutolęs nuo abiejų']
          : [String(sveikas + 1), String(sveikas), 'vienodai nutolęs nuo abiejų'],
        teisingas: 0,
        sprendimas: `Trupmeninė dalis $${tr(skaitiklis, vardiklis)}$ yra ${arciauZemesnio ? 'mažesnė' : 'didesnė'} už pusę, tad taškas arčiau ${arciauZemesnio ? sveikas : sveikas + 1}.`,
        brezinys: misriuTiese(0, iki, vardiklis, [{ daliu: sveikas * vardiklis + skaitiklis }]),
      })
    },

    // 4. Klaidos radimas
    () => {
      if (skaitiklis < 2) return null
      return uzdavinys(T4, {
        klausimas: `Mokinys skaičių $${mis(sveikas, skaitiklis, vardiklis)}$ pažymėjo ties pirmąja padala po ${sveikas}. Kelinta padala turėjo būti pažymėta?`,
        atsakymas: String(skaitiklis),
        atsakymasRodymui: `$${skaitiklis}$-oji`,
        sprendimas: `Trupmeninė dalis yra $${tr(skaitiklis, vardiklis)}$, tad reikia ${skaitiklis}-osios padalos, o ne pirmosios.`,
        brezinys: misriuTiese(0, iki, vardiklis, [{ daliu: sveikas * vardiklis + 1, raide: '✗' }]),
      })
    },

    // 5. Rikiavimas pagal vietą tiesėje
    () => {
      const keturi = [
        { s: sveikas, k: 1 },
        { s: sveikas, k: vardiklis - 1 },
        { s: sveikas + 1, k: 1 },
      ]
      return eiliskumoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Surikiuok pagal vietą skaičių tiesėje — nuo kairiausio iki dešiniausio.',
        teisingaEile: keturi.map((x) => `$${mis(x.s, x.k, vardiklis)}$`),
        sprendimas: 'Kuo skaičius didesnis, tuo jis tiesėje dešiniau.',
        brezinys: misriuTiese(0, iki, vardiklis),
      })
    },

    // 6. Dviejų taškų skirtumas dalimis
    () => {
      const kitas = sveikas * vardiklis + skaitiklis + atsitiktinis(2, vardiklis)
      if (kitas > iki * vardiklis) return null
      return uzdavinys(T4, {
        klausimas: 'Per kiek padalų taškas B nutolęs nuo taško A?',
        atsakymas: String(kitas - (sveikas * vardiklis + skaitiklis)),
        atsakymasRodymui: `$${kitas - (sveikas * vardiklis + skaitiklis)}$`,
        sprendimas: `Suskaičiuojamos padalos tarp taškų — jų ${kitas - (sveikas * vardiklis + skaitiklis)}.`,
        brezinys: misriuTiese(0, iki, vardiklis, [
          { daliu: sveikas * vardiklis + skaitiklis, raide: 'A' },
          { daliu: kitas, raide: 'B' },
        ]),
      })
    },

    // 7. Kiek padalų tarp dviejų sveikųjų
    () =>
      uzdavinys(T4, {
        klausimas: 'Į kiek lygių dalių padalytas kiekvienas vienetas šioje skaičių tiesėje?',
        atsakymas: String(vardiklis),
        atsakymasRodymui: `$${vardiklis}$`,
        sprendimas: 'Suskaičiuojamos padalos tarp dviejų gretimų sveikųjų skaičių.',
        brezinys: misriuTiese(0, iki, vardiklis),
      }),
  ])
}

// ── 2.5 Kaip apvalinti mišriuosius skaičius? ────────────────────────────────

const T5 = 'misriuju-apvalinimas'

const A_APVALINIMAS = [
  {
    klausimas: 'Apvalink iki sveikojo skaičiaus: $3\\dfrac{1}{10}$.',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Trupmeninė dalis mažesnė už pusę, tad sveikoji dalis nesikeičia.',
  },
] as const

export const misriujuApvalinimas: Generatorius = () => suBandymais(kurkApvalinima, A_APVALINIMAS, T5)

/** Mišriojo skaičiaus apvalinimas iki sveikojo: pusė apvalinama į viršų. */
function apvalink(sveikas: number, skaitiklis: number, vardiklis: number): number {
  return skaitiklis * 2 >= vardiklis ? sveikas + 1 : sveikas
}

function kurkApvalinima(): Uzdavinys | null {
  const sveikas = atsitiktinis(2, 8)

  return variacija([
    // 1. Į apačią
    () => {
      const k = atsitiktinis(1, 4)
      return uzdavinys(T5, {
        klausimas: `Apvalink iki sveikojo skaičiaus: $${mis(sveikas, k, 10)}$.`,
        atsakymas: String(sveikas),
        atsakymasRodymui: `$${sveikas}$`,
        sprendimas: `$${tr(k, 10)}$ yra mažiau nei pusė, tad apvalinama į apačią.`,
      })
    },

    // 2. Į viršų
    () => {
      const k = atsitiktinis(6, 9)
      return uzdavinys(T5, {
        klausimas: `Apvalink iki sveikojo skaičiaus: $${mis(sveikas, k, 10)}$.`,
        atsakymas: String(sveikas + 1),
        atsakymasRodymui: `$${sveikas + 1}$`,
        sprendimas: `$${tr(k, 10)}$ yra daugiau nei pusė, tad apvalinama į viršų.`,
      })
    },

    // 3. Lygiai pusė
    () =>
      uzdavinys(T5, {
        klausimas: `Apvalink iki artimiausio sveikojo skaičiaus: $${mis(sveikas, 1, 2)}$.`,
        atsakymas: String(sveikas + 1),
        atsakymasRodymui: `$${sveikas + 1}$`,
        sprendimas: `Skaičius vienodai nutolęs nuo ${sveikas} ir ${sveikas + 1}; sutarta apvalinti į viršų, tad gaunama ${sveikas + 1}.`,
      }),

    // 4. Kuris po apvalinimo didesnis
    () => {
      const a = atsitiktinis(1, 4)
      const b = atsitiktinis(6, 9)
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kuris skaičius po apvalinimo iki sveikojo didesnis: $${mis(sveikas, a, 10)}$ ar $${mis(sveikas, b, 10)}$?`,
        variantai: [`$${mis(sveikas, b, 10)}$`, `$${mis(sveikas, a, 10)}$`, 'po apvalinimo jie lygūs'],
        teisingas: 0,
        sprendimas: `Pirmasis apvalinamas iki ${sveikas}, antrasis — iki ${sveikas + 1}.`,
      })
    },

    // 5. Kodėl pusė apvalinama į viršų
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kodėl $${mis(6, 5, 10)}$ apvalinant iki sveikojo gaunama 7?`,
        variantai: [
          'nes trupmeninė dalis yra lygiai pusė, o pusė apvalinama į viršų',
          'nes 5 yra nelyginis skaičius',
          'nes sveikoji dalis yra lyginė',
          'nes vardiklis yra 10',
        ],
        teisingas: 0,
        sprendimas: `$${tr(5, 10)}$ yra lygiai pusė — skaičius vienodai nutolęs nuo 6 ir 7, tad taikoma sutartis apvalinti į viršų.`,
      }),

    // 6. Klaidos radimas
    () => {
      const k = atsitiktinis(6, 9)
      return uzdavinys(T5, {
        klausimas: `Mokinys apvalino $${mis(sveikas, k, 10)}$ iki ${sveikas}. Užrašyk teisingą atsakymą.`,
        atsakymas: String(sveikas + 1),
        atsakymasRodymui: `$${sveikas + 1}$`,
        sprendimas: `$${tr(k, 10)}$ didesnė už pusę, tad sveikoji dalis padidėja vienetu: ${sveikas + 1}.`,
      })
    },

    // 7. Kiek skaičių apvalinama iki duoto
    () =>
      uzdavinys(T5, {
        klausimas: `Kiek yra mišriųjų skaičių su dešimtosiomis dalimis (nuo $${mis(sveikas - 1, 1, 10)}$ iki $${mis(sveikas, 9, 10)}$), kurie apvalinami iki ${sveikas}?`,
        atsakymas: '9',
        atsakymasRodymui: '$9$',
        sprendimas: `Tinka $${mis(sveikas - 1, 5, 10)}$ … $${mis(sveikas - 1, 9, 10)}$ (5 skaičiai) ir $${mis(sveikas, 1, 10)}$ … $${mis(sveikas, 4, 10)}$ (4 skaičiai) — iš viso 9.`,
      }),

    // 8. Rikiavimas pagal apvalintą reikšmę
    () => {
      const trys = [
        { s: sveikas, k: 2 },
        { s: sveikas, k: 8 },
        { s: sveikas + 1, k: 7 },
      ]
      return eiliskumoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Surikiuok skaičius pagal jų apvalintą iki sveikojo reikšmę — nuo mažiausios iki didžiausios.',
        teisingaEile: trys.map((x) => `$${mis(x.s, x.k, 10)}$`),
        sprendimas: `Apvalintos reikšmės: ${trys.map((x) => apvalink(x.s, x.k, 10)).join(', ')}.`,
      })
    },
  ])
}

// ── 2.6 Kaip sudėti ir atimti trupmenas? ────────────────────────────────────

const T6 = 'trupmenu-sudetis-4'

const A_TRUPMENU_SUDETIS = [
  {
    klausimas: 'Apskaičiuok: $\\dfrac{2}{8} + \\dfrac{3}{8}$.',
    atsakymas: '5/8',
    atsakymasRodymui: '$\\dfrac{5}{8}$',
    sprendimas: 'Vardiklis nesikeičia, sudedami skaitikliai.',
  },
] as const

export const trupmenuSudetis4: Generatorius = () =>
  suBandymais(kurkTrupmenuSudeti, A_TRUPMENU_SUDETIS, T6)

function kurkTrupmenuSudeti(): Uzdavinys | null {
  const vardiklis = pasirink([5, 6, 8, 10, 12])
  const a = atsitiktinis(1, vardiklis - 2)
  const b = atsitiktinis(1, vardiklis - a - 1)

  return variacija([
    // 1. Sudėtis
    () =>
      uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${tr(a, vardiklis)} + ${tr(b, vardiklis)}$.`,
        atsakymas: `${a + b}/${vardiklis}`,
        atsakymasRodymui: `$${tr(a + b, vardiklis)}$`,
        sprendimas: `Dalys vienodo dydžio, tad sudedami tik skaitikliai: $${a} + ${b} = ${a + b}$.`,
      }),

    // 2. Atimtis
    () =>
      uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${tr(a + b, vardiklis)} - ${tr(b, vardiklis)}$.`,
        atsakymas: `${a}/${vardiklis}`,
        atsakymasRodymui: `$${tr(a, vardiklis)}$`,
        sprendimas: `$${a + b} - ${b} = ${a}$, vardiklis nesikeičia.`,
      }),

    // 3. Trūkstamas dėmuo
    () =>
      uzdavinys(T6, {
        klausimas: `Rask trūkstamą trupmeną: $${tr(a, vardiklis)} + \\dfrac{\\square}{${vardiklis}} = ${tr(a + b, vardiklis)}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${a + b} - ${a} = ${b}$.`,
      }),

    // 4. Iki vieneto
    () =>
      uzdavinys(T6, {
        klausimas: `Kiek trūksta iki vieneto: $${tr(a, vardiklis)} + \\dfrac{\\square}{${vardiklis}} = 1$?`,
        atsakymas: String(vardiklis - a),
        atsakymasRodymui: `$${vardiklis - a}$`,
        sprendimas: `Vienetas yra $${tr(vardiklis, vardiklis)}$, tad trūksta $${vardiklis} - ${a} = ${vardiklis - a}$ dalių.`,
      }),

    // 5. Klaidos radimas: sudėti ir vardikliai
    () =>
      uzdavinys(T6, {
        klausimas: `Rask klaidą ir užrašyk teisingą sumą: $${tr(a, vardiklis)} + ${tr(b, vardiklis)} = ${tr(a + b, vardiklis * 2)}$.`,
        atsakymas: `${a + b}/${vardiklis}`,
        atsakymasRodymui: `$${tr(a + b, vardiklis)}$`,
        sprendimas: 'Vardikliai nesudedami — jie rodo dalies dydį, o dalys nuo sudėties nesumažėja.',
      }),

    // 6. Trys dėmenys
    () => {
      const c = atsitiktinis(1, Math.max(1, vardiklis - a - b))
      if (a + b + c > vardiklis) return null
      return uzdavinys(T6, {
        klausimas: `Apskaičiuok: $${tr(a, vardiklis)} + ${tr(b, vardiklis)} + ${tr(c, vardiklis)}$.`,
        atsakymas: `${a + b + c}/${vardiklis}`,
        atsakymasRodymui: `$${tr(a + b + c, vardiklis)}$`,
        sprendimas: `$${a} + ${b} + ${c} = ${a + b + c}$.`,
      })
    },

    // 7. Tekstinis
    () => {
      const vardas = pasirink(VARDAI)
      return uzdavinys(T6, {
        klausimas: `${vardas} suvalgė $${tr(a, vardiklis)}$ picos, o brolis — $${tr(b, vardiklis)}$. Kokia picos dalis liko?`,
        atsakymas: `${vardiklis - a - b}/${vardiklis}`,
        atsakymasRodymui: `$${tr(vardiklis - a - b, vardiklis)}$`,
        sprendimas: `Suvalgyta $${tr(a + b, vardiklis)}$, liko $${tr(vardiklis, vardiklis)} - ${tr(a + b, vardiklis)} = ${tr(vardiklis - a - b, vardiklis)}$.`,
        brezinys: trupmenosJuosta(vardiklis, a + b),
      })
    },
  ])
}

// ── 2.7 Kaip sudėti ir atimti mišriuosius skaičius? ─────────────────────────

const T7 = 'misriuju-sudetis'

const A_MISRIUJU_SUDETIS = [
  {
    klausimas: 'Apskaičiuok: $2\\dfrac{1}{4} + 1\\dfrac{2}{4}$.',
    atsakymas: '3 3/4',
    atsakymasRodymui: '$3\\dfrac{3}{4}$',
    sprendimas: 'Sveikieji su sveikaisiais, trupmenos su trupmenomis.',
  },
] as const

export const misriujuSudetis: Generatorius = () =>
  suBandymais(kurkMisriujuSudeti, A_MISRIUJU_SUDETIS, T7)

/** Mišrusis skaičius iš dalių skaičiaus. */
function isDaliu(daliu: number, vardiklis: number): { s: number; k: number } {
  return { s: Math.floor(daliu / vardiklis), k: daliu % vardiklis }
}

function kurkMisriujuSudeti(): Uzdavinys | null {
  const vardiklis = pasirink([4, 5, 8, 10])
  const s1 = atsitiktinis(2, 6)
  const s2 = atsitiktinis(1, 3)
  const k1 = atsitiktinis(1, vardiklis - 1)
  const k2 = atsitiktinis(1, vardiklis - 1)

  return variacija([
    // 1. Sudėtis be perėjimo
    () => {
      if (k1 + k2 >= vardiklis) return null
      const r = isDaliu((s1 + s2) * vardiklis + k1 + k2, vardiklis)
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok: $${mis(s1, k1, vardiklis)} + ${mis(s2, k2, vardiklis)}$.`,
        atsakymas: `${r.s} ${r.k}/${vardiklis}`,
        atsakymasRodymui: `$${mis(r.s, r.k, vardiklis)}$`,
        sprendimas: `Sveikieji: $${s1} + ${s2} = ${s1 + s2}$; trupmenos: $${tr(k1, vardiklis)} + ${tr(k2, vardiklis)} = ${tr(k1 + k2, vardiklis)}$.`,
      })
    },

    // 2. Atimtis be ardymo
    () => {
      if (k1 <= k2) return null
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok: $${mis(s1, k1, vardiklis)} - ${mis(s2, k2, vardiklis)}$.`,
        atsakymas: `${s1 - s2} ${k1 - k2}/${vardiklis}`,
        atsakymasRodymui: `$${mis(s1 - s2, k1 - k2, vardiklis)}$`,
        sprendimas: `Sveikieji: $${s1} - ${s2} = ${s1 - s2}$; trupmenos: $${tr(k1, vardiklis)} - ${tr(k2, vardiklis)} = ${tr(k1 - k2, vardiklis)}$.`,
      })
    },

    // 3. Sudėtis su perėjimu per sveikąjį
    () => {
      if (k1 + k2 <= vardiklis) return null
      const r = isDaliu((s1 + s2) * vardiklis + k1 + k2, vardiklis)
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok: $${mis(s1, k1, vardiklis)} + ${mis(s2, k2, vardiklis)}$.`,
        atsakymas: `${r.s} ${r.k}/${vardiklis}`,
        atsakymasRodymui: `$${mis(r.s, r.k, vardiklis)}$`,
        sprendimas: `Trupmenų suma $${tr(k1 + k2, vardiklis)}$ didesnė už vienetą, tad iš jos išskiriamas sveikasis: $${tr(k1 + k2, vardiklis)} = 1${tr(k1 + k2 - vardiklis, vardiklis)}$. Iš viso $${mis(r.s, r.k, vardiklis)}$.`,
      })
    },

    // 4. Atimtis ardant sveikąjį
    () => {
      if (k1 >= k2 || s1 <= s2) return null
      const r = isDaliu((s1 - s2 - 1) * vardiklis + (k1 + vardiklis - k2), vardiklis)
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok: $${mis(s1, k1, vardiklis)} - ${mis(s2, k2, vardiklis)}$.`,
        atsakymas: `${r.s} ${r.k}/${vardiklis}`,
        atsakymasRodymui: `$${mis(r.s, r.k, vardiklis)}$`,
        sprendimas: `Trupmenos atimti negalima, tad vienas sveikasis ardomas į $${tr(vardiklis, vardiklis)}$: $${mis(s1, k1, vardiklis)} = ${s1 - 1}${tr(k1 + vardiklis, vardiklis)}$. Tada $${mis(r.s, r.k, vardiklis)}$.`,
      })
    },

    // 5. Klaidos radimas
    () =>
      uzdavinys(T7, {
        klausimas: `Rask klaidą ir užrašyk teisingą sumą: $${mis(2, 3, 4)} + ${mis(1, 2, 4)} = ${mis(3, 5, 8)}$.`,
        atsakymas: '4 1/4',
        atsakymasRodymui: `$${mis(4, 1, 4)}$`,
        sprendimas: `Vardikliai nesudedami. $${tr(3, 4)} + ${tr(2, 4)} = ${tr(5, 4)} = 1${tr(1, 4)}$, tad suma yra $${mis(4, 1, 4)}$.`,
      }),

    // 6. Trys veiksmai
    () => {
      const k3 = atsitiktinis(1, vardiklis - 1)
      const daliu = s1 * vardiklis + k1 - (s2 * vardiklis + k2) + k3
      if (daliu <= 0 || s1 * vardiklis + k1 < s2 * vardiklis + k2) return null
      const r = isDaliu(daliu, vardiklis)
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok: $${mis(s1, k1, vardiklis)} - ${mis(s2, k2, vardiklis)} + ${tr(k3, vardiklis)}$.`,
        atsakymas: `${r.s} ${r.k}/${vardiklis}`,
        atsakymasRodymui: `$${mis(r.s, r.k, vardiklis)}$`,
        sprendimas: `Veiksmai atliekami iš eilės; patogiausia viską skaičiuoti dalimis po $${tr(1, vardiklis)}$.`,
      })
    },

    // 7. Tekstinis
    () => {
      const vardas = pasirink(VARDAI)
      if (k1 + k2 >= vardiklis) return null
      const r = isDaliu((s1 + s2) * vardiklis + k1 + k2, vardiklis)
      return uzdavinys(T7, {
        klausimas: `${vardas} nubėgo $${mis(s1, k1, vardiklis)}$ km, o kitą dieną — $${mis(s2, k2, vardiklis)}$ km. Kiek kilometrų nubėgta iš viso?`,
        atsakymas: `${r.s} ${r.k}/${vardiklis}`,
        atsakymasRodymui: `$${mis(r.s, r.k, vardiklis)}$ km`,
        sprendimas: `$${mis(s1, k1, vardiklis)} + ${mis(s2, k2, vardiklis)} = ${mis(r.s, r.k, vardiklis)}$.`,
      })
    },

    // 8. Rezultatų palyginimas
    () => {
      const suma = (s1 + s2) * vardiklis + k1 + k2
      const skirtumas = s1 * vardiklis + k1 - k2
      if (suma === skirtumas) return null
      return pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Kurio veiksmo rezultatas didesnis: $${mis(s1, k1, vardiklis)} + ${mis(s2, k2, vardiklis)}$ ar $${mis(s1, k1, vardiklis)} - ${tr(k2, vardiklis)}$?`,
        variantai: [
          `$${mis(s1, k1, vardiklis)} + ${mis(s2, k2, vardiklis)}$`,
          `$${mis(s1, k1, vardiklis)} - ${tr(k2, vardiklis)}$`,
          'rezultatai lygūs',
        ],
        teisingas: 0,
        sprendimas: 'Prie to paties skaičiaus pridėjus gaunama daugiau nei iš jo atėmus — skaičiuoti nebūtina.',
      })
    },
  ])
}

// ── 2.8 Kas yra dešimtainiai skaičiai? ──────────────────────────────────────

const T8 = 'desimtainiai-skaiciai-4'

const A_DESIMTAINIAI = [
  {
    klausimas: 'Kuris skaičius didesnis: $2{,}4$ ar $2{,}8$?',
    atsakymas: '2.8',
    atsakymasRodymui: '$2{,}8$',
    sprendimas: 'Sveikosios dalys lygios, tad lyginamos dešimtosios: 8 daugiau už 4.',
  },
] as const

export const desimtainiaiSkaiciai4: Generatorius = () =>
  suBandymais(kurkDesimtainius, A_DESIMTAINIAI, T8)

function kurkDesimtainius(): Uzdavinys | null {
  const sveikas = atsitiktinis(1, 8)
  const desimtosios = atsitiktinis(1, 9)

  return variacija([
    // 1. Dešimtųjų skaitmuo
    () =>
      uzdavinys(T8, {
        klausimas: `Koks yra skaičiaus $${des(sveikas + desimtosios / 10)}$ dešimtųjų skaitmuo?`,
        atsakymas: String(desimtosios),
        atsakymasRodymui: `$${desimtosios}$`,
        sprendimas: 'Po kablelio rašomos dešimtosios dalys.',
      }),

    // 2. Iš žodžių
    () =>
      uzdavinys(T8, {
        klausimas: `Užrašyk dešimtainį skaičių: ${sveikas} sveiki ir ${desimtosios} dešimtosios.`,
        atsakymas: String(sveikas + desimtosios / 10),
        atsakymasRodymui: `$${des(sveikas + desimtosios / 10)}$`,
        sprendimas: 'Sveikoji dalis rašoma prieš kablelį, dešimtosios — po jo.',
      }),

    // 3. Palyginimas
    () => {
      const kitos = atsitiktinis(1, 9)
      if (kitos === desimtosios) return null
      const a = sveikas + desimtosios / 10
      const b = sveikas + kitos / 10
      return uzdavinys(T8, {
        klausimas: `Kuris skaičius didesnis: $${des(a)}$ ar $${des(b)}$?`,
        atsakymas: String(Math.max(a, b)),
        atsakymasRodymui: `$${des(Math.max(a, b))}$`,
        sprendimas: 'Sveikosios dalys vienodos, tad lyginamos dešimtosios.',
      })
    },

    // 4. Iš juostos modelio
    () =>
      uzdavinys(T8, {
        klausimas: 'Kokį dešimtainį skaičių rodo modelis?',
        atsakymas: String(desimtosios / 10),
        atsakymasRodymui: `$${des(desimtosios / 10)}$`,
        sprendimas: `Juosta padalyta į 10 dalių, nuspalvintos ${desimtosios} — tai $${tr(desimtosios, 10)}$, arba $${des(desimtosios / 10)}$.`,
        brezinys: desimtainiuJuosta(desimtosios),
      }),

    // 5. Rikiavimas su šimtosiomis
    () => {
      const eile = [sveikas + 7 / 100, sveikas + 5 / 10, sveikas + 7 / 10, sveikas + 75 / 100]
      return eiliskumoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Surikiuok dešimtainius skaičius didėjimo tvarka.',
        teisingaEile: eile.map((x) => `$${des(Number(x.toFixed(2)))}$`),
        sprendimas: `Pirmiausia lyginamos dešimtosios: 0 mažiau už 5 ir 7. Tarp $${des(sveikas + 0.7)}$ ir $${des(sveikas + 0.75)}$ didesnis antrasis, nes turi dar 5 šimtąsias.`,
      })
    },

    // 6. Skaičius tarp dviejų
    () => {
      if (desimtosios > 8) return null
      return uzdavinys(T8, {
        klausimas: `Užrašyk mažiausią šimtosiomis išreikštą skaičių, kuris didesnis už $${des(sveikas + desimtosios / 10)}$, bet mažesnis už $${des(sveikas + (desimtosios + 1) / 10)}$.`,
        atsakymas: String(Number((sveikas + desimtosios / 10 + 0.01).toFixed(2))),
        atsakymasRodymui: `$${des(Number((sveikas + desimtosios / 10 + 0.01).toFixed(2)))}$`,
        sprendimas: `Tarp jų telpa šimtosios nuo $${des(Number((sveikas + desimtosios / 10 + 0.01).toFixed(2)))}$ iki $${des(Number((sveikas + desimtosios / 10 + 0.09).toFixed(2)))}$; mažiausia yra pirmoji.`,
      })
    },

    // 7. Klaidingas palyginimas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Mokinys teigia, kad $${des(sveikas + 0.09)}$ mažesnis už $${des(sveikas + 0.1)}$, „nes 9 mažiau už 1“. Ar jo atsakymas teisingas?`,
        variantai: [
          'atsakymas teisingas, bet paaiškinimas klaidingas',
          'ir atsakymas, ir paaiškinimas teisingi',
          'atsakymas klaidingas',
        ],
        teisingas: 0,
        sprendimas: `$${des(sveikas + 0.09)}$ tikrai mažesnis, bet ne dėl to: $${des(sveikas + 0.1)}$ yra 10 šimtųjų, o $${des(sveikas + 0.09)}$ — tik 9.`,
        brezinys: desimtainiuKvadratas(9),
      }),

    // 8. Ar 2,50 lygu 2,5
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Ar skaičiai $${des(sveikas + 0.5)}0$ ir $${des(sveikas + 0.5)}$ lygūs?`,
        variantai: ['taip, nes nulis dešinėje reikšmės nekeičia', 'ne, pirmasis didesnis', 'ne, antrasis didesnis'],
        teisingas: 0,
        sprendimas: '50 šimtųjų ir 5 dešimtosios yra tas pats dydis.',
      }),
  ])
}

// ── 2.9 Trupmena ↔ dešimtainis skaičius ─────────────────────────────────────

const T9 = 'trupmena-ir-desimtainis'

const A_VERTIMAS = [
  {
    klausimas: 'Užrašyk $\\dfrac{3}{10}$ dešimtainiu skaičiumi.',
    atsakymas: '0.3',
    atsakymasRodymui: '$0{,}3$',
    sprendimas: 'Trys dešimtosios rašomos kaip 0,3.',
  },
] as const

export const trupmenaIrDesimtainis: Generatorius = () => suBandymais(kurkVertima, A_VERTIMAS, T9)

function kurkVertima(): Uzdavinys | null {
  const desimtosios = atsitiktinis(1, 9)
  const simtosios = atsitiktinis(11, 96)
  const sveikas = atsitiktinis(1, 9)

  return variacija([
    // 1. Dešimtosios → dešimtainis
    () =>
      uzdavinys(T9, {
        klausimas: `Užrašyk dešimtainiu skaičiumi: $${tr(desimtosios, 10)}$.`,
        atsakymas: String(desimtosios / 10),
        atsakymasRodymui: `$${des(desimtosios / 10)}$`,
        sprendimas: 'Vardiklis 10 reiškia dešimtąsias — jos rašomos pirmuoju skaitmeniu po kablelio.',
      }),

    // 2. Dešimtainis → trupmena
    () =>
      uzdavinys(T9, {
        klausimas: `Kokia trupmena su vardikliu 10 lygi $${des(desimtosios / 10)}$?`,
        atsakymas: `${desimtosios}/10`,
        atsakymasRodymui: `$${tr(desimtosios, 10)}$`,
        sprendimas: 'Skaitmuo po kablelio rodo dešimtųjų skaičių.',
      }),

    // 3. Šimtosios → dešimtainis
    () =>
      uzdavinys(T9, {
        klausimas: `Kokį dešimtainį skaičių atitinka kvadrato nuspalvinta dalis $${tr(simtosios, 100)}$?`,
        atsakymas: String(simtosios / 100),
        atsakymasRodymui: `$${des(simtosios / 100)}$`,
        sprendimas: 'Vardiklis 100 reiškia šimtąsias — po kablelio rašomi du skaitmenys.',
        brezinys: desimtainiuKvadratas(simtosios),
      }),

    // 4. Mišrus dešimtainis → trupmena
    () =>
      uzdavinys(T9, {
        klausimas: `Užrašyk $${des(sveikas + desimtosios / 10)}$ trupmena su vardikliu 10.`,
        atsakymas: `${sveikas * 10 + desimtosios}/10`,
        atsakymasRodymui: `$${tr(sveikas * 10 + desimtosios, 10)}$`,
        sprendimas: `Kiekvienas sveikasis yra 10 dešimtųjų: $${sveikas} \\cdot 10 + ${desimtosios} = ${sveikas * 10 + desimtosios}$.`,
      }),

    // 5. Porų susiejimas
    () => {
      const poros = sumaisyk([1, 2, 3, 4, 5, 6, 7, 8, 9])
        .slice(0, 3)
        .map((d) => ({ kaire: `$${des(d / 10)}$`, desine: `$${tr(d, 10)}$` }))
      return poruUzdavinys(naujasId(T9), T9, {
        klausimas: 'Susiek dešimtainį skaičių su jam lygia trupmena.',
        poros,
        sprendimas: 'Skaitmuo po kablelio yra dešimtųjų skaičius.',
      })
    },

    // 6. Klaidos radimas
    () =>
      uzdavinys(T9, {
        klausimas: `Rask klaidą ir užrašyk teisingą trupmeną: $${des(desimtosios / 10)} = ${tr(desimtosios, 100)}$.`,
        atsakymas: `${desimtosios}/10`,
        atsakymasRodymui: `$${tr(desimtosios, 10)}$`,
        sprendimas: `Vienas skaitmuo po kablelio reiškia dešimtąsias, o ne šimtąsias: $${des(desimtosios / 10)} = ${tr(desimtosios, 10)}$.`,
      }),

    // 7. Kuo skiriasi 0,5 ir 0,05
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kiek kartų $${des(desimtosios / 10)}$ didesnis už $${des(desimtosios / 100)}$?`,
        variantai: ['10 kartų', '2 kartus', '100 kartų', 'jie lygūs'],
        teisingas: 0,
        sprendimas: `Pirmasis yra ${desimtosios} dešimtosios, antrasis — ${desimtosios} šimtosios, o dešimtoji yra 10 kartų didesnė už šimtąją.`,
      }),

    // 8. Netaisyklinga trupmena → dešimtainis
    () => {
      const virs = atsitiktinis(101, 195)
      return uzdavinys(T9, {
        klausimas: `Netaisyklingą trupmeną $${tr(virs, 100)}$ užrašyk dešimtainiu skaičiumi.`,
        atsakymas: String(virs / 100),
        atsakymasRodymui: `$${des(virs / 100)}$`,
        sprendimas: `100 šimtųjų sudaro vienetą, tad $${tr(virs, 100)} = 1${tr(virs - 100, 100)} = ${des(virs / 100)}$.`,
      })
    },
  ])
}

// ── 2.10 Prekių kaina dešimtainiais skaičiais ───────────────────────────────

const T10 = 'prekiu-kaina-desimtainiais'

const A_KAINOS = [
  {
    klausimas: 'Užrašyk dešimtainiu skaičiumi: 3 eurai 50 centų.',
    atsakymas: '3.50',
    atsakymasRodymui: '$3{,}50$ Eur',
    sprendimas: 'Centai rašomi po kablelio dviem skaitmenimis.',
  },
] as const

export const prekiuKainaDesimtainiais: Generatorius = () => suBandymais(kurkKainas, A_KAINOS, T10)

const PREKES = [
  'Sultys',
  'Sumuštinis',
  'Duonos kepalas',
  'Sūris',
  'Obuolys',
  'Batonėlis',
  'Sausainiai',
  'Jogurtas',
] as const

function kurkKainas(): Uzdavinys | null {
  const a = atsitiktinis(105, 590)
  const b = atsitiktinis(105, 390)

  return variacija([
    // 1. Iš eurų ir centų
    () => {
      const eur = atsitiktinis(1, 9)
      const ct = atsitiktinis(1, 9) * 10
      return uzdavinys(T10, {
        klausimas: `Užrašyk dešimtainiu skaičiumi: ${kiek(eur, D.eurai)} ${kiek(ct, D.centai)}.`,
        atsakymas: eurais10(eur * 100 + ct),
        atsakymasRodymui: `$${eurais(eur * 100 + ct)}$ Eur`,
        sprendimas: 'Centai rašomi po kablelio: 100 centų sudaro eurą.',
      })
    },

    // 2. Suma
    () =>
      uzdavinys(T10, {
        klausimas: `Apskaičiuok: $${eurais(a)}$ Eur $+$ $${eurais(b)}$ Eur.`,
        atsakymas: eurais10(a + b),
        atsakymasRodymui: `$${eurais(a + b)}$ Eur`,
        sprendimas: `Sudedami centai, o kas 100 centų virsta euru: $${eurais(a + b)}$.`,
      }),

    // 3. Kelios vienodos prekės
    () => {
      const kiekis = atsitiktinis(3, 6)
      const kaina = atsitiktinis(4, 9) * 10
      return uzdavinys(T10, {
        klausimas: `Kiek kainuoja ${kiekis} batonėliai po $${eurais(kaina)}$ Eur?`,
        atsakymas: eurais10(kaina * kiekis),
        atsakymasRodymui: `$${eurais(kaina * kiekis)}$ Eur`,
        sprendimas: `$${kaina} \\cdot ${kiekis} = ${kaina * kiekis}$ centai, tai yra $${eurais(kaina * kiekis)}$ Eur.`,
      })
    },

    // 4. Skirtumas
    () =>
      uzdavinys(T10, {
        klausimas: `Rask skirtumą: $${eurais(a + b)}$ Eur $-$ $${eurais(b)}$ Eur.`,
        atsakymas: eurais10(a),
        atsakymasRodymui: `$${eurais(a)}$ Eur`,
        sprendimas: `Atimami centai, prireikus euras keičiamas 100 centų: $${eurais(a)}$.`,
      }),

    // 5. Palyginimas per euro ribą
    () => {
      // Kainos imamos abipus tos pačios euro ribos: 1,99 ir 2,05 lyginti sunku,
      // o 3,99 ir 2,01 — nė kiek, nes skiriasi jau eurai.
      const riba = atsitiktinis(2, 8) * 100
      const pirma = riba - atsitiktinis(1, 9)
      const antra = riba + atsitiktinis(1, 9)
      if (pirma === antra) return null
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Kuri kaina didesnė: $${eurais(pirma)}$ Eur ar $${eurais(antra)}$ Eur?`,
        variantai:
          pirma > antra
            ? [`$${eurais(pirma)}$ Eur`, `$${eurais(antra)}$ Eur`, 'kainos vienodos']
            : [`$${eurais(antra)}$ Eur`, `$${eurais(pirma)}$ Eur`, 'kainos vienodos'],
        teisingas: 0,
        sprendimas: 'Pirmiausia lyginami eurai, ir tik jiems sutapus — centai.',
      })
    },

    // 6. Kiek liko iš dešimties
    () => {
      const p1 = atsitiktinis(105, 295)
      const p2 = atsitiktinis(105, 395)
      const turejo = 1000
      if (p1 + p2 >= turejo) return null
      const prekes = sumaisyk([...PREKES]).slice(0, 2)
      return uzdavinys(T10, {
        klausimas: `Turėta 10 Eur. Nupirkta: ${prekes[0].toLowerCase()} ir ${prekes[1].toLowerCase()}. Kiek pinigų liko?`,
        atsakymas: eurais10(turejo - p1 - p2),
        atsakymasRodymui: `$${eurais(turejo - p1 - p2)}$ Eur`,
        sprendimas: `Išleista $${eurais(p1)} + ${eurais(p2)} = ${eurais(p1 + p2)}$ Eur, liko $${eurais(turejo - p1 - p2)}$ Eur.`,
        brezinys: kainuLentele([
          { pavadinimas: prekes[0], centai: p1 },
          { pavadinimas: prekes[1], centai: p2 },
        ]),
      })
    },

    // 7. Klaidos radimas — kablelis ne po kableliu
    () => {
      const x = atsitiktinis(210, 480)
      const y = atsitiktinis(2, 9) * 10
      return uzdavinys(T10, {
        klausimas: `Rask klaidą ir užrašyk teisingą sumą: $${eurais(x)} + ${des(y / 100)} = ${des((x + y / 10) / 100)}$.`,
        atsakymas: eurais10(x + y),
        atsakymasRodymui: `$${eurais(x + y)}$ Eur`,
        sprendimas: `$${des(y / 100)}$ yra ${y} centai, tad $${eurais(x)} + ${eurais(y)} = ${eurais(x + y)}$. Sudedant dešimtainius skaičius kablelis rašomas po kableliu.`,
      })
    },

    // 8. Trys prekės su lentele
    () => {
      const kainos = [atsitiktinis(105, 295), atsitiktinis(305, 595), atsitiktinis(105, 195)]
      const prekes = sumaisyk([...PREKES]).slice(0, 3)
      const viso = kainos.reduce((s, k) => s + k, 0)
      return uzdavinys(T10, {
        klausimas: 'Kiek kainuoja visos trys lentelėje išvardytos prekės?',
        atsakymas: eurais10(viso),
        atsakymasRodymui: `$${eurais(viso)}$ Eur`,
        sprendimas: `$${kainos.map((k) => eurais(k)).join(' + ')} = ${eurais(viso)}$.`,
        brezinys: kainuLentele(prekes.map((p, i) => ({ pavadinimas: p, centai: kainos[i] }))),
      })
    },
  ])
}

// ── 2.11 Daugyba ir dalyba su kainomis ──────────────────────────────────────

const T11 = 'kainu-daugyba-dalyba'

const A_KAINU_VEIKSMAI = [
  {
    klausimas: 'Kiek kainuos 4 pieštukai po $1{,}25$ Eur?',
    atsakymas: '5.00',
    atsakymasRodymui: '$5{,}00$ Eur',
    sprendimas: '$125 \\cdot 4 = 500$ centų, tai yra 5 Eur.',
  },
] as const

export const kainuDaugybaDalyba: Generatorius = () =>
  suBandymais(kurkKainuVeiksmus, A_KAINU_VEIKSMAI, T11)

function kurkKainuVeiksmus(): Uzdavinys | null {
  const kiekis = atsitiktinis(3, 9)
  const kaina = atsitiktinis(2, 12) * 5 + atsitiktinis(0, 4) * 10

  return variacija([
    // 1. Kelios prekės
    () =>
      uzdavinys(T11, {
        klausimas: `Kiek kainuos ${kiek(kiekis, D.sasiuviniai)} po $${eurais(kaina)}$ Eur?`,
        atsakymas: eurais10(kaina * kiekis),
        atsakymasRodymui: `$${eurais(kaina * kiekis)}$ Eur`,
        sprendimas: `$${kaina} \\cdot ${kiekis} = ${kaina * kiekis}$ centai, tai yra $${eurais(kaina * kiekis)}$ Eur.`,
      }),

    // 2. Pigi prekė, apvali kaina
    () => {
      const ct = atsitiktinis(2, 9) * 10
      const n = atsitiktinis(4, 9)
      return uzdavinys(T11, {
        klausimas: `Kiek kainuos ${kiek(n, D.obuoliai)} po $${eurais(ct)}$ Eur?`,
        atsakymas: eurais10(ct * n),
        atsakymasRodymui: `$${eurais(ct * n)}$ Eur`,
        sprendimas: `$${ct} \\cdot ${n} = ${ct * n}$ centai — $${eurais(ct * n)}$ Eur.`,
      })
    },

    // 3. Padalyti sumą po lygiai
    () => {
      const draugu = atsitiktinis(4, 8)
      const suma = draugu * atsitiktinis(120, 480)
      return uzdavinys(T11, {
        klausimas: `$${eurais(suma)}$ Eur padalyta po lygiai ${draugu} draugams. Kiek gaus kiekvienas?`,
        atsakymas: eurais10(suma / draugu),
        atsakymasRodymui: `$${eurais(suma / draugu)}$ Eur`,
        sprendimas: `$${suma} : ${draugu} = ${suma / draugu}$ centų — $${eurais(suma / draugu)}$ Eur.`,
      })
    },

    // 4. Kiek prekių už turimą sumą
    () => {
      const vieneto = atsitiktinis(3, 9) * 25
      const n = atsitiktinis(6, 16)
      return uzdavinys(T11, {
        klausimas: `Iš $${eurais(vieneto * n)}$ Eur nupirkta sulčių po $${eurais(vieneto)}$ Eur. Kiek buteliukų nupirkta?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${vieneto * n} : ${vieneto} = ${n}$.`,
      })
    },

    // 5. Didesnis pirkinys
    () => {
      const n = atsitiktinis(12, 20)
      const c = atsitiktinis(6, 12) * 20
      return uzdavinys(T11, {
        klausimas: `Mokykla nusipirko ${n} aplankus po $${eurais(c)}$ Eur. Kiek sumokėta iš viso?`,
        atsakymas: eurais10(c * n),
        atsakymasRodymui: `$${eurais(c * n)}$ Eur`,
        sprendimas: `$${c} \\cdot ${n} = ${c * n}$ centai — $${eurais(c * n)}$ Eur.`,
      })
    },

    // 6. Kuris variantas naudingesnis
    () => {
      const n1 = atsitiktinis(3, 5)
      const c1 = atsitiktinis(15, 30) * 5
      const n2 = n1 + 1
      const c2 = Math.round((n1 * c1) / n2) + pasirink([-15, -10, 10, 15])
      if (c2 <= 0 || n1 * c1 === n2 * c2) return null
      return pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Kuris pirkinys kainuoja mažiau: ${n1} pieštukai po $${eurais(c1)}$ Eur ar ${n2} pieštukai po $${eurais(c2)}$ Eur?`,
        variantai:
          n1 * c1 < n2 * c2
            ? [`${n1} po $${eurais(c1)}$ Eur`, `${n2} po $${eurais(c2)}$ Eur`, 'kainuoja vienodai']
            : [`${n2} po $${eurais(c2)}$ Eur`, `${n1} po $${eurais(c1)}$ Eur`, 'kainuoja vienodai'],
        teisingas: 0,
        sprendimas: `$${eurais(n1 * c1)}$ Eur ir $${eurais(n2 * c2)}$ Eur.`,
      })
    },

    // 7. Klaidos radimas
    () => {
      const n = atsitiktinis(4, 8)
      const c = atsitiktinis(11, 19) * 10
      const klaidingas = c + (n - 1) * 100
      return uzdavinys(T11, {
        klausimas: `Rask klaidą ir užrašyk teisingą sumą: $${n} \\cdot ${eurais(c)}$ Eur $= ${eurais(klaidingas)}$ Eur.`,
        atsakymas: eurais10(c * n),
        atsakymasRodymui: `$${eurais(c * n)}$ Eur`,
        sprendimas: `Dauginami ir eurai, ir centai: $${c} \\cdot ${n} = ${c * n}$ centai, tai yra $${eurais(c * n)}$ Eur.`,
      })
    },
  ])
}

// ── 2.12 Seka iš dešimtainių skaičių ────────────────────────────────────────

const T12 = 'desimtainiu-sekos'

const A_DES_SEKOS = [
  {
    klausimas: 'Pratęsk seką: $1{,}2$; $1{,}5$; $1{,}8$; …  Koks kitas narys?',
    atsakymas: '2.1',
    atsakymasRodymui: '$2{,}1$',
    sprendimas: 'Kaskart pridedama po 0,3.',
  },
] as const

export const desimtainiuSekos: Generatorius = () => suBandymais(kurkDesSekas, A_DES_SEKOS, T12)

function kurkDesSekas(): Uzdavinys | null {
  // Skaičiuojama dešimtosiomis, kad nebūtų slankaus kablelio paklaidų.
  const pradzia = atsitiktinis(8, 45)
  const zingsnis = atsitiktinis(2, 9)

  return variacija([
    // 1. Didėjanti seka
    () => {
      const nariai = [0, 1, 2].map((i) => pradzia + i * zingsnis)
      return uzdavinys(T12, {
        klausimas: `Pratęsk seką: $${nariai.map((n) => desDes(n)).join('$; $')}$; … Koks kitas narys?`,
        atsakymas: String((pradzia + 3 * zingsnis) / 10),
        atsakymasRodymui: `$${desDes(pradzia + 3 * zingsnis)}$`,
        sprendimas: `Kaskart pridedama po $${desDes(zingsnis)}$.`,
      })
    },

    // 2. Mažėjanti seka
    () => {
      const nuo = pradzia + 4 * zingsnis
      const nariai = [0, 1, 2].map((i) => nuo - i * zingsnis)
      if (nuo - 3 * zingsnis <= 0) return null
      return uzdavinys(T12, {
        klausimas: `Pratęsk seką: $${nariai.map((n) => desDes(n)).join('$; $')}$; … Koks kitas narys?`,
        atsakymas: String((nuo - 3 * zingsnis) / 10),
        atsakymasRodymui: `$${desDes(nuo - 3 * zingsnis)}$`,
        sprendimas: `Kaskart atimama po $${desDes(zingsnis)}$.`,
      })
    },

    // 3. Sekos taisyklė
    () => {
      const nariai = [0, 1, 2, 3].map((i) => pradzia + i * zingsnis)
      return uzdavinys(T12, {
        klausimas: `Kiek kaskart pridedama sekoje $${nariai.map((n) => desDes(n)).join('$; $')}$?`,
        atsakymas: String(zingsnis / 10),
        atsakymasRodymui: `$${desDes(zingsnis)}$`,
        sprendimas: `Gretimų narių skirtumas: $${desDes(nariai[1])} - ${desDes(nariai[0])} = ${desDes(zingsnis)}$.`,
      })
    },

    // 4. Trūkstamas narys viduryje
    () => {
      const nariai = [0, 1, 2, 3].map((i) => pradzia + i * zingsnis)
      return uzdavinys(T12, {
        klausimas: `Koks narys turi būti vietoj klaustuko: $${desDes(nariai[0])}$; $${desDes(nariai[1])}$; $?$; $${desDes(nariai[3])}$?`,
        atsakymas: String(nariai[2] / 10),
        atsakymasRodymui: `$${desDes(nariai[2])}$`,
        sprendimas: `Žingsnis yra $${desDes(zingsnis)}$, tad trūkstamas narys yra $${desDes(nariai[1])} + ${desDes(zingsnis)} = ${desDes(nariai[2])}$.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const nariai = [0, 1, 2, 3, 4].map((i) => pradzia + i * zingsnis)
      const sugadinti = [...nariai]
      sugadinti[3] += 1
      return uzdavinys(T12, {
        klausimas: `Vienas sekos narys neteisingas: $${sugadinti.map((n) => desDes(n)).join('$; $')}$. Koks skaičius turi būti jo vietoje?`,
        atsakymas: String(nariai[3] / 10),
        atsakymasRodymui: `$${desDes(nariai[3])}$`,
        sprendimas: `Žingsnis yra $${desDes(zingsnis)}$, tad ketvirtas narys turi būti $${desDes(nariai[3])}$.`,
      })
    },

    // 6. Kelintas narys
    () => {
      const kelintas = atsitiktinis(5, 8)
      const narys = pradzia + (kelintas - 1) * zingsnis
      return uzdavinys(T12, {
        klausimas: `Seka prasideda $${desDes(pradzia)}$, o kaskart pridedama po $${desDes(zingsnis)}$. Koks bus ${kelintas}-asis narys?`,
        atsakymas: String(narys / 10),
        atsakymasRodymui: `$${desDes(narys)}$`,
        sprendimas: `Pridedama ${kelintas - 1} kartus: $${desDes(pradzia)} + ${kelintas - 1} \\cdot ${desDes(zingsnis)} = ${desDes(narys)}$.`,
      })
    },

    // 7. Dvi sekos — kuri auga greičiau
    () => {
      const zingsnis2 = atsitiktinis(2, 9)
      if (zingsnis2 === zingsnis) return null
      const a = [0, 1, 2].map((i) => pradzia + i * zingsnis)
      const b = [0, 1, 2].map((i) => pradzia + i * zingsnis2)
      return pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: `Kuri seka auga greičiau: A — $${a.map((n) => desDes(n)).join('$; $')}$ ar B — $${b.map((n) => desDes(n)).join('$; $')}$?`,
        variantai:
          zingsnis > zingsnis2 ? ['A', 'B', 'abi vienodai'] : ['B', 'A', 'abi vienodai'],
        teisingas: 0,
        sprendimas: `A žingsnis $${desDes(zingsnis)}$, B žingsnis $${desDes(zingsnis2)}$.`,
      })
    },
  ])
}

// ── 2.13 Kaip apskaičiuoti gaminio savikainą? ───────────────────────────────

const T13 = 'gaminio-savikaina'

const A_SAVIKAINA = [
  {
    klausimas: 'Pyragui reikia ingredientų už $1{,}20$ Eur, $0{,}80$ Eur ir $2{,}50$ Eur. Kokia jo savikaina?',
    atsakymas: '4.50',
    atsakymasRodymui: '$4{,}50$ Eur',
    sprendimas: '$120 + 80 + 250 = 450$ centų.',
  },
] as const

export const gaminioSavikaina: Generatorius = () => suBandymais(kurkSavikaina, A_SAVIKAINA, T13)

const MEDZIAGOS = [
  ['Miltai', 'Sviestas', 'Cukrus'],
  ['Vaškas', 'Indas', 'Etiketė'],
  ['Popierius', 'Lipdukas', 'Juostelė'],
  ['Vaisiai', 'Cukrus', 'Buteliukas'],
] as const

function kurkSavikaina(): Uzdavinys | null {
  const rinkinys = pasirink(MEDZIAGOS)
  const kainos = [atsitiktinis(50, 320), atsitiktinis(30, 260), atsitiktinis(20, 180)]
  const viso = kainos.reduce((s, k) => s + k, 0)

  return variacija([
    // 1. Trijų medžiagų savikaina
    () =>
      uzdavinys(T13, {
        klausimas: 'Kokia gaminio savikaina, jei sunaudotos visos lentelėje išvardytos medžiagos?',
        atsakymas: eurais10(viso),
        atsakymasRodymui: `$${eurais(viso)}$ Eur`,
        sprendimas: `$${kainos.map((k) => eurais(k)).join(' + ')} = ${eurais(viso)}$.`,
        brezinys: kainuLentele(rinkinys.map((m, i) => ({ pavadinimas: m, centai: kainos[i] }))),
      }),

    // 2. Dviejų medžiagų savikaina
    () =>
      uzdavinys(T13, {
        klausimas: `Sultims reikia vaisių už $${eurais(kainos[0])}$ Eur ir cukraus už $${eurais(kainos[1])}$ Eur. Kokia savikaina?`,
        atsakymas: eurais10(kainos[0] + kainos[1]),
        atsakymasRodymui: `$${eurais(kainos[0] + kainos[1])}$ Eur`,
        sprendimas: `$${eurais(kainos[0])} + ${eurais(kainos[1])} = ${eurais(kainos[0] + kainos[1])}$.`,
      }),

    // 3. Vieno gaminio savikaina iš bendros sumos
    () => {
      const gaminiu = atsitiktinis(4, 12)
      const vieno = atsitiktinis(25, 120)
      return uzdavinys(T13, {
        klausimas: `Pagaminta ${kiek(gaminiu, D.apyrankes)}, o visos medžiagos kainavo $${eurais(vieno * gaminiu)}$ Eur. Kokia vienos apyrankės savikaina?`,
        atsakymas: eurais10(vieno),
        atsakymasRodymui: `$${eurais(vieno)}$ Eur`,
        sprendimas: `$${vieno * gaminiu} : ${gaminiu} = ${vieno}$ centų — $${eurais(vieno)}$ Eur.`,
      })
    },

    // 4. Sausainiai iš vienos partijos
    () => {
      const sausainiu = pasirink([8, 10, 12, 15, 16, 20])
      const vieno = atsitiktinis(15, 60)
      return uzdavinys(T13, {
        klausimas: `Iškepta ${sausainiu} sausainių, ingredientai kainavo $${eurais(vieno * sausainiu)}$ Eur. Kokia vieno sausainio savikaina?`,
        atsakymas: eurais10(vieno),
        atsakymasRodymui: `$${eurais(vieno)}$ Eur`,
        sprendimas: `$${vieno * sausainiu} : ${sausainiu} = ${vieno}$ centų.`,
      })
    },

    // 5. Ar bus pelno
    () => {
      const gaminiu = atsitiktinis(5, 10)
      const medziagos = atsitiktinis(40, 100) * gaminiu
      const pardavimo = atsitiktinis(60, 160)
      const savikaina = medziagos / gaminiu
      if (savikaina === pardavimo) return null
      return pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: `Medžiagos kainavo $${eurais(medziagos)}$ Eur, pagaminta ${gaminiu} apyrankės. Ar pardavus vieną už $${eurais(pardavimo)}$ Eur būtų gautas pelnas?`,
        variantai:
          pardavimo > savikaina
            ? ['taip, pardavimo kaina didesnė už savikainą', 'ne, būtų patirta nuostolio', 'nei pelno, nei nuostolio']
            : ['ne, būtų patirta nuostolio', 'taip, pardavimo kaina didesnė už savikainą', 'nei pelno, nei nuostolio'],
        teisingas: 0,
        sprendimas: `Vienos apyrankės savikaina $${eurais(medziagos)} : ${gaminiu} = ${eurais(savikaina)}$ Eur.`,
      })
    },

    // 6. Savikaina ir kiekis kartu
    () => {
      const vieneto = kainos[0] + kainos[1]
      const kiekis = atsitiktinis(3, 8)
      return uzdavinys(T13, {
        klausimas: `Vieno atviruko gamybai reikia popieriaus už $${eurais(kainos[0])}$ Eur ir lipduko už $${eurais(kainos[1])}$ Eur. Kiek kainuos pagaminti ${kiekis} atvirukus?`,
        atsakymas: eurais10(vieneto * kiekis),
        atsakymasRodymui: `$${eurais(vieneto * kiekis)}$ Eur`,
        sprendimas: `Vieno savikaina $${eurais(vieneto)}$ Eur, tad $${vieneto} \\cdot ${kiekis} = ${vieneto * kiekis}$ centų.`,
      })
    },

    // 7. Klaidos radimas
    () => {
      const gaminiu = atsitiktinis(4, 10)
      const vieno = atsitiktinis(30, 90)
      return uzdavinys(T13, {
        klausimas: `Medžiagos ${gaminiu} žvakėms kainavo $${eurais(vieno * gaminiu)}$ Eur. Mokinys apskaičiavo, kad vienos žvakės savikaina yra $${eurais(vieno * gaminiu)}$ Eur. Užrašyk teisingą savikainą.`,
        atsakymas: eurais10(vieno),
        atsakymasRodymui: `$${eurais(vieno)}$ Eur`,
        sprendimas: `Bendrą sumą reikia padalyti iš gaminių skaičiaus: $${vieno * gaminiu} : ${gaminiu} = ${vieno}$ centų.`,
      })
    },
  ])
}
