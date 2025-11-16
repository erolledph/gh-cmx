'use client';

import { useEffect, useState } from 'react';
import { DashboardStats } from '@/lib/types';

export default function OverviewTab() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Failed to load stats');
      }
    } catch (err) {
      setError('Error loading stats');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!stats) return null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="border p-4 rounded">
          <p className="text-gray-600">Total Posts</p>
          <p className="text-3xl font-bold">{stats.totalPosts}</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-gray-600">Total Comments</p>
          <p className="text-3xl font-bold">{stats.totalComments}</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-gray-600">Messages</p>
          <p className="text-3xl font-bold">{stats.totalMessages}</p>
        </div>
        <div className="border p-4 rounded">
          <p className="text-gray-600">Subscribers</p>
          <p className="text-3xl font-bold">{stats.totalSubscribers}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="border p-4 rounded">
          <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
          {stats.recentPosts.length === 0 ? (
            <p className="text-gray-600">No posts yet</p>
          ) : (
            <ul className="space-y-2">
              {stats.recentPosts.map((post) => (
                <li key={post.slug} className="text-sm border-b pb-2">
                  <p className="font-semibold">{post.title}</p>
                  <p className="text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Comments */}
        <div className="border p-4 rounded">
          <h3 className="text-xl font-bold mb-4">Recent Comments</h3>
          {stats.recentComments.length === 0 ? (
            <p className="text-gray-600">No comments yet</p>
          ) : (
            <ul className="space-y-2">
              {stats.recentComments.map((comment) => (
                <li key={comment.id} className="text-sm border-b pb-2">
                  <p className="font-semibold">{comment.author}</p>
                  <p className="text-gray-500">on {comment.slug}</p>
                  <p className="text-gray-500">{new Date(comment.date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Messages */}
        <div className="border p-4 rounded">
          <h3 className="text-xl font-bold mb-4">Recent Messages</h3>
          {stats.recentMessages.length === 0 ? (
            <p className="text-gray-600">No messages yet</p>
          ) : (
            <ul className="space-y-2">
              {stats.recentMessages.map((msg) => (
                <li key={msg.id} className="text-sm border-b pb-2">
                  <p className="font-semibold">{msg.name}</p>
                  <p className="text-gray-500">{new Date(msg.date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick Actions */}
        <div className="border p-4 rounded">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); }}
              className="block p-2 bg-blue-500 text-white rounded text-center hover:bg-blue-600"
            >
              Create New Post
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); }}
              className="block p-2 bg-green-500 text-white rounded text-center hover:bg-green-600"
            >
              View All Comments
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); }}
              className="block p-2 bg-purple-500 text-white rounded text-center hover:bg-purple-600"
            >
              Check Messages
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
