'use strict';

const { getAllModules } = require('./curriculum');

function moduleSearchText(mod) {
  const lessonText = mod.lessons.map((l) => [l.title, ...(l.content || [])].join(' ')).join(' ');
  return [mod.title, mod.summary, mod.academyRef, lessonText].join(' ').toLowerCase();
}

function searchCurriculum(query, options = {}) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];

  const limit = options.limit ?? 20;
  const results = [];

  for (const mod of getAllModules()) {
    const matches = [];

    if (mod.title.toLowerCase().includes(q) || mod.summary.toLowerCase().includes(q)) {
      matches.push({ type: 'module', id: mod.id, title: mod.title, excerpt: mod.summary.slice(0, 120) });
    }

    for (const lesson of mod.lessons) {
      const hay = [lesson.title, ...(lesson.content || [])].join(' ').toLowerCase();
      if (hay.includes(q)) {
        const para = (lesson.content || []).find((p) => p.toLowerCase().includes(q));
        matches.push({
          type: 'lesson',
          id: lesson.id,
          title: lesson.title,
          excerpt: (para || lesson.content[0] || '').slice(0, 120),
        });
      }
    }

    if (matches.length) {
      results.push({ moduleId: mod.id, moduleTitle: mod.title, level: mod.level, matches });
    }
  }

  return results.slice(0, limit);
}

module.exports = { searchCurriculum, moduleSearchText };