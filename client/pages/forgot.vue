<template>
  <title>Mediart - Recuperar Contraseña</title>
  <NuxtLayout>
    <NuxtPage />
    <main class="w-screen h-dvh flex justify-center items-center">
      <div
        class="md:w-1/3 max-md:w-5/6 h-fit gap-6 flex flex-col relative items-center justify-center glassEffect p-8 py-16 rounded-lg"
      >
        <h2 class="text-3xl">Recuperar Contraseña</h2>

        <form
          v-if="currentStep === 1"
          class="flex flex-col w-2/3 h-3/4 max-md:w-5/6 justify-center items-center"
          @submit.prevent="requestPasswordReset"
        >
          <p class="text-center mb-4">Ingresa tu correo electrónico para enviarte un código de verificación.</p>
          <label class="w-full mb-0" for="forgotEmail">Correo Electrónico</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon name="material-symbols:mail-outline" size='1.2rem' class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 -z-1"/>
            <input
              type="text"
              placeholder="tu@email.com"
              class="w-full pl-2 rounded border border-gray-300"
              id="forgotEmail"
              v-model="email"
              :disabled="loading"
            />
          </div>

          <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
          <p v-if="message" class="text-green-600 text-sm mt-2">{{ message }}</p>

          <button
            type="submit"
            class="w-full bg-white text-black p-3 rounded-md transition-all cursor-pointer"
            :class="{'hover:bg-slate-100': !loading, 'opacity-50 cursor-not-allowed': loading}"
            :disabled="loading"
          >
            <span v-if="!loading">Enviar Código</span>
            <span v-else>Enviando...</span>
          </button>
          <NuxtLink to="/login" class="hover:underline text-center m-3 text-sm">
            <p>Volver al inicio de sesión</p>
          </NuxtLink>
        </form>

        <form
          v-if="currentStep === 2"
          class="flex flex-col w-2/3 h-3/4 max-md:w-5/6 justify-center items-center"
          @submit.prevent="verifyCode"
        >
          <p class="text-center mb-4">Se ha enviado un código a **{{ email }}**. Ingrésalo a continuación.</p>
          <label class="w-full mb-0" for="verificationCode">Código de Verificación</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon name="material-symbols:vpn-key-outline" size='1.2rem' class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 -z-1"/>
            <input
              type="text"
              placeholder="••••••"
              class="w-full pl-2 rounded border border-gray-300"
              id="verificationCode"
              v-model="code"
              :disabled="loading"
            />
          </div>

          <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
          <p v-if="message" class="text-green-600 text-sm mt-2">{{ message }}</p>

          <button
            type="submit"
            class="w-full bg-white text-black p-3 rounded-md transition-all cursor-pointer"
            :class="{'hover:bg-slate-100': !loading, 'opacity-50 cursor-not-allowed': loading}"
            :disabled="loading"
          >
            <span v-if="!loading">Verificar Código</span>
            <span v-else>Verificando...</span>
          </button>
          <button
            type="button"
            @click="requestPasswordReset(true)"
            class="text-sm mt-3 hover:underline"
            :disabled="loading"
          >
            ¿No recibiste el código? Reenviar
          </button>
        </form>

        <form
          v-if="currentStep === 3"
          class="flex flex-col w-2/3 h-3/4 max-md:w-5/6 justify-center items-center"
          @submit.prevent="resetPassword"
        >
          <p class="text-center mb-4">Ingresa tu nueva contraseña.</p>
          <label class="w-full mb-0" for="newPassword">Nueva Contraseña</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon name="material-symbols:lock-outline" size='1.2rem' class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 -z-1"/>
            <input
              type="password"
              placeholder="••••••••"
              class="w-full pl-2 rounded border border-gray-300"
              id="newPassword"
              v-model="newPassword"
              :disabled="loading"
            />
          </div>

          <label class="w-full mb-0" for="confirmPassword">Confirmar Contraseña</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon name="material-symbols:lock-outline" size='1.2rem' class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 -z-1"/>
            <input
              type="password"
              placeholder="••••••••"
              class="w-full pl-2 rounded border border-gray-300"
              id="confirmPassword"
              v-model="confirmPassword"
              :disabled="loading"
            />
          </div>

          <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
          <p v-if="message" class="text-green-600 text-sm mt-2">{{ message }}</p>

          <button
            type="submit"
            class="w-full bg-white text-black p-3 rounded-md transition-all cursor-pointer"
            :class="{'hover:bg-slate-100': !loading, 'opacity-50 cursor-not-allowed': loading}"
            :disabled="loading"
          >
            <span v-if="!loading">Restablecer Contraseña</span>
            <span v-else>Restableciendo...</span>
          </button>
        </form>

        <NuxtLink to="/">
          <img
            class="h-8 cursor-pointer transition-all duration-500 hover:scale-105"
            src="/mediart/mediartCompleto.webp"
            alt="Mediart Logo"
          />
        </NuxtLink>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: "default",
});

const config = useRuntimeConfig();
const router = useRouter();

// State variables
const currentStep = ref(1); // 1: Enter Email, 2: Enter Code, 3: Set New Password
const email = ref('');
const code = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const message = ref<string | null>(null); // For success messages

// --- Step 1: Request Password Reset (Send Code) ---
const requestPasswordReset = async (resend: boolean = false) => {
  loading.value = true;
  error.value = null;
  message.value = null;

  if (!email.value) {
    error.value = 'Por favor, ingresa tu correo electrónico.';
    loading.value = false;
    return;
  }

  try {
    const requestResetUrl = `${config.public.backend}/api/auth/forgot`; // Adjust your backend endpoint

    const response = await fetch(requestResetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al solicitar el código de restablecimiento.');
    }

    // Assuming success, move to the next step
    currentStep.value = 2;
    message.value = resend ? 'Se ha reenviado el código a tu correo electrónico.' : 'Se ha enviado un código a tu correo electrónico. Revisa tu bandeja de entrada.';

  } catch (err: any) {
    error.value = err.message || 'Ocurrió un error inesperado al solicitar el código. Intenta de nuevo.';
    console.error('Request password reset error:', err);
  } finally {
    loading.value = false;
  }
};

// --- Step 2: Verify Code ---
const verifyCode = async () => {
  loading.value = true;
  error.value = null;
  message.value = null;

  if (!email.value || !code.value) {
    error.value = 'Por favor, ingresa el correo electrónico y el código.';
    loading.value = false;
    return;
  }

  try {
    const verifyCodeUrl = `${config.public.backend}/api/auth/verify-reset-code`; // Adjust your backend endpoint

    const response = await fetch(verifyCodeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value, code: code.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al verificar el código.');
    }

    // If code is valid, move to the next step to set new password
    currentStep.value = 3;
    message.value = 'Código verificado correctamente. Ahora puedes establecer tu nueva contraseña.';

  } catch (err: any) {
    error.value = err.message || 'Ocurrió un error inesperado al verificar el código. Asegúrate de que el código sea correcto.';
    console.error('Verify code error:', err);
  } finally {
    loading.value = false;
  }
};

// --- Step 3: Reset Password ---
const resetPassword = async () => {
  loading.value = true;
  error.value = null;
  message.value = null;

  if (!email.value || !code.value || !newPassword.value || !confirmPassword.value) {
    error.value = 'Por favor, completa todos los campos.';
    loading.value = false;
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden.';
    loading.value = false;
    return;
  }

  // Basic password strength check (optional, but recommended)
  if (newPassword.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.';
    loading.value = false;
    return;
  }

  try {
    const resetPasswordUrl = `${config.public.backend}/api/auth/reset-password`; // Adjust your backend endpoint

    const response = await fetch(resetPasswordUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        code: code.value,
        newPassword: newPassword.value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al restablecer la contraseña.');
    }

    message.value = '¡Contraseña restablecida exitosamente! Serás redirigido al inicio de sesión.';
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
