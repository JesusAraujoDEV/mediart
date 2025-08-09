<template>
  <div class="w-full text-center space-y-5">
    <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white break-words leading-tight max-w-[85vw] sm:max-w-sm md:max-w-md mx-auto">@{{ username }}</h2>
    <!-- Share actions -->
    <div class="flex items-center justify-center mt-1">
      <button
        class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs sm:text-sm font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
        @click="shareOrCopy"
        aria-label="Share profile"
      >
        <Icon name="material-symbols:share" size="18" />
        <span>Share</span>
      </button>
    </div>
    <p v-if="bio" class="text-sm sm:text-base text-gray-300 leading-relaxed max-w-[85vw] sm:max-w-sm mx-auto">{{ bio }}</p>
    <div class="space-y-3">
      <p v-if="email" class="text-sm text-gray-400">{{ email }}</p>
      <p class="text-sm text-gray-500">Joined {{ createdAtFormatted }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { showNotification } from '~/utils/notification'

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

// Share helpers
const route = useRoute()
const isClient = typeof window !== 'undefined'
const currentUrl = computed(() => {
  if (!isClient) return ''
  try {
    return `${window.location.origin}${route.fullPath}`
  } catch {
    return ''
  }
})

async function copyLink() {
  const url = currentUrl.value
  if (!url) return
  try {
    await navigator.clipboard.writeText(url)
    showNotification('Link copied', 'Profile URL copied to clipboard', 'success')
  } catch {
    showNotification('Could not copy', 'Please copy the link manually', 'error')
  }
}

async function shareOrCopy() {
  const url = currentUrl.value
  if (!url) return
  const title = props.username ? `@${props.username} on Mediart` : 'Mediart Profile'
  const text = 'Check out this profile!'
  try {
    if (isClient && 'share' in navigator) {
      await (navigator as any).share({ title, text, url })
      return
    }
  } catch {
    // Fallback to copy below
  }
  await copyLink()
}
</script>