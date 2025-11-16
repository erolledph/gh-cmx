import Link from 'next/link';

// Static home page for Cloudflare Pages
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Blog</h1>
          <nav>
            <Link href="/auth" className="text-blue-600 hover:underline">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Welcome to the Blog</h2>
          <p className="text-gray-700 mb-6">
            This is your blog powered by Next.js, Firebase, and Cloudflare Pages.
          </p>
          <p className="text-gray-700 mb-6">
            Check out the blog posts below or navigate through the menu.
          </p>
          <Link
            href="/blog"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            View All Posts
          </Link>
        </div>
      </main>
    </div>
  );
}
