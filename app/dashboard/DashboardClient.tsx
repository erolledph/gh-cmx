'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OverviewTab from './tabs/OverviewTab';
import ContentTab from './tabs/ContentTab';
import CommentsTab from './tabs/CommentsTab';
import MessagesTab from './tabs/MessagesTab';
import SubscribersTab from './tabs/SubscribersTab';
import CreatePostTab from './tabs/CreatePostTab';

type TabType = 'overview' | 'content' | 'comments' | 'messages' | 'subscribers' | 'create';

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'comments', label: 'Comments', icon: '💬' },
    { id: 'messages', label: 'Messages', icon: '📧' },
    { id: 'subscribers', label: 'Subscribers', icon: '👥' },
    { id: 'create', label: 'Create Post', icon: '✨' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <a href="/" className="px-4 py-2 text-blue-600 hover:underline">
              Home
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'content' && <ContentTab />}
        {activeTab === 'comments' && <CommentsTab />}
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'subscribers' && <SubscribersTab />}
        {activeTab === 'create' && <CreatePostTab />}
      </main>
    </div>
  );
}
