# Supabase Integration Guide

## Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xtgptccdcnmknjwicccc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_cpEw0yV6Kc1KLLT0vp4NXQ_PHEDb-OP
```

## Usage Examples

### Server Components (App Router)

```tsx
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()

  const { data: todos } = await supabase.from('todos').select()

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

### Client Components

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function ClientPage() {
  const [data, setData] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: todos } = await supabase.from('todos').select()
      setData(todos || [])
    }
    fetchData()
  }, [])

  return <div>{/* render data */}</div>
}
```

### Server Actions

```tsx
'use server'

import { createClient } from '@/lib/supabase/server'

export async function createTodo(formData: FormData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('todos')
    .insert({
      title: formData.get('title'),
    })
  
  return { data, error }
}
```

### Middleware (Session Refresh)

The middleware automatically refreshes user sessions on every request. It's already configured in `middleware.ts` at the root of the project.

## File Structure

- `server.ts` - For Server Components and Server Actions (uses cookies)
- `client.ts` - For Client Components (browser-side)
- `middleware.ts` - For middleware session refresh
- `types.ts` - TypeScript types for your database

## Key Changes from Default Setup

1. Environment variable name: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (instead of `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
2. Server client uses async/await pattern for cookies API
3. Uses `getAll()` and `setAll()` methods for better cookie handling
