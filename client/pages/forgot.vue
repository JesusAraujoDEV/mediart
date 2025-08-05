<template>
  <NuxtLayout>
    <main class="w-screen h-dvh flex justify-center items-center">
      <div
        class="md:w-1/3 max-md:w-full h-fit gap-6 flex flex-col relative items-center justify-center glassEffect p-8 py-16 rounded-lg">
        <h2 class="text-3xl text-center">Recuperar Contraseña</h2>

        <form class="flex flex-col w-2/3 h-3/4 max-md:w-5/6 justify-center items-center"
          @submit.prevent="requestPasswordReset">
          <p class="text-center mb-4">
            Ingresa tu correo electrónico y te enviaremos un <b>enlace</b> para restablecer tu contraseña.
          </p>
          <label class="w-full mb-0" for="forgotEmail">Correo Electrónico</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon name="material-symbols:mail-outline" size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 pointer-events-none" />
            <input type="email" placeholder="tu@email.com"
              class="w-full pl-2 pr-6 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="forgotEmail" v-model="email" :disabled="loading" autocomplete="email" />
          </div>

          <p v-if="error" class="text-red-500 text-sm mt-2 text-center">{{ error }}</p>
          <p v-if="message" class="text-green-600 text-sm m-2 text-center">{{ message }}</p>

          <button type="submit"
            class="w-full bg-white cursor-pointer text-black p-3 rounded-md transition-all duration-200"
            :class="{ 'hover:bg-gray-200': !loading, 'opacity-50 cursor-not-allowed': loading }" :disabled="loading">
            <span v-if="!loading">Enviar codigo</span>
            <span v-else>Enviando...</span>
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
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  layout: "default",
  title: "Mediart - Recuperar Contraseña",
});

const config = useRuntimeConfig();

const email = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const message = ref<string | null>(null);

const requestPasswordReset = async () => {
  loading.value = true;
  error.value = null;
  message.value = null;

  if (!email.value) {
    error.value = 'Por favor, ingresa tu correo electrónico.';
    loading.value = false;
    return;
  }

  try {
    const requestResetUrl = `${config.public.backend}/api/auth/recovery`;

    const response = await fetch(requestResetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al solicitar el restablecimiento de contraseña.');
    }

    message.value = 'Si tu correo electrónico está registrado, te enviaremos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.';
    email.value = '';

  } catch (err: any) {
    error.value = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.';
    console.error('Request password reset error:', err);
  } finally {
    loading.value = false;
  }
};
</script>