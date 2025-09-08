<template>
  <title>MediartStudio - Buscar</title>
  <main class="w-screen min-h-screen flex flex-col items-center justify-start p-4 text-white">
    <NavigationStudio data-tutorial="navbar" />

    <!-- Header mejorado -->
    <div class="w-full max-w-7xl flex justify-between items-center p-6 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold">Buscar en Mediart</h1>
          <p class="text-sm text-gray-300">Encuentra usuarios, contenido y más</p>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="w-full max-w-7xl flex-1">
      <!-- Formulario de búsqueda -->
      <div class="glassEffect rounded-xl p-8 mb-8">
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <SearchBar :modelValue="searchQuery" :modelSearchType="searchType" :placeholder="getSearchPlaceholder()"
            :loading="isSearching" @update:modelValue="(v) => (searchQuery = v)"
            @update:modelSearchType="(v) => (searchType = v)" @search="handleSearch" data-tutorial="search-bar">
            <template #search-type-select>
              <div class="flex items-center justify-center max-md:w-full">
                <select v-model="searchType" data-tutorial="search-type"
                  class="p-3 px-6 rounded-lg bg-gray-700/80 w-fit text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md appearance-none hover:bg-gray-600/80 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer">
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
              <button @click="handleSearch" :disabled="isSearching" data-tutorial="search-button"
                class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-105 transform action-button">
                <svg v-if="isSearching" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSearching ? 'Buscando...' : 'Buscar' }}
              </button>
            </template>
          </SearchBar>
        </div>

        <p v-if="searchMessage" :class="{ 'text-red-400': searchError, 'text-green-400': !searchError }"
          class="mt-6 text-center text-sm">
          {{ searchMessage }}
        </p>
      </div>

      <!-- Estado de carga -->
      <div v-if="isSearching && !searchMessage" class="glassEffect rounded-xl p-12 mb-8 text-center">
        <div class="flex flex-col items-center justify-center">
          <svg class="animate-spin h-16 w-16 text-blue-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-xl text-gray-300">Buscando resultados...</p>
        </div>
      </div>

      <!-- Resultados -->
      <div v-else-if="searchPerformed" class="glassEffect rounded-xl p-8">
        <div v-if="searchType === 'users' && users.length > 0" class="mb-6">
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Usuarios Encontrados
          </h2>
          <ResultsList :results="users" :search-type="searchType" />
        </div>

        <div v-else-if="searchResults.length > 0" class="mb-6">
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M7 10l5 5 5-5H7z"/>
            </svg>
            Resultados de {{ searchType === 'general' ? 'Búsqueda General' : searchType.charAt(0).toUpperCase() + searchType.slice(1) }}
          </h2>
          <ResultsList :results="searchResults" :search-type="searchType" />
        </div>

        <div v-else class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="currentColor" class="text-gray-500 mx-auto mb-4">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <p class="text-xl text-gray-400">No se encontraron resultados para "{{ lastSearchQuery }}"</p>
          <p class="text-gray-500 mt-2">Intenta con otros términos o selecciona un tipo diferente</p>
        </div>
      </div>

      <!-- Estado inicial -->
      <div v-else class="glassEffect rounded-xl p-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" fill="currentColor" class="text-gray-500 mx-auto mb-4">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <p class="text-xl text-gray-400">Comienza a buscar</p>
        <p class="text-gray-500 mt-2">Ingresa un término de búsqueda y selecciona el tipo de contenido</p>
        <button @click="startTutorial" data-tutorial="tutorial-button"
          class="glassEffect hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2 text-white hover:scale-110 transform border border-purple-400/30 hover:border-purple-300/50 backdrop-blur-sm py-3 px-6 rounded-full font-semibold mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          Ver Tutorial Interactivo
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useSearch } from '~/composables/useSearch';
import NavigationStudio from '~/components/navigation/NavigationStudio.vue';
import SearchBar from '~/components/ui/SearchBar.vue';
import ResultsList from '~/components/ui/ResultsList.vue';
import { useStudioTutorial } from '~/composables/useStudioTutorial';

// @ts-ignore
definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

const {
  searchQuery,
  searchType,
  getSearchPlaceholder,
  isSearching,
  searchMessage,
  searchError,
  lastSearchQuery,
  searchPerformed,
  users,
  searchResults,
  handleSearch,
} = useSearch();

// Composable para el tutorial interactivo
const { startTutorial } = useStudioTutorial();
</script>

<style scoped>
/* Estilos mejorados para el scrollbar */
.glassEffect::-webkit-scrollbar {
  width: 8px;
}

.glassEffect::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.glassEffect::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.glassEffect::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Animaciones suaves para las transiciones */
.glassEffect {
  animation: fadeIn 0.3s ease-in-out;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos para los botones de acción */
.action-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

/* Estilos para las tarjetas de resultados */
.result-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

/* Gradientes animados */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-gradient {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

/* Responsive design improvements */
@media (max-width: 768px) {
  .glassEffect {
    margin: 1rem;
    padding: 1.5rem;
  }
}

/* Loading states */
.loading-skeleton {
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>

<style>
/* Estilos personalizados para el tutorial Driver.js */
.driver-popover-custom {
  background: rgba(31, 41, 55, 0.95) !important;
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(147, 51, 234, 0.3) !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1) !important;
  padding: 1.5rem !important; /* Aumentar padding general para mejor espaciado */
  padding-top: 2.5rem !important; /* Espacio extra arriba para evitar superposición con la x */
  max-width: 320px !important; /* Limitar ancho para mejor legibilidad */
}

.driver-popover-custom .driver-popover-title {
  color: #ffffff !important;
  font-weight: 700 !important;
  font-size: 1.25rem !important;
  margin-bottom: 0.75rem !important; /* Más margen inferior */
  line-height: 1.4 !important; /* Mejor line-height */
}

.driver-popover-custom .driver-popover-description {
  color: #e5e7eb !important;
  font-size: 1rem !important;
  line-height: 1.6 !important;
  margin-bottom: 1rem !important; /* Más margen inferior */
}

.driver-popover-custom .driver-popover-close-btn {
  top: 0.75rem !important;
  right: 0.75rem !important;
  width: 28px !important; /* Aumentar tamaño */
  height: 28px !important; /* Aumentar tamaño */
  background: rgba(139, 92, 246, 0.3) !important; /* Fondo un poco más opaco */
  border: 1px solid rgba(139, 92, 246, 0.4) !important; /* Borde para más contraste */
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 18px !important; /* Ícono más grande */
  line-height: 1 !important; /* Asegurar centrado vertical del texto */
  transition: all 0.2s ease !important; /* Transición para todo */
  color: #fff !important; /* Asegurar que la X sea blanca */
  padding: 0 !important; /* Resetear padding */
}

.driver-popover-custom .driver-popover-close-btn:hover {
  background: rgba(139, 92, 246, 0.5) !important; /* Fondo más opaco en hover */
  border-color: rgba(139, 92, 246, 0.6) !important;
  transform: scale(1.1); /* Efecto de zoom en hover */
}

.driver-popover-custom .driver-popover-next-btn,
.driver-popover-custom .driver-popover-prev-btn,
.driver-popover-custom .driver-popover-next-btn,
.driver-popover-custom .driver-popover-prev-btn,
.driver-popover-custom .driver-popover-done-btn {
  background: rgba(139, 92, 246, 0.1) !important;
  backdrop-filter: blur(10px) !important;
  color: #ffffff !important;
  border: 1px solid rgba(139, 92, 246, 0.3) !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  padding: 0.5rem 1rem !important;
  transition: all 0.3s ease !important;
  box-shadow: none !important;
  text-shadow: none !important; /* Eliminar sombra de texto */
  margin: 0 0.25rem !important; /* Espaciado entre botones */
}
.driver-popover-custom .driver-popover-next-btn:hover,
.driver-popover-custom .driver-popover-prev-btn:hover,
.driver-popover-custom .driver-popover-done-btn:hover {
  background: rgba(139, 92, 246, 0.2) !important;
  border-color: rgba(139, 92, 246, 0.5) !important;
  transform: translateY(-1px) !important;
  box-shadow: none !important;
}
.driver-popover-custom .driver-popover-progress-text {
  color: #9ca3af !important;
  font-weight: 500 !important;
  margin-bottom: 0.5rem !important; /* Espacio antes de la barra */
}

.driver-popover-custom .driver-popover-progress-bar {
  background: rgba(139, 92, 246, 0.2) !important;
  height: 6px !important; /* Altura más visible */
  border-radius: 3px !important;
}

.driver-popover-custom .driver-popover-progress-bar-fill {
  background: linear-gradient(90deg, #8b5cf6, #ec4899) !important;
  border-radius: 3px !important;
  transition: width 0.3s ease !important; /* Transición suave */
}

/* Animación de entrada suave */
.driver-popover-custom {
  animation: fadeInUp 0.4s ease-out !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Estilos para el overlay */
.driver-overlay {
  background: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(2px) !important;
}

/* Resaltar elementos durante el tutorial */
.driver-highlighted-element {
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.6) !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}
</style>