import { ref, watch, type Ref } from 'vue';
import type { UserProfile } from '~/types/User';
import { useSuggestions } from "~/composables/useSuggestions";

// Interfaz para los resultados de búsqueda genéricos (canciones, películas, etc.)
interface SearchItem {
  id?: string;
  externalId?: string;
  title: string;
  type: string;
  coverUrl?: string;
  description?: string;
  externalUrl?: string;
}

/**
 * Encapsula la lógica de búsqueda general y de usuarios.
 * Se encarga de la gestión de estados, el debounce, y las llamadas a la API.
 */
export const useSearch = () => {
  const config = useRuntimeConfig();

  const users: Ref<UserProfile[]> = ref([]);
  const searchResults: Ref<SearchItem[]> = ref([]);
  
  const isSearching = ref(false);
  const searchMessage = ref<string | null>(null);
  const searchError = ref(false);
  const searchPerformed = ref(false);
  const lastSearchQuery = ref("");

  // Usamos el composable existente para la lógica de sugerencias
  const {
    inputValue: searchQuery,
    searchType,
    getSearchPlaceholder,
    fetchSuggestions,
    suggestions,
  } = useSuggestions();

  let debounceHandle: ReturnType<typeof setTimeout> | null = null;

  const performSearch = async () => {
    const q = searchQuery.value.trim();
    if (!q) {
      resetState();
      return;
    }

    isSearching.value = true;
    searchMessage.value = null;
    searchError.value = false;
    lastSearchQuery.value = q;
    searchPerformed.value = true;
    users.value = [];
    searchResults.value = [];

    try {
      if (searchType.value === "users") {
        await searchForUsers(q);
      } else {
        await searchForGeneralItems(q);
      }
    } catch (e: any) {
      console.error("Error en búsqueda:", e);
      searchError.value = true;
      searchMessage.value = e?.message || "Error al realizar la búsqueda.";
    } finally {
      isSearching.value = false;
    }
  };

  const searchForUsers = async (query: string) => {
    const url = `${config.public.backend}/api/search/users?q=${encodeURIComponent(query)}`;
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No se encontró el token de autenticación.");

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.message || `Error al buscar usuarios: ${resp.statusText}`);
    }

    const data = await resp.json();
    users.value = (Array.isArray(data) ? data : [data]).map((u: any) => ({
      ...u,
      profilePictureUrl: u.profilePictureUrl || '/resources/studio/previewProfile.webp',
      bio: u.bio || 'Sin biografía',
    }));

    if (!users.value.length) {
      searchMessage.value = "No se encontraron usuarios con ese nombre.";
    }
  };

  const searchForGeneralItems = async (query: string) => {
    await fetchSuggestions(query);
    searchResults.value = suggestions.value.map((s: any) => ({
      ...s,
      type: s.type || 'Sin tipo',
    }));
    if (!searchResults.value.length) {
      searchMessage.value = "No se encontraron resultados.";
    }
  };

  const resetState = () => {
    users.value = [];
    searchResults.value = [];
    searchMessage.value = null;
    searchError.value = false;
    isSearching.value = false;
    searchPerformed.value = false;
  };

  const handleSearch = () => performSearch();

  // Watchers para el debounce
  watch(searchQuery, (val) => {
    if (debounceHandle) clearTimeout(debounceHandle);
    if (!val.trim()) {
      resetState();
      return;
    }
    debounceHandle = setTimeout(() => performSearch(), 300);
  });

  watch(searchType, () => {
    if (searchQuery.value.trim().length >= 2) {
      performSearch();
    } else {
      resetState();
    }
  });

  return {
    searchQuery,
    searchType,
    getSearchPlaceholder,
    isSearching,
    searchMessage,
    searchError,
    lastSearchQuery,
    searchPerformed,
    users,
    searchResults,
    handleSearch,
  };
};