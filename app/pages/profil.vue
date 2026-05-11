<template>
  <div v-if="auth.user" class="px-6 py-8 md:px-12">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-purple-900 md:text-4xl">Profilul meu</h1>
      <p class="mt-1 text-sm text-purple-800/70">
        Gestioneaza-ti contul metCasa
      </p>
    </header>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
      <UiCard tag="aside" class="text-center">
        <div
          class="mx-auto flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold text-white"
          :style="{ background: auth.user.avatarColor }"
        >
          {{ auth.initials }}
        </div>
        <h2 class="mt-4 text-xl font-semibold text-purple-900">{{ auth.user.name }}</h2>
        <p class="text-sm text-purple-800/70">{{ auth.user.email }}</p>

        <div class="mt-6 space-y-2 text-left">
          <NuxtLink
            to="/favorite"
            class="flex items-center justify-between rounded-lg border border-purple-900/10 bg-grey-10 px-4 py-3 text-sm font-medium text-purple-900 transition-colors hover:border-purple-500"
          >
            <span>Anunturi favorite</span>
            <UiBadge variant="purple" size="sm">{{ favorites.count }}</UiBadge>
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
            <UiInput v-model="form.email" label="Email" type="email" required />
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

          <p v-if="saved" class="rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700">
            Modificarile au fost salvate.
          </p>

          <div class="mt-2 flex justify-end">
            <UiButton type="submit" size="md">Salveaza modificarile</UiButton>
          </div>
        </form>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth"
import { useFavoritesStore } from "~/stores/favorites"

definePageMeta({
  layout: "default",
  middleware: "auth",
})

const auth = useAuthStore()
const favorites = useFavoritesStore()
const router = useRouter()

const form = reactive({
  name: auth.user?.name ?? "",
  email: auth.user?.email ?? "",
  phone: auth.user?.phone ?? "",
})

const saved = ref(false)

const memberSince = computed(() => {
  if (!auth.user) return ""
  return new Date(auth.user.joinedAt).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
})

const save = () => {
  auth.updateProfile({
    name: form.name,
    email: form.email,
    phone: form.phone,
  })
  saved.value = true
  setTimeout(() => (saved.value = false), 2500)
}

const logout = () => {
  if (!confirm("Sigur vrei sa te deconectezi?")) return
  auth.logout()
  router.push("/")
}
</script>
