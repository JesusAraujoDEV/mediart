<template>
  <!-- Paso 3 (Estático) -->
  <div v-if="!isDemoMode" class="overflow-hidden rounded-xl p-6 backdrop-blur-sm border shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]" :style="cardStyle">
    <div class="pt-2">
      <span class="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] rounded-full px-3 py-1" :style="pillStyle">
        Paso 3 <CheckIcon class="h-3.5 w-3.5" />
      </span>
    </div>
    <div class="pb-2 mt-3">
      <h3 class="flex items-center gap-2 font-semibold text-lg whitespace-nowrap" :style="{ color: hexA('#FFFFFF', 0.9) }">
        <LibraryIcon class="h-5 w-5" :style="{ color: hexA('#FFFFFF', 0.72) }" />
        Recibe y organiza recomendaciones
      </h3>
    </div>
    <div class="space-y-4">
      <div class="space-y-2">
        <div
          v-for="(collection, i) in collections"
          :key="i"
          class="w-full rounded-md p-3 border"
          :style="collectionItemStyle"
        >
          <div class="text-sm" :style="{ color: hexA('#FFFFFF', 0.92) }">{{ collection.title }}</div>
          <div class="text-xs" :style="{ color: hexA('#FFFFFF', 0.66) }">{{ collection.meta }}</div>
        </div>
      </div>
      <p class="text-sm" :style="{ color: hexA('#FFFFFF', 0.72) }">
        Guarda contenido en tus colecciones y consúltalo cuando quieras.
      </p>
    </div>
  </div>

  <!-- Paso 3 (Demo) -->
  <transition name="fade">
    <div
      v-if="isDemoMode && demoStep >= 3"
      key="step3"
      class="overflow-hidden rounded-xl p-6 backdrop-blur-sm border shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)]"
      :style="cardStyle"
      :class="{ 'md:col-span-3': demoStep === 3 }"
    >
      <div class="pt-2">
        <span class="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] rounded-full px-3 py-1" :style="pillStyle">
          Paso 3 <CheckIcon class="h-3.5 w-3.5" />
        </span>
      </div>
      <div class="pb-2 mt-3">
        <h3 class="flex items-center gap-2 font-semibold text-lg whitespace-nowrap" :style="{ color: hexA('#FFFFFF', 0.9) }">
          <LibraryIcon class="h-5 w-5" :style="{ color: hexA('#FFFFFF', 0.72) }" />
          Recibe y organiza recomendaciones
        </h3>
      </div>
      <div class="space-y-4">
        <div v-if="!isLoading && !showSuggestionsResult">
          <div class="flex justify-center">
            <button
              @click="$emit('generateSuggestions')"
              class="mt-4 px-6 py-3 rounded-md font-semibold bg-white text-black transition-transform transform hover:scale-105"
            >
              Generar Sugerencias
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="text-center my-8">
          <div class="loader ease-linear rounded-full border-4 border-t-4 border-white h-12 w-12 mb-4 mx-auto"></div>
          <p>Generando sugerencias...</p>
        </div>

        <div v-if="showSuggestionsResult && !suggestionsAccepted">
          <div class="space-y-2">
            <div
              v-for="(suggestion, i) in generatedSuggestions"
              :key="i"
              class="w-full rounded-md p-3 border"
              :style="collectionItemStyle"
            >
              <div class="text-sm" :style="{ color: hexA('#FFFFFF', 0.92) }">{{ suggestion.title }}</div>
              <div class="text-xs" :style="{ color: hexA('#FFFFFF', 0.66) }">{{ suggestion.meta }}</div>
            </div>
          </div>
          <div class="mt-4 flex gap-4 justify-center">
            <button
              @click="$emit('acceptSuggestions')"
              class="px-6 py-3 rounded-md font-semibold bg-green-500 text-white transition-transform transform hover:scale-105"
            >
              Aceptar
            </button>
            <button
              @click="$emit('regenerateSuggestions')"
              class="px-6 py-3 rounded-md font-semibold bg-gray-600 text-white transition-transform transform hover:scale-105"
            >
              Regenerar
            </button>
          </div>
        </div>

        <div v-if="suggestionsAccepted">
          <div class="space-y-2">
            <div
              v-for="(collection, i) in collections"
              :key="i"
              class="w-full rounded-md p-3 border"
              :style="collectionItemStyle"
            >
              <div class="text-sm" :style="{ color: hexA('#FFFFFF', 0.92) }">{{ collection.title }}</div>
              <div class="text-xs" :style="{ color: hexA('#FFFFFF', 0.66) }">{{ collection.meta }}</div>
            </div>
          </div>
        </div>

        <p class="text-sm mt-4" :style="{ color: hexA('#FFFFFF', 0.72) }">
          Guarda contenido en tus colecciones y consúltalo cuando quieras.
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { Check as CheckIcon, Library as LibraryIcon } from 'lucide-vue-next';
import { withDefaults, defineProps } from 'vue';
import { hexA, cardStyle, pillStyle, collectionItemStyle } from '../../../utils/styleUtils';

interface Collection {
  title: string;
  meta: string;
}

const props = withDefaults(defineProps<{
  isDemoMode: boolean;
  collections: Collection[];
  demoStep?: number;
  isLoading?: boolean;
  showSuggestionsResult?: boolean;
  suggestionsAccepted?: boolean;
  generatedSuggestions?: Collection[];
}>(), {
  isDemoMode: false,
  demoStep: 0,
  isLoading: false,
  showSuggestionsResult: false,
  suggestionsAccepted: false,
  generatedSuggestions: () => [],
  collections: () => [],
});

defineEmits(['generateSuggestions', 'acceptSuggestions', 'regenerateSuggestions']);
</script>