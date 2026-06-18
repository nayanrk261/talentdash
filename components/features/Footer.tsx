import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-coral flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 12h4l3-9 4 18 3-9h4"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-deep">
              Talent<span className="text-coral">Dash</span>
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="/salaries"
              className="text-sm text-muted hover:text-deep transition-colors"
            >
              Salaries
            </Link>
            <Link
              href="/compare"
              className="text-sm text-muted hover:text-deep transition-colors"
            >
              Compare
            </Link>
          </nav>

          <p className="text-xs text-muted">
            © {new Date().getFullYear()} TalentDash. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
