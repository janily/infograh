import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { auth, isAuthDisabled, getMockSession } from '@/lib/auth';
import { getTotalAvailableCredits } from '@/lib/credits';

export async function GET() {
  try {
    // Check if authentication is disabled for development
    let session;

    if (isAuthDisabled()) {
      session = getMockSession();
      console.log(
        '⚠️  Authentication disabled - using mock session for credits API'
      );
    } else {
      session = await auth.api.getSession({ headers: await headers() });
    }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const creditInfo = await getTotalAvailableCredits(session.user.id);

    return NextResponse.json({
      paidCredits: creditInfo.paidCredits,
      freeCredits: creditInfo.freeCredits,
      total: creditInfo.total,
    });
  } catch (error) {
    console.error('Error fetching user credits:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
