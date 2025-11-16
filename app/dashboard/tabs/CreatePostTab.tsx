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

        <div className="space-y-3 border-l-4 border-blue-500 p-4 bg-blue-50">
          <p className="text-sm font-semibold text-gray-700">Image URL *</p>
          <p className="text-xs text-gray-600">Choose one option: upload or paste URL</p>
          
          <ImageUpload onImageUrl={setImageUrl} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-blue-50 text-gray-500">OR</span>
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-semibold mb-2">
              Paste Image URL Directly
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          {imageUrl && (
            <div className="mt-3 p-3 bg-white rounded border border-green-200">
              <p className="text-xs text-gray-600 mb-2">Preview:</p>
              <img src={imageUrl} alt="Preview" className="max-w-xs h-auto rounded border" onError={() => setMessage('Error loading image URL')} />
            </div>
          )}
        </div>

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
