import nodemailer, { type Transporter } from 'nodemailer'

/**
 * Išeinančio pašto siuntėjas.
 *
 * KODĖL SMTP, O NE API SERVISAS. Visa sistema sukasi Hostinger'yje, o laiškai
 * eina į tą pačią Modestos Gmail dėžutę, iš kurios ir siunčiami. Tam nereikia
 * nei atskiro serviso, nei DNS įrašų domenui — užtenka Google „App password“
 * (Google paskyra → Security → 2-Step Verification → App passwords).
 *
 * GMAIL REIKALAUJA, kad `from` sutaptų su prisijungusiu naudotoju — kitaip
 * laiškas atmetamas. Todėl `from` visada yra `SMTP_USER`, o lankytojo adresas
 * dedamas į `Reply-To` (žr. `lib/uzklausa.ts`).
 */

/** Sujungimas kuriamas kartą ir laikomas modulyje — kiekvienai užklausai
 *  atskiras TLS rankos paspaudimas su Gmail užtruktų apie sekundę. */
let siuntejas: Transporter | null = null

export type PastoNustatymai = {
  host: string
  port: number
  user: string
  pass: string
  /** Kam ateina užklausos. Nenurodžius — pačiam `SMTP_USER`. */
  gavejas: string
}

/**
 * Nustatymai iš aplinkos kintamųjų. Grąžina `null`, jei siuntimas
 * nesukonfigūruotas — tada forma parodo telefoną ir el. paštą, o ne tyliai
 * praryja užklausą.
 */
export function pastoNustatymai(): PastoNustatymai | null {
  const user = process.env.SMTP_USER?.trim()

  /**
   * Google App password rodo grupėmis po keturis — „abcd efgh ijkl mnop“ —
   * ir žmogus jį nukopijuoja būtent taip. Su tarpais Gmail atsako
   * „535 BadCredentials“, o kaltinamas būna slaptažodis. Tarpai teisingame
   * app password neegzistuoja, tad iškirpti juos saugu.
   */
  const pass = process.env.SMTP_PASS?.replace(/s+/g, '')

  if (!user || !pass) return null

  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    /**
     * 587 (STARTTLS), o ne 465. Abu šifruoti vienodai, bet 465 jungiantis
     * lūžta ten, kur mašina turi IPv6 sąsają be veikiančio maršruto: nodemailer
     * pirma bando AAAA adresą, gauna ECONNREFUSED ir prie 465 nebespėja
     * persijungti į IPv4 (atsarginis adresų sąrašas veikia tik neužmegztam
     * TLS). Prie 587 tas pats persijungimas įvyksta ir laiškas išeina.
     */
    port: Number(process.env.SMTP_PORT || 587),
    user,
    pass,
    gavejas: process.env.UZKLAUSU_PASTAS || user,
  }
}

export function pastoSiuntejas(n: PastoNustatymai): Transporter {
  if (!siuntejas) {
    siuntejas = nodemailer.createTransport({
      host: n.host,
      port: n.port,
      // 465 — TLS nuo pirmos sekundės; 587 — STARTTLS jau užmegztame sujungime.
      secure: n.port === 465,
      // Be jo pakibęs sujungimas laikytų formą „Siunčiama…" visą minutę.
      connectionTimeout: 10_000,
      auth: { user: n.user, pass: n.pass },
    })
  }
  return siuntejas
}
