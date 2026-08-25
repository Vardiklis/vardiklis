import type { GlobalConfig } from 'payload'

/**
 * Kainos ir kvietimas susisiekti — tai, kas automatiškai atsiranda po
 * kiekvienu straipsniu.
 *
 * Atskiras globalas, o ne laukai straipsnyje: kainos vienodos visur, tad jas
 * turi būti galima pakeisti vienoje vietoje, o ne dvidešimtyje straipsnių.
 *
 * Skaityti gali visi — svetainė šiuos laukus rodo neprisijungusiam lankytojui.
 */
export const Nustatymai: GlobalConfig = {
  slug: 'nustatymai',
  label: 'Kainos ir kvietimas',
  access: { read: () => true },
  admin: {
    description: 'Rodoma po kiekvienu straipsniu: kainos, nuolaida ir registracijos forma.',
  },
  fields: [
    {
      name: 'rodyti',
      type: 'checkbox',
      label: 'Rodyti po straipsniais',
      defaultValue: true,
      admin: {
        description: 'Išjungus, straipsnių apačioje nebeliks nei kainų, nei formos.',
      },
    },
    {
      type: 'collapsible',
      label: 'Kainos',
      fields: [
        {
          name: 'kainuAntraste',
          type: 'text',
          label: 'Antraštė',
          defaultValue: 'Individualios pamokos',
        },
        {
          name: 'kainos',
          type: 'array',
          label: 'Kainų eilutės',
          labels: { singular: 'Eilutė', plural: 'Eilutės' },
          admin: {
            description: 'Nepalikus nė vienos eilutės, lentelė nerodoma visai.',
          },
          fields: [
            {
              name: 'pavadinimas',
              type: 'text',
              label: 'Ką apima',
              required: true,
              admin: { description: 'Pvz. „Individuali pamoka nuotoliu“.' },
            },
            {
              name: 'trukme',
              type: 'text',
              label: 'Trukmė',
              admin: { description: 'Pvz. „60 min.“' },
            },
            {
              name: 'kaina',
              type: 'text',
              label: 'Kaina',
              required: true,
              admin: { description: 'Rašoma taip, kaip turi atrodyti: „25 €“.' },
            },
            {
              name: 'prierasas',
              type: 'text',
              label: 'Prierašas (nebūtina)',
              admin: { description: 'Pvz. „nuo 4 pamokų per mėnesį“.' },
            },
          ],
        },
        {
          name: 'nuolaida',
          type: 'text',
          label: 'Užrašas apie nuolaidą',
          defaultValue: 'Pirmai pamokai — nuolaida',
          admin: {
            description: 'Rodomas oranžine juostele virš lentelės. Palikus tuščią — nerodomas.',
          },
        },
        {
          name: 'kainuPastaba',
          type: 'textarea',
          label: 'Smulkus paaiškinimas po lentele (nebūtina)',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Registracijos forma',
      fields: [
        {
          name: 'formosAntraste',
          type: 'text',
          label: 'Antraštė',
          defaultValue: 'Registracija į pamoką',
        },
        {
          name: 'formosTekstas',
          type: 'textarea',
          label: 'Įžanginis sakinys',
          defaultValue:
            'Parašykite, kelintoje klasėje vaikas ir kas nesiseka — susisieksiu dėl laiko.',
        },
      ],
    },
  ],
}
