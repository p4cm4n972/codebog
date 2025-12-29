"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite/client';
import { ID } from 'appwrite';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            await account.create(ID.unique(), email, password, name);
            await account.createEmailPasswordSession(email, password);
            router.push('/');
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
            <div className="w-full max-w-md bg-[#0a0f0a] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
                <h1 className="text-3xl font-bold text-center text-[#2ecc71] mb-8"> &gt; REGISTER_</h1>
                <form onSubmit={handleRegister} className="flex flex-col gap-6">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-[#2ecc71]">USER_NAME:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-black text-[#2ecc71] border-2 border-[#2ecc71] p-3 focus:outline-none focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71] rounded-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-[#2ecc71]">USER_EMAIL:</label>
                        <input
                            type="email"
                            id="email"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-black text-[#2ecc71] border-2 border-[#2ecc71] p-3 focus:outline-none focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71] rounded-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 px-10 py-5 bg-[#ffcc00] text-black text-2xl font-bold uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 rounded-none"
                    >
                        CREATE_ACCOUNT
                    </button>
                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </form>
            </div>
        </main>
    );
}
