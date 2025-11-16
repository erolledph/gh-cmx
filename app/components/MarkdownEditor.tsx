'use client';

import { useRef } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function insertMarkdown(before: string, after: string = '') {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const newValue = value.substring(0, start) + before + selected + after + value.substring(end);

    onChange(newValue);

    // Reset cursor position
    setTimeout(() => {
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selected.length;
      textarea.focus();
    }, 0);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold">Content (Markdown)</label>

      {/* Toolbar */}
      <div className="border rounded-t bg-gray-100 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => insertMarkdown('# ')}
          title="Heading 1"
          className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('## ')}
          title="Heading 2"
          className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm"
        >
          H2
        </button>

        <div className="border-l mx-1" />

        <button
          type="button"
          onClick={() => insertMarkdown('- ')}
          title="Bullet List"
          className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('1. ')}
          title="Number List"
          className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm"
        >
          1. List
        </button>

        <div className="border-l mx-1" />

        <button
          type="button"
          onClick={() => insertMarkdown('[', '](url)')}
          title="Link"
          className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm"
        >
          🔗 Link
        </button>

        <div className="border-l mx-1" />

        <button
          type="button"
          onClick={() => insertMarkdown('\n<div style="text-align: left">\n', '\n</div>\n')}
          title="Align Left"
          className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm"
        >
          ⬅ Left
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('\n<div style="text-align: center">\n', '\n</div>\n')}
          title="Align Center"
          className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm"
        >
          ⬍ Center
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('\n<div style="text-align: right">\n', '\n</div>\n')}
          title="Align Right"
          className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm"
        >
          ➡ Right
        </button>

        <div className="border-l mx-1" />

        <button
          type="button"
          onClick={() => insertMarkdown('![alt text](', ')')}
          title="Insert Image"
          className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-sm"
        >
          🖼 Image
        </button>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Write your content in Markdown...'}
        className="w-full h-64 border border-t-0 p-3 rounded-b font-mono text-sm resize-none"
      />

      <div className="text-xs text-gray-600">
        💡 Tips: Use # for H1, ## for H2, - for bullets, [text](url) for links
      </div>
    </div>
  );
}
