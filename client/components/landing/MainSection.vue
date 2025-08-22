<template>
  <div class="relative w-full h-screen bg-black overflow-hidden">
    <!-- Background Images Container: render only the active slide for performance -->
    <div class="absolute inset-0">
      <transition name="fade" mode="out-in">
        <div
          v-if="slides[currentSlide]"
          :key="currentSlide"
          class="absolute inset-0 bg-cover bg-center w-full h-full"
          :style="currentBackgroundStyle"
        />
      </transition>
    </div>

    <div class="absolute inset-0 bg-black/40" />


    <!-- Hero Content -->
    <div class="relative z-10 flex h-full items-center justify-start text-left px-6 sm:px-15 lg:px-18 xl:px-25">
      <div class="text-white max-w-3xl pb-20 pl-0 sm:pl-15">
        <h1 class="text-4xl sm:text-7xl md:text-7xl font-halenoir font-extrabold leading-tight tracking-tight mb-2 sm:mb-4">
          Descubre tu Próxima <br class="hidden sm:inline" />Obsesión Artística
        </h1>
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
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import LiquidButton from '../ui/LiquidButton.vue';

const router = useRouter();

const currentSlide = ref(0);
let intervalId: number | null = null;

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
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const interval = prefersReduced ? 15000 : 8000;
  intervalId = window.setInterval(nextSlide, interval);
};

const stopAutoPlay = () => {
  if (intervalId !== null) {
    window.clearInterval(intervalId);
    intervalId = null;
  }
};

const resetAutoPlay = () => {
  stopAutoPlay();
  startAutoPlay();
};

const goToRegister = () => {
  router.push('/register');
};

const currentBackgroundStyle = computed(() => {
  const slide = slides[currentSlide.value];
  if (!slide) return {} as Record<string, string>;
  return {
    backgroundImage: `url('${slide.image}')`,
    backgroundPosition: slide.position,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    willChange: 'opacity',
    WebkitBackfaceVisibility: 'hidden',
  } as Record<string, string>;
});

// Preload next image when slide changes
watch(currentSlide, (val) => {
  const next = (val + 1) % slides.length;
  const img = new Image();
  img.src = slides[next].image;
});

onMounted(() => {
  startAutoPlay();
  // Preload current & next
  const img = new Image();
  img.src = slides[currentSlide.value].image;
  const next = (currentSlide.value + 1) % slides.length;
  const img2 = new Image();
  img2.src = slides[next].image;
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
