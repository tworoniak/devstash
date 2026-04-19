# Current Feature: Homepage Mockup

## Status

In Progress

## Goals

- Create a standalone marketing homepage at `prototypes/homepage/` (index.html, styles.css, script.js)
- Hero section with animated "chaos to order" concept: floating icons (chaos) → pulsing arrow → dashboard preview
- Chaos icons drift, bounce off walls, and repel from mouse cursor via requestAnimationFrame
- Fixed nav with logo, Features/Pricing links, Sign In/Get Started buttons; becomes more opaque on scroll
- Features section: 6 cards (Code Snippets, AI Prompts, Instant Search, Commands, Files & Docs, Collections) with item type accent colors
- AI section: Pro badge + feature checklist on left, code editor mockup with AI tag demo on right
- Pricing section: Free vs Pro cards, Pro highlighted with "Most Popular"; yearly toggle ($72/yr option)
- CTA and Footer sections
- Scroll-triggered fade-in animations
- Fully responsive: chaos/arrow/dashboard stacks vertically on mobile, arrow rotates 90°

## Notes

- Output: `prototypes/homepage/index.html`, `styles.css`, `script.js` — standalone HTML/CSS/JS (no framework)
- Reference screenshots: `context/screenshots/homepage-full-visible.png` and `context/screenshots/homepage-mobile.png`
- Dark theme; item type accent colors:
  - Snippet: #3b82f6 (Blue), Prompt: #f59e0b (Amber), Command: #06b6d4 (Cyan)
  - Note: #22c55e (Green), File: #64748b (Slate), Image: #ec4899 (Pink), URL: #6366f1 (Indigo)
- Chaos icons: Notion, GitHub, Slack, VS Code logos + browser tabs, terminal, text file, bookmark icons
- Dashboard preview (right side of hero): sidebar with nav items + grid of item cards with colored top borders

## History

- **File List View** - FileListRow component with extension-based icon (FileImage/FileCode/FileArchive/FileText/File), file name, size, upload date, hover-reveal download button (stopPropagation); files type page uses 1→2→3 column grid; gray left border accent + card border matching other item views; fileName/fileSize added to DashboardItem select; item drawer action bar changed to flex-wrap with Delete button moved inline (Completed)
- **Image Gallery View** - ImageThumbnailCard component with aspect-video (16:9) thumbnails, object-cover, 5% hover zoom (300ms); images type page uses fixed 3-column gallery grid; fileUrl added to DashboardItem select; PRO badge repositioned inline next to label with count always on the right in sidebar; DevStash logo links to /dashboard when signed in, /sign-in when not (Completed)
- **File Upload with Cloudflare R2** - Upload API route (/api/upload) with extension-based validation and size limits (5 MB images, 10 MB files); FileUpload component with drag-and-drop and XHR progress; Download proxy route (/api/download/[id]) with auth; R2 delete on item deletion; image preview and file info in ItemDrawer; download button in action bar; File/Image types in new item dialog; uses Cloudflare REST API (api.cloudflare.com) instead of S3 endpoint due to TLS handshake issues (Completed)
- **Markdown Editor** - MarkdownEditor component with Write/Preview tabs, macOS window dots, copy button, react-markdown + remark-gfm for GFM support, custom .markdown-preview CSS class for dark theme styling; replaces Textarea for note/prompt in item-drawer (view and edit modes) and new-item-dialog; snippets/commands keep CodeEditor; readonly mode shows Preview tab only (Completed)
- **Code Editor** - Monaco Editor component (CodeEditor) with vs-dark theme, macOS window dots, language label and copy button in header, fluid height 80–400px, thin scrollbar; replaces Textarea for snippet/command in item-drawer (view and edit modes) and new-item-dialog; all other types keep Textarea (Completed)
- **Item Create** - New Item button in top bar opens shadcn Dialog, type selector (snippet/prompt/command/note/link), dynamic fields per type (content, language, URL), createItem server action with Zod validation, createItem db query in lib/db/items.ts, toast on success, modal close and list refresh via router.refresh() (Completed)
- **Item Delete** - Delete button in item drawer opens shadcn AlertDialog confirmation, deleteItem server action with auth/ownership validation, Sonner toast on success/error, drawer closes and list refreshes via router.refresh() after deletion (Completed)
- **Profile Page** - Profile page at /profile with user info, usage stats with item type breakdown, change password for email users, delete account with confirmation dialog, API endpoints for password change and account deletion (Completed)
- **Forgot Password** - Forgot password link on sign-in, /forgot-password and /reset-password pages, API endpoints for token generation and password reset, password reset emails via Resend, reuses VerificationToken model with password-reset: prefix, 1-hour token expiry, edge case handling (Completed)
- **Stats & Sidebar** - Real database data for stats cards (getDashboardStats), sidebar item types with counts (getSidebarItemTypes), favorite/recent collections with colored circle indicators (getSidebarFavoriteCollections/getSidebarRecentCollections), "View all collections" link, sidebarData fetched in dashboard layout and threaded through DashboardShell → TopBar/Sidebar as props, mobile sheet X overlap fixed with pt-10 (Completed)
- **Dashboard Items** - Real database data for pinned and recent items, getDashboardPinnedItems/getDashboardRecentItems queries in src/lib/db/items.ts, itemType icon/color passed directly to ItemRow (dropped mockItemTypes lookup), try/catch error handling, empty states (Completed)
- **Dashboard Collections** - Real database data for collections section, dynamic border colors from most-used item type, type icons display, server component data fetching with Prisma (Completed)
- **Audit Quick Wins** - Extracted shared ICON_MAP to src/lib/constants/icon-map.ts (removed duplication across 3 files), fixed index key → icon string key in CollectionCard type icon strip, moved formatDate to src/lib/utils.ts, removed redundant cursor-pointer from div inside Link in CollectionCard, added try/catch error handling to CollectionsSection (Completed)
- **Dashboard UI Phase 3 (Rebuild)** - Stats cards, collections grid, pinned items section, and recent items list on dashboard page; colored left border accent on item rows matching type color; mock data as source of truth (Completed)
- **Dashboard UI Phase 2** - Collapsible sidebar (icon-only when collapsed) with PanelLeft toggle in top bar, item type links with colored icons and counts, PRO badges on Files/Images, collapsible Types and Collections sections, Favorites with folder icon + star right, All Collections with folder icon + count right, mobile Sheet drawer, user avatar area at bottom, subtle borders via --border at 5% opacity (Completed)
- **Mock Data** - Single source of truth mock data file at src/lib/mock-data.ts with user, itemTypes, collections, and items (Completed)
- **Initial Setup** - Next.js 16, Tailwind CSS v4, TypeScript configured (Completed)
- **Dashboard UI Phase 1** - ShadCN UI initialization, dashboard route at /dashboard, main layout with dark mode, top bar with search and buttons, sidebar and main placeholders (Completed)
- **Prisma + Neon PostgreSQL** - Prisma 7 ORM with Neon PostgreSQL, full schema with User, NextAuth, Item, ItemType, Collection, Tag models, indexes, cascade deletes, seed file for system item types, initial migration (Completed)
- **Seed Data** - Demo user (demo@devstash.io), 5 collections (React Patterns, AI Workflows, DevOps, Terminal Commands, Design Resources), 17 items (snippets, prompts, commands, links) with bcryptjs password hashing (Completed)
- **Pro Badge Sidebar** - PRO badge on Files and Images item types in desktop and mobile sidebars using ShadCN Badge component (Completed)
- **Code Quality Quick Wins** - N+1 query fix using Prisma _count and take, database indexes for common queries, shared ICON_MAP with fallback, shared date utility, dashboard loading/error states, query limit validation (Completed)
- **Auth Setup Phase 1** - NextAuth v5 with GitHub OAuth, split auth config for edge compatibility, Prisma adapter with JWT strategy, /dashboard route protection via proxy, Session type with user.id (Completed)
- **Auth Setup Phase 2** - Credentials provider with email/password, bcrypt validation, /api/auth/register endpoint with validation (Completed)
- **Auth Setup Phase 3** - Custom sign-in and register pages, reusable UserAvatar component with image/initials fallback, sidebar user dropdown with profile link and sign out, Sonner toast notifications, dashboard uses authenticated session (Completed)
- **Email Verification** - Resend SDK integration, verification tokens on registration, verification emails, /api/auth/verify endpoint, /verify-email page, sign-in blocking for unverified users, resend functionality, edge case handling (Completed)
- **Email Verification Toggle** - SKIP_EMAIL_VERIFICATION env variable to bypass email verification during development, auto-verify on registration, skip sign-in check when enabled (Completed)
- **Rate Limiting for Auth** - Upstash Redis rate limiting on auth endpoints, reusable rate-limit utility with sliding window algorithm, protects login/register/forgot-password/reset-password/resend-verification with configurable limits, 429 responses with Retry-After header, fail-open design (Completed)
- **Items List View** - Dynamic route /items/[type] for type-filtered item lists, getItemsByType query with pinned-first sorting, responsive two-column grid using existing ItemCard, type validation with 404, empty state (Completed)
- **Item Drawer** - Right-side slide-in drawer using shadcn Sheet, opens on ItemCard click, fetches full item detail via /api/items/[id] with auth, displays type icon/badges, action bar (Favorite/Pin/Copy/Edit/Delete), content, tags, collections, dates, loading skeleton, ItemDrawerProvider context in DashboardShell, getItemById query with ownership check, PinnedSection/RecentSection switched from demo user to auth session (Completed)
- **Item Drawer Edit Mode** - Edit button toggles drawer to inline edit mode, action bar swaps to Save/Cancel, controlled inputs for title/description/content/language/URL/tags (type-gated), Zod-validated updateItem server action in src/actions/items.ts, updateItem query in src/lib/db/items.ts with full tag reconnect, toast on success/error, router.refresh() syncs card list (Completed)
