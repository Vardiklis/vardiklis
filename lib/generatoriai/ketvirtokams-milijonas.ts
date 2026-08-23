import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { eiliskumoUzdavinys, pasirinkimoUzdavinys } from './formatai'
import { D, MIESTAI, VARDAI, kiek, sk4, tekstu, zodziais } from './ketvirtokams-bendra'
import {
  daugybaStulpeliu,
  dalybaKampu,
  juostuSchema,
  skaiciuTiese,
  skyriuLentele,
} from './ketvirtokams-vaizdai'
import { apvalinimoTiese, stulpelis4 } from './treciokams-tukstanciai-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 4 klasės tema „Skaičiai iki 1 000 000“ — šešiolika potemių.
 *
 * Anksčiau jos rėmėsi `skaitmenys`, `sveikieji`, `apvalinimas` ir
 * `veiksmu-tvarka` generatoriais, skirtais vyresnėms klasėms.
 *
 * Dešimt pirmųjų potemių yra apie patį skaičių ruožą — skaitymą, sandarą,
 * palyginimą, keturis veiksmus. Šešios paskutinės nekalba apie skaičius visai:
 * jos apie tai, kaip dirbama su uždaviniu — kaip pasirinkti patogų būdą, kaip
 * pasitikrinti, ką daryti su nereikalingu duomeniu, kaip pačiam suformuluoti
 * klausimą. Todėl ten atsakymas dažniausiai renkamas iš variantų: pats būdo
 * pasirinkimas ir yra tikrinamas gebėjimas.
 */

const SKYRIAI = [
  { vardas: 'vienetų', verte: 1 },
  { vardas: 'dešimčių', verte: 10 },
  { vardas: 'šimtų', verte: 100 },
  { vardas: 'tūkstančių', verte: 1000 },
  { vardas: 'dešimčių tūkstančių', verte: 10000 },
  { vardas: 'šimtų tūkstančių', verte: 100000 },
] as const

/** Šešiaženklis be viso nulinių skyrių — kad klausimai apie skyrius turėtų prasmę. */
function sesiazenklis(): number {
  return atsitiktinis(100000, 999999)
}

// ── 4.1 Skaičių skaitymas ir užrašymas ──────────────────────────────────────

const T1 = 'skaiciu-skaitymas-1000000'

const A_SKAITYMAS = [
  {
    klausimas: 'Užrašyk skaitmenimis: septyni šimtai trys tūkstančiai keturiolika.',
    atsakymas: '703014',
    atsakymasRodymui: '$703\\,014$',
    sprendimas: 'Tūkstančių — 703, o po jų dar 14 vienetų.',
  },
] as const

export const skaiciuSkaitymas1000000: Generatorius = () => suBandymais(kurkSkaityma, A_SKAITYMAS, T1)

function kurkSkaityma(): Uzdavinys | null {
  const n = sesiazenklis()

  return variacija([
    // 1. Iš žodžių į skaitmenis
    () =>
      uzdavinys(T1, {
        klausimas: `Užrašyk skaitmenimis: ${zodziais(n)}.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${sk4(n)}$`,
        sprendimas: `Tūkstančių klasėje — ${Math.floor(n / 1000)}, vienetų klasėje — ${n % 1000}.`,
      }),

    // 2. Iš skaitmenų į žodžius — klausiama tūkstančių dalies
    () =>
      uzdavinys(T1, {
        klausimas: `Skaičių $${sk4(n)}$ perskaityk. Kiek jame yra pilnų tūkstančių?`,
        atsakymas: String(Math.floor(n / 1000)),
        atsakymasRodymui: `$${sk4(Math.floor(n / 1000))}$`,
        sprendimas: `Skaičius skaitomas „${zodziais(n)}“ — pilnų tūkstančių jame ${Math.floor(n / 1000)}.`,
        brezinys: skyriuLentele(n),
      }),

    // 3. Rikiavimas
    () => {
      const a = atsitiktinis(1, 9)
      const b = atsitiktinis(0, 9)
      const c = atsitiktinis(0, 9)
      if (a === b || b === c || a === c) return null
      const trys = [
        a * 100000 + b * 10000 + c * 1000,
        a * 100000 + c * 10000 + b * 1000,
        b * 100000 + a * 10000 + c * 1000,
      ]
      if (new Set(trys).size < 3 || trys.some((x) => x < 100000)) return null
      const eile = [...trys].sort((x, y) => x - y)
      return eiliskumoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Surikiuok skaičius didėjimo tvarka.',
        teisingaEile: eile.map((x) => `$${sk4(x)}$`),
        sprendimas: `Lyginama pradedant nuo aukščiausio skyriaus: ${eile.map((x) => tekstu(x)).join(' < ')}.`,
      })
    },

    // 4. Kaimynai per skyriaus ribą
    () => {
      const pagrindas = atsitiktinis(11, 98) * 1000
      const skaicius = pagrindas + 999
      return uzdavinys(T1, {
        klausimas: `Koks skaičius eina iškart po $${sk4(skaicius)}$?`,
        atsakymas: String(skaicius + 1),
        atsakymasRodymui: `$${sk4(skaicius + 1)}$`,
        sprendimas: `Vienetai, dešimtys ir šimtai jau didžiausi, tad pridėjus 1 susidaro pilnas tūkstantis: $${sk4(skaicius + 1)}$.`,
      })
    },

    // 5. Taškas skaičių tiesėje
    () => {
      const nuo = atsitiktinis(1, 8) * 100000
      const zingsnis = 10000
      const iesk = nuo + atsitiktinis(1, 9) * zingsnis
      if (iesk % 50000 === 0) return null
      return uzdavinys(T1, {
        klausimas: 'Koks skaičius pažymėtas tašku?',
        atsakymas: String(iesk),
        atsakymasRodymui: `$${sk4(iesk)}$`,
        sprendimas: `Viena padala yra 10 000, tad taškas stovi ties $${sk4(iesk)}$.`,
        brezinys: skaiciuTiese(nuo, nuo + 100000, zingsnis, [{ reiksme: iesk }], 5),
      })
    },

    // 6. Trys taškai — didžiausias
    () => {
      const nuo = atsitiktinis(2, 7) * 100000
      const vietos = sumaisyk([1, 2, 3, 4, 6, 7, 8, 9]).slice(0, 3)
      const taskai = vietos.map((v, i) => ({
        reiksme: nuo + v * 10000,
        raide: ['A', 'B', 'C'][i],
      }))
      const didziausias = taskai.reduce((a, b) => (a.reiksme > b.reiksme ? a : b))
      return uzdavinys(T1, {
        klausimas: 'Kurio taško reikšmė didžiausia? Užrašyk tą skaičių.',
        atsakymas: String(didziausias.reiksme),
        atsakymasRodymui: `$${sk4(didziausias.reiksme)}$`,
        sprendimas: `Dešiniausias taškas yra ${didziausias.raide}; viena padala — 10 000.`,
        brezinys: skaiciuTiese(nuo, nuo + 100000, 10000, taskai, 5),
      })
    },

    // 7. Skaičius pagal sąlygas
    () => {
      const tukst = atsitiktinis(10, 98)
      const des = atsitiktinis(1, 8)
      const vnt = atsitiktinis(1, 9)
      const rez = tukst * 1000 + des * 10 + vnt
      return uzdavinys(T1, {
        klausimas: `Rask skaičių, kuris didesnis už $${sk4(tukst * 1000)}$, mažesnis už $${sk4(tukst * 1000 + 100)}$, jo dešimčių skaitmuo yra ${des}, o vienetų — ${vnt}.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: `Tūkstančiai ir šimtai jau nusakyti, lieka įrašyti nurodytas dešimtis ir vienetus: $${sk4(rez)}$.`,
      })
    },

    // 8. Skaitmenų suma
    () => {
      const suma = String(n)
        .split('')
        .reduce((s, c) => s + Number(c), 0)
      return uzdavinys(T1, {
        klausimas: `Kokia yra skaičiaus $${sk4(n)}$ skaitmenų suma?`,
        atsakymas: String(suma),
        atsakymasRodymui: `$${suma}$`,
        sprendimas: `$${String(n).split('').join(' + ')} = ${suma}$.`,
      })
    },
  ])
}

// ── 4.2 Skaičių sandara ─────────────────────────────────────────────────────

const T2 = 'skaiciu-sandara-1000000'

const A_SANDARA = [
  {
    klausimas: 'Kiek iš viso dešimčių yra skaičiuje $5\\,430$?',
    atsakymas: '543',
    atsakymasRodymui: '$543$',
    sprendimas: '$5430 : 10 = 543$.',
  },
] as const

export const skaiciuSandara1000000: Generatorius = () => suBandymais(kurkSandara, A_SANDARA, T2)

function kurkSandara(): Uzdavinys | null {
  const n = sesiazenklis()
  const s = String(n)

  return variacija([
    // 1. Skyriaus skaitmuo
    () => {
      const skyrius = pasirink(SKYRIAI.slice(3))
      const skaitmuo = Math.floor(n / skyrius.verte) % 10
      return uzdavinys(T2, {
        klausimas: `Koks yra skaičiaus $${sk4(n)}$ ${skyrius.vardas} skaitmuo?`,
        atsakymas: String(skaitmuo),
        atsakymasRodymui: `$${skaitmuo}$`,
        sprendimas: `Skyrių lentelėje ${skyrius.vardas} skiltyje stovi ${skaitmuo}.`,
        brezinys: skyriuLentele(n),
      })
    },

    // 2. Kiek iš viso dešimčių arba šimtų
    () => {
      const skyrius = pasirink([
        { vardas: 'dešimčių', verte: 10 },
        { vardas: 'šimtų', verte: 100 },
      ])
      const kiekis = Math.floor(n / skyrius.verte)
      return uzdavinys(T2, {
        klausimas: `Kiek iš viso ${skyrius.vardas} yra skaičiuje $${sk4(n)}$?`,
        atsakymas: String(kiekis),
        atsakymasRodymui: `$${sk4(kiekis)}$`,
        sprendimas: `$${sk4(n)} : ${skyrius.verte} = ${sk4(kiekis)}$ (likutis atmetamas) — tiek kartų ${skyrius.vardas === 'dešimčių' ? 'dešimtis' : 'šimtas'} telpa skaičiuje.`,
      })
    },

    // 3. Kuriame skaičiuje skaitmuo reiškia nurodytą vertę
    () => {
      const skyrius = pasirink(SKYRIAI.slice(2, 5))
      const skaitmuo = atsitiktinis(2, 9)
      const teisingas = sesiazenklis() - (Math.floor(sesiazenklis() / skyrius.verte) % 10) * skyrius.verte
      const su = Math.floor(teisingas / (skyrius.verte * 10)) * skyrius.verte * 10 + skaitmuo * skyrius.verte + (teisingas % skyrius.verte)
      if (su < 100000 || su > 999999) return null
      const kiti = [su + skyrius.verte, su + 2 * skyrius.verte, su - skyrius.verte].filter(
        (x) => x >= 100000 && x <= 999999 && Math.floor(x / skyrius.verte) % 10 !== skaitmuo,
      )
      if (kiti.length < 2) return null
      const variantai = sumaisyk([su, ...kiti.slice(0, 3)])
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kuriame skaičiuje skaitmuo ${skaitmuo} stovi ${skyrius.vardas} skyriuje?`,
        variantai: variantai.map((x) => `$${sk4(x)}$`),
        teisingas: variantai.indexOf(su),
        sprendimas: `Ieškoma skaičiaus, kurio ${skyrius.vardas} skiltyje yra ${skaitmuo}: tai $${sk4(su)}$.`,
      })
    },

    // 4. Sudaryti skaičių pagal du skyrius
    () => {
      const st = atsitiktinis(1, 9)
      const vnt = atsitiktinis(1, 9)
      const rez = st * 100000 + vnt
      return uzdavinys(T2, {
        klausimas: `Užrašyk mažiausią skaičių, kurio šimtų tūkstančių skaitmuo yra ${st}, o vienetų — ${vnt}.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: `Kad skaičius būtų kuo mažesnis, visos likusios skiltys užpildomos nuliais: $${sk4(rez)}$.`,
      })
    },

    // 5. Pakeisti vieną skaitmenį
    () => {
      const vieta = atsitiktinis(1, 5)
      const skaitmuo = Number(s[vieta])
      if (skaitmuo === 9) return null
      const verte = 10 ** (5 - vieta)
      const naujas = n + (9 - skaitmuo) * verte
      return uzdavinys(T2, {
        klausimas: `Skaičiuje $${sk4(n)}$ pakeisk vieną skaitmenį taip, kad gautum kuo didesnį skaičių, bet nekeisk pirmojo skaitmens. Koks tai skaičius?`,
        atsakymas: String(n + (9 - Number(s[1])) * 10000),
        atsakymasRodymui: `$${sk4(n + (9 - Number(s[1])) * 10000)}$`,
        sprendimas:
          Number(s[1]) === 9
            ? `Dešimčių tūkstančių skaitmuo jau 9, tad skaičius nesikeičia: $${sk4(n)}$.`
            : `Didžiausią prieaugį duoda aukščiausias keičiamas skyrius — dešimčių tūkstančių: vietoj ${s[1]} rašomas 9, ir gaunama $${sk4(n + (9 - Number(s[1])) * 10000)}$. Kitų skyrių keitimas ($${sk4(naujas)}$) duotų mažiau.`,
      })
    },

    // 6. Trūkstamas skaitmuo
    () => {
      const dt = atsitiktinis(1, 9)
      const rez = Number(`${s[0]}${dt}${s[2]}${s[3]}${s[4]}${s[5]}`)
      return uzdavinys(T2, {
        klausimas: `Užpildyk trūkstamą skaitmenį: $${s[0]}\\square${s[2]}\\,${s[3]}${s[4]}${s[5]}$, jei dešimčių tūkstančių skaitmuo yra ${dt}.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: `Antroji skiltis iš kairės ir yra dešimtys tūkstančių, tad ten rašomas ${dt}.`,
      })
    },

    // 7. Kuo skiriasi du panašūs skaičiai
    () => {
      const a = atsitiktinis(2, 8)
      const b = atsitiktinis(0, 3)
      if (a === b) return null
      const x = a * 100000 + b * 1000 + 405
      const y = b * 100000 + a * 10000 + 405
      if (x === y || y < 100000) return null
      return pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: `Kuo skiriasi skaičiai $${sk4(x)}$ ir $${sk4(y)}$?`,
        variantai: [
          'tie patys skaitmenys sustatyti į kitus skyrius',
          'jie sudaryti iš skirtingų skaitmenų',
          'niekuo — tai tas pats skaičius',
          'vienas jų yra penkiaženklis',
        ],
        teisingas: 0,
        sprendimas: `Skaitmenys tie patys, bet kiekvieno vertė priklauso nuo skyriaus, kuriame jis stovi: $${sk4(x)}$ ir $${sk4(y)}$.`,
      })
    },

    // 8. Skaičius pagal skaitmenų sumą
    () => {
      const st = atsitiktinis(4, 8)
      const likusi = 20 - st
      if (likusi < 1 || likusi > 45) return null
      // Likusią sumą surenkame iš dešimčių tūkstančių ir tūkstančių skyrių.
      const dt = Math.min(9, likusi)
      const t = likusi - dt
      if (t > 9) return null
      const rez = st * 100000 + dt * 10000 + t * 1000
      return uzdavinys(T2, {
        klausimas: `Užrašyk didžiausią skaičių, kurio šimtų tūkstančių skaitmuo yra ${st}, skaitmenų suma lygi 20, o šimtų, dešimčių ir vienetų skiltyse yra nuliai.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: `Lieka surinkti $20 - ${st} = ${likusi}$ iš dviejų skilčių. Didžiausias skaičius gaunamas į aukštesnę skiltį įrašius kuo daugiau: ${dt} ir ${t}.`,
      })
    },
  ])
}

// ── 4.3 Skyrių suma ─────────────────────────────────────────────────────────

const T3 = 'skyriu-suma'

const A_SKYRIU_SUMA = [
  {
    klausimas: 'Užrašyk skaičių: $200\\,000 + 30\\,000 + 500 + 9$.',
    atsakymas: '230509',
    atsakymasRodymui: '$230\\,509$',
    sprendimas: 'Kiekvienas dėmuo užpildo savo skyrių.',
  },
] as const

export const skyriuSuma: Generatorius = () => suBandymais(kurkSkyriuSuma, A_SKYRIU_SUMA, T3)

/** Nenuliniai skaičiaus skyriai nuo aukščiausio. */
function skyriuDemenys(n: number): number[] {
  const s = String(n)
  const rez: number[] = []
  for (let i = 0; i < s.length; i += 1) {
    const verte = Number(s[i]) * 10 ** (s.length - 1 - i)
    if (verte > 0) rez.push(verte)
  }
  return rez
}

function kurkSkyriuSuma(): Uzdavinys | null {
  const n = sesiazenklis()
  const demenys = skyriuDemenys(n)

  return variacija([
    // 1. Iš sumos į skaičių
    () => {
      if (demenys.length < 3) return null
      return uzdavinys(T3, {
        klausimas: `Užrašyk skaičių: $${demenys.map((d) => sk4(d)).join(' + ')}$.`,
        atsakymas: String(n),
        atsakymasRodymui: `$${sk4(n)}$`,
        sprendimas: `Kiekvienas dėmuo užpildo savo skyrių, o tuščios skiltys lieka nuliais: $${sk4(n)}$.`,
      })
    },

    // 2. Iš skaičiaus į vieną dėmenį
    () => {
      const kuris = pasirink(demenys)
      return uzdavinys(T3, {
        klausimas: `Skaičių $${sk4(n)}$ išskaidyk skyrių suma. Koks yra didžiausias jos dėmuo?`,
        atsakymas: String(Math.max(...demenys)),
        atsakymasRodymui: `$${sk4(Math.max(...demenys))}$`,
        sprendimas: `Skyrių suma: $${demenys.map((d) => sk4(d)).join(' + ')}$. Didžiausias dėmuo — $${sk4(Math.max(...demenys))}$, o ne $${sk4(kuris)}$.`,
      })
    },

    // 3. Kiek dėmenų turi skyrių suma
    () =>
      uzdavinys(T3, {
        klausimas: `Iš kelių dėmenų sudaryta skaičiaus $${sk4(n)}$ skyrių suma?`,
        atsakymas: String(demenys.length),
        atsakymasRodymui: `$${demenys.length}$`,
        sprendimas: `Dėmenų tiek, kiek skaičiuje nenulinių skaitmenų: $${demenys.map((d) => sk4(d)).join(' + ')}$.`,
        brezinys: skyriuLentele(n),
      }),

    // 4. Trūkstamas dėmuo
    () => {
      const st = atsitiktinis(1, 9) * 100000
      const dt = atsitiktinis(1, 9) * 10000
      const des = atsitiktinis(1, 9) * 10
      const vnt = atsitiktinis(1, 9)
      return uzdavinys(T3, {
        klausimas: `Užpildyk trūkstamą dėmenį: $${sk4(st)} + \\square + ${des} + ${vnt} = ${sk4(st + dt + des + vnt)}$.`,
        atsakymas: String(dt),
        atsakymasRodymui: `$${sk4(dt)}$`,
        sprendimas: `Trūksta dešimčių tūkstančių skyriaus: $${sk4(dt)}$.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const st = atsitiktinis(1, 9) * 100000
      const t = atsitiktinis(1, 9) * 1000
      const simt = atsitiktinis(1, 9) * 100
      const des = atsitiktinis(1, 9) * 10
      const teisingas = st + t + simt + des
      return uzdavinys(T3, {
        klausimas: `Rask klaidą ir užrašyk teisingą skaičių: $${sk4(teisingas)} = ${sk4(st)} + ${t / 10} + ${simt} + ${des}$.`,
        atsakymas: String(t),
        atsakymasRodymui: `$${sk4(t)}$`,
        sprendimas: `Tūkstančių dėmuo užrašytas dešimt kartų per mažas: turi būti $${sk4(t)}$, o ne $${t / 10}$.`,
      })
    },

    // 6. Kuri suma didesnė
    () => {
      const a = sesiazenklis()
      const b = sesiazenklis()
      if (a === b) return null
      const da = skyriuDemenys(a)
      const db = skyriuDemenys(b)
      return pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: `Kuri skyrių suma reiškia didesnį skaičių: $${da.map((d) => sk4(d)).join(' + ')}$ ar $${db.map((d) => sk4(d)).join(' + ')}$?`,
        variantai:
          a > b
            ? ['pirmoji', 'antroji', 'skaičiai lygūs']
            : ['antroji', 'pirmoji', 'skaičiai lygūs'],
        teisingas: 0,
        sprendimas: `Pirmoji duoda $${sk4(a)}$, antroji — $${sk4(b)}$.`,
      })
    },

    // 7. Iš skyrių sumos į pavadinimą
    () => {
      const st = atsitiktinis(1, 9) * 100000
      const t = atsitiktinis(1, 9) * 1000
      const vnt = atsitiktinis(1, 9)
      const rez = st + t + vnt
      return uzdavinys(T3, {
        klausimas: `Skaičių $${sk4(st)} + ${sk4(t)} + ${vnt}$ užrašyk skaitmenimis.`,
        atsakymas: String(rez),
        atsakymasRodymui: `$${sk4(rez)}$`,
        sprendimas: `Tai skaičius „${zodziais(rez)}“.`,
      })
    },
  ])
}

// ── 4.4 Trumpiniai „tūkst.“ ir „mln.“ ───────────────────────────────────────

const T4 = 'tukst-ir-mln'

const A_TRUMPINIAI = [
  {
    klausimas: 'Užrašyk skaitmenimis: 8 tūkst.',
    atsakymas: '8000',
    atsakymasRodymui: '$8000$',
    sprendimas: 'Vienas tūkstantis yra 1000, tad 8 tūkst. yra 8000.',
  },
] as const

export const tukstIrMln: Generatorius = () => suBandymais(kurkTrumpinius, A_TRUMPINIAI, T4)

function kurkTrumpinius(): Uzdavinys | null {

  return variacija([
    // 1. Tūkstančiai skaitmenimis
    () => {
      const kiekis = atsitiktinis(3, 95)
      return uzdavinys(T4, {
        klausimas: `Užrašyk skaitmenimis: ${kiekis} tūkst.`,
        atsakymas: String(kiekis * 1000),
        atsakymasRodymui: `$${sk4(kiekis * 1000)}$`,
        sprendimas: `Trumpinys „tūkst.“ reiškia tūkstančius: $${kiekis} \\cdot 1000 = ${sk4(kiekis * 1000)}$.`,
      })
    },

    // 2. Ką reiškia trumpinys
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Ką reiškia trumpinys „tūkst.“?',
        variantai: ['tūkstantį, t. y. 1000', 'šimtą', 'milijoną', 'dešimt tūkstančių'],
        teisingas: 0,
        sprendimas: 'Trumpinys rašomas vietoj žodžio „tūkstančiai“, kad ilgi skaičiai būtų trumpesni.',
      }),

    // 3. Palyginimas su milijonu
    () => {
      const tukst = atsitiktinis(880, 995)
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kuris skaičius didesnis: ${tukst} tūkst. ar 1 mln.?`,
        variantai: ['1 mln.', `${tukst} tūkst.`, 'jie lygūs'],
        teisingas: 0,
        sprendimas: `${tukst} tūkst. yra $${sk4(tukst * 1000)}$, o 1 mln. — $1\\,000\\,000$.`,
      })
    },

    // 4. Palyginimas tūkst. su pilnu užrašu
    () => {
      const tukst = atsitiktinis(120, 890)
      const pilnas = tukst * 1000 + pasirink([-500, -50, 50, 500])
      if (pilnas === tukst * 1000) return null
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Palygink: ${tukst} tūkst. ir $${sk4(pilnas)}$.`,
        variantai:
          tukst * 1000 > pilnas
            ? [`${tukst} tūkst. didesnis`, `$${sk4(pilnas)}$ didesnis`, 'skaičiai lygūs']
            : [`$${sk4(pilnas)}$ didesnis`, `${tukst} tūkst. didesnis`, 'skaičiai lygūs'],
        teisingas: 0,
        sprendimas: `${tukst} tūkst. yra $${sk4(tukst * 1000)}$.`,
      })
    },

    // 5. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: 'Rask klaidą ir užrašyk teisingą skaičių: 1 mln. $= 100\\,000$.',
        atsakymas: '1000000',
        atsakymasRodymui: '$1\\,000\\,000$',
        sprendimas: 'Milijonas yra tūkstantis tūkstančių, tad jame šeši nuliai, o užrašyta dešimt kartų mažiau.',
      }),

    // 6. Kiek tūkstančių sudaro milijoną
    () => {
      const tukst = atsitiktinis(120, 890)
      return uzdavinys(T4, {
        klausimas: `Kiek tūkstančių trūksta iki milijono, jei jau surinkta ${tukst} tūkst.?`,
        atsakymas: String(1000 - tukst),
        atsakymasRodymui: `$${1000 - tukst}$ tūkst.`,
        sprendimas: `Milijoną sudaro 1000 tūkstančių: $1000 - ${tukst} = ${1000 - tukst}$.`,
      })
    },

    // 7. 1000 tūkst. ir 1 mln.
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuo skiriasi 1000 tūkst. ir 1 mln.?',
        variantai: [
          'niekuo — tai tas pats skaičius, užrašytas dvejopai',
          '1 mln. yra dešimt kartų didesnis',
          '1000 tūkst. yra didesnis',
          '1 mln. yra šimtą kartų didesnis',
        ],
        teisingas: 0,
        sprendimas: 'Tūkstantis tūkstančių ir yra milijonas: $1000 \\cdot 1000 = 1\\,000\\,000$.',
      }),

    // 8. Milijonas žodžiais
    () =>
      uzdavinys(T4, {
        klausimas: `Užrašyk skaitmenimis: ${zodziais(1000000)}.`,
        atsakymas: '1000000',
        atsakymasRodymui: '$1\\,000\\,000$',
        sprendimas: 'Milijoną sudaro tūkstantis tūkstančių, tad po vieneto rašomi šeši nuliai.',
      }),
  ])
}

// ── 4.5 Skaičių palyginimas ─────────────────────────────────────────────────

const T5 = 'palyginimas-1000000'

const A_PALYGINIMAS = [
  {
    klausimas: 'Kuris skaičius didesnis: $456\\,200$ ar $465\\,200$?',
    atsakymas: '465200',
    atsakymasRodymui: '$465\\,200$',
    sprendimas: 'Šimtų tūkstančių skaitmenys vienodi, tad lyginamos dešimtys tūkstančių: 6 daugiau už 5.',
  },
] as const

export const palyginimas1000000: Generatorius = () => suBandymais(kurkPalyginima, A_PALYGINIMAS, T5)

function kurkPalyginima(): Uzdavinys | null {
  return variacija([
    // 1. Skiriasi vienas skyrius
    () => {
      const a = sesiazenklis()
      const skyrius = pasirink([10000, 1000, 100])
      const skaitmuo = Math.floor(a / skyrius) % 10
      if (skaitmuo >= 9) return null
      const b = a + skyrius
      if (b > 999999) return null
      return uzdavinys(T5, {
        klausimas: `Kuris skaičius didesnis: $${sk4(a)}$ ar $${sk4(b)}$?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${sk4(b)}$`,
        sprendimas: 'Lyginama nuo aukščiausio skyriaus; pirmasis skirtingas skaitmuo ir nulemia atsakymą.',
      })
    },

    // 2. Per šimtatūkstantinę ribą
    () => {
      const riba = atsitiktinis(2, 9) * 100000
      const a = riba + atsitiktinis(1, 9)
      const b = riba - atsitiktinis(1, 9)
      return uzdavinys(T5, {
        klausimas: `Kuris skaičius didesnis: $${sk4(a)}$ ar $${sk4(b)}$?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${sk4(a)}$`,
        sprendimas: `$${sk4(b)}$ dar nepasiekia $${sk4(riba)}$, o $${sk4(a)}$ jį jau peržengia.`,
      })
    },

    // 3. Rikiavimas didėjimo tvarka
    () => {
      const a = atsitiktinis(2, 8)
      const b = atsitiktinis(0, 9)
      if (a === b) return null
      const trys = [a * 100000 + b * 10000, a * 10000 + b * 100000, b * 100000 + a * 1000]
      if (new Set(trys).size < 3 || trys.some((x) => x < 10000)) return null
      const eile = [...trys].sort((x, y) => x - y)
      return eiliskumoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Surikiuok skaičius didėjimo tvarka.',
        teisingaEile: eile.map((x) => `$${sk4(x)}$`),
        sprendimas: `${eile.map((x) => tekstu(x)).join(' < ')}.`,
      })
    },

    // 4. Rikiavimas mažėjimo tvarka
    () => {
      const keturi = sumaisyk([999999, 990999, 909999, 999909])
      const eile = [...keturi].sort((x, y) => y - x)
      return eiliskumoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Surikiuok skaičius mažėjimo tvarka.',
        teisingaEile: eile.map((x) => `$${sk4(x)}$`),
        sprendimas: 'Visi prasideda devynetu, tad lemia tolesnės skiltys — lyginama iš eilės, kol randamas skirtumas.',
      })
    },

    // 5. Kodėl vienas mažesnis
    () => {
      const pagrindas = atsitiktinis(2, 9) * 100000
      const a = pagrindas + 80
      const b = pagrindas + 800
      return pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: `Kodėl $${sk4(a)}$ mažesnis už $${sk4(b)}$?`,
        variantai: [
          'nes jame nėra nė vieno šimto, o kitame jų yra 8',
          'nes jame mažiau skaitmenų',
          'nes jo skaitmenų suma mažesnė',
          'nes jo paskutinis skaitmuo mažesnis',
        ],
        teisingas: 0,
        sprendimas: `Abu skaičiai iki šimtų skyriaus sutampa. $${sk4(a)}$ turi 8 dešimtis, o $${sk4(b)}$ — 8 šimtus.`,
      })
    },

    // 6. Skaičius tarp dviejų
    () => {
      const nuo = atsitiktinis(2, 9) * 100000 + atsitiktinis(0, 9) * 10000 + atsitiktinis(0, 9) * 1000
      return uzdavinys(T5, {
        klausimas: `Užrašyk mažiausią skaičių, kuris didesnis už $${sk4(nuo)}$ ir mažesnis už $${sk4(nuo + 1000)}$.`,
        atsakymas: String(nuo + 1),
        atsakymasRodymui: `$${sk4(nuo + 1)}$`,
        sprendimas: `Iškart už $${sk4(nuo)}$ eina $${sk4(nuo + 1)}$ — jis dar gerokai mažesnis už $${sk4(nuo + 1000)}$.`,
      })
    },

    // 7. Klaidingas teiginys
    () => {
      const a = atsitiktinis(2, 8)
      const b = a + atsitiktinis(1, 9) / 10
      const maz = a * 100000 + atsitiktinis(1, 5) * 1000 + 300
      const did = Math.round(b * 100000) + atsitiktinis(1, 5) * 1000 + 300
      if (maz >= did || did > 999999) return null
      return uzdavinys(T5, {
        klausimas: `Rask klaidą teiginyje: $${sk4(maz)} > ${sk4(did)}$. Kuris iš šių skaičių iš tikrųjų didesnis?`,
        atsakymas: String(did),
        atsakymasRodymui: `$${sk4(did)}$`,
        sprendimas: `Lyginant pradedama nuo aukščiausio skyriaus, kuriame skaitmenys skiriasi — čia jis rodo, kad didesnis yra $${sk4(did)}$.`,
      })
    },

    // 8. Didžiausias iš keturių kortelių
    () => {
      const keturi = sumaisyk(
        Array.from({ length: 4 }, () => sesiazenklis()).filter((x, i, m) => m.indexOf(x) === i),
      )
      if (keturi.length < 4) return null
      return uzdavinys(T5, {
        klausimas: `Kortelėse užrašyti skaičiai $${keturi.map((x) => sk4(x)).join('$, $')}$. Koks yra mažiausias iš jų?`,
        atsakymas: String(Math.min(...keturi)),
        atsakymasRodymui: `$${sk4(Math.min(...keturi))}$`,
        sprendimas: `Surikiavus: ${[...keturi].sort((x, y) => x - y).map((x) => tekstu(x)).join(' < ')}.`,
      })
    },
  ])
}

// ── 4.6 Apvalinimas ─────────────────────────────────────────────────────────

const T6 = 'apvalinimas-1000000'

const A_APVALINIMAS = [
  {
    klausimas: 'Suapvalink $234\\,567$ iki tūkstančių.',
    atsakymas: '235000',
    atsakymasRodymui: '$235\\,000$',
    sprendimas: 'Šimtų skaitmuo 5, tad tūkstančiai apvalinami į viršų.',
  },
] as const

export const apvalinimas1000000: Generatorius = () => suBandymais(kurkApvalinima1M, A_APVALINIMAS, T6)

const TIKSLUMAI = [
  { verte: 1000, vardas: 'tūkstančių' },
  { verte: 10000, vardas: 'dešimčių tūkstančių' },
  { verte: 100000, vardas: 'šimtų tūkstančių' },
] as const

/** Apvalinimas: lygiai pusė — į viršų. */
function apvalink(n: number, tikslumas: number): number {
  return Math.round(n / tikslumas) * tikslumas
}

function kurkApvalinima1M(): Uzdavinys | null {
  const n = sesiazenklis()
  const t = pasirink(TIKSLUMAI)

  return variacija([
    // 1. Apvalinimas
    () =>
      uzdavinys(T6, {
        klausimas: `Suapvalink $${sk4(n)}$ iki ${t.vardas}.`,
        atsakymas: String(apvalink(n, t.verte)),
        atsakymasRodymui: `$${sk4(apvalink(n, t.verte))}$`,
        sprendimas: `Žiūrima į skaitmenį, esantį iškart už ${t.vardas} skyriaus: jis yra ${Math.floor(n / (t.verte / 10)) % 10}, tad apvalinama ${
          Math.floor(n / (t.verte / 10)) % 10 >= 5 ? 'į viršų' : 'į apačią'
        }.`,
      }),

    // 2. Apvalinimas per ribą
    () => {
      const pagrindas = atsitiktinis(10, 89) * 1000
      const skaicius = pagrindas + 999
      return uzdavinys(T6, {
        klausimas: `Suapvalink $${sk4(skaicius)}$ iki tūkstančių.`,
        atsakymas: String(pagrindas + 1000),
        atsakymasRodymui: `$${sk4(pagrindas + 1000)}$`,
        sprendimas: `Šimtų skaitmuo 9, tad apvalinama į viršų — iki artimiausio pilno tūkstančio $${sk4(pagrindas + 1000)}$.`,
      })
    },

    // 3. Iš brėžinio — prie kurio galo arčiau
    () => {
      const tukst = atsitiktinis(120, 890) * 1000
      const priedas = atsitiktinis(120, 880)
      const skaicius = tukst + priedas
      if (Math.abs(priedas - 500) < 60) return null
      return uzdavinys(T6, {
        klausimas: 'Iki kurio tūkstančio apvalinamas pažymėtas skaičius?',
        atsakymas: String(apvalink(skaicius, 1000)),
        atsakymasRodymui: `$${sk4(apvalink(skaicius, 1000))}$`,
        sprendimas: `Taškas yra arčiau ${priedas > 500 ? 'dešiniojo' : 'kairiojo'} galo, tad apvalinama iki $${sk4(apvalink(skaicius, 1000))}$.`,
        brezinys: apvalinimoTiese(skaicius, 1000),
      })
    },

    // 4. Mažiausias ir didžiausias
    () => {
      const tukst = atsitiktinis(12, 89) * 1000
      return uzdavinys(T6, {
        klausimas: `Koks yra mažiausias skaičius, kuris suapvalinus iki tūkstančių duoda $${sk4(tukst)}$?`,
        atsakymas: String(tukst - 500),
        atsakymasRodymui: `$${sk4(tukst - 500)}$`,
        sprendimas: `Tinka visi nuo $${sk4(tukst - 500)}$ iki $${sk4(tukst + 499)}$; mažiausias iš jų — $${sk4(tukst - 500)}$.`,
      })
    },

    // 5. Kodėl gaunamas nurodytas rezultatas
    () => {
      const st = atsitiktinis(2, 8)
      const skaicius = st * 100000 + 49999
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Kodėl $${sk4(skaicius)}$ apvalinant iki šimtų tūkstančių gaunama $${sk4(st * 100000)}$?`,
        variantai: [
          `nes dešimčių tūkstančių skaitmuo yra 4 — mažiau nei 5`,
          'nes skaičius baigiasi devynetais',
          'nes šimtų tūkstančių skaitmuo yra lyginis',
          'nes skaičius yra šešiaženklis',
        ],
        teisingas: 0,
        sprendimas: `Iki $${sk4((st + 1) * 100000)}$ trūksta daugiau nei iki $${sk4(st * 100000)}$, tad apvalinama į apačią.`,
      })
    },

    // 6. Klaidos radimas
    () => {
      const skaicius = atsitiktinis(710, 790) * 1000 + atsitiktinis(100, 900)
      const teisingas = apvalink(skaicius, 100000)
      const klaidingas = apvalink(skaicius, 10000)
      if (teisingas === klaidingas) return null
      return uzdavinys(T6, {
        klausimas: `Rask klaidą: $${sk4(skaicius)} \\approx ${sk4(klaidingas)}$, kai apvalinama iki šimtų tūkstančių. Užrašyk teisingą atsakymą.`,
        atsakymas: String(teisingas),
        atsakymasRodymui: `$${sk4(teisingas)}$`,
        sprendimas: `Apvalinant iki šimtų tūkstančių visos žemesnės skiltys virsta nuliais: $${sk4(teisingas)}$. Užrašytas skaičius suapvalintas tik iki dešimčių tūkstančių.`,
      })
    },

    // 7. Sukurti tinkantį skaičių
    () => {
      const tikslas = atsitiktinis(3, 9) * 100000
      return uzdavinys(T6, {
        klausimas: `Užrašyk didžiausią skaičių, kuris apvalinant iki dešimčių tūkstančių duoda $${sk4(tikslas)}$.`,
        atsakymas: String(tikslas + 4999),
        atsakymasRodymui: `$${sk4(tikslas + 4999)}$`,
        sprendimas: `Tinka visi nuo $${sk4(tikslas - 5000)}$ iki $${sk4(tikslas + 4999)}$; didžiausias — $${sk4(tikslas + 4999)}$.`,
      })
    },

    // 8. Du apvalinimai, vienas skaičius
    () => {
      const skaicius = sesiazenklis()
      const iki1000 = apvalink(skaicius, 1000)
      const iki10000 = apvalink(skaicius, 10000)
      if (iki1000 === iki10000) return null
      return uzdavinys(T6, {
        klausimas: `Kiek skiriasi skaičiaus $${sk4(skaicius)}$ apvalinimai iki tūkstančių ir iki dešimčių tūkstančių?`,
        atsakymas: String(Math.abs(iki1000 - iki10000)),
        atsakymasRodymui: `$${sk4(Math.abs(iki1000 - iki10000))}$`,
        sprendimas: `Iki tūkstančių — $${sk4(iki1000)}$, iki dešimčių tūkstančių — $${sk4(iki10000)}$. Skirtumas $${sk4(Math.abs(iki1000 - iki10000))}$.`,
      })
    },
  ])
}

// ── 4.7 Sudėtis iki 1 000 000 ───────────────────────────────────────────────

const T7 = 'sudetis-1000000'

const A_SUDETIS = [
  {
    klausimas: 'Apskaičiuok: $124\\,560 + 218\\,430$.',
    atsakymas: '342990',
    atsakymasRodymui: '$342\\,990$',
    sprendimas: '$124\\,560 + 218\\,430 = 342\\,990$.',
  },
] as const

export const sudetis1000000: Generatorius = () => suBandymais(kurkSudeti1M, A_SUDETIS, T7)

function kurkSudeti1M(): Uzdavinys | null {
  const a = atsitiktinis(120000, 560000)
  const b = atsitiktinis(90000, 380000)
  if (a + b > 1000000) return null

  return variacija([
    // 1. Stulpeliu
    () =>
      uzdavinys(T7, {
        klausimas: 'Sudėk stulpeliu.',
        atsakymas: String(a + b),
        atsakymasRodymui: `$${sk4(a + b)}$`,
        sprendimas: `$${sk4(a)} + ${sk4(b)} = ${sk4(a + b)}$.`,
        brezinys: stulpelis4(a, b, '+', null),
      }),

    // 2. Trūkstamas dėmuo
    () =>
      uzdavinys(T7, {
        klausimas: `Rask trūkstamą dėmenį: $\\square + ${sk4(b)} = ${sk4(a + b)}$.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${sk4(a)}$`,
        sprendimas: `$${sk4(a + b)} - ${sk4(b)} = ${sk4(a)}$.`,
      }),

    // 3. Prie apvalaus
    () => {
      const apvalus = atsitiktinis(2, 8) * 100000
      const priedas = atsitiktinis(10234, 98765)
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok mintinai: $${sk4(apvalus)} + ${sk4(priedas)}$.`,
        atsakymas: String(apvalus + priedas),
        atsakymasRodymui: `$${sk4(apvalus + priedas)}$`,
        sprendimas: `Apvalus dėmuo užima tik aukščiausią skyrių, tad skyriai nesimaišo: $${sk4(apvalus + priedas)}$.`,
      })
    },

    // 4. Su skliaustais
    () => {
      const c = atsitiktinis(20000, 60000)
      if (a + b + c > 1000000) return null
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok: $(${sk4(a)} + ${sk4(b)}) + ${sk4(c)}$.`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${sk4(a + b + c)}$`,
        sprendimas: `Skliaustuose $${sk4(a + b)}$, tada $${sk4(a + b)} + ${sk4(c)} = ${sk4(a + b + c)}$.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const klaidingas = a + b - 10000
      return uzdavinys(T7, {
        klausimas: `Rask klaidą: $${sk4(a)} + ${sk4(b)} = ${sk4(klaidingas)}$. Užrašyk teisingą sumą.`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${sk4(a + b)}$`,
        sprendimas: `Perkeliant iš tūkstančių į dešimtis tūkstančių pamesta dešimt tūkstančių. Teisingai: $${sk4(a + b)}$.`,
      })
    },

    // 6. Sumų palyginimas
    () => {
      const c = a - atsitiktinis(4000, 12000)
      const d = b + atsitiktinis(4000, 12000)
      if (c <= 0 || c + d > 1000000 || a + b === c + d) return null
      return pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: `Palygink sumas: $${sk4(a)} + ${sk4(b)}$ ir $${sk4(c)} + ${sk4(d)}$.`,
        variantai:
          a + b > c + d
            ? ['pirmoji didesnė', 'antroji didesnė', 'sumos lygios']
            : ['antroji didesnė', 'pirmoji didesnė', 'sumos lygios'],
        teisingas: 0,
        sprendimas: `$${sk4(a + b)}$ ir $${sk4(c + d)}$.`,
      })
    },

    // 7. Tekstinis
    () => {
      const miestas = pasirink(MIESTAI)
      const pirma = atsitiktinis(60, 240) * 1000
      const antra = atsitiktinis(40, 180) * 1000
      return uzdavinys(T7, {
        klausimas: `${miestas} pernai priėmė ${tekstu(pirma)} turistų, o šiemet — ${tekstu(antra)} daugiau. Kiek turistų priimta šiemet?`,
        atsakymas: String(pirma + antra),
        atsakymasRodymui: `$${sk4(pirma + antra)}$`,
        sprendimas: `$${sk4(pirma)} + ${sk4(antra)} = ${sk4(pirma + antra)}$.`,
      })
    },

    // 8. Beveik apvalūs dėmenys
    () => {
      const c = atsitiktinis(2, 6) * 100000 - 3
      const d = atsitiktinis(1, 3) * 100000 + 3
      return uzdavinys(T7, {
        klausimas: `Apskaičiuok patogiu būdu: $${sk4(c)} + ${sk4(d)}$.`,
        atsakymas: String(c + d),
        atsakymasRodymui: `$${sk4(c + d)}$`,
        sprendimas: `Trūkstamus 3 galima persikelti nuo vieno dėmens prie kito: $${sk4(c + 3)} + ${sk4(d - 3)} = ${sk4(c + d)}$.`,
      })
    },
  ])
}

// ── 4.8 Atimtis iki 1 000 000 ───────────────────────────────────────────────

const T8 = 'atimtis-1000000'

const A_ATIMTIS = [
  {
    klausimas: 'Apskaičiuok: $472\\,500 - 118\\,240$.',
    atsakymas: '354260',
    atsakymasRodymui: '$354\\,260$',
    sprendimas: '$472\\,500 - 118\\,240 = 354\\,260$.',
  },
] as const

export const atimtis1000000: Generatorius = () => suBandymais(kurkAtimti1M, A_ATIMTIS, T8)

function kurkAtimti1M(): Uzdavinys | null {
  const a = atsitiktinis(420000, 960000)
  const b = atsitiktinis(110000, 390000)

  return variacija([
    // 1. Stulpeliu
    () =>
      uzdavinys(T8, {
        klausimas: 'Atimk stulpeliu.',
        atsakymas: String(a - b),
        atsakymasRodymui: `$${sk4(a - b)}$`,
        sprendimas: `$${sk4(a)} - ${sk4(b)} = ${sk4(a - b)}$.`,
        brezinys: stulpelis4(a, b, '−', null),
      }),

    // 2. Iš apvalaus
    () => {
      const apvalus = atsitiktinis(5, 9) * 100000
      const atem = atsitiktinis(102345, 398765)
      return uzdavinys(T8, {
        klausimas: `Apskaičiuok: $${sk4(apvalus)} - ${sk4(atem)}$.`,
        atsakymas: String(apvalus - atem),
        atsakymasRodymui: `$${sk4(apvalus - atem)}$`,
        sprendimas: `Turinys apvalus, tad skolinamasi per visus skyrius iš eilės: $${sk4(apvalus - atem)}$.`,
        brezinys: stulpelis4(apvalus, atem, '−', null),
      })
    },

    // 3. Trūkstamas atėminys
    () =>
      uzdavinys(T8, {
        klausimas: `Rask trūkstamą atėminį: $${sk4(a)} - \\square = ${sk4(a - b)}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${sk4(b)}$`,
        sprendimas: `$${sk4(a)} - ${sk4(a - b)} = ${sk4(b)}$.`,
      }),

    // 4. Turinys iš skirtumo ir atėminio
    () => {
      const skirtumas = atsitiktinis(120000, 460000)
      const atem = atsitiktinis(80000, 320000)
      if (skirtumas + atem > 1000000) return null
      return uzdavinys(T8, {
        klausimas: `Skirtumas yra $${sk4(skirtumas)}$, o atėminys — $${sk4(atem)}$. Rask turinį.`,
        atsakymas: String(skirtumas + atem),
        atsakymasRodymui: `$${sk4(skirtumas + atem)}$`,
        sprendimas: `Turinys yra skirtumo ir atėminio suma: $${sk4(skirtumas + atem)}$.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const klaidingas = a - b + 10000
      return uzdavinys(T8, {
        klausimas: `Rask klaidą: $${sk4(a)} - ${sk4(b)} = ${sk4(klaidingas)}$. Užrašyk teisingą skirtumą.`,
        atsakymas: String(a - b),
        atsakymasRodymui: `$${sk4(a - b)}$`,
        sprendimas: `Skolinantis iš dešimčių tūkstančių skyriaus jis turėjo sumažėti vienetu. Teisingai: $${sk4(a - b)}$.`,
      })
    },

    // 6. Du atėmimai
    () => {
      const pirmas = atsitiktinis(120000, 280000)
      const antras = atsitiktinis(60000, 190000)
      if (a - pirmas - antras <= 0) return null
      return uzdavinys(T8, {
        klausimas: `Apskaičiuok: $${sk4(a)} - ${sk4(pirmas)} - ${sk4(antras)}$.`,
        atsakymas: String(a - pirmas - antras),
        atsakymasRodymui: `$${sk4(a - pirmas - antras)}$`,
        sprendimas: `$${sk4(a)} - ${sk4(pirmas)} = ${sk4(a - pirmas)}$, tada $${sk4(a - pirmas)} - ${sk4(antras)} = ${sk4(a - pirmas - antras)}$.`,
      })
    },

    // 7. Su skliaustais
    () => {
      const c = atsitiktinis(20000, 80000)
      if (a - b + c > 1000000) return null
      return uzdavinys(T8, {
        klausimas: `Apskaičiuok: $(${sk4(a)} - ${sk4(b)}) + ${sk4(c)}$.`,
        atsakymas: String(a - b + c),
        atsakymasRodymui: `$${sk4(a - b + c)}$`,
        sprendimas: `Skliaustuose $${sk4(a - b)}$, tada pridedama $${sk4(c)}$.`,
      })
    },

    // 8. Tekstinis
    () => {
      const buvo = atsitiktinis(500, 900) * 1000
      const pirma = atsitiktinis(80, 200) * 1000
      const antra = atsitiktinis(40, 160) * 1000
      return uzdavinys(T8, {
        klausimas: `Gamykloje buvo ${kiek(buvo, D.plyteles)}. Išvežė ${tekstu(pirma)}, vėliau dar ${tekstu(antra)}. Kiek plytelių liko?`,
        atsakymas: String(buvo - pirma - antra),
        atsakymasRodymui: `$${sk4(buvo - pirma - antra)}$`,
        sprendimas: `Iš viso išvežta $${sk4(pirma + antra)}$, liko $${sk4(buvo - pirma - antra)}$.`,
      })
    },
  ])
}

// ── 4.9 Daugyba iki 1 000 000 ───────────────────────────────────────────────

const T9 = 'daugyba-1000000'

const A_DAUGYBA = [
  {
    klausimas: 'Apskaičiuok: $3\\,200 \\cdot 300$.',
    atsakymas: '960000',
    atsakymasRodymui: '$960\\,000$',
    sprendimas: '$32 \\cdot 3 = 96$, tad prirašomi keturi nuliai.',
  },
] as const

export const daugyba1000000: Generatorius = () => suBandymais(kurkDaugyba1M, A_DAUGYBA, T9)

function kurkDaugyba1M(): Uzdavinys | null {
  return variacija([
    // 1. Apvalus iš apvalaus
    () => {
      const a = atsitiktinis(12, 32) * 100
      const b = atsitiktinis(2, 9) * 100
      if (a * b > 1000000) return null
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${sk4(a)} \\cdot ${b}$.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `$${a / 100} \\cdot ${b / 100} = ${(a / 100) * (b / 100)}$, ir prirašomi keturi nuliai: $${sk4(a * b)}$.`,
      })
    },

    // 2. Penkiaženklis iš vienaženklio
    () => {
      const a = atsitiktinis(12400, 98600)
      const b = atsitiktinis(3, 9)
      if (a * b > 1000000) return null
      return uzdavinys(T9, {
        klausimas: 'Padaugink stulpeliu.',
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `$${sk4(a)} \\cdot ${b} = ${sk4(a * b)}$.`,
        brezinys: daugybaStulpeliu(a, b, 'tuscias'),
      })
    },

    // 3. Keturženklis iš dviženklio
    () => {
      const a = atsitiktinis(1200, 4800)
      const b = atsitiktinis(23, 78)
      if (a * b > 1000000) return null
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${sk4(a)} \\cdot ${b}$.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `$${sk4(a)} \\cdot ${b % 10} = ${sk4(a * (b % 10))}$, $${sk4(a)} \\cdot ${Math.floor(b / 10) * 10} = ${sk4(a * Math.floor(b / 10) * 10)}$, suma $${sk4(a * b)}$.`,
      })
    },

    // 4. Du veiksmai
    () => {
      const a = atsitiktinis(110, 240) * 100
      const b = atsitiktinis(2, 5) * 10
      const c = atsitiktinis(240, 680)
      if (a * b + c * 100 > 1000000) return null
      return uzdavinys(T9, {
        klausimas: `Apskaičiuok: $${sk4(a)} \\cdot ${b} + ${c} \\cdot 100$.`,
        atsakymas: String(a * b + c * 100),
        atsakymasRodymui: `$${sk4(a * b + c * 100)}$`,
        sprendimas: `Pirma abi daugybos: $${sk4(a * b)}$ ir $${sk4(c * 100)}$. Suma: $${sk4(a * b + c * 100)}$.`,
      })
    },

    // 5. Nežinomas daugiklis
    () => {
      const a = atsitiktinis(1200, 4800)
      const b = atsitiktinis(20, 90)
      if (a * b > 1000000) return null
      return uzdavinys(T9, {
        klausimas: `Rask nežinomą daugiklį: $${sk4(a)} \\cdot x = ${sk4(a * b)}$.`,
        atsakymas: String(b),
        atsakymasRodymui: `$x = ${b}$`,
        sprendimas: `$${sk4(a * b)} : ${sk4(a)} = ${b}$.`,
      })
    },

    // 6. Klaidos radimas
    () => {
      const a = atsitiktinis(30, 90) * 100
      const b = atsitiktinis(20, 40)
      if (a * b > 1000000) return null
      const klaidingas = a * b / 10
      if (!Number.isInteger(klaidingas)) return null
      return uzdavinys(T9, {
        klausimas: `Rask klaidą: $${sk4(a)} \\cdot ${b} = ${sk4(klaidingas)}$. Užrašyk teisingą sandaugą.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `Pirmasis daugiklis baigiasi dviem nuliais, tad jie abu turi atsirasti ir sandaugoje: $${sk4(a * b)}$.`,
      })
    },

    // 7. Tekstinis
    () => {
      const vietu = atsitiktinis(240, 480)
      const dienu = atsitiktinis(120, 300)
      if (vietu * dienu > 1000000) return null
      return uzdavinys(T9, {
        klausimas: `Kino salėje ${vietu} vietos. Kiek žiūrovų joje tilptų per ${dienu} dienas, jei kasdien vyktų vienas pilnas seansas?`,
        atsakymas: String(vietu * dienu),
        atsakymasRodymui: `$${sk4(vietu * dienu)}$`,
        sprendimas: `$${vietu} \\cdot ${dienu} = ${sk4(vietu * dienu)}$.`,
      })
    },

    // 8. Įvertinimas
    () => {
      const a = atsitiktinis(1800, 4600)
      const b = atsitiktinis(120, 210)
      if (a * b > 1000000) return null
      const apytiksliai = Math.round(a / 1000) * 1000 * (Math.round(b / 100) * 100)
      if (apytiksliai > 1000000 || apytiksliai === 0) return null
      return uzdavinys(T9, {
        klausimas: `Apvalink pirmąjį daugiklį iki tūkstančių, antrąjį — iki šimtų, ir apskaičiuok apytikslę sandaugą: $${sk4(a)} \\cdot ${b}$.`,
        atsakymas: String(apytiksliai),
        atsakymasRodymui: `$${sk4(apytiksliai)}$`,
        sprendimas: `$${sk4(Math.round(a / 1000) * 1000)} \\cdot ${Math.round(b / 100) * 100} = ${sk4(apytiksliai)}$. Tikslus atsakymas $${sk4(a * b)}$.`,
      })
    },
  ])
}

// ── 4.10 Dalyba iki 1 000 000 ───────────────────────────────────────────────

const T10 = 'dalyba-1000000'

const A_DALYBA = [
  {
    klausimas: 'Apskaičiuok: $72\\,000 : 9$.',
    atsakymas: '8000',
    atsakymasRodymui: '$8000$',
    sprendimas: '$72 : 9 = 8$, tad $72\\,000 : 9 = 8000$.',
  },
] as const

export const dalyba1000000: Generatorius = () => suBandymais(kurkDalyba1M, A_DALYBA, T10)

function kurkDalyba1M(): Uzdavinys | null {
  return variacija([
    // 1. Apvalus iš vienaženklio
    () => {
      const daliklis = atsitiktinis(3, 9)
      const dalmuo = atsitiktinis(1200, 9990) * 10
      const dalinys = dalmuo * daliklis
      if (dalinys > 1000000) return null
      return uzdavinys(T10, {
        klausimas: `Apskaičiuok: $${sk4(dalinys)} : ${daliklis}$.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${sk4(dalmuo)}$`,
        sprendimas: `$${sk4(dalinys)} : ${daliklis} = ${sk4(dalmuo)}$.`,
      })
    },

    // 2. Dalyba iš apvalaus
    () => {
      const daliklis = atsitiktinis(2, 9) * 100
      const dalmuo = atsitiktinis(120, 900)
      const dalinys = dalmuo * daliklis
      if (dalinys > 1000000) return null
      return uzdavinys(T10, {
        klausimas: `Apskaičiuok: $${sk4(dalinys)} : ${daliklis}$.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${sk4(dalmuo)}$`,
        sprendimas: `Nubraukiam po du nulius: $${sk4(dalinys / 100)} : ${daliklis / 100} = ${sk4(dalmuo)}$.`,
      })
    },

    // 3. Dalyba kampu iš dviženklio
    () => {
      const daliklis = atsitiktinis(12, 24)
      const dalmuo = atsitiktinis(1200, 4600)
      const dalinys = dalmuo * daliklis
      if (dalinys > 1000000) return null
      return uzdavinys(T10, {
        klausimas: 'Padalyk kampu ir užrašyk dalmenį.',
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${sk4(dalmuo)}$`,
        sprendimas: `$${sk4(dalinys)} : ${daliklis} = ${sk4(dalmuo)}$.`,
        brezinys: dalybaKampu(dalinys, daliklis),
      })
    },

    // 4. Nežinomas dalinys
    () => {
      const daliklis = atsitiktinis(6, 9)
      const dalmuo = atsitiktinis(9000, 99000)
      if (daliklis * dalmuo > 1000000) return null
      return uzdavinys(T10, {
        klausimas: `Rask nežinomą skaičių: $x : ${daliklis} = ${sk4(dalmuo)}$.`,
        atsakymas: String(daliklis * dalmuo),
        atsakymasRodymui: `$x = ${sk4(daliklis * dalmuo)}$`,
        sprendimas: `$${sk4(dalmuo)} \\cdot ${daliklis} = ${sk4(daliklis * dalmuo)}$.`,
      })
    },

    // 5. Klaidos radimas
    () => {
      const daliklis = atsitiktinis(2, 8) * 10
      const dalmuo = atsitiktinis(1200, 9000)
      const dalinys = dalmuo * daliklis
      if (dalinys > 1000000) return null
      return uzdavinys(T10, {
        klausimas: `Rask klaidą: $${sk4(dalinys)} : ${daliklis} = ${sk4(dalmuo * 10)}$. Užrašyk teisingą dalmenį.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${sk4(dalmuo)}$`,
        sprendimas: `Nulį reikia nubraukti abiejuose skaičiuose, o ne tik dalinyje: $${sk4(dalinys / 10)} : ${daliklis / 10} = ${sk4(dalmuo)}$.`,
      })
    },

    // 6. Dalmenų palyginimas
    () => {
      const a = atsitiktinis(3, 9) * 90000
      const b = atsitiktinis(3, 9)
      const c = atsitiktinis(3, 9) * 120000
      const d = atsitiktinis(4, 12)
      if (a > 1000000 || c > 1000000 || a % b !== 0 || c % d !== 0 || a / b === c / d) return null
      return pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: `Kuris dalmuo didesnis: $${sk4(a)} : ${b}$ ar $${sk4(c)} : ${d}$?`,
        variantai:
          a / b > c / d
            ? [`$${sk4(a)} : ${b}$`, `$${sk4(c)} : ${d}$`, 'dalmenys lygūs']
            : [`$${sk4(c)} : ${d}$`, `$${sk4(a)} : ${b}$`, 'dalmenys lygūs'],
        teisingas: 0,
        sprendimas: `$${sk4(a / b)}$ ir $${sk4(c / d)}$.`,
      })
    },

    // 7. Tekstinis
    () => {
      const kaina = atsitiktinis(3, 9) * 100
      const kiekis = atsitiktinis(200, 900)
      if (kaina * kiekis > 1000000) return null
      return uzdavinys(T10, {
        klausimas: `Už ${tekstu(kaina * kiekis)} Eur nupirkta kompiuterių po ${kaina} Eur. Kiek kompiuterių nupirkta?`,
        atsakymas: String(kiekis),
        atsakymasRodymui: `$${kiekis}$`,
        sprendimas: `$${sk4(kaina * kiekis)} : ${kaina} = ${kiekis}$.`,
      })
    },

    // 8. Dalyba ir atimtis
    () => {
      const daliklis = atsitiktinis(4, 8)
      const dalmuo = atsitiktinis(9000, 90000)
      const dalinys = dalmuo * daliklis
      const atem = atsitiktinis(1200, 8000)
      if (dalinys > 1000000 || dalmuo - atem <= 0) return null
      return uzdavinys(T10, {
        klausimas: `Apskaičiuok: $${sk4(dalinys)} : ${daliklis} - ${sk4(atem)}$.`,
        atsakymas: String(dalmuo - atem),
        atsakymasRodymui: `$${sk4(dalmuo - atem)}$`,
        sprendimas: `Pirma dalyba: $${sk4(dalmuo)}$. Tada $${sk4(dalmuo)} - ${sk4(atem)} = ${sk4(dalmuo - atem)}$.`,
      })
    },
  ])
}

// ── 4.11 Patogus mintinio skaičiavimo būdas ─────────────────────────────────

const T11 = 'mintinis-skaiciavimas'

const A_MINTINIS = [
  {
    klausimas: 'Kaip patogiausia mintinai apskaičiuoti $198 + 47$?',
    atsakymas: '245',
    atsakymasRodymui: '$245$',
    sprendimas: 'Prie 198 pridėjus 2 gaunama 200, tad $200 + 45 = 245$.',
  },
] as const

export const mintinisSkaiciavimas: Generatorius = () => suBandymais(kurkMintini, A_MINTINIS, T11)

function kurkMintini(): Uzdavinys | null {
  return variacija([
    // 1. Papildymas iki apvalaus
    () => {
      const apvalus = atsitiktinis(3, 9) * 1000
      const truksta = atsitiktinis(1, 4)
      const antras = atsitiktinis(120, 890)
      return uzdavinys(T11, {
        klausimas: `Apskaičiuok patogiu būdu: $${sk4(apvalus - truksta)} + ${antras}$.`,
        atsakymas: String(apvalus - truksta + antras),
        atsakymasRodymui: `$${sk4(apvalus - truksta + antras)}$`,
        sprendimas: `Prie $${sk4(apvalus - truksta)}$ pridėjus ${truksta} gaunama apvalus $${sk4(apvalus)}$, tad $${sk4(apvalus)} + ${antras - truksta} = ${sk4(apvalus - truksta + antras)}$.`,
      })
    },

    // 2. Daugyba per skaidymą
    () => {
      const a = atsitiktinis(12, 48)
      const b = pasirink([9, 11, 19, 21, 99, 101])
      if (a * b > 1000000) return null
      const apvalus = b < 100 ? Math.round(b / 10) * 10 : 100
      const skirtumas = b - apvalus
      return uzdavinys(T11, {
        klausimas: `Apskaičiuok patogiu būdu: $${a} \\cdot ${b}$.`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${sk4(a * b)}$`,
        sprendimas: `$${b} = ${apvalus} ${skirtumas > 0 ? '+' : '-'} ${Math.abs(skirtumas)}$, tad $${a} \\cdot ${apvalus} ${skirtumas > 0 ? '+' : '-'} ${a} \\cdot ${Math.abs(skirtumas)} = ${sk4(a * apvalus)} ${skirtumas > 0 ? '+' : '-'} ${a * Math.abs(skirtumas)} = ${sk4(a * b)}$.`,
      })
    },

    // 3. Kuris būdas patogesnis
    () => {
      const a = atsitiktinis(24, 96)
      const b = pasirink([25, 50])
      const c = 4
      if (a * b * c > 1000000) return null
      return pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: `Kaip patogiausia mintinai apskaičiuoti $${a} \\cdot ${b} \\cdot ${c}$?`,
        variantai: [
          `pirma $${b} \\cdot ${c}$, nes gaunamas apvalus ${b * c}`,
          `pirma $${a} \\cdot ${b}$, nes tai pirmieji du daugikliai`,
          'tvarka nesvarbu — visais atvejais vienodai sunku',
          `pirma $${a} \\cdot ${c}$, nes ${c} yra mažiausias`,
        ],
        teisingas: 0,
        sprendimas: `$${b} \\cdot ${c} = ${b * c}$, tad lieka $${a} \\cdot ${b * c} = ${sk4(a * b * c)}$ — tai suskaičiuojama mintinai.`,
      })
    },

    // 4. Atimtis apvalinant atėminį
    () => {
      const a = atsitiktinis(4200, 9800)
      const apvalus = atsitiktinis(2, 8) * 100
      const truksta = atsitiktinis(1, 4)
      if (a - (apvalus - truksta) <= 0) return null
      return uzdavinys(T11, {
        klausimas: `Apskaičiuok patogiu būdu: $${sk4(a)} - ${apvalus - truksta}$.`,
        atsakymas: String(a - (apvalus - truksta)),
        atsakymasRodymui: `$${sk4(a - (apvalus - truksta))}$`,
        sprendimas: `Atimam apvalų $${apvalus}$ ir grąžinam ${truksta}: $${sk4(a - apvalus)} + ${truksta} = ${sk4(a - (apvalus - truksta))}$.`,
      })
    },

    // 5. Dalyba per skaidymą
    () => {
      const dalmuo = atsitiktinis(120, 480)
      const dalinys = dalmuo * 4
      return uzdavinys(T11, {
        klausimas: `Apskaičiuok patogiu būdu: $${sk4(dalinys)} : 4$.`,
        atsakymas: String(dalmuo),
        atsakymasRodymui: `$${sk4(dalmuo)}$`,
        sprendimas: `Dalyti iš 4 patogu du kartus dalijant iš 2: $${sk4(dalinys)} : 2 = ${sk4(dalinys / 2)}$, $${sk4(dalinys / 2)} : 2 = ${sk4(dalmuo)}$.`,
      })
    },

    // 6. Klaidos radimas
    () => {
      const a = atsitiktinis(1200, 4800)
      const apvalus = atsitiktinis(2, 8) * 100
      const truksta = atsitiktinis(1, 4)
      const klaidingas = a - apvalus - truksta
      return uzdavinys(T11, {
        klausimas: `Skaičiuodamas $${sk4(a)} - ${apvalus - truksta}$ mokinys atėmė apvalų ${apvalus} ir dar ${truksta}, gaudamas $${sk4(klaidingas)}$. Užrašyk teisingą skirtumą.`,
        atsakymas: String(a - (apvalus - truksta)),
        atsakymasRodymui: `$${sk4(a - (apvalus - truksta))}$`,
        sprendimas: `Atėmus per daug, perteklių reikia grąžinti, o ne atimti dar kartą: $${sk4(a - apvalus)} + ${truksta} = ${sk4(a - (apvalus - truksta))}$.`,
      })
    },

    // 7. Sumos pergrupavimas
    () => {
      const a = atsitiktinis(120, 480)
      const b = atsitiktinis(120, 480)
      const c = 1000 - (a % 1000)
      if (c <= 0 || c > 900) return null
      return uzdavinys(T11, {
        klausimas: `Apskaičiuok patogiu būdu: $${a} + ${b} + ${c}$.`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${sk4(a + b + c)}$`,
        sprendimas: `$${a} + ${c} = ${sk4(a + c)}$ yra apvalus, tad lieka $${sk4(a + c)} + ${b} = ${sk4(a + b + c)}$.`,
      })
    },
  ])
}

// ── 4.12 Skaičiavimo rezultato patikra ──────────────────────────────────────

const T12 = 'rezultato-patikra'

const A_PATIKRA = [
  {
    klausimas: 'Kaip patikrinti, ar teisingai apskaičiuota $340 + 260 = 600$?',
    atsakymas: '340',
    atsakymasRodymui: '$340$',
    sprendimas: 'Iš sumos atimamas vienas dėmuo: $600 - 260 = 340$ — gaunamas kitas dėmuo, tad veiksmas teisingas.',
  },
] as const

export const rezultatoPatikra: Generatorius = () => suBandymais(kurkPatikra, A_PATIKRA, T12)

function kurkPatikra(): Uzdavinys | null {
  return variacija([
    // 1. Sudėties patikra atimtimi
    () => {
      const a = atsitiktinis(1200, 8600)
      const b = atsitiktinis(1200, 6400)
      return uzdavinys(T12, {
        klausimas: `Apskaičiuota $${sk4(a)} + ${sk4(b)} = ${sk4(a + b)}$. Iš sumos atimk antrąjį dėmenį ir užrašyk, ką gavai.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${sk4(a)}$`,
        sprendimas: `$${sk4(a + b)} - ${sk4(b)} = ${sk4(a)}$ — gautas pirmasis dėmuo, tad sudėtis atlikta teisingai.`,
      })
    },

    // 2. Atimties patikra sudėtimi
    () => {
      const a = atsitiktinis(4200, 9800)
      const b = atsitiktinis(1200, 3800)
      return uzdavinys(T12, {
        klausimas: `Apskaičiuota $${sk4(a)} - ${sk4(b)} = ${sk4(a - b)}$. Prie skirtumo pridėk atėminį ir užrašyk, ką gavai.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${sk4(a)}$`,
        sprendimas: `$${sk4(a - b)} + ${sk4(b)} = ${sk4(a)}$ — gautas turinys, tad atimtis teisinga.`,
      })
    },

    // 3. Daugybos patikra dalyba
    () => {
      const a = atsitiktinis(120, 480)
      const b = atsitiktinis(12, 48)
      return uzdavinys(T12, {
        klausimas: `Apskaičiuota $${a} \\cdot ${b} = ${sk4(a * b)}$. Sandaugą padalyk iš ${b} ir užrašyk, ką gavai.`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$`,
        sprendimas: `$${sk4(a * b)} : ${b} = ${a}$ — gautas pirmasis daugiklis, tad sandauga teisinga.`,
      })
    },

    // 4. Kuriuo veiksmu tikrinama
    () => {
      const veiksmas = pasirink([
        { kas: 'sudėtis', tikra: 'atimtimi', kiti: ['sudėtimi', 'daugyba', 'dalyba'] },
        { kas: 'atimtis', tikra: 'sudėtimi', kiti: ['atimtimi', 'daugyba', 'dalyba'] },
        { kas: 'daugyba', tikra: 'dalyba', kiti: ['daugyba', 'sudėtimi', 'atimtimi'] },
        { kas: 'dalyba', tikra: 'daugyba', kiti: ['dalyba', 'sudėtimi', 'atimtimi'] },
      ])
      return pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: `Kuriuo veiksmu patikrinama, ar teisingai atlikta ${veiksmas.kas}?`,
        variantai: [veiksmas.tikra, ...veiksmas.kiti],
        teisingas: 0,
        sprendimas: `Kiekvienas veiksmas tikrinamas jam atvirkštiniu.`,
      })
    },

    // 5. Ar rezultatas tikroviškas
    () => {
      const a = atsitiktinis(2400, 4800)
      const b = atsitiktinis(2400, 4800)
      const klaidingas = a + b + 10000
      return pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: `Ar gali būti, kad $${sk4(a)} + ${sk4(b)} = ${sk4(klaidingas)}$?`,
        variantai: [
          'ne, abu dėmenys mažesni už 5000, tad suma negali viršyti 10 000',
          'taip, suma teisinga',
          'ne, suma turi būti dar didesnė',
        ],
        teisingas: 0,
        sprendimas: `Apytikslis įvertinimas: $${sk4(a)} + ${sk4(b)}$ yra apie $${sk4(Math.round((a + b) / 1000) * 1000)}$, o ne $${sk4(klaidingas)}$.`,
      })
    },

    // 6. Patikra apvalinimu
    () => {
      const a = atsitiktinis(2100, 4900)
      const b = atsitiktinis(1100, 3900)
      return uzdavinys(T12, {
        klausimas: `Prieš skaičiuodamas $${sk4(a)} + ${sk4(b)}$ apvalink abu dėmenis iki tūkstančių. Kokį apytikslį rezultatą gauni?`,
        atsakymas: String(Math.round(a / 1000) * 1000 + Math.round(b / 1000) * 1000),
        atsakymasRodymui: `$${sk4(Math.round(a / 1000) * 1000 + Math.round(b / 1000) * 1000)}$`,
        sprendimas: `$${sk4(Math.round(a / 1000) * 1000)} + ${sk4(Math.round(b / 1000) * 1000)} = ${sk4(Math.round(a / 1000) * 1000 + Math.round(b / 1000) * 1000)}$. Tikslus atsakymas $${sk4(a + b)}$ nuo jo skiriasi nedaug — vadinasi, skaičiavimas įtikimas.`,
      })
    },

    // 7. Paskutinis skaitmuo
    () => {
      const a = atsitiktinis(1240, 4860)
      const b = atsitiktinis(3, 9)
      const teisingas = a * b
      const klaidingas = teisingas + pasirink([2, 3, 4])
      return uzdavinys(T12, {
        klausimas: `Nesuskaičiuodamas iki galo nustatyk, kuo turi baigtis sandauga $${sk4(a)} \\cdot ${b}$.`,
        atsakymas: String(teisingas % 10),
        atsakymasRodymui: `$${teisingas % 10}$`,
        sprendimas: `Paskutinį sandaugos skaitmenį lemia tik vienetai: $${a % 10} \\cdot ${b} = ${(a % 10) * b}$, tad sandauga baigiasi ${teisingas % 10}. Atsakymas $${sk4(klaidingas)}$ tuo pasitikrinus iškart atmetamas.`,
      })
    },
  ])
}

// ── 4.13 Perteklinė informacija ─────────────────────────────────────────────

const T13 = 'pertekliniai-duomenys'

const A_PERTEKLIUS = [
  {
    klausimas: 'Sąlygoje nurodyta knygos kaina, puslapių skaičius ir autoriaus gimimo metai. Kurio duomens reikia norint sužinoti dviejų knygų kainą?',
    atsakymas: 'kaina',
    atsakymasRodymui: 'knygos kainos',
    sprendimas: 'Kainai rasti reikia tik vienos knygos kainos.',
  },
] as const

export const pertekliniaiDuomenys: Generatorius = () =>
  suBandymais(kurkPertekliu, A_PERTEKLIUS, T13)

function kurkPertekliu(): Uzdavinys | null {
  const vardas = pasirink(VARDAI)

  return variacija([
    // 1. Kurio duomens nereikia
    () => {
      const kaina = atsitiktinis(4, 15)
      const kiekis = atsitiktinis(3, 9)
      const metai = atsitiktinis(1990, 2020)
      return pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: `Sąlyga: „Knyga kainuoja ${kaina} Eur, ji išleista ${metai} metais, ${vardas} nusipirko ${kiekis} tokias knygas.“ Kurio duomens nereikia bendrai kainai rasti?`,
        variantai: [`išleidimo metai (${metai})`, `knygos kaina (${kaina} Eur)`, `knygų skaičius (${kiekis})`],
        teisingas: 0,
        sprendimas: `Kaina randama $${kaina} \\cdot ${kiekis} = ${kaina * kiekis}$ Eur — metai skaičiavimui nereikalingi.`,
      })
    },

    // 2. Suskaičiuoti atmetus perteklių
    () => {
      const kaina = atsitiktinis(4, 15)
      const kiekis = atsitiktinis(3, 9)
      const puslapiu = atsitiktinis(120, 400)
      return uzdavinys(T13, {
        klausimas: `Knyga kainuoja ${kaina} Eur ir turi ${kiek(puslapiu, D.puslapiai)}. ${vardas} nusipirko ${kiekis} tokias knygas. Kiek sumokėta?`,
        atsakymas: String(kaina * kiekis),
        atsakymasRodymui: `$${kaina * kiekis}$ Eur`,
        sprendimas: `Puslapių skaičius kainai neturi reikšmės: $${kaina} \\cdot ${kiekis} = ${kaina * kiekis}$ Eur.`,
      })
    },

    // 3. Kurio duomens trūksta
    () => {
      const kiekis = atsitiktinis(4, 12)
      return pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: `Sąlyga: „${vardas} nupirko ${kiekis} sąsiuvinius.“ Ko trūksta norint sužinoti, kiek sumokėta?`,
        variantai: [
          'vieno sąsiuvinio kainos',
          'sąsiuvinių spalvos',
          'parduotuvės pavadinimo',
          'pirkimo datos',
        ],
        teisingas: 0,
        sprendimas: 'Be vieno sąsiuvinio kainos bendros sumos apskaičiuoti neįmanoma.',
      })
    },

    // 4. Du klausimai, skirtingi duomenys
    () => {
      const greitis = atsitiktinis(40, 90)
      const laikas = atsitiktinis(2, 6)
      const keleiviu = atsitiktinis(20, 50)
      return pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: `Sąlyga: „Autobusas važiavo ${laikas} valandas ${greitis} km/h greičiu ir vežė ${kiek(keleiviu, D.keleiviai)}.“ Kurie duomenys reikalingi nuvažiuotam keliui rasti?`,
        variantai: [
          `greitis ir laikas`,
          `keleivių skaičius ir laikas`,
          `keleivių skaičius ir greitis`,
          'visi trys duomenys',
        ],
        teisingas: 0,
        sprendimas: `Kelias randamas greitį padauginus iš laiko: $${greitis} \\cdot ${laikas} = ${greitis * laikas}$ km.`,
      })
    },

    // 5. Kiek duomenų nereikalingi
    () => {
      const a = atsitiktinis(120, 480)
      const b = atsitiktinis(3, 9)
      const c = atsitiktinis(10, 40)
      const d = atsitiktinis(2, 8)
      return uzdavinys(T13, {
        klausimas: `Sąlygoje pateikti keturi skaičiai: ${a}, ${b}, ${c} ir ${d}. Klausiama, kiek iš viso sąsiuvinių yra ${b} dėžėse po ${a}. Kiek pateiktų skaičių šiam klausimui nereikalingi?`,
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: `Reikalingi tik ${a} ir ${b}: $${a} \\cdot ${b} = ${sk4(a * b)}$. Likę du skaičiai — pertekliniai.`,
      })
    },

    // 6. Klaida dėl perteklinio duomens
    () => {
      const kaina = atsitiktinis(4, 12)
      const kiekis = atsitiktinis(3, 9)
      const metai = atsitiktinis(1990, 2020)
      return uzdavinys(T13, {
        klausimas: `Sąlyga: „Knyga kainuoja ${kaina} Eur, išleista ${metai} metais, nupirktos ${kiekis} knygos.“ Mokinys užrašė $${kaina} \\cdot ${kiekis} \\cdot ${metai}$. Užrašyk teisingą sumokėtą sumą.`,
        atsakymas: String(kaina * kiekis),
        atsakymasRodymui: `$${kaina * kiekis}$ Eur`,
        sprendimas: `Metai į skaičiavimą neįtraukiami: $${kaina} \\cdot ${kiekis} = ${kaina * kiekis}$ Eur.`,
      })
    },

    // 7. Į kurį klausimą galima atsakyti
    () => {
      const ilgis = atsitiktinis(6, 15)
      const plotis = atsitiktinis(3, 9)
      return pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: `Sąlyga: „Sklypas ${ilgis} m ilgio ir ${plotis} m pločio.“ Į kurį klausimą iš šių duomenų atsakyti negalima?`,
        variantai: [
          'Kiek kainuoja sklypas?',
          'Koks sklypo plotas?',
          'Koks sklypo perimetras?',
          'Kiek metrų tvoros reikia sklypui aptverti?',
        ],
        teisingas: 0,
        sprendimas: `Plotą ($${ilgis * plotis}$ m²) ir perimetrą ($${(ilgis + plotis) * 2}$ m) rasti galima, o kainai reikėtų kvadratinio metro kainos.`,
      })
    },
  ])
}

// ── 4.14 Kelių žingsnių tekstinis uždavinys ─────────────────────────────────

const T14 = 'keliu-zingsniu-uzdavinys'

const A_KELI_ZINGSNIAI = [
  {
    klausimas: 'Parduotuvė gavo 1200 obuolių. Pirmą dieną pardavė 340, antrą — 260. Kiek liko?',
    atsakymas: '600',
    atsakymasRodymui: '$600$',
    sprendimas: '$1200 - 340 - 260 = 600$.',
  },
] as const

export const keliuZingsniuUzdavinys: Generatorius = () =>
  suBandymais(kurkKeliuZingsniu, A_KELI_ZINGSNIAI, T14)

function kurkKeliuZingsniu(): Uzdavinys | null {
  const vardas = pasirink(VARDAI)

  return variacija([
    // 1. Trys žingsniai su likučiu
    () => {
      const buvo = atsitiktinis(24, 90) * 100
      const pirma = atsitiktinis(4, 18) * 100
      const antra = atsitiktinis(3, 14) * 100
      if (buvo - pirma - antra <= 0) return null
      return uzdavinys(T14, {
        klausimas: `Parduotuvė gavo ${kiek(buvo, D.obuoliai)}. Pirmą dieną pardavė ${tekstu(pirma)}, antrą — ${tekstu(antra)}. Kiek obuolių liko?`,
        atsakymas: String(buvo - pirma - antra),
        atsakymasRodymui: `$${sk4(buvo - pirma - antra)}$`,
        sprendimas: `$${sk4(buvo)} - ${sk4(pirma)} - ${sk4(antra)} = ${sk4(buvo - pirma - antra)}$.`,
      })
    },

    // 2. Daugyba ir sudėtis
    () => {
      const deziu = atsitiktinis(12, 40)
      const dezeje = atsitiktinis(20, 60)
      const atskirai = atsitiktinis(40, 200)
      return uzdavinys(T14, {
        klausimas: `Sandėlyje ${deziu} dėžės po ${dezeje} sąsiuvinius ir dar ${kiek(atskirai, D.sasiuviniai)} lentynoje. Kiek sąsiuvinių sandėlyje?`,
        atsakymas: String(deziu * dezeje + atskirai),
        atsakymasRodymui: `$${sk4(deziu * dezeje + atskirai)}$`,
        sprendimas: `$${deziu} \\cdot ${dezeje} = ${sk4(deziu * dezeje)}$, tada $${sk4(deziu * dezeje)} + ${atskirai} = ${sk4(deziu * dezeje + atskirai)}$.`,
      })
    },

    // 3. Dalyba ir atimtis su schema
    () => {
      const viso = atsitiktinis(12, 40) * 100
      const daliu = pasirink([2, 4, 5])
      const dalis = viso / daliu
      return uzdavinys(T14, {
        klausimas: `Iš ${kiek(viso, D.knygos)} ${daliu} kartus mažiau yra enciklopedijų nei visų knygų. Kiek knygų nėra enciklopedijos?`,
        atsakymas: String(viso - dalis),
        atsakymasRodymui: `$${sk4(viso - dalis)}$`,
        sprendimas: `Enciklopedijų $${sk4(viso)} : ${daliu} = ${sk4(dalis)}$, kitų knygų $${sk4(viso)} - ${sk4(dalis)} = ${sk4(viso - dalis)}$.`,
        brezinys: juostuSchema(
          [
            { vardas: 'Enciklopedijos', dalys: 1, uzrasas: '?' },
            { vardas: 'Visos knygos', dalys: daliu, uzrasas: tekstu(viso) },
          ],
        ),
      })
    },

    // 4. Skirtumas po dviejų veiksmų
    () => {
      const a = atsitiktinis(120, 480)
      const b = atsitiktinis(3, 8)
      const c = atsitiktinis(120, 480)
      const d = atsitiktinis(3, 8)
      if (a * b === c * d) return null
      return uzdavinys(T14, {
        klausimas: `Pirmoje salėje ${b} eilės po ${a} vietas, antroje — ${d} eilės po ${c} vietas. Keliomis vietomis skiriasi salės?`,
        atsakymas: String(Math.abs(a * b - c * d)),
        atsakymasRodymui: `$${sk4(Math.abs(a * b - c * d))}$`,
        sprendimas: `$${a} \\cdot ${b} = ${sk4(a * b)}$, $${c} \\cdot ${d} = ${sk4(c * d)}$, skirtumas $${sk4(Math.abs(a * b - c * d))}$.`,
      })
    },

    // 5. Kiek liko pinigų
    () => {
      const turejo = atsitiktinis(50, 200)
      const kiekis = atsitiktinis(3, 8)
      const kaina = atsitiktinis(4, 15)
      if (kiekis * kaina >= turejo) return null
      return uzdavinys(T14, {
        klausimas: `${vardas} turėjo ${kiek(turejo, D.eurus)}. Nupirko ${kiekis} knygas po ${kaina} Eur. Kiek pinigų liko?`,
        atsakymas: String(turejo - kiekis * kaina),
        atsakymasRodymui: `$${turejo - kiekis * kaina}$ Eur`,
        sprendimas: `Išleista $${kiekis} \\cdot ${kaina} = ${kiekis * kaina}$ Eur, liko $${turejo} - ${kiekis * kaina} = ${turejo - kiekis * kaina}$ Eur.`,
      })
    },

    // 6. Kelintas žingsnis pirmas
    () => {
      const deziu = atsitiktinis(8, 20)
      const dezeje = atsitiktinis(20, 50)
      const isvezta = atsitiktinis(100, 300)
      if (deziu * dezeje <= isvezta) return null
      return pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: `Uždavinys: „Sandėlyje ${deziu} dėžės po ${dezeje} sąsiuvinius. Išvežta ${isvezta}. Kiek liko?“ Kurį veiksmą reikia atlikti pirmą?`,
        variantai: [
          `$${deziu} \\cdot ${dezeje}$ — kiek buvo iš viso`,
          `$${deziu} - ${isvezta}$`,
          `$${dezeje} - ${isvezta}$`,
          `$${isvezta} : ${dezeje}$`,
        ],
        teisingas: 0,
        sprendimas: `Pirma randama, kiek buvo iš viso ($${sk4(deziu * dezeje)}$), ir tik tada atimama išvežta dalis: $${sk4(deziu * dezeje - isvezta)}$.`,
      })
    },

    // 7. Klaidos radimas
    () => {
      const deziu = atsitiktinis(8, 20)
      const dezeje = atsitiktinis(20, 50)
      const isvezta = atsitiktinis(100, 300)
      if (deziu * dezeje <= isvezta) return null
      return uzdavinys(T14, {
        klausimas: `Uždavinys: „${deziu} dėžės po ${dezeje} sąsiuvinius, išvežta ${isvezta}. Kiek liko?“ Mokinys užrašė $${deziu} \\cdot (${dezeje} - ${isvezta})$. Užrašyk teisingą atsakymą.`,
        atsakymas: String(deziu * dezeje - isvezta),
        atsakymasRodymui: `$${sk4(deziu * dezeje - isvezta)}$`,
        sprendimas: `Išvežta ne iš kiekvienos dėžės, o iš viso: $${deziu} \\cdot ${dezeje} - ${isvezta} = ${sk4(deziu * dezeje - isvezta)}$.`,
      })
    },
  ])
}

// ── 4.15 Reiškinys su skliaustais ───────────────────────────────────────────

const T15 = 'reiskinys-su-skliaustais'

const A_SKLIAUSTAI = [
  {
    klausimas: 'Dviejose dėžėse po 12 ir 18 obuolių. Visi jie išdalyti po lygiai 5 vaikams. Kiek gavo kiekvienas?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: '$(12 + 18) : 5 = 6$.',
  },
] as const

export const reiskinysSuSkliaustais: Generatorius = () =>
  suBandymais(kurkSkliaustus, A_SKLIAUSTAI, T15)

function kurkSkliaustus(): Uzdavinys | null {
  return variacija([
    // 1. Suma padalijama
    () => {
      const daliu = atsitiktinis(3, 8)
      const a = atsitiktinis(2, 12) * daliu
      const b = atsitiktinis(2, 12) * daliu
      return uzdavinys(T15, {
        klausimas: `Dviejose dėžėse yra ${a} ir ${b} obuoliai. Visi jie išdalyti po lygiai ${daliu} vaikams. Kiek obuolių gavo kiekvienas?`,
        atsakymas: String((a + b) / daliu),
        atsakymasRodymui: `$${(a + b) / daliu}$`,
        sprendimas: `Reiškinys: $(${a} + ${b}) : ${daliu} = ${a + b} : ${daliu} = ${(a + b) / daliu}$.`,
      })
    },

    // 2. Skirtumas padauginamas
    () => {
      const a = atsitiktinis(40, 120)
      const b = atsitiktinis(10, 39)
      const k = atsitiktinis(3, 9)
      return uzdavinys(T15, {
        klausimas: `Pirmoje lentynoje ${a} knygos, antroje — ${b}. Kiek knygų būtų, jei tokių lentynų porų būtų ${k}, o iš kiekvienos poros paimtume tik skirtumą?`,
        atsakymas: String((a - b) * k),
        atsakymasRodymui: `$${sk4((a - b) * k)}$`,
        sprendimas: `Reiškinys: $(${a} - ${b}) \\cdot ${k} = ${a - b} \\cdot ${k} = ${sk4((a - b) * k)}$.`,
      })
    },

    // 3. Parinkti reiškinį
    () => {
      const a = atsitiktinis(20, 60)
      const b = atsitiktinis(20, 60)
      const k = atsitiktinis(2, 6)
      return pasirinkimoUzdavinys(naujasId(T15), T15, {
        klausimas: `Uždavinys: „Vieną dieną surinkta ${a} kg, kitą — ${b} kg uogų. Tiek pat surinkta kiekvieną iš ${k} savaičių. Kiek uogų surinkta?“ Kuris reiškinys tinka?`,
        variantai: [
          `$(${a} + ${b}) \\cdot ${k}$`,
          `$${a} + ${b} \\cdot ${k}$`,
          `$${a} \\cdot ${k} + ${b}$`,
          `$(${a} + ${b}) : ${k}$`,
        ],
        teisingas: 0,
        sprendimas: `Per savaitę surenkama $${a} + ${b} = ${a + b}$ kg, o savaičių ${k}: $${sk4((a + b) * k)}$ kg.`,
      })
    },

    // 4. Kur būtini skliaustai
    () => {
      const a = atsitiktinis(20, 90)
      const b = atsitiktinis(10, 40)
      const k = atsitiktinis(3, 8)
      if ((a + b) * k === a + b * k) return null
      return pasirinkimoUzdavinys(naujasId(T15), T15, {
        klausimas: `Kodėl reiškinyje $(${a} + ${b}) \\cdot ${k}$ skliaustai būtini?`,
        variantai: [
          'be jų pirma būtų atliekama daugyba, ir rezultatas pasikeistų',
          'be jų reiškinio nebūtų galima perskaityti',
          'skliaustai nebūtini — rezultatas tas pats',
          'be jų daugyba būtų atliekama paskutinė',
        ],
        teisingas: 0,
        sprendimas: `Su skliaustais gaunama $${sk4((a + b) * k)}$, be jų — $${sk4(a + b * k)}$.`,
      })
    },

    // 5. Reiškinys su dviem veiksmais skliaustuose
    () => {
      const a = atsitiktinis(60, 200)
      const b = atsitiktinis(10, 50)
      const c = atsitiktinis(10, 50)
      const k = atsitiktinis(2, 6)
      if (a - b - c <= 0) return null
      return uzdavinys(T15, {
        klausimas: `Iš ${a} kg atsargų kasdien sunaudojama ${b} kg, o dar ${c} kg atidedama. Kiek kilogramų liks po ${k} tokių dienų? Sudaryk reiškinį ir apskaičiuok.`,
        atsakymas: String(a - (b + c) * k),
        atsakymasRodymui: `$${a - (b + c) * k}$ kg`,
        sprendimas: `Reiškinys: $${a} - (${b} + ${c}) \\cdot ${k} = ${a} - ${(b + c) * k} = ${a - (b + c) * k}$.`,
      }) ?? null
    },

    // 6. Klaida — trūksta skliaustų
    () => {
      const a = atsitiktinis(20, 80)
      const b = atsitiktinis(10, 40)
      const k = atsitiktinis(3, 8)
      return uzdavinys(T15, {
        klausimas: `Uždavinys: „Į ${k} dėžes sudėta po ${a} raudonų ir ${b} žalių obuolių. Kiek obuolių iš viso?“ Mokinys užrašė $${a} + ${b} \\cdot ${k}$. Užrašyk teisingą atsakymą.`,
        atsakymas: String((a + b) * k),
        atsakymasRodymui: `$${sk4((a + b) * k)}$`,
        sprendimas: `Dauginti reikia visą dėžės turinį, tad būtini skliaustai: $(${a} + ${b}) \\cdot ${k} = ${sk4((a + b) * k)}$.`,
      })
    },

    // 7. Reiškinio reikšmė iš uždavinio
    () => {
      const viso = atsitiktinis(200, 800)
      const dalis = atsitiktinis(40, 120)
      const daliu = atsitiktinis(2, 6)
      if ((viso - dalis) % daliu !== 0) return null
      return uzdavinys(T15, {
        klausimas: `Iš ${viso} bilietų ${dalis} jau parduoti, o likusieji išdalyti po lygiai ${daliu} kasoms. Kiek bilietų teko vienai kasai?`,
        atsakymas: String((viso - dalis) / daliu),
        atsakymasRodymui: `$${(viso - dalis) / daliu}$`,
        sprendimas: `Reiškinys: $(${viso} - ${dalis}) : ${daliu} = ${viso - dalis} : ${daliu} = ${(viso - dalis) / daliu}$.`,
      })
    },
  ])
}

// ── 4.16 Matematinis klausimas pagal duomenis ───────────────────────────────

const T16 = 'matematinis-klausimas'

const A_KLAUSIMAS = [
  {
    klausimas: 'Duota: 5 dėžės, kiekvienoje po 12 obuolių. Koks matematinis klausimas tinka šiems duomenims?',
    atsakymas: '60',
    atsakymasRodymui: '„Kiek obuolių iš viso?“ — $60$',
    sprendimas: '$5 \\cdot 12 = 60$.',
  },
] as const

export const matematinisKlausimas: Generatorius = () => suBandymais(kurkKlausima, A_KLAUSIMAS, T16)

function kurkKlausima(): Uzdavinys | null {
  const vardas = pasirink(VARDAI)

  return variacija([
    // 1. Kuris klausimas tinka duomenims
    () => {
      const deziu = atsitiktinis(4, 12)
      const dezeje = atsitiktinis(8, 30)
      return pasirinkimoUzdavinys(naujasId(T16), T16, {
        klausimas: `Duomenys: ${deziu} dėžės, kiekvienoje po ${dezeje} obuolius. Kuris klausimas tinka šiems duomenims?`,
        variantai: [
          'Kiek obuolių iš viso?',
          'Kiek kainuoja vienas obuolys?',
          'Kiek dėžių liko tuščių?',
          'Kiek sveria viena dėžė?',
        ],
        teisingas: 0,
        sprendimas: `Iš dėžių skaičiaus ir obuolių dėžėje randama tik bendra suma: $${deziu} \\cdot ${dezeje} = ${sk4(deziu * dezeje)}$.`,
      })
    },

    // 2. Sudaryti klausimą ir atsakyti
    () => {
      const deziu = atsitiktinis(4, 12)
      const dezeje = atsitiktinis(8, 30)
      return uzdavinys(T16, {
        klausimas: `Duomenys: ${deziu} dėžės, kiekvienoje po ${dezeje} obuolius. Sugalvok klausimą „Kiek obuolių iš viso?“ ir į jį atsakyk.`,
        atsakymas: String(deziu * dezeje),
        atsakymasRodymui: `$${sk4(deziu * dezeje)}$`,
        sprendimas: `$${deziu} \\cdot ${dezeje} = ${sk4(deziu * dezeje)}$.`,
      })
    },

    // 3. Klausimas, į kurį atsakyti negalima
    () => {
      const ilgis = atsitiktinis(20, 90)
      const laikas = atsitiktinis(2, 8)
      return pasirinkimoUzdavinys(naujasId(T16), T16, {
        klausimas: `Duomenys: kelias ${ilgis} km, kelionė truko ${laikas} valandas. Į kurį klausimą iš šių duomenų atsakyti negalima?`,
        variantai: [
          'Kiek kainavo kelionė?',
          'Koks buvo vidutinis greitis?',
          'Kiek kilometrų nuvažiuota per vieną valandą?',
          'Kiek kilometrų liktų nuvažiuoti, jei visas kelias būtų dvigubai ilgesnis?',
        ],
        teisingas: 0,
        sprendimas: 'Kainai reikėtų kuro ar bilieto kainos, o jos duomenyse nėra.',
      })
    },

    // 4. Klausimas dviem veiksmams
    () => {
      const turejo = atsitiktinis(40, 120)
      const kiekis = atsitiktinis(3, 8)
      const kaina = atsitiktinis(3, 12)
      if (kiekis * kaina >= turejo) return null
      return pasirinkimoUzdavinys(naujasId(T16), T16, {
        klausimas: `Duomenys: ${vardas} turėjo ${turejo} Eur, nupirko ${kiekis} knygas po ${kaina} Eur. Kuriam klausimui atsakyti reikia dviejų veiksmų?`,
        variantai: [
          'Kiek pinigų liko?',
          'Kiek knygų nupirkta?',
          'Kiek kainuoja viena knyga?',
          'Kiek pinigų turėjo iš pradžių?',
        ],
        teisingas: 0,
        sprendimas: `Pirma $${kiekis} \\cdot ${kaina} = ${kiekis * kaina}$, tada $${turejo} - ${kiekis * kaina} = ${turejo - kiekis * kaina}$.`,
      })
    },

    // 5. Į kokį klausimą atsako reiškinys
    () => {
      const a = atsitiktinis(120, 480)
      const b = atsitiktinis(30, 110)
      return pasirinkimoUzdavinys(naujasId(T16), T16, {
        klausimas: `Duomenys: mokykloje ${a} mokiniai, iš jų ${b} pirmokai. Į kokį klausimą atsako reiškinys $${a} - ${b}$?`,
        variantai: [
          'Kiek mokinių nėra pirmokai?',
          'Kiek iš viso mokinių?',
          'Kiek kartų daugiau vyresnių nei pirmokų?',
          'Kiek pirmokų mokykloje?',
        ],
        teisingas: 0,
        sprendimas: `Iš visų mokinių atėmus pirmokus lieka vyresnieji: $${a} - ${b} = ${a - b}$.`,
      })
    },

    // 6. Trūkstamas duomuo klausimui
    () => {
      const plotas = atsitiktinis(20, 90)
      return pasirinkimoUzdavinys(naujasId(T16), T16, {
        klausimas: `Duomenys: kambario plotas ${plotas} m². Kokio duomens trūksta klausimui „Kiek kainuos grindų danga?“?`,
        variantai: [
          'vieno kvadratinio metro dangos kainos',
          'kambario aukščio',
          'langų skaičiaus',
          'kambario pavadinimo',
        ],
        teisingas: 0,
        sprendimas: 'Bendra kaina randama plotą padauginus iš vieno kvadratinio metro kainos.',
      })
    },

    // 7. Klausimas, kuriam duomenų pakanka
    () => {
      const eiliu = atsitiktinis(8, 24)
      const eileje = atsitiktinis(10, 30)
      const parduota = atsitiktinis(40, 120)
      if (eiliu * eileje <= parduota) return null
      return uzdavinys(T16, {
        klausimas: `Duomenys: salėje ${eiliu} eilės po ${eileje} vietas, parduota ${parduota} bilietai. Sudaryk klausimą „Kiek vietų liko laisvų?“ ir į jį atsakyk.`,
        atsakymas: String(eiliu * eileje - parduota),
        atsakymasRodymui: `$${sk4(eiliu * eileje - parduota)}$`,
        sprendimas: `$${eiliu} \\cdot ${eileje} = ${sk4(eiliu * eileje)}$, tada $${sk4(eiliu * eileje)} - ${parduota} = ${sk4(eiliu * eileje - parduota)}$.`,
      })
    },
  ])
}
