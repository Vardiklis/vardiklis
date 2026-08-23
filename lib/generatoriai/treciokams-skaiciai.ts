import { derink } from '../lietuviu'
import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { juostineSchema, stulpeliuVeiksmas } from './pirmoku-vaizdai'
import {
  augantiSeka,
  dviJuostos,
  figuruSeka,
  grupes,
  skaiciuTiese,
  tieseSuSuoliais,
  trupmenosApskritimas,
  trupmenosJuosta,
} from './treciokams-vaizdai'
import type { Figura } from './treciokams-vaizdai'
import type { Generatorius, Sritis, Uzdavinys } from './tipai'

/**
 * 3 klasės 1 tema „Skaičiavimai iki 1000. Paprastosios trupmenos“.
 *
 * Keturiolika potemių rėmėsi bendraisiais generatoriais: `skaiciu-palyginimas`
 * ir `sekos` yra pradinių klasių bendrieji, `sveikieji` — 6 klasės su
 * neigiamais skaičiais, o `dalies-radimas` visoms penkioms trupmenų potemėms
 * duodavo tą patį trupmenos radimą.
 *
 * Šios temos esmė — ne didesni skaičiai, o **būdų įvairovė**: tą patį veiksmą
 * galima atlikti skaidant, stulpeliu, per apvalų skaičių ar šuoliais skaičių
 * tiesėje, o rezultatą — pasitikrinti atvirkštiniu veiksmu. Todėl atskiros
 * potemės skirtos būdams, patogiam skaičiavimui ir patikrinimui.
 */

const VARDAI = ['Matas', 'Ieva', 'Milda', 'Tomas', 'Greta', 'Lukas'] as const

function riba(sritis?: Sritis | null): number {
  return Math.min(sritis?.max ?? 1000, 1000)
}

const ZMONIU = { vns: 'žmogus', dgs: 'žmonės', kilm: 'žmonių' }

// ── 1.1 Ką žinau apie skaičius nuo 0 iki 1000? ──────────────────────────────

const A_SKAICIAI = [
  {
    klausimas: 'Surikiuok nuo mažiausio iki didžiausio: 408, 480, 804, 840.',
    atsakymas: 'a b c d',
    atsakymasRodymui: 'A B C D',
    sprendimas: 'Pirmiausia lyginami šimtai, tada dešimtys.',
  },
] as const

export const skaiciaiIki1000: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSkaicius(sritis), A_SKAICIAI, 'skaiciai-iki-1000')

function kurkSkaicius(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  if (maks < 500) return null
  const s = atsitiktinis(1, 9)
  const d = atsitiktinis(0, 9)
  const v = atsitiktinis(1, 9)
  const n = s * 100 + d * 10 + v
  if (n > maks) return null

  return variacija([
    // 1. Surikiuoti sukeistų skaitmenų skaičius
    () => {
      const a = atsitiktinis(1, 8)
      const b = atsitiktinis(a + 1, 9)
      const keturi = [a * 100 + b * 10, a * 100 + b, b * 100 + a * 10, b * 100 + a]
      if (new Set(keturi).size < 4 || Math.max(...keturi) > maks) return null
      return eiliskumoUzdavinys(naujasId('skaiciai-iki-1000'), 'skaiciai-iki-1000', {
        klausimas: 'Surikiuok skaičius nuo mažiausio iki didžiausio.',
        teisingaEile: [...keturi].sort((x, y) => x - y).map(String),
        sprendimas: 'Pirmiausia lyginami šimtai, tada dešimtys, tada vienetai.',
      })
    },

    // 2. Skyriaus vieneto pridėjimas
    () => {
      // Klausiama tik vieno dalyko — atsakymo laukelis yra vienas. Skyrius
      // parenkamas atsitiktinai, kad nesikartotų vien dešimtys.
      const kuris = pasirink([
        { pav: 'dešimtimi', kiek: 10, skaitmuo: d, vardas: 'dešimčių' },
        { pav: 'šimtu', kiek: 100, skaitmuo: s, vardas: 'šimtų' },
      ])
      if (n + kuris.kiek > maks) return null
      return uzdavinys('skaiciai-iki-1000', {
        klausimas: `Skaičių ${n} padidink viena ${kuris.pav}. Kokį skaičių gavai?`,
        atsakymas: String(n + kuris.kiek),
        atsakymasRodymui: `$${n + kuris.kiek}$`,
        sprendimas: `${kuris.vardas.charAt(0).toUpperCase()}${kuris.vardas.slice(1)} skaitmuo ${
          kuris.skaitmuo
        } padidėja vienetu: $${n} + ${kuris.kiek} = ${n + kuris.kiek}$.`,
      })
    },

    // 3. Neįvardytas taškas skaičių tiesėje
    () => {
      const pradzia = atsitiktinis(2, 8) * 100
      if (pradzia + 100 > maks) return null
      const iesk = pradzia + atsitiktinis(2, 8) * 10
      const zinomas = pradzia + atsitiktinis(1, 3) * 10
      // Kas penkta padala pasirašyta, tad ties 50 stovintis taškas turėtų savo
      // reikšmę po savimi — ieškoti nebeliktų ko.
      if (zinomas === iesk || iesk % 50 === 0) return null
      return uzdavinys('skaiciai-iki-1000', {
        klausimas: 'Kokį skaičių žymi taškas be raidės?',
        atsakymas: String(iesk),
        atsakymasRodymui: `$${iesk}$`,
        sprendimas: `Padalos eina kas 10, tad taškas stovi ties ${iesk}.`,
        brezinys: skaiciuTiese(
          pradzia,
          pradzia + 100,
          10,
          [
            { reiksme: zinomas, raide: 'A' },
            { reiksme: iesk },
          ],
          5,
        ),
      })
    },

    // 4. Palyginimo ženklas
    () => {
      const x = s * 100 + d * 10 + v
      const y = s * 100 + v * 10 + d
      if (x === y || y > maks) return null
      return pasirinkimoUzdavinys(naujasId('skaiciai-iki-1000'), 'skaiciai-iki-1000', {
        klausimas: `Įrašyk tinkamą ženklą: $${x} \\;\\square\\; ${y}$`,
        variantai: ['<', '>', '='],
        teisingas: x < y ? 0 : 1,
        sprendimas: `Šimtai vienodi, tad lyginame dešimtis: ${Math.floor((x % 100) / 10)} ir ${Math.floor((y % 100) / 10)}.`,
      })
    },

    // 5. Skaičius iš skyrių ir gretimi dešimtukai
    () => {
      if (v === 0) return null
      const zemesnis = n - v
      return uzdavinys('skaiciai-iki-1000', {
        klausimas: `Užrašyk skaičių iš ${s} šimtų, ${d} dešimčių ir ${v} vienetų. Koks artimiausias už jį mažesnis dešimtukas?`,
        atsakymas: String(zemesnis),
        atsakymasRodymui: `$${zemesnis}$`,
        sprendimas: `Skaičius yra ${n}, o artimiausias mažesnis dešimtukas — ${zemesnis}.`,
      })
    },

    // 6. Skaičius pagal sąlygas
    () => {
      const simtai = atsitiktinis(3, 9)
      const desimtys = simtai - 2
      const vienetai = atsitiktinis(1, 9)
      if (desimtys < 0) return null
      const rez = simtai * 100 + desimtys * 10 + vienetai
      if (rez > maks) return null
      return uzdavinys('skaiciai-iki-1000', {
        klausimas: `Skaičius turi ${simtai} šimtus, dešimčių skaitmuo yra 2 mažesnis už šimtų skaitmenį, o vienetų skaitmuo yra ${vienetai}. Koks tai skaičius?`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Dešimčių skaitmuo: $${simtai} - 2 = ${desimtys}$, tad skaičius yra ${rez}.`,
      })
    },

    // 7. Skaičiai tarp dviejų ribų
    () => {
      const apacia = atsitiktinis(2, 8) * 100 + 90
      const virsus = apacia + 20
      if (virsus > maks) return null
      const tinka = [apacia + 4, apacia + 12]
      const netinka = [apacia - 9, virsus + 10]
      const visi = sumaisyk([...tinka, ...netinka])
      return uzdavinys('skaiciai-iki-1000', {
        klausimas: `Iš skaičių ${visi.join(', ')} rask mažiausią, kuris yra didesnis už ${apacia} ir mažesnis už ${virsus}.`,
        atsakymas: String(Math.min(...tinka)),
        atsakymasRodymui: `$${Math.min(...tinka)}$`,
        sprendimas: `Tarp ${apacia} ir ${virsus} patenka ${tinka.join(' ir ')}; mažesnis iš jų — ${Math.min(...tinka)}.`,
      })
    },
  ])
}

// ── 1.2 Kokios būna sekos? ──────────────────────────────────────────────────

const A_SEKOS = [
  {
    klausimas: 'Tęsk seką: 125, 175, 225, $\\square$.',
    atsakymas: '275',
    atsakymasRodymui: '$275$',
    sprendimas: 'Kiekvienas kitas narys 50 didesnis.',
  },
] as const

export const sekos3: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSekas(sritis), A_SEKOS, 'sekos-3')

function kurkSekas(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)

  return variacija([
    // 1. Didėjanti seka su pastoviu skirtumu
    () => {
      const zingsnis = pasirink([25, 40, 50, 80])
      const pradzia = atsitiktinis(1, 8) * 25
      const nariai = [0, 1, 2].map((i) => pradzia + i * zingsnis)
      const kitas = pradzia + 3 * zingsnis
      if (kitas > maks) return null
      return uzdavinys('sekos-3', {
        klausimas: `Tęsk seką: ${nariai.join(', ')}, $\\square$. Kokia taisyklė?`,
        atsakymas: String(kitas),
        atsakymasRodymui: `$${kitas}$`,
        sprendimas: `Kiekvienas kitas narys ${zingsnis} didesnis: $${nariai[2]} + ${zingsnis} = ${kitas}$.`,
      })
    },

    // 2. Mažėjanti seka su trūkstamu nariu viduryje
    () => {
      const zingsnis = pasirink([40, 50, 80])
      const pradzia = atsitiktinis(7, 9) * 100
      const nariai = [0, 1, 2, 3].map((i) => pradzia - i * zingsnis)
      if (nariai.some((x) => x < 0) || pradzia > maks) return null
      return uzdavinys('sekos-3', {
        klausimas: `Rask trūkstamą narį: ${nariai[0]}, ${nariai[1]}, $\\square$, ${nariai[3]}.`,
        atsakymas: String(nariai[2]),
        atsakymasRodymui: `$${nariai[2]}$`,
        sprendimas: `Seka mažėja po ${zingsnis}: $${nariai[1]} - ${zingsnis} = ${nariai[2]}$.`,
      })
    },

    // 3. Pakaitinė taisyklė
    () => {
      const a = pasirink([40, 50])
      const b = pasirink([20, 30])
      if (a === b) return null
      const pradzia = atsitiktinis(2, 4) * 100
      const nariai = [pradzia]
      for (let i = 0; i < 4; i += 1) nariai.push(nariai[i] + (i % 2 === 0 ? a : b))
      const kitas = nariai[4] + a
      if (kitas > maks) return null
      return uzdavinys('sekos-3', {
        // Taisyklė neįvardijama: pastebėti, kad pridedama pakaitomis, ir yra
        // visas uždavinys.
        klausimas: `Seka: ${nariai.join(', ')}. Koks kitas narys?`,
        atsakymas: String(kitas),
        atsakymasRodymui: `$${kitas}$`,
        sprendimas: `Po pridėto ${b} vėl pridedamas ${a}: $${nariai[4]} + ${a} = ${kitas}$.`,
      })
    },

    // 4. Klaidos radimas
    () => {
      const zingsnis = pasirink([50, 60])
      const pradzia = atsitiktinis(1, 5) * 100 + 45
      const nariai = [0, 1, 2, 3, 4].map((i) => pradzia + i * zingsnis)
      if (nariai[4] > maks) return null
      const blogas = nariai[3] + 10
      const rodomi = [...nariai]
      rodomi[3] = blogas
      return uzdavinys('sekos-3', {
        klausimas: `Taisyklė — kiekvieną kartą pridėti tiek pat. Kuris sekos narys netinka: ${rodomi.join(', ')}?`,
        atsakymas: String(blogas),
        atsakymasRodymui: `$${blogas}$`,
        sprendimas: `Seka turi didėti po ${zingsnis}, tad ketvirtoje vietoje turėtų būti ${nariai[3]}, o ne ${blogas}.`,
      })
    },

    // 5. Vaizdinė figūrų seka
    () => {
      const VARDAI: Record<Figura, string> = {
        trikampis: 'trikampis',
        kvadratas: 'kvadratas',
        apskritimas: 'apskritimas',
      }
      const grupe = sumaisyk<Figura>(['trikampis', 'kvadratas', 'apskritimas']).slice(
        0,
        atsitiktinis(2, 3),
      )
      // Rodoma tiek narių, kad grupė pasikartotų bent du kartus ir taisyklė
      // būtų įžvelgiama, bet paskutinė grupė nutrūktų.
      const rodoma = grupe.length * 2 + atsitiktinis(1, grupe.length - 1)
      const eile = Array.from({ length: rodoma }, (_, i) => grupe[i % grupe.length])
      const kita = grupe[rodoma % grupe.length]
      // Kai kartojasi tik dvi figūros, trečiajam variantui paimama likusioji —
      // kitaip liktų per mažai atsakymų.
      const blogas = (['trikampis', 'kvadratas', 'apskritimas'] as const).filter((f) => f !== kita)
      return pasirinkimoUzdavinys(naujasId('sekos-3'), 'sekos-3', {
        klausimas: 'Kuri figūra turi būti pirmoje tuščioje vietoje?',
        variantai: [VARDAI[kita], ...blogas.map((f) => VARDAI[f])],
        teisingas: 0,
        sprendimas: `Kartojasi ${grupe.length} figūrų grupė, tad toliau eina ${VARDAI[kita]}.`,
        brezinys: figuruSeka(eile, 2),
      })
    },

    // 6. Daugybos lentelės seka
    () => {
      const daugiklis = atsitiktinis(6, 9)
      const nariai = [2, 3, 4, 5].map((i) => i * daugiklis)
      const kitas = 6 * daugiklis
      return uzdavinys('sekos-3', {
        klausimas: `Įrašyk trūkstamą narį: ${nariai.join(', ')}, $\\square$. Kuris daugybos lentelės skaičius sieja visus narius?`,
        atsakymas: String(kitas),
        atsakymasRodymui: `$${kitas}$`,
        sprendimas: `Visi nariai dalijasi iš ${daugiklis}, o kitas yra $6 \\cdot ${daugiklis} = ${kitas}$.`,
      })
    },

    // 7. Auganti vaizdinė seka
    () => {
      const pirmas = atsitiktinis(1, 3)
      const zingsnis = atsitiktinis(2, 3)
      const klausiama = atsitiktinis(6, 9)
      const kiek = pirmas + (klausiama - 1) * zingsnis
      return uzdavinys('sekos-3', {
        // Piešinyje — tik keturi pirmieji bokšteliai, tad klausiamojo suskaičiuoti
        // negalima: reikia rasti taisyklę.
        klausimas: `Kubelių bokšteliai statomi pagal taisyklę. Kiek kubelių bus ${klausiama}-ajame bokštelyje?`,
        atsakymas: String(kiek),
        atsakymasRodymui: `$${kiek}$`,
        sprendimas: `Kiekvienas kitas bokštelis ${zingsnis} kubeliais aukštesnis: $${pirmas} + ${klausiama - 1} \\cdot ${zingsnis} = ${kiek}$.`,
        brezinys: augantiSeka([0, 1, 2, 3].map((i) => pirmas + i * zingsnis)),
      })
    },
  ])
}

// ── 1.3 ir 1.4 Sudėties ir atimties būdai ───────────────────────────────────

/** Pora sudėčiai su peržengimu — kad būdų palyginimas turėtų prasmę. */
function sudetiesPora(maks: number): { a: number; b: number } | null {
  const a = atsitiktinis(150, Math.min(600, maks - 200))
  const b = atsitiktinis(120, Math.min(400, maks - a))
  if (a % 100 === 0 || b % 100 === 0) return null
  return { a, b }
}

const A_SUDETIS = [
  {
    klausimas: 'Apskaičiuok: $356 + 227$',
    atsakymas: '583',
    atsakymasRodymui: '$583$',
    sprendimas: 'Šimtai: $300 + 200 = 500$. Dešimtys ir vienetai: $56 + 27 = 83$.',
  },
] as const

export const sudetiesBudai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkSudetiesBudus(sritis), A_SUDETIS, 'sudeties-budai-1000')

function kurkSudetiesBudus(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const pora = sudetiesPora(maks)
  if (!pora) return null
  const { a, b } = pora
  const suma = a + b
  const bS = Math.floor(b / 100) * 100
  const bD = b - bS

  return variacija([
    // 1. Skaidant antrą dėmenį
    () =>
      uzdavinys('sudeties-budai-1000', {
        klausimas: `Apskaičiuok $${a} + ${b}$ išskaidydamas antrą dėmenį į šimtus ir likutį.`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${a} + ${bS} = ${a + bS}$, tada $${a + bS} + ${bD} = ${suma}$.`,
      }),

    // 2. Stulpeliu
    () =>
      uzdavinys('sudeties-budai-1000', {
        klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Sudedami skyriai iš dešinės: $${a} + ${b} = ${suma}$.`,
        brezinys: stulpeliuVeiksmas(a, b, '+'),
      }),

    // 3. Šuoliai skaičių tiesėje
    () => {
      const zingsniai = [100, 100, bD]
      const pradzia = a
      const galas = pradzia + 200 + bD
      if (galas > maks) return null
      const nuo = Math.floor((pradzia - 50) / 100) * 100
      const iki = Math.ceil((galas + 50) / 100) * 100
      return uzdavinys('sudeties-budai-1000', {
        klausimas: 'Kokį sudėties veiksmą vaizduoja šuoliai? Apskaičiuok rezultatą.',
        atsakymas: String(galas),
        atsakymasRodymui: `$${galas}$`,
        sprendimas: `Nuo ${pradzia} pridedama $100 + 100 + ${bD} = ${200 + bD}$, tad gaunama ${galas}.`,
        brezinys: tieseSuSuoliais(nuo, iki, 10, pradzia, zingsniai),
      })
    },

    // 4. Trūkstamas dėmuo
    () =>
      uzdavinys('sudeties-budai-1000', {
        klausimas: `Užpildyk trūkstamą skaičių: $${a} + \\square = ${suma}$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Iš sumos atimame žinomą dėmenį: $${suma} - ${a} = ${b}$.`,
      }),

    // 5. Trečias skaičius iš sumos
    () => {
      const visa = 900
      const c = visa - a - b
      if (c < 10 || visa > maks) return null
      return uzdavinys('sudeties-budai-1000', {
        klausimas: `Trijų skaičių suma yra ${visa}. Du iš jų yra ${a} ir ${b}. Rask trečią skaičių.`,
        atsakymas: String(c),
        atsakymasRodymui: `$${c}$`,
        sprendimas: `$${a} + ${b} = ${suma}$, tada $${visa} - ${suma} = ${c}$.`,
      })
    },

    // 6. Klaidos radimas
    () => {
      const klaida = suma - 100
      if (klaida < 0) return null
      return pasirinkimoUzdavinys(naujasId('sudeties-budai-1000'), 'sudeties-budai-1000', {
        klausimas: `Sprendime $${a} + ${b} = ${klaida}$ yra klaida. Kuriame skyriuje suklysta?`,
        variantai: ['šimtų', 'vienetų', 'klaidos nėra'],
        teisingas: 0,
        sprendimas: `Teisingai yra ${suma} — pamirštas iš dešimčių susidaręs šimtas.`,
      })
    },

    // 7. Patogiausia trijų skaičių tvarka
    () => {
      const x = atsitiktinis(120, 260)
      const y = 300 - (x % 100)
      const z = atsitiktinis(100, 200)
      if (x + y + z > maks) return null
      return uzdavinys('sudeties-budai-1000', {
        klausimas: `Pasirink patogiausią tvarką ir apskaičiuok: $${x} + ${z} + ${y}$`,
        atsakymas: String(x + y + z),
        atsakymasRodymui: `$${x + y + z}$`,
        sprendimas: `Patogiau pirma sudėti ${x} ir ${y}, nes gaunamas apvalus $${x + y}$, tada pridėti ${z}.`,
      })
    },
  ])
}

const A_ATIMTIS = [
  {
    klausimas: 'Apskaičiuok: $724 - 356$',
    atsakymas: '368',
    atsakymasRodymui: '$368$',
    sprendimas: '$724 - 300 = 424$, tada $424 - 56 = 368$.',
  },
] as const

export const atimtiesBudai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkAtimtiesBudus(sritis), A_ATIMTIS, 'atimties-budai-1000')

function kurkAtimtiesBudus(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(500, maks)
  const b = atsitiktinis(150, a - 100)
  if (b % 100 === 0) return null
  const sk = a - b
  const bS = Math.floor(b / 100) * 100
  const bD = b - bS

  return variacija([
    // 1. Skaidant atėminį
    () =>
      uzdavinys('atimties-budai-1000', {
        klausimas: `Apskaičiuok $${a} - ${b}$ išskaidydamas atėminį į šimtus ir likutį.`,
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `$${a} - ${bS} = ${a - bS}$, tada $${a - bS} - ${bD} = ${sk}$.`,
      }),

    // 2. Stulpeliu
    () =>
      uzdavinys('atimties-budai-1000', {
        klausimas: 'Apskaičiuok stulpeliu. Koks atsakymas?',
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `Atimami skyriai iš dešinės: $${a} - ${b} = ${sk}$.`,
        brezinys: stulpeliuVeiksmas(a, b, '−'),
      }),

    // 3. Šuoliai atgal
    () => {
      const zingsniai = [-bS, -bD]
      const nuo = Math.floor((sk - 50) / 100) * 100
      const iki = Math.ceil((a + 50) / 100) * 100
      if (nuo < 0 || iki > maks + 100) return null
      return uzdavinys('atimties-budai-1000', {
        klausimas: 'Kokį atimties veiksmą vaizduoja šuoliai? Apskaičiuok rezultatą.',
        atsakymas: String(sk),
        atsakymasRodymui: `$${sk}$`,
        sprendimas: `Nuo ${a} atimama $${bS} + ${bD} = ${b}$, tad gaunama ${sk}.`,
        brezinys: tieseSuSuoliais(nuo, iki, 10, a, zingsniai),
      })
    },

    // 4. Trūkstamas atėminys
    () =>
      uzdavinys('atimties-budai-1000', {
        klausimas: `Užpildyk: $${a} - \\square = ${sk}$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Iš turinio atimame skirtumą: $${a} - ${sk} = ${b}$.`,
      }),

    // 5. Rasti turinį
    () =>
      uzdavinys('atimties-budai-1000', {
        klausimas: `Skirtumas yra ${sk}, o atėminys ${b}. Rask turinį ir patikrink atsakymą.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$${sk} + ${b} = ${a}$. Patikrinimas: $${a} - ${b} = ${sk}$.`,
      }),

    // 6. Pradinis skaičius
    () =>
      uzdavinys('atimties-budai-1000', {
        klausimas: `Skaičius sumažintas ${b} ir gauta ${sk}. Koks buvo pradinis skaičius?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `Atvirkštinis veiksmas: $${sk} + ${b} = ${a}$.`,
      }),

    // 7. Klaidos radimas
    () => {
      const klaida = sk + 100
      if (klaida > maks) return null
      // Paaiškinimas remiasi pamirštu išardytu šimtu, tad tas šimtas iš tikrųjų
      // turi būti ardomas: be to $986 - 516$ atimama be jokio skolinimosi.
      if (a % 100 >= b % 100) return null
      return pasirinkimoUzdavinys(naujasId('atimties-budai-1000'), 'atimties-budai-1000', {
        klausimas: `Sprendime $${a} - ${b} = ${klaida}$ yra klaida. Kur suklysta?`,
        variantai: [
          'pamiršta, kad buvo išardytas šimtas',
          'sumaišyti vienetų skaitmenys',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Teisingas atsakymas yra ${sk}.`,
      })
    },
  ])
}

// ── 1.5 Kaip lengviau sudėti ir atimti? ─────────────────────────────────────

const A_PATOGU = [
  {
    klausimas: 'Apskaičiuok patogiai: $198 + 305$',
    atsakymas: '503',
    atsakymasRodymui: '$503$',
    sprendimas: '$198$ pakeičiame $200$: $200 + 305 = 505$, tada atimame 2.',
  },
] as const

export const patogusSkaiciavimas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkPatogu(sritis), A_PATOGU, 'patogus-skaiciavimas')

function kurkPatogu(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const apvalus = atsitiktinis(2, 5) * 100
  const truksta = pasirink([1, 2, 3])
  const beveik = apvalus - truksta
  const kitas = atsitiktinis(120, 350)

  return variacija([
    // 1. Sudėtis per apvalų skaičių
    () => {
      if (beveik + kitas > maks) return null
      return uzdavinys('patogus-skaiciavimas', {
        klausimas: `Apskaičiuok patogiai: $${beveik} + ${kitas}$`,
        atsakymas: String(beveik + kitas),
        atsakymasRodymui: `$${beveik + kitas}$`,
        sprendimas: `${beveik} yra arti ${apvalus}: $${apvalus} + ${kitas} = ${apvalus + kitas}$, tada atimame ${truksta}.`,
      })
    },

    // 2. Atimtis per apvalų skaičių
    () => {
      const turinys = atsitiktinis(apvalus + 200, maks)
      return uzdavinys('patogus-skaiciavimas', {
        klausimas: `Apskaičiuok patogiai: $${turinys} - ${beveik}$`,
        atsakymas: String(turinys - beveik),
        atsakymasRodymui: `$${turinys - beveik}$`,
        sprendimas: `Atimame ${apvalus}: $${turinys} - ${apvalus} = ${turinys - apvalus}$, tada pridedame ${truksta}.`,
      })
    },

    // 3. Patogus grupavimas
    () => {
      const x = atsitiktinis(1, 4) * 125
      const y = 500 - x
      const z = atsitiktinis(20, 90)
      if (x + y + z > maks || y <= 0) return null
      return uzdavinys('patogus-skaiciavimas', {
        klausimas: `Pasirink patogesnį grupavimą ir apskaičiuok: $${x} + ${z} + ${y}$`,
        atsakymas: String(x + y + z),
        atsakymasRodymui: `$${x + y + z}$`,
        sprendimas: `${x} ir ${y} kartu duoda apvalų ${x + y}, tad juos sudedame pirmiausia, o paskui pridedame ${z}.`,
      })
    },

    // 4. Kelių veiksmų sutrumpinimas
    () => {
      const b = atsitiktinis(150, 300)
      if (beveik + b + truksta > maks) return null
      return uzdavinys('patogus-skaiciavimas', {
        klausimas: `Apskaičiuok kuo trumpiau: $${beveik} + ${b} + ${truksta}$`,
        atsakymas: String(beveik + b + truksta),
        atsakymasRodymui: `$${beveik + b + truksta}$`,
        sprendimas: `Pirmiausia sujungiame ${beveik} ir ${truksta} — gaunamas apvalus ${apvalus}, tada $${apvalus} + ${b} = ${beveik + b + truksta}$.`,
      })
    },

    // 5. Atimtis dviem žingsniais
    () => {
      const turinys = atsitiktinis(700, maks)
      if (turinys - beveik - truksta < 0) return null
      return uzdavinys('patogus-skaiciavimas', {
        klausimas: `Apskaičiuok patogiai: $${turinys} - ${beveik} - ${truksta}$`,
        atsakymas: String(turinys - beveik - truksta),
        atsakymasRodymui: `$${turinys - beveik - truksta}$`,
        sprendimas: `${beveik} ir ${truksta} kartu sudaro ${apvalus}, tad iš karto atimame ${apvalus}.`,
      })
    },

    // 6. Kuris būdas patogesnis
    () =>
      pasirinkimoUzdavinys(naujasId('patogus-skaiciavimas'), 'patogus-skaiciavimas', {
        klausimas: `Kaip patogiausia apskaičiuoti $${beveik} + ${kitas}$?`,
        variantai: [
          `pridėti ${apvalus} ir atimti ${truksta}`,
          `sudėti stulpeliu iš dešinės`,
          `pridėti ${kitas} po vieną`,
        ],
        teisingas: 0,
        sprendimas: `${beveik} yra tik ${truksta} mažesnis už apvalų ${apvalus}, tad veiksmas tampa lengvas.`,
      }),

    // 7. Atimtis ir sudėtis su tuo pačiu skaičiumi
    () => {
      const c = atsitiktinis(50, 99)
      const turinys = atsitiktinis(600, maks)
      if (turinys - beveik + c > maks) return null
      return uzdavinys('patogus-skaiciavimas', {
        klausimas: `Rask patogiausią būdą apskaičiuoti: $${turinys} - ${beveik} + ${c}$`,
        atsakymas: String(turinys - beveik + c),
        atsakymasRodymui: `$${turinys - beveik + c}$`,
        sprendimas: `Pirma $${turinys} - ${apvalus} = ${turinys - apvalus}$, pridedame ${truksta} ir gauname ${turinys - beveik}, tada $+ ${c}$.`,
      })
    },
  ])
}

// ── 1.6 Kaip pasitikrinti skaičiavimų rezultatus? ───────────────────────────

const A_PATIKRA = [
  {
    klausimas: 'Patikrink atimtimi: $426 + 358 = 784$. Koks patikrinimo veiksmas?',
    atsakymas: 'a',
    atsakymasRodymui: 'A — $784 - 358$',
    sprendimas: 'Iš sumos atėmus vieną dėmenį turi gautis kitas.',
  },
] as const

export const patikrinimas: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkPatikra(sritis), A_PATIKRA, 'patikrinimas')

function kurkPatikra(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(200, 500)
  const b = atsitiktinis(150, Math.min(400, maks - a))
  const suma = a + b
  const v = pasirink(VARDAI)

  return variacija([
    // 1. Kuriuo veiksmu tikrinti sudėtį
    () =>
      pasirinkimoUzdavinys(naujasId('patikrinimas'), 'patikrinimas', {
        klausimas: `${v} apskaičiavo $${a} + ${b} = ${suma}$. Kuriuo veiksmu patikrinsi?`,
        variantai: [`$${suma} - ${b}$`, `$${suma} + ${b}$`, `$${a} - ${b}$`],
        teisingas: 0,
        sprendimas: `Iš sumos atėmus vieną dėmenį turi gautis kitas: $${suma} - ${b} = ${a}$.`,
      }),

    // 2. Patikrinti atimtį sudėtimi
    () =>
      uzdavinys('patikrinimas', {
        klausimas: `${v} apskaičiavo $${suma} - ${a} = ${b}$. Kiek gausi patikrindamas sudėtimi $${b} + ${a}$?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Patikrinimas turi grąžinti turinį: $${b} + ${a} = ${suma}$.`,
      }),

    // 3. Kuris iš dviejų atsakymų teisingas
    () => {
      const klaidingas = suma - 10
      return pasirinkimoUzdavinys(naujasId('patikrinimas'), 'patikrinimas', {
        klausimas: `Du mokiniai apskaičiavo $${a} + ${b}$. Vienas gavo ${suma}, kitas ${klaidingas}. Kuris atsakymas teisingas?`,
        variantai: [String(suma), String(klaidingas), 'abu neteisingi'],
        teisingas: 0,
        sprendimas: `Patikrinimas: $${suma} - ${b} = ${a}$ ✓, o $${klaidingas} - ${b} = ${klaidingas - b}$ — ne ${a}.`,
      })
    },

    // 4. Ar mokinys teisus
    () => {
      const teisingas = suma
      const mokinio = atsitiktinis(0, 1) === 1 ? teisingas : teisingas + 10
      return pasirinkimoUzdavinys(naujasId('patikrinimas'), 'patikrinimas', {
        klausimas: `Veiksme $\\square - ${b} = ${a}$ mokinys įrašė ${mokinio}. Ar jis teisus?`,
        variantai:
          mokinio === teisingas
            ? ['taip, teisus', 'ne, turi būti kitas skaičius', 'negalima patikrinti']
            : ['ne, turi būti kitas skaičius', 'taip, teisus', 'negalima patikrinti'],
        teisingas: 0,
        sprendimas: `Patikrinimas: $${a} + ${b} = ${teisingas}$.`,
      })
    },

    // 5. Rasti neteisingą lygybę
    () => {
      const c = atsitiktinis(200, 400)
      const d = atsitiktinis(100, c - 50)
      const bloga = `$${c} - ${d} = ${c - d + 10}$`
      return pasirinkimoUzdavinys(naujasId('patikrinimas'), 'patikrinimas', {
        klausimas: 'Kuri lygybė neteisinga?',
        variantai: [bloga, `$${a} + ${b} = ${suma}$`, `$${suma} - ${a} = ${b}$`],
        teisingas: 0,
        sprendimas: `Teisingai yra $${c} - ${d} = ${c - d}$.`,
      })
    },

    // 6. Patikrinimo veiksmo rezultatas
    () =>
      uzdavinys('patikrinimas', {
        klausimas: `Patikrink veiksmą $${a} + ${b} = ${suma}$ atlikdamas atvirkštinį veiksmą $${suma} - ${a}$. Ką gausi?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Turi gautis antrasis dėmuo: $${suma} - ${a} = ${b}$.`,
      }),

    // 7. Klaidos radimas ir taisymas
    () => {
      const klaida = suma + 90
      if (klaida > maks) return null
      return uzdavinys('patikrinimas', {
        klausimas: `Rask klaidą ir parašyk teisingą atsakymą: $${a} + ${b} = ${klaida}$`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `Patikrinus atimtimi: $${klaida} - ${b} = ${klaida - b}$, o turėtų būti ${a}. Teisingas atsakymas — ${suma}.`,
      })
    },
  ])
}

// ── 1.7 Kada reikalinga daugyba arba dalyba? ────────────────────────────────

const A_KADA = [
  {
    klausimas: '6 dėžutėse yra po 8 pieštukus. Kiek pieštukų iš viso?',
    atsakymas: '48',
    atsakymasRodymui: '$48$',
    sprendimas: 'Vienodos grupės sudedamos daugyba: $6 \\cdot 8 = 48$.',
  },
] as const

export const daugybaArDalyba: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkKada(sritis), A_KADA, 'daugyba-ar-dalyba')

function kurkKada(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const grupiu = atsitiktinis(4, 9)
  const kiekvienoje = atsitiktinis(4, 9)
  const sand = grupiu * kiekvienoje
  if (sand > maks) return null

  return variacija([
    // 1. Kiek iš viso
    () =>
      uzdavinys('daugyba-ar-dalyba', {
        // Skaičiai tekste neįvardijami — juos reikia nuskaityti iš brėžinio.
        klausimas: 'Kiekvienoje dėžutėje pieštukų yra po lygiai. Kiek pieštukų iš viso?',
        atsakymas: String(sand),
        atsakymasRodymui: `$${sand}$`,
        sprendimas: `Vienodos grupės sudedamos daugyba: $${grupiu} \\cdot ${kiekvienoje} = ${sand}$.`,
        brezinys: grupes(grupiu, kiekvienoje),
      }),

    // 2. Kiek gaus kiekvienas
    () =>
      uzdavinys('daugyba-ar-dalyba', {
        klausimas: `${grupiu} vaikams po lygiai padalyta ${sand} sausainių. Kiek gaus kiekvienas?`,
        atsakymas: String(kiekvienoje),
        atsakymasRodymui: `$${kiekvienoje}$`,
        sprendimas: `Dalijant po lygiai: $${sand} : ${grupiu} = ${kiekvienoje}$.`,
      }),

    // 3. Kuris veiksmas tinka
    () =>
      pasirinkimoUzdavinys(naujasId('daugyba-ar-dalyba'), 'daugyba-ar-dalyba', {
        klausimas: `${grupiu} eilėse yra po ${kiekvienoje} kėdes. Kuris veiksmas tinka?`,
        variantai: [
          `$${grupiu} \\cdot ${kiekvienoje}$`,
          `$${grupiu} + ${kiekvienoje}$`,
          `$${sand} : ${grupiu}$`,
        ],
        teisingas: 0,
        sprendimas: 'Kai grupės vienodos ir ieškoma visumos, naudojama daugyba.',
      }),

    // 4. Iš paveikslėlio — kiek būtų kitokiame grupių skaičiuje
    () => {
      // Klausiama apie daugiau grupių, negu nupiešta: iš piešinio nuskaitoma,
      // po kiek yra vienoje grupėje, o toliau reikia dauginti.
      const naujuGrupiu = grupiu + atsitiktinis(2, 4)
      if (naujuGrupiu * kiekvienoje > maks) return null
      return uzdavinys('daugyba-ar-dalyba', {
        klausimas: `Kamuoliukai sudėti į vienodas grupes. Kiek kamuoliukų būtų ${naujuGrupiu} tokiose pačiose grupėse?`,
        atsakymas: String(naujuGrupiu * kiekvienoje),
        atsakymasRodymui: `$${naujuGrupiu * kiekvienoje}$`,
        sprendimas: `Vienoje grupėje ${kiekvienoje} kamuoliukai, tad $${naujuGrupiu} \\cdot ${kiekvienoje} = ${
          naujuGrupiu * kiekvienoje
        }$.`,
        brezinys: grupes(grupiu, kiekvienoje),
      })
    },

    // 5. Du žingsniai: daugyba ir dalyba
    () => {
      const nauja = pasirink([2, 3, 4])
      if (sand % nauja !== 0) return null
      return uzdavinys('daugyba-ar-dalyba', {
        klausimas: `${grupiu} eilėse yra po ${kiekvienoje} kėdes. Po renginio visas kėdes sudėjo po ${nauja} į krūvelę. Kiek krūvelių susidarė?`,
        atsakymas: String(sand / nauja),
        atsakymasRodymui: `$${sand / nauja}$`,
        sprendimas: `$${grupiu} \\cdot ${kiekvienoje} = ${sand}$, tada $${sand} : ${nauja} = ${sand / nauja}$.`,
      })
    },

    // 6. Dalyba ir atimtis
    () => {
      const atidave = atsitiktinis(1, 3)
      if (kiekvienoje - atidave < 1) return null
      return uzdavinys('daugyba-ar-dalyba', {
        klausimas: `${grupiu} vaikams po lygiai padalyta ${sand} lipdukų. Paskui kiekvienas atidavė po ${atidave} ${
          atidave === 1 ? 'lipduką' : 'lipdukus'
        }. Kiek lipdukų liko vaikams iš viso?`,
        atsakymas: String(sand - grupiu * atidave),
        atsakymasRodymui: `$${sand - grupiu * atidave}$`,
        sprendimas: `Kiekvienam teko $${sand} : ${grupiu} = ${kiekvienoje}$, liko po ${kiekvienoje - atidave}: $${grupiu} \\cdot ${kiekvienoje - atidave} = ${sand - grupiu * atidave}$.`,
      })
    },

    // 7. Du skirstymo būdai
    () => {
      const a = atsitiktinis(6, 8)
      const b = a + 1
      const visa = a * b
      if (visa > maks) return null
      return uzdavinys('daugyba-ar-dalyba', {
        klausimas: `Yra ${visa} pieštukai. Juos galima sudėti po ${a} arba po ${b}. Kuriuo atveju susidarys daugiau grupių? Parašyk grupių skaičių.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Po ${a}: $${visa} : ${a} = ${b}$ grupės. Po ${b}: $${visa} : ${b} = ${a}$ grupės. Daugiau grupių — ${b}.`,
      })
    },
  ])
}

// ── 1.8 Kaip moku daugybos lentelę? ─────────────────────────────────────────

const A_LENTELE = [
  {
    klausimas: 'Apskaičiuok: $81 : 9$',
    atsakymas: '9',
    atsakymasRodymui: '$9$',
    sprendimas: '$9 \\cdot 9 = 81$.',
  },
] as const

export const daugybosLentele3: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkLentele3(sritis), A_LENTELE, 'daugybos-lentele-3')

function kurkLentele3(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(6, 9)
  const b = atsitiktinis(4, 9)
  const sand = a * b

  return variacija([
    // 1. Trūkstamas daugiklis
    () =>
      uzdavinys('daugybos-lentele-3', {
        klausimas: `Užpildyk: $${a} \\cdot \\square = ${sand}$`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `$${sand} : ${a} = ${b}$.`,
      }),

    // 2. Dalyba
    () =>
      uzdavinys('daugybos-lentele-3', {
        klausimas: `Apskaičiuok: $${sand} : ${b}$`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$${a} \\cdot ${b} = ${sand}$, tad dalmuo yra ${a}.`,
      }),

    // 3. Du susiję dalybos veiksmai iš vaizdo
    () =>
      uzdavinys('daugybos-lentele-3', {
        klausimas: 'Kiek taškų yra iš viso? Užrašyk skaičių.',
        atsakymas: String(sand),
        atsakymasRodymui: `$${sand}$`,
        sprendimas: `${a} grupės po ${b}: $${a} \\cdot ${b} = ${sand}$. Su tuo susiję ir $${sand} : ${a} = ${b}$ bei $${sand} : ${b} = ${a}$.`,
        brezinys: grupes(a, b),
      }),

    // 4. Dviejų sandaugų suma
    () => {
      const c = atsitiktinis(4, 7)
      const d = atsitiktinis(4, 6)
      const rez = sand + c * d
      if (rez > maks) return null
      return uzdavinys('daugybos-lentele-3', {
        klausimas: `Apskaičiuok: $${a} \\cdot ${b} + ${c} \\cdot ${d}$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `$${a} \\cdot ${b} = ${sand}$ ir $${c} \\cdot ${d} = ${c * d}$, tad suma yra ${rez}.`,
      })
    },

    // 5. Trijų veiksmų reiškinys
    () => {
      const c = atsitiktinis(4, 8)
      const rez = sand / b + a * c - 7
      if (!Number.isInteger(rez) || rez < 0) return null
      return uzdavinys('daugybos-lentele-3', {
        klausimas: `Apskaičiuok: $${sand} : ${b} + ${a} \\cdot ${c} - 7$`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${rez}$`,
        sprendimas: `Pirma daugyba ir dalyba: $${sand} : ${b} = ${a}$, $${a} \\cdot ${c} = ${a * c}$. Tada $${a} + ${a * c} - 7 = ${rez}$.`,
      })
    },

    // 6. Rasti klaidingą lygybę
    () => {
      const bloga = `$${sand} : ${a} = ${b + 1}$`
      return pasirinkimoUzdavinys(naujasId('daugybos-lentele-3'), 'daugybos-lentele-3', {
        klausimas: 'Kuri lygybė klaidinga?',
        variantai: [bloga, `$${a} \\cdot ${b} = ${sand}$`, `$${sand} : ${b} = ${a}$`],
        teisingas: 0,
        sprendimas: `Teisingai yra $${sand} : ${a} = ${b}$.`,
      })
    },

    // 7. Tas pats skaičius su kitu daugikliu
    () => {
      const kitas = atsitiktinis(4, 9)
      if (kitas === b || a * kitas > maks) return null
      return uzdavinys('daugybos-lentele-3', {
        klausimas: `Skaičius padaugintas iš ${b} ir gauta ${sand}. Kiek gausi tą patį skaičių padauginęs iš ${kitas}?`,
        atsakymas: String(a * kitas),
        atsakymasRodymui: `$${a * kitas}$`,
        sprendimas: `Pradinis skaičius yra $${sand} : ${b} = ${a}$, tad $${a} \\cdot ${kitas} = ${a * kitas}$.`,
      })
    },
  ])
}

// ── 1.9 Tekstiniai uždaviniai su skaičiais iki 1000 ─────────────────────────

const A_TEKST = [
  {
    klausimas: 'Muziejuje ryte apsilankė 268 žmonės, po pietų — 157 daugiau. Kiek žmonių apsilankė po pietų?',
    atsakymas: '425',
    atsakymasRodymui: '$425$',
    sprendimas: '$268 + 157 = 425$.',
  },
] as const

export const tekstiniai1000: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkTekstinius(sritis), A_TEKST, 'tekstiniai-1000')

function kurkTekstinius(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const a = atsitiktinis(150, 400)
  const b = atsitiktinis(80, 200)
  const c = atsitiktinis(50, 150)
  if (a + b > maks) return null

  return variacija([
    // 1. Kiek buvo po pietų
    () =>
      uzdavinys('tekstiniai-1000', {
        klausimas: `Muziejuje ryte apsilankė ${a} ${derink(a, ZMONIU)}, po pietų — ${b} daugiau. Kiek žmonių apsilankė po pietų?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `$${a} + ${b} = ${a + b}$.`,
      }),

    // 2. Du pokyčiai
    () => {
      const pradzia = atsitiktinis(600, maks)
      if (pradzia - b + c > maks) return null
      return uzdavinys('tekstiniai-1000', {
        klausimas: `Sandėlyje buvo ${pradzia} dėžių. Išvežė ${b}, vėliau atvežė ${c}. Kiek dėžių dabar sandėlyje?`,
        atsakymas: String(pradzia - b + c),
        atsakymasRodymui: `$${pradzia - b + c}$`,
        sprendimas: `$${pradzia} - ${b} = ${pradzia - b}$, tada $${pradzia - b} + ${c} = ${pradzia - b + c}$.`,
      })
    },

    // 3. Abiejų dienų suma
    () => {
      if (a + a + b > maks) return null
      return uzdavinys('tekstiniai-1000', {
        klausimas: `Bibliotekoje pirmadienį apsilankė ${a} ${derink(a, ZMONIU)}, antradienį — ${b} daugiau. Kiek lankytojų buvo per abi dienas?`,
        atsakymas: String(a + a + b),
        atsakymasRodymui: `$${a + a + b}$`,
        sprendimas: `Antradienį: $${a} + ${b} = ${a + b}$. Iš viso: $${a} + ${a + b} = ${a + a + b}$.`,
      })
    },

    // 4. Schema — trūkstama dalis
    () => {
      const visuma = a + a + b
      if (visuma > maks) return null
      return uzdavinys('tekstiniai-1000', {
        // Visi skaičiai — tik schemoje: viršutinė juosta yra visuma, apatinės
        // dvi — jos dalys, o vienos dalies reikšmė uždengta klaustuku.
        klausimas: 'Kokį skaičių žymi klaustukas schemoje?',
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Iš visumos atimame žinomą dalį: $${visuma} - ${a} = ${a + b}$.`,
        brezinys: juostineSchema(visuma, a, null),
      })
    },

    // 5. Trys dienos, viena nežinoma
    () => {
      const visa = atsitiktinis(650, maks)
      const d1 = atsitiktinis(150, 250)
      const d2 = atsitiktinis(150, 250)
      const d3 = visa - d1 - d2
      if (d3 < 50) return null
      return uzdavinys('tekstiniai-1000', {
        klausimas: `Per tris dienas apsilankė ${visa} lankytojai. Pirmadienį — ${d1}, antradienį — ${d2}. Kiek buvo trečiadienį?`,
        atsakymas: String(d3),
        atsakymasRodymui: `$${d3}$`,
        sprendimas: `$${d1} + ${d2} = ${d1 + d2}$, tada $${visa} - ${d1 + d2} = ${d3}$.`,
      })
    },

    // 6. Antra diena mažiau negu pirma
    () => {
      const pradzia = atsitiktinis(700, maks)
      const pirma = atsitiktinis(200, 300)
      const maziau = atsitiktinis(40, 90)
      const antra = pirma - maziau
      if (pradzia - pirma - antra < 0) return null
      return uzdavinys('tekstiniai-1000', {
        klausimas: `Parduotuvė turėjo ${pradzia} sąsiuvinius. Pirmą dieną pardavė ${pirma}, antrą — ${maziau} mažiau negu pirmą. Kiek sąsiuvinių liko?`,
        atsakymas: String(pradzia - pirma - antra),
        atsakymasRodymui: `$${pradzia - pirma - antra}$`,
        sprendimas: `Antrą dieną: $${pirma} - ${maziau} = ${antra}$. Liko: $${pradzia} - ${pirma} - ${antra} = ${pradzia - pirma - antra}$.`,
      })
    },

    // 7. Trys žingsniai su dalyba
    () => {
      const pradzia = atsitiktinis(300, 400)
      const isejo = atsitiktinis(80, 120)
      const atejo = atsitiktinis(30, 60)
      const liko = pradzia - isejo + atejo
      const komandoje = 8
      if (liko % komandoje !== 0) return null
      return uzdavinys('tekstiniai-1000', {
        klausimas: `Šventėje dalyvavo ${pradzia} vaikai. ${isejo} išėjo, vėliau atėjo dar ${atejo}. Likusius suskirstė po ${komandoje} į komandas. Kiek komandų susidarė?`,
        atsakymas: String(liko / komandoje),
        atsakymasRodymui: `$${liko / komandoje}$`,
        sprendimas: `$${pradzia} - ${isejo} + ${atejo} = ${liko}$, tada $${liko} : ${komandoje} = ${liko / komandoje}$.`,
      })
    },

    // 8. Ar užteks autobusų
    () => {
      const mokiniu = atsitiktinis(250, 320)
      const mokytoju = atsitiktinis(15, 30)
      const telpa = 50
      const autobusu = 6
      const visi = mokiniu + mokytoju
      return pasirinkimoUzdavinys(naujasId('tekstiniai-1000'), 'tekstiniai-1000', {
        klausimas: `Kelionėje dalyvauja ${mokiniu} ${derink(mokiniu, {
          vns: 'mokinys',
          dgs: 'mokiniai',
          kilm: 'mokinių',
        })} ir ${mokytoju} ${derink(mokytoju, {
          vns: 'mokytojas',
          dgs: 'mokytojai',
          kilm: 'mokytojų',
        })}. Į vieną autobusą telpa ${telpa} žmonės. Ar užteks ${autobusu} autobusų?`,
        variantai:
          visi <= telpa * autobusu
            ? ['taip, užteks', 'ne, neužteks', 'negalima pasakyti']
            : ['ne, neužteks', 'taip, užteks', 'negalima pasakyti'],
        teisingas: 0,
        sprendimas: `Iš viso ${visi} ${derink(visi, {
          vns: 'žmogus',
          dgs: 'žmonės',
          kilm: 'žmonių',
        })}, o ${autobusu} autobusai talpina $${autobusu} \\cdot ${telpa} = ${autobusu * telpa}$.`,
      })
    },
  ])
}

// ── 1.10 Kas yra paprastoji trupmena? ───────────────────────────────────────

const A_TRUPMENA = [
  {
    klausimas: 'Kokia figūros dalis nuspalvinta? Parašyk skaitiklį.',
    atsakymas: '3',
    atsakymasRodymui: '$3$',
    sprendimas: 'Nuspalvintos 3 dalys iš 8.',
  },
] as const

export const paprastojiTrupmena: Generatorius = () =>
  suBandymais(kurkTrupmena, A_TRUPMENA, 'paprastoji-trupmena')

function kurkTrupmena(): Uzdavinys | null {
  const daliu = pasirink([4, 6, 8, 10, 12])
  const nuspalvinta = atsitiktinis(1, daliu - 1)

  return variacija([
    // 1. Kiek dalių nuspalvinta (skaitiklis)
    () =>
      uzdavinys('paprastoji-trupmena', {
        klausimas: 'Kokia figūros dalis nuspalvinta? Parašyk trupmenos skaitiklį.',
        atsakymas: String(nuspalvinta),
        atsakymasRodymui: `$${nuspalvinta}$`,
        sprendimas: `Nuspalvintos ${nuspalvinta} dalys iš ${daliu}, tad skaitiklis yra ${nuspalvinta}.`,
        brezinys: trupmenosJuosta(daliu, nuspalvinta),
      }),

    // 2. Į kiek dalių padalyta (vardiklis)
    () =>
      uzdavinys('paprastoji-trupmena', {
        klausimas: 'Į kiek lygių dalių padalyta figūra? Parašyk trupmenos vardiklį.',
        atsakymas: String(daliu),
        atsakymasRodymui: `$${daliu}$`,
        sprendimas: `Figūra padalyta į ${daliu} ${lygiosDalys(daliu)} — tai ir yra vardiklis.`,
        brezinys: trupmenosApskritimas(daliu, nuspalvinta),
      }),

    // 3. Ką rodo vardiklis
    () =>
      pasirinkimoUzdavinys(naujasId('paprastoji-trupmena'), 'paprastoji-trupmena', {
        klausimas: 'Ką rodo trupmenos vardiklis?',
        variantai: [
          'į kiek lygių dalių padalyta visuma',
          'kiek dalių paimta',
          'kiek visumų yra',
        ],
        teisingas: 0,
        sprendimas: 'Vardiklis rodo dalių skaičių, o skaitiklis — kiek jų paimta.',
      }),

    // 4. Kiek dalių liko nenuspalvintų
    () =>
      uzdavinys('paprastoji-trupmena', {
        klausimas: 'Kiek figūros dalių liko nenuspalvintų?',
        atsakymas: String(daliu - nuspalvinta),
        atsakymasRodymui: `$${daliu - nuspalvinta}$`,
        sprendimas: `Iš ${daliu} dalių nuspalvintos ${nuspalvinta}, tad liko $${daliu} - ${nuspalvinta} = ${daliu - nuspalvinta}$.`,
        brezinys: trupmenosJuosta(daliu, nuspalvinta),
      }),

    // 5. Kuri trupmena reiškia vieną dalį
    () =>
      pasirinkimoUzdavinys(naujasId('paprastoji-trupmena'), 'paprastoji-trupmena', {
        klausimas: `Kuri trupmena reiškia vieną dalį iš ${daliu}?`,
        variantai: [
          `$\\dfrac{1}{${daliu}}$`,
          `$\\dfrac{${daliu}}{1}$`,
          `$\\dfrac{${daliu - 1}}{${daliu}}$`,
        ],
        teisingas: 0,
        sprendimas: 'Skaitiklis rodo paimtų dalių skaičių — čia viena.',
      }),

    // 6. Palyginti dvi juostas
    () => {
      const kitasDaliu = daliu === 6 ? 8 : 6
      const kitasNuspalvinta = atsitiktinis(1, kitasDaliu - 1)
      const pirmaDalis = nuspalvinta / daliu
      const antraDalis = kitasNuspalvinta / kitasDaliu
      const skirtumas = Math.abs(pirmaDalis - antraDalis)
      // Arba lygiai tiek pat, arba aiškiai skirtingai: 5/8 ir 4/6 juostose
      // skiriasi vos keliolika taškų, ir akimi to nusakyti neįmanoma.
      if (skirtumas > 0.001 && skirtumas < 0.16) return null
      const vienodos = skirtumas < 0.001
      return pasirinkimoUzdavinys(naujasId('paprastoji-trupmena'), 'paprastoji-trupmena', {
        klausimas: 'Kuri juosta nuspalvinta didesne dalimi?',
        variantai: vienodos
          ? ['dalys vienodos', 'pirmoji', 'antroji']
          : pirmaDalis > antraDalis
            ? ['pirmoji', 'antroji', 'dalys vienodos']
            : ['antroji', 'pirmoji', 'dalys vienodos'],
        teisingas: 0,
        sprendimas: vienodos
          ? `Nors dalių skaičius skiriasi, nuspalvinta tokia pati juostos dalis.`
          : `Pirmoje nuspalvinta ${nuspalvinta} iš ${daliu}, antroje — ${kitasNuspalvinta} iš ${kitasDaliu}.`,
        brezinys: dviJuostos(
          { daliu, nuspalvinta },
          { daliu: kitasDaliu, nuspalvinta: kitasNuspalvinta },
        ),
      })
    },

    // 7. Trupmena pagal sąlygą
    () => {
      const vardiklis = atsitiktinis(5, 9)
      const skaitiklis = vardiklis - 2
      return uzdavinys('paprastoji-trupmena', {
        klausimas: `Trupmenos vardiklis yra ${vardiklis}, o skaitiklis 2 mažesnis už vardiklį. Koks skaitiklis?`,
        atsakymas: String(skaitiklis),
        atsakymasRodymui: `$${skaitiklis}$`,
        sprendimas: `$${vardiklis} - 2 = ${skaitiklis}$.`,
      })
    },
  ])
}

// ── 1.11 Kaip rasti skaičiaus dalį? ─────────────────────────────────────────

const A_DALIS = [
  {
    klausimas: 'Rask $\\dfrac{1}{4}$ skaičiaus 28.',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: '$28 : 4 = 7$.',
  },
] as const

export const skaiciausDalis: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkDali(sritis), A_DALIS, 'skaiciaus-dalis')

function kurkDali(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const vardiklis = atsitiktinis(4, 9)
  const dalis = atsitiktinis(4, 12)
  const visuma = vardiklis * dalis
  if (visuma > maks) return null

  return variacija([
    // 1. Rasti dalį
    () =>
      uzdavinys('skaiciaus-dalis', {
        klausimas: `Rask $\\dfrac{1}{${vardiklis}}$ skaičiaus ${visuma}.`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `$${visuma} : ${vardiklis} = ${dalis}$.`,
      }),

    // 2. Iš paveikslėlio
    () =>
      uzdavinys('skaiciaus-dalis', {
        klausimas: `Kiek žetonų sudaro vieną iš ${vardiklis} lygių grupių?`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `Iš viso ${visuma} žetonų: $${visuma} : ${vardiklis} = ${dalis}$.`,
        brezinys: grupes(vardiklis, Math.min(dalis, 9)),
      }),

    // 3. Kiek liko
    () =>
      uzdavinys('skaiciaus-dalis', {
        klausimas: `Knygoje ${visuma} puslapiai. ${VARDAI[0]} perskaitė $\\dfrac{1}{${vardiklis}}$ knygos. Kiek puslapių liko?`,
        atsakymas: String(visuma - dalis),
        atsakymasRodymui: `$${visuma - dalis}$`,
        sprendimas: `Perskaitė $${visuma} : ${vardiklis} = ${dalis}$, liko $${visuma} - ${dalis} = ${visuma - dalis}$.`,
      }),

    // 4. Rasti visumą pagal dalį
    () =>
      uzdavinys('skaiciaus-dalis', {
        klausimas: `$\\dfrac{1}{${vardiklis}}$ skaičiaus yra ${dalis}. Koks visas skaičius?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `Dalį dauginame iš dalių skaičiaus: $${dalis} \\cdot ${vardiklis} = ${visuma}$.`,
      }),

    // 5. Kuri dalis didesnė
    () => {
      const kitasVardiklis = vardiklis === 9 ? 8 : 9
      if (visuma % kitasVardiklis !== 0) return null
      const kitaDalis = visuma / kitasVardiklis
      if (kitaDalis === dalis) return null
      return uzdavinys('skaiciaus-dalis', {
        klausimas: `Rask $\\dfrac{1}{${vardiklis}}$ ir $\\dfrac{1}{${kitasVardiklis}}$ skaičiaus ${visuma}. Kiek didesnė didesnioji dalis?`,
        atsakymas: String(Math.abs(dalis - kitaDalis)),
        atsakymasRodymui: `$${Math.abs(dalis - kitaDalis)}$`,
        sprendimas: `$${visuma} : ${vardiklis} = ${dalis}$ ir $${visuma} : ${kitasVardiklis} = ${kitaDalis}$; skirtumas ${Math.abs(dalis - kitaDalis)}.`,
      })
    },

    // 6. Kiek nėra tos rūšies
    () =>
      uzdavinys('skaiciaus-dalis', {
        klausimas: `Dėžėje ${visuma} ${derink(visuma, {
          vns: 'saldainis',
          dgs: 'saldainiai',
          kilm: 'saldainių',
        })}. Braškinių yra $\\dfrac{1}{${vardiklis}}$ visų saldainių. Kiek saldainių nėra braškinių?`,
        atsakymas: String(visuma - dalis),
        atsakymasRodymui: `$${visuma - dalis}$`,
        sprendimas: `Braškinių $${visuma} : ${vardiklis} = ${dalis}$, kitų $${visuma} - ${dalis} = ${visuma - dalis}$.`,
      }),

    // 7. Kuriuo veiksmu randama dalis
    () =>
      pasirinkimoUzdavinys(naujasId('skaiciaus-dalis'), 'skaiciaus-dalis', {
        klausimas: `Kuriuo veiksmu randama $\\dfrac{1}{${vardiklis}}$ skaičiaus?`,
        variantai: [`dalijant iš ${vardiklis}`, `dauginant iš ${vardiklis}`, `atimant ${vardiklis}`],
        teisingas: 0,
        sprendimas: `Viena dalis iš ${vardiklis} randama dalyba.`,
      }),
  ])
}

// ── 1.12 Dalis, kai skaitiklis didesnis už 1 ────────────────────────────────

const A_DALIS2 = [
  {
    klausimas: 'Rask $\\dfrac{3}{4}$ skaičiaus 32.',
    atsakymas: '24',
    atsakymasRodymui: '$24$',
    sprendimas: '$32 : 4 = 8$, tada $8 \\cdot 3 = 24$.',
  },
] as const

export const dalisSuSkaitikliu: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkDali2(sritis), A_DALIS2, 'dalis-su-skaitikliu')

function kurkDali2(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const vardiklis = atsitiktinis(4, 9)
  const skaitiklis = atsitiktinis(2, vardiklis - 1)
  const viena = atsitiktinis(4, 12)
  const visuma = vardiklis * viena
  if (visuma > maks) return null
  const dalis = viena * skaitiklis

  return variacija([
    // 1. Rasti dalį
    () =>
      uzdavinys('dalis-su-skaitikliu', {
        klausimas: `Rask $\\dfrac{${skaitiklis}}{${vardiklis}}$ skaičiaus ${visuma}.`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `$${visuma} : ${vardiklis} = ${viena}$, tada $${viena} \\cdot ${skaitiklis} = ${dalis}$.`,
      }),

    // 2. Iš paveikslėlio
    () =>
      uzdavinys('dalis-su-skaitikliu', {
        klausimas: `Kiek taškų sudaro ${skaitiklis} grupes iš ${vardiklis}?`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `Vienoje grupėje ${viena} taškai: $${viena} \\cdot ${skaitiklis} = ${dalis}$.`,
        brezinys: grupes(vardiklis, Math.min(viena, 9)),
      }),

    // 3. Kiek lieka kitai daliai
    () =>
      uzdavinys('dalis-su-skaitikliu', {
        klausimas: `Bibliotekoje ${visuma} knygos. $\\dfrac{${skaitiklis}}{${vardiklis}}$ jų — grožinės. Kiek knygų yra kitų rūšių?`,
        atsakymas: String(visuma - dalis),
        atsakymasRodymui: `$${visuma - dalis}$`,
        sprendimas: `Grožinių $${viena} \\cdot ${skaitiklis} = ${dalis}$, kitų $${visuma} - ${dalis} = ${visuma - dalis}$.`,
      }),

    // 4. Rasti visumą pagal dalį
    () =>
      uzdavinys('dalis-su-skaitikliu', {
        klausimas: `$\\dfrac{${skaitiklis}}{${vardiklis}}$ skaičiaus yra ${dalis}. Koks visas skaičius?`,
        atsakymas: String(visuma),
        atsakymasRodymui: `$${visuma}$`,
        sprendimas: `Viena dalis: $${dalis} : ${skaitiklis} = ${viena}$. Visas skaičius: $${viena} \\cdot ${vardiklis} = ${visuma}$.`,
      }),

    // 5. Likusi dalis
    () =>
      uzdavinys('dalis-su-skaitikliu', {
        klausimas: `Rask $\\dfrac{${skaitiklis}}{${vardiklis}}$ skaičiaus ${visuma}, tada apskaičiuok, kiek sudaro likusi dalis.`,
        atsakymas: String(visuma - dalis),
        atsakymasRodymui: `$${visuma - dalis}$`,
        sprendimas: `$\\dfrac{${skaitiklis}}{${vardiklis}}$ yra ${dalis}, o likusios $${vardiklis - skaitiklis}$ dalys sudaro $${visuma - dalis}$.`,
      }),

    // 6. Du žingsniai su dalyba
    () => {
      const likusios = visuma - dalis
      const maiseliu = 3
      if (likusios % maiseliu !== 0) return null
      return uzdavinys('dalis-su-skaitikliu', {
        klausimas: `Dėžėje ${visuma} detalės. Rinkiniui panaudota $\\dfrac{${skaitiklis}}{${vardiklis}}$ visų detalių. Likusios sudėtos po lygiai į ${maiseliu} maišelius. Kiek detalių kiekviename?`,
        atsakymas: String(likusios / maiseliu),
        atsakymasRodymui: `$${likusios / maiseliu}$`,
        sprendimas: `Panaudota ${dalis}, liko ${likusios}: $${likusios} : ${maiseliu} = ${likusios / maiseliu}$.`,
      })
    },

    // 7. Kuris veiksmas pirmas
    () =>
      pasirinkimoUzdavinys(naujasId('dalis-su-skaitikliu'), 'dalis-su-skaitikliu', {
        klausimas: `Kaip randama $\\dfrac{${skaitiklis}}{${vardiklis}}$ skaičiaus?`,
        variantai: [
          `pirma dalijama iš ${vardiklis}, tada dauginama iš ${skaitiklis}`,
          `pirma dauginama iš ${vardiklis}, tada dalijama iš ${skaitiklis}`,
          `dalijama iš ${skaitiklis}`,
        ],
        teisingas: 0,
        sprendimas: 'Vardiklis rodo, į kiek dalių dalyti, o skaitiklis — kiek tų dalių paimti.',
      }),
  ])
}

// ── 1.13 Tekstiniai uždaviniai su trupmenomis ───────────────────────────────

const A_TRUP_UZD = [
  {
    klausimas: 'Klasėje 28 mokiniai. $\\dfrac{3}{7}$ jų lanko chorą. Kiek mokinių lanko chorą?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: '$28 : 7 = 4$, tada $4 \\cdot 3 = 12$.',
  },
] as const

export const trupmenuUzdaviniai: Generatorius = (_lygis, _klase, sritis) =>
  suBandymais(() => kurkTrupUzd(sritis), A_TRUP_UZD, 'trupmenu-uzdaviniai')

function kurkTrupUzd(sritis?: Sritis | null): Uzdavinys | null {
  const maks = riba(sritis)
  const vardiklis = atsitiktinis(4, 9)
  const skaitiklis = atsitiktinis(2, vardiklis - 1)
  const viena = atsitiktinis(4, 10)
  const visuma = vardiklis * viena
  if (visuma > maks) return null
  const dalis = viena * skaitiklis

  return variacija([
    // 1. Kiek sudėjo
    () =>
      uzdavinys('trupmenu-uzdaviniai', {
        klausimas: `Iš ${visuma} obuolių $\\dfrac{1}{${vardiklis}}$ sudėta į krepšelį. Kiek obuolių sudėta?`,
        atsakymas: String(viena),
        atsakymasRodymui: `$${viena}$`,
        sprendimas: `$${visuma} : ${vardiklis} = ${viena}$.`,
      }),

    // 2. Kiek mokinių
    () =>
      uzdavinys('trupmenu-uzdaviniai', {
        klausimas: `Klasėje ${visuma} ${derink(visuma, {
          vns: 'mokinys',
          dgs: 'mokiniai',
          kilm: 'mokinių',
        })}. $\\dfrac{${skaitiklis}}{${vardiklis}}$ jų lanko chorą. Kiek mokinių lanko chorą?`,
        atsakymas: String(dalis),
        atsakymasRodymui: `$${dalis}$`,
        sprendimas: `$${visuma} : ${vardiklis} = ${viena}$, tada $${viena} \\cdot ${skaitiklis} = ${dalis}$.`,
      }),

    // 3. Juosta su nurodyta visuma
    () => {
      const daliu = 10
      const nuspalvinta = atsitiktinis(3, 7)
      const visasKiekis = atsitiktinis(3, 9) * 10
      return uzdavinys('trupmenu-uzdaviniai', {
        // visasKiekis visada dalus iš 10, tad galininkas — „saldainių".
        klausimas: `Visa juosta atitinka ${visasKiekis} saldainių. Kiek saldainių atitinka nuspalvinta dalis?`,
        atsakymas: String((visasKiekis / daliu) * nuspalvinta),
        atsakymasRodymui: `$${(visasKiekis / daliu) * nuspalvinta}$`,
        sprendimas: `Viena dalis yra $${visasKiekis} : ${daliu} = ${visasKiekis / daliu}$, o nuspalvintų dalių ${nuspalvinta}.`,
        brezinys: trupmenosJuosta(daliu, nuspalvinta),
      })
    },

    // 4. Išdalyta ir sudėta po lygiai
    () => {
      const likusios = visuma - dalis
      const puodeliu = 4
      if (likusios % puodeliu !== 0) return null
      return uzdavinys('trupmenu-uzdaviniai', {
        klausimas: `Dėžėje buvo ${visuma} pieštukų. $\\dfrac{${skaitiklis}}{${vardiklis}}$ jų išdalijo, o likusius sudėjo po lygiai į ${puodeliu} puodelius. Kiek pieštukų kiekviename?`,
        atsakymas: String(likusios / puodeliu),
        atsakymasRodymui: `$${likusios / puodeliu}$`,
        sprendimas: `Išdalijo ${dalis}, liko ${likusios}: $${likusios} : ${puodeliu} = ${likusios / puodeliu}$.`,
      })
    },

    // 5. Dvi dalys ir likutis
    () => {
      if (visuma % 3 !== 0 || visuma % 4 !== 0) return null
      const trecdalis = visuma / 3
      const ketvirtadalis = visuma / 4
      const liko = visuma - trecdalis - ketvirtadalis
      if (liko < 1) return null
      return uzdavinys('trupmenu-uzdaviniai', {
        klausimas: `Klasėje ${visuma} mokiniai. $\\dfrac{1}{3}$ dalyvauja chore, $\\dfrac{1}{4}$ — šachmatų būrelyje, o likusieji sportuoja. Kiek sportuoja?`,
        atsakymas: String(liko),
        atsakymasRodymui: `$${liko}$`,
        sprendimas: `Chore ${trecdalis}, šachmatuose ${ketvirtadalis}: $${visuma} - ${trecdalis} - ${ketvirtadalis} = ${liko}$.`,
      })
    },

    // 6. Dalis nuo likučio
    () => {
      const likusios = visuma - dalis
      if (likusios % 3 !== 0) return null
      const antra = likusios / 3
      return uzdavinys('trupmenu-uzdaviniai', {
        klausimas: `Sandėlyje ${visuma} dėžės. $\\dfrac{${skaitiklis}}{${vardiklis}}$ išsiųstos į vieną miestą. Iš likusių $\\dfrac{1}{3}$ išsiųsta į kitą miestą. Kiek dėžių liko sandėlyje?`,
        atsakymas: String(likusios - antra),
        atsakymasRodymui: `$${likusios - antra}$`,
        sprendimas: `Pirmą kartą išsiųsta ${dalis}, liko ${likusios}. Antrą kartą $${likusios} : 3 = ${antra}$, tad liko $${likusios} - ${antra} = ${likusios - antra}$.`,
      })
    },

    // 7. Palyginti dvi dalis
    () => {
      // Kiekis turi dalytis ir iš 4, ir iš 8, bet ne būti visada tas pats.
      const kiekis = atsitiktinis(3, 12) * 8
      if (kiekis > maks) return null
      const a = (kiekis / 4) * 3
      const b = (kiekis / 8) * 5
      if (a === b) return null
      return uzdavinys('trupmenu-uzdaviniai', {
        klausimas: `Apskaičiuok $\\dfrac{3}{4}$ ir $\\dfrac{5}{8}$ skaičiaus ${kiekis}. Kiek didesnė didesnioji dalis?`,
        atsakymas: String(Math.abs(a - b)),
        atsakymasRodymui: `$${Math.abs(a - b)}$`,
        sprendimas: `$\\dfrac{3}{4}$ yra ${a}, $\\dfrac{5}{8}$ yra ${b}; skirtumas $${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.abs(a - b)}$.`,
        brezinys: dviJuostos({ daliu: 4, nuspalvinta: 3 }, { daliu: 8, nuspalvinta: 5 }),
      })
    },
  ])
}

// ── 1.14 Kaip pasigaminti picą? ─────────────────────────────────────────────

const A_PICA = [
  {
    klausimas: 'Pica padalyta į 8 dalis. Suvalgytos 2. Kiek gabalėlių liko?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: '$8 - 2 = 6$.',
  },
] as const

export const picosDalys: Generatorius = () => suBandymais(kurkPica, A_PICA, 'picos-dalys')

/** „į 6 lygias dalis", bet „į 12 lygių dalių". */
function lygiosDalys(n: number): string {
  return derink(n, { vns: 'lygią dalį', dgs: 'lygias dalis', kilm: 'lygių dalių' })
}

/** „1 gabalėlis", „3 gabalėliai", „11 gabalėlių". */
function gabaleliai(n: number): string {
  return derink(n, { vns: 'gabalėlis', dgs: 'gabalėliai', kilm: 'gabalėlių' })
}

function kurkPica(): Uzdavinys | null {
  const daliu = pasirink([6, 8, 12])
  const suvalgyta = atsitiktinis(1, daliu - 2)

  return variacija([
    // 1. Kiek liko
    () =>
      uzdavinys('picos-dalys', {
        klausimas: `Pica padalyta į ${daliu} ${lygiosDalys(daliu)}. Suvalgyta ${suvalgyta} ${gabaleliai(suvalgyta)}. Kiek gabalėlių liko?`,
        atsakymas: String(daliu - suvalgyta),
        atsakymasRodymui: `$${daliu - suvalgyta}$`,
        sprendimas: `$${daliu} - ${suvalgyta} = ${daliu - suvalgyta}$.`,
        brezinys: trupmenosApskritimas(daliu, suvalgyta),
      }),

    // 2. Kiek gabalėlių sudaro nurodytą dalį
    () => {
      const vardiklis = pasirink([2, 3, 4])
      if (daliu % vardiklis !== 0) return null
      return uzdavinys('picos-dalys', {
        klausimas: `Pica padalyta į ${daliu} ${lygiosDalys(daliu)}. Kiek gabalėlių sudaro $\\dfrac{1}{${vardiklis}}$ picos?`,
        atsakymas: String(daliu / vardiklis),
        atsakymasRodymui: `$${daliu / vardiklis}$`,
        sprendimas: `$${daliu} : ${vardiklis} = ${daliu / vardiklis}$ ${gabaleliai(daliu / vardiklis)}.`,
        // Nenuspalvinta: nuspalvinus kaip tik tiek gabalėlių, kiek klausiama,
        // atsakymą liktų tik suskaičiuoti.
        brezinys: trupmenosApskritimas(daliu, 0),
      })
    },

    // 3. Kokia dalis su sūriu
    () => {
      const suGrybais = atsitiktinis(1, daliu - 2)
      return uzdavinys('picos-dalys', {
        klausimas: `Pica padalyta į ${daliu} ${lygiosDalys(daliu)}. ${suGrybais} ${gabaleliai(
          suGrybais,
        )} su grybais, kiti — su sūriu. Kiek gabalėlių su sūriu?`,
        atsakymas: String(daliu - suGrybais),
        atsakymasRodymui: `$${daliu - suGrybais}$`,
        sprendimas: `$${daliu} - ${suGrybais} = ${daliu - suGrybais}$.`,
        brezinys: trupmenosApskritimas(daliu, suGrybais),
      })
    },

    // 4. Dvi picos
    () => {
      const pirma = atsitiktinis(1, daliu - 1)
      const antra = atsitiktinis(1, daliu - 1)
      return uzdavinys('picos-dalys', {
        klausimas: `Dvi vienodos picos; kiekviena padalyta į ${daliu} ${lygiosDalys(daliu)}. Iš pirmosios suvalgyta ${pirma} ${gabaleliai(
          pirma,
        )}, iš antrosios — ${antra}. Kiek gabalėlių suvalgyta iš viso?`,
        atsakymas: String(pirma + antra),
        atsakymasRodymui: `$${pirma + antra}$`,
        sprendimas: `$${pirma} + ${antra} = ${pirma + antra}$.`,
      })
    },

    // 5. Kurioje picoje liko daugiau
    () => {
      const pirma = atsitiktinis(2, daliu - 2)
      const antra = atsitiktinis(2, daliu - 2)
      // Iš pirmosios suvalgoma mažiau, tad daugiau lieka joje — taip klausimo
      // nereikia sukti aplinkiniu keliu „toje picoje, kurioje liko daugiau".
      if (pirma >= antra) return null
      const likoPirmoje = daliu - pirma
      const likoAntroje = daliu - antra
      return uzdavinys('picos-dalys', {
        klausimas: `Dvi vienodos picos; kiekviena padalyta į ${daliu} ${lygiosDalys(daliu)}. Iš pirmosios suvalgyta ${pirma} ${gabaleliai(
          pirma,
        )}, iš antrosios — ${antra}. Keliais gabalėliais pirmojoje picoje liko daugiau negu antrojoje?`,
        atsakymas: String(likoPirmoje - likoAntroje),
        atsakymasRodymui: `$${likoPirmoje - likoAntroje}$`,
        sprendimas: `Pirmojoje liko ${likoPirmoje}, antrojoje — ${likoAntroje}; skirtumas $${likoPirmoje} - ${likoAntroje} = ${
          likoPirmoje - likoAntroje
        }$.`,
      })
    },

    // 6. Dvi rūšys pagal dalis
    () => {
      if (daliu % 3 !== 0 || daliu % 4 !== 0) return null
      const pomidorai = daliu / 3
      const alyvuoges = daliu / 4
      return uzdavinys('picos-dalys', {
        klausimas: `Pica padalyta į ${daliu} ${lygiosDalys(daliu)}. $\\dfrac{1}{3}$ picos su pomidorais, $\\dfrac{1}{4}$ — su alyvuogėmis. Keliais gabalėliais su pomidorais daugiau?`,
        atsakymas: String(pomidorai - alyvuoges),
        atsakymasRodymui: `$${pomidorai - alyvuoges}$`,
        sprendimas: `Su pomidorais $${daliu} : 3 = ${pomidorai}$, su alyvuogėmis $${daliu} : 4 = ${alyvuoges}$.`,
      })
    },

    // 7. Alyvuogės pagal dalį
    () => {
      const visos = 24
      const vardiklis = 8
      const skaitiklis = 3
      const panaudota = (visos / vardiklis) * skaitiklis
      return uzdavinys('picos-dalys', {
        klausimas: `Picai gaminti turima ${visos} alyvuogės. $\\dfrac{${skaitiklis}}{${vardiklis}}$ jų uždedama ant picos. Kiek alyvuogių liks?`,
        atsakymas: String(visos - panaudota),
        atsakymasRodymui: `$${visos - panaudota}$`,
        sprendimas: `Panaudojama $${visos} : ${vardiklis} \\cdot ${skaitiklis} = ${panaudota}$, liks $${visos} - ${panaudota} = ${visos - panaudota}$.`,
      })
    },
  ])
}
