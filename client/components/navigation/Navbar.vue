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
        <div class="text-white font-bold text-xl tracking-wider">MEDIART</div>
      </div>

      <!-- Menú de navegación principal -->
      <div class="hidden md:flex flex-grow justify-center space-x-6">
        <!-- Se añade el evento @click con la función de scroll para todos los enlaces internos -->
        <NuxtLink @click="scrollToSection($event, 'how-it-works-title')" to="#how-it-works-title" class="text-white hover:text-gray-300 transition-colors duration-300 text-base font-semibold">Cómo Funciona</NuxtLink>
        <NuxtLink @click="scrollToSection($event, 'categories-title')" to="#categories-title" class="text-white hover:text-gray-300 transition-colors duration-300 text-base font-semibold">Categorías</NuxtLink>
        <NuxtLink @click="scrollToSection($event, 'why-mediart-title')" to="#why-mediart-title" class="text-white hover:text-gray-300 transition-colors duration-300 text-base font-semibold">Por Qué Elegirnos</NuxtLink>
        <NuxtLink @click="scrollToSection($event, 'comunidad-title')" to="#comunidad-title" class="text-white hover:text-gray-300 transition-colors duration-300 text-base font-semibold">Comunidad</NuxtLink>
      </div>

      <!-- Botones de acción -->
      <div class="flex items-center space-x-3">
        <NuxtLink to="/login" class="text-white hover:text-gray-300 transition-colors duration-300 text-base font-semibold hover:underline hidden sm:block">Iniciar Sesión</NuxtLink>
        <NuxtLink to="/register" class="bg-white text-blue-800 font-bold py-2 px-5 rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-200 text-base">
          Regístrate
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
// Función para hacer scroll a una sección
const scrollToSection = (event: MouseEvent, targetId: string) => {
  // Previene el comportamiento de navegación por defecto de NuxtLink
  event.preventDefault();

  const targetElement = document.getElementById(targetId);
  const navbarElement = document.getElementById('navbar-main');

  if (targetElement && navbarElement) {
    // Obtiene la posición del elemento de destino
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
    
    // Obtiene la altura del navbar
    const navbarHeight = navbarElement.offsetHeight;
    
    // Define el desplazamiento final, restando la altura del navbar y un pequeño margen
    const offsetPosition = targetPosition - navbarHeight - 20; // 20px de padding extra
    
    // Hace el scroll a la nueva posición
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
