"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    if (isLoading) {
        return <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-white"><p>Loading session...</p></div>;
    }

    if (!user) {
        return null; // or a redirect component
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-white p-4">
            <div className="w-full max-w-2xl bg-[#0a0f0a] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-3xl font-bold text-center text-[#2ecc71] mb-8"> &gt; USER_PROFILE_</h1>
                <div className="space-y-4 text-lg">
                    <p><span className="text-[#2ecc71]">NAME:</span> {user.name}</p>
                    <p><span className="text-[#2ecc71]">EMAIL:</span> {user.email}</p>
                    <p><span className="text-[#2ecc71]">JOINED:</span> {new Date(user.$createdAt).toLocaleDateString()}</p>
                    <p><span className="text-[#2ecc71]">RANK:</span> Larve du Bog</p>
                </div>
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={logout}
                        className="border-r-8 border-b-8 border-black bg-[#e74c3c] px-10 py-5 text-2xl font-bold uppercase text-white active:translate-x-2 active:translate-y-2 active:border-b-0 active:border-r-0 hover:translate-x-1 hover:translate-y-1 hover:border-b-4 hover:border-r-4"
                    >
                        LOG_OUT
                    </button>
                </div>
            </div>
        </main>
    );
}
