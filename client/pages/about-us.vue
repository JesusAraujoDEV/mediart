<template>
  <NuxtLayout :name="'custom'">
    <div class="flex">
      <NavigationSidebar />
      <div class="min-h-screen w-full bg-blue-500 flex flex-col justify-center">
        <div class="container mx-auto p-8 text-white">
          <h1 class="text-4xl font-bold mb-6">Sobre Mediart</h1>
          <p class="text-lg mb-4">
            Mediart es mucho más que una plataforma de recomendaciones: es un espacio donde la creatividad, la tecnología y la pasión por el arte convergen para inspirar a millones de personas. Nuestra misión es democratizar el acceso a la cultura y el entretenimiento, ayudando a cada usuario a descubrir nuevas obras, artistas y experiencias que enriquezcan su vida.
          </p>
          <p class="text-lg mb-4">
            Utilizando inteligencia artificial de vanguardia, Mediart analiza tus gustos y preferencias para ofrecerte listas personalizadas de música, películas, series, libros, videojuegos y mucho más. Creemos que el arte es una herramienta poderosa para conectar personas, despertar emociones y fomentar el crecimiento personal.
          </p>
          <p class="text-lg mb-4">
            Nuestro equipo está formado por amantes del arte, la tecnología y la innovación, comprometidos con crear una experiencia intuitiva, inclusiva y segura. Trabajamos cada día para que Mediart sea tu aliado en la búsqueda de inspiración, aprendizaje y disfrute cultural.
          </p>
          <p class="text-lg mb-4">
            <span class="font-bold">¿Por qué Mediart?</span><br>
            Porque creemos que cada persona merece descubrir historias, sonidos e imágenes que resuenen con su esencia. Porque la cultura es un derecho, no un privilegio. Porque la tecnología puede ser un puente hacia la sensibilidad y la creatividad.
          </p>
          <p class="text-lg">
            Gracias por ser parte de Mediart. Juntos, hacemos del arte una experiencia viva, accesible y transformadora.
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { definePageMeta } from '#imports';
import NavigationSidebar from '~/components/navigation/Sidebar.vue';

definePageMeta({
  layout: "custom",
});
</script>

<style scoped>
</style>
