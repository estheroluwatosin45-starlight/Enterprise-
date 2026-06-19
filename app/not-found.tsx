import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-4">Page Not Found</p>
        <Link href="/" className="text-primary-600 hover:text-primary-700 underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}
