"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { GEM_PACKS, type GemPackId } from '@/lib/gem-config';

interface GemTransaction {
    $id: string;
    type: 'purchase' | 'unlock' | 'refund';
    amount: number;
    description: string;
    exerciseSlug?: string;
    createdAt: string;
}

// Component that handles search params - must be wrapped in Suspense
function ShopSearchParamsHandler({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('success') === 'true') {
            onSuccess();
        } else if (searchParams.get('canceled') === 'true') {
            onCancel();
        }
    }, [searchParams, onSuccess, onCancel]);

    return null;
}

function ShopContent() {
    const { user, isLoading, getJWT } = useAuth();
    const router = useRouter();
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<GemTransaction[]>([]);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [purchasing, setPurchasing] = useState<GemPackId | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSuccess = () => {
        setSuccessMessage('Paiement réussi ! Vos gemmes ont été créditées.');
        setTimeout(() => {
            window.location.href = '/shop';
        }, 3000);
    };

    const handleCancel = () => {
        setError('Paiement annulé.');
    };

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    // Fetch balance and transactions
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                const jwt = await getJWT();
                if (!jwt) return;

                const response = await fetch('/api/gems/balance', {
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setBalance(data.balance);
                    setTransactions(data.recentTransactions || []);
                }
            } catch (err) {
                console.error('Failed to fetch balance:', err);
            } finally {
                setLoadingBalance(false);
            }
        };

        fetchData();
    }, [user, getJWT]);

    const handlePurchase = async (packId: GemPackId) => {
        if (!user) return;

        setPurchasing(packId);
        setError(null);

        try {
            const jwt = await getJWT();
            if (!jwt) {
                setError('Session expirée');
                return;
            }

            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
                body: JSON.stringify({ packId }),
            });

            const data = await response.json();

            if (response.ok && data.url) {
                window.location.href = data.url;
            } else {
                setError(data.error || 'Erreur lors de la création du paiement');
            }
        } catch (err) {
            console.error('Purchase error:', err);
            setError('Erreur de connexion');
        } finally {
            setPurchasing(null);
        }
    };

    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-green-400">
                <svg className="animate-spin h-10 w-10 mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0f0a] font-mono text-white p-4 md:p-8">
            <Suspense fallback={null}>
                <ShopSearchParamsHandler onSuccess={handleSuccess} onCancel={handleCancel} />
            </Suspense>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                    >
                        ← Retour au profil
                    </Link>
                    <h1 className="text-4xl font-bold text-purple-400">&gt; BOUTIQUE_</h1>
                    <p className="text-gray-400 mt-2">Achetez des gemmes pour débloquer des exercices</p>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-900/30 border-4 border-green-500 rounded-lg text-green-300">
                        {successMessage}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border-4 border-red-500 rounded-lg text-red-300">
                        {error}
                    </div>
                )}

                {/* Current Balance */}
                <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-4 border-purple-500 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Votre solde actuel</p>
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">💎</span>
                                <span className="text-4xl font-bold text-purple-300">
                                    {loadingBalance ? '...' : balance?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-sm">Gemmes</p>
                            <p className="text-sm text-purple-300">Débloquez des exercices</p>
                        </div>
                    </div>
                </div>

                {/* Gem Packs */}
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">PACKS DE GEMMES</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-stretch">
                    {GEM_PACKS.map((pack) => {
                        const isPopular = pack.id === 'pack_500';
                        const isBestValue = pack.id === 'pack_1000';

                        return (
                            <div
                                key={pack.id}
                                className={`relative p-6 border-4 rounded-lg transition-all flex flex-col ${
                                    isPopular
                                        ? 'border-yellow-400 bg-yellow-900/10'
                                        : isBestValue
                                        ? 'border-green-400 bg-green-900/10'
                                        : 'border-purple-500 bg-purple-900/10'
                                }`}
                            >
                                {/* Badge */}
                                {isPopular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded">
                                        POPULAIRE
                                    </div>
                                )}
                                {isBestValue && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-400 text-black text-xs font-bold rounded">
                                        MEILLEUR RAPPORT
                                    </div>
                                )}

                                {/* Gems amount */}
                                <div className="text-center mb-4">
                                    <span className="text-5xl">💎</span>
                                    <div className="text-3xl font-bold text-white mt-2">
                                        {pack.gems.toLocaleString()}
                                    </div>
                                    <div className="text-gray-400 text-sm">gemmes</div>
                                </div>

                                {/* Price */}
                                <div className="text-center mb-4">
                                    <span className="text-2xl font-bold text-white">
                                        {(pack.price / 100).toFixed(2)}€
                                    </span>
                                    {pack.gems > 100 && (
                                        <div className="text-green-400 text-sm">
                                            {pack.id === 'pack_500' ? '+25% bonus' : '+33% bonus'}
                                        </div>
                                    )}
                                </div>

                                {/* Spacer to push button to bottom */}
                                <div className="flex-grow"></div>

                                {/* Buy button */}
                                <button
                                    onClick={() => handlePurchase(pack.id)}
                                    disabled={purchasing !== null}
                                    className={`w-full py-3 font-bold border-4 border-black rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                        isPopular
                                            ? 'bg-yellow-400 text-black'
                                            : isBestValue
                                            ? 'bg-green-400 text-black'
                                            : 'bg-purple-600 text-white'
                                    }`}
                                >
                                    {purchasing === pack.id ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Chargement...
                                        </span>
                                    ) : (
                                        'ACHETER'
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* How it works */}
                <div className="mb-8 p-6 bg-black border-4 border-gray-700 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-300 mb-4">COMMENT ÇA MARCHE ?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">1️⃣</span>
                            <div>
                                <p className="font-bold text-white">Achetez des gemmes</p>
                                <p className="text-sm text-gray-400">Paiement sécurisé via Stripe</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">2️⃣</span>
                            <div>
                                <p className="font-bold text-white">Trouvez un exercice verrouillé</p>
                                <p className="text-sm text-gray-400">Dans JSBOG ou CBOG</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">3️⃣</span>
                            <div>
                                <p className="font-bold text-white">Débloquez avec des gemmes</p>
                                <p className="text-sm text-gray-400">Accès immédiat à l'exercice</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                {transactions.length > 0 && (
                    <div className="bg-black border-4 border-gray-700 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-gray-300 mb-4">TRANSACTIONS RÉCENTES</h3>
                        <div className="space-y-3">
                            {transactions.map((tx) => (
                                <div
                                    key={tx.$id}
                                    className="flex items-center justify-between p-3 border border-gray-700 rounded"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xl ${
                                            tx.type === 'purchase' ? 'text-green-400' :
                                            tx.type === 'unlock' ? 'text-purple-400' :
                                            'text-yellow-400'
                                        }`}>
                                            {tx.type === 'purchase' ? '➕' :
                                             tx.type === 'unlock' ? '🔓' : '↩️'}
                                        </span>
                                        <div>
                                            <p className="text-white">{tx.description}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`font-bold ${
                                        tx.amount > 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount} 💎
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer info */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>Les gemmes sont non remboursables. Paiement sécurisé par Stripe.</p>
                    <p className="mt-1">Les prix sont affichés en euros (€) TTC.</p>
                </div>
            </div>
        </main>
    );
}

export default function ShopPage() {
    return <ShopContent />;
}
