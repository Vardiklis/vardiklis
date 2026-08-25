import type { Block } from 'payload'
import { FixedToolbarFeature, lexicalEditor, TextStateFeature } from '@payloadcms/richtext-lexical'
import { FONO_PASIRINKIMAI, TEKSTO_BUSENOS } from './stiliai'

/**
 * Blokai, kuriuos redaktorius įdeda straipsnio viduje pasirinkęs „/“.
 *
 * Blokai gyvena pačiame `turinys` JSON lauke, o ne atskirose lentelėse —
 * pridėjus naują bloką duomenų bazės schemos keisti nereikia.
 */

/**
 * Spalvotas blokas — pastaba, priminimas, taisyklė. Fonas pasirenkamas iš
 * `stiliai.ts` sąrašo, o ne rašomas ranka: taip straipsniai nenudreifuoja nuo
 * svetainės paletės.
 */
export const SpalvotasBlokas: Block = {
  slug: 'spalvotas',
  labels: { singular: 'Spalvotas blokas', plural: 'Spalvoti blokai' },
  fields: [
    {
      name: 'fonas',
      type: 'select',
      label: 'Fono spalva',
      defaultValue: 'smelis',
      required: true,
      options: FONO_PASIRINKIMAI,
    },
    {
      name: 'antraste',
      type: 'text',
      label: 'Antraštė (nebūtina)',
    },
    {
      name: 'turinys',
      type: 'richText',
      label: 'Turinys',
      required: true,
      // Vidinis redaktorius be blokų — kitaip bloką būtų galima dėti į bloką
      // be galo. Spalvos ir šriftai lieka.
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          TextStateFeature({ state: TEKSTO_BUSENOS }),
        ],
      }),
    },
  ],
}

export const straipsnioBlokai: Block[] = [SpalvotasBlokas]
