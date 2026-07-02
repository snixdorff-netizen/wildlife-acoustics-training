'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const SNAPSHOT_PATH = path.join(root, 'evidence', 'baseline-v1.0.3-snapshot.json');
const BASELINE_COMMIT = '9a91f37';
const BASELINE_TAG = 'pre-improvement-v1.0.3';

function gitCatFile(pathInRepo, commit = BASELINE_COMMIT) {
  try {
    execSync(`git cat-file -e ${commit}:${pathInRepo}`, { cwd: root, stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function gitShow(pathInRepo, commit = BASELINE_COMMIT) {
  return execSync(`git show ${commit}:${pathInRepo}`, { cwd: root, encoding: 'utf8' });
}

describe('baseline evidence (structural honesty)', () => {
  it('loads frozen snapshot directly without practitioner-metrics', () => {
    const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
    assert.equal(snapshot.sourceCommit, BASELINE_COMMIT);
    assert.equal(snapshot.profile.version, '1.0.3');
    assert.equal(snapshot.profile.questionCount, 34);
    assert.equal(snapshot.total, 45);
    assert.equal(snapshot.profile.hasCurriculumSearch, false);
    assert.equal(snapshot.profile.fieldRefEntryCount, 0);
    assert.ok(snapshot.dimensions);
    assert.equal(snapshot.dimensions.fieldReferenceUtility, 0);
    assert.ok(snapshot.provenance);
    assert.equal(snapshot.repoTopology, 'sole-committed-ancestor-pre-v1.1');
  });

  it('pre-improvement commit lacks v1.1 practitioner modules', () => {
    const absent = [
      'src/field-reference.js',
      'src/search.js',
      'src/study-paths.js',
      'src/remediation.js',
      'src/practitioner-metrics.js',
      'scripts/rubric.js',
    ];
    for (const file of absent) {
      assert.equal(gitCatFile(file), false, `expected absent at baseline: ${file}`);
    }
  });

  it('pre-improvement template lacks curriculum-search and fieldref nav', () => {
    const template = gitShow('templates/index.template.html');
    assert.ok(!template.includes('curriculum-search'));
    assert.ok(!template.includes('data-nav="fieldref"'));
    assert.ok(!template.includes('view-fieldref'));
  });

  it('baseline git tag points at pre-improvement commit', () => {
    const tagCommit = execSync(`git rev-parse ${BASELINE_TAG}^{commit}`, {
      cwd: root,
      encoding: 'utf8',
    }).trim();
    const baselineCommit = execSync(`git rev-parse ${BASELINE_COMMIT}`, {
      cwd: root,
      encoding: 'utf8',
    }).trim();
    assert.equal(tagCommit, baselineCommit);
  });

  it('working tree contains v1.1 modules absent at baseline commit', () => {
    const head = execSync('git rev-parse HEAD', { cwd: root, encoding: 'utf8' }).trim();
    const baseline = execSync(`git rev-parse ${BASELINE_COMMIT}`, { cwd: root, encoding: 'utf8' }).trim();
    assert.equal(head, baseline, 'HEAD at pre-improvement tag with uplift in working tree');

    assert.equal(gitCatFile('src/field-reference.js', BASELINE_COMMIT), false);
    assert.ok(fs.existsSync(path.join(root, 'src/field-reference.js')));
    assert.ok(fs.existsSync(path.join(root, 'src/search.js')));
    assert.ok(fs.existsSync(path.join(root, 'public/js/app.js')));
  });
});