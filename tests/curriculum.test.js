'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  getTracks,
  getModuleById,
  getModulesForTrack,
  getAllModules,
  filterModulesByLevel,
  getCurriculumAudit,
  validateCurriculumCoverage,
  LEVELS,
} = require('../src/curriculum');

describe('curriculum', () => {
  it('includes all required Academy track categories', () => {
    const validation = validateCurriculumCoverage();
    assert.equal(validation.valid, true, validation.errors.join('; '));
  });

  it('has representative modules per track', () => {
    assert.ok(getModulesForTrack('bioacoustics-fundamentals').length >= 1);
    assert.ok(getModulesForTrack('song-meter-hardware').length >= 1);
    assert.ok(getModulesForTrack('kaleidoscope-analysis').length >= 1);
    assert.ok(getModulesForTrack('species-applications').length >= 1);
    assert.ok(getModulesForTrack('regulatory-guidelines').length >= 1);
  });

  it('tags modules with Beginner, Intermediate, and Advanced levels', () => {
    for (const level of LEVELS) {
      assert.ok(filterModulesByLevel(level).length >= 1, `missing modules for ${level}`);
    }
  });

  it('exposes intro bioacoustics novice module with lessons and questions', () => {
    const mod = getModuleById('intro-bioacoustics-novice');
    assert.ok(mod);
    assert.equal(mod.level, 'Beginner');
    assert.ok(mod.lessons.length >= 1);
    assert.ok(mod.knowledgeCheck.questions.length >= 1);
    assert.ok(mod.knowledgeCheck.questions[0].rationale);
  });

  it('lists all tracks with modules', () => {
    const tracks = getTracks();
    assert.equal(tracks.length, 5);
    assert.equal(getAllModules().length, 11);
    for (const mod of getAllModules()) {
      assert.ok(mod.lessons.length >= 3, `${mod.id} lessons`);
      assert.ok(mod.knowledgeCheck.questions.length >= 3, `${mod.id} questions`);
    }
  });

  it('produces audit listing', () => {
    const audit = getCurriculumAudit();
    assert.match(audit, /Bioacoustics Fundamentals/);
    assert.match(audit, /USFWS/);
    assert.match(audit, /Total modules: 11/);
  });
});