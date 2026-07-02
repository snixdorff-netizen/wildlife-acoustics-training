'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const scratch = process.env.SCRATCH || path.join(root, '.verify-scratch');
fs.mkdirSync(scratch, { recursive: true });

const OUT_OF_SCOPE_PREFIXES = [
  'Developer/swarm/',
  'Developer/chum-jaws-bridge/',
  'Music/',
  '.expo/',
];

function parseChangedFilesList(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function classifyPath(p) {
  const normalized = p.replace(/\\/g, '/');
  for (const prefix of OUT_OF_SCOPE_PREFIXES) {
    if (normalized.startsWith(prefix) || normalized.includes(`/${prefix}`)) {
      return 'out-of-scope';
    }
  }
  if (normalized.includes('wildlife-acoustics-training')) return 'in-scope';
  if (normalized.startsWith('Developer/')) return 'out-of-scope-developer';
  if (normalized.startsWith('.grok/')) return 'harness-meta';
  return 'other';
}

function loadHarnessChangedFiles() {
  const candidates = [
    process.env.CHANGED_FILES,
    process.env.GOAL_CHANGED_FILES,
  ].filter(Boolean);

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      return { source: filePath, lines: parseChangedFilesList(fs.readFileSync(filePath, 'utf8')) };
    }
  }

  const sessionDir = process.env.GOAL_SESSION_DIR;
  if (sessionDir) {
    for (const name of ['CHANGED_FILES', 'changed_files.txt']) {
      const p = path.join(sessionDir, name);
      if (fs.existsSync(p)) {
        return { source: p, lines: parseChangedFilesList(fs.readFileSync(p, 'utf8')) };
      }
    }
  }

  return { source: null, lines: [] };
}

function writeAudit() {
  const harness = loadHarnessChangedFiles();
  const classified = harness.lines.map((p) => ({ path: p, scope: classifyPath(p) }));
  const outOfScope = classified.filter((e) => e.scope.startsWith('out-of-scope'));
  const inScope = classified.filter((e) => e.scope === 'in-scope');

  const lines = [
    'Harness scope audit — wildlife-acoustics-training goal',
    '====================================================',
    `timestamp: ${new Date().toISOString()}`,
    `wildlife repo: ${root}`,
    '',
    'DELIVERABLE SCOPE (authoritative):',
    '  git diff pre-improvement-v1.0.3..HEAD in this repo only',
    '  see wildlife-acoustics-training.patch + scope-ledger (git porcelain)',
    '',
    'HARNESS CHANGED_FILES (workspace-level, may be polluted):',
    harness.source ? `  source: ${harness.source}` : '  source: (not provided to verify — audit skipped)',
    `  entries: ${harness.lines.length}`,
    `  in-scope wildlife paths: ${inScope.length}`,
    `  out-of-scope entries: ${outOfScope.length}`,
  ];

  if (outOfScope.length) {
    lines.push('', 'out-of-scope paths in harness list (NOT this deliverable):');
    for (const e of outOfScope.slice(0, 40)) lines.push(`  - ${e.path}`);
    if (outOfScope.length > 40) lines.push(`  ... and ${outOfScope.length - 40} more`);
  }

  lines.push(
    '',
    'interpretation:',
    '  Out-of-scope harness entries do not negate wildlife deliverable evidence.',
    '  This goal does not modify swarm/, chum-jaws-bridge/, or Music/ per plan non-goals.',
    '  Verifier should use wildlife-acoustics-training.patch + in-repo git status as scope truth.',
    ''
  );

  const text = lines.join('\n');
  fs.writeFileSync(path.join(scratch, 'harness-scope-audit.txt'), text);
  fs.writeFileSync(path.join(root, 'evidence', 'harness-scope-audit.txt'), text);
  console.log(text);
}

if (require.main === module) {
  writeAudit();
}

module.exports = { writeAudit, classifyPath, loadHarnessChangedFiles };