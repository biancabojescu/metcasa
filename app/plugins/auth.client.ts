import { useAuthStore } from "~/stores/auth"
import { useFavoritesStore } from "~/stores/favorites"

export default defineNuxtPlugin(() => {
  const auth = useAuthStore()
  const favorites = useFavoritesStore()
  auth.hydrate()
  favorites.hydrate()
})
