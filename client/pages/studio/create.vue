<template>
    <title>MediartStudio - Crear Playlist</title>
    <main class="w-screen h-fit min-h-dvh flex flex-col items-center justify-start p-4 text-white overflow-x-hidden">
      <NavigationStudio data-tutorial="navbar" />
        
      <div class="flex flex-col flex-grow w-full max-w-5xl mt-24 md:mt-28 pb-8 gap-8 md:gap-10">
        
        <section class="flex flex-col gap-6">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600/80 border border-purple-500 shadow-lg">
              <span class="text-2xl font-bold">1</span>
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">Detalles de la Playlist</h1>
              <p class="text-sm text-gray-400">Dale un nombre y personalidad a tu nueva creación.</p>
            </div>
            <button @click="startTutorial" 
              class="glassEffect hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2 text-white hover:scale-110 transform border border-purple-400/30 hover:border-purple-300/50 backdrop-blur-sm py-2 px-4 rounded-full font-semibold text-sm ml-auto"
              data-tutorial="tutorial-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              Tutorial
            </button>
          </div>
  
          <div class="glassEffect bg-gray-800/60 rounded-xl p-6 shadow-2xl border border-gray-700">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-2">
                <label for="playlistName" class="block text-sm font-semibold text-gray-200 mb-2">Nombre *</label>
                <input id="playlistName" v-model="playlistForm.name" type="text" placeholder="Ej. Noches de Lofi para programar"
                  class="w-full px-4 py-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  data-tutorial="playlist-name"
                />
              </div>
              
              <div class="flex items-end">
                  <label for="collab" class="flex items-center w-full h-full gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/10 transition-colors duration-300 border border-transparent">
                    <input id="collab" v-model="playlistForm.isCollaborative" type="checkbox"
                      class="w-5 h-5 appearance-none bg-gray-700 border-2 border-gray-600 rounded-md checked:bg-purple-600 checked:border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 cursor-pointer" />
                    <span class="font-semibold text-gray-200 select-none">Colaborativa</span>
                  </label>
              </div>
  
              <div class="md:col-span-3">
                <label for="playlistDesc" class="block text-sm font-semibold text-gray-200 mb-2">Descripción</label>
                <textarea id="playlistDesc" v-model="playlistForm.description" rows="3" placeholder="Describe el ambiente o propósito de esta playlist..."
                  class="w-full px-4 py-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  data-tutorial="playlist-description"></textarea>
              </div>
            </div>
          </div>
        </section>
  
        <section class="flex flex-col gap-6">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-12 h-12 rounded-full bg-purple-600/80 border border-purple-500 shadow-lg">
              <span class="text-2xl font-bold">2</span>
            </div>
            <div>
              <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight">Agrega Contenido</h2>
              <p class="text-sm text-gray-400">Busca y añade canciones, películas, libros y más.</p>
            </div>
          </div>
          
          <div class="glassEffect bg-gray-800/60 rounded-xl p-6 shadow-2xl border border-gray-700">
            <div class="flex flex-col md:flex-row items-start md:items-end gap-4 mb-6">
              <div class="flex-grow w-full">
                <label for="searchInput" class="block text-sm font-semibold text-gray-200 mb-2">Buscar ítems</label>
                <div class="relative">
                  <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  <input id="searchInput" type="text" v-model="inputValue" @input="handleInput" @focus="showDatalist = true" @blur="hideDatalist"
                    @keydown.enter.prevent="addTagFromInput" @keydown.tab.prevent="addTagFromInput"
                    :placeholder="getSearchPlaceholder()"
                    class="w-full pl-11 pr-4 py-3 rounded-lg bg-gray-700/80 border border-gray-600 text-white placeholder-gray-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    data-tutorial="search-input" />
                </div>
  
                <Transition name="fade-slide-down">
                  <ul v-if="showDatalist && filteredSuggestions.length > 0"
                    class="absolute z-10 w-full max-w-2xl bg-gray-800/90 backdrop-blur-lg rounded-lg mt-2 max-h-60 overflow-y-auto shadow-2xl border border-gray-700">
                    <li v-for="s in filteredSuggestions" :key="s.title + (s.externalId || '')"
                      @mousedown.prevent="selectSuggestion(s)"
                      @click="addItem(s)"
                      class="flex items-center gap-3 p-3 hover:bg-purple-600/20 hover:border-purple-500/30 transition-all duration-200 cursor-pointer border border-transparent rounded-lg group">
                      <img v-if="s.coverUrl" :src="s.coverUrl" :alt="s.title" loading="lazy" decoding="async"
                        class="w-10 h-10 object-cover rounded-md border border-gray-600 flex-shrink-0" />
                      <div v-else class="w-10 h-10 bg-gray-600 rounded-md flex items-center justify-center text-gray-400 text-lg font-bold flex-shrink-0">?</div>
                      
                      <div class="flex-1 min-w-0">
                        <div class="font-semibold truncate text-white group-hover:text-purple-200 transition-colors duration-200">{{ s.title }}</div>
                        <div class="text-xs text-gray-400 group-hover:text-gray-300 truncate capitalize transition-colors duration-200">{{ s.type }} <span v-if="s.description" class="opacity-70">- {{ s.description }}</span></div>
                      </div>

                      <!-- Indicador visual de que se puede agregar -->
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <svg class="w-3 h-3 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </div>
                        
                        <button class="pl-3 pr-2 py-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs flex items-center gap-1 transition-all duration-300 hover:scale-105 opacity-0 group-hover:opacity-100"
                          @click.stop="() => { 
                          addItem(s); 
                        }">
                          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          Añadir
                        </button>
                      </div>
                    </li>
                  </ul>
                </Transition>
              </div>
  
              <div class="w-full md:w-44 flex-shrink-0">
                <label for="itemType" class="block text-sm font-semibold text-gray-200 mb-2">Filtrar por tipo</label>
                <select id="itemType" v-model="searchType" @change="onChangeSearchType"
                  class="w-full p-3 rounded-lg bg-gray-700/80 text-white border border-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer appearance-none bg-no-repeat bg-right-3"
                  style="background-image: url('data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%239CA3AF%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22/%3E%3C/svg%3E');"
                  data-tutorial="item-type">
                  <option value="general">Todo</option>
                  <option value="song">Canciones</option>
                  <option value="artist">Artistas</option>
                  <option value="album">Álbumes</option>
                  <option value="movie">Películas</option>
                  <option value="tvshow">Series</option>
                  <option value="book">Libros</option>
                  <option value="videogame">Videojuegos</option>
                </select>
              </div>
            </div>
  
            <div data-tutorial="selected-items">
              <h3 class="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center gap-3">
                <span>Ítems en tu playlist</span>
                <span v-if="selectedItems.length > 0" class="px-3 py-1 bg-purple-600/20 text-purple-300 text-sm font-bold rounded-full border border-purple-500/30">
                  {{ selectedItems.length }}
                </span>
              </h3>
              <div v-if="selectedItems.length === 0" class="text-center py-16 px-6 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-xl border-2 border-dashed border-gray-600/50">
                <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center border-2 border-dashed border-purple-500/30">
                  <svg class="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-white mb-2">Tu playlist está vacía</h3>
                <p class="text-sm text-gray-400 max-w-md mx-auto">Usa el buscador de arriba para empezar a añadir canciones, películas, libros y más contenido a tu nueva playlist.</p>
              </div>
              
              <TransitionGroup v-else name="list" tag="div" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="(item, idx) in selectedItems" :key="(item.externalId || item.title) + '-' + idx"
                  class="bg-gradient-to-br from-gray-700/80 to-gray-800/80 rounded-xl p-4 border border-gray-600/60 group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-purple-500/50">
                  <div class="flex items-start gap-4">
                    <div class="relative flex-shrink-0">
                      <img :src="item.coverUrl || '/resources/item-placeholder.webp'" :alt="item.title" loading="lazy" decoding="async"
                        class="w-16 h-16 object-cover rounded-lg border-2 border-gray-500/50 shadow-md" />
                      <div class="absolute -top-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                        {{ idx + 1 }}
                      </div>
                    </div>
                    
                    <div class="flex-1 min-w-0">
                      <h4 class="font-bold text-white text-sm leading-tight mb-1 truncate">{{ item.title }}</h4>
                      <div class="flex items-center gap-2 mb-2">
                        <span class="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs font-medium rounded-full capitalize border border-purple-500/30">
                          {{ item.type }}
                        </span>
                        <span v-if="item.description" class="text-xs text-gray-400 truncate max-w-[120px]">
                          {{ item.description }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button class="absolute top-3 right-3 p-2 rounded-full bg-red-600/80 text-white hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 shadow-lg"
                    @click="removeItem(idx)" aria-label="Quitar ítem">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </section>
  
        <div class="flex justify-end items-center gap-4 mt-4">
          <NuxtLink to="/studio" class="px-6 py-3 rounded-full text-white font-medium transition-colors duration-300 hover:bg-gray-700/80">Cancelar</NuxtLink>
          <button :disabled="!canCreate" @click="createPlaylist"
            class="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
            data-tutorial="create-button">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Crear Playlist
          </button>
        </div>
  
      </div>
    </main>
  </template>

<script setup lang="ts">
import NavigationStudio from '~/components/navigation/NavigationStudio.vue'
import { useSuggestions } from '~/composables/useSuggestions'
import { useStudioTutorial } from '~/composables/useStudioTutorial'
import type { SearchSuggestion } from '~/types/Recommendations'

// @ts-ignore
definePageMeta({
  layout: 'custom',
  middleware: ['auth-middleware']
})

const config = useRuntimeConfig()
const router = useRouter()

const playlistForm = reactive({
  name: '',
  description: '',
  isCollaborative: false,
})

const selectedItems = ref<SearchSuggestion[]>([])
const isAddingItem = ref(false)

// Composable para el tutorial interactivo
const { startTutorial } = useStudioTutorial()

// Reutilizar buscador (genérico)
const {
  inputValue,
  suggestions,
  showDatalist,
  searchType,
  filteredSuggestions,
  getSearchPlaceholder,
  fetchSuggestions,
  onInput,
  selectSuggestion,
  addTagFromInput,
  removeTag,
  hideDatalist,
  onChangeSearchType,
} = useSuggestions()

// Función personalizada para manejar la búsqueda
async function handleSearch() {
  if (inputValue.value.length < 2) {
    suggestions.value = []
    return
  }
  
  try {
    const token = localStorage.getItem('token')
    if (!token) return
    
    const url = `${config.public.backend}/api/search?q=${encodeURIComponent(inputValue.value)}&type=${encodeURIComponent(searchType.value)}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) throw new Error(`Error: ${response.statusText}`)
    
    const data = await response.json()
    console.log('Respuesta de búsqueda:', data)
    
    // Normalizar los datos de búsqueda
    if (Array.isArray(data)) {
      suggestions.value = data
    } else if (data && typeof data === 'object') {
      // Si es un objeto con categorías, aplanar
      const allItems: SearchSuggestion[] = []
      Object.values(data).forEach((category: any) => {
        if (Array.isArray(category)) {
          allItems.push(...category)
        }
      })
      suggestions.value = allItems
    } else {
      suggestions.value = []
    }
    
    console.log('Sugerencias normalizadas:', suggestions.value)
  } catch (error) {
    console.error('Error en búsqueda:', error)
    suggestions.value = []
  }
}

// Función personalizada para manejar input
function handleInput() {
  showDatalist.value = true
  if (inputValue.value.length >= 2) {
    handleSearch()
  } else {
    suggestions.value = []
  }
}

function removeItem(idx: number) {
  const removedItem = selectedItems.value[idx]
  selectedItems.value.splice(idx, 1)
  showNotification('info', `${removedItem.title} removido de la playlist`)
}

// Función para mostrar notificaciones
function showNotification(type: 'success' | 'error' | 'info', message: string) {
  // Usar SweetAlert2 para notificaciones
  import('sweetalert2').then(({ default: Swal }) => {
    Swal.fire({
      icon: type,
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    })
  })
}

const canCreate = computed(() => playlistForm.name.trim().length > 0 && selectedItems.value.length > 0)

async function createPlaylist() {
  if (!canCreate.value) return
  
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No autenticado')

    // Preparar el body con los datos correctos
    const body = {
      name: playlistForm.name.trim(),
      description: playlistForm.description.trim(),
      isCollaborative: playlistForm.isCollaborative,
      items: selectedItems.value.map(item => ({
        title: item.title,
        type: item.type || 'custom',
        coverUrl: item.coverUrl,
        externalId: item.externalId,
        description: item.description || '',
        externalSource: item.externalSource || 'custom',
        externalUrl: item.externalUrl || null,
        releaseDate: item.releaseDate || null,
        avgRating: item.avgRating || null
      }))
    }

    console.log('Enviando playlist:', body)

    const resp = await fetch(`${config.public.backend}/api/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body)
    })
    
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}))
      throw new Error(err.message || 'No se pudo crear la playlist')
    }
    
    const data = await resp.json().catch(() => ({}))

    await import('sweetalert2').then(({ default: Swal }) => Swal.fire({
      icon: 'success',
      title: '¡Playlist creada!',
      text: `"${playlistForm.name}" ha sido creada exitosamente con ${selectedItems.value.length} ítems`,
      timer: 2000,
      showConfirmButton: false
    }))

    // Redirigir a la playlist creada o al perfil
    if (data?.id) {
      router.push(`/studio/playlists/${data.id}`)
    } else {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const username = user.username || 'anonymous'
      router.push(`/profile/${username}`)
    }
  } catch (err: any) {
    console.error('Error creando playlist:', err)
    await import('sweetalert2').then(({ default: Swal }) => Swal.fire({
      icon: 'error',
      title: 'Error al crear playlist',
      text: err?.message || 'No se pudo crear la playlist. Intenta de nuevo.',
      confirmButtonText: 'Entendido'
    }))
  }
}

// Limpiar input cuando cambie el tipo de búsqueda
watch(searchType, () => {
  inputValue.value = ''
  suggestions.value = []
  showDatalist.value = false
  // Hacer una nueva búsqueda si hay texto
  if (inputValue.value.length >= 2) {
    handleSearch()
  }
})

// Función personalizada para agregar ítems a la playlist (movida aquí para asegurar scope)
function addItem(s: SearchSuggestion) {
  // Verificar que no esté ya agregado
  const isDuplicate = selectedItems.value.some(item => {
    if (item.externalId && s.externalId) {
      return item.externalId === s.externalId && item.type === s.type
    }
    return item.title.toLowerCase() === s.title.toLowerCase() && item.type === s.type
  })
  
  if (!isDuplicate) {
    // Crear una copia del ítem con todos los campos necesarios
    const newItem = {
      title: s.title,
      type: s.type || 'custom',
      coverUrl: s.coverUrl,
      externalId: s.externalId,
      description: s.description || '',
      externalSource: s.externalSource || 'custom',
      externalUrl: s.externalUrl || null,
      releaseDate: s.releaseDate || null,
      avgRating: s.avgRating || null
    }
    
    // Agregar el ítem
    selectedItems.value.push(newItem)
    
    // Limpiar input y ocultar datalist
    inputValue.value = ''
    showDatalist.value = false
    suggestions.value = []
    
    // Mostrar notificación
    showNotification('success', `${s.title} agregado a la playlist`)
  } else {
    showNotification('info', `${s.title} ya está en la playlist`)
  }
}
</script>

<style scoped>
.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
  transition: all 0.3s ease-out;
}
.fade-slide-down-enter-from,
.fade-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Transiciones para la lista de ítems */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.8);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.8);
}

.list-move {
  transition: transform 0.4s ease;
}

/* Animación para nuevos ítems */
.list-enter-active {
  transition-delay: 0.1s;
}
</style>


