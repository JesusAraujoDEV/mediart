<template>
  <nav
    class="fixed top-0 left-0 right-0 z-40 glassEffect p-4 md:p-2 md:m-3 md:rounded-lg md:w-fit md:right-auto flex items-center justify-between md:justify-start gap-2 md:gap-4 transition-all duration-300 ease-in-out bg-black/10 md:bg-transparent">
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
          :src="(userProfile?.profilePictureUrl ? (userProfile?.profilePictureUrl.startsWith('http') ? userProfile?.profilePictureUrl : config.public.backend + userProfile?.profilePictureUrl) : '/avatar-default.svg')"
          @error="handleImageError" alt="Profile Preview" />
      </NuxtLink>
    </div>

    <!-- Acciones en móvil -->
    <div class="flex items-center gap-3 md:gap-4">
      <!-- Botón hamburguesa en móvil -->
      <button
        @click="toggleMenu"
        class="md:hidden flex items-center justify-center w-12 h-12 cursor-pointer rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-200 ease-in-out"
        aria-label="Abrir menú"
      >
        <Icon name="material-symbols:menu" size="2.5em" />
      </button>
      <!-- Elementos visibles en desktop -->
      <div v-show="!isRetracted" class="hidden md:flex items-center gap-3 md:gap-4">
        <NuxtLink
          class="flex items-center cursor-pointer rounded-full hover:bg-white/10 hover:scale-110 transition-all duration-200 ease-in-out"
          :to="`/studio/help`">
          <Icon name="material-symbols:help" size="2em" class="md:text-2xl" />
        </NuxtLink>
        <NuxtLink
          class="flex items-center cursor-pointer rounded-full hover:bg-white/10 hover:scale-110 transition-all duration-200 ease-in-out"
          :to="`/studio/search`">
          <Icon name="material-symbols:search" size="2em" class="md:text-2xl" />
        </NuxtLink>
        <NuxtLink
          class="px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs md:text-sm cursor-pointer flex items-center"
          :to="`/studio/create`"
          aria-label="Crear Playlist"
        >
          Crear Playlist
        </NuxtLink>
        <div @click="logout"
          class="flex items-center cursor-pointer rounded-full hover:bg-white/10 hover:scale-110 transition-all duration-200 ease-in-out">
          <Icon name="material-symbols:logout" size="2em" class="md:text-2xl" />
        </div>
      </div>
      <!-- Flecha para expandir/disminuir íconos -->
      <button
        @click="toggleRetract"
        class="hidden md:flex items-center cursor-pointer rounded-full hover:bg-white/10 hover:scale-110 transition-all duration-200 ease-in-out ml-2"
        aria-label="Expandir íconos"
      >
        <Icon name="material-symbols:expand-more" :size="isRetracted ? '2.5em' : '2em'" class="md:text-2xl transition-transform duration-200" :class="{ 'rotate-90': !isRetracted, '-rotate-90': isRetracted }" />
      </button>
    </div>

    <!-- Menú desplegable en móvil -->
    <div
      v-show="isMenuOpen"
      class="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-white via-gray-50 to-gray-100 backdrop-blur-lg shadow-2xl rounded-b-2xl border-t border-gray-200 transition-all duration-300 ease-in-out transform"
      :class="{ 'opacity-100 translate-y-0 scale-100': isMenuOpen, 'opacity-0 -translate-y-4 scale-95': !isMenuOpen }"
    >
      <div class="flex flex-col p-6 space-y-3">
        <NuxtLink
          @click="closeMenu"
          class="flex items-center gap-4 p-4 rounded-xl hover:bg-purple-50 hover:shadow-md transition-all duration-200 group"
          :to="`/studio/help`">
          <Icon name="material-symbols:help" size="2em" class="text-gray-600 group-hover:text-purple-600" />
          <span class="font-medium text-gray-800 group-hover:text-purple-800">Ayuda</span>
        </NuxtLink>
        <NuxtLink
          @click="closeMenu"
          class="flex items-center gap-4 p-4 rounded-xl hover:bg-purple-50 hover:shadow-md transition-all duration-200 group"
          :to="`/studio/search`">
          <Icon name="material-symbols:search" size="2em" class="text-gray-600 group-hover:text-purple-600" />
          <span class="font-medium text-gray-800 group-hover:text-purple-800">Buscar</span>
        </NuxtLink>
        <NuxtLink
          @click="closeMenu"
          class="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
          :to="`/studio/create`">
          <Icon name="material-symbols:add" size="2em" class="group-hover:scale-110 transition-transform" />
          <span class="font-semibold">Crear Playlist</span>
        </NuxtLink>
        <div
          @click="logout"
          class="flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <Icon name="material-symbols:logout" size="2em" class="text-gray-600 group-hover:text-red-600" />
          <span class="font-medium text-gray-800 group-hover:text-red-800">Cerrar Sesión</span>
        </div>
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
const isMenuOpen = ref(false);
const isRetracted = ref(true);

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

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const toggleRetract = () => {
  isRetracted.value = !isRetracted.value;
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
