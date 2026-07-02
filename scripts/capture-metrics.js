'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const scratch = process.env.SCRATCH || path.join(root, '.verify-scratch');
fs.mkdirSync(scratch, { recursive: true });

const baselinePath = path.join(scratch, 'baseline-metrics.json');
if (!fs.existsSync(baselinePath)) {
  require('./capture-baseline-only.js');
}
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const { getImprovedMetrics, computeUpliftReport } = require(path.join(root, 'src', 'practitioner-metrics'));

const improved = getImprovedMetrics();
fs.writeFileSync(path.join(scratch, 'improved-metrics.json'), JSON.stringify(improved, null, 2));

const uplift = computeUpliftReport(baseline, improved);
fs.writeFileSync(path.join(scratch, 'uplift-report.txt'), uplift.text);

console.log('baseline total:', baseline.total, `(${baseline.captureMethod} @ ${baseline.sourceCommit})`);
console.log('improved total:', improved.total, `(${improved.captureMethod})`);
console.log('relative uplift:', uplift.percent === Infinity ? 'N/A' : uplift.percent.toFixed(1) + '%');
console.log('target met:', uplift.targetMet ? 'YES' : 'NO');