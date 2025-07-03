<template>
  <footer class="relative">
    <!-- Footer -->
    <div class="relative z-10 mx-2 md:mx-2 lg:mx-6 mt-1.5">
      <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
        
        <!-- Header del Footer -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div class="flex items-center mb-4 md:mb-0">
            <img 
              src="/public/mediart/mediartLogo.webp" 
              alt="Mediart Logo" 
              class="h-12 w-auto mr-3" 
            />
            <span class="text-2xl font-bold text-gray-800">Mediart</span>
          </div>
          <p class="text-gray-600 text-lg font-medium max-w-md text-right">
            Descubre tu próxima obsesión artística con recomendaciones personalizadas.
          </p>
        </div>

        <!-- Contenido principal del footer -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

            <!-- Columna Empresa -->
          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-4">Empresa</h3>
            <ul class="space-y-3">
              <li><NuxtLink to="/sobre-nosotros" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Sobre Nosotros</NuxtLink></li>
              <li><NuxtLink to="/como-funciona" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Cómo Funciona</NuxtLink></li>
              <li><NuxtLink to="/por-que-elegirnos" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Por Qué Elegirnos</NuxtLink></li>
              <li><NuxtLink to="/testimonios" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Testimonios</NuxtLink></li>
              <li><NuxtLink to="/contacto" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Contacto</NuxtLink></li>
            </ul>
          </div>

          <!-- Columna Navegación -->
          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-4">Navegación</h3>
            <ul class="space-y-3">
              <li><NuxtLink to="/categorias" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Categorías</NuxtLink></li>
              <li><NuxtLink to="/recomendaciones" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Recomendaciones</NuxtLink></li>
              <li><NuxtLink to="/comunidad" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Comunidad</NuxtLink></li>
              <li><NuxtLink to="/blog" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Blog</NuxtLink></li>
              <li><NuxtLink to="/ayuda" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">Centro de Ayuda</NuxtLink></li>
            </ul>
          </div>

          <!-- Columna Contacto -->
          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-4">Contacto</h3>
            <ul class="space-y-4">
              <li class="flex items-center">
                <svg class="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <a href="mailto:mediart.noreply@gmail.com" class="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  mediart.noreply@gmail.com
                </a>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                 <a href="tel:+584144019911" class="text-gray-600 hover:text-blue-600 transition-colors duration-200 ml-2 number-font">
                  +58 414-4019911
                </a>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="text-gray-600">Valencia, Venezuela</span>
              </li>
            </ul>
          </div>

          <!-- Columna Redes Sociales -->
          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-4">Síguenos</h3>
            <div class="flex space-x-4 mb-6">
              <!--Linkldn -->
              <a href="#" class="w-10 h-10 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center transition-colors duration-200">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <!--Pinterest-->
              <a href="#" class="w-10 h-10 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center transition-colors duration-200">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <!--Twitter-->
              <a href="#" class="w-10 h-10 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center transition-colors duration-200">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <!--Youtube-->
              <a href="#" class="w-10 h-10 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center transition-colors duration-200">
                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>