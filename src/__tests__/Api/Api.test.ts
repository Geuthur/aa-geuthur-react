// Third Party
import Cookies from "js-cookie";
import { afterEach, describe, expect, it, vi } from "vitest";

// AA Geuthur React
import { createApiClient } from "@/Api/Api";

interface paths {
  "/example/api/ping/": {
    get: {
      parameters: { query?: never; header?: never; path?: never; cookie?: never };
      requestBody?: never;
      responses: { 200: { headers: { [name: string]: unknown }; content: { "application/json": { ok: boolean } } } };
    };
  };
}

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), { status: 200, headers: { "Content-Type": "application/json" } });

describe("createApiClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should send the CSRF token from the cookie with every request", async () => {
    // Test Data
    vi.spyOn(Cookies, "get").mockReturnValue("token-123" as never);
    const fetchSpy = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    const client = createApiClient<paths>({ baseUrl: "http://localhost", fetch: fetchSpy });

    // Test Action
    const { data } = await client.GET("/example/api/ping/");

    // Expected Result
    expect(data).toEqual({ ok: true });
    const request = fetchSpy.mock.calls[0][0] as Request;
    expect(request.url).toBe("http://localhost/example/api/ping/");
    expect(request.headers.get("X-CSRFToken")).toBe("token-123");
    expect(request.credentials).toBe("same-origin");
  });

  it("should not set the header without a cookie", async () => {
    // Test Data
    vi.spyOn(Cookies, "get").mockReturnValue(undefined as never);
    const fetchSpy = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    const client = createApiClient<paths>({ baseUrl: "http://localhost", fetch: fetchSpy });

    // Test Action
    await client.GET("/example/api/ping/");

    // Expected Result
    const request = fetchSpy.mock.calls[0][0] as Request;
    expect(request.headers.get("X-CSRFToken")).toBeNull();
  });
});
