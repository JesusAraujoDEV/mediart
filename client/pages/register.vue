<template>
  <title>Mediart - Registro</title>
  <main class="w-screen h-dvh flex justify-center items-center">
    <div
      class="md:w-1/3 max-md:w-full h-fit gap-6 flex flex-col relative items-center justify-center glassEffect p-8 py-16 rounded-lg">
        <h2 class="text-3xl text-center">Registro de Nueva Cuenta</h2>
        <form class="flex flex-col w-2/3 h-3/4 max-md:w-5/6 justify-center items-center" id="registerForm"
          @submit.prevent="handleRegister">

          <label class="w-full mb-0" for="Email">Correo Electrónico</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon name="material-symbols:mail-outline" size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 -z-1" />
            <input type="email" placeholder="tu@email.com"
              class="w-full p-4 rounded border border-gray-300 max-md:text-sm" id="Email" v-model="email"
              :disabled="loading" required autocomplete="email" />
          </div>

          <label class="w-full mb-0" for="Username">Nombre de Usuario</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon name="material-symbols:person-outline" size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 -z-1" />
            <input type="text" placeholder="tu_usuario" class="w-full p-4 rounded border border-gray-300 max-md:text-sm"
              id="Username" v-model="username" :disabled="loading" required autocomplete="off" />
          </div>

          <label class="w-full mb-0" for="Password">Contraseña</label>
          <div class="flex flex-row w-full relative h-12">
            <Icon name="material-symbols:lock-outline" size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 -z-1" />
            <input type="password" placeholder="••••••••"
              class="w-full p-4 rounded border border-gray-300 max-md:text-sm" id="Password" v-model="password"
              :disabled="loading" required autocomplete="new-password" />
          </div>

          <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>

          <NuxtLink to="/login" class="hover:underline text-center m-3 text-sm">
            <p>¿Ya tienes una cuenta? Inicia Sesión</p>
          </NuxtLink>
          <button type="submit" class="w-full bg-white text-black p-3 rounded-md transition-all cursor-pointer" :class="{
            'hover:bg-slate-100': !loading,
            'opacity-50 cursor-not-allowed': loading,
          }" :disabled="loading">
            <span v-if="!loading">Registrarse</span>
            <span v-else>Registrando...</span>
          </button>
        </form>
        <NuxtLink to="/">
          <img class="h-8 cursor-pointer transition-all duration-500 hover:scale-105"
            src="/mediart/mediartCompleto.webp" alt="Mediart Logo" />
        </NuxtLink>
      </div>
  </main>
</template>

<script setup lang="ts">
import { useAuthRegister } from '~/composables/useAuthRegister';

definePageMeta({
  layout: "default",
  title: "Mediart - Registro",
});

const { email, username, password, loading, error, handleRegister } = useAuthRegister();
</script>
