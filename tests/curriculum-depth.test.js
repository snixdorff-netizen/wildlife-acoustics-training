'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getAllModules } = require('../src/curriculum');

const MIN_LESSONS = 3;
const MIN_QUESTIONS = 3;
const MIN_PARAGRAPHS_PER_LESSON = 4;
const MIN_LESSON_CHARS = 400;

describe('curriculum depth', () => {
  it('each module has at least 3 lessons with substantive Academy-aligned content', () => {
    for (const mod of getAllModules()) {
      assert.ok(
        mod.lessons.length >= MIN_LESSONS,
        `${mod.id}: expected >= ${MIN_LESSONS} lessons, got ${mod.lessons.length}`
      );
      for (const lesson of mod.lessons) {
        const text = lesson.content.join(' ');
        assert.ok(
          lesson.content.length >= MIN_PARAGRAPHS_PER_LESSON,
          `${mod.id}/${lesson.id}: expected >= ${MIN_PARAGRAPHS_PER_LESSON} paragraphs`
        );
        assert.ok(
          text.length >= MIN_LESSON_CHARS,
          `${mod.id}/${lesson.id}: expected >= ${MIN_LESSON_CHARS} chars, got ${text.length}`
        );
      }
    }
  });

  it('each module has at least 3 knowledge-check questions with rationales', () => {
    for (const mod of getAllModules()) {
      const qs = mod.knowledgeCheck.questions;
      assert.ok(qs.length >= MIN_QUESTIONS, `${mod.id}: expected >= ${MIN_QUESTIONS} questions`);
      for (const q of qs) {
        assert.ok(q.rationale && q.rationale.length > 20, `${mod.id}/${q.id}: rationale too short`);
      }
    }
  });
});