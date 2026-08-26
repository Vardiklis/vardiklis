import { meta } from '@/lib/metaduomenys'
import { NMPP } from '@/lib/patikrinimai'
import PatikrinimoPuslapis from '../PatikrinimoPuslapis'

export const metadata = meta({
  antraste: NMPP.metaAntraste,
  aprasymas: NMPP.metaAprasymas,
  kelias: '/egzaminai/nmpp',
})

/**
 * Atvaizduojama užklausos metu, nes dalis kortelių ateina iš Payload.
 *
 * KODĖL NE STATIŠKAI. Statant Next paleidžia 13 lygiagrečių darbininkų ir visi
 * jie vienu metu kibtų į tą pačią SQLite bazę — statymas nulūžta. Be to įkeltas
 * PDF pasirodytų tik po naujo diegimo, o dabar atsiranda iš karto.
 */
export const dynamic = 'force-dynamic'

export default function Puslapis() {
  return <PatikrinimoPuslapis p={NMPP} />
}
