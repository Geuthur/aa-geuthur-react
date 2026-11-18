// React
import type { ReactNode } from "react";

// Third Party
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// AA Geuthur React
import { ProjectName, withProvider } from "@/__tests__/testUtils";
import * as ApiCalls from "@/Api/calls";
import { queryKeys } from "@/Api/query";
import type { UserSettings } from "@/Api/types";
import { useUserSettings } from "@/Hooks/useUserSettings";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) =>
    withProvider(<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>);
  return { queryClient, wrapper };
};

/** A promise that the test settles itself, to look at the cache while the request is pending. */
const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe("useUserSettings", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should load the settings of the project", async () => {
    // Test Data
    const load = vi.spyOn(ApiCalls, "loadUserSettings").mockResolvedValue({ disable_notifications: true });
    const { wrapper } = createWrapper();

    // Test Action
    const { result } = renderHook(() => useUserSettings(), { wrapper });

    // Expected Result
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ disable_notifications: true });
    expect(load).toHaveBeenCalledWith(ProjectName);
  });

  it("should report an error when loading fails", async () => {
    // Test Data
    vi.spyOn(ApiCalls, "loadUserSettings").mockRejectedValue(new Error("Failed to load user settings"));
    const { wrapper } = createWrapper();

    // Test Action
    const { result } = renderHook(() => useUserSettings(), { wrapper });

    // Expected Result
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it("should show the new settings at once and store the answer of the API", async () => {
    // Test Data
    vi.spyOn(ApiCalls, "loadUserSettings").mockResolvedValue({ disable_notifications: false });
    const request = deferred<UserSettings>();
    const update = vi.spyOn(ApiCalls, "updateUserSettings").mockReturnValue(request.promise);
    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useUserSettings(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Test Action
    act(() => result.current.updateMutation.mutate({ disable_notifications: true }));

    // Expected Result
    await waitFor(() => expect(result.current.data).toEqual({ disable_notifications: true }));
    expect(result.current.updateMutation.isPending).toBe(true);
    expect(update).toHaveBeenCalledWith(ProjectName, { disable_notifications: true });

    await act(async () => request.resolve({ disable_notifications: true }));
    await waitFor(() => expect(result.current.updateMutation.isSuccess).toBe(true));
    expect(queryClient.getQueryData(queryKeys.UserSettings)).toEqual({ disable_notifications: true });
  });

  it("should restore the previous settings when saving fails", async () => {
    // Test Data
    vi.spyOn(ApiCalls, "loadUserSettings").mockResolvedValue({ disable_notifications: false });
    const request = deferred<UserSettings>();
    vi.spyOn(ApiCalls, "updateUserSettings").mockReturnValue(request.promise);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useUserSettings(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Test Action
    act(() => result.current.updateMutation.mutate({ disable_notifications: true }));
    await waitFor(() => expect(result.current.data).toEqual({ disable_notifications: true }));
    await act(async () => request.reject(new Error("Failed to update user settings")));

    // Expected Result
    await waitFor(() => expect(result.current.updateMutation.isError).toBe(true));
    expect(result.current.data).toEqual({ disable_notifications: false });
    expect(result.current.updateMutation.error?.message).toBe("Failed to update user settings");
  });

  it("should type app fields and merge a request with single fields into the loaded settings", async () => {
    // Test Data
    type AppSettings = UserSettings & { quick_select_presets: number[] };
    type AppSettingsUpdate = { disable_notifications?: boolean | null; quick_select_presets?: number[] | null };
    vi.spyOn(ApiCalls, "loadUserSettings").mockResolvedValue({
      disable_notifications: true,
      quick_select_presets: [1],
    } as never);
    const request = deferred<AppSettings>();
    vi.spyOn(ApiCalls, "updateUserSettings").mockReturnValue(request.promise as never);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useUserSettings<AppSettings, AppSettingsUpdate>(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Test Action
    act(() => result.current.updateMutation.mutate({ quick_select_presets: [2, 3] }));

    // Expected Result
    await waitFor(() => expect(result.current.data?.quick_select_presets).toEqual([2, 3]));
    expect(result.current.data?.disable_notifications).toBe(true);

    await act(async () => request.resolve({ disable_notifications: true, quick_select_presets: [2, 3] }));
    await waitFor(() => expect(result.current.updateMutation.isSuccess).toBe(true));
  });
});
