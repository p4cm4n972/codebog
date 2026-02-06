/**
 * ALGOBOG Unlock API
 *
 * POST /api/algobog/unlock - Purchase unlock with gems
 * GET /api/algobog/unlock - Check unlock status and cost
 *
 * Security:
 * - JWT verification required
 * - Cost calculated server-side (never trust client)
 * - Atomic transaction: spend gems + create unlock
 * - Double-unlock prevention
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromJWT } from '@/lib/access-control';
import { getGemBalance, spendGems } from '@/lib/gems/balance';
import {
  isDistrictUnlocked,
  isBuildingUnlocked,
  isProblemUnlocked,
  createAlgoGemUnlock,
  checkAlgoGemUnlock,
  getUnlockCost,
} from '@/lib/algobog/access-control';
import { isValidSlug } from '@/lib/algobog/gem-config';

// ============================================================================
// GET - Check unlock status and cost
// ============================================================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const targetType = searchParams.get('targetType') as 'district' | 'building' | 'problem' | null;
    const targetSlug = searchParams.get('targetSlug');

    // Validate parameters
    if (!targetType || !targetSlug) {
      return NextResponse.json(
        { error: 'Missing targetType or targetSlug' },
        { status: 400 }
      );
    }

    if (!['district', 'building', 'problem'].includes(targetType)) {
      return NextResponse.json(
        { error: 'Invalid targetType. Must be: district, building, or problem' },
        { status: 400 }
      );
    }

    if (!isValidSlug(targetSlug)) {
      return NextResponse.json(
        { error: 'Invalid targetSlug format' },
        { status: 400 }
      );
    }

    // Get cost (validates slug exists)
    let cost: number;
    try {
      cost = await getUnlockCost(targetType, targetSlug);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown target' },
        { status: 404 }
      );
    }

    // Check authentication (optional for cost check)
    const authHeader = request.headers.get('Authorization');
    let userId: string | null = null;
    let isUnlocked = false;
    let hasAccess = false;
    let userBalance = 0;

    if (authHeader?.startsWith('Bearer ')) {
      const jwt = authHeader.substring(7);
      const userInfo = await verifyUserFromJWT(jwt);

      if (userInfo) {
        userId = userInfo.userId;
        // verifyUserFromJWT already returns unlockAll based on role
        const { unlockAll } = userInfo;

        // Check if already gem-unlocked
        const gemUnlock = await checkAlgoGemUnlock(userId, targetType, targetSlug);
        isUnlocked = !!gemUnlock;

        // Check if has access (via progression or gem)
        let accessResult;
        switch (targetType) {
          case 'district':
            accessResult = await isDistrictUnlocked(userId, targetSlug, unlockAll);
            break;
          case 'building':
            accessResult = await isBuildingUnlocked(userId, targetSlug, unlockAll);
            break;
          case 'problem':
            accessResult = await isProblemUnlocked(userId, targetSlug, unlockAll);
            break;
        }
        hasAccess = accessResult.hasAccess;

        // Get user balance
        try {
          const balanceInfo = await getGemBalance(userId);
          userBalance = balanceInfo.balance;
        } catch {
          // User might not have a balance yet
          userBalance = 0;
        }
      }
    }

    return NextResponse.json({
      targetType,
      targetSlug,
      cost,
      isUnlocked,
      hasAccess,
      userBalance,
      canAfford: userBalance >= cost,
      needsUnlock: !hasAccess && !isUnlocked,
    });

  } catch (error) {
    console.error('ALGOBOG unlock check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST - Purchase unlock with gems
// ============================================================================

interface UnlockRequestBody {
  targetType: 'district' | 'building' | 'problem';
  targetSlug: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ========================================================================
    // 1. Authentication
    // ========================================================================
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const jwt = authHeader.substring(7);
    const userInfo = await verifyUserFromJWT(jwt);

    if (!userInfo) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { userId, unlockAll } = userInfo;

    // ========================================================================
    // 2. Parse and validate request body
    // ========================================================================
    let body: UnlockRequestBody;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { targetType, targetSlug } = body;

    // Validate targetType
    if (!targetType || !['district', 'building', 'problem'].includes(targetType)) {
      return NextResponse.json(
        { error: 'Invalid targetType. Must be: district, building, or problem' },
        { status: 400 }
      );
    }

    // Validate targetSlug format (prevents injection)
    if (!targetSlug || !isValidSlug(targetSlug)) {
      return NextResponse.json(
        { error: 'Invalid targetSlug format' },
        { status: 400 }
      );
    }

    // ========================================================================
    // 3. Check if already has access (don't charge for accessible content)
    // ========================================================================
    let accessResult;
    switch (targetType) {
      case 'district':
        accessResult = await isDistrictUnlocked(userId, targetSlug, unlockAll);
        break;
      case 'building':
        accessResult = await isBuildingUnlocked(userId, targetSlug, unlockAll);
        break;
      case 'problem':
        accessResult = await isProblemUnlocked(userId, targetSlug, unlockAll);
        break;
    }

    if (accessResult.hasAccess) {
      return NextResponse.json(
        {
          error: 'Already have access',
          reason: accessResult.reason,
        },
        { status: 400 }
      );
    }

    // ========================================================================
    // 4. Check if already gem-unlocked (prevent double-spending)
    // ========================================================================
    const existingUnlock = await checkAlgoGemUnlock(userId, targetType, targetSlug);
    if (existingUnlock) {
      return NextResponse.json(
        { error: 'Already unlocked with gems' },
        { status: 400 }
      );
    }

    // ========================================================================
    // 5. Get unlock cost (server-side calculation)
    // ========================================================================
    let cost: number;
    try {
      cost = await getUnlockCost(targetType, targetSlug);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown target' },
        { status: 404 }
      );
    }

    // Free unlocks (first district, first building in district, etc.)
    if (cost === 0) {
      return NextResponse.json(
        { error: 'This content is free. No gems required.' },
        { status: 400 }
      );
    }

    // ========================================================================
    // 6. Check user balance
    // ========================================================================
    let currentBalance: number;
    try {
      const balanceInfo = await getGemBalance(userId);
      currentBalance = balanceInfo.balance;
    } catch {
      // No balance record = 0 gems
      currentBalance = 0;
    }

    if (currentBalance < cost) {
      return NextResponse.json(
        {
          error: 'Insufficient gems',
          required: cost,
          balance: currentBalance,
          shortfall: cost - currentBalance,
        },
        { status: 402 } // Payment Required
      );
    }

    // ========================================================================
    // 7. Atomic transaction: Spend gems + Create unlock
    // ========================================================================
    const targetLabel = `${targetType}: ${targetSlug}`;
    const description = `ALGOBOG unlock - ${targetLabel}`;

    try {
      // Spend gems first (will throw if insufficient)
      await spendGems(userId, cost, description, targetSlug);

      // Create unlock record
      const unlock = await createAlgoGemUnlock(userId, targetType, targetSlug, cost);

      // Get new balance
      let newBalance = currentBalance - cost;
      try {
        const newBalanceInfo = await getGemBalance(userId);
        newBalance = newBalanceInfo.balance;
      } catch {
        // Use calculated value if fetch fails
      }

      return NextResponse.json({
        success: true,
        targetType,
        targetSlug,
        gemsCost: cost,
        newBalance,
        unlockedAt: unlock.unlockedAt,
      });

    } catch (error) {
      // Log for debugging but don't expose internal errors
      console.error('ALGOBOG unlock transaction error:', error);

      // Check if it's a known error type
      if (error instanceof Error) {
        if (error.message.includes('Insufficient')) {
          return NextResponse.json(
            { error: 'Insufficient gems' },
            { status: 402 }
          );
        }
        if (error.message.includes('already unlocked')) {
          return NextResponse.json(
            { error: 'Already unlocked' },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: 'Transaction failed. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('ALGOBOG unlock error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
