import { Models } from 'appwrite';

// User roles
export type UserRole = 'user' | 'moderator' | 'admin';

export interface UserPreferences extends Models.Preferences {
  role?: UserRole;
}

export interface ExerciseDocument extends Models.Document {
  title: string;
  slug: string;
  statement: string;
  starterCode?: string;
}
