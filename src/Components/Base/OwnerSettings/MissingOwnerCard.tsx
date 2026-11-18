// Third Party
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

// AA Geuthur React
import { OwnerPortrait } from "@/Components/Base/OwnerPortrait";
import type { BaseMissingOwner, MissingOwnerCardProps } from "@/Components/Base/OwnerSettings/types";
import { I18N_NAMESPACE } from "@/i18n";

/** Card for an entity (e.g. an alt) that belongs to the user but is not registered in the app. */
export function MissingOwnerCard<M extends BaseMissingOwner = BaseMissingOwner>({
  missing,
  appName = "Alliance Auth",
  actionUrl,
  actionLabel,
}: MissingOwnerCardProps<M>) {
  const { t } = useTranslation(I18N_NAMESPACE);

  return (
    <article className="aa-owner-card aa-owner-card-missing d-flex flex-column gap-3 p-3">
      <div className="d-flex align-items-center gap-3">
        <OwnerPortrait
          src={missing.avatar_url}
          alt={missing.name}
          type={missing.owner_type}
          shape={missing.owner_type === "corporation" ? "rounded" : "circle"}
          bordered
        />
        <div className="aa-owner-info flex-grow-1">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <h3 className="aa-owner-name m-0 fs-6 fw-semibold text-truncate">{missing.name}</h3>
            <span className="aa-owner-status-badge aa-owner-status-missing d-inline-flex align-items-center gap-1 px-2 py-1 fw-semibold text-capitalize">
              <AlertCircle size={11} aria-hidden="true" />
              <span>{t("Not Registered")}</span>
            </span>
          </div>
          {missing.subtitle && <p className="aa-owner-subtitle m-0 text-truncate">{missing.subtitle}</p>}
        </div>
      </div>

      <p className="small text-muted mb-0">
        {t("{{name}} is not registered in {{app}}.", { name: missing.name, app: appName })}
      </p>

      {actionUrl && (
        <div className="d-flex justify-content-end mt-auto pt-2 border-top border-secondary">
          <Button href={actionUrl} variant="primary" size="sm" className="d-flex align-items-center gap-1">
            <Plus size={13} />
            <span>{actionLabel ?? t("Add to {{app}}", { app: appName })}</span>
          </Button>
        </div>
      )}
    </article>
  );
}
