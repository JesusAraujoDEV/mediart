<template>
  <div class="flex flex-col items-center gap-6 w-full">
    <div class="relative">
      <img 
        :src="resolvedSrc" 
        @error="handleImageError" 
        :alt="loading ? 'Cargando perfil...' : 'Profile'"
        class="size-40 rounded-full object-cover border-4 border-white/20 shadow-xl hover:border-white/40 transition-all duration-300" 
      />
      <div v-if="loading" class="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  avatarUrl: string | null | undefined
  backendBase?: string
  loading?: boolean
}>()

// Only crop circularly; no pulse. Compute src per your snippet rules.
const PLACEHOLDER = '/avatar-default.svg'
const resolvedSrc = computed(() => {
  // Si está cargando, mostrar placeholder
  if (props.loading) {
    return PLACEHOLDER
  }
  
  const url = (props.avatarUrl ?? '').toString().trim()
  if (url) {
    return url.startsWith('http') ? url : `${props.backendBase ?? ''}${url}`
  }
  return PLACEHOLDER
})

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  if (img && !img.src.includes(PLACEHOLDER)) {
    img.src = PLACEHOLDER
  }
  console.warn('Error loading profile image, using placeholder')
}
</script>