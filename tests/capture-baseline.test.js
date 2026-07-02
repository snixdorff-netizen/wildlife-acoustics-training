'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const root = path.join(__dirname, '..');

describe('capture-baseline-only (live pre-change probe)', () => {
  it('writes baseline-metrics.json from live git worktree probe', () => {
    const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'wat-capture-'));
    execSync('node scripts/capture-baseline-only.js', {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, SCRATCH: scratch },
    });

    const metrics = JSON.parse(fs.readFileSync(path.join(scratch, 'baseline-metrics.json'), 'utf8'));
    const log = fs.readFileSync(path.join(scratch, 'baseline-capture.log'), 'utf8');

    assert.equal(metrics.captureMethod, 'git-worktree-live-probe');
    assert.equal(metrics.sourceCommit, '9a91f37');
    assert.equal(metrics.profile.questionCount, 34);
    assert.equal(metrics.total, 45);
    assert.ok(log.includes('live git worktree probe'));
    assert.ok(log.includes('profile matches snapshot: true'));
  });
});