import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <span className="rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 px-2 py-1 text-sm font-bold text-white">
        CC
      </span>
      <span className="text-sm font-semibold tracking-wide text-slate-100">
        CreativeClip 3D-AI Fashion Hub
      </span>
    </Link>
  );
}
