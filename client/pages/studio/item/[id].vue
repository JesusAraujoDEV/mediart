<template>
  <title>MediartStudio - Ítem: {{ item.title }}</title>
  <main class="w-screen h-fit min-h-dvh flex flex-col items-center justify-center p-4 text-white overflow-hidden">
    <NavigationStudio />

    <div v-if="isLoading" class="flex flex-col items-center justify-center h-full">
      <p class="text-xl mb-4 text-gray-300">Cargando ítem...</p>
      <svg class="animate-spin h-10 w-10 text-purple-400 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
    </div>

    <div v-else-if="errorMessage" class="flex flex-col items-center justify-center h-full text-red-400 text-center">
      <p class="text-xl mb-4">{{ errorMessage }}</p>
      <button @click="fetchItem"
        class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors text-lg">
        Reintentar
      </button>
    </div>

    <div v-else class="flex flex-col flex-grow w-full max-w-4xl justify-center items-center pb-4">
      <ItemHeaderCard :item="item" />
    </div>
  </main>
</template>

<script setup lang="ts">
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";
import ItemHeaderCard from '~/components/sections/ItemHeaderCard.vue';
import { useItem } from '~/composables/useItem';

definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

const { item, isLoading, errorMessage, fetchItem } = useItem();
onMounted(fetchItem);
</script>

<style scoped>
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
</style>