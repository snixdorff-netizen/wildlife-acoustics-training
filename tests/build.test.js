'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

describe('build outputs', () => {
  it('template is build input only — not a styled browser entry', () => {
    const template = fs.readFileSync(path.join(root, 'templates', 'index.template.html'), 'utf8');
    assert.ok(template.includes('/* INLINE_STYLES */'), 'template retains placeholder');
    assert.ok(!template.includes('--wa-green-dark'), 'template has no inlined theme tokens');
    assert.ok(template.includes('fieldref'), 'template includes field reference nav');
    assert.ok(template.includes('curriculum-search'), 'template includes search toolbar');
  });

  it('built public/index.html is the sole styled entry', () => {
    const built = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
    assert.ok(built.includes('--wa-green-dark'), 'built index has inlined CSS');
    assert.ok(!built.includes('href="css/'), 'no external css link');
    assert.ok(!built.includes('/* INLINE_STYLES */'), 'placeholder replaced');
    assert.ok(!built.includes('echoes-playtest'), 'no out-of-scope echoes bridge in training entry');
  });

  it('public/css/ is not shipped', () => {
    assert.equal(fs.existsSync(path.join(root, 'public', 'css')), false);
  });

  it('styles source lives outside public/', () => {
    const css = fs.readFileSync(path.join(root, 'styles', 'styles.css'), 'utf8');
    assert.ok(css.includes('.field-season-toolbar'), 'field-season mobile CSS present');
    assert.ok(css.includes('touch-action'), 'touch-friendly styles present');
  });
});