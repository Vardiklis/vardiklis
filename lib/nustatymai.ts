/**
 * Kainos ir kvietimas susisiekti iš Payload globalo „Kainos ir kvietimas“.
 *
 * Kaip ir straipsniuose, klaidos nuryjamos: neatsakius backend'ui straipsnis
 * lieka be kainų lentelės, bet puslapis atsidaro. Numatytosios reikšmės
 * atitinka globalo `defaultValue` — kad nesutapus tekstams nesijaustų, jog
 * puslapis „pusiau įsijungė“.
 */

export type KainuEilute = {
  pavadinimas: string
  trukme: string | null
  kaina: string
  prierasas: string | null
}

export type Nustatymai = {
  rodyti: boolean
  kainuAntraste: string
  kainos: KainuEilute[]
  nuolaida: string | null
  kainuPastaba: string | null
  formosAntraste: string
  formosTekstas: string
}

const NUMATYTIEJI: Nustatymai = {
  rodyti: true,
  kainuAntraste: 'Individualios pamokos',
  kainos: [],
  nuolaida: 'Pirmai pamokai — nuolaida',
  kainuPastaba: null,
  formosAntraste: 'Registracija į pamoką',
  formosTekstas:
    'Parašykite, kelintoje klasėje vaikas ir kas nesiseka — susisieksiu dėl laiko.',
}

type Dok = {
  rodyti?: boolean | null
  kainuAntraste?: string | null
  kainos?:
    | {
        pavadinimas?: string | null
        trukme?: string | null
        kaina?: string | null
        prierasas?: string | null
      }[]
    | null
  nuolaida?: string | null
  kainuPastaba?: string | null
  formosAntraste?: string | null
  formosTekstas?: string | null
}

/** Tuščias tekstas laikomas „nerodyti“, ne „rodyti tuščią eilutę“. */
function tekstas(reiksme: string | null | undefined, atsarga: string | null): string | null {
  const isvalytas = reiksme?.trim()
  return isvalytas ? isvalytas : atsarga
}

export async function gautiNustatymus(): Promise<Nustatymai> {
  try {
    const [{ getPayload }, { default: config }] = await Promise.all([
      import('payload'),
      import('@payload-config'),
    ])
    const payload = await getPayload({ config })
    const d = (await payload.findGlobal({ slug: 'nustatymai', overrideAccess: false })) as Dok

    return {
      rodyti: d.rodyti !== false,
      kainuAntraste: tekstas(d.kainuAntraste, NUMATYTIEJI.kainuAntraste) as string,
      kainos: (d.kainos ?? [])
        .filter((e) => e.pavadinimas?.trim() && e.kaina?.trim())
        .map((e) => ({
          pavadinimas: e.pavadinimas!.trim(),
          trukme: tekstas(e.trukme, null),
          kaina: e.kaina!.trim(),
          prierasas: tekstas(e.prierasas, null),
        })),
      nuolaida: tekstas(d.nuolaida, null),
      kainuPastaba: tekstas(d.kainuPastaba, null),
      formosAntraste: tekstas(d.formosAntraste, NUMATYTIEJI.formosAntraste) as string,
      formosTekstas: tekstas(d.formosTekstas, NUMATYTIEJI.formosTekstas) as string,
    }
  } catch {
    return NUMATYTIEJI
  }
}
