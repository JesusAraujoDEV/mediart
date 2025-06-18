<template>
  <section
    class="w-1/3 glassEffect h-full rounded-lg max-md:h-fit p-4 max-md:w-full flex justify-center items-center flex-col gap-4"
  >
    <img
      v-if="isLoading"
      class="size-36 animate-pulse"
      :src="
        userProfile.profilePictureUrl ||
        '/resources/studio/previewProfile.webp'
      "
      alt="Cargando perfil..."
    />
    <img
      v-else
      :src="userProfile.profilePictureUrl"
      alt="Profile"
      class="size-36 rounded-full object-cover"
    />

    <h1 class="text-2xl font-bold">{{ userProfile.username }}</h1>
    <p class="text-center w-2/3">{{ userProfile.bio }}</p>
    <p class="text-center text-sm text-gray-500">{{ userProfile.email }}</p>

    <NuxtLink to="/profile/edit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      >Editar Perfil</NuxtLink
    >
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useFetch } from '#app'; // Ensure useFetch is imported from '#app'

interface UserProfile {
  username: string;
  email: string;
  profilePictureUrl?: string;
  bio: string;
}

const userProfile = ref<UserProfile>({
  username: "Cargando...",
  email: "cargando@ejemplo.com",
  profilePictureUrl: "/resources/studio/previewProfile.webp",
  bio: "Cargando biografía del estudio...",
});

const isLoading = ref(true);

const config = useRuntimeConfig();
const route = useRoute();

const defaultProfile: UserProfile = {
  username: "Usuario Anónimo",
  email: "anonimo@example.com",
  profilePictureUrl: "/resources/studio/previewProfile.webp",
  bio: "Este es un perfil de estudio predeterminado. Crea o edita tu perfil para mostrar tu trabajo.",
};

onMounted(async () => {
  const usernameFromUrl = route.params.username as string;

  const targetUsername =
    usernameFromUrl ||
    JSON.parse(localStorage.getItem("user") || "{}").username; // Removed || "anonymous" here, handle anonymous explicitly

  if (!targetUsername) { // If no specific username is found, display the default profile immediately
    userProfile.value = defaultProfile;
    isLoading.value = false;
    console.warn(
      "No se encontró un nombre de usuario en la URL o en el almacenamiento local. Mostrando perfil predeterminado."
    );
    return; // Exit the function if no targetUsername
  }

  try {
    const { data, error } = await useFetch<UserProfile>(
      `${config.public.backend}/api/users/by-username/${targetUsername}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      }
    );

    if (error.value) {
      console.error("Error al cargar el perfil del usuario:", error.value);
      // Fallback to default profile on *any* error (e.g., 404, network)
      userProfile.value = defaultProfile;
      return; // Exit the function after handling error
    }

    if(data.value.bio === null) {
      // If bio is null, set it to a default message
      data.value.bio = "Este usuario no ha proporcionado una biografía.";
    }

    // Check if data.value is defined before accessing its properties
    if (!data.value) {
      console.warn("La respuesta del servidor no contiene datos de perfil. Mostrando perfil predeterminado.");
      userProfile.value = defaultProfile;
      return; // Exit the function if no data is returned
    }

    if (data.value) {
      // Correctly assign the fetched data
      userProfile.value = {
        ...data.value,
        profilePictureUrl:
          data.value.profilePictureUrl ||
          "/resources/studio/previewProfile.webp", // Fallback for profile picture
      };
    } else {
      // If data.value is null/undefined but no direct error, still fallback
      console.warn("La respuesta del servidor no contiene datos de perfil. Mostrando perfil predeterminado.");
      userProfile.value = defaultProfile;
    }

  } catch (err) {
    // This catch block will primarily handle errors from `useFetch` itself,
    // though `error.value` typically catches most HTTP errors.
    console.error("Excepción inesperada al cargar el perfil:", err);
    userProfile.value = defaultProfile;
  } finally {
    isLoading.value = false; // Always set loading to false after attempt
  }
});
</script>
