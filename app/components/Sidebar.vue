<template>
  <!-- Mobile overlay -->
  <div
    v-if="store.mobileOpen"
    class="fixed inset-0 z-30 bg-purple-900/50 backdrop-blur-sm md:hidden"
    @click="store.closeMobile()"
  />

  <aside
    :class="[
      'flex flex-col gap-6 bg-grey-10 p-6 shadow-md',
      // Mobile: drawer fixed sub header (z-40), overlay-ul are z-30, header z-50
      'max-md:fixed max-md:left-0 max-md:top-[5.5rem] max-md:bottom-0 max-md:z-40',
      'max-md:w-[85vw] max-md:max-w-sm max-md:overflow-y-auto',
      'max-md:transition-transform max-md:duration-300',
      store.mobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full',
      // Desktop: stretch automat in flex row, plus min-h-full ca asigurare
      'md:w-90 md:min-h-full xl:w-90 2xl:w-110',
    ]"
  >
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-purple-900">Filtre</h2>
        <p class="mt-1 text-xs text-purple-800/60">Rafineaza cautarea</p>
      </div>
      <button
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-full text-purple-900 hover:bg-purple-900/5 md:hidden"
        aria-label="Inchide filtrele"
        @click="store.closeMobile()"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>

    <UiInput
      v-model="filters.location"
      label="Locatie"
      placeholder="Oras, cartier..."
    />

    <div class="flex flex-col gap-2">
      <label class="text-xs font-semibold uppercase tracking-wider text-purple-900">
        Tip tranzactie
      </label>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="opt in dealTypes"
          :key="opt"
          type="button"
          :class="togglePillClass(filters.dealType === opt)"
          @click="filters.dealType = filters.dealType === opt ? null : opt"
        >
          {{ opt }}
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-xs font-semibold uppercase tracking-wider text-purple-900">
        Tip proprietate
      </label>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="opt in propertyTypes"
          :key="opt"
          type="button"
          :class="togglePillClass(filters.propertyType === opt)"
          @click="filters.propertyType = filters.propertyType === opt ? null : opt"
        >
          {{ opt }}
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-xs font-semibold uppercase tracking-wider text-purple-900">
        Camere
      </label>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="opt in roomOptions"
          :key="opt"
          type="button"
          :class="togglePillClass(filters.rooms === opt)"
          @click="filters.rooms = filters.rooms === opt ? null : opt"
        >
          {{ opt }}
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-xs font-semibold uppercase tracking-wider text-purple-900">
        Pret (EUR)
      </label>
      <div class="grid grid-cols-2 gap-2">
        <UiInput v-model="filters.priceMin" type="number" placeholder="Min" />
        <UiInput v-model="filters.priceMax" type="number" placeholder="Max" />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-xs font-semibold uppercase tracking-wider text-purple-900">
        Suprafata (mp)
      </label>
      <div class="grid grid-cols-2 gap-2">
        <UiInput v-model="filters.surfaceMin" type="number" placeholder="Min" />
        <UiInput v-model="filters.surfaceMax" type="number" placeholder="Max" />
      </div>
    </div>

    <div class="mt-2 flex flex-col gap-2">
      <UiButton block @click="apply">Aplica filtrele</UiButton>
      <UiButton variant="secondary" block @click="reset">Reseteaza</UiButton>
    </div>
  </aside>
</template>

<script setup lang="ts">

type DealType = "Vanzare" | "Inchiriere"
type PropertyType = "Apartament" | "Casa" | "Teren" | "Comercial"
type RoomOption = "1" | "2" | "3" | "4+"

const store = useListingFiltersStore()

const dealTypes: DealType[] = ["Vanzare", "Inchiriere"]
const propertyTypes: PropertyType[] = ["Apartament", "Casa", "Teren", "Comercial"]
const roomOptions: RoomOption[] = ["1", "2", "3", "4+"]

const defaultFilters = (): SidebarFilters => ({
  location: "",
  dealType: null,
  propertyType: null,
  rooms: null,
  priceMin: null,
  priceMax: null,
  surfaceMin: null,
  surfaceMax: null,
})

const filters = reactive<SidebarFilters>({ ...store.filters })

const togglePillClass = (active: boolean) => [
  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
  active
    ? "border-purple-500 bg-purple-500 text-white"
    : "border-purple-900/15 bg-white text-purple-900 hover:border-purple-500",
]

const apply = () => store.apply({ ...filters })
const reset = () => {
  Object.assign(filters, defaultFilters())
  store.reset()
}

// Blochez scroll-ul body cand drawer-ul e deschis pe mobile
watchEffect(() => {
  if (!import.meta.client) return
  if (store.mobileOpen) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = ""
  }
})
</script>
