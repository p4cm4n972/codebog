'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import CityMap from '@/components/algobog/CityMap';

// District stats for header
const DISTRICTS = [
  { slug: 'downtown', problems: 400 },
  { slug: 'industrial', problems: 400 },
  { slug: 'transit', problems: 300 },
  { slug: 'tech-park', problems: 400 },
  { slug: 'research', problems: 400 },
  { slug: 'skyline', problems: 600 },
];

const TOTAL_PROBLEMS = DISTRICTS.reduce((sum, d) => sum + d.problems, 0);
const TOTAL_MODULES = 33;

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="h-12 bg-gray-800 rounded w-64 mx-auto mb-2 animate-pulse" />
          <div className="h-4 bg-gray-800 rounded w-96 mx-auto animate-pulse" />
        </div>
        <div className="h-[600px] bg-gray-800/50 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default function AlgobogPage() {
  const { user, isLoading, isAdmin, isModerator } = useAuth();
  const router = useRouter();
  const unlockAll = isAdmin || isModerator;

  const [loading, setLoading] = useState(true);
  const [districtProgress, setDistrictProgress] = useState<Record<string, { completed: number; total: number }>>({});

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;

      // TODO: Fetch actual progress from API
      await new Promise(resolve => setTimeout(resolve, 300));

      // Initialize with 0 progress
      const progress: Record<string, { completed: number; total: number }> = {};
      DISTRICTS.forEach(d => {
        progress[d.slug] = { completed: 0, total: d.problems };
      });

      setDistrictProgress(progress);
      setLoading(false);
    };

    loadProgress();
  }, [user]);

  if (isLoading || !user || loading) {
    return <PageSkeleton />;
  }

  const totalCompleted = Object.values(districtProgress).reduce((sum, p) => sum + p.completed, 0);
  const overallProgress = Math.round((totalCompleted / TOTAL_PROBLEMS) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a1a] py-6 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 font-mono mb-2">
            ALGOBOG
          </h1>
          <p className="text-purple-300/70 font-mono text-lg">
            La Cité des Algorithmes
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <div className="bg-black/50 border border-purple-500/50 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-xl">📊</span>
            <div>
              <div className="text-purple-400 font-bold text-lg">{overallProgress}%</div>
              <div className="text-purple-400/60 text-xs">{totalCompleted}/{TOTAL_PROBLEMS}</div>
            </div>
          </div>

          <div className="bg-black/50 border border-cyan-500/50 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-xl">🏙️</span>
            <div>
              <div className="text-cyan-400 font-bold text-lg">6</div>
              <div className="text-cyan-400/60 text-xs">Districts</div>
            </div>
          </div>

          <div className="bg-black/50 border border-amber-500/50 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-xl">🏢</span>
            <div>
              <div className="text-amber-400 font-bold text-lg">{TOTAL_MODULES}</div>
              <div className="text-amber-400/60 text-xs">Modules</div>
            </div>
          </div>

          <div className="bg-black/50 border border-green-500/50 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <div className="text-green-400 font-bold text-lg">{TOTAL_PROBLEMS}</div>
              <div className="text-green-400/60 text-xs">Problèmes</div>
            </div>
          </div>
        </div>

        {/* Construction banner */}
        <div className="bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-amber-900/30 border border-purple-500/30 rounded-lg p-4 mb-6 text-center">
          <span className="text-2xl mb-1 inline-block">🚧</span>
          <p className="text-purple-400 font-mono text-sm font-bold">
            En Construction
          </p>
          <p className="text-gray-500 text-xs">
            Les problèmes algorithmiques sont en cours d&apos;import. Explorez la carte pour découvrir les districts.
          </p>
        </div>

        {/* City Map */}
        <CityMap
          userProgress={districtProgress}
          unlockAll={unlockAll}
        />

        {/* Instructions */}
        <div className="mt-6 text-center text-gray-500 font-mono text-xs">
          <p>Cliquez sur un district débloqué pour explorer ses modules</p>
          <p className="mt-1">Complétez 50% d&apos;un district pour débloquer le suivant</p>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-400 transition-colors font-mono text-sm"
          >
            <span>←</span>
            <span>Retour à l&apos;accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
