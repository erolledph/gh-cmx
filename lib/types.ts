// Comment System Types
export interface Comment {
  id: string;
  slug: string; // blog post slug
  author: string;
  email: string;
  content: string;
  parentId?: string; // for threaded comments
  createdAt: string;
  updatedAt: string;
}

export interface CommentWithReplies extends Comment {
  replies: Comment[];
}

// Message/Inbox Types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// Subscriber Types
export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  unsubscribed: boolean;
}

// Dashboard Statistics
export interface DashboardStats {
  totalPosts: number;
  totalComments: number;
  totalMessages: number;
  totalSubscribers: number;
  recentPosts: { slug: string; title: string; date: string }[];
  recentComments: { id: string; author: string; slug: string; date: string }[];
  recentMessages: { id: string; name: string; date: string }[];
}
