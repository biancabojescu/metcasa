<template>
  <div class="flex min-h-[calc(100vh-5.5rem)] items-center justify-center px-6 py-12">
    <div class="w-full max-w-md">
      <UiCard padding="lg" class="md:p-10">
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-purple-900">Creeaza cont</h1>
          <p class="mt-2 text-sm text-purple-800/70">
            Salveaza anunturi si gestioneaza-ti preferatele
          </p>
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="submit">
          <UiInput
            v-model="name"
            label="Nume complet"
            required
            autocomplete="name"
            placeholder="Ion Popescu"
          />
          <UiInput
            v-model="email"
            label="Email"
            type="email"
            required
            autocomplete="email"
            placeholder="nume@exemplu.ro"
          />
          <UiInput
            v-model="password"
            label="Parola"
            type="password"
            required
            :minlength="4"
            autocomplete="new-password"
            placeholder="Minim 4 caractere"
            hint="Minim 4 caractere"
          />

          <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ error }}
          </p>

          <UiButton type="submit" block :loading="loading" class="mt-2">
            {{ loading ? "Se creeaza..." : "Creeaza cont" }}
          </UiButton>
        </form>

        <p class="mt-6 text-center text-sm text-purple-800/70">
          Ai deja cont?
          <NuxtLink to="/login" class="font-semibold text-purple-500 hover:text-purple-900">
            Autentifica-te
          </NuxtLink>
        </p>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth"

definePageMeta({
  layout: "default",
  middleware: "guest",
})

const auth = useAuthStore()
const router = useRouter()

const name = ref("")
const email = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)

const submit = async () => {
  error.value = ""
  loading.value = true
  try {
    await auth.register({ name: name.value, email: email.value, password: password.value })
    await router.push("/")
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Eroare la inregistrare."
  } finally {
    loading.value = false
  }
}
</script>
