# GH-CMX: GitHub CMS

A modern, headless CMS built with **Next.js 13**, **Firebase**, and **GitHub**, featuring admin dashboard, comments system, contact forms, and newsletter subscription.

## ✨ Features

### 📝 Blog Management
- Blog posts stored in GitHub (markdown with YAML frontmatter)
- Admin dashboard with markdown editor toolbar
- Automatic slug generation from titles
- SEO metadata support

### 💬 Open Comments System
- Real-time threaded comments (no approval needed)
- Built on Firebase Firestore
- Admin can delete inappropriate comments

### 📧 Contact & Newsletter
- Public contact form
- Newsletter subscription system
- Admin inbox for message management

### 🖼️ Media Management
- Firebase Storage image uploads
- **Automatic image optimization**: compress, resize (1200px max), convert to WebP
- Dual input options: upload OR paste URL
- Direct URL auto-fills from uploads
- 5MB file size limit

### 👤 Admin Dashboard
- Password-protected (session-based)
- 6 management tabs:
  - **Overview** - Real-time statistics
  - **Content** - Browse all posts
  - **Comments** - Manage comments
  - **Messages** - Contact form inbox
  - **Subscribers** - Newsletter list
  - **Create** - New post creation

### 🔒 Security
- Firestore security rules
- Firebase Storage validation
- Session-based authentication

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm/yarn
- Firebase project
- GitHub Personal Access Token

### Installation

```bash
# Clone and setup
git clone https://github.com/erolledph/gh-cmx.git
cd gh-cmx
npm install

# Configure environment (see SETUP.md)
cp .env.example .env.local
# Edit .env.local with your credentials

# Start dev server
npm run dev
```

Visit `http://localhost:3000` - Dashboard at `/dashboard`

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup & deployment guide
- **[firestore.rules](firestore.rules)** - Security rules
- **[storage.rules](storage.rules)** - Storage configuration

## 🏗️ Architecture

### Frontend
- Next.js 13 (App Router)
- React 18
- Tailwind CSS
- TypeScript

### Backend
- Next.js API Routes
- Firestore (database)
- Firebase Storage (images)
- GitHub API (blog posts)

### Deployment
- Vercel (recommended)
- Firebase (Firestore, Storage)
- GitHub (blog post storage)

## 📝 Blog Post Format

Posts stored as markdown in GitHub with YAML frontmatter:

```markdown
---
title: My First Post
slug: my-first-post
tags: [javascript, nextjs]
imageUrl: https://...
description: Post summary
keywords: seo, keywords
author: Your Name
createdAt: 2025-11-15T00:00:00Z
---

# Your content here
```

## 🔧 Environment Variables

See `.env.example` and [SETUP.md](SETUP.md) for details.

## 📦 Dependencies

- `firebase` - Backend services
- `image-resize-compress` - Image optimization
- `tailwindcss` - Styling
- `typescript` - Type safety

## 🤝 Contributing

Feel free to submit issues and PRs!

## 📄 License

MIT

## ✨ Features

### 📝 Blog Management
- Blog posts stored in GitHub repository (as markdown)
- Admin dashboard for creating/editing content
- Markdown editor with toolbar (H1, H2, lists, links, alignment, images)
- Automatic slug generation from titles
- SEO metadata support

### 💬 Comments System
- Real-time threaded comments without approval workflow
- Public read/write (no authentication needed)
- Admin can delete spam/inappropriate comments
- Built on Firebase Firestore

### 📧 Contact & Newsletter
- Public contact form (stores messages in Firebase)
- Newsletter subscription system
- Admin inbox to view and manage messages
- Mark messages as read/unread

### 🖼️ Media Management
- Firebase Storage for image uploads
- Direct upload from admin dashboard
- 5MB file size limit (images only)
- Public access to all uploaded images

### 👤 Admin Dashboard
- Password-protected dashboard
- 6 management tabs:
  - **Overview** - Statistics & recent activity
  - **Content** - Blog post management
  - **Comments** - Comment moderation
  - **Messages** - Contact inbox
  - **Subscribers** - Newsletter subscribers
  - **Create** - New blog post creation

### 🔒 Security
- Firestore security rules for data protection
- Firebase Storage rules with upload validation
- Admin password authentication
- Session cookies (30-day expiry)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase project
- GitHub repository (for blog posts)
- GitHub Personal Access Token

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/erolledph/gh-cmx.git
cd gh-cmx
npm install
```

2. **Set up environment variables**
Create `.env.local`:
```env
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
GITHUB_TOKEN=your_github_token
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. **Deploy Firebase rules and indexes**
```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy
```

4. **Run development server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
app/
├── page.tsx                    # Homepage
├── [slug]/page.tsx            # Blog post pages
├── auth/page.tsx              # Admin login
├── contact/page.tsx           # Contact page
├── dashboard/                 # Admin dashboard
│   ├── page.tsx
│   ├── DashboardClient.tsx
│   └── tabs/                  # Dashboard tabs
├── api/                       # Backend API routes
│   ├── auth/
│   ├── comments/
│   ├── messages/
│   ├── subscribers/
│   ├── posts/
│   └── dashboard/
├── components/
│   ├── comments/             # Comment system
│   ├── ImageUpload.tsx       # Firebase Storage upload
│   ├── MarkdownEditor.tsx    # Markdown toolbar editor
│   └── NewsletterSubscribe.tsx
└── globals.css

lib/
├── firebase.ts               # Firebase SDK init
├── firestore.ts              # Firestore CRUD
├── github.ts                 # GitHub API
├── markdown.ts               # Markdown parser
├── auth.ts                   # Authentication
└── types.ts                  # TypeScript types

firestore.rules              # Firestore security rules
storage.rules                # Storage security rules
firestore.indexes.json       # Composite indexes
firebase.json                # Firebase CLI config
```

## 🛠️ Usage

### Create a Blog Post
1. Navigate to `/dashboard`
2. Login with admin password
3. Click "Create" tab
4. Fill in title, description, tags, etc.
5. Upload image (optional)
6. Write content in markdown with toolbar
7. Click "Save Post"

### Manage Comments
1. Go to dashboard → Comments tab
2. View all comments across posts
3. Filter by post slug
4. Delete spam/inappropriate comments
5. Replies are organized by parent comment

### Contact Form
- Available at `/contact`
- Messages stored in Firebase
- Admin can view/respond in dashboard → Messages tab

### Newsletter
- Subscribe widget on blog posts
- Admin can view subscribers in dashboard → Subscribers tab
- Manage subscription list

## 📊 Architecture

### Frontend (Next.js)
- **App Router** - Next.js 13 app directory
- **React Hooks** - State management
- **Tailwind CSS** - Styling
- **Server Components** - Page rendering

### Backend (API Routes)
- **Route Handlers** - RESTful API endpoints
- **Firebase Admin** - Server-side operations
- **Authentication** - Session cookies

### Database (Firebase)
- **Firestore** - Comments, messages, subscribers
- **Storage** - Uploaded images
- **Rules** - Security & access control

### Blog Posts (GitHub)
- **Repository** - Markdown storage
- **Markdown** - Post content format
- **YAML Front Matter** - Post metadata

## 🔐 Security Rules

### Firestore
- ✅ Comments: Public read/write
- ✅ Messages: Public create, admin read/manage
- ✅ Subscribers: Public subscribe/manage
- 🔒 Dashboard stats: Admin only

### Storage
- ✅ Images: Public read
- 🔒 Admin uploads: Authenticated only
- Max 5MB file size
- Image files only

## 📦 Dependencies

```json
{
  "next": "13.5.1",
  "react": "18.2.0",
  "firebase": "^10.0.0",
  "octokit": "^3.0.0",
  "tailwindcss": "^3.3.0"
}
```

## 🚢 Deployment

### Firebase Hosting (Recommended)
```bash
firebase init hosting
firebase deploy
```

### Vercel
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Self-Hosted (Docker)
```bash
npm run build
npm run start
```

## 🐛 Troubleshooting

### Firebase Permission Errors
- Check Firestore security rules deployed
- Verify Firebase credentials in `.env.local`
- Clear browser cache and restart dev server

### Images Won't Upload
- Verify Firebase Storage enabled
- Check Storage rules deployed
- Ensure file is under 5MB
- File must be image type

### Comments Not Showing
- Wait 5-15 minutes for Firestore indexes to build
- Check browser console for specific errors
- Verify Firestore collections exist

### GitHub Posts Not Loading
- Verify GitHub token is valid
- Check repository access
- Ensure posts exist in correct path
- Verify YAML front matter format

## 📚 Documentation

- **FIREBASE_DEPLOYMENT.md** - Firebase CLI setup and deployment
- **PRODUCTION_READY.md** - Production checklist and issues fixed
- **.env.example** - Environment variables template

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial use.

## 🙋 Support

For issues and questions:
1. Check existing GitHub issues
2. Review documentation files
3. Check Firebase Console logs
4. Open a new GitHub issue

## 🎉 Credits

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend services
- [GitHub API](https://docs.github.com/en/rest) - Blog storage
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Status:** ✅ Production Ready
**Last Updated:** November 2025
**Version:** 1.0.0
