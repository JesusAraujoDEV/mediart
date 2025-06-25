<template>
  <section class="w-2/3 glassEffect overflow-y-scroll h-full rounded-lg max-md:min-h-screen max-md:w-full p-6 custom-main-scroll">
    <h2 class="text-4xl font-extrabold mb-8 text-center">Mis Playlists Guardadas</h2>

    <!-- Buscador -->
    <div class="mb-6">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar playlist por nombre..."
          class="w-full bg-gray-800/70 border border-gray-600 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="loadingPlaylists" class="flex flex-col items-center text-center">
      <p class="text-xl mb-4 text-gray-300">Cargando tus playlists guardadas...</p>
      <svg class="animate-spin h-10 w-10 text-blue-400 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="errorPlaylists" class="text-red-400 text-center flex flex-col items-center">
      <p class="text-xl mb-4">{{ errorPlaylists }}</p>
      <button @click="fetchSavedPlaylists" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors text-lg">
        Reintentar
      </button>
    </div>

    <div v-else-if="filteredPlaylists.length > 0" class="w-full flex flex-col gap-8 pb-4 px-2">
      <div
        v-for="playlist in filteredPlaylists"
        :key="playlist.id"
        class="bg-gray-800/70 rounded-xl p-0 shadow-lg transform transition-transform duration-300 hover:scale-[1.01] hover:bg-gray-700/80 border border-gray-600 flex flex-col md:flex-row items-stretch overflow-hidden"
      >
        <!-- Imagen a la izquierda -->
        <div class="flex items-center justify-center bg-gray-900/60 md:w-48 w-full md:h-auto h-40 flex-shrink-0">
          <img
            v-if="(playlist as any).thumbnailUrl || (playlist as any).coverUrl || (playlist as any).imageUrl"
            :src="(playlist as any).thumbnailUrl || (playlist as any).coverUrl || (playlist as any).imageUrl"
            :alt="playlist.name"
            class="object-cover w-full h-full md:w-48 md:h-48 rounded-l-xl md:rounded-none md:rounded-l-xl border border-gray-700 shadow-md"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-4xl bg-gray-700 rounded-l-xl md:rounded-none md:rounded-l-xl border border-gray-700">
            <span>🎵</span>
          </div>
        </div>
        <!-- Datos a la derecha -->
        <div class="flex flex-col flex-grow p-6 justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-2xl font-bold text-white">{{ playlist.name }}</h3>
              <span class="text-sm text-gray-400 max-md:hidden">ID: {{ playlist.id }}</span>
            </div>
            <p v-if="playlist.description" class="text-gray-300 text-md mb-2 flex-grow">{{ playlist.description }}</p>
            <p class="text-sm text-gray-400 mb-2">
              <span class="font-semibold">Colaborativa:</span> {{ playlist.isCollaborative ? 'Sí' : 'No' }}
            </p>
          </div>
          <div class="mt-4 flex justify-end">
            <button
              @click="viewPlaylistDetails(playlist)"
              :disabled="loadingPlaylistDetails.has(playlist.id.toString())"
              class="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors text-lg flex items-center justify-center"
              :class="{ 'opacity-75 cursor-not-allowed': loadingPlaylistDetails.has(playlist.id.toString()) }"
            >
              <template v-if="loadingPlaylistDetails.has(playlist.id.toString())">
                <svg class="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando...
              </template>
              <template v-else>
                Ver más
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="searchQuery && savedPlaylists.length > 0" class="text-center text-gray-400 text-2xl flex flex-col items-center">
      <p class="mb-4">No se encontraron playlists que coincidan con "{{ searchQuery }}"</p>
      <button @click="clearSearch" class="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-colors text-lg">
        Limpiar búsqueda
      </button>
    </div>

    <div v-else class="text-center text-gray-400 text-2xl flex flex-col items-center">
      <p class="mb-4">¡Tu biblioteca está vacía!</p>
      <p class="text-lg">Guarda algunas playlists desde las recomendaciones para verlas aquí.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { Playlist } from "~/types/Playlist"; // Asegúrate de que la ruta sea correcta
import type { User } from "~/types/User"; // Necesitarás definir este tipo

const router = useRouter();
const config = useRuntimeConfig();

const savedPlaylists = ref<Playlist[]>([]);
const loadingPlaylists = ref(false);
const errorPlaylists = ref<string | null>(null);
const loadingPlaylistDetails = ref<Set<string>>(new Set()); // Set para IDs de playlists en carga, ahora espera strings
const searchQuery = ref('');
const username = ref(useRoute().params.username as string);

// Computed property para filtrar las playlists basado en la búsqueda
const filteredPlaylists = computed(() => {
  if (!searchQuery.value.trim()) {
    return savedPlaylists.value;
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  return savedPlaylists.value.filter(playlist => 
    playlist.name.toLowerCase().includes(query)
  );
});

// Función para limpiar la búsqueda
const clearSearch = () => {
  searchQuery.value = '';
};

// Función para formatear la fecha de guardado
const formatDate = (dateString: string) => {
  if (!dateString) return 'Fecha desconocida';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  try {
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Fecha inválida';
  }
};

const fetchSavedPlaylists = async () => {
  loadingPlaylists.value = true;
  errorPlaylists.value = null;
  savedPlaylists.value = [];

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No hay token de autenticación disponible. Por favor, inicia sesión.");
    }

    const response = await fetch(`${config.public.backend}/api/users/by-username/${username.value || ''}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error al cargar las playlists: ${response.statusText}`);
    }

    const data = await response.json();
    savedPlaylists.value = data.savedPlaylists;
    console.log("Playlists guardadas:", data);

    if (savedPlaylists.value.length === 0) {
      errorPlaylists.value = "Aún no tienes playlists guardadas en tu biblioteca.";
    }

  } catch (error: any) {
    console.error("Error al obtener playlists guardadas:", error);
    errorPlaylists.value = error.message || "Ocurrió un error inesperado al cargar tu biblioteca.";
  } finally {
    loadingPlaylists.value = false;
  }
};

const getUsername = async (userId: number): Promise<string> => {
  try {
    const response = await fetch(`${config.public.backend}/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error al obtener el usuario: ${response.statusText}`);
    }

    const userData: User = await response.json();
    return userData.username;
  } catch (error) {
    console.error(`Error al obtener username para el ID ${userId}:`, error);
    return 'unknown'; // Devuelve 'unknown' o un valor por defecto en caso de error
  }
};

const viewPlaylistDetails = async (playlist: Playlist) => {
  // Convierte el ID numérico a string antes de añadirlo al Set
  loadingPlaylistDetails.value.add(playlist.id.toString());
  try {
    const username = await getUsername(playlist.ownerUserId);
    router.push(`/studio/playlists/${playlist.id}`);
  } catch (error) {
    console.error("Error al ver detalles de la playlist:", error);
    // Puedes añadir una notificación de error aquí si lo deseas
  } finally {
    // Convierte el ID numérico a string antes de eliminarlo del Set
    loadingPlaylistDetails.value.delete(playlist.id.toString());
  }
};

onMounted(() => {
  fetchSavedPlaylists();
});
</script>

<style scoped>
/* Estilos para la barra de desplazamiento */
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