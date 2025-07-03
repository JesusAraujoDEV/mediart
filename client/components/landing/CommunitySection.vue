<template>
  <section
    id="comunidad"
    class="relative w-full h-screen flex items-center p-4 md:p-8 overflow-hidden" 
    >
    <!-- <div class="absolute inset-0 bg-black/10"></div> -->
    <div class="relative z-10 text-white text-left max-w-xl mx-auto md:mx-0 md:ml-[calc(10% + 4rem)] lg:ml-[calc(15% + 6rem)]">
        <!-- Main Headline -->
        <h1 class="text-5xl sm:text-5xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4 drop-shadow-lg">
        Crea tu próxima <br>Historia Artística
        </h1>

        <!-- Subtitle/Description -->
        <p class="text-lg sm:text-xl md:text-2xl font-light mb-8 drop-shadow-md font-alpine-body">
        En Mediart, no solo descubres arte; creas tu propia narrativa cultural. 
        Únete a una comunidad que valora la curiosidad, la conexión y la pasión por explorar lo extraordinario.
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