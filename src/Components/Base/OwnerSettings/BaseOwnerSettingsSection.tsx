// React
import { useMemo, useState } from "react";

// Third Party
import { AlertTriangle, RotateCw, Trash2, UserRoundX, Users } from "lucide-react";
import { Alert, Button, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

// AA Geuthur React
import { BaseModal } from "@/Components/Base/BaseModal";
import { BaseOwnerCard } from "@/Components/Base/OwnerSettings/BaseOwnerCard";
import { MissingOwnerCard } from "@/Components/Base/OwnerSettings/MissingOwnerCard";
import { OwnerFilterBar, type OwnerTypeFilter } from "@/Components/Base/OwnerSettings/OwnerFilterBar";
import type {
  BaseMissingOwner,
  BaseOwner,
  BaseOwnerSettingsSectionProps,
} from "@/Components/Base/OwnerSettings/types";
import { I18N_NAMESPACE } from "@/i18n";

const missingType = (m: BaseMissingOwner) => m.owner_type ?? "character";

/**
 * Owner overview for the settings page: header with "Update All", feedback alert, optional
 * type filter and search, owner grid, missing (unregistered) owners and the delete confirmation.
 * Project specific parts are injected via `renderCustomCardContent` / `renderCardActions`.
 */
export function BaseOwnerSettingsSection<
  T extends BaseOwner = BaseOwner,
  M extends BaseMissingOwner = BaseMissingOwner,
>({
  title,
  description,
  icon,
  owners,
  missingOwners,
  isLoading = false,
  isError = false,
  errorMessage,
  emptyMessage,
  appName = "Alliance Auth",
  className = "",
  bodyClassName = "bg-dark text-light",
  enableFilters = false,
  searchPlaceholder,
  onUpdateAll,
  isUpdatingAll = false,
  globalCooldown = 0,
  feedbackMessage,
  onDismissFeedback,
  onTriggerSingleUpdate,
  isUpdatable,
  isDeletable,
  updatingOwnerId = null,
  ownerCooldowns = {},
  onDeleteOwner,
  isDeleting = false,
  deleteModalTitle,
  deleteModalDescription,
  deleteModalBodyClassName,
  cardClassName,
  renderCustomCardContent,
  renderCardActions,
  missingSectionTitle,
  missingSectionDescription,
  missingActionUrl,
  missingActionLabel,
}: BaseOwnerSettingsSectionProps<T, M>) {
  const { t } = useTranslation(I18N_NAMESPACE);
  const [ownerToDelete, setOwnerToDelete] = useState<T | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<OwnerTypeFilter>("all");

  const hasOwners = (owners?.length ?? 0) > 0;
  const hasMissing = (missingOwners?.length ?? 0) > 0;
  // Without the filter bar there is nothing to reset, so its state is ignored.
  const query = enableFilters ? search.trim().toLowerCase() : "";
  const activeType: OwnerTypeFilter = enableFilters ? typeFilter : "all";
  const isFiltering = query !== "" || activeType !== "all";

  const counts = useMemo(() => {
    const result: Record<OwnerTypeFilter, number> = { all: 0, character: 0, corporation: 0, alliance: 0 };
    const add = (type: string | undefined) => {
      result.all += 1;
      if (type && type !== "all" && type in result) result[type as OwnerTypeFilter] += 1;
    };
    for (const o of owners ?? []) add(o.owner_type);
    for (const m of missingOwners ?? []) add(missingType(m));
    return result;
  }, [owners, missingOwners]);

  const filteredOwners = useMemo(() => {
    const matches = (o: T) =>
      (activeType === "all" || o.owner_type === activeType) &&
      (!query || o.name.toLowerCase().includes(query) || (o.subtitle ?? "").toLowerCase().includes(query));
    return (owners ?? []).filter(matches);
  }, [owners, activeType, query]);

  const filteredMissing = useMemo(() => {
    const matches = (m: M) =>
      (activeType === "all" || missingType(m) === activeType) &&
      (!query || m.name.toLowerCase().includes(query) || (m.subtitle ?? "").toLowerCase().includes(query));
    return (missingOwners ?? []).filter(matches);
  }, [missingOwners, activeType, query]);

  const isReady = !isLoading && !isError;
  const hasVisible = filteredOwners.length > 0 || filteredMissing.length > 0;

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
  };

  const handleDeleteConfirm = async () => {
    if (ownerToDelete && onDeleteOwner) {
      await onDeleteOwner(ownerToDelete);
      setOwnerToDelete(null);
    }
  };

  return (
    <Card className={`mt-4 border-0 ${className}`.trim()}>
      <Card.Body className={bodyClassName}>
        <Card.Header className="mb-3 bg-secondary d-flex justify-content-between align-items-center flex-wrap gap-2 rounded">
          <div>
            <div className="aa-owner-section-title-wrap d-flex align-items-center gap-2">
              {icon ?? <Users size={20} aria-hidden="true" />}
              <h2 className="aa-owner-section-title m-0 fs-5 fw-bold">{title ?? t("Owner Status")}</h2>
              {owners && (
                <span className="aa-owner-section-count small">
                  ({isFiltering ? `${filteredOwners.length} / ${owners.length}` : owners.length})
                </span>
              )}
            </div>
            <p className="aa-owner-section-description mt-1 mb-0 small w-100 text-light">
              {description ?? t("ESI synchronization status of your linked owners.")}
            </p>
          </div>

          {onUpdateAll && hasOwners && (
            <Button
              variant="secondary"
              size="sm"
              className="d-flex align-items-center gap-1"
              disabled={isUpdatingAll || globalCooldown > 0}
              onClick={onUpdateAll}
            >
              {isUpdatingAll ? <span className="spinner-border spinner-border-sm" /> : <RotateCw size={14} />}
              <span>
                {globalCooldown > 0
                  ? t("Update All ({{seconds}}s)", { seconds: globalCooldown })
                  : t("Update All")}
              </span>
            </Button>
          )}
        </Card.Header>

        {feedbackMessage && (
          <Alert
            variant={feedbackMessage.variant}
            className="py-2 mb-3"
            dismissible={Boolean(onDismissFeedback)}
            onClose={onDismissFeedback}
          >
            {feedbackMessage.text}
          </Alert>
        )}

        {enableFilters && isReady && (hasOwners || hasMissing) && (
          <OwnerFilterBar
            search={search}
            onSearchChange={setSearch}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            counts={counts}
            searchPlaceholder={searchPlaceholder}
          />
        )}

        {isLoading && (
          <div className="aa-loader-container">
            <span className="spinner-border" />
            <span>{t("Loading update statuses…")}</span>
          </div>
        )}

        {isError && (
          <Card className="bg-secondary border-0 shadow-sm" role="alert">
            <Card.Body className="aa-owner-error">{errorMessage ?? t("Failed to load update status.")}</Card.Body>
          </Card>
        )}

        {isReady && !hasOwners && !hasMissing && (
          <Card className="bg-secondary text-light border-0 shadow-sm">
            <Card.Body className="aa-owner-empty py-4 px-3 text-center small">
              {emptyMessage ?? t("Nothing to show.")}
            </Card.Body>
          </Card>
        )}

        {isReady && (hasOwners || hasMissing) && !hasVisible && (
          <Card className="bg-secondary text-light border-0 shadow-sm">
            <Card.Body className="aa-owner-empty py-4 px-3 text-center small">
              <p className="mb-2">{t("No matching owners found.")}</p>
              <Button variant="outline-light" size="sm" onClick={resetFilters}>
                {t("Reset filters")}
              </Button>
            </Card.Body>
          </Card>
        )}

        {isReady && filteredOwners.length > 0 && (
          <div className="aa-owner-grid d-grid gap-3">
            {filteredOwners.map((owner) => (
              <BaseOwnerCard<T>
                key={`${owner.owner_type ?? "owner"}-${owner.id}`}
                owner={owner}
                isUpdating={updatingOwnerId === owner.id}
                cooldown={ownerCooldowns[owner.id] ?? 0}
                onTriggerUpdate={!isUpdatable || isUpdatable(owner) ? onTriggerSingleUpdate : undefined}
                onDeleteClick={onDeleteOwner && (!isDeletable || isDeletable(owner)) ? setOwnerToDelete : undefined}
                className={cardClassName}
                renderCustomContent={renderCustomCardContent}
                renderActions={renderCardActions}
              />
            ))}
          </div>
        )}

        {isReady && filteredMissing.length > 0 && (
          <>
            <Card.Header className="aa-owner-section-title-wrap mt-4 mb-2 rounded d-flex align-items-center gap-2">
              <div>
                <div className="aa-owner-section-title-wrap d-flex align-items-center gap-2">
                  <UserRoundX size={20} aria-hidden="true" />
                  <h2 className="aa-owner-section-title m-0 fs-5 fw-bold">
                    {missingSectionTitle ?? t("Missing in {{app}}", { app: appName })}
                  </h2>
                  <span className="aa-owner-section-count small">({filteredMissing.length})</span>
                </div>
                <p className="aa-owner-section-description mt-1 mb-0 small w-100 text-light">
                  {missingSectionDescription ?? t("The following characters belong to you but are not registered.")}
                </p>
              </div>
            </Card.Header>
            <div className="aa-owner-grid d-grid gap-3">
              {filteredMissing.map((missing) => (
                <MissingOwnerCard<M>
                  key={`${missingType(missing)}-${missing.id}`}
                  missing={missing}
                  appName={appName}
                  actionUrl={missingActionUrl}
                  actionLabel={missingActionLabel}
                />
              ))}
            </div>
          </>
        )}

        {onDeleteOwner && (
          <BaseModal
            show={Boolean(ownerToDelete)}
            onHide={() => !isDeleting && setOwnerToDelete(null)}
            centered
            bodyClassName={deleteModalBodyClassName}
            title={
              <div className="d-flex align-items-center gap-2 text-danger">
                <Trash2 size={20} />
                <span>{deleteModalTitle ?? t("Delete Owner")}</span>
              </div>
            }
            footer={
              <div className="d-flex align-items-center justify-content-end gap-2 w-100">
                <Button variant="secondary" onClick={() => setOwnerToDelete(null)} disabled={isDeleting}>
                  {t("Cancel")}
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="d-flex align-items-center gap-1"
                >
                  <Trash2 size={14} />
                  <span>{isDeleting ? t("Deleting…") : t("Confirm Delete")}</span>
                </Button>
              </div>
            }
          >
            <div className="p-3 d-flex align-items-start gap-3">
              <AlertTriangle className="text-danger flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="fw-semibold mb-1">
                  {t("Are you sure you want to delete owner '{{name}}'?", { name: ownerToDelete?.name })}
                </p>
                <div className="small text-muted">
                  {ownerToDelete && deleteModalDescription
                    ? deleteModalDescription(ownerToDelete)
                    : t("This action cannot be undone.")}
                </div>
              </div>
            </div>
          </BaseModal>
        )}
      </Card.Body>
    </Card>
  );
}
