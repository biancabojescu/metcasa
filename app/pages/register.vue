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
            v-model="phone"
            label="Telefon (optional)"
            type="tel"
            autocomplete="tel"
            placeholder="+40 7XX XXX XXX"
          />
          <UiInput
            v-model="password"
            label="Parola"
            type="password"
            revealable
            required
            :minlength="8"
            autocomplete="new-password"
            placeholder="Minim 8 caractere"
            hint="Minim 8 caractere, litere si cifre"
          />
          <UiInput
            v-model="passwordConfirmation"
            label="Confirma parola"
            type="password"
            revealable
            required
            :minlength="8"
            autocomplete="new-password"
            placeholder="Reintrodu parola"
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

definePageMeta({
  layout: "default",
  middleware: "guest",
})

const auth = useAuthStore()
const router = useRouter()

const name = ref("")
const email = ref("")
const phone = ref("")
const password = ref("")
const passwordConfirmation = ref("")
const error = ref("")
const loading = ref(false)

const extractError = (e: unknown): string => {
  const err = e as { data?: { message?: string; errors?: Record<string, string[]> } }
  if (err?.data?.errors) {
    return Object.values(err.data.errors).flat()[0] ?? "Eroare la inregistrare."
  }
  return err?.data?.message || (e instanceof Error ? e.message : "Eroare la inregistrare.")
}

const submit = async () => {
  error.value = ""
  if (password.value !== passwordConfirmation.value) {
    error.value = "Parolele nu coincid."
    return
  }
  loading.value = true
  try {
    await auth.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
      phone: phone.value || undefined,
    })
    await router.push("/verify-email?sent=1")
  } catch (e) {
    error.value = extractError(e)
  } finally {
    loading.value = false
  }
}
</script>
