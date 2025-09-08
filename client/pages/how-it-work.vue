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
              <li><NuxtLink to="/how-it-work" class="font-semibold text-slate-900 px-2 py-1 rounded-md bg-slate-200">Cómo Funciona</NuxtLink></li>
              <li><NuxtLink to="/about-us" class="text-slate-600 hover:text-sky-600">Sobre Nosotros</NuxtLink></li>
              <li><NuxtLink to="/why-choose-us" class="text-slate-600 hover:text-sky-600">Por Qué Elegirnos</NuxtLink></li>
              <li><NuxtLink to="/testimonials" class="text-slate-600 hover:text-sky-600">Testimonios</NuxtLink></li>
            </ul>
          </nav>

          <h1 class="text-3xl md:text-4xl font-bold mb-2">Cómo Funciona Mediart</h1>
          <p class="text-sm text-slate-500 mb-8">Descubre el proceso paso a paso para aprovechar al máximo nuestra plataforma</p>

          <!-- Table of contents -->
          <div class="border border-slate-200 rounded-xl p-4 md:p-6 mb-10">
            <h2 class="text-lg font-semibold mb-3">Índice</h2>
            <ol class="space-y-2 list-decimal list-inside text-sky-600">
              <li><a href="#registro" class="hover:underline">Registro y Configuración Inicial</a></li>
              <li><a href="#búsqueda" class="hover:underline">Búsqueda y Selección de Contenido</a></li>
              <li><a href="#generacion" class="hover:underline">Generación de Recomendaciones</a></li>
              <li><a href="#playlists" class="hover:underline">Creación y Gestión de Playlists</a></li>
              <li><a href="#comunidad" class="hover:underline">Interacción con la Comunidad</a></li>
              <li><a href="#personalizacion" class="hover:underline">Personalización Avanzada</a></li>
              <li><a href="#video-tutorial" class="hover:underline">Video Tutorial Interactivo</a></li>
            </ol>
          </div>

          <!-- Sections -->
          <section id="registro" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">1. Registro y Configuración Inicial</h2>
            <p class="mb-4">Comienza tu viaje en Mediart creando una cuenta gratuita. El proceso es simple y rápido, diseñado para que puedas empezar a explorar el mundo del arte inmediatamente.</p>
            <p class="mb-4">Una vez registrado, podrás configurar tu perfil con tus preferencias iniciales. Esto nos ayuda a entender mejor tus gustos y proporcionarte recomendaciones más precisas desde el primer momento.</p>
          </section>

          <section id="búsqueda" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">2. Búsqueda y Selección de Contenido</h2>
            <p class="mb-3">Utiliza nuestra potente barra de búsqueda para encontrar contenido específico. Puedes buscar por canciones, artistas, álbumes, películas, series, libros o videojuegos.</p>
            <p class="mb-3">Selecciona el tipo de contenido que te interesa y comienza a agregar elementos a tu colección. Nuestra interfaz intuitiva te permite explorar sugerencias en tiempo real mientras escribes.</p>
            <p class="mb-4">Cada selección que hagas nos ayuda a entender mejor tus preferencias y refinar nuestras recomendaciones futuras.</p>
          </section>

          <section id="generacion" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">3. Generación de Recomendaciones</h2>
            <p class="mb-3">Una vez que hayas seleccionado algunos elementos que te gusten, elige el tipo de lista que quieres generar: mezcla, canciones, artistas, álbumes, películas, series, libros o videojuegos.</p>
            <p class="mb-3">Nuestra inteligencia artificial analiza tus selecciones y genera recomendaciones personalizadas basadas en patrones similares. El proceso es automático y toma solo unos segundos.</p>
            <p class="mb-4">Puedes generar nuevas recomendaciones tantas veces como quieras, experimentando con diferentes combinaciones para descubrir contenido sorprendente.</p>
          </section>

          <section id="playlists" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">4. Creación y Gestión de Playlists</h2>
            <p class="mb-3">Convierte tus recomendaciones en playlists organizadas. Crea listas privadas para tu uso personal o listas colaborativas para compartir con otros usuarios.</p>
            <p class="mb-3">Personaliza tus playlists con nombres descriptivos, descripciones y portadas. Puedes agregar o eliminar elementos en cualquier momento para mantener tus colecciones actualizadas.</p>
            <p class="mb-4">Las playlists colaborativas te permiten trabajar en equipo, ideal para proyectos creativos o para compartir descubrimientos con amigos y familiares.</p>
          </section>

          <section id="comunidad" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">5. Interacción con la Comunidad</h2>
            <p class="mb-3">Conecta con otros amantes del arte siguiendo perfiles de usuarios que compartan tus intereses. Descubre nuevas perspectivas y recomendaciones de la comunidad.</p>
            <p class="mb-3">Comparte tus propias playlists y descubre contenido creado por otros usuarios. La comunidad de Mediart es un espacio para el intercambio cultural y el descubrimiento mutuo.</p>
            <p class="mb-4">Sigue usuarios inspiradores y permite que otros te sigan para crear conexiones significativas alrededor de intereses artísticos compartidos.</p>
          </section>

          <section id="personalizacion" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">6. Personalización Avanzada</h2>
            <p class="mb-3">A medida que uses Mediart, el sistema aprende de tus preferencias y mejora continuamente sus recomendaciones. Tu experiencia se vuelve más personalizada con el tiempo.</p>
            <p class="mb-3">Experimenta con diferentes tipos de contenido y categorías para expandir tus horizontes culturales. Mediart te ayuda a explorar géneros y estilos que quizás no habías considerado.</p>
            <p class="mb-4">La personalización es un proceso continuo que evoluciona contigo, asegurando que siempre encuentres contenido relevante y emocionante.</p>
          </section>

          <section id="video-tutorial" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">7. Video Tutorial Interactivo</h2>
            <p class="mb-3">Próximamente implementaremos un video tutorial interactivo que te guiará paso a paso por todas las funcionalidades de Mediart. Este video explicará detalladamente el funcionamiento de la aplicación, desde el registro inicial hasta las características más avanzadas.</p>
            <p class="mb-3">El tutorial incluirá demostraciones prácticas, consejos útiles y explicaciones claras de cómo aprovechar al máximo todas las herramientas que ofrece nuestra plataforma.</p>
            <p class="mb-4">Mantente atento a las actualizaciones, ya que este recurso educativo será una excelente manera de familiarizarte completamente con Mediart.</p>
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
