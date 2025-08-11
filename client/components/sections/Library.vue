<template>
  <section class="w-2/3 glassEffect overflow-y-scroll h-full rounded-lg max-md:min-h-screen max-md:w-full p-6 custom-main-scroll">
    <h2 class="text-4xl font-extrabold mb-8 text-center">Mis Playlists Guardadas</h2>

    <!-- Search Bar -->
    <div class="mb-6">
      <div class="relative">
        <input 
          v-model.trim="searchQuery" 
          type="text" 
          placeholder="Buscar playlist por nombre..."
          class="w-full bg-gray-800/70 border border-gray-600 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
        <Icon name="material-symbols:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size="20" />
        <button 
          v-if="searchQuery" 
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <Icon name="material-symbols:close" size="20" />
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      <p class="mt-4 text-gray-300">Cargando playlists...</p>
    </div>

    <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
      <p class="text-red-400 mb-4">{{ error }}</p>
        <button @click="fetchPlaylists" class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer">Reintentar</button>
    </div>

    <!-- Playlists List -->
    <div v-else-if="displayPlaylists.length > 0" class="space-y-4">
      <div 
        v-for="playlist in displayPlaylists" 
        :key="playlist.id"
        @click="viewPlaylist(playlist)"
        class="bg-gray-800/70 rounded-xl p-4 cursor-pointer hover:bg-gray-700/80 transition-all duration-200 border border-gray-600"
      >
        <div class="flex gap-4">
          <!-- Playlist Image -->
          <div class="w-20 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
            <img loading="lazy" decoding="async"
              :src="coverCandidates(playlist)[0]"
              :data-alt-src="coverCandidates(playlist)[1] || ''"
              :alt="playlist.name || 'Playlist cover'"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </div>

          <!-- Playlist Info -->
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-bold text-white truncate">{{ playlist.name }}</h3>
            <p v-if="playlist.description" class="text-gray-300 text-sm mt-1 line-clamp-2">
              {{ playlist.description }}
            </p>
            <p class="text-xs text-gray-400 mt-2">
              Colaborativa: {{ playlist.isCollaborative ? 'Sí' : 'No' }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-2">
            <button 
              v-if="canRemovePlaylist(playlist)"
              @click.stop="removePlaylist(playlist)"
              :disabled="removingPlaylist === playlist.id"
              class="bg-gray-700 hover:bg-gray-600 text-white font-bold text-sm px-3 py-1 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Icon name="material-symbols:delete" size="16" />
            </button>
            <button 
              @click.stop="viewPlaylist(playlist)"
              :disabled="loadingPlaylist === playlist.id"
              class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-sm px-3 py-1 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Ver más
            </button>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMorePlaylists" class="text-center mt-6">
        <button @click="loadMore" class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer">Cargar más</button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <p class="text-gray-400 text-lg">
        {{ searchQuery ? 'No se encontraron playlists' : 'Tu biblioteca está vacía' }}
      </p>
      <p v-if="!searchQuery" class="text-gray-500 text-sm mt-2">
        Guarda algunas playlists desde las recomendaciones
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Playlist } from '~/types/Playlist'
import { getCache, setCache } from '~/utils/cache'

// Composables
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()

// State
const playlists = ref<Playlist[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const removingPlaylist = ref<number | null>(null)
const loadingPlaylist = ref<number | null>(null)
const currentPage = ref(1)
const hasMore = ref(true)
const itemsPerPage = 10

// Computed
const filteredPlaylists = computed(() => {
  if (!searchQuery.value) return playlists.value
  const query = searchQuery.value.toLowerCase()
  return playlists.value.filter(p => p.name.toLowerCase().includes(query))
})

const displayPlaylists = computed(() => {
  const startIndex = 0
  const endIndex = currentPage.value * itemsPerPage
  return filteredPlaylists.value.slice(startIndex, endIndex)
})

const hasMorePlaylists = computed(() => {
  return displayPlaylists.value.length < filteredPlaylists.value.length
})

const username = computed(() => route.params.username as string)
const currentUser = computed(() => {
  try {
    const cacheKey = `savedPlaylists:${username.value}`
    const cached = getCache<Playlist[]>(cacheKey)
    if (cached && cached.length) {
      playlists.value = cached
      // No early return: continuamos para refrescar en background
    }
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
})

// Methods
const fetchPlaylists = async () => {
  if (loading.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No hay token de autenticación')

    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } as const

    const response = await fetch(
      `${config.public.backend}/api/users/by-username/${username.value}?include=savedPlaylists`,
      { headers: authHeaders }
    )
    
    if (!response.ok) throw new Error('Error al cargar playlists')
    
    const data = await response.json()
    const fresh = (data.savedPlaylists || []).reverse() as Playlist[]
    playlists.value = fresh
    // Cache 2 minutos
    setCache(`savedPlaylists:${username.value}`, fresh, 2 * 60 * 1000)
    
  } catch (err: any) {
    error.value = err.message || 'Error inesperado'
  } finally {
    loading.value = false
  }
}

const viewPlaylist = async (playlist: Playlist) => {
  if (loadingPlaylist.value === playlist.id) return
  
  loadingPlaylist.value = playlist.id
  try {
    await router.push(`/studio/playlists/${playlist.id}`)
  } catch (err) {
    console.error('Error al navegar:', err)
  } finally {
    loadingPlaylist.value = null
  }
}

const removePlaylist = async (playlist: Playlist) => {
  if (removingPlaylist.value === playlist.id) return

  // Confirmación bonita
  const result = await import('sweetalert2').then(({ default: Swal }) =>
    Swal.fire({
      title: '¿Quitar esta playlist?',
      html: `<div class="text-left"><p class='mb-2'>Se eliminará de tu biblioteca.</p><p class='text-sm text-gray-400'>${playlist.name}</p></div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
      backdrop: true,
    })
  )

  if (!result.isConfirmed) return

  removingPlaylist.value = playlist.id
  try {
    const { error: fetchError } = await useFetch(
      `${config.public.backend}/api/profile/saved-playlists/${playlist.id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (fetchError.value) throw new Error('Error al quitar playlist')

    playlists.value = playlists.value.filter(p => p.id !== playlist.id)

    // Éxito bonito
    await import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire({
        title: 'Eliminada',
        text: 'La playlist fue quitada de tu biblioteca.',
        icon: 'success',
        timer: 1600,
        showConfirmButton: false,
        position: 'top-end',
        toast: true,
      })
    )
  } catch (err: any) {
    console.error('Error:', err)
    await import('sweetalert2').then(({ default: Swal }) =>
      Swal.fire('Error', err.message || 'No se pudo quitar la playlist', 'error')
    )
  } finally {
    removingPlaylist.value = null
  }
}

const canRemovePlaylist = (playlist: Playlist) => {
  return currentUser.value.username === username.value || playlist.ownerUserId === currentUser.value.id
}

const PLACEHOLDER = '/resources/plPreview.webp'
const resolveUrl = (url?: string | null) => {
  const value = (url ?? '').toString().trim()
  if (!value) return ''
  return value.startsWith('http') ? value : `${config.public.backend}${value}`
}

const coverCandidates = (p: Playlist): string[] => {
  const candidates = [
    resolveUrl(p.playlistCoverUrl),
    resolveUrl(p.imgbbDeleteUrl),
  ].filter(Boolean) as string[]
  return candidates.length > 0 ? candidates : [PLACEHOLDER]
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (!img) return
  const alt = img.getAttribute('data-alt-src') || ''
  // Only allow safe URLs (http, https, or relative paths not starting with dangerous schemes)
  const isSafeUrl = alt && (
    alt.startsWith('http://') ||
    alt.startsWith('https://') ||
    (/^[/.a-zA-Z0-9_-]+$/.test(alt) && !alt.startsWith('javascript:') && !alt.startsWith('data:') && !alt.startsWith('vbscript:'))
  )
  if (isSafeUrl && img.src !== alt) {
    img.src = alt
    img.setAttribute('data-alt-src', '')
    return
  }
  if (!img.src.includes(PLACEHOLDER)) img.src = PLACEHOLDER
}

const loadMore = () => {
  currentPage.value++
}

// Watchers
watch(searchQuery, () => {
  currentPage.value = 1
})

// Reset pagination when playlists change
watch(playlists, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  fetchPlaylists()
})
</script>

<style scoped>
.custom-main-scroll::-webkit-scrollbar {
  width: 8px;
}

.custom-main-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.custom-main-scroll::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.5);
  border-radius: 10px;
}

.custom-main-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(150, 150, 150, 0.7);
}
</style>
