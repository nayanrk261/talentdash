'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Select, MultiSelect } from '@/components/ui/Select';
import { cn } from '@/lib/utils';

const LEVEL_OPTIONS = [
  { value: 'L3', label: 'L3' },
  { value: 'L4', label: 'L4' },
  { value: 'L5', label: 'L5' },
  { value: 'L6', label: 'L6' },
  { value: 'SDE_I', label: 'SDE I' },
  { value: 'SDE_II', label: 'SDE II' },
  { value: 'SDE_III', label: 'SDE III' },
  { value: 'STAFF', label: 'Staff' },
  { value: 'PRINCIPAL', label: 'Principal' },
  { value: 'IC4', label: 'IC4' },
  { value: 'IC5', label: 'IC5' },
];

const LOCATION_OPTIONS = [
  { value: '', label: 'All Locations' },
  { value: 'Bengaluru', label: 'Bengaluru' },
  { value: 'Mumbai', label: 'Mumbai' },
  { value: 'Hyderabad', label: 'Hyderabad' },
  { value: 'Pune', label: 'Pune' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'San Francisco', label: 'San Francisco' },
  { value: 'London', label: 'London' },
];

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'Software Engineer', label: 'Software Engineer' },
  { value: 'Backend Engineer', label: 'Backend Engineer' },
  { value: 'Frontend Engineer', label: 'Frontend Engineer' },
  { value: 'Full Stack Engineer', label: 'Full Stack Engineer' },
  { value: 'Data Engineer', label: 'Data Engineer' },
  { value: 'ML Engineer', label: 'ML Engineer' },
  { value: 'DevOps Engineer', label: 'DevOps Engineer' },
];

interface FilterBarProps {
  onFiltersChange: (params: URLSearchParams) => void;
  className?: string;
}

export function FilterBar({ onFiltersChange, className }: FilterBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [company, setCompany] = useState(searchParams.get('company') || '');
  const [role, setRole] = useState(searchParams.get('role') || '');
  const [levels, setLevels] = useState<string[]>(
    searchParams.get('level')?.split(',').filter(Boolean) || []
  );
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [currency, setCurrency] = useState(searchParams.get('currency') || 'INR');

  // Debounced company search
  const [debouncedCompany, setDebouncedCompany] = useState(company);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCompany(company);
    }, 300);
    return () => clearTimeout(timer);
  }, [company]);

  // Build and sync URL params
  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedCompany) params.set('company', debouncedCompany);
    if (role) params.set('role', role);
    if (levels.length > 0) params.set('level', levels.join(','));
    if (location) params.set('location', location);
    if (currency) params.set('currency', currency);
    return params;
  }, [debouncedCompany, role, levels, location, currency]);

  useEffect(() => {
    const params = buildParams();
    onFiltersChange(params);
    const queryString = params.toString();
    const url = queryString ? `/salaries?${queryString}` : '/salaries';
    router.replace(url, { scroll: false });
  }, [debouncedCompany, role, levels, location, currency, buildParams, onFiltersChange, router]);

  const clearAll = () => {
    setCompany('');
    setRole('');
    setLevels([]);
    setLocation('');
    setCurrency('INR');
  };

  const hasFilters = company || role || levels.length > 0 || location;

  return (
    <div className={cn('bg-surface rounded-xl border border-border p-4 sm:p-6 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-deep">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-coral hover:text-coral-dark cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          placeholder="Search company..."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />

        <Select
          options={ROLE_OPTIONS}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="All Roles"
        />

        <Select
          options={LOCATION_OPTIONS}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="All Locations"
        />

        {/* Currency toggle */}
        <div className="flex items-end">
          <div className="flex w-full rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setCurrency('INR')}
              className={cn(
                'flex-1 px-4 py-2 text-sm font-medium transition-all cursor-pointer',
                currency === 'INR'
                  ? 'bg-coral text-white'
                  : 'bg-surface text-muted hover:bg-hover'
              )}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={cn(
                'flex-1 px-4 py-2 text-sm font-medium transition-all cursor-pointer',
                currency === 'USD'
                  ? 'bg-coral text-white'
                  : 'bg-surface text-muted hover:bg-hover'
              )}
            >
              $ USD
            </button>
          </div>
        </div>
      </div>

      {/* Level multi-select pills */}
      <MultiSelect
        label="Levels"
        options={LEVEL_OPTIONS}
        selected={levels}
        onChange={setLevels}
      />
    </div>
  );
}
