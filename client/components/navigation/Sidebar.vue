<template>
  <!-- Sidebar - Ocupa toda la altura y se puede contraer -->
  <aside
    class="bg-white shadow-xl flex-shrink-0 transition-all duration-300 relative z-50"
    :class="{ 'w-64': isSidebarOpen, 'w-20': !isSidebarOpen }"
  >
    <div class="flex flex-col h-full p-4">
      <!-- Encabezado del sidebar (Logo y botón de toggle) -->
      <div class="flex items-center justify-between mb-8">
        <!-- Logo con transición -->
        <div class="flex items-center gap-2 overflow-hidden"
             :class="{ 'w-48': isSidebarOpen, 'w-0': !isSidebarOpen }">
          <img
            src="/mediart/mediartLogo.webp"
            alt="Mediart Logo"
            class="h-12 w-auto"
          />
          <span class="text-2xl font-bold text-gray-800 font-halenoir">MEDIART</span>
        </div>
        
        <!-- Botón para expandir/contraer -->
        <button
          @click="toggleSidebar"
          class="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
          :class="{ 'rotate-180': !isSidebarOpen }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevrons-left w-5 h-5 text-gray-500"
          >
            <path d="m11 17-5-5 5-5" />
            <path d="m18 17-5-5 5-5" />
          </svg>
        </button>
      </div>

      <!-- Menú de navegación -->
      <nav class="flex-grow overflow-y-auto">
        <ul class="space-y-2">
          <li v-for="(item, index) in menuItems" :key="index">
            <NuxtLink :to="item.path" :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 cursor-pointer group',
              {
                'bg-sky-500 text-white shadow-lg': isActive(item),
                'text-slate-600 hover:bg-slate-100': !isActive(item),
              },
              !isSidebarOpen ? 'justify-center' : ''
            ]">
              <div class="flex-none">
                <component :is="item.icon" class="w-5 h-5" />
              </div>
              <!-- Solo muestra el texto si el sidebar está abierto -->
              <span v-if="isSidebarOpen"
                    class="flex-grow font-medium overflow-hidden"
                    :class="{
                      'text-white': isActive(item),
                      'text-slate-800 group-hover:text-slate-900': !isActive(item),
                    }">
                {{ item.text }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
      
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronDown, Home, Folder, Users, Settings, Tag, MessageSquare, Book } from 'lucide-vue-next';

const route = useRoute();
const isSidebarOpen = ref(true);

const menuItems = [
  { text: 'Página Principal', icon: Home, path: '/' },
  { text: 'Sobre Nosotros', icon: Users, path: '/about-us' },
  { text: 'Cómo Funciona', icon: Settings, path: '/how-it-work' },
  { text: 'Por Qué Elegirnos', icon: Tag, path: '/why-choose-us' },
  { text: 'Testimonios', icon: MessageSquare, path: '/testimonials' },
  { text: 'Contacto', icon: Users, path: '/contact' },
  { text: 'Categorías', icon: Folder, path: '/categories' },
  { text: 'Blog', icon: Book, path: '/blog' },
  { text: 'Centro de Ayuda', icon: MessageSquare, path: '/help' },
];

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const isActive = (item) => {
  // Comprueba si la ruta actual coincide con la ruta del elemento
  return route.path === item.path;
};
</script>

<style scoped>
/* No se necesita CSS adicional ya que se usa Tailwind */
</style>
