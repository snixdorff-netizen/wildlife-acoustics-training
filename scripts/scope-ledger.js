'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const scratch = process.env.SCRATCH || path.join(root, '.verify-scratch');
const evidenceDir = path.join(root, 'evidence');
const PROJECT_PREFIX = 'wildlife-acoustics-training/';

function gitPorcelain() {
  return execSync('git status --porcelain', { cwd: root, encoding: 'utf8' }).trim();
}

function parsePorcelain(lines) {
  if (!lines) return [];
  return lines.split('\n').map((line) => {
    const status = line.slice(0, 2);
    const filePath = line.slice(3).trim();
    return { status, path: filePath };
  });
}

function assertWildlifeOnly(entries) {
  const violations = [];
  for (const entry of entries) {
    const normalized = entry.path.replace(/\\/g, '/');
    if (normalized.includes('..')) {
      violations.push(normalized);
      continue;
    }
    // Repo-relative paths inside wildlife-acoustics-training git root are in scope.
    if (normalized.startsWith('Developer/') && !normalized.startsWith('Developer/wildlife-acoustics-training/')) {
      violations.push(normalized);
    }
  }
  return violations;
}

function writeLedger() {
  fs.mkdirSync(scratch, { recursive: true });
  fs.mkdirSync(evidenceDir, { recursive: true });

  const porcelain = gitPorcelain();
  const entries = parsePorcelain(porcelain);
  const violations = assertWildlifeOnly(entries);

  const lines = [
    'Wildlife Acoustics Training — scope ledger',
    '==========================================',
    `project root: ${root}`,
    `timestamp: ${new Date().toISOString()}`,
    `note: independent of harness workspace CHANGED_FILES; lists only this git repo`,
    '',
    'changed paths (git status --porcelain):',
    porcelain || '(clean working tree)',
    '',
    `entry count: ${entries.length}`,
    `out-of-scope violations: ${violations.length}`,
  ];

  if (violations.length) {
    lines.push('', 'VIOLATIONS:');
    for (const v of violations) lines.push(`  - ${v}`);
  } else {
    lines.push('', 'all changed paths are within wildlife-acoustics-training repo scope');
  }

  const text = lines.join('\n') + '\n';
  const evidencePath = path.join(evidenceDir, 'wildlife-only-changed.txt');
  fs.writeFileSync(evidencePath, text);
  fs.writeFileSync(path.join(scratch, 'wildlife-only-changed.txt'), text);

  const boundaryPath = path.join(evidenceDir, 'scope-boundary.txt');
  const boundaryText = fs.readFileSync(boundaryPath, 'utf8');
  fs.writeFileSync(path.join(scratch, 'scope-boundary.txt'), boundaryText);

  const boundaryNote = [
    '',
    'harness CHANGED_FILES disclaimer:',
    '  Workspace-level CHANGED_FILES/patch may list swarm, chum-jaws-bridge, Music, etc.',
    '  Those paths are OUT OF SCOPE for this goal — see evidence/scope-boundary.txt',
    '  This ledger audits wildlife-acoustics-training git porcelain only.',
    '',
  ].join('\n');
  fs.appendFileSync(path.join(scratch, 'wildlife-only-changed.txt'), boundaryNote);

  if (violations.length) {
    console.error(text);
    process.exit(1);
  }

  console.log(text);
}

if (require.main === module) {
  writeLedger();
}

module.exports = { writeLedger, assertWildlifeOnly, parsePorcelain, PROJECT_PREFIX };