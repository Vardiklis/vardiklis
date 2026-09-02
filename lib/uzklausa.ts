'use server'

import { headers } from 'next/headers'
import { kontaktai } from '@/lib/kontaktai'
import { pastoNustatymai, pastoSiuntejas } from '@/lib/pastas'
import type { UzklausosBusena } from '@/lib/uzklausos-busena'

/** Kiek užklausų iš vieno IP leidžiama per langą. */
const RIBA = 5
const LANGAS_MS = 10 * 60 * 1000

/**
 * Paprastas greičio ribotuvas atmintyje. Perkrovus serverį atsistato ir
 * kiekvienas procesas skaičiuoja atskirai — tikram DDoS neapsaugotų, bet
 * botui, kuris tą pačią formą siunčia šimtą kartų, užtenka.
 */
const zurnalas = new Map<string, number[]>()

function perDaznai(ip: string): boolean {
  const dabar = Date.now()
  const buve = (zurnalas.get(ip) ?? []).filter((t) => dabar - t < LANGAS_MS)
  if (buve.length >= RIBA) {
    zurnalas.set(ip, buve)
    return true
  }
  buve.push(dabar)
  zurnalas.set(ip, buve)

  // Kad Map neaugtų be galo — retkarčiais išvalom pasenusius įrašus.
  if (zurnalas.size > 500) {
    for (const [raktas, laikai] of zurnalas) {
      if (laikai.every((t) => dabar - t >= LANGAS_MS)) zurnalas.delete(raktas)
    }
  }
  return false
}

/** Naujos eilutės antraštėse leidžia įterpti savo `Bcc:` — iškerpam. */
function saugiEilute(tekstas: string, ilgis: number): string {
  return tekstas.replace(/[\r\n]+/g, ' ').trim().slice(0, ilgis)
}

const ATRODO_KAIP_PASTAS = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const NEPAVYKO = `Nepavyko išsiųsti. Paskambinkite ${kontaktai.telefonas} arba parašykite ${kontaktai.elPastas}.`

/**
 * Registracijos užklausa.
 *
 * Serveris pats išsiunčia laišką į Modestos dėžutę — lankytojui nereikia nieko
 * daryti savo pašto programoje. Svetainė duomenų neįrašo: jie gyvuoja tik tiek,
 * kiek trunka šis iškvietimas, ir lieka tik išsiųstame laiške.
 *
 * Veiksmas yra viešas POST galinis taškas (žr. Next „Server Actions →
 * Security“), tad viskas tikrinama čia iš naujo, nepaisant `required` atributų
 * naršyklėje.
 */
export async function siuskUzklausa(
  _ankstesne: UzklausosBusena,
  duomenys: FormData,
): Promise<UzklausosBusena> {
  // Botų spąstai: laukas paslėptas nuo žmonių, tad užpildytas jis būna tik
  // tada, kai formą pildo skriptas. Atsakom „pavyko“, kad botas nebandytų kitaip.
  if (String(duomenys.get('miestas') ?? '') !== '') {
    return { bukle: 'pavyko', pranesimas: 'Ačiū — užklausa išsiųsta.' }
  }

  const vardas = saugiEilute(String(duomenys.get('vardas') ?? ''), 100)
  const kontaktas = saugiEilute(String(duomenys.get('kontaktas') ?? ''), 200)
  const saltinis = saugiEilute(String(duomenys.get('saltinis') ?? ''), 100)
  const zinute = String(duomenys.get('zinute') ?? '').trim().slice(0, 2000)

  // Tik 1–10; bet kas kita — tarsi klasė nebūtų nurodyta. Į laiško temą turi
  // patekti tik tai, ką iš tikrųjų siūlo sąrašas.
  const nurodytaKlase = saugiEilute(String(duomenys.get('klase') ?? ''), 2)
  const klase = /^([1-9]|10)$/.test(nurodytaKlase) ? nurodytaKlase : ''

  // Nepažymėtas langelis į FormData nepatenka visai, o pažymėtas atsiunčia
  // „on“. Tuščios reikšmės netinka: taip sutikimą apeitų tiesiogiai siunčiamas
  // `sutinku=` — o sutikimas yra teisinė sąlyga, ne formalumas.
  const sutinku = String(duomenys.get('sutinku') ?? '') !== ''

  const laukai: UzklausosBusena['laukai'] = {}
  if (vardas.length < 2) laukai.vardas = 'Įrašykite vardą.'
  if (kontaktas.length < 5) laukai.kontaktas = 'Įrašykite el. paštą arba telefoną.'
  if (!sutinku) laukai.sutikimas = 'Pažymėkite patvirtinimą.'

  if (Object.keys(laukai).length > 0) {
    return { bukle: 'klaida', pranesimas: 'Patikrinkite pažymėtus laukus.', laukai }
  }

  const antrastes = await headers()
  const ip = antrastes.get('x-forwarded-for')?.split(',')[0]?.trim() || 'nezinomas'
  if (perDaznai(ip)) {
    return {
      bukle: 'klaida',
      pranesimas: `Per daug užklausų iš eilės. Palaukite arba paskambinkite ${kontaktai.telefonas}.`,
    }
  }

  const nustatymai = pastoNustatymai()
  if (!nustatymai) {
    console.error('[uzklausa] SMTP nesukonfigūruotas — trūksta SMTP_USER arba SMTP_PASS.')
    return { bukle: 'klaida', pranesimas: NEPAVYKO }
  }

  const eilutes = [
    `Vardas: ${vardas}`,
    `Susisiekti: ${kontaktas}`,
    klase ? `Klasė: ${klase}` : null,
    '',
    zinute || '(žinutės nėra)',
    '',
    '—',
    'Patvirtinta, kad siuntėjui yra 16 metų arba sutinka tėvai.',
    saltinis ? `Užklausa iš: ${saltinis}` : null,
    'vardiklis.lt',
  ].filter((e): e is string => e !== null)

  try {
    await pastoSiuntejas(nustatymai).sendMail({
      from: `"Vardiklis" <${nustatymai.user}>`,
      to: nustatymai.gavejas,
      // Kad į užklausą būtų galima atsakyti tiesiog paspaudus „Atsakyti“.
      replyTo: ATRODO_KAIP_PASTAS.test(kontaktas) ? kontaktas : undefined,
      subject: klase
        ? `Registracija į pamoką — ${klase} klasė (${vardas})`
        : `Registracija į pamoką — ${vardas}`,
      text: eilutes.join('\n'),
    })
  } catch (klaida) {
    console.error('[uzklausa] laiško išsiųsti nepavyko:', klaida)
    return { bukle: 'klaida', pranesimas: NEPAVYKO }
  }

  return {
    bukle: 'pavyko',
    pranesimas: 'Ačiū — užklausa išsiųsta. Modesta atsakys per artimiausią dieną.',
  }
}
