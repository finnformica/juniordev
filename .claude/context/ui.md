# UI Components Reference

## Component Rules

- Server components by default (no 'use client')
- Client components only for: onClick, onChange, useState, useEffect, browser APIs
- Follow patterns from existing components in `src/components/`

## Installed Shadcn Components

Check `src/components/ui/` directory for current list.
Install only as needed: `npx shadcn@latest add <component>`

## Common Patterns

**Server component:**

```typescript
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}
```

**Client component with form:**

```typescript
"use client";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Submit</button>;
}

export function Form() {
  return <form action={serverAction}>...</form>;
}
```

## Styling Conventions

- Tailwind utility classes only
- Mobile-first: `className="text-sm md:text-base lg:text-lg"`
- Container: `className="container mx-auto px-4"`
- Card spacing: `className="space-y-4"`
- Grid: `className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"`

## Design Style

- Minimal (remoteok.com aesthetic)
- Black/white/greys + blue accent
- No unnecessary decoration

## When You Need Details

- Look at existing components in `src/components/` for patterns
- Shadcn docs: ui.shadcn.com
