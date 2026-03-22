import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Argus</h1>
      <p className="mt-2">AI codebase explorer</p>
      <Link className="text-blue-600 underline mt-4 block" href="/repo/demo">
        Open demo repo
      </Link>
    </main>
  );
}
