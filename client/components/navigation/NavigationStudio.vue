<template>
  <nav
    class="fixed top-0 left-0 right-0 z-40 glassEffect p-3 md:p-2 md:m-3 md:rounded-lg md:w-fit md:right-auto flex items-center justify-between md:justify-start gap-2 md:gap-4">
    <!-- Logo y perfil en móvil -->
    <div class="flex items-center gap-3 md:gap-4">
      <NuxtLink class="flex items-center justify-center hover:scale-110 transition-transform duration-200 ease-in-out"
        to="/studio">
        <img id="logoNavbar" class="w-8 h-8 md:w-10 md:h-10" src="/mediart/mediartLogo.webp" alt="Logo" />
      </NuxtLink>
      <NuxtLink class="flex items-center justify-center hover:scale-110 transition-transform duration-200 ease-in-out"
        :to="`/profile/${actualUser ? actualUser : 'anonymous'}`">
        <img v-if="isLoading" class="w-8 h-8 md:w-10 md:h-10 rounded-full animate-pulse object-cover"
          src="/resources/studio/previewProfile.webp" alt="Cargando perfil..." />
        <img v-else class="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
          :src="(userProfile.profilePictureUrl ? (userProfile.profilePictureUrl.startsWith('http') ? userProfile.profilePictureUrl : config.public.backend + userProfile.profilePictureUrl) : '/avatar-default.svg')"
          @error="handleImageError" alt="Profile Preview" />
      </NuxtLink>
    </div>

    <!-- Acciones en móvil -->
    <div class="flex items-center gap-3 md:gap-4">
      <NuxtLink
        class="flex items-center cursor-pointer p-2 rounded-full hover:bg-white/10 hover:scale-110 transition-all duration-200 ease-in-out"
        :to="`/studio/help`">
        <Icon name="material-symbols:help" size="1.5em" class="md:text-2xl" />
      </NuxtLink>
      <NuxtLink
        class="flex items-center cursor-pointer p-2 rounded-full hover:bg-white/10 hover:scale-110 transition-all duration-200 ease-in-out"
        :to="`/studio/search`">
        <Icon name="material-symbols:search" size="1.5em" class="md:text-2xl" />
      </NuxtLink>
      <div @click="logout"
        class="flex items-center cursor-pointer p-2 rounded-full hover:bg-white/10 hover:scale-110 transition-all duration-200 ease-in-out">
        <Icon name="material-symbols:logout" size="1.5em" class="md:text-2xl" />
      </div>
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
  profilePictureUrl: "/avatar-default.svg",
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
        profilePictureUrl: data.value.profilePictureUrl || "/avatar-default.svg",
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
  img.src = '/avatar-default.svg';
}

onMounted(() => {
  loadUserProfile();
});
</script>

<style scoped>
#logoNavbar {
  filter: brightness(0) invert(1);
}

/* Mejorar la accesibilidad táctil en móvil */
@media (max-width: 768px) {

  nav a,
  nav div {
    min-width: 44px;
    min-height: 44px;
  }
}
</style>