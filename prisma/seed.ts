import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── System item types ───────────────────────────────────────────────────────

const systemItemTypes = [
  { name: 'snippet', icon: 'Code',       color: '#3b82f6', isSystem: true },
  { name: 'prompt',  icon: 'Sparkles',   color: '#8b5cf6', isSystem: true },
  { name: 'command', icon: 'Terminal',   color: '#f97316', isSystem: true },
  { name: 'note',    icon: 'StickyNote', color: '#fde047', isSystem: true },
  { name: 'file',    icon: 'File',       color: '#6b7280', isSystem: true },
  { name: 'image',   icon: 'Image',      color: '#ec4899', isSystem: true },
  { name: 'link',    icon: 'Link',       color: '#10b981', isSystem: true },
];

// ─── Seed data ───────────────────────────────────────────────────────────────

const collections = [
  {
    name: 'React Patterns',
    description: 'Reusable React patterns and hooks',
    items: [
      {
        type: 'snippet',
        title: 'useDebounce hook',
        description: 'Delays updating a value until after a specified wait period',
        language: 'TypeScript',
        tags: ['react', 'hooks', 'performance'],
        content: `import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}`,
      },
      {
        type: 'snippet',
        title: 'Context provider pattern',
        description: 'Typed context with a custom hook and provider wrapper',
        language: 'TypeScript',
        tags: ['react', 'context', 'patterns'],
        content: `import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}`,
      },
      {
        type: 'snippet',
        title: 'cn utility (classnames + tailwind-merge)',
        description: 'Merge Tailwind classes safely, handling conflicts',
        language: 'TypeScript',
        tags: ['tailwind', 'utility', 'shadcn'],
        content: `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`,
      },
    ],
  },
  {
    name: 'AI Workflows',
    description: 'AI prompts and workflow automations',
    items: [
      {
        type: 'prompt',
        title: 'Code review prompt',
        description: 'Structured prompt for thorough code reviews',
        tags: ['ai', 'code-review', 'engineering'],
        content: `You are an experienced senior engineer performing a code review. Review the following code for:

1. **Correctness** — Does it do what it's supposed to? Edge cases handled?
2. **Security** — SQL injection, XSS, auth bypasses, exposed secrets?
3. **Performance** — N+1 queries, unnecessary re-renders, blocking operations?
4. **Readability** — Is the intent clear? Would a new team member understand it?
5. **Patterns** — Does it follow the existing conventions in the codebase?

For each issue found, provide:
- Severity: Critical / Major / Minor / Suggestion
- Location: file and line number
- Explanation: why it's a problem
- Fix: concrete code example

\`\`\`
{PASTE CODE HERE}
\`\`\``,
      },
      {
        type: 'prompt',
        title: 'Documentation generator',
        description: 'Generate JSDoc and README sections from source code',
        tags: ['ai', 'documentation', 'jsdoc'],
        content: `Generate documentation for the following code. Produce:

1. **JSDoc comment** for each exported function/class with:
   - One-line summary
   - @param tags with types and descriptions
   - @returns description
   - @example with a realistic usage snippet

2. **README section** (markdown) covering:
   - What it does
   - Installation / import
   - Usage examples
   - Edge cases and limitations

Keep descriptions concise and developer-focused. Avoid restating the obvious.

\`\`\`
{PASTE CODE HERE}
\`\`\``,
      },
      {
        type: 'prompt',
        title: 'Refactoring assistant',
        description: 'Identify and apply refactoring opportunities in existing code',
        tags: ['ai', 'refactoring', 'clean-code'],
        content: `Analyze the following code and suggest refactoring improvements. Focus on:

1. **Extract** — functions, components, or constants that appear more than once
2. **Simplify** — complex conditionals, deeply nested logic, or long functions (>40 lines)
3. **Rename** — variables or functions whose names don't reflect their purpose
4. **Separate concerns** — mix of business logic and presentation, or UI and data fetching
5. **Remove dead code** — unused variables, unreachable branches, commented-out blocks

For each suggestion:
- Show the BEFORE and AFTER
- Explain the benefit in one sentence
- Flag if the refactor changes behavior (even slightly)

\`\`\`
{PASTE CODE HERE}
\`\`\``,
      },
    ],
  },
  {
    name: 'DevOps',
    description: 'Infrastructure and deployment resources',
    items: [
      {
        type: 'snippet',
        title: 'Docker Compose — Next.js + PostgreSQL',
        description: 'Local dev stack with Next.js app and Postgres database',
        language: 'YAML',
        tags: ['docker', 'postgres', 'nextjs', 'devops'],
        content: `services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/devstash
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: devstash
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:`,
      },
      {
        type: 'command',
        title: 'Deploy to production (Vercel)',
        description: 'Run DB migration then deploy to Vercel production',
        tags: ['vercel', 'deploy', 'prisma'],
        content: `npx prisma migrate deploy && vercel --prod`,
      },
      {
        type: 'link',
        title: 'Docker Documentation',
        description: 'Official Docker docs — Compose, Dockerfile reference, networking',
        tags: ['docker', 'reference'],
        url: 'https://docs.docker.com',
      },
      {
        type: 'link',
        title: 'GitHub Actions Documentation',
        description: 'Workflow syntax, triggers, runners, and marketplace actions',
        tags: ['ci-cd', 'github', 'reference'],
        url: 'https://docs.github.com/en/actions',
      },
    ],
  },
  {
    name: 'Terminal Commands',
    description: 'Useful shell commands for everyday development',
    items: [
      {
        type: 'command',
        title: 'Undo last commit (keep changes)',
        description: 'Moves HEAD back one commit, leaving files staged',
        tags: ['git', 'undo'],
        content: `git reset --soft HEAD~1`,
      },
      {
        type: 'command',
        title: 'Remove all stopped containers and unused images',
        description: 'Frees disk space by pruning Docker system',
        tags: ['docker', 'cleanup'],
        content: `docker system prune -af --volumes`,
      },
      {
        type: 'command',
        title: 'Find and kill process on a port',
        description: 'Useful when "port already in use" blocks dev server startup',
        tags: ['process', 'networking', 'debug'],
        content: `lsof -ti:<PORT> | xargs kill -9`,
      },
      {
        type: 'command',
        title: 'Clean install node_modules',
        description: 'Delete lockfile and node_modules, then reinstall from scratch',
        tags: ['npm', 'node', 'cleanup'],
        content: `rm -rf node_modules package-lock.json && npm install`,
      },
    ],
  },
  {
    name: 'Design Resources',
    description: 'UI/UX resources and references',
    items: [
      {
        type: 'link',
        title: 'Tailwind CSS Docs',
        description: 'Utility-first CSS framework — full class reference and config guide',
        tags: ['tailwind', 'css', 'reference'],
        url: 'https://tailwindcss.com/docs',
      },
      {
        type: 'link',
        title: 'shadcn/ui',
        description: 'Copy-paste React components built on Radix UI and Tailwind CSS',
        tags: ['components', 'shadcn', 'ui'],
        url: 'https://ui.shadcn.com',
      },
      {
        type: 'link',
        title: 'Radix UI Primitives',
        description: 'Unstyled, accessible component primitives for React',
        tags: ['radix', 'accessibility', 'components'],
        url: 'https://www.radix-ui.com/primitives',
      },
      {
        type: 'link',
        title: 'Lucide Icons',
        description: 'Open-source icon library used throughout DevStash',
        tags: ['icons', 'lucide', 'svg'],
        url: 'https://lucide.dev/icons',
      },
    ],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Seeding database...\n');

  // 1. System item types
  // Note: can't use createMany + skipDuplicates for nullable composite uniques —
  // PostgreSQL treats NULL != NULL so the unique constraint doesn't fire.
  // Use findFirst + create instead to stay idempotent.
  for (const type of systemItemTypes) {
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, userId: null },
    });
    if (!existing) {
      await prisma.itemType.create({ data: type });
    }
  }
  console.log('✓ System item types');

  // 2. Fetch type map
  const typeMap = await prisma.itemType.findMany({ where: { isSystem: true } });
  const typeById = Object.fromEntries(typeMap.map(t => [t.name, t.id]));

  // 3. Demo user — wipe and recreate for idempotency
  await prisma.user.deleteMany({ where: { email: 'demo@devstash.io' } });
  const passwordHash = await bcrypt.hash('12345678', 12);
  const user = await prisma.user.create({
    data: {
      email: 'demo@devstash.io',
      name: 'Demo User',
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });
  console.log('✓ Demo user (demo@devstash.io)');

  // 4. Collections + items
  let totalItems = 0;

  for (const col of collections) {
    const collection = await prisma.collection.create({
      data: {
        name: col.name,
        description: col.description,
        userId: user.id,
      },
    });

    for (const item of col.items) {
      const typeId = typeById[item.type];
      if (!typeId) throw new Error(`Unknown item type: ${item.type}`);

      const contentType =
        item.type === 'link' ? 'URL' : 'TEXT';

      await prisma.item.create({
        data: {
          title: item.title,
          description: item.description ?? null,
          contentType,
          content: 'content' in item ? item.content : null,
          url: 'url' in item ? item.url : null,
          language: 'language' in item ? item.language : null,
          userId: user.id,
          itemTypeId: typeId,
          tags: {
            connectOrCreate: item.tags.map(tag => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
          collections: {
            create: { collectionId: collection.id },
          },
        },
      });

      totalItems++;
    }

    console.log(`✓ Collection "${col.name}" (${col.items.length} items)`);
  }

  console.log(`\nDone. Created ${collections.length} collections and ${totalItems} items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
