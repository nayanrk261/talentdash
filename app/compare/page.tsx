import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { CompareWidget } from '@/components/features/CompareWidget';
import { formatLevel } from '@/lib/utils';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Compare Salaries',
  description:
    'Compare two salary records side by side. See the differences in base salary, bonus, stock, and total compensation across companies and levels.',
  openGraph: {
    title: 'Compare Salaries | TalentDash',
    description: 'Side-by-side salary comparison tool.',
    url: 'https://talentdash.vercel.app/compare',
  },
  alternates: {
    canonical: 'https://talentdash.vercel.app/compare',
  },
};

export default async function ComparePage() {
  // Fetch all salary records for dropdown options
  const salaries = await prisma.salary.findMany({
    include: {
      company: { select: { name: true } },
    },
    orderBy: { total_compensation: 'desc' },
  });

  const allSalaries = salaries.map((s) => ({
    id: s.id,
    label: `${s.company.name} · ${s.role} · ${formatLevel(s.level)} · ${s.location} · ${s.experience_years}y`,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-deep mb-2">
          Compare Compensation
        </h1>
        <p className="text-body text-lg">
          Select two salary records to compare side by side
        </p>
      </div>

      <Suspense fallback={<div className="text-muted text-sm">Loading comparison tool...</div>}>
        <CompareWidget allSalaries={allSalaries} />
      </Suspense>
    </div>
  );
}
