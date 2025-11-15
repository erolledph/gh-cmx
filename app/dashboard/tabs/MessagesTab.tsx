'use client';

import { useEffect, useState } from 'react';
import { ContactMessage } from '@/lib/types';

export default function MessagesTab() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        setError('Failed to load messages');
      }
    } catch (err) {
      setError('Error loading messages');
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      const response = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const updated = messages.map((m) =>
          m.id === id ? { ...m, read: true } : m
        );
        setMessages(updated);
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, read: true });
        }
      }
    } catch (err) {
      alert('Error updating message');
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm('Delete this message?')) return;

    try {
      const response = await fetch(`/api/messages?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      alert('Error deleting message');
    }
  }

  let filtered = messages;
  if (filterRead === 'read') {
    filtered = filtered.filter((m) => m.read);
  } else if (filterRead === 'unread') {
    filtered = filtered.filter((m) => !m.read);
  }

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Messages Inbox</h2>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterRead}
          onChange={(e) => setFilterRead(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 border rounded overflow-y-auto max-h-96">
          {filtered.length === 0 ? (
            <div className="p-4 text-gray-600">No messages found</div>
          ) : (
            <div>
              {filtered.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.read) markAsRead(msg.id);
                  }}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedMessage?.id === msg.id ? 'bg-blue-50' : ''
                  } ${!msg.read ? 'font-semibold' : ''}`}
                >
                  <p className="truncate">{msg.name}</p>
                  <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                  {!msg.read && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1"></span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2 border rounded p-4">
          {selectedMessage ? (
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold">{selectedMessage.subject}</h3>
                <p className="text-gray-600">{selectedMessage.name}</p>
                <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded whitespace-pre-wrap">
                {selectedMessage.message}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Delete
                </button>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">Select a message to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
