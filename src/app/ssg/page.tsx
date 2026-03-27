import Link from "next/link";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string };
}

export const dynamic = "force-static";

export default async function SSGPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    cache: "force-cache",
  });
  const users: User[] = await res.json();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline text-sm">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold mt-4 text-black dark:text-white">
          SSG — Static Site Generation
        </h1>
        <p className="mt-2 text-zinc-500">
          This page was generated at <strong>build time</strong>. The data never
          changes until the next build.
          Built at: {new Date().toLocaleTimeString()}
        </p>
        <ul className="mt-6 space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4"
            >
              <h2 className="font-semibold text-black dark:text-white">
                {user.name}
              </h2>
              <p className="text-sm text-zinc-500">
                @{user.username} · {user.email}
              </p>
              <p className="text-sm text-zinc-400 mt-1">
                {user.company.name} · {user.website}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
