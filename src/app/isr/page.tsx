import Link from "next/link";

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface Album {
  userId: number;
  id: number;
  title: string;
}

export const dynamic = "force-static";
export const revalidate = 30;

export default async function ISRPage() {
  const [commentsRes, postsRes, todosRes, albumsRes] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/comments", {
      next: { revalidate: 30 },
    }),
    fetch("https://jsonplaceholder.typicode.com/posts", {
      next: { revalidate: 30 },
    }),
    fetch("https://jsonplaceholder.typicode.com/todos", {
      next: { revalidate: 30 },
    }),
    fetch("https://jsonplaceholder.typicode.com/albums", {
      next: { revalidate: 30 },
    }),
  ]);

  const [comments, posts, todos, albums]: [Comment[], Post[], Todo[], Album[]] =
    await Promise.all([
      commentsRes.json(),
      postsRes.json(),
      todosRes.json(),
      albumsRes.json(),
    ]);

  const completedTodos = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline text-sm">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold mt-4 text-black dark:text-white">
          ISR — Incremental Static Regeneration
        </h1>
        <p className="mt-2 text-zinc-500">
          Statically generated, <strong>revalidates every 30 seconds</strong>.
          Fetched 4 APIs ({comments.length} comments, {posts.length} posts,{" "}
          {todos.length} todos, {albums.length} albums).
          <br />
          Last generated: <strong>{new Date().toISOString()}</strong>
        </p>

        {/* Stats bar */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {[
            { label: "Comments", value: comments.length },
            { label: "Posts", value: posts.length },
            { label: "Todos Done", value: `${completedTodos}/${todos.length}` },
            { label: "Albums", value: albums.length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 text-center"
            >
              <p className="text-2xl font-bold text-black dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Posts with comment count */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
              Posts with Comments
            </h2>
            <ul className="space-y-3">
              {posts.map((post) => {
                const postComments = comments.filter(
                  (c) => c.postId === post.id
                );
                return (
                  <li
                    key={post.id}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4"
                  >
                    <h3 className="font-semibold text-black dark:text-white capitalize">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                      {post.body}
                    </p>
                    <p className="mt-2 text-xs text-blue-500">
                      {postComments.length} comments
                    </p>
                    {postComments.slice(0, 2).map((c) => (
                      <div
                        key={c.id}
                        className="mt-2 ml-3 pl-3 border-l-2 border-zinc-200 dark:border-zinc-700"
                      >
                        <p className="text-xs text-zinc-500 capitalize">
                          {c.name}
                        </p>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          {c.body}
                        </p>
                      </div>
                    ))}
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Albums + Todos */}
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
                Albums ({albums.length})
              </h2>
              <ul className="space-y-2">
                {albums.map((album) => (
                  <li
                    key={album.id}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3"
                  >
                    <span className="text-sm text-black dark:text-white capitalize">
                      {album.title}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
                Todos ({completedTodos}/{todos.length} done)
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
          </div>
        </div>
      </div>
    </div>
  );
}
