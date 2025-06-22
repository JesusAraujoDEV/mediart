<template>
  <title>MediartStudio - Playlist: {{ playlist.name }}</title>
  <main class="w-screen h-fit min-h-dvh flex flex-col items-center justify-start p-4 text-white overflow-hidden">
    <NavigationStudio />

    <div v-if="isLoading" class="flex flex-col items-center justify-center h-full">
      <p class="text-xl mb-4 text-gray-300">Cargando playlist...</p>
      <svg class="animate-spin h-10 w-10 text-purple-400 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="errorMessage" class="flex flex-col items-center justify-center h-full text-red-400 text-center">
      <p class="text-xl mb-4">{{ errorMessage }}</p>
      <button @click="fetchPlaylist" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors text-lg">
        Reintentar
      </button>
    </div>

    <div v-else class="flex flex-col flex-grow w-full max-w-6xl mt-20 md:mt-24 pb-4">
      <div class="glassEffect bg-gray-800/50 rounded-lg p-6 mb-6 shadow-xl flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
        <div class="w-40 h-40 rounded-lg mb-4 md:mb-0 md:mr-6 flex-shrink-0 shadow-md border border-gray-600 overflow-hidden">
          <img
            v-if="playlist.coverUrl"
            :src="playlist.coverUrl"
            alt="Playlist Cover"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full grid grid-cols-2 grid-rows-2 gap-0 bg-gray-700">
            <img
              v-for="i in 4"
              :key="i"
              :src="playlist.items?.[i - 1]?.coverUrl || '/resources/item-placeholder.webp'"
              :alt="playlist.items?.[i - 1]?.title || 'Item Cover'"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <div class="flex-grow">
          <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
            {{ playlist.name }}
          </h1>
          <p class="text-lg text-gray-300 mb-2">{{ playlist.description }}</p>
          <p class="text-sm text-gray-400 mb-1">
            Creada por: <span class="font-semibold">{{ playlist.owner?.username || 'Desconocido' }}</span>
          </p>
          <p class="text-xs text-gray-500">
            Última actualización: {{ formatDateTime(playlist.updatedAt) }}
          </p>
          <div v-if="playlist.isCollaborative" class="mt-2 flex items-center text-green-400 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
            </svg>
            Colaborativa
          </div>
        </div>
      </div>

      <div class="glassEffect bg-gray-800/50 rounded-lg p-6 shadow-xl flex-grow overflow-y-auto custom-scroll">
        <h2 class="text-2xl font-bold mb-5 text-gray-200">Contenido de la Playlist ({{ playlist.items?.length || 0 }})</h2>
        <div v-if="playlist.items && playlist.items.length > 0" class="grid grid-cols-1 gap-4">
          <NuxtLink
            v-for="item in playlist.items"
            :key="item.id"
            :to="`/studio/item/${item.id}`"
            class="block bg-gray-700/60 rounded-lg p-3 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left shadow-md transform transition-transform duration-300 hover:scale-[1.01] hover:bg-gray-600/70 border border-gray-600 no-underline text-white"
          >
            <img
              :src="item.coverUrl || '/resources/item-placeholder.webp'"
              :alt="item.title || 'Item Cover'"
              class="w-24 h-24 object-cover rounded-md mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 shadow-sm border border-gray-500"
            />
            <div class="flex-grow flex flex-col justify-center items-center sm:items-start">
              <h3 class="font-bold text-lg text-white mb-1">{{ item.title }}</h3>
              <p class="text-sm text-gray-300 capitalize mb-1">
                Tipo: {{ item.type }} <span class="opacity-70">({{ item.externalSource }})</span>
              </p>
              <p v-if="item.description" class="text-xs text-gray-400 max-h-12 overflow-hidden text-ellipsis mb-1">
                {{ item.description }}
              </p>
              <p v-if="item.releaseDate" class="text-xs text-gray-400 mb-1">
                Lanzamiento: {{ new Date(item.releaseDate).getFullYear() }}
              </p>
              <p v-if="item.avgRating !== null && item.avgRating !== undefined" class="text-xs text-gray-400 mb-2">
                Valoración: {{ parseFloat(item.avgRating.toString()).toFixed(1) }} / 10
              </p>
              <span
                v-if="item.externalUrl"
                class="text-blue-400 text-sm font-semibold mt-1"
              >
                Ver más en {{ item.externalSource }}
              </span>
            </div>
          </NuxtLink>
        </div>
        <div v-else class="text-center text-gray-400 text-lg py-10">
          <p>Esta playlist no tiene elementos aún.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";

definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

// Definir interfaces para los datos de la playlist y sus ítems
interface PlaylistItem {
  id: number;
  title: string;
  type: string;
  description?: string | null;
  coverUrl?: string | null;
  releaseDate?: string | null;
  externalId: string;
  externalSource: string;
  avgRating?: number | string | null;
  externalUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PlaylistOwner {
  id: number;
  username: string;
  profilePictureUrl?: string | null;
}

interface Playlist {
  id: number;
  ownerUserId: number;
  name: string;
  description: string;
  isCollaborative: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: PlaylistOwner;
  items?: PlaylistItem[];
  savedByUsers?: PlaylistOwner[];
  collaborators?: PlaylistOwner[];
  coverUrl?: string;
}

const playlist = ref<Playlist>({
  id: 0,
  ownerUserId: 0,
  name: "Cargando...",
  description: "Cargando descripción...",
  isCollaborative: false,
  createdAt: "",
  updatedAt: "",
  items: [],
});

const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const route = useRoute();
const config = useRuntimeConfig();

// Función para formatear la fecha y hora
const formatDateTime = (dateString: string): string => {
  if (!dateString) return 'Fecha desconocida';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const fetchPlaylist = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  const playlistId = route.params.id;

  if (!playlistId) {
    errorMessage.value = "ID de playlist no proporcionado.";
    isLoading.value = false;
    return;
  }

  try {
    const { data, error } = await useFetch<Playlist>(
      `${config.public.backend}/api/playlists/${playlistId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (error.value) {
      console.error("Error al obtener la playlist:", error.value);
      throw new Error(error.value.data?.message || error.value.message || "No se pudo cargar la playlist.");
    }

    if (data.value) {
      playlist.value = {
        ...data.value,
        items: data.value.items || [], // Ensure items is an array
      };
    } else {
      throw new Error("No se encontró la playlist con el ID proporcionado.");
    }
  } catch (err) {
    console.error("Error en fetchPlaylist:", err);
    errorMessage.value = (err as Error).message || "Error al cargar la playlist.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPlaylist();
});
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