import { describe, expect, it } from 'vitest';
import { QUESTIONS } from '../../data/questions';
import { UserState } from '../../data/types';
import { selectSessionQuestions } from '../session';

const emptyState: UserState = { questionProgress: {}, xp: 0, badges: [] };

describe('selectSessionQuestions', () => {
  it('prioritizes due questions then fills with new up to 5', () => {
    const now = new Date('2026-01-10T12:00:00.000Z');
    const state: UserState = {
      ...emptyState,
      questionProgress: {
        'crossing-1': { attempts: 1, wrong: 0, streakCorrect: 1, dueAt: '2026-01-09T10:00:00.000Z', lastResult: 'correct' },
        'overtaking-1': { attempts: 1, wrong: 1, streakCorrect: 0, dueAt: '2026-01-09T11:00:00.000Z', lastResult: 'wrong' }
      }
    };

    const session = selectSessionQuestions(QUESTIONS, state, now, 5);

    expect(session).toHaveLength(5);
    expect(session[0].id).toBe('crossing-1');
    expect(session[1].id).toBe('overtaking-1');
    expect(new Set(session.map((q) => q.id)).size).toBe(5);
  });

  it('uses only due questions when due count is greater than or equal sessionSize', () => {
    const now = new Date('2026-01-10T12:00:00.000Z');
    const dueIds = ['crossing-1', 'crossing-2', 'overtaking-1', 'hierarchy-1', 'night_lights-1', 'night_lights-2'];

    const progress = Object.fromEntries(
      dueIds.map((id, index) => [id, {
        attempts: 1,
        wrong: 0,
        streakCorrect: 1,
        dueAt: `2026-01-0${index + 1}T00:00:00.000Z`,
        lastResult: 'correct' as const
      }])
    );

    const state: UserState = { ...emptyState, questionProgress: progress };
    const session = selectSessionQuestions(QUESTIONS, state, now, 5);

    expect(session).toHaveLength(5);
    expect(session.every((q) => dueIds.includes(q.id))).toBe(true);
    expect(session.every((q) => Boolean(state.questionProgress[q.id]))).toBe(true);
  });

  it('falls back to upcoming nearest dueAt when there are no due and no new', () => {
    const now = new Date('2026-01-10T12:00:00.000Z');
    const progress = Object.fromEntries(
      QUESTIONS.map((q, index) => [q.id, {
        attempts: 1,
        wrong: 0,
        streakCorrect: 1,
        dueAt: `2026-01-${String(11 + index).padStart(2, '0')}T00:00:00.000Z`,
        lastResult: 'correct' as const
      }])
    );

    const state: UserState = { ...emptyState, questionProgress: progress };
    const session = selectSessionQuestions(QUESTIONS, state, now, 5);

    expect(session.map((q) => q.id)).toEqual(QUESTIONS.slice(0, 5).map((q) => q.id));
  });

  it('fills from upcoming by nearest dueAt order', () => {
    const now = new Date('2026-01-10T12:00:00.000Z');
    const subset = [
      QUESTIONS.find((q) => q.id === 'crossing-1')!,
      QUESTIONS.find((q) => q.id === 'overtaking-1')!,
      QUESTIONS.find((q) => q.id === 'hierarchy-1')!,
      QUESTIONS.find((q) => q.id === 'night_lights-1')!,
      QUESTIONS.find((q) => q.id === 'crossing-2')!
    ];

    const state: UserState = {
      ...emptyState,
      questionProgress: {
        'crossing-1': { attempts: 1, wrong: 0, streakCorrect: 1, dueAt: '2026-01-12T00:00:00.000Z', lastResult: 'correct' },
        'overtaking-1': { attempts: 1, wrong: 0, streakCorrect: 1, dueAt: '2026-01-11T00:00:00.000Z', lastResult: 'correct' },
        'hierarchy-1': { attempts: 1, wrong: 0, streakCorrect: 1, dueAt: '2026-01-15T00:00:00.000Z', lastResult: 'correct' },
        'night_lights-1': { attempts: 1, wrong: 0, streakCorrect: 1, dueAt: '2026-01-13T00:00:00.000Z', lastResult: 'correct' },
        'crossing-2': { attempts: 1, wrong: 0, streakCorrect: 1, dueAt: '2026-01-14T00:00:00.000Z', lastResult: 'correct' }
      }
    };

    const session = selectSessionQuestions(subset, state, now, 5);

    expect(session.map((q) => q.id)).toEqual([
      'overtaking-1',
      'crossing-1',
      'night_lights-1',
      'crossing-2',
      'hierarchy-1'
    ]);
  });

  it('does not duplicate a question when multiple new questions are in same module', () => {
    const now = new Date('2026-01-10T12:00:00.000Z');
    const onlyCrossingAndOvertaking = QUESTIONS.filter((q) => q.moduleId === 'crossing' || q.moduleId === 'overtaking');
    const session = selectSessionQuestions(onlyCrossingAndOvertaking, emptyState, now, 5);

    const ids = session.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('does not mutate source questions array', () => {
    const now = new Date('2026-01-10T12:00:00.000Z');
    const state: UserState = {
      ...emptyState,
      questionProgress: {
        'crossing-1': { attempts: 1, wrong: 0, streakCorrect: 1, dueAt: '2026-01-09T10:00:00.000Z', lastResult: 'correct' }
      }
    };

    const before = QUESTIONS.map((q) => q.id).join(',');
    selectSessionQuestions(QUESTIONS, state, now, 5);

    expect(QUESTIONS.map((q) => q.id).join(',')).toBe(before);
  });

  it('ignores dueAt if progress exists but attempts is zero', () => {
    const now = new Date('2026-01-10T12:00:00.000Z');
    const state: UserState = {
      ...emptyState,
      questionProgress: {
        'crossing-1': { attempts: 0, wrong: 0, streakCorrect: 0, dueAt: '2026-01-01T00:00:00.000Z' }
      }
    };

    const session = selectSessionQuestions(QUESTIONS, state, now, 5);
    expect(session[0].id).toBe('crossing-2');
  });
});
