<template>
  <NuxtLayout :name="'custom'">
    <NuxtPage /> 

    <main class="w-screen h-dvh flex justify-center items-center">
      <NavigationNavbar /> 
      
      <MainSection /> 
      
      <NuxtLink to="/login" class="hover:underline text-center text-2xl">
        </NuxtLink>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { definePageMeta, useHead } from '#imports';

definePageMeta({
  layout: "custom",
});

useHead({
  title: 'Mediart - Home',
  meta: [
    { name: 'description', content: 'Tu descripción para la página de inicio.' }
  ]
});
</script>

<style scoped>
</style>