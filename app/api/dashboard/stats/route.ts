import { isAuthenticated } from '@/lib/auth';
import { getDashboardStats } from '@/lib/firestore';
import { getAllPosts } from '@/lib/github';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await getDashboardStats();
    const posts = await getAllPosts();
    
    stats.totalPosts = posts.length;
    stats.recentPosts = posts.slice(0, 5).map(p => ({
      slug: p.slug,
      title: p.title,
      date: p.createdAt,
    }));

    return Response.json(stats);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
