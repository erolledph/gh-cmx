'use client';

import { useState } from 'react';
import { Comment } from '@/lib/types';
import CommentReplyForm from './CommentReplyForm';

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  slug: string;
  onCommentAdded: () => void;
  level?: number;
}

export default function CommentItem({
  comment,
  replies,
  slug,
  onCommentAdded,
  level = 0,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className={`border-l-4 border-gray-300 pl-4 ${level > 0 ? 'ml-4 mt-4' : ''}`}>
      <div className="bg-white p-4 rounded">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-bold">{comment.author}</p>
            <p className="text-sm text-gray-600">{comment.email}</p>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>

        <p className="text-gray-700 mb-3">{comment.content}</p>

        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-blue-600 hover:underline text-sm font-semibold"
        >
          {showReplyForm ? 'Cancel' : 'Reply'}
        </button>

        {showReplyForm && (
          <div className="mt-4">
            <CommentReplyForm
              slug={slug}
              parentId={comment.id}
              onSubmit={() => {
                setShowReplyForm(false);
                onCommentAdded();
              }}
            />
          </div>
        )}
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              replies={[]}
              slug={slug}
              onCommentAdded={onCommentAdded}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
