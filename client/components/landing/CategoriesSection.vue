<template>
  <section
    id="categorias"
    class="relative w-full h-screen flex items-center p-4 md:p-8 overflow-hidden" 
    >
    <div class="relative z-10 text-white text-left max-w-xl mx-auto md:mx-0 md:ml-[calc(10% + 4rem)] lg:ml-[calc(15% + 6rem)]">
        <!-- Main Headline -->
        <h1 class="text-5xl sm:text-5xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4 drop-shadow-lg">
        Descubre un Universo <br class="hidden sm:inline" />de Contenido en Mediart
        </h1>

        <!-- Subtitle/Description -->
        <p class="text-lg sm:text-xl md:text-2xl font-light mb-8 drop-shadow-md font-alpine-body">
        Desde los clásicos atemporales hasta las últimas novedades, <b>Mediart</b> abarca todo el espectro artístico para que nunca dejes de explorar.
        </p>
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
</style>