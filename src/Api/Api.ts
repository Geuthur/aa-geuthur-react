// Third Party
import Cookies from "js-cookie";
import createClient from "openapi-fetch";
import type { ClientOptions } from "openapi-fetch";

// AA Geuthur React
import { SERVICE_UNAVAILABLE_STATUSES, ServiceUnavailableError } from "@/Api/errors";

/**
 * Creates an `openapi-fetch` client for the API of the app that sends the Django CSRF token
 * (`csrftoken` cookie) as `X-CSRFToken` header with every request.
 *
 * An answer with status 502, 503 or 504 rejects the request with a `ServiceUnavailableError`
 * instead of resolving with `error`, so `shouldRetryQuery` retries the query.
 *
 * The app passes the `paths` type generated from its OpenAPI schema:
 * `export const apiClient = createApiClient<paths>();`
 */
export function createApiClient<Paths extends object>(options?: ClientOptions) {
  const client = createClient<Paths>({
    baseUrl: "/",
    credentials: "same-origin",
    ...options,
  });

  client.use({
    async onRequest({ request }) {
      const csrf = Cookies.get("csrftoken");
      if (csrf) {
        request.headers.set("X-CSRFToken", csrf);
      }
      return request;
    },
    async onResponse({ response }) {
      if ((SERVICE_UNAVAILABLE_STATUSES as readonly number[]).includes(response.status)) {
        throw new ServiceUnavailableError(response.status);
      }
      return undefined;
    },
  });

  return client;
}
