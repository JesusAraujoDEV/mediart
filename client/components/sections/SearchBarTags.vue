<template>
  <div class="relative flex-grow mr-3 max-md:mr-0 max-md:w-full">
    <div
      class="glassEffect shadow-xl rounded-full p-3 flex flex-wrap items-center gap-2 min-h-[48px] border border-gray-700 transition-all duration-300"
      :class="{
        'rounded-2xl': selectedTags.length > 2,
        'rounded-xl': selectedTags.length > 1 && selectedTags.length <= 2,
        'rounded-full': selectedTags.length <= 1
      }" @click="focusInputEl">
      <span v-for="tag in selectedTags" :key="tag.title"
        class="bg-white/20 rounded-full px-3 py-1 text-sm flex items-center gap-1 backdrop-blur-sm flex-shrink-0 max-w-[200px]">
        <span class="truncate">{{ tag.title }}</span>
        <button @click.stop="removeTag(tag)"
          class="text-xs cursor-pointer text-white/80 hover:text-white ml-1 flex-shrink-0">
          ✕
        </button>
      </span>

      <input ref="inputRef" type="text"
        class="bg-transparent flex-grow outline-none text-white placeholder-white/60 min-w-[120px] max-md:min-w-[80px]"
        :placeholder="getSearchPlaceholder()" v-model="inputValue" @input="onInput" @focus="showDatalist = true"
        @blur="hideDatalist" @keydown.enter="addTagFromInput" @keydown.tab.prevent="addTagFromInput" />
    </div>

    <Transition name="fade-slide-down">
      <ul v-if="showDatalist && filteredSuggestions.length > 0"
        class="absolute z-10 w-full bg-gray-800/90 backdrop-filter backdrop-blur-lg rounded-lg mt-2 max-h-48 overflow-y-auto shadow-xl border border-gray-700">
        <li v-for="suggestion in filteredSuggestions" :key="suggestion.title"
          @mousedown.prevent="selectSuggestion(suggestion)"
          class="p-2 cursor-pointer hover:bg-gray-700/70 text-white text-sm flex items-center">
          <img v-if="suggestion.coverUrl" :src="suggestion.coverUrl" :alt="suggestion.title"
            class="w-8 h-8 object-cover rounded mr-3 flex-shrink-0" />
          <div v-else
            class="w-8 h-8 bg-gray-600 rounded mr-3 flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
            ?
          </div>
          <div class="flex-grow min-w-0">
            <span class="font-medium truncate block">{{ suggestion.title }}</span>
            <p v-if="suggestion.description" class="text-xs text-gray-400 truncate">
              {{ suggestion.description }}
            </p>
          </div>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { SearchSuggestion } from '~/types/Recommendations';
import { useSuggestions } from '~/composables/useSuggestions';

const emit = defineEmits<{
  (e: 'update:selectedTags', value: SearchSuggestion[]): void;
  (e: 'update:searchType', value: string): void;
  (e: 'changeType', value: string): void;
}>();

const props = defineProps<{
  modelValue?: string; // searchType
  selectedTags?: SearchSuggestion[];
}>();

const {
  inputValue,
  selectedTags,
  suggestions,
  showDatalist,
  searchType,
  filteredSuggestions,
  getSearchPlaceholder,
  fetchSuggestions,
  onInput,
  selectSuggestion,
  addTagFromInput,
  removeTag,
  focusInput,
  hideDatalist,
  onChangeSearchType,
} = useSuggestions();

const inputRef = ref<HTMLInputElement | null>(null);

// inicializar desde props
onMounted(() => {
  if (props.modelValue) {
    searchType.value = props.modelValue;
  }
  if (props.selectedTags?.length) {
    selectedTags.value = [...props.selectedTags];
  }
});

watch(searchType, (val) => {
  emit('update:searchType', val);
  emit('changeType', val);
  onChangeSearchType();
});

watch(selectedTags, (val) => {
  emit('update:selectedTags', val);
}, { deep: true });

const focusInputEl = () => focusInput(inputRef.value);
</script>

<style scoped>
.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
  transition: all 0.3s ease-out;
}

.fade-slide-down-enter-from,
.fade-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>