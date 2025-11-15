export interface BlogPost {
  slug: string;
  title: string;
  tags: string[];
  imageUrl: string;
  content: string;
  description: string;
  keywords: string;
  author: string;
  createdAt: string;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  tags: string[];
  imageUrl: string;
  description: string;
  author: string;
  createdAt: string;
}

const GITHUB_API = 'https://api.github.com';
const POSTS_PATH = 'app/posts';

function getGitHubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseMarkdown(markdown: string): BlogPost {
  const metaRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(metaRegex);

  if (!match) {
    return {
      slug: '',
      title: '',
      tags: [],
      imageUrl: '',
      content: markdown,
      description: '',
      keywords: '',
      author: '',
      createdAt: new Date().toISOString(),
    };
  }

  const [, frontMatter, content] = match;
  const meta: any = {};

  frontMatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      if (key.trim() === 'tags') {
        meta[key.trim()] = value.replace(/[\[\]]/g, '').split(',').map(t => t.trim());
      } else {
        meta[key.trim()] = value;
      }
    }
  });

  return {
    slug: meta.slug || '',
    title: meta.title || '',
    tags: meta.tags || [],
    imageUrl: meta.imageUrl || '',
    content: content.trim(),
    description: meta.description || '',
    keywords: meta.keywords || '',
    author: meta.author || '',
    createdAt: meta.createdAt || new Date().toISOString(),
  };
}

export async function getAllPosts(): Promise<BlogPostMetadata[]> {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/${POSTS_PATH}`,
      {
        headers: getGitHubHeaders(),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return [];
    }

    const files = await response.json();
    const posts: BlogPostMetadata[] = [];

    for (const file of files) {
      if (file.name.endsWith('.md')) {
        const post = await getPostBySlug(file.name.replace('.md', ''));
        if (post) {
          posts.push({
            slug: post.slug,
            title: post.title,
            tags: post.tags,
            imageUrl: post.imageUrl,
            description: post.description,
            author: post.author,
            createdAt: post.createdAt,
          });
        }
      }
    }

    return posts.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/${POSTS_PATH}/${slug}.md`,
      {
        headers: getGitHubHeaders(),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const post = parseMarkdown(content);

    return {
      ...post,
      slug,
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function createPost(data: {
  title: string;
  tags: string[];
  imageUrl: string;
  content: string;
  description: string;
  keywords: string;
  author: string;
}): Promise<{ success: boolean; slug?: string; error?: string }> {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const slug = slugify(data.title);

  const frontMatter = `---
title: ${data.title}
slug: ${slug}
tags: [${data.tags.join(', ')}]
imageUrl: ${data.imageUrl}
description: ${data.description}
keywords: ${data.keywords}
author: ${data.author}
createdAt: ${new Date().toISOString()}
---

${data.content}`;

  try {
    const existingFile = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/${POSTS_PATH}/${slug}.md`,
      {
        headers: getGitHubHeaders(),
      }
    );

    let sha: string | undefined;
    if (existingFile.ok) {
      const existingData = await existingFile.json();
      sha = existingData.sha;
    }

    const response = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/${POSTS_PATH}/${slug}.md`,
      {
        method: 'PUT',
        headers: getGitHubHeaders(),
        body: JSON.stringify({
          message: `Add blog post: ${data.title}`,
          content: Buffer.from(frontMatter).toString('base64'),
          ...(sha && { sha }),
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    return { success: true, slug };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Failed to create post' };
  }
}

export async function getAllSlugs(): Promise<string[]> {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/contents/${POSTS_PATH}`,
      {
        headers: getGitHubHeaders(),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return [];
    }

    const files = await response.json();
    return files
      .filter((file: any) => file.name.endsWith('.md'))
      .map((file: any) => file.name.replace('.md', ''));
  } catch (error) {
    console.error('Error fetching slugs:', error);
    return [];
  }
}
