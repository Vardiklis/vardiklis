import type { Lygis, Sritis } from './generatoriai'
import { potemes, programa, temosGeneratoriai } from './programa'
import { TEMU_PRIELAIDOS, TEMU_SRITYS, type MokomojiSritis } from './temu-sritys'

/**
 * Diagnostikos temos — išvestos iš programos, o ne surašytos atskirai.
 *
 * Anksčiau diagnostika turėjo savo vienuolikos temų grafą su bendraisiais
 * generatoriais. Dėl to trečiokas gaudavo uždavinių, kurių jo programoje nėra,
 * o pirmokui ir antrokui grafas neturėjo nieko — testas nusileisdavo iki
 * trečios klasės daugybos. Dabar tikrinimo vienetas yra programos tema, o
 * uždaviniai imami iš jos potemių, tad jie atitinka ir klasę, ir temą, ir
 * potemę.
 *
 * Prielaidų grandinė kiekvienoje srityje yra tiesinė: tema remiasi į
 * ankstesnę tos pačios srities temą — pirmiausia savo klasėje, o jei tokios
 * nėra, artimiausioje žemesnėje. Todėl leidžiantis žemyn einama viena aiškia
 * gija (nelygybės → lygtys → reiškiniai → …), o ne šakojamasi po visą klasę.
 */

export type Tema = {
  /** „7.4“ — klasė ir temos numeris, toks pat kaip programoje. */
  id: string
  pavadinimas: string
  klase: number
  numeris: number
  sritis: MokomojiSritis
  /** Temų id, kurias reikia mokėti prieš šią. */
  priklausoNuo: string[]
  /** Potemių generatoriai — iš jų sudaromi tikrinimo uždaviniai. */
  generatoriai: string[]
  /** Kiek potemių tema turi. */
  potemiu: number
  /** Temos numatytasis sunkumas programoje. */
  lygis: Lygis
  /** Skaičių riba, už kurios negali atsidurti nė vienas uždavinio skaičius. */
  skaiciuSritis?: Sritis
}

/** Temos be prielaidų — jos pridedamos antru ėjimu. */
type Juodrastis = Omit<Tema, 'priklausoNuo'>

function juodrasciai(): Juodrastis[] {
  const eilute: Juodrastis[] = []
  for (const k of programa) {
    for (const t of k.temos) {
      const id = `${k.klase}.${t.numeris}`
      const sritis = TEMU_SRITYS[id]
      // Be srities tema į grandinę neįtraukiama: kitaip ji kabotų viena ir
      // diagnostika nuo jos neturėtų kur leistis. Auditas tokių neprileidžia.
      if (!sritis) continue
      eilute.push({
        id,
        pavadinimas: t.pavadinimas,
        klase: k.klase,
        numeris: t.numeris,
        sritis,
        generatoriai: temosGeneratoriai(t),
        potemiu: potemes(t).length,
        lygis: t.lygis ?? 2,
        skaiciuSritis: t.sritis,
      })
    }
  }
  return eilute
}

/**
 * Tos pačios srities tema artimiausioje ŽEMESNĖJE klasėje.
 *
 * Žingsnis tyčia yra visa klasė, o ne gretima tos pačios klasės tema. Kiekvienas
 * nusileidimo žingsnis kainuoja tris uždavinius, o testas jų turi dvidešimt
 * penkis; jei žingsnis būtų viena tema, devintokas iki antros klasės daugybos
 * nenusileistų niekada — pritrūktų uždavinių dar savo klasėje. Su klasės
 * žingsniu kelias nuo dešimtos klasės iki pirmos telpa į devynis žingsnius.
 *
 * Sritis, kurios kurioje nors klasėje visai nėra (matai penktoje–septintoje),
 * grandinės nenutraukia: ieškoma artimiausios žemesnės klasės, kurioje ta
 * sritis yra.
 *
 * Ryšius tos pačios klasės viduje, kur jie svarbūs, surašom rankomis —
 * `TEMU_PRIELAIDOS`.
 */
function ankstesne(visos: Juodrastis[], t: Juodrastis): string[] {
  const zemesnes = visos.filter((x) => x.sritis === t.sritis && x.klase < t.klase)
  if (zemesnes.length === 0) return []

  const artimiausiaKlase = Math.max(...zemesnes.map((x) => x.klase))
  const paskutine = zemesnes
    .filter((x) => x.klase === artimiausiaKlase)
    .sort((a, b) => a.numeris - b.numeris)
    .pop()
  return paskutine ? [paskutine.id] : []
}

export const temos: Tema[] = (() => {
  const visos = juodrasciai()
  const esamos = new Set(visos.map((t) => t.id))
  return visos.map((t) => {
    // Automatinė grandinė plius rankomis surašyti sritis kertantys ryšiai.
    const papildomos = (TEMU_PRIELAIDOS[t.id] ?? []).filter(
      (id) => esamos.has(id) && id !== t.id,
    )
    return { ...t, priklausoNuo: [...new Set([...ankstesne(visos, t), ...papildomos])] }
  })
})()

/** Tema pagal id. */
export function tema(id: string): Tema | undefined {
  return temos.find((t) => t.id === id)
}

/** Visos nurodytos klasės temos programos tvarka. */
export function klasesTemos(klase: number): Tema[] {
  return temos.filter((t) => t.klase === klase)
}
