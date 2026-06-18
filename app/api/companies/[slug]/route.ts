import { prisma } from '@/lib/db';
import { computeMedian } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const company = await prisma.company.findUnique({
      where: { slug },
      include: {
        salaries: {
          orderBy: { total_compensation: 'desc' },
        },
      },
    });

    if (!company) {
      return Response.json(
        { error: true, message: 'Company not found' },
        { status: 404 }
      );
    }

    // Compute median total compensation (true statistical median)
    const tcValues = company.salaries.map((s) => Number(s.total_compensation));
    const medianTc = computeMedian(tcValues);

    // Level distribution
    const levelDistribution: Record<string, number> = {};
    for (const salary of company.salaries) {
      levelDistribution[salary.level] = (levelDistribution[salary.level] || 0) + 1;
    }

    // Min/max TC
    const minTc = tcValues.length > 0 ? Math.min(...tcValues) : 0;
    const maxTc = tcValues.length > 0 ? Math.max(...tcValues) : 0;

    const response = {
      id: company.id,
      name: company.name,
      slug: company.slug,
      normalized_name: company.normalized_name,
      industry: company.industry,
      headquarters: company.headquarters,
      founded_year: company.founded_year,
      headcount_range: company.headcount_range,
      created_at: company.created_at,
      updated_at: company.updated_at,
      salaries: company.salaries.map((s) =>
        JSON.parse(
          JSON.stringify(
            { ...s, company: { id: company.id, name: company.name, slug: company.slug, industry: company.industry, headquarters: company.headquarters, founded_year: company.founded_year, headcount_range: company.headcount_range } },
            (_key, value) => (typeof value === 'bigint' ? value.toString() : value)
          )
        )
      ),
      median_total_compensation: medianTc,
      level_distribution: levelDistribution,
      min_tc: minTc,
      max_tc: maxTc,
      record_count: company.salaries.length,
    };

    return Response.json(response, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('GET /api/companies/[slug] error:', err);
    return Response.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
