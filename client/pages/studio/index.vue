<template>
  <title>MediartStudio - Inicio</title>
  <main class="w-screen h-dvh flex flex-col items-center justify-between p-4 text-white">
    <NavigationStudio />

    <div class="flex items-center justify-center w-full mb-4 px-4 max-w-4xl">
      <div class="relative flex-grow mr-3">
        <div
          class="glassEffect shadow-xl rounded-full p-3 flex flex-wrap items-center gap-2 min-h-[48px] border border-gray-700"
          @click="focusInput"
        >
          <span
            v-for="tag in selectedTags"
            :key="tag"
            class="bg-white/20 rounded-full px-3 py-1 text-sm flex items-center gap-1 backdrop-blur-sm"
          >
            {{ tag }}
            <button @click.stop="removeTag(tag)" class="text-xs cursor-pointer text-white/80 hover:text-white ml-1">
              ✕
            </button>
          </span>
          <input
            ref="searchInput"
            type="text"
            class="bg-transparent flex-grow outline-none text-white placeholder-white/60 min-w-[50px]"
            placeholder="Escribe tu consulta aquí..."
            v-model="inputValue"
            @input="onInput"
            @focus="showDatalist = true"
            @blur="hideDatalist"
            @keydown.enter="addTagFromInput"
            @keydown.tab.prevent="addTagFromInput"
          />
        </div>

        <Transition name="fade-slide-down">
          <ul
            v-if="showDatalist && filteredSuggestions.length > 0"
            class="absolute z-10 w-full bg-gray-800/90 backdrop-filter backdrop-blur-lg rounded-lg mt-2 max-h-48 overflow-y-auto shadow-xl border border-gray-700"
          >
            <li
              v-for="suggestion in filteredSuggestions"
              :key="suggestion"
              @mousedown.prevent="selectSuggestion(suggestion)"
              class="p-2 cursor-pointer hover:bg-gray-700/70 text-white text-sm"
            >
              {{ suggestion }}
            </li>
          </ul>
        </Transition>
      </div>
      <select
        v-model="selectedCategory"
        class="p-2 rounded-full bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 shadow-md appearance-none"
      >
        <option value="mix">Mezcla</option>
        <option value="songs">Canciones</option>
        <option value="artists">Artistas</option>
        <option value="albums">Álbumes</option>
        <option value="movies">Películas</option>
        <option value="tvshows">Series TV</option>
        <option value="books">Libros</option>
        <option value="videogames">Videojuegos</option>
      </select>
      <button
        @click="sendData"
        class="ml-3 p-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg flex items-center justify-center text-white"
        aria-label="Generar recomendaciones"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M3 20v-6l8-2l-8-2V4l19 8z" />
        </svg>
      </button>
    </div>

    <div class="flex-grow flex w-full max-w-6xl items-center justify-center p-4">
      <div
        class="w-full h-full glassEffect max-h-[80vh] bg-gray-800/50 rounded-lg p-6 flex flex-col items-center justify-center text-white text-xl shadow-2xl overflow-hidden relative"
      >
        <div v-if="recommendationsLoading" class="flex flex-col items-center text-center">
          <p class="text-xl mb-4 text-gray-300">Generando recomendaciones...</p>
          <svg class="animate-spin h-10 w-10 text-purple-400 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div v-else-if="recommendationsError" class="text-red-400 text-center flex flex-col items-center">
          <p class="text-xl mb-4">{{ recommendationsError }}</p>
          <button @click="sendData" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors text-lg">
            Reintentar
          </button>
        </div>
        <div v-else-if="recommendations.length > 0" class="w-full h-full flex flex-col items-center">
          <h3 class="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            Tus Recomendaciones
          </h3>
          <div class="relative w-full overflow-hidden">
            <div class="flex space-x-6 pb-4 pt-2 overflow-x-auto custom-scrollbar">
              <div
                v-for="item in recommendations"
                :key="item.externalId || item.title"
                class="flex-none w-56 bg-gray-700/60 rounded-xl p-4 flex flex-col items-center text-center shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-gray-600/70 cursor-pointer border border-gray-600"
              >
                <img
                  v-if="item.coverUrl"
                  :src="item.coverUrl"
                  :alt="item.title || 'Cover'"
                  class="w-40 h-40 object-cover rounded-lg mb-3 shadow-md border border-gray-500"
                />
                <div v-else class="w-40 h-40 bg-gray-600 rounded-lg mb-3 flex items-center justify-center text-gray-400 text-sm border border-gray-500">
                  Sin portada
                </div>
                <h4 class="font-bold text-lg text-white mb-1 truncate w-full">{{ item.title }}</h4>
                <p class="text-sm text-gray-300 capitalize mb-1">
                  {{ item.type }} <span class="opacity-70">({{ item.externalSource }})</span>
                </p>
                <p v-if="item.releaseDate" class="text-xs text-gray-400 mb-1">
                  Lanzamiento: {{ new Date(item.releaseDate).getFullYear() }}
                </p>
                <p v-if="item.avgRating" class="text-xs text-gray-400 mb-2">
                  Valoración: {{ item.avgRating.toFixed(1) }} / 10
                </p>
                <a
                  v-if="item.externalUrl"
                  :href="item.externalUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-400 hover:underline text-sm font-semibold"
                >
                  Ver más
                </a>
              </div>
            </div>
          </div>
          <div class="flex justify-center gap-6 mt-8">
            <button @click="acceptRecommendations" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 text-lg">
              Aceptar
            </button>
            <button @click="sendData" class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 text-lg">
              Regenerar
            </button>
          </div>
        </div>
        <div v-else class="text-center text-gray-400 text-2xl flex flex-col items-center">
          <p class="mb-4">¡Descubre algo nuevo!</p>
          <p class="text-lg">Usa la barra de búsqueda y el botón de enviar para generar recomendaciones.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

import { ref, computed, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";

const router = useRouter();

const inputValue = ref("");
const selectedTags = ref<string[]>([]);
const suggestions = ref<string[]>([]);
const showDatalist = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);
const config = useRuntimeConfig();

const selectedCategory = ref<string>("mix");

interface RecommendationItem {
  type: string;
  externalSource: string;
  title: string;
  description?: string | null;
  coverUrl?: string | null;
  releaseDate?: string | null;
  externalId: string;
  avgRating?: number | null;
  externalUrl?: string | null;
}

const recommendations = ref<RecommendationItem[]>([]);
const recommendationsLoading = ref(false);
const recommendationsError = ref<string | null>(null);

let debounceTimeout: NodeJS.Timeout | null = null;
let abortController: AbortController | null = null;

const fetchSuggestions = async (query: string) => {
  if (abortController) {
    abortController.abort();
    console.log("Previous suggestion request aborted.");
  }
  abortController = new AbortController();
  const signal = abortController.signal;

  if (query.length < 2) {
    suggestions.value = [];
    return;
  }

  try {
    const response = await fetch(
      `${config.public.backend}/api/search?q=${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        signal: signal,
      }
    );

    if (signal.aborted) {
        console.log("Suggestion fetch was aborted, not processing response.");
        return;
    }

    if (!response.ok) {
      throw new Error(`Error de red: ${response.statusText}`);
    }
    const data = await response.json();

    const newSuggestions: string[] = [];

    if (data.songs) {
      newSuggestions.push(...data.songs.map((song: any) => song.title));
    }
    if (data.artists) {
      newSuggestions.push(...data.artists.map((artist: any) => artist.name));
    }
    if (data.albums) {
      newSuggestions.push(...data.albums.map((album: any) => album.name));
    }
    if (data.movies) {
      newSuggestions.push(
        ...data.movies.map((movie: any) => movie.title || movie.name)
      );
    }
    if (data.tvshows) {
      newSuggestions.push(
        ...data.tvshows.map((tvshow: any) => tvshow.title || tvshow.name)
      );
    }
    if (data.books) {
      newSuggestions.push(
        ...data.books.map((book: any) => book.title || book.name)
      );
    }
    if (data.videogames) {
      newSuggestions.push(
        ...data.videogames.map((game: any) => game.title || game.name)
      );
    }

    suggestions.value = Array.from(new Set(newSuggestions));
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Suggestion fetch request was aborted.');
    } else {
      console.error("Error al obtener sugerencias:", error);
      suggestions.value = [];
    }
  } finally {
    abortController = null;
  }
};

const filteredSuggestions = computed(() => {
  if (!inputValue.value && suggestions.value.length === 0) {
    return [];
  }
  const lowerCaseInput = inputValue.value.toLowerCase();
  return suggestions.value
    .filter(
      (s) =>
        s.toLowerCase().includes(lowerCaseInput) &&
        !selectedTags.value.includes(s)
    )
    .slice(0, 10);
});

watch(inputValue, (newValue) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  if (newValue.length < 2) {
    suggestions.value = [];
    if (abortController) {
        abortController.abort();
        abortController = null;
    }
    return;
  }

  debounceTimeout = setTimeout(() => {
    fetchSuggestions(newValue);
  }, 1000);
});

const onInput = () => {
  showDatalist.value = true;
};

const selectSuggestion = (suggestion: string) => {
  if (!selectedTags.value.includes(suggestion)) {
    selectedTags.value.push(suggestion);
  }
  inputValue.value = "";
  showDatalist.value = false;
  suggestions.value = [];
  searchInput.value?.focus();
};

const addTagFromInput = () => {
  const exactSuggestionMatch = filteredSuggestions.value.find(
    (s) => s.toLowerCase() === inputValue.value.toLowerCase()
  );

  if (inputValue.value && !selectedTags.value.includes(inputValue.value)) {
    selectedTags.value.push(exactSuggestionMatch || inputValue.value);
    inputValue.value = "";
    showDatalist.value = false;
    suggestions.value = [];
  }
};

const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter((t) => t !== tag);
};

const focusInput = () => {
  searchInput.value?.focus();
  if (inputValue.value.length > 0 || suggestions.value.length > 0) {
    showDatalist.value = true;
  }
};

const hideDatalist = () => {
  setTimeout(() => {
    showDatalist.value = false;
  }, 100);
};

onUnmounted(() => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  if (abortController) {
    abortController.abort();
  }
});

const sendData = async () => {
  if (selectedTags.value.length === 0) {
    console.warn("No hay tags seleccionados para enviar.");
    recommendationsError.value = "Por favor, selecciona al menos un tag para generar recomendaciones.";
    recommendations.value = [];
    return;
  }

  recommendationsLoading.value = true;
  recommendationsError.value = null;
  recommendations.value = [];

  const tagsQueryParam = selectedTags.value.join(", ");
  const url = `${config.public.backend}/api/recommendation/${selectedCategory.value}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        itemName: tagsQueryParam,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP! Estado: ${response.status}`);
    }

    const result = await response.json();
    console.log("Recomendaciones recibidas:", result);

    const processedRecommendations: RecommendationItem[] = [];

    // Adapting to backend response format
    if (Array.isArray(result)) {
      processedRecommendations.push(...result);
    } else {
      if (result.songs) processedRecommendations.push(...result.songs);
      if (result.artists) processedRecommendations.push(...result.artists);
      if (result.albums) processedRecommendations.push(...result.albums);
      if (result.movies) processedRecommendations.push(...result.movies);
      if (result.tvshows) processedRecommendations.push(...result.tvshows);
      if (result.books) processedRecommendations.push(...result.books);
      if (result.videogames) processedRecommendations.push(...result.videogames);
    }

    recommendations.value = processedRecommendations;
    if (processedRecommendations.length === 0) {
      recommendationsError.value = "No se encontraron recomendaciones para tu búsqueda.";
    }

  } catch (error: any) {
    console.error("Error al enviar datos o recibir recomendaciones:", error);
    recommendationsError.value = error.message || "Ocurrió un error inesperado al obtener recomendaciones.";
    recommendations.value = [];
  } finally {
    recommendationsLoading.value = false;
  }
};

const acceptRecommendations = () => {
  console.log("Recomendaciones aceptadas:", recommendations.value);
  // Aquí iría la lógica para enviar las recomendaciones aceptadas al backend
  router.push('/studio/profile/');
};
</script>

<style scoped>
/* Estilo para la barra de desplazamiento horizontal */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px; /* Ancho de la barra de desplazamiento horizontal */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2); /* Fondo de la pista */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.5); /* Color del "pulgar" de la barra */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(150, 150, 150, 0.7); /* Color al pasar el ratón */
}

/* Transición para el datalist */
.fade-slide-down-enter-active, .fade-slide-down-leave-active {
  transition: all 0.3s ease-out;
}
.fade-slide-down-enter-from, .fade-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>