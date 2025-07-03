<template>
  <nav
    class="absolute top-0 left-0 w-fit z-40 glassEffect p-2 m-3 rounded-lg flex items-center gap-4"
  >
    <NuxtLink class="flex items-center justify-center" to="/studio">
      <img
        id="logoNavbar"
        class="icon"
        src="/mediart/mediartLogo.webp"
        alt="Logo"
      />
    </NuxtLink>
    <NuxtLink class="flex items-center justify-center" :to="`/profile/${actualUser ? actualUser : 'anonymous'}`">
      <img
        v-if="isLoading"
        class="icon rounded-full animate-pulse"
        src="/resources/studio/previewProfile.webp"
        alt="Cargando perfil..."
      />
      <img
        v-else
        class="icon rounded-full object-cover"
        :src="(userProfile.profilePictureUrl ? (userProfile.profilePictureUrl.startsWith('http') ? userProfile.profilePictureUrl : config.public.backend + userProfile.profilePictureUrl) : '/resources/studio/previewProfile.webp')"
        @error="handleImageError"
        alt="Profile Preview"
      />
    </NuxtLink>
    <NuxtLink class="flex items-center cursor-pointer" :to="`/studio/help`">
      <Icon name="material-symbols:help" size="2em" />
    </NuxtLink>
    <NuxtLink class="flex items-center cursor-pointer" :to="`/studio/search`">
      <Icon name="material-symbols:search" size="2em" />
    </NuxtLink>
    <div @click="logout" class="flex items-center cursor-pointer">
      <Icon name="material-symbols:logout" size="2em" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFetch } from '#app';
import type { UserProfile } from '~/types/User';

const userString = localStorage.getItem("user");
const actualUser = userString ? JSON.parse(userString).username : null;

const router = useRouter();
const config = useRuntimeConfig();

const userProfile = ref<UserProfile>({
  username: "",
  email: "",
  profilePictureUrl: "/resources/studio/previewProfile.webp",
  bio: "",
  id: -1,
});

const isLoading = ref(true);

const loadUserProfile = async () => {
  if (!actualUser) {
    isLoading.value = false;
    return;
  }

  try {
    const { data, error } = await useFetch<UserProfile>(
      `${config.public.backend}/api/users/by-username/${actualUser}`,
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
      return;
    }

    if (data.value) {
      userProfile.value = {
        ...data.value,
        profilePictureUrl: data.value.profilePictureUrl || "/resources/studio/previewProfile.webp",
      };
    }
  } catch (err) {
    console.error("Excepción inesperada al cargar el perfil:", err);
  } finally {
    isLoading.value = false;
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  console.log("Token and user removed from localStorage.");

  router.push('/');
  console.log("Redirecting to homepage.");
};

// Función para manejar el error de carga de imagen
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = '/resources/studio/previewProfile.webp';
}

onMounted(() => {
  loadUserProfile();
});
</script>

<style scoped>
#logoNavbar {
  filter: brightness(0) invert(1);
}
</style>