<template>
  <NuxtLayout :name="'custom'">
    <NavigationNavbar /> 
    <div class="relative z-0">
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
    </div>
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
