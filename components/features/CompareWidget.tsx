'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/Badge';
import { formatSalary, formatDelta, formatLevel, cn } from '@/lib/utils';
import type { SalaryRecord, DeltaObject } from '@/types';

interface CompareWidgetProps {
  allSalaries: { id: string; label: string }[];
}

export function CompareWidget({ allSalaries }: CompareWidgetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [s1, setS1] = useState(searchParams.get('s1') || '');
  const [s2, setS2] = useState(searchParams.get('s2') || '');
  const [record1, setRecord1] = useState<SalaryRecord | null>(null);
  const [record2, setRecord2] = useState<SalaryRecord | null>(null);
  const [delta, setDelta] = useState<DeltaObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchComparison = useCallback(async (id1: string, id2: string) => {
    if (!id1 || !id2) return;
    if (id1 === id2) {
      setError('Please select two different records to compare.');
      setRecord1(null);
      setRecord2(null);
      setDelta(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/compare?s1=${id1}&s2=${id2}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to compare');
      }
      const data = await res.json();
      setRecord1(data.record1);
      setRecord2(data.record2);
      setDelta(data.delta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync URL and fetch on mount
  useEffect(() => {
    if (s1 && s2) {
      Promise.resolve().then(() => {
        fetchComparison(s1, s2);
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCompare = () => {
    if (!s1 || !s2) return;
    const params = new URLSearchParams({ s1, s2 });
    router.replace(`/compare?${params.toString()}`, { scroll: false });
    fetchComparison(s1, s2);
  };

  const currency = record1?.currency || 'INR';

  const tc1 = record1 ? Number(record1.total_compensation) : 0;
  const tc2 = record2 ? Number(record2.total_compensation) : 0;
  const winner = tc1 > tc2 ? 1 : tc2 > tc1 ? 2 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Selection row */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold text-deep mb-4">Select Records to Compare</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted block mb-1.5">Record 1</label>
            <select
              value={s1}
              onChange={(e) => setS1(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-deep focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral cursor-pointer"
            >
              <option value="">Select a salary record...</option>
              {allSalaries.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-muted block mb-1.5">Record 2</label>
            <select
              value={s2}
              onChange={(e) => setS2(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-deep focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral cursor-pointer"
            >
              <option value="">Select a salary record...</option>
              {allSalaries.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleCompare}
          disabled={!s1 || !s2 || loading}
          className={cn(
            'mt-4 px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer',
            'bg-coral text-white hover:bg-coral-dark shadow-sm hover:shadow-md',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {loading ? 'Comparing...' : 'Compare'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 text-sm text-error">
          {error}
        </div>
      )}

      {/* Comparison table */}
      {record1 && record2 && delta && (
        <div className="bg-surface rounded-xl border border-border overflow-hidden animate-slide-up">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/60">
                <th className="text-left px-6 py-3 font-semibold text-deep text-xs uppercase tracking-wider w-1/4">
                  Field
                </th>
                <th className="text-center px-6 py-3 font-semibold text-deep text-xs uppercase tracking-wider w-1/4">
                  Record 1
                  {winner === 1 && (
                    <Badge variant="info" className="ml-2">Higher TC</Badge>
                  )}
                </th>
                <th className="text-center px-6 py-3 font-semibold text-deep text-xs uppercase tracking-wider w-1/4">
                  Record 2
                  {winner === 2 && (
                    <Badge variant="info" className="ml-2">Higher TC</Badge>
                  )}
                </th>
                <th className="text-center px-6 py-3 font-semibold text-deep text-xs uppercase tracking-wider w-1/4">
                  Delta
                </th>
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Company" v1={record1.company.name} v2={record2.company.name} />
              <CompareRow label="Role" v1={record1.role} v2={record2.role} />
              <CompareRow
                label="Level"
                v1={<Badge variant="level" level={record1.level}>{formatLevel(record1.level)}</Badge>}
                v2={<Badge variant="level" level={record2.level}>{formatLevel(record2.level)}</Badge>}
              />
              <CompareRow label="Location" v1={record1.location} v2={record2.location} />
              <CompareRow
                label="Experience"
                v1={`${record1.experience_years}y`}
                v2={`${record2.experience_years}y`}
                delta={delta.experience_delta}
                suffix="y"
              />
              <CompareRow
                label="Base Salary"
                v1={formatSalary(Number(record1.base_salary), currency)}
                v2={formatSalary(Number(record2.base_salary), currency)}
                delta={delta.base_delta}
                currency={currency}
              />
              <CompareRow
                label="Bonus"
                v1={Number(record1.bonus) > 0 ? formatSalary(Number(record1.bonus), currency) : '—'}
                v2={Number(record2.bonus) > 0 ? formatSalary(Number(record2.bonus), currency) : '—'}
                delta={delta.bonus_delta}
                currency={currency}
              />
              <CompareRow
                label="Stock"
                v1={Number(record1.stock) > 0 ? formatSalary(Number(record1.stock), currency) : '—'}
                v2={Number(record2.stock) > 0 ? formatSalary(Number(record2.stock), currency) : '—'}
                delta={delta.stock_delta}
                currency={currency}
              />
              <tr className="border-t-2 border-border bg-data-blue/5">
                <td className="px-6 py-4 font-semibold text-deep">Total Comp</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-data-blue font-bold text-lg">
                    {formatSalary(tc1, currency)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-data-blue font-bold text-lg">
                    {formatSalary(tc2, currency)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={cn(
                      'font-bold text-base',
                      delta.tc_delta > 0 ? 'text-success' : delta.tc_delta < 0 ? 'text-error' : 'text-muted'
                    )}
                  >
                    {formatDelta(delta.tc_delta, currency)}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface CompareRowProps {
  label: string;
  v1: React.ReactNode;
  v2: React.ReactNode;
  delta?: number;
  currency?: string;
  suffix?: string;
}

function CompareRow({ label, v1, v2, delta, currency, suffix }: CompareRowProps) {
  return (
    <tr className="border-b border-border/60">
      <td className="px-6 py-3.5 font-medium text-deep">{label}</td>
      <td className="px-6 py-3.5 text-center text-body">{v1}</td>
      <td className="px-6 py-3.5 text-center text-body">{v2}</td>
      <td className="px-6 py-3.5 text-center">
        {delta !== undefined ? (
          <span
            className={cn(
              'font-semibold',
              delta > 0 ? 'text-success' : delta < 0 ? 'text-error' : 'text-muted'
            )}
          >
            {currency ? formatDelta(delta, currency) : `${delta > 0 ? '+' : ''}${delta}${suffix || ''}`}
          </span>
        ) : (
          <span className="text-muted">—</span>
        )}
      </td>
    </tr>
  );
}
