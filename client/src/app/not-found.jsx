import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-primary-500">
      <div className="text-center animate-fadeIn">
        <h1 className="text-9xl font-bold animate-bounce text-primary-600">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-neutral-500">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <div className="mt-6">
          <Link href="/">
            <button className="px-6 py-3 text-lg font-medium text-white transition-transform bg-primary-500 rounded-md hover:bg-primary-600 focus:ring-4 focus:ring-primary-300 focus:outline-none hover:scale-105">
              Return Home
            </button>
          </Link>
        </div>
      </div>
      
    </div>
  );
}
