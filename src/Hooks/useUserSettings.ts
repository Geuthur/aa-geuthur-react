// Third Party
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// AA Geuthur React
import { loadUserSettings, updateUserSettings } from "@/Api/calls";
import { queryKeys } from "@/Api/query";
import type { UserSettings } from "@/Api/types";
import { useAaReact } from "@/Provider";

/**
 * Loads the settings of the current user and saves them optimistically: the new values show at
 * once, a failed request restores the previous settings, a successful one stores the answer of
 * the API. Returns the query result plus `updateMutation`.
 *
 * An app whose `settings/` endpoint delivers more fields passes its own type:
 * `useUserSettings<AppUserSettings>()`. `Body` is the request body of `PUT settings/` when it
 * differs from `T`, e.g. single fields; the sent fields are merged into the loaded settings.
 */
export function useUserSettings<T extends UserSettings = UserSettings, Body extends object = T>() {
  const { projectName } = useAaReact();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.UserSettings,
    queryFn: () => loadUserSettings<T>(projectName),
  });

  const updateMutation = useMutation({
    mutationFn: (settings: Body) => updateUserSettings<T, Body>(projectName, settings),
    onMutate: async (settings) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.UserSettings });
      const previous = queryClient.getQueryData<T>(queryKeys.UserSettings);
      queryClient.setQueryData<T>(queryKeys.UserSettings, { ...previous, ...settings } as unknown as T);
      return { previous };
    },
    onError: (_error, _settings, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.UserSettings, context.previous);
      }
    },
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.UserSettings, settings);
    },
  });

  return { ...query, updateMutation };
}
