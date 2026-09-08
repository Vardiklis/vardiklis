import { centai, isskaidykSuPvm, pridekPvm } from '@/lib/pinigai'

/**
 * Sąskaitos sumos.
 *
 * KODĖL ATSKIRAS MODULIS. Tuos pačius skaičius turi gauti trys vietos:
 * kolekcijos `beforeChange` (kad lentelėje matytųsi teisinga suma), PDF ir
 * i.SAF rinkmena. Jei kiekviena skaičiuotų pati, mokesčių inspekcija gautų
 * vieną skaičių, tėvai — kitą, o kuris teisingas, paaiškėtų per patikrinimą.
 *
 * KODĖL PVM SKAIČIUOJAMAS NUO SUDĖTOS SUMOS, O NE NUO EILUTĖS.
 * Tėvams skelbiama kaina yra 25 € SU PVM — tiek jie ir turi pamatyti sąskaitos
 * apačioje. Skaičiuojant per vienetą, 25 / 1,21 = 20,66 €, keturios pamokos
 * duotų 82,64 € + 17,35 € = 99,99 €, ir tėvai pagrįstai klaustų, kur dingo
 * centas. Todėl eilutėje rodoma tokia kaina, kokia sutarta, o PVM išskiriamas
 * VIENĄ kartą nuo visos to tarifo sumos — taip galutinė suma visada lygi
 * kiekiui, padaugintam iš kainos.
 *
 * Grupuojama pagal PVM kodą, nors šiandien jis sąskaitoje vienas: i.SAF laukia
 * po atskirą `DocumentTotal` kiekvienam kodui, ir kai atsiras antras tarifas,
 * rinkmena neturės pradėti meluoti.
 *
 * Viskas centais — žr. `lib/pinigai.ts`.
 */

export type SumuEilute = {
  kiekis?: number | null
  /** Vieneto kaina TOKIA, KOKIA RODOMA: su PVM arba be, pagal `kainosSuPvm`. */
  kaina?: number | null
  pvmKodas?: string | null
  pvmProc?: number | null
}

export type PvmGrupe = {
  pvmKodas: string
  pvmProc: number
  /** Apmokestinamoji vertė centais — i.SAF `TaxableValue`. */
  bePvm: number
  /** PVM suma centais — i.SAF `Amount`. */
  pvm: number
  isViso: number
}

export type Sumos = {
  grupes: PvmGrupe[]
  bePvm: number
  pvm: number
  isViso: number
  /** Eilučių sumos ta pačia tvarka, kaip paduotos — centais. */
  eiluciuSumos: number[]
}

export function suskaiciuok(eilutes: SumuEilute[], kainosSuPvm: boolean): Sumos {
  const eiluciuSumos: number[] = []
  // `Map` išlaiko įdėjimo tvarką, tad grupės eina taip, kaip pasitaikė eilutėse.
  const pagalKoda = new Map<string, { pvmKodas: string; pvmProc: number; suma: number }>()

  for (const e of eilutes) {
    const kiekis = Number(e.kiekis ?? 0)
    const suma = centai(Number(e.kaina ?? 0)) * kiekis
    eiluciuSumos.push(suma)

    const pvmKodas = (e.pvmKodas ?? '').trim() || 'PVM1'
    const pvmProc = Number(e.pvmProc ?? 0)
    // Kodas IR tarifas: tas pats kodas su kitu tarifu būtų kita eilutė registre.
    const raktas = `${pvmKodas}|${pvmProc}`

    const esama = pagalKoda.get(raktas)
    if (esama) esama.suma += suma
    else pagalKoda.set(raktas, { pvmKodas, pvmProc, suma })
  }

  const grupes: PvmGrupe[] = [...pagalKoda.values()].map((g) => {
    if (kainosSuPvm) {
      const { bePvm, pvm } = isskaidykSuPvm(g.suma, g.pvmProc)
      return { pvmKodas: g.pvmKodas, pvmProc: g.pvmProc, bePvm, pvm, isViso: g.suma }
    }
    const { pvm, isViso } = pridekPvm(g.suma, g.pvmProc)
    return { pvmKodas: g.pvmKodas, pvmProc: g.pvmProc, bePvm: g.suma, pvm, isViso }
  })

  return {
    grupes,
    bePvm: grupes.reduce((s, g) => s + g.bePvm, 0),
    pvm: grupes.reduce((s, g) => s + g.pvm, 0),
    isViso: grupes.reduce((s, g) => s + g.isViso, 0),
    eiluciuSumos,
  }
}
