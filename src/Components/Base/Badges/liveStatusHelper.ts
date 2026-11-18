// React
import { useEffect, useState } from "react";

// AA Geuthur React
import { formatEveTime } from "@/Utils/eveOnline";

/**
 * Formats a timestamp in milliseconds as EVE time (`HH:MM:SS EVE`), empty without a timestamp.
 */
export function formatLastFetch(date?: number): string {
  if (!date) return "";
  return formatEveTime(new Date(date));
}

/**
 * Short ping animation whenever `dataUpdatedAt` changes. Both timers are cleared when the inputs
 * change or the component unmounts, so no state update happens after unmount.
 * @param dataUpdatedAt Timestamp of the last query fetch
 * @param isBusy True while the query is loading or refetching (no ping then)
 * @param duration Duration of the ping animation in milliseconds (default: 2000)
 */
export function useLivePing(dataUpdatedAt?: number, isBusy: boolean = false, duration: number = 2000): boolean {
  const [pinging, setPinging] = useState(false);

  useEffect(() => {
    if (isBusy) return;

    const startTimer = setTimeout(() => setPinging(true), 0);
    const stopTimer = setTimeout(() => setPinging(false), duration);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, [dataUpdatedAt, isBusy, duration]);

  return pinging;
}
