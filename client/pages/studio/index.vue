<template>
  <title>MediartStudio - Inicio</title>
  <main class="w-screen md:h-dvh h-[130dvh] flex flex-col items-center justify-between p-4 text-white">
    <NavigationStudio />

    <div class="flex max-md:flex-col gap-4 items-center justify-center w-full mb-4 px-4 max-w-4xl max-md:mt-20">
      <div class="flex items-center justify-center max-md:w-full">
        <select v-model="searchType" data-tutorial="search-type"
          class="p-2 px-6 rounded-full bg-gray-700/80 w-fit text-white border border-gray-600 focus:outline-none focus:border-blue-500 shadow-md appearance-none hover:bg-gray-600/80 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer">
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

      <div class="relative flex-grow mr-3 max-md:mr-0 max-md:w-full">
        <div data-tutorial="search-bar"
          class="glassEffect shadow-xl rounded-full p-3 flex flex-wrap items-center gap-2 min-h-[48px] border border-gray-700 transition-all duration-300"
          :class="{
            'rounded-2xl': selectedTags.length > 2,
            'rounded-xl': selectedTags.length > 1 && selectedTags.length <= 2,
            'rounded-full': selectedTags.length <= 1
          }" @click="focusInput(searchInput)">
          <span v-for="tag in selectedTags" :key="tag.title"
            class="bg-white/20 rounded-full px-3 py-1 text-sm flex items-center gap-1 backdrop-blur-sm flex-shrink-0 max-w-[200px]">
            <span class="truncate">{{ tag.title }}</span>
            <button @click.stop="removeTag(tag)"
              class="text-xs cursor-pointer text-white/80 hover:text-white ml-1 flex-shrink-0">
              ✕
            </button>
          </span>
          <input ref="searchInput" type="text"
            class="bg-transparent flex-grow outline-none text-white placeholder-white/60 min-w-[120px] max-md:min-w-[80px]"
            :placeholder="getSearchPlaceholder()" v-model="inputValue" @input="onInput" @focus="showDatalist = true"
            @blur="hideDatalist" @keydown.enter="addTagFromInput" @keydown.tab.prevent="addTagFromInput" />
        </div>

        <Transition name="fade-slide-down">
          <ul v-if="showDatalist && filteredSuggestions.length > 0"
            class="absolute z-10 w-full bg-gray-800/90 backdrop-filter backdrop-blur-lg rounded-lg mt-2 max-h-48 overflow-y-auto shadow-xl border border-gray-700">
            <li v-for="suggestion in filteredSuggestions" :key="suggestion.title"
              @mousedown.prevent="selectSuggestion(suggestion)"
              class="p-2 cursor-pointer hover:bg-gray-700/70 text-white text-sm flex items-center">
              <img v-if="suggestion.coverUrl" :src="suggestion.coverUrl" :alt="suggestion.title"
                class="w-8 h-8 object-cover rounded mr-3 flex-shrink-0" />
              <div v-else
                class="w-8 h-8 bg-gray-600 rounded mr-3 flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                ?
              </div>
              <div class="flex-grow min-w-0">
                <span class="font-medium truncate block">{{ suggestion.title }}</span>
                <p v-if="suggestion.description" class="text-xs text-gray-400 truncate">{{ suggestion.description }}</p>
              </div>
            </li>
          </ul>
        </Transition>
      </div>
      <div class="flex items-center justify-center max-md:w-full max-md:max-w-4xl">
        <select v-model="selectedCategory" data-tutorial="category-selector"
          class="p-2 px-6 rounded-full bg-gray-700/80 w-full text-white border border-gray-600 focus:outline-none focus:border-blue-500 shadow-md appearance-none hover:bg-gray-600/80 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer">
          <option value="mix">Tipo de lista: Mezcla</option>
          <option value="songs">Tipo de lista: Canciones</option>
          <option value="artists">Tipo de lista: Artistas</option>
          <option value="albums">Tipo de lista: Álbumes</option>
          <option value="movies">Tipo de lista: Películas</option>
          <option value="tvshows">Tipo de lista: Series TV</option>
          <option value="books">Tipo de lista: Libros</option>
          <option value="videogames">Tipo de lista: Videojuegos</option>
        </select>
        <button @click="sendData(selectedTags)" data-tutorial="send-button"
          class="ml-3 p-2 rounded-full cursor-pointer glassEffect hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center text-white hover:scale-110 transform border border-purple-400/30 hover:border-purple-300/50 backdrop-blur-sm"
          aria-label="Generar recomendaciones">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"
            class="drop-shadow-sm">
            <path d="M3 20v-6l8-2l-8-2V4l19 8z" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex-grow flex w-full max-w-6xl items-center justify-center p-4">
      <div data-tutorial="recommendations-area"
        class="w-full h-full glassEffect max-h-[80vh] bg-gray-800/50 rounded-lg p-6 flex flex-col items-center justify-center text-white text-xl shadow-2xl overflow-y-auto relative custom-main-scroll">
        <div v-if="recommendationsLoading" class="flex flex-col items-center text-center">
          <p class="text-xl mb-4 text-gray-300">Generando recomendaciones...</p>
          <svg class="animate-spin h-10 w-10 text-purple-400 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </div>
        <div v-else-if="recommendationsError" class="text-red-400 text-center flex flex-col items-center">
          <p class="text-xl mb-4">{{ recommendationsError }}</p>
          <button @click="sendData(selectedTags)"
            class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors text-lg">
            Reintentar
          </button>
        </div>
        <div v-else-if="recommendations.length > 0" class="w-full h-full flex flex-col items-center">
          <h3 class="text-3xl font-extrabold mb-6">Tus Recomendaciones</h3>
          <div class="grid grid-cols-1 gap-6 w-full flex-grow pb-4 px-2">
            <div v-for="(item, index) in recommendations" :key="item.externalId || item.title"
              class="bg-gray-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-gray-600/70 border border-gray-600 relative group">
              <button @click="removeRecommendation(index)"
                class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10"
                title="Eliminar de la playlist">
                <Icon name="material-symbols:close" size="1.2em" />
              </button>

              <img v-if="item.coverUrl" :src="item.coverUrl" :alt="item.title || 'Cover'"
                class="w-32 h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-4 flex-shrink-0 shadow-md border border-gray-500" />
              <div v-else
                class="w-32 h-32 bg-gray-600 rounded-lg mb-4 sm:mb-0 sm:mr-4 flex-shrink-0 flex items-center justify-center text-gray-400 text-sm border border-gray-500">
                Sin portada
              </div>

              <div class="flex-grow flex flex-col justify-center items-center sm:items-start">
                <h4 class="font-bold text-lg text-white mb-1">
                  {{ item.title }}
                </h4>
                <p class="text-sm text-gray-300 capitalize mb-1">
                  {{ item.type }}
                  <span class="opacity-70">({{ item.externalSource }})</span>
                </p>
                <p v-if="item.releaseDate" class="text-xs text-gray-400 mb-1">
                  Lanzamiento: {{ new Date(item.releaseDate).getFullYear() }}
                </p>
                <p v-if="item.avgRating" class="text-xs text-gray-400 mb-2">
                  Valoración: {{ parseFloat(item.avgRating as string).toFixed(1) }} / 10
                </p>
                <a v-if="item.externalUrl" :href="item.externalUrl" target="_blank" rel="noopener noreferrer"
                  class="text-blue-400 hover:underline text-sm font-semibold">
                  Ver más
                </a>
              </div>
            </div>
          </div>
          <div data-tutorial="action-buttons" class="flex max-md:flex-col justify-center gap-6 mt-8 pb-4">
            <button @click="showPlaylistModal = true" :disabled="recommendations.length === 0"
              class="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
              Aceptar ({{ recommendations.length }} items)
            </button>
            <button @click="sendData(selectedTags)"
              class="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 text-lg">
              Regenerar
            </button>
          </div>
        </div>
        <div v-else class="text-center text-gray-400 text-2xl flex flex-col items-center">
          <div class="mb-6">
            <svg class="w-16 h-16 text-purple-400 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <p class="mb-4 text-3xl font-bold text-white">¡Descubre algo nuevo!</p>
            <p class="text-lg mb-6 max-w-md">
              Usa la barra de búsqueda y el botón de enviar para generar
              recomendaciones personalizadas basadas en tus intereses.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 items-center">
            <button @click="startTutorial"
              class="glassEffect hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2 text-white hover:scale-110 transform border border-purple-400/30 hover:border-purple-300/50 backdrop-blur-sm py-3 px-6 rounded-full font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              Ver Tutorial Interactivo
            </button>
            <p class="text-sm text-gray-500">¿Necesitas ayuda? Inicia el tutorial</p>
          </div>
        </div>
      </div>
    </div>
    
    <PlaylistModal v-if="showPlaylistModal" :saving="playlistSaving" @close="showPlaylistModal = false"
      @create="(playlistData) => createPlaylist(playlistData)" />
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";
import PlaylistModal from "~/components/ui/PlaylistModal.vue";
import { useSuggestions } from "~/composables/studio/useSuggestions";
import { useRecommendations } from "~/composables/studio/useRecommendations";
import { useStudioTutorial } from "~/composables/useStudioTutorial";

// @ts-ignore
definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

// Composable para la lógica de búsqueda y sugerencias
const {
  inputValue,
  selectedTags,
  showDatalist,
  searchType,
  filteredSuggestions,
  getSearchPlaceholder,
  onInput,
  selectSuggestion,
  addTagFromInput,
  removeTag,
  focusInput,
  hideDatalist,
} = useSuggestions();

// Composable para la lógica de recomendaciones y playlists
const {
  recommendations,
  recommendationsLoading,
  recommendationsError,
  selectedCategory,
  showPlaylistModal,
  playlistSaving,
  sendData,
  removeRecommendation,
  createPlaylist,
} = useRecommendations();

// Composable para el tutorial interactivo
const { startTutorial } = useStudioTutorial();

const searchInput = ref<HTMLInputElement | null>(null);

</script>

<style scoped>
/* Estilos existentes */
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
.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
  transition: all 0.3s ease-out;
}
.fade-slide-down-enter-from,
.fade-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

<style>
/* Estilos personalizados para el tutorial Driver.js */
.driver-popover-custom {
  background: rgba(31, 41, 55, 0.95) !important;
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(147, 51, 234, 0.3) !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1) !important;
}

.driver-popover-custom .driver-popover-title {
  color: #ffffff !important;
  font-weight: 700 !important;
  font-size: 1.25rem !important;
  margin-bottom: 0.5rem !important;
}

.driver-popover-custom .driver-popover-description {
  color: #e5e7eb !important;
  font-size: 1rem !important;
  line-height: 1.6 !important;
}

.driver-popover-custom .driver-popover-next-btn,
.driver-popover-custom .driver-popover-prev-btn,
.driver-popover-custom .driver-popover-close-btn,
.driver-popover-custom .driver-popover-done-btn {
  background: rgba(139, 92, 246, 0.1) !important;
  backdrop-filter: blur(10px) !important;
  color: #ffffff !important;
  border: 1px solid rgba(139, 92, 246, 0.3) !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  padding: 0.5rem 1rem !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.1) !important;
}

.driver-popover-custom .driver-popover-next-btn:hover,
.driver-popover-custom .driver-popover-prev-btn:hover,
.driver-popover-custom .driver-popover-close-btn:hover,
.driver-popover-custom .driver-popover-done-btn:hover {
  background: rgba(139, 92, 246, 0.2) !important;
  border-color: rgba(139, 92, 246, 0.5) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 8px -1px rgba(139, 92, 246, 0.2) !important;
}

.driver-popover-custom .driver-popover-progress-text {
  color: #9ca3af !important;
  font-weight: 500 !important;
}

.driver-popover-custom .driver-popover-progress-bar {
  background: rgba(139, 92, 246, 0.2) !important;
}

.driver-popover-custom .driver-popover-progress-bar-fill {
  background: linear-gradient(90deg, #8b5cf6, #ec4899) !important;
  border-radius: 4px !important;
}

/* Animación de entrada suave */
.driver-popover-custom {
  animation: fadeInUp 0.4s ease-out !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Estilos para el overlay */
.driver-overlay {
  background: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(2px) !important;
}

/* Resaltar elementos durante el tutorial */
.driver-highlighted-element {
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.6) !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}
</style>
