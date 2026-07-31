# Baseline

Recorded: 2026-07-31

## Repositories and remotes

- Working folder: `F:\explore\context_mode_fork`
- Fork: `https://github.com/MarcusNeufeldt/context-mode`
- Upstream: `https://github.com/mksglu/context-mode`
- `origin` fetch: HTTPS
- `origin` push: SSH
- `upstream` fetch: HTTPS
- `upstream` push: disabled

## Git baseline

- Fork `main` before synchronization:
  `1854ea52216b56fe99847c32fb725ef3b4abea66`
- Upstream `main`:
  `252e74b7a947b5fbb5624037f8710d3a5319af3c`
- Upstream release `v1.0.169`:
  `589d8214d56740a28b5f7bf63167743d586b0b40`
- The old fork `main` was a strict ancestor of upstream `main`.
- Fork-only commits on old `main`: `0`
- Upstream commits ahead of old fork `main`: `1106`
- Local downstream branch: `downstream/stable`
- Initial downstream documentation commit: `084504b`
- Remote publication: deferred until the SSH YubiKey is reachable

The fork's existing non-default branches were preserved:

- `codex-userprompt-stop-hooks`
- `experiment/codex-memory-governor`
- `fix/codex-memory-roots`
- `mn/codex-compact-slim-restore`
- `next`

## Software baseline

- Package: `context-mode`
- Package version: `1.0.169`
- Node.js: `v24.18.0`
- pnpm: `10.23.0`
- npm: `11.16.0`
- Required Node.js version: `>=22.5.0`

## Installed-runtime boundary

As of 2026-07-31 09:08 +02:00, the Codex `context-mode` MCP registration
launches `F:/explore/context_mode_fork/cli.bundle.mjs` directly. This is a
configuration-only cutover: the checkout was not npm-linked or installed over
the global package, and the existing context-mode storage and Codex hook
configuration were not changed.

The global npm package remains installed at version `1.0.169` as the rollback
runtime. The pre-cutover Codex configuration is preserved at
`C:\Users\marcu\.codex\config.toml.bak-context-mode-local-20260731-0908`.
Already-running Codex tasks retain their existing MCP child until restarted;
new Codex processes load the fork.

## Phase boundary

The documented one-time runtime/Codex import is complete. No maintenance
schedule or patch automation exists.

The local fork baseline is complete. Remote `origin/main` and
`origin/downstream/stable` have not yet been updated; the exact resume commands
and authentication attempt are recorded in `downstream/WORKLOG.md`.

## Dependency baseline

- `package.json` declares pnpm `10.23.0`.
- The repository contains `bun.lock` but no `pnpm-lock.yaml`.
- `pnpm install --frozen-lockfile` therefore fails before installation with
  `ERR_PNPM_NO_LOCKFILE`.
- Upstream Windows CI uses `npm install`, so bootstrap used `npm.cmd install`
  as the CI-equivalent fallback.
- npm installed 197 packages and reported one low-severity direct
  vulnerability in `esbuild` (`GHSA-g7r4-m6w7-qqqr`).
- No audit fix was applied. npm proposes `esbuild@0.28.1`, which it classifies
  as a semver-major change for the current `0.x` dependency.

## Verification baseline

Passing checks:

- `npm.cmd run typecheck`
- `npm.cmd run build`
- all six bundle assertions
- asymmetric-drift assertion
- incident-relevant suite:
  6 files passed, 380 tests passed, 2 skipped
- `ctx_batch_execute` server subset:
  1 file passed, 20 tests passed, 479 filtered/skipped

Complete serialized Windows suite:

- 210 test files total
- 205 passed
- 5 failed
- 4,651 tests passed
- 32 failed
- 62 skipped
- duration: 409.08 seconds

Failure categories:

- 27 executor tests assumed Bash-style shell behavior but executed through
  Windows PowerShell semantics.
- 3 CLI self-heal tests and 2 suite setup paths could not create symlinks
  without Windows symlink privileges.
- 1 background cleanup assertion left its test-owned Bun process alive; the
  exact verified PID was terminated after the run.
- 2 server tests failed through the same shell-semantics path.

Rebuilding without source changes altered `server.bundle.mjs` and
`cli.bundle.mjs` by 209 insertions and 207 deletions. The assertions still
passed, indicating an unlocked build-input/reproducibility issue rather than a
source failure. Those generated-only changes were removed after measurement.

The active global context-mode installation was not changed.

## One-time integration baseline

Recorded after Marcus authorized a runtime/Codex import:

- Branch: `downstream/integration-runtime-codex-2026-07-31`
- Base: `downstream/stable@742d377`
- Integration hardening commit: `030f295`
- Open upstream PRs reviewed: 62
- PRs imported with `-x`: 29
- PRs held: 3
- PRs skipped: 30
- Weekly automation: none
- Remote publication: deferred

Final focused verification:

- 17 files passed; 760 tests passed; 11 skipped
- request cancellation: 6 passed
- conflict-sensitive server cases: 11 passed
- typecheck, build, six bundle assertions, and asymmetric-drift: passed
- real Codex stdio MCP smoke: passed

The complete serialized Windows run recorded 4,755 passes, 34 failed
assertions, and 62 skips before two integration test-contract corrections.
Both exact corrected tests then passed. The remaining 32 failures match the
original Windows baseline categories. Full details, including the actual smoke
metrics, are in `downstream/IMPORT-2026-07-31.md`.

## Live Codex MCP cutover verification

- Local `cli.bundle.mjs doctor --platform codex`: passed server initialization,
  Codex hooks, native SQLite/FTS5, and plugin registration checks.
- `codex mcp get context-mode --json`: resolved the stdio command to this
  checkout's `cli.bundle.mjs` with `CONTEXT_MODE_PLATFORM=codex`.
- Fresh ephemeral read-only `codex exec`: started and completed
  `context-mode/ctx_stats`, then returned `FORK_MCP_OK`.
- Active storage paths remain under
  `C:\Users\marcu\.codex\context-mode`; no database was copied or reset.
