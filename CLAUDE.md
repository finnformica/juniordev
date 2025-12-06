# Junior Jobs Board

## Project

Job board connecting junior developers with small businesses offering unpaid/low-paid experience opportunities.
Design: remoteok.com style - no landing page, jobs listing is homepage.

## Stack

- Next.js 16 (App Router) + TypeScript (strict mode)
- Supabase (Auth + PostgreSQL with RLS)
- Tailwind CSS + Shadcn/ui (install only as needed)

## Directory Structure

- `src/app/(auth)/` - Authentication pages (login, signup)
- `src/app/(platform)/` - Main application (jobs, post-job, admin)
- `src/components/ui/` - Shadcn components ONLY
- `src/lib/actions/` - Server Actions (all mutations)
- `src/lib/supabase/` - Supabase client utilities
- `supabase/migrations/` - Database migrations

## Critical Rules

1. Server components by default, 'use client' only when interactive
2. All mutations use Server Actions (NO API routes)
3. Supabase RLS policies handle authorization (not middleware)
4. Install Shadcn components as needed, delete if unused
5. TypeScript strict mode - no 'any' types
6. Zod for form validation

## Essential Commands

- `npm run dev` - Start development server
- `npx supabase migration new <name>` - Create new migration
- `npx supabase gen types typescript --local > src/lib/types/database.ts` - Generate types
- `npx shadcn@latest add <component>` - Add Shadcn component

## Development Workflow

1. Check @TODO.md for current priorities
2. Read @CONVENTIONS.md for code standards
3. Read existing code in relevant directory before writing new code
4. Follow patterns from existing files (don't create new patterns)

## Context References (Read When Working On)

- Database work: @.claude/context/schema.md
- API/Actions: @.claude/context/api.md
- UI/Components: @.claude/context/ui.md
- Architecture decisions: @.claude/context/decisions.md

## Out of Scope (Phase 1)

- Payment processing
- In-app messaging
- Application tracking system
- Deployment configuration
