# Context Mode Downstream Maintenance

This repository is the working copy for the `MarcusNeufeldt/context-mode`
downstream fork. Upstream contributor guidance in `CLAUDE.md` and
`CONTRIBUTING.md` still applies.

## Branch roles

- `main` mirrors `mksglu/context-mode:main`. Do not add downstream-only commits.
- `downstream/stable` is the reviewed, deployable downstream branch.
- Create short-lived `downstream/integration-*` branches for candidate changes.
- Preserve existing historical and experimental branches unless Marcus
  explicitly authorizes removing them.

## Current phase

- Bootstrap and document the fork.
- Do not import or cherry-pick upstream pull requests yet.
- Do not add a scheduled or weekly patch workflow yet.
- Do not install this checkout over the active global context-mode package
  without explicit authorization.

## Required maintenance record

Every downstream maintenance action must update the appropriate files under
`downstream/`:

- `WORKLOG.md`: commands/actions, outcomes, failures, and verification.
- `BASELINE.md`: remotes, branches, SHAs, versions, or runtime state changes.
- `DECISIONS.md`: durable choices and their rationale.
- `README.md`: operating model and current phase.

Never record secrets, tokens, private session contents, or raw personal paths
that are not needed to reproduce the work.

## Safety and verification

- Fetch from `upstream`; never push to it.
- Push downstream changes only to `origin` using SSH.
- Use `git cherry-pick -x` when a future upstream PR is explicitly approved.
- Rebuild generated bundles whenever source changes require it.
- Run typecheck, build assertions, targeted tests, and Windows-specific
  regression tests before promoting candidate code to `downstream/stable`.
- Test SQLite migrations and repair logic against copies, never the active
  context-mode database, unless Marcus explicitly authorizes a live cutover.
- Preserve Elastic License 2.0 notices and mark downstream modifications.
