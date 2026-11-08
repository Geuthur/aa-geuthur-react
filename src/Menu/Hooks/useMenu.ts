// Third Party
import { useQuery } from "@tanstack/react-query";

// AA Geuthur React
import { loadMenu } from "@/Api/calls";
import { queryKeys } from "@/Api/query";
import { useAaReact } from "@/Provider";

/** Loads the left and right menu links. Reloads them every `menuRefetchInterval` ms when the provider sets it. */
export function useMenu() {
  const { projectName, menuRefetchInterval } = useAaReact();
  return useQuery({
    queryKey: queryKeys.Menu,
    queryFn: () => loadMenu(projectName),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: menuRefetchInterval ?? false,
  });
}
