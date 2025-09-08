<template>
  <title>MediartStudio - Inicio</title>
  <main class="w-screen md:h-dvh h-[130dvh] flex flex-col items-center justify-between p-4 text-white">
    <NavigationStudio />

    <div class="flex max-md:flex-col gap-4 items-center justify-center w-full mb-4 px-4 max-w-4xl max-md:mt-20">
      <div class="flex items-center justify-center max-md:w-full">
          <div class="select-wrapper relative">
            <select ref="searchTypeRef" v-model="searchType" data-tutorial="search-type"
              @focus="searchTypeOpen = true" @blur="searchTypeOpen = false" @change="handleSearchTypeChange"
              class="p-2 pl-6 pr-12 rounded-full bg-gray-700/80 w-fit text-white border border-gray-600 focus:outline-none focus:border-blue-500 shadow-md appearance-none hover:bg-gray-600/80 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer"
              title="Selecciona el tipo de contenido que quieres buscar">
              <option value="general">Todo</option>
              <option value="song">Canciones</option>
              <option value="artist">Artistas</option>
              <option value="album">Álbumes</option>
              <option value="movie">Películas</option>
              <option value="tvshow">Series</option>
              <option value="book">Libros</option>
              <option value="videogame">Videojuegos</option>
            </select>
            <button type="button" aria-label="Abrir selector" class="select-arrow absolute right-3 top-1/2 -translate-y-1/2 text-white/90 cursor-pointer"
              @click="focusSearchType"
              :aria-expanded="searchTypeOpen"
              title="Haz clic para abrir el selector de tipo de búsqueda">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"
                :class="{ 'rotate-180': searchTypeOpen }" class="transition-transform duration-200">
                <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
              </svg>
            </button>
          </div>
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
            :placeholder="getSearchPlaceholder()" v-model="inputValue" @input="onInput" @focus="handleFocus"
            @keydown.enter="addTagFromInput" @keydown.tab.prevent="addTagFromInput" />
        </div>

        <Transition name="fade-slide-down">
          <ul v-if="showDatalist && (filteredSuggestions.length > 0 || isLoadingSuggestions)"
            class="absolute z-10 w-full bg-gray-800/90 backdrop-filter backdrop-blur-lg rounded-lg mt-2 max-h-48 overflow-y-auto shadow-xl border border-gray-700">
            <!-- Estado de carga -->
            <li v-if="isLoadingSuggestions" class="p-4 text-center text-gray-400">
              <div class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm">Buscando...</span>
              </div>
            </li>
            <!-- Sugerencias -->
            <li v-for="suggestion in filteredSuggestions" :key="suggestion.externalId || suggestion.title"
              @mousedown.prevent="selectSuggestion(suggestion)"
              class="p-2 cursor-pointer hover:bg-gray-700/70 text-white text-sm flex items-center transition-colors duration-150">
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
            <!-- Mensaje cuando no hay resultados -->
            <li v-if="!isLoadingSuggestions && filteredSuggestions.length === 0 && inputValue.trim().length >= 2"
              class="p-4 text-center text-gray-400 text-sm">
              <Icon name="material-symbols:search-off" size="1.5em" class="mx-auto mb-2 text-gray-500" />
              No se encontraron resultados
            </li>
          </ul>
        </Transition>
      </div>
      <div class="flex items-center justify-center max-md:w-full max-md:max-w-4xl">
        <div class="select-wrapper relative w-full">
          <select ref="categoryRef" v-model="selectedCategory" data-tutorial="category-selector"
            @focus="categoryOpen = true" @blur="categoryOpen = false"
            class="p-2 pl-6 pr-12 rounded-full bg-gray-700/80 w-full text-white border border-gray-600 focus:outline-none focus:border-blue-500 shadow-md appearance-none hover:bg-gray-600/80 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer"
            title="Elige el tipo de lista de recomendaciones que quieres generar">
            <option value="mix">Tipo de lista: Mezcla</option>
            <option value="songs">Tipo de lista: Canciones</option>
            <option value="artists">Tipo de lista: Artistas</option>
            <option value="albums">Tipo de lista: Álbumes</option>
            <option value="movies">Tipo de lista: Películas</option>
            <option value="tvshows">Tipo de lista: Series TV</option>
            <option value="books">Tipo de lista: Libros</option>
            <option value="videogames">Tipo de lista: Videojuegos</option>
          </select>
          <button type="button" aria-label="Abrir selector" class="select-arrow absolute right-3 top-1/2 -translate-y-1/2 text-white/90 cursor-pointer"
            @click="focusCategory"
            :aria-expanded="categoryOpen"
            title="Haz clic para abrir el selector de tipo de lista">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"
              :class="{ 'rotate-180': categoryOpen }" class="transition-transform duration-200">
              <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
            </svg>
          </button>
        </div>
        <button @click="sendData(selectedTags)" data-tutorial="send-button"
          class="ml-3 p-2 rounded-full cursor-pointer glassEffect hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center text-white hover:scale-110 transform border border-purple-400/30 hover:border-purple-300/50 backdrop-blur-sm"
          aria-label="Generar recomendaciones"
          title="Haz clic para generar recomendaciones basadas en tus selecciones">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"
            class="drop-shadow-sm">
            <path d="M3 20v-6l8-2l-8-2V4l19 8z" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex-grow flex w-full max-w-6xl items-center justify-center p-4">
      <div data-tutorial="recommendations-area"
        class="w-full h-full glassEffect max-h-[80vh] bg-gray-800/50 rounded-lg p-6 flex flex-col items-center justify-center text-white text-xl shadow-2xl overflow-visible relative custom-main-scroll">
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
            class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors text-lg cursor-pointer"
            title="Reintentar generar recomendaciones">
            Reintentar
          </button>
        </div>
        <div v-else-if="recommendations.length > 0" class="w-full h-full flex flex-col items-center relative pb-20">
          <div class="flex items-center justify-between w-full mb-6">
            <h3 class="text-3xl font-extrabold">Tus Recomendaciones</h3>
            <!-- Botones de alternancia de modo -->
            <div class="flex gap-2">
              <button @click="toggleViewMode('horizontal')"
                :class="[
                  'p-2 rounded-lg transition-all duration-300 cursor-pointer',
                  viewMode === 'horizontal'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/70'
                ]"
                title="Vista horizontal (modo actual)">
                <Icon name="material-symbols:view-list" size="1.5em" />
              </button>
              <button @click="toggleViewMode('pinterest')"
                :class="[
                  'p-2 rounded-lg transition-all duration-300 cursor-pointer',
                  viewMode === 'pinterest'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/70'
                ]"
                title="Vista Pinterest (cards verticales)">
                <Icon name="material-symbols:grid-view" size="1.5em" />
              </button>
            </div>
          </div>
          <div ref="recommendationsScrollRef" class="w-full flex-grow overflow-y-auto p-4 custom-main-scroll" @scroll="handleScroll">
            <div :class="[
              'pb-4 transition-all duration-500',
              viewMode === 'horizontal' ? 'grid grid-cols-1 gap-6' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            ]">
              <div v-for="(item, index) in recommendations" :key="item.externalId || item.title"
                :class="[
                  'relative group transform transition-all duration-300 hover:scale-105 border border-gray-600',
                  viewMode === 'horizontal'
                    ? 'bg-gray-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left shadow-lg hover:bg-gray-600/70'
                    : 'bg-gray-700/60 rounded-xl p-3 flex flex-col text-center shadow-lg hover:bg-gray-600/70 hover:shadow-xl'
                ]">
              <button @click="removeRecommendation(index)"
                :class="[
                  'absolute bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl z-10 cursor-pointer hover:scale-110 border-2 border-red-400/50 hover:border-red-300/70',
                  viewMode === 'horizontal' ? 'top-2 right-2 w-10 h-10' : 'top-1 right-1 w-8 h-8'
                ]"
                title="Eliminar esta recomendación de la lista">
                <Icon :size="viewMode === 'horizontal' ? '1.5em' : '1.2em'" name="material-symbols:close" />
              </button>
                <img v-if="item.coverUrl" :src="item.coverUrl" :alt="item.title || 'Cover'" loading="lazy" decoding="async"
                  :class="[
                    'object-cover rounded-lg flex-shrink-0 shadow-md border border-gray-500',
                    viewMode === 'horizontal' ? 'w-32 h-32 mb-4 sm:mb-0 sm:mr-6' : 'w-full h-48 mb-3'
                  ]" />
                <div v-else
                  :class="[
                    'bg-gray-600 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-sm border border-gray-500',
                    viewMode === 'horizontal' ? 'w-32 h-32 mb-4 sm:mb-0 sm:mr-6' : 'w-full h-48 mb-3'
                  ]">
                  Sin portada
                </div>

                <div :class="[
                  'flex flex-col',
                  viewMode === 'horizontal' ? 'flex-grow justify-center items-center sm:items-start' : 'flex-grow'
                ]">
                  <h4 :class="[
                    'font-bold text-white mb-1 line-clamp-2',
                    viewMode === 'horizontal' ? 'text-lg' : 'text-sm'
                  ]">
                    {{ item.title }}
                  </h4>
                  <p :class="[
                    'text-gray-300 capitalize mb-1',
                    viewMode === 'horizontal' ? 'text-sm' : 'text-xs'
                  ]">
                    {{ item.type }}
                    <span class="opacity-70">({{ item.externalSource }})</span>
                  </p>
                  <p v-if="item.releaseDate" :class="[
                    'text-gray-400 mb-1',
                    viewMode === 'horizontal' ? 'text-xs' : 'text-xs'
                  ]">
                    Lanzamiento: {{ new Date(item.releaseDate).getFullYear() }}
                  </p>
                  <p v-if="item.avgRating" :class="[
                    'text-gray-400 mb-2',
                    viewMode === 'horizontal' ? 'text-xs' : 'text-xs'
                  ]">
                    Valoración: {{ parseFloat(item.avgRating as string).toFixed(1) }} / 10
                  </p>
                  <a v-if="item.externalUrl" :href="item.externalUrl" target="_blank" rel="noopener noreferrer"
                    :class="[
                      'hover:underline font-semibold',
                      viewMode === 'horizontal' ? 'text-blue-400 text-sm' : 'text-blue-400 text-xs'
                    ]">
                    Ver más
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Flecha de scroll -->
          <Transition name="fade-bounce">
            <div v-if="showScrollArrow"
              class="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer animate-bounce"
              @click="scrollDown"
              title="Desplázate hacia abajo para ver más recomendaciones">
              <div class="bg-purple-600/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-purple-400/50 hover:bg-purple-500/90 transition-all duration-300 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="text-white">
                  <path d="M7 10l5 5 5-5H7z"/>
                </svg>
              </div>
            </div>
          </Transition>

          <!-- Botones flotantes -->
          <div class="absolute bottom-0 left-0 right-0 floating-action-buttons p-4 shadow-2xl rounded-b-lg z-10">
            <div data-tutorial="action-buttons" class="flex max-md:flex-col max-md:gap-4 justify-center gap-6">
              <button @click="showPlaylistModal = true" :disabled="recommendations.length === 0"
                class="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-bold py-3 px-6 md:px-8 rounded-full shadow-lg transition-all duration-300 text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
                title="Crear una nueva playlist con estas recomendaciones">
                <span class="max-md:hidden">Aceptar ({{ recommendations.length }} items)</span>
                <span class="md:hidden">Aceptar ({{ recommendations.length }})</span>
              </button>
              <button type="button" @click="regenerate()"
                :disabled="recommendationsLoading"
                :class="[
                  'py-3 px-6 md:px-8 rounded-full transition-all duration-300 text-base md:text-lg',
                  recommendationsLoading ? 'bg-gray-500 cursor-not-allowed text-white' : 'bg-red-600 hover:bg-red-700 cursor-pointer text-white font-bold hover:scale-105 transform shadow-lg'
                ]"
                title="Generar nuevas recomendaciones con los mismos criterios">
                Regenerar
              </button>
            </div>
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
              class="glassEffect hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2 text-white hover:scale-110 transform border border-purple-400/30 hover:border-purple-300/50 backdrop-blur-sm py-3 px-6 rounded-full font-semibold cursor-pointer"
              title="Inicia un tutorial interactivo para aprender a usar Mediart Studio">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              Ver Tutorial Interactivo
            </button>
            <p class="text-sm text-white">¿Necesitas ayuda? Inicia el tutorial</p>
          </div>
        </div>
      </div>
    </div>
    
    <PlaylistModal v-if="showPlaylistModal" :saving="playlistSaving" @close="showPlaylistModal = false"
      @create="(playlistData) => createPlaylist(playlistData)" />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
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
  isLoadingSuggestions,
  getSearchPlaceholder,
  onInput,
  selectSuggestion,
  addTagFromInput,
  removeTag,
  focusInput,
  hideDatalist,
  handleFocus,
  onChangeSearchType,
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

// Watcher para actualizar la flecha de scroll cuando cambian las recomendaciones
watch(() => recommendations.value, () => {
  nextTick(() => {
    handleScroll();
  });
}, { immediate: true });

const searchInput = ref<HTMLInputElement | null>(null);

// Refs y estados para selects interactivos
const searchTypeRef = ref<HTMLSelectElement | null>(null);
const categoryRef = ref<HTMLSelectElement | null>(null);
const recommendationsScrollRef = ref<HTMLDivElement | null>(null);

// Estado para la flecha de scroll
const showScrollArrow = ref(false);
const searchTypeOpen = ref<boolean>(false);
const categoryOpen = ref<boolean>(false);

// Estado para el modo de visualización
const viewMode = ref<'horizontal' | 'pinterest'>('horizontal');

function focusSearchType() {
  if (searchTypeRef.value) searchTypeRef.value.focus();
}

function focusCategory() {
  if (categoryRef.value) categoryRef.value.focus();
}

// Función para manejar cambios en el tipo de búsqueda
function handleSearchTypeChange() {
  onChangeSearchType();
}

// Función para manejar el scroll en recomendaciones
function handleScroll() {
  if (recommendationsScrollRef.value) {
    const element = recommendationsScrollRef.value;
    const isScrollable = element.scrollHeight > element.clientHeight;
    const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 10;

    showScrollArrow.value = isScrollable && !isAtBottom;
  }
}

// Función para hacer scroll suave hacia abajo
function scrollDown() {
  if (recommendationsScrollRef.value) {
    recommendationsScrollRef.value.scrollBy({ top: 200, behavior: 'smooth' });
  }
}

// Función para alternar el modo de visualización
function toggleViewMode(mode: 'horizontal' | 'pinterest') {
  viewMode.value = mode;
}

// Wrapper local para el botón Regenerar (garantiza scope y logging)
function regenerate() {
  console.debug('[studio] regenerate triggered');
  sendData();
}

// Event listener para clics fuera del dropdown
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement;
    const searchContainer = document.querySelector('.relative.flex-grow');

    if (searchContainer && !searchContainer.contains(target)) {
      hideDatalist();
    }
  };

  document.addEventListener('click', handleClickOutside);

  // Verificar scroll inicial
  nextTick(() => {
    handleScroll();
  });

  // Cleanup
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});

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

select::after {
  content: '▼';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  transition: transform 0.3s;
}

/* Animaciones para la flecha de scroll */
.fade-bounce-enter-active,
.fade-bounce-leave-active {
  transition: all 0.4s ease-out;
}
.fade-bounce-enter-from,
.fade-bounce-leave-to {
  opacity: 0;
  transform: translateY(10px) translateX(-50%) scale(0.8);
}
.fade-bounce-enter-to,
.fade-bounce-leave-from {
  opacity: 1;
  transform: translateY(0) translateX(-50%) scale(1);
}

/* Animación personalizada para la flecha */
@keyframes gentle-bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-8px) translateX(-50%);
  }
  60% {
    transform: translateY(-4px) translateX(-50%);
  }
}

.animate-bounce {
  animation: gentle-bounce 2s infinite;
}

/* Utilidad para truncar texto en múltiples líneas */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

select:focus::after {
  transform: translateY(-50%) rotate(180deg);
}

/* Animación para botones flotantes */
@keyframes slideUpFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.floating-action-buttons {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(31, 41, 55, 0.7);
  border-top: 1px solid rgba(75, 85, 99, 0.2);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
  animation: slideUpFadeIn 0.4s ease-out;
}

.floating-action-buttons::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent);
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
  padding: 1.5rem !important; /* Aumentar padding general para mejor espaciado */
  padding-top: 2.5rem !important; /* Espacio extra arriba para evitar superposición con la x */
  max-width: 320px !important; /* Limitar ancho para mejor legibilidad */
}

.driver-popover-custom .driver-popover-title {
  color: #ffffff !important;
  font-weight: 700 !important;
  font-size: 1.25rem !important;
  margin-bottom: 0.75rem !important; /* Más margen inferior */
  line-height: 1.4 !important; /* Mejor line-height */
}

.driver-popover-custom .driver-popover-description {
  color: #e5e7eb !important;
  font-size: 1rem !important;
  line-height: 1.6 !important;
  margin-bottom: 1rem !important; /* Más margen inferior */
}

.driver-popover-custom .driver-popover-next-btn,
.driver-popover-custom .driver-popover-prev-btn,
.driver-popover-custom .driver-popover-done-btn {
  background: rgba(139, 92, 246, 0.1) !important;
  backdrop-filter: blur(10px) !important;
  color: #ffffff !important;
  border: 1px solid rgba(139, 92, 246, 0.3) !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  padding: 0.5rem 1rem !important;
  transition: all 0.3s ease !important;
  box-shadow: none !important; /* quitar sombra según pedido */
  text-shadow: none !important; /* Eliminar sombra de texto */
  margin: 0 0.25rem !important; /* Espaciado entre botones */
}
.driver-popover-custom .driver-popover-next-btn:hover,
.driver-popover-custom .driver-popover-prev-btn:hover,
.driver-popover-custom .driver-popover-done-btn:hover {
  background: rgba(139, 92, 246, 0.2) !important;
  border-color: rgba(139, 92, 246, 0.5) !important;
  transform: translateY(-1px) !important;
  box-shadow: none !important; /* evitar sombra en hover */
}

.driver-popover-custom .driver-popover-close-btn {
  top: 0.75rem !important;
  right: 0.75rem !important;
  width: 28px !important; /* Aumentar tamaño */
  height: 28px !important; /* Aumentar tamaño */
  background: rgba(139, 92, 246, 0.3) !important; /* Fondo un poco más opaco */
  border: 1px solid rgba(139, 92, 246, 0.4) !important; /* Borde para más contraste */
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 18px !important; /* Ícono más grande */
  line-height: 1 !important; /* Asegurar centrado vertical del texto */
  transition: all 0.2s ease !important; /* Transición para todo */
  color: #fff !important; /* Asegurar que la X sea blanca */
  padding: 0 !important; /* Resetear padding */
}

.driver-popover-custom .driver-popover-close-btn:hover {
  background: rgba(139, 92, 246, 0.5) !important; /* Fondo más opaco en hover */
  border-color: rgba(139, 92, 246, 0.6) !important;
  transform: scale(1.1); /* Efecto de zoom en hover */
}

.driver-popover-arrow-side-top.driver-popover-arrow,
.driver-popover-arrow-side-bottom.driver-popover-arrow {
  /* Estilos existentes */
  display: none !important;
}

/* Resaltar elementos durante el tutorial */
.driver-highlighted-element {
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.6) !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}
</style>
