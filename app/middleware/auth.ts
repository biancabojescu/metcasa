
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  await auth.hydrate()

  if (!auth.isLoggedIn) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    })
  }
})
