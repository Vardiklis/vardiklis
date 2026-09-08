import { readFileSync } from 'node:fs'
import { request as httpsUzklausa } from 'node:https'

/**
 * i.SAF žiniatinklio paslaugos (`iSAFUploaderService`).
 *
 * KAIP VYKSTA TEIKIMAS. Keturi žingsniai, ir kiekvienas grąžina numerį, kurio
 * reikia kitam:
 *
 *   1. `Upload`             — įkeliama rinkmena, atgal `trackingNumber`;
 *   2. `CheckState`         — laukiama, kol i.SAF ją patikrins (asinchroniška);
 *   3. `GetRegistryNumbers` — sužinomas laikotarpio registro numeris;
 *   4. `SubmitRegistry`     — registras pateikiamas, `GetRegistryStatus` rodo baigtį.
 *
 * PRISIJUNGIMAS — KLIENTO SERTIFIKATAS (mTLS). Jis generuojamas i.MAS portale
 * iš CSR ir kodu nesusikuria; be jo nė vienas kvietimas net neužmezga TLS.
 * Raktas laikomas FAILE už repozitorijos ribų ir nurodomas aplinkos
 * kintamuoju — į duomenų bazę jis nededamas, nes ta keliauja į kopijas.
 *
 * KODĖL BE SOAP BIBLIOTEKOS. Kvietimų yra penki, o jų kūnai — po kelias
 * eilutes. Biblioteka čia atneštų WSDL analizatorių ir dešimtis priklausomybių
 * tam, kad sudėtų tą patį tekstą; atsakymuose mums rūpi po vieną ar du laukus.
 *
 * SRITIES VARDAS (namespace) NUSKAITOMAS IŠ WSDL. Specifikacijoje jis
 * neužrašytas, o atspėtas neteisingai duotų „Cannot find dispatch method“ be
 * jokios užuominos, kas negerai. Todėl pirmą kartą parsiunčiamas `?wsdl` ir iš
 * jo paimamas `targetNamespace`; reikšmė laikoma modulyje iki perkrovimo, o
 * prireikus perrašoma `ISAF_SRITIS` kintamuoju.
 */

const ADRESAI = {
  prod: 'https://imas-ws.vmi.lt/isaf-uploader/services/uploader',
  demo: 'https://imas-demo.vmi.lt:8443/isaf-uploader/services/uploader',
} as const

export type IsafNustatymai = {
  aplinka: 'demo' | 'prod'
  adresas: string
  sertifikatas: Buffer
  raktas: Buffer
  slaptazodis: string | undefined
  sritis: string | null
}

/**
 * Nustatymai iš aplinkos. `null`, jei sertifikato nėra — tada skydelis rodo
 * paaiškinimą, o ne bando jungtis ir laukia, kol baigsis laikas.
 */
export function isafNustatymai(): IsafNustatymai | null {
  const sertifikatoKelias = process.env.ISAF_SERTIFIKATAS?.trim()
  if (!sertifikatoKelias) return null

  const aplinka = process.env.ISAF_APLINKA?.trim() === 'prod' ? 'prod' : 'demo'
  // Raktas gali gulėti ir tame pačiame PEM faile kaip sertifikatas.
  const raktoKelias = process.env.ISAF_RAKTAS?.trim() || sertifikatoKelias

  try {
    return {
      aplinka,
      adresas: process.env.ISAF_ADRESAS?.trim() || ADRESAI[aplinka],
      sertifikatas: readFileSync(sertifikatoKelias),
      raktas: readFileSync(raktoKelias),
      slaptazodis: process.env.ISAF_RAKTO_SLAPTAZODIS?.trim() || undefined,
      sritis: process.env.ISAF_SRITIS?.trim() || null,
    }
  } catch (klaida) {
    console.error('[isaf] sertifikato nuskaityti nepavyko:', klaida)
    return null
  }
}

type Atsakymas = { statusas: number; kunas: string }

/** Vienas HTTPS kvietimas su kliento sertifikatu. */
function kviesk(
  n: IsafNustatymai,
  adresas: string,
  budas: 'GET' | 'POST',
  kunas: string | null,
  antrastes: Record<string, string>,
): Promise<Atsakymas> {
  return new Promise((istesek, atmesk) => {
    const url = new URL(adresas)
    const uzklausa = httpsUzklausa(
      {
        method: budas,
        hostname: url.hostname,
        port: url.port || 443,
        path: `${url.pathname}${url.search}`,
        cert: n.sertifikatas,
        key: n.raktas,
        passphrase: n.slaptazodis,
        // TLS 1.0 serveryje išjungtas nuo 2017 m., tad senesnio nė nebandom.
        minVersion: 'TLSv1.2',
        headers: {
          ...antrastes,
          ...(kunas ? { 'Content-Length': Buffer.byteLength(kunas) } : {}),
        },
        timeout: 120_000,
      },
      (atsakymas) => {
        const gabalai: Buffer[] = []
        atsakymas.on('data', (g: Buffer) => gabalai.push(g))
        atsakymas.on('end', () =>
          istesek({
            statusas: atsakymas.statusCode ?? 0,
            kunas: Buffer.concat(gabalai).toString('utf8'),
          }),
        )
      },
    )

    uzklausa.on('timeout', () => {
      uzklausa.destroy(new Error('i.SAF neatsakė per 2 min.'))
    })
    uzklausa.on('error', atmesk)
    if (kunas) uzklausa.write(kunas)
    uzklausa.end()
  })
}

let isaugotaSritis: string | null = null

/** `targetNamespace` iš WSDL — kad kvietimų sritis nebūtų spėjama. */
async function gaukSriti(n: IsafNustatymai): Promise<string> {
  if (n.sritis) return n.sritis
  if (isaugotaSritis) return isaugotaSritis

  const atsakymas = await kviesk(n, `${n.adresas}?wsdl`, 'GET', null, {})
  const rastas = /targetNamespace\s*=\s*"([^"]+)"/.exec(atsakymas.kunas)
  if (!rastas) {
    throw new Error(
      'Nepavyko iš WSDL nustatyti paslaugos srities. Įrašykite ją ranka į ISAF_SRITIS.',
    )
  }
  isaugotaSritis = rastas[1]
  return isaugotaSritis
}

/** Elemento tekstas pagal vardą, nepaisant priešdėlio. */
function laukas(xml: string, vardas: string): string | null {
  const rastas = new RegExp(`<(?:[\\w.-]+:)?${vardas}[^>]*>([\\s\\S]*?)</(?:[\\w.-]+:)?${vardas}>`).exec(
    xml,
  )
  return rastas ? rastas[1].trim() : null
}

/** Visi tokio vardo elementai. */
function laukai(xml: string, vardas: string): string[] {
  const re = new RegExp(`<(?:[\\w.-]+:)?${vardas}[^>]*>([\\s\\S]*?)</(?:[\\w.-]+:)?${vardas}>`, 'g')
  const rezultatas: string[] = []
  let rastas: RegExpExecArray | null
  while ((rastas = re.exec(xml))) rezultatas.push(rastas[1].trim())
  return rezultatas
}

/**
 * Klaidos iš atsakymo.
 *
 * Du skirtingi dalykai vienoje vietoje: SOAP `Fault` (nesusikalbėjom su
 * serveriu) ir `errors` (susikalbėjom, bet i.SAF duomenų nepriėmė). Skydeliui
 * skirtumo nėra — abu reiškia „nepavyko ir štai kodėl“.
 */
function surinkKlaidas(xml: string): string[] {
  const klaidos: string[] = []

  const faultstring = laukas(xml, 'faultstring') ?? laukas(xml, 'Reason')
  if (faultstring) klaidos.push(faultstring)

  for (const klaida of laukai(xml, 'error')) {
    const kodas = laukas(klaida, 'code') ?? laukas(klaida, 'errorCode')
    const zinute = laukas(klaida, 'message') ?? laukas(klaida, 'description') ?? klaida
    klaidos.push(kodas ? `${kodas}: ${zinute}` : zinute)
  }

  return klaidos
}

async function soap(
  n: IsafNustatymai,
  veiksmas: string,
  kunoXml: string,
): Promise<{ xml: string; klaidos: string[] }> {
  const sritis = await gaukSriti(n)
  const vokas = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"',
    `  xmlns:urn="${sritis}">`,
    '  <soapenv:Header/>',
    '  <soapenv:Body>',
    kunoXml,
    '  </soapenv:Body>',
    '</soapenv:Envelope>',
  ].join('\n')

  const atsakymas = await kviesk(n, n.adresas, 'POST', vokas, {
    'Content-Type': 'text/xml; charset=utf-8',
    SOAPAction: `"${veiksmas}"`,
  })

  const klaidos = surinkKlaidas(atsakymas.kunas)
  if (atsakymas.statusas >= 400 && klaidos.length === 0) {
    klaidos.push(`i.SAF atsakė ${atsakymas.statusas}.`)
  }
  return { xml: atsakymas.kunas, klaidos }
}

export type UploadRezultatas = { trackingNumber: string | null; klaidos: string[] }

/**
 * Rinkmenos įkėlimas.
 *
 * `data` schemoje aprašytas kaip `base64Binary`, tad siunčiam base64 tiesiai
 * kūne. MTOM (priedas atskira dalimi) yra tik optimizacija dideliems failams,
 * o mėnesio registras sveria kelias dešimtis kilobaitų.
 */
export async function isafUpload(
  n: IsafNustatymai,
  xml: string,
  requestNumber?: string,
): Promise<UploadRezultatas> {
  const duomenys = Buffer.from(xml, 'utf8').toString('base64')
  const atsakymas = await soap(
    n,
    'Upload',
    [
      '    <urn:UploadRequest>',
      `      <urn:data>${duomenys}</urn:data>`,
      requestNumber ? `      <urn:requestNumber>${requestNumber}</urn:requestNumber>` : '',
      '    </urn:UploadRequest>',
    ]
      .filter(Boolean)
      .join('\n'),
  )

  return {
    trackingNumber: laukas(atsakymas.xml, 'trackingNumber'),
    klaidos: atsakymas.klaidos,
  }
}

export type BusenosRezultatas = {
  busena: string | null
  registruNumeriai: string[]
  klaidos: string[]
}

/** Ar i.SAF jau baigė tikrinti įkeltą rinkmeną. */
export async function isafCheckState(
  n: IsafNustatymai,
  trackingNumber: string,
): Promise<BusenosRezultatas> {
  const atsakymas = await soap(
    n,
    'CheckState',
    [
      '    <urn:CheckStateRequest>',
      `      <urn:trackingNumber>${trackingNumber}</urn:trackingNumber>`,
      '    </urn:CheckStateRequest>',
    ].join('\n'),
  )

  return {
    busena: laukas(atsakymas.xml, 'state') ?? laukas(atsakymas.xml, 'status'),
    registruNumeriai: laukai(atsakymas.xml, 'registryNumber'),
    klaidos: atsakymas.klaidos,
  }
}

/** Laikotarpio registro numeriai — jų reikia pateikimui. */
export async function isafGetRegistryNumbers(
  n: IsafNustatymai,
  nuo: string,
  iki: string,
): Promise<{ numeriai: string[]; klaidos: string[] }> {
  const atsakymas = await soap(
    n,
    'GetRegistryNumbers',
    [
      '    <urn:GetRegistryNumbersRequest>',
      `      <urn:SelectionStartDate>${nuo}</urn:SelectionStartDate>`,
      `      <urn:SelectionEndDate>${iki}</urn:SelectionEndDate>`,
      '    </urn:GetRegistryNumbersRequest>',
    ].join('\n'),
  )

  return { numeriai: laukai(atsakymas.xml, 'registryNumber'), klaidos: atsakymas.klaidos }
}

/** Registro pateikimas VMI — tai ir yra pati deklaracija. */
export async function isafSubmitRegistry(
  n: IsafNustatymai,
  registryNumber: string,
): Promise<{ klaidos: string[] }> {
  const atsakymas = await soap(
    n,
    'SubmitRegistry',
    [
      '    <urn:SubmitRegistryRequest>',
      `      <urn:registryNumber>${registryNumber}</urn:registryNumber>`,
      '    </urn:SubmitRegistryRequest>',
    ].join('\n'),
  )
  return { klaidos: atsakymas.klaidos }
}

/** Registro būsena po pateikimo. */
export async function isafGetRegistryStatus(
  n: IsafNustatymai,
  registryNumber: string,
): Promise<{ busena: string | null; klaidos: string[] }> {
  const atsakymas = await soap(
    n,
    'GetRegistryStatus',
    [
      '    <urn:GetRegistryStatusRequest>',
      `      <urn:registryNumber>${registryNumber}</urn:registryNumber>`,
      '    </urn:GetRegistryStatusRequest>',
    ].join('\n'),
  )
  return {
    busena: laukas(atsakymas.xml, 'status') ?? laukas(atsakymas.xml, 'state'),
    klaidos: atsakymas.klaidos,
  }
}
