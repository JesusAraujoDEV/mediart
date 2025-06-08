<template>
  <title>MediartStudio - Inicio</title>
  <main class="w-screen h-dvh flex items-center justify-center gap-4">
    <NavigationStudio />
    <div class="relative w-1/3 max-md:w-2/3">
      <div
        class="glassEffect rounded-lg p-3 text-white flex flex-wrap items-center gap-2 min-h-[48px]"
        @click="focusInput"
      >
        <span
          v-for="tag in selectedTags"
          :key="tag"
          class="bg-white/20 rounded-full px-3 py-1 text-sm flex items-center gap-1"
        >
          {{ tag }}
          <button @click.stop="removeTag(tag)" class="text-xs cursor-pointer">✕</button>
        </span>
        <input
          ref="searchInput"
          type="text"
          class="bg-transparent flex-grow outline-none text-white placeholder-white/70"
          placeholder="Type your query here..."
          v-model="inputValue"
          @input="onInput"
          @focus="showDatalist = true"
          @blur="hideDatalist"
          @keydown.enter="addTagFromInput"
          @keydown.tab="addTagFromInput"
        />
      </div>

      <ul
        v-if="showDatalist && filteredSuggestions.length > 0"
        class="absolute z-10 w-full bg-white/10 backdrop-filter backdrop-blur-lg rounded-lg mt-1 max-h-48 overflow-y-auto"
      >
        <li
          v-for="suggestion in filteredSuggestions"
          :key="suggestion"
          @mousedown.prevent="selectSuggestion(suggestion)"
          class="p-2 cursor-pointer hover:bg-white/30 text-white"
        >
          {{ suggestion }}
        </li>
      </ul>
    </div>
    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M3 20v-6l8-2l-8-2V4l19 8z"
      />
    </svg>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom",
});

import { ref, computed, onMounted } from "vue";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";

const inputValue = ref("");
const selectedTags = ref<string[]>([]);
const suggestions = ref<string[]>([]);
const showDatalist = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);

const defaultSuggestions = [
  "Taylor Swift",
  "Cantantes",
  "Libros",
  "Juegos",
  "Películas",
];

// Simulate a fetch request
const fetchSuggestions = async () => {
  try {
    // const response = await fetch("https://api.example.com/suggestions");
    // if (!response.ok) {
    //   throw new Error("Network response was not ok");
    // }
    // const data = await response.json();
    // suggestions.value = data.suggestions; // Assuming your API returns { suggestions: [...] }

    await new Promise((resolve) => setTimeout(resolve, 500));
    suggestions.value = [
      "The Lord of the Rings",
      "Harry Potter",
      "Game of Thrones",
      "Marvel Movies",
      "Programming Books",
      "Indie Games",
    ];
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    suggestions.value = defaultSuggestions;
  }
};

const filteredSuggestions = computed(() => {
  if (!inputValue.value) {
    return suggestions.value.filter(
      (s) => !selectedTags.value.includes(s)
    ).slice(0, 10);
  }
  const lowerCaseInput = inputValue.value.toLowerCase();
  return suggestions.value.filter(
    (s) =>
      s.toLowerCase().includes(lowerCaseInput) &&
      !selectedTags.value.includes(s)
  ).slice(0, 10);
});

const onInput = () => {
  // Logic can be added here for more advanced filtering or fetching as user types
  showDatalist.value = true;
};

const selectSuggestion = (suggestion: string) => {
  if (!selectedTags.value.includes(suggestion)) {
    selectedTags.value.push(suggestion);
  }
  inputValue.value = "";
  showDatalist.value = false;
  searchInput.value?.focus(); // Keep focus on the input
};

const addTagFromInput = () => {
  if (inputValue.value && !selectedTags.value.includes(inputValue.value)) {
    selectedTags.value.push(inputValue.value);
    inputValue.value = "";
    showDatalist.value = false;
  }
};

const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter((t) => t !== tag);
};

const focusInput = () => {
  searchInput.value?.focus();
  showDatalist.value = true;
};

const hideDatalist = () => {
  setTimeout(() => {
    showDatalist.value = false;
  }, 100);
};

onMounted(() => {
  fetchSuggestions();
});
</script>
