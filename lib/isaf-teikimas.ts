import { getPayload } from 'payload'
import config from '@payload-config'
import {
  isafCheckState,
  isafGetRegistryNumbers,
  isafGetRegistryStatus,
  isafNustatymai,
  isafSubmitRegistry,
  isafUpload,
} from '@/lib/isaf'
import { isafRinkmena } from '@/lib/isaf-xml'
import { menuo } from '@/lib/saskaitos'

/**
 * i.SAF teikimo eiga ir jos pėdsakas sąskaitose.
 *
 * KODĖL BŪSENA GULA ANT KIEKVIENOS SĄSKAITOS, o ne į vieną „teikimų“ įrašą:
 * po pusmečio klausimas būna ne „ar teikiau rugpjūtį“, o „ar ŠI sąskaita
 * nuėjo“. Atsakymas turi būti matomas atidarius pačią sąskaitą, o ne
 * lyginant datas dviejose vietose.
 *
 * KIEKVIENAS ŽINGSNIS ATSKIRAS MYGTUKAS. Įkėlimas ir pateikimas VMI'ui yra du
 * skirtingi veiksmai: įkeltą rinkmeną dar galima pakeisti, o pateiktas
 * registras jau yra deklaracija. Sulieti juos į vieną „Siųsti“ reikštų, kad
 * vienas neapdairus paspaudimas išsiunčia mokesčių inspekcijai tai, ko dar
 * niekas neperžiūrėjo.
 */

export type TeikimoRezultatas = {
  pavyko: boolean
  zinute: string
  klaidos: string[]
}

const NERA_SERTIFIKATO =
  'i.SAF sertifikatas nesukonfigūruotas. Susigeneruokite jį i.MAS portale ir nurodykite kelią ISAF_SERTIFIKATAS aplinkos kintamuoju.'

/** Visų laikotarpio sąskaitų (ne juodraščių) id — jomis žymima teikimo eiga. */
async function laikotarpioSaskaitos(raktas: string): Promise<number[]> {
  const l = menuo(raktas)
  if (!l) return []
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'saskaitos',
    where: {
      and: [
        { data: { greater_than_equal: l.nuo } },
        { data: { less_than_equal: l.iki } },
        { busena: { not_equals: 'juodrastis' } },
      ],
    },
    limit: 5000,
    depth: 0,
    overrideAccess: true,
  })
  return (docs as unknown as { id: number }[]).map((d) => d.id)
}

async function zymek(
  id: number[],
  duomenys: Record<string, unknown>,
): Promise<void> {
  const payload = await getPayload({ config })
  for (const vienas of id) {
    await payload.update({
      collection: 'saskaitos',
      id: vienas,
      overrideAccess: true,
      data: { ...duomenys, isafAtnaujinta: new Date().toISOString() },
    })
  }
}

/** 1 žingsnis — rinkmena keliauja į i.SAF ir gauna `trackingNumber`. */
export async function isafIkelk(raktas: string): Promise<TeikimoRezultatas> {
  const n = isafNustatymai()
  if (!n) return { pavyko: false, zinute: NERA_SERTIFIKATO, klaidos: [] }

  const rinkmena = await isafRinkmena(raktas)
  if (rinkmena.klaidos.length > 0) {
    return {
      pavyko: false,
      zinute: 'Rinkmena dar netvarkinga — pataisykite ir bandykite vėl.',
      klaidos: rinkmena.klaidos,
    }
  }
  if (rinkmena.saskaitos.length === 0) {
    return { pavyko: false, zinute: 'Šį mėnesį išrašytų sąskaitų nėra.', klaidos: [] }
  }

  const id = await laikotarpioSaskaitos(raktas)

  try {
    const atsakymas = await isafUpload(n, rinkmena.xml, `${raktas}-${Date.now()}`)
    if (!atsakymas.trackingNumber) {
      await zymek(id, { isafBusena: 'klaida', isafKlaida: atsakymas.klaidos.join('\n') })
      return {
        pavyko: false,
        zinute: 'i.SAF rinkmenos nepriėmė.',
        klaidos: atsakymas.klaidos.length ? atsakymas.klaidos : ['Atsakyme nėra trackingNumber.'],
      }
    }

    await zymek(id, {
      isafBusena: 'ikelta',
      isafTrackingNumber: atsakymas.trackingNumber,
      isafKlaida: null,
    })
    return {
      pavyko: true,
      zinute: `Įkelta (${rinkmena.saskaitos.length} sąsk.). Rinkmenos Nr. ${atsakymas.trackingNumber}. Paspauskite „Tikrinti“, kai i.SAF ją patikrins.`,
      klaidos: [],
    }
  } catch (klaida) {
    return { pavyko: false, zinute: 'Nepavyko susisiekti su i.SAF.', klaidos: [String(klaida)] }
  }
}

/** 2 žingsnis — ar i.SAF jau patikrino įkeltą rinkmeną. */
export async function isafTikrink(raktas: string): Promise<TeikimoRezultatas> {
  const n = isafNustatymai()
  if (!n) return { pavyko: false, zinute: NERA_SERTIFIKATO, klaidos: [] }

  const payload = await getPayload({ config })
  const id = await laikotarpioSaskaitos(raktas)
  if (id.length === 0) return { pavyko: false, zinute: 'Šio mėnesio sąskaitų nėra.', klaidos: [] }

  const pirma = (await payload.findByID({
    collection: 'saskaitos',
    id: id[0],
    depth: 0,
    overrideAccess: true,
  })) as unknown as { isafTrackingNumber?: string | null }

  if (!pirma.isafTrackingNumber) {
    return { pavyko: false, zinute: 'Rinkmena dar neįkelta.', klaidos: [] }
  }

  try {
    const atsakymas = await isafCheckState(n, pirma.isafTrackingNumber)
    if (atsakymas.klaidos.length > 0) {
      await zymek(id, { isafBusena: 'klaida', isafKlaida: atsakymas.klaidos.join('\n') })
      return { pavyko: false, zinute: 'i.SAF rado klaidų.', klaidos: atsakymas.klaidos }
    }
    if (atsakymas.registruNumeriai[0]) {
      await zymek(id, { isafRegistryNumber: atsakymas.registruNumeriai[0] })
    }
    return {
      pavyko: true,
      zinute: `Rinkmenos būsena: ${atsakymas.busena ?? 'nežinoma'}.`,
      klaidos: [],
    }
  } catch (klaida) {
    return { pavyko: false, zinute: 'Nepavyko susisiekti su i.SAF.', klaidos: [String(klaida)] }
  }
}

/**
 * 3 žingsnis — registro pateikimas.
 *
 * Registro numeris pirmiausia imamas iš to, ką grąžino `CheckState`; jo
 * neradus klausiama `GetRegistryNumbers` pagal laikotarpį. Antrasis kelias
 * reikalingas tada, kai rinkmena buvo įkelta anksčiau ir `trackingNumber`
 * jau nebeaktualus.
 */
export async function isafPateik(raktas: string): Promise<TeikimoRezultatas> {
  const n = isafNustatymai()
  if (!n) return { pavyko: false, zinute: NERA_SERTIFIKATO, klaidos: [] }

  const l = menuo(raktas)
  if (!l) return { pavyko: false, zinute: 'Netinkamas laikotarpis.', klaidos: [] }

  const payload = await getPayload({ config })
  const id = await laikotarpioSaskaitos(raktas)
  if (id.length === 0) return { pavyko: false, zinute: 'Šio mėnesio sąskaitų nėra.', klaidos: [] }

  const pirma = (await payload.findByID({
    collection: 'saskaitos',
    id: id[0],
    depth: 0,
    overrideAccess: true,
  })) as unknown as { isafRegistryNumber?: string | null }

  try {
    let registras = pirma.isafRegistryNumber ?? null
    if (!registras) {
      const numeriai = await isafGetRegistryNumbers(n, l.nuo, l.iki)
      if (numeriai.klaidos.length > 0) {
        return { pavyko: false, zinute: 'Nepavyko gauti registro numerio.', klaidos: numeriai.klaidos }
      }
      registras = numeriai.numeriai[0] ?? null
    }

    if (!registras) {
      return {
        pavyko: false,
        zinute: 'Registro numerio nėra — ar rinkmena tikrai įkelta ir patikrinta?',
        klaidos: [],
      }
    }

    const pateikimas = await isafSubmitRegistry(n, registras)
    if (pateikimas.klaidos.length > 0) {
      await zymek(id, { isafBusena: 'klaida', isafKlaida: pateikimas.klaidos.join('\n') })
      return { pavyko: false, zinute: 'Pateikti nepavyko.', klaidos: pateikimas.klaidos }
    }

    const busena = await isafGetRegistryStatus(n, registras)
    await zymek(id, {
      isafBusena: 'pateikta',
      isafRegistryNumber: registras,
      isafKlaida: null,
    })

    return {
      pavyko: true,
      zinute: `Registras Nr. ${registras} pateiktas. Būsena: ${busena.busena ?? 'nežinoma'}.`,
      klaidos: busena.klaidos,
    }
  } catch (klaida) {
    return { pavyko: false, zinute: 'Nepavyko susisiekti su i.SAF.', klaidos: [String(klaida)] }
  }
}
