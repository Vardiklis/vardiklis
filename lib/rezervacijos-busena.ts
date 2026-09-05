/**
 * Kalendoriaus rezervacijos atsakymo forma.
 *
 * Atskirai nuo `lib/rezervacija.ts` sąmoningai: tas failas pažymėtas
 * `'use server'`, o tokiuose leidžiama eksportuoti tik asinchronines funkcijas.
 */
export type RezervacijosLaukas =
  | 'tevoVardas'
  | 'vaikoVardas'
  | 'elPastas'
  | 'telefonas'
  | 'sutikimas'
  | 'laikas'

export type RezervacijosBusena = {
  bukle: 'tuscia' | 'pavyko' | 'klaida'
  pranesimas: string
  laukai?: Partial<Record<RezervacijosLaukas, string>>
}

export const PRADINE_REZERVACIJA: RezervacijosBusena = { bukle: 'tuscia', pranesimas: '' }
