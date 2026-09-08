import type { GlobalConfig } from 'payload'

/**
 * Sąskaitų nustatymai — pardavėjo rekvizitai, kainos, PVM ir i.SAF.
 *
 * KODĖL ČIA, O NE KODE. Kainos iki šiol gyveno `lib/kontaktai.ts` (jos ten ir
 * lieka kaip atsarga svetainei), bet sąskaitai to negana: reikia mokesčių
 * mokėtojo kodo, PVM kodo, banko sąskaitos ir numeracijos, o visa tai kinta be
 * jokio kodo pakeitimo. Pakėlus kainą nuo kito mėnesio niekas neturi diegti
 * naujos versijos.
 *
 * ATSKIRAS GLOBALAS, o ne laukai „Kainose ir kvietime“: naujam globalui
 * susikuria nauja lentelė, o naujas stulpelis jau esamoje lentelėje serveryje
 * savaime neatsiranda ir nulaužia visą migraciją (žr. `payload.config.ts`).
 *
 * SERTIFIKATO ČIA NĖRA SĄMONINGAI. i.SAF privatus raktas yra paslaptis, o
 * globalo turinys gula į duomenų bazę ir į atsargines kopijas. Raktas gyvena
 * aplinkos kintamuosiuose ir faile už repozitorijos ribų (žr. `lib/isaf.ts`).
 */
export const Atsiskaitymai: GlobalConfig = {
  slug: 'atsiskaitymai',
  label: 'Sąskaitų nustatymai',
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  admin: {
    description: 'Pardavėjo rekvizitai, kainos, PVM ir i.SAF teikimas.',
    group: 'Pamokos',
  },
  fields: [
    {
      type: 'collapsible',
      label: 'Pardavėjas (kaip rodoma sąskaitoje)',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'pardavejoVardas',
              type: 'text',
              label: 'Vardas, pavardė arba pavadinimas',
              admin: { description: 'Pvz. „Modesta Pavardenė“.' },
            },
            {
              name: 'pardavejoKodas',
              type: 'text',
              label: 'Mokesčių mokėtojo kodas',
              admin: {
                description:
                  'Asmens arba įmonės kodas. Šis skaičius keliauja į i.SAF rinkmenos „RegistrationNumber“ — be jo teikti negalima.',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'pardavejoPvmKodas',
              type: 'text',
              label: 'PVM mokėtojo kodas',
              admin: { description: 'Pvz. LT100001234567.' },
            },
            {
              name: 'veiklosPazyma',
              type: 'text',
              label: 'Individualios veiklos pažymos nr.',
              admin: { description: 'Nebūtina. Įrašyta — rodoma sąskaitoje.' },
            },
          ],
        },
        { name: 'pardavejoAdresas', type: 'textarea', label: 'Adresas' },
        {
          type: 'row',
          fields: [
            {
              name: 'iban',
              type: 'text',
              label: 'Banko sąskaita (IBAN)',
              admin: { description: 'Į ją tėvai perves pinigus. Be jos sąskaita neapmokama.' },
            },
            { name: 'bankas', type: 'text', label: 'Bankas' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Numeracija',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'serija',
              type: 'text',
              label: 'Serija',
              defaultValue: 'MOD',
              admin: { description: 'Sąskaitos numeris sudaromas kaip SERIJA-0001.' },
            },
            {
              name: 'kitasNumeris',
              type: 'number',
              label: 'Kitas eilės numeris',
              defaultValue: 1,
              min: 1,
              admin: {
                description:
                  'Padidėja pats kaskart išrašius. Ranka keisti verta tik pradedant nuo tam tikro skaičiaus — numeriai turi eiti be spragų.',
              },
            },
            {
              name: 'terminoDienos',
              type: 'number',
              label: 'Apmokėti per (dienų)',
              defaultValue: 14,
              min: 0,
              max: 180,
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Kainos',
      admin: {
        description:
          'Iš jų skaičiuojamos sąskaitos. Kaina užfiksuojama žurnale pamokos metu, tad pakeitimas galioja tik naujoms pamokoms.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'individualiKaina',
              type: 'number',
              label: 'Individuali pamoka (€)',
              defaultValue: 25,
              min: 0,
            },
            {
              name: 'grupineKaina',
              type: 'number',
              label: 'Grupinė pamoka, vienam (€)',
              defaultValue: 20,
              min: 0,
            },
            {
              name: 'pirmosNuolaida',
              type: 'number',
              label: 'Pirmos pamokos nuolaida (€)',
              defaultValue: 5,
              min: 0,
              admin: {
                description: 'Atimama nuo pirmos pamokos kainos — ir individualios, ir grupinės.',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'PVM',
      admin: {
        description:
          'Kokį kodą taikyti korepetitorės paslaugoms — klausimas buhalterei. PVM1 yra įprastas 21 %; PVM5 taikomas, kai paslauga PVM neapmokestinama pagal PVM įstatymo 20–33 straipsnius.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'pvmKodas',
              type: 'select',
              label: 'PVM klasifikatoriaus kodas',
              defaultValue: 'PVM1',
              required: true,
              options: [
                { label: 'PVM1 — standartinis 21 %', value: 'PVM1' },
                { label: 'PVM2 — lengvatinis 9 %', value: 'PVM2' },
                { label: 'PVM3 — lengvatinis 5 %', value: 'PVM3' },
                { label: 'PVM5 — neapmokestinama (20–33 str.)', value: 'PVM5' },
              ],
            },
            {
              name: 'pvmProc',
              type: 'number',
              label: 'PVM tarifas (%)',
              defaultValue: 21,
              min: 0,
              max: 100,
              admin: { description: 'Pasirinkus PVM5 — įrašykite 0.' },
            },
          ],
        },
        {
          name: 'kainosSuPvm',
          type: 'checkbox',
          label: 'Kainos nurodytos SU PVM',
          defaultValue: true,
          admin: {
            description:
              'Įjungta (įprastai taip): 25 € yra galutinė kaina tėvams, o PVM iš jos išskaičiuojamas — 20,66 € + 4,34 €. Išjungus, prie 25 € PVM būtų pridėtas ir tėvai mokėtų 30,25 €.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Laiškas su sąskaita',
      fields: [
        {
          name: 'laiskoTema',
          type: 'text',
          label: 'Tema',
          defaultValue: 'Sąskaita už matematikos pamokas',
          admin: { description: 'Prie temos automatiškai prirašomas sąskaitos numeris.' },
        },
        {
          name: 'laiskoTekstas',
          type: 'textarea',
          label: 'Tekstas',
          defaultValue:
            'Siunčiu sąskaitą už praėjusio mėnesio pamokas. Sąskaita prisegta PDF formatu.',
        },
        {
          name: 'saskaituParasas',
          type: 'textarea',
          label: 'Parašas',
          admin: { description: 'Palikus tuščią — toks pat, kaip priminimų laiškuose.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'i.SAF teikimas',
      admin: {
        description:
          'Išrašomų PVM sąskaitų faktūrų registras (P tipo rinkmena) teikiamas kas mėnesį iki kito mėnesio 20 d. Gaunamų sąskaitų registras čia neteikiamas.',
      },
      fields: [
        {
          name: 'isafIjungta',
          type: 'checkbox',
          label: 'Rodyti i.SAF veiksmus skydelyje',
          defaultValue: false,
          admin: {
            description:
              'Įjunkite tik gavę i.MAS kliento sertifikatą ir įrašę jo kelią į aplinkos kintamuosius.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'programosPavadinimas',
              type: 'text',
              label: 'Programos pavadinimas',
              defaultValue: 'Vardiklis',
              admin: { description: 'Keliauja į rinkmenos lauką „SoftwareName“.' },
            },
            {
              name: 'programosVersija',
              type: 'text',
              label: 'Programos versija',
              defaultValue: '1.0',
            },
          ],
        },
      ],
    },
  ],
}
