'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  getFieldReferenceEntries,
  getDeploymentChecklist,
  filterFieldReference,
  getFieldReferenceCategories,
} = require('../src/field-reference');

describe('field reference', () => {
  it('exposes taxa frequency and deployment reference entries', () => {
    const entries = getFieldReferenceEntries();
    assert.ok(entries.length >= 8);
    assert.ok(entries.some((e) => e.category === 'taxa-frequency' && e.tags.includes('bats')));
    assert.ok(entries.some((e) => e.category === 'deployment'));
  });

  it('filters by category and query', () => {
    const bats = filterFieldReference({ query: 'bat' });
    assert.ok(bats.length >= 1);
    const taxa = filterFieldReference({ category: 'taxa-frequency' });
    assert.ok(taxa.every((e) => e.category === 'taxa-frequency'));
  });

  it('includes a deployment checklist', () => {
    const checklist = getDeploymentChecklist();
    assert.ok(checklist.length >= 5);
    assert.ok(checklist.some((item) => /Nyquist/i.test(item)));
  });

  it('lists reference categories', () => {
    const cats = getFieldReferenceCategories();
    assert.ok(cats.includes('qa-checklist'));
    assert.ok(cats.includes('taxa-frequency'));
  });
});