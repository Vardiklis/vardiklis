import type { GlobalConfig } from 'payload'
import { arLaikas, SAVAITES_DIENOS } from '../lib/laikas'

const dienuPasirinkimai = SAVAITES_DIENOS.map((d, i) => ({
  label: d[0].toUpperCase() + d.slice(1),
  value: String(i + 1),
}))

/**
 * Laisvų laikų kalendorius, rodomas svetainėje po registracijos forma.
 *
 * UŽIMTUMAS SKAIČIUOJAMAS PATS iš „Mokinių“ pamokų laikų — dviejų sąrašų
 * pildyti nereikia. Šis globalas tik nustato, kaip lentelė atrodo, ir leidžia
 * ranka pataisyti tai, ko mokinių sąrašas nežino: užimti langą asmeniniams
 * reikalams arba, priešingai, atlaisvinti langą, kuris sąraše dar užstatytas.
 *
 * Į svetainę patenka TIK „užimta / laisva“ — jokių vardų, klasių ar nuorodų
 * (žr. `lib/tvarkarastis.ts`).
 */
export const Tvarkarastis: GlobalConfig = {
  slug: 'tvarkarastis',
  label: 'Laisvi laikai',
  /**
   * Skaityti gali tik prisijungęs, nors lentelė ir vieša.
   *
   * Puslapį serveris atvaizduoja pats (`overrideAccess`), o atviras globalas
   * ties `/api/globals/tvarkarastis` atiduotų ir „Rankinių pataisymų“ laukelį
   * „Kodėl (tik sau)“ — tą patį, kuriame parašyta, kad svetainėje jis
   * nerodomas.
   */
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    description: 'Kalendorius po registracijos forma. Užimtumas imamas iš „Mokinių“.',
    group: 'Pamokos',
  },
  fields: [
    {
      name: 'rodyti',
      type: 'checkbox',
      label: 'Rodyti kalendorių svetainėje',
      defaultValue: true,
    },
    {
      name: 'antraste',
      type: 'text',
      label: 'Antraštė',
      defaultValue: 'Laisvi laikai',
    },
    {
      type: 'collapsible',
      label: 'Lentelės rėmai',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'nuo',
              type: 'text',
              label: 'Pirma eilutė',
              defaultValue: '08:00',
              required: true,
              admin: { description: 'Anksčiausia pamokos pradžia.' },
              validate: (r: string | null | undefined) =>
                arLaikas(r) ? true : 'Rašykite kaip 08:00.',
            },
            {
              name: 'iki',
              type: 'text',
              label: 'Paskutinė eilutė',
              defaultValue: '21:00',
              required: true,
              admin: {
                description: 'Vėliausia pamokos pradžia. Ši eilutė lentelėje dar rodoma.',
              },
              validate: (r: string | null | undefined) =>
                arLaikas(r) ? true : 'Rašykite kaip 21:00.',
            },
            {
              name: 'zingsnis',
              type: 'select',
              label: 'Eilutės ilgis',
              defaultValue: '60',
              options: [
                { label: '30 min.', value: '30' },
                { label: '1 val.', value: '60' },
              ],
            },
          ],
        },
        {
          name: 'dienos',
          type: 'select',
          hasMany: true,
          label: 'Rodomos dienos',
          defaultValue: ['1', '2', '3', '4', '5', '6', '7'],
          options: dienuPasirinkimai,
        },
        {
          name: 'savaiciu',
          type: 'number',
          label: 'Kiek savaičių į priekį rodyti',
          defaultValue: 26,
          min: 2,
          max: 52,
          admin: {
            description:
              'Tiek savaičių lankytojas galės pervartyti pirmyn. 26 — maždaug pusmetis, 52 — metai.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Registracija į laisvą laiką',
      fields: [
        {
          name: 'leistiRegistruotis',
          type: 'checkbox',
          label: 'Leisti registruotis paspaudus laisvą laiką',
          defaultValue: true,
          admin: {
            description:
              'Išjungus, kalendorius lieka, bet tampa tik informacinis — laikai nebespaudžiami.',
          },
        },
        {
          name: 'ispejimasVal',
          type: 'number',
          label: 'Mažiausias įspėjimas (valandomis)',
          defaultValue: 12,
          min: 0,
          max: 168,
          admin: {
            description:
              'Arčiau nei prieš tiek valandų užsiregistruoti nebegalima — kad neatsirastų užsakymas pamokai po dvidešimties minučių.',
          },
        },
      ],
    },
    {
      name: 'pakeitimai',
      type: 'array',
      label: 'Rankiniai pataisymai',
      labels: { singular: 'Pataisymas', plural: 'Pataisymai' },
      admin: {
        description:
          'Galioja PO to, kai užimtumas suskaičiuojamas iš mokinių sąrašo, tad gali ir uždaryti laisvą langą, ir atlaisvinti užstatytą.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'savaitesDiena',
              type: 'select',
              label: 'Diena',
              required: true,
              options: dienuPasirinkimai,
            },
            {
              name: 'nuo',
              type: 'text',
              label: 'Nuo',
              required: true,
              validate: (r: string | null | undefined) =>
                arLaikas(r) ? true : 'Rašykite kaip 17:00.',
            },
            {
              name: 'iki',
              type: 'text',
              label: 'Iki',
              required: true,
              validate: (r: string | null | undefined) =>
                arLaikas(r) ? true : 'Rašykite kaip 18:00.',
            },
            {
              name: 'busena',
              type: 'select',
              label: 'Rodyti kaip',
              required: true,
              defaultValue: 'uzimta',
              options: [
                { label: 'Užimta', value: 'uzimta' },
                { label: 'Laisva', value: 'laisva' },
              ],
            },
          ],
        },
        {
          name: 'pastaba',
          type: 'text',
          label: 'Kodėl (tik sau)',
          admin: { description: 'Svetainėje nerodoma. Kad po mėnesio būtų aišku, kam tai buvo.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Tekstai po lentele',
      fields: [
        {
          name: 'pastabaLaikai',
          type: 'textarea',
          label: 'Apie kintančius laikus',
          defaultValue: 'Laikai gali kisti, todėl visuomet rekomenduoju kreiptis.',
        },
        {
          name: 'pastabaGrupine',
          type: 'textarea',
          label: 'Apie grupines pamokas',
          defaultValue:
            'Nors laikas gali būti pažymėtas kaip užimtas, gali būti, kad tuo metu vyksta grupinė pamoka ir joje dar yra laisvų vietų — pasiteiraukite.',
        },
      ],
    },
  ],
}
