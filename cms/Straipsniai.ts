import type { CollectionConfig } from 'payload'

/**
 * Straipsnio adresas peržiūrai. `?perziura=1` įjungia juodraščio rodymą —
 * jį parodo tik prisijungusiam naudotojui (žr. `lib/straipsniai.ts`).
 */
export function straipsnioAdresas(dok: { nuoroda?: string | null }): string {
  return dok?.nuoroda ? `/straipsniai/${dok.nuoroda}?perziura=1` : '/straipsniai'
}

/**
 * Straipsniai — tinklaraštis.
 *
 * Nuoroda (`nuoroda`) yra atskiras laukas, o ne išvedama iš pavadinimo:
 * pavadinimą vėliau taisyti normalu, o pasikeitęs adresas sugriautų jau
 * indeksuotą puslapį ir visas išorines nuorodas.
 */
export const Straipsniai: CollectionConfig = {
  slug: 'straipsniai',
  labels: { singular: 'Straipsnis', plural: 'Straipsniai' },
  admin: {
    useAsTitle: 'pavadinimas',
    defaultColumns: ['pavadinimas', 'busena', 'paskelbta'],
    description: 'Tinklaraščio įrašai. Juodraščiai svetainėje nerodomi.',
    // Mygtukas „Peržiūra“ — atidaro juodraštį atskirame lange.
    preview: (dok) => straipsnioAdresas(dok as { nuoroda?: string | null }),
  },
  // Skaityti gali visi, bet tik paskelbtus; kurti ir taisyti — prisijungę.
  access: {
    read: ({ req }) => (req.user ? true : { busena: { equals: 'paskelbta' } }),
  },
  /**
   * Juodraščiai su automatiniu išsaugojimu. Autosave čia reikalingas ne dėl
   * saugumo, o dėl gyvos peržiūros: ji rodo serveryje atvaizduotą puslapį,
   * tad tekstas ekrane atsinaujina po kiekvieno išsaugojimo. Sekundės tarpas
   * yra kompromisas tarp „gyva“ ir „neplaka serverio kas raidę“.
   *
   * Versijų kiekis ribojamas — antraip kas sekundę saugant bazė augtų sparčiai.
   */
  versions: {
    drafts: { autosave: { interval: 1000 } },
    maxPerDoc: 25,
  },
  fields: [
    { name: 'pavadinimas', type: 'text', label: 'Pavadinimas', required: true },
    {
      name: 'nuoroda',
      type: 'text',
      label: 'Nuoroda (adreso dalis)',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Pvz. „kaip-mokytis-daugybos“. Paskelbus nebekeisti.' },
    },
    {
      name: 'santrauka',
      type: 'textarea',
      label: 'Santrauka',
      required: true,
      maxLength: 200,
      admin: { description: 'Rodoma sąraše ir paieškos rezultatuose. Iki 200 ženklų.' },
    },
    { name: 'virselis', type: 'upload', relationTo: 'failai', label: 'Viršelio paveikslėlis' },
    { name: 'turinys', type: 'richText', label: 'Turinys', required: true },
    {
      name: 'busena',
      type: 'select',
      label: 'Būsena',
      defaultValue: 'juodrastis',
      required: true,
      options: [
        { label: 'Juodraštis', value: 'juodrastis' },
        { label: 'Paskelbta', value: 'paskelbta' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'paskelbta',
      type: 'date',
      label: 'Paskelbimo data',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'klases',
      type: 'select',
      label: 'Kurioms klasėms aktualu',
      hasMany: true,
      options: Array.from({ length: 10 }, (_, i) => ({
        label: `${i + 1} klasė`,
        value: String(i + 1),
      })),
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    // Paskelbimo data užpildoma automatiškai — vienu lauku mažiau rankiniam darbui.
    beforeChange: [
      ({ data }) => {
        if (data.busena === 'paskelbta' && !data.paskelbta) {
          return { ...data, paskelbta: new Date().toISOString() }
        }
        return data
      },
    ],
  },
}
