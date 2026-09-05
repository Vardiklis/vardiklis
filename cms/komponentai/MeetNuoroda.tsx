'use client'

import type { DefaultCellComponentProps, TextFieldClient } from 'payload'

/**
 * Meet nuoroda mokinių sąraše — paspaudžiama, atsidaro naujame lange.
 *
 * Numatytai Payload lentelėje rodo gryną tekstą, tad norint patekti į kambarį
 * tekdavo atsidaryti mokinio įrašą ir nuorodą nusikopijuoti ranka.
 *
 * `stopPropagation` — kad paspaudimas nenukeliautų į eilutės nuorodą ir
 * neatidarytų mokinio redagavimo lango vietoj Meet.
 *
 * Rodomas tik kambario kodas: pilnas adresas lentelėje užimtų pusę pločio, o
 * `https://meet.google.com/` prieš kiekvieną eilutę nieko nepasako.
 */
export function MeetNuorodosCele({
  cellData,
}: DefaultCellComponentProps<TextFieldClient, string>) {
  if (!cellData) return null

  const kodas = cellData.replace(/^https?:\/\/meet\.google\.com\//, '')

  return (
    <a
      href={cellData}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(ivykis) => ivykis.stopPropagation()}
      title={cellData}
    >
      {kodas}
    </a>
  )
}
