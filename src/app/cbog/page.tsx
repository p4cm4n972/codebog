"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite/client';
import { Query } from 'appwrite';

interface CExercise {
  $id: string;
  slug: string;
  title: string;
  week: string;
  day: string;
  statement: string;
  order: number;
}

interface ParsedExercise extends CExercise {
  objective: string;
  completed: boolean;
}

interface Submission {
  exerciseSlug: string;
  passed: boolean;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const C_EXERCISES_COLLECTION_ID = 'c-exercises';
const C_SUBMISSIONS_COLLECTION_ID = 'c-submissions';

function parseExercise(exercise: CExercise, completedSlugs: Set<string>): ParsedExercise {
  const lines = exercise.statement.split('\n');

  // Extract objective (first meaningful line after ## Objectif)
  let objective = '';
  const objectifIndex = lines.findIndex(line => line.includes('## Objectif'));
  if (objectifIndex !== -1) {
    for (let i = objectifIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('#') && !line.startsWith('```')) {
        objective = line;
        break;
      }
    }
  }

  return {
    ...exercise,
    objective,
    completed: completedSlugs.has(exercise.slug),
  };
}

// Group exercises by week and day
function groupExercises(exercises: ParsedExercise[]): Map<string, Map<string, ParsedExercise[]>> {
  const grouped = new Map<string, Map<string, ParsedExercise[]>>();

  for (const exercise of exercises) {
    if (!grouped.has(exercise.week)) {
      grouped.set(exercise.week, new Map());
    }
    const weekMap = grouped.get(exercise.week)!;
    if (!weekMap.has(exercise.day)) {
      weekMap.set(exercise.day, []);
    }
    weekMap.get(exercise.day)!.push(exercise);
  }

  return grouped;
}

export default function CbogMissionSelection() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [exercises, setExercises] = useState<ParsedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedWeek, setExpandedWeek] = useState<string | null>('Semaine1');

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
          databases.listDocuments(DATABASE_ID, C_EXERCISES_COLLECTION_ID, [
            Query.orderAsc('order'),
            Query.limit(100),
          ]),
          databases.listDocuments(DATABASE_ID, C_SUBMISSIONS_COLLECTION_ID, [
            Query.equal('userId', user.$id),
            Query.equal('passed', true),
          ]),
        ]);

        // Create a set of completed exercise slugs
        const completedSlugs = new Set<string>(
          (submissionsResponse.documents as unknown as Submission[]).map(s => s.exerciseSlug)
        );

        const rawExercises = exercisesResponse.documents as unknown as CExercise[];
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-blue-400">
        <svg className="animate-spin h-10 w-10 mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p>Chargement de la session...</p>
      </div>
    );
  }

  const groupedExercises = groupExercises(exercises);
  const completedCount = exercises.filter(e => e.completed).length;
  const totalCount = exercises.length;

  // Calculate current week based on completion
  const getCurrentWeek = () => {
    const weeks = Array.from(groupedExercises.keys()).sort();
    for (const week of weeks) {
      const days = groupedExercises.get(week)!;
      const weekExercises = Array.from(days.values()).flat();
      const allCompleted = weekExercises.every(e => e.completed);
      if (!allCompleted) return week;
    }
    return weeks[weeks.length - 1] || 'Semaine1';
  };

  return (
    <div className="container mx-auto px-4 py-8 text-blue-400 min-h-screen">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-mono text-shadow-hard mb-4">
          <span className="text-cyan-400">CBOG</span> <span className="text-blue-300">LE MARÉCAGE C</span>
        </h1>
        <p className="text-xl text-blue-300 font-mono mb-2">
          4 semaines à patauger dans le C
        </p>
        <p className="text-sm text-blue-400/70 max-w-2xl mx-auto">
          Un exercice par jour, chaque jour pendant 4 semaines. Bienvenue dans le marécage.
        </p>
      </div>

      {/* Bog Timeline - 4 Weeks Visual */}
      {!loading && exercises.length > 0 && (
        <div className="mb-8 p-6 bg-black border-2 border-blue-700 rounded-lg">
          <h2 className="text-sm text-cyan-400 font-mono mb-6 text-center uppercase tracking-wider">
            Traversée du Marécage
          </h2>
          <div className="relative flex justify-between items-center">
            {/* Connecting line behind circles */}
            <div className="absolute top-6 left-[12%] right-[12%] h-1 bg-blue-800 hidden md:block" />

            {[1, 2, 3, 4].map((weekNum) => {
              const weekKey = `Semaine${weekNum}`;
              const weekData = groupedExercises.get(weekKey);
              const weekExercises = weekData ? Array.from(weekData.values()).flat() : [];
              const weekCompleted = weekExercises.filter(e => e.completed).length;
              const weekTotal = weekExercises.length;
              const progress = weekTotal > 0 ? (weekCompleted / weekTotal) * 100 : 0;
              const isCurrentWeek = getCurrentWeek() === weekKey;
              const isComplete = progress === 100;

              return (
                <div key={weekNum} className="flex flex-col items-center z-10">
                  {/* Week Circle */}
                  <div
                    className={`relative w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${
                      isComplete
                        ? 'border-blue-400 bg-blue-900'
                        : isCurrentWeek
                          ? 'border-cyan-400 bg-gray-900 animate-pulse'
                          : 'border-blue-700 bg-gray-900'
                    }`}
                  >
                    {isComplete ? (
                      <span className="text-blue-400 text-xl">✓</span>
                    ) : (
                      <span className={`font-bold text-lg ${isCurrentWeek ? 'text-cyan-400' : 'text-blue-500'}`}>
                        S{weekNum}
                      </span>
                    )}
                  </div>
                  {/* Progress bar under circle */}
                  <div className="w-12 h-1 bg-blue-900 mt-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {/* Week Label */}
                  <span className={`text-xs mt-1 font-mono ${isCurrentWeek ? 'text-cyan-400' : 'text-blue-500'}`}>
                    {weekCompleted}/{weekTotal}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-blue-400 font-mono">
          <svg className="animate-spin h-12 w-12 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-lg">Chargement des missions C...</p>
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
          <div className="mb-8 p-6 bg-black border-4 border-blue-500 font-mono">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl text-cyan-400">PROGRESSION</h2>
                <p className="text-xs text-blue-400/70 mt-1">
                  {Math.round((completedCount / totalCount) * 100)}% du marécage traversé
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-blue-400">{completedCount}</span>
                  <span className="text-xs text-blue-500">exercices</span>
                </div>
                <span className="text-blue-600">/</span>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-cyan-400">{totalCount}</span>
                  <span className="text-xs text-blue-500">total</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-800 h-6 border-2 border-blue-700">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
                style={{
                  width: `${(completedCount / totalCount) * 100}%`,
                }}
              />
            </div>
            <p className="mt-3 text-sm text-blue-300">
              {completedCount === totalCount
                ? '🎉 FÉLICITATIONS ! Tu as traversé le marécage C !'
                : completedCount === 0
                  ? '🐊 Prêt à patauger ? Commence par la Semaine 1, Jour 1 !'
                  : `🐊 Continue d'avancer ! ${totalCount - completedCount} exercice(s) avant la sortie du marécage.`}
            </p>
          </div>

          {/* Weeks Accordion */}
          <div className="space-y-4">
            {Array.from(groupedExercises.entries()).sort().map(([week, days]) => {
              const weekExercises = Array.from(days.values()).flat();
              const weekCompleted = weekExercises.filter(e => e.completed).length;
              const weekTotal = weekExercises.length;
              const isExpanded = expandedWeek === week;

              return (
                <div key={week} className="bg-black border-4 border-blue-500">
                  {/* Week Header */}
                  <button
                    onClick={() => setExpandedWeek(isExpanded ? null : week)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-blue-900/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-cyan-400">{week.replace('Semaine', 'SEMAINE ')}</span>
                      <span className="text-blue-300">
                        {weekCompleted}/{weekTotal} missions
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Mini progress bar */}
                      <div className="w-24 h-2 bg-gray-800 border border-blue-700">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${(weekCompleted / weekTotal) * 100}%` }}
                        />
                      </div>
                      <svg
                        className={`w-6 h-6 text-blue-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Week Content */}
                  {isExpanded && (
                    <div className="border-t-2 border-blue-700 p-4">
                      {Array.from(days.entries()).sort().map(([day, dayExercises]) => (
                        <div key={day} className="mb-6 last:mb-0">
                          <h3 className="text-lg font-bold text-yellow-400 mb-3 uppercase">
                            {day.replace('jour', 'Jour ').replace(/_/g, ' ')}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {dayExercises.map((exercise) => (
                              <Link href={`/cbog/${exercise.slug}`} key={exercise.$id}>
                                <div className={`group block bg-gray-900 border-2 ${exercise.completed ? 'border-blue-400' : 'border-blue-600'} p-4 font-mono transform transition-transform duration-200 hover:-translate-y-1 hover:border-cyan-400 cursor-pointer overflow-hidden relative`}>
                                  {/* Completion Badge */}
                                  {exercise.completed && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                      <span className="text-black text-sm font-bold">✓</span>
                                    </div>
                                  )}
                                  <div className="text-blue-400 text-xs mb-1 truncate font-mono">/{exercise.slug}</div>
                                  <h4 className="text-lg font-bold text-cyan-400 truncate">{exercise.title}</h4>
                                  <p className="text-blue-300 text-sm mt-2 line-clamp-2">{exercise.objective}</p>
                                  {exercise.completed && (
                                    <div className="mt-2 text-xs text-blue-400 uppercase tracking-wider">
                                      Mission accomplie
                                    </div>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center text-yellow-400 font-mono border-4 border-yellow-400 p-8">
          <h2 className="text-3xl font-bold mb-4">AUCUNE_MISSION_DISPONIBLE</h2>
          <p>Les missions C seront bientôt disponibles.</p>
          <p className="mt-4 text-blue-400">Bienvenue dans le BOG, {user.name}!</p>
        </div>
      )}
    </div>
  );
}
