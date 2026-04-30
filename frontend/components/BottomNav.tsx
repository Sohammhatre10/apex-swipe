import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/60 p-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md justify-around text-sm text-slate-200">
        <Link href="/swipe" className="rounded-xl px-3 py-2 transition hover:bg-white/10">
          Swipe
        </Link>
        <Link href="/search" className="rounded-xl px-3 py-2 transition hover:bg-white/10">
          Search
        </Link>
        <Link href="/profile" className="rounded-xl px-3 py-2 transition hover:bg-white/10">
          Profile
        </Link>
      </div>
    </nav>
  );
}
