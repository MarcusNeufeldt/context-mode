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

Bootstrap only:

- existing GitHub fork reused;
- local checkout created;
- upstream history synchronized locally;
- downstream branch and maintenance records established;
- baseline build and test verification recorded.

The incident-relevant store/search/SQLite/batch test baseline is green. The
complete upstream suite is not green on this Windows host; its known baseline
failures are recorded rather than silently waived.

Not part of this phase:

- no upstream pull requests imported;
- no weekly patch train;
- no scheduled automation;
- no replacement of the active global context-mode installation;
- no package publication.

## Records

- [Baseline](BASELINE.md)
- [Decision register](DECISIONS.md)
- [Work log](WORKLOG.md)

## License

The upstream project uses the Elastic License 2.0. Preserve the upstream
copyright and license notices. Downstream builds must carry prominent notice
that they contain modifications. Do not offer the software as a hosted or
managed service exposing a substantial set of its functionality.
