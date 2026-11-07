// Third Party
import { beforeEach, describe, expect, it, vi } from "vitest";

// AA Geuthur React
import { baseApiClient, loadMenu, loadUserData } from "@/Api/calls";
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

    it("should throw when the request fails", async () => {
      // Test Data
      vi.spyOn(baseApiClient, "GET").mockResolvedValueOnce({
        data: undefined,
        error: { error: "Permission Denied." },
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

    it("should throw when the request fails", async () => {
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
});
