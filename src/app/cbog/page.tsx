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
    tag: string;
    totalExercises: number;
    completedExercises: number;
    order: number;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const C_EXERCISES_COLLECTION_ID = 'c-exercises';
const C_SUBMISSIONS_COLLECTION_ID = 'c-submissions';

const WEEKS_CONFIG: Record<string, { name: string; description: string; tag: string }> = {
    'Semaine1': {
        name: 'SEMAINE_01',
        description: 'Variables, types, printf, conditions',
        tag: 'S1',
    },
    'Semaine2': {
        name: 'SEMAINE_02',
        description: 'Boucles, fonctions, tableaux, pointeurs',
        tag: 'S2',
    },
    'Semaine3': {
        name: 'SEMAINE_03',
        description: 'Chaînes, structures, allocation mémoire',
        tag: 'S3',
    },
    'Semaine4': {
        name: 'SEMAINE_04',
        description: 'Fichiers, préprocesseur, projets avancés',
        tag: 'S4',
    },
};

function asciiBar(percent: number, width = 20): string {
    const filled = Math.round((percent / 100) * width);
    return '█'.repeat(filled) + '░'.repeat(width - filled);
}

function PageSkeleton() {
    return (
        <div className="min-h-screen bg-black font-mono py-8 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-10 animate-pulse">
                    <div className="h-8 w-64 bg-green-900/40 rounded mx-auto mb-2" />
                    <div className="h-5 w-48 bg-green-900/20 rounded mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="border border-green-800 bg-green-950/10 p-5 animate-pulse">
                            <div className="h-5 w-32 bg-green-900/30 rounded mb-3" />
                            <div className="h-4 w-full bg-green-900/20 rounded mb-4" />
                            <div className="h-3 w-full bg-green-900/20 rounded" />
                        </div>
                    ))}
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

                const weeksData: WeekData[] = [];
                let order = 1;
                for (const [weekKey, config] of Object.entries(WEEKS_CONFIG)) {
                    const stats = weekMap.get(weekKey) || { total: 0, completed: 0 };
                    weeksData.push({
                        slug: weekKey.toLowerCase(),
                        name: config.name,
                        description: config.description,
                        tag: config.tag,
                        totalExercises: stats.total,
                        completedExercises: stats.completed,
                        order: order++,
                    });
                }

                setWeeks(weeksData);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('ERR: chargement impossible');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (isLoading || !user || loading) {
        return <PageSkeleton />;
    }

    const totalExercises = weeks.reduce((sum, w) => sum + w.totalExercises, 0);
    const totalCompleted = weeks.reduce((sum, w) => sum + w.completedExercises, 0);
    const progressPercent = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;

    return (
        <div
            className="min-h-screen bg-black font-mono text-green-400 py-8 px-4"
            style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.012) 2px, rgba(0,255,65,0.012) 4px)',
            }}
        >
            <div className="container mx-auto max-w-4xl">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="text-green-600 text-xs mb-2 tracking-widest">
                        ┌──────────────────────────────────┐
                    </div>
                    <h1 className="text-5xl font-bold text-green-400 tracking-widest">
                        CBOG
                        <span className="inline-block w-1 h-10 bg-green-400 ml-2 align-middle animate-pulse" />
                    </h1>
                    <p className="text-green-600 text-sm mt-2 tracking-widest">
                        $ ./piscine-c --semaines 4 --exercices {totalExercises}
                    </p>
                    <div className="text-green-600 text-xs mt-2 tracking-widest">
                        └──────────────────────────────────┘
                    </div>

                    {/* Global progress */}
                    {totalExercises > 0 && (
                        <div className="mt-6 max-w-sm mx-auto text-left">
                            <div className="flex justify-between text-xs text-green-600 mb-1">
                                <span>PROGRESSION GLOBALE</span>
                                <span>{totalCompleted}/{totalExercises}</span>
                            </div>
                            <div className="text-green-400 text-sm tracking-wider">
                                [{asciiBar(progressPercent, 28)}] {progressPercent}%
                            </div>
                        </div>
                    )}
                </div>

                {error ? (
                    <div className="border border-red-500 bg-red-950/20 p-6 text-red-400">
                        <p className="text-lg font-bold mb-1">[ERREUR]</p>
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        {/* Timeline ASCII */}
                        <div className="hidden md:flex justify-center items-center gap-0 mb-8 text-green-600 text-sm">
                            {weeks.map((week, index) => {
                                const isComplete = week.completedExercises === week.totalExercises && week.totalExercises > 0;
                                return (
                                    <div key={week.slug} className="flex items-center">
                                        <div className="flex flex-col items-center">
                                            <span className={`px-2 py-1 border text-xs ${isComplete ? 'border-green-400 text-green-400' : 'border-green-800 text-green-700'}`}>
                                                {isComplete ? '[✓]' : `[${week.tag}]`}
                                            </span>
                                        </div>
                                        {index < weeks.length - 1 && (
                                            <span className={`mx-1 ${isComplete ? 'text-green-400' : 'text-green-800'}`}>
                                                ──►
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Week Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            relative border p-5 transition-all duration-150
                                            ${isComplete
                                                ? 'border-green-400 bg-green-950/20'
                                                : 'border-green-800 bg-black hover:border-green-600'
                                            }
                                            ${isHovered ? 'shadow-[0_0_12px_rgba(74,222,128,0.2)]' : ''}
                                        `}>
                                            {/* Title row */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xs px-2 py-0.5 border ${isComplete ? 'border-green-400 text-green-400' : 'border-green-700 text-green-600'}`}>
                                                        {week.tag}
                                                    </span>
                                                    <span className={`text-sm font-bold tracking-widest ${isComplete ? 'text-green-300' : 'text-green-500'}`}>
                                                        {week.name}
                                                    </span>
                                                </div>
                                                {isComplete && (
                                                    <span className="text-xs text-green-400 border border-green-400 px-1">[OK]</span>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <p className="text-green-700 text-xs mb-4 leading-relaxed">
                                                # {week.description}
                                            </p>

                                            {/* Progress */}
                                            <div>
                                                <div className="flex justify-between text-xs text-green-700 mb-1">
                                                    <span>{week.completedExercises}/{week.totalExercises} exercices</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className={`text-xs tracking-wider ${isComplete ? 'text-green-400' : 'text-green-700'}`}>
                                                    [{asciiBar(progress, 22)}]
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            <div className={`
                                                absolute bottom-4 right-4 text-sm transition-all
                                                ${isHovered ? 'text-green-400 translate-x-1' : 'text-green-800'}
                                            `}>
                                                {isHovered ? '──►' : '──>'}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Footer hint */}
                        <div className="mt-8 text-center text-green-800 text-xs">
                            $ cd ./semaine_xx &amp;&amp; ls exercices/
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
