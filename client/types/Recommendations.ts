interface SearchSuggestion {
  title: string;
  coverUrl?: string | null;
  type?: string;
  externalId?: string;
}

interface RecommendationItem {
  type: string;
  externalSource: string;
  title: string;
  description?: string | null;
  coverUrl?: string | null;
  releaseDate?: string | null;
  externalId: string;
  avgRating?: number | null;
  externalUrl?: string | null;
}

export type { SearchSuggestion, RecommendationItem };