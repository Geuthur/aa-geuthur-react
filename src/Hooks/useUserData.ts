// Third Party
import { useQuery } from "@tanstack/react-query";

// AA Geuthur React
import { loadUserData } from "@/Api/calls";
import { queryKeys } from "@/Api/query";
import type { UserData } from "@/Api/types";
import { useAaReact } from "@/Provider";

/**
 * Loads the current user (main character, corporation, admin flag).
 *
 * An app whose `user/` endpoint delivers more fields passes its own type: `useUserData<AppUserData>()`.
 */
export function useUserData<T extends UserData = UserData>() {
  const { projectName } = useAaReact();
  return useQuery({
    queryKey: queryKeys.User,
    queryFn: () => loadUserData<T>(projectName),
    staleTime: 5 * 60 * 1000,
  });
}
