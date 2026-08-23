import { derink } from '../lietuviu'

/**
 * Bendri 4 klasės pagalbininkai.
 *
 * Ketvirtoje klasėje skaičiai peržengia tūkstantį, ir `45208` mokiniui virsta
 * penkių skaitmenų virtine, kurios nebeperskaitai iš karto. Vadovėliuose
 * tūkstančiai skiriami tarpu, tad ir čia — kitaip pati potemė „Kaip skaityti
 * skaičius iki 1 000 000?“ prieštarautų savo užrašymui.
 */

/** 45208 → „45\,208“ KaTeX intarpui tarp `$...$`. */
export function sk4(n: number): string {
  const zenklas = n < 0 ? '-' : ''
  return zenklas + grupuok(String(Math.abs(n)), '\\,')
}

/** Tas pats paprastam tekstui ir SVG užrašams. */
export function tekstu(n: number): string {
  const zenklas = n < 0 ? '−' : ''
  return zenklas + grupuok(String(Math.abs(n)), ' ')
}

function grupuok(skaitmenys: string, skirtukas: string): string {
  // Keturženkliai rašomi be tarpo („2450“), kaip ir vadovėlyje — tarpas
  // reikalingas tik nuo penkių skaitmenų, kur skaičius jau nebeaprėpiamas.
  if (skaitmenys.length <= 4) return skaitmenys
  return skaitmenys.replace(/\B(?=(\d{3})+(?!\d))/g, skirtukas)
}

/**
 * Suma centais → „12{,}45“ eurams.
 *
 * Dešimtainis kablelis KaTeX’e rašomas `{,}`, antraip po jo atsiranda tarpas
 * kaip po skyrybos ženklo ir kaina atrodo kaip du skaičiai.
 */
export function eurais(centai: number): string {
  const c = Math.abs(centai)
  return `${centai < 0 ? '-' : ''}${Math.floor(c / 100)}{,}${String(c % 100).padStart(2, '0')}`
}

/** Skaičius atsakymo palyginimui: 1245 centai → „12.45“. */
export function eurais10(centai: number): string {
  return (centai / 100).toFixed(2)
}

// ── Daiktavardžių derinimas ─────────────────────────────────────────────────

export type Formos = { vns: string; dgs: string; kilm: string }

/** „24 pieštukai“, „20 pieštukų“ — skaičius su suderinta daiktavardžio forma. */
export function kiek(n: number, formos: Formos): string {
  return `${tekstu(n)} ${derink(n, formos)}`
}

/**
 * Dažniausi tekstinių uždavinių daiktavardžiai.
 *
 * Lietuvių kalboje daiktavardžio forma priklauso nuo skaičiaus, o skaičius
 * generuojamas atsitiktinai — tad be lentelės kas antras uždavinys gautųsi su
 * klaida („20 pieštukai“). Linksniai skirti tam sakinio vaidmeniui, kuriame
 * daiktavardis dažniausiai atsiduria.
 */
export const D = {
  uzdaviniai: { vns: 'uždavinys', dgs: 'uždaviniai', kilm: 'uždavinių' },
  uzdavinius: { vns: 'uždavinį', dgs: 'uždavinius', kilm: 'uždavinių' },
  pakuotes: { vns: 'pakuotę', dgs: 'pakuotes', kilm: 'pakuočių' },
  lipdukai: { vns: 'lipduką', dgs: 'lipdukus', kilm: 'lipdukų' },
  pieststukai: { vns: 'pieštukas', dgs: 'pieštukai', kilm: 'pieštukų' },
  saldainiai: { vns: 'saldainį', dgs: 'saldainius', kilm: 'saldainių' },
  plyteles: { vns: 'plytelė', dgs: 'plytelės', kilm: 'plytelių' },
  sasiuviniai: { vns: 'sąsiuvinys', dgs: 'sąsiuviniai', kilm: 'sąsiuvinių' },
  sasiuvinius: { vns: 'sąsiuvinį', dgs: 'sąsiuvinius', kilm: 'sąsiuvinių' },
  vaikai: { vns: 'vaikas', dgs: 'vaikai', kilm: 'vaikų' },
  obuoliai: { vns: 'obuolys', dgs: 'obuoliai', kilm: 'obuolių' },
  keleiviai: { vns: 'keleivį', dgs: 'keleivius', kilm: 'keleivių' },
  puslapiai: { vns: 'puslapis', dgs: 'puslapiai', kilm: 'puslapių' },
  puslapius: { vns: 'puslapį', dgs: 'puslapius', kilm: 'puslapių' },
  varztai: { vns: 'varžtas', dgs: 'varžtai', kilm: 'varžtų' },
  kedes: { vns: 'kėdė', dgs: 'kėdės', kilm: 'kėdžių' },
  kedziu: { vns: 'kėdę', dgs: 'kėdes', kilm: 'kėdžių' },
  eiles: { vns: 'eilė', dgs: 'eilės', kilm: 'eilių' },
  vietos: { vns: 'vietą', dgs: 'vietas', kilm: 'vietų' },
  sveciai: { vns: 'svečią', dgs: 'svečius', kilm: 'svečių' },
  dezes: { vns: 'dėžė', dgs: 'dėžės', kilm: 'dėžių' },
  knygos: { vns: 'knyga', dgs: 'knygos', kilm: 'knygų' },
  taskai: { vns: 'tašką', dgs: 'taškus', kilm: 'taškų' },
  kartai: { vns: 'kartą', dgs: 'kartus', kilm: 'kartų' },
  metrai: { vns: 'metras', dgs: 'metrai', kilm: 'metrų' },
  centimetrai: { vns: 'centimetras', dgs: 'centimetrai', kilm: 'centimetrų' },
  kilometrai: { vns: 'kilometras', dgs: 'kilometrai', kilm: 'kilometrų' },
  minutes: { vns: 'minutė', dgs: 'minutės', kilm: 'minučių' },
  valandos: { vns: 'valanda', dgs: 'valandos', kilm: 'valandų' },
  eurai: { vns: 'euras', dgs: 'eurai', kilm: 'eurų' },
  eurus: { vns: 'eurą', dgs: 'eurus', kilm: 'eurų' },
  centai: { vns: 'centas', dgs: 'centai', kilm: 'centų' },
  apyrankes: { vns: 'apyrankė', dgs: 'apyrankės', kilm: 'apyrankių' },
  gramai: { vns: 'gramas', dgs: 'gramai', kilm: 'gramų' },
  kubeliai: { vns: 'kubelis', dgs: 'kubeliai', kilm: 'kubelių' },
  kubelius: { vns: 'kubelį', dgs: 'kubelius', kilm: 'kubelių' },
  mokiniai: { vns: 'mokinys', dgs: 'mokiniai', kilm: 'mokinių' },
  dalys: { vns: 'dalis', dgs: 'dalys', kilm: 'dalių' },
  langeliai: { vns: 'langelis', dgs: 'langeliai', kilm: 'langelių' },
  rutuliukai: { vns: 'rutuliukas', dgs: 'rutuliukai', kilm: 'rutuliukų' },
  nariai: { vns: 'narys', dgs: 'nariai', kilm: 'narių' },
  langelius: { vns: 'langelį', dgs: 'langelius', kilm: 'langelių' },
} as const satisfies Record<string, Formos>

// ── Skaičius žodžiais ───────────────────────────────────────────────────────

const VIENETAI = [
  '',
  'vienas',
  'du',
  'trys',
  'keturi',
  'penki',
  'šeši',
  'septyni',
  'aštuoni',
  'devyni',
] as const

const PAAUGLIAI = [
  'dešimt',
  'vienuolika',
  'dvylika',
  'trylika',
  'keturiolika',
  'penkiolika',
  'šešiolika',
  'septyniolika',
  'aštuoniolika',
  'devyniolika',
] as const

const DESIMTYS = [
  '',
  '',
  'dvidešimt',
  'trisdešimt',
  'keturiasdešimt',
  'penkiasdešimt',
  'šešiasdešimt',
  'septyniasdešimt',
  'aštuoniasdešimt',
  'devyniasdešimt',
] as const

function iki999(n: number): string {
  const simtai = Math.floor(n / 100)
  const likutis = n % 100
  const dalys: string[] = []

  if (simtai === 1) dalys.push('šimtas')
  else if (simtai > 1) dalys.push(`${VIENETAI[simtai]} šimtai`)

  if (likutis >= 10 && likutis <= 19) dalys.push(PAAUGLIAI[likutis - 10])
  else {
    if (likutis >= 20) dalys.push(DESIMTYS[Math.floor(likutis / 10)])
    if (likutis % 10 > 0) dalys.push(VIENETAI[likutis % 10])
  }
  return dalys.join(' ')
}

/**
 * Skaičius žodžiais — potemėms „Kaip skaityti ir užrašyti skaičius“.
 *
 * Vienetas prie stambaus vardo praleidžiamas: sakoma „tūkstantis“, o ne
 * „vienas tūkstantis“, todėl ir čia rašoma taip pat. Kitos formos parenkamos
 * bendrąja derinimo taisykle: 25 000 — „dvidešimt penki tūkstančiai“,
 * 20 000 — „dvidešimt tūkstančių“.
 */
export function zodziais(n: number): string {
  if (n === 0) return 'nulis'
  const dalys: string[] = []
  let likutis = n

  const milijonai = Math.floor(likutis / 1_000_000)
  likutis %= 1_000_000
  if (milijonai === 1) dalys.push('milijonas')
  else if (milijonai > 1) {
    dalys.push(
      `${iki999(milijonai)} ${derink(milijonai, {
        vns: 'milijonas',
        dgs: 'milijonai',
        kilm: 'milijonų',
      })}`,
    )
  }

  const tukstanciai = Math.floor(likutis / 1000)
  likutis %= 1000
  if (tukstanciai === 1) dalys.push('tūkstantis')
  else if (tukstanciai > 1) {
    dalys.push(
      `${iki999(tukstanciai)} ${derink(tukstanciai, {
        vns: 'tūkstantis',
        dgs: 'tūkstančiai',
        kilm: 'tūkstančių',
      })}`,
    )
  }

  if (likutis > 0) dalys.push(iki999(likutis))
  return dalys.join(' ')
}

/** Vardai tekstiniams uždaviniams. */
export const VARDAI = [
  'Ugnė',
  'Matas',
  'Gabija',
  'Dominykas',
  'Emilija',
  'Nojus',
  'Kamilė',
  'Jokūbas',
  'Austėja',
  'Tadas',
] as const

/** Miestai duomenų uždaviniams. */
export const MIESTAI = [
  'Kaunas',
  'Klaipėda',
  'Šiauliai',
  'Panevėžys',
  'Alytus',
  'Marijampolė',
  'Utena',
  'Telšiai',
] as const
