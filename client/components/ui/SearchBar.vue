<template>
  <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
    <!-- Type selector -->
    <div class="flex items-center justify-center max-md:w-full">
      <select :value="modelSearchType" @change="onTypeChange"
        class="p-3 px-6 rounded-lg bg-gray-700 w-fit text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md appearance-none">
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

    <!-- Input -->
    <input :value="modelValue" @input="onInput" type="text" :placeholder="placeholder"
      class="flex-grow p-3 w-full rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      autocomplete="off" spellcheck="false" ref="inputEl" />

    <!-- Action button -->
    <button @click="onSearchClick" :disabled="loading"
      class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
      {{ loading ? 'Buscando...' : 'Buscar' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps<{
  modelValue: string;                 // v-model for query
  modelSearchType: string;            // v-model:searchType
  placeholder?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:modelSearchType', value: string): void;
  (e: 'search'): void;
  (e: 'focus-input', el: HTMLInputElement | null): void;
}>();

const inputEl = ref<HTMLInputElement | null>(null);

function onInput(evt: Event) {
  const value = (evt.target as HTMLInputElement).value;
  emit('update:modelValue', value);
}

function onTypeChange(evt: Event) {
  const value = (evt.target as HTMLSelectElement).value;
  emit('update:modelSearchType', value);
}

function onSearchClick() {
  emit('search');
}

defineExpose({
  focus() {
    inputEl.value?.focus();
    emit('focus-input', inputEl.value ?? null);
  },
});
</script>

<style scoped>
/* Inherit page-level styles if needed */
</style>