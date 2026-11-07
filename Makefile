# Makefile for aa-geuthur-react

SHELL := /bin/bash

TEXT_BOLD := $(shell printf "\033[1m")
TEXT_BOLD_END := $(shell printf "\033[22m")
TEXT_UNDERLINE := $(shell printf "\033[4m")
TEXT_UNDERLINE_END := $(shell printf "\033[24m")
TEXT_COLOR_RED := $(shell printf "\033[0;31m")
TEXT_RESET := $(shell printf "\033[0m")

GIT_REPOSITORY := https://github.com/Geuthur/aa-geuthur-react

.DEFAULT_GOAL := help

# Install the dependencies from the lock file
.PHONY: npm-install
npm-install:
	@echo "Installing npm dependencies…"
	@npm ci

# Lint (read-only verification)
.PHONY: lint
lint:
	@echo "Running lint verification"
	@npm run lint
	@echo "Lint verification completed"

# ESLint with auto-fix
.PHONY: eslint
eslint:
	@echo "Running ESLint with auto-fix"
	@npx eslint . --fix
	@echo "ESLint completed"

# Type check without emitting
.PHONY: typecheck
typecheck:
	@echo "Running TypeScript type check"
	@npm run typecheck
	@echo "Type check completed"

# Unit tests
.PHONY: test
test:
	@echo "Running tests"
	@npm test
	@echo "Tests completed"

# Build the package (types and ESM bundle into dist/)
.PHONY: build
build:
	@echo "Building the package"
	@npm run build
	@echo "Build completed"

# Scan the sources and update i18n/<lng>/aa-geuthur-react.json
.PHONY: translations
translations:
	@echo "Scanning and building translations"
	@npm run buildTranslations
	@echo "Translations completed"

# Remove build artifacts
.PHONY: clean
clean:
	@echo "Cleaning build artifacts"
	@rm -rf dist coverage
	@echo "Clean completed"

# Everything that runs in CI
.PHONY: checks
checks: lint test build

# Prepare a new release: version in package.json and package-lock.json, CHANGELOG section and links
.PHONY: prepare-release
prepare-release: translations
	@echo "Preparing a release…"
	@read -p "New Version Number: " new_version; \
	previous_version=$$(grep -E '^\[[0-9]+(\.[0-9]+){0,2}\]:' CHANGELOG.md | sed -E 's/^\[([0-9]+(\.[0-9]+){0,2})\]:.*/\1/' | sort -V | awk -v current="$$new_version" '$$0 != current { previous=$$0 } END { print previous }'); \
	echo "Previous release version detected: $$previous_version"; \
	if ! grep -qE "^## \[$$new_version\]" CHANGELOG.md; then \
		echo "$(TEXT_COLOR_RED)$(TEXT_BOLD)Version $$new_version section not found in CHANGELOG.md!$(TEXT_RESET)"; \
		echo "Adding a new section for version $$new_version."; \
		sed -i "/<!-- Your changes go here -->/a\\\n## [$$new_version] - $$(date '+%Y-%m-%d')" CHANGELOG.md; \
	fi; \
	if ! grep -qE "^\[$$new_version\]:" CHANGELOG.md; then \
		echo "Adding the reference for version $$new_version."; \
		if [ -n "$$previous_version" ]; then \
			echo "[$$new_version]: $(GIT_REPOSITORY)/compare/v$$previous_version...v$$new_version \"v$$new_version\"" >> CHANGELOG.md; \
		else \
			echo "[$$new_version]: $(GIT_REPOSITORY)/releases/tag/v$$new_version \"v$$new_version\"" >> CHANGELOG.md; \
		fi; \
	fi; \
	sed -i -E "\|\[in development\]\: |s|\]\: .*|\]\: $(GIT_REPOSITORY)/compare/v$$new_version...HEAD \"In Development\"|g" CHANGELOG.md; \
	npm version "$$new_version" --no-git-tag-version --allow-same-version; \
	echo "Updated version in $(TEXT_BOLD)package.json$(TEXT_BOLD_END) and $(TEXT_BOLD)package-lock.json$(TEXT_BOLD_END)"

# Help
.PHONY: help
help:
	@echo ""
	@echo "$(TEXT_BOLD)aa-geuthur-react$(TEXT_BOLD_END) Makefile"
	@echo ""
	@echo "$(TEXT_BOLD)Usage:$(TEXT_BOLD_END)"
	@echo "  make [command]"
	@echo ""
	@echo "$(TEXT_BOLD)Commands:$(TEXT_BOLD_END)"
	@echo "  $(TEXT_UNDERLINE)General:$(TEXT_UNDERLINE_END)"
	@echo "    help                Show this help message"
	@echo "    npm-install         Install the dependencies from the lock file"
	@echo "    prepare-release     Scan translations, set the version and the CHANGELOG section"
	@echo ""
	@echo "  $(TEXT_UNDERLINE)Checks:$(TEXT_UNDERLINE_END)"
	@echo "    lint                Run ESLint and Stylelint (read-only)"
	@echo "    eslint              Run ESLint with auto-fix"
	@echo "    typecheck           Run the TypeScript type check"
	@echo "    test                Run the unit tests with Vitest"
	@echo "    checks              Run lint, test and build like CI"
	@echo ""
	@echo "  $(TEXT_UNDERLINE)Build:$(TEXT_UNDERLINE_END)"
	@echo "    build               Build types and ESM bundle into dist/"
	@echo "    translations        Scan the sources and update i18n/<lng>/aa-geuthur-react.json"
	@echo "    clean               Remove dist/ and coverage/"
	@echo ""
