// Types din app/types/auth.ts (auto-imported)
// Helpers din app/composables/useApi.ts (auto-imported)

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

const decorate = (raw: Omit<AuthUser, "avatarColor">): AuthUser => ({
  ...raw,
  avatarColor: pickAvatarColor(raw.email),
})

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as AuthUser | null,
    token: null as string | null,
    hydrated: false,
    fetching: false,
  }),

  getters: {
    isLoggedIn: (state) => state.user !== null,
    isVerified: (state) => state.user?.email_verified === true,
    isSuperAdmin: (state) => state.user?.roles?.includes(SUPER_ADMIN_ROLE) === true,
    hasRole: (state) => (role: string) => state.user?.roles?.includes(role) === true,
    can: (state) => (permission: string) => state.user?.permissions?.includes(permission) === true,
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
    async hydrate() {
      if (this.hydrated) return
      this.hydrated = true
      if (!import.meta.client) return

      const token = getAuthToken()
      if (!token) {
        if (isAuthenticatedFlag()) setAuthToken(null)
        return
      }
      this.token = token
      await this.fetchMe()
    },

    async fetchMe() {
      const favorites = useFavoritesStore()
      if (!this.token) return
      this.fetching = true
      try {
        const api = useApi()
        const res = await api<MeResponse>("/auth/me")
        this.user = decorate(res.user)
        await favorites.hydrateForUser(this.user.id)
      } catch {
        this.token = null
        setAuthToken(null)
        this.user = null
        favorites.reset()
      } finally {
        this.fetching = false
      }
    },

    async login(email: string, password: string, remember = false) {
      const favorites = useFavoritesStore()
      const api = useApi()
      const res = await api<AuthResponse>("/auth/login", {
        method: "POST",
        body: { email, password, remember, device_name: "web" },
      })
      this.token = res.token
      setAuthToken(res.token, res.expires_at)
      this.user = decorate(res.user)
      await favorites.hydrateForUser(this.user.id)
    },

    async register(payload: RegisterPayload) {
      const favorites = useFavoritesStore()
      const api = useApi()
      const res = await api<AuthResponse>("/auth/register", {
        method: "POST",
        body: { ...payload, remember: true },
      })
      this.token = res.token
      setAuthToken(res.token, res.expires_at)
      this.user = decorate(res.user)
      await favorites.hydrateForUser(this.user.id)
    },

    async logout() {
      const favorites = useFavoritesStore()
      const api = useApi()
      try {
        if (this.token) await api("/auth/logout", { method: "POST" })
      } catch {
        // ignore
      } finally {
        this.token = null
        this.user = null
        setAuthToken(null)
        favorites.reset()
      }
    },

    async resendVerification() {
      const api = useApi()
      return await api<MessageResponse>("/auth/email/resend", { method: "POST" })
    },

    async forgotPassword(email: string) {
      const api = useApi()
      return await api<MessageResponse>("/auth/password/forgot", {
        method: "POST",
        body: { email },
      })
    },

    async resetPassword(payload: ResetPasswordPayload) {
      const api = useApi()
      return await api<MessageResponse>("/auth/password/reset", {
        method: "POST",
        body: payload,
      })
    },

    async verifyEmail(signedUrl: string) {
      const api = useApi()
      const res = await api<MessageResponse>(signedUrl)
      if (this.user) this.user = { ...this.user, email_verified: true }
      return res
    },

    async updateProfile(payload: ProfileUpdatePayload) {
      const api = useApi()
      const fd = new FormData()
      if (payload.name !== undefined) fd.set("name", payload.name)
      if (payload.email !== undefined) fd.set("email", payload.email)
      if (payload.phone !== undefined) fd.set("phone", payload.phone ?? "")
      if (payload.avatar instanceof File) fd.set("avatar", payload.avatar)
      if (payload.remove_avatar) fd.set("remove_avatar", "1")

      const res = await api<{ message: string; user: Omit<AuthUser, "avatarColor"> }>(
        "/auth/profile",
        { method: "POST", body: fd },
      )
      this.user = decorate(res.user)
      return res
    },
  },
})
