# junior.dev - Setup Instructions

## ✅ Completed Setup

The following has been completed:

1. **Dependencies installed:**

   - @supabase/supabase-js & @supabase/ssr for database
   - zod for validation
   - shadcn/ui initialized with Tailwind v4

2. **Supabase configuration:**

   - Server client: `src/lib/supabase/server.ts`
   - Client component client: `src/lib/supabase/client.ts`

3. **Database migrations created:**

   - `supabase/migrations/20240101000000_create_profiles.sql`
   - `supabase/migrations/20240101000001_create_jobs.sql`
   - Includes comprehensive RLS policies

4. **Middleware configured:**

   - Auth protection for protected routes
   - Redirects authenticated users away from auth pages

5. **Folder structure created:**

   - `src/app/(auth)/` - Login and signup pages
   - `src/app/(platform)/` - Jobs listing (homepage)
   - `src/lib/actions/` - Server Actions directory
   - `src/lib/types/` - TypeScript types

6. **Environment template:**
   - `.env.local.example` created

## 📋 Next Steps

### 1. Set up Supabase Project

1. Create a new project at [app.supabase.com](https://app.supabase.com)
2. Copy `.env.local.example` to `.env.local`
3. Add your Supabase URL and anon key from project settings

### 2. Initialize Supabase CLI (optional but recommended)

```bash
npx supabase init
npx supabase link --project-ref YOUR_PROJECT_REF
```

### 3. Run Migrations

Either:

- Push migrations via Supabase CLI: `npx supabase db push`
- Or run them manually in Supabase SQL editor

### 4. Generate TypeScript Types

After migrations are applied:

```bash
npx supabase gen types typescript --local > src/lib/types/database.ts
```

### 5. Start Development

```bash
npm run dev
```

Visit http://localhost:3000 - it will redirect to /jobs

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (platform)/
│   │   └── jobs/
│   └── page.tsx (redirects to /jobs)
├── lib/
│   ├── supabase/
│   │   ├── server.ts
│   │   └── client.ts
│   ├── actions/ (Server Actions)
│   └── types/
│       └── database.ts
└── middleware.ts

supabase/
└── migrations/
    ├── 20240101000000_create_profiles.sql
    └── 20240101000001_create_jobs.sql
```

## 🔑 Key Design Decisions

- **Server Components by default** - Use 'use client' only when needed
- **Server Actions for mutations** - No API routes
- **Supabase RLS for authorization** - Security at database level
- **No landing page** - Jobs listing is the homepage (RemoteOK style)
- **TypeScript strict mode** enabled
- **Minimal Shadcn components** - Install as needed

## 📚 Reference Files

- `CLAUDE.md` - Project rules and conventions
- `TODO.md` - Current priorities
- `CONVENTIONS.md` - Code standards
- `.claude/context/` - Architecture decisions and patterns
