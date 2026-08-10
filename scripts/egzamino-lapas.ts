import { readFileSync } from 'node:fs'
import katex from 'katex'
import type { Lapas, LapoUzdavinys } from '../lib/egzaminai'

/**
 * Egzamino lapo HTML spausdinimui.
 *
 * Naudojama tik PDF gamybai scenarijumi, ne svetainėje — todėl KaTeX
 * surenkamas čia pat serveryje ir į failą nepatenka jokio JavaScript.
 * Tai svarbu: PDF spausdintuvas skripto nevykdytų, o formulės liktų
 * `$\dfrac{1}{2}$` pavidalu.
 */

const KATEX_CSS = readFileSync('node_modules/katex/dist/katex.min.css', 'utf8')

/** `$…$` intarpai surenkami KaTeX'u; likęs tekstas paliekamas kaip yra. */
function suFormulemis(tekstas: string): string {
  return tekstas
    .split('$')
    .map((dalis, i) => {
      if (i % 2 === 0) return dalis
      try {
        return katex.renderToString(dalis, { throwOnError: false, displayMode: false })
      } catch {
        return dalis
      }
    })
    .join('')
}

/** Vieta atsakymui — tuščia eilutė su punktyru. */
function atsakymoVieta(): string {
  return '<div class="atsakymo-vieta"><span>Atsakymas</span><span class="linija"></span></div>'
}

/** Vieta pilnajam sprendimui — languotas laukas. */
function sprendimoVieta(eiluciu = 6): string {
  return `<div class="sprendimo-vieta" style="--eilutes:${eiluciu}"></div>`
}

function uzdavinioHtml(u: LapoUzdavinys): string {
  let vidus = `<div class="klausimas">${suFormulemis(u.klausimas)}</div>`
  if (u.brezinys) vidus += `<div class="brezinys">${u.brezinys}</div>`

  if (u.formatas === 'pasirinkimas' && u.variantai) {
    vidus += `<ul class="variantai">${u.variantai
      .map(
        (v) =>
          `<li><span class="langelis"></span><b>${v.raide}</b>&nbsp; ${suFormulemis(v.tekstas)}</li>`,
      )
      .join('')}</ul>`
  } else if (u.formatas === 'poros' && u.poros) {
    const raides = ['A', 'B', 'C', 'D', 'E']
    vidus += `<div class="poros"><ol class="kaire">${u.poros
      .map((p, i) => `<li>${raides[i]}) ${suFormulemis(p.kaire)}</li>`)
      .join('')}</ol><ol class="desine">${u.poros
      .map((p, i) => `<li>${i + 1}) ${suFormulemis(p.desine)}</li>`)
      .join('')}</ol></div>${atsakymoVieta()}`
  } else if (u.formatas === 'eiliskumas' && u.elementai) {
    vidus += `<div class="elementai">${u.elementai.map(suFormulemis).join('&nbsp;&nbsp; ')}</div>${atsakymoVieta()}`
  } else if (u.taskai >= 3) {
    vidus += sprendimoVieta()
  } else {
    vidus += atsakymoVieta()
  }

  return `<li class="uzdavinys"><div class="nr">${u.nr}.</div><div class="turinys">${vidus}</div><div class="taskai">${u.taskai} t.</div></li>`
}

/** Bendras rėmas abiem dokumentams — lapui ir atsakymams. */
function dokumentas(antraste: string, turinys: string): string {
  return `<!doctype html><html lang="lt"><head><meta charset="utf-8"><title>${antraste}</title>
<style>${KATEX_CSS}
:root{--ink:#000;--muted:#444;--line:#999;--orange:#000;--paper:#fff}
@page{size:A4;margin:16mm 14mm}
*{box-sizing:border-box}
body{font:10.5pt/1.5 "Georgia","Times New Roman",serif;color:var(--ink);background:#fff;margin:0}
h1{font-size:15pt;margin:0 0 2mm}
.pastraipa{font-size:9pt;color:var(--muted);margin:0}
.antraste{border-bottom:1.5pt solid var(--ink);padding-bottom:3mm;margin-bottom:4mm}
.meta{display:flex;gap:6mm;font-size:9pt;color:var(--muted);margin-top:2mm}
.laukai{display:flex;gap:8mm;margin-top:3mm;font-size:9.5pt}
.laukai span{flex:1;border-bottom:0.7pt solid var(--line);padding-bottom:1mm}
.islyga{border:0.7pt solid var(--line);padding:2.5mm 3mm;font-size:8.5pt;color:var(--muted);margin-bottom:5mm}
h2{font-size:11.5pt;margin:6mm 0 1mm;padding-top:2mm;border-top:0.7pt solid var(--line)}
h2 small{font-weight:400;color:var(--muted);font-size:9pt}
ol.uzdaviniai{list-style:none;margin:0;padding:0}
li.uzdavinys{display:grid;grid-template-columns:8mm 1fr 12mm;gap:2mm;padding:2.5mm 0;break-inside:avoid;page-break-inside:avoid}
li.uzdavinys .nr{font-weight:700}
li.uzdavinys .taskai{font-size:8.5pt;color:var(--muted);text-align:right}
.klausimas{margin-bottom:1.5mm}
.brezinys{margin:2mm 0}
.brezinys svg{max-width:78mm;height:auto}
ul.variantai{list-style:none;margin:1.5mm 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:1.5mm 5mm}
ul.variantai li{display:flex;align-items:center;gap:1.5mm}
.langelis{display:inline-block;width:3.6mm;height:3.6mm;border:0.7pt solid var(--ink);flex:none}
.poros{display:grid;grid-template-columns:1fr 1fr;gap:4mm;margin:1.5mm 0}
.poros ol{list-style:none;margin:0;padding:0}
.poros li{padding:0.6mm 0}
.elementai{margin:1.5mm 0}
.atsakymo-vieta{display:flex;align-items:baseline;gap:2mm;margin-top:2mm;font-size:9pt;color:var(--muted)}
.atsakymo-vieta .linija{flex:1;border-bottom:0.7pt dotted var(--line);height:4mm}
.sprendimo-vieta{margin-top:2mm;height:calc(var(--eilutes)*5.5mm);border:0.7pt solid var(--line);
  background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 5.2mm,#ddd 5.2mm,#ddd 5.3mm)}
.poraste{margin-top:6mm;padding-top:2mm;border-top:0.7pt solid var(--line);font-size:8pt;color:var(--muted);display:flex;justify-content:space-between}
table.atsakymai{width:100%;border-collapse:collapse;font-size:9.5pt}
table.atsakymai th,table.atsakymai td{border:0.7pt solid var(--line);padding:1.5mm 2mm;text-align:left}
table.atsakymai th{background:#f2f2f2;font-size:8.5pt}
table.atsakymai td.nr{width:10mm;font-weight:700}
table.atsakymai td.ats{width:32mm;font-weight:700}
table.atsakymai td.t{width:12mm;text-align:center}
</style></head><body>${turinys}</body></html>`
}

/**
 * Įspėjimas, kuris privalo būti kiekviename lape.
 *
 * Tai ne teisinė formalybė, o esmė: mokytojas, radęs lapą be konteksto, turi
 * iškart matyti, kad tai ne NŠA užduotis.
 */
const ISLYGA =
  'Tai <b>ne</b> Nacionalinės švietimo agentūros užduotis. Uždaviniai originalūs, sukurti „Vardiklio“ ' +
  'generatoriaus; pakartota tik viešai skelbiama patikrinimo programos struktūra — dalys, uždavinių tipai, ' +
  'taškai ir trukmė. Oficialius pavyzdžius rasite nsa.smsm.lt.'

export function lapoHtml(l: Lapas): string {
  const e = l.egzaminas
  const dalys = l.dalys
    .map(
      (d) =>
        `<h2>${d.numeris} dalis. ${d.pavadinimas} <small>· ${d.uzdaviniai.length} užd. · ${d.taskai} t.</small></h2>
         <ol class="uzdaviniai">${d.uzdaviniai.map(uzdavinioHtml).join('')}</ol>`,
    )
    .join('')

  return dokumentas(
    `${e.pavadinimas} · ${l.variantas} variantas`,
    `<div class="antraste">
       <h1>${e.pavadinimas} — pasiruošimo užduotis</h1>
       <p class="pastraipa">${l.variantas} variantas</p>
       <div class="meta"><span>Trukmė ${e.trukmeMin} min</span><span>Iš viso ${e.taskai} taškų</span><span>${e.klase} klasė</span></div>
       <div class="laukai"><span>Vardas, pavardė</span><span>Klasė</span><span>Data</span></div>
     </div>
     <p class="islyga">${ISLYGA}</p>
     ${dalys}
     <div class="poraste"><span>vardiklis.lt</span><span>${e.pavadinimas} · ${l.variantas} variantas</span></div>`,
  )
}

export function atsakymuHtml(l: Lapas): string {
  const e = l.egzaminas
  const eilutes = l.dalys
    .flatMap((d) => d.uzdaviniai)
    .map(
      (u) =>
        `<tr><td class="nr">${u.nr}</td><td class="ats">${suFormulemis(u.atsakymasRodymui)}</td>
         <td class="t">${u.taskai}</td><td>${u.sprendimas ? suFormulemis(u.sprendimas) : ''}</td></tr>`,
    )
    .join('')

  return dokumentas(
    `${e.pavadinimas} · ${l.variantas} variantas · atsakymai`,
    `<div class="antraste">
       <h1>${e.pavadinimas} — atsakymai ir sprendimai</h1>
       <p class="pastraipa">${l.variantas} variantas · iš viso ${e.taskai} taškų</p>
     </div>
     <p class="islyga">${ISLYGA}</p>
     <table class="atsakymai"><thead><tr><th>Nr.</th><th>Atsakymas</th><th>T.</th><th>Sprendimas</th></tr></thead>
     <tbody>${eilutes}</tbody></table>
     <div class="poraste"><span>vardiklis.lt</span><span>${e.pavadinimas} · ${l.variantas} variantas</span></div>`,
  )
}
