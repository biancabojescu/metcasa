<template>
  <div class="px-6 gap-4 flex flex-col py-8 md:px-12">
    <header class="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-purple-900 md:text-4xl">Dashboard</h1>
        <p class="mt-1 text-sm text-purple-800/70">
          Gestioneaza anunturile platformei metCasa
        </p>
      </div>
      <UiButton rounded="full" size="lg" @click="openCreateForm">
        <template #iconLeft><span aria-hidden="true">+</span></template>
        Adauga anunt nou
      </UiButton>
    </header>

    <!-- Stats -->
    <section class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      <UiCard padding="sm" class="p-5">
        <div class="text-xs font-semibold uppercase tracking-wider text-purple-800/60">
          Total anunturi
        </div>
        <div class="mt-2 text-3xl font-bold text-purple-900">{{ stats.total }}</div>
      </UiCard>
      <UiCard padding="sm" class="p-5">
        <div class="text-xs font-semibold uppercase tracking-wider text-purple-800/60">
          De vanzare
        </div>
        <div class="mt-2 text-3xl font-bold text-green-600">{{ stats.sales }}</div>
      </UiCard>
      <UiCard padding="sm" class="p-5">
        <div class="text-xs font-semibold uppercase tracking-wider text-purple-800/60">
          De inchiriere
        </div>
        <div class="mt-2 text-3xl font-bold text-purple-500">{{ stats.rentals }}</div>
      </UiCard>
      <UiCard padding="sm" class="p-5">
        <div class="text-xs font-semibold uppercase tracking-wider text-purple-800/60">
          Valoare totala
        </div>
        <div class="mt-2 text-3xl font-bold text-purple-900">
          {{ formatPrice(stats.totalValue) }}
          <span class="text-base font-normal text-purple-800/60">EUR</span>
        </div>
      </UiCard>
    </section>

    <!-- Layout: form + list -->
    <div class="grid grid-cols-1 gap-8 xl:grid-cols-[420px_1fr]">
      <!-- Form -->
      <UiCard v-if="showForm" tag="section">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-purple-900">
            {{ editingId !== null ? "Editeaza anunt" : "Adauga anunt" }}
          </h2>
          <button
            type="button"
            class="text-sm text-purple-800/60 hover:text-purple-900"
            @click="closeForm"
          >
            Inchide
          </button>
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="submit">
          <UiInput
            v-model="form.title"
            label="Titlu"
            required
            placeholder="Apartament 3 camere, decomandat"
          />

          <UiInput
            v-model="form.location"
            label="Locatie"
            required
            placeholder="Bucuresti, Aviatiei"
          />

          <div class="grid grid-cols-2 gap-3">
            <UiSelect
              v-model="form.dealType"
              label="Tip tranzactie"
              :options="DEAL_TYPE_OPTIONS"
            />
            <UiSelect
              v-model="form.propertyType"
              label="Tip proprietate"
              :options="PROPERTY_TYPE_OPTIONS"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <UiInput
              v-model="form.rooms"
              label="Camere"
              type="number"
              :min="0"
              :disabled="hasNoRooms"
              placeholder="3"
            />
            <UiInput
              v-model="form.surface"
              label="Suprafata (mp)"
              type="number"
              :min="1"
              required
              placeholder="78"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <UiInput
              v-model="form.floor"
              label="Etaj (optional)"
              placeholder="4/8"
            />
            <UiInput
              v-model="form.price"
              :label="`Pret (EUR${form.dealType === 'Inchiriere' ? '/luna' : ''})`"
              type="number"
              :min="0"
              required
              placeholder="145000"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-purple-900">
              Imagini
            </label>
            <label
              :class="[
                'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors cursor-pointer',
                isDragging
                  ? 'border-purple-500 bg-purple-500/5'
                  : 'border-purple-900/15 bg-grey-10 hover:border-purple-500 hover:bg-purple-500/5',
              ]"
              @dragover.prevent="isDragging = true"
              @dragenter.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
            >
              <input
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="onFileInput"
              />
              <span class="text-2xl" aria-hidden="true">📷</span>
              <span class="text-sm font-medium text-purple-900">
                Trage imaginile aici sau apasa pentru a selecta
              </span>
              <span class="text-xs text-purple-800/60">
                JPG, PNG sau WebP &middot; max 5MB / imagine
              </span>
            </label>

            <p v-if="uploadError" class="text-xs text-red-600">{{ uploadError }}</p>

            <div v-if="form.images.length > 0" class="mt-2 grid grid-cols-3 gap-2">
              <div
                v-for="(img, idx) in form.images"
                :key="idx"
                class="group relative aspect-square overflow-hidden rounded-lg border border-purple-900/10"
              >
                <img :src="img" alt="" class="h-full w-full object-cover" />
                <span
                  v-if="idx === 0"
                  class="absolute bottom-1 left-1 rounded-full bg-purple-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                >
                  Principala
                </span>
                <button
                  type="button"
                  aria-label="Sterge imaginea"
                  class="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-xs font-bold text-red-600 opacity-0 shadow transition-opacity group-hover:opacity-100"
                  @click="removeImage(idx)"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2 pt-2">
            <UiButton type="submit" block size="lg">
              {{ editingId !== null ? "Salveaza modificarile" : "Publica anuntul" }}
            </UiButton>
            <UiButton
              v-if="editingId !== null"
              variant="secondary"
              block
              @click="closeForm"
            >
              Anuleaza
            </UiButton>
          </div>
        </form>
      </UiCard>

      <!-- List -->
      <section
        :class="[
          'rounded-2xl border border-purple-900/10 bg-white shadow-sm',
          showForm ? '' : 'xl:col-span-2',
        ]"
      >
        <div class="flex items-center justify-between border-b border-purple-900/10 px-6 py-4">
          <h2 class="text-xl font-semibold text-purple-900">Anunturi existente</h2>
          <span class="text-sm text-purple-800/60">{{ listings.length }} total</span>
        </div>

        <div v-if="listings.length === 0" class="px-6 py-16 text-center">
          <p class="text-sm text-purple-800/60">Nu exista anunturi inca.</p>
          <UiButton variant="ghost" size="sm" class="mt-3" @click="openCreateForm">
            Adauga primul anunt
          </UiButton>
        </div>

        <div v-else class="divide-y divide-purple-900/10">
          <article
            v-for="listing in listings"
            :key="listing.id"
            class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center"
          >
            <div
              class="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl text-3xl"
              :style="listing.images.length === 0 ? { background: listing.gradient } : undefined"
            >
              <img
                v-if="listing.images.length > 0"
                :src="listing.images[0]"
                :alt="listing.title"
                class="h-full w-full object-cover"
              />
              <template v-else>{{ listing.icon }}</template>
              <span
                v-if="listing.images.length > 1"
                class="absolute bottom-0.5 right-0.5 rounded-full bg-purple-900/80 px-1.5 py-0.5 text-[9px] font-semibold text-white"
              >
                +{{ listing.images.length - 1 }}
              </span>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="truncate text-base font-semibold text-purple-900">
                  {{ listing.title }}
                </h3>
                <UiBadge
                  size="sm"
                  :variant="listing.dealType === 'Vanzare' ? 'soft-green' : 'soft-purple'"
                  class="shrink-0"
                >
                  {{ listing.dealType }}
                </UiBadge>
              </div>
              <p class="mt-0.5 text-sm text-purple-800/70">{{ listing.location }}</p>
              <div class="mt-1 flex flex-wrap gap-x-3 text-xs text-purple-800/60">
                <span v-if="listing.rooms">{{ listing.rooms }} {{ listing.rooms === 1 ? "camera" : "camere" }}</span>
                <span>{{ listing.surface }} mp</span>
                <span v-if="listing.floor">Etaj {{ listing.floor }}</span>
              </div>
            </div>

            <div class="flex items-center gap-6 md:gap-8">
              <div class="text-right">
                <div class="text-lg font-bold text-purple-900">
                  {{ formatPrice(listing.price) }}
                </div>
                <div class="text-xs text-purple-800/60">
                  EUR{{ listing.dealType === "Inchiriere" ? "/luna" : "" }}
                </div>
              </div>

              <div class="flex items-center gap-2">
                <UiButton variant="secondary" size="sm" @click="edit(listing)">
                  Editeaza
                </UiButton>
                <UiButton variant="danger" size="sm" @click="remove(listing.id)">
                  Sterge
                </UiButton>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
})

type DealType = "Vanzare" | "Inchiriere"
type PropertyType = "Apartament" | "Casa" | "Teren" | "Comercial"

interface Listing {
  id: number
  title: string
  location: string
  price: number
  dealType: DealType
  propertyType: PropertyType
  rooms: number | null
  surface: number
  floor: string | null
  icon: string
  gradient: string
  images: string[]
}

interface ListingForm {
  title: string
  location: string
  dealType: DealType
  propertyType: PropertyType
  rooms: number | null
  surface: number | null
  floor: string
  price: number | null
  images: string[]
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const DEAL_TYPE_OPTIONS: { value: DealType; label: string }[] = [
  { value: "Vanzare", label: "Vanzare" },
  { value: "Inchiriere", label: "Inchiriere" },
]

const PROPERTY_TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "Apartament", label: "Apartament" },
  { value: "Casa", label: "Casa" },
  { value: "Teren", label: "Teren" },
  { value: "Comercial", label: "Comercial" },
]

const PROPERTY_PRESETS: Record<PropertyType, { icon: string; gradient: string }> = {
  Apartament: { icon: "🏢", gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)" },
  Casa: { icon: "🏡", gradient: "linear-gradient(135deg, #00dc82 0%, #007f45 100%)" },
  Teren: { icon: "🌳", gradient: "linear-gradient(135deg, #75edae 0%, #016538 100%)" },
  Comercial: { icon: "🏬", gradient: "linear-gradient(135deg, #1F2937 0%, #6366F1 100%)" },
}

const listings = ref<Listing[]>([
  {
    id: 1,
    title: "Apartament 3 camere, decomandat",
    location: "Bucuresti, Aviatiei",
    price: 145000,
    dealType: "Vanzare",
    propertyType: "Apartament",
    rooms: 3,
    surface: 78,
    floor: "4/8",
    icon: "🏢",
    gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    images: [],
  },
  {
    id: 2,
    title: "Casa cu gradina, 4 camere",
    location: "Bucuresti, Pipera",
    price: 320000,
    dealType: "Vanzare",
    propertyType: "Casa",
    rooms: 4,
    surface: 180,
    floor: null,
    icon: "🏡",
    gradient: "linear-gradient(135deg, #00dc82 0%, #007f45 100%)",
    images: [],
  },
  {
    id: 3,
    title: "Garsoniera moderna, complet mobilata",
    location: "Bucuresti, Universitate",
    price: 450,
    dealType: "Inchiriere",
    propertyType: "Apartament",
    rooms: 1,
    surface: 36,
    floor: "2/5",
    icon: "🏢",
    gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    images: [],
  },
])

const defaultForm = (): ListingForm => ({
  title: "",
  location: "",
  dealType: "Vanzare",
  propertyType: "Apartament",
  rooms: null,
  surface: null,
  floor: "",
  price: null,
  images: [],
})

const showForm = ref(true)
const editingId = ref<number | null>(null)
const isDragging = ref(false)
const uploadError = ref("")
const form = reactive<ListingForm>(defaultForm())

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

const addFiles = async (files: FileList | File[]) => {
  uploadError.value = ""
  const incoming = Array.from(files)
  const valid: File[] = []

  for (const file of incoming) {
    if (!file.type.startsWith("image/")) {
      uploadError.value = `${file.name} nu este o imagine valida.`
      continue
    }
    if (file.size > MAX_IMAGE_SIZE) {
      uploadError.value = `${file.name} depaseste 5MB.`
      continue
    }
    valid.push(file)
  }

  const dataUrls = await Promise.all(valid.map(readFileAsDataUrl))
  form.images.push(...dataUrls)
}

const onFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) addFiles(target.files)
  target.value = ""
}

const onDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) addFiles(event.dataTransfer.files)
}

const removeImage = (idx: number) => {
  form.images.splice(idx, 1)
}

const hasNoRooms = computed(
  () => form.propertyType === "Teren" || form.propertyType === "Comercial",
)

watch(hasNoRooms, (noRooms) => {
  if (noRooms) form.rooms = null
})

const stats = computed(() => ({
  total: listings.value.length,
  sales: listings.value.filter((l) => l.dealType === "Vanzare").length,
  rentals: listings.value.filter((l) => l.dealType === "Inchiriere").length,
  totalValue: listings.value
    .filter((l) => l.dealType === "Vanzare")
    .reduce((sum, l) => sum + l.price, 0),
}))

const openCreateForm = () => {
  editingId.value = null
  uploadError.value = ""
  Object.assign(form, defaultForm())
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingId.value = null
  uploadError.value = ""
  Object.assign(form, defaultForm())
}

const edit = (listing: Listing) => {
  editingId.value = listing.id
  uploadError.value = ""
  showForm.value = true
  Object.assign(form, {
    title: listing.title,
    location: listing.location,
    dealType: listing.dealType,
    propertyType: listing.propertyType,
    rooms: listing.rooms,
    surface: listing.surface,
    floor: listing.floor ?? "",
    price: listing.price,
    images: [...listing.images],
  })
}

const remove = (id: number) => {
  if (!confirm("Sigur vrei sa stergi acest anunt?")) return
  listings.value = listings.value.filter((l) => l.id !== id)
  if (editingId.value === id) closeForm()
}

const submit = () => {
  if (form.surface === null || form.price === null) return

  const preset = PROPERTY_PRESETS[form.propertyType]
  const payload: Omit<Listing, "id"> = {
    title: form.title,
    location: form.location,
    dealType: form.dealType,
    propertyType: form.propertyType,
    rooms: hasNoRooms.value ? null : form.rooms,
    surface: form.surface,
    floor: form.floor.trim() || null,
    price: form.price,
    icon: preset.icon,
    gradient: preset.gradient,
    images: [...form.images],
  }

  if (editingId.value !== null) {
    const idx = listings.value.findIndex((l) => l.id === editingId.value)
    if (idx !== -1) listings.value[idx] = { id: editingId.value, ...payload }
  } else {
    const nextId = listings.value.reduce((max, l) => Math.max(max, l.id), 0) + 1
    listings.value.unshift({ id: nextId, ...payload })
  }

  closeForm()
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ro-RO").format(price)
</script>
