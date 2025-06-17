<template>
  <title>MediartStudio - Inicio</title>
  <main class="w-screen h-dvh flex flex-col items-center justify-between p-4">
    <NavigationStudio />

    <div class="flex-grow flex w-2/4 max-md:w-5/6 items-center justify-center">
      <div
        class="w-2/3 h-full glassEffect max-h-[80vh] max-md:w-full max-md:max-h-[70vh] bg-gray-800 bg-opacity-50 rounded-lg flex items-center justify-center text-white text-xl"
      ></div>
    </div>

    <div class="flex items-center justify-center w-full mb-4">
      <div class="relative w-1/3 max-md:w-2/3">
        <div
          class="glassEffect shadow-xl rounded-lg p-3 text-white flex flex-wrap items-center gap-2 min-h-[48px]"
          @click="focusInput"
        >
          <span
            v-for="tag in selectedTags"
            :key="tag"
            class="bg-white/20 rounded-full px-3 py-1 text-sm flex items-center gap-1"
          >
            {{ tag }}
            <button @click.stop="removeTag(tag)" class="text-xs cursor-pointer">
              ✕
            </button>
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
      <select
        v-model="selectedCategory"
        class="ml-3 p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
      >
        <option value="mix">mix</option>
        <option value="songs">songs</option>
        <option value="artists">artists</option>
        <option value="albums">albums</option>
        <option value="movies">movies</option>
        <option value="tvshows">tvshows</option>
        <option value="books">books</option>
        <option value="videogames">videogames</option>
      </select>
      <svg
        @click="sendData"
        class="icon ml-3 cursor-pointer"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="30"
        height="30"
      >
        <path fill="currentColor" d="M3 20v-6l8-2l-8-2V4l19 8z" />
      </svg>
    </div>
  </main>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

import { ref, computed, onMounted, watch } from "vue";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";

const inputValue = ref("");
const selectedTags = ref<string[]>([]);
const suggestions = ref<string[]>([]);
const showDatalist = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);
const config = useRuntimeConfig();

// New reactive variable for the selected category
const selectedCategory = ref<string>("mix"); // Default to 'mix'

// Function to fetch suggestions from the API
const fetchSuggestions = async () => {
  if (inputValue.value.length < 2) {
    suggestions.value = [];
    return;
  }
  try {
    const response = await fetch(
      `${config.public.apiBaseUrl}/api/search?q=${inputValue.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

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
    if (data.movies) {
      newSuggestions.push(
        ...data.movies.map((movie: any) => movie.title || movie.name)
      );
    }
    if (data.tvshows) {
      newSuggestions.push(
        ...data.tvshows.map((tvshow: any) => tvshow.title || tvshow.name)
      );
    }
    if (data.books) {
      newSuggestions.push(
        ...data.books.map((book: any) => book.title || book.name)
      );
    }
    if (data.videogames) {
      newSuggestions.push(
        ...data.videogames.map((game: any) => game.title || game.name)
      );
    }

    suggestions.value = Array.from(new Set(newSuggestions));
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    suggestions.value = [];
  }
};

const filteredSuggestions = computed(() => {
  if (!inputValue.value) {
    return suggestions.value
      .filter((s) => !selectedTags.value.includes(s))
      .slice(0, 10);
  }
  const lowerCaseInput = inputValue.value.toLowerCase();
  return suggestions.value
    .filter(
      (s) =>
        s.toLowerCase().includes(lowerCaseInput) &&
        !selectedTags.value.includes(s)
    )
    .slice(0, 10);
});

watch(inputValue, (newValue) => {
  if (newValue.length > 0) {
    fetchSuggestions();
  } else {
    suggestions.value = [];
  }
});

const onInput = () => {
  showDatalist.value = true;
};

const selectSuggestion = (suggestion: string) => {
  if (!selectedTags.value.includes(suggestion)) {
    selectedTags.value.push(suggestion);
  }
  inputValue.value = "";
  showDatalist.value = false;
  searchInput.value?.focus();
};

const addTagFromInput = () => {
  const lowerCaseInputValue = inputValue.value.toLowerCase();

  const isSuggestion = filteredSuggestions.value.some(
    (s) => s.toLowerCase() === lowerCaseInputValue
  );

  if (
    inputValue.value &&
    isSuggestion &&
    !selectedTags.value.includes(inputValue.value)
  ) {
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

// New function to handle sending data
const sendData = async () => {
  if (selectedTags.value.length === 0) {
    console.warn("No tags selected to send.");
    return;
  }

  const tagsQueryParam = selectedTags.value
    .map((tag) => encodeURIComponent(tag))
    .join(",");
  const url = `${config.public.apiBaseUrl}/api/search/${selectedCategory.value}?tags=${tagsQueryParam}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any necessary authorization headers here, e.g.:
        // "Authorization": `Bearer ${yourAuthToken}`
      },
      // If you need to send a request body, add it here:
      // body: JSON.stringify({ tags: selectedTags.value, category: selectedCategory.value }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Data sent successfully:", result);
    // Optionally, clear selected tags or show a success message
    // selectedTags.value = [];
  } catch (error) {
    console.error("Error sending data:", error);
  }
};
</script>
