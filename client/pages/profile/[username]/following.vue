<template>
  <title>MediartStudio | Amigos</title>
  <NuxtLayout>
    <NuxtPage />
    <main
      class="w-screen h-fit md:h-dvh flex gap-4 justify-center items-center p-10 max-md:my-20 max-md:p-5 max-md:flex-col"
    >
      <NavigationStudio />
      
      <!-- Vista de Amigos -->
      <section class="w-2/3 glassEffect overflow-y-scroll h-full rounded-lg max-md:min-h-screen max-md:w-full p-6 custom-main-scroll">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-4xl font-extrabold text-center">Amigos</h2>
          <NuxtLink 
            :to="`/profile/${username}`" 
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors text-sm"
          >
            ← Volver al perfil
          </NuxtLink>
        </div>

        <!-- Buscador -->
        <div class="mb-6">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar amigo..."
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

        <div v-if="loading" class="flex flex-col items-center text-center">
          <p class="text-xl mb-4 text-gray-300">Cargando amigos...</p>
          <svg class="animate-spin h-10 w-10 text-blue-400 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div v-else-if="error" class="text-red-400 text-center flex flex-col items-center">
          <p class="text-xl mb-4">{{ error }}</p>
          <button @click="fetchFollowing" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors text-lg">
            Reintentar
          </button>
        </div>

        <div v-else-if="filteredFollowing.length > 0" class="w-full flex flex-col gap-4 pb-4 px-2">
          <div
            v-for="friend in filteredFollowing"
            :key="friend.id"
            class="bg-gray-800/70 rounded-xl p-4 shadow-lg transform transition-transform duration-300 hover:scale-[1.02] hover:bg-gray-700/80 border border-gray-600 flex items-center"
          >
            <img
              :src="friend.profilePictureUrl || '/resources/studio/previewProfile.webp'"
              :alt="friend.username"
              class="w-16 h-16 object-cover rounded-full mr-4 flex-shrink-0 shadow-md border border-gray-500"
            />
            <div class="flex-grow">
              <h3 class="text-xl font-bold text-white mb-1">{{ friend.username }}</h3>
              <p v-if="friend.bio" class="text-gray-300 text-sm mb-2">{{ friend.bio }}</p>
              <p class="text-xs text-gray-400">{{ friend.email }}</p>
            </div>
            <NuxtLink
              :to="`/profile/${friend.username}`"
              class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors text-sm"
            >
              Ver perfil
            </NuxtLink>
          </div>
        </div>

        <div v-else-if="searchQuery && following.length > 0" class="text-center text-gray-400 text-2xl flex flex-col items-center">
          <p class="mb-4">No se encontraron amigos que coincidan con "{{ searchQuery }}"</p>
          <button @click="clearSearch" class="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-colors text-lg">
            Limpiar búsqueda
          </button>
        </div>

        <div v-else class="text-center text-gray-400 text-2xl flex flex-col items-center">
          <p class="mb-4">No hay amigos</p>
          <p class="text-lg">Este usuario aún no tiene amigos.</p>
        </div>
      </section>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";

const route = useRoute();
const config = useRuntimeConfig();

const username = route.params.username as string;
const following = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');

// Computed property para filtrar los amigos basado en la búsqueda
const filteredFollowing = computed(() => {
  if (!searchQuery.value.trim()) {
    return following.value;
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  return following.value.filter(friend => 
    friend.username.toLowerCase().includes(query) ||
    friend.bio?.toLowerCase().includes(query) ||
    friend.email.toLowerCase().includes(query)
  );
});

// Función para limpiar la búsqueda
const clearSearch = () => {
  searchQuery.value = '';
};

const fetchFollowing = async () => {
  loading.value = true;
  error.value = null;
  following.value = [];

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No hay token de autenticación disponible.");
    }

    const response = await fetch(`${config.public.backend}/api/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error al cargar los amigos: ${response.statusText}`);
    }

    const data = await response.json();
    following.value = data.followingUsers || [];
    console.log("Amigos cargados:", following.value);

  } catch (error: any) {
    console.error("Error al obtener amigos:", error);
    error.value = error.message || "Ocurrió un error inesperado al cargar los amigos.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchFollowing();
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