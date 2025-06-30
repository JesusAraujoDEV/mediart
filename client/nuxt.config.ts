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

  vite: {
    server: {
      host: true, // Esto es crucial para que el servidor escuche correctamente en GitPod
      allowedHosts: [
        '.gitpod.io' // Esto permite todas las URLs generadas por GitPod
      ]
    }
  }
})