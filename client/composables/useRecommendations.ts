import { ref } from 'vue';
import type { RecommendationItem } from '~/types/Recommendations';

export function useRecommendations(config = useRuntimeConfig()) {
  const recommendations = ref<RecommendationItem[]>([]);
  const recommendationsLoading = ref(false);
  const recommendationsError = ref<string | null>(null);

  const showPlaylistModal = ref(false);
  const playlistSaving = ref(false);
  const newPlaylist = ref({
    name: '',
    description: '',
    isCollaborative: false,
  });

  const selectedCategory = ref<string>('mix');

  const buildItemName = (tags: Array<{
    title: string;
    type?: string;
    externalId?: string;
    coverUrl?: string | null;
    description?: string | null;
  }>) => {
    return tags
      .map((tag) => {
        return `${tag.title} (${tag.type})${tag.externalId ? ` - ID: ${tag.externalId}` : ''}${
          tag.coverUrl ? ` - Cover: ${tag.coverUrl}` : ''
        }${tag.description ? ` - Descripcion: ${tag.description}` : ''}`;
      })
      .join(' | ');
  };

  const sendData = async (selectedTags: Array<{
    title: string;
    type?: string;
    externalId?: string;
    coverUrl?: string | null;
    description?: string | null;
  }>) => {
    if (!selectedTags.length) {
      recommendationsError.value = 'Por favor, selecciona al menos un tag para generar recomendaciones.';
      recommendations.value = [];
      return;
    }

    recommendationsLoading.value = true;
    recommendationsError.value = null;
    recommendations.value = [];

    const itemName = buildItemName(selectedTags);
    const url = `${config.public.backend}/api/recommendation/${selectedCategory.value}`;

    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ itemName }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `Error HTTP! Estado: ${resp.status}`);
      }

      const result = await resp.json();

      let processed: RecommendationItem[] = [];
      if (selectedCategory.value === 'mix' && Array.isArray(result?.mix)) {
        processed = result.mix;
      } else if (Array.isArray(result)) {
        processed = result;
      } else {
        if (Array.isArray(result?.songs)) processed.push(...result.songs);
        if (Array.isArray(result?.artists)) processed.push(...result.artists);
        if (Array.isArray(result?.albums)) processed.push(...result.albums);
        if (Array.isArray(result?.movies)) processed.push(...result.movies);
        if (Array.isArray(result?.tvshows)) processed.push(...result.tvshows);
        if (Array.isArray(result?.books)) processed.push(...result.books);
        if (Array.isArray(result?.videogames)) processed.push(...result.videogames);
      }

      recommendations.value = processed;
      if (!processed.length) {
        recommendationsError.value = 'No se encontraron recomendaciones para tu búsqueda.';
      }
    } catch (e: any) {
      console.error('Error al obtener recomendaciones:', e);
      recommendationsError.value = e?.message || 'Ocurrió un error inesperado al obtener recomendaciones.';
      recommendations.value = [];
    } finally {
      recommendationsLoading.value = false;
    }
  };

  const removeRecommendation = (index: number) => {
    recommendations.value.splice(index, 1);
  };

  const createPlaylist = async () => {
    if (!recommendations.value.length) {
      throw new Error('No hay recomendaciones disponibles para crear una playlist.');
    }
    if (!newPlaylist.value.name.trim()) {
      throw new Error('El nombre de la playlist es obligatorio.');
    }

    playlistSaving.value = true;

    let playlistCoverUrl: string | null = null;
    const first = recommendations.value[0] as any;
    playlistCoverUrl = first?.coverUrl || first?.thumbnailUrl || first?.imageUrl || null;
    if (playlistCoverUrl && String(playlistCoverUrl).includes('placeholder')) {
      playlistCoverUrl = null;
    }

    try {
      const resp = await fetch(`${config.public.backend}/api/playlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: newPlaylist.value.name,
          description: newPlaylist.value.description,
          isCollaborative: newPlaylist.value.isCollaborative,
          playlistCoverUrl,
          items: recommendations.value,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `Error al crear la playlist: ${resp.statusText}`);
      }

      return await resp.json();
    } finally {
      playlistSaving.value = false;
    }
  };

  return {
    // state
    recommendations,
    recommendationsLoading,
    recommendationsError,
    selectedCategory,
    showPlaylistModal,
    newPlaylist,
    playlistSaving,

    // actions
    sendData,
    removeRecommendation,
    createPlaylist,
  };
}