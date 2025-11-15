'use client';

import { useState } from 'react';
import MarkdownEditor from '@/app/components/MarkdownEditor';
import ImageUpload from '@/app/components/ImageUpload';

export default function CreatePostTab() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          imageUrl,
          content,
          description,
          keywords,
          author,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Post created successfully! Slug: ${data.slug}`);
        setTitle('');
        setTags('');
        setImageUrl('');
        setContent('');
        setDescription('');
        setKeywords('');
        setAuthor('');
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('Failed to create post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          {title && (
            <small className="text-gray-600">
              Slug: <span className="font-mono">{slug}</span>
            </small>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            rows={2}
            required
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-semibold mb-2">
            Tags (comma separated) *
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="react, nextjs, web"
            required
          />
        </div>

        <ImageUpload onImageUrl={setImageUrl} />

        {imageUrl && (
          <div>
            <p className="text-xs text-gray-600 mb-1">Image URL:</p>
            <input
              type="text"
              value={imageUrl}
              readOnly
              className="w-full border p-2 rounded bg-gray-50"
            />
          </div>
        )}

        <div>
          <label htmlFor="author" className="block text-sm font-semibold mb-2">
            Author *
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-semibold mb-2">
            Keywords (SEO)
          </label>
          <input
            type="text"
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="blog, tutorial, guide"
          />
        </div>

        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder="Write your post content in Markdown..."
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded font-semibold"
        >
          {loading ? 'Saving...' : 'Save Post'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded ${
            message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
