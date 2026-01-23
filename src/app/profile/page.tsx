"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite/client';
import { Query } from 'appwrite';
import GemBalance from '@/components/GemBalance';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

interface Submission {
  exerciseSlug: string;
  passed: boolean;
  submittedAt: string;
  type: 'js' | 'c';
}

interface GemTransaction {
  $id: string;
  type: 'purchase' | 'unlock' | 'refund';
  amount: number;
  description: string;
  exerciseSlug?: string;
  createdAt: string;
}

interface PiscineStats {
  totalExercises: number;
  completedExercises: number;
  totalSubmissions: number;
}

interface Stats {
  jsbog: PiscineStats;
  cbog: PiscineStats;
  recentSubmissions: Submission[];
}

// Rank system based on combined progress
function getRank(jsCompleted: number, jsTotal: number, cCompleted: number, cTotal: number): { name: string; color: string; emoji: string } {
  const totalCompleted = jsCompleted + cCompleted;
  const total = jsTotal + cTotal;
  const percentage = total > 0 ? (totalCompleted / total) * 100 : 0;

  if (percentage === 100) return { name: 'Maître du Bog', color: 'text-yellow-400', emoji: '👑' };
  if (percentage >= 80) return { name: 'Sorcier du Code', color: 'text-purple-400', emoji: '🧙' };
  if (percentage >= 60) return { name: 'Guerrier Digital', color: 'text-blue-400', emoji: '⚔️' };
  if (percentage >= 40) return { name: 'Explorateur', color: 'text-green-400', emoji: '🧭' };
  if (percentage >= 20) return { name: 'Apprenti', color: 'text-cyan-400', emoji: '📚' };
  if (percentage > 0) return { name: 'Initié', color: 'text-gray-400', emoji: '🌱' };
  return { name: 'Larve du Bog', color: 'text-gray-500', emoji: '🐛' };
}

export default function ProfilePage() {
  const { user, isLoading, logout, getJWT } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [transactions, setTransactions] = useState<GemTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setLoadingStats(true);

        // Fetch all data in parallel
        // Note: JSBOG uses 'js-levels' and 'js-submissions' collections (world map)
        const [
          jsExercisesResponse,
          jsSubmissionsResponse,
          cExercisesResponse,
          cSubmissionsResponse,
        ] = await Promise.all([
          databases.listDocuments(DATABASE_ID, 'js-levels'),
          databases.listDocuments(DATABASE_ID, 'js-submissions', [
            Query.equal('userId', user.$id),
            Query.orderDesc('submittedAt'),
          ]),
          databases.listDocuments(DATABASE_ID, 'c-exercises'),
          databases.listDocuments(DATABASE_ID, 'c-submissions', [
            Query.equal('userId', user.$id),
            Query.orderDesc('submittedAt'),
          ]),
        ]);

        const jsSubmissions = jsSubmissionsResponse.documents as unknown as Omit<Submission, 'type'>[];
        const cSubmissions = cSubmissionsResponse.documents as unknown as Omit<Submission, 'type'>[];

        // Get unique completed exercise slugs for each piscine
        const jsCompletedSlugs = new Set(
          jsSubmissions.filter(s => s.passed).map(s => s.exerciseSlug)
        );
        const cCompletedSlugs = new Set(
          cSubmissions.filter(s => s.passed).map(s => s.exerciseSlug)
        );

        // Combine recent submissions with type
        const allSubmissions: Submission[] = [
          ...jsSubmissions.map(s => ({ ...s, type: 'js' as const })),
          ...cSubmissions.map(s => ({ ...s, type: 'c' as const })),
        ].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

        setStats({
          jsbog: {
            totalExercises: jsExercisesResponse.total,
            completedExercises: jsCompletedSlugs.size,
            totalSubmissions: jsSubmissions.length,
          },
          cbog: {
            totalExercises: cExercisesResponse.total,
            completedExercises: cCompletedSlugs.size,
            totalSubmissions: cSubmissions.length,
          },
          recentSubmissions: allSubmissions.slice(0, 8),
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user]);

  // Fetch gem transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      try {
        setLoadingTransactions(true);
        const jwt = await getJWT();
        if (!jwt) return;

        const response = await fetch('/api/gems/transactions', {
          headers: {
            'Authorization': `Bearer ${jwt}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions || []);
        }
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [user, getJWT]);

  // Show skeleton while loading auth or stats
  if (isLoading || (user && loadingStats)) {
    return (
      <main className="min-h-screen bg-[#0a0f0a] font-mono text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              <div className="h-10 w-20 bg-green-900/50 border-4 border-green-900/30" />
              <div className="h-10 w-20 bg-blue-900/50 border-4 border-blue-900/30" />
            </div>
            <div className="h-10 w-64 bg-green-900/30 rounded" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Info Card skeleton */}
            <div className="bg-black border-4 border-green-500/50 p-6">
              <div className="h-6 w-32 bg-yellow-900/50 rounded mb-6" />
              <div className="space-y-4">
                <div className="h-5 w-48 bg-gray-700 rounded" />
                <div className="h-5 w-56 bg-gray-700 rounded" />
                <div className="h-5 w-40 bg-gray-700 rounded" />
                <div className="h-5 w-44 bg-gray-700 rounded" />
                <div className="pt-4 border-t border-green-800">
                  <div className="h-5 w-36 bg-purple-900/50 rounded" />
                </div>
              </div>
            </div>

            {/* Global Stats Card skeleton */}
            <div className="bg-black border-4 border-yellow-400/50 p-6">
              <div className="h-6 w-48 bg-yellow-900/50 rounded mb-6" />
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <div className="h-4 w-16 bg-gray-700 rounded" />
                    <div className="h-6 w-16 bg-gray-700 rounded" />
                  </div>
                  <div className="w-full bg-gray-800 h-4 border border-gray-700" />
                  <div className="h-3 w-24 bg-gray-700/50 rounded mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border border-gray-700 rounded">
                    <div className="h-8 w-12 bg-gray-700 rounded mx-auto mb-1" />
                    <div className="h-3 w-20 bg-gray-700/50 rounded mx-auto" />
                  </div>
                  <div className="text-center p-3 border border-gray-700 rounded">
                    <div className="h-8 w-12 bg-gray-700 rounded mx-auto mb-1" />
                    <div className="h-3 w-20 bg-gray-700/50 rounded mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Piscine Stats skeleton */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black border-4 border-green-500/50 p-6">
              <div className="flex justify-between mb-4">
                <div className="h-6 w-20 bg-green-900/50 rounded" />
                <div className="h-4 w-24 bg-green-900/30 rounded" />
              </div>
              <div className="space-y-3">
                <div className="w-full bg-gray-800 h-3 border border-green-700/50" />
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-700 rounded" />
                  <div className="h-4 w-8 bg-gray-700 rounded" />
                </div>
              </div>
            </div>
            <div className="bg-black border-4 border-blue-500/50 p-6">
              <div className="flex justify-between mb-4">
                <div className="h-6 w-20 bg-blue-900/50 rounded" />
                <div className="h-4 w-24 bg-blue-900/30 rounded" />
              </div>
              <div className="space-y-3">
                <div className="w-full bg-gray-800 h-3 border border-blue-700/50" />
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-700 rounded" />
                  <div className="h-4 w-8 bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity skeleton */}
          <div className="mt-6 bg-black border-4 border-gray-700/50 p-6">
            <div className="h-6 w-40 bg-yellow-900/50 rounded mb-6" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-gray-700 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-700 rounded" />
                    <div className="w-8 h-5 bg-gray-700 rounded" />
                    <div className="w-32 h-5 bg-yellow-900/30 rounded" />
                  </div>
                  <div className="w-24 h-4 bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Gem History skeleton */}
          <div className="mt-6 bg-black border-4 border-purple-500/50 p-6">
            <div className="flex justify-between mb-6">
              <div className="h-6 w-44 bg-purple-900/50 rounded" />
              <div className="h-4 w-24 bg-purple-900/30 rounded" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-purple-900/30 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-900/50 rounded" />
                    <div className="w-20 h-5 bg-purple-900/30 rounded" />
                    <div className="w-32 h-4 bg-gray-700 rounded" />
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-5 bg-gray-700 rounded mb-1" />
                    <div className="w-20 h-3 bg-gray-700/50 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support skeleton */}
          <div className="mt-6 bg-black border-4 border-[#ff5e5b]/50 p-6 text-center">
            <div className="h-6 w-48 bg-[#ff5e5b]/30 rounded mx-auto mb-4" />
            <div className="h-4 w-80 bg-gray-700/50 rounded mx-auto mb-4" />
            <div className="h-12 w-48 bg-[#ff5e5b]/30 rounded mx-auto" />
          </div>

          {/* Logout skeleton */}
          <div className="mt-8 flex justify-center">
            <div className="h-16 w-40 bg-red-900/30 border-4 border-black/50 rounded" />
          </div>
        </div>
      </main>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return null;
  }

  const rank = stats ? getRank(
    stats.jsbog.completedExercises,
    stats.jsbog.totalExercises,
    stats.cbog.completedExercises,
    stats.cbog.totalExercises
  ) : null;

  const totalCompleted = stats ? stats.jsbog.completedExercises + stats.cbog.completedExercises : 0;
  const totalExercises = stats ? stats.jsbog.totalExercises + stats.cbog.totalExercises : 0;
  const totalProgress = totalExercises > 0 ? (totalCompleted / totalExercises) * 100 : 0;

  return (
    <main className="min-h-screen bg-[#0a0f0a] font-mono text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <Link href="/jsbog">
              <button className="px-4 py-2 bg-green-500 text-black font-mono font-bold border-4 border-black hover:bg-green-400 transition-colors">
                JSBOG
              </button>
            </Link>
            <Link href="/cbog">
              <button className="px-4 py-2 bg-blue-500 text-black font-mono font-bold border-4 border-black hover:bg-blue-400 transition-colors">
                CBOG
              </button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-[#2ecc71]">&gt; USER_PROFILE_</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Info Card */}
          <div className="bg-black border-4 border-green-500 p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-6">INFORMATIONS</h2>
            <div className="space-y-4 text-lg">
              <p><span className="text-green-400">NAME:</span> {user.name}</p>
              <p><span className="text-green-400">EMAIL:</span> {user.email}</p>
              <p><span className="text-green-400">JOINED:</span> {new Date(user.$createdAt).toLocaleDateString('fr-FR')}</p>
              {rank && (
                <p>
                  <span className="text-green-400">RANK:</span>{' '}
                  <span className={rank.color}>{rank.emoji} {rank.name}</span>
                </p>
              )}
              {/* Gem Balance in User Info */}
              <div className="pt-4 border-t border-green-800">
                <span className="text-green-400">GEMMES:</span>{' '}
                <GemBalance showLink={false} className="inline-flex ml-2" />
                <Link href="/shop" className="ml-2 text-purple-400 hover:text-purple-300 text-sm">
                  [Boutique]
                </Link>
              </div>
            </div>
          </div>

          {/* Global Stats Card */}
          <div className="bg-black border-4 border-yellow-400 p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-6">PROGRESSION GLOBALE</h2>
            {loadingStats ? (
              <p className="text-green-400">Chargement...</p>
            ) : stats ? (
              <div className="space-y-4">
                {/* Global Progress Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">TOTAL</span>
                    <span className="text-2xl font-bold text-white">
                      {totalCompleted}/{totalExercises}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-4 border border-gray-700">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${totalProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {totalProgress.toFixed(0)}% complété
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border border-gray-700 rounded">
                    <div className="text-2xl font-bold text-white">{totalCompleted}</div>
                    <div className="text-xs text-gray-400 uppercase">Missions réussies</div>
                  </div>
                  <div className="text-center p-3 border border-gray-700 rounded">
                    <div className="text-2xl font-bold text-yellow-400">
                      {stats.jsbog.totalSubmissions + stats.cbog.totalSubmissions}
                    </div>
                    <div className="text-xs text-gray-400 uppercase">Soumissions</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-red-400">Erreur de chargement</p>
            )}
          </div>
        </div>

        {/* Piscine Stats */}
        {stats && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* JSBOG Stats */}
            <div className="bg-black border-4 border-green-500 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-green-400">JSBOG</h2>
                <span className="text-sm text-green-300">JavaScript</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-green-300">Progression</span>
                    <span className="font-bold text-green-400">
                      {stats.jsbog.completedExercises}/{stats.jsbog.totalExercises}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-3 border border-green-700">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${stats.jsbog.totalExercises > 0 ? (stats.jsbog.completedExercises / stats.jsbog.totalExercises) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Soumissions:</span>
                  <span className="text-green-400">{stats.jsbog.totalSubmissions}</span>
                </div>
              </div>
            </div>

            {/* CBOG Stats */}
            <div className="bg-black border-4 border-blue-500 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-400">CBOG</h2>
                <span className="text-sm text-blue-300">C Language</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-blue-300">Progression</span>
                    <span className="font-bold text-blue-400">
                      {stats.cbog.completedExercises}/{stats.cbog.totalExercises}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-3 border border-blue-700">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${stats.cbog.totalExercises > 0 ? (stats.cbog.completedExercises / stats.cbog.totalExercises) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Soumissions:</span>
                  <span className="text-blue-400">{stats.cbog.totalSubmissions}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mt-6 bg-black border-4 border-gray-700 p-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-6">ACTIVITÉ RÉCENTE</h2>
          {loadingStats ? (
            <p className="text-gray-400">Chargement...</p>
          ) : stats && stats.recentSubmissions.length > 0 ? (
            <div className="space-y-3">
              {stats.recentSubmissions.map((submission, index) => (
                <Link
                  href={submission.type === 'js' ? `/jsbog/${submission.exerciseSlug}` : `/cbog/${submission.exerciseSlug}`}
                  key={index}
                >
                  <div className="flex items-center justify-between p-3 border border-gray-700 rounded hover:border-gray-500 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className={submission.passed ? (submission.type === 'js' ? 'text-green-400' : 'text-blue-400') : 'text-red-400'}>
                        {submission.passed ? '✓' : '✗'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${submission.type === 'js' ? 'bg-green-900/50 text-green-400' : 'bg-blue-900/50 text-blue-400'}`}>
                        {submission.type === 'js' ? 'JS' : 'C'}
                      </span>
                      <span className="text-yellow-400">/{submission.exerciseSlug}</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(submission.submittedAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Aucune activité pour le moment. Commence une mission !</p>
          )}
        </div>

        {/* Gem Transaction History */}
        <div className="mt-6 bg-black border-4 border-purple-500 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-purple-400">💎 HISTORIQUE GEMMES</h2>
            <Link href="/shop" className="text-sm text-purple-300 hover:text-purple-200">
              [Boutique →]
            </Link>
          </div>
          {loadingTransactions ? (
            <p className="text-gray-400">Chargement...</p>
          ) : transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.$id}
                  className="flex items-center justify-between p-3 border border-purple-900/50 rounded"
                >
                  <div className="flex items-center gap-3">
                    <span className={
                      tx.type === 'purchase' ? 'text-green-400' :
                      tx.type === 'unlock' ? 'text-yellow-400' :
                      'text-blue-400'
                    }>
                      {tx.type === 'purchase' ? '💰' :
                       tx.type === 'unlock' ? '🔓' :
                       '↩️'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      tx.type === 'purchase' ? 'bg-green-900/50 text-green-400' :
                      tx.type === 'unlock' ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-blue-900/50 text-blue-400'
                    }`}>
                      {tx.type === 'purchase' ? 'ACHAT' :
                       tx.type === 'unlock' ? 'DÉBLOCAGE' :
                       'REMBOURSEMENT'}
                    </span>
                    <span className="text-gray-300 text-sm">{tx.description}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} 💎
                    </span>
                    <div className="text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Aucune transaction. <Link href="/shop" className="text-purple-400 hover:underline">Achète des gemmes</Link> pour débloquer des exercices !</p>
          )}
        </div>

        {/* Support Section */}
        <div className="mt-6 bg-black border-4 border-[#ff5e5b] p-6 text-center">
          <h2 className="text-xl font-bold text-[#ff5e5b] mb-4">SOUTENIR LE PROJET</h2>
          <p className="text-gray-400 mb-4 text-sm">
            CODEBOG est gratuit et open source. Si tu apprécies le projet, tu peux nous soutenir !
          </p>
          <a
            href="https://ko-fi.com/codebog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff5e5b] text-white font-bold rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311z"/>
            </svg>
            Buy me a coffee
          </a>
        </div>

        {/* Logout Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={logout}
            className="px-10 py-5 bg-[#e74c3c] text-white text-2xl font-bold uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 rounded-none"
          >
            LOG_OUT
          </button>
        </div>
      </div>
    </main>
  );
}
