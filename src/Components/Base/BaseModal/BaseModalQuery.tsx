// Third Party
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import Cookies from 'js-cookie';

// AA Geuthur React
import { apiErrorMessage } from '@/Api/errors';

type FormData = Record<string, string | boolean>;

function buildHeaders(): Record<string, string> {
    const csrf = Cookies.get('csrftoken');
    return csrf ? { 'X-CSRFToken': csrf } : {};
}

/**
 * Message of a failed answer: `error` or `detail` of the API, otherwise `message` of older answers
 * and views outside the API, otherwise a fixed text.
 */
function failureMessage(data: unknown): string {
    const message = (data as { message?: unknown } | null)?.message;
    const fallback = typeof message === 'string' && message.trim() !== '' ? message : 'Unknown error';
    return apiErrorMessage(data, fallback);
}

/** Mutation für Delete / Update / Bestätigungen (ohne Body) */
export function useApproveMutation(queryKey?: QueryKey | QueryKey[]) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (url: string) => {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'same-origin',
                headers: buildHeaders(),
            });

            const data = await response.json();

            if (!response.ok || data.success !== true) {
                throw new Error(failureMessage(data));
            }
            return data;
        },
        onSuccess: async () => {
            if (queryKey) {
                if (Array.isArray(queryKey) && Array.isArray(queryKey[0])) {
                    await Promise.all(
                        (queryKey as QueryKey[]).map((key) =>
                            queryClient.invalidateQueries({ queryKey: key, refetchType: 'all' })
                        )
                    );
                } else {
                    await queryClient.invalidateQueries({ queryKey: queryKey as QueryKey, refetchType: 'all' });
                }
            }
        },
    });
}

/** Mutation für Formulare (mit Formulardaten als URLSearchParams) */
export function useFormApproveMutation(queryKey?: QueryKey | QueryKey[]) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ url, formData = {} }: { url: string; formData?: FormData }) => {
            const body = new URLSearchParams();
            for (const [key, value] of Object.entries(formData)) {
                if (typeof value === 'boolean') {
                    if (value) body.append(key, 'on');
                } else {
                    body.append(key, value);
                }
            }

            const response = await fetch(url, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    ...buildHeaders(),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body.toString(),
            });

            const data = await response.json();

            if (!response.ok || data.success !== true) {
                throw new Error(failureMessage(data));
            }
            return data;
        },
        onSuccess: async () => {
            if (queryKey) {
                if (Array.isArray(queryKey) && Array.isArray(queryKey[0])) {
                    await Promise.all(
                        (queryKey as QueryKey[]).map((key) =>
                            queryClient.invalidateQueries({ queryKey: key, refetchType: 'all' })
                        )
                    );
                } else {
                    await queryClient.invalidateQueries({ queryKey: queryKey as QueryKey, refetchType: 'all' });
                }
            }
        },
    });
}
