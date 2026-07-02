'use strict';

/** Curriculum query API — mirrors Wildlife Acoustics Academy track/module structure. */
const { LEVELS, TRACKS, MODULES } = require('./curriculum-data');

function getTracks() {
  return TRACKS.map((track) => ({
    ...track,
    moduleCount: track.modules.length,
  }));
}

function getTrackById(trackId) {
  return TRACKS.find((t) => t.id === trackId) || null;
}

function getModuleById(moduleId) {
  return MODULES[moduleId] || null;
}

function getModulesForTrack(trackId) {
  const track = getTrackById(trackId);
  if (!track) return [];
  return track.modules.map((id) => MODULES[id]).filter(Boolean);
}

function getAllModules() {
  return Object.values(MODULES);
}

function filterModulesByLevel(level) {
  if (!LEVELS.includes(level)) return [];
  return getAllModules().filter((m) => m.level === level);
}

function getCurriculumAudit() {
  const categories = {
    'bioacoustics-fundamentals': 'bioacoustics-fundamentals',
    'song-meter-hardware': 'song-meter-hardware',
    'kaleidoscope-analysis': 'kaleidoscope-analysis',
    'species-applications': 'species-applications',
    'regulatory-guidelines': 'regulatory-guidelines',
  };

  const lines = ['Wildlife Acoustics Academy Curriculum Audit', '============================================', ''];

  for (const track of TRACKS) {
    lines.push(`Track: ${track.name} (${track.id})`);
    for (const moduleId of track.modules) {
      const mod = MODULES[moduleId];
      if (mod) {
        lines.push(`  - [${mod.level}] ${mod.title} (${mod.id})`);
        lines.push(`    Lessons: ${mod.lessons.length}, Questions: ${mod.knowledgeCheck.questions.length}`);
      }
    }
    lines.push('');
  }

  lines.push('Category coverage check:');
  for (const [label, trackId] of Object.entries(categories)) {
    const count = getModulesForTrack(trackId).length;
    lines.push(`  ${label}: ${count} module(s)`);
  }

  lines.push('');
  lines.push(`Total modules: ${getAllModules().length}`);
  lines.push(`Levels used: ${LEVELS.join(', ')}`);

  return lines.join('\n');
}

function validateCurriculumCoverage() {
  const requiredTracks = [
    'bioacoustics-fundamentals',
    'song-meter-hardware',
    'kaleidoscope-analysis',
    'species-applications',
    'regulatory-guidelines',
  ];

  const errors = [];

  for (const trackId of requiredTracks) {
    const modules = getModulesForTrack(trackId);
    if (modules.length < 1) {
      errors.push(`Track "${trackId}" has no modules`);
    }
  }

  for (const level of LEVELS) {
    const atLevel = filterModulesByLevel(level);
    if (atLevel.length < 1) {
      errors.push(`No modules tagged with level "${level}"`);
    }
  }

  for (const mod of getAllModules()) {
    if (!LEVELS.includes(mod.level)) {
      errors.push(`Module ${mod.id} has invalid level: ${mod.level}`);
    }
    if (!mod.lessons || mod.lessons.length < 3) {
      errors.push(`Module ${mod.id} needs at least 3 lessons`);
    }
    if (!mod.knowledgeCheck || mod.knowledgeCheck.questions.length < 3) {
      errors.push(`Module ${mod.id} needs at least 3 knowledge-check questions`);
    }
    for (const q of mod.knowledgeCheck.questions) {
      if (q.correctIndex < 0 || q.correctIndex >= q.options.length) {
        errors.push(`Module ${mod.id} question ${q.id} has invalid correctIndex`);
      }
      if (!q.rationale) {
        errors.push(`Module ${mod.id} question ${q.id} missing rationale`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  LEVELS,
  TRACKS,
  MODULES,
  getTracks,
  getTrackById,
  getModuleById,
  getModulesForTrack,
  getAllModules,
  filterModulesByLevel,
  getCurriculumAudit,
  validateCurriculumCoverage,
};