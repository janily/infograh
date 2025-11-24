import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { auth, isAuthDisabled, getMockSession } from '@/lib/auth';
import { getUserGenerations } from '@/lib/credits';

export async function GET() {
  try {
    // Check if authentication is disabled for development
    let session;

    if (isAuthDisabled()) {
      session = getMockSession();
      console.log(
        '⚠️  Authentication disabled - using mock session for generations API'
      );
    } else {
      session = await auth.api.getSession({ headers: await headers() });
    }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const generations = await getUserGenerations(session.user.id);

    return NextResponse.json({ generations });
  } catch (error) {
    console.error('Error fetching user generations:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
