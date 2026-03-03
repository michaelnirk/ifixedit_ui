# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deploy on Raspberry Pi

You can deploy directly on the Pi with:

`pnpm deploy:pi`

This script will:

- pull the latest code from `origin/master`
- install dependencies
- build the app
- copy `dist/` to `/var/www/ifixedit_ui`

The script is at [scripts/deploy-pi.sh](scripts/deploy-pi.sh) and supports environment overrides:

- `REPO_DIR` (default: repo root)
- `BRANCH` (default: `master`)
- `DEPLOY_DIR` (default: `/var/www/ifixedit_ui`)
- `DIST_DIR` (default: `dist`)
- `RUN_TESTS` (`true`/`false`, default: `true`)
- `RUN_COVERAGE` (`true`/`false`, default: `false`)
- `INSTALL_CMD` (default: `pnpm install --frozen-lockfile`)
- `BUILD_CMD` (default: `pnpm build`)
- `BUILD_NODE_OPTIONS` (default: `--max-old-space-size=1024`, set empty to disable)
- `TEST_CMD` (default: `pnpm test`)
- `COVERAGE_TEST_CMD` (default: `pnpm run test:coverage`)
- `RESTART_CMD` (default: `sudo systemctl reload nginx`)

Example override (skip tests + custom restart):

`RUN_TESTS=false RESTART_CMD="sudo systemctl restart your-service" pnpm deploy:pi`

Example override (run coverage tests before deploy):

`RUN_COVERAGE=true pnpm deploy:pi`

If the Pi runs out of memory during `vite build`, increase heap for that run:

`BUILD_NODE_OPTIONS="--max-old-space-size=1536" pnpm deploy:pi`

Note: the script fails if the repo has uncommitted changes, to prevent accidental overwrite during deploy.
