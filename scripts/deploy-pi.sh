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

require_cmd git
require_cmd pnpm

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="${REPO_DIR:-$(cd "$SCRIPT_DIR/.." && pwd)}"
BRANCH="${BRANCH:-master}"
DEPLOY_DIR="${DEPLOY_DIR:-/var/www/ifixedit_ui}"
DIST_DIR="${DIST_DIR:-dist}"
RUN_TESTS="${RUN_TESTS:-true}"
INSTALL_CMD="${INSTALL_CMD:-pnpm install --frozen-lockfile}"
BUILD_CMD="${BUILD_CMD:-pnpm build}"
TEST_CMD="${TEST_CMD:-pnpm test}"
RESTART_CMD="${RESTART_CMD:-sudo systemctl reload nginx}"

if [[ ! -d "$REPO_DIR/.git" ]]; then
	fail "REPO_DIR is not a git repository: $REPO_DIR"
fi

cd "$REPO_DIR"

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
	log "Running tests"
	eval "$TEST_CMD"
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
