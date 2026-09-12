import { getPayload } from 'payload'
import config from '@payload-config'
import { arTeisingasAtsisakymas } from '@/lib/priminimai'
import { vidausPuslapis } from '@/lib/vidaus-puslapis'

/**
 * Priminimų atsisakymas iš laiško.
 *
 * KAM TO REIKIA. Pašto tarnybos vertina ne tik laiško turinį, bet ir tai, ar
 * siuntėjas elgiasi kaip teisėta automatika. `List-Unsubscribe` antraštė yra
 * vienas stipriausių tokių ženklų — be jos vienodi kasdieniai laiškai iš
 * `@gmail.com` adreso anksčiau ar vėliau pradedami laikyti šlamštu. Antraštė
 * turi rodyti į TIKRAI veikiantį adresą: Gmail ją paspaudžia pats.
 *
 * KODĖL GET TIK KLAUSIA. Paštą tikrinančios sistemos kartais atidaro laiške
 * esančias nuorodas iš anksto. Jei atsisakymas įvyktų per `GET`, tėvai liktų
 * be priminimų nieko nespaudę. Todėl `GET` parodo mygtuką, o keičia tik
 * `POST` — to reikalauja ir RFC 8058 „vieno paspaudimo“ atsisakymas, kurį
 * naudoja pati pašto programa.
 *
 * NEIŠTRINA, o nuima varnelę „Tėvai sutiko gauti priminimus“ — tą pačią, kurią
 * tikrina `suplanuok`. Mokinys lieka žurnale, sąskaitose ir tvarkaraštyje.
 */

export const dynamic = 'force-dynamic'

const parametrai = (uzklausa: Request): { id: string; parasas: string } => {
  const url = new URL(uzklausa.url)
  return { id: url.searchParams.get('m') ?? '', parasas: url.searchParams.get('p') ?? '' }
}

export async function GET(uzklausa: Request) {
  const { id, parasas } = parametrai(uzklausa)
  if (!id || !arTeisingasAtsisakymas(id, parasas)) return negalioja()

  return vidausPuslapis(
    'Atsisakyti priminimų?',
    'Nebesiųsiu laiškų apie artėjančias pamokas. Pamokos nuoroda veiks toliau.',
    200,
    `<form method="post"><button type="submit">Taip, atsisakau</button></form>`,
  )
}

export async function POST(uzklausa: Request) {
  const { id, parasas } = parametrai(uzklausa)
  if (!id || !arTeisingasAtsisakymas(id, parasas)) return negalioja()

  const payload = await getPayload({ config })
  try {
    await payload.update({
      collection: 'mokiniai',
      id,
      overrideAccess: true,
      data: { sutikimas: false },
    })
  } catch (klaida) {
    console.error('[atsisakyti] sutikimo nuimti nepavyko:', klaida)
    return vidausPuslapis('Nepavyko', 'Parašykite man ir aš išjungsiu ranka.', 500)
  }

  return vidausPuslapis(
    'Priminimų nebesiųsiu',
    'Pamokos nuoroda veikia toliau. Persigalvojus — parašykite, įjungsiu atgal.',
    200,
  )
}

function negalioja(): Response {
  return vidausPuslapis('Nuoroda negalioja', 'Patikrinkite, ar ji nebuvo perkirpta laiške.', 400)
}
