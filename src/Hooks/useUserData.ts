// Third Party
import { useQuery } from "@tanstack/react-query";

// AA Geuthur React
import { loadUserData } from "@/Api/calls";
import { queryKeys } from "@/Api/query";
import { useAaReact } from "@/Provider";

/** Loads the current user (main character, corporation, admin flag). */
export function useUserData() {
  const { projectName } = useAaReact();
  return useQuery({
    queryKey: queryKeys.User,
    queryFn: () => loadUserData(projectName),
    staleTime: 5 * 60 * 1000,
  });
}
