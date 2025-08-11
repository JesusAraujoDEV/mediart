// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxt/icon', '@nuxt/image', '@nuxtjs/tailwindcss', '@vueuse/motion/nuxt'],
  css: ['~/assets/css/main.css'],
  image: {
    domains: [
      'image.tmdb.org',
      'i.scdn.co',
      'images.igdb.com',
      'i.ibb.co'
    ],
  },
  runtimeConfig: {
    public: {
      backend: process.env.BACKEND_URL || 'http://localhost:3000',
    },
  },

  vite: {
    server: {
      allowedHosts: [
        '.gitpod.io' // Esto permite todas las URLs generadas por GitPod
      ]
    }
  }
})