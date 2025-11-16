'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/lib/types';
import CommentItem from './CommentItem';

interface CommentsListProps {
  slug: string;
}

export default function CommentsList({ slug }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [slug]);

  async function fetchComments() {
    try {
      const response = await fetch(`/api/comments?slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        // All comments are now visible (no approval needed)
        setComments(data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }

  // Build threaded structure
  const rootComments = comments.filter((c) => !c.parentId);
  const commentMap = new Map(comments.map((c) => [c.id, c]));

  function getReplies(commentId: string): Comment[] {
    return comments.filter((c) => c.parentId === commentId);
  }

  if (loading) return <div className="p-4">Loading comments...</div>;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Comments ({comments.length})</h3>

      {comments.length === 0 ? (
        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-4">
          {rootComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={getReplies(comment.id)}
              slug={slug}
              onCommentAdded={fetchComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
