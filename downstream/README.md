# Downstream fork

This folder documents the maintained downstream fork of
[`mksglu/context-mode`](https://github.com/mksglu/context-mode).

## Purpose

Keep a stable context-mode build available for Marcus while upstream releases
and pull-request integration are uncertain. Preserve upstream compatibility and
carry the smallest practical downstream patch set.

## Repository model

| Ref | Role |
| --- | --- |
| `upstream/main` | Canonical upstream development branch |
| `upstream/next` | Upstream integration branch |
| `origin/main` | Clean mirror of upstream `main` |
| `downstream/stable` | Reviewed downstream documentation and code |
| `downstream/integration-*` | Temporary candidate branches |

The upstream remote has a deliberately invalid push URL. All downstream pushes
go to `origin` over SSH.

## Current phase

Bootstrap, one-time runtime/Codex integration, and local live MCP cutover:

- existing GitHub fork reused;
- local checkout created;
- upstream history synchronized locally;
- downstream branch and maintenance records established;
- baseline build and test verification recorded;
- all 62 open upstream PRs reviewed;
- 29 runtime/Codex PRs imported with provenance on
  `downstream/integration-runtime-codex-2026-07-31`;
- combined source built and exercised through a real Codex stdio MCP smoke;
- the Codex `context-mode` MCP registration now launches this checkout's
  `cli.bundle.mjs`;
- a fresh ephemeral Codex host loaded the registration and completed
  `ctx_stats`;
- Pi/Pi Hub and Claude now resolve the same stable checkout, with fresh-host
  `ctx_stats` checks completed after cutover.

The incident-relevant store/search/SQLite/batch test baseline is green. The
complete upstream suite is not green on this Windows host; its known baseline
failures are recorded rather than silently waived.

The 2026-08-13 follow-up was promoted by fast-forward to `downstream/stable`.
It adds the reviewed
upstream SQLite I/O retry from #1030, opt-in payload-free MCP request lifecycle
diagnostics, and the Pi bridge-only cancellation portion of #1029. It does not
change `main`, which remains the clean upstream mirror.

The 2026-08-18 Pi stability slice was promoted by fast-forward to the local
`downstream/stable` branch. It imports #1056, binds Pi bridge/session state to
each session's real workspace, removes unsafe automatic content-DB file
deletion, and preserves the Pi subagent exclusion plus bounded SQLite
initialization retry. The active build and Claude plugin cache were refreshed;
fresh Codex, Pi, and Claude hosts completed `ctx_stats`. No GitHub push or
active database mutation was performed.

Not part of this phase:

- no weekly patch train;
- no scheduled automation;
- no npm link or overwrite of the retained global npm rollback package;
- no package publication.

## Records

- [Baseline](BASELINE.md)
- [Decision register](DECISIONS.md)
- [Work log](WORKLOG.md)
- [Complete PR review](PR-REVIEW-2026-07-31.md)
- [Runtime/Codex import ledger](IMPORT-2026-07-31.md)
- [Runtime/observability follow-up](IMPORT-2026-08-13.md)
- [Pi/shared-runtime stability candidate](IMPORT-2026-08-18.md)
- [Real MCP smoke harness](smoke/mcp-runtime-smoke.mjs)
- [Pi multi-workspace smoke](smoke/pi-multi-workspace-smoke.mjs)

## License

The upstream project uses the Elastic License 2.0. Preserve the upstream
copyright and license notices. Downstream builds must carry prominent notice
that they contain modifications. Do not offer the software as a hosted or
managed service exposing a substantial set of its functionality.
