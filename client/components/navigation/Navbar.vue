<template>
  <header class="absolute top-0 left-0 w-full z-20">
    <nav class="max-w-screen-xl mx-auto px-6 sm:px-8 py-3 mt-4 flex items-center justify-between
                bg-white/10 backdrop-blur-md rounded-full shadow-xl border border-white/20">
      <div class="flex-shrink-0">
        <NuxtLink to="/">
          <img src="/public/mediart/mediartLogo.webp" alt="Mediart Logo" class="h-10 w-auto" />
        </NuxtLink>
      </div>

      <div class="hidden md:flex flex-grow justify-center space-x-8">
        <NuxtLink to="#categorias" class="text-white hover:text-gray-300 transition-colors duration-300 text-lg font-semibold">Categorías</NuxtLink>
        <NuxtLink to="#como-funciona" class="text-white hover:text-gray-300 transition-colors duration-300 text-lg font-semibold">Cómo Funciona</NuxtLink>
        <NuxtLink to="#por-que-elegirnos" class="text-white hover:text-gray-300 transition-colors duration-300 text-lg font-semibold">Por Qué Elegirnos</NuxtLink>
        <NuxtLink to="#comunidad" class="text-white hover:text-gray-300 transition-colors duration-300 text-lg font-semibold">Comunidad</NuxtLink>
      </div>

      <div class="flex items-center space-x-4">
        <NuxtLink to="/login" class="text-white hover:text-gray-300 transition-colors duration-300 text-lg font-semibold hover:underline hidden sm:block">Iniciar Sesión</NuxtLink>
        <NuxtLink to="/register" class="bg-white text-blue-800 font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-200 text-lg">
          Regístrate
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>