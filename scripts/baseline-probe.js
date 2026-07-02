'use strict';

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.join(__dirname, '..');
const BASELINE_COMMIT = process.env.BASELINE_COMMIT || '9a91f37';

/**
 * Probe the pre-improvement companion by checking out BASELINE_COMMIT in a
 * detached git worktree and measuring observable capability flags there.
 */
function probeBaselineFromGit(commit = BASELINE_COMMIT) {
  const worktreePath = fs.mkdtempSync(path.join(os.tmpdir(), 'wat-baseline-'));
  const measureScript = path.join(root, 'scripts', 'measure-tree-profile.js');

  try {
    execSync(`git worktree add --detach "${worktreePath}" ${commit}`, {
      cwd: root,
      stdio: 'pipe',
    });

    const result = spawnSync('node', [measureScript, worktreePath], {
      encoding: 'utf8',
    });

    if (result.status !== 0) {
      throw new Error(`measure-tree-profile failed: ${result.stderr || result.stdout}`);
    }

    const profile = JSON.parse(result.stdout);
    return {
      sourceCommit: commit,
      probedAt: new Date().toISOString(),
      treePath: worktreePath,
      profile,
    };
  } finally {
    try {
      execSync(`git worktree remove --force "${worktreePath}"`, { cwd: root, stdio: 'pipe' });
    } catch {
      /* worktree may already be removed */
    }
  }
}

if (require.main === module) {
  const probe = probeBaselineFromGit();
  console.log(JSON.stringify(probe, null, 2));
}

module.exports = { probeBaselineFromGit, BASELINE_COMMIT };