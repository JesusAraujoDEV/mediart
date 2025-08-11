// Define interfaces for each item type to ensure type safety
interface Song {
  id: string;
  title: string;
  artist_name: string;
  album_name: string;
  release_date: string;
  thumbnail_url: string;
  external_url: string;
}

interface Artist {
  id: string;
  name: string;
  genres: string[];
  followers: number;
  image_url: string;
  external_url: string;
}

interface Album {
  id: string;
  name: string;
  artist_name: string;
  release_date: string;
  thumbnail_url: string;
  external_url: string;
}

// Union type for possible item details
type ItemDetails = Song | Artist | Album | null;

export type { Song, Artist, Album, ItemDetails };
