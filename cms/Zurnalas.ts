import type { CollectionConfig } from 'payload'
import { arLaikas, data as dataVilniuje } from '../lib/laikas'

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
 * ĮRAŠUS KURIA IR SISTEMA, IR ŽMOGUS. Įprastai juos padaro priminimų maršrutas,
 * bet pasitaiko pamokų, kurių tvarkaraštyje nebuvo: perkelta iš kitos dienos,
 * papildoma prieš egzaminą, pravesta be priminimo. Tokia pamoka turi patekti į
 * žurnalą, kitaip jos nebus nei lankomume, nei sąskaitoje. Todėl laukai taisomi
 * ranka, o `santrauka` visada sudaroma automatiškai — kad sąrašo stulpelis
 * nepriklausytų nuo to, ar kas nors jį užpildė.
 *
 * KO TAISANT NEPAMIRŠTI. `saskaita` yra apsauga nuo dvigubo apmokestinimo:
 * užpildyta reiškia „ši pamoka jau kažkur suskaičiuota“. Ją išvalius pamoka
 * grįžta į eilę ir gali pakliūti į antrą sąskaitą. `issiusta` lygiai taip pat
 * saugo nuo antro priminimo tiems patiems tėvams.
 */

const DATOS_FORMATAS = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

/** Ryšio laukas gali ateiti ir numeriu, ir dokumentu — priklauso nuo gylio. */
const rysioId = (reiksme: unknown): number | string | null => {
  if (reiksme == null) return null
  if (typeof reiksme === 'object') return (reiksme as { id?: number | string }).id ?? null
  return reiksme as number | string
}

export const Zurnalas: CollectionConfig = {
  slug: 'zurnalas',
  labels: { singular: 'Pamoka', plural: 'Pamokų žurnalas' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'santrauka',
    defaultColumns: ['santrauka', 'data', 'laikas', 'tipas', 'busena', 'kaina'],
    description:
      'Ką sistema išsiuntė ir kas iš to išėjo. Įrašus kuria priminimai, bet neplanuotą pamoką galima įrašyti ir ranka.',
    group: 'Pamokos',
  },
  hooks: {
    beforeChange: [
      /**
       * `santrauka` yra ir sąrašo stulpelis, ir įrašo pavadinimas, tad ji negali
       * priklausyti nuo to, ar kas nors ją užpildė. Sudaroma iš to paties, iš ko
       * ir anksčiau (`lib/priminimai.ts`) — kad seni ir nauji įrašai atrodytų
       * vienodai.
       *
       * Perskaičiuojama tik pasikeitus mokiniui, datai ar laikui: žymint „Įvyko“
       * ar įrašant siuntimo laiką mokinio kortelės traukti nereikia, o tokių
       * atnaujinimų per rytą būna daug.
       */
      async ({ data, originalDoc, req }) => {
        const keiciasi =
          data?.mokinys !== undefined || data?.data !== undefined || data?.laikas !== undefined
        if (!keiciasi && originalDoc?.santrauka) return data

        const mokinysId = rysioId(data?.mokinys ?? originalDoc?.mokinys)
        const dataISO = data?.data ?? originalDoc?.data ?? ''
        const laikas = data?.laikas ?? originalDoc?.laikas ?? ''

        let vardas = '(be mokinio)'
        if (mokinysId != null) {
          try {
            const m = await req.payload.findByID({
              collection: 'mokiniai',
              id: mokinysId,
              depth: 0,
              overrideAccess: true,
            })
            vardas = (m as { vardas?: string }).vardas || vardas
          } catch {
            // Mokinys ištrintas — įrašas lieka, tik be vardo.
          }
        }

        return { ...data, santrauka: `${vardas} · ${dataISO} ${laikas}`.trim() }
      },
    ],
  },
  fields: [
    {
      name: 'santrauka',
      type: 'text',
      label: 'Pamoka',
      admin: { readOnly: true, description: 'Sudaroma automatiškai iš mokinio, datos ir laiko.' },
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
          defaultValue: () => dataVilniuje(new Date()),
          admin: { description: 'Formatas 2026-09-05, Lietuvos laiku.' },
          validate: (reiksme: string | null | undefined) =>
            DATOS_FORMATAS.test(reiksme ?? '') ? true : 'Rašykite kaip 2026-09-05.',
        },
        {
          name: 'laikas',
          type: 'text',
          label: 'Pradžia',
          admin: { description: 'Formatas 17:00.' },
          validate: (reiksme: string | null | undefined) =>
            !reiksme || arLaikas(reiksme) ? true : 'Rašykite kaip 17:00.',
        },
        {
          name: 'mokinys',
          type: 'relationship',
          relationTo: 'mokiniai',
          label: 'Mokinys',
          index: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'tipas',
          type: 'select',
          label: 'Pamokos rūšis',
          defaultValue: 'individuali',
          options: [
            { label: 'Individuali', value: 'individuali' },
            { label: 'Grupinė', value: 'grupine' },
          ],
          admin: {
            description: 'Įrašoma siuntimo metu — kad ištrynus grupę istorija liktų teisinga.',
          },
        },
        {
          name: 'grupe',
          type: 'relationship',
          relationTo: 'grupes',
          label: 'Grupė',
          index: true,
          admin: { description: 'Tuščia, kai pamoka individuali.' },
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
          '„Atidarė nuorodą“ užsideda pati. „Įvyko“ / „Neįvyko“ pažymima iš laiško arba čia. Į sąskaitą patenka tik „Įvyko“.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'issiusta',
          type: 'date',
          label: 'Priminimas išsiųstas',
          admin: {
            date: { pickerAppearance: 'dayAndTime' },
            description: 'Užpildyta — priminimas nebesiunčiamas. Išvalius bus išsiųstas iš naujo.',
          },
        },
        {
          name: 'atidaryta',
          type: 'date',
          label: 'Nuoroda atidaryta',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      name: 'pirmaPamoka',
      type: 'checkbox',
      label: 'Buvo pirmoji pamoka (su nuolaida)',
      admin: {
        description: 'Įrašoma siuntimo metu — kad kaina istorijoje nepasikeistų atgaline data.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'kaina',
          type: 'number',
          label: 'Kaina (€)',
          min: 0,
          admin: {
            description:
              'Užfiksuojama siuntimo metu iš „Sąskaitų nustatymų“. Paliktas tuščias kainuoja tiek, kiek nustatymuose šiandien.',
          },
        },
        {
          name: 'saskaita',
          type: 'relationship',
          relationTo: 'saskaitos',
          label: 'Sąskaita',
          index: true,
          admin: {
            description:
              'Užpildyta — pamoka jau apmokestinta. Būtent tai neleidžia jos įtraukti į dvi sąskaitas. Ištrynus sąskaitą, laukas išsivalo ir pamoka vėl laukia eilėje.',
          },
        },
      ],
    },
    {
      name: 'klaida',
      type: 'text',
      label: 'Siuntimo klaida',
      admin: {
        description: 'Užpildyta tik tada, kai laiško išsiųsti nepavyko.',
      },
    },
  ],
}
