// React
import type { ReactNode } from "react";

// Third Party
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// AA Geuthur React
import { useApproveMutation, useFormApproveMutation } from "@/Components/Base/BaseModal/BaseModalQuery";

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

function mockResponse(body: unknown, ok = false) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok, json: async () => body }));
}

const hooks = [
  { name: "useApproveMutation", run: () => renderHook(() => useApproveMutation(), { wrapper }), arg: "/api/x/" },
  {
    name: "useFormApproveMutation",
    run: () => renderHook(() => useFormApproveMutation(), { wrapper }),
    arg: { url: "/api/x/", formData: { a: "b" } },
  },
] as const;

describe.each(hooks)("$name", ({ run, arg }) => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function failWith(body: unknown) {
    mockResponse(body);
    const { result } = run();
    result.current.mutate(arg as never);
    await waitFor(() => expect(result.current.isError).toBe(true));
    return (result.current.error as Error).message;
  }

  it("should show the error of the API", async () => {
    expect(await failWith({ error: "Not allowed" })).toBe("Not allowed");
  });

  it("should still show message of older answers", async () => {
    expect(await failWith({ success: false, message: "Old text" })).toBe("Old text");
  });

  it("should prefer error over message", async () => {
    expect(await failWith({ error: "New", message: "Old" })).toBe("New");
  });

  it("should show the fixed text without error or message", async () => {
    expect(await failWith({})).toBe("Unknown error");
  });

  it("should resolve on success", async () => {
    mockResponse({ success: true }, true);
    const { result } = run();
    result.current.mutate(arg as never);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
