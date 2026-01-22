"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { account } from '@/lib/appwrite/client';
import Link from 'next/link';

import { UserRole } from '@/lib/appwrite/types';

interface UserStats {
    $id: string;
    name: string;
    email: string;
    emailVerification: boolean;
    registration: string;
    lastActivity: string;
    role: UserRole;
    stats: {
        jsLevelsCompleted: number;
        cExercisesCompleted: number;
        totalXP: number;
    };
}

interface GlobalStats {
    totalUsers: number;
    totalJsSubmissions: number;
    totalCSubmissions: number;
    activeToday: number;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
}

const ROLE_STYLES: Record<UserRole, { bg: string; text: string; label: string }> = {
    admin: { bg: 'bg-red-500/30', text: 'text-red-400', label: 'ADMIN' },
    moderator: { bg: 'bg-purple-500/30', text: 'text-purple-400', label: 'MOD' },
    user: { bg: 'bg-gray-700', text: 'text-gray-400', label: 'User' },
};

// Skeleton for table rows
function TableRowSkeleton() {
    return (
        <tr className="border-b border-gray-800 animate-pulse">
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-700 rounded-full" />
                    <div className="h-4 w-24 bg-gray-700 rounded" />
                </div>
            </td>
            <td className="px-4 py-3"><div className="h-4 w-32 bg-gray-700 rounded" /></td>
            <td className="px-4 py-3 text-center"><div className="h-4 w-8 bg-gray-700 rounded mx-auto" /></td>
            <td className="px-4 py-3 text-center"><div className="h-4 w-8 bg-gray-700 rounded mx-auto" /></td>
            <td className="px-4 py-3 text-center"><div className="h-4 w-12 bg-gray-700 rounded mx-auto" /></td>
            <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-700 rounded" /></td>
            <td className="px-4 py-3"><div className="h-6 w-16 bg-gray-700 rounded" /></td>
        </tr>
    );
}

export default function AdminPage() {
    const { user, isLoading, isAdmin } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<UserStats[]>([]);
    const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingRole, setUpdatingRole] = useState<string | null>(null);

    // Search and pagination state
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<'registration' | 'name' | 'xp'>('registration');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchInput, setSearchInput] = useState('');

    const ITEMS_PER_PAGE = 25;

    // Fetch users with pagination
    const fetchUsers = useCallback(async (page: number, search: string) => {
        if (!user || !isAdmin) return;

        try {
            setLoading(true);
            setError('');

            const jwt = await account.createJWT();

            const params = new URLSearchParams({
                page: page.toString(),
                limit: ITEMS_PER_PAGE.toString(),
                search,
                sortBy,
                sortOrder,
            });

            const response = await fetch(`/api/admin/users?${params}`, {
                headers: {
                    'Authorization': `Bearer ${jwt.jwt}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch admin data');
            }

            const data = await response.json();
            setUsers(data.users);
            setPagination(data.pagination);

            // Only update global stats on first page
            if (data.stats) {
                setGlobalStats(data.stats);
            }
        } catch (err) {
            console.error('Admin fetch error:', err);
            setError('Impossible de charger les donnees admin');
        } finally {
            setLoading(false);
        }
    }, [user, isAdmin, sortBy, sortOrder]);

    // Update user role
    const updateUserRole = async (userId: string, newRole: UserRole) => {
        try {
            setUpdatingRole(userId);
            const jwt = await account.createJWT();

            const response = await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${jwt.jwt}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update role');
            }

            // Update local state
            setUsers(prev => prev.map(u =>
                u.$id === userId ? { ...u, role: newRole } : u
            ));
        } catch (err) {
            console.error('Update role error:', err);
            setError('Impossible de modifier le role');
        } finally {
            setUpdatingRole(null);
        }
    };

    // Handle search submit
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(searchInput);
        setCurrentPage(1);
    };

    // Handle sort change
    const handleSort = (column: 'registration' | 'name' | 'xp') => {
        if (sortBy === column) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    // Clear search
    const clearSearch = () => {
        setSearchInput('');
        setSearchQuery('');
        setCurrentPage(1);
    };

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        } else if (!isLoading && !isAdmin) {
            router.push('/profile');
        }
    }, [isLoading, user, isAdmin, router]);

    useEffect(() => {
        fetchUsers(currentPage, searchQuery);
    }, [fetchUsers, currentPage, searchQuery]);

    if (isLoading || !user || !isAdmin) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-green-400">
                <svg className="animate-spin h-10 w-10 mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p>Verification des droits admin...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0f0a] py-8 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-red-500 font-mono">
                            ADMIN PANEL
                        </h1>
                        <p className="text-green-400/70 font-mono">
                            Gestion des utilisateurs et statistiques
                        </p>
                    </div>
                    <Link
                        href="/profile"
                        className="px-4 py-2 bg-gray-800 text-white rounded border-2 border-gray-600 hover:border-green-500 transition-colors"
                    >
                        Retour
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-500/20 border-2 border-red-500 text-red-400 p-4 rounded-lg mb-6 font-mono">
                        {error}
                    </div>
                )}

                {/* Global Stats */}
                {globalStats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-black/50 border-2 border-blue-500 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-blue-400">{globalStats.totalUsers}</div>
                            <div className="text-blue-400/60 text-sm">Utilisateurs</div>
                        </div>
                        <div className="bg-black/50 border-2 border-green-500 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-green-400">{globalStats.totalJsSubmissions}</div>
                            <div className="text-green-400/60 text-sm">JS Submissions</div>
                        </div>
                        <div className="bg-black/50 border-2 border-orange-500 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-orange-400">{globalStats.totalCSubmissions}</div>
                            <div className="text-orange-400/60 text-sm">C Submissions</div>
                        </div>
                        <div className="bg-black/50 border-2 border-purple-500 rounded-lg p-4 text-center">
                            <div className="text-3xl font-bold text-purple-400">{globalStats.activeToday}</div>
                            <div className="text-purple-400/60 text-sm">Actifs aujourd&apos;hui</div>
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Rechercher par nom..."
                                className="w-full px-4 py-2 bg-black/50 border-2 border-gray-700 rounded-lg text-white font-mono focus:border-green-500 focus:outline-none"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white font-mono font-bold rounded-lg hover:bg-green-500 transition-colors"
                        >
                            Rechercher
                        </button>
                    </form>
                    {searchQuery && (
                        <p className="mt-2 text-gray-400 text-sm font-mono">
                            Recherche : &quot;{searchQuery}&quot; - {pagination?.total || 0} résultat(s)
                        </p>
                    )}
                </div>

                {/* Users Table */}
                <div className="bg-black/30 border-2 border-gray-700 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white font-mono">
                            Utilisateurs {pagination && `(${pagination.total})`}
                        </h2>
                        {pagination && (
                            <span className="text-gray-400 text-sm font-mono">
                                Page {pagination.page}/{pagination.totalPages}
                            </span>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm font-mono">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th
                                        className="px-4 py-3 text-left text-gray-400 cursor-pointer hover:text-white"
                                        onClick={() => handleSort('name')}
                                    >
                                        Utilisateur {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-gray-400">Email</th>
                                    <th className="px-4 py-3 text-center text-gray-400">JS</th>
                                    <th className="px-4 py-3 text-center text-gray-400">C</th>
                                    <th
                                        className="px-4 py-3 text-center text-gray-400 cursor-pointer hover:text-white"
                                        onClick={() => handleSort('xp')}
                                    >
                                        XP {sortBy === 'xp' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-gray-400 cursor-pointer hover:text-white"
                                        onClick={() => handleSort('registration')}
                                    >
                                        Inscription {sortBy === 'registration' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-gray-400">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    // Skeleton loading
                                    Array.from({ length: 10 }).map((_, i) => (
                                        <TableRowSkeleton key={i} />
                                    ))
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                            {searchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur'}
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr
                                            key={u.$id}
                                            className={`border-b border-gray-800 hover:bg-gray-800/30 transition-colors ${u.role === 'admin' ? 'bg-red-900/20' : u.role === 'moderator' ? 'bg-purple-900/20' : ''}`}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold">
                                                        {u.name?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <span className="text-white">{u.name || 'Sans nom'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400">
                                                {u.email}
                                                {u.emailVerification && (
                                                    <span className="ml-2 text-green-400" title="Email verifie">✓</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center text-green-400">
                                                {u.stats.jsLevelsCompleted}
                                            </td>
                                            <td className="px-4 py-3 text-center text-orange-400">
                                                {u.stats.cExercisesCompleted}
                                            </td>
                                            <td className="px-4 py-3 text-center text-yellow-400 font-bold">
                                                {u.stats.totalXP}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {new Date(u.registration).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => updateUserRole(u.$id, e.target.value as UserRole)}
                                                    disabled={updatingRole === u.$id || u.$id === user?.$id}
                                                    className={`px-2 py-1 rounded text-xs font-bold border-0 cursor-pointer ${ROLE_STYLES[u.role].bg} ${ROLE_STYLES[u.role].text} ${updatingRole === u.$id ? 'opacity-50' : ''} ${u.$id === user?.$id ? 'cursor-not-allowed' : ''}`}
                                                >
                                                    <option value="user" className="bg-gray-800 text-gray-400">User</option>
                                                    <option value="moderator" className="bg-gray-800 text-purple-400">Moderator</option>
                                                    <option value="admin" className="bg-gray-800 text-red-400">Admin</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="bg-gray-800/50 px-4 py-3 border-t border-gray-700 flex items-center justify-between">
                            <div className="text-gray-400 text-sm">
                                Affichage {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={pagination.page === 1}
                                    className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                                >
                                    ««
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={pagination.page === 1}
                                    className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                                >
                                    «
                                </button>

                                {/* Page numbers */}
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (pagination.page <= 3) {
                                        pageNum = i + 1;
                                    } else if (pagination.page >= pagination.totalPages - 2) {
                                        pageNum = pagination.totalPages - 4 + i;
                                    } else {
                                        pageNum = pagination.page - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 rounded ${pagination.page === pageNum ? 'bg-green-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                                >
                                    »
                                </button>
                                <button
                                    onClick={() => setCurrentPage(pagination.totalPages)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                                >
                                    »»
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
