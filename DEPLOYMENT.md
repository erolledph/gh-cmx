# Deployment Guide

## Deploy to Cloudflare Pages

### Setup Instructions

1. **Connect Cloudflare to GitHub**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Go to **Workers & Pages** → **Pages**
   - Click **Connect to Git**
   - Authorize GitHub and select `erolledph/gh-cmx`

2. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: (leave blank)

3. **Add Environment Variables**
   - Go to **Settings** → **Environment variables** → **Production**
   - Add all Firebase configuration:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_value
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
     NEXT_PUBLIC_FIREBASE_APP_ID=your_value
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_value
     NEXT_PUBLIC_SITE_URL=https://gh-cmx.pages.dev
     ```

4. **Deploy**
   - Click **Save and Deploy**
   - Cloudflare will automatically deploy on every push to `main` branch

### Monitoring

- Check deployment status in **Deployments** tab
- View logs in each deployment's **View details**
- Custom domain: Go to **Custom domains** to add your own domain

### Benefits
- ✅ Free tier with generous limits
- ✅ Global CDN for fast performance
- ✅ Automatic HTTPS
- ✅ Git integration with auto-deploy
- ✅ Analytics and security features
- ✅ Edge computing ready

---

## Troubleshooting

If you see 404 errors:
1. Make sure **Build output** is set to `.next` (not `.next/static`)
2. Ensure environment variables are set
3. Check **Deployments** for build logs

If build fails:
1. Check error logs in deployment details
2. Verify `npm run build` works locally with: `npm run build`
3. Ensure all environment variables are configured

