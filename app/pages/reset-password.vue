<template>
  <div class="flex min-h-[calc(100vh-5.5rem)] items-center justify-center px-6 py-12">
    <div class="w-full max-w-md">
      <UiCard padding="lg" class="md:p-10">
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-purple-900">Parola noua</h1>
          <p class="mt-2 text-sm text-purple-800/70">
            Alege o parola noua pentru contul {{ email || "tau" }}.
          </p>
        </div>

        <form v-if="!done" class="flex flex-col gap-4" @submit.prevent="submit">
          <UiInput
            v-if="!email"
            v-model="emailField"
            label="Email"
            type="email"
            required
            autocomplete="email"
          />
          <UiInput
            v-model="password"
            label="Parola noua"
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
          />

          <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ error }}
          </p>

          <UiButton type="submit" block :loading="loading" class="mt-2">
            {{ loading ? "Se schimba..." : "Schimba parola" }}
          </UiButton>
        </form>

        <div v-else class="flex flex-col gap-4">
          <p class="rounded-lg bg-green-100 px-3 py-3 text-sm text-green-800">
            {{ successMsg }}
          </p>
          <UiButton block @click="goLogin">Mergi la autentificare</UiButton>
        </div>

        <p v-if="!done" class="mt-6 text-center text-sm text-purple-800/70">
          <NuxtLink to="/login" class="hover:text-purple-900">&larr; Inapoi la autentificare</NuxtLink>
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
const route = useRoute()
const router = useRouter()

const token = computed(() => (route.query.token as string) || "")
const email = computed(() => (route.query.email as string) || "")

const emailField = ref(email.value)
const password = ref("")
const passwordConfirmation = ref("")
const loading = ref(false)
const error = ref("")
const done = ref(false)
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
  if (!token.value) {
    error.value = "Token lipsa. Foloseste linkul primit pe email."
    return
  }
  if (password.value !== passwordConfirmation.value) {
    error.value = "Parolele nu coincid."
    return
  }
  loading.value = true
  try {
    const res = await auth.resetPassword({
      token: token.value,
      email: email.value || emailField.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })
    successMsg.value = res.message
    done.value = true
  } catch (e) {
    error.value = extractError(e)
  } finally {
    loading.value = false
  }
}

const goLogin = () => router.push("/login")
</script>
