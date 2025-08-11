<template>
  <div class="relative w-full h-screen bg-black overflow-hidden">
    <!-- Background Images Container -->
    <div class="absolute inset-0">
      <transition-group name="fade">
        <div
          v-for="(slide, index) in slides"
          :key="slide.image"
          v-show="index === currentSlide"
          class="absolute inset-0 bg-cover bg-center w-full h-full"
          :style="{
            backgroundImage: `url('${slide.image}')`,
            backgroundPosition: slide.position,
          }"
        />
      </transition-group>
    </div>

    <div class="absolute inset-0 bg-black/40" />


    <!-- Hero Content -->
    <!-- Ajuste del padding para móvil y tamaño de texto -->
    <div class="relative z-10 flex h-full items-center justify-start text-left px-6 sm:px-15 lg:px-18 xl:px-25">
      <div class="text-white max-w-3xl pb-20 pl-0 sm:pl-15">
        <!-- Ajuste del tamaño del h1 y leading en móvil -->
        <h1 class="text-4xl sm:text-7xl md:text-7xl font-halenoir font-extrabold leading-tight tracking-tight mb-2 sm:mb-4">
          Descubre tu Próxima <br class="hidden sm:inline" />Obsesión Artística
        </h1>
        <!-- Ajuste del tamaño del párrafo en móvil -->
        <p class="text-sm sm:text-xl md:text-2xl font-light mb-4 sm:mb-8">
          Encuentra películas, música, libros y experiencias culturales que amarás, basadas en lo que ya te apasiona.
        </p>
        <LiquidButton size="xxl" class="font-semibold text-lg tracking-wide cursor-pointer" @click="goToRegister">
          Únete
        </LiquidButton>
      </div>
    </div>

    <!-- Slider Navigation (Mobile) -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 md:hidden">
      <div class="flex items-center space-x-4">
        <button @click="prevSlide" class="text-white hover:text-gray-300 transition-colors p-2">
          <ChevronLeft :size="24" />
        </button>
        <div class="flex space-x-2">
          <button
            v-for="(_, index) in slides"
            :key="index"
            @click="currentSlide = index"
            :class="`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white' : 'bg-white/40'}`"
          />
        </div>
        <button @click="nextSlide" class="text-white hover:text-gray-300 transition-colors p-2">
          <ChevronRight :size="24" />
        </button>
      </div>
    </div>

    <!-- Side Navigation Indicators (Desktop) -->
    <div class="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 hidden md:flex flex-col space-y-4">
      <button
        v-for="(_, index) in slides"
        :key="index"
        @click="currentSlide = index"
        class="relative w-2 h-10 transition-all duration-300 group"
      >
        <div
          :class="`w-full h-full transition-all duration-300 ${currentSlide === index ? 'bg-white' : 'bg-white/40 group-hover:bg-white/60'}`"
        />
        <div
          v-if="currentSlide === index"
          class="absolute top-0 left-0 w-full h-full bg-white animate-progress"
          :style="{ animationDuration: '8s' }"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import LiquidButton from '../ui/LiquidButton.vue';

const currentSlide = ref(0);
let intervalId: NodeJS.Timeout | null = null;

const slides = [
  {
    image: '/landingImages/Spiderverse.webp',
    alt: 'Spider-Man in the Spider-Verse',
    position: '45% center',
  },
  {
    image: '/landingImages/Brody-Eras-Tour.webp',
    alt: 'Taylor Swift on The Eras Tour',
    position: 'center 20%',
  },
  {
    image: '/landingImages/Ghost of Tsushima.webp',
    alt: 'Game',
    position: 'center center',
  },
];

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
  resetAutoPlay();
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
  resetAutoPlay();
};

const startAutoPlay = () => {
  intervalId = setInterval(nextSlide, 8000);
};

const stopAutoPlay = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
};

const resetAutoPlay = () => {
  stopAutoPlay();
  startAutoPlay();
};

const goToRegister = () => {
  window.location.href = '/register';
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
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
