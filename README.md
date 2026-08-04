# Vardiklis

Matematikos diagnostikos svetainė. Nemokamas testas atseka spragą atgal per prielaidų
grandinę ir įvardija tėvui, **kurioje klasėje** vaikui iš tikrųjų nutrūko matematika.

Statinė Next.js svetainė. Be duomenų bazės, be prisijungimo, be analitikos, be API raktų.
Viskas veikia naršyklėje; testo rezultatai niekur nesaugomi.

---

## Paleidimas

Reikia Node 20 arba naujesnio.

```bash
npm install
npm run dev
```

Atsidaro [http://localhost:3000](http://localhost:3000).

Produkcinis variantas:

```bash
npm run build
npm start
```

Aplinkos kintamųjų nereikia. Jei kuriai nors funkcijai prireiktų išorinio serviso —
jos šioje versijoje nedarome.

### Naudingos komandos

| Komanda | Ką daro |
|---|---|
| `npm run dev` | Kūrimo serveris |
| `npm run build` | Produkcinis build'as |
| `npm start` | Paleidžia sukompiliuotą svetainę |
| `npm run lint` | ESLint |
| `npm run patikra` | Sugeneruoja po 100 uždavinių iš kiekvieno generatoriaus ir tikrina, ar nėra bjaurių atsakymų, sugedusio KaTeX ar klaidų grafe |
| `npm run patikra:diagnostika` | Pravažiuoja diagnostiką 8 scenarijais ir parodo, ką grąžina ataskaita |

`npx tsx scripts/patikrink-generatorius.ts 100 --pavyzdziai` papildomai atspausdina
uždavinių pavyzdžius peržiūrai.

---

## Kur ką redaguoti

### Uždavinių biblioteka — `lib/programa.ts`

Visa 1–10 klasių matematikos programa (104 stambieji punktai) surašyta duomenų failu.
Jį naudoja `/uzduotys` puslapis. Tai atskiras dalykas nuo diagnostikos grafo: programa
yra tai, ką vaikas mokosi mokykloje, o grafas — tai, kuo tema remiasi.

```ts
{
  numeris: 3,                              // rodomas paryškintas
  pavadinimas: 'Daugyba, dalyba',
  potemes: ['Daugybos lentelė', '...'],
  generatorius: 'sveikieji',               // jei nėra — tema rodoma kaip „netrukus"
  lygis: 1,                                // numatytasis sunkumas
}
```

Potemė, kuri parašyta tik eilute, paveldi savo temos generatorių. Jei jai tinka kitas —
rašoma objektu:

```ts
potemes: [
  'Racionaliųjų skaičių aibės samprata',
  { pavadinimas: 'Kvadratinė ir kubinė šaknys', generatorius: 'saknys', lygis: 1 },
]
```

Visos 104 temos turi generatorius. Braižymo, transformacijų, figūrų ir duomenų temos
naudoja `lib/generatoriai/braizymas.ts` — jis piešia savo SVG brėžinius, be jokios
geometrijos bibliotekos. Brėžinio spalvos nurodytos kintamaisiais (`var(--ink)`,
`var(--orange)`), tad spausdinant jis pats virsta juodu ant balto.

### Prielaidų grafas — `lib/temos.ts`

**Tai duomenų failas.** Jame nėra ir neturi atsirasti jokios logikos — tik temų sąrašas.
Visa diagnostikos logika gyvena `lib/diagnostika.ts`.

```ts
{
  id: 'bendravardiklinimas',
  pavadinimas: 'Trupmenų suvedimas į bendrą vardiklį',  // matomas tėvams
  klase: 5,
  priklausoNuo: ['dalumas'],        // ką reikia mokėti PRIEŠ šią temą
  generatorius: 'bendravardiklinimas',
}
```

Pridedant naują temą:

1. Įrašyk objektą į `temos` masyvą.
2. `priklausoNuo` surašyk temų, kuriomis ši tema remiasi, `id`.
3. `generatorius` turi sutapti su raktu iš `lib/generatoriai/index.ts`.
4. Paleisk `npm run patikra` — ji patikrins, ar nėra ciklų, ar visos prielaidos
   egzistuoja ir ar prielaida nėra vėlesnės klasės už pačią temą.

`pavadinimas` rodomas ataskaitoje tėvams. Rašyk paprastais žodžiais, be terminų.

### Kontaktai — `lib/kontaktai.ts`

Vienintelė vieta, kur nurodytas el. paštas, telefonas ir vietovė. Pakeitus čia,
pasikeičia navigacijoje, poraštėje, ataskaitoje ir struktūriniuose duomenyse.

### Nuotrauka — `public/Modesta.jpg`

Naudojama `/apie` puslapyje. Pakeitus failą tuo pačiu vardu, daugiau nieko keisti nereikia.

### Socialinio tinklo paveikslėlis — `public/og.png`

1200×630. Tai paveikslėlis, kurį mato žmonės, kai nuoroda metama į Facebook grupę.
Jei keiti — išlaikyk tuos pačius matmenis.

---

## Kaip pridėti naują uždavinių generatorių

1. **Sukurk failą** `lib/generatoriai/mano-tema.ts`:

   ```ts
   import { atsitiktinis, pasirink } from '../matematika'
   import { suBandymais, uzdavinys } from './bendra'
   import type { Generatorius, Lygis, Uzdavinys } from './tipai'

   const ATSARGINIAI = [
     {
       klausimas: 'Apskaičiuok: $2 + 2$',
       atsakymas: '4',
       atsakymasRodymui: '$4$',
       sprendimas: 'Du plius du — keturi.',
     },
   ] as const

   export const manoTema: Generatorius = (lygis) =>
     suBandymais(() => kurk(lygis), ATSARGINIAI, 'mano-tema')

   function kurk(lygis: Lygis): Uzdavinys | null {
     // ...
     if (/* rezultatas bjaurus */ false) return null   // bandoma iš naujo
     return uzdavinys('mano-tema', { klausimas, atsakymas, atsakymasRodymui, sprendimas })
   }
   ```

2. **Užregistruok** jį `lib/generatoriai/index.ts` objekte `generatoriai`.

3. **Nurodyk** jo raktą temos lauke `generatorius` faile `lib/temos.ts`.

4. **Paleisk** `npm run patikra`.

### Taisyklės, kurių privalo laikytis kiekvienas generatorius

**Generuok atsakymą pirma, iš jo konstruok sąlygą.** Atsitiktiniai skaičiai sąlygoje
duoda atsakymus tipo `37/91`. Todėl eik atgal: pirma nuspręsk, koks turi būti gražus
atsakymas, tada iš jo išvesk sąlygą.

```ts
const x = atsitiktinisBe(-9, 9, [-1, 0, 1])   // sprendinys pirma
const a = atsitiktinis(2, 9)
const b = atsitiktinisBe(-20, 20, [0])
const c = a * x + b                            // c išvedamas, ne parenkamas
```

**Turi būti atmetimo sąlyga.** Jei rezultatas bjaurus, grąžink `null` — `suBandymais`
bandys iš naujo iki 50 kartų, o tada paims uždavinį iš atsarginio sąrašo.

**Tekstas rašomas mišriu formatu:** paprastas lietuviškas tekstas, matematika tarp `$...$`.
Renderina `components/Formule.tsx`.

```
'Apskaičiuok ir suprastink: $\\dfrac{2}{3} + \\dfrac{3}{4}$'
```

**Atsakymas normalizuojamas automatiškai** (`uzdavinys()` tai padaro). Mokinio įvestis
lyginama per `arTeisingas()`, kuris priima `1,5` ir `1.5`, neprastintą trupmeną
(`2/4` = `1/2`), `0,50` = `0,5` ir mišrųjį skaičių `1 1/2`.

**Lietuvių kalbos derinimas.** Jei uždavinyje yra daiktavardis su skaitvardžiu, formą
reikia derinti: 1 → vienaskaita, 2–9 → daugiskaita, 0 ir 11–19 → kilmininkas
(*7 sąsiuviniai*, bet *12 sąsiuvinių*). Pavyzdys — `lib/generatoriai/proporcijos.ts`.

---

## Sandara

```
app/
  page.tsx                    landing
  testas/                     diagnostika (logika kliente)
  testas/rezultatas/          ataskaita, noindex
  uzduotys/                   uždavinių generatorius
  testai/                     NMPP ir PUPP
  apie/  privatumas/
  sitemap.ts  robots.ts
components/                   savi komponentai, be UI bibliotekų
lib/
  temos.ts                    prielaidų grafas — DUOMENYS
  diagnostika.ts              adaptyvi logika
  matematika.ts               nsd, mbk, suprastinimas, normalizavimas
  generatoriai/               uždavinių generatoriai
scripts/                      patikros, nekeliaujančios į produkciją
```

## Dizainas

Dramblio kaulo fonas, oranžiniai akcentai, be gradientų, šešėlių ir blur efektų.
Spalvos ir tipografijos skalė — `app/globals.css`.

Signature elementas — trupmenos brūkšnys (`components/Trupmena.tsx`,
`components/BruksnysDivider.tsx`). Trupmenos visur rašomos stackuotai.

Oranžinė (`#FF5C00`) naudojama taupiai. Tekstas ant oranžinės rašomas tamsus (`--ink`),
o ne baltas: balta ant šios oranžinės duoda 3.09:1 kontrastą ir nepraeina WCAG AA.
