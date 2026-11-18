// Third Party
import { render, screen } from "@testing-library/react";
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next, useTranslation } from "react-i18next";
import { describe, expect, it } from "vitest";

// AA Geuthur React
import { I18N_NAMESPACE, registerI18nResources } from "@/i18n";
import { i18nResources } from "@/i18nResources";
import { ErrorPage } from "@/Pages/404";
import { AaReactProvider } from "@/Provider";

/** A fresh instance like the apps create it: no backend, missing keys fall back to English. */
const createAppInstance = (lng: string, resources = {}) => {
  const instance = createInstance();
  instance.use(initReactI18next).init({
    lng,
    fallbackLng: "en",
    ns: ["translation"],
    defaultNS: "translation",
    keySeparator: false,
    nsSeparator: false,
    returnEmptyString: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    resources,
  });
  return instance;
};

/** A key Weblate has no translation for in the language, so the file does not contain it. */
const untranslatedKey = (lng: string): string => {
  const key = Object.keys(i18nResources.en).find((k) => !k.includes("{{count}}") && !(k in i18nResources[lng]));
  if (!key) throw new Error(`Every key is translated in ${lng}`);
  return key;
};

const Loading = () => {
  const { t } = useTranslation(I18N_NAMESPACE);
  return <p>{t("Loading…")}</p>;
};

describe("i18nResources", () => {
  it("should bundle every language of i18n/ with the English template", () => {
    // Expected Result
    expect(Object.keys(i18nResources).sort()).toEqual(
      ["cs", "de", "en", "es", "fr-FR", "it-IT", "ja", "ko-KR", "nl-NL", "pl-PL", "ru", "sk", "uk", "zh-Hans"].sort(),
    );
    expect(i18nResources.en["Close"]).toBe("Close");
    expect(i18nResources.es[untranslatedKey("es")]).toBeUndefined();
    expect(i18nResources.de["Close"]).toBe("Schließen");
  });
});

describe("registerI18nResources", () => {
  it("should register the namespace and fall back to English for a key missing in the language", () => {
    // Test Data
    const instance = createAppInstance("es");
    const key = untranslatedKey("es");
    expect(instance.hasResourceBundle("es", I18N_NAMESPACE)).toBe(false);

    // Test Action
    registerI18nResources(instance);

    // Expected Result
    expect(instance.hasResourceBundle("es", I18N_NAMESPACE)).toBe(true);
    expect(instance.getResource("es", I18N_NAMESPACE, key)).toBeUndefined();
    expect(instance.t(key, { ns: I18N_NAMESPACE })).toBe(i18nResources.en[key]);
    expect(instance.t("{{count}} Rows", { ns: I18N_NAMESPACE, count: 3 })).toBe(
      i18nResources.es["{{count}} Rows_other"].replace("{{count}}", "3"),
    );
  });

  it("should show the German translation and fall back to English for a missing key", () => {
    // Test Data
    const de = createAppInstance("de");
    const ja = createAppInstance("ja");
    const key = untranslatedKey("ja");

    // Test Action
    registerI18nResources(de);
    registerI18nResources(ja);

    // Expected Result
    expect(de.t("Close", { ns: I18N_NAMESPACE })).toBe("Schließen");
    expect(ja.t(key, { ns: I18N_NAMESPACE })).toBe(i18nResources.en[key]);
  });

  it("should keep texts the app provides for the namespace", () => {
    // Test Data
    const instance = createAppInstance("es", { es: { [I18N_NAMESPACE]: { Close: "Cerrar (app)" } } });
    const key = untranslatedKey("es");

    // Test Action
    registerI18nResources(instance);
    registerI18nResources(instance);

    // Expected Result
    expect(instance.t("Close", { ns: I18N_NAMESPACE })).toBe("Cerrar (app)");
    expect(instance.t("Confirm", { ns: I18N_NAMESPACE })).toBe(i18nResources.es["Confirm"]);
    expect(instance.t(key, { ns: I18N_NAMESPACE })).toBe(i18nResources.en[key]);
  });

  it("should ignore a missing or uninitialized instance", () => {
    // Test Action & Expected Result
    expect(() => registerI18nResources(undefined)).not.toThrow();
    expect(() => registerI18nResources(createInstance())).not.toThrow();
  });
});

describe("AaReactProvider translations", () => {
  it("should show the package texts without a backend when the app only loads its own namespace", () => {
    // Test Data
    const instance = createAppInstance("es");

    // Test Action
    render(
      <I18nextProvider i18n={instance}>
        <AaReactProvider projectName="example" appName="aa-example">
          <Loading />
          <ErrorPage />
        </AaReactProvider>
      </I18nextProvider>,
    );

    // Expected Result
    expect(instance.hasResourceBundle("es", I18N_NAMESPACE)).toBe(true);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(screen.getByText("Error 404")).toBeInTheDocument();
    expect(screen.getByText("The page you are looking for does not exist.")).toBeInTheDocument();
  });
});
