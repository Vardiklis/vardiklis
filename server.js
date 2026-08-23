// Įėjimo failas Node.js serveriui (Hostinger „Other“ presetas ieško jo šaknyje).
//
// Tikrasis serveris sugeneruojamas per `npm run build` į .next/standalone/server.js.
// Jis pats persijungia į savo katalogą ir skaito PORT bei HOSTNAME kintamuosius,
// todėl čia tik patikrinam, ar jis pastatytas, ir perduodam valdymą.

const { existsSync } = require('node:fs')
const path = require('node:path')

const serveris = path.join(__dirname, '.next', 'standalone', 'server.js')

if (!existsSync(serveris)) {
  console.error(
    'Nerastas .next/standalone/server.js.\n' +
      'Pirma paleisk `npm run build` — jis sukuria savarankišką serverį.',
  )
  process.exit(1)
}

require(serveris)
