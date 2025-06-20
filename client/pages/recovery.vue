<template>
  <NuxtLayout>
    <main class="w-screen h-dvh flex justify-center items-center">
      <div
        class="md:w-1/3 max-md:w-full h-fit gap-6 flex flex-col relative items-center justify-center glassEffect p-8 py-16 rounded-lg"
      >
        <h2 class="text-3xl">Restablecer Contraseña</h2>

        <template v-if="!token">
          <p class="text-center text-red-500 mb-4">
            Token de restablecimiento no encontrado en la URL. Por favor, usa el enlace completo de tu correo.
          </p>
          <NuxtLink to="/forgot" class="hover:underline text-center m-3 text-sm">
            <p>Solicitar un nuevo enlace</p>
          </NuxtLink>
        </template>

        <form
          v-else
          class="flex flex-col w-2/3 h-3/4 max-md:w-5/6 justify-center items-center"
          @submit.prevent="resetPassword"
        >
          <p class="text-center mb-4">
            Ingresa tu nueva contraseña a continuación.
          </p>

          <label class="w-full mb-0" for="newPassword">Nueva Contraseña</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon
              name="material-symbols:lock-outline"
              size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 pointer-events-none"
            />
            <input
              type="password"
              placeholder="••••••••"
              class="w-full pl-2 pr-6 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 max-md:text-sm"
              id="newPassword"
              v-model="newPassword"
              :disabled="loading"
              autocomplete="new-password"
            />
          </div>

          <label class="w-full mb-0" for="confirmPassword">Confirmar Contraseña</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon
              name="material-symbols:lock-outline"
              size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 pointer-events-none"
            />
            <input
              type="password"
              placeholder="••••••••"
              class="w-full pl-2 pr-6 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 max-md:text-sm"
              id="confirmPassword"
              v-model="confirmPassword"
              :disabled="loading"
              autocomplete="new-password"
            />
          </div>

          <p v-if="error" class="text-red-500 text-sm mt-2 text-center">{{ error }}</p>
          <p v-if="message" class="text-green-600 text-sm mt-2 text-center">{{ message }}</p>

          <button
            type="submit"
            class="w-full bg-white cursor-pointer text-black p-3 rounded-md transition-all duration-200"
            :class="{ 'hover:bg-gray-200': !loading, 'opacity-50 cursor-not-allowed': loading }"
            :disabled="loading"
          >
            <span v-if="!loading">Restablecer Contraseña</span>
            <span v-else>Restableciendo...</span>
          </button>
          <NuxtLink to="/login" class="hover:underline text-center m-3 text-sm">
            <p>Volver al inicio de sesión</p>
          </NuxtLink>
        </form>

        <NuxtLink to="/">
          <img
            class="h-8 cursor-pointer transition-all duration-500 hover:scale-105"
            src="/mediart/mediartCompleto.webp"
            alt="Mediart Logo"
            loading="lazy"
            width="120"
            height="32"
          />
        </NuxtLink>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Page-specific configurations for Nuxt.
definePageMeta({
  layout: "default",
  title: "Mediart - Restablecer Contraseña",
});

const config = useRuntimeConfig();
const route = useRoute(); // Access route parameters
const router = useRouter(); // For redirection

// State variables
const tokenWeb = localStorage.getItem('token');
const token = ref<string | null>(null);
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const message = ref<string | null>(null);

// On component mount, extract the token from the URL
onMounted(() => {
  token.value = route.query.token as string | null;
  if (!token.value) {
    error.value = 'El enlace de restablecimiento de contraseña es inválido o ha caducado.';
  }
});

// --- Function to reset password ---
const resetPassword = async () => {
  loading.value = true;
  error.value = null;
  message.value = null;

  if (!token.value) {
    error.value = 'No se encontró el token de restablecimiento. Por favor, solicita un nuevo enlace.';
    loading.value = false;
    return;
  }

  if (!newPassword.value || !confirmPassword.value) {
    error.value = 'Por favor, ingresa y confirma tu nueva contraseña.';
    loading.value = false;
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden.';
    loading.value = false;
    return;
  }

  // Basic password strength check (optional, but recommended)
  if (newPassword.value.length < 8) { // Increased minimum length for better security
    error.value = 'La contraseña debe tener al menos 8 caracteres.';
    loading.value = false;
    return;
  }

  try {
    const changePasswordUrl = `${config.public.backend}/api/auth/change-password`;

    const response = await fetch(changePasswordUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenWeb}`, // Include token in the header
      },
      body: JSON.stringify({
        token: token.value,
        newPassword: newPassword.value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al restablecer la contraseña. El enlace podría ser inválido o haber caducado.');
    }

    message.value = '¡Contraseña restablecida exitosamente! Serás redirigido al inicio de sesión.';
    newPassword.value = ''; // Clear fields
    confirmPassword.value = '';

    // Redirect to login page after successful password reset
    setTimeout(() => {
      router.push('/login');
    }, 3000); // Redirect after 3 seconds

  } catch (err: any) {
    error.value = err.message || 'Ocurrió un error inesperado al restablecer la contraseña. Intenta de nuevo.';
    console.error('Reset password error:', err);
  } finally {
    loading.value = false;
  }
};
</script>