'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function loadAppWithoutWat(html, fileUrl) {
  const dom = new JSDOM(html, {
    url: fileUrl,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });
  dom.window.eval(fs.readFileSync(path.join(root, 'public', 'js', 'app.js'), 'utf8'));
  return dom;
}

describe('app.js file:// error handling', () => {
  it('template shows build-required notice when opened before build', () => {
    const template = fs.readFileSync(path.join(root, 'templates', 'index.template.html'), 'utf8');
    const dom = new JSDOM(template, {
      url: 'file:///test/templates/index.template.html',
      runScripts: 'dangerously',
      pretendToBeVisual: true,
    });

    const notice = dom.window.document.getElementById('build-required-notice');
    assert.ok(notice, 'build-required notice exists');
    assert.equal(notice.hidden, false, 'notice visible when INLINE_STYLES placeholder remains');
    assert.ok(dom.window.document.querySelector('header.site-header').hidden, 'header hidden on unbuilt template');
    assert.ok(dom.window.document.getElementById('app-main').hidden, 'main hidden on unbuilt template');
  });

  it('template without wat-core still surfaces file:// setup help when guard bypassed', () => {
    const template = fs.readFileSync(path.join(root, 'templates', 'index.template.html'), 'utf8');
    const dom = loadAppWithoutWat(template, 'file:///test/templates/index.template.html');
    assert.equal(typeof dom.window.WAT, 'undefined');
    const banner = dom.window.document.getElementById('file-protocol-banner');
    assert.ok(banner, 'banner exists in template shell');
    assert.ok(!banner.classList.contains('view-hidden'), 'banner shown when WAT missing on file://');
    assert.ok(
      dom.window.document.getElementById('app-main')?.innerHTML.includes('failed to load'),
      'error in app-main not full body wipe'
    );
  });

  it('built index without wat-core.js preserves banner and header on file://', () => {
    const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
    const withoutCore = html.replace('<script src="js/wat-core.js"></script>', '');
    const dom = loadAppWithoutWat(withoutCore, 'file:///test/public/index.html');

    const banner = dom.window.document.getElementById('file-protocol-banner');
    assert.ok(banner, 'banner element exists');
    assert.ok(!banner.classList.contains('view-hidden'), 'banner visible');
    assert.match(banner.textContent, /wat-core\.js/i);

    const main = dom.window.document.getElementById('app-main');
    assert.ok(main && main.innerHTML.includes('failed to load'), 'error in main');
    assert.ok(dom.window.document.querySelector('header.site-header'), 'header preserved');

    assert.ok(html.includes('--wa-green-dark'), 'built index ships inlined theme CSS');
    assert.ok(!html.includes('href="css/'), 'no external stylesheet dependency');
  });

  it('missing wat-core file on disk scenario uses broken script src', () => {
    const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8').replace(
      'js/wat-core.js',
      'js/wat-core-MISSING.js'
    );
    const dom = loadAppWithoutWat(html, 'file:///test/public/index-broken.html');
    assert.equal(typeof dom.window.WAT, 'undefined');
    assert.ok(!dom.window.document.getElementById('file-protocol-banner').classList.contains('view-hidden'));
  });
});