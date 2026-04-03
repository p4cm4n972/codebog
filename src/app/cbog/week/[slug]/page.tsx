"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite/client';
import { Query } from 'appwrite';
import UnlockModal from '@/components/UnlockModal';

function asciiBar(percent: number, width = 24): string {
    const filled = Math.round((percent / 100) * width);
    return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function WeekPageSkeleton() {
    return (
        <div className="min-h-screen bg-black font-mono text-green-400 py-8 px-4"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.012) 2px, rgba(0,255,65,0.012) 4px)' }}>
            <div className="container mx-auto max-w-3xl animate-pulse">
                <div className="h-4 w-44 bg-green-900/30 rounded mb-6" />
                <div className="border border-green-800 p-5 mb-8">
                    <div className="h-6 w-48 bg-green-900/30 rounded mb-3" />
                    <div className="h-4 w-full bg-green-900/20 rounded mb-4" />
                    <div className="h-3 w-full bg-green-900/20 rounded" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="border border-green-900 p-3 flex items-center gap-4">
                            <div className="w-8 h-8 bg-green-900/30 rounded" />
                            <div className="flex-1 h-4 bg-green-900/20 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

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

const WEEKS_CONFIG: Record<string, { name: string; description: string; tag: string }> = {
    'semaine1': {
        name: 'SEMAINE_01',
        description: 'Variables, types, printf, conditions',
        tag: 'S1',
    },
    'semaine2': {
        name: 'SEMAINE_02',
        description: 'Boucles, fonctions, tableaux, pointeurs',
        tag: 'S2',
    },
    'semaine3': {
        name: 'SEMAINE_03',
        description: 'Chaînes, structures, allocation mémoire',
        tag: 'S3',
    },
    'semaine4': {
        name: 'SEMAINE_04',
        description: 'Fichiers, préprocesseur, projets avancés',
        tag: 'S4',
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
    const [gemUnlockedSlugs, setGemUnlockedSlugs] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedExercise, setSelectedExercise] = useState<CExercise | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const weekConfig = WEEKS_CONFIG[weekSlug] || {
        name: 'SEMAINE_??',
        description: '',
        tag: '??',
    };

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

                const unlocksPromise = fetch('/api/gems/unlocks?exerciseType=c')
                    .then(res => res.ok ? res.json() : { unlocks: [] })
                    .catch(() => ({ unlocks: [] }));

                const [exercisesResponse, submissionsResponse, unlocksData] = await Promise.all([
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
                    unlocksPromise,
                ]);

                if (exercisesResponse.documents.length === 0) {
                    setError('Aucun exercice trouvé pour cette semaine');
                    return;
                }

                setExercises(exercisesResponse.documents as unknown as CExercise[]);
                setCompletedSlugs(new Set(
                    (submissionsResponse.documents as unknown as Submission[]).map(s => s.exerciseSlug)
                ));
                setGemUnlockedSlugs(new Set(
                    (unlocksData.unlocks || []).map((u: { exerciseSlug: string }) => u.exerciseSlug)
                ));
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('ERR: chargement impossible');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, weekSlug, weekDbKey, refreshKey]);

    const handleUnlocked = useCallback(() => {
        setSelectedExercise(null);
        setRefreshKey(k => k + 1);
    }, []);

    if (isLoading || (user && loading)) {
        return <WeekPageSkeleton />;
    }

    if (!user) return null;

    const completedCount = exercises.filter(e => completedSlugs.has(e.slug)).length;
    const progressPercent = exercises.length > 0 ? Math.round((completedCount / exercises.length) * 100) : 0;

    return (
        <div
            className="min-h-screen bg-black font-mono text-green-400 py-8 px-4"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.012) 2px, rgba(0,255,65,0.012) 4px)' }}
        >
            <div className="container mx-auto max-w-3xl">

                {/* Back link */}
                <Link
                    href="/cbog"
                    className="inline-flex items-center gap-2 text-green-700 hover:text-green-400 mb-6 text-sm transition-colors"
                >
                    ◄ cd ../
                </Link>

                {error ? (
                    <div className="border border-red-500 bg-red-950/20 p-6 text-red-400">
                        <p className="font-bold mb-1">[ERREUR]</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : (
                    <>
                        {/* Week header — terminal banner */}
                        <div className="border border-green-600 bg-green-950/10 p-5 mb-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="text-xs text-green-700 mb-1">
                                        $ cat /piscine-c/{weekSlug}/README.md
                                    </div>
                                    <h1 className="text-2xl font-bold text-green-300 tracking-widest">
                                        {weekConfig.name}
                                        <span className="inline-block w-0.5 h-5 bg-green-400 ml-2 align-middle animate-pulse" />
                                    </h1>
                                    <p className="text-green-700 text-sm mt-1"># {weekConfig.description}</p>
                                </div>
                                <span className="text-xs border border-green-700 text-green-600 px-2 py-1">
                                    [{weekConfig.tag}]
                                </span>
                            </div>

                            {/* Progress */}
                            <div>
                                <div className="flex justify-between text-xs text-green-700 mb-1">
                                    <span>PROGRESSION</span>
                                    <span>{completedCount}/{exercises.length} — {progressPercent}%</span>
                                </div>
                                <div className={`text-sm tracking-wider ${progressPercent === 100 ? 'text-green-400' : 'text-green-700'}`}>
                                    [{asciiBar(progressPercent)}]
                                </div>
                            </div>
                        </div>

                        {/* Exercises — ls style */}
                        <div className="mb-3 text-xs text-green-700">
                            $ ls -la exercices/ &nbsp;({exercises.length} fichiers)
                        </div>
                        <div className="space-y-2">
                            {exercises.map((exercise, index) => {
                                const isCompleted = completedSlugs.has(exercise.slug);
                                const isGemUnlocked = gemUnlockedSlugs.has(exercise.slug);
                                const isLocked = !unlockAll && !isGemUnlocked && index > 0 && !completedSlugs.has(exercises[index - 1].slug) && !isCompleted;
                                const numStr = String(index + 1).padStart(2, '0');

                                if (isLocked) {
                                    return (
                                        <div
                                            key={exercise.$id}
                                            onClick={() => setSelectedExercise(exercise)}
                                            className="border border-green-900 bg-black p-3 flex items-center gap-4 cursor-pointer hover:border-amber-700 hover:bg-amber-950/10 transition-all group"
                                        >
                                            <span className="text-green-900 text-sm w-6">{numStr}</span>
                                            <span className="text-amber-700 text-xs">[LOCK]</span>
                                            <span className="text-green-900 flex-1 text-sm">{exercise.title}</span>
                                            <span className="text-amber-700 text-xs group-hover:text-amber-500 transition-colors">
                                                💎 débloquer
                                            </span>
                                        </div>
                                    );
                                }

                                return (
                                    <Link key={exercise.$id} href={`/cbog/${exercise.slug}`}>
                                        <div className={`
                                            border p-3 flex items-center gap-4 transition-all group
                                            ${isCompleted
                                                ? 'border-green-600 bg-green-950/10 hover:border-green-400'
                                                : 'border-green-900 bg-black hover:border-green-600'
                                            }
                                        `}>
                                            <span className="text-green-700 text-sm w-6">{numStr}</span>
                                            {isCompleted
                                                ? <span className="text-green-400 text-xs">[OK]</span>
                                                : <span className="text-green-800 text-xs">[  ]</span>
                                            }
                                            <span className={`flex-1 text-sm ${isCompleted ? 'text-green-300' : 'text-green-500'}`}>
                                                {exercise.title}
                                            </span>
                                            {isGemUnlocked && !isCompleted && (
                                                <span className="text-purple-500 text-xs">💎</span>
                                            )}
                                            <span className={`text-sm transition-transform group-hover:translate-x-1 ${isCompleted ? 'text-green-600' : 'text-green-800'}`}>
                                                →
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {exercises.length === 0 && (
                            <div className="border border-amber-700 bg-amber-950/10 p-6 text-amber-400 text-sm">
                                <p>[WARN] Aucun exercice configuré pour cette semaine.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedExercise && (
                <UnlockModal
                    isOpen={true}
                    onClose={() => setSelectedExercise(null)}
                    exerciseSlug={selectedExercise.slug}
                    exerciseType="c"
                    exerciseTitle={selectedExercise.title}
                    week={weekSlug}
                    onUnlocked={handleUnlocked}
                />
            )}
        </div>
    );
}
