import type { CollectionConfig } from 'payload'

/** Administratoriai. Pirmasis sukuriamas atsidarius `/admin`. */
export const Naudotojai: CollectionConfig = {
  slug: 'naudotojai',
  labels: { singular: 'Naudotojas', plural: 'Naudotojai' },
  auth: true,
  admin: { useAsTitle: 'email', defaultColumns: ['vardas', 'email'] },
  fields: [{ name: 'vardas', type: 'text', label: 'Vardas', required: true }],
}
