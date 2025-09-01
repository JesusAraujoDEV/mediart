<template>
  <section
    aria-labelledby="how-it-works-title"
    class="relative w-full min-h-screen py-16 md:py-24 overflow-hidden text-white"
  >
    <!-- Video de fondo optimizado -->
    <video
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      class="absolute inset-0 -z-10 pointer-events-none w-full h-full object-cover"
      style="filter: brightness(0.8);"
      @loadeddata="onVideoLoaded"
    >
      <source src="/landingImages/redBackground.mp4" type="video/mp4" />
      Tu navegador no soporta videos.
    </video>

    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12 md:mb-16">
        <div class="flex items-center justify-center">
          <span
            class="uppercase tracking-[0.18em] rounded-full px-3 py-1 text-[10px]"
            :style="pillStyle"
          >
            Cómo Funciona
          </span>
          <button
            @click="isDemoMode ? exitDemo() : startDemo()"
            class="ml-4 px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 transform"
            :class="isDemoMode ? 'bg-red-600 hover:bg-red-700 text-white shadow-xl' : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-xl'"
          >
            {{ isDemoMode ? 'Salir de Demo' : 'Modo Demo' }}
          </button>
        </div>

        <h2
          id="how-it-works-title"
          class="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight uppercase tracking-tight"
          :style="{ color: hexA('#FFFFFF', 0.96) }"
        >
          Empieza con Mediart, tu Asistente de Arte con IA
        </h2>
        <p class="mt-4 text-sm sm:text-base max-w-3xl mx-auto" :style="{ color: hexA('#FFFFFF', 0.75) }">
          Descubre, organiza y gestiona contenido creativo en tres pasos sencillos.
        </p>
      </div>

      <!-- VISTA ESTÁTICA (sin modo demo activo) -->
      <div class="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-3">
        <template v-if="!isDemoMode">
          <HowItWorksStep1 :is-demo-mode="false" />
          <HowItWorksStep2 :is-demo-mode="false" />
          <HowItWorksStep3 :is-demo-mode="false" :collections="collections" />
        </template>
        <template v-else>
          <HowItWorksStep1
            v-if="demoStep === 1"
            :is-demo-mode="true"
            :demo-step="demoStep"
            v-model:username="username"
            v-model:email="email"
            v-model:password="password"
            @next="nextDemoStep"
          />
          <HowItWorksStep2
            v-if="demoStep === 2"
            :is-demo-mode="true"
            :demo-step="demoStep"
            :is-dropdown-open="isDropdownOpen"
            :selected-category="selectedCategory"
            :categories="categories"
            :filtered-suggestions="filteredSuggestions"
            :is-receive-dropdown-open="isReceiveDropdownOpen"
            :selected-receive-category="selectedReceiveCategory"
            :receive-categories="receiveCategories"
            @toggle-dropdown="toggleDropdown"
            @select-category="selectCategory"
            v-model:searchQuery="searchQuery"
            v-model:showSuggestions="showSuggestions"
            @add-suggestion="addSuggestion"
            @toggle-receive-dropdown="toggleReceiveDropdown"
            @select-receive-category="selectReceiveCategory"
            @next="nextDemoStep"
          />
          <HowItWorksStep3
            v-if="demoStep === 3"
            :is-demo-mode="true"
            :demo-step="demoStep"
            :is-loading="isLoading"
            :show-suggestions-result="showSuggestionsResult"
            :suggestions-accepted="suggestionsAccepted"
            :generated-suggestions="generatedSuggestions"
            :collections="collections"
            @generate-suggestions="generateSuggestions"
            @accept-suggestions="acceptSuggestions"
            @regenerate-suggestions="regenerateSuggestions"
          />
        </template>
      </div>

      <!-- Divider -->
      <div class="mt-10 md:mt-14 flex justify-center">
        <div
          class="pointer-events-none w-full max-w-5xl h-px rounded-full"
          :style="{ background: `linear-gradient(90deg, transparent, ${hexA(colors.step,0.35)}, ${hexA(colors.step,0.35)}, transparent)` }"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import HowItWorksStep1 from './how-it-works/HowItWorksStep1.vue';
import HowItWorksStep2 from './how-it-works/HowItWorksStep2.vue';
import HowItWorksStep3 from './how-it-works/HowItWorksStep3.vue';
import { hexA, pillStyle, colors } from '../../utils/styleUtils';

// Función para manejar la carga del video
function onVideoLoaded(event: Event) {
  const video = event.target as HTMLVideoElement
  console.log('Video loaded in HowItWorksSection:', video.src)
  // Asegurar que el video se reproduzca
  video.play().catch((error) => {
    console.log('Error playing video:', error)
  })
}

// Lógica del componente (sin Neat Gradient)

// Lógica del modo Demo
const isDemoMode = ref(false);
const demoStep = ref(0); // 0: no demo, 1, 2, 3

const username = ref('');
const email = ref('');
const password = ref('');

const categories = ref(['Canciones', 'Artistas', 'Álbumes', 'Películas', 'Series', 'Libros', 'Videojuegos']);
const isDropdownOpen = ref(false);
const selectedCategory = ref('');
const searchQuery = ref('');
const showSuggestions = ref(false);

const receiveCategories = ref(['Mezcla', 'Canciones', 'Artistas', 'Álbumes', 'Películas', 'Series', 'Libros', 'Videojuegos']);
const isReceiveDropdownOpen = ref(false);
const selectedReceiveCategory = ref('');

const isLoading = ref(false);
const showSuggestionsResult = ref(false);
const suggestionsAccepted = ref(false);
const generatedSuggestions = ref<any[]>([]);
const initialCollections = [
    { title: 'Playlist: Neo-Synth', meta: '12 pistas · Música' },
    { title: 'Colección: Sci-Fi Essentials', meta: '18 títulos · Películas' },
    { title: 'Lista: Worlds & Lore', meta: '9 libros · Lectura' },
];
const collections = ref([...initialCollections]);

const startDemo = () => {
  isDemoMode.value = true;
  demoStep.value = 1;
};

const exitDemo = () => {
  isDemoMode.value = false;
  demoStep.value = 0;
  // Reset demo state
  isLoading.value = false;
  showSuggestionsResult.value = false;
  suggestionsAccepted.value = false;
  collections.value = [...initialCollections];
  username.value = '';
  email.value = '';
  password.value = '';
  selectedCategory.value = '';
  searchQuery.value = '';
  selectedReceiveCategory.value = '';
  isDropdownOpen.value = false;
  isReceiveDropdownOpen.value = false;
  showSuggestions.value = false;
};

const nextDemoStep = () => {
  if (demoStep.value === 1) {
    demoStep.value++;
  } else if (demoStep.value === 2) {
    generateSuggestions();
  }
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  isReceiveDropdownOpen.value = false;
};

const selectCategory = (category: string) => {
  selectedCategory.value = category;
  isDropdownOpen.value = false;
  searchQuery.value = '';
  showSuggestions.value = true;
};

const toggleReceiveDropdown = () => {
  isReceiveDropdownOpen.value = !isReceiveDropdownOpen.value;
  isDropdownOpen.value = false;
};

const selectReceiveCategory = (category: string) => {
  selectedReceiveCategory.value = category;
  isReceiveDropdownOpen.value = false;
};

const suggestionsData = {
  'Canciones': ['Bohemian Rhapsody', 'Stairway to Heaven', 'Imagine', 'Billie Jean', 'Like a Rolling Stone'],
    'Artistas': ['Queen', 'Led Zeppelin', 'John Lennon', 'Michael Jackson', 'Bob Dylan'],
    'Álbumes': ['A Night at the Opera', 'Led Zeppelin IV', 'Thriller', 'The Freewheelin\' Bob Dylan'],
    'Películas': ['El Padrino', 'Pulp Fiction', 'Matrix', 'Parasite', 'Interestelar'],
    'Series': ['Breaking Bad', 'Juego de Tronos', 'Stranger Things', 'Chernobyl', 'The Office'],
    'Libros': ['Cien años de soledad', '1984', 'Don Quijote de la Mancha', 'El Señor de los Anillos', 'Crimen y Castigo'],
    'Videojuegos': ['The Last of Us', 'Red Dead Redemption 2', 'Grand Theft Auto V', 'Cyberpunk 2077', 'The Legend of Zelda: Breath of the Wild'],
} as Record<string, string[]>;

const filteredSuggestions = computed(() => {
  if (!selectedCategory.value || !suggestionsData[selectedCategory.value]) {
    return [];
  }
  return suggestionsData[selectedCategory.value].filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const addSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion;
  showSuggestions.value = false;
};

const generateSuggestions = () => {
  isLoading.value = true;
  showSuggestionsResult.value = false;
  suggestionsAccepted.value = false;

  setTimeout(() => {
    const dummySuggestions = {
      'Mezcla': [
        { title: `Mezcla: Basado en ${searchQuery.value || 'tus gustos'}`, meta: 'Sugerencias para ti.' },
        { title: 'Mezcla: Descubrimientos de la semana', meta: 'Nuevas recomendaciones.' },
        { title: 'Mezcla: Clásicos atemporales', meta: 'Lo mejor de siempre.' }
      ],
      'Canciones': [
        { title: 'Canción: "Nueva Canción"', meta: `Artista: ${searchQuery.value || 'Desconocido'}` },
        { title: 'Canción: "El Hit del Momento"', meta: 'Artista: Varios' },
        { title: 'Canción: "Clásico Oculto"', meta: 'Artista: Leyenda' }
      ],
      'Artistas': [
        { title: 'Artista: "El Sucesor de ' + (searchQuery.value || 'Alguien') + '"', meta: 'Género similar' },
        { title: 'Artista: "El Rey de ' + (selectedCategory.value || 'General') + '"', meta: 'Artista emergente' },
        { title: 'Artista: "La Leyenda Viva"', meta: 'Ícono del género' }
      ],
      'Álbumes': [
        { title: 'Álbum: "Nuevo Álbum de ' + (searchQuery.value || 'Alguien') + '"', meta: 'Estilo similar' },
        { title: 'Álbum: "El Clásico del Género"', meta: 'Álbum premiado' },
        { title: 'Álbum: "El Descubrimiento Oculto"', meta: 'Joyas musicales' }
      ],
      'Películas': [
        { title: 'Película: "La Trama Oculta"', meta: `Dirigida por ${searchQuery.value || 'Alguien'}` },
        { title: 'Película: "El Nuevo Éxito de Taquilla"', meta: 'Acción y aventura' },
        { title: 'Película: "El Cine Independiente"', meta: 'Drama y misterio' }
      ],
      'Series': [
        { title: 'Serie: "La Conclusión Épica"', meta: `Secuela de ${searchQuery.value || 'Alguien'}` },
        { title: 'Serie: "El Thriller Psicológico"', meta: 'Temporada completa' },
        { title: 'Serie: "La Comedia del Año"', meta: 'Humor y situaciones' }
      ],
      'Libros': [
        { title: 'Libro: "La Nueva Novela de ' + (searchQuery.value || 'Alguien') + '"', meta: 'Género literario' },
        { title: 'Libro: "El Bestseller del Año"', meta: 'Literatura contemporánea' },
        { title: 'Libro: "El Clásico de la Época"', meta: 'Fantasía épica' }
      ],
      'Videojuegos': [
        { title: 'Videojuego: "El Mundo de ' + (searchQuery.value || 'Alguien') + '"', meta: 'Rol y aventura' },
        { title: 'Videojuego: "El Sucesor Espiritual"', meta: 'Acción y estrategia' },
        { title: 'Videojuego: "El Indie del Año"', meta: 'Plataformas' }
      ],
    };

    const categoryKey = selectedReceiveCategory.value || 'Mezcla';
    const suggestionsForCategory = dummySuggestions[categoryKey as keyof typeof dummySuggestions];

    generatedSuggestions.value = suggestionsForCategory;
    isLoading.value = false;
    showSuggestionsResult.value = true;
    suggestionsAccepted.value = false;

    if (demoStep.value === 2) {
      demoStep.value = 3;
    }
  }, 1500);
};

const acceptSuggestions = () => {
  collections.value = [...generatedSuggestions.value];
  suggestionsAccepted.value = true;
  if (isDemoMode.value) {
    setTimeout(exitDemo, 1500);
  }
};

const regenerateSuggestions = () => {
  generateSuggestions();
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.loader {
  border-top-color: #3498db;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@font-face {
  font-family: 'Halenoir';
  src: url('/fonts/Halenoir-Bold.otf') format('opentype');
  font-weight: bold;
}

@font-face {
  font-family: 'Halenoir';
  src: url('/fonts/Halenoir-Black.otf') format('opentype');
  font-weight: 800;
}

.font-halenoir {
  font-family: 'Halenoir', sans-serif;
}

@keyframes progress {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

.animate-progress {
  animation-name: progress;
  animation-timing-function: linear;
  transform-origin: top;
}
</style>
