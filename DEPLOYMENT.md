# Deployment Guide

## Recommended: Deploy to Vercel (Best for Next.js)

Vercel is the official Next.js deployment platform and offers the best compatibility and performance.

### Quick Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Create New Project"**
3. Connect your GitHub repository (`erolledph/gh-cmx`)
4. Vercel will auto-detect Next.js configuration
5. Add Environment Variables (from **Settings → Environment Variables**):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_value
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
   NEXT_PUBLIC_FIREBASE_APP_ID=your_value
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_value
   NEXT_PUBLIC_SITE_URL=your_vercel_domain
   ```
6. Click **"Deploy"**

That's it! Vercel will handle everything automatically.

### Benefits of Vercel
- ✅ Perfect Next.js support (made by same team)
- ✅ Automatic deployments on every push
- ✅ Free tier includes serverless functions
- ✅ Built-in analytics and performance monitoring
- ✅ Custom domains (including .pages.dev)
- ✅ Preview deployments for pull requests

---

## Alternative: Cloudflare Pages (Requires Functions)

If you want to stay with Cloudflare Pages, you'll need to use **Cloudflare Workers** as serverless functions to handle dynamic routes (API endpoints). This is more complex and requires:

1. Creating `functions/` directory for server-side code
2. Configuring `wrangler.toml` 
3. Building for static export

We recommend **Vercel instead** for a much simpler setup.

---

## Current Deployment Status

- **Repository**: Ready to deploy ✅
- **Build**: Working correctly ✅
- **Environment**: Needs configuration
- **Recommended Platform**: Vercel (Free tier available)
