<template>
  <NuxtLayout :name="'custom'">
    <div class="flex">
      <NavigationSidebar />
      <div class="min-h-screen w-full bg-slate-900 flex flex-col justify-center">
        <div class="container mx-auto p-8 text-white">
          <!-- El texto original de la página principal de categorías puede ir aquí si no hay sub-ruta -->
          <h1 class="text-4xl font-bold mb-6 text-center">Explora nuestras categorías</h1>
          <p class="text-lg text-center max-w-2xl mx-auto">
            ¡Bienvenido a Mediart! Sumérgete en el mundo del arte a través de nuestras categorías especializadas.
          </p>

          <!-- Aquí se renderizarán los componentes de las sub-rutas (e.g., songs.vue, movies.vue) -->
          <div class="mt-12">
              <NuxtPage />
          </div>
          
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { definePageMeta } from '#imports';
import NavigationSidebar from '~/components/navigation/Sidebar.vue';

definePageMeta({
  layout: "custom",
});
</script>
