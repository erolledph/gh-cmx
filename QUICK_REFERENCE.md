# Quick Reference - GitHub CMS

## Routes

### Public Routes
- `/` - Home page
- `/posts/[slug]` - Blog post page (with comments)
- `/contact` - Contact form page

### Admin Routes
- `/auth` - Login (requires admin password)
- `/dashboard` - Admin dashboard (with tabs)

## Dashboard Tabs

1. **📊 Overview** - Stats, recent activity
2. **📝 Content** - Manage blog posts (view, copy link, edit, delete)
3. **💬 Comments** - Moderate comments (approve, reject, delete)
4. **📧 Messages** - Contact form inbox (view, reply, delete)
5. **👥 Subscribers** - Newsletter subscribers (view, copy emails, unsubscribe)
6. **✨ Create Post** - Create new blog posts

## Key Files

### Backend
- `app/api/` - All API endpoints
- `lib/firebase.ts` - Firebase config
- `lib/firestore.ts` - Database functions
- `lib/github.ts` - GitHub API integration

### Frontend
- `app/dashboard/` - Admin dashboard
- `app/components/comments/` - Comment system
- `app/[slug]/page.tsx` - Blog post page
- `app/contact/` - Contact page

### Configuration
- `.env.local` - Environment variables
- `firestore.rules` - Security rules guide
- `SETUP_GUIDE.md` - Detailed setup
- `IMPLEMENTATION_COMPLETE.md` - What was built

## Environment Variables

```env
GITHUB_OWNER=username
GITHUB_REPO=repo_name
GITHUB_TOKEN=ghp_xxxxx
ADMIN_PASSWORD=password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxxx
NEXT_PUBLIC_FIREBASE_APP_ID=1:xxxxx:web:xxxxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G_XXXXX
```

## Firestore Collections

### comments
- slug: string
- author: string
- email: string
- content: string
- parentId: string (optional, for replies)
- approved: boolean
- createdAt: timestamp
- updatedAt: timestamp

### messages
- name: string
- email: string
- subject: string
- message: string
- read: boolean
- createdAt: timestamp

### subscribers
- email: string
- subscribedAt: timestamp
- unsubscribed: boolean

## Common Tasks

### Create a Blog Post
1. Go to Dashboard > Create Post tab
2. Fill in title, description, content (markdown), etc.
3. Click "Save Post"
4. Post appears in GitHub `app/posts/` folder

### Approve a Comment
1. Go to Dashboard > Comments tab
2. Find the comment
3. Click "Approve" button

### View Contact Messages
1. Go to Dashboard > Messages tab
2. Click a message to read details
3. Reply via email link

### Manage Subscribers
1. Go to Dashboard > Subscribers tab
2. View all subscriber emails
3. Click "Copy All Emails" or "Unsubscribe" individual emails

### Delete a Blog Post
1. Go to Dashboard > Content tab
2. Find the post in table
3. Click "Delete" button
4. Confirm deletion

## Admin Password

Set in environment variable: `ADMIN_PASSWORD`

Login at: `/auth`

## Deployment

Push to GitHub → Cloudflare Pages auto-deploys

Build settings:
- Command: `npm run build`
- Output: `.next`

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linter
```

## Support

- See `SETUP_GUIDE.md` for detailed setup
- See `IMPLEMENTATION_COMPLETE.md` for full feature list
- Check `firestore.rules` for security rules guide

---

**This CMS is fully functional and ready to use!**
