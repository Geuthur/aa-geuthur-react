/**
 * Returns the message the API sent with a failed request, or `fallback` when there is none.
 *
 * `error` is the `error` of an `openapi-fetch` call. The message is the string below `error`
 * (the `ErrorSchema` of the apps, `{"error": "…"}`), otherwise the string below `detail` (answers
 * of Django Ninja itself). Everything else gives `fallback`, also the list Django Ninja sends
 * below `detail` for a validation error.
 *
 * ```ts
 * const { data, error } = await apiClient.GET("/example/api/items/");
 * if (error || !data) throw new Error(apiErrorMessage(error, "Failed to load items"));
 * ```
 */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error !== "object" || error === null) return fallback;
  const body = error as { error?: unknown; detail?: unknown };
  for (const message of [body.error, body.detail]) {
    if (typeof message === "string" && message.trim() !== "") return message;
  }
  return fallback;
}

/** Status codes of a short outage of the server, e.g. while Django restarts behind nginx. */
export const SERVICE_UNAVAILABLE_STATUSES = [502, 503, 504] as const;

/**
 * Thrown by the client of `createApiClient` for an answer with status 502, 503 or 504.
 *
 * The request does not resolve with `error` but is rejected, so `shouldRetryQuery` can retry
 * the query like a network error. Queries and mutations show the fixed message of this error.
 */
export class ServiceUnavailableError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`The server is temporarily unavailable (${status})`);
    this.name = "ServiceUnavailableError";
    this.status = status;
  }
}
