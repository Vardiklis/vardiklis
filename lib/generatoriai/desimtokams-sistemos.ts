import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { funkcijosGrafikas, keliosKreives } from './devintokams-vaizdai'
import { ivestiesLentele } from './penktokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 10 klasės tema „Lygčių su dviem nežinomaisiais sistemos“ — šešios potemės.
 *
 * Grafiniuose uždaviniuose kreivės braižomos iš tų pačių funkcijų, apie kurias
 * klausiama, tad susikirtimo taškas brėžinyje sutampa su algebriniu sprendiniu.
 * Skaičiai parenkami taip, kad susikirtimo koordinatės būtų sveikosios —
 * kitaip iš grafiko nuskaityti nebūtų ko.
 */

/** Trupmena KaTeX pavidalu. */
function tr(virsus: string, apacia: string): string {
  return `\\dfrac{${virsus}}{${apacia}}`
}

/** Laisvasis narys su tvarkingu ženklu. */
function plius(b: number): string {
  return b < 0 ? ` - ${-b}` : ` + ${b}`
}

/** Sistemos užrašas dviem eilutėmis. */
function sistema(pirma: string, antra: string): string {
  return `\\begin{cases} ${pirma} \\\\ ${antra} \\end{cases}`
}

// ── 3.1. Lygčių sistema ir jos sprendiniai ──────────────────────────────────

const T1 = 'sistemos-samprata'

const A1 = [
  {
    klausimas: 'Rask sveikųjų skaičių porą, tenkinančią sistemą $\\begin{cases} x + y = 5 \\\\ xy = 6 \\end{cases}$. Užrašyk didesnįjį skaičių.',
    atsakymas: '3',
    atsakymasRodymui: '$3$ (pora $(2; 3)$)',
    sprendimas: 'Skaičiai yra lygties $t^2 - 5t + 6 = 0$ šaknys: $2$ ir $3$.',
  },
] as const

export const sistemosSamprata: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {
  const p = atsitiktinis(2, 6)
  const q = atsitiktinis(3, 9)

  return variacija([
    // 1. Ar pora tenkina abi lygtis
    () => {
      if (p === q) return null
      const suma = p + q
      const sandauga = p * q
      return pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: `Ar pora $(${p}; ${q})$ yra sistemos $${sistema(`x + y = ${suma}`, `xy = ${sandauga + 1}`)}$ sprendinys?`,
        variantai: [
          `Ne — pirmoji lygtis tenkinama, bet antroji ne: $${p} \\cdot ${q} = ${sandauga}$`,
          'Taip — tenkinamos abi lygtys',
          'Taip, nes tenkinama pirmoji lygtis',
          'Negalima nustatyti',
        ],
        teisingas: 0,
        sprendimas: 'Sprendiniu vadinama tik ta pora, kuri tenkina visas sistemos lygtis vienu metu.',
      })
    },

    // 2. Sprendinio apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ką reiškia sistemos su dviem nežinomaisiais sprendinys?',
        variantai: [
          'Skaičių porą, kuri kiekvieną sistemos lygtį paverčia teisinga lygybe',
          'Bet kurį skaičių, tinkantį vienai lygčiai',
          'Dviejų lygčių sumą',
          'Didesnįjį iš dviejų nežinomųjų',
        ],
        teisingas: 0,
        sprendimas: 'Tenkinti reikia visas lygtis vienu metu, o ne bet kurią vieną.',
      }),

    // 3. Poros tikrinimas skaičiavimu
    () => {
      if (p === q) return null
      return uzdavinys(T1, {
        klausimas: `Pora $(${p}; ${q})$ tenkina sistemą $${sistema(`xy = ${p * q}`, `x + y = ${p + q}`)}$. Kiek gautum, įrašęs šią porą į kairiąją pirmosios lygties pusę?`,
        atsakymas: String(p * q),
        atsakymasRodymui: `$${p * q}$`,
        sprendimas: `$${p} \\cdot ${q} = ${p * q}$ — tiek pat, kiek ir dešinėje pusėje, tad pirmoji lygtis tenkinama.`,
      })
    },

    // 4. Sistemos sudarymas pagal duotą porą
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kurią sistemą tenkina pora $(3; -1)$?',
        variantai: [
          '$\\begin{cases} x + y = 2 \\\\ xy = -3 \\end{cases}$',
          '$\\begin{cases} x + y = 2 \\\\ xy = 3 \\end{cases}$',
          '$\\begin{cases} x + y = 4 \\\\ xy = -3 \\end{cases}$',
          '$\\begin{cases} x - y = 2 \\\\ xy = -3 \\end{cases}$',
        ],
        teisingas: 0,
        sprendimas: '$3 + (-1) = 2$ ir $3 \\cdot (-1) = -3$ — abi lygtys tenkinamos.',
      }),

    // 5. Kiek lygčių turi tenkinti pora
    () =>
      uzdavinys(T1, {
        klausimas: 'Sistemą sudaro dvi lygtys su dviem nežinomaisiais. Kiek iš jų turi tenkinti skaičių pora, kad būtų vadinama sistemos sprendiniu?',
        atsakymas: '2',
        atsakymasRodymui: '$2$ — abi',
        sprendimas: 'Sprendinys turi tikti visoms sistemos lygtims vienu metu.',
      }),

    // 6. Sveikųjų skaičių poros
    () => {
      if (p >= q) return null
      return uzdavinys(T1, {
        klausimas: `Rask sveikųjų skaičių porą, tenkinančią sistemą $${sistema(`x + y = ${p + q}`, `xy = ${p * q}`)}$. Užrašyk didesnįjį skaičių.`,
        atsakymas: String(q),
        atsakymasRodymui: `$${q}$ (pora $(${p}; ${q})$)`,
        sprendimas: `Skaičiai yra lygties $t^2 - ${p + q}t + ${p * q} = 0$ šaknys: $${p}$ ir $${q}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Mokinys porą patikrino tik pirmojoje sistemos lygtyje ir paskelbė ją sprendiniu. Kur klaida?',
        variantai: [
          'Pora gali tenkinti vieną lygtį ir netenkinti kitos, tad tikrinti reikia abi',
          'Tikrinti reikėjo tik antrąją lygtį',
          'Klaidos nėra, pakanka vienos lygties',
          'Reikėjo lygtis sudėti ir tikrinti sumą',
        ],
        teisingas: 0,
        sprendimas: 'Sistemos sprendinys yra bendra abiejų lygčių sprendinių dalis.',
      }),

    // 8. Sistema pagal du sprendinius
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kurios sistemos sprendiniai yra $(1; 2)$ ir $(2; 1)$?',
        variantai: [
          '$\\begin{cases} x + y = 3 \\\\ xy = 2 \\end{cases}$',
          '$\\begin{cases} x + y = 3 \\\\ xy = 3 \\end{cases}$',
          '$\\begin{cases} x - y = 1 \\\\ xy = 2 \\end{cases}$',
          '$\\begin{cases} x + y = 2 \\\\ xy = 2 \\end{cases}$',
        ],
        teisingas: 0,
        sprendimas: 'Abiejų porų suma yra $3$, o sandauga $2$; simetrinė sistema abi poras ir grąžina.',
      }),

    // 9. Apskritimas ir tiesė
    () => {
      const trejetas = pasirink([
        { r: 5, y: 4, x: 3 },
        { r: 5, y: 3, x: 4 },
        { r: 13, y: 12, x: 5 },
        { r: 10, y: 8, x: 6 },
      ])
      return uzdavinys(T1, {
        klausimas: `Nustatyk, ar sistema $${sistema(`x^2 + y^2 = ${trejetas.r * trejetas.r}`, `y = ${trejetas.y}`)}$ turi realiųjų sprendinių, ir užrašyk teigiamą $x$ reikšmę.`,
        atsakymas: String(trejetas.x),
        atsakymasRodymui: `$x = ${trejetas.x}$`,
        sprendimas: `$x^2 = ${trejetas.r * trejetas.r} - ${trejetas.y * trejetas.y} = ${trejetas.x * trejetas.x}$, tad $x = ${trejetas.x}$ arba $x = ${-trejetas.x}$ — sprendiniai realūs.`,
      })
    },

    // 10. Geometrinė prasmė
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kokia yra sistemos sprendinio geometrinė prasmė, kai abi lygtis galima pavaizduoti grafikais?',
        variantai: [
          'Tai grafikų susikirtimo taško koordinatės',
          'Tai atstumas tarp grafikų',
          'Tai grafikų susikirtimo kampas',
          'Tai grafikų ilgių suma',
        ],
        teisingas: 0,
        sprendimas: 'Bendrame taške abi lygybės teisingos vienu metu, tad jo koordinatės ir yra sprendinys.',
      }),
  ])
}

// ── 3.2. Atvirkštinio proporcingumo funkcija ────────────────────────────────

const T2 = 'atvirkstinis-proporcingumas'

const A2 = [
  {
    klausimas: 'Duota $y = \\dfrac{12}{x}$. Rask $y$, kai $x = 3$.',
    atsakymas: '4',
    atsakymasRodymui: '$y = 4$',
    sprendimas: '$y = \\dfrac{12}{3} = 4$.',
  },
] as const

export const atvirkstinisProporcingumas: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  const k = pasirink([6, 8, 10, 12, 18, 24])
  const x = pasirink([2, 3, 4, 6])

  return variacija([
    // 1. Reikšmės radimas
    () => {
      if (k % x !== 0) return null
      return uzdavinys(T2, {
        klausimas: `Duota $y = ${tr(String(k), 'x')}$, kai $x \\ne 0$. Rask $y$, kai $x = ${x}$.`,
        atsakymas: String(k / x),
        atsakymasRodymui: `$y = ${k / x}$`,
        sprendimas: `$y = ${tr(String(k), String(x))} = ${k / x}$.`,
      })
    },

    // 2. Koeficiento radimas
    () => {
      const y = pasirink([3, 5, 6, 9])
      return uzdavinys(T2, {
        klausimas: `Funkcijos $y = ${tr('k', 'x')}$ grafikas eina per tašką $(${x}; ${y})$. Rask $k$.`,
        atsakymas: String(x * y),
        atsakymasRodymui: `$k = ${x * y}$`,
        sprendimas: `Iš $y = ${tr('k', 'x')}$ gauname $k = xy = ${x} \\cdot ${y} = ${x * y}$.`,
      })
    },

    // 3. Ar taškas priklauso grafikui
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Ar taškas $(-2; -5)$ priklauso funkcijos $y = \\dfrac{10}{x}$ grafikui?',
        variantai: [
          'Taip, nes $\\dfrac{10}{-2} = -5$',
          'Ne, nes abi koordinatės neigiamos',
          'Ne, nes $k > 0$',
          'Taip, nes $-2 \\cdot (-5) = 10$, o to pakanka bet kuriai funkcijai',
        ],
        teisingas: 0,
        sprendimas: 'Įrašius $x = -2$, gaunama $y = -5$ — lygybė teisinga, tad taškas priklauso grafikui.',
      }),

    // 4. Apibrėžimo sritis
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kodėl $x = 0$ nepriklauso funkcijos $y = \\dfrac{8}{x}$ apibrėžimo sričiai?',
        variantai: [
          'Nes dalyba iš nulio neapibrėžta',
          'Nes tada $y = 0$',
          'Nes tada $y = 8$',
          'Nes funkcija apibrėžta tik teigiamiems skaičiams',
        ],
        teisingas: 0,
        sprendimas: 'Vardiklis negali būti nulis, tad apibrėžimo sritis yra visi realieji skaičiai, išskyrus $0$.',
      }),

    // 5. k ženklas iš grafiko
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Brėžinyje pavaizduota hiperbolė. Koks yra jos koeficiento $k$ ženklas?',
        variantai: [
          'Teigiamas — šakos yra I ir III ketvirčiuose',
          'Neigiamas — šakos yra II ir IV ketvirčiuose',
          'Lygus nuliui',
          'Iš grafiko nustatyti neįmanoma',
        ],
        teisingas: 0,
        brezinys: keliosKreives([{ f: (t) => 6 / t }], { iki: 6 }),
        sprendimas: 'Kai $k > 0$, $x$ ir $y$ yra to paties ženklo, tad šakos gula į I ir III ketvirčius.',
      }),

    // 6. Neigiamas koeficientas
    () =>
      uzdavinys(T2, {
        klausimas: 'Funkcijos $y = \\dfrac{k}{x}$ grafikas eina per tašką $(-3; 8)$. Rask $k$.',
        atsakymas: '-24',
        atsakymasRodymui: '$k = -24$',
        sprendimas: '$k = xy = (-3) \\cdot 8 = -24$; kadangi $k < 0$, šakos yra II ir IV ketvirčiuose.',
        brezinys: keliosKreives([{ f: (t) => -24 / t }], { iki: 8 }),
      }),

    // 7. Tiesioginis ir atvirkštinis proporcingumas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Mokinys teigia, kad $y = \\dfrac{12}{x}$ yra tiesioginio proporcingumo funkcija. Kuo skiriasi šios priklausomybės?',
        variantai: [
          'Tiesioginio proporcingumo funkcija yra $y = kx$ — kai $x$ didėja, didėja ir $y$; atvirkštinio $y = \\dfrac{k}{x}$ — kai $x$ didėja, $y$ mažėja',
          'Skirtumo nėra, abi vadinamos proporcingumu',
          'Tiesioginio proporcingumo grafikas yra hiperbolė',
          'Atvirkštinio proporcingumo grafikas yra tiesė',
        ],
        teisingas: 0,
        brezinys: keliosKreives(
          [
            { f: (t) => 2 * t, vardas: 'y = 2x' },
            { f: (t) => 6 / t, vardas: 'y = 6/x' },
          ],
          { iki: 6 },
        ),
        sprendimas: 'Tiesioginio proporcingumo grafikas yra tiesė per pradžios tašką, atvirkštinio — hiperbolė.',
      }),

    // 8. Reali situacija
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuri situacija aprašoma atvirkštinio proporcingumo funkcija $y = \\dfrac{k}{x}$?',
        variantai: [
          'Pastovus $120$ km kelias: kelionės laikas priklauso nuo greičio',
          'Prekės kaina priklauso nuo perkamo kiekio',
          'Kvadrato perimetras priklauso nuo kraštinės',
          'Sutaupyta suma didėja po $5$ Eur kas savaitę',
        ],
        teisingas: 0,
        sprendimas: '$t = \\dfrac{120}{v}$: kuo didesnis greitis, tuo mažesnis laikas, o jų sandauga pastovi.',
      }),

    // 9. Dvi hiperbolės
    () =>
      poruUzdavinys(naujasId(T2), T2, {
        klausimas: 'Brėžinyje pavaizduotos dvi hiperbolės. Susiek formules su ketvirčiais, kuriuose yra jų šakos.',
        poros: [
          { kaire: '$y = \\dfrac{5}{x}$', desine: 'I ir III ketvirčiai' },
          { kaire: '$y = -\\dfrac{5}{x}$', desine: 'II ir IV ketvirčiai' },
        ],
        brezinys: keliosKreives(
          [
            { f: (t) => 5 / t, vardas: 'y = 5/x' },
            { f: (t) => -5 / t, vardas: 'y = -5/x' },
          ],
          { iki: 6 },
        ),
        sprendimas: 'Koeficiento ženklas nulemia, ar $x$ ir $y$ yra to paties, ar priešingų ženklų.',
      }),

    // 10. Reikšmių lentelė
    () => {
      const sandauga = 24
      const reiksme = pasirink([3, 4, 6, 8])
      return uzdavinys(T2, {
        klausimas: `Duota $xy = ${sandauga}$. Brėžinyje pradėta pildyti reikšmių lentelė. Kokia $y$ reikšmė, kai $x = ${reiksme}$?`,
        atsakymas: String(sandauga / reiksme),
        atsakymasRodymui: `$y = ${sandauga / reiksme}$`,
        sprendimas: `Iš $xy = ${sandauga}$ gauname $y = ${tr(String(sandauga), String(reiksme))} = ${sandauga / reiksme}$. Didėjant teigiamam $x$, $y$ mažėja.`,
        brezinys: ivestiesLentele([1, 2, reiksme], [24, 12, null]),
      })
    },
  ])
}

// ── 3.3. Sistemų sprendimas grafiniu būdu ───────────────────────────────────

const T3 = 'sistemos-grafiskai-10'

const A3 = [
  {
    klausimas: 'Brėžinyje pavaizduoti tiesės ir parabolės grafikai. Užrašyk didesniąją susikirtimo taškų $x$ koordinatę.',
    atsakymas: '2',
    atsakymasRodymui: '$x = 2$',
    sprendimas: 'Iš $x^2 = x + 2$ gauname $x^2 - x - 2 = 0$, tad $x = 2$ arba $x = -1$.',
  },
] as const

export const sistemosGrafiskai10: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  return variacija([
    // 1. Parabolė ir tiesė
    () => {
      const pora = pasirink([
        { b: 2, didesnis: 2, mazesnis: -1 },
        { b: 6, didesnis: 3, mazesnis: -2 },
      ])
      return uzdavinys(T3, {
        klausimas: 'Brėžinyje pavaizduoti parabolės ir tiesės grafikai. Užrašyk didesniąją jų susikirtimo taškų $x$ koordinatę.',
        atsakymas: String(pora.didesnis),
        atsakymasRodymui: `$x = ${pora.didesnis}$`,
        sprendimas: `Iš $x^2 = x + ${pora.b}$ gauname $x^2 - x - ${pora.b} = 0$, tad $x = ${pora.didesnis}$ ir $x = ${pora.mazesnis}$.`,
        brezinys: keliosKreives(
          [
            { f: (t) => t * t, vardas: 'y = x²' },
            { f: (t) => t + pora.b, vardas: `y = x + ${pora.b}` },
          ],
          // Langas parenkamas taip, kad susikirtimo taškas tikrai matytųsi:
          // ties $x = 3$ parabolė pakyla iki $y = 9$.
          { iki: Math.max(7, pora.didesnis * pora.didesnis + 2) },
        ),
      })
    },

    // 2. Hiperbolė ir tiesė
    () =>
      uzdavinys(T3, {
        klausimas: 'Brėžinyje pavaizduoti hiperbolės ir tiesės grafikai. Užrašyk teigiamą susikirtimo taško $x$ koordinatę.',
        atsakymas: '2',
        atsakymasRodymui: '$x = 2$',
        sprendimas: 'Iš $\\dfrac{6}{x} = x + 1$ gauname $x^2 + x - 6 = 0$, tad $x = 2$ arba $x = -3$.',
        brezinys: keliosKreives(
          [
            { f: (t) => 6 / t, vardas: 'y = 6/x' },
            { f: (t) => t + 1, vardas: 'y = x + 1' },
          ],
          { iki: 7 },
        ),
      }),

    // 3. Susikirtimo taško prasmė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ką reiškia dviejų grafikų susikirtimo taškas?',
        variantai: [
          'Jo koordinatės tenkina abi lygtis, tad tai sistemos sprendinys',
          'Tai taškas, kuriame abi funkcijos lygios nuliui',
          'Tai grafikų aukščiausias taškas',
          'Tai taškas, kuriame grafikai kerta $Ox$ ašį',
        ],
        teisingas: 0,
        sprendimas: 'Bendrame taške abiejų funkcijų reikšmės sutampa su ta pačia $x$ reikšme.',
      }),

    // 4. Galimi sprendinių skaičiai
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kiek sprendinių gali turėti tiesės ir parabolės sistema?',
        variantai: [
          'Nulį, vieną arba du',
          'Tik du',
          'Tik vieną',
          'Bet kiek — nuo nulio iki begalybės',
        ],
        teisingas: 0,
        sprendimas: 'Tiesė gali parabolės nekirsti, ją liesti viename taške arba kirsti dviejuose.',
      }),

    // 5. Sprendinių nuskaitymas iš grafiko
    () => {
      // Tik pilnieji kvadratai: iš grafiko nuskaitoma tik sveikoji reikšmė, o
      // atsakymo langelyje $\sqrt{3}$ mokinys užrašyti negalėtų.
      const saknis = pasirink([1, 2, 3])
      return uzdavinys(T3, {
        klausimas: 'Brėžinyje pavaizduota parabolė. Užrašyk didesniąją $x$ reikšmę, ties kuria ji kerta $Ox$ ašį.',
        atsakymas: String(saknis),
        atsakymasRodymui: `$x = ${saknis}$`,
        sprendimas: `Iš $x^2${plius(-saknis * saknis)} = 0$ gauname $x^2 = ${saknis * saknis}$, tad $x = ${saknis}$ arba $x = ${-saknis}$.`,
        // Langas platinamas iki viršūnės: siauresniame parabolės dugnas
        // nukristų už rėmo ir kreivė atrodytų nutrūkusi.
        brezinys: funkcijosGrafikas((t) => t * t - saknis * saknis, { iki: Math.max(6, saknis * saknis + 2) }),
      })
    },

    // 6. Parabolė ir tiesė su pažymėtais taškais
    () =>
      uzdavinys(T3, {
        klausimas: 'Brėžinyje pavaizduota parabolė ir tiesė. Nuskaityk didesniąją susikirtimo taškų $x$ koordinatę ir patikrink ją algebriškai.',
        atsakymas: '3',
        atsakymasRodymui: '$x = 3$',
        sprendimas: 'Iš $x^2 - 3 = 2x$ gauname $x^2 - 2x - 3 = 0$, tad $x = 3$ ir $x = -1$; patikra: $9 - 3 = 6 = 2 \\cdot 3$.',
        brezinys: keliosKreives(
          [
            { f: (t) => t * t - 3, vardas: 'y = x² - 3' },
            { f: (t) => 2 * t, vardas: 'y = 2x' },
          ],
          { iki: 7, taskai: [{ x: 3, y: 6 }, { x: -1, y: -2 }] },
        ),
      }),

    // 7. Kodėl sprendinių du
    () =>
      uzdavinys(T3, {
        klausimas: 'Brėžinyje pavaizduota hiperbolė ir tiesė. Užrašyk teigiamą jų susikirtimo taško $x$ koordinatę.',
        atsakymas: '2',
        atsakymasRodymui: '$x = 2$',
        sprendimas: 'Iš $\\dfrac{4}{x} = x$ gauname $x^2 = 4$, tad $x = 2$ ir $x = -2$ — hiperbolė turi dvi šakas, ir tiesė kerta kiekvieną po kartą.',
        brezinys: keliosKreives(
          [
            { f: (t) => 4 / t, vardas: 'y = 4/x' },
            { f: (t) => t, vardas: 'y = x' },
          ],
          { iki: 6 },
        ),
      }),

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Nuskaitydamas iš grafiko tašką $(-2; 4)$, mokinys užrašė sprendinį $x = 4$, $y = -2$. Kur klaida?',
        variantai: [
          'Poroje pirmoji koordinatė visada yra $x$, tad teisinga $x = -2$, $y = 4$',
          'Klaidos nėra — koordinačių tvarka nesvarbi',
          'Reikėjo abi koordinates paimti neigiamas',
          'Taškas grafikui nepriklauso',
        ],
        teisingas: 0,
        sprendimas: 'Užrašas $(x; y)$ yra sutartis: pirma abscisė, paskui ordinatė.',
      }),

    // 9. Liestinė parabolei
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuri tiesė su parabole $y = x^2$ turi tik vieną bendrą tašką?',
        variantai: ['$y = 2x - 1$', '$y = 2x + 1$', '$y = x + 2$', '$y = 3$'],
        teisingas: 0,
        brezinys: keliosKreives(
          [
            { f: (t) => t * t, vardas: 'y = x²' },
            { f: (t) => 2 * t - 1, vardas: 'y = 2x - 1' },
          ],
          { iki: 6, taskai: [{ x: 1, y: 1 }] },
        ),
        sprendimas: 'Iš $x^2 = 2x - 1$ gauname $(x - 1)^2 = 0$ — vienintelė šaknis $x = 1$, tad tiesė paraboolę liečia.',
      }),

    // 10. Grafinio ir algebrinio būdo tikslumas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kuo grafinis sistemos sprendimas prastesnis už algebrinį, kai susikirtimo koordinatės nėra sveikosios?',
        variantai: [
          'Iš grafiko gaunama tik apytikslė reikšmė, o algebriškai — tiksli',
          'Grafinis būdas visada duoda daugiau sprendinių',
          'Algebrinis būdas tinka tik tiesėms',
          'Grafiniu būdu sprendinių rasti apskritai neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Brėžinyje nuskaitoma tik tiek, kiek leidžia padalos; tikslią reikšmę duoda lygties sprendimas.',
      }),
  ])
}

// ── 3.4. Sistemų sprendimas algebriniais būdais ─────────────────────────────

const T4 = 'sistemos-algebriskai-10'

const A4 = [
  {
    klausimas: 'Išspręsk sistemą $\\begin{cases} xy = 12 \\\\ x + y = 7 \\end{cases}$ ir užrašyk didesnįjį nežinomąjį.',
    atsakymas: '4',
    atsakymasRodymui: '$4$ (poros $(3; 4)$ ir $(4; 3)$)',
    sprendimas: 'Skaičiai yra lygties $t^2 - 7t + 12 = 0$ šaknys: $3$ ir $4$.',
  },
] as const

export const sistemosAlgebriskai10: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  const p = atsitiktinis(2, 6)
  const q = atsitiktinis(3, 9)

  return variacija([
    // 1. Keitimo būdas su parabole
    () => {
      const b = pasirink([2, 3])
      const c = pasirink([8, 10, 12])
      const disk = 1 + 4 * (c - b)
      const saknis = Math.sqrt(disk)
      if (!Number.isInteger(saknis)) return null
      const didesnis = (-1 + saknis) / 2
      if (!Number.isInteger(didesnis)) return null
      return uzdavinys(T4, {
        klausimas: `Išspręsk sistemą $${sistema(`y = x + ${b}`, `x^2 + y = ${c}`)}$ ir užrašyk didesniąją $x$ reikšmę.`,
        atsakymas: String(didesnis),
        atsakymasRodymui: `$x = ${didesnis}$`,
        sprendimas: `Įrašę $y$: $x^2 + x + ${b} = ${c}$, t. y. $x^2 + x - ${c - b} = 0$; šaknys $${didesnis}$ ir $${(-1 - saknis) / 2}$.`,
      })
    },

    // 2. Simetrinė sistema
    () => {
      if (p >= q) return null
      return uzdavinys(T4, {
        klausimas: `Išspręsk sistemą $${sistema(`xy = ${p * q}`, `x + y = ${p + q}`)}$ ir užrašyk didesnįjį nežinomąjį.`,
        atsakymas: String(q),
        atsakymasRodymui: `$${q}$ (poros $(${p}; ${q})$ ir $(${q}; ${p})$)`,
        sprendimas: `Skaičiai yra lygties $t^2 - ${p + q}t + ${p * q} = 0$ šaknys: $${p}$ ir $${q}$.`,
      })
    },

    // 3. Tiesinė ir sandaugos lygtis
    () =>
      uzdavinys(T4, {
        klausimas: `Išspręsk sistemą $${sistema('y = 2x - 1', 'xy = 6')}$ ir užrašyk sveikąją $x$ reikšmę.`,
        atsakymas: '2',
        atsakymasRodymui: '$x = 2$',
        sprendimas: 'Įrašę $y$: $x(2x - 1) = 6$, t. y. $2x^2 - x - 6 = 0$; šaknys $2$ ir $-1{,}5$.',
      }),

    // 4. Kvadratų suma
    () => {
      if (p >= q) return null
      const suma = p + q
      const kvadratai = p * p + q * q
      return uzdavinys(T4, {
        klausimas: `Išspręsk sistemą $${sistema(`x + y = ${suma}`, `x^2 + y^2 = ${kvadratai}`)}$ ir užrašyk didesnįjį nežinomąjį.`,
        atsakymas: String(q),
        atsakymasRodymui: `$${q}$`,
        sprendimas: `Iš $(x + y)^2 = x^2 + 2xy + y^2$ gauname $xy = ${tr(`${suma * suma} - ${kvadratai}`, '2')} = ${p * q}$; tada $t^2 - ${suma}t + ${p * q} = 0$ duoda $${p}$ ir $${q}$.`,
      })
    },

    // 5. Sprendinių tikrinimas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kodėl gautus sistemos sprendinius reikia patikrinti abiejose lygtyse?',
        variantai: [
          'Nes pertvarkant galėjo atsirasti pašalinių sprendinių, tenkinančių tik vieną lygtį',
          'Nes taip reikalauja sutartis, nors klaidų nebūna',
          'Nes sprendinių visada yra du',
          'Nes tikrinimas pakeičia atsakymą',
        ],
        teisingas: 0,
        sprendimas: 'Kėlimas kvadratu ir dauginimas iš reiškinių su nežinomuoju gali įvesti pašalinių šaknų.',
      }),

    // 6. Parabolė ir tiesė
    () => {
      const c = pasirink([5, 8, 12])
      const disk = 4 + 4 * (c + 3)
      const saknis = Math.sqrt(disk)
      if (!Number.isInteger(saknis)) return null
      const didesnis = (2 + saknis) / 2
      if (!Number.isInteger(didesnis)) return null
      return uzdavinys(T4, {
        klausimas: `Išspręsk sistemą $${sistema('y = x^2 - 3', `y = 2x + ${c}`)}$ ir užrašyk didesniąją $x$ reikšmę.`,
        atsakymas: String(didesnis),
        atsakymasRodymui: `$x = ${didesnis}$`,
        sprendimas: `Sulyginę: $x^2 - 3 = 2x + ${c}$, t. y. $x^2 - 2x - ${c + 3} = 0$; šaknys $${didesnis}$ ir $${(2 - saknis) / 2}$.`,
      })
    },

    // 7. Atvirkštinių suma
    () => {
      if (p >= q) return null
      const suma = p + q
      const sandauga = p * q
      return uzdavinys(T4, {
        klausimas: `Išspręsk sistemą $${sistema(`x + y = ${suma}`, `${tr('1', 'x')} + ${tr('1', 'y')} = ${tr(String(suma), String(sandauga))}`)}$, kai $x \\ne 0$ ir $y \\ne 0$. Užrašyk didesnįjį nežinomąjį.`,
        atsakymas: String(q),
        atsakymasRodymui: `$${q}$`,
        sprendimas: `$${tr('1', 'x')} + ${tr('1', 'y')} = ${tr('x + y', 'xy')}$, tad $xy = ${sandauga}$; lygtis $t^2 - ${suma}t + ${sandauga} = 0$ duoda $${p}$ ir $${q}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Spręsdamas sistemą mokinys gavo kvadratinę lygtį ir pasirinko tik vieną jos šaknį. Kodėl reikia tikrinti abi?',
        variantai: [
          'Kiekviena šaknis duoda savo porą $(x; y)$, tad sistema gali turėti du sprendinius',
          'Antroji šaknis visada pašalinė',
          'Antroji šaknis visada sutampa su pirmąja',
          'Kvadratinė lygtis niekada neturi dviejų šaknų',
        ],
        teisingas: 0,
        sprendimas: 'Atmesti šaknį galima tik tada, kai ji prieštarauja apribojimams arba uždavinio prasmei.',
      }),

    // 9. Simetrinė sistema su kvadratais
    () =>
      uzdavinys(T4, {
        klausimas: `Sistemos $${sistema('x^2 + y = 6', 'y^2 + x = 6')}$ sprendiniuose, kuriuose $x = y$, užrašyk didesniąją reikšmę.`,
        atsakymas: '2',
        atsakymasRodymui: '$x = y = 2$',
        sprendimas:
          'Atėmę lygtis gauname $(x - y)(x + y - 1) = 0$. Kai $x = y$, lieka $x^2 + x - 6 = 0$, tad $x = 2$ arba $x = -3$.',
      }),

    // 10. Sistemos konstravimas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kurios sistemos sprendiniai yra dvi sveikųjų skaičių poros?',
        variantai: [
          '$\\begin{cases} y = \\dfrac{6}{x} \\\\ y = x + 1 \\end{cases}$',
          '$\\begin{cases} y = \\dfrac{6}{x} \\\\ y = x + 5 \\end{cases}$',
          '$\\begin{cases} y = \\dfrac{7}{x} \\\\ y = x + 1 \\end{cases}$',
          '$\\begin{cases} y = \\dfrac{6}{x} \\\\ y = 6x \\end{cases}$',
        ],
        teisingas: 0,
        sprendimas: 'Iš $\\dfrac{6}{x} = x + 1$ gauname $x^2 + x - 6 = 0$: $x = 2$ ir $x = -3$, tad poros $(2; 3)$ ir $(-3; -2)$.',
      }),
  ])
}

// ── 3.5. Uždavinių sprendimas sudarant sistemas ─────────────────────────────

const T5 = 'sistemu-uzdaviniai'

const A5 = [
  {
    klausimas: 'Dviejų skaičių suma lygi $20$, o sandauga $96$. Užrašyk didesnįjį skaičių.',
    atsakymas: '12',
    atsakymasRodymui: '$12$ (skaičiai $8$ ir $12$)',
    sprendimas: 'Iš $t^2 - 20t + 96 = 0$ gauname $t = 8$ ir $t = 12$.',
  },
] as const

export const sistemuUzdaviniai: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  const p = atsitiktinis(3, 9)
  const q = atsitiktinis(4, 14)

  return variacija([
    // 1. Suma ir sandauga
    () => {
      if (p >= q) return null
      return uzdavinys(T5, {
        klausimas: `Dviejų skaičių suma lygi $${p + q}$, o sandauga $${p * q}$. Užrašyk didesnįjį skaičių.`,
        atsakymas: String(q),
        atsakymasRodymui: `$${q}$ (skaičiai $${p}$ ir $${q}$)`,
        sprendimas: `Sistema $${sistema(`x + y = ${p + q}`, `xy = ${p * q}`)}$ veda į $t^2 - ${p + q}t + ${p * q} = 0$; šaknys $${p}$ ir $${q}$.`,
      })
    },

    // 2. Stačiakampis pagal perimetrą ir plotą
    () => {
      const a = pasirink([4, 5, 6, 8])
      const b = pasirink([9, 10, 12, 15])
      if (a >= b) return null
      return uzdavinys(T5, {
        klausimas: `Stačiakampio perimetras $${2 * (a + b)}$ cm, o plotas $${a * b}$ cm². Rask ilgesniąją kraštinę (cm).`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `Iš $${sistema(`x + y = ${a + b}`, `xy = ${a * b}`)}$ gauname $t^2 - ${a + b}t + ${a * b} = 0$, tad kraštinės $${a}$ cm ir $${b}$ cm.`,
      })
    },

    // 3. Skirtumas ir kvadratų suma
    () => {
      const maza = atsitiktinis(2, 8)
      const skirtumas = atsitiktinis(2, 5)
      const didele = maza + skirtumas
      return uzdavinys(T5, {
        klausimas: `Dviejų teigiamų skaičių skirtumas lygus $${skirtumas}$, o jų kvadratų suma $${maza * maza + didele * didele}$. Užrašyk didesnįjį skaičių.`,
        atsakymas: String(didele),
        atsakymasRodymui: `$${didele}$`,
        sprendimas: `Iš $${sistema(`x - y = ${skirtumas}`, `x^2 + y^2 = ${maza * maza + didele * didele}`)}$ įrašius $x = y + ${skirtumas}$ gaunama kvadratinė lygtis; jos teigiamas sprendinys $y = ${maza}$, tad $x = ${didele}$.`,
      })
    },

    // 4. Bilietų sistema
    () => {
      const suaugusio = atsitiktinis(5, 12)
      const mokinio = atsitiktinis(2, 6)
      return uzdavinys(T5, {
        klausimas: `Bilietas suaugusiajam kainuoja $x$ Eur, mokiniui — $y$ Eur. Du suaugusiųjų ir trys mokinių bilietai kainuoja $${2 * suaugusio + 3 * mokinio}$ Eur, o trys suaugusiųjų ir vienas mokinio — $${3 * suaugusio + mokinio}$ Eur. Kiek eurų kainuoja suaugusiojo bilietas?`,
        atsakymas: String(suaugusio),
        atsakymasRodymui: `$${suaugusio}$ Eur`,
        sprendimas: `Sistema $${sistema(`2x + 3y = ${2 * suaugusio + 3 * mokinio}`, `3x + y = ${3 * suaugusio + mokinio}`)}$ duoda $x = ${suaugusio}$ ir $y = ${mokinio}$.`,
      })
    },

    // 5. Kaip pasirinkti nežinomuosius
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kaip tekstiniame uždavinyje pasirenkami du nežinomieji?',
        variantai: [
          'Nežinomaisiais žymimi tie dydžiai, apie kuriuos sąlygoje pateiktos dvi skirtingos priklausomybės',
          'Nežinomaisiais visada žymimi didžiausi skaičiai',
          'Nežinomuoju gali būti tik ieškomas dydis, daugiau nieko',
          'Nežinomieji parenkami atsitiktinai',
        ],
        teisingas: 0,
        sprendimas: 'Dviem nežinomiesiems reikia dviejų nepriklausomų sąlygų — kitaip sistema neišsprendžiama vienareikšmiškai.',
      }),

    // 6. Plotas ir įstrižainė
    () => {
      const trejetas = pasirink([
        { a: 8, b: 15, istrizaine: 17 },
        { a: 6, b: 8, istrizaine: 10 },
        { a: 5, b: 12, istrizaine: 13 },
        { a: 9, b: 12, istrizaine: 15 },
      ])
      return uzdavinys(T5, {
        klausimas: `Stačiakampio plotas $${trejetas.a * trejetas.b}$ cm², o įstrižainė $${trejetas.istrizaine}$ cm. Rask ilgesniąją kraštinę (cm).`,
        atsakymas: String(trejetas.b),
        atsakymasRodymui: `$${trejetas.b}$ cm`,
        sprendimas: `Iš $${sistema(`xy = ${trejetas.a * trejetas.b}`, `x^2 + y^2 = ${trejetas.istrizaine * trejetas.istrizaine}`)}$ gauname $(x + y)^2 = ${trejetas.istrizaine ** 2 + 2 * trejetas.a * trejetas.b}$, tad $x + y = ${trejetas.a + trejetas.b}$ ir kraštinės yra $${trejetas.a}$ cm bei $${trejetas.b}$ cm.`,
      })
    },

    // 7. Atvirkštinių suma
    () => {
      const a = pasirink([5, 6])
      const b = pasirink([6, 5, 10])
      if (a === b) return null
      return uzdavinys(T5, {
        klausimas: `Dviejų skaičių suma lygi $${a + b}$, o jų atvirkštinių suma $${tr(String(a + b), String(a * b))}$. Užrašyk didesnįjį skaičių.`,
        atsakymas: String(Math.max(a, b)),
        atsakymasRodymui: `$${Math.max(a, b)}$`,
        sprendimas: `Kadangi $${tr('1', 'x')} + ${tr('1', 'y')} = ${tr('x + y', 'xy')}$, gauname $xy = ${a * b}$; tada $t^2 - ${a + b}t + ${a * b} = 0$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Mokinys pasirinko du nežinomuosius, bet sudarė dvi tarpusavyje tapačias lygtis. Kodėl atsakymo rasti nepavyks?',
        variantai: [
          'Antroji lygtis nieko naujo nepasako, tad lieka viena lygtis su dviem nežinomaisiais ir sprendinių yra be galo daug',
          'Nes tokia sistema visai neturi sprendinių',
          'Nes nežinomųjų turi būti trys',
          'Nes lygtis reikėjo sudėti',
        ],
        teisingas: 0,
        sprendimas: 'Vienareikšmiam atsakymui reikia dviejų nepriklausomų sąlygų.',
      }),

    // 9. Skirtumas ir sandauga su neigiamu sprendiniu
    () => {
      const maza = atsitiktinis(3, 8)
      const didele = maza + 2
      return uzdavinys(T5, {
        klausimas: `Vienas skaičius $2$ didesnis už kitą, o jų sandauga lygi $${maza * didele}$. Užrašyk didesnįjį iš teigiamos poros skaičių.`,
        atsakymas: String(didele),
        atsakymasRodymui: `$${didele}$ (pora $${maza}$ ir $${didele}$)`,
        sprendimas: `Iš $x(x + 2) = ${maza * didele}$ gauname $x^2 + 2x - ${maza * didele} = 0$: $x = ${maza}$ arba $x = ${-didele}$. Antruoju atveju skaičiai būtų $${-didele}$ ir $${-maza}$.`,
      })
    },

    // 10. Modelio parinkimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kuriam uždaviniui tinka modelis iš vienos tiesinės ir vienos kvadratinės lygties su dviem nežinomaisiais?',
        variantai: [
          'Žinomas stačiakampio perimetras ir plotas — reikia rasti kraštines',
          'Žinomos abi stačiakampio kraštinės — reikia rasti perimetrą',
          'Žinomas tik plotas — reikia rasti kraštines',
          'Žinoma tik viena kraštinė — reikia rasti plotą',
        ],
        teisingas: 0,
        sprendimas: 'Perimetras duoda tiesinę lygtį $x + y = p$, o plotas — kvadratinę $xy = S$.',
      }),
  ])
}

// ── 3.6. Sistemų sprendimas įvedant keitinius ───────────────────────────────

const T6 = 'sistemos-keitiniai'

const A6 = [
  {
    klausimas: 'Sistemoje $\\begin{cases} x + y = 5 \\\\ x^2 + y^2 = 13 \\end{cases}$ rask sandaugą $xy$.',
    atsakymas: '6',
    atsakymasRodymui: '$xy = 6$',
    sprendimas: 'Iš $(x + y)^2 = x^2 + 2xy + y^2$ gauname $25 = 13 + 2xy$, tad $xy = 6$.',
  },
] as const

export const sistemosKeitiniai: Generatorius = () => suBandymais(kurk6, A6, T6)

function kurk6(): Uzdavinys | null {
  const p = atsitiktinis(2, 5)
  const q = atsitiktinis(3, 8)

  return variacija([
    // 1. Keitinys u = x + y
    () => {
      if (p >= q) return null
      const suma = p + q
      const sandauga = p * q
      return uzdavinys(T6, {
        klausimas: `Įvesk keitinį ir išspręsk sistemą $${sistema(`x + y = ${suma}`, `(x + y)^2 - xy = ${suma * suma - sandauga}`)}$. Užrašyk didesnįjį nežinomąjį.`,
        atsakymas: String(q),
        atsakymasRodymui: `$${q}$`,
        sprendimas: `Pažymėję $u = x + y = ${suma}$, iš antrosios lygties gauname $xy = ${suma * suma} - ${suma * suma - sandauga} = ${sandauga}$; tada $t^2 - ${suma}t + ${sandauga} = 0$.`,
      })
    },

    // 2. u reikšmės radimas
    () => {
      if (p >= q) return null
      const kvadratai = p * p + q * q
      const sandauga = p * q
      return uzdavinys(T6, {
        klausimas: `Duota $x^2 + y^2 = ${kvadratai}$ ir $xy = ${sandauga}$. Įvedęs $u = x + y$, rask teigiamą $u$ reikšmę.`,
        atsakymas: String(p + q),
        atsakymasRodymui: `$u = ${p + q}$`,
        sprendimas: `$u^2 = x^2 + 2xy + y^2 = ${kvadratai} + ${2 * sandauga} = ${(p + q) ** 2}$, tad $u = ${p + q}$ arba $u = ${-(p + q)}$.`,
      })
    },

    // 3. Kodėl patogu simetrinėse sistemose
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kodėl simetrinėse sistemose patogu žymėti $u = x + y$ ir $v = xy$?',
        variantai: [
          'Nes simetriniai reiškiniai užrašomi per $u$ ir $v$, ir sistema tampa paprastesnė',
          'Nes tada nežinomųjų lieka vienas',
          'Nes $u$ ir $v$ visada sveikieji',
          'Nes taip išvengiama kvadratinių lygčių',
        ],
        teisingas: 0,
        sprendimas: 'Pavyzdžiui, $x^2 + y^2 = u^2 - 2v$, o $x^3 + y^3 = u^3 - 3uv$ — abu užrašomi be $x$ ir $y$.',
      }),

    // 4. Tapatybė (x+y)²
    () => {
      if (p >= q) return null
      const suma = p + q
      const kvadratai = p * p + q * q
      return uzdavinys(T6, {
        klausimas: `Išspręsk sistemą $${sistema(`x + y = ${suma}`, `x^2 + y^2 = ${kvadratai}`)}$, pasinaudodamas tapatybe $(x + y)^2 = x^2 + 2xy + y^2$. Užrašyk didesnįjį nežinomąjį.`,
        atsakymas: String(q),
        atsakymasRodymui: `$${q}$`,
        sprendimas: `$${suma * suma} = ${kvadratai} + 2xy$, tad $xy = ${p * q}$ ir $t^2 - ${suma}t + ${p * q} = 0$.`,
      })
    },

    // 5. Skirtumo keitinys
    () => {
      const skirtumas = atsitiktinis(1, 4)
      const maza = atsitiktinis(1, 6)
      const didele = maza + skirtumas
      const kvadratai = maza * maza + didele * didele
      return uzdavinys(T6, {
        klausimas: `Išspręsk sistemą $${sistema(`x^2 + y^2 = ${kvadratai}`, `x - y = ${skirtumas}`)}$ ir užrašyk didesnįjį nežinomąjį.`,
        atsakymas: String(didele),
        atsakymasRodymui: `$x = ${didele}$`,
        sprendimas: `Iš $(x - y)^2 = x^2 - 2xy + y^2$ gauname $xy = ${tr(`${kvadratai} - ${skirtumas * skirtumas}`, '2')} = ${maza * didele}$; su $x - y = ${skirtumas}$ tai duoda $x = ${didele}$, $y = ${maza}$.`,
      })
    },

    // 6. Kubų suma
    () => {
      if (p >= q) return null
      const suma = p + q
      const sandauga = p * q
      const kubai = p ** 3 + q ** 3
      if (kubai > 1000) return null
      return uzdavinys(T6, {
        klausimas: `Išspręsk sistemą $${sistema(`x + y = ${suma}`, `x^3 + y^3 = ${kubai}`)}$, pasinaudodamas formule $x^3 + y^3 = (x + y)^3 - 3xy(x + y)$. Užrašyk didesnįjį nežinomąjį.`,
        atsakymas: String(q),
        atsakymasRodymui: `$${q}$`,
        sprendimas: `$${suma ** 3} - ${3 * suma}xy = ${kubai}$, tad $xy = ${sandauga}$ ir $t^2 - ${suma}t + ${sandauga} = 0$.`,
      })
    },

    // 7. Nuo v prie u
    () => {
      if (p >= q) return null
      const kvadratai = p * p + q * q
      return uzdavinys(T6, {
        klausimas: `Duota sistema $${sistema(`xy = ${p * q}`, `x^2 + y^2 = ${kvadratai}`)}$. Rask teigiamą $x + y$ reikšmę.`,
        atsakymas: String(p + q),
        atsakymasRodymui: `$x + y = ${p + q}$`,
        sprendimas: `$(x + y)^2 = ${kvadratai} + ${2 * p * q} = ${(p + q) ** 2}$, tad teigiama reikšmė yra $${p + q}$; poros — $(${p}; ${q})$ ir $(${q}; ${p})$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Po keitinio mokinys rado $u = 5$, bet prie pradinių nežinomųjų nebegrįžo. Kodėl sprendimas nebaigtas?',
        variantai: [
          'Nes $u$ yra tik pagalbinis dydis; atsakymas turi būti poros $(x; y)$',
          'Nes $u$ negali būti lygus $5$',
          'Nes keitinį reikėjo daryti kitą',
          'Nes sistema neturi sprendinių',
        ],
        teisingas: 0,
        sprendimas: 'Radus $u$ ir $v$, dar reikia išspręsti lygtį $t^2 - ut + v = 0$ ir užrašyti poras.',
      }),

    // 9. Atvirkštinių suma su keitiniu
    () => {
      const a = pasirink([1, 2, 3])
      const b = pasirink([3, 4, 6])
      if (a >= b) return null
      return uzdavinys(T6, {
        klausimas: `Išspręsk sistemą $${sistema(`x + y = ${a + b}`, `${tr('1', 'x')} + ${tr('1', 'y')} = ${tr(String(a + b), String(a * b))}`)}$, kai $x \\ne 0$ ir $y \\ne 0$. Užrašyk didesnįjį nežinomąjį.`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$`,
        sprendimas: `Antrąją lygtį pertvarkome į $${tr('x + y', 'xy')} = ${tr(String(a + b), String(a * b))}$, iš kur $xy = ${a * b}$; tada $t^2 - ${a + b}t + ${a * b} = 0$.`,
      })
    },

    // 10. Simetrinės sistemos kūrimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kuri simetrinė sistema turi dvi sprendinių poras — $(1; 4)$ ir $(4; 1)$?',
        variantai: [
          '$\\begin{cases} x + y = 5 \\\\ xy = 4 \\end{cases}$',
          '$\\begin{cases} x + y = 5 \\\\ xy = 5 \\end{cases}$',
          '$\\begin{cases} x + y = 4 \\\\ xy = 4 \\end{cases}$',
          '$\\begin{cases} x - y = 3 \\\\ xy = 4 \\end{cases}$',
        ],
        teisingas: 0,
        sprendimas: '$1 + 4 = 5$ ir $1 \\cdot 4 = 4$; simetrinė sistema abi poras grąžina vienu metu.',
      }),
  ])
}
