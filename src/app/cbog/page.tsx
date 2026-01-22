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
    order: number;
}

interface Submission {
    exerciseSlug: string;
    passed: boolean;
}

interface WeekData {
    slug: string;
    name: string;
    description: string;
    icon: string;
    totalExercises: number;
    completedExercises: number;
    order: number;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const C_EXERCISES_COLLECTION_ID = 'c-exercises';
const C_SUBMISSIONS_COLLECTION_ID = 'c-submissions';

// Week configurations
const WEEKS_CONFIG: Record<string, { name: string; description: string; icon: string }> = {
    'Semaine1': {
        name: 'Semaine 1',
        description: 'Les fondamentaux du C : variables, types, printf, conditions',
        icon: '🌱',
    },
    'Semaine2': {
        name: 'Semaine 2',
        description: 'Boucles, fonctions, tableaux et pointeurs',
        icon: '🌿',
    },
    'Semaine3': {
        name: 'Semaine 3',
        description: 'Chaînes de caractères, structures et allocation mémoire',
        icon: '🌲',
    },
    'Semaine4': {
        name: 'Semaine 4',
        description: 'Fichiers, préprocesseur et projets avancés',
        icon: '🏔️',
    },
};

// Skeleton components for loading state
function ProgressBarSkeleton() {
    return (
        <div className="max-w-md mx-auto animate-pulse">
            <div className="flex justify-between mb-1">
                <div className="h-4 w-24 bg-blue-900/50 rounded" />
                <div className="h-4 w-8 bg-blue-900/50 rounded" />
            </div>
            <div className="h-3 bg-blue-900/50 rounded-full border border-blue-800" />
        </div>
    );
}

function TimelineSkeleton() {
    return (
        <div className="hidden md:flex justify-center items-center gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-800 bg-blue-900/30 animate-pulse" />
                        <div className="w-6 h-3 bg-blue-900/50 rounded mt-1 animate-pulse" />
                    </div>
                    {i < 4 && (
                        <div className="w-16 h-1 mx-2 rounded bg-blue-900/50 animate-pulse" />
                    )}
                </div>
            ))}
        </div>
    );
}

function WeekCardSkeleton() {
    return (
        <div className="relative overflow-hidden rounded-xl p-6 border-4 border-blue-800/50 bg-gradient-to-br from-blue-900/20 to-gray-900/30 animate-pulse">
            {/* Icon & Title */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-800/50" />
                <div className="flex-1">
                    <div className="h-6 w-32 bg-blue-800/50 rounded mb-2" />
                    <div className="h-4 w-full bg-blue-900/30 rounded" />
                    <div className="h-4 w-2/3 bg-blue-900/30 rounded mt-1" />
                </div>
            </div>

            {/* Progress */}
            <div className="mt-4">
                <div className="flex justify-between mb-1">
                    <div className="h-4 w-24 bg-blue-900/30 rounded" />
                    <div className="h-4 w-8 bg-blue-900/30 rounded" />
                </div>
                <div className="h-2 bg-blue-900/50 rounded-full" />
            </div>

            {/* Arrow placeholder */}
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-blue-900/30 rounded" />
        </div>
    );
}

function PageSkeleton() {
    return (
        <div className="min-h-screen bg-[#0a0f0a] py-8 px-4">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">
                        CBOG
                    </h1>
                    <p className="text-blue-300 text-lg mb-4">
                        4 semaines pour maîtriser le C
                    </p>

                    {/* Progress skeleton */}
                    <ProgressBarSkeleton />
                </div>

                {/* Timeline skeleton */}
                <TimelineSkeleton />

                {/* Week Cards Grid skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <WeekCardSkeleton />
                    <WeekCardSkeleton />
                    <WeekCardSkeleton />
                    <WeekCardSkeleton />
                </div>

                {/* Legend skeleton */}
                <div className="mt-8 text-center">
                    <div className="h-4 w-64 bg-blue-900/30 rounded mx-auto animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export default function CbogPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [weeks, setWeeks] = useState<WeekData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hoveredWeek, setHoveredWeek] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError('');

                const [exercisesResponse, submissionsResponse] = await Promise.all([
                    databases.listDocuments(DATABASE_ID, C_EXERCISES_COLLECTION_ID, [
                        Query.orderAsc('order'),
                        Query.limit(100),
                    ]),
                    databases.listDocuments(DATABASE_ID, C_SUBMISSIONS_COLLECTION_ID, [
                        Query.equal('userId', user.$id),
                        Query.equal('passed', true),
                        Query.limit(500),
                    ]),
                ]);

                const exercises = exercisesResponse.documents as unknown as CExercise[];
                const completedSlugs = new Set(
                    (submissionsResponse.documents as unknown as Submission[]).map(s => s.exerciseSlug)
                );

                // Group by week
                const weekMap = new Map<string, { total: number; completed: number }>();
                for (const ex of exercises) {
                    if (!weekMap.has(ex.week)) {
                        weekMap.set(ex.week, { total: 0, completed: 0 });
                    }
                    const w = weekMap.get(ex.week)!;
                    w.total++;
                    if (completedSlugs.has(ex.slug)) {
                        w.completed++;
                    }
                }

                // Build week data
                const weeksData: WeekData[] = [];
                let order = 1;
                for (const [weekKey, config] of Object.entries(WEEKS_CONFIG)) {
                    const stats = weekMap.get(weekKey) || { total: 0, completed: 0 };
                    weeksData.push({
                        slug: weekKey.toLowerCase(),
                        name: config.name,
                        description: config.description,
                        icon: config.icon,
                        totalExercises: stats.total,
                        completedExercises: stats.completed,
                        order: order++,
                    });
                }

                setWeeks(weeksData);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Erreur lors du chargement');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Show skeleton during auth loading or data loading
    if (isLoading || !user || loading) {
        return <PageSkeleton />;
    }

    const totalExercises = weeks.reduce((sum, w) => sum + w.totalExercises, 0);
    const totalCompleted = weeks.reduce((sum, w) => sum + w.completedExercises, 0);
    const progressPercent = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#0a0f0a] py-8 px-4">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2">
                        CBOG
                    </h1>
                    <p className="text-blue-300 text-lg mb-4">
                        4 semaines pour maîtriser le C
                    </p>

                    {/* Global Progress */}
                    {totalExercises > 0 && (
                        <div className="max-w-md mx-auto">
                            <div className="flex justify-between text-sm text-blue-400 mb-1">
                                <span>{totalCompleted}/{totalExercises} exercices</span>
                                <span>{progressPercent}%</span>
                            </div>
                            <div className="h-3 bg-blue-900/50 rounded-full overflow-hidden border border-blue-700">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {error ? (
                    <div className="text-center text-red-500 font-mono border-4 border-red-500 bg-red-500/10 rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">ERREUR</h2>
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        {/* Timeline visualization */}
                        <div className="hidden md:flex justify-center items-center gap-4 mb-8">
                            {weeks.map((week, index) => {
                                const progress = week.totalExercises > 0
                                    ? (week.completedExercises / week.totalExercises) * 100
                                    : 0;
                                const isComplete = progress === 100;

                                return (
                                    <div key={week.slug} className="flex items-center">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-xl
                                                ${isComplete
                                                    ? 'border-cyan-400 bg-cyan-900/50'
                                                    : 'border-blue-600 bg-blue-900/30'
                                                }`}
                                            >
                                                {isComplete ? '✓' : week.icon}
                                            </div>
                                            <span className="text-xs text-blue-400 mt-1">S{week.order}</span>
                                        </div>
                                        {index < weeks.length - 1 && (
                                            <div className={`w-16 h-1 mx-2 rounded ${
                                                isComplete ? 'bg-cyan-500' : 'bg-blue-800'
                                            }`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Week Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {weeks.map((week) => {
                                const progress = week.totalExercises > 0
                                    ? Math.round((week.completedExercises / week.totalExercises) * 100)
                                    : 0;
                                const isComplete = progress === 100;
                                const isHovered = hoveredWeek === week.slug;

                                return (
                                    <Link
                                        key={week.slug}
                                        href={`/cbog/week/${week.slug}`}
                                        onMouseEnter={() => setHoveredWeek(week.slug)}
                                        onMouseLeave={() => setHoveredWeek(null)}
                                    >
                                        <div className={`
                                            relative overflow-hidden rounded-xl p-6
                                            border-4 transition-all duration-300
                                            ${isComplete
                                                ? 'border-cyan-500 bg-gradient-to-br from-cyan-900/40 to-blue-900/40'
                                                : 'border-blue-600 bg-gradient-to-br from-blue-900/30 to-gray-900/50'
                                            }
                                            ${isHovered ? 'scale-[1.02] shadow-lg shadow-blue-500/20' : ''}
                                        `}>
                                            {/* Icon & Title */}
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className={`
                                                    w-16 h-16 rounded-full flex items-center justify-center text-3xl
                                                    ${isComplete
                                                        ? 'bg-cyan-600'
                                                        : 'bg-blue-700'
                                                    }
                                                `}>
                                                    {week.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-white mb-1">
                                                        {week.name}
                                                    </h3>
                                                    <p className="text-blue-300 text-sm">
                                                        {week.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Progress */}
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-blue-400">
                                                        {week.completedExercises}/{week.totalExercises} exercices
                                                    </span>
                                                    <span className={isComplete ? 'text-cyan-400' : 'text-blue-400'}>
                                                        {progress}%
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-blue-900/50 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-500 ${
                                                            isComplete
                                                                ? 'bg-cyan-400'
                                                                : 'bg-blue-500'
                                                        }`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Status badge */}
                                            {isComplete && (
                                                <div className="absolute top-4 right-4">
                                                    <span className="px-2 py-1 bg-cyan-500 text-black text-xs font-bold rounded">
                                                        COMPLÉTÉ
                                                    </span>
                                                </div>
                                            )}

                                            {/* Arrow indicator */}
                                            <div className={`
                                                absolute bottom-4 right-4 text-2xl transition-transform
                                                ${isHovered ? 'translate-x-1 text-cyan-400' : 'text-blue-500'}
                                            `}>
                                                →
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-8 text-center text-blue-400/60 font-mono text-sm">
                            <p>Clique sur une semaine pour voir ses exercices</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
