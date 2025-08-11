<template>
  <div class="w-full text-center space-y-5">
    <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white break-words leading-tight max-w-[85vw] sm:max-w-sm md:max-w-md mx-auto">@{{ username }}</h2>
    <!-- Share actions -->
    <div class="flex items-center justify-center mt-1">
      <button
        class="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transform hover:scale-105"
        @click="shareOrCopy"
        aria-label="Share profile"
      >
        <Icon name="material-symbols:share" size="20" />
        <span>Share Profile</span>
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
import { computed, onMounted } from 'vue'
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

// Función para generar mensaje llamativo
function generateShareMessage(): { title: string; text: string } {
  const username = props.username || 'User'
  const bio = props.bio || 'Check out this amazing profile!'
  
  return {
    title: `🎵 @${username} on Mediart`,
    text: `🌟 ${bio}\n\n🎭 Discover amazing movies, music, books and more!\n\n📱 Join Mediart and explore the world of entertainment together!\n\n🔗 Check out this profile:`
  }
}



async function copyLink() {
  const url = currentUrl.value
  if (!url) return
  try {
    await navigator.clipboard.writeText(url)
    showNotification('✅ Link Copied!', 'Profile URL copied to clipboard successfully!', 'success')
  } catch {
    showNotification('❌ Could not copy', 'Please copy the link manually', 'error')
  }
}

async function copyFullMessage() {
  const url = currentUrl.value
  if (!url) return
  
  const { title, text } = generateShareMessage()
  const fullMessage = `${title}\n\n${text}\n\n${url}`
  
  try {
    await navigator.clipboard.writeText(fullMessage)
    showNotification('✅ Message Copied!', 'Complete share message copied to clipboard!', 'success')
  } catch {
    showNotification('❌ Could not copy', 'Please copy the message manually', 'error')
  }
}

async function shareOrCopy() {
  const url = currentUrl.value
  if (!url) return
  
  const { title, text } = generateShareMessage()
  
  try {
    if (isClient && 'share' in navigator) {
      await (navigator as any).share({ 
        title, 
        text: `${text}\n\n${url}`, 
        url 
      })
      return
    }
  } catch {
    // Fallback to copy below
  }
  
  // En computadora, copiar mensaje completo
  await copyFullMessage()
}



// Agregar metadatos para WhatsApp y otras plataformas
onMounted(() => {
  if (isClient && props.username) {
    const url = currentUrl.value
    
    if (url) {
      // Actualizar título de la página
      document.title = `@${props.username} - Mediart Profile`
      
      // Agregar metadatos Open Graph para WhatsApp
      const metaTags = [
        { property: 'og:title', content: `@${props.username} on Mediart` },
        { property: 'og:description', content: props.bio || 'Check out this amazing profile on Mediart! Discover movies, music, books and more.' },
        { property: 'og:image', content: '/mediart/mediartLogo.webp' },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'profile' },
        { property: 'og:site_name', content: 'Mediart' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `@${props.username} on Mediart` },
        { name: 'twitter:description', content: props.bio || 'Check out this amazing profile on Mediart! Discover movies, music, books and more.' },
        { name: 'twitter:image', content: '/mediart/mediartLogo.webp' },
        { name: 'twitter:url', content: url }
      ]
      
      metaTags.forEach(tag => {
        let meta = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`)
        if (!meta) {
          meta = document.createElement('meta')
          if (tag.property) {
            meta.setAttribute('property', tag.property)
          } else if (tag.name) {
            meta.setAttribute('name', tag.name)
          }
          document.head.appendChild(meta)
        }
        meta.setAttribute('content', tag.content)
      })
    }
  }
})
</script>
