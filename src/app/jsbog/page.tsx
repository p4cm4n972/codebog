"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite/client';

interface Exercise {
  $id: string;
  title: string;
  slug: string;
  statement: string;
}

interface ParsedExercise extends Exercise {
  subtitle: string;
  objective: string;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = 'exercises';

function parseExercise(exercise: Exercise): ParsedExercise {
  const lines = exercise.statement.split('\n');

  // Extract subtitle from title line (after '-')
  let subtitle = exercise.title;
  const titleLine = lines.find(line => line.startsWith('# '));
  if (titleLine) {
    const parts = titleLine.split(' - ');
    if (parts.length > 1) {
      subtitle = parts.slice(1).join(' - ').trim();
    }
  }

  // Extract objective (first line after "## Objectif")
  let objective = '';
  const objectifIndex = lines.findIndex(line => line.trim() === '## Objectif');
  if (objectifIndex !== -1 && objectifIndex + 1 < lines.length) {
    // Skip empty lines and get the first non-empty line after "## Objectif"
    for (let i = objectifIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('#')) {
        objective = line;
        break;
      }
    }
  }

  return {
    ...exercise,
    subtitle,
    objective,
  };
}

export default function JsbogMissionSelection() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [exercises, setExercises] = useState<ParsedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchExercises = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError('');
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        const rawExercises = response.documents as Exercise[];
        const parsedExercises = rawExercises.map(parseExercise);
        setExercises(parsedExercises);
      } catch (err: any) {
        console.error('Failed to fetch exercises:', err);
        setError(err.message || 'Failed to load exercises');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-white">
        <p>Loading session...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-green-400 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 font-mono text-shadow-hard animate-pulse">
        == SELECTIONNE_TA_MISSION ==
      </h1>

      {loading ? (
        <div className="text-center text-green-400 font-mono">
          <p>Chargement des missions...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 font-mono border-4 border-red-500 p-8">
          <h2 className="text-3xl font-bold mb-4">ERREUR_SYSTEME</h2>
          <p>IMPOSSIBLE DE CHARGER LES MISSIONS DEPUIS LA BASE.</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      ) : exercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <Link href={`/jsbog/${exercise.slug}`} key={exercise.$id}>
              <div className="group block bg-black border-4 border-green-500 p-6 font-mono transform transition-transform duration-200 hover:-translate-y-2 hover:border-yellow-400 cursor-pointer overflow-hidden">
                <div className="text-green-400 text-sm mb-2 truncate">/{exercise.slug}</div>
                <h2 className="text-2xl font-bold mb-3 text-yellow-400 truncate">{exercise.subtitle}</h2>
                <div className="relative overflow-hidden h-5">
                  <p className="text-green-300 text-sm whitespace-nowrap absolute left-0 top-0 scrolling-text">
                    {exercise.objective}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-yellow-400 font-mono border-4 border-yellow-400 p-8">
          <h2 className="text-3xl font-bold mb-4">AUCUNE_MISSION_DISPONIBLE</h2>
          <p>Les missions seront bientôt disponibles.</p>
          <p className="mt-4 text-green-400">Bienvenue dans le BOG, {user.name}!</p>
        </div>
      )}
    </div>
  );
}