'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

// District configuration
const DISTRICTS: Record<string, {
  name: string;
  subtitle: string;
  icon: string;
  description: string;
  gradient: string;
  border: string;
  text: string;
  order: number;
  buildings: Array<{
    slug: string;
    name: string;
    icon: string;
    concepts: string;
    problems: number;
    easy: number;
    medium: number;
    hard: number;
  }>;
}> = {
  downtown: {
    name: 'Downtown',
    subtitle: 'Phase 1 - Fondamentaux',
    icon: '🏛️',
    description: 'Maîtrisez les fondations : arrays, strings, hash maps et techniques de base.',
    gradient: 'from-green-500 to-emerald-700',
    border: 'border-green-500',
    text: 'text-green-400',
    order: 1,
    buildings: [
      { slug: 'array-tower', name: 'Array Tower', icon: '🏢', concepts: 'parcours, manipulation, in-place', problems: 50, easy: 40, medium: 10, hard: 0 },
      { slug: 'string-plaza', name: 'String Plaza', icon: '🏬', concepts: 'manipulation, parsing, palindrome', problems: 50, easy: 35, medium: 15, hard: 0 },
      { slug: 'hash-hub', name: 'Hash Hub', icon: '🏦', concepts: 'lookup O(1), counting, grouping', problems: 50, easy: 30, medium: 20, hard: 0 },
      { slug: 'two-pointers-bridge', name: 'Two Pointers Bridge', icon: '🌉', concepts: 'opposés, même direction, fast/slow', problems: 50, easy: 25, medium: 25, hard: 0 },
      { slug: 'binary-search-center', name: 'Binary Search Center', icon: '🎯', concepts: 'rotated, peak, boundary', problems: 50, easy: 15, medium: 30, hard: 5 },
      { slug: 'sliding-window-mall', name: 'Sliding Window Mall', icon: '🛒', concepts: 'fixed size, variable size, optimal', problems: 50, easy: 15, medium: 30, hard: 5 },
      { slug: 'sorting-station', name: 'Sorting Station', icon: '🚉', concepts: 'quick select, merge sort, bucket', problems: 50, easy: 15, medium: 30, hard: 5 },
      { slug: 'stack-skyscraper', name: 'Stack Skyscraper', icon: '🏙️', concepts: 'monotonic, parsing, backtracking', problems: 50, easy: 20, medium: 25, hard: 5 },
    ],
  },
  industrial: {
    name: 'Industrial Zone',
    subtitle: 'Phase 2 - Structures',
    icon: '🏭',
    description: 'Découvrez les structures de données avancées : listes chaînées, arbres et plus.',
    gradient: 'from-orange-500 to-amber-700',
    border: 'border-orange-500',
    text: 'text-orange-400',
    order: 2,
    buildings: [
      { slug: 'linked-list-factory', name: 'LinkedList Factory', icon: '🏭', concepts: 'insertion, deletion, reversal', problems: 50, easy: 30, medium: 20, hard: 0 },
      { slug: 'queue-warehouse', name: 'Queue Warehouse', icon: '📦', concepts: 'FIFO, priority, deque', problems: 50, easy: 25, medium: 25, hard: 0 },
      { slug: 'tree-greenhouse', name: 'Tree Greenhouse', icon: '🌳', concepts: 'traversal, construction, properties', problems: 75, easy: 30, medium: 35, hard: 10 },
      { slug: 'bst-laboratory', name: 'BST Laboratory', icon: '🔬', concepts: 'search, insert, balance', problems: 75, easy: 20, medium: 40, hard: 15 },
      { slug: 'heap-refinery', name: 'Heap Refinery', icon: '⛽', concepts: 'min/max, k elements, merge', problems: 75, easy: 20, medium: 40, hard: 15 },
      { slug: 'trie-telecom', name: 'Trie Telecom', icon: '📡', concepts: 'prefix, autocomplete, word search', problems: 75, easy: 15, medium: 45, hard: 15 },
    ],
  },
  transit: {
    name: 'Transit Hub',
    subtitle: 'Phase 3 - Graphes',
    icon: '🚇',
    description: 'Naviguez dans les graphes : BFS, DFS, chemins les plus courts.',
    gradient: 'from-cyan-500 to-teal-700',
    border: 'border-cyan-500',
    text: 'text-cyan-400',
    order: 3,
    buildings: [
      { slug: 'bfs-metro', name: 'BFS Metro', icon: '🚇', concepts: 'level order, shortest path, islands', problems: 60, easy: 20, medium: 30, hard: 10 },
      { slug: 'dfs-tunnel', name: 'DFS Tunnel', icon: '🚇', concepts: 'backtracking, cycle detection, paths', problems: 60, easy: 15, medium: 35, hard: 10 },
      { slug: 'topo-terminal', name: 'Topo Terminal', icon: '🚏', concepts: 'ordering, prerequisites, cycles', problems: 60, easy: 15, medium: 35, hard: 10 },
      { slug: 'union-junction', name: 'Union Junction', icon: '🔗', concepts: 'connected components, MST', problems: 60, easy: 10, medium: 35, hard: 15 },
      { slug: 'shortest-path-highway', name: 'Shortest Path Highway', icon: '🛣️', concepts: 'Dijkstra, Bellman-Ford, Floyd-Warshall', problems: 60, easy: 10, medium: 30, hard: 20 },
    ],
  },
  'tech-park': {
    name: 'Tech Park',
    subtitle: 'Phase 4 - Algo Avancés',
    icon: '🏢',
    description: 'Maîtrisez la programmation dynamique et les algorithmes avancés.',
    gradient: 'from-purple-500 to-violet-700',
    border: 'border-purple-500',
    text: 'text-purple-400',
    order: 4,
    buildings: [
      { slug: 'backtrack-incubator', name: 'Backtrack Incubator', icon: '💡', concepts: 'permutations, combinations, pruning', problems: 80, easy: 15, medium: 45, hard: 20 },
      { slug: 'dp-datacenter', name: 'DP Datacenter', icon: '🖥️', concepts: '1D DP, memoization, tabulation', problems: 80, easy: 20, medium: 45, hard: 15 },
      { slug: 'segment-server', name: 'Segment Server', icon: '🗄️', concepts: 'range queries, lazy propagation', problems: 80, easy: 10, medium: 40, hard: 30 },
      { slug: 'fenwick-firewall', name: 'Fenwick Firewall', icon: '🔥', concepts: 'BIT, range updates, prefix sums', problems: 80, easy: 10, medium: 40, hard: 30 },
      { slug: 'dp2d-mainframe', name: 'DP 2D Mainframe', icon: '🖲️', concepts: '2D DP, state machines, interval DP', problems: 80, easy: 5, medium: 35, hard: 40 },
    ],
  },
  research: {
    name: 'Research Campus',
    subtitle: 'Phase 5 - Spécialisation',
    icon: '🔬',
    description: 'Explorez des domaines spécialisés : greedy, bit manipulation, design.',
    gradient: 'from-pink-500 to-rose-700',
    border: 'border-pink-500',
    text: 'text-pink-400',
    order: 5,
    buildings: [
      { slug: 'greedy-lab', name: 'Greedy Lab', icon: '🧪', concepts: 'intervals, scheduling, optimal choices', problems: 80, easy: 20, medium: 40, hard: 20 },
      { slug: 'bitwise-bunker', name: 'Bitwise Bunker', icon: '💾', concepts: 'XOR, masks, bit manipulation', problems: 80, easy: 25, medium: 40, hard: 15 },
      { slug: 'math-observatory', name: 'Math Observatory', icon: '🔭', concepts: 'number theory, primes, combinatorics', problems: 80, easy: 20, medium: 40, hard: 20 },
      { slug: 'design-studio', name: 'Design Studio', icon: '🎨', concepts: 'OOP, system design, patterns', problems: 80, easy: 10, medium: 40, hard: 30 },
      { slug: 'concurrency-reactor', name: 'Concurrency Reactor', icon: '⚛️', concepts: 'threads, locks, async patterns', problems: 80, easy: 10, medium: 35, hard: 35 },
    ],
  },
  skyline: {
    name: 'Skyline Tower',
    subtitle: 'Phase 6 - Expert',
    icon: '🗼',
    description: 'Atteignez le sommet : problèmes de niveau compétition.',
    gradient: 'from-amber-500 to-yellow-600',
    border: 'border-amber-500',
    text: 'text-amber-400',
    order: 6,
    buildings: [
      { slug: 'advanced-dp-penthouse', name: 'Advanced DP Penthouse', icon: '🏰', concepts: 'bitmask DP, digit DP, optimization', problems: 150, easy: 0, medium: 50, hard: 100 },
      { slug: 'hard-graph-helipad', name: 'Hard Graph Helipad', icon: '🚁', concepts: 'network flow, bipartite, advanced', problems: 150, easy: 0, medium: 40, hard: 110 },
      { slug: 'string-algo-antenna', name: 'String Algo Antenna', icon: '📻', concepts: 'KMP, suffix arrays, Aho-Corasick', problems: 150, easy: 0, medium: 50, hard: 100 },
      { slug: 'contest-crown', name: 'Contest Crown', icon: '👑', concepts: 'mixed contest problems', problems: 150, easy: 0, medium: 30, hard: 120 },
    ],
  },
};

function BuildingCardSkeleton() {
  return (
    <div className="bg-[#1a1a2e] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-lg p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-gray-700 rounded-lg" />
        <div className="flex-1">
          <div className="h-5 bg-gray-700 rounded w-3/4 mb-1" />
          <div className="h-3 bg-gray-800 rounded w-1/2" />
        </div>
      </div>
      <div className="h-2 bg-gray-800 rounded-full" />
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <div className="h-48 bg-gray-800 animate-pulse" />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <BuildingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface BuildingCardProps {
  building: typeof DISTRICTS['downtown']['buildings'][0];
  districtSlug: string;
  borderColor: string;
  textColor: string;
  isLocked: boolean;
  progress: number;
  completedProblems: number;
}

function BuildingCard({ building, districtSlug, borderColor, textColor, isLocked, progress, completedProblems }: BuildingCardProps) {
  return (
    <Link
      href={isLocked ? '#' : `/algobog/district/${districtSlug}/${building.slug}`}
      className={`
        block bg-[#1a1a2e] border-4 ${borderColor}
        shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
        rounded-lg p-4
        transition-all duration-200
        ${isLocked
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
        }
      `}
      onClick={(e) => isLocked && e.preventDefault()}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-black/30 rounded-lg flex items-center justify-center text-2xl relative">
          {building.icon}
          {isLocked && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <span className="text-lg">🔒</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold font-mono ${textColor} truncate`}>
            {building.name}
          </h3>
          <p className="text-gray-500 text-xs truncate">
            {building.concepts}
          </p>
        </div>
      </div>

      {/* Difficulty breakdown */}
      <div className="flex gap-2 mb-2 text-xs font-mono">
        <span className="text-green-400">E:{building.easy}</span>
        <span className="text-yellow-400">M:{building.medium}</span>
        <span className="text-red-400">H:{building.hard}</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${textColor.replace('text', 'bg')} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1 font-mono">
        <span>{completedProblems}/{building.problems}</span>
        <span>{progress}%</span>
      </div>
    </Link>
  );
}

export default function DistrictPage() {
  const { user, isLoading, isAdmin, isModerator } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const unlockAll = isAdmin || isModerator;

  const [loading, setLoading] = useState(true);
  const [buildingProgress, setBuildingProgress] = useState<Record<string, { completed: number; total: number }>>({});

  const district = DISTRICTS[slug];

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!district) {
      router.push('/algobog');
      return;
    }

    const loadProgress = async () => {
      if (!user) return;

      // TODO: Fetch actual progress from API
      await new Promise(resolve => setTimeout(resolve, 200));

      // Initialize with 0 progress
      const progress: Record<string, { completed: number; total: number }> = {};
      district.buildings.forEach(b => {
        progress[b.slug] = { completed: 0, total: b.problems };
      });

      setBuildingProgress(progress);
      setLoading(false);
    };

    loadProgress();
  }, [user, district, router]);

  if (isLoading || !user || loading || !district) {
    return <PageSkeleton />;
  }

  const totalProblems = district.buildings.reduce((sum, b) => sum + b.problems, 0);
  const totalCompleted = Object.values(buildingProgress).reduce((sum, p) => sum + p.completed, 0);
  const progressPercent = Math.round((totalCompleted / totalProblems) * 100);

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      {/* Banner */}
      <div className={`h-48 bg-gradient-to-r ${district.gradient} relative`}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a] via-transparent to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-end justify-between">
              <div>
                <span className={`inline-block text-4xl mb-2`}>
                  {district.icon}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white font-mono">
                  {district.name}
                </h1>
                <p className={`text-lg font-mono ${district.text}`}>
                  {district.subtitle}
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
                    stroke="currentColor"
                    className={district.text}
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
          <Link href="/algobog" className="text-gray-500 hover:text-purple-400 transition-colors">
            ALGOBOG
          </Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className={district.text}>{district.name}</span>
        </nav>

        {/* Description */}
        <p className="text-gray-400 mb-6 max-w-2xl">
          {district.description}
        </p>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="bg-black/30 border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
            <span>🏢</span>
            <span className="text-gray-400 font-mono text-sm">
              {district.buildings.length} buildings
            </span>
          </div>
          <div className="bg-black/30 border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
            <span>⚡</span>
            <span className="text-gray-400 font-mono text-sm">
              {totalCompleted}/{totalProblems} problèmes
            </span>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚧</span>
            <div>
              <p className="text-purple-400 font-mono text-sm font-bold">
                En Construction
              </p>
              <p className="text-gray-500 text-xs">
                Les problèmes de ce district seront importés prochainement.
              </p>
            </div>
          </div>
        </div>

        {/* Buildings grid */}
        <h2 className="text-xl font-bold text-white font-mono mb-4 flex items-center gap-2">
          <span className={district.text}>▸</span>
          Buildings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {district.buildings.map((building, index) => {
            const progress = buildingProgress[building.slug] || { completed: 0, total: building.problems };
            const progressPercent = Math.round((progress.completed / progress.total) * 100);

            // First building always unlocked, others based on previous completion
            const isLocked = !unlockAll && index > 0;

            return (
              <BuildingCard
                key={building.slug}
                building={building}
                districtSlug={slug}
                borderColor={district.border}
                textColor={district.text}
                isLocked={isLocked}
                progress={progressPercent}
                completedProblems={progress.completed}
              />
            );
          })}
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/algobog"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-400 transition-colors font-mono text-sm"
          >
            <span>←</span>
            <span>Retour à la carte</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
