'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { BASELINE_TAG } = require('./load-frozen-baseline');

const root = path.join(__dirname, '..');
const scratch = process.env.SCRATCH || path.join(root, '.verify-scratch');

const REQUIRED_PATHS = [
  'src/field-reference.js',
  'src/search.js',
  'src/remediation.js',
  'src/study-paths.js',
  'public/js/app.js',
  'styles/styles.css',
  'templates/index.template.html',
];

const REQUIRED_TEST_GLOBS = [
  'tests/field-reference.test.js',
  'tests/search.test.js',
  'tests/remediation.test.js',
  'tests/study-paths.test.js',
  'tests/practitioner-metrics.test.js',
  'tests/baseline-evidence.test.js',
  'tests/capture-baseline.test.js',
];

function listDeliverablePaths() {
  const out = execSync(`git diff --name-only ${BASELINE_TAG}`, {
    cwd: root,
    encoding: 'utf8',
  }).trim();
  const untracked = execSync('git ls-files --others --exclude-standard', {
    cwd: root,
    encoding: 'utf8',
  }).trim();
  const names = new Set();
  for (const block of [out, untracked]) {
    if (!block) continue;
    for (const line of block.split('\n')) {
      const p = line.trim();
      if (p) names.add(p);
    }
  }
  return [...names].sort();
}

function buildManifest() {
  const paths = listDeliverablePaths();
  const capabilityTests = paths.filter((p) =>
    REQUIRED_TEST_GLOBS.some((t) => p === t || p.endsWith(t))
  );
  const missingRequired = REQUIRED_PATHS.filter((p) => !paths.includes(p));

  return {
    baselineTag: BASELINE_TAG,
    generatedAt: new Date().toISOString(),
    pathCount: paths.length,
    paths,
    requiredPaths: REQUIRED_PATHS,
    missingRequired,
    capabilityTestCount: capabilityTests.length,
    capabilityTests,
    valid: missingRequired.length === 0 && capabilityTests.length >= 3,
  };
}

function emitManifest() {
  fs.mkdirSync(scratch, { recursive: true });
  const manifest = buildManifest();
  const outPath = path.join(scratch, 'deliverable-manifest.json');
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n');

  const summary = [
    `deliverable manifest: ${manifest.pathCount} paths vs ${BASELINE_TAG}`,
    `missing required: ${manifest.missingRequired.length}`,
    `capability tests: ${manifest.capabilityTestCount}`,
    `valid: ${manifest.valid}`,
  ].join('\n');

  console.log(summary);
  if (!manifest.valid) {
    if (manifest.missingRequired.length) {
      console.error('missing:', manifest.missingRequired.join(', '));
    }
    if (manifest.capabilityTestCount < 3) {
      console.error('need >= 3 capability test files in manifest');
    }
    process.exit(1);
  }
  return manifest;
}

if (require.main === module) {
  emitManifest();
}

module.exports = { emitManifest, buildManifest, listDeliverablePaths, REQUIRED_PATHS };