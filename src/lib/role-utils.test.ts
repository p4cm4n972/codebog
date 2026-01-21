import { describe, it, expect } from 'vitest';
import { getUserRole, isAdminRole, isModeratorRole } from './role-utils';
import { Models } from 'appwrite';
import { UserPreferences } from './appwrite/types';

// Helper to create mock user
function createMockUser(overrides: Partial<Models.User<UserPreferences>> = {}): Models.User<UserPreferences> {
    return {
        $id: 'test-user-id',
        $createdAt: '2024-01-01T00:00:00.000Z',
        $updatedAt: '2024-01-01T00:00:00.000Z',
        name: 'Test User',
        email: 'test@example.com',
        phone: '',
        registration: '2024-01-01T00:00:00.000Z',
        status: true,
        labels: [],
        passwordUpdate: '',
        prefs: {},
        accessedAt: '',
        mfa: false,
        targets: [],
        emailVerification: false,
        phoneVerification: false,
        ...overrides,
    };
}

describe('getUserRole', () => {
    it('should return "user" for null user', () => {
        expect(getUserRole(null)).toBe('user');
    });

    it('should return role from prefs when set', () => {
        const adminUser = createMockUser({ prefs: { role: 'admin' } });
        expect(getUserRole(adminUser)).toBe('admin');

        const modUser = createMockUser({ prefs: { role: 'moderator' } });
        expect(getUserRole(modUser)).toBe('moderator');

        const regularUser = createMockUser({ prefs: { role: 'user' } });
        expect(getUserRole(regularUser)).toBe('user');
    });

    it('should return "admin" for fallback admin email', () => {
        const fallbackAdmin = createMockUser({ email: 'manuel.adele@gmail.com', prefs: {} });
        expect(getUserRole(fallbackAdmin)).toBe('admin');
    });

    it('should prioritize prefs.role over fallback email', () => {
        // If the fallback admin has an explicit 'moderator' role, use that
        const user = createMockUser({
            email: 'manuel.adele@gmail.com',
            prefs: { role: 'moderator' },
        });
        expect(getUserRole(user)).toBe('moderator');
    });

    it('should return "user" for regular users without prefs', () => {
        const user = createMockUser({ prefs: {} });
        expect(getUserRole(user)).toBe('user');
    });

    it('should return "user" when prefs is undefined', () => {
        const user = createMockUser();
        // @ts-expect-error - testing undefined case
        user.prefs = undefined;
        expect(getUserRole(user)).toBe('user');
    });
});

describe('isAdminRole', () => {
    it('should return true only for admin role', () => {
        expect(isAdminRole('admin')).toBe(true);
        expect(isAdminRole('moderator')).toBe(false);
        expect(isAdminRole('user')).toBe(false);
    });
});

describe('isModeratorRole', () => {
    it('should return true for moderator and admin roles', () => {
        expect(isModeratorRole('admin')).toBe(true);
        expect(isModeratorRole('moderator')).toBe(true);
        expect(isModeratorRole('user')).toBe(false);
    });
});
