import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

/**
 * Handle requests to Cloudflare Pages
 * Serve static assets or Next.js pages
 */
export default {
  async fetch(request, env, ctx) {
    try {
      // Try to get the asset from the `.next/static` folder
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: importMetaEnv.ASSET_MANIFEST,
          cacheControl: {
            default: 'public, max-age=3600',
            'sMaxAge': 60,
          },
        }
      );
    } catch (error) {
      // If static asset not found, return index.html for client-side routing
      if (request.method === 'GET') {
        try {
          return await getAssetFromKV(
            {
              request: new Request(new URL('/index.html', request.url)),
              waitUntil: ctx.waitUntil.bind(ctx),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
              ASSET_MANIFEST: importMetaEnv.ASSET_MANIFEST,
            }
          );
        } catch (e) {
          return new Response('Not found', { status: 404 });
        }
      }

      return new Response('Method not allowed', { status: 405 });
    }
  },
};
