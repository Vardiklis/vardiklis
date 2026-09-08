import type { CollectionConfig } from 'payload'
import { meetNuorodosLaukas, pamokuMasyvas } from './pamokos-laukai'

/**
 * Grupės — kai tą patį laiką pas tą pačią Meet nuorodą ateina keli vaikai.
 *
 * KODĖL ATSKIRAS OBJEKTAS, O NE VARNELĖ PRIE MOKINIO. Grupė turi tai, ko
 * mokinys neturi: VIENĄ laiką ir VIENĄ kambarį keliems. Laikant tai varnele
 * prie mokinio, tas pats langas kalendoriuje būtų suskaičiuotas tris kartus, o
 * pakeitus valandą ją reikėtų taisyti kiekvienoje kortelėje atskirai.
 *
 * KAS LIEKA MOKINYJE: tėvų paštas, pauzė, sutikimas ir priminimo valanda —
 * jie asmeniniai ir grupinei pamokai galioja lygiai taip pat. Todėl grupinės
 * pamokos priminimas eina kiekvienam nariui atskirai, jo tėvų adresu ir jo
 * valandą, tik su grupės nuoroda.
 *
 * ŽURNALE grupinė pamoka palieka PO VIENĄ įrašą kiekvienam nariui: lankomumas
 * ir apmokėjimas yra pervaikį, ne pergrupę — vienas gali praleisti, kiti ne.
 *
 * PRIEIGA užrakinta visiems keturiems veiksmams dėl tos pačios priežasties,
 * kaip „Mokiniuose“: čia guli nuolatinė Meet nuoroda.
 */
export const Grupes: CollectionConfig = {
  slug: 'grupes',
  labels: { singular: 'Grupė', plural: 'Grupės' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'pavadinimas',
    defaultColumns: ['pavadinimas', 'nariai', 'meetNuoroda', 'aktyvi'],
    description:
      'Kelių vaikų pamokos vienu metu. Kaina grupinei pamokai — iš „Sąskaitų nustatymų“.',
    group: 'Pamokos',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'pavadinimas',
          type: 'text',
          label: 'Pavadinimas',
          required: true,
          admin: { description: 'Pvz. „8 klasė, penktadieniais“. Tėvai jo nemato.' },
        },
        {
          name: 'aktyvi',
          type: 'checkbox',
          label: 'Aktyvi',
          defaultValue: true,
          admin: { description: 'Nuėmus varnelę priminimai nustoja eiti, o įrašas lieka.' },
        },
      ],
    },
    {
      name: 'nariai',
      type: 'relationship',
      relationTo: 'mokiniai',
      hasMany: true,
      label: 'Nariai',
      required: true,
      admin: {
        description:
          'Kiekvienam nariui priminimas eina atskirai, jo tėvų adresu — su šios grupės nuoroda.',
      },
    },
    meetNuorodosLaukas(
      'Bendras šios grupės kambarys. Tėvams siunčiama ne ji, o kiekvieno vaiko vardiklis.lt/p/… nuoroda, kuri grupinės pamokos metu atveda būtent čia.',
    ),
    pamokuMasyvas(
      'Kartojasi, kol nuimta „Aktyvi“ arba pamoka ištrinta. Šie laikai kalendoriuje užima langą lygiai taip pat, kaip individualūs.',
    ),
    {
      name: 'pauzeIki',
      type: 'date',
      label: 'Pauzė iki (imtinai)',
      admin: {
        description:
          'Atostogoms visai grupei. Atskiro vaiko pauzė nurodoma jo kortelėje ir galioja ir čia.',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' },
      },
    },
    { name: 'pastabos', type: 'textarea', label: 'Pastabos (tėvai jų nemato)' },
  ],
}
