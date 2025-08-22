<template>
  <section
    ref="sectionRef"
    aria-labelledby="categories-title"
    class="relative w-full min-h-screen py-16 md:py-24 overflow-hidden"
  >
    <!-- Fondo NEAT (3D gradient con tres.js) -> render only when ready -->
    <canvas
      v-if="neatReady && !prefersReduced"
      ref="neatHost"
      class="absolute inset-0 z-0 pointer-events-none w-full h-full"
      aria-hidden="true"
    />
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

let neat: any = null
const neatHost = ref<HTMLCanvasElement | null>(null)
const sectionRef = ref<HTMLElement | null>(null)
const neatReady = ref(false)
const neatActive = ref(false)
const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

async function createNeat() {
  if (typeof window === 'undefined') return;
  if (!neatHost.value || neat) return;

  const defaultConfig = {
    colors: [
      { color: '#FF5373', enabled: true },
      { color: '#17E7FF', enabled: true },
      { color: '#FFC858', enabled: true },
      { color: '#6D3BFF', enabled: true },
    ],
    // tuned for lower CPU/GPU
    speed: 2,
    horizontalPressure: 3,
    verticalPressure: 3,
    waveFrequencyX: 1.5,
    waveFrequencyY: 1,
    waveAmplitude: 4,
    shadows: 0,
    highlights: 0,
    colorBrightness: 0.95,
    colorSaturation: 0,
    wireframe: false,
    colorBlending: 6,
    backgroundColor: '#003FFF',
    backgroundAlpha: 1,
    grainScale: 3,
    grainSparsity: 1,
    grainIntensity: 0,
    grainSpeed: 0.8,
    resolution: 0.7,
    yOffset: 0,
  };

  const init = async () => {
    try {
      const mod = await import('@firecms/neat');
      const NeatGradientCtor = (mod && (mod.NeatGradient || mod.default)) as any;
      if (!NeatGradientCtor) return;
      neat = new NeatGradientCtor({ ref: neatHost.value as HTMLCanvasElement, ...defaultConfig } as any);
    } catch (e) {
      // ignore errors in client init
    }
  }

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => init(), { timeout: 500 });
  } else {
    setTimeout(() => init(), 200);
  }
}

function destroyNeat() {
  try {
    neat?.destroy();
  } catch (e) {
    // ignore
  }
  neat = null;
}

let io: IntersectionObserver | null = null
onMounted(() => {
  if (prefersReduced) return;

  io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const visible = entry.intersectionRatio >= 0.25
      neatActive.value = visible
      if (visible) {
        neatReady.value = true
        createNeat()
      } else {
        destroyNeat()
        setTimeout(() => { if (!neat) neatReady.value = false }, 300)
      }
    })
  }, { threshold: [0, 0.25, 0.5] })

  if (sectionRef.value && io) io.observe(sectionRef.value)

  // if already visible on mount, init
  try {
    if (sectionRef.value) {
      const rect = sectionRef.value.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      if (rect.top < vh * 0.9) {
        neatActive.value = true
        neatReady.value = true
        createNeat()
      }
    }
  } catch (e) {}
})

onUnmounted(() => {
  if (io && sectionRef.value) io.unobserve(sectionRef.value)
  if (io) io.disconnect()
  destroyNeat()
});

// Expose force init for debugging
(function expose() {
  try {
    (window as any).__mediart_forceInitNeat = () => {
      if (prefersReduced) return
      neatReady.value = true
      createNeat()
    }
  } catch (e) {}
})();

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
