<template>
  <!-- Paso 2 (Estático) -->
  <div v-if="!isDemoMode" class="overflow-hidden rounded-xl p-6 backdrop-blur-sm border shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]" :style="cardStyle">
    <div class="pt-2">
      <span class="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] rounded-full px-3 py-1" :style="pillStyle">
        Paso 2 <CheckIcon class="h-3.5 w-3.5" />
      </span>
    </div>
    <div class="pb-2 mt-3">
      <h3 class="flex items-center gap-2 font-semibold text-lg" :style="{ color: hexA('#FFFFFF', 0.9) }">
        <TagsIcon class="h-5 w-5" :style="{ color: hexA('#FFFFFF', 0.72) }" />
        Añade gustos y elige tipos
      </h3>
    </div>
    <div class="space-y-4">
      <div class="h-10 w-full rounded-md px-3 flex items-center justify-between" :style="ghostInputStyle">
        <span class="truncate" :style="{ color: hexA('#FFFFFF', 0.64) }">Selecciona una categoría</span>
        <ChevronDown class="h-5 w-5" :style="{ color: hexA('#FFFFFF', 0.64) }" />
      </div>
      <div class="h-10 w-full rounded-md px-3 flex items-center" :style="ghostInputStyle">
        <SearchIcon class="h-5 w-5 mr-2" />
        <span class="truncate" :style="{ color: hexA('#FFFFFF', 0.64) }">Busca tus artistas, películas, etc...</span>
      </div>
      <div class="h-10 w-full rounded-md px-3 flex items-center justify-between" :style="ghostInputStyle">
        <span class="truncate" :style="{ color: hexA('#FFFFFF', 0.64) }">¿Qué te gustaría recibir?</span>
        <ChevronDown class="h-5 w-5" :style="{ color: hexA('#FFFFFF', 0.64) }" />
      </div>
      <p class="text-sm" :style="{ color: hexA('#FFFFFF', 0.72) }">
        Selecciona gustos y el tipo de recomendaciones que deseas.
      </p>
    </div>
  </div>

  <!-- Paso 2 (Demo) -->
  <transition name="fade">
    <div
      v-if="isDemoMode && demoStep >= 2"
      key="step2"
      class="overflow-hidden rounded-xl p-6 backdrop-blur-sm border shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]"
      :style="cardStyle"
      :class="{ 'md:col-span-3': demoStep === 2 }"
    >
      <div class="pt-2">
        <span class="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] rounded-full px-3 py-1" :style="pillStyle">
          Paso 2 <CheckIcon class="h-3.5 w-3.5" />
        </span>
      </div>
      <div class="pb-2 mt-3">
        <h3 class="flex items-center gap-2 font-semibold text-lg" :style="{ color: hexA('#FFFFFF', 0.9) }">
          <TagsIcon class="h-5 w-5" :style="{ color: hexA('#FFFFFF', 0.72) }" />
          Añade gustos y elige tipos
        </h3>
      </div>
      <div class="space-y-4">
        <!-- Dropdown para categorías -->
        <div class="relative">
          <div
            class="h-10 w-full rounded-md px-3 flex items-center justify-between cursor-pointer"
            :style="ghostInputStyle"
            @click="$emit('toggleDropdown')"
          >
            <span class="truncate" :style="{ color: hexA('#FFFFFF', 0.64) }">
              {{ selectedCategory || 'Selecciona una categoría' }}
            </span>
            <ChevronDown class="h-5 w-5 transition-transform duration-200" :class="{ 'rotate-180': isDropdownOpen }" :style="{ color: hexA('#FFFFFF', 0.64) }" />
          </div>
          <ul
            v-if="isDropdownOpen"
            class="absolute z-20 mt-1 w-full rounded-md backdrop-blur-sm border max-h-48 overflow-y-auto"
            :style="cardStyle"
          >
            <li
              v-for="category in categories"
              :key="category"
              class="px-3 py-2 cursor-pointer hover:bg-white/10"
              @mousedown.prevent="$emit('selectCategory', category)"
            >
              {{ category }}
            </li>
          </ul>
        </div>
        <!-- Campo de búsqueda con sugerencias -->
        <div class="relative">
          <div class="h-10 w-full rounded-md px-3 flex items-center" :style="ghostInputStyle">
            <SearchIcon class="h-5 w-5 mr-2" :style="{ color: hexA('#FFFFFF', 0.64) }" />
            <input
              type="text"
              :value="searchQuery"
              @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
              :placeholder="searchPlaceholder"
              class="w-full bg-transparent placeholder-white/60 focus:outline-none"
              :style="{ color: hexA('#FFFFFF', 0.9) }"
              @focus="$emit('update:showSuggestions', true)"
              @blur="$emit('update:showSuggestions', false)"
            />
          </div>
          <ul
            v-if="showSuggestions && searchQuery && filteredSuggestions.length > 0"
            class="absolute z-20 mt-1 w-full rounded-md backdrop-blur-sm border max-h-48 overflow-y-auto"
            :style="cardStyle"
          >
            <li
              v-for="suggestion in filteredSuggestions"
              :key="suggestion"
              class="px-3 py-2 cursor-pointer hover:bg-white/10"
              @mousedown.prevent="$emit('addSuggestion', suggestion)"
            >
              {{ suggestion }}
            </li>
          </ul>
        </div>
        <!-- Segundo Dropdown: ¿Qué te gustaría recibir? -->
        <div class="relative">
          <div
            class="h-10 w-full rounded-md px-3 flex items-center justify-between cursor-pointer"
            :style="ghostInputStyle"
            @click="$emit('toggleReceiveDropdown')"
          >
            <span class="truncate" :style="{ color: hexA('#FFFFFF', 0.64) }">
              {{ selectedReceiveCategory || '¿Qué te gustaría recibir?' }}
            </span>
            <ChevronDown class="h-5 w-5 transition-transform duration-200" :class="{ 'rotate-180': isReceiveDropdownOpen }" :style="{ color: hexA('#FFFFFF', 0.64) }" />
          </div>
          <ul
            v-if="isReceiveDropdownOpen"
            class="absolute z-20 mt-1 w-full rounded-md backdrop-blur-sm border max-h-48 overflow-y-auto"
            :style="cardStyle"
          >
            <li
              v-for="category in receiveCategories"
              :key="category"
              class="px-3 py-2 cursor-pointer hover:bg-white/10"
              @mousedown.prevent="$emit('selectReceiveCategory', category)"
            >
              {{ category }}
            </li>
          </ul>
        </div>
        <p class="text-sm" :style="{ color: hexA('#FFFFFF', 0.72) }">
          Selecciona gustos y el tipo de recomendaciones que deseas.
        </p>
        <div v-if="demoStep === 2" class="text-center">
          <button
            @click="$emit('next')"
            class="mt-4 px-6 py-3 rounded-md font-semibold bg-white text-black transition-transform transform hover:scale-105"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { Check as CheckIcon, Tags as TagsIcon, Search as SearchIcon, ChevronDown } from 'lucide-vue-next';
import { defineProps, computed, withDefaults } from 'vue';
import { hexA, cardStyle, pillStyle, ghostInputStyle } from '../../../utils/styleUtils';

const props = withDefaults(defineProps<{
  isDemoMode: boolean;
  demoStep?: number;
  isDropdownOpen?: boolean;
  selectedCategory?: string;
  categories?: string[];
  searchQuery?: string;
  showSuggestions?: boolean;
  filteredSuggestions?: string[];
  isReceiveDropdownOpen?: boolean;
  selectedReceiveCategory?: string;
  receiveCategories?: string[];
}>(), {
  isDemoMode: false,
  demoStep: 0,
  isDropdownOpen: false,
  selectedCategory: '',
  categories: () => [],
  searchQuery: '',
  showSuggestions: false,
  filteredSuggestions: () => [],
  isReceiveDropdownOpen: false,
  selectedReceiveCategory: '',
  receiveCategories: () => [],
});

defineEmits([
  'toggleDropdown',
  'selectCategory',
  'update:searchQuery',
  'update:showSuggestions',
  'addSuggestion',
  'toggleReceiveDropdown',
  'selectReceiveCategory',
  'next',
]);

const searchPlaceholder = computed(() => {
  if (props.selectedCategory) {
    return `Busca ${props.selectedCategory.toLowerCase()}...`;
  }
  return 'Busca tus artistas, películas, etc...';
});
</script>