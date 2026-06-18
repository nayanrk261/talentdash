import { Badge } from '@/components/ui/Badge';
import { formatSalary, cn } from '@/lib/utils';

interface CompanyCardProps {
  company: {
    name: string;
    slug: string;
    industry?: string | null;
    headquarters?: string | null;
    founded_year?: number | null;
    headcount_range?: string | null;
  };
  medianTc: number;
  minTc: number;
  maxTc: number;
  recordCount: number;
  currency?: string;
  className?: string;
}

export function CompanyCard({
  company,
  medianTc,
  minTc,
  maxTc,
  recordCount,
  currency = 'INR',
  className,
}: CompanyCardProps) {
  return (
    <div className={cn('bg-surface rounded-xl border border-border p-6 sm:p-8', className)}>
      {/* Company name & tags */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-deep mb-3">
          {company.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {company.industry && (
            <Badge variant="default">{company.industry}</Badge>
          )}
          {company.founded_year && (
            <Badge variant="default">Est. {company.founded_year}</Badge>
          )}
          {company.headcount_range && (
            <Badge variant="default">{company.headcount_range} employees</Badge>
          )}
          {company.headquarters && (
            <Badge variant="default">📍 {company.headquarters}</Badge>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Median TC */}
        <div className="bg-data-blue/5 rounded-xl p-5 border border-data-blue/10">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">
            Median Total Comp
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-data-blue">
            {formatSalary(medianTc, currency)}
          </p>
        </div>

        {/* Range */}
        <div className="bg-background rounded-xl p-5 border border-border">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">
            TC Range
          </p>
          <p className="text-sm font-semibold text-deep">
            {formatSalary(minTc, currency)}
            <span className="text-muted mx-1">—</span>
            {formatSalary(maxTc, currency)}
          </p>
        </div>

        {/* Record count */}
        <div className="bg-background rounded-xl p-5 border border-border">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">
            Data Points
          </p>
          <p className="text-2xl font-bold text-deep">{recordCount}</p>
          <p className="text-xs text-muted">salary records</p>
        </div>
      </div>
    </div>
  );
}
