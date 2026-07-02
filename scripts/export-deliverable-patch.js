'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { BASELINE_COMMIT } = require('./load-frozen-baseline');

const root = path.join(__dirname, '..');
const scratch = process.env.SCRATCH || path.join(root, '.verify-scratch');
fs.mkdirSync(scratch, { recursive: true });

const head = execSync('git rev-parse HEAD', { cwd: root, encoding: 'utf8' }).trim();
const stat = execSync(`git diff ${BASELINE_COMMIT}..HEAD --stat`, { cwd: root, encoding: 'utf8' });
const patch = execSync(`git diff ${BASELINE_COMMIT}..HEAD`, { cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
const logOneline = execSync(`git log --oneline ${BASELINE_COMMIT}..HEAD`, { cwd: root, encoding: 'utf8' }).trim();

const header = [
  'Wildlife Acoustics Training — deliverable patch (repo-only)',
  '==========================================================',
  `project: ${root}`,
  `baseline: ${BASELINE_COMMIT} (pre-improvement-v1.0.3)`,
  `head: ${head}`,
  `timestamp: ${new Date().toISOString()}`,
  '',
  'This patch is the authoritative scope for this goal.',
  'Harness workspace CHANGED_FILES / session patch may include unrelated',
  'paths (swarm, chum-jaws-bridge, Music, .expo) — see harness-scope-audit.txt.',
  '',
  'commits:',
  logOneline || '(none)',
  '',
  'stat:',
  stat.trimEnd(),
  '',
  '--- patch ---',
  '',
].join('\n');

const outPath = path.join(scratch, 'wildlife-acoustics-training.patch');
fs.writeFileSync(outPath, header + patch);

const summary = [
  `wrote ${outPath}`,
  `bytes: ${fs.statSync(outPath).size}`,
  `commits ${BASELINE_COMMIT}..${head}: ${logOneline ? logOneline.split('\n').length : 0}`,
].join('\n');

console.log(summary);