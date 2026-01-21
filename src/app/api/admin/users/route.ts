import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Client, Users, Databases, Query, Account } from 'node-appwrite';
import { UserRole } from '@/lib/appwrite/types';

// Fallback admin email (for initial setup before roles are assigned)
const FALLBACK_ADMIN_EMAIL = 'manuel.adele@gmail.com';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Helper to get user role
function getUserRole(prefs: Record<string, unknown> | undefined, email: string): UserRole {
    if (prefs?.role && ['admin', 'moderator', 'user'].includes(prefs.role as string)) {
        return prefs.role as UserRole;
    }
    // Fallback for initial admin
    if (email === FALLBACK_ADMIN_EMAIL) return 'admin';
    return 'user';
}

export async function GET() {
    try {
        // Get JWT from Authorization header
        const headersList = await headers();
        const authHeader = headersList.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({
                error: 'Unauthorized - No token provided',
            }, { status: 401 });
        }

        const jwt = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify the user is admin using their JWT
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

        // Now use admin API key to fetch all users
        const adminClient = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
            .setKey(process.env.NEXT_APPWRITE_KEY!);

        const users = new Users(adminClient);
        const databases = new Databases(adminClient);

        // Fetch all users
        const usersList = await users.list([Query.limit(100)]);

        // Fetch submissions stats
        const [jsSubmissions, cSubmissions] = await Promise.all([
            databases.listDocuments(DATABASE_ID, 'js-submissions', [Query.limit(1000)]).catch(() => ({ documents: [], total: 0 })),
            databases.listDocuments(DATABASE_ID, 'c-submissions', [Query.limit(1000)]).catch(() => ({ documents: [], total: 0 })),
        ]);

        // Calculate stats per user
        interface Submission {
            userId?: string;
            passed?: boolean;
        }

        const userStats = usersList.users.map(user => {
            const jsCount = (jsSubmissions.documents as unknown as Submission[]).filter(s =>
                s.userId === user.$id && s.passed
            ).length;
            const cCount = (cSubmissions.documents as unknown as Submission[]).filter(s =>
                s.userId === user.$id && s.passed
            ).length;
            const role = getUserRole(user.prefs, user.email);

            return {
                $id: user.$id,
                name: user.name,
                email: user.email,
                emailVerification: user.emailVerification,
                registration: user.$createdAt,
                lastActivity: user.accessedAt,
                role,
                stats: {
                    jsLevelsCompleted: jsCount,
                    cExercisesCompleted: cCount,
                    totalXP: (jsCount * 100) + (cCount * 50),
                }
            };
        });

        // Global stats
        const globalStats = {
            totalUsers: usersList.total,
            totalJsSubmissions: jsSubmissions.total,
            totalCSubmissions: cSubmissions.total,
            activeToday: usersList.users.filter(u => {
                const lastAccess = new Date(u.accessedAt);
                const today = new Date();
                return lastAccess.toDateString() === today.toDateString();
            }).length,
        };

        return NextResponse.json({ users: userStats, stats: globalStats });
    } catch (error) {
        console.error('Admin API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
