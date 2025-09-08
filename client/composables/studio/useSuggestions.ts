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
  const isLoadingSuggestions = ref(false);

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
    if (!query) {
      isLoadingSuggestions.value = false;
      return;
    }

    try {
      const url = `${config.public.backend}/api/search?q=${encodeURIComponent(query)}&type=${searchType.value}`;
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!resp.ok) throw new Error("Error fetching suggestions");

      const data = await resp.json();

      // Procesar datos según el tipo de búsqueda
      let processedSuggestions: SearchItem[] = [];

      if (searchType.value === 'general') {
        if (Array.isArray(data)) {
          processedSuggestions = data as SearchItem[];
        } else {
          const keys = ['songs','artists','albums','movies','tvshows','books','videogames'];
          for (const k of keys) {
            if (Array.isArray((data as any)[k])) {
              processedSuggestions.push(...(data as any)[k]);
            }
          }
        }
      } else {
        const byKey = (data as any)[searchType.value + 's'] || (data as any)[searchType.value];
        if (Array.isArray(byKey)) {
          processedSuggestions = byKey;
        } else if (Array.isArray(data)) {
          processedSuggestions = (data as any[]).filter((it: any) => it?.type === searchType.value);
        }
      }

      suggestions.value = processedSuggestions;

      // Actualizar estado del dropdown
      showDatalist.value = processedSuggestions.length > 0;

      // Almacenar en cache
      try {
        const key = `${searchType.value}:${query.toLowerCase()}`;
        suggestionsCache.set(key, { ts: Date.now(), data: processedSuggestions.slice() });
      } catch (_) {
        // Ignorar errores de cache
      }

    } catch (e) {
      // error fetching suggestions; logging removed
      suggestions.value = [];
      showDatalist.value = false;
    } finally {
      isLoadingSuggestions.value = false;
    }
  };

  const onInput = () => {
    const q = inputValue.value.trim();

    // Limpiar timeout anterior
    if (debounceHandle) clearTimeout(debounceHandle);

    if (q.length < 2) {
      suggestions.value = [];
      showDatalist.value = false;
      isLoadingSuggestions.value = false;
      return;
  }

    // Verificar cache primero para respuesta inmediata
    const key = `${searchType.value}:${q.toLowerCase()}`;
    const cached = suggestionsCache.get(key);
    if (cached && (Date.now() - cached.ts) < CACHE_TTL) {
      suggestions.value = cached.data.slice();
      showDatalist.value = true;
      isLoadingSuggestions.value = false;
      return;
    }

    // Mostrar loading state inmediatamente
    isLoadingSuggestions.value = true;
    showDatalist.value = true;

    // Reducir debounce para mejor sensación de velocidad
    debounceHandle = setTimeout(() => fetchSuggestions(q), 100);
  };

  const selectSuggestion = (suggestion: SearchItem) => {
    // Limpiar timeout para evitar conflictos
    if (debounceHandle) clearTimeout(debounceHandle);

    if (!selectedTags.value.some(tag => tag.externalId === suggestion.externalId)) {
      selectedTags.value.push(suggestion);
    }

    // Limpiar estado inmediatamente
    inputValue.value = '';
    suggestions.value = [];
    showDatalist.value = false;
    isLoadingSuggestions.value = false;
  };

  const addTagFromInput = () => {
    const trimmedInput = inputValue.value.trim();
    if (trimmedInput && suggestions.value.length === 0 && !isLoadingSuggestions.value) {
      // Si no hay sugerencias y no está cargando, crea un tag genérico
      const newTag: SearchItem = {
        title: trimmedInput,
        type: searchType.value,
        externalId: `manual-${Date.now()}` // ID único para tags manuales
      };
      selectedTags.value.push(newTag);
      inputValue.value = '';
      showDatalist.value = false;
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

  // Optimizar hideDatalist para evitar conflictos con clics
  const hideDatalist = () => {
    // Pequeño delay para permitir que los clics se procesen
    setTimeout(() => {
      if (!isLoadingSuggestions.value) {
        showDatalist.value = false;
      }
    }, 200);
  };

  // Nueva función para manejar focus sin delay
  const handleFocus = () => {
    if (inputValue.value.trim().length >= 2 && suggestions.value.length > 0) {
      showDatalist.value = true;
    }
  };

  const onChangeSearchType = () => {
    // Limpiar timeout
    if (debounceHandle) clearTimeout(debounceHandle);

    selectedTags.value = [];
    inputValue.value = '';
    suggestions.value = [];
    showDatalist.value = false;
    isLoadingSuggestions.value = false;
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
    isLoadingSuggestions,
    getSearchPlaceholder,
    fetchSuggestions,
    onInput,
    selectSuggestion,
    addTagFromInput,
    removeTag,
    focusInput,
    hideDatalist,
    handleFocus,
    onChangeSearchType,
  };
};