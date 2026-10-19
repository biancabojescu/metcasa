import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-01-15",
  devtools: { enabled: true },

  devServer: {
    port: 3001,
  },

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

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL,
      apiUrl: process.env.API_URL || "http://localhost:8000/api/v1",
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
    dirs: ["composables/**", "stores/**", "types/**"],
  },
  css: ["/assets/css/main.css"],

  app: {
    head: {
      title: "metCasa",
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  components: [{ path: "~/components", pathPrefix: false }],
});
