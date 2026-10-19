<template>
  <div class="px-6 py-6 md:px-8 md:py-8">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-purple-900 md:text-4xl">Anunturi</h1>
        <p class="mt-1 text-sm text-purple-800/70">
          {{ total }} {{ total === 1 ? "proprietate" : "proprietati" }} disponibile
        </p>
      </div>

      <div class="flex items-center gap-3">
        <UiButton
          variant="secondary"
          size="md"
          class="md:hidden"
          @click="filtersStore.openMobile()"
        >
          <template #iconLeft>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="7" x2="17" y1="12" y2="12" />
              <line x1="10" x2="14" y1="18" y2="18" />
            </svg>
          </template>
          Filtre
        </UiButton>

        <label for="sort" class="text-sm text-purple-800/70 sr-only md:not-sr-only">Sorteaza:</label>
        <UiSelect
          v-model="sort"
          :options="sortOptions"
          class="min-w-44 md:min-w-52"
        />
      </div>
    </div>

    <p v-if="error" class="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ error }}
    </p>

    <div
      v-if="loading"
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3"
    >
      <ListingCardSkeleton v-for="n in pageSize" :key="`skel-${n}`" />
    </div>

    <div
      v-else-if="listings.length === 0"
      class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-purple-900/15 bg-white py-20 text-center"
    >
      <div class="text-5xl">🔎</div>
      <h2 class="mt-3 text-lg font-semibold text-purple-900">Nu am gasit anunturi</h2>
      <p class="mt-1 text-sm text-purple-800/70">Modifica filtrele si incearca din nou.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
      <article
        v-for="listing in listings"
        :key="listing.id"
        class="group flex flex-col overflow-hidden rounded-2xl border border-purple-900/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
      >
        <NuxtLink :to="`/anunturi/${listing.id}`" class="block">
          <div
            class="relative h-52 overflow-hidden"
            :style="!listing.images.length ? { background: presetFor(listing.property_type).gradient } : undefined"
          >
            <img
              v-if="listing.images.length"
              :src="listing.images[0]?.url"
              :alt="listing.title"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="absolute inset-0 flex items-center justify-center text-7xl opacity-80"
            >
              {{ presetFor(listing.property_type).icon }}
            </div>

            <UiBadge
              :variant="listing.deal_type === 'Vanzare' ? 'green' : 'purple'"
              class="absolute left-3 top-3"
            >
              {{ listing.deal_type }}
            </UiBadge>
            <button
              type="button"
              :class="[
                'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white',
                favorites.has(listing.id) ? 'text-red-500' : 'text-purple-900',
              ]"
              :aria-label="favorites.has(listing.id) ? 'Elimina din favorite' : 'Salveaza la favorite'"
              @click.prevent="toggleFavorite(listing.id)"
            >
              <span aria-hidden="true">{{ favorites.has(listing.id) ? "❤" : "♡" }}</span>
            </button>
          </div>
        </NuxtLink>

        <div class="flex flex-1 flex-col p-5">
          <NuxtLink :to="`/anunturi/${listing.id}`" class="hover:text-purple-500">
            <h3 class="text-lg font-semibold text-purple-900 group-hover:text-purple-500 transition-colors">
              {{ listing.title }}
            </h3>
          </NuxtLink>
          <p class="mt-1 text-sm text-purple-800/70">
            <span aria-hidden="true">&#9678;</span> {{ listing.location }}
          </p>

          <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-purple-800/80">
            <span v-if="listing.rooms">
              <strong class="text-purple-900">{{ listing.rooms }}</strong>
              {{ listing.rooms === 1 ? "camera" : "camere" }}
            </span>
            <span>
              <strong class="text-purple-900">{{ listing.surface }}</strong> mp
            </span>
            <span v-if="listing.floor">
              Etaj <strong class="text-purple-900">{{ listing.floor }}</strong>
            </span>
          </div>

          <div class="mt-5 flex items-end justify-between border-t border-purple-900/10 pt-4">
            <div>
              <div class="text-xl font-bold text-purple-900">
                {{ formatPrice(listing.price) }}
                <span class="text-sm font-normal text-purple-800/70">
                  EUR{{ listing.deal_type === "Inchiriere" ? "/luna" : "" }}
                </span>
              </div>
            </div>
            <UiButton :to="`/anunturi/${listing.id}`" size="sm" rounded="full">Detalii</UiButton>
          </div>
        </div>
      </article>
    </div>

    <div v-if="totalPages > 1" class="mt-10">
      <UiPagination
        v-model:current-page="currentPage"
        :total-pages="totalPages"
        :total-items="total"
        :page-size="pageSize"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "estate-layout",
})

const auth = useAuthStore()
const favorites = useFavoritesStore()
const filtersStore = useListingFiltersStore()
const router = useRouter()
const route = useRoute()

const { fetchList } = useListings()

const listings = ref<Listing[]>([])
const total = ref(0)
const totalPages = ref(1)
const loading = ref(false)
const error = ref("")

const pageSize = 6
const currentPage = ref(1)
const sort = ref<ListingFilters["sort"]>("recent")

const sortOptions = [
  { value: "recent", label: "Cele mai recente" },
  { value: "price_asc", label: "Pret crescator" },
  { value: "price_desc", label: "Pret descrescator" },
  { value: "surface_desc", label: "Suprafata mare" },
]

const load = async () => {
  loading.value = true
  error.value = ""
  try {
    const res = await fetchList({
      ...filtersStore.asApiQuery,
      sort: sort.value,
      page: currentPage.value,
      per_page: pageSize,
    })
    listings.value = res.data
    total.value = res.meta.total
    totalPages.value = res.meta.last_page
  } catch (e) {
    const err = e as { data?: { message?: string } }
    error.value = err?.data?.message || "Nu am putut incarca anunturile."
  } finally {
    loading.value = false
  }
}

const toggleFavorite = async (id: number) => {
  if (!auth.isLoggedIn) {
    router.push({ path: "/login", query: { redirect: route.fullPath } })
    return
  }
  await favorites.toggle(id)
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ro-RO").format(price)

// ---- Sincronizare cu URL-ul ----
// Sursa de adevar e store-ul de filtre + sort/page locale.
// Flag-ul `isSyncing` previne bucla infinita state→URL→state.
let isSyncing = false

const buildQuery = (): Record<string, string> => {
  const q = filtersStore.toQuery()
  if (sort.value && sort.value !== "recent") q.sort = sort.value
  if (currentPage.value > 1) q.page = String(currentPage.value)
  return q
}

const pushQuery = () => {
  if (isSyncing) return
  const newQ = buildQuery()
  // Diff vs route curent ca sa nu pusham duplicate
  const cur = route.query as Record<string, string>
  const sameKeys = Object.keys(newQ).length === Object.keys(cur).length
  const sameValues = sameKeys && Object.keys(newQ).every((k) => cur[k] === newQ[k])
  if (sameValues) return
  isSyncing = true
  router.push({ query: newQ }).finally(() => {
    isSyncing = false
  })
}

const readFromQuery = () => {
  isSyncing = true
  filtersStore.setFromQuery(route.query as Record<string, string>)
  sort.value = (route.query.sort as ListingFilters["sort"]) || "recent"
  currentPage.value = route.query.page ? Number(route.query.page) : 1
  // Eliberam flag-ul dupa un tick ca watch-ul state→URL sa nu rasara
  nextTick(() => {
    isSyncing = false
  })
}

// State→URL: cand userul schimba sort/pagina
watch([sort, currentPage], () => {
  pushQuery()
  load()
  if (import.meta.client) window.scrollTo({ top: 0, behavior: "smooth" })
})

// State→URL: cand userul aplica filtrele din Sidebar
watch(() => filtersStore.appliedAt, () => {
  currentPage.value = 1
  pushQuery()
  load()
})

// URL→State: cand userul da back/forward in browser
watch(() => route.query, () => {
  if (isSyncing) return
  readFromQuery()
  load()
})

onMounted(() => {
  readFromQuery()
  load()
})
</script>
