<template>
  <NuxtLayout :name="'custom'">
    <div class="flex">
      <NavigationSidebar />
      <div class="min-h-screen w-full flex flex-col" style="background: linear-gradient(to bottom right, #ff1100ff 18%, #00d9ffff 82%);">
        <div class="container mx-auto px-6 py-10">
          <div class="mb-8">
            <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Blog</h1>
            <p class="text-slate-200/80 mt-2">Explora blogs y artículos de nuestro equipo.</p>
          </div>

          <!-- Preview card linking to the full blog article -->
          <NuxtLink to="/blogs/one-piece-fan-letter" aria-label="Leer artículo: ¿Por qué deberías ver One Piece Fan Letter? La joya que redefine Marineford" title="Leer artículo: ¿Por qué deberías ver One Piece Fan Letter? La joya que redefine Marineford" class="block group focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 rounded-2xl">
            <article class="rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer overflow-hidden relative">
              <div class="p-6 md:p-8">
                <div class="flex items-center gap-3 mb-4">
                  <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 border border-emerald-400/20">
                    Series
                  </span>
                  <span class="text-xs md:text-sm text-gray-500">Miércoles, 3 de septiembre, 2025</span>
                </div>

                <h2 class="text-xl md:text-2xl font-bold text-black group-hover:text-blue-600 transition-colors">
                  ¿Por qué deberías ver One Piece Fan Letter? La joya que redefine Marineford
                </h2>

                <p class="mt-3 text-gray-600">
                  Querido lector, si crees que lo has visto todo en el mundo del anime, detente un momento. Ya seas un fan de One Piece o alguien intimidado por sus episodios, hay un tesoro oculto que te hará entender por qué esta serie ha cautivado a millones.
                </p>

                <div class="mt-4 flex flex-wrap gap-2">
                  <span class="px-2.5 py-1 rounded-md text-xs font-medium bg-fuchsia-500/15 text-fuchsia-600 border border-fuchsia-400/20">Anime</span>
                  <span class="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/15 text-emerald-600 border border-emerald-400/20">One Piece</span>
                  <span class="px-2.5 py-1 rounded-md text-xs font-medium bg-sky-500/15 text-sky-600 border border-sky-400/20">Fan Letter</span>
                </div>
              </div>

              <div class="absolute bottom-4 right-4 inline-flex items-center gap-2 text-blue-600 group-hover:text-blue-700 font-medium">
                <span>Leer artículo</span>
                <span aria-hidden="true" class="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>
            </article>
          </NuxtLink>
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

<style scoped>
</style>

