// AA Geuthur React
import { createApiClient } from "@/Api/Api";
import type { BasePaths } from "@/Api/basePaths";
import { apiErrorMessage } from "@/Api/errors";
import type { MenuModals, MenuSchema, UserData, UserSettings, UserSettingsUpdateRequest } from "@/Api/types";

/** Client for the endpoints every app provides (`menu/`, `user/`) and the optional `settings/`. */
export const baseApiClient = createApiClient<BasePaths>();

/**
 * Loads the menu links and, if the app sends them, the menu modals.
 *
 * An app with its own menu modals passes their type: `loadMenu<{ create_session?: AppModal | null }>("beltradar")`.
 */
export async function loadMenu<TModals extends object = MenuModals>(
  projectName: string,
): Promise<MenuSchema<TModals>> {
  const { data, error } = await baseApiClient.GET("/{project}/api/menu/", {
    params: { path: { project: projectName } },
  });
  if (error || !data) {
    throw new Error(apiErrorMessage(error, "Failed to load menu"));
  }
  return data as MenuSchema<TModals>;
}

/**
 * Loads the current user of the app.
 *
 * An app whose `user/` endpoint delivers more than the `UserData` contract passes its own type:
 * `loadUserData<UserData & { is_superuser: boolean }>("example")`.
 */
export async function loadUserData<T extends UserData = UserData>(
  projectName: string,
): Promise<{ user: T }> {
  const { data, error } = await baseApiClient.GET("/{project}/api/user/", {
    params: { path: { project: projectName } },
  });
  if (error || !data) {
    throw new Error(apiErrorMessage(error, "Failed to load user data"));
  }
  return { user: data as T };
}

/**
 * Loads the settings of the current user (`GET settings/`).
 *
 * An app whose `settings/` endpoint delivers more than the `UserSettings` contract passes its own type:
 * `loadUserSettings<UserSettings & { quick_select_presets: number[] }>("example")`.
 */
export async function loadUserSettings<T extends UserSettings = UserSettings>(projectName: string): Promise<T> {
  const { data, error } = await baseApiClient.GET("/{project}/api/settings/", {
    params: { path: { project: projectName } },
  });
  if (error || !data) {
    throw new Error(apiErrorMessage(error, "Failed to load user settings"));
  }
  return data as T;
}

/**
 * Saves the settings of the current user (`PUT settings/`) and returns the saved settings.
 *
 * `T` is the type the endpoint answers with, `Body` the request body when it differs from `T`
 * (e.g. an endpoint that takes single fields).
 */
export async function updateUserSettings<T extends UserSettings = UserSettings, Body extends object = T>(
  projectName: string,
  settings: Body,
): Promise<T> {
  const { data, error } = await baseApiClient.PUT("/{project}/api/settings/", {
    params: { path: { project: projectName } },
    body: settings as unknown as UserSettingsUpdateRequest,
  });
  if (error || !data) {
    throw new Error(apiErrorMessage(error, "Failed to update user settings"));
  }
  return data as T;
}
