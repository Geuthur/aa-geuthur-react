# AA Geuthur React<a name="aa-geuthur-react"></a>

[![npm](https://img.shields.io/npm/v/aa-geuthur-react)](https://www.npmjs.com/package/aa-geuthur-react)
[![Checks](https://github.com/Geuthur/aa-geuthur-react/actions/workflows/checks.yml/badge.svg)](https://github.com/Geuthur/aa-geuthur-react/actions/workflows/checks.yml)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Shared React base for the [Alliance Auth](https://gitlab.com/allianceauth/allianceauth) apps by Geuthur: the table and modal components, loaders, the navigation menu, hooks, the page layout and the API client that every app with a React frontend uses. The apps install the package and extend it instead of copying the files.

______________________________________________________________________

<!-- mdformat-toc start --slug=github --maxlevel=6 --minlevel=1 -->

- [AA Geuthur React](#aa-geuthur-react)
  - [Installation](#installation)
  - [Setup](#setup)
    - [Provider and routing](#provider-and-routing)
    - [Styles](#styles)
    - [Translations](#translations)
    - [API client](#api-client)
    - [ESLint rule](#eslint-rule)
  - [Components](#components)
    - [BaseTable](#basetable)
    - [BaseModal](#basemodal)
    - [Loaders](#loaders)
    - [BaseSectionHeader](#basesectionheader)
    - [Menu](#menu)
    - [Pages](#pages)
  - [Hooks](#hooks)
  - [Utils](#utils)
  - [Types of the API contract](#types-of-the-api-contract)
  - [Extending instead of copying](#extending-instead-of-copying)
  - [Development](#development)
  - [Release](#release)
  - [Contributing](#contributing)

<!-- mdformat-toc end -->

## Installation<a name="installation"></a>

```shell
npm install aa-geuthur-react
```

The package is built only at build time of the app, the users of the app get the compiled frontend inside the Python package. It ships ESM with type declarations and expects these peer dependencies in the app: `react`, `react-dom`, `react-bootstrap`, `react-router-dom`, `@tanstack/react-query`, `@tanstack/react-table`, `react-i18next`, `i18next`, `lucide-react`, `js-cookie`, `nuqs` and `openapi-fetch`.

## Setup<a name="setup"></a>

### Provider and routing<a name="provider-and-routing"></a>

The menus, hooks and pages need the names of the app. Wrap the routing with `AaReactProvider`:

```tsx
import { AaReactProvider, AuthBase, ErrorPage } from "aa-geuthur-react";

<AaReactProvider projectName="example" appName="aa-example">
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/example/" element={<AuthBase />}>
          <Route index element={<MainPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
</AaReactProvider>;
```

- `projectName` is the URL prefix of the app (`/example/api/menu/`).
- `appName` is the name of the package (`aa-example`).
- `menuRefetchInterval` (optional, milliseconds) lets `useMenu` reload the menu in that interval, so badges stay live. Off by default.
- `useAaReact()` returns both inside the provider and throws outside of it.

### Styles<a name="styles"></a>

The components use Bootstrap utilities and a few global classes (`aa-table-*`, `aa-react.container`, `aa-shake`, `aa-menu-badge-pulse`, `aa-nav-danger`, `aa-tooltip`). Import the stylesheet once, before the stylesheet of the app so the app can override it:

```ts
import "aa-geuthur-react/styles.css";
import "@/Styles/index.css";
```

### Translations<a name="translations"></a>

Every text of the package lives in the i18next namespace `aa-geuthur-react` and is bundled into the package. `AaReactProvider` registers the translations with the i18next instance of the app when it mounts (`addResourceBundle`, texts the app already has for the namespace are kept), so the app lists only its own namespace and copies nothing. Untranslated texts are empty strings, so set `returnEmptyString: false` and i18next falls back to English:

```ts
i18n.use(Backend).use(initReactI18next).init({
  lng: djangoLanguage,
  fallbackLng: "en",
  ns: ["translation"],
  defaultNS: "translation",
  returnEmptyString: false,
  backend: {
    loadPath: `/static/${ProjectName}/i18n/{{lng}}/{{ns}}.json`,
  },
});
```

The constants `I18N_NAMESPACE` (`aa-geuthur-react`) and `I18N_FALLBACK_NAMESPACE` (`translation`) are exported. Menu link names come from the app, so the menu tries the package namespace first and the namespace of the app second. `registerI18nResources(i18n)` adds the translations to an instance outside of the provider, e.g. in a test.

The source files `i18n/<lng>/aa-geuthur-react.json` (12 languages: `en`, `de`, `es`, `fr-FR`, `it-IT`, `ja`, `ko-KR`, `nl-NL`, `pl-PL`, `ru`, `uk`, `zh-Hans`) are translated in [Weblate](https://weblate.geuthur.de/projects/allianceauth/aa-geuthur-react/); `en` is the template with key equal value, `make translations` adds new keys empty to every other language. They stay exported as `aa-geuthur-react/i18n/<lng>/aa-geuthur-react.json`.

### API client<a name="api-client"></a>

`createApiClient<paths>()` creates an [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) client with `baseUrl: "/"`, `credentials: "same-origin"` and the Django CSRF token (`csrftoken` cookie) as `X-CSRFToken` header. The app passes the `paths` type generated from its OpenAPI schema:

```ts
import { createApiClient } from "aa-geuthur-react";
import type { paths } from "@/Api/OpenApi";

export const apiClient = createApiClient<paths>();
```

`loadMenu(projectName)` and `loadUserData(projectName)` call the endpoints every app provides (`<project>/api/menu/` and `<project>/api/user/`) and are used by `useMenu` and `useUserData`. `queryKeys` holds the query keys `Menu`, `User` and `UserSettings`.

### ESLint rule<a name="eslint-rule"></a>

The rule `import-headings` groups imports under heading comments like isort does. In `eslint.config.js` of the app:

```js
import importHeadingsRule from "aa-geuthur-react/eslint-rules/import-headings";

const importHeadingsPlugin = { rules: { "import-headings": importHeadingsRule } };
// plugins: { "import-headings": importHeadingsPlugin }
// rules: { "import-headings/import-headings": ["error", { groups: [{ heading: "// React", pattern: "^react($|/)" }, ...] }] }
```

## Components<a name="components"></a>

### BaseTable<a name="basetable"></a>

Sortable, filterable and paginated table on [TanStack Table v9](https://tanstack.com/table/v9) with CSV export.

```tsx
import { BaseTable, createBaseColumnHelper } from "aa-geuthur-react";

const columnHelper = createBaseColumnHelper<Row>();
const columns = [columnHelper.accessor("name", { header: "Name" })];

<BaseTable columns={columns} data={rows} />;
```

| Prop                                                                                                                  | Description                                                                                                                                             |
| :-------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `columns`, `data`                                                                                                     | Column definitions (`BaseColumnDef`) and rows                                                                                                           |
| `isLoading`, `loadingText`, `isFetching`, `isError`                                                                   | Loading state (dims the rows and locks the controls), refresh indicator and error row                                                                   |
| `serverPagination`                                                                                                    | `{ page, pageSize, total, onPageChange, onPageSizeChange, totalText? }`: the server pages the rows; sorting, filters and CSV export are off             |
| `initialState`, `pageSizeOptions`, `enableFilters`, `striped`, `hover`, `variant` (`default`, `light`), `debugTable`  | Table options                                                                                                                                           |
| `rowSelection`, `onRowSelectionChange`, `enableRowSelection`, `getRowId`, `onRowClick`, `getRowClassName`             | Row selection and row handlers                                                                                                                          |
| `emptyText`, `emptyState`, `toolbar`, `footer`, `showFooter`                                                          | Empty row text or element, slot above the table, slot below the page controls, column `footer` definitions as summary row                               |
| `className`, `tableClassName`, `headerClassName`, `bodyClassName`, `rowClassName`, `footClassName`, `footerClassName` | Extra classes for the shell, `<table>`, `<thead>`, `<tbody>`, every row, the `<tfoot>` summary row and the footer with page size, status and pagination |
| `exportFileName`                                                                                                      | File name of the CSV export                                                                                                                             |

Column `meta` supports `align` (`left`, `right`, `center`) and `filterOptionLabel` for the select filter. Also exported: `BaseTableHeader`, `BaseTablePages`, `BaseTableForm`, `BaseToolbar`, the filters (`Filter`, `TextFilter`, `SelectFilter`, `NumberFilter`, `BoolFilter`), `baseTableFeatures`, `exportToCSV`.

### BaseModal<a name="basemodal"></a>

Bootstrap modal in two variants. Both share `size` (`ModalSize`), `centered`, `scrollable`, `backdrop`, `restoreFocus`, `closeButton`, `closeText`, `closeVariant`, `className`, `bodyClassName`, `titleClassName`, `onShow`, `onEnter`, `onExited`.

- Default: `show`, `onHide`, `title`, `children`, `footer` (replaces the close button), `hideFooter`.
- Confirm (`variant="confirm"`): `data` (`ModalData`), `showModal`, `setShowModal`, `onApprove({ url, formData })`, `isPending`, `validate`, `initialFormData`, `title`, `confirmText`, `confirmVariant`; `children` may be a render function `({ formData, onChange }) => ...` for a form.

`useApproveMutation(queryKey)` and `useFormApproveMutation(queryKey)` post to the modal URL and invalidate the given queries. `useModalQueryState(modalKey, entityKey)` keeps the open modal and entity id in the URL with [nuqs](https://nuqs.dev/).

### Loaders<a name="loaders"></a>

- `FetchingLoader`: centered spinner; `message`, `className`, `spinnerClassName`.
- `ErrorLoader`: warning icon; `title`, `message`, `className`, `iconClassName`.
- `ErrorBoundary`: catches render errors of its children and shows error and component stack; `traceClassName`.

### BaseSectionHeader<a name="basesectionheader"></a>

Card header with a title (`name`) and buttons or badges as `children`.

### Menu<a name="menu"></a>

- `AuthLeftMenuAsync` and `AuthRightMenuAsync` load the menu with `useMenu` and render the links into the `nav-left` and `nav-right` elements of the Alliance Auth template.
- `AuthLeftMenu` and `AuthRightMenu` render given links (`data`, `isLoading`, `error`).
- `MenuItem` renders one link: internal links as router links below the project prefix, external links as `href`, a `badge` count in red (pulsing while `has_errors` is set). A link to `administration` renders as `AdministrationMenuItem` with a shield icon.
- `toProjectPath(projectName, link)` builds the route of a link.

### Pages<a name="pages"></a>

- `AuthBase`: layout of a page; renders the menus and the routed page (`Outlet`, or `children`) inside the `aa-react container` wrapper (640px to 1280px wide) with an `ErrorBoundary`. `className` adds classes to the wrapper. `fluidOnSmallScreens` (optional, off by default) drops the minimum width of 640px so the page fits on phones narrower than that.
- `ErrorPage`: 404 page.

## Hooks<a name="hooks"></a>

- `useUserData()`: the current user (`{ user: UserData }`), cached for 5 minutes.
- `useMenu()`: the menu links (`MenuSchema`), one retry.
- `useCooldown()`: `{ seconds, start(duration) }`, counts down once per second.
- `useOwnerCooldowns()`: `{ cooldowns, start(ownerId, duration) }`, one cooldown per owner id.
- `useFeedback(timeoutMs)`: `{ feedback, showFeedback(variant, text), clearFeedback() }`, clears itself after the timeout.

## Utils<a name="utils"></a>

- `format`: `formatDate`, `formatRelativeTime`, `formatEta`, `formatNumber`, `formatCompactNumber`, `formatIsk` (locale from i18next, `en` fallback).
- `eveOnline`: `shipImageUrl`, `characterImageUrl`, `corporationImageUrl`, `allianceImageUrl`, `itemImageUrl`, `getSecColor`, `formatEveTime`, `zKillboardLink`, `renderCharacterPortrait`.
- `bootsTrap`: `renderTooltip(message, children)`, `toolTipContainer(message)`.
- `general`: `renderLink`, `renderShipImage`, `renderHtml`.

## Types of the API contract<a name="types-of-the-api-contract"></a>

The package defines the types of the endpoints every app provides and does not use the generated OpenAPI types of an app: `MenuLink`, `MenuSchema`, `UserData`, `UserSettings`, `UserSettingsUpdateRequest`, `ModalSchema` (`ModalData`), `ErrorSchema`, `ActionResponse`. The Ninja schemas of the apps follow these types; both change together.

## Extending instead of copying<a name="extending-instead-of-copying"></a>

1. The files of this package are never changed in an app. What an app needs differently is built in the app by wrapping or composing: `const LedgerTable = (props) => <BaseTable showFooter {...props} />`.
1. Overrides come from outside: every component takes `className` props per area and slots (`toolbar`, `footer`, `emptyState`). Bootstrap classes of the app override the look without touching the package.
1. A new capability comes into this package as a pull request, as an opt-in prop with the current behaviour as default. Then a release and a Dependabot bump in every app. No app runs a special version.
1. Contracts are types: the package defines `MenuLink`, `MenuSchema`, `UserData` and `UserSettings`; the Python side delivers matching schemas.

## Development<a name="development"></a>

```shell
npm ci
make lint        # ESLint and Stylelint
make test        # Vitest
make build       # types and ESM bundle into dist/
make translations
```

`make` lists every target. The tests live in `src/__tests__/`, the test of the ESLint rule in `eslint-rules/`.

## Release<a name="release"></a>

1. `make prepare-release`: scans the translations, moves the changelog entries into a version section and sets the version in `package.json` and `package-lock.json`.
1. Merge the `[RELEASE]` pull request.
1. Create the tag `v<version>` and a GitHub release. The `Release` workflow checks that the version matches the tag, runs lint, tests and build, attaches the tarball to the release and publishes to npm with [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC from GitHub Actions, no token). The trusted publisher on npmjs.com is this repository with the workflow `release.yml` and the environment `npm-release`.

Translations: [![Translations](https://weblate.geuthur.de/widget/allianceauth/aa-geuthur-react/multi-auto.svg)](https://weblate.geuthur.de/engage/allianceauth/)

## Contributing<a name="contributing"></a>

You want to improve the project?
Please ensure you read the [Contribution Guidelines]

<!-- MD Links -->

[contribution guidelines]: https://github.com/Geuthur/aa-geuthur-react/blob/master/CONTRIBUTING.md "Contribution Guidelines"
