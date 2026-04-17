# DevStash

A unified developer knowledge hub for snippets, commands, prompts, notes, files, images, and links.

## Overview

DevStash solves the problem of developer knowledge scattered across VS Code, Notion, browser bookmarks, chat histories, and random folders. It provides one fast, searchable, AI-enhanced hub for all developer resources.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 / React 19 |
| Language | TypeScript |
| Database | Neon PostgreSQL + Prisma 7 |
| Authentication | NextAuth v5 (email/password + GitHub OAuth) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| File Storage | Cloudflare R2 |
| AI | OpenAI (gpt-5-nano) |
| Payments | Stripe |
| Analytics | Vercel Analytics |
| Rate Limiting | Upstash Redis |

## Features

- **7 item types** — Snippet, Prompt, Command, Note, File, Image, Link
- **Collections** — Organize items with many-to-many relationships
- **Global search** — Cmd+K command palette across items and collections
- **Item drawer** — Slide-in detail view with inline editing
- **Monaco editor** — For snippets and commands with syntax highlighting
- **Markdown editor** — Write/Preview tabs for notes and prompts
- **File & image uploads** — Drag-and-drop with Cloudflare R2 (Pro)
- **Favorites & pinning** — Star items/collections, pin items to top
- **Pagination** — Server-side pagination across all list views
- **Import / Export** — JSON (free) and ZIP with files (Pro)
- **AI auto-tagging** — Suggest tags from item content (Pro)
- **AI description generator** — Generate descriptions automatically (Pro)
- **AI explain code** — Explain snippets and commands (Pro)
- **AI prompt optimizer** — Improve prompts with one click (Pro)
- **Editor preferences** — Font size, tab size, word wrap, minimap, theme
- **Stripe billing** — Free tier limits, Pro upgrade, customer portal
- **Rate limiting** — Upstash Redis on all auth and AI endpoints
- **Email verification** — Resend SDK for transactional email
- **Forgot/reset password** — Token-based with 1-hour expiry

## Item Types

| Type | Color | Route |
|---|---|---|
| Snippet | Blue `#3b82f6` | `/items/snippets` |
| Prompt | Purple `#8b5cf6` | `/items/prompts` |
| Command | Orange `#f97316` | `/items/commands` |
| Note | Yellow `#fde047` | `/items/notes` |
| File | Gray `#6b7280` | `/items/files` |
| Image | Pink `#ec4899` | `/items/images` |
| Link | Emerald `#10b981` | `/items/links` |

File and Image are Pro-only.

## Pricing

| Feature | Free | Pro ($8/mo or $72/yr) |
|---|---|---|
| Items | 50 | Unlimited |
| Collections | 3 | Unlimited |
| File & Image uploads | — | Yes |
| AI features | — | Yes |
| Data export | — | Yes |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev       # Development server (http://localhost:3000)
npm run build     # Production build
npm run start     # Production server
npm run lint      # ESLint
npm run test      # Vitest unit tests (single run)
npm run test:watch # Vitest unit tests (watch mode)
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
DATABASE_URL              # Neon PostgreSQL connection string
NEXTAUTH_SECRET           # Random secret for NextAuth
NEXTAUTH_URL              # App URL (http://localhost:3000 locally)
GITHUB_CLIENT_ID          # GitHub OAuth app client ID
GITHUB_CLIENT_SECRET      # GitHub OAuth app client secret
RESEND_API_KEY            # Resend for transactional email
R2_ACCOUNT_ID             # Cloudflare R2 account ID
R2_ACCESS_KEY_ID          # Cloudflare R2 access key
R2_SECRET_ACCESS_KEY      # Cloudflare R2 secret key
R2_BUCKET_NAME            # Cloudflare R2 bucket name
R2_PUBLIC_URL             # Public URL for R2 bucket
OPENAI_API_KEY            # OpenAI API key for AI features
STRIPE_SECRET_KEY         # Stripe secret key
STRIPE_WEBHOOK_SECRET     # Stripe webhook signing secret
STRIPE_MONTHLY_PRICE_ID   # Stripe price ID for monthly Pro
STRIPE_YEARLY_PRICE_ID    # Stripe price ID for yearly Pro
UPSTASH_REDIS_REST_URL    # Upstash Redis URL for rate limiting
UPSTASH_REDIS_REST_TOKEN  # Upstash Redis token
SKIP_EMAIL_VERIFICATION   # Set to "true" to bypass email verification in dev
```

## Database

```bash
# Create and apply a migration
npx prisma migrate dev --name <migration_name>

# Apply migrations in production
npx prisma migrate deploy

# Seed system item types and demo data
npx prisma db seed
```

> Never use `prisma db push` — always create proper migrations.

## Project Structure

```
devstash/
├── prisma/               # Schema, migrations, seed
├── src/
│   ├── app/
│   │   ├── (auth)/       # Sign-in, register, verify, reset
│   │   ├── (dashboard)/  # Dashboard, items, collections, settings
│   │   ├── api/          # API routes (auth, items, upload, stripe, AI)
│   │   └── page.tsx      # Marketing homepage
│   ├── actions/          # Server actions
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   ├── items/        # Item cards, drawer, editors
│   │   ├── collections/  # Collection cards, dialogs
│   │   ├── layout/       # Sidebar, TopBar, navigation
│   │   └── shared/       # Reusable dialog/form components
│   ├── lib/
│   │   ├── db/           # Prisma query functions
│   │   ├── constants/    # Icon map, editor config, pricing
│   │   ├── action-utils.ts
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── stripe.ts
│   │   ├── usage.ts
│   │   └── utils.ts
│   ├── hooks/
│   └── types/
└── context/              # Project documentation
```
