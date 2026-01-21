// Role utility functions (extracted for testability)
import { UserRole, UserPreferences } from './appwrite/types';
import { Models } from 'appwrite';

// Fallback admin email (for initial setup before roles are assigned)
const FALLBACK_ADMIN_EMAIL = 'manuel.adele@gmail.com';

/**
 * Determine user role from user object
 * Priority: prefs.role > fallback admin email > 'user'
 */
export function getUserRole(user: Models.User<UserPreferences> | null): UserRole {
    if (!user) return 'user';

    // Check prefs.role first
    if (user.prefs?.role) return user.prefs.role;

    // Fallback: check if user is the initial admin
    if (user.email === FALLBACK_ADMIN_EMAIL) return 'admin';

    return 'user';
}

/**
 * Check if user has admin privileges
 */
export function isAdminRole(role: UserRole): boolean {
    return role === 'admin';
}

/**
 * Check if user has moderator privileges (includes admin)
 */
export function isModeratorRole(role: UserRole): boolean {
    return role === 'moderator' || role === 'admin';
}
