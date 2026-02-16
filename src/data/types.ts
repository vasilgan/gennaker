export type ModuleId = 'crossing' | 'overtaking' | 'hierarchy' | 'night_lights';

export type Media = {
  kind: 'svg';
  src: string;
};

export type QuestionExplanation = {
  ruleRefs: string[];
  why: string;
  commonMistake?: string;
  realWorldAction?: string;
};

export type QuestionChoice = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  moduleId: ModuleId;
  prompt: string;
  choices: QuestionChoice[];
  correctChoiceId: string;
  explanation: QuestionExplanation;
  media?: Media;
};

export type LastResult = 'correct' | 'wrong';

export type QuestionProgress = {
  attempts: number;
  wrong: number;
  streakCorrect: number;
  dueAt: string;
  lastAnsweredAt?: string;
  lastResult?: LastResult;
};

export type UserState = {
  questionProgress: Record<string, QuestionProgress>;
  xp: number;
  badges: string[];
};
