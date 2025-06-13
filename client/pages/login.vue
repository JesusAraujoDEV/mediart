<template>
  <title>Mediart - Login</title>
  <NuxtLayout>
    <NuxtPage />
    <main class="w-screen h-dvh flex justify-center items-center">
      <div
        class="md:w-1/3 max-md:w-5/6 h-fit gap-6 flex flex-col relative items-center justify-center glassEffect p-8 py-16  rounded-lg"
      >
        <h2 class="text-3xl">Inicio de Sesión</h2>
        <form
          class="flex flex-col w-2/3 h-3/4 max-md:w-5/6 justify-center items-center"
          id="loginForm"
          @submit.prevent="handleLogin"
        >
          <label class="w-full mb-0" for="Email">Correo Electrónico</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon name="material-symbols:mail-outline" size='1.2rem' class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 -z-1"/>
            <input
              type="text"
              placeholder="tu@email.com o usuario"
              class="w-full pl-2 rounded border border-gray-300"
              id="Email"
              v-model="email"
              :disabled="loading"
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
              v-model="password"
              :disabled="loading"
            />
          </div>

          <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>

          <NuxtLink to="/register" class="hover:underline text-center m-3 text-sm">
            <p>¿Aún no tienes una cuenta? Regístrate</p>
          </NuxtLink>
          <button
            type="submit"
            class="w-full bg-white text-black p-3 rounded-md transition-all cursor-pointer"
            :class="{'hover:bg-slate-100': !loading, 'opacity-50 cursor-not-allowed': loading}"
            :disabled="loading"
          >
            <span v-if="!loading">Iniciar Sesión</span>
            <span v-else>Cargando...</span>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: "default",
});

const config = useRuntimeConfig();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

const handleLogin = async () => {
  loading.value = true;
  error.value = null; 

  try {
    const loginUrl = `${config.public.backend}/api/auth/login`;

    const response = await fetch(loginUrl, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: email.value,
        passwordHash: password.value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al iniciar sesión.');
    }

    const data = await response.json();

    if (data.user && data.token) {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      router.push('/studio'); 
    } else {
      throw new Error('Respuesta del servidor inválida: Faltan user o token.');
    }

  } catch (err: any) {
    error.value = err.message || 'Ocurrió un error inesperado. Intenta de nuevo.';
    console.error('Login error:', err);
  } finally {
    loading.value = false;
  }
};
</script>
