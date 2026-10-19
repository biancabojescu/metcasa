interface FavoritesIndexResponse {
  data: Listing[]
  ids: number[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

interface FavoriteMutationResponse {
  message: string
  ids: number[]
}

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    /** ID-urile tuturor favoritelor (active + inactive) pentru hidratarea inimii rosii */
    ids: [] as number[],
    hydrated: false,
    loading: false,
  }),

  getters: {
    count: (state) => state.ids.length,
    has: (state) => (id: number) => state.ids.includes(id),
  },

  actions: {
    /**
     * Hidrateaza ID-urile favoritelor de la BE. Apelata dupa login si la boot.
     * Pentru utilizatorii anonimi nu se cheama nimic - ramane gol.
     */
    async hydrateForUser(userId: number | null) {
      if (userId === null) {
        this.ids = []
        this.hydrated = true
        return
      }
      try {
        const api = useApi()
        const res = await api<FavoritesIndexResponse>("/favorites", {
          query: { per_page: 1, page: 1 },
        })
        this.ids = res.ids
      } catch {
        this.ids = []
      } finally {
        this.hydrated = true
      }
    },

    async fetchPage(page: number, perPage = 9) {
      this.loading = true
      try {
        const api = useApi()
        return await api<FavoritesIndexResponse>("/favorites", {
          query: { page, per_page: perPage },
        })
      } finally {
        this.loading = false
      }
    },

    async toggle(listingId: number) {
      const api = useApi()
      const isFav = this.ids.includes(listingId)
      try {
        const res = await api<FavoriteMutationResponse>(`/favorites/${listingId}`, {
          method: isFav ? "DELETE" : "POST",
        })
        this.ids = res.ids
      } catch {
        // ignoram, lasam UI-ul ca era
      }
    },

    async remove(listingId: number) {
      const api = useApi()
      try {
        const res = await api<FavoriteMutationResponse>(`/favorites/${listingId}`, {
          method: "DELETE",
        })
        this.ids = res.ids
      } catch {
        // ignore
      }
    },

    async clear() {
      const api = useApi()
      try {
        const res = await api<FavoriteMutationResponse>("/favorites", {
          method: "DELETE",
        })
        this.ids = res.ids
      } catch {
        // ignore
      }
    },

    reset() {
      this.ids = []
      this.hydrated = false
    },
  },
})
