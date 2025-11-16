import { Octokit } from '@octokit/rest';
import matter from 'gray-matter';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishDate: string;
  keywords: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'app/posts',
    });

    if (!Array.isArray(data)) {
      return [];
    }

    const posts = await Promise.all(
      data
        .filter((file: any) => file.name.endsWith('.md'))
        .map(async (file: any) => {
          const { data: fileContent } = await octokit.repos.getContent({
            owner,
            repo,
            path: file.path,
          });

          if ('content' in fileContent) {
            const content = Buffer.from(fileContent.content, 'base64').toString('utf-8');
            const { data: frontmatter, content: markdown } = matter(content);

            return {
              slug: file.name.replace('.md', ''),
              title: frontmatter.title || '',
              description: frontmatter.description || '',
              content: markdown,
              author: frontmatter.author || '',
              publishDate: String(frontmatter.publishDate || ''),
              keywords: frontmatter.keywords || '',
              ogImage: frontmatter.ogImage || '',
              canonicalUrl: frontmatter.canonicalUrl || '',
            } as BlogPost;
          }
          return null;
        })
    );

    return posts.filter((post): post is BlogPost => post !== null);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: `app/posts/${slug}.md`,
    });

    if ('content' in data) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      const { data: frontmatter, content: markdown } = matter(content);

      return {
        slug,
        title: frontmatter.title || '',
        description: frontmatter.description || '',
        content: markdown,
        author: frontmatter.author || '',
        publishDate: String(frontmatter.publishDate || ''),
        keywords: frontmatter.keywords || '',
        ogImage: frontmatter.ogImage || '',
        canonicalUrl: frontmatter.canonicalUrl || '',
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function createPost(post: BlogPost): Promise<boolean> {
  try {
    const frontmatter = `---
title: ${post.title}
description: ${post.description}
author: ${post.author}
publishDate: ${post.publishDate}
keywords: ${post.keywords}
ogImage: ${post.ogImage || ''}
canonicalUrl: ${post.canonicalUrl || ''}
---

${post.content}`;

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: `app/posts/${post.slug}.md`,
      message: `Create blog post: ${post.title}`,
      content: Buffer.from(frontmatter).toString('base64'),
    });

    return true;
  } catch (error) {
    console.error('Error creating post:', error);
    return false;
  }
}
