<template>
  <section
    id="como-funciona"
    class="relative w-full min-h-screen flex flex-col justify-center items-center p-4 md:p-8 overflow-hidden" 
    >
    <div class="absolute inset-0 bg-black/10"></div>

    <div class="relative z-10 text-white text-center max-w-6xl mx-auto"> 
      <div class="mb-16">
        <div class="flex items-center justify-center mb-6">
          <div class="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            <span class="text-sm font-medium">Cómo Funciona</span>
          </div>
        </div>
      
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
          Descubre el Arte que Amarás
        </h1>
        
        <p class="text-lg sm:text-xl md:text-2xl font-light max-w-3xl mx-auto">
          Mediart te conecta con tus próximas obsesiones artísticas en 3 simples pasos
        </p>
      </div>

      <!--Paso1-->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div class="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
            <div class="text-center mb-6">
              <div class="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-xl mb-4">
                <User class="w-6 h-6 text-purple-300" />
              </div>
              <div class="text-sm font-semibold text-purple-300 mb-2">PASO 1</div>
              <h3 class="text-xl font-bold mb-2">Regístrate en Mediart</h3>
              <p class="text-sm text-purple-200">Solo necesitas tu correo, nombre de usuario y una contraseña.</p>
            </div>
            
            <div class="space-y-3">
              <div class="bg-white/5 rounded-lg p-3 border border-white/10">
                <div class="flex items-center space-x-2">
                  <Mail class="w-4 h-4 text-purple-300" />
                  <span class="text-sm text-purple-200">Correo Electrónico</span>
                </div>
              </div>
              <div class="bg-white/5 rounded-lg p-3 border border-white/10">
                <div class="flex items-center space-x-2">
                  <User class="w-4 h-4 text-purple-300" />
                  <span class="text-sm text-purple-200">Nombre de Usuario</span>
                </div>
              </div>
              <div class="bg-white/5 rounded-lg p-3 border border-white/10">
                <div class="flex items-center space-x-2">
                  <Lock class="w-4 h-4 text-purple-300" />
                  <span class="text-sm text-purple-200">Contraseña</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--Paso2-->
        <div class="relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div class="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300">
            <div class="text-center mb-6">
              <div class="inline-flex items-center justify-center w-12 h-12 bg-indigo-500/20 rounded-xl mb-4">
                <Heart class="w-6 h-6 text-indigo-300"/>
              </div>
              <div class="text-sm font-semibold text-indigo-300 mb-2">PASO 2</div>
              <h3 class="text-xl font-bold mb-2">Define tus Intereses</h3>
              <p class="text-sm text-indigo-200">Comparte un gusto y elige el tipo de arte para tus recomendaciones.</p>
            </div>
            
            <div class="space-y-4">
              <div class="bg-white/5 rounded-lg p-3 border border-white/10">
                <div class="flex items-center space-x-2">
                  <Search class="w-4 h-4 text-indigo-300"/>
                  <span class="text-sm text-indigo-200">Ej: Olivia Rodrigo</span>
                </div>
              </div>

              <div class="text-xs text-indigo-200 text-left">Quiero recomendaciones de:</div>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="bg-indigo-500/20 rounded-lg p-2 border border-indigo-500/30 flex items-center justify-center space-x-2 hover:bg-indigo-500/30 transition-colors duration-200 cursor-pointer">
                  <Music class="w-4 h-4 text-indigo-300"/>
                  <span>Música</span>
                </div>
                <div class="bg-white/5 rounded-lg p-2 border border-white/10 flex items-center justify-center space-x-2 hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                  <Clapperboard class="w-4 h-4 text-indigo-300"/>
                  <span>Películas</span>
                </div>
                <div class="bg-white/5 rounded-lg p-2 border border-white/10 flex items-center justify-center space-x-2 hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                    <Gamepad2 class="w-4 h-4 text-indigo-300"/>
                    <span>Juegos</span>
                </div>
                <div class="bg-white/5 rounded-lg p-2 border border-white/10 flex items-center justify-center space-x-2 hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                  <BookText class="w-4 h-4 text-indigo-300"/>
                  <span>Libros</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { User, Mail, Lock, Search, Heart, Music, Gamepad2, BookText, Clapperboard } from 'lucide-vue-next'
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
</style>