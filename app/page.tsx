import Link from 'next/link';
import { getAllPosts } from '@/lib/github';

// Revalidate every 24 hours for static generation
export const revalidate = 86400;

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div>
      <header>
        <h1>Blog</h1>
        <nav>
          <Link href="/auth">Login</Link>
        </nav>
      </header>

      <main>
        <h2>All Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <article>
                  <h3>
                    <Link href={`/${post.slug}`}>{post.title}</Link>
                  </h3>
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title} width="300" />
                  )}
                  <p>{post.description}</p>
                  <div>
                    <strong>Tags:</strong> {post.tags.join(', ')}
                  </div>
                  <div>
                    <strong>Author:</strong> {post.author}
                  </div>
                  <div>
                    <strong>Date:</strong> {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
