const TOKEN_KEY = "metCasa_auth_token"
const AUTH_FLAG_KEY = "metCasa_is_authenticated"
const EXPIRES_KEY = "metCasa_auth_expires_at"

const isClient = () => import.meta.client

export const getAuthToken = (): string | null => {
  if (!isClient()) return null

  const expiresAt = localStorage.getItem(EXPIRES_KEY)
  if (expiresAt && Date.parse(expiresAt) <= Date.now()) {
    clearAuth()
    return null
  }

  return localStorage.getItem(TOKEN_KEY)
}

export const isAuthenticatedFlag = (): boolean => {
  if (!isClient()) return false
  return localStorage.getItem(AUTH_FLAG_KEY) === "1"
}

export const setAuthToken = (token: string | null, expiresAt: string | null = null) => {
  if (!isClient()) return
  if (!token) {
    clearAuth()
    return
  }
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(AUTH_FLAG_KEY, "1")
  if (expiresAt) {
    localStorage.setItem(EXPIRES_KEY, expiresAt)
  } else {
    localStorage.removeItem(EXPIRES_KEY)
  }
}

const clearAuth = () => {
  if (!isClient()) return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(AUTH_FLAG_KEY)
  localStorage.removeItem(EXPIRES_KEY)
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiUrl || "http://localhost:8000/api/v1"

  return $fetch.create({
    baseURL,
    onRequest({ options }) {
      const token = getAuthToken()
      const headers = new Headers(options.headers as HeadersInit | undefined)
      headers.set("Accept", "application/json")
      if (token) headers.set("Authorization", `Bearer ${token}`)
      options.headers = headers
    },
    onResponseError({ response }) {
      if (response.status === 401 && isClient()) {
        setAuthToken(null)
      }
    },
  })
}
