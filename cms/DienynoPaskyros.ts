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
    defaultColumns: ['username', 'mokiniai', 'updatedAt'],
    description:
      'Prisijungimai prie dienynas.vardiklis.lt. El. pašto nereikia: sugalvokite vardą ir slaptažodį ir perduokite vaikui ar tėvams. Pamiršus — įrašykite naują slaptažodį; senieji prisijungimai tada atsijungia patys.',
    group: 'Pamokos',
  },
  hooks: {
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
  ],
}
