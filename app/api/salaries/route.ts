import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { PAGINATION } from '@/lib/config';
import { Prisma } from '@prisma/client';


export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const company = searchParams.get('company') || undefined;
    const role = searchParams.get('role') || undefined;
    const levelParam = searchParams.get('level');
    const location = searchParams.get('location') || undefined;
    const currency = searchParams.get('currency') || undefined;
    const sort = searchParams.get('sort') || 'total_comp_desc';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(
      PAGINATION.MAX_LIMIT,
      Math.max(1, Number(searchParams.get('limit')) || PAGINATION.DEFAULT_LIMIT)
    );

    // Build where clause
    const where: Record<string, unknown> = {};

    if (company) {
      where.company = {
        name: { contains: company, mode: 'insensitive' },
      };
    }

    if (role) {
      where.role = { contains: role, mode: 'insensitive' };
    }

    if (levelParam) {
      const levels = levelParam.split(',').filter(Boolean);
      if (levels.length === 1) {
        where.level = levels[0];
      } else if (levels.length > 1) {
        where.level = { in: levels };
      }
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (currency) {
      where.currency = currency;
    }

    // Sort
    let orderBy: Record<string, unknown> = {};
    switch (sort) {
      case 'total_comp_asc':
        orderBy = { total_compensation: 'asc' };
        break;
      case 'date_desc':
        orderBy = { submitted_at: 'desc' };
        break;
      case 'total_comp_desc':
      default:
        orderBy = { total_compensation: 'desc' };
    }

    const skip = (page - 1) * limit;

    const [salaries, total] = await Promise.all([
      prisma.salary.findMany({
        where: where as unknown as Prisma.SalaryWhereInput,
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
        orderBy: orderBy as unknown as Prisma.SalaryOrderByWithRelationInput,
        skip,
        take: limit,
      }),
      prisma.salary.count({ where: where as unknown as Prisma.SalaryWhereInput }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const response = {
      data: salaries.map(serializeSalary),
      meta: { total, page, limit, totalPages },
    };

    return Response.json(response, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=3600',
      },
    });
  } catch (err) {
    console.error('GET /api/salaries error:', err);
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
