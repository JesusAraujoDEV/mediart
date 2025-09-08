<template>
  <NuxtLayout :name="'custom'">
    <div class="flex">
      <NavigationSidebar />
      <div class="min-h-screen w-full bg-white text-slate-800">
        <div id="top" class="max-w-5xl mx-auto px-6 py-10">
          <!-- Top legal nav -->
          <nav class="mb-8">
            <ul class="flex flex-wrap gap-6 text-sm">
              <li><span class="px-2 py-1 rounded-md bg-slate-100 text-slate-700">Empresa</span></li>
              <li><NuxtLink to="/why-choose-us" class="font-semibold text-slate-900 px-2 py-1 rounded-md bg-slate-200">Por Qué Elegirnos</NuxtLink></li>
              <li><NuxtLink to="/about-us" class="text-slate-600 hover:text-sky-600">Sobre Nosotros</NuxtLink></li>
              <li><NuxtLink to="/how-it-work" class="text-slate-600 hover:text-sky-600">Cómo Funciona</NuxtLink></li>
              <li><NuxtLink to="/testimonials" class="text-slate-600 hover:text-sky-600">Testimonios</NuxtLink></li>
            </ul>
          </nav>

          <h1 class="text-3xl md:text-4xl font-bold mb-2">¿Por Qué Elegir Mediart?</h1>
          <p class="text-sm text-slate-500 mb-8">Descubre las ventajas únicas que hacen de Mediart tu compañero ideal en el descubrimiento cultural</p>

          <!-- Table of contents -->
          <div class="border border-slate-200 rounded-xl p-4 md:p-6 mb-10">
            <h2 class="text-lg font-semibold mb-3">Índice</h2>
            <ol class="space-y-2 list-decimal list-inside text-sky-600">
              <li><a href="#recomendaciones" class="hover:underline">Recomendaciones Personalizadas</a></li>
              <li><a href="#comunidad" class="hover:underline">Comunidad Inspiradora</a></li>
              <li><a href="#playlists" class="hover:underline">Playlists Colaborativas</a></li>
              <li><a href="#gratuito" class="hover:underline">Completamente Gratuito</a></li>
              <li><a href="#intuitivo" class="hover:underline">Interfaz Intuitiva</a></li>
              <li><a href="#variedad" class="hover:underline">Amplia Variedad de Contenido</a></li>
            </ol>
          </div>

          <!-- Sections -->
          <section id="recomendaciones" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">1. Recomendaciones Personalizadas</h2>
            <p class="mb-4">Genera listas de recomendaciones personalizadas adaptadas a tus gustos específicos. Introduce un gusto (película, canción o libro) y elige en base a qué quieres que se genere esa lista.</p>
            <p class="mb-4">Nuestro algoritmo de inteligencia artificial analiza tus preferencias para ofrecerte sugerencias que realmente resuenen contigo, descubriendo contenido que quizás nunca habrías encontrado por tu cuenta.</p>
          </section>

          <section id="comunidad" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">2. Comunidad Inspiradora</h2>
            <p class="mb-4">Conecta con una red de creadores apasionados por el arte y la cultura. Puedes seguir a otros usuarios para descubrir nuevos gustos y ser seguido para compartir tu perspectiva única.</p>
            <p class="mb-4">La comunidad de Mediart es un espacio vivo donde el intercambio de ideas y recomendaciones crea conexiones significativas alrededor de intereses culturales compartidos.</p>
          </section>

          <section id="playlists" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">3. Playlists Colaborativas y Privadas</h2>
            <p class="mb-4">Crea playlists privadas para guardar tus favoritos o únete a playlists colaborativas para explorar nuevos horizontes de gusto junto a otros usuarios.</p>
            <p class="mb-4">Las playlists colaborativas permiten trabajar en equipo, compartir descubrimientos y crear colecciones culturales que reflejan perspectivas diversas y enriquecedoras.</p>
          </section>

          <section id="gratuito" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">4. Completamente Gratuito</h2>
            <p class="mb-4">Mediart es una plataforma completamente gratuita, diseñada para que tu creatividad y conexión con la comunidad artística sean tu única prioridad.</p>
            <p class="mb-4">Creemos que el acceso a la cultura debe ser universal. Sin costos ocultos, sin suscripciones premium, solo arte y conexiones genuinas disponibles para todos.</p>
          </section>

          <section id="intuitivo" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">5. Interfaz Intuitiva</h2>
            <p class="mb-4">Nuestra interfaz ha sido diseñada pensando en la experiencia del usuario, con navegación fluida y elementos visuales que facilitan el descubrimiento cultural.</p>
            <p class="mb-4">Desde la búsqueda inteligente hasta la creación de playlists, cada aspecto de Mediart está optimizado para que puedas enfocarte en lo que realmente importa: disfrutar del arte.</p>
          </section>

          <section id="variedad" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">6. Amplia Variedad de Contenido</h2>
            <p class="mb-4">Explora un universo diverso que incluye música, películas, series, libros, videojuegos y mucho más, todo conectado por algoritmos inteligentes.</p>
            <p class="mb-4">Mediart rompe las barreras entre diferentes formas de expresión artística, permitiéndote crear conexiones inesperadas entre géneros y medios que enriquecen tu experiencia cultural.</p>
          </section>

          <!-- Back to top button -->
          <button
            @click="scrollToTop"
            :class="[
              'fixed bottom-6 right-6 z-50 p-3 rounded-full bg-sky-500 text-white shadow-lg transition-all duration-300 hover:bg-sky-600 hover:scale-110',
              showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            ]"
            aria-label="Volver al inicio"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
          </button>

        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { definePageMeta } from '#imports';
import { ref, onMounted, onUnmounted } from 'vue';
import NavigationSidebar from '~/components/navigation/Sidebar.vue';

definePageMeta({
  layout: 'custom',
});

const showBackToTop = ref(false);

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Ajuste de scroll al usar anclas para que no queden ocultas por el header */
.scroll-mt-24 {
  scroll-margin-top: 6rem;
}
</style>
