'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function fileExists(root, rel) {
  return fs.existsSync(path.join(root, rel));
}

function readFile(root, rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function runInTree(treeRoot, script) {
  const out = execSync('node -e ' + JSON.stringify(script), {
    cwd: treeRoot,
    encoding: 'utf8',
  });
  return JSON.parse(out.trim());
}

function countCurriculumStats(treeRoot) {
  return runInTree(
    treeRoot,
    "const { getAllModules } = require('./src/curriculum'); const mods = getAllModules(); console.log(JSON.stringify({ moduleCount: mods.length, lessonCount: mods.reduce((s,m)=>s+m.lessons.length,0), questionCount: mods.reduce((s,m)=>s+m.knowledgeCheck.questions.length,0) }));"
  );
}

function countFieldRef(treeRoot) {
  if (!fileExists(treeRoot, 'src/field-reference.js')) {
    return { fieldRefEntryCount: 0, hasDeploymentChecklist: false, hasTaxaFrequencyBands: false };
  }
  return runInTree(
    treeRoot,
    "const fr = require('./src/field-reference'); const entries = fr.getFieldReferenceEntries(); console.log(JSON.stringify({ fieldRefEntryCount: entries.length, hasDeploymentChecklist: fr.getDeploymentChecklist().length > 0, hasTaxaFrequencyBands: entries.some(e => e.category === 'taxa-frequency') }));"
  );
}

function countStudyPaths(treeRoot) {
  if (!fileExists(treeRoot, 'src/study-paths.js')) return 0;
  return runInTree(treeRoot, "const sp = require('./src/study-paths'); console.log(JSON.stringify(sp.getStudyPaths().length));");
}

/**
 * Measure observable practitioner capability flags from a companion tree.
 * Used for both historical baseline (git worktree) and current tree audits.
 */
function measureTreeProfile(treeRoot) {
  const resolved = path.resolve(treeRoot);
  const template = readFile(resolved, 'templates/index.template.html');
  const styles = readFile(resolved, 'styles/styles.css');
  const appJs = readFile(resolved, 'public/js/app.js');
  const progressJs = readFile(resolved, 'src/progress.js');
  const packageJson = JSON.parse(readFile(resolved, 'package.json'));

  const fieldRef = countFieldRef(resolved);
  const stats = countCurriculumStats(resolved);
  const studyPathCount = countStudyPaths(resolved);

  const hasRemediationModule = fileExists(resolved, 'src/remediation.js');
  const hasSearchModule = fileExists(resolved, 'src/search.js');

  return {
    version: packageJson.version,
    fieldRefEntryCount: fieldRef.fieldRefEntryCount,
    hasDeploymentChecklist: fieldRef.hasDeploymentChecklist,
    hasTaxaFrequencyBands: fieldRef.hasTaxaFrequencyBands,
    hasRemediationQueue:
      hasRemediationModule &&
      progressJs.includes('lastMissedQuestionIds') &&
      appJs.includes('getRemediationQueue'),
    hasCurriculumSearch:
      hasSearchModule && template.includes('curriculum-search') && appJs.includes('searchCurriculum'),
    hasStudyPaths:
      studyPathCount > 0 && template.includes('study-path-select') && appJs.includes('getStudyPaths'),
    studyPathCount,
    hasFieldSeasonMobileCss:
      styles.includes('.field-season-toolbar') && styles.includes('touch-action'),
    hasFileProtocolViable:
      template.includes('file-protocol-banner') || styles.includes('file-protocol-banner'),
    hasResponsiveBaseLayout: styles.includes('@media (max-width:'),
    hasImmediateQuizFeedback: appJs.includes('gradeKnowledgeCheck') && appJs.includes('quiz-feedback'),
    hasCatalogAndLevelFilter:
      template.includes('level-filter') && appJs.includes('activeLevelFilter'),
    ...stats,
  };
}

if (require.main === module) {
  const treeRoot = process.argv[2];
  if (!treeRoot) {
    console.error('usage: node measure-tree-profile.js <tree-root>');
    process.exit(1);
  }
  console.log(JSON.stringify(measureTreeProfile(treeRoot), null, 2));
}

module.exports = { measureTreeProfile, countCurriculumStats };