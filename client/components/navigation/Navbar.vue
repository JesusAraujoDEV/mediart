<template>
  <header class="absolute top-0 left-0 w-full z-20">
    <nav id="navbar-main" class="max-w-screen-xl mx-auto px-6 sm:px-8 py-2 mt-4 flex items-center justify-between
                bg-white/10 backdrop-blur-md rounded-full shadow-xl border border-white/20">
      <!-- Se ha agrupado el logo y el texto de Mediart en un solo div -->
      <div class="flex-shrink-0 flex items-center space-x-3">
        <NuxtLink to="/">
          <img
          id="logoNavbar"
          src="/mediart/mediartLogo.webp" 
          alt="Mediart Logo" 
          class="h-9 w-auto" />
        </NuxtLink>
        <!-- Ahora el título es visible en todas las pantallas -->
        <div class="text-white font-bold text-xl tracking-wider block">MEDIART</div>
      </div>

      <!-- Menú de navegación principal (desktop) -->
      <div class="hidden md:flex flex-grow justify-center space-x-6">
        <!-- Se añade el evento @click con la función de scroll para todos los enlaces internos -->
        <NuxtLink @click="scrollToSection($event, 'how-it-works-title')" to="#how-it-works-title" class="text-white hover:text-gray-300 transition-colors duration-300 text-base font-semibold">Cómo Funciona</NuxtLink>
        <NuxtLink @click="scrollToSection($event, 'categories-title')" to="#categories-title" class="text-white hover:text-gray-300 transition-colors duration-300 text-base font-semibold">Categorías</NuxtLink>
        <NuxtLink @click="scrollToSection($event, 'why-mediart-title')" to="#why-mediart-title" class="text-white hover:text-gray-300 transition-colors duration-300 text-base font-semibold">Por Qué Elegirnos</NuxtLink>
        <NuxtLink @click="scrollToSection($event, 'comunidad-title')" to="#comunidad-title" class="text-white hover:text-gray-300 transition-colors duration-300 text-base font-semibold">Comunidad</NuxtLink>
      </div>

      <!-- Botones de acción (desktop) -->
      <div class="flex items-center space-x-3 hidden md:flex">
        <NuxtLink to="/login" class="text-white hover:text-gray-300 transition-colors duration-300 text-base font-semibold hover:underline">Iniciar Sesión</NuxtLink>
        <NuxtLink to="/register" class="bg-white text-blue-800 font-bold py-2 px-5 rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-200 text-base">
          Regístrate
        </NuxtLink>
      </div>

      <!-- Botones de acción (móvil) -->
      <div class="flex items-center space-x-3 md:hidden">
        <NuxtLink to="/register" class="bg-white text-blue-800 font-bold py-2 px-5 rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-200 text-base">
          Regístrate
        </NuxtLink>
        <!-- Botón de menú para móvil -->
        <button @click="isMenuOpen = !isMenuOpen" class="text-white p-2">
          <Icon name="lucide:menu" size="24" />
        </button>
      </div>
    </nav>
    
    <!-- Menú desplegable para móvil -->
    <div v-if="isMenuOpen" class="absolute top-20 left-0 w-full bg-black/80 backdrop-blur-md py-4 rounded-xl shadow-xl md:hidden">
      <div class="flex flex-col items-center space-y-4">
        <NuxtLink @click="scrollToSection($event, 'how-it-works-title', true)" to="#how-it-works-title" class="text-white text-lg font-semibold w-full text-center py-2 hover:bg-white/10 transition-colors">Cómo Funciona</NuxtLink>
        <NuxtLink @click="scrollToSection($event, 'categories-title', true)" to="#categories-title" class="text-white text-lg font-semibold w-full text-center py-2 hover:bg-white/10 transition-colors">Categorías</NuxtLink>
        <NuxtLink @click="scrollToSection($event, 'why-mediart-title', true)" to="#why-mediart-title" class="text-white text-lg font-semibold w-full text-center py-2 hover:bg-white/10 transition-colors">Por Qué Elegirnos</NuxtLink>
        <NuxtLink @click="scrollToSection($event, 'comunidad-title', true)" to="#comunidad-title" class="text-white text-lg font-semibold w-full text-center py-2 hover:bg-white/10 transition-colors">Comunidad</NuxtLink>
        <NuxtLink to="/login" class="text-white text-lg font-semibold w-full text-center py-2 hover:bg-white/10 transition-colors">Iniciar Sesión</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);

const scrollToSection = (event: MouseEvent, targetId: string, closeMenu: boolean = false) => {
  event.preventDefault();
  
  if (closeMenu) {
    isMenuOpen.value = false;
  }

  const targetElement = document.getElementById(targetId);
  const navbarElement = document.getElementById('navbar-main');

  if (targetElement && navbarElement) {
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
    const navbarHeight = navbarElement.offsetHeight;
    const offsetPosition = targetPosition - navbarHeight - 20;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};
</script>

<style scoped>
#logoNavbar {
  filter: brightness(0) invert(1);
}
</style>
