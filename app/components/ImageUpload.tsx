'use client';

import { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ImageUploadProps {
  onImageUrl: (url: string) => void;
}

export default function ImageUpload({ onImageUrl }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string>('');
  const [success, setSuccess] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, GIF, WebP)');
      setSuccess(false);
      return;
    }

    if (file.size > 5242880) {
      setError('Image must be less than 5MB');
      setSuccess(false);
      return;
    }

    setError('');
    setSuccess(false);
    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Firebase Storage
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const storageRef = ref(storage, `images/admin/${filename}`);

      console.log('Starting upload to:', `images/admin/${filename}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      console.log('Upload successful. URL:', downloadURL);
      
      onImageUrl(downloadURL);
      setSuccess(true);
      setError('');
      
      // Clear file input
      e.target.value = '';
    } catch (err: any) {
      console.error('Upload error:', err);
      const errorMessage = err?.message || 'Unknown error occurred';
      
      if (errorMessage.includes('unauthorized') || errorMessage.includes('permission')) {
        setError('Permission denied. Check Firebase Storage rules and authentication.');
      } else if (errorMessage.includes('not found')) {
        setError('Storage bucket not found. Check Firebase configuration.');
      } else {
        setError(`Upload failed: ${errorMessage}`);
      }
      setSuccess(false);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="border p-2 rounded w-full"
          />
        </div>
        {uploading && <span className="text-sm text-blue-600 font-semibold">⏳ Uploading...</span>}
        {success && <span className="text-sm text-green-600 font-semibold">✓ Uploaded</span>}
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
          {error}
        </div>
      )}

      {preview && (
        <div className="mt-2">
          <p className="text-xs text-gray-600 mb-1">Preview:</p>
          <img src={preview} alt="Preview" className="max-w-xs h-auto rounded border" />
        </div>
      )}
    </div>
  );
}
