// Third Party
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  RotateCw,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

// AA Geuthur React
import { OwnerPortrait } from "@/Components/Base/OwnerPortrait";
import type { BaseOwner, BaseOwnerCardProps } from "@/Components/Base/OwnerSettings/types";
import { I18N_NAMESPACE } from "@/i18n";

/**
 * Card of a registered owner: status badge, update sections and action buttons.
 * The pulsing dot of the error states uses the `aa-pending-dot-*` / `aa-danger-dot-*` classes of the app.
 */
export function BaseOwnerCard<T extends BaseOwner = BaseOwner>({
  owner,
  isUpdating = false,
  cooldown = 0,
  onTriggerUpdate,
  onDeleteClick,
  className = "",
  renderCustomContent,
  renderActions,
}: BaseOwnerCardProps<T>) {
  const { t } = useTranslation(I18N_NAMESPACE);

  const status = (owner.status || "incomplete").toLowerCase();
  const isError = status === "error";
  const isTokenError = status === "token_error";
  const cardClass = isError ? "aa-owner-card-error" : isTokenError ? "aa-owner-card-token-error" : "";

  const renderStatusBadge = () => {
    let badgeClass = "aa-owner-status-incomplete";
    let label = t("Incomplete");
    let Icon = AlertTriangle;

    if (status === "ok") {
      badgeClass = "aa-owner-status-ok";
      label = t("OK");
      Icon = CheckCircle2;
    } else if (isError) {
      badgeClass = "aa-owner-status-error";
      label = t("Error");
      Icon = AlertTriangle;
    } else if (isTokenError) {
      badgeClass = "aa-owner-status-token-error";
      label = t("Token Error");
      Icon = AlertCircle;
    } else if (status === "disabled") {
      badgeClass = "aa-owner-status-disabled";
      label = t("Disabled");
      Icon = AlertCircle;
    }

    return (
      <span
        className={`aa-owner-status-badge d-inline-flex align-items-center gap-1 px-2 py-1 fw-semibold text-capitalize ${badgeClass}`}
      >
        {(isError || isTokenError) && (
          <span className="aa-pending-dot-container me-1" aria-hidden="true">
            <span className={isTokenError ? "aa-danger-dot-ping" : "aa-pending-dot-ping"} />
            <span className={isTokenError ? "aa-danger-dot-core" : "aa-pending-dot-core"} />
          </span>
        )}
        <Icon size={12} aria-hidden="true" />
        <span>{label}</span>
      </span>
    );
  };

  const type = (owner.owner_type ?? "").toLowerCase();
  const TypeIcon = type === "corporation" ? Building2 : type === "alliance" ? Shield : User;
  const typeLabel =
    type === "corporation" ? t("Corporation") : type === "alliance" ? t("Alliance") : t("Character");
  const typeBadgeClass =
    type === "corporation"
      ? "bg-primary text-white border-black"
      : type === "alliance"
        ? "bg-success text-white border-black"
        : "bg-info text-white border-black";

  return (
    <article className={`aa-owner-card d-flex flex-column gap-3 p-3 ${cardClass} ${className}`.trim()}>
      <div className="d-flex align-items-center gap-3">
        <OwnerPortrait
          src={owner.avatar_url}
          alt={owner.name}
          type={type}
          shape={type === "corporation" ? "rounded" : "circle"}
          bordered
        />
        <div className="aa-owner-info flex-grow-1">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <h3 className="aa-owner-name m-0 fs-6 fw-semibold text-truncate" title={owner.name}>
              {owner.name}
            </h3>
            <span className={`badge border d-inline-flex align-items-center gap-1 flex-shrink-0 ${typeBadgeClass}`}>
              <TypeIcon size={11} />
              {typeLabel}
            </span>
          </div>
          {owner.subtitle && <p className="aa-owner-subtitle m-0 text-truncate">{owner.subtitle}</p>}
        </div>
      </div>

      {owner.error_message && (
        <div className="aa-owner-error-banner px-2 py-1 text-break" role="alert">
          {owner.error_message}
        </div>
      )}

      {owner.sections && owner.sections.length > 0 && (
        <div className="aa-owner-sections d-flex flex-column gap-1 p-2">
          {owner.sections.map((sec) => {
            let dotClass = "aa-owner-dot-muted";
            if (sec.is_success === true) dotClass = "aa-owner-dot-ok";
            if (sec.is_success === false) dotClass = "aa-owner-dot-warning";
            if (sec.has_token_error) dotClass = "aa-owner-dot-error";

            return (
              <div key={sec.section} className="aa-owner-section-item d-flex align-items-center justify-content-between">
                <span className="d-inline-flex align-items-center gap-2">
                  <span className={`aa-owner-section-dot flex-shrink-0 rounded-circle ${dotClass}`} aria-hidden="true" />
                  <span>{sec.section_name}</span>
                </span>
                <span>
                  {sec.has_token_error
                    ? t("Token Error")
                    : sec.is_success === true
                      ? t("OK")
                      : sec.is_success === false
                        ? t("Failed")
                        : t("Pending")}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {renderCustomContent?.(owner)}

      <div className="aa-owner-badge-row d-flex align-items-center justify-content-between gap-2 mt-auto pt-2">
        {renderStatusBadge()}
        <span
          className="aa-owner-last-sync d-inline-flex align-items-center gap-1"
          title={owner.last_sync ? `${t("Last sync")}: ${owner.last_sync}` : undefined}
        >
          <Clock size={12} aria-hidden="true" />
          <span>{owner.last_sync ? owner.last_sync.slice(5) : t("Never")}</span>
        </span>
      </div>

      {(onTriggerUpdate || onDeleteClick || renderActions) && (
        <div className="d-flex align-items-center justify-content-between gap-2 mt-2 pt-2 border-top border-secondary flex-wrap">
          <div>{renderActions?.(owner)}</div>
          <div className="d-flex align-items-center gap-2 ms-auto">
            {onTriggerUpdate && (
              <Button
                variant="secondary"
                size="sm"
                className="d-flex align-items-center gap-1"
                disabled={isUpdating || cooldown > 0}
                onClick={() => onTriggerUpdate(owner.id)}
                aria-label={t("Update Owner")}
              >
                {isUpdating ? <span className="spinner-border spinner-border-sm" /> : <RotateCw size={13} />}
                <span>{cooldown > 0 ? `${cooldown}s` : t("Update")}</span>
              </Button>
            )}
            {onDeleteClick && (
              <Button
                variant="danger"
                size="sm"
                className="d-flex align-items-center gap-1"
                onClick={() => onDeleteClick(owner)}
                aria-label={t("Delete Owner")}
              >
                <Trash2 size={13} />
                <span>{t("Delete")}</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
