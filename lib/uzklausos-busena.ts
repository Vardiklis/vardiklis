/**
 * Registracijos formos atsakymo forma.
 *
 * Atskirai nuo `lib/uzklausa.ts` sąmoningai: tas failas pažymėtas `'use server'`,
 * o tokiuose leidžiama eksportuoti tik asinchronines funkcijas. Konstanta ten
 * virstų nuoroda į serverį, ir `useActionState` pradinė būsena būtų ne objektas.
 */
export type UzklausosBusena = {
  bukle: 'tuscia' | 'pavyko' | 'klaida'
  pranesimas: string
  /** Klaidos prie konkrečių laukų — kad nereikėtų spėlioti, ko trūksta. */
  laukai?: Partial<Record<'vardas' | 'kontaktas' | 'sutikimas', string>>
}

export const PRADINE_BUSENA: UzklausosBusena = { bukle: 'tuscia', pranesimas: '' }
