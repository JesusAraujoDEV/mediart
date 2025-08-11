interface SearchSuggestion {
  title: string;
  description?: string | null;
  coverUrl?: string | null;
  type?: string;
  externalId?: string;
  externalSource?: string;
  externalUrl?: string | null;
  releaseDate?: string | null;
  avgRating?: string | null | number;
}

interface RecommendationItem {
  id: number;
  title: string;
  type: string;
  description: string | null;
  coverUrl: string | null;
  releaseDate: string | null;
  externalId: string;
  externalSource: string;
  avgRating: string | null | number;
  externalUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type { SearchSuggestion, RecommendationItem };
