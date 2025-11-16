import { isAuthenticated } from '@/lib/auth';
import { getContactMessages, addContactMessage, markMessageAsRead, deleteContactMessage } from '@/lib/firestore';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = await getContactMessages();
    return Response.json(messages);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: 'Missing required fields: name, email, subject, message' },
        { status: 400 }
      );
    }

    const id = await addContactMessage({
      name,
      email,
      subject,
      message,
    });

    return Response.json({ id, message: 'Message sent successfully' }, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return Response.json({ error: 'Missing message id' }, { status: 400 });
    }

    await markMessageAsRead(id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to update message' }, { status: 500 });
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
      return Response.json({ error: 'Missing message id' }, { status: 400 });
    }

    await deleteContactMessage(id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
