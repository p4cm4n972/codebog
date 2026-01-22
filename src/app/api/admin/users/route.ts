import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(request: NextRequest) {
    try {
        // Get pagination params from URL
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = Math.min(parseInt(searchParams.get('limit') || '25', 10), 100); // Max 100
        const search = searchParams.get('search') || '';
        const sortBy = searchParams.get('sortBy') || 'registration'; // registration, name, xp
        const sortOrder = searchParams.get('sortOrder') || 'desc'; // asc, desc

        const offset = (page - 1) * limit;

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

        // Now use admin API key to fetch users
        const adminClient = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
            .setKey(process.env.NEXT_APPWRITE_KEY!);

        const users = new Users(adminClient);
        const databases = new Databases(adminClient);

        // Build queries for users list
        const queries: string[] = [
            Query.limit(limit),
            Query.offset(offset),
        ];

        // Add search if provided (Appwrite Users API supports search)
        if (search) {
            queries.push(Query.search('name', search));
        }

        // Add sorting
        if (sortBy === 'name') {
            queries.push(sortOrder === 'asc' ? Query.orderAsc('name') : Query.orderDesc('name'));
        } else {
            // Default: sort by registration date
            queries.push(sortOrder === 'asc' ? Query.orderAsc('$createdAt') : Query.orderDesc('$createdAt'));
        }

        // Fetch paginated users
        const usersList = await users.list(queries);

        // Get user IDs for this page to fetch their submissions
        const userIds = usersList.users.map(u => u.$id);

        // Fetch submissions only for users on this page (much more efficient)
        const [jsSubmissions, cSubmissions] = await Promise.all([
            userIds.length > 0
                ? databases.listDocuments(DATABASE_ID, 'js-submissions', [
                    Query.equal('userId', userIds),
                    Query.equal('passed', true),
                    Query.limit(5000),
                ]).catch(() => ({ documents: [] }))
                : { documents: [] },
            userIds.length > 0
                ? databases.listDocuments(DATABASE_ID, 'c-submissions', [
                    Query.equal('userId', userIds),
                    Query.equal('passed', true),
                    Query.limit(5000),
                ]).catch(() => ({ documents: [] }))
                : { documents: [] },
        ]);

        // Calculate stats per user
        interface Submission {
            userId?: string;
            passed?: boolean;
        }

        const userStats = usersList.users.map(user => {
            const jsCount = (jsSubmissions.documents as unknown as Submission[]).filter(s =>
                s.userId === user.$id
            ).length;
            const cCount = (cSubmissions.documents as unknown as Submission[]).filter(s =>
                s.userId === user.$id
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

        // Sort by XP if requested (done client-side since Appwrite doesn't support this)
        if (sortBy === 'xp') {
            userStats.sort((a, b) => {
                const diff = a.stats.totalXP - b.stats.totalXP;
                return sortOrder === 'asc' ? diff : -diff;
            });
        }

        // Get total counts for global stats (cached, only on first page)
        let globalStats = null;
        if (page === 1) {
            const [totalJs, totalC] = await Promise.all([
                databases.listDocuments(DATABASE_ID, 'js-submissions', [Query.limit(1)]).catch(() => ({ total: 0 })),
                databases.listDocuments(DATABASE_ID, 'c-submissions', [Query.limit(1)]).catch(() => ({ total: 0 })),
            ]);

            globalStats = {
                totalUsers: usersList.total,
                totalJsSubmissions: totalJs.total,
                totalCSubmissions: totalC.total,
                activeToday: usersList.users.filter(u => {
                    const lastAccess = new Date(u.accessedAt);
                    const today = new Date();
                    return lastAccess.toDateString() === today.toDateString();
                }).length,
            };
        }

        return NextResponse.json({
            users: userStats,
            stats: globalStats,
            pagination: {
                page,
                limit,
                total: usersList.total,
                totalPages: Math.ceil(usersList.total / limit),
                hasMore: offset + usersList.users.length < usersList.total,
            }
        });
    } catch (error) {
        console.error('Admin API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
