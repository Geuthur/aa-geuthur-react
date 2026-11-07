// Third Party
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { afterEach } from "vitest";

// AA Geuthur React
import { I18N_NAMESPACE } from "@/i18n";

// Without resources the keys are returned, with interpolation applied.
i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  ns: [I18N_NAMESPACE],
  defaultNS: I18N_NAMESPACE,
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  resources: {},
});

afterEach(() => {
  cleanup();
});
