<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <img
      :src="resolvedSrc"
      @error="handleImageError"
      :alt="loading ? 'Cargando perfil...' : 'Profile'"
      class="size-36 rounded-full object-cover"
    />
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
}
</script>