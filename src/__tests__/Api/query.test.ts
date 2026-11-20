// Third Party
import { describe, expect, it } from "vitest";

// AA Geuthur React
import { ServiceUnavailableError } from "@/Api/errors";
import { createQueryClient, QUERY_NETWORK_RETRIES, shouldRetryQuery } from "@/Api/query";

describe("shouldRetryQuery", () => {
  it("retries network errors up to the limit", () => {
    const error = new TypeError("Failed to fetch");
    for (let count = 0; count < QUERY_NETWORK_RETRIES; count++) {
      expect(shouldRetryQuery(count, error)).toBe(true);
    }
    expect(shouldRetryQuery(QUERY_NETWORK_RETRIES, error)).toBe(false);
  });

  it("retries short outages of the server up to the limit", () => {
    for (const status of [502, 503, 504]) {
      const error = new ServiceUnavailableError(status);
      for (let count = 0; count < QUERY_NETWORK_RETRIES; count++) {
        expect(shouldRetryQuery(count, error)).toBe(true);
      }
      expect(shouldRetryQuery(QUERY_NETWORK_RETRIES, error)).toBe(false);
    }
  });

  it("does not retry answers of the server", () => {
    expect(shouldRetryQuery(0, new Error("Permission denied"))).toBe(false);
  });

  it("does not retry values that are no errors", () => {
    expect(shouldRetryQuery(0, "Failed")).toBe(false);
  });
});

describe("createQueryClient", () => {
  it("uses the retry rule for queries", () => {
    const client = createQueryClient();
    expect(client.getDefaultOptions().queries?.retry).toBe(shouldRetryQuery);
  });

  it("keeps the options of the app", () => {
    const client = createQueryClient({
      defaultOptions: {
        queries: { staleTime: 5000, refetchOnWindowFocus: false },
        mutations: { retry: 1 },
      },
    });
    const options = client.getDefaultOptions();
    expect(options.queries?.retry).toBe(shouldRetryQuery);
    expect(options.queries?.staleTime).toBe(5000);
    expect(options.queries?.refetchOnWindowFocus).toBe(false);
    expect(options.mutations?.retry).toBe(1);
  });

  it("lets the app override the retry rule", () => {
    const client = createQueryClient({ defaultOptions: { queries: { retry: false } } });
    expect(client.getDefaultOptions().queries?.retry).toBe(false);
  });

  it("shows an answer of the server without retry", async () => {
    const client = createQueryClient();
    let calls = 0;
    await expect(
      client.fetchQuery({
        queryKey: ["test"],
        queryFn: () => {
          calls++;
          throw new Error("Not found");
        },
      }),
    ).rejects.toThrow("Not found");
    expect(calls).toBe(1);
  });

  it("retries a network error", async () => {
    const client = createQueryClient({ defaultOptions: { queries: { retryDelay: 0 } } });
    let calls = 0;
    await expect(
      client.fetchQuery({
        queryKey: ["network"],
        queryFn: () => {
          calls++;
          throw new TypeError("Failed to fetch");
        },
      }),
    ).rejects.toThrow("Failed to fetch");
    expect(calls).toBe(QUERY_NETWORK_RETRIES + 1);
  });

  it("retries a short outage of the server", async () => {
    const client = createQueryClient({ defaultOptions: { queries: { retryDelay: 0 } } });
    let calls = 0;
    await expect(
      client.fetchQuery({
        queryKey: ["outage"],
        queryFn: () => {
          calls++;
          throw new ServiceUnavailableError(503);
        },
      }),
    ).rejects.toBeInstanceOf(ServiceUnavailableError);
    expect(calls).toBe(QUERY_NETWORK_RETRIES + 1);
  });
});
