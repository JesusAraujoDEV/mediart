<template>
  <title>MediartStudio - Centro de Ayuda Interactivo</title>
  <main class="w-screen min-h-screen flex flex-col items-center justify-start p-4 text-white">
    <NavigationStudio />

    <!-- Header con navegación mejorada -->
    <div class="w-full max-w-7xl flex justify-between items-center p-6 z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold">{{ currentContent.pageTitle }}</h1>
          <p class="text-sm text-gray-300">{{ currentContent.title }}</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button @click="toggleLanguage"
          class="glassEffect px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 action-button"
          :class="{
            'bg-blue-600 hover:bg-blue-700': currentLanguage === 'en',
            'bg-purple-600 hover:bg-purple-700': currentLanguage === 'es',
          }">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
          </svg>
          {{ currentLanguage === "en" ? "Español" : "English" }}
        </button>
      </div>
    </div>

    <!-- Navegación por tabs -->
    <div class="w-full max-w-7xl mb-6">
      <div class="glassEffect rounded-xl p-2 flex flex-wrap gap-2">
        <button v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 tab-button"
          :class="activeTab === tab.id
            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
            : 'text-gray-300 hover:text-white hover:bg-white/10'">
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.title }}
        </button>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="w-full max-w-7xl flex-1">
      <!-- Tab: Primeros Pasos -->
      <div v-if="activeTab === 'getting-started'" class="glassEffect rounded-xl p-8 tab-content">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-bold">{{ currentContent.title }}</h2>
            <p class="text-gray-300">{{ currentContent.intro }}</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-blue-500/30">
              <h3 class="text-xl font-semibold mb-3 flex items-center gap-2">
                <span class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                {{ currentContent.step1.heading }}
              </h3>
              <p class="text-gray-300 mb-4">{{ currentContent.step1.paragraph1 }} <strong>{{ currentContent.step1.strong1 }}</strong>{{ currentContent.step1.paragraph2 }} <strong>{{ currentContent.step1.strong2 }}</strong>{{ currentContent.step1.paragraph3 }} <strong>{{ currentContent.step1.strong3 }}</strong>{{ currentContent.step1.paragraph4 }}</p>
              <div class="bg-gray-800/50 rounded p-3 font-mono text-sm">
                Ejemplo: "The Beatles", "Star Wars", "Harry Potter"...
              </div>
            </div>

            <div class="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-500/30">
              <h3 class="text-xl font-semibold mb-3 flex items-center gap-2">
                <span class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                {{ currentContent.step2.heading }}
              </h3>
              <p class="text-gray-300 mb-4">{{ currentContent.step2.paragraph1 }} <strong>{{ currentContent.step2.strong1 }}</strong>{{ currentContent.step2.paragraph2 }} <strong>{{ currentContent.step2.strong2 }}</strong>{{ currentContent.step2.paragraph3 }}</p>
              <div class="flex flex-wrap gap-2">
                <span class="bg-white/20 px-3 py-1 rounded-full text-sm">Rock</span>
                <span class="bg-white/20 px-3 py-1 rounded-full text-sm">Sci-Fi</span>
                <span class="bg-white/20 px-3 py-1 rounded-full text-sm">Adventure</span>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-500/30">
              <h3 class="text-xl font-semibold mb-3 flex items-center gap-2">
                <span class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                {{ currentContent.step3.heading }}
              </h3>
              <p class="text-gray-300 mb-4">{{ currentContent.step3.paragraph1 }} <strong>{{ currentContent.step3.strong1 }}</strong>{{ currentContent.step3.paragraph2 }}</p>
              <div class="grid grid-cols-2 gap-2">
                <span class="bg-gray-700 px-3 py-2 rounded text-sm text-center"><strong>{{ currentContent.step3.list1Strong }}</strong><br>{{ currentContent.step3.listItem1 }}</span>
                <span class="bg-gray-700 px-3 py-2 rounded text-sm text-center"><strong>{{ currentContent.step3.list2Strong }}</strong><br>{{ currentContent.step3.listItem2 }}</span>
                <span class="bg-gray-700 px-3 py-2 rounded text-sm text-center"><strong>{{ currentContent.step3.list3Strong }}</strong><br>{{ currentContent.step3.listItem3 }}</span>
                <span class="bg-gray-700 px-3 py-2 rounded text-sm text-center"><strong>{{ currentContent.step3.list4Strong }}</strong><br>{{ currentContent.step3.listItem4 }}</span>
                <span class="bg-gray-700 px-3 py-2 rounded text-sm text-center"><strong>{{ currentContent.step3.list5Strong }}</strong><br>{{ currentContent.step3.listItem5 }}</span>
                <span class="bg-gray-700 px-3 py-2 rounded text-sm text-center"><strong>{{ currentContent.step3.list6Strong }}</strong><br>{{ currentContent.step3.listItem6 }}</span>
                <span class="bg-gray-700 px-3 py-2 rounded text-sm text-center"><strong>{{ currentContent.step3.list7Strong }}</strong><br>{{ currentContent.step3.listItem7 }}</span>
                <span class="bg-gray-700 px-3 py-2 rounded text-sm text-center"><strong>{{ currentContent.step3.list8Strong }}</strong><br>{{ currentContent.step3.listItem8 }}</span>
              </div>
            </div>

            <div class="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-6 border border-orange-500/30">
              <h3 class="text-xl font-semibold mb-3 flex items-center gap-2">
                <span class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                {{ currentContent.step4.heading }}
              </h3>
              <p class="text-gray-300 mb-4">{{ currentContent.step4.paragraph1 }} <strong>{{ currentContent.step4.strong1 }}</strong>{{ currentContent.step4.paragraph2 }} <strong>{{ currentContent.step4.strong2 }}</strong>{{ currentContent.step4.paragraph3 }}</p>
              <button class="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2 action-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Aceptar Playlist
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Nuevas Features -->
      <div v-if="activeTab === 'new-features'" class="glassEffect rounded-xl p-8 tab-content">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-bold">{{ currentContent.tabs.newFeatures }}</h2>
            <p class="text-gray-300">{{ currentContent.sections.newFeaturesDescription }}</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 feature-card">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M7 10l5 5 5-5H7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Flechas Dinámicas</h3>
            <p class="text-gray-300 text-sm">Los selectores ahora tienen flechas interactivas que indican su estado abierto/cerrado para una mejor experiencia visual.</p>
          </div>

          <div class="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 feature-card">
            <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Rendimiento Optimizado</h3>
            <p class="text-gray-300 text-sm">Sistema de caché inteligente que acelera las búsquedas y recomendaciones para una experiencia más fluida.</p>
          </div>

          <div class="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 feature-card">
            <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Botones Interactivos</h3>
            <p class="text-gray-300 text-sm">Botones de aceptar y rechazar más intuitivos con íconos y gradientes para una mejor usabilidad.</p>
          </div>

          <div class="bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-xl p-6 border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 feature-card">
            <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Imágenes Optimizadas</h3>
            <p class="text-gray-300 text-sm">Carga lazy y decodificación async para imágenes de portadas, mejorando el rendimiento general.</p>
          </div>

          <div class="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 feature-card">
            <div class="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Gestión de Playlists</h3>
            <p class="text-gray-300 text-sm">Mejor sistema para crear, editar y organizar tus playlists con opciones de colaboración.</p>
          </div>

          <div class="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl p-6 border border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-300 feature-card">
            <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Centro de Ayuda</h3>
            <p class="text-gray-300 text-sm">Esta guía interactiva con navegación por pestañas y tour guiado para nuevos usuarios.</p>
          </div>
        </div>
      </div>

      <!-- Tab: Consejos Avanzados -->
      <div v-if="activeTab === 'advanced-tips'" class="glassEffect rounded-xl p-8 tab-content">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-bold">{{ currentContent.tabs.advancedTips }}</h2>
            <p class="text-gray-300">{{ currentContent.sections.advancedTipsDescription }}</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-6 border border-yellow-500/30">
              <h3 class="text-xl font-semibold mb-3">Combinaciones Inteligentes</h3>
              <p class="text-gray-300 mb-4">Mezcla diferentes tipos de contenido para playlists únicas:</p>
              <ul class="space-y-2 text-sm">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Música + Películas del mismo género
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Libros + Series de TV adaptadas
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Videojuegos + Bandas sonoras
                </li>
              </ul>
            </div>

            <div class="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg p-6 border border-red-500/30">
              <h3 class="text-xl font-semibold mb-3">Optimización de Búsqueda</h3>
              <p class="text-gray-300 mb-4">Tips para mejores resultados:</p>
              <ul class="space-y-2 text-sm">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                  Usa términos específicos en lugar de genéricos
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                  Combina artistas con géneros musicales
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                  Incluye años para contenido específico
                </li>
              </ul>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-lg p-6 border border-green-500/30">
              <h3 class="text-xl font-semibold mb-3">Gestión de Playlists</h3>
              <p class="text-gray-300 mb-4">Organiza tus creaciones:</p>
              <ul class="space-y-2 text-sm">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  Nombres descriptivos para fácil identificación
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  Categoriza por mood o actividad
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                  Comparte playlists colaborativas
                </li>
              </ul>
            </div>

            <div class="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg p-6 border border-blue-500/30">
              <h3 class="text-xl font-semibold mb-3">Solución de Problemas</h3>
              <p class="text-gray-300 mb-4">Problemas comunes y soluciones:</p>
              <ul class="space-y-2 text-sm">
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Sin resultados: verifica ortografía y categoría
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Lento: el caché se activa automáticamente
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Error: intenta regenerar o contacta soporte
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: FAQ -->
      <div v-if="activeTab === 'faq'" class="glassEffect rounded-xl p-8 tab-content">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-bold">{{ currentContent.tabs.faq }}</h2>
            <p class="text-gray-300">{{ currentContent.sections.faqDescription }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <div v-for="faq in faqs" :key="faq.id"
            class="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-lg border border-gray-600/50 faq-item">
            <button @click="toggleFaq(faq.id)"
              class="w-full p-6 text-left flex items-center justify-between hover:bg-gray-600/30 transition-colors duration-300 faq-button">
              <span class="font-semibold text-lg">{{ faq.question }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"
                :class="{ 'rotate-180': faq.open }" class="transition-transform duration-300">
                <path d="M7 10l5 5 5-5H7z"/>
              </svg>
            </button>
            <div v-if="faq.open" class="px-6 pb-6">
              <p class="text-gray-300">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Contacto -->
      <div v-if="activeTab === 'contact'" class="glassEffect rounded-xl p-8 tab-content">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-bold">{{ currentContent.tabs.contact }}</h2>
            <p class="text-gray-300">{{ currentContent.sections.contactDescription }}</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-blue-500/30">
              <h3 class="text-xl font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {{ currentContent.contact.reportIssuesTitle }}
              </h3>
              <p class="text-gray-300 mb-4">{{ currentContent.contact.reportIssuesDescription }}</p>
              <button class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2 action-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                {{ currentContent.contact.reportIssuesButton }}
              </button>
            </div>

            <div class="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-500/30">
              <h3 class="text-xl font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {{ currentContent.contact.suggestionsTitle }}
              </h3>
              <p class="text-gray-300 mb-4">{{ currentContent.contact.suggestionsDescription }}</p>
              <button class="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2 action-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {{ currentContent.contact.suggestionsButton }}
              </button>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-6 border border-orange-500/30">
              <h3 class="text-xl font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                {{ currentContent.contact.contactTitle }}
              </h3>
              <p class="text-gray-300 mb-4">{{ currentContent.contact.contactDescription }}</p>
              <div class="space-y-2 text-sm">
                <p class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  support@mediartstudio.com
                </p>
                <p class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, h, computed } from "vue";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";
import { useHelpContent } from "~/composables/studio/useHelpContent";

definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

// Estado para navegación por tabs
const activeTab = ref('getting-started');

// Componentes de íconos inline
const StarIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  width: '16',
  height: '16',
  fill: 'currentColor'
}, [
  h('path', { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' })
]);

const SparklesIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  width: '16',
  height: '16',
  fill: 'currentColor'
}, [
  h('path', { d: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z' })
]);

const LightBulbIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  width: '16',
  height: '16',
  fill: 'currentColor'
}, [
  h('path', { d: 'M12 2C9.79 2 8 3.79 8 6v1H6c-1.1 0-2 .9-2 2v1c0 .55.45 1 1 1h.17l1 6.83c.1.6.6 1.17 1.21 1.17h8.34c.61 0 1.11-.57 1.21-1.17l1-6.83H19c.55 0 1-.45 1-1v-1c0-1.1-.9-2-2-2h-2V6c0-2.21-1.79-4-4-4zm-1 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-3c-1.66 0-3-1.34-3-3V6c0-1.66 1.34-3 3-3s3 1.34 3 3v3c0 1.66-1.34 3-3 3z' })
]);

const QuestionMarkCircleIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  width: '16',
  height: '16',
  fill: 'currentColor'
}, [
  h('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z' })
]);

const MailIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  width: '16',
  height: '16',
  fill: 'currentColor'
}, [
  h('path', { d: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' })
]);

// Definición de tabs
const tabs = computed(() => [
  {
    id: 'getting-started',
    title: currentContent.value.tabs.gettingStarted,
    icon: StarIcon
  },
  {
    id: 'new-features',
    title: currentContent.value.tabs.newFeatures,
    icon: SparklesIcon
  },
  {
    id: 'advanced-tips',
    title: currentContent.value.tabs.advancedTips,
    icon: LightBulbIcon
  },
  {
    id: 'faq',
    title: currentContent.value.tabs.faq,
    icon: QuestionMarkCircleIcon
  },
  {
    id: 'contact',
    title: currentContent.value.tabs.contact,
    icon: MailIcon
  }
]);

// Estado para controlar qué FAQ están abiertas
const openFaqs = ref<Record<number, boolean>>({});

// Función para alternar el estado de una FAQ
const toggleFaq = (faqId: number) => {
  openFaqs.value[faqId] = !openFaqs.value[faqId];
};

// FAQ data
const faqs = computed(() => [
  {
    id: 1,
    question: currentContent.value.faq.question1,
    answer: currentContent.value.faq.answer1,
    open: openFaqs.value[1] || false
  },
  {
    id: 2,
    question: currentContent.value.faq.question2,
    answer: currentContent.value.faq.answer2,
    open: openFaqs.value[2] || false
  },
  {
    id: 3,
    question: currentContent.value.faq.question3,
    answer: currentContent.value.faq.answer3,
    open: openFaqs.value[3] || false
  },
  {
    id: 4,
    question: currentContent.value.faq.question4,
    answer: currentContent.value.faq.answer4,
    open: openFaqs.value[4] || false
  },
  {
    id: 5,
    question: currentContent.value.faq.question5,
    answer: currentContent.value.faq.answer5,
    open: openFaqs.value[5] || false
  },
  {
    id: 6,
    question: currentContent.value.faq.question6,
    answer: currentContent.value.faq.answer6,
    open: openFaqs.value[6] || false
  }
]);

// Consumimos el composable para obtener el estado y las funciones
const { currentLanguage, toggleLanguage, currentContent } = useHelpContent();

</script>

<style scoped>
/* Estilos mejorados para el scrollbar */
.glassEffect::-webkit-scrollbar {
  width: 8px;
}

.glassEffect::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.glassEffect::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.glassEffect::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Animaciones suaves para las transiciones */
.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efectos hover mejorados */
.glassEffect {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Estilos para los botones de acción */
.action-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

/* Estilos para las tarjetas de features */
.feature-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

/* Gradientes animados */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animated-gradient {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

/* Estilos para FAQ */
.faq-item {
  transition: all 0.3s ease;
}

.faq-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* Responsive design improvements */
@media (max-width: 768px) {
  .glassEffect {
    margin: 1rem;
    padding: 1.5rem;
  }

  .tab-content {
    padding: 1rem;
  }
}

/* Loading states */
.loading-skeleton {
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>