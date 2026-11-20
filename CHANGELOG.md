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

### Added

- `MenuSchema` has the optional field `modals` (also `null`); apps with their own `MenuModalSchema` pass its type to `useMenu<T>()` and `loadMenu<T>()`, apps without menu modals change nothing

### Fixed

- `useApproveMutation` and `useFormApproveMutation` throw the `error` of the API (otherwise `detail`, otherwise `message`) instead of "Unknown error" for answers in the unified error format

## [1.5.0] - 2026-11-19

### Added

- `initI18n(projectName, rootElementId)` replaces the i18next block in `Main.tsx` of the apps (fixed options including `returnEmptyString: false`, language from the `lang` attribute of the root element); `i18next-http-backend` is a new peer dependency
- `apiErrorMessage(error, fallback)` returns the message of the API for a failed request (`error`, otherwise a string below `detail`, otherwise the fallback); `loadMenu`, `loadUserData`, `loadUserSettings` and `updateUserSettings` throw it instead of only their fixed text
- `loadUserSettings`, `updateUserSettings` and the hook `useUserSettings<T, Body>()` with the optimistic update and rollback for the `settings/` endpoint
- Owner building blocks from the apps: `BaseOwnerSettingsSection`, `BaseOwnerCard`, `MissingOwnerCard`, `OwnerFilterBar` (opt-in `enableFilters`), `UnregisteredModal`, `OwnerPortrait` (`sm`/`md`/`lg`) with global `aa-owner-*` classes, plus `LiveStatusIndicator`, `useLivePing` and `SecurityBadge`; the "Disabled" status badge now uses a readable text colour
- Shared design tokens (104 `--aa-*`/`--font-*` variables with the theme values for Flatly/Darkly and Bootstrap light/dark), the `aa-status-*` classes and the keyframes `aa-pending-ping`, `aa-pending-glow`, `aa-danger-glow` in `styles.css`; the token selectors use `:where()`, so the rules of an app still win and nothing changes until an app removes its copies
- Translations from Weblate: German for the new owner, live status and error texts, first translations for `cs`, `es`, `fr-FR`, `it-IT`, `ja`, `ko-KR`, `nl-NL`, `pl-PL`, `ru`, `sk`, `uk` and `zh-Hans`; untranslated texts still fall back to English

### Fixed

- Development dependencies: `minimatch` 10.2.6 → 11.0.8 (Dependabot alert, DoS via globparts) through `eslint` 10.15.0 and an `overrides` entry for `@typescript-eslint/typescript-estree`; the published package is not affected

## [1.4.0] - 2026-11-13

### Added

- `FilterButtonGroup` component (button group to pick one filter value, with optional icons and counters), moved from aa-fenrir, exported from the package

### Changed

- Language files other than `en` hold real translations only, as Weblate writes them: untranslated texts are no longer empty placeholders but missing, and i18next falls back to `en` through `fallbackLng`. The scanner (`make translations`) maintains only `i18n/en/aa-geuthur-react.json`; the runtime behavior is unchanged, apps need no update
- Development dependencies: `stylelint` 17.16.0 → 18.0.0 and `stylelint-config-standard` 40.0.0 → 41.0.0 (replaces Dependabot PR #1), also in the pre-commit stylelint hook; the existing CSS passes the new rules unchanged, the published package is not affected

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
[1.4.0]: https://github.com/Geuthur/aa-geuthur-react/compare/v1.3.1...v1.4.0 "v1.4.0"
[1.5.0]: https://github.com/Geuthur/aa-geuthur-react/compare/v1.4.0...v1.5.0 "v1.5.0"
[in development]: https://github.com/Geuthur/aa-geuthur-react/compare/v1.5.0...HEAD "In Development"
