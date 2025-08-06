<template>
  <div class="w-full text-center space-y-5">
    <h2 class="text-4xl font-bold text-white">@{{ username }}</h2>
    <p v-if="bio" class="text-base text-gray-300 leading-relaxed max-w-sm mx-auto">{{ bio }}</p>
    <div class="space-y-3">
      <p v-if="email" class="text-sm text-gray-400">{{ email }}</p>
      <p class="text-sm text-gray-500">Joined {{ createdAtFormatted }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  username?: string
  bio?: string | null
  email?: string | null
  createdAt?: string | null
}>()

function formatDate(input?: string | null): string {
  if (!input) return '—'
  const d = new Date(input)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
}

const createdAtFormatted = computed(() => formatDate(props.createdAt))
</script>