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

## Architecture Decisions

### Rendering Strategy
- Homepage: ISR (revalidate: 3600) — trending data changes daily
- Company pages /companies/[slug]: Static with generateStaticParams() querying real Neon DB at build time
- Salary table /salaries: ISR for fast, SEO-friendly delivery
- Compare page /compare: Client component — user-specific selections, cannot be prebuilt

### Pagination
Chose page-based over cursor-based pagination because salary data sorts by total_compensation (a stable field, not chronological). Page-based allows simple, shareable filter URLs like /salaries?page=2.

### What I would build differently with more time
Full-text search via PostgreSQL tsvector, granular SEO pages per role+location combination, salary submission form for CONTRIBUTOR-sourced data.

### What was cut and why
- Authentication — explicitly out of scope per task brief
- Reviews/Interviews pages — scope too large for 72 hours, focused on core salary intelligence
- Typesense search — PostgreSQL ILIKE sufficient at current data scale

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
