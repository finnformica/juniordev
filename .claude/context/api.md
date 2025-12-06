# API Patterns Reference

## Server Actions Structure

All mutations use Server Actions in `src/lib/actions/`

**Standard pattern:**

```typescript
"use server";
// 1. Get Supabase client
// 2. Validate input (Zod)
// 3. Check auth
// 4. Perform DB operation
// 5. revalidatePath()
// 6. Return result or redirect
```

## Key Patterns

**Auth check:**

```typescript
const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) return { error: "Not authenticated" };
```

**Role check:**

```typescript
const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

if (!profile || profile.role !== "business") {
  return { error: "Unauthorized" };
}
```

**Revalidation:**

```typescript
revalidatePath("/jobs"); // After creating/updating/deleting
```

## Supabase Clients

- Server components: `import { createClient } from '@/lib/supabase/server'`
- Client components: `import { createClient } from '@/lib/supabase/client'`

## When You Need Details

Look at existing action files in `src/lib/actions/` and copy their patterns.
