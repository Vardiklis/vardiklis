/**
 * Teksto spalvos, paryškinimai, šriftai ir blokų fonai — vienintelė vieta.
 *
 * Tą patį objektą naudoja abi pusės:
 *   • redaktorius — `TextStateFeature` ir blokų laukai (`payload.config.ts`);
 *   • svetainė — `components/StraipsnioTurinys.tsx`.
 *
 * Lexical į straipsnio JSON įrašo tik raktą (pvz. `spalva: "oranzine"`), o ne
 * patį `color: #c24500`. Todėl spalvą galima persigalvoti ir vėliau — visi jau
 * parašyti straipsniai persidažo patys, nieko netaisant rankomis.
 *
 * Spalvos tikrintos ant popieriaus fono (`--paper`, #fbf8f2): visos teksto
 * spalvos praeina WCAG AA (≥ 4,5:1). Todėl signature oranžinė čia yra
 * patamsinta (#c24500, 4,78:1) — gryna #ff5c00 duotų tik 2,9:1.
 */

export type Stilius = {
  label: string
  /** CSS su brūkšneliais — toks formatas reikalingas `TextStateFeature`. */
  css: Record<string, string>
}

export type Busenos = Record<string, Record<string, Stilius>>

/** Šriftai imami iš tų pačių kintamųjų, kuriuos jau kuria `next/font` —
 *  papildomų failų naršyklė nekrauna. */
const SRIFTAI = {
  antrasciu: 'var(--font-bricolage), Georgia, serif',
  tekstinis: 'var(--font-instrument), system-ui, sans-serif',
  monospace: 'var(--font-jetbrains), ui-monospace, monospace',
}

export const TEKSTO_BUSENOS = {
  spalva: {
    oranzine: { label: 'Oranžinė', css: { color: '#c24500' } },
    zalia: { label: 'Žalia', css: { color: '#15803d' } },
    raudona: { label: 'Raudona', css: { color: '#b91c1c' } },
    melyna: { label: 'Mėlyna', css: { color: '#1d4ed8' } },
    pilka: { label: 'Pilka', css: { color: '#6b655f' } },
  },
  paryskinimas: {
    geltonas: {
      label: 'Geltonas fonas',
      css: { 'background-color': '#fef3c7', 'border-radius': '3px', padding: '0.05em 0.25em' },
    },
    oranzinis: {
      label: 'Oranžinis fonas',
      css: { 'background-color': '#ffe9da', 'border-radius': '3px', padding: '0.05em 0.25em' },
    },
    zalias: {
      label: 'Žalias fonas',
      css: { 'background-color': '#e7f5ec', 'border-radius': '3px', padding: '0.05em 0.25em' },
    },
    raudonas: {
      label: 'Raudonas fonas',
      css: { 'background-color': '#fbe9e9', 'border-radius': '3px', padding: '0.05em 0.25em' },
    },
    pilkas: {
      label: 'Pilkas fonas',
      css: { 'background-color': '#f3eee4', 'border-radius': '3px', padding: '0.05em 0.25em' },
    },
  },
  sriftas: {
    antrasciu: { label: 'Antraščių šriftas', css: { 'font-family': SRIFTAI.antrasciu } },
    tekstinis: { label: 'Tekstinis šriftas', css: { 'font-family': SRIFTAI.tekstinis } },
    monospace: { label: 'Monospace', css: { 'font-family': SRIFTAI.monospace } },
  },
} satisfies Busenos

/**
 * Bloko fonai. Reikšmė yra CSS spalva, ne klasė — kad tas pats sąrašas veiktų
 * ir `select` lauke redaktoriuje, ir svetainėje.
 */
export const BLOKO_FONAI = {
  smelis: { label: 'Smėlio', fonas: 'var(--paper-2, #f3eee4)', krastine: 'var(--line, #e4ded2)' },
  oranzinis: { label: 'Oranžinis', fonas: '#ffe9da', krastine: '#ffd0b0' },
  geltonas: { label: 'Geltonas', fonas: '#fef3c7', krastine: '#f5e2a0' },
  zalias: { label: 'Žalias', fonas: '#e7f5ec', krastine: '#c6e5d2' },
  raudonas: { label: 'Raudonas', fonas: '#fbe9e9', krastine: '#f0c9c9' },
  baltas: { label: 'Be fono (tik rėmelis)', fonas: 'transparent', krastine: 'var(--line, #e4ded2)' },
} as const

export type FonoRaktas = keyof typeof BLOKO_FONAI

/** `select` laukui Payload'e. */
export const FONO_PASIRINKIMAI = Object.entries(BLOKO_FONAI).map(([value, { label }]) => ({
  label,
  value,
}))

/** `background-color` → `backgroundColor`, nes React'ui reikia camelCase. */
export function iCssObjekta(css: Record<string, string>): Record<string, string> {
  const rezultatas: Record<string, string> = {}
  for (const [savybe, reiksme] of Object.entries(css)) {
    rezultatas[savybe.replace(/-([a-z])/g, (_, r: string) => r.toUpperCase())] = reiksme
  }
  return rezultatas
}
