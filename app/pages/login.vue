<template>
  <div class="flex min-h-[calc(100vh-5.5rem)] items-center justify-center px-6 py-12">
    <div class="w-full max-w-md">
      <UiCard padding="lg" class="md:p-10">
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-purple-900">Bine ai venit</h1>
          <p class="mt-2 text-sm text-purple-800/70">
            Autentifica-te in contul tau metCasa
          </p>
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="submit">
          <UiInput
            v-model="email"
            label="Email"
            type="email"
            required
            autocomplete="email"
            placeholder="nume@exemplu.ro"
          />

          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <UiInput
                v-model="password"
                label="Parola"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="flex-1"
              />
            </div>
            <button
              type="button"
              class="self-end text-xs text-purple-500 hover:text-purple-900"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? "Ascunde parola" : "Afiseaza parola" }}
            </button>
          </div>

          <label class="flex items-center gap-2 text-sm text-purple-800/80">
            <input
              v-model="remember"
              type="checkbox"
              class="h-4 w-4 rounded border-purple-900/20 accent-purple-500"
            />
            Tine-ma minte
          </label>

          <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ error }}
          </p>

          <UiButton type="submit" block :loading="loading" class="mt-2">
            {{ loading ? "Se autentifica..." : "Autentificare" }}
          </UiButton>
        </form>

        <p class="mt-6 text-center text-sm text-purple-800/70">
          Nu ai cont?
          <NuxtLink to="/register" class="font-semibold text-purple-500 hover:text-purple-900">
            Inregistreaza-te
          </NuxtLink>
        </p>
      </UiCard>

      <p class="mt-6 text-center text-xs text-purple-800/60">
        <NuxtLink to="/" class="hover:text-purple-900">&larr; Inapoi la pagina principala</NuxtLink>
      </p>
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
const route = useRoute()
const router = useRouter()

const email = ref("")
const password = ref("")
const remember = ref(true)
const showPassword = ref(false)
const error = ref("")
const loading = ref(false)

const submit = async () => {
  error.value = ""
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    const redirect = (route.query.redirect as string) || "/"
    await router.push(redirect)
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Eroare la autentificare."
  } finally {
    loading.value = false
  }
}
</script>
