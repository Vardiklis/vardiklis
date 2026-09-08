import { getPayload } from 'payload'
import config from '@payload-config'
import { gautiAtsiskaitymus } from '@/lib/kainos'
import { kontaktai } from '@/lib/kontaktai'
import { centai } from '@/lib/pinigai'
import { suskaiciuok, type Sumos } from '@/lib/saskaitos-sumos'

/**
 * Sąskaitos vaizdas — vienas duomenų rinkinys PDF'ui, peržiūrai naršyklėje ir
 * laiškui.
 *
 * KODĖL ATSKIRAS SLUOKSNIS. Tas pats dokumentas keliauja į tris vietas, ir
 * kiekviena jų turėtų savo nuomonę apie tai, ką rodyti, kokiu pavadinimu ir
 * kaip suapvalinti. Surinkus vaizdą vieną kartą, PDF ir HTML lieka tik
 * piešėjai — o tėvams atsiųstas PDF negali skirtis nuo to, ką matau ekrane.
 *
 * PARDAVĖJO REKVIZITAI IMAMI IŠ NUSTATYMŲ IR NEĮRAŠOMI Į SĄSKAITĄ. Jie kinta
 * retai ir vienodai visoms sąskaitoms; pirkėjo duomenys, priešingai, į įrašą
 * nurašomi (žr. `cms/Saskaitos.ts`), nes mokinio kortelė gali keistis.
 */

export type SaskaitosVaizdas = {
  id: number
  /** „PVM sąskaita faktūra“ arba „Sąskaita“ — pagal tai, ar yra PVM kodas. */
  pavadinimas: string
  numeris: string
  busena: string
  data: string | null
  terminas: string | null
  laikotarpis: string | null
  pardavejas: {
    vardas: string
    kodas: string | null
    pvmKodas: string | null
    adresas: string | null
    veiklosPazyma: string | null
    iban: string | null
    bankas: string | null
    pastas: string
    telefonas: string
  }
  pirkejas: {
    vardas: string
    pastas: string | null
    kodas: string | null
    pvmKodas: string | null
    adresas: string | null
  }
  eilutes: {
    aprasymas: string
    detales: string | null
    kiekis: number
    matoVnt: string
    /** Centais. */
    kaina: number
    suma: number
  }[]
  sumos: Sumos
  kainosSuPvm: boolean
  pastaba: string | null
}

type SaskaitosDok = {
  id: number
  numeris?: string | null
  busena?: string | null
  data?: string | null
  terminas?: string | null
  laikotarpisNuo?: string | null
  laikotarpisIki?: string | null
  pirkejoVardas?: string | null
  pirkejoPastas?: string | null
  pirkejoKodas?: string | null
  pirkejoPvmKodas?: string | null
  pirkejoAdresas?: string | null
  kainosSuPvm?: boolean | null
  pastaba?: string | null
  eilutes?:
    | {
        aprasymas?: string | null
        detales?: string | null
        kiekis?: number | null
        matoVnt?: string | null
        kaina?: number | null
        pvmKodas?: string | null
        pvmProc?: number | null
      }[]
    | null
}

export async function paruoskVaizda(id: number): Promise<SaskaitosVaizdas> {
  const payload = await getPayload({ config })
  const n = await gautiAtsiskaitymus()

  const dok = (await payload.findByID({
    collection: 'saskaitos',
    id,
    depth: 0,
    overrideAccess: true,
  })) as unknown as SaskaitosDok

  const eilutes = dok.eilutes ?? []
  const sumos = suskaiciuok(eilutes, dok.kainosSuPvm !== false)

  return {
    id: dok.id,
    /**
     * PVM mokėtojas išrašo PVM sąskaitą faktūrą — ir tada, kai tarifas nulinis
     * ar paslauga neapmokestinama. Neturint PVM kodo dokumentas vadinasi
     * tiesiog „Sąskaita“: „PVM sąskaita faktūra“ be PVM kodo būtų klaidinga.
     */
    pavadinimas: n.pardavejoPvmKodas ? 'PVM SĄSKAITA FAKTŪRA' : 'SĄSKAITA',
    numeris: dok.numeris ?? 'JUODRAŠTIS',
    busena: dok.busena ?? 'juodrastis',
    data: dok.data ?? null,
    terminas: dok.terminas ?? null,
    laikotarpis:
      dok.laikotarpisNuo && dok.laikotarpisIki
        ? `${dok.laikotarpisNuo} – ${dok.laikotarpisIki}`
        : null,
    pardavejas: {
      // Nenurodžius vardo nustatymuose, imamas tas, kuris rodomas svetainėje —
      // tuščia sąskaitos antraštė būtų blogiau nei apytikslė.
      vardas: n.pardavejoVardas ?? kontaktai.vardas,
      kodas: n.pardavejoKodas,
      pvmKodas: n.pardavejoPvmKodas,
      adresas: n.pardavejoAdresas,
      veiklosPazyma: n.veiklosPazyma,
      iban: n.iban,
      bankas: n.bankas,
      pastas: kontaktai.elPastas,
      telefonas: kontaktai.telefonas,
    },
    pirkejas: {
      vardas: dok.pirkejoVardas?.trim() || dok.pirkejoPastas || '—',
      pastas: dok.pirkejoPastas ?? null,
      kodas: dok.pirkejoKodas ?? null,
      pvmKodas: dok.pirkejoPvmKodas ?? null,
      adresas: dok.pirkejoAdresas ?? null,
    },
    eilutes: eilutes.map((e, i) => ({
      aprasymas: e.aprasymas ?? '',
      detales: e.detales?.trim() || null,
      kiekis: Number(e.kiekis ?? 0),
      matoVnt: e.matoVnt?.trim() || 'vnt.',
      kaina: centai(Number(e.kaina ?? 0)),
      suma: sumos.eiluciuSumos[i] ?? 0,
    })),
    sumos,
    kainosSuPvm: dok.kainosSuPvm !== false,
    pastaba: dok.pastaba?.trim() || null,
  }
}
