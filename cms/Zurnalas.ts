import type { CollectionConfig } from 'payload'

/**
 * Pamokų žurnalas — po vieną įrašą kiekvienai suplanuotai pamokai.
 *
 * TRYS DARBAI VIENU ĮRAŠU:
 *   1. neleidžia išsiųsti to paties priminimo dukart (siuntimo maršrutas
 *      paleidžiamas kas 5 min., tad be šito tėvai gautų laišką kas penkias
 *      minutes);
 *   2. fiksuoja, ar nuoroda buvo atidaryta — tai ir yra „ar prisijungė“,
 *      kiek jo įmanoma sužinoti nemokamoje Google paskyroje;
 *   3. lieka kaip lankomumo ir atsiskaitymo istorija.
 *
 * `data` ir `laikas` — tekstai, ne `date` laukai. Datos laukas SQLite'e virsta
 * momentu su juosta, o čia reikia būtent Vilniaus paros: „2026-09-05“ pamoka
 * yra rugsėjo 5-osios pamoka ir tada, kai serveris skaičiuoja UTC.
 *
 * Rašo tik serveris. Panelėje įrašai tik skaitomi ir taisoma vien būsena —
 * kurti juos ranka nėra prasmės, o ištrynus dingtų atsiskaitymo istorija.
 */
export const Zurnalas: CollectionConfig = {
  slug: 'zurnalas',
  labels: { singular: 'Pamoka', plural: 'Pamokų žurnalas' },
  access: {
    read: ({ req }) => Boolean(req.user),
    // Įrašus kuria priminimų maršrutas per `overrideAccess`, ne žmogus.
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'santrauka',
    defaultColumns: ['santrauka', 'data', 'laikas', 'busena'],
    description: 'Ką sistema išsiuntė ir kas iš to išėjo. Įrašus kuria pati sistema.',
    group: 'Pamokos',
  },
  fields: [
    {
      name: 'santrauka',
      type: 'text',
      label: 'Pamoka',
      admin: { readOnly: true, description: 'Sudaroma automatiškai.' },
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
        { name: 'laikas', type: 'text', label: 'Pradžia', admin: { readOnly: true } },
        {
          name: 'mokinys',
          type: 'relationship',
          relationTo: 'mokiniai',
          label: 'Mokinys',
          index: true,
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'busena',
      type: 'select',
      label: 'Būsena',
      defaultValue: 'suplanuota',
      options: [
        { label: 'Suplanuota', value: 'suplanuota' },
        { label: 'Atidarė nuorodą', value: 'atidare' },
        { label: 'Įvyko', value: 'ivyko' },
        { label: 'Neįvyko', value: 'neivyko' },
      ],
      admin: {
        description:
          '„Atidarė nuorodą“ užsideda pati. „Įvyko“ / „Neįvyko“ pažymima iš laiško arba čia.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'issiusta',
          type: 'date',
          label: 'Priminimas išsiųstas',
          admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'atidaryta',
          type: 'date',
          label: 'Nuoroda atidaryta',
          admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      name: 'pirmaPamoka',
      type: 'checkbox',
      label: 'Buvo pirmoji pamoka (su nuolaida)',
      admin: {
        readOnly: true,
        description: 'Įrašoma siuntimo metu — kad kaina istorijoje nepasikeistų atgaline data.',
      },
    },
    {
      name: 'klaida',
      type: 'text',
      label: 'Siuntimo klaida',
      admin: {
        readOnly: true,
        description: 'Užpildyta tik tada, kai laiško išsiųsti nepavyko.',
      },
    },
  ],
}
