<template>
  <section
    id="categorias"
    class="relative w-full h-screen flex flex-col justify-start items-start p-4 md:p-8 overflow-hidden"
  >
    <div class="relative z-10 text-white w-full h-full">
      <!--Icono arriba de categorías-->
      <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 w-fit mb-6 md:mb-8">
        <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
        <span class="text-sm font-medium">Categorías</span>
      </div>

      <!--Computadora-->
      <div class="hidden md:block relative w-full h-full">
        <!--Izquierda-->
        <div class="absolute top-4 left-0 max-w-2xl lg:max-w-3xl xl:max-w-4xl">
          <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-lg text-left">
            Descubre un Universo <br />
            de Contenido en Mediart
          </h1>
        </div>
        
        <!-- Derecha-->
        <div class="absolute top-8 right-0 max-w-md lg:max-w-lg xl:max-w-xl">
          <p class="text-lg md:text-xl lg:text-2xl font-light drop-shadow-md font-alpine-body leading-relaxed text-right md:text-left mb-6">
            Desde los clásicos atemporales hasta las últimas novedades, <b>Mediart</b> abarca todo el espectro artístico para que nunca dejes de explorar.
          </p>
          
          <!-- CTA Button -->
          <div class="flex justify-start md:justify-start">
            <button class="group relative inline-flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full px-8 py-4 text-white font-semibold transition-all duration-300 border-2 border-white/40 hover:border-white/60 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
              <span class="text-base md:text-lg">Explorar Categorías</span>
              <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <ArrowRight class="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>

        <!-- Sección de Categorías Expandibles - Compu -->
        <div class="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-6xl">
          <div class="flex justify-center items-end space-x-3 lg:space-x-4">

            <!-- Mezcla -->
            <div class="group relative cursor-pointer">
              <div class="relative w-44 lg:w-44 h-98 lg:h-106 group-hover:w-108 lg:group-hover:w-100 transition-all duration-500 ease-out rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg" 
                  alt="Mezcla" 
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <!-- Contenido normal -->
                <div class="absolute bottom-0 left-0 right-0 p-4 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 class="text-white font-bold text-lg">Mezcla</h3>
                </div>
                
                <!-- Contenido expandido -->
                <div class="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                  <!-- Botón flecha -->
                  <div class="flex justify-end">
                    <button class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                      <ArrowRight class="w-4 h-4 text-white" />
                    </button>
                  </div>
                  
                  <!-- Texto expandido -->
                  <div>
                    <h3 class="text-white font-bold text-xl mb-2">Mezcla</h3>
                    <p class="text-white/90 text-sm leading-relaxed">Descubre clásicos atemporales y los últimos estrenos del cine mundial</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Canciones -->
            <div class="group relative cursor-pointer">
              <div class="relative w-44 lg:w-44 h-98 lg:h-106 group-hover:w-108 lg:group-hover:w-100 transition-all duration-500 ease-out rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg" 
                  alt="Canciones" 
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div class="absolute bottom-0 left-0 right-0 p-4 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 class="text-white font-bold text-lg">Canciones</h3>
                </div>
                
                <div class="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                  <div class="flex justify-end">
                    <button class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                      <ArrowRight class="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div>
                    <h3 class="text-white font-bold text-xl mb-2">Canciones</h3>
                    <p class="text-white/90 text-sm leading-relaxed">Nuevos artistas, géneros emergentes y clásicos que nunca pasan de moda</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Artistas -->
            <div class="group relative cursor-pointer">
              <div class="relative w-44 lg:w-44 h-98 lg:h-106 group-hover:w-108 lg:group-hover:w-100 transition-all duration-500 ease-out rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg" 
                  alt="Artistas" 
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div class="absolute bottom-0 left-0 right-0 p-4 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 class="text-white font-bold text-lg">Artistas</h3>
                </div>
                
                <div class="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                  <div class="flex justify-end">
                    <button class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                      <ArrowRight class="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div>
                    <h3 class="text-white font-bold text-xl mb-2">Artistas</h3>
                    <p class="text-white/90 text-sm leading-relaxed">Nuevos artistas, géneros emergentes y clásicos que nunca pasan de moda</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Álbumes -->
            <div class="group relative cursor-pointer">
              <div class="relative w-44 lg:w-44 h-98 lg:h-106 group-hover:w-108 lg:group-hover:w-100 transition-all duration-500 ease-out rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg" 
                  alt="Albumes" 
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div class="absolute bottom-0 left-0 right-0 p-4 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 class="text-white font-bold text-lg">Álbumes</h3>
                </div>
                
                <div class="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                  <div class="flex justify-end">
                    <button class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                      <ArrowRight class="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div>
                    <h3 class="text-white font-bold text-xl mb-2">Álbumes</h3>
                    <p class="text-white/90 text-sm leading-relaxed">Nuevos artistas, géneros emergentes y clásicos que nunca pasan de moda</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Películas -->
            <div class="group relative cursor-pointer">
              <div class="relative w-44 lg:w-44 h-98 lg:h-106 group-hover:w-108 lg:group-hover:w-100 transition-all duration-500 ease-out rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg" 
                  alt="Películas" 
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <!-- Contenido normal -->
                <div class="absolute bottom-0 left-0 right-0 p-4 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 class="text-white font-bold text-lg">Películas</h3>
                </div>
                
                <!-- Contenido expandido -->
                <div class="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                  <!-- Botón flecha -->
                  <div class="flex justify-end">
                    <button class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                      <ArrowRight class="w-4 h-4 text-white" />
                    </button>
                  </div>
                  
                  <!-- Texto expandido -->
                  <div>
                    <h3 class="text-white font-bold text-xl mb-2">Películas</h3>
                    <p class="text-white/90 text-sm leading-relaxed">Descubre clásicos atemporales y los últimos estrenos del cine mundial</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Series TV -->
            <div class="group relative cursor-pointer">
              <div class="relative w-44 lg:w-44 h-98 lg:h-106 group-hover:w-108 lg:group-hover:w-100 transition-all duration-500 ease-out rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg" 
                  alt="Series TV" 
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div class="absolute bottom-0 left-0 right-0 p-4 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 class="text-white font-bold text-lg">Series TV</h3>
                </div>
                
                <div class="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                  <div class="flex justify-end">
                    <button class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                      <ArrowRight class="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div>
                    <h3 class="text-white font-bold text-xl mb-2">Series TV</h3>
                    <p class="text-white/90 text-sm leading-relaxed">Maratones épicos y nuevos episodios de tus series favoritas</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Videojuegos -->
            <div class="group relative cursor-pointer">
              <div class="relative w-44 lg:w-44 h-98 lg:h-106 group-hover:w-108 lg:group-hover:w-100 transition-all duration-500 ease-out rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg" 
                  alt="Videojuegos" 
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div class="absolute bottom-0 left-0 right-0 p-4 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 class="text-white font-bold text-lg">Videojuegos</h3>
                </div>
                
                <div class="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                  <div class="flex justify-end">
                    <button class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                      <ArrowRight class="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div>
                    <h3 class="text-white font-bold text-xl mb-2">Videojuegos</h3>
                    <p class="text-white/90 text-sm leading-relaxed">Desde indies innovadores hasta los AAA más esperados del año</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Libros -->
            <div class="group relative cursor-pointer">
              <div class="relative w-44 lg:w-44 h-98 lg:h-106 group-hover:w-108 lg:group-hover:w-100 transition-all duration-500 ease-out rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg" 
                  alt="Libros" 
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div class="absolute bottom-0 left-0 right-0 p-4 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 class="text-white font-bold text-lg">Libros</h3>
                </div>
                
                <div class="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                  <div class="flex justify-end">
                    <button class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200">
                      <ArrowRight class="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div>
                    <h3 class="text-white font-bold text-xl mb-2">Libros</h3>
                    <p class="text-white/90 text-sm leading-relaxed">Literatura contemporánea, clásicos universales y nuevas publicaciones</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!--Telefono-->
      <div class="block md:hidden">
        <!--Título-->
        <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight mb-6 drop-shadow-lg text-left">
          Descubre un Universo <br />
          de Contenido en Mediart
        </h1>
        
        <!--Descripción-->
        <p class="text-lg sm:text-xl font-light drop-shadow-md font-alpine-body leading-relaxed mb-8">
          Desde los clásicos atemporales hasta las últimas novedades, <b>Mediart</b> abarca todo el espectro artístico para que nunca dejes de explorar.
        </p>

        <!-- CTA Button Mobile -->
        <div class="mb-8">
          <button class="group relative inline-flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full px-6 py-3 text-white font-semibold transition-all duration-300 border-2 border-white/40 hover:border-white/60 hover:scale-105 active:scale-95 shadow-lg">
            <span class="text-base">Explorar Categorías</span>
            <div class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
              <ArrowRight class="w-3 h-3" />
            </div>
          </button>
        </div>

        <!-- Categorías Mobile - Grid simple -->
        <div class="grid grid-cols-2 gap-4">
          <div v-for="category in mobileCategories" :key="category.name" class="relative h-32 rounded-xl overflow-hidden shadow-lg">
            <img 
              :src="category.image" 
              :alt="category.name" 
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-3">
              <h3 class="text-white font-bold text-sm">{{ category.name }}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

const mobileCategories = [
  { name: 'Películas', image: 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg' },
  { name: 'Series', image: 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg' },
  { name: 'Música', image: 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg' },
  { name: 'Videojuegos', image: 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg' },
  { name: 'Libros', image: 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg' }
]
</script>

<style scoped>
h1 {
  text-shadow: 0 4px 8px rgba(0,0,0,0.5);
}

@supports (backdrop-filter: blur(10px)) {
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
  .backdrop-blur-md {
    backdrop-filter: blur(12px);
  }
  .backdrop-blur-lg {
    backdrop-filter: blur(20px);
  }
}

h1 {
  line-height: 1.1;
}

p {
  line-height: 1.6;
}

/* Asegurar que las transiciones sean suaves */
.group {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Prevenir que otros elementos se muevan durante la expansión */
.group:hover ~ .group {
  transform: translateX(0);
}




</style>