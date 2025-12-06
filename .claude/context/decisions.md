# Architecture Decisions Log

## ADR-001: Server Components by Default

**Date:** 2024-01-01

Server components unless 'use client' required for interactivity.

**Why:** Better performance, less JavaScript, better SEO.

---

## ADR-002: Server Actions (No API Routes)

**Date:** 2024-01-01

All mutations via Server Actions. No API routes.

**Why:** Simpler code, better type safety, progressive enhancement.

---

## ADR-003: Skills as Text Array

**Date:** 2024-01-01

Store skills as PostgreSQL `text[]` with GIN index.

**Why:** Simple, fast filtering, easy queries.
**Trade-off:** No enforced vocabulary (could have "React" and "ReactJS").

---

## ADR-004: Direct Email Contact

**Date:** 2024-01-01

Display business email on job posting. No in-app applications.

**Why:** Much simpler. No notification/tracking system needed.
**Trade-off:** No application analytics.

---

## ADR-005: Supabase RLS for Authorization

**Date:** 2024-01-01

Use RLS policies for authorization. Middleware only checks authentication.

**Why:** Security at database level, can't be bypassed.
**Trade-off:** Debugging harder, need to understand PostgreSQL policies.

---

## ADR-006: No Landing Page

**Date:** 2024-01-01

Root route shows jobs immediately (remoteok.com style).

**Why:** Faster to value, simpler to build.
**Trade-off:** No place to explain platform.

---

## ADR-007: Minimal Shadcn Components

**Date:** 2024-01-01

Install only as needed. Delete if unused.

**Why:** Smaller bundle, cleaner codebase.

---

## ADR-008: TypeScript Strict Mode

**Date:** 2024-01-01

Enabled in tsconfig.json.

**Why:** Catch bugs at compile time, better IntelliSense.

---

## Template for New Decisions

```markdown
## ADR-XXX: [Title]

**Date:** YYYY-MM-DD

[One sentence decision]

**Why:** [Brief reason]
**Trade-off:** [Brief downside if any]
```
