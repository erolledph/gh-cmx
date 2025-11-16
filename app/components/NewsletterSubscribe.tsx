'use client';

import { useState } from 'react';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess(true);
        setEmail('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to subscribe');
      }
    } catch (err) {
      setError('Error subscribing');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-blue-50 p-6 rounded border border-blue-200">
      <h3 className="text-xl font-bold mb-2">Subscribe to our Newsletter</h3>
      <p className="text-gray-600 mb-4">Get the latest blog posts delivered to your inbox.</p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-semibold"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {success && (
        <p className="text-green-600 text-sm mt-2">
          Successfully subscribed! Check your email.
        </p>
      )}

      {error && (
        <p className="text-red-600 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
}
