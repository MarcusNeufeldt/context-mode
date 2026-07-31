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
