<template>
  <section
    ref="sectionRef"
    aria-labelledby="categories-title"
    class="relative w-full min-h-screen py-16 md:py-24 overflow-hidden"
  >
    <!-- Video de fondo optimizado -->
    <video
      v-if="!prefersReduced"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      class="absolute inset-0 -z-10 pointer-events-none w-full h-full object-cover"
      style="filter: brightness(0.8);"
      @loadeddata="onVideoLoaded"
      aria-hidden="true"
    >
      <source src="/landingImages/colorBackground.mp4" type="video/mp4" />
      Tu navegador no soporta videos.
    </video>
    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Header con CTA a la derecha para distribución propia -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
        <div>
          <div class="flex items-center gap-2">
            <span class="bg-white/10 text-white/80 border border-white/15 uppercase tracking-[0.18em] rounded-full px-3 py-1 text-xs">
              Categorías
            </span>
          </div>
          <h2
            id="categories-title"
            class="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white/95 leading-tight uppercase tracking-tight"
          >
            Explora por tipo de arte
          </h2>
          <p class="mt-3 text-white/75 text-sm sm:text-base max-w-2xl">
            Diferentes puertas de entrada para descubrir lo que te mueve.
          </p>
        </div>
        <div class="shrink-0">
          <a
            href="/categories"
            class="rounded-full bg-white/15 text-white border border-white/20 hover:bg-white/25 px-6 py-2.5 text-sm font-medium cursor-pointer transition-all duration-300 transform active:scale-95"
          >
            Ver todas las categorías
          </a>
        </div>
      </div>

      <!-- Distribución propia:
        - Móvil: carrusel con snap
        - Desktop: grid asimétrica
      -->
      <div class="md:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory space-x-4 flex">
        <div
          v-for="(c, i) in categories"
          :key="c.key"
          class="snap-start shrink-0 w-[320px] ml-4 first:ml-8"
          :class="[i === 0 ? 'w-[320px]' : '']"
        >
          <CategoryCard
            :title="c.title"
            :subtitle="c.subtitle"
            :image="c.image"
            :badge="c.badge"
            :href="'/categories/' + c.key"
            class="cursor-pointer"
          />
        </div>
      </div>

      <div class="hidden md:grid gap-6 md:gap-8 grid-cols-12">
        <div
          v-for="(c, i) in categories"
          :key="c.key"
          :class="[
            i === 0
              ? 'col-span-12 lg:col-span-8'
              : 'col-span-6 sm:col-span-6 lg:col-span-4'
          ]"
        >
          <CategoryCard
            :title="c.title"
            :subtitle="c.subtitle"
            :image="c.image"
            :badge="c.badge"
            :href="'/categories/' + c.key"
            :class="[i === 0 ? 'h-full' : '', 'cursor-pointer']"
          />
        </div>
      </div>

      <div class="mt-12 flex justify-center">
        <div class="pointer-events-none w-full max-w-5xl h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
    </div>

    <!-- Borde póster cohesivo -->
    <div class="pointer-events-none absolute inset-0 ring-1 ring-white/10" aria-hidden="true" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
const CategoryCard = defineAsyncComponent(() => import('../ui/CategoryCard.vue'));

const sectionRef = ref<HTMLElement | null>(null)
const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function onVideoLoaded(event: Event) {
  const video = event.target as HTMLVideoElement
  console.log('Video loaded in CategoriesSection:', video.src)
  // Asegurar que el video se reproduzca
  video.play().catch((error) => {
    console.log('Error playing video:', error)
  })
}

onMounted(() => {
  // No se necesita lógica adicional para el video
})

onUnmounted(() => {
  // No se necesita cleanup para el video
});

const categories = [
  {
    key: "mix",
    title: "Mezcla",
    subtitle: "Recomendaciones combinadas multi‑género",
    image: "/landingImages/mix.png",
    badge: { text: "Nuevo", variant: "orange" },
  },
  {
    key: "songs",
    title: "Canciones",
    subtitle: "Ejemplo: Stay With Me",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-W0mpYQjz6o5o3ZqX1xLvldzpctwOd4.png",
    badge: { text: "Top", variant: "pink" },
  },
  {
    key: "artist",
    title: "Artistas",
    subtitle: "Descubre artistas cercanos a tu gusto",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-MgaTJsXIsgFtM80qTOcWgfRaN0pR9i.png",
    badge: { text: "Explorar", variant: "indigo" },
  },
  {
    key: "albums",
    title: "Álbumes",
    subtitle: "Vida y Muerte de Can",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-q8SwG2nu7aHg3SCfuiY0Nvuv30W7Pi.png",
    badge: { text: "Nuevo", variant: "orange" },
  },
  {
    key: "movies",
    title: "Películas",
    subtitle: "Selección curada para tu mood",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image.png-tEZMccN6Z3SL58oChNwG2zQaxm6bP2.jpeg",
    badge: { text: "Clásicos", variant: "pink" },
  },
    {
    key: "series",
    title: "Series TV",
    subtitle: "Maratones a tu medida",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Tr6ruKQDQxDzaPFnH2kUYNqGbTZre5.png",
    badge: { text: "Tendencia", variant: "indigo" },
  },
  {
    key: "videogames",
    title: "Videojuegos",
    subtitle: "Aventuras para explorar",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-hIKnLq4uaZpqGvo1RoBSrQoNwTrrfc.png",
    badge: { text: "Nuevo", variant: "orange" },
  },
  {
    key: "books",
    title: "Libros",
    subtitle: "Historias que te atrapan",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gQzi85u4mZ4CuyHCRBoPIZY3TQll3z.png",
    badge: { text: "Colecciones", variant: "pink" },
  },
]
</script>
