import { getPayload } from 'payload'
import config from '@payload-config'
import { isafRinkmena } from '@/lib/isaf-xml'

/**
 * i.SAF rinkmenos peržiūra ir atsisiuntimas: `/vidus/isaf/2026-09`.
 *
 * KAM TO REIKIA, KAI YRA API. Pirma, kol sertifikato dar nėra, rinkmeną galima
 * įkelti ranka per imas.vmi.lt — sistema naudinga iškart. Antra, prieš jungiant
 * API būtent taip ir reikia pasitikrinti: rankinis įkėlimas atskiria XML klaidas
 * nuo sujungimo klaidų, o painioti jas brangu.
 *
 * TIK PRISIJUNGUSIAM — rinkmenoje yra visų tėvų vardai ir mėnesio apyvarta.
 * Parašo kelio čia nėra sąmoningai: šis failas skirtas man, ne tėvams.
 */

export const dynamic = 'force-dynamic'

const BE_KESO = { 'Cache-Control': 'no-store' }

export async function GET(uzklausa: Request, ctx: RouteContext<'/vidus/isaf/[laikotarpis]'>) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: uzklausa.headers })
  if (!user) return new Response('Neleista.', { status: 401, headers: BE_KESO })

  const { laikotarpis } = await ctx.params

  let rinkmena
  try {
    rinkmena = await isafRinkmena(laikotarpis)
  } catch (klaida) {
    return new Response(String(klaida), { status: 400, headers: BE_KESO })
  }

  const atsiusti = new URL(uzklausa.url).searchParams.get('atsiusti') === '1'

  /**
   * Kliūtys rašomos į XML komentarą, o ne atskiru puslapiu: taip jos matomos
   * peržiūrint rinkmeną ir nedingsta ją išsaugojus. VMI komentarų neskaito,
   * bet failo su kliūtimis vis tiek nepriimtų — todėl geriau, kad priežastis
   * keliautų kartu su failu.
   */
  const turinys = rinkmena.klaidos.length
    ? `<!--\n  DĖMESIO — rinkmena dar netvarkinga:\n${rinkmena.klaidos
        .map((k) => `  · ${k.replace(/--/g, '—')}`)
        .join('\n')}\n-->\n${rinkmena.xml}`
    : rinkmena.xml

  return new Response(turinys, {
    headers: {
      ...BE_KESO,
      'Content-Type': 'application/xml; charset=utf-8',
      'Content-Disposition': `${atsiusti ? 'attachment' : 'inline'}; filename="iSAF-${laikotarpis}.xml"`,
    },
  })
}
