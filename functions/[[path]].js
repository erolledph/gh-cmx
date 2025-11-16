// Cloudflare Pages Function to handle Next.js routing
// This file handles all requests and serves the appropriate Next.js pages

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Skip static assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/)
  ) {
    // Let default static file serving handle these
    return context.env.ASSETS.fetch(request);
  }

  // For all other routes, try to serve from .next
  try {
    // Try to get the route from .next
    const assetPath = pathname === '/' ? '/index.html' : `${pathname}/index.html`;
    const assetRequest = new Request(new URL(assetPath, request.url), request);
    const response = await context.env.ASSETS.fetch(assetRequest);
    
    if (response.status === 200) {
      return response;
    }
  } catch (e) {
    // Continue to fallback
  }

  // Fallback to index.html for client-side routing
  try {
    const indexRequest = new Request(new URL('/index.html', request.url), request);
    return await context.env.ASSETS.fetch(indexRequest);
  } catch (e) {
    return new Response('Not found', { status: 404 });
  }
}
