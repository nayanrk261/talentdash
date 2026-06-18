import { cn } from '@/lib/utils';
import { LEVEL_COLORS } from '@/lib/config';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'level' | 'success' | 'warning' | 'error' | 'info';
  level?: string;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-background text-muted border border-border',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  info: 'bg-data-blue/10 text-data-blue',
};

export function Badge({ children, variant = 'default', level, className }: BadgeProps) {
  if (variant === 'level' && level) {
    const colors = LEVEL_COLORS[level] || LEVEL_COLORS.L3;
    return (
      <span
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide',
          colors.bg,
          colors.text,
          className
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variantStyles[variant] || variantStyles.default,
        className
      )}
    >
      {children}
    </span>
  );
}
