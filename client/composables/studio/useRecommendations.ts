import { ref, reactive, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import type { SearchItem } from './useSuggestions';

interface RecommendationItem extends SearchItem {
  releaseDate?: string;
  avgRating?: string | number;
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

  // Cache en memoria para respuestas por payload (category + seed ids)
  const recommendationsCache = new Map<string, { ts: number; data: RecommendationItem[] }>();
  const REC_CACHE_TTL = 1000 * 60 * 5; // 5 minutos

  const showPlaylistModal = ref(false);
  const newPlaylist = reactive<NewPlaylist>({ name: '', description: '', isCollaborative: false, items: [] });
  const playlistSaving = ref(false);
  // Último payload enviado (seedItems, itemName, category) para permitir "regenerar" exactamente la misma petición
  let lastPayload: { seedItems: Array<{ externalId: string | null; type: string | undefined }>; itemName: string; category: string } | null = null;

  /**
   * Genera recomendaciones para los tags seleccionados.
   * Usa cache en memoria para respuestas recientes para reducir latencia de render.
   */
  const sendData = async (tags?: SearchItem[]) => {
  // Si se llama sin argumentos y existe lastPayload, lo reutilizamos exactamente
    const useLastPayload = typeof tags === 'undefined' && lastPayload !== null;

  console.debug('[useRecommendations] sendData called, useLastPayload=', useLastPayload, 'tagsLen=', tags ? tags.length : 0);

    // Si no estamos reutilizando lastPayload, generamos effectiveTags desde los tags pasados o desde las recomendaciones actuales
    const effectiveTags: SearchItem[] = useLastPayload
      ? []
      : (tags && tags.length > 0)
        ? tags
        : (recommendations.value && recommendations.value.length > 0)
          ? recommendations.value.map(r => ({ title: r.title, externalId: r.externalId, type: r.type }))
          : [];

    if (!useLastPayload && (!effectiveTags || effectiveTags.length === 0)) {
      Swal.fire('Atención', 'Por favor, selecciona al menos un elemento o genera recomendaciones primero.', 'warning');
      return;
    }

    recommendationsLoading.value = true;
    recommendationsError.value = null;

    try {
      let categoryToUse = selectedCategory.value;
      let seedItemsForRequest: Array<{ externalId: string | null; type: string | undefined }> = [];
      let itemNameForRequest = '';

      if (useLastPayload && lastPayload) {
        categoryToUse = lastPayload.category;
        seedItemsForRequest = lastPayload.seedItems;
        itemNameForRequest = lastPayload.itemName;
      } else {
        seedItemsForRequest = effectiveTags.map(t => ({ externalId: t.externalId ?? null, type: t.type }));
        itemNameForRequest = effectiveTags.map(t => t.title).join(', ');
      }

      const keyParts = seedItemsForRequest.map(t => t.externalId ?? '').filter(Boolean);
      const payloadKey = `${categoryToUse}:${keyParts.join(',')}`;

      const cached = recommendationsCache.get(payloadKey);
      if (cached && (Date.now() - cached.ts) < REC_CACHE_TTL) {
        // devolver copia para evitar enlaces mutables
        recommendations.value = cached.data.slice();
        recommendationsLoading.value = false;
        return;
      }
      const url = `${config.public.backend}/api/recommendation/${categoryToUse}`;
      const token = localStorage.getItem('token');

      // Guardar el payload para permitir regenerar exactamente la misma petición posteriormente
      lastPayload = { seedItems: seedItemsForRequest.slice(), itemName: itemNameForRequest, category: categoryToUse };

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ seedItems: seedItemsForRequest, itemName: itemNameForRequest }),
      });

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        throw new Error(errBody.message || 'Error al generar recomendaciones.');
      }

      const payload = await resp.json().catch(() => ({}));
      const raw: any[] = payload[selectedCategory.value] || payload[`${selectedCategory.value}s`] || [];

      // Mapear sólo los campos que usamos en la UI para reducir trabajo del renderer
      const mapped: RecommendationItem[] = (raw || []).map((item: any) => ({
        title: item.title || item.name || '',
        type: item.type || selectedCategory.value,
        coverUrl: item.coverUrl || item.image || item.poster_path || null,
        externalSource: item.externalSource || item.source || '',
        externalId: item.externalId || item.id || item._id || null,
        externalUrl: item.externalUrl || item.url || '',
        description: item.description || item.overview || '',
        releaseDate: item.releaseDate || item.release_date || item.year || '',
        avgRating: item.avgRating ?? item.vote_average ?? item.rating ?? 0,
      }));

      recommendations.value = mapped;
      try { recommendationsCache.set(payloadKey, { ts: Date.now(), data: mapped.slice() }); } catch (e) { /* ignore cache errors */ }
    } catch (error: any) {
      console.error('useRecommendations: sendData error', error);
      recommendationsError.value = error?.message || 'Ocurrió un error inesperado.';
    } finally {
      recommendationsLoading.value = false;
    }
  };

  const removeRecommendation = (index: number) => { recommendations.value.splice(index, 1); };

  const createPlaylist = async (playlistData?: { name: string; description: string; isCollaborative: boolean }) => {
    const name = playlistData?.name?.trim() || newPlaylist.name?.trim() || '';
    const description = playlistData?.description || newPlaylist.description || '';
    const isCollaborative = playlistData?.isCollaborative ?? newPlaylist.isCollaborative ?? false;

    if (!name) { Swal.fire('Error', 'El nombre de la playlist no puede estar vacío.', 'error'); return; }
    if (!recommendations.value || recommendations.value.length === 0) { Swal.fire('Error', 'No hay recomendaciones para crear la playlist.', 'error'); return; }

    playlistSaving.value = true;
    try {
      const url = `${config.public.backend}/api/playlists`;
      const token = localStorage.getItem('token');
      const body = { name, description, isCollaborative, items: recommendations.value };

      const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      if (!resp.ok) { const err = await resp.json().catch(() => ({})); throw new Error(err.message || 'Error al crear la playlist.'); }

      Swal.fire('Éxito', 'Playlist creada exitosamente!', 'success');
      showPlaylistModal.value = false;
      recommendations.value = [];

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const username = user.username || user.email?.split('@')[0] || 'user';
      router.push(`/profile/${username}`);
    } catch (error: any) {
      console.error('useRecommendations: createPlaylist error', error);
      Swal.fire('Error', error?.message || 'Ocurrió un error inesperado al crear la playlist.', 'error');
    } finally { playlistSaving.value = false; }
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