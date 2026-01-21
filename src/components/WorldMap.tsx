'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// World images mapping - place images in public/worlds/
const WORLD_IMAGES: Record<string, string> = {
    'fondations': '/worlds/fondations.png',
    'fp-valley': '/worlds/fp-valley.png',
    'async-forest': '/worlds/async-forest.png',
    'closures-cave': '/worlds/closures-cave.png',
    'oop-temple': '/worlds/oop-temple.png',
    'meta-tower': '/worlds/meta-tower.png',
    'perf-peak': '/worlds/perf-peak.png',
    'itmade-arena': '/worlds/itmade-arena.png',
    'summit': '/worlds/summit.png',
};

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

interface WorldProgress {
    worldSlug: string;
    completedLevels: number;
    totalLevels: number;
}

interface WorldMapProps {
    worlds: World[];
    userProgress: WorldProgress[];
    unlockAll?: boolean; // True for admins and moderators
}

// Path connections between worlds
const WORLD_CONNECTIONS = [
    { from: 'fondations', to: 'fp-valley' },
    { from: 'fondations', to: 'async-forest' },
    { from: 'fondations', to: 'itmade-arena' },
    { from: 'fp-valley', to: 'closures-cave' },
    { from: 'async-forest', to: 'oop-temple' },
    { from: 'closures-cave', to: 'meta-tower' },
    { from: 'oop-temple', to: 'perf-peak' },
    { from: 'meta-tower', to: 'summit' },
    { from: 'perf-peak', to: 'summit' },
];

const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    green: {
        bg: 'bg-gradient-to-br from-green-500 to-green-700',
        border: 'border-green-400',
        text: 'text-green-400',
        glow: 'shadow-green-500/50'
    },
    purple: {
        bg: 'bg-gradient-to-br from-purple-500 to-purple-700',
        border: 'border-purple-400',
        text: 'text-purple-400',
        glow: 'shadow-purple-500/50'
    },
    orange: {
        bg: 'bg-gradient-to-br from-orange-500 to-orange-700',
        border: 'border-orange-400',
        text: 'text-orange-400',
        glow: 'shadow-orange-500/50'
    },
    cyan: {
        bg: 'bg-gradient-to-br from-cyan-500 to-cyan-700',
        border: 'border-cyan-400',
        text: 'text-cyan-400',
        glow: 'shadow-cyan-500/50'
    },
    yellow: {
        bg: 'bg-gradient-to-br from-yellow-500 to-yellow-700',
        border: 'border-yellow-400',
        text: 'text-yellow-400',
        glow: 'shadow-yellow-500/50'
    },
    pink: {
        bg: 'bg-gradient-to-br from-pink-500 to-pink-700',
        border: 'border-pink-400',
        text: 'text-pink-400',
        glow: 'shadow-pink-500/50'
    },
    red: {
        bg: 'bg-gradient-to-br from-red-500 to-red-700',
        border: 'border-red-400',
        text: 'text-red-400',
        glow: 'shadow-red-500/50'
    },
    amber: {
        bg: 'bg-gradient-to-br from-amber-400 to-yellow-600',
        border: 'border-amber-400',
        text: 'text-amber-400',
        glow: 'shadow-amber-500/50'
    },
    slate: {
        bg: 'bg-gradient-to-br from-slate-500 to-slate-700',
        border: 'border-slate-400',
        text: 'text-slate-400',
        glow: 'shadow-slate-500/50'
    }
};

function isWorldUnlocked(world: World, userProgress: WorldProgress[], unlockAll?: boolean): boolean {
    // Admins and moderators have all worlds unlocked
    if (unlockAll) return true;

    if (!world.unlockRequirement) return true;

    try {
        const requirement = JSON.parse(world.unlockRequirement);
        const progress = userProgress.find(p => p.worldSlug === requirement.worldSlug);
        if (!progress) return false;

        const percent = progress.totalLevels > 0
            ? (progress.completedLevels / progress.totalLevels) * 100
            : 0;
        return percent >= requirement.minPercent;
    } catch {
        return true;
    }
}

function getWorldProgress(worldSlug: string, userProgress: WorldProgress[]): number {
    const progress = userProgress.find(p => p.worldSlug === worldSlug);
    if (!progress || progress.totalLevels === 0) return 0;
    return Math.round((progress.completedLevels / progress.totalLevels) * 100);
}

export default function WorldMap({ worlds, userProgress, unlockAll }: WorldMapProps) {
    const [hoveredWorld, setHoveredWorld] = useState<string | null>(null);
    const [selectedWorld, setSelectedWorld] = useState<World | null>(null);

    // Sort worlds by order
    const sortedWorlds = [...worlds].sort((a, b) => a.order - b.order);

    // Get world by slug for connections
    const worldBySlug = new Map(worlds.map(w => [w.slug, w]));

    return (
        <div className="relative w-full min-h-[700px] bg-gradient-to-b from-[#0a1a0a] via-[#0d2818] to-[#0a1a0a] rounded-xl border-4 border-black overflow-hidden">
            {/* Background stars/particles */}
            <div className="absolute inset-0 opacity-30">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* SVG for connection paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {WORLD_CONNECTIONS.map((conn, idx) => {
                    const fromWorld = worldBySlug.get(conn.from);
                    const toWorld = worldBySlug.get(conn.to);
                    if (!fromWorld || !toWorld) return null;

                    const fromUnlocked = isWorldUnlocked(fromWorld, userProgress, unlockAll);
                    const toUnlocked = isWorldUnlocked(toWorld, userProgress, unlockAll);
                    const pathUnlocked = fromUnlocked && toUnlocked;

                    return (
                        <line
                            key={idx}
                            x1={`${fromWorld.posX}%`}
                            y1={`${fromWorld.posY}%`}
                            x2={`${toWorld.posX}%`}
                            y2={`${toWorld.posY}%`}
                            stroke={pathUnlocked ? '#4ade80' : '#374151'}
                            strokeWidth={pathUnlocked ? '4' : '2'}
                            strokeDasharray={pathUnlocked ? undefined : '8,8'}
                            opacity={pathUnlocked ? 0.6 : 0.3}
                            filter={pathUnlocked ? 'url(#glow)' : undefined}
                        />
                    );
                })}
            </svg>

            {/* World nodes */}
            {sortedWorlds.map(world => {
                const unlocked = isWorldUnlocked(world, userProgress, unlockAll);
                const progress = getWorldProgress(world.slug, userProgress);
                const colors = COLOR_CLASSES[world.color] || COLOR_CLASSES.green;
                const isHovered = hoveredWorld === world.slug;

                return (
                    <div
                        key={world.$id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                        style={{
                            left: `${world.posX}%`,
                            top: `${world.posY}%`,
                            zIndex: isHovered ? 20 : 10
                        }}
                        onMouseEnter={() => setHoveredWorld(world.slug)}
                        onMouseLeave={() => setHoveredWorld(null)}
                    >
                        {/* World button */}
                        <button
                            onClick={() => unlocked && setSelectedWorld(world)}
                            disabled={!unlocked}
                            className={`
                                relative group
                                w-20 h-20 md:w-24 md:h-24
                                rounded-full
                                ${WORLD_IMAGES[world.slug] ? 'bg-black/30' : (unlocked ? colors.bg : 'bg-gray-700')}
                                border-4 ${unlocked ? colors.border : 'border-gray-600'}
                                ${unlocked ? `shadow-lg ${colors.glow} hover:shadow-xl hover:scale-110` : 'opacity-60'}
                                transition-all duration-300
                                flex items-center justify-center
                                overflow-hidden
                                ${isHovered && unlocked ? 'scale-110' : ''}
                            `}
                        >
                            {/* Lock icon for locked worlds */}
                            {!unlocked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full z-10">
                                    <span className="text-3xl">🔒</span>
                                </div>
                            )}

                            {/* World image or icon */}
                            {WORLD_IMAGES[world.slug] ? (
                                <Image
                                    src={WORLD_IMAGES[world.slug]}
                                    alt={world.name}
                                    fill
                                    className={`object-cover rounded-full ${!unlocked ? 'opacity-30 grayscale' : ''}`}
                                    sizes="96px"
                                />
                            ) : (
                                <span className={`text-3xl md:text-4xl ${!unlocked ? 'opacity-30' : ''}`}>
                                    {world.icon}
                                </span>
                            )}

                            {/* Progress ring */}
                            {unlocked && progress > 0 && (
                                <svg
                                    className="absolute inset-0 w-full h-full -rotate-90"
                                    viewBox="0 0 100 100"
                                >
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="46"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeWidth="4"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="46"
                                        fill="none"
                                        stroke="#fbbf24"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeDasharray={`${progress * 2.89} 289`}
                                    />
                                </svg>
                            )}

                            {/* Completion badge */}
                            {progress === 100 && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-yellow-600">
                                    <span className="text-xs">⭐</span>
                                </div>
                            )}
                        </button>

                        {/* World name label */}
                        <div className={`
                            absolute top-full mt-2 left-1/2 -translate-x-1/2
                            whitespace-nowrap text-center
                            ${unlocked ? 'text-white' : 'text-gray-500'}
                            font-bold text-sm md:text-base
                            transition-all duration-300
                            ${isHovered ? 'scale-110' : ''}
                        `}>
                            {world.name}
                            {unlocked && progress > 0 && (
                                <div className={`text-xs ${colors.text}`}>
                                    {progress}%
                                </div>
                            )}
                        </div>

                        {/* Hover tooltip */}
                        {isHovered && unlocked && (
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-3 bg-black/90 border border-gray-700 rounded-lg text-sm z-30">
                                <div className="font-bold text-white mb-1">{world.name}</div>
                                <div className="text-gray-400 text-xs mb-2">{world.description}</div>
                                <div className="flex justify-between text-xs">
                                    <span className={colors.text}>{world.totalLevels} niveaux</span>
                                    <span className="text-gray-500">{world.difficulty}</span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* World detail modal */}
            {selectedWorld && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedWorld(null)}
                >
                    <div
                        className={`
                            relative max-w-md w-full
                            bg-[#1a2e1a] border-4 border-black
                            shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                            rounded-lg p-6
                        `}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header with image */}
                        {WORLD_IMAGES[selectedWorld.slug] && (
                            <div className="relative w-full h-32 mb-4 rounded-lg overflow-hidden border-4 border-black">
                                <Image
                                    src={WORLD_IMAGES[selectedWorld.slug]}
                                    alt={selectedWorld.name}
                                    fill
                                    className="object-cover"
                                    sizes="400px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-2 left-3 flex items-center gap-2">
                                    <span className="text-2xl">{selectedWorld.icon}</span>
                                    <h2 className="text-xl font-bold text-white">{selectedWorld.name}</h2>
                                </div>
                            </div>
                        )}
                        {!WORLD_IMAGES[selectedWorld.slug] && (
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`
                                    w-16 h-16 rounded-full flex items-center justify-center
                                    ${COLOR_CLASSES[selectedWorld.color]?.bg || 'bg-green-600'}
                                    border-4 ${COLOR_CLASSES[selectedWorld.color]?.border || 'border-green-400'}
                                `}>
                                    <span className="text-3xl">{selectedWorld.icon}</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedWorld.name}</h2>
                                    <div className={`text-sm ${COLOR_CLASSES[selectedWorld.color]?.text || 'text-green-400'}`}>
                                        {selectedWorld.totalLevels} niveaux - {selectedWorld.difficulty}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <p className="text-gray-300 mb-4">{selectedWorld.description}</p>

                        {/* Progress bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Progression</span>
                                <span className="text-white font-bold">
                                    {getWorldProgress(selectedWorld.slug, userProgress)}%
                                </span>
                            </div>
                            <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${COLOR_CLASSES[selectedWorld.color]?.bg || 'bg-green-600'} transition-all duration-500`}
                                    style={{ width: `${getWorldProgress(selectedWorld.slug, userProgress)}%` }}
                                />
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            <Link
                                href={`/jsbog/world/${selectedWorld.slug}`}
                                className={`
                                    flex-1 py-3 px-4 text-center font-bold
                                    ${COLOR_CLASSES[selectedWorld.color]?.bg || 'bg-green-600'}
                                    text-white rounded-lg
                                    border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                                    hover:translate-x-1 hover:translate-y-1 hover:shadow-none
                                    transition-all duration-150
                                `}
                            >
                                Explorer
                            </Link>
                            <button
                                onClick={() => setSelectedWorld(null)}
                                className="py-3 px-4 bg-gray-700 text-white rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3 text-xs text-gray-400">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Débloqué</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-600" />
                    <span>Verrouillé</span>
                </div>
            </div>
        </div>
    );
}
