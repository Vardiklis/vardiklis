import { svetaine } from '@/lib/kontaktai'

/**
 * Atsakymo puslapis vidiniams maršrutams, į kuriuos patenkama iš laiško
 * („Buvo / Nebuvo“, priminimų atsisakymas).
 *
 * Atskirai nuo Next'o puslapių sąmoningai: tai `Response`, grąžinamas iš
 * `route.ts`, o ne komponentas — maršrutas turi atsakyti iškart, be jokio
 * duomenų gavimo antrą kartą. Stilius įrašytas viduje, nes puslapis gyvuoja
 * už `(frontend)` maketo ribų ir svetainės CSS jo nepasiekia.
 */
export function vidausPuslapis(
  antraste: string,
  tekstas: string,
  statusas: number,
  papildoma?: string,
): Response {
  const html = `<!doctype html>
<html lang="lt"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${antraste} · ${svetaine.pavadinimas}</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fbf8f2;color:#12100e;
       font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
  main{max-width:32rem;padding:2rem;text-align:center}
  h1{font-size:1.5rem;margin:0 0 .5rem}
  p{color:#6b655f;margin:0}
  a,button{display:inline-block;margin-top:1.5rem;color:#12100e;font-weight:600;font-size:1rem;
    font-family:inherit;background:none;border:0;padding:0;cursor:pointer;
    text-decoration:underline;text-decoration-color:#ff5c00;text-decoration-thickness:2px;
    text-underline-offset:4px}
</style></head>
<body><main><h1>${antraste}</h1><p>${tekstas}</p>${papildoma ?? ''}</main></body></html>`

  return new Response(html, {
    status: statusas,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

/** Nuoroda puslapio apačioje — atskirai, kad maršrutai nekartotų HTML'o. */
export function vidausNuoroda(adresas: string, tekstas: string): string {
  return `<a href="${adresas}">${tekstas}</a>`
}
