'use strict';

const { MODULES } = require('./curriculum-data');

function getRemediationQueue(progress) {
  const items = [];

  for (const [moduleId, kc] of Object.entries(progress.knowledgeChecks || {})) {
    if (kc.passed) continue;

    const missedIds = kc.lastMissedQuestionIds || [];
    const mod = MODULES[moduleId];
    if (!mod) continue;

    for (const questionId of missedIds) {
      const question = mod.knowledgeCheck.questions.find((q) => q.id === questionId);
      if (!question) continue;

      items.push({
        moduleId,
        moduleTitle: mod.title,
        questionId: question.id,
        prompt: question.prompt,
        rationale: question.rationale,
        correctAnswer: question.options[question.correctIndex],
      });
    }
  }

  return items;
}

module.exports = { getRemediationQueue };