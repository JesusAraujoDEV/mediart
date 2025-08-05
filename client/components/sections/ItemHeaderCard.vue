<template>
  <div
    class="glassEffect bg-gray-800/50 rounded-lg p-6 shadow-xl flex flex-col md:flex-row items-center md:items-start text-center justify-center md:text-left">
    <img :src="item.coverUrl || '/resources/item-placeholder.webp'" :alt="item.title || 'Item Cover'"
      class="w-52 h-52 object-cover rounded-lg mb-4 md:mb-0 md:mr-8 flex-shrink-0 shadow-md border border-gray-600" />
    <div class="flex-grow">
      <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 mb-2">
        {{ item.title }}
      </h1>

      <p class="text-lg text-gray-300 mb-2 capitalize">
        Tipo: <span class="font-semibold">{{ item.type }}</span>
        <span v-if="item.externalSource" class="opacity-70 text-sm">
          ({{ item.externalSource }})
        </span>
      </p>

      <p v-if="item.description" class="text-sm text-gray-400 mb-3 leading-relaxed">
        {{ item.description }}
      </p>

      <p v-if="item.releaseDate" class="text-sm text-gray-400 mb-1">
        Fecha de Lanzamiento:
        <span class="font-medium">{{ formatDate(item.releaseDate) }}</span>
      </p>

      <p v-if="item.avgRating !== null && item.avgRating !== undefined" class="text-sm text-gray-400 mb-3">
        Valoración Promedio:
        <span class="font-medium">
          {{ parseFloat(item.avgRating.toString()).toFixed(1) }} / 10
        </span>
      </p>

      <a v-if="item.externalUrl" :href="item.externalUrl" target="_blank" rel="noopener noreferrer"
        class="inline-flex items-center mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors text-base">
        Ver en {{ item.externalSource || 'Fuente Externa' }}
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>

      <div class="text-xs text-gray-500 mt-4 border-t border-gray-700 pt-3">
        <p>Creado: {{ formatDateTime(item.createdAt) }}</p>
        <p>Actualizado: {{ formatDateTime(item.updatedAt) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StudioItem } from '~/composables/useItem';
import { useDateFormat } from '~/composables/useDateFormat';

defineProps<{
  item: StudioItem;
}>();

const { formatDate, formatDateTime } = useDateFormat();
</script>

<style scoped>
/* This component inherits .glassEffect styles from global or parent CSS */
</style>