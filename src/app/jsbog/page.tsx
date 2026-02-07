'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SeasonCard from '@/components/jsbog/SeasonCard';
import {
  JS_SEASONS,
  getTotalExercises,
  getTotalModules,
  isSeasonUnlocked,
  getTimeUntilUnlock
} from '@/lib/js-seasons-config';

// Skeleton for loading state
function SeasonCardSkeleton() {
  return (
    <div className="bg-[#1a1a2e] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden animate-pulse">
      <div className="h-32 sm:h-40 bg-gray-800" />
      <div className="p-4">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-800 rounded w-1/2 mb-3" />
        <div className="h-12 bg-gray-800 rounded mb-4" />
        <div className="flex gap-4 mb-3">
          <div className="h-4 bg-gray-700 rounded w-20" />
          <div className="h-4 bg-gray-700 rounded w-24" />
        </div>
        <div className="h-2 bg-gray-800 rounded-full" />
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f0a] py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <div className="h-12 bg-gray-800 rounded w-64 mx-auto mb-2 animate-pulse" />
          <div className="h-4 bg-gray-800 rounded w-96 mx-auto animate-pulse" />
        </div>

        {/* Stats skeleton */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-black/50 border-2 border-gray-700 rounded-lg px-6 py-3 animate-pulse">
              <div className="h-6 w-16 bg-gray-700 rounded" />
            </div>
          ))}
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <SeasonCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function JsBogPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [userProgress, setUserProgress] = useState<Record<string, { completed: number; total: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    // TODO: Fetch actual user progress from database
    // For now, use placeholder data
    const fetchProgress = async () => {
      if (!user) return;

      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 500));

      // Placeholder progress data
      setUserProgress({
        'chrono': { completed: 12, total: 36 },
        'abyss': { completed: 0, total: 62 },
        'forge': { completed: 0, total: 86 },
        'realm': { completed: 0, total: 36 }
      });

      setLoading(false);
    };

    fetchProgress();
  }, [user]);

  if (isLoading || !user || loading) {
    return <PageSkeleton />;
  }

  const totalCompleted = Object.values(userProgress).reduce((sum, p) => sum + p.completed, 0);
  const totalExercises = getTotalExercises();
  const progressPercent = Math.round((totalCompleted / totalExercises) * 100);

  return (
    <div className="min-h-screen bg-[#0a0f0a] py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-green-400 font-mono mb-2">
            JSBOG
          </h1>
          <p className="text-green-300/70 font-mono text-lg">
            JavaScript Bootcamp of Glory
          </p>
          <p className="text-gray-500 font-mono text-sm mt-2">
            Choisissez votre saison et commencez l&apos;aventure
          </p>
        </div>

        {/* Global Stats */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {/* Total Progress */}
          <div className="bg-black/50 border-2 border-green-500 rounded-lg px-6 py-3 flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <div className="text-green-400 font-bold text-xl">{progressPercent}%</div>
              <div className="text-green-400/60 text-xs">{totalCompleted}/{totalExercises} exercices</div>
            </div>
          </div>

          {/* Seasons */}
          <div className="bg-black/50 border-2 border-purple-500 rounded-lg px-6 py-3 flex items-center gap-3">
            <span className="text-2xl">🌍</span>
            <div>
              <div className="text-purple-400 font-bold text-xl">{JS_SEASONS.length}</div>
              <div className="text-purple-400/60 text-xs">Saisons</div>
            </div>
          </div>

          {/* Modules */}
          <div className="bg-black/50 border-2 border-cyan-500 rounded-lg px-6 py-3 flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <div className="text-cyan-400 font-bold text-xl">{getTotalModules()}</div>
              <div className="text-cyan-400/60 text-xs">Modules</div>
            </div>
          </div>
        </div>

        {/* Season Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {JS_SEASONS.map((season) => {
            const progress = userProgress[season.slug] || { completed: 0, total: season.totalExercises };
            const progressPercent = Math.round((progress.completed / progress.total) * 100);
            const isLocked = !isSeasonUnlocked(season);
            const unlockCountdown = isLocked ? getTimeUntilUnlock(season) : null;

            return (
              <SeasonCard
                key={season.id}
                season={season}
                progress={progressPercent}
                completedExercises={progress.completed}
                isLocked={isLocked}
                unlockCountdown={unlockCountdown}
              />
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-gray-600 font-mono text-xs">
          <p>Basé sur &quot;JavaScript: The Good Parts&quot;, &quot;You Don&apos;t Know JS&quot; et plus</p>
          <p className="mt-1">~220 exercices répartis en 4 saisons thématiques</p>
        </div>
      </div>
    </div>
  );
}
