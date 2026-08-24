import type { CollectionConfig } from 'payload'

/**
 * Failai — paveikslėliai straipsniams ir PDF užduotys (NMPP, PUPP).
 *
 * ĮSPĖJIMAS DĖL IŠSAUGOJIMO. `staticDir` turi rodyti į katalogą, kurio
 * neperrašo diegimas iš GitHub. Numatytasis `public/ikelta` yra pačiame
 * repozitorijos kataloge, tad Hostinger'yje jį reikia perrašyti per
 * `UPLOADS_DIR` — kitaip įkelti PDF dings per pirmą atnaujinimą.
 */
export const Failai: CollectionConfig = {
  slug: 'failai',
  /**
   * Skaitymas viešas. Payload pagal nutylėjimą reikalauja prisijungimo, o tada
   * lankytojas negautų nė vieno įkelto PDF ar paveikslėlio — failų adresai eina
   * per `/api/failai/file/…` ir tikrina tą pačią `read` taisyklę. Kūrimas,
   * keitimas ir trynimas lieka tik prisijungusiems.
   */
  access: { read: () => true },
  labels: { singular: 'Failas', plural: 'Failai' },
  upload: {
    staticDir: process.env.UPLOADS_DIR || 'public/ikelta',
    // PDF ir paveikslėliai — daugiau šiai svetainei nereikia.
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'perzvalga', width: 640, height: undefined, position: 'centre' },
      { name: 'virselis', width: 1200, height: 630, position: 'centre' },
    ],
  },
  admin: { useAsTitle: 'alt', defaultColumns: ['alt', 'filename', 'kategorija'] },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Aprašymas',
      required: true,
      admin: { description: 'Ką matyti paveikslėlyje. Būtina dėl prieinamumo ir SEO.' },
    },
    {
      name: 'kategorija',
      type: 'select',
      label: 'Kategorija',
      defaultValue: 'kita',
      options: [
        { label: 'Straipsnio paveikslėlis', value: 'straipsnis' },
        { label: 'NMPP užduotis', value: 'nmpp' },
        { label: 'PUPP užduotis', value: 'pupp' },
        { label: 'Kita', value: 'kita' },
      ],
    },
    {
      name: 'klase',
      type: 'number',
      label: 'Klasė',
      min: 1,
      max: 12,
      admin: {
        description: 'Kuriai klasei skirta užduotis.',
        condition: (_, siblings) => siblings?.kategorija === 'nmpp' || siblings?.kategorija === 'pupp',
      },
    },
  ],
}
