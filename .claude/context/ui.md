# UI Components Reference

## Component Rules

- Server components by default (no 'use client')
- Client components only for: onClick, onChange, useState, useEffect, browser APIs
- Follow patterns from existing components in `src/components/`

## Installed Shadcn Components

**Currently:** None installed yet (install as needed)

Install only as needed: `npx shadcn@latest add <component>`

**Likely components needed for MVP:**

- `button` - Submit buttons, navigation
- `input` - Form inputs
- `form` - Job posting form
- `card` - Job listings
- `badge` - Skills tags
- `select` - Role selection dropdown

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
import { useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Submit</button>;
}

export function Form() {
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    field1: "",
    field2: "",
    // ... all form fields
  });

  async function handleSubmit(formDataFromForm: FormData) {
    setError(null);

    // Extract and preserve form values
    const field1 = formDataFromForm.get("field1") as string;
    const field2 = formDataFromForm.get("field2") as string;

    setFormData({ field1, field2 });

    const result = await serverAction(formDataFromForm);
    if (result && "error" in result) {
      setError(result.error || "An error occurred");
    }
  }

  return (
    <form action={handleSubmit}>
      <input
        name="field1"
        value={formData.field1}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, field1: e.target.value }))
        }
      />

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
```

## Form Standards

**ALL forms MUST preserve user input on validation errors:**

- Use controlled components with `value` and `onChange`
- Extract form values before server action call
- Update component state to preserve values
- Display errors without clearing form fields
- Convert `null` FormData values to `undefined` for optional fields

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
