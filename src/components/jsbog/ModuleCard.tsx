'use client';

import Link from 'next/link';
import Image from 'next/image';
import { JsModule } from '@/lib/js-seasons-config';

interface ModuleCardProps {
  module: JsModule;
  seasonSlug: string;
  progress?: number; // 0-100
  completedExercises?: number;
  isLocked?: boolean;
  colorClass?: string;
}

export default function ModuleCard({
  module,
  seasonSlug,
  progress = 0,
  completedExercises = 0,
  isLocked = false,
  colorClass = 'border-gray-500'
}: ModuleCardProps) {
  const isCompleted = progress === 100;

  return (
    <Link
      href={isLocked ? '#' : `/jsbog/${seasonSlug}/${module.slug}`}
      className={`
        group relative block
        bg-[#1a1a2e]
        border-4 border-black
        shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
        rounded-lg overflow-hidden
        transition-all duration-200
        ${isLocked
          ? 'opacity-50 cursor-not-allowed grayscale'
          : 'hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
        }
      `}
    >
      {/* Pixel art icon */}
      <div className="relative aspect-square bg-black/50 flex items-center justify-center p-4">
        {/* Icon image */}
        <div className="relative w-full h-full">
          <Image
            src={module.icon}
            alt={module.name}
            fill
            className={`
              object-contain
              transition-transform duration-300
              ${!isLocked ? 'group-hover:scale-110' : ''}
              ${isLocked ? 'opacity-30' : ''}
            `}
            style={{ imageRendering: 'pixelated' }}
            sizes="128px"
            onError={(e) => {
              // Show fallback emoji on error
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Fallback icon (hidden when image loads) */}
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
            📦
          </div>
        </div>

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-4xl">🔒</span>
          </div>
        )}

        {/* Completion star */}
        {isCompleted && !isLocked && (
          <div className="absolute top-2 right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-yellow-600 shadow-lg">
            <span className="text-sm">⭐</span>
          </div>
        )}

        {/* Progress ring overlay */}
        {!isLocked && progress > 0 && progress < 100 && (
          <svg
            className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progress * 3.01} 301`}
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className={`p-3 border-t-4 ${colorClass}`}>
        {/* Module name */}
        <h4 className="text-sm font-bold text-white font-mono mb-1 truncate">
          {module.name}
        </h4>

        {/* Description */}
        <p className="text-xs text-gray-400 mb-2 line-clamp-2 h-8">
          {module.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-gray-500">
            {module.exerciseCount} exos
          </span>
          {!isLocked && (
            <span className={`font-bold ${isCompleted ? 'text-yellow-400' : 'text-gray-400'}`}>
              {completedExercises}/{module.exerciseCount}
            </span>
          )}
        </div>

        {/* Mini progress bar */}
        <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isCompleted ? 'bg-yellow-400' : 'bg-green-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Topics tags (shown on hover for non-locked) */}
      {!isLocked && (
        <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4">
          <h4 className="text-white font-bold font-mono mb-3">{module.name}</h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {module.topics.slice(0, 4).map((topic, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 text-xs rounded bg-gray-800 ${colorClass.replace('border-', 'text-')}`}
              >
                {topic}
              </span>
            ))}
          </div>
          <span className="mt-3 text-green-400 text-xs font-mono">
            Cliquer pour commencer →
          </span>
        </div>
      )}
    </Link>
  );
}
