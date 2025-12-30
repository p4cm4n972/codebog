import Link from 'next/link';
import { databases } from '@/lib/appwrite-server-init';
import { AppwriteException } from 'node-appwrite';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = 'exercises'; // As defined in the sync script

interface Exercise {
  $id: string;
  title: string;
  slug: string;
}

async function getExercises() {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    return response.documents as Exercise[];
  } catch (error) {
    if (error instanceof AppwriteException) {
      console.error('Failed to fetch exercises:', error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
    return []; // Return an empty array on error
  }
}

export default async function JsbogMissionSelection() {
  const exercises = await getExercises();

  return (
    <div className="container mx-auto px-4 py-8 text-green-400">
      <h1 className="text-4xl font-bold text-center mb-8 font-mono text-shadow-hard animate-pulse">
        == SELECTIONNE_TA_MISSION ==
      </h1>

      {exercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <Link href={`/jsbog/${exercise.slug}`} key={exercise.$id}>
              <div className="block bg-black border-4 border-green-500 p-6 text-yellow-400 font-mono transform transition-transform duration-200 hover:-translate-y-2 hover:border-yellow-400 cursor-pointer">
                <h2 className="text-2xl font-bold mb-2">{exercise.title}</h2>
                <p className="text-green-400">/{exercise.slug}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-red-500 font-mono border-4 border-red-500 p-8">
          <h2 className="text-3xl font-bold mb-4">ERREUR_SYSTEME</h2>
          <p>IMPOSSIBLE DE CHARGER LES MISSIONS DEPUIS LA BASE.</p>
          <p>VERIFIEZ LA CONNEXION APPINSTANCE ET LA SYNCHRONISATION.</p>
        </div>
      )}
    </div>
  );
}

// Add this style to globals.css for the text shadow and pulse animation
/*
@layer utilities {
  .text-shadow-hard {
    text-shadow: 2px 2px 0 #000;
  }
}

@keyframes pulse {
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
*/