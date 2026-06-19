'use client';

import { useState, useCallback } from 'react';
import { SalaryTable } from '@/components/features/SalaryTable';
import { FilterBar } from '@/components/features/FilterBar';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/Skeleton';
import type { SalaryRecord } from '@/types';

export default function SalaryPageContent() {
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [displayCurrency, setDisplayCurrency] = useState('INR');

  const fetchSalaries = useCallback(async (params: URLSearchParams) => {
    setLoading(true);
    params.set('page', String(page));
    params.set('limit', String(limit));

    const currency = params.get('currency') || 'INR';
    setDisplayCurrency(currency);

    try {
      const res = await fetch(`/api/salaries?${params.toString()}`);
      const data = await res.json();
      setSalaries(data.data || []);
      setTotal(data.meta?.total || 0);
      setTotalPages(data.meta?.totalPages || 0);
    } catch {
      setSalaries([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const handleFiltersChange = useCallback((params: URLSearchParams) => {
    setPage(1);
    fetchSalaries(params);
  }, [fetchSalaries]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Re-fetch with current URL params
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(newPage));
    params.set('limit', String(limit));
    fetch(`/api/salaries?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setSalaries(data.data || []);
        setTotal(data.meta?.total || 0);
        setTotalPages(data.meta?.totalPages || 0);
      });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-deep mb-2">
          Software Engineer Salaries
        </h1>
        <p className="text-body text-lg">
          Real compensation data across top tech companies in India &amp; worldwide
        </p>
      </div>

      <FilterBar
        onFiltersChange={handleFiltersChange}
        className="mb-6"
      />

      {loading ? (
        <TableSkeleton rows={8} />
      ) : salaries.length === 0 ? (
        <EmptyState
          onClearFilters={() => {
            window.location.href = '/salaries';
          }}
        />
      ) : (
        <>
          <SalaryTable
            salaries={salaries}
            displayCurrency={displayCurrency}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
