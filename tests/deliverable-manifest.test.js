'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  buildManifest,
  listDeliverablePaths,
  REQUIRED_PATHS,
} = require('../scripts/emit-deliverable-manifest');

describe('deliverable manifest', () => {
  it('lists v1.1 practitioner files vs pre-improvement tag', () => {
    const paths = listDeliverablePaths();
    for (const required of REQUIRED_PATHS) {
      assert.ok(paths.includes(required), `expected deliverable path: ${required}`);
    }
    assert.ok(paths.includes('tests/field-reference.test.js'));
    assert.ok(paths.includes('tests/search.test.js'));
    assert.ok(paths.includes('tests/remediation.test.js'));
  });

  it('buildManifest validates required uplift artifacts', () => {
    const manifest = buildManifest();
    assert.equal(manifest.valid, true);
    assert.equal(manifest.missingRequired.length, 0);
    assert.ok(manifest.capabilityTestCount >= 3);
    assert.ok(manifest.paths.length >= 20);
  });
});