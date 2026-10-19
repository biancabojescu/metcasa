<template>
  <div v-if="auth.user" class="px-6 py-8 md:px-12">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-purple-900 md:text-4xl">Profilul meu</h1>
      <p class="mt-1 text-sm text-purple-800/70">Gestioneaza-ti contul metCasa</p>
    </header>

    <div
      v-if="!auth.isVerified"
      class="mb-6 flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <strong>Confirma-ti emailul</strong> - ti-am trimis un link pe
        <strong>{{ auth.user.email }}</strong>.
      </div>
      <div class="flex items-center gap-2">
        <UiButton size="sm" variant="secondary" :loading="resending" @click="resend">
          Retrimite link
        </UiButton>
      </div>
    </div>
    <p v-if="resendMsg" class="mb-4 rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700">
      {{ resendMsg }}
    </p>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
      <UiCard tag="aside" class="text-center">
        <div class="relative mx-auto h-28 w-28">
          <div
            v-if="!previewUrl"
            class="flex h-28 w-28 items-center justify-center rounded-full text-3xl font-bold text-white"
            :style="{ background: auth.user.avatarColor }"
          >
            {{ auth.initials }}
          </div>
          <img
            v-else
            :src="previewUrl"
            alt="Avatar"
            class="h-28 w-28 rounded-full object-cover ring-2 ring-purple-500/20"
          />

          <label
            class="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-purple-500 text-white shadow-md transition-colors hover:bg-purple-700"
            aria-label="Schimba poza de profil"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="hidden"
              @change="onAvatarSelected"
            />
          </label>
        </div>

        <p v-if="avatarError" class="mt-2 text-xs text-red-600">{{ avatarError }}</p>

        <button
          v-if="(form.avatar || auth.user.avatar_url) && !form.remove_avatar"
          type="button"
          class="mt-2 text-xs text-red-600 hover:text-red-800"
          @click="removeAvatar"
        >
          Sterge poza
        </button>

        <h2 class="mt-4 text-xl font-semibold text-purple-900">{{ auth.user.name }}</h2>
        <p class="text-sm text-purple-800/70">{{ auth.user.email }}</p>

        <div class="mt-6 space-y-2 text-left">
          <NuxtLink
            to="/favorite"
            class="flex items-center justify-between rounded-lg border border-purple-900/10 bg-grey-10 px-4 py-3 text-sm font-medium text-purple-900 transition-colors hover:border-purple-500"
          >
            <span>Anunturi favorite</span>
            <span aria-hidden="true">&rarr;</span>
          </NuxtLink>
          <NuxtLink
            to="/anunturi"
            class="flex items-center justify-between rounded-lg border border-purple-900/10 bg-grey-10 px-4 py-3 text-sm font-medium text-purple-900 transition-colors hover:border-purple-500"
          >
            <span>Vezi anunturi</span>
            <span aria-hidden="true">&rarr;</span>
          </NuxtLink>
        </div>

        <UiButton variant="danger" block class="mt-6" @click="logout">
          Deconectare
        </UiButton>
      </UiCard>

      <UiCard tag="section" padding="lg">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-purple-900">Informatii cont</h2>
          <p class="mt-1 text-sm text-purple-800/70">Actualizeaza datele tale personale</p>
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="save">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <UiInput v-model="form.name" label="Nume complet" required />
            <UiInput v-model="form.email" label="Email" type="email" required hint="Daca schimbi emailul vei primi un nou link de confirmare." />
          </div>

          <UiInput
            v-model="form.phone"
            label="Telefon"
            type="tel"
            placeholder="+40 7XX XXX XXX"
          />

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold uppercase tracking-wider text-purple-900">
              Membru din
            </label>
            <p class="rounded-lg bg-grey-10 px-3 py-2.5 text-sm text-purple-800/70">
              {{ memberSince }}
            </p>
          </div>

          <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ error }}
          </p>
          <p v-if="saved" class="rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700">
            {{ saved }}
          </p>

          <div class="mt-2 flex justify-end gap-2">
            <UiButton
              v-if="isDirty"
              type="button"
              variant="secondary"
              @click="resetForm"
            >
              Anuleaza
            </UiButton>
            <UiButton
              type="submit"
              size="md"
              :loading="saving"
              :disabled="!isDirty"
            >
              Salveaza modificarile
            </UiButton>
          </div>
        </form>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: "default",
  middleware: "auth",
})

const MAX_AVATAR_SIZE = 5 * 1024 * 1024

const auth = useAuthStore()
const router = useRouter()

interface ProfileForm {
  name: string
  email: string
  phone: string
  avatar: File | null
  remove_avatar: boolean
}

const baseline = (): ProfileForm => ({
  name: auth.user?.name ?? "",
  email: auth.user?.email ?? "",
  phone: auth.user?.phone ?? "",
  avatar: null,
  remove_avatar: false,
})

const form = reactive<ProfileForm>(baseline())

const localAvatarPreview = ref<string | null>(null)
const avatarError = ref("")
const error = ref("")
const saved = ref("")
const saving = ref(false)
const resending = ref(false)
const resendMsg = ref("")

const previewUrl = computed(() => {
  if (form.remove_avatar) return null
  if (localAvatarPreview.value) return localAvatarPreview.value
  return auth.user?.avatar_url ?? null
})

const memberSince = computed(() => {
  if (!auth.user) return ""
  return new Date(auth.user.created_at).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
})

const isDirty = computed(() => {
  if (!auth.user) return false
  return (
    form.name !== (auth.user.name ?? "") ||
    form.email !== (auth.user.email ?? "") ||
    form.phone !== (auth.user.phone ?? "") ||
    form.avatar !== null ||
    form.remove_avatar !== false
  )
})

const resetForm = () => {
  Object.assign(form, baseline())
  localAvatarPreview.value = null
  avatarError.value = ""
  error.value = ""
}

const onAvatarSelected = async (event: Event) => {
  avatarError.value = ""
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ""
  if (!file) return

  if (!file.type.startsWith("image/")) {
    avatarError.value = "Fisierul nu este o imagine valida."
    return
  }
  if (file.size > MAX_AVATAR_SIZE) {
    avatarError.value = "Imaginea depaseste 5MB."
    return
  }

  form.avatar = file
  form.remove_avatar = false
  localAvatarPreview.value = await readAsDataUrl(file)
}

const removeAvatar = () => {
  form.avatar = null
  form.remove_avatar = true
  localAvatarPreview.value = null
}

const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

const extractError = (e: unknown): string => {
  const err = e as { data?: { message?: string; errors?: Record<string, string[]> } }
  if (err?.data?.errors) {
    return Object.values(err.data.errors).flat()[0] ?? "Eroare la salvare."
  }
  return err?.data?.message || (e instanceof Error ? e.message : "Eroare la salvare.")
}

const save = async () => {
  error.value = ""
  saved.value = ""
  saving.value = true
  try {
    const res = await auth.updateProfile({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      avatar: form.avatar,
      remove_avatar: form.remove_avatar,
    })
    saved.value = res.message
    setTimeout(() => (saved.value = ""), 3000)
    // Reset form deltas dupa salvare (folosind noile valori din store)
    Object.assign(form, baseline())
    localAvatarPreview.value = null
  } catch (e) {
    error.value = extractError(e)
  } finally {
    saving.value = false
  }
}

const resend = async () => {
  resendMsg.value = ""
  resending.value = true
  try {
    const res = await auth.resendVerification()
    resendMsg.value = res.message
    setTimeout(() => (resendMsg.value = ""), 3500)
  } finally {
    resending.value = false
  }
}

const logout = async () => {
  if (!confirm("Sigur vrei sa te deconectezi?")) return
  await auth.logout()
  router.push("/")
}

// Cand userul se schimba (initial fetch) sincronizam baseline-ul
watch(
  () => auth.user?.id,
  () => {
    if (!form.avatar && !form.remove_avatar) Object.assign(form, baseline())
  },
)
</script>
