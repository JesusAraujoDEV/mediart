<template>
  <title>Mediart - Login</title>
  <NuxtLayout>
    <NuxtPage />
    <div class="w-screen h-dvh flex justify-center items-center">
      <div
        class="md:w-1/3 max-md:w-5/6 h-fit max-md:aspect-auto gap-3 flex flex-col relative items-center justify-center glassEffect p-8 py-16 aspect-square rounded-lg"
      >
        <h2 class="text-3xl">Inicio de Sesión</h2>
        <form
          class="flex flex-col w-2/3 h-2/3 max-md:w-5/6 justify-center items-center gap-3"
          action=""
        >
          <input
            type="email"
            placeholder="Correo Electrónico"
            class="w-full p-3 my-2 rounded border border-gray-300"
          />
          <input
            type="password"
            placeholder="Contraseña"
            class="w-full p-3 my-2 rounded border border-gray-300"
          />
          <NuxtLink to="/register" class="hover:underline text-center">
            <p>¿Aun no tienes una cuenta de Mediart?</p>
          </NuxtLink>
          <button
            class="w-full bg-white text-black p-3 rounded-md hover:bg-slate-100 transition-all cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>
        <NuxtLink to="/">
          <img
            class="h-8 cursor-pointer"
            src="~/assets/mediart/mediartCompleto.webp"
            alt="Mediart Logo"
          />
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
