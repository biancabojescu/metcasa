<template>
  <div class="px-6 py-8 md:px-12">
    <header class="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-purple-900 md:text-4xl">Favoritele mele</h1>
        <p class="mt-1 text-sm text-purple-800/70">
          {{ total }} {{ total === 1 ? "anunt activ" : "anunturi active" }}
          <span v-if="inactiveCount > 0" class="ml-2 text-xs text-amber-700">
            ({{ inactiveCount }} {{ inactiveCount === 1 ? "anunt nu mai e disponibil" : "anunturi nu mai sunt disponibile" }})
          </span>
        </p>
      </div>

      <UiButton
        v-if="favorites.count > 0"
        variant="danger"
        rounded="full"
        :loading="clearing"
        @click="clearAll"
      >
        Sterge toate favoritele
      </UiButton>
    </header>

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
      <div class="text-6xl">💜</div>
      <h2 class="mt-4 text-xl font-semibold text-purple-900">Nu ai favorite active</h2>
      <p class="mt-2 max-w-md text-sm text-purple-800/70">
        Salveaza anunturile care te intereseaza apasand pe inima de pe fiecare card.
      </p>
      <UiButton to="/anunturi" rounded="full" size="lg" class="mt-6">
        Exploreaza anunturile
        <template #iconRight><span aria-hidden="true">&rarr;</span></template>
      </UiButton>
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
              aria-label="Elimina din favorite"
              class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow transition-colors hover:bg-red-50"
              @click.prevent="onRemove(listing.id)"
            >
              <span aria-hidden="true">&#10084;</span>
            </button>
          </div>
        </NuxtLink>

        <div class="flex flex-1 flex-col p-5">
          <NuxtLink :to="`/anunturi/${listing.id}`" class="hover:text-purple-500">
            <h3 class="text-lg font-semibold text-purple-900">{{ listing.title }}</h3>
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
            <div class="text-xl font-bold text-purple-900">
              {{ formatPrice(listing.price) }}
              <span class="text-sm font-normal text-purple-800/70">
                EUR{{ listing.deal_type === "Inchiriere" ? "/luna" : "" }}
              </span>
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
  layout: "default",
  middleware: "auth",
})

const favorites = useFavoritesStore()

const listings = ref<Listing[]>([])
const total = ref(0)
const totalPages = ref(1)
const loading = ref(false)
const clearing = ref(false)
const pageSize = 6
const currentPage = ref(1)

const inactiveCount = computed(() =>
  Math.max(0, favorites.count - total.value),
)

const load = async () => {
  loading.value = true
  try {
    const res = await favorites.fetchPage(currentPage.value, pageSize)
    listings.value = res.data
    total.value = res.meta.total
    totalPages.value = res.meta.last_page
  } catch {
    listings.value = []
  } finally {
    loading.value = false
  }
}

const onRemove = async (id: number) => {
  await favorites.remove(id)
  // Daca era ultimul de pe pagina, intoarce-te o pagina
  if (listings.value.length === 1 && currentPage.value > 1) {
    currentPage.value -= 1
  } else {
    await load()
  }
}

const clearAll = async () => {
  if (!confirm("Sigur vrei sa stergi toate favoritele?")) return
  clearing.value = true
  try {
    await favorites.clear()
    currentPage.value = 1
    await load()
  } finally {
    clearing.value = false
  }
}

watch(currentPage, () => {
  load()
  if (import.meta.client) window.scrollTo({ top: 0, behavior: "smooth" })
})

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ro-RO").format(price)

onMounted(load)
</script>
