<template>
  <title>MediartStudio | Seguidores</title>
  <NuxtLayout>
    <NuxtPage />
    <main
      class="w-screen h-fit md:h-dvh flex gap-4 justify-center items-center p-10 max-md:my-20 max-md:p-5 max-md:flex-col">
      <NavigationStudio />

      <!-- Vista de Seguidores -->
      <section
        class="w-2/3 glassEffect overflow-y-scroll h-full rounded-lg max-md:min-h-screen max-md:w-full p-6 custom-main-scroll">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-4xl font-extrabold text-center">Seguidores</h2>
          <NuxtLink :to="`/profile/${username}`"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-gray-500">
            ← Volver al perfil
          </NuxtLink>
        </div>

        <!-- Buscador optimizado -->
        <div class="mb-6">
          <div class="relative">
            <input v-model.trim="searchQuery" type="text" placeholder="Buscar seguidor..."
              class="w-full bg-gray-800/70 border border-gray-600 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              @input="handleSearchInput" />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <button v-if="searchQuery" @click="clearSearch"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Limpiar búsqueda">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading state optimizado -->
        <div v-if="loading" class="flex flex-col items-center text-center">
          <p class="text-xl mb-4 text-gray-300">Cargando seguidores...</p>
          <div class="relative">
            <svg class="animate-spin h-10 w-10 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </div>
        </div>

        <!-- Error state optimizado -->
        <div v-else-if="error" class="text-red-400 text-center flex flex-col items-center">
          <p class="text-xl mb-4">{{ error }}</p>
          <button @click="fetchFollowers"
            class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            Reintentar
          </button>
        </div>

        <!-- Lista de seguidores optimizada -->
        <div v-else-if="filteredFollowers.length > 0" class="w-full flex flex-col gap-4 pb-4 px-2">
          <TransitionGroup name="follower-list" tag="div" class="flex flex-col gap-4">
            <div v-for="follower in visibleFollowers" :key="follower.id"
              class="bg-gray-800/70 rounded-xl p-4 shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:bg-gray-700/80 border border-gray-600 flex items-center">
              <img
                :src="(follower.profilePictureUrl ? (follower.profilePictureUrl.startsWith('http') ? follower.profilePictureUrl : config.public.backend + follower.profilePictureUrl) : '/avatar-default.svg')"
                :alt="follower.username" @error="handleImageError" class="w-12 h-12 rounded-full object-cover" />
              <div class="flex-grow min-w-0">
                <h3 class="text-xl font-bold text-white mb-1 truncate">{{ follower.username }}</h3>
                <p v-if="follower.bio" class="text-gray-300 text-sm mb-2 line-clamp-2">{{ follower.bio }}</p>
                <p class="text-xs text-gray-400 truncate">{{ follower.email }}</p>
              </div>
              <NuxtLink :to="`/profile/${follower.username}`"
                class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors text-sm flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-purple-500">
                Ver perfil
              </NuxtLink>
            </div>
          </TransitionGroup>

          <!-- Load more button -->
          <div v-if="hasMoreFollowers" class="flex justify-center mt-6">
            <button @click="loadMoreFollowers"
              class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer">
              Cargar más
            </button>
          </div>
        </div>

        <!-- Empty states optimizados -->
        <div v-else-if="searchQuery && followers.length > 0"
          class="text-center text-gray-400 text-2xl flex flex-col items-center">
          <p class="mb-4">No se encontraron seguidores que coincidan con "{{ searchQuery }}"</p>
          <button @click="clearSearch"
            class="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer">
            Limpiar búsqueda
          </button>
        </div>

        <div v-else class="text-center text-gray-400 text-2xl flex flex-col items-center">
          <p class="mb-4">No hay seguidores</p>
          <p class="text-lg">Este usuario aún no tiene seguidores.</p>
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

import { ref, computed, onMounted, watch, nextTick } from "vue";
import { getCache, setCache } from "~/utils/cache";
import { useRoute } from "vue-router";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";

const route = useRoute();
const config = useRuntimeConfig();

const username = route.params.username as string;
const followers = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');

// Virtualización y paginación
const itemsPerPage = 10;
const currentPage = ref(1);
const searchDebounceTimeout = ref<NodeJS.Timeout | null>(null);

// Computed properties optimizadas
const filteredFollowers = computed(() => {
  if (!searchQuery.value.trim()) {
    return followers.value;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return followers.value.filter(follower =>
    follower.username.toLowerCase().includes(query) ||
    follower.bio?.toLowerCase().includes(query) ||
    follower.email.toLowerCase().includes(query)
  );
});

const visibleFollowers = computed(() => {
  const startIndex = 0;
  const endIndex = currentPage.value * itemsPerPage;
  return filteredFollowers.value.slice(startIndex, endIndex);
});

const hasMoreFollowers = computed(() => {
  return visibleFollowers.value.length < filteredFollowers.value.length;
});

// Event handlers optimizados
const handleSearchInput = () => {
  if (searchDebounceTimeout.value) {
    clearTimeout(searchDebounceTimeout.value);
  }

  searchDebounceTimeout.value = setTimeout(() => {
    currentPage.value = 1; // Reset pagination on search
  }, 300);
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/avatar-default.svg';
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
};

const loadMoreFollowers = () => {
  currentPage.value++;
};

const fetchFollowers = async () => {
  if (loading.value) return; // Prevent multiple requests

  loading.value = true;
  error.value = null;
  followers.value = [];

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No hay token de autenticación disponible.");
    }

    // Obtener el perfil del usuario específico
    const cacheKey = `followers:${username}`;
    const cached = getCache<any[]>(cacheKey);
    if (cached) {
      followers.value = cached;
    }

    const response = await fetch(`${config.public.backend}/api/users/by-username/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error al cargar los seguidores: ${response.statusText}`);
    }

    const data = await response.json();
    followers.value = data.followersUsers || [];
    setCache(cacheKey, followers.value, 2 * 60 * 1000);
    console.log("Seguidores cargados:", followers.value);

  } catch (error: any) {
    console.error("Error al obtener seguidores:", error);
    error.value = error.message || "Ocurrió un error inesperado al cargar los seguidores.";
  } finally {
    loading.value = false;
  }
};

// Watchers optimizados
watch(searchQuery, () => {
  currentPage.value = 1; // Reset pagination when search changes
});

// Lifecycle hooks
onMounted(async () => {
  await nextTick();
  await fetchFollowers();
});

// Cleanup
onUnmounted(() => {
  if (searchDebounceTimeout.value) {
    clearTimeout(searchDebounceTimeout.value);
  }
});
</script>

<style scoped>
/* Estilos optimizados para la barra de desplazamiento */
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

/* Transiciones optimizadas */
.follower-list-enter-active,
.follower-list-leave-active {
  transition: all 0.3s ease;
}

.follower-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.follower-list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.follower-list-move {
  transition: transform 0.3s ease;
}

/* Utilidades CSS optimizadas */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Optimizaciones de rendimiento */
* {
  will-change: transform;
}

img {
  will-change: auto;
}

/* Focus states mejorados */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #8b5cf6;
  outline-offset: 2px;
}

/* Optimizaciones para dispositivos móviles */
@media (max-width: 768px) {
  .glassEffect {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}
</style>