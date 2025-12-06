# Junior Jobs Board

Minimal job board connecting junior developers with small businesses offering experience opportunities.

**Design:** remoteok.com style - no landing page, jobs listing is homepage.

## Quick Start

```bash
# Install
npm install

# Set up Supabase locally
npx supabase start

# Create .env.local with output from above:
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Run migrations
npx supabase db reset

# Generate types
npx supabase gen types typescript --local > src/lib/types/database.ts

# Start dev server
npm run dev
```

Visit http://localhost:3000

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Supabase (Auth + PostgreSQL)
- Tailwind CSS + Shadcn/ui

## Project Structure

```
src/
  app/
    (auth)/          # login, signup
    (platform)/      # jobs, post-job, admin
  components/
    ui/              # Shadcn components
    jobs/            # Job components
  lib/
    actions/         # Server Actions (all mutations)
    supabase/        # Supabase clients (server.ts, client.ts)
    types/           # database.ts, validations.ts
supabase/
  migrations/        # Database migrations
```

## Database

**Tables:**

- `profiles` - User profiles (role: business/junior/admin)
- `jobs` - Job postings (title, role, description, skills[])

**Auth:** Supabase Auth with RLS policies on all tables.

See `supabase/migrations/` for full schema.

## User Roles

- **Junior:** Browse jobs, filter, contact businesses
- **Business:** Post jobs + junior permissions
- **Admin:** View/delete everything

## Common Commands

```bash
# Development
npm run dev

# Supabase
npx supabase migration new <name>    # New migration
npx supabase db reset                # Reset database
npx supabase gen types typescript --local > src/lib/types/database.ts

# Shadcn
npx shadcn@latest add <component>    # Add component
```

## Development Rules

1. Server components by default
2. Server Actions for mutations (no API routes)
3. Supabase RLS for authorization
4. TypeScript strict mode
5. Install Shadcn components only as needed

See `CONVENTIONS.md` for detailed standards.

## Current Status

See `TODO.md` for progress.

**Phase 1 MVP:**

- Authentication (email/password + role)
- Job listings with filtering
- Job posting (business only)
- Admin panel

**Out of Scope:**

- Payment processing
- In-app messaging
- Application tracking

## Documentation

- `CLAUDE.md` - Claude Code instructions
- `CONVENTIONS.md` - Code standards
- `TODO.md` - Task tracking
- `.claude/context/` - Technical references
