const empty = (): SidebarFilters => ({
  location: "",
  dealType: null,
  propertyType: null,
  rooms: null,
  priceMin: null,
  priceMax: null,
  surfaceMin: null,
  surfaceMax: null,
})

export const useListingFiltersStore = defineStore("listingFilters", {
  state: () => ({
    filters: empty() as SidebarFilters,
    appliedAt: 0,
    mobileOpen: false,
  }),
  getters: {
    asApiQuery(state): Partial<ListingFilters> {
      const f = state.filters
      return {
        location: f.location || undefined,
        deal_type: f.dealType || undefined,
        property_type: f.propertyType || undefined,
        rooms: f.rooms || undefined,
        price_min: f.priceMin || undefined,
        price_max: f.priceMax || undefined,
        surface_min: f.surfaceMin || undefined,
        surface_max: f.surfaceMax || undefined,
      }
    },
  },
  actions: {
    apply(filters: SidebarFilters) {
      this.filters = { ...filters }
      this.appliedAt = Date.now()
      this.mobileOpen = false
    },
    reset() {
      this.filters = empty()
      this.appliedAt = Date.now()
    },
    setFromQuery(q: Record<string, string | string[]>) {
      const str = (v: string | string[] | undefined) =>
        typeof v === "string" ? v : Array.isArray(v) ? v[0] : ""
      const num = (v: string | string[] | undefined) => {
        const s = str(v)
        if (!s) return null
        const n = Number(s)
        return Number.isFinite(n) ? n : null
      }
      this.filters = {
        location: str(q.location),
        dealType: (str(q.deal_type) || null) as SidebarFilters["dealType"],
        propertyType: (str(q.property_type) || null) as SidebarFilters["propertyType"],
        rooms: str(q.rooms) || null,
        priceMin: num(q.price_min),
        priceMax: num(q.price_max),
        surfaceMin: num(q.surface_min),
        surfaceMax: num(q.surface_max),
      }
    },
    toQuery(): Record<string, string> {
      const f = this.filters
      const out: Record<string, string> = {}
      if (f.location) out.location = f.location
      if (f.dealType) out.deal_type = f.dealType
      if (f.propertyType) out.property_type = f.propertyType
      if (f.rooms) out.rooms = f.rooms
      if (f.priceMin !== null) out.price_min = String(f.priceMin)
      if (f.priceMax !== null) out.price_max = String(f.priceMax)
      if (f.surfaceMin !== null) out.surface_min = String(f.surfaceMin)
      if (f.surfaceMax !== null) out.surface_max = String(f.surfaceMax)
      return out
    },
    openMobile() {
      this.mobileOpen = true
    },
    closeMobile() {
      this.mobileOpen = false
    },
  },
})
