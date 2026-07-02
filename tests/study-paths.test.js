'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getStudyPaths, getStudyPathById, getRecommendedModules } = require('../src/study-paths');

describe('study paths', () => {
  it('defines role-based practitioner paths', () => {
    const paths = getStudyPaths();
    assert.equal(paths.length, 4);
    assert.ok(paths.some((p) => p.id === 'bat-surveyor'));
    assert.ok(paths.some((p) => p.id === 'field-tech'));
  });

  it('resolves recommended modules for bat surveyor path', () => {
    const path = getStudyPathById('bat-surveyor');
    assert.ok(path);
    const mods = getRecommendedModules('bat-surveyor');
    assert.equal(mods.length, path.moduleIds.length);
    assert.ok(mods.every((m) => path.moduleIds.includes(m.id)));
  });
});