<template>
  <NuxtLayout :name="'custom'">
    <div class="min-h-screen w-full bg-slate-900 flex flex-col justify-center">
      <div class="container mx-auto p-8 text-white">
        <h1 class="text-4xl font-bold mb-6 text-center uppercase">Albumenes</h1>
        <p class="text-lg text-center max-w-2xl mx-auto">
          Aquí podrás encontrar todo el contenido relacionado con canciones.
          Pronto añadiremos más funcionalidades para que puedas descubrir nueva música.
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
