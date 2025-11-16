#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Clean Next.js cache and build artifacts, but keep the final build output
const cacheDir = path.join(__dirname, '.next', 'cache');
const buildDir = path.join(__dirname, '.next', 'build');

if (fs.existsSync(cacheDir)) {
  try {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log('✓ .next/cache folder cleaned successfully');
  } catch (error) {
    console.error('Error cleaning .next/cache:', error);
  }
}

if (fs.existsSync(buildDir)) {
  try {
    fs.rmSync(buildDir, { recursive: true, force: true });
    console.log('✓ .next/build folder cleaned successfully');
  } catch (error) {
    console.error('Error cleaning .next/build:', error);
  }
}

console.log('✓ Build ready for Cloudflare Pages');
