import type { RecommendationItem } from './Recommendations'; // Asegúrate de que la ruta sea correcta

export interface Playlist {
  id: number;
  ownerUserId: number;
  name: string;
  description: string | null;
  isCollaborative: boolean;
  createdAt: string;
  updatedAt: string;
  owner_user_id: number; // Mantenemos si viene así del backend
  Library: {
    savedAt: string;
  };
  items: RecommendationItem[];
}