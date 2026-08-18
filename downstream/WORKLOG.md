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

### 06:10 - Initial downstream commit

- Configured repository-local Git author identity as
  `MarcusNeufeldt <86715671+MarcusNeufeldt@users.noreply.github.com>`.
- Did not modify the global Git identity.
- Committed the initial downstream documentation as
  `084504b` (`docs: initialize downstream fork`).

### 06:12 - Remote publication deferred

- Reconfirmed that remote `origin/main` is an ancestor of local `main`, so the
  planned update remains fast-forward-only.
- Started an SSH push using Windows OpenSSH and the configured hardware-backed
  key.
- The first non-interactive attempt waited silently for hardware presence. It
  was stopped by terminating only the verified `git push origin main:main`
  process and its SSH child.
- Retried interactively. OpenSSH displayed the expected security-key presence
  prompt, then authentication ended with `signing failed ... invalid format`
  because the key could not be touched at that time.
- Ran the `yubikey-watch` health check. The watcher, audit configuration, and
  current log were healthy, and the request was attributed to this exact
  `git push origin main:main`.
- Marcus confirmed that the hardware key is not currently reachable.
- No remote branch was changed. No further authentication attempt was made.

### Publication resume commands

Run from this repository when the YubiKey is reachable:

```powershell
$previousGitSsh = $env:GIT_SSH
try {
    $env:GIT_SSH = "C:\Windows\System32\OpenSSH\ssh.exe"
    git push origin main:main
    git push --set-upstream origin downstream/stable
} finally {
    $env:GIT_SSH = $previousGitSsh
}
```

Afterward, verify that:

- `origin/main` resolves to
  `252e74b7a947b5fbb5624037f8710d3a5319af3c`;
- `origin/downstream/stable` resolves to the local downstream branch;
- both remote branches are visible through the GitHub broker.

### Remaining bootstrap publication work

- Fast-forward `origin/main`.
- Push `downstream/stable`.
- Verify both remote branches through the GitHub broker.

## 2026-07-31 runtime/Codex import

### 06:17 - Close local bootstrap state

- Committed the YubiKey publication deferral and exact resume commands as
  `742d377` (`docs: record deferred fork publication`).
- Confirmed the repository worktree was clean before beginning code
  integration.

### 06:18 - Scope expansion and complete PR inventory

- Marcus authorized a one-time import of useful upstream PRs, focused on
  runtime and Codex.
- Preserved the earlier boundary: no weekly patch train or scheduling.
- Queried live upstream state through the GitHub broker.
- Counted 62 open pull requests.
- Recorded a disposition for every open PR in
  `downstream/PR-REVIEW-2026-07-31.md`.

### 06:20 - Candidate fetch and source review

- Fetched 37 initial runtime/Codex candidate PR heads into local
  `upstream/pr/<number>` refs.
- Added #929 and #931 after their package/runtime diagnostics were reviewed.
- Compared each candidate to its declared `main` or `next` base.
- Inspected commit counts, merge commits, changed paths, source diffs, current
  mergeability metadata, comments, and review threads.
- Reduced the set to 29 imports.
- Explicitly held:
  - #995 because its test-only branch carries 44 commits and unrelated drift;
  - #970 because main DB mtime is not a safe live-session signal under WAL;
  - #871 because automatic shared-DB file swapping lacks multi-process
    coordination.
- Rejected #991 because automatic extra indexing works against storage
  bounding.
- Rejected superseded pairs #924/#974, #910/#971, #864/#1002, and
  #981/#1010 in favor of either the newer focused patch or no adapter import.

### 06:23 - Integration branch

- Created `integration/runtime-codex-2026-07-31` from
  `downstream/stable@742d377`.
- After verification, renamed it to the documented downstream convention:
  `downstream/integration-runtime-codex-2026-07-31`.

### 06:24 - Codex, packaging, and diagnostic imports

- Imported #929, #931, #906, #948, #955, #971, #907, #899, #996, and #863.
- All logical commits were cherry-picked with `-x`.
- #907 and #996 both changed auto-injection and applied together without a
  manual source conflict.

### 06:26 - Startup, lifecycle, and execution imports

- Imported #973, #974, #969, #968, #934, #932, #987, #975, #1009, and #888.
- Skipped contributor-branch merge commits and unrelated `stats.json` commits.
- Resolved #1009's `ctx_execute` conflict by retaining:
  - the generic effective timeout from #968;
  - the background-without-timeout behavior from #975;
  - request-scoped cancellation from #1009.
- Ran #1009's new tests. Its POSIX-shell-specific cases failed before their
  cancellation assertions on Windows; its platform-neutral cases passed.

### 06:29 - Database, ingestion, search, and stats imports

- Imported #986, #988, #980, #898, #963, #939, #921, #922, and #952.
- Resolved #988 with #888 by retaining the path-keyed store map and starting a
  passive WAL timer for every newly created store.
- Resolved #980 with #969 by retaining both byte/chunk policy resolution and
  per-call FS-preload repair.
- Resolved #922 with #980 by preserving structured ingestion reporting and
  miss-only follow-up terms.
- Generated bundle conflicts from #980, #898, and #963 were deliberately not
  hand-merged. Existing bundles were retained temporarily for each
  cherry-pick, then regenerated from the final source.

### 06:33 - First combined gate and downstream test hardening

- `npm.cmd run typecheck`: passed.
- Initial focused lane:
  - 15 files passed;
  - two files exposed five imported-test assumptions.
- Corrected the pure Bun resolver to use POSIX or Windows path semantics based
  on its injected platform rather than the host running the test.
- Updated three OpenCode coercion tests to expect the correct empty-project
  handler error after #888 removed accidental cross-project store reuse.
- Reworked #1009's process-tree test to use Node rather than Bash, preserving
  real child/descendant PID and cleanup assertions on Windows.
- Added a direct oversized Markdown emoji test for #898, including checks for
  broken surrogate boundaries and replacement characters.
- Focused correction rerun: 4 files passed; 17 tests passed.

### 06:40 - Build and real MCP runtime smoke

- Regenerated all shipped bundles from the combined source.
- `npm.cmd run build`: passed.
- Six bundle assertions: passed.
- Asymmetric drift and required packaged helper scripts: passed.
- Added `downstream/smoke/mcp-runtime-smoke.mjs`.
- Launched `server.bundle.mjs` through a real MCP stdio transport with:
  - client name `codex-cli`;
  - `CONTEXT_MODE_PLATFORM=codex`;
  - isolated temporary storage;
  - a real 9 MiB command result.
- Smoke result:
  - 12 MCP tools discovered;
  - 8,388,608 bytes indexed;
  - 1,048,601 bytes dropped;
  - response bounded to 4,100 bytes;
  - marker retrieved through `ctx_search`;
  - `ctx_stats` succeeded.
- The temporary smoke database was deleted after the server closed.

### 06:43 - Complete serialized Windows suite

- Ran `npm.cmd test -- --maxWorkers=1 --no-file-parallelism`.
- Pretest build and all bundle assertions passed again.
- Complete result:
  - 215 files total;
  - 210 passed, 5 failed;
  - 4,755 tests passed;
  - 34 failed;
  - 62 skipped;
  - duration 420.79 seconds.
- Thirty-two failed assertions matched the clean baseline categories.
- Two additional failures were stale/racy tests exposed by the integration:
  - a source guard still expected the deleted `_store` singleton after #888;
  - a spawned-server test deleted its CWD before Windows released the child.
- Updated the guard to assert the path-keyed store cleanup and made the test
  wait for child exit.
- Both exact corrected tests passed.

### 06:52 - Cleanup and final focused evidence

- Verified the two Bun processes left by the known upstream background cleanup
  assertion using exact PID and command line.
- Terminated only those two test-owned processes.
- Removed their two metadata-only `.ctx-mode-*` sandboxes.
- Removed three 4-byte `f*.tmp` files created by the shell tests.
- Removed two failed-test `ctx-index-cwdfallback-*` directories after their
  child processes were gone.
- Final focused integration lane:
  - 17 files passed;
  - 760 tests passed;
  - 11 skipped.
- Final #1009 cancellation lane:
  - 1 file passed;
  - 6 tests passed.
- Conflict-sensitive server cases:
  - 11 tests passed across the focused runs.

### 06:56 - Local integration closeout

- Committed the downstream hardening, regenerated bundles, smoke harness, and
  complete import documentation as
  `030f295` (`fix: harden runtime and Codex integration`).
- Confirmed the integration implementation is fully local and no GitHub branch
  was changed.

### Remaining publication boundary

- Do not push until Marcus can use the SSH YubiKey.
- Do not install this branch over the active global context-mode runtime
  without a separate live-cutover decision.

### 06:57 - Final remote verification

- Queried `MarcusNeufeldt/context-mode` branches through the GitHub broker.
- Confirmed remote `main` remains at `1854ea5221`.
- Confirmed neither `downstream/stable` nor
  `downstream/integration-runtime-codex-2026-07-31` exists remotely.
- Therefore no remote repository state changed during this import pass.

### 09:08 - Live Codex MCP cutover

- Marcus explicitly authorized wiring the local fork into Codex as the active
  `context-mode` MCP server.
- Confirmed the integration worktree was clean at
  `0a57e28e55d2ae267faaba5a09911ff2707cdd1b`.
- Ran the local `cli.bundle.mjs doctor --platform codex`:
  - server initialization passed;
  - native SQLite/FTS5 passed;
  - the Codex binary and all six configured hooks passed.
- Preserved the pre-cutover Codex configuration at
  `C:\Users\marcu\.codex\config.toml.bak-context-mode-local-20260731-0908`.
- Changed only `mcp_servers.context-mode.args` in
  `C:\Users\marcu\.codex\config.toml`, from the global npm
  `cli.bundle.mjs` to
  `F:/explore/context_mode_fork/cli.bundle.mjs`.
- Kept `CONTEXT_MODE_PLATFORM=codex`, the existing hook configuration, and the
  existing context-mode storage paths unchanged.
- `codex mcp get context-mode --json` resolved the new local stdio path.
- Launched a fresh ephemeral, read-only Codex host. It started and completed
  `context-mode/ctx_stats` and returned `FORK_MCP_OK`.
- Verified the ephemeral host's local `node` MCP child exited after its parent
  closed; no test-owned fork process remained.
- The current already-running Codex task retains its pre-cutover MCP child
  until restarted. New Codex tasks load the fork immediately.
- The global npm package remains installed as a rollback runtime. No package
  was published, no database was reset, no remote branch was changed, and no
  weekly automation was added.

## 2026-08-13 runtime and observability follow-up

### Scope and branch

- Reviewed the 12 pull requests opened after the 2026-07-31 cutoff, including
  the closed duplicate #1027.
- Read the Pi Hub 2026-08-12 wedged-turn incident before choosing the change set.
- Created `downstream/integration-runtime-observability-2026-08-13` from the
  tested July integration tip `c1a8649`.
- Preserved the boundary: no push, stable promotion, live configuration change,
  service restart, database cutover, scheduled automation, or package publish.

### Upstream reliability import

- Fetched only `pull/1030/head` into `upstream/pr/1030`.
- Verified exact head `eaad703` and cherry-picked it with `-x` as `7ad74a7`.
- The change retries transient `SQLITE_IOERR` / `disk I/O error` through the
  existing bounded backoff while leaving corruption recovery unchanged.

### Request lifecycle diagnostics

- Added `CONTEXT_MODE_REQUEST_LOG=1`, disabled by default.
- Added payload-free stderr phases for transport receipt and registered handler
  start/end/error, correlated by opaque process-local ids.
- Explicitly excluded arguments, output, paths, raw ids, auth data, exception
  messages, stacks, and environment values.
- Kept diagnostics best-effort so logging failure cannot break MCP dispatch.

### Selective Pi cancellation port

- Did not cherry-pick conflicted PR #1029.
- Ported only Pi bridge signal forwarding, pending cleanup, and
  `notifications/cancelled`; retained the fork's existing #1009 executor/server
  cancellation implementation.
- Verified the installed Pi Agent Core 0.84.0 registered-tool contract supplies
  an optional third `AbortSignal` argument.

### Early verification

- Targeted `store`, lifecycle, and Pi MCP bridge tests: passed.
- `npm.cmd run typecheck`: passed.

### Final verification

- `npm.cmd run build`: passed.
- Six generated-bundle assertions: passed.
- Asymmetric drift and packaged-helper assertion: passed.
- Focused serialized lane covering lifecycle, Pi bridge, store, core server,
  and executor cancellation: passed.
- Existing 9 MiB Codex stdio smoke: passed with 12 tools, exactly 8 MiB
  indexed, 1,048,601 bytes dropped, a 4,100-byte response, successful search
  retrieval, and successful stats.
- After the review fixes and bundle rebuild, the first repeat of that smoke
  failed because the immediate follow-up `ctx_search` reported an empty
  knowledge base despite the batch response reporting indexed bytes. A direct
  rerun passed with the expected marker. This intermittent pre-existing smoke
  timing/storage-routing symptom remains recorded; it was not hidden or used as
  proof that the candidate is deterministically green.
- New opt-in request-log stdio smoke: passed; receipt/start/end phases appeared
  on stderr and a secret marker in tool arguments did not appear in diagnostics.
- Local built `cli.bundle.mjs doctor --platform codex`: passed server, storage,
  hooks, plugin registration, and SQLite/FTS5 checks.
- `git diff --check`: passed.
- Lightweight local secret-pattern scan over the non-generated diff: no matches.
- Structured `autoreview --mode local`: blocked before model review because the
  required TruffleHog binary is not installed; no bypass or installation was
  attempted. An independent read-only code-review lane was used instead.

### Stable promotion and unified host cutover

- Marcus authorized checkout cleanup, stable promotion, and aligning Codex,
  Pi, and Claude to the correct checkout.
- Verified `downstream/stable@742d377` was a strict ancestor of the completed
  candidate with `0` commits unique to stable and `42` commits unique to the
  candidate.
- Recorded a fast-forward promotion to the final maintenance commit; no merge
  commit, rebase, branch deletion, or `main` modification was used.
- Kept the dated integration branches for provenance and selected
  `downstream/stable` as the steady-state checked-out branch.
- Verified each host's actual registration and fresh MCP behavior after the
  cutover.
- Codex: `codex mcp get context-mode --json` resolves this checkout's
  `cli.bundle.mjs`; a fresh ephemeral `codex exec` completed `ctx_stats` and
  returned `CODEX_STABLE_OK`.
- Pi: global package registration and the Pi Hub plugin API both resolve
  `F:\explore\context_mode_fork`; a fresh loader invoked the registered stats
  command. After the active-session count reached zero, restarted only the Pi
  Hub server to discard its pre-promotion module cache. The replacement server
  listened on port 30141 and reported the local package loaded with zero
  diagnostics and zero running sessions.
- Claude: removed the upstream marketplace registration, added this checkout
  as the user marketplace, and reinstalled the user-scoped plugin with data
  preserved. The installed record points to exact commit
  `ef40b1e84b18f3732de1769205c2b73b23384db3`; installed and checkout bundle
  hashes match, and a fresh headless Claude host completed `ctx_stats`.
- Stopped only the two stale Claude context-mode child processes before the
  reinstall. Preserved a dated backup of the former plugin cache. Other Claude
  sessions and unrelated plugins were not changed.
- The Claude local-marketplace installer temporarily rewrote tracked plugin
  and hook manifests to machine-specific absolute paths. Restored their
  portable committed forms and locally ignored only Claude's untracked runtime
  log files in `.git/info/exclude`.

## 2026-08-18: Exclude context-mode from pi-subagents children

- Added an early return in the Pi adapter when `PI_SUBAGENT_CHILD=1`, the child
  marker set by pi-subagents. This prevents the MCP bridge, routing hooks, and
  session capture from loading in those child processes while leaving parent Pi
  sessions unchanged.
- Moved Pi skill discovery from the static package manifest into the parent-only
  adapter registration. Context-mode and `ctx-*` skills therefore remain in
  parent Pi sessions but are absent from pi-subagents children.
- Removed the explicit empty `extensions:` override from the six user agents so
  they inherit normal ambient extensions, including `pi-mcp-adapter`.
- Added focused regression coverage proving parent skill discovery works while
  child registration installs no hooks and never bootstraps the MCP bridge.
- `pnpm exec vitest run tests/adapters/pi-help-skip-bootstrap.test.ts`: passed
  (20 tests).
- `pnpm run typecheck`: passed.
- `pnpm exec tsc`: passed and refreshed the active generated Pi adapter.
- E2E: all six user-scope agents (`delegate`, `oracle`, `researcher`, `reviewer`,
  `scout`, `worker`) inherited 27 non-context-mode skills, accessed all 11
  configured MCP servers through `mcp` and `mcpScript`, and reported no
  context-mode skill, tool, or MCP server.
- Did not run the full bundle build because the checkout already contained
  unrelated modifications to source and generated bundles; those changes were
  preserved.

## 2026-08-18: Preserve bounded SQLite initialization retry

- Preserved the pre-existing `src/db-base.ts` change that routes database open,
  WAL pragma setup, idempotent schema creation, and statement preparation
  through the shared bounded SQLite retry policy.
- Reduced the per-attempt driver timeout from 30 seconds to 8 seconds so the
  four-attempt envelope remains bounded for Pi Hub's event loop.
- Ensured a connection is closed when WAL pragma setup fails before retrying.
- Added source-contract regression coverage in
  `tests/util/db-base-platform-gate.test.ts`.

## 2026-08-18: Pi workspace and shared-runtime stability integration

- Snapshotted the full pre-existing dirty diff and status under the user temp
  directory before mutation.
- Created `downstream/integration-pi-stability-2026-08-18` from
  `downstream/stable@246a156`.
- Restored machine-specific Claude hook manifests to their portable tracked
  forms; preserved source changes and regenerated bundles from source.
- Committed the existing Pi subagent exclusion as `7dcaffd` and bounded SQLite
  initialization retry as `9bb4524`.
- Fetched only upstream PR #1056, verified head `eddb43f`, and cherry-picked it
  with `-x` as `beea644`.
- Replaced extension-load/process-cwd Pi attribution with session `ctx.cwd`,
  made runtime state registration-local, and passed the session workspace to the
  MCP child as cwd plus `PI_WORKSPACE_DIR` / `CONTEXT_MODE_PROJECT_DIR`.
- Resolved detected bare JS runtimes before cross-workspace spawn; this exposed
  and fixed a Windows `spawn bun ENOENT` path.
- Removed startup `cleanupStaleContentDBs`: mtime/WAL age cannot prove another
  process is dead. Explicit purge/forget remains available.
- Added `downstream/smoke/pi-multi-workspace-smoke.mjs` covering two distinct
  project roots, file-boundary isolation, distinct DB hashes, and five sibling
  bridge open/close cycles on one project.
- Focused lane passed: 7 files, 285 tests passed, 3 skipped.
- Pi multi-workspace smoke passed.
- Existing 9 MiB Codex stdio smoke passed with 12 tools, 8 MiB indexed,
  1,048,601 bytes dropped, 4,100-byte response, and search retrieval.
- Full serialized Windows suite: 211/215 files passed; 4,814 tests passed,
  4 failed, 59 skipped; 163.18 seconds. Failures remained in known Windows
  process-cleanup and symlink-privilege categories.
- Verified the one test-owned surviving Bun PID by exact command line,
  terminated only that process, and removed its test sandbox.
- Three fresh read-only reviews reported no blockers. Applied their bounded
  findings: parent-mode test/smoke env isolation, unconditional session metadata
  after workspace rebind, Windows path-equivalence comparison, shutdown/new-session
  bridge detachment, strict smoke cleanup, and stale checkpoint-comment cleanup.
- Initially left the verified candidate unpromoted and restored the active
  checkout/build to `downstream/stable@246a156`.

### Local stable cutover

- Marcus then explicitly authorized taking the slice live.
- Verified stable was a strict ancestor of the candidate and fast-forwarded
  `downstream/stable` to `cd0b07ac` without a merge commit or rebase.
- Rebuilt the active checkout; bundle and asymmetric-drift assertions passed.
- Re-ran both Pi multi-workspace and Codex 9 MiB runtime smokes successfully.
- Verified Codex MCP and Pi package registrations resolve
  `F:\explore\context_mode_fork`; Pi Hub reports the package loaded with zero
  diagnostics.
- One Pi Hub interactive session was active, so the server was not restarted.
  Fresh Pi CLI verification completed `ctx_stats`, proving new processes load
  the promoted build.
- Claude's semantic version was unchanged, so ordinary update did not refresh
  its cache. With no Claude context-mode helpers running, preserved a dated
  cache backup, reinstalled the user plugin from the local marketplace, and
  verified exact commit `cd0b07ac` plus matching installed/checkout bundle
  hashes. A fresh Claude host completed `ctx_stats`.
- A fresh Codex host completed `ctx_stats`; unrelated Supabase OAuth and local
  websocket fallback diagnostics did not affect the context-mode result.
- Restored the portable tracked Claude manifests after the local installer
  rewrote them to machine-specific absolute paths.
- Did not modify `main`, mutate active databases, or terminate the current
  interactive Pi session.

### Fork publication

- Marcus separately authorized publishing the verified stable branch.
- Refreshed `origin`, verified `origin/downstream/stable@246a156` was a strict
  ancestor, and pushed by SSH/YubiKey without force.
- GitHub broker verification reported
  `MarcusNeufeldt/context-mode` `downstream/stable@0b30620e`; the local branch
  and tracking ref were synchronized and clean.
