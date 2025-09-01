<template>
  <NavigationNavbar />
  <div class="relative z-0">
    <main class="w-screen min-h-dvh flex flex-col">
      <LandingMainSection />
      <ClientOnly>
        <LazyHowItWorks />
        <LazyCategories />
        <LazyWhyChooseUs />
        <LazyCommunity />
        <LazyCta />
      </ClientOnly>

      <NuxtLink to="/login" class="hover:underline text-center text-2xl">
      </NuxtLink>
    </main>
    <NavigationFooter/>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useHead } from '#imports';
import { defineAsyncComponent } from 'vue';

const LazyHowItWorks = defineAsyncComponent(() => import('~/components/landing/HowItWorksSection.vue'))
const LazyCategories = defineAsyncComponent(() => import('~/components/landing/CategoriesSection.vue'))
const LazyWhyChooseUs = defineAsyncComponent(() => import('~/components/landing/WhyChooseUsSection.vue'))
const LazyCommunity = defineAsyncComponent(() => import('~/components/landing/CommunitySection.vue'))
const LazyCta = defineAsyncComponent(() => import('~/components/landing/CtaSection.vue'))

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
