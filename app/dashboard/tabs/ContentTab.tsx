'use client';

import { useEffect, useState } from 'react';
import { BlogPostMetadata } from '@/lib/github';

export default function ContentTab() {
  const [posts, setPosts] = useState<BlogPostMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const response = await fetch('/api/posts/all');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        setError('Failed to load posts');
      }
    } catch (err) {
      setError('Error loading posts');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/delete?slug=${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(p => p.slug !== slug));
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      alert('Error deleting post');
    }
  }

  function copyToClipboard(slug: string) {
    navigator.clipboard.writeText(`${window.location.origin}/posts/${slug}`);
    alert('Post URL copied to clipboard!');
  }

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Content Management</h2>

      {posts.length === 0 ? (
        <div className="p-4 text-gray-600">No posts yet. Create one to get started!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Description</th>
                <th className="text-left p-3">Date Created</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.slug} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-300 rounded"></div>
                    )}
                  </td>
                  <td className="p-3 font-semibold">{post.title}</td>
                  <td className="p-3 text-sm text-gray-600">{post.description.substring(0, 50)}...</td>
                  <td className="p-3 text-sm">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(post.slug)}
                        className="text-blue-500 hover:underline text-sm"
                        title="Copy link"
                      >
                        Copy
                      </button>
                      <a
                        href={`/posts/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:underline text-sm"
                        title="Open post"
                      >
                        Open
                      </a>
                      <a
                        href={`#`}
                        className="text-orange-500 hover:underline text-sm"
                        title="Edit post"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="text-red-500 hover:underline text-sm"
                        title="Delete post"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
