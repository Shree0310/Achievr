# Advanced Next.js Patterns

## Component Composition

### Passing Server Components to Client Components

```tsx
// ✅ Correct: Pass Server Component as children
// ServerComponent.tsx (no directive)
async function ServerData() {
  const data = await fetchData();
  return <div>{data.content}</div>;
}

// ClientWrapper.tsx
'use client';
export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && children}
    </div>
  );
}

// Page.tsx
export default function Page() {
  return (
    <ClientWrapper>
      <ServerData /> {/* Server Component passed as children */}
    </ClientWrapper>
  );
}
```

### Interleaving Pattern

```tsx
// Server Component wrapping Client wrapping Server
export default async function Page() {
  const user = await getUser();
  return (
    <Dashboard user={user}>          {/* Server */}
      <Sidebar>                       {/* Client */}
        <NavigationItems />           {/* Server - passed as children */}
      </Sidebar>
    </Dashboard>
  );
}
```

## Parallel Routes

```
app/
├── @modal/
│   └── (.)photo/[id]/page.tsx  # Intercepted modal
├── @sidebar/
│   └── page.tsx                 # Parallel sidebar
├── layout.tsx                   # Receives both as props
└── page.tsx
```

```tsx
// layout.tsx with parallel routes
export default function Layout({
  children,
  modal,
  sidebar,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside>{sidebar}</aside>
      <main>{children}</main>
      {modal}
    </div>
  );
}
```

## Streaming with Suspense

```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Streams independently */}
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <Chart />
      </Suspense>
    </div>
  );
}

// Each component fetches its own data
async function Stats() {
  const stats = await getStats(); // Doesn't block Chart
  return <StatsDisplay data={stats} />;
}
```

## Route Groups

```
app/
├── (marketing)/        # Group without affecting URL
│   ├── layout.tsx      # Marketing-specific layout
│   ├── about/page.tsx  # /about
│   └── contact/page.tsx # /contact
├── (app)/              # App-specific group
│   ├── layout.tsx      # App layout with auth
│   └── dashboard/page.tsx # /dashboard
└── layout.tsx          # Root layout
```

## Middleware Patterns

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Locale detection
  const locale = getLocale(request);
  if (!pathname.startsWith(`/${locale}`)) {
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Error Boundaries

```tsx
// error.tsx - Must be Client Component
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

## Loading States

```tsx
// loading.tsx - Automatic Suspense boundary
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  );
}
```
