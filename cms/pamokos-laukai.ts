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
 * EILUČIŲ IŠDĖSTYMAS. Pirma eilutė — kas visada aktualu (kaip kartojasi, kada
 * ir kiek laiko). Antra ir trečia — tik viena jų, pagal pasirinktą kartojimą.
 * Ketvirta — laikotarpis, galiojantis abiem būdams.
 *
 * `Field[]`, o ne visas `array` laukas: kolekcijoms skiriasi tik pavadinimas ir
 * paaiškinimas, tad juos kiekviena nurodo pati (žr. `pamokuMasyvas`).
 */

/** Ar eilutėje pasirinktas mėnesinis kartojimas. */
const arMenesinis = (eilute: unknown): boolean =>
  (eilute as { kartojimas?: unknown })?.kartojimas === 'menuo'

/**
 * Ar eilutė kartojasi rečiau nei kiekvieną kartą.
 *
 * Būtent tada „Nuo kada“ tampa privaloma: be atskaitos taško neaišku, kurios
 * savaitės ar mėnesiai yra „tie“.
 */
function arRetesnis(eilute: unknown): boolean {
  const e = eilute as { kartojimas?: unknown; kasKiek?: unknown; kasKiekMenesiu?: unknown }
  return arMenesinis(e)
    ? Number(e?.kasKiekMenesiu || 1) > 1
    : Number(e?.kasKiek || 1) > 1
}

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
    admin: { condition: (_, eilute) => !arMenesinis(eilute) },
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
    ],
  },
  {
    type: 'row',
    admin: { condition: (_, eilute) => arMenesinis(eilute) },
    fields: [
      {
        name: 'menesioDiena',
        type: 'number',
        label: 'Mėnesio diena',
        min: 1,
        max: 31,
        admin: {
          description:
            'Pvz. 15. Mėnesiais, kuriuose tokios dienos nėra (vasario 30-osios), pamokos nebus.',
        },
        validate: (reiksme: unknown, { siblingData }: { siblingData?: unknown }) => {
          if (!arMenesinis(siblingData)) return true
          if (!reiksme) return 'Nurodykite mėnesio dieną.'
          return true
        },
      },
      {
        name: 'kasKiekMenesiu',
        type: 'select',
        label: 'Kaip dažnai',
        defaultValue: '1',
        options: [
          { label: 'Kas mėnesį', value: '1' },
          { label: 'Kas 2 mėnesius', value: '2' },
          { label: 'Kas 3 mėnesius', value: '3' },
          { label: 'Kas 6 mėnesius', value: '6' },
          { label: 'Kas 12 mėnesių', value: '12' },
        ],
        admin: {
          description: 'Rečiau nei kas mėnesį — nurodykite ir „Nuo kada“.',
        },
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'nuoDatos',
        type: 'date',
        label: 'Nuo kada',
        admin: {
          description:
            'Tuščia — pamoka vyksta iškart. Pasirinkus rečiau nei kas savaitę ar kas mėnesį, nuo šios datos skaičiuojami intervalai, tad geriausia įrašyti pirmosios tokios pamokos dieną.',
          date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' },
        },
        /**
         * Be atskaitos datos „kas antra savaitė“ (ar „kas antras mėnuo“) neturi
         * prasmės — neaišku, kurios savaitės ar mėnesiai yra tie. Kodas tokiu
         * atveju laiko, kad pamoka vyksta kiekvieną kartą (`lib/pamokos.ts`),
         * bet čia to neleidžiam įrašyti.
         */
        validate: (reiksme: unknown, { siblingData }: { siblingData?: unknown }) => {
          if (arRetesnis(siblingData) && !reiksme) {
            return 'Nurodykite, nuo kurios pamokos skaičiuoti.'
          }
          return true
        },
      },
      {
        name: 'ikiDatos',
        type: 'date',
        label: 'Iki kada (imtinai)',
        admin: {
          description:
            'Tuščia — pamoka kartojasi be galo. Įrašius, po šios dienos pamokų nebėra, o laikas kalendoriuje atsilaisvina pats — eilutės trinti nereikia.',
          date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' },
        },
        /**
         * Apverstas langas nieko nereikštų: pamokų nebūtų nė vienos, o
         * kalendoriuje tai atrodytų tiesiog kaip dingęs laikas be priežasties.
         */
        validate: (reiksme: unknown, { siblingData }: { siblingData?: unknown }) => {
          const nuo = (siblingData as { nuoDatos?: unknown })?.nuoDatos
          if (!reiksme || !nuo) return true
          if (String(reiksme).slice(0, 10) < String(nuo).slice(0, 10)) {
            return '„Iki kada“ negali būti anksčiau už „Nuo kada“.'
          }
          return true
        },
      },
    ],
  },
]

/** Visas „Pamokų“ masyvas su savo paaiškinimu. */
export function pamokuMasyvas(aprasas: string): Field {
  return {
    name: 'pamokos',
    type: 'array',
    // Ne „per savaitę“: eilutė gali kartotis ir kas mėnesį, ir kas pusmetį.
    label: 'Pamokų laikai',
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
