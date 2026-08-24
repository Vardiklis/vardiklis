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
import { tema, temos } from '../lib/diagnostikos-temos'
import { sritisKlasei, uzRibos } from '../lib/generatoriai/sritis'

/** Ar vaikas moka temą: ne, jei ji pati arba kuri nors jos prielaida sugedusi. */
function moka(temaId: string, sugede: Set<string>): boolean {
  if (sugede.has(temaId)) return false
  const t = temos.find((x) => x.id === temaId)
  return (t?.priklausoNuo ?? []).every((p) => moka(p, sugede))
}

/**
 * Ar testo uždaviniai tikrai iš tos temos bibliotekos.
 *
 * Tai svarbiausia šio failo patikra: anksčiau diagnostika turėjo savo
 * generatorius, ir trečiokas gaudavo uždavinių, kurių jo programoje nėra.
 * Tikrinama trys dalykai — uždavinys iš tikrinamos temos potemės, jo skaičiai
 * telpa į tos klasės sritį, ir trys temos uždaviniai yra iš skirtingų potemių.
 */
function patikrinkUzdaviniuKilme(klase: number): string[] {
  const klaidos: string[] = []
  let b = pradek(klase)
  let apsauga = 0

  while (!b.baigta && apsauga < 200) {
    apsauga += 1
    if (!b.dabartine) break
    const t = tema(b.dabartine.temaId)
    if (!t) {
      klaidos.push(`nežinoma tema "${b.dabartine.temaId}"`)
      break
    }

    const leistini = new Set(t.generatoriai)
    const riba = t.skaiciuSritis ?? sritisKlasei(t.klase)
    const isKur = new Set<string>()

    for (const u of b.dabartine.uzdaviniai) {
      isKur.add(u.temaId)
      if (!leistini.has(u.temaId)) {
        klaidos.push(`${t.id} „${t.pavadinimas}": uždavinys iš svetimo generatoriaus "${u.temaId}"`)
      }
      if (riba) {
        const blogi = uzRibos(u, riba)
        if (blogi.length > 0) {
          klaidos.push(
            `${t.id} „${t.pavadinimas}" (${t.klase} kl.): skaičiai ${[...new Set(blogi)].slice(0, 3).join(', ')} nepatenka į [${riba.min}, ${riba.max}]`,
          )
        }
      }
    }

    // Trys uždaviniai turi ateiti iš trijų skirtingų potemių, jei tema jų tiek turi.
    const laukiama = Math.min(b.dabartine.uzdaviniai.length, t.generatoriai.length)
    if (isKur.size < laukiama) {
      klaidos.push(
        `${t.id} „${t.pavadinimas}": ${b.dabartine.uzdaviniai.length} uždaviniai tik iš ${isKur.size} potemių`,
      )
    }

    // Raidinis atsakymas be to, iš ko rinktis, yra neatsakomas uždavinys —
    // būtent taip diagnostikoje atrodė pasirenkamojo atsakymo uždaviniai, kol
    // testo ekranas variantų nepiešė.
    for (const u of b.dabartine.uzdaviniai) {
      if (u.formatas === 'pasirinkimas') {
        if (!u.variantai || u.variantai.length < 3) {
          klaidos.push(`${t.id}: pasirenkamasis uždavinys be variantų — "${u.klausimas.slice(0, 50)}"`)
        }
        if (!/^[a-e]$/.test(u.atsakymas)) {
          klaidos.push(`${t.id}: pasirenkamojo atsakymas nėra raidė — "${u.atsakymas}"`)
        }
      }
      if (u.formatas === 'poros' && (!u.poros || u.poros.length < 2)) {
        klaidos.push(`${t.id}: porų uždavinys be porų — "${u.klausimas.slice(0, 50)}"`)
      }
      if (u.formatas === 'eiliskumas' && (!u.elementai || u.elementai.length < 2)) {
        klaidos.push(`${t.id}: eiliškumo uždavinys be elementų — "${u.klausimas.slice(0, 50)}"`)
      }
    }

    const u = dabartinisUzdavinys(b)
    if (!u) break
    // Atsakoma teisingai kas antrą kartą — taip pravažiuojama ir plotyje, ir gilyn.
    b = atsakyk(b, apsauga % 2 === 0)
  }

  return klaidos
}

function pravaziuok(klase: number, arTeisingai: (temaId: string) => boolean): Busena {
  let b = pradek(klase)
  let apsauga = 0

  while (!b.baigta && apsauga < 200) {
    apsauga += 1
    const u = dabartinisUzdavinys(b)
    if (!u || !b.dabartine) break
    // Sprendžiama pagal tikrinamą TEMĄ, o ne pagal uždavinio `temaId`: pastarasis
    // dabar yra potemės generatoriaus raktas, nes uždaviniai imami iš bibliotekos.
    b = atsakyk(b, arTeisingai(b.dabartine.temaId))
  }

  return b
}

function spausdink(pavadinimas: string, b: Busena): void {
  const a = ataskaita(b)
  console.log(`\n─────────── ${pavadinimas} ───────────`)
  console.log(`Uždavinių duota: ${a.isVisoUzdaviniu} (turi būti 25)`)
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
  // Uždavinių skaičius fiksuotas: kiekvienas testas duoda lygiai tiek pat.
  if (a.isVisoUzdaviniu !== 25) klaidos.push(`duota ${a.isVisoUzdaviniu} uždavinių, o turi būti 25`)
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

// ── Uždavinių kilmė ────────────────────────────────────────────────────────

console.log('─────────── Uždavinių kilmė ir mastas ───────────')
for (const klase of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
  // Kelis kartus: temos ir potemės renkamos atsitiktinai, tad vienas
  // pravažiavimas patikrintų tik dalį bibliotekos.
  const klaidos = [1, 2, 3].flatMap(() => patikrinkUzdaviniuKilme(klase))
  if (klaidos.length > 0) {
    console.log(`   ⚠ ${klase} kl.: ${[...new Set(klaidos)].slice(0, 5).join('; ')}`)
    process.exitCode = 1
  } else {
    console.log(`   ✓ ${klase} kl. — visi uždaviniai iš tikrinamos temos potemių`)
  }
}

// Visos klasės, o ne tik trys: pirmokas ir antrokas anksčiau grafe neturėjo
// nieko ir gaudavo trečios klasės uždavinius.
for (const klase of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
  spausdink(`${klase} kl. — viskas teisingai`, pravaziuok(klase, () => true))
  spausdink(`${klase} kl. — viskas neteisingai`, pravaziuok(klase, () => false))
}

// Mišrus: vaikas iš tikrųjų nemoka veiksmų su trupmenomis (5 kl.). Tai landing
// puslapio scenarijus — diagnostika privalo nurodyti būtent jį, o ne 7 klasės
// nelygybes.
spausdink(
  '7 kl. — tikroji spraga: veiksmai su trupmenomis (5.5)',
  pravaziuok(7, (temaId) => moka(temaId, new Set(['5.5']))),
)

spausdink(
  '7 kl. — tikroji spraga: racionaliųjų skaičių sudėtis (6.2)',
  pravaziuok(7, (temaId) => moka(temaId, new Set(['6.2']))),
)

spausdink(
  '9 kl. — tikroji spraga: daugyba ir dalyba (2.7)',
  pravaziuok(9, (temaId) => moka(temaId, new Set(['2.7']))),
)

if (process.exitCode) {
  console.log('\n✗ Yra problemų.')
} else {
  console.log('\n✓ Visi scenarijai davė prasmingą ataskaitą.')
}
