/**
 * Vietinis CMS su netikrais duomenimis.
 *
 *   npm run dev:mock            — paleidžia; pirmą kartą pats sukuria duomenis
 *   npm run mock:is-naujo       — ištrina mock bazę, sukuria iš naujo ir paleidžia
 *   npm run dev:mock -- -p 3001 — kiti argumentai keliauja `next dev`
 *
 * VISKAS GYVENA `mock/` KATALOGE: bazė, įkelti failai, dienyno failai. Jis
 * git'e ignoruojamas, tad su `git push` niekur nenukeliauja, o tikros bazės
 * (`DATABASE_URI` iš `.env` ar serverio) šis režimas neliečia niekada.
 *
 * KINTAMIEJI NUSTATOMI ČIA, NE `.env`. Next `.env` jau nustatytų kintamųjų
 * neperrašo, tad tuščias `SMTP_PASS` čia lieka tuščias, net jei `.env` jį turi.
 * O paštą ir i.SAF dar užrakina ir pats kodas (`lib/mock.ts`).
 */
import { spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const saknis = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const katalogas = path.join(saknis, 'mock')
const baze = path.join(katalogas, 'vardiklis.db')

Object.assign(process.env, {
  VARDIKLIS_MOCK: '1',
  DATABASE_URI: `file:${baze}`,
  UPLOADS_DIR: path.join(katalogas, 'ikelta'),
  DIENYNO_FAILU_DIR: path.join(katalogas, 'dienyno-failai'),
  // Savas, kad mock sesija nebūtų galiojanti su tikru raktu ir atvirkščiai.
  PAYLOAD_SECRET: 'vardiklis-mock-tik-vietoje',
  // Tas pats, kas `MOCK_PRIMINIMU_RAKTAS` faile `lib/mock.ts`.
  PRIMINIMU_RAKTAS: 'mock',
  SMTP_USER: '',
  SMTP_PASS: '',
  ISAF_SERTIFIKATAS: '',
  ISAF_RAKTAS: '',
  ISAF_RAKTO_SLAPTAZODIS: '',
})

const NAUJI = '--is-naujo'
const TIK_DUOMENYS = '--tik-duomenys'
const argumentai = process.argv.slice(2)

if (argumentai.includes(NAUJI) || !existsSync(baze)) {
  const r = spawnSync('npx', ['tsx', 'scripts/kurk-mock.ts'], {
    cwd: saknis,
    stdio: 'inherit',
    env: process.env,
  })
  if (r.status !== 0) process.exit(r.status ?? 1)
}
if (argumentai.includes(TIK_DUOMENYS)) process.exit(0)

const portas = argumentai[argumentai.indexOf('-p') + 1] ?? '3000'
console.log(`
  ┌─ MOCK ──────────────────────────────────────────────────────────────
  │ CMS:        http://localhost:${portas}/admin  (prisijungiama automatiškai)
  │ Kalendorius: http://localhost:${portas}/admin/kalendorius
  │ Dienynas:   http://localhost:${portas}/dienynas  (ugne / ugne-1234)
  │ Priminimai: http://localhost:${portas}/vidus/priminimai?raktas=mock
  │ Laiškai NEIŠEINA — jie spausdinami čia, terminale.
  └─────────────────────────────────────────────────────────────────────
`)

const dev = spawn(
  'npx',
  ['next', 'dev', ...argumentai.filter((a) => a !== NAUJI && a !== TIK_DUOMENYS)],
  { cwd: saknis, stdio: 'inherit', env: process.env },
)
dev.on('exit', (kodas) => process.exit(kodas ?? 0))
