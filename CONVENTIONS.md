# Code Conventions

## File Naming

- Components: PascalCase (`JobCard.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Actions: camelCase with suffix (`createJob.action.ts`)

## TypeScript

- Strict mode enabled
- No `any` types (use `unknown` if truly dynamic)
- Import types: `import type { User } from '@/lib/types'`

## Components

- Default exports for pages/components
- Named exports for utilities
- Props destructuring in signature

## Imports

```typescript
// External packages
import { useState } from "react";

// Internal modules
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

// Types
import type { Database } from "@/lib/types/database";
```

## Supabase

- Server: `createClient` from `@/lib/supabase/server`
- Client: `createClient` from `@/lib/supabase/client`
- Always handle errors: `if (error) return { error: error.message }`

## Forms

- Use Server Actions
- Zod for validation
- useFormStatus for pending state
- Progressive enhancement (works without JS)
- Must preserve user input on validation errors
- Always use controlled components with state
- Convert FormData null values to undefined for optional fields

## Styling

- Tailwind utilities only
- No custom CSS files
- Mobile-first responsive
- Use Shadcn variants when available

## Git Commits

- `feat: add job posting form`
- `fix: correct RLS policy for job deletion`
- `chore: remove unused Badge component`

```

## Project Structure Visualization
```

project-root/
├── CLAUDE.md # 52 lines - main context
├── TODO.md # Track progress
├── CONVENTIONS.md # Code standards
├── .claude/
│ └── context/
│ ├── schema.md # 31 lines - DB reference
│ ├── api.md # 40 lines - API patterns
│ ├── ui.md # 45 lines - UI patterns
│ └── decisions.md # 70 lines - ADRs
├── src/
│ ├── app/
│ ├── components/
│ └── lib/
├── supabase/
│ └── migrations/
└── package.json
