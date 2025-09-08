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
              <li><NuxtLink to="/testimonials" class="font-semibold text-slate-900 px-2 py-1 rounded-md bg-slate-200">Testimonios</NuxtLink></li>
              <li><NuxtLink to="/about-us" class="text-slate-600 hover:text-sky-600">Sobre Nosotros</NuxtLink></li>
              <li><NuxtLink to="/how-it-work" class="text-slate-600 hover:text-sky-600">Cómo Funciona</NuxtLink></li>
              <li><NuxtLink to="/why-choose-us" class="text-slate-600 hover:text-sky-600">Por Qué Elegirnos</NuxtLink></li>
            </ul>
          </nav>

          <h1 class="text-3xl md:text-4xl font-bold mb-2">Testimonios de Nuestra Comunidad</h1>
          <p class="text-sm text-slate-500 mb-8">Descubre cómo Mediart ha transformado la experiencia cultural de nuestros usuarios</p>

          <!-- Table of contents -->
          <div class="border border-slate-200 rounded-xl p-4 md:p-6 mb-10">
            <h2 class="text-lg font-semibold mb-3">Índice</h2>
            <ol class="space-y-2 list-decimal list-inside text-sky-600">
              <li><a href="#descubrimientos" class="hover:underline">Testimonios del Equipo</a></li>
              <li><a href="#conexiones" class="hover:underline">Plan de Desarrollo</a></li>
            </ol>
          </div>

          <!-- Sections -->
          <section id="descubrimientos" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-6">1. Historias de Descubrimiento</h2>

            <div class="grid md:grid-cols-2 gap-6 mb-8">
              <div class="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    M
                  </div>
                  <div class="ml-4">
                    <h3 class="font-semibold text-slate-900">Manuel Nava</h3>
                    <p class="text-sm text-slate-600">Amigo del Equipo y Tester</p>
                  </div>
                </div>
                <p class="text-slate-700 italic mb-3">"Como amigo del equipo de desarrollo, tuve la oportunidad de probar Mediart desde sus primeras versiones. Es increíble ver cómo una idea estudiantil se convierte en una plataforma tan intuitiva y útil. Las recomendaciones son realmente precisas y han ampliado mis horizontes culturales de formas que nunca imaginé."</p>
                <div class="flex text-yellow-400">
                  ★★★★★
                </div>
              </div>

              <div class="bg-slate-50 rounded-lg p-6 border border-slate-200">
                <div class="flex items-center mb-4">
                  <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    🐕
                  </div>
                  <div class="ml-4">
                    <h3 class="font-semibold text-slate-900">Toddy</h3>
                    <p class="text-sm text-slate-600">Mascota</p>
                  </div>
                </div>
                <p class="text-slate-700 italic mb-3">"¡Guau guau guau! 🐕 Como perro del equipo, no puedo usar la app directamente, pero veo a mis humanos emocionados trabajando en ella todos los días. Cuando escucho música de Mediart en sus computadoras, muevo la cola de felicidad. ¡Es un proyecto que llena de alegría a todo el equipo!"</p>
                <div class="flex text-yellow-400">
                  ★★★★★
                </div>
              </div>
            </div>
          </section>


          <section id="conexiones" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-6">2. Plan de Desarrollo</h2>

            <div class="bg-gradient-to-r from-sky-50 to-purple-50 rounded-lg p-8 border border-sky-200 mb-8">
              <h3 class="text-xl font-semibold mb-4 text-center text-slate-900">Plan de Desarrollo de Mediart</h3>
              <p class="text-slate-700 text-center mb-6">Mediart se encuentra en fase de desarrollo activo. Nuestro objetivo es crear una plataforma robusta que conecte personas a través del arte y la cultura, con planes ambiciosos de crecimiento y expansión.</p>

              <div class="grid md:grid-cols-3 gap-6">
                <div class="text-center">
                  <div class="text-3xl font-bold text-sky-600 mb-2">2025</div>
                  <p class="text-slate-600">Lanzamiento oficial</p>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-purple-600 mb-2">100+</div>
                  <p class="text-slate-600">Usuarios objetivo inicial</p>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-green-600 mb-2">∞</div>
                  <p class="text-slate-600">Potencial de crecimiento</p>
                </div>
              </div>
            </div>

            <div class="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 class="text-lg font-semibold mb-4 text-slate-900">Únete al Desarrollo</h3>
              <p class="text-slate-700 mb-4">Mediart es un proyecto en crecimiento. Si te apasiona la tecnología y la cultura, te invitamos a ser parte de nuestra comunidad de desarrollo y testing. Tu feedback es invaluable para mejorar la plataforma.</p>
              <a href="/contact" class="inline-flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                Contáctanos
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </a>
            </div>
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
