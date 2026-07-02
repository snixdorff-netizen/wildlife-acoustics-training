'use strict';

/**
 * Grade a knowledge check submission.
 * @param {object} knowledgeCheck - module knowledgeCheck object
 * @param {Record<string, number>} answers - map of questionId -> selected option index
 * @returns {{ score: number, passed: boolean, results: Array<{ questionId, correct, selectedIndex, correctIndex, rationale, prompt }> }}
 */
function gradeKnowledgeCheck(knowledgeCheck, answers) {
  const questions = knowledgeCheck.questions;
  const results = [];
  let correctCount = 0;

  for (const question of questions) {
    const selectedIndex = answers[question.id];
    const answered = selectedIndex !== undefined && selectedIndex !== null;
    const correct = answered && selectedIndex === question.correctIndex;

    if (correct) correctCount++;

    results.push({
      questionId: question.id,
      prompt: question.prompt,
      correct,
      selectedIndex: answered ? selectedIndex : null,
      correctIndex: question.correctIndex,
      rationale: question.rationale,
      feedback: correct
        ? 'Correct!'
        : answered
          ? `Incorrect. ${question.rationale}`
          : 'No answer selected.',
    });
  }

  const score = questions.length > 0 ? correctCount / questions.length : 0;
  const threshold = knowledgeCheck.passThreshold ?? 0.7;
  const passed = score >= threshold;

  return {
    score,
    correctCount,
    totalQuestions: questions.length,
    passThreshold: threshold,
    passed,
    results,
    summary: passed
      ? `Passed! You scored ${Math.round(score * 100)}% (${correctCount}/${questions.length}).`
      : `Not yet passed. You scored ${Math.round(score * 100)}% (${correctCount}/${questions.length}). Need ${Math.round(threshold * 100)}% to pass.`,
  };
}

module.exports = { gradeKnowledgeCheck };