<<<<<<< HEAD
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Link href="/create">Create New Blog Post</Link>
      <hr />
      <Link href="/">View All Posts</Link>
    </div>
  );
=======
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
>>>>>>> 42e84fb510b195b84c78169287928f02de69cf65
}
