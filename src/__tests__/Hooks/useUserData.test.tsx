// React
import type { ReactNode } from "react";

// Third Party
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// AA Geuthur React
import { withProvider } from "@/__tests__/testUtils";
import * as ApiCalls from "@/Api/calls";
import type { UserData } from "@/Api/types";
import { useUserData } from "@/Hooks/useUserData";

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return withProvider(<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>);
};

describe("useUserData", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should load the user data", async () => {
    // Test Data
    const userData = { user: { is_superuser: true } };
    const spy = vi.spyOn(ApiCalls, "loadUserData").mockResolvedValue(userData as never);

    // Test Action
    const { result } = renderHook(() => useUserData(), { wrapper });

    // Expected Result
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(userData);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should type app fields beyond the UserData contract", async () => {
    // Test Data
    type AppUserData = UserData & { is_superuser: boolean };
    const user: AppUserData = {
      user_id: 1,
      character_id: 42,
      character_name: "Test Pilot",
      corporation_id: 7,
      corporation_name: "Corp",
      is_admin: true,
      is_superuser: false,
    };
    vi.spyOn(ApiCalls, "loadUserData").mockResolvedValue({ user } as never);

    // Test Action
    const { result } = renderHook(() => useUserData<AppUserData>(), { wrapper });

    // Expected Result
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.user.is_superuser).toBe(false);
    expect(result.current.data?.user.is_admin).toBe(true);
  });

  it("should report an error when the request fails", async () => {
    // Test Data
    vi.spyOn(ApiCalls, "loadUserData").mockRejectedValue(new Error("Failed to load user data"));

    // Test Action
    const { result } = renderHook(() => useUserData(), { wrapper });

    // Expected Result
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
