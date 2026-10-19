<template>
  <div class="flex min-h-[calc(100vh-5.5rem)] items-center justify-center px-6 py-12">
    <div class="w-full max-w-md">
      <UiCard padding="lg" class="md:p-10">
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-purple-900">Ai uitat parola?</h1>
          <p class="mt-2 text-sm text-purple-800/70">
            Introdu emailul si iti trimit un link de resetare.
          </p>
        </div>

        <form v-if="!sent" class="flex flex-col gap-4" @submit.prevent="submit">
          <UiInput
            v-model="email"
            label="Email"
            type="email"
            required
            autocomplete="email"
            placeholder="nume@exemplu.ro"
          />

          <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ error }}
          </p>

          <UiButton type="submit" block :loading="loading" class="mt-2">
            {{ loading ? "Se trimite..." : "Trimite link resetare" }}
          </UiButton>
        </form>

        <div v-else class="flex flex-col gap-4">
          <p class="rounded-lg bg-green-100 px-3 py-3 text-sm text-green-800">
            {{ successMsg }}
          </p>
          <p class="text-center text-xs text-purple-800/60">
            Verifica si folderul de spam. Link-ul expira in 60 minute.
          </p>
        </div>

        <p class="mt-6 text-center text-sm text-purple-800/70">
          Ti-ai amintit parola?
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

const email = ref("")
const loading = ref(false)
const error = ref("")
const sent = ref(false)
const successMsg = ref("")

const extractError = (e: unknown): string => {
  const err = e as { data?: { message?: string; errors?: Record<string, string[]> } }
  if (err?.data?.errors) {
    return Object.values(err.data.errors).flat()[0] ?? "Eroare."
  }
  return err?.data?.message || (e instanceof Error ? e.message : "Eroare.")
}

const submit = async () => {
  error.value = ""
  loading.value = true
  try {
    const res = await auth.forgotPassword(email.value)
    successMsg.value = res.message
    sent.value = true
  } catch (e) {
    error.value = extractError(e)
  } finally {
    loading.value = false
  }
}
</script>
