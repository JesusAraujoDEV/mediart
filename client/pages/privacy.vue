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
              <li><NuxtLink to="/privacy" class="font-semibold text-slate-900 px-2 py-1 rounded-md bg-slate-200">Política de Privacidad</NuxtLink></li>
              <li><NuxtLink to="/cookies" class="text-slate-600 hover:text-sky-600">Política de Cookies</NuxtLink></li>
            </ul>
          </nav>

          <h1 class="text-3xl md:text-4xl font-bold mb-2">Política de Privacidad</h1>
          <p class="text-sm text-slate-500 mb-8">Última actualización: {{ updatedAt }}</p>

          <!-- Table of contents -->
          <div class="border border-slate-200 rounded-xl p-4 md:p-6 mb-10">
            <h2 class="text-lg font-semibold mb-3">Índice</h2>
            <ol class="space-y-2 list-decimal list-inside text-sky-600">
              <li><a href="#informacion" class="hover:underline">Información que Recopilamos</a></li>
              <li><a href="#uso" class="hover:underline">Cómo Utilizamos tu Información</a></li>
              <li><a href="#proteccion" class="hover:underline">Protección de tus Datos</a></li>
              <li><a href="#compartir" class="hover:underline">Compartir tu Información</a></li>
              <li><a href="#derechos" class="hover:underline">Tus Derechos</a></li>
              <li><a href="#cambios" class="hover:underline">Cambios en esta Política de Privacidad</a></li>
              <li><a href="#contacto" class="hover:underline">Información de Contacto</a></li>
            </ol>
          </div>

          <!-- Sections -->
          <section id="informacion" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">1. Información que Recopilamos</h2>
            <p class="mb-4">Para que Mediart funcione, recopilamos la siguiente información:</p>
            <p class="mb-3"><strong>Información de registro:</strong> Cuando creas una cuenta, recopilamos tu dirección de correo electrónico y una contraseña cifrada. Usamos tu correo electrónico exclusivamente para la recuperación de tu contraseña si la olvidas. No lo utilizamos para enviar correos de bienvenida, boletines o cualquier otra comunicación.</p>
            <p class="mb-4"><strong>Información de recomendaciones guardadas:</strong> Cuando decides guardar una recomendación en tu biblioteca personal, esta información se almacena en tu cuenta. Esto permite que puedas acceder a tus listas organizadas en cualquier momento.</p>
          </section>

          <section id="uso" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">2. Cómo Utilizamos tu Información</h2>
            <p class="mb-4">Tu información se utiliza exclusivamente para los siguientes fines:</p>
            <ul class="list-disc list-inside mb-4 space-y-2">
              <li><strong>Gestión de tu cuenta:</strong> Usamos tu correo electrónico y contraseña cifrada para autenticarte y permitirte acceder a tu cuenta y a tu biblioteca personal.</li>
              <li><strong>Almacenamiento de tu biblioteca:</strong> Los datos sobre tus recomendaciones guardadas se almacenan para que puedas acceder a ellas en cualquier momento.</li>
              <li><strong>Funcionalidades de la plataforma:</strong> Las recomendaciones que la inteligencia artificial genera se basan en la información que el usuario ingresa directamente en un prompt. No almacenamos tus búsquedas ni utilizamos tu historial para entrenar el modelo. El proceso de recomendación es directo y no requiere el análisis de tu comportamiento pasado.</li>
              <li><strong>Seguridad:</strong> La información se utiliza para proteger tu cuenta y la plataforma de actividades no autorizadas.</li>
            </ul>
          </section>

          <section id="proteccion" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">3. Protección de tus Datos</h2>
            <p class="mb-4">Nos tomamos muy en serio la seguridad de tu información. Para proteger tus datos, empleamos las siguientes medidas:</p>
            <ul class="list-disc list-inside mb-4 space-y-2">
              <li><strong>Cifrado de contraseña:</strong> Tu contraseña se almacena de forma cifrada (hash), lo que significa que ni siquiera nosotros podemos verla.</li>
              <li><strong>Medidas de seguridad técnica:</strong> Implementamos prácticas estándar de la industria para proteger tus datos de accesos no autorizados, alteraciones o destrucción.</li>
              <li><strong>Datos en tránsito:</strong> La comunicación entre tu navegador y nuestros servidores está protegida mediante un certificado SSL/TLS.</li>
            </ul>
          </section>

          <section id="compartir" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">4. Compartir tu Información</h2>
            <p class="mb-3">Mediart no vende, alquila ni comparte tu información personal con terceros.</p>
            <p class="mb-4">La única excepción es si nos vemos obligados a revelar información en cumplimiento de una orden judicial, una ley aplicable o para proteger nuestros derechos legales.</p>
          </section>

          <section id="derechos" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">5. Tus Derechos</h2>
            <p class="mb-4">Tienes el control sobre tus datos. Puedes:</p>
            <ul class="list-disc list-inside mb-4">
              <li><strong>Eliminar tu cuenta:</strong> Puedes solicitar la eliminación de tu cuenta en cualquier momento. Al hacerlo, eliminaremos de forma permanente tu información personal y las recomendaciones guardadas de nuestra base de datos.</li>
            </ul>
          </section>

          <section id="cambios" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">6. Cambios en esta Política de Privacidad</h2>
            <p class="mb-4">Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Cuando realicemos cambios significativos, te lo notificaremos a través de un aviso destacado en la plataforma. Te recomendamos revisar esta política periódicamente para estar al tanto de cualquier actualización.</p>
          </section>

          <section id="contacto" class="scroll-mt-24">
            <h2 class="text-2xl font-bold mb-3">7. Información de Contacto</h2>
            <p class="mb-2">Si tienes preguntas o inquietudes sobre esta Política de Privacidad, puedes contactarnos a través de:</p>
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
