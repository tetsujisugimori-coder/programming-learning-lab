import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, chapters, languages } from '../src/curriculum.ts';

test('stable IDs, 13 goals and only chapter 1 has content', () => {
  assert.equal(chapters.length, 13);
  assert.equal(lessons.length, 8);
  assert.equal(chapters.filter(chapter => chapter.ready).length, 1);
  assert.equal(languages.length, 3);
  const ids = [...chapters.map(c => c.id), ...lessons.flatMap(l => [l.id, l.quiz.id, `${l.id}-prediction`, `${l.id}-practice`, ...[l.example?.id, l.solution?.id].filter(Boolean)])];
  assert.equal(new Set(ids).size, ids.length);
  for (const chapter of chapters) assert.ok(chapter.goal);
});

test('each lesson has one explicit check, feedback and staged help', () => {
  for (const lesson of lessons) {
    assert.equal(lesson.hints.length, 3);
    assert.equal(lesson.quiz.options.length, lesson.quiz.reasons.length);
    assert.ok(lesson.quiz.options[lesson.quiz.correct]);
    assert.ok(lesson.quiz.hint && lesson.prediction && lesson.practice && lesson.verify);
  }
  assert.equal(lessons.filter(l => l.pc).length, 6);
  assert.equal(lessons.filter(l => l.example?.error).length, 1);
});
