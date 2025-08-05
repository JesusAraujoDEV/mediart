<template>
  <title>MediartStudio - Buscar Usuarios</title>
  <main class="w-screen h-fit min-h-dvh flex flex-col items-center justify-start p-4 text-white overflow-hidden">
    <NavigationStudio />

    <div class="flex flex-col flex-grow w-full max-w-4xl mt-20 md:mt-24 pb-4">
      <div class="glassEffect bg-gray-800/50 rounded-lg p-6 mb-6 shadow-xl text-center">
        <h1 class="text-4xl font-extrabold mb-4">
          Buscar
        </h1>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <!-- Select de tipo de búsqueda -->
          <div class="flex items-center justify-center max-md:w-full">
            <select
              v-model="searchType"
              class="p-3 px-6 rounded-lg bg-gray-700/80 w-fit text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md appearance-none hover:bg-gray-600/80 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer"
            >
              <option value="users">Usuarios</option>
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

          <input
            v-model="searchQuery"
            @input="debouncedSearchUsers" type="text"
            :placeholder="getSearchPlaceholder()"
            class="flex-grow p-3 w-full rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            @click="searchUsers" :disabled="isSearching"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSearching ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>

        <p v-if="searchMessage" :class="{'text-red-400': searchError, 'text-green-400': !searchError}" class="mt-4 text-sm">
          {{ searchMessage }}
        </p>
      </div>

      <div v-if="isSearching && !searchMessage && searchQuery.trim() !== ''" class="flex flex-col items-center justify-center h-48">
        <p class="text-xl mb-4 text-gray-300">Buscando...</p>
        <svg class="animate-spin h-10 w-10 text-blue-400 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Results for users -->
      <div v-if="searchType === 'users' && users.length > 0" class="glassEffect bg-gray-800/50 rounded-lg p-6 shadow-xl flex-grow overflow-y-auto custom-scroll">
        <h2 class="text-2xl font-bold mb-5 text-gray-200">Resultados de Búsqueda de Usuarios ({{ users.length }})</h2>
        <div class="grid grid-cols-1 gap-4">
          <NuxtLink
            v-for="user in users"
            :key="user.id"
            :to="`/profile/${user.username}`"
            class="bg-gray-700/60 rounded-lg p-3 flex items-center shadow-md transform transition-transform duration-300 hover:scale-[1.01] hover:bg-gray-600/70 border border-gray-600 no-underline text-white"
          >
            <img
              :src="getProfilePictureUrl(user)"
              alt="Profile Picture"
              @error="handleImageError"
              class="w-16 h-16 object-cover rounded-full flex-shrink-0 mr-4 shadow-sm border border-gray-500"
            />
            <div class="flex-grow">
              <h3 class="font-bold text-xl text-white">{{ user.username }}</h3>
              <p class="text-sm text-gray-300 truncate">{{ user.bio || 'Sin biografía' }}</p>
              <p class="text-xs text-gray-400">{{ user.email }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Results for other categories -->
      <div v-else-if="searchType !== 'users' && searchResults.length > 0" class="glassEffect bg-gray-800/50 rounded-lg p-6 shadow-xl flex-grow overflow-y-auto custom-scroll">
        <h2 class="text-2xl font-bold mb-5 text-gray-200">Resultados de Búsqueda ({{ searchResults.length }})</h2>
        <div class="grid grid-cols-1 gap-4">
          <NuxtLink
            v-for="item in searchResults"
            :key="item.externalId || item.title"
            :to="getItemRedirectUrl(item)"
            :target="item.externalUrl ? '_blank' : '_self'"
            :rel="item.externalUrl ? 'noopener noreferrer' : ''"
            class="bg-gray-700/60 rounded-lg p-3 flex items-center shadow-md transform transition-transform duration-300 hover:scale-[1.01] hover:bg-gray-600/70 border border-gray-600 no-underline text-white"
          >
            <img
              v-if="item.coverUrl"
              :src="item.coverUrl"
              :alt="item.title"
              class="w-16 h-16 object-cover rounded-lg flex-shrink-0 mr-4 shadow-sm border border-gray-500"
            />
            <div
              v-else
              class="w-16 h-16 bg-gray-600 rounded-lg flex-shrink-0 mr-4 flex items-center justify-center text-gray-400 text-xs border border-gray-500"
            >
              Sin portada
            </div>
            <div class="flex-grow">
              <h3 class="font-bold text-xl text-white">{{ item.title }}</h3>
              <p class="text-sm text-gray-300 capitalize line-clamp-1">{{ item.type }}</p>
              <p v-if="item.description" class="text-xs text-gray-400 line-clamp-1">{{ item.description }}</p>
            </div>
            <div v-if="item.externalUrl" class="ml-2 text-blue-400">
              <Icon name="material-symbols:open-in-new" size="1.2em" />
            </div>
          </NuxtLink>
        </div>
      </div>

      <div v-else-if="!isSearching && !searchError && searchPerformed" class="text-center text-gray-400 text-lg py-10">
        <p>No se encontraron resultados para "{{ lastSearchQuery }}".</p>
      </div>
       <div v-else-if="!isSearching && !searchPerformed" class="text-center text-gray-400 text-lg py-10">
        <p>Comienza a buscar...</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useFetch } from '#app';
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";
import type { UserProfile } from "~/types/User";

definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

const searchQuery = ref("");
const searchType = ref<string>("users"); // Default to users
const users = ref<UserProfile[]>([]);
const searchResults = ref<any[]>([]);
const isSearching = ref(false);
const searchMessage = ref<string | null>(null);
const searchError = ref(false);
const lastSearchQuery = ref("");
const searchPerformed = ref(false);

// AbortController to cancel previous requests
let abortController: AbortController | null = null;

const config = useRuntimeConfig();

// Función para obtener el placeholder según el tipo de búsqueda
function getSearchPlaceholder() {
  switch (searchType.value) {
    case 'users':
      return 'Buscar por nombre de usuario...';
    case 'song':
      return 'Buscar canciones...';
    case 'artist':
      return 'Buscar artistas...';
    case 'album':
      return 'Buscar álbumes...';
    case 'movie':
      return 'Buscar películas...';
    case 'tvshow':
      return 'Buscar series...';
    case 'book':
      return 'Buscar libros...';
    case 'videogame':
      return 'Buscar videojuegos...';
    case 'general':
    default:
      return 'Buscar en todo...';
  }
}

// Función para obtener la URL de la foto de perfil correctamente
function getProfilePictureUrl(user: any) {
  if (!user.profilePictureUrl || user.profilePictureUrl === '/resources/studio/previewProfile.webp') {
    return '/resources/studio/previewProfile.webp';
  }
  if (user.profilePictureUrl.startsWith('http')) {
    return user.profilePictureUrl;
  }
  return config.public.backend + user.profilePictureUrl;
}

// Función para manejar el error de carga de imagen
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = '/resources/studio/previewProfile.webp';
}

// Simple debounce function
const debounce = (func: Function, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

const internalSearchUsers = async () => {
  if (!searchQuery.value.trim()) {
    users.value = []; // Clear results if search query is empty
    searchResults.value = [];
    searchMessage.value = null; // Clear messages
    searchError.value = false;
    isSearching.value = false; // Ensure loading is off
    searchPerformed.value = false; // Reset search performed status
    return;
  }

  // Cancel previous request if it exists
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  const signal = abortController.signal;

  isSearching.value = true;
  searchMessage.value = null;
  searchError.value = false;
  lastSearchQuery.value = searchQuery.value.trim();
  users.value = []; // Clear previous results immediately
  searchResults.value = [];
  searchPerformed.value = true;

  try {
    let url: string;
    
    if (searchType.value === 'users') {
      // Search for users
      url = `${config.public.backend}/api/search/users?q=${encodeURIComponent(searchQuery.value.trim())}`;
    } else {
      // Search for other content types
      url = `${config.public.backend}/api/search?q=${encodeURIComponent(searchQuery.value.trim())}&type=${searchType.value}`;
    }

    const { data, error } = await useFetch<any>(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        signal: signal, // Pass the AbortController's signal
      }
    );

    // Check if the request was aborted before processing response
    if (signal.aborted) {
      console.log('Request aborted:', lastSearchQuery.value);
      return; // Do not process the response if it was aborted
    }

    if (error.value) {
      // Check for AbortError specifically
      if (error.value.name === 'AbortError') {
          console.log('Fetch aborted for', lastSearchQuery.value);
          return; // Do not set error message for aborted requests
      }
      console.error("Error al buscar:", error.value);
      searchError.value = true;
      searchMessage.value = error.value.data?.message || "Error al realizar la búsqueda.";
      return;
    }

    if (data.value) {
      if (searchType.value === 'users') {
        // Process user search results
        if (Array.isArray(data.value)) {
          users.value = data.value.map(user => ({
            ...user,
            profilePictureUrl: user.profilePictureUrl || '/resources/studio/previewProfile.webp',
            bio: user.bio || 'Sin biografía',
          }));
        } else {
          users.value = [{
            ...data.value,
            profilePictureUrl: data.value.profilePictureUrl || '/resources/studio/previewProfile.webp',
            bio: data.value.bio || 'Sin biografía',
          }];
        }

        if (users.value.length === 0) {
          searchMessage.value = "No se encontraron usuarios con ese nombre.";
        }
      } else {
        // Process other content type search results
        const newResults: any[] = [];
        
        switch (searchType.value) {
          case 'song':
            if (data.value.songs && Array.isArray(data.value.songs)) {
              newResults.push(
                ...data.value.songs.map((item: any) => ({
                  title: item.title,
                  coverUrl: item.thumbnail_url || null,
                  type: "song",
                  externalId: item.id?.toString(),
                  description: `${item.artist_name} - ${item.album_name}`,
                  externalUrl: item.external_url || null,
                }))
              );
            }
            break;

          case 'movie':
            if (data.value.movies && Array.isArray(data.value.movies)) {
              newResults.push(
                ...data.value.movies.map((item: any) => ({
                  title: item.title,
                  coverUrl: item.poster_url || null,
                  type: "movie",
                  externalId: item.id?.toString(),
                  description: item.overview || null,
                  externalUrl: item.external_url || null,
                }))
              );
            }
            break;

          case 'tvshow':
            if (data.value.tvshows && Array.isArray(data.value.tvshows)) {
              newResults.push(
                ...data.value.tvshows.map((item: any) => ({
                  title: item.title || item.name,
                  coverUrl: item.poster_url || null,
                  type: "tvshow",
                  externalId: item.id?.toString(),
                  description: item.overview || null,
                  externalUrl: item.external_url || null,
                }))
              );
            }
            break;

          case 'artist':
            if (data.value.artists && Array.isArray(data.value.artists)) {
              newResults.push(
                ...data.value.artists.map((item: any) => ({
                  title: item.name,
                  coverUrl: item.image_url || null,
                  type: "artist",
                  externalId: item.id?.toString(),
                  description: null,
                  externalUrl: item.external_url || null,
                }))
              );
            }
            break;

          case 'album':
            if (data.value.albums && Array.isArray(data.value.albums)) {
              newResults.push(
                ...data.value.albums.map((item: any) => ({
                  title: item.name,
                  coverUrl: item.thumbnail_url || null,
                  type: "album",
                  externalId: item.id?.toString(),
                  description: item.artist_name || null,
                  externalUrl: item.external_url || null,
                }))
              );
            }
            break;

          case 'book':
            if (data.value.books && Array.isArray(data.value.books)) {
              newResults.push(
                ...data.value.books.map((item: any) => ({
                  title: item.title || item.name,
                  coverUrl: item.thumbnail_url || null,
                  type: "book",
                  externalId: item.id?.toString(),
                  description: item.description || null,
                  externalUrl: item.external_url || null,
                }))
              );
            }
            break;

          case 'videogame':
            if (data.value.videogames && Array.isArray(data.value.videogames)) {
              newResults.push(
                ...data.value.videogames.map((item: any) => ({
                  title: item.name,
                  coverUrl: item.cover_url || null,
                  type: "videogame",
                  externalId: item.id?.toString(),
                  description: item.description || null,
                  externalUrl: item.external_url || null,
                }))
              );
            }
            break;

          case 'general':
          default:
            // Para búsqueda general, procesar todos los tipos disponibles
            if (data.value.movies) {
              newResults.push(
                ...data.value.movies.map((item: any) => ({
                  title: item.title,
                  coverUrl: item.poster_url || null,
                  type: "movie",
                  externalId: item.id?.toString(),
                  description: item.overview || null,
                  externalUrl: item.external_url || null,
                }))
              );
            }
            if (data.value.tvshows) {
              newResults.push(
                ...data.value.tvshows.map((item: any) => ({
                  title: item.title || item.name,
                  coverUrl: item.poster_url || null,
                  type: "tvshow",
                  externalId: item.id?.toString(),
                  description: item.overview || null,
                  externalUrl: item.external_url || null,
                }))
              );
            }
            if (data.value.songs) {
              newResults.push(
                ...data.value.songs.map((item: any) => ({
                  title: item.title,
                  coverUrl: item.thumbnail_url || null,
                  type: "song",
                  externalId: item.id?.toString(),
                  description: `${item.artist_name} - ${item.album_name}`,
                  externalUrl: item.external_url || null,
                }))
              );
            }
            if (data.value.artists) {
              newResults.push(
                ...data.value.artists.map((item: any) => ({
                  title: item.name,
                  coverUrl: item.image_url || null,
                  type: "artist",
                  externalId: item.id?.toString(),
                  description: null,
                  externalUrl: item.external_url || null,
                }))
              );
            }
            if (data.value.albums) {
              newResults.push(
                ...data.value.albums.map((item: any) => ({
                  title: item.name,
                  coverUrl: item.thumbnail_url || null,
                  type: "album",
                  externalId: item.id?.toString(),
                  description: item.artist_name || null,
                  externalUrl: item.external_url || null,
                }))
              );
            }
            if (data.value.books) {
              newResults.push(
                ...data.value.books.map((item: any) => ({
                  title: item.title || item.name,
                  coverUrl: item.thumbnail_url || null,
                  type: "book",
                  externalId: item.id?.toString(),
                  description: item.description || null,
                  externalUrl: item.external_url || null,
                }))
              );
            }
            if (data.value.videogames) {
              newResults.push(
                ...data.value.videogames.map((item: any) => ({
                  title: item.name,
                  coverUrl: item.cover_url || null,
                  type: "videogame",
                  externalId: item.id?.toString(),
                  description: item.description || null,
                  externalUrl: item.external_url || null,
                }))
              );
            }
            break;
        }

        searchResults.value = newResults;

        if (searchResults.value.length === 0) {
          searchMessage.value = `No se encontraron ${getSearchTypeLabel()} con ese nombre.`;
        }
      }
    } else {
      searchMessage.value = "No se encontraron resultados.";
    }

  } catch (err: any) { // Use 'any' for general error to access 'name' property
      if (err.name === 'AbortError') {
          console.log('Fetch aborted (catch block) for', lastSearchQuery.value);
          return; // Do not set error message for aborted requests
      }
    console.error("Excepción inesperada durante la búsqueda:", err);
    searchError.value = true;
    searchMessage.value = "Error inesperado al buscar.";
  } finally {
    isSearching.value = false;
    abortController = null; // Clear controller after request finishes or aborts
  }
};

// Función para obtener el label del tipo de búsqueda
function getSearchTypeLabel() {
  switch (searchType.value) {
    case 'users':
      return 'usuarios';
    case 'song':
      return 'canciones';
    case 'artist':
      return 'artistas';
    case 'album':
      return 'álbumes';
    case 'movie':
      return 'películas';
    case 'tvshow':
      return 'series';
    case 'book':
      return 'libros';
    case 'videogame':
      return 'videojuegos';
    case 'general':
    default:
      return 'resultados';
  }
}

// Debounced version of internalSearchUsers
const debouncedSearchUsers = debounce(internalSearchUsers, 300);

// Use watch to react to changes in searchQuery with debounce
// This will make sure that the search is triggered only after a pause in typing
watch(searchQuery, (newVal) => {
    if (newVal.trim() === '') {
        // If query is cleared, reset states immediately
        users.value = [];
        searchResults.value = [];
        searchMessage.value = null;
        searchError.value = false;
        isSearching.value = false;
        searchPerformed.value = false;
        if (abortController) {
            abortController.abort(); // Cancel any ongoing request
            abortController = null;
        }
    } else {
        debouncedSearchUsers();
    }
});

// Watch for changes in searchType to reset results
watch(searchType, () => {
    users.value = [];
    searchResults.value = [];
    searchMessage.value = null;
    searchError.value = false;
    isSearching.value = false;
    searchPerformed.value = false;
    if (abortController) {
        abortController.abort();
        abortController = null;
    }
});

// For the button click, still call the immediate version if desired, but debounce is better for input
const searchUsers = () => {
  // If user explicitly clicks search, we can run it immediately without debounce
  internalSearchUsers();
};

// Función para obtener la URL de redirección basada en el tipo de contenido
function getItemRedirectUrl(item: any) {
  // Si hay una URL externa disponible, usarla
  if (item.externalUrl) {
    return item.externalUrl;
  }

  // Si no hay externalId, redirigir a la búsqueda
  if (!item.externalId) {
    return `/studio/search?q=${encodeURIComponent(item.title)}&type=${item.type}`;
  }

  // Fallback a rutas internas si no hay URL externa
  switch (item.type) {
    case 'song':
      return `/studio/item/${item.externalId}?type=song`;
    case 'movie':
      return `/studio/item/${item.externalId}?type=movie`;
    case 'tvshow':
      return `/studio/item/${item.externalId}?type=tvshow`;
    case 'artist':
      return `/studio/item/${item.externalId}?type=artist`;
    case 'album':
      return `/studio/item/${item.externalId}?type=album`;
    case 'book':
      return `/studio/item/${item.externalId}?type=book`;
    case 'videogame':
      return `/studio/item/${item.externalId}?type=videogame`;
    default:
      return `/studio/item/${item.externalId}`;
  }
}

</script>

<style scoped>
/* Estilo para la barra de desplazamiento vertical */
.custom-scroll::-webkit-scrollbar {
  width: 8px; /* Ancho de la barra de desplazamiento vertical */
}

.custom-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2); /* Fondo de la pista */
  border-radius: 10px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.5); /* Color del "pulgar" de la barra */
  border-radius: 10px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(150, 150, 150, 0.7); /* Color al pasar el ratón */
}

/* Base styling for glass effect */
.glassEffect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>