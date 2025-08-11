<template>
  <title>Mediart - Inicio de Sesión</title>
  <NuxtLayout>
    <main class="w-screen h-dvh flex justify-center items-center">
      <div
        class="md:w-1/3 max-md:w-full h-fit gap-6 flex flex-col relative items-center justify-center glassEffect p-8 py-16 rounded-lg">
        <h2 class="text-3xl">Inicio de Sesión</h2>
        <form class="flex flex-col w-2/3 h-3/4 max-md:w-5/6 justify-center items-center" id="loginForm"
          @submit.prevent="handleLogin">
          
          <!-- Campo de Correo Electrónico -->
          <label class="w-full mb-0" for="Email">Correo Electrónico</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon name="material-symbols:mail-outline" size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 pointer-events-none" />
            <input type="email" placeholder="tu@email.com"
              class="w-full pl-2 pr-6 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 max-md:text-sm"
              id="Email" v-model="email" :disabled="loading" autocomplete="email" />
          </div>

          <!-- Campo de Contraseña -->
          <label class="w-full mb-0" for="Password">Contraseña</label>
          <div class="flex flex-row w-full relative h-12">
            <Icon name="material-symbols:lock-outline" size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 pointer-events-none" />
            <input type="password" placeholder="••••••••"
              class="w-full pl-2 pr-6 rounded border border-gray-300 focus:outline-none max-md:text-sm focus:ring-2 focus:ring-blue-500"
              id="Password" v-model="password" :disabled="loading" autocomplete="current-password" />
          </div>

          <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>

          <NuxtLink to="/register" class="hover:underline text-center m-3 text-sm">
            <p>¿Aún no tienes una cuenta? Regístrate</p>
          </NuxtLink>
          <button type="submit"
            class="w-full bg-white text-black p-3 rounded-md transition-all duration-200 cursor-pointer"
            :class="{ 'hover:bg-gray-200': !loading, 'opacity-50 cursor-not-allowed': loading }" :disabled="loading">
            <span v-if="!loading">Iniciar Sesión</span>
            <span v-else>Cargando...</span>
          </button>
          <NuxtLink to="/forgot" class="hover:underline text-center m-3 text-sm">
            <p>¿Se te olvidó tu contraseña?</p>
          </NuxtLink>
        </form>
        <NuxtLink to="/">
          <img class="h-8 cursor-pointer transition-all duration-500 hover:scale-105"
            src="/mediart/mediartCompleto.webp" alt="Mediart Logo" loading="lazy" width="120" height="32" />
        </NuxtLink>
      </div>
    </main>
</template>

<script setup lang="ts">
import { useAuthLogin } from '~/composables/useAuthLogin';

definePageMeta({
  layout: "default",
  title: "Mediart - Login",
});

// Extraemos la lógica de inicio de sesión desde el composable
const { email, password, loading, error, handleLogin } = useAuthLogin();
</script>
