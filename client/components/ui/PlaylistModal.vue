<template>
    <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div class="glassEffect bg-gray-800/90 rounded-lg p-8 w-full max-w-md shadow-2xl border border-gray-700">
        <h3 class="text-2xl font-bold text-white mb-6 text-center">
          Crear Nueva Playlist
        </h3>
  
        <div class="mb-4">
          <label for="playlistName" class="block text-gray-300 text-sm font-bold mb-2">Nombre de la Playlist:</label>
          <input type="text" id="playlistName" v-model="playlist.name"
            class="shadow appearance-none border border-gray-600 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700/70"
            placeholder="Ej. Mis Favoritos de Junio" />
        </div>
  
        <div class="mb-6">
          <label for="playlistDescription" class="block text-gray-300 text-sm font-bold mb-2">Descripción:</label>
          <textarea id="playlistDescription" v-model="playlist.description" rows="3"
            class="shadow appearance-none border border-gray-600 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700/70 resize-none"
            placeholder="Una breve descripción de tu playlist..."></textarea>
        </div>
  
        <div class="flex items-center justify-between mb-8">
          <span class="text-gray-300 font-bold text-sm">Colaborativa:</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="playlist.isCollaborative" class="sr-only peer" />
            <div
              class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600">
            </div>
            <span class="ml-3 text-sm font-medium text-gray-300">{{
              playlist.isCollaborative ? "Sí" : "No"
              }}</span>
          </label>
        </div>
  
        <div class="flex justify-end gap-4">
          <button @click="$emit('close')"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors">
            Cancelar
          </button>
          <button @click="handleCreate" :disabled="!playlist.name.trim() || saving"
            class="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
            <svg v-if="saving" class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span v-else>Crear Playlist</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
import { reactive } from 'vue';

const props = defineProps({
  saving: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'create']);

const playlist = reactive({
  name: '',
  description: '',
  isCollaborative: false,
});

const handleCreate = () => {
  if (playlist.name.trim()) {
    emit('create', { ...playlist });
    // Reset form after creation
    playlist.name = '';
    playlist.description = '';
    playlist.isCollaborative = false;
  }
};
</script>