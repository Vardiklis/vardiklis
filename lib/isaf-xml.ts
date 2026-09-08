import { getPayload } from 'payload'
import config from '@payload-config'
import { gautiAtsiskaitymus } from '@/lib/kainos'
import { menuo, type Laikotarpis } from '@/lib/saskaitos'
import { suskaiciuok } from '@/lib/saskaitos-sumos'

/**
 * i.SAF rinkmena — išrašomų PVM sąskaitų faktūrų registras.
 *
 * KAS TAI. PVM mokėtojas kas mėnesį iki kito mėnesio 20 d. privalo pateikti
 * visų per laikotarpį išrašytų PVM sąskaitų faktūrų registrą, įskaitant
 * išrašytas gyventojams. Čia gaminama `P` tipo rinkmena — tik išrašomos.
 * Gaunamos (`S`) teikiamos atskirai; jų ši sistema nemato.
 *
 * LAIKOTARPIS SKAIČIUOJAMAS PAGAL IŠRAŠYMO DATĄ, NE PAGAL PAMOKŲ MĖNESĮ.
 * Rugsėjo 1 d. išrašyta sąskaita už rugpjūčio pamokas patenka į RUGSĖJO
 * registrą — taip reikalauja pati schema (`InvoiceDate` privalo patekti tarp
 * `SelectionStartDate` ir `SelectionEndDate`). Tai lengva supainioti, todėl
 * skydelyje šis sąrašas ir sąskaitų sąrašas rodomi atskirai.
 *
 * `MasterFiles` PRALEIDŽIAMA SĄMONINGAI. Schemoje ji neprivaloma
 * (`minOccurs="0"`), o pirkėjo duomenis leidžiama surašyti tiesiai į
 * `CustomerInfo`. Taip išvengiama nuorodų tarp dviejų rinkmenos dalių, kurių
 * nesutapimas yra dažniausia atmetimo priežastis.
 *
 * ELEMENTŲ TVARKA GRIEŽTA. Schema aprašyta `xs:sequence`, tad sukeitus du
 * elementus vietomis rinkmena atmetama net ir su teisingais duomenimis:
 *   Invoice: InvoiceNo → CustomerInfo → InvoiceDate → InvoiceType →
 *            SpecialTaxation → References → VATPointDate → DocumentTotals
 *   CustomerInfo: CustomerID? → VATRegistrationNumber → RegistrationNumber? →
 *                 Country → Name
 */

const SRITIS = 'http://www.vmi.lt/cms/imas/isaf'
const VERSIJA = 'iSAF1.2'

/** Kai pirkėjas neturi nei PVM, nei mokesčių mokėtojo kodo. */
const NEZINOMA = 'ND'

export type IsafSaskaita = {
  id: number
  numeris: string
  data: string
  busena: string
  pirkejoVardas: string
  pirkejoKodas: string | null
  pirkejoPvmKodas: string | null
  /** Paslaugų suteikimo data — paskutinė apmokestinto mėnesio diena. */
  vatPointDate: string | null
  totals: { taxableValue: number; taxCode: string; taxPercentage: number | null; amount: number }[]
}

export type IsafRinkmena = {
  laikotarpis: Laikotarpis
  registracijosNumeris: string
  saskaitos: IsafSaskaita[]
  xml: string
  /** Kliūtys, dėl kurių rinkmenos teikti negalima. */
  klaidos: string[]
}

function ekranuok(tekstas: string): string {
  return tekstas
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Centai → `82.64`. Schema laukia dešimtainio su dviem ženklais ir tašku. */
function pinigai(centai: number): string {
  return (Math.round(centai) / 100).toFixed(2)
}

function e(vardas: string, reiksme: string | number | null): string {
  if (reiksme === null) return `<${vardas}/>`
  return `<${vardas}>${ekranuok(String(reiksme))}</${vardas}>`
}

type SaskaitosDok = {
  id: number
  numeris?: string | null
  busena?: string | null
  data?: string | null
  laikotarpisIki?: string | null
  pirkejoVardas?: string | null
  pirkejoPastas?: string | null
  pirkejoKodas?: string | null
  pirkejoPvmKodas?: string | null
  kainosSuPvm?: boolean | null
  eilutes?:
    | { kiekis?: number | null; kaina?: number | null; pvmKodas?: string | null; pvmProc?: number | null }[]
    | null
}

/**
 * Rinkmena už mėnesį.
 *
 * Grąžina ir XML, ir kliūčių sąrašą: rinkmeną naudinga pamatyti net tada, kai
 * jos dar negalima siųsti — taip matyti, ko trūksta, o ne vien „negalima“.
 */
export async function isafRinkmena(raktas: string): Promise<IsafRinkmena> {
  const l = menuo(raktas)
  if (!l) throw new Error('Netinkamas laikotarpis.')

  const payload = await getPayload({ config })
  const n = await gautiAtsiskaitymus()

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
    sort: ['data', 'numeris'],
    overrideAccess: true,
  })

  const klaidos: string[] = []

  const registracijosNumeris = (n.pardavejoKodas ?? '').replace(/\D/g, '')
  if (!registracijosNumeris) {
    klaidos.push('Nustatymuose neįrašytas mokesčių mokėtojo kodas (rinkmenos RegistrationNumber).')
  } else if (registracijosNumeris.length > 11) {
    klaidos.push('Mokesčių mokėtojo kodas ilgesnis nei 11 skaitmenų — schema tokio nepriima.')
  }
  if (!n.pardavejoPvmKodas) {
    klaidos.push('Nustatymuose neįrašytas PVM mokėtojo kodas.')
  }

  const saskaitos: IsafSaskaita[] = []
  for (const d of docs as unknown as SaskaitosDok[]) {
    if (!d.numeris || !d.data) {
      klaidos.push(`Sąskaita be numerio arba datos (id ${d.id}) — išrašykite arba anuliuokite.`)
      continue
    }

    const sumos = suskaiciuok(d.eilutes ?? [], d.kainosSuPvm !== false)
    const vardas = d.pirkejoVardas?.trim() || d.pirkejoPastas?.trim() || ''
    if (!vardas) {
      klaidos.push(`${d.numeris}: nenurodytas pirkėjo vardas — registre jis privalomas.`)
    }

    saskaitos.push({
      id: d.id,
      numeris: d.numeris,
      data: d.data,
      busena: d.busena ?? 'israsyta',
      pirkejoVardas: vardas,
      pirkejoKodas: d.pirkejoKodas?.trim() || null,
      pirkejoPvmKodas: d.pirkejoPvmKodas?.trim() || null,
      // Paslaugos suteiktos apmokestintą mėnesį, o sąskaita išrašoma kitą —
      // tad tiekimo data nesutampa su išrašymo ir ją privalu nurodyti.
      vatPointDate: d.laikotarpisIki && d.laikotarpisIki !== d.data ? d.laikotarpisIki : d.data,
      totals: sumos.grupes.map((g) => ({
        taxableValue: g.bePvm,
        taxCode: g.pvmKodas,
        // Nulinis tarifas rašomas kaip „0“, o kai tarifo apskritai nėra
        // (neapmokestinama pagal klasifikatorių) — elementas paliekamas tuščias.
        taxPercentage: g.pvmProc > 0 ? g.pvmProc : g.pvmKodas === 'PVM5' ? null : 0,
        amount: g.pvm,
      })),
    })
  }

  return {
    laikotarpis: l,
    registracijosNumeris,
    saskaitos,
    klaidos,
    xml: sudarykXml(l, registracijosNumeris, saskaitos, n.programosPavadinimas, n.programosVersija),
  }
}

function sudarykXml(
  l: Laikotarpis,
  registracijosNumeris: string,
  saskaitos: IsafSaskaita[],
  programa: string,
  versija: string,
): string {
  const dabar = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')

  const antraste = [
    '  <Header>',
    '    <FileDescription>',
    `      ${e('FileVersion', VERSIJA)}`,
    `      ${e('FileDateCreated', dabar)}`,
    // `P` — tik išrašomos. `F` reikštų, kad rinkmenoje yra ir gaunamos, o jų čia nėra.
    `      ${e('DataType', 'P')}`,
    `      ${e('SoftwareCompanyName', programa)}`,
    `      ${e('SoftwareName', programa)}`,
    `      ${e('SoftwareVersion', versija)}`,
    `      ${e('RegistrationNumber', registracijosNumeris)}`,
    // Nedalinam į dalis: mėnesio sąskaitų čia dešimtys, o riba yra 500 000.
    `      ${e('NumberOfParts', 1)}`,
    `      ${e('PartNumber', 1)}`,
    '      <SelectionCriteria>',
    `        ${e('SelectionStartDate', l.nuo)}`,
    `        ${e('SelectionEndDate', l.iki)}`,
    '      </SelectionCriteria>',
    '    </FileDescription>',
    '  </Header>',
  ]

  const eilutes: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<iSAFFile xmlns="${SRITIS}" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">`,
    ...antraste,
    '  <SourceDocuments>',
    '    <SalesInvoices>',
  ]

  for (const s of saskaitos) {
    eilutes.push(
      '      <Invoice>',
      `        ${e('InvoiceNo', s.numeris)}`,
      '        <CustomerInfo>',
      // Ne PVM mokėtojas (o tėvai jais nebūna) — „ND“, taip nurodo schema.
      `          ${e('VATRegistrationNumber', s.pirkejoPvmKodas ?? NEZINOMA)}`,
      `          ${e('RegistrationNumber', s.pirkejoKodas ?? NEZINOMA)}`,
      `          ${e('Country', 'LT')}`,
      `          ${e('Name', s.pirkejoVardas)}`,
      '        </CustomerInfo>',
      `        ${e('InvoiceDate', s.data)}`,
      // Anuliuota sąskaita registre lieka, tik su kita žyma.
      `        ${e('InvoiceType', s.busena === 'anuliuota' ? 'AN' : 'SF')}`,
      // Pinigų apskaitos sistema netaikoma; nuorodų į tikslinamas sąskaitas nėra.
      '        <SpecialTaxation/>',
      '        <References/>',
      `        ${e('VATPointDate', s.vatPointDate)}`,
      '        <DocumentTotals>',
    )

    for (const t of s.totals) {
      eilutes.push(
        '          <DocumentTotal>',
        `            ${e('TaxableValue', pinigai(t.taxableValue))}`,
        `            ${e('TaxCode', t.taxCode)}`,
        `            ${e('TaxPercentage', t.taxPercentage === null ? null : t.taxPercentage)}`,
        `            ${e('Amount', pinigai(t.amount))}`,
        '          </DocumentTotal>',
      )
    }

    eilutes.push('        </DocumentTotals>', '      </Invoice>')
  }

  eilutes.push('    </SalesInvoices>', '  </SourceDocuments>', '</iSAFFile>')
  return eilutes.join('\n')
}
