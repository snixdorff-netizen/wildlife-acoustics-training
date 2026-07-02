'use strict';

const fs = require('fs');
const path = require('path');
const { probeBaselineFromGit } = require('./baseline-probe');
const { scoreProfile, buildMetricsReport } = require('./rubric');
const {
  loadFrozenBaselineSnapshot,
  BASELINE_COMMIT,
  BASELINE_TAG,
} = require('./load-frozen-baseline');

const root = path.join(__dirname, '..');
const scratch = process.env.SCRATCH || path.join(root, '.verify-scratch');
fs.mkdirSync(scratch, { recursive: true });

// Verification plan step 1: measure pre-change codebase via detached git worktree.
const probe = probeBaselineFromGit(BASELINE_COMMIT);
const scored = scoreProfile(probe.profile);
const baseline = buildMetricsReport(`baseline-${probe.profile.version}`, probe.profile, scored, {
  sourceCommit: probe.sourceCommit,
  sourceTag: BASELINE_TAG,
  probedAt: probe.probedAt,
  captureMethod: 'git-worktree-live-probe',
});

const snapshot = loadFrozenBaselineSnapshot();
const profileMatches = JSON.stringify(probe.profile) === JSON.stringify(snapshot.profile);
const dimensionsMatch = JSON.stringify(scored.dimensions) === JSON.stringify(snapshot.dimensions);

const log = [
  'baseline capture (pre-change codebase — live git worktree probe)',
  `timestamp: ${new Date().toISOString()}`,
  `baseline commit: ${BASELINE_COMMIT}`,
  `sourceTag: ${BASELINE_TAG}`,
  `probe method: ${baseline.captureMethod}`,
  `probedAt: ${probe.probedAt}`,
  `regression snapshot: evidence/baseline-v1.0.3-snapshot.json`,
  `profile matches snapshot: ${profileMatches}`,
  `dimensions match snapshot: ${dimensionsMatch}`,
  `curriculum from probed tree: modules=${probe.profile.moduleCount} lessons=${probe.profile.lessonCount} questions=${probe.profile.questionCount}`,
  `baseline version: ${probe.profile.version}`,
  `baseline total score: ${baseline.total}/100 (scored from live probed profile via scripts/rubric.js)`,
  'note: baseline measured from detached worktree at pre-improvement commit; not from current src/ or frozen copy alone.',
].join('\n');

fs.writeFileSync(path.join(scratch, 'baseline-metrics.json'), JSON.stringify(baseline, null, 2));
fs.writeFileSync(path.join(scratch, 'baseline-capture.log'), log + '\n');

const provenancePath = path.join(root, 'evidence', 'baseline-provenance.txt');
if (fs.existsSync(provenancePath)) {
  fs.copyFileSync(provenancePath, path.join(scratch, 'baseline-provenance.txt'));
}

if (!profileMatches || !dimensionsMatch) {
  console.error('ERROR: live probe diverged from committed regression snapshot');
  console.error(log);
  process.exit(1);
}

console.log(log);