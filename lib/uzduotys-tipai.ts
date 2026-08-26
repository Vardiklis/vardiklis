/**
 * `/uzduotys/[klase]` tipai ir konstantos — ATSKIRTA nuo `uzduotys-klasems.ts`
 * sąmoningai.
 *
 * `uzduotys-klasems.ts` importuoja `lib/generatoriai`, o tai maždaug 2,5 MB
 * kodo. Kliento komponentui iš ten reikėjo tik tipo ir vieno skaičiaus, bet
 * paprasto `import` pakako, kad Turbopack į klasės puslapį įtrauktų VISĄ
 * generatorių biblioteką — ji keliaudavo į naršyklę iškart, nors reikalinga
 * tik paspaudus „Generuoti naujus".
 *
 * Todėl viskas, ką dalijasi serveris ir klientas, guli čia: šis failas
 * neimportuoja nieko sunkaus, o `Uzdavinys` ir `Sritis` įtraukiami kaip tipai,
 * kurie kompiliuojant išnyksta be pėdsako.
 */

import type { Uzdavinys } from './generatoriai/tipai'
import type { Sritis } from './generatoriai/sritis'
import type { Lygis } from './programa'

/** Kiek uždavinių rodoma prie kiekvienos temos — ir serveryje, ir naršyklėje. */
export const UZDAVINIU_TEMAI = 4

/**
 * Visi laukai — paprasti duomenys, be funkcijų. Taip būtina: šis objektas
 * keliauja iš serverio į kliento komponentą, o React per tą ribą perduoda tik
 * tai, ką galima paversti JSON. Būtent dėl to čia laikom generatorių VARDUS,
 * o ne pačias funkcijas — naršyklė jas pasiima pati, kai prireikia.
 */
export type TemosPavyzdziai = {
  numeris: number
  pavadinimas: string
  /** Potemių pavadinimai — jie ir yra long-tail raktažodžiai. */
  potemiuPavadinimai: string[]
  /** Generatorių raktai — su jais naršyklė gali persigeneruoti temą. */
  generatoriai: string[]
  lygis: Lygis
  /** `null`, kai klasei ribos netaikomos — `undefined` per JSON nekeliauja. */
  sritis: Sritis | null
  uzdaviniai: Uzdavinys[]
}
