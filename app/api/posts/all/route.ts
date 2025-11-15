import { getAllPosts } from '@/lib/github';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await getAllPosts();
    return Response.json(posts);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
