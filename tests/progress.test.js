'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { gradeKnowledgeCheck } = require('../src/quiz');
const { getModuleById } = require('../src/curriculum');
const {
  createEmptyProgress,
  markLessonComplete,
  recordKnowledgeCheckResult,
  getModuleProgress,
  getOverallProgress,
  serializeProgress,
  deserializeProgress,
} = require('../src/progress');

describe('progress tracking', () => {
  const moduleId = 'intro-bioacoustics-novice';
  const mod = getModuleById(moduleId);

  it('starts from empty progress', () => {
    const p = createEmptyProgress();
    const mp = getModuleProgress(p, moduleId);
    assert.equal(mp.lessonsComplete, 0);
    assert.equal(mp.knowledgeCheckPassed, false);
    assert.equal(mp.moduleComplete, false);
  });

  it('records lesson completions', () => {
    let p = createEmptyProgress();
    for (const lesson of mod.lessons) {
      p = markLessonComplete(p, moduleId, lesson.id);
    }
    const mp = getModuleProgress(p, moduleId);
    assert.equal(mp.lessonsComplete, mod.lessons.length);
    assert.equal(mp.lessonsPercent, 1);
  });

  it('records knowledge check results and marks module complete when passed', () => {
    let p = createEmptyProgress();
    for (const lesson of mod.lessons) {
      p = markLessonComplete(p, moduleId, lesson.id);
    }

    const answers = {};
    for (const q of mod.knowledgeCheck.questions) {
      answers[q.id] = q.correctIndex;
    }
    const grade = gradeKnowledgeCheck(mod.knowledgeCheck, answers);
    p = recordKnowledgeCheckResult(p, moduleId, grade);

    const mp = getModuleProgress(p, moduleId);
    assert.equal(mp.knowledgeCheckPassed, true);
    assert.equal(mp.moduleComplete, true);

    const overall = getOverallProgress(p);
    assert.equal(overall.completedModules, 1);
    assert.ok(overall.percentComplete > 0);
  });

  it('serializes and deserializes progress', () => {
    let p = markLessonComplete(createEmptyProgress(), moduleId, mod.lessons[0].id);
    const json = serializeProgress(p);
    const restored = deserializeProgress(json);
    assert.deepEqual(restored.completedLessons, p.completedLessons);
  });
});