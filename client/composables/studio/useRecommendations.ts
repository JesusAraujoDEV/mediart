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
  const sendData = async (tags?: SearchItem[], options?: { force?: boolean }) => {
  // Si se llama sin argumentos y existe lastPayload, lo reutilizamos exactamente
    const forceRefresh = options?.force ?? false;
    const useLastPayload = typeof tags === 'undefined' && lastPayload !== null;

  

    // Si no estamos reutilizando lastPayload, generamos effectiveTags desde los tags pasados o desde las recomendaciones actuales
    const effectiveTags: SearchItem[] = useLastPayload
      ? []
      : (tags && tags.length > 0)
        ? tags
        : (recommendations.value && recommendations.value.length > 0)
          ? recommendations.value.map(r => ({ title: r.title, externalId: r.externalId, type: r.type }))
          : [];

  

    if (!useLastPayload && (!effectiveTags || effectiveTags.length === 0)) {
      console.warn('[useRecommendations] No effectiveTags and not using lastPayload, showing alert');
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
        // Construir un string formateado y ordenado que incluya metadata por tag dentro de itemName
        const formattedParts = effectiveTags.map(t => {
          const genres = (t as any).genre ?? (t as any).genres ?? null;
          const year = (t as any).year ?? ((t as any).releaseDate ? new Date((t as any).releaseDate).getFullYear() : null);
          const description = (t as any).description ?? '';
          const externalSource = (t as any).externalSource ?? '';
          return `title:${t.title}|type:${t.type || ''}|externalId:${t.externalId ?? ''}|genres:${Array.isArray(genres) ? (genres as any[]).join(',') : (genres ?? '')}|year:${year ?? ''}|description:${description.replace(/\s+/g, ' ').trim()}|source:${externalSource}`;
        });
        // Unir los tags con un separador claro; todo queda dentro de itemName
        itemNameForRequest = formattedParts.join(' || ');
      }

  // Usar itemName como clave de cache (más consistente con backend que recibe solo itemName)
  const payloadKey = `${categoryToUse}:${(itemNameForRequest || '').toLowerCase().trim()}`;

      // Guardar lastPayload antes de consultar la cache para que "regenerar" pueda reutilizarlo
      if (!useLastPayload) {
        try {
          lastPayload = { seedItems: seedItemsForRequest.slice(), itemName: itemNameForRequest, category: categoryToUse };
        } catch (e) {
          // ignore
        }
      }

  const cached = recommendationsCache.get(payloadKey);
      if (!forceRefresh && cached && (Date.now() - cached.ts) < REC_CACHE_TTL) {
        // devolver copia para evitar enlaces mutables
        recommendations.value = cached.data.slice();
        recommendationsLoading.value = false;
        return;
      }
  const url = `${config.public.backend}/api/recommendation/${categoryToUse}`;
      const token = localStorage.getItem('token');

      
      if (!token) {
        console.warn('[useRecommendations] No authentication token found');
      }

      // Guardar el payload para permitir regenerar exactamente la misma petición posteriormente
      lastPayload = { seedItems: seedItemsForRequest.slice(), itemName: itemNameForRequest, category: categoryToUse };

  // (debug logs removed)

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ itemName: itemNameForRequest }),
      });

  // (debug logs removed)

      

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        console.error('[useRecommendations] API Error:', errBody);
        throw new Error(errBody.message || `Error ${resp.status}: ${resp.statusText}`);
      }

      const payload = await resp.json().catch(() => ({}));

  const raw: any[] = payload[categoryToUse] || payload[`${categoryToUse}s`] || [];
      

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

      

  recommendations.value = mapped;
      

      // Si no hay resultados, informar al UI para mostrar la opción de reintentar
      if (!mapped || mapped.length === 0) {
        recommendationsError.value = 'No se encontraron recomendaciones para los criterios seleccionados.';
      }

      try { 
  recommendationsCache.set(payloadKey, { ts: Date.now(), data: mapped.slice() });
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

  // Dev helper: devuelve una copia del último payload enviado (para debug)
  const getLastPayload = () => {
    if (!lastPayload) return null;
    return { seedItems: lastPayload.seedItems.slice(), itemName: lastPayload.itemName, category: lastPayload.category };
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
  getLastPayload,
    removeRecommendation,
    createPlaylist,
  };
};