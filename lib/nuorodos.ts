/**
 * Navigacijos nuorodos. Atskirai nuo `Navigacija.tsx`, nes tą modulį žymi
 * `'use client'` — per serverio ribą jo eksportai virsta client reference,
 * o ne tikrais duomenimis.
 */
export const nuorodos = [
  { href: '/testas', tekstas: 'Diagnostika' },
  { href: '/uzduotys', tekstas: 'Uždaviniai' },
  { href: '/testai', tekstas: 'Testai' },
  { href: '/egzaminai', tekstas: 'NMPP ir PUPP' },
  { href: '/straipsniai', tekstas: 'Straipsniai' },
  { href: '/apie', tekstas: 'Apie' },
] as const
