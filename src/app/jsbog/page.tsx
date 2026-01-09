"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite/client';
import { Query } from 'appwrite';

interface Exercise {
  $id: string;
  title: string;
  slug: string;
  statement: string;
}

interface ParsedExercise extends Exercise {
  subtitle: string;
  objective: string;
  completed: boolean;
}

interface Submission {
  exerciseSlug: string;
  passed: boolean;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = 'exercises';
const SUBMISSIONS_COLLECTION_ID = 'submissions';

function parseExercise(exercise: Exercise, completedSlugs: Set<string>): ParsedExercise {
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
    completed: completedSlugs.has(exercise.slug),
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
    const fetchExercisesAndProgress = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError('');

        // Fetch exercises and user submissions in parallel
        const [exercisesResponse, submissionsResponse] = await Promise.all([
          databases.listDocuments(DATABASE_ID, COLLECTION_ID),
          databases.listDocuments(DATABASE_ID, SUBMISSIONS_COLLECTION_ID, [
            Query.equal('userId', user.$id),
            Query.equal('passed', true),
          ]),
        ]);

        // Create a set of completed exercise slugs
        const completedSlugs = new Set<string>(
          (submissionsResponse.documents as unknown as Submission[]).map(s => s.exerciseSlug)
        );

        const rawExercises = exercisesResponse.documents as unknown as Exercise[];
        const parsedExercises = rawExercises.map(ex => parseExercise(ex, completedSlugs));
        setExercises(parsedExercises);
      } catch (err) {
        console.error('Failed to fetch exercises:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load exercises');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExercisesAndProgress();
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
        <>
          {/* Progress Section */}
          <div className="mb-8 p-6 bg-black border-4 border-green-500 font-mono">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-yellow-400">PROGRESSION</h2>
              <span className="text-2xl font-bold text-green-400">
                {exercises.filter(e => e.completed).length}/{exercises.length}
              </span>
            </div>
            <div className="w-full bg-gray-800 h-6 border-2 border-green-700">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${(exercises.filter(e => e.completed).length / exercises.length) * 100}%`,
                }}
              />
            </div>
            <p className="mt-2 text-sm text-green-300">
              {exercises.filter(e => e.completed).length === exercises.length
                ? '🎉 TOUTES LES MISSIONS COMPLÉTÉES !'
                : `${exercises.length - exercises.filter(e => e.completed).length} mission(s) restante(s)`}
            </p>
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <Link href={`/jsbog/${exercise.slug}`} key={exercise.$id}>
                <div className={`group block bg-black border-4 ${exercise.completed ? 'border-green-400' : 'border-green-500'} p-6 font-mono transform transition-transform duration-200 hover:-translate-y-2 hover:border-yellow-400 cursor-pointer overflow-hidden relative`}>
                  {/* Completion Badge */}
                  {exercise.completed && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-black text-lg font-bold">✓</span>
                    </div>
                  )}
                  <div className="text-green-400 text-sm mb-2 truncate">/{exercise.slug}</div>
                  <h2 className="text-2xl font-bold mb-3 text-yellow-400 truncate">{exercise.subtitle}</h2>
                  <div className="relative overflow-hidden h-5">
                    <p className="text-green-300 text-sm whitespace-nowrap absolute left-0 top-0 scrolling-text">
                      {exercise.objective}
                    </p>
                  </div>
                  {exercise.completed && (
                    <div className="mt-3 text-xs text-green-400 uppercase tracking-wider">
                      Mission accomplie
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
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