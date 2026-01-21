import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Client, Users, Account } from 'node-appwrite';
import { UserRole } from '@/lib/appwrite/types';

// Fallback admin email (for initial setup before roles are assigned)
const FALLBACK_ADMIN_EMAIL = 'manuel.adele@gmail.com';

// Helper to get user role
function getUserRole(prefs: Record<string, unknown> | undefined, email: string): UserRole {
    if (prefs?.role && ['admin', 'moderator', 'user'].includes(prefs.role as string)) {
        return prefs.role as UserRole;
    }
    if (email === FALLBACK_ADMIN_EMAIL) return 'admin';
    return 'user';
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        const body = await request.json();
        const { role } = body as { role: UserRole };

        // Validate role
        if (!role || !['user', 'moderator', 'admin'].includes(role)) {
            return NextResponse.json({
                error: 'Invalid role. Must be: user, moderator, or admin',
            }, { status: 400 });
        }

        // Get JWT from Authorization header
        const headersList = await headers();
        const authHeader = headersList.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({
                error: 'Unauthorized - No token provided',
            }, { status: 401 });
        }

        const jwt = authHeader.substring(7);

        // Verify the requester is admin
        const userClient = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
            .setJWT(jwt);

        const userAccount = new Account(userClient);
        const currentUser = await userAccount.get();
        const currentUserRole = getUserRole(currentUser.prefs, currentUser.email);

        if (currentUserRole !== 'admin') {
            return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
        }

        // Use admin API key to update user prefs
        const adminClient = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
            .setKey(process.env.NEXT_APPWRITE_KEY!);

        const users = new Users(adminClient);

        // Get current user prefs and update with new role
        const targetUser = await users.get(userId);
        const updatedPrefs = { ...targetUser.prefs, role };

        await users.updatePrefs(userId, updatedPrefs);

        return NextResponse.json({
            success: true,
            userId,
            role,
        });
    } catch (error) {
        console.error('Update role error:', error);
        return NextResponse.json(
            { error: 'Failed to update user role' },
            { status: 500 }
        );
    }
}
