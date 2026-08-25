import type { JSXConverters, JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { CSSProperties } from 'react'
import { BLOKO_FONAI, iCssObjekta, TEKSTO_BUSENOS, type FonoRaktas } from '@/cms/stiliai'

/**
 * Straipsnio turinys iš Lexical.
 *
 * Kam čia savi konverteriai. Payload į teksto mazgą įrašo tik raktus
 * (`$: { spalva: 'oranzine' }`), o ne CSS — numatytasis konverteris apie juos
 * nieko nežino ir spalvą praleistų. Stilius uždedamas čia iš to paties
 * `cms/stiliai.ts` sąrašo, kurį mato ir redaktorius, tad abi pusės negali
 * prasilenkti.
 */

/** Lexical mazgo būsenos raktai — tas pats, ką redaktoriuje pasirinko autorius. */
type BusenosRaktai = Record<string, string | undefined>

const FORMATAS = {
  bold: 1,
  italic: 1 << 1,
  strikethrough: 1 << 2,
  underline: 1 << 3,
  code: 1 << 4,
  subscript: 1 << 5,
  superscript: 1 << 6,
} as const

/** Iš pasirinktų raktų surenka vieną `style` objektą. */
function stilius(busenos: BusenosRaktai | undefined): CSSProperties | undefined {
  if (!busenos) return undefined

  let css: Record<string, string> = {}
  for (const [raktas, reiksme] of Object.entries(busenos)) {
    const grupe = TEKSTO_BUSENOS[raktas as keyof typeof TEKSTO_BUSENOS] as
      | Record<string, { css: Record<string, string> }>
      | undefined
    const rastas = reiksme ? grupe?.[reiksme] : undefined
    if (rastas) css = { ...css, ...rastas.css }
  }

  return Object.keys(css).length > 0 ? (iCssObjekta(css) as CSSProperties) : undefined
}

/**
 * Teksto mazgas. Formatavimą (paryškinta, pasvirusi) paliekam tokį, kokį daro
 * Payload; pridedam tik apvalkalą su spalva, jei ji pasirinkta.
 */
const TekstoKonverteris: JSXConverters = {
  text: ({ node }) => {
    const mazgas = node as unknown as { text: string; format: number; $?: BusenosRaktai }
    let turinys: React.ReactNode = mazgas.text

    if (mazgas.format & FORMATAS.bold) turinys = <strong>{turinys}</strong>
    if (mazgas.format & FORMATAS.italic) turinys = <em>{turinys}</em>
    if (mazgas.format & FORMATAS.strikethrough) {
      turinys = <span style={{ textDecoration: 'line-through' }}>{turinys}</span>
    }
    if (mazgas.format & FORMATAS.underline) {
      turinys = <span style={{ textDecoration: 'underline' }}>{turinys}</span>
    }
    if (mazgas.format & FORMATAS.code) turinys = <code>{turinys}</code>
    if (mazgas.format & FORMATAS.subscript) turinys = <sub>{turinys}</sub>
    if (mazgas.format & FORMATAS.superscript) turinys = <sup>{turinys}</sup>

    const stilizuota = stilius(mazgas.$)
    return stilizuota ? <span style={stilizuota}>{turinys}</span> : turinys
  },
}

type SpalvotoBlokoLaukai = {
  blockType: 'spalvotas'
  fonas?: FonoRaktas | null
  antraste?: string | null
  turinys?: unknown
}

/** Spalvotas blokas — pastaba ar priminimas straipsnio viduryje. */
const BlokuKonverteriai: JSXConverters = {
  blocks: {
    spalvotas: ({ node }) => {
      const laukai = (node as unknown as { fields: SpalvotoBlokoLaukai }).fields
      const fonas = BLOKO_FONAI[laukai.fonas ?? 'smelis'] ?? BLOKO_FONAI.smelis

      return (
        <div
          className="straipsnio-blokas"
          style={{ background: fonas.fonas, borderColor: fonas.krastine }}
        >
          {laukai.antraste && <p className="straipsnio-blokas__antraste">{laukai.antraste}</p>}
          {laukai.turinys ? (
            <RichText data={laukai.turinys as never} converters={konverteriai} disableContainer />
          ) : null}
        </div>
      )
    },
  },
}

const konverteriai: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...TekstoKonverteris,
  ...BlokuKonverteriai,
})

export function StraipsnioTurinys({ turinys }: { turinys: unknown }) {
  return (
    // `disableContainer` — be jo Lexical apvyniotų viską dar vienu <div>, ir
    // tarpų taisyklė `.straipsnio-turinys > * + *` neturėtų į ką kibti.
    <div className="straipsnio-turinys tekstas">
      <RichText data={turinys as never} converters={konverteriai} disableContainer />
    </div>
  )
}

export default StraipsnioTurinys
