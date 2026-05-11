export type DealType = "Vanzare" | "Inchiriere"

export interface Listing {
  id: number
  title: string
  location: string
  price: number
  dealType: DealType
  rooms: number | null
  surface: number
  floor: string | null
  icon: string
  gradient: string
}

const DUMMY_LISTINGS: Listing[] = [
  {
    id: 1,
    title: "Apartament 3 camere, decomandat",
    location: "Bucuresti, Aviatiei",
    price: 145000,
    dealType: "Vanzare",
    rooms: 3,
    surface: 78,
    floor: "4/8",
    icon: "🏢",
    gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
  },
  {
    id: 2,
    title: "Casa cu gradina, 4 camere",
    location: "Bucuresti, Pipera",
    price: 320000,
    dealType: "Vanzare",
    rooms: 4,
    surface: 180,
    floor: null,
    icon: "🏡",
    gradient: "linear-gradient(135deg, #00dc82 0%, #007f45 100%)",
  },
  {
    id: 3,
    title: "Garsoniera moderna, complet mobilata",
    location: "Bucuresti, Universitate",
    price: 450,
    dealType: "Inchiriere",
    rooms: 1,
    surface: 36,
    floor: "2/5",
    icon: "🛋️",
    gradient: "linear-gradient(135deg, #1F2937 0%, #4F46E5 100%)",
  },
  {
    id: 4,
    title: "Apartament 2 camere, vedere panoramica",
    location: "Bucuresti, Floreasca",
    price: 700,
    dealType: "Inchiriere",
    rooms: 2,
    surface: 55,
    floor: "10/12",
    icon: "🏙️",
    gradient: "linear-gradient(135deg, #4F46E5 0%, #111827 100%)",
  },
  {
    id: 5,
    title: "Teren intravilan, 500 mp",
    location: "Otopeni",
    price: 85000,
    dealType: "Vanzare",
    rooms: null,
    surface: 500,
    floor: null,
    icon: "🌳",
    gradient: "linear-gradient(135deg, #75edae 0%, #016538 100%)",
  },
  {
    id: 6,
    title: "Penthouse de lux, terasa privata",
    location: "Bucuresti, Herastrau",
    price: 580000,
    dealType: "Vanzare",
    rooms: 4,
    surface: 165,
    floor: "12/12",
    icon: "🌆",
    gradient: "linear-gradient(135deg, #6366F1 0%, #111827 100%)",
  },
  {
    id: 7,
    title: "Spatiu comercial, parter stradal",
    location: "Bucuresti, Calea Victoriei",
    price: 1800,
    dealType: "Inchiriere",
    rooms: null,
    surface: 95,
    floor: "P",
    icon: "🏬",
    gradient: "linear-gradient(135deg, #1F2937 0%, #6366F1 100%)",
  },
  {
    id: 8,
    title: "Apartament 2 camere, bloc nou",
    location: "Bucuresti, Militari",
    price: 92000,
    dealType: "Vanzare",
    rooms: 2,
    surface: 58,
    floor: "3/6",
    icon: "🏢",
    gradient: "linear-gradient(135deg, #4F46E5 0%, #00dc82 100%)",
  },
  {
    id: 9,
    title: "Vila individuala, piscina",
    location: "Snagov",
    price: 1250000,
    dealType: "Vanzare",
    rooms: 6,
    surface: 380,
    floor: null,
    icon: "🏖️",
    gradient: "linear-gradient(135deg, #00dc82 0%, #4F46E5 100%)",
  },
]

export const useListings = () => {
  const listings = readonly(DUMMY_LISTINGS)
  const getById = (id: number) => DUMMY_LISTINGS.find((l) => l.id === id)
  return { listings, getById }
}
