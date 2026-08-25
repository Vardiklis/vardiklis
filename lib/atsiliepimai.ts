import type { StaticImageData } from 'next/image'
import justeNuotrauka from '@/public/atsiliepimai/juste.jpg'
import redaNuotrauka from '@/public/atsiliepimai/reda.jpg'

/**
 * Atsiliepimai iš paslaugos.lt profilio.
 *
 * Tekstai perrašyti PAŽODŽIUI, su visomis originalo rašybos klaidomis ir be
 * diakritikų ten, kur jų nebuvo — taisyti svetimą atsiliepimą reikštų jį
 * perrašyti. Rodomi ir `Atsiliepimai.tsx` kortelėse, ir struktūriniuose
 * duomenyse (`JsonLd.tsx`), tad naujas įrašas čia iškart matomas abiejose
 * vietose.
 *
 * Tvarka — nuo naujausio: karuselė sukasi ratu, bet pradedama nuo sąrašo
 * pradžios, tad priekyje turi būti šviežiausi atsiliepimai.
 */
export type Atsiliepimas = {
  /** Stabilus raktas React'ui — vardas nebūtinai unikalus. */
  id: string
  vardas: string
  /** „Atlikta paslauga“ eilutė iš paslaugos.lt. */
  paslauga: string
  /** Kada paslauga atlikta, `YYYY-MM`. */
  paslaugosData: string
  tekstas: string
  /** Kada atsiliepimas paliktas, ISO `YYYY-MM-DD` — reikalingas `<time>`. */
  data: string
  /** Visi keturi paslaugos.lt kriterijai kol kas — po 5 iš 5. */
  ivertinimas: 1 | 2 | 3 | 4 | 5
  /** Profilio nuotrauka. Jos neturint kortelėje piešiami inicialai. */
  nuotrauka?: StaticImageData
}

export const atsiliepimai: Atsiliepimas[] = [
  {
    id: 'jurgita-tvarijonaviciene',
    vardas: 'Jurgita Tvarijonaviciene',
    paslauga: 'Papildomas matematikos mokymas',
    paslaugosData: '2026-01',
    tekstas:
      'Likome labai patenkinti pamokomis. Puikus destymas, suprantamai ir aiskiai paruose NMPP. Aciu didelis, Modesta ❤️',
    data: '2026-08-25',
    ivertinimas: 5,
  },
  {
    id: 'reda-mingeliene',
    vardas: 'Reda Mingėlienė',
    paslauga: 'Papildomas matematikos mokymas internetu',
    paslaugosData: '2026-05',
    tekstas:
      'Labai džiaugiamės pasirinkę Modestą matematikos korepetitore. Ji labai kantri, išsamiai ir suprantamai paaiškina, visada maloniai atsako į klausimus. Dukra į pamokas jungėsi noriai, todėl mokymasis tapo daug lengvesnis ir malonesnis. Nuoširdžiai rekomenduojame!',
    data: '2026-08-17',
    ivertinimas: 5,
    nuotrauka: redaNuotrauka,
  },
  {
    id: 'evelina',
    vardas: 'Evelina',
    paslauga: 'Papildomas matematikos mokymas',
    paslaugosData: '2026-01',
    tekstas:
      'Tik patys geriausi atsiliepimai apie Modestos, kaip korepetitorės, darbą. Mano dukra visada noriai lankė užsiėmimus, o mokymosi rezultatai tikrai pastebimai pagerėjo. Ačiū už profesionalumą ir nuoširdų darbą! :)',
    data: '2026-07-03',
    ivertinimas: 5,
  },
  {
    id: 'ieva-buzaite',
    vardas: 'Ieva Buzaitė',
    paslauga: 'Pagalba sprendžiant matematinius uždavinius',
    paslaugosData: '2025-12',
    tekstas:
      'Nuostabi korepetitorė, labai atsakinga, kantri, be jos nebūčiau išlaikiusi matematikos egzamino:) ačiū, labai labai rekomenduoju!!!',
    data: '2026-01-28',
    ivertinimas: 5,
  },
  {
    id: 'dominyka-vaskevice',
    vardas: 'Dominyka Vaškevičė',
    paslauga: 'Papildomas matematikos mokymas',
    paslaugosData: '2026-01',
    tekstas: 'Per porą mėnesių pažymiai iš 5 pakilo iki 7. Tikrai rekomenduoju!',
    data: '2026-01-22',
    ivertinimas: 5,
  },
  {
    id: 'tomas-tt',
    vardas: 'Tomas TT',
    paslauga: 'Papildomas matematikos mokymas internetu',
    paslaugosData: '2025-10',
    tekstas:
      'Modesta padejo sūnui pasiruosti matematikos puppui ir padėjo prisiminti praeitas temas. Labai patenkinti rezultatais.',
    data: '2026-01-22',
    ivertinimas: 5,
  },
  {
    id: 'juste-aganauskaite',
    vardas: 'Justė Aganauskaitė',
    paslauga: 'Papildomas matematikos mokymas',
    paslaugosData: '2025-11',
    tekstas:
      'Labai ačiū! Pažymiai pagerėjo, gerai pateikia medžiagą, aiškiai paaiškina. Rekomenduoju!',
    data: '2026-01-22',
    ivertinimas: 5,
    nuotrauka: justeNuotrauka,
  },
  {
    id: 'jurate-jarmalaviciute',
    vardas: 'Jūratė Jarmalavičiūtė',
    paslauga: 'Pagalba sprendžiant matematinius uždavinius',
    paslaugosData: '2025-07',
    tekstas: 'Dėkojame!! Pagaliau dingo baimė matematikai, pažymiai pagerėjo nuo 5 iki 6',
    data: '2026-01-22',
    ivertinimas: 5,
  },
  {
    id: 'rugile',
    vardas: 'Rugilė',
    paslauga: 'Papildomas matematikos mokymas internetu',
    paslaugosData: '2024-01',
    tekstas:
      'Dėkoju už kantrybę ir atsakingą darbą. Visos pamokos buvo organizuotos ir padėjo pasiekti geresnių rezultatų.',
    data: '2026-01-22',
    ivertinimas: 5,
  },
]

/** Iš kur atsiliepimai — rodoma po karusele ir `JsonLd` kaip `publisher`. */
export const atsiliepimuSaltinis = {
  pavadinimas: 'paslaugos.lt',
  url: 'https://paslaugos.lt/modesta-mm4002',
} as const

/**
 * Vidurkis skaičiuojamas, o ne rašomas ranka — kitaip pridėjus ketvertą
 * struktūriniai duomenys pradėtų meluoti, o niekas to nepastebėtų.
 */
export const vidutinisIvertinimas =
  atsiliepimai.reduce((s, a) => s + a.ivertinimas, 0) / atsiliepimai.length
