export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const auth = useAuthStore()
  useFavoritesStore()

  auth.hydrate().catch(() => {
    /* erorile sunt deja tratate intern in hydrate */
  })
})
