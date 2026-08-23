import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys } from './formatai'
import { dalybaKampu, juostineSchema } from './pirmoku-vaizdai'
import { grupes } from './treciokams-vaizdai'
import { stulpeliuDaugyba, taskuEilutes } from './treciokams-matai-vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 3 klasės tema „Daugyba ir dalyba iki 10 000“ — trylika potemių.
 *
 * Anksčiau visos rėmėsi `sveikieji`, `dalumas` ir `sekos` generatoriais; pirmasis
 * skirtas 6 klasei ir duodavo neigiamus skaičius, o dalybos su liekana, dalmens
 * nulio ir daugiaženklio dalijimo stulpeliu — to, kas čia mokoma, — juose nebuvo.
 *
 * Potemės skiriasi tuo, kas veiksme naujo: ar dauginama iš apvalaus skaičiaus,
 * ar peržengiamas skyrius, ar dalmenyje atsiranda nulis. Todėl kiekvienos
 * skaičiai parenkami taip, kad būtent tas atvejis ir pasitaikytų.
 */

const VARDAI = ['Matas', 'Ieva', 'Emilis', 'Luknė', 'Greta', 'Tauras'] as const

function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 10000, 10000)
}

// ── 7.1 Daugyba iš apvalių dešimčių, šimtų, tūkstančių ──────────────────────

const A_APVALUS_DAUG = [
  {
    klausimas: 'Apskaičiuok: $6 \\cdot 10$',
    atsakymas: '60',
    atsakymasRodymui: '$60$',
    sprendimas: 'Dauginant iš 10 prirašomas vienas nulis.',
  },
] as const

export const daugybaApvaliais: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkApvaliaDaugyba(sritis), A_APVALUS_DAUG, 'daugyba-apvaliais')

function kurkApvaliaDaugyba(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const kartotinis = pasirink([10, 100, 1000])
  const nuliu = kartotinis === 10 ? 'vienas nulis' : kartotinis === 100 ? 'du nuliai' : 'trys nuliai'

  return variacija([
    // 1. Vienaženklis iš apvalaus
    () => {
      const a = atsitiktinis(2, 9)
      if (a * kartotinis > maks) return null
      return uzdavinys('daugyba-apvaliais', {
        klausimas: `Apskaičiuok: $${a} \\cdot ${kartotinis}$`,
        atsakymas: String(a * kartotinis),
        atsakymasRodymui: `$${a * kartotinis}$`,
        sprendimas: `Prie ${a} prirašomas ${nuliu}: ${a * kartotinis}.`,
      })
    },

    // 2. Dviženklis iš apvalaus
    () => {
      const a = atsitiktinis(11, 99)
      if (a * kartotinis > maks) return null
      return uzdavinys('daugyba-apvaliais', {
        klausimas: `Apskaičiuok: $${a} \\cdot ${kartotinis}$`,
        atsakymas: String(a * kartotinis),
        atsakymasRodymui: `$${a * kartotinis}$`,
        sprendimas: `Prie ${a} prirašomas ${nuliu}: ${a * kartotinis}.`,
      })
    },

    // 3. Triženklis iš dešimties
    () => {
      const a = atsitiktinis(101, 999)
      if (a * 10 > maks) return null
      return uzdavinys('daugyba-apvaliais', {
        klausimas: `Apskaičiuok: $${a} \\cdot 10$`,
        atsakymas: String(a * 10),
        atsakymasRodymui: `$${a * 10}$`,
        sprendimas: `Prie ${a} prirašomas vienas nulis: ${a * 10}.`,
      })
    },

    // 4. Palyginimas
    () => {
      const a = atsitiktinis(11, 60)
      const kairė = a * 100
      if (kairė > maks) return null
      return pasirinkimoUzdavinys(naujasId('daugyba-apvaliais'), 'daugyba-apvaliais', {
        klausimas: `Palygink: $${a} \\cdot 100$ ir $${a * 10} \\cdot 10$`,
        variantai: ['sandaugos lygios', 'pirmoji didesnė', 'antroji didesnė'],
        teisingas: 0,
        sprendimas: `Abiem atvejais gaunama ${kairė}: dauginant iš 100 prirašomi du nuliai, o iš 10 — vienas.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const a = atsitiktinis(12, 90)
      const blogas = a * 10
      if (a * 100 > maks) return null
      return pasirinkimoUzdavinys(naujasId('daugyba-apvaliais'), 'daugyba-apvaliais', {
        klausimas: `Mokinys apskaičiavo $${a} \\cdot 100 = ${blogas}$. Kur klaida?`,
        variantai: [
          `prirašytas vienas nulis vietoj dviejų: turi būti ${a * 100}`,
          `prirašyti trys nuliai vietoj dviejų`,
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Dauginant iš 100 prirašomi du nuliai: ${a * 100}.`,
      })
    },

    // 6. Kiek kartų padidėja
    () =>
      pasirinkimoUzdavinys(naujasId('daugyba-apvaliais'), 'daugyba-apvaliais', {
        klausimas: `Kiek kartų padidėja skaičius, kai jis dauginamas iš ${kartotinis}?`,
        variantai: [
          `${kartotinis}`,
          `${kartotinis / 10 || 1}`,
          `${kartotinis * 10}`,
        ],
        teisingas: 0,
        sprendimas: `Dauginant iš ${kartotinis} skaičius padidėja ${kartotinis} kartų.`,
      }),

    // 7. Tekstinis
    () => {
      const dezes = atsitiktinis(3, 9)
      const kiekvienoje = pasirink([10, 100])
      if (dezes * kiekvienoje > maks) return null
      return uzdavinys('daugyba-apvaliais', {
        klausimas: `Sandėlyje yra ${dezes} dėžės, kiekvienoje po ${kiekvienoje} vinių. Kiek vinių iš viso?`,
        atsakymas: String(dezes * kiekvienoje),
        atsakymasRodymui: `$${dezes * kiekvienoje}$`,
        sprendimas: `$${dezes} \\cdot ${kiekvienoje} = ${dezes * kiekvienoje}$.`,
      })
    },
  ])
}

// ── 7.2 Dviženklis iš vienaženklio ──────────────────────────────────────────

const A_DVIZENKLIS_DAUG = [
  {
    klausimas: 'Apskaičiuok: $24 \\cdot 3$',
    atsakymas: '72',
    atsakymasRodymui: '$72$',
    sprendimas: '$20 \\cdot 3 = 60$, $4 \\cdot 3 = 12$, iš viso $72$.',
  },
] as const

export const dvizenklioDaugyba: Generatorius = () =>
  suBandymais(kurkDvizenkliDaugyba, A_DVIZENKLIS_DAUG, 'dvizenklio-daugyba')

function kurkDvizenkliDaugyba(): Uzdavinys | null {
  const a = atsitiktinis(12, 49)
  const b = atsitiktinis(2, 9)
  const s = a * b
  const des = Math.floor(a / 10) * 10
  const vnt = a % 10
  if (vnt === 0) return null

  return variacija([
    // 1. Skaidant į skyrius
    () =>
      uzdavinys('dvizenklio-daugyba', {
        klausimas: `Apskaičiuok: $${a} \\cdot ${b}$`,
        atsakymas: String(s),
        atsakymasRodymui: `$${s}$`,
        sprendimas: `$${des} \\cdot ${b} = ${des * b}$, $${vnt} \\cdot ${b} = ${
          vnt * b
        }$, tad $${des * b} + ${vnt * b} = ${s}$.`,
      }),

    // 2. Stulpeliu
    () =>
      uzdavinys('dvizenklio-daugyba', {
        klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
        atsakymas: String(s),
        atsakymasRodymui: `$${s}$`,
        sprendimas: `Pirmiausia dauginami vienetai, tada dešimtys: $${a} \\cdot ${b} = ${s}$.`,
        brezinys: stulpeliuDaugyba(a, b),
      }),

    // 3. Trūkstamas daugiklis
    () =>
      uzdavinys('dvizenklio-daugyba', {
        klausimas: `Užpildyk: $${a} \\cdot \\square = ${s}$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Nežinomas daugiklis randamas dalyba: $${s} : ${a} = ${b}$.`,
      }),

    // 4. Klaidos radimas
    () => {
      const blogas = des * b + vnt
      if (blogas === s) return null
      return pasirinkimoUzdavinys(naujasId('dvizenklio-daugyba'), 'dvizenklio-daugyba', {
        klausimas: `Mokinys apskaičiavo $${a} \\cdot ${b} = ${blogas}$. Kur klaida?`,
        variantai: [
          `vienetai nepadauginti iš ${b}`,
          'dešimtys nepadaugintos',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Teisingai: $${des * b} + ${vnt * b} = ${s}$.`,
      })
    },

    // 5. Kuri sandauga didesnė
    () => {
      const c = atsitiktinis(12, 49)
      const d = atsitiktinis(2, 9)
      if (c * d === s) return null
      return pasirinkimoUzdavinys(naujasId('dvizenklio-daugyba'), 'dvizenklio-daugyba', {
        klausimas: `Kuri sandauga didesnė: $${a} \\cdot ${b}$ ar $${c} \\cdot ${d}$?`,
        variantai:
          s > c * d
            ? [`$${a} \\cdot ${b}$`, `$${c} \\cdot ${d}$`, 'sandaugos lygios']
            : [`$${c} \\cdot ${d}$`, `$${a} \\cdot ${b}$`, 'sandaugos lygios'],
        teisingas: 0,
        sprendimas: `Sandaugos yra ${s} ir ${c * d}.`,
      })
    },

    // 6. Tekstinis
    () => {
      const vardas = pasirink(VARDAI)
      return uzdavinys('dvizenklio-daugyba', {
        klausimas: `${vardas} kiekvieną dieną nubėga po ${a} minutes. Kiek minučių jis nubėgs per ${b} dienas?`,
        atsakymas: String(s),
        atsakymasRodymui: `$${s}$`,
        sprendimas: `$${a} \\cdot ${b} = ${s}$.`,
      })
    },

    // 7. Iš pakartotinės sudėties
    () => {
      const kartu = atsitiktinis(3, 5)
      const vienetas = atsitiktinis(12, 30)
      return uzdavinys('dvizenklio-daugyba', {
        klausimas: `Užrašyk daugyba ir apskaičiuok: $${Array(kartu).fill(vienetas).join(' + ')}$`,
        atsakymas: String(vienetas * kartu),
        atsakymasRodymui: `$${vienetas * kartu}$`,
        sprendimas: `Vienodų dėmenų suma yra daugyba: $${vienetas} \\cdot ${kartu} = ${
          vienetas * kartu
        }$.`,
      })
    },
  ])
}

// ── 7.3 Triženklis ir keturženklis iš vienaženklio ──────────────────────────

const A_TRIZENKLIS_DAUG = [
  {
    klausimas: 'Apskaičiuok: $125 \\cdot 3$',
    atsakymas: '375',
    atsakymasRodymui: '$375$',
    sprendimas: '$100 \\cdot 3 = 300$, $25 \\cdot 3 = 75$, iš viso $375$.',
  },
] as const

export const trizenklioDaugyba: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkTrizenkliDaugyba(sritis), A_TRIZENKLIS_DAUG, 'trizenklio-daugyba')

function kurkTrizenkliDaugyba(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const b = atsitiktinis(2, 6)
  const a = atsitiktinis(102, Math.floor(maks / b))
  if (a < 102) return null
  const s = a * b
  const simtai = Math.floor(a / 100) * 100
  const likutis = a % 100

  return variacija([
    // 1. Skaidant į skyrius
    () =>
      uzdavinys('trizenklio-daugyba', {
        klausimas: `Apskaičiuok: $${a} \\cdot ${b}$`,
        atsakymas: String(s),
        atsakymasRodymui: `$${s}$`,
        sprendimas: `$${simtai} \\cdot ${b} = ${simtai * b}$, $${likutis} \\cdot ${b} = ${
          likutis * b
        }$, tad $${simtai * b} + ${likutis * b} = ${s}$.`,
      }),

    // 2. Stulpeliu
    () =>
      uzdavinys('trizenklio-daugyba', {
        klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
        atsakymas: String(s),
        atsakymasRodymui: `$${s}$`,
        sprendimas: `Dauginama iš dešinės į kairę: $${a} \\cdot ${b} = ${s}$.`,
        brezinys: stulpeliuDaugyba(a, b),
      }),

    // 3. Apvalus keturženklis
    () => {
      const t = atsitiktinis(1, 2) * 1000 + atsitiktinis(0, 4) * 100
      const k = atsitiktinis(2, 4)
      if (t * k > maks) return null
      return uzdavinys('trizenklio-daugyba', {
        klausimas: `Apskaičiuok: $${t} \\cdot ${k}$`,
        atsakymas: String(t * k),
        atsakymasRodymui: `$${t * k}$`,
        sprendimas: `$${t} \\cdot ${k} = ${t * k}$.`,
      })
    },

    // 4. Klaidos radimas — praleistas nulis
    () => {
      const suNuliu = atsitiktinis(1, 5) * 100 + atsitiktinis(1, 9)
      const k = atsitiktinis(2, 4)
      if (suNuliu * k > maks) return null
      const blogas = Math.floor(suNuliu / 100) * k * 100 + (suNuliu % 10) * k - 300
      if (blogas < 0 || blogas === suNuliu * k) return null
      return pasirinkimoUzdavinys(naujasId('trizenklio-daugyba'), 'trizenklio-daugyba', {
        klausimas: `Mokinys apskaičiavo $${suNuliu} \\cdot ${k} = ${blogas}$. Kur klaida?`,
        variantai: [
          `praleistas dešimčių skyriaus nulis: turi būti ${suNuliu * k}`,
          'sukeisti daugikliai',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Nulis skaičiuje ${suNuliu} taip pat dauginamas: $${suNuliu} \\cdot ${k} = ${
          suNuliu * k
        }$.`,
      })
    },

    // 5. Palyginimas su gretimu skaičiumi
    () => {
      const k = atsitiktinis(2, 5)
      if (1000 * k > maks) return null
      return uzdavinys('trizenklio-daugyba', {
        klausimas: `Keliais vienetais skiriasi sandaugos $999 \\cdot ${k}$ ir $1000 \\cdot ${k}$?`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `Skaičiai skiriasi vienetu, tad sandaugos skiriasi ${k}: $1000 \\cdot ${k} - 999 \\cdot ${k} = ${k}$.`,
      })
    },

    // 6. Tekstinis
    () => {
      const dezes = atsitiktinis(2, 6)
      const kiekvienoje = atsitiktinis(105, Math.floor(maks / dezes))
      if (kiekvienoje < 105) return null
      return uzdavinys('trizenklio-daugyba', {
        klausimas: `${dezes} dėžėse yra po ${kiekvienoje} sąvaržėles. Kiek sąvaržėlių iš viso?`,
        atsakymas: String(dezes * kiekvienoje),
        atsakymasRodymui: `$${dezes * kiekvienoje}$`,
        sprendimas: `$${dezes} \\cdot ${kiekvienoje} = ${dezes * kiekvienoje}$.`,
      })
    },

    // 7. Trūkstamas daugiklis
    () =>
      uzdavinys('trizenklio-daugyba', {
        klausimas: `Užpildyk: $${a} \\cdot \\square = ${s}$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${s} : ${a} = ${b}$.`,
      }),
  ])
}

// ── 7.4 Dalyba iš apvalių dešimčių, šimtų, tūkstančių ───────────────────────

const A_APVALUS_DAL = [
  {
    klausimas: 'Apskaičiuok: $80 : 10$',
    atsakymas: '8',
    atsakymasRodymui: '$8$',
    sprendimas: 'Dalijant iš 10 nubraukiamas vienas nulis.',
  },
] as const

export const dalybaApvaliais: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkApvaliaDalyba(sritis), A_APVALUS_DAL, 'dalyba-apvaliais')

function kurkApvaliaDalyba(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const kartotinis = pasirink([10, 100, 1000])
  const dalmuo = atsitiktinis(2, 90)
  const dalinys = dalmuo * kartotinis
  if (dalinys > maks) return null
  const nuliu = kartotinis === 10 ? 'vienas nulis' : kartotinis === 100 ? 'du nuliai' : 'trys nuliai'

  return variacija([
    // 1. Paprasta dalyba
    () =>
      uzdavinys('dalyba-apvaliais', {
        klausimas: `Apskaičiuok: $${dalinys} : ${kartotinis}$`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `Nubraukiamas ${nuliu}: ${dalmuo}.`,
      }),

    // 2. Kiek kartų sumažėja
    () =>
      pasirinkimoUzdavinys(naujasId('dalyba-apvaliais'), 'dalyba-apvaliais', {
        klausimas: `Kiek kartų sumažėja skaičius, kai jis dalijamas iš ${kartotinis}?`,
        variantai: [`${kartotinis}`, `${kartotinis / 10 || 1}`, `${kartotinis * 10}`],
        teisingas: 0,
        sprendimas: `Dalijant iš ${kartotinis} skaičius sumažėja ${kartotinis} kartų.`,
      }),

    // 3. Palyginimas
    () => {
      const a = atsitiktinis(2, 60)
      if (a * 100 > maks) return null
      return pasirinkimoUzdavinys(naujasId('dalyba-apvaliais'), 'dalyba-apvaliais', {
        klausimas: `Palygink: $${a * 100} : 100$ ir $${a * 10} : 10$`,
        variantai: ['dalmenys lygūs', 'pirmasis didesnis', 'antrasis didesnis'],
        teisingas: 0,
        sprendimas: `Abiem atvejais gaunama ${a}.`,
      })
    },

    // 4. Klaidos radimas
    () => {
      const a = atsitiktinis(20, 90) * 100
      if (a > maks) return null
      return pasirinkimoUzdavinys(naujasId('dalyba-apvaliais'), 'dalyba-apvaliais', {
        klausimas: `Mokinys apskaičiavo $${a} : 100 = ${a}$. Kur klaida?`,
        variantai: [
          `dalmuo turi būti mažesnis: ${a / 100}`,
          `dalmuo turi būti didesnis`,
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Dalijant skaičius mažėja: $${a} : 100 = ${a / 100}$.`,
      })
    },

    // 5. Nepilnai nubraukiami nuliai
    () => {
      const a = atsitiktinis(11, 89) * 100
      if (a > maks) return null
      return uzdavinys('dalyba-apvaliais', {
        klausimas: `Apskaičiuok: $${a} : 10$`,
        atsakymas: String(a / 10),
        atsakymasRodymui: `$${a / 10}$`,
        sprendimas: `Nubraukiamas vienas nulis: ${a / 10}.`,
      })
    },

    // 6. Tekstinis
    () => {
      const dezeje = pasirink([10, 100])
      const viso = dezeje * atsitiktinis(3, 20)
      if (viso > maks) return null
      return uzdavinys('dalyba-apvaliais', {
        klausimas: `${viso} sąsiuvinių sudėta į pakuotes po ${dezeje}. Kiek gavosi pakuočių?`,
        atsakymas: String(viso / dezeje),
        atsakymasRodymui: `$${viso / dezeje}$`,
        sprendimas: `$${viso} : ${dezeje} = ${viso / dezeje}$.`,
      })
    },

    // 7. Atvirkštinis veiksmas
    () =>
      uzdavinys('dalyba-apvaliais', {
        klausimas: `Užpildyk: $\\square : ${kartotinis} = ${dalmuo}$`,
        atsakymas: String(dalinys),
        atsakymasRodymui: `$${dalinys}$`,
        sprendimas: `Dalinys randamas daugyba: $${dalmuo} \\cdot ${kartotinis} = ${dalinys}$.`,
      }),
  ])
}

// ── 7.5 Dalyba su liekana ───────────────────────────────────────────────────

const A_LIEKANA = [
  {
    klausimas: 'Padalyk su liekana: $10 : 3$. Kokia liekana?',
    atsakymas: '1',
    atsakymasRodymui: '$1$',
    sprendimas: '$3 \\cdot 3 = 9$, liekana $10 - 9 = 1$.',
  },
] as const

export const dalybaSuLiekana: Generatorius = () =>
  suBandymais(kurkLiekana, A_LIEKANA, 'dalyba-su-liekana')

function kurkLiekana(): Uzdavinys | null {
  const daliklis = atsitiktinis(3, 9)
  const dalmuo = atsitiktinis(2, 9)
  const liekana = atsitiktinis(1, daliklis - 1)
  const dalinys = daliklis * dalmuo + liekana

  return variacija([
    // 1. Kokia liekana
    () =>
      uzdavinys('dalyba-su-liekana', {
        klausimas: `Padalyk su liekana: $${dalinys} : ${daliklis}$. Kokia liekana?`,
        atsakymas: String(liekana),
        atsakymasRodymui: `$${liekana}$`,
        sprendimas: `$${daliklis} \\cdot ${dalmuo} = ${
          daliklis * dalmuo
        }$, liekana $${dalinys} - ${daliklis * dalmuo} = ${liekana}$.`,
      }),

    // 2. Koks dalmuo
    () =>
      uzdavinys('dalyba-su-liekana', {
        klausimas: `Padalyk su liekana: $${dalinys} : ${daliklis}$. Koks dalmuo?`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `Didžiausias tinkamas dalmuo yra ${dalmuo}, nes $${daliklis} \\cdot ${dalmuo} = ${
          daliklis * dalmuo
        }$, o liekana ${liekana}.`,
      }),

    // 3. Kas yra liekana
    () =>
      pasirinkimoUzdavinys(naujasId('dalyba-su-liekana'), 'dalyba-su-liekana', {
        klausimas: 'Kas yra liekana?',
        variantai: [
          'tai, kas lieka nepadalyta, ir ji visada mažesnė už daliklį',
          'skaičius, didesnis už daliklį',
          'skaičius, lygus dalmeniui',
        ],
        teisingas: 0,
        sprendimas: 'Jei liekana būtų ne mažesnė už daliklį, dalmenį dar būtų galima padidinti.',
      }),

    // 4. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('dalyba-su-liekana'), 'dalyba-su-liekana', {
        klausimas: `Mokinys rašo: $18 : 5 = 3$, liekana $5$. Kodėl taip negali būti?`,
        variantai: [
          'liekana negali būti lygi dalikliui — dalmenį dar galima padidinti',
          'liekana negali būti mažesnė už daliklį',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: 'Teisingai yra $18 : 5 = 3$, liekana $3$.',
      }),

    // 5. Atkurti dalinį
    () =>
      uzdavinys('dalyba-su-liekana', {
        klausimas: `Kuris skaičius dalijant iš ${daliklis} duoda dalmenį ${dalmuo} ir liekaną ${liekana}?`,
        atsakymas: String(dalinys),
        atsakymasRodymui: `$${dalinys}$`,
        sprendimas: `$${daliklis} \\cdot ${dalmuo} + ${liekana} = ${dalinys}$.`,
      }),

    // 6. Tekstinis
    () => {
      const vaikai = daliklis
      return uzdavinys('dalyba-su-liekana', {
        klausimas: `${dalinys} saldainiai dalijami po lygiai ${vaikai} vaikams. Kiek saldainių liks nepadalytų?`,
        atsakymas: String(liekana),
        atsakymasRodymui: `$${liekana}$`,
        sprendimas: `Kiekvienas gaus po ${dalmuo}, o liks $${dalinys} - ${
          daliklis * dalmuo
        } = ${liekana}$.`,
      })
    },

    // 7. Kiek dėžių reikės
    () => {
      const dezeje = daliklis
      return uzdavinys('dalyba-su-liekana', {
        klausimas: `${dalinys} obuoliai dedami į dėžes po ${dezeje}. Kiek dėžių reikės, kad tilptų visi obuoliai?`,
        atsakymas: String(dalmuo + 1),
        atsakymasRodymui: `$${dalmuo + 1}$`,
        sprendimas: `Pilnos dėžės — ${dalmuo}, o likusiems ${liekana} obuoliams reikia dar vienos: ${
          dalmuo + 1
        }.`,
      })
    },
  ])
}

// ── 7.6 Dviženklis dalijamas iš vienaženklio ────────────────────────────────

const A_DVIZENKLIS_DAL = [
  {
    klausimas: 'Apskaičiuok: $24 : 3$',
    atsakymas: '8',
    atsakymasRodymui: '$8$',
    sprendimas: '$3 \\cdot 8 = 24$.',
  },
] as const

export const dvizenklioDalyba: Generatorius = () =>
  suBandymais(kurkDvizenkliDalyba, A_DVIZENKLIS_DAL, 'dvizenklio-dalyba')

function kurkDvizenkliDalyba(): Uzdavinys | null {
  const daliklis = atsitiktinis(3, 9)
  const dalmuo = atsitiktinis(4, Math.floor(99 / daliklis))
  const dalinys = daliklis * dalmuo
  if (dalinys < 20) return null

  return variacija([
    // 1. Paprasta dalyba
    () =>
      uzdavinys('dvizenklio-dalyba', {
        klausimas: `Apskaičiuok: $${dalinys} : ${daliklis}$`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `$${daliklis} \\cdot ${dalmuo} = ${dalinys}$.`,
      }),

    // 2. Kampu
    () =>
      uzdavinys('dvizenklio-dalyba', {
        klausimas: 'Apskaičiuok kampu. Koks dalmuo?',
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `$${dalinys} : ${daliklis} = ${dalmuo}$.`,
        brezinys: dalybaKampu(dalinys, daliklis),
      }),

    // 3. Susijusi daugyba
    () =>
      uzdavinys('dvizenklio-dalyba', {
        klausimas: `Užpildyk: $${daliklis} \\cdot \\square = ${dalinys}$`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `Šis veiksmas yra $${dalinys} : ${daliklis} = ${dalmuo}$ pora.`,
      }),

    // 4. Klaidos radimas
    () => {
      const blogas = dalmuo - 1
      if (blogas < 1) return null
      return pasirinkimoUzdavinys(naujasId('dvizenklio-dalyba'), 'dvizenklio-dalyba', {
        klausimas: `Mokinys apskaičiavo $${dalinys} : ${daliklis} = ${blogas}$. Kur klaida?`,
        variantai: [
          `patikrinus gaunama $${daliklis} \\cdot ${blogas} = ${
            daliklis * blogas
          }$, o ne ${dalinys}`,
          `dalmuo turi būti dar mažesnis`,
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Teisingas dalmuo yra ${dalmuo}, nes $${daliklis} \\cdot ${dalmuo} = ${dalinys}$.`,
      })
    },

    // 5. Palyginimas
    () => {
      const d2 = atsitiktinis(3, 9)
      const dm2 = atsitiktinis(4, Math.floor(99 / d2))
      if (dm2 === dalmuo) return null
      return pasirinkimoUzdavinys(naujasId('dvizenklio-dalyba'), 'dvizenklio-dalyba', {
        klausimas: `Kuris dalmuo didesnis: $${dalinys} : ${daliklis}$ ar $${d2 * dm2} : ${d2}$?`,
        variantai:
          dalmuo > dm2
            ? [`$${dalinys} : ${daliklis}$`, `$${d2 * dm2} : ${d2}$`, 'dalmenys lygūs']
            : [`$${d2 * dm2} : ${d2}$`, `$${dalinys} : ${daliklis}$`, 'dalmenys lygūs'],
        teisingas: 0,
        sprendimas: `Dalmenys yra ${dalmuo} ir ${dm2}.`,
      })
    },

    // 6. Tekstinis
    () =>
      uzdavinys('dvizenklio-dalyba', {
        klausimas: `${dalinys} pieštukai sudėti po lygiai į ${daliklis} dėžutes. Kiek pieštukų vienoje dėžutėje?`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `$${dalinys} : ${daliklis} = ${dalmuo}$.`,
      }),

    // 7. Iš schemos
    () =>
      uzdavinys('dvizenklio-dalyba', {
        klausimas: 'Kiek objektų yra vienoje brėžinio grupėje?',
        atsakymas: String(dalmuo <= 9 ? dalmuo : daliklis),
        atsakymasRodymui: `$${dalmuo <= 9 ? dalmuo : daliklis}$`,
        sprendimas:
          dalmuo <= 9
            ? `Iš viso ${dalinys}, grupių ${daliklis}: $${dalinys} : ${daliklis} = ${dalmuo}$.`
            : `Iš viso ${dalinys}, grupių ${dalmuo}: $${dalinys} : ${dalmuo} = ${daliklis}$.`,
        brezinys:
          dalmuo <= 9 ? grupes(daliklis, dalmuo) : grupes(Math.min(dalmuo, 8), daliklis),
      }),
  ])
}

// ── 7.7 ir 7.8 Triženklis ir keturženklis dalijamas iš vienaženklio ─────────

function kurkIlgaDalyba(temaId: string, skaitmenu: 3 | 4, maks: number): Uzdavinys | null {
  const daliklis = atsitiktinis(3, 9)
  const min = skaitmenu === 3 ? 100 : 1000
  const rib = Math.min(skaitmenu === 3 ? 999 : 9999, maks)
  const dalmuo = atsitiktinis(Math.ceil(min / daliklis), Math.floor(rib / daliklis))
  const dalinys = daliklis * dalmuo
  if (dalinys < min || dalinys > rib) return null
  const vardas = pasirink(VARDAI)

  return variacija([
    // 1. Paprasta dalyba
    () =>
      uzdavinys(temaId, {
        klausimas: `Apskaičiuok: $${dalinys} : ${daliklis}$`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `$${daliklis} \\cdot ${dalmuo} = ${dalinys}$.`,
      }),

    // 2. Kampu
    () =>
      uzdavinys(temaId, {
        klausimas: 'Apskaičiuok kampu. Koks dalmuo?',
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `Dalijama iš kairės: pirmiausia ${
          skaitmenu === 3 ? 'šimtai' : 'tūkstančiai'
        }, tada likę skyriai. Gaunama ${dalmuo}.`,
        brezinys: dalybaKampu(dalinys, daliklis, dalmuo),
      }),

    // 3. Patikrinimas daugyba
    () =>
      uzdavinys(temaId, {
        klausimas: `${vardas} apskaičiavo $${dalinys} : ${daliklis} = ${dalmuo}$. Kiek gausi patikrindamas veiksmu $${dalmuo} \\cdot ${daliklis}$?`,
        atsakymas: String(dalinys),
        atsakymasRodymui: `$${dalinys}$`,
        sprendimas: `Turi gautis dalinys: $${dalmuo} \\cdot ${daliklis} = ${dalinys}$.`,
      }),

    // 4. Klaidos radimas
    () => {
      const blogas = Math.floor(dalmuo / 10)
      if (blogas < 1) return null
      return pasirinkimoUzdavinys(naujasId(temaId), temaId, {
        klausimas: `Mokinys apskaičiavo $${dalinys} : ${daliklis} = ${blogas}$. Kur klaida?`,
        variantai: [
          `dalmenyje trūksta skyriaus: turi būti ${dalmuo}`,
          'dalmuo turi būti dar mažesnis',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Patikrinus: $${daliklis} \\cdot ${dalmuo} = ${dalinys}$.`,
      })
    },

    // 5. Trūkstamas dalinys
    () =>
      uzdavinys(temaId, {
        klausimas: `Užpildyk: $\\square : ${daliklis} = ${dalmuo}$`,
        atsakymas: String(dalinys),
        atsakymasRodymui: `$${dalinys}$`,
        sprendimas: `$${dalmuo} \\cdot ${daliklis} = ${dalinys}$.`,
      }),

    // 6. Tekstinis
    () =>
      uzdavinys(temaId, {
        klausimas: `${dalinys} knygos padalytos po lygiai į ${daliklis} lentynas. Kiek knygų vienoje lentynoje?`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `$${dalinys} : ${daliklis} = ${dalmuo}$.`,
      }),

    // 7. Palyginimas
    () => {
      const d2 = atsitiktinis(3, 9)
      const dm2 = atsitiktinis(Math.ceil(min / d2), Math.floor(rib / d2))
      if (dm2 === dalmuo) return null
      return pasirinkimoUzdavinys(naujasId(temaId), temaId, {
        klausimas: `Kuris dalmuo didesnis: $${dalinys} : ${daliklis}$ ar $${d2 * dm2} : ${d2}$?`,
        variantai:
          dalmuo > dm2
            ? [`$${dalinys} : ${daliklis}$`, `$${d2 * dm2} : ${d2}$`, 'dalmenys lygūs']
            : [`$${d2 * dm2} : ${d2}$`, `$${dalinys} : ${daliklis}$`, 'dalmenys lygūs'],
        teisingas: 0,
        sprendimas: `Dalmenys yra ${dalmuo} ir ${dm2}.`,
      })
    },
  ])
}

const A_ILGA_DALYBA = [
  {
    klausimas: 'Apskaičiuok: $126 : 3$',
    atsakymas: '42',
    atsakymasRodymui: '$42$',
    sprendimas: '$3 \\cdot 42 = 126$.',
  },
] as const

export const trizenklioDalyba: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(
    () => kurkIlgaDalyba('trizenklio-dalyba', 3, riba(sritis)),
    A_ILGA_DALYBA,
    'trizenklio-dalyba',
  )

export const keturzenklioDalyba: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(
    () => kurkIlgaDalyba('keturzenklio-dalyba', 4, riba(sritis)),
    A_ILGA_DALYBA,
    'keturzenklio-dalyba',
  )

// ── 7.9 Kada dalmenyje reikia rašyti nulį? ──────────────────────────────────

const A_NULIS = [
  {
    klausimas: 'Apskaičiuok: $404 : 2$',
    atsakymas: '202',
    atsakymasRodymui: '$202$',
    sprendimas: 'Dešimčių nėra, tad dalmenyje rašomas nulis: $202$.',
  },
] as const

export const nulisDalmenyje: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkNuli(sritis), A_NULIS, 'nulis-dalmenyje')

/** Dalmuo su nuliu viduryje — būtent tokie atvejai šioje potemėje ir mokomi. */
function dalmuoSuNuliu(skaitmenu: 3 | 4): number {
  if (skaitmenu === 3) return atsitiktinis(1, 9) * 100 + atsitiktinis(1, 9)
  return atsitiktinis(1, 9) * 1000 + atsitiktinis(0, 9) * 10 + atsitiktinis(1, 9)
}

function kurkNuli(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const daliklis = atsitiktinis(2, 9)
  const dalmuo = dalmuoSuNuliu(pasirink([3, 4] as const))
  const dalinys = daliklis * dalmuo
  if (dalinys > maks) return null
  // Nulis turi būti pačiame dalmenyje, o ne jo gale.
  const s = String(dalmuo)
  if (!s.slice(1, -1).includes('0')) return null

  return variacija([
    // 1. Apskaičiuoti
    () =>
      uzdavinys('nulis-dalmenyje', {
        klausimas: `Apskaičiuok: $${dalinys} : ${daliklis}$`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `Viename skyriuje nieko nelieka, tad dalmenyje rašomas nulis: ${dalmuo}.`,
      }),

    // 2. Kampu
    () =>
      uzdavinys('nulis-dalmenyje', {
        klausimas: 'Apskaičiuok kampu. Koks dalmuo?',
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `$${dalinys} : ${daliklis} = ${dalmuo}$ — dalmenyje yra nulis.`,
        brezinys: dalybaKampu(dalinys, daliklis, dalmuo),
      }),

    // 3. Kodėl atsiranda nulis
    () =>
      pasirinkimoUzdavinys(naujasId('nulis-dalmenyje'), 'nulis-dalmenyje', {
        klausimas: 'Kodėl dalijant kartais dalmenyje atsiranda nulis?',
        variantai: [
          'nes tame skyriuje daliklis netelpa nė karto',
          'nes dalinys yra lyginis',
          'nes daliklis didesnis už 5',
        ],
        teisingas: 0,
        sprendimas: 'Kai skyriaus skaitmuo mažesnis už daliklį, dalmenyje rašomas nulis.',
      }),

    // 4. Klaidos radimas — praleistas nulis
    () => {
      const be = Number(String(dalmuo).replace('0', ''))
      if (be === dalmuo || be < 1) return null
      return pasirinkimoUzdavinys(naujasId('nulis-dalmenyje'), 'nulis-dalmenyje', {
        klausimas: `Mokinys apskaičiavo $${dalinys} : ${daliklis} = ${be}$. Ką jis praleido?`,
        variantai: [`dalmenyje praleistas nulis: turi būti ${dalmuo}`, 'praleista liekana', 'klaidos nėra'],
        teisingas: 0,
        sprendimas: `Patikrinus: $${daliklis} \\cdot ${dalmuo} = ${dalinys}$.`,
      })
    },

    // 5. Kuriame veiksme dalmenyje yra nulis
    () => {
      const suNuliu = `$${dalinys} : ${daliklis}$`
      const a = atsitiktinis(2, 9)
      const b = atsitiktinis(112, 199)
      const c = atsitiktinis(2, 9)
      const d = atsitiktinis(112, 199)
      if (String(b).includes('0') || String(d).includes('0')) return null
      return pasirinkimoUzdavinys(naujasId('nulis-dalmenyje'), 'nulis-dalmenyje', {
        klausimas: 'Kuriame veiksme dalmenyje bus nulis?',
        variantai: [suNuliu, `$${a * b} : ${a}$`, `$${c * d} : ${c}$`],
        teisingas: 0,
        sprendimas: `Tik $${dalinys} : ${daliklis}$ duoda ${dalmuo} — su nuliu viduryje.`,
      })
    },

    // 6. Patikrinimas daugyba
    () =>
      uzdavinys('nulis-dalmenyje', {
        klausimas: `Patikrink daugyba: kiek yra $${dalmuo} \\cdot ${daliklis}$?`,
        atsakymas: String(dalinys),
        atsakymasRodymui: `$${dalinys}$`,
        sprendimas: `$${dalmuo} \\cdot ${daliklis} = ${dalinys}$ — tai pradinis dalinys.`,
      }),

    // 7. Tekstinis
    () =>
      uzdavinys('nulis-dalmenyje', {
        klausimas: `${dalinys} sėklos išbertos po lygiai į ${daliklis} vagas. Kiek sėklų vienoje vagoje?`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${dalmuo}$`,
        sprendimas: `$${dalinys} : ${daliklis} = ${dalmuo}$.`,
      }),
  ])
}

// ── 7.10 Kiek kartų padidėja ar sumažėja sekos narys? ───────────────────────

const A_KARTU_SEKOS = [
  {
    klausimas: 'Pratęsk seką: 2, 4, 8, 16, $\\square$.',
    atsakymas: '32',
    atsakymasRodymui: '$32$',
    sprendimas: 'Kiekvienas narys 2 kartus didesnis: $16 \\cdot 2 = 32$.',
  },
] as const

export const kartuSekos3: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkKartuSekas(sritis), A_KARTU_SEKOS, 'kartu-sekos-3')

function kurkKartuSekas(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const kartai = pasirink([2, 3, 4])
  const pradzia = pasirink([2, 3, 4, 5])

  return variacija([
    // 1. Didėjanti seka
    () => {
      const nariai = [0, 1, 2, 3].map((i) => pradzia * kartai ** i)
      const kitas = pradzia * kartai ** 4
      if (kitas > maks) return null
      return uzdavinys('kartu-sekos-3', {
        klausimas: `Pratęsk seką: ${nariai.join(', ')}, $\\square$.`,
        atsakymas: String(kitas),
        atsakymasRodymui: `$${kitas}$`,
        sprendimas: `Kiekvienas narys ${kartai} kartus didesnis: $${nariai[3]} \\cdot ${kartai} = ${kitas}$.`,
      })
    },

    // 2. Mažėjanti seka
    () => {
      const didziausias = pradzia * kartai ** 4
      if (didziausias > maks) return null
      const nariai = [0, 1, 2, 3].map((i) => didziausias / kartai ** i)
      const kitas = didziausias / kartai ** 4
      if (!Number.isInteger(kitas)) return null
      return uzdavinys('kartu-sekos-3', {
        klausimas: `Pratęsk seką: ${nariai.join(', ')}, $\\square$.`,
        atsakymas: String(kitas),
        atsakymasRodymui: `$${kitas}$`,
        sprendimas: `Kiekvienas narys ${kartai} kartus mažesnis: $${nariai[3]} : ${kartai} = ${kitas}$.`,
      })
    },

    // 3. Kiek kartų keičiasi
    () => {
      const nariai = [0, 1, 2, 3].map((i) => pradzia * kartai ** i)
      if (nariai[3] > maks) return null
      return uzdavinys('kartu-sekos-3', {
        klausimas: `Kiek kartų padidėja kiekvienas sekos narys: ${nariai.join(', ')}?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: `$${nariai[1]} : ${nariai[0]} = ${kartai}$ — ir taip toliau.`,
      })
    },

    // 4. Klaidos radimas
    () => {
      const nariai = [7, 14, 28, 56]
      return pasirinkimoUzdavinys(naujasId('kartu-sekos-3'), 'kartu-sekos-3', {
        klausimas: 'Mokinys sako, kad sekoje 7, 14, 28, 56 kiekvienas narys padidėja 7. Kur klaida?',
        variantai: [
          'nariai ne pridedami, o dauginami iš 2',
          'nariai iš tikrųjų padidėja 14',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `$${nariai[1]} : ${nariai[0]} = 2$, o skirtumai kaskart skirtingi.`,
      })
    },

    // 5. Netinkamas narys
    () => {
      const nariai = [0, 1, 2, 3].map((i) => pradzia * kartai ** i)
      if (nariai[3] > maks) return null
      const blogas = nariai[2] + kartai
      const rodomi = [...nariai]
      rodomi[2] = blogas
      if (blogas === nariai[2]) return null
      return uzdavinys('kartu-sekos-3', {
        klausimas: `Sekos nariai kaskart didėja tiek pat kartų. Kuris narys netinka: ${rodomi.join(
          ', ',
        )}?`,
        atsakymas: String(blogas),
        atsakymasRodymui: `$${blogas}$`,
        sprendimas: `Trečioje vietoje turėtų būti $${nariai[1]} \\cdot ${kartai} = ${nariai[2]}$.`,
      })
    },

    // 6. Rasti taisyklę pagal du narius
    () => {
      const pirmas = pasirink([5, 6, 7])
      const penktas = pirmas * 3 ** 4
      if (penktas > maks) return null
      return uzdavinys('kartu-sekos-3', {
        klausimas: `Sekos pirmasis narys ${pirmas}, o penktasis — ${penktas}. Kiek kartų kaskart didėja narys?`,
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: `${pirmas}, ${pirmas * 3}, ${pirmas * 9}, ${pirmas * 27}, ${penktas} — kaskart 3 kartus.`,
      })
    },

    // 7. Dviejų sekų palyginimas
    () => {
      const A = [4, 8, 16, 32]
      const B = [81, 27, 9, 3]
      return pasirinkimoUzdavinys(naujasId('kartu-sekos-3'), 'kartu-sekos-3', {
        klausimas: `Palygink sekas: A — ${A.join(', ')} ir B — ${B.join(
          ', ',
        )}. Kaip keičiasi jų nariai?`,
        variantai: [
          'A nariai didėja 2 kartus, B — mažėja 3 kartus',
          'abi sekos didėja 2 kartus',
          'A mažėja 2 kartus, B didėja 3 kartus',
        ],
        teisingas: 0,
        sprendimas: '$8 : 4 = 2$, o $81 : 27 = 3$, ir B nariai mažėja.',
      })
    },
  ])
}

// ── 7.11 Daugyba ir dalyba tekstiniuose uždaviniuose ────────────────────────

const A_TEKSTINIAI_DD = [
  {
    klausimas: 'Vienoje dėžėje 6 obuoliai. Kiek obuolių yra 4 dėžėse?',
    atsakymas: '24',
    atsakymasRodymui: '$24$',
    sprendimas: '$6 \\cdot 4 = 24$.',
  },
] as const

export const tekstiniaiDaugybaDalyba: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkTekstiniusDD(sritis), A_TEKSTINIAI_DD, 'tekstiniai-daugyba-dalyba')

function kurkTekstiniusDD(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const grupiu = atsitiktinis(4, 9)
  const kiekvienoje = atsitiktinis(4, 12)
  const sand = grupiu * kiekvienoje
  if (sand > maks) return null

  return variacija([
    // 1. Kiek iš viso
    () =>
      uzdavinys('tekstiniai-daugyba-dalyba', {
        klausimas: `Vienoje dėžėje yra ${kiekvienoje} obuoliai. Kiek obuolių yra ${grupiu} dėžėse?`,
        atsakymas: String(sand),
        atsakymasRodymui: `$${sand}$`,
        sprendimas: `$${kiekvienoje} \\cdot ${grupiu} = ${sand}$.`,
      }),

    // 2. Kiek gaus kiekvienas
    () =>
      uzdavinys('tekstiniai-daugyba-dalyba', {
        klausimas: `${grupiu} vaikams po lygiai padalyta ${sand} sausainių. Kiek gaus kiekvienas?`,
        atsakymas: String(kiekvienoje),
        atsakymasRodymui: `$${kiekvienoje}$`,
        sprendimas: `$${sand} : ${grupiu} = ${kiekvienoje}$.`,
      }),

    // 3. Kiek dėžučių reikia
    () =>
      uzdavinys('tekstiniai-daugyba-dalyba', {
        klausimas: `${sand} pieštukai sudedami po ${kiekvienoje} į dėžutes. Kiek dėžučių reikės?`,
        atsakymas: String(grupiu),
        atsakymasRodymui: `$${grupiu}$`,
        sprendimas: `$${sand} : ${kiekvienoje} = ${grupiu}$.`,
      }),

    // 4. Iš piešinio
    () => {
      const eiluciu = atsitiktinis(3, 6)
      const eileje = atsitiktinis(3, 7)
      return uzdavinys('tekstiniai-daugyba-dalyba', {
        // Skaičiai tekste neįvardijami — juos reikia nuskaityti iš piešinio.
        klausimas: 'Kiek žvaigždučių iš viso pavaizduota?',
        atsakymas: String(eiluciu * eileje),
        atsakymasRodymui: `$${eiluciu * eileje}$`,
        sprendimas: `Eilučių ${eiluciu}, kiekvienoje po ${eileje}: $${eiluciu} \\cdot ${eileje} = ${
          eiluciu * eileje
        }$.`,
        brezinys: taskuEilutes(eiluciu, eileje),
      })
    },

    // 5. Du žingsniai: daugyba ir atimtis
    () => {
      const isdalijo = atsitiktinis(5, Math.min(30, sand - 5))
      return uzdavinys('tekstiniai-daugyba-dalyba', {
        klausimas: `Mokykla nupirko ${grupiu} dėžes kreidelių, kiekvienoje po ${kiekvienoje}. Vėliau ${isdalijo} kreidelės išdalytos. Kiek liko?`,
        atsakymas: String(sand - isdalijo),
        atsakymasRodymui: `$${sand - isdalijo}$`,
        sprendimas: `$${grupiu} \\cdot ${kiekvienoje} = ${sand}$, tada $${sand} - ${isdalijo} = ${
          sand - isdalijo
        }$.`,
      })
    },

    // 6. Du žingsniai: dalyba po pridėjimo
    () => {
      const prisidejo = grupiu * atsitiktinis(1, 3)
      const nauja = (sand + prisidejo * kiekvienoje) / grupiu
      if (!Number.isInteger(nauja) || sand + prisidejo * kiekvienoje > maks) return null
      return uzdavinys('tekstiniai-daugyba-dalyba', {
        klausimas: `${sand} vaikai suskirstyti po lygiai į ${grupiu} komandas. Atėjus dar ${
          prisidejo * kiekvienoje
        } vaikams, visi vėl paskirstyti po lygiai. Kiek vaikų dabar vienoje komandoje?`,
        atsakymas: String(nauja),
        atsakymasRodymui: `$${nauja}$`,
        sprendimas: `Iš viso $${sand} + ${prisidejo * kiekvienoje} = ${
          sand + prisidejo * kiekvienoje
        }$, tad $${sand + prisidejo * kiekvienoje} : ${grupiu} = ${nauja}$.`,
      })
    },

    // 7. Kurio veiksmo reikia
    () =>
      pasirinkimoUzdavinys(
        naujasId('tekstiniai-daugyba-dalyba'),
        'tekstiniai-daugyba-dalyba',
        {
          klausimas: `Uždaviniui „${grupiu} dėžėse po ${kiekvienoje} obuolius. Kiek obuolių iš viso?“ mokinys parašė $${kiekvienoje} : ${grupiu}$. Kur klaida?`,
          variantai: [
            `ieškoma visuma, tad reikia daugybos: $${grupiu} \\cdot ${kiekvienoje}$`,
            'reikėjo atimties',
            'klaidos nėra',
          ],
          teisingas: 0,
          sprendimas: `Dalyba tiktų, jei būtų klausiama, po kiek tenka vienai dėžei.`,
        },
      ),
  ])
}

// ── 7.12 Tekstinis uždavinys skirtingais būdais ─────────────────────────────

const A_BUDAI = [
  {
    klausimas: 'Klasėje 3 eilės po 8 suolus. Kiek suolų iš viso?',
    atsakymas: '24',
    atsakymasRodymui: '$24$',
    sprendimas: '$3 \\cdot 8 = 24$ arba $8 + 8 + 8 = 24$.',
  },
] as const

export const uzdavinysBudais: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkBudus(sritis), A_BUDAI, 'uzdavinys-budais')

function kurkBudus(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const eiliu = atsitiktinis(3, 8)
  const kiekvienoje = atsitiktinis(4, 9)
  const sand = eiliu * kiekvienoje
  if (sand > maks) return null

  return variacija([
    // 1. Daugyba ir pakartotinė sudėtis
    () =>
      uzdavinys('uzdavinys-budais', {
        klausimas: `Klasėje ${eiliu} eilės po ${kiekvienoje} suolus. Kiek suolų iš viso? Patikrink abiem būdais: daugyba ir pakartotine sudėtimi.`,
        atsakymas: String(sand),
        atsakymasRodymui: `$${sand}$`,
        sprendimas: `Daugyba: $${eiliu} \\cdot ${kiekvienoje} = ${sand}$. Sudėtimi: $${Array(eiliu)
          .fill(kiekvienoje)
          .join(' + ')} = ${sand}$.`,
      }),

    // 2. Iš juostinės schemos
    () => {
      const dalis = atsitiktinis(5, 12)
      const daliu = atsitiktinis(3, 4)
      if (dalis * daliu > maks) return null
      return uzdavinys('uzdavinys-budais', {
        klausimas: 'Kokį skaičių žymi klaustukas schemoje?',
        atsakymas: String(dalis * 2),
        atsakymasRodymui: `$${dalis * 2}$`,
        sprendimas: `Abi apatinės dalys po ${dalis}: $${dalis} + ${dalis} = ${dalis * 2}$.`,
        brezinys: juostineSchema(null, dalis, dalis),
      })
    },

    // 3. Dalyba ir schema
    () =>
      uzdavinys('uzdavinys-budais', {
        klausimas: `${sand} saldainiai išdalyti po lygiai ${eiliu} vaikams. Kiek gaus vienas? Sprendimą patikrink daugyba.`,
        atsakymas: String(kiekvienoje),
        atsakymasRodymui: `$${kiekvienoje}$`,
        sprendimas: `$${sand} : ${eiliu} = ${kiekvienoje}$; patikrinimas: $${eiliu} \\cdot ${kiekvienoje} = ${sand}$.`,
      }),

    // 4. Du žingsniai
    () => {
      const isdalijo = atsitiktinis(4, Math.min(20, sand - 4))
      return uzdavinys('uzdavinys-budais', {
        klausimas: `Nupirkta ${eiliu} pakuotės sąsiuvinių po ${kiekvienoje}. ${isdalijo} sąsiuviniai iš karto išdalyti. Kiek liko?`,
        atsakymas: String(sand - isdalijo),
        atsakymasRodymui: `$${sand - isdalijo}$`,
        sprendimas: `Pirmas būdas: $${eiliu} \\cdot ${kiekvienoje} = ${sand}$, tada $${sand} - ${isdalijo} = ${
          sand - isdalijo
        }$.`,
      })
    },

    // 5. Kodėl galima spręsti skirtingai
    () =>
      pasirinkimoUzdavinys(naujasId('uzdavinys-budais'), 'uzdavinys-budais', {
        klausimas: 'Kodėl tą patį uždavinį kartais galima išspręsti skirtingais būdais?',
        variantai: [
          'nes tie patys veiksmai gali būti užrašyti kitaip, o atsakymas lieka tas pats',
          'nes skirtingi būdai duoda skirtingus atsakymus',
          'nes vienas būdas visada neteisingas',
        ],
        teisingas: 0,
        sprendimas: 'Pavyzdžiui, vienodų dėmenų sumą galima užrašyti daugyba.',
      }),

    // 6. Kuris būdas patogesnis
    () =>
      pasirinkimoUzdavinys(naujasId('uzdavinys-budais'), 'uzdavinys-budais', {
        klausimas: `Kuris būdas patogesnis skaičiuojant, kiek yra ${eiliu} kartus po ${kiekvienoje}?`,
        variantai: [
          `daugyba $${eiliu} \\cdot ${kiekvienoje}$`,
          `sudėtis po vieną vienetą`,
          `atimtis nuo ${sand}`,
        ],
        teisingas: 0,
        sprendimas: 'Vienodų dėmenų sumą greičiausiai suskaičiuoja daugyba.',
      }),

    // 7. Grupių brėžinys ir du būdai
    () => {
      const g = Math.min(eiliu, 6)
      const k = Math.min(kiekvienoje, 7)
      return uzdavinys('uzdavinys-budais', {
        klausimas: 'Kiek objektų iš viso pavaizduota brėžinyje?',
        atsakymas: String(g * k),
        atsakymasRodymui: `$${g * k}$`,
        sprendimas: `Galima sudėti po ${k} ${g} kartus arba iš karto padauginti: $${g} \\cdot ${k} = ${
          g * k
        }$.`,
        brezinys: grupes(g, k),
      })
    },
  ])
}

// ── 7.13 Daugybos ir dalybos žaidimas ───────────────────────────────────────

const A_DD_ZAIDIMAS = [
  {
    klausimas: 'Žaidime 12 kortelių: pusė su daugyba, pusė su dalyba. Kiek kortelių su dalyba?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: '$12 : 2 = 6$.',
  },
] as const

export const daugybosZaidimas: Generatorius = () =>
  suBandymais(kurkDdZaidima, A_DD_ZAIDIMAS, 'daugybos-zaidimas')

/**
 * Kaip ir kitoje kūrybinėje potemėje, prašyti „sugalvok penkis klausimus“
 * neįmanoma — tokio atsakymo nepatikrinsi. Todėl skaičiuojama tai, ką kuriant
 * žaidimą iš tikrųjų reikia suskaičiuoti: korteles, taškus, ėjimus.
 */
function kurkDdZaidima(): Uzdavinys | null {
  return variacija([
    // 1. Kortelių dalijimas pusiau
    () => {
      const korteliu = atsitiktinis(4, 12) * 2
      return uzdavinys('daugybos-zaidimas', {
        klausimas: `Žaidime ${korteliu} kortelės: pusė su daugyba, pusė su dalyba. Kiek kortelių su dalyba?`,
        atsakymas: String(korteliu / 2),
        atsakymasRodymui: `$${korteliu / 2}$`,
        sprendimas: `$${korteliu} : 2 = ${korteliu / 2}$.`,
      })
    },

    // 2. Taškai už sunkumą
    () => {
      const lengvu = atsitiktinis(3, 6)
      const sunkiu = atsitiktinis(2, 5)
      const uzLengva = 2
      const uzSunkia = 5
      return uzdavinys('daugybos-zaidimas', {
        klausimas: `Už lengvą kortelę duodama ${uzLengva} taškai, už sunkią — ${uzSunkia}. Žaidėjas atsakė į ${lengvu} lengvas ir ${sunkiu} sunkias korteles. Kiek taškų surinko?`,
        atsakymas: String(lengvu * uzLengva + sunkiu * uzSunkia),
        atsakymasRodymui: `$${lengvu * uzLengva + sunkiu * uzSunkia}$`,
        sprendimas: `$${lengvu} \\cdot ${uzLengva} + ${sunkiu} \\cdot ${uzSunkia} = ${
          lengvu * uzLengva + sunkiu * uzSunkia
        }$.`,
      })
    },

    // 3. Kortelės po lygiai
    () => {
      const zaideju = atsitiktinis(3, 6)
      const korteliu = zaideju * atsitiktinis(3, 8)
      return uzdavinys('daugybos-zaidimas', {
        klausimas: `${korteliu} užduočių kortelės padalytos po lygiai ${zaideju} žaidėjams. Kiek kortelių gaus vienas?`,
        atsakymas: String(korteliu / zaideju),
        atsakymasRodymui: `$${korteliu / zaideju}$`,
        sprendimas: `$${korteliu} : ${zaideju} = ${korteliu / zaideju}$.`,
      })
    },

    // 4. Langeliai ir ėjimai
    () => {
      const langeliu = atsitiktinis(3, 6) * atsitiktinis(2, 4)
      const zingsnis = atsitiktinis(2, 4)
      if (langeliu % zingsnis !== 0) return null
      return uzdavinys('daugybos-zaidimas', {
        klausimas: `Žaidimo lentoje ${langeliu} langelių. Už teisingą atsakymą pajudama po ${zingsnis} langelius. Per kiek teisingų atsakymų pasiekiama pabaiga?`,
        atsakymas: String(langeliu / zingsnis),
        atsakymasRodymui: `$${langeliu / zingsnis}$`,
        sprendimas: `$${langeliu} : ${zingsnis} = ${langeliu / zingsnis}$.`,
      })
    },

    // 5. Kortelių rūšys
    () => {
      const daugybos = atsitiktinis(3, 8)
      const dalybos = atsitiktinis(3, 8)
      const liekanos = atsitiktinis(1, 4)
      const viso = daugybos + dalybos + liekanos
      return uzdavinys('daugybos-zaidimas', {
        klausimas: `Paruošta ${daugybos} daugybos, ${dalybos} dalybos ir ${liekanos} dalybos su liekana kortelės. Kiek iš viso kortelių?`,
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `$${daugybos} + ${dalybos} + ${liekanos} = ${viso}$.`,
      })
    },

    // 6. Kada žaidimas tinkamo sunkumo
    () =>
      pasirinkimoUzdavinys(naujasId('daugybos-zaidimas'), 'daugybos-zaidimas', {
        klausimas: 'Kada daugybos žaidimas yra tinkamo sunkumo trečiokui?',
        variantai: [
          'kai užduotys neperžengia daugybos lentelės ir skaičių iki 10 000',
          'kai visos užduotys su neigiamais skaičiais',
          'kai visos užduotys vienodos',
        ],
        teisingas: 0,
        sprendimas: 'Tinkamos yra tos užduotys, kurias mokinys jau mokėsi.',
      }),

    // 7. Kiek kortelių kiekvienam turui
    () => {
      const turu = atsitiktinis(3, 6)
      const perTura = atsitiktinis(3, 8)
      return uzdavinys('daugybos-zaidimas', {
        klausimas: `Žaidime ${turu} turai, kiekviename traukiama po ${perTura} korteles. Kiek kortelių reikia iš viso?`,
        atsakymas: String(turu * perTura),
        atsakymasRodymui: `$${turu * perTura}$`,
        sprendimas: `$${turu} \\cdot ${perTura} = ${turu * perTura}$.`,
      })
    },
  ])
}
