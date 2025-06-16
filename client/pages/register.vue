<template>
  <title>Mediart - Registro</title>
  <NuxtLayout>
    <NuxtPage />
    <main class="w-screen h-dvh flex justify-center items-center">
      <div
        class="md:w-1/3 max-md:w-5/6 h-fit gap-6 flex flex-col relative items-center justify-center glassEffect p-8 py-16 rounded-lg"
      >
        <h2 class="text-3xl text-center">Registro de Nueva Cuenta</h2>
        <form
          class="flex flex-col w-2/3 h-3/4 max-md:w-5/6 justify-center items-center"
          id="registerForm"
          @submit.prevent="handleRegister"
        >
          <label class="w-full mb-0" for="Email">Correo Electrónico</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon
              name="material-symbols:mail-outline"
              size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 -z-1"
            />
            <input
              type="email"
              placeholder="tu@email.com"
              class="w-full p-4 rounded border border-gray-300"
              id="Email"
              v-model="email"
              :disabled="loading"
              required
            />
          </div>

          <label class="w-full mb-0" for="Username">Nombre de Usuario</label>
          <div class="flex flex-row w-full relative h-12 mb-6">
            <Icon
              name="material-symbols:person-outline"
              size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 -z-1"
            />
            <input
              type="text"
              placeholder="tu_usuario"
              class="w-full p-4 rounded border border-gray-300"
              id="Username"
              v-model="username"
              :disabled="loading"
              required
            />
          </div>

          <label class="w-full mb-0" for="Password">Contraseña</label>
          <div class="flex flex-row w-full relative h-12">
            <Icon
              name="material-symbols:lock-outline"
              size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 -z-1"
            />
            <input
              type="password"
              placeholder="••••••••"
              class="w-full p-4 rounded border border-gray-300"
              id="Password"
              v-model="password"
              :disabled="loading"
              required
            />
          </div>

          <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>

          <NuxtLink
            to="/login"
            class="hover:underline text-center m-3 text-sm"
          >
            <p>¿Ya tienes una cuenta? Inicia Sesión</p>
          </NuxtLink>
          <button
            type="submit"
            class="w-full bg-white text-black p-3 rounded-md transition-all cursor-pointer"
            :class="{
              'hover:bg-slate-100': !loading,
              'opacity-50 cursor-not-allowed': loading,
            }"
            :disabled="loading"
          >
            <span v-if="!loading">Registrarse</span>
            <span v-else>Registrando...</span>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

definePageMeta({
  layout: "default",
});

const config = useRuntimeConfig();
const router = useRouter();

const email = ref("");
const username = ref(""); // New ref for username
const password = ref("");
const loading = ref(false);
const error = ref<string | null>(null);

const handleRegister = async () => {
  loading.value = true;
  error.value = null; // Clear previous errors

  try {
    // Assuming your backend register endpoint is /api/auth/register
    const registerUrl = `${config.public.backend}/api/users`;

    const response = await fetch(registerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Data sent in the request body
        email: email.value,
        username: username.value, // Include username in the body
        passwordHash: password.value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Use a more specific error message if available from the backend
      throw new Error(errorData.message || "Error al registrar la cuenta.");
    }

    const data = await response.json();

    // Optionally, if your register endpoint returns user and token, store them.
    // However, it's common for register to just confirm success,
    // and then the user would manually login, or be automatically logged in.
    // For this example, I'll keep the storage logic, assuming your backend sends them.
    if (data.user && data.token) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
    } else {
      router.push("/login");
    }
  } catch (err: any) {
    error.value =
      err.message ||
      "Ocurrió un error inesperado durante el registro. Intenta de nuevo.";
    Swal.fire({
      title: "Error!",
      heightAuto: false,
      text: "Do you want to continue",
      icon: "error",
      toast: true,
      position: "top-end",
      timerProgressBar: true,
    });
  } finally {
    loading.value = false;
  }
};
</script>
