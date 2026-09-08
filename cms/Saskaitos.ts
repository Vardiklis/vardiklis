import type { CollectionConfig } from 'payload'
import { eurai, suformatuok } from '../lib/pinigai'
import { suskaiciuok, type SumuEilute } from '../lib/saskaitos-sumos'

/**
 * Sąskaitos tėvams.
 *
 * IŠ KUR ATSIRANDA. Juodraščius sudaro serveris iš pamokų žurnalo
 * (`lib/saskaitos.ts`) — imamos tik pamokos, pažymėtos „Įvyko“ ir dar
 * neapmokestintos. Todėl `create` čia uždarytas: sąskaita be žurnalo eilučių
 * neturėtų ryšio su tuo, kas iš tikrųjų vyko, o žurnalo eilutės liktų kaboti
 * ir patektų į kitą sąskaitą dar kartą.
 *
 * TAISYTI GALIMA ir tam ši kolekcija turi įprastą Payload redaktorių: pakeitus
 * kiekį ar kainą, `beforeChange` perskaičiuoja visas sumas. Savo formos
 * skydelyje nedarom — Payload jau moka eilučių masyvą, patvirtinimą prieš
 * išeinant ir dokumento rakinimą.
 *
 * NUMERIS SUTEIKIAMAS TIK IŠRAŠANT, ne kuriant juodraštį. Numeracija privalo
 * eiti be spragų, o juodraštį galima ir ištrinti — jei numeris būtų duodamas
 * iš karto, kiekvienas ištrintas juodraštis paliktų skylę, kurios paskui
 * niekas nepaaiškintų.
 *
 * SUMOS LAIKOMOS CENTAIS. Sąskaitos suma turi sutapti su eilučių suma iki
 * cento (to tikrina ir i.SAF), o slankusis kablelis to negarantuoja —
 * žr. `lib/pinigai.ts`.
 */
export const Saskaitos: CollectionConfig = {
  slug: 'saskaitos',
  labels: { singular: 'Sąskaita', plural: 'Sąskaitos' },
  access: {
    read: ({ req }) => Boolean(req.user),
    // Kuria tik serveris per `overrideAccess`, kaip `Zurnalas` ir `Rezervacijos`.
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'santrauka',
    defaultColumns: ['santrauka', 'numeris', 'busena', 'sumaIsViso', 'data'],
    description: 'Sąskaitos tėvams. Juodraščius sudaro skydelis iš pamokų žurnalo.',
    group: 'Pamokos',
  },
  hooks: {
    /**
     * Sumų perskaičiavimas po kiekvieno pakeitimo — ir serverio sudaryto, ir
     * ranka pataisyto. Vienoje vietoje, o ne prie kiekvieno išsaugojimo:
     * kitaip anksčiau ar vėliau atsirastų kelias, kuriuo pakeistas kiekis
     * lentelėje matomas, o galutinė suma — ne.
     */
    beforeChange: [
      ({ data }) => {
        const eilutes = (data.eilutes ?? []) as (SumuEilute & { suma?: number | null })[]
        const sumos = suskaiciuok(eilutes, data.kainosSuPvm !== false)

        eilutes.forEach((e, i) => {
          e.suma = eurai(sumos.eiluciuSumos[i] ?? 0)
        })

        data.sumaBePvm = eurai(sumos.bePvm)
        data.pvmSuma = eurai(sumos.pvm)
        data.sumaIsViso = eurai(sumos.isViso)

        const kam = data.pirkejoVardas || data.pirkejoPastas || '—'
        data.santrauka = `${data.numeris || 'Juodraštis'} · ${kam} · ${suformatuok(sumos.isViso)}`

        return data
      },
    ],
  },
  fields: [
    {
      name: 'santrauka',
      type: 'text',
      label: 'Sąskaita',
      admin: { readOnly: true, description: 'Sudaroma automatiškai.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'numeris',
          type: 'text',
          label: 'Numeris',
          unique: true,
          index: true,
          admin: {
            readOnly: true,
            description: 'Suteikiamas išrašant. Juodraštis numerio dar neturi.',
          },
        },
        {
          name: 'busena',
          type: 'select',
          label: 'Būsena',
          defaultValue: 'juodrastis',
          options: [
            { label: 'Juodraštis', value: 'juodrastis' },
            { label: 'Išrašyta', value: 'israsyta' },
            { label: 'Išsiųsta', value: 'issiusta' },
            { label: 'Apmokėta', value: 'apmoketa' },
            { label: 'Anuliuota', value: 'anuliuota' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'data',
          type: 'text',
          label: 'Išrašymo data',
          index: true,
          admin: { readOnly: true, description: 'YYYY-MM-DD, Vilniaus para.' },
        },
        {
          name: 'terminas',
          type: 'text',
          label: 'Apmokėti iki',
          admin: { readOnly: true },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'laikotarpisNuo',
          type: 'text',
          label: 'Laikotarpis nuo',
          index: true,
          admin: { readOnly: true, description: 'Mėnuo, už kurį išrašyta.' },
        },
        {
          name: 'laikotarpisIki',
          type: 'text',
          label: 'Laikotarpis iki',
          admin: { readOnly: true },
        },
      ],
    },
    {
      name: 'mokiniai',
      type: 'relationship',
      relationTo: 'mokiniai',
      hasMany: true,
      label: 'Už kuriuos vaikus',
      admin: {
        readOnly: true,
        description: 'Vienas tėvas su keliais vaikais gauna vieną sąskaitą.',
      },
    },
    {
      type: 'collapsible',
      label: 'Pirkėjas',
      admin: {
        description:
          'Nurašyta iš mokinio kortelės išrašymo metu. Pataisius kortelę, jau išrašyta sąskaita nesikeičia — todėl čia atskiri laukai, o ne ryšys.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'pirkejoVardas', type: 'text', label: 'Vardas, pavardė' },
            { name: 'pirkejoPastas', type: 'email', label: 'El. paštas' },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'pirkejoKodas',
              type: 'text',
              label: 'Asmens / įmonės kodas',
              admin: { description: 'Nebūtina. Tuščias — i.SAF eina „ND“ (nežinomas).' },
            },
            {
              name: 'pirkejoPvmKodas',
              type: 'text',
              label: 'PVM mokėtojo kodas',
              admin: { description: 'Fiziniai asmenys jo neturi — palikite tuščią.' },
            },
          ],
        },
        { name: 'pirkejoAdresas', type: 'textarea', label: 'Adresas' },
      ],
    },
    {
      name: 'eilutes',
      type: 'array',
      label: 'Eilutės',
      labels: { singular: 'Eilutė', plural: 'Eilutės' },
      admin: {
        description: 'Pakeitus kiekį ar kainą, sumos perskaičiuojamos išsaugant.',
      },
      fields: [
        {
          name: 'aprasymas',
          type: 'text',
          label: 'Paslauga',
          required: true,
          admin: { description: 'Pvz. „Matematikos pamoka (individuali) — Jonas“.' },
        },
        {
          name: 'detales',
          type: 'text',
          label: 'Datos',
          admin: { description: 'Kurių dienų pamokos į šią eilutę suėjo. Rodoma smulkiu tekstu.' },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'kiekis',
              type: 'number',
              label: 'Kiekis',
              defaultValue: 1,
              min: 0,
              required: true,
            },
            {
              name: 'matoVnt',
              type: 'text',
              label: 'Mato vnt.',
              defaultValue: 'vnt.',
            },
            {
              name: 'kaina',
              type: 'number',
              label: 'Vieneto kaina (€)',
              required: true,
              admin: {
                description:
                  'Tokia, kokia rodoma tėvams: su PVM arba be — pagal sąskaitos žymą „Kainos su PVM“.',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'pvmKodas',
              type: 'text',
              label: 'PVM kodas',
              admin: { description: 'Iš „Sąskaitų nustatymų“, pvz. PVM1.' },
            },
            {
              name: 'pvmProc',
              type: 'number',
              label: 'PVM (%)',
              defaultValue: 21,
            },
            {
              name: 'suma',
              type: 'number',
              label: 'Suma (€)',
              admin: { readOnly: true, description: 'Kiekis × kaina. Perskaičiuojama išsaugant.' },
            },
          ],
        },
      ],
    },
    {
      name: 'kainosSuPvm',
      type: 'checkbox',
      label: 'Eilučių kainos nurodytos su PVM',
      defaultValue: true,
      admin: {
        readOnly: true,
        description:
          'Nurašoma iš „Sąskaitų nustatymų“ išrašymo metu. Nuo jos priklauso, ar PVM iš sumos išskaičiuojamas, ar prie jos pridedamas — todėl vėliau nebekeičiama.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sumaBePvm',
          type: 'number',
          label: 'Iš viso be PVM (€)',
          admin: { readOnly: true },
        },
        { name: 'pvmSuma', type: 'number', label: 'PVM (€)', admin: { readOnly: true } },
        {
          name: 'sumaIsViso',
          type: 'number',
          label: 'Mokėti (€)',
          admin: { readOnly: true },
        },
      ],
    },
    { name: 'pastaba', type: 'textarea', label: 'Pastaba sąskaitoje (tėvai ją mato)' },
    {
      type: 'row',
      fields: [
        {
          name: 'issiusta',
          type: 'date',
          label: 'Išsiųsta tėvams',
          admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'apmoketa',
          type: 'date',
          label: 'Apmokėta',
          admin: {
            description: 'Žymima ranka — banko sąskaitos sistema nemato.',
            date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' },
          },
        },
      ],
    },
    {
      name: 'siuntimoKlaida',
      type: 'text',
      label: 'Siuntimo klaida',
      admin: { readOnly: true, description: 'Užpildyta tik tada, kai laiško išsiųsti nepavyko.' },
    },
    {
      type: 'collapsible',
      label: 'i.SAF',
      admin: { description: 'Kelias į mokesčių inspekciją. Pildo sistema.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'isafBusena',
              type: 'select',
              label: 'Būsena',
              defaultValue: 'neteikta',
              options: [
                { label: 'Neteikta', value: 'neteikta' },
                { label: 'Įkelta (tikrinama)', value: 'ikelta' },
                { label: 'Pateikta', value: 'pateikta' },
                { label: 'Klaida', value: 'klaida' },
              ],
              admin: { readOnly: true },
            },
            {
              name: 'isafAtnaujinta',
              type: 'date',
              label: 'Paskutinis atsakymas',
              admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'isafTrackingNumber',
              type: 'text',
              label: 'Rinkmenos nr. (trackingNumber)',
              admin: { readOnly: true },
            },
            {
              name: 'isafRegistryNumber',
              type: 'text',
              label: 'Registro nr.',
              admin: { readOnly: true },
            },
          ],
        },
        {
          name: 'isafKlaida',
          type: 'textarea',
          label: 'i.SAF klaida',
          admin: { readOnly: true },
        },
      ],
    },
  ],
}
