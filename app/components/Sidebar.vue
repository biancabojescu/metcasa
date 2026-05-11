<template>
  <aside
    class="max-md:hidden flex flex-col gap-6 bg-purple-900/2 py-6 pr-6 pl-6 min-h-[calc(100vh-5.5rem)] shadow-md md:w-90 xl:w-90 2xl:w-110 overflow-y-auto"
  >
    <div>
      <h2 class="text-xl font-semibold text-purple-900">Filtre</h2>
      <p class="mt-1 text-xs text-purple-800/60">Rafineaza cautarea</p>
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
      <UiButton block @click="$emit('apply', filters)">Aplica filtrele</UiButton>
      <UiButton variant="secondary" block @click="reset">Reseteaza</UiButton>
    </div>
  </aside>
</template>

<script setup lang="ts">
type DealType = "Vanzare" | "Inchiriere"
type PropertyType = "Apartament" | "Casa" | "Teren" | "Comercial"
type RoomOption = "1" | "2" | "3" | "4+"

interface Filters {
  location: string
  dealType: DealType | null
  propertyType: PropertyType | null
  rooms: RoomOption | null
  priceMin: number | null
  priceMax: number | null
  surfaceMin: number | null
  surfaceMax: number | null
}

defineEmits<{ apply: [filters: Filters] }>()

const dealTypes: DealType[] = ["Vanzare", "Inchiriere"]
const propertyTypes: PropertyType[] = ["Apartament", "Casa", "Teren", "Comercial"]
const roomOptions: RoomOption[] = ["1", "2", "3", "4+"]

const defaultFilters = (): Filters => ({
  location: "",
  dealType: null,
  propertyType: null,
  rooms: null,
  priceMin: null,
  priceMax: null,
  surfaceMin: null,
  surfaceMax: null,
})

const filters = reactive<Filters>(defaultFilters())

const togglePillClass = (active: boolean) => [
  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
  active
    ? "border-purple-500 bg-purple-500 text-white"
    : "border-purple-900/15 bg-white text-purple-900 hover:border-purple-500",
]

const reset = () => Object.assign(filters, defaultFilters())
</script>
