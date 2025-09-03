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
              <li><NuxtLink to="/terms" class="text-slate-600 hover:text-sky-600">Términos y Condiciones de Uso</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="text-slate-600 hover:text-sky-600">Política de Privacidad</NuxtLink></li>
              <li><NuxtLink to="/cookies" class="font-semibold text-slate-900 px-2 py-1 rounded-md bg-slate-200">Política de Cookies</NuxtLink></li>
            </ul>
          </nav>

          <h1 class="text-3xl md:text-4xl font-bold mb-2">Política de Cookies</h1>
          <p class="text-sm text-slate-500 mb-8">Última actualización: {{ updatedAt }}</p>

          <!-- Table of contents -->
          <div class="border border-slate-200 rounded-xl p-4 md:p-6 mb-10">
            <h2 class="text-lg font-semibold mb-3">Índice</h2>
            <ol class="space-y-2 list-decimal list-inside text-sky-600">
              <li><a href="#introduccion" class="hover:underline">Introducción</a></li>
              <li><a href="#que-son" class="hover:underline">¿Qué son las cookies?</a></li>
              <li><a href="#cookies-que-usamos" class="hover:underline">Cookies que utilizamos</a></li>
              <li><a href="#terceros" class="hover:underline">Cookies de terceros</a></li>
              <li><a href="#gestionar" class="hover:underline">Cómo gestionar o desactivar cookies</a></li>
              <li><a href="#cambios" class="hover:underline">Cambios en esta Política de Cookies</a></li>
              <li><a href="#contacto" class="hover:underline">Contacto</a></li>
            </ol>
          </div>

          <!-- Sections -->
          <section id="introduccion" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">1. Introducción</h2>
            <p class="mb-4">
              Esta Política de Cookies explica qué son las cookies, qué tipos podrían utilizarse en la plataforma Mediart
              y cómo puedes gestionarlas. Mediart es una plataforma web de código abierto orientada a recomendaciones de
              entretenimiento y cultura.
            </p>
            <p class="mb-4">
              En línea con nuestra <NuxtLink to="/privacy" class="text-sky-600 underline">Política de Privacidad</NuxtLink>,
              procuramos minimizar el uso de cookies y no empleamos cookies con fines publicitarios ni de seguimiento
              de comportamiento.
            </p>
          </section>

          <section id="que-son" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">2. ¿Qué son las cookies?</h2>
            <p class="mb-4">
              Las cookies son pequeños archivos de texto que un sitio web coloca en tu dispositivo para recordar información
              sobre tu visita (por ejemplo, tu idioma preferido o el estado de tu sesión). También existen tecnologías similares
              como almacenamiento local, web beacons o píxeles que pueden cumplir funciones análogas.
            </p>
          </section>

          <section id="cookies-que-usamos" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">3. Cookies que utilizamos</h2>
            <p class="mb-4">
              En la versión actual de Mediart intentamos operar con el mínimo uso de cookies posible. No utilizamos cookies
              para publicidad ni para elaborar perfiles de los usuarios.
            </p>
            <ul class="list-disc list-inside mb-4 space-y-2">
              <li>
                <strong>Cookies estrictamente necesarias (si aplica):</strong>
                Podrían emplearse para mantener tu sesión iniciada y permitir funciones básicas de la plataforma
                (por ejemplo, acceso a tu biblioteca personal). Estas cookies son esenciales para el funcionamiento del sitio.
              </li>
              <li>
                <strong>Preferencias (si aplica):</strong>
                Eventualmente podríamos recordar ajustes de interfaz o idioma para mejorar tu experiencia. Estas no son esenciales
                y puedes deshabilitarlas sin que se afecte el acceso básico.
              </li>
            </ul>
            <p class="text-sm text-slate-500">
              Nota: En algunos despliegues de Mediart, la autenticación puede gestionarse sin cookies (por ejemplo, usando almacenamiento
              local del navegador). En esos casos, no se establecerán cookies propias.
            </p>
          </section>

          <section id="terceros" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">4. Cookies de terceros</h2>
            <p class="mb-4">
              Mediart no integra actualmente servicios de terceros que coloquen cookies con fines publicitarios o de analítica
              en tu navegador. En caso de futuras integraciones (por ejemplo, reproductores embebidos o herramientas de métricas),
              te informaremos claramente y solicitaremos los consentimientos correspondientes cuando sea aplicable.
            </p>
          </section>

          <section id="gestionar" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">5. Cómo gestionar o desactivar cookies</h2>
            <p class="mb-4">
              Puedes configurar tu navegador para bloquear o eliminar cookies en cualquier momento. Ten en cuenta que bloquear
              cookies estrictamente necesarias podría afectar el funcionamiento básico (como mantener la sesión iniciada).
            </p>
            <ul class="list-disc list-inside mb-4 space-y-2">
              <li><strong>Chrome:</strong> Configuración > Privacidad y seguridad > Cookies y otros datos de sitios.</li>
              <li><strong>Firefox:</strong> Opciones > Privacidad y seguridad > Cookies y datos del sitio.</li>
              <li><strong>Safari:</strong> Preferencias > Privacidad > Cookies y datos de sitios web.</li>
              <li><strong>Edge:</strong> Configuración > Cookies y permisos del sitio > Administrar y eliminar cookies y datos del sitio.</li>
            </ul>
            <p class="text-sm text-slate-500">
              Los pasos pueden variar según la versión de tu navegador o dispositivo.
            </p>
          </section>

          <section id="cambios" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">6. Cambios en esta Política de Cookies</h2>
            <p class="mb-4">
              Podemos actualizar esta política para reflejar cambios técnicos, legales o en las funcionalidades de Mediart.
              Publicaremos la versión vigente en esta página e indicaremos la fecha de última actualización. Si los cambios son
              significativos, podremos notificarlo por medios razonables.
            </p>
          </section>

          <section id="contacto" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">7. Contacto</h2>
            <p class="mb-2">
              Si tienes preguntas o comentarios acerca de esta Política de Cookies, puedes escribirnos a:
            </p>
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