'use strict';

const path = require('path');
const { measureTreeProfile } = require(path.join(__dirname, '..', 'scripts', 'measure-tree-profile'));
const {
  RUBRIC_WEIGHTS,
  RUBRIC_DIMENSIONS,
  scoreProfile,
  buildMetricsReport,
  computeUpliftReport,
} = require(path.join(__dirname, '..', 'scripts', 'rubric'));
const {
  SNAPSHOT_PATH,
  BASELINE_COMMIT,
  BASELINE_TAG,
  frozenBaselineMetrics,
  loadFrozenBaselineSnapshot,
} = require(path.join(__dirname, '..', 'scripts', 'load-frozen-baseline'));

const PROJECT_ROOT = path.join(__dirname, '..');

function countCurriculumStats() {
  const profile = measureTreeProfile(PROJECT_ROOT);
  return {
    moduleCount: profile.moduleCount,
    lessonCount: profile.lessonCount,
    questionCount: profile.questionCount,
  };
}

function assessCurrentProfile() {
  return measureTreeProfile(PROJECT_ROOT);
}

function getBaselineMetrics() {
  return frozenBaselineMetrics();
}

function getImprovedMetrics() {
  const profile = assessCurrentProfile();
  const scored = scoreProfile(profile);
  return buildMetricsReport(`improved-v${profile.version}`, profile, scored, {
    captureMethod: 'current-tree-probe',
    probedAt: new Date().toISOString(),
  });
}

module.exports = {
  RUBRIC_WEIGHTS,
  RUBRIC_DIMENSIONS,
  SNAPSHOT_PATH,
  BASELINE_COMMIT,
  BASELINE_TAG,
  countCurriculumStats,
  assessCurrentProfile,
  scoreProfile,
  loadFrozenBaselineSnapshot,
  getBaselineMetrics,
  getImprovedMetrics,
  computeUpliftReport,
};