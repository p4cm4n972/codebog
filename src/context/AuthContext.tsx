"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite/client';
import { Models } from 'appwrite';
import { UserRole, UserPreferences } from '@/lib/appwrite/types';

// Fallback admin email (for initial setup before roles are assigned)
const FALLBACK_ADMIN_EMAIL = 'manuel.adele@gmail.com';

interface AuthContextType {
    user: Models.User<UserPreferences> | null;
    isLoading: boolean;
    role: UserRole;
    isAdmin: boolean;
    isModerator: boolean;
    error: string;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    setError: (error: string) => void;
    getJWT: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Models.User<UserPreferences> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    // Get user role from preferences, with fallback for initial admin
    const getUserRole = (u: Models.User<UserPreferences> | null): UserRole => {
        if (!u) return 'user';
        // Check prefs.role first
        if (u.prefs?.role) return u.prefs.role;
        // Fallback: check if user is the initial admin
        if (u.email === FALLBACK_ADMIN_EMAIL) return 'admin';
        return 'user';
    };

    const role = getUserRole(user);
    const isAdmin = role === 'admin';
    const isModerator = role === 'moderator' || role === 'admin';

    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await account.get() as Models.User<UserPreferences>;
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
            const currentUser = await account.get() as Models.User<UserPreferences>;
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

    const getJWT = async (): Promise<string | null> => {
        if (!user) return null;
        try {
            const jwt = await account.createJWT();
            return jwt.jwt;
        } catch (error) {
            console.error('Failed to create JWT:', error);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, role, isAdmin, isModerator, error, login, logout, setError, getJWT }}>
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
