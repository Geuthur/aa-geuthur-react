// AA Geuthur React
import { getSecColor } from "@/Utils/eveOnline";

export interface SecurityBadgeProps {
  /** Security status of the system, shown with one decimal. */
  sec: number;
  className?: string;
}

/**
 * Security status of a system. The colour comes from `getSecColor` (`aa-badge-hisec`,
 * `aa-badge-lowsec`, `aa-badge-nullsec`); the app defines these classes.
 */
export function SecurityBadge({ sec, className = "" }: SecurityBadgeProps) {
  return <span className={`sec-badge ${getSecColor(sec)} ${className}`.trim()}>{sec.toFixed(1)}</span>;
}
