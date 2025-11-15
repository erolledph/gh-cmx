# GitHub CMS - Setup Guide

A modern, lightweight CMS built with Next.js that uses GitHub for blog posts and Firebase for comments, messages, and subscribers.

## Project Structure

```
app/
├── api/              # API routes for backend
│   ├── auth/         # Authentication endpoints
│   ├── comments/     # Comment management (Firebase)
│   ├── messages/     # Contact form messages (Firebase)
│   ├── posts/        # Blog post management (GitHub)
│   ├── subscribers/  # Newsletter subscribers (Firebase)
│   └── dashboard/    # Dashboard stats
├── dashboard/        # Admin dashboard
│   └── tabs/         # Dashboard tab components
├── contact/          # Public contact page
├── components/       # Reusable components
│   └── comments/     # Comment system components
└── [slug]/          # Blog post pages

lib/
├── firebase.ts       # Firebase initialization
├── firestore.ts      # Firestore service functions
├── github.ts         # GitHub API integration
├── auth.ts          # Authentication utilities
├── markdown.ts      # Markdown to HTML conversion
└── types.ts         # TypeScript type definitions
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repo-url>
cd gh-cmx
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file with the following:

```env
# GitHub Configuration
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
ADMIN_PASSWORD=your_admin_password
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G_MEASUREMENT_ID
```

### 3. Set Up Firebase

#### Create Firestore Collections

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Firestore Database
4. Create the following collections:
   - `comments`
   - `messages`
   - `subscribers`

#### Create Firestore Indexes

Copy the security rules and indexes from `firestore.rules` file to your Firebase console under Firestore Database > Rules.

Create the following indexes:

**comments collection:**
- Fields: `slug` (Ascending), `approved` (Ascending), `createdAt` (Descending)

**messages collection:**
- Fields: `createdAt` (Descending)

**subscribers collection:**
- Fields: `unsubscribed` (Ascending), `subscribedAt` (Descending)

### 4. Set Up GitHub Configuration

#### Create GitHub Repository for Blog Posts

1. Create a new GitHub repository (e.g., `gh-cmx`)
2. Create an `app/posts` directory
3. Add your first blog post as `markdown-file-name.md` with this format:

```markdown
---
title: Your Blog Post Title
slug: your-blog-post-slug
description: A short description of your post
imageUrl: https://example.com/image.jpg
tags: [tag1, tag2, tag3]
author: Your Name
keywords: keyword1, keyword2
createdAt: 2024-01-15T10:30:00Z
---

# Your Blog Post Content

This is your markdown content...
```

#### Generate GitHub Token

1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control of private repositories)
4. Generate and copy the token
5. Add it to `.env.local` as `GITHUB_TOKEN`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Public Features
- **Blog Posts**: Display blog posts from GitHub with syntax highlighting
- **Comments System**: Threaded comment system with moderation
- **Newsletter**: Subscribe to email notifications
- **Contact Form**: Public contact page for messages

### Admin Dashboard

Access at `/auth` to login with your admin password.

#### Dashboard Tabs

1. **Overview** - Statistics dashboard with quick overview
   - Total posts, comments, messages, subscribers
   - Recent activity feeds

2. **Content** - Blog post management
   - View all posts
   - Copy post links
   - Open, edit, or delete posts
   - Sort by date created

3. **Comments** - Comment moderation
   - View all comments
   - Filter by post or approval status
   - Approve/reject comments
   - Delete comments
   - Support for threaded comments

4. **Messages** - Contact form inbox
   - View all contact messages
   - Mark as read/unread
   - Reply via email
   - Delete messages

5. **Subscribers** - Newsletter subscribers
   - View all subscribers
   - Copy email list
   - Unsubscribe users

6. **Create Post** - Create new blog posts
   - Editor for post metadata
   - Markdown editor
   - Auto-generate slug from title

## API Endpoints

### Comments
- `GET /api/comments?slug=post-slug` - Get comments for a post
- `GET /api/comments` - Get all comments (admin only)
- `POST /api/comments` - Create a comment
- `PUT /api/comments` - Update/approve a comment (admin only)
- `DELETE /api/comments?id=comment-id` - Delete a comment (admin only)

### Messages
- `GET /api/messages` - Get all messages (admin only)
- `POST /api/messages` - Submit contact form
- `PUT /api/messages` - Mark message as read (admin only)
- `DELETE /api/messages?id=message-id` - Delete message (admin only)

### Subscribers
- `GET /api/subscribers` - Get all subscribers (admin only)
- `POST /api/subscribers` - Subscribe to newsletter
- `DELETE /api/subscribers?email=user@example.com` - Unsubscribe

### Posts
- `GET /api/posts/all` - Get all blog posts

## Deployment

### Cloudflare Pages

1. Push your code to GitHub
2. Connect your repository to Cloudflare Pages
3. Set build command: `npm run build`
4. Set output directory: `.next`
5. Add environment variables in Cloudflare Pages settings
6. Deploy!

The site will auto-deploy whenever you push changes to GitHub.

## Styling

Currently, the project uses minimal styling with Tailwind CSS. You can enhance styling in the future without affecting functionality.

## Security Considerations

- Always use strong admin passwords
- Keep your GitHub token and Firebase credentials secret
- Enable Firestore security rules for production
- Moderate comments before they appear publicly
- Regularly backup your GitHub posts

## Troubleshooting

### Comments not appearing
- Check if comment is approved in the dashboard
- Verify Firestore security rules are correctly set

### Blog posts not showing
- Ensure GitHub token is valid and has repo access
- Check the blog post format matches the markdown template
- Verify `app/posts` directory exists in your GitHub repo

### Firebase connection issues
- Verify environment variables are set correctly
- Check Firebase project ID and credentials
- Ensure Firestore collections exist

## Future Enhancements

- [ ] Email notifications for new messages
- [ ] Email digest for new blog posts
- [ ] User authentication for comments
- [ ] Comment spam detection
- [ ] Advanced blog post scheduling
- [ ] Search functionality
- [ ] Blog post categories
