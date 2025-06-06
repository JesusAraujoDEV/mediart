<template>
  <title>Mediart - Registro</title>
  <NuxtLayout>
    <NuxtPage />
    <div class="w-screen h-dvh flex justify-center items-center">
      <div
        class="md:w-1/3 max-md:w-5/6 h-fit max-md:aspect-auto gap-5 flex flex-col relative items-center justify-center glassEffect p-8 aspect-square rounded-lg"
      >
        <h2 class="text-3xl">Registro</h2>
        <form
          class="flex flex-col w-2/3 h-2/3 justify-center items-center gap-3 max-md:gap-2 max-md:w-5/6"
        >
          <input
            type="text"
            placeholder="Nombre de Usuario"
            class="w-full p-3 my-2 rounded border border-gray-300"
            v-model="username"
          />
          <input
            type="email"
            placeholder="Correo Electrónico"
            class="w-full p-3 my-2 rounded border border-gray-300"
            v-model="email"
          />
          <input
            type="password"
            placeholder="Contraseña"
            class="w-full p-3 my-2 rounded border border-gray-300"
            v-model="passwordHash"
          />
          <NuxtLink to="/login" class="hover:underline">
            <p>¿Ya tienes una cuenta de Mediart?</p>
          </NuxtLink>
          <button
            class="w-full bg-white text-black p-3 rounded-md hover:bg-slate-100 transition-all cursor-pointer"
          >
            Registrarse
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
import { ref } from 'vue';

definePageMeta({
  layout: "default",
});

const username = ref('');
const email = ref('');
const passwordHash = ref('');
</script>