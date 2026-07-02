'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getRemediationQueue } = require('../src/remediation');
const { getModuleById } = require('../src/curriculum');
const { gradeKnowledgeCheck } = require('../src/quiz');
const { createEmptyProgress, recordKnowledgeCheckResult } = require('../src/progress');

describe('remediation queue', () => {
  const moduleId = 'intro-bioacoustics-novice';
  const mod = getModuleById(moduleId);

  it('starts empty for fresh progress', () => {
    assert.deepEqual(getRemediationQueue(createEmptyProgress()), []);
  });

  it('queues missed questions after a failed attempt', () => {
    const answers = {};
    for (const q of mod.knowledgeCheck.questions) {
      answers[q.id] = q.correctIndex === 0 ? 1 : 0;
    }
    const grade = gradeKnowledgeCheck(mod.knowledgeCheck, answers);
    assert.equal(grade.passed, false);

    let progress = recordKnowledgeCheckResult(createEmptyProgress(), moduleId, grade);
    const queue = getRemediationQueue(progress);
    assert.ok(queue.length > 0);
    assert.ok(queue.every((item) => item.rationale && item.correctAnswer));
  });
});