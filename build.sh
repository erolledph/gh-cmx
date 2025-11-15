#!/bin/bash
# Post-build script to clean cache for Cloudflare Pages

echo "Cleaning .next/cache directory for Cloudflare Pages deployment..."

# Remove cache to keep build size under 25MB
if [ -d ".next/cache" ]; then
  rm -rf .next/cache
  echo "✓ Cache cleaned successfully"
else
  echo "✓ No cache directory found"
fi

echo "Build ready for deployment!"
