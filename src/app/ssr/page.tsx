import Link from "next/link";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export const dynamic = "force-dynamic";

export default async function SSRPage() {
  const [postsRes, commentsRes, todosRes, usersRes] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/posts", { cache: "no-store" }),
    fetch("https://jsonplaceholder.typicode.com/comments?_limit=50", { cache: "no-store" }),
    fetch("https://jsonplaceholder.typicode.com/todos", { cache: "no-store" }),
    fetch("https://jsonplaceholder.typicode.com/users", { cache: "no-store" }),
  ]);

  const [posts, comments, todos, users]: [Post[], Comment[], Todo[], User[]] =
    await Promise.all([
      postsRes.json(),
      commentsRes.json(),
      todosRes.json(),
      usersRes.json(),
    ]);

  const userMap = new Map(users.map((u) => [u.id, u]));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline text-sm">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold mt-4 text-black dark:text-white">
          SSR — Server-Side Rendering
        </h1>
        <p className="mt-2 text-zinc-500">
          Rendered on the server on <strong>every request</strong>. Fetching 4
          APIs in parallel ({posts.length} posts, {comments.length} comments,{" "}
          {todos.length} todos, {users.length} users).
          <br />
          Fetched at: <strong>{new Date().toISOString()}</strong>
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Posts with author */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
              Posts ({posts.length})
            </h2>
            <ul className="space-y-3">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4"
                >
                  <h3 className="font-semibold text-black dark:text-white capitalize">
                    {post.title}
                  </h3>
                  <p className="text-xs text-blue-500 mt-1">
                    by {userMap.get(post.userId)?.name ?? "Unknown"}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                    {post.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Sidebar: Todos + Comments */}
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
                Todos ({todos.length})
              </h2>
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-start gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3"
                  >
                    <span
                      className={`mt-0.5 text-xs ${todo.completed ? "text-green-500" : "text-zinc-400"}`}
                    >
                      {todo.completed ? "✓" : "○"}
                    </span>
                    <span
                      className={`text-sm ${todo.completed ? "line-through text-zinc-400" : "text-black dark:text-white"}`}
                    >
                      {todo.title}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
                Comments ({comments.length})
              </h2>
              <ul className="space-y-3">
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3"
                  >
                    <p className="font-medium text-sm text-black dark:text-white capitalize">
                      {comment.name}
                    </p>
                    <p className="text-xs text-blue-500">{comment.email}</p>
                    <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
                      {comment.body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
