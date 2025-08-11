// Tu archivo actual `composables/useRecommendations.ts`
import { ref, reactive, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import type { SearchItem } from './useSuggestions';

interface RecommendationItem extends SearchItem {
  releaseDate?: string;
  avgRating?: string;
}

interface NewPlaylist {
  name: string;
  description: string;
  isCollaborative: boolean;
  items: RecommendationItem[];
}

export const useRecommendations = () => {
  const config = useRuntimeConfig();
  const router = useRouter();

  const recommendations: Ref<RecommendationItem[]> = ref([]);
  const recommendationsLoading = ref(false);
  const recommendationsError = ref<string | null>(null);

  const selectedCategory = ref('mix');

  // Estado para el modal de playlist
  const showPlaylistModal = ref(false);
  const newPlaylist = reactive<NewPlaylist>({
    name: '',
    description: '',
    isCollaborative: false,
    items: [],
  });
  const playlistSaving = ref(false);

  /**
   * Envía los datos para generar las recomendaciones.
   * @param {SearchItem[]} tags Las etiquetas (ítems) seleccionadas por el usuario.
   */
  const sendData = async (tags: SearchItem[]) => {
    if (tags.length === 0) {
      Swal.fire('Atención', 'Por favor, selecciona al menos un elemento para generar recomendaciones.', 'warning');
      return;
    }

    recommendationsLoading.value = true;
    recommendationsError.value = null;

    try {
      // Construir la URL basada en el tipo de recomendación seleccionado
      const recommendationUrl = `${config.public.backend}/api/recommendation/${selectedCategory.value}`;
      const token = localStorage.getItem("token");

      const response = await fetch(recommendationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          seedItems: tags.map(tag => ({
            externalId: tag.externalId,
            type: tag.type,
          })),
          itemName: tags.map(tag => tag.title).join(', '),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al generar recomendaciones.');
      }

      const data = await response.json();
      // Extraer el array correcto basado en el tipo de recomendación seleccionado
      recommendations.value = data[selectedCategory.value] || data[selectedCategory.value + 's'] || [];
    } catch (error: any) {
      console.error('Error generando recomendaciones:', error);
      recommendationsError.value = error.message || 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
    } finally {
      recommendationsLoading.value = false;
    }
  };

  /**
   * Elimina una recomendación de la lista.
   * @param {number} index El índice del elemento a eliminar.
   */
  const removeRecommendation = (index: number) => {
    recommendations.value.splice(index, 1);
  };

  /**
   * Crea una nueva playlist con las recomendaciones actuales.
   */
  const createPlaylist = async (playlistData?: { name: string; description: string; isCollaborative: boolean }) => {
    // Usar los datos del modal si se proporcionan, de lo contrario usar el estado interno
    const name = playlistData?.name?.trim() || newPlaylist.name?.trim() || '';
    const description = playlistData?.description || newPlaylist.description || '';
    const isCollaborative = playlistData?.isCollaborative ?? newPlaylist.isCollaborative ?? false;
    
    if (!name) {
      console.warn('Playlist name is empty:', { name, playlistData, newPlaylist });
      Swal.fire('Error', 'El nombre de la playlist no puede estar vacío.', 'error');
      return;
    }

    if (recommendations.value.length === 0) {
      Swal.fire('Error', 'No hay recomendaciones para crear la playlist.', 'error');
      return;
    }

    playlistSaving.value = true;

    try {
      const createPlaylistUrl = `${config.public.backend}/api/playlists`;
      const token = localStorage.getItem("token");

      const requestData = {
        name: name,
        description: description,
        isCollaborative: isCollaborative,
        items: recommendations.value,
      };

      console.log('Creating playlist with data:', requestData);
      
      const response = await fetch(createPlaylistUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la playlist.');
      }
      
      Swal.fire('Éxito', 'Playlist creada exitosamente!', 'success');
      showPlaylistModal.value = false;
      recommendations.value = []; // Limpiar las recomendaciones

      // Redirigir al perfil del usuario usando el username del localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const username = user.username || user.email?.split('@')[0] || 'user';
      router.push(`/profile/${username}`);

    } catch (error: any) {
      console.error('Error creando playlist:', error);
      Swal.fire('Error', error.message || 'Ocurrió un error inesperado al crear la playlist.', 'error');
    } finally {
      playlistSaving.value = false;
    }
  };

  return {
    recommendations,
    recommendationsLoading,
    recommendationsError,
    selectedCategory,
    showPlaylistModal,
    newPlaylist,
    playlistSaving,
    sendData,
    removeRecommendation,
    createPlaylist,
  };
};