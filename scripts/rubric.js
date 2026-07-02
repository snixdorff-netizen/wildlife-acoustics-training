'use strict';

/**
 * Pure five-dimension rubric (0–20 each, total 0–100).
 * No git, no filesystem — profile in, scores out.
 */
const RUBRIC_WEIGHTS = {
  fieldReferenceUtility: {
    perRefEntry: 1.5,
    maxRefScore: 12,
    deploymentChecklist: 5,
    taxaFrequencyBands: 3,
  },
  remediationReview: {
    immediateQuizFeedback: 8,
    persistentRemediationQueue: 10,
  },
  discoverabilityNavigation: {
    catalogAndLevelFilter: 6,
    curriculumSearch: 6,
    perStudyPath: 2,
    maxStudyPathScore: 8,
  },
  fieldSeasonUsability: {
    fileProtocolViable: 10,
    responsiveBaseLayout: 4,
    fieldSeasonMobileToolbar: 8,
  },
  curriculumDepthCoverage: {
    perModule: 1.2,
    maxModuleContribution: 13.2,
    perLesson: 0.08,
    maxLessonContribution: 3.2,
    perQuestion: 0.04,
    maxQuestionContribution: 1.8,
  },
};

const RUBRIC_DIMENSIONS = [
  'fieldReferenceUtility',
  'remediationReview',
  'discoverabilityNavigation',
  'fieldSeasonUsability',
  'curriculumDepthCoverage',
];

function clampDimension(score) {
  return Math.max(0, Math.min(20, Math.round(score)));
}

function scoreProfile(profile) {
  const w = RUBRIC_WEIGHTS;

  const fieldReferenceUtility = clampDimension(
    Math.min(w.fieldReferenceUtility.maxRefScore, profile.fieldRefEntryCount * w.fieldReferenceUtility.perRefEntry) +
      (profile.hasDeploymentChecklist ? w.fieldReferenceUtility.deploymentChecklist : 0) +
      (profile.hasTaxaFrequencyBands ? w.fieldReferenceUtility.taxaFrequencyBands : 0)
  );

  const remediationReview = clampDimension(
    (profile.hasImmediateQuizFeedback ? w.remediationReview.immediateQuizFeedback : 0) +
      (profile.hasRemediationQueue ? w.remediationReview.persistentRemediationQueue : 0)
  );

  const discoverabilityNavigation = clampDimension(
    (profile.hasCatalogAndLevelFilter ? w.discoverabilityNavigation.catalogAndLevelFilter : 0) +
      (profile.hasCurriculumSearch ? w.discoverabilityNavigation.curriculumSearch : 0) +
      Math.min(
        w.discoverabilityNavigation.maxStudyPathScore,
        (profile.studyPathCount || 0) * w.discoverabilityNavigation.perStudyPath
      )
  );

  const fieldSeasonUsability = clampDimension(
    (profile.hasFileProtocolViable ? w.fieldSeasonUsability.fileProtocolViable : 0) +
      (profile.hasResponsiveBaseLayout ? w.fieldSeasonUsability.responsiveBaseLayout : 0) +
      (profile.hasFieldSeasonMobileCss ? w.fieldSeasonUsability.fieldSeasonMobileToolbar : 0)
  );

  const curriculumDepthCoverage = clampDimension(
    Math.min(w.curriculumDepthCoverage.maxModuleContribution, profile.moduleCount * w.curriculumDepthCoverage.perModule) +
      Math.min(w.curriculumDepthCoverage.maxLessonContribution, profile.lessonCount * w.curriculumDepthCoverage.perLesson) +
      Math.min(w.curriculumDepthCoverage.maxQuestionContribution, profile.questionCount * w.curriculumDepthCoverage.perQuestion)
  );

  const dimensions = {
    fieldReferenceUtility,
    remediationReview,
    discoverabilityNavigation,
    fieldSeasonUsability,
    curriculumDepthCoverage,
  };

  const total = RUBRIC_DIMENSIONS.reduce((sum, key) => sum + dimensions[key], 0);
  return { dimensions, total, profile };
}

function buildChecklist(profile) {
  return {
    fieldQuickReference: profile.fieldRefEntryCount > 0,
    deploymentChecklist: profile.hasDeploymentChecklist,
    taxaFrequencyBands: profile.hasTaxaFrequencyBands,
    remediationQueue: profile.hasRemediationQueue,
    curriculumSearch: profile.hasCurriculumSearch,
    studyPaths: profile.hasStudyPaths,
    fieldSeasonMobile: profile.hasFieldSeasonMobileCss,
    modules: profile.moduleCount,
    lessons: profile.lessonCount,
    questions: profile.questionCount,
  };
}

function buildMetricsReport(label, profile, scored, meta = {}) {
  return {
    label,
    rubric: 'five-dimension-0-20',
    dimensions: scored.dimensions,
    total: scored.total,
    profile,
    ...meta,
    checklist: buildChecklist(profile),
  };
}

function computeUpliftReport(baseline, improved) {
  const baselineTotal = baseline.total;
  const improvedTotal = improved.total;
  const delta = improvedTotal - baselineTotal;
  const percent =
    baselineTotal === 0
      ? improvedTotal >= 15
        ? Infinity
        : (improvedTotal / 15) * 100
      : (delta / baselineTotal) * 100;

  const lines = [
    'Wildlife Acoustics Training — Practitioner Value Uplift Report',
    '==============================================================',
    '',
    `Baseline (${baseline.label}): total ${baselineTotal}/100`,
    `  source: ${baseline.sourceCommit || 'unknown'} tag ${baseline.sourceTag || 'none'} via ${baseline.captureMethod || 'unknown'}`,
    ...RUBRIC_DIMENSIONS.map((d) => `  ${d}: ${baseline.dimensions[d]}/20`),
    '',
    `Improved (${improved.label}): total ${improvedTotal}/100`,
    `  source: current tree via ${improved.captureMethod || 'unknown'}`,
    ...RUBRIC_DIMENSIONS.map(
      (d) => `  ${d}: ${improved.dimensions[d]}/20 (+${improved.dimensions[d] - baseline.dimensions[d]})`
    ),
    '',
    `Delta: +${delta} points`,
    `Relative uplift: ${percent === Infinity ? 'N/A (baseline=0)' : percent.toFixed(1) + '%'}`,
    `Target met (>=15%): ${percent === Infinity ? improvedTotal >= 15 : percent >= 15 ? 'YES' : 'NO'}`,
    '',
    'New capabilities:',
    `  field quick-reference entries: ${improved.profile.fieldRefEntryCount}`,
    `  deployment checklist: ${improved.profile.hasDeploymentChecklist}`,
    `  remediation queue: ${improved.profile.hasRemediationQueue}`,
    `  curriculum search: ${improved.profile.hasCurriculumSearch}`,
    `  study paths: ${improved.profile.studyPathCount}`,
    `  field-season mobile CSS: ${improved.profile.hasFieldSeasonMobileCss}`,
    `  curriculum questions (live): ${improved.profile.questionCount}`,
  ];

  return {
    text: lines.join('\n'),
    percent,
    delta,
    targetMet: percent === Infinity ? improvedTotal >= 15 : percent >= 15,
  };
}

module.exports = {
  RUBRIC_WEIGHTS,
  RUBRIC_DIMENSIONS,
  scoreProfile,
  buildChecklist,
  buildMetricsReport,
  computeUpliftReport,
};