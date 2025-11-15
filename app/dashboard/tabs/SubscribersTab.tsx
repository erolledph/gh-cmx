'use client';

import { useEffect, useState } from 'react';
import { Subscriber } from '@/lib/types';

export default function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    try {
      const response = await fetch('/api/subscribers');
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data);
      } else {
        setError('Failed to load subscribers');
      }
    } catch (err) {
      setError('Error loading subscribers');
    } finally {
      setLoading(false);
    }
  }

  async function unsubscriber(id: string) {
    if (!confirm('Unsubscribe this email?')) return;

    try {
      const response = await fetch(`/api/subscribers?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSubscribers(subscribers.filter((s) => s.id !== id));
      }
    } catch (err) {
      alert('Error unsubscribing');
    }
  }

  async function copyAllEmails() {
    const emails = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    alert('All emails copied to clipboard!');
  }

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Subscribers</h2>

      <div className="mb-6">
        <button
          onClick={copyAllEmails}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Copy All Emails
        </button>
        <p className="text-sm text-gray-600 mt-2">Total: {subscribers.length} subscribers</p>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {subscribers.length === 0 ? (
        <div className="p-4 text-gray-600">No subscribers yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Subscribed Date</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{subscriber.email}</td>
                  <td className="p-3 text-sm">
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => unsubscriber(subscriber.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Unsubscribe
                    </button>
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
