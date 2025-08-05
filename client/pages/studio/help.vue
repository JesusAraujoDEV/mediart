<template>
  <title>MediartStudio - {{ currentContent.pageTitle }}</title>
  <main class="w-screen h-dvh flex flex-col items-center justify-start p-4 text-white">
    <NavigationStudio />

    <div class="w-full flex justify-end p-4 z-10">
      <button @click="toggleLanguage"
        class="glassEffect px-4 cursor-pointer py-2 rounded-full text-sm font-semibold transition-colors duration-200"
        :class="{
          'bg-blue-600 hover:bg-blue-700': currentLanguage === 'en',
          'bg-purple-600 hover:bg-purple-700': currentLanguage === 'es',
        }">
        {{ currentLanguage === "en" ? "Español" : "English" }}
      </button>
    </div>

    <div
      class="glassEffect w-3/4 max-md:w-full max-h-[90vh] overflow-y-auto bg-gray-800 bg-opacity-50 rounded-lg p-8 shadow-xl">
      <h1 class="text-3xl font-bold mb-6 text-center">
        {{ currentContent.title }}
      </h1>
      <p class="text-lg mb-8 text-center">{{ currentContent.intro }}</p>

      <hr class="my-6 border-gray-600" />

      <h2 class="text-2xl font-semibold mb-4">
        1. {{ currentContent.step1.heading }}
      </h2>
      <p class="mb-6">
        {{ currentContent.step1.paragraph1 }}
        <strong class="text-blue-300">{{ currentContent.step1.strong1 }}</strong>. {{ currentContent.step1.paragraph2 }}
        <strong class="text-blue-300">{{ currentContent.step1.strong2 }}</strong>. {{ currentContent.step1.paragraph3 }}
        <strong class="text-blue-300">{{
          currentContent.step1.strong3
          }}</strong>
        {{ currentContent.step1.paragraph4 }}
      </p>

      <hr class="my-6 border-gray-600" />

      <h2 class="text-2xl font-semibold mb-4">
        2. {{ currentContent.step2.heading }}
      </h2>
      <p class="mb-6">
        {{ currentContent.step2.paragraph1 }}
        <strong class="text-blue-300">{{ currentContent.step2.strong1 }}</strong>. {{ currentContent.step2.paragraph2 }}
        <strong class="text-blue-300">{{ currentContent.step2.strong2 }}</strong>. {{ currentContent.step2.paragraph3 }}
      </p>

      <hr class="my-6 border-gray-600" />

      <h2 class="text-2xl font-semibold mb-4">
        3. {{ currentContent.step3.heading }}
      </h2>
      <p class="mb-6">
        {{ currentContent.step3.paragraph1 }}
        <strong class="text-blue-300">{{ currentContent.step3.strong1 }}</strong>. {{ currentContent.step3.paragraph2 }}
      </p>
      <ul class="list-disc list-inside ml-4 mb-6">
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list1Strong }}:</strong>
          {{ currentContent.step3.listItem1 }}
        </li>
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list2Strong }}:</strong>
          {{ currentContent.step3.listItem2 }}
        </li>
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list3Strong }}:</strong>
          {{ currentContent.step3.listItem3 }}
        </li>
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list4Strong }}:</strong>
          {{ currentContent.step3.listItem4 }}
        </li>
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list5Strong }}:</strong>
          {{ currentContent.step3.listItem5 }}
        </li>
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list6Strong }}:</strong>
          {{ currentContent.step3.listItem6 }}
        </li>
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list7Strong }}:</strong>
          {{ currentContent.step3.listItem7 }}
        </li>
        <li>
          <strong class="text-blue-300">{{ currentContent.step3.list8Strong }}:</strong>
          {{ currentContent.step3.listItem8 }}
        </li>
      </ul>
      <p class="mb-6">
        {{ currentContent.step3.paragraph3 }}
      </p>

      <hr class="my-6 border-gray-600" />

      <h2 class="text-2xl font-semibold mb-4">
        4. {{ currentContent.step4.heading }}
      </h2>
      <p class="mb-6">
        {{ currentContent.step4.paragraph1 }}
        <strong class="text-blue-300">{{ currentContent.step4.strong1 }}</strong>. {{ currentContent.step4.paragraph2 }}
        <strong class="text-blue-300">{{
          currentContent.step4.strong2
          }}</strong>
        {{ currentContent.step4.paragraph3 }}
      </p>

      <hr class="my-6 border-gray-600" />

      <h2 class="text-2xl font-semibold mb-4">
        5. {{ currentContent.step5.heading }}
      </h2>
      <p class="mb-6">
        {{ currentContent.step5.paragraph1 }}
        <strong class="text-blue-300">{{ currentContent.step5.strong1 }}</strong>.
      </p>
      <ul class="list-disc list-inside ml-4 mb-6">
        <li>
          {{ currentContent.step5.listItem1 }}
          <strong class="text-blue-300">{{
            currentContent.step5.listStrong1
            }}</strong>.
        </li>
        <li>
          {{ currentContent.step5.listItem2 }}
          <strong class="text-blue-300">{{
            currentContent.step5.listStrong2
            }}</strong>
          {{ currentContent.step5.listItem3 }}
        </li>
      </ul>

      <hr class="my-6 border-gray-600" />

      <h2 class="text-2xl font-semibold mb-4">
        6. {{ currentContent.step6.heading }}
      </h2>
      <p class="mb-8">
        {{ currentContent.step6.paragraph1 }}
        <strong class="text-blue-300">{{ currentContent.step6.strong1 }}</strong>. {{ currentContent.step6.paragraph2 }}
        <strong class="text-blue-300">{{
          currentContent.step6.strong2
          }}</strong>
        {{ currentContent.step6.paragraph3 }}
      </p>

      <p class="text-lg font-bold text-center">
        {{ currentContent.outro }}
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue"; // Assuming NavigationStudio is in components/navigation

definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

// Reactive variable for the current language, default to English
const currentLanguage = ref("en");

// Function to toggle language
const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === "en" ? "es" : "en";
};

// Define all content in both languages
const content = {
  en: {
    pageTitle: "Help",
    title: "How to Use MediartStudio",
    intro:
      "Welcome to MediartStudio! Here's how you can easily generate and save your personalized playlists:",
    step1: {
      heading: "Express Your Tastes",
      paragraph1: "At the bottom of the screen, you'll find a",
      strong1: "text input field",
      paragraph2:
        "This is where you'll start expressing your preferences. You can type in names of",
      strong2:
        "songs, artists, albums, movies, TV shows, books, or video games",
      paragraph3: "As you type, the system will offer",
      strong3: "suggestions",
      paragraph4: "to help you select your interests.",
    },
    step2: {
      heading: "Select Your Tags",
      paragraph1: "Once suggestions appear, you can",
      strong1: "select as many tastes (tags) as you wish",
      paragraph2:
        'by clicking on them. Each selection will be added as a visible "tag" in the same field. If you change your mind, you can',
      strong2: "remove a tag",
      paragraph3: "by clicking the '✕' icon next to it.",
    },
    step3: {
      heading: "Choose the Category",
      paragraph1: "To the right of the text field, you'll see a",
      strong1: "dropdown menu (select)",
      paragraph2:
        "This allows you to specify the content category you want the system to consider when generating your playlist. Options include:",
      list1Strong: "Mix (default)",
      listItem1: "For a varied playlist combining all media types.",
      list2Strong: "Songs",
      listItem2: "Focused exclusively on songs.",
      list3Strong: "Artists",
      listItem3: "Centered on artists.",
      list4Strong: "Albums",
      listItem4: "Based on albums.",
      list5Strong: "Movies",
      listItem5: "For movie-related playlists.",
      list6Strong: "Tvshows",
      listItem6: "For TV show content.",
      list7Strong: "Books",
      listItem7: "Generates playlists inspired by books.",
      list8Strong: "Videogames",
      listItem8: "For playlists based on video games.",
      paragraph3:
        "Make sure to select the category that best suits your mood or need.",
    },
    step4: {
      heading: "Generate Your Playlist",
      paragraph1:
        "Once you've selected your tastes and the category, click the",
      strong1: "send button (the paper airplane icon)",
      paragraph2: "MediartStudio will process your request and",
      strong2: "generate a playlist",
      paragraph3: "based on your preferences.",
    },
    step5: {
      heading: "Review and Refine",
      paragraph1:
        "After the playlist is generated, you'll have the option to either",
      strong1: "accept or reformulate it",
      listItem1: "If you're satisfied with the playlist, click",
      listStrong1: "Accept",
      listItem2: "If you want to try something different, you can",
      listStrong2: "reformulate it",
      listItem3:
        "by entering new tastes or adjusting the category, and then resubmit the request.",
    },
    step6: {
      heading: "Name and Save",
      paragraph1:
        "Finally, once you've accepted the generated playlist, you'll be prompted to",
      strong1: "give it a name",
      paragraph2: "Choose a name you like, and the playlist will be",
      strong2: "automatically saved to your profile",
      paragraph3: "ready for you to enjoy anytime.",
    },
    outro: "Enjoy creating your personalized playlists with MediartStudio!",
  },
  es: {
    pageTitle: "Ayuda",
    title: "¿Cómo Usar MediartStudio?",
    intro:
      "¡Bienvenido a MediartStudio! Aquí te explicamos cómo puedes generar y guardar tus playlists personalizadas de manera sencilla:",
    step1: {
      heading: "1. Expresa Tus Gustos",
      paragraph1: "En la parte inferior de la pantalla, encontrarás un",
      strong1: "campo de texto",
      paragraph2:
        "Aquí es donde comenzarás a expresar tus preferencias. Puedes escribir nombres de",
      strong2:
        "canciones, artistas, álbumes, películas, series de televisión, libros o videojuegos",
      paragraph3: "A medida que escribes, el sistema te ofrecerá",
      strong3: "sugerencias",
      paragraph4: "para ayudarte a seleccionar tus intereses.",
    },
    step2: {
      heading: "2. Selecciona Tus Etiquetas (Tags)",
      paragraph1: "Una vez que las sugerencias aparezcan, puedes",
      strong1: "seleccionar la cantidad de gustos (etiquetas) que desees",
      paragraph2:
        'haciendo clic en ellas. Cada selección se añadirá como una "etiqueta" visible en el mismo campo. Si cambias de opinión, puedes',
      strong2: "eliminar una etiqueta",
      paragraph3: "haciendo clic en el ícono '✕' junto a ella.",
    },
    step3: {
      heading: "3. Elige la Categoría",
      paragraph1: "A la derecha del campo de texto, verás un",
      strong1: "menú desplegable (select)",
      paragraph2:
        "Este te permite especificar la categoría de contenido que deseas que el sistema considere al generar tu playlist. Las opciones incluyen:",
      list1Strong: "Mix (por defecto)",
      listItem1:
        "Para una playlist variada que combina todos los tipos de medios.",
      list2Strong: "Canciones",
      listItem2: "Enfocada exclusivamente en canciones.",
      list3Strong: "Artistas",
      listItem3: "Centrada en artistas.",
      list4Strong: "Álbumes",
      listItem4: "Basada en álbumes.",
      list5Strong: "Películas",
      listItem5: "Para playlists relacionadas con películas.",
      list6Strong: "Series de TV",
      listItem6: "Para contenido de series de televisión.",
      list7Strong: "Libros",
      listItem7: "Genera playlists inspiradas en libros.",
      list8Strong: "Videojuegos",
      listItem8: "Para playlists basadas en videojuegos.",
      paragraph3:
        "Asegúrate de seleccionar la categoría que mejor se adapte a tu estado de ánimo o necesidad.",
    },
    step4: {
      heading: "4. Genera Tu Playlist",
      paragraph1:
        "Una vez que hayas seleccionado tus gustos y la categoría, haz clic en el",
      strong1: "botón de enviar (el ícono de avión de papel)",
      paragraph2: "MediartStudio procesará tu solicitud y",
      strong2: "generará una playlist",
      paragraph3: "basada en tus preferencias.",
    },
    step5: {
      heading: "5. Revisa y Refina",
      paragraph1:
        "Después de que la playlist sea generada, tendrás la opción de",
      strong1: "aceptarla o reformularla",
      listItem1: "Si estás satisfecho con la playlist, haz clic en",
      listStrong1: "Aceptar",
      listItem2: "Si deseas probar algo diferente, puedes",
      listStrong2: "reformularla",
      listItem3:
        "introduciendo nuevos gustos o ajustando la categoría, y luego volver a enviar la solicitud.",
    },
    step6: {
      heading: "6. Nombra y Guarda",
      paragraph1:
        "Finalmente, una vez que hayas aceptado la playlist generada, se te pedirá que le",
      strong1: "pongas un nombre",
      paragraph2: "Elige un nombre que te guste, y la playlist",
      strong2: "se guardará automáticamente en tu perfil",
      paragraph3: "lista para que la disfrutes en cualquier momento.",
    },
    outro: "¡Disfruta creando tus playlists personalizadas con MediartStudio!",
  },
};

// Computed property to get the content for the current language
const currentContent = computed(() => {
  return content[currentLanguage.value as keyof typeof content];
});
</script>

<style scoped>
/* Add a subtle scrollbar style for better aesthetics in the glass effect container */
div::-webkit-scrollbar {
  width: 8px;
}

div::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  /* Light translucent track */
  border-radius: 10px;
}

div::-webkit-scrollbar-thumb {
  background-color: rgba(255,
      255,
      255,
      0.2);
  /* Slightly darker translucent thumb */
  border-radius: 10px;
  border: 2px solid transparent;
  /* To prevent bleeding outside border-radius */
  background-clip: padding-box;
  /* Crucial for border-radius with transparent border */
}

div::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
