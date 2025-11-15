'use client';

import { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { fromBlob, blobToURL } from 'image-resize-compress';

interface ImageUploadProps {
  onImageUrl: (url: string) => void;
}

export default function ImageUpload({ onImageUrl }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [processStatus, setProcessStatus] = useState('');

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
    setProcessStatus('Creating preview...');

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Compress, resize, and convert to WebP
      setProcessStatus('Compressing and converting to WebP...');
      console.log('Original file size:', file.size, 'bytes');
      
      const compressedBlob = await fromBlob(
        file,
        80, // quality: 80% for good quality/size balance
        1200, // width: max 1200px (auto-scale if taller)
        'auto', // height: auto-scale based on aspect ratio
        'webp' // format: convert to WebP
      );

      console.log('Compressed file size:', compressedBlob.size, 'bytes');
      const compressionRatio = ((1 - compressedBlob.size / file.size) * 100).toFixed(1);
      console.log('Compression ratio:', compressionRatio + '%');

      // Generate filename with .webp extension
      setProcessStatus('Uploading to Firebase...');
      const timestamp = Date.now();
      const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove original extension
      const filename = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9-_]/g, '')}.webp`;
      const storageRef = ref(storage, `images/admin/${filename}`);

      console.log('Starting upload to:', `images/admin/${filename}`);
      
      await uploadBytes(storageRef, compressedBlob);
      const downloadURL = await getDownloadURL(storageRef);

      console.log('Upload successful. URL:', downloadURL);
      
      onImageUrl(downloadURL);
      setSuccess(true);
      setError('');
      setProcessStatus('');
      
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
      setProcessStatus('');
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
        {uploading && <span className="text-sm text-blue-600 font-semibold">⏳ Processing...</span>}
        {success && <span className="text-sm text-green-600 font-semibold">✓ Done</span>}
      </div>

      {processStatus && (
        <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
          {processStatus}
        </div>
      )}

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
