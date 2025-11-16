'use client';

import { useEffect, useState } from 'react';
import { Comment } from '@/lib/types';

export default function CommentsTab() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterSlug, setFilterSlug] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    try {
      const response = await fetch('/api/comments');
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        setError('Failed to load comments');
      }
    } catch (err) {
      setError('Error loading comments');
    } finally {
      setLoading(false);
    }
  }

  async function deleteComment(id: string) {
    if (!confirm('Delete this comment?')) return;

    try {
      const response = await fetch(`/api/comments?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== id));
      }
    } catch (err) {
      alert('Error deleting comment');
    }
  }

  let filtered = comments;
  if (filterSlug) {
    filtered = filtered.filter((c) => c.slug.includes(filterSlug));
  }

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Comments Management</h2>

      {/* Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Filter by post:</label>
        <input
          type="text"
          value={filterSlug}
          onChange={(e) => setFilterSlug(e.target.value)}
          placeholder="Search by slug..."
          className="border p-2 rounded w-full md:w-96"
        />
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {filtered.length === 0 ? (
        <div className="p-4 text-gray-600">No comments found</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((comment) => (
            <div key={comment.id} className="border p-4 rounded">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{comment.author}</p>
                  <p className="text-sm text-gray-600">{comment.email}</p>
                  <p className="text-xs text-gray-500">
                    on <span className="font-mono">{comment.slug}</span>
                  </p>
                </div>
              </div>

              <p className="mb-3">{comment.content}</p>

              {comment.parentId && (
                <p className="text-xs text-gray-500 mb-3">Reply to: {comment.parentId}</p>
              )}

              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
