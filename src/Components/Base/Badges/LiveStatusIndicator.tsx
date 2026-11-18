// React
import type React from "react";

// Third Party
import { useTranslation } from "react-i18next";

// AA Geuthur React
import { formatLastFetch, useLivePing } from "@/Components/Base/Badges/liveStatusHelper";
import { I18N_NAMESPACE } from "@/i18n";
import { renderTooltip } from "@/Utils/bootsTrap";

export interface LiveStatusProps {
  /** Whether a query or operation encountered an error */
  isError?: boolean;
  /** Optional error object or message for the tooltip */
  error?: unknown;
  /** Whether a query or operation is currently loading */
  isLoading?: boolean;
  /** Whether a query is actively fetching (including background refetches) */
  isFetching?: boolean;
  /** Timestamp in ms of the last successful data update */
  dataUpdatedAt?: number;
  /** Whether to display the formatted last fetch timestamp beside the dot */
  showTimestamp?: boolean;
  /** Prefix before the timestamp (default: "↻") */
  timestampPrefix?: string;
  /** Duration in ms of the ping animation on fresh data (default: 2000) */
  pingDuration?: number;
  /** Wrapper class (default: "aa-status-indicator") */
  className?: string;
  /** Additional class of the dot */
  dotClassName?: string;
  /** Class of the timestamp text (default: "aa-status-text") */
  textClassName?: string;
  /** Optional children rendered beside the dot */
  children?: React.ReactNode;
}

/**
 * Live status of a query:
 * - red dot when an error occurred (`isError`)
 * - amber pulsing dot while loading or fetching (`isLoading` / `isFetching`)
 * - green dot when ready, with a short ping when new data arrived
 * - optional text ("↻ 19:10:24 EVE", "Loading…", "Error")
 */
export function LiveStatusIndicator({
  isError = false,
  error,
  isLoading = false,
  isFetching = false,
  dataUpdatedAt,
  showTimestamp = false,
  timestampPrefix = "↻",
  pingDuration = 2000,
  className = "aa-status-indicator",
  dotClassName = "",
  textClassName = "aa-status-text",
  children,
}: LiveStatusProps) {
  const { t } = useTranslation(I18N_NAMESPACE);
  const isBusy = isLoading || isFetching;
  const pinging = useLivePing(dataUpdatedAt, isBusy || isError, pingDuration);

  const errorMessage =
    error instanceof Error ? error.message : typeof error === "string" ? error : t("Failed to load");

  const tooltipText = isError
    ? errorMessage
    : isBusy
      ? t("Loading…")
      : dataUpdatedAt
        ? `${t("Last Fetch")}: ${formatLastFetch(dataUpdatedAt)}`
        : t("No fetch yet");

  return renderTooltip(
    tooltipText,
    <span className={className}>
      <span className={`aa-status-dot ${dotClassName}`.trim()}>
        {isError ? (
          <span className="aa-status-dot-fill aa-status-dot-error" />
        ) : isBusy ? (
          <span className="aa-status-dot-fill aa-status-dot-busy" />
        ) : (
          <>
            {pinging && <span className="aa-status-ping" />}
            <span className="aa-status-dot-fill aa-status-dot-ready" />
          </>
        )}
      </span>

      {children}

      {showTimestamp && (
        <span className={isError ? "aa-status-text aa-status-text-error" : textClassName}>
          {isError
            ? t("Error")
            : isBusy
              ? t("Loading…")
              : dataUpdatedAt
                ? `${timestampPrefix} ${formatLastFetch(dataUpdatedAt)}`
                : t("No fetch yet")}
        </span>
      )}
    </span>,
  );
}
