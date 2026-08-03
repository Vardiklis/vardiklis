/**
 * Diagnostikos simuliacija — Fazės 5 priėmimo kriterijus.
 *
 * Pravažiuoja testą scenarijais: viskas teisingai, viskas neteisingai ir
 * mišriai (vaikas iš tikrųjų nemoka konkrečios temos). Visais atvejais
 * ataskaita turi būti prasminga.
 *
 * Paleidimas:  npm run patikra:diagnostika
 */

import {
  ataskaita,
  atsakyk,
  dabartinisUzdavinys,
  pradek,
  type Busena,
} from '../lib/diagnostika'
import { temos } from '../lib/temos'

/** Ar vaikas moka temą: ne, jei ji pati arba kuri nors jos prielaida sugedusi. */
function moka(temaId: string, sugede: Set<string>): boolean {
  if (sugede.has(temaId)) return false
  const t = temos.find((x) => x.id === temaId)
  return (t?.priklausoNuo ?? []).every((p) => moka(p, sugede))
}

function pravaziuok(klase: number, arTeisingai: (temaId: string) => boolean): Busena {
  let b = pradek(klase)
  let apsauga = 0

  while (!b.baigta && apsauga < 100) {
    apsauga += 1
    const u = dabartinisUzdavinys(b)
    if (!u) break
    b = atsakyk(b, arTeisingai(u.temaId))
  }

  return b
}

function spausdink(pavadinimas: string, b: Busena): void {
  const a = ataskaita(b)
  console.log(`\n─────────── ${pavadinimas} ───────────`)
  console.log(`Uždavinių duota: ${a.isVisoUzdaviniu} (riba 24)`)
  console.log(`Išlaikyta:    ${a.islaikytos.map((t) => t.id).join(', ') || '—'}`)
  console.log(`Neišlaikyta:  ${a.neislaikytos.map((t) => t.id).join(', ') || '—'}`)
  console.log(`ŠAKNINĖS:     ${a.saknines.map((t) => `${t.id} (${t.klase} kl.)`).join(', ') || '—'}`)
  console.log(`Blokuoja:     ${a.blokuojamos.map((t) => t.id).join(', ') || '—'}`)
  console.log(`Savaitės:     ${a.savaites}`)
  console.log('Grandinė:')
  if (a.grandine.length === 0) {
    console.log('   (tuščia)')
  }
  for (const z of a.grandine) {
    const zyme = z.saknis ? '◆ ŠAKNIS' : z.rezultatas === 'neislaikyta' ? '✗' : '✓'
    console.log(`   ${zyme}  ${z.tema.pavadinimas} (${z.tema.klase} kl.) — ${z.rezultatas}`)
  }

  // Sveiko proto patikros
  const klaidos: string[] = []
  if (a.isVisoUzdaviniu > 24) klaidos.push('viršyta 24 uždavinių riba')
  if (a.neislaikytos.length > 0 && a.saknines.length === 0) {
    klaidos.push('yra neišlaikytų temų, bet nerasta nė vienos šaknies')
  }
  if (a.saknines.length > 0 && a.grandine.length === 0) {
    klaidos.push('rasta šaknis, bet grandinė tuščia')
  }
  for (const t of a.saknines) {
    if (t.priklausoNuo.some((p) => a.neislaikytos.some((n) => n.id === p))) {
      klaidos.push(`šaknis ${t.id} turi neišlaikytą prielaidą`)
    }
  }
  if (klaidos.length > 0) {
    console.log(`   ⚠ ${klaidos.join('; ')}`)
    process.exitCode = 1
  }
}

for (const klase of [5, 7, 9]) {
  spausdink(`${klase} kl. — viskas teisingai`, pravaziuok(klase, () => true))
  spausdink(`${klase} kl. — viskas neteisingai`, pravaziuok(klase, () => false))
}

// Mišrus: vaikas iš tikrųjų nemoka bendravardiklinimo. Tai landing puslapio
// scenarijus — diagnostika privalo nurodyti būtent jį, o ne 7 klasės lygtis.
const sugede = new Set(['bendravardiklinimas'])
spausdink(
  '7 kl. — tikroji spraga: bendravardiklinimas',
  pravaziuok(7, (temaId) => moka(temaId, sugede)),
)

const sugede2 = new Set(['neigiami-skaiciai'])
spausdink(
  '7 kl. — tikroji spraga: neigiami skaičiai',
  pravaziuok(7, (temaId) => moka(temaId, sugede2)),
)

const sugede3 = new Set(['daugyba-dalyba'])
spausdink(
  '9 kl. — tikroji spraga: daugyba ir dalyba (3 kl.)',
  pravaziuok(9, (temaId) => moka(temaId, sugede3)),
)

if (process.exitCode) {
  console.log('\n✗ Yra problemų.')
} else {
  console.log('\n✓ Visi scenarijai davė prasmingą ataskaitą.')
}
