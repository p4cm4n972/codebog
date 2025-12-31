"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite/client';
import { Models } from 'appwrite';

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    isLoading: boolean;
    error: string;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setError: (error: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await account.get();
                setUser(currentUser);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError('');

            // Client-side validation
            if (password.length < 8) {
                setError('Password must be at least 8 characters long.');
                return;
            }

            await account.createEmailPasswordSession(email, password);
            const currentUser = await account.get();
            setUser(currentUser);
            router.push('/profile');
        } catch (err) {
            console.error('Login failed:', err);

            if (err instanceof Error) {
                if (err.message?.includes('password')) {
                    setError('Password must be between 8 and 256 characters long.');
                } else if (err.message?.includes('Invalid credentials')) {
                    setError('Invalid email or password.');
                } else if (err.message?.includes('user')) {
                    setError('User not found. Please check your email.');
                } else {
                    setError('Login failed. Please try again.');
                }
            }
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, error, login, logout, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
