import { derink } from '../lietuviu'
import { atsitiktinis, nsd, pasirink, suprastink, trupmenaTeX } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { didink, vyresne } from './mastas'
import { skyriuBlokai } from './vaizdai'
import type { Generatorius, Lygis, Sritis, Uzdavinys } from './tipai'

/**
 * Gebėjimai, kurių reikalauja 5–10 klasių turinio aprašas, bet kurių neturėjo
 * ankstesni generatoriai: dalumo požymiai ir skaidymas pirminiais, skaitmens
 * vietinė reikšmė ir romėniškieji skaitmenys, šaknies įvertinimas ir skaičių
 * aibės, imties sklaida, diskriminantas su Vijeto teorema, mišinių uždaviniai
 * ir rekurenčiosios sekos.
 */

// ── Dalumo požymiai ir skaidymas pirminiais ─────────────────────────────────

const POZYMIAI = [
  { d: 2, taisykle: 'skaičius baigiasi lyginiu skaitmeniu' },
  { d: 5, taisykle: 'skaičius baigiasi 0 arba 5' },
  { d: 10, taisykle: 'skaičius baigiasi nuliu' },
  { d: 3, taisykle: 'skaitmenų suma dalijasi iš 3' },
  { d: 9, taisykle: 'skaitmenų suma dalijasi iš 9' },
  { d: 4, taisykle: 'dviejų paskutinių skaitmenų skaičius dalijasi iš 4' },
] as const

const A_DALUMO_POZYMIAI = [
  {
    klausimas: 'Iš kurio skaičiaus dalijasi 135: iš 2, iš 3 ar iš 4? Įrašyk tą skaičių.',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Skaitmenų suma $1 + 3 + 5 = 9$ dalijasi iš 3.',
  },
] as const

export const dalumoPozymiai: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkPozymi(lygis, klase), A_DALUMO_POZYMIAI, 'dalumo-pozymiai')

/** Pirminiai dauginamieji didėjančia tvarka. */
function pirminiai(n: number): number[] {
  const rez: number[] = []
  let likutis = n
  for (let d = 2; d * d <= likutis; d += 1) {
    while (likutis % d === 0) {
      rez.push(d)
      likutis /= d
    }
  }
  if (likutis > 1) rez.push(likutis)
  return rez
}

function kurkPozymi(lygis: Lygis, klase?: number): Uzdavinys | null {
  return variacija([
    // 1. Kuris iš trijų daliklių tinka
    () => {
      const teisingas = pasirink(POZYMIAI)
      const kartotinis = teisingas.d * atsitiktinis(4, didink(40, klase))
      const kiti = POZYMIAI.filter((p) => p.d !== teisingas.d && kartotinis % p.d !== 0)
      if (kiti.length < 2) return null
      const [a, b] = kiti.slice(0, 2)
      const variantai = [teisingas.d, a.d, b.d].sort((x, y) => x - y)
      return uzdavinys('dalumo-pozymiai', {
        klausimas: `Iš kurio skaičiaus dalijasi ${kartotinis}: iš ${variantai.join(', iš ')}? Įrašyk tą skaičių.`,
        atsakymas: String(teisingas.d),
        atsakymasRodymui: `$${teisingas.d}$`,
        sprendimas: `Dalumo iš ${teisingas.d} požymis: ${teisingas.taisykle}.`,
      })
    },

    // 2. Trūkstamas skaitmuo, kad dalytųsi
    () => {
      const d = pasirink([3, 9] as const)
      const pradzia = atsitiktinis(10, 98)
      for (let s = 0; s <= 9; s += 1) {
        const n = pradzia * 10 + s
        const suma = String(n)
          .split('')
          .reduce((a, c) => a + Number(c), 0)
        if (suma % d === 0) {
          return uzdavinys('dalumo-pozymiai', {
            klausimas: `Koks skaitmuo turi būti vietoj langelio, kad skaičius $${pradzia}\\square$ dalytųsi iš ${d}? Įrašyk mažiausią tinkamą.`,
            atsakymas: String(s),
            atsakymasRodymui: `$${s}$`,
            sprendimas: `Skaitmenų suma turi dalytis iš ${d}: $${String(n)
              .split('')
              .join(' + ')} = ${suma}$.`,
          })
        }
      }
      return null
    },

    // 3. Kiek daliklių turi skaičius
    () => {
      const n = atsitiktinis(12, didink(60, klase))
      const kiek = Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0).length
      return uzdavinys('dalumo-pozymiai', {
        klausimas: `Kiek daliklių turi skaičius ${n}?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `${n} dalikliai: ${Array.from({ length: n }, (_, i) => i + 1)
          .filter((d) => n % d === 0)
          .join(', ')}.`,
      })
    },

    // 4. Skaidymas pirminiais — didžiausias pirminis dauginamasis
    () => {
      if (lygis === 1) return null
      const n = atsitiktinis(30, didink(300, klase))
      const p = pirminiai(n)
      if (p.length < 2) return null
      const didziausias = p[p.length - 1]
      return uzdavinys('dalumo-pozymiai', {
        klausimas: `Skaičių ${n} išskaidyk pirminiais dauginamaisiais. Koks didžiausias pirminis dauginamasis?`,
        atsakymas: String(didziausias),
        atsakymasRodymui: `$${didziausias}$`,
        sprendimas: `$${n} = ${p.join(' \\cdot ')}$.`,
      })
    },

    // 5. Kiek pirminių dauginamųjų
    () => {
      if (lygis === 1) return null
      const n = atsitiktinis(24, didink(250, klase))
      const p = pirminiai(n)
      if (p.length < 2) return null
      return uzdavinys('dalumo-pozymiai', {
        klausimas: `Iš kiek pirminių dauginamųjų (skaičiuojant pasikartojančius) susideda ${n}?`,
        atsakymas: String(p.length),
        atsakymasRodymui: `$${p.length}$`,
        sprendimas: `$${n} = ${p.join(' \\cdot ')}$ — iš viso ${p.length}.`,
      })
    },

    // 6. Ar skaičius pirminis
    () => {
      const n = atsitiktinis(11, didink(60, klase))
      const p = pirminiai(n)
      const arPirminis = p.length === 1
      return uzdavinys('dalumo-pozymiai', {
        klausimas: `Ar skaičius ${n} pirminis? Įrašyk 1, jei taip, ir 0, jei ne.`,
        atsakymas: arPirminis ? '1' : '0',
        atsakymasRodymui: arPirminis ? '$1$ (pirminis)' : '$0$ (sudėtinis)',
        sprendimas: arPirminis
          ? `${n} dalijasi tik iš 1 ir iš savęs.`
          : `$${n} = ${p.join(' \\cdot ')}$, tad jis sudėtinis.`,
      })
    },
  ])
}

// ── Skaitmens reikšmė ir romėniškieji skaitmenys ────────────────────────────

const ROMENISKI: readonly (readonly [number, string])[] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
]

function iRomeniskus(n: number): string {
  let likutis = n
  let rez = ''
  for (const [verte, zenklas] of ROMENISKI) {
    while (likutis >= verte) {
      rez += zenklas
      likutis -= verte
    }
  }
  return rez
}

const SKYRIAI = [
  { verte: 1, pavadinimas: 'vienetų' },
  { verte: 10, pavadinimas: 'dešimčių' },
  { verte: 100, pavadinimas: 'šimtų' },
  { verte: 1000, pavadinimas: 'tūkstančių' },
] as const

const A_SKAITMENYS = [
  {
    klausimas: 'Kokia skaitmens 7 vietinė reikšmė skaičiuje 4 703?',
    atsakymas: '700',
    atsakymasRodymui: '$700$',
    sprendimas: '7 stovi šimtų skyriuje, tad jo vietinė reikšmė yra 700.',
  },
] as const

export const skaitmenys: Generatorius = (lygis, _klase, sritis) =>
  suBandymais(() => kurkSkaitmenis(lygis, sritis), A_SKAITMENYS, 'skaitmenys')

/** „1 dešimtis“, „3 dešimtys“, „10 dešimčių“. */
function desimtysZodis(n: number): string {
  return derink(n, { vns: 'dešimtis', dgs: 'dešimtys', kilm: 'dešimčių' })
}

/** „1 vienetas“, „3 vienetai“, „10 vienetų“. */
function vienetaiZodis(n: number): string {
  return derink(n, { vns: 'vienetas', dgs: 'vienetai', kilm: 'vienetų' })
}

/** Skaičiaus žodis pagal ženklų skaičių — sąlygai „sudaryk didžiausią …“. */
const ZENKLU_ZODIS: Record<number, string> = {
  2: 'dviženklį',
  3: 'triženklį',
  4: 'keturženklį',
}

/**
 * Skyriai ir skaitmenys.
 *
 * Generatorius buvo prirakintas prie keturženklių skaičių, todėl 1 klasės
 * potemė „Kas yra dešimtys ir vienetai?“ duodavo uždavinius apie tūkstančius.
 * Dabar ženklų skaičių nustato sritis, o dešimčių ir vienetų klausimai yra
 * atskiri pavidalai — jie ir yra tikroji pirmokų potemė.
 */
function kurkSkaitmenis(lygis: Lygis, sritis?: Sritis | null): Uzdavinys | null {
  const virsus = sritis?.max ?? 9999
  if (virsus < 10) return null
  const skyriai = SKYRIAI.filter((s) => s.verte * 10 <= virsus + 1)
  const zenklu = Math.min(4, String(Math.min(virsus, 9999)).length)

  return variacija([
    // 1. Vietinė reikšmė
    () => {
      if (skyriai.length < 2) return null
      const skyrius = pasirink(skyriai.slice(1))
      const skaitmuo = atsitiktinis(1, 9)
      const n = atsitiktinis(skyrius.verte, virsus)
      const suSkaitmeniu =
        n - ((Math.floor(n / skyrius.verte) % 10) * skyrius.verte) + skaitmuo * skyrius.verte
      if (suSkaitmeniu > virsus || suSkaitmeniu < skyrius.verte) return null
      return uzdavinys('skaitmenys', {
        klausimas: `Kokia skaitmens ${skaitmuo} vietinė reikšmė skaičiuje ${suSkaitmeniu}?`,
        atsakymas: String(skaitmuo * skyrius.verte),
        atsakymasRodymui: `$${skaitmuo * skyrius.verte}$`,
        sprendimas: `${skaitmuo} stovi ${skyrius.pavadinimas} skyriuje, tad jo vietinė reikšmė yra ${
          skaitmuo * skyrius.verte
        }.`,
      })
    },

    // 2. Skyrių suma — trūkstamas dėmuo
    () => {
      // Skyrių pavadinimai baigiasi tūkstančiais, tad daugiau nei keturi
      // ženklai šiam pavidalui netinka.
      const n = atsitiktinis(10, Math.min(virsus, 9999))
      const sk = String(n).split('').map(Number)
      if (sk.some((x) => x === 0) || sk.length < 2) return null
      const dalys = sk.map((c, i) => c * 10 ** (sk.length - 1 - i))
      const trukstamas = atsitiktinis(0, dalys.length - 1)
      const rodomi = dalys.map((d, i) => (i === trukstamas ? '\\square' : String(d)))
      return uzdavinys('skaitmenys', {
        klausimas: `Skaičių ${n} išskaidėme skyrių suma: $${rodomi.join(' + ')}$. Koks skaičius vietoj langelio?`,
        atsakymas: String(dalys[trukstamas]),
        atsakymasRodymui: `$${dalys[trukstamas]}$`,
        sprendimas: `${SKYRIAI[sk.length - 1 - trukstamas].pavadinimas} skyriuje stovi ${sk[trukstamas]}, tad trūksta ${dalys[trukstamas]}.`,
      })
    },

    // 3. Kiek pilnų dešimčių
    () => {
      const n = atsitiktinis(11, virsus)
      if (n % 10 === 0) return null
      return uzdavinys('skaitmenys', {
        klausimas: `Kiek pilnų dešimčių yra skaičiuje ${n}?`,
        atsakymas: String(Math.floor(n / 10)),
        atsakymasRodymui: `$${Math.floor(n / 10)}$`,
        sprendimas: `${n} yra ${Math.floor(n / 10)} ${desimtysZodis(Math.floor(n / 10))} ir dar ${n % 10} ${vienetaiZodis(n % 10)}.`,
        brezinys: n <= 99 ? skyriuBlokai(Math.floor(n / 10), n % 10) : undefined,
      })
    },

    // 4. Kiek vienetų lieka virš dešimčių
    () => {
      const n = atsitiktinis(11, virsus)
      if (n % 10 === 0) return null
      return uzdavinys('skaitmenys', {
        klausimas: `Kiek vienetų yra skaičiuje ${n} virš pilnų dešimčių?`,
        atsakymas: String(n % 10),
        atsakymasRodymui: `$${n % 10}$`,
        sprendimas: `${n} yra ${Math.floor(n / 10)} ${desimtysZodis(Math.floor(n / 10))} ir ${n % 10} ${vienetaiZodis(n % 10)}.`,
        brezinys: n <= 99 ? skyriuBlokai(Math.floor(n / 10), n % 10) : undefined,
      })
    },

    // 5. Skaičius iš dešimčių ir vienetų — atvirkštinis veiksmas
    () => {
      if (lygis === 1) return null
      const d = atsitiktinis(1, Math.min(9, Math.floor(virsus / 10)))
      const v = atsitiktinis(1, 9)
      const n = d * 10 + v
      if (n > virsus) return null
      return uzdavinys('skaitmenys', {
        klausimas: `Skaičių sudaro ${d} ${desimtysZodis(d)} ir ${v} ${vienetaiZodis(v)}. Koks tai skaičius?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `$${d} \\cdot 10 + ${v} = ${n}$.`,
        brezinys: skyriuBlokai(d, v),
      })
    },

    // 6. Romėniškas → arabiškas
    () => {
      const n = atsitiktinis(4, Math.min(virsus, lygis === 1 ? 39 : 399))
      if (n < 4) return null
      return uzdavinys('skaitmenys', {
        klausimas: `Kokį skaičių žymi romėniškasis užrašas ${iRomeniskus(n)}?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `${iRomeniskus(n)} atitinka ${n}.`,
      })
    },

    // 7. Skaitmenų suma
    () => {
      const n = atsitiktinis(10, virsus)
      const suma = String(n)
        .split('')
        .reduce((a, c) => a + Number(c), 0)
      return uzdavinys('skaitmenys', {
        klausimas: `Kokia skaičiaus ${n} skaitmenų suma?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${String(n).split('').join(' + ')} = ${suma}$.`,
      })
    },

    // 8. Didžiausias skaičius iš skaitmenų
    () => {
      if (lygis === 1 || zenklu < 2) return null
      const sk = Array.from({ length: zenklu }, () => atsitiktinis(1, 9))
      if (new Set(sk).size < zenklu) return null
      const didziausias = Number([...sk].sort((a, b) => b - a).join(''))
      if (didziausias > virsus) return null
      return uzdavinys('skaitmenys', {
        klausimas: `Iš skaitmenų ${sk.join(', ')} sudaryk didžiausią ${ZENKLU_ZODIS[zenklu]} skaičių. Kiekvienas skaitmuo naudojamas po kartą.`,
        atsakymas: String(didziausias),
        atsakymasRodymui: `$${didziausias}$`,
        sprendimas: `Skaitmenis rikiuojame mažėjančiai: ${didziausias}.`,
      })
    },
  ])
}

// ── Šaknies įvertinimas ir skaičių aibės ────────────────────────────────────

const A_SAKNU_IVERTINIMAS = [
  {
    klausimas: 'Tarp kurių dviejų gretimų sveikųjų skaičių yra $\\sqrt{50}$? Įrašyk mažesnįjį.',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: '$7^2 = 49$, o $8^2 = 64$, tad $7 < \\sqrt{50} < 8$.',
  },
] as const

export const saknuIvertinimas: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkIvertinima(lygis, klase), A_SAKNU_IVERTINIMAS, 'saknu-ivertinimas')

function kurkIvertinima(lygis: Lygis, klase?: number): Uzdavinys | null {
  return variacija([
    // 1. Tarp kurių sveikųjų
    () => {
      const k = atsitiktinis(3, didink(15, klase))
      const n = atsitiktinis(k * k + 1, (k + 1) * (k + 1) - 1)
      return uzdavinys('saknu-ivertinimas', {
        klausimas: `Tarp kurių dviejų gretimų sveikųjų skaičių yra $\\sqrt{${n}}$? Įrašyk mažesnįjį.`,
        atsakymas: String(k),
        atsakymasRodymui: `$${k}$`,
        sprendimas: `$${k}^2 = ${k * k}$, o $${k + 1}^2 = ${(k + 1) * (k + 1)}$, tad $${k} < \\sqrt{${n}} < ${
          k + 1
        }$.`,
      })
    },

    // 2. Artimiausias sveikasis
    () => {
      const k = atsitiktinis(3, didink(15, klase))
      const n = atsitiktinis(k * k + 1, (k + 1) * (k + 1) - 1)
      const artimiausias = Math.abs(n - k * k) < Math.abs(n - (k + 1) * (k + 1)) ? k : k + 1
      return uzdavinys('saknu-ivertinimas', {
        klausimas: `Kuriam sveikajam skaičiui artimiausia $\\sqrt{${n}}$?`,
        atsakymas: String(artimiausias),
        atsakymasRodymui: `$${artimiausias}$`,
        sprendimas: `$${k}^2 = ${k * k}$, $${k + 1}^2 = ${
          (k + 1) * (k + 1)
        }$; ${n} arčiau ${artimiausias * artimiausias}.`,
      })
    },

    // 3. Šaknis iš sandaugos
    () => {
      const a = atsitiktinis(2, didink(12, klase))
      const b = atsitiktinis(2, didink(12, klase))
      return uzdavinys('saknu-ivertinimas', {
        klausimas: `Apskaičiuok: $\\sqrt{${a * a}} \\cdot \\sqrt{${b * b}}$`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$.`,
      })
    },

    // 4. Šaknis iš trupmenos
    () => {
      if (lygis === 1) return null
      const a = atsitiktinis(2, didink(10, klase))
      const b = atsitiktinis(2, didink(10, klase))
      if (a === b) return null
      const t = suprastink(a, b)
      if (t.vardiklis > 20) return null
      return uzdavinys('saknu-ivertinimas', {
        klausimas: `Apskaičiuok: $\\sqrt{\\dfrac{${a * a}}{${b * b}}}$`,
        atsakymas: `${t.skaitiklis}/${t.vardiklis}`,
        atsakymasRodymui: `$${trupmenaTeX(t)}$`,
        sprendimas: `$\\dfrac{\\sqrt{${a * a}}}{\\sqrt{${b * b}}} = \\dfrac{${a}}{${b}} = ${trupmenaTeX(
          t,
        )}$.`,
      })
    },

    // 5. Iškėlimas prieš šaknies ženklą
    () => {
      if (lygis === 1) return null
      const a = atsitiktinis(2, didink(9, klase))
      const b = pasirink([2, 3, 5, 6, 7, 10, 11, 13, 15] as const)
      return uzdavinys('saknu-ivertinimas', {
        klausimas: `Iškelk dauginamąjį prieš šaknies ženklą: $\\sqrt{${a * a * b}} = \\square\\sqrt{${b}}$. Koks skaičius vietoj langelio?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$${a * a * b} = ${a * a} \\cdot ${b}$, tad $\\sqrt{${a * a * b}} = ${a}\\sqrt{${b}}$.`,
      })
    },
  ])
}

// ── Imties sklaida: plotis, kvartiliai ──────────────────────────────────────

const A_SKLAIDA = [
  {
    klausimas: 'Duomenys: $3, 7, 9, 12, 15$. Koks imties plotis (didžiausios ir mažiausios reikšmės skirtumas)?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '$15 - 3 = 12$.',
  },
] as const

export const sklaida: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkSklaida(lygis, klase), A_SKLAIDA, 'sklaida')

function kurkSklaida(lygis: Lygis, klase?: number): Uzdavinys | null {
  const kiek = lygis === 1 ? 5 : 7
  const nariai = Array.from({ length: kiek }, () => atsitiktinis(2, didink(30, klase))).sort((a, b) => a - b)
  if (new Set(nariai).size < kiek) return null

  return variacija([
    // 1. Imties plotis
    () =>
      uzdavinys('sklaida', {
        klausimas: `Duomenys: $${nariai.join(', ')}$. Koks imties plotis?`,
        atsakymas: String(nariai[kiek - 1] - nariai[0]),
        atsakymasRodymui: `$${nariai[kiek - 1] - nariai[0]}$`,
        sprendimas: `$${nariai[kiek - 1]} - ${nariai[0]} = ${nariai[kiek - 1] - nariai[0]}$.`,
      }),

    // 2. Mediana
    () =>
      uzdavinys('sklaida', {
        klausimas: `Duomenys: $${nariai.join(', ')}$. Kokia mediana?`,
        atsakymas: String(nariai[Math.floor(kiek / 2)]),
        atsakymasRodymui: `$${nariai[Math.floor(kiek / 2)]}$`,
        sprendimas: `Duomenys surikiuoti, viduryje stovi ${nariai[Math.floor(kiek / 2)]}.`,
      }),

    // 3. Apatinis kvartilis
    () => {
      if (kiek < 7) return null
      const q1 = nariai[1]
      return uzdavinys('sklaida', {
        klausimas: `Duomenys: $${nariai.join(', ')}$. Kokia apatinio kvartilio $Q_1$ reikšmė?`,
        atsakymas: String(q1),
        atsakymasRodymui: `$${q1}$`,
        sprendimas: `Apatinę pusę $${nariai.slice(0, 3).join(', ')}$ dalija pusiau ${q1}.`,
      })
    },

    // 4. Viršutinis kvartilis
    () => {
      if (kiek < 7) return null
      const q3 = nariai[5]
      return uzdavinys('sklaida', {
        klausimas: `Duomenys: $${nariai.join(', ')}$. Kokia viršutinio kvartilio $Q_3$ reikšmė?`,
        atsakymas: String(q3),
        atsakymasRodymui: `$${q3}$`,
        sprendimas: `Viršutinę pusę $${nariai.slice(4).join(', ')}$ dalija pusiau ${q3}.`,
      })
    },

    // 5. Kiek reikšmių viršija vidurkį
    () => {
      const suma = nariai.reduce((a, b) => a + b, 0)
      if (suma % kiek !== 0) return null
      const v = suma / kiek
      const kiekVirsija = nariai.filter((n) => n > v).length
      return uzdavinys('sklaida', {
        klausimas: `Duomenys: $${nariai.join(', ')}$. Kiek reikšmių viršija vidurkį?`,
        atsakymas: String(kiekVirsija),
        atsakymasRodymui: `$${kiekVirsija}$`,
        sprendimas: `Vidurkis $${suma} : ${kiek} = ${v}$; už jį didesnės ${kiekVirsija} reikšmės.`,
      })
    },
  ])
}

// ── Diskriminantas ir Vijeto teorema ────────────────────────────────────────

const A_VIJETO = [
  {
    klausimas: 'Lygties $x^2 - 7x + 12 = 0$ sprendinių suma. Kam ji lygi?',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: 'Pagal Vijeto teoremą sprendinių suma lygi $-b = 7$.',
  },
] as const

export const vijeto: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkVijeto(lygis, klase), A_VIJETO, 'vijeto')

function kurkVijeto(lygis: Lygis, klase?: number): Uzdavinys | null {
  const riba = vyresne(klase) ? 15 : 8
  const p = atsitiktinis(-riba, riba)
  const q = atsitiktinis(-riba, riba)
  if (p === q || p === 0 || q === 0) return null
  const suma = p + q
  const sandauga = p * q
  const b = -suma
  const c = sandauga
  if (Math.abs(b) > 15 || Math.abs(c) > 60) return null

  const uzrasas = `x^2 ${b >= 0 ? '+' : '-'} ${Math.abs(b)}x ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = 0`

  return variacija([
    // 1. Sprendinių suma
    () =>
      uzdavinys('vijeto', {
        klausimas: `Kam lygi lygties $${uzrasas}$ sprendinių suma?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Pagal Vijeto teoremą suma lygi $-b = ${suma}$.`,
      }),

    // 2. Sprendinių sandauga
    () =>
      uzdavinys('vijeto', {
        klausimas: `Kam lygi lygties $${uzrasas}$ sprendinių sandauga?`,
        atsakymas: String(sandauga),
        atsakymasRodymui: `$${sandauga}$`,
        sprendimas: `Pagal Vijeto teoremą sandauga lygi $c = ${sandauga}$.`,
      }),

    // 3. Diskriminantas
    () => {
      const d = b * b - 4 * c
      return uzdavinys('vijeto', {
        klausimas: `Apskaičiuok lygties $${uzrasas}$ diskriminantą.`,
        atsakymas: String(d),
        atsakymasRodymui: `$${d}$`,
        sprendimas: `$D = b^2 - 4ac = (${b})^2 - 4 \\cdot 1 \\cdot (${c}) = ${d}$.`,
      })
    },

    // 4. Sprendinių skaičius
    () => {
      const d = b * b - 4 * c
      const kiek = d > 0 ? 2 : d === 0 ? 1 : 0
      return uzdavinys('vijeto', {
        klausimas: `Kiek realiųjų sprendinių turi lygtis $${uzrasas}$?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `$D = ${d}$, tad sprendinių ${kiek}.`,
      })
    },

    // 5. Antrasis sprendinys
    () => {
      if (lygis === 1) return null
      const zinomas = p
      const kitas = q
      return uzdavinys('vijeto', {
        klausimas: `Vienas lygties $${uzrasas}$ sprendinys yra ${zinomas}. Koks antrasis?`,
        atsakymas: String(kitas),
        atsakymasRodymui: `$${kitas}$`,
        sprendimas: `Sprendinių suma ${suma}, tad antrasis $${suma} - (${zinomas}) = ${kitas}$.`,
      })
    },
  ])
}

// ── Mišiniai ir koncentracija ───────────────────────────────────────────────

const A_MISINIAI = [
  {
    klausimas: 'Į 200 g vandens įberta 50 g druskos. Kiek procentų druskos yra tirpale?',
    atsakymas: '20',
    atsakymasRodymui: '$20$ %',
    sprendimas: 'Tirpalo masė $200 + 50 = 250$ g, tad $50 : 250 \\cdot 100 = 20$ %.',
  },
] as const

export const misiniai: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkMisini(lygis, klase), A_MISINIAI, 'misiniai')

function kurkMisini(lygis: Lygis, klase?: number): Uzdavinys | null {
  const procentai = vyresne(klase)
    ? pasirink([5, 10, 15, 20, 25, 30, 40, 50, 60] as const)
    : pasirink([10, 20, 25, 40, 50] as const)
  const tirpalas = atsitiktinis(2, didink(10, klase)) * 100
  const medziaga = (tirpalas * procentai) / 100
  if (!Number.isInteger(medziaga)) return null

  return variacija([
    // 1. Kiek medžiagos tirpale
    () =>
      uzdavinys('misiniai', {
        klausimas: `Tirpalo masė ${tirpalas} g, jo koncentracija ${procentai} %. Kiek gramų druskos jame yra?`,
        atsakymas: String(medziaga),
        atsakymasRodymui: `$${medziaga}$ g`,
        sprendimas: `$${tirpalas} \\cdot ${procentai} : 100 = ${medziaga}$ g.`,
      }),

    // 2. Koncentracija
    () => {
      const vanduo = tirpalas - medziaga
      if (vanduo <= 0) return null
      return uzdavinys('misiniai', {
        klausimas: `Į ${vanduo} g vandens įberta ${medziaga} g druskos. Kiek procentų druskos yra tirpale?`,
        atsakymas: String(procentai),
        atsakymasRodymui: `$${procentai}$ %`,
        sprendimas: `Tirpalo masė $${vanduo} + ${medziaga} = ${tirpalas}$ g, tad $${medziaga} : ${tirpalas} \\cdot 100 = ${procentai}$ %.`,
      })
    },

    // 3. Kiek tirpalo
    () =>
      uzdavinys('misiniai', {
        klausimas: `Tirpale yra ${medziaga} g druskos, koncentracija ${procentai} %. Kokia tirpalo masė?`,
        atsakymas: String(tirpalas),
        atsakymasRodymui: `$${tirpalas}$ g`,
        sprendimas: `$${medziaga} : ${procentai} \\cdot 100 = ${tirpalas}$ g.`,
      }),

    // 4. Praskiedimas — kiek pridėti vandens
    () => {
      if (lygis === 1) return null
      const naujaKoncentracija = procentai / 2
      if (!Number.isInteger(naujaKoncentracija)) return null
      const naujasTirpalas = (medziaga * 100) / naujaKoncentracija
      const pridetiVandens = naujasTirpalas - tirpalas
      if (pridetiVandens <= 0) return null
      return uzdavinys('misiniai', {
        klausimas: `${tirpalas} g ${procentai} % tirpalo praskiedžiama iki ${naujaKoncentracija} %. Kiek gramų vandens reikia pridėti?`,
        atsakymas: String(pridetiVandens),
        atsakymasRodymui: `$${pridetiVandens}$ g`,
        sprendimas: `Druskos lieka ${medziaga} g. Naujo tirpalo masė $${medziaga} : ${naujaKoncentracija} \\cdot 100 = ${naujasTirpalas}$ g, tad pridedame $${naujasTirpalas} - ${tirpalas} = ${pridetiVandens}$ g.`,
      })
    },

    // 5. Lydinys iš dviejų dalių
    () => {
      if (lygis === 1) return null
      const a = atsitiktinis(2, didink(8, klase)) * 10
      const b = atsitiktinis(2, didink(8, klase)) * 10
      const d = nsd(a, b)
      return uzdavinys('misiniai', {
        klausimas: `Lydinį sudaro ${a} g vario ir ${b} g cinko. Kokiu santykiu jie sumaišyti? Įrašyk suprastintą trupmeną vario ir cinko santykiui.`,
        atsakymas: `${a / d}/${b / d}`,
        atsakymasRodymui: `$${trupmenaTeX({ skaitiklis: a / d, vardiklis: b / d })}$`,
        sprendimas: `$${a} : ${b}$, abu dalijame iš ${d}: $${a / d} : ${b / d}$.`,
      })
    },
  ])
}

// ── Rekurenčiosios sekos ────────────────────────────────────────────────────

const A_REKURENCIOS = [
  {
    klausimas: 'Fibonačio seka: $1, 1, 2, 3, 5, 8, \\ldots$ Koks narys eina po 8?',
    atsakymas: '13',
    atsakymasRodymui: '$13$',
    sprendimas: 'Kiekvienas narys yra dviejų ankstesnių suma: $5 + 8 = 13$.',
  },
] as const

export const rekurenciosSekos: Generatorius = (lygis, klase) =>
  suBandymais(() => kurkRekurencia(lygis, klase), A_REKURENCIOS, 'rekurencios-sekos')

function kurkRekurencia(lygis: Lygis, klase?: number): Uzdavinys | null {
  return variacija([
    // 1. Fibonačio tipo seka
    () => {
      const a = atsitiktinis(1, 5)
      const b = atsitiktinis(1, 6)
      const seka = [a, b]
      for (let i = 2; i < 6; i += 1) seka.push(seka[i - 1] + seka[i - 2])
      const kitas = seka[4] + seka[5]
      if (kitas > 500) return null
      return uzdavinys('rekurencios-sekos', {
        klausimas: `Kiekvienas sekos narys lygus dviejų ankstesnių sumai: $${seka.join(
          ', ',
        )}, \\ldots$ Koks kitas narys?`,
        atsakymas: String(kitas),
        atsakymasRodymui: `$${kitas}$`,
        sprendimas: `$${seka[4]} + ${seka[5]} = ${kitas}$.`,
      })
    },

    // 2. n-tasis narys pagal formulę
    () => {
      const k = atsitiktinis(2, didink(9, klase))
      const b = atsitiktinis(-didink(10, klase), didink(10, klase))
      const n = atsitiktinis(4, vyresne(klase) ? 25 : 12)
      const rez = k * n + b
      return uzdavinys('rekurencios-sekos', {
        klausimas: `Sekos $n$-tasis narys $a_n = ${k}n ${b >= 0 ? '+' : '-'} ${Math.abs(
          b,
        )}$. Kam lygus $a_{${n}}$?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$a_{${n}} = ${k} \\cdot ${n} ${b >= 0 ? '+' : '-'} ${Math.abs(
          b,
        )} = ${rez}$.`,
      })
    },

    // 3. Kelintas narys lygus duotai reikšmei
    () => {
      const k = atsitiktinis(2, didink(9, klase))
      const b = atsitiktinis(-didink(8, klase), didink(8, klase))
      const n = atsitiktinis(4, vyresne(klase) ? 30 : 15)
      const reiksme = k * n + b
      return uzdavinys('rekurencios-sekos', {
        klausimas: `Sekos $n$-tasis narys $a_n = ${k}n ${b >= 0 ? '+' : '-'} ${Math.abs(
          b,
        )}$. Kelintas narys lygus ${reiksme}?`,
        atsakymas: String(n),
        atsakymasRodymui: `$n = ${n}$`,
        sprendimas: `Sprendžiame $${k}n ${b >= 0 ? '+' : '-'} ${Math.abs(
          b,
        )} = ${reiksme}$ ir gauname $n = ${n}$.`,
      })
    },

    // 4. Kas antras narys — skirtumas
    () => {
      if (lygis === 1) return null
      const pradzia = atsitiktinis(2, didink(20, klase))
      const zingsnis = atsitiktinis(3, didink(12, klase))
      const seka = [0, 1, 2, 3, 4].map((i) => pradzia + i * zingsnis)
      return uzdavinys('rekurencios-sekos', {
        klausimas: `Seka: $${seka.join(', ')}, \\ldots$ Kam lygus dešimtasis narys?`,
        atsakymas: String(pradzia + 9 * zingsnis),
        atsakymasRodymui: `$${pradzia + 9 * zingsnis}$`,
        sprendimas: `$a_n = ${pradzia} + (n - 1) \\cdot ${zingsnis}$, tad $a_{10} = ${
          pradzia + 9 * zingsnis
        }$.`,
      })
    },

    // 5. Geometrinė seka
    () => {
      if (lygis === 1) return null
      const pradzia = atsitiktinis(1, 4)
      const daugiklis = pasirink([2, 3] as const)
      const seka = [0, 1, 2, 3].map((i) => pradzia * daugiklis ** i)
      const kitas = pradzia * daugiklis ** 4
      if (kitas > 1000) return null
      return uzdavinys('rekurencios-sekos', {
        klausimas: `Seka: $${seka.join(', ')}, \\ldots$ Koks kitas narys?`,
        atsakymas: String(kitas),
        atsakymasRodymui: `$${kitas}$`,
        sprendimas: `Kiekvienas narys ${daugiklis} kartus didesnis: $${seka[3]} \\cdot ${daugiklis} = ${kitas}$.`,
      })
    },
  ])
}

// ── Loginiai teiginiai ir įrodymas ──────────────────────────────────────────

const A_LOGIKA = [
  {
    klausimas: 'Ar teiginys „Kiekvienas kvadratas yra stačiakampis“ teisingas? Įrašyk „taip“ arba „ne“.',
    atsakymas: 'taip',
    atsakymasRodymui: 'taip',
    sprendimas: 'Kvadratas turi keturis stačiuosius kampus, tad tenkina stačiakampio apibrėžimą.',
  },
] as const

/** Teiginiai su iš anksto žinoma tiesos reikšme — sąlyga niekada nedviprasmiška. */
const TEIGINIAI: readonly { tekstas: string; teisingas: boolean; kodel: string }[] = [
  {
    tekstas: 'Kiekvienas kvadratas yra stačiakampis',
    teisingas: true,
    kodel: 'Kvadratas turi keturis stačiuosius kampus, tad tenkina stačiakampio apibrėžimą.',
  },
  {
    tekstas: 'Kiekvienas stačiakampis yra kvadratas',
    teisingas: false,
    kodel: 'Stačiakampio kraštinės gali būti nelygios, pavyzdžiui 2 cm ir 5 cm.',
  },
  {
    tekstas: 'Kiekvienas pirminis skaičius yra nelyginis',
    teisingas: false,
    kodel: 'Skaičius 2 yra pirminis ir lyginis — tai kontrapavyzdys.',
  },
  {
    tekstas: 'Trikampio kampų suma lygi 180°',
    teisingas: true,
    kodel: 'Tai trikampio kampų sumos teorema.',
  },
  {
    tekstas: 'Jei skaičius dalus iš 6, tai jis dalus ir iš 3',
    teisingas: true,
    kodel: 'Šešetas pats dalus iš 3, tad ir kiekvienas jo kartotinis dalus iš 3.',
  },
  {
    tekstas: 'Jei skaičius dalus iš 3, tai jis dalus ir iš 6',
    teisingas: false,
    kodel: 'Skaičius 9 dalus iš 3, bet ne iš 6.',
  },
  {
    tekstas: 'Dviejų nelyginių skaičių suma yra lyginė',
    teisingas: true,
    kodel: '$(2k+1) + (2m+1) = 2(k+m+1)$ — sandaugoje yra daugiklis 2.',
  },
  {
    tekstas: 'Skaičiaus kvadratas visada didesnis už patį skaičių',
    teisingas: false,
    kodel: 'Kai skaičius yra $\\tfrac{1}{2}$, jo kvadratas $\\tfrac{1}{4}$ — mažesnis.',
  },
  {
    tekstas: 'Lygiašonio trikampio pagrindo kampai lygūs',
    teisingas: true,
    kodel: 'Tai lygiašonio trikampio savybė, įrodoma per kraštinių lygybę.',
  },
  {
    tekstas: 'Visi lyginiai skaičiai yra sudėtiniai',
    teisingas: false,
    kodel: 'Skaičius 2 yra lyginis, bet pirminis.',
  },
  {
    tekstas: 'Vertikalieji kampai lygūs',
    teisingas: true,
    kodel: 'Tai vertikaliųjų kampų teorema.',
  },
  {
    tekstas: 'Jei du skaičiai turi lygius kvadratus, tai jie patys lygūs',
    teisingas: false,
    kodel: '$(-3)^2 = 3^2 = 9$, bet $-3 \\ne 3$.',
  },
]

/** Sąvokos ir jų rūšis — skiriamės aksiomą, apibrėžimą ir teoremą. */
const SAVOKOS: readonly { tekstas: string; rusis: string; kodel: string }[] = [
  {
    tekstas: 'Per du taškus galima nubrėžti vienintelę tiesę',
    rusis: 'aksioma',
    kodel: 'Tai priimama be įrodymo — vadinasi, aksioma.',
  },
  {
    tekstas: 'Trikampis, kurio visos kraštinės lygios, vadinamas lygiakraščiu',
    rusis: 'apibrėžimas',
    kodel: 'Teiginys nusako, ką reiškia sąvoka — vadinasi, apibrėžimas.',
  },
  {
    tekstas: 'Stačiojo trikampio statinių kvadratų suma lygi įžambinės kvadratui',
    rusis: 'teorema',
    kodel: 'Tai Pitagoro teorema — teiginys, kurį reikia įrodyti.',
  },
  {
    tekstas: 'Lygiašonio trikampio pagrindo kampai lygūs',
    rusis: 'teorema',
    kodel: 'Teiginys įrodomas remiantis kraštinių lygybe — vadinasi, teorema.',
  },
  {
    tekstas: 'Skaičius, dalus tik iš vieneto ir savęs, vadinamas pirminiu',
    rusis: 'apibrėžimas',
    kodel: 'Teiginys nusako sąvokos reikšmę — vadinasi, apibrėžimas.',
  },
  {
    tekstas: 'Per tašką, nepriklausantį tiesei, galima nubrėžti vienintelę jai lygiagrečią tiesę',
    rusis: 'aksioma',
    kodel: 'Tai lygiagretumo aksioma — priimama be įrodymo.',
  },
]

export const logika: Generatorius = (lygis) => suBandymais(() => kurkLogika(lygis), A_LOGIKA, 'logika')

function kurkLogika(lygis: Lygis): Uzdavinys | null {
  return variacija([
    // 1. Teisingas ar klaidingas teiginys
    () => {
      const t = pasirink(TEIGINIAI)
      return uzdavinys('logika', {
        klausimas: `Ar teiginys „${t.tekstas}“ teisingas? Įrašyk „taip“ arba „ne“.`,
        atsakymas: t.teisingas ? 'taip' : 'ne',
        atsakymasRodymui: t.teisingas ? 'taip' : 'ne',
        sprendimas: t.kodel,
      })
    },

    // 2. Kontrapavyzdys
    () => {
      const klaidingi = TEIGINIAI.filter((t) => !t.teisingas)
      const t = pasirink(klaidingi)
      return uzdavinys('logika', {
        klausimas: `Teiginys „${t.tekstas}“ yra klaidingas. Ar užtenka vieno kontrapavyzdžio jam paneigti? Įrašyk „taip“ arba „ne“.`,
        atsakymas: 'taip',
        atsakymasRodymui: 'taip',
        sprendimas: `Taip. Vienas pavyzdys, kuriame teiginys neveikia, jį paneigia. ${t.kodel}`,
      })
    },

    // 3. Aksioma, apibrėžimas ar teorema
    () => {
      const s = pasirink(SAVOKOS)
      return uzdavinys('logika', {
        klausimas: `Kas yra teiginys „${s.tekstas}“ — aksioma, apibrėžimas ar teorema? Įrašyk vieną žodį.`,
        atsakymas: s.rusis,
        atsakymasRodymui: s.rusis,
        sprendimas: s.kodel,
      })
    },

    // 4. Atvirkštinis teiginys
    () => {
      if (lygis === 1) return null
      const n = pasirink([4, 6, 8, 9, 10, 12, 14, 15] as const)
      const d = n % 2 === 0 ? 2 : 3
      return uzdavinys('logika', {
        klausimas: `Teiginys: „Jei skaičius dalus iš ${n}, tai jis dalus iš ${d}“. Ar atvirkštinis teiginys („Jei dalus iš ${d}, tai dalus iš ${n}“) teisingas? Įrašyk „taip“ arba „ne“.`,
        atsakymas: 'ne',
        atsakymasRodymui: 'ne',
        sprendimas: `Ne. Pavyzdžiui, ${d * (n / d + 1)} dalus iš ${d}, bet nedalus iš ${n}. Atvirkštinis teiginys ne visada teisingas.`,
      })
    },

    // 5. Kiek pavyzdžių įrodo bendrą teiginį
    () => {
      const kiek = atsitiktinis(3, 50)
      return uzdavinys('logika', {
        klausimas: `Mokinys patikrino ${kiek} pavyzdžius ir visi tiko. Ar to pakanka, kad teiginys būtų įrodytas visiems skaičiams? Įrašyk „taip“ arba „ne“.`,
        atsakymas: 'ne',
        atsakymasRodymui: 'ne',
        sprendimas: `Ne. Pavyzdžiai gali tik parodyti, kad teiginys tikėtinas. Įrodymas turi remtis samprotavimu, tinkančiu visiems skaičiams — ${kiek} pavyzdžių nepakanka.`,
      })
    },

    // 6. Sąlyga ir išvada
    () => {
      if (lygis === 1) return null
      const t = pasirink(TEIGINIAI.filter((x) => x.tekstas.startsWith('Jei')))
      const dalys = t.tekstas.split(', tai ')
      if (dalys.length !== 2) return null
      return uzdavinys('logika', {
        klausimas: `Teiginyje „${t.tekstas}“ — kuri dalis yra išvada? Įrašyk „pirma“ arba „antra“.`,
        atsakymas: 'antra',
        atsakymasRodymui: 'antra',
        sprendimas: `Po žodžio „tai“ eina išvada: „${dalys[1]}“. Prieš jį — sąlyga.`,
      })
    },
  ])
}
