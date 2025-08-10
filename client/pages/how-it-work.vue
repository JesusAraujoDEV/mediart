<template>
  <NuxtLayout :name="'custom'">
    <div class="min-h-screen w-full bg-blue-500 flex flex-col justify-center">
      <div class="container mx-auto p-8 text-white">
        <h1 class="text-4xl font-bold mb-6">Como funciona</h1>
        <p class="text-lg">
          ¡Bienvenido a Mediart! Somos una plataforma dedicada a ayudarte a descubrir y conectar con el arte de una manera única y personalizada. Creemos que cada persona tiene una historia que contar, y nuestro objetivo es proporcionarte las herramientas para explorar tus pasiones artísticas y compartirlas con el mundo.
        </p>
        <p class="text-lg mt-4">
          Nuestro equipo está formado por apasionados de la tecnología y el arte que trabajan para crear una experiencia intuitiva y enriquecedora. A través de la inteligencia artificial, ofrecemos recomendaciones adaptadas a tus gustos, conectándote con obras y artistas que realmente te importan.
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { definePageMeta } from '#imports';

definePageMeta({
  layout: "custom",
});
</script>

<style scoped>
</style>
