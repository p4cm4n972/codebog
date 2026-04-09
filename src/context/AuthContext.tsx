"use client";

import { createContext, useState, useEffect, useContext, startTransition, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite/client';
import { Models } from 'appwrite';
import { UserRole, UserPreferences } from '@/lib/appwrite/types';

const FALLBACK_ADMIN_EMAIL = 'manuel.adele@gmail.com';
const AUTH_CACHE_KEY = 'codebog_auth_user';

function readUserCache(): Models.User<UserPreferences> | null {
    try {
        const raw = localStorage.getItem(AUTH_CACHE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function writeUserCache(u: Models.User<UserPreferences> | null) {
    try {
        if (u) localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(u));
        else localStorage.removeItem(AUTH_CACHE_KEY);
    } catch { /* SSR / private mode */ }
}

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
    // Initialisation synchrone depuis le cache → pas de flash "loading" pour les users connus
    const [user, setUser] = useState<Models.User<UserPreferences> | null>(() => {
        if (typeof window === 'undefined') return null;
        return readUserCache();
    });
    const isLoading = false;
    const [error, setError] = useState('');
    const router = useRouter();

    const getUserRole = (u: Models.User<UserPreferences> | null): UserRole => {
        if (!u) return 'user';
        if (u.prefs?.role) return u.prefs.role;
        if (u.email === FALLBACK_ADMIN_EMAIL) return 'admin';
        return 'user';
    };

    const role = getUserRole(user);
    const isAdmin = role === 'admin';
    const isModerator = role === 'moderator' || role === 'admin';

    useEffect(() => {
        // Si aucun cache → l'utilisateur n'est pas connecté, on évite le 401 Appwrite
        if (!readUserCache()) return;

        // Validation en arrière-plan — startTransition = mise à jour non-urgente,
        // React ne bloque pas le thread principal pour ce re-render
        const checkUser = async () => {
            try {
                const currentUser = await account.get() as Models.User<UserPreferences>;
                startTransition(() => {
                    setUser(currentUser);
                    writeUserCache(currentUser);
                });
            } catch {
                // Session expirée côté serveur
                startTransition(() => {
                    setUser(null);
                    writeUserCache(null);
                });
            }
        };
        checkUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setError('');
            if (password.length < 8) {
                setError('Password must be at least 8 characters long.');
                return;
            }
            await account.createEmailPasswordSession(email, password);
            const currentUser = await account.get() as Models.User<UserPreferences>;
            writeUserCache(currentUser);
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
            writeUserCache(null);
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
