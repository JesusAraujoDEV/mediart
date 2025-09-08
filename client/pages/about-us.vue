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
              <li><NuxtLink to="/about-us" class="font-semibold text-slate-900 px-2 py-1 rounded-md bg-slate-200">Sobre Nosotros</NuxtLink></li>
              <li><NuxtLink to="/how-it-work" class="text-slate-600 hover:text-sky-600">Cómo Funciona</NuxtLink></li>
              <li><NuxtLink to="/why-choose-us" class="text-slate-600 hover:text-sky-600">Por Qué Elegirnos</NuxtLink></li>
              <li><NuxtLink to="/testimonials" class="text-slate-600 hover:text-sky-600">Testimonios</NuxtLink></li>
            </ul>
          </nav>

          <h1 class="text-3xl md:text-4xl font-bold mb-2">Sobre Mediart</h1>
          <p class="text-sm text-slate-500 mb-8">Última actualización: {{ updatedAt }}</p>

          <!-- Table of contents -->
          <div class="border border-slate-200 rounded-xl p-4 md:p-6 mb-10">
            <h2 class="text-lg font-semibold mb-3">Índice</h2>
            <ol class="space-y-2 list-decimal list-inside text-sky-600">
              <li><a href="#introduccion" class="hover:underline">Introducción</a></li>
              <li><a href="#mision" class="hover:underline">Nuestra Misión y Visión</a></li>
              <li><a href="#historia" class="hover:underline">Historia del Proyecto</a></li>
              <li><a href="#equipo" class="hover:underline">Nuestro Equipo</a></li>
              <li><a href="#tecnologia" class="hover:underline">Tecnología e Innovación</a></li>
              <li><a href="#impacto" class="hover:underline">Impacto Social y Cultural</a></li>
              <li><a href="#valores" class="hover:underline">Nuestros Valores</a></li>
              <li><a href="#futuro" class="hover:underline">El Futuro de Mediart</a></li>
              <li><a href="#contacto" class="hover:underline">Contacto</a></li>
            </ol>
          </div>

          <!-- Sections -->
          <section id="introduccion" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">1. Introducción</h2>
            <p class="mb-4">Mediart es mucho más que una plataforma de recomendaciones: es un espacio donde la creatividad, la tecnología y la pasión por el arte convergen para inspirar a millones de personas. Nuestra misión es democratizar el acceso a la cultura y el entretenimiento, ayudando a cada usuario a descubrir nuevas obras, artistas y experiencias que enriquezcan su vida.</p>
            <p class="mb-4">Fundada por un equipo de estudiantes venezolanos apasionados por la tecnología y el arte, Mediart representa la fusión perfecta entre innovación técnica y sensibilidad cultural. Creemos que el arte es una herramienta poderosa para conectar personas, despertar emociones y fomentar el crecimiento personal.</p>
          </section>

          <section id="mision" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">2. Nuestra Misión y Visión</h2>
            <p class="mb-3"><strong>Misión:</strong> Democratizar el acceso a la cultura y el entretenimiento mediante tecnología de inteligencia artificial, creando una experiencia personalizada que inspire y conecte a las personas con el arte en todas sus formas.</p>
            <p class="mb-3"><strong>Visión:</strong> Ser la plataforma líder global en recomendaciones culturales, donde cada persona pueda encontrar su próxima gran inspiración artística, independientemente de su ubicación geográfica o recursos económicos.</p>
            <p class="mb-4">Trabajamos para que la cultura sea accesible a todos, rompiendo barreras geográficas, económicas y sociales que tradicionalmente limitan el acceso al arte y el entretenimiento.</p>
          </section>

          <section id="historia" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">3. Historia del Proyecto</h2>
            <p class="mb-3">Mediart nació en 2025 como proyecto académico para la materia "Sistemas de Información II" del octavo semestre en la Universidad José Antonio Páez (UJAP) en Venezuela. Un grupo de estudiantes de ingeniería en computación, apasionados por la tecnología y el arte, desarrollaron esta plataforma como parte de sus estudios universitarios.</p>
            <p class="mb-3">Lo que comenzó como un proyecto académico se convirtió rápidamente en una visión más amplia: crear una herramienta que no solo recomendara contenido cultural, sino que educara, inspirara y conectara a las personas con el arte en todas sus manifestaciones. La experiencia adquirida durante el desarrollo del proyecto nos permitió identificar una oportunidad real en el mercado de recomendaciones culturales.</p>
            <p class="mb-4">Desde nuestros inicios académicos, hemos mantenido el compromiso con la calidad, la innovación y la accesibilidad, principios que guían cada decisión y desarrollo de la plataforma. Lo que empezó como un requerimiento universitario se ha convertido en una pasión por democratizar el acceso a la cultura.</p>
          </section>

          <section id="equipo" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">4. Nuestro Equipo</h2>
            <p class="mb-3">Mediart está desarrollado por un grupo de estudiantes apasionados de ingeniería en computación de la Universidad José Antonio Páez (UJAP) en Venezuela. Como estudiantes comprometidos con la tecnología y el arte, hemos unido nuestros conocimientos académicos para crear una plataforma que transforme la manera en que las personas descubren y conectan con la cultura.</p>
            <p class="mb-3">Nuestro equipo combina el entusiasmo juvenil con la pasión por la innovación. Cada miembro aporta conocimientos únicos en áreas como desarrollo web, algoritmos de inteligencia artificial, diseño de interfaces y análisis de datos, todos unidos por el objetivo común de democratizar el acceso al arte y la cultura.</p>
            <p class="mb-4">Trabajamos bajo principios de colaboración académica, aprendizaje continuo y compromiso con la calidad, asegurando que cada aspecto de Mediart refleje nuestros valores de excelencia, creatividad y dedicación estudiantil.</p>
          </section>

          <section id="tecnologia" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">5. Tecnología e Innovación</h2>
            <p class="mb-3">Utilizamos algoritmos de inteligencia artificial de vanguardia para analizar patrones de preferencias y ofrecer recomendaciones altamente personalizadas. Nuestra tecnología procesa datos de múltiples fuentes confiables como TMDb, Spotify y otras APIs especializadas.</p>
            <p class="mb-3">La plataforma está construida con tecnologías modernas como Nuxt.js, Vue.js y Node.js, asegurando una experiencia fluida y responsiva. Implementamos prácticas de desarrollo ágil y mantenemos un enfoque en la escalabilidad y seguridad.</p>
            <p class="mb-4">Nuestro sistema de recomendaciones evoluciona constantemente, aprendiendo de las interacciones de los usuarios para ofrecer sugerencias cada vez más precisas y relevantes.</p>
          </section>

          <section id="impacto" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">6. Impacto Social y Cultural</h2>
            <p class="mb-3">Mediart contribuye al desarrollo cultural al fomentar el descubrimiento de nuevas expresiones artísticas y promover la diversidad cultural. Nuestra plataforma ayuda a artistas emergentes a conectar con nuevas audiencias y preserva el acceso a obras clásicas del entretenimiento.</p>
            <p class="mb-3">En Venezuela y América Latina, donde el acceso a plataformas internacionales puede ser limitado, Mediart representa una oportunidad para que las personas exploren contenidos globales sin restricciones geográficas.</p>
            <p class="mb-4">Creemos que la cultura es un derecho fundamental, y trabajamos para que nadie se quede atrás en el disfrute del arte y el entretenimiento.</p>
          </section>

          <section id="valores" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">7. Nuestros Valores</h2>
            <div class="grid md:grid-cols-2 gap-6 mb-4">
              <div class="space-y-3">
                <div class="border-l-4 border-sky-500 pl-4">
                  <h3 class="font-semibold text-lg mb-2">Accesibilidad</h3>
                  <p class="text-slate-600">Hacemos que la cultura sea accesible para todos, independientemente de su ubicación o recursos económicos.</p>
                </div>
                <div class="border-l-4 border-green-500 pl-4">
                  <h3 class="font-semibold text-lg mb-2">Innovación</h3>
                  <p class="text-slate-600">Utilizamos la tecnología más avanzada para mejorar constantemente la experiencia de nuestros usuarios.</p>
                </div>
                <div class="border-l-4 border-purple-500 pl-4">
                  <h3 class="font-semibold text-lg mb-2">Diversidad</h3>
                  <p class="text-slate-600">Celebramos la diversidad cultural y promovemos el descubrimiento de expresiones artísticas de todo el mundo.</p>
                </div>
              </div>
              <div class="space-y-3">
                <div class="border-l-4 border-orange-500 pl-4">
                  <h3 class="font-semibold text-lg mb-2">Transparencia</h3>
                  <p class="text-slate-600">Mantenemos una comunicación abierta y honesta con nuestra comunidad sobre nuestros procesos y decisiones.</p>
                </div>
                <div class="border-l-4 border-red-500 pl-4">
                  <h3 class="font-semibold text-lg mb-2">Calidad</h3>
                  <p class="text-slate-600">Nos comprometemos con los más altos estándares de calidad en cada aspecto de nuestra plataforma.</p>
                </div>
                <div class="border-l-4 border-blue-500 pl-4">
                  <h3 class="font-semibold text-lg mb-2">Comunidad</h3>
                  <p class="text-slate-600">Fomentamos una comunidad inclusiva donde todos puedan compartir y descubrir nuevas experiencias culturales.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="futuro" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">8. El Futuro de Mediart</h2>
            <p class="mb-3">Mediart continúa evolucionando para ofrecer experiencias cada vez más enriquecedoras. Estamos trabajando en nuevas funcionalidades como playlists colaborativas, integración con redes sociales y herramientas avanzadas de descubrimiento cultural.</p>
            <p class="mb-3">Nuestro compromiso es mantenernos a la vanguardia de la tecnología mientras preservamos nuestros valores fundamentales de accesibilidad, calidad y diversidad cultural.</p>
            <p class="mb-4">El futuro de Mediart es tan amplio como el mundo del arte mismo, y estamos emocionados por las posibilidades que nos depara.</p>
          </section>

          <section id="contacto" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">9. Contacto</h2>
            <p class="mb-2">¿Quieres saber más sobre Mediart o tienes sugerencias para mejorar nuestra plataforma? Nos encantaría escucharte.</p>
            <div class="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <h3 class="font-semibold mb-2">Información de Contacto</h3>
                <ul class="space-y-2 text-slate-600">
                  <li class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <a class="text-sky-500 underline" href="mailto:mediart.noreply@gmail.com">mediart.noreply@gmail.com</a>
                  </li>
                  <li class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Valencia, Carabobo, Venezuela
                  </li>
                </ul>
              </div>
              <div>
                <h3 class="font-semibold mb-2">Síguenos en Redes Sociales</h3>
                <div class="flex gap-3">
                  <a href="https://www.instagram.com/mediart.ai?igsh=MW51emNqNjJrMHdnZA==" target="_blank" rel="noopener noreferrer" class="text-sky-500 hover:text-sky-700 transition-colors">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                  </a>
                  <a href="https://x.com/Mediart_AI?t=RkM1Vpr1tKEizr3FNqif6A&s=08" target="_blank" rel="noopener noreferrer" class="text-sky-500 hover:text-sky-700 transition-colors">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="https://es.pinterest.com/mediartstudio/" target="_blank" rel="noopener noreferrer" class="text-sky-500 hover:text-sky-700 transition-colors">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <a href="#top" class="text-slate-500 hover:text-slate-800 text-sm">Volver al inicio</a>
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

const updatedAt = '26/08/2025';
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
