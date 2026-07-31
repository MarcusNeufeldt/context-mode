# Work log

Times are UTC.

## 2026-07-31 bootstrap

### 05:56 - Preflight

- Confirmed `F:\explore\context_mode_fork` existed and was empty.
- Read the applicable `F:\explore\AGENTS.md`.
- Confirmed GitHub CLI `2.96.0` is installed but not authenticated.
- Used the configured GitHub broker instead of starting a credential workflow.
- Verified `MarcusNeufeldt/context-mode` already exists and Marcus has
  administrative access.
- Verified the fork default branch is `main`.

### 05:57 - Checkout and source guidance

- Cloned the existing public fork into the requested working folder.
- Read the repository's `CLAUDE.md` and `CONTRIBUTING.md`.
- Observed the fork `main` at
  `1854ea52216b56fe99847c32fb725ef3b4abea66` (v1.0.98-era history).

### 05:58 - Remote configuration and ancestry proof

- Configured `origin` to fetch over HTTPS and push over SSH.
- Added `upstream` for `mksglu/context-mode`.
- Disabled the upstream push URL.
- Fetched upstream branches and tags.
- Verified old `origin/main` had zero fork-only commits and was a strict
  ancestor of current `upstream/main`.
- Verified the fork was 1,106 commits behind upstream.

### 05:59 - Local branch baseline

- Fast-forwarded local `main` to
  `upstream/main@252e74b7a947b5fbb5624037f8710d3a5319af3c`.
- Created `downstream/stable`.
- Re-read the current upstream contributor guidance after the fast-forward.
- Confirmed package version `1.0.169` and compatible local Node/pnpm versions.

### Pending in this bootstrap

- Commit the downstream documentation.
- Fast-forward `origin/main`.
- Push `downstream/stable`.
- Verify both remote branches through the GitHub broker.

### 06:00 - Dependency installation

- `pnpm install --frozen-lockfile` failed before mutation because the repository
  has no `pnpm-lock.yaml`.
- Confirmed upstream Windows CI uses `npm install`.
- Ran `npm.cmd install`: 197 packages installed.
- Recorded one low-severity direct `esbuild` advisory; no automatic audit fix
  was applied.

### 06:01 - Static and build verification

- `npm.cmd run typecheck`: passed.
- `npm.cmd run build`: passed.
- Six bundle assertions: passed.
- Asymmetric-drift assertion: passed.
- A no-source-change rebuild altered the checked-in server and CLI bundles,
  demonstrating unlocked build-input drift.

### 06:02 - Complete serialized Windows test baseline

- Ran the full Vitest suite with one worker and file parallelism disabled.
- Result: 205 files passed, 5 failed; 4,651 tests passed, 32 failed,
  62 skipped.
- Failures were concentrated in PowerShell-versus-Bash assumptions, Windows
  symlink privileges, and one background-process cleanup assertion.
- Verified the remaining Bun PID belonged to the failed cleanup test and
  terminated only that process.

### 06:08 - Focused incident-relevant baseline

- Store/search/SQLite/session/EOF suite:
  6 files passed, 380 tests passed, 2 skipped.
- `ctx_batch_execute` server subset:
  1 file passed, 20 tests passed, 479 filtered/skipped.
- Restored only the two build-generated bundle changes.
- Removed three 4-byte untracked test temp files.
- Confirmed the remaining worktree changes are downstream documentation only.
