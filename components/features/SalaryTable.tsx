import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { formatSalary, formatLevel, cn } from '@/lib/utils';
import type { SalaryRecord } from '@/types';

interface SalaryTableProps {
  salaries: SalaryRecord[];
  displayCurrency?: string;
  showCompany?: boolean;
  className?: string;
}

export function SalaryTable({
  salaries,
  displayCurrency,
  showCompany = true,
  className,
}: SalaryTableProps) {
  return (
    <div className={cn('bg-surface rounded-xl border border-border overflow-hidden shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background/60">
              {showCompany && (
                <th className="text-left px-4 py-3 font-semibold text-deep text-xs uppercase tracking-wider">
                  Company
                </th>
              )}
              <th className="text-left px-4 py-3 font-semibold text-deep text-xs uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-4 py-3 font-semibold text-deep text-xs uppercase tracking-wider">
                Level
              </th>
              <th className="text-left px-4 py-3 font-semibold text-deep text-xs uppercase tracking-wider">
                Location
              </th>
              <th className="text-right px-4 py-3 font-semibold text-deep text-xs uppercase tracking-wider">
                Exp
              </th>
              <th className="text-right px-4 py-3 font-semibold text-deep text-xs uppercase tracking-wider">
                Base
              </th>
              <th className="text-right px-4 py-3 font-semibold text-deep text-xs uppercase tracking-wider">
                Stock
              </th>
              <th className="text-right px-4 py-3 font-semibold text-deep text-xs uppercase tracking-wider">
                Total Comp
              </th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary, index) => {
              const currency = displayCurrency || salary.currency;
              const base = Number(salary.base_salary);
              const stock = Number(salary.stock);
              const tc = Number(salary.total_compensation);

              return (
                <tr
                  key={salary.id}
                  className={cn(
                    'border-b border-border/60 last:border-0 hover:bg-hover/60 transition-colors',
                    'animate-fade-in',
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {showCompany && (
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/companies/${salary.company.slug}`}
                        className="font-medium text-deep hover:text-coral transition-colors truncate max-w-[200px] block"
                        title={salary.company.name}
                      >
                        {salary.company.name}
                      </Link>
                    </td>
                  )}
                  <td className="px-4 py-3.5 text-body">{salary.role}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant="level" level={salary.level}>
                      {formatLevel(salary.level)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-body">{salary.location}</td>
                  <td className="px-4 py-3.5 text-right text-body">
                    {salary.experience_years}y
                  </td>
                  <td className="px-4 py-3.5 text-right text-body font-medium">
                    {formatSalary(base, currency)}
                  </td>
                  <td className="px-4 py-3.5 text-right text-body">
                    {stock > 0 ? formatSalary(stock, currency) : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-data-blue font-bold text-base">
                      {formatSalary(tc, currency)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
