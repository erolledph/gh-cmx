import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllSlugs } from '@/lib/github';
import { markdownToHtml } from '@/lib/markdown';
import CommentsSection from '@/app/components/comments/CommentsSection';
import NewsletterSubscribe from '@/app/components/NewsletterSubscribe';
import type { Metadata } from 'next';

export const runtime = 'nodejs';
export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.imageUrl ? [post.imageUrl] : [],
      type: 'article',
      publishedTime: post.createdAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.imageUrl ? [post.imageUrl] : [],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const htmlContent = markdownToHtml(post.content);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white p-8 rounded shadow mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="text-gray-600 mb-6 space-y-1">
            <p>
              <strong>Author:</strong> {post.author}
            </p>
            <p>
              <strong>Published:</strong> {new Date(post.createdAt).toLocaleDateString()}
            </p>
            {post.tags.length > 0 && (
              <p>
                <strong>Tags:</strong>{' '}
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="inline-block mr-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  </span>
                ))}
              </p>
            )}
          </div>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto rounded mb-6"
            />
          )}

          <hr className="my-6" />

          <div
            className="prose prose-sm md:prose max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>

        {/* Newsletter Subscription */}
        <NewsletterSubscribe />

        {/* Comments Section */}
        <CommentsSection slug={params.slug} />
      </main>
    </div>
  );
}
