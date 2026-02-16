import { UserState } from '../data/types';
import { createEmptyUserState } from '../domain/progress';
import { UserStateStorage } from './userStateStorage';

const STORAGE_KEY = 'colreg-trainer-user-state-v1';

export class LocalStorageAdapter implements UserStateStorage {
  load(): UserState {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createEmptyUserState();
    }

    try {
      const parsed = JSON.parse(raw) as UserState;
      return {
        questionProgress: parsed.questionProgress ?? {},
        xp: parsed.xp ?? 0,
        badges: parsed.badges ?? []
      };
    } catch {
      return createEmptyUserState();
    }
  }

  save(state: UserState): void {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}
