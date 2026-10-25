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
          Valoare totala vanzari
        </div>
        <div class="mt-2 text-3xl font-bold text-purple-900">
          {{ formatPrice(stats.totalValue) }}
          <span class="text-base font-normal text-purple-800/60">EUR</span>
        </div>
      </UiCard>
    </section>

    <p v-if="globalError" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ globalError }}
    </p>
    <p v-if="globalSuccess" class="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
      {{ globalSuccess }}
    </p>

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
            label="Adresa"
            required
            placeholder="Iasi, Copou, str. Exemplu nr. 5"
            hint="Adresa apare ca link Google Maps in detaliile anuntului."
          />

          <div class="grid grid-cols-2 gap-3">
            <UiSelect
              v-model="form.deal_type"
              label="Tip tranzactie"
              :options="DEAL_TYPE_OPTIONS"
            />
            <UiSelect
              v-model="form.property_type"
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
              :label="`Pret (EUR${form.deal_type === 'Inchiriere' ? '/luna' : ''})`"
              type="number"
              :min="0"
              required
              placeholder="145000"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-purple-900">
              Descriere (optional)
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full rounded-lg border border-purple-900/15 bg-white px-3 py-2.5 text-sm text-purple-900 placeholder:text-purple-900/40 focus:border-purple-500 focus:outline-none"
              placeholder="Detalii suplimentare..."
            />
          </div>

          <UiSelect
            v-model="form.status"
            label="Status"
            :options="STATUS_OPTIONS"
          />

          <div v-if="form.status === 'inactive'" class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-purple-900">
              Detalii arhivare
            </label>
            <textarea
              v-model="form.archive_note"
              rows="3"
              class="w-full rounded-lg border border-amber-300 bg-amber-50/40 px-3 py-2.5 text-sm text-purple-900 placeholder:text-purple-900/40 focus:border-amber-500 focus:outline-none"
              placeholder="De ce arhivezi anuntul? (ex: vandut, retras la cererea proprietarului, in negociere)"
            />
            <p class="text-xs text-amber-800/80">
              Anuntul nu va mai aparea in listari publice cat e inactiv.
            </p>
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
                accept="image/jpeg,image/png,image/webp"
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

            <div v-if="allFormImages.length > 0" class="mt-2 grid grid-cols-3 gap-2">
              <div
                v-for="(img, idx) in allFormImages"
                :key="img.key"
                class="group relative aspect-square overflow-hidden rounded-lg border border-purple-900/10"
              >
                <img :src="img.preview" alt="" class="h-full w-full object-cover" />
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
                  @click="removeImage(img)"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>

          <p v-if="formError" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ formError }}
          </p>

          <div class="flex flex-col gap-2 pt-2">
            <UiButton type="submit" block size="lg" :loading="saving">
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
          <span class="text-sm text-purple-800/60">{{ stats.total }} total</span>
        </div>

        <div v-if="loadingList" class="px-6 py-16 text-center text-sm text-purple-800/60">
          Se incarca...
        </div>

        <div v-else-if="listings.length === 0" class="px-6 py-16 text-center">
          <p class="text-sm text-purple-800/60">Nu exista anunturi inca.</p>
          <UiButton variant="ghost" size="sm" class="mt-3" @click="openCreateForm">
            Adauga primul anunt
          </UiButton>
        </div>

        <div v-else class="divide-y divide-purple-900/10">
          <article
            v-for="listing in listings"
            :key="listing.id"
            :class="[
              'flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center',
              listing.status === 'inactive' ? 'bg-amber-50/40' : '',
            ]"
          >
            <div
              class="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl text-3xl"
              :style="listing.images.length === 0 ? { background: presetFor(listing.property_type).gradient } : undefined"
            >
              <img
                v-if="listing.images.length > 0"
                :src="listing.images[0]?.url"
                :alt="listing.title"
                class="h-full w-full object-cover"
              />
              <template v-else>{{ presetFor(listing.property_type).icon }}</template>
              <span
                v-if="listing.images.length > 1"
                class="absolute bottom-0.5 right-0.5 rounded-full bg-purple-900/80 px-1.5 py-0.5 text-[9px] font-semibold text-white"
              >
                +{{ listing.images.length - 1 }}
              </span>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3
                  :class="[
                    'truncate text-base font-semibold',
                    listing.status === 'inactive' ? 'text-purple-900/60 line-through' : 'text-purple-900',
                  ]"
                >
                  {{ listing.title }}
                </h3>
                <UiBadge
                  size="sm"
                  :variant="listing.deal_type === 'Vanzare' ? 'soft-green' : 'soft-purple'"
                  class="shrink-0"
                >
                  {{ listing.deal_type }}
                </UiBadge>
                <UiBadge
                  v-if="listing.status === 'inactive'"
                  size="sm"
                  variant="purple"
                  class="shrink-0 bg-amber-500 text-white"
                >
                  Arhivat
                </UiBadge>
              </div>
              <p class="mt-0.5 text-sm text-purple-800/70">{{ listing.location }}</p>
              <p
                v-if="listing.status === 'inactive' && listing.archive_note"
                class="mt-1 text-xs italic text-amber-800"
                :title="listing.archive_note"
              >
                Arhivat: {{ listing.archive_note }}
              </p>
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
                  EUR{{ listing.deal_type === "Inchiriere" ? "/luna" : "" }}
                </div>
              </div>

              <div class="flex items-center gap-2">
                <UiButton variant="secondary" size="sm" @click="edit(listing)">
                  Editeaza
                </UiButton>
                <UiButton
                  variant="danger"
                  size="sm"
                  :loading="deletingId === listing.id"
                  @click="remove(listing.id)"
                >
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
  middleware: "admin",
})

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

const STATUS_OPTIONS: { value: ListingStatus; label: string }[] = [
  { value: "active", label: "Activ (vizibil public)" },
  { value: "inactive", label: "Inactiv / arhivat" },
]

interface ListingForm {
  title: string
  location: string
  description: string
  deal_type: DealType
  property_type: PropertyType
  rooms: number | null
  surface: number | null
  floor: string
  price: number | null
  status: ListingStatus
  archive_note: string
}

interface FormImage {
  key: string
  preview: string
  existingPath?: string
  file?: File
}

const defaultForm = (): ListingForm => ({
  title: "",
  location: "",
  description: "",
  deal_type: "Vanzare",
  property_type: "Apartament",
  rooms: null,
  surface: null,
  floor: "",
  price: null,
  status: "active",
  archive_note: "",
})

const api = useListings()

const listings = ref<Listing[]>([])
const loadingList = ref(false)
const showForm = ref(true)
const editingId = ref<number | null>(null)
const isDragging = ref(false)
const uploadError = ref("")
const formError = ref("")
const globalError = ref("")
const globalSuccess = ref("")
const saving = ref(false)
const deletingId = ref<number | null>(null)

const form = reactive<ListingForm>(defaultForm())
const formImages = ref<FormImage[]>([])

const allFormImages = computed(() => formImages.value)

const hasNoRooms = computed(
  () => form.property_type === "Teren" || form.property_type === "Comercial",
)

watch(hasNoRooms, (noRooms) => {
  if (noRooms) form.rooms = null
})

const stats = computed(() => ({
  total: listings.value.length,
  sales: listings.value.filter((l) => l.deal_type === "Vanzare").length,
  rentals: listings.value.filter((l) => l.deal_type === "Inchiriere").length,
  totalValue: listings.value
    .filter((l) => l.deal_type === "Vanzare")
    .reduce((sum, l) => sum + l.price, 0),
}))

const loadListings = async () => {
  loadingList.value = true
  try {
    const res = await api.fetchList({ per_page: 100, include_all_statuses: true, sort: "recent" })
    listings.value = res.data
  } catch (e) {
    const err = e as { data?: { message?: string } }
    globalError.value = err?.data?.message || "Nu am putut incarca anunturile."
  } finally {
    loadingList.value = false
  }
}

const openCreateForm = () => {
  editingId.value = null
  uploadError.value = ""
  formError.value = ""
  Object.assign(form, defaultForm())
  formImages.value = []
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingId.value = null
  uploadError.value = ""
  formError.value = ""
  Object.assign(form, defaultForm())
  formImages.value = []
}

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
  for (const file of incoming) {
    if (!file.type.startsWith("image/")) {
      uploadError.value = `${file.name} nu este o imagine valida.`
      continue
    }
    if (file.size > MAX_IMAGE_SIZE) {
      uploadError.value = `${file.name} depaseste 5MB.`
      continue
    }
    const preview = await readFileAsDataUrl(file)
    formImages.value.push({
      key: `${file.name}-${file.lastModified}-${formImages.value.length}`,
      preview,
      file,
    })
  }
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

const removeImage = (img: FormImage) => {
  formImages.value = formImages.value.filter((i) => i.key !== img.key)
}

const edit = (listing: Listing) => {
  editingId.value = listing.id
  uploadError.value = ""
  formError.value = ""
  showForm.value = true
  Object.assign(form, {
    title: listing.title,
    location: listing.location,
    description: listing.description ?? "",
    deal_type: listing.deal_type,
    property_type: listing.property_type,
    rooms: listing.rooms,
    surface: listing.surface,
    floor: listing.floor ?? "",
    price: listing.price,
    status: listing.status,
    archive_note: listing.archive_note ?? "",
  })
  formImages.value = listing.images.map((img: ListingImage, idx: number) => ({
    key: "existing-" + idx + "-" + img.path,
    preview: img.url,
    existingPath: img.path,
  }))
}

const buildFormData = (): FormData => {
  const fd = new FormData()
  fd.set("title", form.title)
  fd.set("location", form.location)
  fd.set("description", form.description ?? "")
  fd.set("deal_type", form.deal_type)
  fd.set("property_type", form.property_type)
  fd.set("surface", String(form.surface ?? ""))
  fd.set("price", String(form.price ?? ""))
  fd.set("status", form.status)
  if (form.status === "inactive" && form.archive_note) {
    fd.set("archive_note", form.archive_note)
  } else if (form.status === "active") {
    fd.set("archive_note", "")
  }
  if (!hasNoRooms.value && form.rooms !== null) fd.set("rooms", String(form.rooms))
  if (form.floor) fd.set("floor", form.floor)

  for (const img of formImages.value) {
    if (img.existingPath) fd.append("keep_images[]", img.existingPath)
    else if (img.file) fd.append("new_images[]", img.file)
  }

  if (editingId.value !== null) {
    fd.set("_method", "POST")
  }

  return fd
}

const submit = async () => {
  if (form.surface === null || form.price === null) {
    formError.value = "Suprafata si pret sunt obligatorii."
    return
  }
  formError.value = ""
  globalError.value = ""
  globalSuccess.value = ""
  saving.value = true
  try {
    const fd = buildFormData()
    let res
    if (editingId.value !== null) {
      res = await api.update(editingId.value, fd)
    } else {
      res = await api.create(fd)
    }
    globalSuccess.value = res.message
    setTimeout(() => (globalSuccess.value = ""), 3500)
    closeForm()
    await loadListings()
  } catch (e) {
    const err = e as { data?: { message?: string; errors?: Record<string, string[]> } }
    if (err?.data?.errors) {
      formError.value = Object.values(err.data.errors).flat()[0] ?? "Eroare la salvare."
    } else {
      formError.value = err?.data?.message || "Eroare la salvare."
    }
  } finally {
    saving.value = false
  }
}

const remove = async (id: number) => {
  if (!confirm("Sigur vrei sa stergi acest anunt?")) return
  deletingId.value = id
  globalError.value = ""
  try {
    const res = await api.remove(id)
    globalSuccess.value = res.message
    setTimeout(() => (globalSuccess.value = ""), 3500)
    if (editingId.value === id) closeForm()
    listings.value = listings.value.filter((l) => l.id !== id)
  } catch (e) {
    const err = e as { data?: { message?: string } }
    globalError.value = err?.data?.message || "Eroare la stergere."
  } finally {
    deletingId.value = null
  }
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ro-RO").format(price)

onMounted(loadListings)
</script>
