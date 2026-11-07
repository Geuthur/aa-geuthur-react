# Contributing to This Project<a name="contributing-to-this-project"></a>

There are many ways to Contribute to this Project:

- Reporting bugs
- Translating the package
- Suggestions
- Optimize Code

and many more feel free to make a pull request.

<!-- mdformat-toc start --slug=github --maxlevel=6 --minlevel=1 -->

- [Contributing to This Project](#contributing-to-this-project)
  - [Extending instead of copying](#extending-instead-of-copying)
  - [Tests](#tests)
  - [Branching and Pull Requests](#branching-and-pull-requests)
  - [Translation](#translation)
  - [Development](#development)
    - [Licence](#licence)
    - [Code of Conduct](#code-of-conduct)
    - [Environment](#environment)
    - [Makefile System](#makefile-system)
    - [Release](#release)

<!-- mdformat-toc end -->

## Extending instead of copying<a name="extending-instead-of-copying"></a>

The apps never change the files of this package. What an app needs differently is built in the app by wrapping or composing (`const LedgerTable = (props) => <BaseTable showFooter {...props} />`) or through the `className` props and slots of the components. A capability that no prop offers comes into this package as a pull request: an opt-in prop with the current behaviour as default, then a release and a Dependabot bump in every app.

## Tests<a name="tests"></a>

Please add new unit tests or update existing ones to cover any changes you make. The tests run with [Vitest] and [Testing Library] in `src/__tests__/`, the test of the ESLint rule next to the rule in `eslint-rules/`.

## Branching and Pull Requests<a name="branching-and-pull-requests"></a>

To submit code changes, fork the repository and create your branches from `master`.
We recommend using a separate branch for each feature or change. Keep your fork's
`master` branch up to date with the main repository to reduce merge conflicts.

If you're planning a new feature, open an Issue (type: Feature Request) first to
discuss and confirm that the idea fits the project.

You can open a merge request early to indicate you're working on something. If a
merge request is not ready for review, mark it as DRAFT. Remove the DRAFT status
when the request is ready for review.

Every pull request adds an entry to `CHANGELOG.md`.

## Translation<a name="translation"></a>

This package supports full translation, with all translations managed on my [Weblate] instance. If you would like to contribute or improve an existing translation, please feel free to register and get started. New keys are added by the scanner (`make translations`) in the pull request, the files in `i18n/` are not edited by hand.

## Development<a name="development"></a>

### Licence<a name="licence"></a>

This project is licensed under the GNU General Public License v3.0 (GPLv3). See the
[LICENSE](LICENSE) file for the full terms and conditions.

By contributing code to this project, you agree to license your contributions under
the same GPLv3 license that covers the project. In other words, your submitted
code will be made available under GPLv3 as part of the project.

### Code of Conduct<a name="code-of-conduct"></a>

The project's contributor behaviour is governed by a Code of Conduct. Please read the
[CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) file for the full policy and expectations.

By contributing to this project you agree to abide by the Code of Conduct. If you observe
behaviour that violates the Code of Conduct, please follow the reporting instructions
contained in `CODE_OF_CONDUCT.md` so the project maintainers can address the issue.

### Environment<a name="environment"></a>

Node.js 24 (LTS) and npm are enough. Install the dependencies with `npm ci` and the pre-commit hooks with `pre-commit install` if you have [pre-commit] available.

### Makefile System<a name="makefile-system"></a>

The project uses a `Makefile` to simplify common tasks. Run `make` in the project root to list all available targets.

- `make npm-install` - Install the dependencies from the lock file
- `make lint` - Run ESLint and Stylelint (read-only)
- `make eslint` - Run ESLint with auto-fix
- `make typecheck` - Run the TypeScript type check
- `make test` - Run the unit tests
- `make build` - Build types and ESM bundle into `dist/`
- `make translations` - Scan the sources and update `i18n/<lng>/aa-geuthur-react.json`
- `make checks` - Run lint, test and build like CI
- `make prepare-release` - Scan translations, set the version and the `CHANGELOG.md` section

### Release<a name="release"></a>

1. `make prepare-release` with the new version: it scans the translations, moves the changelog entries into a version section and sets the version in `package.json` and `package-lock.json`.
1. Open a pull request with the `[RELEASE]` commit and merge it.
1. Create the tag `v<version>` and a GitHub release for it. The `Release` workflow builds the package, attaches the tarball to the release and publishes it to npm with trusted publishing (no token).

<!-- Links -->

[pre-commit]: https://pre-commit.com/ "pre-commit"
[testing library]: https://testing-library.com/ "Testing Library"
[vitest]: https://vitest.dev/ "Vitest"
[weblate]: https://weblate.geuthur.de/ "Weblate"
