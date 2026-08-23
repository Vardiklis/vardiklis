import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { galimybiuMedis } from './sestokams-vaizdai'
import { rutuliaiDezeje } from './vaizdai'
import { daznioGrafikas } from './desimtokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 10 klasės tema „Rinkiniai, kombinatorika ir tikimybės“ — septynios potemės.
 *
 * Skaičiai parenkami tokie, kad baigtis būtų galima ir surašyti ranka: taip
 * mokinys gali pasitikrinti derinių formulę sistemingu sąrašu, o ne pasikliauti
 * vien skaičiavimu.
 *
 * Tikimybių atsakymai visur — trupmenos su nedideliais vardikliais arba
 * santykiniai dažniai iš šimto ar tūkstančio bandymų, kad juos būtų galima
 * įrašyti tiksliai.
 */

/** Trupmena KaTeX pavidalu. */
function tr(virsus: string, apacia: string): string {
  return `\\dfrac{${virsus}}{${apacia}}`
}

/** Deriniai $C_n^k$ — kai tvarka nesvarbi. */
function deriniai(n: number, k: number): number {
  let r = 1
  for (let i = 1; i <= k; i += 1) r = (r * (n - k + i)) / i
  return Math.round(r)
}

/** Gretiniai $A_n^k$ — kai tvarka svarbi. */
function gretiniai(n: number, k: number): number {
  let r = 1
  for (let i = 0; i < k; i += 1) r *= n - i
  return r
}

// ── 8.1. Kelių elementų rinkiniai ───────────────────────────────────────────

const T1 = 'elementu-rinkiniai'

const A1 = [
  {
    klausimas: 'Kiek dviejų skirtingų elementų rinkinių galima sudaryti iš aibės $\\{A; B; C\\}$, kai tvarka nesvarbi?',
    atsakymas: '3',
    atsakymasRodymui: '$3$ rinkiniai: $\\{A; B\\}$, $\\{A; C\\}$, $\\{B; C\\}$',
    sprendimas: 'Rinkiniai $\\{A; B\\}$ ir $\\{B; A\\}$ yra tas pats, tad jų skaičiuoti du kartus negalima.',
  },
] as const

export const elementuRinkiniai: Generatorius = () => suBandymais(kurk1, A1, T1)

function kurk1(): Uzdavinys | null {

  return variacija([
    // 1. Poros iš trijų raidžių
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek dviejų skirtingų elementų rinkinių galima sudaryti iš aibės $\\{A; B; C\\}$, kai tvarka nesvarbi?',
        atsakymas: '3',
        atsakymasRodymui: '$3$ rinkiniai: $\\{A; B\\}$, $\\{A; C\\}$, $\\{B; C\\}$',
        sprendimas: 'Rinkiniai $\\{A; B\\}$ ir $\\{B; A\\}$ yra tas pats, tad jų skaičiuoti du kartus negalima.',
      }),

    // 2. Poros su kartojimu
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek dviejų elementų porų galima sudaryti iš skaičių $\\{1; 2; 3\\}$, jei elementai gali kartotis, o tvarka nesvarbi?',
        atsakymas: '6',
        atsakymasRodymui: '$6$ poros',
        sprendimas:
          'Prie trijų porų be kartojimo — $\\{1; 2\\}$, $\\{1; 3\\}$, $\\{2; 3\\}$ — prisideda trys su kartojimu: $\\{1; 1\\}$, $\\{2; 2\\}$, $\\{3; 3\\}$.',
      }),

    // 3. Kas yra rinkinys
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ką reiškia kelių elementų rinkinys, kai tvarka nesvarbi?',
        variantai: [
          'Elementų grupę, kurioje svarbu tik tai, kurie elementai pasirinkti',
          'Elementų eilę, kurioje svarbi kiekvieno vieta',
          'Vieną elementą iš aibės',
          'Visus aibės elementus',
        ],
        teisingas: 0,
        sprendimas: 'Jei tvarka būtų svarbi, tie patys elementai kita eile jau būtų kita baigtis.',
      }),

    // 4. Vaisių rinkiniai
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek skirtingų dviejų vaisių rinkinių galima sudaryti iš obuolio, kriaušės ir banano, jei vaisiai nesikartoja?',
        atsakymas: '3',
        atsakymasRodymui: '$3$ rinkiniai',
        sprendimas: 'Obuolys su kriauše, obuolys su bananu, kriaušė su bananu — daugiau porų nėra.',
      }),

    // 5. Rinkiniai iš dviejų aibių
    () =>
      uzdavinys(T1, {
        klausimas: 'Iš spalvų $\\{$raudona; mėlyna$\\}$ ir dydžių $\\{S; M; L\\}$ sudaromi visi spalvos ir dydžio rinkiniai. Kiek jų yra?',
        atsakymas: '6',
        atsakymasRodymui: '$6$ rinkiniai',
        sprendimas: 'Kiekvieną iš dviejų spalvų galima derinti su bet kuriuo iš trijų dydžių: $2 \\cdot 3 = 6$.',
        brezinys: galimybiuMedis(['raudona', 'mėlyna'], ['S', 'M', 'L'], true),
      }),

    // 6. Trijų elementų rinkiniai
    () =>
      uzdavinys(T1, {
        klausimas: `Kiek $3$ elementų rinkinių galima sudaryti iš aibės $\\{1; 2; 3; 4; 5\\}$, jei tvarka nesvarbi ir elementai nesikartoja?`,
        atsakymas: String(deriniai(5, 3)),
        atsakymasRodymui: `$${deriniai(5, 3)}$ rinkiniai`,
        sprendimas: `Kiekvieną trejetą atitinka vienas neįtrauktų dviejų elementų pasirinkimas, tad rinkinių tiek pat, kiek porų: $${deriniai(5, 3)}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Rinkinius $\\{A; B\\}$ ir $\\{B; A\\}$ mokinys suskaičiavo kaip skirtingus, nors tvarka nesvarbi. Kur klaida?',
        variantai: [
          'Tai tas pats rinkinys, tad jis skaičiuojamas vieną kartą — antraip atsakymas dvigubai per didelis',
          'Klaidos nėra',
          'Tai skirtingi rinkiniai, nes raidės surašytos kita eile',
          'Reikėjo skaičiuoti tris rinkinius',
        ],
        teisingas: 0,
        sprendimas: 'Rinkinį apibrėžia tik jo elementai; jų surašymo eilė nieko nekeičia.',
      }),

    // 8. Knygų pasirinkimas
    () =>
      uzdavinys(T1, {
        klausimas: 'Iš $4$ knygų reikia pasirinkti $2$. Kiek yra skirtingų pasirinkimų, jei tvarka nesvarbi?',
        atsakymas: String(deriniai(4, 2)),
        atsakymasRodymui: `$${deriniai(4, 2)}$ pasirinkimai`,
        sprendimas: 'Surašius sistemingai: $12$, $13$, $14$, $23$, $24$, $34$ — iš viso šeši, nes poros tvarka nesvarbi.',
      }),

    // 9. Su kartojimu ir be jo
    () =>
      uzdavinys(T1, {
        klausimas: 'Iš aibės $\\{1; 2; 3; 4\\}$ pasirenkami du elementai. Kiek daugiau porų gaunama leidžiant kartotis negu neleidžiant?',
        atsakymas: '4',
        atsakymasRodymui: '$10 - 6 = 4$',
        sprendimas: 'Be kartojimo porų yra $6$, su kartojimu prisideda dar keturios vienodų elementų poros, tad iš viso $10$.',
      }),

    // 10. Baigčių aibė
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Iš aibės $\\{1; 2; 3; 4\\}$ renkami du elementai. Susiek sąlygą su rinkinių skaičiumi.',
        poros: [
          { kaire: 'Tvarka nesvarbi, elementai nesikartoja', desine: '$6$' },
          { kaire: 'Tvarka nesvarbi, elementai gali kartotis', desine: '$10$' },
          { kaire: 'Tvarka svarbi, elementai nesikartoja', desine: '$12$' },
        ],
        sprendimas: 'Leidus kartotis, prisideda vienodų elementų poros; ėmus paisyti tvarkos, kiekviena pora skyla į dvi baigtis.',
      }),
  ])
}

// ── 8.2. Elementų tvarka rinkinyje ──────────────────────────────────────────

const T2 = 'elementu-tvarka'

const A2 = [
  {
    klausimas: 'Iš skaitmenų $1$, $2$, $3$ sudaromi visi dviženkliai skaičiai be kartojimo. Kiek jų yra?',
    atsakymas: '6',
    atsakymasRodymui: '$6$ skaičiai',
    sprendimas: 'Pirmajam skaitmeniui yra $3$ pasirinkimai, antrajam lieka $2$: $3 \\cdot 2 = 6$.',
  },
] as const

export const elementuTvarka: Generatorius = () => suBandymais(kurk2, A2, T2)

function kurk2(): Uzdavinys | null {
  return variacija([
    // 1. Ar AB ir BA skirtingi
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Ar kodai $AB$ ir $BA$ laikomi skirtingais, jei svarbi simbolių tvarka?',
        variantai: [
          'Taip — pakeitus tvarką gaunamas kitas kodas',
          'Ne — juose tos pačios raidės',
          'Taip, bet tik jei raidės skirtingos ir kodas trumpas',
          'Priklauso nuo raidžių eilės abėcėlėje',
        ],
        teisingas: 0,
        sprendimas: 'Kai tvarka svarbi, baigtis apibrėžia ne tik elementai, bet ir jų vietos.',
      }),

    // 2. Dviženkliai skaičiai
    () =>
      uzdavinys(T2, {
        klausimas: 'Iš skaitmenų $1$, $2$, $3$ sudaromi visi dviženkliai skaičiai be kartojimo. Kiek jų yra?',
        atsakymas: String(gretiniai(3, 2)),
        atsakymasRodymui: `$${gretiniai(3, 2)}$ skaičiai: $12$, $13$, $21$, $23$, $31$, $32$`,
        sprendimas: 'Pirmajam skaitmeniui yra $3$ pasirinkimai, antrajam lieka $2$.',
      }),

    // 3. Komanda ir pareigos
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kuo skiriasi „pasirinkti du mokinius į komandą“ nuo „paskirti pirmininką ir pavaduotoją“?',
        variantai: [
          'Komandoje tvarka nesvarbi, o skiriant pareigas ji svarbi, tad baigčių dvigubai daugiau',
          'Skirtumo nėra',
          'Komandoje baigčių daugiau',
          'Pareigų skyrimas duoda tiek pat baigčių, kiek ir komanda',
        ],
        teisingas: 0,
        sprendimas: 'Ta pati pora, sukeitus pareigas, duoda kitą paskyrimą, bet tą pačią komandą.',
      }),

    // 4. Pirma ir antra vieta
    () =>
      uzdavinys(T2, {
        klausimas: 'Varžosi $3$ žmonės. Kiek skirtingų pirmos ir antros vietos rezultatų gali būti?',
        atsakymas: String(gretiniai(3, 2)),
        atsakymasRodymui: `$${gretiniai(3, 2)}$`,
        sprendimas: 'Pirmajai vietai yra $3$ galimybės, antrajai lieka $2$, tad iš viso $6$.',
      }),

    // 5. Kada tvarka svarbi
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kurioje situacijoje elementų tvarka yra svarbi?',
        variantai: [
          'Spynos kodas iš keturių skaitmenų',
          'Dviejų mokinių komanda',
          'Trijų knygų rinkinys iš lentynos',
          'Pica su dviem priedais',
        ],
        teisingas: 0,
        sprendimas: 'Kode $1234$ ir $4321$ yra skirtingi, o komandoje ar rinkinyje elementų eilė nieko nekeičia.',
      }),

    // 6. Trys pareigos iš penkių
    () =>
      uzdavinys(T2, {
        klausimas: 'Iš $5$ mokinių išrenkami pirmininkas, pavaduotojas ir sekretorius. Kiek galimų paskyrimų?',
        atsakymas: String(gretiniai(5, 3)),
        atsakymasRodymui: `$${gretiniai(5, 3)}$`,
        sprendimas: `Pirmininku gali būti bet kuris iš $5$, pavaduotoju — iš likusių $4$, sekretoriumi — iš $3$: $5 \\cdot 4 \\cdot 3 = ${gretiniai(5, 3)}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: 'Skaičiuodamas trijų vietų kodus iš skaitmenų $1$, $2$, $3$ be kartojimo, mokinys suskaičiavo tik rinkinius ir gavo $1$. Kiek kodų yra iš tikrųjų?',
        atsakymas: '6',
        atsakymasRodymui: '$6$ kodai',
        sprendimas:
          'Rinkinys iš tiesų vienas — $\\{1; 2; 3\\}$, bet jį galima surikiuoti $3 \\cdot 2 \\cdot 1 = 6$ būdais: $123$, $132$, $213$, $231$, $312$, $321$.',
      }),

    // 8. Komanda ir pareigos skaičiais
    () =>
      uzdavinys(T2, {
        klausimas: 'Iš $5$ mokinių pasirenkami $2$. Kiek daugiau yra pirmininko ir pavaduotojo paskyrimų negu tiesiog komandų?',
        atsakymas: String(gretiniai(5, 2) - deriniai(5, 2)),
        atsakymasRodymui: `$${gretiniai(5, 2)} - ${deriniai(5, 2)} = ${gretiniai(5, 2) - deriniai(5, 2)}$`,
        sprendimas: `Komandų yra $${deriniai(5, 2)}$, o paskyrimų dvigubai daugiau — $${gretiniai(5, 2)}$, nes kiekvieną porą galima paskirstyti dviem būdais.`,
      }),

    // 9. Ta pati trijulė kita tvarka
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kurioje situacijoje tie patys trys elementai skirtinga tvarka duoda skirtingas baigtis?',
        variantai: [
          'Trys bėgikai užima pirmą, antrą ir trečią vietas',
          'Trys mokiniai sudaro komandą',
          'Trys vaisiai sudedami į vieną krepšį',
          'Trys skaičiai sudedami',
        ],
        teisingas: 0,
        sprendimas: 'Vietos yra skirtingos, tad jų priskyrimas tiems patiems bėgikams duoda kitą rezultatą.',
      }),

    // 10. Trijų raidžių kodai
    () =>
      uzdavinys(T2, {
        klausimas: 'Iš raidžių $A$, $B$, $C$, $D$ sudaromi visi $3$ raidžių kodai be kartojimo. Kiek jų yra?',
        atsakymas: String(gretiniai(4, 3)),
        atsakymasRodymui: `$${gretiniai(4, 3)}$ kodai`,
        sprendimas: `Pirmajai vietai yra $4$ pasirinkimai, antrajai $3$, trečiajai $2$: $4 \\cdot 3 \\cdot 2 = ${gretiniai(4, 3)}$.`,
      }),
  ])
}

// ── 8.3. Rinkinių skaičiaus apskaičiavimas ──────────────────────────────────

const T3 = 'rinkiniu-skaicius'

const A3 = [
  {
    klausimas: 'Kiek $2$ elementų rinkinių galima pasirinkti iš $4$ elementų, jei tvarka nesvarbi?',
    atsakymas: '6',
    atsakymasRodymui: '$6$',
    sprendimas: 'Kiekvienas elementas poruojasi su likusiais trimis, bet kiekviena pora suskaičiuojama du kartus: $\\dfrac{4 \\cdot 3}{2} = 6$.',
  },
] as const

export const rinkiniuSkaicius: Generatorius = () => suBandymais(kurk3, A3, T3)

function kurk3(): Uzdavinys | null {
  const n = atsitiktinis(4, 8)

  return variacija([
    // 1. Deriniai iš keturių
    () =>
      uzdavinys(T3, {
        klausimas: `Kiek $2$ elementų rinkinių galima pasirinkti iš $${n}$ elementų, jei tvarka nesvarbi?`,
        atsakymas: String(deriniai(n, 2)),
        atsakymasRodymui: `$${deriniai(n, 2)}$`,
        sprendimas: `Kiekvienas elementas poruojasi su likusiais $${n - 1}$, bet kiekviena pora suskaičiuojama du kartus: $${tr(`${n} \\cdot ${n - 1}`, '2')} = ${deriniai(n, 2)}$.`,
      }),

    // 2. Dviženkliai be kartojimo
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek dviženklių skaičių be pasikartojančių skaitmenų galima sudaryti iš skaitmenų $1$, $2$, $3$?',
        atsakymas: String(gretiniai(3, 2)),
        atsakymasRodymui: `$${gretiniai(3, 2)}$`,
        sprendimas: 'Čia tvarka svarbi: $3$ pasirinkimai pirmajai vietai ir $2$ antrajai.',
      }),

    // 3. Poros iš mokinių
    () => {
      const mokiniu = pasirink([5, 6, 7])
      return uzdavinys(T3, {
        klausimas: `Kiek skirtingų porų galima sudaryti iš $${mokiniu}$ mokinių?`,
        atsakymas: String(deriniai(mokiniu, 2)),
        atsakymasRodymui: `$${deriniai(mokiniu, 2)}$ poros`,
        sprendimas: `$${tr(`${mokiniu} \\cdot ${mokiniu - 1}`, '2')} = ${deriniai(mokiniu, 2)}$ — dalijama iš dviejų, nes poroje tvarka nesvarbi.`,
      })
    },

    // 4. Drabužių komplektas
    () => {
      const marskineliu = pasirink([3, 4, 5])
      const kelniu = pasirink([2, 3, 4])
      return uzdavinys(T3, {
        klausimas: `Iš $${marskineliu}$ marškinėlių ir $${kelniu}$ kelnių pasirenkamas vienas drabužių komplektas. Kiek galimų rinkinių?`,
        atsakymas: String(marskineliu * kelniu),
        atsakymasRodymui: `$${marskineliu * kelniu}$`,
        sprendimas: `Kiekvienus marškinėlius galima derinti su bet kuriomis kelnėmis: $${marskineliu} \\cdot ${kelniu} = ${marskineliu * kelniu}$.`,
        brezinys: galimybiuMedis(
          Array.from({ length: marskineliu }, (_, i) => `M${i + 1}`),
          Array.from({ length: kelniu }, (_, i) => `K${i + 1}`),
        ),
      })
    },

    // 5. Kodėl sistemingas sąrašas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kodėl sistemingas baigčių sąrašo sudarymas padeda išvengti praleidimų?',
        variantai: [
          'Nes einant nustatyta tvarka matyti, kurios baigtys jau surašytos ir kurių dar trūksta',
          'Nes sąrašas tampa trumpesnis',
          'Nes taip nereikia jokių formulių',
          'Nes atsitiktinis sąrašas visada teisingas',
        ],
        teisingas: 0,
        sprendimas: 'Tvarkingas surašymas kartu leidžia patikrinti ir formule gautą atsakymą.',
      }),

    // 6. Komanda iš šešių
    () =>
      uzdavinys(T3, {
        klausimas: 'Iš $6$ mokinių reikia pasirinkti $3$ žmonių komandą. Kiek tokių komandų galima sudaryti?',
        atsakymas: String(deriniai(6, 3)),
        atsakymasRodymui: `$${deriniai(6, 3)}$ komandos`,
        sprendimas: `Paskyrimų su tvarka būtų $6 \\cdot 5 \\cdot 4 = ${gretiniai(6, 3)}$, bet kiekviena komanda suskaičiuojama $6$ kartus, tad $${tr(String(gretiniai(6, 3)), '6')} = ${deriniai(6, 3)}$.`,
      }),

    // 7. Kodai su kartojimu
    () => {
      const zenklu = pasirink([3, 4])
      const kodu = 10 ** zenklu
      return uzdavinys(T3, {
        klausimas: `Kiek $${zenklu}$ ženklų kodų galima sudaryti iš skaitmenų $0$–$9$, jei skaitmenys gali kartotis?`,
        atsakymas: String(kodu),
        atsakymasRodymui: `$${kodu}$`,
        sprendimas: `Kiekvienai iš $${zenklu}$ vietų yra po $10$ pasirinkimų: $10^{${zenklu}} = ${kodu}$.`,
      })
    },

    // 8. Klaidos radimas
    () =>
      uzdavinys(T3, {
        klausimas: 'Marškinėlių ir kelnių komplektų skaičių mokinys apskaičiavo $3 + 4$. Kiek komplektų yra iš tikrųjų, jei marškinėlių $3$, o kelnių $4$?',
        atsakymas: '12',
        atsakymasRodymui: '$12$',
        sprendimas:
          'Renkamasi ir marškinėliai, ir kelnės, tad taikoma daugybos, o ne sudėties taisyklė: $3 \\cdot 4 = 12$.',
        brezinys: galimybiuMedis(['M1', 'M2', 'M3'], ['K1', 'K2', 'K3', 'K4']),
      }),

    // 9. Trijų knygų rinkiniai
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek skirtingų trijų knygų rinkinių galima pasirinkti iš $7$ knygų, jei tvarka nesvarbi?',
        atsakymas: String(deriniai(7, 3)),
        atsakymasRodymui: `$${deriniai(7, 3)}$ rinkiniai`,
        sprendimas: `$${tr(`7 \\cdot 6 \\cdot 5`, `3 \\cdot 2 \\cdot 1`)} = ${deriniai(7, 3)}$.`,
      }),

    // 10. Su tvarka ir be jos
    () =>
      poruUzdavinys(naujasId(T3), T3, {
        klausimas: 'Iš $5$ elementų renkami $3$. Susiek sąlygą su baigčių skaičiumi.',
        poros: [
          { kaire: 'Tvarka nesvarbi', desine: `$${deriniai(5, 3)}$` },
          { kaire: 'Tvarka svarbi', desine: `$${gretiniai(5, 3)}$` },
          { kaire: 'Tvarka svarbi ir elementai gali kartotis', desine: `$${5 ** 3}$` },
        ],
        sprendimas: `Kiekvieną rinkinį galima surikiuoti $6$ būdais, tad $${deriniai(5, 3)} \\cdot 6 = ${gretiniai(5, 3)}$.`,
      }),
  ])
}

// ── 8.4. Kombinatorikos sudėties taisyklė ───────────────────────────────────

const T4 = 'sudeties-taisykle'

const A4 = [
  {
    klausimas: 'Kavinėje galima rinktis vieną iš $4$ rūšių pyragų arba vieną iš $3$ rūšių ledų. Kiek yra vieno deserto pasirinkimų?',
    atsakymas: '7',
    atsakymasRodymui: '$7$',
    sprendimas: 'Grupės nesikerta ir renkamasi tik vienas desertas, tad taikoma sudėties taisyklė: $4 + 3 = 7$.',
  },
] as const

export const sudetiesTaisykle: Generatorius = () => suBandymais(kurk4, A4, T4)

function kurk4(): Uzdavinys | null {
  const a = atsitiktinis(2, 6)
  const b = atsitiktinis(2, 6)

  return variacija([
    // 1. Desertai
    () =>
      uzdavinys(T4, {
        klausimas: `Kavinėje galima rinktis vieną iš $${a}$ rūšių pyragų arba vieną iš $${b}$ rūšių ledų. Kiek yra vieno deserto pasirinkimų?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Grupės nesikerta ir renkamasi tik vienas desertas, tad $${a} + ${b} = ${a + b}$.`,
      }),

    // 2. Maršrutai
    () =>
      uzdavinys(T4, {
        klausimas: `Į miestą galima nuvykti $${a}$ autobusų arba $${b}$ traukinių maršrutais. Kiek iš viso pasirinkimų?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Kelionė yra viena, o transporto rūšys nesikerta, tad $${a} + ${b} = ${a + b}$.`,
      }),

    // 3. Kada taikoma sudėties taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kada kombinatorikoje taikoma sudėties taisyklė?',
        variantai: [
          'Kai renkamasi tik vienas objektas iš kelių tarpusavyje nesikertančių grupių',
          'Kai iš kiekvienos grupės renkamasi po vieną objektą',
          'Kai grupės persidengia',
          'Kai grupių yra daugiau nei dvi',
        ],
        teisingas: 0,
        sprendimas: 'Žodis „arba“ rodo sudėtį, o „ir“ — daugybą.',
      }),

    // 4. Knygos bibliotekoje
    () => {
      const romanu = pasirink([5, 6, 7])
      const enciklopediju = pasirink([3, 4, 5])
      return uzdavinys(T4, {
        klausimas: `Bibliotekoje galima pasirinkti vieną iš $${romanu}$ romanų arba vieną iš $${enciklopediju}$ enciklopedijų. Kiek pasirinkimų?`,
        atsakymas: String(romanu + enciklopediju),
        atsakymasRodymui: `$${romanu + enciklopediju}$`,
        sprendimas: `$${romanu} + ${enciklopediju} = ${romanu + enciklopediju}$ — imama tik viena knyga.`,
      })
    },

    // 5. Būreliai
    () =>
      uzdavinys(T4, {
        klausimas: `Mokykloje galima lankyti vieną iš $${a}$ sporto arba vieną iš $${b}$ muzikos būrelių. Kiek yra galimybių?`,
        atsakymas: String(a + b),
        atsakymasRodymui: `$${a + b}$`,
        sprendimas: `Lankomas vienas būrelis, o sąrašai nesikerta: $${a} + ${b} = ${a + b}$.`,
      }),

    // 6. Su išbrauktu maršrutu
    () => {
      const autobusu = pasirink([4, 5, 6])
      const traukiniu = pasirink([2, 3])
      return uzdavinys(T4, {
        klausimas: `Kelionė galima $${autobusu}$ tiesioginiais autobusais arba $${traukiniu}$ tiesioginiais traukiniais, tačiau vienas autobusų maršrutas dėl remonto netinka. Kiek tinkamų pasirinkimų lieka?`,
        atsakymas: String(autobusu + traukiniu - 1),
        atsakymasRodymui: `$${autobusu + traukiniu - 1}$`,
        sprendimas: `Iš viso būtų $${autobusu} + ${traukiniu} = ${autobusu + traukiniu}$, bet vienas netinka: $${autobusu + traukiniu - 1}$.`,
      })
    },

    // 7. Klaidos radimas
    () =>
      uzdavinys(T4, {
        klausimas: 'Renkantis vieną iš $6$ knygų arba vieną iš $4$ filmų, mokinys pritaikė daugybos taisyklę ir gavo $24$. Koks yra teisingas pasirinkimų skaičius?',
        atsakymas: '10',
        atsakymasRodymui: '$10$',
        sprendimas:
          'Renkamasi tik vienas objektas — arba knyga, arba filmas, tad grupės sudedamos: $6 + 4 = 10$. Daugyba tiktų, jei būtų imama ir knyga, ir filmas.',
      }),

    // 8. Trys grupės
    () => {
      const c = atsitiktinis(2, 5)
      return uzdavinys(T4, {
        klausimas: `Stovykloje siūloma viena veikla: $${a}$ vandens, $${b}$ meno arba $${c}$ žygių užsiėmimai. Nė vienas užsiėmimas nepatenka į dvi grupes. Kiek yra pasirinkimų?`,
        atsakymas: String(a + b + c),
        atsakymasRodymui: `$${a + b + c}$`,
        sprendimas: `Sudėties taisyklė galioja ir trims nesikertančioms grupėms: $${a} + ${b} + ${c} = ${a + b + c}$.`,
      })
    },

    // 9. Lyginis arba nelyginis
    () =>
      uzdavinys(T4, {
        klausimas: 'Iš skaičių $1$–$5$ reikia pasirinkti vieną lyginį arba vieną nelyginį skaičių. Kiek yra pasirinkimų?',
        atsakymas: '5',
        atsakymasRodymui: '$5$',
        sprendimas:
          'Lyginiai yra $2$ ir $4$ (du), nelyginiai — $1$, $3$, $5$ (trys): $2 + 3 = 5$. Tą patį rodo ir tiesioginis skaičiavimas — pasirinkimų tiek, kiek skaičių.',
      }),

    // 10. Persidengiančios grupės
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kodėl sudėties taisyklę reikia taikyti atsargiai, kai grupės persidengia?',
        variantai: [
          'Nes bendrus elementus suskaičiuotume du kartus: iš $10$ skaičių $4$ dalijasi iš $2$, $3$ iš $3$, bet vienas dalijasi iš abiejų',
          'Nes persidengiančių grupių sudėti apskritai negalima',
          'Nes tada reikia daugybos taisyklės',
          'Nes grupės niekada nepersidengia',
        ],
        teisingas: 0,
        sprendimas: 'Bendrus elementus reikia atimti, kitaip atsakymas gaunasi per didelis.',
      }),
  ])
}

// ── 8.5. Kombinatorikos daugybos taisyklė ───────────────────────────────────

const T5 = 'daugybos-taisykle-10'

const A5 = [
  {
    klausimas: 'Yra $3$ marškinėliai ir $4$ kelnės. Kiek skirtingų aprangos komplektų galima sudaryti?',
    atsakymas: '12',
    atsakymasRodymui: '$12$',
    sprendimas: 'Kiekvienus marškinėlius galima derinti su bet kuriomis kelnėmis: $3 \\cdot 4 = 12$.',
  },
] as const

export const daugybosTaisykle10: Generatorius = () => suBandymais(kurk5, A5, T5)

function kurk5(): Uzdavinys | null {
  const a = atsitiktinis(2, 5)
  const b = atsitiktinis(2, 5)

  return variacija([
    // 1. Aprangos komplektai
    () =>
      uzdavinys(T5, {
        klausimas: `Yra $${a}$ marškinėliai ir $${b}$ kelnės. Kiek skirtingų aprangos komplektų galima sudaryti?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$`,
        sprendimas: `Kiekvienus marškinėlius galima derinti su bet kuriomis kelnėmis: $${a} \\cdot ${b} = ${a * b}$.`,
        brezinys: galimybiuMedis(
          Array.from({ length: a }, (_, i) => `M${i + 1}`),
          Array.from({ length: b }, (_, i) => `K${i + 1}`),
        ),
      }),

    // 2. Patiekalas su garnyru
    () => {
      const pagrindiniu = pasirink([2, 3])
      const garnyru = pasirink([4, 5, 6])
      return uzdavinys(T5, {
        klausimas: `Patiekalui renkamasi vienas iš $${pagrindiniu}$ pagrindinių ir vienas iš $${garnyru}$ garnyrų. Kiek galimų derinių?`,
        atsakymas: String(pagrindiniu * garnyru),
        atsakymasRodymui: `$${pagrindiniu * garnyru}$`,
        sprendimas: `Renkamasi ir pagrindinis, ir garnyras, tad $${pagrindiniu} \\cdot ${garnyru} = ${pagrindiniu * garnyru}$.`,
      })
    },

    // 3. Kodas su kartojimu
    () => {
      const vietu = pasirink([2, 3])
      const simboliu = pasirink([4, 5, 6])
      return uzdavinys(T5, {
        klausimas: `$${vietu}$ vietų kodui kiekvienoje vietoje galima rinktis po $${simboliu}$ simbolius. Kiek kodų galima sudaryti, jei simboliai gali kartotis?`,
        atsakymas: String(simboliu ** vietu),
        atsakymasRodymui: `$${simboliu ** vietu}$`,
        sprendimas: `Kiekviena vieta pildoma nepriklausomai: $${simboliu}^{${vietu}} = ${simboliu ** vietu}$.`,
      })
    },

    // 4. Kada daugybos taisyklė
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kada taikoma kombinatorikos daugybos taisyklė?',
        variantai: [
          'Kai baigtis sudaroma keliais etapais ir kiekviename renkamasi po vieną objektą',
          'Kai renkamasi tik vienas objektas iš kelių grupių',
          'Kai grupės persidengia',
          'Kai objektų skaičius vienodas',
        ],
        teisingas: 0,
        sprendimas: 'Jungtukas „ir“ tarp etapų rodo daugybą, o „arba“ — sudėtį.',
      }),

    // 5. Maršrutai per B
    () => {
      const ab = pasirink([3, 4])
      const bc = pasirink([2, 3])
      return uzdavinys(T5, {
        klausimas: `Iš miesto $A$ į $B$ yra $${ab}$ keliai, iš $B$ į $C$ — $${bc}$. Kiek yra maršrutų $A$–$B$–$C$?`,
        atsakymas: String(ab * bc),
        atsakymasRodymui: `$${ab * bc}$`,
        sprendimas: `Kiekvieną pirmosios atkarpos kelią galima tęsti bet kuriuo antrosios: $${ab} \\cdot ${bc} = ${ab * bc}$.`,
        brezinys: galimybiuMedis(
          Array.from({ length: ab }, (_, i) => `k${i + 1}`),
          Array.from({ length: bc }, (_, i) => `m${i + 1}`),
        ),
      })
    },

    // 6. Slaptažodis
    () =>
      uzdavinys(T5, {
        klausimas: 'Slaptažodį sudaro $2$ raidės iš $26$ ir $3$ skaitmenys iš $10$; simboliai gali kartotis. Kiek tokių slaptažodžių?',
        atsakymas: String(26 ** 2 * 10 ** 3),
        atsakymasRodymui: `$${26 ** 2 * 10 ** 3}$`,
        sprendimas: `$26^2 \\cdot 10^3 = ${26 ** 2} \\cdot ${10 ** 3} = ${26 ** 2 * 10 ** 3}$.`,
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: 'Derinių iš $4$ marškinėlių ir $3$ kelnių skaičių mokinys apskaičiavo $4 + 3$. Kiek jų yra iš tikrųjų?',
        atsakymas: '12',
        atsakymasRodymui: '$12$',
        sprendimas:
          'Komplektą sudaro ir marškinėliai, ir kelnės, tad taikoma daugyba: $4 \\cdot 3 = 12$. Sudėtis tiktų, jei būtų renkamasi tik vienas drabužis.',
        brezinys: galimybiuMedis(['M1', 'M2', 'M3', 'M4'], ['K1', 'K2', 'K3']),
      }),

    // 8. Trys etapai su draudimu
    () =>
      uzdavinys(T5, {
        klausimas:
          'Kelionė turi tris etapus: $3$ pasirinkimai pirmajame, $4$ antrajame ir $2$ trečiajame. Vienas konkretus antro etapo pasirinkimas netinka su vienu pirmo etapo pasirinkimu. Kiek galimų maršrutų?',
        atsakymas: '22',
        atsakymasRodymui: '$22$',
        sprendimas:
          'Iš viso būtų $3 \\cdot 4 \\cdot 2 = 24$. Netinkamas pirmųjų dviejų etapų derinys yra vienas, o jį galima tęsti $2$ būdais, tad atimama $2$: $24 - 2 = 22$.',
      }),

    // 9. Dviejų etapų situacija
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kurie du etapai kartu duoda lygiai $24$ baigtis?',
        variantai: [
          '$4$ pasirinkimai pirmajame ir $6$ antrajame',
          '$4$ pasirinkimai pirmajame ir $20$ antrajame',
          '$12$ pasirinkimų pirmajame ir $12$ antrajame',
          '$24$ pasirinkimai pirmajame ir $24$ antrajame',
        ],
        teisingas: 0,
        sprendimas: '$4 \\cdot 6 = 24$; tiktų ir $3 \\cdot 8$, ir $2 \\cdot 12$ — variantų yra keli.',
      }),

    // 10. Penkiaženkliai skaičiai
    () =>
      uzdavinys(T5, {
        klausimas: 'Kiek penkiaženklių skaičių galima sudaryti iš skaitmenų $0$–$9$, jei pirmasis skaitmuo negali būti $0$, o skaitmenys gali kartotis?',
        atsakymas: String(9 * 10 ** 4),
        atsakymasRodymui: `$${9 * 10 ** 4}$`,
        sprendimas: `Pirmajai vietai lieka $9$ pasirinkimai, kitoms keturioms — po $10$: $9 \\cdot 10^4 = ${9 * 10 ** 4}$.`,
      }),
  ])
}

// ── 8.6. Teorinė ir eksperimentinė tikimybė ─────────────────────────────────

const T6 = 'teorine-eksperimentine'

const A6 = [
  {
    klausimas: 'Metamas sąžiningas šešiasienis kauliukas. Kokia teorinė tikimybė išridenti $6$?',
    atsakymas: '1/6',
    atsakymasRodymui: '$\\dfrac{1}{6}$',
    sprendimas: 'Palankios baigties viena iš šešių vienodai galimų.',
  },
] as const

export const teorineEksperimentine: Generatorius = () => suBandymais(kurk6, A6, T6)

function kurk6(): Uzdavinys | null {
  return variacija([
    // 1. Monetos tikimybė
    () =>
      uzdavinys(T6, {
        klausimas: 'Metama sąžininga moneta. Kokia teorinė herbo tikimybė?',
        atsakymas: '1/2',
        atsakymasRodymui: '$\\dfrac{1}{2}$',
        sprendimas: 'Yra dvi vienodai galimos baigtys, ir tik viena jų palanki.',
      }),

    // 2. Kauliuko tikimybė
    () => {
      const skaicius = atsitiktinis(1, 6)
      return uzdavinys(T6, {
        klausimas: `Metamas sąžiningas šešiasienis kauliukas. Kokia teorinė tikimybė išridenti $${skaicius}$?`,
        atsakymas: '1/6',
        atsakymasRodymui: '$\\dfrac{1}{6}$',
        sprendimas: 'Visos šešios baigtys vienodai galimos, o palanki yra viena.',
      })
    },

    // 3. Eksperimentinis dažnis
    () => {
      const herbu = pasirink([43, 47, 52, 56])
      return uzdavinys(T6, {
        klausimas: `Moneta mesta $100$ kartų, herbas iškrito $${herbu}$ kartus. Koks eksperimentinis santykinis dažnis?`,
        atsakymas: `${herbu}/100`,
        atsakymasRodymui: `$${tr(String(herbu), '100')} = ${String(herbu / 100).replace('.', '{,}')}$`,
        sprendimas: `Santykinis dažnis yra palankių baigčių ir visų bandymų santykis: $${tr(String(herbu), '100')}$.`,
      })
    },

    // 4. Teorinė ir eksperimentinė
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Kuo teorinė tikimybė skiriasi nuo eksperimentinio įverčio?',
        variantai: [
          'Teorinė skaičiuojama iš modelio, o eksperimentinė — iš tikrųjų bandymų rezultatų, tad ji kaskart gali būti kitokia',
          'Teorinė visada didesnė',
          'Eksperimentinė visada tiksli',
          'Skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Eksperimentinis dažnis svyruoja apie teorinę reikšmę ir prie jos artėja didėjant bandymų skaičiui.',
      }),

    // 5. Dažnio palyginimas su teorine
    () => {
      const metimu = 60
      const iskrito = pasirink([9, 12, 15])
      return uzdavinys(T6, {
        klausimas: `Kauliukas mestas $${metimu}$ kartų, skaičius $4$ iškrito $${iskrito}$ kartus. Koks eksperimentinis santykinis dažnis? Atsakymą užrašyk nesuprastinta arba suprastinta trupmena.`,
        atsakymas: `${iskrito}/${metimu}`,
        atsakymasRodymui: `$${tr(String(iskrito), String(metimu))}$`,
        sprendimas: `$${tr(String(iskrito), String(metimu))}$; teorinė tikimybė yra $${tr('1', '6')} = ${tr('10', '60')}$, tad dažnis nuo jos šiek tiek skiriasi.`,
      })
    },

    // 6. Suktukas
    () =>
      uzdavinys(T6, {
        klausimas: 'Suktukas turi $8$ vienodus sektorius, iš jų $3$ raudoni. Kokia teorinė raudonos spalvos tikimybė?',
        atsakymas: '3/8',
        atsakymasRodymui: '$\\dfrac{3}{8}$',
        sprendimas:
          'Palankios trys baigtys iš aštuonių vienodai galimų. Per $200$ bandymų raudona iškritus $68$ kartus, eksperimentinis dažnis būtų $0{,}34$ — artimas $0{,}375$.',
        brezinys: rutuliaiDezeje(3, 5),
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Atlikęs $5$ monetos metimus ir gavęs $4$ herbus, mokinys teigia, kad herbo tikimybė yra $0{,}8$. Kur klaida?',
        variantai: [
          'Tai eksperimentinis dažnis iš labai mažo bandymų skaičiaus, o ne teorinė tikimybė, kuri lygi $0{,}5$',
          'Klaidos nėra',
          'Teorinė tikimybė iš tiesų yra $0{,}8$',
          'Reikėjo skaičiuoti $\\dfrac{5}{4}$',
        ],
        teisingas: 0,
        sprendimas: 'Prie mažo bandymų skaičiaus dažnis svyruoja labai plačiai ir teorinės tikimybės neparodo.',
      }),

    // 8. Artimas teoriniam dažnis
    () =>
      uzdavinys(T6, {
        klausimas: 'Kauliukas metamas $120$ kartų. Kiek kartų vidutiniškai turėtų iškristi vienetukas?',
        atsakymas: '20',
        atsakymasRodymui: '$20$ kartų',
        sprendimas: '$120 \\cdot \\dfrac{1}{6} = 20$; tikrasis rezultatas apie šį skaičių svyruos.',
      }),

    // 9. Dviejų eksperimentų palyginimas
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: 'Palygink du eksperimentus: $20$ bandymų ir $2000$ bandymų. Kurio santykinis dažnis paprastai stabilesnis?',
        variantai: [
          'Antrojo — didėjant bandymų skaičiui dažnis vis mažiau svyruoja',
          'Pirmojo — mažiau bandymų, mažiau klaidų',
          'Abiejų vienodai',
          'Priklauso nuo to, kas meta',
        ],
        teisingas: 0,
        sprendimas: 'Atsitiktiniai nuokrypiai vidutiniškai išsilygina, kai bandymų daug.',
        brezinys: daznioGrafikas(
          [
            { n: 20, daznis: 0.35 },
            { n: 50, daznis: 0.58 },
            { n: 200, daznis: 0.47 },
            { n: 800, daznis: 0.52 },
            { n: 2000, daznis: 0.5 },
          ],
          0.5,
          { ribosUzrasas: 'teorinė 0,5' },
        ),
      }),

    // 10. Eksperimento planas
    () =>
      poruUzdavinys(naujasId(T6), T6, {
        klausimas: 'Dėžėje yra $2$ balti ir $3$ juodi rutuliai; traukiamas vienas. Susiek dydį su jo reikšme.',
        poros: [
          { kaire: 'Teorinė balto tikimybė', desine: '$\\dfrac{2}{5}$' },
          { kaire: 'Teorinė juodo tikimybė', desine: '$\\dfrac{3}{5}$' },
          { kaire: 'Abiejų tikimybių suma', desine: '$1$' },
        ],
        brezinys: rutuliaiDezeje(2, 3),
        sprendimas: 'Baigtys yra vienodai galimos, o visų baigčių tikimybių suma visada lygi vienetui.',
      }),
  ])
}

// ── 8.7. Ilgalaikis santykinis dažnis ───────────────────────────────────────

const T7 = 'ilgalaikis-daznis'

const A7 = [
  {
    klausimas: 'Moneta metama labai daug kartų. Į kokią reikšmę turėtų artėti herbo santykinis dažnis?',
    atsakymas: '0,5',
    atsakymasRodymui: '$0{,}5$',
    sprendimas: 'Ilgalaikis santykinis dažnis artėja prie teorinės tikimybės, o ji lygi $\\dfrac{1}{2}$.',
  },
] as const

export const ilgalaikisDaznis: Generatorius = () => suBandymais(kurk7, A7, T7)

function kurk7(): Uzdavinys | null {
  return variacija([
    // 1. Monetos riba
    () =>
      uzdavinys(T7, {
        klausimas: 'Moneta metama labai daug kartų. Į kokią reikšmę turėtų artėti herbo santykinis dažnis?',
        atsakymas: '0,5',
        atsakymasRodymui: '$0{,}5$',
        sprendimas: 'Ilgalaikis santykinis dažnis artėja prie teorinės tikimybės, o ji lygi $\\dfrac{1}{2}$.',
        brezinys: daznioGrafikas(
          [
            { n: 10, daznis: 0.3 },
            { n: 50, daznis: 0.62 },
            { n: 200, daznis: 0.46 },
            { n: 600, daznis: 0.53 },
            { n: 1000, daznis: 0.5 },
          ],
          0.5,
          { ribosUzrasas: '0,5' },
        ),
      }),

    // 2. Kauliuko orientyras
    () =>
      uzdavinys(T7, {
        klausimas: 'Stebimas sąžiningo kauliuko šešeto santykinis dažnis didėjant metimų skaičiui. Kokia teorinė reikšmė yra orientyras?',
        atsakymas: '1/6',
        atsakymasRodymui: '$\\dfrac{1}{6}$',
        sprendimas: 'Visos šešios baigtys vienodai galimos, tad ilgainiui šešetas pasitaiko maždaug kas šeštą kartą.',
      }),

    // 3. Kas yra ilgalaikis dažnis
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ką reiškia ilgalaikis santykinis dažnis?',
        variantai: [
          'Palankių baigčių dalį, prie kurios artėjama vis kartojant bandymą',
          'Bandymų skaičių',
          'Didžiausią palankių baigčių skaičių',
          'Teorinę tikimybę, padaugintą iš bandymų skaičiaus',
        ],
        teisingas: 0,
        sprendimas: 'Tai eksperimentinis dydis, kuris didėjant bandymų skaičiui stabilizuojasi ties teorine tikimybe.',
      }),

    // 4. Tendencijos aprašymas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Brėžinyje pavaizduotas herbo santykinis dažnis didėjant bandymų skaičiui. Kaip apibūdintum tendenciją?',
        variantai: [
          'Iš pradžių dažnis stipriai svyruoja, o didėjant bandymų skaičiui nusistovi apie $0{,}5$',
          'Dažnis nuolat didėja',
          'Dažnis nuolat mažėja',
          'Dažnis nesikeičia nuo pat pradžių',
        ],
        teisingas: 0,
        brezinys: daznioGrafikas(
          [
            { n: 10, daznis: 0.2 },
            { n: 30, daznis: 0.67 },
            { n: 100, daznis: 0.43 },
            { n: 300, daznis: 0.54 },
            { n: 1000, daznis: 0.49 },
          ],
          0.5,
          { ribosUzrasas: '0,5' },
        ),
        sprendimas: 'Nedideliuose bandymuose atsitiktinumas dominuoja, o kaupiantis duomenims jis išsilygina.',
      }),

    // 5. Ar būtinai lygiai pusė
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ar po $10\\,000$ monetos metimų privalo būti lygiai $5000$ herbų?',
        variantai: [
          'Ne — dažnis bus arti $0{,}5$, bet tikslus skaičius beveik niekada nesutampa',
          'Taip — to reikalauja tikimybės apibrėžimas',
          'Taip, jei moneta sąžininga',
          'Ne — herbų visada būna mažiau',
        ],
        teisingas: 0,
        sprendimas: 'Tikimybė nusako ilgalaikę tendenciją, o ne kiekvieno konkretaus bandymų rinkinio rezultatą.',
      }),

    // 6. Stabilizavimasis etapais
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Kauliukas metamas etapais po $50$, $100$, $500$ ir $2000$ kartų. Kuri šešeto santykinių dažnių seka realistiška?',
        variantai: [
          '$0{,}10$; $0{,}21$; $0{,}18$; $0{,}17$',
          '$0{,}17$; $0{,}17$; $0{,}17$; $0{,}17$',
          '$0{,}50$; $0{,}40$; $0{,}30$; $0{,}20$',
          '$0{,}02$; $0{,}05$; $0{,}09$; $0{,}12$',
        ],
        teisingas: 0,
        sprendimas: 'Iš pradžių svyravimas didelis, paskui reikšmės nusistovi apie $\\dfrac{1}{6} \\approx 0{,}17$.',
      }),

    // 7. Ne monotoniškas artėjimas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Mokinys teigia, kad santykinis dažnis po kiekvieno bandymo vis labiau artėja prie tikimybės. Kodėl jis gali svyruoti?',
        variantai: [
          'Kiekvienas naujas bandymas dažnį pastumia į vieną ar kitą pusę, tad artėjimas yra bendra tendencija, o ne kiekvieno žingsnio taisyklė',
          'Nes tikimybė keičiasi',
          'Nes moneta nesąžininga',
          'Nes dažnis visada mažėja',
        ],
        teisingas: 0,
        brezinys: daznioGrafikas(
          [
            { n: 10, daznis: 0.4 },
            { n: 40, daznis: 0.55 },
            { n: 120, daznis: 0.44 },
            { n: 500, daznis: 0.52 },
            { n: 1500, daznis: 0.5 },
          ],
          0.5,
          { ribosUzrasas: '0,5' },
        ),
        sprendimas: 'Grafike matyti, kad kreivė ne kartą pereina per punktyrinę tiesę.',
      }),

    // 8. Modelio spėjimas iš grafiko
    () =>
      uzdavinys(T7, {
        klausimas: 'Brėžinyje santykinis dažnis svyruoja apie $0{,}25$. Kokia trupmena galėtų būti šio įvykio teorinė tikimybė?',
        atsakymas: '1/4',
        atsakymasRodymui: '$\\dfrac{1}{4}$',
        sprendimas: '$0{,}25 = \\dfrac{1}{4}$ — pavyzdžiui, traukiant vieną iš keturių vienodai galimų baigčių.',
        brezinys: daznioGrafikas(
          [
            { n: 20, daznis: 0.15 },
            { n: 60, daznis: 0.32 },
            { n: 200, daznis: 0.22 },
            { n: 700, daznis: 0.27 },
            { n: 2000, daznis: 0.25 },
          ],
          0.25,
          { ribosUzrasas: '0,25' },
        ),
      }),

    // 9. Dviejų įvykių palyginimas
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Dviejų įvykių teorinės tikimybės yra $0{,}1$ ir $0{,}7$. Ko tikėtumeisi dideliame bandymų skaičiuje?',
        variantai: [
          'Pirmojo santykinis dažnis nusistovės apie $0{,}1$, antrojo — apie $0{,}7$',
          'Abu dažniai nusistovės apie $0{,}5$',
          'Dažniai susilygins',
          'Pirmasis įvykis neįvyks nė karto',
        ],
        teisingas: 0,
        sprendimas: 'Kiekvieno įvykio dažnis artėja prie savo teorinės tikimybės nepriklausomai nuo kitų.',
      }),

    // 10. Eksperimento planas
    () =>
      uzdavinys(T7, {
        klausimas: 'Sąžiningas kauliukas metamas $600$ kartų. Kiek kartų vidutiniškai turėtų iškristi lyginis skaičius?',
        atsakymas: '300',
        atsakymasRodymui: '$300$ kartų',
        sprendimas: 'Lyginių baigčių yra trys iš šešių, tad tikimybė $\\dfrac{1}{2}$: $600 \\cdot 0{,}5 = 300$.',
      }),
  ])
}
