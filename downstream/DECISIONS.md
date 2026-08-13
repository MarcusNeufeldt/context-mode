# Decision register

## D-001: Reuse the existing fork

- Date: 2026-07-31
- Status: accepted

Use `MarcusNeufeldt/context-mode`; do not create a second fork. The existing
fork is writable and retains historical experimental branches.

## D-002: Preserve a clean upstream mirror

- Date: 2026-07-31
- Status: accepted

Keep `main` free of downstream-only commits and synchronize it by fast-forward
from `upstream/main`. This makes upstream drift and future rebases inspectable.

## D-003: Isolate deployable downstream work

- Date: 2026-07-31
- Status: accepted

Use `downstream/stable` for approved downstream changes and
`downstream/integration-*` for temporary candidate work.

## D-004: No patch train yet

- Date: 2026-07-31
- Status: partially superseded by D-009

Do not create weekly automation during bootstrap. The original prohibition on
cherry-picking was superseded when Marcus explicitly authorized the one-time
runtime/Codex import in D-009. Candidate cadence still requires a separate
decision.

## D-005: Keep the live installation isolated

- Date: 2026-07-31
- Status: accepted

Do not replace the active global npm installation with this checkout during
bootstrap. Validate locally first; live installation requires explicit
authorization and rollback evidence.

## D-006: Documentation is part of every change

- Date: 2026-07-31
- Status: accepted

Update the downstream work log, baseline, and decisions in the same commit as
the maintenance action they describe.

## D-007: Follow upstream CI for bootstrap dependency installation

- Date: 2026-07-31
- Status: accepted

The project declares pnpm but has no pnpm lockfile. Use `npm.cmd install` for
the bootstrap baseline because the upstream Windows CI workflow uses
`npm install`. Do not treat this as reproducible dependency resolution; record
the resulting dependency and bundle drift.

## D-008: Maintain both a full Windows baseline and a focused acceptance lane

- Date: 2026-07-31
- Status: accepted

Keep the complete serialized Windows suite result, including upstream failures,
as a comparison baseline. Require a clean incident-relevant subset covering
store, search, SQLite, session DB, server EOF, and `ctx_batch_execute` for
future candidate work. Do not fix the upstream-wide Windows failures during
bootstrap.

## D-009: Run one documented runtime/Codex import

- Date: 2026-07-31
- Status: accepted

Review every currently open upstream pull request, import useful runtime and
Codex changes onto a temporary downstream integration branch, and record an
explicit disposition for every PR. This is a one-time pass, not the weekly
patch train.

## D-010: Cherry-pick logical commits only

- Date: 2026-07-31
- Status: accepted

Use `git cherry-pick -x` for logical PR commits. Do not import merge commits
that merely synchronize a contributor branch with `next`, and do not carry
unrelated CI-stat commits.

## D-011: Source is authoritative during bundle conflicts

- Date: 2026-07-31
- Status: accepted

Resolve TypeScript/JavaScript source interactions explicitly. Do not hand-merge
minified bundles from several PRs; regenerate all shipped bundles once from the
final combined source and require bundle assertions to pass.

## D-012: Hold unsafe retention and automatic DB swapping

- Date: 2026-07-31
- Status: accepted

Do not import #970 until session liveness is proven independently of main DB
mtime under WAL mode. Do not import #871 until automatic file replacement has
a safe multi-process coordination contract and recoverability evidence.

## D-013: Prove the fork through real Codex stdio

- Date: 2026-07-31
- Status: accepted

In addition to unit/integration tests, launch the built bundle over MCP stdio
with `CONTEXT_MODE_PLATFORM=codex`, isolated temporary storage, and an
oversized real command result. Require the ingestion cap, bounded response,
search retrieval, and stats call to succeed.

## D-014: Keep publication and installation separate from integration

- Date: 2026-07-31
- Status: accepted

The integration branch may be completed and committed locally while the
YubiKey is unavailable. Do not push it, publish a package, or replace the
active global installation as part of this import pass.

## D-015: Cut Codex MCP over by direct local registration

- Date: 2026-07-31
- Status: accepted

After explicit authorization, point only the Codex `context-mode` MCP command
at this checkout's built `cli.bundle.mjs`. Keep the global npm package installed
and preserve the prior Codex config as rollback evidence. Do not npm-link,
publish, reset storage, or rewrite hook configuration as part of the cutover.
Require both a local doctor pass and a fresh Codex-hosted MCP tool call.

## D-016: Run one bounded post-cutoff reliability follow-up

- Date: 2026-08-13
- Status: accepted

After reviewing all pull requests opened since the 2026-07-31 import cutoff,
import only #1030 as a complete upstream change. Port only the Pi bridge portion
of #1029 because its executor/server changes overlap the already imported #1009
and the upstream PR is conflicted. Do not expand the supported adapter set or
start a recurring patch train as part of this follow-up.

## D-017: Keep request diagnostics opt-in and payload-free

- Date: 2026-08-13
- Status: accepted

Add request lifecycle observability for the Pi Hub wedged-turn failure class,
but keep it disabled unless `CONTEXT_MODE_REQUEST_LOG=1`. Write only bounded
stderr records containing phase, sanitized tool name, opaque per-process
correlation id, terminal duration, and coarse outcome. Never log tool arguments,
commands, queries, paths, results, raw JSON-RPC ids, environment values, auth
metadata, exception messages, or stacks. Logging is diagnostic, not a request
deadline or recovery mechanism.

## D-018: Keep integration separate from active runtime changes

- Date: 2026-08-13
- Status: accepted

Build and verify the follow-up on
`downstream/integration-runtime-observability-2026-08-13`. Do not push, promote
to `downstream/stable`, change Codex/Pi configuration, restart services, or open
an active database without a separate authorization after evidence is reviewed.
