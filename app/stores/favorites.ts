import { defineStore } from "pinia"

const STORAGE_KEY = "metCasa_favorites"

export const useFavoritesStore = defineStore("favorites", {
  state: () => ({
    ids: [] as number[],
    hydrated: false,
  }),

  getters: {
    count: (state) => state.ids.length,
    has: (state) => (id: number) => state.ids.includes(id),
  },

  actions: {
    hydrate() {
      if (this.hydrated || !import.meta.client) return
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) this.ids = parsed.filter((x) => typeof x === "number")
        } catch {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
      this.hydrated = true
    },

    persist() {
      if (!import.meta.client) return
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.ids))
    },

    toggle(id: number) {
      const idx = this.ids.indexOf(id)
      if (idx === -1) this.ids.push(id)
      else this.ids.splice(idx, 1)
      this.persist()
    },

    add(id: number) {
      if (!this.ids.includes(id)) {
        this.ids.push(id)
        this.persist()
      }
    },

    remove(id: number) {
      const idx = this.ids.indexOf(id)
      if (idx !== -1) {
        this.ids.splice(idx, 1)
        this.persist()
      }
    },

    clear() {
      this.ids = []
      this.persist()
    },
  },
})
