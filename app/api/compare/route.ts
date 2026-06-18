import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const s1 = searchParams.get('s1');
    const s2 = searchParams.get('s2');

    if (!s1 || !s2) {
      return Response.json(
        { error: true, message: 'Both s1 and s2 query parameters are required' },
        { status: 400 }
      );
    }

    if (s1 === s2) {
      return Response.json(
        { error: true, message: 'Cannot compare a record with itself. s1 and s2 must be different.' },
        { status: 400 }
      );
    }

    const [record1, record2] = await Promise.all([
      prisma.salary.findUnique({
        where: { id: s1 },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              industry: true,
              headquarters: true,
              founded_year: true,
              headcount_range: true,
            },
          },
        },
      }),
      prisma.salary.findUnique({
        where: { id: s2 },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              industry: true,
              headquarters: true,
              founded_year: true,
              headcount_range: true,
            },
          },
        },
      }),
    ]);

    if (!record1 || !record2) {
      const missing = !record1 ? 's1' : 's2';
      return Response.json(
        { error: true, message: `Record with ${missing} ID not found` },
        { status: 404 }
      );
    }

    const delta = {
      base_delta: Number(record1.base_salary) - Number(record2.base_salary),
      bonus_delta: Number(record1.bonus) - Number(record2.bonus),
      stock_delta: Number(record1.stock) - Number(record2.stock),
      tc_delta: Number(record1.total_compensation) - Number(record2.total_compensation),
      experience_delta: record1.experience_years - record2.experience_years,
    };

    const response = {
      record1: serializeSalary(record1),
      record2: serializeSalary(record2),
      delta,
    };

    return Response.json(response);
  } catch (err) {
    console.error('GET /api/compare error:', err);
    return Response.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

function serializeSalary(salary: Record<string, unknown>) {
  return JSON.parse(
    JSON.stringify(salary, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}
