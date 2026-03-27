import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <h1 className="text-4xl font-bold text-center text-black dark:text-white">
          Next.js Rendering Strategies
        </h1>
        <p className="text-center text-zinc-600 dark:text-zinc-400">
          Demonstrating SSR, SSG, and ISR using JSONPlaceholder API
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/ssr"
            className="block rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <h2 className="text-xl font-semibold text-black dark:text-white">SSR</h2>
            <p className="mt-2 text-sm text-zinc-500">Server-Side Rendering — fresh data on every request</p>
          </Link>
          <Link
            href="/ssg"
            className="block rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <h2 className="text-xl font-semibold text-black dark:text-white">SSG</h2>
            <p className="mt-2 text-sm text-zinc-500">Static Site Generation — built once at build time</p>
          </Link>
          <Link
            href="/isr"
            className="block rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <h2 className="text-xl font-semibold text-black dark:text-white">ISR</h2>
            <p className="mt-2 text-sm text-zinc-500">Incremental Static Regeneration — revalidates every 60s</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
