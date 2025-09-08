<template>
  <title>MediartStudio - Editar Perfil</title>
  <main class="w-screen h-[120vh] flex justify-center items-center">
    <NavigationStudio />
    <section
      class="md:w-2/3 lg:w-1/2 xl:w-2/5 max-md:w-5/6 h-fit gap-6 flex flex-col relative items-center justify-center glassEffect p-8 py-16 rounded-lg text-white">
      <h2 class="text-3xl font-bold mb-4">Editar Perfil</h2>

      <div class="flex flex-col items-center mb-6">
        <div class="relative mb-4 group">
          <img :src="getProfilePictureUrl()" alt="Profile" @error="handleImageError"
            class="size-36 rounded-full object-cover border-2 border-white/50 shadow-md" />
          <input type="file" @change="handleImageUpload" ref="fileInput" accept="image/*" class="hidden" />
          <button @click="fileInput?.click()"
            class="absolute cursor-pointer bottom-0 right-0 bg-white p-2 rounded-full text-black hover:bg-gray-200 transition-colors shadow-lg"
            title="Cambiar imagen de perfil">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
              <path d="M12 9a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7" />
              <path fill-rule="evenodd"
                d="M1.5 6a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H4.5a3 3 0 0 1-3-3V6Zm12.912 1.613a4.5 4.5 0 0 0-8.736 0L4.5 18h15l-1.588-10.387ZM12 10.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"
                clip-rule="evenodd" />
            </svg>
          </button>
          <button
            v-if="editableUserProfile.profilePictureUrl && editableUserProfile.profilePictureUrl !== '' && getProfilePictureUrl() !== '/resources/studio/previewProfile.webp'"
            @click="removeProfilePicture"
            class="absolute top-0 right-0 bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            title="Eliminar foto de perfil" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
              class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <h3 class="text-2xl font-semibold">{{ editableUserProfile.username }}</h3>
      </div>

      <form @submit.prevent="updateProfile"
        class="flex flex-col md:flex-row md:flex-wrap w-full justify-center items-center gap-6">
        <div class="w-full md:w-[calc(50%-12px)]">
          <label for="email" class="block text-sm mb-1">Correo Electrónico</label>
          <div class="flex flex-row w-full relative h-12">
            <Icon name="material-symbols:mail-outline" size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 text-white/70" />
            <input type="email" id="email" v-model="editableUserProfile.email"
              class="w-full pl-2 rounded bg-white/10 text-white cursor-not-allowed border border-white/20 focus:outline-none"
              disabled title="El correo electrónico no se puede editar" />
          </div>
        </div>

        <div class="w-full md:w-[calc(50%-12px)]">
          <label for="username" class="block text-sm mb-1">Nombre de Usuario</label>
          <div class="flex flex-row w-full relative h-12">
            <Icon name="material-symbols:person-outline" size="1.2rem"
              class="absolute top-1/2 -translate-y-1/2 right-1 mr-1 text-white/70" />
            <input type="text" id="username" v-model="editableUserProfile.username"
              class="w-full pl-2 rounded bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-400"
              required />
          </div>
        </div>

        <div class="w-full">
          <label for="bio" class="block text-sm mb-1">Biografía</label>
          <textarea id="bio" v-model="editableUserProfile.bio" rows="4"
            class="w-full p-2 rounded bg-white/20 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y"
            placeholder="Escribe algo sobre ti..."></textarea>
        </div>

        <p v-if="successMessage" class="w-full text-green-400 text-center text-sm">
          {{ successMessage }}
        </p>
        <p v-if="errorMessage" class="w-full text-red-400 text-center text-sm">
          {{ errorMessage }}
        </p>

        <button type="submit" :disabled="isUpdating"
          class="w-full bg-white text-black p-3 rounded-md transition-all cursor-pointer"
          :class="{ 'hover:bg-slate-100': !isUpdating, 'opacity-50 cursor-not-allowed': isUpdating }">
          <span v-if="!isUpdating">Guardar Cambios</span>
          <span v-else>Guardando...</span>
        </button>
      </form>
      <NuxtLink to="/studio" class="hover:underline text-center mt-4 text-sm text-white/80">
        <p>Volver al Estudio</p>
      </NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";
import { Icon } from "#components"; // Asegúrate de que esto sea correcto para tu configuración de iconos

definePageMeta({
  layout: "custom", // O "default" si deseas el diseño de la página de login
  middleware: [
    'auth-middleware',
  ],
});

interface EditableUserProfile {
  username: string;
  email: string;
  profilePictureUrl?: string;
  bio: string;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  bio: string;
}

const userProfile = ref<UserProfile>({
  id: -1,
  username: "",
  email: "",
  profilePictureUrl: "/resources/studio/previewProfile.webp",
  bio: "",
});

const editableUserProfile = ref<EditableUserProfile>({
  username: "",
  email: "",
  profilePictureUrl: "/resources/studio/previewProfile.webp",
  bio: "",
});

const isLoading = ref(true);
const isUpdating = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const previewProfilePicture = ref<string | null>(null);

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const defaultProfile: UserProfile = {
  id: -1,
  username: "Usuario Anónimo",
  email: "anonimo@example.com",
  profilePictureUrl: "/resources/studio/previewProfile.webp",
  bio: "Este es un perfil predeterminado. Crea o edita tu perfil.",
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    previewProfilePicture.value = URL.createObjectURL(file);
  // debug log removed
  }
};

function getProfilePictureUrl() {
  if (previewProfilePicture.value) {
    return previewProfilePicture.value;
  }
  if (!editableUserProfile.value.profilePictureUrl || editableUserProfile.value.profilePictureUrl === '/resources/studio/previewProfile.webp') {
    return '/resources/studio/previewProfile.webp';
  }
  if (editableUserProfile.value.profilePictureUrl.startsWith('http')) {
    return editableUserProfile.value.profilePictureUrl;
  }
  return config.public.backend + editableUserProfile.value.profilePictureUrl;
}

// Función para manejar el error de carga de imagen
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = '/resources/studio/previewProfile.webp';
}

const fetchUserProfile = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  const usernameFromUrl = route.params.username as string;
  const targetUsername =
    usernameFromUrl ||
    JSON.parse(localStorage.getItem("user") || "{}").username ||
    "anonymous";

  if (!targetUsername || targetUsername === "anonymous") {
    userProfile.value = defaultProfile;
    editableUserProfile.value = { ...defaultProfile };
    isLoading.value = false;
  // file selection debug removed
    return;
  }

  try {
    const { data, error } = await useFetch<UserProfile>(
      `${config.public.backend}/api/users/by-username/${targetUsername}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Incluir token si es necesario para obtener el perfil
        },
      }
    );

    if (error.value) {
  // error handling removed
    // error handling; debug removed
      throw new Error(error.value.message || "No se pudo cargar el perfil del usuario.");
    }

    if (data.value) {
      userProfile.value = {
        id: data.value.id || -1,
        username: data.value.username,
        email: data.value.email,
        profilePictureUrl:
          data.value.profilePictureUrl ||
          "/resources/studio/previewProfile.webp",
        bio: data.value.bio || "",
      };
      editableUserProfile.value = {
        username: userProfile.value.username,
        email: userProfile.value.email,
        bio: userProfile.value.bio,
        profilePictureUrl: userProfile.value.profilePictureUrl,
      };
    } else {
      throw new Error("No se encontró el perfil del usuario.");
    }
  } catch (err) {
  // error handling removed
    // error handling; debug removed
    errorMessage.value = (err as Error).message || "Error al cargar el perfil.";
    userProfile.value = defaultProfile;
    editableUserProfile.value = { ...defaultProfile };
  } finally {
    isLoading.value = false;
  }
};

const updateProfile = async () => {
  isUpdating.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    // Obtener el usuario del localStorage de forma segura
    const storedUserRaw = localStorage.getItem("user");
    if (!storedUserRaw) {
      errorMessage.value = "No se encontró información de usuario en el almacenamiento local.";
      isUpdating.value = false;
      return;
    }
    const storedUser = JSON.parse(storedUserRaw);
    const userId = storedUser.id;
    if (!userId) {
      errorMessage.value = "No se encontró el ID del usuario.";
      isUpdating.value = false;
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      errorMessage.value = "No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.";
      isUpdating.value = false;
      return;
    }

    const backendUrl = config.public.backend || '';
    const userIdStr = String(userId || '');

    // --- Lógica para la imagen de perfil ---
    let formData: FormData | null = null;
    let useFormData = false;
    let fileToUpload: File | null = null;
    // Detectar si el usuario subió una nueva imagen
    if (fileInput.value && fileInput.value.files && fileInput.value.files[0]) {
      fileToUpload = fileInput.value.files[0];
      useFormData = true;
    }
    // Detectar si el usuario quiere eliminar la foto (profilePictureUrl === "")
    const removePhoto = editableUserProfile.value.profilePictureUrl === "";

    let requestOptions: any;
    if (useFormData) {
      formData = new FormData();
      formData.append("username", editableUserProfile.value.username);
      formData.append("bio", editableUserProfile.value.bio);
      formData.append("profilePicture", fileToUpload!);
      requestOptions = {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      };
    } else if (removePhoto) {
      // Si se elimina la foto, enviar profilePictureUrl como string vacío
      requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editableUserProfile.value.username,
          bio: editableUserProfile.value.bio,
          profilePictureUrl: "",
        }),
      };
    } else {
      // Si no se cambia la foto, solo username y bio
      requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editableUserProfile.value.username,
          bio: editableUserProfile.value.bio,
        }),
      };
    }

    const { data, error } = await useFetch<UserProfile>(
      `${backendUrl}/api/users/${userIdStr}`,
      requestOptions
    );

    if (error.value) {
  // error handling removed
    // error handling; debug removed
      throw new Error(error.value.message || "No se pudo actualizar el perfil del usuario.");
    }

    if (data.value) {
      successMessage.value = "Perfil actualizado exitosamente!";
      userProfile.value = {
        id: data.value.id || -1,
        username: data.value.username,
        email: data.value.email,
        profilePictureUrl:
          data.value.profilePictureUrl ||
          "/resources/studio/previewProfile.webp",
        bio: data.value.bio || "",
      };

      // Actualizar el almacenamiento local si los datos del usuario se guardan allí
      if (storedUser.username === userProfile.value.username) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            username: userProfile.value.username,
            bio: userProfile.value.bio,
            profilePictureUrl: userProfile.value.profilePictureUrl,
          })
        );
      }

      // Redirigir siempre al perfil actualizado
      router.push(`/profile/${userProfile.value.username}`);
    } else {
      throw new Error("No se recibieron datos después de la actualización del perfil.");
    }
  } catch (err) {
  // error handling removed
    // error handling; debug removed
    errorMessage.value = (err as Error).message || "Error al guardar los cambios.";
  } finally {
    isUpdating.value = false;
  }
};

function removeProfilePicture() {
  editableUserProfile.value.profilePictureUrl = '';
  previewProfilePicture.value = null;
}

onMounted(() => {
  fetchUserProfile();
});
</script>
