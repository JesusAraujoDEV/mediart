<template>
  <section
    class="w-1/3 glassEffect h-full rounded-lg max-md:h-fit p-4 max-md:w-full flex justify-center items-center flex-col gap-4"
  >
    <img
      v-if="isLoading"
      class="size-36 animate-pulse rounded-full object-cover"
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

    <!-- Contadores de amigos y seguidores clickeables -->
    <div class="flex gap-6 my-2">
      <button
        class="flex flex-col items-center focus:outline-none hover:text-purple-500 transition-colors"
        @click="goToFollowing"
        :disabled="isLoading"
        style="background: none; border: none; cursor: pointer;"
      >
        <span class="text-lg font-bold">{{ userProfile.followingUsers?.length || 0 }}</span>
        <span class="text-xs text-gray-400">Amigos</span>
      </button>
      <button
        class="flex flex-col items-center focus:outline-none hover:text-purple-500 transition-colors"
        @click="goToFollowers"
        :disabled="isLoading"
        style="background: none; border: none; cursor: pointer;"
      >
        <span class="text-lg font-bold">{{ userProfile.followersUsers?.length || 0 }}</span>
        <span class="text-xs text-gray-400">Seguidores</span>
      </button>
    </div>

    <div v-if="!isOwner">
      <button
        v-if="!isFriend"
        @click="addFriend"
        :disabled="isFriendActionLoading"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isFriendActionLoading ? 'Agregando...' : 'Agregar amigo' }}
      </button>
      <button
        v-else
        @click="removeFriend"
        :disabled="isFriendActionLoading"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isFriendActionLoading ? 'Eliminando...' : 'Eliminar de amigos' }}
      </button>
    </div>

    <NuxtLink v-else to="/profile/edit" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
      >Editar Perfil</NuxtLink
    >

    <p v-if="friendActionMessage" :class="{'text-green-400': !friendActionError, 'text-red-400': friendActionError}" class="mt-2 text-sm">
      {{ friendActionMessage }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFetch } from '#app';
import type { UserProfile as UserProfileType } from "~/types/User";

interface UserProfile extends UserProfileType {
  followersUsers?: any[];
  followingUsers?: any[];
}

// Interfaces for response from friend-related API calls
interface FriendActionResponse {
  message: string;
  success: boolean;
  isFriend?: boolean;
}

const userProfile = ref<UserProfile>({
  username: "Cargando...",
  email: "cargando@ejemplo.com",
  profilePictureUrl: "/resources/studio/previewProfile.webp",
  bio: "Cargando biografía del estudio...",
  id: -1, // Initialize with a default ID
  followersUsers: [],
  followingUsers: [],
});

const isLoading = ref(true);
const isOwner = ref(false);
const isFriend = ref(false);
const isFriendActionLoading = ref(false);
const friendActionMessage = ref<string | null>(null);
const friendActionError = ref(false);

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const defaultProfile: UserProfile = {
  id: -1, // Default ID for anonymous/not found
  username: "Usuario Anónimo",
  email: "anonimo@example.com",
  profilePictureUrl: "/resources/studio/previewProfile.webp",
  bio: "Este es un perfil predeterminado o no encontrado. Crea o edita tu perfil para mostrar tu trabajo.",
  followersUsers: [],
  followingUsers: [],
};

// Get current user's ID from localStorage (assuming it's stored after login)
const getCurrentUserId = (): number | null => {
  if (typeof localStorage === 'undefined') return null;
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.id || null;
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      return null;
    }
  }
  return null;
};

const currentUserId = ref<number | null>(getCurrentUserId());


// --- Friend-related functions ---

const checkFriendshipStatus = async () => {
  if (!currentUserId.value || userProfile.value.id === -1 || userProfile.value.id === undefined) {
    // Cannot check friendship if current user or target user ID is unknown
    return;
  }

  try {
    const { data, error } = await useFetch<boolean>(
      `${config.public.backend}/api/users/${currentUserId.value}/friends/${userProfile.value.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (error.value) {
      console.error("Error al verificar estado de amistad:", error.value);
      isFriend.value = false; // Assume not friends on error
      return;
    }

    // Backend should return true/false directly, or an object with a boolean. Adjust based on your actual backend response.
    // Assuming backend returns a boolean directly
    isFriend.value = data.value === true;

  } catch (err) {
    console.error("Excepción al verificar estado de amistad:", err);
    isFriend.value = false;
  }
};

const sendFriendAction = async (action: 'add' | 'remove') => {
  if (!userProfile.value.id || userProfile.value.id === -1 || userProfile.value.id === undefined) {
    friendActionError.value = true;
    friendActionMessage.value = "Error: ID de usuario no disponible.";
    return;
  }

  isFriendActionLoading.value = true;
  friendActionMessage.value = null;
  friendActionError.value = false;

  const endpoint = `${config.public.backend}/api/profile/follow/${userProfile.value.id}`;
  const method = action === 'add' ? 'POST' : 'DELETE';

  try {
    const { data, error } = await useFetch<FriendActionResponse>(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (error.value) {
      console.error(`Error al ${action === 'add' ? 'agregar' : 'eliminar'} amigo:`, error.value);
      friendActionError.value = true;
      friendActionMessage.value = error.value.data?.message || `Error al ${action === 'add' ? 'agregar' : 'eliminar'} amigo.`;
      isFriend.value = action === 'remove'; // Revert state on error
      return;
    }

    if (data.value && data.value.success) {
      isFriend.value = action === 'add'; // Update friend status based on action
      friendActionMessage.value = data.value.message || `Amigo ${action === 'add' ? 'agregado' : 'eliminado'} correctamente.`;
    } else {
      friendActionError.value = true;
      friendActionMessage.value = data.value?.message || `Operación fallida al ${action === 'add' ? 'agregar' : 'eliminar'} amigo.`;
    }

  } catch (err) {
    console.error(`Excepción al ${action === 'add' ? 'agregar' : 'eliminar'} amigo:`, err);
    friendActionError.value = true;
    friendActionMessage.value = `Error inesperado al ${action === 'add' ? 'agregar' : 'eliminar'} amigo.`;
    isFriend.value = action === 'remove'; // Revert state on error
  } finally {
    isFriendActionLoading.value = false;
  }
};

const addFriend = () => sendFriendAction('add');
const removeFriend = () => sendFriendAction('remove');


// --- Main Profile Load Logic ---

onMounted(async () => {
  const usernameFromUrl = route.params.username as string;

  const targetUsername = usernameFromUrl || JSON.parse(localStorage.getItem("user") || "{}").username;

  if (!targetUsername) {
    userProfile.value = defaultProfile;
    isLoading.value = false;
    console.warn("No se encontró un nombre de usuario en la URL o en el almacenamiento local. Mostrando perfil predeterminado.");
    return;
  }

  try {
    const { data, error } = await useFetch<UserProfile>(
      `${config.public.backend}/api/profile`,
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
      userProfile.value = defaultProfile;
      isLoading.value = false; // Ensure loading is false on error
      return;
    }

    if (data.value) {
      userProfile.value = {
        ...data.value,
        profilePictureUrl:
          data.value.profilePictureUrl || "/resources/studio/previewProfile.webp",
        bio: data.value.bio || "Este usuario no ha proporcionado una biografía.",
        followersUsers: data.value.followersUsers || [],
        followingUsers: data.value.followingUsers || [],
      };

      // Check if the current user is the owner of this profile
      isOwner.value = currentUserId.value === userProfile.value.id;

      // If not the owner, check friendship status
      if (!isOwner.value) {
        await checkFriendshipStatus();
      }

    } else {
      console.warn("La respuesta del servidor no contiene datos de perfil. Mostrando perfil predeterminado.");
      userProfile.value = defaultProfile;
    }

  } catch (err) {
    console.error("Excepción inesperada al cargar el perfil:", err);
    userProfile.value = defaultProfile;
  } finally {
    isLoading.value = false;
  }
});

function goToFollowing() {
  if (!userProfile.value.username) return;
  router.push(`/profile/${userProfile.value.username}/following`);
}
function goToFollowers() {
  if (!userProfile.value.username) return;
  router.push(`/profile/${userProfile.value.username}/followers`);
}

defineExpose({ goToFollowing, goToFollowers });
</script>

<style scoped>
/* Estilos para el efecto glass, etc., si no están en un archivo global */
.glassEffect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>