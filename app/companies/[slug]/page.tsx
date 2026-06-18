import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { computeMedian, formatSalary } from '@/lib/utils';
import { CompanyCard } from '@/components/features/CompanyCard';
import { LevelDistribution } from '@/components/features/LevelDistribution';
import { SalaryTable } from '@/components/features/SalaryTable';
import Link from 'next/link';
import type { SalaryRecord } from '@/types';

export const revalidate = 3600;

export async function generateStaticParams() {
  const companies = await prisma.company.findMany({
    select: { slug: true },
  });
  return companies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { salaries: true },
  });

  if (!company) {
    return { title: 'Company Not Found' };
  }

  const tcValues = company.salaries.map((s) => Number(s.total_compensation));
  const levels = [...new Set(company.salaries.map((s) => s.level))];
  const levelRange = levels.length > 0 ? `${levels[0]} to ${levels[levels.length - 1]}` : '';

  return {
    title: `Software Engineer Salaries at ${company.name} — ${levelRange}`,
    description: `Explore ${company.salaries.length} salary records at ${company.name}. Median total compensation: ${formatSalary(computeMedian(tcValues), company.salaries[0]?.currency || 'INR')}. Levels: ${levels.join(', ')}.`,
    openGraph: {
      title: `Salaries at ${company.name} | TalentDash`,
      description: `${company.salaries.length} salary records across ${levels.length} levels.`,
      url: `https://talentdash.vercel.app/companies/${slug}`,
    },
    alternates: {
      canonical: `https://talentdash.vercel.app/companies/${slug}`,
    },
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      salaries: {
        orderBy: { total_compensation: 'desc' },
      },
    },
  });

  if (!company) {
    notFound();
  }

  const tcValues = company.salaries.map((s) => Number(s.total_compensation));
  const medianTc = computeMedian(tcValues);
  const minTc = tcValues.length > 0 ? Math.min(...tcValues) : 0;
  const maxTc = tcValues.length > 0 ? Math.max(...tcValues) : 0;

  // Level distribution
  const levelDistribution: Record<string, number> = {};
  for (const salary of company.salaries) {
    levelDistribution[salary.level] = (levelDistribution[salary.level] || 0) + 1;
  }

  // Determine primary currency
  const currencyCounts: Record<string, number> = {};
  for (const salary of company.salaries) {
    currencyCounts[salary.currency] = (currencyCounts[salary.currency] || 0) + 1;
  }
  const primaryCurrency = Object.entries(currencyCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'INR';

  // Serialize salaries for SalaryTable
  const serializedSalaries: SalaryRecord[] = company.salaries.map((s) =>
    JSON.parse(
      JSON.stringify(
        {
          ...s,
          company: {
            id: company.id,
            name: company.name,
            slug: company.slug,
            industry: company.industry,
            headquarters: company.headquarters,
            founded_year: company.founded_year,
            headcount_range: company.headcount_range,
          },
        },
        (_key, value) => (typeof value === 'bigint' ? value.toString() : value)
      )
    )
  );

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: `https://talentdash.vercel.app/companies/${company.slug}`,
    ...(company.industry && { industry: company.industry }),
    ...(company.headquarters && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: company.headquarters,
      },
    }),
    ...(company.founded_year && { foundingDate: String(company.founded_year) }),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-6">
        <Link href="/salaries" className="hover:text-deep transition-colors">
          Salaries
        </Link>
        <span className="mx-2">›</span>
        <span className="text-deep font-medium">{company.name}</span>
      </nav>

      {/* Company Card */}
      <CompanyCard
        company={company}
        medianTc={medianTc}
        minTc={minTc}
        maxTc={maxTc}
        recordCount={company.salaries.length}
        currency={primaryCurrency}
        className="mb-6"
      />

      {/* Level Distribution */}
      <LevelDistribution distribution={levelDistribution} className="mb-6" />

      {/* Action */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-deep">
          All Salary Records ({company.salaries.length})
        </h2>
        <Link
          href={`/compare?c1=${company.slug}`}
          className="px-4 py-2 bg-coral text-white text-sm font-medium rounded-lg hover:bg-coral-dark transition-colors"
        >
          Compare
        </Link>
      </div>

      {/* Salary Table */}
      <SalaryTable
        salaries={serializedSalaries}
        showCompany={false}
      />
    </div>
  );
}
