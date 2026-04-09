"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { databases } from '@/lib/appwrite/client';
import { Query } from 'appwrite';
import GemBalance from './GemBalance';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export default function Navbar() {
    const { user, isLoading, isAdmin, logout } = useAuth();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch user progress (combined JSBOG + CBOG)
    useEffect(() => {
        const fetchProgress = async () => {
            if (!user) return;

            try {
                // JSBOG uses 'js-levels' and 'js-submissions' (world map)
                const [
                    jsExercisesResponse,
                    jsSubmissionsResponse,
                    cExercisesResponse,
                    cSubmissionsResponse,
                ] = await Promise.all([
                    databases.listDocuments(DATABASE_ID, 'js-levels'),
                    databases.listDocuments(DATABASE_ID, 'js-submissions', [
                        Query.equal('userId', user.$id),
                        Query.equal('passed', true),
                    ]),
                    databases.listDocuments(DATABASE_ID, 'c-exercises'),
                    databases.listDocuments(DATABASE_ID, 'c-submissions', [
                        Query.equal('userId', user.$id),
                        Query.equal('passed', true),
                    ]),
                ]);

                const jsCompletedSlugs = new Set(
                    (jsSubmissionsResponse.documents as any[]).map(s => s.exerciseSlug)
                );
                const cCompletedSlugs = new Set(
                    (cSubmissionsResponse.documents as any[]).map(s => s.exerciseSlug)
                );

                const totalCompleted = jsCompletedSlugs.size + cCompletedSlugs.size;
                const totalExercises = jsExercisesResponse.total + cExercisesResponse.total;
                const percentage = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;
                setProgress(percentage);
            } catch (err) {
                console.error('Failed to fetch progress:', err);
            }
        };

        fetchProgress();
    }, [user]);

    const buttonClasses = "px-4 py-2 bg-gray-800 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 rounded-none";
    const yellowButtonClasses = `${buttonClasses} bg-[#ffcc00] text-black`;
    const greenButtonClasses = `${buttonClasses} bg-[#2ecc71] text-black`;

    // Check if link is active
    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const linkClasses = (href: string) =>
        `transition-colors duration-150 ${isActive(href) ? 'text-[#ffcc00] border-b-2 border-[#ffcc00]' : 'text-white hover:text-[#ffcc00]'}`;

    const navLinks = [
        { href: '/jsbog', label: 'JSBOG' },
        { href: '/cbog', label: 'CBOG' },
        { href: '/algobog', label: 'ALGOBOG' },
    ];

    return (
        <nav className="z-10 flex items-center justify-between border-b-4 border-black bg-[#1a2e1a] px-4 py-1 font-mono text-white relative">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="CODEBOG"
                        width={80}
                        height={80}
                        priority
                        className="hover:scale-105 transition-transform"
                    />
                </Link>
            </div>

            {/* Center Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-6">
                {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4 text-lg">
                {isLoading ? (
                    <div className="px-4 py-2">Loading...</div>
                ) : user ? (
                    <div className="flex items-center gap-4">
                        {/* Gem Balance */}
                        <GemBalance className="hidden sm:flex" />

                        {/* User Dropdown Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 group cursor-pointer hover:bg-green-900/30 p-2 rounded transition-colors"
                            >
                                <div className="flex flex-col items-start">
                                    <span className="text-white group-hover:text-[#ffcc00] transition-colors text-sm">
                                        {user.name}
                                    </span>
                                    {progress !== null && (
                                        <span className="text-xs text-green-400">
                                            {progress}% complété
                                        </span>
                                    )}
                                </div>
                                {/* Dropdown Arrow */}
                                <svg
                                    className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Content */}
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-[#1a2e1a] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50">
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 px-4 py-3 text-white hover:bg-green-900/50 hover:text-[#ffcc00] transition-colors"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <span className="w-5 h-5 flex items-center justify-center text-xs font-bold bg-purple-600 rounded">ID</span>
                                        Mon Profil
                                    </Link>
                                    <Link
                                        href="/jsbog"
                                        className="flex items-center gap-2 px-4 py-3 text-white hover:bg-green-900/50 hover:text-[#ffcc00] transition-colors"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <span className="w-5 h-5 flex items-center justify-center text-xs font-bold bg-green-600 rounded">JS</span>
                                        JSBOG
                                    </Link>
                                    <Link
                                        href="/cbog"
                                        className="flex items-center gap-2 px-4 py-3 text-white hover:bg-green-900/50 hover:text-[#ffcc00] transition-colors"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <span className="w-5 h-5 flex items-center justify-center text-xs font-bold bg-blue-600 rounded">C</span>
                                        CBOG
                                    </Link>
                                    <Link
                                        href="/algobog"
                                        className="flex items-center gap-2 px-4 py-3 text-white hover:bg-green-900/50 hover:text-[#ffcc00] transition-colors"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <span className="w-5 h-5 flex items-center justify-center text-xs font-bold bg-purple-600 rounded">A</span>
                                        ALGOBOG
                                    </Link>
                                    <Link
                                        href="/shop"
                                        className="flex items-center gap-2 px-4 py-3 text-white hover:bg-purple-900/30 hover:text-purple-300 transition-colors"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <span className="w-5 h-5 flex items-center justify-center text-sm">💎</span>
                                        Boutique
                                    </Link>
                                    {isAdmin && (
                                        <>
                                            <div className="border-t border-green-900/50" />
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-2 px-4 py-3 text-white hover:bg-red-900/30 hover:text-red-400 transition-colors"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <span className="w-5 h-5 flex items-center justify-center text-xs font-bold bg-red-600 rounded">A</span>
                                                Admin
                                            </Link>
                                        </>
                                    )}
                                    <div className="border-t border-green-900/50" />
                                    <button
                                        onClick={() => {
                                            logout();
                                            setUserMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-3 text-red-400 hover:bg-red-900/30 transition-colors text-left"
                                    >
                                        <span className="w-5 h-5 flex items-center justify-center text-sm font-bold bg-red-600 text-white rounded">←</span>
                                        Sortir
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-white hover:text-[#ffcc00]"
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link href="/login" className={greenButtonClasses}>Login</Link>
                        <Link href="/register" className={`hidden sm:block ${yellowButtonClasses}`}>Register</Link>

                        {/* Mobile Menu Button for non-logged users */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-white hover:text-[#ffcc00]"
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-[#1a2e1a] border-b-4 border-black md:hidden z-50">
                    <div className="flex flex-col p-4 gap-2">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`py-3 px-4 rounded ${isActive(link.href) ? 'bg-green-900/50 text-[#ffcc00]' : 'text-white hover:bg-green-900/30'}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {!user && (
                            <Link
                                href="/register"
                                className="py-3 px-4 rounded text-yellow-400 hover:bg-yellow-900/30 sm:hidden"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Register
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
