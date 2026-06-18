import { CURRENCY_RATES } from './config';

/**
 * Format a number in Indian numbering system: ₹42,00,000
 * Uses the en-IN locale which formats as: 42,00,000
 */
export function formatIndianNumber(n: number | bigint): string {
  const num = typeof n === 'bigint' ? Number(n) : n;
  return '₹' + num.toLocaleString('en-IN');
}

/**
 * Format a number in USD: $42,000
 */
export function formatUSD(n: number | bigint): string {
  const num = typeof n === 'bigint' ? Number(n) : n;
  return '$' + num.toLocaleString('en-US');
}

/**
 * Format a salary figure based on currency
 */
export function formatSalary(n: number | bigint, currency: string): string {
  if (currency === 'INR') return formatIndianNumber(n);
  if (currency === 'USD') return formatUSD(n);
  if (currency === 'GBP') return '£' + Number(n).toLocaleString('en-GB');
  if (currency === 'EUR') return '€' + Number(n).toLocaleString('de-DE');
  return String(n);
}

/**
 * Format a salary with currency conversion for display
 */
export function formatSalaryWithConversion(
  n: number | bigint,
  originalCurrency: string,
  displayCurrency: string
): string {
  let amount = typeof n === 'bigint' ? Number(n) : n;

  if (originalCurrency !== displayCurrency) {
    // Convert to INR first (base), then to target
    if (originalCurrency === 'USD' && displayCurrency === 'INR') {
      amount = amount * CURRENCY_RATES.USD_TO_INR;
    } else if (originalCurrency === 'INR' && displayCurrency === 'USD') {
      amount = Math.round(amount / CURRENCY_RATES.USD_TO_INR);
    } else if (originalCurrency === 'GBP' && displayCurrency === 'INR') {
      amount = amount * CURRENCY_RATES.GBP_TO_INR;
    } else if (originalCurrency === 'EUR' && displayCurrency === 'INR') {
      amount = amount * CURRENCY_RATES.EUR_TO_INR;
    }
  }

  return formatSalary(amount, displayCurrency);
}

/**
 * Normalize a company name: lowercase, trim, strip punctuation
 */
export function normalizeCompanyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Generate a URL-friendly slug from a company name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Compute the true statistical median of an array of numbers
 */
export function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return sorted[mid];
}

/**
 * Merge class names, filtering out falsy values
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a delta value with +/- sign and currency
 */
export function formatDelta(n: number, currency: string): string {
  const prefix = n > 0 ? '+' : '';
  return prefix + formatSalary(Math.abs(n), currency);
}

/**
 * Get display-friendly level name
 */
export function formatLevel(level: string): string {
  return level.replace(/_/g, ' ');
}
