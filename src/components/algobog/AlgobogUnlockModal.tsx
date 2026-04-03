"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface AlgobogUnlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetType: 'district' | 'building' | 'problem';
    targetSlug: string;
    targetTitle: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    onUnlocked?: () => void;
}

const TARGET_LABELS: Record<string, string> = {
    district: 'District',
    building: 'Building',
    problem: 'Problème',
};

export default function AlgobogUnlockModal({
    isOpen,
    onClose,
    targetType,
    targetSlug,
    targetTitle,
    difficulty,
    onUnlocked,
}: AlgobogUnlockModalProps) {
    const { user, getJWT } = useAuth();
    const [loading, setLoading] = useState(true);
    const [unlocking, setUnlocking] = useState(false);
    const [cost, setCost] = useState<number | null>(null);
    const [userBalance, setUserBalance] = useState<number | null>(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isOpen || !user) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setSuccess(false);

            try {
                const jwt = await getJWT();
                if (!jwt) {
                    setError('Session invalide');
                    setLoading(false);
                    return;
                }

                const params = new URLSearchParams({
                    targetType,
                    targetSlug,
                });

                const response = await fetch(`/api/algobog/unlock?${params}`, {
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCost(data.cost);
                    setUserBalance(data.userBalance);
                    setHasAccess(data.hasAccess);
                } else {
                    setError('Erreur lors du chargement');
                }
            } catch (err) {
                console.error('Error fetching algobog unlock data:', err);
                setError('Erreur de connexion');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen, user, targetType, targetSlug, getJWT]);

    const handleUnlock = async () => {
        if (!user || cost === null || userBalance === null) return;

        setUnlocking(true);
        setError(null);

        try {
            const jwt = await getJWT();
            if (!jwt) {
                setError('Session invalide');
                return;
            }

            const response = await fetch('/api/algobog/unlock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    targetType,
                    targetSlug,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setUserBalance(data.newBalance);
                if (onUnlocked) {
                    timerRef.current = setTimeout(() => {
                        onUnlocked();
                    }, 1500);
                }
            } else {
                if (response.status === 402) {
                    setError(`Gemmes insuffisantes (${data.balance ?? userBalance}/${data.required ?? cost})`);
                } else {
                    setError(data.error || 'Erreur lors du déblocage');
                }
            }
        } catch (err) {
            console.error('Error unlocking algobog:', err);
            setError('Erreur de connexion');
        } finally {
            setUnlocking(false);
        }
    };

    if (!isOpen) return null;

    const canAfford = userBalance !== null && cost !== null && userBalance >= cost;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
            <div
                className="bg-[#1a2e1a] border-4 border-purple-500 rounded-lg p-6 max-w-md w-full mx-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-purple-400 font-mono">DÉBLOQUER AVEC GEMMES</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-8">
                        <svg className="animate-spin h-8 w-8 mx-auto text-purple-400" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-gray-400 mt-2">Chargement...</p>
                    </div>
                ) : hasAccess ? (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">✅</div>
                        <h3 className="text-2xl font-bold text-green-400 mb-2">Déjà débloqué</h3>
                        <p className="text-gray-300">
                            <span className="font-bold">{targetTitle}</span> est accessible
                        </p>
                    </div>
                ) : success ? (
                    <div className="text-center py-8">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-2xl font-bold text-green-400 mb-2">Débloqué !</h3>
                        <p className="text-gray-300">
                            <span className="font-bold">{targetTitle}</span> est maintenant accessible
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Target info */}
                        <div className="bg-black/30 rounded p-4 mb-4">
                            <p className="text-gray-400 text-sm mb-1">{TARGET_LABELS[targetType]}</p>
                            <p className="text-white font-bold">{targetTitle}</p>
                            {difficulty && (
                                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-mono rounded border ${
                                    difficulty === 'easy' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
                                    difficulty === 'medium' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                                    'text-red-400 border-red-500/30 bg-red-500/10'
                                }`}>
                                    {difficulty.toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* Cost display */}
                        <div className="flex items-center justify-between bg-purple-900/30 rounded p-4 mb-4">
                            <div>
                                <p className="text-gray-400 text-sm">Coût du déblocage</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-2xl">💎</span>
                                    <span className="text-2xl font-bold text-purple-300">{cost}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-400 text-sm">Votre solde</p>
                                <div className="flex items-center gap-2 mt-1 justify-end">
                                    <span className="text-2xl">💎</span>
                                    <span className={`text-2xl font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                                        {userBalance}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-900/30 border border-red-500 rounded p-3 mb-4 text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Action buttons */}
                        {canAfford ? (
                            <button
                                onClick={handleUnlock}
                                disabled={unlocking}
                                className="w-full py-3 bg-purple-600 text-white font-bold border-4 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {unlocking ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Déblocage...
                                    </span>
                                ) : (
                                    <>DÉBLOQUER POUR 💎 {cost}</>
                                )}
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <div className="bg-yellow-900/30 border border-yellow-500 rounded p-3 text-yellow-300 text-sm text-center">
                                    Gemmes insuffisantes. Il vous manque {cost !== null && userBalance !== null ? cost - userBalance : '?'} 💎
                                </div>
                                <Link
                                    href="/shop"
                                    className="block w-full py-3 bg-purple-600 text-white font-bold text-center border-4 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                                >
                                    ACHETER DES GEMMES
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
