"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create a client - we use useState to ensure it's only created once per user session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // How long data stays fresh before refetching (5 minutes)
            staleTime: 5 * 60 * 1000,
            // How long unused data stays in cache (10 minutes)
            gcTime: 10 * 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools - only shows in development, helps you visualize queries */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
