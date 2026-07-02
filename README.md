# Wildlife Acoustics Academy — Training Companion

Interactive study companion aligned with [Wildlife Acoustics Academy](https://training.wildlifeacoustics.com/) on-demand courses — 11 modules across bioacoustics fundamentals, Song Meter deployment, Kaleidoscope analysis, species workflows, and USFWS bat survey guidelines.

## Quick start

```bash
npm install
npm run build
open public/index.html
```

`public/index.html` is the **only** browser entry (built from `templates/index.template.html`). Opening the template directly shows a build-required notice.

## Verification

```bash
SCRATCH=./.verify-scratch npm run verify
```

Writes `wildlife-only-changed.txt`, `baseline-metrics.json` (copied from frozen `evidence/baseline-v1.0.3-snapshot.json`), `improved-metrics.json`, `uplift-report.txt`, `unit-tests.log`, `curriculum-audit.txt`, `interaction.log`, `launch.log`, and screenshots to `SCRATCH`.

Frozen baseline: `evidence/baseline-v1.0.3-snapshot.json` at tag `pre-improvement-v1.0.3` (commit `9a91f37`). Regenerate only via `node scripts/refresh-baseline-snapshot.js`.

**Scope:** This repo only. Harness workspace `CHANGED_FILES` may list unrelated paths — see `evidence/scope-boundary.txt`.

## v1.1.0 practitioner features

- **Field Quick Reference** — taxa frequency bands, deployment specs, QA checklist
- **Curriculum search** — keyword discovery across modules and lessons
- **Study paths** — Bat Surveyor, Bird Biologist, Field Tech, Advanced Analyst
- **Remediation queue** — review missed knowledge-check items on My Progress
- **Field-season toolbar** — mobile-friendly search and path selector