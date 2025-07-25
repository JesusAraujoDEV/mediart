// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxt/icon', '@nuxt/image', '@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      backend: process.env.BACKEND_URL || 'http://localhost:3000',
    },
  },
})