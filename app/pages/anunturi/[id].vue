<template>
  <div class="mx-auto max-w-6xl px-6 py-8 md:px-12">
    <NuxtLink
      to="/anunturi"
      class="mb-6 inline-flex items-center gap-2 text-sm text-purple-800/70 hover:text-purple-900"
    >
      <span aria-hidden="true">&larr;</span> Inapoi la anunturi
    </NuxtLink>

    <div v-if="loading" class="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">
      <div class="h-96 animate-pulse rounded-2xl bg-purple-900/10" />
      <div class="space-y-4">
        <div class="h-12 animate-pulse rounded bg-purple-900/10" />
        <div class="h-32 animate-pulse rounded bg-purple-900/10" />
      </div>
    </div>

    <div
      v-else-if="error"
      class="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center"
    >
      <h2 class="text-xl font-semibold text-red-700">Anuntul nu poate fi afisat</h2>
      <p class="mt-2 text-sm text-red-600">{{ error }}</p>
      <UiButton to="/anunturi" class="mt-4" rounded="full">Vezi alte anunturi</UiButton>
    </div>

    <article v-else-if="listing" class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <!-- Galerie -->
        <div
          class="relative aspect-[16/10] overflow-hidden rounded-2xl"
          :style="!listing.images.length ? { background: presetFor(listing.property_type).gradient } : undefined"
        >
          <img
            v-if="listing.images.length"
            :src="activeImage?.url"
            :alt="listing.title"
            class="h-full w-full object-cover"
          />
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center text-9xl opacity-80"
          >
            {{ presetFor(listing.property_type).icon }}
          </div>

          <UiBadge
            :variant="listing.deal_type === 'Vanzare' ? 'green' : 'purple'"
            class="absolute left-4 top-4"
          >
            {{ listing.deal_type }}
          </UiBadge>

          <button
            v-if="listing.images.length > 1"
            type="button"
            class="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-purple-900 shadow hover:bg-white"
            aria-label="Imaginea anterioara"
            @click="prevImage"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            v-if="listing.images.length > 1"
            type="button"
            class="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-purple-900 shadow hover:bg-white"
            aria-label="Imaginea urmatoare"
            @click="nextImage"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <!-- Thumbnails -->
        <div
          v-if="listing.images.length > 1"
          class="mt-3 flex gap-2 overflow-x-auto"
        >
          <button
            v-for="(img, idx) in listing.images"
            :key="img.path"
            type="button"
            :class="[
              'h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
              idx === activeImageIndex
                ? 'border-purple-500'
                : 'border-transparent hover:border-purple-300',
            ]"
            @click="activeImageIndex = idx"
          >
            <img :src="img.url" :alt="`${listing.title} ${idx + 1}`" class="h-full w-full object-cover" />
          </button>
        </div>

        <!-- Titlu + locatie -->
        <div class="mt-6">
          <h1 class="text-3xl font-bold text-purple-900 md:text-4xl">{{ listing.title }}</h1>
          <p class="mt-2 flex items-center gap-1 text-base text-purple-800/70">
            <span aria-hidden="true">&#9678;</span> {{ listing.location }}
          </p>
        </div>

        <!-- Caracteristici -->
        <div class="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-purple-900/10 bg-white p-5 md:grid-cols-4">
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-purple-800/60">Tip</div>
            <div class="mt-1 text-sm font-semibold text-purple-900">{{ listing.property_type }}</div>
          </div>
          <div v-if="listing.rooms">
            <div class="text-xs font-semibold uppercase tracking-wider text-purple-800/60">Camere</div>
            <div class="mt-1 text-sm font-semibold text-purple-900">{{ listing.rooms }}</div>
          </div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-purple-800/60">Suprafata</div>
            <div class="mt-1 text-sm font-semibold text-purple-900">{{ listing.surface }} mp</div>
          </div>
          <div v-if="listing.floor">
            <div class="text-xs font-semibold uppercase tracking-wider text-purple-800/60">Etaj</div>
            <div class="mt-1 text-sm font-semibold text-purple-900">{{ listing.floor }}</div>
          </div>
        </div>

        <!-- Descriere -->
        <section v-if="listing.description" class="mt-8">
          <h2 class="text-xl font-semibold text-purple-900">Descriere</h2>
          <p class="mt-3 whitespace-pre-line text-base leading-relaxed text-purple-800/85">
            {{ listing.description }}
          </p>
        </section>

        <!-- Locatie -->
        <section class="mt-8">
          <h2 class="text-xl font-semibold text-purple-900">Locatie</h2>
          <p class="mt-1 text-sm text-purple-800/70">{{ listing.location }}</p>
          <a
            :href="googleMapsUrl"
            target="_blank"
            rel="noopener"
            class="mt-3 inline-flex items-center gap-2 rounded-full bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Deschide in Google Maps
            <span aria-hidden="true">&rarr;</span>
          </a>
        </section>
      </div>

      <!-- Aside: pret + agent + actiuni -->
      <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <UiCard padding="lg">
          <div class="text-sm text-purple-800/70">Pret</div>
          <div class="mt-1 text-3xl font-bold text-purple-900">
            {{ formatPrice(listing.price) }}
            <span class="text-base font-normal text-purple-800/70">
              EUR{{ listing.deal_type === "Inchiriere" ? "/luna" : "" }}
            </span>
          </div>

          <UiButton
            block
            class="mt-5"
            :variant="favorites.has(listing.id) ? 'danger' : 'primary'"
            @click="toggleFavorite"
          >
            <template #iconLeft>
              <span aria-hidden="true">{{ favorites.has(listing.id) ? "❤" : "♡" }}</span>
            </template>
            {{ favorites.has(listing.id) ? "Elimina din favorite" : "Salveaza la favorite" }}
          </UiButton>
        </UiCard>

        <UiCard v-if="listing.owner" padding="lg">
          <div class="text-xs font-semibold uppercase tracking-wider text-purple-800/60">Agent</div>
          <div class="mt-3 flex items-center gap-3">
            <div
              class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full text-base font-semibold text-white"
              :style="listing.owner.avatar_url ? undefined : { background: '#6366F1' }"
            >
              <img
                v-if="listing.owner.avatar_url"
                :src="listing.owner.avatar_url"
                alt=""
                class="h-full w-full object-cover"
              />
              <template v-else>{{ ownerInitials }}</template>
            </div>
            <div class="min-w-0">
              <div class="truncate text-base font-semibold text-purple-900">
                {{ listing.owner.name }}
              </div>
              <p class="text-xs text-purple-800/60">Agent imobiliar</p>
            </div>
          </div>

          <div class="mt-4 flex flex-col gap-2">
            <a
              v-if="listing.owner.phone"
              :href="`tel:${listing.owner.phone}`"
              class="flex items-center gap-2 rounded-lg border border-purple-900/10 bg-grey-10 px-3 py-2.5 text-sm font-medium text-purple-900 transition-colors hover:border-purple-500"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-purple-500">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
              {{ listing.owner.phone }}
            </a>
            <a
              v-if="listing.owner.email"
              :href="`mailto:${listing.owner.email}`"
              class="flex items-center gap-2 rounded-lg border border-purple-900/10 bg-grey-10 px-3 py-2.5 text-sm font-medium text-purple-900 transition-colors hover:border-purple-500"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-purple-500">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span class="truncate">{{ listing.owner.email }}</span>
            </a>
          </div>
        </UiCard>
      </aside>
    </article>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: "default",
})

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const favorites = useFavoritesStore()
const { fetchOne } = useListings()

const listing = ref<Listing | null>(null)
const loading = ref(true)
const error = ref("")
const activeImageIndex = ref(0)

const activeImage = computed(() => listing.value?.images[activeImageIndex.value] ?? null)

const ownerInitials = computed(() => {
  if (!listing.value?.owner?.name) return ""
  return listing.value.owner.name
    .split(" ")
    .map((p: string) => p.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("")
})

const googleMapsUrl = computed(() => {
  const q = encodeURIComponent(listing.value?.location ?? "")
  return `https://www.google.com/maps/search/?api=1&query=${q}`
})

const load = async () => {
  loading.value = true
  error.value = ""
  try {
    const id = Number(route.params.id)
    if (!id) throw new Error("ID invalid")
    const res = await fetchOne(id)
    listing.value = res.data
  } catch (e) {
    const err = e as { data?: { message?: string }; status?: number }
    error.value = err?.data?.message || "Anuntul nu a fost gasit."
  } finally {
    loading.value = false
  }
}

const nextImage = () => {
  if (!listing.value) return
  activeImageIndex.value = (activeImageIndex.value + 1) % listing.value.images.length
}

const prevImage = () => {
  if (!listing.value) return
  const count = listing.value.images.length
  activeImageIndex.value = (activeImageIndex.value - 1 + count) % count
}

const toggleFavorite = async () => {
  if (!auth.isLoggedIn) {
    router.push({ path: "/login", query: { redirect: route.fullPath } })
    return
  }
  if (!listing.value) return
  await favorites.toggle(listing.value.id)
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ro-RO").format(price)

watch(() => route.params.id, load, { immediate: true })
</script>
