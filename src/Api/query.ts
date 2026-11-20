// Third Party
import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

// AA Geuthur React
import { ServiceUnavailableError } from "@/Api/errors";

/** Query keys of the endpoints every app provides. Apps add their own keys next to them. */
export const queryKeys = {
  Menu: ["Menu"] as const,
  User: ["User"] as const,
  UserSettings: ["UserSettings"] as const,
};

/** How often a query is retried after a network error or a short outage of the server. */
export const QUERY_NETWORK_RETRIES = 3;

/**
 * Retry rule for queries: only network errors and short outages of the server are retried.
 *
 * `fetch` throws a `TypeError` when the server cannot be reached, the client of
 * `createApiClient` throws a `ServiceUnavailableError` for 502, 503 and 504 (e.g. while
 * Django restarts behind nginx). Every other answer of the server (4xx and 500) becomes a
 * normal `Error` in the query functions of the apps and is shown at once, so a missing
 * permission or an unknown ID does not wait for three retries.
 */
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  const retryable = error instanceof TypeError || error instanceof ServiceUnavailableError;
  return retryable && failureCount < QUERY_NETWORK_RETRIES;
}

/**
 * Creates the `QueryClient` of an app with the retry rule `shouldRetryQuery` for queries.
 * The given `defaultOptions` are merged, values of the app win.
 */
export function createQueryClient(config: QueryClientConfig = {}): QueryClient {
  const { defaultOptions, ...rest } = config;
  return new QueryClient({
    ...rest,
    defaultOptions: {
      ...defaultOptions,
      queries: {
        retry: shouldRetryQuery,
        ...defaultOptions?.queries,
      },
    },
  });
}
