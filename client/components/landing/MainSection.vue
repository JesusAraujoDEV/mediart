<template>
  <section 
    class="relative w-full h-screen flex items-center p-4 md:p-8 overflow-hidden"
    :style="{ 
      backgroundImage: `url('/client/assets/backgroundNeat2.webp')`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center right'
    }"
  >
    <div class="absolute inset-0 bg-black/20"></div>
    
    <div class="text-white text-left grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
      
      <div class="text-white text-left pl-0 lg:pl-8 xl:pl-16">
        <h1 class="text-6xl sm:text-7xl md:text-8xl font-extrabold leading-tight tracking-tight mb-4 drop-shadow-lg">
          Descubre tu Próxima <br class="hidden sm:inline" />Obsesión Artística
        </h1>
        
        <p class="text-lg sm:text-xl md:text-2xl font-light mb-8 drop-shadow-md font-alpine-body">
          Encuentra películas, música, libros y experiencias culturales que amarás, basadas en lo que ya te apasiona.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink 
            to="/register"
            class="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-600 text-lg text-center"
          >
            Comenzar ahora
          </NuxtLink>
          <NuxtLink 
            to="#como-funciona"
            class="border-2 border-white/70 hover:border-white text-white font-semibold py-4 px-8 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-300 text-lg text-center"
          >
            Ver Cómo Funciona
          </NuxtLink>
        </div>
      </div>
      
      <div class="flex justify-center lg:justify-end items-end pr-0 lg:pr-8 xl:pr-16 order-1 lg:order-2 h-full pt-16 pb-8"> 
        <div class="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] lg:h-[calc(100vh-14rem)]"> 
          <div class="relative w-full h-full">
            <TransitionGroup name="carousel" tag="div" class="relative w-full h-full">
              <div
                v-for="(image, index) in images"
                v-show="index === currentImageIndex"
                :key="index"
                class="absolute inset-0 flex items-center justify-center"
              >
                <img 
                  :src="image.src"
                  :alt="image.alt"
                  class="w-full h-full object-contain rounded-2xl" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;"
                />
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Array de imágenes para el carrusel
const images = ref([
  {
    src: '/landingImages/Scorcese.png',
    alt: 'Movies'
  },
  {
    src: '/landingImages/sabrina.png',
    alt: 'Musica'
  },
  {
    src: '/landingImages/harry.webp',
    alt: 'Books'
  },
  {
    src: '/landingImages/link.webp',
    alt: 'Videogames'
  }
])

const currentImageIndex = ref(0)
let intervalId: NodeJS.Timeout | null = null

// Función para cambiar a la siguiente imagen
const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length
}

// Iniciar el carrusel automático
const startCarousel = () => {
  intervalId = setInterval(nextImage, 4000) // Cambia cada 4 segundos
}

// Detener el carrusel
const stopCarousel = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

// Lifecycle hooks
onMounted(() => {
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<style scoped>
h1 {
  text-shadow: 0 4px 8px rgba(0,0,0,0.5);
}

/* Transiciones del carrusel */
.carousel-enter-active,
.carousel-leave-active {
  transition: all 0.8s ease-in-out;
}

.carousel-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.carousel-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.carousel-enter-to,
.carousel-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* Optimización para imágenes PNG */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: crisp-edges;
}

@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
  .backdrop-blur-md {
    backdrop-filter: blur(12px);
  }
  .backdrop-blur-lg {
    backdrop-filter: blur(20px);
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .grid-cols-1.lg\:grid-cols-2 {
    text-align: center;
  }
}
</style>