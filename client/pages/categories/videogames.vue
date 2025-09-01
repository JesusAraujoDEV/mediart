
<template>
  <NuxtLayout :name="'custom'">
  <div class="flex h-screen text-white font-bold" style="background-color:hsla(293,92%,31%,1);background-image:radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%);">
      <NavigationSidebar />
      <main class="w-full h-full overflow-y-auto">
        <div class="p-8 md:p-12 lg:p-16 max-w-3xl mx-auto">
          <header class="mb-10 flex flex-col items-center">
            <div class="w-40 h-40 flex items-center justify-center bg-neutral-800 rounded-lg mb-6 border-4 border-neutral-800 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" class="w-24 h-24 text-white">
                <rect x="10" y="18" width="28" height="12" rx="6" fill="#222" stroke="currentColor" stroke-width="2" />
                <circle cx="18" cy="24" r="3" fill="#444" />
                <circle cx="30" cy="24" r="3" fill="#444" />
              </svg>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold tracking-tighter mb-2">Videojuegos</h1>
            <p class="text-neutral-800 mt-2 max-w-2xl text-center">
              Genera listas de videojuegos recomendados según tus gustos. Mediart te muestra solo el nombre, la portada, el año y la fuente de cada videojuego sugerido por IA, para que descubras títulos de forma simple y directa.
            </p>
          </header>
          <section class="space-y-6">
            <div>
              <h2 class="text-2xl font-semibold mb-2">¿Qué encontrarás aquí?</h2>
              <ul class="list-disc list-inside text-neutral-300">
                <li>Listas de videojuegos generadas por IA según tus gustos</li>
                <li>Solo verás el nombre, portada, año y fuente de cada videojuego</li>
                <li>Descubre títulos para PC, consolas y móviles</li>
                <li>Recomendaciones simples y directas para explorar videojuegos</li>
              </ul>
            </div>
            <div>
              <h2 class="text-2xl font-semibold mb-2">¿Por qué explorar videojuegos?</h2>
              <p class="text-neutral-400">En Mediart, la experiencia es sencilla: explora videojuegos con la información esencial y deja que la IA te sorprenda con nuevas recomendaciones.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  </NuxtLayout>
</template>

<script setup>
import NavigationSidebar from '~/components/navigation/Sidebar.vue';
</script>
