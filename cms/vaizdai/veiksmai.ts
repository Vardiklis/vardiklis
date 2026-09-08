'use server'

import { headers as gautiAntrastes } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isafIkelk, isafPateik, isafTikrink } from '@/lib/isaf-teikimas'
import { anuliuok, ismeskJuodrasti, israsyk, sugeneruokJuodrascius } from '@/lib/saskaitos'
import { siuskSaskaita } from '@/lib/saskaitos-pastas'

/**
 * Skydelio veiksmai.
 *
 * KIEKVIENAS TIKRINA PRISIJUNGIMĄ. Serverio veiksmas yra viešas galinis
 * taškas su savo adresu: jį galima iškviesti ir neatidarius CMS, tad mygtuko
 * buvimas už prisijungimo lango nieko neapsaugo. Be šito patikrinimo bet kas
 * galėtų išrašyti sąskaitą ar išsiųsti laišką tėvams.
 *
 * KLAIDOS GRĄŽINAMOS, NE METAMOS. Serverio veiksmui nulūžus naršyklė parodytų
 * bendrą „unexpected response“, o priežastis liktų serverio žurnale. Čia
 * priežastis grąžinama tekstu ir parodoma pranešimu — kitaip „nepavyko
 * išsiųsti“ būtų visa, ką kada nors pamatysi.
 */

export type Rezultatas = {
  pavyko: boolean
  zinute: string
  klaidos?: string[]
}

const KELIAS = '/admin/saskaitos'

async function butinaPrisijungti(): Promise<void> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await gautiAntrastes() })
  if (!user) throw new Error('Neprisijungta.')
}

/** Bendras apvalkalas: prisijungimo patikra, klaidų gaudymas ir puslapio atnaujinimas. */
async function veiksmas(darbas: () => Promise<Rezultatas>): Promise<Rezultatas> {
  try {
    await butinaPrisijungti()
    const rezultatas = await darbas()
    revalidatePath(KELIAS)
    return rezultatas
  } catch (klaida) {
    console.error('[saskaitos] veiksmas nulūžo:', klaida)
    return { pavyko: false, zinute: String(klaida).replace(/^Error:\s*/, '').slice(0, 300) }
  }
}

export async function sugeneruokVeiksmas(laikotarpis: string): Promise<Rezultatas> {
  return veiksmas(async () => {
    const a = await sugeneruokJuodrascius(laikotarpis)
    return { pavyko: a.sukurta + a.papildyta > 0, zinute: a.zinute }
  })
}

export async function israsykVeiksmas(id: number): Promise<Rezultatas> {
  return veiksmas(async () => {
    const { numeris } = await israsyk(id)
    return { pavyko: true, zinute: `Išrašyta Nr. ${numeris}.` }
  })
}

/**
 * Visų mėnesio juodraščių išrašymas iš eilės.
 *
 * Vienas po kito, o ne lygiagrečiai: numeriai turi eiti be spragų ir be
 * susidūrimų, o tai užtikrina tik nuosekli eilė.
 */
export async function israsykVisusVeiksmas(laikotarpis: string): Promise<Rezultatas> {
  return veiksmas(async () => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'saskaitos',
      where: {
        and: [
          { laikotarpisNuo: { equals: `${laikotarpis}-01` } },
          { busena: { equals: 'juodrastis' } },
        ],
      },
      limit: 500,
      depth: 0,
      sort: 'createdAt',
      overrideAccess: true,
    })

    const klaidos: string[] = []
    let israsyta = 0
    for (const d of docs as unknown as { id: number }[]) {
      try {
        await israsyk(d.id)
        israsyta++
      } catch (klaida) {
        klaidos.push(String(klaida).slice(0, 200))
      }
    }

    return {
      pavyko: israsyta > 0,
      zinute: israsyta ? `Išrašyta ${israsyta} sąsk.` : 'Juodraščių nerasta.',
      klaidos,
    }
  })
}

export async function siuskVeiksmas(id: number): Promise<Rezultatas> {
  return veiksmas(async () => siuskSaskaita(id))
}

/** Visos mėnesio išrašytos, kurios dar neišsiųstos. */
export async function siuskVisusVeiksmas(laikotarpis: string): Promise<Rezultatas> {
  return veiksmas(async () => {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'saskaitos',
      where: {
        and: [
          { laikotarpisNuo: { equals: `${laikotarpis}-01` } },
          { busena: { equals: 'israsyta' } },
        ],
      },
      limit: 500,
      depth: 0,
      sort: 'numeris',
      overrideAccess: true,
    })

    const klaidos: string[] = []
    let issiusta = 0
    for (const d of docs as unknown as { id: number }[]) {
      const r = await siuskSaskaita(d.id)
      if (r.pavyko) issiusta++
      else klaidos.push(r.zinute)
    }

    return {
      pavyko: issiusta > 0,
      zinute: issiusta ? `Išsiųsta ${issiusta} sąsk.` : 'Neišsiųstų išrašytų sąskaitų nerasta.',
      klaidos,
    }
  })
}

export async function anuliuokVeiksmas(id: number): Promise<Rezultatas> {
  return veiksmas(async () => {
    await anuliuok(id)
    return { pavyko: true, zinute: 'Anuliuota. Pamokos vėl laukia eilėje.' }
  })
}

export async function ismeskVeiksmas(id: number): Promise<Rezultatas> {
  return veiksmas(async () => {
    await ismeskJuodrasti(id)
    return { pavyko: true, zinute: 'Juodraštis išmestas. Pamokos vėl laukia eilėje.' }
  })
}

export async function zymekApmoketaVeiksmas(id: number, data: string): Promise<Rezultatas> {
  return veiksmas(async () => {
    const payload = await getPayload({ config })
    await payload.update({
      collection: 'saskaitos',
      id,
      overrideAccess: true,
      data: { busena: 'apmoketa', apmoketa: data },
    })
    return { pavyko: true, zinute: 'Pažymėta kaip apmokėta.' }
  })
}

export async function isafIkelkVeiksmas(laikotarpis: string): Promise<Rezultatas> {
  return veiksmas(async () => isafIkelk(laikotarpis))
}

export async function isafTikrinkVeiksmas(laikotarpis: string): Promise<Rezultatas> {
  return veiksmas(async () => isafTikrink(laikotarpis))
}

export async function isafPateikVeiksmas(laikotarpis: string): Promise<Rezultatas> {
  return veiksmas(async () => isafPateik(laikotarpis))
}
