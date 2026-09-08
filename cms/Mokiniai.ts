import { randomBytes } from 'node:crypto'
import type { CollectionConfig } from 'payload'
import { arLaikas } from '../lib/laikas'
import { meetNuorodosLaukas, pamokuMasyvas } from './pamokos-laukai'

/**
 * Mokiniai — kas, kada ir kur turi pamoką.
 *
 * ŠI KOLEKCIJA YRA VISO PRIMINIMŲ MECHANIZMO ŠALTINIS. Google kalendorius čia
 * nedalyvauja: tvarkaraštis, tėvų paštas ir Meet nuoroda gyvena čia, tad
 * nereikia nei Calendar API, nei OAuth, nei pavadinimų prefiksų.
 *
 * PRIEIGA. Payload kiekvieną kolekciją savaime paskelbia ties `/api/<slug>`
 * ir GraphQL'e. Čia guli vaikų vardai, tėvų el. paštai ir nuolatinės Meet
 * nuorodos — su jomis pašalinis įeitų į pamoką. Todėl užrakinti VISI keturi
 * veiksmai, o ne vien `read`: be `create` užrakto svetimas galėtų prirašyti
 * savų įrašų, be `update` — pakeisti nuorodą į savo.
 */
export const Mokiniai: CollectionConfig = {
  slug: 'mokiniai',
  labels: { singular: 'Mokinys', plural: 'Mokiniai' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'vardas',
    defaultColumns: ['vardas', 'klase', 'tevoPastas', 'meetNuoroda', 'aktyvus', 'pirmaPamoka'],
    description:
      'Kam siunčiami priminimai. Pamokos kartojasi kas savaitę; pakeitimai galioja nuo kito siuntimo.',
    group: 'Pamokos',
  },
  hooks: {
    /**
     * Raktas nuorodai `/p/<raktas>`. Generuojamas vieną kartą ir nebekeičiamas:
     * jį tėvai turi laiške ir gali būti įsidėję į žymes.
     *
     * 12 simbolių iš `randomBytes` — atspėti neįmanoma, o adresas telpa į
     * laiško eilutę. `base64url` neturi ženklų, kuriuos reikėtų koduoti URL'e.
     */
    beforeChange: [
      ({ data }) => {
        if (!data.raktas) data.raktas = randomBytes(9).toString('base64url')
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'vardas', type: 'text', label: 'Mokinio vardas', required: true },
        {
          name: 'klase',
          type: 'select',
          label: 'Klasė',
          options: Array.from({ length: 10 }, (_, i) => ({
            label: `${i + 1} klasė`,
            value: String(i + 1),
          })),
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'tevoVardas', type: 'text', label: 'Tėvo / mamos vardas' },
        {
          name: 'tevoPastas',
          type: 'email',
          label: 'Tėvo / mamos el. paštas',
          required: true,
          admin: { description: 'Šiuo adresu eina priminimai. Be jo siųsti nėra kur.' },
        },
      ],
    },
    meetNuorodosLaukas(
      'Nuolatinė šio vaiko kambario nuoroda, pvz. https://meet.google.com/abc-defg-hij. Tėvams siunčiama ne ji, o vardiklis.lt nuoroda, kuri atveda čia — todėl pakeitus ją, tėvams pranešti nereikia. Grupinėms pamokoms nuoroda imama iš grupės, ne iš čia.',
    ),
    pamokuMasyvas(
      'Kartojasi, kol nuimta „Aktyvus“ arba pamoka ištrinta. Nepalikus nė vienos eilutės, priminimų šiam mokiniui nebus. Grupinių pamokų čia rašyti nereikia — jos gyvena „Grupėse“.',
    ),
    {
      type: 'collapsible',
      label: 'Būsena ir nuolaida',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'aktyvus',
              type: 'checkbox',
              label: 'Aktyvus',
              defaultValue: true,
              admin: { description: 'Nuėmus varnelę priminimai nustoja eiti, o įrašas lieka.' },
            },
            {
              name: 'pirmaPamoka',
              type: 'checkbox',
              label: 'Kita pamoka — pirmoji (nuolaida)',
              defaultValue: true,
              admin: {
                description:
                  'Įjungta — laiške paminima pirmos pamokos nuolaida. Pažymėjus žurnale „Įvyko“, varnelė nusiima pati.',
              },
            },
          ],
        },
        {
          name: 'pauzeIki',
          type: 'date',
          label: 'Pauzė iki (imtinai)',
          admin: {
            description: 'Atostogoms. Iki šios dienos imtinai priminimai nesiunčiami.',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' },
          },
        },
        {
          name: 'sutikimas',
          type: 'checkbox',
          label: 'Tėvai sutiko gauti priminimus',
          defaultValue: true,
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Kada siųsti (šiam mokiniui)',
      admin: {
        description: 'Nepasirinkus — galioja bendras nustatymas iš „Priminimai“.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'priminimoKada',
              type: 'select',
              label: 'Kada',
              options: [
                { label: 'Kaip bendruose nustatymuose', value: '' },
                { label: 'Tos pačios dienos rytą', value: 'rytas' },
                { label: 'Dieną prieš, vakare', value: 'vakaras' },
              ],
              defaultValue: '',
            },
            {
              name: 'priminimoValanda',
              type: 'text',
              label: 'Kelintą valandą',
              admin: { description: 'Pvz. 07:30. Palikus tuščią — kaip bendruose nustatymuose.' },
              validate: (reiksme: string | null | undefined) =>
                !reiksme || arLaikas(reiksme) ? true : 'Rašykite kaip 07:30.',
            },
          ],
        },
      ],
    },
    { name: 'pastabos', type: 'textarea', label: 'Pastabos (tėvai jų nemato)' },
    {
      name: 'raktas',
      type: 'text',
      label: 'Nuorodos raktas',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Iš jo sudaroma nuoroda vardiklis.lt/p/… Nekeičiamas.',
      },
    },
  ],
}
