import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { D, kiek, sk4, tekstu } from './ketvirtokams-bendra'
import { odometras, odometruEile } from './ketvirtokams-vaizdai'
import { svarstykliuCiferblatas, termometras } from './pirmoku-vaizdai'
import { duLaikrodziai, laikrodis } from './vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 4 klasės tema „Matavimo prietaisai ir rodmenys“ — septynios potemės.
 *
 * Anksčiau jos rėmėsi `matavimo-vienetai`, `laikas` ir `neigiami`
 * generatoriais. Bendra visų potemių taisyklė: rodmuo yra brėžinyje, o ne
 * tekste. Klausimas „perskaityk termometro rodmenį“ be paties termometro
 * matuoja ne skaitymą, o skaitinės reikšmės nurašymą nuo sąlygos.
 *
 * Temperatūra yra vienintelė vieta, kur ketvirtoje klasėje reikia minuso, ir
 * jis čia vartojamas tik kaip skalės padala, o ne kaip veiksmas su neigiamais
 * skaičiais.
 */

/** Laikas minutėmis nuo vidurnakčio → „9:05“. */
function laikas(minutes: number): string {
  const v = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  return `${v}:${String(m).padStart(2, '0')}`
}

/** Trukmė minutėmis → „1 val. 25 min.“ */
function trukme(minutes: number): string {
  const v = Math.floor(minutes / 60)
  const m = minutes % 60
  if (v === 0) return `${m} min.`
  if (m === 0) return `${v} val.`
  return `${v} val. ${m} min.`
}

// ── 6.1 Svarstyklių rodmenys ────────────────────────────────────────────────

const T1 = 'svarstykliu-rodmenys-4'

const A_SVARSTYKLES = [
  {
    klausimas: 'Kiek gramų yra 1 kg?',
    atsakymas: '1000',
    atsakymasRodymui: '$1000$ g',
    sprendimas: 'Kilograme yra 1000 gramų.',
  },
] as const

export const svarstykliuRodmenys4: Generatorius = () =>
  suBandymais(kurkSvarstykles, A_SVARSTYKLES, T1)

function kurkSvarstykles(): Uzdavinys | null {
  const gramai = atsitiktinis(1, 19) * 50

  return variacija([
    // 1. Rodmuo gramais
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek gramų sveria produktas ant svarstyklių?',
        atsakymas: String(gramai),
        atsakymasRodymui: `$${gramai}$ g`,
        sprendimas: `Visas ratas yra 1000 g, tad rodyklė rodo ${gramai} g.`,
        brezinys: svarstykliuCiferblatas(gramai),
      }),

    // 2. Rodmuo kilogramais ir gramais
    () => {
      const kg = atsitiktinis(1, 3)
      const g = atsitiktinis(1, 9) * 100
      return uzdavinys(T1, {
        klausimas: `Ant svarstyklių padėta ${kg} kg ir dar ${g} g. Kiek gramų sveria visas krovinys?`,
        atsakymas: String(kg * 1000 + g),
        atsakymasRodymui: `$${sk4(kg * 1000 + g)}$ g`,
        sprendimas: `$${kg} \\cdot 1000 + ${g} = ${sk4(kg * 1000 + g)}$.`,
        brezinys: svarstykliuCiferblatas(g),
      })
    },

    // 3. Kiek gramų kilograme
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek gramų yra 1 kg?',
        atsakymas: '1000',
        atsakymasRodymui: '$1000$ g',
        sprendimas: 'Kilogramas yra tūkstantis gramų.',
      }),

    // 4. Vienetas obuolių masei
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuriuo vienetu patogiau nusakyti pirktų obuolių masę?',
        variantai: ['kg', 'g', 'l', 'cm'],
        teisingas: 0,
        sprendimas: 'Kelių obuolių masė yra keli šimtai ar tūkstančiai gramų, tad patogiau sakyti kilogramais.',
      }),

    // 5. Palyginimas su kilogramu
    () => {
      const g = atsitiktinis(1, 19) * 50
      if (g === 1000) return null
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Palygink: ${g} g ir 1 kg.`,
        variantai:
          g > 1000
            ? [`${g} g daugiau`, '1 kg daugiau', 'masės vienodos']
            : ['1 kg daugiau', `${g} g daugiau`, 'masės vienodos'],
        teisingas: 0,
        sprendimas: `1 kg yra 1000 g, tad lyginama ${g} g ir 1000 g.`,
      })
    },

    // 6. Dviejų pirkinių suma
    () => {
      const kg = atsitiktinis(1, 3)
      const puse = pasirink([250, 500, 750])
      const g = atsitiktinis(1, 9) * 100
      return uzdavinys(T1, {
        klausimas: `Nupirkta ${kg} kg ${puse} g obuolių ir ${g} g kriaušių. Kiek gramų vaisių iš viso?`,
        atsakymas: String(kg * 1000 + puse + g),
        atsakymasRodymui: `$${sk4(kg * 1000 + puse + g)}$ g`,
        sprendimas: `$${kg * 1000} + ${puse} + ${g} = ${sk4(kg * 1000 + puse + g)}$.`,
      })
    },

    // 7. Klaidos radimas
    () => {
      const g = pasirink([800, 600, 400, 250])
      return uzdavinys(T1, {
        klausimas: `Mokinys svarstyklių rodmenį perskaitė kaip ${g / 100} kg, nors rodyklė rodo ${g} g. Kiek kilogramų tai iš tikrųjų?`,
        atsakymas: String(g / 1000),
        atsakymasRodymui: `$0{,}${g / 100}$ kg`,
        sprendimas: `Kilograme 1000 g, tad ${g} g yra mažiau nei vienas kilogramas.`,
        brezinys: svarstykliuCiferblatas(g),
      })
    },

    // 8. Kuri pakuotė sunkesnė
    () => {
      const g1 = atsitiktinis(6, 9) * 100 + atsitiktinis(0, 9) * 10
      const g2 = atsitiktinis(6, 9) * 100 + atsitiktinis(0, 9) * 10
      if (g1 === g2) return null
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Kuri pakuotė sunkesnė: ${g1} g ar ${g2} g?`,
        variantai:
          g1 > g2 ? [`${g1} g`, `${g2} g`, 'jos vienodos'] : [`${g2} g`, `${g1} g`, 'jos vienodos'],
        teisingas: 0,
        sprendimas: `Abi masės išreikštos gramais, tad lyginami patys skaičiai.`,
      })
    },
  ])
}

// ── 6.2 Laikrodžio rodmenys ─────────────────────────────────────────────────

const T2 = 'laikrodzio-rodmenys'

const A_LAIKRODIS = [
  {
    klausimas: 'Kiek minučių yra vienoje valandoje?',
    atsakymas: '60',
    atsakymasRodymui: '$60$ min.',
    sprendimas: 'Valandoje yra 60 minučių.',
  },
] as const

export const laikrodzioRodmenys: Generatorius = () => suBandymais(kurkLaikrodi, A_LAIKRODIS, T2)

function kurkLaikrodi(): Uzdavinys | null {
  const valanda = atsitiktinis(1, 11)
  const minutes = pasirink([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55])

  return variacija([
    // 1. Perskaityti laiką
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek valandų ir minučių rodo laikrodis? Atsakyk minutėmis nuo valandos pradžios.',
        atsakymas: String(minutes),
        atsakymasRodymui: `$${minutes}$ min. po ${valanda} val.`,
        sprendimas: `Valandinė rodyklė ką tik praėjo ${valanda}, o minutinė rodo ${minutes} minutes.`,
        brezinys: laikrodis(valanda * 60 + minutes),
      }),

    // 2. Kiek minučių valandoje
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek minučių yra vienoje valandoje?',
        atsakymas: '60',
        atsakymasRodymui: '$60$ min.',
        sprendimas: 'Minutinė rodyklė apeina ratą per 60 minučių — tai viena valanda.',
      }),

    // 3. Trukmė tarp dviejų laikų
    () => {
      const nuo = valanda * 60 + minutes
      const trukmes = atsitiktinis(5, 55)
      return uzdavinys(T2, {
        klausimas: `Kiek minučių praeina nuo ${laikas(nuo)} iki ${laikas(nuo + trukmes)}?`,
        atsakymas: String(trukmes),
        atsakymasRodymui: `$${trukmes}$ min.`,
        sprendimas: `Nuo ${laikas(nuo)} iki ${laikas(nuo + trukmes)} praeina ${trukmes} minutės.`,
        brezinys: duLaikrodziai(nuo, nuo + trukmes, 'pradžia', 'pabaiga'),
      })
    },

    // 4. Pamokos trukmė
    () => {
      const nuo = atsitiktinis(8, 13) * 60 + pasirink([0, 5, 10, 15])
      const trukmes = pasirink([40, 45, 50])
      return uzdavinys(T2, {
        klausimas: `Pamoka prasidėjo ${laikas(nuo)} ir baigėsi ${laikas(nuo + trukmes)}. Kiek minučių ji truko?`,
        atsakymas: String(trukmes),
        atsakymasRodymui: `$${trukmes}$ min.`,
        sprendimas: `Nuo ${laikas(nuo)} iki ${laikas(nuo + trukmes)} praeina ${trukmes} min.`,
      })
    },

    // 5. „Pusė“ ir „be ketvirčio“
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kaip skaitmenimis užrašomas laikas „pusė ${valanda + 1}“?`,
        variantai: [
          `${valanda}:30`,
          `${valanda + 1}:30`,
          `${valanda}:15`,
          `${valanda + 1}:00`,
        ],
        teisingas: 0,
        sprendimas: `„Pusė ${valanda + 1}“ reiškia, kad iki ${valanda + 1} liko pusvalandis, tad laikrodis rodo ${valanda}:30.`,
      }),

    // 6. Klaidos radimas
    () => {
      const min = pasirink([35, 40, 45, 50])
      return uzdavinys(T2, {
        klausimas: `Laikrodį, rodantį ${valanda}:${min}, mokinys perskaitė kaip ${valanda - 1 === 0 ? 12 : valanda - 1}:${min}. Kelinta valanda iš tikrųjų? Atsakyk valandų skaičiumi.`,
        atsakymas: String(valanda),
        atsakymasRodymui: `$${valanda}$ val. ${min} min.`,
        sprendimas: `Kai minutinė rodyklė jau prasisukusi daugiau nei pusę rato, valandinė stovi arti kitos valandos, bet dar jos nepasiekusi — tai vis dar ${valanda} valanda.`,
        brezinys: laikrodis(valanda * 60 + min),
      })
    },

    // 7. Kuris laikas vėlesnis
    () => {
      const a = atsitiktinis(13, 20) * 60 + atsitiktinis(0, 55)
      const b = atsitiktinis(13, 20) * 60 + atsitiktinis(0, 55)
      if (a === b) return null
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kuris laikas vėlesnis: ${laikas(a)} ar ${laikas(b)}?`,
        variantai: a > b ? [laikas(a), laikas(b), 'jie sutampa'] : [laikas(b), laikas(a), 'jie sutampa'],
        teisingas: 0,
        sprendimas: 'Pirmiausia lyginamos valandos, o joms sutapus — minutės.',
      })
    },

    // 8. Filmo pabaiga
    () => {
      const nuo = atsitiktinis(15, 19) * 60 + pasirink([0, 15, 30, 45])
      const trukmes = pasirink([85, 95, 105, 115])
      return uzdavinys(T2, {
        klausimas: `Filmas prasidėjo ${laikas(nuo)} ir truko ${trukme(trukmes)}. Kada jis baigėsi? Atsakyk minutėmis po valandos.`,
        atsakymas: String((nuo + trukmes) % 60),
        atsakymasRodymui: `${laikas(nuo + trukmes)}`,
        sprendimas: `${laikas(nuo)} plius ${trukme(trukmes)} yra ${laikas(nuo + trukmes)}.`,
      })
    },
  ])
}

// ── 6.3 Termometro rodmenys ─────────────────────────────────────────────────

const T3 = 'termometro-rodmenys-4'

const A_TERMOMETRAS = [
  {
    klausimas: 'Kuri temperatūra aukštesnė: $+4$ °C ar $-2$ °C?',
    atsakymas: '4',
    atsakymasRodymui: '$+4$ °C',
    sprendimas: 'Visos temperatūros virš nulio yra aukštesnės už esančias žemiau nulio.',
  },
] as const

export const termometroRodmenys4: Generatorius = () =>
  suBandymais(kurkTermometra, A_TERMOMETRAS, T3)

function kurkTermometra(): Uzdavinys | null {
  const t = atsitiktinis(-9, 25)

  return variacija([
    // 1. Perskaityti rodmenį
    () =>
      uzdavinys(T3, {
        klausimas: 'Kokią temperatūrą rodo termometras?',
        atsakymas: String(t),
        atsakymasRodymui: `$${t > 0 ? '+' : ''}${t}$ °C`,
        sprendimas: `Stulpelio viršus yra ties ${t} laipsnio padala.`,
        brezinys: termometras(t),
      }),

    // 2. Kuri temperatūra aukštesnė
    () => {
      const a = atsitiktinis(1, 12)
      const b = -atsitiktinis(1, 9)
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Kuri temperatūra aukštesnė: $+${a}$ °C ar $${b}$ °C?`,
        variantai: [`$+${a}$ °C`, `$${b}$ °C`, 'temperatūros vienodos'],
        teisingas: 0,
        sprendimas: 'Bet kuri temperatūra virš nulio yra aukštesnė už bet kurią žemiau nulio.',
      })
    },

    // 3. Skirtumas nuo nulio
    () => {
      const a = atsitiktinis(3, 20)
      return uzdavinys(T3, {
        klausimas: `Kiek laipsnių skiriasi 0 °C ir $+${a}$ °C?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ °C`,
        sprendimas: `Nuo nulio iki $+${a}$ yra ${a} padalos.`,
      })
    },

    // 4. Kiek pakilo temperatūra
    () => {
      const ryte = -atsitiktinis(1, 8)
      const diena = atsitiktinis(1, 8)
      return uzdavinys(T3, {
        klausimas: `Ryte termometras rodė $${ryte}$ °C, dieną — $+${diena}$ °C. Keliais laipsniais temperatūra pakilo?`,
        atsakymas: String(diena - ryte),
        atsakymasRodymui: `$${diena - ryte}$ °C`,
        sprendimas: `Nuo $${ryte}$ iki nulio — ${-ryte} laipsniai, nuo nulio iki $+${diena}$ — dar ${diena}. Iš viso ${diena - ryte}.`,
        brezinys: termometras(ryte),
      })
    },

    // 5. Klaidingas palyginimas
    () => {
      const a = -atsitiktinis(1, 6)
      const b = atsitiktinis(1, 4)
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Mokinys teigia, kad $${a}$ °C yra šilčiau už $+${b}$ °C. Ar jis teisus?`,
        variantai: [
          `ne, $${a}$ °C yra žemiau nulio, o $+${b}$ °C — virš jo`,
          `taip, nes ${Math.abs(a)} yra didesnis už ${b}`,
          'to palyginti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Prieš nulį esantis minusas rodo šaltį; kuo skaičius po minuso didesnis, tuo šalčiau.',
      })
    },

    // 6. Rikiavimas
    () => {
      const keturios = sumaisyk([-atsitiktinis(5, 9), 0, atsitiktinis(1, 5), -atsitiktinis(1, 4)])
      if (new Set(keturios).size < 4) return null
      const eile = [...keturios].sort((x, y) => x - y)
      return eiliskumoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Surikiuok temperatūras nuo žemiausios iki aukščiausios.',
        teisingaEile: eile.map((x) => `$${x > 0 ? '+' : ''}${x}$ °C`),
        sprendimas: 'Žemiausia yra ta, kurios skaičius po minuso didžiausias; toliau eina nulis, o paskui teigiamos.',
      })
    },

    // 7. Kokia buvo ryte
    () => {
      const pakilo = atsitiktinis(4, 12)
      const dabar = atsitiktinis(1, 8)
      return uzdavinys(T3, {
        klausimas: `Nuo ryto iki pietų temperatūra pakilo ${pakilo} laipsniais ir dabar rodo $+${dabar}$ °C. Kokia temperatūra buvo ryte?`,
        atsakymas: String(dabar - pakilo),
        atsakymasRodymui: `$${dabar - pakilo > 0 ? '+' : ''}${dabar - pakilo}$ °C`,
        sprendimas: `$${dabar} - ${pakilo} = ${dabar - pakilo}$.`,
        brezinys: termometras(dabar),
      })
    },

    // 8. Kada žemiau nulio
    () => {
      const keturios = sumaisyk([-atsitiktinis(1, 4), atsitiktinis(1, 9), -atsitiktinis(5, 9), 0])
      if (new Set(keturios).size < 4) return null
      const zemiau = keturios.filter((x) => x < 0).length
      return uzdavinys(T3, {
        klausimas: `Kiek iš šių temperatūrų yra žemiau nulio: ${keturios.map((x) => `$${x > 0 ? '+' : ''}${x}$ °C`).join(', ')}?`,
        atsakymas: String(zemiau),
        atsakymasRodymui: `$${zemiau}$`,
        sprendimas: 'Žemiau nulio yra tos temperatūros, kurios rašomos su minuso ženklu.',
      })
    },
  ])
}

// ── 6.4 Odometro rodmenys ───────────────────────────────────────────────────

const T4 = 'odometro-rodmenys'

const A_ODOMETRAS = [
  {
    klausimas: 'Ką matuoja automobilio odometras?',
    atsakymas: 'a',
    atsakymasRodymui: 'nuvažiuotą kelią',
    sprendimas: 'Odometras rodo, kiek kilometrų automobilis iš viso nuvažiavo.',
  },
] as const

export const odometroRodmenys: Generatorius = () => suBandymais(kurkOdometra, A_ODOMETRAS, T4)

function kurkOdometra(): Uzdavinys | null {
  const km = atsitiktinis(20000, 280000)

  return variacija([
    // 1. Perskaityti rodmenį
    () =>
      uzdavinys(T4, {
        klausimas: 'Kiek kilometrų rodo odometras?',
        atsakymas: String(km),
        atsakymasRodymui: `$${sk4(km)}$ km`,
        sprendimas: `Skaitmenys skaitomi iš eilės, o pirmieji nuliai reikšmės nekeičia: $${sk4(km)}$ km.`,
        brezinys: odometras(km),
      }),

    // 2. Kiek nuvažiuota tarp dviejų rodmenų
    () => {
      const nuvaziuota = atsitiktinis(80, 1400)
      return uzdavinys(T4, {
        klausimas: `Vakar odometras rodė ${tekstu(km)} km, šiandien — ${tekstu(km + nuvaziuota)} km. Kiek kilometrų nuvažiuota?`,
        atsakymas: String(nuvaziuota),
        atsakymasRodymui: `$${sk4(nuvaziuota)}$ km`,
        sprendimas: `$${sk4(km + nuvaziuota)} - ${sk4(km)} = ${sk4(nuvaziuota)}$.`,
      })
    },

    // 3. Ką matuoja odometras
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ką rodo automobilio odometras?',
        variantai: [
          'iš viso nuvažiuotą kelią kilometrais',
          'greitį kilometrais per valandą',
          'kuro kiekį bake',
          'variklio temperatūrą',
        ],
        teisingas: 0,
        sprendimas: 'Odometras kaupia visą nuvažiuotą kelią ir niekada nemažėja.',
      }),

    // 4. Nuliai priekyje
    () => {
      const mazas = atsitiktinis(4200, 9800)
      return uzdavinys(T4, {
        klausimas: `Mokinys odometro rodmenį perskaitė neteisingai, nes į priekyje esančius nulius neatsižvelgė. Kiek kilometrų iš tikrųjų rodo odometras?`,
        atsakymas: String(mazas),
        atsakymasRodymui: `$${sk4(mazas)}$ km`,
        sprendimas: `Priekiniai nuliai skaičiaus nekeičia — rodmuo yra $${sk4(mazas)}$ km, o ne kelis kartus didesnis skaičius.`,
        brezinys: odometras(mazas),
      })
    },

    // 5. Kelionės ilgis
    () => {
      const pradzia = atsitiktinis(100000, 260000)
      const kelione = atsitiktinis(400, 2400)
      return uzdavinys(T4, {
        klausimas: `Kelionės pradžioje odometras rodė ${tekstu(pradzia)} km, pabaigoje — ${tekstu(pradzia + kelione)} km. Kiek kilometrų nuvažiuota?`,
        atsakymas: String(kelione),
        atsakymasRodymui: `$${sk4(kelione)}$ km`,
        sprendimas: `$${sk4(pradzia + kelione)} - ${sk4(pradzia)} = ${sk4(kelione)}$.`,
      })
    },

    // 6. Kuris automobilis nuvažiavo daugiausia
    () => {
      const bazes = [atsitiktinis(40000, 90000), atsitiktinis(40000, 90000), atsitiktinis(40000, 90000)]
      const priedai = sumaisyk([atsitiktinis(100, 400), atsitiktinis(500, 900), atsitiktinis(1000, 1600)])
      const rodmenys = bazes.map((b, i) => ({
        raide: ['A', 'B', 'C'][i],
        km: b + priedai[i],
        priedas: priedai[i],
        baze: b,
      }))
      const daugiausia = rodmenys.reduce((a, b) => (a.priedas > b.priedas ? a : b))
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Vakar odometrai rodė: A — ${tekstu(rodmenys[0].baze)} km, B — ${tekstu(rodmenys[1].baze)} km, C — ${tekstu(rodmenys[2].baze)} km. Šiandienos rodmenys pavaizduoti. Kuriuo automobiliu nuvažiuota daugiausia?`,
        variantai: ['A', 'B', 'C'],
        teisingas: ['A', 'B', 'C'].indexOf(daugiausia.raide),
        sprendimas: rodmenys
          .map((r) => `${r.raide}: $${sk4(r.km)} - ${sk4(r.baze)} = ${sk4(r.priedas)}$ km`)
          .join('; '),
        brezinys: odometruEile(rodmenys.map((r) => ({ raide: r.raide, km: r.km }))),
      })
    },

    // 7. Kilometrai ir metrai
    () => {
      const kilometrai = atsitiktinis(2, 40)
      const metrai = atsitiktinis(200, 900)
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kur didesnis atstumas: ${kilometrai} km ar ${sk4(metrai)} m?`,
        variantai: [`${kilometrai} km`, `$${sk4(metrai)}$ m`, 'atstumai vienodi'],
        teisingas: 0,
        sprendimas: `${kilometrai} km yra $${sk4(kilometrai * 1000)}$ m.`,
      })
    },

    // 8. Rodmuo iš žodžių
    () => {
      const tukst = atsitiktinis(12, 96)
      return uzdavinys(T4, {
        klausimas: `Užrašyk skaitmenimis odometro rodmenį: ${tukst} tūkstančiai kilometrų.`,
        atsakymas: String(tukst * 1000),
        atsakymasRodymui: `$${sk4(tukst * 1000)}$ km`,
        sprendimas: `$${tukst} \\cdot 1000 = ${sk4(tukst * 1000)}$.`,
      })
    },
  ])
}

// ── 6.5 Tinkamo matavimo vieneto parinkimas ─────────────────────────────────

const T5 = 'matavimo-vieneto-parinkimas'

const A_VIENETAS = [
  {
    klausimas: 'Kuriuo vienetu matuojama oro temperatūra?',
    atsakymas: 'a',
    atsakymasRodymui: '°C',
    sprendimas: 'Temperatūra matuojama Celsijaus laipsniais.',
  },
] as const

const OBJEKTAI = [
  { vardas: 'pieno kiekis pakelyje', vienetas: 'l', kiti: ['kg', 'm', 'min'] },
  { vardas: 'žmogaus masė', vienetas: 'kg', kiti: ['g', 'l', 'cm'] },
  { vardas: 'kambario ilgis', vienetas: 'm', kiti: ['cm', 'kg', 'l'] },
  { vardas: 'oro temperatūra', vienetas: '°C', kiti: ['kg', 'm', 'l'] },
  { vardas: 'filmo trukmė', vienetas: 'min', kiti: ['m', 'kg', 'l'] },
  { vardas: 'pieštuko ilgis', vienetas: 'cm', kiti: ['m', 'km', 'kg'] },
  { vardas: 'obuolio masė', vienetas: 'g', kiti: ['kg', 'l', 'cm'] },
  { vardas: 'atstumas tarp miestų', vienetas: 'km', kiti: ['m', 'cm', 'g'] },
] as const

export const matavimoVienetoParinkimas: Generatorius = () =>
  suBandymais(kurkVienetoParinkima, A_VIENETAS, T5)

function kurkVienetoParinkima(): Uzdavinys | null {
  const o = pasirink(OBJEKTAI)

  return variacija([
    // 1. Vienetas objektui
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kuriuo vienetu matuojamas dydis „${o.vardas}“?`,
        variantai: [o.vienetas, ...o.kiti],
        teisingas: 0,
        sprendimas: `„${o.vardas}“ nusakomas ${o.vienetas}.`,
      }),

    // 2. Sugrupuoti objektus
    () => {
      const trys = sumaisyk([...OBJEKTAI]).slice(0, 3)
      if (new Set(trys.map((x) => x.vienetas)).size < 3) return null
      return poruUzdavinys(naujasId(T5), T5, {
        klausimas: 'Susiek dydį su jam tinkamu matavimo vienetu.',
        poros: trys.map((x) => ({ kaire: x.vardas, desine: x.vienetas })),
        sprendimas: 'Ilgis matuojamas metrais ar centimetrais, masė — gramais ar kilogramais, talpa — litrais, laikas — minutėmis.',
      })
    },

    // 3. Gramai ar kilogramai
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kodėl obuolio masei patogiau vartoti gramus, o vaiko masei — kilogramus?',
        variantai: [
          'kad skaičius nebūtų nei per didelis, nei per mažas',
          'nes gramai tikslesni už kilogramus visais atvejais',
          'nes obuolys yra vaisius, o vaikas — ne',
          'nes kilogramais matuojama tik tai, kas gyva',
        ],
        teisingas: 0,
        sprendimas: 'Obuolys sveria apie 150 g — kilogramais tai būtų mažiau nei vienetas; vaikas sveria apie 30 kg — gramais tai 30 000.',
      }),

    // 4. Netinkamas vienetas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Mokinys baseino ilgį išreiškė gramais. Kodėl taip negalima?',
        variantai: [
          'gramais matuojama masė, o ne ilgis',
          'baseinas per didelis gramams',
          'reikėjo naudoti kilogramus',
          'galima, tik skaičius būtų labai didelis',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienas vienetas tinka tik savo dydžiui: ilgiui — metras, masei — gramas.',
      }),

    // 5. Kuris skaičius su kuriuo vienetu
    () => {
      const kg = atsitiktinis(25, 60)
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Ketvirtoko masė yra apie ${kg}. Kokį vienetą reikia prirašyti?`,
        variantai: ['kg', 'g', 'l', 'm'],
        teisingas: 0,
        sprendimas: `${kg} g būtų mažiau nei obuolys, o ${kg} kg — įprasta ketvirtoko masė.`,
      })
    },

    // 6. Talpa
    () => {
      const l = atsitiktinis(2, 9)
      return uzdavinys(T5, {
        klausimas: `Kibire telpa ${l} l vandens. Kiek tai mililitrų?`,
        atsakymas: String(l * 1000),
        atsakymasRodymui: `$${sk4(l * 1000)}$ ml`,
        sprendimas: `Viename litre 1000 ml, tad $${l} \\cdot 1000 = ${sk4(l * 1000)}$.`,
      })
    },

    // 7. Kiek objektų matuojama litrais
    () => {
      const sarasas = ['pienas', 'sultys', 'kelio ilgis', 'kuro kiekis bake', 'oro temperatūra']
      return uzdavinys(T5, {
        klausimas: `Kiek iš šių dydžių matuojama litrais: ${sarasas.join(', ')}?`,
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Litrais matuojama talpa: pienas, sultys ir kuras. Kelio ilgis matuojamas kilometrais, temperatūra — laipsniais.',
      })
    },
  ])
}

// ── 6.6 Skirtingais vienetais išreikštų dydžių palyginimas ──────────────────

const T6 = 'vienetu-palyginimas'

const A_PALYGINIMAS = [
  {
    klausimas: 'Palygink: 1 kg ir 900 g.',
    atsakymas: 'a',
    atsakymasRodymui: '1 kg daugiau',
    sprendimas: '1 kg yra 1000 g, o tai daugiau nei 900 g.',
  },
] as const

export const vienetuPalyginimas: Generatorius = () =>
  suBandymais(kurkVienetuPalyginima, A_PALYGINIMAS, T6)

function kurkVienetuPalyginima(): Uzdavinys | null {
  return variacija([
    // 1. Kilogramai ir gramai
    () => {
      const kg = atsitiktinis(1, 4)
      const g = kg * 1000 + pasirink([-200, -100, 100, 200])
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Palygink: ${kg} kg ir ${sk4(g)} g.`,
        variantai:
          kg * 1000 > g
            ? [`${kg} kg daugiau`, `$${sk4(g)}$ g daugiau`, 'masės vienodos']
            : [`$${sk4(g)}$ g daugiau`, `${kg} kg daugiau`, 'masės vienodos'],
        teisingas: 0,
        sprendimas: `${kg} kg yra $${sk4(kg * 1000)}$ g.`,
      })
    },

    // 2. Metrai ir centimetrai
    () => {
      const m = atsitiktinis(1, 5)
      const cm = m * 100 + pasirink([-30, -20, 20, 30])
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Palygink: ${m} m ir ${cm} cm.`,
        variantai:
          m * 100 > cm
            ? [`${m} m daugiau`, `${cm} cm daugiau`, 'ilgiai vienodi']
            : [`${cm} cm daugiau`, `${m} m daugiau`, 'ilgiai vienodi'],
        teisingas: 0,
        sprendimas: `${m} m yra ${m * 100} cm.`,
      })
    },

    // 3. Valandos ir minutės
    () => {
      const val = atsitiktinis(1, 3)
      const min = val * 60 + pasirink([-20, -15, 15, 20])
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Palygink: ${kiek(val, D.valandos)} ir ${min} min.`,
        variantai:
          val * 60 > min
            ? [`${kiek(val, D.valandos)} daugiau`, `${min} min. daugiau`, 'trukmės vienodos']
            : [`${min} min. daugiau`, `${kiek(val, D.valandos)} daugiau`, 'trukmės vienodos'],
        teisingas: 0,
        sprendimas: `${kiek(val, D.valandos)} yra ${val * 60} min.`,
      })
    },

    // 4. Sudėtinis matas — masė
    () => {
      const kg = atsitiktinis(1, 4)
      const g = atsitiktinis(1, 9) * 100
      const kitas = kg * 1000 + g + pasirink([-150, -50, 50, 150])
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Palygink: ${kg} kg ${g} g ir ${sk4(kitas)} g.`,
        variantai:
          kg * 1000 + g > kitas
            ? [`${kg} kg ${g} g daugiau`, `$${sk4(kitas)}$ g daugiau`, 'masės vienodos']
            : [`$${sk4(kitas)}$ g daugiau`, `${kg} kg ${g} g daugiau`, 'masės vienodos'],
        teisingas: 0,
        sprendimas: `${kg} kg ${g} g yra $${sk4(kg * 1000 + g)}$ g.`,
      })
    },

    // 5. Sudėtinis matas — laikas
    () => {
      const val = atsitiktinis(1, 3)
      const min = atsitiktinis(5, 55)
      const kitas = val * 60 + min + pasirink([-25, -10, 10, 25])
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Palygink: ${val} val. ${min} min. ir ${kitas} min.`,
        variantai:
          val * 60 + min > kitas
            ? [`${val} val. ${min} min. daugiau`, `${kitas} min. daugiau`, 'trukmės vienodos']
            : [`${kitas} min. daugiau`, `${val} val. ${min} min. daugiau`, 'trukmės vienodos'],
        teisingas: 0,
        sprendimas: `${val} val. ${min} min. yra ${val * 60 + min} min.`,
      })
    },

    // 6. Kodėl verčiama į tuos pačius vienetus
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kodėl prieš lyginant dydžius patogu juos išreikšti tais pačiais vienetais?',
        variantai: [
          'nes kitaip lyginami skaičiai, kurie reiškia nevienodo dydžio vienetus',
          'nes skaičiai tampa mažesni',
          'nes taip greičiau skaičiuoti',
          'nes to reikalauja matematikos taisyklės',
        ],
        teisingas: 0,
        sprendimas: '2 m ir 180 cm iš pirmo žvilgsnio atrodo, kad 180 daugiau nei 2 — bet 2 m yra 200 cm.',
      }),

    // 7. Litrai ir mililitrai
    () => {
      const l = atsitiktinis(1, 3)
      const ml = l * 1000 + pasirink([-300, -200, 200, 300])
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Palygink: ${sk4(ml)} ml ir ${l} l.`,
        variantai:
          ml > l * 1000
            ? [`$${sk4(ml)}$ ml daugiau`, `${l} l daugiau`, 'kiekiai vienodi']
            : [`${l} l daugiau`, `$${sk4(ml)}$ ml daugiau`, 'kiekiai vienodi'],
        teisingas: 0,
        sprendimas: `${l} l yra $${sk4(l * 1000)}$ ml.`,
      })
    },

    // 8. Vienodi dydžiai kitais vienetais
    () => {
      const kg = atsitiktinis(2, 5)
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Palygink: ${kg} kg ir ${sk4(kg * 1000)} g.`,
        variantai: ['masės vienodos', `${kg} kg daugiau`, `$${sk4(kg * 1000)}$ g daugiau`],
        teisingas: 0,
        sprendimas: `${kg} kg ir $${sk4(kg * 1000)}$ g yra tas pats dydis, tik užrašytas skirtingais vienetais.`,
      })
    },
  ])
}

// ── 6.7 Uždaviniai su mase, laiku ir temperatūra ────────────────────────────

const T7 = 'mases-laiko-temperaturos-uzdaviniai'

const A_UZDAVINIAI = [
  {
    klausimas: 'Nupirkta 1 kg obuolių ir 500 g kriaušių. Kiek gramų vaisių iš viso?',
    atsakymas: '1500',
    atsakymasRodymui: '$1500$ g',
    sprendimas: '$1000 + 500 = 1500$.',
  },
] as const

export const masesLaikoTemperaturosUzdaviniai: Generatorius = () =>
  suBandymais(kurkMatavimuUzdavini, A_UZDAVINIAI, T7)

function kurkMatavimuUzdavini(): Uzdavinys | null {
  return variacija([
    // 1. Minutės į valandas ir minutes
    () => {
      const min = atsitiktinis(65, 200)
      return uzdavinys(T7, {
        klausimas: `Sriuba virė ${min} min. Kiek pilnų valandų tai sudaro?`,
        atsakymas: String(Math.floor(min / 60)),
        atsakymasRodymui: `$${Math.floor(min / 60)}$ val. ${min % 60} min.`,
        sprendimas: `$${min} : 60 = ${Math.floor(min / 60)}$ (lieka ${min % 60} min.).`,
      })
    },

    // 2. Masių suma
    () => {
      const kg = atsitiktinis(1, 4)
      const g = atsitiktinis(1, 9) * 50
      return uzdavinys(T7, {
        klausimas: `Nupirkta ${kg} kg obuolių ir ${g} g kriaušių. Kiek gramų vaisių iš viso?`,
        atsakymas: String(kg * 1000 + g),
        atsakymasRodymui: `$${sk4(kg * 1000 + g)}$ g`,
        sprendimas: `${kg} kg yra $${sk4(kg * 1000)}$ g, tad $${sk4(kg * 1000)} + ${g} = ${sk4(kg * 1000 + g)}$.`,
      })
    },

    // 3. Temperatūros pokytis
    () => {
      const ryte = -atsitiktinis(1, 8)
      const diena = atsitiktinis(2, 9)
      return uzdavinys(T7, {
        klausimas: `Ryte buvo $${ryte}$ °C, dieną $+${diena}$ °C. Keliais laipsniais pakilo temperatūra?`,
        atsakymas: String(diena - ryte),
        atsakymasRodymui: `$${diena - ryte}$ °C`,
        sprendimas: `Nuo $${ryte}$ iki $+${diena}$ yra ${diena - ryte} laipsniai.`,
      })
    },

    // 4. Kelionės trukmė
    () => {
      const nuo = atsitiktinis(6, 12) * 60 + pasirink([0, 10, 20, 30, 40, 50])
      const trukmes = atsitiktinis(65, 190)
      return uzdavinys(T7, {
        klausimas: `Traukinys išvyko ${laikas(nuo)} ir atvyko ${laikas(nuo + trukmes)}. Kiek minučių truko kelionė?`,
        atsakymas: String(trukmes),
        atsakymasRodymui: `${trukme(trukmes)}`,
        sprendimas: `Nuo ${laikas(nuo)} iki ${laikas(nuo + trukmes)} praeina ${trukme(trukmes)}, tai yra ${trukmes} min.`,
      })
    },

    // 5. Kiek liko
    () => {
      const kg = atsitiktinis(2, 5)
      const panaudota = atsitiktinis(3, 18) * 50
      if (panaudota >= kg * 1000) return null
      return uzdavinys(T7, {
        klausimas: `Iš ${kg} kg obuolių ${panaudota} g panaudota pyragui. Kiek gramų obuolių liko?`,
        atsakymas: String(kg * 1000 - panaudota),
        atsakymasRodymui: `$${sk4(kg * 1000 - panaudota)}$ g`,
        sprendimas: `$${sk4(kg * 1000)} - ${panaudota} = ${sk4(kg * 1000 - panaudota)}$.`,
      })
    },

    // 6. Temperatūra nukrito
    () => {
      const ryte = atsitiktinis(2, 9)
      const nukrito = atsitiktinis(6, 15)
      return uzdavinys(T7, {
        klausimas: `Ryte buvo $+${ryte}$ °C, o vakare temperatūra nukrito ${nukrito} laipsniais. Kokia temperatūra buvo vakare?`,
        atsakymas: String(ryte - nukrito),
        atsakymasRodymui: `$${ryte - nukrito > 0 ? '+' : ''}${ryte - nukrito}$ °C`,
        sprendimas: `$${ryte} - ${nukrito} = ${ryte - nukrito}$.`,
        brezinys: termometras(ryte - nukrito),
      })
    },

    // 7. Kelios trukmės iš eilės
    () => {
      const a = atsitiktinis(60, 180)
      const b = atsitiktinis(20, 60)
      const c = atsitiktinis(40, 120)
      return uzdavinys(T7, {
        klausimas: `Kelionė truko ${trukme(a)}, poilsis ${trukme(b)}, tada dar ${trukme(c)}. Kiek minučių truko viskas kartu?`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `${trukme(a + b + c)}`,
        sprendimas: `$${a} + ${b} + ${c} = ${a + b + c}$ min., tai yra ${trukme(a + b + c)}.`,
      })
    },

    // 8. Klaidos radimas
    () => {
      const kg = atsitiktinis(1, 3)
      const dalis = pasirink([200, 400, 500, 600])
      const g = kg * 1000 + dalis - atsitiktinis(50, 150)
      return uzdavinys(T7, {
        klausimas: `Mokinys teigia, kad ${kg} kg ${dalis} g yra mažiau už ${sk4(g)} g. Kiek gramų iš tikrųjų sveria pirmasis krovinys?`,
        atsakymas: String(kg * 1000 + dalis),
        atsakymasRodymui: `$${sk4(kg * 1000 + dalis)}$ g`,
        sprendimas: `${kg} kg ${dalis} g yra $${sk4(kg * 1000 + dalis)}$ g — daugiau nei $${sk4(g)}$ g.`,
      })
    },
  ])
}
