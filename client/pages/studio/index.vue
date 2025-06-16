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
    middleware: [
    'auth-middleware',
  ],
});

import { ref, computed, onMounted, watch } from "vue"; // Import 'watch'
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";

const inputValue = ref("");
const selectedTags = ref<string[]>([]);
const suggestions = ref<string[]>([]);
const showDatalist = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);
const config = useRuntimeConfig();

// Function to fetch suggestions from the API
const fetchSuggestions = async () => {
  if (inputValue.value.length < 2) { // Optional: only fetch if input has at least 2 characters
    suggestions.value = [];
    return;
  }
  try {
    const response = await fetch(`${config.public.apiBaseUrl}/api/search?q=${inputValue.value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    // Process the data to extract suggestions from various categories
    const newSuggestions: string[] = [];

    if (data.songs) {
      newSuggestions.push(...data.songs.map((song: any) => song.title));
    }
    if (data.artists) {
      newSuggestions.push(...data.artists.map((artist: any) => artist.name));
    }
    if (data.albums) {
      newSuggestions.push(...data.albums.map((album: any) => album.name));
    }
    // Add other categories if needed (movies, tvshows, books, videogames)
    if (data.movies) {
      newSuggestions.push(...data.movies.map((movie: any) => movie.title || movie.name)); // Assuming 'title' or 'name' for movies
    }
    if (data.tvshows) {
      newSuggestions.push(...data.tvshows.map((tvshow: any) => tvshow.title || tvshow.name)); // Assuming 'title' or 'name' for tvshows
    }
    if (data.books) {
      newSuggestions.push(...data.books.map((book: any) => book.title || book.name)); // Assuming 'title' or 'name' for books
    }
    if (data.videogames) {
      newSuggestions.push(...data.videogames.map((game: any) => game.title || game.name)); // Assuming 'title' or 'name' for videogames
    }

    // Remove duplicates and update suggestions
    suggestions.value = Array.from(new Set(newSuggestions));

  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    suggestions.value = []; // Clear suggestions on error
  }
};

const filteredSuggestions = computed(() => {
  if (!inputValue.value) {
    // If no input, show recent/popular suggestions (can be empty after initial fetch)
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

// Trigger fetchSuggestions when inputValue changes
watch(inputValue, (newValue) => {
  if (newValue.length > 0) { // Only fetch if there's something to search for
    fetchSuggestions();
  } else {
    suggestions.value = []; // Clear suggestions if input is empty
  }
});


const onInput = () => {
  // `watch(inputValue, ...)` now handles the fetching logic.
  // This `onInput` function primarily ensures the datalist is shown.
  showDatalist.value = true;
};

const selectSuggestion = (suggestion: string) => {
  if (!selectedTags.value.includes(suggestion)) {
    selectedTags.value.push(suggestion);
  }
  inputValue.value = ""; // Clear input after selection
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
  // No initial fetch needed here as `watch(inputValue, ...)` will handle it
  // when the user starts typing.
});
</script>
