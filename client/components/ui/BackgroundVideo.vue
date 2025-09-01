<template>
  <ClientOnly>
    <div ref="root" class="absolute inset-0" :class="zClass" aria-hidden="true">
      <video
        v-if="shouldLoad && !reduced"
        :autoplay="true"
        :muted="true"
        :loop="true"
        playsinline
        preload="metadata"
        class="pointer-events-none w-full h-full object-cover"
        :style="videoStyle"
        @loadeddata="onLoaded"
        @error="onError"
      >
        <source :src="src" type="video/mp4" />
      </video>
      <img v-else-if="poster" :src="poster" alt="" class="pointer-events-none w-full h-full object-cover" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
// Update the import path to a relative path if the file exists locally
import { useReducedMotion } from '../../composables/useReducedMotion'

const props = defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: '' },
  brightness: { type: Number, default: 0.8 },
  zIndex: { type: String, default: '-z-10' },
})

const { reduced } = useReducedMotion()
const root = ref<HTMLElement | null>(null)
const shouldLoad = ref(false)
let io: IntersectionObserver | null = null

const zClass = computed(() => props.zIndex)
const videoStyle = computed(() => ({ filter: `brightness(${props.brightness})` }))

onMounted(() => {
  // Usar nextTick para esperar a que ClientOnly renderice
  nextTick(() => {
    if (!root.value) return

    // Forzar carga inmediata
    shouldLoad.value = true

    // Configurar IntersectionObserver como respaldo
    io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        shouldLoad.value = true
        if (io) {
          io.disconnect()
          io = null
        }
      }
    }, { threshold: 0.1 })
    io.observe(root.value)
  })
})

onBeforeUnmount(() => {
  if (io) {
    io.disconnect()
    io = null
  }
})

function onLoaded(e: Event) {
  const el = e.target as HTMLVideoElement

  // Intentar reproducir automáticamente
  el.play().catch(() => {
    // Agregar listener para reproducir en primera interacción del usuario
    const playOnInteraction = () => {
      el.play().catch(() => {})
      document.removeEventListener('click', playOnInteraction)
      document.removeEventListener('touchstart', playOnInteraction)
    }

    document.addEventListener('click', playOnInteraction)
    document.addEventListener('touchstart', playOnInteraction)
  })
}

function onError(e: Event) {
  // Error handling - video failed to load
}
</script>

<style scoped>
/* No styles needed; container inherits positioning from parent */
</style>
