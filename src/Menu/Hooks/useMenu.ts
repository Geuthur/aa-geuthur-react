// Third Party
import { useQuery } from "@tanstack/react-query";

// AA Geuthur React
import { loadMenu } from "@/Api/calls";
import { queryKeys } from "@/Api/query";
import type { MenuModals } from "@/Api/types";
import { useAaReact } from "@/Provider";

/**
 * Loads the left and right menu links and the menu modals of the app.
 * Reloads them every `menuRefetchInterval` ms when the provider sets it.
 *
 * An app with its own menu modals passes their type: `useMenu<AppMenuModals>()`.
 */
export function useMenu<TModals extends object = MenuModals>() {
  const { projectName, menuRefetchInterval } = useAaReact();
  return useQuery({
    queryKey: queryKeys.Menu,
    queryFn: () => loadMenu<TModals>(projectName),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: menuRefetchInterval ?? false,
  });
}
