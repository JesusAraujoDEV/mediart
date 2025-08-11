export interface User {
  id: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  profilePictureUrl?: string;
  bio?: string;
  followersUsers?: any[];
  followingUsers?: any[];
}
