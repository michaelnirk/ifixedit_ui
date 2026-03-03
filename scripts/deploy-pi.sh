#!/usr/bin/env bash
set -euo pipefail

log() {
	echo "[deploy-pi] $*"
}

fail() {
	echo "[deploy-pi] ERROR: $*" >&2
	exit 1
}

require_cmd() {
	command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

ensure_git_safe_directory() {
	if git status --porcelain >/dev/null 2>&1; then
		return
	fi

	local existing_safe_dirs
	existing_safe_dirs="$(git config --global --get-all safe.directory 2>/dev/null || true)"
	if ! printf '%s\n' "$existing_safe_dirs" | grep -Fxq "$REPO_DIR"; then
		log "Adding git safe.directory for '$REPO_DIR'"
		git config --global --add safe.directory "$REPO_DIR" || fail "Unable to add git safe.directory. Run: git config --global --add safe.directory $REPO_DIR"
	fi

	git status --porcelain >/dev/null 2>&1 || fail "Git still cannot access repository safely. Verify ownership/permissions for $REPO_DIR"
}

require_cmd git
require_cmd pnpm

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="${REPO_DIR:-$(cd "$SCRIPT_DIR/.." && pwd)}"
BRANCH="${BRANCH:-master}"
DEPLOY_DIR="${DEPLOY_DIR:-/var/www/ifixedit_ui}"
DIST_DIR="${DIST_DIR:-dist}"
RUN_TESTS="${RUN_TESTS:-true}"
RUN_COVERAGE="${RUN_COVERAGE:-false}"
INSTALL_CMD="${INSTALL_CMD:-pnpm install --frozen-lockfile}"
BUILD_CMD="${BUILD_CMD:-pnpm build}"
TEST_CMD="${TEST_CMD:-pnpm test}"
COVERAGE_TEST_CMD="${COVERAGE_TEST_CMD:-pnpm run test:coverage}"
RESTART_CMD="${RESTART_CMD:-sudo systemctl reload nginx}"

if [[ ! -d "$REPO_DIR/.git" ]]; then
	fail "REPO_DIR is not a git repository: $REPO_DIR"
fi

cd "$REPO_DIR"

ensure_git_safe_directory

if [[ -n "$(git status --porcelain)" ]]; then
	fail "Working tree has uncommitted changes. Commit/stash before deploying."
fi

log "Fetching latest changes for branch '$BRANCH'"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

log "Installing dependencies"
eval "$INSTALL_CMD"

if [[ "$RUN_TESTS" == "true" ]]; then
	TEST_COMMAND="$TEST_CMD"
	if [[ "$RUN_COVERAGE" == "true" ]]; then
		TEST_COMMAND="$COVERAGE_TEST_CMD"
	fi

	log "Running tests"
	eval "$TEST_COMMAND"
fi

log "Building app"
eval "$BUILD_CMD"

if [[ ! -d "$DIST_DIR" ]]; then
	fail "Build output directory not found: $DIST_DIR"
fi

log "Deploying '$DIST_DIR' to '$DEPLOY_DIR'"
if command -v rsync >/dev/null 2>&1; then
	sudo mkdir -p "$DEPLOY_DIR"
	sudo rsync -a --delete "$DIST_DIR/" "$DEPLOY_DIR/"
else
	log "rsync not found, using cp fallback"
	sudo mkdir -p "$DEPLOY_DIR"
	sudo rm -rf "$DEPLOY_DIR"/*
	sudo cp -r "$DIST_DIR"/. "$DEPLOY_DIR"/
fi

if [[ -n "$RESTART_CMD" ]]; then
	log "Running restart command"
	eval "$RESTART_CMD"
fi

log "Deploy complete"
