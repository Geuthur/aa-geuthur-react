// AA Geuthur React
import { createApiClient } from "@/Api/Api";
import type { BasePaths } from "@/Api/basePaths";
import type { MenuSchema, UserData } from "@/Api/types";

/** Client for the endpoints every app provides (`menu/`, `user/`). */
export const baseApiClient = createApiClient<BasePaths>();

/** Loads the menu links of the app. */
export async function loadMenu(projectName: string): Promise<MenuSchema> {
  const { data, error } = await baseApiClient.GET("/{project}/api/menu/", {
    params: { path: { project: projectName } },
  });
  if (error || !data) {
    throw new Error("Failed to load menu");
  }
  return data;
}

/** Loads the current user of the app. */
export async function loadUserData(projectName: string): Promise<{ user: UserData }> {
  const { data, error } = await baseApiClient.GET("/{project}/api/user/", {
    params: { path: { project: projectName } },
  });
  if (error || !data) {
    throw new Error("Failed to load user data");
  }
  return { user: data };
}
