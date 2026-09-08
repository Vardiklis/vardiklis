import { fileURLToPath } from 'node:url'
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

// Aiškiai nurodom šaknį — aukščiau esantis package-lock.json klaidina Turbopack.
const saknis = fileURLToPath(new URL('.', import.meta.url))

// Statiniams puslapiams Next'as pats uždeda `s-maxage=31536000` (metus). Hostinger CDN
// tai gerbia, todėl po naujo diegimo krašte lieka SENAS HTML, rodantis į jau nebeegzuo-
// jančius `/_next/static/chunks/*` failus — iš to gaunam 404, dingusį dizainą ir
// ChunkLoadError. Trumpinam iki minutės, kad kešas pats atsistatytų.
const PUSLAPIO_KESAS = 'public, max-age=0, s-maxage=60, must-revalidate'

const nextConfig: NextConfig = {
  turbopack: { root: saknis },
  outputFileTracingRoot: saknis,
  /**
   * `pdfkit` savo šriftų metrikas (`.afm`) skaito iš disko įprastu `require`
   * keliu. Supakuotas į Next paketą jis tų failų nebranda ir sąskaitos PDF
   * nulūžta — bet tik produkcijoje, kur to jau nebepamatysi. Todėl paliekamas
   * gyventi `node_modules` kaip įprastas Node modulis.
   */
  serverExternalPackages: ['pdfkit'],
  /**
   * Sąskaitos šriftai su lietuviškomis raidėmis. Jie skaitomi per `fs`, tad
   * pėdsakų sekiklis jų pats neranda: savarankiškame diegime failų paprasčiausiai
   * nebūtų. `/*` — nes PDF gaminamas ir maršrute, ir serverio veiksme.
   *
   * PDFKIT ATSKIRAI ADMIN MARŠRUTUI. Būdamas `serverExternalPackages` sąraše,
   * jis nebesupakuojamas, o kviečiamas įprastu `require` — ir tada sekiklis jo
   * neranda ten, kur kodas pasiekiamas tik per serverio veiksmą („Siųsti
   * tėvams“ skydelyje). Maršrute `/vidus/saskaita/[id]` pdfkit atsekamas pats,
   * o admin puslapyje — ne, tad sąskaitos siuntimas lūžtų vien produkcijoje su
   * „Cannot find module 'pdfkit'“. Laužtiniai skliaustai ekranuojami, nes
   * raktas yra šablonas, o ne kelias.
   */
  outputFileTracingIncludes: {
    '/*': ['lib/saskaitos-sriftai/**/*.ttf'],
    '/admin/\\[\\[\\.\\.\\.segments\\]\\]': [
      'lib/saskaitos-sriftai/**/*.ttf',
      'node_modules/pdfkit/**/*',
      'node_modules/fontkit/**/*',
    ],
  },
  images: {
    // Numatytoje eilėje tarp 384 ir 640 nieko nėra, o telefone hero nuotraukai
    // reikia ~420 px (≈210 CSS px × 2 DPR). Naršyklė tada šoka į 640 ir parsiunčia
    // beveik dvigubai daugiau pikselių, nei rodo. 480 tą tarpą užpildo.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 480],
    // Numatytai Next atiduoda tik WebP. AVIF tą patį kadrą supakuoja maždaug
    // trečdaliu mažiau; naršyklė, jo nemokanti, `Accept` antraštėje jo
    // neprašo ir gauna WebP, tad rizikos nėra.
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // `/apie` gyveno sitemap'e ir yra išdalintas nuorodomis. 308 (permanent)
      // perduoda visą surinktą svorį naujam adresui ir nepalieka 404.
      { source: '/apie', destination: '/matematikos-korepetitore', permanent: true },
    ]
  },
  async headers() {
    return [
      { source: '/', headers: [{ key: 'Cache-Control', value: PUSLAPIO_KESAS }] },
      {
        // Viskas, išskyrus statiką, Payload API ir admin skydelį.
        //
        // `p/` ir `vidus/` irgi paliekami nuošalyje: tai ne puslapiai, o
        // veiksmai (pamokos nuorodos atidarymo įrašymas, būsenos pažymėjimas,
        // priminimų siuntimas). Krašte užkešuotas atsakymas reikštų, kad
        // antras paspaudimas serverio nebepasiekia.
        source: '/:kelias((?!_next/|api/|admin|p/|vidus/).+)',
        headers: [{ key: 'Cache-Control', value: PUSLAPIO_KESAS }],
      },
    ]
  },
}

export default withPayload(nextConfig)
