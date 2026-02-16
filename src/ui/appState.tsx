import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';
import { QUESTIONS } from '../data/questions';
import { UserState } from '../data/types';
import { evaluateAnswer, shouldAwardCoastalReady } from '../domain/progress';
import { LocalStorageAdapter } from '../storage/localStorageAdapter';

const storage = new LocalStorageAdapter();

type AppStateContextValue = {
  userState: UserState;
  answerQuestion: (questionId: string, isCorrect: boolean) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export const AppStateProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [userState, setUserState] = useState<UserState>(() => storage.load());

  const value = useMemo<AppStateContextValue>(() => ({
    userState,
    answerQuestion: (questionId, isCorrect) => {
      setUserState((prev) => {
        const now = new Date();
        const result = evaluateAnswer(prev.questionProgress[questionId], isCorrect, now);
        const next: UserState = {
          ...prev,
          xp: prev.xp + result.xpDelta,
          questionProgress: {
            ...prev.questionProgress,
            [questionId]: result.updated
          }
        };

        if (shouldAwardCoastalReady(['crossing', 'overtaking', 'hierarchy', 'night_lights'], QUESTIONS, next)) {
          next.badges = [...next.badges, 'Coastal Ready'];
        }

        storage.save(next);
        return next;
      });
    }
  }), [userState]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = (): AppStateContextValue => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return context;
};
