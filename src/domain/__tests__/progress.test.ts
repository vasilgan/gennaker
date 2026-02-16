import { describe, expect, it } from 'vitest';
import { countDueQuestions, evaluateAnswer } from '../progress';

describe('evaluateAnswer', () => {
  it('sets dueAt +3 days for correct answer by default', () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    const result = evaluateAnswer(undefined, true, now);

    expect(result.updated.dueAt).toBe('2026-01-04T00:00:00.000Z');
  });

  it('sets dueAt +8 hours for two wrong in a row', () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    const result = evaluateAnswer({
      attempts: 1,
      wrong: 1,
      streakCorrect: 0,
      dueAt: now.toISOString(),
      lastResult: 'wrong'
    }, false, now);

    expect(result.updated.dueAt).toBe('2026-01-01T08:00:00.000Z');
  });

  it('uses previous lastResult before update: wrong after correct gets +24 hours', () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    const result = evaluateAnswer({
      attempts: 2,
      wrong: 1,
      streakCorrect: 0,
      dueAt: now.toISOString(),
      lastResult: 'correct'
    }, false, now);

    expect(result.updated.dueAt).toBe('2026-01-02T00:00:00.000Z');
    expect(result.updated.lastResult).toBe('wrong');
  });

  it('sets dueAt +14 days when streakCorrect reaches 3', () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    const result = evaluateAnswer({
      attempts: 2,
      wrong: 0,
      streakCorrect: 2,
      dueAt: now.toISOString(),
      lastResult: 'correct'
    }, true, now);

    expect(result.updated.dueAt).toBe('2026-01-15T00:00:00.000Z');
  });

  it('sets lastAnsweredAt and increments attempts', () => {
    const now = new Date('2026-01-01T10:00:00.000Z');
    const result = evaluateAnswer(undefined, false, now);

    expect(result.updated.lastAnsweredAt).toBe('2026-01-01T10:00:00.000Z');
    expect(result.updated.attempts).toBe(1);
  });

  it('increments wrong and resets streakCorrect on wrong', () => {
    const now = new Date('2026-01-01T10:00:00.000Z');
    const result = evaluateAnswer({
      attempts: 3,
      wrong: 1,
      streakCorrect: 2,
      dueAt: now.toISOString(),
      lastResult: 'correct'
    }, false, now);

    expect(result.updated.wrong).toBe(2);
    expect(result.updated.streakCorrect).toBe(0);
  });

  it('sets streakCorrect to 1 and dueAt +3 days on correct after previous wrong', () => {
    const now = new Date('2026-01-01T10:00:00.000Z');
    const result = evaluateAnswer({
      attempts: 3,
      wrong: 2,
      streakCorrect: 0,
      dueAt: now.toISOString(),
      lastResult: 'wrong'
    }, true, now);

    expect(result.updated.streakCorrect).toBe(1);
    expect(result.updated.dueAt).toBe('2026-01-04T10:00:00.000Z');
  });

  it('does not mutate the input progress object', () => {
    const now = new Date('2026-01-01T10:00:00.000Z');
    const input = {
      attempts: 3,
      wrong: 2,
      streakCorrect: 1,
      dueAt: now.toISOString(),
      lastResult: 'correct' as const
    };

    const snapshot = JSON.stringify(input);
    evaluateAnswer(input, false, now);

    expect(JSON.stringify(input)).toBe(snapshot);
  });
});

describe('countDueQuestions', () => {
  it('counts only attempted questions that are due', () => {
    const now = new Date('2026-01-10T10:00:00.000Z');
    const count = countDueQuestions({
      xp: 0,
      badges: [],
      questionProgress: {
        a: { attempts: 0, wrong: 0, streakCorrect: 0, dueAt: '2026-01-09T10:00:00.000Z' },
        b: { attempts: 1, wrong: 0, streakCorrect: 1, dueAt: '2026-01-09T10:00:00.000Z' },
        c: { attempts: 2, wrong: 1, streakCorrect: 0, dueAt: '2026-01-11T10:00:00.000Z' }
      }
    }, now);

    expect(count).toBe(1);
  });
});
