<template>
  <title>Mediart - Login</title>
  <NuxtLayout>
    <NuxtPage />
    <main class="w-screen h-dvh flex justify-center items-center">
      <div
        class="md:w-1/3 max-md:w-5/6 h-fit max-md:aspect-auto gap-3 flex flex-col relative items-center justify-center glassEffect p-8 py-16 aspect-square rounded-lg"
      >
        <h2 class="text-3xl">Inicio de Sesión</h2>
        <form
          class="flex flex-col w-2/3 h-3/4 max-md:w-5/6 justify-center items-center"
          action=""
        >
          <label class="w-full mb-0" for="Email">Correo Electrónico</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon name="material-symbols:mail-outline" size='1.2rem' class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 -z-1"/>
            <input
              type="email"
              placeholder="tu@email.com"
              class="w-full pl-2 rounded border border-gray-300"
              id="Email"
            />
          </div>

          <label class="w-full mb-0" for="Password">Contraseña</label>
          <div class="flex flex-row w-full relative h-12">
            <Icon name="material-symbols:lock-outline" size='1.2rem' class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 -z-1"/>
            <input
              type="password"
              placeholder="••••••••"
              class="w-full pl-2 rounded border border-gray-300"
              id="Password"
            />
          </div>

          <NuxtLink to="/register" class="hover:underline text-center mt-6 text-sm">
            <p>¿Aún no tienes una cuenta? Regístrate</p>
          </NuxtLink>
          <button
            class="w-full bg-white text-black p-3 rounded-md hover:bg-slate-100 transition-all cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>
        <NuxtLink to="/">
          <img
            class="h-8 cursor-pointer transition-all duration-500 hover:scale-105"
            src="~/assets/mediart/mediartCompleto.webp"
            alt="Mediart Logo"
          />
        </NuxtLink>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
