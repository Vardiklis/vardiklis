import type { CollectionConfig } from 'payload'

/**
 * Rezervacijos — kai lankytojas svetainės kalendoriuje pasirenka laisvą laiką.
 *
 * KURIA TIK SERVERIS (`lib/rezervacija.ts`), ne žmogus per API: `create` čia
 * uždarytas, o veiksmas rašo su `overrideAccess`. Taip viešas galinis taškas
 * lieka vienas ir visos patikros — tuščias laukas, botų spąstai, greičio riba,
 * ar laikas dar laisvas — yra vienoje vietoje.
 *
 * SKAITYTI GALI TIK PRISIJUNGĘS. Čia guli vaikų vardai, tėvų paštai ir
 * telefonai; be užrakto juos atiduotų `/api/rezervacijos`.
 *
 * Užimtu kalendoriuje laikoma „Nauja“ ir „Patvirtinta“. Pažymėjus „Atmesta“,
 * laikas svetainėje vėl tampa laisvas.
 */
export const Rezervacijos: CollectionConfig = {
  slug: 'rezervacijos',
  labels: { singular: 'Rezervacija', plural: 'Rezervacijos' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'santrauka',
    defaultColumns: ['santrauka', 'busena', 'elPastas', 'telefonas', 'createdAt'],
    description: 'Ką lankytojai užsisakė svetainės kalendoriuje.',
    group: 'Pamokos',
  },
  fields: [
    {
      name: 'santrauka',
      type: 'text',
      label: 'Rezervacija',
      admin: { readOnly: true, description: 'Sudaroma automatiškai.' },
    },
    {
      name: 'busena',
      type: 'select',
      label: 'Būsena',
      defaultValue: 'nauja',
      options: [
        { label: 'Nauja', value: 'nauja' },
        { label: 'Patvirtinta', value: 'patvirtinta' },
        { label: 'Atmesta', value: 'atmesta' },
      ],
      admin: {
        description:
          '„Nauja“ ir „Patvirtinta“ laiką kalendoriuje laiko užimtą. „Atmesta“ jį vėl atlaisvina.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'data',
          type: 'text',
          label: 'Data',
          required: true,
          index: true,
          admin: { readOnly: true },
        },
        { name: 'laikas', type: 'text', label: 'Laikas', required: true, admin: { readOnly: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'tevoVardas', type: 'text', label: 'Tėvo / globėjo vardas', required: true },
        { name: 'vaikoVardas', type: 'text', label: 'Vaiko vardas', required: true },
        { name: 'klase', type: 'text', label: 'Klasė' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'elPastas', type: 'email', label: 'El. paštas', required: true },
        { name: 'telefonas', type: 'text', label: 'Telefonas' },
      ],
    },
    {
      name: 'saltinis',
      type: 'text',
      label: 'Iš kurio puslapio',
      admin: { readOnly: true },
    },
    {
      name: 'pastabos',
      type: 'textarea',
      label: 'Pastabos (mato tik Modesta)',
    },
  ],
}
