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

### Atsiliepimai — `lib/atsiliepimai.ts`

Atsiliepimai iš [paslaugos.lt profilio](https://paslaugos.lt/modesta-mm4002), perrašyti
ranka — svetainė ten nesilanko ir nieko netraukia. Tekstai laikomi **pažodžiui**, su
originalo rašybos klaidomis: taisyti svetimą atsiliepimą reikštų jį perrašyti.

Sąrašas surikiuotas nuo naujausio — nuo jo pradžios karuselė ir pradedama.
Vienas failas maitina ir korteles (`components/Atsiliepimai.tsx`), ir struktūrinius
duomenis (`components/JsonLd.tsx`) — pridėjus įrašą, jis atsiranda abiejose vietose ir
persiskaičiuoja `aggregateRating`.

Karuselė slenkama į šoną ir sukasi ratu: serveris atiduoda VIENĄ komplektą kortelių (tad
Google mato kiekvieną atsiliepimą po vieną kartą, o be JS lieka paprastas slenkamas
sąrašas), o po hidratacijos komplektų tampa trys. Išėjus iš vidurinio, `scrollLeft`
tyliai peršoka per vieną komplektą atgal — turinys kartojasi būtent tuo periodu, tad
siūlės pamatyti neįmanoma.

Vardo kairėje — apvalus ženklas: yra nuotrauka (`public/atsiliepimai/`), rodoma ji, nėra —
vardo ir pavardės inicialai.

### Nuotrauka — `public/Modesta.jpg`

Naudojama `/matematikos-korepetitore` puslapyje. Pakeitus failą tuo pačiu vardu, daugiau nieko keisti nereikia.

### Socialinio tinklo paveikslėlis — `public/og.png`

1200×630. Tai paveikslėlis, kurį mato žmonės, kai nuoroda metama į Facebook grupę.
Jei keiti — išlaikyk tuos pačius matmenis.

---

### Kainos ir kvietimas po straipsniais — CMS

Kainų lentelė, užrašas apie nuolaidą ir registracijos forma po **kiekvienu** straipsniu
imami iš Payload globalo **„Kainos ir kvietimas“** (`/admin/globals/nustatymai`,
aprašas — `cms/Nustatymai.ts`). Neįrašius nė vienos kainos, lentelė nerodoma visai;
išjungus „Rodyti po straipsniais“ — dingsta ir forma.

Forma nieko nesiunčia ir neįrašo: ji atidaro lankytojo pašto programą su paruoštu
laišku, kaip ir diagnostikos ataskaita (`components/RegistracijosForma.tsx`).

### Straipsnio spalvos, šriftai ir blokai — `cms/stiliai.ts`

Vienas failas dviem pusėms: iš jo redaktorius gauna pasirinkimus (pažymėjus tekstą —
spalva, paryškinimo fonas, šriftas; per „/“ — spalvotas blokas), o svetainė — CSS.
Straipsnio JSON'e lieka tik raktas (`spalva: "oranzine"`), tad pakeitus atspalvį čia
persidažo ir visi seni straipsniai.

Pridėjus naują spalvą ar bloką duomenų bazės keisti nereikia — visa tai gyvena
`turinys` lauko JSON'e.

### Gyva peržiūra

Straipsnio redagavimo lange yra peržiūra su tikru puslapiu (ne tik SEO kortele).
Tekstas saugomas automatiškai kas sekundę, o `components/GyvaPerziura.tsx` po kiekvieno
išsaugojimo perkrauna peržiūros langą. Adresas — `/straipsniai/<nuoroda>?perziura=1`;
juodraštį jis parodo **tik prisijungusiam** CMS naudotojui, visiems kitiems tas pats
adresas grąžina paskelbtą versiją.

## Pamokų priminimai

Automatinis laiškas tėvams prieš pamoką. Google kalendorius čia nedalyvauja: tvarkaraštis,
tėvų paštas ir Meet nuoroda gyvena Payload'e, tad nereikia nei Calendar API, nei OAuth, nei
pavadinimų prefiksų.

### Ką suvedi CMS'e

**Mokiniai** (`cms/Mokiniai.ts`) — vardas, klasė, tėvo vardas ir el. paštas, nuolatinė Meet
nuoroda, savaitinių pamokų laikai. Ten pat: „Aktyvus“, „Pauzė iki“ atostogoms ir „Kita pamoka —
pirmoji (nuolaida)“.

**Priminimai** (`cms/Priminimai.ts`) — kada siųsti: **tos pačios dienos rytą** arba **dieną prieš,
vakare**, ir kelintą valandą. Prie atskiro mokinio tą patį galima nurodyti kitaip — jo nustatymas
nurungia bendrąjį.

**Pamokų žurnalas** (`cms/Zurnalas.ts`) — po įrašą kiekvienai pamokai. Įrašus kuria pati sistema;
jie neleidžia išsiųsti to paties priminimo dukart ir kaupia lankomumo bei atsiskaitymo istoriją.

### Kaip tai sukasi

Cron'as kas 15 min. kviečia `/vidus/priminimai?raktas=…` (`PRIMINIMU_RAKTAS`, žr. `.env.example`).
Maršrutas kaskart klausia to paties: kurių artimiausių pamokų priminimo momentas jau praėjo, o
laiškas dar neišsiųstas. Todėl siuntimo valandą galima keisti CMS'e neliečiant serverio.

Tikrinamos dvi paros — pasirinkus „dieną prieš, vakare“, aštuntą vakaro reikia žiūrėti į
**rytojaus** pamokas. Pamokai jau prasidėjus priminimas nebesiunčiamas niekada; iki tol nepavykęs
laiškas bandomas iš naujo kito badymo metu.

Laikai skaičiuojami Vilniaus laiku (`lib/laikas.ts`), nes serveris sukasi UTC.

### Nuoroda tėvams ir „ar prisijungė“

Laiške siunčiama ne pati Meet nuoroda, o `vardiklis.lt/p/<raktas>`: ji įrašo atidarymo laiką ir
permeta į Meet kambarį. Raktas pastovus — nuorodą galima įsidėti į žymes, o pakeitus Meet
kambarį Payload'e sena žyma pati atves į naują.

Tiksliau nei „nuoroda atidaryta“ nemokamoje Google paskyroje nesužinosi: Meet REST API dirba tik
su Workspace paskyrų vedamais skambučiais, o dalyvavimo ataskaitos yra mokamuose planuose.

Dienos santraukoje sau prie kiekvienos pamokos yra „Buvo / Nebuvo“ nuorodos — paspaudus, būsena
žurnale pasikeičia neatidarant CMS. Jas saugo parašas iš `PAYLOAD_SECRET`. Pažymėjus „Buvo“,
mokiniui nusiima pirmos pamokos nuolaidos varnelė.

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
  matematikos-korepetitore/   paslaugų puslapis (buv. `apie/`, 308 iš `/apie`)
  privatumas/
  p/[raktas]/                 pamokos nuoroda tėvams → įrašo ir permeta į Meet
  vidus/priminimai/           cron'o kviečiamas siuntimas
  vidus/zymeti/               „Buvo / Nebuvo“ iš santraukos laiško
  sitemap.ts  robots.ts
components/                   savi komponentai, be UI bibliotekų
cms/
  Mokiniai.ts                 kas, kada ir kur turi pamoką
  Zurnalas.ts                 pamokų žurnalas — rašo tik serveris
  Priminimai.ts               kada siųsti (globalas)
lib/
  temos.ts                    prielaidų grafas — DUOMENYS
  diagnostika.ts              adaptyvi logika
  matematika.ts               nsd, mbk, suprastinimas, normalizavimas
  generatoriai/               uždavinių generatoriai
  priminimai.ts               kam ir kada siųsti laišką
  laikas.ts                   Vilniaus laikas (serveris sukasi UTC)
scripts/                      patikros, nekeliaujančios į produkciją
```

## Dizainas

Dramblio kaulo fonas, oranžiniai akcentai, be gradientų, šešėlių ir blur efektų.
Spalvos ir tipografijos skalė — `app/globals.css`.

Signature elementas — trupmenos brūkšnys (`components/Trupmena.tsx`,
`components/BruksnysDivider.tsx`). Trupmenos visur rašomos stackuotai.

Oranžinė (`#FF5C00`) naudojama taupiai. Tekstas ant oranžinės rašomas tamsus (`--ink`),
o ne baltas: balta ant šios oranžinės duoda 3.09:1 kontrastą ir nepraeina WCAG AA.

## Diegimas į Hostinger

Svetainė statoma kaip **savarankiškas (standalone) Node serveris**: `next build` sukuria
`.next/standalone/server.js` — vieną įėjimo failą, kuriam nereikia `node_modules`.
`npm run build` iš karto įkopijuoja ir `public/` bei `.next/static` (be jų nebūtų
paveikslėlių, PDF ir stilių).

### Hostinger nustatymai

Jei hPanel rodo **„unsupported framework or invalid project structure"**, karkaso
atpažinimas nepavyko — rinkis presetą **Other** ir suvesk laukus ranka:

| Laukas | Reikšmė |
| --- | --- |
| Framework preset | `Other` (jei siūlo `Next.js` — irgi tinka) |
| Node version | `22` |
| Build command | `npm run build` |
| Output directory | `.next` |
| Entry file | `.next/standalone/server.js` |
| Branch | `main` |
| Root directory | palikti tuščią (projektas yra repo šaknyje) |

### Aplinkos kintamieji

Suvedami hPanel'e, **ne** git'e (žr. `.env.example`):

- `PAYLOAD_SECRET` — ilga atsitiktinė eilutė. Pakeitus nustos galioti visos sesijos.
- `DATABASE_URI` — pvz. `file:/home/<naudotojas>/duomenys/vardiklis.db`
- `UPLOADS_DIR` — pvz. `/home/<naudotojas>/duomenys/ikelta`
- `SMTP_USER`, `SMTP_PASS` — registracijos formos laiškams (`lib/uzklausa.ts`). Gmail'ui
  reikia ne paskyros slaptažodžio, o **App password**: Google paskyra → Security →
  2-Step Verification → App passwords.
- `SMTP_HOST`, `SMTP_PORT` — nebūtini, numatytai `smtp.gmail.com` ir `587`
  (STARTTLS). 465 nenaudojamas sąmoningai: tinkle su neveikiančiu IPv6 jis lūžta
  ties `ECONNREFUSED`, nes prie jau užmegzto TLS nodemailer nebepersijungia į IPv4.
- `UZKLAUSU_PASTAS` — nebūtinas, kam ateina užklausos. Nenurodžius — tas pats `SMTP_USER`.
- `PRIMINIMU_RAKTAS` — slaptažodis priminimų maršrutui (žr. „Pamokų priminimai“). Nenurodžius,
  `/vidus/priminimai` atsako 503 ir laiškų nesiunčia; tai ir yra būdas juos laikinai išjungti
  serveryje, o švelnesnis — varnelė CMS globale „Priminimai“.

Ir dar reikia **cron'o**, kuris tą adresą kviestų. Hostinger hPanel'yje arba nemokamame
cron-job.org:

```
*/15 * * * *  curl -s "https://vardiklis.lt/vidus/priminimai?raktas=TAVO_RAKTAS"
```

> Be `SMTP_USER` ir `SMTP_PASS` forma siuntimo nebando: parodo telefoną bei el. paštą ir
> įrašo priežastį į serverio žurnalą. Tyliai užklausa nedingsta, bet ir neateina.

### Pakeitus kolekcijų ar globalų laukus

1. `npm run dev` — vietinė bazė atsinaujina pati;
2. `npm run schema` — schema perrašoma į `cms/pradine-schema.ts`;
3. jei atsirado **nauja lentelė** (naujas globalas ar kolekcija), į `payload.config.ts`
   `prodMigrations` sąrašą pridedamas naujas įrašas nauju pavadinimu — serveryje jau
   įvykdyta migracija antrą kartą nepaleidžiama, tad be to lentelė ten neatsirastų;
4. jei atsirado **naujas stulpelis jau esamoje lentelėje** (pvz. įjungus autosave, į
   `_straipsniai_v` atsiranda `autosave`), jis surašomas į `TRUKSTAMI_STULPELIAI`
   sąrašą `payload.config.ts`.

> **Nauja kolekcija reiškia ir naują stulpelį.** Payload į jau egzistuojančią
> `payload_locked_documents_rels` prideda po vieną stulpelį kiekvienai kolekcijai ir dar
> sukuria jiems indeksus. Todėl 3 ir 4 punktai eina kartu, o migracijoje sakiniai
> paleidžiami tokia tvarka: **lentelės → stulpeliai → indeksai** (žr.
> `schema-2026-09-mokiniai`). Pridėjus stulpelius po indeksų, migracija nulūžta ties
> `CREATE INDEX … (mokiniai_id)`.

> `CREATE TABLE IF NOT EXISTS` seną lentelę tiesiog praleidžia, tad naujas stulpelis į ją
> savaime nepatenka. Blogiausia, kad jį minintis indeksas tada nulaužia visą migraciją —
> Payload nebepakyla ir **visi** CMS bei straipsnių puslapiai atsako 503, nors statiniai
> puslapiai atrodo sveiki. Būtent taip ir atrodo pamiršta 4 punkto eilutė.

Ar migracija tikrai veikia serverio bazei, galima patikrinti nepaliečiant serverio:
nusikopijuoti bazę, iš kopijos ištrinti naujus stulpelius bei lenteles, `payload_migrations`
palikti tik senus įrašus ir paleisti Payload su `NODE_ENV=production` ir `DATABASE_URI`,
rodančiu į tą kopiją.

> **Svarbu.** `DATABASE_URI` ir `UPLOADS_DIR` privalo rodyti **už programos katalogo ribų**.
> Kiekvienas diegimas iš GitHub perrašo programos katalogą — viduje laikoma duomenų bazė
> ir įkelti failai dingtų.

Serveris klauso `PORT` ir `HOSTNAME` kintamųjų; Hostinger juos nustato pats.
