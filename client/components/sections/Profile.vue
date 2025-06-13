<template>
  <section
    class="w-1/3 glassEffect h-full rounded-lg max-md:h-fit p-4 max-md:w-full flex justify-center items-center flex-col gap-4"
  >
    <img
      v-if="isLoading"
      class="size-36 animate-pulse"
      src="~/assets/resources/studio/previewProfile.webp"
      alt="Cargando perfil..."
    />
    <img
      v-else
      :src="userProfile.profilePictureUrl"
      alt="Profile"
      class="size-36 rounded-full object-cover"
    />

    <h1 class="text-2xl font-bold">{{ userProfile.username }}</h1>
    <p class="text-center">{{ userProfile.bio }}</p>
    <p class="text-center text-sm text-gray-500">{{ userProfile.email }}</p>

    <NuxtLink to="/studio/profile/create" class="btn btn-primary"
      >Crear Perfil</NuxtLink
    >
    <NuxtLink to="/studio/profile/edit" class="btn btn-secondary"
      >Editar Perfil</NuxtLink
    >
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface UserProfile {
  username: string;
  email: string;
  profilePictureUrl: string;
  bio: string;
}

const userProfile = ref<UserProfile>({
  username: "Cargando...",
  email: "cargando@ejemplo.com",
  profilePictureUrl: "~/assets/resources/studio/previewProfile.webp",
  bio: "Cargando biografía del estudio...",
});

const isLoading = ref(true);

const config = useRuntimeConfig();

// La idea es que agarre la url de arriba el nombre y busque el usuario y todo como si fuera linkedin
const defaultProfile: UserProfile = {
  username: "Usuario Anónimo",
  email: "anonimo@example.com",
  profilePictureUrl: "https://via.placeholder.com/150?text=No+Image",
  bio: "Este es un perfil de estudio predeterminado. Crea o edita tu perfil para mostrar tu trabajo.",
};

onMounted(async () => {
  try {
    const response = await useFetch(`${config.public.backend}/api/auth/login`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.data.value) {
      throw new Error("No se pudo obtener el perfil del usuario.");
    }

    if (response.data.value && (response.data.value as any).token) {
      localStorage.setItem(
        "token",
        JSON.stringify((response.data.value as any).token)
      );
    }

    userProfile.value = response.data.value as UserProfile;
  } catch (error) {
    console.error("No se pudo cargar el perfil del usuario:", error);
    userProfile.value = defaultProfile;
  } finally {
    isLoading.value = false;
  }
});
</script>
