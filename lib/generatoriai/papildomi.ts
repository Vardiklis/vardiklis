import { atsitiktinis, nsd, pasirink, suprastink, trupmenaTeX } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import type { Generatorius, Lygis, Uzdavinys } from './tipai'

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

export const dalumoPozymiai: Generatorius = (lygis) =>
  suBandymais(() => kurkPozymi(lygis), A_DALUMO_POZYMIAI, 'dalumo-pozymiai')

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

function kurkPozymi(lygis: Lygis): Uzdavinys | null {
  return variacija([
    // 1. Kuris iš trijų daliklių tinka
    () => {
      const teisingas = pasirink(POZYMIAI)
      const kartotinis = teisingas.d * atsitiktinis(4, 40)
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
      const n = atsitiktinis(12, 60)
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
      const n = atsitiktinis(30, 300)
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
      const n = atsitiktinis(24, 250)
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
      const n = atsitiktinis(11, 60)
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

export const skaitmenys: Generatorius = (lygis) =>
  suBandymais(() => kurkSkaitmenis(lygis), A_SKAITMENYS, 'skaitmenys')

function kurkSkaitmenis(lygis: Lygis): Uzdavinys | null {
  return variacija([
    // 1. Vietinė reikšmė
    () => {
      const skyrius = pasirink(SKYRIAI.slice(1))
      const skaitmuo = atsitiktinis(1, 9)
      const n = atsitiktinis(1000, 9999)
      const suSkaitmeniu =
        n - Math.floor(n / skyrius.verte) % 10 * skyrius.verte + skaitmuo * skyrius.verte
      if (String(suSkaitmeniu).length !== 4) return null
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
      const n = atsitiktinis(1111, 9999)
      const skaitmenys = String(n).split('').map(Number)
      const [t, s, d, v] = skaitmenys
      if ([t, s, d, v].some((x) => x === 0)) return null
      return uzdavinys('skaitmenys', {
        klausimas: `Skaičių ${n} išskaidėme skyrių suma: $${t * 1000} + \\square + ${d * 10} + ${v}$. Koks skaičius vietoj langelio?`,
        atsakymas: String(s * 100),
        atsakymasRodymui: `$${s * 100}$`,
        sprendimas: `Šimtų skyriuje stovi ${s}, tad trūksta ${s * 100}.`,
      })
    },

    // 3. Romėniškas → arabiškas
    () => {
      const n = atsitiktinis(4, lygis === 1 ? 39 : 399)
      return uzdavinys('skaitmenys', {
        klausimas: `Kokį skaičių žymi romėniškasis užrašas ${iRomeniskus(n)}?`,
        atsakymas: String(n),
        atsakymasRodymui: `$${n}$`,
        sprendimas: `${iRomeniskus(n)} atitinka ${n}.`,
      })
    },

    // 4. Skaitmenų suma
    () => {
      const n = atsitiktinis(100, 9999)
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

    // 5. Didžiausias skaičius iš skaitmenų
    () => {
      if (lygis === 1) return null
      const skaitmenys = Array.from({ length: 4 }, () => atsitiktinis(1, 9))
      if (new Set(skaitmenys).size < 4) return null
      const didziausias = Number([...skaitmenys].sort((a, b) => b - a).join(''))
      return uzdavinys('skaitmenys', {
        klausimas: `Iš skaitmenų ${skaitmenys.join(', ')} sudaryk didžiausią keturženklį skaičių. Kiekvienas skaitmuo naudojamas po kartą.`,
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

export const saknuIvertinimas: Generatorius = (lygis) =>
  suBandymais(() => kurkIvertinima(lygis), A_SAKNU_IVERTINIMAS, 'saknu-ivertinimas')

function kurkIvertinima(lygis: Lygis): Uzdavinys | null {
  return variacija([
    // 1. Tarp kurių sveikųjų
    () => {
      const k = atsitiktinis(3, 15)
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
      const k = atsitiktinis(3, 15)
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
      const a = atsitiktinis(2, 12)
      const b = atsitiktinis(2, 12)
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
      const a = atsitiktinis(2, 10)
      const b = atsitiktinis(2, 10)
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
      if (lygis !== 3) return null
      const a = atsitiktinis(2, 9)
      const b = pasirink([2, 3, 5, 6, 7, 10] as const)
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

export const sklaida: Generatorius = (lygis) =>
  suBandymais(() => kurkSklaida(lygis), A_SKLAIDA, 'sklaida')

function kurkSklaida(lygis: Lygis): Uzdavinys | null {
  const kiek = lygis === 1 ? 5 : 7
  const nariai = Array.from({ length: kiek }, () => atsitiktinis(2, 30)).sort((a, b) => a - b)
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

export const vijeto: Generatorius = (lygis) =>
  suBandymais(() => kurkVijeto(lygis), A_VIJETO, 'vijeto')

function kurkVijeto(lygis: Lygis): Uzdavinys | null {
  const p = atsitiktinis(-8, 8)
  const q = atsitiktinis(-8, 8)
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

export const misiniai: Generatorius = (lygis) =>
  suBandymais(() => kurkMisini(lygis), A_MISINIAI, 'misiniai')

function kurkMisini(lygis: Lygis): Uzdavinys | null {
  const procentai = pasirink([10, 20, 25, 40, 50] as const)
  const tirpalas = atsitiktinis(2, 10) * 100
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
      if (lygis !== 3) return null
      const a = atsitiktinis(2, 8) * 10
      const b = atsitiktinis(2, 8) * 10
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

export const rekurenciosSekos: Generatorius = (lygis) =>
  suBandymais(() => kurkRekurencia(lygis), A_REKURENCIOS, 'rekurencios-sekos')

function kurkRekurencia(lygis: Lygis): Uzdavinys | null {
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
      const k = atsitiktinis(2, 9)
      const b = atsitiktinis(-10, 10)
      const n = atsitiktinis(4, 12)
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
      const k = atsitiktinis(2, 9)
      const b = atsitiktinis(-8, 8)
      const n = atsitiktinis(4, 15)
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
      const pradzia = atsitiktinis(2, 20)
      const zingsnis = atsitiktinis(3, 12)
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
      if (lygis !== 3) return null
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
