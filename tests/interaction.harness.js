'use strict';

/**
 * End-to-end logic harness: fresh state → answer quiz → verify progress.
 * Run: node tests/interaction.harness.js
 */

const { getModuleById } = require('../src/curriculum');
const { gradeKnowledgeCheck } = require('../src/quiz');
const {
  createEmptyProgress,
  markLessonComplete,
  recordKnowledgeCheckResult,
  getModuleProgress,
} = require('../src/progress');

const moduleId = 'intro-bioacoustics-novice';
const mod = getModuleById(moduleId);

console.log('=== Interaction Harness ===');
console.log(`Module: ${mod.title}`);

let progress = createEmptyProgress();
console.log('Initial progress:', getModuleProgress(progress, moduleId));

for (const lesson of mod.lessons) {
  progress = markLessonComplete(progress, moduleId, lesson.id);
  console.log(`Marked lesson complete: ${lesson.title}`);
}

const answers = { q1: 1, q2: 1, q3: 2, q4: 2 };
const result = gradeKnowledgeCheck(mod.knowledgeCheck, answers);

console.log('\nQuiz result:');
console.log(`  Summary: ${result.summary}`);
console.log(`  Score: ${result.score} (${result.correctCount}/${result.totalQuestions})`);
console.log(`  Passed: ${result.passed}`);

for (const r of result.results) {
  console.log(`  [${r.correct ? 'OK' : 'FAIL'}] ${r.questionId}: ${r.feedback}`);
}

progress = recordKnowledgeCheckResult(progress, moduleId, result);
const final = getModuleProgress(progress, moduleId);

console.log('\nFinal module progress:');
console.log(`  Lessons: ${final.lessonsComplete}/${final.lessonTotal}`);
console.log(`  Knowledge check passed: ${final.knowledgeCheckPassed}`);
console.log(`  Module complete: ${final.moduleComplete}`);
console.log('=== Harness complete ===');