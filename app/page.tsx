import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatSalary, computeMedian } from '@/lib/utils';

export const revalidate = 300;

export default async function HomePage() {
  // Fetch stats from DB
  const [salaryCount, companyCount, locationData] = await Promise.all([
    prisma.salary.count(),
    prisma.company.count(),
    prisma.salary.findMany({
      select: { location: true },
      distinct: ['location'],
    }),
  ]);

  // Get top salaries for hero highlight
  const topSalaries = await prisma.salary.findMany({
    include: { company: true },
    orderBy: { total_compensation: 'desc' },
    take: 5,
  });

  const topTcValues = topSalaries.map((s) => Number(s.total_compensation));
  const medianTopTc = computeMedian(topTcValues);
  const topCurrency = topSalaries[0]?.currency || 'INR';

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-coral/5 via-transparent to-data-blue/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-coral/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-data-blue/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-coral/10 rounded-full text-coral text-sm font-medium mb-6">
              <span className="w-1.5 h-1.5 bg-coral rounded-full animate-pulse" />
              Live compensation data
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-deep leading-tight mb-6">
              Know your worth.
              <br />
              <span className="text-coral">Negotiate smarter.</span>
            </h1>

            <p className="text-lg sm:text-xl text-body max-w-2xl mb-8 leading-relaxed">
              Real salary data from top tech companies. Compare compensation packages
              across levels, locations, and roles — all in one place.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/salaries"
                className="inline-flex items-center gap-2 px-6 py-3 bg-coral text-white font-semibold rounded-lg hover:bg-coral-dark shadow-sm hover:shadow-lg transition-all animate-pulse-glow"
              >
                Explore Salaries
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface text-deep font-semibold rounded-lg border border-border hover:bg-hover hover:border-muted transition-all"
              >
                Compare Offers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Salary Records"
            value={salaryCount.toLocaleString()}
            description="Verified data points"
            color="coral"
          />
          <StatCard
            label="Companies"
            value={companyCount.toString()}
            description="Top tech companies"
            color="data-blue"
          />
          <StatCard
            label="Locations"
            value={locationData.length.toString()}
            description="Cities covered"
            color="success"
          />
        </div>
      </section>

      {/* Top Compensation Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-deep mb-3">
            Top Compensation Packages
          </h2>
          <p className="text-body text-lg">
            Highest total compensation across our dataset
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topSalaries.slice(0, 3).map((salary, index) => (
            <div
              key={salary.id}
              className="bg-surface rounded-xl border border-border p-6 hover:shadow-lg hover:border-border transition-all animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Link
                    href={`/companies/${salary.company.slug}`}
                    className="text-lg font-bold text-deep group-hover:text-coral transition-colors"
                  >
                    {salary.company.name}
                  </Link>
                  <p className="text-sm text-muted">{salary.role}</p>
                </div>
                <span className="text-xs font-semibold text-muted bg-background px-2 py-1 rounded-md">
                  #{index + 1}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-3xl font-bold text-data-blue">
                  {formatSalary(Number(salary.total_compensation), salary.currency)}
                </p>
                <p className="text-xs text-muted mt-1">Total Compensation</p>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted">
                <span>{salary.level.replace(/_/g, ' ')}</span>
                <span>·</span>
                <span>{salary.location}</span>
                <span>·</span>
                <span>{salary.experience_years}y exp</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/salaries"
            className="text-sm font-medium text-coral hover:text-coral-dark underline underline-offset-4"
          >
            View all {salaryCount} salary records →
          </Link>
        </div>
      </section>

      {/* Median highlight */}
      {medianTopTc > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="bg-gradient-to-r from-data-blue/5 to-coral/5 rounded-2xl border border-border p-8 sm:p-12 text-center">
            <p className="text-sm font-medium text-muted uppercase tracking-wider mb-2">
              Median Top-5 Total Compensation
            </p>
            <p className="text-4xl sm:text-5xl font-bold text-data-blue mb-2">
              {formatSalary(medianTopTc, topCurrency)}
            </p>
            <p className="text-body">
              across top tech companies in our dataset
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  color,
}: {
  label: string;
  value: string;
  description: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    coral: 'text-coral',
    'data-blue': 'text-data-blue',
    success: 'text-success',
  };

  return (
    <div className="glass rounded-xl border border-border p-6 text-center hover:shadow-md transition-shadow">
      <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-3xl font-bold ${colorMap[color] || 'text-deep'} mb-0.5`}>
        {value}
      </p>
      <p className="text-sm text-muted">{description}</p>
    </div>
  );
}
