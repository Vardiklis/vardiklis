/**
 * Matematikos pagalbinės funkcijos: nsd, mbk, trupmenų suprastinimas,
 * atsitiktinumas ir atsakymų normalizavimas.
 *
 * Čia nėra jokios uždavinių logikos — tik įrankiai, kuriuos naudoja generatoriai.
 */

export type Trupmena = {
  skaitiklis: number
  vardiklis: number
}

/** Didžiausias bendrasis daliklis. */
export function nsd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a))
  let y = Math.abs(Math.trunc(b))
  while (y !== 0) {
    ;[x, y] = [y, x % y]
  }
  return x === 0 ? 1 : x
}

/** Mažiausias bendrasis kartotinis. */
export function mbk(a: number, b: number): number {
  const x = Math.abs(Math.trunc(a))
  const y = Math.abs(Math.trunc(b))
  if (x === 0 || y === 0) return 0
  return (x / nsd(x, y)) * y
}

/** Suprastina trupmeną. Ženklas visada lieka skaitiklyje. */
export function suprastink(skaitiklis: number, vardiklis: number): Trupmena {
  if (vardiklis === 0) throw new Error('Vardiklis negali būti nulis')
  const zenklas = vardiklis < 0 ? -1 : 1
  const sk = skaitiklis * zenklas
  const vd = vardiklis * zenklas
  const d = nsd(sk, vd)
  return { skaitiklis: sk / d, vardiklis: vd / d }
}

/** Sveikas atsitiktinis skaičius intervale [min, max] imtinai. */
export function atsitiktinis(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Atsitiktinis elementas iš masyvo. */
export function pasirink<T>(masyvas: readonly T[]): T {
  if (masyvas.length === 0) throw new Error('Tuščias masyvas')
  return masyvas[Math.floor(Math.random() * masyvas.length)]
}

/** Atsitiktinis nenulinis skaičius intervale — vengiam 0 ir, jei prašoma, 1. */
export function atsitiktinisBe(min: number, max: number, vengti: readonly number[]): number {
  const galimi: number[] = []
  for (let n = min; n <= max; n += 1) {
    if (!vengti.includes(n)) galimi.push(n)
  }
  return pasirink(galimi)
}

/** Naujas masyvas atsitiktine tvarka (Fisher–Yates). */
export function sumaisyk<T>(masyvas: readonly T[]): T[] {
  const kopija = [...masyvas]
  for (let i = kopija.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[kopija[i], kopija[j]] = [kopija[j], kopija[i]]
  }
  return kopija
}

let skaitliukas = 0

/** Unikalus id vieno seanso ribose — naudojamas React raktams. */
export function naujasId(priesaga: string): string {
  skaitliukas += 1
  return `${priesaga}-${skaitliukas}`
}

// ---------------------------------------------------------------------------
// KaTeX pagalbininkai
//
// `klausimas`, `atsakymasRodymui` ir `sprendimas` rašomi mišriu formatu:
// paprastas lietuviškas tekstas, o matematika tarp `$...$`.
// Pvz.: 'Apskaičiuok $\\dfrac{2}{3} + \\dfrac{3}{4}$'
// ---------------------------------------------------------------------------

/** Trupmena KaTeX'u. Sveikas skaičius grąžinamas be `\dfrac`. */
export function trupmenaTeX({ skaitiklis, vardiklis }: Trupmena): string {
  if (vardiklis === 1) return String(skaitiklis)
  if (skaitiklis < 0) return `-\\dfrac{${Math.abs(skaitiklis)}}{${vardiklis}}`
  return `\\dfrac{${skaitiklis}}{${vardiklis}}`
}

/** Neigiamas skaičius skliaustuose — kad `3 · (−4)` skaitytųsi teisingai. */
export function skliaustuoseJeiNeigiamas(n: number): string {
  return n < 0 ? `(${n})` : String(n)
}

// ---------------------------------------------------------------------------
// Atsakymų normalizavimas (7.4)
// ---------------------------------------------------------------------------

/** Kanoninė racionaliojo skaičiaus išraiška: `3/4`, `-3/4` arba `5`. */
function kanonine(skaitiklis: number, vardiklis: number): string {
  if (vardiklis === 0) return 'nan'
  const t = suprastink(skaitiklis, vardiklis)
  return t.vardiklis === 1 ? String(t.skaitiklis) : `${t.skaitiklis}/${t.vardiklis}`
}

/**
 * Suveda įvestį į palyginamą pavidalą.
 *
 * - `1,5` ir `1.5` → `3/2`
 * - `2/4` → `1/2`   (neprastinta trupmena teisinga)
 * - `0,50` → `1/2`
 * - `1 1/2` → `3/2` (mišrusis skaičius)
 * - tarpai, procento ženklas ir įvairūs brūkšneliai nurašomi
 * - `desineje` → `dešinėje` (diakritikai nurašomi, tad tekstinį atsakymą
 *   galima įrašyti ir be lietuviškų raidžių)
 *
 * Netekstiniai atsakymai grąžinami kaip sumažintos raidės be tarpų.
 */
export function normalizuok(ivestis: string): string {
  let s = (ivestis ?? '').trim().toLowerCase()
  if (s === '') return ''

  // Lietuviškos raidės su diakritikais suvedamos į paprastąsias: pirmokas,
  // rašantis „desineje", turi gauti tą patį rezultatą kaip „dešinėje".
  s = s.replace(/[ąčęėįšųūž]/g, (r) => 'aceeisuuz'['ąčęėįšųūž'.indexOf(r)])

  s = s.replace(/[−–—]/g, '-') // − – — → -
  s = s.replace(/,/g, '.')
  s = s.replace(/%/g, '')

  // „x = 5" — vaikai natūraliai užrašo ir nežinomąjį. Priešdėlį nurašom.
  s = s.replace(/^[a-z]\s*=\s*/, '')

  // Kvadratinė šaknis ir laipsnis suskaičiuojami, jei rezultatas sveikas —
  // kitaip klaviatūros √ ir x² klavišai duotų atsakymus, žymimus klaidingais.
  s = s.replace(/√\s*(\d+)/g, (visas, n: string) => {
    const saknis = Math.sqrt(Number(n))
    return Number.isInteger(saknis) ? String(saknis) : visas
  })
  s = s.replace(/(\d+)\s*\^\s*(\d+)/g, (visas, pagrindas: string, rodiklis: string) => {
    if (Number(rodiklis) > 8) return visas
    const reiksme = Number(pagrindas) ** Number(rodiklis)
    return Number.isSafeInteger(reiksme) ? String(reiksme) : visas
  })

  // Vieno sandaugos veiksmo pakanka: „2*3" yra 6, o ne atsakymas „2*3".
  s = s.replace(/^(-?\d+)\s*\*\s*(\d+)$/, (visas, a: string, b: string) =>
    String(Number(a) * Number(b)),
  )

  s = s.replace(/\s*\/\s*/g, '/')
  s = s.replace(/\s+/g, ' ').trim()

  // Mišrusis skaičius: „1 1/2"
  const misrus = s.match(/^(-?\d+) (\d+)\/(\d+)$/)
  if (misrus) {
    const sveikas = Number(misrus[1])
    const sk = Number(misrus[2])
    const vd = Number(misrus[3])
    if (vd !== 0) {
      const zenklas = sveikas < 0 ? -1 : 1
      return kanonine(zenklas * (Math.abs(sveikas) * vd + sk), vd)
    }
  }

  s = s.replace(/\s/g, '')

  const trupmena = s.match(/^(-?\d+)\/(-?\d+)$/)
  if (trupmena) {
    const vd = Number(trupmena[2])
    if (vd !== 0) return kanonine(Number(trupmena[1]), vd)
  }

  // Dešimtainė trupmena verčiama tiksliai, be slankaus kablelio paklaidų.
  if (/^-?\d*\.?\d+$/.test(s)) {
    const neigiamas = s.startsWith('-')
    const be = neigiamas ? s.slice(1) : s
    const [sveika = '0', dalis = ''] = be.split('.')
    const vardiklis = 10 ** dalis.length
    const skaitiklis = Number(sveika || '0') * vardiklis + Number(dalis || '0')
    return kanonine(neigiamas ? -skaitiklis : skaitiklis, vardiklis)
  }

  return s
}

/** Ar mokinio įvestis atitinka laukiamą (jau normalizuotą) atsakymą. */
export function arTeisingas(ivestis: string, laukiamas: string): boolean {
  const a = normalizuok(ivestis)
  return a !== '' && a === laukiamas
}
