export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface UserProfile extends User {
  createdAt: string;
  favoriteGames: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  defaultLottery: string | null;
  notifications: boolean;
}
