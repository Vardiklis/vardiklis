import { NextResponse, type NextRequest } from 'next/server'
import { DIENYNO_SAKNIS } from '@/lib/dienynas-adresas'

/**
 * `dienynas.vardiklis.lt` → vidinis `/dienynas/…` maršrutas.
 *
 * Aplikacija ir duomenų bazė tos pačios, skiriasi tik adresas. Subdomene:
 *   • `/`, `/prisijungti` perrašomi į `/dienynas`, `/dienynas/prisijungti`;
 *   • `/admin` ir `/api` neatsako — CMS lieka tik `vardiklis.lt/admin`;
 *   • `robots.txt` draudžia viską, o atsakymai nekešuojami: puslapis asmeninis,
 *     ir krašto kešas neturi Kate dienyno parodyti Jonui.
 *
 * TIK SUBDOMENUI (`matcher.has`). Kai failas `proxy.ts` yra, Next'as užklausos
 * kūną laiko atmintyje iki 10 MB (`proxyClientMaxBodySize`) — pagrindinėje
 * svetainėje tai nukirstų didesnius į CMS keliamus PDF. Todėl svetainės
 * užklausos proxy visai nepasiekia.
 *
 * `X-Forwarded-Host` — jei serveris priekyje turi atvirkštinį tarpininką, kuris
 * `Host` pakeičia savu.
 */
export function proxy(uzklausa: NextRequest) {
  const { pathname } = uzklausa.nextUrl

  if (pathname === '/robots.txt') {
    return new NextResponse('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  if (/^\/(api|admin)(\/|$)/.test(pathname)) {
    return new NextResponse('Nerasta.', { status: 404 })
  }

  // `dienynas.vardiklis.lt/dienynas/…` — tas pats be dvigubo žodžio.
  if (pathname === DIENYNO_SAKNIS || pathname.startsWith(`${DIENYNO_SAKNIS}/`)) {
    const svarus = uzklausa.nextUrl.clone()
    svarus.pathname = pathname.slice(DIENYNO_SAKNIS.length) || '/'
    return NextResponse.redirect(svarus)
  }

  const vidinis = uzklausa.nextUrl.clone()
  vidinis.pathname = pathname === '/' ? DIENYNO_SAKNIS : `${DIENYNO_SAKNIS}${pathname}`
  const atsakymas = NextResponse.rewrite(vidinis)
  atsakymas.headers.set('Cache-Control', 'private, no-store')
  atsakymas.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return atsakymas
}

export const config = {
  matcher: [
    {
      // Statika (`_next`) ir šakniniai piktogramų failai lieka nepaliesti.
      source: '/((?!_next/|favicon\\.ico|icon\\.png|apple-icon\\.png).*)',
      has: [{ type: 'header', key: 'host', value: 'dienynas\\..*' }],
    },
    {
      source: '/((?!_next/|favicon\\.ico|icon\\.png|apple-icon\\.png).*)',
      has: [{ type: 'header', key: 'x-forwarded-host', value: 'dienynas\\..*' }],
    },
  ],
}
