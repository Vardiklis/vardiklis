/**
 * Telegram sekretoriaus patikra nuo galo iki galo — be Telegram ir be modelio.
 *
 * Paleidimas:  npm run patikra:sekretorius
 *
 * Telegram pakeičiamas sąrašu, į kurį „siunčiamos“ žinutės, o kalbos modelis —
 * scenarijumi, kuris kviečia įrankius taip, kaip kviestų tikras. Tad tikrinama
 * viskas, kas lūžtų tyliai, išskyrus paties modelio supratingumą:
 *
 *   • pranešimas prieš pamoką: laiko langas, paskutinė tema ir namų darbai,
 *     grupė viena žinute be praleidžiančio vaiko, atšaukta — be pranešimo,
 *     antras badymas nekartoja;
 *   • svetimam pokalbiui botas neatsako;
 *   • perkelti / atšaukti / įrašyti temą keičia TIK paspaudus „Taip“;
 *     „Ne“ ir antras paspaudimas nieko nedaro;
 *   • perkeliant perspėja apie tuo metu esančią pamoką, o perkelta pamoka
 *     pranešimą gaus iš naujo;
 *   • grupinė atšaukiama visa, atsiliepimo grupei įrašyti neleidžia.
 *
 * Pamokos — 2099 metais naktį, kad nesusikirstų su tikromis. Bandomieji
 * įrašai trinami net tada, kai patikra nulūžta.
 */

import { getPayload } from 'payload'
import config from '../payload.config'
import type { Modelis, Zinute } from '../lib/agentas/agentas'
import type { Mygtukas, Telegrama } from '../lib/agentas/telegrama'
import { momentas, pridekDienas, SAVAITES_DIENOS, savaitesDiena } from '../lib/laikas'
import { apdorokTelegrama, praneskPriesPamokas, type Aplinka } from '../lib/sekretorius'

const ZYMA = 'PATIKRA-SEKRETORIUS-'
const MEET = 'https://meet.google.com/aaa-bbbb-ccc'
const D = '2099-01-05'
const DIENA = String(savaitesDiena(D)) as '1' | '2' | '3' | '4' | '5' | '6' | '7'

let klaidu = 0

function tikrink(salyga: boolean, ka: string, detales = ''): void {
  if (salyga) {
    console.log(`  ✓ ${ka}`)
  } else {
    klaidu++
    console.error(`  ✖ ${ka}${detales ? `\n      ${detales}` : ''}`)
  }
}

// ── Netikras Telegram ir netikras modelis ───────────────────────────────────

type Issiusta = { metodas: 'siusk' | 'redaguok'; pokalbis: string; tekstas: string; mygtukai?: Mygtukas[][] }
const issiusta: Issiusta[] = []
const tg: Telegrama = {
  siusk: async (pokalbis, tekstas, mygtukai) => {
    issiusta.push({ metodas: 'siusk', pokalbis: String(pokalbis), tekstas, mygtukai })
  },
  redaguok: async (pokalbis, _zinute, tekstas) => {
    issiusta.push({ metodas: 'redaguok', pokalbis: String(pokalbis), tekstas })
  },
  atsakykMygtukui: async () => {},
  rasau: async () => {},
}

type Ejimas = (zinutes: Zinute[]) => Awaited<ReturnType<Modelis>>
const ejimai: Ejimas[] = []
const sistemos: string[] = []
const modelis: Modelis = async (zinutes) => {
  sistemos.push(String(zinutes[0].content))
  const ejimas = ejimai.shift()
  if (!ejimas) throw new Error('Scenarijus baigėsi, o modelio dar klausiama.')
  return ejimas(zinutes)
}

let kvietimu = 0
const kviesk = (...kvietimai: [string, Record<string, unknown>][]) => ({
  content: null,
  tool_calls: kvietimai.map(([name, args]) => ({
    id: `k${++kvietimu}`,
    type: 'function' as const,
    function: { name, arguments: JSON.stringify(args) },
  })),
})

/** Paskutinio įrankio atsakymas — taip, kaip jį mato modelis. */
const paskutinis = (zinutes: Zinute[]) => JSON.parse(String(zinutes.at(-1)?.content)) as Record<string, unknown>

type IrankioPamoka = { raktas: string; kas: string; laikas: string; nariai?: string[] }
const rask = (zinutes: Zinute[], kas: string): IrankioPamoka => {
  const pamokos = paskutinis(zinutes).pamokos as IrankioPamoka[]
  const p = pamokos.find((p) => p.kas.includes(kas))
  if (!p) throw new Error(`Įrankis „pamokos“ negrąžino „${kas}“: ${JSON.stringify(pamokos)}`)
  return p
}

const POKALBIS = '42'
const aplinka: Aplinka = { tg, pokalbis: POKALBIS, modelis }
let atnaujinimas = Date.now()

async function rasyk(tekstas: string, pokalbis = Number(POKALBIS)) {
  await apdorokTelegrama(
    { update_id: ++atnaujinimas, message: { message_id: 1, chat: { id: pokalbis }, text: tekstas } },
    aplinka,
    momentas(D, '03:50'),
  )
}

/** Paspaudžia paskutinės žinutės su mygtukais „Taip“ (`t`) arba „Ne“ (`n`). */
async function spausk(veiksmas: 't' | 'n') {
  const su = [...issiusta].reverse().find((z) => z.mygtukai)
  const mygtukas = su?.mygtukai?.flat().find((m) => 'duomenys' in m && m.duomenys.startsWith(`${veiksmas}:`))
  if (!su || !mygtukas || !('duomenys' in mygtukas)) throw new Error('Nėra ką spausti.')
  await apdorokTelegrama(
    {
      update_id: ++atnaujinimas,
      callback_query: {
        id: 'q',
        data: mygtukas.duomenys,
        message: { message_id: 2, chat: { id: Number(POKALBIS) }, text: su.tekstas },
      },
    },
    aplinka,
    momentas(D, '03:50'),
  )
}

const naujos = (nuo: number) => issiusta.slice(nuo).filter((z) => z.tekstas.includes(ZYMA))

// ── Patikra ─────────────────────────────────────────────────────────────────

const payload = await getPayload({ config })

const sukurta = { mokiniai: [] as number[], grupes: [] as number[] }
const priminimai = (await payload.findGlobal({ slug: 'priminimai', overrideAccess: true })) as {
  telegramPries?: number | null
}

async function irasai(mokinys: number) {
  const { docs } = await payload.find({
    collection: 'zurnalas',
    where: { and: [{ mokinys: { equals: mokinys } }, { data: { equals: D } }] },
    depth: 0,
    overrideAccess: true,
  })
  return docs
}

try {
  await payload.updateGlobal({ slug: 'priminimai', overrideAccess: true, data: { telegramPries: 15 } })

  console.log('\n1. Bandomieji duomenys')

  const mokinys = async (vardas: string, klase: '7' | '8', laikas?: string) => {
    const m = await payload.create({
      collection: 'mokiniai',
      overrideAccess: true,
      data: {
        vardas: `${ZYMA}${vardas}`,
        klase,
        tevoPastas: 'patikra-sekretorius@example.com',
        meetNuoroda: MEET,
        pamokos: laikas ? [{ kartojimas: 'savaite', savaitesDiena: DIENA, laikas, trukmeMin: 60 }] : [],
      },
    })
    sukurta.mokiniai.push(m.id)
    return m.id
  }
  const eva = await mokinys('Eva', '8', '04:00')
  const jonas = await mokinys('Jonas', '8')
  const ona = await mokinys('Ona', '7')
  await mokinys('Petras', '7', '04:30')
  const lina = await mokinys('Lina', '7')

  const grupe = await payload.create({
    collection: 'grupes',
    overrideAccess: true,
    data: {
      pavadinimas: `${ZYMA}grupė`,
      nariai: [jonas, ona],
      meetNuoroda: MEET,
      pamokos: [{ kartojimas: 'savaite', savaitesDiena: DIENA, laikas: '04:05', trukmeMin: 60 }],
    },
  })
  sukurta.grupes.push(grupe.id)

  const savaitePries = pridekDienas(D, -7)
  for (const data of [
    { mokinys: eva, data: pridekDienas(D, -14), laikas: '04:00', busena: 'ivyko', tema: 'Sudėtis' },
    { mokinys: eva, data: savaitePries, laikas: '04:00', busena: 'ivyko', tema: 'Daugyba', namuDarbai: '45 psl. 3–7' },
    { mokinys: jonas, data: savaitePries, laikas: '04:05', tipas: 'grupine', grupe: grupe.id, tema: 'Trupmenos' },
    // Ona šįkart praleidžia grupinę.
    { mokinys: ona, data: D, laikas: '04:05', tipas: 'grupine', grupe: grupe.id, busena: 'neivyko' },
    // Vienkartinė, bet atšaukta.
    { mokinys: lina, data: D, laikas: '04:10', busena: 'atsaukta' },
  ]) {
    await payload.create({ collection: 'zurnalas', overrideAccess: true, data: data as never })
  }
  tikrink(true, 'sukurta: 5 mokiniai, grupė, žurnalo istorija')

  console.log('\n2. Pranešimas prieš pamoką')

  let nuo = issiusta.length
  const pirmas = await praneskPriesPamokas(momentas(D, '03:50'), aplinka)
  const zinutes = naujos(nuo)
  const evai = zinutes.find((z) => z.tekstas.includes(`${ZYMA}Eva`))
  const grupei = zinutes.find((z) => z.tekstas.includes(`${ZYMA}grupė`))
  tikrink(zinutes.length === 2, 'dvi žinutės: Eva ir grupė (Petro 04:30 — dar per anksti, Linos — atšaukta)', JSON.stringify(pirmas.eilutes))
  tikrink(Boolean(evai?.tekstas.startsWith(`<b>Po 10 min. — ${ZYMA}Eva (8 kl.), 04:00</b>`)), 'Evai — „Po 10 min. — Eva (8 kl.), 04:00“', evai?.tekstas)
  tikrink(Boolean(evai?.tekstas.includes('Paskutinė tema: Daugyba') && evai.tekstas.includes('45 psl. 3–7')), 'su paskutine tema ir namų darbais', evai?.tekstas)
  tikrink(Boolean(evai?.mygtukai?.flat().some((m) => 'nuoroda' in m && m.nuoroda === MEET)), 'mygtukas į Meet')
  tikrink(Boolean(grupei?.tekstas.includes(`${ZYMA}Jonas`) && !grupei.tekstas.includes(`${ZYMA}Ona`)), 'grupei — Jonas, be praleidžiančios Onos', grupei?.tekstas)
  tikrink(Boolean(grupei?.tekstas.includes('Paskutinė tema: Trupmenos')), 'grupės paskutinė tema', grupei?.tekstas)
  tikrink(issiusta.slice(nuo).every((z) => z.pokalbis === POKALBIS), 'siunčiama tik į TELEGRAM_CHAT_ID')

  const [evosIrasas] = await irasai(eva)
  tikrink(Boolean(evosIrasas?.pranestaSau), 'tvarkaraščio pamokai sukurtas įrašas su „Pranešta man“')
  const grupesIrasai = [...(await irasai(jonas)), ...(await irasai(ona))]
  tikrink(grupesIrasai.length === 2 && grupesIrasai.every((z) => z.pranestaSau), 'grupė — pažymėti abu nariai')

  nuo = issiusta.length
  await praneskPriesPamokas(momentas(D, '03:55'), aplinka)
  tikrink(naujos(nuo).length === 0, 'antras badymas nekartoja')

  nuo = issiusta.length
  await praneskPriesPamokas(momentas(D, '04:20'), aplinka)
  tikrink(naujos(nuo).length === 1 && naujos(nuo)[0].tekstas.includes(`${ZYMA}Petras`), 'Petrui — kai lieka 10 min.')

  console.log('\n3. Prieiga ir komandos')

  nuo = issiusta.length
  await rasyk('/siandien', 999)
  tikrink(issiusta.length === nuo, 'svetimam pokalbiui — tyla')

  await rasyk('/siandien')
  const siandien = issiusta.at(-1)?.tekstas ?? ''
  tikrink(siandien.includes(`04:00  ${ZYMA}Eva (8 kl.)`) && !siandien.includes(`${ZYMA}Lina`), '/siandien — be modelio, be atšauktos', siandien)

  console.log('\n4. Žurnalas')

  ejimai.push(
    () => kviesk(['zurnalas', { mokinio_id: eva, kiek: 5 }]),
    (z) => {
      const pamokos = paskutinis(z).pamokos as { tema: string }[]
      return { content: pamokos.map((p) => p.tema).join(', ') }
    },
  )
  await rasyk('kokios buvo temos su Eva?')
  tikrink(issiusta.at(-1)?.tekstas === 'Daugyba, Sudėtis', 'temos naujausia pirma', issiusta.at(-1)?.tekstas)
  tikrink(sistemos.at(-1)?.includes(`${eva}: ${ZYMA}Eva (8 kl.)`) ?? false, 'sistemos tekste — mokinių sąrašas su id')
  tikrink(
    sistemos.at(-1)?.includes(`${D} ${SAVAITES_DIENOS[savaitesDiena(D) - 1]} (šiandien)`) ?? false,
    'sistemos tekste — dienos su savaitės dienomis',
  )

  console.log('\n5. Perkėlimas')

  ejimai.push(
    () => kviesk(['pamokos', { nuo: D }]),
    (z) => kviesk(['perkelti', { raktas: rask(z, `${ZYMA}Eva`).raktas, data: D, laikas: '4:30' }]),
  )
  await rasyk('perkelk Evos pamoką į 4:30')
  const pasiulymas = issiusta.at(-1)
  tikrink(Boolean(pasiulymas?.mygtukai) && (pasiulymas?.tekstas.includes('→') ?? false), 'pasiūlymas su „Taip / Ne“', pasiulymas?.tekstas)
  tikrink(
    Boolean(pasiulymas?.tekstas.includes('Tuo metu jau yra') && pasiulymas.tekstas.includes(`${ZYMA}Petras`)),
    'perspėja apie Petro pamoką',
    pasiulymas?.tekstas,
  )
  tikrink((await irasai(eva))[0]?.laikas === '04:00', 'kol nepaspausta — niekas nepakeista')

  await spausk('t')
  const perkelta = (await irasai(eva))[0]
  tikrink(perkelta?.laikas === '04:30' && perkelta.pradinisLaikas === '04:00', 'paspaudus „Taip“ — perkelta, įsiminta iš kur')
  tikrink(!perkelta?.pranestaSau, 'perkeltai pamokai pranešimas išeis iš naujo')
  tikrink(issiusta.at(-1)?.metodas === 'redaguok' && issiusta.at(-1)!.tekstas.includes('✓ Perkelta'), 'pasiūlymas pažymėtas „✓“')

  nuo = issiusta.length
  await spausk('t')
  tikrink(issiusta.at(-1)?.tekstas.includes('Nebegalioja') ?? false, 'antras paspaudimas — nebegalioja')

  console.log('\n6. Atšaukimas')

  const atsauk = () =>
    ejimai.push(
      () => kviesk(['pamokos', { nuo: D }]),
      (z) => kviesk(['atsaukti', { raktas: rask(z, `${ZYMA}grupė`).raktas }]),
    )
  atsauk()
  await rasyk('atšauk grupės pamoką')
  await spausk('n')
  tikrink((await irasai(jonas))[0]?.busena !== 'atsaukta', '„Ne“ — nieko nepakeista')

  atsauk()
  await rasyk('vis dėlto atšauk')
  await spausk('t')
  const busenos = [...(await irasai(jonas)), ...(await irasai(ona))].map((z) => z.busena)
  tikrink(busenos.length === 2 && busenos.every((b) => b === 'atsaukta'), 'grupė atšaukta abiem nariams', JSON.stringify(busenos))

  console.log('\n7. Tema ir namų darbai')

  ejimai.push(
    () => kviesk(['pamokos', { nuo: D }]),
    (z) => {
      const raktas = rask(z, `${ZYMA}Eva`).raktas
      // Du keitimai vienu ėjimu — antras turi būti atmestas.
      return kviesk(
        ['irasyti_tema', { raktas, tema: 'Lygtys', namu_darbai: '12 psl.' }],
        ['atsaukti', { raktas }],
      )
    },
  )
  await rasyk('Evai: lygtys, ND 12 psl.')
  tikrink(issiusta.at(-1)?.tekstas.includes('Tema: Lygtys') ?? false, 'pasiūlymas su tema ir namų darbais', issiusta.at(-1)?.tekstas)
  await spausk('t')
  const suTema = (await irasai(eva))[0]
  tikrink(suTema?.tema === 'Lygtys' && suTema.namuDarbai === '12 psl.', 'įrašyta į žurnalą')
  tikrink(suTema?.busena !== 'atsaukta', 'antras to paties ėjimo keitimas nevykdytas')

  let klaidosTekstas = ''
  ejimai.push(
    () => kviesk(['pamokos', { nuo: D, iki: pridekDienas(D, 7) }]),
    (z) => {
      const pamokos = paskutinis(z).pamokos as IrankioPamoka[]
      const grupes = pamokos.filter((p) => p.kas.includes(`${ZYMA}grupė`))
      return kviesk(['irasyti_tema', { raktas: grupes[0].raktas, atsiliepimas: 'Šaunuolis' }])
    },
    (z) => {
      klaidosTekstas = String(z.at(-1)?.content)
      return { content: 'Grupei atsiliepimo neįrašysiu.' }
    },
  )
  await rasyk('grupei atsiliepimas: šaunuoliai')
  tikrink(klaidosTekstas.includes('kiekvienam vaikui atskirai'), 'grupei atsiliepimo neleidžia — klaida grąžinta modeliui', klaidosTekstas)
  tikrink(issiusta.at(-1)?.mygtukai === undefined, 'ir mygtukų nerodo')
  tikrink(ejimai.length === 0, 'modelis paklaustas tiek kartų, kiek scenarijuje')
} finally {
  // Žurnalas pirmas: jo įrašai rodo į mokinius ir grupę.
  const { docs } = await payload.find({
    collection: 'zurnalas',
    where: { mokinys: { in: sukurta.mokiniai } },
    limit: 200,
    overrideAccess: true,
    depth: 0,
  })
  for (const z of docs) await payload.delete({ collection: 'zurnalas', id: z.id, overrideAccess: true })
  for (const id of sukurta.grupes) await payload.delete({ collection: 'grupes', id, overrideAccess: true }).catch(() => {})
  for (const id of sukurta.mokiniai) await payload.delete({ collection: 'mokiniai', id, overrideAccess: true }).catch(() => {})
  await payload.updateGlobal({
    slug: 'priminimai',
    overrideAccess: true,
    data: { telegramPries: priminimai.telegramPries ?? 15 },
  })
}

console.log(klaidu ? `\n✖ Klaidų: ${klaidu}\n` : '\n✓ Viskas gerai\n')
process.exit(klaidu ? 1 : 0)
