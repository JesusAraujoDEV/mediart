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
          <SearchBar :modelValue="searchQuery" :modelSearchType="searchType" :placeholder="getSearchPlaceholder()"
            :loading="isSearching" @update:modelValue="(v) => (searchQuery = v)"
            @update:modelSearchType="(v) => (searchType = v)" @search="handleSearch">
            <template #search-type-select>
              <div class="flex items-center justify-center max-md:w-full">
                <select v-model="searchType"
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
              <button @click="handleSearch" :disabled="isSearching"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-105 transform">
                {{ isSearching ? 'Buscando...' : 'Buscar' }}
              </button>
            </template>
          </SearchBar>
        </div>

        <p v-if="searchMessage" :class="{ 'text-red-400': searchError, 'text-green-400': !searchError }"
          class="mt-4 text-sm">
          {{ searchMessage }}
        </p>
      </div>

      <div v-if="isSearching && !searchMessage" class="flex flex-col items-center justify-center h-48">
        <p class="text-xl mb-4 text-gray-300">Buscando...</p>
        <svg class="animate-spin h-10 w-10 text-blue-400 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
      </div>

      <ResultsList v-else-if="searchType === 'users'" :results="users" :search-type="searchType" />

      <ResultsList v-else :results="searchResults" :search-type="searchType" />

      <div v-if="!isSearching && searchPerformed && (users.length === 0 && searchResults.length === 0)"
        class="text-center text-gray-400 text-lg py-10">
        <p>No se encontraron resultados para "{{ lastSearchQuery }}".</p>
      </div>
      <div v-else-if="!isSearching && !searchPerformed" class="text-center text-gray-400 text-lg py-10">
        <p>Comienza a buscar...</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useSearch } from '~/composables/useSearch';
import NavigationStudio from '~/components/navigation/NavigationStudio.vue';
import SearchBar from '~/components/ui/SearchBar.vue';
import ResultsList from '~/components/ui/ResultsList.vue';

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
</script>

<style scoped>
/* Mantener estilos específicos del componente */
.custom-scroll::-webkit-scrollbar {
  width: 8px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.5);
  border-radius: 10px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(150, 150, 150, 0.7);
}

.glassEffect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>