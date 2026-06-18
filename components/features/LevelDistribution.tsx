import { LEVEL_BAR_COLORS } from '@/lib/config';
import { formatLevel, cn } from '@/lib/utils';

interface LevelDistributionProps {
  distribution: Record<string, number>;
  className?: string;
}

export function LevelDistribution({ distribution, className }: LevelDistributionProps) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  if (total === 0) return null;

  const entries = Object.entries(distribution)
    .filter(([, count]) => count > 0)
    .sort(([a], [b]) => {
      const order = ['L3', 'SDE_I', 'L4', 'SDE_II', 'L5', 'SDE_III', 'L6', 'STAFF', 'PRINCIPAL', 'IC4', 'IC5'];
      return order.indexOf(a) - order.indexOf(b);
    });

  return (
    <div className={cn('bg-surface rounded-xl border border-border p-6', className)}>
      <h3 className="text-base font-semibold text-deep mb-4">Level Distribution</h3>

      {/* Stacked bar */}
      <div className="h-8 rounded-full overflow-hidden flex bg-background mb-4">
        {entries.map(([level, count]) => {
          const pct = (count / total) * 100;
          return (
            <div
              key={level}
              className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
              style={{
                width: `${pct}%`,
                backgroundColor: LEVEL_BAR_COLORS[level] || '#94a3b8',
                minWidth: pct > 0 ? '4px' : '0',
              }}
              title={`${formatLevel(level)}: ${count} (${Math.round(pct)}%)`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {entries.map(([level, count]) => {
          const pct = Math.round((count / total) * 100);
          return (
            <div key={level} className="flex items-center gap-1.5 text-sm">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: LEVEL_BAR_COLORS[level] || '#94a3b8' }}
              />
              <span className="text-body font-medium">{formatLevel(level)}</span>
              <span className="text-muted">
                {count} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
