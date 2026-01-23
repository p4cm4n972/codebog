"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'codebog_cookie_consent';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            // Small delay to avoid layout shift on page load
            const timer = setTimeout(() => setShowBanner(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        setShowBanner(false);
    };

    const handleRefuse = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'refused');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
            <div className="max-w-4xl mx-auto bg-black border-4 border-green-500 p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-mono">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* Cookie icon and text */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🍪</span>
                            <h3 className="text-lg font-bold text-green-400">Cookies</h3>
                        </div>
                        <p className="text-sm text-gray-300">
                            CODEBOG utilise des cookies essentiels pour le fonctionnement du site
                            (authentification, session). Aucun cookie publicitaire n'est utilisé.{' '}
                            <Link href="/politique-confidentialite" className="text-green-400 hover:underline">
                                En savoir plus
                            </Link>
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={handleRefuse}
                            className="flex-1 md:flex-none px-4 py-2 bg-gray-700 text-white text-sm font-bold border-2 border-gray-600 hover:bg-gray-600 transition-colors"
                        >
                            Refuser
                        </button>
                        <button
                            onClick={handleAccept}
                            className="flex-1 md:flex-none px-6 py-2 bg-green-500 text-black text-sm font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                        >
                            Accepter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
