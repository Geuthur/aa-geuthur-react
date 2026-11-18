// Third Party
import { Search } from "lucide-react";
import { Form, InputGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";

// AA Geuthur React
import { FilterButtonGroup, type FilterOption } from "@/Components/Base/FilterButtonGroup";
import { I18N_NAMESPACE } from "@/i18n";

export type OwnerTypeFilter = "all" | "character" | "corporation" | "alliance";

export interface OwnerFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: OwnerTypeFilter;
  onTypeChange: (value: OwnerTypeFilter) => void;
  counts: Record<OwnerTypeFilter, number>;
  searchPlaceholder?: string;
}

/**
 * Type filter (All / Characters / Corporations / Alliances) and name search for owner lists.
 * Only types that actually exist (count > 0) are shown, "All" and the active type are always visible.
 */
export function OwnerFilterBar({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  counts,
  searchPlaceholder,
}: OwnerFilterBarProps) {
  const { t } = useTranslation(I18N_NAMESPACE);

  const options: FilterOption<OwnerTypeFilter>[] = [
    { value: "all", label: t("All"), count: counts.all },
    { value: "character", label: t("Characters"), count: counts.character },
    { value: "corporation", label: t("Corporations"), count: counts.corporation },
    { value: "alliance", label: t("Alliances"), count: counts.alliance },
  ];

  const visibleOptions = options.filter(
    (o) => o.value === "all" || (o.count ?? 0) > 0 || o.value === typeFilter,
  );

  return (
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
      <FilterButtonGroup
        options={visibleOptions}
        value={typeFilter}
        onChange={onTypeChange}
        ariaLabel={t("Filter by owner type")}
      />

      <InputGroup size="sm" className="aa-owner-filter-search">
        <InputGroup.Text>
          <Search size={14} aria-hidden="true" />
        </InputGroup.Text>
        <Form.Control
          type="search"
          value={search}
          placeholder={searchPlaceholder ?? t("Search owners…")}
          aria-label={t("Search owners")}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </InputGroup>
    </div>
  );
}
