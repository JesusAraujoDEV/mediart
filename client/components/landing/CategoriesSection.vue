<template>
  <section
    id="categorias"
    class="relative w-full h-screen flex flex-col justify-start items-start p-4 md:p-8 overflow-hidden"
  >
    <div class="relative z-10 text-white w-full h-full">
      <!--Icono arriba de categorías-->
      <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 w-fit mb-6 md:mb-8">
        <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
        <span class="text-sm font-medium">Categorías</span>
      </div>

      <!--Computadora-->
      <div class="hidden md:block relative w-full h-full">
        <!--Izquierda-->
        <div class="absolute top-4 left-0 max-w-2xl lg:max-w-3xl xl:max-w-4xl">
          <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-lg text-left">
            Descubre un Universo <br />
            de Contenido en Mediart
          </h1>
        </div>
        
        <!-- Derecha-->
        <div class="absolute top-8 right-0 max-w-md lg:max-w-lg xl:max-w-xl">
          <p class="text-lg md:text-xl lg:text-2xl font-light drop-shadow-md font-alpine-body leading-relaxed text-right md:text-left">
            Desde los clásicos atemporales hasta las últimas novedades, <b>Mediart</b> abarca todo el espectro artístico para que nunca dejes de explorar.
          </p>
        </div>
      </div>

      <!--Telefono-->
      <div class="block md:hidden">
        <!--Izquierda-->
        <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-6 drop-shadow-lg text-left">
          Descubre un Universo <br />
          de Contenido en Mediart
        </h1>
        
        <!--Descripcion-->
        <p class="text-lg sm:text-xl font-light drop-shadow-md font-alpine-body leading-relaxed">
          Desde los clásicos atemporales hasta las últimas novedades, <b>Mediart</b> abarca todo el espectro artístico para que nunca dejes de explorar.
        </p>
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
h1 {
  line-height: 1.1;
}

p {
  line-height: 1.6;
}
</style>