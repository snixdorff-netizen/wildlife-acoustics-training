'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const { cleanPublicArtifacts, BUILT_ARTIFACTS } = require(path.join(root, 'scripts', 'build.js'));

describe('prebuild clean tree', () => {
  it('removes built artifacts then rebuilds from template + styles', () => {
    cleanPublicArtifacts();
    console.log('prebuild: cleanPublicArtifacts cleared built artifacts');
    for (const artifact of BUILT_ARTIFACTS) {
      assert.equal(fs.existsSync(artifact), false, `expected missing before build: ${artifact}`);
    }

    for (const artifact of BUILT_ARTIFACTS) {
      fs.mkdirSync(path.dirname(artifact), { recursive: true });
      fs.writeFileSync(artifact, 'stale artifact for prebuild purge test');
    }

    const buildLog = execSync('node scripts/build.js', { cwd: root, encoding: 'utf8' });
    assert.match(buildLog, /cleanPublicArtifacts: removed/, 'build logs cleanPublicArtifacts purge');

    for (const artifact of BUILT_ARTIFACTS) {
      assert.ok(fs.existsSync(artifact), `expected present after build: ${artifact}`);
    }

    const built = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
    assert.ok(built.includes('--wa-green-dark'), 'rebuilt index has inlined CSS');
    assert.ok(!built.includes('/* INLINE_STYLES */'), 'placeholder replaced');
    assert.equal(built.includes('build-required-notice'), true, 'template guard ships in built entry');
  });
});