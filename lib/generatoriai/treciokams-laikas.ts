import { atsitiktinis, naujasId, pasirink, sumaisyk } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys } from './formatai'
import { kalendorius, tvarkarastis, type TvarkarascioEilute } from './treciokams-matai-vaizdai'
import { duLaikrodziai } from './vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 3 klasės tema „Laikas“ — trys potemės.
 *
 * Anksčiau visos trys rėmėsi bendruoju `laikas` generatoriumi, kuris duodavo
 * sekundes ir laiko vienetų vertimą; tvarkaraščio ir kalendoriaus skaitymo,
 * kurie čia ir yra mokomi, jame nebuvo išvis.
 *
 * Trukmė skaičiuojama peržengiant valandą — kaip tik ties tuo trečiokas ir
 * klysta: nuo 12:45 iki 13:15 yra ne 45, o 30 minučių.
 */

const SAVAITES_DIENOS = [
  'pirmadienis',
  'antradienis',
  'trečiadienis',
  'ketvirtadienis',
  'penktadienis',
  'šeštadienis',
  'sekmadienis',
] as const

const MENESIAI = [
  { vardas: 'sausis', kilm: 'sausio', dienu: 31 },
  { vardas: 'vasaris', kilm: 'vasario', dienu: 28 },
  { vardas: 'kovas', kilm: 'kovo', dienu: 31 },
  { vardas: 'balandis', kilm: 'balandžio', dienu: 30 },
  { vardas: 'gegužė', kilm: 'gegužės', dienu: 31 },
  { vardas: 'birželis', kilm: 'birželio', dienu: 30 },
  { vardas: 'liepa', kilm: 'liepos', dienu: 31 },
  { vardas: 'rugpjūtis', kilm: 'rugpjūčio', dienu: 31 },
  { vardas: 'rugsėjis', kilm: 'rugsėjo', dienu: 30 },
  { vardas: 'spalis', kilm: 'spalio', dienu: 31 },
  { vardas: 'lapkritis', kilm: 'lapkričio', dienu: 30 },
  { vardas: 'gruodis', kilm: 'gruodžio', dienu: 31 },
] as const

/** Minutės nuo vidurnakčio → „8:45“. */
function laikas(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}:${String(m).padStart(2, '0')}`
}

/** „1 valanda 30 minučių“ arba „45 minutės“ — kaip atsakoma pamokoje. */
function trukme(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} val`
  return `${h} val ${m} min`
}

// ── 5.1 Kaip apskaičiuoti įvykio trukmę? ────────────────────────────────────

const A_TRUKME = [
  {
    klausimas: 'Pamoka prasidėjo 8:00, baigėsi 8:45. Kiek minučių truko pamoka?',
    atsakymas: '45',
    atsakymasRodymui: '$45$ min',
    sprendimas: 'Nuo 8:00 iki 8:45 praeina 45 minutės.',
  },
] as const

export const ivykioTrukme: Generatorius = () => suBandymais(kurkTrukme, A_TRUKME, 'ivykio-trukme')

function kurkTrukme(): Uzdavinys | null {
  return variacija([
    // 1. Trukmė toje pačioje valandoje
    () => {
      const pradzia = atsitiktinis(8, 16) * 60 + atsitiktinis(0, 3) * 5
      const truko = atsitiktinis(3, 9) * 5
      if ((pradzia % 60) + truko >= 60) return null
      return uzdavinys('ivykio-trukme', {
        klausimas: `Pamoka prasidėjo ${laikas(pradzia)}, baigėsi ${laikas(
          pradzia + truko,
        )}. Kiek minučių ji truko?`,
        atsakymas: String(truko),
        atsakymasRodymui: `$${truko}$ min`,
        sprendimas: `Valanda ta pati, tad atimamos minutės: $${(pradzia % 60) + truko} - ${
          pradzia % 60
        } = ${truko}$.`,
      })
    },

    // 2. Trukmė peržengiant valandą
    () => {
      const pradzia = atsitiktinis(8, 16) * 60 + atsitiktinis(5, 11) * 5
      const truko = atsitiktinis(4, 10) * 5
      if ((pradzia % 60) + truko < 60) return null
      return uzdavinys('ivykio-trukme', {
        klausimas: `Filmas prasidėjo ${laikas(pradzia)} ir baigėsi ${laikas(
          pradzia + truko,
        )}. Kiek minučių jis truko?`,
        atsakymas: String(truko),
        atsakymasRodymui: `$${truko}$ min`,
        sprendimas: `Iki pilnos valandos liko ${60 - (pradzia % 60)} min, po jos praeina dar ${
          truko - (60 - (pradzia % 60))
        } min: $${60 - (pradzia % 60)} + ${truko - (60 - (pradzia % 60))} = ${truko}$.`,
      })
    },

    // 3. Trukmė iš dviejų laikrodžių
    () => {
      const pradzia = atsitiktinis(9, 15) * 60 + atsitiktinis(0, 5) * 10
      const truko = atsitiktinis(3, 5) * 15
      return uzdavinys('ivykio-trukme', {
        // Laikai užrašyti tik ant laikrodžių — juos reikia nuskaityti.
        klausimas: 'Kiek minučių truko įvykis, kurio pradžią ir pabaigą rodo laikrodžiai?',
        atsakymas: String(truko),
        atsakymasRodymui: `$${truko}$ min`,
        sprendimas: `Nuo ${laikas(pradzia)} iki ${laikas(pradzia + truko)} praeina ${truko} min.`,
        brezinys: duLaikrodziai(pradzia, pradzia + truko, 'pradžia', 'pabaiga'),
      })
    },

    // 4. Ilgesnė nei valanda trukmė
    () => {
      const pradzia = atsitiktinis(15, 18) * 60 + atsitiktinis(1, 11) * 5
      const truko = 60 + atsitiktinis(2, 10) * 5
      return uzdavinys('ivykio-trukme', {
        klausimas: `Treniruotė prasidėjo ${laikas(pradzia)} ir baigėsi ${laikas(
          pradzia + truko,
        )}. Kiek ji truko? Atsakymą užrašyk minutėmis.`,
        atsakymas: String(truko),
        atsakymasRodymui: `$${truko}$ min (${trukme(truko)})`,
        sprendimas: `Nuo ${laikas(pradzia)} iki ${laikas(
          pradzia + 60,
        )} praeina valanda, o toliau dar ${truko - 60} min.`,
      })
    },

    // 5. Kelinta valanda bus
    () => {
      const pradzia = atsitiktinis(7, 9) * 60 + atsitiktinis(0, 11) * 5
      const truko = atsitiktinis(3, 9) * 5
      return uzdavinys('ivykio-trukme', {
        klausimas: `Mokinys iš namų išėjo ${laikas(
          pradzia,
        )} ir į mokyklą atėjo po ${truko} minučių. Kelintą valandą jis atėjo?`,
        atsakymas: laikas(pradzia + truko),
        atsakymasRodymui: laikas(pradzia + truko),
        sprendimas: `Prie ${laikas(pradzia)} pridedama ${truko} min — gaunama ${laikas(
          pradzia + truko,
        )}.`,
      })
    },

    // 6. Klaidos radimas
    () => {
      const pradzia = 12 * 60 + 45
      const pabaiga = 13 * 60 + 15
      return pasirinkimoUzdavinys(naujasId('ivykio-trukme'), 'ivykio-trukme', {
        klausimas: 'Mokinys sako, kad nuo 12:45 iki 13:15 yra 45 minutės. Kur klaida?',
        variantai: [
          'iš tikrųjų yra 30 min: 15 min iki 13:00 ir dar 15 min',
          'iš tikrųjų yra 60 min, nes pasikeitė valanda',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Nuo ${laikas(pradzia)} iki ${laikas(pabaiga)} praeina ${
          pabaiga - pradzia
        } minutės.`,
      })
    },

    // 7. Kuris renginys ilgesnis
    () => {
      const a1 = atsitiktinis(9, 11) * 60 + atsitiktinis(0, 11) * 5
      const t1 = atsitiktinis(5, 11) * 5
      const a2 = atsitiktinis(12, 15) * 60 + atsitiktinis(0, 11) * 5
      const t2 = atsitiktinis(5, 11) * 5
      if (t1 === t2) return null
      return pasirinkimoUzdavinys(naujasId('ivykio-trukme'), 'ivykio-trukme', {
        klausimas: `Pirmas renginys truko nuo ${laikas(a1)} iki ${laikas(
          a1 + t1,
        )}, antras — nuo ${laikas(a2)} iki ${laikas(a2 + t2)}. Kuris truko ilgiau?`,
        variantai:
          t1 > t2
            ? ['pirmas', 'antras', 'truko vienodai']
            : ['antras', 'pirmas', 'truko vienodai'],
        teisingas: 0,
        sprendimas: `Trukmės yra ${t1} min ir ${t2} min.`,
      })
    },

    // 8. Pusvalandis ir ketvirtis
    () => {
      const kuris = pasirink([
        { klausimas: 'Kiek minučių yra pusvalandyje?', atsakymas: 30 },
        { klausimas: 'Kiek minučių yra ketvirtyje valandos?', atsakymas: 15 },
        { klausimas: 'Kiek minučių yra trijuose valandos ketvirčiuose?', atsakymas: 45 },
      ])
      return uzdavinys('ivykio-trukme', {
        klausimas: kuris.klausimas,
        atsakymas: String(kuris.atsakymas),
        atsakymasRodymui: `$${kuris.atsakymas}$ min`,
        sprendimas: `Valandoje 60 minučių: $60 : ${60 / kuris.atsakymas} = ${kuris.atsakymas}$.`,
      })
    },
  ])
}

// ── 5.2 Kaip naudotis tvarkaraščiu? ─────────────────────────────────────────

const PAMOKOS = [
  'Matematika',
  'Lietuvių kalba',
  'Pasaulio pažinimas',
  'Dailė',
  'Kūno kultūra',
  'Muzika',
] as const

const A_TVARKARASTIS = [
  {
    klausimas: 'Būrelis vyksta nuo 14:30 iki 15:15. Kiek minučių jis trunka?',
    atsakymas: '45',
    atsakymasRodymui: '$45$ min',
    sprendimas: 'Nuo 14:30 iki 15:15 praeina 45 minutės.',
  },
] as const

export const tvarkarascioSkaitymas: Generatorius = () =>
  suBandymais(kurkTvarkarasti, A_TVARKARASTIS, 'tvarkarascio-skaitymas')

/** Penkios pamokos po 45 min su 10 min pertraukomis nuo nurodyto laiko. */
function pamokuTvarkarastis(pradzia: number): { eilutes: TvarkarascioEilute[]; laikai: number[] } {
  const pamokos = sumaisyk([...PAMOKOS]).slice(0, 5)
  const eilutes: TvarkarascioEilute[] = []
  const laikai: number[] = []
  let dabar = pradzia
  for (const p of pamokos) {
    eilutes.push({ pavadinimas: p, nuo: laikas(dabar), iki: laikas(dabar + 45) })
    laikai.push(dabar)
    dabar += 55
  }
  return { eilutes, laikai }
}

function kurkTvarkarasti(): Uzdavinys | null {
  return variacija([
    // 1. Kelintą prasideda nurodyta pamoka
    () => {
      const pradzia = 8 * 60
      const { eilutes, laikai } = pamokuTvarkarastis(pradzia)
      const nr = atsitiktinis(2, 5)
      return uzdavinys('tvarkarascio-skaitymas', {
        // Laikai yra tik lentelėje — surasti reikiamą eilutę ir yra uždavinys.
        klausimas: `Kelintą valandą pagal tvarkaraštį prasideda ${nr}-oji pamoka?`,
        atsakymas: laikas(laikai[nr - 1]),
        atsakymasRodymui: laikas(laikai[nr - 1]),
        sprendimas: `Lentelėje ${nr}-oji eilutė prasideda ${laikas(laikai[nr - 1])}.`,
        brezinys: tvarkarastis(eilutes),
      })
    },

    // 2. Kiek trunka viena pamoka
    () => {
      const pradzia = 8 * 60
      const { eilutes } = pamokuTvarkarastis(pradzia)
      return uzdavinys('tvarkarascio-skaitymas', {
        klausimas: 'Kiek minučių pagal tvarkaraštį trunka viena pamoka?',
        atsakymas: '45',
        atsakymasRodymui: '$45$ min',
        sprendimas: 'Kiekviena eilutė rodo 45 minučių pamoką.',
        brezinys: tvarkarastis(eilutes),
      })
    },

    // 3. Kiek trunka pertrauka
    () => {
      const pradzia = 8 * 60
      const { eilutes } = pamokuTvarkarastis(pradzia)
      return uzdavinys('tvarkarascio-skaitymas', {
        klausimas: 'Kiek minučių trunka pertrauka tarp dviejų gretimų pamokų?',
        atsakymas: '10',
        atsakymasRodymui: '$10$ min',
        sprendimas: 'Pamoka baigiasi ir kita prasideda po 10 minučių.',
        brezinys: tvarkarastis(eilutes),
      })
    },

    // 4. Kiek laiko mokykloje
    () => {
      const pradzia = 8 * 60
      const { eilutes, laikai } = pamokuTvarkarastis(pradzia)
      const pabaiga = laikai[4] + 45
      return uzdavinys('tvarkarascio-skaitymas', {
        klausimas: 'Kiek minučių praeina nuo pirmosios pamokos pradžios iki paskutinės pabaigos?',
        atsakymas: String(pabaiga - pradzia),
        atsakymasRodymui: `$${pabaiga - pradzia}$ min (${trukme(pabaiga - pradzia)})`,
        sprendimas: `Nuo ${laikas(pradzia)} iki ${laikas(pabaiga)} praeina ${
          pabaiga - pradzia
        } minutės.`,
        brezinys: tvarkarastis(eilutes),
      })
    },

    // 5. Autobusų tvarkaraštis
    () => {
      const pirmas = atsitiktinis(13, 15) * 60 + atsitiktinis(0, 5) * 10
      const intervalas = atsitiktinis(3, 5) * 5
      const eilutes: TvarkarascioEilute[] = Array.from({ length: 5 }, (_, i) => ({
        pavadinimas: `${i + 1}-asis autobusas`,
        nuo: laikas(pirmas + i * intervalas),
        iki: laikas(pirmas + i * intervalas + 25),
      }))
      return uzdavinys('tvarkarascio-skaitymas', {
        klausimas: 'Kiek minučių praeina tarp dviejų gretimų autobusų išvykimo?',
        atsakymas: String(intervalas),
        atsakymasRodymui: `$${intervalas}$ min`,
        sprendimas: `Nuo ${laikas(pirmas)} iki ${laikas(pirmas + intervalas)} praeina ${intervalas} min.`,
        brezinys: tvarkarastis(eilutes, 'Reisas'),
      })
    },

    // 6. Kuris autobusas tinka
    () => {
      const pirmas = 14 * 60 + atsitiktinis(0, 3) * 10
      const intervalas = 20
      const riba = pirmas + 25
      const eilutes: TvarkarascioEilute[] = Array.from({ length: 4 }, (_, i) => ({
        pavadinimas: `${i + 1}-asis autobusas`,
        nuo: laikas(pirmas + i * intervalas),
        iki: laikas(pirmas + i * intervalas + 25),
      }))
      const tinkamas = eilutes.findIndex((_, i) => pirmas + i * intervalas > riba) + 1
      if (tinkamas < 1) return null
      return uzdavinys('tvarkarascio-skaitymas', {
        klausimas: `Kelintu autobusu reikia važiuoti, jei nori išvykti po ${laikas(riba)}?`,
        atsakymas: String(tinkamas),
        atsakymasRodymui: `$${tinkamas}$-uoju`,
        sprendimas: `Pirmasis išvykimas po ${laikas(riba)} yra ${laikas(
          pirmas + (tinkamas - 1) * intervalas,
        )}.`,
        brezinys: tvarkarastis(eilutes, 'Reisas'),
      })
    },

    // 7. Kam reikalingas tvarkaraštis
    () =>
      pasirinkimoUzdavinys(naujasId('tvarkarascio-skaitymas'), 'tvarkarascio-skaitymas', {
        klausimas: 'Kuo tvarkaraštis padeda planuoti laiką?',
        variantai: [
          'iš anksto rodo, kada kas prasideda ir kiek trunka',
          'pats sutrumpina pamokų trukmę',
          'nurodo, kiek kainuoja kelionė',
        ],
        teisingas: 0,
        sprendimas: 'Tvarkaraštyje surašyti laikai, tad galima suskaičiuoti trukmes iš anksto.',
      }),

    // 8. Klaidos radimas
    () => {
      const isvyksta = 17 * 60 + 5
      const atejo = 17 * 60 + 50
      return pasirinkimoUzdavinys(naujasId('tvarkarascio-skaitymas'), 'tvarkarascio-skaitymas', {
        klausimas: `Traukinys išvyksta ${laikas(isvyksta)}, bet mokinys į stotį atėjo ${laikas(
          atejo,
        )} ir manė, kad suspės. Kur klaida?`,
        variantai: [
          `${laikas(atejo)} yra vėliau negu ${laikas(isvyksta)} — traukinys jau išvykęs`,
          `${laikas(atejo)} yra anksčiau negu ${laikas(isvyksta)}`,
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: `Mokinys pavėlavo ${atejo - isvyksta} minutes.`,
      })
    },
  ])
}

// ── 5.3 Kaip naudotis kalendoriumi? ─────────────────────────────────────────

const A_KALENDORIUS = [
  {
    klausimas: 'Kiek dienų turi savaitė?',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: 'Savaitėje yra septynios dienos.',
  },
] as const

export const kalendoriausSkaitymas: Generatorius = () =>
  suBandymais(kurkKalendoriu, A_KALENDORIUS, 'kalendoriaus-skaitymas')

function kurkKalendoriu(): Uzdavinys | null {
  const menuo = pasirink(MENESIAI)
  const pirmaDiena = atsitiktinis(0, 6)

  return variacija([
    // 1. Kurią savaitės dieną
    () => {
      const diena = atsitiktinis(8, Math.min(24, menuo.dienu))
      const savaitesDiena = SAVAITES_DIENOS[(pirmaDiena + diena - 1) % 7]
      return uzdavinys('kalendoriaus-skaitymas', {
        // Savaitės diena matoma tik kalendoriuje — stulpelį reikia surasti.
        klausimas: `Kurią savaitės dieną pagal kalendorių bus ${diena}-oji mėnesio diena?`,
        atsakymas: savaitesDiena,
        atsakymasRodymui: savaitesDiena,
        sprendimas: `Kalendoriuje ${diena} diena stovi ${savaitesDiena.slice(0, -1)}io stulpelyje.`,
        brezinys: kalendorius(menuo.dienu, pirmaDiena, diena),
      })
    },

    // 2. Po septynių dienų
    () => {
      const diena = atsitiktinis(1, menuo.dienu - 7)
      return uzdavinys('kalendoriaus-skaitymas', {
        klausimas: `Jei šiandien yra ${menuo.kilm} ${diena} d., kuri mėnesio diena bus po 7 dienų?`,
        atsakymas: String(diena + 7),
        atsakymasRodymui: `${menuo.kilm} ${diena + 7} d.`,
        sprendimas: `$${diena} + 7 = ${diena + 7}$. Savaitės diena bus ta pati.`,
      })
    },

    // 3. Kiek dienų tarp dviejų datų
    () => {
      const nuo = atsitiktinis(1, menuo.dienu - 10)
      const iki = nuo + atsitiktinis(4, 10)
      return uzdavinys('kalendoriaus-skaitymas', {
        klausimas: `Kiek dienų praeina nuo ${menuo.kilm} ${nuo} d. iki ${menuo.kilm} ${iki} d.?`,
        atsakymas: String(iki - nuo),
        atsakymasRodymui: `$${iki - nuo}$`,
        sprendimas: `$${iki} - ${nuo} = ${iki - nuo}$.`,
      })
    },

    // 4. Kiek dienų turi mėnuo
    () =>
      uzdavinys('kalendoriaus-skaitymas', {
        klausimas: `Kiek dienų turi ${menuo.vardas}?`,
        atsakymas: String(menuo.dienu),
        atsakymasRodymui: `$${menuo.dienu}$`,
        sprendimas:
          menuo.dienu === 28
            ? 'Vasaris yra trumpiausias mėnuo — jis turi 28 dienas.'
            : `${menuo.vardas.charAt(0).toUpperCase()}${menuo.vardas.slice(1)} turi ${
                menuo.dienu
              } dienas.`,
      }),

    // 5. Renginys po kelių dienų
    () => {
      const diena = atsitiktinis(1, 18)
      const po = atsitiktinis(8, 14)
      if (diena + po > menuo.dienu) return null
      return uzdavinys('kalendoriaus-skaitymas', {
        klausimas: `Mokyklos šventė vyks po ${po} dienų nuo ${menuo.kilm} ${diena} d. Kurią mėnesio dieną ji vyks?`,
        atsakymas: String(diena + po),
        atsakymasRodymui: `${menuo.kilm} ${diena + po} d.`,
        sprendimas: `$${diena} + ${po} = ${diena + po}$.`,
      })
    },

    // 6. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId('kalendoriaus-skaitymas'), 'kalendoriaus-skaitymas', {
        klausimas: 'Mokinys sako, kad po sausio 31 d. eina sausio 32 d. Kur klaida?',
        variantai: [
          'sausis turi 31 dieną, tad toliau eina vasario 1 d.',
          'sausis turi 32 dienas',
          'klaidos nėra',
        ],
        teisingas: 0,
        sprendimas: 'Paskutinė sausio diena yra 31-oji, o po jos prasideda naujas mėnuo.',
      }),

    // 7. Per du mėnesius
    () => {
      const nuo = atsitiktinis(20, 28)
      const po = atsitiktinis(5, 12)
      const birzelis = MENESIAI[5]
      const iki = nuo + po - birzelis.dienu
      if (iki < 1 || nuo > birzelis.dienu) return null
      return uzdavinys('kalendoriaus-skaitymas', {
        klausimas: `Kiek dienų praeina nuo birželio ${nuo} d. iki liepos ${iki} d.?`,
        atsakymas: String(po),
        atsakymasRodymui: `$${po}$`,
        sprendimas: `Iki birželio pabaigos liko ${birzelis.dienu - nuo} dienos, o liepoje dar ${iki}: $${
          birzelis.dienu - nuo
        } + ${iki} = ${po}$.`,
      })
    },

    // 8. Mėnesių skaičius
    () =>
      uzdavinys('kalendoriaus-skaitymas', {
        klausimas: 'Kiek mėnesių yra metuose?',
        atsakymas: '12',
        atsakymasRodymui: '$12$',
        sprendimas: 'Metus sudaro dvylika mėnesių.',
      }),
  ])
}
