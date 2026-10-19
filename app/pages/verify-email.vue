<template>
  <div class="flex min-h-[calc(100vh-5.5rem)] items-center justify-center px-6 py-12">
    <div class="w-full max-w-md">
      <UiCard padding="lg" class="md:p-10">
        <div class="mb-6 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-3xl">
            <span aria-hidden="true">{{ statusIcon }}</span>
          </div>
          <h1 class="text-2xl font-bold text-purple-900">{{ heading }}</h1>
          <p class="mt-2 text-sm text-purple-800/70">{{ description }}</p>
        </div>

        <div v-if="state === 'verifying'" class="flex justify-center py-4">
          <span class="text-sm text-purple-800/60">Se verifica link-ul...</span>
        </div>

        <div v-else-if="state === 'success'" class="flex flex-col gap-3">
          <UiButton block @click="goNext">Continua</UiButton>
        </div>

        <div v-else-if="state === 'sent'" class="flex flex-col gap-3">
          <p class="rounded-lg bg-purple-50 px-3 py-2 text-sm text-purple-900">
            Ti-am trimis un link de confirmare pe <strong>{{ auth.user?.email || "adresa ta de email" }}</strong>. Verifica si folderul de spam.
          </p>
          <UiButton block :loading="resending" :disabled="!auth.isLoggedIn" @click="resend">
            {{ resending ? "Se trimite..." : "Retrimite emailul" }}
          </UiButton>
          <p v-if="resendMsg" class="text-center text-xs text-green-700">{{ resendMsg }}</p>
          <p v-if="resendErr" class="text-center text-xs text-red-700">{{ resendErr }}</p>
          <NuxtLink to="/" class="mt-2 text-center text-sm text-purple-800/70 hover:text-purple-900">
            &larr; Inapoi la pagina principala
          </NuxtLink>
        </div>

        <div v-else-if="state === 'error'" class="flex flex-col gap-3">
          <p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>
          <UiButton v-if="auth.isLoggedIn" block :loading="resending" @click="resend">
            {{ resending ? "Se trimite..." : "Retrimite emailul" }}
          </UiButton>
          <NuxtLink to="/login" class="mt-2 text-center text-sm text-purple-800/70 hover:text-purple-900">
            &larr; Inapoi la autentificare
          </NuxtLink>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: "default",
})

type State = "verifying" | "success" | "sent" | "error"

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const state = ref<State>("sent")
const error = ref("")
const resending = ref(false)
const resendMsg = ref("")
const resendErr = ref("")

const statusIcon = computed(() => {
  if (state.value === "success") return "✓"
  if (state.value === "error") return "!"
  return "✉"
})

const heading = computed(() => {
  if (state.value === "verifying") return "Se verifica..."
  if (state.value === "success") return "Email confirmat"
  if (state.value === "error") return "Link invalid"
  return "Confirma-ti emailul"
})

const description = computed(() => {
  if (state.value === "verifying") return "Te rugam sa astepti."
  if (state.value === "success") return "Adresa ta de email a fost confirmata cu succes."
  if (state.value === "error") return "Verifica daca link-ul nu a expirat."
  return "Aproape gata - mai ai un singur pas."
})

const goNext = () => router.push(auth.isLoggedIn ? "/profil" : "/login")

const resend = async () => {
  resendMsg.value = ""
  resendErr.value = ""
  resending.value = true
  try {
    const res = await auth.resendVerification()
    resendMsg.value = res.message
  } catch (e) {
    const err = e as { data?: { message?: string } }
    resendErr.value = err?.data?.message || "Nu am putut retrimite emailul."
  } finally {
    resending.value = false
  }
}

onMounted(async () => {
  const signedUrl = route.query.url as string | undefined
  if (signedUrl) {
    state.value = "verifying"
    try {
      await auth.verifyEmail(signedUrl)
      state.value = "success"
    } catch (e) {
      const err = e as { data?: { message?: string } }
      error.value = err?.data?.message || "Link invalid sau expirat."
      state.value = "error"
    }
    return
  }
  state.value = "sent"
})
</script>
