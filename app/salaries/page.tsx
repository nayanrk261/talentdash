import { Suspense } from 'react';
import SalaryPageContent from './SalaryPageContent';
import { TableSkeleton } from '@/components/ui/Skeleton';

export default function SalariesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Software Engineer Salaries in India",
    "description": "Real compensation data across top tech companies in India and worldwide, including base salary, bonus, stock, and total compensation by level and location.",
    "url": "https://talentdash-us7k.vercel.app/salaries",
    "creator": {
      "@type": "Organization",
      "name": "TalentDash"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-deep mb-2">
              Software Engineer Salaries
            </h1>
            <p className="text-body text-lg">
              Real compensation data across top tech companies in India &amp; worldwide
            </p>
          </div>
          <TableSkeleton rows={8} />
        </div>
      }>
        <SalaryPageContent />
      </Suspense>
    </>
  );
}
