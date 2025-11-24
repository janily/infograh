import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth, isAuthDisabled } from '@/lib/auth';

import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
  // Check if authentication is disabled for development
  if (isAuthDisabled()) {
    console.log(
      '⚠️  Authentication disabled - using mock session for development'
    );

    return <DashboardClient />;
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect('/auth/sign-in');

  return <DashboardClient />;
}
