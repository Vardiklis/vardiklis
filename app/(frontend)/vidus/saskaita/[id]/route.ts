import { getPayload } from 'payload'
import config from '@payload-config'
import { svetaine } from '@/lib/kontaktai'
import { skaicius, suformatuok } from '@/lib/pinigai'
import { arTeisingasParasas } from '@/lib/priminimai'
import { saskaitosPdf } from '@/lib/saskaitos-pdf'
import { paruoskVaizda, type SaskaitosVaizdas } from '@/lib/saskaitos-vaizdas'

/**
 * Sąskaitos peržiūra ir atsisiuntimas.
 *
 *   `/vidus/saskaita/12`            — peržiūra naršyklėje
 *   `/vidus/saskaita/12?formatas=pdf` — PDF
 *
 * KAM DVI PRIEIGOS. Prisijungęs (aš) patenka visada; tėvams eina nuoroda su
 * parašu, kurio jie negali nei atspėti, nei pasidaryti. Tai tas pats HMAC, kaip
 * ir „Buvo / Nebuvo“ žymėjime (`lib/priminimai.ts`) — vienas mechanizmas, o ne
 * antra slaptažodžių sistema tėvams.
 *
 * Adresas po `/vidus/`, kur `next.config.ts` jau išjungęs krašto kešą: sąskaita
 * gali būti pataisyta, ir tada užkešuota kopija rodytų senas sumas.
 */

export const dynamic = 'force-dynamic'

const BE_KESO = { 'Cache-Control': 'no-store' }

export async function GET(uzklausa: Request, ctx: RouteContext<'/vidus/saskaita/[id]'>) {
  const { id } = await ctx.params
  const numeris = Number(id)
  if (!Number.isInteger(numeris) || numeris <= 0) {
    return new Response('Nerasta.', { status: 404, headers: BE_KESO })
  }

  const url = new URL(uzklausa.url)
  const parasas = url.searchParams.get('p') ?? ''

  if (!arTeisingasParasas(String(numeris), 'saskaita', parasas)) {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: uzklausa.headers })
    if (!user) return new Response('Neleista.', { status: 401, headers: BE_KESO })
  }

  let v: SaskaitosVaizdas
  try {
    v = await paruoskVaizda(numeris)
  } catch {
    return new Response('Sąskaita nerasta.', { status: 404, headers: BE_KESO })
  }

  if (url.searchParams.get('formatas') === 'pdf') {
    const pdf = await saskaitosPdf(v)
    return new Response(new Uint8Array(pdf), {
      headers: {
        ...BE_KESO,
        'Content-Type': 'application/pdf',
        // `inline` — naršyklė parodo, o ne iškart atsiunčia; „Įrašyti“ lieka
        // po ranka pačioje žiūryklėje.
        'Content-Disposition': `inline; filename="Saskaita-${v.numeris}.pdf"`,
      },
    })
  }

  return new Response(html(v, parasas), {
    headers: { ...BE_KESO, 'Content-Type': 'text/html; charset=utf-8' },
  })
}

function saugus(tekstas: string): string {
  return tekstas
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Eilutės, kurių nėra, tiesiog nepatenka į bloką. */
function eilutes(reiksmes: (string | null)[]): string {
  return reiksmes
    .filter((r): r is string => Boolean(r))
    .map((r) => `<div>${saugus(r)}</div>`)
    .join('')
}

function html(v: SaskaitosVaizdas, parasas: string): string {
  const p = v.pardavejas
  const pdfAdresas = `/vidus/saskaita/${v.id}?formatas=pdf${parasas ? `&p=${encodeURIComponent(parasas)}` : ''}`

  const lentele = v.eilutes
    .map(
      (e) => `<tr>
      <td>${saugus(e.aprasymas)}${e.detales ? `<span class="smulkiai">${saugus(e.detales)}</span>` : ''}</td>
      <td class="d">${e.kiekis} ${saugus(e.matoVnt)}</td>
      <td class="d">${skaicius(e.kaina)}</td>
      <td class="d">${skaicius(e.suma)}</td>
    </tr>`,
    )
    .join('')

  const pvmEilutes = v.sumos.grupes
    .map(
      (g) =>
        `<tr><td>PVM (${saugus(g.pvmKodas)}, ${g.pvmProc} %)</td><td class="d">${suformatuok(g.pvm)}</td></tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="lt"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${saugus(v.pavadinimas)} ${saugus(v.numeris)} · ${svetaine.pavadinimas}</title>
<style>
  :root{color-scheme:light}
  body{margin:0;background:#f3eee4;color:#12100e;
       font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
  main{max-width:48rem;margin:0 auto;padding:1.5rem 1rem 4rem}
  .lapas{background:#fff;border-radius:.75rem;padding:2rem;box-shadow:0 1px 3px rgba(0,0,0,.08)}
  h1{font-size:1.35rem;margin:0 0 .25rem;letter-spacing:.02em}
  .nr{color:#6b655f;margin:0 0 1.5rem}
  .virsus{display:flex;flex-wrap:wrap;gap:1.5rem;justify-content:space-between}
  .salys{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin:1.5rem 0}
  .salys h2{font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:#6b655f;margin:0 0 .4rem}
  table{width:100%;border-collapse:collapse;margin-top:.5rem}
  th{font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:#6b655f;text-align:left;
     padding:.4rem 0;border-bottom:1px solid #e4ded2}
  td{padding:.55rem 0;border-bottom:1px solid #f3eee4;vertical-align:top}
  .d{text-align:right;white-space:nowrap;padding-left:.75rem}
  .smulkiai{display:block;font-size:.8rem;color:#6b655f;margin-top:.15rem}
  .sumos{margin-left:auto;width:min(20rem,100%)}
  .sumos td{border:0;padding:.2rem 0}
  .sumos tr:last-child td{border-top:1px solid #e4ded2;padding-top:.5rem;font-weight:600;font-size:1.1rem}
  .juodrastis{margin-top:1.25rem;color:#b45309;font-weight:600}
  .veiksmai{display:flex;gap:.75rem;margin:0 0 1rem}
  .veiksmai a{display:inline-block;padding:.45rem .9rem;border-radius:.4rem;background:#12100e;color:#fbf8f2;
     text-decoration:none;font-size:.85rem;font-weight:600}
  .veiksmai a.antra{background:#fff;color:#12100e;border:1px solid #d8d0c1}
  @media print{body{background:#fff}.veiksmai{display:none}.lapas{box-shadow:none;padding:0}main{padding:0}}
  @media (max-width:34rem){.salys{grid-template-columns:1fr}}
</style></head>
<body><main>
<div class="veiksmai"><a href="${pdfAdresas}">Atsisiųsti PDF</a><a class="antra" href="#" onclick="window.print();return false">Spausdinti</a></div>
<div class="lapas">
  <div class="virsus">
    <div>
      <h1>${saugus(v.pavadinimas)}</h1>
      <p class="nr">Serija ir Nr. ${saugus(v.numeris)}</p>
    </div>
    <div class="smulkiai" style="text-align:right">
      ${eilutes([
        v.data ? `Išrašymo data: ${v.data}` : null,
        v.terminas ? `Apmokėti iki: ${v.terminas}` : null,
        v.laikotarpis ? `Laikotarpis: ${v.laikotarpis}` : null,
      ])}
    </div>
  </div>

  <div class="salys">
    <div><h2>Pardavėjas</h2>${eilutes([
      p.vardas,
      p.kodas ? `Kodas: ${p.kodas}` : null,
      p.pvmKodas ? `PVM kodas: ${p.pvmKodas}` : null,
      p.veiklosPazyma ? `Ind. veiklos pažyma Nr. ${p.veiklosPazyma}` : null,
      p.adresas,
      p.pastas,
      p.telefonas,
    ])}</div>
    <div><h2>Pirkėjas</h2>${eilutes([
      v.pirkejas.vardas,
      v.pirkejas.kodas ? `Kodas: ${v.pirkejas.kodas}` : null,
      v.pirkejas.pvmKodas ? `PVM kodas: ${v.pirkejas.pvmKodas}` : null,
      v.pirkejas.adresas,
      v.pirkejas.pastas,
    ])}</div>
  </div>

  <table>
    <thead><tr>
      <th>Paslauga</th><th class="d">Kiekis</th>
      <th class="d">${v.kainosSuPvm ? 'Kaina su PVM' : 'Kaina'}</th><th class="d">Suma</th>
    </tr></thead>
    <tbody>${lentele}</tbody>
  </table>

  <table class="sumos">
    <tr><td>Suma be PVM</td><td class="d">${suformatuok(v.sumos.bePvm)}</td></tr>
    ${pvmEilutes}
    <tr><td>Mokėti</td><td class="d">${suformatuok(v.sumos.isViso)}</td></tr>
  </table>

  ${
    p.iban
      ? `<div class="salys"><div><h2>Apmokėjimas</h2>${eilutes([
          `Sąskaita: ${p.iban}`,
          p.bankas ? `Bankas: ${p.bankas}` : null,
          `Mokėjimo paskirtis: ${v.numeris}`,
        ])}</div></div>`
      : ''
  }
  ${v.pastaba ? `<p class="smulkiai">${saugus(v.pastaba)}</p>` : ''}
  ${v.busena === 'juodrastis' ? '<p class="juodrastis">JUODRAŠTIS — dar neišrašyta</p>' : ''}
</div>
</main></body></html>`
}
