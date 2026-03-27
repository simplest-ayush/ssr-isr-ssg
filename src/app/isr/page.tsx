import Link from "next/link";

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export const dynamic = "force-static";
export const revalidate = 30;

export default async function ISRPage() {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/comments?_limit=10",
    { next: { revalidate: 60 } }
  );
  const comments: Comment[] = await res.json();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline text-sm">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold mt-4 text-black dark:text-white">
          ISR — Incremental Static Regeneration
        </h1>
        <p className="mt-2 text-zinc-500">
          This page is statically generated but <strong>revalidates every 30 seconds</strong>.
          Last generated: {new Date().toLocaleTimeString()}
        </p>
        <ul className="mt-6 space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4"
            >
              <h2 className="font-semibold text-black dark:text-white capitalize">
                {comment.name}
              </h2>
              <p className="text-xs text-blue-500">{comment.email}</p>
              <p className="mt-1 text-sm text-zinc-500">{comment.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
