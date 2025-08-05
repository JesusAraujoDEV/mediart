<script setup lang="ts">
import type { PropType } from 'vue';

type NewPlaylist = {
  name: string;
  description: string;
  isCollaborative: boolean;
};

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
    default: false,
  },
  modelValue: {
    // v-model for the playlist form object
    type: Object as PropType<NewPlaylist>,
    required: true,
  },
  saving: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: NewPlaylist): void
  (e: 'close'): void
  (e: 'save'): void
}>();

const onClose = () => emit('close');
const onSave = () => emit('save');

const updateField = (patch: Partial<NewPlaylist>) => {
  const updated = { ...props.modelValue, ...patch };
  emit('update:modelValue', updated);
};
</script>

<template>
  <Teleport to="body">
    <transition name="fade" appear>
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
        <div class="absolute inset-0 bg-black/70"></div>

        <div
          class="relative w-full max-w-md rounded-lg border border-gray-700 bg-gray-800/90 p-6 shadow-2xl glassEffect">
          <h3 class="mb-6 text-center text-2xl font-bold text-white">
            Crear Nueva Playlist
          </h3>

          <div class="mb-4">
            <label for="playlistName" class="mb-2 block text-sm font-bold text-gray-300">Nombre de la Playlist:</label>
            <input id="playlistName" type="text" :value="modelValue.name"
              @input="updateField({ name: ($event.target as HTMLInputElement).value })"
              class="w-full rounded border border-gray-600 bg-gray-700/70 py-3 px-4 text-white shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ej. Mis Favoritos de Junio" />
          </div>

          <div class="mb-6">
            <label for="playlistDescription" class="mb-2 block text-sm font-bold text-gray-300">Descripción:</label>
            <textarea id="playlistDescription" rows="3" :value="modelValue.description"
              @input="updateField({ description: ($event.target as HTMLTextAreaElement).value })"
              class="w-full resize-none rounded border border-gray-600 bg-gray-700/70 py-3 px-4 text-white shadow focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Una breve descripción de tu playlist..." />
          </div>

          <div class="mb-8 flex items-center justify-between">
            <span class="text-sm font-bold text-gray-300">Colaborativa:</span>
            <label class="relative inline-flex cursor-pointer items-center">
              <input class="peer sr-only" type="checkbox" :checked="modelValue.isCollaborative"
                @change="updateField({ isCollaborative: ($event.target as HTMLInputElement).checked })" />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-600 transition peer-checked:bg-purple-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600">
              </div>
              <span class="ml-3 text-sm font-medium text-gray-300">{{
                modelValue.isCollaborative ? 'Sí' : 'No'
                }}</span>
            </label>
          </div>

          <div class="flex justify-end gap-4">
            <button type="button"
              class="rounded-full bg-gray-600 px-6 py-2 font-bold text-white shadow-md transition-colors hover:bg-gray-700"
              @click="onClose">
              Cancelar
            </button>
            <button type="button" :disabled="!modelValue.name.trim() || saving"
              class="flex items-center justify-center rounded-full bg-purple-600 px-6 py-2 font-bold text-white shadow-md transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              @click="onSave" aria-label="Crear playlist">
              <svg v-if="saving" class="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span v-else>Crear Playlist</span>
            </button>
          </div>

          <button type="button"
            class="absolute right-2 top-2 rounded-full bg-white/10 p-1 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Cerrar modal" @click="onClose">
            ✕
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>