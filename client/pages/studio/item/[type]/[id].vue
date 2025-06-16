<template>
  <title>MediartStudio - Item</title>
  <main class="w-screen h-dvh flex justify-center items-center">
    <NavigationStudio />
    <section
      class="md:w-1/2 lg:w-2/5 max-md:w-5/6 h-fit gap-6 flex flex-col relative items-center justify-center glassEffect p-8 py-16 rounded-lg text-white text-center"
    >
      <div v-if="isLoading" class="flex flex-col items-center gap-4">
        <div class="size-48 bg-white/10 rounded-lg animate-pulse"></div>
        <p class="text-xl animate-pulse">Cargando...</p>
        <p class="text-sm text-white/70">Obteniendo detalles del item.</p>
      </div>

      <div v-else-if="errorMessage" class="flex flex-col items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-16 text-red-400">
          <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.198 0 .585 1.01 1.487 1.972 2.573 2.969C19.795 7.697 21 9.57 21 11.5c0 1.93-.943 3.738-2.585 5.06A6.974 6.974 0 0 1 12 21a6.974 6.974 0 0 1-6.415-4.44C3.943 15.238 3 13.43 3 11.5c0-1.93 1.205-3.803 3.829-6.03C7.914 4.975 8.816 4.013 9.401 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
        </svg>
        <p class="text-xl text-red-400">Error</p>
        <p class="text-sm text-white/70">{{ errorMessage }}</p>
        <NuxtLink to="/studio" class="mt-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded transition-colors">Volver al Estudio</NuxtLink>
      </div>

      <div v-else-if="itemDetails">
        <img
          :src="itemDetails.thumbnail_url || itemDetails.image_url || '/_nuxt/assets/resources/studio/placeholder-image.webp'"
          alt="Item Thumbnail"
          :class="{
            'rounded-lg': route.params.type === 'song' || route.params.type === 'album',
            'rounded-full': route.params.type === 'artist',
            'size-48 object-cover border-2 border-white/50 shadow-lg mb-6': true
          }"
        />

        <h2 class="text-4xl font-bold mb-2">{{ itemDetails.title || itemDetails.name }}</h2>

        <div v-if="route.params.type === 'song'" class="text-white/80">
          <p class="text-xl mb-1">{{ itemDetails.artist_name }}</p>
          <p class="text-lg">{{ itemDetails.album_name }}</p>
          <p class="text-sm text-white/60">Lanzamiento: {{ itemDetails.release_date }}</p>
        </div>

        <div v-else-if="route.params.type === 'artist'" class="text-white/80">
          <p class="text-lg mb-1">Seguidores: {{ itemDetails.followers?.toLocaleString() || 'N/A' }}</p>
          <p v-if="itemDetails.genres && itemDetails.genres.length" class="text-sm text-white/60">Géneros: {{ itemDetails.genres.join(', ') }}</p>
        </div>

        <div v-else-if="route.params.type === 'album'" class="text-white/80">
          <p class="text-xl mb-1">{{ itemDetails.artist_name }}</p>
          <p class="text-sm text-white/60">Lanzamiento: {{ itemDetails.release_date }}</p>
        </div>

        <a
          v-if="itemDetails.external_url"
          :href="itemDetails.external_url"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-6 inline-flex items-center bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-colors shadow-lg"
        >
          Ver en Plataforma Externa
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5 ml-2">
            <path fill-rule="evenodd" d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-9.294 9.292a3.75 3.75 0 1 0 5.304 5.304L19.902 9.402a3.75 3.75 0 0 0 0-5.304ZM2.25 18.75a.75.75 0 0 0 0 1.5c5.4 0 10.63-4.133 11.357-9.175a.75.75 0 0 0-1.49-.175c-.477 3.256-3.262 5.725-6.197 5.725Z" clip-rule="evenodd" />
          </svg>
        </a>
      </div>

    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";

definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

// Define interfaces for each item type to ensure type safety
interface Song {
  id: string;
  title: string;
  artist_name: string;
  album_name: string;
  release_date: string;
  thumbnail_url: string;
  external_url: string;
}

interface Artist {
  id: string;
  name: string;
  genres: string[];
  followers: number;
  image_url: string;
  external_url: string;
}

interface Album {
  id: string;
  name: string;
  artist_name: string;
  release_date: string;
  thumbnail_url: string;
  external_url: string;
}

// Union type for possible item details
type ItemDetails = Song | Artist | Album | null;

const route = useRoute();
const config = useRuntimeConfig();

const itemDetails = ref<ItemDetails>(null);
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);

// Function to fetch item details based on type and ID
const fetchItemDetails = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  const itemType = route.params.type as string; // 'song', 'artist', 'album'
  const itemId = route.params.id as string; // The ID of the specific item

  if (!itemType || !itemId) {
    errorMessage.value = "URL inválida. Faltan el tipo o el ID del item.";
    isLoading.value = false;
    return;
  }

  try {
    // Construct the API URL. This example uses a simplified approach.
    // In a real scenario, your backend would likely have specific endpoints
    // like /api/songs/:id, /api/artists/:id, /api/albums/:id
    // For this example, we'll simulate by fetching all search results
    // and then finding the specific item.
    // **IMPORTANT**: You should adapt this to your actual backend structure.
    const apiUrl = `${config.public.apiBaseUrl}/api/search?q=${itemType}`; // Simulates fetching a list of items of that type

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los detalles del ${itemType}.`);
    }

    const data = await response.json();

    // Find the specific item from the fetched data based on its ID
    let foundItem: ItemDetails = null;

    if (itemType === 'song' && data.songs) {
      foundItem = data.songs.find((s: Song) => s.id === itemId);
    } else if (itemType === 'artist' && data.artists) {
      foundItem = data.artists.find((a: Artist) => a.id === itemId);
    } else if (itemType === 'album' && data.albums) {
      foundItem = data.albums.find((a: Album) => a.id === itemId);
    }

    if (foundItem) {
      itemDetails.value = foundItem;
    } else {
      errorMessage.value = `No se encontró el ${itemType} con ID: ${itemId}.`;
    }

  } catch (error: any) {
    console.error("Error fetching item details:", error);
    errorMessage.value = error.message || "Ocurrió un error al cargar el item.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchItemDetails();
});
</script>
