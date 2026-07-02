import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { getModuleById } = require('../src/curriculum');
const { gradeKnowledgeCheck } = require('../src/quiz');

export const INTRO_MODULE_ID = 'intro-bioacoustics-novice';
export const SECOND_MODULE_ID = 'sm5-sm5bat-deep-dive';

export function getModule(moduleId) {
  const mod = getModuleById(moduleId);
  if (!mod) throw new Error(`Unknown module: ${moduleId}`);
  return mod;
}

/** Derive correct radio values from shipped curriculum — never hard-code indices. */
export function correctAnswersForModule(moduleId) {
  const mod = getModule(moduleId);
  return mod.knowledgeCheck.questions.map((q) => ({
    id: q.id,
    correctIndex: q.correctIndex,
  }));
}

export function expectedPassSummary(moduleId) {
  const mod = getModule(moduleId);
  const answers = Object.fromEntries(
    mod.knowledgeCheck.questions.map((q) => [q.id, q.correctIndex])
  );
  const result = gradeKnowledgeCheck(mod.knowledgeCheck, answers);
  return result.summary;
}

export async function markAllLessonsOnPage(page) {
  let marked = 0;
  for (;;) {
    const btn = page.locator('[data-complete-lesson]:not([disabled])').first();
    if ((await btn.count()) === 0) break;
    await btn.click();
    marked++;
  }
  return marked;
}

export async function fillQuizFromCurriculum(page, moduleId) {
  const answers = correctAnswersForModule(moduleId);
  for (const { id, correctIndex } of answers) {
    await page.locator(`input[name="q-${id}"][value="${correctIndex}"]`).check();
  }
  return answers.length;
}

export function fillQuizInDocument(document, moduleId) {
  const answers = correctAnswersForModule(moduleId);
  for (const { id, correctIndex } of answers) {
    const input = document.querySelector(`input[name="q-${id}"][value="${correctIndex}"]`);
    if (!input) throw new Error(`Missing input for ${id}`);
    input.checked = true;
  }
  return answers.length;
}

export function markAllLessonsInDocument(document) {
  let marked = 0;
  for (;;) {
    const btn = document.querySelector('[data-complete-lesson]:not([disabled])');
    if (!btn) break;
    btn.click();
    marked++;
  }
  return marked;
}