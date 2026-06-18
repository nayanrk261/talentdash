# TalentDash

TalentDash is a comprehensive, full-stack compensation intelligence platform that provides verified tech salaries, company insights, and powerful comparison tools.

## Features

- **Salary Insights**: Browse through verified salaries across top tech companies.
- **Company Profiles**: Detailed company pages with level distribution, total compensation breakdowns, and historical data.
- **Compare Tool**: Compare salaries across different companies side-by-side to make informed career decisions.
- **Data Submission**: Secure and structured ingestion pipeline for community-submitted salary data.
- **High Performance**: Built with Next.js App Router utilizing Static Site Generation (SSG) and Incremental Static Regeneration (ISR) for lightning-fast loading speeds.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 (No component libraries)
- **Database**: PostgreSQL via Neon Serverless
- **ORM**: Prisma Client v7
- **Deployment**: Vercel

## Design System

TalentDash adheres to a strict design system for a premium user experience:
- **Font**: Inter (Google Fonts)
- **Primary Color**: Coral Red (`#FF5A5F`)
- **Typography**: H1 (36px, 700w), H2 (28px, 700w), H3 (22px, 600w), Body (16px, 400w, 1.6 lh)
- **Aesthetics**: Clean, minimalist UI with subtle hover states, micro-animations, and structured data tables.

## Getting Started

### Prerequisites

- Node.js 20+
- A Neon PostgreSQL Database URL

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file with your Neon Database URL:
   ```env
   DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
   ```
4. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```
5. Run database migrations:
   ```bash
   npx prisma db push
   ```
6. Seed the database with sample data:
   ```bash
   npx prisma db seed
   ```
7. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The core schema revolves around two models:
- **Company**: Stores company metadata (industry, headcount, founded year, etc.)
- **Salary**: Stores compensation records tied to companies (role, level, experience, base, stock, bonus, etc.)

## Project Structure

- `app/`: Next.js pages, API routes, and layouts
- `components/`:
  - `ui/`: Primitive UI elements (Button, Input, Badge, etc.)
  - `features/`: Complex, stateful components (SalaryTable, FilterBar, LevelDistribution, etc.)
- `lib/`: Utility functions, configuration, and database client initialization
- `prisma/`: Prisma schema, migrations, and seed scripts
- `types/`: Global TypeScript definitions

## License

MIT

---

## 🔗 Live URL

> **[https://talentdash.vercel.app](https://talentdash.vercel.app)** _(placeholder — update after deployment)_

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  Next.js 15 App Router          │
├──────────┬──────────┬──────────┬────────────────┤
│  Home    │ /salaries│/companies│   /compare     │
│  (SSG)   │(Client)  │ [slug]   │  (Client)      │
│          │          │(SSG+ISR) │                │
├──────────┴──────────┴──────────┴────────────────┤
│              API Route Handlers                  │
│  POST /api/ingest-salary                        │
│  GET  /api/salaries                             │
│  GET  /api/companies/[slug]                     │
│  GET  /api/compare                              │
├─────────────────────────────────────────────────┤
│           Prisma ORM (Singleton Client)         │
├─────────────────────────────────────────────────┤
│        Neon PostgreSQL (Serverless)             │
└─────────────────────────────────────────────────┘
```

### Rendering Strategy

| Page | Strategy | Revalidation | Justification |
|------|----------|-------------|---------------|
| `/` (Home) | SSG + ISR | 300s | Read-heavy stats, benefits from caching |
| `/salaries` | Client Component | N/A | Interactive filtering requires client-side state; data fetched via API |
| `/companies/[slug]` | SSG + ISR | 3600s | Static per-company, `generateStaticParams` at build time |
| `/compare` | Client Component | N/A | Two-dropdown interactive UI with URL state |
| API Routes | Dynamic | N/A | Real-time queries, writes, Cache-Control headers |

---

## 🚀 Getting Started (< 5 minutes)

### Prerequisites

- Node.js 18+
- npm

### 1. Clone & Install

```bash
git clone <repo-url> talentdash
cd talentdash
npm install
```

### 2. Environment Variables

Create a `.env` file (one is already included):

```env
DATABASE_URL="postgresql://neondb_owner:<password>@<host>/<database>?sslmode=require"
```

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `NEXT_PUBLIC_SITE_URL` | Production URL (optional) | `https://talentdash.vercel.app` |

### 3. Database Setup

```bash
# Push schema to Neon
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed with 60+ records
npx prisma db seed
```

### 4. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
talentdash/
├── app/
│   ├── api/
│   │   ├── ingest-salary/route.ts
│   │   ├── salaries/route.ts
│   │   ├── companies/[slug]/route.ts
│   │   └── compare/route.ts
│   ├── companies/[slug]/page.tsx
│   ├── salaries/page.tsx
│   ├── compare/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── not-found.tsx
│   └── globals.css
├── components/
│   ├── ui/          # Button, Badge, Input, Select, Pagination, Skeleton, EmptyState
│   └── features/    # Navbar, Footer, SalaryTable, FilterBar, CompanyCard, LevelDistribution, CompareWidget
├── lib/
│   ├── config.ts    # Constants, rates, design tokens
│   ├── db.ts        # Prisma singleton
│   └── utils.ts     # Formatting, normalization, median
├── types/
│   └── index.ts     # TypeScript interfaces
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── README.md
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary Accent | `#FF5A5F` | CTAs, highlights, active states |
| Data Blue | `#0369A1` | Salary figures (32-40px, weight 700) |
| Deep Text | `#222222` | Headings |
| Body Text | `#484848` | Body copy |
| Muted Text | `#717171` | Secondary text |
| Surface | `#FFFFFF` | Cards, tables |
| Background | `#F7F7F7` | App background |
| Border | `#EBEBEB` | Dividers, borders |
| Success | `#008A05` | Positive deltas |
| Error | `#D93025` | Negative deltas |
| Font | Inter | Google Fonts, self-hosted via next/font |

---

## 📡 API Reference

### POST `/api/ingest-salary`
Submit a new salary record with full validation and duplicate detection.

### GET `/api/salaries`
Query salary records with filters, pagination, and sorting.

### GET `/api/companies/[slug]`
Get company metadata, salary list, median TC, and level distribution.

### GET `/api/compare?s1=uuid&s2=uuid`
Compare two salary records with computed deltas.

---

## 🏛 Architecture Decisions

### Why Static (SSG + ISR) vs Dynamic per page type

- **Home page (SSG + ISR 300s)**: Stats change infrequently, caching gives instant load. Revalidates every 5 minutes to pick up new data.
- **Company pages (SSG + ISR 3600s)**: Company data is relatively stable. `generateStaticParams` pre-builds all known company pages at build time. New companies are generated on-demand and cached for 1 hour.
- **Salaries page (Client)**: Interactive filtering with debounced search, multi-select, and currency conversion requires client-side state. Data is fetched via the `/api/salaries` endpoint.
- **Compare page (Client)**: Two-way dropdown selection with URL state sync is inherently interactive.
- **API routes (Dynamic)**: Must handle real-time queries, writes, and unique parameters.

### Why page-based pagination

- **Simplicity**: Cursor-based pagination adds complexity for minimal benefit given our dataset size (<10K records).
- **URL shareability**: Page numbers are intuitive and URL-encodable (`?page=3`).
- **SEO-friendly**: Search engines can crawl paginated content.
- **Trade-off**: For datasets > 100K records, cursor-based would be more performant.

### What would be built differently with more time

1. **Full-text search** with PostgreSQL `tsvector` for better company/role search.
2. **Cursor-based pagination** for the API to handle scale.
3. **Redis caching** layer between API and database.
4. **Authentication** for salary submission with email verification.
5. **Salary trends** — time-series visualization showing TC changes over time.
6. **PDF export** of comparison results.
7. **Dark mode** toggle.
8. **Rate limiting** on the ingest endpoint.

### What was cut and why

- **Admin dashboard**: Spec mentioned "no SSR except admin" but admin was not specified in detail. Cut for scope.
- **Chart library**: Level distribution uses pure CSS stacked bars instead of D3/Chart.js to avoid bundle size.
- **Company logos**: Using text-only company names. Could add `next/image` with logo assets.
- **Email notifications**: No notification system for new salary submissions.

---

## 📊 Seed Data

60+ realistic records covering:
- **12 companies**: Google, Amazon, Meta, Microsoft, Flipkart, Meesho, NVIDIA, TCS, Infosys, Wipro, Razorpay, Zepto
- **All levels**: L3 through PRINCIPAL
- **7 cities**: Bengaluru, Mumbai, Hyderabad, Pune, Delhi, San Francisco, London
- **4 currencies**: INR, USD, GBP, EUR
- **Edge cases**: Zero bonus, zero stock, very high equity, PRINCIPAL level, company name variants

Run seed:
```bash
npx prisma db seed
```

---

## 🚢 Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Set `DATABASE_URL` in Vercel environment variables.

---

## License

MIT
