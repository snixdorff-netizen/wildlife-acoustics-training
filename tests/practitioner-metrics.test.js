'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const {
  countCurriculumStats,
  assessCurrentProfile,
  getBaselineMetrics,
  getImprovedMetrics,
  computeUpliftReport,
  scoreProfile,
  RUBRIC_WEIGHTS,
  SNAPSHOT_PATH,
} = require('../src/practitioner-metrics');
const { getAllModules } = require('../src/curriculum');

describe('practitioner metrics rubric', () => {
  it('frozen snapshot matches dimensions produced by scoring probed baseline profile', () => {
    const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
    const baseline = getBaselineMetrics();
    assert.deepEqual(baseline.dimensions, snapshot.dimensions);
    assert.equal(baseline.total, snapshot.total);
    assert.equal(baseline.profile.questionCount, 34);
  });

  it('improved metrics score current tree forward with rubric weights', () => {
    const liveQuestions = getAllModules().reduce((s, m) => s + m.knowledgeCheck.questions.length, 0);
    const baseline = getBaselineMetrics();
    const improved = getImprovedMetrics();
    const rescored = scoreProfile(assessCurrentProfile());

    assert.equal(improved.captureMethod, 'current-tree-probe');
    assert.deepEqual(improved.dimensions, rescored.dimensions);
    assert.equal(improved.total, rescored.total);
    assert.ok(improved.total > baseline.total);
    assert.equal(improved.profile.questionCount, liveQuestions);
    assert.equal(baseline.profile.questionCount, liveQuestions);
  });

  it('meets >=15% relative uplift via documented rubric weights', () => {
    assert.ok(RUBRIC_WEIGHTS.fieldReferenceUtility.perRefEntry > 0);
    const report = computeUpliftReport(getBaselineMetrics(), getImprovedMetrics());
    assert.equal(report.targetMet, true);
    assert.ok(report.percent >= 15);
  });

  it('assessCurrentProfile reflects shipped v1.1 capabilities from current tree', () => {
    const profile = assessCurrentProfile();
    assert.equal(profile.version, '1.1.0');
    assert.ok(profile.fieldRefEntryCount >= 8);
    assert.equal(profile.hasCurriculumSearch, true);
    assert.equal(profile.hasStudyPaths, true);
    assert.equal(profile.hasRemediationQueue, true);
    assert.equal(countCurriculumStats().questionCount, profile.questionCount);
  });
});