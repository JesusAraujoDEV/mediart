<template>
  <title>MediartStudio - Inicio</title>
  <main
    class="w-screen md:h-dvh h-[130dvh] flex flex-col items-center justify-between p-4 text-white"
  >
    <NavigationStudio />

    <div
      class="flex max-md:flex-col gap-4 items-center justify-center w-full mb-4 px-4 max-w-4xl max-md:mt-20"
    >
      <div class="relative flex-grow mr-3 max-md:mr-0 max-md:w-full">
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
            <button
              @click.stop="removeTag(tag)"
              class="text-xs cursor-pointer text-white/80 hover:text-white ml-1"
            >
              ✕
            </button>
          </span>
          <input
            ref="searchInput"
            type="text"
            class="bg-transparent flex-grow outline-none text-white placeholder-white/60 min-w-[50px] max-md:h-5"
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
              :key="suggestion.title"
              @mousedown.prevent="selectSuggestion(suggestion.title)"
              class="p-2 cursor-pointer hover:bg-gray-700/70 text-white text-sm flex items-center"
            >
              <img
                v-if="suggestion.coverUrl"
                :src="suggestion.coverUrl"
                :alt="suggestion.title"
                class="w-8 h-8 object-cover rounded mr-3 flex-shrink-0"
              />
              <div
                v-else
                class="w-8 h-8 bg-gray-600 rounded mr-3 flex-shrink-0 flex items-center justify-center text-gray-400 text-xs"
              >
                ?
              </div>
              <span>{{ suggestion.title }}</span>
            </li>
          </ul>
        </Transition>
      </div>
      <div class="flex items-center justify-center max-md:w-full max-md:max-w-4xl">
        <select
          v-model="selectedCategory"
          class="p-2 px-6 rounded-full bg-gray-700 w-full text-white border border-gray-600 focus:outline-none focus:border-blue-500 shadow-md appearance-none"
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
          class="ml-3 p-2 rounded-full cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg flex items-center justify-center text-white"
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

    </div>

    <div
      class="flex-grow flex w-full max-w-6xl items-center justify-center p-4"
    >
      <div
        class="w-full h-full glassEffect max-h-[80vh] bg-gray-800/50 rounded-lg p-6 flex flex-col items-center justify-center text-white text-xl shadow-2xl overflow-y-auto relative custom-main-scroll"
      >
        <div
          v-if="recommendationsLoading"
          class="flex flex-col items-center text-center"
        >
          <p class="text-xl mb-4 text-gray-300">Generando recomendaciones...</p>
          <svg
            class="animate-spin h-10 w-10 text-purple-400 mt-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <div
          v-else-if="recommendationsError"
          class="text-red-400 text-center flex flex-col items-center"
        >
          <p class="text-xl mb-4">{{ recommendationsError }}</p>
          <button
            @click="sendData"
            class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors text-lg"
          >
            Reintentar
          </button>
        </div>
        <div
          v-else-if="recommendations.length > 0"
          class="w-full h-full flex flex-col items-center"
        >
          <h3 class="text-3xl font-extrabold mb-6">Tus Recomendaciones</h3>
          <div class="grid grid-cols-1 gap-6 w-full flex-grow pb-4 px-2">
            <div
              v-for="item in recommendations"
              :key="item.externalId || item.title"
              class="bg-gray-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-gray-600/70 cursor-pointer border border-gray-600"
            >
              <img
                v-if="item.coverUrl"
                :src="item.coverUrl"
                :alt="item.title || 'Cover'"
                class="w-32 h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-4 flex-shrink-0 shadow-md border border-gray-500"
              />
              <div
                v-else
                class="w-32 h-32 bg-gray-600 rounded-lg mb-4 sm:mb-0 sm:mr-4 flex-shrink-0 flex items-center justify-center text-gray-400 text-sm border border-gray-500"
              >
                Sin portada
              </div>

              <div
                class="flex-grow flex flex-col justify-center items-center sm:items-start"
              >
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
          <div class="flex max-md:flex-col justify-center gap-6 mt-8 pb-4">
            <button
              @click="showPlaylistModal = true"
              class="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 text-lg"
            >
              Aceptar
            </button>
            <button
              @click="sendData"
              class="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 text-lg"
            >
              Regenerar
            </button>
          </div>
        </div>
        <div
          v-else
          class="text-center text-gray-400 text-2xl flex flex-col items-center"
        >
          <p class="mb-4">¡Descubre algo nuevo!</p>
          <p class="text-lg">
            Usa la barra de búsqueda y el botón de enviar para generar
            recomendaciones.
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="showPlaylistModal"
      class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
    >
      <div
        class="glassEffect bg-gray-800/90 rounded-lg p-8 w-full max-w-md shadow-2xl border border-gray-700"
      >
        <h3 class="text-2xl font-bold text-white mb-6 text-center">
          Crear Nueva Playlist
        </h3>

        <div class="mb-4">
          <label
            for="playlistName"
            class="block text-gray-300 text-sm font-bold mb-2"
            >Nombre de la Playlist:</label
          >
          <input
            type="text"
            id="playlistName"
            v-model="newPlaylist.name"
            class="shadow appearance-none border border-gray-600 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700/70"
            placeholder="Ej. Mis Favoritos de Junio"
          />
        </div>

        <div class="mb-6">
          <label
            for="playlistDescription"
            class="block text-gray-300 text-sm font-bold mb-2"
            >Descripción:</label
          >
          <textarea
            id="playlistDescription"
            v-model="newPlaylist.description"
            rows="3"
            class="shadow appearance-none border border-gray-600 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700/70 resize-none"
            placeholder="Una breve descripción de tu playlist..."
          ></textarea>
        </div>

        <div class="flex items-center justify-between mb-8">
          <span class="text-gray-300 font-bold text-sm">Colaborativa:</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="newPlaylist.isCollaborative"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"
            ></div>
            <span class="ml-3 text-sm font-medium text-gray-300">{{
              newPlaylist.isCollaborative ? "Sí" : "No"
            }}</span>
          </label>
        </div>

        <div class="flex justify-end gap-4">
          <button
            @click="showPlaylistModal = false"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="createPlaylist"
            :disabled="!newPlaylist.name.trim() || playlistSaving"
            class="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg
              v-if="playlistSaving"
              class="animate-spin h-5 w-5 text-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span v-else>Crear Playlist</span>
          </button>
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
import type {
  SearchSuggestion,
  RecommendationItem,
} from "~/types/Recommendations";
import Swal from "sweetalert2";

const router = useRouter();

const inputValue = ref("");
const selectedTags = ref<string[]>([]);

const suggestions = ref<SearchSuggestion[]>([]);
const showDatalist = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);
const config = useRuntimeConfig();

const selectedCategory = ref<string>("mix");

const recommendations = ref<RecommendationItem[]>([]);
const recommendationsLoading = ref(false);
const recommendationsError = ref<string | null>(null);

let debounceTimeout: NodeJS.Timeout | null = null;
let abortController: AbortController | null = null;

// --- Nuevas variables para el modal de la playlist ---
const showPlaylistModal = ref(false);
const newPlaylist = ref({
  name: "",
  description: "",
  isCollaborative: false,
});
const playlistSaving = ref(false); // <--- Nueva variable de estado para el spinner
// ----------------------------------------------------

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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

    const newSuggestions: SearchSuggestion[] = [];

    // --- Lógica adaptada para obtener la portada según el tipo de contenido ---
    if (data.movies) {
      newSuggestions.push(
        ...data.movies.map((item: any) => ({
          title: item.title,
          coverUrl: item.poster_url || null, // Movies use poster_url
          type: "movie",
          externalId: item.id?.toString(),
        }))
      );
    }
    if (data.tvshows) {
      newSuggestions.push(
        ...data.tvshows.map((item: any) => ({
          title: item.title || item.name, // TV shows might use title or name
          coverUrl: item.poster_url || null, // TV shows use poster_url
          type: "tvshow",
          externalId: item.id?.toString(),
        }))
      );
    }
    if (data.songs) {
      newSuggestions.push(
        ...data.songs.map((item: any) => ({
          title: item.title,
          coverUrl: item.thumbnail_url || null, // Songs use thumbnail_url
          type: "song",
          externalId: item.id?.toString(),
        }))
      );
    }
    if (data.artists) {
      newSuggestions.push(
        ...data.artists.map((item: any) => ({
          title: item.name,
          coverUrl: item.image_url || null, // Artists use image_url
          type: "artist",
          externalId: item.id?.toString(),
        }))
      );
    }
    if (data.albums) {
      newSuggestions.push(
        ...data.albums.map((item: any) => ({
          title: item.name,
          coverUrl: item.thumbnail_url || null, // Albums use thumbnail_url
          type: "album",
          externalId: item.id?.toString(),
        }))
      );
    }
    if (data.books) {
      newSuggestions.push(
        ...data.books.map((item: any) => ({
          title: item.title || item.name,
          coverUrl: item.thumbnail_url || null, // Books use thumbnail_url
          type: "book",
          externalId: item.id?.toString(),
        }))
      );
    }
    if (data.videogames) {
      newSuggestions.push(
        ...data.videogames.map((item: any) => ({
          title: item.name, // Videogames usually use 'name'
          coverUrl: item.cover_url || null, // Videogames use cover_url
          type: "videogame",
          externalId: item.id?.toString(),
        }))
      );
    }
    // --- Fin de la lógica adaptada ---

    // Filter out duplicates based on title and ensure selected tags are not suggested
    const uniqueSuggestions = new Map<string, SearchSuggestion>();
    newSuggestions.forEach((s) => {
      if (!selectedTags.value.includes(s.title)) {
        uniqueSuggestions.set(s.title, s);
      }
    });
    suggestions.value = Array.from(uniqueSuggestions.values());
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Suggestion fetch request was aborted.");
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
        s.title.toLowerCase().includes(lowerCaseInput) &&
        !selectedTags.value.includes(s.title)
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

const selectSuggestion = (title: string) => {
  if (!selectedTags.value.includes(title)) {
    selectedTags.value.push(title);
  }
  inputValue.value = "";
  showDatalist.value = false;
  suggestions.value = [];
  searchInput.value?.focus();
};

const addTagFromInput = () => {
  const exactSuggestionObject = filteredSuggestions.value.find(
    (s) => s.title.toLowerCase() === inputValue.value.toLowerCase()
  );

  const tagToAdd = exactSuggestionObject
    ? exactSuggestionObject.title
    : inputValue.value;

  if (tagToAdd && !selectedTags.value.includes(tagToAdd)) {
    selectedTags.value.push(tagToAdd);
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
    recommendationsError.value =
      "Por favor, selecciona al menos un tag para generar recomendaciones.";
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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        itemName: tagsQueryParam,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Error HTTP! Estado: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Recomendaciones recibidas:", result);

    const processedRecommendations: RecommendationItem[] = [];

    // This part should already handle different cover URLs correctly since `item.coverUrl` is the standard name
    // from your backend's recommendation endpoint.
    if (Array.isArray(result)) {
      processedRecommendations.push(...result);
    } else {
      if (result.songs) processedRecommendations.push(...result.songs);
      if (result.artists) processedRecommendations.push(...result.artists);
      if (result.albums) processedRecommendations.push(...result.albums);
      if (result.movies) processedRecommendations.push(...result.movies);
      if (result.tvshows) processedRecommendations.push(...result.tvshows);
      if (result.books) processedRecommendations.push(...result.books);
      if (result.videogames)
        processedRecommendations.push(...result.videogames);
    }

    recommendations.value = processedRecommendations;
    if (processedRecommendations.length === 0) {
      recommendationsError.value =
        "No se encontraron recomendaciones para tu búsqueda.";
    }
  } catch (error: any) {
    console.error("Error al enviar datos o recibir recomendaciones:", error);
    recommendationsError.value =
      error.message ||
      "Ocurrió un error inesperado al obtener recomendaciones.";
    recommendations.value = [];
  } finally {
    recommendationsLoading.value = false;
  }
};

const createPlaylist = async () => {
  if (recommendations.value.length === 0) {
    console.warn("No hay recomendaciones para crear una playlist.");
    Swal.fire({
      title: "Error!",
      text: "No hay recomendaciones disponibles para crear una playlist.",
      icon: "error",
    });
    showPlaylistModal.value = false;
    return;
  }

  if (!newPlaylist.value.name.trim()) {
    Swal.fire({
      title: "Error!",
      text: "El nombre de la playlist es obligatorio.",
      icon: "error",
    });
    return;
  }

  playlistSaving.value = true; // <--- Activa el spinner

  try {
    const response = await fetch(`${config.public.backend}/api/playlists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: newPlaylist.value.name,
        description: newPlaylist.value.description,
        isCollaborative: newPlaylist.value.isCollaborative,
        items: recommendations.value, // Todas las recomendaciones tal cual
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Error al crear la playlist: ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Playlist creada exitosamente:", result);
    Swal.fire({
      title: "Playlist Creada!",
      text: "Tu playlist ha sido creada exitosamente.",
      icon: "success",
    });
    showPlaylistModal.value = false; // Cierra el modal
    router.push(
      `/profile/${JSON.parse(localStorage.getItem("user") || "{}").username}`
    ); // Redirige al perfil o a donde sea necesario
  } catch (error: any) {
    console.error("Error al aceptar recomendaciones y crear playlist:", error);
    Swal.fire({
      title: "Error!",
      text: "Ocurrió un error al crear la playlist. Inténtalo de nuevo.",
      icon: "error",
    });
  } finally {
    playlistSaving.value = false; // <--- Desactiva el spinner
  }
};
</script>

<style scoped>
/* Estilo para la barra de desplazamiento vertical principal */
.custom-main-scroll::-webkit-scrollbar {
  width: 8px; /* Ancho de la barra de desplazamiento vertical */
}

.custom-main-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2); /* Fondo de la pista */
  border-radius: 10px;
}

.custom-main-scroll::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.5); /* Color del "pulgar" de la barra */
  border-radius: 10px;
}

.custom-main-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(150, 150, 150, 0.7); /* Color al pasar el ratón */
}

/* Transición para el datalist */
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
