// Third Party
import Cookies from "js-cookie";
import createClient from "openapi-fetch";
import type { ClientOptions } from "openapi-fetch";

/**
 * Creates an `openapi-fetch` client for the API of the app that sends the Django CSRF token
 * (`csrftoken` cookie) as `X-CSRFToken` header with every request.
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
  });

  return client;
}
