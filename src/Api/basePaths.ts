// AA Geuthur React
import type { ErrorSchema, MenuSchema, UserData, UserSettings, UserSettingsUpdateRequest } from "@/Api/types";

type JsonResponse<T> = {
  headers: { [name: string]: unknown };
  content: { "application/json": T };
};

type ProjectGet<T> = {
  parameters: { query?: never; header?: never; path: { project: string }; cookie?: never };
  requestBody?: never;
  responses: { 200: JsonResponse<T>; 403: JsonResponse<ErrorSchema> };
};

type ProjectPut<Body, T> = {
  parameters: { query?: never; header?: never; path: { project: string }; cookie?: never };
  requestBody: { content: { "application/json": Body } };
  responses: { 200: JsonResponse<T>; 403: JsonResponse<ErrorSchema> };
};

/**
 * The endpoints every app provides, with the app's URL prefix as path parameter. `settings/` is
 * optional in an app; only apps with user settings call it.
 */
export interface BasePaths {
  "/{project}/api/menu/": { get: ProjectGet<MenuSchema> };
  "/{project}/api/user/": { get: ProjectGet<UserData> };
  "/{project}/api/settings/": {
    get: ProjectGet<UserSettings>;
    put: ProjectPut<UserSettingsUpdateRequest, UserSettings>;
  };
}
