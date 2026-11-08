// React
import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

export interface AaReactConfig {
  /** URL prefix of the app, e.g. `example` for `/example/api/menu/`. */
  projectName: string;
  /** Name of the app package, e.g. `aa-example`; used for element ids. */
  appName: string;
  /** Interval in milliseconds in which `useMenu` reloads the menu (badges stay live). Off by default. */
  menuRefetchInterval?: number;
}

const AaReactContext = createContext<AaReactConfig | null>(null);

/** Provides the app names to the menus, hooks and pages of this package. Wrap the routing with it. */
export function AaReactProvider({
  projectName,
  appName,
  menuRefetchInterval,
  children,
}: AaReactConfig & { children?: ReactNode }) {
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
