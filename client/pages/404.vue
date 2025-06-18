<template>
  <NuxtLayout>
    <main class="w-screen h-dvh flex justify-center items-center">
      <div
        class="md:w-1/3 max-md:w-5/6 h-fit max-md:aspect-auto gap-3 flex flex-col relative items-center justify-center glassEffect p-8 py-16 aspect-square rounded-lg"
      >
        <h2 class="text-3xl text-center">¡Ups! Página no encontrada</h2>
        <p class="text-center">Parece que la página que buscas no existe o se ha movido.</p>
        <p class="text-center">No te preocupes, puedes volver a la página de inicio:</p>
        <NuxtLink to="/">
          <img
            class="h-8 cursor-pointer"
            src="/mediart/mediartCompleto.webp"
            alt="Logo de Mediart"
          />
        </NuxtLink>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: "custom",
});

useHead(() => ({
  status: 404, 
  title: "Página no encontrada - Mediart",
}));
</script>