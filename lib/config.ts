export const CURRENCY_RATES = {
  USD_TO_INR: 83,
  GBP_TO_INR: 105,
  EUR_TO_INR: 90,
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 25,
  MAX_LIMIT: 100,
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://talentdash.vercel.app';

export const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  L3: { bg: 'bg-slate-100', text: 'text-slate-700' },
  SDE_I: { bg: 'bg-slate-100', text: 'text-slate-700' },
  L4: { bg: 'bg-blue-100', text: 'text-blue-700' },
  SDE_II: { bg: 'bg-blue-100', text: 'text-blue-700' },
  L5: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  SDE_III: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  L6: { bg: 'bg-purple-100', text: 'text-purple-700' },
  STAFF: { bg: 'bg-purple-100', text: 'text-purple-700' },
  PRINCIPAL: { bg: 'bg-[#1e3a5f]/10', text: 'text-[#1e3a5f]' },
  IC4: { bg: 'bg-blue-100', text: 'text-blue-700' },
  IC5: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
};

export const LEVEL_BAR_COLORS: Record<string, string> = {
  L3: '#64748b',
  SDE_I: '#94a3b8',
  L4: '#3b82f6',
  SDE_II: '#60a5fa',
  L5: '#6366f1',
  SDE_III: '#818cf8',
  L6: '#a855f7',
  STAFF: '#c084fc',
  PRINCIPAL: '#1e3a5f',
  IC4: '#2563eb',
  IC5: '#4f46e5',
};
