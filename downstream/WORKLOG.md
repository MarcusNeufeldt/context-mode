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
