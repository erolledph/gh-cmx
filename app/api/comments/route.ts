import { isAuthenticated } from '@/lib/auth';
import { getCommentsBySlug, getAllComments, addComment, updateComment, deleteComment } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');

  try {
    if (slug) {
      // Get all comments for a blog post slug
      const comments = await getCommentsBySlug(slug);
      return Response.json(comments);
    }

    // Get all comments (admin only)
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const comments = await getAllComments();
    return Response.json(comments);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, author, email, content, parentId } = body;

    if (!slug || !author || !email || !content) {
      return Response.json(
        { error: 'Missing required fields: slug, author, email, content' },
        { status: 400 }
      );
    }

    const id = await addComment({
      slug,
      author,
      email,
      content,
      parentId,
    });

    return Response.json({ id, message: 'Comment posted successfully' }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, content } = body;

    if (!id) {
      return Response.json({ error: 'Missing comment id' }, { status: 400 });
    }

    await updateComment(id, { ...(content && { content }) });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Missing comment id' }, { status: 400 });
    }

    await deleteComment(id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
