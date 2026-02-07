'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import ModuleCard from '@/components/jsbog/ModuleCard';
import { getSeasonBySlug, SEASON_COLOR_CLASSES, JsSeason } from '@/lib/js-seasons-config';

// Skeleton components
function ModuleCardSkeleton() {
  return (
    <div className="bg-[#1a1a2e] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-800" />
      <div className="p-3 border-t-4 border-gray-700">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-8 bg-gray-800 rounded mb-2" />
        <div className="h-1.5 bg-gray-800 rounded-full" />
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      {/* Banner skeleton */}
      <div className="relative h-48 md:h-64 bg-gray-800 animate-pulse" />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Title skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-800 rounded w-64 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-800 rounded w-96 animate-pulse" />
        </div>

        {/* Modules grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <ModuleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SeasonDetailPage() {
  const { user, isLoading, getJWT } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [season, setSeason] = useState<JsSeason | null>(null);
  const [moduleProgress, setModuleProgress] = useState<Record<string, { completed: number; total: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const loadSeason = async () => {
      if (!user || !slug) return;

      const foundSeason = getSeasonBySlug(slug);
      if (!foundSeason) {
        router.push('/jsbog');
        return;
      }

      setSeason(foundSeason);

      // Charger la progression réelle pour chaque module
      const progress: Record<string, { completed: number; total: number }> = {};

      // Initialiser avec 0 pour tous les modules
      foundSeason.modules.forEach(module => {
        progress[module.slug] = {
          completed: 0,
          total: module.exerciseCount
        };
      });

      // Charger la progression depuis l'API pour chaque module en parallèle
      try {
        const jwt = await getJWT();
        if (!jwt) {
          console.warn('No JWT available for API calls');
          setModuleProgress(progress);
          setLoading(false);
          return;
        }

        const progressPromises = foundSeason.modules.map(async (module) => {
          const response = await fetch(
            `/api/jsbog/submissions?season=${slug}&module=${module.slug}`,
            {
              headers: {
                'Authorization': `Bearer ${jwt}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            return {
              moduleSlug: module.slug,
              completed: data.completedExercises?.length || 0
            };
          }
          return { moduleSlug: module.slug, completed: 0 };
        });

        const results = await Promise.all(progressPromises);
        results.forEach(result => {
          if (progress[result.moduleSlug]) {
            progress[result.moduleSlug].completed = result.completed;
          }
        });
      } catch (error) {
        console.error('Error loading progress:', error);
      }

      setModuleProgress(progress);
      setLoading(false);
    };

    loadSeason();
  }, [user, slug, router, getJWT]);

  if (isLoading || !user || loading || !season) {
    return <PageSkeleton />;
  }

  const colors = SEASON_COLOR_CLASSES[season.slug as keyof typeof SEASON_COLOR_CLASSES];
  const totalCompleted = Object.values(moduleProgress).reduce((sum, p) => sum + p.completed, 0);
  const progressPercent = Math.round((totalCompleted / season.totalExercises) * 100);

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      {/* Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-r ${season.colors.gradient}`} />

        {/* Banner image */}
        <Image
          src={season.images.banner}
          alt={season.name}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a] via-transparent to-black/30" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-end justify-between">
              <div>
                <span className={`
                  inline-block px-3 py-1 mb-2
                  bg-black/60 border-2 ${colors?.border || 'border-gray-500'}
                  rounded font-mono text-sm font-bold
                  ${colors?.text || 'text-gray-400'}
                `}>
                  SAISON {season.order}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-mono">
                  {season.name}
                </h1>
                <p className={`text-lg font-mono ${colors?.text || 'text-gray-400'}`}>
                  {season.subtitle}
                </p>
              </div>

              {/* Progress circle */}
              <div className="hidden sm:block relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="rgba(0,0,0,0.5)"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={season.colors.primary}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${progressPercent * 2.83} 283`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold font-mono">{progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 font-mono text-sm">
          <Link href="/jsbog" className="text-gray-500 hover:text-green-400 transition-colors">
            JSBOG
          </Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className={colors?.text || 'text-gray-400'}>{season.name}</span>
        </nav>

        {/* Description */}
        <p className="text-gray-400 mb-6 max-w-2xl">
          {season.description}
        </p>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="bg-black/30 border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
            <span>📚</span>
            <span className="text-gray-400 font-mono text-sm">
              {season.modules.length} modules
            </span>
          </div>
          <div className="bg-black/30 border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
            <span>⚡</span>
            <span className="text-gray-400 font-mono text-sm">
              {totalCompleted}/{season.totalExercises} exercices
            </span>
          </div>
          <div className="bg-black/30 border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
            <span>🎯</span>
            <span className={`font-mono text-sm ${
              season.difficulty === 'Débutant' ? 'text-green-400' :
              season.difficulty === 'Intermédiaire' ? 'text-yellow-400' :
              season.difficulty === 'Avancé' ? 'text-orange-400' :
              'text-red-400'
            }`}>
              {season.difficulty}
            </span>
          </div>
        </div>

        {/* Section title */}
        <h2 className="text-xl font-bold text-white font-mono mb-4 flex items-center gap-2">
          <span className={colors?.text || 'text-gray-400'}>▸</span>
          Modules
        </h2>

        {/* Modules grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
          {season.modules.map((module, index) => {
            const progress = moduleProgress[module.slug] || { completed: 0, total: module.exerciseCount };
            const progressPercent = Math.round((progress.completed / progress.total) * 100);

            // First module always unlocked, others based on previous completion
            const isLocked = index > 0 && false; // TODO: implement proper unlock logic

            return (
              <ModuleCard
                key={module.id}
                module={module}
                seasonSlug={season.slug}
                progress={progressPercent}
                completedExercises={progress.completed}
                isLocked={isLocked}
                colorClass={colors?.border || 'border-gray-500'}
              />
            );
          })}
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/jsbog"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-green-400 transition-colors font-mono text-sm"
          >
            <span>←</span>
            <span>Retour aux saisons</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
