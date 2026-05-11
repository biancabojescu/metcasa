<template>
  <header
    class="sticky top-0 z-50 flex max-h-22 flex-row items-center justify-between gap-6 overflow-hidden pr-6 pl-3 bg-grey-10 opacity-100 shadow-sm"
  >
    <AppLogo />
    <nav class="flex items-center gap-4 md:gap-6">
      <NuxtLink
        to="/anunturi"
        class="text-sm font-medium text-purple-900 hover:text-purple-500 transition-colors md:text-base"
      >
        Anunturi
      </NuxtLink>

      <NuxtLink
        v-if="auth.isLoggedIn"
        to="/favorite"
        class="relative flex items-center text-purple-900 hover:text-purple-500 transition-colors"
        aria-label="Favorite"
      >
        <span class="text-xl" aria-hidden="true">&#10084;</span>
        <span
          v-if="favorites.count > 0"
          class="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-500 px-1 text-[10px] font-semibold text-white"
        >
          {{ favorites.count }}
        </span>
      </NuxtLink>

      <NuxtLink
        v-if="auth.isLoggedIn"
        to="/profil"
        class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
        :style="{ background: auth.user!.avatarColor }"
        aria-label="Profil"
      >
        {{ auth.initials }}
      </NuxtLink>

      <NuxtLink
        v-else
        to="/login"
        class="rounded-full bg-purple-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-purple-500 md:px-5 md:py-2"
      >
        Login
      </NuxtLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth"
import { useFavoritesStore } from "~/stores/favorites"

const auth = useAuthStore()
const favorites = useFavoritesStore()
</script>
