<template>
  <div class="px-6 py-8 md:px-12">
    <header class="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-purple-900 md:text-4xl">Favoritele mele</h1>
        <p class="mt-1 text-sm text-purple-800/70">
          {{ favoriteListings.length }} {{ favoriteListings.length === 1 ? "anunt salvat" : "anunturi salvate" }}
        </p>
      </div>

      <UiButton
        v-if="favoriteListings.length > 0"
        variant="danger"
        rounded="full"
        @click="clearAll"
      >
        Sterge toate favoritele
      </UiButton>
    </header>

    <div v-if="favoriteListings.length === 0" class="flex flex-col items-center justify-center rounded-3xl border border-dashed border-purple-900/15 bg-white py-20 text-center">
      <div class="text-6xl">💜</div>
      <h2 class="mt-4 text-xl font-semibold text-purple-900">Nu ai favorite inca</h2>
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
        v-for="listing in favoriteListings"
        :key="listing.id"
        class="group flex flex-col overflow-hidden rounded-2xl border border-purple-900/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
      >
        <div class="relative h-52 overflow-hidden" :style="{ background: listing.gradient }">
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
            aria-label="Elimina din favorite"
            class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow transition-colors hover:bg-red-50"
            @click="favorites.remove(listing.id)"
          >
            <span aria-hidden="true">&#10084;</span>
          </button>
        </div>

        <div class="flex flex-1 flex-col p-5">
          <h3 class="text-lg font-semibold text-purple-900">{{ listing.title }}</h3>
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
                EUR{{ listing.dealType === "Inchiriere" ? "/luna" : "" }}
              </span>
            </div>
            <UiButton size="sm" rounded="full">Detalii</UiButton>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFavoritesStore } from "~/stores/favorites"
import { useListings } from "~/composables/useListings"

definePageMeta({
  layout: "default",
  middleware: "auth",
})

const favorites = useFavoritesStore()
const { listings } = useListings()

const favoriteListings = computed(() =>
  listings.filter((l) => favorites.has(l.id)),
)

const clearAll = () => {
  if (!confirm("Sigur vrei sa stergi toate favoritele?")) return
  favorites.clear()
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ro-RO").format(price)
</script>
