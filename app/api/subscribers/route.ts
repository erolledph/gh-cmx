import { isAuthenticated } from '@/lib/auth';
import { getSubscribers, addSubscriber, unsubscribe, unsubscribeByEmail } from '@/lib/firestore';

export const runtime = 'edge';

export async function GET(request: Request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const subscribers = await getSubscribers();
    return Response.json(subscribers);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const id = await addSubscriber(email);
    return Response.json({ id, message: 'Successfully subscribed' }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Already subscribed') {
      return Response.json({ error: 'Already subscribed' }, { status: 400 });
    }
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const email = url.searchParams.get('email');

    if (id) {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      await unsubscribe(id);
    } else if (email) {
      await unsubscribeByEmail(email);
    } else {
      return Response.json({ error: 'Missing id or email parameter' }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
