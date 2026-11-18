// Third Party
import { render, screen } from "@testing-library/react";
import type { i18n as I18n } from "i18next";
import { useTranslation } from "react-i18next";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// AA Geuthur React
import { I18N_NAMESPACE } from "@/i18n";
import { initI18n } from "@/i18nInit";
import { ErrorPage } from "@/Pages/404";
import { AaReactProvider } from "@/Provider";

// `setupTests.ts` already initialized the shared i18next instance without a backend. An app calls
// `initI18n` on an untouched instance, so the default export is a fresh instance in every test.
const fresh = vi.hoisted(() => ({ instance: undefined as unknown }));
vi.mock("i18next", async (importOriginal) => {
  const original = await importOriginal<typeof import("i18next")>();
  return {
    ...original,
    get default() {
      return fresh.instance;
    },
  };
});

/** Language files of the app as the static server delivers them, keyed by language. */
const files: Record<string, Record<string, string>> = {
  en: { Settings: "Settings", "{{count}} Owner_one": "{{count}} Owner", "{{count}} Owner_other": "{{count}} Owners" },
  de: { Settings: "Einstellungen" },
  // Weblate writes empty plural forms for an untranslated plural unit.
  pl: { "{{count}} Owner_one": "", "{{count}} Owner_few": "", "{{count}} Owner_many": "", "{{count}} Owner_other": "" },
};

const fetchMock = vi.fn(async (url: string | URL | Request) => {
  const lng = String(url).split("/").at(-2) ?? "";
  if (!(lng in files)) return new Response("Not Found", { status: 404 });
  return new Response(JSON.stringify(files[lng]), { status: 200, headers: { "Content-Type": "application/json" } });
});

const addRoot = (id: string, lang?: string) => {
  const root = document.createElement("div");
  root.id = id;
  if (lang) root.setAttribute("lang", lang);
  document.body.appendChild(root);
};

const AppText = () => <p>{useTranslation().t("Settings")}</p>;

describe("initI18n", () => {
  let i18n: I18n;

  beforeEach(async () => {
    const { createInstance } = await vi.importActual<typeof import("i18next")>("i18next");
    i18n = createInstance();
    fresh.instance = i18n;
    fetchMock.mockClear();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("should pass the fixed options and the load path of the project to i18next", async () => {
    // Test Data
    addRoot("aa-example-root", "de");

    // Test Action
    await initI18n("example", "aa-example-root");

    // Expected Result
    expect(i18n.options).toMatchObject({
      lng: "de",
      // i18next stores the fallback language as a list.
      fallbackLng: ["en"],
      ns: ["translation"],
      defaultNS: "translation",
      returnEmptyString: false,
      keySeparator: false,
      nsSeparator: false,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      backend: { loadPath: "/static/example/i18n/{{lng}}/{{ns}}.json" },
    });
  });

  it("should load the language of the root element and English from the static path of the project", async () => {
    // Test Data
    addRoot("aa-example-root", "de");

    // Test Action
    await initI18n("example", "aa-example-root");

    // Expected Result
    const urls = fetchMock.mock.calls.map(([url]) => String(url)).sort();
    expect(urls).toEqual(["/static/example/i18n/de/translation.json", "/static/example/i18n/en/translation.json"]);
    expect(i18n.language).toBe("de");
    expect(i18n.t("Settings")).toBe("Einstellungen");
  });

  it("should use English without a lang attribute", async () => {
    // Test Data
    addRoot("aa-example-root");

    // Test Action
    await initI18n("example", "aa-example-root");

    // Expected Result
    expect(i18n.options.lng).toBe("en");
    expect(i18n.language).toBe("en");
  });

  it("should use English without the root element", async () => {
    // Test Action
    await initI18n("example", "missing-root");

    // Expected Result
    expect(i18n.options.lng).toBe("en");
    expect(i18n.language).toBe("en");
    expect(i18n.t("Settings")).toBe("Settings");
  });

  it("should show the English text for a missing key and for empty plural forms", async () => {
    // Test Data
    addRoot("aa-example-root", "pl");

    // Test Action
    await initI18n("example", "aa-example-root");

    // Expected Result
    expect(i18n.t("Settings")).toBe("Settings");
    expect(i18n.t("{{count}} Owner", { count: 1 })).toBe("1 Owner");
    expect(i18n.t("{{count}} Owner", { count: 5 })).toBe("5 Owners");
  });

  it("should keep keys with dots and colons and not escape values", async () => {
    // Test Data
    addRoot("aa-example-root");

    // Test Action
    await initI18n("example", "aa-example-root");

    // Expected Result
    expect(i18n.t("Loading settings...")).toBe("Loading settings...");
    expect(i18n.t("Status: {{name}}", { name: "<Corp & Co>" })).toBe("Status: <Corp & Co>");
  });

  it("should work together with AaReactProvider: app texts from the backend, package texts from the bundle", async () => {
    // Test Data
    addRoot("aa-example-root", "de");

    // Test Action
    await initI18n("example", "aa-example-root");
    render(
      <AaReactProvider projectName="example" appName="aa-example">
        <AppText />
        <ErrorPage />
      </AaReactProvider>,
    );

    // Expected Result
    expect(screen.getByText("Einstellungen")).toBeInTheDocument();
    expect(i18n.hasResourceBundle("de", I18N_NAMESPACE)).toBe(true);
    expect(i18n.t("Close", { ns: I18N_NAMESPACE })).toBe("Schließen");
    // The app requests only its own namespace, never the one of the package.
    expect(fetchMock.mock.calls.every(([url]) => String(url).endsWith("/translation.json"))).toBe(true);
  });
});
