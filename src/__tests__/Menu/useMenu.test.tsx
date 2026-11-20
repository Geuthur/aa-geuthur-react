// React
import type { ReactNode } from "react";

// Third Party
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, expectTypeOf, it, vi } from "vitest";

// AA Geuthur React
import { withProvider } from "@/__tests__/testUtils";
import * as ApiCalls from "@/Api/calls";
import type { MenuModals, ModalSchema } from "@/Api/types";
import { useMenu } from "@/Menu/Hooks";
import { AaReactProvider } from "@/Provider";

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retryDelay: 0 } } });
  return withProvider(<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>);
};

describe("useMenu", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should load the left and right menu links", async () => {
    // Test Data
    const menu = {
      left_links: [{ name: "Dashboard", link: "/" }],
      right_links: [{ name: "Settings", link: "/settings/" }],
    };
    const spy = vi.spyOn(ApiCalls, "loadMenu").mockResolvedValue(menu as never);

    // Test Action
    const { result } = renderHook(() => useMenu(), { wrapper });

    // Expected Result
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(menu);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should deliver the modals of the menu with the default type", async () => {
    // Test Data
    const modal = { title: "Create", text: "Create an example", icon: "fa-plus", modal_id: "create", url: "/create/" };
    const menu = { left_links: [], right_links: [], modals: { create_example: modal } };
    vi.spyOn(ApiCalls, "loadMenu").mockResolvedValue(menu as never);

    // Test Action
    const { result } = renderHook(() => useMenu(), { wrapper });

    // Expected Result
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.modals?.create_example).toEqual(modal);
    expectTypeOf(result.current.data?.modals).toEqualTypeOf<MenuModals | null | undefined>();
    expectTypeOf(result.current.data?.modals?.create_example).toEqualTypeOf<ModalSchema | null | undefined>();
  });

  it("should type the modals with the type of the app", async () => {
    // Test Data
    type AppMenuModals = { create_session?: { modal_id: string; url: string } | null };
    const menu = {
      left_links: [],
      right_links: [],
      modals: { create_session: { modal_id: "create-session", url: "/session/create/" } },
    };
    vi.spyOn(ApiCalls, "loadMenu").mockResolvedValue(menu as never);

    // Test Action
    const { result } = renderHook(() => useMenu<AppMenuModals>(), { wrapper });

    // Expected Result
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.modals?.create_session?.url).toBe("/session/create/");
    expectTypeOf(result.current.data?.modals).toEqualTypeOf<AppMenuModals | null | undefined>();
  });

  it("should leave the modals out for apps that do not send them", async () => {
    // Test Data
    const menu = { left_links: [{ name: "Dashboard", link: "/" }], right_links: [] };
    vi.spyOn(ApiCalls, "loadMenu").mockResolvedValue(menu as never);

    // Test Action
    const { result } = renderHook(() => useMenu(), { wrapper });

    // Expected Result
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.modals).toBeUndefined();
  });

  it("should reload the menu in the interval set on the provider", async () => {
    // Test Data
    const menu = { left_links: [{ name: "Dashboard", link: "/" }], right_links: [] };
    const spy = vi.spyOn(ApiCalls, "loadMenu").mockResolvedValue(menu as never);
    const intervalWrapper = ({ children }: { children: ReactNode }) => {
      const queryClient = new QueryClient();
      return (
        <AaReactProvider projectName="example" appName="aa-example" menuRefetchInterval={20}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </AaReactProvider>
      );
    };

    // Test Action
    renderHook(() => useMenu(), { wrapper: intervalWrapper });

    // Expected Result
    await waitFor(() => expect(spy.mock.calls.length).toBeGreaterThanOrEqual(3));
  });

  it("should not reload the menu without an interval", async () => {
    // Test Data
    const menu = { left_links: [], right_links: [] };
    const spy = vi.spyOn(ApiCalls, "loadMenu").mockResolvedValue(menu as never);

    // Test Action
    const { result } = renderHook(() => useMenu(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Expected Result
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("should retry once and then report an error when the request fails", async () => {
    // Test Data
    const spy = vi.spyOn(ApiCalls, "loadMenu").mockRejectedValue(new Error("Failed to load menu"));

    // Test Action
    const { result } = renderHook(() => useMenu(), { wrapper });

    // Expected Result
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
