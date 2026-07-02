'use strict';

const fs = require('fs');
const path = require('path');
const { probeBaselineFromGit, BASELINE_COMMIT } = require('./baseline-probe');
const { scoreProfile } = require('./rubric');
const { BASELINE_TAG } = require('./load-frozen-baseline');

const root = path.join(__dirname, '..');
const outPath = path.join(root, 'evidence', 'baseline-v1.0.3-snapshot.json');

const probe = probeBaselineFromGit(BASELINE_COMMIT);
const scored = scoreProfile(probe.profile);

const snapshot = {
  sourceCommit: probe.sourceCommit,
  sourceTag: BASELINE_TAG,
  capturedAt: probe.probedAt,
  captureMethod: 'git-worktree-probe',
  profile: probe.profile,
  dimensions: scored.dimensions,
  total: scored.total,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + '\n');
console.log('Wrote', outPath);
console.log('baseline total:', snapshot.total, 'questions:', snapshot.profile.questionCount);
console.log('NOTE: run only when regenerating frozen evidence; verify uses snapshot read, not live probe.');