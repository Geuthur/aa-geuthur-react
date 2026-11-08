// Third Party
import type { i18n as I18n } from "i18next";

// AA Geuthur React
import { i18nResources } from "@/i18nResources";

/**
 * i18next namespace of every text in this package. `AaReactProvider` registers the translations
 * with the i18next instance of the app, the app itself loads nothing for this namespace.
 */
export const I18N_NAMESPACE = "aa-geuthur-react";

/** Namespace of the app that is tried after the package namespace, e.g. for menu link names. */
export const I18N_FALLBACK_NAMESPACE = "translation";

const registeredInstances = new WeakSet<I18n>();

/**
 * Adds the bundled translations of this package to an initialized i18next instance, once per instance.
 * `AaReactProvider` calls it on mount. Existing texts of the namespace are kept, so an app can
 * override single texts with its own resources. Untranslated texts are missing from the language
 * files, so i18next falls back to `fallbackLng` (`en`). Does nothing without an
 * initialized instance (e.g. when `react-i18next` is mocked in a test).
 */
export function registerI18nResources(i18n: I18n | undefined): void {
  if (!i18n || typeof i18n.addResourceBundle !== "function" || registeredInstances.has(i18n)) return;
  registeredInstances.add(i18n);
  for (const [lng, bundle] of Object.entries(i18nResources)) {
    i18n.addResourceBundle(lng, I18N_NAMESPACE, bundle, true, false);
  }
}
