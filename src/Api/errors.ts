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
