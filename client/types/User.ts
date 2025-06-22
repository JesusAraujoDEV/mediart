interface User {
  id: number;
  username: string;
  email: string;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  bio: string;
}

export type { User, UserProfile };