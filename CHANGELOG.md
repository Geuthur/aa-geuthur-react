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

## [1.3.1] - 2026-11-08

### Added

- Empty language files for Czech (`cs`) and Slovak (`sk`), created by Weblate; untranslated texts fall back to English
- German translation (`de`) for all texts of the package, translated in Weblate

## [1.3.0] - 2026-11-08

### Added

- `registerI18nResources(i18n)` adds the bundled translations of the package to an i18next instance, for tests or apps that need the texts outside of `AaReactProvider`

### Changed

- The package brings its translations with it: the files `i18n/<lng>/aa-geuthur-react.json` are bundled at build time and `AaReactProvider` registers them with the i18next instance of the app on mount (`addResourceBundle`, texts the app already holds for the namespace are kept). An app lists only `ns: ["translation"]`, loads nothing for the namespace `aa-geuthur-react` and copies no files into its static directory any more. Set `returnEmptyString: false` in the i18next init of the app so untranslated texts fall back to English. The files stay exported under `aa-geuthur-react/i18n/*` for Weblate
- Untranslated texts in the language files are empty strings instead of copies of the English text, so Weblate shows them as untranslated and i18next falls back to `en`; `en` stays the template with key equal value. The scanner (`make translations`) writes new keys that way

## [1.2.0] - 2026-11-08

### Added

- `AuthBase` takes the optional prop `fluidOnSmallScreens`. It drops the minimum width of 640px of the `aa-react container`, so a page fits on a phone narrower than that. Without it the container keeps its width of 640px to 1280px, as before

## [1.1.0] - 2026-11-08

### Added

- `useUserData` and `loadUserData` take an optional type parameter (`useUserData<AppUserData>()`) for apps whose `user/` endpoint delivers fields beyond `UserData`. Without it the hook is typed as before
- `AaReactProvider` takes the optional prop `menuRefetchInterval` (milliseconds). `useMenu` uses it as `refetchInterval`, so menu badges can stay live. Without it the menu is not reloaded, as before

## [1.0.2] - 2026-11-07

### Fixed

- A menu link was highlighted when the current path merely ended with its link, so the root link (`/`) of an app was active on every page. `MenuItem` and `AdministrationMenuItem` now highlight the root link only on the root page and every other link on its page and its sub pages (`isActivePath`)

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
[1.0.2]: https://github.com/Geuthur/aa-geuthur-react/compare/v1.0.1...v1.0.2 "v1.0.2"
[1.1.0]: https://github.com/Geuthur/aa-geuthur-react/compare/v1.0.2...v1.1.0 "v1.1.0"
[1.2.0]: https://github.com/Geuthur/aa-geuthur-react/compare/v1.1.0...v1.2.0 "v1.2.0"
[1.3.0]: https://github.com/Geuthur/aa-geuthur-react/compare/v1.2.0...v1.3.0 "v1.3.0"
[1.3.1]: https://github.com/Geuthur/aa-geuthur-react/compare/v1.3.0...v1.3.1 "v1.3.1"
[in development]: https://github.com/Geuthur/aa-geuthur-react/compare/v1.3.1...HEAD "In Development"
