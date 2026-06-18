import 'dotenv/config';

// Inline enum values to avoid ESM import issues with the Prisma 7 generated client
const Level = {
  L3: 'L3', L4: 'L4', L5: 'L5', L6: 'L6',
  SDE_I: 'SDE_I', SDE_II: 'SDE_II', SDE_III: 'SDE_III',
  STAFF: 'STAFF', PRINCIPAL: 'PRINCIPAL', IC4: 'IC4', IC5: 'IC5',
} as const;
type LevelType = (typeof Level)[keyof typeof Level];

const Currency = { INR: 'INR', USD: 'USD', GBP: 'GBP', EUR: 'EUR' } as const;
type CurrencyType = (typeof Currency)[keyof typeof Currency];

const Source = { CONTRIBUTOR: 'CONTRIBUTOR', SCRAPED: 'SCRAPED', AI_INFERRED: 'AI_INFERRED' } as const;
type SourceType = (typeof Source)[keyof typeof Source];

function normalizeCompanyName(name: string): string {
  return name.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
}

function generateSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

interface CompanyData {
  name: string;
  industry?: string;
  headquarters?: string;
  founded_year?: number;
  headcount_range?: string;
  variants?: string[];
}

interface SalaryData {
  company_name: string;
  role: string;
  level: LevelType;
  location: string;
  currency: CurrencyType;
  experience_years: number;
  base_salary: bigint;
  bonus: bigint;
  stock: bigint;
  source: SourceType;
  confidence_score: number;
}

const companies: CompanyData[] = [
  { name: 'Google', industry: 'Technology', headquarters: 'Mountain View, CA', founded_year: 1998, headcount_range: '100,000+', variants: ['Google India', 'GOOGLE', 'google'] },
  { name: 'Amazon', industry: 'E-Commerce / Cloud', headquarters: 'Seattle, WA', founded_year: 1994, headcount_range: '1,000,000+' },
  { name: 'Meta', industry: 'Social Media / Technology', headquarters: 'Menlo Park, CA', founded_year: 2004, headcount_range: '50,000+' },
  { name: 'Microsoft', industry: 'Technology', headquarters: 'Redmond, WA', founded_year: 1975, headcount_range: '200,000+' },
  { name: 'Flipkart', industry: 'E-Commerce', headquarters: 'Bengaluru, India', founded_year: 2007, headcount_range: '30,000+' },
  { name: 'Meesho', industry: 'E-Commerce', headquarters: 'Bengaluru, India', founded_year: 2015, headcount_range: '2,000+' },
  { name: 'NVIDIA', industry: 'Semiconductors / AI', headquarters: 'Santa Clara, CA', founded_year: 1993, headcount_range: '30,000+' },
  { name: 'TCS', industry: 'IT Services', headquarters: 'Mumbai, India', founded_year: 1968, headcount_range: '600,000+' },
  { name: 'Infosys', industry: 'IT Services', headquarters: 'Bengaluru, India', founded_year: 1981, headcount_range: '300,000+' },
  { name: 'Wipro', industry: 'IT Services', headquarters: 'Bengaluru, India', founded_year: 1945, headcount_range: '250,000+' },
  { name: 'Razorpay', industry: 'FinTech', headquarters: 'Bengaluru, India', founded_year: 2014, headcount_range: '3,000+' },
  { name: 'Zepto', industry: 'Quick Commerce', headquarters: 'Mumbai, India', founded_year: 2021, headcount_range: '1,500+' },
];

const salaryRecords: SalaryData[] = [
  // GOOGLE (8 records) — note company name variants
  { company_name: 'Google India', role: 'Software Engineer', level: Level.L3, location: 'Bengaluru', currency: Currency.INR, experience_years: 2, base_salary: 2200000n, bonus: 200000n, stock: 800000n, source: Source.CONTRIBUTOR, confidence_score: 0.92 },
  { company_name: 'GOOGLE', role: 'Software Engineer', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experience_years: 5, base_salary: 3500000n, bonus: 400000n, stock: 1500000n, source: Source.CONTRIBUTOR, confidence_score: 0.95 },
  { company_name: 'google', role: 'Software Engineer', level: Level.L5, location: 'Hyderabad', currency: Currency.INR, experience_years: 8, base_salary: 5000000n, bonus: 800000n, stock: 3000000n, source: Source.SCRAPED, confidence_score: 0.88 },
  { company_name: 'Google', role: 'Software Engineer', level: Level.L6, location: 'Bengaluru', currency: Currency.INR, experience_years: 12, base_salary: 7500000n, bonus: 1500000n, stock: 6000000n, source: Source.CONTRIBUTOR, confidence_score: 0.9 },
  { company_name: 'Google', role: 'Software Engineer', level: Level.L4, location: 'San Francisco', currency: Currency.USD, experience_years: 4, base_salary: 180000n, bonus: 30000n, stock: 80000n, source: Source.CONTRIBUTOR, confidence_score: 0.94 },
  { company_name: 'Google', role: 'Backend Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: 3200000n, bonus: 350000n, stock: 1200000n, source: Source.SCRAPED, confidence_score: 0.85 },
  { company_name: 'Google', role: 'ML Engineer', level: Level.L5, location: 'San Francisco', currency: Currency.USD, experience_years: 7, base_salary: 220000n, bonus: 50000n, stock: 150000n, source: Source.CONTRIBUTOR, confidence_score: 0.91 },
  { company_name: 'Google', role: 'Frontend Engineer', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experience_years: 7, base_salary: 4500000n, bonus: 600000n, stock: 2500000n, source: Source.AI_INFERRED, confidence_score: 0.78 },

  // AMAZON (7 records)
  { company_name: 'Amazon', role: 'Software Engineer', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experience_years: 3, base_salary: 2800000n, bonus: 200000n, stock: 600000n, source: Source.CONTRIBUTOR, confidence_score: 0.93 },
  { company_name: 'Amazon', role: 'Software Engineer', level: Level.L5, location: 'Hyderabad', currency: Currency.INR, experience_years: 6, base_salary: 4200000n, bonus: 500000n, stock: 2000000n, source: Source.SCRAPED, confidence_score: 0.87 },
  { company_name: 'Amazon', role: 'Software Engineer', level: Level.L6, location: 'Bengaluru', currency: Currency.INR, experience_years: 10, base_salary: 6500000n, bonus: 1000000n, stock: 4500000n, source: Source.CONTRIBUTOR, confidence_score: 0.9 },
  { company_name: 'Amazon', role: 'Backend Engineer', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 1, base_salary: 1800000n, bonus: 100000n, stock: 400000n, source: Source.CONTRIBUTOR, confidence_score: 0.89 },
  { company_name: 'Amazon', role: 'Software Engineer', level: Level.SDE_II, location: 'Pune', currency: Currency.INR, experience_years: 4, base_salary: 3000000n, bonus: 300000n, stock: 1000000n, source: Source.SCRAPED, confidence_score: 0.84 },
  { company_name: 'Amazon', role: 'Data Engineer', level: Level.SDE_III, location: 'San Francisco', currency: Currency.USD, experience_years: 8, base_salary: 190000n, bonus: 40000n, stock: 120000n, source: Source.CONTRIBUTOR, confidence_score: 0.92 },
  { company_name: 'Amazon', role: 'DevOps Engineer', level: Level.L5, location: 'London', currency: Currency.GBP, experience_years: 7, base_salary: 95000n, bonus: 15000n, stock: 50000n, source: Source.AI_INFERRED, confidence_score: 0.75 },

  // META (5 records)
  { company_name: 'Meta', role: 'Software Engineer', level: Level.L4, location: 'San Francisco', currency: Currency.USD, experience_years: 3, base_salary: 170000n, bonus: 25000n, stock: 100000n, source: Source.CONTRIBUTOR, confidence_score: 0.95 },
  { company_name: 'Meta', role: 'Software Engineer', level: Level.L5, location: 'San Francisco', currency: Currency.USD, experience_years: 6, base_salary: 220000n, bonus: 40000n, stock: 200000n, source: Source.SCRAPED, confidence_score: 0.9 },
  { company_name: 'Meta', role: 'Software Engineer', level: Level.L6, location: 'San Francisco', currency: Currency.USD, experience_years: 10, base_salary: 280000n, bonus: 60000n, stock: 350000n, source: Source.CONTRIBUTOR, confidence_score: 0.93 },
  { company_name: 'Meta', role: 'ML Engineer', level: Level.L5, location: 'London', currency: Currency.GBP, experience_years: 7, base_salary: 110000n, bonus: 20000n, stock: 80000n, source: Source.CONTRIBUTOR, confidence_score: 0.88 },
  { company_name: 'Meta', role: 'Software Engineer', level: Level.L6, location: 'San Francisco', currency: Currency.USD, experience_years: 12, base_salary: 300000n, bonus: 80000n, stock: 500000n, source: Source.CONTRIBUTOR, confidence_score: 0.85 },

  // MICROSOFT (5 records)
  { company_name: 'Microsoft', role: 'Software Engineer', level: Level.L3, location: 'Bengaluru', currency: Currency.INR, experience_years: 2, base_salary: 2000000n, bonus: 200000n, stock: 500000n, source: Source.CONTRIBUTOR, confidence_score: 0.91 },
  { company_name: 'Microsoft', role: 'Software Engineer', level: Level.L4, location: 'Hyderabad', currency: Currency.INR, experience_years: 5, base_salary: 3200000n, bonus: 400000n, stock: 1200000n, source: Source.SCRAPED, confidence_score: 0.86 },
  { company_name: 'Microsoft', role: 'Backend Engineer', level: Level.L5, location: 'Bengaluru', currency: Currency.INR, experience_years: 8, base_salary: 4800000n, bonus: 600000n, stock: 2500000n, source: Source.CONTRIBUTOR, confidence_score: 0.89 },
  { company_name: 'Microsoft', role: 'Software Engineer', level: Level.SDE_I, location: 'Pune', currency: Currency.INR, experience_years: 1, base_salary: 1600000n, bonus: 150000n, stock: 300000n, source: Source.AI_INFERRED, confidence_score: 0.8 },
  { company_name: 'Microsoft', role: 'Full Stack Engineer', level: Level.SDE_II, location: 'San Francisco', currency: Currency.USD, experience_years: 4, base_salary: 155000n, bonus: 20000n, stock: 60000n, source: Source.CONTRIBUTOR, confidence_score: 0.92 },

  // FLIPKART (4 records)
  { company_name: 'Flipkart', role: 'Software Engineer', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 1, base_salary: 1800000n, bonus: 100000n, stock: 300000n, source: Source.CONTRIBUTOR, confidence_score: 0.88 },
  { company_name: 'Flipkart', role: 'Software Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 3, base_salary: 2800000n, bonus: 300000n, stock: 800000n, source: Source.SCRAPED, confidence_score: 0.85 },
  { company_name: 'Flipkart', role: 'Backend Engineer', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experience_years: 6, base_salary: 4000000n, bonus: 500000n, stock: 1800000n, source: Source.CONTRIBUTOR, confidence_score: 0.9 },
  { company_name: 'Flipkart', role: 'Software Engineer', level: Level.STAFF, location: 'Bengaluru', currency: Currency.INR, experience_years: 10, base_salary: 6000000n, bonus: 800000n, stock: 3000000n, source: Source.CONTRIBUTOR, confidence_score: 0.87 },

  // MEESHO (3 records)
  { company_name: 'Meesho', role: 'Software Engineer', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 1, base_salary: 1500000n, bonus: 100000n, stock: 200000n, source: Source.CONTRIBUTOR, confidence_score: 0.82 },
  { company_name: 'Meesho', role: 'Backend Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 3, base_salary: 2500000n, bonus: 200000n, stock: 600000n, source: Source.SCRAPED, confidence_score: 0.8 },
  { company_name: 'Meesho', role: 'Software Engineer', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experience_years: 5, base_salary: 3500000n, bonus: 400000n, stock: 1200000n, source: Source.AI_INFERRED, confidence_score: 0.76 },

  // NVIDIA (4 records)
  { company_name: 'NVIDIA', role: 'Software Engineer', level: Level.L4, location: 'San Francisco', currency: Currency.USD, experience_years: 3, base_salary: 160000n, bonus: 25000n, stock: 70000n, source: Source.CONTRIBUTOR, confidence_score: 0.93 },
  { company_name: 'NVIDIA', role: 'ML Engineer', level: Level.L5, location: 'San Francisco', currency: Currency.USD, experience_years: 6, base_salary: 210000n, bonus: 40000n, stock: 150000n, source: Source.SCRAPED, confidence_score: 0.89 },
  { company_name: 'NVIDIA', role: 'Software Engineer', level: Level.L6, location: 'San Francisco', currency: Currency.USD, experience_years: 10, base_salary: 270000n, bonus: 60000n, stock: 250000n, source: Source.CONTRIBUTOR, confidence_score: 0.91 },
  { company_name: 'NVIDIA', role: 'Software Engineer', level: Level.IC4, location: 'Bengaluru', currency: Currency.INR, experience_years: 5, base_salary: 4000000n, bonus: 500000n, stock: 2000000n, source: Source.CONTRIBUTOR, confidence_score: 0.86 },

  // TCS (3 records)
  { company_name: 'TCS', role: 'Software Engineer', level: Level.L3, location: 'Mumbai', currency: Currency.INR, experience_years: 1, base_salary: 700000n, bonus: 50000n, stock: 0n, source: Source.CONTRIBUTOR, confidence_score: 0.85 },
  { company_name: 'TCS', role: 'Software Engineer', level: Level.L4, location: 'Pune', currency: Currency.INR, experience_years: 4, base_salary: 1100000n, bonus: 100000n, stock: 0n, source: Source.SCRAPED, confidence_score: 0.82 },
  { company_name: 'TCS', role: 'Backend Engineer', level: Level.SDE_I, location: 'Hyderabad', currency: Currency.INR, experience_years: 2, base_salary: 800000n, bonus: 0n, stock: 0n, source: Source.AI_INFERRED, confidence_score: 0.78 },

  // INFOSYS (3 records)
  { company_name: 'Infosys', role: 'Software Engineer', level: Level.L3, location: 'Bengaluru', currency: Currency.INR, experience_years: 1, base_salary: 650000n, bonus: 40000n, stock: 0n, source: Source.CONTRIBUTOR, confidence_score: 0.83 },
  { company_name: 'Infosys', role: 'Software Engineer', level: Level.L4, location: 'Pune', currency: Currency.INR, experience_years: 4, base_salary: 1000000n, bonus: 80000n, stock: 0n, source: Source.SCRAPED, confidence_score: 0.8 },
  { company_name: 'Infosys', role: 'Full Stack Engineer', level: Level.SDE_I, location: 'Hyderabad', currency: Currency.INR, experience_years: 2, base_salary: 750000n, bonus: 50000n, stock: 0n, source: Source.CONTRIBUTOR, confidence_score: 0.81 },

  // WIPRO (3 records)
  { company_name: 'Wipro', role: 'Software Engineer', level: Level.L3, location: 'Bengaluru', currency: Currency.INR, experience_years: 1, base_salary: 600000n, bonus: 30000n, stock: 0n, source: Source.CONTRIBUTOR, confidence_score: 0.82 },
  { company_name: 'Wipro', role: 'Software Engineer', level: Level.L4, location: 'Hyderabad', currency: Currency.INR, experience_years: 3, base_salary: 950000n, bonus: 60000n, stock: 0n, source: Source.SCRAPED, confidence_score: 0.79 },
  { company_name: 'Wipro', role: 'Backend Engineer', level: Level.SDE_I, location: 'Mumbai', currency: Currency.INR, experience_years: 2, base_salary: 700000n, bonus: 40000n, stock: 0n, source: Source.AI_INFERRED, confidence_score: 0.77 },

  // RAZORPAY (4 records)
  { company_name: 'Razorpay', role: 'Software Engineer', level: Level.SDE_I, location: 'Bengaluru', currency: Currency.INR, experience_years: 1, base_salary: 1600000n, bonus: 100000n, stock: 300000n, source: Source.CONTRIBUTOR, confidence_score: 0.87 },
  { company_name: 'Razorpay', role: 'Backend Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 3, base_salary: 2400000n, bonus: 200000n, stock: 700000n, source: Source.SCRAPED, confidence_score: 0.84 },
  { company_name: 'Razorpay', role: 'Software Engineer', level: Level.SDE_III, location: 'Bengaluru', currency: Currency.INR, experience_years: 6, base_salary: 3600000n, bonus: 400000n, stock: 1500000n, source: Source.CONTRIBUTOR, confidence_score: 0.88 },
  { company_name: 'Razorpay', role: 'Full Stack Engineer', level: Level.STAFF, location: 'Bengaluru', currency: Currency.INR, experience_years: 9, base_salary: 5200000n, bonus: 600000n, stock: 2500000n, source: Source.CONTRIBUTOR, confidence_score: 0.86 },

  // ZEPTO (3 records)
  { company_name: 'Zepto', role: 'Software Engineer', level: Level.SDE_I, location: 'Mumbai', currency: Currency.INR, experience_years: 1, base_salary: 1400000n, bonus: 80000n, stock: 200000n, source: Source.CONTRIBUTOR, confidence_score: 0.8 },
  { company_name: 'Zepto', role: 'Backend Engineer', level: Level.SDE_II, location: 'Mumbai', currency: Currency.INR, experience_years: 3, base_salary: 2200000n, bonus: 150000n, stock: 500000n, source: Source.SCRAPED, confidence_score: 0.78 },
  { company_name: 'Zepto', role: 'Software Engineer', level: Level.SDE_III, location: 'Mumbai', currency: Currency.INR, experience_years: 5, base_salary: 3200000n, bonus: 300000n, stock: 1000000n, source: Source.AI_INFERRED, confidence_score: 0.75 },

  // EDGE CASE records
  { company_name: 'Google', role: 'Software Engineer', level: Level.PRINCIPAL, location: 'San Francisco', currency: Currency.USD, experience_years: 18, base_salary: 350000n, bonus: 100000n, stock: 400000n, source: Source.CONTRIBUTOR, confidence_score: 0.88 },
  { company_name: 'NVIDIA', role: 'Software Engineer', level: Level.IC5, location: 'San Francisco', currency: Currency.USD, experience_years: 15, base_salary: 300000n, bonus: 80000n, stock: 350000n, source: Source.CONTRIBUTOR, confidence_score: 0.84 },
  { company_name: 'TCS', role: 'Software Engineer', level: Level.L3, location: 'Delhi', currency: Currency.INR, experience_years: 1, base_salary: 650000n, bonus: 0n, stock: 0n, source: Source.CONTRIBUTOR, confidence_score: 0.8 },
  { company_name: 'Google', role: 'Software Engineer', level: Level.STAFF, location: 'San Francisco', currency: Currency.USD, experience_years: 14, base_salary: 300000n, bonus: 80000n, stock: 600000n, source: Source.CONTRIBUTOR, confidence_score: 0.86 },
  { company_name: 'Flipkart', role: 'Software Engineer', level: Level.SDE_II, location: 'Delhi', currency: Currency.INR, experience_years: 4, base_salary: 2600000n, bonus: 250000n, stock: 700000n, source: Source.CONTRIBUTOR, confidence_score: 0.83 },
  { company_name: 'Amazon', role: 'Software Engineer', level: Level.L5, location: 'London', currency: Currency.EUR, experience_years: 7, base_salary: 100000n, bonus: 15000n, stock: 60000n, source: Source.SCRAPED, confidence_score: 0.82 },
  { company_name: 'Microsoft', role: 'DevOps Engineer', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: 2800000n, bonus: 300000n, stock: 800000n, source: Source.CONTRIBUTOR, confidence_score: 0.87 },
  { company_name: 'Amazon', role: 'Frontend Engineer', level: Level.SDE_II, location: 'Bengaluru', currency: Currency.INR, experience_years: 3, base_salary: 2600000n, bonus: 200000n, stock: 800000n, source: Source.CONTRIBUTOR, confidence_score: 0.86 },
  { company_name: 'Meta', role: 'Frontend Engineer', level: Level.L4, location: 'San Francisco', currency: Currency.USD, experience_years: 4, base_salary: 175000n, bonus: 30000n, stock: 110000n, source: Source.SCRAPED, confidence_score: 0.9 },
  { company_name: 'Google', role: 'Data Engineer', level: Level.L4, location: 'Bengaluru', currency: Currency.INR, experience_years: 4, base_salary: 3400000n, bonus: 400000n, stock: 1400000n, source: Source.CONTRIBUTOR, confidence_score: 0.88 },
];

async function main() {
  const { prisma } = await import('../lib/db');
  console.log('🌱 Starting seed...');

  // Check if data already exists
  const existingCount = await prisma.salary.count();
  if (existingCount > 0) {
    console.log(`⚠️  Database already has ${existingCount} salary records. Skipping seed to avoid duplicates.`);
    console.log('   To re-seed, manually clear the database first.');
    return;
  }

  // Create companies
  const companyMap = new Map<string, string>();

  for (const companyData of companies) {
    const normalizedName = normalizeCompanyName(companyData.name);
    const slug = generateSlug(companyData.name);

    const company = await prisma.company.upsert({
      where: { slug },
      update: {},
      create: {
        name: companyData.name,
        slug,
        normalized_name: normalizedName,
        industry: companyData.industry,
        headquarters: companyData.headquarters,
        founded_year: companyData.founded_year,
        headcount_range: companyData.headcount_range,
      },
    });

    companyMap.set(normalizedName, company.id);

    if (companyData.variants) {
      for (const variant of companyData.variants) {
        companyMap.set(normalizeCompanyName(variant), company.id);
      }
    }
  }

  console.log(`✅ Created ${companies.length} companies`);

  // Create salary records
  let createdCount = 0;

  for (const record of salaryRecords) {
    const normalizedName = normalizeCompanyName(record.company_name);
    const companyId = companyMap.get(normalizedName);

    if (!companyId) {
      console.warn(`⚠️  Company not found for: ${record.company_name} (normalized: ${normalizedName})`);
      continue;
    }

    const totalCompensation = record.base_salary + record.bonus + record.stock;

    await prisma.salary.create({
      data: {
        company_id: companyId,
        role: record.role,
        level: record.level,
        location: record.location,
        currency: record.currency,
        experience_years: record.experience_years,
        base_salary: record.base_salary,
        bonus: record.bonus,
        stock: record.stock,
        total_compensation: totalCompensation,
        source: record.source,
        confidence_score: record.confidence_score,
        is_verified: record.confidence_score >= 0.85,
      },
    });

    createdCount++;
  }

  console.log(`✅ Created ${createdCount} salary records`);
  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  });
