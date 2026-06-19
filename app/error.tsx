'use client';
import Link from 'next/link';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-4xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-slate-500 mb-6">{error.message}</p>
      <div className="flex gap-4">
        <button onClick={() => reset()} className="px-4 py-2 bg-slate-900 text-white rounded-lg">Try again</button>
        <Link href="/" className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg">Return Home</Link>
      </div>
    </div>
  );
}
