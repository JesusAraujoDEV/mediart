<script setup>
import { useHead } from '#app';
import { onMounted, ref, onBeforeUnmount, nextTick } from 'vue';

// Estado para controlar render único de elementos flotantes
const floatingElementsRendered = ref(false);
const renderTimeout = ref(null);

// Manage head tags using Nuxt's useHead composable
useHead({
  charset: 'utf-8',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
  title: 'Mediart - Your Art-ssistant',
  meta: [
    { name: 'description', content: 'Mediart - Your Art-ssistant' },
    { name: 'keywords', content: 'mediart, art, assistant, ai, artificial intelligence' },
    { name: 'author', content: 'Mediart Team' },
    { name: 'robots', content: 'index, follow' },
    { name: 'google-site-verification', content: 'your-google-site-verification-code' }
  ],
  link: [
    { rel: 'shortcut icon', href: '/favicon.ico' }
  ]
});

// Asegurar que los elementos flotantes se rendericen solo una vez
onMounted(() => {
  if (!floatingElementsRendered.value) {
    // Usar requestAnimationFrame para asegurar que el DOM esté completamente listo
    requestAnimationFrame(() => {
      floatingElementsRendered.value = true;
    });
  }
});

onBeforeUnmount(() => {
  if (renderTimeout.value) {
    clearTimeout(renderTimeout.value);
  }
});
</script>

<template>
  <div id="layout" class="w-full h-fit text-white font-[Raleway] overflow-hidden relative">
    <slot />
    <!-- Elementos flotantes renderizados solo una vez -->
    <div v-if="floatingElementsRendered">
      <img
        key="floating-headset"
        class="absolute -left-30 top-1/7 max-md:w-1/3 w-1/3 rotate-12 floating-object"
        src="/resources/backgroundHeadset.webp"
        alt="headset"
        v-once
        width="300"
        height="300"
        loading="lazy"
      />
      <img
        key="floating-hand"
        class="absolute right-0 top-1/7 max-md:w-1/3 w-1/4 floating-object"
        src="/resources/backgroundHand.webp"
        alt="hand"
        v-once
        width="300"
        height="200"
        loading="lazy"
      />
      <img
        key="floating-book"
        class="absolute right-45 -bottom-30 max-md:w-1/3 w-1/7 -rotate-45 floating-object"
        src="/resources/backgroundBook.webp"
        alt="book"
        v-once
        width="300"
        height="300"
        loading="lazy"
      />
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&family=Sail&display=swap");

@import "../styles/float.css";

#layout {
  background: url("/layout/backgroundNeat.webp") no-repeat center center fixed;
  background-size: cover;
}

.glassEffect {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #ffffff20;
}
</style>
