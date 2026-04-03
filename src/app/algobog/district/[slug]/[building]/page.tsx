'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import AlgobogUnlockModal from '@/components/algobog/AlgobogUnlockModal';

// Building slug to generated image mapping
const BUILDING_IMAGES: Record<string, string> = {
  // Downtown - Fondamentaux
  'array-tower': '/images/algobog/icons/algobog-building-arrays.png',
  'string-plaza': '/images/algobog/icons/algobog-building-strings.png',
  'hash-hub': '/images/algobog/icons/algobog-building-hashmaps.png',
  'two-pointers-bridge': '/images/algobog/icons/algobog-building-twopointers.png',
  'binary-search-center': '/images/algobog/icons/algobog-building-binarysearch.png',
  'sliding-window-mall': '/images/algobog/icons/algobog-building-slidingwindow.png',
  'sorting-station': '/images/algobog/icons/algobog-building-sorting.png',
  'stack-skyscraper': '/images/algobog/icons/algobog-building-stack.png',
  // Industrial - Structures
  'linked-list-factory': '/images/algobog/icons/algobog-building-linkedlists.png',
  'queue-warehouse': '/images/algobog/icons/algobog-building-queues.png',
  'tree-greenhouse': '/images/algobog/icons/algobog-building-trees.png',
  'bst-laboratory': '/images/algobog/icons/algobog-building-bst.png',
  'heap-refinery': '/images/algobog/icons/algobog-building-heaps.png',
  'trie-telecom': '/images/algobog/icons/algobog-building-tries.png',
  // Transit - Graphes
  'bfs-metro': '/images/algobog/icons/algobog-building-bfs.png',
  'dfs-tunnel': '/images/algobog/icons/algobog-building-dfs.png',
  'topo-terminal': '/images/algobog/icons/algobog-building-topsort.png',
  'union-junction': '/images/algobog/icons/algobog-building-unionfind.png',
  'shortest-path-highway': '/images/algobog/icons/algobog-building-shortestpath.png',
  // Tech Park - Algo Avancés
  'backtrack-incubator': '/images/algobog/icons/algobog-building-backtracking.png',
  'dp-datacenter': '/images/algobog/icons/algobog-building-dp.png',
  'segment-server': '/images/algobog/icons/algobog-building-segtrees.png',
  'fenwick-firewall': '/images/algobog/icons/algobog-building-fenwick.png',
  'dp2d-mainframe': '/images/algobog/icons/algobog-building-advanceddp.png',
  // Research - Spécialisation
  'greedy-lab': '/images/algobog/icons/algobog-building-greedy.png',
  'bitwise-bunker': '/images/algobog/icons/algobog-building-bits.png',
  'math-observatory': '/images/algobog/icons/algobog-building-math.png',
  'design-studio': '/images/algobog/icons/algobog-building-systemdesign.png',
  'concurrency-reactor': '/images/algobog/icons/algobog-building-concurrency.png',
  // Skyline - Expert
  'advanced-dp-penthouse': '/images/algobog/icons/algobog-building-advanceddp.png',
  'hard-graph-helipad': '/images/algobog/icons/algobog-building-hardgraphs.png',
  'string-algo-antenna': '/images/algobog/icons/algobog-building-stringalgo.png',
  'contest-crown': '/images/algobog/icons/algobog-building-contest.png',
};

// District configuration with buildings
const DISTRICTS: Record<string, {
  name: string;
  banner: string;
  text: string;
  border: string;
  buildings: Record<string, {
    name: string;
    concepts: string;
    problems: number;
    easy: number;
    medium: number;
    hard: number;
  }>;
}> = {
  downtown: {
    name: 'Downtown',
    banner: '/images/algobog/banners/algobog-downtown-banner.png',
    text: 'text-green-400',
    border: 'border-green-500',
    buildings: {
      'array-tower': { name: 'Array Tower', concepts: 'parcours, manipulation, in-place', problems: 50, easy: 40, medium: 10, hard: 0 },
      'string-plaza': { name: 'String Plaza', concepts: 'manipulation, parsing, palindrome', problems: 50, easy: 35, medium: 15, hard: 0 },
      'hash-hub': { name: 'Hash Hub', concepts: 'lookup O(1), counting, grouping', problems: 50, easy: 30, medium: 20, hard: 0 },
      'two-pointers-bridge': { name: 'Two Pointers Bridge', concepts: 'opposés, même direction, fast/slow', problems: 50, easy: 25, medium: 25, hard: 0 },
      'binary-search-center': { name: 'Binary Search Center', concepts: 'rotated, peak, boundary', problems: 50, easy: 15, medium: 30, hard: 5 },
      'sliding-window-mall': { name: 'Sliding Window Mall', concepts: 'fixed size, variable size, optimal', problems: 50, easy: 15, medium: 30, hard: 5 },
      'sorting-station': { name: 'Sorting Station', concepts: 'quick select, merge sort, bucket', problems: 50, easy: 15, medium: 30, hard: 5 },
      'stack-skyscraper': { name: 'Stack Skyscraper', concepts: 'monotonic, parsing, backtracking', problems: 50, easy: 20, medium: 25, hard: 5 },
    },
  },
  industrial: {
    name: 'Industrial Zone',
    banner: '/images/algobog/banners/algobog-industrial-banner.png',
    text: 'text-orange-400',
    border: 'border-orange-500',
    buildings: {
      'linked-list-factory': { name: 'LinkedList Factory', concepts: 'insertion, deletion, reversal', problems: 50, easy: 30, medium: 20, hard: 0 },
      'queue-warehouse': { name: 'Queue Warehouse', concepts: 'FIFO, priority, deque', problems: 50, easy: 25, medium: 25, hard: 0 },
      'tree-greenhouse': { name: 'Tree Greenhouse', concepts: 'traversal, construction, properties', problems: 75, easy: 30, medium: 35, hard: 10 },
      'bst-laboratory': { name: 'BST Laboratory', concepts: 'search, insert, balance', problems: 75, easy: 20, medium: 40, hard: 15 },
      'heap-refinery': { name: 'Heap Refinery', concepts: 'min/max, k elements, merge', problems: 75, easy: 20, medium: 40, hard: 15 },
      'trie-telecom': { name: 'Trie Telecom', concepts: 'prefix, autocomplete, word search', problems: 75, easy: 15, medium: 45, hard: 15 },
    },
  },
  transit: {
    name: 'Transit Hub',
    banner: '/images/algobog/banners/algobog-transit-banner.png',
    text: 'text-cyan-400',
    border: 'border-cyan-500',
    buildings: {
      'bfs-metro': { name: 'BFS Metro', concepts: 'level order, shortest path, islands', problems: 60, easy: 20, medium: 30, hard: 10 },
      'dfs-tunnel': { name: 'DFS Tunnel', concepts: 'backtracking, cycle detection, paths', problems: 60, easy: 15, medium: 35, hard: 10 },
      'topo-terminal': { name: 'Topo Terminal', concepts: 'ordering, prerequisites, cycles', problems: 60, easy: 15, medium: 35, hard: 10 },
      'union-junction': { name: 'Union Junction', concepts: 'connected components, MST', problems: 60, easy: 10, medium: 35, hard: 15 },
      'shortest-path-highway': { name: 'Shortest Path Highway', concepts: 'Dijkstra, Bellman-Ford, Floyd-Warshall', problems: 60, easy: 10, medium: 30, hard: 20 },
    },
  },
  'tech-park': {
    name: 'Tech Park',
    banner: '/images/algobog/banners/algobog-techpark-banner.png',
    text: 'text-purple-400',
    border: 'border-purple-500',
    buildings: {
      'backtrack-incubator': { name: 'Backtrack Incubator', concepts: 'permutations, combinations, pruning', problems: 80, easy: 15, medium: 45, hard: 20 },
      'dp-datacenter': { name: 'DP Datacenter', concepts: '1D DP, memoization, tabulation', problems: 80, easy: 20, medium: 45, hard: 15 },
      'segment-server': { name: 'Segment Server', concepts: 'range queries, lazy propagation', problems: 80, easy: 10, medium: 40, hard: 30 },
      'fenwick-firewall': { name: 'Fenwick Firewall', concepts: 'BIT, range updates, prefix sums', problems: 80, easy: 10, medium: 40, hard: 30 },
      'dp2d-mainframe': { name: 'DP 2D Mainframe', concepts: '2D DP, state machines, interval DP', problems: 80, easy: 5, medium: 35, hard: 40 },
    },
  },
  research: {
    name: 'Research Campus',
    banner: '/images/algobog/banners/algobog-research-banner.png',
    text: 'text-pink-400',
    border: 'border-pink-500',
    buildings: {
      'greedy-lab': { name: 'Greedy Lab', concepts: 'intervals, scheduling, optimal choices', problems: 80, easy: 20, medium: 40, hard: 20 },
      'bitwise-bunker': { name: 'Bitwise Bunker', concepts: 'XOR, masks, bit manipulation', problems: 80, easy: 25, medium: 40, hard: 15 },
      'math-observatory': { name: 'Math Observatory', concepts: 'number theory, primes, combinatorics', problems: 80, easy: 20, medium: 40, hard: 20 },
      'design-studio': { name: 'Design Studio', concepts: 'OOP, system design, patterns', problems: 80, easy: 10, medium: 40, hard: 30 },
      'concurrency-reactor': { name: 'Concurrency Reactor', concepts: 'threads, locks, async patterns', problems: 80, easy: 10, medium: 35, hard: 35 },
    },
  },
  skyline: {
    name: 'Skyline Tower',
    banner: '/images/algobog/banners/algobog-skyline-banner.png',
    text: 'text-amber-400',
    border: 'border-amber-500',
    buildings: {
      'advanced-dp-penthouse': { name: 'Advanced DP Penthouse', concepts: 'bitmask DP, digit DP, optimization', problems: 150, easy: 0, medium: 50, hard: 100 },
      'hard-graph-helipad': { name: 'Hard Graph Helipad', concepts: 'network flow, bipartite, advanced', problems: 150, easy: 0, medium: 40, hard: 110 },
      'string-algo-antenna': { name: 'String Algo Antenna', concepts: 'KMP, suffix arrays, Aho-Corasick', problems: 150, easy: 0, medium: 50, hard: 100 },
      'contest-crown': { name: 'Contest Crown', concepts: 'mixed contest problems', problems: 150, easy: 0, medium: 30, hard: 120 },
    },
  },
};

type Difficulty = 'easy' | 'medium' | 'hard';

interface Problem {
  id: string;
  slug: string;
  title: string;
  order: number;
  difficulty: Difficulty;
  isLocked: boolean;
  isCompleted: boolean;
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      <div className="h-44 bg-gray-800 animate-pulse" />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 w-24 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProblemCardProps {
  problem: Problem;
  districtSlug: string;
  buildingSlug: string;
  textColor: string;
  borderColor: string;
  onUnlockClick?: (problem: Problem) => void;
}

function ProblemCard({ problem, textColor, borderColor, onUnlockClick }: ProblemCardProps) {
  const difficultyColors = {
    easy: 'text-green-400 bg-green-500/10 border-green-500/30',
    medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    hard: 'text-red-400 bg-red-500/10 border-red-500/30',
  };

  const cardClasses = `
    flex items-center gap-4 p-4
    bg-[#1a1a2e] border-2 ${problem.isLocked ? 'border-gray-700' : borderColor}
    rounded-lg
    transition-all duration-200
    ${problem.isLocked
      ? 'opacity-50 cursor-pointer hover:opacity-70'
      : 'hover:bg-[#1f1f3a]'
    }
  `;

  const content = (
    <>
      {/* Order number */}
      <div className={`w-8 h-8 flex items-center justify-center rounded font-mono font-bold ${textColor}`}>
        {problem.order}
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-mono truncate ${problem.isLocked ? 'text-gray-500' : 'text-white'}`}>
          {problem.title}
        </h3>
      </div>

      {/* Difficulty badge */}
      <div className={`px-2 py-1 rounded border text-xs font-mono ${difficultyColors[problem.difficulty]}`}>
        {problem.difficulty.toUpperCase()}
      </div>

      {/* Status */}
      <div className="w-8 h-8 flex items-center justify-center">
        {problem.isLocked ? (
          <span className="text-purple-400 text-xs font-mono">💎</span>
        ) : problem.isCompleted ? (
          <span className="text-green-400">✓</span>
        ) : (
          <span className="text-gray-600">○</span>
        )}
      </div>
    </>
  );

  if (problem.isLocked) {
    return (
      <button onClick={() => onUnlockClick?.(problem)} className={`${cardClasses} w-full text-left`}>
        {content}
      </button>
    );
  }

  return (
    <Link href={`/algobog/problem/${problem.slug}`} className={cardClasses}>
      {content}
    </Link>
  );
}

export default function BuildingPage() {
  const { user, isLoading, getJWT } = useAuth();
  const router = useRouter();
  const params = useParams();
  const districtSlug = params.slug as string;
  const buildingSlug = params.building as string;

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Difficulty>('easy');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [completedCount] = useState({ easy: 0, medium: 0, hard: 0 });
  const [unlockTarget, setUnlockTarget] = useState<Problem | null>(null);

  const district = DISTRICTS[districtSlug];
  const building = district?.buildings[buildingSlug];

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  const loadProblems = useCallback(async () => {
    if (!user) return;

    try {
      const jwt = await getJWT();
      const headers: HeadersInit = {};
      if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`;
      }

      const response = await fetch(`/api/algobog/problems?building=${buildingSlug}`, {
        headers,
      });

      if (!response.ok) {
        console.error('Failed to load problems:', response.status);
        setLoading(false);
        return;
      }

      const data = await response.json();

      const loadedProblems: Problem[] = data.problems.map((p: {
        slug: string;
        title: string;
        order: number;
        difficulty: 'easy' | 'medium' | 'hard';
        isLocked: boolean;
        isCompleted: boolean;
      }) => ({
        id: p.slug,
        slug: p.slug,
        title: p.title,
        order: p.order,
        difficulty: p.difficulty,
        isLocked: p.isLocked,
        isCompleted: p.isCompleted,
      }));

      setProblems(loadedProblems);
    } catch (error) {
      console.error('Error loading problems:', error);
    } finally {
      setLoading(false);
    }
  }, [user, buildingSlug, getJWT]);

  useEffect(() => {
    if (!district || !building) {
      router.push('/algobog');
      return;
    }

    loadProblems();
  }, [district, building, router, loadProblems]);

  if (isLoading || !user || loading || !district || !building) {
    return <PageSkeleton />;
  }

  const filteredProblems = problems.filter(p => p.difficulty === activeTab);
  const totalCompleted = completedCount.easy + completedCount.medium + completedCount.hard;
  const progressPercent = Math.round((totalCompleted / building.problems) * 100);

  const tabs: { key: Difficulty; label: string; count: number; completed: number }[] = [
    { key: 'easy', label: 'Easy', count: building.easy, completed: completedCount.easy },
    { key: 'medium', label: 'Medium', count: building.medium, completed: completedCount.medium },
    { key: 'hard', label: 'Hard', count: building.hard, completed: completedCount.hard },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f0a]">
      {/* Header with building icon */}
      <div className="h-44 relative">
        <Image
          src={district.banner}
          alt={district.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0a] via-black/60 to-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-4">
                {/* Building icon */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-white/30 shadow-lg">
                  <Image
                    src={BUILDING_IMAGES[buildingSlug] || '/images/algobog/icons/algobog-downtown-icon.png'}
                    alt={building.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white font-mono drop-shadow-lg">
                    {building.name}
                  </h1>
                  <p className="text-gray-400 text-sm font-mono">
                    {building.concepts}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <div className={`font-bold font-mono ${district.text}`}>
                    {progressPercent}%
                  </div>
                  <div className="text-gray-500 text-xs font-mono">
                    {totalCompleted}/{building.problems}
                  </div>
                </div>
                <div className="w-16 h-16 relative">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 font-mono text-sm">
          <Link href="/algobog" className="text-gray-500 hover:text-purple-400 transition-colors">
            ALGOBOG
          </Link>
          <span className="text-gray-600 mx-2">/</span>
          <Link href={`/algobog/district/${districtSlug}`} className="text-gray-500 hover:text-purple-400 transition-colors">
            {district.name}
          </Link>
          <span className="text-gray-600 mx-2">/</span>
          <span className={district.text}>{building.name}</span>
        </nav>

        {/* Difficulty tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              disabled={tab.count === 0}
              className={`
                px-4 py-2 rounded-lg font-mono text-sm
                transition-all duration-200
                ${activeTab === tab.key
                  ? `${district.text} bg-white/10 border-2 ${district.border}`
                  : 'text-gray-500 bg-black/30 border-2 border-transparent hover:border-gray-700'
                }
                ${tab.count === 0 ? 'opacity-30 cursor-not-allowed' : ''}
              `}
            >
              <span className={
                tab.key === 'easy' ? 'text-green-400' :
                tab.key === 'medium' ? 'text-yellow-400' : 'text-red-400'
              }>
                {tab.label}
              </span>
              <span className="ml-2 text-gray-600">
                {tab.completed}/{tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚧</span>
            <div>
              <p className="text-purple-400 font-mono text-sm font-bold">
                En Construction
              </p>
              <p className="text-gray-500 text-xs">
                Les problèmes de ce building seront importés prochainement.
              </p>
            </div>
          </div>
        </div>

        {/* Problems list */}
        <div className="space-y-2">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-12 text-gray-600 font-mono">
              Aucun problème {activeTab} dans ce building
            </div>
          ) : (
            filteredProblems.map(problem => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                districtSlug={districtSlug}
                buildingSlug={buildingSlug}
                textColor={district.text}
                borderColor={district.border}
                onUnlockClick={(p) => setUnlockTarget(p)}
              />
            ))
          )}
        </div>

        {/* Stats footer */}
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <div className="bg-black/30 border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-green-400">●</span>
            <span className="text-gray-400 font-mono">
              Easy: {completedCount.easy}/{building.easy}
            </span>
          </div>
          <div className="bg-black/30 border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-yellow-400">●</span>
            <span className="text-gray-400 font-mono">
              Medium: {completedCount.medium}/{building.medium}
            </span>
          </div>
          <div className="bg-black/30 border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-red-400">●</span>
            <span className="text-gray-400 font-mono">
              Hard: {completedCount.hard}/{building.hard}
            </span>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href={`/algobog/district/${districtSlug}`}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-400 transition-colors font-mono text-sm"
          >
            <span>←</span>
            <span>Retour à {district.name}</span>
          </Link>
        </div>
      </div>

      {/* Unlock Modal */}
      <AlgobogUnlockModal
        isOpen={!!unlockTarget}
        onClose={() => setUnlockTarget(null)}
        targetType="problem"
        targetSlug={unlockTarget?.slug || ''}
        targetTitle={unlockTarget?.title || ''}
        difficulty={unlockTarget?.difficulty}
        onUnlocked={() => {
          setUnlockTarget(null);
          setLoading(true);
          loadProblems();
        }}
      />
    </div>
  );
}
