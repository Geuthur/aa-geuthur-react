// React
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

// Third Party
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// AA Geuthur React
import { AaReactProvider } from "@/Provider";

export const ProjectName = "example";
export const AppName = "aa-example";

/** Wraps children with the provider of this package, like an app does around its routing. */
export const withProvider = (children: ReactNode) => (
  <AaReactProvider projectName={ProjectName} appName={AppName}>
    {children}
  </AaReactProvider>
);

/** Provider, query client and a memory router for components that need all three. */
export const renderWrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, retryDelay: 0 }, mutations: { retry: false } },
  });
  return withProvider(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/${ProjectName}/`]}>{children}</MemoryRouter>
    </QueryClientProvider>,
  );
};
