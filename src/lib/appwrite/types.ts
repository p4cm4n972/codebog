import { Models } from 'appwrite';

export interface ExerciseDocument extends Models.Document {
  title: string;
  slug: string;
  statement: string;
  starterCode?: string;
}
