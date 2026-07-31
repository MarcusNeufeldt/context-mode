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
- Status: accepted

Do not cherry-pick upstream pull requests and do not create weekly automation
during bootstrap. Candidate selection and cadence require a separate decision.

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
