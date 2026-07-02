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

Writes `unit-tests.log`, `curriculum-audit.txt`, `interaction.log`, `launch.log`, and screenshots to `SCRATCH`.