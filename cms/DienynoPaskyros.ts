import { APIError, type CollectionConfig } from 'payload'
import { tikAdministratoriui } from './prieiga'

/**
 * Dienyno paskyros — vardas ir slaptažodis, kuriais vaikas ir tėvai jungiasi
 * į `dienynas.vardiklis.lt`.
 *
 * KURIAMOS RANKA, BE EL. PAŠTO. Vaikai el. pašto dažnai neturi, o laiškas su
 * nuoroda pasimeta. Todėl paskyrą sukuria korepetitorė, slaptažodį įrašo pati
 * ir perduoda žodžiu ar žinute. Pamiršus — tiesiog įrašo naują.
 *
 * VIENA PASKYRA — VIENAS AR KELI VAIKAI. Tėvai su dviem vaikais neturi
 * vartyti dviejų prisijungimų, tad `mokiniai` gali būti keli.
 *
 * VAIKAS PAYLOAD'E PRISIJUNGUSIU NETAMPA. Slaptažodį patikrina Payload
 * (`payload.login`: druska, maišos funkcija, užrakinimas po nesėkmių), bet jo
 * JWT naršyklės nepasiekia. Vaikas gauna atskirą dienyno slapuką
 * (`lib/dienynas.ts`), kurio `/api` ir GraphQL nesupranta. Priežastis — Payload
 * vidinės kolekcijos (dokumentų užraktai ir pan.) leidžia veiksmus BET KURIAM
 * prisijungusiam, ir jų taisyklių iš konfigūracijos nepakeisi. Todėl:
 *   • `beforeLogin` atmeta prisijungimą, kuris ateina ne iš dienyno — t. y.
 *     per `/api/dienyno-paskyros/login` ar GraphQL;
 *   • `useSessions: false` — sesijų lentelė nereikalinga, nes JWT niekam
 *     neišduodamas.
 */
export const DIENYNO_PASKYROS = 'dienyno-paskyros'

/** `req.context` žymė, kuria dienyno prisijungimas prisistato `beforeLogin`. */
export const DIENYNO_KONTEKSTAS = 'dienynoPrisijungimas'

export const DienynoPaskyros: CollectionConfig = {
  slug: DIENYNO_PASKYROS,
  labels: { singular: 'Dienyno paskyra', plural: 'Dienyno paskyros' },
  auth: {
    loginWithUsername: { allowEmailLogin: false, requireEmail: false },
    useSessions: false,
    maxLoginAttempts: 10,
    // 15 min. — vaikui, kuris supainiojo slaptažodį, nereikia laukti iki ryto.
    lockTime: 15 * 60 * 1000,
  },
  access: {
    read: tikAdministratoriui,
    create: tikAdministratoriui,
    update: tikAdministratoriui,
    delete: tikAdministratoriui,
    unlock: tikAdministratoriui,
  },
  admin: {
    useAsTitle: 'username',
    defaultColumns: ['username', 'mokiniai', 'keistiSlaptazodi', 'updatedAt'],
    description:
      'Prisijungimai prie dienynas.vardiklis.lt. El. pašto nereikia: sugalvokite vardą ir laikiną slaptažodį ir perduokite vaikui ar tėvams — pirmą kartą prisijungę jie susikurs savo. Pamiršus — įrašykite naują laikiną slaptažodį; senieji prisijungimai atsijungs patys.',
    group: 'Pamokos',
  },
  hooks: {
    beforeChange: [
      /**
       * Korepetitorei įrašius naują slaptažodį, jis laikinas — vaikas turės jį
       * pasikeisti. Taip pamiršto slaptažodžio atveju užtenka įrašyti bet kokį,
       * o varnelės atskirai žymėti nereikia.
       *
       * Kai slaptažodį keičia pats vaikas (`lib/dienynas.ts`), atnaujinimas
       * ateina su dienyno žyme ir varnelę nuima kviečiantysis.
       */
      ({ data, operation, context }) => {
        if (context?.[DIENYNO_KONTEKSTAS] === true) return data
        if (operation === 'update' && typeof data?.password === 'string' && data.password) {
          return { ...data, keistiSlaptazodi: true }
        }
        return data
      },
    ],
    beforeLogin: [
      ({ context }) => {
        if (context?.[DIENYNO_KONTEKSTAS] !== true) {
          throw new APIError('Prisijungti galima tik per dienyną.', 403, undefined, true)
        }
      },
    ],
  },
  fields: [
    {
      name: 'mokiniai',
      type: 'relationship',
      relationTo: 'mokiniai',
      hasMany: true,
      required: true,
      label: 'Kurių vaikų dienyną mato',
      admin: {
        description: 'Tėvams su keliais vaikais — pasirinkite visus, bus viena paskyra.',
      },
    },
    {
      name: 'keistiSlaptazodi',
      type: 'checkbox',
      label: 'Paprašyti pasikeisti slaptažodį',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description:
          'Įjungta — prisijungęs vaikas pirmiausia sugalvos savo slaptažodį. Įsijungia pati, kai čia įrašote naują slaptažodį; išsijungia, kai vaikas jį pasikeičia.',
      },
    },
  ],
}
