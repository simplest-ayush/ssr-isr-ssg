import Link from "next/link";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string; catchPhrase: string; bs: string };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
}

interface Album {
  userId: number;
  id: number;
  title: string;
}

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const dynamic = "force-static";

export default async function SSGPage() {
  const [usersRes, albumsRes, photosRes, postsRes] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users", { cache: "force-cache" }),
    fetch("https://jsonplaceholder.typicode.com/albums", { cache: "force-cache" }),
    fetch("https://jsonplaceholder.typicode.com/photos?_limit=50", { cache: "force-cache" }),
    fetch("https://jsonplaceholder.typicode.com/posts", { cache: "force-cache" }),
  ]);

  const [users, albums, photos, posts]: [User[], Album[], Photo[], Post[]] =
    await Promise.all([
      usersRes.json(),
      albumsRes.json(),
      photosRes.json(),
      postsRes.json(),
    ]);

  const postsByUser = new Map<number, Post[]>();
  for (const post of posts) {
    const list = postsByUser.get(post.userId) ?? [];
    list.push(post);
    postsByUser.set(post.userId, list);
  }

  const albumsByUser = new Map<number, Album[]>();
  for (const album of albums) {
    const list = albumsByUser.get(album.userId) ?? [];
    list.push(album);
    albumsByUser.set(album.userId, list);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline text-sm">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-bold mt-4 text-black dark:text-white">
          SSG — Static Site Generation
        </h1>
        <p className="mt-2 text-zinc-500">
          Generated at <strong>build time</strong>. Fetched 4 APIs (
          {users.length} users, {albums.length} albums, {photos.length} photos,{" "}
          {posts.length} posts).
          <br />
          Built at: <strong>{new Date().toISOString()}</strong>
        </p>

        {/* Photo grid */}
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
            Photo Gallery ({photos.length})
          </h2>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square rounded-md bg-zinc-200 dark:bg-zinc-800 overflow-hidden"
              >
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* User profiles */}
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
            User Profiles ({users.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4"
              >
                <h3 className="font-bold text-black dark:text-white">
                  {user.name}
                </h3>
                <p className="text-sm text-blue-500">@{user.username}</p>
                <div className="mt-2 text-xs text-zinc-500 space-y-1">
                  <p>{user.email} · {user.phone}</p>
                  <p>{user.address.street}, {user.address.suite}, {user.address.city} {user.address.zipcode}</p>
                  <p className="italic">{user.company.catchPhrase}</p>
                  <p>{user.website}</p>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-zinc-400">
                    {postsByUser.get(user.id)?.length ?? 0} posts · {albumsByUser.get(user.id)?.length ?? 0} albums
                  </p>
                  <ul className="mt-1 space-y-1">
                    {postsByUser.get(user.id)?.slice(0, 3).map((post) => (
                      <li key={post.id} className="text-xs text-zinc-500 truncate capitalize">
                        — {post.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
