"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { login, user, error, setError } = useAuth();

    useEffect(() => {
        // Clear any previous errors when the component mounts
        setError('');
    }, [setError]);

    // If user is already logged in, redirect to profile
    useEffect(() => {
        if (user) {
            router.push('/profile');
        }
    }, [user, router]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login(email, password);
    };

    // Prevent rendering the form if the user is already logged in
    if (user) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-white p-4">
                <p className="text-[#2ecc71]">Already logged in. Redirecting to profile...</p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-white p-4">
            <div className="w-full max-w-md bg-[#0a0f0a] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
                <h1 className="text-3xl font-bold text-center text-[#2ecc71] mb-8"> &gt; LOGIN_</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-[#2ecc71]">USER_EMAIL:</label>
                        <input
                            type="email"
                            id="email"
                            name="email" // Added name attribute for Playwright selector
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-black text-[#2ecc71] border-2 border-[#2ecc71] p-3 focus:outline-none focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71] rounded-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-[#2ecc71]">USER_PASSWORD:</label>
                        <input
                            type="password"
                            id="password"
                            name="password" // Added name attribute for Playwright selector
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            maxLength={256}
                            className="w-full bg-black text-[#2ecc71] border-2 border-[#2ecc71] p-3 focus:outline-none focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71] rounded-none"
                        />
                        <p className="text-xs text-[#2ecc71] opacity-70 mt-1">Min. 8 characters</p>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 px-10 py-5 bg-[#2ecc71] text-black text-2xl font-bold uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 rounded-none"
                    >
                        ACCESS_BOG
                    </button>
                    {error && <p className="text-red-500 mt-4 text-center font-bold">{error}</p>}
                </form>
            </div>
        </main>
    );
}
