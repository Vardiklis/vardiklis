/**
 * SMTP patikra — ar registracijos formos laiškai tikrai išeina.
 *
 * Prisijungia tais pačiais kintamaisiais kaip `lib/pastas.ts` ir išsiunčia vieną
 * bandomąjį laišką. Skirta paleisti PRIEŠ diegimą: kitaip pirmoji tikra užklausa
 * tampa testu, o lankytojas — bandomuoju triušiu.
 *
 * Paleidimas:  npm run patikra:pastas
 *
 * Kintamuosius ima iš `.env` (Node 22 `--env-file`). Serveryje tie patys
 * kintamieji suvedami hPanel'e — žr. README „Aplinkos kintamieji".
 */

import { pastoNustatymai, pastoSiuntejas } from '../lib/pastas'

const nustatymai = pastoNustatymai()

if (!nustatymai) {
  console.error('✖ Trūksta SMTP_USER arba SMTP_PASS.')
  console.error('  Vietinei patikrai jie rašomi į `.env` (git jo neseka).')
  process.exit(1)
}

console.log(`→ ${nustatymai.host}:${nustatymai.port} kaip ${nustatymai.user}`)

const siuntejas = pastoSiuntejas(nustatymai)

try {
  // `verify` patikrina TLS ir prisijungimą atskirai nuo siuntimo — taip iš karto
  // aišku, ar kaltas slaptažodis, ar užblokuotas prievadas.
  await siuntejas.verify()
  console.log('✓ Prisijungimas ir slaptažodis tinka.')

  const laiskas = await siuntejas.sendMail({
    from: `"Vardiklis" <${nustatymai.user}>`,
    to: nustatymai.gavejas,
    subject: 'Bandomasis laiškas iš Vardiklio',
    text: [
      'Jei šitą matai — registracijos formos laiškai išeina.',
      '',
      `Siuntėjas: ${nustatymai.user}`,
      `Gavėjas:   ${nustatymai.gavejas}`,
      `Serveris:  ${nustatymai.host}:${nustatymai.port}`,
    ].join('\n'),
  })

  console.log(`✓ Išsiųsta į ${nustatymai.gavejas} (${laiskas.messageId})`)
  console.log('  Patikrink ir šlamšto aplanką — pirmas laiškas mėgsta nukeliauti ten.')
  process.exit(0)
} catch (klaida) {
  console.error('✖ Nepavyko:', klaida instanceof Error ? klaida.message : klaida)
  console.error('')
  console.error("  „Invalid login\" arba 535 — Gmail'ui reikia App password, ne paskyros")
  console.error('  slaptažodžio (Google paskyra → Security → App passwords).')
  console.error('  ECONNREFUSED su adresu „2a00:…" — mašinos IPv6 neveikia. Numatytas 587')
  console.error('  tokiu atveju pats persijungia į IPv4; jei įrašytas SMTP_PORT=465 — ištrink.')
  process.exit(1)
}
