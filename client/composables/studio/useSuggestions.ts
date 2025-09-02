import { ref, computed, watch, type Ref } from 'vue';

export interface SearchItem {
  title: string;
  type: string;
  coverUrl?: string;
  externalSource?: string;
  description?: string;
  externalId?: string;
  externalUrl?: string;
  [key: string]: any;
}

export const useSuggestions = () => {
  const config = useRuntimeConfig();

  const inputValue = ref('');
  const selectedTags: Ref<SearchItem[]> = ref([]);
  const suggestions: Ref<SearchItem[]> = ref([]);
  const showDatalist = ref(false);
  const searchType = ref('general');

  // Simple cache para mejorar latencia percibida: key = `${type}:${query}`
  const suggestionsCache = new Map<string, { ts: number; data: SearchItem[] }>();
  const CACHE_TTL = 1000 * 60 * 5; // 5 minutos

  const getSearchPlaceholder = () => {
    switch (searchType.value) {
      case 'general': return 'Busca un título (canción, película, etc.)';
      case 'song': return 'Busca una canción...';
      case 'artist': return 'Busca un artista...';
      case 'album': return 'Busca un álbum...';
      case 'movie': return 'Busca una película...';
      case 'tvshow': return 'Busca una serie de TV...';
      case 'book': return 'Busca un libro...';
      case 'videogame': return 'Busca un videojuego...';
      default: return 'Buscar...';
    }
  };

  let debounceHandle: ReturnType<typeof setTimeout> | null = null;
  const fetchSuggestions = async (query: string) => {
    if (!query) return;
    const url = `${config.public.backend}/api/search?q=${encodeURIComponent(query)}&type=${searchType.value}`;
    try {
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!resp.ok) throw new Error("Error fetching suggestions");
      const data = await resp.json();
      // Extraer el array correcto basado en el tipo de búsqueda
      if (searchType.value === 'general') {
        // Si el backend devuelve un array plano (como en el ejemplo), úsalo directamente
        if (Array.isArray(data)) {
          suggestions.value = data as any[];
        } else {
          // Si viene por claves, combinar todas las categorías conocidas
          const keys = ['songs','artists','albums','movies','tvshows','books','videogames'];
          const combined: any[] = [];
          for (const k of keys) {
            if (Array.isArray((data as any)[k])) combined.push(...(data as any)[k]);
          }
          suggestions.value = combined;
        }
      } else {
        // No-general: intenta plural/singular; si llega array plano, filtra por type
        const byKey = (data as any)[searchType.value + 's'] || (data as any)[searchType.value];
        if (Array.isArray(byKey)) {
          suggestions.value = byKey;
        } else if (Array.isArray(data)) {
          suggestions.value = (data as any[]).filter((it: any) => it?.type === searchType.value);
        } else {
          suggestions.value = [];
        }
      }
      // almacenar resultado en cache
      try {
        const key = `${searchType.value}:${query.toLowerCase()}`;
        suggestionsCache.set(key, { ts: Date.now(), data: suggestions.value.slice() });
      } catch (_) {
        // ignore cache errors
      }
    } catch (e) {
      console.error("Error fetching suggestions:", e);
      suggestions.value = [];
    }
  };

  const onInput = () => {
    const q = inputValue.value.trim();
    if (debounceHandle) clearTimeout(debounceHandle);
    if (q.length < 2) {
      suggestions.value = [];
      return;
    }

    const key = `${searchType.value}:${q.toLowerCase()}`;
    const cached = suggestionsCache.get(key);
    if (cached && (Date.now() - cached.ts) < CACHE_TTL) {
      // respuesta inmediata desde cache
      suggestions.value = cached.data.slice();
      showDatalist.value = true;
      return;
    }

    // reducir debounce para mejorar sensación de velocidad
    debounceHandle = setTimeout(() => fetchSuggestions(q), 150);
  };

  const selectSuggestion = (suggestion: SearchItem) => {
    if (!selectedTags.value.some(tag => tag.externalId === suggestion.externalId)) {
      selectedTags.value.push(suggestion);
    }
    inputValue.value = '';
    suggestions.value = [];
    hideDatalist();
  };

  const addTagFromInput = () => {
    const trimmedInput = inputValue.value.trim();
    if (trimmedInput && suggestions.value.length === 0) {
      // Si no hay sugerencias, crea un tag genérico
      const newTag: SearchItem = {
        title: trimmedInput,
        type: searchType.value,
        externalId: `manual-${Date.now()}` // ID único para tags manuales
      };
      selectedTags.value.push(newTag);
      inputValue.value = '';
    } else if (suggestions.value.length > 0) {
      selectSuggestion(suggestions.value[0]);
    }
  };

  const removeTag = (tag: SearchItem) => {
    selectedTags.value = selectedTags.value.filter(t => t.externalId !== tag.externalId);
  };

  const filteredSuggestions = computed(() =>
    suggestions.value.filter(s =>
      s.title.toLowerCase().includes(inputValue.value.toLowerCase()) &&
      !selectedTags.value.some(tag => tag.externalId === s.externalId)
    )
  );

  const focusInput = (el: HTMLInputElement | null) => el?.focus();
  const hideDatalist = () => setTimeout(() => showDatalist.value = false, 150);
  const onChangeSearchType = () => {
    selectedTags.value = [];
    inputValue.value = '';
    suggestions.value = [];
  };

  watch(searchType, () => {
    onChangeSearchType();
  });

  return {
    inputValue,
    selectedTags,
    suggestions,
    showDatalist,
    searchType,
    filteredSuggestions,
    getSearchPlaceholder,
    fetchSuggestions,
    onInput,
    selectSuggestion,
    addTagFromInput,
    removeTag,
    focusInput,
    hideDatalist,
    onChangeSearchType,
  };
};