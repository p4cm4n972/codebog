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

// Skeleton components for loading state
function StatCardSkeleton({ borderColor }: { borderColor: string }) {
    return (
        <div className={`bg-black/50 border-2 ${borderColor} rounded-lg px-6 py-3 flex items-center gap-3 animate-pulse`}>
            <div className="w-8 h-8 bg-gray-700 rounded" />
            <div>
                <div className="h-6 w-16 bg-gray-700 rounded mb-1" />
                <div className="h-3 w-12 bg-gray-800 rounded" />
            </div>
        </div>
    );
}

function WorldMapSkeleton() {
    // Skeleton positions matching real world positions
    const skeletonWorlds = [
        { x: 50, y: 85 },  // fondations
        { x: 25, y: 65 },  // fp-valley
        { x: 75, y: 65 },  // async-forest
        { x: 15, y: 40 },  // closures-cave
        { x: 85, y: 40 },  // oop-temple
        { x: 25, y: 20 },  // meta-tower
        { x: 75, y: 20 },  // perf-peak
        { x: 50, y: 50 },  // itmade-arena
        { x: 50, y: 8 },   // summit
    ];

    return (
        <div className="relative w-full min-h-[700px] bg-gradient-to-b from-[#0a1a0a] via-[#0d2818] to-[#0a1a0a] rounded-xl border-4 border-black overflow-hidden">
            {/* Background particles skeleton */}
            <div className="absolute inset-0 opacity-20">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-gray-600 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Connection lines skeleton */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <line x1="50%" y1="85%" x2="25%" y2="65%" stroke="#374151" strokeWidth="2" strokeDasharray="8,8" />
                <line x1="50%" y1="85%" x2="75%" y2="65%" stroke="#374151" strokeWidth="2" strokeDasharray="8,8" />
                <line x1="50%" y1="85%" x2="50%" y2="50%" stroke="#374151" strokeWidth="2" strokeDasharray="8,8" />
                <line x1="25%" y1="65%" x2="15%" y2="40%" stroke="#374151" strokeWidth="2" strokeDasharray="8,8" />
                <line x1="75%" y1="65%" x2="85%" y2="40%" stroke="#374151" strokeWidth="2" strokeDasharray="8,8" />
                <line x1="15%" y1="40%" x2="25%" y2="20%" stroke="#374151" strokeWidth="2" strokeDasharray="8,8" />
                <line x1="85%" y1="40%" x2="75%" y2="20%" stroke="#374151" strokeWidth="2" strokeDasharray="8,8" />
                <line x1="25%" y1="20%" x2="50%" y2="8%" stroke="#374151" strokeWidth="2" strokeDasharray="8,8" />
                <line x1="75%" y1="20%" x2="50%" y2="8%" stroke="#374151" strokeWidth="2" strokeDasharray="8,8" />
            </svg>

            {/* World node skeletons */}
            {skeletonWorlds.map((pos, i) => (
                <div
                    key={i}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-800 border-4 border-gray-700 animate-pulse" />
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-800 rounded animate-pulse" />
                </div>
            ))}

            {/* Legend skeleton */}
            <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-gray-700" />
                    <div className="w-16 h-3 bg-gray-700 rounded" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-700" />
                    <div className="w-16 h-3 bg-gray-700 rounded" />
                </div>
            </div>
        </div>
    );
}

function PageSkeleton() {
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

                {/* Stats Bar Skeleton */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <StatCardSkeleton borderColor="border-yellow-500/50" />
                    <StatCardSkeleton borderColor="border-green-500/50" />
                    <StatCardSkeleton borderColor="border-purple-500/50" />
                </div>

                {/* World Map Skeleton */}
                <WorldMapSkeleton />

                {/* Legend skeleton */}
                <div className="mt-8 text-center">
                    <div className="h-4 w-64 bg-gray-800 rounded mx-auto mb-2 animate-pulse" />
                    <div className="h-4 w-80 bg-gray-800 rounded mx-auto animate-pulse" />
                </div>
            </div>
        </div>
    );
}

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

    // Show skeleton during auth loading or data loading
    if (isLoading || !user || loading) {
        return <PageSkeleton />;
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
                {error ? (
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
                        <h2 className="text-3xl font-bold mb-4">CARTE_NON_INITIALISEE</h2>
                        <p>Les mondes ne sont pas encore configures.</p>
                        <p className="mt-4 text-green-400 text-sm">
                            Executez: <code className="bg-black px-2 py-1 rounded">npx tsx scripts/setup-js-worldmap.ts</code>
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
