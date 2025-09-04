<template>
  <NuxtLayout :name="'custom'">
    <div class="flex">
      <NavigationSidebar />

      <main class="min-h-screen w-full bg-white">
        <!-- Hero -->
        <section class="border-b border-gray-200 bg-gradient-to-b from-sky-50 to-white">
          <div class="container mx-auto px-6 py-10">
            <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">Centro de Ayuda de Mediart</h1>
            <p class="mt-3 max-w-3xl text-gray-600">
              Bienvenido al Centro de Ayuda de Mediart. Nuestro objetivo es que encuentres la respuesta a tus preguntas de forma rápida y sencilla para que puedas disfrutar de la plataforma sin interrupciones. Si no encuentras lo que buscas, no dudes en contactarnos.
            </p>

            <!-- Search -->
            <div class="mt-6 max-w-2xl relative" role="search" aria-label="Buscar en la ayuda">
              <label class="sr-only" for="help-search">Buscar en la ayuda</label>
              <div class="relative">
                <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                <input
                  id="help-search"
                  v-model="q"
                  type="search"
                  placeholder="Buscar guías, preguntas, términos..."
                  class="w-full rounded-xl border border-gray-300 bg-white pl-11 pr-28 py-3 text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none"
                />
                <NuxtLink
                  :to="searchTo"
                  class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300">
                  Buscar
                </NuxtLink>
              </div>

              <!-- Search Suggestions -->
              <div v-if="searchResults.length > 0" class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto z-50">
                <div class="p-2">
                  <p class="text-xs text-gray-500 mb-2 px-2">Sugerencias relacionadas:</p>
                  <div v-for="result in searchResults" :key="result.id" class="px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer" @click="openFaqItem(result.id)">
                    <div class="text-sm font-medium text-gray-900">{{ result.question }}</div>
                    <div class="text-xs text-gray-600 mt-1">{{ result.summary }}</div>
                  </div>
                </div>
              </div>

              <p v-else class="mt-2 text-xs text-gray-500">Sugerencias: cuentas, recomendaciones, listas, privacidad</p>
            </div>
          </div>
        </section>

        <!-- Main -->
        <section class="container mx-auto px-6 py-10">
          <div class="grid gap-8 md:grid-cols-3">
            <!-- FAQ -->
            <div class="md:col-span-2">
              <h2 class="text-2xl font-bold text-gray-900">Preguntas Frecuentes (FAQ)</h2>

              <div class="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
                <details id="faq-1" class="group p-5" open>
                  <summary class="flex cursor-pointer list-none items-start justify-between gap-4">
                    <div>
                      <span class="block text-sm font-semibold text-sky-600">1. ¿Qué es Mediart?</span>
                      <p class="mt-1 text-gray-600">Descripción general de la plataforma</p>
                    </div>
                    <ArrowDown class="summary-icon h-5 w-5 shrink-0 text-gray-400 transition-transform" />
                  </summary>
                  <div class="mt-3 text-gray-700">
                    Mediart es una plataforma web gratuita y de código abierto que te ayuda a descubrir nuevo contenido de entretenimiento (películas, series, música, artistas, videojuegos y libros). Solo tienes que ingresar tus gustos y nuestra inteligencia artificial te dará recomendaciones personalizadas.
                  </div>
                </details>

                <details id="faq-2" class="group p-5">
                  <summary class="flex cursor-pointer list-none items-start justify-between gap-4">
                    <div>
                      <span class="block text-sm font-semibold text-sky-600">2. ¿Cómo funciona el sistema de recomendaciones?</span>
                      <p class="mt-1 text-gray-600">Proceso inmediato y sin historial</p>
                    </div>
                    <ArrowDown class="summary-icon h-5 w-5 shrink-0 text-gray-400 transition-transform" />
                  </summary>
                  <div class="mt-3 text-gray-700">
                    Nuestro sistema funciona de forma directa. Cuando ingresas un gusto (por ejemplo, una película o un artista), le pasamos esa información a nuestra inteligencia artificial, la cual genera recomendaciones basándose en la información que le proporcionaste en ese momento. Es un proceso inmediato que no guarda tu historial de búsquedas ni entrena el modelo con tus datos.
                  </div>
                </details>

                <details id="faq-3" class="group p-5">
                  <summary class="flex cursor-pointer list-none items-start justify-between gap-4">
                    <div>
                      <span class="block text-sm font-semibold text-sky-600">3. ¿Tengo que registrarme para usar Mediart?</span>
                      <p class="mt-1 text-gray-600">Registro requerido para recomendaciones</p>
                    </div>
                    <ArrowDown class="summary-icon h-5 w-5 shrink-0 text-gray-400 transition-transform" />
                  </summary>
                  <div class="mt-3 text-gray-700">
                    Sí es necesario registrarte para usar el sistema de recomendaciones. La plataforma requiere una cuenta para generar recomendaciones personalizadas, aunque algunas funciones básicas pueden estar disponibles sin registro. Una vez registrado, podrás acceder a todas las funcionalidades incluyendo guardar descubrimientos y crear listas personalizadas.
                  </div>
                </details>

                <details id="faq-4" class="group p-5">
                  <summary class="flex cursor-pointer list-none items-start justify-between gap-4">
                    <div>
                      <span class="block text-sm font-semibold text-sky-600">4. ¿Cómo recupero mi contraseña?</span>
                      <p class="mt-1 text-gray-600">Restablecimiento por correo</p>
                    </div>
                    <ArrowDown class="summary-icon h-5 w-5 shrink-0 text-gray-400 transition-transform" />
                  </summary>
                  <div class="mt-3 text-gray-700">
                    Si has olvidado tu contraseña, haz clic en la opción "¿Olvidaste tu contraseña?" en la página de inicio de sesión. Ingresa tu correo electrónico y te enviaremos un enlace para que puedas establecer una nueva contraseña.
                  </div>
                </details>

                <details id="faq-5" class="group p-5">
                  <summary class="flex cursor-pointer list-none items-start justify-between gap-4">
                    <div>
                      <span class="block text-sm font-semibold text-sky-600">5. ¿Qué pasa con mis datos personales?</span>
                      <p class="mt-1 text-gray-600">Privacidad y seguridad</p>
                    </div>
                    <ArrowDown class="summary-icon h-5 w-5 shrink-0 text-gray-400 transition-transform" />
                  </summary>
                  <div class="mt-3 text-gray-700">
                    Nos tomamos tu privacidad muy en serio. Solo recopilamos tu correo electrónico (para la recuperación de cuenta) y los datos de las recomendaciones que decides guardar. No vendemos, alquilamos ni compartimos tu información con terceros. Para más detalles, te invitamos a leer nuestra Política de Privacidad.
                  </div>
                </details>
              </div>

              <!-- Tutorials -->
              <div class="mt-10">
                <h2 class="text-2xl font-bold text-gray-900">Tutoriales</h2>
                <div class="mt-4 grid gap-4 md:grid-cols-2">
                  <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900">¿Cómo guardar una recomendación en mi biblioteca?</h3>
                    <ol class="mt-3 list-decimal pl-5 text-gray-700 space-y-2">
                      <li>Inicia sesión en tu cuenta de Mediart.</li>
                      <li>Genera tus recomendaciones ingresando tus gustos.</li>
                      <li>Haz clic en el botón con el ícono de “guardar” junto al elemento que te interese.</li>
                      <li>Lo verás inmediatamente en tu biblioteca personal.</li>
                    </ol>
                  </div>
                  <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900">¿Cómo crear una lista de recomendaciones?</h3>
                    <ol class="mt-3 list-decimal pl-5 text-gray-700 space-y-2">
                      <li>Ve a tu biblioteca personal.</li>
                      <li>Haz clic en el ícono “+” o en “Crear nueva lista”.</li>
                      <li>Asigna un nombre y añade elementos desde tus recomendaciones.</li>
                      <li>Organiza y comparte cuando quieras.</li>
                    </ol>
                  </div>
                </div>
                <div class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
                  <p class="text-sm">
                    Nota: Las imágenes y metadatos que ves en Mediart provienen de APIs de terceros (como TMDb o Spotify). Para optimizar el rendimiento de la plataforma, mostramos versiones optimizadas de estas imágenes.
                  </p>
                </div>
              </div>
            </div>

            <!-- Aside -->
            <aside class="space-y-4">
              <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 class="text-base font-semibold text-gray-900">¿No encontraste lo que buscabas?</h3>
                <p class="mt-2 text-sm text-gray-600">Prueba con palabras clave distintas o escríbenos directamente.</p>
                <div class="mt-4 flex flex-col gap-2">
                  <NuxtLink to="/contact" class="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600">Contactar soporte</NuxtLink>
                  <NuxtLink to="/privacy" class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Política de Privacidad</NuxtLink>
                </div>
              </div>

              <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 class="text-base font-semibold text-gray-900">Contacto</h3>
                <ul class="mt-2 space-y-2 text-sm text-gray-700">
                  <li>Correo electrónico: <span class="font-medium">
                    <a href="mailto:mediart.noreply@gmail.com" class="hover:text-blue-600 transition-colors duration-200">
                      mediart.noreply@gmail.com
                    </a>
                  </span></li>
                  <li>Repositorio de GitHub: <span class="font-medium">
                    <a href="https://github.com/JesusAraujoDEV/mediart" class="hover:text-blue-600 transition-colors duration-200">
                      JesusAraujoDEV/mediart
                    </a>
                  </span></li>
                </ul>
              </div>

              <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 class="text-base font-semibold text-gray-900">Recursos útiles</h3>
                <ul class="mt-3 space-y-2 text-sm text-gray-700">
                  <li>• Recomendaciones rápidas sin registro</li>
                  <li>• Guarda y organiza tu biblioteca</li>
                  <li>• Crea listas personalizadas</li>
                  <li>• Privacidad y datos bajo tu control</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { definePageMeta } from '#imports';
import { ref, computed, nextTick } from 'vue';
import NavigationSidebar from '~/components/navigation/Sidebar.vue';
import { ArrowDown } from 'lucide-vue-next';

definePageMeta({
  layout: 'custom',
});

const q = ref('');
const searchTo = computed(() => q.value ? `/studio/search?query=${encodeURIComponent(q.value)}` : '/studio/search');

// FAQ data for search
const faqItems = [
  {
    id: 1,
    question: '¿Qué es Mediart?',
    summary: 'Descripción general de la plataforma',
    answer: 'Mediart es una plataforma web gratuita y de código abierto que te ayuda a descubrir nuevo contenido de entretenimiento (películas, series, música, artistas, videojuegos y libros). Solo tienes que ingresar tus gustos y nuestra inteligencia artificial te dará recomendaciones personalizadas.',
    keywords: ['mediart', 'plataforma', 'qué es', 'descripción']
  },
  {
    id: 2,
    question: '¿Cómo funciona el sistema de recomendaciones?',
    summary: 'Proceso inmediato y sin historial',
    answer: 'Nuestro sistema funciona de forma directa. Cuando ingresas un gusto (por ejemplo, una película o un artista), le pasamos esa información a nuestra inteligencia artificial, la cual genera recomendaciones basándose en la información que le proporcionaste en ese momento. Es un proceso inmediato que no guarda tu historial de búsquedas ni entrena el modelo con tus datos.',
    keywords: ['recomendaciones', 'funciona', 'sistema', 'inteligencia artificial', 'proceso']
  },
  {
    id: 3,
    question: '¿Tengo que registrarme para usar Mediart?',
    summary: 'Registro requerido para recomendaciones',
    answer: 'Sí es necesario registrarte para usar el sistema de recomendaciones. La plataforma requiere una cuenta para generar recomendaciones personalizadas, aunque algunas funciones básicas pueden estar disponibles sin registro. Una vez registrado, podrás acceder a todas las funcionalidades incluyendo guardar descubrimientos y crear listas personalizadas.',
    keywords: ['registro', 'registrarme', 'cuenta', 'necesario', 'requerido']
  },
  {
    id: 4,
    question: '¿Cómo recupero mi contraseña?',
    summary: 'Restablecimiento por correo',
    answer: 'Si has olvidado tu contraseña, haz clic en la opción "¿Olvidaste tu contraseña?" en la página de inicio de sesión. Ingresa tu correo electrónico y te enviaremos un enlace para que puedas establecer una nueva contraseña.',
    keywords: ['contraseña', 'recupero', 'olvide', 'restablecer', 'correo', 'email']
  },
  {
    id: 5,
    question: '¿Qué pasa con mis datos personales?',
    summary: 'Privacidad y seguridad',
    answer: 'Nos tomamos tu privacidad muy en serio. Solo recopilamos tu correo electrónico (para la recuperación de cuenta) y los datos de las recomendaciones que decides guardar. No vendemos, alquilamos ni compartimos tu información con terceros. Para más detalles, te invitamos a leer nuestra Política de Privacidad.',
    keywords: ['datos', 'privacidad', 'personales', 'seguridad', 'política']
  }
];

// Search functionality
const searchResults = computed(() => {
  if (!q.value.trim()) return [];

  const query = q.value.toLowerCase();
  return faqItems.filter(item =>
    item.question.toLowerCase().includes(query) ||
    item.summary.toLowerCase().includes(query) ||
    item.answer.toLowerCase().includes(query) ||
    item.keywords.some(keyword => keyword.toLowerCase().includes(query))
  ).slice(0, 5); // Limit to 5 results
});

// Function to scroll to and open FAQ item
const openFaqItem = (itemId) => {
  const element = document.querySelector(`#faq-${itemId}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const details = element.querySelector('details');
    if (details && !details.open) {
      details.open = true;
    }
  }
  q.value = ''; // Clear search
};
</script>

<style scoped>
/* Icono del acordeón */
details .summary-icon {
  transition: transform 0.3s ease;
}
details[open] .summary-icon {
  transform: rotate(180deg) !important;
}

/* Respeto a usuarios con reducción de movimiento */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  details .summary-icon {
    transition: none;
  }
}
</style>
