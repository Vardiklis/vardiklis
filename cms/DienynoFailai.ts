import path from 'node:path'
import type { CollectionConfig } from 'payload'
import { tikAdministratoriui } from './prieiga'

/**
 * Dienyno failai — prie namų darbų ir atsiliepimo prisegtos nuotraukos ir
 * dokumentai.
 *
 * KODĖL NE „FAILAI“. Ta kolekcija vieša (`read: () => true`) — per ją eina
 * straipsnių paveikslėliai ir NMPP/PUPP užduotys, o numatytasis jos katalogas
 * `public/ikelta` Next'o atiduodamas be jokio patikrinimo. Vaiko sąsiuvinio
 * nuotrauka ten pasiekiama būtų bet kam, atspėjusiam `IMG_1234.jpg`, ir dar
 * atsidurtų straipsnio paveikslėlių pasirinkime.
 *
 * Todėl čia viskas užrakinta, o vaikui failą atiduoda dienyno maršrutas
 * `/dienynas/failas/[id]` — tik jei failas prisegtas prie jo paskyros vaiko
 * pamokos (žr. `lib/dienynas.ts`, `arGalimaFaila`).
 *
 * KATALOGAS — UŽ `public/` IR UŽ APLIKACIJOS RIBŲ. Serveryje, kaip ir
 * `UPLOADS_DIR`, jis turi išgyventi diegimą iš GitHub. Nenurodžius
 * `DIENYNO_FAILU_DIR`, imamas `UPLOADS_DIR` gretimas katalogas
 * (`…/duomenys/ikelta` → `…/duomenys/dienyno-failai`), tad serveryje papildomai
 * nustatinėti nieko nereikia.
 */
export const DIENYNO_FAILAI = 'dienyno-failai'

function katalogas(): string {
  if (process.env.DIENYNO_FAILU_DIR) return process.env.DIENYNO_FAILU_DIR
  if (process.env.UPLOADS_DIR) return path.join(path.dirname(process.env.UPLOADS_DIR), 'dienyno-failai')
  return 'dienyno-failai'
}

/**
 * Leidžiami tipai. SVG sąmoningai NE: jis gali turėti skriptą, o atiduodamas
 * iš `vardiklis.lt` jis veiktų tame pačiame adrese, kaip ir CMS.
 */
export const DIENYNO_FAILU_TIPAI = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const DienynoFailai: CollectionConfig = {
  slug: DIENYNO_FAILAI,
  labels: { singular: 'Dienyno failas', plural: 'Dienyno failai' },
  access: {
    read: tikAdministratoriui,
    create: tikAdministratoriui,
    update: tikAdministratoriui,
    delete: tikAdministratoriui,
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'filesize', 'createdAt'],
    description:
      'Prie pamokų prisegtos nuotraukos ir dokumentai. Mato tik to vaiko paskyra — ne viešai. Įkelti patogiausia tiesiai iš pamokos žurnale.',
    group: 'Pamokos',
  },
  upload: {
    staticDir: katalogas(),
    mimeTypes: DIENYNO_FAILU_TIPAI,
    /**
     * Telefono nuotrauka būna 4000 px ir keli MB. Dienyne tiek nereikia, o
     * serverio diske — tuo labiau: originalas sumažinamas iki 2000 px.
     */
    resizeOptions: { width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true },
    // Sąraše rodoma dienyne, pilnas dydis — paspaudus.
    imageSizes: [{ name: 'perzvalga', width: 800, withoutEnlargement: true }],
    adminThumbnail: 'perzvalga',
  },
  fields: [],
}
