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
| `npm run patikra:saskaitos` | Praeina visą sąskaitų kelią (juodraštis → išrašymas → PDF → i.SAF) su savo bandomaisiais duomenimis ir po to juos ištrina |
| `npm run importmap` | Perrašo `app/(payload)/admin/importMap.js` — CMS savų komponentų sąrašą |
| `npm run schema` | Perrašo `cms/pradine-schema.ts` iš vietinės bazės |

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
nuoroda, pamokų laikai. Ten pat: „Aktyvus“, „Pauzė iki“ atostogoms ir „Kita pamoka —
pirmoji (nuolaida)“.

Pamokos pasikartojimas — kaip Google kalendoriuje: **savaitės diena** (kas savaitę, kas 2, 3 ar 4
savaites) arba **mėnesio diena** (pvz. kas mėnesio 18-ą). Rečiau nei kas savaitę reikia „Pirmosios
tokios pamokos“ datos — nuo jos skaičiuojama, kurios savaitės yra „tos“. Visa logika —
`lib/pamokos.ts`, funkcija `arVyksta()`; ja remiasi IR priminimai, IR svetainės kalendorius, kad
tėvai negautų laiško apie pamoką, kurios kalendorius nerodo.

**Priminimai** (`cms/Priminimai.ts`) — kada siųsti: **tos pačios dienos rytą** arba **dieną prieš,
vakare**, ir kelintą valandą. Prie atskiro mokinio tą patį galima nurodyti kitaip — jo nustatymas
nurungia bendrąjį.

Ten pat redaguojamas ir laiško **parašas** bei **prierašas** (papildoma eilutė prieš parašą).
Parašą palikus tuščią, imamas numatytasis iš `lib/kontaktai.ts` — vardas, pareigos, telefonas ir
adresas. Likęs laiško tekstas (kreipinys, sakinys apie pamoką, prisijungimo eilutė ir pirmos
pamokos nuolaida) gyvena `laiskasTevams()` funkcijoje `lib/priminimai.ts`: nuoroda ir laikas
turi būti visada, tad jų į CMS neiškeliam.

**Grupės** (`cms/Grupes.ts`) — kai tą patį laiką pas tą pačią Meet nuorodą ateina keli vaikai.
Grupė turi savo pavadinimą, narių sąrašą, **vieną** Meet nuorodą ir savo pamokų laikus (tokius
pat, kaip mokinio). Priminimas eina **kiekvienam nariui atskirai** — jo tėvų adresu ir jo valandą,
tik su grupės nuoroda. Tėvų paštas, pauzė ir sutikimas lieka mokinio kortelėje, nes jie asmeniniai.

Grupinė pamoka kainuoja kitaip nei individuali (žr. „Sąskaitos ir i.SAF“), o kalendoriuje užima
langą lygiai taip pat.

**Pamokų žurnalas** (`cms/Zurnalas.ts`) — po įrašą kiekvienai pamokai; grupinė pamoka palieka po
įrašą **kiekvienam nariui**, nes lankomumas ir apmokėjimas yra pervaikį, ne pergrupę. Įrašus kuria
pati sistema; jie neleidžia išsiųsti to paties priminimo dukart ir kaupia lankomumo bei
atsiskaitymo istoriją.

Kiekvienam įrašui siuntimo metu užrašoma **rūšis** (individuali / grupinė) ir **kaina** — kad
pakeitus kainoraštį praėjusio mėnesio sąskaitos nepersiskaičiuotų atgaline data.

### Kaip tai sukasi

Cron'as kas 5 min. kviečia `/vidus/priminimai?raktas=…` (`PRIMINIMU_RAKTAS`, žr. `.env.example`).
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

**Vienas raktas, du kambariai.** Tas pats vaikas gali turėti ir individualių, ir grupinių pamokų,
o kambariai jiems skirtingi. Todėl nuoroda veda ne pagal kortelę, o pagal **artimiausią žurnalo
įrašą**: grupinei pamokai atiduodamas grupės kambarys, individualiai — vaiko. Tėvams lieka viena
nuoroda visam laikui.

Tiksliau nei „nuoroda atidaryta“ nemokamoje Google paskyroje nesužinosi: Meet REST API dirba tik
su Workspace paskyrų vedamais skambučiais, o dalyvavimo ataskaitos yra mokamuose planuose.

Dienos santraukoje sau prie kiekvienos pamokos yra „Buvo / Nebuvo“ nuorodos — paspaudus, būsena
žurnale pasikeičia neatidarant CMS. Jas saugo parašas iš `PAYLOAD_SECRET`. Pažymėjus „Buvo“,
mokiniui nusiima pirmos pamokos nuolaidos varnelė.

### Laisvų laikų kalendorius

Po registracijos forma (`/susisiekti` ir `/matematikos-korepetitore`) rodomas kalendorius su
tikromis datomis: **dvi savaitės vienu metu**, mėnesių sąrašas peršokimui ir ‹ › vartymui po dvi
savaites. Oranžinė — užimta, šviesi — laisva, blyški — praėję. Paspaudus laisvą langą atsidaro
registracijos langas (`<dialog>`), o užsakymas iškart užima laiką.

Numatytai rodomas **pusmetis į priekį** (26 savaitės, keičiama CMS'e iki 52). Visos savaitės
atsiunčiamos iš karto vienu masyvu raidžių, tad vartymas ir mėnesio pasirinkimas neprašo serverio;
pusmetis HTML'e užima apie 18 KB suspausto teksto.

Lentelės rėmuose „Paskutinė eilutė“ yra **vėliausia pamokos pradžia ir ji dar rodoma**: įrašius
21:00, paskutinė eilutė yra 21:00, o ne 20:00.

| Failas | Ką daro |
|---|---|
| `cms/Tvarkarastis.ts` | globalas „Laisvi laikai“ — rėmai, pataisymai, tekstai |
| `cms/Rezervacijos.ts` | ką lankytojai užsisakė |
| `lib/tvarkarastis.ts` | skaičiavimas: `gautiKalendoriu()` ir `arGalimaRezervuoti()` |
| `components/PamokuKalendorius.tsx` | serverio pusė |
| `components/KalendoriausTinklelis.tsx` | lentelė, savaičių vartymas, modalas |
| `lib/rezervacija.ts` | serverio veiksmas: patikros, įrašas, du laiškai |

Užimtumas imamas **iš tų pačių mokinių pamokų** — antro tvarkaraščio pildyti nereikia. Prie to
prisideda „Rankiniai pataisymai“ (galioja PO skaičiavimo, tad gali ir uždaryti, ir atlaisvinti) ir
rezervacijos, kurių būsena „nauja“ arba „patvirtinta“. Pažymėjus rezervaciją „Atmesta“, laikas
svetainėje vėl tampa laisvas.

Pataisymas gali galioti **savaitės dienai** (kartojasi) arba **konkrečiai datai** (atostogos,
vienkartinis susitikimas) — pasirenkama laukelyje „Kam galioja“.

Dienos pradžia atskira darbo dienoms ir savaitgaliui (numatytai 13:00 ir 10:00): eilutės apima abu
variantus, o ankstyvieji darbo dienų langeliai lieka tušti — nei laisvi, nei užimti (`n` būsena).
Todėl pirmoji lentelės eilutė yra ankstyvesnioji iš dviejų, o ne 08:00.

## Sąskaitos ir i.SAF

Skydelio langas **`/admin/saskaitos`**: mėnesio suvestinė, juodraščių generavimas iš pamokų
žurnalo, PDF, siuntimas tėvams ir išrašomų PVM sąskaitų faktūrų registro teikimas į VMI i.SAF.

### Mėnesio eiga

1. **Sugeneruoti juodraščius.** Imamos to mėnesio pamokos, pažymėtos **„Įvyko“** ir dar
   neapmokestintos. Grupuojama pagal **tėvų el. paštą**: viena šeima — viena sąskaita, net jei
   vaikai du.
2. **Peržiūrėti / pataisyti.** „Peržiūrėti“ atidaro sąskaitą naršyklėje, „Taisyti“ — įprastą
   Payload dokumento redaktorių. Pakeitus kiekį ar kainą, sumos persiskaičiuoja išsaugant.
3. **Išrašyti.** Tik dabar suteikiamas numeris (`SERIJA-0001`), išrašymo data ir terminas.
   Juodraštį galima ištrinti, numeruotą sąskaitą — tik anuliuoti, todėl numeracijoje nelieka
   spragų.
4. **Siųsti tėvams.** Laiškas su prisegtu PDF ir nuoroda į sąskaitą (nuoroda pasirašyta tuo pačiu
   HMAC, kaip „Buvo / Nebuvo“ — tėvams slaptažodžio nereikia, pašaliniam neužtenka atspėti numerį).
5. **i.SAF** — atskira lango dalis, žr. žemiau.

**Pakartotinis generavimas nekuria antros sąskaitos.** Prisiminus dar vieną įvykusią pamoką ir
paspaudus „Sugeneruoti“ dar kartą, esamas **juodraštis** persidaro iš visų prie jo prikabintų
pamokų plius naujų. Kiekvienai žurnalo eilutei įrašoma, į kurią sąskaitą ji nuėjo — būtent tai, o
ne datų palyginimas, neleidžia apmokestinti tos pačios pamokos dukart. Ištrynus ar anuliavus
sąskaitą, pamokos grįžta į eilę.

### Kainos ir PVM — globalas „Sąskaitų nustatymai“

`cms/Atsiskaitymai.ts`: pardavėjo rekvizitai, banko sąskaita, numeracija, kainos (individuali,
grupinė, pirmos pamokos nuolaida), PVM kodas ir tarifas, laiško tekstas.

**„Kainos nurodytos su PVM“** (numatytai įjungta) sprendžia, kaip skaičiuojamos sumos. Įjungta:
25 € yra galutinė kaina tėvams, o PVM iš jos išskaičiuojamas. Ir išskaičiuojamas **vieną kartą nuo
visos to tarifo sumos**, ne nuo vieneto: skaičiuojant per vienetą, keturios pamokos po 25 € duotų
99,99 €, ir tėvai pagrįstai klaustų, kur dingo centas. Todėl eilutėje rodoma sutarta kaina, o PVM
išskiriamas sumų bloke (`lib/saskaitos-sumos.ts`; visa aritmetika centais — `lib/pinigai.ts`).

Kaina užfiksuojama **žurnale pamokos metu**, tad kainoraščio pakeitimas galioja tik naujoms
pamokoms.

> **PVM1 ar PVM5?** Ar korepetitorės paslauga apmokestinama standartiniu 21 % tarifu, ar
> neapmokestinama pagal PVM įstatymo 20–33 str. — klausimas buhalterei, ne kodui. Todėl kodas
> tarifo neįrašo: jis pasirenkamas CMS'e, numatytasis `PVM1` / 21 %.

### PDF

`lib/saskaitos-pdf.ts`, `pdfkit` + **Noto Sans** (`lib/saskaitos-sriftai/`). Savas šriftas būtinas:
standartiniai PDF šriftai neturi nei ą, nei č, nei ž. Į failą įdedami tik panaudoti glifai, tad
sąskaita sveria ~20 KB, nors šriftas — pusę megabaito.

`next.config.ts` juos įtraukia į `outputFileTracingIncludes`, o `pdfkit` yra
`serverExternalPackages` sąraše — kitaip savarankiškame diegime failų tiesiog nebūtų ir PDF lūžtų
**tik produkcijoje**.

### i.SAF — išrašomų PVM sąskaitų faktūrų registras

Taikoma **tik PVM mokėtojui**. Teikiama kas mėnesį iki kito mėnesio 20 d., net jei sąskaitų
nebuvo. Sistema gamina **`P` tipo** rinkmeną (tik išrašomos); gaunamos (`S`) teikiamos atskirai
per imas.vmi.lt ir čia nedalyvauja.

> **Laikotarpis eina pagal IŠRAŠYMO datą, ne pagal pamokų mėnesį.** Rugsėjo 1 d. išrašyta sąskaita
> už rugpjūčio pamokas patenka į **rugsėjo** registrą — taip reikalauja schema (`InvoiceDate`
> privalo patekti tarp `SelectionStartDate` ir `SelectionEndDate`). Todėl skydelyje sąskaitų
> sąrašas ir i.SAF dalis rodomi atskirai.

| Failas | Ką daro |
|---|---|
| `lib/isaf-xml.ts` | `iSAFFile` rinkmenos sudarymas ir kliūčių sąrašas |
| `lib/isaf.ts` | SOAP klientas: `Upload`, `CheckState`, `GetRegistryNumbers`, `SubmitRegistry`, `GetRegistryStatus` |
| `lib/isaf-teikimas.ts` | eiga ir jos pėdsakas sąskaitose |

Kelias skydelyje: **Peržiūrėti XML** → **Įkelti į i.SAF** → **Tikrinti būseną** → **Pateikti
registrą**. Trys atskiri mygtukai sąmoningai: įkeltą rinkmeną dar galima pakeisti, o pateiktas
registras jau yra deklaracija.

**Sertifikatas gaunamas ranka** — jo kodu susikurti neįmanoma. i.MAS portale užsakomas kliento
sertifikatas, sugeneruojamas CSR, o gautas sertifikatas ir privatus raktas įrašomi į failus
serveryje **už repozitorijos ribų**; kelias nurodomas `ISAF_SERTIFIKATAS` kintamuoju (žr.
`.env.example`). Į duomenų bazę raktas nededamas, nes ta keliauja į atsargines kopijas.

Paslaugos sritis (namespace) nuskaitoma iš WSDL automatiškai — specifikacijoje ji neužrašyta, o
atspėta neteisingai duotų klaidą, iš kurios nieko nesuprasi.

**Pirma — demo aplinka** (`ISAF_APLINKA=demo`), ir dar prieš tai: atsisiųsk XML ir įkelk jį ranka
per imas.vmi.lt. Taip XML klaidos atskiriamos nuo sujungimo klaidų, o painioti jas brangu. Kol
sertifikato nėra, sistema vis tiek pilnai naudinga: rinkmena sudaroma ir atsisiunčiama, o i.SAF
mygtukai skydelyje pasirodo tik įjungus juos nustatymuose.

### CMS skydelio išvaizda — `app/(payload)/custom.scss`

Šiltos svetainės spalvos vietoj numatytos pilkos, oranžinis pagrindinis mygtukas ir Lucide ikonos
skydelio kortelėms. Failas įtraukiamas **tik** `app/(payload)/layout.tsx`, tad į svetainės
lankytojo naršyklę nepatenka nei šis CSS, nei jo parsiunčiami šriftai.

Beveik viskas daroma per Payload paskelbtus CSS kintamuosius — visą sąsają jis piešia iš vienos
`--color-base-*` skalės, tad ją perrašius sušyla fonas, laukai ir lentelės iš karto. Kelios vietos,
kur be klasių neapsieita (navigacija, lentelių antraštės, kortelės), pažymėtos komentaruose: po
Payload atnaujinimo pirmiausia tikrinti jas.

Langelis pažymimas užimtu, jei intervalai **persidengia**, o ne sutampa pradžios: 15:40 pamoka
valandinėje lentelėje uždažo ir 15:00, ir 16:00. Geriau parodyti šiek tiek daugiau užimtumo, nei
pasiūlyti langą, kurio nėra.

Kalendorius atsidaro ties **pirma savaite, kurioje dar yra laisvo laiko** — savaitės pabaigoje visi
einamosios savaitės langeliai jau būna praėję, ir kitaip žmogus matytų vien pilką lentelę.

Mėnesių sąraše kiekvienas mėnuo yra vieną kartą, o savaitė jam priskiriama pagal **pirmą savo
dieną**: rugsėjo 28 – spalio 3 savaitė yra „Rugsėjis“, kitaip ji sąraše atsidurtų du kartus.

**Rezervacijos patikrinimas kartojasi serveryje.** `arGalimaRezervuoti()` kviečiama iš naujo prieš
įrašant: naršyklės puslapis gali būti atidarytas prieš valandą, užklausą galima atsiųsti ir visai be
jo, o du žmonės gali spustelėti tą patį langelį tuo pačiu metu. Ta pati funkcija tikrina ir tai, ar
laikas apskritai yra lentelės tinklelyje — „17:07“ neužsakysi.

> Į puslapio HTML patenka tik „užimta / laisva / praėjo“. Vardai, klasės, tėvų paštai, Meet nuorodos
> ir kitų žmonių rezervacijos lieka serveryje. Dėl tos pačios priežasties ir globalas „Laisvi
> laikai“ uždarytas: atviras jis atiduotų „Rankinių pataisymų“ laukelį „Kodėl (tik sau)“.

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
  vidus/saskaita/[id]/        sąskaitos peržiūra ir PDF (prisijungus arba su parašu)
  vidus/isaf/[laikotarpis]/   i.SAF rinkmena atsisiuntimui
  sitemap.ts  robots.ts
components/                   savi komponentai, be UI bibliotekų
cms/
  Mokiniai.ts                 kas, kada ir kur turi pamoką
  Grupes.ts                   grupinės pamokos — bendra nuoroda ir laikas
  pamokos-laukai.ts           pamokos laukai, bendri mokiniams ir grupėms
  Zurnalas.ts                 pamokų žurnalas — rašo tik serveris
  Saskaitos.ts                sąskaitos tėvams — kuria serveris, taisoma ranka
  Priminimai.ts               kada siųsti ir laiško parašas (globalas)
  Atsiskaitymai.ts            rekvizitai, kainos, PVM, i.SAF (globalas)
  Tvarkarastis.ts             laisvų laikų kalendorius (globalas)
  Rezervacijos.ts             ką lankytojai užsisakė kalendoriuje
  vaizdai/                    `/admin/saskaitos` langas ir jo serverio veiksmai
lib/
  temos.ts                    prielaidų grafas — DUOMENYS
  diagnostika.ts              adaptyvi logika
  matematika.ts               nsd, mbk, suprastinimas, normalizavimas
  generatoriai/               uždavinių generatoriai
  pamokos.ts                  pasikartojimai — ar pamoka vyksta tą dieną
  priminimai.ts               kam ir kada siųsti laišką
  kainos.ts                   kiek kainuoja pamoka + pardavėjo rekvizitai
  pinigai.ts                  centai, PVM išskaidymas, formatavimas
  saskaitos.ts                juodraščiai iš žurnalo, numeracija, mėnesio apžvalga
  saskaitos-sumos.ts          sumos ir PVM grupės — vienos visoms trims išvestims
  saskaitos-vaizdas.ts        vienas duomenų rinkinys PDF'ui, peržiūrai ir laiškui
  saskaitos-pdf.ts            PDF (pdfkit + Noto Sans)
  saskaitos-pastas.ts         laiškas tėvams su prisegtu PDF
  isaf-xml.ts                 i.SAF rinkmena (P tipo registras)
  isaf.ts                     SOAP klientas su kliento sertifikatu
  isaf-teikimas.ts            įkėlimo ir pateikimo eiga
  tvarkarastis.ts             kalendorius: užimta/laisva/praėjo
  rezervacija.ts              užsakymo veiksmas (patikros, įrašas, laiškai)
  greicio-riba.ts             bendras botų ribotuvas formoms
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

- `ISAF_APLINKA`, `ISAF_SERTIFIKATAS`, `ISAF_RAKTAS`, `ISAF_RAKTO_SLAPTAZODIS` — i.SAF teikimui
  (žr. „Sąskaitos ir i.SAF“). Nebūtini: be jų rinkmena vis tiek sudaroma ir atsisiunčiama, tik
  neteikiama automatiškai. Sertifikato kelias — **už repozitorijos ribų**, kaip `DATABASE_URI`.

Ir dar reikia **cron'o**, kuris tą adresą kviestų. Hostinger hPanel'yje arba nemokamame
cron-job.org:

```
*/5 * * * *  curl -s "https://vardiklis.lt/vidus/priminimai?raktas=TAVO_RAKTAS"
```

> Be `SMTP_USER` ir `SMTP_PASS` forma siuntimo nebando: parodo telefoną bei el. paštą ir
> įrašo priežastį į serverio žurnalą. Tyliai užklausa nedingsta, bet ir neateina.

### Pridėjus savą CMS komponentą

Payload savus komponentus (langus, celes, meniu nuorodas) randa ne pagal kelią, o pagal
`app/(payload)/admin/importMap.js` — jame surašyta, ką iš kur importuoti. Naujo įrašo ten
neatsiradus, komponentas tyliai neegzistuoja: savas langas atsako **404**, o meniu nuoroda
tiesiog nepasirodo.

Todėl `npm run build` **pats perrašo importMap'ą** (`payload generate:importmap && next build`).
Vietoje jį galima perrašyti ir atskirai — `npm run importmap`.

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
