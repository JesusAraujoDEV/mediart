import { ref } from 'vue';
import { useRoute } from 'vue-router';

export interface StudioItem {
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

export function useItem() {
  const item = ref<StudioItem>({
    id: 0,
    title: 'Cargando...',
    type: 'unknown',
    externalId: '',
    externalSource: '',
    createdAt: '',
    updatedAt: '',
  });

  const isLoading = ref(true);
  const errorMessage = ref<string | null>(null);
  const route = useRoute();
  const config = useRuntimeConfig();

  const fetchItem = async () => {
    isLoading.value = true;
    errorMessage.value = null;

    const itemId = route.params.id;

    if (!itemId) {
      errorMessage.value = 'ID de ítem no proporcionado.';
      isLoading.value = false;
      return;
    }

    try {
      const { data, error } = await useFetch<StudioItem>(
        `${config.public.backend}/api/items/${itemId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (error.value) {
  // item fetch error; logging removed
        throw new Error(
          (error.value as any).data?.message || (error.value as any).message || 'No se pudo cargar el ítem.'
        );
      }

      if (data.value) {
        item.value = data.value as StudioItem;
      } else {
        throw new Error('No se encontró el ítem con el ID proporcionado.');
      }
    } catch (err) {
  // fetchItem exception; logging removed
      errorMessage.value = (err as Error).message || 'Error al cargar el ítem.';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    item,
    isLoading,
    errorMessage,
    fetchItem,
  };
}