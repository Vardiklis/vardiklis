import {
  data as dataVilniuje,
  MENESIAI,
  MENESIU_VARDAI,
  momentas,
  pridekDienas,
  SAVAITES_DIENOS,
  savaitesDiena,
} from '@/lib/laikas'

/**
 * Laisvų laikų kalendorius su tikromis datomis.
 *
 * KĄ ATIDUODA SVETAINEI. Tik raidę kiekvienam langeliui: `l` — laisva,
 * `u` — užimta, `p` — praėję arba per vėlu registruotis. Mokinių vardai,
 * klasės, tėvų paštai ir Meet nuorodos lieka serveryje ir į HTML nepatenka
 * niekada — antraip savaitinį tvarkaraštį su vaikų vardais perskaitytų bet
 * kas, atsidaręs puslapio kodą. Rezervacijų kontaktai — lygiai taip pat.
 *
 * KAS UŽIMA LANGELĮ:
 *   1. mokinio savaitinė pamoka (`Mokiniai`);
 *   2. rankinis pataisymas (`Tvarkarastis.pakeitimai`) — jis paskutinis žodis
 *      ir gali tiek uždaryti, tiek atlaisvinti;
 *   3. rezervacija, kurios būsena „nauja“ arba „patvirtinta“.
 *
 * Langelis dažomas, kai intervalai PERSIDENGIA, o ne kai sutampa pradžios:
 * 15:40 pamoka valandinėje lentelėje uždažo ir 15:00, ir 16:00. Geriau parodyti
 * šiek tiek daugiau užimtumo, nei pasiūlyti langą, kurio nėra.
 */

export type LangelioBusena = 'l' | 'u' | 'p'

export type Diena = {
  /** `2026-09-08` */
  data: string
  /** `An` */
  trumpas: string
  /** `antradienis, rugsėjo 8` — ekrano skaitytuvui ir mygtuko paaiškinimui. */
  pilnas: string
  /** Mėnesio diena, rodoma po trumpiniu. */
  diena: number
}

export type Savaite = {
  /** `rugsėjo 8–13` */
  etikete: string
  /** `2026-09` — pagal savaitės pirmą dieną. Mėnesių sąrašui viršuje. */
  menuoRaktas: string
  /** `Rugsėjis` arba `Sausis 2027`, jei metai jau kiti. */
  menuoVardas: string
  dienos: Diena[]
  /** `[eilutė][diena]` — ta pati tvarka kaip `laikai` ir `dienos`. */
  langeliai: LangelioBusena[][]
}

export type Kalendorius = {
  antraste: string
  laikai: string[]
  savaites: Savaite[]
  /** Ar laisvus langelius galima spausti ir registruotis. */
  registracija: boolean
  pastabaLaikai: string | null
  pastabaGrupine: string | null
}

const TRUMPINIAI = ['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk']

/** Kiek minučių užima viena rezervacija. Pamokos trukmė — 60 min. */
const REZERVACIJOS_MIN = 60

type Intervalas = { data: string; nuo: number; iki: number }

type Pakeitimas = {
  savaitesDiena?: string | null
  nuo?: string | null
  iki?: string | null
  busena?: string | null
}

type Dok = {
  rodyti?: boolean | null
  antraste?: string | null
  nuo?: string | null
  iki?: string | null
  zingsnis?: string | null
  dienos?: string[] | null
  savaiciu?: number | null
  leistiRegistruotis?: boolean | null
  ispejimasVal?: number | null
  pakeitimai?: Pakeitimas[] | null
  pastabaLaikai?: string | null
  pastabaGrupine?: string | null
}

type Pamoka = { savaitesDiena?: string | null; laikas?: string | null; trukmeMin?: number | null }

/** `17:30` → 1050. */
function minutes(laikas: string): number {
  const [v, m] = laikas.split(':').map(Number)
  return v * 60 + m
}

function tekstu(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
}

function persidengia(a1: number, a2: number, b1: number, b2: number): boolean {
  return a1 < b2 && a2 > b1
}

function tekstas(reiksme: string | null | undefined, atsarga: string | null): string | null {
  const isvalytas = reiksme?.trim()
  return isvalytas ? isvalytas : atsarga
}

/**
 * Viskas, ko reikia langelio būsenai — surenkama vieną kartą.
 *
 * Tuo pačiu naudojasi ir lentelė svetainėje, ir rezervacijos veiksmas
 * (`lib/rezervacija.ts`): laikas, kurio lentelė nesiūlė, negali būti užsakytas
 * ir apeinant naršyklę.
 */
async function surinkti(dabar: Date) {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ])
  const payload = await getPayload({ config })

  // `overrideAccess` — globalas uždarytas, bet serveris jį skaityti privalo.
  const n = (await payload.findGlobal({
    slug: 'tvarkarastis',
    overrideAccess: true,
  })) as Dok

  const nuo = minutes(n.nuo?.trim() || '08:00')
  const iki = minutes(n.iki?.trim() || '21:00')
  const zingsnis = Number(n.zingsnis || 60)
  const savaiciu = Math.min(Math.max(Number(n.savaiciu || 26), 2), 52)
  const ispejimasMs = Math.max(Number(n.ispejimasVal ?? 12), 0) * 3600_000

  const dienuNumeriai = (n.dienos?.length ? n.dienos : ['1', '2', '3', '4', '5', '6'])
    .map(Number)
    .filter((d) => d >= 1 && d <= 7)
    .sort((a, b) => a - b)

  const siandien = dataVilniuje(dabar)
  // Savaitė pradedama pirmadieniu — taip antra ir trečia savaitės prasideda
  // ten, kur žmogus jų tikisi, o ne „šiandien plius septynios“.
  const pirmadienis = pridekDienas(siandien, -(savaitesDiena(siandien) - 1))
  const paskutine = pridekDienas(pirmadienis, savaiciu * 7 - 1)

  const { docs: mokiniai } = await payload.find({
    collection: 'mokiniai',
    where: { aktyvus: { equals: true } },
    limit: 500,
    depth: 0,
    overrideAccess: true,
  })

  /** Savaitinės pamokos: diena (1–7) → intervalai minutėmis. */
  const savaitiniai: { diena: number; nuo: number; iki: number }[] = []
  for (const dok of mokiniai as unknown as { pamokos?: Pamoka[] | null }[]) {
    for (const pamoka of dok.pamokos ?? []) {
      if (!pamoka.savaitesDiena || !pamoka.laikas) continue
      const pradzia = minutes(pamoka.laikas)
      savaitiniai.push({
        diena: Number(pamoka.savaitesDiena),
        nuo: pradzia,
        iki: pradzia + (pamoka.trukmeMin || 60),
      })
    }
  }

  const pakeitimai = (n.pakeitimai ?? [])
    .filter((p) => p.savaitesDiena && p.nuo && p.iki && p.busena)
    .map((p) => ({
      diena: Number(p.savaitesDiena),
      nuo: minutes(p.nuo!),
      iki: minutes(p.iki!),
      uzimta: p.busena === 'uzimta',
    }))

  const { docs: rez } = await payload.find({
    collection: 'rezervacijos',
    where: {
      and: [
        { data: { greater_than_equal: pirmadienis } },
        { data: { less_than_equal: paskutine } },
        { busena: { not_equals: 'atmesta' } },
      ],
    },
    // Pusmetis į priekį — įrašų gali susikaupti kur kas daugiau nei savaitėje.
    limit: 2000,
    depth: 0,
    overrideAccess: true,
  })

  const rezervacijos: Intervalas[] = (rez as unknown as { data: string; laikas: string }[]).map(
    (r) => ({ data: r.data, nuo: minutes(r.laikas), iki: minutes(r.laikas) + REZERVACIJOS_MIN }),
  )

  return {
    n,
    nuo,
    iki,
    zingsnis,
    savaiciu,
    ispejimasMs,
    dienuNumeriai,
    pirmadienis,
    savaitiniai,
    pakeitimai,
    rezervacijos,
    // `iki` yra PASKUTINĖS eilutės pradžia, tad lygybė irgi tinka — tada
    // lentelėje lieka viena eilutė.
    tinka: iki >= nuo && zingsnis > 0 && dienuNumeriai.length > 0 && n.rodyti !== false,
  }
}

type Surinkta = Awaited<ReturnType<typeof surinkti>>

/** Vieno langelio būsena. Ta pati funkcija piešia lentelę ir tikrina užsakymą. */
function langelioBusena(
  s: Surinkta,
  dataISO: string,
  pradzia: number,
  dabar: Date,
): LangelioBusena {
  if (momentas(dataISO, tekstu(pradzia)).getTime() - dabar.getTime() < s.ispejimasMs) return 'p'

  const pabaiga = pradzia + s.zingsnis
  const diena = savaitesDiena(dataISO)

  let uzimta = s.savaitiniai.some(
    (u) => u.diena === diena && persidengia(u.nuo, u.iki, pradzia, pabaiga),
  )

  // Rankiniai pataisymai — paskutinis žodis prieš rezervacijas.
  for (const p of s.pakeitimai) {
    if (p.diena !== diena) continue
    if (!persidengia(p.nuo, p.iki, pradzia, pabaiga)) continue
    uzimta = p.uzimta
  }

  // Rezervacija užima visada: ji jau pažadėta žmogui.
  if (s.rezervacijos.some((r) => r.data === dataISO && persidengia(r.nuo, r.iki, pradzia, pabaiga)))
    return 'u'

  return uzimta ? 'u' : 'l'
}

export async function gautiKalendoriu(dabar = new Date()): Promise<Kalendorius | null> {
  try {
    const s = await surinkti(dabar)
    if (!s.tinka) return null

    // `<=`, ne `+ zingsnis <=`: nustačius „iki 21:00“ paskutinė eilutė turi būti
    // 21:00, o ne 20:00. Lauko pavadinimas CMS'e — „Paskutinė eilutė“.
    const laikai: string[] = []
    for (let v = s.nuo; v <= s.iki; v += s.zingsnis) laikai.push(tekstu(v))

    const savaites: Savaite[] = []
    for (let sav = 0; sav < s.savaiciu; sav++) {
      const dienos: Diena[] = s.dienuNumeriai.map((d) => {
        const dataISO = pridekDienas(s.pirmadienis, sav * 7 + (d - 1))
        const [, menuo, diena] = dataISO.split('-').map(Number)
        return {
          data: dataISO,
          trumpas: TRUMPINIAI[d - 1],
          pilnas: `${SAVAITES_DIENOS[d - 1]}, ${MENESIAI[menuo - 1]} ${diena}`,
          diena,
        }
      })

      // Mėnuo imamas pagal pirmą savaitės dieną — kitaip savaitė, prasidedanti
      // rugsėjo 28 ir pasibaigianti spalio 3, sąraše atsidurtų du kartus.
      const [metai, menuo] = dienos[0].data.split('-').map(Number)
      const siuMetu = Number(s.pirmadienis.split('-')[0]) === metai

      savaites.push({
        etikete: savaitesEtikete(dienos),
        menuoRaktas: `${metai}-${String(menuo).padStart(2, '0')}`,
        menuoVardas: siuMetu
          ? MENESIU_VARDAI[menuo - 1]
          : `${MENESIU_VARDAI[menuo - 1]} ${metai}`,
        dienos,
        langeliai: laikai.map((laikas) =>
          dienos.map((d) => langelioBusena(s, d.data, minutes(laikas), dabar)),
        ),
      })
    }

    return {
      antraste: tekstas(s.n.antraste, 'Laisvi laikai') as string,
      laikai,
      savaites,
      registracija: s.n.leistiRegistruotis !== false,
      pastabaLaikai: tekstas(s.n.pastabaLaikai, null),
      pastabaGrupine: tekstas(s.n.pastabaGrupine, null),
    }
  } catch (klaida) {
    console.error('[tvarkarastis] kalendoriaus paruošti nepavyko:', klaida)
    return null
  }
}

/**
 * Ar šį laiką dar galima užsakyti.
 *
 * Kviečiama iš rezervacijos veiksmo PRIEŠ įrašant: naršyklė gali rodyti
 * pasenusią lentelę, o užklausą galima atsiųsti ir visai be jos.
 */
export async function arGalimaRezervuoti(
  dataISO: string,
  laikas: string,
  dabar = new Date(),
): Promise<boolean> {
  try {
    const s = await surinkti(dabar)
    if (!s.tinka || s.n.leistiRegistruotis === false) return false

    // Laikas privalo būti lentelės tinklelyje, o ne bet koks „17:07“.
    const pradzia = minutes(laikas)
    if (pradzia < s.nuo || pradzia > s.iki) return false
    if ((pradzia - s.nuo) % s.zingsnis !== 0) return false
    if (!s.dienuNumeriai.includes(savaitesDiena(dataISO))) return false

    return langelioBusena(s, dataISO, pradzia, dabar) === 'l'
  } catch (klaida) {
    console.error('[tvarkarastis] laisvumo patikrinti nepavyko:', klaida)
    return false
  }
}

/** `rugsėjo 8–13` arba `rugsėjo 29 – spalio 4`. */
function savaitesEtikete(dienos: Diena[]): string {
  const pirma = dienos[0]
  const paskutine = dienos[dienos.length - 1]
  const menuoPirmos = Number(pirma.data.split('-')[1])
  const menuoPaskutines = Number(paskutine.data.split('-')[1])

  if (menuoPirmos === menuoPaskutines) {
    return `${MENESIAI[menuoPirmos - 1]} ${pirma.diena}–${paskutine.diena}`
  }
  return `${MENESIAI[menuoPirmos - 1]} ${pirma.diena} – ${MENESIAI[menuoPaskutines - 1]} ${paskutine.diena}`
}
