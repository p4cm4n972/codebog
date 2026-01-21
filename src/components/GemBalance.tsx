"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface GemBalanceProps {
    className?: string;
    showLink?: boolean;
}

export default function GemBalance({ className = '', showLink = true }: GemBalanceProps) {
    const { user, getJWT } = useAuth();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            if (!user) {
                setBalance(null);
                setLoading(false);
                return;
            }

            try {
                const jwt = await getJWT();
                if (!jwt) {
                    setLoading(false);
                    return;
                }

                const response = await fetch('/api/gems/balance', {
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setBalance(data.balance);
                }
            } catch (error) {
                console.error('Failed to fetch gem balance:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, [user, getJWT]);

    if (!user || loading) {
        return null;
    }

    const content = (
        <div className={`flex items-center gap-1.5 px-2 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 rounded-lg ${className}`}>
            <span className="text-lg">💎</span>
            <span className="text-purple-300 font-bold text-sm">
                {balance !== null ? balance.toLocaleString() : '...'}
            </span>
        </div>
    );

    if (showLink) {
        return (
            <Link href="/shop" className="hover:scale-105 transition-transform">
                {content}
            </Link>
        );
    }

    return content;
}
