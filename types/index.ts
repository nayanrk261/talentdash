export interface SalaryRecord {
  id: string;
  company_id: string;
  company: {
    id: string;
    name: string;
    slug: string;
    industry?: string | null;
    headquarters?: string | null;
    founded_year?: number | null;
    headcount_range?: string | null;
  };
  role: string;
  level: string;
  location: string;
  currency: string;
  experience_years: number;
  base_salary: string; // BigInt serialized as string
  bonus: string;
  stock: string;
  total_compensation: string;
  source: string;
  confidence_score: string;
  is_verified: boolean;
  submitted_at: string;
}

export interface CompanyWithSalaries {
  id: string;
  name: string;
  slug: string;
  normalized_name: string;
  industry: string | null;
  headquarters: string | null;
  founded_year: number | null;
  headcount_range: string | null;
  created_at: string;
  updated_at: string;
  salaries: SalaryRecord[];
  median_total_compensation: number;
  level_distribution: Record<string, number>;
  min_tc: number;
  max_tc: number;
  record_count: number;
}

export interface DeltaObject {
  base_delta: number;
  bonus_delta: number;
  stock_delta: number;
  tc_delta: number;
  experience_delta: number;
}

export interface CompareResult {
  record1: SalaryRecord;
  record2: SalaryRecord;
  delta: DeltaObject;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: true;
  field?: string;
  message: string;
}

export interface SalaryFilters {
  company?: string;
  role?: string;
  level?: string | string[];
  location?: string;
  currency?: string;
  sort?: 'total_comp_desc' | 'total_comp_asc' | 'date_desc';
  page?: number;
  limit?: number;
}
