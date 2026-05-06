import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-01-15",
  devtools: { enabled: true },

  modules: [
    "@pinia/nuxt",
    "nuxt-icons",
    "@nuxt/eslint",
    "@nuxt/ui"
  ],

  eslint: {
    config: {
      standalone: true,
      stylistic: false,
    },
  },

  app: {
    head: {
      title: "metCasa",
    },
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL,
      apiUrl: process.env.API_URL,
      reverbAppKey: process.env.VITE_REVERB_APP_KEY,
      reverbHost: process.env.VITE_REVERB_HOST,
      reverbPort: process.env.VITE_REVERB_PORT,
      reverbScheme: process.env.VITE_REVERB_SCHEME,
      domainUrl: process.env.DOMAIN_URL,
      testEmail: process.env.NUXT_PUBLIC_TEST_EMAIL,
    },
  },

  ssr: false,

  imports: {
    dirs: ["store/.ts", "types/**/.ts", "types/.ts", "composables/**/.ts"],
  },
  css: ["/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },

  components: [{ path: "~/components", pathPrefix: false }],
});
