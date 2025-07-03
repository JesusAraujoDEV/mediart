<template>
  <NuxtLayout :name="'custom'">
    <NuxtPage /> 
    <NavigationNavbar /> 
    <main class="w-screen min-h-dvh flex flex-col">

      <LandingMainSection />
      <LandingHowItWorksSection />
      <LandingCategoriesSection />
      <LandingWhyChooseUsSection />
      <LandingCommunitySection />
      <LandingCtaSection />
      
      
      <NuxtLink to="/login" class="hover:underline text-center text-2xl">
        </NuxtLink>
    </main>
    <NavigationFooter/>
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