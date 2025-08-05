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
          <SearchBar
            :modelValue="searchQuery"
            :modelSearchType="searchType"
            :placeholder="getSearchPlaceholder()"
            :loading="isSearching"
            @update:modelValue="(v) => (searchQuery = v)"
            @update:modelSearchType="(v) => (searchType = v)"
            @search="searchUsers"
            @focus-input="() => {}"
          >
            <template #search-type-select>
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
            </template>

            <template #search-button>
              <button
                @click="searchUsers"
                :disabled="isSearching"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-105 transform"
              >
                {{ isSearching ? 'Buscando...' : 'Buscar' }}
              </button>
            </template>
          </SearchBar>
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

      <div v-else-if="searchType !== 'users' && searchResults.length > 0" class="glassEffect bg-gray-800/50 rounded-lg p-6 shadow-xl flex-grow overflow-y-auto custom-scroll">
        <h2 class="text-2xl font-bold mb-5 text-gray-200">Resultados de Búsqueda ({{ searchResults.length }})</h2>
        <div class="grid grid-cols-1 gap-4">
          <NuxtLink
            v-for="item in searchResults"
            :key="item.externalId || item.title"
            :to="getItemRedirectUrl(item)"
            :target="(item as any).externalUrl ? '_blank' : '_self'"
            :rel="(item as any).externalUrl ? 'noopener noreferrer' : ''"
            class="bg-gray-700/60 rounded-lg p-3 flex items-center shadow-md transform transition-transform duration-300 hover:scale-[1.01] hover:bg-gray-600/70 border border-gray-600 no-underline text-white"
          >
            <img
              v-if="item.coverUrl"
              :src="item.coverUrl"
              :alt="item.title"
              loading="lazy"
              referrerpolicy="no-referrer"
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
            <div v-if="(item as any).externalUrl" class="ml-2 text-blue-400">
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
import { ref, watch } from "vue";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";
import SearchBar from "~/components/ui/SearchBar.vue";
import type { UserProfile } from "~/types/User";
import { useSuggestions } from "~/composables/useSuggestions";

/* eslint-disable no-undef */
// @ts-ignore
definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

const config = useRuntimeConfig();

// Users-only state
const users = ref<UserProfile[]>([]);
const isSearching = ref(false);
const searchMessage = ref<string | null>(null);
const searchError = ref(false);
const lastSearchQuery = ref("");
const searchPerformed = ref(false);

// Suggestions/search composable to unify mapping
const {
  inputValue: searchQuery,
  searchType,
  getSearchPlaceholder,
  fetchSuggestions,
  suggestions: searchResults,
} = useSuggestions();

function getProfilePictureUrl(user: any) {
  if (!user.profilePictureUrl || user.profilePictureUrl === '/resources/studio/previewProfile.webp') {
    return '/resources/studio/previewProfile.webp';
  }
  if (user.profilePictureUrl.startsWith('http')) {
    return user.profilePictureUrl;
  }
  return config.public.backend + user.profilePictureUrl;
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = '/resources/studio/previewProfile.webp';
}

const internalSearchUsers = async () => {
  const q = searchQuery.value.trim();
  if (!q) {
    users.value = [];
    (searchResults as any).value = [];
    searchMessage.value = null;
    searchError.value = false;
    isSearching.value = false;
    searchPerformed.value = false;
    return;
  }

  isSearching.value = true;
  searchMessage.value = null;
  searchError.value = false;
  lastSearchQuery.value = q;
  users.value = [];
  (searchResults as any).value = [];
  searchPerformed.value = true;

  try {
    if (searchType.value === "users") {
      const url = `${config.public.backend}/api/search/users?q=${encodeURIComponent(q)}`;
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `Error al realizar la búsqueda: ${resp.statusText}`);
      }
      const data = await resp.json();
      const list = Array.isArray(data) ? data : [data];
      users.value = list.map((u: any) => ({
        ...u,
        profilePictureUrl: u.profilePictureUrl || '/resources/studio/previewProfile.webp',
        bio: u.bio || 'Sin biografía',
      }));
      if (!users.value.length) {
        searchMessage.value = "No se encontraron usuarios con ese nombre.";
      }
    } else {
      await fetchSuggestions(q);
      if (!(searchResults as any).value?.length) {
        searchMessage.value = "No se encontraron resultados.";
      }
    }
  } catch (e: any) {
    console.error("Error en búsqueda:", e);
    searchError.value = true;
    searchMessage.value = e?.message || "Error al realizar la búsqueda.";
  } finally {
    isSearching.value = false;
  }
};

const searchUsers = () => internalSearchUsers();

// Debounce via watcher
let debounceHandle: ReturnType<typeof setTimeout> | null = null;
watch(searchQuery, (val) => {
  if (debounceHandle) {
    clearTimeout(debounceHandle);
    debounceHandle = null;
  }
  if (!val.trim()) {
    users.value = [];
    (searchResults as any).value = [];
    searchMessage.value = null;
    searchError.value = false;
    isSearching.value = false;
    searchPerformed.value = false;
    return;
  }
  debounceHandle = setTimeout(() => internalSearchUsers(), 300);
});

watch(searchType, () => {
  users.value = [];
  (searchResults as any).value = [];
  searchMessage.value = null;
  searchError.value = false;
  isSearching.value = false;
  searchPerformed.value = false;
  if (searchQuery.value.trim().length >= 2) {
    internalSearchUsers();
  }
});

function getItemRedirectUrl(item: any) {
  if ((item as any).externalUrl) return (item as any).externalUrl;
  if (!item.externalId) return `/studio/search?q=${encodeURIComponent(item.title)}&type=${item.type}`;
  switch (item.type) {
    case "song": return `/studio/item/${item.externalId}?type=song`;
    case "movie": return `/studio/item/${item.externalId}?type=movie`;
    case "tvshow": return `/studio/item/${item.externalId}?type=tvshow`;
    case "artist": return `/studio/item/${item.externalId}?type=artist`;
    case "album": return `/studio/item/${item.externalId}?type=album`;
    case "book": return `/studio/item/${item.externalId}?type=book`;
    case "videogame": return `/studio/item/${item.externalId}?type=videogame`;
    default: return `/studio/item/${item.externalId}`;
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