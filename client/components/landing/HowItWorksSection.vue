<template>
  <section
    aria-labelledby="how-it-works-title"
    class="relative w-full min-h-screen py-16 md:py-24 overflow-hidden text-white"
  >
    <!-- Fondo NEAT (3D gradient con tres.js) -->
    <canvas ref="neatHost" class="absolute inset-0 -z-10 pointer-events-none w-full h-full" />

    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12 md:mb-16">
        <div class="flex items-center justify-center">
          <span
            class="uppercase tracking-[0.18em] rounded-full px-3 py-1 text-[10px]"
            :style="pillStyle"
          >
            Cómo Funciona
          </span>
        </div>

        <h2
          id="how-it-works-title"
          class="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight uppercase tracking-tight"
          :style="{ color: hexA('#FFFFFF', 0.96) }"
        >
          Empieza con Mediart, tu Asistente de Arte con IA
        </h2>
        <p class="mt-4 text-sm sm:text-base max-w-3xl mx-auto" :style="{ color: hexA('#FFFFFF', 0.75) }">
          Descubre, organiza y gestiona contenido creativo en tres pasos sencillos. Desde el registro, pasando por tus gustos,
          hasta recomendaciones y colecciones personalizadas.
        </p>
      </div>

      <!-- Grid de pasos (estructura conservada) -->
      <div class="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
        <!-- Paso 1 -->
        <div class="overflow-hidden rounded-xl p-6 backdrop-blur-sm border shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]" :style="cardStyle">
          <div class="pt-2">
            <span class="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] rounded-full px-3 py-1" :style="pillStyle">
              Step <span class="font-mono">1</span> <CheckIcon class="h-3.5 w-3.5" />
            </span>
          </div>
          <div class="pb-2 mt-3">
            <h3 class="flex items-center gap-2 font-semibold text-lg" :style="{ color: hexA('#FFFFFF', 0.9) }">
              <UserPlusIcon class="h-5 w-5" :style="{ color: hexA('#FFFFFF', 0.72) }" />
              Crea tu cuenta
            </h3>
          </div>
          <div class="space-y-4">
            <div class="space-y-2">
              <div class="h-10 w-full rounded-md px-3 flex items-center" :style="ghostInputStyle">Nombre de usuario</div>
              <div class="h-10 w-full rounded-md px-3 flex items-center" :style="ghostInputStyle">Correo electrónico</div>
              <div class="h-10 w-full rounded-md px-3 flex items-center" :style="ghostInputStyle">Contraseña</div>
            </div>
            <p class="text-sm" :style="{ color: hexA('#FFFFFF', 0.72) }">
              Regístrate y gestiona tu perfil para empezar a personalizar tu experiencia.
            </p>
          </div>
        </div>

        <!-- Paso 2 -->
        <div class="overflow-hidden rounded-xl p-6 backdrop-blur-sm border shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]" :style="cardStyle">
          <div class="pt-2">
            <span class="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] rounded-full px-3 py-1" :style="pillStyle">
              Step <span class="font-mono">2</span> <CheckIcon class="h-3.5 w-3.5" />
            </span>
          </div>
          <div class="pb-2 mt-3">
            <h3 class="flex items-center gap-2 font-semibold text-lg" :style="{ color: hexA('#FFFFFF', 0.9) }">
              <TagsIcon class="h-5 w-5" :style="{ color: hexA('#FFFFFF', 0.72) }" />
              Añade gustos y elige tipos
            </h3>
          </div>
          <div class="space-y-4">
            <div class="h-10 w-full rounded-md px-3 flex items-center justify-between" :style="ghostInputStyle">
              <span class="truncate" :style="{ color: hexA('#FFFFFF', 0.64) }">Selecciona una categoría</span>
              <ChevronDown class="h-5 w-5" :style="{ color: hexA('#FFFFFF', 0.64) }" />
            </div>
            <div class="h-10 w-full rounded-md px-3 flex items-center" :style="ghostInputStyle">
              <SearchIcon class="h-5 w-5 mr-2" />
              <span class="truncate" :style="{ color: hexA('#FFFFFF', 0.64) }">Busca tus artistas, películas, etc...</span>
            </div>
            <div class="h-10 w-full rounded-md px-3 flex items-center justify-between" :style="ghostInputStyle">
              <span class="truncate" :style="{ color: hexA('#FFFFFF', 0.64) }">¿Qué te gustaría recibir?</span>
              <ChevronDown class="h-5 w-5" :style="{ color: hexA('#FFFFFF', 0.64) }" />
            </div>
            <p class="text-sm" :style="{ color: hexA('#FFFFFF', 0.72) }">
              Selecciona gustos y el tipo de recomendaciones que deseas.
            </p>
          </div>
        </div>

        <!-- Paso 3 -->
        <div class="overflow-hidden rounded-xl p-6 backdrop-blur-sm border shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]" :style="cardStyle">
          <div class="pt-2">
            <span class="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] rounded-full px-3 py-1" :style="pillStyle">
              Step <span class="font-mono">3</span> <CheckIcon class="h-3.5 w-3.5" />
            </span>
          </div>
          <div class="pb-2 mt-3">
            <h3 class="flex items-center gap-2 font-semibold text-lg whitespace-nowrap" :style="{ color: hexA('#FFFFFF', 0.9) }">
              <LibraryIcon class="h-5 w-5" :style="{ color: hexA('#FFFFFF', 0.72) }" />
              Recibe y organiza recomendaciones
            </h3>
          </div>
          <div class="space-y-4">
            <div class="space-y-2">
              <div
                v-for="(collection, i) in collections"
                :key="i"
                class="w-full rounded-md p-3 border"
                :style="collectionItemStyle"
              >
                <div class="text-sm" :style="{ color: hexA('#FFFFFF', 0.92) }">{{ collection.title }}</div>
                <div class="text-xs" :style="{ color: hexA('#FFFFFF', 0.66) }">{{ collection.meta }}</div>
              </div>
            </div>
            <p class="text-sm" :style="{ color: hexA('#FFFFFF', 0.72) }">
              Guarda contenido en tus colecciones y consúltalo cuando quieras.
            </p>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="mt-10 md:mt-14 flex justify-center">
        <div
          class="pointer-events-none w-full max-w-5xl h-px rounded-full"
          :style="{ background: `linear-gradient(90deg, transparent, ${hexA(colors.step,0.35)}, ${hexA(colors.step,0.35)}, transparent)` }"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Check as CheckIcon,
  Tags as TagsIcon,
  UserPlus as UserPlusIcon,
  Library as LibraryIcon,
  Search as SearchIcon,
  ChevronDown,
} from 'lucide-vue-next'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { NeatGradient, type NeatConfig } from '@firecms/neat'

// Lógica del Neat Gradient integrada en el componente principal
const neatHost = ref<HTMLCanvasElement | null>(null)
let neat: NeatGradient | null = null

onMounted(() => {
  if (!neatHost.value) return
  const defaultConfig: NeatConfig = {
    colors: [
      { color: '#e01e2f', enabled: true },  // rojo
      { color: '#1c6abd', enabled: true },  // azul
    ],
    speed: 4,
    horizontalPressure: 3,
    verticalPressure: 4,
    waveFrequencyX: 3,
    waveFrequencyY: 3,
    waveAmplitude: 8,
    shadows: 1,
    highlights: 5,
    colorBrightness: 1,
    colorSaturation: 7,
    wireframe: false,
    colorBlending: 8,
    backgroundColor: '#0b1418', // Fondo oscuro para la sección
    backgroundAlpha: 1,
    grainScale: 3,
    grainIntensity: 0.3,
    grainSpeed: 1,
  }

  neat = new NeatGradient({
    ref: neatHost.value,
    ...defaultConfig,
  })
})

onBeforeUnmount(() => {
  if (neat) neat.destroy()
})

type Collection = { title: string; meta: string }
const collections: Collection[] = [
  { title: 'Playlist: Neo‑Synth', meta: '12 pistas · Música' },
  { title: 'Colección: Sci‑Fi Essentials', meta: '18 títulos · Películas' },
  { title: 'Lista: Worlds & Lore', meta: '9 libros · Lectura' },
]

const colors = {
  card: '#022834',
  step: '#16a696',
}

function hexA(hex: string, alpha = 1) {
  const h = hex.replace('#', '')
  const bigint = parseInt(h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const cardStyle = {
  background: colors.card,
  border: `1px solid ${hexA(colors.step, 0.18)}`,
}

const ghostInputStyle = {
  background: hexA('#000000', 0.12),
  border: `1px solid ${hexA(colors.step, 0.16)}`,
  color: hexA('#FFFFFF', 0.66),
}

const collectionItemStyle = {
  background: hexA('#000000', 0.14),
  borderColor: hexA(colors.step, 0.18),
}

const pillStyle = {
  background: hexA(colors.step, 0.26),
  color: hexA('#FFFFFF', 0.9),
  border: `1px solid ${hexA(colors.step, 0.32)}`,
}
</script>
