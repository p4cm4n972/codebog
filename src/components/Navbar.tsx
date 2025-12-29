"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { user, isLoading, logout } = useAuth();

    const buttonClasses = "px-4 py-2 bg-gray-800 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150 rounded-none";
    const yellowButtonClasses = `${buttonClasses} bg-[#ffcc00] text-black`;
    const greenButtonClasses = `${buttonClasses} bg-[#2ecc71] text-black`;
    const redButtonClasses = `${buttonClasses} bg-[#e74c3c] text-white`;
    const textLinkClasses = "hover:text-[#ffcc00] transition-colors duration-150";

    return (
        <nav className="z-10 flex items-center justify-between border-b-4 border-black bg-[#1a2e1a] p-4 font-mono text-white">
            <div className="flex items-center gap-3">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-white hover:text-[#ffcc00]">CODEBOG</Link>
            </div>
            <div className="flex items-center gap-4 text-lg">
                {isLoading ? (
                    <div className="px-4 py-2">Loading...</div>
                ) : user ? (
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="flex items-center gap-2 group">
                            <Image src="/icon_manicou.png" alt="Manicou Icon" width={32} height={32} className="pixelated group-hover:scale-110 transition-transform" />
                            <span className={textLinkClasses}>{user.name}</span>
                        </Link>
                        <button onClick={logout} className={redButtonClasses}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link href="/login" className={greenButtonClasses}>Login</Link>
                        <Link href="/register" className={yellowButtonClasses}>Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
