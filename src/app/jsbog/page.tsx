"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite/client';
import { Query } from 'appwrite';
import WorldMap from '@/components/WorldMap';

interface World {
    $id: string;
    slug: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    bgGradient: string;
    posX: number;
    posY: number;
    order: number;
    totalLevels: number;
    difficulty: string;
    unlockRequirement: string;
}

interface Level {
    $id: string;
    slug: string;
    worldSlug: string;
}

interface Submission {
    exerciseSlug: string;
    passed: boolean;
}

interface WorldProgress {
    worldSlug: string;
    completedLevels: number;
    totalLevels: number;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const JS_WORLDS_COLLECTION = 'js-worlds';
const JS_LEVELS_COLLECTION = 'js-levels';
const JS_SUBMISSIONS_COLLECTION = 'js-submissions';

export default function JsbogWorldMap() {
    const { user, isLoading, isAdmin, isModerator } = useAuth();
    const router = useRouter();
    const [worlds, setWorlds] = useState<World[]>([]);
    const [userProgress, setUserProgress] = useState<WorldProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalXP, setTotalXP] = useState(0);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    useEffect(() => {
        const fetchWorldsAndProgress = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError('');

                // Fetch worlds, levels and submissions in parallel
                const [worldsResponse, levelsResponse, submissionsResponse] = await Promise.all([
                    databases.listDocuments(DATABASE_ID, JS_WORLDS_COLLECTION, [
                        Query.orderAsc('order'),
                        Query.limit(100)
                    ]),
                    databases.listDocuments(DATABASE_ID, JS_LEVELS_COLLECTION, [
                        Query.limit(500)
                    ]),
                    databases.listDocuments(DATABASE_ID, JS_SUBMISSIONS_COLLECTION, [
                        Query.equal('userId', user.$id),
                        Query.equal('passed', true),
                        Query.limit(500)
                    ]).catch(() => ({ documents: [] })) // Handle if collection doesn't exist yet
                ]);

                const worldsData = worldsResponse.documents as unknown as World[];
                const levelsData = levelsResponse.documents as unknown as Level[];
                const submissionsData = submissionsResponse.documents as unknown as Submission[];

                // Calculate progress per world
                const completedSlugs = new Set(submissionsData.map(s => s.exerciseSlug));
                const progressMap = new Map<string, { completed: number; total: number }>();

                // Initialize progress for each world
                worldsData.forEach(world => {
                    progressMap.set(world.slug, { completed: 0, total: world.totalLevels });
                });

                // Count completed levels per world
                levelsData.forEach(level => {
                    if (completedSlugs.has(level.slug)) {
                        const progress = progressMap.get(level.worldSlug);
                        if (progress) {
                            progress.completed++;
                        }
                    }
                });

                // Convert to array
                const progressArray: WorldProgress[] = Array.from(progressMap.entries()).map(
                    ([worldSlug, data]) => ({
                        worldSlug,
                        completedLevels: data.completed,
                        totalLevels: data.total
                    })
                );

                // Calculate total XP (simplified: 100XP per completed level)
                const totalCompleted = progressArray.reduce((sum, p) => sum + p.completedLevels, 0);
                setTotalXP(totalCompleted * 100);

                setWorlds(worldsData);
                setUserProgress(progressArray);
            } catch (err) {
                console.error('Failed to fetch worlds:', err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Failed to load world map');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWorldsAndProgress();
    }, [user]);

    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-green-400">
                <svg className="animate-spin h-10 w-10 mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p>Chargement de la session...</p>
            </div>
        );
    }

    const totalLevels = userProgress.reduce((sum, p) => sum + p.totalLevels, 0);
    const completedLevels = userProgress.reduce((sum, p) => sum + p.completedLevels, 0);
    const progressPercent = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#0a0f0a] py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-green-400 font-mono mb-2">
                        JSBOG
                    </h1>
                    <p className="text-green-300/70 font-mono">
                        JavaScript Bootcamp of Glory
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {/* XP */}
                    <div className="bg-black/50 border-2 border-yellow-500 rounded-lg px-6 py-3 flex items-center gap-3">
                        <span className="text-2xl">⭐</span>
                        <div>
                            <div className="text-yellow-400 font-bold text-xl">{totalXP} XP</div>
                            <div className="text-yellow-400/60 text-xs">Experience</div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="bg-black/50 border-2 border-green-500 rounded-lg px-6 py-3 flex items-center gap-3">
                        <span className="text-2xl">📊</span>
                        <div>
                            <div className="text-green-400 font-bold text-xl">{progressPercent}%</div>
                            <div className="text-green-400/60 text-xs">{completedLevels}/{totalLevels} niveaux</div>
                        </div>
                    </div>

                    {/* Worlds */}
                    <div className="bg-black/50 border-2 border-purple-500 rounded-lg px-6 py-3 flex items-center gap-3">
                        <span className="text-2xl">🌍</span>
                        <div>
                            <div className="text-purple-400 font-bold text-xl">{worlds.length}</div>
                            <div className="text-purple-400/60 text-xs">Mondes</div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-green-400 font-mono">
                        <svg className="animate-spin h-12 w-12 mb-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-lg">Chargement de la carte...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 font-mono border-4 border-red-500 bg-red-500/10 rounded-lg p-8">
                        <h2 className="text-3xl font-bold mb-4">ERREUR_SYSTEME</h2>
                        <p>IMPOSSIBLE DE CHARGER LA CARTE DU MONDE.</p>
                        <p className="mt-2 text-sm">{error}</p>
                        <p className="mt-4 text-yellow-400 text-sm">
                            Astuce: Exécutez d&apos;abord les scripts de setup et sync.
                        </p>
                    </div>
                ) : worlds.length > 0 ? (
                    <>
                        {/* World Map */}
                        <WorldMap worlds={worlds} userProgress={userProgress} unlockAll={isAdmin || isModerator} />

                        {/* Legend / Help */}
                        <div className="mt-8 text-center text-green-400/60 font-mono text-sm">
                            <p>Clique sur un monde pour voir ses niveaux</p>
                            <p className="mt-1">Complete les niveaux pour débloquer les mondes suivants</p>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-yellow-400 font-mono border-4 border-yellow-400 bg-yellow-400/10 rounded-lg p-8">
                        <h2 className="text-3xl font-bold mb-4">CARTE_NON_INITIALISÉE</h2>
                        <p>Les mondes ne sont pas encore configurés.</p>
                        <p className="mt-4 text-green-400 text-sm">
                            Exécutez: <code className="bg-black px-2 py-1 rounded">npx tsx scripts/setup-js-worldmap.ts</code>
                        </p>
                        <p className="text-green-400 text-sm">
                            Puis: <code className="bg-black px-2 py-1 rounded">npx tsx scripts/sync-js-worldmap.ts</code>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
