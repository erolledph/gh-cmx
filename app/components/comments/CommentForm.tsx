'use client';

import { useState } from 'react';

interface CommentFormProps {
  slug: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ slug, onCommentAdded }: CommentFormProps) {
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
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setAuthor('');
        setEmail('');
        setContent('');
        setTimeout(() => {
          onCommentAdded();
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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8">
      <h3 className="text-xl font-bold mb-4">Leave a Comment</h3>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          Comment submitted for approval! Thank you for your feedback.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="author" className="block text-sm font-semibold mb-2">
            Name *
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-semibold mb-2">
          Comment *
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded"
          rows={5}
          placeholder="Share your thoughts..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-semibold"
      >
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}
