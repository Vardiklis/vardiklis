import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { apskritimoBrezinys } from './devintokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 9 klasės tema „Apskritimas ir skritulys“ — penkios potemės.
 *
 * Brėžiniuose visada pažymėtas centras $O$, o liestinės lietimosi taškas,
 * stygos galai ir kampų viršūnės — raidėmis; to reikalauja turinio aprašas.
 *
 * Ten, kur atsakyme atsirastų $\pi$, prašoma koeficiento prieš $\pi$ — kitaip
 * atsakymo nebūtų galima suvesti tiksliai.
 */

/** Pitagoro trejetai stygos ilgiui iš spindulio ir atstumo. */
const TREJETAI = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
] as const

function trejetas(): readonly [number, number, number] {
  return pasirink(TREJETAI) as unknown as readonly [number, number, number]
}

// ── 8.1. Apskritimo liestinė ir kirstinė ────────────────────────────────────

const T1 = 'liestine-ir-kirstine'

const A1 = [
  {
    klausimas: 'Kiek bendrų taškų su apskritimu turi liestinė?',
    atsakymas: '1',
    atsakymasRodymui: '$1$',
    sprendimas: 'Liestinė apskritimą liečia viename taške.',
  },
] as const

export const liestineIrKirstine: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {
  const kampas = atsitiktinis(20, 70)

  return variacija([
    // 1. Kampas tarp spindulio ir liestinės
    () =>
      uzdavinys(T1, {
        klausimas: 'Liestinė liečia apskritimą taške $A$, o $OA$ — spindulys. Koks kampas tarp $OA$ ir liestinės?',
        atsakymas: '90',
        atsakymasRodymui: '$90°$',
        sprendimas: 'Spindulys, nubrėžtas į lietimosi tašką, yra statmenas liestinei.',
        brezinys: apskritimoBrezinys({ liestine: kampas, spindulysILietimosi: true, raides: { t: 'A' } }),
      }),

    // 2. Liestinės taškų skaičius
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek bendrų taškų su apskritimu turi liestinė?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Todėl ji ir vadinama liestine.',
      }),

    // 3. Kirstinės taškų skaičius
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek bendrų taškų su apskritimu turi kirstinė?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Kirstinė kerta apskritimą dviejuose taškuose.',
        brezinys: apskritimoBrezinys({ kirstine: [150, 30], raides: { a: 'B', b: 'C' } }),
      }),

    // 4. Kuo skiriasi
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kuo liestinė skiriasi nuo kirstinės?',
        variantai: [
          'liestinė turi vieną bendrą tašką, o kirstinė — du',
          'liestinė ilgesnė',
          'kirstinė eina per centrą',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Bendrų taškų skaičius ir yra skiriamasis požymis.',
      }),

    // 5. Atstumas nuo centro
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Sujunk atstumą nuo centro iki tiesės su tiesės padėtimi, kai spindulys yra $R$.',
        poros: [
          { kaire: 'atstumas $< R$', desine: 'kirstinė' },
          { kaire: 'atstumas $= R$', desine: 'liestinė' },
          { kaire: 'atstumas $> R$', desine: 'bendrų taškų nėra' },
          { kaire: 'atstumas $= 0$', desine: 'tiesė eina per centrą' },
        ],
        sprendimas: 'Viską lemia atstumo nuo centro ir spindulio santykis.',
      }),

    // 6. Dvi liestinės iš vieno taško
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Iš taško $P$ už apskritimo nubrėžtos dvi liestinės $PA$ ir $PB$. Ką galima pasakyti apie jų ilgius?',
        variantai: ['jie lygūs', '$PA$ visada ilgesnė', 'jie skiriasi dvigubai', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Liestinių atkarpos iš to paties taško lygios.',
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Mokinys teigia, kad spindulys, nubrėžtas į lietimosi tašką, yra lygiagretus liestinei. Kodėl tai klaida?',
        variantai: [
          'jis yra statmenas liestinei',
          'jis sudaro $45°$ kampą',
          'jis sutampa su liestine',
          'iš tikrųjų tai tiesa',
        ],
        teisingas: 0,
        sprendimas: 'Lygiagretus spindulys apskritimo iš viso neliestų.',
        brezinys: apskritimoBrezinys({ liestine: kampas, spindulysILietimosi: true, raides: { t: 'A' } }),
      }),
  ])
}

// ── 8.2. Centrinis ir įbrėžtinis kampai ─────────────────────────────────────

const T2 = 'centrinis-ir-ibreztinis'

const A2 = [
  {
    klausimas: 'Centrinis kampas, remiantis į lanką AB, yra 80°. Koks įbrėžtinis kampas remiasi į tą patį lanką?',
    atsakymas: '40',
    atsakymasRodymui: '$40°$',
    sprendimas: 'Įbrėžtinis kampas dvigubai mažesnis už centrinį.',
  },
] as const

export const centrinisIrIbreztinis: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  const puse = atsitiktinis(15, 80)
  const centrinis = 2 * puse

  return variacija([
    // 1. Įbrėžtinis iš centrinio
    () =>
      uzdavinys(T2, {
        klausimas: `Centrinis kampas $AOB$ lygus $${centrinis}°$. Koks yra įbrėžtinis kampas $ACB$, besiremiantis į tą patį lanką?`,
        atsakymas: String(puse),
        atsakymasRodymui: `$${puse}°$`,
        sprendimas: `$${centrinis}° : 2 = ${puse}°$.`,
        brezinys: apskritimoBrezinys({
          centrinis: [160, 20],
          centrinioUzrasas: `${centrinis}°`,
          ibreztinio: 270,
          ibreztinioUzrasas: '?',
          raides: { a: 'A', b: 'B', c: 'C' },
        }),
      }),

    // 2. Centrinis iš įbrėžtinio
    () =>
      uzdavinys(T2, {
        klausimas: `Įbrėžtinis kampas $ACB$ lygus $${puse}°$. Koks yra centrinis kampas $AOB$, besiremiantis į tą patį lanką?`,
        atsakymas: String(centrinis),
        atsakymasRodymui: `$${centrinis}°$`,
        sprendimas: `$${puse}° \\cdot 2 = ${centrinis}°$.`,
        brezinys: apskritimoBrezinys({
          centrinis: [160, 20],
          centrinioUzrasas: '?',
          ibreztinio: 270,
          ibreztinioUzrasas: `${puse}°`,
          raides: { a: 'A', b: 'B', c: 'C' },
        }),
      }),

    // 3. Lanko dydis
    () =>
      uzdavinys(T2, {
        klausimas: `Įbrėžtinis kampas $ACB$ lygus $${puse}°$. Koks yra lanko $AB$ dydis laipsniais?`,
        atsakymas: String(centrinis),
        atsakymasRodymui: `$${centrinis}°$`,
        sprendimas: 'Lanko dydis lygus centriniam kampui.',
      }),

    // 4. Ryšys
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kaip susiję centrinis ir įbrėžtinis kampai, besiremiantys į tą patį lanką?',
        variantai: [
          'įbrėžtinis kampas dvigubai mažesnis už centrinį',
          'jie lygūs',
          'centrinis dvigubai mažesnis',
          'jų suma lygi $180°$',
        ],
        teisingas: 0,
        sprendimas: 'Todėl iš vieno visada galima rasti kitą.',
      }),

    // 5. Kampas, besiremiantis į pusapskritimį
    () =>
      uzdavinys(T2, {
        klausimas: 'Koks yra įbrėžtinis kampas, besiremiantis į pusapskritimį?',
        atsakymas: '90',
        atsakymasRodymui: '$90°$',
        sprendimas: 'Centrinis kampas tada lygus $180°$, o įbrėžtinis — dvigubai mažesnis.',
      }),

    // 6. Du įbrėžtiniai kampai
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Du įbrėžtiniai kampai remiasi į tą pačią stygą iš tos pačios pusės. Ką galima pasakyti apie jų dydžius?',
        variantai: ['jie lygūs', 'jų suma $180°$', 'vienas dvigubai didesnis', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Abu lygūs pusei to paties centrinio kampo.',
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Mokinys teigia, kad centrinis kampas visada perpus mažesnis už įbrėžtinį. Kodėl tai klaida?',
        variantai: [
          'atvirkščiai — įbrėžtinis yra perpus mažesnis už centrinį',
          'jie visada lygūs',
          'centrinis yra trigubai didesnis',
          'iš tikrųjų tai tiesa',
        ],
        teisingas: 0,
        sprendimas: `Pavyzdžiui, centriniam $${centrinis}°$ atitinka įbrėžtinis $${puse}°$.`,
      }),
  ])
}

// ── 8.3. Apskritimo stygų savybės ───────────────────────────────────────────

const T3 = 'stygu-savybes'

const A3 = [
  {
    klausimas: 'Kuri styga yra ilgiausia apskritime?',
    atsakymas: 'skersmuo',
    atsakymasRodymui: 'Skersmuo',
    sprendimas: 'Skersmuo eina per centrą.',
  },
] as const

export const styguSavybes: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  const [puse, atstumas, r] = trejetas()
  const styga = 2 * puse

  return variacija([
    // 1. Pusė stygos
    () =>
      uzdavinys(T3, {
        klausimas: `Iš centro $O$ į stygą $AB$ nubrėžtas statmuo $OM$. Styga $AB = ${styga}$ cm. Koks yra $AM$?`,
        atsakymas: String(puse),
        atsakymasRodymui: `$${puse}$ cm`,
        sprendimas: 'Statmuo iš centro dalija stygą pusiau.',
        brezinys: apskritimoBrezinys({
          styga: [200, 340],
          statmuo: true,
          stygosUzrasas: `${styga} cm`,
          raides: { a: 'A', b: 'B', m: 'M' },
        }),
      }),

    // 2. Stygos ilgis su Pitagoru
    () =>
      uzdavinys(T3, {
        klausimas: `Apskritimo spindulys ${r} cm, o atstumas nuo centro iki stygos ${atstumas} cm. Koks yra stygos ilgis?`,
        atsakymas: String(styga),
        atsakymasRodymui: `$${styga}$ cm`,
        sprendimas: `Pusė stygos $\\sqrt{${r * r} - ${atstumas * atstumas}} = ${puse}$, tad visa styga $${styga}$ cm.`,
      }),

    // 3. Kas yra styga
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kas yra apskritimo styga?',
        variantai: [
          'atkarpa, jungianti du apskritimo taškus',
          'atkarpa nuo centro iki apskritimo',
          'tiesė, kertanti apskritimą',
          'apskritimo dalis',
        ],
        teisingas: 0,
        sprendimas: 'Spindulys jungia centrą su apskritimu, o styga — du apskritimo taškus.',
      }),

    // 4. Ar skersmuo yra styga
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ar skersmuo yra styga?',
        variantai: [
          'taip, ir tai ilgiausia styga',
          'ne, tai atskira linija',
          'taip, bet trumpiausia',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Skersmuo jungia du apskritimo taškus ir eina per centrą.',
      }),

    // 5. Vienodai nutolusios stygos
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Dvi stygos vienodai nutolusios nuo centro. Ką galima pasakyti apie jų ilgius?',
        variantai: ['jos lygios', 'viena dvigubai ilgesnė', 'jos statmenos', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Kuo styga arčiau centro, tuo ji ilgesnė.',
      }),

    // 6. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Mokinys teigia, kad ilgesnė styga yra toliau nuo centro. Kodėl tai klaida?',
        variantai: [
          'atvirkščiai — ilgesnė styga yra arčiau centro',
          'stygų ilgis nuo atstumo nepriklauso',
          'visos stygos vienodai nutolusios',
          'iš tikrųjų tai tiesa',
        ],
        teisingas: 0,
        sprendimas: 'Ilgiausia styga — skersmuo — eina per patį centrą.',
      }),

    // 7. Ką padaro statmuo
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Ką su styga padaro spindulys, statmenas tai stygai?',
        variantai: [
          'padalija ją pusiau',
          'padalija ją santykiu $1 : 2$',
          'pailgina ją',
          'nieko nepadaro',
        ],
        teisingas: 0,
        sprendimas: 'Taip gaunami du lygūs statieji trikampiai.',
      }),
  ])
}

// ── 8.4. Skritulio išpjova ir nuopjova ──────────────────────────────────────

const T4 = 'ispjova-ir-nuopjova'

const A4 = [
  {
    klausimas: 'Kokią viso skritulio dalį sudaro 90° išpjova?',
    atsakymas: '0.25',
    atsakymasRodymui: '$\\dfrac{1}{4}$',
    sprendimas: '$90° : 360° = \\dfrac{1}{4}$.',
  },
] as const

export const ispjovaIrNuopjova: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  const kampas = pasirink([30, 45, 60, 72, 90, 120, 135, 180])
  const r = atsitiktinis(2, 12)
  const dalis = kampas / 360

  return variacija([
    // 1. Kokią dalį sudaro
    () => {
      const vardiklis = 360 / kampas
      if (!Number.isInteger(vardiklis)) return null
      return uzdavinys(T4, {
        klausimas: `Kokią viso skritulio dalį sudaro $${kampas}°$ išpjova? Užrašyk trupmenos vardiklį.`,
        atsakymas: String(vardiklis),
        atsakymasRodymui: `$\\dfrac{1}{${vardiklis}}$`,
        sprendimas: `$${kampas}° : 360° = \\dfrac{1}{${vardiklis}}$.`,
        brezinys: apskritimoBrezinys({ ispjova: kampas }),
      })
    },

    // 2. Išpjovos plotas iš viso ploto
    () => {
      const visas = 360
      const plotas = visas * dalis
      if (!Number.isInteger(plotas)) return null
      return uzdavinys(T4, {
        klausimas: `Skritulio plotas $${visas}\\pi$ cm². Koks yra $${kampas}°$ išpjovos plotas? Užrašyk koeficientą prieš $\\pi$.`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}\\pi$ cm²`,
        sprendimas: `$${visas} \\cdot \\dfrac{${kampas}}{360} = ${plotas}$.`,
      })
    },

    // 3. Išpjovos plotas iš spindulio
    () => {
      const plotas = (r * r * kampas) / 360
      if (!Number.isInteger(plotas)) return null
      return uzdavinys(T4, {
        klausimas: `Skritulio spindulys ${r} cm. Koks yra $${kampas}°$ išpjovos plotas? Užrašyk koeficientą prieš $\\pi$.`,
        atsakymas: String(plotas),
        atsakymasRodymui: `$${plotas}\\pi$ cm²`,
        sprendimas: `$S = \\pi R^2 \\cdot \\dfrac{${kampas}}{360} = ${plotas}\\pi$.`,
        brezinys: apskritimoBrezinys({ ispjova: kampas }),
      })
    },

    // 4. Lanko ilgis
    () => {
      const ilgis = (2 * r * kampas) / 360
      if (!Number.isInteger(ilgis)) return null
      return uzdavinys(T4, {
        klausimas: `Apskritimo spindulys ${r} cm. Koks yra $${kampas}°$ lanko ilgis? Užrašyk koeficientą prieš $\\pi$.`,
        atsakymas: String(ilgis),
        atsakymasRodymui: `$${ilgis}\\pi$ cm`,
        sprendimas: `$l = 2\\pi R \\cdot \\dfrac{${kampas}}{360} = ${ilgis}\\pi$.`,
      })
    },

    // 5. Kas yra išpjova
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kas yra skritulio išpjova?',
        variantai: [
          'skritulio dalis, apribota dviejų spindulių ir lanko',
          'skritulio dalis, apribota stygos ir lanko',
          'visas skritulys',
          'apskritimo dalis',
        ],
        teisingas: 0,
        sprendimas: 'Išpjova primena pyrago gabalą.',
        brezinys: apskritimoBrezinys({ ispjova: kampas }),
      }),

    // 6. Kas yra nuopjova
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kuo nuopjova skiriasi nuo išpjovos?',
        variantai: [
          'nuopjovą riboja styga ir lankas, o išpjovą — du spinduliai ir lankas',
          'nuopjova visada didesnė',
          'nuopjova yra pusė skritulio',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Nuopjova gaunama nupjovus skritulio dalį tiesia linija.',
        brezinys: apskritimoBrezinys({ nuopjova: [200, 340] }),
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Mokinys $90°$ išpjovą pavadino puse skritulio. Kokią dalį ji sudaro iš tikrųjų?',
        variantai: ['ketvirtadalį', 'pusę', 'trečdalį', 'visą skritulį'],
        teisingas: 0,
        sprendimas: 'Pusę skritulio sudarytų $180°$ išpjova.',
      }),
  ])
}

// ── 8.5. Proporcingos atkarpos ir kampai ────────────────────────────────────

const T5 = 'proporcingos-atkarpos'

const A5 = [
  {
    klausimas: 'Dvi stygos kertasi taške P: AP=3, PB=8, CP=4. Koks PD?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: '$3 \\cdot 8 = 4 \\cdot PD$.',
  },
] as const

export const proporcingosAtkarpos: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  const ap = atsitiktinis(2, 9)
  const pb = atsitiktinis(2, 12)
  const cp = atsitiktinis(2, 9)
  const sandauga = ap * pb
  if (sandauga % cp !== 0) return null
  const pd = sandauga / cp

  return variacija([
    // 1. Susikertančios stygos
    () =>
      uzdavinys(T5, {
        klausimas: `Dvi stygos $AB$ ir $CD$ kertasi apskritimo viduje taške $P$. Žinoma, kad $AP = ${ap}$, $PB = ${pb}$, $CP = ${cp}$. Koks yra $PD$?`,
        atsakymas: String(pd),
        atsakymasRodymui: `$${pd}$`,
        sprendimas: `$AP \\cdot PB = CP \\cdot PD$; $${ap} \\cdot ${pb} = ${cp} \\cdot ${pd}$.`,
      }),

    // 2. Nežinoma atkarpa kitoje pusėje
    () =>
      uzdavinys(T5, {
        klausimas: `Dvi stygos kertasi taške $P$: $AP = x$, $PB = ${pb}$, $CP = ${cp}$, $PD = ${pd}$. Rask $x$.`,
        atsakymas: String(ap),
        atsakymasRodymui: `$x = ${ap}$`,
        sprendimas: `$x \\cdot ${pb} = ${cp} \\cdot ${pd} = ${sandauga}$, tad $x = ${ap}$.`,
      }),

    // 3. Liestinė ir kirstinė
    () => {
      const pa = pasirink([1, 2, 4])
      const pb2 = pa * pasirink([4, 9, 16])
      const pt = Math.sqrt(pa * pb2)
      if (!Number.isInteger(pt)) return null
      return uzdavinys(T5, {
        klausimas: `Iš taško $P$ už apskritimo nubrėžta liestinė $PT$ ir kirstinė, kertanti apskritimą taškuose $A$ ir $B$. Žinoma, kad $PA = ${pa}$, $PB = ${pb2}$. Koks yra $PT$?`,
        atsakymas: String(pt),
        atsakymasRodymui: `$${pt}$`,
        sprendimas: `$PT^2 = PA \\cdot PB = ${pa * pb2}$, tad $PT = ${pt}$.`,
      })
    },

    // 4. Stygų taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kokia sandaugų lygybė galioja dviem susikertančioms stygoms?',
        variantai: [
          'vienos stygos atkarpų sandauga lygi kitos stygos atkarpų sandaugai',
          'atkarpų sumos lygios',
          'atkarpų skirtumai lygūs',
          'visos atkarpos lygios',
        ],
        teisingas: 0,
        sprendimas: '$AP \\cdot PB = CP \\cdot PD$.',
      }),

    // 5. Liestinės taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kaip susiję liestinės ilgis $PT$ ir kirstinės atkarpos $PA$, $PB$ iš to paties išorinio taško?',
        variantai: [
          '$PT^2 = PA \\cdot PB$',
          '$PT = PA + PB$',
          '$PT = PB - PA$',
          '$PT^2 = PA + PB$',
        ],
        teisingas: 0,
        sprendimas: 'Liestinės kvadratas lygus išorinės dalies ir visos kirstinės sandaugai.',
      }),

    // 6. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kirstinių teoremoje mokinys sudaugino dvi išorines dalis. Ką reikėjo daryti?',
        variantai: [
          'dauginti išorinę dalį iš visos kirstinės',
          'sudėti abi dalis',
          'dauginti vidines dalis',
          'atimti dalis',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvienai kirstinei imama išorinė dalis kartu su visa kirstine.',
      }),

    // 7. Išorinis kampas ir lankai
    () => {
      const didesnis = atsitiktinis(60, 160)
      const mazesnis = atsitiktinis(10, didesnis - 20)
      if ((didesnis - mazesnis) % 2 !== 0) return null
      return uzdavinys(T5, {
        klausimas: `Iš išorinio taško nubrėžtos dvi kirstinės atkerta lankus, kurių dydžiai $${didesnis}°$ ir $${mazesnis}°$. Koks yra kampas tarp kirstinių?`,
        atsakymas: String((didesnis - mazesnis) / 2),
        atsakymasRodymui: `$${(didesnis - mazesnis) / 2}°$`,
        sprendimas: `Išorinis kampas lygus lankų skirtumo pusei: $(${didesnis}° - ${mazesnis}°) : 2$.`,
      })
    },
  ])
}
