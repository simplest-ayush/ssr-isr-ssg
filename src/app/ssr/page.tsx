import Link from "next/link";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const dynamic = "force-dynamic";

export default async function SSRPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10", {
    cache: "no-store",
  });
  const posts: Post[] = await res.json();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline text-sm">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold mt-4 text-black dark:text-white">
          SSR — Server-Side Rendering
        </h1>
        <p className="mt-2 text-zinc-500">
          This page is rendered on the server on <strong>every request</strong>.
          Fetched at: {new Date().toLocaleTimeString()}
        </p>
        <ul className="mt-6 space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4"
            >
              <h2 className="font-semibold text-black dark:text-white capitalize">
                {post.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">{post.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
