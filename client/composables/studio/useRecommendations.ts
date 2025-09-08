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

  console.info('[useRecommendations] sendData called, useLastPayload=', useLastPayload, 'tagsLen=', tags ? tags.length : 0);
  console.info('[useRecommendations] lastPayload exists:', lastPayload !== null);
  if (lastPayload) {
    console.info('[useRecommendations] lastPayload content:', lastPayload);
  }
  console.info('[useRecommendations] recommendations length:', recommendations.value.length);

    // Si no estamos reutilizando lastPayload, generamos effectiveTags desde los tags pasados o desde las recomendaciones actuales
    const effectiveTags: SearchItem[] = useLastPayload
      ? []
      : (tags && tags.length > 0)
        ? tags
        : (recommendations.value && recommendations.value.length > 0)
          ? recommendations.value.map(r => ({ title: r.title, externalId: r.externalId, type: r.type }))
          : [];

  console.info('[useRecommendations] effectiveTags logic:');
  console.info('  - useLastPayload:', useLastPayload);
  console.info('  - tags provided:', !!tags);
  console.info('  - tags length:', tags ? tags.length : 0);
  console.info('  - recommendations available:', recommendations.value.length > 0);
  console.info('  - effectiveTags length:', effectiveTags.length);

    if (!useLastPayload && (!effectiveTags || effectiveTags.length === 0)) {
      console.warn('[useRecommendations] No effectiveTags and not using lastPayload, showing alert');
      Swal.fire('Atención', 'Por favor, selecciona al menos un elemento o genera recomendaciones primero.', 'warning');
      return;
    }

  console.info('[useRecommendations] Proceeding with request, effectiveTags length:', effectiveTags.length, 'useLastPayload:', useLastPayload);

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
  console.info('[useRecommendations] Using lastPayload:');
  console.info('  - categoryToUse:', categoryToUse);
  console.info('  - seedItemsForRequest:', seedItemsForRequest);
  console.info('  - itemNameForRequest:', itemNameForRequest);
      } else {
        seedItemsForRequest = effectiveTags.map(t => ({ externalId: t.externalId ?? null, type: t.type }));
        itemNameForRequest = effectiveTags.map(t => t.title).join(', ');
  console.info('[useRecommendations] Generated from effectiveTags:');
  console.info('  - seedItemsForRequest:', seedItemsForRequest);
  console.info('  - itemNameForRequest:', itemNameForRequest);
      }

  // Usar itemName como clave de cache (más consistente con backend que recibe solo itemName)
  const payloadKey = `${categoryToUse}:${(itemNameForRequest || '').toLowerCase().trim()}`;

      const cached = recommendationsCache.get(payloadKey);
      if (cached && (Date.now() - cached.ts) < REC_CACHE_TTL) {
  console.info('[useRecommendations] Using cached data, cache age:', (Date.now() - cached.ts) / 1000, 'seconds');
        // devolver copia para evitar enlaces mutables
        recommendations.value = cached.data.slice();
        recommendationsLoading.value = false;
        return;
      }
  console.info('[useRecommendations] Cache miss or expired, making API request');
  const url = `${config.public.backend}/api/recommendation/${categoryToUse}`;
  console.info('[useRecommendations] Backend URL:', config.public.backend);
  console.info('[useRecommendations] Full API URL:', url);
      const token = localStorage.getItem('token');

  console.info('[useRecommendations] Token present:', !!token);
      if (!token) {
        console.warn('[useRecommendations] No authentication token found');
      }

      // Guardar el payload para permitir regenerar exactamente la misma petición posteriormente
      lastPayload = { seedItems: seedItemsForRequest.slice(), itemName: itemNameForRequest, category: categoryToUse };

  console.info('[useRecommendations] lastPayload set:', lastPayload);
  console.info('[useRecommendations] Fetching URL:', url);
  console.info('[useRecommendations] Request body:', { itemName: itemNameForRequest });

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ itemName: itemNameForRequest }),
      });

  console.info('[useRecommendations] Response status:', resp.status, resp.statusText);

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        console.error('[useRecommendations] API Error:', errBody);
        throw new Error(errBody.message || `Error ${resp.status}: ${resp.statusText}`);
      }

      const payload = await resp.json().catch(() => ({}));
  console.info('[useRecommendations] API Response payload:', payload);
  console.info('[useRecommendations] Payload keys:', Object.keys(payload));
  console.info('[useRecommendations] Payload type:', typeof payload);

  const raw: any[] = payload[categoryToUse] || payload[`${categoryToUse}s`] || [];
  console.info('[useRecommendations] Raw items found:', raw.length, 'for category:', categoryToUse);
  console.info('  - payload keys:', Object.keys(payload));
  console.info('  - raw items sample:', raw.slice(0, 3));
  console.info('  - first raw item keys:', raw.length > 0 ? Object.keys(raw[0]) : 'no items');

      // Mapear sólo los campos que usamos en la UI para reducir trabajo del renderer
      const mapped: RecommendationItem[] = (raw || []).map((item: any) => ({
        title: item.title || item.name || '',
        type: item.type || categoryToUse,
        coverUrl: item.coverUrl || item.image || item.poster_path || null,
        externalSource: item.externalSource || item.source || '',
        externalId: item.externalId || item.id || item._id || null,
        externalUrl: item.externalUrl || item.url || '',
        description: item.description || item.overview || '',
        releaseDate: item.releaseDate || item.release_date || item.year || '',
        avgRating: item.avgRating ?? item.vote_average ?? item.rating ?? 0,
      }));

  console.info('[useRecommendations] Mapped items:', mapped.length);
  console.info('  - mapped sample:', mapped.slice(0, 2));

      recommendations.value = mapped;
      console.info('[useRecommendations] Recommendations updated with', mapped.length, 'items');
      console.info('[useRecommendations] Current recommendations.value:', recommendations.value);

      // Si no hay resultados, informar al UI para mostrar la opción de reintentar
      if (!mapped || mapped.length === 0) {
        console.info('[useRecommendations] No recommendations returned by API for this request');
        recommendationsError.value = 'No se encontraron recomendaciones para los criterios seleccionados.';
      }

      try { 
        recommendationsCache.set(payloadKey, { ts: Date.now(), data: mapped.slice() });
  console.info('[useRecommendations] Cached data for key:', payloadKey);
      } catch (e) { 
        console.warn('[useRecommendations] Cache error:', e);
      }
    } catch (error: any) {
  console.error('[useRecommendations] Error occurred:', error);
  console.error('[useRecommendations] Error message:', error?.message);
  console.error('[useRecommendations] Error stack:', error?.stack);
  console.error('[useRecommendations] Error type:', error?.constructor?.name);
  console.error('[useRecommendations] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      recommendationsError.value = error?.message || 'Ocurrió un error inesperado.';
    } finally {
  console.info('[useRecommendations] Request finished, loading set to false');
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