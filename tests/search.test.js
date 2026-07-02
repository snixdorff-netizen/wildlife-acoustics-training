'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { searchCurriculum, moduleSearchText } = require('../src/search');
const { getAllModules } = require('../src/curriculum');

describe('curriculum search', () => {
  it('returns empty for blank query', () => {
    assert.deepEqual(searchCurriculum(''), []);
    assert.deepEqual(searchCurriculum('   '), []);
  });

  it('finds modules and lessons by keyword', () => {
    const hits = searchCurriculum('bat');
    assert.ok(hits.length >= 1);
    const hasModuleOrLesson = hits.some((h) => h.matches.length > 0);
    assert.ok(hasModuleOrLesson);
  });

  it('moduleSearchText includes lesson content', () => {
    const mod = getAllModules()[0];
    const text = moduleSearchText(mod);
    assert.ok(text.includes(mod.title.toLowerCase()));
    assert.ok(text.length > mod.title.length);
  });
});