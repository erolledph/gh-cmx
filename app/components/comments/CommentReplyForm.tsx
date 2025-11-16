'use client';

import { useState } from 'react';

interface CommentReplyFormProps {
  slug: string;
  parentId?: string;
  onSubmit: () => void;
}

export default function CommentReplyForm({
  slug,
  parentId,
  onSubmit,
}: CommentReplyFormProps) {
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          author,
          email,
          content,
          parentId,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setAuthor('');
        setEmail('');
        setContent('');
        setTimeout(() => {
          onSubmit();
        }, 1000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to post comment');
      }
    } catch (err) {
      setError('Error posting comment');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-gray-50 p-4 rounded">
      {success && (
        <div className="p-2 bg-green-100 text-green-800 rounded text-sm">
          Comment submitted for approval!
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-100 text-red-800 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name *"
          className="w-full border p-2 rounded text-sm"
          required
        />
      </div>

      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email *"
          className="w-full border p-2 rounded text-sm"
          required
        />
      </div>

      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Your comment *"
          className="w-full border p-2 rounded text-sm"
          rows={3}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-sm font-semibold"
      >
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}
