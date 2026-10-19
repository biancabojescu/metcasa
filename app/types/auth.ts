export interface AuthUser {
  id: number
  email: string
  name: string
  phone: string | null
  avatar: string | null
  avatar_url: string | null
  email_verified: boolean
  roles: string[]
  permissions: string[]
  created_at: string
  avatarColor: string
}

export const SUPER_ADMIN_ROLE = "super admin"

export interface AuthResponse {
  user: Omit<AuthUser, "avatarColor">
  token: string
  expires_at: string | null
}

export interface MeResponse {
  user: Omit<AuthUser, "avatarColor">
}

export interface MessageResponse {
  message: string
  already_verified?: boolean
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
}

export interface ProfileUpdatePayload {
  name?: string
  email?: string
  phone?: string | null
  avatar?: File | null
  remove_avatar?: boolean
}

export interface ResetPasswordPayload {
  token: string
  email: string
  password: string
  password_confirmation: string
}
