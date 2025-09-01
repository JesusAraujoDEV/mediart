<template>
  <title>Mediart - Restablecer Contraseña</title>
  <main class="w-screen h-dvh flex justify-center items-center">
    <div
      class="md:w-1/3 max-md:w-full h-fit gap-6 flex flex-col relative items-center justify-center glassEffect p-8 py-16 rounded-lg">
        <h2 class="text-3xl">Restablecer Contraseña</h2>

        <template v-if="!token">
          <p class="text-center text-red-500 mb-4">
            El enlace de restablecimiento es inválido o ha caducado.
          </p>
          <NuxtLink to="/forgot" class="hover:underline text-center m-3 text-sm">
            <p>Solicitar un nuevo enlace</p>
          </NuxtLink>
        </template>

        <form v-else class="flex flex-col w-2/3 h-3/4 max-md:w-5/6 justify-center items-center"
          @submit.prevent="resetPassword">
          <p class="text-center mb-4">
            Ingresa tu nueva contraseña a continuación.
          </p>

          <label class="w-full mb-0" for="newPassword">Nueva Contraseña</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon name="material-symbols:lock-outline" size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 pointer-events-none" />
            <input type="password" placeholder="••••••••"
              class="w-full pl-2 pr-6 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 max-md:text-sm"
              id="newPassword" v-model="newPassword" :disabled="loading" autocomplete="new-password" />
          </div>

          <label class="w-full mb-0" for="confirmPassword">Confirmar Contraseña</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon name="material-symbols:lock-outline" size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 pointer-events-none" />
            <input type="password" placeholder="••••••••"
              class="w-full pl-2 pr-6 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 max-md:text-sm"
              id="confirmPassword" v-model="confirmPassword" :disabled="loading" autocomplete="new-password" />
          </div>

          <p v-if="error" class="text-red-500 text-sm mt-2 text-center">{{ error }}</p>
          <p v-if="message" class="text-green-600 text-sm mt-2 text-center">{{ message }}</p>

          <button type="submit"
            class="w-full bg-white cursor-pointer text-black p-3 rounded-md transition-all duration-200"
            :class="{ 'hover:bg-gray-200': !loading, 'opacity-50 cursor-not-allowed': loading }" :disabled="loading">
            <span v-if="!loading">Restablecer Contraseña</span>
            <span v-else>Restableciendo...</span>
          </button>
          <NuxtLink to="/login" class="hover:underline text-center m-3 text-sm">
            <p>Volver al inicio de sesión</p>
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
import { usePasswordReset } from '~/composables/usePasswordReset';

definePageMeta({
  layout: 'default',
  title: 'Mediart - Restablecer Contraseña',
});

// Extraemos la lógica del composable
const { token, newPassword, confirmPassword, loading, error, message, resetPassword } = usePasswordReset();
</script>