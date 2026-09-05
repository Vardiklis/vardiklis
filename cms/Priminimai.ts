import type { GlobalConfig } from 'payload'
import { arLaikas } from '../lib/laikas'

/**
 * Priminimų nustatymai — bendri visiems mokiniams.
 *
 * KODĖL LAIKAS YRA NUSTATYMAS, O NE CRON'O EILUTĖ. Jei siuntimo valanda būtų
 * įrašyta į cron'ą, ją keičiant reikėtų lįsti į serverį. Todėl cron'as badoma
 * kas 15 min., o kada tikrai siųsti, sprendžia šis globalas: maršrutas kaskart
 * paskaičiuoja, kurių pamokų priminimo momentas jau praėjo, ir siunčia tik
 * tuos, kurie dar neišsiųsti (žr. `lib/priminimai.ts` ir `Zurnalas`).
 *
 * Atskiras globalas, o ne laukai „Kainos ir kvietimas“ viduje: naujam globalui
 * susikuria nauja lentelė, o naujas stulpelis jau esamoje lentelėje serveryje
 * neatsiranda savaime ir nulaužia visą migraciją (žr. `payload.config.ts`).
 *
 * Skaityti gali tik prisijungęs — svetainė šių laukų nerodo niekam.
 */
export const Priminimai: GlobalConfig = {
  slug: 'priminimai',
  label: 'Priminimai',
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    description: 'Kada ir ar išvis siunčiami automatiniai priminimai tėvams.',
    group: 'Pamokos',
  },
  fields: [
    {
      name: 'ijungta',
      type: 'checkbox',
      label: 'Siųsti priminimus',
      defaultValue: true,
      admin: {
        description: 'Nuėmus varnelę siuntimas sustoja visiems, nieko kito keisti nereikia.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'kada',
          type: 'select',
          label: 'Kada siųsti',
          defaultValue: 'rytas',
          required: true,
          options: [
            { label: 'Tos pačios dienos rytą', value: 'rytas' },
            { label: 'Dieną prieš, vakare', value: 'vakaras' },
          ],
        },
        {
          name: 'valanda',
          type: 'text',
          label: 'Kelintą valandą',
          defaultValue: '07:30',
          required: true,
          admin: { description: 'Formatas 07:30, Lietuvos laiku.' },
          validate: (reiksme: string | null | undefined) =>
            arLaikas(reiksme) ? true : 'Rašykite kaip 07:30.',
        },
      ],
    },
    {
      name: 'prierasas',
      type: 'textarea',
      label: 'Prierašas laiške (nebūtina)',
      admin: {
        description: 'Įterpiamas kiekvieno laiško gale, prieš parašą. Pvz. priminimas apie namų darbus.',
      },
    },
    {
      name: 'santraukaSau',
      type: 'checkbox',
      label: 'Siųsti man dienos santrauką',
      defaultValue: true,
      admin: {
        description:
          'Vienas laiškas su tos dienos pamokomis ir mygtukais „Buvo / Nebuvo“ — kad žurnalo nereikėtų pildyti panelėje.',
      },
    },
    {
      name: 'paskutineSantrauka',
      type: 'text',
      label: 'Paskutinė išsiųsta santrauka',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Kad ta pati santrauka neišeitų kelis kartus per dieną.',
      },
    },
  ],
}
