'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const scratch = process.env.SCRATCH || path.join(root, '.verify-scratch');

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(scratch, file), 'utf8'));
}

function parseUpliftPercent(text) {
  const m = text.match(/Relative uplift:\s*([\d.]+)%/);
  return m ? parseFloat(m[1]) : null;
}

function emit() {
  const manifest = readJson('deliverable-manifest.json');
  const upliftText = fs.readFileSync(path.join(scratch, 'uplift-report.txt'), 'utf8');
  const improved = readJson('improved-metrics.json');
  const baseline = readJson('baseline-metrics.json');
  const percent = parseUpliftPercent(upliftText);

  const lines = [
    'Wildlife Acoustics Training Companion v1.1.0 — deliverable claims',
    `baseline: ${baseline.total}/100 (${baseline.captureMethod})`,
    `improved: ${improved.total}/100 (${improved.captureMethod})`,
    `relative uplift: ${percent}%`,
    `deliverable paths (${manifest.pathCount}):`,
    ...manifest.paths.map((p) => `  - ${p}`),
  ];

  const text = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(scratch, 'final-claims.txt'), text);
  console.log(text);
}

if (require.main === module) {
  emit();
}

module.exports = { emit };