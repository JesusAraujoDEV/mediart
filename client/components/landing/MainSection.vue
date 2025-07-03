<template>
  <section 
        class="relative flex-grow w-full flex items-center p-4 md:p-8 overflow-hidden"
        :style="{ backgroundImage: `url('/client/assets/backgroundNeat2.webp')`, backgroundSize: 'cover', backgroundPosition: 'center right' }"
      >
        <div class="relative z-10 text-white text-left max-w-xl mx-auto md:mx-0 md:ml-[calc(10% + 4rem)] lg:ml-[calc(15% + 6rem)]">
          <!-- Main Headline -->
          <h1 class="text-8xl sm:text-8xl md:text-8xl font-extrabold leading-tight tracking-tight mb-4 drop-shadow-lg">
            Descubre tu Próxima <br class="hidden sm:inline" />Obsesión Artística
          </h1>

          <!-- Subtitle/Description -->
          <p class="text-lg sm:text-xl md:text-2xl font-light mb-8 drop-shadow-md font-alpine-body">
            Encuentra películas, música, libros y experiencias culturales que amarás, basadas en lo que ya te apasiona.
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