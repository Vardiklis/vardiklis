import { atsitiktinis, naujasId, pasirink } from '../matematika'
import { suBandymais, uzdavinys, variacija } from './bendra'
import { pasirinkimoUzdavinys, poruUzdavinys } from './formatai'
import { koordinaciuPlokstuma, trikampisSuZymemis } from './sestokams-vaizdai'
import { keturkampis } from './penktokams-simetrijos-vaizdai'
import { kampoDydis, lygiagreciosSuKirstine, susikertancios, trikampioLinija } from './septintokams-vaizdai'
import type { Generatorius, Uzdavinys } from './tipai'

/**
 * 7 klasės temos „Tiesės“ ir „Trikampiai ir keturkampiai“ — septyniolika
 * potemių.
 *
 * Programoje tiesių temoje yra ir potemė „Konstravimas ir transformacijos
 * koordinačių plokštumoje“, kurios turinio apraše nėra; ji čia priklauso, nes
 * remiasi tomis pačiomis tiesių ir taškų savybėmis.
 *
 * Kiekvienas keturkampis turi savo generatorių, nes mokomasi būtent jų
 * savybių skirtumų: lygiagretainis, stačiakampis, rombas, kvadratas ir
 * trapecija skiriasi tuo, kas galioja jų kraštinėms, kampams ir įstrižainėms.
 */

const SMAILUS = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]

/**
 * Reiškinio „a − b“ tekstas, kai `b` gali būti neigiamas.
 *
 * Koordinačių uždaviniuose atimamas skaičius dažnai neigiamas, ir tiesiogiai
 * įrašius gautųsi „$-1 - -5$“ — tokio užrašo mokinys niekur nemato.
 */
function minus(a: number, b: number): string {
  return b < 0 ? `${a} + ${-b}` : `${a} - ${b}`
}

// ── 6.1. Taškas ir tiesė ────────────────────────────────────────────────────

const T1 = 'taskas-ir-tiese'

const A_TASKAS = [
  {
    klausimas: 'Kiek tiesių galima nubrėžti per du skirtingus taškus?',
    atsakymas: '1',
    atsakymasRodymui: '$1$',
    sprendimas: 'Tai viena iš geometrijos aksiomų.',
  },
] as const

export const taskasIrTiese: Generatorius = () => suBandymais(kurkTaska, A_TASKAS, T1)

function kurkTaska(): Uzdavinys | null {
  const n = atsitiktinis(4, 8)

  return variacija([
    // 1. Per du taškus
    () =>
      uzdavinys(T1, {
        klausimas: 'Kiek tiesių galima nubrėžti per du skirtingus taškus?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Tai geometrijos aksioma: per du taškus eina vienintelė tiesė.',
      }),

    // 2. Per vieną tašką
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Kiek tiesių galima nubrėžti per vieną tašką?',
        variantai: ['be galo daug', 'vieną', 'dvi', 'nė vienos'],
        teisingas: 0,
        sprendimas: 'Vienas taškas tiesės krypties nenulemia.',
      }),

    // 3. Kiek tiesių per n taškų
    () =>
      uzdavinys(T1, {
        klausimas: `Plokštumoje pažymėti ${n} taškai, iš kurių jokie trys nėra vienoje tiesėje. Kiek tiesių galima nubrėžti per jų poras?`,
        atsakymas: String((n * (n - 1)) / 2),
        atsakymasRodymui: `$${(n * (n - 1)) / 2}$`,
        sprendimas: `Kiekviena taškų pora duoda vieną tiesę: $\\dfrac{${n} \\cdot ${n - 1}}{2} = ${(n * (n - 1)) / 2}$.`,
      }),

    // 4. Atkarpa, spindulys ir tiesė
    () =>
      poruUzdavinys(naujasId(T1), T1, {
        klausimas: 'Sujunk figūrą su jos apibūdinimu.',
        poros: [
          { kaire: 'tiesė', desine: 'begalinė į abi puses' },
          { kaire: 'spindulys', desine: 'turi pradžią, bet ne pabaigą' },
          { kaire: 'atkarpa', desine: 'turi abu galus' },
          { kaire: 'taškas', desine: 'neturi matmenų' },
        ],
        sprendimas: 'Tiesė žymima dviem raidėmis, bet ji tęsiasi už jų.',
      }),

    // 5. Ar taškas priklauso tiesei
    () =>
      pasirinkimoUzdavinys(naujasId(T1), T1, {
        klausimas: 'Ką reiškia, kad taškas priklauso tiesei?',
        variantai: [
          'taškas yra ant tos tiesės',
          'taškas yra šalia tiesės',
          'tiesė eina per taško vidurį',
          'taškas yra tiesės gale',
        ],
        teisingas: 0,
        sprendimas: 'Priklausymas žymimas ženklu $\\in$.',
      }),

    // 6. Kiek dalių dalija taškas
    () =>
      uzdavinys(T1, {
        klausimas: 'Į kiek spindulių tiesę padalija vienas jai priklausantis taškas?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Taškas yra abiejų spindulių pradžia.',
      }),

    // 7. Kiek atkarpų
    () => {
      const taskai = atsitiktinis(3, 6)
      return uzdavinys(T1, {
        klausimas: `Tiesėje pažymėti ${taskai} taškai. Kiek atkarpų jie apibrėžia?`,
        atsakymas: String((taskai * (taskai - 1)) / 2),
        atsakymasRodymui: `$${(taskai * (taskai - 1)) / 2}$`,
        sprendimas: `Kiekviena taškų pora duoda atkarpą: $\\dfrac{${taskai} \\cdot ${taskai - 1}}{2} = ${(taskai * (taskai - 1)) / 2}$.`,
      })
    },
  ])
}

// ── 6.2. Susikertančiosios tiesės ───────────────────────────────────────────

const T2 = 'susikertancios-tieses'

const A_SUSIKERTA = [
  {
    klausimas: 'Kiek bendrų taškų turi dvi susikertančiosios tiesės?',
    atsakymas: '1',
    atsakymasRodymui: '$1$',
    sprendimas: 'Daugiau nei vienas bendras taškas reikštų, kad tiesės sutampa.',
  },
] as const

export const susikertanciosTieses: Generatorius = () => suBandymais(kurkSusikertancias, A_SUSIKERTA, T2)

function kurkSusikertancias(): Uzdavinys | null {
  const kampas = pasirink(SMAILUS)

  return variacija([
    // 1. Kiek bendrų taškų
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek bendrų taškų turi dvi susikertančiosios tiesės?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Jei bendrų taškų būtų du, tiesės sutaptų.',
        brezinys: susikertancios(kampas),
      }),

    // 2. Kryžminis kampas
    () =>
      uzdavinys(T2, {
        klausimas: `Dvi tiesės susikerta, ir vienas kampas lygus ${kampas}°. Kiek laipsnių turi jam kryžminis kampas?`,
        atsakymas: String(kampas),
        atsakymasRodymui: `$${kampas}°$`,
        sprendimas: 'Kryžminiai kampai lygūs.',
        brezinys: susikertancios(kampas),
      }),

    // 3. Gretutinis kampas
    () =>
      uzdavinys(T2, {
        klausimas: `Dvi tiesės susikerta, ir vienas kampas lygus ${kampas}°. Kiek laipsnių turi jam gretutinis kampas?`,
        atsakymas: String(180 - kampas),
        atsakymasRodymui: `$${180 - kampas}°$`,
        sprendimas: `$180 - ${kampas} = ${180 - kampas}$.`,
        brezinys: susikertancios(kampas),
      }),

    // 4. Statmenos tiesės
    () =>
      pasirinkimoUzdavinys(naujasId(T2), T2, {
        klausimas: 'Kada dvi susikertančios tiesės vadinamos statmenomis?',
        variantai: [
          'kai jos sudaro statųjį kampą',
          'kai jos sudaro smailųjį kampą',
          'kai jos neturi bendrų taškų',
          'kai jos vienodo ilgio',
        ],
        teisingas: 0,
        sprendimas: 'Tada visi keturi susidarę kampai lygūs po 90°.',
      }),

    // 5. Visų kampų suma
    () =>
      uzdavinys(T2, {
        klausimas: 'Kiek laipsnių sudaro visų keturių kampų, susidariusių susikirtus dviem tiesėms, suma?',
        atsakymas: '360',
        atsakymasRodymui: `$360°$`,
        sprendimas: 'Kartu jie sudaro pilnąjį kampą.',
      }),

    // 6. Kai visi kampai lygūs
    () =>
      uzdavinys(T2, {
        klausimas: 'Visi keturi susikirtimo kampai lygūs. Kiek laipsnių turi kiekvienas?',
        atsakymas: '90',
        atsakymasRodymui: `$90°$`,
        sprendimas: '$360 : 4 = 90$ — tiesės statmenos.',
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T2, {
        klausimas: `Mokinys teigia, kad ${kampas}° kampui kryžminis kampas yra ${180 - kampas}°. Kiek laipsnių jis turi iš tikrųjų?`,
        atsakymas: String(kampas),
        atsakymasRodymui: `$${kampas}°$`,
        sprendimas: `${180 - kampas}° yra gretutinis kampas, o kryžminis lygus pradiniam.`,
        brezinys: susikertancios(kampas),
      }),
  ])
}

// ── 6.3. Lygiagrečiosios tiesės ─────────────────────────────────────────────

const T3 = 'lygiagrecios-tieses'

const A_LYGIAGRECIOS = [
  {
    klausimas: 'Kiek bendrų taškų turi dvi lygiagrečiosios tiesės?',
    atsakymas: '0',
    atsakymasRodymui: '$0$',
    sprendimas: 'Lygiagrečiosios tiesės nesusikerta.',
  },
] as const

export const lygiagreciosTieses: Generatorius = () => suBandymais(kurkLygiagrecias, A_LYGIAGRECIOS, T3)

function kurkLygiagrecias(): Uzdavinys | null {
  const kampas = pasirink(SMAILUS)

  return variacija([
    // 1. Kiek bendrų taškų
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek bendrų taškų turi dvi lygiagrečiosios tiesės?',
        atsakymas: '0',
        atsakymasRodymui: '$0$',
        sprendimas: 'Lygiagrečiosios tiesės niekada nesusikerta.',
        brezinys: lygiagreciosSuKirstine(kampas, 2),
      }),

    // 2. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kokios tiesės vadinamos lygiagrečiosiomis?',
        variantai: [
          'vienoje plokštumoje esančios ir nesusikertančios tiesės',
          'tiesės, sudarančios statųjį kampą',
          'vienodo ilgio tiesės',
          'tiesės, turinčios vieną bendrą tašką',
        ],
        teisingas: 0,
        sprendimas: 'Lygiagretumas žymimas ženklu $\\parallel$.',
      }),

    // 3. Per tašką
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek tiesių, lygiagrečių duotai tiesei, galima nubrėžti per tiesei nepriklausantį tašką?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Tai lygiagrečiųjų tiesių aksioma.',
      }),

    // 4. Atstumas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Kaip kinta atstumas tarp dviejų lygiagrečiųjų tiesių?',
        variantai: ['jis visur vienodas', 'jis didėja', 'jis mažėja', 'jis kinta atsitiktinai'],
        teisingas: 0,
        sprendimas: 'Todėl lygiagrečiosios tiesės niekada nesusikerta.',
      }),

    // 5. Trečioji tiesė
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Dvi tiesės lygiagrečios trečiajai. Kokios jos yra viena kitos atžvilgiu?',
        variantai: ['lygiagrečios', 'statmenos', 'susikertančios', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Lygiagretumas yra pereinamoji savybė.',
      }),

    // 6. Kirstinė
    () =>
      uzdavinys(T3, {
        klausimas: 'Kiek kampų susidaro dvi lygiagrečiąsias tieses perkirtus kirstine?',
        atsakymas: '8',
        atsakymasRodymui: '$8$',
        sprendimas: 'Kiekvienoje iš dviejų sankirtų susidaro po keturis kampus.',
        brezinys: lygiagreciosSuKirstine(kampas, 1),
      }),

    // 7. Statmenumas ir lygiagretumas
    () =>
      pasirinkimoUzdavinys(naujasId(T3), T3, {
        klausimas: 'Dvi tiesės statmenos tai pačiai trečiajai tiesei. Kokios jos yra viena kitos atžvilgiu?',
        variantai: ['lygiagrečios', 'statmenos', 'susikertančios smailiuoju kampu', 'sutampa'],
        teisingas: 0,
        sprendimas: 'Abi sudaro su trečiąja po 90°, tad tarpusavyje nesusikerta.',
      }),
  ])
}

// ── 6.4. Dviejų tiesių lygiagretumo požymiai ────────────────────────────────

const T4 = 'lygiagretumo-pozymiai'

const A_POZYMIAI = [
  {
    klausimas: 'Kokie kampai turi būti lygūs, kad tiesės būtų lygiagrečios?',
    atsakymas: 'atitinkamieji',
    atsakymasRodymui: 'Atitinkamieji (arba priešiniai)',
    sprendimas: 'Tai vienas iš lygiagretumo požymių.',
  },
] as const

export const lygiagretumoPozymiai: Generatorius = () => suBandymais(kurkPozymius, A_POZYMIAI, T4)

function kurkPozymius(): Uzdavinys | null {
  const kampas = pasirink(SMAILUS)

  return variacija([
    // 1. Atitinkamieji kampai
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kada dvi tiesės, perkirstos kirstine, yra lygiagrečios?',
        variantai: [
          'kai atitinkamieji kampai lygūs',
          'kai atitinkamieji kampai skirtingi',
          'kai kirstinė statmena',
          'kai kampų suma lygi 90°',
        ],
        teisingas: 0,
        sprendimas: 'Tai pirmasis lygiagretumo požymis.',
        brezinys: lygiagreciosSuKirstine(kampas, 1),
      }),

    // 2. Priešiniai kampai
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kokie dar kampai, būdami lygūs, rodo tiesių lygiagretumą?',
        variantai: ['priešiniai vidaus kampai', 'gretutiniai kampai', 'visi aštuoni kampai', 'tik statieji'],
        teisingas: 0,
        sprendimas: 'Priešiniai vidaus kampai guli skirtingose kirstinės pusėse tarp tiesių.',
      }),

    // 3. Vienašaliai kampai
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kokia turi būti vienašalių vidaus kampų suma, kad tiesės būtų lygiagrečios?',
        variantai: ['$180°$', '$90°$', '$360°$', 'jie turi būti lygūs'],
        teisingas: 0,
        sprendimas: 'Vienašaliai kampai yra vienas kito papildiniai iki ištiestinio kampo.',
      }),

    // 4. Ar lygiagrečios
    () => {
      const kitas = kampoDydis(kampas, 5)
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kirstinė su viena tiese sudaro ${kampoDydis(kampas, 1)}° kampą, su kita — ${kitas}° atitinkamąjį kampą. Ar tiesės lygiagrečios?`,
        variantai: ['taip, nes atitinkamieji kampai lygūs', 'ne', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Lygūs atitinkamieji kampai — lygiagretumo požymis.',
        brezinys: lygiagreciosSuKirstine(kampas, 1),
      })
    },

    // 5. Nelygiagrečios
    () => {
      const a = kampoDydis(kampas, 1)
      const b = a + atsitiktinis(5, 20)
      return pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: `Kirstinė su viena tiese sudaro ${a}° kampą, o atitinkamasis kampas prie kitos tiesės lygus ${b}°. Ar tiesės lygiagrečios?`,
        variantai: [`ne, nes $${a} \\ne ${b}$`, 'taip', 'to nustatyti neįmanoma'],
        teisingas: 0,
        sprendimas: 'Atitinkamieji kampai turi būti lygūs.',
      })
    },

    // 6. Statmenumo požymis
    () =>
      pasirinkimoUzdavinys(naujasId(T4), T4, {
        klausimas: 'Kaip patikrinti tiesių lygiagretumą naudojant statmenį?',
        variantai: [
          'jei abi tiesės statmenos tai pačiai trečiajai, jos lygiagrečios',
          'jei viena tiesė statmena kitai, jos lygiagrečios',
          'statmenumas su lygiagretumu nesusijęs',
          'jei kirstinė statmena vienai tiesei, jos lygiagrečios',
        ],
        teisingas: 0,
        sprendimas: 'Tada abi sudaro su ta trečiąja tiese po 90°.',
      }),

    // 7. Poros
    () =>
      poruUzdavinys(naujasId(T4), T4, {
        klausimas: 'Sujunk kampų porą su lygiagretumo sąlyga.',
        poros: [
          { kaire: 'atitinkamieji', desine: 'turi būti lygūs' },
          { kaire: 'priešiniai vidaus', desine: 'turi būti lygūs' },
          { kaire: 'vienašaliai vidaus', desine: 'suma $180°$' },
          { kaire: 'gretutiniai', desine: 'suma $180°$ visada' },
        ],
        sprendimas: 'Gretutinių kampų suma lygi 180° nepriklausomai nuo lygiagretumo.',
      }),
  ])
}

// ── 6.5. Kampų, susidariusių perkirtus kirstine, savybės ────────────────────

const T5 = 'kampai-su-kirstine'

const A_KAMPAI = [
  {
    klausimas: 'Dvi lygiagrečiosios tiesės perkirstos kirstine. Vienas kampas lygus 70°. Kiek laipsnių turi jam atitinkamasis kampas?',
    atsakymas: '70',
    atsakymasRodymui: '$70°$',
    sprendimas: 'Atitinkamieji kampai lygūs.',
  },
] as const

export const kampaiSuKirstine: Generatorius = () => suBandymais(kurkKampus, A_KAMPAI, T5)

function kurkKampus(): Uzdavinys | null {
  const smailus = pasirink(SMAILUS)
  const zinomas = atsitiktinis(1, 8)
  const zinomoDydis = kampoDydis(smailus, zinomas)

  return variacija([
    // 1. Atitinkamasis kampas
    () => {
      const kitas = zinomas <= 4 ? zinomas + 4 : zinomas - 4
      return uzdavinys(T5, {
        klausimas: `Kiek laipsnių turi ${kitas} numeriu pažymėtas kampas?`,
        atsakymas: String(kampoDydis(smailus, kitas)),
        atsakymasRodymui: `$${kampoDydis(smailus, kitas)}°$`,
        sprendimas: `Kampai ${zinomas} ir ${kitas} yra atitinkamieji, tad lygūs.`,
        brezinys: lygiagreciosSuKirstine(smailus, zinomas),
      })
    },

    // 2. Gretutinis kampas
    () => {
      const gretimas = zinomas % 2 === 0 ? zinomas - 1 : zinomas + 1
      if (gretimas < 1 || gretimas > 8) return null
      return uzdavinys(T5, {
        klausimas: `Kiek laipsnių turi ${gretimas} numeriu pažymėtas kampas?`,
        atsakymas: String(kampoDydis(smailus, gretimas)),
        atsakymasRodymui: `$${kampoDydis(smailus, gretimas)}°$`,
        sprendimas: `Šis kampas yra gretutinis pažymėtajam: $180 - ${zinomoDydis} = ${180 - zinomoDydis}$.`,
        brezinys: lygiagreciosSuKirstine(smailus, zinomas),
      })
    },

    // 3. Atitinkamųjų savybė
    () =>
      pasirinkimoUzdavinys(naujasId(T5), T5, {
        klausimas: 'Kokie yra atitinkamieji kampai, kai kirstinė kerta dvi lygiagrečiąsias tieses?',
        variantai: ['lygūs', 'jų suma $180°$', 'jų suma $90°$', 'jie visada statieji'],
        teisingas: 0,
        sprendimas: 'Ši savybė galioja tik lygiagrečiosioms tiesėms.',
        brezinys: lygiagreciosSuKirstine(smailus, zinomas),
      }),

    // 4. Vienašalių suma
    () =>
      uzdavinys(T5, {
        klausimas: `Vienas vienašalis vidaus kampas lygus ${smailus}°. Kiek laipsnių turi kitas?`,
        atsakymas: String(180 - smailus),
        atsakymasRodymui: `$${180 - smailus}°$`,
        sprendimas: `Vienašalių vidaus kampų suma lygi 180°: $180 - ${smailus} = ${180 - smailus}$.`,
      }),

    // 5. Priešiniai vidaus kampai
    () =>
      uzdavinys(T5, {
        klausimas: `Vienas priešinis vidaus kampas lygus ${smailus}°. Kiek laipsnių turi kitas?`,
        atsakymas: String(smailus),
        atsakymasRodymui: `$${smailus}°$`,
        sprendimas: 'Priešiniai vidaus kampai lygūs.',
      }),

    // 6. Kiek skirtingų dydžių
    () =>
      uzdavinys(T5, {
        klausimas: 'Kiek skirtingų dydžių kampų susidaro, kai kirstinė kerta dvi lygiagrečiąsias tieses (kirstinė nestatmena)?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Visi aštuoni kampai yra arba smailieji, arba bukieji, ir kiekvienos rūšies dydis tas pats.',
        brezinys: lygiagreciosSuKirstine(smailus, zinomas),
      }),

    // 7. Klaidos radimas
    () =>
      uzdavinys(T5, {
        klausimas: `Mokinys teigia, kad ${zinomoDydis}° kampui atitinkamasis kampas lygus ${180 - zinomoDydis}°. Kiek laipsnių jis turi iš tikrųjų?`,
        atsakymas: String(zinomoDydis),
        atsakymasRodymui: `$${zinomoDydis}°$`,
        sprendimas: `${180 - zinomoDydis}° yra gretutinis arba vienašalis kampas, o atitinkamasis lygus pradiniam.`,
        brezinys: lygiagreciosSuKirstine(smailus, zinomas),
      }),
  ])
}

// ── Konstravimas ir transformacijos koordinačių plokštumoje (programos potemė)

const T6 = 'konstravimas-plokstumoje'

const A_KONSTRAVIMAS = [
  {
    klausimas: 'Taškas $A(3; 2)$ atspindimas $y$ ašies atžvilgiu. Kokia naujo taško abscisė?',
    atsakymas: '-3',
    atsakymasRodymui: '$-3$',
    sprendimas: 'Atspindint per $y$ ašį abscisės ženklas pasikeičia.',
  },
] as const

export const konstravimasPlokstumoje: Generatorius = () => suBandymais(kurkKonstravima, A_KONSTRAVIMAS, T6)

function kurkKonstravima(): Uzdavinys | null {
  const x = atsitiktinis(-5, 5)
  const y = atsitiktinis(-5, 5)
  if (x === 0 || y === 0) return null

  return variacija([
    // 1. Atspindys per y ašį
    () =>
      uzdavinys(T6, {
        klausimas: `Taškas $A(${x}; ${y})$ atspindimas $y$ ašies atžvilgiu. Kokia naujo taško abscisė?`,
        atsakymas: String(-x),
        atsakymasRodymui: `$${-x}$`,
        sprendimas: 'Atspindint per $y$ ašį abscisės ženklas pasikeičia, o ordinatė lieka ta pati.',
        brezinys: koordinaciuPlokstuma([{ x, y, raide: 'A' }]),
      }),

    // 2. Atspindys per x ašį
    () =>
      uzdavinys(T6, {
        klausimas: `Taškas $A(${x}; ${y})$ atspindimas $x$ ašies atžvilgiu. Kokia naujo taško ordinatė?`,
        atsakymas: String(-y),
        atsakymasRodymui: `$${-y}$`,
        sprendimas: 'Atspindint per $x$ ašį keičiasi ordinatės ženklas.',
        brezinys: koordinaciuPlokstuma([{ x, y, raide: 'A' }]),
      }),

    // 3. Postūmis
    () => {
      const dx = atsitiktinis(1, 5)
      const dy = atsitiktinis(1, 5)
      return uzdavinys(T6, {
        klausimas: `Taškas $A(${x}; ${y})$ pastumtas ${dx} vienetais į dešinę ir ${dy} aukštyn. Kokia naujoji jo ordinatė?`,
        atsakymas: String(y + dy),
        atsakymasRodymui: `$${y + dy}$`,
        sprendimas: `Judant aukštyn ordinatė didėja: $${y} + ${dy} = ${y + dy}$.`,
      })
    },

    // 4. Simetrija pradžios taško atžvilgiu
    () =>
      uzdavinys(T6, {
        klausimas: `Taškas $A(${x}; ${y})$ atspindimas koordinačių pradžios taško atžvilgiu. Kokia naujo taško abscisė?`,
        atsakymas: String(-x),
        atsakymasRodymui: `$${-x}$`,
        sprendimas: 'Centrinė simetrija keičia abiejų koordinačių ženklus.',
      }),

    // 5. Atkarpos ilgis
    () => {
      const x2 = x + atsitiktinis(1, 5)
      if (x2 > 5) return null
      return uzdavinys(T6, {
        klausimas: `Atkarpos galai yra $A(${x}; ${y})$ ir $B(${x2}; ${y})$. Koks jos ilgis?`,
        atsakymas: String(x2 - x),
        atsakymasRodymui: `$${x2 - x}$`,
        sprendimas: `Ordinatės vienodos, tad atkarpa horizontali: $${minus(x2, x)} = ${x2 - x}$.`,
        brezinys: koordinaciuPlokstuma([
          { x, y, raide: 'A' },
          { x: x2, y, raide: 'B' },
        ]),
      })
    },

    // 6. Kuriame ketvirtyje
    () => {
      const ketv = x > 0 ? (y > 0 ? 'I' : 'IV') : y > 0 ? 'II' : 'III'
      const kiti = ['I', 'II', 'III', 'IV'].filter((k) => k !== ketv)
      return pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Kuriame ketvirtyje atsidurs taškas $A(${x}; ${y})$?`,
        variantai: [`${ketv} ketvirtyje`, ...kiti.map((k) => `${k} ketvirtyje`)],
        teisingas: 0,
        sprendimas: `Abscisė ${x > 0 ? 'teigiama' : 'neigiama'}, ordinatė ${y > 0 ? 'teigiama' : 'neigiama'}.`,
      })
    },

    // 7. Lygiagreti ašiai
    () =>
      pasirinkimoUzdavinys(naujasId(T6), T6, {
        klausimas: `Kokia yra tiesė, einanti per taškus $(${x}; 2)$ ir $(${x}; -3)$?`,
        variantai: ['lygiagreti $y$ ašiai', 'lygiagreti $x$ ašiai', 'einanti per pradžios tašką', 'įstriža'],
        teisingas: 0,
        sprendimas: 'Abscisės vienodos, tad visi tiesės taškai nutolę nuo $y$ ašies vienodai.',
      }),
  ])
}

// ── 7.1. Trikampių rūšys ────────────────────────────────────────────────────

const T7 = 'trikampiu-rusys'

const A_RUSYS = [
  {
    klausimas: 'Koks trikampis vadinamas lygiašoniu?',
    atsakymas: 'turintis dvi lygias krastines',
    atsakymasRodymui: 'Turintis dvi lygias kraštines',
    sprendimas: 'Trečioji kraštinė vadinama pagrindu.',
  },
] as const

export const trikampiuRusys: Generatorius = () => suBandymais(kurkRusis, A_RUSYS, T7)

function kurkRusis(): Uzdavinys | null {
  const a = atsitiktinis(30, 90)
  const b = atsitiktinis(30, 170 - a)
  const c = 180 - a - b
  if (c < 20) return null

  return variacija([
    // 1. Rūšis pagal kampus
    () => {
      const didziausias = Math.max(a, b, c)
      const rusis = didziausias > 90 ? 'bukasis' : didziausias === 90 ? 'statusis' : 'smailusis'
      return uzdavinys(T7, {
        klausimas: `Trikampio kampai yra ${a}°, ${b}° ir ${c}°. Koks tai trikampis pagal kampus?`,
        atsakymas: rusis,
        atsakymasRodymui: rusis.charAt(0).toUpperCase() + rusis.slice(1),
        sprendimas: `Didžiausias kampas yra ${didziausias}°.`,
      })
    },

    // 2. Lygiašonis
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Koks trikampis vadinamas lygiašoniu?',
        variantai: [
          'turintis dvi lygias kraštines',
          'turintis tris lygias kraštines',
          'turintis statųjį kampą',
          'turintis tris skirtingas kraštines',
        ],
        teisingas: 0,
        sprendimas: 'Lygios kraštinės vadinamos šoninėmis, trečioji — pagrindu.',
      }),

    // 3. Lygiakraštis
    () =>
      uzdavinys(T7, {
        klausimas: 'Kiek laipsnių turi kiekvienas lygiakraščio trikampio kampas?',
        atsakymas: '60',
        atsakymasRodymui: `$60°$`,
        sprendimas: '$180 : 3 = 60$.',
      }),

    // 4. Lygiašonio kampai
    () => {
      const pagrindo = atsitiktinis(30, 75)
      return uzdavinys(T7, {
        klausimas: `Lygiašonio trikampio kampai prie pagrindo po ${pagrindo}°. Kiek laipsnių turi viršūnės kampas?`,
        atsakymas: String(180 - 2 * pagrindo),
        atsakymasRodymui: `$${180 - 2 * pagrindo}°$`,
        sprendimas: `$180 - 2 \\cdot ${pagrindo} = ${180 - 2 * pagrindo}$.`,
      })
    },

    // 5. Rūšis pagal kraštines
    () =>
      poruUzdavinys(naujasId(T7), T7, {
        klausimas: 'Sujunk trikampio rūšį su jo požymiu.',
        poros: [
          { kaire: 'lygiakraštis', desine: 'visos kraštinės lygios' },
          { kaire: 'lygiašonis', desine: 'dvi kraštinės lygios' },
          { kaire: 'įvairiakraštis', desine: 'visos kraštinės skirtingos' },
          { kaire: 'statusis', desine: 'turi statųjį kampą' },
        ],
        sprendimas: 'Pirmosios trys rūšys skiriamos pagal kraštines, ketvirtoji — pagal kampus.',
      }),

    // 6. Ar gali būti statusis ir lygiakraštis
    () =>
      pasirinkimoUzdavinys(naujasId(T7), T7, {
        klausimas: 'Ar gali trikampis būti kartu ir statusis, ir lygiakraštis?',
        variantai: [
          'ne, nes lygiakraščio visi kampai lygūs 60°',
          'taip',
          'taip, jei kraštinės ilgos',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Statusis trikampis turi 90° kampą, o lygiakraštis — tik 60° kampus.',
      }),

    // 7. Iš brėžinio
    () => {
      const x = atsitiktinis(5, 9)
      const y = atsitiktinis(5, 9)
      const z = atsitiktinis(Math.abs(x - y) + 1, x + y - 1)
      if (z < 3 || z > 12) return null
      const rusis = x === y || y === z || x === z ? 'lygiašonis' : 'įvairiakraštis'
      return uzdavinys(T7, {
        klausimas: 'Koks trikampis pavaizduotas pagal kraštines?',
        atsakymas: rusis,
        atsakymasRodymui: rusis.charAt(0).toUpperCase() + rusis.slice(1),
        sprendimas: 'Lyginami užrašyti kraštinių ilgiai.',
        brezinys: trikampisSuZymemis(x, y, z, { a: `${x}`, b: `${y}`, c: `${z}` }),
      })
    },
  ])
}

// ── 7.2. Trikampio aukštinės ────────────────────────────────────────────────

const T8 = 'trikampio-aukstines'

const A_AUKSTINES = [
  {
    klausimas: 'Kas yra trikampio aukštinė?',
    atsakymas: 'statmuo is virsunes i priesinga krastine',
    atsakymasRodymui: 'Statmuo iš viršūnės į priešingą kraštinę',
    sprendimas: 'Aukštinė sudaro su kraštine statųjį kampą.',
  },
] as const

export const trikampioAukstines: Generatorius = () => suBandymais(kurkAukstines, A_AUKSTINES, T8)

function kurkAukstines(): Uzdavinys | null {
  return variacija([
    // 1. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kas yra trikampio aukštinė?',
        variantai: [
          'statmuo, nuleistas iš viršūnės į priešingą kraštinę',
          'atkarpa iš viršūnės į priešingos kraštinės vidurį',
          'kampo pusiaukampinė',
          'ilgiausia trikampio kraštinė',
        ],
        teisingas: 0,
        sprendimas: 'Aukštinė su kraštine sudaro 90° kampą.',
        brezinys: trikampioLinija('aukstine'),
      }),

    // 2. Kiek aukštinių
    () =>
      uzdavinys(T8, {
        klausimas: 'Kiek aukštinių turi trikampis?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Po vieną iš kiekvienos viršūnės.',
      }),

    // 3. Kampas su kraštine
    () =>
      uzdavinys(T8, {
        klausimas: 'Kiek laipsnių turi kampas tarp aukštinės ir kraštinės, į kurią ji nuleista?',
        atsakymas: '90',
        atsakymasRodymui: `$90°$`,
        sprendimas: 'Aukštinė yra statmuo.',
        brezinys: trikampioLinija('aukstine'),
      }),

    // 4. Aukštinės stačiajame trikampyje
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kurios stačiojo trikampio kraštinės yra kartu ir jo aukštinės?',
        variantai: ['abu statiniai', 'įžambinė', 'visos trys kraštinės', 'nė viena'],
        teisingas: 0,
        sprendimas: 'Statiniai statmeni vienas kitam, tad kiekvienas jų yra aukštinė į kitą.',
      }),

    // 5. Ploto formulė
    () => {
      const a = atsitiktinis(4, 16)
      const h = atsitiktinis(3, 12)
      if ((a * h) % 2 !== 0) return null
      return uzdavinys(T8, {
        klausimas: `Trikampio kraštinė ${a} cm, o į ją nuleista aukštinė ${h} cm. Koks trikampio plotas?`,
        atsakymas: String((a * h) / 2),
        atsakymasRodymui: `$${(a * h) / 2}$ cm²`,
        sprendimas: `$${a} \\cdot ${h} : 2 = ${(a * h) / 2}$.`,
      })
    },

    // 6. Aukštinė iš ploto
    () => {
      const a = atsitiktinis(4, 16)
      const h = atsitiktinis(3, 12)
      if ((a * h) % 2 !== 0) return null
      return uzdavinys(T8, {
        klausimas: `Trikampio plotas ${(a * h) / 2} cm², kraštinė ${a} cm. Kokio ilgio į ją nuleista aukštinė?`,
        atsakymas: String(h),
        atsakymasRodymui: `$${h}$ cm`,
        sprendimas: `$${(a * h) / 2} \\cdot 2 : ${a} = ${h}$.`,
      })
    },

    // 7. Bukajame trikampyje
    () =>
      pasirinkimoUzdavinys(naujasId(T8), T8, {
        klausimas: 'Kur yra bukojo trikampio aukštinės, nuleistos iš smailiųjų kampų viršūnių?',
        variantai: [
          'už trikampio ribų, ant kraštinės tęsinio',
          'trikampio viduje',
          'ant pačių kraštinių',
          'jų iš viso nėra',
        ],
        teisingas: 0,
        sprendimas: 'Todėl bukojo trikampio aukštines tenka brėžti pratęsus kraštinę.',
      }),
  ])
}

// ── 7.3. Trikampio pusiaukraštinės ──────────────────────────────────────────

const T9 = 'trikampio-pusiaukrastines'

const A_PUSIAUKRASTINES = [
  {
    klausimas: 'Kas yra trikampio pusiaukraštinė?',
    atsakymas: 'atkarpa is virsunes i priesingos krastines viduri',
    atsakymasRodymui: 'Atkarpa iš viršūnės į priešingos kraštinės vidurio tašką',
    sprendimas: 'Ji dalija kraštinę pusiau.',
  },
] as const

export const trikampioPusiaukrastines: Generatorius = () => suBandymais(kurkPusiaukrastines, A_PUSIAUKRASTINES, T9)

function kurkPusiaukrastines(): Uzdavinys | null {
  const a = atsitiktinis(4, 20)

  return variacija([
    // 1. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kas yra trikampio pusiaukraštinė?',
        variantai: [
          'atkarpa iš viršūnės į priešingos kraštinės vidurio tašką',
          'statmuo iš viršūnės į priešingą kraštinę',
          'kampo pusiaukampinė',
          'atkarpa, jungianti dviejų kraštinių vidurio taškus',
        ],
        teisingas: 0,
        sprendimas: 'Pusiaukraštinė kraštinę dalija pusiau, bet statmena jai būti neprivalo.',
        brezinys: trikampioLinija('pusiaukrastine'),
      }),

    // 2. Kiek pusiaukraštinių
    () =>
      uzdavinys(T9, {
        klausimas: 'Kiek pusiaukraštinių turi trikampis?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Po vieną iš kiekvienos viršūnės.',
      }),

    // 3. Kraštinės dalis
    () =>
      uzdavinys(T9, {
        klausimas: `Pusiaukraštinė nubrėžta į ${2 * a} cm kraštinę. Kokio ilgio yra kiekviena gauta dalis?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ cm`,
        sprendimas: `$${2 * a} : 2 = ${a}$.`,
        brezinys: trikampioLinija('pusiaukrastine'),
      }),

    // 4. Kuo skiriasi nuo aukštinės
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kuo pusiaukraštinė skiriasi nuo aukštinės?',
        variantai: [
          'pusiaukraštinė eina į kraštinės vidurį, o aukštinė yra statmuo',
          'pusiaukraštinė visada ilgesnė',
          'aukštinė eina į kraštinės vidurį',
          'skirtumo nėra',
        ],
        teisingas: 0,
        sprendimas: 'Lygiašoniame trikampyje jos gali sutapti.',
      }),

    // 5. Kada sutampa
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Kokiame trikampyje pusiaukraštinė, aukštinė ir pusiaukampinė, nubrėžtos iš tos pačios viršūnės, sutampa?',
        variantai: [
          'lygiašoniame — iš viršūnės tarp lygių kraštinių',
          'bet kuriame',
          'stačiajame',
          'jos niekada nesutampa',
        ],
        teisingas: 0,
        sprendimas: 'Lygiakraščiame trikampyje jos sutampa iš visų trijų viršūnių.',
      }),

    // 6. Į kiek dalių dalija plotą
    () =>
      pasirinkimoUzdavinys(naujasId(T9), T9, {
        klausimas: 'Į kokias dvi dalis pusiaukraštinė dalija trikampį?',
        variantai: [
          'į du vienodo ploto trikampius',
          'į du lygius trikampius',
          'į du skirtingo ploto trikampius',
          'į trikampį ir keturkampį',
        ],
        teisingas: 0,
        sprendimas: 'Abiejų trikampių pagrindai lygūs, o aukštinė bendra.',
      }),

    // 7. Ploto dalis
    () => {
      const plotas = atsitiktinis(6, 40) * 2
      return uzdavinys(T9, {
        klausimas: `Trikampio plotas ${plotas} cm². Koks yra vienos dalies, gautos nubrėžus pusiaukraštinę, plotas?`,
        atsakymas: String(plotas / 2),
        atsakymasRodymui: `$${plotas / 2}$ cm²`,
        sprendimas: `$${plotas} : 2 = ${plotas / 2}$.`,
      })
    },
  ])
}

// ── 7.4. Trikampio pusiaukampinės ───────────────────────────────────────────

const T10 = 'trikampio-pusiaukampines'

const A_PUSIAUKAMPINES = [
  {
    klausimas: 'Kas yra trikampio pusiaukampinė?',
    atsakymas: 'spindulys dalijantis kampa pusiau',
    atsakymasRodymui: 'Atkarpa, dalijanti kampą pusiau',
    sprendimas: 'Ji eina nuo viršūnės iki priešingos kraštinės.',
  },
] as const

export const trikampioPusiaukampines: Generatorius = () => suBandymais(kurkPusiaukampines, A_PUSIAUKAMPINES, T10)

function kurkPusiaukampines(): Uzdavinys | null {
  const kampas = pasirink([40, 50, 60, 70, 80, 90, 100, 110, 120])

  return variacija([
    // 1. Apibrėžimas
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Kas yra trikampio pusiaukampinė?',
        variantai: [
          'atkarpa, dalijanti kampą pusiau ir einanti iki priešingos kraštinės',
          'atkarpa į priešingos kraštinės vidurį',
          'statmuo iš viršūnės',
          'atkarpa, jungianti dvi viršūnes',
        ],
        teisingas: 0,
        sprendimas: 'Pusiaukampinė visada išeina iš viršūnės.',
        brezinys: trikampioLinija('pusiaukampine'),
      }),

    // 2. Gautų kampų dydis
    () =>
      uzdavinys(T10, {
        klausimas: `Trikampio kampas lygus ${kampas}°. Kiek laipsnių turi kiekvienas kampas, gautas nubrėžus jo pusiaukampinę?`,
        atsakymas: String(kampas / 2),
        atsakymasRodymui: `$${kampas / 2}°$`,
        sprendimas: `$${kampas} : 2 = ${kampas / 2}$.`,
        brezinys: trikampioLinija('pusiaukampine'),
      }),

    // 3. Kiek pusiaukampinių
    () =>
      uzdavinys(T10, {
        klausimas: 'Kiek pusiaukampinių turi trikampis?',
        atsakymas: '3',
        atsakymasRodymui: '$3$',
        sprendimas: 'Po vieną iš kiekvieno kampo.',
      }),

    // 4. Atvirkštinis
    () =>
      uzdavinys(T10, {
        klausimas: `Pusiaukampinė padalijo trikampio kampą į du ${kampas / 2}° kampus. Kiek laipsnių turėjo pradinis kampas?`,
        atsakymas: String(kampas),
        atsakymasRodymui: `$${kampas}°$`,
        sprendimas: `$${kampas / 2} \\cdot 2 = ${kampas}$.`,
      }),

    // 5. Lygiakraščiame trikampyje
    () =>
      uzdavinys(T10, {
        klausimas: 'Kiek laipsnių turi kampas, gautas nubrėžus lygiakraščio trikampio pusiaukampinę?',
        atsakymas: '30',
        atsakymasRodymui: `$30°$`,
        sprendimas: 'Lygiakraščio trikampio kampai po 60°: $60 : 2 = 30$.',
      }),

    // 6. Trys svarbiosios linijos
    () =>
      poruUzdavinys(naujasId(T10), T10, {
        klausimas: 'Sujunk trikampio liniją su jos savybe.',
        poros: [
          { kaire: 'aukštinė', desine: 'statmena kraštinei' },
          { kaire: 'pusiaukraštinė', desine: 'eina į kraštinės vidurį' },
          { kaire: 'pusiaukampinė', desine: 'dalija kampą pusiau' },
          { kaire: 'kraštinė', desine: 'jungia dvi viršūnes' },
        ],
        sprendimas: 'Visos trys pirmosios linijos išeina iš viršūnės, bet baigiasi skirtingai.',
      }),

    // 7. Klaidos radimas
    () =>
      pasirinkimoUzdavinys(naujasId(T10), T10, {
        klausimas: 'Mokinys teigia, kad pusiaukampinė visada dalija priešingą kraštinę pusiau. Ar jis teisus?',
        variantai: [
          'ne, taip yra tik lygiašoniame trikampyje',
          'taip, visada',
          'ne, ji niekada jos nedalija',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Kraštinę pusiau dalija pusiaukraštinė, o pusiaukampinė — kampą.',
        brezinys: trikampioLinija('pusiaukampine'),
      }),
  ])
}

// ── 7.5. Lygiagretainis ─────────────────────────────────────────────────────

const T11 = 'lygiagretainis-7'

const A_LYGIAGRETAINIS = [
  {
    klausimas: 'Kiek laipsnių sudaro gretimų lygiagretainio kampų suma?',
    atsakymas: '180',
    atsakymasRodymui: '$180°$',
    sprendimas: 'Gretimi kampai yra vienašaliai prie lygiagrečiųjų kraštinių.',
  },
] as const

export const lygiagretainis7: Generatorius = () => suBandymais(kurkLygiagretaini, A_LYGIAGRETAINIS, T11)

function kurkLygiagretaini(): Uzdavinys | null {
  const kampas = atsitiktinis(35, 80)
  const a = atsitiktinis(4, 15)
  const b = atsitiktinis(4, 15)
  if (a === b) return null

  return variacija([
    // 1. Gretimas kampas
    () =>
      uzdavinys(T11, {
        klausimas: `Vienas lygiagretainio kampas lygus ${kampas}°. Kiek laipsnių turi jam gretimas kampas?`,
        atsakymas: String(180 - kampas),
        atsakymasRodymui: `$${180 - kampas}°$`,
        sprendimas: `Gretimų kampų suma 180°: $180 - ${kampas} = ${180 - kampas}$.`,
        brezinys: keturkampis('lygiagretainis', true),
      }),

    // 2. Priešingas kampas
    () =>
      uzdavinys(T11, {
        klausimas: `Vienas lygiagretainio kampas lygus ${kampas}°. Kiek laipsnių turi jam priešingas kampas?`,
        atsakymas: String(kampas),
        atsakymasRodymui: `$${kampas}°$`,
        sprendimas: 'Priešingi lygiagretainio kampai lygūs.',
      }),

    // 3. Savybės
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Kuri savybė galioja kiekvienam lygiagretainiui?',
        variantai: [
          'priešingos kraštinės lygios ir lygiagrečios',
          'visos kraštinės lygios',
          'visi kampai statieji',
          'įstrižainės lygios',
        ],
        teisingas: 0,
        sprendimas: 'Lygios kraštinės ir lygūs priešingi kampai — pagrindinės lygiagretainio savybės.',
        brezinys: keturkampis('lygiagretainis'),
      }),

    // 4. Perimetras
    () =>
      uzdavinys(T11, {
        klausimas: `Lygiagretainio gretimos kraštinės ${a} cm ir ${b} cm. Koks jo perimetras?`,
        atsakymas: String(2 * (a + b)),
        atsakymasRodymui: `$${2 * (a + b)}$ cm`,
        sprendimas: `$2 \\cdot (${a} + ${b}) = ${2 * (a + b)}$.`,
      }),

    // 5. Įstrižainės
    () =>
      pasirinkimoUzdavinys(naujasId(T11), T11, {
        klausimas: 'Ką galima pasakyti apie lygiagretainio įstrižaines?',
        variantai: [
          'jos susikirsdamos dalijasi pusiau',
          'jos lygios',
          'jos statmenos',
          'jos dalija kampus pusiau',
        ],
        teisingas: 0,
        sprendimas: 'Lygios įstrižainės būdingos stačiakampiui, statmenos — rombui.',
      }),

    // 6. Kraštinė iš perimetro
    () =>
      uzdavinys(T11, {
        klausimas: `Lygiagretainio perimetras ${2 * (a + b)} cm, viena kraštinė ${a} cm. Kokio ilgio gretima kraštinė?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `$${2 * (a + b)} : 2 - ${a} = ${b}$.`,
      }),

    // 7. Visų kampų suma
    () =>
      uzdavinys(T11, {
        klausimas: 'Kiek laipsnių sudaro visų keturių lygiagretainio kampų suma?',
        atsakymas: '360',
        atsakymasRodymui: `$360°$`,
        sprendimas: 'Bet kurio keturkampio kampų suma lygi 360°.',
      }),
  ])
}

// ── 7.6. Stačiakampis ───────────────────────────────────────────────────────

const T12 = 'staciakampis-7'

const A_STACIAKAMPIS = [
  {
    klausimas: 'Ką galima pasakyti apie stačiakampio įstrižaines?',
    atsakymas: 'jos lygios',
    atsakymasRodymui: 'Jos lygios',
    sprendimas: 'Ir dar susikirsdamos dalijasi pusiau.',
  },
] as const

export const staciakampis7: Generatorius = () => suBandymais(kurkStaciakampi, A_STACIAKAMPIS, T12)

function kurkStaciakampi(): Uzdavinys | null {
  const a = atsitiktinis(3, 15)
  const b = atsitiktinis(3, 15)
  if (a === b) return null

  return variacija([
    // 1. Įstrižainės
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ką galima pasakyti apie stačiakampio įstrižaines?',
        variantai: [
          'jos lygios ir susikirsdamos dalijasi pusiau',
          'jos statmenos',
          'jos dalija kampus pusiau',
          'jos nelygios',
        ],
        teisingas: 0,
        sprendimas: 'Įstrižainių lygumas yra būtent stačiakampio požymis.',
        brezinys: keturkampis('staciakampis'),
      }),

    // 2. Kampai
    () =>
      uzdavinys(T12, {
        klausimas: 'Kiek laipsnių turi kiekvienas stačiakampio kampas?',
        atsakymas: '90',
        atsakymasRodymui: `$90°$`,
        sprendimas: '$360 : 4 = 90$.',
      }),

    // 3. Ar stačiakampis yra lygiagretainis
    () =>
      pasirinkimoUzdavinys(naujasId(T12), T12, {
        klausimas: 'Ar stačiakampis yra lygiagretainis?',
        variantai: [
          'taip, jo priešingos kraštinės lygiagrečios',
          'ne, tai skirtingos figūros',
          'taip, bet tik kvadratas',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Stačiakampis yra lygiagretainis, kurio visi kampai statieji.',
      }),

    // 4. Perimetras
    () =>
      uzdavinys(T12, {
        klausimas: `Stačiakampio kraštinės ${a} cm ir ${b} cm. Koks jo perimetras?`,
        atsakymas: String(2 * (a + b)),
        atsakymasRodymui: `$${2 * (a + b)}$ cm`,
        sprendimas: `$2 \\cdot (${a} + ${b}) = ${2 * (a + b)}$.`,
      }),

    // 5. Plotas
    () =>
      uzdavinys(T12, {
        klausimas: `Stačiakampio kraštinės ${a} cm ir ${b} cm. Koks jo plotas?`,
        atsakymas: String(a * b),
        atsakymasRodymui: `$${a * b}$ cm²`,
        sprendimas: `$${a} \\cdot ${b} = ${a * b}$.`,
      }),

    // 6. Simetrijos ašys
    () =>
      uzdavinys(T12, {
        klausimas: 'Kiek simetrijos ašių turi stačiakampis, kuris nėra kvadratas?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Ašys eina per priešingų kraštinių vidurio taškus; įstrižainės simetrijos ašys nėra.',
      }),

    // 7. Įstrižainės dalis
    () => {
      const istrizaine = atsitiktinis(6, 20) * 2
      return uzdavinys(T12, {
        klausimas: `Stačiakampio įstrižainė ${istrizaine} cm. Kokio ilgio atkarpa nuo įstrižainių susikirtimo taško iki viršūnės?`,
        atsakymas: String(istrizaine / 2),
        atsakymasRodymui: `$${istrizaine / 2}$ cm`,
        sprendimas: 'Įstrižainės susikirsdamos dalijasi pusiau.',
      })
    },
  ])
}

// ── 7.7. Rombas ─────────────────────────────────────────────────────────────

const T13 = 'rombas-7'

const A_ROMBAS = [
  {
    klausimas: 'Ką galima pasakyti apie rombo įstrižaines?',
    atsakymas: 'jos statmenos',
    atsakymasRodymui: 'Jos statmenos ir dalija kampus pusiau',
    sprendimas: 'Ir dar susikirsdamos dalijasi pusiau.',
  },
] as const

export const rombas7: Generatorius = () => suBandymais(kurkRomba, A_ROMBAS, T13)

function kurkRomba(): Uzdavinys | null {
  const krastine = atsitiktinis(3, 15)
  const kampas = atsitiktinis(40, 80)

  return variacija([
    // 1. Įstrižainės
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Ką galima pasakyti apie rombo įstrižaines?',
        variantai: [
          'jos statmenos ir dalija rombo kampus pusiau',
          'jos lygios',
          'jos nesikerta',
          'jos lygiagrečios kraštinėms',
        ],
        teisingas: 0,
        sprendimas: 'Įstrižainių statmenumas yra rombo požymis.',
        brezinys: keturkampis('rombas'),
      }),

    // 2. Kraštinės
    () =>
      pasirinkimoUzdavinys(naujasId(T13), T13, {
        klausimas: 'Kuo rombas skiriasi nuo bet kurio lygiagretainio?',
        variantai: [
          'visos jo kraštinės lygios',
          'visi jo kampai statieji',
          'jo įstrižainės lygios',
          'jis neturi lygiagrečių kraštinių',
        ],
        teisingas: 0,
        sprendimas: 'Rombas yra lygiagretainis su lygiomis kraštinėmis.',
      }),

    // 3. Perimetras
    () =>
      uzdavinys(T13, {
        klausimas: `Rombo kraštinė ${krastine} cm. Koks jo perimetras?`,
        atsakymas: String(4 * krastine),
        atsakymasRodymui: `$${4 * krastine}$ cm`,
        sprendimas: `$${krastine} \\cdot 4 = ${4 * krastine}$.`,
      }),

    // 4. Kraštinė iš perimetro
    () =>
      uzdavinys(T13, {
        klausimas: `Rombo perimetras ${4 * krastine} cm. Kokio ilgio jo kraštinė?`,
        atsakymas: String(krastine),
        atsakymasRodymui: `$${krastine}$ cm`,
        sprendimas: `$${4 * krastine} : 4 = ${krastine}$.`,
      }),

    // 5. Gretimas kampas
    () =>
      uzdavinys(T13, {
        klausimas: `Vienas rombo kampas lygus ${kampas}°. Kiek laipsnių turi jam gretimas kampas?`,
        atsakymas: String(180 - kampas),
        atsakymasRodymui: `$${180 - kampas}°$`,
        sprendimas: `$180 - ${kampas} = ${180 - kampas}$.`,
      }),

    // 6. Įstrižainės dalijamas kampas
    () =>
      uzdavinys(T13, {
        klausimas: `Rombo kampas lygus ${kampas}°. Kiek laipsnių turi kampas tarp kraštinės ir iš to kampo išeinančios įstrižainės?`,
        atsakymas: String(kampas / 2),
        atsakymasRodymui: `$${kampas / 2}°$`,
        sprendimas: 'Rombo įstrižainė dalija kampą pusiau.',
      }),

    // 7. Simetrijos ašys
    () =>
      uzdavinys(T13, {
        klausimas: 'Kiek simetrijos ašių turi rombas, kuris nėra kvadratas?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Simetrijos ašys yra abi įstrižainės.',
        brezinys: keturkampis('rombas'),
      }),
  ])
}

// ── 7.8. Kvadratas ──────────────────────────────────────────────────────────

const T14 = 'kvadratas-7'

const A_KVADRATAS = [
  {
    klausimas: 'Kiek simetrijos ašių turi kvadratas?',
    atsakymas: '4',
    atsakymasRodymui: '$4$',
    sprendimas: 'Dvi per kraštinių vidurius ir dvi įstrižainės.',
  },
] as const

export const kvadratas7: Generatorius = () => suBandymais(kurkKvadrata, A_KVADRATAS, T14)

function kurkKvadrata(): Uzdavinys | null {
  const a = atsitiktinis(3, 18)

  return variacija([
    // 1. Simetrijos ašys
    () =>
      uzdavinys(T14, {
        klausimas: 'Kiek simetrijos ašių turi kvadratas?',
        atsakymas: '4',
        atsakymasRodymui: '$4$',
        sprendimas: 'Dvi eina per priešingų kraštinių vidurius, dvi — per įstrižaines.',
        brezinys: keturkampis('kvadratas'),
      }),

    // 2. Kvadratas kaip rombas ir stačiakampis
    () =>
      pasirinkimoUzdavinys(naujasId(T14), T14, {
        klausimas: 'Kuo kvadratas ypatingas tarp keturkampių?',
        variantai: [
          'jis yra kartu ir rombas, ir stačiakampis',
          'jis nėra lygiagretainis',
          'jo įstrižainės nelygios',
          'jo kampai nelygūs',
        ],
        teisingas: 0,
        sprendimas: 'Kvadratas turi visas rombo ir visas stačiakampio savybes.',
      }),

    // 3. Perimetras
    () =>
      uzdavinys(T14, {
        klausimas: `Kvadrato kraštinė ${a} cm. Koks jo perimetras?`,
        atsakymas: String(4 * a),
        atsakymasRodymui: `$${4 * a}$ cm`,
        sprendimas: `$${a} \\cdot 4 = ${4 * a}$.`,
      }),

    // 4. Plotas
    () =>
      uzdavinys(T14, {
        klausimas: `Kvadrato kraštinė ${a} cm. Koks jo plotas?`,
        atsakymas: String(a * a),
        atsakymasRodymui: `$${a * a}$ cm²`,
        sprendimas: `$${a} \\cdot ${a} = ${a * a}$.`,
      }),

    // 5. Kraštinė iš ploto
    () =>
      uzdavinys(T14, {
        klausimas: `Kvadrato plotas ${a * a} cm². Kokio ilgio jo kraštinė?`,
        atsakymas: String(a),
        atsakymasRodymui: `$${a}$ cm`,
        sprendimas: `Ieškomas skaičius, kurio kvadratas lygus ${a * a}: tai ${a}.`,
      }),

    // 6. Įstrižainių kampas
    () =>
      uzdavinys(T14, {
        klausimas: 'Kiek laipsnių turi kampas tarp kvadrato įstrižainių?',
        atsakymas: '90',
        atsakymasRodymui: `$90°$`,
        sprendimas: 'Kvadratas yra rombas, tad jo įstrižainės statmenos.',
      }),

    // 7. Įstrižainė ir kampas
    () =>
      uzdavinys(T14, {
        klausimas: 'Kiek laipsnių turi kampas tarp kvadrato kraštinės ir įstrižainės?',
        atsakymas: '45',
        atsakymasRodymui: `$45°$`,
        sprendimas: 'Įstrižainė dalija statųjį kampą pusiau: $90 : 2 = 45$.',
        brezinys: keturkampis('kvadratas'),
      }),
  ])
}

// ── 7.9. Trapecija ──────────────────────────────────────────────────────────

const T15 = 'trapecija-7'

const A_TRAPECIJA = [
  {
    klausimas: 'Kiek lygiagrečių kraštinių porų turi trapecija?',
    atsakymas: '1',
    atsakymasRodymui: '$1$',
    sprendimas: 'Lygiagrečiosios kraštinės vadinamos pagrindais.',
  },
] as const

export const trapecija7: Generatorius = () => suBandymais(kurkTrapecija, A_TRAPECIJA, T15)

function kurkTrapecija(): Uzdavinys | null {
  const a = atsitiktinis(6, 20)
  const b = atsitiktinis(3, a - 1)
  const kampas = atsitiktinis(40, 80)

  return variacija([
    // 1. Kiek lygiagrečių porų
    () =>
      uzdavinys(T15, {
        klausimas: 'Kiek lygiagrečių kraštinių porų turi trapecija?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Jei lygiagrečios būtų abi poros, figūra būtų lygiagretainis.',
        brezinys: keturkampis('trapecija'),
      }),

    // 2. Pagrindai ir šoninės
    () =>
      pasirinkimoUzdavinys(naujasId(T15), T15, {
        klausimas: 'Kaip vadinamos lygiagrečiosios trapecijos kraštinės?',
        variantai: ['pagrindais', 'šoninėmis kraštinėmis', 'įstrižainėmis', 'aukštinėmis'],
        teisingas: 0,
        sprendimas: 'Nelygiagrečios kraštinės vadinamos šoninėmis.',
        brezinys: keturkampis('trapecija'),
      }),

    // 3. Vidurinė linija
    () => {
      if ((a + b) % 2 !== 0) return null
      return uzdavinys(T15, {
        klausimas: `Trapecijos pagrindai ${a} cm ir ${b} cm. Kokio ilgio jos vidurinė linija?`,
        atsakymas: String((a + b) / 2),
        atsakymasRodymui: `$${(a + b) / 2}$ cm`,
        sprendimas: `Vidurinė linija lygi pagrindų pussumei: $(${a} + ${b}) : 2 = ${(a + b) / 2}$.`,
      })
    },

    // 4. Vienašaliai kampai
    () =>
      uzdavinys(T15, {
        klausimas: `Trapecijos kampas prie šoninės kraštinės lygus ${kampas}°. Kiek laipsnių turi kitas kampas prie tos pačios šoninės kraštinės?`,
        atsakymas: String(180 - kampas),
        atsakymasRodymui: `$${180 - kampas}°$`,
        sprendimas: 'Prie šoninės kraštinės esantys kampai yra vienašaliai prie lygiagrečiųjų pagrindų, tad jų suma 180°.',
      }),

    // 5. Kampų suma
    () =>
      uzdavinys(T15, {
        klausimas: 'Kiek laipsnių sudaro visų trapecijos kampų suma?',
        atsakymas: '360',
        atsakymasRodymui: `$360°$`,
        sprendimas: 'Trapecija yra keturkampis.',
      }),

    // 6. Antrasis pagrindas
    () => {
      if ((a + b) % 2 !== 0) return null
      return uzdavinys(T15, {
        klausimas: `Trapecijos vidurinė linija ${(a + b) / 2} cm, vienas pagrindas ${a} cm. Kokio ilgio kitas pagrindas?`,
        atsakymas: String(b),
        atsakymasRodymui: `$${b}$ cm`,
        sprendimas: `$${(a + b) / 2} \\cdot 2 - ${a} = ${b}$.`,
      })
    },

    // 7. Ar trapecija yra lygiagretainis
    () =>
      pasirinkimoUzdavinys(naujasId(T15), T15, {
        klausimas: 'Ar trapecija yra lygiagretainis?',
        variantai: [
          'ne, lygiagreti tik viena kraštinių pora',
          'taip',
          'taip, jei ji lygiašonė',
          'to nustatyti neįmanoma',
        ],
        teisingas: 0,
        sprendimas: 'Lygiagretainyje lygiagrečios abi poros.',
      }),
  ])
}

// ── 7.10. Lygiašonė ir stačioji trapecijos ──────────────────────────────────

const T16 = 'trapeciju-rusys'

const A_TRAP_RUSYS = [
  {
    klausimas: 'Kokia trapecija vadinama lygiašone?',
    atsakymas: 'kurios soonines krastines lygios',
    atsakymasRodymui: 'Kurios šoninės kraštinės lygios',
    sprendimas: 'Tada ir kampai prie kiekvieno pagrindo lygūs.',
  },
] as const

export const trapecijuRusys: Generatorius = () => suBandymais(kurkTrapRusis, A_TRAP_RUSYS, T16)

function kurkTrapRusis(): Uzdavinys | null {
  const kampas = atsitiktinis(40, 80)

  return variacija([
    // 1. Lygiašonė
    () =>
      pasirinkimoUzdavinys(naujasId(T16), T16, {
        klausimas: 'Kokia trapecija vadinama lygiašone?',
        variantai: [
          'kurios šoninės kraštinės lygios',
          'kurios pagrindai lygūs',
          'kuri turi statųjį kampą',
          'kurios įstrižainės statmenos',
        ],
        teisingas: 0,
        sprendimas: 'Lygiašonės trapecijos kampai prie kiekvieno pagrindo lygūs.',
      }),

    // 2. Stačioji
    () =>
      pasirinkimoUzdavinys(naujasId(T16), T16, {
        klausimas: 'Kokia trapecija vadinama stačiąja?',
        variantai: [
          'kurios viena šoninė kraštinė statmena pagrindams',
          'kurios visi kampai statieji',
          'kurios įstrižainės lygios',
          'kurios pagrindai lygūs',
        ],
        teisingas: 0,
        sprendimas: 'Tada du jos kampai yra statieji.',
      }),

    // 3. Kampai prie pagrindo
    () =>
      uzdavinys(T16, {
        klausimas: `Lygiašonės trapecijos kampas prie didesniojo pagrindo lygus ${kampas}°. Kiek laipsnių turi kitas kampas prie to paties pagrindo?`,
        atsakymas: String(kampas),
        atsakymasRodymui: `$${kampas}°$`,
        sprendimas: 'Lygiašonės trapecijos kampai prie kiekvieno pagrindo lygūs.',
      }),

    // 4. Kampas prie kito pagrindo
    () =>
      uzdavinys(T16, {
        klausimas: `Lygiašonės trapecijos kampas prie didesniojo pagrindo lygus ${kampas}°. Kiek laipsnių turi kampas prie mažesniojo pagrindo?`,
        atsakymas: String(180 - kampas),
        atsakymasRodymui: `$${180 - kampas}°$`,
        sprendimas: `Vienašalių kampų suma 180°: $180 - ${kampas} = ${180 - kampas}$.`,
      }),

    // 5. Stačiosios kampai
    () =>
      uzdavinys(T16, {
        klausimas: 'Kiek stačiųjų kampų turi stačioji trapecija?',
        atsakymas: '2',
        atsakymasRodymui: '$2$',
        sprendimas: 'Statmena šoninė kraštinė sudaro statųjį kampą su abiem pagrindais.',
      }),

    // 6. Įstrižainės
    () =>
      pasirinkimoUzdavinys(naujasId(T16), T16, {
        klausimas: 'Ką galima pasakyti apie lygiašonės trapecijos įstrižaines?',
        variantai: ['jos lygios', 'jos statmenos', 'jos dalijasi pusiau', 'jos lygiagrečios'],
        teisingas: 0,
        sprendimas: 'Įstrižainių lygumas yra lygiašonės trapecijos požymis.',
      }),

    // 7. Simetrijos ašis
    () =>
      uzdavinys(T16, {
        klausimas: 'Kiek simetrijos ašių turi lygiašonė trapecija?',
        atsakymas: '1',
        atsakymasRodymui: '$1$',
        sprendimas: 'Ašis eina per abiejų pagrindų vidurio taškus.',
      }),
  ])
}

// ── 7.11. Daugiakampiai koordinačių plokštumoje ─────────────────────────────

const T17 = 'daugiakampiai-plokstumoje'

const A_DAUGIAKAMPIAI = [
  {
    klausimas: 'Kokia figūra gaunama sujungus taškus $(-2; 1)$, $(2; 1)$, $(2; 4)$, $(-2; 4)$?',
    atsakymas: 'staciakampis',
    atsakymasRodymui: 'Stačiakampis',
    sprendimas: 'Kraštinės po 4 ir 3 vienetus, visi kampai statieji.',
  },
] as const

export const daugiakampiaiPlokstumoje: Generatorius = () => suBandymais(kurkDaugiakampius, A_DAUGIAKAMPIAI, T17)

function kurkDaugiakampius(): Uzdavinys | null {
  const x1 = atsitiktinis(-4, 0)
  const y1 = atsitiktinis(-4, 0)
  const plotis = atsitiktinis(2, 5)
  const aukstis = atsitiktinis(2, 5)
  const x2 = x1 + plotis
  const y2 = y1 + aukstis
  if (x2 > 5 || y2 > 5) return null

  const virsunes: [number, number][] = [
    [x1, y1],
    [x2, y1],
    [x2, y2],
    [x1, y2],
    [x1, y1],
  ]

  return variacija([
    // 1. Kokia figūra
    () =>
      pasirinkimoUzdavinys(naujasId(T17), T17, {
        klausimas: `Kokia figūra gaunama sujungus taškus $(${x1}; ${y1})$, $(${x2}; ${y1})$, $(${x2}; ${y2})$, $(${x1}; ${y2})$?`,
        variantai:
          plotis === aukstis
            ? ['kvadratas', 'trapecija', 'rombas', 'trikampis']
            : ['stačiakampis', 'trapecija', 'rombas', 'trikampis'],
        teisingas: 0,
        sprendimas: `Kraštinės lygios ${plotis} ir ${aukstis} vienetams, o visi kampai statieji.`,
        brezinys: koordinaciuPlokstuma([], 5, [virsunes]),
      }),

    // 2. Perimetras
    () =>
      uzdavinys(T17, {
        klausimas: 'Koks yra pavaizduotos figūros perimetras?',
        atsakymas: String(2 * (plotis + aukstis)),
        atsakymasRodymui: `$${2 * (plotis + aukstis)}$`,
        sprendimas: `$2 \\cdot (${plotis} + ${aukstis}) = ${2 * (plotis + aukstis)}$.`,
        brezinys: koordinaciuPlokstuma([], 5, [virsunes]),
      }),

    // 3. Plotas
    () =>
      uzdavinys(T17, {
        klausimas: 'Koks yra pavaizduotos figūros plotas?',
        atsakymas: String(plotis * aukstis),
        atsakymasRodymui: `$${plotis * aukstis}$`,
        sprendimas: `$${plotis} \\cdot ${aukstis} = ${plotis * aukstis}$.`,
        brezinys: koordinaciuPlokstuma([], 5, [virsunes]),
      }),

    // 4. Kraštinės ilgis
    () =>
      uzdavinys(T17, {
        klausimas: `Kokio ilgio yra atkarpa tarp taškų $(${x1}; ${y1})$ ir $(${x2}; ${y1})$?`,
        atsakymas: String(plotis),
        atsakymasRodymui: `$${plotis}$`,
        sprendimas: `Ordinatės vienodos, tad ilgis yra abscisių skirtumas: $${minus(x2, x1)} = ${plotis}$.`,
      }),

    // 5. Trūkstama viršūnė
    () =>
      uzdavinys(T17, {
        klausimas: `Stačiakampio trys viršūnės yra $(${x1}; ${y1})$, $(${x2}; ${y1})$ ir $(${x2}; ${y2})$. Kokia ketvirtosios viršūnės abscisė?`,
        atsakymas: String(x1),
        atsakymasRodymui: `$${x1}$`,
        sprendimas: 'Ketvirtoji viršūnė yra virš pirmosios, tad jų abscisės sutampa.',
      }),

    // 6. Trikampio plotas
    () => {
      if ((plotis * aukstis) % 2 !== 0) return null
      return uzdavinys(T17, {
        klausimas: `Trikampio viršūnės yra $(${x1}; ${y1})$, $(${x2}; ${y1})$ ir $(${x1}; ${y2})$. Koks jo plotas?`,
        atsakymas: String((plotis * aukstis) / 2),
        atsakymasRodymui: `$${(plotis * aukstis) / 2}$`,
        sprendimas: `Statiniai lygūs ${plotis} ir ${aukstis}: $${plotis} \\cdot ${aukstis} : 2 = ${(plotis * aukstis) / 2}$.`,
      })
    },

    // 7. Kraštinių lygiagretumas
    () =>
      pasirinkimoUzdavinys(naujasId(T17), T17, {
        klausimas: `Kokia yra kraštinė, jungianti taškus $(${x1}; ${y1})$ ir $(${x2}; ${y1})$?`,
        variantai: ['lygiagreti $x$ ašiai', 'lygiagreti $y$ ašiai', 'įstriža', 'einanti per pradžios tašką'],
        teisingas: 0,
        sprendimas: 'Ordinatės vienodos, tad visi kraštinės taškai nutolę nuo $x$ ašies vienodai.',
      }),
  ])
}
