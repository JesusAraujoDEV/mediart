<template>
  <div class="w-full text-center">
    <h2 class="text-xl font-semibold">@{{ username }}</h2>
    <p v-if="bio" class="text-sm text-gray-300 mt-1 break-words">{{ bio }}</p>
    <p class="text-xs text-gray-500 mt-1">Joined {{ createdAtFormatted }}</p>
    <p v-if="email" class="text-xs text-gray-500 mt-1">{{ email }}</p>
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