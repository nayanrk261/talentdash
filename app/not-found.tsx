import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-coral/20 mb-4">404</div>
        <h1 className="text-2xl font-bold text-deep mb-3">Page Not Found</h1>
        <p className="text-body mb-6">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-coral text-white font-medium rounded-lg hover:bg-coral-dark transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/salaries"
            className="px-5 py-2.5 bg-surface text-deep font-medium rounded-lg border border-border hover:bg-hover transition-colors"
          >
            Browse Salaries
          </Link>
        </div>
      </div>
    </div>
  );
}
