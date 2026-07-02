'use strict';

const { getModuleById } = require('./curriculum');

const STUDY_PATHS = [
  {
    id: 'bat-surveyor',
    name: 'Bat Acoustic Surveyor',
    description: 'USFWS-aligned bat monitoring path.',
    moduleIds: ['intro-bioacoustics-novice', 'sm5-sm5bat-deep-dive', 'kscope-lite-bat-analysis', 'bat-auto-id', 'usfws-2026-bat-guidelines'],
  },
  {
    id: 'bird-biologist',
    name: 'Bird & Amphibian Biologist',
    description: 'Bird and amphibian acoustic workflows.',
    moduleIds: ['intro-bioacoustics-novice', 'kscope-birds-amphibians', 'kscope-lite-song-meter', 'frogs-toads-kscope', 'owls-nocturnal-birds'],
  },
  {
    id: 'field-tech',
    name: 'Field Technician',
    description: 'Song Meter deployment and Kaleidoscope Lite inventory.',
    moduleIds: ['intro-bioacoustics-novice', 'sm5-sm5bat-deep-dive', 'kscope-lite-song-meter', 'acoustic-analysis-kscope-part1'],
  },
  {
    id: 'advanced-analyst',
    name: 'Advanced Analyst',
    description: 'BirdNET, Bat Auto-ID, and batch processing.',
    moduleIds: ['acoustic-analysis-kscope-part1', 'bat-auto-id', 'birdnet-kscope-integration', 'frogs-toads-kscope'],
  },
];

function getStudyPaths() {
  return STUDY_PATHS.map((p) => ({ ...p, moduleCount: p.moduleIds.length }));
}

function getStudyPathById(pathId) {
  return STUDY_PATHS.find((p) => p.id === pathId) || null;
}

function getRecommendedModules(pathId) {
  const path = getStudyPathById(pathId);
  if (!path) return [];
  return path.moduleIds.map((id) => getModuleById(id)).filter(Boolean);
}

module.exports = { getStudyPaths, getStudyPathById, getRecommendedModules };