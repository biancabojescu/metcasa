export type DealType = "Vanzare" | "Inchiriere"
export type PropertyType = "Apartament" | "Casa" | "Teren" | "Comercial"
export type ListingStatus = "active" | "inactive"
export type ListingSort = "recent" | "price_asc" | "price_desc" | "surface_desc"

export interface ListingImage {
  path: string
  url: string
}

export interface ListingOwner {
  id: number
  name: string
  email: string
  phone: string | null
  avatar_url: string | null
}

export interface Listing {
  id: number
  title: string
  location: string
  description: string | null
  deal_type: DealType
  property_type: PropertyType
  rooms: number | null
  surface: number
  floor: string | null
  price: number
  images: ListingImage[]
  is_featured: boolean
  status: ListingStatus
  archive_note: string | null
  owner?: ListingOwner
  created_at: string
  updated_at: string
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface ListingsPage {
  data: Listing[]
  meta: PaginationMeta
}

export interface FavoritesIndexResponse extends ListingsPage {
  ids: number[]
}

export interface ListingFilters {
  search?: string
  location?: string
  deal_type?: DealType | null
  property_type?: PropertyType | null
  rooms?: string | number | null
  price_min?: number | null
  price_max?: number | null
  surface_min?: number | null
  surface_max?: number | null
  status?: ListingStatus | null
  owner_id?: number | null
  ids?: number[]
  include_all_statuses?: boolean
  sort?: ListingSort
  page?: number
  per_page?: number
}

export interface SidebarFilters {
  location: string
  dealType: DealType | null
  propertyType: PropertyType | null
  rooms: string | null
  priceMin: number | null
  priceMax: number | null
  surfaceMin: number | null
  surfaceMax: number | null
}

export const PROPERTY_PRESETS: Record<PropertyType, { icon: string; gradient: string }> = {
  Apartament: { icon: "🏢", gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)" },
  Casa: { icon: "🏡", gradient: "linear-gradient(135deg, #00dc82 0%, #007f45 100%)" },
  Teren: { icon: "🌳", gradient: "linear-gradient(135deg, #75edae 0%, #016538 100%)" },
  Comercial: { icon: "🏬", gradient: "linear-gradient(135deg, #1F2937 0%, #6366F1 100%)" },
}

export const presetFor = (type: PropertyType) => PROPERTY_PRESETS[type]
