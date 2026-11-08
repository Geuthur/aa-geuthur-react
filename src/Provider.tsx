// React
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

// Third Party
import { I18nContext, getI18n } from "react-i18next";

// AA Geuthur React
import { registerI18nResources } from "@/i18n";

export interface AaReactConfig {
  /** URL prefix of the app, e.g. `example` for `/example/api/menu/`. */
  projectName: string;
  /** Name of the app package, e.g. `aa-example`; used for element ids. */
  appName: string;
  /** Interval in milliseconds in which `useMenu` reloads the menu (badges stay live). Off by default. */
  menuRefetchInterval?: number;
}

const AaReactContext = createContext<AaReactConfig | null>(null);

/**
 * Provides the app names to the menus, hooks and pages of this package and registers the
 * translations of the package with the i18next instance of the app. Wrap the routing with it.
 */
export function AaReactProvider({
  projectName,
  appName,
  menuRefetchInterval,
  children,
}: AaReactConfig & { children?: ReactNode }) {
  // The instance of an `I18nextProvider` or the one given to `initReactI18next`, read without
  // `useTranslation` so the provider never suspends. Registered once per mount, before the children render.
  const i18n = useContext(I18nContext)?.i18n ?? getI18n();
  useState(() => registerI18nResources(i18n));

  const value = useMemo(
    () => ({ projectName, appName, menuRefetchInterval }),
    [projectName, appName, menuRefetchInterval],
  );
  return <AaReactContext.Provider value={value}>{children}</AaReactContext.Provider>;
}

/** Reads the app names given to `AaReactProvider`. Throws outside of the provider. */
export function useAaReact(): AaReactConfig {
  const config = useContext(AaReactContext);
  if (!config) {
    throw new Error("useAaReact must be used inside <AaReactProvider projectName appName>.");
  }
  return config;
}
