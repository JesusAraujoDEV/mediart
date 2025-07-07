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
    
    <div class="text-white text-left grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      
      <div class="text-white lg:pr-32"> 
        <h1 class="text-6xl sm:text-7xl md:text-8xl font-extrabold leading-tight tracking-tight mb-4 drop-shadow-lg">
          Descubre tu Próxima <br class="hidden sm:inline" />Obsesión Artística
        </h1>
        
        <p class="text-lg sm:text-xl md:text-2xl font-light mb-8 drop-shadow-md font-alpine-body">
          Encuentra películas, música, libros y experiencias culturales que amarás, basadas en lo que ya te apasiona.
        </p>
        
        <!-- Botones CTA opcionales -->
        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink 
            to="/register" 
            class="
            bg-gradient-to-r 
            from-purple-600 to-pink-600
            hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-600 text-lg"
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
      
      <div class="flex justify-center lg:justify-start items-center lg:pl-32"> 
        <div class="relative">
          <img 
          src="/assets/landingImages/messi.webp" 
          alt="foto de messi"
          class="w-sm h-auto max-w-md lg:max-w-lg" >
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
h1 {
  text-shadow: 0 4px 8px rgba(0,0,0,0.5);
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