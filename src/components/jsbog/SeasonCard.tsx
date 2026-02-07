'use client';

import Link from 'next/link';
import Image from 'next/image';
import { JsSeason, SEASON_COLOR_CLASSES, getSeasonUnlockDate } from '@/lib/js-seasons-config';

interface SeasonCardProps {
  season: JsSeason;
  progress?: number; // 0-100
  completedExercises?: number;
  isLocked?: boolean;
  /** Info de temps restant avant déblocage */
  unlockCountdown?: { days: number; hours: number; minutes: number } | null;
}

export default function SeasonCard({
  season,
  progress = 0,
  completedExercises = 0,
  isLocked = false,
  unlockCountdown = null
}: SeasonCardProps) {
  // Formater la date de déblocage pour l'affichage
  const formatUnlockDate = (): string => {
    const unlockDate = getSeasonUnlockDate(season);
    return unlockDate.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  };
  const colors = SEASON_COLOR_CLASSES[season.slug as keyof typeof SEASON_COLOR_CLASSES];

  return (
    <Link
      href={isLocked ? '#' : `/jsbog/${season.slug}`}
      className={`
        group relative block
        bg-[#1a1a2e]
        border-4 border-black
        shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
        rounded-lg overflow-hidden
        transition-all duration-200
        ${isLocked
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
        }
      `}
    >
      {/* Banner Image */}
      <div className="relative h-32 sm:h-40 overflow-hidden">
        {/* Placeholder gradient if no image */}
        <div className={`absolute inset-0 ${colors?.bg || 'bg-gradient-to-r from-gray-700 to-gray-900'}`} />

        {/* Actual banner image */}
        <Image
          src={season.images.banner}
          alt={season.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={(e) => {
            // Hide image on error, show gradient
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />

        {/* Season number badge */}
        <div className={`
          absolute top-3 left-3
          px-3 py-1
          bg-black/80 border-2 ${colors?.border || 'border-gray-500'}
          rounded font-mono text-sm font-bold
          ${colors?.text || 'text-gray-400'}
        `}>
          SAISON {season.order}
        </div>

        {/* Lock overlay avec countdown */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2">
            <span className="text-4xl">🔒</span>
            <div className="text-center px-2">
              <p className="text-white/90 text-xs font-mono">Disponible en</p>
              <p className="text-yellow-400 text-sm font-bold font-mono">{formatUnlockDate()}</p>
              {unlockCountdown && (
                <p className="text-white/60 text-xs font-mono mt-1">
                  {unlockCountdown.days}j {unlockCountdown.hours}h restants
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and subtitle */}
        <h3 className="text-xl font-bold text-white font-mono mb-1">
          {season.name}
        </h3>
        <p className={`text-sm font-mono mb-3 ${colors?.text || 'text-gray-400'}`}>
          {season.subtitle}
        </p>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {season.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs font-mono mb-3">
          <div className="flex items-center gap-1">
            <span className="text-lg">📚</span>
            <span className="text-gray-300">{season.modules.length} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg">⚡</span>
            <span className="text-gray-300">{season.totalExercises} exercices</span>
          </div>
        </div>

        {/* Difficulty badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`
            px-2 py-1 text-xs font-mono rounded
            ${season.difficulty === 'Débutant' ? 'bg-green-500/20 text-green-400' :
              season.difficulty === 'Intermédiaire' ? 'bg-yellow-500/20 text-yellow-400' :
              season.difficulty === 'Avancé' ? 'bg-orange-500/20 text-orange-400' :
              'bg-red-500/20 text-red-400'}
          `}>
            {season.difficulty}
          </span>

          {/* Progress percentage */}
          {progress > 0 && (
            <span className="text-sm font-mono text-white">
              {progress}%
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
          <div
            className={`h-full ${colors?.bg || 'bg-gray-500'} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress text */}
        <div className="mt-2 text-xs text-gray-500 font-mono">
          {completedExercises} / {season.totalExercises} complétés
        </div>
      </div>

      {/* Pixel art corner decorations */}
      <div className={`absolute top-0 right-0 w-4 h-4 ${colors?.bg || 'bg-gray-600'}`}
           style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
      <div className={`absolute bottom-0 left-0 w-4 h-4 ${colors?.bg || 'bg-gray-600'}`}
           style={{ clipPath: 'polygon(0 100%, 0 0, 100% 100%)' }} />
    </Link>
  );
}
