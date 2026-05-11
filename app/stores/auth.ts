import { defineStore } from "pinia"

export interface AuthUser {
  id: number
  email: string
  name: string
  phone: string
  avatarColor: string
  joinedAt: string
}

const STORAGE_KEY = "metCasa_auth_user"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as AuthUser | null,
    hydrated: false,
  }),

  getters: {
    isLoggedIn: (state) => state.user !== null,
    initials: (state) =>
      state.user
        ? state.user.name
            .split(" ")
            .map((p) => p.charAt(0).toUpperCase())
            .slice(0, 2)
            .join("")
        : "",
  },

  actions: {
    hydrate() {
      if (this.hydrated || !import.meta.client) return
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          this.user = JSON.parse(raw) as AuthUser
        } catch {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
      this.hydrated = true
    },

    persist() {
      if (!import.meta.client) return
      if (this.user) localStorage.setItem(STORAGE_KEY, JSON.stringify(this.user))
      else localStorage.removeItem(STORAGE_KEY)
    },

    async login(email: string, password: string) {
      if (!email || password.length < 4) {
        throw new Error("Email sau parola invalida.")
      }
      const name = email.split("@")[0]!.replace(/[._-]/g, " ")
      this.user = {
        id: Date.now(),
        email,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        phone: "",
        avatarColor: pickAvatarColor(email),
        joinedAt: new Date().toISOString(),
      }
      this.persist()
    },

    async register(payload: { email: string; password: string; name: string }) {
      if (!payload.email || payload.password.length < 4 || !payload.name) {
        throw new Error("Verifica datele introduse.")
      }
      this.user = {
        id: Date.now(),
        email: payload.email,
        name: payload.name,
        phone: "",
        avatarColor: pickAvatarColor(payload.email),
        joinedAt: new Date().toISOString(),
      }
      this.persist()
    },

    updateProfile(patch: Partial<Pick<AuthUser, "name" | "phone" | "email">>) {
      if (!this.user) return
      this.user = { ...this.user, ...patch }
      this.persist()
    },

    logout() {
      this.user = null
      this.persist()
    },
  },
})

const AVATAR_COLORS = [
  "#4F46E5",
  "#6366F1",
  "#00dc82",
  "#00a155",
  "#1F2937",
  "#7c3aed",
]

function pickAvatarColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash + seed.charCodeAt(i)) | 0
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]!
}
