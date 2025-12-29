"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite/client';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            await account.createEmailPasswordSession(email, password);
            router.push('/'); // Redirect to home page after successful login
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f0a] font-mono text-white p-4">
            <div className="w-full max-w-md bg-[#0a0f0a] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-3xl font-bold text-center text-[#2ecc71] mb-8"> &gt; LOGIN_</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-[#2ecc71]">USER_EMAIL:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-black text-[#2ecc71] border-2 border-[#2ecc71] p-3 focus:outline-none focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-[#2ecc71]">USER_PASSWORD:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-black text-[#2ecc71] border-2 border-[#2ecc71] p-3 focus:outline-none focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="border-r-8 border-b-8 border-black bg-[#2ecc71] px-10 py-5 text-2xl font-bold uppercase text-black active:translate-x-2 active:translate-y-2 active:border-b-0 active:border-r-0 hover:translate-x-1 hover:translate-y-1 hover:border-b-4 hover:border-r-4 mt-4"
                    >
                        ACCESS_BOG
                    </button>
                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </form>
            </div>
        </main>
    );
}
