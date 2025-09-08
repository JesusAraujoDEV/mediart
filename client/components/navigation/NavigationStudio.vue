<template>
  <nav
    data-tutorial="navbar"
    class="fixed top-0 left-0 right-0 z-40 flex items-center md:m-3 justify-between p-4 transition-all duration-300 ease-in-out md:flex-col md:justify-start md:p-3 glassEffect bg-black/10"
    :class="{
      'md:w-20 md:right-6 md:top-1/2 md:transform md:-translate-y-1/2 md:rounded-xl md:shadow-lg':
        isCollapsed,
      'md:w-48 md:right-6 md:top-1/2 md:transform md:-translate-y-1/2 md:rounded-2xl md:shadow-lg':
        !isCollapsed,
    }"
  >
    <div
      class="flex items-center justify-start w-full md:flex-col md:flex-grow"
    >
      <div class="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
        <NuxtLink
          class="flex items-center md:flex md:items-center md:justify-start md:w-full hover:scale-110 transition-transform duration-200 ease-in-out"
          to="/studio"
        >
          <img
            id="logoNavbar"
            class="w-8 h-8 md:w-9 md:h-9"
            src="/mediart/mediartLogo.webp"
            alt="Logo"
          />
          <span v-show="!isCollapsed" class="nav-text text-sm font-semibold md:ml-2">Inicio</span>
        </NuxtLink>

        <NuxtLink
          class="items-center hidden hover:scale-110 transition-transform duration-200 ease-in-out md:flex md:items-center md:justify-start md:w-full"
          :to="`/profile/${actualUser ? actualUser : 'anonymous'}`"
        >
          <img
            v-if="isLoading"
            class="object-cover w-8 h-8 rounded-full md:w-9 md:h-9 animate-pulse"
            src="/resources/studio/previewProfile.webp"
            alt="Cargando perfil..."
          />
          <img
            v-else
            class="object-cover w-8 h-8 rounded-full md:w-9 md:h-9"
            :src="
              userProfile?.profilePictureUrl
                ? userProfile?.profilePictureUrl.startsWith('http')
                  ? userProfile?.profilePictureUrl
                  : config.public.backend + userProfile?.profilePictureUrl
                : '/avatar-default.svg'
            "
            @error="handleImageError"
            alt="Profile Preview"
          />
          <span v-show="!isCollapsed" class="nav-text text-sm md:ml-2">Perfil</span>
        </NuxtLink>

        <button
          @click="toggleMenu"
          class="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer md:hidden hover:bg-white/20 hover:scale-110 transition-all duration-200 ease-in-out"
          aria-label="Abrir menú"
        >
          <Icon name="material-symbols:menu" size="2em" />
          
        </button>
      </div>

      <div class="hidden md:flex flex-col items-start w-full gap-3 mt-8">
        <NuxtLink
          to="/studio/create"
          class="nav-link nav-link-create"
          aria-label="Crear Playlist"
        >
          <Icon name="material-symbols:add-circle-outline" size="1.5em" />
          <span v-show="!isCollapsed" class="nav-text text-sm font-semibold"
            >Crear Playlist</span
          >
        </NuxtLink>
        <NuxtLink
          to="/studio/search"
          class="nav-link"
          title="Buscar"
          aria-label="Buscar"
        >
          <Icon name="material-symbols:search" size="1.5em" />
          <span v-show="!isCollapsed" class="nav-text text-sm">Buscar</span>
        </NuxtLink>
        <NuxtLink
          to="/studio/help"
          class="nav-link"
          title="Ayuda"
          aria-label="Ayuda"
        >
          <Icon name="material-symbols:help" size="1.5em" />
          <span v-show="!isCollapsed" class="nav-text text-sm">Ayuda</span>
        </NuxtLink>
      </div>

      <div class="hidden md:flex flex-col items-start w-full gap-3 mt-auto">
        <div
          @click="logout"
          class="nav-link mt-2"
          title="Cerrar Sesión"
          aria-label="Cerrar Sesión"
        >
          <Icon name="material-symbols:logout" size="1.5em" />
          <span v-show="!isCollapsed" class="nav-text text-sm"
            >Cerrar Sesión</span
          >
        </div>
        <button
          @click="toggleCollapse"
          class="nav-link"
          aria-label="Expandir o colapsar menú"
        >
          <Icon
            name="material-symbols:keyboard-arrow-left"
            size="2em"
            class="transition-transform duration-300"
            :class="{ 'rotate-180': isCollapsed }"
          />
          <span v-show="!isCollapsed" class="nav-text text-sm">Colapsar</span>
        </button>
      </div>
    </div>

    <div
      v-show="isMenuOpen"
      data-tutorial="navbar-menu"
      class="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-white via-gray-50 to-gray-100 backdrop-blur-lg shadow-2xl rounded-b-2xl border-t border-gray-200 transition-all duration-300 ease-in-out transform"
      :class="{
        'opacity-100 translate-y-0 scale-100': isMenuOpen,
        'opacity-0 -translate-y-4 scale-95': !isMenuOpen,
      }"
    >
      <div class="flex flex-col p-6 space-y-3">
        <NuxtLink
          @click="closeMenu"
          class="flex items-center gap-4 p-4 rounded-xl hover:bg-purple-50 hover:shadow-md transition-all duration-200 group"
          :to="`/profile/${actualUser ? actualUser : 'anonymous'}`"
        >
          <img
            v-if="isLoading"
            class="w-10 h-10 rounded-full animate-pulse object-cover"
            src="/resources/studio/previewProfile.webp"
            alt="Cargando perfil..."
          />
          <img
            v-else
            class="w-10 h-10 rounded-full object-cover"
            :src="
              userProfile?.profilePictureUrl
                ? userProfile?.profilePictureUrl.startsWith('http')
                  ? userProfile?.profilePictureUrl
                  : config.public.backend + userProfile?.profilePictureUrl
                : '/avatar-default.svg'
            "
            @error="handleImageError"
            alt="Profile Preview"
          />
          <span class="font-medium text-gray-800 group-hover:text-purple-800"
            >Ver Perfil</span
          >
        </NuxtLink>
        <hr />
        <NuxtLink
          @click="closeMenu"
          class="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
          :to="`/studio/create`"
        >
          <Icon
            name="material-symbols:add"
            size="2em"
            class="transition-transform group-hover:scale-110"
          />
          <span class="font-semibold">Crear Playlist</span>
        </NuxtLink>
        <NuxtLink
          @click="closeMenu"
          class="flex items-center gap-4 p-4 rounded-xl hover:bg-purple-50 hover:shadow-md transition-all duration-200 group"
          :to="`/studio/search`"
        >
          <Icon
            name="material-symbols:search"
            size="2em"
            class="text-gray-600 group-hover:text-purple-600"
          />
          <span class="font-medium text-gray-800 group-hover:text-purple-800"
            >Buscar</span
          >
        </NuxtLink>

        <NuxtLink
          @click="closeMenu"
          class="flex items-center gap-4 p-4 rounded-xl hover:bg-purple-50 hover:shadow-md transition-all duration-200 group"
          :to="`/studio/help`"
        >
          <Icon
            name="material-symbols:help"
            size="2em"
            class="text-gray-600 group-hover:text-purple-600"
          />
          <span class="font-medium text-gray-800 group-hover:text-purple-800"
            >Ayuda</span
          >
        </NuxtLink>
        <div
          @click="logout"
          class="flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 hover:shadow-md transition-all duration-200 cursor-pointer group"
        >
          <Icon
            name="material-symbols:logout"
            size="2em"
            class="text-gray-600 group-hover:text-red-600"
          />
          <span class="font-medium text-gray-800 group-hover:text-red-800"
            >Cerrar Sesión</span
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useFetch } from "#app";
import type { UserProfile } from "~/types/User";

const userString =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;
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
const isCollapsed = ref(true);

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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        profilePictureUrl:
          data.value.profilePictureUrl || "/avatar-default.svg",
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
  router.push("/");
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = "/avatar-default.svg";
}

onMounted(() => {
  if (actualUser) {
    loadUserProfile();
  } else {
    isLoading.value = false;
  }
});
</script>

<style scoped>
#logoNavbar {
  filter: brightness(0) invert(1);
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* <<< CAMBIO APLICADO AQUÍ */
  width: 100%;
  padding: 0.6rem 0.35rem; /* más padding vertical para separar botones */
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-link-create {
  background-color: #7c3aed;
  color: #ffffff;
}
.nav-link-create:hover {
  background-color: #6d28d9;
}

.nav-text {
  margin-left: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.3s ease-in-out, max-width 0.3s ease-in-out;
}

.nav-link > svg,
.nav-link > .icon,
.nav-link > i {
  display: block; /* asegurar que el icono ocupe su propio bloque */
  margin: 0 auto; /* centrar horizontalmente dentro del botón */
}

/* Cuando el navbar está colapsado, forzar iconos y contenedor a centro */
nav.md\:w-20 .nav-link {
  padding-left: 0.6rem;
  padding-right: 0.6rem;
  justify-content: center; /* centrar contenido */
}

nav.md\:w-20 .nav-text {
  opacity: 0;
  max-width: 0;
}
nav.md\:w-48 .nav-text {
  opacity: 1;
  max-width: 100px;
}

@media (max-width: 768px) {
  nav a,
  nav div[role="button"],
  nav button {
    min-width: 44px;
    min-height: 44px;
  }
}
</style>
