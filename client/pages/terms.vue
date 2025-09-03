<template>
  <NuxtLayout :name="'custom'">
    <div class="flex">
      <NavigationSidebar />
      <div class="min-h-screen w-full bg-white text-slate-800">
        <div id="top" class="max-w-5xl mx-auto px-6 py-10">
          <!-- Top legal nav -->
          <nav class="mb-8">
            <ul class="flex flex-wrap gap-6 text-sm">
              <li><span class="px-2 py-1 rounded-md bg-slate-100 text-slate-700">Legal</span></li>
              <li><NuxtLink to="/terms" class="font-semibold text-slate-900 px-2 py-1 rounded-md bg-slate-200">Términos y Condiciones de Uso</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="text-slate-600 hover:text-sky-600">Política de Privacidad</NuxtLink></li>
              <li><NuxtLink to="/cookies" class="text-slate-600 hover:text-sky-600">Política de Cookies</NuxtLink></li>
            </ul>
          </nav>

          <h1 class="text-3xl md:text-4xl font-bold mb-2">Términos y Condiciones de Mediart</h1>
          <p class="text-sm text-slate-500 mb-8">Última actualización: {{ updatedAt }}</p>

          <!-- Table of contents -->
          <div class="border border-slate-200 rounded-xl p-4 md:p-6 mb-10">
            <h2 class="text-lg font-semibold mb-3">Índice</h2>
            <ol class="space-y-2 list-decimal list-inside text-sky-600">
              <li><a href="#introduccion" class="hover:underline">Introducción</a></li>
              <li><a href="#servicio" class="hover:underline">Descripción del Servicio y Naturaleza del Proyecto</a></li>
              <li><a href="#licencia" class="hover:underline">Licencia de uso y Código Abierto</a></li>
              <li><a href="#contenido" class="hover:underline">Contenido de Terceros y Propiedad Intelectual</a></li>
              <li><a href="#responsabilidad" class="hover:underline">Limitación de Responsabilidad y Exclusión de Garantías</a></li>
              <li><a href="#conducta" class="hover:underline">Normas de Conducta y Uso Aceptable</a></li>
              <li><a href="#jurisdiccion" class="hover:underline">Jurisdicción y Legislación Aplicable</a></li>
              <li><a href="#cuentas" class="hover:underline">Cuentas, Seguridad y Privacidad</a></li>
              <li><a href="#edad" class="hover:underline">Requisitos de Edad</a></li>
              <li><a href="#modificaciones" class="hover:underline">Modificaciones de estos Términos</a></li>
              <li><a href="#contacto" class="hover:underline">Contacto</a></li>
            </ol>
          </div>

          <!-- Sections -->
          <section id="introduccion" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">1. Introducción</h2>
            <p class="mb-4">Lee atentamente estos Términos y Condiciones de uso ("Términos"), ya que rigen el acceso y uso de la plataforma Mediart, así como cualquier sitio, aplicación o servicio relacionado que ofrezcamos (en conjunto, "Mediart"). Al acceder o utilizar Mediart aceptas cumplir estos Términos.</p>
          </section>

          <section id="servicio" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">2. Descripción del Servicio y Naturaleza del Proyecto</h2>
            <p class="mb-3">Mediart es una plataforma web gratuita y de código abierto cuyo propósito es ofrecer un motor de recomendaciones para entretenimiento y cultura (películas, series, música, artistas, videojuegos y libros) basado en inteligencia artificial y la información que nos proporcionas.</p>
            <p class="mb-3">La plataforma fue desarrollada por un equipo de estudiantes venezolanos y, aunque opera a nivel global, está sujeta a la legislación de la República Bolivariana de Venezuela en los asuntos pertinentes.</p>
            <p class="mb-4">El objetivo principal es reducir el tiempo de búsqueda de contenido y fomentar una comunidad donde los usuarios puedan descubrir y compartir sus gustos.</p>
          </section>

          <section id="licencia" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">3. Licencia de uso y Código Abierto</h2>
            <p class="mb-3">Mediart se ofrece de forma gratuita y su código fuente es público. Puedes inspeccionar, modificar y distribuir el código de acuerdo con los términos de la licencia de código abierto indicada en nuestro repositorio (por ejemplo, Licencia MIT).</p>
            <p class="mb-3">El usuario tiene una licencia limitada, no exclusiva e intransferible para usar la plataforma con fines personales y no comerciales. Se prohíbe el uso de la plataforma para fines comerciales sin la autorización expresa del equipo del proyecto.</p>
            <p class="mb-4">El uso de cualquier componente de terceros incluido en el repositorio puede estar sujeto a licencias adicionales de dichos terceros.</p>
          </section>

          <section id="contenido" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">4. Contenido de Terceros y Propiedad Intelectual</h2>
            <p class="mb-3">Mediart no es la propietaria del contenido (imágenes, sinopsis, metadatos, etc.) que se muestra. La información es obtenida a través de APIs de terceros (por ejemplo, TMDb, Spotify u otros), quienes conservan todos los derechos sobre dicho contenido.</p>
            <p class="mb-3">Mediart actúa como un agregador de información y no alberga ni distribuye material protegido por derechos de autor de forma ilegal.</p>
            <p class="mb-3">Al usar Mediart, reconoces que la información mostrada es propiedad de sus respectivos dueños y aceptas que las imágenes se utilizan con fines informativos y de referencia.</p>
            <p class="mb-4">Si eres titular de derechos y consideras que tu contenido se utiliza de forma inapropiada, contáctanos para revisarlo y, de ser necesario, retirarlo.</p>
          </section>

          <section id="responsabilidad" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">5. Limitación de Responsabilidad y Exclusión de Garantías</h2>
            <p class="mb-3">Mediart se proporciona "tal cual" y "según disponibilidad". No garantizamos que el servicio esté libre de errores o que las recomendaciones se ajusten siempre a tus preferencias.</p>
            <p class="mb-3">El equipo del proyecto no asume responsabilidad por daños directos o indirectos, incidentales, punitivos o consecuentes que puedan surgir del uso o la imposibilidad de usar la plataforma.</p>
            <p class="mb-4">La información obtenida de APIs de terceros puede no ser 100% precisa. El usuario es responsable de verificar la información antes de tomar decisiones.</p>
          </section>

          <section id="conducta" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">6. Normas de Conducta y Uso Aceptable</h2>
            <p class="mb-3">Te comprometes a utilizar Mediart de forma responsable y legal, sin fines fraudulentos o maliciosos.</p>
            <p class="mb-3">Se prohíbe el uso de la plataforma para fines ilícitos o que infrinjan las leyes locales, nacionales e internacionales. Esto incluye, de forma referencial, la normativa aplicable en la República Bolivariana de Venezuela, como la Ley de Responsabilidad Social en Radio, Televisión y Medios Electrónicos y la Ley de Infogobierno.</p>
            <p class="mb-4">Podremos suspender o limitar el acceso de usuarios que incumplan estas normas.</p>
          </section>

          <section id="jurisdiccion" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">7. Jurisdicción y Legislación Aplicable</h2>
            <p class="mb-4">Estos Términos se rigen por las leyes de la República Bolivariana de Venezuela. Cualquier disputa será sometida a los tribunales competentes de la ciudad de Valencia, estado Carabobo, Venezuela.</p>
          </section>

          <section id="cuentas" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">8. Cuentas, Seguridad y Privacidad</h2>
            <p class="mb-3">Cuando corresponda, eres responsable de mantener la confidencialidad de las credenciales de tu cuenta y de las actividades realizadas desde ella.</p>
            <p class="mb-3">El tratamiento de datos personales se describe en la <NuxtLink to="/privacy" class="text-sky-500 underline">Política de Privacidad</NuxtLink>. Al usar Mediart aceptas dichas prácticas.</p>
            <p class="mb-4">Adoptamos medidas razonables de seguridad, pero ningún sistema es completamente seguro.</p>
          </section>

          <section id="edad" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">9. Requisitos de Edad</h2>
            <p class="mb-4">Para usar Mediart debes tener la edad mínima requerida por la legislación de tu país. Si eres menor de edad, debes contar con la autorización de tus representantes legales.</p>
          </section>

          <section id="modificaciones" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">10. Modificaciones de estos Términos</h2>
            <p class="mb-4">Podemos actualizar estos Términos para reflejar cambios en el servicio o en la normativa aplicable. Publicaremos la versión vigente en esta página e indicaremos la fecha de última actualización. Si los cambios son significativos, podremos notificarlo por medios razonables.</p>
          </section>

          <section id="contacto" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">11. Contacto</h2>
            <p class="mb-2">Si tienes preguntas, comentarios o reclamos, puedes escribirnos a:</p>
            <ul class="list-disc list-inside mb-4">
              <li>Correo: <a class="text-sky-500 underline" href="mailto:mediart.noreply@gmail.com">mediart.noreply@gmail.com</a></li>
              <li>Ubicación: Valencia, Carabobo, Venezuela</li>
            </ul>
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
