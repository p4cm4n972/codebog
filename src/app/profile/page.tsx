"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite/client';
import { Query } from 'appwrite';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

interface Submission {
  exerciseSlug: string;
  passed: boolean;
  submittedAt: string;
}

interface Stats {
  totalExercises: number;
  completedExercises: number;
  totalSubmissions: number;
  recentSubmissions: Submission[];
}

// Rank system based on progress
function getRank(completed: number, total: number): { name: string; color: string; emoji: string } {
  const percentage = (completed / total) * 100;

  if (percentage === 100) return { name: 'Maître du Bog', color: 'text-yellow-400', emoji: '👑' };
  if (percentage >= 80) return { name: 'Sorcier du Code', color: 'text-purple-400', emoji: '🧙' };
  if (percentage >= 60) return { name: 'Guerrier Digital', color: 'text-blue-400', emoji: '⚔️' };
  if (percentage >= 40) return { name: 'Explorateur', color: 'text-green-400', emoji: '🧭' };
  if (percentage >= 20) return { name: 'Apprenti', color: 'text-cyan-400', emoji: '📚' };
  if (percentage > 0) return { name: 'Initié', color: 'text-gray-400', emoji: '🌱' };
  return { name: 'Larve du Bog', color: 'text-gray-500', emoji: '🐛' };
}

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

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

        // Fetch exercises count and user submissions in parallel
        const [exercisesResponse, submissionsResponse] = await Promise.all([
          databases.listDocuments(DATABASE_ID, 'exercises'),
          databases.listDocuments(DATABASE_ID, 'submissions', [
            Query.equal('userId', user.$id),
            Query.orderDesc('submittedAt'),
          ]),
        ]);

        const submissions = submissionsResponse.documents as unknown as Submission[];

        // Get unique completed exercise slugs
        const completedSlugs = new Set(
          submissions.filter(s => s.passed).map(s => s.exerciseSlug)
        );

        setStats({
          totalExercises: exercisesResponse.total,
          completedExercises: completedSlugs.size,
          totalSubmissions: submissions.length,
          recentSubmissions: submissions.slice(0, 5),
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-white">
        <p>Loading session...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const rank = stats ? getRank(stats.completedExercises, stats.totalExercises) : null;
  const progressPercentage = stats ? (stats.completedExercises / stats.totalExercises) * 100 : 0;

  return (
    <main className="min-h-screen bg-[#0a0f0a] font-mono text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/jsbog">
            <button className="mb-4 px-4 py-2 bg-green-500 text-black font-mono font-bold border-4 border-black hover:bg-green-400 transition-colors">
              ← RETOUR AUX MISSIONS
            </button>
          </Link>
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
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-black border-4 border-yellow-400 p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-6">STATISTIQUES</h2>
            {loadingStats ? (
              <p className="text-green-400">Chargement...</p>
            ) : stats ? (
              <div className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-green-400">PROGRESSION</span>
                    <span className="text-2xl font-bold text-green-400">
                      {stats.completedExercises}/{stats.totalExercises}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-6 border-2 border-green-700">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-green-300 mt-2">
                    {progressPercentage.toFixed(0)}% complété
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border border-green-700 rounded">
                    <div className="text-3xl font-bold text-green-400">{stats.completedExercises}</div>
                    <div className="text-xs text-green-300 uppercase">Missions réussies</div>
                  </div>
                  <div className="text-center p-4 border border-green-700 rounded">
                    <div className="text-3xl font-bold text-yellow-400">{stats.totalSubmissions}</div>
                    <div className="text-xs text-green-300 uppercase">Soumissions</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-red-400">Erreur de chargement</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-black border-4 border-green-500 p-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-6">ACTIVITÉ RÉCENTE</h2>
          {loadingStats ? (
            <p className="text-green-400">Chargement...</p>
          ) : stats && stats.recentSubmissions.length > 0 ? (
            <div className="space-y-3">
              {stats.recentSubmissions.map((submission, index) => (
                <Link href={`/jsbog/${submission.exerciseSlug}`} key={index}>
                  <div className="flex items-center justify-between p-3 border border-gray-700 rounded hover:border-green-500 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <span className={submission.passed ? 'text-green-400' : 'text-red-400'}>
                        {submission.passed ? '✓' : '✗'}
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
