"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite/client';
import { Query } from 'appwrite';

interface World {
    $id: string;
    slug: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    bgGradient: string;
    totalLevels: number;
    difficulty: string;
}

interface Level {
    $id: string;
    slug: string;
    worldSlug: string;
    title: string;
    order: number;
    xpReward: number;
    difficulty: string;
    statement: string;
}

interface Submission {
    exerciseSlug: string;
    passed: boolean;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const JS_WORLDS_COLLECTION = 'js-worlds';
const JS_LEVELS_COLLECTION = 'js-levels';
const JS_SUBMISSIONS_COLLECTION = 'js-submissions';

const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
    green: { bg: 'bg-green-600', border: 'border-green-500', text: 'text-green-400', gradient: 'from-green-600 to-green-800' },
    purple: { bg: 'bg-purple-600', border: 'border-purple-500', text: 'text-purple-400', gradient: 'from-purple-600 to-purple-800' },
    orange: { bg: 'bg-orange-600', border: 'border-orange-500', text: 'text-orange-400', gradient: 'from-orange-600 to-orange-800' },
    cyan: { bg: 'bg-cyan-600', border: 'border-cyan-500', text: 'text-cyan-400', gradient: 'from-cyan-600 to-cyan-800' },
    yellow: { bg: 'bg-yellow-600', border: 'border-yellow-500', text: 'text-yellow-400', gradient: 'from-yellow-600 to-yellow-800' },
    pink: { bg: 'bg-pink-600', border: 'border-pink-500', text: 'text-pink-400', gradient: 'from-pink-600 to-pink-800' },
    red: { bg: 'bg-red-600', border: 'border-red-500', text: 'text-red-400', gradient: 'from-red-600 to-red-800' },
    amber: { bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-400', gradient: 'from-amber-500 to-yellow-600' },
};

export default function WorldLevelsPage() {
    const { user, isLoading, isAdmin, isModerator } = useAuth();
    const unlockAll = isAdmin || isModerator;
    const router = useRouter();
    const params = useParams();
    const worldSlug = params.slug as string;

    const [world, setWorld] = useState<World | null>(null);
    const [levels, setLevels] = useState<Level[]>([]);
    const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    useEffect(() => {
        const fetchWorldAndLevels = async () => {
            if (!user || !worldSlug) return;

            try {
                setLoading(true);
                setError('');

                // Fetch world, levels and submissions in parallel
                const [worldResponse, levelsResponse, submissionsResponse] = await Promise.all([
                    databases.listDocuments(DATABASE_ID, JS_WORLDS_COLLECTION, [
                        Query.equal('slug', worldSlug),
                        Query.limit(1)
                    ]),
                    databases.listDocuments(DATABASE_ID, JS_LEVELS_COLLECTION, [
                        Query.equal('worldSlug', worldSlug),
                        Query.orderAsc('order'),
                        Query.limit(100)
                    ]),
                    databases.listDocuments(DATABASE_ID, JS_SUBMISSIONS_COLLECTION, [
                        Query.equal('userId', user.$id),
                        Query.equal('passed', true),
                        Query.limit(500)
                    ]).catch(() => ({ documents: [] }))
                ]);

                if (worldResponse.documents.length === 0) {
                    setError('Monde non trouvé');
                    return;
                }

                const worldData = worldResponse.documents[0] as unknown as World;
                const levelsData = levelsResponse.documents as unknown as Level[];
                const submissionsData = submissionsResponse.documents as unknown as Submission[];

                setWorld(worldData);
                setLevels(levelsData);
                setCompletedSlugs(new Set(submissionsData.map(s => s.exerciseSlug)));
            } catch (err) {
                console.error('Failed to fetch world:', err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Failed to load world');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWorldAndLevels();
    }, [user, worldSlug]);

    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-green-400">
                <svg className="animate-spin h-10 w-10 mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p>Chargement...</p>
            </div>
        );
    }

    const colors = world ? COLOR_CLASSES[world.color] || COLOR_CLASSES.green : COLOR_CLASSES.green;
    const completedCount = levels.filter(l => completedSlugs.has(l.slug)).length;
    const progressPercent = levels.length > 0 ? Math.round((completedCount / levels.length) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#0a0f0a] py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Back button */}
                <Link
                    href="/jsbog"
                    className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-6 font-mono"
                >
                    <span>←</span>
                    <span>Retour à la carte</span>
                </Link>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-green-400 font-mono">
                        <svg className="animate-spin h-12 w-12 mb-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-lg">Chargement du monde...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 font-mono border-4 border-red-500 bg-red-500/10 rounded-lg p-8">
                        <h2 className="text-3xl font-bold mb-4">ERREUR</h2>
                        <p>{error}</p>
                    </div>
                ) : world ? (
                    <>
                        {/* World Header */}
                        <div className={`bg-gradient-to-r ${colors.gradient} rounded-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 mb-8`}>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-black/30 rounded-full flex items-center justify-center">
                                    <span className="text-5xl">{world.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-white mb-1">{world.name}</h1>
                                    <p className="text-white/80 text-sm">{world.description}</p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-6">
                                <div className="flex justify-between text-sm text-white/80 mb-2">
                                    <span>{completedCount}/{levels.length} niveaux complétés</span>
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

                        {/* Levels Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {levels.map((level, index) => {
                                const isCompleted = completedSlugs.has(level.slug);
                                // Admins and moderators have all levels unlocked
                                const isLocked = !unlockAll && index > 0 && !completedSlugs.has(levels[index - 1].slug) && !isCompleted;

                                return (
                                    <div
                                        key={level.$id}
                                        className="relative group"
                                    >
                                        {isLocked ? (
                                            <Link href={`/jsbog/level/${level.slug}`}>
                                                <div className={`
                                                    bg-gray-800 border-4 border-purple-500/50 rounded-lg p-4
                                                    flex items-center gap-4
                                                    hover:border-purple-400 hover:bg-gray-700
                                                    transition-all duration-150
                                                    cursor-pointer
                                                `}>
                                                    <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center">
                                                        <span className="text-2xl">🔒</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-gray-500 font-mono text-sm">Niveau {level.order}</div>
                                                        <div className="text-gray-400 font-bold">{level.title}</div>
                                                    </div>
                                                    <div className="text-purple-400 text-sm font-bold">
                                                        💎 Débloquer
                                                    </div>
                                                </div>
                                            </Link>
                                        ) : (
                                            <Link href={`/jsbog/level/${level.slug}`}>
                                                <div className={`
                                                    bg-[#1a2e1a] border-4 ${isCompleted ? 'border-green-500' : colors.border}
                                                    rounded-lg p-4
                                                    flex items-center gap-4
                                                    hover:translate-x-1 hover:translate-y-1
                                                    hover:shadow-none
                                                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                                    transition-all duration-150
                                                    cursor-pointer
                                                `}>
                                                    {/* Level number */}
                                                    <div className={`
                                                        w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                                                        ${isCompleted ? 'bg-green-500 text-white' : `${colors.bg} text-white`}
                                                    `}>
                                                        {isCompleted ? '✓' : level.order}
                                                    </div>

                                                    {/* Level info */}
                                                    <div className="flex-1">
                                                        <div className={`${colors.text} font-mono text-sm`}>
                                                            Niveau {level.order}
                                                        </div>
                                                        <div className="text-white font-bold">{level.title}</div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-yellow-400 text-xs">+{level.xpReward} XP</span>
                                                            {isCompleted && (
                                                                <span className="text-green-400 text-xs">Complété</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Arrow */}
                                                    <div className={`${colors.text} text-2xl group-hover:translate-x-1 transition-transform`}>
                                                        →
                                                    </div>
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {levels.length === 0 && (
                            <div className="text-center text-yellow-400 font-mono border-4 border-yellow-400 bg-yellow-400/10 rounded-lg p-8">
                                <h2 className="text-2xl font-bold mb-4">AUCUN NIVEAU</h2>
                                <p>Les niveaux de ce monde ne sont pas encore configurés.</p>
                            </div>
                        )}
                    </>
                ) : null}
            </div>
        </div>
    );
}
