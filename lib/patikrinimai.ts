/**
 * NMPP ir PUPP aprašomoji informacija puslapiams.
 *
 * VISKAS ČIA — VIEŠAI SKELBIAMI FAKTAI, NE UŽDUOTYS. Datos ir vykdymo tvarka
 * paimtos iš Švietimo, mokslo ir sporto ministerijos patvirtinto tvarkaraščio
 * ir NŠA puslapių. Jokia užduotis ir joks jos fragmentas čia neperrašomas.
 *
 * DATŲ GALIOJIMAS. Naujausias viešai paskelbtas tvarkaraštis — 2025–2026
 * mokslo metų. Todėl lentelė aiškiai pažymėta mokslo metais, o ne pateikta
 * kaip „artimiausios datos“. Pasirodžius kitų metų tvarkaraščiui, pakeisti
 * reikia tik `tvarkarastis` lauką.
 */

export type Faktas = { pavadinimas: string; tekstas: string }

export type TvarkarascioEilute = {
  klase: string
  dalykas: string
  data: string
}

export type Nuoroda = { tekstas: string; url: string }

export type Patikrinimas = {
  grupe: 'pupp' | 'nmpp'
  trumpai: string
  pavadinimas: string
  pilnas: string
  paantraste: string
  metaAntraste: string
  metaAprasymas: string
  ivadas: string[]
  faktai: Faktas[]
  tvarkarastis: {
    metai: string
    eilutes: TvarkarascioEilute[]
    pastaba: string
  }
  demesio: { antraste: string; tekstas: string }
  kasKartojama: string
  nuorodos: Nuoroda[]
}

const NSA_NMPP =
  'https://www.nsa.smsm.lt/pasiekimu-departamentas/egzaminai-ir-pasiekimu-patikrinimai/nacionaliniai-mokiniu-pasiekimu-patikrinimai/'
const NSA_NMPP_TVARKARASCIAI =
  'https://www.nsa.smsm.lt/pasiekimu-departamentas/egzaminai-ir-pasiekimu-patikrinimai/nacionaliniai-mokiniu-pasiekimu-patikrinimai/nmpp-tvarkarasciai/'
const NSA_NMPP_UZDUOTYS =
  'https://www.nsa.smsm.lt/pasiekimu-departamentas/egzaminai-ir-pasiekimu-patikrinimai/nacionaliniai-mokiniu-pasiekimu-patikrinimai/nmpp-uzduotys/'
const NSA_PUPP_PAVYZDZIAI =
  'https://www.nsa.smsm.lt/pasiekimu-departamentas/egzaminai-ir-pasiekimu-patikrinimai/pagrindinio-ugdymo-pasiekimu-patikrinimai/pupp-uzduociu-pavyzdziai/'
const NSA_PUPP_TVARKARASTIS =
  'https://www.nsa.smsm.lt/pasiekimu-departamentas/egzaminai-ir-pasiekimu-patikrinimai/pagrindinio-ugdymo-pasiekimu-patikrinimai/pupp-tvarkarastis/'
const NSA_PUPP =
  'https://www.nsa.smsm.lt/pasiekimu-departamentas/egzaminai-ir-pasiekimu-patikrinimai/pagrindinio-ugdymo-pasiekimu-patikrinimai/'
const NSA = 'https://www.nsa.smsm.lt/'

export const NMPP: Patikrinimas = {
  grupe: 'nmpp',
  trumpai: 'NMPP',
  pavadinimas: 'NMPP matematikos pasiruošimo užduotys',
  pilnas: 'Nacionaliniai mokinių pasiekimų patikrinimai',
  paantraste:
    'Pasiruošimo užduotys 4 ir 8 klasės matematikos NMPP: tokia pati trukmė ir tos pačios turinio sritys. Kiekvienas variantas — su atsakymais.',
  metaAntraste: 'NMPP matematikos pasiruošimo užduotys — 4 ir 8 klasė, PDF',
  metaAprasymas:
    'Nemokamos pasiruošimo užduotys NMPP matematikai: 4 klasei 60 min., 8 klasei 90 min., tos pačios turinio sritys. Atsisiųsk PDF su atsakymais.',
  ivadas: [
    'NMPP nėra egzaminas. Tai diagnostinis patikrinimas, kurio tikslas — parodyti mokiniui, tėvams ir mokytojui, kur pasiekimai stiprūs, o kur liko spragų. Rezultatas neturi įtakos kėlimui į aukštesnę klasę ir neverčiamas metiniu pažymiu.',
    'Patikrinimas vykdomas elektroniniu būdu, o užduotys vertinamos automatiškai, todėl preliminarų taškų skaičių mokinys mato beveik iš karto. Būtent dėl automatinio vertinimo NMPP nebūna ilgų rašytinių sprendimų — vyrauja pasirenkamojo ir trumpojo atsakymo uždaviniai.',
  ],
  faktai: [
    { pavadinimas: 'Kam', tekstas: '4 ir 8 klasės mokiniams.' },
    {
      pavadinimas: 'Dalykai',
      tekstas:
        'Matematika ir lietuvių kalba bei literatūra (skaitymas). Tautinių mažumų mokyklose papildomai — gimtoji kalba.',
    },
    {
      pavadinimas: 'Matematikos trukmė',
      tekstas: '4 klasėje — 60 minučių, 8 klasėje — 90 minučių.',
    },
    {
      pavadinimas: 'Kaip vyksta',
      tekstas: 'Elektroniniu būdu; užduotys vertinamos automatiškai.',
    },
    {
      pavadinimas: 'Dalyvavimas',
      tekstas:
        'Privalomas. Dėl svarbių priežasčių mokinys gali būti atleistas mokyklos vadovo įsakymu.',
    },
    {
      pavadinimas: 'Vertinimas',
      tekstas:
        'Keturi pasiekimų lygiai: slenkstinis, patenkinamas, pagrindinis ir aukštesnysis.',
    },
    {
      pavadinimas: 'Įtaka pažymiams',
      tekstas: 'Rezultatas neturi įtakos kėlimui į aukštesnę klasę.',
    },
  ],
  tvarkarastis: {
    metai: '2025–2026 mokslo metai',
    eilutes: [
      { klase: '4 klasė', dalykas: 'Lietuvių kalba ir literatūra (skaitymas)', data: 'kovo 3 d.' },
      { klase: '4 klasė', dalykas: 'Matematika', data: 'kovo 9 d.' },
      { klase: '4 klasė', dalykas: 'Tautinių mažumų gimtoji kalba (skaitymas)', data: 'kovo 13 d.' },
      { klase: '8 klasė', dalykas: 'Lietuvių kalba ir literatūra (skaitymas)', data: 'kovo 17 d.' },
      { klase: '8 klasė', dalykas: 'Matematika', data: 'kovo 23 d.' },
      { klase: '8 klasė', dalykas: 'Tautinių mažumų gimtoji kalba ir literatūra', data: 'kovo 26 d.' },
    ],
    pastaba:
      'Tai naujausias viešai paskelbtas tvarkaraštis. Kitų mokslo metų datas skelbia NŠA — nuoroda puslapio apačioje.',
  },
  demesio: {
    antraste: 'Ką iš tikrųjų reiškia lygiai',
    tekstas:
      'Lygis rodo ne tai, „kiek gerai“ vaikas parašė, o kiek savarankiškai jis geba taikyti tai, ko išmoko: slenkstinis — tik su pagalba ir paprasčiausiose situacijose, aukštesnysis — savarankiškai ir nepažįstamame kontekste. Tėvui naudingiausia ne pati raidė ar lygio pavadinimas, o atsakymas į klausimą, kurių temų uždaviniai nepavyko. Būtent tai rodo, ką verta pakartoti.',
  },
  kasKartojama:
    'NŠA viešai neskelbia NMPP dalių skaidymo taip, kaip PUPP programoje, todėl mūsų lapuose pakartota tik tai, kas paskelbta patikimai: trukmė ir turinio sritys pagal atitinkamos klasės matematikos programą. Uždavinių skaičius ir taškai lapuose — mūsų pasirinkimas.',
  nuorodos: [
    { tekstas: 'NMPP informacija NŠA svetainėje', url: NSA_NMPP },
    { tekstas: 'NMPP tvarkaraščiai', url: NSA_NMPP_TVARKARASCIAI },
    { tekstas: 'Oficialūs NMPP užduočių pavyzdžiai', url: NSA_NMPP_UZDUOTYS },
    { tekstas: 'Nacionalinė švietimo agentūra', url: NSA },
  ],
}

export const PUPP: Patikrinimas = {
  grupe: 'pupp',
  trumpai: 'PUPP',
  pavadinimas: 'PUPP matematikos pasiruošimo užduotys',
  pilnas: 'Pagrindinio ugdymo pasiekimų patikrinimas',
  paantraste:
    'Pasiruošimo užduotys, sudarytos pagal tą pačią struktūrą kaip patikrinimas: trys dalys, 50 taškų, 150 minučių. Kiekvienas variantas — su atsakymais ir sprendimais.',
  metaAntraste: 'PUPP matematikos pasiruošimo užduotys — PDF biblioteka',
  metaAprasymas:
    'Nemokamos pasiruošimo užduotys PUPP matematikai: tos pačios struktūros kaip patikrinime — trys dalys, 50 taškų, 150 minučių. Atsisiųsk PDF su atsakymais ir sprendimais.',
  ivadas: [
    'PUPP laikomas baigiant pagrindinio ugdymo programą, II gimnazijos (10) klasėje. Skirtingai nei NMPP, tai jau patikrinimas, kurio rezultatas fiksuojamas pasiekimų pažymėjime.',
    'Matematikos patikrinimas trunka 150 minučių, iš viso galima surinkti 50 taškų. Trečdalis jų — pilnojo sprendimo uždaviniuose, kur vertinamas ne tik atsakymas, bet ir surašyta sprendimo eiga.',
  ],
  faktai: [
    { pavadinimas: 'Kam', tekstas: 'II gimnazijos (10) klasės mokiniams.' },
    { pavadinimas: 'Trukmė', tekstas: 'Matematikai — 150 minučių.' },
    { pavadinimas: 'Taškai', tekstas: 'Iš viso galima surinkti 50 taškų.' },
    {
      pavadinimas: 'Struktūra',
      tekstas:
        'Trijų tipų uždaviniai: pasirenkamojo atsakymo (10 taškų), trumpojo atsakymo (24 taškai) ir pilnojo sprendimo (16 taškų).',
    },
    {
      pavadinimas: 'Turinys',
      tekstas:
        'Visas I gimnazijos (9) klasės matematikos turinys ir II gimnazijos (10) klasės turinys, išskyrus sritį „Duomenys ir tikimybės“.',
    },
    {
      pavadinimas: 'Pakartotinė sesija',
      tekstas: 'Numatyta mokiniams, surinkusiems mažiau nei 4 taškus.',
    },
  ],
  tvarkarastis: {
    metai: '2025–2026 mokslo metai',
    eilutes: [
      { klase: 'II gimnazijos klasė', dalykas: 'Lietuvių kalba ir literatūra', data: 'gegužės 7 d.' },
      { klase: 'II gimnazijos klasė', dalykas: 'Matematika', data: 'gegužės 13 d.' },
      { klase: 'II gimnazijos klasė', dalykas: 'Tautinių mažumų gimtoji kalba', data: 'gegužės 19 d.' },
      { klase: 'II gimnazijos klasė', dalykas: 'Pakartotinė sesija', data: 'birželio 17–19 d.' },
    ],
    pastaba:
      'Tai naujausias viešai paskelbtas tvarkaraštis. Kitų mokslo metų datas skelbia NŠA — nuoroda puslapio apačioje.',
  },
  demesio: {
    antraste: 'Kur dažniausiai prarandami taškai',
    tekstas:
      'Pilnojo sprendimo uždaviniai duoda 16 taškų iš 50 — beveik trečdalį, ir juose vertinamas surašytas sprendimas, ne vien atsakymas. Tačiau praktikoje didžioji dalis prarandamų taškų ateina ne iš dešimtos klasės medžiagos, o iš trupmenų, procentų ir neigiamų skaičių, kurie tyliai kartojasi kone kiekviename uždavinyje.',
  },
  kasKartojama:
    'PUPP programa viešai skelbia dalių skaičių, uždavinių tipus, taškų pasiskirstymą ir trukmę — tai ne kūrinys, o tvarka, todėl mūsų lapai ją kartoja tiksliai. Patys uždaviniai yra originalūs.',
  nuorodos: [
    { tekstas: 'PUPP užduočių pavyzdžiai NŠA svetainėje', url: NSA_PUPP_PAVYZDZIAI },
    { tekstas: 'PUPP tvarkaraštis', url: NSA_PUPP_TVARKARASTIS },
    { tekstas: 'Pagrindinio ugdymo pasiekimų patikrinimai ir programos', url: NSA_PUPP },
    { tekstas: 'Nacionalinė švietimo agentūra', url: NSA },
  ],
}

export const PATIKRINIMAI: Patikrinimas[] = [NMPP, PUPP]

export function rastPatikrinima(grupe: string): Patikrinimas | undefined {
  return PATIKRINIMAI.find((p) => p.grupe === grupe)
}
