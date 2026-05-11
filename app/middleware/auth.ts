import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  auth.hydrate()

  if (!auth.isLoggedIn) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    })
  }
})
