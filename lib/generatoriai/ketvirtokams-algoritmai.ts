import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { kiek } from './ketvirtokams-bendra'
import { blokuSchema } from './ketvirtokams-duomenu-vaizdai'
import { programosLangas } from './ketvirtokams-vaizdai'
import { algoritmoTinklelis, vezliukoKelias } from './treciokams-algebros-vaizdai'
import { type Figura, figuruSeka } from './treciokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 4 klasės tema „Dėsningumai, algoritmai ir programavimas“ — dvylika potemių.
 *
 * Anksčiau jos rėmėsi `sekos`, `ornamentai`, `algoritmai` ir `logika`
 * generatoriais: sekose pasitaikydavo geometrinių progresijų, o algoritmuose —
 * kintamųjų su neigiamomis reikšmėmis.
 *
 * Pirmosios keturios potemės yra apie sekas, kitos keturios — apie komandas ir
 * kartojimą, paskutinės keturios — apie algoritmą kaip visumą: skaidymą,
 * sudarymą, tikrinimą ir kelis būdus tam pačiam rezultatui.
 */

const KOMANDOS = { vns: 'komandą', dgs: 'komandas', kilm: 'komandų' }

/** Dešimtosios dalys → „1{,}5“. */
function des(desimtosios: number): string {
  return `${Math.floor(desimtosios / 10)}{,}${desimtosios % 10}`
}

// ── 13.1 Seka iš trupmenų ───────────────────────────────────────────────────

const T1 = 'trupmenu-seka'

const A_TRUPMENU_SEKA = [
  {
    klausimas: 'Pratęsk seką: $\\dfrac{1}{8}$, $\\dfrac{2}{8}$, $\\dfrac{3}{8}$, …',
    atsakymas: '4/8',
    atsakymasRodymui: '$\\dfrac{4}{8}$',
    sprendimas: 'Skaitiklis kaskart didėja vienetu.',
  },
] as const

export const trupmenuSeka: Generatorius = () => suBandymais(kurkTrupmenuSeka, A_TRUPMENU_SEKA, T1)

function tr(sk: number, vd: number): string {
  return `\\dfrac{${sk}}{${vd}}`
}

function kurkTrupmenuSeka(): Uzdavinys | null {
  const vardiklis = pasirink([6, 8, 10, 12])
  const zingsnis = pasirink([1, 2])
  const pradzia = atsitiktinis(1, 2)

  return variacija([
    // 1. Kitas narys
    () => {
      const nariai = [0, 1, 2].map((i) => pradzia + i * zingsnis)
      const kitas = pradzia + 3 * zingsnis
      if (kitas >= vardiklis) return null
      return uzdavinys(T1, {
        klausimas: `Pratęsk seką: $${nariai.map((n) => tr(n, vardiklis)).join('$, $')}$, … Koks kitas narys?`,
        atsakymas: `${kitas}/${vardiklis}`,
        atsakymasRodymui: `$${tr(kitas, vardiklis)}$`,
        sprendimas: `Vardiklis nesikeičia, o skaitiklis kaskart didėja ${zingsnis}.`,
      })
    },

    // 2. Sekos taisyklė
    () => {
      const nariai = [0, 1, 2, 3].map((i) => pradzia + i * zingsnis)
      if (nariai[3] >= vardiklis) return null
      return uzdavinys(T1, {
        klausimas: `Kiek kaskart didėja sekos $${nariai.map((n) => tr(n, vardiklis)).join('$, $')}$ skaitiklis?`,
        atsakymas: String(zingsnis),
        atsakymasRodymui: `$${zingsnis}$`,
        sprendimas: `Gretimų narių skaitikliai skiriasi ${zingsnis}.`,
      })
    },

    // 3. Trūkstamas narys
    () => {
      const nariai = [0, 1, 2, 3].map((i) => pradzia + i * zingsnis)
      if (nariai[3] >= vardiklis) return null
      return uzdavinys(T1, {
        klausimas: `Koks narys turi būti vietoj klaustuko: $${tr(nariai[0], vardiklis)}$, $${tr(nariai[1], vardiklis)}$, $?$, $${tr(nariai[3], vardiklis)}$?`,
        atsakymas: `${nariai[2]}/${vardiklis}`,
        atsakymasRodymui: `$${tr(nariai[2], vardiklis)}$`,
        sprendimas: `Skaitiklis didėja ${zingsnis}, tad trūksta $${tr(nariai[2], vardiklis)}$.`,
      })
    },

    // 4. Kada seka pasiekia vienetą
    () => {
      if (vardiklis % zingsnis !== 0 || pradzia !== zingsnis) return null
      return uzdavinys(T1, {
        klausimas: `Seka prasideda $${tr(zingsnis, vardiklis)}$ ir kaskart didėja $${tr(zingsnis, vardiklis)}$. Kelintas narys bus lygus vienetui?`,
        atsakymas: String(vardiklis / zingsnis),
        atsakymasRodymui: `$${vardiklis / zingsnis}$-asis`,
        sprendimas: `Vienetas yra $${tr(vardiklis, vardiklis)}$, tad $${vardiklis} : ${zingsnis} = ${vardiklis / zingsnis}$.`,
      })
    },

    // 5. Mažėjanti seka
    () => {
      const nuo = vardiklis - 1
      const nariai = [0, 1, 2].map((i) => nuo - i * zingsnis)
      if (nuo - 3 * zingsnis < 1) return null
      return uzdavinys(T1, {
        klausimas: `Pratęsk seką: $${nariai.map((n) => tr(n, vardiklis)).join('$, $')}$, … Koks kitas narys?`,
        atsakymas: `${nuo - 3 * zingsnis}/${vardiklis}`,
        atsakymasRodymui: `$${tr(nuo - 3 * zingsnis, vardiklis)}$`,
        sprendimas: `Skaitiklis kaskart mažėja ${zingsnis}.`,
      })
    },

    // 6. Klaidos radimas
    () => {
      const nariai = [0, 1, 2, 3].map((i) => pradzia + i * zingsnis)
      if (nariai[3] >= vardiklis) return null
      const sugadinti = [...nariai]
      sugadinti[2] += 1
      if (sugadinti[2] >= vardiklis) return null
      return uzdavinys(T1, {
        klausimas: `Vienas sekos narys neteisingas: $${sugadinti.map((n) => tr(n, vardiklis)).join('$, $')}$. Koks narys turi būti jo vietoje?`,
        atsakymas: `${nariai[2]}/${vardiklis}`,
        atsakymasRodymui: `$${tr(nariai[2], vardiklis)}$`,
        sprendimas: `Skaitiklis turi didėti ${zingsnis}, tad trečias narys yra $${tr(nariai[2], vardiklis)}$.`,
      })
    },

    // 7. Kelintas narys
    () => {
      const kelintas = atsitiktinis(4, 6)
      const narys = pradzia + (kelintas - 1) * zingsnis
      if (narys >= vardiklis) return null
      return uzdavinys(T1, {
        klausimas: `Seka prasideda $${tr(pradzia, vardiklis)}$, o skaitiklis kaskart didėja ${zingsnis}. Koks bus ${kelintas}-asis narys?`,
        atsakymas: `${narys}/${vardiklis}`,
        atsakymasRodymui: `$${tr(narys, vardiklis)}$`,
        sprendimas: `$${pradzia} + ${kelintas - 1} \\cdot ${zingsnis} = ${narys}$.`,
      })
    },
  ])
}

// ── 13.2 Seka iš dešimtainių skaičių ────────────────────────────────────────

const T2 = 'desimtainiu-seka-4'

const A_DES_SEKA = [
  {
    klausimas: 'Pratęsk seką: $1{,}2$; $1{,}5$; $1{,}8$; …',
    atsakymas: '2.1',
    atsakymasRodymui: '$2{,}1$',
    sprendimas: 'Kaskart pridedama 0,3.',
  },
] as const

export const desimtainiuSeka4: Generatorius = () => suBandymais(kurkDesSeka, A_DES_SEKA, T2)

function kurkDesSeka(): Uzdavinys | null {
  const pradzia = atsitiktinis(6, 40)
  const zingsnis = atsitiktinis(2, 9)

  return variacija([
    // 1. Kitas narys
    () => {
      const nariai = [0, 1, 2].map((i) => pradzia + i * zingsnis)
      return uzdavinys(T2, {
        klausimas: `Pratęsk seką: $${nariai.map(des).join('$; $')}$; … Koks kitas narys?`,
        atsakymas: String((pradzia + 3 * zingsnis) / 10),
        atsakymasRodymui: `$${des(pradzia + 3 * zingsnis)}$`,
        sprendimas: `Kaskart pridedama $${des(zingsnis)}$.`,
      })
    },

    // 2. Taisyklė
    () => {
      const nariai = [0, 1, 2, 3].map((i) => pradzia + i * zingsnis)
      return uzdavinys(T2, {
        klausimas: `Kiek kaskart pridedama sekoje $${nariai.map(des).join('$; $')}$?`,
        atsakymas: String(zingsnis / 10),
        atsakymasRodymui: `$${des(zingsnis)}$`,
        sprendimas: `Gretimų narių skirtumas yra $${des(zingsnis)}$.`,
      })
    },

    // 3. Mažėjanti
    () => {
      const nuo = pradzia + 4 * zingsnis
      const nariai = [0, 1, 2].map((i) => nuo - i * zingsnis)
      if (nuo - 3 * zingsnis <= 0) return null
      return uzdavinys(T2, {
        klausimas: `Pratęsk mažėjančią seką: $${nariai.map(des).join('$; $')}$; … Koks kitas narys?`,
        atsakymas: String((nuo - 3 * zingsnis) / 10),
        atsakymasRodymui: `$${des(nuo - 3 * zingsnis)}$`,
        sprendimas: `Kaskart atimama $${des(zingsnis)}$.`,
      })
    },

    // 4. Trūkstamas narys
    () => {
      const nariai = [0, 1, 2, 3].map((i) => pradzia + i * zingsnis)
      return uzdavinys(T2, {
        klausimas: `Koks narys turi būti vietoj klaustuko: $${des(nariai[0])}$; $${des(nariai[1])}$; $?$; $${des(nariai[3])}$?`,
        atsakymas: String(nariai[2] / 10),
        atsakymasRodymui: `$${des(nariai[2])}$`,
        sprendimas: `Žingsnis $${des(zingsnis)}$, tad trūkstamas narys $${des(nariai[2])}$.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const nariai = [0, 1, 2, 3, 4].map((i) => pradzia + i * zingsnis)
      const sugadinti = [...nariai]
      sugadinti[3] += 2
      return uzdavinys(T2, {
        klausimas: `Vienas sekos narys neteisingas: $${sugadinti.map(des).join('$; $')}$. Koks skaičius turi būti jo vietoje?`,
        atsakymas: String(nariai[3] / 10),
        atsakymasRodymui: `$${des(nariai[3])}$`,
        sprendimas: `Žingsnis yra $${des(zingsnis)}$, tad ketvirtas narys turi būti $${des(nariai[3])}$.`,
      })
    },

    // 6. Kelintas narys
    () => {
      const kelintas = atsitiktinis(5, 8)
      const narys = pradzia + (kelintas - 1) * zingsnis
      return uzdavinys(T2, {
        klausimas: `Seka prasideda $${des(pradzia)}$, kaskart pridedama $${des(zingsnis)}$. Koks bus ${kelintas}-asis narys?`,
        atsakymas: String(narys / 10),
        atsakymasRodymui: `$${des(narys)}$`,
        sprendimas: `Pridedama ${kelintas - 1} kartus: $${des(narys)}$.`,
      })
    },

    // 7. Dvi sekos
    () => {
      const zingsnis2 = atsitiktinis(2, 9)
      if (zingsnis === zingsnis2) return null
      const a = [0, 1, 2].map((i) => pradzia + i * zingsnis)
      const b = [0, 1, 2].map((i) => pradzia + i * zingsnis2)
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kuri seka auga greičiau: A — $${a.map(des).join('$; $')}$ ar B — $${b.map(des).join('$; $')}$?`,
        variantai: zingsnis > zingsnis2 ? ['A', 'B', 'abi vienodai'] : ['B', 'A', 'abi vienodai'],
        teisingas: 0,
        sprendimas: `A žingsnis $${des(zingsnis)}$, B žingsnis $${des(zingsnis2)}$.`,
      })
    },
  ])
}

// ── 13.3 Didėjančių ar mažėjančių objektų seka ──────────────────────────────

const T3 = 'objektu-augimo-seka'

const A_AUGIMAS = [
  {
    klausimas: 'Figūrų seka: 2, 4, 6 kvadratėliai. Kiek jų bus penktoje figūroje?',
    atsakymas: '10',
    atsakymasRodymui: '$10$',
    sprendimas: 'Kaskart pridedama po 2.',
  },
] as const

export const objektuAugimoSeka: Generatorius = () => suBandymais(kurkAugima, A_AUGIMAS, T3)

const SEKOS_FIGUROS: readonly Figura[] = ['trikampis', 'kvadratas', 'apskritimas']

function kurkAugima(): Uzdavinys | null {
  const pradzia = atsitiktinis(2, 5)
  const zingsnis = atsitiktinis(2, 4)

  return variacija([
    // 1. Kelinta figūra
    () => {
      const kelinta = atsitiktinis(5, 9)
      return uzdavinys(T3, {
        klausimas: `Figūrų sekoje pirmoje figūroje ${pradzia} kvadratėliai, antroje ${pradzia + zingsnis}, trečioje ${pradzia + 2 * zingsnis}. Kiek kvadratėlių turės ${kelinta}-oji figūra?`,
        atsakymas: String(pradzia + (kelinta - 1) * zingsnis),
        atsakymasRodymui: `$${pradzia + (kelinta - 1) * zingsnis}$`,
        sprendimas: `Kaskart pridedama ${zingsnis}: $${pradzia} + ${kelinta - 1} \\cdot ${zingsnis} = ${pradzia + (kelinta - 1) * zingsnis}$.`,
      })
    },

    // 2. Kiek pridedama
    () =>
      uzdavinys(T3, {
        klausimas: `Sekos figūrose kvadratėlių: ${pradzia}, ${pradzia + zingsnis}, ${pradzia + 2 * zingsnis}, ${pradzia + 3 * zingsnis}. Kiek pridedama kaskart?`,
        atsakymas: String(zingsnis),
        atsakymasRodymui: `$${zingsnis}$`,
        sprendimas: `Gretimų figūrų skirtumas: $${pradzia + zingsnis} - ${pradzia} = ${zingsnis}$.`,
      }),

    // 3. Mažėjanti seka
    () => {
      const nuo = pradzia + 5 * zingsnis
      if (nuo - 3 * zingsnis <= 0) return null
      return uzdavinys(T3, {
        klausimas: `Sekos figūrose kvadratėlių vis mažiau: ${nuo}, ${nuo - zingsnis}, ${nuo - 2 * zingsnis}. Kiek jų bus ketvirtoje figūroje?`,
        atsakymas: String(nuo - 3 * zingsnis),
        atsakymasRodymui: `$${nuo - 3 * zingsnis}$`,
        sprendimas: `Kaskart atimama ${zingsnis}.`,
      })
    },

    // 4. Kuri seka auga greičiau
    () => {
      const zingsnis2 = zingsnis + atsitiktinis(1, 3)
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Seka A auga po ${zingsnis} kvadratėlius, seka B — po ${zingsnis2}. Kurioje sekoje šeštoji figūra didesnė, jei abi prasideda nuo ${pradzia}?`,
        variantai: ['B', 'A', 'figūros vienodo dydžio'],
        teisingas: 0,
        sprendimas: `A: $${pradzia} + 5 \\cdot ${zingsnis} = ${pradzia + 5 * zingsnis}$; B: $${pradzia} + 5 \\cdot ${zingsnis2} = ${pradzia + 5 * zingsnis2}$.`,
      })
    },

    // 5. Kelinta figūra turės nurodytą kiekį
    () => {
      const kelinta = atsitiktinis(4, 8)
      const kiekis = pradzia + (kelinta - 1) * zingsnis
      return uzdavinys(T3, {
        klausimas: `Seka prasideda ${pradzia} kvadratėliais ir auga po ${zingsnis}. Kelinta figūra turės ${kiekis} kvadratėlius?`,
        atsakymas: String(kelinta),
        atsakymasRodymui: `$${kelinta}$-oji`,
        sprendimas: `$(${kiekis} - ${pradzia}) : ${zingsnis} = ${kelinta - 1}$, tad tai ${kelinta}-oji figūra.`,
      })
    },

    // 6. Besikartojanti figūrų seka
    () => {
      const grupe = sumaisyk([...SEKOS_FIGUROS]).slice(0, 2)
      const nariai: Figura[] = []
      for (let i = 0; i < 6; i += 1) nariai.push(grupe[i % grupe.length])
      const vardai: Record<string, string> = {
        trikampis: 'trikampis',
        kvadratas: 'kvadratas',
        apskritimas: 'apskritimas',
      }
      const variantai = sumaisyk([...SEKOS_FIGUROS])
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kokia figūra turi būti klaustuko vietoje?',
        variantai: variantai.map((f) => vardai[f]),
        teisingas: variantai.indexOf(nariai[4]),
        sprendimas: 'Kartojasi dviejų figūrų grupė.',
        brezinys: figuruSeka(nariai.slice(0, 4), 1),
      })
    },

    // 7. Iš viso kvadratėlių
    () => {
      const figuru = atsitiktinis(3, 5)
      const viso = Array.from({ length: figuru }, (_, i) => pradzia + i * zingsnis).reduce(
        (s, x) => s + x,
        0,
      )
      return uzdavinys(T3, {
        klausimas: `Kiek iš viso kvadratėlių reikės pirmoms ${figuru} sekos figūroms, jei pirmoje jų ${pradzia}, o kaskart pridedama po ${zingsnis}?`,
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `${Array.from({ length: figuru }, (_, i) => pradzia + i * zingsnis).join(' + ')} = ${viso}.`,
      })
    },
  ])
}

// ── 13.4 Sekos kūrimas pagal taisyklę ───────────────────────────────────────

const T4 = 'sekos-kurimas'

const A_KURIMAS = [
  {
    klausimas: 'Seka prasideda 5, kaskart pridedama 7. Koks trečias narys?',
    atsakymas: '19',
    atsakymasRodymui: '$19$',
    sprendimas: '$5 + 7 + 7 = 19$.',
  },
] as const

export const sekosKurimas: Generatorius = () => suBandymais(kurkSekosKurima, A_KURIMAS, T4)

function kurkSekosKurima(): Uzdavinys | null {
  const pradzia = atsitiktinis(3, 60)
  const zingsnis = atsitiktinis(3, 25)

  return variacija([
    // 1. Nurodytas narys
    () => {
      const kelintas = atsitiktinis(3, 8)
      return uzdavinys(T4, {
        klausimas: `Seka prasideda ${pradzia}, o kaskart pridedama ${zingsnis}. Koks bus ${kelintas}-asis narys?`,
        atsakymas: String(pradzia + (kelintas - 1) * zingsnis),
        atsakymasRodymui: `$${pradzia + (kelintas - 1) * zingsnis}$`,
        sprendimas: `$${pradzia} + ${kelintas - 1} \\cdot ${zingsnis} = ${pradzia + (kelintas - 1) * zingsnis}$.`,
      })
    },

    // 2. Mažėjanti seka
    () => {
      const nuo = pradzia + 6 * zingsnis
      return uzdavinys(T4, {
        klausimas: `Seka prasideda ${nuo}, o kaskart atimama ${zingsnis}. Koks bus ketvirtas narys?`,
        atsakymas: String(nuo - 3 * zingsnis),
        atsakymasRodymui: `$${nuo - 3 * zingsnis}$`,
        sprendimas: `$${nuo} - 3 \\cdot ${zingsnis} = ${nuo - 3 * zingsnis}$.`,
      })
    },

    // 3. Daugybos taisyklė
    () => {
      const kartai = pasirink([2, 3])
      const nuo = atsitiktinis(2, 9)
      const kelintas = atsitiktinis(3, 5)
      const narys = nuo * kartai ** (kelintas - 1)
      if (narys > 10000) return null
      return uzdavinys(T4, {
        klausimas: `Seka prasideda ${nuo}, o kiekvienas kitas narys ${kartai} kartus didesnis. Koks bus ${kelintas}-asis narys?`,
        atsakymas: String(narys),
        atsakymasRodymui: `$${narys}$`,
        sprendimas: `${Array.from({ length: kelintas }, (_, i) => nuo * kartai ** i).join(', ')}.`,
      })
    },

    // 4. Kiek narių iki ribos
    () => {
      const riba = pradzia + zingsnis * atsitiktinis(4, 9)
      return uzdavinys(T4, {
        klausimas: `Seka prasideda ${pradzia} ir auga po ${zingsnis}. Kelintas narys bus lygus ${riba}?`,
        atsakymas: String((riba - pradzia) / zingsnis + 1),
        atsakymasRodymui: `$${(riba - pradzia) / zingsnis + 1}$-asis`,
        sprendimas: `$(${riba} - ${pradzia}) : ${zingsnis} = ${(riba - pradzia) / zingsnis}$ žingsniai, tad tai ${(riba - pradzia) / zingsnis + 1}-asis narys.`,
      })
    },

    // 5. Taisyklė iš narių
    () => {
      const nariai = [0, 1, 2, 3].map((i) => pradzia + i * zingsnis)
      return uzdavinys(T4, {
        klausimas: `Nustatyk sekos ${nariai.join(', ')} taisyklę. Kiek pridedama kaskart?`,
        atsakymas: String(zingsnis),
        atsakymasRodymui: `$${zingsnis}$`,
        sprendimas: `$${nariai[1]} - ${nariai[0]} = ${zingsnis}$.`,
      })
    },

    // 6. Kuri seka atitinka taisyklę
    () => {
      const teisinga = [0, 1, 2].map((i) => pradzia + i * zingsnis).join(', ')
      const klaidinga1 = [0, 1, 2].map((i) => pradzia + i * (zingsnis + 2)).join(', ')
      const klaidinga2 = [0, 1, 2].map((i) => pradzia + i * zingsnis + i * i).join(', ')
      const variantai = sumaisyk([teisinga, klaidinga1, klaidinga2])
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kuri seka sudaryta pagal taisyklę „pradėk nuo ${pradzia} ir kaskart pridėk ${zingsnis}“?`,
        variantai,
        teisingas: variantai.indexOf(teisinga),
        sprendimas: `Teisinga seka: ${teisinga}.`,
      })
    },

    // 7. Sekos suma
    () => {
      const nariu = atsitiktinis(3, 5)
      const viso = Array.from({ length: nariu }, (_, i) => pradzia + i * zingsnis).reduce(
        (s, x) => s + x,
        0,
      )
      return uzdavinys(T4, {
        klausimas: `Kokia yra pirmų ${nariu} sekos narių suma, jei seka prasideda ${pradzia} ir auga po ${zingsnis}?`,
        atsakymas: String(viso),
        atsakymasRodymui: `$${viso}$`,
        sprendimas: `${Array.from({ length: nariu }, (_, i) => pradzia + i * zingsnis).join(' + ')} = ${viso}.`,
      })
    },
  ])
}

// ── 13.5 Kartojimo komanda ──────────────────────────────────────────────────

const T5 = 'kartojimo-komanda'

const A_KARTOJIMAS = [
  {
    klausimas: 'Ką daro kartojimo komanda?',
    atsakymas: 'a',
    atsakymasRodymui: 'kelis kartus pakartoja tas pačias komandas',
    sprendimas: 'Ji leidžia nerašyti to paties kelis kartus.',
  },
] as const

export const kartojimoKomanda: Generatorius = () => suBandymais(kurkKartojima, A_KARTOJIMAS, T5)

function kurkKartojima(): Uzdavinys | null {
  const kartai = atsitiktinis(3, 9)
  const komandu = atsitiktinis(2, 4)

  return variacija([
    // 1. Ką daro kartojimo komanda
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Ką daro kartojimo komanda?',
        variantai: [
          'kelis kartus pakartoja tas pačias komandas',
          'atlieka komandas atvirkštine tvarka',
          'sustabdo programą',
          'pakeičia komandas kitomis',
        ],
        teisingas: 0,
        sprendimas: 'Kartojimo komanda leidžia to paties nerašyti kelis kartus.',
        brezinys: programosLangas([`kartok ${kartai} kartus`, '  žingsnis pirmyn', 'pabaiga']),
      }),

    // 2. Kiek komandų atliekama
    () =>
      uzdavinys(T5, {
        klausimas: `Kiek iš viso komandų bus atlikta, jei ${komandu} komandos kartojamos ${kartai} kartus?`,
        atsakymas: String(komandu * kartai),
        atsakymasRodymui: `$${komandu * kartai}$`,
        sprendimas: `$${komandu} \\cdot ${kartai} = ${komandu * kartai}$.`,
        brezinys: programosLangas([
          `kartok ${kartai} kartus`,
          ...Array.from({ length: komandu }, (_, i) => `  ${i + 1}-a komanda`),
          'pabaiga',
        ]),
      }),

    // 3. Kodėl patogu
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kodėl patogu vartoti kartojimo komandą?',
        variantai: [
          'programa tampa trumpesnė ir aiškesnė',
          'programa veikia greičiau',
          'kompiuteris mažiau kaista',
          'komandų reikia daugiau',
        ],
        teisingas: 0,
        sprendimas: `Vietoj ${komandu * kartai} eilučių pakanka ${komandu + 2}.`,
      }),

    // 4. Kiek kartų kartoti
    () => {
      const viso = komandu * kartai
      return uzdavinys(T5, {
        klausimas: `Norima atlikti ${viso} komandas, kartojant ${komandu} komandų grupę. Kiek kartų reikia kartoti?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: `$${viso} : ${komandu} = ${kartai}$.`,
      })
    },

    // 5. Vėžliuko kelias
    () =>
      uzdavinys(T5, {
        klausimas:
          'Vėžliukas kartoja komandas „eik pirmyn“ ir „pasuk stačiuoju kampu“, kol grįžta į pradžią. Kiek kartų buvo pakartota ši komandų pora?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'Kiekvienas kartojimas nubrėžia po vieną kraštinę, o nubrėžtas kvadratas jų turi keturias.',
        brezinys: vezliukoKelias([
          { dx: 3, dy: 0 },
          { dx: 0, dy: 3 },
          { dx: -3, dy: 0 },
          { dx: 0, dy: -3 },
        ]),
      }),

    // 6. Kartojimas be kartojimo komandos
    () =>
      uzdavinys(T5, {
        klausimas: `Kiek eilučių reikėtų parašyti be kartojimo komandos, jei ${komandu} komandos kartojamos ${kartai} kartus?`,
        atsakymas: String(komandu * kartai),
        atsakymasRodymui: `$${komandu * kartai}$`,
        sprendimas: `Kiekviena komanda būtų perrašyta ${kartai} kartus: $${komandu} \\cdot ${kartai} = ${komandu * kartai}$.`,
      }),

    // 7. Kas rašoma kartojimo viduje
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kurios komandos rašomos kartojimo komandos viduje?',
        variantai: [
          'tos, kurias reikia atlikti kiekvieną kartą',
          'tos, kurias reikia atlikti tik vieną kartą',
          'visos programos komandos',
          'tik paskutinė komanda',
        ],
        teisingas: 0,
        sprendimas: 'Viduje esančios komandos kartojamos, o esančios už jos — atliekamos vieną kartą.',
        brezinys: programosLangas([
          'pradžia',
          `kartok ${kartai} kartus`,
          '  žingsnis pirmyn',
          'pabaiga',
          'sustok',
        ]),
      }),
  ])
}

// ── 13.6 Komandų seka su kartojimu ──────────────────────────────────────────

const T6 = 'komandos-su-kartojimu'

const A_SU_KARTOJIMU = [
  {
    klausimas: 'Programa kartoja „žingsnis pirmyn“ 6 kartus. Per kiek langelių pajudės objektas?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: 'Kiekvienas kartojimas — vienas žingsnis.',
  },
] as const

export const komandosSuKartojimu: Generatorius = () =>
  suBandymais(kurkSuKartojimu, A_SU_KARTOJIMU, T6)

function kurkSuKartojimu(): Uzdavinys | null {
  const kartai = atsitiktinis(3, 8)
  const zingsniu = atsitiktinis(1, 3)

  return variacija([
    // 1. Per kiek langelių pajudės
    () =>
      uzdavinys(T6, {
        klausimas: 'Per kiek langelių pajudės objektas, įvykdžius šią programą?',
        atsakymas: String(kartai * zingsniu),
        atsakymasRodymui: `$${kartai * zingsniu}$`,
        sprendimas: `$${zingsniu} \\cdot ${kartai} = ${kartai * zingsniu}$.`,
        brezinys: programosLangas([`kartok ${kartai} kartus`, `  eik ${zingsniu} langelius`, 'pabaiga']),
      }),

    // 2. Skaičiaus didinimas cikle
    () => {
      const pradzia = atsitiktinis(2, 12)
      const priedas = atsitiktinis(2, 9)
      return uzdavinys(T6, {
        klausimas: 'Koks skaičius bus išvestas paskutinis?',
        atsakymas: String(pradzia + (kartai - 1) * priedas),
        atsakymasRodymui: `$${pradzia + (kartai - 1) * priedas}$`,
        sprendimas: `Pirmas išvedamas ${pradzia}, paskui kaskart ${priedas} daugiau; po ${kartai - 1} pridėjimų gaunama $${pradzia + (kartai - 1) * priedas}$.`,
        brezinys: programosLangas([
          `skaicius = ${pradzia}`,
          `kartok ${kartai} kartus`,
          '  spausdink skaicius',
          `  skaicius = skaicius + ${priedas}`,
          'pabaiga',
        ]),
      })
    },

    // 3. Kiek kartų pakartota
    () => {
      const viso = kartai * zingsniu
      return uzdavinys(T6, {
        klausimas: `Objektas pajudėjo ${viso} langelius, o kiekviename kartojime jis eina po ${zingsniu}. Kiek kartų buvo pakartota komanda?`,
        atsakymas: String(kartai),
        atsakymasRodymui: `$${kartai}$`,
        sprendimas: `$${viso} : ${zingsniu} = ${kartai}$.`,
      })
    },

    // 4. Du ciklai iš eilės
    () => {
      const kartai2 = atsitiktinis(2, 6)
      return uzdavinys(T6, {
        klausimas: `Programoje pirmas ciklas kartojamas ${kartai} kartus, antras — ${kartai2}. Kiek iš viso žingsnių bus atlikta, jei kiekviename kartojime daromas vienas žingsnis?`,
        atsakymas: String(kartai + kartai2),
        atsakymasRodymui: `$${kartai + kartai2}$`,
        sprendimas: `$${kartai} + ${kartai2} = ${kartai + kartai2}$.`,
      })
    },

    // 5. Vėžliuko figūra
    () =>
      uzdavinys(T6, {
        klausimas: 'Kiek kraštinių turi vėžliuko nubrėžta figūra?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'Kartojant „eik pirmyn“ ir „pasuk stačiuoju kampu“ keturis kartus gaunamas kvadratas.',
        brezinys: vezliukoKelias([
          { dx: 3, dy: 0 },
          { dx: 0, dy: 3 },
          { dx: -3, dy: 0 },
          { dx: 0, dy: -3 },
        ]),
      }),

    // 6. Klaida cikle
    () => {
      const norima = atsitiktinis(4, 9)
      const parasyta = norima + pasirink([-2, -1, 1, 2])
      if (parasyta < 2) return null
      return uzdavinys(T6, {
        klausimas: `Objektas turi pajudėti ${norima} langelius po vieną, bet programa jį perkelia kitur. Koks skaičius turi būti pirmoje eilutėje?`,
        atsakymas: String(norima),
        atsakymasRodymui: `$${norima}$`,
        sprendimas: `Kartojimų skaičius ir yra žingsnių skaičius, tad vietoj ${parasyta} reikia ${norima}.`,
        brezinys: programosLangas([`kartok ${parasyta} kartus`, '  eik 1 langelį', 'pabaiga'], 1),
      })
    },

    // 7. Komandų eiliškumas
    () =>
      eiliskumoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Surikiuok programos eilutes teisinga tvarka.',
        teisingaEile: ['pradžia', 'kartok 4 kartus', '  eik pirmyn', 'pabaiga', 'sustok'],
        sprendimas: 'Kartojimo komanda atidaroma prieš kartojamas komandas ir uždaroma po jų.',
      }),
  ])
}

// ── 13.7 Pasirinkimo ir kartojimo komandos kartu ────────────────────────────

const T7 = 'pasirinkimas-ir-kartojimas'

const A_PASIRINKIMAS = [
  {
    klausimas: 'Ką daro pasirinkimo komanda?',
    atsakymas: 'a',
    atsakymasRodymui: 'atlieka veiksmą tik tada, kai sąlyga teisinga',
    sprendimas: 'Jei sąlyga neteisinga, veiksmas praleidžiamas.',
  },
] as const

export const pasirinkimasIrKartojimas: Generatorius = () =>
  suBandymais(kurkPasirinkima, A_PASIRINKIMAS, T7)

function kurkPasirinkima(): Uzdavinys | null {
  const viso = atsitiktinis(8, 20)
  const riba = atsitiktinis(3, viso - 3)

  return variacija([
    // 1. Ką daro pasirinkimo komanda
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ką daro pasirinkimo komanda „jeigu …“?',
        variantai: [
          'atlieka veiksmą tik tada, kai sąlyga teisinga',
          'atlieka veiksmą visada',
          'kartoja veiksmą kelis kartus',
          'sustabdo programą',
        ],
        teisingas: 0,
        sprendimas: 'Kai sąlyga neteisinga, veiksmas praleidžiamas.',
      }),

    // 2. Kiek kartų sąlyga teisinga
    () =>
      uzdavinys(T7, {
        klausimas: `Programa peržiūri skaičius nuo 1 iki ${viso} ir įrašo tik didesnius už ${riba}. Kiek skaičių bus įrašyta?`,
        atsakymas: String(viso - riba),
        atsakymasRodymui: `$${viso - riba}$`,
        sprendimas: `Tinka skaičiai nuo ${riba + 1} iki ${viso}: $${viso} - ${riba} = ${viso - riba}$.`,
        brezinys: programosLangas([
          `kartok su kiekvienu skaičiumi nuo 1 iki ${viso}`,
          `  jeigu skaičius > ${riba}`,
          '    įrašyk į sąrašą',
          'pabaiga',
        ]),
      }),

    // 3. Kiek praleista
    () =>
      uzdavinys(T7, {
        klausimas: `Programa peržiūri ${viso} skaičių ir įrašo tik didesnius už ${riba}. Kiek skaičių bus praleista?`,
        atsakymas: String(riba),
        atsakymasRodymui: `$${riba}$`,
        sprendimas: `Praleidžiami skaičiai nuo 1 iki ${riba} — jų ${riba}.`,
      }),

    // 4. Lyginiai skaičiai
    () => {
      const n = pasirink([10, 12, 16, 20])
      return uzdavinys(T7, {
        klausimas: `Programa peržiūri skaičius nuo 1 iki ${n} ir įrašo tik lyginius. Kiek skaičių bus įrašyta?`,
        atsakymas: String(n / 2),
        atsakymasRodymui: `$${n / 2}$`,
        sprendimas: `$${n} : 2 = ${n / 2}$.`,
        brezinys: programosLangas([
          `kartok su kiekvienu skaičiumi nuo 1 iki ${n}`,
          '  jeigu skaičius lyginis',
          '    įrašyk į sąrašą',
          'pabaiga',
        ]),
      })
    },

    // 5. Blokinė schema
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kuris blokinės schemos blokas žymi sąlygą?',
        variantai: ['rombas', 'stačiakampis', 'suapvalintas stačiakampis', 'apskritimas'],
        teisingas: 0,
        sprendimas: 'Rombe užrašoma sąlyga, nuo kurios priklauso, kuriuo keliu eiti toliau.',
        brezinys: blokuSchema([
          { tekstas: 'pradžia', tipas: 'pradzia' },
          { tekstas: `jeigu skaičius > ${riba}`, tipas: 'salyga' },
          { tekstas: 'įrašyk į sąrašą', tipas: 'veiksmas' },
          { tekstas: 'pabaiga', tipas: 'pabaiga' },
        ]),
      }),

    // 6. Kada veiksmas neatliekamas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Kada programa NEĮRAŠYS skaičiaus, jei sąlyga yra „skaičius > ${riba}“?`,
        variantai: [
          `kai skaičius yra ${riba} arba mažesnis`,
          `kai skaičius didesnis už ${riba}`,
          'niekada — įrašomi visi skaičiai',
          'kai skaičius lyginis',
        ],
        teisingas: 0,
        sprendimas: `Sąlyga „didesnis už ${riba}“ neapima paties ${riba}.`,
      }),

    // 7. Du kriterijai
    () => {
      const n = pasirink([12, 16, 20])
      const kiekis = Math.floor(n / 2) - Math.floor(riba / 2)
      if (kiekis <= 0 || riba >= n) return null
      return uzdavinys(T7, {
        klausimas: `Programa peržiūri skaičius nuo 1 iki ${n} ir įrašo tik lyginius, didesnius už ${riba}. Kiek skaičių bus įrašyta?`,
        atsakymas: String(kiekis),
        atsakymasRodymui: `$${kiekis}$`,
        sprendimas: `Lyginių iki ${n} yra ${Math.floor(n / 2)}, iki ${riba} — ${Math.floor(riba / 2)}. Lieka ${kiekis}.`,
      })
    },
  ])
}

// ── 13.8 Užduoties skaidymas ────────────────────────────────────────────────

const T8 = 'uzduoties-skaidymas'

const A_SKAIDYMAS = [
  {
    klausimas: 'Kodėl didelė užduotis skaidoma į mažesnes dalis?',
    atsakymas: 'a',
    atsakymasRodymui: 'kad kiekvieną dalį būtų lengviau atlikti ir patikrinti',
    sprendimas: 'Mažas žingsnis aiškesnis nei visa užduotis iš karto.',
  },
] as const

export const uzduotiesSkaidymas: Generatorius = () => suBandymais(kurkSkaidyma, A_SKAIDYMAS, T8)

function kurkSkaidyma(): Uzdavinys | null {
  const daliu = atsitiktinis(3, 6)
  const zingsniu = atsitiktinis(2, 5)

  return variacija([
    // 1. Kodėl skaidoma
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kodėl didelė užduotis skaidoma į mažesnes dalis?',
        variantai: [
          'kad kiekvieną dalį būtų lengviau atlikti ir patikrinti',
          'kad užduotis truktų ilgiau',
          'kad reikėtų mažiau komandų',
          'kad būtų sunkiau suklysti nesuprantant',
        ],
        teisingas: 0,
        sprendimas: 'Radus klaidą mažoje dalyje, jos nereikia ieškoti visoje užduotyje.',
      }),

    // 2. Kiek žingsnių iš viso
    () =>
      uzdavinys(T8, {
        klausimas: `Užduotis suskaidyta į ${daliu} dalis, kiekvienoje po ${zingsniu} žingsnius. Kiek žingsnių iš viso?`,
        atsakymas: String(daliu * zingsniu),
        atsakymasRodymui: `$${daliu * zingsniu}$`,
        sprendimas: `$${daliu} \\cdot ${zingsniu} = ${daliu * zingsniu}$.`,
      }),

    // 3. Kiek dalių
    () => {
      const viso = daliu * zingsniu
      return uzdavinys(T8, {
        klausimas: `Užduotį sudaro ${viso} žingsniai, o į kiekvieną dalį dedama po ${zingsniu}. Į kiek dalių ji suskaidyta?`,
        atsakymas: String(daliu),
        atsakymasRodymui: `$${daliu}$`,
        sprendimas: `$${viso} : ${zingsniu} = ${daliu}$.`,
      })
    },

    // 4. Eiliškumas
    () =>
      eiliskumoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Surikiuok pyrago kepimo dalis teisinga tvarka.',
        teisingaEile: [
          'paruošti produktus',
          'sumaišyti tešlą',
          'įkaitinti orkaitę',
          'kepti pyragą',
          'atvėsinti ir papuošti',
        ],
        sprendimas: 'Kiekviena dalis remiasi ankstesne — negalima kepti, kol tešla nesumaišyta.',
      }),

    // 5. Kuri dalis pirma
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Nuo ko pradedama skaidant užduotį?',
        variantai: [
          'nuo aiškaus galutinio tikslo nustatymo',
          'nuo paskutinio žingsnio',
          'nuo sudėtingiausios dalies',
          'nuo komandų rašymo',
        ],
        teisingas: 0,
        sprendimas: 'Nežinant, ko siekiama, neaišku, į kokias dalis skaidyti.',
      }),

    // 6. Kiek liko
    () => {
      const atlikta = atsitiktinis(1, daliu - 1)
      return uzdavinys(T8, {
        klausimas: `Užduotis suskaidyta į ${daliu} dalis, ${atlikta} jau atliktos. Kiek dalių liko?`,
        atsakymas: String(daliu - atlikta),
        atsakymasRodymui: `$${daliu - atlikta}$`,
        sprendimas: `$${daliu} - ${atlikta} = ${daliu - atlikta}$.`,
      })
    },

    // 7. Kur ieškoti klaidos
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kuo naudinga skaidyti užduotį, kai kažkas neveikia?',
        variantai: [
          'galima patikrinti kiekvieną dalį atskirai ir rasti, kurioje klaida',
          'klaida dingsta savaime',
          'užduotis tampa trumpesnė',
          'nereikia rašyti komandų',
        ],
        teisingas: 0,
        sprendimas: 'Patikrinus dalis po vieną, klaidos vieta susiaurinama.',
      }),
  ])
}

// ── 13.9 Algoritmo sudarymas ────────────────────────────────────────────────

const T9 = 'algoritmo-sudarymas'

const A_SUDARYMAS = [
  {
    klausimas: 'Kas yra algoritmas?',
    atsakymas: 'a',
    atsakymasRodymui: 'tiksli veiksmų seka tikslui pasiekti',
    sprendimas: 'Algoritme svarbi ir veiksmų tvarka.',
  },
] as const

export const algoritmoSudarymas: Generatorius = () => suBandymais(kurkSudaryma, A_SUDARYMAS, T9)

function kurkSudaryma(): Uzdavinys | null {
  const stulpeliu = 6
  const eiluciu = 5
  const startas = { x: atsitiktinis(0, 2), y: atsitiktinis(0, 2) }
  const tikslas = { x: atsitiktinis(3, 5), y: atsitiktinis(3, 4) }
  const zingsniu = Math.abs(tikslas.x - startas.x) + Math.abs(tikslas.y - startas.y)

  return variacija([
    // 1. Kas yra algoritmas
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kas yra algoritmas?',
        variantai: [
          'tiksli veiksmų seka, vedanti prie tikslo',
          'vienas veiksmas',
          'uždavinio atsakymas',
          'kompiuterio programa be komandų',
        ],
        teisingas: 0,
        sprendimas: 'Algoritme svarbu ne tik veiksmai, bet ir jų tvarka.',
      }),

    // 2. Trumpiausias kelias
    () =>
      uzdavinys(T9, {
        klausimas: 'Kiek mažiausiai vieno langelio žingsnių reikia nuo A iki B?',
        atsakymas: String(zingsniu),
        atsakymasRodymui: `$${zingsniu}$`,
        sprendimas: `${Math.abs(tikslas.x - startas.x)} žingsniai horizontaliai ir ${Math.abs(tikslas.y - startas.y)} vertikaliai.`,
        brezinys: algoritmoTinklelis(stulpeliu, eiluciu, startas, tikslas),
      }),

    // 3. Su kliūtimi
    () => {
      const kliutis = { x: startas.x + 1, y: startas.y }
      if (kliutis.x >= stulpeliu) return null
      return uzdavinys(T9, {
        klausimas: 'Kiek mažiausiai žingsnių reikia nuo A iki B, apeinant kliūtį?',
        atsakymas: String(zingsniu),
        atsakymasRodymui: `$${zingsniu}$`,
        sprendimas: 'Kliūtį galima apeiti pakeitus žingsnių tvarką — bendras jų skaičius nesikeičia.',
        brezinys: algoritmoTinklelis(stulpeliu, eiluciu, startas, tikslas, [kliutis]),
      })
    },

    // 4. Komandų eiliškumas
    () =>
      eiliskumoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Surikiuok algoritmo sudarymo žingsnius teisinga tvarka.',
        teisingaEile: [
          'nustatyti tikslą',
          'suskaidyti užduotį į žingsnius',
          'užrašyti komandas iš eilės',
          'patikrinti, ar tikslas pasiektas',
        ],
        sprendimas: 'Patikrinimas visada eina paskutinis — kitaip nėra ko tikrinti.',
      }),

    // 5. Blokinė schema
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kuo blokinė schema padeda sudarant algoritmą?',
        variantai: [
          'ji parodo veiksmų tvarką ir vietas, kur algoritmas šakojasi',
          'ji apskaičiuoja atsakymą',
          'ji sutrumpina komandų skaičių',
          'ji pakeičia programos kodą',
        ],
        teisingas: 0,
        sprendimas: 'Rodyklės rodo eiliškumą, o rombas — sąlygą.',
        brezinys: blokuSchema([
          { tekstas: 'pradžia', tipas: 'pradzia' },
          { tekstas: 'eik pirmyn', tipas: 'veiksmas' },
          { tekstas: 'ar pasiektas tikslas?', tipas: 'salyga' },
          { tekstas: 'pabaiga', tipas: 'pabaiga' },
        ]),
      }),

    // 6. Kiek komandų su kartojimu
    () => {
      const dx = Math.abs(tikslas.x - startas.x)
      if (dx < 2) return null
      return uzdavinys(T9, {
        klausimas: `Kelią iš ${dx} vienodų žingsnių į dešinę galima užrašyti kartojimo komanda. Kiek eilučių tokia programa turės, jei kartojimo komandai reikia dviejų eilučių, o žingsniui — vienos?`,
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: `Eilutės: „kartok ${dx} kartus“, „eik pirmyn“, „pabaiga“ — iš viso trys, o be kartojimo reikėtų ${dx}.`,
      })
    },

    // 7. Kiek komandų iš viso
    () => {
      const posukiu = 1
      return uzdavinys(T9, {
        klausimas: `Kelias iš A į B yra ${zingsniu} žingsniai ir ${kiek(posukiu, { vns: 'posūkis', dgs: 'posūkiai', kilm: 'posūkių' })}. Iš kiek ${KOMANDOS.kilm} susideda algoritmas?`,
        atsakymas: String(zingsniu + posukiu),
        atsakymasRodymui: `$${zingsniu + posukiu}$`,
        sprendimas: `$${zingsniu} + ${posukiu} = ${zingsniu + posukiu}$.`,
        brezinys: algoritmoTinklelis(stulpeliu, eiluciu, startas, tikslas),
      })
    },
  ])
}

// ── 13.10 Algoritmo teisingumo tikrinimas ───────────────────────────────────

const T10 = 'algoritmo-teisingumas'

const A_TEISINGUMAS = [
  {
    klausimas: 'Kaip patikrinama, ar algoritmas teisingas?',
    atsakymas: 'a',
    atsakymasRodymui: 'jis įvykdomas žingsnis po žingsnio ir žiūrima, ar pasiekiamas tikslas',
    sprendimas: 'Vykdant algoritmą matyti, kurioje vietoje jis nukrypsta.',
  },
] as const

export const algoritmoTeisingumas: Generatorius = () =>
  suBandymais(kurkTeisinguma, A_TEISINGUMAS, T10)

function kurkTeisinguma(): Uzdavinys | null {
  const kartai = atsitiktinis(3, 8)
  const zingsniu = atsitiktinis(1, 3)

  return variacija([
    // 1. Kaip tikrinama
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kaip patikrinama, ar algoritmas teisingas?',
        variantai: [
          'jis įvykdomas žingsnis po žingsnio ir žiūrima, ar pasiekiamas tikslas',
          'suskaičiuojama, kiek jame komandų',
          'palyginama su kito mokinio algoritmu',
          'perskaitomas paskutinis žingsnis',
        ],
        teisingas: 0,
        sprendimas: 'Tik vykdant matyti, kurioje vietoje algoritmas nukrypsta nuo tikslo.',
      }),

    // 2. Kur atsidurs objektas
    () =>
      uzdavinys(T10, {
        klausimas: 'Per kiek langelių pajudės objektas, jei programa įvykdoma tiksliai?',
        atsakymas: String(kartai * zingsniu),
        atsakymasRodymui: `$${kartai * zingsniu}$`,
        sprendimas: `$${zingsniu} \\cdot ${kartai} = ${kartai * zingsniu}$.`,
        brezinys: programosLangas([`kartok ${kartai} kartus`, `  eik ${zingsniu} langelius`, 'pabaiga']),
      }),

    // 3. Ar rezultatas toks, kokio tikėtasi
    () => {
      const norima = kartai * zingsniu + pasirink([-2, -1, 1, 2])
      if (norima <= 0) return null
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Norima, kad objektas pajudėtų ${norima} langelius. Ar ši programa tai atlieka?`,
        variantai: [
          `ne, ji perkelia per ${kartai * zingsniu} langelius`,
          `taip, ji perkelia per ${norima} langelius`,
          'to patikrinti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: `$${zingsniu} \\cdot ${kartai} = ${kartai * zingsniu}$, o reikia ${norima}.`,
        brezinys: programosLangas([`kartok ${kartai} kartus`, `  eik ${zingsniu} langelius`, 'pabaiga']),
      })
    },

    // 4. Kiek reikia pakeisti
    () => {
      const norima = kartai * zingsniu + zingsniu * atsitiktinis(1, 3)
      return uzdavinys(T10, {
        klausimas: `Norima, kad objektas pajudėtų ${norima} langelius po ${zingsniu}. Kiek kartų reikia kartoti komandą?`,
        atsakymas: String(norima / zingsniu),
        atsakymasRodymui: `$${norima / zingsniu}$`,
        sprendimas: `$${norima} : ${zingsniu} = ${norima / zingsniu}$.`,
      })
    },

    // 5. Kada algoritmas neteisingas
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kada algoritmas laikomas neteisingu?',
        variantai: [
          'kai jį įvykdžius tikslas nepasiekiamas',
          'kai jame daug komandų',
          'kai jis parašytas ne kompiuteriu',
          'kai jame yra kartojimo komanda',
        ],
        teisingas: 0,
        sprendimas: 'Algoritmo teisingumą lemia tik rezultatas, o ne ilgis ar išvaizda.',
      }),

    // 6. Kiek žingsnių trūksta
    () => {
      const norima = kartai * zingsniu + atsitiktinis(1, 5)
      return uzdavinys(T10, {
        klausimas: `Programa perkelia objektą per ${kartai * zingsniu} langelius, o reikia ${norima}. Kiek langelių trūksta?`,
        atsakymas: String(norima - kartai * zingsniu),
        atsakymasRodymui: `$${norima - kartai * zingsniu}$`,
        sprendimas: `$${norima} - ${kartai * zingsniu} = ${norima - kartai * zingsniu}$.`,
      })
    },

    // 7. Su kuo lyginama
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Su kuo lyginamas algoritmo vykdymo rezultatas?',
        variantai: [
          'su tikslu, kurį algoritmas turėjo pasiekti',
          'su kitų mokinių rezultatais',
          'su komandų skaičiumi',
          'su programos ilgiu',
        ],
        teisingas: 0,
        sprendimas: 'Be aiškaus tikslo patikrinti algoritmo neįmanoma.',
      }),
  ])
}

// ── 13.11 Algoritmo klaidos radimas ir taisymas ─────────────────────────────

const T11 = 'algoritmo-klaida'

const A_KLAIDA = [
  {
    klausimas: 'Programa turi perkelti objektą per 6 langelius, bet perkelia per 4. Ką reikia pakeisti?',
    atsakymas: '6',
    atsakymasRodymui: 'kartojimų skaičių į $6$',
    sprendimas: 'Kartojimų skaičius ir yra žingsnių skaičius.',
  },
] as const

export const algoritmoKlaida: Generatorius = () => suBandymais(kurkKlaida, A_KLAIDA, T11)

function kurkKlaida(): Uzdavinys | null {
  const norima = atsitiktinis(4, 12)
  const parasyta = norima + pasirink([-3, -2, -1, 1, 2, 3])
  if (parasyta < 1 || parasyta === norima) return null

  return variacija([
    // 1. Koks skaičius turi būti
    () =>
      uzdavinys(T11, {
        klausimas: `Programa turi perkelti objektą per ${norima} langelius po vieną, bet perkelia per ${parasyta}. Koks skaičius turi būti pirmoje eilutėje?`,
        atsakymas: String(norima),
        atsakymasRodymui: `$${norima}$`,
        sprendimas: 'Kartojimų skaičius ir yra žingsnių skaičius.',
        brezinys: programosLangas([`kartok ${parasyta} kartus`, '  eik 1 langelį', 'pabaiga'], 1),
      }),

    // 2. Kurioje eilutėje klaida
    () =>
      uzdavinys(T11, {
        klausimas: `Programa turi perkelti objektą per ${norima} langelius, bet perkelia per ${parasyta}. Kurioje eilutėje yra klaida?`,
        atsakymas: '1',
        atsakymasRodymui: '$1$-oje',
        sprendimas: 'Pirmoje eilutėje nurodytas kartojimų skaičius ir lemia visą rezultatą.',
        brezinys: programosLangas([`kartok ${parasyta} kartus`, '  eik 1 langelį', 'pabaiga']),
      }),

    // 3. Kiek skiriasi rezultatas
    () =>
      uzdavinys(T11, {
        klausimas: `Reikėjo ${norima} žingsnių, o programa atlieka ${parasyta}. Keliais žingsniais rezultatas skiriasi?`,
        atsakymas: String(Math.abs(norima - parasyta)),
        atsakymasRodymui: `$${Math.abs(norima - parasyta)}$`,
        sprendimas: `$${Math.max(norima, parasyta)} - ${Math.min(norima, parasyta)} = ${Math.abs(norima - parasyta)}$.`,
      }),

    // 4. Klaidingas veiksmas
    () => {
      const pradzia = atsitiktinis(2, 12)
      const priedas = atsitiktinis(2, 9)
      const kartai = atsitiktinis(3, 6)
      return uzdavinys(T11, {
        klausimas: `Programa turėjo kaskart pridėti ${priedas}, bet atima. Koks skaičius bus išvestas paskutinis, jei programa būtų ištaisyta?`,
        atsakymas: String(pradzia + (kartai - 1) * priedas),
        atsakymasRodymui: `$${pradzia + (kartai - 1) * priedas}$`,
        sprendimas: `Ištaisius: $${pradzia} + ${kartai - 1} \\cdot ${priedas} = ${pradzia + (kartai - 1) * priedas}$.`,
        brezinys: programosLangas(
          [
            `skaicius = ${pradzia}`,
            `kartok ${kartai} kartus`,
            '  spausdink skaicius',
            `  skaicius = skaicius - ${priedas}`,
            'pabaiga',
          ],
          4,
        ),
      })
    },

    // 5. Kaip randama klaida
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kaip patogiausia rasti algoritmo klaidą?',
        variantai: [
          'vykdyti komandas po vieną ir po kiekvienos tikrinti rezultatą',
          'perrašyti visą algoritmą iš naujo',
          'pakeisti paskutinę komandą',
          'padidinti kartojimų skaičių',
        ],
        teisingas: 0,
        sprendimas: 'Vykdant po vieną žingsnį matyti, po kurios komandos rezultatas tampa neteisingas.',
      }),

    // 6. Trūkstama komanda
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Vėžliukas nubrėžia tik tris kvadrato kraštines. Ko trūksta programoje?',
        variantai: [
          'kartojimų skaičius turi būti 4, o ne 3',
          'reikia pridėti dar vieną posūkį pabaigoje',
          'reikia pakeisti žingsnio ilgį',
          'reikia pašalinti kartojimo komandą',
        ],
        teisingas: 0,
        sprendimas: 'Kvadratas turi keturias kraštines, tad ir kartojimų reikia keturių.',
        brezinys: programosLangas(['kartok 3 kartus', '  eik pirmyn', '  pasuk', 'pabaiga'], 1),
      }),

    // 7. Klaida sąlygoje
    () => {
      const viso = atsitiktinis(8, 16)
      const riba = atsitiktinis(3, viso - 3)
      return uzdavinys(T11, {
        klausimas: `Programa turėjo įrašyti skaičius, didesnius už ${riba}, bet įrašo mažesnius. Kiek skaičių nuo 1 iki ${viso} turėjo būti įrašyta?`,
        atsakymas: String(viso - riba),
        atsakymasRodymui: `$${viso - riba}$`,
        sprendimas: `Didesni už ${riba} yra skaičiai nuo ${riba + 1} iki ${viso}: $${viso} - ${riba} = ${viso - riba}$.`,
        brezinys: programosLangas(
          [`kartok su kiekvienu skaičiumi nuo 1 iki ${viso}`, `  jeigu skaičius < ${riba}`, '    įrašyk', 'pabaiga'],
          2,
        ),
      })
    },
  ])
}

// ── 13.12 Skirtingi algoritmai tam pačiam rezultatui ────────────────────────

const T12 = 'skirtingi-algoritmai'

const A_SKIRTINGI = [
  {
    klausimas: 'Ar tą patį tikslą galima pasiekti skirtingais algoritmais?',
    atsakymas: 'a',
    atsakymasRodymui: 'taip, kelių skirtingų kelių dažnai būna',
    sprendimas: 'Svarbu tik tai, ar tikslas pasiekiamas.',
  },
] as const

export const skirtingiAlgoritmai: Generatorius = () =>
  suBandymais(kurkSkirtingus, A_SKIRTINGI, T12)

function kurkSkirtingus(): Uzdavinys | null {
  const stulpeliu = 6
  const eiluciu = 5
  const startas = { x: 0, y: 0 }
  const tikslas = { x: atsitiktinis(2, 5), y: atsitiktinis(2, 4) }
  const zingsniu = tikslas.x + tikslas.y

  return variacija([
    // 1. Ar galima keliais būdais
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ar tą patį tikslą galima pasiekti skirtingais algoritmais?',
        variantai: [
          'taip, kelių skirtingų kelių dažnai būna',
          'ne, algoritmas visada vienas',
          'taip, bet tik jei jie vienodo ilgio',
        ],
        teisingas: 0,
        sprendimas: 'Svarbu ne kelias, o ar tikslas pasiektas.',
        brezinys: algoritmoTinklelis(stulpeliu, eiluciu, startas, tikslas),
      }),

    // 2. Ar abu keliai vienodo ilgio
    () =>
      uzdavinys(T12, {
        klausimas: 'Kiek žingsnių reikia nuo A iki B, einant tik į dešinę ir į viršų?',
        atsakymas: String(zingsniu),
        atsakymasRodymui: `$${zingsniu}$`,
        sprendimas: `${tikslas.x} žingsniai į dešinę ir ${tikslas.y} į viršų — kad ir kokia tvarka, iš viso ${zingsniu}.`,
        brezinys: algoritmoTinklelis(stulpeliu, eiluciu, startas, tikslas),
      }),

    // 3. Kuris algoritmas trumpesnis
    () => {
      const ilgesnis = zingsniu + atsitiktinis(2, 4)
      return pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: `Vienas algoritmas pasiekia tikslą per ${zingsniu} žingsnius, kitas — per ${ilgesnis}. Kuris geresnis, jei abu pasiekia tikslą?`,
        variantai: [
          `trumpesnis (${zingsniu} žingsniai)`,
          `ilgesnis (${ilgesnis} žingsniai)`,
          'abu vienodai geri',
        ],
        teisingas: 0,
        sprendimas: 'Jei abu pasiekia tą patį tikslą, patogesnis tas, kuris trumpesnis.',
      })
    },

    // 4. Su kartojimu ir be jo
    () => {
      const kartai = atsitiktinis(4, 9)
      return uzdavinys(T12, {
        klausimas: `Tą patį kelią galima užrašyti ${kartai} atskiromis komandomis arba kartojimo komanda, kuriai reikia trijų eilučių. Keliomis eilutėmis trumpesnė antroji programa?`,
        atsakymas: String(kartai - 3),
        atsakymasRodymui: `$${kartai - 3}$`,
        sprendimas: `$${kartai} - 3 = ${kartai - 3}$.`,
      })
    },

    // 5. Skirtinga tvarka
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: `Ar objektas atsidurs toje pačioje vietoje, jei pirma eis ${tikslas.x} žingsnius į dešinę, o paskui ${tikslas.y} į viršų, ar atvirkščiai?`,
        variantai: [
          'taip, galutinė vieta ta pati',
          'ne, vietos skirsis',
          'taip, tik jei kelias trumpesnis',
        ],
        teisingas: 0,
        sprendimas: 'Žingsnių tvarka keičia kelią, bet ne galutinę vietą.',
        brezinys: algoritmoTinklelis(stulpeliu, eiluciu, startas, tikslas),
      }),

    // 6. Kiek skirtingų kelių
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Kodėl tą pačią figūrą galima nubrėžti keliais skirtingais būdais?',
        variantai: [
          'nes kraštines galima brėžti skirtinga tvarka arba kita kryptimi',
          'nes figūra keičia formą',
          'nes komandų skaičius visada skiriasi',
          'nes vėžliukas juda atsitiktinai',
        ],
        teisingas: 0,
        sprendimas: 'Rezultatas tas pats, nors kelias skiriasi.',
        brezinys: vezliukoKelias([
          { dx: 3, dy: 0 },
          { dx: 0, dy: 3 },
          { dx: -3, dy: 0 },
          { dx: 0, dy: -3 },
        ]),
      }),

    // 7. Susieti būdus su savybėmis
    () =>
      poruUzdavinys(naujasId(T12), T12, {
        klausimas: 'Susiek algoritmo užrašymo būdą su jo savybe.',
        poros: [
          { kaire: 'komandos surašytos po vieną', desine: 'ilgas, bet lengvai skaitomas' },
          { kaire: 'naudojama kartojimo komanda', desine: 'trumpas, kai komandos kartojasi' },
          { kaire: 'naudojama pasirinkimo komanda', desine: 'veiksmas atliekamas tik esant sąlygai' },
        ],
        sprendimas: 'Komandų skaičių lemia užduotis, o užrašymo būdą — patogumas.',
      }),
  ])
}
