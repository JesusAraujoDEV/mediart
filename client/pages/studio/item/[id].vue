<template>
  <title>MediartStudio - Ítem: {{ item.title }}</title>
  <main class="w-screen h-fit min-h-dvh flex flex-col items-center justify-center p-4 text-white overflow-hidden">
    <NavigationStudio />

    <div v-if="isLoading" class="flex flex-col items-center justify-center h-full">
      <p class="text-xl mb-4 text-gray-300">Cargando ítem...</p>
      <svg class="animate-spin h-10 w-10 text-purple-400 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="errorMessage" class="flex flex-col items-center justify-center h-full text-red-400 text-center">
      <p class="text-xl mb-4">{{ errorMessage }}</p>
      <button @click="fetchItem" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors text-lg">
        Reintentar
      </button>
    </div>

    <div v-else class="flex flex-col flex-grow w-full max-w-4xl justify-center items-center pb-4">
      <div class="glassEffect bg-gray-800/50 rounded-lg p-6 shadow-xl flex flex-col md:flex-row items-center md:items-start text-center justify-center md:text-left">
        <img
          :src="item.coverUrl || '/resources/item-placeholder.webp'"
          :alt="item.title || 'Item Cover'"
          class="w-52 h-52 object-cover rounded-lg mb-4 md:mb-0 md:mr-8 flex-shrink-0 shadow-md border border-gray-600"
        />
        <div class="flex-grow">
          <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 mb-2">
            {{ item.title }}
          </h1>
          <p class="text-lg text-gray-300 mb-2 capitalize">
            Tipo: <span class="font-semibold">{{ item.type }}</span>
            <span v-if="item.externalSource" class="opacity-70 text-sm"> ({{ item.externalSource }})</span>
          </p>

          <p v-if="item.description" class="text-sm text-gray-400 mb-3 leading-relaxed">
            {{ item.description }}
          </p>

          <p v-if="item.releaseDate" class="text-sm text-gray-400 mb-1">
            Fecha de Lanzamiento: <span class="font-medium">{{ formatDate(item.releaseDate) }}</span>
          </p>
          <p v-if="item.avgRating !== null && item.avgRating !== undefined" class="text-sm text-gray-400 mb-3">
            Valoración Promedio: <span class="font-medium">{{ parseFloat(item.avgRating.toString()).toFixed(1) }} / 10</span>
          </p>

          <a
            v-if="item.externalUrl"
            :href="item.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors text-base"
          >
            Ver en {{ item.externalSource || 'Fuente Externa' }}
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>

          <div class="text-xs text-gray-500 mt-4 border-t border-gray-700 pt-3">
            <p>Creado: {{ formatDateTime(item.createdAt) }}</p>
            <p>Actualizado: {{ formatDateTime(item.updatedAt) }}</p>
          </div>
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

// Definir interfaz para el ítem
interface Item {
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
  // Añade aquí otras propiedades específicas si existen y quieres mostrarlas
  // Por ejemplo:
  // artist?: string;
  // duration?: number;
  // director?: string;
}

const item = ref<Item>({
  id: 0,
  title: "Cargando...",
  type: "unknown",
  externalId: "",
  externalSource: "",
  createdAt: "",
  updatedAt: "",
});

const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const route = useRoute();
const config = useRuntimeConfig();

// Función para formatear la fecha completa
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

// Función para formatear solo la fecha (ej. "17 de Diciembre de 2020")
const formatDate = (dateString: string): string => {
  if (!dateString) return 'Fecha desconocida';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const fetchItem = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  const itemId = route.params.id;

  if (!itemId) {
    errorMessage.value = "ID de ítem no proporcionado.";
    isLoading.value = false;
    return;
  }

  try {
    const { data, error } = await useFetch<Item>(
      `${config.public.backend}/api/items/${itemId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (error.value) {
      console.error("Error al obtener el ítem:", error.value);
      throw new Error(error.value.data?.message || error.value.message || "No se pudo cargar el ítem.");
    }

    if (data.value) {
      item.value = data.value;
    } else {
      throw new Error("No se encontró el ítem con el ID proporcionado.");
    }
  } catch (err) {
    console.error("Error en fetchItem:", err);
    errorMessage.value = (err as Error).message || "Error al cargar el ítem.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchItem();
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