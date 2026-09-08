/**
 * Sąskaitų grandinės patikra nuo galo iki galo.
 *
 * Paleidimas:  npm run patikra:saskaitos
 *
 * KĄ TIKRINA. Susikuria SAVO bandomuosius mokinius, grupę ir žurnalo įrašus,
 * praeina visą kelią — juodraštis → išrašymas → PDF → i.SAF rinkmena — ir
 * paskui viską išsivalo. Tikrinama tai, ką sunkiausia pastebėti akimi:
 *
 *   • vienas tėvas su dviem vaikais gauna VIENĄ sąskaitą;
 *   • grupinė pamoka kainuoja kitaip nei individuali;
 *   • pirmoji pamoka atsiskiria į savo eilutę su nuolaida;
 *   • PVM išskaičiuojamas taip, kad eilučių suma sutaptų su mokėtina iki cento;
 *   • ta pati pamoka į antrą sąskaitą nebepatenka;
 *   • i.SAF elementai eina schemos reikalaujama tvarka.
 *
 * KODĖL SU TIKRA BAZE, o ne su išgalvotais objektais: didžioji dalis to, kas
 * čia gali sulūžti, yra būtent užklausos ir ryšiai — jų netikri duomenys
 * neparodo. Bandomieji įrašai turi bendrą žymą ir trinami net tada, kai
 * patikra nulūžta.
 */

import { getPayload } from 'payload'
import config from '../payload.config'
import { data as dataVilniuje } from '../lib/laikas'
import { suformatuok } from '../lib/pinigai'
import { israsyk, menesioApzvalga, sugeneruokJuodrascius } from '../lib/saskaitos'
import { saskaitosPdf } from '../lib/saskaitos-pdf'
import { paruoskVaizda } from '../lib/saskaitos-vaizdas'
import { isafRinkmena } from '../lib/isaf-xml'

/** Žyma, pagal kurią bandomieji įrašai atpažįstami ir po to pašalinami. */
const ZYMA = 'PATIKRA-'
const MENUO = '2026-08'

let klaidu = 0

function tikrink(salyga: boolean, ka: string, detales = ''): void {
  if (salyga) {
    console.log(`  ✓ ${ka}`)
  } else {
    klaidu++
    console.error(`  ✖ ${ka}${detales ? `\n      ${detales}` : ''}`)
  }
}

const payload = await getPayload({ config })

/** Viskas, ką sukūrėm — kad išvalytume net nulūžus. */
const sukurta = { mokiniai: [] as number[], grupes: [] as number[], saskaitos: [] as number[] }

try {
  console.log('\n1. Bandomieji duomenys')

  const nustatymai = await payload.updateGlobal({
    slug: 'atsiskaitymai',
    overrideAccess: true,
    data: {
      pardavejoVardas: 'Patikros Pardavėja',
      pardavejoKodas: '39001011234',
      pardavejoPvmKodas: 'LT100001234567',
      iban: 'LT121000011101001000',
      serija: 'PATIKRA',
      individualiKaina: 25,
      grupineKaina: 20,
      pirmosNuolaida: 5,
      pvmKodas: 'PVM1',
      pvmProc: 21,
      kainosSuPvm: true,
    },
  })
  console.log(`  → kainos: ind. ${nustatymai.individualiKaina} €, gr. ${nustatymai.grupineKaina} €`)

  const kurkMokini = async (vardas: string, tevoPastas: string, tevoVardas: string) => {
    const m = await payload.create({
      collection: 'mokiniai',
      overrideAccess: true,
      data: {
        vardas: `${ZYMA}${vardas}`,
        tevoVardas,
        tevoPastas,
        meetNuoroda: 'https://meet.google.com/abc-defg-hij',
        aktyvus: true,
        pirmaPamoka: false,
      },
    })
    sukurta.mokiniai.push(m.id)
    return m.id
  }

  // Viena šeima, du vaikai — tai ir yra svarbiausias atvejis.
  const jonas = await kurkMokini('Jonas', 'patikra.seima@example.com', 'Rasa Patikrienė')
  const ugne = await kurkMokini('Ugnė', 'patikra.seima@example.com', 'Rasa Patikrienė')
  // Kita šeima — kad grupavimas tikrai skirtų, o ne sudėtų visus į vieną.
  const emile = await kurkMokini('Emilė', 'patikra.kita@example.com', 'Tomas Patikra')

  const grupe = await payload.create({
    collection: 'grupes',
    overrideAccess: true,
    data: {
      pavadinimas: `${ZYMA}grupė`,
      meetNuoroda: 'https://meet.google.com/grp-abcd-efg',
      nariai: [jonas, emile],
      aktyvi: true,
      pamokos: [{ kartojimas: 'savaite', savaitesDiena: '2', laikas: '17:00', trukmeMin: 60 }],
    },
  })
  sukurta.grupes.push(grupe.id)

  /**
   * Žurnalo įrašai kuriami tiesiai, o ne per priminimų siuntėją: čia tikrinam
   * sąskaitas, o ne siuntimą, ir laiškų niekam siųsti nereikia.
   */
  const kurkPamoka = async (
    mokinys: number,
    data: string,
    tipas: 'individuali' | 'grupine',
    kaina: number,
    pirma = false,
  ) => {
    await payload.create({
      collection: 'zurnalas',
      overrideAccess: true,
      data: {
        santrauka: `${ZYMA}${data}`,
        data,
        laikas: '17:00',
        mokinys,
        busena: 'ivyko',
        tipas,
        kaina,
        pirmaPamoka: pirma,
        grupe: tipas === 'grupine' ? grupe.id : null,
      },
    })
  }

  // Jonas: 3 individualios po 25 € + 1 pirmoji su nuolaida (20 €)
  await kurkPamoka(jonas, '2026-08-04', 'individuali', 25)
  await kurkPamoka(jonas, '2026-08-11', 'individuali', 25)
  await kurkPamoka(jonas, '2026-08-18', 'individuali', 25)
  await kurkPamoka(jonas, '2026-08-25', 'individuali', 20, true)
  // Ugnė: 2 grupinės po 20 €
  await kurkPamoka(ugne, '2026-08-05', 'grupine', 20)
  await kurkPamoka(ugne, '2026-08-12', 'grupine', 20)
  // Emilė (kita šeima): 2 grupinės po 20 €
  await kurkPamoka(emile, '2026-08-05', 'grupine', 20)
  await kurkPamoka(emile, '2026-08-12', 'grupine', 20)

  console.log('  → 8 įvykusios pamokos, 2 šeimos, 3 vaikai')

  console.log('\n2. Juodraščių generavimas')
  const a = await sugeneruokJuodrascius(MENUO)
  console.log(`  → ${a.zinute}`)
  tikrink(a.sukurta === 2, 'sukurtos dvi sąskaitos (po vieną šeimai)', `gauta ${a.sukurta}`)
  tikrink(a.pamoku === 8, 'apmokestintos visos 8 pamokos', `gauta ${a.pamoku}`)

  const apzvalga = await menesioApzvalga(MENUO)
  for (const s of apzvalga.saskaitos) sukurta.saskaitos.push(s.id)

  tikrink(apzvalga.laukiaPamoku === 0, 'neapmokestintų pamokų nebeliko')

  const seima = apzvalga.saskaitos.find((s) => s.pirkejoPastas === 'patikra.seima@example.com')
  tikrink(Boolean(seima), 'šeimos su dviem vaikais sąskaita rasta')
  tikrink(
    (seima?.vaikai ?? '').includes('Jonas') && (seima?.vaikai ?? '').includes('Ugnė'),
    'vienoje sąskaitoje abu vaikai',
    seima?.vaikai,
  )

  // 3 × 25 + 1 × 20 + 2 × 20 = 135 €
  tikrink(
    seima?.sumaIsViso === 13500,
    'šeimos suma 135,00 €',
    seima ? suformatuok(seima.sumaIsViso) : '—',
  )

  console.log('\n3. Eilutės ir PVM')
  const vaizdas = await paruoskVaizda(seima!.id)
  for (const e of vaizdas.eilutes) {
    console.log(`  → ${e.kiekis} × ${suformatuok(e.kaina)} — ${e.aprasymas}`)
  }
  tikrink(vaizdas.eilutes.length === 3, 'trys eilutės (ind. / pirmoji / grupinė)')
  tikrink(
    vaizdas.eilutes.some((e) => e.kaina === 2000 && e.aprasymas.startsWith('Pirmoji')),
    'pirmoji pamoka atskira eilute po 20,00 €',
  )
  tikrink(
    vaizdas.eilutes.some((e) => e.kaina === 2000 && e.aprasymas.includes('grupinė')),
    'grupinė pamoka po 20,00 €',
  )
  tikrink(
    vaizdas.eilutes.some((e) => e.kaina === 2500 && e.aprasymas.includes('individuali')),
    'individuali pamoka po 25,00 €',
  )

  const eiluciuSuma = vaizdas.eilutes.reduce((s, e) => s + e.suma, 0)
  tikrink(
    eiluciuSuma === vaizdas.sumos.isViso,
    'eilučių suma sutampa su mokėtina iki cento',
    `${suformatuok(eiluciuSuma)} vs ${suformatuok(vaizdas.sumos.isViso)}`,
  )
  tikrink(
    vaizdas.sumos.bePvm + vaizdas.sumos.pvm === vaizdas.sumos.isViso,
    'be PVM + PVM = mokėtina',
    `${suformatuok(vaizdas.sumos.bePvm)} + ${suformatuok(vaizdas.sumos.pvm)}`,
  )
  // 13500 / 1,21 = 11157,02…
  tikrink(
    vaizdas.sumos.bePvm === 11157 && vaizdas.sumos.pvm === 2343,
    'PVM išskaičiuotas iš kainos su PVM (111,57 + 23,43)',
    `${suformatuok(vaizdas.sumos.bePvm)} + ${suformatuok(vaizdas.sumos.pvm)}`,
  )

  console.log('\n4. Pakartotinis generavimas')
  const b = await sugeneruokJuodrascius(MENUO)
  tikrink(b.pamoku === 0, 'ta pati pamoka antrą kartą neapmokestinama', b.zinute)

  console.log('\n5. Išrašymas')
  const { numeris } = await israsyk(seima!.id)
  console.log(`  → ${numeris}`)
  tikrink(/^PATIKRA-\d{4}$/.test(numeris), 'numeris sudarytas iš serijos ir eilės numerio')
  const antras = await israsyk(seima!.id)
  tikrink(antras.numeris === numeris, 'pakartotinis išrašymas numerio nekeičia')

  console.log('\n6. PDF')
  const pdf = await saskaitosPdf(await paruoskVaizda(seima!.id))
  tikrink(pdf.subarray(0, 5).toString() === '%PDF-', 'failas prasideda %PDF-')
  tikrink(pdf.length > 8000, `PDF sveria ${Math.round(pdf.length / 1024)} KB`)

  console.log('\n7. i.SAF rinkmena')

  /**
   * REGISTRO LAIKOTARPIS EINA PAGAL IŠRAŠYMO DATĄ, ne pagal pamokų mėnesį.
   * Sąskaita už rugpjūčio pamokas, išrašyta rugsėjį, patenka į RUGSĖJO
   * registrą — taip reikalauja schema (`InvoiceDate` privalo patekti tarp
   * `SelectionStartDate` ir `SelectionEndDate`). Tai lengviausia supainioti
   * vieta visoje grandinėje, todėl tikrinamos abi pusės.
   */
  const rugpjutis = await isafRinkmena(MENUO)
  tikrink(
    rugpjutis.saskaitos.length === 0,
    'rugpjūčio registre sąskaitos nėra (ji išrašyta kitą mėnesį)',
    `rasta ${rugpjutis.saskaitos.length}`,
  )

  const israsymoMenuo = dataVilniuje(new Date()).slice(0, 7)
  const rinkmena = await isafRinkmena(israsymoMenuo)
  console.log(`  → registras už ${israsymoMenuo}`)
  if (rinkmena.klaidos.length) console.log(`  → kliūtys: ${rinkmena.klaidos.join('; ')}`)
  tikrink(rinkmena.klaidos.length === 0, 'kliūčių nėra')
  tikrink(
    rinkmena.saskaitos.length === 1,
    'išrašymo mėnesio registre viena sąskaita',
    `rasta ${rinkmena.saskaitos.length}`,
  )
  tikrink(
    rinkmena.xml.includes(`<VATPointDate>2026-08-31</VATPointDate>`),
    'paslaugų suteikimo data — paskutinė apmokestinto mėnesio diena',
  )
  tikrink(
    rinkmena.xml.includes('<FileVersion>iSAF1.2</FileVersion>') &&
      rinkmena.xml.includes('<DataType>P</DataType>'),
    'antraštė: iSAF1.2, P tipo rinkmena',
  )
  tikrink(
    rinkmena.xml.includes('<VATRegistrationNumber>ND</VATRegistrationNumber>') &&
      rinkmena.xml.includes('<RegistrationNumber>ND</RegistrationNumber>'),
    'fiziniam asmeniui rašoma „ND“',
  )
  tikrink(
    rinkmena.xml.includes('<TaxableValue>111.57</TaxableValue>') &&
      rinkmena.xml.includes('<Amount>23.43</Amount>'),
    'sumos rinkmenoje sutampa su sąskaita',
  )

  /**
   * Schema aprašyta `xs:sequence`, tad sukeitus du elementus vietomis rinkmena
   * atmetama net su teisingais duomenimis — o klaidos tekstas apie tai
   * nepasako beveik nieko. Todėl tvarka tikrinama čia.
   */
  const tvarka = [
    'InvoiceNo',
    'CustomerInfo',
    'VATRegistrationNumber',
    'RegistrationNumber',
    'Country',
    'Name',
    '/CustomerInfo',
    'InvoiceDate',
    'InvoiceType',
    'SpecialTaxation',
    'References',
    'VATPointDate',
    'DocumentTotals',
    'DocumentTotal',
    'TaxableValue',
    'TaxCode',
    'TaxPercentage',
    'Amount',
  ]
  let vieta = rinkmena.xml.indexOf('<Invoice>')
  let tvarkinga = vieta >= 0
  let sugedo = ''
  for (const vardas of tvarka) {
    const kitas = rinkmena.xml.indexOf(`<${vardas}`, vieta)
    if (kitas < 0) {
      tvarkinga = false
      sugedo = `nerastas ${vardas}`
      break
    }
    vieta = kitas
  }
  tikrink(tvarkinga, 'elementai eina schemos reikalaujama tvarka', sugedo)
} finally {
  console.log('\n8. Valymas')
  for (const [kolekcija, id] of [
    ['saskaitos', sukurta.saskaitos],
    ['grupes', sukurta.grupes],
    ['mokiniai', sukurta.mokiniai],
  ] as const) {
    for (const vienas of id) {
      try {
        await payload.delete({ collection: kolekcija, id: vienas, overrideAccess: true })
      } catch {
        // Ištrintas anksčiau arba niekada nesukurtas — tai ne bėda.
      }
    }
  }
  // Žurnalo įrašai kabinasi prie mokinių tik ryšiu, tad trinami atskirai.
  const { docs } = await payload.find({
    collection: 'zurnalas',
    where: { santrauka: { like: ZYMA } },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })
  for (const d of docs as unknown as { id: number }[]) {
    await payload.delete({ collection: 'zurnalas', id: d.id, overrideAccess: true })
  }
  console.log(`  ✓ išvalyta (${docs.length} žurnalo įrašų)`)
}

console.log(
  klaidu === 0 ? '\n✓ Visos patikros praėjo.\n' : `\n✖ Nepavyko patikrų: ${klaidu}\n`,
)
process.exit(klaidu === 0 ? 0 : 1)
