import { getPayload } from 'payload'
import config from '@payload-config'
import { gautiAtsiskaitymus } from '@/lib/kainos'
import { kontaktai, svetaine } from '@/lib/kontaktai'
import { pastoNustatymai, pastoSiuntejas } from '@/lib/pastas'
import { suformatuok } from '@/lib/pinigai'
import { saskaitosPdf } from '@/lib/saskaitos-pdf'
import { paruoskVaizda } from '@/lib/saskaitos-vaizdas'
import { zymejimoParasas } from '@/lib/priminimai'

/**
 * Sąskaitos siuntimas tėvams.
 *
 * PDF PRISEGAMAS, o ne tik nuoroda: tėvams patogiau turėti failą pašte, o
 * buhalterijai — dokumentą, kuris nedingsta pasikeitus svetainei. Nuoroda vis
 * tiek pridedama, nes priedai kartais nukerpami arba pametami.
 *
 * NUORODA PASIRAŠOMA tuo pačiu HMAC, kaip ir „Buvo / Nebuvo“ žymėjimas
 * (`lib/priminimai.ts`): žinodamas sąskaitos numerį pašalinis jos neatsidarys,
 * o tėvams nereikia jokio slaptažodžio.
 */

/** Ta pati nuoroda tinka ir laiške, ir peržiūroje — todėl sudaroma vienoje vietoje. */
export function saskaitosNuoroda(id: number): string {
  return `${svetaine.url}/vidus/saskaita/${id}?p=${zymejimoParasas(String(id), 'saskaita')}`
}

export type SiuntimoRezultatas = { pavyko: boolean; zinute: string }

export async function siuskSaskaita(id: number): Promise<SiuntimoRezultatas> {
  const payload = await getPayload({ config })
  const n = await gautiAtsiskaitymus()

  const v = await paruoskVaizda(id)

  if (v.busena === 'juodrastis') {
    return { pavyko: false, zinute: 'Pirma išrašykite sąskaitą — juodraštis numerio neturi.' }
  }
  if (v.busena === 'anuliuota') {
    return { pavyko: false, zinute: 'Anuliuota sąskaita nesiunčiama.' }
  }
  if (!v.pirkejas.pastas) {
    return { pavyko: false, zinute: 'Sąskaitoje nėra tėvų el. pašto.' }
  }

  const pastas = pastoNustatymai()
  if (!pastas) {
    return { pavyko: false, zinute: 'SMTP nesukonfigūruotas — siųsti nėra kuo.' }
  }

  const parasas = n.saskaituParasas?.trim()
    ? n.saskaituParasas.trim().split('\n')
    : [`${kontaktai.vardas}, ${kontaktai.pareigos}`, kontaktai.telefonas, kontaktai.elPastas]

  const tekstas = [
    v.pirkejas.vardas && v.pirkejas.vardas !== '—' ? `Sveiki, ${v.pirkejas.vardas},` : 'Sveiki,',
    '',
    n.laiskoTekstas,
    '',
    `Sąskaitos Nr. ${v.numeris}, suma ${suformatuok(v.sumos.isViso)}.`,
    v.terminas ? `Apmokėti iki ${v.terminas}.` : null,
    n.iban ? `Sąskaita pervedimui: ${n.iban}` : null,
    n.iban ? `Mokėjimo paskirtis: ${v.numeris}` : null,
    '',
    `Sąskaitą galima atsidaryti ir čia: ${saskaitosNuoroda(id)}`,
    '',
    '—',
    ...parasas,
  ].filter((e): e is string => e !== null)

  try {
    const pdf = await saskaitosPdf(v)
    const siuntejas = pastoSiuntejas(pastas)

    await siuntejas.sendMail({
      from: `"${v.pardavejas.vardas} · ${svetaine.pavadinimas}" <${pastas.user}>`,
      to: v.pirkejas.pastas,
      replyTo: pastas.gavejas,
      subject: `${n.laiskoTema} (Nr. ${v.numeris})`,
      text: tekstas.join('\n'),
      attachments: [
        {
          // Failo vardas be lietuviškų raidžių: kai kurie pašto klientai juos
          // dar tebeverčia į klaustukus, ir priedas atkeliauja bevardis.
          filename: `Saskaita-${v.numeris}.pdf`,
          content: pdf,
          contentType: 'application/pdf',
        },
      ],
    })

    await payload.update({
      collection: 'saskaitos',
      id,
      overrideAccess: true,
      data: {
        // „Apmokėta“ nenumušam: išsiuntus pakartotinai būsena neturi grįžti atgal.
        busena: v.busena === 'apmoketa' ? 'apmoketa' : 'issiusta',
        issiusta: new Date().toISOString(),
        siuntimoKlaida: null,
      },
    })

    return { pavyko: true, zinute: `Išsiųsta ${v.pirkejas.pastas}.` }
  } catch (klaida) {
    const zinute = String(klaida).slice(0, 300)
    await payload.update({
      collection: 'saskaitos',
      id,
      overrideAccess: true,
      data: { siuntimoKlaida: zinute },
    })
    console.error('[saskaitos] laiško išsiųsti nepavyko:', klaida)
    return { pavyko: false, zinute: `Nepavyko išsiųsti: ${zinute}` }
  }
}
