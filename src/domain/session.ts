import { MODULE_ORDER } from '../data/moduleOrder';
import { Question, UserState } from '../data/types';

const getDueTime = (questionId: string, state: UserState): number => {
  const dueAt = state.questionProgress[questionId]?.dueAt;
  return dueAt ? new Date(dueAt).getTime() : Number.POSITIVE_INFINITY;
};

const byOldestDue = (a: Question, b: Question, state: UserState): number => getDueTime(a.id, state) - getDueTime(b.id, state);

export const selectSessionQuestions = (
  questions: Question[],
  state: UserState,
  now: Date,
  sessionSize = 5
): Question[] => {
  const selected: Question[] = [];
  const used = new Set<string>();

  const due = questions
    .filter((q) => {
      const p = state.questionProgress[q.id];
      return p && p.attempts > 0 && new Date(p.dueAt).getTime() <= now.getTime();
    })
    .sort((a, b) => byOldestDue(a, b, state));

  for (const q of due) {
    if (selected.length >= sessionSize) break;
    selected.push(q);
    used.add(q.id);
  }

  if (selected.length < sessionSize) {
    const questionModules = Array.from(new Set(questions.map((q) => q.moduleId)));
    const modules = [...MODULE_ORDER, ...questionModules.filter((moduleId) => !MODULE_ORDER.includes(moduleId))];
    const newQuestions = questions.filter((q) => !state.questionProgress[q.id] && !used.has(q.id));

    for (const moduleId of modules) {
      if (selected.length >= sessionSize) break;
      const candidate = newQuestions.find((q) => q.moduleId === moduleId);
      if (candidate) {
        selected.push(candidate);
        used.add(candidate.id);
      }
    }

    for (const q of newQuestions) {
      if (selected.length >= sessionSize) break;
      if (!used.has(q.id)) {
        selected.push(q);
        used.add(q.id);
      }
    }
  }

  if (selected.length < sessionSize) {
    const upcoming = questions
      .filter((q) => {
        const p = state.questionProgress[q.id];
        return p && p.attempts > 0 && new Date(p.dueAt).getTime() > now.getTime() && !used.has(q.id);
      })
      .sort((a, b) => byOldestDue(a, b, state));

    for (const q of upcoming) {
      if (selected.length >= sessionSize) break;
      selected.push(q);
      used.add(q.id);
    }
  }

  return selected.slice(0, sessionSize);
};
