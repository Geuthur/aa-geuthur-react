// Third Party
import i18n from "i18next";
import type { TFunction } from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// AA Geuthur React
import { I18N_FALLBACK_NAMESPACE } from "@/i18n";

/**
 * Initializes i18next for an app, call it in `Main.tsx` before rendering:
 * `initI18n(ProjectName, `${AppName}-root`)`.
 *
 * The language is the `lang` attribute of the root element (Django's `LANGUAGE_CODE`), `en`
 * without it. The texts of the app are loaded from
 * `/static/<projectName>/i18n/<lng>/translation.json`; missing or empty texts fall back to
 * English. The texts of this package are added by `AaReactProvider`.
 *
 * @param projectName URL prefix of the app, e.g. `example`
 * @param rootElementId id of the element the app is mounted in, e.g. `aa-example-root`
 * @returns the promise of `i18n.init`; rendering does not have to wait for it
 */
export function initI18n(projectName: string, rootElementId: string): Promise<TFunction> {
  const lng =
    typeof document !== "undefined" ? (document.getElementById(rootElementId)?.getAttribute("lang") ?? "en") : "en";

  return i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng,
      fallbackLng: "en",
      ns: [I18N_FALLBACK_NAMESPACE],
      defaultNS: I18N_FALLBACK_NAMESPACE,
      // Weblate writes empty plural forms for untranslated texts; show the English text instead.
      returnEmptyString: false,
      keySeparator: false,
      nsSeparator: false,
      // React already escapes the values.
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      backend: {
        loadPath: `/static/${projectName}/i18n/{{lng}}/{{ns}}.json`,
      },
    });
}
