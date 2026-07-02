'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { gradeKnowledgeCheck } = require('../src/quiz');
const { getModuleById } = require('../src/curriculum');

describe('quiz grading', () => {
  const mod = getModuleById('intro-bioacoustics-novice');
  const kc = mod.knowledgeCheck;

  it('grades all-correct answers as passed', () => {
    const answers = {};
    for (const q of kc.questions) {
      answers[q.id] = q.correctIndex;
    }
    const result = gradeKnowledgeCheck(kc, answers);
    assert.equal(result.passed, true);
    assert.equal(result.score, 1);
    assert.equal(result.results.every((r) => r.correct), true);
  });

  it('grades incorrect answers with rationale feedback', () => {
    const answers = {};
    for (const q of kc.questions) {
      answers[q.id] = q.correctIndex === 0 ? 1 : 0;
    }
    const result = gradeKnowledgeCheck(kc, answers);
    assert.equal(result.passed, false);
    assert.ok(result.results.some((r) => !r.correct));
    assert.ok(result.results[0].feedback.includes('Incorrect'));
    assert.ok(result.results[0].rationale.length > 10);
  });

  it('handles unanswered questions', () => {
    const result = gradeKnowledgeCheck(kc, {});
    assert.equal(result.passed, false);
    assert.ok(result.results.every((r) => r.feedback === 'No answer selected.'));
  });
});