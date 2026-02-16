import { UserState } from '../data/types';

export interface UserStateStorage {
  load(): UserState | null;
  save(state: UserState): void;
}
