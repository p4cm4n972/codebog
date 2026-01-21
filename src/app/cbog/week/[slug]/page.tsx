"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
    order: number;
}

interface Submission {
    exerciseSlug: string;
    passed: boolean;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const C_EXERCISES_COLLECTION_ID = 'c-exercises';
const C_SUBMISSIONS_COLLECTION_ID = 'c-submissions';

// Week configurations
const WEEKS_CONFIG: Record<string, { name: string; description: string; icon: string; gradient: string }> = {
    'semaine1': {
        name: 'Semaine 1',
        description: 'Les fondamentaux du C : variables, types, printf, conditions',
        icon: '🌱',
        gradient: 'from-blue-600 to-blue-800',
    },
    'semaine2': {
        name: 'Semaine 2',
        description: 'Boucles, fonctions, tableaux et pointeurs',
        icon: '🌿',
        gradient: 'from-blue-600 to-cyan-800',
    },
    'semaine3': {
        name: 'Semaine 3',
        description: 'Chaînes de caractères, structures et allocation mémoire',
        icon: '🌲',
        gradient: 'from-cyan-600 to-blue-800',
    },
    'semaine4': {
        name: 'Semaine 4',
        description: 'Fichiers, préprocesseur et projets avancés',
        icon: '🏔️',
        gradient: 'from-cyan-600 to-cyan-800',
    },
};

export default function WeekDetailPage() {
    const { user, isLoading, isAdmin, isModerator } = useAuth();
    const unlockAll = isAdmin || isModerator;
    const router = useRouter();
    const params = useParams();
    const weekSlug = params.slug as string;

    const [exercises, setExercises] = useState<CExercise[]>([]);
    const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Get week config
    const weekConfig = WEEKS_CONFIG[weekSlug] || {
        name: 'Semaine',
        description: '',
        icon: '📚',
        gradient: 'from-blue-600 to-blue-800',
    };

    // Convert slug back to database format (semaine1 -> Semaine1)
    const weekDbKey = weekSlug.charAt(0).toUpperCase() + weekSlug.slice(1);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !weekSlug) return;

            try {
                setLoading(true);
                setError('');

                const [exercisesResponse, submissionsResponse] = await Promise.all([
                    databases.listDocuments(DATABASE_ID, C_EXERCISES_COLLECTION_ID, [
                        Query.equal('week', weekDbKey),
                        Query.orderAsc('order'),
                        Query.limit(100),
                    ]),
                    databases.listDocuments(DATABASE_ID, C_SUBMISSIONS_COLLECTION_ID, [
                        Query.equal('userId', user.$id),
                        Query.equal('passed', true),
                        Query.limit(500),
                    ]).catch(() => ({ documents: [] })),
                ]);

                if (exercisesResponse.documents.length === 0) {
                    setError('Aucun exercice trouvé pour cette semaine');
                    return;
                }

                setExercises(exercisesResponse.documents as unknown as CExercise[]);
                setCompletedSlugs(new Set(
                    (submissionsResponse.documents as unknown as Submission[]).map(s => s.exerciseSlug)
                ));
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Erreur lors du chargement');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, weekSlug, weekDbKey]);

    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-blue-400">
                <svg className="animate-spin h-10 w-10 mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p>Chargement...</p>
            </div>
        );
    }

    const completedCount = exercises.filter(e => completedSlugs.has(e.slug)).length;
    const progressPercent = exercises.length > 0 ? Math.round((completedCount / exercises.length) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#0a0f0a] py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Back button */}
                <Link
                    href="/cbog"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-cyan-300 mb-6 font-mono"
                >
                    <span>←</span>
                    <span>Retour aux semaines</span>
                </Link>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-blue-400 font-mono">
                        <svg className="animate-spin h-12 w-12 mb-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p>Chargement des exercices...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 font-mono border-4 border-red-500 bg-red-500/10 rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">ERREUR</h2>
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        {/* Week Header */}
                        <div className={`bg-gradient-to-r ${weekConfig.gradient} rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 mb-8`}>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-black/30 rounded-full flex items-center justify-center">
                                    <span className="text-5xl">{weekConfig.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-white mb-1">{weekConfig.name}</h1>
                                    <p className="text-white/80 text-sm">{weekConfig.description}</p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-6">
                                <div className="flex justify-between text-sm text-white/80 mb-2">
                                    <span>{completedCount}/{exercises.length} exercices complétés</span>
                                    <span>{progressPercent}%</span>
                                </div>
                                <div className="h-4 bg-black/30 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white/90 rounded-full transition-all duration-500"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Exercises Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {exercises.map((exercise, index) => {
                                const isCompleted = completedSlugs.has(exercise.slug);
                                // Lock if previous exercise not completed (unless admin/mod)
                                const isLocked = !unlockAll && index > 0 && !completedSlugs.has(exercises[index - 1].slug) && !isCompleted;

                                return (
                                    <div
                                        key={exercise.$id}
                                        className={`relative group ${isLocked ? 'opacity-50' : ''}`}
                                    >
                                        {isLocked ? (
                                            <div className="bg-gray-800 border-4 border-gray-600 rounded-lg p-4 flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                                                    <span className="text-2xl">🔒</span>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500 font-mono text-sm">Exercice {index + 1}</div>
                                                    <div className="text-gray-400 font-bold">{exercise.title}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link href={`/cbog/${exercise.slug}`}>
                                                <div className={`
                                                    bg-[#0a1a2e] border-4 ${isCompleted ? 'border-cyan-500' : 'border-blue-600'}
                                                    rounded-lg p-4
                                                    flex items-center gap-4
                                                    hover:translate-x-1 hover:translate-y-1
                                                    hover:shadow-none
                                                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                                    transition-all duration-150
                                                    cursor-pointer
                                                `}>
                                                    {/* Exercise number */}
                                                    <div className={`
                                                        w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                                                        ${isCompleted ? 'bg-cyan-500 text-white' : 'bg-blue-600 text-white'}
                                                    `}>
                                                        {isCompleted ? '✓' : index + 1}
                                                    </div>

                                                    {/* Exercise info */}
                                                    <div className="flex-1">
                                                        <div className="text-blue-400 font-mono text-sm">
                                                            Exercice {index + 1}
                                                        </div>
                                                        <div className="text-white font-bold">{exercise.title}</div>
                                                        {isCompleted && (
                                                            <span className="text-cyan-400 text-xs">Complété</span>
                                                        )}
                                                    </div>

                                                    {/* Arrow */}
                                                    <div className="text-blue-400 text-2xl group-hover:translate-x-1 transition-transform">
                                                        →
                                                    </div>
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {exercises.length === 0 && (
                            <div className="text-center text-yellow-400 font-mono border-4 border-yellow-400 bg-yellow-400/10 rounded-lg p-8">
                                <h2 className="text-2xl font-bold mb-4">AUCUN EXERCICE</h2>
                                <p>Les exercices de cette semaine ne sont pas encore configurés.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
