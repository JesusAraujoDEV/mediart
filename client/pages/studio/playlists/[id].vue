<template>
  <title>MediartStudio - Playlist: {{ playlist.name }}</title>
  <main class="w-screen h-fit min-h-dvh flex flex-col items-center justify-start p-4 text-white overflow-hidden">
    <NavigationStudio />

    <div v-if="isLoading" class="flex flex-col items-center justify-center h-full">
      <p class="text-xl mb-4 text-gray-300">Cargando playlist...</p>
      <svg class="animate-spin h-10 w-10 text-purple-400 mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="errorMessage" class="flex flex-col items-center justify-center h-full text-red-400 text-center">
      <p class="text-xl mb-4">{{ errorMessage }}</p>
      <button @click="fetchPlaylist" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors text-lg">
        Reintentar
      </button>
    </div>

    <div v-else class="flex flex-col flex-grow w-full max-w-6xl mt-20 md:mt-24 pb-4">
      <div class="glassEffect bg-gray-800/50 rounded-lg p-6 mb-6 shadow-xl flex flex-col md:flex-row items-center md:items-start text-center md:text-left relative">
        <div class="w-40 h-40 rounded-lg mb-4 md:mb-0 md:mr-6 flex-shrink-0 shadow-md border border-gray-600 overflow-hidden">
          <img
            v-if="playlist.coverUrl"
            :src="playlist.coverUrl"
            alt="Playlist Cover"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full grid grid-cols-2 grid-rows-2 gap-0 bg-gray-700">
            <img
              v-for="i in 4"
              :key="i"
              :src="playlist.items?.[i - 1]?.coverUrl || '/resources/item-placeholder.webp'"
              :alt="playlist.items?.[i - 1]?.title || 'Item Cover'"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <div class="flex-grow">
          <h1 class="text-4xl font-extrabold mb-2">
            {{ playlist.name }}
          </h1>
          <p class="text-lg text-gray-300 mb-2">{{ playlist.description }}</p>
          <p class="text-sm text-gray-400 mb-1">
            Creada por: <span class="font-semibold">{{ playlist.owner?.username || 'Desconocido' }}</span>
          </p>
          <p class="text-xs text-gray-500">
            Última actualización: {{ formatDateTime(playlist.updatedAt) }}
          </p>
          <div v-if="playlist.isCollaborative" class="mt-2 flex items-center text-green-400 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
            </svg>
            Colaborativa
          </div>
          <!-- Aviso de modo edición -->
          <div v-if="editMode" class="mt-4 mb-2 flex items-center gap-2 justify-center md:justify-start">
            <Icon name="material-symbols:edit" size="1.2em" class="text-purple-400 animate-pulse" />
            <span class="text-purple-300 font-semibold text-base">Modo edición activo: puedes eliminar elementos</span>
          </div>
          <!-- Botón de editar -->
          <button @click="toggleEditMode" :class="['absolute cursor-pointer top-4 right-4 rounded-full p-2 shadow-md transition-colors', editMode ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-purple-600 text-white']" title="Editar playlist">
            <Icon name="material-symbols:edit" size="1.5em" />
          </button>
          <!-- Botón de configuraciones -->
          <button @click="openSettingsModal" class="absolute cursor-pointer top-4 right-16 rounded-full p-2 shadow-md transition-colors bg-gray-700 hover:bg-purple-600 text-white" title="Configuraciones de la playlist">
            <Icon name="material-symbols:settings" size="1.5em" />
          </button>
          <!-- Botón de guardar playlist -->
          <button 
            @click="toggleSavePlaylist" 
            :disabled="isSavingPlaylist"
            :class="[
              'absolute cursor-pointer top-4 right-28 rounded-full p-2 shadow-md transition-colors',
              isSavingPlaylist ? 'bg-gray-600 text-gray-400' : 
              isPlaylistSaved ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-700 hover:bg-purple-600 text-white'
            ]" 
            :title="isPlaylistSaved ? 'Quitar de mi biblioteca' : 'Guardar en mi biblioteca'"
          >
            <Icon v-if="isSavingPlaylist" name="material-symbols:sync" size="1.5em" class="animate-spin" />
            <Icon v-else-if="isPlaylistSaved" name="material-symbols:bookmark" size="1.5em" />
            <Icon v-else name="material-symbols:bookmark-add" size="1.5em" />
          </button>
        </div>
      </div>

      <div class="glassEffect bg-gray-800/50 rounded-lg p-6 shadow-xl flex-grow overflow-y-auto custom-scroll">
        <h2 class="text-2xl font-bold mb-5 text-gray-200">Contenido de la Playlist ({{ playlist.items?.length || 0 }})</h2>
        <div v-if="playlist.items && playlist.items.length > 0" class="grid grid-cols-1 gap-4">
          <div
            v-for="(item, idx) in playlist.items"
            :key="item.id"
            class="bg-gray-700/60 rounded-lg p-3 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left shadow-md transform transition-transform duration-300 hover:scale-[1.01] hover:bg-gray-600/70 border border-gray-600 no-underline text-white relative group"
          >
            <!-- Botón de eliminar en modo edición -->
            <button
              v-if="editMode"
              @click="confirmDeleteItem(item.id, idx)"
              class="absolute cursor-pointer top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors z-10"
              title="Eliminar este elemento de la playlist"
            >
              <Icon name="material-symbols:close" size="1.2em" />
            </button>
            <NuxtLink
              :to="`/studio/item/${item.id}`"
              class="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left flex-grow"
            >
              <img
                :src="item.coverUrl || '/resources/item-placeholder.webp'"
                :alt="item.title || 'Item Cover'"
                class="w-24 h-24 object-cover rounded-md mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 shadow-sm border border-gray-500"
              />
              <div class="flex-grow flex flex-col justify-center items-center sm:items-start">
                <h3 class="font-bold text-lg text-white mb-1">{{ item.title }}</h3>
                <p class="text-sm text-gray-300 capitalize mb-1">
                  Tipo: {{ item.type }} <span class="opacity-70">({{ item.externalSource }})</span>
                </p>
                <p v-if="item.description" class="text-xs text-gray-400 max-h-12 overflow-hidden text-ellipsis mb-1">
                  {{ item.description }}
                </p>
                <p v-if="item.releaseDate" class="text-xs text-gray-400 mb-1">
                  Lanzamiento: {{ new Date(item.releaseDate).getFullYear() }}
                </p>
                <p v-if="item.avgRating !== null && item.avgRating !== undefined" class="text-xs text-gray-400 mb-2">
                  Valoración: {{ parseFloat(item.avgRating.toString()).toFixed(1) }} / 10
                </p>
                <span
                  v-if="item.externalUrl"
                  class="text-blue-400 text-sm font-semibold mt-1"
                >
                  Ver más en {{ item.externalSource }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>
        <div v-else class="text-center text-gray-400 text-lg py-10">
          <p>Esta playlist no tiene elementos aún.</p>
        </div>
      </div>
    </div>

    <!-- Modal de Configuraciones -->
    <div v-if="showSettingsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-xl p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-600">
        <div class="flex justify-between items-center mb-8 border-b border-gray-600 pb-4">
          <h2 class="text-3xl font-bold text-white">Configuraciones de la Playlist</h2>
          <button @click="closeSettingsModal" class="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700">
            <Icon name="material-symbols:close" size="1.8em" />
          </button>
        </div>

        <form @submit.prevent="savePlaylistSettings" class="space-y-8">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-3">Nombre de la Playlist</label>
            <input
              v-model="settingsForm.name"
              type="text"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-3">Descripción</label>
            <textarea
              v-model="settingsForm.description"
              rows="4"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe tu playlist..."
            ></textarea>
          </div>

          <!-- Imagen de portada -->
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-3">Imagen de Portada</label>
            <input
              v-model="settingsForm.coverUrl"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <p class="text-xs text-gray-400 mt-2">Deja vacío para usar la imagen por defecto</p>
          </div>

          <!-- Colaborativa -->
          <div class="flex items-center p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <input
              v-model="settingsForm.isCollaborative"
              type="checkbox"
              id="collaborative"
              class="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
            />
            <label for="collaborative" class="ml-3 text-base font-medium text-gray-300">
              Hacer colaborativa
            </label>
            <div class="ml-auto">
              <Icon name="material-symbols:group" size="1.5em" class="text-purple-400" />
            </div>
          </div>

          <!-- Sección de colaboradores (solo si es colaborativa) -->
          <div v-if="settingsForm.isCollaborative" class="space-y-6 p-6 bg-gray-700/30 rounded-lg border border-gray-600">
            <div class="flex items-center gap-3 mb-4">
              <Icon name="material-symbols:group" size="1.8em" class="text-purple-400" />
              <h3 class="text-xl font-semibold text-white">Colaboradores</h3>
            </div>
            
            <!-- Lista de colaboradores actuales -->
            <div v-if="playlist.collaborators && playlist.collaborators.length > 0" class="space-y-3">
              <h4 class="text-sm font-semibold text-gray-300 border-b border-gray-600 pb-2">Colaboradores actuales:</h4>
              <div v-for="collaborator in playlist.collaborators" :key="collaborator.id" class="flex items-center justify-between bg-gray-600 p-4 rounded-lg">
                <div class="flex items-center">
                  <img
                    v-if="collaborator.profilePictureUrl"
                    :src="collaborator.profilePictureUrl"
                    :alt="collaborator.username"
                    class="w-10 h-10 rounded-full mr-4 border-2 border-gray-500"
                  />
                  <div v-else class="w-10 h-10 rounded-full mr-4 bg-gray-500 flex items-center justify-center border-2 border-gray-400">
                    <Icon name="material-symbols:person" size="1.5em" class="text-gray-300" />
                  </div>
                  <div>
                    <span class="text-white font-medium">{{ collaborator.username }}</span>
                    <p class="text-xs text-gray-400">Colaborador</p>
                  </div>
                </div>
                <button
                  @click="removeCollaborator(collaborator.id)"
                  type="button"
                  class="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-500/10 transition-colors"
                  title="Eliminar colaborador"
                >
                  <Icon name="material-symbols:remove" size="1.3em" />
                </button>
              </div>
            </div>

            <!-- Agregar nuevo colaborador -->
            <div class="space-y-4">
              <h4 class="text-sm font-semibold text-gray-300 border-b border-gray-600 pb-2">Agregar colaborador:</h4>
              <div class="relative">
                <input
                  v-model="newCollaboratorUsername"
                  @input="handleSearchInput"
                  type="text"
                  placeholder="Buscar usuario por nombre..."
                  class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                
                <!-- Loading indicator -->
                <div v-if="isSearching" class="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg class="animate-spin h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>

                <!-- Search results dropdown -->
                <div v-if="showSearchResults && searchResults.length > 0" class="absolute top-full left-0 right-0 bg-gray-700 border border-gray-600 rounded-lg mt-2 max-h-56 overflow-y-auto z-10 shadow-xl">
                  <div
                    v-for="user in searchResults"
                    :key="user.id"
                    @click="selectUser(user)"
                    class="flex items-center p-4 hover:bg-gray-600 cursor-pointer transition-colors border-b border-gray-600 last:border-b-0"
                  >
                    <img
                      v-if="user.profilePictureUrl"
                      :src="user.profilePictureUrl"
                      :alt="user.username"
                      class="w-10 h-10 rounded-full mr-4 border-2 border-gray-500"
                    />
                    <div v-else class="w-10 h-10 rounded-full mr-4 bg-gray-500 flex items-center justify-center border-2 border-gray-400">
                      <Icon name="material-symbols:person" size="1.5em" class="text-gray-300" />
                    </div>
                    <div>
                      <span class="text-white font-medium">{{ user.username }}</span>
                      <p class="text-xs text-gray-400">Click para agregar</p>
                    </div>
                  </div>
                </div>

                <!-- No results message -->
                <div v-if="showSearchResults && searchResults.length === 0 && !isSearching && newCollaboratorUsername.trim().length >= 2" class="absolute top-full left-0 right-0 bg-gray-700 border border-gray-600 rounded-lg mt-2 p-4 text-gray-400 text-center">
                  <Icon name="material-symbols:search-off" size="1.5em" class="mx-auto mb-2 text-gray-500" />
                  No se encontraron usuarios
                </div>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-end gap-4 pt-6 border-t border-gray-600">
            <button
              type="button"
              @click="closeSettingsModal"
              class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSavingSettings"
              class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              <Icon v-if="isSavingSettings" name="material-symbols:sync" size="1.2em" class="animate-spin" />
              {{ isSavingSettings ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import NavigationStudio from "~/components/navigation/NavigationStudio.vue";
import Swal from "sweetalert2";

definePageMeta({
  layout: "custom",
  middleware: ["auth-middleware"],
});

// Definir interfaces para los datos de la playlist y sus ítems
interface PlaylistItem {
  id: number;
  title: string;
  type: string;
  description?: string | null;
  coverUrl?: string | null;
  releaseDate?: string | null;
  externalId: string;
  externalSource: string;
  avgRating?: number | string | null;
  externalUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PlaylistOwner {
  id: number;
  username: string;
  profilePictureUrl?: string | null;
}

interface Playlist {
  id: number;
  ownerUserId: number;
  name: string;
  description: string;
  isCollaborative: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: PlaylistOwner;
  items?: PlaylistItem[];
  savedByUsers?: PlaylistOwner[];
  collaborators?: PlaylistOwner[];
  coverUrl?: string;
}

interface CollaboratorResponse {
  collaborator: PlaylistOwner;
  message: string;
}

interface UserSearchResult {
  id: number;
  username: string;
  profilePictureUrl?: string;
}

const playlist = ref<Playlist>({
  id: 0,
  ownerUserId: 0,
  name: "Cargando...",
  description: "Cargando descripción...",
  isCollaborative: false,
  createdAt: "",
  updatedAt: "",
  items: [],
});

const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const route = useRoute();
const config = useRuntimeConfig();

const editMode = ref(false);
const showSettingsModal = ref(false);
const isSavingSettings = ref(false);
const isAddingCollaborator = ref(false);
const newCollaboratorUsername = ref('');
const searchResults = ref<UserSearchResult[]>([]);
const isSearching = ref(false);
const showSearchResults = ref(false);
const isSavingPlaylist = ref(false);
const isPlaylistSaved = ref(false);

// Formulario de configuraciones
const settingsForm = ref({
  name: '',
  description: '',
  coverUrl: '',
  isCollaborative: false
});

// Función para formatear la fecha y hora
const formatDateTime = (dateString: string): string => {
  if (!dateString) return 'Fecha desconocida';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const fetchPlaylist = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  const playlistId = route.params.id;

  if (!playlistId) {
    errorMessage.value = "ID de playlist no proporcionado.";
    isLoading.value = false;
    return;
  }

  try {
    const { data, error } = await useFetch<Playlist>(
      `${config.public.backend}/api/playlists/${playlistId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (error.value) {
      console.error("Error al obtener la playlist:", error.value);
      throw new Error(error.value.data?.message || error.value.message || "No se pudo cargar la playlist.");
    }

    if (data.value) {
      playlist.value = {
        ...data.value,
        items: data.value.items || [], // Ensure items is an array
      };
      
      // Verificar si la playlist está guardada
      await checkIfPlaylistSaved();
    } else {
      throw new Error("No se encontró la playlist con el ID proporcionado.");
    }
  } catch (err) {
    console.error("Error en fetchPlaylist:", err);
    errorMessage.value = (err as Error).message || "Error al cargar la playlist.";
  } finally {
    isLoading.value = false;
  }
};

const checkIfPlaylistSaved = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const response = await fetch(`${config.public.backend}/api/users/by-username/${JSON.parse(localStorage.getItem('user') || '{}').username}?include=savedPlaylists`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      const savedPlaylists = data.savedPlaylists || [];
      isPlaylistSaved.value = savedPlaylists.some((p: any) => p.id === playlist.value.id);
    }
  } catch (err) {
    console.error('Error al verificar si la playlist está guardada:', err);
  }
};

const toggleSavePlaylist = async () => {
  if (isSavingPlaylist.value) return;
  
  isSavingPlaylist.value = true;
  try {
    const { error } = await useFetch(
      `${config.public.backend}/api/profile/saved-playlists/${playlist.value.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (error.value) {
      throw new Error(error.value.data?.message || error.value.message || 'Error al guardar la playlist');
    }

    isPlaylistSaved.value = true;
    Swal.fire({
      icon: 'success',
      title: 'Playlist guardada',
      text: 'La playlist se ha guardado en tu biblioteca.',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: (err as Error).message || 'No se pudo guardar la playlist.',
    });
  } finally {
    isSavingPlaylist.value = false;
  }
};

function toggleEditMode() {
  editMode.value = !editMode.value;
}

async function confirmDeleteItem(itemId: number, idx: number) {
  const result = await Swal.fire({
    title: '¿Eliminar elemento?',
    text: '¿Estás seguro de que quieres eliminar este elemento de la playlist? Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  });
  if (result.isConfirmed) {
    await deleteItemFromPlaylist(itemId, idx);
  }
}

async function deleteItemFromPlaylist(itemId: number, idx: number) {
  const playlistId = playlist.value.id;
  try {
    const { data, error } = await useFetch(
      `${config.public.backend}/api/playlists/${playlistId}/items/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        }
      }
    );
    if (error.value) {
      throw new Error(error.value.data?.message || error.value.message || "No se pudo eliminar el item.");
    }
    // Eliminar del array local
    playlist.value.items?.splice(idx, 1);
    Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      text: 'El elemento fue eliminado de la playlist.',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: (err as Error).message || 'No se pudo eliminar el elemento.',
    });
  }
}

function openSettingsModal() {
  // Cargar datos actuales en el formulario
  settingsForm.value = {
    name: playlist.value.name,
    description: playlist.value.description,
    coverUrl: playlist.value.coverUrl || '',
    isCollaborative: playlist.value.isCollaborative
  };
  showSettingsModal.value = true;
}

function closeSettingsModal() {
  showSettingsModal.value = false;
  newCollaboratorUsername.value = '';
}

async function savePlaylistSettings() {
  isSavingSettings.value = true;
  try {
    const { data, error } = await useFetch(
      `${config.public.backend}/api/playlists/${playlist.value.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: {
          name: settingsForm.value.name,
          description: settingsForm.value.description,
          coverUrl: settingsForm.value.coverUrl || null,
          isCollaborative: settingsForm.value.isCollaborative
        }
      }
    );

    if (error.value) {
      throw new Error(error.value.data?.message || error.value.message || 'Error al guardar los cambios');
    }

    // Actualizar datos locales
    playlist.value.name = settingsForm.value.name;
    playlist.value.description = settingsForm.value.description;
    playlist.value.coverUrl = settingsForm.value.coverUrl;
    playlist.value.isCollaborative = settingsForm.value.isCollaborative;

    Swal.fire({
      icon: 'success',
      title: 'Cambios guardados',
      text: 'Las configuraciones se han actualizado correctamente.',
      timer: 1500,
      showConfirmButton: false
    });

    closeSettingsModal();
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: (err as Error).message || 'No se pudieron guardar los cambios.',
    });
  } finally {
    isSavingSettings.value = false;
  }
}

async function searchUsers(query: string) {
  if (!query.trim() || query.length < 2) {
    searchResults.value = [];
    showSearchResults.value = false;
    return;
  }

  isSearching.value = true;
  try {
    const { data, error } = await useFetch<UserSearchResult[]>(
      `${config.public.backend}/api/search/users?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (error.value) {
      throw new Error(error.value.data?.message || error.value.message || 'Error al buscar usuarios');
    }

    searchResults.value = data.value || [];
    showSearchResults.value = searchResults.value.length > 0;
  } catch (err) {
    console.error('Error al buscar usuarios:', err);
    searchResults.value = [];
    showSearchResults.value = false;
  } finally {
    isSearching.value = false;
  }
}

async function addCollaborator(userId: number, username: string) {
  isAddingCollaborator.value = true;
  try {
    const { data, error } = await useFetch<CollaboratorResponse>(
      `${config.public.backend}/api/playlists/${playlist.value.id}/collaborators`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: {
          userId: userId
        }
      }
    );

    if (error.value) {
      throw new Error(error.value.data?.message || error.value.message || 'Error al agregar colaborador');
    }

    // Actualizar lista de colaboradores
    if (data.value && data.value.collaborator) {
      if (!playlist.value.collaborators) {
        playlist.value.collaborators = [];
      }
      playlist.value.collaborators.push(data.value.collaborator);
    }

    Swal.fire({
      icon: 'success',
      title: 'Colaborador agregado',
      text: `${username} ha sido agregado como colaborador.`,
      timer: 1500,
      showConfirmButton: false
    });

    // Limpiar búsqueda
    newCollaboratorUsername.value = '';
    searchResults.value = [];
    showSearchResults.value = false;
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: (err as Error).message || 'No se pudo agregar el colaborador.',
    });
  } finally {
    isAddingCollaborator.value = false;
  }
}

function handleSearchInput() {
  if (newCollaboratorUsername.value.trim()) {
    searchUsers(newCollaboratorUsername.value);
  } else {
    searchResults.value = [];
    showSearchResults.value = false;
  }
}

function selectUser(user: UserSearchResult) {
  addCollaborator(user.id, user.username);
}

async function removeCollaborator(collaboratorId: number) {
  try {
    const { error } = await useFetch(
      `${config.public.backend}/api/playlists/${playlist.value.id}/collaborators/${collaboratorId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      }
    );

    if (error.value) {
      throw new Error(error.value.data?.message || error.value.message || 'Error al eliminar colaborador');
    }

    // Remover de la lista local
    if (playlist.value.collaborators) {
      playlist.value.collaborators = playlist.value.collaborators.filter(c => c.id !== collaboratorId);
    }

    Swal.fire({
      icon: 'success',
      title: 'Colaborador eliminado',
      text: 'El colaborador ha sido removido de la playlist.',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: (err as Error).message || 'No se pudo eliminar el colaborador.',
    });
  }
}

onMounted(() => {
  fetchPlaylist();
});
</script>

<style scoped>
/* Estilo para la barra de desplazamiento vertical */
.custom-scroll::-webkit-scrollbar {
  width: 8px; /* Ancho de la barra de desplazamiento vertical */
}

.custom-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2); /* Fondo de la pista */
  border-radius: 10px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.5); /* Color del "pulgar" de la barra */
  border-radius: 10px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(150, 150, 150, 0.7); /* Color al pasar el ratón */
}

/* Base styling for glass effect */
.glassEffect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>