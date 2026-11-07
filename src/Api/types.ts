// AA Geuthur React
import type { ModalData } from "@/Components/Base/BaseModal/BaseModalProps";

/** A link in the Alliance Auth menu, delivered by the `menu/` endpoint of the app. */
export interface MenuLink {
  name: string;
  link?: string;
  is_external?: boolean;
  /** Number of issues shown as badge next to the link. */
  badge?: number | null;
  /** Whether the badge pulses because of active errors. */
  has_errors?: boolean;
}

/** The menu of the app: links left and right of the navigation bar. */
export interface MenuSchema {
  left_links: MenuLink[];
  right_links: MenuLink[];
}

/** The current user as delivered by the `user/` endpoint of the app. */
export interface UserData {
  user_id: number;
  character_id: number;
  character_name: string;
  corporation_id: number;
  corporation_name: string;
  alliance_id?: number | null;
  alliance_name?: string | null;
  portrait?: string | null;
  is_admin: boolean;
}

/** The settings of the current user as delivered by the `settings/` endpoint of the app. */
export interface UserSettings {
  disable_notifications: boolean;
}

/** Request body of `PUT settings/`. */
export type UserSettingsUpdateRequest = UserSettings;

/** Data of a modal dialog delivered by the API (`ModalSchema` of the app). */
export type ModalSchema = ModalData;

/** Error body of the API endpoints. */
export interface ErrorSchema {
  error: string;
}

/** Response of an action endpoint. */
export interface ActionResponse {
  success: boolean;
  message: string;
}
