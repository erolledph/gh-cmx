# 🚀 Cloudflare Pages Setup - Final Steps

Your Next.js blog is almost live! Follow these steps to complete the deployment.

## Step 1: Configure Build Settings in Cloudflare Dashboard

1. Go to: **https://dash.cloudflare.com**
2. Select **Workers & Pages** from the sidebar
3. Find your **gh-cmx** project
4. Click on it to open the project details
5. Go to the **Settings** tab
6. Click on **Build & deployments**
7. Look for **Build settings** section
8. Click **Configure**

### Fill in these values:

- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Node version**: `22` (or latest available)
- **Root directory**: `/` (leave as is)

9. Click **Save** at the bottom

## Step 2: Retry the Deployment

1. Go back to your gh-cmx project
2. Click on the **Deployments** tab
3. Find the latest deployment (should show as "Failed" or "Processing")
4. Click the **three dots (...)** menu
5. Select **Retry deployment**
6. Wait 2-3 minutes for the build to complete

## Step 3: Check Your Site

Once the build completes (you'll see a green checkmark):

- Visit: **https://c485c804.gh-cmx.pages.dev**
- Or your custom domain if configured

You should see:
- ✅ Home page with the welcome blog post
- ✅ Blog post accessible at `/welcome-to-the-blog`
- ✅ Admin login at `/admin/login`
- ✅ Comments and subscribers system working

## Troubleshooting

If you still see a 404:

1. **Check build status**: Go to Deployments tab - should show "✓ Success"
2. **Clear cache**: Use browser's hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. **Check logs**: Click on the deployment to see build logs

## Next Steps After Deployment

Once your site is live:

1. **Set custom domain** (optional):
   - In Cloudflare dashboard, go to Custom domain
   - Add your domain

2. **Login to admin dashboard**:
   - Visit: `https://yourdomain.com/admin/login`
   - Enter your ADMIN_PASSWORD from `.env.local`
   - Create new blog posts

3. **Add more blog posts**:
   - Push markdown files to `app/posts/` folder
   - Or use the admin dashboard to create posts

4. **Subscribe readers**:
   - Readers can subscribe on blog posts
   - Data stored in Firebase Firestore

## Environment Variables

Your site uses these env variables from Cloudflare Pages:

- `GITHUB_OWNER` - Your GitHub username
- `GITHUB_REPO` - Your repository name
- `GITHUB_TOKEN` - GitHub personal access token
- `ADMIN_PASSWORD` - Admin dashboard password
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration (public)

These should be already set in your Cloudflare Pages environment. If not, add them in the dashboard.

---

**That's it!** Your blog should be live and working. 🎉
