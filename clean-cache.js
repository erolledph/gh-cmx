#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Remove .next/cache directory for Cloudflare Pages
const cacheDir = path.join(__dirname, '.next', 'cache');

if (fs.existsSync(cacheDir)) {
  try {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log('✓ Cache cleaned successfully for Cloudflare Pages');
  } catch (error) {
    console.error('Error cleaning cache:', error);
    process.exit(1);
  }
} else {
  console.log('✓ No cache directory found');
}
