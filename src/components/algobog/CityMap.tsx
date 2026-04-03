'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// District configuration with positions for the city map
const DISTRICTS = [
  {
    slug: 'downtown',
    name: 'Downtown',
    subtitle: 'Phase 1 - Fondamentaux',
    icon: '🏛️',
    image: '/images/algobog/icons/algobog-downtown-icon.png',
    banner: '/images/algobog/banners/algobog-downtown-banner.png',
    description: 'Arrays, Strings, Hash Maps, Two Pointers, Binary Search, Sliding Window, Sorting, Stack',
    color: 'green',
    modules: 8,
    problems: 400,
    order: 1,
    posX: 25,
    posY: 70,
  },
  {
    slug: 'industrial',
    name: 'Industrial Zone',
    subtitle: 'Phase 2 - Structures',
    icon: '🏭',
    image: '/images/algobog/icons/algobog-industrial-icon.png',
    banner: '/images/algobog/banners/algobog-industrial-banner.png',
    description: 'Linked Lists, Queues, Trees, BST, Heaps, Tries',
    color: 'orange',
    modules: 6,
    problems: 400,
    order: 2,
    posX: 75,
    posY: 70,
  },
  {
    slug: 'transit',
    name: 'Transit Hub',
    subtitle: 'Phase 3 - Graphes',
    icon: '🚇',
    image: '/images/algobog/icons/algobog-transit-icon.png',
    banner: '/images/algobog/banners/algobog-transit-banner.png',
    description: 'BFS, DFS, Topological Sort, Union Find, Shortest Paths',
    color: 'cyan',
    modules: 5,
    problems: 300,
    order: 3,
    posX: 20,
    posY: 40,
  },
  {
    slug: 'tech-park',
    name: 'Tech Park',
    subtitle: 'Phase 4 - Algo Avancés',
    icon: '🏢',
    image: '/images/algobog/icons/algobog-techpark-icon.png',
    banner: '/images/algobog/banners/algobog-techpark-banner.png',
    description: 'Backtracking, Dynamic Programming, Segment Trees, Fenwick Trees',
    color: 'purple',
    modules: 5,
    problems: 400,
    order: 4,
    posX: 80,
    posY: 40,
  },
  {
    slug: 'research',
    name: 'Research Campus',
    subtitle: 'Phase 5 - Spécialisation',
    icon: '🔬',
    image: '/images/algobog/icons/algobog-research-icon.png',
    banner: '/images/algobog/banners/algobog-research-banner.png',
    description: 'Greedy, Bit Manipulation, Math, System Design, Concurrency',
    color: 'pink',
    modules: 5,
    problems: 400,
    order: 5,
    posX: 35,
    posY: 15,
  },
  {
    slug: 'skyline',
    name: 'Skyline Tower',
    subtitle: 'Phase 6 - Expert',
    icon: '🗼',
    image: '/images/algobog/icons/algobog-skyline-icon.png',
    banner: '/images/algobog/banners/algobog-skyline-banner.png',
    description: 'Advanced DP, Hard Graphs, String Algorithms, Contest Problems',
    color: 'amber',
    modules: 4,
    problems: 600,
    order: 6,
    posX: 65,
    posY: 15,
  },
];

// Metro connections between districts
const METRO_CONNECTIONS = [
  { from: 'downtown', to: 'industrial', line: 'green' },
  { from: 'downtown', to: 'transit', line: 'cyan' },
  { from: 'industrial', to: 'tech-park', line: 'orange' },
  { from: 'transit', to: 'tech-park', line: 'purple' },
  { from: 'transit', to: 'research', line: 'pink' },
  { from: 'tech-park', to: 'research', line: 'pink' },
  { from: 'research', to: 'skyline', line: 'amber' },
];

const COLOR_CLASSES: Record<string, {
  bg: string;
  border: string;
  text: string;
  glow: string;
  gradient: string;
  neon: string;
}> = {
  green: {
    bg: 'bg-gradient-to-br from-green-500 to-emerald-700',
    border: 'border-green-400',
    text: 'text-green-400',
    glow: 'shadow-green-500/50',
    gradient: 'from-green-500 to-emerald-700',
    neon: '#22c55e',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-500 to-amber-700',
    border: 'border-orange-400',
    text: 'text-orange-400',
    glow: 'shadow-orange-500/50',
    gradient: 'from-orange-500 to-amber-700',
    neon: '#f97316',
  },
  cyan: {
    bg: 'bg-gradient-to-br from-cyan-500 to-teal-700',
    border: 'border-cyan-400',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-500/50',
    gradient: 'from-cyan-500 to-teal-700',
    neon: '#06b6d4',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-500 to-violet-700',
    border: 'border-purple-400',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/50',
    gradient: 'from-purple-500 to-violet-700',
    neon: '#a855f7',
  },
  pink: {
    bg: 'bg-gradient-to-br from-pink-500 to-rose-700',
    border: 'border-pink-400',
    text: 'text-pink-400',
    glow: 'shadow-pink-500/50',
    gradient: 'from-pink-500 to-rose-700',
    neon: '#ec4899',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-500 to-yellow-600',
    border: 'border-amber-400',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/50',
    gradient: 'from-amber-500 to-yellow-600',
    neon: '#f59e0b',
  },
};

interface CityMapProps {
  userProgress: Record<string, { completed: number; total: number }>;
  unlockAll?: boolean;
}

export default function CityMap({ userProgress, unlockAll }: CityMapProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<typeof DISTRICTS[0] | null>(null);
  const [animatedConnections, setAnimatedConnections] = useState<string[]>([]);

  // Animate metro connections on mount
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedConnections(prev => {
        const next = [...prev];
        const randomConn = METRO_CONNECTIONS[Math.floor(Math.random() * METRO_CONNECTIONS.length)];
        const key = `${randomConn.from}-${randomConn.to}`;
        if (!next.includes(key)) {
          next.push(key);
          setTimeout(() => {
            setAnimatedConnections(p => p.filter(k => k !== key));
          }, 2000);
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const districtBySlug = new Map(DISTRICTS.map(d => [d.slug, d]));

  const isDistrictUnlocked = (district: typeof DISTRICTS[0]) => {
    if (unlockAll) return true;
    if (district.order === 1) return true;
    // Check if previous district has 50% completion
    const prevDistrict = DISTRICTS.find(d => d.order === district.order - 1);
    if (!prevDistrict) return true;
    const prevProgress = userProgress[prevDistrict.slug];
    if (!prevProgress) return false;
    return (prevProgress.completed / prevProgress.total) >= 0.5;
  };

  const getDistrictProgress = (slug: string) => {
    const progress = userProgress[slug];
    if (!progress) return 0;
    return Math.round((progress.completed / progress.total) * 100);
  };

  return (
    <div className="relative w-full min-h-[600px] md:min-h-[700px] rounded-xl border-4 border-black overflow-hidden">
      {/* Worldmap background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/algobog/worldmaps/algobog-worldmap.png"
          alt="ALGOBOG City Map"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better contrast with UI elements */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Floating city lights - kept for extra ambiance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              backgroundColor: ['#22c55e', '#f97316', '#06b6d4', '#a855f7', '#ec4899', '#f59e0b'][Math.floor(Math.random() * 6)],
              opacity: 0.2 + Math.random() * 0.3,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Metro connections SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Animated dash pattern */}
          <pattern id="metroPattern" patternUnits="userSpaceOnUse" width="20" height="1">
            <rect width="10" height="1" fill="currentColor" />
          </pattern>
        </defs>

        {METRO_CONNECTIONS.map((conn, idx) => {
          const fromDistrict = districtBySlug.get(conn.from);
          const toDistrict = districtBySlug.get(conn.to);
          if (!fromDistrict || !toDistrict) return null;

          const fromUnlocked = isDistrictUnlocked(fromDistrict);
          const toUnlocked = isDistrictUnlocked(toDistrict);
          const pathUnlocked = fromUnlocked && toUnlocked;
          const connKey = `${conn.from}-${conn.to}`;
          const isAnimated = animatedConnections.includes(connKey);
          const colors = COLOR_CLASSES[conn.line];

          // Calculate control point for curved line
          const midX = (fromDistrict.posX + toDistrict.posX) / 2;
          const midY = (fromDistrict.posY + toDistrict.posY) / 2;
          const offset = 10;

          return (
            <g key={idx}>
              {/* Metro line background */}
              <path
                d={`M ${fromDistrict.posX}% ${fromDistrict.posY}% Q ${midX + offset}% ${midY - offset}% ${toDistrict.posX}% ${toDistrict.posY}%`}
                fill="none"
                stroke={pathUnlocked ? colors.neon : '#374151'}
                strokeWidth={pathUnlocked ? '6' : '3'}
                strokeLinecap="round"
                opacity={pathUnlocked ? 0.3 : 0.2}
              />
              {/* Metro line foreground */}
              <path
                d={`M ${fromDistrict.posX}% ${fromDistrict.posY}% Q ${midX + offset}% ${midY - offset}% ${toDistrict.posX}% ${toDistrict.posY}%`}
                fill="none"
                stroke={pathUnlocked ? colors.neon : '#4b5563'}
                strokeWidth={pathUnlocked ? '3' : '2'}
                strokeLinecap="round"
                strokeDasharray={pathUnlocked ? (isAnimated ? '10,5' : undefined) : '8,8'}
                opacity={pathUnlocked ? 0.8 : 0.4}
                filter={pathUnlocked && isAnimated ? 'url(#neonGlow)' : undefined}
                style={isAnimated ? {
                  animation: 'dash 1s linear infinite',
                } : undefined}
              />
            </g>
          );
        })}
      </svg>

      {/* District nodes */}
      {DISTRICTS.map(district => {
        const unlocked = isDistrictUnlocked(district);
        const progress = getDistrictProgress(district.slug);
        const colors = COLOR_CLASSES[district.color];
        const isHovered = hoveredDistrict === district.slug;
        const completedProblems = userProgress[district.slug]?.completed || 0;

        return (
          <div
            key={district.slug}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{
              left: `${district.posX}%`,
              top: `${district.posY}%`,
              zIndex: isHovered ? 30 : 10,
            }}
            onMouseEnter={() => setHoveredDistrict(district.slug)}
            onMouseLeave={() => setHoveredDistrict(null)}
          >
            {/* District building with generated image */}
            <button
              onClick={() => unlocked && setSelectedDistrict(district)}
              disabled={!unlocked}
              className={`
                relative group
                w-20 h-20 md:w-28 md:h-28
                rounded-lg overflow-hidden
                border-4 ${unlocked ? colors.border : 'border-gray-600'}
                ${unlocked ? `shadow-lg shadow-${district.color}-500/50 hover:shadow-xl hover:scale-110` : 'opacity-50 grayscale'}
                transition-all duration-300
                ${isHovered && unlocked ? 'scale-110' : ''}
              `}
            >
              {/* District icon image */}
              <Image
                src={district.image}
                alt={district.name}
                fill
                className="object-cover"
              />

              {/* Neon border glow effect */}
              {unlocked && (
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    boxShadow: `inset 0 0 15px ${colors.neon}`,
                  }}
                />
              )}

              {/* Lock overlay */}
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                  <span className="text-3xl">🔒</span>
                </div>
              )}

              {/* Phase badge */}
              <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${unlocked ? 'bg-black/70 text-white' : 'bg-gray-800/80 text-gray-500'}`}>
                PHASE {district.order}
              </div>

              {/* Progress bar inside building */}
              {unlocked && progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                  <div
                    className={`h-full ${colors.bg} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Completion badge */}
              {progress === 100 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-yellow-600 shadow-lg z-20">
                  <span className="text-xs">⭐</span>
                </div>
              )}
            </button>

            {/* District name label */}
            <div className={`
              absolute top-full mt-3 left-1/2 -translate-x-1/2
              whitespace-nowrap text-center
              ${unlocked ? 'text-white' : 'text-gray-500'}
              font-bold text-sm md:text-base font-mono
              transition-all duration-300
              ${isHovered ? 'scale-110' : ''}
            `}>
              <div className={isHovered && unlocked ? colors.text : ''}>
                {district.name}
              </div>
              {unlocked && (
                <div className={`text-xs ${colors.text} opacity-70`}>
                  {completedProblems}/{district.problems}
                </div>
              )}
            </div>

            {/* Hover tooltip */}
            {isHovered && unlocked && (
              <div
                className={`
                  absolute w-64 overflow-hidden
                  bg-black/95 backdrop-blur-sm
                  border-2 ${colors.border}
                  rounded-lg text-sm z-40
                  ${district.posY < 30 ? 'top-full mt-16' : 'bottom-full mb-4'}
                  left-1/2 -translate-x-1/2
                `}
                style={{
                  boxShadow: `0 0 30px ${colors.neon}40`,
                }}
              >
                {/* Mini banner preview */}
                <div className="relative h-16 w-full">
                  <Image
                    src={district.banner}
                    alt={district.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                  <div className={`absolute bottom-2 left-3 font-bold ${colors.text} flex items-center gap-2`}>
                    {district.name}
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-gray-500 text-xs mb-2">{district.subtitle}</div>
                  <div className="text-gray-400 text-xs mb-3">{district.description}</div>
                  <div className="flex justify-between text-xs border-t border-gray-700 pt-2">
                    <span className="text-gray-500">
                      🏢 {district.modules} modules
                    </span>
                    <span className={colors.text}>
                      {progress}% complété
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* District detail modal */}
      {selectedDistrict && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDistrict(null)}
        >
          <div
            className={`
              relative max-w-lg w-full
              bg-gradient-to-br from-[#1a1a2e] to-[#0a0a1a]
              border-4 ${COLOR_CLASSES[selectedDistrict.color].border}
              shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
              rounded-lg overflow-hidden
            `}
            style={{
              boxShadow: `0 0 60px ${COLOR_CLASSES[selectedDistrict.color].neon}30`,
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header with banner image */}
            <div className="h-36 relative">
              <Image
                src={selectedDistrict.banner}
                alt={selectedDistrict.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-6 flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-white/30">
                  <Image
                    src={selectedDistrict.image}
                    alt={selectedDistrict.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-mono drop-shadow-lg">{selectedDistrict.name}</h2>
                  <div className={`text-sm ${COLOR_CLASSES[selectedDistrict.color].text} drop-shadow`}>
                    {selectedDistrict.subtitle}
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded font-mono text-sm text-white/90 backdrop-blur-sm">
                PHASE {selectedDistrict.order}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-400 mb-4">{selectedDistrict.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/30 rounded-lg p-3 border border-gray-800">
                  <div className="text-2xl font-bold text-white">{selectedDistrict.modules}</div>
                  <div className="text-xs text-gray-500">Modules</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3 border border-gray-800">
                  <div className="text-2xl font-bold text-white">{selectedDistrict.problems}</div>
                  <div className="text-xs text-gray-500">Problèmes</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progression</span>
                  <span className={`font-bold ${COLOR_CLASSES[selectedDistrict.color].text}`}>
                    {getDistrictProgress(selectedDistrict.slug)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${COLOR_CLASSES[selectedDistrict.color].bg} transition-all duration-500`}
                    style={{ width: `${getDistrictProgress(selectedDistrict.slug)}%` }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Link
                  href={`/algobog/district/${selectedDistrict.slug}`}
                  className={`
                    flex-1 py-3 px-4 text-center font-bold font-mono
                    ${COLOR_CLASSES[selectedDistrict.color].bg}
                    text-white rounded-lg
                    border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    hover:translate-x-1 hover:translate-y-1 hover:shadow-none
                    transition-all duration-150
                  `}
                >
                  EXPLORER
                </Link>
                <button
                  onClick={() => setSelectedDistrict(null)}
                  className="py-3 px-6 bg-gray-800 text-white rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 font-mono"
                >
                  FERMER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-400 border border-gray-700">
        <div className="font-mono font-bold text-white mb-2">MÉTRO ALGOBOG</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-1 rounded bg-green-500" />
          <span>Ligne active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 rounded bg-gray-600 opacity-50" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #4b5563, #4b5563 4px, transparent 4px, transparent 8px)' }} />
          <span>Verrouillé</span>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 text-xs border border-gray-700">
        <div className="font-mono font-bold text-purple-400 mb-1">ALGOBOG CITY</div>
        <div className="text-gray-400">
          {DISTRICTS.length} districts • {DISTRICTS.reduce((sum, d) => sum + d.modules, 0)} modules
        </div>
        <div className="text-gray-500">
          {DISTRICTS.reduce((sum, d) => sum + d.problems, 0)} problèmes algorithmiques
        </div>
      </div>

      {/* CSS for animation */}
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -30;
          }
        }
      `}</style>
    </div>
  );
}
