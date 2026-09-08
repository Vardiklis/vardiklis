import type { Field } from 'payload'
import { arLaikas, SAVAITES_DIENOS } from '../lib/laikas'

/**
 * Pamokos eilutės laukai — bendri „Mokiniams“ ir „Grupėms“.
 *
 * KODĖL BENDRI. Pagal šiuos laukus dirba `arVyksta()` (`lib/pamokos.ts`), o ja
 * remiasi ir svetainės kalendorius, ir rytiniai priminimai. Jei grupių pamokos
 * turėtų kad ir vienu lauku kitokį rinkinį, ta pati funkcija dviem vietoms
 * atsakytų skirtingai — ir anksčiau ar vėliau grupė dingtų iš kalendoriaus
 * arba negautų priminimo. Todėl aprašas vienas, o kolekcijos jį tik įsideda.
 *
 * `Field[]`, o ne visas `array` laukas: kolekcijoms skiriasi tik pavadinimas ir
 * paaiškinimas, tad juos kiekviena nurodo pati (žr. `pamokuMasyvas`).
 */
export const PAMOKOS_LAUKAI: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'kartojimas',
        type: 'select',
        label: 'Kartojasi',
        defaultValue: 'savaite',
        required: true,
        options: [
          { label: 'Savaitės dieną', value: 'savaite' },
          { label: 'Mėnesio dieną', value: 'menuo' },
        ],
      },
      {
        name: 'laikas',
        type: 'text',
        label: 'Pradžia',
        required: true,
        admin: { description: 'Formatas 17:00, Lietuvos laiku.' },
        validate: (reiksme: string | null | undefined) =>
          arLaikas(reiksme) ? true : 'Rašykite kaip 17:00.',
      },
      {
        name: 'trukmeMin',
        type: 'number',
        label: 'Trukmė (min.)',
        defaultValue: 60,
        min: 15,
        max: 240,
      },
    ],
  },
  {
    type: 'row',
    admin: { condition: (_, eilute) => eilute?.kartojimas !== 'menuo' },
    fields: [
      {
        name: 'savaitesDiena',
        type: 'select',
        label: 'Savaitės diena',
        options: SAVAITES_DIENOS.map((d, i) => ({
          label: d[0].toUpperCase() + d.slice(1),
          value: String(i + 1),
        })),
      },
      {
        name: 'kasKiek',
        type: 'select',
        label: 'Kaip dažnai',
        defaultValue: '1',
        options: [
          { label: 'Kas savaitę', value: '1' },
          { label: 'Kas 2 savaites', value: '2' },
          { label: 'Kas 3 savaites', value: '3' },
          { label: 'Kas 4 savaites', value: '4' },
        ],
      },
      {
        name: 'nuoDatos',
        type: 'date',
        label: 'Pirmoji tokia pamoka',
        admin: {
          description:
            'Nuo jos skaičiuojamos „kas antra“ savaitės. Būtina, kai pasirinkta rečiau nei kas savaitę.',
          date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' },
          condition: (_, eilute) =>
            eilute?.kartojimas !== 'menuo' && Number(eilute?.kasKiek || 1) > 1,
        },
        /**
         * Be atskaitos datos „kas antra savaitė“ neturi prasmės — neaišku,
         * kurios savaitės yra tos. Kodas tokiu atveju laiko, kad pamoka
         * kas savaitę (`lib/pamokos.ts`), bet čia to neleidžiam įrašyti.
         */
        validate: (reiksme: unknown, { siblingData }: { siblingData?: unknown }) => {
          const eilute = siblingData as { kasKiek?: unknown; kartojimas?: unknown }
          if (eilute?.kartojimas === 'menuo') return true
          if (Number(eilute?.kasKiek || 1) > 1 && !reiksme) {
            return 'Nurodykite, nuo kurios pamokos skaičiuoti.'
          }
          return true
        },
      },
    ],
  },
  {
    name: 'menesioDiena',
    type: 'number',
    label: 'Mėnesio diena',
    min: 1,
    max: 31,
    admin: {
      description:
        'Pvz. 15 — pamoka kas mėnesio 15 dieną. Mėnesiais, kuriuose tokios dienos nėra, pamokos nebus.',
      condition: (_, eilute) => eilute?.kartojimas === 'menuo',
      width: '50%',
    },
  },
]

/** Visas „Pamokų“ masyvas su savo paaiškinimu. */
export function pamokuMasyvas(aprasas: string): Field {
  return {
    name: 'pamokos',
    type: 'array',
    label: 'Pamokų kiekis per savaitę',
    labels: { singular: 'Pamoka', plural: 'Pamokos' },
    admin: {
      description: aprasas,
      components: { RowLabel: '/cms/komponentai/PamokosEilute#PamokosEilute' },
    },
    fields: PAMOKOS_LAUKAI,
  }
}

/**
 * Meet nuorodos laukas.
 *
 * Individualiam mokiniui ir grupei jis vienodas: nuolatinis kambarys, kurio
 * adreso tėvai nemato (jiems eina `vardiklis.lt/p/…`, žr. `Mokiniai.raktas`).
 */
export function meetNuorodosLaukas(aprasas: string): Field {
  return {
    name: 'meetNuoroda',
    type: 'text',
    label: 'Google Meet nuoroda',
    required: true,
    admin: {
      description: aprasas,
      // Sąraše rodoma kaip paspaudžiama nuoroda, atsidaranti naujame lange.
      components: { Cell: '/cms/komponentai/MeetNuoroda#MeetNuorodosCele' },
    },
    validate: (reiksme: string | null | undefined) => {
      if (!reiksme) return 'Įrašykite Meet nuorodą.'
      if (!/^https:\/\/meet\.google\.com\/[\w-]+/.test(reiksme.trim())) {
        return 'Turi prasidėti https://meet.google.com/'
      }
      return true
    },
  }
}
