'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ATRODO_KAIP_PASTAS, perDaznai, saugiEilute } from '@/lib/greicio-riba'
import { kontaktai, svetaine } from '@/lib/kontaktai'
import { dataZodziais } from '@/lib/laikas'
import { pastoNustatymai, pastoSiuntejas } from '@/lib/pastas'
import { arGalimaRezervuoti } from '@/lib/tvarkarastis'
import type { RezervacijosBusena } from '@/lib/rezervacijos-busena'

/** Kiek rezervacijų iš vieno IP leidžiama per langą. */
const RIBA = 3
const LANGAS_MS = 30 * 60 * 1000

const NEPAVYKO = `Nepavyko išsaugoti. Paskambinkite ${kontaktai.telefonas} arba parašykite ${kontaktai.elPastas}.`

/**
 * Registracija į kalendoriuje pasirinktą laiką.
 *
 * SKIRTUMAS NUO REGISTRACIJOS FORMOS (`lib/uzklausa.ts`): ši ne tik išsiunčia
 * laišką, bet ir ĮRAŠO į duomenų bazę, o įrašas iškart užima laiką svetainės
 * kalendoriuje. Todėl čia yra viena patikra daugiau — ar tas laikas apskritai
 * buvo siūlomas.
 *
 * Laisvumas tikrinamas SERVERYJE iš naujo, nepaisant to, ką rodė lentelė:
 * naršyklės puslapis gali būti atidarytas prieš valandą, o užklausą galima
 * atsiųsti ir visai be jos. Tai tuo pačiu ir apsauga nuo dviejų žmonių, tuo
 * pačiu metu spustelėjusių tą patį langelį.
 */
export async function rezervuok(
  _ankstesne: RezervacijosBusena,
  duomenys: FormData,
): Promise<RezervacijosBusena> {
  // Botų spąstai: laukas paslėptas nuo žmonių, tad užpildytas jis būna tik
  // tada, kai formą pildo skriptas. Atsakom „pavyko“, kad botas nebandytų kitaip.
  if (String(duomenys.get('miestas') ?? '') !== '') {
    return { bukle: 'pavyko', pranesimas: 'Ačiū — laikas rezervuotas.' }
  }

  const data = saugiEilute(String(duomenys.get('data') ?? ''), 10)
  const laikas = saugiEilute(String(duomenys.get('laikas') ?? ''), 5)
  const tevoVardas = saugiEilute(String(duomenys.get('tevoVardas') ?? ''), 100)
  const vaikoVardas = saugiEilute(String(duomenys.get('vaikoVardas') ?? ''), 100)
  const elPastas = saugiEilute(String(duomenys.get('elPastas') ?? ''), 200)
  const telefonas = saugiEilute(String(duomenys.get('telefonas') ?? ''), 40)
  const saltinis = saugiEilute(String(duomenys.get('saltinis') ?? ''), 100)

  // Tik 1–10; bet kas kita — tarsi klasė nebūtų nurodyta.
  const nurodytaKlase = saugiEilute(String(duomenys.get('klase') ?? ''), 2)
  const klase = /^([1-9]|10)$/.test(nurodytaKlase) ? nurodytaKlase : ''

  const sutinku = String(duomenys.get('sutinku') ?? '') !== ''

  const laukai: RezervacijosBusena['laukai'] = {}
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(laikas)) {
    laukai.laikas = 'Pasirinkite laiką kalendoriuje.'
  }
  if (tevoVardas.length < 2) laukai.tevoVardas = 'Įrašykite savo vardą.'
  if (vaikoVardas.length < 2) laukai.vaikoVardas = 'Įrašykite vaiko vardą.'
  if (!ATRODO_KAIP_PASTAS.test(elPastas)) laukai.elPastas = 'Įrašykite el. paštą.'
  if (!sutinku) laukai.sutikimas = 'Pažymėkite patvirtinimą.'

  if (Object.keys(laukai).length > 0) {
    return { bukle: 'klaida', pranesimas: 'Patikrinkite pažymėtus laukus.', laukai }
  }

  const antrastes = await headers()
  const ip = antrastes.get('x-forwarded-for')?.split(',')[0]?.trim() || 'nezinomas'
  if (perDaznai('rezervacija', ip, RIBA, LANGAS_MS)) {
    return {
      bukle: 'klaida',
      pranesimas: `Per daug užsakymų iš eilės. Palaukite arba paskambinkite ${kontaktai.telefonas}.`,
    }
  }

  if (!(await arGalimaRezervuoti(data, laikas))) {
    return {
      bukle: 'klaida',
      pranesimas: 'Deja, šis laikas ką tik tapo nebepasiekiamas. Pasirinkite kitą.',
      laukai: { laikas: 'Pasirinkite kitą laiką.' },
    }
  }

  const kada = `${dataZodziais(data)} ${laikas}`

  let payload
  try {
    payload = await getPayload({ config })
    await payload.create({
      collection: 'rezervacijos',
      overrideAccess: true,
      data: {
        santrauka: `${vaikoVardas} · ${data} ${laikas}`,
        busena: 'nauja',
        data,
        laikas,
        tevoVardas,
        vaikoVardas,
        klase: klase || undefined,
        elPastas,
        telefonas: telefonas || undefined,
        saltinis: saltinis || undefined,
      },
    })
  } catch (klaida) {
    console.error('[rezervacija] įrašyti nepavyko:', klaida)
    return { bukle: 'klaida', pranesimas: NEPAVYKO }
  }

  /**
   * Laiškai siunčiami PO įrašymo ir jų nesėkmė užsakymo nebeatšaukia: laikas
   * jau užimtas ir matomas CMS'e. Antraip žmogui rodytume klaidą dėl užsakymo,
   * kuris iš tikrųjų priimtas, ir jis užsakytų dar kartą.
   */
  const pastas = pastoNustatymai()
  if (pastas) {
    const siuntejas = pastoSiuntejas(pastas)
    try {
      await siuntejas.sendMail({
        from: `"${svetaine.pavadinimas}" <${pastas.user}>`,
        to: pastas.gavejas,
        replyTo: elPastas,
        subject: `Nauja rezervacija — ${kada} (${vaikoVardas})`,
        text: [
          `Laikas: ${kada}`,
          '',
          `Vaikas: ${vaikoVardas}${klase ? `, ${klase} klasė` : ''}`,
          `Tėvas / globėjas: ${tevoVardas}`,
          `El. paštas: ${elPastas}`,
          telefonas ? `Telefonas: ${telefonas}` : null,
          '',
          '—',
          'Patvirtinta, kad registruoja tėvai arba globėjai.',
          saltinis ? `Užsakyta iš: ${saltinis}` : null,
          `${svetaine.url}/admin/collections/rezervacijos`,
        ]
          .filter((e): e is string => e !== null)
          .join('\n'),
      })
    } catch (klaida) {
      console.error('[rezervacija] pranešimo sau išsiųsti nepavyko:', klaida)
    }

    try {
      await siuntejas.sendMail({
        from: `"${kontaktai.vardas} · ${svetaine.pavadinimas}" <${pastas.user}>`,
        to: elPastas,
        replyTo: pastas.gavejas,
        subject: `Laikas rezervuotas — ${kada}`,
        text: [
          `Sveiki, ${tevoVardas},`,
          '',
          `gavau užklausą pamokai ${kada}. Netrukus susisieksiu ir patvirtinsiu.`,
          '',
          'Jei laikas nebetiktų, tiesiog atsakykite į šį laišką.',
          '',
          '—',
          `${kontaktai.vardas}, ${kontaktai.pareigos}`,
          kontaktai.telefonas,
          svetaine.url.replace('https://', ''),
        ].join('\n'),
      })
    } catch (klaida) {
      console.error('[rezervacija] patvirtinimo lankytojui išsiųsti nepavyko:', klaida)
    }
  } else {
    console.error('[rezervacija] SMTP nesukonfigūruotas — užsakymas įrašytas be laiškų.')
  }

  return {
    bukle: 'pavyko',
    pranesimas: `Ačiū — laikas ${kada} rezervuotas. Susisieksiu ir patvirtinsiu.`,
  }
}
