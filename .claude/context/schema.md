# Database Schema Reference

## Tables

- `profiles` - User profiles (links to auth.users)
- `jobs` - Job postings

## Key Info

- All tables use RLS policies (already configured in migrations)
- Skills stored as `text[]` array
- Foreign keys cascade on delete
- Generated types: `src/lib/types/database.ts`

## Common Queries

**Get jobs with business info:**

```typescript
.select('*, business:profiles!business_id(company_name, email)')
```

**Filter by skills:**

```typescript
.contains('skills', ['React', 'TypeScript'])
```

**Check user role:**

```typescript
const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();
```

## When You Need Details

- Full schema: Read files in `supabase/migrations/`
- Type definitions: Read `src/lib/types/database.ts`
- Query examples: Look at `src/lib/actions/*.actions.ts`
