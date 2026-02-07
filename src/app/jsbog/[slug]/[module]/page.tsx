'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { getSeasonBySlug, getModuleBySlug, SEASON_COLOR_CLASSES, JsSeason, JsModule } from '@/lib/js-seasons-config';

interface Exercise {
  index: number;
  title: string;
  slug: string;
  status: 'completed' | 'current' | 'locked';
}

// Skeleton components
function ExerciseCardSkeleton() {
  return (
    <div className="bg-[#1a1a2e] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-700 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-800 rounded w-1/2" />
        </div>
        <div className="w-8 h-8 bg-gray-700 rounded-full" />
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      {/* Header skeleton */}
      <div className="relative h-40 md:h-48 bg-gray-800 animate-pulse" />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Breadcrumb skeleton */}
        <div className="h-4 bg-gray-800 rounded w-64 mb-6 animate-pulse" />

        {/* Description skeleton */}
        <div className="h-4 bg-gray-800 rounded w-full mb-2 animate-pulse" />
        <div className="h-4 bg-gray-800 rounded w-2/3 mb-6 animate-pulse" />

        {/* Exercise list skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <ExerciseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ModuleDetailPage() {
  const { user, isLoading, getJWT } = useAuth();
  const router = useRouter();
  const params = useParams();
  const seasonSlug = params.slug as string;
  const moduleSlug = params.module as string;

  const [season, setSeason] = useState<JsSeason | null>(null);
  const [module, setModule] = useState<JsModule | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const loadModuleData = async () => {
      if (!user || !seasonSlug || !moduleSlug) return;

      const foundSeason = getSeasonBySlug(seasonSlug);
      if (!foundSeason) {
        router.push('/jsbog');
        return;
      }

      const foundModule = getModuleBySlug(seasonSlug, moduleSlug);
      if (!foundModule) {
        router.push(`/jsbog/${seasonSlug}`);
        return;
      }

      setSeason(foundSeason);
      setModule(foundModule);

      // Charger les exercices et la progression en parallèle
      try {
        const jwt = await getJWT();
        const headers: Record<string, string> = jwt ? { 'Authorization': `Bearer ${jwt}` } : {};

        const [exercisesResponse, progressResponse] = await Promise.all([
          fetch(`/api/jsbog/exercises?season=${seasonSlug}&module=${moduleSlug}`, { headers }),
          fetch(`/api/jsbog/submissions?season=${seasonSlug}&module=${moduleSlug}`, { headers })
        ]);

        const exercisesData = await exercisesResponse.json();
        const progressData = await progressResponse.json();

        // Créer un Set des exercices complétés pour une recherche rapide
        const completedSet = new Set<string>(progressData.completedExercises || []);

        if (exercisesData.exercises && exercisesData.exercises.length > 0) {
          // Déterminer le statut de chaque exercice
          const exerciseList: Exercise[] = exercisesData.exercises.map(
            (ex: { index: number; slug: string; title: string }, idx: number) => {
              let status: 'completed' | 'current' | 'locked';

              if (completedSet.has(ex.slug)) {
                // Exercice déjà réussi
                status = 'completed';
              } else if (idx === 0) {
                // Premier exercice toujours accessible
                status = 'current';
              } else {
                // Vérifie si l'exercice précédent est complété
                const prevExercise = exercisesData.exercises[idx - 1];
                status = completedSet.has(prevExercise.slug) ? 'current' : 'locked';
              }

              return {
                index: ex.index + 1,
                title: ex.title,
                slug: ex.slug,
                status
              };
            }
          );

          setExercises(exerciseList);
          setCompletedCount(completedSet.size);
        } else {
          // Fallback: générer des exercices placeholder si pas de données
          const [startIdx, endIdx] = foundModule.exerciseRange;
          const exerciseList: Exercise[] = [];

          for (let i = startIdx; i <= endIdx; i++) {
            const slug = `${foundModule.slug}-ex${(i - startIdx).toString().padStart(2, '0')}`;
            exerciseList.push({
              index: i - startIdx + 1,
              title: `Exercice ${i - startIdx + 1}`,
              slug,
              status: completedSet.has(slug) ? 'completed' :
                      (i === startIdx || completedSet.has(`${foundModule.slug}-ex${(i - startIdx - 1).toString().padStart(2, '0')}`))
                      ? 'current' : 'locked'
            });
          }

          setExercises(exerciseList);
          setCompletedCount(completedSet.size);
        }
      } catch (error) {
        console.error('Error loading exercises:', error);
        // Fallback en cas d'erreur - premier exercice accessible
        const [startIdx, endIdx] = foundModule.exerciseRange;
        const exerciseList: Exercise[] = [];

        for (let i = startIdx; i <= endIdx; i++) {
          exerciseList.push({
            index: i - startIdx + 1,
            title: `Exercice ${i - startIdx + 1}`,
            slug: `${foundModule.slug}-ex${(i - startIdx).toString().padStart(2, '0')}`,
            status: i === startIdx ? 'current' : 'locked'
          });
        }

        setExercises(exerciseList);
        setCompletedCount(0);
      }

      setLoading(false);
    };

    loadModuleData();
  }, [user, seasonSlug, moduleSlug, router, getJWT]);

  if (isLoading || !user || loading || !season || !module) {
    return <PageSkeleton />;
  }

  const colors = SEASON_COLOR_CLASSES[season.slug as keyof typeof SEASON_COLOR_CLASSES];
  const progressPercent = Math.round((completedCount / exercises.length) * 100);

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      {/* Header with module icon */}
      <div className="relative h-40 md:h-48 overflow-hidden">
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-r ${season.colors.gradient}`} />

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
          }} />
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a] via-transparent to-black/30" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-end gap-6">
              {/* Module icon */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 bg-black/50 rounded-lg border-4 border-black overflow-hidden flex-shrink-0">
                <Image
                  src={module.icon}
                  alt={module.name}
                  fill
                  className="object-contain p-2"
                  style={{ imageRendering: 'pixelated' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Fallback */}
                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">
                  📦
                </div>
              </div>

              {/* Title and stats */}
              <div className="flex-1 min-w-0">
                <span className={`
                  inline-block px-2 py-0.5 mb-1
                  bg-black/60 border ${colors?.border || 'border-gray-500'}
                  rounded font-mono text-xs font-bold
                  ${colors?.text || 'text-gray-400'}
                `}>
                  {season.name}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-white font-mono truncate">
                  {module.name}
                </h1>
                <p className="text-gray-400 text-sm mt-1 hidden sm:block">
                  {module.exerciseCount} exercices
                </p>
              </div>

              {/* Progress circle */}
              <div className="hidden sm:block relative w-16 h-16 flex-shrink-0">
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
                  <span className="text-white font-bold font-mono text-sm">{progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 font-mono text-sm">
          <Link href="/jsbog" className="text-gray-500 hover:text-green-400 transition-colors">
            JSBOG
          </Link>
          <span className="text-gray-600 mx-2">/</span>
          <Link href={`/jsbog/${season.slug}`} className={`hover:${colors?.text || 'text-gray-400'} transition-colors text-gray-500`}>
            {season.name}
          </Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className={colors?.text || 'text-gray-400'}>{module.name}</span>
        </nav>

        {/* Module description */}
        <div className="mb-6">
          <p className="text-gray-400 mb-4">
            {module.description}
          </p>

          {/* Topics tags */}
          <div className="flex flex-wrap gap-2">
            {module.topics.map((topic, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 text-xs font-mono rounded bg-gray-800/50 border ${colors?.border || 'border-gray-600'} ${colors?.text || 'text-gray-400'}`}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8 bg-black/30 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 font-mono text-sm">Progression</span>
            <span className="text-white font-mono font-bold">{completedCount}/{exercises.length}</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${colors?.bg || 'bg-green-500'}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Exercise list */}
        <h2 className="text-xl font-bold text-white font-mono mb-4 flex items-center gap-2">
          <span className={colors?.text || 'text-gray-400'}>▸</span>
          Exercices
        </h2>

        <div className="space-y-3">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.slug}
              exercise={exercise}
              seasonSlug={season.slug}
              moduleSlug={module.slug}
              colorClass={colors?.border || 'border-gray-500'}
              accentColor={season.colors.primary}
            />
          ))}
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href={`/jsbog/${season.slug}`}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-green-400 transition-colors font-mono text-sm"
          >
            <span>←</span>
            <span>Retour à {season.name}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Exercise card component
interface ExerciseCardProps {
  exercise: Exercise;
  seasonSlug: string;
  moduleSlug: string;
  colorClass: string;
  accentColor: string;
}

function ExerciseCard({ exercise, seasonSlug, moduleSlug, colorClass, accentColor }: ExerciseCardProps) {
  const isLocked = exercise.status === 'locked';
  const isCompleted = exercise.status === 'completed';
  const isCurrent = exercise.status === 'current';

  return (
    <Link
      href={isLocked ? '#' : `/jsbog/${seasonSlug}/${moduleSlug}/${exercise.slug}`}
      className={`
        group relative block
        bg-[#1a1a2e]
        border-4 border-black
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        rounded-lg
        overflow-hidden
        transition-all duration-200
        ${isLocked
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
        }
      `}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Exercise number */}
        <div className={`
          w-12 h-12 rounded-lg flex items-center justify-center
          font-mono font-bold text-lg
          border-2
          ${isCompleted
            ? 'bg-green-500/20 border-green-500 text-green-400'
            : isCurrent
              ? `bg-black/50 ${colorClass} text-white`
              : 'bg-gray-800 border-gray-700 text-gray-500'
          }
        `}>
          {isCompleted ? '✓' : exercise.index.toString().padStart(2, '0')}
        </div>

        {/* Exercise info */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-mono font-bold truncate ${isLocked ? 'text-gray-500' : 'text-white'}`}>
            {exercise.title}
          </h3>
          <p className="text-xs text-gray-500 font-mono">
            {isCompleted ? 'Complété' : isCurrent ? 'En cours' : 'Verrouillé'}
          </p>
        </div>

        {/* Status icon */}
        <div className="flex-shrink-0">
          {isCompleted && (
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-black font-bold">✓</span>
            </div>
          )}
          {isCurrent && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center border-2 animate-pulse"
              style={{ borderColor: accentColor, backgroundColor: `${accentColor}20` }}
            >
              <span style={{ color: accentColor }}>▶</span>
            </div>
          )}
          {isLocked && (
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-gray-600">🔒</span>
            </div>
          )}
        </div>
      </div>

      {/* Current indicator bar */}
      {isCurrent && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: accentColor }}
        />
      )}
    </Link>
  );
}
