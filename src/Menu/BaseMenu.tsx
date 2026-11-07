// React
import { Link, useLocation } from "react-router-dom";

// Third Party
import { ShieldAlert } from "lucide-react";
import { Nav } from "react-bootstrap";
import { useTranslation } from "react-i18next";

// AA Geuthur React
import type { MenuLink } from "@/Api/types";
import { I18N_FALLBACK_NAMESPACE, I18N_NAMESPACE } from "@/i18n";
import { useAaReact } from "@/Provider";

export type MenuLinkItem = MenuLink;

export interface MenuCategory {
  name: string;
  link?: string;
  links?: MenuLinkItem[];
}

export interface MenuProps {
  isLoading: boolean;
  data: Array<MenuCategory | MenuLinkItem>;
  error: boolean;
}

export interface ToPath {
  toPath: (link: string) => string;
}

/** Builds the route of a menu link below the app prefix: `characters/` becomes `/<project>/characters/`. */
export const toProjectPath = (projectName: string, link: string) => {
  const cleanLink = link.replace(/^\/+|\/+$/g, "");
  return cleanLink ? `/${projectName}/${cleanLink}/` : `/${projectName}/`;
};

/**
 * Whether a page belongs to a menu link: the root link of the app only on the root page,
 * every other link on its page and its sub pages (`/example/settings/owners/` highlights `settings/`).
 */
export const isActivePath = (pathname: string, target: string, root: string) =>
  target === root ? pathname === root : pathname.startsWith(target);

// The link names come from the app, so its own namespace is tried after the package namespace.
const linkNamespaces = [I18N_NAMESPACE, I18N_FALLBACK_NAMESPACE];

/** Highlights the administration link in red with a shield icon. */
export const AdministrationMenuItem = ({ link, toPath }: { link: MenuLinkItem } & ToPath) => {
  const { t } = useTranslation(I18N_NAMESPACE);
  const path = useLocation();
  const hit = isActivePath(path.pathname, toPath(link.link ?? ""), toPath(""));

  return (
    <Nav.Item as="li">
      <Nav.Link
        as={Link}
        to={{ pathname: toPath(link.link ?? ""), search: path.search }}
        id={link.name}
        key={link.name}
        active={hit}
        className="aa-nav-danger d-flex align-items-center gap-1"
        data-testid="administration-nav-link"
      >
        <ShieldAlert size={15} className="text-danger flex-shrink-0" />
        <span>{t(link.name, { ns: linkNamespaces, defaultValue: link.name })}</span>
      </Nav.Link>
    </Nav.Item>
  );
};

export const MenuItem = ({ link, toPath }: { link: MenuLinkItem } & ToPath) => {
  const { t } = useTranslation(I18N_NAMESPACE);
  const path = useLocation();
  const hit = isActivePath(path.pathname, toPath(link.link ?? ""), toPath(""));
  const label = t(link.name, { ns: linkNamespaces, defaultValue: link.name });
  const isExternal = Boolean(
    link.is_external || link.link?.startsWith("http://") || link.link?.startsWith("https://"),
  );

  if (isExternal) {
    return (
      <Nav.Item as="li">
        <Nav.Link href={link.link ?? "#"} id={link.name} key={link.name}>
          {label}
        </Nav.Link>
      </Nav.Item>
    );
  }

  const isAdministrationLink = Boolean(
    link.link?.replace(/^\/+|\/+$/g, "") === "administration" ||
      link.name.toLowerCase() === "administration",
  );

  if (isAdministrationLink) {
    return <AdministrationMenuItem link={link} toPath={toPath} />;
  }

  return (
    <Nav.Item as="li">
      <Nav.Link
        as={Link}
        to={{ pathname: toPath(link.link ?? ""), search: path.search }}
        id={link.name}
        key={link.name}
        active={hit}
      >
        {label}
        {link.badge ? (
          <span className={`badge bg-danger ms-1 ${link.has_errors ? "aa-menu-badge-pulse" : ""}`}>
            {link.badge}
          </span>
        ) : null}
      </Nav.Link>
    </Nav.Item>
  );
};

/** Renders every entry with a link as `MenuItem`; categories without a link are skipped. */
export const MenuList = ({ data }: MenuProps) => {
  const { projectName } = useAaReact();
  const toPath = (link: string) => toProjectPath(projectName, link);

  const menuItems = Array.isArray(data) ? data.filter((item): item is MenuLinkItem => !!item.link) : [];

  return (
    <>
      {menuItems.map((item) => (
        <MenuItem key={item.link} link={item} toPath={toPath} />
      ))}
    </>
  );
};
