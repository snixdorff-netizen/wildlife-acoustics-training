'use strict';

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const scratch = process.env.SCRATCH || path.join(root, '.verify-scratch');

function purgeScratch(dir) {
  if (fs.existsSync(dir)) {
    for (const name of fs.readdirSync(dir)) {
      fs.rmSync(path.join(dir, name), { recursive: true, force: true });
    }
  }
  fs.mkdirSync(dir, { recursive: true });
}

purgeScratch(scratch);

const testFiles = fs
  .readdirSync(path.join(root, 'tests'))
  .filter((name) => name.endsWith('.test.js'))
  .sort()
  .map((name) => path.join('tests', name));

function run(cmd, args, logFile) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, SCRATCH: scratch },
  });
  const out = (result.stdout || '') + (result.stderr || '');
  if (logFile) fs.writeFileSync(path.join(scratch, logFile), out);
  if (result.status !== 0) {
    console.error(out);
    process.exit(result.status || 1);
  }
  return out;
}

console.log('SCRATCH:', scratch);
console.log('test files:', testFiles.length, testFiles.join(', '));

const buildOut = execSync('node scripts/build.js', { cwd: root, encoding: 'utf8' });
console.log(buildOut);

const testRun = spawnSync('node', ['--test', '--test-concurrency=1', ...testFiles], {
  cwd: root,
  encoding: 'utf8',
  env: { ...process.env, SCRATCH: scratch },
});
const testOut = (testRun.stdout || '') + (testRun.stderr || '');
const unitLog = [
  `verify manifest: ${new Date().toISOString()}`,
  `project: wildlife-acoustics-training`,
  `test files (${testFiles.length}): ${testFiles.join(', ')}`,
  '',
  '--- build (cleanPublicArtifacts + bundle) ---',
  buildOut.trimEnd(),
  '',
  '--- unit tests ---',
  testOut.trimEnd(),
  '',
].join('\n');
fs.writeFileSync(path.join(scratch, 'unit-tests.log'), unitLog);
if (testRun.status !== 0) {
  console.error(testOut);
  process.exit(testRun.status || 1);
}

const { getCurriculumAudit } = require(path.join(root, 'src', 'curriculum'));
fs.writeFileSync(path.join(scratch, 'curriculum-audit.txt'), getCurriculumAudit());

run('node', [path.join(root, 'tests', 'interaction.harness.js')], 'interaction.log');

const e2e = spawnSync('node', [path.join(root, 'tests', 'browser-e2e.mjs')], {
  cwd: root,
  encoding: 'utf8',
  env: { ...process.env, SCRATCH: scratch },
});
const launchLog = (e2e.stdout || '') + (e2e.stderr || '');
fs.writeFileSync(path.join(scratch, 'launch.log'), launchLog);
console.log(launchLog);
if (e2e.status !== 0) process.exit(e2e.status || 1);

console.log('verify: all evidence written to', scratch);