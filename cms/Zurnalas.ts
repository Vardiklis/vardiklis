import type { CollectionConfig } from 'payload'
import { arLaikas, data as dataVilniuje } from '../lib/laikas'
import { DIENYNO_FAILAI } from './DienynoFailai'
import { tikAdministratoriui } from './prieiga'

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

/**
 * Dienyno laukai, bendri visai grupei — jie kopijuojami kitiems nariams.
 *
 * `atsiliepimas` ir jo failai čia NEĮEINA: atsiliepimas rašomas konkrečiam
 * vaikui, ir nukopijuotas jis nuvažiuotų kitų vaikų tėvams.
 */
const GRUPES_LAUKAI = ['tema', 'namuDarbai', 'namuDarbuFailai'] as const

/**
 * Lauko reikšmė palyginimui. Tekstas — tuščias virsta `null`. Failų sąrašas —
 * id eilė, nes hook'e jis gali ateiti ir numeriais, ir dokumentais.
 */
function palyginimui(reiksme: unknown): string | null {
  if (Array.isArray(reiksme)) {
    const ids = reiksme.map(rysioId).filter((id) => id != null)
    return ids.length ? JSON.stringify(ids) : null
  }
  return (reiksme as string | null | undefined) || null
}

/** `context` žymė: šis įrašas — grupės kopija, toliau kopijuoti nereikia. */
const GRUPES_KOPIJA = 'dienynoGrupesKopija'

export const Zurnalas: CollectionConfig = {
  slug: 'zurnalas',
  labels: { singular: 'Pamoka', plural: 'Pamokų žurnalas' },
  access: {
    read: tikAdministratoriui,
    create: tikAdministratoriui,
    update: tikAdministratoriui,
    delete: tikAdministratoriui,
  },
  admin: {
    useAsTitle: 'santrauka',
    defaultColumns: ['santrauka', 'data', 'laikas', 'tipas', 'busena', 'tema', 'kaina'],
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
    afterChange: [
      /**
       * Grupinės pamokos tema, namų darbai ir jų failai — visiems nariams.
       *
       * Žurnale grupė palieka po įrašą kiekvienam vaikui, o tema ir namų darbai
       * jiems tie patys. Be šito tektų tą patį tekstą įrašyti tris kartus, ir
       * anksčiau ar vėliau vienas vaikas dienyne jo nerastų. Todėl užpildžius
       * vieno nario įrašą, tas pats nukopijuojamas kitiems tos pačios grupės,
       * datos ir laiko įrašams. Failai nekopijuojami fiziškai — nariai rodo į
       * tuos pačius dokumentus.
       *
       * Kopijuojami tik PASIKEITĘ laukai: pažymėjus vienam vaikui „Įvyko“, kitų
       * temos nepaliečiamos. Kopijos vėl kviečia šį hook'ą — `context` žymė
       * neleidžia joms kopijuoti toliau.
       */
      async ({ doc, previousDoc, operation, req, context }) => {
        if (context?.[GRUPES_KOPIJA]) return doc

        const grupeId = rysioId(doc.grupe)
        if (grupeId == null || !doc.data || !doc.laikas) return doc

        const pakeista: Record<string, unknown> = {}
        for (const laukas of GRUPES_LAUKAI) {
          const naujas = palyginimui(doc[laukas])
          const senas = operation === 'create' ? null : palyginimui(previousDoc?.[laukas])
          if (naujas === senas) continue
          pakeista[laukas] = Array.isArray(doc[laukas])
            ? (doc[laukas] as unknown[]).map(rysioId).filter((id) => id != null)
            : naujas
        }
        if (Object.keys(pakeista).length === 0) return doc

        await req.payload.update({
          collection: 'zurnalas',
          where: {
            and: [
              { grupe: { equals: grupeId } },
              { data: { equals: doc.data } },
              { laikas: { equals: doc.laikas } },
              { id: { not_equals: doc.id } },
            ],
          },
          data: pakeista,
          overrideAccess: true,
          context: { [GRUPES_KOPIJA]: true },
          req,
        })
        return doc
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
      type: 'collapsible',
      label: 'Dienynas (mato mokinys ir tėvai)',
      admin: {
        description:
          'Rodoma dienynas.vardiklis.lt, kai pamoka jau prasidėjo. Grupinei pamokai temą ir namų darbus užtenka įrašyti vienam nariui — kitiems nukopijuojama. Atsiliepimas — tik šiam vaikui.',
      },
      fields: [
        { name: 'tema', type: 'text', label: 'Tema' },
        {
          name: 'namuDarbai',
          type: 'textarea',
          label: 'Namų darbai',
          admin: { description: 'Palikus tuščią ir be failų, dienyne parašyta „Namų darbų nėra“.' },
        },
        {
          name: 'namuDarbuFailai',
          type: 'upload',
          relationTo: DIENYNO_FAILAI,
          hasMany: true,
          label: 'Namų darbų failai ir nuotraukos',
          admin: { description: 'Užduočių lapas, vadovėlio puslapio nuotrauka ir pan. Mato tik šio vaiko paskyra.' },
        },
        {
          name: 'atsiliepimas',
          type: 'textarea',
          label: 'Mokytojo atsiliepimas',
          admin: {
            description: 'Kaip sekėsi, į ką atkreipti dėmesį. Grupės nariams nekopijuojamas.',
          },
        },
        {
          name: 'atsiliepimoFailai',
          type: 'upload',
          relationTo: DIENYNO_FAILAI,
          hasMany: true,
          label: 'Atsiliepimo failai ir nuotraukos',
          admin: { description: 'Pvz. ištaisyto darbo nuotrauka.' },
        },
      ],
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
        {
          name: 'klausta',
          type: 'date',
          label: 'Klausta, ar įvyko',
          admin: {
            date: { pickerAppearance: 'dayAndTime' },
            description:
              'Užpildyta — laiškas „ar įvyko?“ jau išsiųstas. Išvalius bus paklausta dar kartą.',
          },
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
