<template>
  <div class="px-6 py-6 md:px-8 md:py-8">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-purple-900 md:text-4xl">Anunturi</h1>
        <p class="mt-1 text-sm text-purple-800/70">
          {{ listings.length }} proprietati disponibile
        </p>
      </div>

      <div class="flex items-center gap-3">
        <label for="sort" class="text-sm text-purple-800/70">Sorteaza:</label>
        <UiSelect
          v-model="sort"
          :options="sortOptions"
          class="min-w-52"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
      <article
        v-for="listing in paginatedListings"
        :key="listing.id"
        class="group flex flex-col overflow-hidden rounded-2xl border border-purple-900/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
      >
        <div
          class="relative h-52 overflow-hidden"
          :style="{ background: listing.gradient }"
        >
          <div class="absolute inset-0 flex items-center justify-center text-7xl opacity-80">
            {{ listing.icon }}
          </div>
          <UiBadge
            :variant="listing.dealType === 'Vanzare' ? 'green' : 'purple'"
            class="absolute left-3 top-3"
          >
            {{ listing.dealType }}
          </UiBadge>
          <button
            type="button"
            :class="[
              'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white',
              favorites.has(listing.id) ? 'text-red-500' : 'text-purple-900',
            ]"
            :aria-label="favorites.has(listing.id) ? 'Elimina din favorite' : 'Salveaza la favorite'"
            @click="toggleFavorite(listing.id)"
          >
            <span aria-hidden="true">{{ favorites.has(listing.id) ? "❤" : "♡" }}</span>
          </button>
        </div>

        <div class="flex flex-1 flex-col p-5">
          <div class="flex items-start justify-between gap-3">
            <h3 class="text-lg font-semibold text-purple-900 group-hover:text-purple-500 transition-colors">
              {{ listing.title }}
            </h3>
          </div>
          <p class="mt-1 text-sm text-purple-800/70">
            <span aria-hidden="true">&#9678;</span> {{ listing.location }}
          </p>

          <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-purple-800/80">
            <span v-if="listing.rooms" class="inline-flex items-center gap-1">
              <strong class="text-purple-900">{{ listing.rooms }}</strong>
              {{ listing.rooms === 1 ? "camera" : "camere" }}
            </span>
            <span class="inline-flex items-center gap-1">
              <strong class="text-purple-900">{{ listing.surface }}</strong> mp
            </span>
            <span v-if="listing.floor" class="inline-flex items-center gap-1">
              Etaj <strong class="text-purple-900">{{ listing.floor }}</strong>
            </span>
          </div>

          <div class="mt-5 flex items-end justify-between border-t border-purple-900/10 pt-4">
            <div>
              <div class="text-xl font-bold text-purple-900">
                {{ formatPrice(listing.price) }} <span class="text-sm font-normal text-purple-800/70">EUR{{ listing.dealType === "Inchiriere" ? "/luna" : "" }}</span>
              </div>
            </div>
            <UiButton size="sm" rounded="full">Detalii</UiButton>
          </div>
        </div>
      </article>
    </div>

    <div v-if="totalPages > 1" class="mt-10">
      <UiPagination
        v-model:current-page="currentPage"
        :total-pages="totalPages"
        :total-items="listings.length"
        :page-size="pageSize"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth"
import { useFavoritesStore } from "~/stores/favorites"

definePageMeta({
  layout: "estate-layout",
})

const auth = useAuthStore()
const favorites = useFavoritesStore()
const router = useRouter()
const route = useRoute()

const toggleFavorite = (id: number) => {
  if (!auth.isLoggedIn) {
    router.push({ path: "/login", query: { redirect: route.fullPath } })
    return
  }
  favorites.toggle(id)
}

import { useListings } from "~/composables/useListings"

const { listings } = useListings()

type SortKey = "recent" | "price-asc" | "price-desc" | "surface-desc"

const sort = ref<SortKey>("recent")

const sortOptions = [
  { value: "recent", label: "Cele mai recente" },
  { value: "price-asc", label: "Pret crescator" },
  { value: "price-desc", label: "Pret descrescator" },
  { value: "surface-desc", label: "Suprafata mare" },
]

const sortedListings = computed(() => {
  const copy = [...listings]
  switch (sort.value) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price)
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price)
    case "surface-desc":
      return copy.sort((a, b) => b.surface - a.surface)
    default:
      return copy
  }
})

const pageSize = 6
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedListings.value.length / pageSize)),
)

const paginatedListings = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedListings.value.slice(start, start + pageSize)
})

watch(sort, () => {
  currentPage.value = 1
})

watch(currentPage, () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
})

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ro-RO").format(price)
</script>
