<template>
  <NuxtLayout :name="'custom'">
    <NuxtPage />
    <main class="w-screen h-dvh flex justify-center items-center">
      <NuxtLink to="/login" class="hover:underline text-center text-2xl">
        <p>Iniciar de sesión</p>
      </NuxtLink>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom",
});
</script>
