<template>
  <div class="flex items-center justify-center max-md:w-full max-md:max-w-4xl">
    <select
      v-model="localCategory"
      class="p-2 px-6 rounded-full bg-gray-700 w-full text-white border border-gray-600 focus:outline-none focus:border-blue-500 shadow-md appearance-none"
    >
      <option value="mix">Tipo de lista: Mezcla</option>
      <option value="songs">Tipo de lista: Canciones</option>
      <option value="artists">Tipo de lista: Artistas</option>
      <option value="albums">Tipo de lista: Álbumes</option>
      <option value="movies">Tipo de lista: Películas</option>
      <option value="tvshows">Tipo de lista: Series TV</option>
      <option value="books">Tipo de lista: Libros</option>
      <option value="videogames">Tipo de lista: Videojuegos</option>
    </select>
    <button
      @click="$emit('submit')"
      class="ml-3 p-2 rounded-full cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg flex items-center justify-center text-white"
      aria-label="Generar recomendaciones"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M3 20v-6l8-2l-8-2V4l19 8z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'submit'): void;
}>();

const props = defineProps<{
  modelValue: string;
}>();

const localCategory = ref(props.modelValue || 'mix');

watch(
  () => props.modelValue,
  (val) => {
    if (val !== localCategory.value) localCategory.value = val || 'mix';
  }
);

watch(localCategory, (val) => {
  emit('update:modelValue', val);
});
</script>