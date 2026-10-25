<template>
  <header
    class="sticky top-0 z-50 flex max-h-22 flex-row items-center justify-between gap-3 overflow-visible pr-4 pl-3 bg-grey-10 opacity-100 shadow-sm md:gap-6 md:pr-6"
  >
    <AppLogo />

    <!-- Desktop nav -->
    <nav class="hidden items-center gap-4 md:flex md:gap-6">
      <NuxtLink
        to="/anunturi"
        class="text-sm font-medium text-purple-900 hover:text-purple-500 transition-colors md:text-base"
      >
        Anunturi
      </NuxtLink>

      <NuxtLink
        v-if="auth.isSuperAdmin"
        to="/dashboard"
        class="text-sm font-medium text-purple-900 hover:text-purple-500 transition-colors md:text-base"
      >
        Dashboard
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
        class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
        :style="auth.user!.avatar_url ? undefined : { background: auth.user!.avatarColor }"
        aria-label="Profil"
      >
        <img
          v-if="auth.user!.avatar_url"
          :src="auth.user!.avatar_url"
          alt=""
          class="h-full w-full object-cover"
        />
        <template v-else>{{ auth.initials }}</template>
      </NuxtLink>

      <NuxtLink
        v-else
        to="/login"
        class="rounded-full bg-purple-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-purple-500 md:px-5 md:py-2"
      >
        Login
      </NuxtLink>
    </nav>

    <!-- Mobile: avatar + hamburger -->
    <div class="flex items-center gap-2 md:hidden">
      <NuxtLink
        v-if="auth.isLoggedIn"
        to="/profil"
        class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white"
        :style="auth.user!.avatar_url ? undefined : { background: auth.user!.avatarColor }"
        aria-label="Profil"
      >
        <img
          v-if="auth.user!.avatar_url"
          :src="auth.user!.avatar_url"
          alt=""
          class="h-full w-full object-cover"
        />
        <template v-else>{{ auth.initials }}</template>
      </NuxtLink>

      <button
        type="button"
        class="relative flex h-10 w-10 items-center justify-center rounded-full text-purple-900 hover:bg-purple-900/5"
        :aria-label="mobileMenuOpen ? 'Inchide meniu' : 'Deschide meniu'"
        :aria-expanded="mobileMenuOpen"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <svg v-if="!mobileMenuOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
        <span
          v-if="auth.isLoggedIn && favorites.count > 0 && !mobileMenuOpen"
          class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-purple-500"
        />
      </button>
    </div>

    <!-- Mobile dropdown panel -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="absolute inset-x-0 top-full mt-1 mx-3 rounded-2xl border border-purple-900/10 bg-white p-4 shadow-lg md:hidden"
      >
        <nav class="flex flex-col gap-1">
          <NuxtLink
            to="/anunturi"
            class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-purple-900 hover:bg-purple-500/10"
            @click="mobileMenuOpen = false"
          >
            Anunturi
            <span aria-hidden="true" class="text-purple-800/40">&rarr;</span>
          </NuxtLink>

          <NuxtLink
            v-if="auth.isSuperAdmin"
            to="/dashboard"
            class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-purple-900 hover:bg-purple-500/10"
            @click="mobileMenuOpen = false"
          >
            Dashboard
            <span aria-hidden="true" class="text-purple-800/40">&rarr;</span>
          </NuxtLink>

          <NuxtLink
            v-if="auth.isLoggedIn"
            to="/favorite"
            class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-purple-900 hover:bg-purple-500/10"
            @click="mobileMenuOpen = false"
          >
            <span class="flex items-center gap-2">
              <span aria-hidden="true">&#10084;</span> Favorite
            </span>
            <span
              v-if="favorites.count > 0"
              class="flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-500 px-1.5 text-[11px] font-semibold text-white"
            >
              {{ favorites.count }}
            </span>
          </NuxtLink>

          <NuxtLink
            v-if="auth.isLoggedIn"
            to="/profil"
            class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-purple-900 hover:bg-purple-500/10"
            @click="mobileMenuOpen = false"
          >
            Profil
            <span aria-hidden="true" class="text-purple-800/40">&rarr;</span>
          </NuxtLink>

          <NuxtLink
            v-else
            to="/login"
            class="mt-1 block rounded-full bg-purple-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-purple-500"
            @click="mobileMenuOpen = false"
          >
            Login
          </NuxtLink>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const favorites = useFavoritesStore()
const route = useRoute()

const mobileMenuOpen = ref(false)

watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
})

const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape") mobileMenuOpen.value = false
}

onMounted(() => {
  if (import.meta.client) window.addEventListener("keydown", onKey)
})
onBeforeUnmount(() => {
  if (import.meta.client) window.removeEventListener("keydown", onKey)
})
</script>
