'use strict';

const { TRACKS, MODULES } = require('./curriculum-data');

const STORAGE_KEY = 'wat-progress-v1';

function createEmptyProgress() {
  return {
    version: 1,
    completedLessons: {},
    knowledgeChecks: {},
    lastUpdated: null,
  };
}

/**
 * Merge a lesson completion into progress state.
 */
function markLessonComplete(progress, moduleId, lessonId) {
  const next = {
    ...progress,
    completedLessons: { ...progress.completedLessons },
    lastUpdated: new Date().toISOString(),
  };

  if (!next.completedLessons[moduleId]) {
    next.completedLessons[moduleId] = [];
  }

  if (!next.completedLessons[moduleId].includes(lessonId)) {
    next.completedLessons[moduleId] = [...next.completedLessons[moduleId], lessonId];
  }

  return next;
}

/**
 * Record a knowledge-check attempt result.
 */
function recordKnowledgeCheckResult(progress, moduleId, result) {
  const next = {
    ...progress,
    knowledgeChecks: { ...progress.knowledgeChecks },
    lastUpdated: new Date().toISOString(),
  };

  const existing = next.knowledgeChecks[moduleId];
  const bestScore = existing ? Math.max(existing.bestScore, result.score) : result.score;
  const lastMissedQuestionIds = (result.results || []).filter((r) => !r.correct).map((r) => r.questionId);

  next.knowledgeChecks[moduleId] = {
    passed: existing?.passed || result.passed,
    bestScore,
    lastScore: result.score,
    lastAttempt: new Date().toISOString(),
    attempts: (existing?.attempts ?? 0) + 1,
    lastMissedQuestionIds: result.passed ? [] : lastMissedQuestionIds,
  };

  return next;
}

function getModuleProgress(progress, moduleId) {
  const mod = MODULES[moduleId];
  if (!mod) return null;

  const completedLessonIds = progress.completedLessons[moduleId] ?? [];
  const lessonTotal = mod.lessons.length;
  const lessonsComplete = completedLessonIds.length;
  const lessonsPercent = lessonTotal > 0 ? lessonsComplete / lessonTotal : 0;

  const kc = progress.knowledgeChecks[moduleId];
  const kcPassed = kc?.passed ?? false;
  const kcBestScore = kc?.bestScore ?? 0;

  const moduleComplete = lessonsComplete >= lessonTotal && kcPassed;

  return {
    moduleId,
    lessonsComplete,
    lessonTotal,
    lessonsPercent,
    knowledgeCheckPassed: kcPassed,
    knowledgeCheckBestScore: kcBestScore,
    moduleComplete,
    overallPercent: moduleComplete ? 1 : (lessonsPercent * 0.5 + (kcPassed ? 0.5 : kcBestScore * 0.5)),
  };
}

function getTrackProgress(progress, trackId) {
  const track = TRACKS.find((t) => t.id === trackId);
  if (!track) return null;

  const moduleProgress = track.modules.map((id) => getModuleProgress(progress, id)).filter(Boolean);
  const completed = moduleProgress.filter((m) => m.moduleComplete).length;
  const total = moduleProgress.length;
  const percent = total > 0 ? completed / total : 0;

  return {
    trackId,
    trackName: track.name,
    modulesComplete: completed,
    moduleTotal: total,
    percentComplete: percent,
    modules: moduleProgress,
  };
}

function getOverallProgress(progress) {
  const trackSummaries = TRACKS.map((t) => getTrackProgress(progress, t.id));
  const totalModules = trackSummaries.reduce((sum, t) => sum + t.moduleTotal, 0);
  const completedModules = trackSummaries.reduce((sum, t) => sum + t.modulesComplete, 0);
  const percentComplete = totalModules > 0 ? completedModules / totalModules : 0;

  return {
    tracks: trackSummaries,
    totalModules,
    completedModules,
    percentComplete,
  };
}

function serializeProgress(progress) {
  return JSON.stringify(progress);
}

function deserializeProgress(json) {
  if (!json) return createEmptyProgress();
  try {
    const parsed = JSON.parse(json);
    return {
      ...createEmptyProgress(),
      ...parsed,
      completedLessons: parsed.completedLessons ?? {},
      knowledgeChecks: parsed.knowledgeChecks ?? {},
    };
  } catch {
    return createEmptyProgress();
  }
}

module.exports = {
  STORAGE_KEY,
  createEmptyProgress,
  markLessonComplete,
  recordKnowledgeCheckResult,
  getModuleProgress,
  getTrackProgress,
  getOverallProgress,
  serializeProgress,
  deserializeProgress,
};