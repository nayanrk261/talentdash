import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, total, limit, onPageChange, className }: PaginationProps) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  if (total === 0) return null;

  return (
    <div className={cn('flex items-center justify-between gap-4 pt-4', className)}>
      <p className="text-sm text-muted">
        Showing <span className="font-medium text-deep">{start}–{end}</span> of{' '}
        <span className="font-medium text-deep">{total}</span> records
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            'px-3 py-1.5 text-sm rounded-md transition-all duration-200 cursor-pointer',
            'border border-border',
            page <= 1
              ? 'opacity-40 cursor-not-allowed bg-surface text-muted'
              : 'bg-surface text-body hover:bg-hover hover:border-muted'
          )}
        >
          ← Prev
        </button>

        {generatePageNumbers(page, totalPages).map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                'min-w-[36px] px-2 py-1.5 text-sm rounded-md transition-all duration-200 cursor-pointer',
                p === page
                  ? 'bg-coral text-white font-medium shadow-sm'
                  : 'bg-surface text-body border border-border hover:bg-hover'
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            'px-3 py-1.5 text-sm rounded-md transition-all duration-200 cursor-pointer',
            'border border-border',
            page >= totalPages
              ? 'opacity-40 cursor-not-allowed bg-surface text-muted'
              : 'bg-surface text-body hover:bg-hover hover:border-muted'
          )}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function generatePageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('...');

  pages.push(total);

  return pages;
}
