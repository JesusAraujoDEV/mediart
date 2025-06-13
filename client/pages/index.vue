<template>
  <NuxtLayout :name="'custom'">
    <NuxtPage />
    <main class="w-screen h-dvh">
      
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom",
});
</script>