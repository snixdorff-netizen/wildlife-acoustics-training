'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const SNAPSHOT_PATH = path.join(root, 'evidence', 'baseline-v1.0.3-snapshot.json');
const BASELINE_COMMIT = '9a91f37';
const BASELINE_TAG = 'pre-improvement-v1.0.3';

function loadFrozenBaselineSnapshot() {
  if (!fs.existsSync(SNAPSHOT_PATH)) {
    throw new Error(`Missing frozen baseline snapshot: ${SNAPSHOT_PATH}`);
  }
  return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
}

/** Baseline metrics copied from committed evidence — dimensions are not re-scored. */
function frozenBaselineMetrics() {
  const snapshot = loadFrozenBaselineSnapshot();
  return {
    label: `baseline-${snapshot.profile.version}`,
    rubric: 'five-dimension-0-20',
    dimensions: snapshot.dimensions,
    total: snapshot.total,
    profile: snapshot.profile,
    sourceCommit: snapshot.sourceCommit,
    sourceTag: snapshot.sourceTag || BASELINE_TAG,
    snapshotCapturedAt: snapshot.capturedAt,
    captureMethod: 'frozen-evidence-snapshot',
    checklist: {
      fieldQuickReference: snapshot.profile.fieldRefEntryCount > 0,
      deploymentChecklist: snapshot.profile.hasDeploymentChecklist,
      taxaFrequencyBands: snapshot.profile.hasTaxaFrequencyBands,
      remediationQueue: snapshot.profile.hasRemediationQueue,
      curriculumSearch: snapshot.profile.hasCurriculumSearch,
      studyPaths: snapshot.profile.hasStudyPaths,
      fieldSeasonMobile: snapshot.profile.hasFieldSeasonMobileCss,
      modules: snapshot.profile.moduleCount,
      lessons: snapshot.profile.lessonCount,
      questions: snapshot.profile.questionCount,
    },
  };
}

module.exports = {
  SNAPSHOT_PATH,
  BASELINE_COMMIT,
  BASELINE_TAG,
  loadFrozenBaselineSnapshot,
  frozenBaselineMetrics,
};