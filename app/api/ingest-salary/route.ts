import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { normalizeCompanyName, generateSlug } from '@/lib/utils';
import { Level, Currency, Source } from '@prisma/client';

const VALID_LEVELS = Object.values(Level);
const VALID_CURRENCIES = Object.values(Currency);
const VALID_SOURCES = Object.values(Source);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // --- Validation ---
    const errors = validateFields(body);
    if (errors) {
      return Response.json(errors, { status: 400 });
    }

    const {
      company_name,
      role,
      level,
      location,
      currency,
      experience_years,
      base_salary,
      bonus = 0,
      stock = 0,
      source,
      confidence_score,
    } = body;

    // Normalize company
    const normalizedName = normalizeCompanyName(company_name);
    const slug = generateSlug(company_name);

    // Find or create company
    let company = await prisma.company.findFirst({
      where: { normalized_name: normalizedName },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: company_name.trim(),
          slug,
          normalized_name: normalizedName,
        },
      });
    }

    // ALWAYS recompute total_compensation (never trust client value)
    const totalCompensation = BigInt(base_salary) + BigInt(bonus) + BigInt(stock);

    // Duplicate check: same company+role+level+location, base within 10%, within 48h
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const possibleDuplicates = await prisma.salary.findMany({
      where: {
        company_id: company.id,
        role,
        level,
        location,
        submitted_at: { gte: fortyEightHoursAgo },
      },
    });

    const isDuplicate = possibleDuplicates.some((existing) => {
      const existingBase = Number(existing.base_salary);
      const newBase = Number(base_salary);
      const diff = Math.abs(existingBase - newBase);
      const threshold = existingBase * 0.1;
      return diff <= threshold;
    });

    if (isDuplicate) {
      return Response.json(
        {
          error: true,
          field: 'base_salary',
          message: 'A similar salary record was submitted recently. Duplicate detected.',
        },
        { status: 409 }
      );
    }

    // Create salary record
    const salary = await prisma.salary.create({
      data: {
        company_id: company.id,
        role,
        level,
        location,
        currency,
        experience_years: Number(experience_years),
        base_salary: BigInt(base_salary),
        bonus: BigInt(bonus),
        stock: BigInt(stock),
        total_compensation: totalCompensation,
        source,
        confidence_score: Number(confidence_score),
      },
      include: { company: true },
    });

    // Serialize BigInt to string for JSON
    return Response.json(serializeSalary(salary), { status: 201 });
  } catch (err) {
    console.error('Ingest salary error:', err);
    return Response.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

function validateFields(body: Record<string, unknown>) {
  const required = ['company_name', 'role', 'level', 'location', 'currency', 'experience_years', 'base_salary', 'source', 'confidence_score'];

  for (const field of required) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return { error: true, field, message: `${field} is required` };
    }
  }

  if (String(body.company_name).length > 100 || String(body.role).length > 100 || String(body.location).length > 100) {
    return { error: true, message: 'company_name, role, and location must be 100 characters or less' };
  }

  if (!VALID_LEVELS.includes(body.level as Level)) {
    return { error: true, field: 'level', message: `Invalid level. Must be one of: ${VALID_LEVELS.join(', ')}` };
  }

  if (!VALID_CURRENCIES.includes(body.currency as Currency)) {
    return { error: true, field: 'currency', message: `Invalid currency. Must be one of: ${VALID_CURRENCIES.join(', ')}` };
  }

  if (!VALID_SOURCES.includes(body.source as Source)) {
    return { error: true, field: 'source', message: `Invalid source. Must be one of: ${VALID_SOURCES.join(', ')}` };
  }

  const exp = Number(body.experience_years);
  if (!Number.isInteger(exp) || exp <= 0 || exp > 50) {
    return { error: true, field: 'experience_years', message: 'experience_years must be > 0 and < 51' };
  }

  const baseSalary = Number(body.base_salary);
  if (isNaN(baseSalary) || baseSalary <= 0) {
    return { error: true, field: 'base_salary', message: 'base_salary must be > 0' };
  }

  const confidence = Number(body.confidence_score);
  if (isNaN(confidence) || confidence < 0 || confidence > 1) {
    return { error: true, field: 'confidence_score', message: 'confidence_score must be between 0.0 and 1.0' };
  }

  return null;
}

function serializeSalary(salary: Record<string, unknown>) {
  return JSON.parse(
    JSON.stringify(salary, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}
