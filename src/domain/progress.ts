import { ModuleId, Question, QuestionProgress, UserState } from '../data/types';

export type AnswerResult = {
  updated: QuestionProgress;
  xpDelta: number;
};

const HOURS_8 = 8 * 60 * 60 * 1000;
const HOURS_24 = 24 * 60 * 60 * 1000;
const DAYS_3 = 3 * 24 * 60 * 60 * 1000;
const DAYS_14 = 14 * 24 * 60 * 60 * 1000;

export const createEmptyUserState = (): UserState => ({
  questionProgress: {},
  xp: 0,
  badges: []
});

export const defaultProgress = (nowIso: string): QuestionProgress => ({
  attempts: 0,
  wrong: 0,
  streakCorrect: 0,
  dueAt: nowIso
});

export const evaluateAnswer = (
  current: QuestionProgress | undefined,
  isCorrect: boolean,
  now: Date
): AnswerResult => {
  const nowIso = now.toISOString();
  const base = current ?? defaultProgress(nowIso);
  const previousResult = base.lastResult;

  const updated: QuestionProgress = {
    ...base,
    attempts: base.attempts + 1,
    lastAnsweredAt: nowIso
  };

  if (isCorrect) {
    const streakCorrect = base.streakCorrect + 1;
    updated.streakCorrect = streakCorrect;
    updated.lastResult = 'correct';
    updated.dueAt = new Date(now.getTime() + (streakCorrect >= 3 ? DAYS_14 : DAYS_3)).toISOString();
    return { updated, xpDelta: 10 };
  }

  updated.streakCorrect = 0;
  updated.wrong = base.wrong + 1;
  updated.lastResult = 'wrong';
  updated.dueAt = new Date(now.getTime() + (previousResult === 'wrong' ? HOURS_8 : HOURS_24)).toISOString();
  return { updated, xpDelta: 2 };
};

export const getModuleConfidence = (
  moduleId: ModuleId,
  questions: Question[],
  state: UserState
): number | null => {
  const moduleQuestions = questions.filter((q) => q.moduleId === moduleId);
  const scores = moduleQuestions
    .map((q) => state.questionProgress[q.id])
    .filter((progress): progress is QuestionProgress => Boolean(progress) && progress.attempts > 0)
    .map((progress) => Math.max(0, 1 - progress.wrong / progress.attempts));

  if (scores.length === 0) {
    return null;
  }

  const average = scores.reduce((acc, value) => acc + value, 0) / scores.length;
  return Math.round(average * 100);
};

export const getModuleAttempts = (
  moduleId: ModuleId,
  questions: Question[],
  state: UserState
): number => questions
  .filter((q) => q.moduleId === moduleId)
  .reduce((sum, q) => sum + (state.questionProgress[q.id]?.attempts ?? 0), 0);

export const shouldAwardCoastalReady = (
  moduleIds: ModuleId[],
  questions: Question[],
  state: UserState
): boolean => {
  if (state.badges.includes('Coastal Ready')) {
    return false;
  }

  return moduleIds.every((moduleId) => {
    const attempts = getModuleAttempts(moduleId, questions, state);
    const confidence = getModuleConfidence(moduleId, questions, state);
    return attempts >= 5 && confidence !== null && confidence >= 75;
  });
};

export const countDueQuestions = (state: UserState, now: Date): number => Object.values(state.questionProgress)
  .filter((progress) => progress.attempts > 0 && new Date(progress.dueAt).getTime() <= now.getTime()).length;
