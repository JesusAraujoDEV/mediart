<template>
  <title>MediartStudio - Buscar Usuarios</title>
  <main class="w-screen h-fit min-h-dvh flex flex-col items-center justify-start p-4 text-white overflow-hidden">
    <NavigationStudio />

    <div class="flex flex-col flex-grow w-full max-w-4xl mt-20 md:mt-24 pb-4">
      <div class="glassEffect bg-gray-800/50 rounded-lg p-6 mb-6 shadow-xl text-center">
        <h1 class="text-4xl font-extrabold mb-4">
          Buscar Usuarios
        </h1>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <input
            v-model="searchQuery"
            @input="debouncedSearchUsers" type="text"
            placeholder="Buscar por nombre de usuario..."
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
        <p class="text-xl mb-4 text-gray-300">Buscando usuarios...</p>
        <svg class="animate-spin h-10 w-10 text-blue-400 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="users.length > 0" class="glassEffect bg-gray-800/50 rounded-lg p-6 shadow-xl flex-grow overflow-y-auto custom-scroll">
        <h2 class="text-2xl font-bold mb-5 text-gray-200">Resultados de Búsqueda ({{ users.length }})</h2>
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

      <div v-else-if="!isSearching && !searchError && searchPerformed" class="text-center text-gray-400 text-lg py-10">
        <p>No se encontraron usuarios para "{{ lastSearchQuery }}".</p>
      </div>
       <div v-else-if="!isSearching && !searchPerformed" class="text-center text-gray-400 text-lg py-10">
        <p>Comienza a buscar usuarios...</p>
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
const users = ref<UserProfile[]>([]);
const isSearching = ref(false);
const searchMessage = ref<string | null>(null);
const searchError = ref(false);
const lastSearchQuery = ref("");
const searchPerformed = ref(false);

// AbortController to cancel previous requests
let abortController: AbortController | null = null;

const config = useRuntimeConfig();

// Función para obtener la URL de la foto de perfil correctamente
function getProfilePictureUrl(user: any) {
  if (!user.profilePictureUrl || user.profilePictureUrl === '/resources/studio/previewProfile.webp') {
    return '/resources/studio/previewProfile.webp';
  }
  // Si ya es una URL absoluta (por ejemplo, empieza con http), no concatenar
  if (user.profilePictureUrl.startsWith('http')) {
    return user.profilePictureUrl;
  }
  return config.public.backend + user.profilePictureUrl;
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
  searchPerformed.value = true;

  try {
    const { data, error } = await useFetch<UserProfile | UserProfile[]>(
      `${config.public.backend}/api/search/users?q=${encodeURIComponent(searchQuery.value.trim())}`,
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
      console.error("Error al buscar usuarios:", error.value);
      searchError.value = true;
      searchMessage.value = error.value.data?.message || "Error al realizar la búsqueda.";
      return;
    }

    if (data.value) {
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
      searchMessage.value = "No se encontraron usuarios.";
    }

  } catch (err: any) { // Use 'any' for general error to access 'name' property
      if (err.name === 'AbortError') {
          console.log('Fetch aborted (catch block) for', lastSearchQuery.value);
          return; // Do not set error message for aborted requests
      }
    console.error("Excepción inesperada durante la búsqueda:", err);
    searchError.value = true;
    searchMessage.value = "Error inesperado al buscar usuarios.";
  } finally {
    isSearching.value = false;
    abortController = null; // Clear controller after request finishes or aborts
  }
};

// Debounced version of internalSearchUsers
const debouncedSearchUsers = debounce(internalSearchUsers, 300);

// Use watch to react to changes in searchQuery with debounce
// This will make sure that the search is triggered only after a pause in typing
watch(searchQuery, (newVal) => {
    if (newVal.trim() === '') {
        // If query is cleared, reset states immediately
        users.value = [];
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

// For the button click, still call the immediate version if desired, but debounce is better for input
const searchUsers = () => {
  // If user explicitly clicks search, we can run it immediately without debounce
  internalSearchUsers();
};

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