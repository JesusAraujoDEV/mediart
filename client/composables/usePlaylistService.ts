import { useRouter } from 'vue-router';

export const usePlaylistService = () => {
  const router = useRouter();
  const config = useRuntimeConfig();

  const createPlaylist = async (payload: {
    name: string;
    description?: string;
    visibility: 'PUBLIC' | 'PRIVATE';
    items: any[];
  }): Promise<string> => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      throw new Error('No authentication token found');
    }

    // Create playlist
    const resp = await fetch(`${config.public.backend}/api/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: payload.name,
        description: payload.description || '',
        privacy: payload.visibility
      })
    });

    if (!resp.ok) {
      throw new Error('No se pudo crear la playlist');
    }

    const created = await resp.json();
    const playlistId = created.id;

    // Optionally add items if your backend supports it and items contain IDs
    if (payload.items?.length) {
      await fetch(`${config.public.backend}/api/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          trackIds: payload.items.map((it: any) => it.id),
        })
      }).catch(() => { });
    }

    return playlistId;
  };

  return {
    createPlaylist,
  };
}; 