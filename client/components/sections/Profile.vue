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
import { useRoute } from "vue-router"; // Import useRoute to get URL parameters

interface UserProfile {
  username: string;
  email: string;
  profilePictureUrl?: string; // Made optional as it might be null/undefined from backend
  bio: string;
}

const userProfile = ref<UserProfile>({
  username: "Cargando...",
  email: "cargando@ejemplo.com",
  profilePictureUrl: "/_nuxt/assets/resources/studio/previewProfile.webp", // Default local path
  bio: "Cargando biografía del estudio...",
});

const isLoading = ref(true);

const config = useRuntimeConfig();
const route = useRoute(); // Access the current route to get parameters

// La idea es que agarre la url de arriba el nombre y busque el usuario y todo como si fuera linkedin
const defaultProfile: UserProfile = {
  username: "Usuario Anónimo",
  email: "anonimo@example.com",
  profilePictureUrl: "/_nuxt/assets/resources/studio/previewProfile.webp",
  bio: "Este es un perfil de estudio predeterminado. Crea o edita tu perfil para mostrar tu trabajo.",
};

onMounted(async () => {
  // Get the username from the URL path.
  // Assuming your route is something like /studio/profile/[username]
  const usernameFromUrl = route.params.username as string;

  // Use the username from the URL if available, otherwise fallback to local storage or a default
  const targetUsername =
    usernameFromUrl ||
    JSON.parse(localStorage.getItem("user") || "{}").username ||
    "anonymous";

  if (!targetUsername || targetUsername === "anonymous") {
    // If no specific username is found, display the default profile immediately
    userProfile.value = defaultProfile;
    isLoading.value = false;
    console.warn(
      "No specific username found in URL or local storage. Displaying default profile."
    );
    return;
  }

  try {
    // Use useFetch for Nuxt 3, it's designed for data fetching
    const { data, error } = await useFetch<UserProfile>(
      `${config.public.backend}/api/users/by-username/${targetUsername}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (error.value) {
      // Handle fetch errors, e.g., network issues, 404, etc.
      console.error("Error al cargar el perfil del usuario:", error.value);
      throw new Error(
        error.value.message || "No se pudo obtener el perfil del usuario."
      );
    }

    if (data.value) {
      userProfile.value = {
        ...data.value,
        // Ensure a fallback for profilePictureUrl if backend doesn't provide it
        profilePictureUrl:
          data.value.profilePictureUrl ||
          "/_nuxt/assets/resources/studio/previewProfile.webp",
      };
    } else {
      // No data returned, even without an explicit error. This might mean user not found.
      throw new Error("No se encontró el perfil del usuario.");
    }

    userProfile.value = response.data.value as UserProfile;
  } catch (err) {
    console.error("No se pudo cargar el perfil del usuario:", err);
    userProfile.value = defaultProfile; // Fallback to default profile on error
  } finally {
    isLoading.value = false; // Always set loading to false after attempt
  }
});
</script>
