import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Visit Atucha</h1>
        <p className="mt-4 text-lg text-neutral-300">
          Step inside <span className="font-semibold">Atucha II</span> — explore the reactor core and control room in 3D.
          Learn the physics, then plan your real visit.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/tour" className="rounded-md bg-cyan-600 px-5 py-2.5 text-sm font-semibold hover:bg-cyan-500">Start the 3D Tour</Link>
          <Link href="/plan-your-visit" className="rounded-md ring-1 ring-neutral-700 px-5 py-2.5 text-sm hover:bg-neutral-900">Plan Your Visit</Link>
        </div>
        <div className="mt-10 flex items-center justify-center gap-6 text-sm text-neutral-400">
          <Link href="/learn">Learn</Link>
          <Link href="/safety">Safety</Link>
          <Link href="/credits">Credits</Link>
        </div>
      </div>
    </main>
  );
}
