// Third Party
import { beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";

// AA Geuthur React
import { baseApiClient, loadMenu, loadUserData, loadUserSettings, updateUserSettings } from "@/Api/calls";
import { queryKeys } from "@/Api/query";

describe("API calls of the base endpoints", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should provide the query keys of the base endpoints", () => {
    // Test Action & Expected Result
    expect(queryKeys.Menu).toEqual(["Menu"]);
    expect(queryKeys.User).toEqual(["User"]);
    expect(queryKeys.UserSettings).toEqual(["UserSettings"]);
  });

  describe("loadMenu", () => {
    it("should request the menu below the project prefix", async () => {
      // Test Data
      const menu = { left_links: [{ name: "Dashboard", link: "/" }], right_links: [] };
      vi.spyOn(baseApiClient, "GET").mockResolvedValueOnce({
        data: menu,
        error: undefined,
        response: new Response(),
      } as never);

      // Test Action
      const result = await loadMenu("example");

      // Expected Result
      expect(result).toEqual(menu);
      expect(baseApiClient.GET).toHaveBeenCalledWith("/{project}/api/menu/", {
        params: { path: { project: "example" } },
      });
    });

    it("should return the modals of the menu when the app sends them", async () => {
      // Test Data
      const menu = {
        left_links: [],
        right_links: [],
        modals: { create_session: { modal_id: "create-session", url: "/beltradar/api/session/create/" } },
      };
      vi.spyOn(baseApiClient, "GET").mockResolvedValueOnce({
        data: menu,
        error: undefined,
        response: new Response(),
      } as never);

      // Test Action
      const result = await loadMenu<{ create_session?: { modal_id: string; url: string } | null }>("beltradar");

      // Expected Result
      expect(result.modals?.create_session).toEqual(menu.modals.create_session);
      expectTypeOf(result.modals).toEqualTypeOf<
        { create_session?: { modal_id: string; url: string } | null } | null | undefined
      >();
    });

    it("should throw the message of the API when the request fails", async () => {
      // Test Data
      vi.spyOn(baseApiClient, "GET").mockResolvedValueOnce({
        data: undefined,
        error: { error: "Permission Denied." },
        response: new Response(),
      } as never);

      // Test Action & Expected Result
      await expect(loadMenu("example")).rejects.toThrow("Permission Denied.");
    });

    it("should throw the fixed text when the answer has no data and no error", async () => {
      // Test Data
      vi.spyOn(baseApiClient, "GET").mockResolvedValueOnce({
        data: undefined,
        error: undefined,
        response: new Response(),
      } as never);

      // Test Action & Expected Result
      await expect(loadMenu("example")).rejects.toThrow("Failed to load menu");
    });
  });

  describe("loadUserData", () => {
    it("should wrap the user data below the project prefix", async () => {
      // Test Data
      const user = { user_id: 1, character_id: 42, character_name: "Test Pilot" };
      vi.spyOn(baseApiClient, "GET").mockResolvedValueOnce({
        data: user,
        error: undefined,
        response: new Response(),
      } as never);

      // Test Action
      const result = await loadUserData("example");

      // Expected Result
      expect(result).toEqual({ user });
      expect(baseApiClient.GET).toHaveBeenCalledWith("/{project}/api/user/", {
        params: { path: { project: "example" } },
      });
    });

    it("should throw the fixed text when the API sends no message", async () => {
      // Test Data
      vi.spyOn(baseApiClient, "GET").mockResolvedValueOnce({
        data: undefined,
        error: { status: 500 },
        response: new Response(),
      } as never);

      // Test Action & Expected Result
      await expect(loadUserData("example")).rejects.toThrow("Failed to load user data");
    });
  });

  describe("loadUserSettings", () => {
    it("should request the settings below the project prefix", async () => {
      // Test Data
      const settings = { disable_notifications: true };
      vi.spyOn(baseApiClient, "GET").mockResolvedValueOnce({
        data: settings,
        error: undefined,
        response: new Response(),
      } as never);

      // Test Action
      const result = await loadUserSettings("example");

      // Expected Result
      expect(result).toEqual(settings);
      expect(baseApiClient.GET).toHaveBeenCalledWith("/{project}/api/settings/", {
        params: { path: { project: "example" } },
      });
    });

    it("should throw the message of Django Ninja when the request fails", async () => {
      // Test Data
      vi.spyOn(baseApiClient, "GET").mockResolvedValueOnce({
        data: undefined,
        error: { detail: "Unauthorized" },
        response: new Response(),
      } as never);

      // Test Action & Expected Result
      await expect(loadUserSettings("example")).rejects.toThrow("Unauthorized");
    });
  });

  describe("updateUserSettings", () => {
    it("should put the settings below the project prefix and return the saved settings", async () => {
      // Test Data
      const saved = { disable_notifications: true, quick_select_presets: [2] };
      vi.spyOn(baseApiClient, "PUT").mockResolvedValueOnce({
        data: saved,
        error: undefined,
        response: new Response(),
      } as never);

      // Test Action
      const result = await updateUserSettings<typeof saved, { quick_select_presets: number[] }>("example", {
        quick_select_presets: [2],
      });

      // Expected Result
      expect(result).toEqual(saved);
      expect(baseApiClient.PUT).toHaveBeenCalledWith("/{project}/api/settings/", {
        params: { path: { project: "example" } },
        body: { quick_select_presets: [2] },
      });
    });

    it("should throw the message of the API when the request fails", async () => {
      // Test Data
      vi.spyOn(baseApiClient, "PUT").mockResolvedValueOnce({
        data: undefined,
        error: { error: "Permission Denied." },
        response: new Response(),
      } as never);

      // Test Action & Expected Result
      await expect(updateUserSettings("example", { disable_notifications: true })).rejects.toThrow(
        "Permission Denied.",
      );
    });

    it("should throw the fixed text for a validation error", async () => {
      // Test Data
      vi.spyOn(baseApiClient, "PUT").mockResolvedValueOnce({
        data: undefined,
        error: { detail: [{ type: "missing", loc: ["body", "settings"], msg: "Field required" }] },
        response: new Response(),
      } as never);

      // Test Action & Expected Result
      await expect(updateUserSettings("example", { disable_notifications: true })).rejects.toThrow(
        "Failed to update user settings",
      );
    });
  });
});
