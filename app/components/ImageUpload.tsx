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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5242880) {
      setError('Image must be less than 5MB');
      return;
    }

    setError('');
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
      const filename = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `images/admin/${filename}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      onImageUrl(downloadURL);
      setError('');
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Make sure Firebase Storage is configured.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold">Upload Image</label>
      
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="border p-2 rounded flex-1"
        />
        {uploading && <span className="text-sm text-blue-600">Uploading...</span>}
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {preview && (
        <div className="mt-2">
          <p className="text-xs text-gray-600 mb-1">Preview:</p>
          <img src={preview} alt="Preview" className="max-w-xs h-auto rounded border" />
        </div>
      )}
    </div>
  );
}
