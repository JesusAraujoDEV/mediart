import { ref, computed } from 'vue';
import type { SearchSuggestion } from '~/types/Recommendations';

type AbortOrNull = AbortController | null;

export function useSuggestions(config = useRuntimeConfig()) {
  // State
  const inputValue = ref('');
  const selectedTags = ref<SearchSuggestion[]>([]);
  const suggestions = ref<SearchSuggestion[]>([]);
  const showDatalist = ref(false);
  const searchType = ref<string>('general');

  let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
  let abortController: AbortOrNull = null;

  // Computed
  const filteredSuggestions = computed(() => {
    if (!inputValue.value && suggestions.value.length === 0) return [];

    // No filter by input, just exclude already selected and limit
    if (!inputValue.value.trim()) {
      return suggestions.value
        .filter((s) => !selectedTags.value.some((t) => t.title === s.title))
        .slice(0, 10);
    }

    const q = inputValue.value.toLowerCase().trim();
    return suggestions.value
      .filter((s) => {
        const titleMatches = s.title.toLowerCase().includes(q);
        const descriptionMatches =
          s.description && s.description.toLowerCase().includes(q);
        const notSelected = !selectedTags.value.some((t) => t.title === s.title);
        return (titleMatches || descriptionMatches) && notSelected;
      })
      .slice(0, 10);
  });

  // Helpers
  const getSearchPlaceholder = () => {
    switch (searchType.value) {
      case 'song':
        return 'Escribe el nombre de una canción...';
      case 'artist':
        return 'Escribe el nombre de un artista...';
      case 'album':
        return 'Escribe el nombre de un álbum...';
      case 'movie':
        return 'Escribe el nombre de una película...';
      case 'tvshow':
        return 'Escribe el nombre de una serie...';
      case 'book':
        return 'Escribe el nombre de un libro...';
      case 'videogame':
        return 'Escribe el nombre de un videojuego...';
      case 'general':
      default:
        return 'Escribe tu consulta aquí...';
    }
  };

  // API
  const fetchSuggestions = async (query: string) => {
    // Cancel previous
    if (abortController) abortController.abort();
    abortController = new AbortController();
    const signal = abortController.signal;

    if (query.length < 2) {
      suggestions.value = [];
      abortController = null;
      return;
    }

    const url = `${config.public.backend}/api/search?q=${encodeURIComponent(
      query
    )}&type=${encodeURIComponent(searchType.value)}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        signal,
      });

      if (signal.aborted) return;
      if (!response.ok) throw new Error(`Error de red: ${response.statusText}`);

      const data = await response.json();

      const list: SearchSuggestion[] = [];

      switch (searchType.value) {
        case 'song':
          if (Array.isArray(data.songs)) {
            list.push(
              ...data.songs.map((item: any) => ({
                title: item.title,
                coverUrl: item.coverUrl ?? item.thumbnail_url ?? null,
                type: item.type ?? 'song',
                externalId: (item.externalId ?? item.id)?.toString(),
                description:
                  item.description ??
                  (item.artist_name && item.album_name
                    ? `${item.artist_name} - ${item.album_name}`
                    : null),
              }))
            );
          }
          break;

        case 'movie':
          if (Array.isArray(data.movies)) {
            list.push(
              ...data.movies.map((item: any) => ({
                title: item.title,
                coverUrl: item.coverUrl ?? item.poster_url ?? null,
                type: item.type ?? 'movie',
                externalId: (item.externalId ?? item.id)?.toString(),
                description: item.description ?? item.overview ?? null,
              }))
            );
          }
          break;

        case 'tvshow':
          if (Array.isArray(data.tvshows)) {
            list.push(
              ...data.tvshows.map((item: any) => ({
                title: item.title ?? item.name,
                coverUrl: item.coverUrl ?? item.poster_url ?? null,
                type: item.type ?? 'tvshow',
                externalId: (item.externalId ?? item.id)?.toString(),
                description: item.description ?? item.overview ?? null,
              }))
            );
          }
          break;

        case 'artist':
          if (Array.isArray(data.artists)) {
            list.push(
              ...data.artists.map((item: any) => ({
                title: item.title ?? item.name,
                coverUrl: item.coverUrl ?? item.image_url ?? null,
                type: item.type ?? 'artist',
                externalId: (item.externalId ?? item.id)?.toString(),
                description: item.description ?? null,
              }))
            );
          }
          break;

        case 'album':
          if (Array.isArray(data.albums)) {
            list.push(
              ...data.albums.map((item: any) => ({
                title: item.title ?? item.name,
                coverUrl: item.coverUrl ?? item.thumbnail_url ?? null,
                type: item.type ?? 'album',
                externalId: (item.externalId ?? item.id)?.toString(),
                description: item.description ?? item.artist_name ?? null,
              }))
            );
          }
          break;

        case 'book':
          if (Array.isArray(data.books)) {
            list.push(
              ...data.books.map((item: any) => ({
                title: item.title ?? item.name,
                coverUrl: item.coverUrl ?? item.thumbnail_url ?? null,
                type: item.type ?? 'book',
                externalId: (item.externalId ?? item.id)?.toString(),
                description: item.description ?? null,
              }))
            );
          }
          break;

        case 'videogame':
          if (Array.isArray(data.videogames)) {
            list.push(
              ...data.videogames.map((item: any) => ({
                title: item.title ?? item.name,
                coverUrl: item.coverUrl ?? item.cover_url ?? null,
                type: item.type ?? 'videogame',
                externalId: (item.externalId ?? item.id)?.toString(),
                description: item.description ?? null,
              }))
            );
          }
          break;

        case 'general':
        default:
          if (Array.isArray(data.movies)) {
            list.push(
              ...data.movies.map((item: any) => ({
                title: item.title,
                coverUrl: item.coverUrl ?? item.poster_url ?? null,
                type: item.type ?? 'movie',
                externalId: (item.externalId ?? item.id)?.toString(),
                description: item.description ?? item.overview ?? null,
              }))
            );
          }
          if (Array.isArray(data.tvshows)) {
            list.push(
              ...data.tvshows.map((item: any) => ({
                title: item.title ?? item.name,
                coverUrl: item.coverUrl ?? item.poster_url ?? null,
                type: item.type ?? 'tvshow',
                externalId: (item.externalId ?? item.id)?.toString(),
                description: item.description ?? item.overview ?? null,
              }))
            );
          }
          if (Array.isArray(data.songs)) {
            list.push(
              ...data.songs.map((item: any) => ({
                title: item.title,
                coverUrl: item.coverUrl ?? item.thumbnail_url ?? null,
                type: item.type ?? 'song',
                externalId: (item.externalId ?? item.id)?.toString(),
                description:
                  item.description ??
                  (item.artist_name && item.album_name
                    ? `${item.artist_name} - ${item.album_name}`
                    : null),
              }))
            );
          }
          if (Array.isArray(data.artists)) {
            list.push(
              ...data.artists.map((item: any) => ({
                title: item.title ?? item.name,
                coverUrl: item.coverUrl ?? item.image_url ?? null,
                type: item.type ?? 'artist',
                externalId: (item.externalId ?? item.id)?.toString(),
                description: item.description ?? null,
              }))
            );
          }
          if (Array.isArray(data.albums)) {
            list.push(
              ...data.albums.map((item: any) => ({
                title: item.title ?? item.name,
                coverUrl: item.coverUrl ?? item.thumbnail_url ?? null,
                type: item.type ?? 'album',
                externalId: (item.externalId ?? item.id)?.toString(),
                description: item.description ?? item.artist_name ?? null,
              }))
            );
          }
          if (Array.isArray(data.books)) {
            list.push(
              ...data.books.map((item: any) => ({
                title: item.title ?? item.name,
                coverUrl: item.coverUrl ?? item.thumbnail_url ?? null,
                type: item.type ?? 'book',
                externalId: (item.externalId ?? item.id)?.toString(),
                description: item.description ?? null,
              }))
            );
          }
          if (Array.isArray(data.videogames)) {
            list.push(
              ...data.videogames.map((item: any) => ({
                title: item.title ?? item.name,
                coverUrl: item.coverUrl ?? item.cover_url ?? null,
                type: item.type ?? 'videogame',
                externalId: (item.externalId ?? item.id)?.toString(),
                description: item.description ?? null,
              }))
            );
          }
          break;
      }

      // Dedup by title+description and exclude already selected
      const unique = new Map<string, SearchSuggestion>();
      for (const s of list) {
        const key = s.description ? `${s.title} - ${s.description}` : s.title;
        if (!selectedTags.value.some((t) => t.title === s.title)) {
          unique.set(key, s);
        }
      }
      suggestions.value = Array.from(unique.values());
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('Error al obtener sugerencias:', err);
      suggestions.value = [];
    } finally {
      abortController = null;
    }
  };

  // Events
  const onInput = () => {
    showDatalist.value = true;
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      fetchSuggestions(inputValue.value);
    }, 500);
  };

  const selectSuggestion = (suggestion: SearchSuggestion) => {
    if (!selectedTags.value.some((t) => t.title === suggestion.title)) {
      selectedTags.value.push(suggestion);
    }
    inputValue.value = '';
    showDatalist.value = false;
    suggestions.value = [];
  };

  const addTagFromInput = () => {
    const exact = filteredSuggestions.value.find(
      (s) => s.title.toLowerCase() === inputValue.value.toLowerCase()
    );

    if (exact && !selectedTags.value.some((t) => t.title === exact.title)) {
      selectedTags.value.push(exact);
    } else if (
      inputValue.value.trim() &&
      !selectedTags.value.some((t) => t.title === inputValue.value.trim())
    ) {
      selectedTags.value.push({
        title: inputValue.value.trim(),
        coverUrl: null,
        type: 'custom',
        externalId: undefined,
      });
    }
    inputValue.value = '';
    showDatalist.value = false;
    suggestions.value = [];
  };

  const removeTag = (tag: SearchSuggestion) => {
    selectedTags.value = selectedTags.value.filter((t) => t.title !== tag.title);
  };

  const focusInput = (el?: HTMLInputElement | null) => {
    el?.focus();
    if (inputValue.value.length > 0 || suggestions.value.length > 0) {
      showDatalist.value = true;
    }
  };

  const hideDatalist = () => {
    setTimeout(() => {
      showDatalist.value = false;
    }, 100);
  };

  const onChangeSearchType = () => {
    suggestions.value = [];
    showDatalist.value = false;
    if (debounceTimeout) clearTimeout(debounceTimeout);
    if (inputValue.value.length >= 2) {
      debounceTimeout = setTimeout(() => {
        fetchSuggestions(inputValue.value);
      }, 300);
    }
  };

  return {
    // state
    inputValue,
    selectedTags,
    suggestions,
    showDatalist,
    searchType,

    // computed
    filteredSuggestions,

    // methods
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
}