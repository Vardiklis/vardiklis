import { nsd, atsitiktinis, naujasId, pasirink, suprastink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { VARDAI, eurais, eurais10 } from './ketvirtokams-bendra'
import {
  desimtainiuJuosta,
  desimtainiuKvadratas,
  misriojoModelis,
} from './ketvirtokams-trupmenu-vaizdai'
import { trupmenosApskritimas, trupmenosJuosta } from './treciokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 5 klasės tema „Trupmeniniai skaičiai“ — vienuolika potemių.
 *
 * Anksčiau jos rėmėsi `trupmenu-sudetis`, `desimtaines`, `procentai`,
 * `dalies-radimas` ir `palukanos` generatoriais. Pastarasis skirtas 9–10
 * klasėms: penktokui tekdavo sudėtinės palūkanos ir kelių metų prieaugis.
 *
 * Visa tema laikosi ant vienos minties: paprastoji trupmena, dešimtainis
 * skaičius ir procentas žymi tą patį dydį. Todėl kone kiekvienoje potemėje yra
 * pavidalas, kur tą patį dydį prašoma užrašyti kitaip.
 */

/** Trupmena KaTeX užrašui. */
function tr(sk: number, vd: number): string {
  return `\\dfrac{${sk}}{${vd}}`
}

/** Mišrusis skaičius KaTeX užrašui. */
function mis(sveikas: number, sk: number, vd: number): string {
  return sk === 0 ? String(sveikas) : `${sveikas}${tr(sk, vd)}`
}

/** Dešimtainis skaičius su lietuvišku kableliu. */
function des(x: number): string {
  return String(x).replace('.', '{,}')
}

// ── 4.1.1. Taisyklingosios ir netaisyklingosios trupmenos ───────────────────

const T1 = 'taisyklingos-trupmenos'

const A_TAISYKLINGOS = [
  {
    klausimas: 'Ar $\\dfrac{5}{8}$ yra taisyklingoji trupmena?',
    atsakymas: 'a',
    atsakymasRodymui: 'taip',
    sprendimas: 'Skaitiklis mažesnis už vardiklį.',
  },
] as const

export const taisyklingosTrupmenos: Generatorius = () =>
  suBandymais(kurkTaisyklingas, A_TAISYKLINGOS, T1)

function kurkTaisyklingas(): Uzdavinys | null {
  const vd = atsitiktinis(4, 12)
  const sk = atsitiktinis(1, vd * 2)

  return variacija([
    // 1. Ar taisyklingoji
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Ar $${tr(sk, vd)}$ yra taisyklingoji trupmena?`,
        variantai:
          sk < vd
            ? [
                'taip, skaitiklis mažesnis už vardiklį',
                'ne, skaitiklis didesnis už vardiklį',
                'ne, skaitiklis lygus vardikliui',
              ]
            : sk === vd
              ? [
                  'ne, skaitiklis lygus vardikliui',
                  'taip, skaitiklis mažesnis už vardiklį',
                  'ne, skaitiklis didesnis už vardiklį',
                ]
              : [
                  'ne, skaitiklis didesnis už vardiklį',
                  'taip, skaitiklis mažesnis už vardiklį',
                  'ne, skaitiklis lygus vardikliui',
                ],
        teisingas: 0,
        sprendimas: 'Taisyklingosios trupmenos skaitiklis mažesnis už vardiklį — tokia trupmena mažesnė už vienetą.',
      }),

    // 2. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuri trupmena vadinama netaisyklingąja?',
        variantai: [
          'kurios skaitiklis lygus vardikliui arba už jį didesnis',
          'kurios skaitiklis mažesnis už vardiklį',
          'kurios vardiklis lyginis',
          'kurios skaitiklis nelyginis',
        ],
        teisingas: 0,
        sprendimas: 'Netaisyklingoji trupmena yra lygi vienetui arba už jį didesnė.',
      }),

    // 3. Kuri didesnė už vienetą
    () => {
      const maza = atsitiktinis(1, vd - 1)
      const didele = atsitiktinis(vd + 1, vd * 2)
      const variantai = sumaisyk([`$${tr(maza, vd)}$`, `$${tr(didele, vd)}$`, `$${tr(vd, vd)}$`])
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuri trupmena didesnė už vienetą?',
        variantai,
        teisingas: variantai.indexOf(`$${tr(didele, vd)}$`),
        sprendimas: `Už vienetą didesnė ta trupmena, kurios skaitiklis didesnis už vardiklį. $${tr(vd, vd)}$ lygi vienetui.`,
      })
    },

    // 4. Kiek taisyklingųjų su duotu vardikliu
    () =>
      uzdavinys(T1, {
        klausimas: `Kiek yra taisyklingųjų trupmenų su vardikliu ${vd}?`,
        atsakymas: String(vd - 1),
        atsakymasRodymui: `$${vd - 1}$`,
        sprendimas: `Skaitiklis gali būti nuo 1 iki ${vd - 1}, tad tokių trupmenų $${vd} - 1 = ${vd - 1}$.`,
      }),

    // 5. Trupmena iš modelio
    () => {
      const nuspalvinta = atsitiktinis(1, vd - 1)
      return uzdavinys(T1, {
        klausimas: 'Kokia trupmena nuspalvinta? Ar ji taisyklingoji?',
        atsakymas: `${nuspalvinta}/${vd}`,
        atsakymasRodymui: `$${tr(nuspalvinta, vd)}$ — taisyklingoji`,
        sprendimas: `Iš ${vd} dalių nuspalvintos ${nuspalvinta}, tad skaitiklis mažesnis už vardiklį.`,
        brezinys: trupmenosApskritimas(vd, nuspalvinta),
      })
    },

    // 6. Didžiausia taisyklingoji
    () =>
      uzdavinys(T1, {
        klausimas: `Kokia yra didžiausia taisyklingoji trupmena su vardikliu ${vd}?`,
        atsakymas: `${vd - 1}/${vd}`,
        atsakymasRodymui: `$${tr(vd - 1, vd)}$`,
        sprendimas: `Skaitiklis turi būti mažesnis už ${vd}, tad didžiausias galimas — ${vd - 1}.`,
      }),

    // 7. Rikiavimas
    () => {
      const trys = sumaisyk([1, 2, 3, 4, 5, 6, 7].filter((x) => x < vd)).slice(0, 3)
      if (trys.length < 3) return null
      const eile = [...trys].sort((a, b) => a - b)
      return eiliskumoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Surikiuok trupmenas didėjimo tvarka.',
        teisingaEile: eile.map((x) => `$${tr(x, vd)}$`),
        sprendimas: 'Vardikliai vienodi, tad rikiuojama pagal skaitiklius.',
      })
    },
  ])
}

// ── 4.1.2. Netaisyklingoji trupmena ir mišrusis skaičius ────────────────────

const T2 = 'netaisyklinga-ir-misrus'

const A_MISRUS = [
  {
    klausimas: 'Užrašyk $\\dfrac{17}{5}$ mišriuoju skaičiumi.',
    atsakymas: '3 2/5',
    atsakymasRodymui: '$3\\dfrac{2}{5}$',
    sprendimas: '$17 : 5 = 3$ (lieka 2).',
  },
] as const

export const netaisyklingaIrMisrus: Generatorius = () =>
  suBandymais(kurkMisru, A_MISRUS, T2)

function kurkMisru(): Uzdavinys | null {
  const vd = atsitiktinis(3, 12)
  const sveikas = atsitiktinis(2, 8)
  const sk = atsitiktinis(1, vd - 1)
  const netaisyklinga = sveikas * vd + sk

  return variacija([
    // 1. Netaisyklingoji → mišrusis
    () =>
      uzdavinys(T2, {
        klausimas: `Užrašyk $${tr(netaisyklinga, vd)}$ mišriuoju skaičiumi.`,
        atsakymas: `${sveikas} ${sk}/${vd}`,
        atsakymasRodymui: `$${mis(sveikas, sk, vd)}$`,
        sprendimas: `$${netaisyklinga} : ${vd} = ${sveikas}$ (lieka ${sk}).`,
      }),

    // 2. Mišrusis → netaisyklingoji
    () =>
      uzdavinys(T2, {
        klausimas: `Užrašyk $${mis(sveikas, sk, vd)}$ netaisyklingąja trupmena.`,
        atsakymas: `${netaisyklinga}/${vd}`,
        atsakymasRodymui: `$${tr(netaisyklinga, vd)}$`,
        sprendimas: `$${sveikas} \\cdot ${vd} + ${sk} = ${netaisyklinga}$.`,
      }),

    // 3. Sveikoji dalis
    () =>
      uzdavinys(T2, {
        klausimas: `Kokia yra trupmenos $${tr(netaisyklinga, vd)}$ sveikoji dalis?`,
        atsakymas: String(sveikas),
        atsakymasRodymui: `$${sveikas}$`,
        sprendimas: `$${netaisyklinga} : ${vd}$ duoda ${sveikas} (lieka ${sk}).`,
      }),

    // 4. Iš modelio
    () =>
      uzdavinys(T2, {
        klausimas: 'Koks mišrusis skaičius pavaizduotas?',
        atsakymas: `${sveikas} ${sk}/${vd}`,
        atsakymasRodymui: `$${mis(sveikas, sk, vd)}$`,
        sprendimas: `Pilnai nuspalvinti ${sveikas} apskritimai, o paskutiniame — ${sk} dalys iš ${vd}.`,
        brezinys: misriojoModelis(sveikas, sk, vd),
      }),

    // 5. Kada gaunamas sveikasis
    () =>
      uzdavinys(T2, {
        klausimas: `Kokia yra $${tr(vd * sveikas, vd)}$ reikšmė?`,
        atsakymas: String(sveikas),
        atsakymasRodymui: `$${sveikas}$`,
        sprendimas: `$${vd * sveikas} : ${vd} = ${sveikas}$ be liekanos, tad trupmeninės dalies nelieka.`,
      }),

    // 6. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: `Mokinys užrašė $${mis(sveikas, sk, vd)} = ${tr(sveikas + sk, vd)}$. Užrašyk teisingą netaisyklingąją trupmeną.`,
        atsakymas: `${netaisyklinga}/${vd}`,
        atsakymasRodymui: `$${tr(netaisyklinga, vd)}$`,
        sprendimas: `Sveikieji ne pridedami prie skaitiklio, o verčiami dalimis: $${sveikas} \\cdot ${vd} + ${sk} = ${netaisyklinga}$.`,
      }),

    // 7. Palyginimas su vienetu
    () => {
      const kita = atsitiktinis(1, vd - 1)
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kuris skaičius didesnis: $${tr(netaisyklinga, vd)}$ ar $${tr(kita, vd)}$?`,
        variantai: [`$${tr(netaisyklinga, vd)}$`, `$${tr(kita, vd)}$`, 'jie lygūs'],
        teisingas: 0,
        sprendimas: `Pirmoji trupmena didesnė už vienetą, antroji — mažesnė.`,
      })
    },
  ])
}

// ── 4.1.3. Pagrindinė trupmenos savybė ──────────────────────────────────────

const T3 = 'pagrindine-trupmenos-savybe'

const A_SAVYBE = [
  {
    klausimas: 'Suprastink trupmeną $\\dfrac{12}{18}$.',
    atsakymas: '2/3',
    atsakymasRodymui: '$\\dfrac{2}{3}$',
    sprendimas: 'Abu narius dalijame iš 6.',
  },
] as const

export const pagrindineTrupmenosSavybe: Generatorius = () =>
  suBandymais(kurkSavybe, A_SAVYBE, T3)

function kurkSavybe(): Uzdavinys | null {
  const sk = atsitiktinis(1, 9)
  const vd = atsitiktinis(sk + 1, 12)
  const kartas = atsitiktinis(2, 6)

  return variacija([
    // 1. Suprastinimas
    () => {
      const t = suprastink(sk * kartas, vd * kartas)
      return uzdavinys(T3, {
        klausimas: `Suprastink trupmeną $${tr(sk * kartas, vd * kartas)}$.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `Abu trupmenos narius dalijame iš ${nsd(sk * kartas, vd * kartas)}.`,
      })
    },

    // 2. Praplėtimas
    () =>
      uzdavinys(T3, {
        klausimas: `Praplėsk trupmeną $${tr(sk, vd)}$ iki vardiklio ${vd * kartas}. Koks bus skaitiklis?`,
        atsakymas: String(sk * kartas),
        atsakymasRodymui: `$${sk * kartas}$`,
        sprendimas: `Vardiklis padidėjo ${kartas} kartus, tad tiek pat kartų didėja ir skaitiklis: $${sk} \\cdot ${kartas} = ${sk * kartas}$.`,
      }),

    // 3. Ką teigia savybė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ką teigia pagrindinė trupmenos savybė?',
        variantai: [
          'padauginus arba padalijus abu narius iš to paties skaičiaus trupmenos reikšmė nepasikeičia',
          'trupmeną galima prastinti tik iš 2',
          'skaitiklį galima keisti nekeičiant vardiklio',
          'trupmenos reikšmė priklauso tik nuo vardiklio',
        ],
        teisingas: 0,
        sprendimas: `$${tr(sk, vd)} = ${tr(sk * kartas, vd * kartas)}$ — tai tas pats dydis.`,
      }),

    // 4. Ar trupmenos lygios
    () => {
      const kita = sk * kartas + pasirink([-1, 1])
      if (kita <= 0) return null
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Ar trupmenos $${tr(sk, vd)}$ ir $${tr(kita, vd * kartas)}$ lygios?`,
        variantai: [
          `ne, lygi būtų $${tr(sk * kartas, vd * kartas)}$`,
          'taip, jos lygios',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: `Praplėtus $${tr(sk, vd)}$ ${kartas} kartus gaunama $${tr(sk * kartas, vd * kartas)}$.`,
      })
    },

    // 5. Nesuprastinamoji trupmena
    () => {
      const t = suprastink(sk, vd)
      if (t.vardiklis !== vd) return null
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Ar trupmeną $${tr(sk, vd)}$ galima suprastinti?`,
        variantai: [
          `ne, ${sk} ir ${vd} bendrų daliklių, didesnių už 1, neturi`,
          `taip, abu narius galima dalyti iš 2`,
          `taip, abu narius galima dalyti iš 3`,
        ],
        teisingas: 0,
        sprendimas: 'Trupmena nesuprastinamoji, kai jos skaitiklis ir vardiklis tarpusavyje pirminiai.',
      })
    },

    // 6. Trūkstamas narys
    () =>
      uzdavinys(T3, {
        klausimas: `Rask trūkstamą skaitiklį: $${tr(sk, vd)} = \\dfrac{\\square}{${vd * kartas}}$.`,
        atsakymas: String(sk * kartas),
        atsakymasRodymui: `$${sk * kartas}$`,
        sprendimas: `$${vd * kartas} : ${vd} = ${kartas}$, tad ir skaitiklį dauginame iš ${kartas}.`,
      }),

    // 7. Iš modelio
    () => {
      const daliu = vd * 2
      const nuspalvinta = sk * 2
      if (nuspalvinta > daliu) return null
      const t = suprastink(nuspalvinta, daliu)
      return uzdavinys(T3, {
        klausimas: 'Kokia trupmena pavaizduota? Užrašyk ją suprastintą.',
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `Juostoje nuspalvinta $${tr(nuspalvinta, daliu)}$, o suprastinus — $${tr(t.skaitiklis, t.vardiklis)}$.`,
        brezinys: trupmenosJuosta(daliu, nuspalvinta),
      })
    },
  ])
}

// ── 4.2.1. Dešimtainiai skaičiai ────────────────────────────────────────────

const T4 = 'desimtainiai-skaiciai-5'

const A_DESIMTAINIAI = [
  {
    klausimas: 'Koks yra skaičiaus $4{,}273$ šimtųjų skaitmuo?',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: 'Po kablelio: dešimtosios, šimtosios, tūkstantosios.',
  },
] as const

const PO_KABLELIO = ['dešimtųjų', 'šimtųjų', 'tūkstantųjų'] as const

export const desimtainiaiSkaiciai5: Generatorius = () =>
  suBandymais(kurkDesimtainius, A_DESIMTAINIAI, T4)

function kurkDesimtainius(): Uzdavinys | null {
  const sveikas = atsitiktinis(1, 48)
  const trupmena = atsitiktinis(101, 989)
  const skaicius = Number(`${sveikas}.${trupmena}`)

  return variacija([
    // 1. Skyriaus skaitmuo
    () => {
      const kuris = atsitiktinis(0, 2)
      return uzdavinys(T4, {
        klausimas: `Koks yra skaičiaus $${des(skaicius)}$ ${PO_KABLELIO[kuris]} skaitmuo?`,
        atsakymas: String(trupmena)[kuris],
        atsakymasRodymui: `$${String(trupmena)[kuris]}$`,
        sprendimas: 'Po kablelio skiltys eina iš eilės: dešimtosios, šimtosios, tūkstantosios.',
      })
    },

    // 2. Iš žodžių
    () => {
      const des1 = atsitiktinis(1, 9)
      return uzdavinys(T4, {
        klausimas: `Užrašyk dešimtainiu skaičiumi: ${sveikas} sveiki ir ${des1} dešimtosios.`,
        atsakymas: String(sveikas + des1 / 10),
        atsakymasRodymui: `$${des(sveikas + des1 / 10)}$`,
        sprendimas: 'Sveikoji dalis rašoma prieš kablelį, dešimtosios — iškart po jo.',
      })
    },

    // 3. Sveikoji dalis
    () =>
      uzdavinys(T4, {
        klausimas: `Kokia yra skaičiaus $${des(skaicius)}$ sveikoji dalis?`,
        atsakymas: String(sveikas),
        atsakymasRodymui: `$${sveikas}$`,
        sprendimas: 'Sveikoji dalis yra skaičius prieš kablelį.',
      }),

    // 4. Iš juostos modelio
    () => {
      const d = atsitiktinis(1, 9)
      return uzdavinys(T4, {
        klausimas: 'Kokį dešimtainį skaičių rodo modelis?',
        atsakymas: String(d / 10),
        atsakymasRodymui: `$${des(d / 10)}$`,
        sprendimas: `Juosta padalyta į 10 dalių, nuspalvintos ${d} — tai $${tr(d, 10)}$, arba $${des(d / 10)}$.`,
        brezinys: desimtainiuJuosta(d),
      })
    },

    // 5. Šimtosios iš kvadrato
    () => {
      const s = atsitiktinis(12, 96)
      return uzdavinys(T4, {
        klausimas: 'Kokį dešimtainį skaičių rodo kvadrato modelis?',
        atsakymas: String(s / 100),
        atsakymasRodymui: `$${des(s / 100)}$`,
        sprendimas: `Nuspalvinta ${s} langeliai iš 100, tai yra $${tr(s, 100)} = ${des(s / 100)}$.`,
        brezinys: desimtainiuKvadratas(s),
      })
    },

    // 6. Kiek skaitmenų po kablelio
    () =>
      uzdavinys(T4, {
        klausimas: `Kiek skaitmenų po kablelio turi skaičius $${des(skaicius)}$?`,
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Tai reiškia, kad mažiausia jame nurodyta dalis yra tūkstantoji.',
      }),

    // 7. Skyrių pavadinimai
    () =>
      poruUzdavinys(naujasId(T4), T4, {
        klausimas: `Susiek skaičiaus $${des(skaicius)}$ skaitmenį su jo skyriumi.`,
        poros: [
          { kaire: String(trupmena)[0], desine: 'dešimtosios' },
          { kaire: String(trupmena)[1], desine: 'šimtosios' },
          { kaire: String(trupmena)[2], desine: 'tūkstantosios' },
        ],
        sprendimas: 'Skyriai po kablelio eina iš eilės nuo didžiausio.',
      }),
  ])
}

// ── 4.2.2. Lygūs dešimtainiai skaičiai ──────────────────────────────────────

const T5 = 'lygus-desimtainiai'

const A_LYGUS = [
  {
    klausimas: 'Ar $2{,}5$ ir $2{,}50$ lygūs?',
    atsakymas: 'a',
    atsakymasRodymui: 'taip',
    sprendimas: 'Nulis dešinėje po kablelio reikšmės nekeičia.',
  },
] as const

export const lygusDesimtainiai: Generatorius = () => suBandymais(kurkLygius, A_LYGUS, T5)

function kurkLygius(): Uzdavinys | null {
  const sveikas = atsitiktinis(1, 24)
  const d = atsitiktinis(1, 9)

  return variacija([
    // 1. Ar lygūs
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Ar skaičiai $${des(sveikas + d / 10)}$ ir $${des(sveikas + d / 10)}0$ lygūs?`,
        variantai: [
          'taip, nulis dešinėje po kablelio reikšmės nekeičia',
          'ne, antrasis didesnis',
          'ne, pirmasis didesnis',
        ],
        teisingas: 0,
        sprendimas: `${d} dešimtosios ir ${d * 10} šimtųjų yra tas pats dydis.`,
      }),

    // 2. Prirašyti nulį
    () =>
      uzdavinys(T5, {
        klausimas: `Užrašyk $${des(sveikas + d / 10)}$ šimtosiomis (dviem skaitmenimis po kablelio). Kiek šimtųjų gaunama?`,
        atsakymas: String(d * 10),
        atsakymasRodymui: `$${d * 10}$ šimtųjų`,
        sprendimas: `$${des(sveikas + d / 10)} = ${des(sveikas + d / 10)}0$, tad šimtųjų yra ${d * 10}.`,
      }),

    // 3. Nubraukti nulį
    () =>
      uzdavinys(T5, {
        klausimas: `Užrašyk $${des(sveikas)}{,}${d}00$ kuo trumpiau.`,
        atsakymas: String(sveikas + d / 10),
        atsakymasRodymui: `$${des(sveikas + d / 10)}$`,
        sprendimas: 'Nuliai skaičiaus dešinėje po kablelio reikšmės nekeičia, tad juos galima nubraukti.',
      }),

    // 4. Kada nulio nubraukti negalima
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kuriame skaičiuje nulio nubraukti negalima: $${des(sveikas)}{,}${d}0$ ar $${des(sveikas)}{,}0${d}$?`,
        variantai: [
          `$${des(sveikas)}{,}0${d}$ — čia nulis yra tarp kablelio ir skaitmens`,
          `$${des(sveikas)}{,}${d}0$ — čia nulis yra gale`,
          'abiejuose galima',
        ],
        teisingas: 0,
        sprendimas: 'Nubraukti galima tik nulius, esančius skaičiaus gale po kablelio.',
      }),

    // 5. Kuris didesnis
    () => {
      const a = sveikas + d / 10
      const b = sveikas + d / 100
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kuris skaičius didesnis: $${des(a)}$ ar $${des(b)}$?`,
        variantai: [`$${des(a)}$`, `$${des(b)}$`, 'jie lygūs'],
        teisingas: 0,
        sprendimas: `${d} dešimtosios yra dešimt kartų daugiau nei ${d} šimtosios.`,
      })
    },

    // 6. Lygių porų atrinkimas
    () => {
      const x = atsitiktinis(1, 9)
      return poruUzdavinys(naujasId(T5), T5, {
        klausimas: 'Susiek dešimtainį skaičių su jam lygiu užrašu.',
        poros: [
          { kaire: `$${des(x / 10)}$`, desine: `$${des(x / 10)}0$` },
          { kaire: `$${des(x / 100)}$`, desine: `$0{,}0${x}0$` },
          { kaire: `$${x}$`, desine: `$${x}{,}00$` },
        ],
        sprendimas: 'Nuliai gale reikšmės nekeičia, o nulis prieš skaitmenį — keičia.',
      })
    },

    // 7. Kiek nulių galima nubraukti
    () =>
      uzdavinys(T5, {
        klausimas: `Kiek nulių galima nubraukti skaičiuje $${des(sveikas)}{,}${d}000$?`,
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: `Lieka $${des(sveikas + d / 10)}$ — visi trys nuliai gale reikšmės nekeičia.`,
      }),
  ])
}

// ── 4.2.3. Paprastoji trupmena ir dešimtainis skaičius ──────────────────────

const T6 = 'trupmena-ir-desimtainis-5'

const A_VERTIMAS = [
  {
    klausimas: 'Užrašyk $\\dfrac{7}{10}$ dešimtainiu skaičiumi.',
    atsakymas: '0.7',
    atsakymasRodymui: '$0{,}7$',
    sprendimas: 'Septynios dešimtosios rašomos 0,7.',
  },
] as const

export const trupmenaIrDesimtainis5: Generatorius = () =>
  suBandymais(kurkVertima, A_VERTIMAS, T6)

function kurkVertima(): Uzdavinys | null {
  const d = atsitiktinis(1, 9)
  const s = atsitiktinis(11, 96)

  return variacija([
    // 1. Dešimtosios → dešimtainis
    () =>
      uzdavinys(T6, {
        klausimas: `Užrašyk dešimtainiu skaičiumi: $${tr(d, 10)}$.`,
        atsakymas: String(d / 10),
        atsakymasRodymui: `$${des(d / 10)}$`,
        sprendimas: 'Vardiklis 10 reiškia dešimtąsias — vieną skaitmenį po kablelio.',
      }),

    // 2. Šimtosios → dešimtainis
    () =>
      uzdavinys(T6, {
        klausimas: `Kokį dešimtainį skaičių atitinka $${tr(s, 100)}$?`,
        atsakymas: String(s / 100),
        atsakymasRodymui: `$${des(s / 100)}$`,
        sprendimas: 'Vardiklis 100 reiškia šimtąsias — du skaitmenis po kablelio.',
      }),

    // 3. Dešimtainis → trupmena
    () =>
      uzdavinys(T6, {
        klausimas: `Kokia trupmena su vardikliu 100 lygi $${des(s / 100)}$?`,
        atsakymas: `${s}/100`,
        atsakymasRodymui: `$${tr(s, 100)}$`,
        sprendimas: 'Du skaitmenys po kablelio rodo šimtųjų skaičių.',
      }),

    // 4. Suprastinta trupmena
    () => {
      const t = suprastink(d, 10)
      if (t.vardiklis === 10) return null
      return uzdavinys(T6, {
        klausimas: `Užrašyk $${des(d / 10)}$ suprastinta paprastąja trupmena.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `$${tr(d, 10)} = ${tr(t.skaitiklis, t.vardiklis)}$.`,
      })
    },

    // 5. Trupmena, kurią galima paversti dešimtaine
    () => {
      const vd = pasirink([2, 4, 5, 20, 25, 50])
      const sk = atsitiktinis(1, vd - 1)
      const reiksme = sk / vd
      if (String(reiksme).length > 6) return null
      return uzdavinys(T6, {
        klausimas: `Užrašyk $${tr(sk, vd)}$ dešimtainiu skaičiumi.`,
        atsakymas: String(reiksme),
        atsakymasRodymui: `$${des(reiksme)}$`,
        sprendimas: `Praplėtus iki vardiklio 100 gaunama $${tr(Math.round(reiksme * 100), 100)} = ${des(reiksme)}$.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      uzdavinys(T6, {
        klausimas: `Rask klaidą ir užrašyk teisingą trupmeną: $${des(d / 10)} = ${tr(d, 100)}$.`,
        atsakymas: `${d}/10`,
        atsakymasRodymui: `$${tr(d, 10)}$`,
        sprendimas: 'Vienas skaitmuo po kablelio reiškia dešimtąsias, o ne šimtąsias.',
      }),

    // 7. Susiejimas
    () => {
      const trys = sumaisyk([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3)
      return poruUzdavinys(naujasId(T6), T6, {
        klausimas: 'Susiek paprastąją trupmeną su jai lygiu dešimtainiu skaičiumi.',
        poros: trys.map((x) => ({ kaire: `$${tr(x, 10)}$`, desine: `$${des(x / 10)}$` })),
        sprendimas: 'Skaitmuo po kablelio yra dešimtųjų skaičius.',
      })
    },
  ])
}

// ── 4.3.1. Procentai ────────────────────────────────────────────────────────

const T7 = 'procentai-5'

const A_PROCENTAI = [
  {
    klausimas: 'Kiek procentų sudaro visuma?',
    atsakymas: '100',
    atsakymasRodymui: '$100\\%$',
    sprendimas: 'Procentas yra šimtoji dalis, tad visuma — 100 procentų.',
  },
] as const

export const procentai5: Generatorius = () => suBandymais(kurkProcentus, A_PROCENTAI, T7)

function kurkProcentus(): Uzdavinys | null {
  const p = atsitiktinis(5, 95)

  return variacija([
    // 1. Kas yra procentas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kas yra vienas procentas?',
        variantai: [
          'šimtoji dalis',
          'dešimtoji dalis',
          'tūkstantoji dalis',
          'pusė',
        ],
        teisingas: 0,
        sprendimas: '$1\\% = \\dfrac{1}{100}$.',
      }),

    // 2. Procentas kaip trupmena
    () => {
      const t = suprastink(p, 100)
      return uzdavinys(T7, {
        klausimas: `Užrašyk $${p}\\%$ suprastinta paprastąja trupmena.`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${tr(t.skaitiklis, t.vardiklis)}$`,
        sprendimas: `$${p}\\% = ${tr(p, 100)} = ${tr(t.skaitiklis, t.vardiklis)}$.`,
      })
    },

    // 3. Procentai iš kvadrato
    () =>
      uzdavinys(T7, {
        klausimas: 'Kiek procentų kvadrato nuspalvinta?',
        atsakymas: String(p),
        atsakymasRodymui: `$${p}\\%$`,
        sprendimas: `Kvadratas padalytas į 100 langelių, nuspalvinta ${p} — tai ${p} procentai.`,
        brezinys: desimtainiuKvadratas(p),
      }),

    // 4. Kiek procentų liko
    () =>
      uzdavinys(T7, {
        klausimas: `Nuspalvinta $${p}\\%$ figūros. Kiek procentų liko nenuspalvinta?`,
        atsakymas: String(100 - p),
        atsakymasRodymui: `$${100 - p}\\%$`,
        sprendimas: `$100 - ${p} = ${100 - p}$.`,
      }),

    // 5. Pusė, ketvirtis, dešimtadalis
    () => {
      const kuris = pasirink([
        { dalis: 'pusę', proc: 50 },
        { dalis: 'ketvirtadalį', proc: 25 },
        { dalis: 'dešimtadalį', proc: 10 },
      ])
      return uzdavinys(T7, {
        klausimas: `Kiek procentų sudaro visumos ${kuris.dalis}?`,
        atsakymas: String(kuris.proc),
        atsakymasRodymui: `$${kuris.proc}\\%$`,
        sprendimas: `Visuma yra $100\\%$, tad ${kuris.dalis} yra $${kuris.proc}\\%$.`,
      })
    },

    // 6. Ar gali būti daugiau nei 100
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ką reiškia, kad kaina išaugo 100 %?',
        variantai: [
          'ji padvigubėjo',
          'ji nepasikeitė',
          'ji sumažėjo perpus',
          'ji tapo lygi 100 eurų',
        ],
        teisingas: 0,
        sprendimas: 'Prie pradinės kainos pridedama dar tiek pat.',
      }),

    // 7. Procentai iš dalies
    () => {
      const visuma = pasirink([20, 25, 50])
      const dalis = atsitiktinis(1, visuma - 1)
      const proc = (dalis * 100) / visuma
      if (!Number.isInteger(proc)) return null
      return uzdavinys(T7, {
        klausimas: `Iš ${visuma} mokinių ${dalis} lanko būrelį. Kiek tai procentų?`,
        atsakymas: String(proc),
        atsakymasRodymui: `$${proc}\\%$`,
        sprendimas: `$${dalis} : ${visuma} \\cdot 100 = ${proc}$.`,
      })
    },
  ])
}

// ── 4.3.2. Trupmenos, dešimtainiai skaičiai ir procentai ────────────────────

const T8 = 'trupmenos-desimtainiai-procentai'

const A_TRYS_PAVIDALAI = [
  {
    klausimas: 'Užrašyk $0{,}25$ procentais.',
    atsakymas: '25',
    atsakymasRodymui: '$25\\%$',
    sprendimas: '$0{,}25 = \\dfrac{25}{100} = 25\\%$.',
  },
] as const

export const trupmenosDesimtainiaiProcentai: Generatorius = () =>
  suBandymais(kurkTrisPavidalus, A_TRYS_PAVIDALAI, T8)

const PAVIDALAI = [
  { p: 50, d: 0.5, sk: 1, vd: 2 },
  { p: 25, d: 0.25, sk: 1, vd: 4 },
  { p: 75, d: 0.75, sk: 3, vd: 4 },
  { p: 20, d: 0.2, sk: 1, vd: 5 },
  { p: 40, d: 0.4, sk: 2, vd: 5 },
  { p: 10, d: 0.1, sk: 1, vd: 10 },
  { p: 30, d: 0.3, sk: 3, vd: 10 },
] as const

function kurkTrisPavidalus(): Uzdavinys | null {
  const v = pasirink(PAVIDALAI)

  return variacija([
    // 1. Dešimtainis → procentai
    () =>
      uzdavinys(T8, {
        klausimas: `Užrašyk $${des(v.d)}$ procentais.`,
        atsakymas: String(v.p),
        atsakymasRodymui: `$${v.p}\\%$`,
        sprendimas: `$${des(v.d)} = ${tr(v.p, 100)} = ${v.p}\\%$.`,
      }),

    // 2. Procentai → dešimtainis
    () =>
      uzdavinys(T8, {
        klausimas: `Užrašyk $${v.p}\\%$ dešimtainiu skaičiumi.`,
        atsakymas: String(v.d),
        atsakymasRodymui: `$${des(v.d)}$`,
        sprendimas: `$${v.p}\\% = ${tr(v.p, 100)} = ${des(v.d)}$.`,
      }),

    // 3. Trupmena → procentai
    () =>
      uzdavinys(T8, {
        klausimas: `Užrašyk $${tr(v.sk, v.vd)}$ procentais.`,
        atsakymas: String(v.p),
        atsakymasRodymui: `$${v.p}\\%$`,
        sprendimas: `$${tr(v.sk, v.vd)} = ${tr(v.p, 100)} = ${v.p}\\%$.`,
      }),

    // 4. Procentai → trupmena
    () =>
      uzdavinys(T8, {
        klausimas: `Užrašyk $${v.p}\\%$ suprastinta paprastąja trupmena.`,
        atsakymas: `${v.sk}/${v.vd}`,
        atsakymasRodymui: `$${tr(v.sk, v.vd)}$`,
        sprendimas: `$${v.p}\\% = ${tr(v.p, 100)} = ${tr(v.sk, v.vd)}$.`,
      }),

    // 5. Susiejimas
    () => {
      const trys = sumaisyk([...PAVIDALAI]).slice(0, 3)
      return poruUzdavinys(naujasId(T8), T8, {
        klausimas: 'Susiek trupmeną su ją atitinkančiu procentu.',
        poros: trys.map((x) => ({ kaire: `$${tr(x.sk, x.vd)}$`, desine: `$${x.p}\\%$` })),
        sprendimas: 'Trupmena praplečiama iki vardiklio 100, ir skaitiklis rodo procentus.',
      })
    },

    // 6. Kuris didesnis
    () => {
      const kitas = pasirink(PAVIDALAI.filter((x) => x.p !== v.p))
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Kuris dydis didesnis: $${tr(v.sk, v.vd)}$ ar $${kitas.p}\\%$?`,
        variantai:
          v.p > kitas.p
            ? [`$${tr(v.sk, v.vd)}$`, `$${kitas.p}\\%$`, 'jie lygūs']
            : [`$${kitas.p}\\%$`, `$${tr(v.sk, v.vd)}$`, 'jie lygūs'],
        teisingas: 0,
        sprendimas: `$${tr(v.sk, v.vd)} = ${v.p}\\%$, tad lyginama $${v.p}\\%$ ir $${kitas.p}\\%$.`,
      })
    },

    // 7. Rikiavimas
    () => {
      const trys = sumaisyk([...PAVIDALAI]).slice(0, 3)
      if (new Set(trys.map((x) => x.p)).size < 3) return null
      const eile = [...trys].sort((a, b) => a.p - b.p)
      return eiliskumoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Surikiuok dydžius didėjimo tvarka.',
        teisingaEile: eile.map((x, i) =>
          i === 0 ? `$${tr(x.sk, x.vd)}$` : i === 1 ? `$${des(x.d)}$` : `$${x.p}\\%$`,
        ),
        sprendimas: `Visus pavertus procentais: ${eile.map((x) => `${x.p}\\%`).join(', ')}.`,
      })
    },
  ])
}

// ── 4.4.1. Skaičiaus dalies radimas ─────────────────────────────────────────

const T9 = 'skaiciaus-dalies-radimas'

const A_DALIS = [
  {
    klausimas: 'Rask $\\dfrac{3}{4}$ skaičiaus 48.',
    atsakymas: '36',
    atsakymasRodymui: '$36$',
    sprendimas: '$48 : 4 \\cdot 3 = 36$.',
  },
] as const

export const skaiciausDaliesRadimas: Generatorius = () =>
  suBandymais(kurkDalies, A_DALIS, T9)

function kurkDalies(): Uzdavinys | null {
  const vd = pasirink([3, 4, 5, 6, 8, 10])
  const sk = atsitiktinis(1, vd - 1)
  const dalis = atsitiktinis(4, 30)
  const visuma = dalis * vd

  return variacija([
    // 1. Trupmenos dalis
    () =>
      uzdavinys(T9, {
        klausimas: `Rask $${tr(sk, vd)}$ skaičiaus ${visuma}.`,
        atsakymas: String(dalis * sk),
        atsakymasRodymui: `$${dalis * sk}$`,
        sprendimas: `$${visuma} : ${vd} = ${dalis}$, tada $${dalis} \\cdot ${sk} = ${dalis * sk}$.`,
      }),

    // 2. Procentų dalis
    () => {
      const p = pasirink([10, 20, 25, 50, 75])
      const rez = (visuma * p) / 100
      if (!Number.isInteger(rez)) return null
      return uzdavinys(T9, {
        klausimas: `Rask $${p}\\%$ skaičiaus ${visuma}.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$${visuma} : 100 \\cdot ${p} = ${rez}$.`,
      })
    },

    // 3. Kiek liko
    () =>
      uzdavinys(T9, {
        klausimas: `Iš ${visuma} kg bulvių parduota $${tr(sk, vd)}$. Kiek kilogramų liko?`,
        atsakymas: String(visuma - dalis * sk),
        atsakymasRodymui: `$${visuma - dalis * sk}$ kg`,
        sprendimas: `Parduota $${dalis} \\cdot ${sk} = ${dalis * sk}$ kg, liko $${visuma} - ${dalis * sk} = ${visuma - dalis * sk}$ kg.`,
      }),

    // 4. Koks veiksmas
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kaip randama $${tr(sk, vd)}$ skaičiaus dalis?`,
        variantai: [
          `skaičius dalijamas iš ${vd} ir dauginamas iš ${sk}`,
          `skaičius dauginamas iš ${vd} ir dalijamas iš ${sk}`,
          `prie skaičiaus pridedama ${sk}`,
          `iš skaičiaus atimama ${vd}`,
        ],
        teisingas: 0,
        sprendimas: 'Pirmiausia randama viena dalis, paskui jų paimama tiek, kiek rodo skaitiklis.',
      }),

    // 5. Dviejų dalių suma
    () => {
      const tinkami = [2, 4, 5].filter((x) => visuma % x === 0 && x !== vd)
      if (tinkami.length === 0) return null
      const vd2 = pasirink(tinkami)
      const antra = visuma / vd2
      if (dalis * sk + antra > visuma) return null
      return uzdavinys(T9, {
        klausimas: `Iš ${visuma} Eur $${tr(sk, vd)}$ išleista knygoms, o $${tr(1, vd2)}$ — bilietams. Kiek eurų liko?`,
        atsakymas: String(visuma - dalis * sk - antra),
        atsakymasRodymui: `$${visuma - dalis * sk - antra}$ Eur`,
        sprendimas: `Knygoms $${dalis * sk}$ Eur, bilietams $${antra}$ Eur, liko $${visuma - dalis * sk - antra}$ Eur.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      uzdavinys(T9, {
        klausimas: `Mokinys, ieškodamas $${tr(1, vd)}$ skaičiaus ${visuma}, padaugino $${visuma} \\cdot ${vd}$. Užrašyk teisingą atsakymą.`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `Dalis randama dalijant: $${visuma} : ${vd} = ${dalis}$.`,
      }),

    // 7. Dalies dalis
    () => {
      if (dalis % 2 !== 0) return null
      return uzdavinys(T9, {
        klausimas: `Rask $${tr(1, vd)}$ skaičiaus ${visuma}, o paskui — pusę gauto skaičiaus.`,
        atsakymas: String(dalis / 2),
        atsakymasRodymui: `$${dalis / 2}$`,
        sprendimas: `$${visuma} : ${vd} = ${dalis}$, tada $${dalis} : 2 = ${dalis / 2}$.`,
      })
    },
  ])
}

// ── 4.4.2. Skaičiaus radimas, kai žinoma jo dalis ───────────────────────────

const T10 = 'skaiciaus-radimas-is-dalies'

const A_VISUMA = [
  {
    klausimas: '$\\dfrac{1}{4}$ skaičiaus yra 12. Koks tas skaičius?',
    atsakymas: '48',
    atsakymasRodymui: '$48$',
    sprendimas: '$12 \\cdot 4 = 48$.',
  },
] as const

export const skaiciausRadimasIsDalies: Generatorius = () =>
  suBandymais(kurkVisuma, A_VISUMA, T10)

function kurkVisuma(): Uzdavinys | null {
  const vd = pasirink([3, 4, 5, 6, 8, 10])
  const sk = atsitiktinis(1, vd - 1)
  const dalis = atsitiktinis(4, 30)
  const visuma = dalis * vd

  return variacija([
    // 1. Iš vienos dalies
    () =>
      uzdavinys(T10, {
        klausimas: `$${tr(1, vd)}$ skaičiaus yra ${dalis}. Koks tas skaičius?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `$${dalis} \\cdot ${vd} = ${visuma}$.`,
      }),

    // 2. Iš kelių dalių
    () =>
      uzdavinys(T10, {
        klausimas: `$${tr(sk, vd)}$ skaičiaus yra ${dalis * sk}. Koks tas skaičius?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `Viena dalis: $${dalis * sk} : ${sk} = ${dalis}$. Visas skaičius: $${dalis} \\cdot ${vd} = ${visuma}$.`,
      }),

    // 3. Iš procentų
    () => {
      const p = pasirink([10, 20, 25, 50])
      const d = (visuma * p) / 100
      if (!Number.isInteger(d)) return null
      return uzdavinys(T10, {
        klausimas: `$${p}\\%$ skaičiaus yra ${d}. Koks tas skaičius?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `$1\\%$ yra $${d} : ${p} = ${d / p}$, tad visas skaičius $${d / p} \\cdot 100 = ${visuma}$.`,
      })
    },

    // 4. Koks veiksmas
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Kaip randamas skaičius, jei žinoma, kad jo $${tr(1, vd)}$ lygi ${dalis}?`,
        variantai: [
          `dalis dauginama iš ${vd}`,
          `dalis dalijama iš ${vd}`,
          `prie dalies pridedama ${vd}`,
          `iš dalies atimama ${vd}`,
        ],
        teisingas: 0,
        sprendimas: 'Ieškant visumos iš dalies atliekamas veiksmas, atvirkštinis dalies radimui.',
      }),

    // 5. Tekstinis
    () => {
      const vardas = pasirink(VARDAI)
      return uzdavinys(T10, {
        klausimas: `${vardas} perskaitė $${tr(sk, vd)}$ knygos — tai ${dalis * sk} puslapiai. Kiek puslapių yra knygoje?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `Viena dalis $${dalis * sk} : ${sk} = ${dalis}$ puslapiai, visa knyga $${dalis} \\cdot ${vd} = ${visuma}$.`,
      })
    },

    // 6. Kiek liko
    () =>
      uzdavinys(T10, {
        klausimas: `$${tr(sk, vd)}$ kelio yra ${dalis * sk} km. Kiek kilometrų liko nuvažiuoti?`,
        atsakymas: String(visuma - dalis * sk),
        atsakymasRodymui: `$${visuma - dalis * sk}$ km`,
        sprendimas: `Visas kelias $${visuma}$ km, nuvažiuota $${dalis * sk}$ km, liko $${visuma - dalis * sk}$ km.`,
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T10, {
        klausimas: `Žinoma, kad $${tr(1, vd)}$ skaičiaus yra ${dalis}. Mokinys atsakė, kad skaičius yra $${dalis} : ${vd}$. Užrašyk teisingą skaičių.`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `Ieškant visumos dalis dauginama, o ne dalijama: $${dalis} \\cdot ${vd} = ${visuma}$.`,
      }),
  ])
}

// ── 4.5. Finansiniai skaičiavimai ───────────────────────────────────────────

const T11 = 'finansiniai-skaiciavimai-5'

const A_FINANSAI = [
  {
    klausimas: 'Prekė kainavo 40 Eur ir atpigo 25 %. Kiek ji kainuoja dabar?',
    atsakymas: '30',
    atsakymasRodymui: '$30$ Eur',
    sprendimas: 'Nuolaida $40 : 100 \\cdot 25 = 10$ Eur.',
  },
] as const

export const finansiniaiSkaiciavimai5: Generatorius = () =>
  suBandymais(kurkFinansus, A_FINANSAI, T11)

function kurkFinansus(): Uzdavinys | null {
  const kaina = pasirink([20, 40, 50, 60, 80, 100, 120, 200])
  const p = pasirink([10, 20, 25, 50])
  const nuolaida = (kaina * p) / 100
  if (!Number.isInteger(nuolaida)) return null

  return variacija([
    // 1. Kaina po nuolaidos
    () =>
      uzdavinys(T11, {
        klausimas: `Prekė kainavo ${kaina} Eur ir atpigo $${p}\\%$. Kiek ji kainuoja dabar?`,
        atsakymas: String(kaina - nuolaida),
        atsakymasRodymui: `$${kaina - nuolaida}$ Eur`,
        sprendimas: `Nuolaida $${kaina} : 100 \\cdot ${p} = ${nuolaida}$ Eur, tad nauja kaina $${kaina} - ${nuolaida} = ${kaina - nuolaida}$ Eur.`,
      }),

    // 2. Kiek sutaupoma
    () =>
      uzdavinys(T11, {
        klausimas: `Kiek eurų sutaupoma perkant ${kaina} Eur prekę su $${p}\\%$ nuolaida?`,
        atsakymas: String(nuolaida),
        atsakymasRodymui: `$${nuolaida}$ Eur`,
        sprendimas: `$${kaina} : 100 \\cdot ${p} = ${nuolaida}$.`,
      }),

    // 3. Kaina pabrangus
    () =>
      uzdavinys(T11, {
        klausimas: `Prekė kainavo ${kaina} Eur ir pabrango $${p}\\%$. Kiek ji kainuoja dabar?`,
        atsakymas: String(kaina + nuolaida),
        atsakymasRodymui: `$${kaina + nuolaida}$ Eur`,
        sprendimas: `Pabrangimas $${nuolaida}$ Eur, tad nauja kaina $${kaina} + ${nuolaida} = ${kaina + nuolaida}$ Eur.`,
      }),

    // 4. Kiek procentų nuolaida
    () =>
      uzdavinys(T11, {
        klausimas: `Prekė kainavo ${kaina} Eur, o dabar kainuoja ${kaina - nuolaida} Eur. Kiek procentų ji atpigo?`,
        atsakymas: String(p),
        atsakymasRodymui: `$${p}\\%$`,
        sprendimas: `Atpigo $${nuolaida}$ Eur; $${nuolaida} : ${kaina} \\cdot 100 = ${p}$.`,
      }),

    // 5. Senoji kaina
    () =>
      uzdavinys(T11, {
        klausimas: `Po $${p}\\%$ nuolaidos prekė kainuoja ${kaina - nuolaida} Eur. Kiek ji kainavo anksčiau?`,
        atsakymas: String(kaina),
        atsakymasRodymui: `$${kaina}$ Eur`,
        sprendimas: `Nauja kaina sudaro $${100 - p}\\%$ senosios, tad $1\\%$ yra $${(kaina - nuolaida) / (100 - p)}$ Eur, o visa kaina — $${kaina}$ Eur.`,
      }),

    // 6. Kuris pasiūlymas naudingesnis
    () => {
      const p2 = pasirink([10, 20, 25, 50].filter((x) => x !== p))
      const n2 = (kaina * p2) / 100
      if (!Number.isInteger(n2)) return null
      return pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Tą pačią ${kaina} Eur prekę viena parduotuvė siūlo su $${p}\\%$ nuolaida, kita — su $${p2}\\%$. Kur pigiau?`,
        variantai:
          p > p2
            ? [`ten, kur $${p}\\%$ nuolaida`, `ten, kur $${p2}\\%$ nuolaida`, 'kaina vienoda']
            : [`ten, kur $${p2}\\%$ nuolaida`, `ten, kur $${p}\\%$ nuolaida`, 'kaina vienoda'],
        teisingas: 0,
        sprendimas: `Kainos po nuolaidų: $${kaina - nuolaida}$ Eur ir $${kaina - n2}$ Eur.`,
      })
    },

    // 7. Su centais
    () => {
      const centai = kaina * 100 - atsitiktinis(1, 99)
      const nuol = Math.round((centai * p) / 100)
      return uzdavinys(T11, {
        klausimas: `Prekė kainuoja $${eurais(centai)}$ Eur. Kiek ji kainuos pritaikius $${p}\\%$ nuolaidą?`,
        atsakymas: eurais10(centai - nuol),
        atsakymasRodymui: `$${eurais(centai - nuol)}$ Eur`,
        sprendimas: `Nuolaida $${eurais(nuol)}$ Eur, tad kaina $${eurais(centai)} - ${eurais(nuol)} = ${eurais(centai - nuol)}$ Eur.`,
      })
    },
  ])
}
