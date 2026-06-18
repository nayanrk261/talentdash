import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onClearFilters?: () => void;
  className?: string;
}

export function EmptyState({
  title = 'No records found',
  message = 'No records found for these filters. Try removing a filter.',
  onClearFilters,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in',
        className
      )}
    >
      {/* Empty state icon */}
      <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-deep mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-md">{message}</p>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-4 text-sm font-medium text-coral hover:text-coral-dark underline underline-offset-2 cursor-pointer"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
