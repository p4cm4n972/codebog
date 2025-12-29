"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { user, isLoading, logout } = useAuth();

    return (
        <nav className="z-10 flex items-center justify-between border-b-4 border-black bg-[#1a2e1a] p-4 font-pixel text-white">
            <div className="flex items-center gap-3">
                <Link href="/" className="text-xl font-bold tracking-tighter">CODEBOG</Link>
            </div>
            <div className="flex items-center gap-4 font-mono text-lg">
                {isLoading ? (
                    <span>Loading...</span>
                ) : user ? (
                    <>
                        <Link href="/profile" className="hover:text-[#2ecc71]">
                            {user.name}
                        </Link>
                        <button onClick={logout} className="hover:text-[#e74c3c]">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="hover:text-[#2ecc71]">Login</Link>
                        <Link href="/register" className="hover:text-[#2ecc71]">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
