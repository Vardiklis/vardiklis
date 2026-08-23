import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { D, VARDAI, kiek } from './ketvirtokams-bendra'
import { juostuSchema } from './ketvirtokams-vaizdai'
import { raidinioModelis, svarstykliuLygtis } from './treciokams-algebros-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 4 klasės tema „Lygtys ir raidiniai reiškiniai“ — vienuolika potemių.
 *
 * Anksčiau jos rėmėsi `tiesines-lygtys` ir `raidiniai-reiskiniai`
 * generatoriais, skirtais 7–9 klasėms: pasitaikydavo neigiamų sprendinių,
 * skliaustų atskleidimo ir nežinomojo abiejose pusėse.
 *
 * Skirtumas tarp potemių čia yra ne skaičiuose, o klausimo kryptyje: viena
 * moko atskirti lygtį nuo reiškinio, kita — sudaryti lygtį iš sakinio, trečia
 * — iš schemos, ketvirta — ją išspręsti, penkta — patikrinti sprendinį. Todėl
 * kiekviena turi savo generatorių.
 */

const RAIDES = ['x', 'a', 'b', 'c', 'y', 'm'] as const

/** Vieno veiksmo lygtis su natūraliuoju sprendiniu. */
type Lygtis = {
  /** Užrašas be `$`. */
  tekstas: string
  sprendinys: number
  /** Kaip randamas nežinomasis. */
  paaiskinimas: string
}

function vienoVeiksmoLygtis(raide: string): Lygtis {
  const pavidalas = pasirink(['demuo', 'turinys', 'ateminys', 'daugiklis', 'dalinys'] as const)

  if (pavidalas === 'demuo') {
    const x = atsitiktinis(12, 480)
    const b = atsitiktinis(15, 320)
    return {
      tekstas: `${raide} + ${b} = ${x + b}`,
      sprendinys: x,
      paaiskinimas: `Nežinomas dėmuo randamas iš sumos atėmus žinomą dėmenį: $${x + b} - ${b} = ${x}$.`,
    }
  }
  if (pavidalas === 'turinys') {
    const b = atsitiktinis(15, 320)
    const skirtumas = atsitiktinis(12, 480)
    return {
      tekstas: `${raide} - ${b} = ${skirtumas}`,
      sprendinys: b + skirtumas,
      paaiskinimas: `Turinys randamas prie skirtumo pridėjus atėminį: $${skirtumas} + ${b} = ${b + skirtumas}$.`,
    }
  }
  if (pavidalas === 'ateminys') {
    const turinys = atsitiktinis(120, 900)
    const x = atsitiktinis(15, turinys - 10)
    return {
      tekstas: `${turinys} - ${raide} = ${turinys - x}`,
      sprendinys: x,
      paaiskinimas: `Atėminys randamas iš turinio atėmus skirtumą: $${turinys} - ${turinys - x} = ${x}$.`,
    }
  }
  if (pavidalas === 'daugiklis') {
    const b = atsitiktinis(3, 9)
    const x = atsitiktinis(12, 120)
    return {
      tekstas: `${b} \\cdot ${raide} = ${b * x}`,
      sprendinys: x,
      paaiskinimas: `Nežinomas daugiklis randamas sandaugą padalijus iš žinomo daugiklio: $${b * x} : ${b} = ${x}$.`,
    }
  }
  const b = atsitiktinis(3, 9)
  const dalmuo = atsitiktinis(12, 120)
  return {
    tekstas: `${raide} : ${b} = ${dalmuo}`,
    sprendinys: b * dalmuo,
    paaiskinimas: `Dalinys randamas dalmenį padauginus iš daliklio: $${dalmuo} \\cdot ${b} = ${b * dalmuo}$.`,
  }
}

// ── 5.1 Kas yra lygtis? ─────────────────────────────────────────────────────

const T1 = 'lygties-savoka'

const A_LYGTIS = [
  {
    klausimas: 'Kuris užrašas yra lygtis: $45 + x = 80$, $34 + 27$ ar $72 : 8$?',
    atsakymas: 'a',
    atsakymasRodymui: '$45 + x = 80$',
    sprendimas: 'Lygtis turi lygybės ženklą ir nežinomąjį.',
  },
] as const

export const lygtiesSavoka: Generatorius = () => suBandymais(kurkLygtiesSavoka, A_LYGTIS, T1)

function kurkLygtiesSavoka(): Uzdavinys | null {
  const raide = pasirink(RAIDES)
  const a = atsitiktinis(12, 90)
  const b = atsitiktinis(12, 90)

  return variacija([
    // 1. Atrinkti lygtį iš trijų užrašų
    () => {
      const variantai = sumaisyk([
        `$${a} + ${raide} = ${a + b}$`,
        `$${a} + ${b}$`,
        `$${a + b} : ${a}$`,
      ])
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuris užrašas yra lygtis?',
        variantai,
        teisingas: variantai.findIndex((v) => v.includes('=')),
        sprendimas: 'Lygtyje turi būti ir lygybės ženklas, ir nežinomasis, žymimas raide.',
      })
    },

    // 2. Ar duotas užrašas yra lygtis
    () => {
      const k = atsitiktinis(3, 9)
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Ar užrašas $${k} \\cdot ${raide} = ${k * a}$ yra lygtis?`,
        variantai: [
          'taip — yra lygybės ženklas ir nežinomasis',
          'ne — nežinomasis negali būti dauginamas',
          'ne — tai tik reiškinys',
        ],
        teisingas: 0,
        sprendimas: 'Lygtis yra lygybė su nežinomuoju; koks veiksmas atliekamas, reikšmės neturi.',
      })
    },

    // 3. Kuo lygtis skiriasi nuo reiškinio
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuo lygtis skiriasi nuo raidinio reiškinio?',
        variantai: [
          'lygtyje yra lygybės ženklas, o reiškinyje jo nėra',
          'lygtyje raidė gali būti tik x',
          'reiškinyje negali būti daugybos',
          'lygtyje visada yra du nežinomieji',
        ],
        teisingas: 0,
        sprendimas: `$${raide} + ${a}$ yra reiškinys, o $${raide} + ${a} = ${a + b}$ — lygtis.`,
      }),

    // 4. Ar kiekviena lygybė yra lygtis
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Mokinys teigia, kad kiekvienas užrašas su lygybės ženklu yra lygtis. Ar jis teisus?`,
        variantai: [
          `ne — $${a} + ${b} = ${a + b}$ yra tiesiog teisinga lygybė, be nežinomojo`,
          'taip — lygybės ženklas ir daro užrašą lygtimi',
          'ne — lygtyje lygybės ženklo išvis nebūna',
        ],
        teisingas: 0,
        sprendimas: 'Lygčiai reikia dviejų dalykų: lygybės ženklo ir nežinomojo, kurio reikšmę reikia rasti.',
      }),

    // 5. Lygtis pagal svarstykles
    () => {
      const dezuciu = atsitiktinis(1, 3)
      const x = atsitiktinis(4, 25)
      const svarelis = atsitiktinis(3, 20)
      return uzdavinys(T1, {
        klausimas: `Svarstyklės pusiausvyroje. Kokia yra dešiniosios lėkštės svarelio vertė, jei viena dėžutė sveria ${x}?`,
        atsakymas: String(dezuciu * x + svarelis),
        atsakymasRodymui: `$${dezuciu * x + svarelis}$`,
        sprendimas: `Kairėje yra $${dezuciu} \\cdot ${x} + ${svarelis} = ${dezuciu * x + svarelis}$, tad tiek pat turi būti ir dešinėje.`,
        brezinys: svarstykliuLygtis(
          { dezuciu, svarelis },
          { dezuciu: 0, svarelis: dezuciu * x + svarelis },
        ),
      })
    },

    // 6. Kiek iš keturių užrašų yra lygtys
    () => {
      const uzrasai = [
        `$${a} + ${raide} = ${a + b}$`,
        `$${a} - ${b}$`,
        `$${raide} \\cdot 4 = ${4 * b}$`,
        `$${a} + ${b} = ${a + b}$`,
      ]
      return uzdavinys(T1, {
        klausimas: `Kiek iš šių užrašų yra lygtys: ${uzrasai.join(', ')}?`,
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: `Lygtys yra tik tos dvi, kuriose greta lygybės ženklo yra ir nežinomasis. $${a} + ${b} = ${a + b}$ yra teisinga lygybė be nežinomojo, o $${a} - ${b}$ — tik reiškinys.`,
      })
    },

    // 7. Kokio ženklo trūksta
    () => {
      const x = atsitiktinis(12, 90)
      return uzdavinys(T1, {
        klausimas: `Užrašas $${raide} + ${a} \\;\\square\\; ${a + x}$ turi tapti lygtimi. Kokia tada yra ${raide} reikšmė?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${raide} = ${x}$`,
        sprendimas: `Įrašius lygybės ženklą gaunama lygtis $${raide} + ${a} = ${a + x}$, tad $${raide} = ${a + x} - ${a} = ${x}$.`,
      })
    },
  ])
}

// ── 5.2 Nežinomasis ir sprendinys ───────────────────────────────────────────

const T2 = 'lygties-nezinomasis'

const A_NEZINOMASIS = [
  {
    klausimas: 'Kuris skaičius yra lygties $x + 12 = 30$ sprendinys?',
    atsakymas: '18',
    atsakymasRodymui: '$18$',
    sprendimas: '$30 - 12 = 18$.',
  },
] as const

export const lygtiesNezinomasis: Generatorius = () =>
  suBandymais(kurkNezinomaji, A_NEZINOMASIS, T2)

function kurkNezinomaji(): Uzdavinys | null {
  const raide = pasirink(RAIDES)
  const l = vienoVeiksmoLygtis(raide)

  return variacija([
    // 1. Kuris skaičius yra sprendinys
    () => {
      const variantai = sumaisyk([
        String(l.sprendinys),
        String(l.sprendinys + atsitiktinis(2, 9)),
        String(Math.max(1, l.sprendinys - atsitiktinis(2, 9))),
      ])
      if (new Set(variantai).size < 3) return null
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kuris skaičius yra lygties $${l.tekstas}$ sprendinys?`,
        variantai,
        teisingas: variantai.indexOf(String(l.sprendinys)),
        sprendimas: l.paaiskinimas,
      })
    },

    // 2. Kuri raidė yra nežinomasis
    () =>
      uzdavinys(T2, {
        klausimas: `Lygtyje $${l.tekstas}$ nurodyk nežinomojo reikšmę.`,
        atsakymas: String(l.sprendinys),
        atsakymasRodymui: `$${raide} = ${l.sprendinys}$`,
        sprendimas: `Nežinomasis čia žymimas raide ${raide}. ${l.paaiskinimas}`,
      }),

    // 3. Kas yra sprendinys
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kas vadinama lygties sprendiniu?',
        variantai: [
          'skaičius, kurį įrašius vietoj raidės lygybė tampa teisinga',
          'bet kuris skaičius, kurį galima įrašyti vietoj raidės',
          'raidė, kuria žymimas nežinomasis',
          'veiksmas, kurį reikia atlikti',
        ],
        teisingas: 0,
        sprendimas: `Lygties $${l.tekstas}$ sprendinys yra $${l.sprendinys}$ — tik su juo abi pusės tampa lygios.`,
      }),

    // 4. Ar duotas skaičius yra sprendinys
    () => {
      const spejamas = l.sprendinys + pasirink([-3, -2, 2, 3])
      if (spejamas <= 0) return null
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Ar skaičius ${spejamas} yra lygties $${l.tekstas}$ sprendinys?`,
        variantai: [
          `ne, sprendinys yra ${l.sprendinys}`,
          'taip, lygybė tampa teisinga',
          'to patikrinti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: l.paaiskinimas,
      })
    },

    // 5. Kiek sprendinių turi lygtis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kiek sprendinių turi lygtis $${l.tekstas}$?`,
        variantai: ['vieną', 'du', 'nė vieno', 'be galo daug'],
        teisingas: 0,
        sprendimas: `Tik su $${raide} = ${l.sprendinys}$ abi lygties pusės tampa lygios; su bet kuriuo kitu skaičiumi — ne.`,
      }),

    // 6. Nežinomasis iš schemos
    () => {
      const dezuciu = atsitiktinis(2, 4)
      const x = atsitiktinis(6, 40)
      return uzdavinys(T2, {
        klausimas: 'Svarstyklės pusiausvyroje. Kokia yra vienos dėžutės masė?',
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Kairėje ${dezuciu} vienodos dėžutės, dešinėje — ${dezuciu * x}. Vadinasi, viena dėžutė sveria $${dezuciu * x} : ${dezuciu} = ${x}$.`,
        brezinys: svarstykliuLygtis({ dezuciu, svarelis: 0 }, { dezuciu: 0, svarelis: dezuciu * x }),
      })
    },

    // 7. Klaidos radimas
    () => {
      const klaidingas = l.sprendinys + pasirink([-10, -5, 5, 10])
      if (klaidingas <= 0) return null
      return uzdavinys(T2, {
        klausimas: `Mokinys teigia, kad lygties $${l.tekstas}$ sprendinys yra ${klaidingas}. Užrašyk teisingą sprendinį.`,
        atsakymas: String(l.sprendinys),
        atsakymasRodymui: `$${raide} = ${l.sprendinys}$`,
        sprendimas: l.paaiskinimas,
      })
    },
  ])
}

// ── 5.3 Lygtis pagal tekstinę sąlygą ────────────────────────────────────────

const T3 = 'lygtis-pagal-salyga'

const A_LYGTIS_SALYGA = [
  {
    klausimas: 'Dėžėje buvo obuolių. Įdėjus dar 12, jų tapo 40. Kiek obuolių buvo iš pradžių?',
    atsakymas: '28',
    atsakymasRodymui: '$28$',
    sprendimas: 'Lygtis $x + 12 = 40$, tad $x = 28$.',
  },
] as const

export const lygtisPagalSalyga: Generatorius = () =>
  suBandymais(kurkLygtiPagalSalyga, A_LYGTIS_SALYGA, T3)

function kurkLygtiPagalSalyga(): Uzdavinys | null {
  const vardas = pasirink(VARDAI)
  const x = atsitiktinis(15, 240)

  return variacija([
    // 1. Sudėties lygtis
    () => {
      const priedas = atsitiktinis(8, 60)
      return uzdavinys(T3, {
        klausimas: `Dėžėje buvo obuolių. Įdėjus dar ${priedas}, jų tapo ${x + priedas}. Kiek obuolių buvo iš pradžių?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Lygtis: $x + ${priedas} = ${x + priedas}$, tad $x = ${x + priedas} - ${priedas} = ${x}$.`,
      })
    },

    // 2. Atimties lygtis
    () => {
      const isvyko = atsitiktinis(8, 60)
      return uzdavinys(T3, {
        klausimas: `Autobuse važiavo keleiviai. Išlipus ${isvyko}, liko ${x}. Kiek keleivių buvo iš pradžių?`,
        atsakymas: String(x + isvyko),
        atsakymasRodymui: `$${x + isvyko}$`,
        sprendimas: `Lygtis: $x - ${isvyko} = ${x}$, tad $x = ${x} + ${isvyko} = ${x + isvyko}$.`,
      })
    },

    // 3. Daugybos lygtis
    () => {
      const deziu = atsitiktinis(3, 9)
      const dezeje = atsitiktinis(6, 40)
      return uzdavinys(T3, {
        klausimas: `${deziu} vienodose dėžėse iš viso ${deziu * dezeje} sąsiuviniai. Kiek sąsiuvinių vienoje dėžėje?`,
        atsakymas: String(dezeje),
        atsakymasRodymui: `$${dezeje}$`,
        sprendimas: `Lygtis: $${deziu} \\cdot x = ${deziu * dezeje}$, tad $x = ${deziu * dezeje} : ${deziu} = ${dezeje}$.`,
      })
    },

    // 4. Dalybos lygtis
    () => {
      const daliu = atsitiktinis(3, 8)
      const dalis = atsitiktinis(6, 40)
      return uzdavinys(T3, {
        klausimas: `Saldainiai išdalyti po lygiai ${daliu} vaikams, ir kiekvienas gavo po ${dalis}. Kiek saldainių buvo?`,
        atsakymas: String(daliu * dalis),
        atsakymasRodymui: `$${daliu * dalis}$`,
        sprendimas: `Lygtis: $x : ${daliu} = ${dalis}$, tad $x = ${dalis} \\cdot ${daliu} = ${daliu * dalis}$.`,
      })
    },

    // 5. Parinkti tinkamą lygtį
    () => {
      const priedas = atsitiktinis(8, 60)
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Kuri lygtis atitinka sąlygą: „${vardas} turėjo pinigų, gavo dar ${priedas} Eur ir dabar turi ${x + priedas} Eur“?`,
        variantai: [
          `$x + ${priedas} = ${x + priedas}$`,
          `$x - ${priedas} = ${x + priedas}$`,
          `$${priedas} \\cdot x = ${x + priedas}$`,
          `$x : ${priedas} = ${x + priedas}$`,
        ],
        teisingas: 0,
        sprendimas: `Prie turėtos sumos pridedama gauta, ir gaunama dabartinė: $x + ${priedas} = ${x + priedas}$.`,
      })
    },

    // 6. Klaida sudarant lygtį
    () => {
      const isvyko = atsitiktinis(8, 60)
      return uzdavinys(T3, {
        klausimas: `Sąlyga: „Buvo keleivių, ${isvyko} išlipo, liko ${x}.“ ${vardas} sudarė lygtį $x + ${isvyko} = ${x}$. Kokia turi būti nežinomojo reikšmė pagal teisingą lygtį?`,
        atsakymas: String(x + isvyko),
        atsakymasRodymui: `$${x + isvyko}$`,
        sprendimas: `Teisinga lygtis yra $x - ${isvyko} = ${x}$, nes keleivių sumažėjo. Tada $x = ${x + isvyko}$.`,
      })
    },

    // 7. Dviejų žingsnių sąlyga
    () => {
      const kaina = atsitiktinis(3, 12)
      const kiekis = atsitiktinis(3, 8)
      const liko = atsitiktinis(5, 40)
      return uzdavinys(T3, {
        klausimas: `${vardas} nupirko ${kiekis} sąsiuvinius po ${kaina} Eur ir jam liko ${liko} Eur. Kiek pinigų turėjo iš pradžių?`,
        atsakymas: String(kiekis * kaina + liko),
        atsakymasRodymui: `$${kiekis * kaina + liko}$ Eur`,
        sprendimas: `Lygtis: $x - ${kiekis} \\cdot ${kaina} = ${liko}$, tad $x = ${kiekis * kaina} + ${liko} = ${kiekis * kaina + liko}$.`,
      })
    },
  ])
}

// ── 5.4 Lygtis pagal schemą ─────────────────────────────────────────────────

const T4 = 'lygtis-pagal-schema'

const A_LYGTIS_SCHEMA = [
  {
    klausimas: 'Schemoje juosta x ir dar 15 sudaro 60. Kokia yra x reikšmė?',
    atsakymas: '45',
    atsakymasRodymui: '$45$',
    sprendimas: '$x + 15 = 60$, tad $x = 45$.',
  },
] as const

export const lygtisPagalSchema: Generatorius = () =>
  suBandymais(kurkLygtiPagalSchema, A_LYGTIS_SCHEMA, T4)

function kurkLygtiPagalSchema(): Uzdavinys | null {
  const x = atsitiktinis(20, 300)

  return variacija([
    // 1. Juosta ir priedas
    () => {
      const priedas = atsitiktinis(10, 90)
      return uzdavinys(T4, {
        klausimas: 'Kokia yra nežinomos juostos dalies reikšmė?',
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Schema rodo lygtį $x + ${priedas} = ${x + priedas}$, tad $x = ${x}$.`,
        brezinys: juostuSchema(
          [
            { vardas: 'Nežinoma dalis', dalys: x, uzrasas: 'x' },
            { vardas: 'Priedas', dalys: priedas, uzrasas: String(priedas) },
          ],
          `iš viso ${x + priedas}`,
        ),
      })
    },

    // 2. Kelios vienodos dalys
    () => {
      const daliu = atsitiktinis(3, 6)
      const dalis = atsitiktinis(8, 60)
      return uzdavinys(T4, {
        klausimas: 'Visos juostos dalys vienodos. Kokia yra vienos dalies reikšmė?',
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `Schema rodo lygtį $${daliu} \\cdot x = ${daliu * dalis}$, tad $x = ${daliu * dalis} : ${daliu} = ${dalis}$.`,
        brezinys: juostuSchema(
          [
            { vardas: 'Viena dalis', dalys: 1, uzrasas: 'x' },
            { vardas: 'Visos dalys', dalys: daliu, uzrasas: String(daliu * dalis) },
          ],
        ),
      })
    },

    // 3. Kuri lygtis atitinka schemą
    () => {
      const priedas = atsitiktinis(10, 90)
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuri lygtis atitinka schemą?',
        variantai: [
          `$x + ${priedas} = ${x + priedas}$`,
          `$x - ${priedas} = ${x + priedas}$`,
          `$x \\cdot ${priedas} = ${x + priedas}$`,
          `$${priedas} - x = ${x + priedas}$`,
        ],
        teisingas: 0,
        sprendimas: `Abi juostos kartu sudaro $${x + priedas}$, tad prie nežinomos dalies pridedamas ${priedas}.`,
        brezinys: juostuSchema(
          [
            { vardas: 'Nežinoma dalis', dalys: x, uzrasas: 'x' },
            { vardas: 'Priedas', dalys: priedas, uzrasas: String(priedas) },
          ],
          `iš viso ${x + priedas}`,
        ),
      })
    },

    // 4. Svarstyklių schema su svareliu
    () => {
      const dezuciu = atsitiktinis(2, 4)
      const dezute = atsitiktinis(5, 30)
      const svarelis = atsitiktinis(4, 30)
      return uzdavinys(T4, {
        klausimas: 'Svarstyklės pusiausvyroje. Kiek sveria viena dėžutė?',
        atsakymas: String(dezute),
        atsakymasRodymui: `$${dezute}$`,
        sprendimas: `Lygtis: $${dezuciu} \\cdot x + ${svarelis} = ${dezuciu * dezute + svarelis}$. Atėmus ${svarelis} lieka $${dezuciu} \\cdot x = ${dezuciu * dezute}$, tad $x = ${dezute}$.`,
        brezinys: svarstykliuLygtis(
          { dezuciu, svarelis },
          { dezuciu: 0, svarelis: dezuciu * dezute + svarelis },
        ),
      })
    },

    // 5. Skirtumo schema
    () => {
      const skirtumas = atsitiktinis(10, 90)
      return uzdavinys(T4, {
        klausimas: 'Antroji juosta trumpesnė. Kokia yra ilgesniosios juostos reikšmė?',
        atsakymas: String(x + skirtumas),
        atsakymasRodymui: `$${x + skirtumas}$`,
        sprendimas: `Schema rodo lygtį $x - ${skirtumas} = ${x}$, tad ilgesnioji juosta yra $${x + skirtumas}$.`,
        brezinys: juostuSchema([
          { vardas: 'Ilgesnė', dalys: x + skirtumas, uzrasas: 'x' },
          { vardas: 'Trumpesnė', dalys: x, uzrasas: `${x}` },
        ]),
      })
    },

    // 6. Klaida parenkant lygtį
    () => {
      const priedas = atsitiktinis(10, 90)
      return uzdavinys(T4, {
        klausimas: `Schemai, kurioje nežinoma dalis ir dar ${priedas} kartu sudaro ${x + priedas}, mokinys parinko lygtį $x - ${priedas} = ${x + priedas}$. Kokia yra teisinga x reikšmė?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Dalys sudedamos, o ne atimamos: $x + ${priedas} = ${x + priedas}$, tad $x = ${x}$.`,
      })
    },

    // 7. Dvi schemos, viena lygtis
    () => {
      const daliu = atsitiktinis(2, 5)
      const dalis = atsitiktinis(10, 60)
      const priedas = atsitiktinis(5, 40)
      return uzdavinys(T4, {
        klausimas: 'Kokia yra vienos nežinomos dalies reikšmė?',
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `Lygtis: $${daliu} \\cdot x + ${priedas} = ${daliu * dalis + priedas}$. Atėmus ${priedas} lieka $${daliu * dalis}$, tad $x = ${dalis}$.`,
        brezinys: juostuSchema(
          [
            { vardas: 'Nežinomos dalys', dalys: daliu * dalis, uzrasas: `${daliu} × x` },
            { vardas: 'Priedas', dalys: priedas, uzrasas: String(priedas) },
          ],
          `iš viso ${daliu * dalis + priedas}`,
        ),
      })
    },
  ])
}

// ── 5.5 Kaip išspręsti paprastą lygtį? ──────────────────────────────────────

const T5 = 'paprasta-lygtis'

const A_PAPRASTA = [
  {
    klausimas: 'Išspręsk lygtį: $x + 27 = 63$.',
    atsakymas: '36',
    atsakymasRodymui: '$x = 36$',
    sprendimas: '$63 - 27 = 36$.',
  },
] as const

export const paprastaLygtis: Generatorius = () => suBandymais(kurkPaprastaLygti, A_PAPRASTA, T5)

function kurkPaprastaLygti(): Uzdavinys | null {
  const raide = pasirink(RAIDES)

  return variacija([
    // 1. Nežinomas dėmuo
    () => {
      const x = atsitiktinis(15, 480)
      const b = atsitiktinis(12, 320)
      return uzdavinys(T5, {
        klausimas: `Išspręsk lygtį: $${raide} + ${b} = ${x + b}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${raide} = ${x}$`,
        sprendimas: `Nežinomas dėmuo randamas iš sumos atėmus žinomą: $${x + b} - ${b} = ${x}$.`,
      })
    },

    // 2. Nežinomas turinys
    () => {
      const b = atsitiktinis(12, 320)
      const skirtumas = atsitiktinis(15, 480)
      return uzdavinys(T5, {
        klausimas: `Išspręsk lygtį: $${raide} - ${b} = ${skirtumas}$.`,
        atsakymas: String(b + skirtumas),
        atsakymasRodymui: `$${raide} = ${b + skirtumas}$`,
        sprendimas: `Turinys randamas prie skirtumo pridėjus atėminį: $${skirtumas} + ${b} = ${b + skirtumas}$.`,
      })
    },

    // 3. Nežinomas atėminys
    () => {
      const turinys = atsitiktinis(200, 900)
      const x = atsitiktinis(20, turinys - 20)
      return uzdavinys(T5, {
        klausimas: `Išspręsk lygtį: $${turinys} - ${raide} = ${turinys - x}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${raide} = ${x}$`,
        sprendimas: `Atėminys randamas iš turinio atėmus skirtumą: $${turinys} - ${turinys - x} = ${x}$.`,
      })
    },

    // 4. Nežinomas daugiklis
    () => {
      const b = atsitiktinis(3, 9)
      const x = atsitiktinis(12, 120)
      return uzdavinys(T5, {
        klausimas: `Išspręsk lygtį: $${b} \\cdot ${raide} = ${b * x}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${raide} = ${x}$`,
        sprendimas: `Nežinomas daugiklis randamas sandaugą padalijus iš žinomo: $${b * x} : ${b} = ${x}$.`,
      })
    },

    // 5. Nežinomas dalinys
    () => {
      const b = atsitiktinis(3, 9)
      const dalmuo = atsitiktinis(12, 120)
      return uzdavinys(T5, {
        klausimas: `Išspręsk lygtį: $${raide} : ${b} = ${dalmuo}$.`,
        atsakymas: String(b * dalmuo),
        atsakymasRodymui: `$${raide} = ${b * dalmuo}$`,
        sprendimas: `Dalinys randamas dalmenį padauginus iš daliklio: $${dalmuo} \\cdot ${b} = ${b * dalmuo}$.`,
      })
    },

    // 6. Kuriuo veiksmu sprendžiama
    () => {
      const b = atsitiktinis(3, 9)
      const x = atsitiktinis(12, 120)
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kuriuo veiksmu sprendžiama lygtis $${b} \\cdot ${raide} = ${b * x}$?`,
        variantai: ['dalyba', 'daugyba', 'sudėtis', 'atimtis'],
        teisingas: 0,
        sprendimas: `Nežinomas daugiklis randamas dalijant: $${b * x} : ${b} = ${x}$.`,
      })
    },

    // 7. Klaidos radimas
    () => {
      const x = atsitiktinis(15, 300)
      const b = atsitiktinis(12, 200)
      return uzdavinys(T5, {
        klausimas: `Mokinys lygtį $${raide} + ${b} = ${x + b}$ išsprendė sudėdamas: $${raide} = ${x + 2 * b}$. Užrašyk teisingą sprendinį.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${raide} = ${x}$`,
        sprendimas: `Nežinomas dėmuo randamas atimant, o ne sudedant: $${x + b} - ${b} = ${x}$.`,
      })
    },

    // 8. Lygtis su dviem veiksmais
    () => {
      const b = atsitiktinis(2, 6)
      const c = atsitiktinis(5, 60)
      const x = atsitiktinis(6, 60)
      return uzdavinys(T5, {
        klausimas: `Išspręsk lygtį: $${b} \\cdot ${raide} + ${c} = ${b * x + c}$.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${raide} = ${x}$`,
        sprendimas: `Pirmiausia atimamas ${c}: $${b} \\cdot ${raide} = ${b * x}$. Tada $${raide} = ${b * x} : ${b} = ${x}$.`,
      })
    },
  ])
}

// ── 5.6 Sprendinio patikra ──────────────────────────────────────────────────

const T6 = 'sprendinio-patikra'

const A_SPRENDINIO_PATIKRA = [
  {
    klausimas: 'Į lygtį $x + 18 = 45$ įrašyk $x = 27$ ir apskaičiuok kairiąją pusę.',
    atsakymas: '45',
    atsakymasRodymui: '$45$',
    sprendimas: '$27 + 18 = 45$ — sutampa su dešiniąja puse, tad sprendinys teisingas.',
  },
] as const

export const sprendinioPatikra: Generatorius = () =>
  suBandymais(kurkSprendinioPatikra, A_SPRENDINIO_PATIKRA, T6)

function kurkSprendinioPatikra(): Uzdavinys | null {
  const raide = pasirink(RAIDES)
  const l = vienoVeiksmoLygtis(raide)

  return variacija([
    // 1. Įrašyti ir apskaičiuoti kairę pusę
    () => {
      const desine = Number(l.tekstas.split('=')[1].trim())
      if (!Number.isFinite(desine)) return null
      return uzdavinys(T6, {
        klausimas: `Į lygtį $${l.tekstas}$ įrašyk $${raide} = ${l.sprendinys}$ ir apskaičiuok kairiąją pusę.`,
        atsakymas: String(desine),
        atsakymasRodymui: `$${desine}$`,
        sprendimas: `Gaunama $${desine}$ — tiek pat, kiek dešinėje pusėje, tad sprendinys teisingas.`,
      })
    },

    // 2. Ar sprendinys teisingas
    () => {
      const spejamas = l.sprendinys + pasirink([-4, -3, 3, 4])
      if (spejamas <= 0) return null
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Ar $${raide} = ${spejamas}$ yra lygties $${l.tekstas}$ sprendinys?`,
        variantai: ['ne, patikrinus pusės nesutampa', 'taip, patikrinus pusės sutampa', 'patikrinti neįmanoma'],
        teisingas: 0,
        sprendimas: `${l.paaiskinimas} Teisingas sprendinys yra $${l.sprendinys}$.`,
      })
    },

    // 3. Kaip tikrinamas sprendinys
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kaip patikrinama, ar rastas lygties sprendinys teisingas?',
        variantai: [
          'jis įrašomas vietoj raidės ir žiūrima, ar abi pusės tampa lygios',
          'jis padauginamas iš dviejų',
          'jis palyginamas su dešiniąja lygties puse',
          'lygtis sprendžiama dar kartą tuo pačiu būdu',
        ],
        teisingas: 0,
        sprendimas: `Įrašius $${raide} = ${l.sprendinys}$ į lygtį $${l.tekstas}$, abi pusės tampa lygios.`,
      }),

    // 4. Kuris iš dviejų sprendinių teisingas
    () => {
      const klaidingas = l.sprendinys + pasirink([-6, -5, 5, 6])
      if (klaidingas <= 0) return null
      const variantai = sumaisyk([String(l.sprendinys), String(klaidingas)])
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Du mokiniai lygtį $${l.tekstas}$ išsprendė skirtingai. Kuris atsakymas teisingas?`,
        variantai: [...variantai, 'abu teisingi'],
        teisingas: variantai.indexOf(String(l.sprendinys)),
        sprendimas: l.paaiskinimas,
      })
    },

    // 5. Patikra atvirkštiniu veiksmu
    () => {
      const b = atsitiktinis(3, 9)
      const x = atsitiktinis(12, 120)
      return uzdavinys(T6, {
        klausimas: `Lygties $${b} \\cdot ${raide} = ${b * x}$ sprendinys yra ${x}. Patikrink jį: padaugink ${x} iš ${b} ir užrašyk rezultatą.`,
        atsakymas: String(b * x),
        atsakymasRodymui: `$${b * x}$`,
        sprendimas: `$${x} \\cdot ${b} = ${b * x}$ — sutampa su lygties dešiniąja puse, tad sprendinys teisingas.`,
      })
    },

    // 6. Kiek trūksta iki lygybės
    () => {
      const x = atsitiktinis(20, 300)
      const b = atsitiktinis(12, 200)
      const spejamas = x - atsitiktinis(3, 12)
      if (spejamas <= 0) return null
      return uzdavinys(T6, {
        klausimas: `Į lygtį $${raide} + ${b} = ${x + b}$ įrašius $${raide} = ${spejamas}$ kairė pusė gaunama mažesnė. Kiek jai trūksta iki dešinės pusės?`,
        atsakymas: String(x - spejamas),
        atsakymasRodymui: `$${x - spejamas}$`,
        sprendimas: `Kairė pusė yra $${spejamas + b}$, dešinė — $${x + b}$. Trūksta $${x + b} - ${spejamas + b} = ${x - spejamas}$.`,
      })
    },

    // 7. Sprendinio patikra tekstiniame uždavinyje
    () => {
      const deziu = atsitiktinis(3, 9)
      const dezeje = atsitiktinis(8, 40)
      return uzdavinys(T6, {
        klausimas: `Uždavinys: „${deziu} dėžėse iš viso ${deziu * dezeje} sąsiuviniai.“ Gautas atsakymas: vienoje dėžėje ${dezeje}. Patikrink jį — kiek sąsiuvinių gaunasi iš viso?`,
        atsakymas: String(deziu * dezeje),
        atsakymasRodymui: `$${deziu * dezeje}$`,
        sprendimas: `$${dezeje} \\cdot ${deziu} = ${deziu * dezeje}$ — sutampa su sąlyga, tad atsakymas teisingas.`,
      })
    },
  ])
}

// ── 5.7 Ta pati situacija — skirtingos lygtys ───────────────────────────────

const T7 = 'skirtingos-lygtys'

const A_SKIRTINGOS = [
  {
    klausimas: 'Situaciją „prie x pridėjus 12 gaunama 40“ galima aprašyti lygtimi $x + 12 = 40$. Kokia kita lygtis tinka tai pačiai situacijai?',
    atsakymas: '28',
    atsakymasRodymui: '$40 - x = 12$, o $x = 28$',
    sprendimas: 'Ta pati situacija aprašoma ir atimtimi.',
  },
] as const

export const skirtingosLygtys: Generatorius = () => suBandymais(kurkSkirtingas, A_SKIRTINGOS, T7)

function kurkSkirtingas(): Uzdavinys | null {
  const x = atsitiktinis(15, 240)
  const b = atsitiktinis(10, 120)

  return variacija([
    // 1. Kuri lygtis aprašo tą pačią situaciją
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Situacija aprašyta lygtimi $x + ${b} = ${x + b}$. Kuri lygtis aprašo tą pačią situaciją?`,
        variantai: [
          `$${x + b} - x = ${b}$`,
          `$x - ${b} = ${x + b}$`,
          `$x \\cdot ${b} = ${x + b}$`,
          `$${b} - x = ${x + b}$`,
        ],
        teisingas: 0,
        sprendimas: `Suma, dėmuo ir kitas dėmuo susiję: jei $x + ${b} = ${x + b}$, tai ir $${x + b} - x = ${b}$.`,
      }),

    // 2. Užrašyti atvirkštinę lygtį — sprendinys nesikeičia
    () =>
      uzdavinys(T7, {
        klausimas: `Lygtį $x + ${b} = ${x + b}$ galima perrašyti kaip $${x + b} - ${b} = x$. Kokia yra x reikšmė?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Abi lygtys aprašo tą pačią situaciją, tad ir sprendinys tas pats: $${x}$.`,
      }),

    // 3. Daugybos ir dalybos pora
    () => {
      const k = atsitiktinis(3, 9)
      const dalis = atsitiktinis(6, 60)
      return pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Situacija: „${k} vienodose dėžėse iš viso ${k * dalis} sąsiuviniai.“ Kurios dvi lygtys ją aprašo?`,
        variantai: [
          `$${k} \\cdot x = ${k * dalis}$ ir $${k * dalis} : ${k} = x$`,
          `$x + ${k} = ${k * dalis}$ ir $${k * dalis} - ${k} = x$`,
          `$x - ${k} = ${k * dalis}$ ir $${k * dalis} + ${k} = x$`,
        ],
        teisingas: 0,
        sprendimas: `Daugyba ir dalyba yra atvirkštiniai veiksmai, tad abi lygtys duoda tą patį $x = ${dalis}$.`,
      })
    },

    // 4. Vienas uždavinys — dvi lygtys
    () => {
      const isvyko = atsitiktinis(10, 80)
      return uzdavinys(T7, {
        klausimas: `Uždavinį „Autobuse buvo keleivių, ${isvyko} išlipo, liko ${x}“ galima aprašyti lygtimi $y - ${isvyko} = ${x}$ arba $y = ${x} + ${isvyko}$. Kiek keleivių buvo?`,
        atsakymas: String(x + isvyko),
        atsakymasRodymui: `$${x + isvyko}$`,
        sprendimas: `Abi lygtys duoda tą patį: $${x} + ${isvyko} = ${x + isvyko}$.`,
      })
    },

    // 5. Klaida: lygtis neaprašo situacijos
    () => {
      const priedas = atsitiktinis(10, 80)
      return uzdavinys(T7, {
        klausimas: `Situacijai „prie nežinomo skaičiaus pridėjus ${priedas} gaunama ${x + priedas}“ mokinys parašė lygtį $x - ${priedas} = ${x + priedas}$. Kokia yra teisinga x reikšmė?`,
        atsakymas: String(x),
        atsakymasRodymui: `$x = ${x}$`,
        sprendimas: `Teisinga lygtis yra $x + ${priedas} = ${x + priedas}$, tad $x = ${x}$.`,
      })
    },

    // 6. Kodėl tinka kelios lygtys
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kodėl tą pačią situaciją galima aprašyti keliomis skirtingomis lygtimis?',
        variantai: [
          'nes sudėtis ir atimtis (kaip ir daugyba su dalyba) yra atvirkštiniai veiksmai',
          'nes lygtys visada turi po kelis sprendinius',
          'nes nežinomąjį galima žymėti skirtingomis raidėmis',
          'nes skaičius galima sukeisti vietomis',
        ],
        teisingas: 0,
        sprendimas: `Iš $x + ${b} = ${x + b}$ iškart gaunama ir $${x + b} - ${b} = x$ — tai ta pati sąsaja, užrašyta kitaip.`,
      }),

    // 7. Trys lygtys — kuri netinka
    () => {
      const k = atsitiktinis(3, 8)
      const dalis = atsitiktinis(6, 40)
      const variantai = [
        `$x : ${k} = ${dalis}$`,
        `$${k} \\cdot ${dalis} = x$`,
        `$x - ${k} = ${dalis}$`,
      ]
      return pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Situacija: „Skaičių padalijus po lygiai į ${k} dalis, kiekvienoje gaunama ${dalis}.“ Kuri lygtis šios situacijos NEaprašo?`,
        variantai,
        teisingas: 2,
        sprendimas: `Dalybą aprašo pirmosios dvi lygtys, o atimtis su šia situacija nesusijusi. Skaičius yra $${k * dalis}$.`,
      })
    },
  ])
}

// ── 5.8 Kas yra raidinis reiškinys? ─────────────────────────────────────────

const T8 = 'raidinio-reiskinio-savoka'

const A_RAIDINIS = [
  {
    klausimas: 'Kuris užrašas yra raidinis reiškinys: $a + 5$, $7 \\cdot 8$ ar $x + 3 = 10$?',
    atsakymas: 'a',
    atsakymasRodymui: '$a + 5$',
    sprendimas: 'Raidiniame reiškinyje yra raidė, bet nėra lygybės ženklo.',
  },
] as const

export const raidinioReiskinioSavoka: Generatorius = () =>
  suBandymais(kurkRaidiniSavoka, A_RAIDINIS, T8)

function kurkRaidiniSavoka(): Uzdavinys | null {
  const raide = pasirink(RAIDES)
  const a = atsitiktinis(5, 90)

  return variacija([
    // 1. Atrinkti raidinį reiškinį
    () => {
      const variantai = sumaisyk([
        `$${raide} + ${a}$`,
        `$${a} \\cdot ${a + 2}$`,
        `$${raide} + ${a} = ${2 * a}$`,
      ])
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuris užrašas yra raidinis reiškinys?',
        variantai,
        teisingas: variantai.findIndex((v) => v.includes(raide) && !v.includes('=')),
        sprendimas: 'Raidiniame reiškinyje yra raidė, bet nėra lygybės ženklo — jis dar nieko netvirtina.',
      })
    },

    // 2. Ką reiškia raidė
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Ką reiškia raidė reiškinyje $${raide} + ${a}$?`,
        variantai: [
          'bet kurį skaičių, kurio reikšmė dar nenurodyta',
          'visada tą patį skaičių — vienetą',
          'veiksmą, kurį reikia atlikti',
          'atsakymą į uždavinį',
        ],
        teisingas: 0,
        sprendimas: `Kol raidės reikšmė nenurodyta, reiškinys $${raide} + ${a}$ neturi vienos reikšmės.`,
      }),

    // 3. Užrašyti reiškinį pagal žodžius
    () => {
      const k = atsitiktinis(4, 20)
      return pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Kuris reiškinys atitinka žodžius „skaičius ${raide} ir dar ${k} daugiau“?`,
        variantai: [`$${raide} + ${k}$`, `$${raide} - ${k}$`, `$${k} - ${raide}$`, `$${raide} \\cdot ${k}$`],
        teisingas: 0,
        sprendimas: '„Daugiau“ reiškia pridėjimą.',
      })
    },

    // 4. Reiškinys ar lygtis
    () =>
      poruUzdavinys(naujasId(T8), T8, {
        klausimas: 'Susiek užrašą su tuo, kas jis yra.',
        poros: [
          { kaire: `$${raide} + ${a}$`, desine: 'raidinis reiškinys' },
          { kaire: `$${raide} + ${a} = ${2 * a}$`, desine: 'lygtis' },
          { kaire: `$${a} + ${a + 3}$`, desine: 'skaitinis reiškinys' },
        ],
        sprendimas: 'Raidė be lygybės ženklo — raidinis reiškinys; raidė su lygybe — lygtis; be raidės — skaitinis reiškinys.',
      }),

    // 5. Klaidingas teiginys
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: `Mokinys sako, kad $${raide} + ${a} = ${2 * a}$ yra raidinis reiškinys. Kas čia ne taip?`,
        variantai: [
          'tai lygtis, nes yra lygybės ženklas',
          'reiškinyje negali būti sudėties',
          `raidė ${raide} raidiniams reiškiniams netinka`,
          'nieko — mokinys teisus',
        ],
        teisingas: 0,
        sprendimas: 'Raidinis reiškinys tik nurodo veiksmus; kai atsiranda lygybės ženklas, užrašas tampa lygtimi.',
      }),

    // 6. Kodėl reiškinys neturi vieno atsakymo
    () => {
      const r1 = atsitiktinis(2, 20)
      const r2 = r1 + atsitiktinis(3, 20)
      return uzdavinys(T8, {
        klausimas: `Kiek skiriasi reiškinio $${raide} + ${a}$ reikšmės, kai $${raide} = ${r1}$ ir kai $${raide} = ${r2}$?`,
        atsakymas: String(r2 - r1),
        atsakymasRodymui: `$${r2 - r1}$`,
        sprendimas: `Reikšmės yra $${r1 + a}$ ir $${r2 + a}$; jos skiriasi tiek, kiek ir raidės reikšmės: $${r2 - r1}$. Todėl raidinis reiškinys ir neturi vieno atsakymo, kol raidės reikšmė nenurodyta.`,
      })
    },

    // 7. Kiek raidinių reiškinių sąraše
    () => {
      const uzrasai = [
        `$${raide} + ${a}$`,
        `$${a} \\cdot 8$`,
        `$${a} - ${raide}$`,
        `$${raide} = ${a}$`,
      ]
      return uzdavinys(T8, {
        klausimas: `Kiek iš šių užrašų yra raidiniai reiškiniai: ${uzrasai.join(', ')}?`,
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: `Raidiniai reiškiniai yra $${raide} + ${a}$ ir $${a} - ${raide}$. $${a} \\cdot 8$ neturi raidės, o $${raide} = ${a}$ yra lygtis.`,
      })
    },
  ])
}

// ── 5.9 Raidinio reiškinio reikšmė ──────────────────────────────────────────

const T9 = 'raidinio-reiskinio-reiksme'

const A_REIKSME = [
  {
    klausimas: 'Apskaičiuok $a + 25$, kai $a = 40$.',
    atsakymas: '65',
    atsakymasRodymui: '$65$',
    sprendimas: 'Vietoj $a$ įrašomas 40: $40 + 25 = 65$.',
  },
] as const

export const raidinioReiskinioReiksme: Generatorius = () =>
  suBandymais(kurkReiksme, A_REIKSME, T9)

function kurkReiksme(): Uzdavinys | null {
  const raide = pasirink(RAIDES)

  return variacija([
    // 1. Sudėtis
    () => {
      const a = atsitiktinis(12, 480)
      const b = atsitiktinis(15, 320)
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok $${raide} + ${b}$, kai $${raide} = ${a}$.`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Vietoj $${raide}$ įrašomas ${a}: $${a} + ${b} = ${a + b}$.`,
      })
    },

    // 2. Atimtis
    () => {
      const a = atsitiktinis(120, 900)
      const b = atsitiktinis(15, a - 10)
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok $${a} - ${raide}$, kai $${raide} = ${b}$.`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${a - b}$`,
        sprendimas: `$${a} - ${b} = ${a - b}$.`,
      })
    },

    // 3. Daugyba
    () => {
      const k = atsitiktinis(3, 9)
      const d = atsitiktinis(6, 90)
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok $${k} \\cdot ${raide}$, kai $${raide} = ${d}$.`,
        atsakymas: String(k * d),
        atsakymasRodymui: `$${k * d}$`,
        sprendimas: `$${k} \\cdot ${d} = ${k * d}$.`,
      })
    },

    // 4. Dalyba
    () => {
      const e = atsitiktinis(3, 9)
      const dalmuo = atsitiktinis(6, 90)
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok $${e * dalmuo} : ${raide}$, kai $${raide} = ${e}$.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `$${e * dalmuo} : ${e} = ${dalmuo}$.`,
      })
    },

    // 5. Du veiksmai
    () => {
      const k = atsitiktinis(3, 9)
      const b = atsitiktinis(5, 60)
      const d = atsitiktinis(4, 40)
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok $${k} \\cdot ${raide} + ${b}$, kai $${raide} = ${d}$.`,
        atsakymas: String(k * d + b),
        atsakymasRodymui: `$${k * d + b}$`,
        sprendimas: `Pirma daugyba: $${k} \\cdot ${d} = ${k * d}$, tada $${k * d} + ${b} = ${k * d + b}$.`,
      })
    },

    // 6. Atimtis su daugyba
    () => {
      const k = atsitiktinis(3, 9)
      const d = atsitiktinis(4, 12)
      const a = k * d + atsitiktinis(20, 200)
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok $${a} - ${k} \\cdot ${raide}$, kai $${raide} = ${d}$.`,
        atsakymas: String(a - k * d),
        atsakymasRodymui: `$${a - k * d}$`,
        sprendimas: `Pirma daugyba: $${k} \\cdot ${d} = ${k * d}$, tada $${a} - ${k * d} = ${a - k * d}$.`,
      })
    },

    // 7. Kuri reikšmė duoda didžiausią rezultatą
    () => {
      const b = atsitiktinis(50, 400)
      const trys = sumaisyk([atsitiktinis(5, 30), atsitiktinis(35, 70), atsitiktinis(75, 120)])
      const didz = Math.max(...trys)
      return pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: `Kuri $${raide}$ reikšmė duoda didžiausią reiškinio $${raide} + ${b}$ reikšmę?`,
        variantai: trys.map(String),
        teisingas: trys.indexOf(didz),
        sprendimas: `Prie ${b} pridedama vis daugiau, tad didžiausią rezultatą duoda didžiausia $${raide}$ reikšmė: $${didz} + ${b} = ${didz + b}$.`,
      })
    },

    // 8. Klaidos radimas
    () => {
      const k = atsitiktinis(4, 9)
      const d = atsitiktinis(4, 12)
      return uzdavinys(T9, {
        klausimas: `Mokinys, kai $${raide} = ${d}$, reiškinį $${k} \\cdot ${raide}$ apskaičiavo $${k + d}$. Užrašyk teisingą reikšmę.`,
        atsakymas: String(k * d),
        atsakymasRodymui: `$${k * d}$`,
        sprendimas: `Reikia dauginti, o ne sudėti: $${k} \\cdot ${d} = ${k * d}$.`,
      })
    },
  ])
}

// ── 5.10 Raidinis reiškinys pagal sąlygą ────────────────────────────────────

const T10 = 'raidinis-pagal-salyga'

const A_RAIDINIS_SALYGA = [
  {
    klausimas: 'Knyga kainuoja $a$ eurų, o sąsiuvinis 3 eurais pigiau. Kuris reiškinys nusako sąsiuvinio kainą?',
    atsakymas: 'a',
    atsakymasRodymui: '$a - 3$',
    sprendimas: '„Pigiau“ reiškia atimtį.',
  },
] as const

export const raidinisPagalSalyga: Generatorius = () =>
  suBandymais(kurkRaidiniPagalSalyga, A_RAIDINIS_SALYGA, T10)

function kurkRaidiniPagalSalyga(): Uzdavinys | null {
  const raide = pasirink(RAIDES)
  const k = atsitiktinis(3, 20)

  return variacija([
    // 1. Pigiau — atimtis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Knyga kainuoja $${raide}$ eurų, o sąsiuvinis ${k} eurais pigiau. Kuris reiškinys nusako sąsiuvinio kainą?`,
        variantai: [`$${raide} - ${k}$`, `$${raide} + ${k}$`, `$${k} - ${raide}$`, `$${raide} \\cdot ${k}$`],
        teisingas: 0,
        sprendimas: '„Pigiau“ reiškia, kad kaina mažesnė, tad atimama.',
      }),

    // 2. Įdėjo dar — sudėtis
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Dėžėje yra $${raide}$ obuolių. Įdėjus dar ${k}, kuris reiškinys nusako obuolių skaičių?`,
        variantai: [`$${raide} + ${k}$`, `$${raide} - ${k}$`, `$${raide} \\cdot ${k}$`, `$${raide} : ${k}$`],
        teisingas: 0,
        sprendimas: 'Įdėjus daugiau, kiekis padidėja, tad pridedama.',
      }),

    // 3. Keli vienodi pakeliai — daugyba
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Viename pakelyje yra $${raide}$ lipdukų. Kuris reiškinys nusako, kiek lipdukų yra ${k} tokiuose pakeliuose?`,
        variantai: [`$${k} \\cdot ${raide}$`, `$${raide} + ${k}$`, `$${raide} - ${k}$`, `$${raide} : ${k}$`],
        teisingas: 0,
        sprendimas: 'Vienodų pakelių kiekis randamas dauginant.',
      }),

    // 4. Padalyta po lygiai — dalyba
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `$${raide}$ saldainių padalyta po lygiai ${k} vaikams. Kuris reiškinys nusako, kiek gavo vienas vaikas?`,
        variantai: [`$${raide} : ${k}$`, `$${raide} - ${k}$`, `$${k} : ${raide}$`, `$${raide} \\cdot ${k}$`],
        teisingas: 0,
        sprendimas: 'Dalijant po lygiai atliekama dalyba.',
      }),

    // 5. Du veiksmai
    () => {
      const kiekis = atsitiktinis(3, 8)
      const priedas = atsitiktinis(4, 20)
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Viena knyga kainuoja $${raide}$ eurų. Perkamos ${kiekis} knygos ir dar ${priedas} eurų užrašinė. Kuris reiškinys nusako visą kainą?`,
        variantai: [
          `$${kiekis} \\cdot ${raide} + ${priedas}$`,
          `$${kiekis} \\cdot (${raide} + ${priedas})$`,
          `$${raide} + ${kiekis} + ${priedas}$`,
          `$${kiekis} \\cdot ${raide} - ${priedas}$`,
        ],
        teisingas: 0,
        sprendimas: 'Užrašinė perkama viena, tad jos kaina pridedama tik kartą.',
      })
    },

    // 6. Reiškinio reikšmė iš sąlygos
    () => {
      const reiksme = atsitiktinis(12, 90)
      return uzdavinys(T10, {
        klausimas: `Klasė surinko $${raide}$ kg popieriaus, kita klasė — ${k} kg daugiau. Kiek kilogramų surinko abi klasės kartu, kai $${raide} = ${reiksme}$?`,
        atsakymas: String(2 * reiksme + k),
        atsakymasRodymui: `$${2 * reiksme + k}$ kg`,
        sprendimas: `Bendras kiekis: $${raide} + (${raide} + ${k}) = 2 \\cdot ${raide} + ${k}$. Įrašius ${reiksme}: $${2 * reiksme} + ${k} = ${2 * reiksme + k}$.`,
      })
    },

    // 7. Klaidos radimas
    () => {
      const reiksme = atsitiktinis(20, 90)
      return uzdavinys(T10, {
        klausimas: `Situacijai „$${raide}$ obuolių ir dar ${k}“ mokinys parašė $${raide} - ${k}$. Kokia yra teisingo reiškinio reikšmė, kai $${raide} = ${reiksme}$?`,
        atsakymas: String(reiksme + k),
        atsakymasRodymui: `$${reiksme + k}$`,
        sprendimas: `Teisingas reiškinys yra $${raide} + ${k}$, tad $${reiksme} + ${k} = ${reiksme + k}$.`,
      })
    },

    // 8. Trijų žingsnių sąlyga
    () => {
      const isdalinta = atsitiktinis(10, 40)
      const maiseliu = atsitiktinis(3, 8)
      const reiksme = isdalinta + maiseliu * atsitiktinis(5, 20)
      if ((reiksme - isdalinta) % maiseliu !== 0) return null
      return uzdavinys(T10, {
        klausimas: `Dėžėje buvo $${raide}$ kamuoliukų. ${isdalinta} išdalyta, likusieji po lygiai sudėti į ${maiseliu} maišelius. Kiek kamuoliukų viename maišelyje, kai $${raide} = ${reiksme}$?`,
        atsakymas: String((reiksme - isdalinta) / maiseliu),
        atsakymasRodymui: `$${(reiksme - isdalinta) / maiseliu}$`,
        sprendimas: `Reiškinys: $(${raide} - ${isdalinta}) : ${maiseliu}$. Įrašius: $(${reiksme} - ${isdalinta}) : ${maiseliu} = ${(reiksme - isdalinta) / maiseliu}$.`,
      })
    },
  ])
}

// ── 5.11 Sąlyga, schema ir reiškinys ────────────────────────────────────────

const T11 = 'salyga-schema-reiskinys'

const A_SASAJA = [
  {
    klausimas: 'Schemoje pavaizduota juosta $x$ ir dar 12 vienetų. Kuris reiškinys atitinka schemą?',
    atsakymas: 'a',
    atsakymasRodymui: '$x + 12$',
    sprendimas: 'Juostos ir priedo suma.',
  },
] as const

export const salygaSchemaReiskinys: Generatorius = () => suBandymais(kurkSasaja, A_SASAJA, T11)

function kurkSasaja(): Uzdavinys | null {
  const raide = pasirink(['x', 'a', 'b'] as const)
  const priedas = atsitiktinis(5, 40)
  const daliu = atsitiktinis(2, 5)

  return variacija([
    // 1. Reiškinys pagal juostos schemą
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kuris reiškinys atitinka schemą?',
        variantai: [
          `$${raide} + ${priedas}$`,
          `$${raide} - ${priedas}$`,
          `$${priedas} - ${raide}$`,
          `$${raide} \\cdot ${priedas}$`,
        ],
        teisingas: 0,
        sprendimas: 'Schemoje nežinoma dalis ir priedas sudedami.',
        brezinys: raidinioModelis(1, priedas, raide),
      }),

    // 2. Reiškinys pagal kelių dėžučių modelį
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kuris reiškinys atitinka pavaizduotą modelį?',
        variantai: [
          `$${daliu} \\cdot ${raide}$`,
          `$${raide} + ${daliu}$`,
          `$${raide} : ${daliu}$`,
          `$${raide} - ${daliu}$`,
        ],
        teisingas: 0,
        sprendimas: `Modelyje ${daliu} vienodos dėžutės, kiekvienoje po $${raide}$.`,
        brezinys: raidinioModelis(daliu, 0, raide),
      }),

    // 3. Susieti sąlygą su reiškiniu
    () => {
      const k = atsitiktinis(4, 20)
      return poruUzdavinys(naujasId(T11), T11, {
        klausimas: 'Susiek sąlygą su ją atitinkančiu reiškiniu.',
        poros: [
          { kaire: `dėžėje ${raide} obuolių ir dar ${k}`, desine: `$${raide} + ${k}$` },
          { kaire: `iš ${raide} obuolių ${k} suvalgyta`, desine: `$${raide} - ${k}$` },
          { kaire: `${k} dėžės po ${raide} obuolius`, desine: `$${k} \\cdot ${raide}$` },
        ],
        sprendimas: '„Dar“ reiškia sudėtį, „suvalgyta“ — atimtį, o vienodos dėžės — daugybą.',
      })
    },

    // 4. Kuris iš dviejų reiškinių tinka
    () => {
      const k = atsitiktinis(10, 60)
      return pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Sąlyga: „Iš ${raide} litrų sunaudota ${k} litrų.“ Kuris reiškinys tinka likučiui rasti: $${raide} - ${k}$ ar $${k} - ${raide}$?`,
        variantai: [`$${raide} - ${k}$`, `$${k} - ${raide}$`, 'tinka abu'],
        teisingas: 0,
        sprendimas: `Atimama iš to, kas buvo, tad pirmasis rašomas $${raide}$.`,
      })
    },

    // 5. Iš schemos į reikšmę
    () => {
      const reiksme = atsitiktinis(10, 90)
      return uzdavinys(T11, {
        klausimas: `Modelyje pavaizduotas reiškinys. Kokia jo reikšmė, kai $${raide} = ${reiksme}$?`,
        atsakymas: String(daliu * reiksme + priedas),
        atsakymasRodymui: `$${daliu * reiksme + priedas}$`,
        sprendimas: `Modelis rodo $${daliu} \\cdot ${raide} + ${priedas}$. Įrašius: $${daliu} \\cdot ${reiksme} + ${priedas} = ${daliu * reiksme + priedas}$.`,
        brezinys: raidinioModelis(daliu, priedas, raide),
      })
    },

    // 6. Klaida parenkant reiškinį
    () => {
      const k = atsitiktinis(10, 60)
      const reiksme = atsitiktinis(k + 5, k + 90)
      return uzdavinys(T11, {
        klausimas: `Schemai „iš ${raide} atimta ${k}“ mokinys parinko reiškinį $${k} - ${raide}$. Kokia yra teisingo reiškinio reikšmė, kai $${raide} = ${reiksme}$?`,
        atsakymas: String(reiksme - k),
        atsakymasRodymui: `$${reiksme - k}$`,
        sprendimas: `Teisingas reiškinys yra $${raide} - ${k}$: $${reiksme} - ${k} = ${reiksme - k}$. Mokinio reiškinys duotų neigiamą rezultatą.`,
      })
    },

    // 7. Kaip tekstas padeda parinkti reiškinį
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kaip tekstas padeda parinkti teisingą reiškinį?',
        variantai: [
          'iš jo matyti, kas su kuo lyginama ir koks veiksmas atliekamas',
          'jame visada nurodyta, kokią raidę rašyti',
          'jis pasako atsakymą',
          'jis nurodo, kiek skaičių bus reiškinyje',
        ],
        teisingas: 0,
        sprendimas: 'Žodžiai „daugiau“, „mažiau“, „po lygiai“, „kartų“ tiesiogiai nurodo veiksmą.',
      }),

    // 8. Sąlyga pagal reiškinį
    () => {
      const kiekis = atsitiktinis(3, 8)
      const pinigu = atsitiktinis(5, 30)
      return pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Kuri sąlyga atitinka reiškinį $${kiekis} \\cdot ${raide} + ${pinigu}$?`,
        variantai: [
          `nupirktos ${kiek(kiekis, D.knygos)} po ${raide} Eur ir dar ${pinigu} Eur užrašinė`,
          `nupirkta viena knyga už ${raide} Eur ir ${kiekis} užrašinės po ${pinigu} Eur`,
          `iš ${raide} Eur išleista ${kiekis} kartus po ${pinigu} Eur`,
        ],
        teisingas: 0,
        sprendimas: `Daugiklis ${kiekis} rodo, kiek vienodų prekių, o ${pinigu} pridedama vieną kartą.`,
      })
    },
  ])
}
