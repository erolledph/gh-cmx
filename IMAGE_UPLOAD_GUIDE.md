# Image Upload Feature Guide

## Overview
The image upload feature in the admin dashboard provides TWO convenient options for adding images to blog posts:

1. **Upload Images** - Directly upload image files from your computer
2. **Paste Image URL** - Use external image URLs or previously uploaded image URLs

## Features

### Upload Images
- **File types**: JPEG, PNG, GIF, WebP, and other image formats
- **Max size**: 5MB per image
- **Storage location**: Firebase Storage (`images/admin/` folder)
- **Auto-fill**: Image URL automatically fills into the "Image URL" field after successful upload
- **Preview**: See a preview of the uploaded image
- **Public access**: Uploaded images are publicly accessible at their returned URL

### Paste Image URL
- **Manual entry**: Paste any image URL directly
- **Flexibility**: Use external URLs or Firebase Storage URLs
- **Live preview**: See a preview of the image URL
- **Always available**: You can always use this option instead of uploading

## How to Use

### Method 1: Upload an Image
1. Go to Admin Dashboard → **Create** tab
2. In the **Image URL** section, click **Choose File**
3. Select an image from your computer (max 5MB)
4. Wait for the upload to complete (you'll see "✓ Uploaded")
5. The image URL will automatically appear in the **"Paste Image URL Directly"** field
6. A preview will show below the URL field
7. Continue filling out the rest of the post form
8. Click **Save Post**

### Method 2: Use Direct URL
1. Go to Admin Dashboard → **Create** tab
2. In the **Image URL** section, find **"Paste Image URL Directly"**
3. Paste your image URL (e.g., `https://example.com/image.jpg`)
4. A preview will appear below
5. Continue filling out the rest of the post form
6. Click **Save Post**

### Method 3: Upload then Modify
1. Upload an image (see Method 1)
2. The URL auto-fills automatically
3. You can edit or replace the URL if needed
4. Click **Save Post**

## Troubleshooting

### "Upload failed: Permission denied"
- **Cause**: Firebase Storage rules may not allow uploads
- **Solution**: Check Firebase Console → Storage → Rules to ensure the rules allow writes to `images/admin/`
- **Expected rule**: Should allow image uploads with file size < 5MB

### "Upload failed: Storage bucket not found"
- **Cause**: Firebase project not configured correctly
- **Solution**: Verify your `.env.local` has `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` set
- **Example**: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=juantalk-blog.appspot.com`

### "Image must be less than 5MB"
- **Cause**: Selected file is too large
- **Solution**: Compress the image or choose a smaller file
- **Tools**: Use online image compressors or your OS image editing software

### "Please select an image file"
- **Cause**: Selected file is not an image
- **Solution**: Make sure to select an image file (JPEG, PNG, GIF, WebP, etc.)

### "Image URL is not loading in preview"
- **Cause**: URL is incorrect or image is not publicly accessible
- **Solution**: 
  - Double-check the URL you pasted
  - Make sure the image host allows public access
  - If using Firebase URL, ensure Storage rules allow public read access

## Firebase Configuration

### Storage Rules Required
```plaintext
// Allow public read access to all images
match /images/{allPaths=**} {
  allow read: if true;
}

// Allow uploads to images/admin/ with validation
match /images/admin/{fileName} {
  allow write: if request.resource.contentType.matches('image/.*') &&
                  request.resource.size < 5242880; // 5MB limit
}
```

### Environment Variables Required
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Image URL Format

Uploaded images will have URLs in this format:
```
https://firebasestorage.googleapis.com/v0/b/your-project.appspot.com/o/images%2Fadmin%2F1234567890-imagename.jpg?alt=media&token=...
```

These URLs are:
- **Public**: No authentication required to view
- **Permanent**: URL won't change (unless image is deleted)
- **Cacheable**: Can be cached by browsers and CDNs
- **Direct**: Can be embedded in HTML/Markdown directly

## Best Practices

1. **Use descriptive filenames** - Helps you identify images later
2. **Compress before uploading** - Keeps file size small and loads faster
3. **Use consistent image sizes** - Creates better looking blog layouts
4. **Test URLs** - Verify image URLs work before publishing
5. **Backup original images** - Keep copies in case you need to re-upload

## Implementation Details

### Component Files
- `app/components/ImageUpload.tsx` - Handles file upload to Firebase Storage
- `app/dashboard/tabs/CreatePostTab.tsx` - Provides both upload and URL input options

### Storage Path
All uploaded images go to: `gs://your-project.appspot.com/images/admin/`

### File Naming
Files are named with timestamp to prevent collisions:
```
{timestamp}-{original-filename}
```
Example: `1704067890-my-photo.jpg`

### Error Handling
The upload component provides detailed error messages:
- File type validation (images only)
- File size validation (< 5MB)
- Upload success feedback
- Clear error messages for troubleshooting
