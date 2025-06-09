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

// La idea es que agarre la url de arriba el nombre y busque el usuario y todo como si fuera linkedin
const defaultProfile: UserProfile = {
  username: "Usuario Anónimo",
  email: "anonimo@example.com",
  profilePictureUrl: "https://via.placeholder.com/150?text=No+Image",
  bio: "Este es un perfil de estudio predeterminado. Crea o edita tu perfil para mostrar tu trabajo.",
};

onMounted(async () => {
  try {
    // const response = await useFetch('/api/user/profile');
    // userProfile.value = response.data.value;

    const response = await new Promise<UserProfile>((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.3; // Simula un 70% de éxito
        if (success) {
          resolve({
            username: "Mediart Studio",
            email: "contacto@mediart.com",
            profilePictureUrl:
              "https://images.unsplash.com/photo-1506198901356-9d32785d0d7e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Ejemplo de URL de imagen
            bio: "Somos un estudio creativo dedicado a la producción de arte digital y experiencias interactivas. Nos encanta innovar y conectar con otros artistas.",
          });
        } else {
          reject(new Error("Error al cargar el perfil del usuario."));
        }
      }, 1500);
    });

    userProfile.value = response;
  } catch (error) {
    console.error("No se pudo cargar el perfil del usuario:", error);
    userProfile.value = defaultProfile;
  } finally {
    isLoading.value = false;
  }
});
</script>
