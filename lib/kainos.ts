import { kainos as kainosKode, nuolaidaPirmajai } from '@/lib/kontaktai'

/**
 * Kainos ir pardavėjo rekvizitai iš globalo „Sąskaitų nustatymai“.
 *
 * VIENA VIETA, SPRENDŽIANTI, KIEK KAINUOJA PAMOKA. Ja remiasi ir priminimų
 * siuntėjas (užfiksuodamas kainą žurnale), ir sąskaitų sudarytojas. Jei
 * skaičiavimas būtų dviejose vietose, anksčiau ar vėliau žurnale liktų viena
 * suma, o sąskaitoje atsirastų kita — ir kuri teisinga, nebūtų aišku.
 *
 * ATSARGA — `lib/kontaktai.ts`. Globalas gali dar būti nesukurtas (naujoje
 * bazėje) arba backend gali neatsakyti; tada kainos imamos tos, kurios rodomos
 * svetainėje. Tai geriau nei nulis, kuris tyliai išrašytų sąskaitą už 0 €.
 */

export type AtsiskaitymuNustatymai = {
  pardavejoVardas: string | null
  pardavejoKodas: string | null
  pardavejoPvmKodas: string | null
  pardavejoAdresas: string | null
  veiklosPazyma: string | null
  iban: string | null
  bankas: string | null

  serija: string
  kitasNumeris: number
  terminoDienos: number

  individualiKaina: number
  grupineKaina: number
  pirmosNuolaida: number

  pvmKodas: string
  pvmProc: number
  kainosSuPvm: boolean

  laiskoTema: string
  laiskoTekstas: string
  saskaituParasas: string | null

  isafIjungta: boolean
  programosPavadinimas: string
  programosVersija: string
}

/** Kaina iš svetainės kainoraščio — kai globalo dar nėra. */
function kainaIsKodo(id: 'individuali' | 'grupine'): number {
  return kainosKode.find((k) => k.id === id)?.eurai ?? 0
}

const NUMATYTIEJI: AtsiskaitymuNustatymai = {
  pardavejoVardas: null,
  pardavejoKodas: null,
  pardavejoPvmKodas: null,
  pardavejoAdresas: null,
  veiklosPazyma: null,
  iban: null,
  bankas: null,

  serija: 'MOD',
  kitasNumeris: 1,
  terminoDienos: 14,

  individualiKaina: kainaIsKodo('individuali'),
  grupineKaina: kainaIsKodo('grupine'),
  pirmosNuolaida: nuolaidaPirmajai,

  pvmKodas: 'PVM1',
  pvmProc: 21,
  kainosSuPvm: true,

  laiskoTema: 'Sąskaita už matematikos pamokas',
  laiskoTekstas:
    'Siunčiu sąskaitą už praėjusio mėnesio pamokas. Sąskaita prisegta PDF formatu.',
  saskaituParasas: null,

  isafIjungta: false,
  programosPavadinimas: 'Vardiklis',
  programosVersija: '1.0',
}

/** Tuščias tekstas laikomas „nenurodyta“, ne „nurodyta tuščiai“. */
function tekstas(reiksme: unknown, atsarga: string | null): string | null {
  const isvalytas = typeof reiksme === 'string' ? reiksme.trim() : ''
  return isvalytas ? isvalytas : atsarga
}

/** Nulis yra teisėta kaina (nemokama pamoka), tad tikrinam būtent `null`. */
function skaicius(reiksme: unknown, atsarga: number): number {
  return typeof reiksme === 'number' && Number.isFinite(reiksme) ? reiksme : atsarga
}

type Dok = Record<string, unknown>

export async function gautiAtsiskaitymus(): Promise<AtsiskaitymuNustatymai> {
  try {
    const [{ getPayload }, { default: config }] = await Promise.all([
      import('payload'),
      import('@payload-config'),
    ])
    const payload = await getPayload({ config })
    const d = (await payload.findGlobal({
      slug: 'atsiskaitymai',
      overrideAccess: true,
    })) as unknown as Dok

    return {
      pardavejoVardas: tekstas(d.pardavejoVardas, null),
      pardavejoKodas: tekstas(d.pardavejoKodas, null),
      pardavejoPvmKodas: tekstas(d.pardavejoPvmKodas, null),
      pardavejoAdresas: tekstas(d.pardavejoAdresas, null),
      veiklosPazyma: tekstas(d.veiklosPazyma, null),
      iban: tekstas(d.iban, null),
      bankas: tekstas(d.bankas, null),

      serija: tekstas(d.serija, NUMATYTIEJI.serija) as string,
      kitasNumeris: Math.max(1, Math.trunc(skaicius(d.kitasNumeris, 1))),
      terminoDienos: skaicius(d.terminoDienos, NUMATYTIEJI.terminoDienos),

      individualiKaina: skaicius(d.individualiKaina, NUMATYTIEJI.individualiKaina),
      grupineKaina: skaicius(d.grupineKaina, NUMATYTIEJI.grupineKaina),
      pirmosNuolaida: skaicius(d.pirmosNuolaida, NUMATYTIEJI.pirmosNuolaida),

      pvmKodas: tekstas(d.pvmKodas, NUMATYTIEJI.pvmKodas) as string,
      pvmProc: skaicius(d.pvmProc, NUMATYTIEJI.pvmProc),
      kainosSuPvm: d.kainosSuPvm !== false,

      laiskoTema: tekstas(d.laiskoTema, NUMATYTIEJI.laiskoTema) as string,
      laiskoTekstas: tekstas(d.laiskoTekstas, NUMATYTIEJI.laiskoTekstas) as string,
      saskaituParasas: tekstas(d.saskaituParasas, null),

      isafIjungta: d.isafIjungta === true,
      programosPavadinimas: tekstas(
        d.programosPavadinimas,
        NUMATYTIEJI.programosPavadinimas,
      ) as string,
      programosVersija: tekstas(d.programosVersija, NUMATYTIEJI.programosVersija) as string,
    }
  } catch {
    return NUMATYTIEJI
  }
}

export type PamokosTipas = 'individuali' | 'grupine'

/**
 * Kiek kainuoja viena pamoka — tokia kaina, kokią mato tėvai.
 *
 * Nuolaida atimama, o ne kaina keičiama: taip „pirma pamoka“ lieka ta pati
 * paslauga, tik pigesnė, ir sąskaitoje ji atsiskiria į savo eilutę su kitokia
 * vieneto kaina — būtent taip, kaip ir reikia, kad suma būtų paaiškinama.
 *
 * Žemiau nulio nenusileidžia: nuolaida, didesnė už kainą, reikštų, kad
 * sąskaitoje atsirastų neigiama eilutė ir tėvai liktų skolingi sau.
 */
export function pamokosKaina(
  n: AtsiskaitymuNustatymai,
  tipas: PamokosTipas,
  pirmaPamoka: boolean,
): number {
  const bazine = tipas === 'grupine' ? n.grupineKaina : n.individualiKaina
  if (!pirmaPamoka) return bazine
  return Math.max(0, bazine - n.pirmosNuolaida)
}
