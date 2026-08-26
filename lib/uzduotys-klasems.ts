/**
 * `/uzduotys/[klase]` puslapių duomenys.
 *
 * Kodėl šie puslapiai apskritai yra. `/uzduotys` generatorius visą turinį
 * sukuria naršyklėje ir slepia po akordeonais be atskirų adresų, todėl Google
 * jo nemato ir svetainė negali rangeuotis pagal „6 klasės uždaviniai“ ar
 * „trupmenų uždaviniai su atsakymais“ — o būtent tokių paieškų daugiausia.
 *
 * Čia kiekvienai klasei paruošiamas STATIŠKAS puslapis su tikrais uždaviniais
 * HTML'e. Uždaviniai imami iš tų pačių generatorių, tik su sėkla: `suSekla`
 * užtikrina, kad tas pats adresas visada duotų tą patį lapą. Be to kiekvienas
 * perstatymas keistų visą turinį, Google matytų nuolat kintantį puslapį, o
 * mokytojas negalėtų grįžti prie to paties lapo.
 */

import { generuokTemosRinkini } from './generatoriai'
import { potemes, programa, temosGeneratoriai, type ProgramosTema } from './programa'
import { suSekla } from './sekla'
import { UZDAVINIU_TEMAI, type TemosPavyzdziai } from './uzduotys-tipai'

export { UZDAVINIU_TEMAI, type TemosPavyzdziai } from './uzduotys-tipai'

export const KLASES = programa.map((k) => k.klase)

/**
 * Adresas — `6-klase`, ne `6`. Raktažodis yra pačiame kelyje, o žmogui iš
 * nuorodos iškart aišku, kur ji veda.
 */
export function klasesNuoroda(klase: number): string {
  return `${klase}-klase`
}

/** `6-klase` → 6. Netinkamas ar neegzuojantis adresas grąžina `null`. */
export function klaseIsNuorodos(segmentas: string): number | null {
  const atitikmuo = /^(\d{1,2})-klase$/.exec(segmentas)
  if (!atitikmuo) return null
  const klase = Number(atitikmuo[1])
  return KLASES.includes(klase) ? klase : null
}

/**
 * Vienos temos pavyzdžiai. Sėkla rišama prie klasės ir temos numerio, tad
 * pakeitus programą ar generatorių pasikeis tik tos temos uždaviniai.
 */
function temosPavyzdziai(klase: number, tema: ProgramosTema): TemosPavyzdziai {
  const sarasas = potemes(tema)
  const generatoriai = temosGeneratoriai(tema)

  const uzdaviniai = suSekla(`uzduotys-${klase}-${tema.numeris}`, () =>
    generuokTemosRinkini(
      generatoriai,
      tema.lygis ?? 2,
      UZDAVINIU_TEMAI,
      klase,
      tema.sritis ?? null,
    ),
  )

  return {
    numeris: tema.numeris,
    pavadinimas: tema.pavadinimas,
    potemiuPavadinimai: sarasas.map((p) => p.pavadinimas),
    generatoriai,
    lygis: tema.lygis ?? 2,
    sritis: tema.sritis ?? null,
    uzdaviniai,
  }
}

/**
 * Visos klasės temos su pavyzdžiais. Temos, kurioms generatoriaus dar nėra,
 * lieka sąraše be uždavinių — jos vis tiek pasakoja, kas klasėje mokoma, o
 * tuščias uždavinių blokas puslapyje neatsiranda.
 */
export function klasesPavyzdziai(klase: number): TemosPavyzdziai[] {
  const temos = programa.find((k) => k.klase === klase)?.temos ?? []
  return temos.map((tema) => temosPavyzdziai(klase, tema))
}

/** Kiek uždavinių iš viso puslapyje — rodoma įžangoje ir aprašyme. */
export function isViso(temos: TemosPavyzdziai[]): number {
  return temos.reduce((suma, t) => suma + t.uzdaviniai.length, 0)
}
