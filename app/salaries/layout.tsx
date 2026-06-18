import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Software Engineer Salaries in India & Worldwide',
  description:
    'Browse real salary data for software engineers at Google, Amazon, Meta, Microsoft, Flipkart, and more. Filter by level, location, and role. Compare total compensation packages.',
  openGraph: {
    title: 'Software Engineer Salaries | TalentDash',
    description: 'Real compensation data across top tech companies.',
    url: 'https://talentdash.vercel.app/salaries',
  },
};

export default function SalariesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
