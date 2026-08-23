import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys } from './formatai'
import { juostineSchema } from './pirmoku-vaizdai'
import { grupes } from './treciokams-vaizdai'
import {
  raidinioModelis,
  svarstykliuLygtis,
} from './treciokams-algebros-vaizdai'
import { daugiakampis, brezinuEile } from './antroku-figuru-vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 3 klasės tema „Lygtys ir raidiniai reiškiniai“ — dešimt potemių.
 *
 * Anksčiau jos rėmėsi `tiesines-lygtys`, `raidiniai-reiskiniai` ir `ornamentai`
 * generatoriais. Pirmieji du skirti 7–8 klasei: pasitaikydavo skliaustų
 * skleidimo, panašių narių sutraukimo ir neigiamų sprendinių.
 *
 * Trečioje klasėje lygtis sprendžiama ne perkeliant narius, o prisimenant
 * veiksmo dalių ryšį: nežinomas dėmuo randamas atimtimi, nežinomas daugiklis —
 * dalyba. Todėl kiekviena potemė turi savo nežinomąjį, o sprendimas visada
 * įvardija tą ryšį.
 */

const RAIDES = ['x', 'a', 'b', 'c', 'y'] as const

function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 1000, 1000)
}

// ── 8.1 Kas yra lygtis? ─────────────────────────────────────────────────────

const A_KAS_LYGTIS = [
  {
    klausimas: 'Kuris užrašas yra lygtis?',
    atsakymas: 'A',
    atsakymasRodymui: 'A — $25 + x = 63$',
    sprendimas: 'Lygtis turi lygybės ženklą ir nežinomąjį.',
  },
] as const

export const kasYraLygtis: Generatorius = () =>
  suBandymais(kurkKasLygtis, A_KAS_LYGTIS, 'kas-yra-lygtis')

function kurkKasLygtis(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const a = atsitiktinis(12, 80)
  const b = atsitiktinis(12, 80)

  return variacija([
    // 1. Kuris užrašas yra lygtis
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-lygtis'), 'kas-yra-lygtis', {
        klausimas: 'Kuris užrašas yra lygtis?',
        variantai: [`$${a} + ${r} = ${a + b}$`, `$${a} + ${b} = ${a + b}$`, `$${a + b} - ${a}$`],
        teisingas: 0,
        sprendimas: 'Lygtyje turi būti ir lygybės ženklas, ir nežinomasis.',
      }),

    // 2. Kuris nėra lygtis, nors turi raidę
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-lygtis'), 'kas-yra-lygtis', {
        klausimas: 'Kuris užrašas nėra lygtis, nors turi raidę?',
        variantai: [`$${r} - ${a}$`, `$${r} + ${a} = ${a + b}$`, `$${a} \\cdot ${r} = ${a * 3}$`],
        teisingas: 0,
        sprendimas: 'Be lygybės ženklo tai tik reiškinys, o ne lygtis.',
      }),

    // 3. Ar užrašas su lygybe visada lygtis
    () =>
      pasirinkimoUzdavinys(naujasId('kas-yra-lygtis'), 'kas-yra-lygtis', {
        klausimas: `Mokinys teigia: „Kiekvienas užrašas su ženklu $=$ yra lygtis.“ Ar jis teisus?`,
        variantai: [
          `ne: $${a} + ${b} = ${a + b}$ turi lygybę, bet neturi nežinomojo`,
          'taip, bet kuris užrašas su lygybe yra lygtis',
          'ne, lygtyje lygybės ženklo išvis nebūna',
        ],
        teisingas: 0,
        sprendimas: 'Lygčiai reikia ir lygybės, ir nežinomojo.',
      }),

    // 4. Lygtis iš svarstyklių
    () => {
      const x = atsitiktinis(10, 60)
      const svarelis = atsitiktinis(10, 60)
      return uzdavinys('kas-yra-lygtis', {
        // Skaičiai yra tik schemoje — lygtį reikia sudaryti pačiam.
        klausimas: 'Svarstyklės pusiausvyroje. Kokia yra dėžutės masė?',
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Lygtis $x + ${svarelis} = ${x + svarelis}$, tad $x = ${
          x + svarelis
        } - ${svarelis} = ${x}$.`,
        brezinys: svarstykliuLygtis(
          { dezuciu: 1, svarelis },
          { dezuciu: 0, svarelis: x + svarelis },
        ),
      })
    },

    // 5. Kiek lygčių sąraše
    () => {
      const uzrasai = sumaisyk([
        { t: `$${a} + ${r} = ${a + b}$`, lygtis: true },
        { t: `$${a * 2} : ${r} = ${a}$`, lygtis: true },
        { t: `$${a} \\cdot ${b}$`, lygtis: false },
        { t: `$${a + b} - ${a} = ${b}$`, lygtis: false },
      ])
      const kiek = uzrasai.filter((u) => u.lygtis).length
      return uzdavinys('kas-yra-lygtis', {
        klausimas: `Kiek iš šių užrašų yra lygtys: ${uzrasai.map((u) => u.t).join('; ')}?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: 'Lygtis yra tik tas užrašas, kuriame yra ir lygybė, ir nežinomasis.',
      })
    },

    // 6. Koks ženklas tinka
    () =>
      uzdavinys('kas-yra-lygtis', {
        klausimas: `Kokį skaičių reikia įrašyti, kad būtų teisinga lygybė: $${a} + \\square = ${
          a + b
        }$?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${a + b} - ${a} = ${b}$.`,
      }),

    // 7. Lygties sprendinys
    () => {
      const sprendinys = atsitiktinis(10, 40)
      return uzdavinys('kas-yra-lygtis', {
        klausimas: `Ar skaičius ${sprendinys} yra lygties $${r} + ${a} = ${
          sprendinys + a
        }$ sprendinys? Parašyk skaičių, kuris yra sprendinys.`,
        atsakymas: String(sprendinys),
        atsakymasRodymui: `$${sprendinys}$`,
        sprendimas: `Įstatę gauname $${sprendinys} + ${a} = ${sprendinys + a}$ — lygybė teisinga.`,
      })
    },
  ])
}

// ── 8.2 Nežinomas dėmuo ─────────────────────────────────────────────────────

const A_DEMUO = [
  {
    klausimas: 'Išspręsk lygtį: $x + 27 = 65$',
    atsakymas: '38',
    atsakymasRodymui: '$38$',
    sprendimas: 'Nežinomas dėmuo randamas atimtimi: $65 - 27 = 38$.',
  },
] as const

export const nezinomasDemuo: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkDemeni(sritis), A_DEMUO, 'nezinomas-demuo')

function kurkDemeni(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const r = pasirink(RAIDES)
  const x = atsitiktinis(15, Math.floor(maks / 2))
  const zinomas = atsitiktinis(15, maks - x)
  const suma = x + zinomas

  return variacija([
    // 1. Nežinomasis kairėje
    () =>
      uzdavinys('nezinomas-demuo', {
        klausimas: `Išspręsk lygtį: $${r} + ${zinomas} = ${suma}$`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Nežinomas dėmuo randamas atimtimi: $${suma} - ${zinomas} = ${x}$.`,
      }),

    // 2. Nežinomasis dešinėje
    () =>
      uzdavinys('nezinomas-demuo', {
        klausimas: `Išspręsk lygtį: $${zinomas} + ${r} = ${suma}$`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `$${suma} - ${zinomas} = ${x}$.`,
      }),

    // 3. Iš juostinės schemos
    () =>
      uzdavinys('nezinomas-demuo', {
        // Skaičiai — tik schemoje: lygtį reikia sudaryti iš to, ką matai.
        klausimas: 'Sudaryk lygtį pagal schemą ir rask nežinomą dalį.',
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Lygtis $${zinomas} + ${r} = ${suma}$, tad $${r} = ${suma} - ${zinomas} = ${x}$.`,
        brezinys: juostineSchema(suma, zinomas, null),
      }),

    // 4. Patikrinimas
    () =>
      uzdavinys('nezinomas-demuo', {
        klausimas: `Lygties $${r} + ${zinomas} = ${suma}$ sprendinys yra ${x}. Kiek gausi patikrindamas veiksmu $${x} + ${zinomas}$?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Turi gautis dešinioji pusė: $${x} + ${zinomas} = ${suma}$.`,
      }),

    // 5. Klaidos radimas
    () => {
      const blogas = suma + zinomas
      if (blogas > maks) return null
      return pasirinkimoUzdavinys(naujasId('nezinomas-demuo'), 'nezinomas-demuo', {
        klausimas: `Mokinys lygtį $${r} + ${zinomas} = ${suma}$ išsprendė $${r} = ${blogas}$. Kur klaida?`,
        variantai: [
          `dėmenys sudėti, o reikėjo atimti: $${suma} - ${zinomas} = ${x}$`,
          `reikėjo dalyti iš ${zinomas}`,
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Nežinomas dėmuo randamas iš sumos atėmus žinomą dėmenį.`,
      })
    },

    // 6. Du žingsniai
    () => {
      const antras = atsitiktinis(10, 60)
      if (x + zinomas + antras > maks) return null
      return uzdavinys('nezinomas-demuo', {
        klausimas: `Išspręsk lygtį $${r} + ${zinomas} = ${suma}$, tada apskaičiuok $${r} + ${antras}$.`,
        atsakymas: String(x + antras),
        atsakymasRodymui: `$${x + antras}$`,
        sprendimas: `$${r} = ${suma} - ${zinomas} = ${x}$, tada $${x} + ${antras} = ${x + antras}$.`,
      })
    },

    // 7. Lygtis pagal sąlygą
    () =>
      uzdavinys('nezinomas-demuo', {
        klausimas: `Prie nežinomo skaičiaus pridėjus ${zinomas} gaunama ${suma}. Koks tas skaičius?`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Lygtis $${r} + ${zinomas} = ${suma}$, tad $${r} = ${x}$.`,
      }),
  ])
}

// ── 8.3 Nežinomas turinys ar atėminys ───────────────────────────────────────

const A_TURINYS = [
  {
    klausimas: 'Išspręsk lygtį: $x - 28 = 47$',
    atsakymas: '75',
    atsakymasRodymui: '$75$',
    sprendimas: 'Nežinomas turinys randamas sudėtimi: $47 + 28 = 75$.',
  },
] as const

export const nezinomasTurinys: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkTurini(sritis), A_TURINYS, 'nezinomas-turinys')

function kurkTurini(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const r = pasirink(RAIDES)
  const ateminys = atsitiktinis(15, Math.floor(maks / 3))
  const skirtumas = atsitiktinis(15, maks - ateminys)
  const turinys = ateminys + skirtumas

  return variacija([
    // 1. Nežinomas turinys
    () =>
      uzdavinys('nezinomas-turinys', {
        klausimas: `Išspręsk lygtį: $${r} - ${ateminys} = ${skirtumas}$`,
        atsakymas: String(turinys),
        atsakymasRodymui: `$${turinys}$`,
        sprendimas: `Nežinomas turinys randamas sudėtimi: $${skirtumas} + ${ateminys} = ${turinys}$.`,
      }),

    // 2. Nežinomas atėminys
    () =>
      uzdavinys('nezinomas-turinys', {
        klausimas: `Išspręsk lygtį: $${turinys} - ${r} = ${skirtumas}$`,
        atsakymas: String(ateminys),
        atsakymasRodymui: `$${ateminys}$`,
        sprendimas: `Nežinomas atėminys randamas atimtimi: $${turinys} - ${skirtumas} = ${ateminys}$.`,
      }),

    // 3. Iš schemos
    () =>
      uzdavinys('nezinomas-turinys', {
        klausimas: 'Sudaryk lygtį pagal schemą ir rask nežinomą visumą.',
        atsakymas: String(turinys),
        atsakymasRodymui: `$${turinys}$`,
        sprendimas: `Lygtis $${r} - ${ateminys} = ${skirtumas}$, tad $${r} = ${skirtumas} + ${ateminys} = ${turinys}$.`,
        brezinys: juostineSchema(null, ateminys, skirtumas),
      }),

    // 4. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('nezinomas-turinys'), 'nezinomas-turinys', {
        klausimas: `Mokinys lygtį $${r} - ${ateminys} = ${skirtumas}$ išsprendė taip: $${r} = ${skirtumas} - ${ateminys}$. Kur klaida?`,
        variantai: [
          `nežinomas turinys randamas sudėtimi: $${skirtumas} + ${ateminys} = ${turinys}$`,
          `reikėjo dauginti iš ${ateminys}`,
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Turinys visada didesnis už skirtumą, tad atimtis čia netinka.`,
      }),

    // 5. Du žingsniai
    () => {
      const kiek = atsitiktinis(20, 100)
      if (turinys < kiek) return null
      return uzdavinys('nezinomas-turinys', {
        klausimas: `Išspręsk lygtį $${turinys} - ${r} = ${skirtumas}$, tada apskaičiuok $${r} - ${
          Math.min(kiek, ateminys - 1) || 1
        }$.`,
        atsakymas: String(ateminys - (Math.min(kiek, ateminys - 1) || 1)),
        atsakymasRodymui: `$${ateminys - (Math.min(kiek, ateminys - 1) || 1)}$`,
        sprendimas: `$${r} = ${turinys} - ${skirtumas} = ${ateminys}$, tada $${ateminys} - ${
          Math.min(kiek, ateminys - 1) || 1
        } = ${ateminys - (Math.min(kiek, ateminys - 1) || 1)}$.`,
      })
    },

    // 6. Patikrinimas
    () =>
      uzdavinys('nezinomas-turinys', {
        klausimas: `Lygties $${r} - ${ateminys} = ${skirtumas}$ sprendinys yra ${turinys}. Kiek gausi patikrindamas veiksmu $${turinys} - ${ateminys}$?`,
        atsakymas: String(skirtumas),
        atsakymasRodymui: `$${skirtumas}$`,
        sprendimas: `Turi gautis dešinioji pusė: $${turinys} - ${ateminys} = ${skirtumas}$.`,
      }),

    // 7. Lygtis pagal sąlygą
    () =>
      uzdavinys('nezinomas-turinys', {
        klausimas: `Iš nežinomo skaičiaus atėmus ${ateminys} gaunama ${skirtumas}. Koks tas skaičius?`,
        atsakymas: String(turinys),
        atsakymasRodymui: `$${turinys}$`,
        sprendimas: `Lygtis $${r} - ${ateminys} = ${skirtumas}$, tad $${r} = ${turinys}$.`,
      }),
  ])
}

// ── 8.4 Nežinomas daugiklis ─────────────────────────────────────────────────

const A_DAUGIKLIS = [
  {
    klausimas: 'Išspręsk lygtį: $7 \\cdot x = 56$',
    atsakymas: '8',
    atsakymasRodymui: '$8$',
    sprendimas: 'Nežinomas daugiklis randamas dalyba: $56 : 7 = 8$.',
  },
] as const

export const nezinomasDaugiklis: Generatorius = () =>
  suBandymais(kurkDaugikli, A_DAUGIKLIS, 'nezinomas-daugiklis')

function kurkDaugikli(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const a = atsitiktinis(2, 9)
  const x = atsitiktinis(2, 9)
  const sandauga = a * x

  return variacija([
    // 1. Nežinomasis antras
    () =>
      uzdavinys('nezinomas-daugiklis', {
        klausimas: `Išspręsk lygtį: $${a} \\cdot ${r} = ${sandauga}$`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Nežinomas daugiklis randamas dalyba: $${sandauga} : ${a} = ${x}$.`,
      }),

    // 2. Nežinomasis pirmas
    () =>
      uzdavinys('nezinomas-daugiklis', {
        klausimas: `Išspręsk lygtį: $${r} \\cdot ${a} = ${sandauga}$`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `$${sandauga} : ${a} = ${x}$.`,
      }),

    // 3. Iš grupių brėžinio
    () =>
      uzdavinys('nezinomas-daugiklis', {
        // Grupių ir objektų skaičių reikia nuskaityti iš brėžinio.
        klausimas: 'Visose grupėse objektų yra po lygiai. Kiek jų vienoje grupėje?',
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Lygtis $${a} \\cdot ${r} = ${sandauga}$, tad $${r} = ${sandauga} : ${a} = ${x}$.`,
        brezinys: grupes(a, x),
      }),

    // 4. Patikrinimas daugyba
    () =>
      uzdavinys('nezinomas-daugiklis', {
        klausimas: `Lygties $${a} \\cdot ${r} = ${sandauga}$ sprendinys yra ${x}. Kiek gausi patikrindamas veiksmu $${a} \\cdot ${x}$?`,
        atsakymas: String(sandauga),
        atsakymasRodymui: `$${sandauga}$`,
        sprendimas: `Turi gautis sandauga: $${a} \\cdot ${x} = ${sandauga}$.`,
      }),

    // 5. Klaidos radimas
    () => {
      const blogas = sandauga - a
      if (blogas === x || blogas < 1) return null
      return pasirinkimoUzdavinys(naujasId('nezinomas-daugiklis'), 'nezinomas-daugiklis', {
        klausimas: `Mokinys lygtį $${a} \\cdot ${r} = ${sandauga}$ išsprendė $${r} = ${blogas}$. Kur klaida?`,
        variantai: [
          `buvo atimta, o reikėjo dalyti: $${sandauga} : ${a} = ${x}$`,
          `reikėjo dauginti iš ${a}`,
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Nežinomas daugiklis randamas sandaugą padalijus iš žinomo daugiklio.`,
      })
    },

    // 6. Du žingsniai
    () => {
      const kitas = atsitiktinis(2, 9)
      return uzdavinys('nezinomas-daugiklis', {
        klausimas: `Išspręsk lygtį $${a} \\cdot ${r} = ${sandauga}$, tada apskaičiuok $${kitas} \\cdot ${r}$.`,
        atsakymas: String(kitas * x),
        atsakymasRodymui: `$${kitas * x}$`,
        sprendimas: `$${r} = ${sandauga} : ${a} = ${x}$, tada $${kitas} \\cdot ${x} = ${kitas * x}$.`,
      })
    },

    // 7. Iš svarstyklių
    () => {
      const dezuciu = atsitiktinis(2, 4)
      const vienoje = atsitiktinis(3, 12)
      return uzdavinys('nezinomas-daugiklis', {
        klausimas: 'Svarstyklės pusiausvyroje, visos dėžutės vienodos. Kokia vienos dėžutės masė?',
        atsakymas: String(vienoje),
        atsakymasRodymui: `$${vienoje}$`,
        sprendimas: `Dėžučių ${dezuciu}, kartu jos sveria ${
          dezuciu * vienoje
        }, tad viena sveria $${dezuciu * vienoje} : ${dezuciu} = ${vienoje}$.`,
        brezinys: svarstykliuLygtis(
          { dezuciu, svarelis: 0 },
          { dezuciu: 0, svarelis: dezuciu * vienoje },
        ),
      })
    },
  ])
}

// ── 8.5 Nežinomas dalinys ar daliklis ───────────────────────────────────────

const A_DALINYS = [
  {
    klausimas: 'Išspręsk lygtį: $x : 8 = 7$',
    atsakymas: '56',
    atsakymasRodymui: '$56$',
    sprendimas: 'Nežinomas dalinys randamas daugyba: $7 \\cdot 8 = 56$.',
  },
] as const

export const nezinomasDalinys: Generatorius = () =>
  suBandymais(kurkDalini, A_DALINYS, 'nezinomas-dalinys')

function kurkDalini(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const daliklis = atsitiktinis(2, 9)
  const dalmuo = atsitiktinis(2, 9)
  const dalinys = daliklis * dalmuo

  return variacija([
    // 1. Nežinomas dalinys
    () =>
      uzdavinys('nezinomas-dalinys', {
        klausimas: `Išspręsk lygtį: $${r} : ${daliklis} = ${dalmuo}$`,
        atsakymas: String(dalinys),
        atsakymasRodymui: `$${dalinys}$`,
        sprendimas: `Nežinomas dalinys randamas daugyba: $${dalmuo} \\cdot ${daliklis} = ${dalinys}$.`,
      }),

    // 2. Nežinomas daliklis
    () =>
      uzdavinys('nezinomas-dalinys', {
        klausimas: `Išspręsk lygtį: $${dalinys} : ${r} = ${dalmuo}$`,
        atsakymas: String(daliklis),
        atsakymasRodymui: `$${daliklis}$`,
        sprendimas: `Nežinomas daliklis randamas dalyba: $${dalinys} : ${dalmuo} = ${daliklis}$.`,
      }),

    // 3. Iš grupių brėžinio
    () =>
      uzdavinys('nezinomas-dalinys', {
        klausimas: 'Į kiek vienodų grupių padalyti brėžinio objektai?',
        atsakymas: String(daliklis),
        atsakymasRodymui: `$${daliklis}$`,
        sprendimas: `Iš viso ${dalinys}, kiekvienoje grupėje po ${dalmuo}: $${dalinys} : ${dalmuo} = ${daliklis}$.`,
        brezinys: grupes(daliklis, dalmuo),
      }),

    // 4. Patikrinimas
    () =>
      uzdavinys('nezinomas-dalinys', {
        klausimas: `Lygties $${r} : ${daliklis} = ${dalmuo}$ sprendinys yra ${dalinys}. Kiek gausi patikrindamas veiksmu $${dalinys} : ${daliklis}$?`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `Turi gautis dešinioji pusė: $${dalinys} : ${daliklis} = ${dalmuo}$.`,
      }),

    // 5. Klaidos radimas
    () => {
      const blogas = dalmuo
      if (daliklis === dalmuo) return null
      return pasirinkimoUzdavinys(naujasId('nezinomas-dalinys'), 'nezinomas-dalinys', {
        klausimas: `Mokinys lygtį $${dalinys} : ${r} = ${dalmuo}$ išsprendė $${r} = ${blogas}$. Kur klaida?`,
        variantai: [
          `daliklis yra $${dalinys} : ${dalmuo} = ${daliklis}$, o ne dalmuo`,
          `reikėjo dauginti: $${dalinys} \\cdot ${dalmuo}$`,
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Patikrinus: $${dalinys} : ${daliklis} = ${dalmuo}$.`,
      })
    },

    // 6. Tekstinė sąlyga
    () =>
      uzdavinys('nezinomas-dalinys', {
        klausimas: `Nežinomas saldainių skaičius padalytas po lygiai ${daliklis} vaikams, kiekvienas gavo po ${dalmuo}. Kiek saldainių buvo?`,
        atsakymas: String(dalinys),
        atsakymasRodymui: `$${dalinys}$`,
        sprendimas: `Lygtis $${r} : ${daliklis} = ${dalmuo}$, tad $${r} = ${dalmuo} \\cdot ${daliklis} = ${dalinys}$.`,
      }),

    // 7. Du žingsniai
    () => {
      const kitas = atsitiktinis(2, 9)
      if (dalinys % kitas !== 0) return null
      return uzdavinys('nezinomas-dalinys', {
        klausimas: `Išspręsk lygtį $${r} : ${daliklis} = ${dalmuo}$, tada apskaičiuok $${r} : ${kitas}$.`,
        atsakymas: String(dalinys / kitas),
        atsakymasRodymui: `$${dalinys / kitas}$`,
        sprendimas: `$${r} = ${dalinys}$, tada $${dalinys} : ${kitas} = ${dalinys / kitas}$.`,
      })
    },
  ])
}

// ── 8.6 Lygtis pagal piešinį ar schemą ──────────────────────────────────────

const A_LYGTIS_IS_SCHEMOS = [
  {
    klausimas: 'Sudaryk lygtį pagal schemą ir rask nežinomą dalį.',
    atsakymas: '58',
    atsakymasRodymui: '$58$',
    sprendimas: '$96 - 38 = 58$.',
  },
] as const

export const lygtisIsSchemos: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkLygtiIsSchemos(sritis), A_LYGTIS_IS_SCHEMOS, 'lygtis-is-schemos')

function kurkLygtiIsSchemos(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)

  return variacija([
    // 1. Juosta: trūksta dalies
    () => {
      const dalis = atsitiktinis(20, 200)
      const x = atsitiktinis(20, Math.min(300, maks - dalis))
      return uzdavinys('lygtis-is-schemos', {
        klausimas: 'Sudaryk lygtį pagal schemą ir rask nežinomą dalį.',
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Lygtis $${dalis} + x = ${dalis + x}$, tad $x = ${dalis + x} - ${dalis} = ${x}$.`,
        brezinys: juostineSchema(dalis + x, dalis, null),
      })
    },

    // 2. Juosta: trūksta visumos
    () => {
      const a = atsitiktinis(20, 200)
      const b = atsitiktinis(20, 200)
      if (a + b > maks) return null
      return uzdavinys('lygtis-is-schemos', {
        klausimas: 'Sudaryk lygtį pagal schemą ir rask nežinomą visumą.',
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Lygtis $x = ${a} + ${b}$, tad $x = ${a + b}$.`,
        brezinys: juostineSchema(null, a, b),
      })
    },

    // 3. Vienodos lėkštės
    () => {
      const lekstes = atsitiktinis(5, 9)
      const vienoje = atsitiktinis(3, 9)
      return uzdavinys('lygtis-is-schemos', {
        klausimas: 'Visose grupėse objektų po lygiai. Kiek jų vienoje grupėje?',
        atsakymas: String(vienoje),
        atsakymasRodymui: `$${vienoje}$`,
        sprendimas: `Lygtis $${lekstes} \\cdot x = ${
          lekstes * vienoje
        }$, tad $x = ${lekstes * vienoje} : ${lekstes} = ${vienoje}$.`,
        brezinys: grupes(Math.min(lekstes, 8), vienoje),
      })
    },

    // 4. Svarstyklės su svareliu
    () => {
      const x = atsitiktinis(10, 60)
      const svarelis = atsitiktinis(10, 40)
      return uzdavinys('lygtis-is-schemos', {
        klausimas: 'Parašyk lygtį pagal svarstykles ir rask dėžutės masę.',
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Lygtis $x + ${svarelis} = ${x + svarelis}$, tad $x = ${x}$.`,
        brezinys: svarstykliuLygtis(
          { dezuciu: 1, svarelis },
          { dezuciu: 0, svarelis: x + svarelis },
        ),
      })
    },

    // 5. Svarstyklės su dviem dėžutėmis
    () => {
      const x = atsitiktinis(5, 25)
      const svarelis = atsitiktinis(5, 20)
      return uzdavinys('lygtis-is-schemos', {
        // Dvi vienodos dėžutės — daugiklio 2 dar nerašome, bet pakartotinę
        // sudėtį trečiokas atpažįsta.
        klausimas: 'Abi dėžutės vienodos, svarstyklės pusiausvyroje. Kokia vienos dėžutės masė?',
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Dvi dėžutės sveria $${2 * x + svarelis} - ${svarelis} = ${
          2 * x
        }$, tad viena — $${2 * x} : 2 = ${x}$.`,
        brezinys: svarstykliuLygtis(
          { dezuciu: 2, svarelis },
          { dezuciu: 0, svarelis: 2 * x + svarelis },
        ),
      })
    },

    // 6. Trijų dalių juosta
    () => {
      const a = atsitiktinis(50, 200)
      const b = atsitiktinis(50, 200)
      const x = atsitiktinis(50, 200)
      if (a + b + x > maks) return null
      return uzdavinys('lygtis-is-schemos', {
        klausimas: `Visa juosta yra ${a + b + x}. Dvi jos dalys yra ${a} ir ${b}. Sudaryk lygtį ir rask trečią dalį.`,
        atsakymas: String(x),
        atsakymasRodymui: `$${x}$`,
        sprendimas: `Žinomos dalys kartu $${a} + ${b} = ${a + b}$, tad $x = ${a + b + x} - ${
          a + b
        } = ${x}$.`,
      })
    },

    // 7. Kurią lygtį atitinka schema
    () => {
      const a = atsitiktinis(30, 200)
      const x = atsitiktinis(30, Math.min(200, maks - a))
      return pasirinkimoUzdavinys(naujasId('lygtis-is-schemos'), 'lygtis-is-schemos', {
        klausimas: 'Kuri lygtis atitinka schemą?',
        variantai: [
          `$${a} + x = ${a + x}$`,
          `$x - ${a} = ${a + x}$`,
          `$${a} \\cdot x = ${a + x}$`,
        ],
        teisingas: 0,
        sprendimas: `Viršutinė juosta yra visuma ${a + x}, o apatinės — jos dalys.`,
        brezinys: juostineSchema(a + x, a, null),
      })
    },
  ])
}

// ── 8.7 Raidinis reiškinys ir jo reikšmė ────────────────────────────────────

const A_REISKINYS = [
  {
    klausimas: 'Apskaičiuok reiškinio $c + 36$ reikšmę, kai $c = 58$.',
    atsakymas: '94',
    atsakymasRodymui: '$94$',
    sprendimas: '$58 + 36 = 94$.',
  },
] as const

export const raidinisReiskinys3: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkReiskini(sritis), A_REISKINYS, 'raidinis-reiskinys-3')

function kurkReiskini(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const r = pasirink(RAIDES)

  return variacija([
    // 1. Sudėties reiškinys
    () => {
      const a = atsitiktinis(20, 300)
      const reiksme = atsitiktinis(20, maks - a)
      return uzdavinys('raidinis-reiskinys-3', {
        klausimas: `Apskaičiuok reiškinio $${r} + ${a}$ reikšmę, kai $${r} = ${reiksme}$.`,
        atsakymas: String(reiksme + a),
        atsakymasRodymui: `$${reiksme + a}$`,
        sprendimas: `$${reiksme} + ${a} = ${reiksme + a}$.`,
      })
    },

    // 2. Atimties reiškinys
    () => {
      const visa = atsitiktinis(60, 300)
      const reiksme = atsitiktinis(10, visa - 10)
      return uzdavinys('raidinis-reiskinys-3', {
        klausimas: `Apskaičiuok reiškinio $${visa} - ${r}$ reikšmę, kai $${r} = ${reiksme}$.`,
        atsakymas: String(visa - reiksme),
        atsakymasRodymui: `$${visa - reiksme}$`,
        sprendimas: `$${visa} - ${reiksme} = ${visa - reiksme}$.`,
      })
    },

    // 3. Daugybos reiškinys
    () => {
      const a = atsitiktinis(2, 9)
      const reiksme = atsitiktinis(2, 9)
      return uzdavinys('raidinis-reiskinys-3', {
        klausimas: `Apskaičiuok $${a} \\cdot ${r}$, kai $${r} = ${reiksme}$.`,
        atsakymas: String(a * reiksme),
        atsakymasRodymui: `$${a * reiksme}$`,
        sprendimas: `$${a} \\cdot ${reiksme} = ${a * reiksme}$.`,
      })
    },

    // 4. Dalybos reiškinys
    () => {
      const reiksme = atsitiktinis(2, 9)
      const dalinys = reiksme * atsitiktinis(2, 9)
      return uzdavinys('raidinis-reiskinys-3', {
        klausimas: `Apskaičiuok $${dalinys} : ${r}$, kai $${r} = ${reiksme}$.`,
        atsakymas: String(dalinys / reiksme),
        atsakymasRodymui: `$${dalinys / reiksme}$`,
        sprendimas: `$${dalinys} : ${reiksme} = ${dalinys / reiksme}$.`,
      })
    },

    // 5. Du veiksmai tinkama tvarka
    () => {
      const a = atsitiktinis(2, 9)
      const reiksme = atsitiktinis(2, 9)
      const pridedama = atsitiktinis(10, 40)
      return uzdavinys('raidinis-reiskinys-3', {
        klausimas: `Apskaičiuok $${a} \\cdot ${r} + ${pridedama}$, kai $${r} = ${reiksme}$.`,
        atsakymas: String(a * reiksme + pridedama),
        atsakymasRodymui: `$${a * reiksme + pridedama}$`,
        sprendimas: `Pirmiausia daugyba: $${a} \\cdot ${reiksme} = ${
          a * reiksme
        }$, tada $${a * reiksme} + ${pridedama} = ${a * reiksme + pridedama}$.`,
      })
    },

    // 6. Kuri reikšmė duoda didžiausią
    () => {
      const a = atsitiktinis(50, 200)
      const reiksmes = sumaisyk([atsitiktinis(20, 40), atsitiktinis(45, 70), atsitiktinis(75, 99)])
      const didziausia = Math.max(...reiksmes)
      return pasirinkimoUzdavinys(naujasId('raidinis-reiskinys-3'), 'raidinis-reiskinys-3', {
        klausimas: `Kuri ${r} reikšmė duoda didžiausią reiškinio $${r} + ${a}$ reikšmę: ${reiksmes.join(
          ', ',
        )}?`,
        variantai: [
          String(didziausia),
          ...reiksmes.filter((x) => x !== didziausia).map(String),
        ],
        teisingas: 0,
        sprendimas: `Kuo didesnis dėmuo, tuo didesnė suma: $${didziausia} + ${a} = ${
          didziausia + a
        }$.`,
      })
    },

    // 7. Klaidos radimas
    () => {
      const a = atsitiktinis(3, 9)
      const reiksme = atsitiktinis(3, 9)
      const blogas = a + reiksme
      if (blogas === a * reiksme) return null
      return pasirinkimoUzdavinys(naujasId('raidinis-reiskinys-3'), 'raidinis-reiskinys-3', {
        klausimas: `Kai $${r} = ${reiksme}$, mokinys reiškinį $${a} \\cdot ${r}$ apskaičiavo ${blogas}. Kur klaida?`,
        variantai: [
          `skaičiai sudėti, o reikėjo dauginti: $${a} \\cdot ${reiksme} = ${a * reiksme}$`,
          `reikėjo dalyti`,
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `$${a} \\cdot ${reiksme} = ${a * reiksme}$.`,
      })
    },
  ])
}

// ── 8.8 Raidinis reiškinys pagal sąlygą ─────────────────────────────────────

const A_REISKINYS_IS_SALYGOS = [
  {
    klausimas: 'Dėžėje yra $b$ obuolių, įdėta dar 12. Kuris reiškinys rodo obuolių skaičių dabar?',
    atsakymas: 'A',
    atsakymasRodymui: 'A — $b + 12$',
    sprendimas: 'Pridėjimas užrašomas sudėtimi.',
  },
] as const

export const reiskinysIsSalygos: Generatorius = () =>
  suBandymais(kurkReiskiniIsSalygos, A_REISKINYS_IS_SALYGOS, 'reiskinys-is-salygos')

function kurkReiskiniIsSalygos(): Uzdavinys | null {
  const r = pasirink(RAIDES)
  const n = atsitiktinis(3, 20)

  return variacija([
    // 1. Pigiau
    () =>
      pasirinkimoUzdavinys(naujasId('reiskinys-is-salygos'), 'reiskinys-is-salygos', {
        klausimas: `Knyga kainuoja $${r}$ eurų, o sąsiuvinis ${n} eurais pigiau. Kuris reiškinys rodo sąsiuvinio kainą?`,
        variantai: [`$${r} - ${n}$`, `$${r} + ${n}$`, `$${r} \\cdot ${n}$`],
        teisingas: 0,
        sprendimas: '„Pigiau“ reiškia, kad reikia atimti.',
      }),

    // 2. Pridėta
    () =>
      pasirinkimoUzdavinys(naujasId('reiskinys-is-salygos'), 'reiskinys-is-salygos', {
        klausimas: `Dėžėje yra $${r}$ obuolių, įdėta dar ${n}. Kuris reiškinys rodo obuolių skaičių dabar?`,
        variantai: [`$${r} + ${n}$`, `$${r} - ${n}$`, `$${r} : ${n}$`],
        teisingas: 0,
        sprendimas: 'Įdėjimas užrašomas sudėtimi.',
      }),

    // 3. Kelios vienodos pakuotės
    () => {
      const pakeliu = atsitiktinis(3, 9)
      return pasirinkimoUzdavinys(naujasId('reiskinys-is-salygos'), 'reiskinys-is-salygos', {
        klausimas: `Viename pakelyje yra $${r}$ lipdukų. Yra ${pakeliu} tokie pakeliai. Kuris reiškinys rodo visų lipdukų skaičių?`,
        variantai: [`$${pakeliu} \\cdot ${r}$`, `$${pakeliu} + ${r}$`, `$${r} : ${pakeliu}$`],
        teisingas: 0,
        sprendimas: 'Vienodos grupės sudedamos daugyba.',
      })
    },

    // 4. Padalyta po lygiai
    () => {
      const vaiku = atsitiktinis(3, 9)
      return pasirinkimoUzdavinys(naujasId('reiskinys-is-salygos'), 'reiskinys-is-salygos', {
        klausimas: `$${r}$ saldainiai padalyti po lygiai ${vaiku} vaikams. Kuris reiškinys rodo, kiek gauna vienas?`,
        variantai: [`$${r} : ${vaiku}$`, `$${r} \\cdot ${vaiku}$`, `$${r} - ${vaiku}$`],
        teisingas: 0,
        sprendimas: 'Dalijimas po lygiai užrašomas dalyba.',
      })
    },

    // 5. Reikšmė iš reiškinio
    () => {
      const reiksme = atsitiktinis(20, 200)
      return uzdavinys('reiskinys-is-salygos', {
        klausimas: `Autobuse buvo $${r}$ keleivių, ${n} išlipo. Kiek keleivių liko, jei $${r} = ${reiksme}$?`,
        atsakymas: String(reiksme - n),
        atsakymasRodymui: `$${reiksme - n}$`,
        sprendimas: `Reiškinys $${r} - ${n}$, tad $${reiksme} - ${n} = ${reiksme - n}$.`,
      })
    },

    // 6. Sudėtinis reiškinys
    () => {
      const knygu = atsitiktinis(2, 5)
      const uzrasine = atsitiktinis(5, 12)
      return pasirinkimoUzdavinys(naujasId('reiskinys-is-salygos'), 'reiskinys-is-salygos', {
        klausimas: `Viena knyga kainuoja $${r}$ eurų. Perkamos ${knygu} knygos ir dar ${uzrasine} eurų užrašinė. Kuris reiškinys rodo visą kainą?`,
        variantai: [
          `$${knygu} \\cdot ${r} + ${uzrasine}$`,
          `$${r} + ${knygu} + ${uzrasine}$`,
          `$${knygu} \\cdot (${r} + ${uzrasine})$`,
        ],
        teisingas: 0,
        sprendimas: 'Pirmiausia suskaičiuojama knygų kaina, tada pridedama užrašinė.',
      })
    },

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('reiskinys-is-salygos'), 'reiskinys-is-salygos', {
        klausimas: `Situacijai „$${r}$ obuolių ir dar ${n}“ mokinys parašė reiškinį $${r} - ${n}$. Kur klaida?`,
        variantai: [
          `„ir dar“ reiškia pridėti: $${r} + ${n}$`,
          `reikėjo dauginti: $${r} \\cdot ${n}$`,
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: 'Atimtis tiktų, jei obuolių būtų sumažėję.',
      }),
  ])
}

// ── 8.9 Raidinis reiškinys pagal piešinį ────────────────────────────────────

const A_REISKINYS_IS_PIESINIO = [
  {
    klausimas: 'Kuris reiškinys rodo visą brėžinyje pavaizduotą kiekį?',
    atsakymas: 'A',
    atsakymasRodymui: 'A — $a + 7$',
    sprendimas: 'Viena dėžutė su nežinomu kiekiu ir dar septyni pavieniai.',
  },
] as const

export const reiskinysIsPiesinio: Generatorius = () =>
  suBandymais(kurkReiskiniIsPiesinio, A_REISKINYS_IS_PIESINIO, 'reiskinys-is-piesinio')

function kurkReiskiniIsPiesinio(): Uzdavinys | null {
  const r = pasirink(['a', 'b', 'c'] as const)

  return variacija([
    // 1. Viena dėžutė ir pavieniai
    () => {
      const pavieniu = atsitiktinis(3, 8)
      return pasirinkimoUzdavinys(naujasId('reiskinys-is-piesinio'), 'reiskinys-is-piesinio', {
        // Dėžučių ir pavienių objektų skaičių reikia suskaičiuoti brėžinyje.
        klausimas: 'Kuris reiškinys rodo visą brėžinyje pavaizduotą kiekį?',
        variantai: [
          `$${r} + ${pavieniu}$`,
          `$${r} - ${pavieniu}$`,
          `$${r} \\cdot ${pavieniu}$`,
        ],
        teisingas: 0,
        sprendimas: `Dėžutėje nežinomas kiekis ${r}, o šalia dar ${pavieniu} pavieniai.`,
        brezinys: raidinioModelis(1, pavieniu, r),
      })
    },

    // 2. Kelios vienodos dėžutės
    () => {
      const dezuciu = atsitiktinis(3, 5)
      return pasirinkimoUzdavinys(naujasId('reiskinys-is-piesinio'), 'reiskinys-is-piesinio', {
        klausimas: 'Visose dėžutėse daiktų po lygiai. Kuris reiškinys rodo visų daiktų kiekį?',
        variantai: [
          `$${dezuciu} \\cdot ${r}$`,
          `$${dezuciu} + ${r}$`,
          `$${r} : ${dezuciu}$`,
        ],
        teisingas: 0,
        sprendimas: `Dėžučių ${dezuciu}, kiekvienoje po ${r}.`,
        brezinys: raidinioModelis(dezuciu, 0, r),
      })
    },

    // 3. Dėžutės ir pavieniai kartu
    () => {
      const dezuciu = atsitiktinis(2, 4)
      const pavieniu = atsitiktinis(2, 6)
      return pasirinkimoUzdavinys(naujasId('reiskinys-is-piesinio'), 'reiskinys-is-piesinio', {
        klausimas: 'Kuris reiškinys rodo visą brėžinyje pavaizduotą kiekį?',
        variantai: [
          `$${dezuciu} \\cdot ${r} + ${pavieniu}$`,
          `$${r} + ${pavieniu}$`,
          `$${dezuciu} \\cdot (${r} + ${pavieniu})$`,
        ],
        teisingas: 0,
        sprendimas: `Dėžučių ${dezuciu} po ${r}, o šalia dar ${pavieniu} pavieniai.`,
        brezinys: raidinioModelis(dezuciu, pavieniu, r),
      })
    },

    // 4. Reikšmė iš piešinio
    () => {
      const dezuciu = atsitiktinis(2, 4)
      const pavieniu = atsitiktinis(2, 6)
      const reiksme = atsitiktinis(5, 20)
      return uzdavinys('reiskinys-is-piesinio', {
        klausimas: `Kiek objektų iš viso, jei $${r} = ${reiksme}$?`,
        atsakymas: String(dezuciu * reiksme + pavieniu),
        atsakymasRodymui: `$${dezuciu * reiksme + pavieniu}$`,
        sprendimas: `Reiškinys $${dezuciu} \\cdot ${r} + ${pavieniu}$, tad $${dezuciu} \\cdot ${reiksme} + ${pavieniu} = ${
          dezuciu * reiksme + pavieniu
        }$.`,
        brezinys: raidinioModelis(dezuciu, pavieniu, r),
      })
    },

    // 5. Ilgesnė juosta
    () => {
      const ilgiau = atsitiktinis(10, 40)
      return pasirinkimoUzdavinys(naujasId('reiskinys-is-piesinio'), 'reiskinys-is-piesinio', {
        klausimas: `Pirmoji juosta yra $${r}$, antroji — ${ilgiau} ilgesnė. Kuris reiškinys rodo antrosios juostos ilgį?`,
        variantai: [`$${r} + ${ilgiau}$`, `$${r} - ${ilgiau}$`, `$${ilgiau} : ${r}$`],
        teisingas: 0,
        sprendimas: '„Ilgesnė“ reiškia, kad prie pirmosios pridedama.',
      })
    },

    // 6. Schema su dviem žingsniais
    () => {
      const prideda = atsitiktinis(10, 40)
      const atima = atsitiktinis(5, 30)
      return pasirinkimoUzdavinys(naujasId('reiskinys-is-piesinio'), 'reiskinys-is-piesinio', {
        klausimas: `Prie skaičiaus $${r}$ pridedama ${prideda}, tada atimama ${atima}. Kuris reiškinys rodo galutinį skaičių?`,
        variantai: [
          `$${r} + ${prideda} - ${atima}$`,
          `$${r} - ${prideda} + ${atima}$`,
          `$${r} \\cdot ${prideda} - ${atima}$`,
        ],
        teisingas: 0,
        sprendimas: 'Veiksmai rašomi ta tvarka, kuria atliekami.',
      })
    },

    // 7. Klaidos radimas
    () => {
      const dezuciu = atsitiktinis(3, 5)
      return pasirinkimoUzdavinys(naujasId('reiskinys-is-piesinio'), 'reiskinys-is-piesinio', {
        klausimas: `Brėžinyje ${dezuciu} vienodos dėžutės po $${r}$, bet mokinys parašė reiškinį $${r} + ${dezuciu}$. Kur klaida?`,
        variantai: [
          `vienodos grupės sudedamos daugyba: $${dezuciu} \\cdot ${r}$`,
          `reikėjo rašyti $${r} - ${dezuciu}$`,
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Sudėtis tiktų, jei prie ${r} būtų pridėti ${dezuciu} pavieniai objektai.`,
        brezinys: raidinioModelis(dezuciu, 0, r),
      })
    },
  ])
}

// ── 8.10 Kompozicija iš figūrų ──────────────────────────────────────────────

const A_KOMPOZICIJA = [
  {
    klausimas: 'Kompoziciją sudaro 3 trikampiai ir 2 keturkampiai. Kiek iš viso figūrų?',
    atsakymas: '5',
    atsakymasRodymui: '$5$',
    sprendimas: '$3 + 2 = 5$.',
  },
] as const

export const figuruKompozicija: Generatorius = () =>
  suBandymais(kurkKompozicija, A_KOMPOZICIJA, 'figuru-kompozicija')

/**
 * Potemė prašo sudėlioti kompoziciją, o tokio darbo automatiškai nepatikrinsi.
 * Todėl skaičiuojama tai, ką dėliojant iš tikrųjų reikia žinoti: kiek detalių,
 * kiek kurios rūšies, kiek kraštinių ir ar užtenka turimų figūrų.
 */
function kurkKompozicija(): Uzdavinys | null {
  return variacija([
    // 1. Kiek iš viso detalių
    () => {
      const trikampiu = atsitiktinis(2, 5)
      const keturkampiu = atsitiktinis(2, 5)
      const apskritimu = atsitiktinis(1, 3)
      return uzdavinys('figuru-kompozicija', {
        klausimas: `Kompozicijai naudojami ${trikampiu} trikampiai, ${keturkampiu} keturkampiai ir ${apskritimu} apskritimai. Kiek iš viso detalių?`,
        atsakymas: String(trikampiu + keturkampiu + apskritimu),
        atsakymasRodymui: `$${trikampiu + keturkampiu + apskritimu}$`,
        sprendimas: `$${trikampiu} + ${keturkampiu} + ${apskritimu} = ${
          trikampiu + keturkampiu + apskritimu
        }$.`,
      })
    },

    // 2. Kiek kraštinių iš viso
    () => {
      const trikampiu = atsitiktinis(2, 5)
      const keturkampiu = atsitiktinis(2, 5)
      return uzdavinys('figuru-kompozicija', {
        klausimas: `Kompoziciją sudaro ${trikampiu} trikampiai ir ${keturkampiu} keturkampiai. Kiek iš viso kraštinių turi šios figūros?`,
        atsakymas: String(trikampiu * 3 + keturkampiu * 4),
        atsakymasRodymui: `$${trikampiu * 3 + keturkampiu * 4}$`,
        sprendimas: `$${trikampiu} \\cdot 3 + ${keturkampiu} \\cdot 4 = ${
          trikampiu * 3 + keturkampiu * 4
        }$.`,
      })
    },

    // 3. Kuri figūra kompozicijoje
    () => {
      const eile = sumaisyk([3, 4, 5, 6])
      const iesk = pasirink(eile)
      const vieta = eile.indexOf(iesk) + 1
      return uzdavinys('figuru-kompozicija', {
        klausimas: `Kelinta iš eilės yra figūra, turinti ${iesk} kraštines? Parašyk brėžinio numerį.`,
        atsakymas: String(vieta),
        atsakymasRodymui: `$${vieta}$`,
        sprendimas: `Suskaičiuojamos kiekvienos figūros kraštinės — ${iesk} kraštines turi ${vieta}-oji.`,
        brezinys: brezinuEile(eile.map((n, i) => daugiakampis(n, true, i))),
      })
    },

    // 4. Ar užtenka detalių
    () => {
      const turi = atsitiktinis(6, 12)
      const reikia = atsitiktinis(4, 14)
      if (turi === reikia) return null
      return pasirinkimoUzdavinys(naujasId('figuru-kompozicija'), 'figuru-kompozicija', {
        klausimas: `Kompozicijai reikia ${reikia} detalių, o turima ${turi}. Ar užteks?`,
        variantai:
          turi >= reikia
            ? ['taip, užteks', 'ne, neužteks', 'negalima pasakyti']
            : ['ne, neužteks', 'taip, užteks', 'negalima pasakyti'],
        teisingas: 0,
        sprendimas:
          turi >= reikia
            ? `Turima ${turi}, o reikia ${reikia}.`
            : `Trūksta $${reikia} - ${turi} = ${reikia - turi}$ detalių.`,
      })
    },

    // 5. Simetriška kompozicija
    () => {
      const puseje = atsitiktinis(3, 7)
      return uzdavinys('figuru-kompozicija', {
        klausimas: `Kompozicija simetriška ašies atžvilgiu. Vienoje pusėje yra ${puseje} detalės. Kiek detalių iš viso?`,
        atsakymas: String(2 * puseje),
        atsakymasRodymui: `$${2 * puseje}$`,
        sprendimas: `Kitoje pusėje tiek pat: $${puseje} + ${puseje} = ${2 * puseje}$.`,
      })
    },

    // 6. Kada detalės persidengia
    () =>
      pasirinkimoUzdavinys(naujasId('figuru-kompozicija'), 'figuru-kompozicija', {
        klausimas: 'Kompozicijoje dvi detalės persidengia. Ką reikia padaryti, kad matytųsi visos?',
        variantai: [
          'vieną detalę perkelti į laisvą vietą',
          'vieną detalę pašalinti',
          'abi detales padidinti',
        ],
        teisingas: 0,
        sprendimas: 'Detalės gali liestis, bet neturi gulėti viena ant kitos.',
      }),

    // 7. Iš kelių kvadratų
    () => {
      const kvadratu = pasirink([4, 6, 8, 9])
      const eiluciu = kvadratu === 9 ? 3 : 2
      return uzdavinys('figuru-kompozicija', {
        klausimas: `Iš ${kvadratu} vienodų kvadratų sudėliotas stačiakampis, kurio ${eiluciu} eilutės. Po kiek kvadratų yra vienoje eilutėje?`,
        atsakymas: String(kvadratu / eiluciu),
        atsakymasRodymui: `$${kvadratu / eiluciu}$`,
        sprendimas: `$${kvadratu} : ${eiluciu} = ${kvadratu / eiluciu}$.`,
      })
    },
  ])
}
