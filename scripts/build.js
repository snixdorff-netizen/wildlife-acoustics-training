'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const templatePath = path.join(root, 'templates', 'index.template.html');
const indexPath = path.join(publicDir, 'index.html');
const cssPath = path.join(root, 'styles', 'styles.css');
const watCorePath = path.join(publicDir, 'js', 'wat-core.js');
const legacyCssDir = path.join(publicDir, 'css');

function readSrc(name) {
  return fs.readFileSync(path.join(root, 'src', name), 'utf8');
}

function wrapModule(id, source, requireIds) {
  const requireFns = requireIds
    .map((rid) => `var ${rid.replace(/[^a-z0-9]/gi, '_')} = require('${rid}');`)
    .join('\n    ');

  const body = source
    .replace(/^'use strict';\s*/m, '')
    .replace(/require\(['"]\.\/curriculum-data['"]\)/g, "require('curriculum-data')")
    .replace(/require\(['"]\.\/curriculum['"]\)/g, "require('curriculum')")
    .replace(/module\.exports\s*=\s*/, 'return ');

  return `
  register('${id}', function (require) {
    ${requireFns}
    ${body}
  });`;
}

function bundleWatCore() {
  const files = {
    'curriculum-data': { src: readSrc('curriculum-data.js'), deps: [] },
    curriculum: { src: readSrc('curriculum.js'), deps: ['curriculum-data'] },
    quiz: { src: readSrc('quiz.js'), deps: [] },
    progress: { src: readSrc('progress.js'), deps: ['curriculum-data'] },
    'field-reference': { src: readSrc('field-reference.js'), deps: [] },
    search: { src: readSrc('search.js'), deps: ['curriculum'] },
    'study-paths': { src: readSrc('study-paths.js'), deps: ['curriculum'] },
    remediation: { src: readSrc('remediation.js'), deps: ['curriculum-data'] },
  };

  const moduleBlocks = Object.entries(files)
    .map(([id, { src, deps }]) => wrapModule(id, src, deps))
    .join('\n');

  const bundle = `/* Wildlife Acoustics Training — browser bundle (auto-generated; do not edit) */
(function (global) {
  'use strict';

  const __modules = {};

  function register(id, factory) {
    __modules[id] = factory;
  }

  function require(id) {
    if (!__modules[id]) throw new Error('Module not found: ' + id);
    if (!require.cache[id]) {
      require.cache[id] = __modules[id](require);
    }
    return require.cache[id];
  }
  require.cache = {};

  ${moduleBlocks}

  const curriculum = require('curriculum');
  const quiz = require('quiz');
  const progress = require('progress');
  const fieldReference = require('field-reference');
  const search = require('search');
  const studyPaths = require('study-paths');
  const remediation = require('remediation');

  global.WAT = Object.assign({}, curriculum, quiz, progress, fieldReference, search, studyPaths, remediation);
})(typeof window !== 'undefined' ? window : globalThis);
`;

  fs.writeFileSync(watCorePath, bundle);

  const merged = Object.assign(
    {},
    require(path.join(root, 'src', 'curriculum')),
    require(path.join(root, 'src', 'quiz')),
    require(path.join(root, 'src', 'progress')),
    require(path.join(root, 'src', 'field-reference')),
    require(path.join(root, 'src', 'search')),
    require(path.join(root, 'src', 'study-paths')),
    require(path.join(root, 'src', 'remediation'))
  );
  if (!merged.getTracks || !merged.searchCurriculum || !merged.getRemediationQueue) {
    throw new Error('Source modules missing expected exports');
  }

  console.log('Wrote', watCorePath);
}

function buildIndexHtml() {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Missing template: ${templatePath}`);
  }
  const template = fs.readFileSync(templatePath, 'utf8');
  if (!template.includes('/* INLINE_STYLES */')) {
    throw new Error('Template missing INLINE_STYLES placeholder — use templates/index.template.html');
  }
  const css = fs.readFileSync(cssPath, 'utf8');
  const built = template.replace('/* INLINE_STYLES */', css);
  fs.writeFileSync(indexPath, built);

  if (built.includes('href="css/') || built.includes("href='css/")) {
    throw new Error('Built index.html must not reference external css/ — styles must be inlined');
  }
  if (!built.includes('--wa-green-dark')) {
    throw new Error('Built index.html missing inlined styles');
  }

  console.log('Wrote', indexPath, '(CSS inlined; sole browser entry)');
}

const BUILT_ARTIFACTS = [indexPath, watCorePath];

function cleanPublicArtifacts() {
  for (const artifact of BUILT_ARTIFACTS) {
    if (fs.existsSync(artifact)) {
      fs.unlinkSync(artifact);
      console.log('cleanPublicArtifacts: removed', path.relative(root, artifact));
    }
  }
  if (fs.existsSync(legacyCssDir)) {
    fs.rmSync(legacyCssDir, { recursive: true, force: true });
    console.log('Removed legacy public/css/ (styles live in styles/styles.css)');
  }
}

function buildAll() {
  cleanPublicArtifacts();
  bundleWatCore();
  buildIndexHtml();
}

if (require.main === module) {
  buildAll();
} else {
  module.exports = { cleanPublicArtifacts, bundleWatCore, buildIndexHtml, buildAll, BUILT_ARTIFACTS };
}