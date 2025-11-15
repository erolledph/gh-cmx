'use client';

import { useState } from 'react';
import CommentForm from './CommentForm';
import CommentsList from './CommentsList';

interface CommentsSection {
  slug: string;
}

export default function CommentsSection({ slug }: CommentsSection) {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleCommentAdded() {
    setRefreshKey(prev => prev + 1);
  }

  return (
    <section className="mt-12">
      <CommentForm slug={slug} onCommentAdded={handleCommentAdded} />
      <CommentsList slug={slug} key={refreshKey} />
    </section>
  );
}
