# Changelog

## [In Development] - Unreleased

<!--
Section Order:

### Added
### Fixed
### Changed
### Removed
-->

<!-- Your changes go here -->

## [1.0.1] - 2026-11-07

### Fixed

- `renderTooltip` imported `OverlayTrigger` and `Tooltip` through the sub paths `react-bootstrap/OverlayTrigger` and `react-bootstrap/Tooltip`. Node refuses such directory imports, so Vitest in an app could not load the package (`ERR_UNSUPPORTED_DIR_IMPORT`). The built package now imports them from `react-bootstrap` only
- The ESLint rule config groups third-party stylesheets such as `aa-geuthur-react/styles.css` under `// Styles` instead of `// Third Party`

## [1.0.0] - 2026-11-07

### Added

- First release of the shared React base of the Alliance Auth apps by Geuthur, taken from the template [aa-example](https://github.com/Geuthur/aa-example) (state of PR #86 to #89):
  - `BaseTable` stack on TanStack Table v9 (`BaseTable`, `BaseTableHeader`, `BaseTablePages`, `BaseTableForm`, `BaseToolbar`, the filters, `baseTableFeatures`, `createBaseColumnHelper`, `exportToCSV`) with `className` props per area and the slots `toolbar`, `footer` and `emptyState`
  - `BaseModal` (default and confirm variant), `useApproveMutation`, `useFormApproveMutation` and `useModalQueryState`
  - `FetchingLoader`, `ErrorLoader`, `ErrorBoundary` and `BaseSectionHeader`
  - Menu: `AuthLeftMenu`, `AuthRightMenu`, `AuthLeftMenuAsync`, `AuthRightMenuAsync`, `MenuItem`, `AdministrationMenuItem`, `useMenu`
  - Hooks: `useCooldown`, `useOwnerCooldowns`, `useFeedback`, `useUserData`
  - Pages: `AuthBase` with the `aa-react container` wrapper (640px to 1280px) and `ErrorPage` (404)
  - Utils: `format`, `eveOnline`, `bootsTrap`, `general`
  - `createApiClient<paths>()`: `openapi-fetch` client with the Django CSRF header; `loadMenu`, `loadUserData` and `queryKeys` for the endpoints every app provides
  - Types of the API contract: `MenuLink`, `MenuSchema`, `UserData`, `UserSettings`, `UserSettingsUpdateRequest`, `ModalSchema`, `ErrorSchema`, `ActionResponse`
  - `AaReactProvider` and `useAaReact` for the names of the app (`projectName`, `appName`)
  - Styles in `aa-geuthur-react/styles.css` (tables, filters, page container, loader, menu badge and tooltip)
  - ESLint rule `import-headings` (`aa-geuthur-react/eslint-rules/import-headings`)
  - Translations in the i18next namespace `aa-geuthur-react` (`i18n/<lng>/aa-geuthur-react.json`, 12 languages)

### Changed

- Compared with the copies in the apps: the menus and hooks read the app names from `AaReactProvider` instead of `@/constants`; the tooltip helper uses the global classes `aa-tooltip` and `aa-tooltip-container` instead of a CSS module; every text uses the namespace `aa-geuthur-react`, menu link names fall back to the `translation` namespace of the app

<!-- Links -->

[1.0.0]: https://github.com/Geuthur/aa-geuthur-react/releases/tag/v1.0.0 "v1.0.0"
[1.0.1]: https://github.com/Geuthur/aa-geuthur-react/compare/v1.0.0...v1.0.1 "v1.0.1"
[in development]: https://github.com/Geuthur/aa-geuthur-react/compare/v1.0.1...HEAD "In Development"
