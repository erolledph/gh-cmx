# Setup Guide

Complete instructions for setting up GH-CMX locally and deploying to production.

## Table of Contents
1. [Local Setup](#local-setup)
2. [Environment Variables](#environment-variables)
3. [Firebase Configuration](#firebase-configuration)
4. [GitHub Configuration](#github-configuration)
5. [Development](#development)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Local Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Git
- Firebase account
- GitHub account with a repository

### Step 1: Clone Repository
```bash
git clone https://github.com/erolledph/gh-cmx.git
cd gh-cmx
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Environment File
```bash
cp .env.example .env.local
```

### Step 4: Configure Environment Variables
Edit `.env.local` with your credentials (see section below)

### Step 5: Start Dev Server
```bash
npm run dev
```

Visit `http://localhost:3000` - Admin dashboard at `/dashboard`

---

## Environment Variables

### `.env.local` Template

```env
# GitHub Configuration
GITHUB_OWNER=your_github_username
GITHUB_REPO=repository_name
GITHUB_TOKEN=ghp_your_personal_access_token
ADMIN_PASSWORD=your_admin_password

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Getting Your Credentials

#### GitHub
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control of private repositories)
4. Copy the token and add to `.env.local`

#### Firebase
1. Go to https://console.firebase.google.com
2. Create a new project or use existing
3. Enable Firestore Database
4. Enable Storage
5. Go to Project Settings (gear icon)
6. Copy Web app credentials
7. Add all values to `.env.local`

---

## Firebase Configuration

### Firestore Setup

1. **Create Collections** (optional - auto-created on first write)
   - `comments`
   - `messages`
   - `subscribers`

2. **Deploy Security Rules**
   ```bash
   firebase login
   firebase deploy --only firestore:rules
   ```

3. **Deploy Indexes**
   ```bash
   firebase deploy --only firestore:indexes
   ```

### Storage Setup

1. **Create Folder** (optional - auto-created)
   - `images/admin/`

2. **Deploy Storage Rules**
   ```bash
   firebase deploy --only storage
   ```

### Complete Firebase Deployment
```bash
firebase deploy
```

---

## GitHub Configuration

### Create Blog Repository

1. Create new GitHub repository
2. Create `posts` folder in root
3. Add your `GITHUB_TOKEN` to `.env.local`

### Blog Post Structure

Posts are stored as markdown files in the `posts/` folder with YAML frontmatter:

```markdown
---
title: Post Title
slug: post-slug
tags: [tag1, tag2]
imageUrl: https://...
description: Short description
keywords: seo, keywords
author: Author Name
createdAt: 2025-11-15T00:00:00Z
---

# Content starts here

Your markdown content...
```

---

## Development

### Available Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Project Structure

```
app/
├── api/                    # API routes
│   ├── auth/              # Authentication
│   ├── posts/             # Blog post routes
│   ├── comments/          # Comments CRUD
│   ├── messages/          # Contact messages
│   └── subscribers/       # Newsletter subscribers
├── components/            # Reusable components
│   ├── ImageUpload.tsx   # Image upload with optimization
│   ├── MarkdownEditor.tsx # Markdown editor toolbar
│   └── comments/          # Comment components
├── dashboard/             # Admin dashboard
│   └── tabs/             # Dashboard tabs
├── contact/               # Contact page
├── auth/                  # Login page
└── [slug]/                # Blog post pages

lib/
├── firebase.ts            # Firebase initialization
├── firestore.ts           # Firestore operations
├── github.ts              # GitHub API operations
├── auth.ts                # Session authentication
├── types.ts               # TypeScript types
└── markdown.ts            # Markdown utilities
```

### Key Files

- **firestore.rules** - Database security rules
- **storage.rules** - Storage security rules
- **firestore.indexes.json** - Database indexes

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Connect GitHub Repository**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your repository
   - Click "Import"

2. **Add Environment Variables**
   - In Vercel dashboard: Settings → Environment Variables
   - Add all variables from `.env.local`
   - Keep `NEXT_PUBLIC_*` variables marked as public

3. **Deploy**
   - Click "Deploy"
   - Visit your production URL

### Deploy Firebase Rules

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### Update Production URL

Update `.env.local` (and Vercel variables) with production domain:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Troubleshooting

### "Cannot find module" Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### Firebase Permission Errors
1. Check `firestore.rules` are deployed
2. Check `storage.rules` are deployed
3. Verify Firebase project ID in `.env.local`

### Image Upload Fails
1. Check Firebase Storage bucket name in `.env.local`
2. Verify `storage.rules` allow uploads
3. Check browser console for specific errors
4. Ensure file is under 5MB

### Blog Posts Not Showing
1. Verify `GITHUB_TOKEN` is valid
2. Check `GITHUB_OWNER` and `GITHUB_REPO` are correct
3. Ensure posts folder exists in repository
4. Posts must have valid YAML frontmatter

### Dashboard Login Issues
1. Check `ADMIN_PASSWORD` is set
2. Clear browser cookies
3. Check browser console for errors

### Slow Image Uploads
- Normal behavior - images are being compressed and converted to WebP
- Typical process: compress → resize → convert → upload
- Check browser console for progress status

---

## Support

For issues or questions:
1. Check browser console for error messages
2. Check `.next/` folder is in `.gitignore`
3. Verify all environment variables are set
4. Clear cache: `rm -rf .next node_modules`
5. Reinstall: `npm install`
6. Restart dev server: `npm run dev`
