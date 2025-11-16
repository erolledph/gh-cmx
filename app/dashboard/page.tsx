import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import DashboardClient from './DashboardClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/auth');
  }

  return <DashboardClient />;
}
