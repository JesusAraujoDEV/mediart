<template>
  <NuxtLayout :name="'custom'">
  <div class="flex h-screen text-white font-bold" style="background-color:hsla(293,92%,31%,1);background-image:radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%);">
      <NavigationSidebar />
      <main class="w-full h-full overflow-y-auto">
        <div class="p-8 md:p-12 lg:p-16">
          <header class="mb-10">
            <h1 class="text-4xl md:text-5xl font-bold tracking-tighter">Mezcla: Tu Universo Personalizado</h1>
            <p class="text-neutral-400 mt-2 max-w-2xl">
              Disfruta de una selección personalizada de contenido que combina música, películas, libros y más según tus gustos. ¡Descubre nuevas pasiones en cada visita!
            </p>
          </header>
          <section>
            <ul class="space-y-4">
              <li>Recomendaciones únicas</li>
              <li>Sorpresas culturales</li>
              <li>Basado en tus intereses</li>
              <li>Mezclas temáticas</li>
            </ul>
          </section>
        </div>
      </main>
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
